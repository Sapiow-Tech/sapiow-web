"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface ProfilePhotoUploadProps {
  onPhotoSelect?: (file: File) => void;
  onPhotoDelete?: () => void; // Fonction pour supprimer la photo
  className?: string;
  isCompte?: boolean;
  currentAvatar?: string; // URL de l'avatar existant
  isUploading?: boolean; // État de chargement pour l'upload
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  onPhotoSelect,
  onPhotoDelete,
  className = "",
  isCompte = false,
  currentAvatar,
  isUploading = false,
}) => {
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Créer une URL temporaire pour afficher l'image
      const imageUrl = URL.createObjectURL(file);

      setSelectedImage(imageUrl);

      if (onPhotoSelect) {
        onPhotoSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Fonction pour valider si l'URL de l'avatar est valide
  const isValidAvatarUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  // Vérifier si l'utilisateur a une photo (locale ou serveur)
  const hasPhoto = selectedImage || isValidAvatarUrl(currentAvatar);

  return (
    <div className={`flex flex-col items-center mb-1 ${className}`}>
      <div className="relative mb-4 group">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-light-blue-gray overflow-hidden ${
            isCompte ? "ml-4" : ""
          }`}
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={t("profile.profilePhotoAlt")}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : isValidAvatarUrl(currentAvatar) ? (
            <Image
              src={currentAvatar!}
              alt={t("profile.profilePhotoAlt")}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-12 h-12">
              <Image
                src={"/assets/icons/user.svg"}
                alt={t("profile.userIconAlt")}
                width={30}
                height={30}
                className="mb-2 w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Icône de suppression - visible au hover seulement si photo existe */}
        {hasPhoto && isCompte && onPhotoDelete && (
          <button
            type="button"
            onClick={() => {
              if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
              }
              setSelectedImage(null);
              onPhotoDelete();
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50 z-10 shadow-lg"
            title={t("profile.deletePhoto")}
            disabled={isUploading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M3 6H5H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 11V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {!isCompte && (
          <>
            {" "}
            <label
              htmlFor="photo-upload"
              className="absolute -bottom-1 -right-1 w-9 h-9 flex items-center justify-center cursor-pointer"
            >
              <Image
                src={"/assets/icons/camera.svg"}
                alt={t("profile.uploadIconAlt")}
                width={30}
                height={30}
                className="mb-2"
              />
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </>
        )}
        {isCompte && (
          <>
            <button
              type="button"
              className="text-[13px] mt-2 w-full max-w-[140px] text-exford-blue font-bold bg-white rounded-full px-3 py-2 border border-light-blue-gray cursor-pointer font-figtree disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading
                ? t("profile.uploading")
                : hasPhoto
                ? t("profile.changePhoto")
                : t("profile.addPhoto")}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </>
        )}
      </div>
    </div>
  );
};
