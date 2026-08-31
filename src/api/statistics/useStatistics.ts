import { apiClient } from "@/lib/api-client";
import { useUserStore } from "@/store/useUser";
import { useQuery } from "@tanstack/react-query";

// Types
export interface StatisticsData {
  totalPrice: number;
  count: number;
}

export interface StatisticsFilters {
  start?: string;
  end?: string;
}

// Hook GET pour récupérer les statistiques avec filtres optionnels
export const useGetStatistics = (
  filters?: StatisticsFilters,
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
    ? `pro-statistics?${queryString}`
    : "pro-statistics";

  return useQuery<StatisticsData>({
    queryKey: ["statistics", filters?.start, filters?.end],
    queryFn: () => apiClient.get<StatisticsData>(endpoint),
    enabled: enabled && user.type === "expert",
  });
};
