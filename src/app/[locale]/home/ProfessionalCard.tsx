"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Professional } from "@/types/professional";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface ProfessionalCardProps {
  professional: Professional;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onProfessionalClick?: (professional: Professional) => void;
  imageWidth?: number;
  imageHeight?: number;
  maxWidth?: string;
  lineClamp?: number;
  isLoadingFavorite?: boolean;
  nameSize?: string;
  iconSize?: number;
  showPrice?: boolean;
  showFirstCallOffer?: boolean;
}

export default function ProfessionalCard({
  professional,
  isLiked,
  onToggleLike,
  onProfessionalClick,
  imageWidth = 205,
  imageHeight = 196,
  maxWidth = "max-w-[205px]",
  lineClamp = 3,
  isLoadingFavorite = false,
  nameSize = "text-sm",
  iconSize = 16,
  showPrice = true,
  showFirstCallOffer = false,
}: ProfessionalCardProps) {
  const priceNumberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    []
  );

  const parsePrice = (value: unknown) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    const normalized = String(value ?? "")
      .trim()
      .replace("€", "")
      .replace(/\s/g, "")
      .replace(",", ".");
    if (normalized.length === 0) return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  };

  const startingFromPrice = useMemo(() => {
    const direct = parsePrice(professional.price);
    if (direct !== null) return direct;

    const sessions = Array.isArray((professional as any)?.sessions)
      ? (professional as any).sessions
      : [];
    const oneTimeActive = sessions.filter(
      (s: any) => s?.is_active === true && s?.session_nature === "one_time"
    );
    const oneTimeActiveVideo = oneTimeActive.filter(
      (s: any) => s?.video_call === true
    );
    const candidates =
      oneTimeActiveVideo.length > 0 ? oneTimeActiveVideo : oneTimeActive;
    if (candidates.length === 0) return null;

    const min = candidates.reduce((acc: number, s: any) => {
      const price = parsePrice(s?.price);
      return price === null ? acc : Math.min(acc, price);
    }, Number.POSITIVE_INFINITY);

    return Number.isFinite(min) ? min : null;
  }, [professional, professional.price]);

  return (
    <Card
      className={`mx-auto p-0 m-0 border-none shadow-none ${maxWidth} w-full cursor-pointer duration-200 my-3 rounded-2xl`}
      onClick={() => onProfessionalClick?.(professional)}
    >
      <div className="relative">
        {professional.topExpertise && (
          <Badge className="absolute bottom-3 left-3 bg-white text-black font-bold text-xs hover:bg-white">
            Top Expert
          </Badge>
        )}
        <Image
          src={
            professional.image ||
            professional.avatar ||
            "/assets/icons/pro1.png"
          }
          alt={
            professional.name ||
            `${professional.first_name || ""} ${
              professional.last_name || ""
            }`.trim() ||
            "Professional"
          }
          width={imageWidth}
          height={imageHeight}
          quality={100}
          className="w-full h-full object-cover rounded-[12px]"
          style={{
            objectFit: "cover",
            width: imageWidth,
            height: imageHeight,
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-white hover:bg-gray-50 shadow-sm rounded-full w-8 h-8 transition-all duration-200 cursor-pointer ${
            isLoadingFavorite ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLoadingFavorite) {
              onToggleLike(professional.id.toString());
            }
          }}
          disabled={isLoadingFavorite}
        >
          {isLoadingFavorite ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          ) : (
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isLiked ? "fill-red-600 text-red-600" : "text-gray-400"
              }`}
            />
          )}
        </Button>
      </div>
      <CardContent className="flex items-center justify-between p-0 m-0">
        <div className="min-w-0 flex-1 overflow-hidden pr-2">
          <div className="flex items-center mb-1">
            <h3 className={`font-bold text-black ${nameSize} truncate`}>
              {professional.name ||
                `${professional.first_name || ""} ${
                  professional.last_name || ""
                }`.trim() ||
                "Nom non disponible"}
            </h3>

            {professional.topExpertise ? (
              <Image
                src="/assets/icons/top-verified.svg"
                alt="Verified"
                width={iconSize}
                height={iconSize}
                className="transition-all duration-200 ml-1 flex-shrink-0"
              />
            ) : (
              <Image
                src="/assets/icons/verified.svg"
                alt="Verified"
                width={iconSize}
                height={iconSize}
                className="transition-all duration-200 flex-shrink-0"
              />
            )}
          </div>
          {showPrice && (
            <p className="text-xs text-black mb-1 truncate">
              {startingFromPrice !== null ? (
                showFirstCallOffer && startingFromPrice === 0 ? (
                  <span className="font-bold font-figtree">
                    1er appel offert
                  </span>
                ) : (
                  <>
                    <span className="font-bold font-figtree">
                      {priceNumberFormatter.format(startingFromPrice)}
                    </span>{" "}
                    € / Session
                  </>
                )
              ) : (
                ""
              )}
            </p>
          )}
          <p
            className={`text-xs text-gray-500 leading-relaxed font-figtree font-medium line-clamp-3`}
          >
            {professional.description
              ? professional.description
              : professional.job}
          </p>
        </div>
        {professional.linkedin && (
          <Image
            src="/assets/icons/linkedin.svg"
            alt="Linkedin"
            width={25}
            height={25}
            className="transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              if (professional.linkedin) {
                window.open(professional.linkedin, "_blank");
              }
            }}
            style={{ cursor: "pointer" }}
          />
        )}
      </CardContent>
    </Card>
  );
}
