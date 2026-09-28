"use client";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { useOnboardingSeeker } from "@/hooks/useOnboardingSeeker";
import { useTranslations } from "next-intl";
import React from "react";
import { DomainSelector } from "./DomainSelector";
import { Pagination } from "./Pagination";

export const OnboardingSeekerSteps: React.FC = () => {
  const t = useTranslations();
  const {
    step,
    firstName,
    lastName,
    email,
    selectedDomains,
    isFormValid,
    isDomainValid,
    isSubmitting,
    error,
    domains,
    isLoadingDomains,
    setFirstName,
    setLastName,
    setEmail,
    nextStep,
    handleDomainSelect,
    completeOnboarding,
  } = useOnboardingSeeker();

  return (
    <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[391px]">
      {/* Étape 1 : Infos personnelles */}
      {step === 1 && (
        <>
          <h1 className="text-2xl sm:text-lg lg:text-xl font-bold text-center mb-2">
            {t("onboarding.letsGetAcquainted")}
          </h1>
          <p className="text-base sm:text-base font-normal my-4 text-center text-ash-gray mb-8">
            {t("onboarding.personalizeExperience")}
          </p>
          <div className="space-y-6 mb-8">
            <FormField
              type="text"
              placeholder={t("onboarding.firstName")}
              label={t("onboarding.firstName")}
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
              className="w-full h-[56px] px-4 font-medium text-exford-blue placeholder-slate-gray"
            />
            <FormField
              type="text"
              placeholder={t("onboarding.lastName")}
              label={t("onboarding.lastName")}
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
              className="w-full h-[56px] px-4 font-medium text-exford-blue placeholder-slate-gray"
            />
            <FormField
              type="email"
              placeholder={t("onboarding.email")}
              label={t("onboarding.email")}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full h-[56px] px-4 font-medium text-exford-blue placeholder-slate-gray"
            />
          </div>
          <Pagination currentStep={1} totalSteps={2} />
          <Button
            label={t("onboarding.next")}
            className="w-full rounded-[8px] h-[56px] text-base font-medium"
            disabled={!isFormValid || isSubmitting}
            onClick={nextStep}
          />
        </>
      )}

      {/* Étape 2 : Domaine préféré */}
      {step === 2 && (
        <div className="w-full max-w-[343px] sm:max-w-[380px] lg:max-w-[343px]">
          <DomainSelector
            title={t("onboarding.preferredDomain")}
            subtitle={t("onboarding.highlightExperts")}
            domains={domains}
            selectedDomains={selectedDomains}
            onDomainSelect={handleDomainSelect}
            multiSelect={true}
            isLoading={isLoadingDomains}
          />
          <Pagination currentStep={2} totalSteps={2} />

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="text-sm text-red-600 text-center">
                {error || t("onboarding.errorOccurred")}
              </p>
            </div>
          )}

          <Button
            label={
              isSubmitting
                ? t("onboarding.registering")
                : t("onboarding.confirm")
            }
            className="w-full rounded-[8px] h-[56px] text-base font-medium"
            disabled={!isDomainValid || isSubmitting}
            onClick={completeOnboarding}
          />
        </div>
      )}
    </div>
  );
};
