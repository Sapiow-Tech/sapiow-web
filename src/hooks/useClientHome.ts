import { Expert, useListExperts } from "@/api/listExpert/useListExpert";
import { useSearchStore } from "@/store/useSearchStore";
import { Professional } from "@/types/professional";
import { getStartingFromPrice } from "@/utils/getStartingFromPrice";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFavoritesLogic } from "./useFavoritesLogic";

// Mapping function to convert Expert to Professional format
const mapExpertToProfessional = (expert: Expert): Professional => {
  const categoryMap: Record<string, string> = {
    Media: "media",
    Culture: "culture",
    Business: "business",
    Maison: "maison",
    Artisanat: "artisanat",
    Glow: "glow",
    Sport: "sport",
  };

  // Format avatar URL properly for Next.js Image
  const formatImageUrl = (avatarPath: string | null | undefined) => {
    // Avatar par défaut si pas de photo ou si chemin relatif du backend
    if (
      !avatarPath ||
      avatarPath.trim() === "" ||
      (!avatarPath.startsWith("http://") && !avatarPath.startsWith("https://"))
    ) {
      return "/assets/icons/pro1.png";
    }

    // Si c'est une URL complète, l'utiliser directement
    return avatarPath;
  };

  return {
    id: expert.id,
    name: `${expert.first_name} ${expert.last_name}`.trim(),
    first_name: expert.first_name,
    last_name: expert.last_name,
    price: getStartingFromPrice(expert.sessions),
    image: formatImageUrl(expert.avatar),
    avatar: expert.avatar,
    verified: true,
    category: categoryMap[expert.domains.name] || "business",
    domain: expert.domains.name,
    topExpertise: expert.badge === "gold",
    description:
      expert.description ||
      `${expert.job || "Expert"} spécialisé en ${expert.domains.name}`,
    linkedin: expert.linkedin,
    job: expert.job,
    sessions: expert.sessions,
  };
};

/**
 * Hook principal pour la page d'accueil client
 *
 * RESPONSABILITÉS :
 * - Gestion des catégories et filtres
 * - Conversion des données API experts → format Professional
 * - Navigation entre pages
 * - Délégation de la logique favoris au hook useFavoritesLogic
 */
export const useClientHome = () => {
  const router = useRouter();
  const { searchQuery } = useSearchStore();

  // États UI pour les filtres et catégories
  const [selectedCategory, setSelectedCategory] = useState("top");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sortOption, setSortOption] = useState("recommended");

  // Déterminer si on cherche les top experts ou un domaine spécifique
  const isTopExpert = selectedCategory === "top";
  const isDomainId = !isNaN(Number(selectedCategory));

  // Hook API pour récupérer la liste des experts
  // Si searchQuery existe, recherche par nom/prénom
  // Sinon, même logique que le mobile : top experts (badge gold) ou filtre par domain_id
  const {
    data: expertList,
    isLoading: isLoadingExperts,
    error,
  } = useListExperts({
    search: searchQuery
      ? searchQuery
      : isTopExpert
      ? "gold"
      : isDomainId
      ? selectedCategory
      : "",
    searchFields: searchQuery
      ? "first_name,last_name"
      : isTopExpert
      ? "badge"
      : isDomainId
      ? "domain_id"
      : "",
    limit: 100,
  });

  // Hook logique favoris (séparé pour réutilisabilité)
  const {
    likedProfs,
    isLoadingFavorites,
    handleToggleLike,
    isMutatingFavorite,
  } = useFavoritesLogic();

  // Conversion des données API en format Professional pour l'UI
  console.log("useListExperts result:", expertList);
  const expertsArray = expertList || [];
  const allProfessionals = expertsArray.map(mapExpertToProfessional);

  // États de chargement combinés
  const isLoading = isLoadingExperts || isLoadingFavorites;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Réinitialiser la sous-catégorie quand on change de catégorie
    setSelectedSubCategory(categoryId === "top" ? "tout" : "");
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    // Toggle behavior: si on clique sur la même sous-catégorie, la désélectionner
    if (selectedSubCategory === subCategoryId) {
      setSelectedSubCategory("");
    } else {
      setSelectedSubCategory(subCategoryId);
    }
  };

  const handleSortChange = (sortId: string) => {
    setSortOption(sortId);
  };

  const handleProfessionalClick = (professional: Professional) => {
    // Rediriger vers la page details avec l'ID du professionnel
    router.push(`/details?id=${professional.id}`);
  };

  /**
   * Grouper les professionnels par catégorie pour l'affichage "Top"
   * Chaque catégorie devient une section horizontale
   * Seuls les professionnels avec badge "gold" (topExpertise === true) sont inclus
   */
  const groupedProfessionals = allProfessionals
    .filter((prof: Professional) => prof.topExpertise === true)
    .reduce((acc: Record<string, Professional[]>, prof: Professional) => {
      const category = prof.category || "business";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(prof);
      return acc;
    }, {} as Record<string, Professional[]>);

  /**
   * Filtrer les professionnels selon la catégorie et sous-catégorie sélectionnées
   * Pour "top" : tous les professionnels ou filtre par sous-catégorie statique
   * Pour domaines : filtre par domain_id et potentiellement par expertise_id
   */
  const filteredProfessionals = useMemo(() => {
    if (selectedCategory === "top") {
      // Logique existante pour "top" avec sous-catégories statiques
      if (!selectedSubCategory || selectedSubCategory === "tout") {
        return allProfessionals;
      }
      // Filtrage par sous-catégorie statique (à implémenter selon besoins)
      return allProfessionals;
    }

    // Vérifier si selectedCategory est un domaine ID
    const isDomainId = !isNaN(Number(selectedCategory));

    if (isDomainId) {
      // Filtrer d'abord par domaine
      const professionalsInDomain = allProfessionals.filter(
        (prof: Professional) => {
          const expertWithDomain = expertsArray.find(
            (expert: any) => expert.id === prof.id
          );
          return expertWithDomain?.domain_id.toString() === selectedCategory;
        }
      );

      // Si une expertise est sélectionnée, filtrer davantage
      if (selectedSubCategory && selectedSubCategory !== "") {
        const expertiseId = Number(selectedSubCategory);
        return professionalsInDomain.filter((prof: Professional) => {
          const expert = expertsArray.find(
            (expert: any) => expert.id === prof.id
          );

          // Vérifier si l'expert a cette expertise dans ses expertises
          // L'API peut retourner soit 'expertises' soit 'pro_expertises'
          const expertisesArray =
            (expert as any)?.expertises ||
            (expert as any)?.pro_expertises ||
            [];
          const hasExpertise = expertisesArray.some((expertise: any) => {
            return expertise.expertise_id === expertiseId;
          });

          return hasExpertise;
        });
      }

      return professionalsInDomain;
    }

    // Fallback pour catégories string (logique existante)
    return allProfessionals.filter((prof: Professional) => {
      return prof.category === selectedCategory;
    });
  }, [
    allProfessionals,
    expertsArray,
    selectedCategory,
    selectedSubCategory,
  ]);

  return {
    // États UI
    selectedCategory,
    selectedSubCategory,
    sortOption,

    // Données transformées
    allProfessionals,
    groupedProfessionals,
    filteredProfessionals,
    likedProfs,

    // États API
    isLoading,
    error,

    // Handlers UI
    handleCategoryChange,
    handleSubCategoryChange,
    handleSortChange,
    handleProfessionalClick,

    // Handler favoris (délégué au hook spécialisé)
    handleToggleLike,

    // États UX favoris
    isMutatingFavorite,
  };
};
