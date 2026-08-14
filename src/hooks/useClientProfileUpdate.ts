import {
  UpdateCustomerData,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/api/customer/useCustomer";
import { authUtils } from "@/utils/auth";
import { useCallback, useEffect, useState } from "react";

export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  selectedDomains: number[];
}

export interface UseClientProfileUpdateProps {
  customer: any; // Type Customer de l'API
}

export const useClientProfileUpdate = ({
  customer,
}: UseClientProfileUpdateProps) => {
  // États pour les champs du formulaire
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    selectedDomains: [],
  });

  // États pour la gestion de l'interface
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Hooks pour les mutations
  const {
    mutate: updateCustomer,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateCustomer();

  const { mutateAsync: deleteCustomer, isPending: isDeleting } =
    useDeleteCustomer();

  // Mise à jour des données du formulaire quand les données du client sont chargées
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        email: customer.email || "",
        selectedDomains: customer.domain_id || [],
      });
    }
  }, [customer]);

  // Gestion des changements de champs
  const handleFieldChange = useCallback(
    (field: keyof ClientFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsEditing(true);
    },
    []
  );

  // Gestion de la sélection des domaines
  const handleDomainToggle = useCallback((domainId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedDomains: prev.selectedDomains.includes(domainId)
        ? prev.selectedDomains.filter((id) => id !== domainId)
        : [...prev.selectedDomains, domainId],
    }));
    setIsEditing(true);
  }, []);

  // Gestion du changement d'avatar avec upload automatique
  const handleAvatarChange = useCallback(
    async (file: File | null) => {
      if (!file) return;

      setAvatar(file);
      setIsUploadingAvatar(true);

      try {
        const updateData: UpdateCustomerData = {
          avatar: file,
        };

        updateCustomer(updateData, {
          onSuccess: () => {
            setIsUploadingAvatar(false);
            console.log("Avatar client uploadé avec succès");
            // Ne pas réinitialiser setAvatar ici pour garder l'aperçu
          },
          onError: (error) => {
            setIsUploadingAvatar(false);
            console.error("Erreur lors de l'upload de l'avatar client:", error);
            // En cas d'erreur, on peut réinitialiser l'avatar
            setAvatar(null);
          },
        });
      } catch (error) {
        setIsUploadingAvatar(false);
        console.error(
          "Erreur lors de la préparation de l'upload client:",
          error
        );
        setAvatar(null);
      }
    },
    [updateCustomer]
  );

  // Gestion de la suppression d'avatar
  const handleAvatarDelete = useCallback(async () => {
    try {
      setIsUploadingAvatar(true);

      const updateData: UpdateCustomerData = {
        avatar: null, // Envoyer null pour supprimer l'avatar
      };

      console.log("Suppression de l'avatar client:", updateData);
      console.log(
        "Avatar à supprimer:",
        updateData.avatar === null ? "NULL" : updateData.avatar
      );

      updateCustomer(updateData, {
        onSuccess: () => {
          setIsUploadingAvatar(false);
          setAvatar(null);
          console.log("Avatar client supprimé avec succès");
        },
        onError: (error) => {
          setIsUploadingAvatar(false);
          console.error(
            "Erreur lors de la suppression de l'avatar client:",
            error
          );
        },
      });
    } catch (error) {
      setIsUploadingAvatar(false);
      console.error(
        "Erreur lors de la préparation de la suppression client:",
        error
      );
    }
  }, [updateCustomer]);

  // Gestion de la sauvegarde
  const handleSave = useCallback(async () => {
    try {
      const updateData: UpdateCustomerData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        domain_id: formData.selectedDomains,
        ...(avatar && { avatar }),
      };

      // Filtrer les champs vides pour ne pas les envoyer
      Object.keys(updateData).forEach((key) => {
        const value = updateData[key as keyof UpdateCustomerData];
        if (value === "" || value === undefined) {
          delete updateData[key as keyof UpdateCustomerData];
        }
      });

      console.log("Sauvegarde des données client:", updateData);

      updateCustomer(updateData, {
        onSuccess: () => {
          setIsEditing(false);
          setAvatar(null);
          console.log("Profil client mis à jour avec succès");
        },
        onError: (error) => {
          console.error("Erreur lors de la sauvegarde:", error);
        },
      });
    } catch (error) {
      console.error("Erreur lors de la préparation de la sauvegarde:", error);
    }
  }, [formData, avatar, updateCustomer]);

  // Gestion de la suppression du compte
  const handleDeleteAccount = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      console.log("[delete-account] client DELETE start");
      await deleteCustomer();
      console.log("[delete-account] client DELETE success");
    } catch (error) {
      console.error("[delete-account] client DELETE error:", error);
    } finally {
      console.log("[delete-account] client local logout");
      await authUtils.signOutLocal();
      console.log("[delete-account] client redirect /login");
      window.location.assign("/login");
    }
  }, [deleteCustomer]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  }, [isDeleting]);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    if (customer) {
      setFormData({
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        email: customer.email || "",
        selectedDomains: customer.domain_id || [],
      });
    }
    setIsEditing(false);
    setAvatar(null);
  }, [customer]);

  return {
    // États
    formData,
    isEditing,
    avatar,
    isUpdating,
    isUploadingAvatar,
    updateError,
    isDeleteModalOpen,
    isDeleting,

    // Actions
    handleFieldChange,
    handleDomainToggle,
    handleAvatarChange,
    handleAvatarDelete,
    handleSave,
    handleDeleteAccount,
    handleConfirmDelete,
    handleCloseDeleteModal,
    resetForm,
  };
};
