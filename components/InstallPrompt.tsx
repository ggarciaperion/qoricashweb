'use client';

import { useEffect, useState } from 'react';

type Platform = 'ios' | 'android' | null;

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed or dismissed
    if (
      localStorage.getItem('qc_pwa_dismissed') ||
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone
    ) return;

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      // Show iOS guide with slight delay
      setTimeout(() => {
        setPlatform('ios');
        setVisible(true);
      }, 4000);
    }

    // Android: wait for native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('android');
      setTimeout(() => setVisible(true), 4000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('qc_pwa_dismissed', '1');
  };

  const installAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') localStorage.setItem('qc_pwa_dismissed', '1');
    setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible || !platform) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 16,
        right: 16,
        background: '#0D1B2A',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '16px 20px',
        zIndex: 9998,
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Close */}
      <button
        onClick={dismiss}
        style={{
          position: 'absolute',
          top: 12,
          right: 14,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 18,
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <img
          src="/icons/icon-72x72.png"
          alt="QoriCash"
          style={{ width: 44, height: 44, borderRadius: 10 }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Instalar QoriCash</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            Acceso rápido desde tu pantalla de inicio
          </div>
        </div>
      </div>

      {platform === 'ios' ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
          }}
        >
          Toca <strong style={{ color: '#fff' }}>Compartir</strong> (
          <span style={{ fontSize: 15 }}>⎋</span>) y luego{' '}
          <strong style={{ color: '#fff' }}>"Agregar a pantalla de inicio"</strong>
        </div>
      ) : (
        <button
          onClick={installAndroid}
          style={{
            width: '100%',
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '13px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.2px',
          }}
        >
          Instalar aplicación
        </button>
      )}
    </div>
  );
}
