"use client";
import { useActiveSponsoBanners } from "@/api/sponso/useSponso";
import { SponsoredBanner } from "@/components/sponso/SponsoredBanner";
import { Header } from "@/components/layout/header/Header";
import { HeaderClient } from "@/components/layout/header/HeaderClient";
import { AppSidebar } from "@/components/layout/Sidebare";
import { useSearchStore } from "@/store/useSearchStore";
import { useUserStore } from "@/store/useUser";
import { authUtils } from "@/utils/auth";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Client from "./home/Client";
import Expert from "./home/Expert";

function Home() {
  const { user } = useUserStore();
  const { searchQuery } = useSearchStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(user.type);
  const [isRedirectingOAuth, setIsRedirectingOAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { data: sponsoBanners = [] } = useActiveSponsoBanners();
  const [sponsoIndex, setSponsoIndex] = useState(0);

  const isSearchMode = Boolean(searchQuery && searchQuery.trim().length > 0);

  useEffect(() => {
    authUtils
      .isAuthenticated()
      .then(setIsAuthenticated)
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    const scope = params.get("scope");

    if (authCode && scope?.includes("googleapis.com/auth/calendar")) {
      setIsRedirectingOAuth(true);
      router.replace(`/${locale}/oauth-callback${window.location.search}`);
      return;
    }
  }, [router, locale]);

  const viewType =
    isAuthenticated === null
      ? user.type === "expert"
        ? "expert"
        : "client"
      : isAuthenticated && user.type === "expert"
        ? "expert"
        : "client";

  useEffect(() => {
    if (viewType !== currentUserType) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentUserType(viewType);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
    setIsTransitioning(false);
  }, [viewType, currentUserType]);

  useEffect(() => {
    setSponsoIndex(0);
  }, [sponsoBanners.length]);

  const activeSponsoBanner = sponsoBanners[sponsoIndex] ?? sponsoBanners[0];
  const showSponsoTopBand =
    viewType === "client" &&
    !isSearchMode &&
    Boolean(activeSponsoBanner);

  if (isRedirectingOAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {showSponsoTopBand && activeSponsoBanner && (
        <SponsoredBanner
          banner={activeSponsoBanner}
          showSponsoredLabel
        />
      )}

      <div className="flex min-h-0 flex-1 lg:flex">
        <AppSidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 transition-all duration-300 ease-in-out">
            {viewType === "client" ? (
              <HeaderClient />
            ) : (
              <Header isBorder={true} />
            )}
          </div>
          <div className="relative flex-1 overflow-hidden px-5">
            <div
              className={`transition-all duration-300 ease-in-out transform ${
                isTransitioning
                  ? "opacity-0 translate-y-2 scale-[0.98]"
                  : "opacity-100 translate-y-0 scale-100"
              }`}
            >
              {viewType === "client" ? (
                <Client
                  sponsoBanners={isSearchMode ? [] : sponsoBanners}
                  sponsoIndex={sponsoIndex}
                  onSponsoIndexChange={setSponsoIndex}
                />
              ) : (
                <Expert />
              )}
            </div>
          </div>

          <footer className="mt-auto border-t border-soft-ice-gray px-5 py-4">
            <div className="flex flex-col gap-2 text-sm text-ash-gray sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={`/${locale}/mentions-legales`}
                className="w-fit underline-offset-4 hover:underline"
              >
                {t("account.legalMentions")}
              </Link>
              <Link
                href={`/${locale}/mentions-legales#tos`}
                className="w-fit underline-offset-4 hover:underline"
              >
                {t("legalMentions.termsOfService")}
              </Link>
              <Link
                href={`/${locale}/mentions-legales#privacy`}
                className="w-fit underline-offset-4 hover:underline"
              >
                {t("legalMentions.privacyPolicy")}
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Home;
