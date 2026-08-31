"use client";

import { useRouter } from "next/navigation";
import type { SponsoBanner } from "@/api/sponso/useSponso";
import { getSponsoDestination } from "@/api/sponso/useSponso";
import { useLocale, useTranslations } from "next-intl";

type SponsoredBannerProps = {
  banner: SponsoBanner;
  /** Pill blanche « Sponsorisé » à côté du texte (home) */
  showSponsoredLabel?: boolean;
  /** Ancien style pill semi-transparente (détails / org) */
  showSponsoredBadge?: boolean;
};

export function SponsoredBanner({
  banner,
  showSponsoredLabel = false,
  showSponsoredBadge = false,
}: SponsoredBannerProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("sponso");

  return (
    <button
      type="button"
      onClick={() => router.push(getSponsoDestination(banner, locale))}
      className="flex w-full cursor-pointer items-center justify-center gap-2 bg-[#011E44] px-4 py-3.5 text-white transition hover:bg-[#011E44]/95"
    >
      <span className="min-w-0 truncate text-sm font-medium font-figtree">
        {banner.banner_text}
      </span>
      {showSponsoredLabel && (
        <span className="pointer-events-none shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-[#011E44]">
          {t("sponsored")}
        </span>
      )}
      {showSponsoredBadge && !showSponsoredLabel && (
        <span className="ml-1 shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium">
          {t("sponsored")}
        </span>
      )}
    </button>
  );
}
