import type { MetadataRoute } from "next";

const SITE_URL = "https://app.sapiow.com";
const LOCALES = ["fr", "en"] as const;

const PRIVATE_PATHS = [
  "/login",
  "/compte",
  "/messages",
  "/payment",
  "/onboarding",
  "/oauth-callback",
  "/reauth",
  "/booking",
  "/favori",
  "/visios",
  "/compte-connecte",
] as const;

function privateDisallows(): string[] {
  return LOCALES.flatMap((locale) =>
    PRIVATE_PATHS.map((path) => `/${locale}${path}`)
  );
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privateDisallows(),
    },
    host: SITE_URL,
  };
}
