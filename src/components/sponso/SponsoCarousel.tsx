"use client";

import {
  getSponsoDestination,
  type SponsoBanner,
} from "@/api/sponso/useSponso";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SponsoCarouselProps = {
  banners: SponsoBanner[];
  index: number;
  onIndexChange: (index: number) => void;
};

const SLIDE_TRANSITION_MS = 500;
const CLONE_RESET_FALLBACK_MS = SLIDE_TRANSITION_MS + 50;

function isValidImageUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function BannerImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  if (!isValidImageUrl(src)) {
    return (
      <div
        className={`flex aspect-[4/1] items-center justify-center bg-slate-200 ${className ?? ""}`}
      >
        <ImageIcon className="h-10 w-10 text-slate-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1800}
      height={450}
      unoptimized
      className={className}
    />
  );
}

function BannerSlide({
  banner,
  defaultCta,
  sponsoredLabel,
  onNavigate,
}: {
  banner: SponsoBanner;
  defaultCta: string;
  sponsoredLabel: string;
  onNavigate: (banner: SponsoBanner) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(banner)}
      className="relative block w-full shrink-0 basis-full cursor-pointer text-left"
    >
      <BannerImage
        src={banner.image_url}
        alt={banner.cta_label || defaultCta}
        className="aspect-[4/1] h-auto w-full object-cover"
      />
      <Badge className="absolute right-3 top-3 bg-[#011E44] text-xs text-white hover:bg-[#011E44]">
        {sponsoredLabel}
      </Badge>
      <div className="absolute inset-x-0 bottom-0 flex items-end p-3 md:p-4">
        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#011E44] shadow">
          {banner.cta_label || defaultCta}
        </span>
      </div>
    </button>
  );
}

function reenableTransition(setIsTransitionEnabled: (value: boolean) => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => setIsTransitionEnabled(true));
  });
}

export function SponsoCarousel({
  banners,
  index,
  onIndexChange,
}: SponsoCarouselProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("sponso");

  const count = banners.length;
  const hasMultiple = count > 1;

  const extendedBanners = useMemo(() => {
    if (!hasMultiple) return banners;
    return [banners[count - 1], ...banners, banners[0]];
  }, [banners, count, hasMultiple]);

  const [slideIndex, setSlideIndex] = useState(hasMultiple ? 1 : 0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document !== "undefined" && !document.hidden,
  );
  const slideIndexRef = useRef(slideIndex);
  const indexRef = useRef(index);

  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    setSlideIndex(hasMultiple ? 1 : 0);
    setIsTransitionEnabled(true);
  }, [banners.length, hasMultiple]);

  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const resetClonePosition = useCallback(() => {
    if (!hasMultiple) return false;
    const current = slideIndexRef.current;
    if (current === count + 1) {
      setIsTransitionEnabled(false);
      setSlideIndex(1);
      reenableTransition(setIsTransitionEnabled);
      return true;
    }
    if (current === 0) {
      setIsTransitionEnabled(false);
      setSlideIndex(count);
      reenableTransition(setIsTransitionEnabled);
      return true;
    }
    return false;
  }, [count, hasMultiple]);

  const resyncToLogicalIndex = useCallback(() => {
    if (!hasMultiple) return;
    setIsTransitionEnabled(false);
    setSlideIndex(indexRef.current + 1);
    reenableTransition(setIsTransitionEnabled);
  }, [hasMultiple]);

  function handleNavigate(banner: SponsoBanner) {
    router.push(getSponsoDestination(banner, locale));
  }

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    const current = slideIndexRef.current;

    if (current === count + 1) {
      resetClonePosition();
      return;
    }
    if (current > count + 1) {
      resyncToLogicalIndex();
      return;
    }

    const nextSlide = current + 1;
    setIsTransitionEnabled(true);
    setSlideIndex(nextSlide);
    const nextLogical = nextSlide === count + 1 ? 0 : nextSlide - 1;
    onIndexChange(nextLogical);
  }, [count, hasMultiple, onIndexChange, resetClonePosition, resyncToLogicalIndex]);

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    const current = slideIndexRef.current;

    if (current === 0) {
      resetClonePosition();
      return;
    }
    if (current < 0) {
      resyncToLogicalIndex();
      return;
    }

    const prevSlide = current - 1;
    setIsTransitionEnabled(true);
    setSlideIndex(prevSlide);
    const prevLogical = prevSlide === 0 ? count - 1 : prevSlide - 1;
    onIndexChange(prevLogical);
  }, [count, hasMultiple, onIndexChange, resetClonePosition, resyncToLogicalIndex]);

  function goToLogicalIndex(targetIndex: number) {
    if (!hasMultiple) return;
    setIsTransitionEnabled(true);
    setSlideIndex(targetIndex + 1);
    onIndexChange(targetIndex);
  }

  function handleTransitionEnd() {
    resetClonePosition();
  }

  useEffect(() => {
    if (!hasMultiple) return;
    if (slideIndex !== 0 && slideIndex !== count + 1) return;

    const timer = window.setTimeout(() => {
      resetClonePosition();
    }, CLONE_RESET_FALLBACK_MS);

    return () => window.clearTimeout(timer);
  }, [slideIndex, hasMultiple, count, resetClonePosition]);

  useEffect(() => {
    if (!isPageVisible || !hasMultiple) return;

    const current = slideIndexRef.current;
    if (current < 0 || current > count + 1) {
      resyncToLogicalIndex();
      return;
    }
    if (current === 0 || current === count + 1) {
      resetClonePosition();
    }
  }, [isPageVisible, hasMultiple, count, resetClonePosition, resyncToLogicalIndex]);

  useEffect(() => {
    if (!hasMultiple || isHovered || !isPageVisible) return;
    const timer = window.setInterval(goNext, SPONSO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [goNext, hasMultiple, isHovered, isPageVisible]);

  if (count === 0) return null;

  const arrowClass =
    "absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 opacity-0 shadow transition-opacity duration-200 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto";

  return (
    <div className="mb-4 mt-2 w-full max-w-[900px]">
      <div
        className="group relative overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: isTransitionEnabled
              ? `transform ${SLIDE_TRANSITION_MS}ms ease-in-out`
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedBanners.map((banner, slideKey) => (
            <BannerSlide
              key={`${banner.id}-${slideKey}`}
              banner={banner}
              defaultCta={t("defaultCta")}
              sponsoredLabel={t("sponsored")}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label={t("previous")}
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              className={`left-2 ${arrowClass}`}
            >
              <ChevronLeft className="h-5 w-5 text-[#011E44]" />
            </button>
            <button
              type="button"
              aria-label={t("next")}
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              className={`right-2 ${arrowClass}`}
            >
              <ChevronRight className="h-5 w-5 text-[#011E44]" />
            </button>
            <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
              {banners.map((banner, dotIndex) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`${dotIndex + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    goToLogicalIndex(dotIndex);
                  }}
                  className={`h-2 w-2 cursor-pointer rounded-full ${
                    dotIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const SPONSO_ROTATE_MS = 5000;
