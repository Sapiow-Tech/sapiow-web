"use client";
import { UpcomingVideoCall } from "@/components/common/DarkSessionCard";
import type { SponsoBanner } from "@/api/sponso/useSponso";
import { SponsoCarousel } from "@/components/sponso/SponsoCarousel";
import { useClientHome } from "@/hooks/useClientHome";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import { useSearchStore } from "@/store/useSearchStore";
import { Professional } from "@/types/professional";
import {
  transformAppointmentToSessionData,
  type ApiAppointment,
} from "@/utils/appointmentUtils";
import { authUtils } from "@/utils/auth";
import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";
import SkeletonGrid from "../../../components/layout/SkeletonGrid";
import CategoryFilter from "./CategoryFilter";
import CategorySection from "./CategorySection";
import ProfessionalCard from "./ProfessionalCard";
import SubCategoryFilter from "./SubCategoryFilter";

const UpcomingVisiosSection = memo(function UpcomingVisiosSection({
  upcomingAppointments,
  t,
}: {
  upcomingAppointments: ApiAppointment[];
  t: any;
}) {
  if (upcomingAppointments.length === 0) return null;

  return (
    <div className="mb-6 mt-4">
      <h2 className="mb-3 text-lg font-bold text-exford-blue font-figtree">
        {t("home.yourNextVisio")}
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {upcomingAppointments.slice(0, 2).map((appointment: ApiAppointment) => {
          const sessionData = transformAppointmentToSessionData(appointment);
          return (
            <UpcomingVideoCall
              key={appointment.id}
              date={sessionData.date}
              appointmentAt={appointment.appointment_at}
              profileImage={sessionData.profileImage}
              name={sessionData.professionalName}
              title={sessionData.professionalTitle}
              variant="dark"
              showButton={false}
              sessionTime={sessionData.time}
              className="w-full shrink-0 md:w-[calc(50%-0.5rem)] md:max-w-[424px] border-none shadow-none"
            />
          );
        })}
      </div>
    </div>
  );
});

const ExpertsResultsSection = memo(function ExpertsResultsSection({
  isSearchMode,
  searchQuery,
  selectedCategory,
  selectedSubCategory,
  groupedProfessionals,
  filteredProfessionals,
  likedProfs,
  isLoading,
  handleCategoryChange,
  handleSubCategoryChange,
  handleSortChange,
  handleToggleLike,
  handleProfessionalClick,
  t,
  sponsoBanners,
  sponsoIndex,
  onSponsoIndexChange,
}: {
  isSearchMode: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedSubCategory: string;
  groupedProfessionals: Record<string, Professional[]>;
  filteredProfessionals: Professional[];
  likedProfs: Record<string, boolean>;
  isLoading: boolean;
  handleCategoryChange: (categoryId: string) => void;
  handleSubCategoryChange: (subCategoryId: string) => void;
  handleSortChange: (sortId: string) => void;
  handleToggleLike: (professionalId: string) => void;
  handleProfessionalClick: (professional: Professional) => void;
  t: any;
  sponsoBanners: SponsoBanner[];
  sponsoIndex: number;
  onSponsoIndexChange: (index: number) => void;
}) {
  return (
    <>
      <h2 className="my-2 text-lg lg:text-2xl font-normal text-exford-blue font-figtree">
        {isSearchMode
          ? `${t("home.searchResults")} "${searchQuery}"`
          : t("home.accelerateProject")}
      </h2>

      {!isSearchMode && (
        <>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          {selectedCategory !== "top" && (
            <SubCategoryFilter
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              onSubCategoryChange={handleSubCategoryChange}
              onSortChange={handleSortChange}
            />
          )}
          {sponsoBanners.length > 0 && (
            <SponsoCarousel
              banners={sponsoBanners}
              index={sponsoIndex}
              onIndexChange={onSponsoIndexChange}
            />
          )}
        </>
      )}

      {isLoading ? (
        <div className="py-6">
          <SkeletonGrid />
        </div>
      ) : isSearchMode ? (
        <div className="py-6">
          {filteredProfessionals.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-gray-500 text-lg">
                  {t("home.noResultsFound")}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {t("home.tryDifferentSearch")}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,205px)] lg:justify-start gap-4">
              {filteredProfessionals.map((professional: Professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  isLiked={(() => {
                    const profIdString = professional.id.toString();
                    const isLiked = likedProfs[profIdString] || false;
                    return isLiked;
                  })()}
                  onToggleLike={handleToggleLike}
                  onProfessionalClick={handleProfessionalClick}
                  lineClamp={3}
                  showPrice={true}
                  showFirstCallOffer
                />
              ))}
            </div>
          )}
        </div>
      ) : selectedCategory === "top" ? (
        <div className="py-6 ">
          {Object.keys(groupedProfessionals).length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-gray-500 text-lg">
                  {t("home.noTopExperts")}
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedProfessionals).map(
              ([category, categoryProfessionals]) => (
                <CategorySection
                  key={category}
                  category={category}
                  professionals={categoryProfessionals as Professional[]}
                  likedProfs={likedProfs}
                  onToggleLike={handleToggleLike}
                  onProfessionalClick={handleProfessionalClick}
                />
              )
            )
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,205px)] lg:justify-start gap-4 min-h-[400px]">
          {filteredProfessionals.map((professional: Professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              isLiked={(() => {
                const profIdString = professional.id.toString();
                const isLiked = likedProfs[profIdString] || false;

                return isLiked;
              })()}
              onToggleLike={handleToggleLike}
              onProfessionalClick={handleProfessionalClick}
              lineClamp={3}
              showPrice={true}
              showFirstCallOffer
            />
          ))}
        </div>
      )}
    </>
  );
});

type ClientProps = {
  sponsoBanners: SponsoBanner[];
  sponsoIndex: number;
  onSponsoIndexChange: (index: number) => void;
};

export default function Client({
  sponsoBanners,
  sponsoIndex,
  onSponsoIndexChange,
}: ClientProps) {
  const t = useTranslations();
  const { searchQuery } = useSearchStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authUtils
      .isAuthenticated()
      .then(setIsAuthenticated)
      .catch(() => setIsAuthenticated(false));
  }, []);

  const {
    selectedCategory,
    selectedSubCategory,
    groupedProfessionals,
    filteredProfessionals,
    likedProfs,
    handleCategoryChange,
    handleSubCategoryChange,
    handleSortChange,
    handleToggleLike,
    handleProfessionalClick,
    isLoading,
    error,
  } = useClientHome();

  const { confirmedAppointments: upcomingAppointments } =
    usePatientAppointments(isAuthenticated);

  const isSearchMode = Boolean(searchQuery && searchQuery.trim().length > 0);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">
            {t("home.errorLoadingExperts")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || t("home.unknownError")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UpcomingVisiosSection
        upcomingAppointments={upcomingAppointments}
        t={t}
      />

      <ExpertsResultsSection
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        groupedProfessionals={groupedProfessionals}
        filteredProfessionals={filteredProfessionals}
        likedProfs={likedProfs}
        isLoading={isLoading}
        handleCategoryChange={handleCategoryChange}
        handleSubCategoryChange={handleSubCategoryChange}
        handleSortChange={handleSortChange}
        handleToggleLike={handleToggleLike}
        handleProfessionalClick={handleProfessionalClick}
        t={t}
        sponsoBanners={sponsoBanners}
        sponsoIndex={sponsoIndex}
        onSponsoIndexChange={onSponsoIndexChange}
      />
    </div>
  );
}
