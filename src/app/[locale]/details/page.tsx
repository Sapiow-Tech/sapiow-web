import type { Metadata } from "next";
import ProfessionalDetail from "./DetailsClient";

export const dynamic = "force-dynamic";

const SITE_URL = "https://app.sapiow.com";
const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface DetailsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}

async function fetchProExpert(id: string) {
  try {
    const res = await fetch(`${API_URL}/functions/v1/pro/${id}`, {
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY || "",
        Authorization: `Bearer ${ANON_KEY || ""}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function truncateAtWord(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const sliced = normalized.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

function buildExpertTitle(fullName: string, job?: string | null): string {
  if (!fullName) return "Sapiow - Expert · Consultation vidéo";

  const jobLabel =
    typeof job === "string" && job.trim() ? job.trim() : "Consultation vidéo";
  const base = `Sapiow - ${fullName} · ${jobLabel}`;
  if (base.length <= 60) return base;

  const withName = `Sapiow - ${fullName} · Consultation vidéo`;
  if (withName.length <= 60) return withName;

  return truncateAtWord(`Sapiow - ${fullName}`, 60);
}

function buildExpertDescription(proData: {
  first_name?: string;
  last_name?: string;
  job?: string | null;
  description?: string | null;
  domains?: { name?: string } | null;
}): string {
  const fullName = [proData.first_name, proData.last_name]
    .filter(Boolean)
    .join(" ");
  const job = typeof proData.job === "string" ? proData.job.trim() : "";
  const domain =
    typeof proData.domains?.name === "string" ? proData.domains.name.trim() : "";
  const bio =
    typeof proData.description === "string" ? proData.description.trim() : "";

  const leadParts = [
    fullName || "Cet expert",
    job ? `${job}` : null,
    domain ? `spécialisé(e) en ${domain}` : null,
  ].filter(Boolean);

  let text = `${leadParts.join(" · ")} sur Sapiow.`;
  if (bio) {
    text = `${text} ${bio}`;
  }

  const cta = " Réservez une consultation vidéo sur Sapiow.";
  if (text.length < 120) {
    text = `${text}${cta}`.replace(/\s+/g, " ").trim();
  }

  if (text.length < 120) {
    text = `${text} Accédez à des conseils d’experts qualifiés en visioconférence.`;
  }

  return truncateAtWord(text.replace(/\s+/g, " ").trim(), 155);
}

function ogImageEntry(id: string | undefined, alt: string) {
  const url = id
    ? `${SITE_URL}/api/og/expert?id=${encodeURIComponent(id)}`
    : `${SITE_URL}/api/og/expert`;

  return {
    url,
    width: 1200,
    height: 630,
    alt,
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: DetailsPageProps): Promise<Metadata> {
  const [{ locale }, { id }] = await Promise.all([params, searchParams]);

  const fallbackTitle = "Sapiow - Expert · Consultation vidéo";
  const fallbackDescription =
    "Découvrez le profil d’un expert sur Sapiow et réservez une consultation vidéo en ligne avec un professionnel qualifié.";
  const fallbackImage = ogImageEntry(undefined, fallbackTitle);

  const fallbackMeta: Metadata = {
    title: fallbackTitle,
    description: fallbackDescription,
    openGraph: {
      siteName: "Sapiow",
      type: "website",
      title: fallbackTitle,
      description: fallbackDescription,
      images: [fallbackImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fallbackTitle,
      description: fallbackDescription,
      images: [fallbackImage],
    },
  };

  if (!id) return fallbackMeta;

  const proData = await fetchProExpert(id);
  if (!proData) return fallbackMeta;

  const fullName = [proData.first_name, proData.last_name]
    .filter(Boolean)
    .join(" ");
  const title = buildExpertTitle(fullName, proData.job);
  const description = buildExpertDescription(proData);
  const imageEntry = ogImageEntry(id, title);
  const pageUrl = `${SITE_URL}/${locale}/details?id=${id}`;

  return {
    title,
    description,
    openGraph: {
      siteName: "Sapiow",
      type: "website",
      title,
      description,
      url: pageUrl,
      images: [imageEntry],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageEntry],
    },
  };
}

export default function DetailsPage() {
  return <ProfessionalDetail />;
}
