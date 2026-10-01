"use client";
import { apiClient } from "@/lib/api-client";
import { useCallStore } from "@/store/useCall";
import { StreamUserResponse } from "@/types/call";
import { registerStreamCleanup } from "@/utils/streamCleanup";
import {
  StreamVideoClient,
  type Call,
  type User,
} from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// Singleton pattern pour éviter les connexions multiples
const clientInstances = new Map<string, StreamVideoClient>();

const fetchStreamToken = async (appointmentId: string): Promise<string> => {
  const maxAttempts = 5;

  for (let attempt = 0; ; attempt++) {
    try {
      const data = await apiClient.get<StreamUserResponse>(
        `call/${appointmentId}`
      );
      const token =
        data?.proStreamUser?.token || data?.patientStreamUser?.token;

      if (!token) {
        throw new Error("Token Stream manquant dans la réponse");
      }

      return token;
    } catch (error) {
      if (attempt >= maxAttempts - 1) {
        throw error;
      }

      const delay = Math.min(1000 * 2 ** attempt, 30_000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const getOrCreateClient = (
  apiKey: string,
  user: User,
  token: string,
  appointmentId: string
): StreamVideoClient => {
  if (!user.id) {
    throw new Error("User ID est requis pour créer un client");
  }

  const clientKey = user.id;
  const existingClient = clientInstances.get(clientKey);
  if (existingClient) {
    return existingClient;
  }

  const newClient = new StreamVideoClient({
    apiKey,
    user,
    token,
    tokenProvider: () => fetchStreamToken(appointmentId),
  });

  clientInstances.set(clientKey, newClient);
  return newClient;
};

const cleanupClient = async (userId: string) => {
  const client = clientInstances.get(userId);
  if (client) {
    try {
      await client.disconnectUser();
      clientInstances.delete(userId);
    } catch (err) {
      console.warn("Erreur lors du nettoyage du client:", err);
      clientInstances.delete(userId);
    }
  }
};

const cleanupAllClients = async () => {
  const cleanupPromises = Array.from(clientInstances.entries()).map(
    async ([userId, client]) => {
      try {
        await client.disconnectUser();
        clientInstances.delete(userId);
      } catch (err) {
        console.warn("Erreur lors du nettoyage du client:", userId, err);
        clientInstances.delete(userId);
      }
    }
  );
  await Promise.all(cleanupPromises);
};

const disableCallDevices = async (call: Call | null) => {
  if (!call) return;
  try {
    await call.camera.disable();
    await call.microphone.disable();
  } catch (err) {
    console.warn("Erreur lors de la désactivation des périphériques:", err);
  }
};

interface UseVideoCallReturn {
  client: StreamVideoClient | null;
  call: Call | null;
  error: string | null;
  isConnecting: boolean;
  isEndingCall: boolean;
  initializeCall: () => Promise<void>;
  endCall: () => Promise<void>;
  handleRetry: () => void;
}

export const useVideoCallSimple = (): UseVideoCallReturn => {
  const { callData, setCallData, setIsVideoCallActive } = useCallStore();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const isConnectingRef = useRef(false);
  const isEndingCallRef = useRef(false);
  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);

  const callConfig = useMemo(() => {
    const streamUser = callData?.proStreamUser || callData?.patientStreamUser;

    const token = streamUser?.token;
    const userId = streamUser?.user?.id;
    const callId = streamUser?.appointmentId;
    const userName = streamUser?.user?.name;

    return {
      token,
      userId,
      callId,
      user: {
        id: userId || "!anon",
        name: userName || "User",
      } as User,
    };
  }, [callData]);

  useEffect(() => {
    userIdRef.current = callConfig.userId;
  }, [callConfig.userId]);

  const initializeCall = useCallback(async () => {
    if (isConnectingRef.current || hasInitializedRef.current) {
      return;
    }

    const { user, token, callId } = callConfig;

    if (user?.id && clientInstances.has(user.id) && callId) {
      const existingClient = clientInstances.get(user.id)!;
      setClient(existingClient);
      clientRef.current = existingClient;
      hasInitializedRef.current = true;

      try {
        isConnectingRef.current = true;
        setIsConnecting(true);
        const existingCall = existingClient.call("default", callId);
        await existingCall.join({ create: true });
        setCall(existingCall);
        callRef.current = existingCall;
      } catch (err: any) {
        console.error("Erreur de connexion:", err);
        setError(err.message || "Erreur de connexion à l'appel vidéo");
        hasInitializedRef.current = false;
      } finally {
        isConnectingRef.current = false;
        setIsConnecting(false);
      }
      return;
    }

    try {
      isConnectingRef.current = true;
      setIsConnecting(true);
      setError(null);
      hasInitializedRef.current = true;

      if (!token || !callId) {
        throw new Error("Token ou ID d'appel manquant");
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (tokenPayload.exp < currentTime) {
          throw new Error(
            "Le token JWT a expiré. Veuillez générer un nouveau token."
          );
        }
      } catch (tokenErr) {
        if (
          tokenErr instanceof Error &&
          tokenErr.message.includes("token JWT a expiré")
        ) {
          throw tokenErr;
        }
        console.warn("Erreur de validation du token:", tokenErr);
      }

      const apiKey = API_KEY;
      if (!apiKey) {
        throw new Error("Clé API Stream manquante");
      }

      const videoClient = getOrCreateClient(apiKey, user, token, callId);
      const videoCall = videoClient.call("default", callId);

      await videoCall.join({ create: true });

      setClient(videoClient);
      setCall(videoCall);
      clientRef.current = videoClient;
      callRef.current = videoCall;
      setIsVideoCallActive(true);
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Erreur de connexion à l'appel vidéo");
      hasInitializedRef.current = false;
    } finally {
      isConnectingRef.current = false;
      setIsConnecting(false);
    }
  }, [callConfig, setIsVideoCallActive]);

  const endCall = useCallback(async () => {
    if (isEndingCallRef.current) return;

    try {
      isEndingCallRef.current = true;
      setIsEndingCall(true);

      const activeCall = callRef.current;
      const activeUserId = userIdRef.current;

      await disableCallDevices(activeCall);

      if (activeCall) {
        try {
          if (activeCall.state.callingState !== "left") {
            await activeCall.leave();
          }
        } catch (callErr) {
          console.warn("Erreur lors de la gestion de l'appel:", callErr);
        }
      }

      if (activeUserId) {
        try {
          await cleanupClient(activeUserId);
        } catch {
          // Ignore les erreurs de déconnexion
        }
      }

      setCallData({} as StreamUserResponse);
      setClient(null);
      setCall(null);
      clientRef.current = null;
      callRef.current = null;
      setIsVideoCallActive(false);
      hasInitializedRef.current = false;
    } catch (err: any) {
      setError("Erreur lors de la fin de l'appel: " + err.message);
    } finally {
      isEndingCallRef.current = false;
      setIsEndingCall(false);
    }
  }, [setCallData, setIsVideoCallActive]);

  const handleRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    hasInitializedRef.current = false;
    setError(null);

    retryTimeoutRef.current = setTimeout(() => {
      initializeCall();
    }, 100);
  }, [initializeCall]);

  useEffect(() => {
    registerStreamCleanup(cleanupAllClients, () => clientInstances.size);
  }, []);

  // Initialisation : ne rejoint qu'une fois, même si callData est réécrit
  useEffect(() => {
    if (callConfig.token && callConfig.callId && !hasInitializedRef.current) {
      initializeCall();
    }
  }, [callConfig.token, callConfig.callId, initializeCall]);

  // Nettoyage uniquement au démontage réel de l'écran
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      const activeCall = callRef.current;
      const activeUserId = userIdRef.current;

      if (activeCall) {
        disableCallDevices(activeCall).catch(() => {});
        if (activeCall.state.callingState !== "left") {
          activeCall.leave().catch(() => {});
        }
      }

      if (activeUserId) {
        cleanupClient(activeUserId).catch(() => {});
      }

      callRef.current = null;
      clientRef.current = null;
      hasInitializedRef.current = false;
    };
  }, []);

  return {
    client,
    call,
    error,
    isConnecting,
    isEndingCall,
    initializeCall,
    endCall,
    handleRetry,
  };
};
