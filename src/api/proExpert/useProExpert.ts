// Types pour les énumérations

import { SessionType } from "@/api/sessions/useSessions";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types pour les énumérations
export type ProExpertStatus = "active" | "inactive" | "pending";

// Interface pour les données d'un expert pro
export interface ProExpert {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  domain_id: number;
  description?: string;
  job?: string;
  linkedin?: string;
  website?: string;
  language?: string;
  appointment_notification_sms?: boolean;
  appointment_notification_email?: boolean;
  message_notification_sms?: boolean;
  message_notification_email?: boolean;
  promotions_notification_sms?: boolean;
  promotions_notification_email?: boolean;
  availability_start_date?: string;
  availability_end_date?: string;
  pro_expertises?: any[]; // JSON parsed
  schedules?: any[]; // JSON parsed
  extra_data?: string | null; // JSON string au format {"questions":[],"expectations":[]}
  status: ProExpertStatus;
  created_at: string;
  updated_at: string;
  timezone?: string;
  sessions?: ProExpertSession[]; // Sessions associées
}

// Interface pour les sessions d'un expert
export interface ProExpertSession {
  id: string;
  price: number;
  session_type: SessionType;
  session_nature: string;
  name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour la réponse de récupération d'un pro
export interface GetProExpertResponse {
  success: boolean;
  message: string;
  data: ProExpert;
}

// Interface pour les erreurs
export interface ProExpertError {
  message: string;
  status?: number;
  field?: string;
}

// Interface pour les données de session simplifiées (frontend)
export interface ProSessionData {
  price: number;
  session_type: SessionType;
  name?: string;
}

// Interface pour les données de mise à jour d'un expert (côté client)
export interface UpdateProExpertData {
  first_name?: string;
  last_name?: string;
  avatar?: File | string | null; // File pour nouvel upload, string pour URL existante, null pour suppression
  domain_id?: number;
  description?: string;
  job?: string;
  email?: string;
  linkedin?: string;
  website?: string;
  language?: string;
  appointment_notification_sms?: boolean;
  appointment_notification_email?: boolean;
  message_notification_sms?: boolean;
  message_notification_email?: boolean;
  promotions_notification_sms?: boolean;
  promotions_notification_email?: boolean;
  availability_start_date?: string; // Format date YYYY-MM-DD
  availability_end_date?: string; // Format date YYYY-MM-DD
  expertises?: any[]; // Sera converti en JSON string
  schedules?: any[]; // Sera converti en JSON string
  extra_data?: string; // JSON string au format {"questions":[],"expectations":[]}
  timezone?: string;
}

// Interface pour les données de mise à jour (FormData pour API)
export interface UpdateProExpertFormData {
  first_name?: string;
  last_name?: string;
  avatar?: File;
  domain_id?: number;
  description?: string;
  job?: string;
  linkedin?: string;
  website?: string;
  language?: string;
  appointment_notification_sms?: boolean;
  appointment_notification_email?: boolean;
  message_notification_sms?: boolean;
  message_notification_email?: boolean;
  promotions_notification_sms?: boolean;
  promotions_notification_email?: boolean;
  availability_start_date?: string;
  availability_end_date?: string;
  expertises?: string;
  schedules?: string;
  timezone?: string;
}

// Interface pour la réponse de mise à jour
export interface UpdateProExpertResponse {
  success: boolean;
  message: string;
  data: ProExpert;
}

/**
 * Transforme les données client vers FormData pour l'API
 */
export const transformUpdateDataToFormData = (
  data: UpdateProExpertData
): FormData => {
  const formData = new FormData();

  // Champs simples
  if (data.first_name !== undefined)
    formData.append("first_name", data.first_name);
  if (data.last_name !== undefined)
    formData.append("last_name", data.last_name);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.domain_id !== undefined)
    formData.append("domain_id", data.domain_id.toString());
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.job !== undefined) formData.append("job", data.job);
  // Only include when explicitly provided (including empty string to clear)
  if (data.linkedin !== undefined) formData.append("linkedin", data.linkedin);
  if (data.website !== undefined) formData.append("website", data.website);
  if (data.language !== undefined) formData.append("language", data.language);
  if (data.availability_start_date !== undefined)
    formData.append("availability_start_date", data.availability_start_date);
  if (data.availability_end_date !== undefined)
    formData.append("availability_end_date", data.availability_end_date);
  if (data.timezone !== undefined)
    formData.append("timezone", data.timezone);

  // Avatar (File pour upload, null pour suppression)
  if (data.avatar !== undefined) {
    if (data.avatar instanceof File) {
      console.log(
        "📎 Ajout du fichier au FormData:",
        data.avatar.name,
        data.avatar.size + " bytes"
      );
      formData.append("avatar", data.avatar);
    } else if (data.avatar === null) {
      // Envoyer un blob vide + flag de suppression pour supprimer l'avatar
      console.log(
        "🗑️ Suppression avatar: ajout d'un blob vide + flag de suppression au FormData"
      );
      const emptyBlob = new Blob([], { type: "image/jpeg" });
      formData.append("avatar", emptyBlob, "delete.jpg");
      formData.append("remove_avatar", "true");
    }
  }

  // Champs de notification
  const notificationFields = [
    "appointment_notification_sms",
    "appointment_notification_email",
    "message_notification_sms",
    "message_notification_email",
    "promotions_notification_sms",
    "promotions_notification_email",
  ] as const;

  notificationFields.forEach((field) => {
    if ((data as any)[field] !== undefined) {
      formData.append(field, (data as any)[field] ? "true" : "false");
    }
  });

  // JSON strings
  if (data.expertises && data.expertises.length > 0) {
    formData.append("expertises", JSON.stringify(data.expertises));
  }
  if (data.schedules && data.schedules.length > 0) {
    formData.append("schedules", JSON.stringify(data.schedules));
  }
  if (data.extra_data !== undefined) {
    formData.append("extra_data", data.extra_data);
  }

  return formData;
};

/**
 * Valide les données de mise à jour
 */
export const validateUpdateProExpertData = (
  data: UpdateProExpertData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validation des champs requis si fournis
  if (data.first_name !== undefined && !data.first_name.trim()) {
    errors.push("Le prénom ne peut pas être vide");
  }
  if (data.last_name !== undefined && !data.last_name.trim()) {
    errors.push("Le nom ne peut pas être vide");
  }
  if (
    data.domain_id !== undefined &&
    (!data.domain_id || data.domain_id <= 0)
  ) {
    errors.push("Le domaine d'expertise est requis");
  }

  // Validation des dates si fournies
  if (
    data.availability_start_date !== undefined &&
    data.availability_end_date !== undefined
  ) {
    const startDate = new Date(data.availability_start_date);
    const endDate = new Date(data.availability_end_date);
    if (startDate > endDate) {
      errors.push(
        "La date de début de disponibilité doit être antérieure à la date de fin"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Hook pour récupérer un expert pro par ID
 * @param enabled - Permet de désactiver la requête (utile pour les clients sans profil expert)
 */
export const useGetProExpert = (enabled: boolean = true) => {
  return useQuery<ProExpert | null, ProExpertError>({
    queryKey: ["proExpert"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ProExpert>(`pro`);

        // L'API retourne directement l'objet expert
        return response;
      } catch (error: any) {
        // Détecter les erreurs spécifiques qui indiquent qu'aucun profil n'existe
        const errorMessage = error?.message || "";
        const errorData = error?.response?.data || {};

        // Si l'erreur est vide {} ou un objet vide, traiter comme 404 (ressource absente)
        if (
          errorMessage === "Resource not found" ||
          (typeof errorData === "object" &&
            errorData !== null &&
            Object.keys(errorData).length === 0) ||
          (errorData?.error &&
            typeof errorData.error === "object" &&
            Object.keys(errorData.error).length === 0) ||
          errorMessage === "{}" ||
          errorMessage.includes("Cannot coerce the result")
        ) {
          // Retourner null au lieu de lancer une erreur (ressource absente = 404)
          return null;
        }

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la récupération de l'expert"
        );
      }
    },
    enabled, // Permet de désactiver la requête
    retry: (failureCount, error) => {
      // Ne pas réessayer si c'est une erreur "profile not found" ou erreur vide
      const errorMessage = error?.message || "";
      const errorData = (error as any)?.response?.data || {};

      if (
        errorMessage === "Resource not found" ||
        (typeof errorData === "object" &&
          errorData !== null &&
          Object.keys(errorData).length === 0) ||
        (errorData?.error &&
          typeof errorData.error === "object" &&
          Object.keys(errorData.error).length === 0) ||
        errorMessage === "{}" ||
        errorMessage.includes("Cannot coerce the result")
      ) {
        return false;
      }
      // Ne pas réessayer pour les autres erreurs non plus (profil expert optionnel)
      return false;
    },
  });
};

export const useGetProExpertById = (id: string) => {
  return useQuery<ProExpert, ProExpertError>({
    queryKey: ["proExpert", id],
    queryFn: () => apiClient.get<ProExpert>(`pro/${id}`),
  });
};

/**
 * Hook pour mettre à jour un expert pro
 */
export const useUpdateProExpert = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProExpertResponse,
    ProExpertError,
    UpdateProExpertData
  >({
    mutationFn: async (updateData: UpdateProExpertData) => {
      try {
        // Validation des données
        const validation = validateUpdateProExpertData(updateData);
        if (!validation.isValid) {
          throw new Error(`Données invalides: ${validation.errors.join(", ")}`);
        }

        // Transformation vers FormData
        const formData = transformUpdateDataToFormData(updateData);

        // Appel API avec FormData
        const response = await apiClient.fetchFormData<UpdateProExpertResponse>(
          "pro",
          formData,
          {
            method: "PUT",
          }
        );

        return response;
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la mise à jour de l'expert"
        );
      }
    },
    onSuccess: (data) => {
      console.log("✅ Mutation réussie, mise à jour du cache avec:", data.data);

      // Met à jour directement le cache avec les nouvelles données AVANT d'invalider
      if (data.data) {
        queryClient.setQueryData(["proExpert"], data.data);
      }

      // Invalide le cache pour forcer le rechargement des données (en arrière-plan)
      queryClient.invalidateQueries({ queryKey: ["proExpert"] });
    },
    onError: (error) => {
      console.error("Failed to update pro expert:", error);
    },
  });
};

/**
 * Hook pour supprimer un expert pro
 */
export const useDeleteProExpert = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ProExpertError>({
    mutationFn: async () => {
      try {
        await apiClient.delete(`pro`);
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la suppression de l'expert"
        );
      }
    },
    onSuccess: () => {
      console.log("✅ Expert supprimé avec succès");

      // Invalide le cache pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ["proExpert"] });
    },
    onError: (error) => {
      console.error("Failed to delete pro expert:", error);
    },
  });
};
