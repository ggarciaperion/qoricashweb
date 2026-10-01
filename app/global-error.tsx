'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[QoriCash] Global error:', error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0D1B2A', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
        <img src="/icons/icon-192x192.png" alt="QoriCash" width={80} height={80} style={{ marginBottom: '24px', borderRadius: '16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Algo salió mal</h1>
        <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '32px', maxWidth: '400px' }}>
          Ocurrió un error inesperado. Por favor intenta nuevamente o contáctanos por WhatsApp.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ background: '#1463FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Intentar de nuevo
          </button>
          <a
            href="https://wa.me/51910624404"
            style={{ background: '#16a34a', color: '#fff', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Contactar soporte
          </a>
        </div>
      </body>
    </html>
  );
}
