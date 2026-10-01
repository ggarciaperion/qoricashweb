'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[QoriCash] Error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <img src="/icons/icon-192x192.png" alt="QoriCash" width={72} height={72} style={{ marginBottom: '24px', borderRadius: '14px' }} />
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Algo salió mal</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px', maxWidth: '380px' }}>
        Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{ background: '#1463FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          style={{ background: '#1e293b', color: '#fff', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
