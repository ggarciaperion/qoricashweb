import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/components/AuthProvider";
import SocketNotifications from "@/components/SocketNotifications";
import BackgroundDecor from "@/components/BackgroundDecor";
import CookieBanner from "@/components/CookieBanner";
import SwRegister from "@/components/SwRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.qoricash.pe'),
  title: "QoriCash | Casa de Cambio Online - Compra y Vende Dólares al Mejor Precio",
  description: "Cambia dólares de forma segura y rápida con QoriCash. Los mejores tipos de cambio del mercado. Transferencias inmediatas a tu cuenta bancaria.",
  keywords: "casa de cambio, cambio de dólares, tipo de cambio, compra venta dólares, peru",
  authors: [{ name: "QoriCash" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QoriCash",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "QoriCash - Casa de Cambio Online",
    description: "Los mejores tipos de cambio del mercado peruano",
    type: "website",
    images: [{ url: "/logo-principal.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* PWA — Apple splash / extra meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0D1B2A" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased relative">
        {/* Decoración de fondo sutil y profesional */}
        <BackgroundDecor />

        <AuthProvider>
          <div className="relative z-10">
            {children}
          </div>
          {/* Notificaciones en tiempo real (KYC, operaciones, etc.) */}
          <SocketNotifications />
        </AuthProvider>
        <WhatsAppButton />
        <CookieBanner />

        {/* PWA */}
        <SwRegister />
      </body>
    </html>
  );
}
