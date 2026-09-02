"use client";
import {
  useGetProAppointments,
  useUpdateProAppointment,
} from "@/api/appointments/useAppointments";
import { useGetInfoStripeAccount } from "@/api/proBank/useBank";
import { useGetOrganization } from "@/api/organization/useOrganization";
import { useOrganizationAppointments } from "@/api/organization/useOrganizationAppointments";
import { useOrganizationStatistics } from "@/api/organization/useOrganizationStatistics";
import RevenueScopeTabs, {
  type RevenueScope,
} from "@/components/revenue/RevenueScopeTabs";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { useGetStatistics } from "@/api/statistics/useStatistics";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { SessionCard } from "@/components/common/SessionCard";
import { StatsCard } from "@/components/common/StatsCard";
import { useTodayVisios } from "@/hooks/useTodayVisios";
import { useCallStore } from "@/store/useCall";
import { AlertCircle, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import VideoConsultation from "../VideoCall/video-consultation";

export default function Expert() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const tOrg = useTranslations("organization");

  const { isVideoCallOpen, setIsVideoCallOpen, setAppointmentId } =
    useCallStore();
  const { todayVisiosCount, user } = useTodayVisios();

  const [loadingStates, setLoadingStates] = useState<
    Record<string, "confirming" | "cancelling" | null>
  >({});
  const [dashboardScope, setDashboardScope] =
    useState<RevenueScope>("organization");
  const {
    mutateAsync: updateProAppointment,
    isPending: updateProAppointmentPending,
  } = useUpdateProAppointment();

  const handleStartVideoCall = (appointmentId: string) => {
    setAppointmentId(appointmentId);
    setIsVideoCallOpen(true);
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    setLoadingStates((prev) => ({ ...prev, [appointmentId]: "confirming" }));
    try {
      await updateProAppointment({
        appointmentId,
        updateData: {
          status: "confirmed",
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    setLoadingStates((prev) => ({ ...prev, [appointmentId]: "cancelling" }));
    try {
      await updateProAppointment({
        appointmentId,
        updateData: {
          status: "cancelled",
        },
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  const { data: proExpert, isLoading: proExpertLoading } = useGetProExpert();
  const { data: organizationData } = useGetOrganization();
  const isOrgMember =
    organizationData?.membership?.role === "member" &&
    organizationData?.membership?.status === "active";
  const isOrgOwner =
    organizationData?.membership?.role === "owner" &&
    organizationData?.membership?.status === "active";
  const showOrganizationDashboard =
    isOrgOwner && dashboardScope === "organization";

  const { data: statistics, isLoading: statisticsLoading } = useGetStatistics();
  const {
    data: organizationStatistics,
    isLoading: organizationStatisticsLoading,
    isFetching: organizationStatisticsFetching,
  } = useOrganizationStatistics(undefined, isOrgOwner);
  const {
    data: stripeAccountData,
    isLoading: stripeAccountLoading,
    error: stripeAccountError,
  } = useGetInfoStripeAccount();

  const capabilities = stripeAccountData?.account?.capabilities;
  const managedByOrganization =
    stripeAccountData?.managed_by_organization || isOrgMember;
  const isStripeAccountMissing =
    !managedByOrganization && !stripeAccountData?.account;
  const isCardPaymentsInactive =
    !managedByOrganization &&
    capabilities?.card_payments !== "active";
  const isTransfersInactive =
    !managedByOrganization && capabilities?.transfers !== "active";
  const hasStripeError =
    !managedByOrganization && Boolean(stripeAccountError);
  const isStripeStatusReady = !stripeAccountLoading;

  // Wait for Stripe response before deciding whether to show the alert
  const stripeAlertTitle =
    managedByOrganization || !isStripeStatusReady
      ? null
      : hasStripeError
        ? isOrgOwner
          ? tOrg("organizationStripeActionRequired")
          : t("stripeCreateAccountRequired")
        : isStripeAccountMissing
          ? isOrgOwner
            ? tOrg("organizationStripeActionRequired")
            : t("stripeCreateAccountRequired")
          : isCardPaymentsInactive || isTransfersInactive
            ? isOrgOwner
              ? tOrg("organizationStripeActionRequired")
              : t("stripeActionRequiredTitle")
            : null;

  const stripeAlertBullets = !stripeAlertTitle
    ? []
    : hasStripeError || isStripeAccountMissing
      ? []
      : [
          ...(isCardPaymentsInactive ? [t("stripeCardPayments")] : []),
          ...(isTransfersInactive ? [t("stripeTransfers")] : []),
        ];

  const handleRevenueRedirect = () => {
    router.push(`/${locale}/compte/revenus`);
  };

  // Filtrer uniquement les rendez-vous futurs (>= aujourd'hui à 00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const {
    data: personalAppointments,
    isLoading: personalAppointmentsLoading,
    isFetching: personalAppointmentsFetching,
  } = useGetProAppointments(proExpert?.id, {
      gteField: "appointment_at",
      gte: todayISO,
      orderBy: "appointment_at",
      orderDirection: "asc",
    });
  const {
    data: organizationAppointments,
    isLoading: organizationAppointmentsLoading,
    isFetching: organizationAppointmentsFetching,
  } = useOrganizationAppointments(
      {
        gteField: "appointment_at",
        gte: todayISO,
        orderBy: "appointment_at",
        orderDirection: "asc",
      },
      isOrgOwner,
    );

  const appointments = showOrganizationDashboard
    ? organizationAppointments
    : personalAppointments;
  const appointmentsLoading = showOrganizationDashboard
    ? organizationAppointmentsLoading
    : personalAppointmentsLoading;
  const appointmentsFetching = showOrganizationDashboard
    ? organizationAppointmentsFetching
    : personalAppointmentsFetching;
  const isScopeLoading =
    appointmentsLoading ||
    appointmentsFetching ||
    (isOrgOwner && organizationStatisticsFetching);

  const dashboardStats = showOrganizationDashboard
    ? organizationStatistics?.organization
    : isOrgOwner
      ? organizationStatistics?.personal ?? statistics
      : statistics;

  // Calculer le nombre de demandes en attente
  const pendingAppointments = Array.isArray(appointments)
    ? appointments.filter(
        (appointment: any) => appointment.status === "pending",
      )
    : [];
  const pendingCount = pendingAppointments.length;

  if (proExpertLoading) {
    return <LoadingScreen message={t("loading")} size="md" />;
  }

  const formatSessionDescription = (appointment: any) => {
    return appointment.session?.name || t("session");
  };

  const getMemberAppointmentMeta = (appointment: any) => {
    if (!showOrganizationDashboard) {
      return {
        assignedProName: undefined as string | undefined,
        assignedProAvatar: undefined as string | undefined,
        readOnly: false,
      };
    }
    const isOtherMember = appointment.pro_id !== proExpert?.id;
    const proName =
      `${appointment.pro?.first_name || ""} ${appointment.pro?.last_name || ""}`.trim();
    return {
      assignedProName: isOtherMember && proName ? proName : undefined,
      assignedProAvatar:
        isOtherMember && appointment.pro?.avatar
          ? appointment.pro.avatar
          : undefined,
      readOnly: isOtherMember,
    };
  };

  return (
    <>
      {/* Contenu principal */}
      {isVideoCallOpen ? (
        <VideoConsultation
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
        />
      ) : (
        <div>
          {" "}
          <div>
            <h1 className="text-xl font-semibold text-exford-blue font-figtree mt-5">
              {t("home.hello")}{" "}
              {user ? `${user.first_name} ${user.last_name}` : t("home.user")}
            </h1>
            <p className="text-sm font-medium text-exford-blue font-figtree">
              {t("home.youHave")} {todayVisiosCount}{" "}
              {todayVisiosCount > 1
                ? t("home.visiosTodayPlural")
                : t("home.visiosToday")}
            </p>
          </div>
          {isOrgOwner && (
            <div className="mt-5">
              <RevenueScopeTabs
                value={dashboardScope}
                onChange={setDashboardScope}
              />
            </div>
          )}
          <div className="w-full flex gap-x-6 mt-5">
            <StatsCard
              title={t("home.completedVisios")}
              value={dashboardStats?.count ?? 0}
              className="w-full"
              isLoading={isOrgOwner && isScopeLoading}
            />
            <StatsCard
              title={t("home.earningsSummary")}
              value={dashboardStats?.totalPrice ?? 0}
              currency="€"
              className="w-full"
              isLoading={isOrgOwner && isScopeLoading}
            />
          </div>
          {stripeAlertTitle && (
            <button
              type="button"
              onClick={handleRevenueRedirect}
              className="mt-3 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left transition-colors hover:bg-red-100"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="pt-1 text-sm font-semibold leading-5 text-red-700">
                  {stripeAlertTitle}
                </p>
                {stripeAlertBullets.map((item) => (
                  <p key={item} className="text-sm leading-5 text-red-700">
                    {"\u2022"} {item}
                  </p>
                ))}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-red-600" />
            </button>
          )}
          {/* <div className="lg:hidden w-[90%] mx-auto mt-5 bg-white rounded-[20px] border border-soft-ice-gray px-6">
            <div className="px-6 py-4 flex justify-center items-center gap-x-2">
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => router.push("/visios")}
              >
                <Image
                  src="/assets/icons/videorecord.svg"
                  alt="search"
                  width={26}
                  height={26}
                />
                <span className="absolute top-1.5 right-0.5 pt-[1px] bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              </button>
              <p className="text-sm font-bold font-figtree text-cobalt-blue-500">
                {t("home.pendingRequests")}
              </p>
              {pendingCount > 3 && (
                <Link
                  href="/visios"
                  className="flex items-center gap-2 text-black font-figtree"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div> */}
          {/* <div className="hidden lg:flex w-full justify-between gap-2 mb-[10px] mt-[24px]">
            <h1 className="text-lg font-bold font-figtree text-cobalt-blue-500">
              {t("home.pendingRequests")}
            </h1>
            {pendingCount > 3 && (
              <Link
                href="/visios"
                className="flex items-center gap-2 text-cobalt-blue font-figtree cursor-pointer"
              >
                {t("home.seeAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div> */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-5">
            {isScopeLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SessionCard
                  key={`skeleton-pending-${i}`}
                  isLoading={true}
                  date=""
                  time=""
                  profileImage=""
                  name=""
                  sessionDescription=""
                />
              ))
            ) : Array.isArray(appointments) && appointments.length > 0 ? (
              appointments
                .filter((appointment: any) => appointment.type !== "calendar")
                .filter((appointment: any) => appointment.status === "pending")
                .map((appointment: any) => {
                  const appointmentDate = new Date(appointment.appointment_at);
                  const today = new Date();
                  const isToday =
                    appointmentDate.toDateString() === today.toDateString();
                  const dateDisplay = isToday
                    ? t("today")
                    : appointmentDate.toLocaleDateString("fr-FR");
                  const timeDisplay = appointmentDate.toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  );
                  const { assignedProName, assignedProAvatar, readOnly } =
                    getMemberAppointmentMeta(appointment);

                  return (
                    <SessionCard
                      key={appointment.id}
                      date={dateDisplay}
                      time={timeDisplay}
                      profileImage={appointment.patient?.avatar || ""}
                      name={
                        `${appointment.patient?.first_name || ""} ${
                          appointment.patient?.last_name || ""
                        }`.trim() || t("patient")
                      }
                      sessionDescription={formatSessionDescription(appointment)}
                      onAccept={() => handleConfirmAppointment(appointment.id)}
                      onCancel={() => handleCancelAppointment(appointment.id)}
                      onViewRequest={() => {}}
                      isFlex1={true}
                      questions={appointment.appointment_questions || []}
                      loadingState={loadingStates[appointment.id] || null}
                      conversationParticipantId={
                        appointment.patient?.id ||
                        appointment.patient_id ||
                        appointment.patient?.user_id
                      }
                      assignedProName={assignedProName}
                      assignedProAvatar={assignedProAvatar}
                      readOnly={readOnly}
                    />
                  );
                })
            ) : (
              <div className="col-span-full text-center py-0 text-gray-500">
                {/* {t("home.noPendingRequests")} */}
              </div>
            )}
          </div>
          <div className="w-full gap-2 mt-5">
            <h1 className="text-lg font-bold font-figtree text-cobalt-blue-500 mb-[11px] mt-[19px]">
              {t("home.nextVisio")}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-20">
              {isScopeLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SessionCard
                    key={`skeleton-next-${i}`}
                    isLoading={true}
                    date=""
                    time=""
                    profileImage=""
                    name=""
                    sessionDescription=""
                  />
                ))
              ) : Array.isArray(appointments) && appointments.length > 0 ? (
                appointments
                  .filter((appointment: any) => appointment.type !== "calendar") // Exclure les rendez-vous de type calendar
                  .filter(
                    (appointment: any) => appointment.status === "confirmed",
                  )
                  .filter((appointment: any) => {
                    // Calculer l'heure de fin du rendez-vous (date + durée)
                    const appointmentDate = new Date(
                      appointment.appointment_at,
                    );
                    const sessionDuration =
                      appointment.session?.session_type || "30mn";

                    // Extraire les minutes de la durée (ex: "30mn" -> 30, "1h" -> 60)
                    let durationMinutes = 30; // Valeur par défaut
                    if (sessionDuration.includes("mn")) {
                      durationMinutes = parseInt(sessionDuration);
                    } else if (sessionDuration.includes("h")) {
                      durationMinutes = parseInt(sessionDuration) * 60;
                    }

                    // Calculer l'heure de fin
                    const endTime = new Date(
                      appointmentDate.getTime() + durationMinutes * 60000,
                    );
                    const now = new Date();

                    // Garder seulement si l'heure de fin n'est pas encore passée
                    return endTime > now;
                  })
                  .map((appointment: any) => {
                    const appointmentDate = new Date(
                      appointment.appointment_at,
                    );
                    const today = new Date();
                    const isToday =
                      appointmentDate.toDateString() === today.toDateString();
                    const dateDisplay = isToday
                      ? t("today")
                      : appointmentDate.toLocaleDateString("fr-FR");
                    const timeDisplay = appointmentDate.toLocaleTimeString(
                      "fr-FR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );
                    const sessionDuration =
                      appointment.session?.session_type || "30mn";
                    const { assignedProName, assignedProAvatar, readOnly } =
                      getMemberAppointmentMeta(appointment);

                    return (
                      <SessionCard
                        key={appointment.id}
                        date={dateDisplay}
                        time={timeDisplay}
                        profileImage={
                          appointment.patient?.avatar &&
                          appointment.patient?.avatar !== "undefined"
                            ? appointment.patient.avatar
                            : ""
                        }
                        name={
                          `${appointment.patient?.first_name || ""} ${
                            appointment.patient?.last_name || ""
                          }`.trim() || t("patient")
                        }
                        sessionDescription={formatSessionDescription(appointment)}
                        onAccept={() => handleStartVideoCall(appointment.id)}
                        onViewRequest={() => {}}
                        isComming={true}
                        isUpcoming={true}
                        duration={sessionDuration}
                        classFooter="!flex-col"
                        textButton={t("visios.startVideo")}
                        icon="/assets/icons/videocamera.svg"
                        questions={appointment.appointment_questions || []}
                        buttonStates={{
                          acceptDisabled:
                            new Date(appointment.appointment_at) > new Date(),
                        }}
                        appointmentAt={appointment.appointment_at}
                        conversationParticipantId={
                          appointment.patient?.id ||
                          appointment.patient_id ||
                          appointment.patient?.user_id
                        }
                        assignedProName={assignedProName}
                        assignedProAvatar={assignedProAvatar}
                        readOnly={readOnly}
                      />
                    );
                  })
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {t("home.noScheduledVisio")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
