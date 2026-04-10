'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'qoricash_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem(KEY, 'accepted'); } catch { /* noop */ }
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(KEY, 'essential'); } catch { /* noop */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      style={{ zIndex: 2147483647 }}
      className="fixed bottom-0 left-0 right-0 bg-[rgba(4,10,20,0.97)] border-t-2 border-[#00DEA8]/50 shadow-[0_-8px_32px_rgba(0,0,0,0.7)] px-6 py-4 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
        {/* Icono */}
        <span className="text-2xl flex-shrink-0" aria-hidden>🍪</span>

        {/* Texto */}
        <p className="flex-1 min-w-[220px] text-sm text-white/75 leading-relaxed">
          <strong className="text-white font-semibold">Esta página usa cookies.</strong>{' '}
          Usamos cookies para personalizar el contenido, ofrecer funciones del sitio y analizar
          el tráfico. Consulta nuestra{' '}
          <Link href="/politica-cookies" className="text-[#00DEA8] font-semibold underline-offset-2 hover:underline">
            Política de Cookies
          </Link>.
        </p>

        {/* Botones */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm text-white/50 border border-white/20 rounded-lg hover:text-white/80 hover:border-white/35 transition-colors"
          >
            Solo esenciales
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-sm font-bold text-[#060e18] bg-gradient-to-r from-[#00FFB3] to-[#00DEA8] rounded-lg shadow-[0_4px_16px_rgba(0,222,168,0.35)] hover:shadow-[0_6px_22px_rgba(0,222,168,0.5)] hover:-translate-y-px transition-all"
          >
            Permitir todas las cookies
          </button>
        </div>
      </div>
    </div>
  );
}
