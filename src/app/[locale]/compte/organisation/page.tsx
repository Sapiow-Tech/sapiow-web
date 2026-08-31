"use client";

import OrganizationPanel from "@/components/organization/OrganizationPanel";
import { useTranslations } from "next-intl";
import AccountLayout from "../AccountLayout";

export default function OrganisationPage() {
  const t = useTranslations("organization");

  return (
    <AccountLayout>
      <div className="w-full py-0 px-5">
        <h1 className="text-xl font-semibold text-charcoal-blue mb-6">
          {t("pageTitle")}
        </h1>
        <OrganizationPanel />
      </div>
    </AccountLayout>
  );
}
