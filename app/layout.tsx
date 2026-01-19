import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/components/AuthProvider";
import SocketNotifications from "@/components/SocketNotifications";

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
  openGraph: {
    title: "QoriCash - Casa de Cambio Online",
    description: "Los mejores tipos de cambio del mercado peruano",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {/* Notificaciones en tiempo real (KYC, operaciones, etc.) */}
          <SocketNotifications />
        </AuthProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
