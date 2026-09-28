"use client";
import { useGetDomaines } from "@/api/domaine/useDomaine";
import { useOnboardingSeeker as useOnboardingSeekerAPI } from "@/api/onbaording/useOnboarding";
import { useUserStore } from "@/store/useUser";
import {
  clearAuthNextPath,
  getAuthNextPath,
  isBookingResumeNext,
  sanitizeInternalNextPath,
} from "@/utils/authFlow";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const useOnboardingSeeker = () => {
  const { setUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  // États pour les étapes
  const [step, setStep] = useState(1);

  // États pour les données du formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<number[]>([]);

  // Hook pour récupérer les domaines
  const {
    data: domains = [],
    isLoading: isLoadingDomains,
    error: domainsError,
  } = useGetDomaines();

  // Hook API pour l'envoi des données
  const {
    mutate: submitOnboarding,
    isPending: isSubmitting,
    error: apiError,
  } = useOnboardingSeekerAPI();

  // État d'erreur local
  const [error, setError] = useState<string | null>(null);

  const resolveNextPath = () =>
    sanitizeInternalNextPath(searchParams.get("next")) || getAuthNextPath();

  // Validation des formulaires
  const isFormValid =
    firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";
  const isDomainValid = selectedDomains.length > 0;

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    if (step === 1 && isFormValid) {
      setStep(2);
      setError(null);
    } else if (step === 1) {
      setError("Veuillez remplir tous les champs requis");
    }
  };

  // Fonction pour gérer la sélection des domaines
  const handleDomainSelect = (domainId: number) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domainId)) {
        return prev.filter((d) => d !== domainId);
      } else {
        return [...prev, domainId];
      }
    });
    setError(null);
  };

  const finishOnboarding = () => {
    const nextPath = resolveNextPath();
    setUser({ type: "client" });
    if (nextPath) {
      clearAuthNextPath();
      router.push(nextPath);
    } else {
      router.push("/");
    }
  };

  // Fonction pour finaliser l'onboarding
  const completeOnboarding = async () => {
    if (!isDomainValid) {
      setError("Veuillez sélectionner au moins un domaine d'intérêt");
      return;
    }

    try {
      setError(null);

      // Préparation des données pour l'API
      const onboardingData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        domain_id: selectedDomains[0], // Prendre le premier domaine sélectionné
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // Appel API
      submitOnboarding(onboardingData, {
        onSuccess: () => {
          setUser({ type: "client" });

          if (isBookingResumeNext(resolveNextPath())) {
            setStep(3);
            return;
          }

          finishOnboarding();
        },
        onError: (error: any) => {
          setError(
            error?.message || "Une erreur est survenue lors de l'inscription"
          );
        },
      });
    } catch (err) {
      setError("Une erreur inattendue est survenue");
    }
  };

  return {
    // États
    step,
    firstName,
    lastName,
    email,
    selectedDomains,
    isFormValid,
    isDomainValid,
    isSubmitting,
    error: error || apiError?.message || domainsError?.message,

    // Données des domaines
    domains,
    isLoadingDomains,

    // Setters
    setFirstName,
    setLastName,
    setEmail,

    // Actions
    nextStep,
    handleDomainSelect,
    completeOnboarding,
    finishOnboarding,
  };
};
