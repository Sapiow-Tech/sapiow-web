import { apiClient } from "@/lib/api-client";
import { showToast } from "@/utils/toast";
import { useMutation, useQuery } from "@tanstack/react-query";

// Types
interface StripeAccount {
  id: string;
  object: string;
  business_profile?: any;
  capabilities?: any;
  country?: string;
  created?: number;
  default_currency?: string;
  details_submitted?: boolean;
  email?: string;
  external_accounts?: any;
  individual?: any;
  metadata?: any;
  payouts_enabled?: boolean;
  requirements?: {
    currently_due?: string[];
    errors?: any[];
    pending_verification?: string[];
  };
  settings?: any;
  type?: string;
}

interface GetBankResponse {
  account?: StripeAccount;
  managed_by_organization?: boolean;
  organization_stripe?: boolean;
}

interface CreateBankResponse {
  stripe_account_id: string;
  onboarding_url?: string;
}

interface UpdateBankRequest {
  external_account_token?: string;
  iban?: string;
  bic?: string;
  swift?: string;
  first_name?: string;
  last_name?: string;
  set_default_for_currency?: boolean;
}

interface UpdateBankResponse {
  external_account?: any;
  account?: StripeAccount;
  message?: string;
  onboarding_url?: string;
}

interface AccountLinkResponse {
  account_link_url: string;
}

export const useGetInfoStripeAccount = () => {
  const query = useQuery<GetBankResponse | null, Error>({
    queryKey: ["bank"],
    queryFn: async () => {
      try {
        return await apiClient.get<GetBankResponse>("pro-bank-account");
      } catch (error: any) {
        // Si l'erreur indique qu'aucun compte Stripe n'existe, traiter comme 404
        const errorMessage = error?.message || "";
        if (
          errorMessage.includes("No Stripe account found") ||
          errorMessage.includes("Stripe account not found")
        ) {
          // Retourner null au lieu de lancer une erreur (ressource absente = 404)
          return null;
        }
        // Pour les autres erreurs, relancer l'erreur
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Ne pas réessayer si c'est une erreur "account not found"
      const errorMessage = error?.message || "";
      if (
        errorMessage.includes("No Stripe account found") ||
        errorMessage.includes("Stripe account not found")
      ) {
        return false;
      }
      // Réessayer jusqu'à 3 fois pour les autres erreurs
      return failureCount < 3;
    },
  });
  return query;
};

// Create/Initialize Stripe account
export const useCreateAccountStripe = () => {
  const mutation = useMutation<CreateBankResponse, Error, void>({
    mutationFn: async () => {
      try {
        return await apiClient.post<CreateBankResponse>("pro-bank-account");
      } catch (error: any) {
        // apiClient extrait déjà le message d'erreur du JSON
        throw error;
      }
    },
  });
  return mutation;
};

// Update bank account information
export const useUpdateBank = () => {
  const mutation = useMutation<UpdateBankResponse, Error, UpdateBankRequest>({
    mutationFn: async (data: UpdateBankRequest) => {
      try {
        return await apiClient.put<UpdateBankResponse>(
          "pro-bank-account",
          data
        );
      } catch (error: any) {
        // apiClient extrait déjà le message d'erreur du JSON
        throw error;
      }
    },
    onError: (error: any) => {
      console.error("Failed to update bank account:", error);
      // Utiliser le message d'erreur extrait par apiClient
      const errorMessage =
        error?.message || "Erreur lors de la mise à jour du compte bancaire";
      showToast.error("bankUpdateError", errorMessage);
    },
  });
  return mutation;
};

// Generate Stripe Account Link for modification
export const useGenerateAccountLink = () => {
  const mutation = useMutation<AccountLinkResponse, Error, void>({
    mutationFn: async () => {
      try {
        return await apiClient.post<AccountLinkResponse>("pro-bank-account");
      } catch (error: any) {
        // apiClient extrait déjà le message d'erreur du JSON
        throw error;
      }
    },
  });
  return mutation;
};
