import { apiClient } from "@/lib/api-client";
import { useUserStore } from "@/store/useUser";
import { useQuery } from "@tanstack/react-query";

export interface OrganizationStatisticsScope {
  count: number;
  totalPrice: number;
}

export interface OrganizationMemberStatistics {
  pro_id: string;
  first_name: string | null;
  last_name: string | null;
  count: number;
  totalPrice: number;
}

export interface OrganizationStatisticsData {
  organization: OrganizationStatisticsScope;
  personal: OrganizationStatisticsScope;
  by_member: OrganizationMemberStatistics[];
}

export interface OrganizationStatisticsFilters {
  start?: string;
  end?: string;
}

export const useOrganizationStatistics = (
  filters?: OrganizationStatisticsFilters,
  enabled = true,
) => {
  const { user } = useUserStore();
  const queryParams = new URLSearchParams();

  if (filters?.start) {
    queryParams.append("start", filters.start);
  }
  if (filters?.end) {
    queryParams.append("end", filters.end);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `organization-statistics?${queryString}`
    : "organization-statistics";

  return useQuery<OrganizationStatisticsData>({
    queryKey: ["organization-statistics", filters?.start, filters?.end],
    queryFn: () => apiClient.get<OrganizationStatisticsData>(endpoint),
    enabled: enabled && user.type === "expert",
  });
};
