"use client";

import { useTranslations } from "next-intl";

export type RevenueScope = "organization" | "personal";

type RevenueScopeTabsProps = {
  value: RevenueScope;
  onChange: (value: RevenueScope) => void;
};

export default function RevenueScopeTabs({
  value,
  onChange,
}: RevenueScopeTabsProps) {
  const t = useTranslations("organization");

  return (
    <div className="inline-flex rounded-full bg-white border border-light-blue-gray p-1">
      <button
        type="button"
        onClick={() => onChange("organization")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          value === "organization"
            ? "bg-exford-blue text-white"
            : "text-charcoal-blue hover:text-exford-blue"
        }`}
      >
        {t("revenueOrganizationTab")}
      </button>
      <button
        type="button"
        onClick={() => onChange("personal")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          value === "personal"
            ? "bg-exford-blue text-white"
            : "text-charcoal-blue hover:text-exford-blue"
        }`}
      >
        {t("revenuePersonalTab")}
      </button>
    </div>
  );
}
