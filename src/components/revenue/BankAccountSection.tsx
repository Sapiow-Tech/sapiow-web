import {
  useCreateAccountStripe,
  useGetInfoStripeAccount,
  useUpdateBank,
} from "@/api/proBank/useBank";
import { useGetOrganization } from "@/api/organization/useOrganization";
import { Button } from "@/components/common/Button";
import { LoadingModal } from "@/components/common/LoadingModal";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

function maskAccountId(id: string) {
  if (id.length <= 8) return id;
  return `${id.slice(0, 5)}${"•".repeat(id.length - 8)}${id.slice(-3)}`;
}

export default function BankAccountSection({
  organizationName,
  isOrganizationStripe = false,
}: {
  organizationName?: string;
  isOrganizationStripe?: boolean;
}) {
  const t = useTranslations();
  const { mutate: createStripeAccount } = useCreateAccountStripe();
  const { mutate: updateBank } = useUpdateBank();
  const { data: bankAccount, isLoading: isFetching } =
    useGetInfoStripeAccount();
  const { data: organizationData } = useGetOrganization();
  const tOrg = useTranslations("organization");
  const [isLoading, setIsLoading] = useState(false);

  const isOrgOwner =
    organizationData?.membership?.role === "owner" &&
    organizationData?.membership?.status === "active";
  const isOrgMember =
    organizationData?.membership?.role === "member" &&
    organizationData?.membership?.status === "active";
  const managedByOrganization =
    bankAccount?.managed_by_organization || isOrgMember;
  const showOrganizationStripe =
    isOrganizationStripe ||
    bankAccount?.organization_stripe ||
    isOrgOwner;
  const resolvedOrganizationName =
    organizationName ?? organizationData?.organization?.name ?? "";

  const hasBankAccount = !!bankAccount?.account;

  if (managedByOrganization) {
    return (
      <div className="space-y-4 ml-0 lg:ml-5">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
          {t("stripeManagedByOrganization")}
        </div>
      </div>
    );
  }

  const handlePress = () => {
    setIsLoading(true);

    if (hasBankAccount) {
      updateBank(
        {},
        {
          onSuccess(data) {
            if (data?.onboarding_url) {
              window.location.href = data.onboarding_url;
            }
          },
          onError(error) {
            setIsLoading(false);
            console.error("Stripe update error:", error);
          },
        }
      );
    } else {
      createStripeAccount(undefined, {
        onSuccess(data) {
          if (data.onboarding_url) {
            window.location.href = data.onboarding_url;
          }
        },
        onError(error) {
          setIsLoading(false);
          console.error("Stripe connect error:", error);
        },
      });
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={isLoading}
        message={t("bankAccount.preparingRedirect")}
      />
      <div className="space-y-6 ml-0 lg:ml-5">
        <h2 className="text-sm font-medium font-figtree text-charcoal-blue hidden lg:block">
          {showOrganizationStripe
            ? tOrg("organizationStripeTitle", {
                name: resolvedOrganizationName,
              })
            : t("bankAccount.title")}
        </h2>

        <Card className="bg-white border-gray-200 h-[60px]">
          <CardContent className="p-4 h-full flex items-center">
            {isFetching ? (
              <div className="flex items-center justify-center w-full pb-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
              </div>
            ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 pb-6">
                {hasBankAccount ? (
                  <>
                    <div className="w-9 h-9 bg-[#5B56F6] rounded-full border border-gray-200 flex items-center justify-center">
                      <span className="text-white font-normal text-[10px]">
                        Stripe
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {showOrganizationStripe
                          ? tOrg("organizationStripeBadge")
                          : "Stripe Connect"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {maskAccountId(bankAccount?.account?.id ?? "")}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src="/assets/icons/stripe.svg"
                        alt={t("bankAccount.bankAlt")}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="text-xs font-medium text-gray-600 hidden xl:block">
                      XXX XXXX XXXXXXXXX XXX
                    </div>
                    <div className="text-xs font-medium text-gray-600 xl:hidden">
                      {t("bankAccount.addRib")}
                    </div>
                  </>
                )}
              </div>

              <Button
                label={
                  isLoading
                    ? t("bankAccount.inProgress")
                    : hasBankAccount
                      ? t("bankAccount.modify")
                      : t("bankAccount.add")
                }
                onClick={handlePress}
                disabled={isLoading}
                className="border border-light-blue-gray hover:text-white rounded-full text-exford-blue font-bold font-figtree px-4 py-2 mb-6 bg-transparent text-sm shadow-none"
              />
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
