"use client";

import {
  findSponsoForOrganization,
  useActiveSponsoBanners,
  useOrganizationPublicPage,
} from "@/api/sponso/useSponso";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { SponsoredBanner } from "@/components/sponso/SponsoredBanner";
import { AppSidebar } from "@/components/layout/Sidebare";
import { HeaderClient } from "@/components/layout/header/HeaderClient";
import { Professional } from "@/types/professional";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ProfessionalCard from "../../home/ProfessionalCard";

export default function OrganisationClient() {
  const params = useParams<{ id: string; locale: string }>();
  const organizationId = params.id;
  const locale = params.locale;
  const router = useRouter();
  const t = useTranslations("sponso");

  const { data, isLoading, error } = useOrganizationPublicPage(organizationId);
  const { data: sponsoBanners } = useActiveSponsoBanners();
  const banner = findSponsoForOrganization(sponsoBanners, organizationId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-center text-slate-600">{t("organizationNotFound")}</p>
      </div>
    );
  }

  const { organization, members } = data;

  function handleProfessionalClick(professional: Professional) {
    router.push(`/${locale}/details?id=${professional.id}`);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {banner && (
        <SponsoredBanner banner={banner} showSponsoredLabel />
      )}

      <div className="flex min-h-0 flex-1 lg:flex">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <HeaderClient isBack classNameIsBack="py-1" />

          <div className="flex-1 px-5 pb-10">
            <div className="mx-auto max-w-5xl pt-8">
              <div className="flex flex-col items-center text-center">
                {organization.image_url ? (
                  <Image
                    src={organization.image_url}
                    alt={organization.name}
                    width={320}
                    height={120}
                    unoptimized
                    className="h-auto max-h-32 w-auto max-w-[280px] object-contain md:max-h-40 md:max-w-[360px]"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-exford-blue">
                    {organization.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                {organization.description && (
                  <p className="mt-6 max-w-2xl text-sm leading-relaxed text-black font-figtree md:text-base">
                    {organization.description}
                  </p>
                )}
              </div>

              {members.length === 0 ? (
                <p className="mt-12 text-center text-sm text-slate-500">
                  {t("noMembers")}
                </p>
              ) : (
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,205px)] lg:justify-start">
                  {members.map((member) => {
                    const professional: Professional = {
                      id: member.id,
                      first_name: member.first_name ?? undefined,
                      last_name: member.last_name ?? undefined,
                      avatar: member.avatar,
                      image: member.avatar ?? undefined,
                      description: member.description,
                      job: member.job,
                    };

                    return (
                      <ProfessionalCard
                        key={member.id}
                        professional={professional}
                        isLiked={false}
                        onToggleLike={() => {}}
                        onProfessionalClick={handleProfessionalClick}
                        lineClamp={3}
                        showPrice={false}
                        subtitle={t("offeredBy", { org: organization.name })}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
