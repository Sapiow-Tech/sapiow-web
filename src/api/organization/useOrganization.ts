import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { showToast } from "@/utils/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type OrganizationMemberPreview = {
  id: string;
  pro_id: string;
  role: "owner" | "member";
  status: string;
  pros?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
  };
};

export type OrganizationResponse = {
  organization: {
    id: string;
    name: string;
    description?: string | null;
    image_url?: string | null;
    invite_code?: string;
  } | null;
  membership?: {
    id: string;
    role: "owner" | "member";
    status: string;
  };
  members?: OrganizationMemberPreview[];
  pending_requests?: OrganizationMemberPreview[];
  stripe?: {
    status: string | null;
    payments_enabled: boolean | null;
  } | null;
  managed_by_organization?: boolean;
  pending?: boolean;
};

export const useGetOrganization = () => {
  return useQuery<OrganizationResponse, Error>({
    queryKey: ["organization"],
    queryFn: () => apiClient.get<OrganizationResponse>("organization"),
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; description?: string | null }) =>
      apiClient.post<OrganizationResponse>("organization", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      queryClient.invalidateQueries({ queryKey: ["bank"] });
      showToast.successDirect("Organisation créée");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export type UpdateOrganizationPayload = {
  name: string;
  description?: string | null;
  image?: File | null;
  removeImage?: boolean;
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) => {
      const formData = new FormData();
      formData.append("name", payload.name);
      if (payload.description !== undefined) {
        formData.append("description", payload.description ?? "");
      }
      if (payload.image) {
        formData.append("image", payload.image);
      }
      if (payload.removeImage) {
        formData.append("remove_image", "true");
      }
      return apiClient.fetchFormData<OrganizationResponse>("organization", formData, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      showToast.successDirect("Organisation mise à jour");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export const useJoinOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { code: string }) =>
      apiClient.post("organization/join", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      showToast.successDirect("Demande envoyée");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export const useRegenerateInviteCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.post<{ invite_code: string }>("organization/invite-code"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      showToast.successDirect("Code régénéré");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export const useRespondJoinRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      action,
    }: {
      requestId: string;
      action: "accept" | "refuse";
    }) =>
      apiClient.post(`organization/requests/${requestId}`, { action }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organization"] });
      showToast.successDirect("Demande traitée");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export const useRemoveOrganizationMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (proId: string) =>
      apiClient.delete(`organization/members/${proId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organization"] });
      showToast.successDirect("Membre retiré");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export const useLeaveOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post("organization/leave"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      queryClient.invalidateQueries({ queryKey: ["bank"] });
      showToast.successDirect("Vous avez quitté l'organisation");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};

export const useDissolveOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete("organization"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      queryClient.invalidateQueries({ queryKey: ["bank"] });
      showToast.successDirect("Organisation dissoute");
    },
    onError: (error: Error) => {
      showToast.errorDirect(getApiErrorMessage(error));
    },
  });
};
