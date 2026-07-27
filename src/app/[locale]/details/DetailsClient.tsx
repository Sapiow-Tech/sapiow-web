"use client";
import confettiAnimation from "@/assets/confetti.json";
import Accordion from "@/components/common/Accordion";
import BookedSessionCard from "@/components/common/BookedSessionCard";
import { Button } from "@/components/common/Button";
import HowItWorksCard from "@/components/common/HowItWorksCard";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import VisioPlanningCalendar from "@/components/common/VisioPlanningCalendar";
import { HeaderClient } from "@/components/layout/header/HeaderClient";
import { AppSidebar } from "@/components/layout/Sidebare";
import { Badge } from "@/components/ui/badge";
import { Button as ButtonUI } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePayStore } from "@/store/usePay";
import { usePlaningStore } from "@/store/usePlaning";
import Lottie from "lottie-react";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import OfferSelection from "../home/OfferSelection";
import ProfessionalCard from "../home/ProfessionalCard";

import { useGetPatientAppointments } from "@/api/appointments/useAppointments";
import { useGetCustomer } from "@/api/customer/useCustomer";
import { Expert, useSearchExperts } from "@/api/listExpert/useListExpert";
import {
  useGetProExpert,
  useGetProExpertById,
} from "@/api/proExpert/useProExpert";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsMobileOrTablet } from "@/hooks/use-mobile-tablet";
import { useDetailsLogic } from "@/hooks/useDetailsLogic";
import { useUserStore } from "@/store/useUser";
import { authUtils } from "@/utils/auth";
import { useLocale, useTranslations } from "next-intl";

// Type definitions based on actual API response
interface Patient {
  id: string;
  avatar: string | null;
  domains: any;
  user_id: string;
  language: string;
  first_name?: string;
  last_name?: string;
}

interface Pro {
  id: string;
  job: string;
  avatar: string;
  domains: any;
  user_id: string;
  first_name?: string;
  last_name?: string;
}

interface Session {
  created_at: string;
  exclusive_ressources: boolean;
  id: string;
  is_active: boolean;
  mentorship: boolean;
  name: string;
  one_on_one: boolean;
  price: number;
  pro_id: string;
  session_nature: string;
  session_type: string | null;
  strategic_session: boolean;
  support: boolean;
  updated_at: string;
  video_call: boolean;
  webinar: boolean;
}

interface Appointment {
  appointment_at: string;
  appointment_questions: any[];
  created_at: string;
  id: string;
  patient: Patient;
  patient_id: string;
  pro: Pro;
  pro_id: string;
  session: Session;
  session_id: string;
  status: string;
  updated_at: string;
}

function ProfessionalDetailContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authUtils.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const { data: customer } = useGetCustomer(isAuthenticated);
  const { data: appointments, isLoading: isLoadingAppointments } =
    useGetPatientAppointments(customer?.id, {
      orderBy: "created_at",
      orderDirection: "desc",
    }) as {
      data: Appointment[];
      isLoading: boolean;
    };
  const { user: userClient } = useUserStore();
  const isMobile = useIsMobile();
  const isMobileOrTablet = useIsMobileOrTablet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isPaid } = usePayStore();
  const { isPlaning } = usePlaningStore();

  // Récupérer l'ID depuis les paramètres de recherche
  const expertId = searchParams.get("id");

  // Utiliser le hook API pour récupérer l'expert
  const {
    data: expertData,
    isLoading,
    error,
  } = useGetProExpertById(expertId || "");

  const { data: myProProfile } = useGetProExpert(isAuthenticated);

  const {
    data: expertsimilar,
    isLoading: isLoadingExpertSimilar,
    error: errorExpertSimilar,
  } = useSearchExperts({
    search: expertData?.domain_id?.toString(),
    searchFields: "domain_id",
  });

  // Utilisation du hook pour isoler la logique
  const {
    professional,
    expertiseNames,
    isOfferSheetOpen,
    isDescriptionExpanded,
    toggleLike,
    isLiked,
    setIsOfferSheetOpen,
    toggleDescriptionExpanded,
    setIsDescriptionExpanded,
  } = useDetailsLogic(expertData, { favoritesEnabled: isAuthenticated });
  console.log("professional", professional);

  const priceNumberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  const bookedProfessionalName = useMemo(() => {
    const first =
      appointments?.[0]?.pro?.first_name ??
      professional?.first_name ??
      (expertData as any)?.first_name;
    const last =
      appointments?.[0]?.pro?.last_name ??
      professional?.last_name ??
      (expertData as any)?.last_name;
    const fullName = [first, last]
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      .join(" ");
    return fullName || t("sessionDetail.expert");
  }, [appointments, professional, expertData, t]);

  const bookedProfileImage =
    appointments?.[0]?.pro?.avatar ||
    professional?.image ||
    professional?.avatar ||
    (expertData as any)?.image ||
    "/assets/icons/pro2.png";

  const startingFromPrice = useMemo(() => {
    const sessions = Array.isArray(expertData?.sessions)
      ? expertData.sessions
      : [];
    const oneTimeActive = sessions.filter(
      (s: any) => s?.is_active === true && s?.session_nature === "one_time",
    );
    const oneTimeActiveVideo = oneTimeActive.filter(
      (s: any) => s?.video_call === true,
    );
    const candidates =
      oneTimeActiveVideo.length > 0 ? oneTimeActiveVideo : oneTimeActive;

    if (candidates.length === 0) return "";

    const min = candidates.reduce((acc: number, s: any) => {
      const price = typeof s?.price === "number" ? s.price : Number(s?.price);
      return Number.isFinite(price) ? Math.min(acc, price) : acc;
    }, Number.POSITIVE_INFINITY);

    if (!Number.isFinite(min)) return "";
    return `${priceNumberFormatter.format(min)} €`;
  }, [expertData?.sessions, priceNumberFormatter]);

  // Ref et état pour détecter si la description est tronquée
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false);

  // Vérifier si la description dépasse réellement la zone visible (7 lignes)
  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;

    const checkTruncation = () => {
      if (isDescriptionExpanded) {
        // Mesurer si le contenu tiendrait encore en 7 lignes une fois replié
        const style = window.getComputedStyle(el);
        let lineHeight = parseFloat(style.lineHeight);
        if (!Number.isFinite(lineHeight)) {
          lineHeight = parseFloat(style.fontSize) * 1.625;
        }
        const exceeds = el.scrollHeight > lineHeight * 7 + 1;
        setIsDescriptionTruncated(exceeds);
        if (!exceeds) {
          setIsDescriptionExpanded(false);
        }
        return;
      }

      // Avec line-clamp : scrollHeight > clientHeight = texte tronqué
      const truncated = el.scrollHeight > el.clientHeight + 1;
      setIsDescriptionTruncated(truncated);
    };

    checkTruncation();
    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(el);
    window.addEventListener("resize", checkTruncation);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkTruncation);
    };
  }, [expertData?.description, isDescriptionExpanded, setIsDescriptionExpanded]);

  // Parser extra_data pour obtenir les questions et expectations personnalisées
  const customQuestions: string[] = [];
  const customExpectations: string[] = [];

  if (expertData?.extra_data) {
    try {
      const parsed = JSON.parse(expertData.extra_data);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        customQuestions.push(...parsed.questions);
      }
      if (parsed.expectations && Array.isArray(parsed.expectations)) {
        customExpectations.push(...parsed.expectations);
      }
    } catch (e) {
      console.error("Erreur lors du parsing de extra_data:", e);
    }
  }

  // Utiliser uniquement les questions personnalisées (pas de valeurs par défaut)
  const questionsToDisplay = customQuestions;

  // Utiliser uniquement les expectations personnalisées (pas de valeurs par défaut)
  const expectationsToDisplay = customExpectations;

  useEffect(() => {
    if (!expertId) {
      router.push("/");
    }
  }, [expertId, router]);

  useEffect(() => {
    if (isAuthenticated && userClient.type === "expert") {
      router.push("/");
    }
  }, [isAuthenticated, userClient, router]);

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen message={t("loading")} size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">
            {t("expertDetails.errorLoadingExpert")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || t("expertDetails.expertNotFound")}
          </p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            {t("expertDetails.expertNotFound")}
          </p>
        </div>
      </div>
    );
  }

  const isExpertLiked = professional ? isLiked(String(professional.id)) : false;

  // Dimensions responsive pour l'image
  const imageWidth = isMobile ? 358 : 303;
  const imageHeight = 378;
  const maxWidth = isMobile ? "max-w-[358px]" : "max-w-[303px]";
  return (
    <div className="flex w-full">
      <AppSidebar />
      <div className="w-full flex-1">
        <HeaderClient isBack classNameIsBack="py-1" />
        {/* <Expert /> */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_386px] gap-6 pl-5 pb-20 lg:pb-0 pr-5 md:pr-0 bg-white">
          <div className="w-full min-w-0 overflow-hidden">
            {/* Photo + À propos : s'élargit sur grands écrans */}
            <div className="w-full max-w-[753px] 2xl:max-w-[calc(100%-3rem)]">
              <div className="flex justify-center flex-col md:flex-row gap-6 mt-3">
                <div className="relative flex-shrink-0">
                  <ProfessionalCard
                    professional={{
                      ...professional,
                      description: professional.job || professional.description,
                      topExpertise: professional.topExpertise || false,
                    }}
                    isLiked={isExpertLiked}
                    onToggleLike={() => toggleLike(String(professional.id))}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                    maxWidth={maxWidth}
                    lineClamp={1}
                    nameSize="text-[20px]"
                    iconSize={24}
                    showPrice={false}
                  />
                </div>

                <div className="flex-1 space-y-4 min-w-0 overflow-hidden">
                  <div>
                    <h2 className="xl:text-base text-sm font-bold mb-1 font-figtree mt-3">
                      {t("expertDetails.about")}
                    </h2>
                    <p
                      ref={descriptionRef}
                      className={`text-gray-700 leading-relaxed font-figtree xl:text-base text-sm overflow-hidden break-words whitespace-pre-line ${
                        isDescriptionExpanded ? "" : "line-clamp-[7]"
                      }`}
                    >
                      {expertData?.description}
                    </p>
                    {/* Afficher le bouton uniquement si le texte est tronqué */}
                    {isDescriptionTruncated && (
                      <ButtonUI
                        onClick={toggleDescriptionExpanded}
                        variant="link"
                        className="text-sm font-bold p-0 h-auto text-cobalt-blue underline cursor-pointer"
                      >
                        {isDescriptionExpanded
                          ? t("expertDetails.seeLess")
                          : t("expertDetails.seeMore")}{" "}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </ButtonUI>
                    )}
                  </div>

                  <div className="min-w-0 overflow-hidden">
                    <h3 className="text-sm text-[#374151] font-semibold mb-3">
                      {t("expertDetails.expertiseDomains")}
                    </h3>
                    <div className="w-full flex gap-2 flex-wrap">
                      {expertiseNames?.map(
                        (expertiseName: string, index: number) => (
                          <Badge
                            key={index}
                            className="p-2 text-xs lg:text-[10px] xl:text-xs text-[#1F2937] font-medium bg-[#F3F4F6] hover:bg-[#F3F4F6] max-w-full mb-2 break-words"
                            variant="secondary"
                          >
                            {expertiseName}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  {/* <Card className="bg-ice-blue border-ice-blue shadow-none h-[72px] p-0 min-w-0 overflow-hidden">
                    <CardContent className="p-4 text-center min-w-0 overflow-hidden">
                      <p className="text-[13px] lg:text-[11px] xl:text-base text-gray-700 font-figtree font-normal lg:font-medium xl:font-normal break-words overflow-hidden">
                        {t("expertDetails.revenueDestination")} <br />
                        <span className="text-[13px] lg:text-[11px] xl:text-base font-bold font-figtree">
                          {t("expertDetails.foundations")}
                        </span>
                      </p>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            </div>

            {/* Sections à largeur fixe pour conserver un gap constant */}
            <div className="w-full max-w-[753px]">
              {/* Questions and Expectations */}
              {/* <div className="grid md:grid-cols-2 gap-8 mt-7.5 mb-15 min-w-0">
                <div className="bg-soft-ice-gray px-1 py-0.5 rounded-[8px] border border-soft-ice-gray min-w-0 overflow-hidden">
                  <h2 className="text-base font-bold mb-4 px-4 pt-3 font-figtree">
                    {t("expertDetails.questionsToAsk")}
                  </h2>
                  {questionsToDisplay.length > 0 ? (
                    <ul className="space-y-3 text-gray-700 pl-6 pb-4 text-base font-figtree pr-4 min-w-0 overflow-hidden">
                      {questionsToDisplay.map((question, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 min-w-0"
                        >
                          <span className="text-gray-700 mt-1 flex-shrink-0">
                            •
                          </span>
                          <span
                            className="break-words min-w-0 flex-1"
                            style={{
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {question}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="pl-6 pb-4 pr-1">
                      <p className="text-gray-500 text-sm font-figtree italic">
                        {t("expertDetails.noQuestionsAvailable")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-soft-ice-gray px-1 py-0.5 rounded-[8px] border border-soft-ice-gray min-w-0 overflow-hidden">
                  <h2 className="text-base font-bold mb-4 pl-6 pt-3">
                    {t("expertDetails.expectations")}
                  </h2>
                  {expectationsToDisplay.length > 0 ? (
                    <div className="space-y-4 text-base min-w-0 overflow-hidden">
                      <div className="pl-6 pr-4 min-w-0 overflow-hidden">
                        <ul className="mt-2 space-y-2 text-gray-700 pl-2 font-figtree min-w-0 overflow-hidden">
                          {expectationsToDisplay.map((expectation, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 min-w-0"
                            >
                              <span className="text-gray-700 mt-1 flex-shrink-0">
                                •
                              </span>
                              <span
                                className="break-words min-w-0 flex-1"
                                style={{
                                  overflowWrap: "anywhere",
                                  wordBreak: "break-word",
                                }}
                              >
                                {expectation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-6 pb-4 pr-1">
                      <p className="text-gray-500 text-sm font-figtree italic">
                        {t("expertDetails.noExpectationsAvailable")}
                      </p>
                    </div>
                  )}
                </div>
              </div> */}
              {/* How it works */}
              <div className="mb-15">
                <h2 className="text-lg font-bold mb-2.5 text-charcoal-blue">
                  {t("expertDetails.howItWorks")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <HowItWorksCard
                    iconSrc="/assets/icons/magnifer.svg"
                    iconAlt={t("sessionDetail.magnifierAlt")}
                    title={t("expertDetails.findExpert")}
                    description={t("expertDetails.findExpertDesc")}
                  />

                  <HowItWorksCard
                    iconSrc="/assets/icons/calendar1.svg"
                    iconAlt={t("sessionDetail.calendarAlt")}
                    title={t("expertDetails.bookOrSubscribe")}
                    description={t("expertDetails.bookOrSubscribeDesc")}
                  />

                  <HowItWorksCard
                    iconSrc="/assets/icons/videocameraRecord.svg"
                    iconAlt={t("sessionDetail.videoCameraAlt")}
                    title={t("expertDetails.virtualConsultation")}
                    description={t("expertDetails.virtualConsultationDesc")}
                  />
                </div>
              </div>

              {/* Similar Experts */}
              <div className="mb-15 min-w-0 overflow-hidden">
                <div className="min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-6 mt-3 min-w-0">
                    <h2 className="text-xl font-bold min-w-0 truncate">
                      {t("expertDetails.similarExperts")}
                    </h2>
                    {/* <ButtonUI
                      onClick={() => router.push("/")}
                      variant="link"
                      className="text-cobalt-blue font-figtree cursor-pointer flex-shrink-0"
                    >
                      {t("expertDetails.seeAll")}{" "}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </ButtonUI> */}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 min-w-0 overflow-hidden">
                    {isLoadingExpertSimilar ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse space-y-4 my-3">
                          <div className="bg-gray-200 aspect-[205/196] w-full rounded-[12px]"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      ))
                    ) : expertsimilar &&
                      expertsimilar.filter(
                        (expert: Expert) =>
                          expert.id !== expertId &&
                          expert.id !== myProProfile?.id,
                      ).length > 0 ? (
                      expertsimilar
                        ?.filter(
                          (expert: Expert) =>
                            expert.id !== expertId &&
                            expert.id !== myProProfile?.id,
                        )
                        ?.map((professional: Expert) => (
                          <ProfessionalCard
                            key={professional.id}
                            professional={{
                              ...professional,
                              description:
                                professional.job || professional.description,
                              topExpertise: professional.badge === "gold",
                            }}
                            isLiked={isLiked(String(professional.id))}
                            onToggleLike={() =>
                              toggleLike(String(professional.id))
                            }
                            onProfessionalClick={() =>
                              router.push(`/details?id=${professional.id}`)
                            }
                            showPrice={false}
                          />
                        ))
                    ) : (
                      <div className="col-span-full py-8 text-center text-gray-500">
                        {t("expertDetails.noSimilarExperts")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-xl font-bold mb-6">
                  {t("expertDetails.frequentQuestions")}
                </h2>
                <Accordion
                  items={[
                    {
                      question: t("expertDetails.whatIsSapiow"),
                      answer: t("expertDetails.whatIsSapiowAnswer"),
                      defaultOpen: true,
                    },
                    {
                      question: t("expertDetails.benefitsQuestion"),
                      answer: t("expertDetails.benefitsAnswer"),
                    },
                    {
                      question: t("expertDetails.expertsTypesQuestion"),
                      answer: t("expertDetails.expertsTypesAnswer"),
                    },
                    {
                      question: t("expertDetails.qualityQuestion"),
                      answer: t("expertDetails.qualityAnswer"),
                    },
                    {
                      question: t("expertDetails.feesQuestion"),
                      answer: t("expertDetails.feesAnswer"),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* Colonne de droite - Cachée en mobile/tablette, visible en desktop */}
          <div className="hidden xl:block xl:border-l xl:border-gray-200">
            {isPaid ? (
              <aside className="w-full">
                <div className="relative flex flex-col items-center justify-center p-6">
                  {/* Confetti overlay */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <Lottie
                      animationData={confettiAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: 421, height: 381 }}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center gap-4 mt-7 z-0">
                    <h2 className="text-[28px] font-bold text-charcoal-blue">
                      {t("expertDetails.congratulations")}
                    </h2>
                    <p className="text-xl text-black text-center font-medium mb-6">
                      {t("expertDetails.sessionBookedSuccess")}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <BookedSessionCard
                    isLoading={isLoadingAppointments}
                    date={
                      appointments?.[0]?.appointment_at
                        ? new Date(
                            appointments[0].appointment_at,
                          ).toLocaleDateString(locale, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : t("sessionDetail.dateNotAvailable")
                    }
                    time={
                      appointments?.[0]?.appointment_at
                        ? new Date(
                            appointments[0].appointment_at,
                          ).toLocaleTimeString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : t("sessionDetail.timeNotAvailable")
                    }
                    duration={appointments?.[0]?.session?.name}
                    sessionType={t("sessionDetail.session")}
                    professionalName={bookedProfessionalName}
                    professionalTitle={t("sessionDetail.expert")}
                    profileImage={bookedProfileImage}
                  />
                </div>
                {/* <Button
                  label={t("expertDetails.addToCalendar")}
                  className="mt-6 h-[56px] w-[90%] mx-auto text-base text-exford-blue font-bold bg-white hover:bg-white/20 border border-light-blue-gray shadow-none"
                  icon="/assets/icons/calendar.svg"
                  onClick={() => handleAddToCalendar(appointments?.[0])}
                /> */}
              </aside>
            ) : (
              <>
                {!isPlaning && (
                  <OfferSelection
                    price={startingFromPrice}
                    expertData={expertData}
                  />
                )}
                {isPlaning && (
                  <VisioPlanningCalendar
                    expertData={expertData}
                    professionalName={professional?.name || "Expert"}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Page de succès en pleine page pour mobile et tablette */}
      {isMobileOrTablet && isPaid && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <HeaderClient isBack />
          <div className="flex-1 overflow-y-auto">
            <div className="min-h-full flex flex-col items-center justify-center px-6 py-8">
              <div className="relative w-full flex flex-col items-center justify-center mb-8">
                {/* Confetti overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <Lottie
                    animationData={confettiAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: 350, height: 300 }}
                  />
                </div>

                <div className="text-center z-0">
                  <h2 className="text-2xl font-bold text-charcoal-blue mb-4">
                    {t("expertDetails.congratulations")}
                  </h2>
                  <p className="text-lg text-black font-medium mb-6 font-figtree">
                    {t("expertDetails.sessionBookedSuccess")}
                  </p>
                </div>
              </div>
              <div className="w-full max-w-[358px] mb-6">
                <BookedSessionCard
                  isLoading={isLoadingAppointments}
                  date={
                    appointments?.[0]?.appointment_at
                      ? new Date(
                          appointments[0].appointment_at,
                        ).toLocaleDateString(locale, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : t("sessionDetail.dateNotAvailable")
                  }
                  time={
                    appointments?.[0]?.appointment_at
                      ? new Date(
                          appointments[0].appointment_at,
                        ).toLocaleTimeString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : t("sessionDetail.timeNotAvailable")
                  }
                  duration="60 minutes"
                  sessionType={t("sessionDetail.quickVideoSession")}
                  professionalName={bookedProfessionalName}
                  professionalTitle={t("sessionDetail.expert")}
                  profileImage={bookedProfileImage}
                />
              </div>
              {/* <Button
                label={t("expertDetails.addToCalendar")}
                className="w-full h-[48px] text-base text-exford-blue font-bold bg-white hover:bg-white/20 border border-light-blue-gray shadow-none font-figtree"
                icon="/assets/icons/calendar.svg"
                onClick={() => handleAddToCalendar(appointments?.[0])}
              /> */}
            </div>
          </div>
        </div>
      )}

      {/* Bouton fixe mobile/tablette pour ouvrir le modal des offres */}
      {!isPaid && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 xl:hidden">
          <Sheet open={isOfferSheetOpen} onOpenChange={setIsOfferSheetOpen}>
            <SheetTrigger asChild>
              <Button
                label={t("sessionDetail.bookSession")}
                className="w-full h-[48px] bg-exford-blue text-white font-bold font-figtree"
              />
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[90vh] overflow-y-auto bg-white"
            >
              <div className="mt-4">
                {!isPlaning && (
                  <OfferSelection
                    price={startingFromPrice}
                    expertData={expertData}
                  />
                )}
                {isPlaning && (
                  <VisioPlanningCalendar
                    expertData={expertData}
                    professionalName={professional?.name || "Expert"}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}

function ProfessionalDetail() {
  const t = useTranslations();
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingScreen message={t("loading")} size="xl" />
        </div>
      }
    >
      <ProfessionalDetailContent />
    </Suspense>
  );
}

export default ProfessionalDetail;
export { ProfessionalDetail };
