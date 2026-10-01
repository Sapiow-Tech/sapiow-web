"use client";
import { useGetStreamCall } from "@/api/call/useCall";
import { useCallStore } from "@/store/useCall";
import {
  CallingState,
  ParticipantView,
  StreamCall,
  StreamVideo,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { MicOff, Users, VideoOff, WifiOff } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CallEndedScreen, ErrorScreen, LoadingScreen } from "./components";
import { useVideoCallSimple } from "./hooks";

interface VideoConsultationUIProps {
  onClose?: () => void;
}

export default function VideoConsultationUI({
  onClose,
}: VideoConsultationUIProps) {
  const { appointmentId, setCallData } = useCallStore();
  const hasSetCallDataRef = useRef(false);

  const {
    data: streamData,
    isLoading: isLoadingStreamData,
    error: streamError,
  } = useGetStreamCall(appointmentId || undefined);

  const {
    client,
    call,
    error,
    isConnecting,
    isEndingCall,
    endCall,
    handleRetry,
  } = useVideoCallSimple();

  // Reset first-load guard when switching appointment
  useEffect(() => {
    hasSetCallDataRef.current = false;
  }, [appointmentId]);

  // Only write call data on first successful load so a refetch cannot rewrite the token mid-call
  useEffect(() => {
    if (hasSetCallDataRef.current) return;

    if (
      streamData &&
      (streamData.proStreamUser || streamData.patientStreamUser)
    ) {
      setCallData(streamData as any);
      hasSetCallDataRef.current = true;
    }
  }, [streamData, setCallData]);

  if (error) {
    return (
      <ErrorScreen
        error={error}
        isConnecting={isConnecting}
        onRetry={handleRetry}
      />
    );
  }

  if (streamError) {
    console.error("Erreur API Stream:", streamError);
  }

  if (isLoadingStreamData && appointmentId) {
    return (
      <LoadingScreen
        message="Récupération des données d'appel..."
        subtitle="Connexion à l'API"
      />
    );
  }

  if (!client || !call || isConnecting) {
    return (
      <LoadingScreen
        message={!isConnecting ? "Connexion en cours..." : "Initialisation..."}
        subtitle="Veuillez patienter"
      />
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CustomVideoCallLayout
          onEndCall={endCall}
          isEndingCall={isEndingCall}
          onClose={onClose}
        />
      </StreamCall>
    </StreamVideo>
  );
}

interface CustomVideoCallLayoutProps {
  onEndCall: () => Promise<void>;
  isEndingCall: boolean;
  onClose?: () => void;
}

export const CustomVideoCallLayout = ({
  onEndCall,
  isEndingCall,
  onClose,
}: CustomVideoCallLayoutProps) => {
  const call = useCall();
  const {
    useParticipants,
    useCallCallingState,
    useCallSession,
    useMicrophoneState,
    useCameraState,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const session = useCallSession();
  const { microphone, isMute } = useMicrophoneState();
  const { camera, isMute: isCameraOff } = useCameraState();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isRejoining, setIsRejoining] = useState(false);

  const duration = useMemo(() => {
    if (!session?.live_started_at) return 0;
    const liveStartTime = new Date(session.live_started_at);
    return Math.floor((currentTime - liveStartTime.getTime()) / 1000);
  }, [session?.live_started_at, currentTime]);

  useEffect(() => {
    if (!session?.live_started_at) return;
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [session?.live_started_at]);

  const { localParticipant, remoteParticipant } = useMemo(() => {
    const local = participants.find((p) => p.isLocalParticipant);
    const remote = participants.find((p) => !p.isLocalParticipant);
    return { localParticipant: local, remoteParticipant: remote };
  }, [participants]);

  const formatDuration = useCallback((durationInSec: number) => {
    const safeDuration = Math.max(0, Math.floor(durationInSec));
    const minutes = Math.floor(safeDuration / 60);
    const seconds = safeDuration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handleToggleMicrophone = useCallback(() => {
    microphone.toggle();
  }, [microphone]);

  const handleToggleCamera = useCallback(() => {
    camera.toggle();
  }, [camera]);

  const handleEndCall = useCallback(async () => {
    await onEndCall();
    onClose?.();
  }, [onEndCall, onClose]);

  const handleRejoin = useCallback(async () => {
    if (!call || isRejoining) return;
    try {
      setIsRejoining(true);
      await call.join({ create: true });
    } catch (err) {
      console.error("Erreur lors de la reconnexion:", err);
    } finally {
      setIsRejoining(false);
    }
  }, [call, isRejoining]);

  const isReconnecting =
    callingState === CallingState.RECONNECTING ||
    callingState === CallingState.MIGRATING ||
    callingState === CallingState.OFFLINE;

  const isReconnectFailed =
    callingState === CallingState.RECONNECTING_FAILED;

  if (callingState === CallingState.JOINING) {
    return (
      <LoadingScreen
        message="Connexion à l'appel..."
        subtitle="Veuillez patienter"
      />
    );
  }

  if (callingState === CallingState.LEFT) {
    return (
      <CallEndedScreen
        duration={formatDuration(duration)}
        onNewCall={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-[12px] border border-white mt-[10px] mb-[50px]">
      {remoteParticipant ? (
        <div className="absolute inset-0 w-full h-full">
          <ParticipantView
            participant={remoteParticipant}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">En attente ...</h3>
            <p className="text-gray-300 text-lg">
              L'utilisateur va bientôt vous rejoindre
            </p>
          </div>
        </div>
      )}

      {localParticipant && (
        <div className="absolute top-16 right-6 w-32 h-40 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl z-10">
          <ParticipantView
            participant={localParticipant}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {isReconnecting && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-amber-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          Reconnexion...
        </div>
      )}

      {isReconnectFailed && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 px-6">
          <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <WifiOff className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-exford-blue">
              Connexion perdue
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Impossible de rétablir la connexion. Vérifiez votre réseau puis
              réessayez.
            </p>
            <button
              onClick={handleRejoin}
              disabled={isRejoining}
              className="w-full rounded-xl bg-cobalt-blue px-4 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            >
              {isRejoining ? "Reconnexion..." : "Rejoindre l'appel"}
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 z-10">
        <div className=" rounded-full px-4 py-2 text-white font-mono text-lg">
          {formatDuration(duration)}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleMicrophone}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isMute
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isMute ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Image
                src="/assets/icons/microphonevisio.svg"
                alt="camera"
                width={24}
                height={24}
              />
            )}
          </button>

          <button
            onClick={handleEndCall}
            disabled={isEndingCall}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          >
            <Image
              src="/assets/icons/endCall.svg"
              alt="phone"
              width={24}
              height={24}
            />
          </button>

          <button
            onClick={handleToggleCamera}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isCameraOff
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isCameraOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Image
                src="/assets/icons/Videocameravisio.svg"
                alt="camera"
                width={24}
                height={24}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
