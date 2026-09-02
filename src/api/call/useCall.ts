import { apiClient } from "@/lib/api-client";
import { showToast } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";

export interface StreamUser {
  id: string;
  role: string;
  name: string;
}

export interface ProStreamUserResponse {
  proStreamUser: {
    user: StreamUser;
    token: string;
    appointmentId: string;
  };
}

// Get the stream call for the given appointmentId
export const useGetStreamCall = (appointmentId: string | undefined) => {
  return useQuery({
    queryKey: ["call", appointmentId],
    queryFn: (): Promise<ProStreamUserResponse> =>
      apiClient.get(`call/${appointmentId}`),
    enabled: !!appointmentId, // Only run query when appointmentId is available
  });
};

export const useGetStreamToken = (appointmentId: string | undefined) => {
  const query = useGetStreamCall(appointmentId);

  // Gérer les erreurs avec toast
  if (query.isError && query.error) {
    console.error("Failed to get stream call:", query.error);
    showToast.error("callConnectionError", (query.error as any)?.message);
  }

  return {
    ...query,
    token: query.data?.proStreamUser?.token,
    user: query.data?.proStreamUser?.user,
    streamAppointmentId: query.data?.proStreamUser?.appointmentId,
  };
};
