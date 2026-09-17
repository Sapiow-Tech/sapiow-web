"use client";
import { useGetProAppointmentBlocks } from "@/api/appointments/useAppointments";
import {
  useGoogleCalendarDisconnect,
  useGoogleCalendarStatus,
} from "@/api/google-calendar-sync/useGoogleCalendarSync";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { AvailabilityButtons } from "@/components/common/AvailabilityButtons";
import AvailabilitySheet from "@/components/common/AvailabilitySheet";
import CustomCalendar from "@/components/common/CustomCalendar";
import GoogleCalendarConnectButton from "@/components/common/GoogleCalendarConnectButton";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { PeriodType } from "@/components/common/PeriodToggle";
import { SessionDetailsPanel } from "@/components/common/SessionDetailsPanel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobileOrTablet } from "@/hooks/use-mobile-tablet";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useVisiosAppointments } from "@/hooks/useVisiosAppointments";
import { useCalendarStore } from "@/store/useCalendar";
import { useProExpertStore } from "@/store/useProExpert";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import AccountLayout from "../AccountLayout";

export default function Disponibilites() {
  // Protéger la page : seuls les experts peuvent y accéder
  useProtectedPage({ allowedUserTypes: ["expert"] });
  const t = useTranslations();
  const currentLocale = useLocale();

  // Hook de détection mobile/tablette (< 1024px)
  const isMobileOrTablet = useIsMobileOrTablet();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("semaine");
  const { selectedDate } = useCalendarStore();
  // Supprimé car maintenant calculé dynamiquement avec isDateBlocked
  const [showTimeSlotsManager, setShowTimeSlotsManager] = useState(false);
  const [showAvailabilitySheet, setShowAvailabilitySheet] = useState(false);
  const [showSessionDetailsSheet, setShowSessionDetailsSheet] = useState(false);

  // Hooks Google Calendar
  const { data: googleStatus, isLoading: isGoogleStatusLoading } =
    useGoogleCalendarStatus();

  const disconnectMutation = useGoogleCalendarDisconnect();

  // États dérivés
  const isGoogleConnected = googleStatus?.connected || false;
  const isGoogleLoading = disconnectMutation.isPending;

  const handleDisconnectGoogle = async () => {
    try {
      await disconnectMutation.mutateAsync();
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  };

  // API et Store pour synchroniser les données proExpert
  const { data: proExpertData, isLoading: isLoadingApi } = useGetProExpert();
  const { setProExpertData, setLoading } = useProExpertStore();

  // Hook pour récupérer les rendez-vous confirmés
  const { confirmedAppointments } = useVisiosAppointments();

  // Hook pour récupérer les dates bloquées
  const { data: blockedDates, isLoading: isLoadingBlocks } =
    useGetProAppointmentBlocks();

  // Fonction réutilisable pour éviter la duplication mobile/desktop
  const renderSessionDetailsPanel = (isMobile: boolean = false) => (
    <SessionDetailsPanel
      selectedDate={selectedDate}
      showTimeSlotsManager={showTimeSlotsManager}
      confirmedAppointments={confirmedAppointments}
      isMobile={isMobile}
    />
  );

  // Synchroniser les données API avec le store
  useEffect(() => {
    setLoading(isLoadingApi);
    if (proExpertData) {
      setProExpertData(proExpertData);
    }
  }, [proExpertData, isLoadingApi, setProExpertData, setLoading]);

  const handleManageAvailability = () => {
    setShowAvailabilitySheet(true);
  };

  // Ouvrir automatiquement le sheet sur mobile/tablette (< 1024px) quand une date est sélectionnée
  useEffect(() => {
    if (selectedDate && isMobileOrTablet) {
      setShowSessionDetailsSheet(true);
    }
  }, [selectedDate, isMobileOrTablet]);

  // Afficher un loader si les données essentielles se chargent
  if (isLoadingApi || isGoogleStatusLoading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingScreen message={t("loading")} size="md" fullScreen={false} />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout className="">
      <AvailabilitySheet
        isOpen={showAvailabilitySheet}
        onClose={() => setShowAvailabilitySheet(false)}
      />

      {/* Sheet pour MOBILE et TABLETTE (< 1024px) - Sur desktop, le panneau est fixe à droite */}
      {isMobileOrTablet && (
        <Sheet
          open={showSessionDetailsSheet}
          onOpenChange={setShowSessionDetailsSheet}
        >
          <SheetContent
            side="bottom"
            className="h-[80vh] overflow-y-auto bg-white"
          >
            <SheetHeader>
              <SheetTitle>
                {selectedDate
                  ? selectedDate.toLocaleDateString(
                      currentLocale === "fr" ? "fr-FR" : "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : t("disponibilites.sessionDetails")}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col items-center justify-center">
              {renderSessionDetailsPanel(true)}
            </div>
          </SheetContent>
        </Sheet>
      )}

      <div className="space-y-0 w-full pr-6">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-x-4 lg:gap-x-0 gap-y-8 lg:gap-y-0">
          <div className="w-full space-y-0 relative">
            <div className="w-full flex items-center justify-center">
              {/* <PeriodToggle
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                size="sm"
              /> */}
            </div>
            <div className="w-full mx-auto">
              <CustomCalendar
                confirmedAppointments={confirmedAppointments}
                schedules={proExpertData?.schedules || []}
                blockedDates={Array.isArray(blockedDates) ? blockedDates : []}
                availabilityStartDate={
                  proExpertData?.availability_start_date || null
                }
                availabilityEndDate={
                  proExpertData?.availability_end_date || null
                }
              />
            </div>
            {/* Section Gestion des disponibilités */}
            <div className="space-y-4 w-[90%] mx-auto pb-6">
              <AvailabilityButtons
                onManageAvailability={handleManageAvailability}
                isGoogleConnected={isGoogleConnected}
                connectedEmail={googleStatus?.email}
                onDisconnect={handleDisconnectGoogle}
                isDisconnecting={disconnectMutation.isPending}
              />

              {/* Afficher la card de connexion seulement si Google Calendar n'est pas connecté */}
              {!isGoogleConnected && (
                <Card className="w-full fixed bottom-16 lg:bottom-0 max-w-[380px] bg-white border-none shadow-none h-[183px] mt-4">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="text-base font-bold font-figtree text-black">
                        {t("disponibilites.googleCalendarSync")}
                      </h4>
                      <p className="text-sm font-medium font-figtree text-slate-600">
                        {t("disponibilites.googleCalendarDescription")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center border border-frost-gray rounded-[12px] p-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={"/assets/icons/googleCalendar.svg"}
                          width={41}
                          height={41}
                          alt="google"
                        />
                        <div>
                          <p className="text-sm font-medium font-figtree text-slate-600">
                            {t("disponibilites.googleCalendar")}
                          </p>
                          <p className="text-sm font-medium font-figtree text-slate-600">
                            {t("disponibilites.notConnected")}
                          </p>
                        </div>
                      </div>
                      <GoogleCalendarConnectButton
                        isLoading={isGoogleLoading}
                        className="text-sm font-bold font-figtree text-black"
                        redirectPath="/compte/disponibilites"
                      >
                        {t("disponibilites.connect")}
                      </GoogleCalendarConnectButton>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Divider vertical - visible sur desktop uniquement (≥ 1024px) */}
          <div className="hidden lg:block bg-soft-ice-gray w-[2px] min-h-screen"></div>

          {/* Panneau de détails des sessions - visible sur desktop uniquement (≥ 1024px) */}
          <div className="hidden lg:flex flex-col justify-between items-end mt-7 w-full ml-auto pl-6">
            {renderSessionDetailsPanel(false)}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
