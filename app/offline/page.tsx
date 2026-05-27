'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => window.location.replace('/'), 1000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D1B2A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <img
        src="/logo-principal.png"
        alt="QoriCash"
        style={{ width: 120, marginBottom: 40, opacity: 0.9 }}
      />

      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          border: '2px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          marginBottom: 28,
        }}
      >
        {isOnline ? '✓' : '📡'}
      </div>

      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          margin: '0 0 12px',
          letterSpacing: '-0.3px',
        }}
      >
        {isOnline ? 'Conexión restaurada' : 'Sin conexión a internet'}
      </h1>

      <p
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.55)',
          maxWidth: 320,
          lineHeight: 1.6,
          margin: '0 0 36px',
        }}
      >
        {isOnline
          ? 'Redirigiendo...'
          : 'Verifica tu conexión a internet e intenta nuevamente.'}
      </p>

      {/* Status dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: isOnline ? '#16a34a' : '#ef4444',
            boxShadow: isOnline
              ? '0 0 8px rgba(22,163,74,0.6)'
              : '0 0 8px rgba(239,68,68,0.6)',
          }}
        />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          {isOnline ? 'En línea' : 'Sin conexión'}
        </span>
      </div>

      {!isOnline && (
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#fff',
            color: '#0D1B2A',
            border: 'none',
            borderRadius: 8,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.2px',
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
