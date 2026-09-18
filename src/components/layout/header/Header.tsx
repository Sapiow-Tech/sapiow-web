"use client";
import {
  useMarkNotificationAsRead,
  useProNotifications,
} from "@/api/notifications/useNotification";
import { HamburgerButton } from "@/components/common/HamburgerButton";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { ShareLinkButton } from "@/components/common/ShareLinkButton";
import { Button } from "@/components/ui/button";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useModeSwitch } from "@/hooks/useModeSwitch";
import { useTodayVisios } from "@/hooks/useTodayVisios";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Switch } from "../../ui/switch";
import { AccountSidebar } from "../AccountSidebar";

interface HeaderProps {
  text?: string;
  hideProfile?: boolean;
  isBorder?: boolean;
  showHamburger?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  text,
  hideProfile,
  isBorder,
  showHamburger = false,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { isExpertMode, handleModeSwitch } = useModeSwitch();
  const { user } = useTodayVisios();
  const { data: notifications } = useProNotifications();
  const { mutateAsync: markNotificationAsRead } = useMarkNotificationAsRead();
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Compter les notifications non lues
  const unreadCount =
    notifications?.filter((n) => n.read_at === null).length || 0;

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationRedirect = (notification: any) => {
    const title = notification.title.toLowerCase();
    const body = notification.body?.toLowerCase() || "";

    // Déterminer le type de notification et rediriger
    if (title.includes("message") || body.includes("message")) {
      router.push("/messages");
    } else if (
      title.includes("rendez-vous") ||
      title.includes("appointment") ||
      title.includes("visio") ||
      body.includes("rendez-vous") ||
      body.includes("appointment")
    ) {
      router.push("/visios");
    }

    setShowNotifications(false);
  };

  const handleMarkAsRead = async (
    notificationId: string,
    notification: any
  ) => {
    try {
      await markNotificationAsRead(notificationId);
      handleNotificationRedirect(notification);
    } catch (error) {
      console.error(t("header.markAsReadError"), error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return t("header.justNow");
    if (diffInMinutes < 60)
      return `${t("header.minutesAgo")} ${diffInMinutes}${t("header.minutes")}`;
    if (diffInMinutes < 1440)
      return `${t("header.hoursAgo")} ${Math.floor(diffInMinutes / 60)}${t(
        "header.hours"
      )}`;

    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <>
      <header
        className={`w-full pt-8 ${
          isBorder ? "lg:border-b-2" : ""
        } lg:border-snow-blue bg-white px-6 py-1 sticky top-0 z-20`}
      >
        <div className="flex items-center justify-between">
          {/* Section gauche - Photo de profil et message */}
          <div className="flex flex-col items-start gap-4">
            {text && (
              <div className="flex items-center gap-2 py-5">
                {/* Bouton hamburger mobile pour les pages de compte */}
                {showHamburger && (
                  <div className="lg:hidden">
                    <HamburgerButton onClick={toggleMobileMenu} />
                  </div>
                )}
                <h2 className="text-base font-bold text-cobalt-blue-500 whitespace-nowrap">
                  {text}
                </h2>
              </div>
            )}
            {!hideProfile && (
              <ProfileAvatar
                src={user?.avatar || ""}
                alt={`${user?.first_name || ""} ${user?.last_name || ""}`.trim()}
                size="lg"
              />
            )}
          </div>

          {/* Section droite - Bouton de partage et switch mode expert */}
          <div className="gap-6 flex items-center">
            {/* Bouton de partage */}
            <div className="hidden lg:flex">
              <ShareLinkButton />
            </div>
            {/* Mode expert switch */}
            <div className="hidden lg:flex items-center gap-3 bg-exford-blue px-3 py-2 rounded-full">
              <span className="text-white font-bold">
                {t("header.expertMode")}
              </span>
              <Switch
                checked={isExpertMode}
                onCheckedChange={handleModeSwitch}
                className="data-[state=checked]:bg-[#1E293B] transition-all duration-500"
              />
            </div>

            {/* Bouton notifications avec dropdown */}
            <div className="relative left-[8.3px]" ref={notificationRef}>
              <Button
                onClick={handleNotificationClick}
                className="w-12 h-12 p-[3px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 bg-snow-blue hover:bg-snow-blue/80 shadow-none"
              >
                <Image
                  src="/assets/icons/notif.svg"
                  alt="notifications"
                  width={24}
                  height={24}
                />
                {/* Badge compteur */}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2.5 pt-[1px] bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Button>

              {/* Dropdown des notifications */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t("header.notifications")}
                        </h3>
                        {unreadCount > 0 && (
                          <p className="text-sm text-gray-500">
                            {unreadCount}{" "}
                            {unreadCount > 1
                              ? t("header.unreadPlural")
                              : t("header.unreadSingular")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() =>
                            handleMarkAsRead(notification.id, notification)
                          }
                          className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.read_at ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {notification.title
                                .toLowerCase()
                                .includes("rendez-vous") ? (
                                <span className="text-lg">📅</span>
                              ) : notification.title
                                  .toLowerCase()
                                  .includes("message") ? (
                                <span className="text-lg">💬</span>
                              ) : (
                                <span className="text-lg">
                                  {" "}
                                  <Image
                                    src="/assets/icons/notif.svg"
                                    alt="notifications"
                                    width={24}
                                    height={24}
                                  />
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.body}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatTime(notification.created_at)}
                                </span>
                                {!notification.read_at && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <span className="text-2xl mb-2 flex justify-center items-center">
                          <Image
                            src="/assets/icons/notif.svg"
                            alt="notifications"
                            width={24}
                            height={24}
                          />
                        </span>
                        <p className="text-sm">{t("header.noNotifications")}</p>
                      </div>
                    )}
                  </div>

                  {/* {notifications && notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <button className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        {t("header.seeAllNotifications")}
                      </button>
                    </div>
                  )} */}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile overlay */}
      {showHamburger && isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        >
          <div
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-light-blue-gray">
              <h2 className="text-lg font-bold text-cobalt-blue-500">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <AccountSidebar isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
