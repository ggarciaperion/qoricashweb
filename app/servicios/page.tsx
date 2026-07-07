'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import {
  ArrowRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  CheckCircle,
  Clock,
  Globe,
  Calculator,
  ArrowLeftRight,
  Percent
} from 'lucide-react';

/* ── Imagen con overlay ──────────────────────────────────────────────── */
function ImageBanner({
  src,
  alt,
  overlay,
  height = 130,
  children,
}: {
  src: string;
  alt: string;
  overlay: string;
  height?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height }}>
      <img
        src={src}
        alt={alt}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: overlay }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: '0 28px' }}>
        {children}
      </div>
    </div>
  );
}

export default function Servicios() {
  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const id of ['compra', 'venta', 'tipo-cambio']) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const NAV_ITEMS = [
    { id: 'compra',      Icon: TrendingUp,  label: 'Compra de dólares', accent: '#22C55E' },
    { id: 'venta',       Icon: TrendingDown, label: 'Venta de dólares',  accent: '#3B82F6' },
    { id: 'tipo-cambio', Icon: Calculator,   label: 'Tipo de cambio',    accent: '#A78BFA' },
  ];

  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="QoriCash" style={{ height: 40 }} />
            <span className="font-display font-bold text-lg" style={{ color: '#fff' }}>QoriCash</span>
          </Link>
          <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background image — trading floor / forex screens */}
        <img
          src="https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.96) 0%, rgba(15,23,42,0.88) 60%, rgba(15,23,42,0.82) 100%)' }} />

        <div style={{ position: 'relative', padding: '56px 24px 48px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 reveal animate-fade-up">
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                Servicios
              </span>
              <h1
                className="font-display font-black mb-3"
                style={{ color: '#fff', fontSize: 38, letterSpacing: '-0.025em', lineHeight: 1.15 }}
              >
                Cambio de divisas<br />
                <span style={{ color: '#22C55E' }}>simple y seguro</span>
              </h1>
              <p className="text-sm max-w-lg mx-auto" style={{ color: '#64748B', lineHeight: 1.7 }}>
                Elige el servicio que mejor se adapta a tus necesidades
              </p>
            </div>

            {/* Section pills */}
            <div className="flex justify-center gap-3 flex-wrap reveal animate-fade-up stagger-1">
              {NAV_ITEMS.map(({ id, Icon, label, accent }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="flex items-center gap-2 text-xs font-semibold transition-all"
                  style={{
                    background: activeSection === id ? `${accent}18` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${activeSection === id ? `${accent}55` : 'rgba(255,255,255,0.08)'}`,
                    color: activeSection === id ? accent : '#94A3B8',
                    borderRadius: 99,
                    padding: '8px 18px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon style={{ width: 13, height: 13 }} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Compra ─────────────────────────────────────────────── */}
      <section id="compra" className="scroll-mt-16" style={{ padding: '56px 24px', background: '#fff' }}>
        <div className="max-w-5xl mx-auto">

          <div className="mb-8 reveal animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#22C55E' }}>01 — Compra de dólares</p>
            <h2 className="font-black text-2xl" style={{ color: '#0D1B2A', letterSpacing: '-0.02em' }}>
              QoriCash te compra tus dólares
            </h2>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
              Convierte USD a soles al mejor tipo de cambio del mercado
            </p>
          </div>

          {/* Steps + Example */}
          <div className="grid md:grid-cols-5 gap-5 mb-5 reveal animate-fade-up stagger-1">
            <div className="md:col-span-3 space-y-2">
              {[
                { n: '01', title: 'Tienes dólares',        desc: 'Cuentas con USD que quieres convertir a soles' },
                { n: '02', title: 'QoriCash te los compra', desc: 'Tipo de cambio competitivo y transparente'      },
                { n: '03', title: 'Recibes soles',          desc: 'En tu cuenta bancaria en menos de 10 minutos'   },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-center gap-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace' }}>
                    {n}
                  </span>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: '#0D1B2A' }}>{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-2" style={{ background: '#0D1B2A', borderRadius: 16, padding: '20px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#475569' }}>Ejemplo</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
                  <span className="text-xs" style={{ color: '#64748B' }}>Entregas</span>
                  <span className="font-black text-sm tabular-nums" style={{ color: '#fff' }}>$1,000 USD</span>
                </div>
                <div className="flex justify-center py-0.5">
                  <ArrowLeftRight style={{ width: 14, height: 14, color: '#334155' }} />
                </div>
                <div className="flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
                  <span className="text-xs" style={{ color: '#64748B' }}>TC compra</span>
                  <span className="font-bold text-sm tabular-nums" style={{ color: '#94A3B8' }}>S/ 3.750</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex justify-between items-center" style={{ borderRadius: 8, padding: '10px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <span className="text-xs font-medium" style={{ color: '#22C55E' }}>Recibes</span>
                  <span className="font-black text-xl tabular-nums" style={{ color: '#22C55E', letterSpacing: '-0.02em' }}>S/ 3,750</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image banner — dollar bills */}
          <div className="mb-5 reveal animate-fade-up stagger-2">
            <ImageBanner
              src="https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Billetes de dólar"
              overlay="linear-gradient(90deg, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.65) 50%, rgba(13,27,42,0.1) 100%)"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#22C55E' }}>Nuestro compromiso</p>
                <p className="font-black text-lg" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Sin costos ocultos</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Transferencia confirmada en menos de 10 minutos</p>
              </div>
            </ImageBanner>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7 reveal animate-fade-up stagger-3">
            {[
              { Icon: Zap,         label: 'Rapidez',      sub: '< 10 min'       },
              { Icon: TrendingUp,  label: 'Mejor tasa',   sub: 'Competitiva'    },
              { Icon: Shield,      label: 'Seguridad',    sub: 'Protegida'      },
              { Icon: CheckCircle, label: 'Transparente', sub: 'Sin comisiones' },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 14, height: 14, color: '#22C55E' }} />
                </div>
                <div>
                  <div className="font-semibold text-xs" style={{ color: '#0D1B2A' }}>{label}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal animate-fade-up stagger-4">
            <Link
              href={isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta'}
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ background: '#22C55E', color: '#fff', padding: '11px 24px', borderRadius: 10, boxShadow: '0 3px 12px rgba(34,197,94,0.3)' }}
            >
              {isAuthenticated ? 'Iniciar operación' : 'Abrir mi cuenta gratis'}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#E2E8F0', maxWidth: 900, margin: '0 auto' }} />

      {/* ── Venta ──────────────────────────────────────────────── */}
      <section id="venta" className="scroll-mt-16" style={{ padding: '56px 24px', background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">

          <div className="mb-8 reveal animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3B82F6' }}>02 — Venta de dólares</p>
            <h2 className="font-black text-2xl" style={{ color: '#0D1B2A', letterSpacing: '-0.02em' }}>
              QoriCash te vende dólares
            </h2>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
              Obtén USD con tus soles de forma rápida y sin comisiones
            </p>
          </div>

          {/* Steps + Example */}
          <div className="grid md:grid-cols-5 gap-5 mb-5 reveal animate-fade-up stagger-1">
            <div className="md:col-span-2" style={{ background: '#0D1B2A', borderRadius: 16, padding: '20px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#475569' }}>Ejemplo</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
                  <span className="text-xs" style={{ color: '#64748B' }}>Entregas</span>
                  <span className="font-black text-sm tabular-nums" style={{ color: '#fff' }}>S/ 3,770</span>
                </div>
                <div className="flex justify-center py-0.5">
                  <ArrowLeftRight style={{ width: 14, height: 14, color: '#334155' }} />
                </div>
                <div className="flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
                  <span className="text-xs" style={{ color: '#64748B' }}>TC venta</span>
                  <span className="font-bold text-sm tabular-nums" style={{ color: '#94A3B8' }}>S/ 3.770</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex justify-between items-center" style={{ borderRadius: 8, padding: '10px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>Recibes</span>
                  <span className="font-black text-xl tabular-nums" style={{ color: '#3B82F6', letterSpacing: '-0.02em' }}>$1,000 USD</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 space-y-2">
              {[
                { n: '01', title: 'Necesitas dólares',    desc: 'Para pagos, ahorros, viajes o negocios'           },
                { n: '02', title: 'QoriCash te los vende', desc: 'Al mejor tipo de cambio, sin comisiones ocultas' },
                { n: '03', title: 'Recibes USD',           desc: 'En tu cuenta bancaria en menos de 10 minutos'    },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-center gap-3" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px' }}>
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#3B82F6', fontFamily: 'monospace' }}>
                    {n}
                  </span>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: '#0D1B2A' }}>{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image banner — travel / international */}
          <div className="mb-5 reveal animate-fade-up stagger-2">
            <ImageBanner
              src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Viaje internacional"
              overlay="linear-gradient(90deg, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.65) 50%, rgba(13,27,42,0.1) 100%)"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3B82F6' }}>¿Para qué necesitas dólares?</p>
                <p className="font-black text-lg" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Viajes · Ahorros · Negocios</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>USD disponibles donde y cuando los necesites</p>
              </div>
            </ImageBanner>
          </div>

          {/* Use cases */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7 reveal animate-fade-up stagger-3">
            {[
              { Icon: Globe,       label: 'Viajes',   sub: 'Al extranjero'        },
              { Icon: DollarSign,  label: 'Ahorros',  sub: 'En moneda extranjera' },
              { Icon: CheckCircle, label: 'Pagos',    sub: 'Internacionales'      },
              { Icon: TrendingUp,  label: 'Negocios', sub: 'Proveedores externos' },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 14, height: 14, color: '#3B82F6' }} />
                </div>
                <div>
                  <div className="font-semibold text-xs" style={{ color: '#0D1B2A' }}>{label}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal animate-fade-up stagger-4">
            <Link
              href={isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta'}
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ background: '#1E293B', color: '#fff', padding: '11px 24px', borderRadius: 10, boxShadow: '0 3px 12px rgba(13,27,42,0.25)' }}
            >
              {isAuthenticated ? 'Iniciar operación' : 'Abrir mi cuenta gratis'}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#E2E8F0', maxWidth: 900, margin: '0 auto' }} />

      {/* ── Tipo de Cambio ─────────────────────────────────────── */}
      <section id="tipo-cambio" className="scroll-mt-16" style={{ padding: '56px 24px', background: '#fff' }}>
        <div className="max-w-5xl mx-auto">

          <div className="mb-8 reveal animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#A78BFA' }}>03 — Tipo de cambio</p>
            <h2 className="font-black text-2xl" style={{ color: '#0D1B2A', letterSpacing: '-0.02em' }}>
              ¿Cómo funciona el tipo de cambio?
            </h2>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
              Entiende las bases del mercado cambiario y la ventaja QoriCash
            </p>
          </div>

          {/* Definition + factors */}
          <div className="grid md:grid-cols-2 gap-5 mb-5 reveal animate-fade-up stagger-1">
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>Definición</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#475569' }}>
                El <strong style={{ color: '#0D1B2A' }}>tipo de cambio</strong> es el precio al que se convierte una moneda en otra — cuántos soles peruanos necesitas para obtener un dólar.
              </p>
              <div className="flex items-center justify-between" style={{ background: '#0D1B2A', borderRadius: 10, padding: '14px 16px' }}>
                <span className="text-xs" style={{ color: '#64748B' }}>1 USD equivale a</span>
                <span className="font-black text-2xl tabular-nums" style={{ color: '#22C55E', letterSpacing: '-0.02em' }}>S/ 3.750</span>
              </div>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#64748B' }}>Factores que influyen</p>
              <div className="space-y-2.5">
                {[
                  'Oferta y demanda del mercado',
                  'Política económica del país',
                  'Tasas de interés internacionales',
                  'Inflación y estabilidad económica',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: '#475569' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spread + Pips */}
          <div className="grid md:grid-cols-2 gap-5 mb-5 reveal animate-fade-up stagger-2">
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ width: 30, height: 30, borderRadius: 7, background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeftRight style={{ width: 13, height: 13, color: '#475569' }} />
                </div>
                <span className="font-black text-sm" style={{ color: '#0D1B2A' }}>Spread</span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>
                Diferencia entre el precio de <strong style={{ color: '#0D1B2A' }}>compra</strong> y <strong style={{ color: '#0D1B2A' }}>venta</strong>. Existe en todas las operaciones cambiarias.
              </p>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px' }}>
                {[
                  { label: 'TC Compra', value: 'S/ 3.750', color: '#22C55E' },
                  { label: 'TC Venta',  value: 'S/ 3.770', color: '#3B82F6' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center py-1.5">
                    <span className="text-xs" style={{ color: '#64748B' }}>{label}</span>
                    <span className="font-bold text-xs tabular-nums" style={{ color }}>{value}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#E2E8F0', margin: '6px 0' }} />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold" style={{ color: '#0D1B2A' }}>Spread</span>
                  <span className="font-black text-xs tabular-nums" style={{ color: '#0D1B2A' }}>S/ 0.020</span>
                </div>
              </div>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ width: 30, height: 30, borderRadius: 7, background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Percent style={{ width: 13, height: 13, color: '#475569' }} />
                </div>
                <span className="font-black text-sm" style={{ color: '#0D1B2A' }}>Pips</span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>
                Las <strong style={{ color: '#0D1B2A' }}>variaciones mínimas</strong> en el tipo de cambio. Representan el cuarto decimal en el precio de la moneda.
              </p>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px' }}>
                {[
                  { label: 'TC inicial', value: 'S/ 3.7500' },
                  { label: 'TC nuevo',   value: 'S/ 3.7525' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5">
                    <span className="text-xs" style={{ color: '#64748B' }}>{label}</span>
                    <span className="font-bold text-xs tabular-nums" style={{ color: '#0D1B2A' }}>{value}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#E2E8F0', margin: '6px 0' }} />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold" style={{ color: '#0D1B2A' }}>Variación</span>
                  <span className="font-black text-xs tabular-nums" style={{ color: '#22C55E' }}>+25 pips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ventaja QoriCash — image background */}
          <div className="mb-8 reveal animate-fade-up stagger-3" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <img
              src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Pantalla de trading financiero"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,18,35,0.97) 0%, rgba(15,23,42,0.92) 100%)' }} />
            <div style={{ position: 'relative', padding: '28px 24px' }}>
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  Ventaja QoriCash
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { Icon: CheckCircle, label: 'Sin sorpresas',      sub: 'El TC que ves es el que obtienes'                       },
                  { Icon: TrendingUp,  label: 'Tipos competitivos', sub: 'Mejor que bancos y casas de cambio tradicionales'        },
                  { Icon: Clock,       label: 'Tiempo real',        sub: 'Cotizaciones actualizadas constantemente según el mercado' },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon style={{ width: 14, height: 14, color: '#22C55E' }} />
                    </div>
                    <div>
                      <div className="font-bold text-xs mb-0.5" style={{ color: '#fff' }}>{label}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal animate-fade-up stagger-4">
            <Link
              href={isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta'}
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ background: '#22C55E', color: '#fff', padding: '11px 24px', borderRadius: 10, boxShadow: '0 3px 12px rgba(34,197,94,0.3)' }}
            >
              {isAuthenticated ? 'Iniciar operación' : 'Abrir mi cuenta gratis'}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px 32px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-3 hover:opacity-80 transition-opacity w-fit">
                <img src="/logo-principal.png" alt="QoriCash" style={{ height: 36 }} />
                <span className="font-display font-bold text-base" style={{ color: '#fff' }}>QoriCash</span>
              </Link>
              <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                Casa de cambio online en Perú. Seguridad, rapidez y los mejores tipos de cambio.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Servicios</p>
              <ul className="space-y-1.5 text-xs">
                {[
                  ['/servicios#compra',      'Compra de dólares'],
                  ['/servicios#venta',       'Venta de dólares' ],
                  ['/servicios#tipo-cambio', 'Tipo de cambio'   ],
                ].map(([href, label]) => (
                  <li key={href}><a href={href} className="transition-colors hover:text-white" style={{ color: '#475569' }}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Empresa</p>
              <ul className="space-y-1.5 text-xs">
                {[
                  ['/sobre-nosotros',       'Sobre nosotros'         ],
                  ['/terminos-condiciones', 'Términos y condiciones' ],
                  ['/politica-privacidad',  'Política de privacidad' ],
                  ['/politica-cookies',     'Política de cookies'    ],
                  ['/libro-reclamaciones',  'Libro de reclamaciones' ],
                ].map(([href, label]) => (
                  <li key={href}><Link href={href} className="transition-colors hover:text-white" style={{ color: '#475569' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Contacto</p>
              <ul className="space-y-2.5 text-xs" style={{ color: '#475569' }}>
                <li><a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors">info@qoricash.pe</a></li>
                <li><a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">910 624 404</a></li>
                <li style={{ lineHeight: 1.6 }}>Av. Brasil N° 2790, Int. 504<br />Lima – Pueblo Libre</li>
                <li style={{ lineHeight: 1.6 }}>Lun–Vie 9:00–18:00<br />Sáb 9:00–13:00</li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }} className="text-center">
            <p className="text-xs" style={{ color: '#334155' }}>© 2025 QoriCash. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
