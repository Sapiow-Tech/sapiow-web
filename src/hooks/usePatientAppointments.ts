"use client";
import { useGetPatientAppointments } from "@/api/appointments/useAppointments";
import { useGetCustomer } from "@/api/customer/useCustomer";
import { type ApiAppointment } from "@/utils/appointmentUtils";
import { useMemo } from "react";

export const usePatientAppointments = (enabled: boolean = true) => {
  const { data: customer } = useGetCustomer(enabled);

  // Filtrer les rendez-vous futurs (>= aujourd'hui à minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Requête pour les rendez-vous futurs
  const { data: futureAppointments, isLoading } = useGetPatientAppointments(
    customer?.id,
    {
      gteField: "appointment_at",
      gte: todayISO,
      orderBy: "appointment_at",
      orderDirection: "asc",
    }
  );

  // Requête pour l'historique (tous les rendez-vous)
  const { data: allAppointments } = useGetPatientAppointments(customer?.id, {
    orderBy: "appointment_at",
    orderDirection: "desc",
  });

  // Filtrer les rendez-vous confirmés dont l'heure de fin n'est pas encore passée
  const confirmedAppointments = useMemo(() => {
    if (!futureAppointments) return [];

    return (futureAppointments as ApiAppointment[])
      .filter((apt) => apt.status === "confirmed")
      .filter((apt) => {
        // Calculer l'heure de fin du rendez-vous (date + durée)
        const appointmentDate = new Date(apt.appointment_at);
        const sessionDuration = apt.session?.session_type || "30mn";

        // Extraire les minutes de la durée
        let durationMinutes = 30;
        if (sessionDuration.includes("mn")) {
          durationMinutes = parseInt(sessionDuration);
        } else if (sessionDuration.includes("h")) {
          durationMinutes = parseInt(sessionDuration) * 60;
        }

        // Calculer l'heure de fin
        const endTime = new Date(
          appointmentDate.getTime() + durationMinutes * 60000
        );
        const now = new Date();

        // Garder seulement si l'heure de fin n'est pas encore passée
        return endTime > now;
      });
  }, [futureAppointments]);

  // Rendez-vous en attente
  const pendingAppointments = useMemo(() => {
    if (!futureAppointments) return [];
    return (futureAppointments as ApiAppointment[]).filter(
      (apt) => apt.status === "pending"
    );
  }, [futureAppointments]);

  // Historique : rendez-vous passés (cancelled, completed) ou dont l'heure de fin est dépassée
  const historicAppointments = useMemo(() => {
    if (!allAppointments) return [];

    return (allAppointments as ApiAppointment[]).filter((apt) => {
      // Inclure les rendez-vous annulés ou complétés
      if (apt.status === "cancelled" || apt.status === "completed") {
        return true;
      }

      // Inclure les rendez-vous confirmés dont l'heure de fin est passée
      if (apt.status === "confirmed") {
        const appointmentDate = new Date(apt.appointment_at);
        const sessionDuration = apt.session?.session_type || "30mn";

        let durationMinutes = 30;
        if (sessionDuration.includes("mn")) {
          durationMinutes = parseInt(sessionDuration);
        } else if (sessionDuration.includes("h")) {
          durationMinutes = parseInt(sessionDuration) * 60;
        }

        const endTime = new Date(
          appointmentDate.getTime() + durationMinutes * 60000
        );
        const now = new Date();

        // Inclure si l'heure de fin est passée
        return endTime <= now;
      }

      return false;
    });
  }, [allAppointments]);

  return {
    customer,
    confirmedAppointments,
    pendingAppointments,
    historicAppointments,
    isLoading,
  };
};
