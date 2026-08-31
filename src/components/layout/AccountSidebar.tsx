import { useExpertModeSwitch } from "@/hooks/useExpertModeSwitch";
import { useModeSwitch } from "@/hooks/useModeSwitch";
import { supabase } from "@/lib/supabase/client";
import { useCurrentUser } from "@/store/useCurrentUser";
import { useUserStore } from "@/store/useUser";
import { cleanupAllStreamConnections } from "@/utils/streamCleanup";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../common/Button";
import { ShareLinkButton } from "../common/ShareLinkButton";
import { Switch } from "../ui/switch";

const getNavItems = (t: any) => [
  {
    label: t("account.profile"),
    icon: "/assets/icons/profile.svg",
    href: "/compte/profile",
  },
  {
    label: t("account.availability"),
    icon: "/assets/icons/calendar.svg",
    href: "/compte/disponibilites",
  },
  {
    label: t("account.paymentHistory"),
    icon: "/assets/icons/card.svg",
    href: "/compte/historique-paiements",
  },
  {
    label: t("account.offers"),
    icon: "/assets/icons/tag.svg",
    href: "/compte/offres",
  },
  {
    label: t("account.organization"),
    icon: "/assets/icons/business.svg",
    href: "/compte/organisation",
  },
  {
    label: t("account.revenue"),
    icon: "/assets/icons/wallet.svg",
    href: "/compte/revenus",
  },
  {
    label: t("account.notifications"),
    icon: "/assets/icons/notif.svg",
    href: "/compte/notifications",
  },
  {
    label: t("account.language"),
    icon: "/assets/icons/lang.svg",
    href: "/compte/langue",
  },
  {
    label: t("account.support"),
    icon: "/assets/icons/help.svg",
    href: "/compte/support",
  },
  {
    label: t("account.legalMentions"),
    icon: "/assets/icons/shield.svg",
    href: "/compte/mentions-legales",
  },
  {
    label: t("account.about"),
    icon: "/assets/icons/info.svg",
    href: "/compte/a-propos",
  },
];

interface AccountSidebarProps {
  isMobile?: boolean;
}

export function AccountSidebar({ isMobile = false }: AccountSidebarProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { setCurrentUser } = useCurrentUser();
  const { user } = useUserStore();
  const { handleExpertModeSwitch, hasExpertProfile } = useExpertModeSwitch();
  const navItems = getNavItems(t);

  const sidebarClasses = isMobile
    ? "w-full h-full flex flex-col px-4 py-4"
    : " w-[302px] h-[calc(100vh-105px)] sticky top-[102px] z-30 flex flex-col px-4 py-4 border-r border-r-light-blue-gray bg-white";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // 0. Nettoyer TOUTES les connexions Stream avant la déconnexion
      await cleanupAllStreamConnections();

      // Déconnexion via Supabase (gère automatiquement la suppression de la session et des cookies)
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erreur lors de la déconnexion:", error);
        return;
      }

      // 1. Nettoyer le localStorage (données temporaires uniquement)
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("selectedCountry");

      // 2. Nettoyer le localStorage persisté de Zustand
      localStorage.removeItem("user-storage");

      // 3. Réinitialiser les stores Zustand
      setUser({ type: "client" });
      setCurrentUser(null);

      // 4. Invalider TOUT le cache React Query
      queryClient.clear();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // 5. Rediriger vers la page de connexion
      router.replace("/login");
      setIsLoggingOut(false);
    }
  };

  // Filtrer les éléments de navigation selon le type d'utilisateur
  const getFilteredNavItems = () => {
    if (user.type === "client") {
      // Client : Mon profil, Historique des paiements, Notifications, Langue, Besoin d'aide ?, Mentions légales, A propos
      const allowedLabels = [
        t("account.profile"),
        t("account.paymentHistory"),
        t("account.notifications"),
        t("account.language"),
        t("account.support"),
        t("account.legalMentions"),
        t("account.about"),
      ];
      return navItems.filter((item) => allowedLabels.includes(item.label));
    } else {
      // Expert : Tous sauf Historique des paiements
      return navItems.filter(
        (item) => item.label !== t("account.paymentHistory")
      );
    }
  };

  const filteredNavItems = getFilteredNavItems();
  const { isExpertMode, handleModeSwitch } = useModeSwitch();
  return (
    <aside className={`${sidebarClasses}`}>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto z-50 -mt-4">
        <ul className="space-y-0">
          {user.type === "expert" && <ShareLinkButton className="mb-5 mt-5" />}

          {/* Switch mode expert/client */}
          {user.type === "expert" ? (
            // Pour les experts : afficher "Mode expert"
            <div className="flex lg:hidden items-center gap-3 bg-exford-blue px-3 py-2 rounded-full w-fit mb-4">
              <span className="text-white font-bold">
                {t("header.expertMode")}
              </span>
              <Switch
                checked={isExpertMode}
                onCheckedChange={handleModeSwitch}
                className="data-[state=checked]:bg-[#1E293B] transition-all duration-500"
              />
            </div>
          ) : (
            // Pour les clients : afficher "Mode expert" ou "Mode client" selon l'état
            hasExpertProfile && (
              <div className="flex lg:hidden items-center gap-3 bg-exford-blue px-3 py-2 rounded-full w-fit mb-4">
                <span className="text-white font-bold">
                  {isExpertMode
                    ? t("header.expertMode")
                    : t("headerClient.clientMode")}
                </span>
                <Switch
                  checked={isExpertMode}
                  onCheckedChange={handleModeSwitch}
                  className="data-[state=checked]:bg-[#1E293B] transition-all duration-500"
                />
              </div>
            )
          )}
          {filteredNavItems.map((item, index) => {
            // Extraire le chemin sans la locale (fr/en) pour la comparaison
            const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/";
            const isActive = pathWithoutLocale === item.href;
            // Ajouter mt-[10px] au premier élément si c'est un client
            const marginTop =
              user.type === "client" && index === 0 ? "mt-[30px]" : "mt-[3px]";
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-2 py-0 ${marginTop} h-[56px] rounded-xl hover:bg-[#F7F9FB] transition group font-medium text-base text-exford-blue font-figtree ${
                    isActive ? "bg-[#F7F9FB]" : ""
                  }`}
                >
                  <Image src={item.icon} alt="" width={22} height={22} />
                  <span
                    className={`flex-1 text-[12px] lg:text-[15px] font-medium font-figtree`}
                  >
                    {item.label}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#1E293B] opacity-60 group-hover:opacity-100"
                  >
                    <path
                      d="M7 13l4-4-4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {!hasExpertProfile && (
        <div className="flex flex-col w-full max-w-[302px] h-[172px] bg-[#E8F2FF] rounded-[12px] p-4">
          <h2 className="text-base font-bold text-exford-blue font-figtree">
            {t("account.becomeExpert")}
          </h2>
          <p className="text-sm text-exford-blue font-figtree font-normal">
            {t("account.becomeExpertDescription")}
          </p>
          <div className="flex mt-5">
            <Link
              href="/compte/devenir-expert"
              className="w-full text-sm text-charcoal-blue font-semibold font-figtree py-2 rounded-xl hover:bg-[#F7F9FB] transition"
            >
              {t("account.learnMore")}
            </Link>
            <Button
              label={t("account.becomeExpertButton")}
              className="h-10 font-bold text-base font-figtree w-full max-w-[130px] text-white"
              onClick={handleExpertModeSwitch}
            />
          </div>
        </div>
      )}
      {/* Déconnexion sticky en bas */}
      <div
        className={`${
          isMobile ? "mt-auto" : "sticky bottom-0 left-0"
        } pt-4 pb-2 -mx-4 px-4 z-10`}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-center text-[#1E293B] font-bold text-[15px] py-2 rounded-xl hover:bg-[#F7F9FB] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-figtree"
        >
          {isLoggingOut ? t("account.loggingOut") : t("account.logout")}
        </button>
      </div>
    </aside>
  );
}
