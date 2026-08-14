import { apiClient } from "@/lib/api-client";
import {
  isInitialExpertDataValid,
  isOnboardingExpertDataValid,
  isOnboardingSeekerDataValid,
  OnboardingExpertData,
  OnboardingExpertError,
  OnboardingExpertResponse,
  OnboardingSeekerData,
  OnboardingSeekerError,
  OnboardingSeekerResponse,
  transformOnboardingExpertToFormData,
  transformOnboardingSeekerToFormData,
} from "@/types/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook pour l'onboarding des seekers via multipart/form-data
 */
export const useOnboardingSeeker = () => {
  const queryClient = useQueryClient();

  return useMutation<
    OnboardingSeekerResponse,
    OnboardingSeekerError,
    OnboardingSeekerData
  >({
    mutationFn: async (data: OnboardingSeekerData) => {
      // Validation des données avant envoi
      if (!isOnboardingSeekerDataValid(data)) {
        throw new Error(
          "Données invalides. Veuillez vérifier tous les champs requis."
        );
      }

      // Transformation en FormData pour multipart/form-data
      const formData = transformOnboardingSeekerToFormData(data);

      try {
        // Utilisation du client API centralisé avec FormData
        const response =
          await apiClient.fetchFormData<OnboardingSeekerResponse>(
            "patient",
            formData
          );

        return response;
      } catch (error: any) {
        console.error("Erreur lors de l'onboarding seeker:", error);

        // Re-throw avec un message utilisateur approprié
        const userError: OnboardingSeekerError = {
          message:
            error.message || "Une erreur est survenue lors de l'inscription",
          status: error.status,
        };

        throw userError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};

/**
 * Hook pour l'onboarding des experts via multipart/form-data
 */
export const useOnboardingExpertPro = () => {
  const queryClient = useQueryClient();
  return useMutation<
    OnboardingExpertResponse,
    OnboardingExpertError,
    OnboardingExpertData
  >({
    mutationFn: async (data: OnboardingExpertData) => {
      // Validation : création initiale (sans domaine) ou profil complet
      const isValid =
        data.domain_id > 0
          ? isOnboardingExpertDataValid(data)
          : isInitialExpertDataValid(data);
      if (!isValid) {
        throw new Error(
          "Données invalides. Veuillez vérifier tous les champs requis."
        );
      }

      // Transformation en FormData pour multipart/form-data
      const formData = transformOnboardingExpertToFormData(data);

      try {
        // Utilisation du client API centralisé avec FormData
        const response =
          await apiClient.fetchFormData<OnboardingExpertResponse>(
            "pro",
            formData
          );

        return response;
      } catch (error: any) {
        console.error("Erreur lors de l'onboarding expert:", error);

        // Re-throw avec un message utilisateur approprié
        const userError: OnboardingExpertError = {
          message:
            error.message || "Une erreur est survenue lors de l'inscription",
          status: error.status,
        };

        throw userError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proExpert"] });
    },
  });
};

/**
 * Hook pour l'onboarding des professionnels (pour compatibilité)
 * @deprecated Utiliser le hook spécifique selon les besoins
 */
export const useOnboardingClient = useOnboardingSeeker;
