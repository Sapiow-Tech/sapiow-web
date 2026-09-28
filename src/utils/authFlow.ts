export const AUTH_NEXT_STORAGE_KEY = "authNextPath";

const isBrowser = () => typeof window !== "undefined";

export const sanitizeInternalNextPath = (value: string | null | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return null;
  return trimmed;
};

export const setAuthNextPath = (nextPath: string | null | undefined) => {
  if (!isBrowser()) return;
  const sanitized = sanitizeInternalNextPath(nextPath);
  if (!sanitized) {
    localStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_NEXT_STORAGE_KEY, sanitized);
};

export const getAuthNextPath = () => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(AUTH_NEXT_STORAGE_KEY);
  return sanitizeInternalNextPath(raw);
};

export const clearAuthNextPath = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
};

export const isBookingResumeNext = (path: string | null | undefined) => {
  const sanitized = sanitizeInternalNextPath(path);
  return sanitized === "/booking/resume";
};

