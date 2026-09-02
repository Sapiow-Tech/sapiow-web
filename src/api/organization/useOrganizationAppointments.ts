import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export interface GetOrganizationAppointmentsParams {
  search?: string;
  searchFields?: string;
  gte?: string;
  gteField?: string;
  lte?: string;
  lteField?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export const useOrganizationAppointments = (
  params?: GetOrganizationAppointmentsParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["organization-appointments", params],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.searchFields) {
        queryParams.append("searchFields", params.searchFields);
      }
      if (params?.gte) queryParams.append("gte", params.gte);
      if (params?.gteField) queryParams.append("gteField", params.gteField);
      if (params?.lte) queryParams.append("lte", params.lte);
      if (params?.lteField) queryParams.append("lteField", params.lteField);
      if (params?.orderBy) queryParams.append("orderBy", params.orderBy);
      if (params?.orderDirection) {
        queryParams.append("orderDirection", params.orderDirection);
      }
      if (params?.limit !== undefined) {
        queryParams.append("limit", params.limit.toString());
      }
      if (params?.offset !== undefined) {
        queryParams.append("offset", params.offset.toString());
      }

      const queryString = queryParams.toString();
      const url = `organization-appointments${
        queryString ? `?${queryString}` : ""
      }`;

      return apiClient.get(url);
    },
    enabled,
  });
};
