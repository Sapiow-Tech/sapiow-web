import { supabase } from '../lib/supabase/client';

/**
 * Utilitaires pour gérer l'authentification via Supabase
 * Utilise la gestion native de session Supabase (cookies) au lieu de localStorage
 */

export const authUtils = {
  /**
   * Récupérer la session Supabase actuelle
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
    return session;
  },

  /**
   * Récupérer le token d'accès depuis la session Supabase
   */
  getAccessToken: async (): Promise<string | null> => {
    const session = await authUtils.getSession();
    return session?.access_token || null;
  },

  /**
   * Récupérer le token de rafraîchissement depuis la session Supabase
   */
  getRefreshToken: async (): Promise<string | null> => {
    const session = await authUtils.getSession();
    return session?.refresh_token || null;
  },

  /**
   * Récupérer l'ID utilisateur depuis la session Supabase
   */
  getUserId: async (): Promise<string | null> => {
    const session = await authUtils.getSession();
    return session?.user?.id || null;
  },

  /**
   * Récupérer l'utilisateur complet depuis la session Supabase
   */
  getUser: async () => {
    const session = await authUtils.getSession();
    return session?.user || null;
  },

  /**
   * Décoder un JWT pour vérifier son expiration
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return true; // Considérer comme expiré en cas d'erreur
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié avec une session valide
   */
  isAuthenticated: async (): Promise<boolean> => {
    const session = await authUtils.getSession();
    if (!session?.access_token) return false;
    
    // Vérifier si le token est expiré
    if (authUtils.isTokenExpired(session.access_token)) {
      console.log('Token expiré, tentative de refresh automatique');
      return await authUtils.refreshAccessToken();
    }
    
    return true;
  },

  /**
   * Rafraîchir le token d'accès en utilisant le refresh token
   * Supabase gère automatiquement le refresh via les cookies
   */
  refreshAccessToken: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data?.session) {
        console.error('Erreur lors du refresh du token:', error);
        await authUtils.signOut();
        return false;
      }

      console.log('Token rafraîchi avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors du refresh du token:', error);
      await authUtils.signOut();
      return false;
    }
  },

  /**
   * Vérifier et rafraîchir automatiquement le token si nécessaire
   */
  ensureValidToken: async (): Promise<boolean> => {
    const token = await authUtils.getAccessToken();
    if (!token) return false;

    // Si le token n'est pas expiré, tout va bien
    if (!authUtils.isTokenExpired(token)) {
      return true;
    }

    // Essayer de rafraîchir le token
    console.log('Token expiré, tentative de refresh...');
    return await authUtils.refreshAccessToken();
  },

  /**
   * Déconnexion complète (supprime la session Supabase et les cookies)
   */
  signOut: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  /**
   * Déconnexion locale uniquement (pas d'appel GoTrue).
   * Vide les cookies de session Supabase après anonymisation du user Auth.
   */
  signOutLocal: async (): Promise<void> => {
    console.log("[auth] signOutLocal: start");
    if (typeof document === "undefined") return;

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0]?.trim();
      if (!name.startsWith("sb-") || !name.includes("auth-token")) return;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
    console.log("[auth] signOutLocal: cookies cleared");
  },

  /**
   * Alias pour la compatibilité avec l'ancien code
   * @deprecated Utiliser signOut() à la place
   */
  clearTokens: async (): Promise<void> => {
    console.warn('clearTokens() est déprécié, utilisez signOut() à la place');
    await authUtils.signOut();
  },

  /**
   * Récupérer les headers d'authentification pour les requêtes API
   */
  getAuthHeaders: async (): Promise<Record<string, string>> => {
    const access_token = await authUtils.getAccessToken();
    return access_token ? { Authorization: `Bearer ${access_token}` } : {};
  },
};
