"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ProfileAvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "xl2";
  className?: string;
  borderColor?: string;
  borderWidth?: "1" | "2" | "3";
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  alt,
  size = "md",
  className = "",
  borderColor = "border-lavender-mist",
  borderWidth = "3",
}) => {
  const sizeClasses = {
    sm: "w-10 h-10", // 40px
    md: "w-14 h-14", // 56px
    lg: "w-16 h-16", // 64px
    xl: "w-20 h-20", // 80px
    xl2: "w-28 h-28", // 96px
  };

  const sizeValues = {
    sm: { width: 40, height: 40 },
    md: { width: 56, height: 56 },
    lg: { width: 64, height: 64 },
    xl: { width: 80, height: 80 },
    xl2: { width: 112, height: 112 },
  };

  const borderClasses = {
    "1": "border-1",
    "2": "border-2",
    "3": "border-3",
  };

  const isValidAvatarUrl = (url?: string): boolean => {
    if (!url || url === "undefined") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const getInitials = (label: string): string => {
    const parts = label.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  };

  const initialsTextSize = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    xl2: "text-3xl",
  };

  const showInitials = !isValidAvatarUrl(src);

  return (
    <div
      className={cn(
        sizeClasses[size],
        borderClasses[borderWidth],
        borderColor,
        "rounded-full overflow-hidden shrink-0",
        showInitials && "bg-snow-blue flex items-center justify-center",
        className
      )}
    >
      {showInitials ? (
        <span
          className={cn(
            "font-figtree font-semibold text-cobalt-blue",
            initialsTextSize[size]
          )}
        >
          {getInitials(alt)}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={sizeValues[size].width}
          height={sizeValues[size].height}
          className="w-full h-full object-cover"
          quality={100}
        />
      )}
    </div>
  );
};
