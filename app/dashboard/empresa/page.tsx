'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { RefreshCw } from 'lucide-react';

export default function EmpresaDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { currentRates } = useExchangeStore();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.document_type !== 'RUC') { router.replace('/dashboard'); return; }
  }, [isAuthenticated, user?.document_type]);

  const companyName = user?.razon_social || user?.nombres || 'Empresa';
  const initials = companyName.slice(0, 2).toUpperCase();
  const compra = currentRates?.tipo_compra ?? 0;
  const venta = currentRates?.tipo_venta ?? 0;

  return (
    <div className="empresa-dashboard-home min-h-full flex flex-col items-center justify-center px-4">
      <style>{`
        @keyframes epFadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Saludo */}
      <div style={{ animation: 'epFadeUp 0.4s ease-out both', textAlign: 'center', marginBottom: 32 }}>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>
          Panel Corporativo
        </p>
        <h1 className="text-xl font-black" style={{ color: '#0D1117' }}>
          {companyName}
        </h1>
        {user?.dni && (
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>RUC {user.dni}</p>
        )}
      </div>

      {/* TC card */}
      <div style={{ animation: 'epFadeUp 0.45s ease-out 0.08s both', width: '100%', maxWidth: 360 }}>
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#0A0A0A', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>

          {/* Live badge */}
          <div className="flex items-center justify-center gap-2 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#22c55e' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#16a34a' }} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4ade80' }}>
              Tipo de cambio en vivo
            </span>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-2">
            <div className="flex flex-col items-center py-7 px-6"
              style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.4)' }}>Compramos</p>
              <p className="text-3xl font-black" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
                {compra > 0 ? compra.toFixed(3) : '—'}
              </p>
              <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>S/ por USD</p>
            </div>
            <div className="flex flex-col items-center py-7 px-6">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{ color: 'rgba(255,255,255,0.4)' }}>Vendemos</p>
              <p className="text-3xl font-black" style={{ color: '#60a5fa', letterSpacing: '-0.02em' }}>
                {venta > 0 ? venta.toFixed(3) : '—'}
              </p>
              <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>S/ por USD</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ animation: 'epFadeUp 0.45s ease-out 0.16s both', marginTop: 20, width: '100%', maxWidth: 360 }}>
        <Link
          href="/dashboard/empresa/nueva-operacion"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-black text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{ background: '#2563EB' }}
        >
          <RefreshCw className="w-4 h-4" />
          Iniciar operación
        </Link>
      </div>

    </div>
  );
}
