import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada | QoriCash',
  description: 'La página que buscas no existe. Vuelve al inicio de QoriCash.',
};

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <img src="/icons/icon-192x192.png" alt="QoriCash" width={72} height={72} style={{ marginBottom: '24px', borderRadius: '14px' }} />
      <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#1463FF', margin: '0 0 8px' }}>404</h1>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>Página no encontrada</h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px', maxWidth: '360px' }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        style={{ background: '#1463FF', color: '#fff', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
