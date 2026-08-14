"use client";
import { useGetDomaines, useGetExpertises } from "@/api/domaine/useDomaine";
import { useOnboardingExpertPro } from "@/api/onbaording/useOnboarding";
import { useGetCustomer } from "@/api/customer/useCustomer";
import {
  useGetProExpert,
  useUpdateProExpert,
} from "@/api/proExpert/useProExpert";
import { useCreateProSession } from "@/api/sessions/useSessions";
import { useUserStore } from "@/store/useUser";
import {
  isInitialExpertDataValid,
  OnboardingExpertData,
  mapDomainIdToNumeric,
} from "@/types/onboarding";
import {
  clearAuthNextPath,
  getAuthNextPath,
  sanitizeInternalNextPath,
} from "@/utils/authFlow";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface VisioOption {
  duration: number;
  enabled: boolean;
  price: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Une erreur est survenue lors de l'inscription";
};

export const useOnboardingExpert = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [proProfileReady, setProProfileReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const onboardingMutation = useOnboardingExpertPro();
  const updateProMutation = useUpdateProExpert();
  const { data: existingPro } = useGetProExpert();
  const { data: customer } = useGetCustomer();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [visioOptions, setVisioOptions] = useState<VisioOption[]>([
    { duration: 15, enabled: false, price: "" },
    { duration: 30, enabled: false, price: "" },
    { duration: 45, enabled: false, price: "" },
    { duration: 60, enabled: false, price: "" },
  ]);

  const {
    data: domains = [],
    isLoading: isLoadingDomains,
    error: domainsError,
  } = useGetDomaines();

  const {
    data: expertises = [],
    isLoading: isLoadingExpertises,
    error: expertisesError,
  } = useGetExpertises(selectedDomainId || 0);

  const { mutateAsync: createProSession } = useCreateProSession();

  const hasProProfile = Boolean(existingPro) || proProfileReady;

  useEffect(() => {
    if (existingPro) {
      setProProfileReady(true);
    }
  }, [existingPro]);

  useEffect(() => {
    if (hasInitialized) return;

    let desiredStep: number | null = null;
    try {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      if (stepParam) desiredStep = Number(stepParam);
    } catch {
      // no-op
    }

    try {
      const fromStorage = sessionStorage.getItem("onboardingExpertStartStep");
      if (fromStorage) desiredStep = Number(fromStorage);
    } catch {
      // no-op
    }

    if (desiredStep && Number.isFinite(desiredStep) && desiredStep >= 1) {
      setStep(desiredStep);
    }

    let prefill: { first_name?: string; last_name?: string } = {};
    try {
      const raw = sessionStorage.getItem("onboardingExpertPrefill");
      if (raw) prefill = JSON.parse(raw);
    } catch {
      // no-op
    }

    const fallbackFirstName = (
      prefill.first_name ??
      customer?.first_name ??
      existingPro?.first_name ??
      ""
    )
      .toString()
      .trim();
    const fallbackLastName = (
      prefill.last_name ??
      customer?.last_name ??
      existingPro?.last_name ??
      ""
    )
      .toString()
      .trim();
    if (!firstName && fallbackFirstName) setFirstName(fallbackFirstName);
    if (!lastName && fallbackLastName) setLastName(fallbackLastName);

    try {
      sessionStorage.removeItem("onboardingExpertStartStep");
      sessionStorage.removeItem("onboardingExpertPrefill");
    } catch {
      // no-op
    }

    setHasInitialized(true);
  }, [hasInitialized, customer, existingPro, firstName, lastName]);

  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    profession.trim().length > 0 &&
    (!email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));

  const isDomainValid = !!selectedDomain;
  const isSpecialtyValid = selectedSpecialties.length > 0;
  const isVisioValid = visioOptions.every(
    (option) =>
      !option.enabled ||
      (option.price !== "" &&
        option.price !== null &&
        option.price !== undefined &&
        Number(option.price) >= 0)
  );

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);

  const buildBaseProfileData = useCallback((): OnboardingExpertData => {
    return {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim() || undefined,
      job: profession.trim() || undefined,
      domain_id: selectedDomain
        ? mapDomainIdToNumeric(selectedDomain) || 0
        : 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }, [email, firstName, lastName, profession, selectedDomain]);

  const redirectToExpertHome = useCallback(() => {
    setUser({ type: "expert" });
    const nextPath =
      sanitizeInternalNextPath(searchParams.get("next")) || getAuthNextPath();
    if (nextPath) {
      clearAuthNextPath();
      router.push(nextPath);
    } else {
      router.push("/");
    }
  }, [router, searchParams, setUser]);

  const createInitialProProfile = useCallback(
    async (data: OnboardingExpertData) => {
      if (!isInitialExpertDataValid(data)) {
        throw new Error(
          "Données invalides. Veuillez vérifier tous les champs requis."
        );
      }
      await onboardingMutation.mutateAsync(data);
      setProProfileReady(true);
    },
    [onboardingMutation]
  );

  const saveStep1AndContinue = async () => {
    if (!isFormValid) return;

    setError(null);
    setIsSavingStep(true);
    try {
      const data = buildBaseProfileData();

      if (hasProProfile) {
        await updateProMutation.mutateAsync({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          job: data.job,
          timezone: data.timezone,
        });
      } else {
        await createInitialProProfile(data);
      }

      nextStep();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSavingStep(false);
    }
  };

  const saveStep2AndContinue = async () => {
    if (!isFormValid) {
      setError("Données invalides. Veuillez vérifier tous les champs requis.");
      return;
    }
    if (!isDomainValid || !selectedDomain) return;

    setError(null);
    setIsSavingStep(true);
    try {
      const domainId = mapDomainIdToNumeric(selectedDomain);

      if (hasProProfile) {
        await updateProMutation.mutateAsync({ domain_id: domainId });
      } else {
        const data = buildBaseProfileData();
        data.domain_id = domainId;
        await onboardingMutation.mutateAsync(data);
        setProProfileReady(true);
      }

      nextStep();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSavingStep(false);
    }
  };

  const saveStep3AndContinue = async () => {
    if (!isSpecialtyValid) return;

    setError(null);
    setIsSavingStep(true);
    try {
      const expertisesPayload = selectedSpecialties.map((expertiseId) => ({
        expertise_id: expertiseId,
      }));

      await updateProMutation.mutateAsync({
        expertises: expertisesPayload,
      });

      nextStep();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSavingStep(false);
    }
  };

  const saveStep4AndContinue = async () => {
    setError(null);
    setIsSavingStep(true);
    try {
      await updateProMutation.mutateAsync({
        description: aboutMe.trim() || undefined,
        linkedin: linkedinUrl.trim() || undefined,
        website: websiteUrl.trim() || undefined,
        ...(avatar && { avatar }),
      });

      nextStep();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSavingStep(false);
    }
  };

  const finishOnboardingLater = () => {
    redirectToExpertHome();
  };

  const finishOnboardingWithSessions = async () => {
    setIsFinishing(true);
    setError(null);

    try {
      const enabledOptions = visioOptions.filter(
        (option) =>
          option.enabled &&
          option.price !== "" &&
          option.price !== null &&
          option.price !== undefined &&
          Number(option.price) >= 0
      );

      for (const option of enabledOptions) {
        const sessionData = {
          price: Number(option.price),
          session_type: `${option.duration}m` as "15m" | "30m" | "45m" | "60m",
          session_nature: "one_time" as const,
          one_on_one: true,
          video_call: true,
          mentorship: true,
          name: `Consultation ${option.duration} minutes`,
          is_active: true,
        };

        try {
          await createProSession(sessionData);
        } catch {
          // Keep finishing even if one session fails to create
        }
      }

      redirectToExpertHome();
    } finally {
      setIsFinishing(false);
    }
  };

  const handleSpecialtyToggle = (expertiseId: number) => {
    setSelectedSpecialties((prev) =>
      prev.includes(expertiseId)
        ? prev.filter((id) => id !== expertiseId)
        : [...prev, expertiseId]
    );
    setError(null);
  };

  const updateVisioOption = (
    index: number,
    field: keyof VisioOption,
    value: unknown
  ) => {
    setVisioOptions((prev) => {
      const newOptions = [...prev];
      if (field === "enabled" && value === true && !newOptions[index].price) {
        newOptions[index] = {
          ...newOptions[index],
          [field]: value,
          price: "0",
        };
      } else {
        newOptions[index] = { ...newOptions[index], [field]: value };
      }
      return newOptions;
    });
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatar(file);
  };

  return {
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
    avatar,
    visioOptions,

    isFormValid,
    isDomainValid,
    isSpecialtyValid,
    isVisioValid,

    isSavingStep,
    isFinishing,
    isSubmitting: isSavingStep || isFinishing,
    error,

    domains,
    isLoadingDomains,
    expertises,
    isLoadingExpertises,
    domainsError,
    expertisesError,

    setFirstName,
    setLastName,
    setProfession,
    setEmail,
    setSelectedDomain: (domain: string | null) => {
      setSelectedDomain(domain);
      if (domain) {
        const domainId = mapDomainIdToNumeric(domain);
        setSelectedDomainId(domainId);
      } else {
        setSelectedDomainId(null);
      }
      setError(null);
    },
    setAboutMe,
    setLinkedinUrl,
    setWebsiteUrl,

    nextStep,
    prevStep,
    goToStep,
    handleSpecialtyToggle,
    handleAvatarChange,
    updateVisioOption,
    saveStep1AndContinue,
    saveStep2AndContinue,
    saveStep3AndContinue,
    saveStep4AndContinue,
    finishOnboardingLater,
    finishOnboardingWithSessions,
  };
};
