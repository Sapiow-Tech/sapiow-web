import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export type SponsoTargetType = "pro" | "organization";

export type SponsoBanner = {
  id: string;
  target_type: SponsoTargetType;
  pro_id: string | null;
  organization_id: string | null;
  image_url: string;
  cta_label: string;
  banner_text: string;
  is_active: boolean;
  target: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    avatar?: string | null;
    name?: string;
    image_url?: string | null;
  } | null;
};

export type OrganizationPublicPage = {
  organization: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  };
  members: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    job: string | null;
    description: string | null;
  }[];
};

function isValidBannerImageUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function filterActiveBanners(items: SponsoBanner[] | undefined): SponsoBanner[] {
  return (items ?? []).filter(
    (banner) => banner.is_active && isValidBannerImageUrl(banner.image_url),
  );
}

export function useActiveSponsoBanners() {
  return useQuery({
    queryKey: ["sponso", "active"],
    queryFn: async () => {
      try {
        return await apiClient.get<{ items: SponsoBanner[] }>("sponso");
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[sponso] Failed to load active banners:", error);
        }
        throw error;
      }
    },
    select: (data) => filterActiveBanners(data.items),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });
}

export function useOrganizationPublicPage(id: string) {
  return useQuery({
    queryKey: ["sponso", "organization", id],
    queryFn: () =>
      apiClient.get<OrganizationPublicPage>(`sponso/organization/${id}`),
    enabled: Boolean(id),
  });
}

export function getSponsoDestination(
  banner: SponsoBanner,
  locale: string,
): string {
  if (banner.target_type === "pro" && banner.pro_id) {
    return `/${locale}/details?id=${banner.pro_id}`;
  }
  if (banner.target_type === "organization" && banner.organization_id) {
    return `/${locale}/organisation/${banner.organization_id}`;
  }
  return `/${locale}`;
}

export function findSponsoForPro(
  banners: SponsoBanner[] | undefined,
  proId: string | null | undefined,
) {
  if (!banners?.length || !proId) return null;
  return banners.find(
    (banner) => banner.target_type === "pro" && banner.pro_id === proId,
  ) ?? null;
}

export function findSponsoForOrganization(
  banners: SponsoBanner[] | undefined,
  organizationId: string | null | undefined,
) {
  if (!banners?.length || !organizationId) return null;
  return banners.find(
    (banner) =>
      banner.target_type === "organization" &&
      banner.organization_id === organizationId,
  ) ?? null;
}
