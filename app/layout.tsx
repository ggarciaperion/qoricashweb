import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/components/AuthProvider";
import SocketNotifications from "@/components/SocketNotifications";
import BackgroundDecor from "@/components/BackgroundDecor";
import CookieBanner from "@/components/CookieBanner";

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

export const metadata: Metadata = {
  title: "QoriCash | Casa de Cambio Online - Compra y Vende Dólares al Mejor Precio",
  description: "Cambia dólares de forma segura y rápida con QoriCash. Los mejores tipos de cambio del mercado. Transferencias inmediatas a tu cuenta bancaria.",
  keywords: "casa de cambio, cambio de dólares, tipo de cambio, compra venta dólares, peru",
  authors: [{ name: "QoriCash" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64",  type: "image/x-icon" },
      { url: "/icon.png",    sizes: "512x512",                   type: "image/png" },
    ],
    apple:   { url: "/icon.png", sizes: "512x512", type: "image/png" },
    shortcut: "/icon.png",
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
      </body>
    </html>
  );
}
