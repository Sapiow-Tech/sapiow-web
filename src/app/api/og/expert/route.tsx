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

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  let avatarSrc: string | null = null;

  if (id) {
    const proData = await fetchProExpert(id);
    if (
      proData &&
      typeof proData.avatar === "string" &&
      proData.avatar.startsWith("http")
    ) {
      avatarSrc = await loadAvatarDataUrl(proData.avatar);
    }
  }

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F0F6FF",
          overflow: "hidden",
        }}
      >
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            width={1200}
            height={630}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            alt=""
          />
        ) : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );

  response.headers.set(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  );

  return response;
}
