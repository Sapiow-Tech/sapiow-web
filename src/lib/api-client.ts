import { authUtils } from "../utils/auth";

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!API_URL) {
  throw new Error(
    "L'URL de l'API est manquante dans les variables d'environnement"
  );
}

export const api = {
  baseUrl: `${API_URL}/functions/v1`,
  headers: {
    "Content-Type": "application/json",
  },
};

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  response?: { data?: unknown };
}

function coerceErrorValue(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value != null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }
  return null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Une erreur est survenue",
): string {
  if (error instanceof Error) {
    if (error.message && error.message !== "[object Object]") {
      return error.message;
    }
    const responseData = (error as ApiError).response?.data;
    if (responseData && typeof responseData === "object") {
      const record = responseData as Record<string, unknown>;
      const coerced =
        coerceErrorValue(record.error) ?? coerceErrorValue(record.message);
      if (coerced) return coerced;
    }
  }

  return coerceErrorValue(error) ?? fallback;
}

/**
 * Endpoints accessibles sans authentification (pas de token requis).
 * Important: l'accès public dépend aussi des règles côté backend.
 */
const isPublicEndpoint = (endpoint: string) => {
  // `search` (avec ou sans querystring) doit être public pour afficher la liste des pros sans login
  if (endpoint === "search" || endpoint.startsWith("search?")) return true;
  // Catégories (domaines) + sous-catégories (expertises) utilisées sur la home
  if (endpoint === "domain") return true;
  if (endpoint.startsWith("expertise?")) return true;
  // Fiche pro: autoriser `pro/{id}` en public (mais pas `pro` seul)
  if (endpoint.startsWith("pro/") && endpoint.length > "pro/".length)
    return true;
  if (endpoint === "sponso" || endpoint.startsWith("sponso/")) return true;
  return false;
};

/**
 * Client API centralisé avec gestion automatique de l'authentification Supabase
 */
export const apiClient = {
  /**
   * Effectue une requête GET
   */
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return fetchApi<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * Effectue une requête POST
   */
  post: async <T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Effectue une requête PUT
   */
  put: async <T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Effectue une requête DELETE
   */
  delete: async <T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Effectue une requête avec JSON (méthode générique)
   */
  fetchJson: async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    return fetchApi<T>(endpoint, options);
  },

  /**
   * Effectue une requête avec FormData (pour upload de fichiers)
   */
  fetchFormData: async <T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<T> => {
    return fetchApi<T>(endpoint, {
      ...options,
      method: options.method || "POST",
      body: formData,
    });
  },
};

/**
 * Fonction utilitaire pour effectuer des requêtes API avec gestion automatique de l'authentification
 */
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const publicEndpoint = isPublicEndpoint(endpoint);

  // Vérifier et rafraîchir le token si nécessaire avant la requête
  // Sauf pour les endpoints publics (ex: `search`)
  if (!publicEndpoint) {
    const isTokenValid = await authUtils.ensureValidToken();

    if (!isTokenValid) {
      const error = new Error(
        "Session expirée. Veuillez vous reconnecter."
      ) as ApiError;
      error.status = 401;
      error.statusText = "Unauthorized";
      throw error;
    }
  }

  // Gateway Supabase exige toujours un Bearer JWT (user ou anon)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const accessToken = await authUtils.getAccessToken();
  const bearerToken = accessToken || anonKey;

  const headers: Record<string, string> = {
    apikey: anonKey,
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${api.baseUrl}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Déconnecter uniquement sur 401/403 d'endpoints protégés (jamais sur les publics)
    if (!publicEndpoint && (response.status === 401 || response.status === 403)) {
      console.log("Erreur d'authentification détectée, déconnexion");
      await authUtils.signOut();

      const error = new Error(
        "Session expirée. Veuillez vous reconnecter."
      ) as ApiError;
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    let errorMessage = `API error: ${response.statusText}`;
    let errorData: any = null;

    try {
      // Essayer d'extraire le message d'erreur détaillé de la réponse
      errorData = await response.json();

      if (errorData.error) {
        // Si l'erreur a un champ "error"
        if (
          typeof errorData.error === "object" &&
          Object.keys(errorData.error).length === 0
        ) {
          // Objet vide {} - traiter comme ressource absente
          errorMessage = "Resource not found";
        } else if (typeof errorData.error === "string") {
          errorMessage = errorData.error;
        } else {
          errorMessage = JSON.stringify(errorData.error);
        }
      } else if (errorData.message) {
        const coerced = coerceErrorValue(errorData.message);
        if (coerced) {
          errorMessage = coerced;
        }
      } else if (typeof errorData === "string") {
        // Si c'est une chaîne simple
        errorMessage = errorData;
      } else if (
        typeof errorData === "object" &&
        Object.keys(errorData).length === 0
      ) {
        // Objet vide {} - traiter comme ressource absente
        errorMessage = "Resource not found";
      }
    } catch (parseError) {
      // Si on ne peut pas parser la réponse JSON, garder le message par défaut
      console.warn("Impossible de parser la réponse d'erreur:", parseError);
    }

    // Créer une erreur avec le message extrait et les détails originaux
    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    error.statusText = response.statusText;
    // Stocker les données d'erreur brutes pour une inspection ultérieure
    (error as any).response = { data: errorData };

    throw error;
  }

  // Gérer les réponses vides (204 No Content, etc.)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text() as any;
  }
};
