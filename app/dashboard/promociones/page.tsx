'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Gift, Users, ArrowRight, Lock, Zap, Tag, Star, TrendingUp, Check } from 'lucide-react';

export default function PromocionesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.document_type === 'RUC') {
      router.replace('/dashboard/empresa');
      return;
    }
    setIsLoading(false);
  }, [user?.document_type]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.2)' }}>
              Exclusivo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1.5" style={{ color: '#0D1117', letterSpacing: '-0.02em' }}>
            Promociones
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Beneficios diseñados para clientes Qoricash
          </p>
        </div>

        {/* ── Tarjeta activa: Código de Referido ── */}
        <div
          onClick={() => router.push('/dashboard/promociones/codigo-referido')}
          className="cursor-pointer group mb-4"
        >
          <div
            className="rounded-2xl overflow-hidden transition-all duration-200 group-hover:shadow-xl"
            style={{ background: '#0A0A0A', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Top badge */}
            <div className="px-6 pt-5 pb-0 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.25)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.4)' }}>
                Activo
              </span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Disponible ahora</span>
              </div>
            </div>

            {/* Main content */}
            <div className="px-6 pt-4 pb-5">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)' }}>
                      <Users className="w-5 h-5" style={{ color: '#60a5fa' }} />
                    </div>
                    <h2 className="text-xl font-black text-white leading-tight" style={{ letterSpacing: '-0.01em' }}>
                      Código de Referido
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Invita a tus contactos a Qoricash y gana beneficios exclusivos por cada operación que completen.
                  </p>
                </div>
              </div>

              {/* Benefits pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { icon: TrendingUp, label: '15 pips por operación' },
                  { icon: Tag, label: 'Cupones de descuento' },
                  { icon: Star, label: 'Sin límite de referidos' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <Icon className="w-3 h-3 flex-shrink-0" style={{ color: '#60a5fa' }} />
                    <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                  <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>Sin costo de activación</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all duration-200" style={{ color: '#60a5fa' }}>
                  <span>Ver detalles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563EB, #60a5fa, #2563EB)', backgroundSize: '200% 100%' }} />
          </div>
        </div>

        {/* ── Próximamente (locked cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            {
              icon: Zap,
              title: 'Cashback en operaciones',
              desc: 'Recupera un porcentaje de tu tipo de cambio en cada operación realizada.',
            },
            {
              icon: Gift,
              title: 'Club de beneficios',
              desc: 'Accede a tasas preferenciales y atención prioritaria según tu volumen.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center z-10" style={{ backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.6)' }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F1F5F9', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <Lock className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Próximamente</span>
                </div>
              </div>

              {/* Blurred content behind */}
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F1F5F9' }}>
                  <Icon className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                </div>
                <h3 className="text-sm font-bold" style={{ color: '#D1D5DB' }}>{title}</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#E5E7EB' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
          <Star className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
          <span>Las promociones son exclusivas para clientes verificados de Qoricash</span>
        </div>

      </div>
    </div>
  );
}
