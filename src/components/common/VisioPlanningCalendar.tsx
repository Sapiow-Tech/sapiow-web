"use client";
import {
  useCreatePatientAppointment,
  useGetProAppointments,
} from "@/api/appointments/useAppointments";
import { Button } from "@/components/common/Button";
import {
  PromoCodeInput,
  type PromoCodeResult,
} from "@/components/common/PromoCodeInput";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import { usePendingBookingStore } from "@/store/usePendingBookingStore";
import { usePayStore } from "@/store/usePay";
import { usePlaningStore } from "@/store/usePlaning";
import { authUtils } from "@/utils/auth";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface VisioPlanningCalendarProps {
  onDateTimeSelect?: (date: Date, time: string, duration: number) => void;
  className?: string;
  expertData?: any; // Données de l'expert depuis l'API
  professionalName?: string; // Nom de l'expert
  onAppointmentCreated?: (appointmentData: any) => void; // Callback après création
}

// Mapping des jours de la semaine
const dayOfWeekMapping = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Fonction utilitaire pour obtenir une clé de date locale (YYYY-MM-DD)
const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fonction pour générer les créneaux horaires basés sur les schedules ou les "allow days"
const generateTimeSlots = (
  schedules: any[],
  selectedDate: Date,
  duration: number,
  existingAppointments: any[] = [],
  allowedWindowsForDate: any[] = [],
  sessions: any[] = []
) => {
  const timeSlots: any[] = [];

  const parseSessionTypeMinutes = (value: unknown): number | null => {
    if (typeof value !== "string") return null;
    const match = value.match(/(\d+)\s*m/i);
    if (!match) return null;
    const minutes = Number(match[1]);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
  };

  const sessionDurationById = new Map<string, number>();
  if (Array.isArray(sessions)) {
    sessions.forEach((s: any) => {
      const id = s?.id;
      if (!id) return;
      const minutes =
        typeof s?.duration_minutes === "number"
          ? s.duration_minutes
          : typeof s?.duration === "number"
          ? s.duration
          : parseSessionTypeMinutes(s?.session_type);
      if (
        typeof minutes === "number" &&
        Number.isFinite(minutes) &&
        minutes > 0
      ) {
        sessionDurationById.set(String(id), minutes);
      }
    });
  }

  const getAppointmentDurationMinutes = (appointment: any): number => {
    const direct =
      typeof appointment?.duration_minutes === "number"
        ? appointment.duration_minutes
        : typeof appointment?.duration === "number"
        ? appointment.duration
        : parseSessionTypeMinutes(appointment?.session_type) ??
          parseSessionTypeMinutes(appointment?.session?.session_type);

    if (typeof direct === "number" && Number.isFinite(direct) && direct > 0) {
      return direct;
    }

    const sessionId = appointment?.session_id;
    if (sessionId && sessionDurationById.has(String(sessionId))) {
      return sessionDurationById.get(String(sessionId))!;
    }

    // Fallback safe: si on ne connaît pas la durée, on assume 15 minutes
    return 15;
  };

  /** Combine une date locale et un time PostgreSQL (ex. "08:30:00+00") en un Date JS. */
  const parseScheduleTime = (
    baseDate: Date,
    timeStr: unknown
  ): Date | null => {
    if (typeof timeStr !== "string") return null;

    const dateStr = [
      baseDate.getFullYear(),
      String(baseDate.getMonth() + 1).padStart(2, "0"),
      String(baseDate.getDate()).padStart(2, "0"),
    ].join("-");

    // PostgreSQL renvoie "+00" mais ISO 8601 attend "+00:00"
    let normalized = timeStr.trim();
    const signPos = Math.max(
      normalized.lastIndexOf("+"),
      normalized.lastIndexOf("-")
    );
    if (signPos > 0 && !normalized.slice(signPos).includes(":")) {
      normalized += ":00";
    }

    const date = new Date(`${dateStr}T${normalized}`);
    return isNaN(date.getTime()) ? null : date;
  };

  const buildSlotsForWindow = (start: Date, end: Date) => {
    // Générer les créneaux horaires selon la durée sélectionnée
    let currentTime = new Date(start);

    while (currentTime < end) {
      const nextTime = new Date(currentTime.getTime() + duration * 60 * 1000);

      // Vérifier qu'il reste assez de temps pour ce créneau
      if (nextTime <= end) {
        const timeString = currentTime.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Créer une date complète pour ce créneau en combinant la date sélectionnée avec l'heure du créneau
        const slotDateTime = new Date(selectedDate);
        const [hours, minutes] = timeString.split(":");
        const slotHour = parseInt(hours);
        const slotMinute = parseInt(minutes);
        slotDateTime.setHours(slotHour, slotMinute, 0, 0);

        // Bloquer les créneaux nocturnes problématiques tout en gardant les créneaux matinaux normaux

        // Cas 1: Créneaux qui commencent entre 00h31 et 00h59 (après minuit mais avant 01h00)
        if (slotHour === 0 && slotMinute > 30) {
          currentTime = nextTime;
          continue;
        }

        // Cas 2: Créneaux nocturnes problématiques (01h00 à 05h59)
        // Permettre les créneaux matinaux normaux à partir de 06h00
        if (slotHour >= 1 && slotHour < 6) {
          currentTime = nextTime;
          continue;
        }

        // Cas 3: Créneaux qui commencent entre 00h00 et 00h30 mais se terminent après 00h30
        if (slotHour === 0 && slotMinute <= 30) {
          const slotEndMinutes = slotMinute + duration;
          if (slotEndMinutes > 30) {
            currentTime = nextTime;
            continue;
          }
        }

        // Cas 4: Créneaux qui commencent avant minuit mais se terminent après 00h30
        if (slotHour >= 12) {
          const slotEndTime = new Date(
            slotDateTime.getTime() + duration * 60 * 1000
          );
          const maxTime = new Date(selectedDate);
          maxTime.setHours(0, 30, 0, 0); // 00h30
          maxTime.setDate(maxTime.getDate() + 1); // Le lendemain à 00h30

          if (slotEndTime > maxTime) {
            currentTime = nextTime;
            continue;
          }
        }

        // Obtenir l'heure actuelle pour filtrer les créneaux passés
        const now = new Date();

        // Si c'est aujourd'hui, vérifier que le créneau n'est pas déjà passé
        const isToday = selectedDate.toDateString() === now.toDateString();
        const isPastTime = isToday && slotDateTime < now;

        // Ne pas ajouter les créneaux passés pour aujourd'hui
        if (isPastTime) {
          currentTime = nextTime;
          continue;
        }

        // Vérifier si ce créneau est déjà pris par un rendez-vous existant
        // Exclure les rendez-vous avec des statuts qui libèrent le créneau (refused, refunded, cancelled)
        const isSlotTaken = existingAppointments.some((appointment) => {
          // Statuts qui libèrent le créneau (le rendez-vous n'est plus actif)
          const inactiveStatuses = [
            "refused",
            "refunded",
            "cancelled",
            "awaiting_payment",
          ];

          // Si le statut indique que le créneau est libre, l'ignorer
          if (inactiveStatuses.includes(appointment.status?.toLowerCase())) {
            return false;
          }

          const appointmentDate = new Date(appointment.appointment_at);
          if (isNaN(appointmentDate.getTime())) return false;

          const appointmentDurationMinutes =
            getAppointmentDurationMinutes(appointment);
          const appointmentStartMs = appointmentDate.getTime();
          const appointmentEndMs =
            appointmentStartMs + appointmentDurationMinutes * 60 * 1000;

          const slotStartMs = slotDateTime.getTime();
          const slotEndMs = slotStartMs + duration * 60 * 1000;

          // Chevauchement (si les intervalles se croisent)
          return (
            slotStartMs < appointmentEndMs && slotEndMs > appointmentStartMs
          );
        });

        // Ajouter le créneau au tableau avec son statut de disponibilité
        timeSlots.push({
          time: timeString,
          available: !isSlotTaken,
          status: isSlotTaken ? "taken" : null,
        });
      }

      // Passer au créneau suivant (espacé de la durée)
      currentTime = nextTime;
    }
  };

  // 1) Si des "allow dates" existent pour ce jour, ils sont prioritaires
  if (allowedWindowsForDate && allowedWindowsForDate.length > 0) {
    // Utiliser les fenêtres de disponibilité spécifiques définies pour cette date
    allowedWindowsForDate.forEach((window: any) => {
      if (!window?.start_date || !window?.end_date) return;
      const rawWindowStart = new Date(window.start_date);
      const rawWindowEnd = new Date(window.end_date);

      if (isNaN(rawWindowStart.getTime()) || isNaN(rawWindowEnd.getTime()))
        return;

      // Ancrer la fenêtre sur la date sélectionnée (évite les décalages timezone
      // qui font tomber la fenêtre sur un autre jour côté JS).
      const windowStart = new Date(selectedDate);
      windowStart.setHours(
        rawWindowStart.getHours(),
        rawWindowStart.getMinutes(),
        rawWindowStart.getSeconds(),
        0
      );

      const windowEnd = new Date(selectedDate);
      windowEnd.setHours(
        rawWindowEnd.getHours(),
        rawWindowEnd.getMinutes(),
        rawWindowEnd.getSeconds(),
        0
      );

      // Si ça traverse minuit (ou si end <= start), pousser la fin au lendemain
      if (windowEnd <= windowStart) {
        windowEnd.setDate(windowEnd.getDate() + 1);
      }

      // Validation finale
      if (windowStart >= windowEnd) return;

      buildSlotsForWindow(windowStart, windowEnd);
    });
  } else {
    // 2) Sinon, on utilise les schedules récurrents (horaires hebdomadaires)
    if (!schedules || schedules.length === 0) {
      return [];
    }

    // Obtenir le jour de la semaine de la date sélectionnée
    const dayOfWeek =
      dayOfWeekMapping[selectedDate.getDay() as keyof typeof dayOfWeekMapping];

    // Trouver les schedules qui correspondent à ce jour de la semaine
    const daySchedules = schedules.filter(
      (schedule) => schedule.day_of_week === dayOfWeek
    );

    if (daySchedules.length === 0) {
      return [];
    }

    // Pour chaque schedule du jour, générer les créneaux horaires
    daySchedules.forEach((schedule, index) => {
      // Valider que les heures de début et fin existent
      if (!schedule.start_time || !schedule.end_time) {
        return;
      }

      const startTime = parseScheduleTime(selectedDate, schedule.start_time);
      const endTime = parseScheduleTime(selectedDate, schedule.end_time);

      if (!startTime || !endTime) {
        console.warn(
          `Schedule invalide ignoré: ${String(
            schedule.start_time
          )} - ${String(schedule.end_time)}`
        );
        return;
      }

      // Gérer les créneaux qui traversent minuit (end_time <= start_time)
      if (endTime <= startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }

      if (startTime >= endTime) {
        console.warn(
          `Schedule invalide ignoré: ${String(schedule.start_time)} - ${String(
            schedule.end_time
          )}`
        );
        return;
      }

      // Limiter endTime à 00h30 maximum du lendemain (par rapport à selectedDate)
      const maxEndTime = new Date(selectedDate);
      maxEndTime.setDate(maxEndTime.getDate() + 1);
      maxEndTime.setHours(0, 30, 0, 0);

      if (endTime > maxEndTime) {
        endTime.setTime(maxEndTime.getTime());
      }

      buildSlotsForWindow(startTime, endTime);
    });
  }

  // Éliminer les doublons (créneaux avec la même heure)
  const uniqueTimeSlots = timeSlots.reduce((acc: any[], current) => {
    // Vérifier si ce créneau existe déjà dans l'accumulateur
    const existingSlot = acc.find((slot) => slot.time === current.time);

    if (!existingSlot) {
      // Nouveau créneau, l'ajouter
      acc.push(current);
    } else {
      // Créneau existe déjà, garder le statut le plus restrictif
      // Si l'un des deux est "taken", le créneau reste "taken"
      if (current.status === "taken") {
        existingSlot.status = "taken";
        existingSlot.available = false;
      }
    }

    return acc;
  }, []);

  // Trier les créneaux par heure
  return uniqueTimeSlots.sort((a, b) => a.time.localeCompare(b.time));
};

export default function VisioPlanningCalendar({
  onDateTimeSelect,
  className = "",
  expertData,
  professionalName,
  onAppointmentCreated,
}: VisioPlanningCalendarProps) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const serviceFeeRate = 0.15;
  const feeFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currentLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [currentLocale]
  );

  const parsePrice = (value: unknown) => {
    if (typeof value === "number") return value;
    const normalized = String(value ?? "")
      .trim()
      .replace("€", "")
      .replace(/\s/g, "")
      .replace(",", ".");
    const num = Number(normalized);
    return Number.isFinite(num) ? num : 0;
  };

  // Variables traduites selon la locale
  const daysOfWeek =
    currentLocale === "fr"
      ? ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months =
    currentLocale === "fr"
      ? [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

  const searchParams = useSearchParams();
  const expertId = searchParams.get("id");
  const { data: appointments } = useGetProAppointments(expertId?.toString());

  // Nouvelles données pour la gestion des jours autorisés / bloqués
  const appointmentAllowDays = expertData?.appointment_allow_day || [];
  const appointmentBlocks = expertData?.appointment_blocks || [];

  const { setIsPlaning } = usePlaningStore();
  const { setIsPaid } = usePayStore();
  const { setPendingBooking } = usePendingBookingStore();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<number | null>(null); // Sera défini par le useEffect à la première date disponible
  const { setAppointmentData } = useAppointmentStore();
  const router = useRouter();
  // Hook pour créer un appointment
  const createAppointmentMutation = useCreatePatientAppointment();

  // Créer les durées dynamiques basées sur les sessions de l'expert

  const availableDurations =
    expertData?.sessions
      ?.filter((session: any) => session.session_type && session.is_active)
      .map((session: any) => ({
        label:
          session.session_type === "15m"
            ? "15 min"
            : session.session_type === "30m"
            ? "30 min"
            : session.session_type === "45m"
            ? "45 min"
            : session.session_type === "60m"
            ? "60 min"
            : `${session.session_type}`,
        value: parseInt(session.session_type.replace("m", "")),
        price: session.price,
        sessionId: session.id,
      })) || [];

  const [selectedDuration, setSelectedDuration] = useState(
    availableDurations[0]?.value || 15
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const reserveInFlightRef = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [promoResult, setPromoResult] = useState<PromoCodeResult | null>(null);

  useEffect(() => {
    authUtils.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const promoDiscountDisplay = useMemo(() => {
    if (!promoResult?.valid) return null;

    const coupon = (promoResult as any)?.promotion_code?.coupon;
    const percentOff = coupon?.percent_off;
    const amountOff = coupon?.amount_off;

    if (typeof percentOff === "number" && Number.isFinite(percentOff)) {
      // Ex: -10%
      const percent = Number.isInteger(percentOff)
        ? String(percentOff)
        : String(percentOff);
      return `-${percent}%`;
    }

    if (typeof amountOff === "number" && Number.isFinite(amountOff)) {
      // Stripe: amount_off est en cents (pour eur/usd, etc.)
      const amountEuros = amountOff / 100;
      // Ex: - 1.00€
      return `- ${feeFormatter.format(amountEuros)} €`;
    }

    return null;
  }, [promoResult, feeFormatter]);

  // Prix de la session sélectionnée
  const selectedSession = availableDurations.find(
    (d: any) => d.value === selectedDuration
  );

  const sessionPrice = selectedSession?.price;
  const sessionPriceNumber = parsePrice(sessionPrice);
  const serviceFee =
    Math.round(sessionPriceNumber * serviceFeeRate * 100) / 100;

  // Générer les créneaux horaires dynamiquement
  const timeSlots = useMemo(() => {
    // Si aucune date n'est sélectionnée, retourner un tableau vide
    if (selectedDate === null) {
      return [];
    }

    const selectedDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDate
    );

    // Clé de date locale au format YYYY-MM-DD pour comparaison avec les données backend
    const dateKey = getLocalDateKey(selectedDateTime);

    // Vérifier si cette date est bloquée dans appointment_blocks
    const isBlockedDate =
      Array.isArray(appointmentBlocks) &&
      appointmentBlocks.some(
        (block: any) => typeof block.date === "string" && block.date === dateKey
      );

    if (isBlockedDate) {
      return [];
    }

    // Récupérer les fenêtres "allow" qui correspondent exactement à cette date
    const allowedWindowsForDate = Array.isArray(appointmentAllowDays)
      ? appointmentAllowDays.filter((allow: any) => {
          if (!allow?.start_date) return false;
          const allowStartDate = new Date(allow.start_date);
          const allowDateKey = getLocalDateKey(allowStartDate);
          return allowDateKey === dateKey;
        })
      : [];

    const slots = generateTimeSlots(
      expertData?.schedules || [],
      selectedDateTime,
      selectedDuration,
      Array.isArray(appointments) ? appointments : [],
      allowedWindowsForDate,
      expertData?.sessions || []
    );

    return slots;
  }, [
    expertData?.schedules,
    currentDate,
    selectedDate,
    selectedDuration,
    appointments,
    appointmentAllowDays,
    appointmentBlocks,
  ]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });

    // Réinitialiser la date sélectionnée lors du changement de mois
    setSelectedDate(1);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    // Réinitialiser le temps sélectionné quand on change de date
    setSelectedTime("");
  };

  const handleReserve = async () => {
    if (!selectedDate || !selectedTime || !selectedSession?.sessionId) {
      return;
    }
    if (reserveInFlightRef.current || isRedirecting) {
      return;
    }
    reserveInFlightRef.current = true;

    // Activer l'état de redirection pour maintenir le loader visible
    setIsRedirecting(true);

    // Créer la date et heure complète pour l'appointment
    const selectedDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDate
    );

    // Parser l'heure sélectionnée et l'ajouter à la date
    const [hours, minutes] = selectedTime.split(":").map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    try {
      const promo_code = promoResult?.valid ? promoResult.code : undefined;
      const appointmentData = {
        pro_id: expertData?.id, // ID de l'expert
        session_id: selectedSession.sessionId, // ID de la session
        appointment_at: selectedDateTime.toISOString(), // Date/heure ISO
        ...(promo_code ? { promo_code } : {}),
      };

      const isAuthenticated = await authUtils.isAuthenticated();
      if (!isAuthenticated) {
        const proId = expertData?.id;
        if (!proId) {
          setIsRedirecting(false);
          reserveInFlightRef.current = false;
          return;
        }

        setPendingBooking({
          pro_id: String(proId),
          session_id: String(selectedSession.sessionId),
          appointment_at: selectedDateTime.toISOString(),
          ...(promo_code ? { promo_code } : {}),
          returnUrl: `/details?id=${proId}`,
        });

        router.push(`/login?next=${encodeURIComponent("/booking/resume")}`);
        return;
      }

      const result = await createAppointmentMutation.mutateAsync(
        appointmentData,
        {
          onSuccess: (data: any) => {
            // Si la réponse contient seulement appointment (sans payment), c'est une session gratuite
            if (data?.appointment && !data?.payment) {
              // Session gratuite confirmée - afficher le composant de succès
              setIsPaid(true);
              setIsPlaning(false);
              setIsRedirecting(false);
              reserveInFlightRef.current = false;
            } else if (data?.appointment && data?.payment) {
              // Session payante - rediriger vers la page de paiement
              setAppointmentData(data.appointment, data.payment, promoResult);
              const returnUrl = `/details?id=${data.appointment.pro_id}`;
              router.push(
                `/payment?returnUrl=${encodeURIComponent(returnUrl)}`
              );
            }
          },
          onError: (error) => {
            console.error(
              "Erreur lors de la création de l'appointment:",
              error
            );
            // En cas d'erreur, désactiver le loader
            setIsRedirecting(false);
            reserveInFlightRef.current = false;
          },
        }
      );

      // Callback de succès
      if (onAppointmentCreated) {
        onAppointmentCreated(result);
      }

      // Callback legacy si défini
      if (onDateTimeSelect) {
        onDateTimeSelect(selectedDateTime, selectedTime, selectedDuration);
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'appointment:", error);
      // En cas d'erreur, désactiver le loader
      setIsRedirecting(false);
      reserveInFlightRef.current = false;
    }
  };

  // Fonction pour vérifier si une date a des créneaux disponibles
  const hasAvailableSlots = (date: Date) => {
    const dateKey = getLocalDateKey(date);

    // Vérifier si la date est bloquée dans appointment_blocks
    if (
      Array.isArray(appointmentBlocks) &&
      appointmentBlocks.some(
        (block: any) => typeof block.date === "string" && block.date === dateKey
      )
    ) {
      return false;
    }

    // Récupérer les fenêtres de disponibilité spécifiques pour cette date
    const allowedWindowsForDate = Array.isArray(appointmentAllowDays)
      ? appointmentAllowDays.filter((allow: any) => {
          if (!allow?.start_date) return false;
          const allowStartDate = new Date(allow.start_date);
          const allowDateKey = getLocalDateKey(allowStartDate);
          return allowDateKey === dateKey;
        })
      : [];

    // Générer les créneaux pour cette date
    const slots = generateTimeSlots(
      expertData?.schedules || [],
      date,
      selectedDuration,
      Array.isArray(appointments) ? appointments : [],
      allowedWindowsForDate,
      expertData?.sessions || []
    );

    // Filtrer les créneaux disponibles (non pris)
    const availableSlots = slots.filter((slot: any) => slot.available);

    // Retourner true s'il y a au moins un créneau disponible
    return slots.some((slot: any) => slot.available);
  };

  // useEffect pour initialiser la date sélectionnée à la première date disponible
  // Ce hook recherche automatiquement la première date avec des créneaux disponibles,
  // même si elle se trouve dans plusieurs mois dans le futur
  useEffect(() => {
    // Ne s'exécuter que si les données nécessaires sont chargées
    if (!expertData?.schedules && !appointmentAllowDays?.length) {
      return;
    }

    // Date de référence : aujourd'hui à minuit (pour comparer les dates sans tenir compte de l'heure)
    const todayAtMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Fonction pour chercher la première date disponible dans un mois donné
    const findFirstAvailableDateInMonth = (
      searchDate: Date
    ): { day: number; found: boolean } => {
      const daysInMonth = getDaysInMonth(searchDate);

      // Parcourir tous les jours du mois
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          day
        );

        // Ignorer les dates passées
        const isFutureOrToday = dayDate >= todayAtMidnight;
        if (!isFutureOrToday) {
          continue;
        }

        // Vérifier si cette date a des créneaux disponibles
        const hasSlotsAvailable = hasAvailableSlots(dayDate);

        if (hasSlotsAvailable) {
          // Date trouvée !
          return { day, found: true };
        }
      }

      // Aucune date disponible trouvée dans ce mois
      return { day: 1, found: false };
    };

    // Étape 1 : Chercher dans le mois actuellement affiché
    const resultCurrentMonth = findFirstAvailableDateInMonth(currentDate);

    if (resultCurrentMonth.found) {
      // Date trouvée dans le mois actuel
      setSelectedDate(resultCurrentMonth.day);
      setSelectedTime("");
      return;
    }

    // Étape 2 : Si aucune date trouvée, chercher dans les mois suivants
    // On cherche jusqu'à 24 mois dans le futur
    let searchDate = new Date(currentDate);
    const maxMonthsToSearch = 24;

    for (let monthOffset = 1; monthOffset <= maxMonthsToSearch; monthOffset++) {
      searchDate = new Date(currentDate);
      searchDate.setMonth(currentDate.getMonth() + monthOffset);

      const result = findFirstAvailableDateInMonth(searchDate);

      if (result.found) {
        // Date trouvée dans un mois futur !
        // Naviguer automatiquement vers ce mois
        setCurrentDate(
          new Date(searchDate.getFullYear(), searchDate.getMonth(), 1)
        );
        setSelectedDate(result.day);
        setSelectedTime("");
        return;
      }
    }

    // Étape 3 : Aucune date disponible trouvée dans les 24 prochains mois
    // Sélectionner le premier jour par défaut
    if (selectedDate === null) {
      setSelectedDate(1);
    }
  }, [
    expertData?.schedules,
    appointmentAllowDays,
    appointmentBlocks,
    appointments,
    selectedDuration,
  ]);

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Jours vides du début du mois
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const dayDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      // Créer une date "today" à minuit pour comparaison correcte
      const todayAtMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      // Vérifier si c'est un jour futur ou aujourd'hui
      const isFutureOrToday = dayDate >= todayAtMidnight;

      // Vérifier si la date a des créneaux disponibles
      const hasSlotsAvailable = isFutureOrToday && hasAvailableSlots(dayDate);

      const isClickable = isFutureOrToday && hasSlotsAvailable;

      days.push(
        <div
          key={day}
          className={`
            p-2 text-center rounded-lg transition-all duration-200
            ${
              isSelected
                ? "bg-exford-blue text-white font-bold cursor-pointer"
                : isClickable
                ? "hover:bg-gray-100 text-gray-900 cursor-pointer"
                : "text-gray-300 cursor-not-allowed"
            }
          `}
          onClick={() => isClickable && handleDateClick(day)}
        >
          <span className="text-sm font-medium">{day}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className={`bg-white rounded-lg max-w-md mx-auto ${className} relative`}
    >
      {/* Overlay de chargement pendant la réservation */}
      {(createAppointmentMutation.isPending || isRedirecting) && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-4 p-8">
            <Loader2 className="w-12 h-12 text-cobalt-blue animate-spin" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900">
                {currentLocale === "fr"
                  ? "Préparation de votre réservation..."
                  : "Preparing your booking..."}
              </h3>
              <p className="text-sm text-gray-600">
                {currentLocale === "fr"
                  ? "Vous allez être redirigé vers la page de paiement"
                  : "You will be redirected to the payment page"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header avec retour */}
      <div className="h-[70px] flex items-center border-b border-gray-200">
        <ArrowLeft
          className="w-6 h-6 text-black cursor-pointer ml-10"
          onClick={() => setIsPlaning(false)}
        />
        <h2 className="text-xl font-bold text-black px-6">
          {currentLocale === "fr"
            ? "Planifier votre visio"
            : "Plan your video call"}
        </h2>
      </div>

      <div
        className={`p-6 ${
          createAppointmentMutation.isPending || isRedirecting
            ? "pointer-events-none opacity-50"
            : ""
        }`}
      >
        {/* Sélection de durée */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">
            {currentLocale === "fr"
              ? "Durée de la visio"
              : "Video call duration"}
          </h3>
          <div className="flex gap-2">
            {availableDurations.map((duration: any) => (
              <button
                key={duration.value}
                onClick={() => setSelectedDuration(duration.value)}
                disabled={createAppointmentMutation.isPending || isRedirecting}
                className={`
                rounded-lg text-base font-bold transition-colors w-[80px] h-[40px] cursor-pointer
                ${
                  selectedDuration === duration.value
                    ? "bg-cobalt-blue text-white"
                    : "bg-[#F0F6FF] text-[#003B87] hover:bg-[#F0F6FF]"
                }
                ${
                  createAppointmentMutation.isPending || isRedirecting
                    ? "cursor-not-allowed"
                    : ""
                }
              `}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation du calendrier */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth("next")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center">
              <span className="text-xs font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {renderCalendarDays()}
        </div>

        {/* Créneaux horaires */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">
            {currentLocale === "fr"
              ? "Créneaux disponibles"
              : "Available slots"}
          </h3>
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 justify-center gap-2 time-slots-grid">
              {timeSlots.map((slot: any) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`
                  relative p-3 rounded-lg text-sm font-medium transition-all w-[110px] cursor-pointer
                  ${
                    selectedTime === slot.time
                      ? "bg-exford-blue text-white"
                      : slot.available
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }
                ${slot.status === "taken" ? "text-left" : ""}`}
                >
                  {slot.time}
                  {slot.status && (
                    <span className="absolute top-3 left-[41%] w-[57px] h-[22px] bg-[#94A3B8] text-white text-[10px] font-bold rounded-[8px] flex justify-center items-center">
                      {currentLocale === "fr" ? "Complet" : "Full"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {currentLocale === "fr"
                  ? "Aucun créneau disponible pour ce jour."
                  : "No slots available for this day."}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {currentLocale === "fr"
                  ? "Veuillez sélectionner une autre date."
                  : "Please select another date."}
              </p>
            </div>
          )}
        </div>

        {/* Résumé et bouton de réservation */}
        <div className="border-t pt-4">
          <div className="mb-4">
            <PromoCodeInput
              onPromoResult={setPromoResult}
              placeholder={
                currentLocale === "fr"
                  ? "Entrer un code PROMO"
                  : "Enter a promo code"
              }
            />
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {currentLocale === "fr"
                ? "Visio 1:1"
                : "Quick video session"}{" "}
              - {selectedDuration}{" "}
              {currentLocale === "fr" ? "minutes" : "minutes"}
            </h4>
            <p className="text-sm text-gray-600">
              {selectedDate
                ? daysOfWeek[
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      selectedDate
                    ).getDay()
                  ]
                : "-"}{" "}
              {selectedDate ?? "-"}{" "}
              {months[currentDate.getMonth()].toLowerCase()}{" "}
              {currentDate.getFullYear()}{" "}
              {selectedTime ? (
                <>à {selectedTime}</>
              ) : (
                <span className="text-orange-500 font-medium">
                  {/* - {currentLocale === "fr" ? "Sélectionnez un créneau" : "Select a time slot"} */}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {sessionPrice} €
              </span>
              <p className="mt-1 text-xs font-normal text-gray-500">
                {t("offers.serviceFee")}: {feeFormatter.format(serviceFee)} €
              </p>
              {promoResult?.valid && promoDiscountDisplay ? (
                <p className="mt-1 text-xs font-medium text-cobalt-blue">
                  {t("offers.discount")}{" "}
                  <span className="font-semibold">({promoResult.code})</span>{" "}
                  {promoDiscountDisplay}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            label={
              createAppointmentMutation.isPending || isRedirecting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {currentLocale === "fr"
                      ? "Réservation en cours..."
                      : "Booking in progress..."}
                  </span>
                </div>
              ) : currentLocale === "fr" ? (
                "Réserver"
              ) : (
                "Book"
              )
            }
            onClick={handleReserve}
            disabled={
              timeSlots.length === 0 ||
              !selectedTime ||
              !selectedSession?.sessionId ||
              createAppointmentMutation.isPending ||
              isRedirecting
            }
            className={`w-full h-12 font-medium rounded-lg transition-all ${
              timeSlots.length === 0 ||
              !selectedTime ||
              !selectedSession?.sessionId ||
              createAppointmentMutation.isPending ||
              isRedirecting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-cobalt-blue hover:bg-cobalt-blue/90 text-white"
            }`}
          />
          {!isAuthenticated && (
            <p className="mt-2 text-xs text-gray-500 text-center">
              {t("calendar.guestLoginHint")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
