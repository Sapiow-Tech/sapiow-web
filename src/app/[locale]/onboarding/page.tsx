"use client";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { withAuth } from "@/components/common/withAuth";
import { OnboardingExpertSteps } from "@/components/onboarding/OnboardingExpertSteps";
import { OnboardingSeekerSteps } from "@/components/onboarding/OnboardingSeekerSteps";
import { UserTypeSelector } from "@/components/onboarding/UserTypeSelector";
import { useOnboardingLogic } from "@/hooks/useOnboardingLogic";

import { useTranslations } from "next-intl";
import Image from "next/image";

function Onboarding() {
  const t = useTranslations();
  const {
    isCheckingProfiles,
    shouldShowOnboarding,
    step,
    userType,
    setStep,
    setUserType,
  } = useOnboardingLogic();

  // Afficher le loading pendant la vérification
  if (isCheckingProfiles) {
    return (
      <div className="w-screen min-h-screen bg-white">
        <LoadingScreen message={t("onboarding.checkingProfile")} size="lg" />
      </div>
    );
  }

  // Si on ne doit pas afficher l'onboarding, retourner null (redirection en cours)
  if (!shouldShowOnboarding) {
    return null;
  }

  return (
    <div className="w-screen min-h-screen bg-white">
      <div className="container min-h-screen flex flex-col lg:grid lg:grid-cols-[630px_1fr] xl:grid-cols-[700px_1fr]">
        {/* Section image - cachée sur mobile et tablette, visible sur desktop */}
        <div className="hidden lg:block relative my-8 min-h-[600px] xl:min-h-[700px] w-full">
          <Image
            src="/assets/on_boarding.png"
            alt="Onboarding"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          {/* Logo - visible seulement à l'étape 0 */}
          {step === 0 && (
            <div className="mt-14 ml-[42px]">
              <Image src="/assets/logo.png" alt="Logo" width={175} height={100} />
            </div>
          )}
          <div
            className={`flex flex-col justify-center items-center flex-1 px-6 py-8 lg:py-0 ${
              step > 0 ? "sm:-mt-11" : ""
            }`}
          >
            {/* Étape 0 : Choix du type d'utilisateur */}
            {step === 0 && (
              <UserTypeSelector
                userType={userType}
                onUserTypeChange={setUserType}
                onContinue={() => setStep(1)}
              />
            )}
            {/* Étape 1 : OnboardingSeekerSteps */}
            {step === 1 && userType === "client" && <OnboardingSeekerSteps />}
            {/* Étape 1 : OnboardingExpertSteps */}
            {step === 1 && userType === "expert" && <OnboardingExpertSteps />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Onboarding);
