"use client";

import { useGetStatistics } from "@/api/statistics/useStatistics";
import { useOrganizationStatistics } from "@/api/organization/useOrganizationStatistics";
import { getProSubscription } from "@/api/pro-payouts/proSubscription";
import BankAccountSection from "@/components/revenue/BankAccountSection";
import PaymentHistory from "@/components/revenue/PaymentHistory";
import RevenueDisplay from "@/components/revenue/RevenueDisplay";
import RevenueFilters from "@/components/revenue/RevenueFilters";
import RevenueScopeTabs, {
  type RevenueScope,
} from "@/components/revenue/RevenueScopeTabs";
import ProSubscriptionsList, {
  type ProSubscription,
} from "@/components/common/ProSubscriptionsList";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useGetOrganization } from "@/api/organization/useOrganization";
import { getDateRangeByFilter } from "@/utils/dateFilters";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import AccountLayout from "../AccountLayout";

export default function Revenus() {
  useProtectedPage({ allowedUserTypes: ["expert"] });
  const t = useTranslations();
  const tOrg = useTranslations("organization");
  const { data: organizationData } = useGetOrganization();
  const isOrgMember =
    organizationData?.membership?.role === "member" &&
    organizationData?.membership?.status === "active";
  const isOrgOwner =
    organizationData?.membership?.role === "owner" &&
    organizationData?.membership?.status === "active";
  const currentLocale = useLocale();
  const dateLocale = currentLocale === "fr" ? "fr-FR" : "en-US";
  const [activeFilter, setActiveFilter] = useState("Ce mois-ci");
  const [customDateRange, setCustomDateRange] = useState<
    DateRange | undefined
  >();
  const [subscriptions, setSubscriptions] = useState<ProSubscription[]>([]);
  const [revenueScope, setRevenueScope] = useState<RevenueScope>("organization");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleCustomDateRangeChange = (range: DateRange | undefined) => {
    setCustomDateRange(range);
  };

  const dateRange = useMemo(() => {
    const customRange =
      customDateRange?.from && customDateRange?.to
        ? {
            start: customDateRange.from.toISOString().split("T")[0],
            end: customDateRange.to.toISOString().split("T")[0],
          }
        : undefined;

    return getDateRangeByFilter(activeFilter, customRange);
  }, [activeFilter, customDateRange]);

  const statisticsFilters = dateRange
    ? { start: dateRange.start, end: dateRange.end }
    : undefined;

  const {
    data: statistics,
    isFetching: statisticsFetching,
  } = useGetStatistics(
    statisticsFilters,
    !isOrgOwner || revenueScope === "personal",
  );
  const {
    data: organizationStatistics,
    isFetching: organizationStatisticsFetching,
  } = useOrganizationStatistics(statisticsFilters, isOrgOwner);

  const isRevenueLoading = isOrgOwner
    ? revenueScope === "organization"
      ? organizationStatisticsFetching
      : statisticsFetching
    : statisticsFetching;

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getProSubscription<ProSubscription[]>();
        if (!isMounted) return;
        setSubscriptions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("pro-subscription error:", e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscriptionCancelled = (subscriptionId: string | number) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscriptionId
          ? { ...s, status: "cancelled", active: false }
          : s
      )
    );
  };

  const displayedAmount = isOrgOwner
    ? revenueScope === "organization"
      ? organizationStatistics?.organization.totalPrice
      : statistics?.totalPrice
    : statistics?.totalPrice;

  if (isOrgMember) {
    return (
      <AccountLayout>
        <div className="px-5 py-8">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 max-w-xl">
            {tOrg("memberRevenueBlocked")}
          </div>
        </div>
      </AccountLayout>
    );
  }

  const showOrganizationView = !isOrgOwner || revenueScope === "organization";
  const showPersonalView = isOrgOwner && revenueScope === "personal";

  return (
    <AccountLayout>
      <div className="space-y-8 mt-2.5 px-4 lg:px-2 xl:px-4">
        {isOrgOwner && (
          <div className="flex justify-center lg:justify-start">
            <RevenueScopeTabs value={revenueScope} onChange={setRevenueScope} />
          </div>
        )}

        <div className="p-4 bg-soft-ice-gray rounded-[16px] relative before:content-[''] before:absolute before:top-6 before:bottom-6 before:left-1/2 before:w-px before:bg-frost-gray before:transform before:-translate-x-1/2 before:hidden lg:before:block">
          <div
            className={`mx-auto grid grid-cols-1 ${
              showOrganizationView ? "lg:grid-cols-2" : ""
            }`}
          >
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-charcoal-blue font-figtree">
                {showPersonalView
                  ? tOrg("personalEarningsTitle")
                  : t("revenue.totalEarnings")}
              </h2>
              <RevenueFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onCustomDateRangeChange={handleCustomDateRangeChange}
              />
              <RevenueDisplay
                amount={displayedAmount?.toString() || "0"}
                isLoading={isRevenueLoading}
              />
              {showPersonalView && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
                  {tOrg("personalRevenueOrgPayoutNote")}
                </div>
              )}
              {showOrganizationView &&
                isOrgOwner &&
                (organizationStatistics?.by_member?.length ?? 0) > 1 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-charcoal-blue uppercase tracking-wide">
                      {tOrg("revenueByMember")}
                    </h3>
                    {isRevenueLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-10 bg-gray-200 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                    <div className="space-y-2">
                      {organizationStatistics?.by_member.map((member) => (
                        <div
                          key={member.pro_id}
                          className="flex items-center justify-between text-sm text-charcoal-blue bg-white rounded-lg px-3 py-2 border border-light-blue-gray"
                        >
                          <span>
                            {member.first_name || member.last_name
                              ? `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim()
                              : tOrg("unknownMember")}
                          </span>
                          <span className="font-medium">
                            {member.totalPrice}€ · {member.count}
                          </span>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                )}
            </div>

            {showOrganizationView && (
              <BankAccountSection
                organizationName={organizationData?.organization?.name}
                isOrganizationStripe={isOrgOwner}
              />
            )}
          </div>
        </div>

        {showOrganizationView && (
          <>
            <div className="p-4 bg-white border border-light-blue-gray rounded-[16px]">
              <ProSubscriptionsList
                subscriptions={subscriptions}
                locale={dateLocale}
                onCancelled={handleSubscriptionCancelled}
              />
            </div>
            <PaymentHistory />
          </>
        )}
      </div>
    </AccountLayout>
  );
}
