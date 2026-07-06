import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QoriCash Corporate | Tipo de Cambio para Empresas - Cambio de Divisas Corporativo',
  description: 'Soluciones de cambio de divisas para empresas en Perú. Tipo de cambio competitivo, liquidación en menos de 15 minutos, sin comisiones. Operaciones desde $5,000.',
  keywords: 'cambio divisas empresas, tipo de cambio corporativo, casa de cambio empresas peru, forex empresas, cambio dolares empresas',
  openGraph: {
    title: 'QoriCash Corporate - Cambio de Divisas para Empresas',
    description: 'Tipo de cambio competitivo para empresas peruanas. Sin comisiones, liquidación en 15 minutos.',
    type: 'website',
    images: [{ url: '/logo-principal.png' }],
  },
};

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="empresa-page" style={{ position: 'relative', minHeight: '100vh', background: '#060E1A' }}>
      <style>{`
        /* Fondo base oscuro inmediato antes de que cargue el video */
        .empresa-page {
          background: #060E1A;
        }

        /* Fade-in suave del contenido al montar la página */
        @keyframes empresaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .empresa-page > *:not(style):not(video) {
          animation: empresaFadeIn 0.45s ease-out both;
        }

        /* Hero y bancos → transparentes para mostrar el video */
        .empresa-page section.corp-transparent {
          background: transparent !important;
        }

        /* Secciones corp con fondo oscuro propio (analytics, noticias) → conservar */
        .empresa-page section.corp-dark {
          /* mantiene su inline background */
        }

        /* Todos los textos de secciones debajo del hero → blanco */
        .empresa-page section:not(:first-of-type) *,
        .empresa-page footer * {
          color: rgba(255,255,255,0.88) !important;
        }

        /* Re-aplicar verde a los elementos que deben mantenerse */
        .empresa-page section:not(:first-of-type) .text-primary,
        .empresa-page section:not(:first-of-type) .text-primary-400,
        .empresa-page section:not(:first-of-type) .text-primary-500,
        .empresa-page section:not(:first-of-type) .text-primary-600,
        .empresa-page section:not(:first-of-type) [style*="22C55E"],
        .empresa-page section:not(:first-of-type) [style*="16a34a"],
        .empresa-page section:not(:first-of-type) [style*="16A34A"],
        .empresa-page section:not(:first-of-type) [style*="4ade80"] {
          color: #22C55E !important;
        }

        /* Texto blanco ya correcto → mantener blanco */
        .empresa-page section:not(:first-of-type) .text-white,
        .empresa-page section:not(:first-of-type) [style*="fff"],
        .empresa-page section:not(:first-of-type) [style*="FFF"] {
          color: #ffffff !important;
        }
      `}</style>

      {/* Video background — fondo oscuro (#060E1A) mientras carga */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: -2,
        background: '#060E1A',
      }} />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/corpo.mp4" type="video/mp4" />
      </video>

      {children}
    </div>
  );
}
