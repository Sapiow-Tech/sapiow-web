import { TimezoneUpdater } from "@/components/auth/TimezoneUpdater";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Figtree, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://app.sapiow.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  title: "Sapiow - Réservez des consultations avec des experts en ligne",
  description:
    "Connectez-vous avec des experts qualifiés pour des consultations vidéo sur Sapiow.",
  openGraph: {
    siteName: "Sapiow",
    type: "website",
    title: "Sapiow - Réservez des consultations avec des experts",
    description:
      "Connectez-vous avec des experts qualifiés pour des consultations vidéo sur Sapiow.",
    images: [
      {
        url: `${SITE_URL}/assets/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Sapiow - Plateforme d'experts en ligne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapiow - Réservez des consultations avec des experts",
    description:
      "Connectez-vous avec des experts qualifiés pour des consultations vidéo sur Sapiow.",
    images: [
      {
        url: `${SITE_URL}/assets/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Sapiow - Plateforme d'experts en ligne",
      },
    ],
  },
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body
        className={` ${figtree.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <TimezoneUpdater />
            <FavoritesProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#4ade80",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </FavoritesProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
