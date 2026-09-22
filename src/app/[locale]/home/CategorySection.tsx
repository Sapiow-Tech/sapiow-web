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

  // Affiche le nom API ; utilise une traduction i18n si une clé connue existe
  const getCategoryDisplayName = (domainName: string) => {
    const translationKey = domainName.trim().toLowerCase();
    const knownKeys = [
      "maison",
      "business",
      "media",
      "culture",
      "glow",
      "sport",
      "artisanat",
    ];

    if (knownKeys.includes(translationKey)) {
      return t(`categories.${translationKey}`);
    }

    return domainName;
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
