import { Button as ButtonUI } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "./Button";

interface AvailabilityButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const AvailabilityButton = ({
  icon,
  label,
  onClick,
}: AvailabilityButtonProps) => (
  <ButtonUI
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full h-[56px]"
  >
    <div className="flex items-center gap-3">
      <Image src={icon} width={20} height={20} alt="icon" />
      <span className="text-base font-medium text-gray-900">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </ButtonUI>
);

interface AvailabilityButtonsProps {
  onManageAvailability: () => void;
  isGoogleConnected: boolean;
  connectedEmail?: string;
  onDisconnect: () => void;
  isDisconnecting?: boolean;
}

export const AvailabilityButtons = ({
  onManageAvailability,
  isGoogleConnected,
  connectedEmail,
  onDisconnect,
  isDisconnecting = false,
}: AvailabilityButtonsProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-4 w-full mb-40 lg:mb-0">
      <AvailabilityButton
        icon="/assets/icons/calendar.svg"
        label={t("availabilityButtons.manageAvailability")}
        onClick={onManageAvailability}
      />
      {isGoogleConnected && connectedEmail ? (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/assets/icons/googleCalendar.svg"
              width={40}
              height={40}
              alt="Google Calendar"
              className="flex-shrink-0"
            />
            <span className="text-sm font-medium font-figtree text-gray-900 truncate">
              {connectedEmail}
            </span>
          </div>
          <Button
            label={
              isDisconnecting
                ? t("syncedCalendars.disconnecting")
                : t("syncedCalendars.disconnect")
            }
            onClick={onDisconnect}
            disabled={isDisconnecting}
            className="text-sm font-semibold font-figtree text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 flex-shrink-0"
          />
        </div>
      ) : null}
    </div>
  );
};
