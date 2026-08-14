import { useGetProAppointments } from "@/api/appointments/useAppointments";
import {
  UpdateProExpertData,
  useDeleteProExpert,
  useUpdateProExpert,
} from "@/api/proExpert/useProExpert";
import { authUtils } from "@/utils/auth";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export interface ExpertFormData {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  job: string;
  linkedin: string;
  website: string;
  domainName: string;
  domainId: number | null;
  expertises: number[]; // IDs des expertises
}

export interface UseExpertProfileUpdateProps {
  user: any; // Type ProExpert de l'API
}

export const useExpertProfileUpdate = ({
  user,
}: UseExpertProfileUpdateProps) => {
  const t = useTranslations();

  // États pour les champs du formulaire
  const [formData, setFormData] = useState<ExpertFormData>({
    firstName: "",
    lastName: "",
    email: "",
    description: "",
    job: "",
    linkedin: "",
    website: "",
    domainName: "",
    domainId: null,
    expertises: [],
  });

  // États pour la gestion de l'interface
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Hooks pour les mutations
  const {
    mutate: updateProExpert,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateProExpert();

  const { mutateAsync: deleteProExpert, isPending: isDeleting } =
    useDeleteProExpert();

  // Récupérer les rendez-vous de l'expert
  const { data: appointmentsData } = useGetProAppointments(user?.id?.toString(), {
    orderBy: "appointment_date",
    orderDirection: "asc",
  });

  // Fonction utilitaire pour obtenir le nom du domaine à partir de son ID
  const getDomainNameById = useCallback((domainId: number): string => {
    const domainEntry = Object.entries({
      1: "Média",
      2: "Culture",
      3: "Business",
      4: "Maison",
      5: "Artisanat",
      6: "Glow",
      7: "Sport",
    }).find(([id]) => parseInt(id) === domainId);
    return domainEntry ? domainEntry[1] : "";
  }, []);

  // Fonction utilitaire pour obtenir l'ID du domaine à partir de son nom
  const getDomainIdByName = useCallback((domainName: string): number => {
    const domainMap: Record<string, number> = {
      Média: 1,
      Culture: 2,
      Business: 3,
      Maison: 4,
      Artisanat: 5,
      Glow: 6,
      Sport: 7,
    };
    return domainMap[domainName] || 0;
  }, []);

  // Mise à jour des données du formulaire quand les données de l'expert sont chargées
  useEffect(() => {
    if (user) {
      // Convertir les expertises en IDs si nécessaire
      let expertiseIds: number[] = [];
      if (user.pro_expertises && user.pro_expertises.length > 0) {
        // Si c'est un tableau d'objets avec expertise_id
        if (
          typeof user.pro_expertises[0] === "object" &&
          user.pro_expertises[0]?.expertise_id !== undefined
        ) {
          expertiseIds = user.pro_expertises.map((exp: any) => exp.expertise_id);
          console.log("📋 Expertises chargées depuis le profil:", expertiseIds);
        }
        // Si c'est déjà un tableau de nombres
        else if (typeof user.pro_expertises[0] === "number") {
          expertiseIds = user.pro_expertises;
        }
        // Si c'est un tableau de strings (noms), on ne peut pas les convertir directement
        // Dans ce cas, on laisse vide et l'utilisateur devra resélectionner
      }

      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        description: user.description || "",
        job: user.job || "",
        linkedin: user.linkedin || "",
        website: user.website || "",
        domainName: getDomainNameById(user.domain_id) || "",
        domainId: user.domain_id || null,
        expertises: expertiseIds,
      });
    }
  }, [user, getDomainNameById]);
  console.log(user);
  // Gestion des changements de champs
  const handleFieldChange = useCallback(
    (field: keyof ExpertFormData, value: string | number | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsEditing(true);
    },
    []
  );

  // Gestion du changement de domaine
  const handleDomainChange = useCallback(
    (domainId: number, domainName: string) => {
      setFormData((prev) => ({
        ...prev,
        domainId,
        domainName,
        expertises: [], // Réinitialiser les expertises quand on change de domaine
      }));
      setIsEditing(true);
    },
    []
  );

  // Gestion du changement des expertises
  const handleExpertisesChange = useCallback((expertises: number[]) => {
    setFormData((prev) => ({
      ...prev,
      expertises,
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
        const updateData: UpdateProExpertData = {
          avatar: file,
        };

        console.log("Upload automatique de l'avatar:", updateData);
        console.log(
          "Type de fichier:",
          file instanceof File ? "File" : typeof file
        );
        console.log("Taille du fichier:", file.size, "bytes");

        updateProExpert(updateData, {
          onSuccess: () => {
            setIsUploadingAvatar(false);
            console.log("Avatar uploadé avec succès");
            // Ne pas réinitialiser setAvatar ici pour garder l'aperçu
          },
          onError: (error) => {
            setIsUploadingAvatar(false);
            console.error("Erreur lors de l'upload de l'avatar:", error);
            // En cas d'erreur, on peut réinitialiser l'avatar
            setAvatar(null);
          },
        });
      } catch (error) {
        setIsUploadingAvatar(false);
        console.error("Erreur lors de la préparation de l'upload:", error);
        setAvatar(null);
      }
    },
    [updateProExpert]
  );

  // Gestion de la suppression d'avatar
  const handleAvatarDelete = useCallback(async () => {
    try {
      setIsUploadingAvatar(true);

      const updateData: UpdateProExpertData = {
        avatar: null, // Envoyer null pour supprimer l'avatar
      };

      console.log("Suppression de l'avatar expert:", updateData);
      console.log(
        "Avatar à supprimer:",
        updateData.avatar === null ? "NULL" : updateData.avatar
      );

      updateProExpert(updateData, {
        onSuccess: () => {
          setIsUploadingAvatar(false);
          setAvatar(null);
          console.log("Avatar expert supprimé avec succès");
        },
        onError: (error) => {
          setIsUploadingAvatar(false);
          console.error(
            "Erreur lors de la suppression de l'avatar expert:",
            error
          );
        },
      });
    } catch (error) {
      setIsUploadingAvatar(false);
      console.error(
        "Erreur lors de la préparation de la suppression expert:",
        error
      );
    }
  }, [updateProExpert]);

  // Gestion de la sauvegarde
  const handleSave = useCallback(async () => {
    try {
      // Convertir les IDs d'expertises au format attendu par l'API
      const expertisesFormatted = formData.expertises.map((id) => ({
        expertise_id: String(id),
      }));

      const updateData: UpdateProExpertData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        description: formData.description,
        job: formData.job,
        email: formData.email,
        linkedin: formData.linkedin,
        website: formData.website,
        domain_id: formData.domainId || undefined,
        expertises: expertisesFormatted,
        ...(avatar && { avatar }),
      };

      console.log("📤 Expertises envoyées:", expertisesFormatted);

      // Filtrer les champs vides pour ne pas les envoyer (sauf email qui doit toujours être envoyé)
      Object.keys(updateData).forEach((key) => {
        const value = updateData[key as keyof UpdateProExpertData];
        if ((value === "" || value === undefined) && key !== "email") {
          delete updateData[key as keyof UpdateProExpertData];
        }
      });

      console.log("Sauvegarde des données expert:", updateData);

      updateProExpert(updateData, {
        onSuccess: () => {
          setIsEditing(false);
          setAvatar(null);
          console.log("✅ Profil expert mis à jour avec succès");
        },
        onError: (error: any) => {
          console.error("❌ Erreur lors de la sauvegarde:", error);
          console.error("❌ Message d'erreur:", error?.message);
          console.error(
            "❌ Détails de l'erreur:",
            JSON.stringify(error, null, 2)
          );
        },
      });
    } catch (error) {
      console.error("Erreur lors de la préparation de la sauvegarde:", error);
    }
  }, [formData, avatar, updateProExpert, getDomainIdByName]);

  // Gestion de la suppression du compte
  const handleDeleteAccount = useCallback(() => {
    // Vérifier s'il y a des rendez-vous en attente ou confirmés
    const hasActiveAppointments = Array.isArray(appointmentsData) && appointmentsData.some(
      (appointment: any) =>
        appointment.status === "pending" || appointment.status === "confirmed"
    );

    if (hasActiveAppointments) {
      showToast.errorDirect(t("profile.cannotDeleteWithAppointments"));
      return;
    }

    setIsDeleteModalOpen(true);
  }, [appointmentsData, t]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      console.log("[delete-account] expert DELETE start");
      await deleteProExpert();
      console.log("[delete-account] expert DELETE success");
    } catch (error) {
      console.error("[delete-account] expert DELETE error:", error);
    } finally {
      console.log("[delete-account] expert local logout");
      await authUtils.signOutLocal();
      console.log("[delete-account] expert redirect /login");
      window.location.assign("/login");
    }
  }, [deleteProExpert]);

  const handleCloseDeleteModal = useCallback(() => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  }, [isDeleting]);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        description: user.description || "",
        job: user.job || "",
        linkedin: user.linkedin || "",
        website: user.website || "",
        domainName: getDomainNameById(user.domain_id) || "",
        domainId: user.domain_id || null,
        expertises: user.pro_expertises || [],
      });
    }
    setIsEditing(false);
    setAvatar(null);
  }, [user, getDomainNameById]);

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
    handleDomainChange,
    handleExpertisesChange,
    handleAvatarChange,
    handleAvatarDelete,
    handleSave,
    handleDeleteAccount,
    handleConfirmDelete,
    handleCloseDeleteModal,
    resetForm,
  };
};
