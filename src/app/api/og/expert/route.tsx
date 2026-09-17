import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function fetchProExpert(id: string) {
  try {
    const res = await fetch(`${API_URL}/functions/v1/pro/${id}`, {
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function loadAvatarDataUrl(avatarUrl: string): Promise<string | null> {
  try {
    const res = await fetch(avatarUrl, { cache: "force-cache" });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return `data:${contentType};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

function renderOgCard({
  displayName,
  job,
  avatarSrc,
}: {
  displayName: string;
  job: string;
  avatarSrc: string | null;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#F0F6FF",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
            height: 280,
            borderRadius: 140,
            overflow: "hidden",
            background: "#001E44",
            marginRight: 56,
            flexShrink: 0,
          }}
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              width={280}
              height={280}
              style={{ objectFit: "cover", width: 280, height: 280 }}
              alt=""
            />
          ) : (
            <div
              style={{
                display: "flex",
                color: "#FFFFFF",
                fontSize: 96,
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#001E44",
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Sapiow
          </div>
          <div
            style={{
              display: "flex",
              color: "#0F172A",
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 16,
              maxWidth: 720,
            }}
          >
            {displayName.length > 40
              ? `${displayName.slice(0, 37)}...`
              : displayName}
          </div>
          <div
            style={{
              display: "flex",
              color: "#475569",
              fontSize: 28,
              fontWeight: 500,
              maxWidth: 720,
            }}
          >
            {job.length > 60 ? `${job.slice(0, 57)}...` : job}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  let displayName = "Expert Sapiow";
  let job = "Consultation vidéo";
  let avatarSrc: string | null = null;

  if (id) {
    const proData = await fetchProExpert(id);
    if (proData) {
      const fullName = [proData.first_name, proData.last_name]
        .filter(Boolean)
        .join(" ");
      if (fullName) displayName = fullName;
      if (typeof proData.job === "string" && proData.job.trim()) {
        job = proData.job.trim();
      }
      if (
        typeof proData.avatar === "string" &&
        proData.avatar.startsWith("http")
      ) {
        avatarSrc = await loadAvatarDataUrl(proData.avatar);
      }
    }
  }

  const response = renderOgCard({ displayName, job, avatarSrc });
  response.headers.set(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  );

  return response;
}
