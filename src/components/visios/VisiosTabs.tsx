"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisiosAppointments } from "@/hooks/useVisiosAppointments";
import { useCallStore } from "@/store/useCall";
import { useTranslations } from "next-intl";
import CustomCalendar from "../common/CustomCalendar";
import { SessionCard } from "../common/SessionCard";

interface VisiosTabsProps {
  onStartVideoCall: (appointmentId: string) => void;
}

export const VisiosTabs = ({ onStartVideoCall }: VisiosTabsProps) => {
  const t = useTranslations();
  const { setCallCreatorName } = useCallStore();
  const {
    confirmedAppointments,
    pendingAppointments,
    historicAppointments,
    loadingStates,
    isLoading,
    handleConfirmAppointment,
    handleCancelAppointment,
    handleStartVideoCall,
  } = useVisiosAppointments();
  console.log({ confirmedAppointments });
  const handleStartVideoCallCombined = (
    appointmentId: string,
    patientName?: string
  ) => {
    // Stocker le nom du patient si disponible
    if (patientName) {
      setCallCreatorName(patientName);
    }
    // Exécuter la logique interne du hook
    handleStartVideoCall(appointmentId);
    // Puis déclencher l'ouverture de VideoConsultation dans Expert
    onStartVideoCall(appointmentId);
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4 mt-3 px-4 pb-20">
      <Tabs defaultValue="a-venir" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border-b-2 border-light-blue-gray h-auto p-0 rounded-none relative border-t-0 border-l-0 border-r-0">
          <TabsTrigger
            value="a-venir"
            className="relative px-4 py-4 text-lg font-bold text-slate-400 bg-transparent border-0 outline-none ring-0 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:border-0 data-[state=active]:outline-none hover:text-slate-900 hover:border-0 focus:border-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-[-3px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-slate-900 cursor-pointer font-figtree"
          >
            {t("visios.upcoming")}
          </TabsTrigger>
          {/* <TabsTrigger
            value="en-attente"
            className="relative px-4 py-4 text-lg font-bold text-slate-400 bg-transparent border-0 outline-none ring-0 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:border-0 data-[state=active]:outline-none hover:text-slate-900 hover:border-0 focus:border-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-[-3px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-slate-900 cursor-pointer font-figtree"
          >
            {t("visios.pending")}
            {pendingAppointments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-0"></span>
            )}
          </TabsTrigger> */}
          <TabsTrigger
            value="historique"
            className="relative px-4 py-4 text-lg font-bold text-slate-400 bg-transparent border-0 outline-none ring-0 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:border-0 data-[state=active]:outline-none hover:text-slate-900 hover:border-0 focus:border-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-[-3px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-slate-900 cursor-pointer font-figtree"
          >
            {t("visios.history")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="a-venir" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 items-start">
            {confirmedAppointments.length > 0 ? (
              confirmedAppointments.map((appointment: any) => {
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
                  }
                );

                const patientName =
                  `${appointment.patient?.first_name || ""} ${
                    appointment.patient?.last_name || ""
                  }`.trim() || t("patient");
                const sessionDuration =
                  appointment.session?.session_type || "30mn";

                return (
                  <SessionCard
                    key={appointment.id}
                    date={dateDisplay}
                    time={timeDisplay}
                    isLoading={isLoading}
                    profileImage={
                      appointment.patient?.avatar || ""
                    }
                    name={patientName}
                    sessionDescription={
                      appointment.session?.name || t("session")
                    }
                    onAccept={() =>
                      handleStartVideoCallCombined(appointment.id, patientName)
                    }
                    onViewRequest={() => {}}
                    isComming={true}
                    duration={sessionDuration}
                    classFooter="!flex-col"
                    textButton={t("visios.startVideo")}
                    icon="/assets/icons/videocamera.svg"
                    isUpcoming={true}
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
                  />
                );
              })
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SessionCard
                  key={`skeleton-a-venir-${i}`}
                  isLoading={true}
                  date=""
                  time=""
                  profileImage=""
                  name=""
                  sessionDescription=""
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {t("visios.noUpcomingVisios")}
              </div>
            )}
          </div>
        </TabsContent>

        {/* <TabsContent value="en-attente" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 items-start">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment: any) => {
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
                  }
                );

                const loadingState = loadingStates[appointment.id];

                return (
                  <SessionCard
                    key={appointment.id}
                    date={dateDisplay}
                    time={timeDisplay}
                    profileImage={
                      appointment.patient?.avatar || ""
                    }
                    name={
                      `${appointment.patient?.first_name || ""} ${
                        appointment.patient?.last_name || ""
                      }`.trim() || t("patient")
                    }
                    sessionDescription={
                      appointment.session?.name || t("session")
                    }
                    onAccept={() => handleConfirmAppointment(appointment.id)}
                    onCancel={() => handleCancelAppointment(appointment.id)}
                    onViewRequest={() => {}}
                    textButton={t("accept")}
                    questions={appointment.appointment_questions || []}
                    loadingState={loadingState}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {t("visios.noPendingRequests")}
              </div>
            )}
          </div>
        </TabsContent> */}

        <TabsContent value="historique" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 items-start">
            {historicAppointments.length > 0 ? (
              historicAppointments.map((appointment: any) => {
                const appointmentDate = new Date(appointment.appointment_at);
                const dateDisplay = appointmentDate.toLocaleDateString("fr-FR");
                const timeDisplay = appointmentDate.toLocaleTimeString(
                  "fr-FR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <SessionCard
                    key={appointment.id}
                    date={dateDisplay}
                    time={timeDisplay}
                    isLoading={isLoading}
                    profileImage={
                      appointment.patient?.avatar || ""
                    }
                    name={
                      `${appointment.patient?.first_name || ""} ${
                        appointment.patient?.last_name || ""
                      }`.trim() || t("patient")
                    }
                    sessionDescription={
                      appointment.session?.name || t("session")
                    }
                    onViewRequest={() => {}}
                    textButton={
                      appointment.status === "cancelled"
                        ? t("visios.cancelled")
                        : t("visios.completed")
                    }
                    buttonStates={{ acceptDisabled: true, viewDisabled: true }}
                    isUpcoming={true}
                    questions={appointment.appointment_questions || []}
                  />
                );
              })
            ) : isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SessionCard
                  key={`skeleton-history-${i}`}
                  isLoading={true}
                  date=""
                  time=""
                  profileImage=""
                  name=""
                  sessionDescription=""
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {t("visios.noHistoryVisios")}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className="w-full max-w-[343px] mx-auto">
        <CustomCalendar
          className="hidden xl:block"
          confirmedAppointments={confirmedAppointments}
        />
      </div>
    </div>
  );
};
