"use client";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Textarea } from "@/components/ui/textarea";
import { DOMAIN_ID_MAPPING } from "@/constants/onboarding";
import { useOnboardingExpert } from "@/hooks/useOnboardingExpert";
import { useTranslations } from "next-intl";
import React from "react";
import { DomainSelector } from "./DomainSelector";
import { Pagination } from "./Pagination";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { SpecialtySelector } from "./SpecialtySelector";
import { VisioConfiguration } from "./VisioConfiguration";

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
    <p className="text-sm text-red-600 text-center">{message}</p>
  </div>
);

export const OnboardingExpertSteps: React.FC = () => {
  const t = useTranslations();
  const {
    step,
    firstName,
    lastName,
    profession,
    email,
    selectedDomain,
    selectedSpecialties,
    aboutMe,
    linkedinUrl,
    websiteUrl,
    visioOptions,
    isFormValid,
    isDomainValid,
    isSpecialtyValid,
    isVisioValid,
    domains,
    isLoadingDomains,
    expertises,
    isLoadingExpertises,
    setFirstName,
    setLastName,
    setProfession,
    setEmail,
    setSelectedDomain,
    setAboutMe,
    setLinkedinUrl,
    setWebsiteUrl,
    nextStep,
    handleSpecialtyToggle,
    handleAvatarChange,
    updateVisioOption,
    saveStep1AndContinue,
    saveStep2AndContinue,
    saveStep3AndContinue,
    saveStep4AndContinue,
    finishOnboardingLater,
    finishOnboardingWithSessions,
    isSavingStep,
    isFinishing,
    error,
  } = useOnboardingExpert();

  if (step === 5 && isFinishing) {
    return (
      <LoadingScreen
        message={t("onboarding.registering")}
        size="lg"
        fullScreen={false}
      />
    );
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[391px]">
        <h1 className="text-2xl sm:text-lg lg:text-xl font-bold text-center mb-2">
          {t("onboarding.letsGetAcquainted")}
        </h1>
        <p className="text-base sm:text-base font-normal my-4 text-center text-ash-gray mb-8">
          {t("onboarding.createExpertAccount")}
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
            type="text"
            placeholder={t("onboarding.profession")}
            label={t("onboarding.profession")}
            value={profession}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfession(e.target.value)
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
        <Pagination currentStep={1} totalSteps={5} />
        {error && (
          <ErrorMessage message={error || t("onboarding.errorOccurred")} />
        )}
        <Button
          label={
            isSavingStep ? t("onboarding.registering") : t("onboarding.next")
          }
          className="w-full rounded-[8px] h-[56px] text-base font-medium"
          disabled={!isFormValid || isSavingStep}
          onClick={saveStep1AndContinue}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full max-w-[343px] sm:max-w-[380px] lg:max-w-[343px]">
        <DomainSelector
          title={t("onboarding.exerciseDomain")}
          subtitle={t("onboarding.needDomainInfo")}
          domains={domains}
          isLoading={isLoadingDomains}
          selectedDomain={
            selectedDomain ? DOMAIN_ID_MAPPING[selectedDomain] : null
          }
          onDomainSelect={(domainId: number) => {
            const stringId = Object.keys(DOMAIN_ID_MAPPING).find(
              (key) => DOMAIN_ID_MAPPING[key] === domainId
            );
            if (stringId) {
              setSelectedDomain(stringId);
            }
          }}
          multiSelect={false}
        />
        <Pagination currentStep={2} totalSteps={5} />
        {error && (
          <ErrorMessage message={error || t("onboarding.errorOccurred")} />
        )}
        <Button
          label={
            isSavingStep ? t("onboarding.registering") : t("onboarding.next")
          }
          className="w-full rounded-[8px] h-[56px] text-base font-medium"
          disabled={!isDomainValid || isSavingStep}
          onClick={saveStep2AndContinue}
        />
      </div>
    );
  }

  if (step === 3 && selectedDomain) {
    return (
      <div className="w-full max-w-[343px] sm:max-w-[380px] lg:max-w-[343px]">
        <SpecialtySelector
          selectedDomain={selectedDomain}
          selectedSpecialties={selectedSpecialties}
          expertises={expertises}
          isLoadingExpertises={isLoadingExpertises}
          onSpecialtyToggle={handleSpecialtyToggle}
        />
        <Pagination currentStep={3} totalSteps={5} />
        {error && (
          <ErrorMessage message={error || t("onboarding.errorOccurred")} />
        )}
        <div className="flex gap-4 w-full">
          <Button
            label={t("onboarding.later")}
            className="w-1/2 rounded-[8px] h-[56px] text-base font-medium bg-white border border-gray-300 text-exford-blue hover:bg-gray-50"
            variant="outline"
            disabled={isSavingStep}
            onClick={nextStep}
          />
          <Button
            label={
              isSavingStep ? t("onboarding.registering") : t("onboarding.next")
            }
            className="w-1/2 rounded-[8px] h-[56px] text-base font-medium"
            disabled={!isSpecialtyValid || isSavingStep}
            onClick={saveStep3AndContinue}
          />
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="w-full max-w-[350px] sm:max-w-[380px] lg:max-w-[391px]">
        <h1 className="text-base sm:text-lg lg:text-xl font-bold text-center mb-2">
          {t("onboarding.completeProfile")}
        </h1>
        <p className="text-sm sm:text-base font-normal my-4 text-center text-gray-600 mb-8">
          {t("onboarding.describeYourself")}
        </p>

        <ProfilePhotoUpload onPhotoSelect={handleAvatarChange} />

        <div className="space-y-6 mb-8">
          <Textarea
            placeholder={t("onboarding.aboutMePlaceholder")}
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={6}
            className="w-full h-[190px] px-4 font-medium text-exford-blue placeholder-slate-gray"
          />
          <FormField
            type="url"
            placeholder={t("onboarding.linkedinUrl")}
            label={t("onboarding.linkedinUrl")}
            value={linkedinUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLinkedinUrl(e.target.value)
            }
            className="w-full h-[56px] px-4 font-medium text-exford-blue placeholder-slate-gray"
          />
          <FormField
            type="url"
            placeholder={t("onboarding.websiteUrl")}
            label={t("onboarding.websiteUrl")}
            value={websiteUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWebsiteUrl(e.target.value)
            }
            className="w-full h-[56px] px-4 font-medium text-exford-blue placeholder-slate-gray"
          />
        </div>

        <Pagination currentStep={4} totalSteps={5} />
        {error && (
          <ErrorMessage message={error || t("onboarding.errorOccurred")} />
        )}
        <div className="flex gap-4 w-full">
          <Button
            label={t("onboarding.later")}
            className="w-1/2 rounded-[8px] h-[56px] text-base font-medium bg-white border border-gray-300 text-exford-blue hover:bg-gray-50"
            variant="outline"
            disabled={isSavingStep}
            onClick={nextStep}
          />
          <Button
            label={
              isSavingStep ? t("onboarding.registering") : t("onboarding.next")
            }
            className="w-1/2 rounded-[8px] h-[56px] text-base font-medium"
            disabled={isSavingStep}
            onClick={saveStep4AndContinue}
          />
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="w-full max-w-[343px] sm:max-w-[380px] lg:max-w-[343px]">
        <VisioConfiguration
          visioOptions={visioOptions}
          onUpdateVisioOption={updateVisioOption}
        />
        <Pagination currentStep={5} totalSteps={5} />
        <div className="flex gap-4 w-full">
          <Button
            label={t("onboarding.later")}
            className="w-1/2 rounded-[8px] h-[56px] text-base font-medium bg-white border border-gray-300 text-exford-blue hover:bg-gray-50"
            variant="outline"
            onClick={finishOnboardingLater}
          />
          <Button
            label={t("onboarding.finish")}
            className="w-1/2 rounded-[8px] h-[56px] text-base font-medium"
            disabled={!isVisioValid}
            onClick={finishOnboardingWithSessions}
          />
        </div>
      </div>
    );
  }

  return null;
};
