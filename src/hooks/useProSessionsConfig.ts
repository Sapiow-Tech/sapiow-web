"use client";

import {
  SessionType,
  useCreateProSession,
  useGetProSession,
  useUpdateProSession,
} from "@/api/sessions/useSessions";
import { useEffect, useMemo, useState } from "react";

export interface SessionDuration {
  id: string;
  duration: string;
  price: number;
  enabled: boolean;
  session_type: SessionType;
  api_id?: string; // ID de la session dans l'API (si elle existe)
}

// Sessions par défaut
const DEFAULT_SESSIONS: SessionDuration[] = [
  {
    id: "15min",
    duration: "15 minutes",
    price: 0,
    enabled: false,
    session_type: "15m",
    api_id: undefined,
  },
  {
    id: "30min",
    duration: "30 minutes",
    price: 0,
    enabled: false,
    session_type: "30m",
    api_id: undefined,
  },
  {
    id: "45min",
    duration: "45 minutes",
    price: 0,
    enabled: false,
    session_type: "45m",
    api_id: undefined,
  },
  {
    id: "60min",
    duration: "60 minutes",
    price: 0,
    enabled: false,
    session_type: "60m",
    api_id: undefined,
  },
];

const cloneSessions = (sessions: SessionDuration[]): SessionDuration[] =>
  sessions.map((session) => ({ ...session }));

const isSessionDirty = (
  current: SessionDuration,
  saved: SessionDuration | undefined
): boolean => {
  if (!saved) return current.enabled || current.price !== 0;
  return (
    current.price !== saved.price ||
    current.enabled !== saved.enabled ||
    current.api_id !== saved.api_id
  );
};

const buildSessionPayload = (session: SessionDuration) => ({
  price: session.price,
  session_type: session.session_type,
  session_nature: "one_time" as const,
  name: `Session ${session.duration}`,
  one_on_one: true,
  video_call: true,
  strategic_session: false,
  exclusive_ressources: false,
  support: false,
  mentorship: false,
  webinar: false,
  is_active: session.enabled,
});

export const useProSessionsConfig = () => {
  const [sessions, setSessions] = useState<SessionDuration[]>(DEFAULT_SESSIONS);
  const [savedSessions, setSavedSessions] =
    useState<SessionDuration[]>(DEFAULT_SESSIONS);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks API
  const { data: sessionData, isLoading, error } = useGetProSession();
  const createSessionMutation = useCreateProSession();
  const updateSessionMutation = useUpdateProSession();

  // Charger les données de l'API au démarrage
  useEffect(() => {
    if (sessionData) {
      const nextSessions = DEFAULT_SESSIONS.map((session) => {
        const apiSession = Array.isArray(sessionData)
          ? sessionData.find((s) => s.session_type === session.session_type)
          : sessionData.session_type === session.session_type
            ? sessionData
            : null;

        if (apiSession) {
          return {
            ...session,
            price: apiSession.price,
            enabled: apiSession.is_active,
            api_id: apiSession.id,
          };
        }
        return { ...session };
      });

      setSessions(nextSessions);
      setSavedSessions(cloneSessions(nextSessions));
    }
  }, [sessionData]);

  const hasUnsavedChanges = useMemo(() => {
    return sessions.some((session) => {
      const saved = savedSessions.find((s) => s.id === session.id);
      return isSessionDirty(session, saved);
    });
  }, [sessions, savedSessions]);

  const handlePriceChange = (id: string, newPrice: number) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              enabled,
              // Remettre le prix à 0 quand on désactive
              price: enabled ? session.price : 0,
            }
          : session
      )
    );
  };

  const saveSessions = async (): Promise<boolean> => {
    if (!hasUnsavedChanges || isSaving) return false;

    setIsSaving(true);
    try {
      let nextSessions = cloneSessions(sessions);

      for (const session of nextSessions) {
        const saved = savedSessions.find((s) => s.id === session.id);
        if (!isSessionDirty(session, saved)) continue;

        // Session déjà en base : mise à jour (prix, activation, y compris 0 €)
        if (session.api_id) {
          await updateSessionMutation.mutateAsync({
            id: session.api_id,
            data: buildSessionPayload(session),
          });
          continue;
        }

        // Nouvelle session : créer uniquement si activée (0 € accepté)
        if (session.enabled && session.price >= 0) {
          const response = await createSessionMutation.mutateAsync(
            buildSessionPayload(session)
          );

          if (response.data?.id) {
            nextSessions = nextSessions.map((s) =>
              s.id === session.id ? { ...s, api_id: response.data!.id } : s
            );
          }
        }
      }

      setSessions(nextSessions);
      setSavedSessions(cloneSessions(nextSessions));
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des sessions:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Loading initial seulement si on n'a pas encore de données
  const isInitialLoading =
    isLoading && sessions.every((s) => s.price === 0 && !s.enabled);

  return {
    sessions,
    isInitialLoading,
    error,
    isSaving,
    hasUnsavedChanges,
    handlePriceChange,
    handleToggle,
    saveSessions,
    sessionData, // Exposer sessionData pour accéder à extra_data
  };
};
