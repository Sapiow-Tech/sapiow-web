// Types pour l'onboarding des seekers et professionnels
import { DOMAIN_ID_MAPPING } from "@/constants/onboarding";

/**
 * Interface pour les données d'onboarding des seekers
 */
export interface OnboardingSeekerData {
  first_name: string;
  last_name: string;
  email: string;
  avatar?: File | string; // File pour upload, string pour URL existante
  domain_id: number; // IDs des domaines sélectionnés
  timezone?: string;
}

/**
 * Interface pour les données à envoyer à l'API (FormData)
 */
export interface OnboardingSeekerFormData {
  first_name: string;
  last_name: string;
  email: string;
  avatar?: File;
  domain_id: number; // JSON string pour FormData
  timezone?: string;
}

/**
 * Interface pour la réponse de l'API d'onboarding seeker
 */
export interface OnboardingSeekerResponse {
  success: boolean;
  message: string;
  user_id?: string;
  data?: any;
}

/**
 * Type pour les erreurs d'onboarding seeker
 */
export interface OnboardingSeekerError {
  message: string;
  status?: number;
  field?: string;
}

/**
 * Interface pour les domaines disponibles
 */
export interface Domain {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Validation des données d'onboarding seeker
 */
export interface OnboardingSeekerValidation {
  isFirstNameValid: boolean;
  isLastNameValid: boolean;
  isEmailValid: boolean;
  isDomainsValid: boolean;
  isFormValid: boolean;
}

/**
 * Fonction utilitaire pour transformer les données en FormData
 */
export const transformOnboardingSeekerToFormData = (
  data: OnboardingSeekerData
): FormData => {
  const formData = new FormData();

  formData.append("first_name", data.first_name.trim());
  formData.append("last_name", data.last_name.trim());
  formData.append("email", data.email.trim());
  if (data.timezone) formData.append("timezone", data.timezone);

  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  // Convertir les domain_ids en JSON string pour FormData
  formData.append("domain_id", "1");

  return formData;
};

/**
 * Fonction de validation des données seeker
 */
export const validateOnboardingSeekerData = (
  data: OnboardingSeekerData
): OnboardingSeekerValidation => {
  const isFirstNameValid = data.first_name.trim().length > 0;
  const isLastNameValid = data.last_name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isDomainsValid = data.domain_id > 0;

  return {
    isFirstNameValid,
    isLastNameValid,
    isEmailValid,
    isDomainsValid,
    isFormValid:
      isFirstNameValid && isLastNameValid && isEmailValid && isDomainsValid,
  };
};

/**
 * Fonction utilitaire pour vérifier si les données sont valides
 */
export const isOnboardingSeekerDataValid = (
  data: OnboardingSeekerData
): boolean => {
  const validation = validateOnboardingSeekerData(data);
  return validation.isFormValid;
};

/**
 * Fonction utilitaire pour convertir les IDs string en IDs numériques
 */
export const mapDomainIdsToNumeric = (stringIds: string[]): number[] => {
  return stringIds.map((id) => DOMAIN_ID_MAPPING[id]).filter(Boolean);
};

/**
 * Fonction utilitaire pour convertir un ID string en ID numérique (pour expert - domaine unique)
 */
export const mapDomainIdToNumeric = (stringId: string): number => {
  return DOMAIN_ID_MAPPING[stringId] || 0;
};

// ========================================
// TYPES POUR L'ONBOARDING DES EXPERTS
// ========================================

/**
 * Interface pour les expertises d'un expert (ancien format)
 */
export interface Expertise {
  name: string;
  category?: string;
  level?: number; // 1-5 par exemple
}

/**
 * Interface pour le format API des expertises (nouveau format)
 */
export interface ExpertiseApiFormat {
  expertise_id: number;
}

/**
 * Interface pour les créneaux de disponibilité
 */
export interface Schedule {
  day: string; // "monday", "tuesday", etc.
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

/**
 * Interface pour les données d'onboarding des experts
 */
export interface OnboardingExpertData {
  first_name: string;
  last_name: string;
  email?: string; // Email de l'expert (optionnel pour le moment)
  avatar?: File | string; // File pour upload, string pour URL existante
  domain_id: number; // ID numérique du domaine (un seul pour les experts)
  description?: string; // Description professionnelle
  job?: string; // Titre du poste
  linkedin?: string; // URL LinkedIn (optionnel)
  website?: string; // URL site web (optionnel)
  expertises?: ExpertiseApiFormat[]; // Liste des expertises (nouveau format API)
  schedules?: Schedule[]; // Créneaux de disponibilité
  timezone?: string;
}

/**
 * Interface pour les données à envoyer à l'API Expert (FormData)
 */
export interface OnboardingExpertFormData {
  first_name: string;
  last_name: string;
  email?: string;
  avatar?: File;
  domain_id: number;
  description?: string;
  job?: string;
  linkedin?: string; // URL LinkedIn (optionnel)
  website?: string; // URL site web (optionnel)
  expertises?: string; // JSON string pour FormData
  schedules?: string; // JSON string pour FormData
  timezone?: string;
}

/**
 * Interface pour la réponse de l'API d'onboarding expert
 */
export interface OnboardingExpertResponse {
  success: boolean;
  message: string;
  expert_id?: string;
  data?: any;
}

/**
 * Type pour les erreurs d'onboarding expert
 */
export interface OnboardingExpertError {
  message: string;
  status?: number;
  field?: string;
}

/**
 * Validation des données d'onboarding expert
 */
export interface OnboardingExpertValidation {
  isFirstNameValid: boolean;
  isLastNameValid: boolean;
  isEmailValid: boolean;
  isDomainValid: boolean;
  isDescriptionValid: boolean;
  isJobValid: boolean;
  isFormValid: boolean;
}

/**
 * Fonction utilitaire pour transformer les données expert en FormData
 */
export const transformOnboardingExpertToFormData = (
  data: OnboardingExpertData
): FormData => {
  const formData = new FormData();

  formData.append("first_name", data.first_name.trim());
  formData.append("last_name", data.last_name.trim());
  if (data.email) {
    formData.append("email", data.email.trim());
  }
  if (data.domain_id > 0) {
    formData.append("domain_id", data.domain_id.toString());
  }
  if (data.timezone) {
    formData.append("timezone", data.timezone);
  }

  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  if (data.description) {
    formData.append("description", data.description.trim());
  }

  if (data.job) {
    formData.append("job", data.job.trim());
  }

  if (data.linkedin) {
    formData.append("linkedin", data.linkedin.trim());
  }

  if (data.website) {
    formData.append("website", data.website.trim());
  }

  // Convertir les expertises en JSON string pour FormData
  if (data.expertises && data.expertises.length > 0) {
    formData.append("expertises", JSON.stringify(data.expertises));
  }

  return formData;
};

/**
 * Fonction de validation des données expert
 */
export const validateOnboardingExpertData = (
  data: OnboardingExpertData
): OnboardingExpertValidation => {
  const isFirstNameValid = data.first_name.trim().length > 0;
  const isLastNameValid = data.last_name.trim().length > 0;
  const isEmailValid =
    !data.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isDomainValid = data.domain_id > 0;

  // Description et job sont optionnels mais si fournis, doivent être non-vides
  const isDescriptionValid =
    !data.description || data.description.trim().length > 0;
  const isJobValid = !data.job || data.job.trim().length > 0;

  return {
    isFirstNameValid,
    isLastNameValid,
    isEmailValid,
    isDomainValid,
    isDescriptionValid,
    isJobValid,
    isFormValid:
      isFirstNameValid &&
      isLastNameValid &&
      isDomainValid &&
      isDescriptionValid &&
      isJobValid,
  };
};

/**
 * Fonction utilitaire pour vérifier si les données expert sont valides
 */
export const isOnboardingExpertDataValid = (
  data: OnboardingExpertData
): boolean => {
  const validation = validateOnboardingExpertData(data);
  return validation.isFormValid;
};

/**
 * Validation pour la création initiale du profil expert (étape 1, sans domaine)
 */
export const isInitialExpertDataValid = (
  data: OnboardingExpertData
): boolean => {
  const isFirstNameValid = data.first_name.trim().length > 0;
  const isLastNameValid = data.last_name.trim().length > 0;
  const isEmailValid =
    !data.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isJobValid = Boolean(data.job?.trim());

  return isFirstNameValid && isLastNameValid && isEmailValid && isJobValid;
};
