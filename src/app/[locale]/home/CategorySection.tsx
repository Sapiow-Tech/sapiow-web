"use client";
import { Professional } from "@/types/professional";
import { useTranslations } from "next-intl";
import ProfessionalCard from "./ProfessionalCard";

interface CategorySectionProps {
  category: string;
  professionals: Professional[];
  likedProfs: Record<string, boolean>;
  onToggleLike: (id: string) => void;
  onProfessionalClick?: (professional: Professional) => void;
  onSeeAll?: () => void;
  isMutatingFavorite?: boolean;
}

export default function CategorySection({
  category,
  professionals,
  likedProfs,
  onToggleLike,
  onProfessionalClick,
  onSeeAll,
  isMutatingFavorite = false,
}: CategorySectionProps) {
  const t = useTranslations();

  // Fonction pour obtenir le nom traduit de la catégorie
  const getCategoryDisplayName = (categoryKey: string) => {
    const categoryTranslations: Record<string, string> = {
      maison: t("categories.maison"),
      business: t("categories.business"),
      media: t("categories.media"),
      culture: t("categories.culture"),
      glow: t("categories.glow"),
      sport: t("categories.sport"),
      artisanat: t("categories.artisanat"),
    };

    return (
      categoryTranslations[categoryKey] ||
      categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)
    );
  };
  if (professionals.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-exford-blue font-figtree">
          {getCategoryDisplayName(category)}
        </h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs text-cobalt-blue font-medium cursor-pointer pr-4"
          >
            {t("expertDetails.seeAll")} →
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,205px)] lg:justify-start gap-4">
        {professionals.map((professional) => {
          const profIdString = professional.id.toString();
          const isLiked = likedProfs[profIdString] || false;

          return (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              isLiked={isLiked}
              onToggleLike={onToggleLike}
              onProfessionalClick={onProfessionalClick}
              isLoadingFavorite={isMutatingFavorite}
              lineClamp={3}
              showFirstCallOffer
            />
          );
        })}
      </div>
    </div>
  );
}
