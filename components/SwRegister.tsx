'use client';

import { useEffect } from 'react';

export default function SwRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available — show update banner
                const banner = document.getElementById('qc-sw-update-banner');
                if (banner) banner.style.display = 'flex';
              }
            });
          });
        })
        .catch((err) => console.warn('[SW] Registration failed:', err));
    }
  }, []);

  return (
    <>
      {/* Update banner — hidden by default, shown by SW updatefound */}
      <div
        id="qc-sw-update-banner"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0D1B2A',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 10,
          padding: '12px 20px',
          fontSize: 13,
          fontWeight: 500,
          zIndex: 9999,
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        <span>Nueva versión disponible</span>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Actualizar
        </button>
      </div>
    </>
  );
}
