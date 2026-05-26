'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/Calculator';
import AnimatedStat from '@/components/AnimatedStat';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import TradingViewWidget from '@/components/TradingViewWidget';
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  CheckCircle2,
  Smartphone,
  Lock,
  UserPlus,
  Calculator as CalculatorIcon,
  Banknote,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  Gift,
  Share2,
  Coins,
  Zap,
  Bell,
} from 'lucide-react';
import AlertaTCModal from '@/components/AlertaTCModal';
import AlertaTCBanner from '@/components/AlertaTCBanner';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isBanksSectionVisible, setIsBanksSectionVisible] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const banksSectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [savingsAmount, setSavingsAmount] = useState('1000');
  const [noticiasHome, setNoticiasHome] = useState<Array<{
    id: string; titulo: string; descripcion: string; categoria: string; fuente: string; fecha: string; destacada: boolean; imagen?: string;
  }>>([]);

  useEffect(() => {
    fetch('/api/noticias')
      .then((r) => r.json())
      .then((data) => setNoticiasHome(data.filter((n: { destacada: boolean }) => n.destacada).slice(0, 2)))
      .catch(() => {});
  }, []);

  const { currentRates } = useExchangeStore();

  const prevRatesRef = useRef<{ compra: number; venta: number } | null>(null);
  useEffect(() => {
    if (!currentRates) return;
    const compra = currentRates.tipo_compra;
    const venta = currentRates.tipo_venta;
    const prev = prevRatesRef.current;
    if (prev && prev.compra === compra && prev.venta === venta) return;
    prevRatesRef.current = { compra, venta };
    fetch('/api/alertas/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compra, venta }),
    }).catch(() => {});
  }, [currentRates]);

  const BCRP_REF = 3.39;
  const rateDirection: 'up' | 'down' | 'stable' | null = currentRates
    ? currentRates.tipo_venta > BCRP_REF + 0.005 ? 'up'
    : currentRates.tipo_venta < BCRP_REF - 0.005 ? 'down'
    : 'stable'
    : null;

  useEffect(() => {}, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setIsBanksSectionVisible(true); }); },
      { threshold: 0.2 }
    );
    if (banksSectionRef.current) observer.observe(banksSectionRef.current);
    return () => { if (banksSectionRef.current) observer.unobserve(banksSectionRef.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setLoggingOut(true);
    await new Promise((r) => setTimeout(r, 1100));
    await logout();
    window.location.href = '/';
  };

  const qoriCompra = currentRates ? currentRates.tipo_compra : parseFloat(buyRate);
  const qoriVenta  = currentRates ? currentRates.tipo_venta  : parseFloat(sellRate);

  const BANKS = [
    { name: 'BCP',        compra: 3.680, venta: 3.815 },
    { name: 'BBVA',       compra: 3.675, venta: 3.825 },
    { name: 'Scotiabank', compra: 3.665, venta: 3.835 },
    { name: 'Interbank',  compra: 3.685, venta: 3.808 },
  ];

  const usd = parseFloat(savingsAmount) || 0;
  const savingVsBCP  = ((BANKS[0].venta - qoriVenta) * usd).toFixed(2);
  const savingBest   = ((Math.min(...BANKS.map((b) => b.venta)) - qoriVenta) * usd).toFixed(2);

  return (
    <>
      {loggingOut && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white animate-fade-in">
          <div className="flex flex-col items-center gap-5">
            <img src="/logo-principal.png" alt="QoriCash" className="h-16 w-auto animate-logo-exit" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-secondary font-bold text-sm tracking-wide animate-slide-up-fade">Cerrando sesión...</p>
              <div className="flex gap-1.5 animate-slide-up-fade">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <main className="min-h-screen bg-white">

        {/* ────────────────────────────────────────
            LIVE RATE BAR
        ──────────────────────────────────────── */}
        <div className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between h-9 text-[11px] text-gray-500">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                  EN VIVO
                </span>
                <span>
                  Compra <strong className="text-gray-900 font-mono text-xs ml-1">S/ {qoriCompra.toFixed(3)}</strong>
                </span>
                <span>
                  Venta <strong className="text-primary-600 font-mono text-xs ml-1">S/ {qoriVenta.toFixed(3)}</strong>
                </span>
                {rateDirection === 'up'   && <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />}
                {rateDirection === 'down' && <TrendingDown  className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <span className="hidden md:block text-gray-400">Lun – Vie 9:00 – 18:00 &nbsp;·&nbsp; Sáb 9:00 – 13:00</span>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────
            HEADER
        ──────────────────────────────────────── */}
        <header className={`fixed top-9 w-full z-40 transition-all duration-300 ${navScrolled ? 'bg-white/98 backdrop-blur-md shadow-[0_1px_0_0_#f0f0f0]' : 'bg-white/95 backdrop-blur-md'}`}>
          <nav className="w-full px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between h-16">

              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src="/logo-principal.png" alt="QoriCash" className="h-8 w-auto" />
                <span className="text-xl font-display font-bold tracking-tight text-gray-900">QoriCash</span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {[
                  { href: '/nosotros', label: 'Nosotros' },
                  { href: '/#como-funciona', label: 'Cómo funciona' },
                  { href: '/noticias', label: 'Noticias' },
                  { href: '/dashboard/promociones', label: 'Promociones' },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-primary-600" />
                      </div>
                      <span>{user.primer_nombre || user.email}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50">
                          <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl mx-1" onClick={() => setIsUserMenuOpen(false)}>
                            <UserIcon className="w-4 h-4 text-gray-400" /> Mi cuenta
                          </Link>
                          <Link href="/dashboard/nueva-operacion" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl mx-1" onClick={() => setIsUserMenuOpen(false)}>
                            <Banknote className="w-4 h-4 text-gray-400" /> Nueva operación
                          </Link>
                          <div className="h-px bg-gray-100 mx-3 my-1" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl mx-1">
                            <LogOut className="w-4 h-4" /> Cerrar sesión
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/iniciar-sesion" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
                      Iniciar sesión
                    </Link>
                    <Link href="/crear-cuenta" className="text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl transition-colors">
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-500">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {isMobileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="absolute left-0 right-0 top-16 bg-white border-t border-gray-100 shadow-xl z-50 py-5 px-6 rounded-b-2xl">
                  <div className="flex flex-col gap-1">
                    {['/nosotros', '/#como-funciona', '/noticias', '/dashboard/promociones'].map((href, i) => (
                      <Link key={href} href={href} className="py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                        {['Nosotros', 'Cómo funciona', 'Noticias', 'Promociones'][i]}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-3 pt-4 flex flex-col gap-2">
                      {isAuthenticated ? (
                        <>
                          <Link href="/dashboard" className="py-2.5 text-sm font-medium text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Mi cuenta</Link>
                          <button onClick={handleLogout} className="text-left py-2.5 text-sm text-red-500 font-medium">Cerrar sesión</button>
                        </>
                      ) : (
                        <>
                          <Link href="/iniciar-sesion" className="py-2.5 text-sm font-medium text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>Iniciar sesión</Link>
                          <Link href="/crear-cuenta" className="py-2.5 text-sm font-bold text-primary-600" onClick={() => setIsMobileMenuOpen(false)}>Crear cuenta gratis →</Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </nav>
        </header>

        {/* ────────────────────────────────────────
            HERO
        ──────────────────────────────────────── */}
        <section className="pt-[100px] min-h-screen flex items-center bg-white">
          <div className="w-full px-6 sm:px-8 lg:px-12 py-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">

              {/* Left */}
              <div className="max-w-2xl">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold text-gray-600 tracking-wide">
                  <Shield className="w-3.5 h-3.5 text-primary-500" />
                  Regulado SBS · Res. N° 00313-2026 · RUC 20615113698
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-gray-950 leading-[1.05] tracking-tight mb-6">
                  Cambia dólares.<br />
                  <span className="text-primary-500">Sin perder ni un sol.</span>
                </h1>

                <p className="text-gray-500 text-xl mb-10 leading-relaxed max-w-lg">
                  La casa de cambio digital con el mejor tipo de cambio del Perú. Sin comisiones. En menos de 15 minutos.
                </p>

                {/* Rate display — premium terminal style */}
                <div className="flex items-stretch gap-4 mb-10">
                  <div className="flex-1 border border-gray-200 rounded-2xl p-5 bg-[#FAFAF8]">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">Compramos USD</p>
                    <p className="text-4xl font-bold text-gray-900 font-mono tracking-tight">
                      S/ <span>{qoriCompra.toFixed(3)}</span>
                    </p>
                  </div>
                  <div className="flex-1 border-2 border-primary-500 rounded-2xl p-5 bg-primary-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl tracking-widest">
                      MEJOR PRECIO
                    </div>
                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.15em] mb-2">Vendemos USD</p>
                    <p className="text-4xl font-bold text-primary-600 font-mono tracking-tight">
                      S/ <span>{qoriVenta.toFixed(3)}</span>
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link
                    href={isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta'}
                    className="inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-gray-950/10 group"
                  >
                    {isAuthenticated ? 'Iniciar operación' : 'Abrir mi cuenta gratis'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <a
                    href="https://wa.me/51926011920?text=Hola%2C%20quiero%20cambiar%20d%C3%B3lares"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-base transition-all hover:shadow-sm"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    926 011 920
                  </a>
                </div>

                {/* Trust row */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary-400" /> Sin comisiones</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-400" /> Menos de 15 minutos</span>
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-primary-400" /> 100% seguro y cifrado</span>
                  <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-primary-400" /> Sin ir al banco</span>
                </div>
              </div>

              {/* Right: Calculator */}
              <div>
                <Calculator />
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            STATS — borderless, numbers as heroes
        ──────────────────────────────────────── */}
        <section className="bg-[#F8F8F6] py-14 border-y border-gray-100 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 8500,  suffix: '+',  prefix: '',   label: 'Clientes activos' },
                { value: 18,    suffix: 'M+', prefix: 'S/', label: 'Soles procesados' },
                { value: 4200,  suffix: '+',  prefix: '',   label: 'Operaciones' },
                { value: 4.8,   suffix: '★',  prefix: '',   label: 'Calificación Google' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-display font-bold text-gray-950 mb-1 tracking-tight">
                    {s.prefix && <span className="text-primary-500">{s.prefix}</span>}
                    <AnimatedStat value={s.value} />
                    <span className="text-primary-500">{s.suffix}</span>
                  </p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            BANKS
        ──────────────────────────────────────── */}
        <section ref={banksSectionRef} className="bg-white py-10 border-b border-gray-100 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-7">
                Transferencias con todos los bancos del Perú
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { title: 'Inmediatas', banks: ['BCP', 'INTERBANK', 'BANBIF'], note: 'Mismo banco · Segundos' },
                  { title: 'Interbancarias', banks: ['BBVA', 'SCOTIABANK', 'PICHINCHA', 'OTROS'], note: 'CCI requerido · 30–60 min' },
                ].map((g, gi) => (
                  <div key={gi} className={`border border-gray-100 rounded-2xl p-5 transition-all duration-500 delay-${gi * 100} ${isBanksSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{g.title}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {g.banks.map((b) => (
                        <span key={b} className={`px-3 py-1.5 text-xs font-bold rounded-full ${gi === 0 ? 'bg-primary-50 text-primary-700' : 'bg-gray-50 text-gray-600'}`}>{b}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{g.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            RATE COMPARISON + SAVINGS CALCULATOR
        ──────────────────────────────────────── */}
        <section className="bg-[#F8F8F6] py-20 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">

              {/* Header */}
              <div className="mb-12">
                <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-3">Comparación</p>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-950 leading-tight tracking-tight">
                    Cuánto pierdes<br />con tu banco.
                  </h2>
                  <p className="text-sm text-gray-400 max-w-xs text-right hidden sm:block">
                    {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Entidad</th>
                        <th className="text-center px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Compra</th>
                        <th className="text-center px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Venta</th>
                        <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Diferencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* QoriCash */}
                      <tr className="border-b border-primary-100 bg-primary-50/60">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            <span className="font-bold text-gray-900">QoriCash</span>
                            <span className="text-[10px] font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full tracking-wide">MEJOR</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-900 font-mono">{qoriCompra.toFixed(3)}</td>
                        <td className="px-6 py-4 text-center font-bold text-primary-600 font-mono">{qoriVenta.toFixed(3)}</td>
                        <td className="px-6 py-4 text-right hidden sm:table-cell">
                          <span className="text-emerald-600 font-bold text-xs">Referencia</span>
                        </td>
                      </tr>
                      {BANKS.map((bank) => {
                        const diff = ((bank.venta - qoriVenta) * 1000).toFixed(2);
                        return (
                          <tr key={bank.name} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-3.5 text-gray-600 font-medium">{bank.name}</td>
                            <td className="px-6 py-3.5 text-center text-gray-400 font-mono">{bank.compra.toFixed(3)}</td>
                            <td className="px-6 py-3.5 text-center text-gray-400 font-mono">{bank.venta.toFixed(3)}</td>
                            <td className="px-6 py-3.5 text-right hidden sm:table-cell">
                              <span className="text-xs text-red-500 font-semibold">−S/ {diff} x $1K</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="px-6 py-3 text-xs text-gray-400 border-t border-gray-50 bg-gray-50/50">
                    Tasas bancarias son referenciales y orientativas.
                  </p>
                </div>

                {/* Savings calculator */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Calculadora</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-5">Tu ahorro real</h3>

                  <div className="mb-5">
                    <label className="text-xs text-gray-500 font-medium mb-2 block">¿Cuántos dólares cambias?</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        value={savingsAmount}
                        onChange={(e) => setSavingsAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3.5 border-2 border-gray-200 focus:border-primary-400 rounded-xl text-2xl font-bold text-gray-900 outline-none transition-colors font-mono"
                        placeholder="1000"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <p className="text-xs text-emerald-700 font-medium mb-1">Ahorras vs BCP</p>
                      <p className="text-3xl font-bold text-emerald-700 font-mono">
                        S/ {parseFloat(savingVsBCP) > 0 ? savingVsBCP : '0.00'}
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Vs mejor banco del día</p>
                      <p className="text-xl font-bold text-gray-700 font-mono">
                        S/ {parseFloat(savingBest) > 0 ? savingBest : '0.00'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta'}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-sm transition-all group"
                  >
                    {isAuthenticated ? 'Cambiar ahora' : 'Empezar a ahorrar'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            TRADINGVIEW
        ──────────────────────────────────────── */}
        <section className="bg-white py-20 border-t border-gray-100 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-2">Mercado</p>
                  <h2 className="text-3xl font-display font-bold text-gray-950 tracking-tight">USD/PEN en tiempo real</h2>
                </div>
                <Link href="/noticias" className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group">
                  Noticias del mercado <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <TradingViewWidget />
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            FEATURES — horizontal list
        ──────────────────────────────────────── */}
        <section className="bg-[#F8F8F6] py-20 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-3">Por qué elegirnos</p>
                <h2 className="text-4xl font-display font-bold text-gray-950 tracking-tight">Lo que nos diferencia.</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Shield,     n: '01', title: 'Regulado por la SBS', desc: 'Res. N° 00313-2026. Operamos bajo supervisión formal del sistema financiero peruano.' },
                  { icon: Clock,      n: '02', title: 'En menos de 15 min',  desc: 'Confirmamos y enviamos tu dinero en tiempo récord. Sin esperas, sin excusas.' },
                  { icon: TrendingUp, n: '03', title: 'Mejor tipo de cambio', desc: 'Ahorra hasta S/ 80 por cada $1,000 comparado con cualquier banco del Perú.' },
                  { icon: Smartphone, n: '04', title: '100% digital',        desc: 'Opera desde tu celular, tablet o computadora. Sin ir al banco, sin colas.' },
                ].map((f, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition-all group">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                        <f.icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <span className="text-3xl font-bold text-gray-100 font-mono">{f.n}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            NEWS
        ──────────────────────────────────────── */}
        {noticiasHome.length > 0 && (
          <section className="bg-white py-20 border-t border-gray-100 reveal">
            <div className="w-full px-6 sm:px-8 lg:px-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-2">Noticias</p>
                    <h2 className="text-4xl font-display font-bold text-gray-950 tracking-tight">Mercado hoy.</h2>
                  </div>
                  <Link href="/noticias" className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 group transition-colors">
                    Ver todas <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {noticiasHome.map((n) => (
                    <Link key={n.id} href={`/noticias/${n.id}`} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all">
                      {n.imagen && (
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                          <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{n.fuente}</span>
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{n.categoria}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary-700 transition-colors line-clamp-2 text-base">
                          {n.titulo}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-auto pt-2">{n.descripcion}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ────────────────────────────────────────
            ALERTA TC
        ──────────────────────────────────────── */}
        {!isAuthenticated && <AlertaTCBanner />}

        {/* ────────────────────────────────────────
            HOW IT WORKS
        ──────────────────────────────────────── */}
        <section id="como-funciona" className="bg-[#F8F8F6] py-20 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-3">Proceso</p>
                <h2 className="text-4xl font-display font-bold text-gray-950 tracking-tight">Cambiar dólares<br />en 3 pasos.</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { n: '01', icon: UserPlus,      title: 'Crea tu cuenta',       desc: 'Solo tu DNI y un correo. Verificación única, gratuita, en 2 minutos.',     tag: '2 min · Solo la primera vez' },
                  { n: '02', icon: CalculatorIcon, title: 'Cotiza y transfiere',  desc: 'Ve el tipo de cambio en tiempo real, confirma y transfiere desde tu banco.', tag: 'Mínimo S/ 100 o $ 30' },
                  { n: '03', icon: Banknote,       title: 'Recibe tu dinero',     desc: 'Confirmamos tu pago y enviamos el dinero directo a tu cuenta bancaria.',     tag: 'En menos de 15 minutos' },
                ].map((s, i) => (
                  <div key={i} className="relative bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-all">
                    <span className="absolute top-5 right-5 text-5xl font-bold text-gray-50 font-mono select-none">{s.n}</span>
                    <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mb-5 shadow-md shadow-primary-500/20">
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                    <span className="inline-block text-[11px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full tracking-wide">{s.tag}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href={isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta'}
                  className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-gray-950/10 group"
                >
                  {isAuthenticated ? 'Iniciar mi operación' : 'Crear cuenta y empezar'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <p className="text-xs text-gray-400 mt-3 font-medium">Sin costos de apertura · Sin saldo mínimo</p>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            REFERIDOS
        ──────────────────────────────────────── */}
        <section className="bg-white py-20 border-t border-gray-100 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-3">Referidos</p>
                <h2 className="text-4xl font-display font-bold text-gray-950 tracking-tight leading-tight mb-5">
                  Gana descuentos<br />por recomendar.
                </h2>
                <p className="text-gray-500 text-base mb-7 leading-relaxed">
                  Comparte tu código único. Por cada operación que complete tu referido, acumulas <strong className="text-gray-800">15 pips</strong>. Con 30 pips, obtienes un cupón de descuento real en tu próxima operación.
                </p>
                <div className="flex items-center gap-4 p-5 border border-gray-100 rounded-2xl bg-[#F8F8F6] w-fit mb-7">
                  <Gift className="w-9 h-9 text-primary-500 flex-shrink-0" />
                  <div>
                    <p className="text-3xl font-bold text-gray-900 font-mono">30 pips</p>
                    <p className="text-xs text-gray-500 font-medium">= cupón de descuento en tu próxima operación</p>
                  </div>
                </div>
                <Link
                  href={isAuthenticated ? '/dashboard/promociones' : '/crear-cuenta'}
                  className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white px-7 py-4 rounded-xl font-bold text-sm transition-all group"
                >
                  {isAuthenticated ? 'Ver mi código' : 'Registrarme y empezar'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Share2, n: '01', title: 'Comparte tu código único',         desc: 'Al registrarte recibes un código personal que puedes compartir con quien quieras.' },
                  { icon: UserPlus, n: '02', title: 'Tu referido crea su cuenta',     desc: 'Ingresa tu código al registrarse. Es gratis y no tiene condiciones ocultas.' },
                  { icon: Coins, n: '03', title: 'Acumulas pips automáticamente',  desc: '15 pips por cada operación completada. Sin límite de referidos ni fecha de vencimiento.' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all bg-[#FAFAF8]">
                    <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Paso {s.n}</span>
                      </div>
                      <h4 className="text-gray-900 font-bold text-sm mb-1">{s.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            FAQ
        ──────────────────────────────────────── */}
        <section id="faq" className="bg-[#F8F8F6] py-20 reveal">
          <div className="w-full px-6 sm:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10">
                <p className="text-[11px] font-bold text-primary-500 uppercase tracking-[0.18em] mb-3">FAQ</p>
                <h2 className="text-4xl font-display font-bold text-gray-950 tracking-tight">Preguntas frecuentes.</h2>
                <p className="text-gray-400 text-sm mt-3">
                  ¿Más dudas? Escríbenos por{' '}
                  <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">WhatsApp</a>.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { q: '¿Cuánto tiempo tarda una operación?', a: 'La mayoría se completan en menos de 15 minutos. BCP, Interbank y BanBif son casi inmediatas; las interbancarias (BBVA, Scotiabank) tardan entre 30 y 60 minutos dependiendo de la hora.' },
                  { q: '¿Es seguro cambiar con QoriCash?', a: 'Sí. Operamos con Resolución SBS N° 00313-2026. Cada operación requiere verificación de identidad, tus datos están cifrados y todas las transacciones quedan registradas con trazabilidad completa.' },
                  { q: '¿Cuáles son las comisiones?', a: 'Ninguna. No cobramos comisiones de apertura ni por operación. La única diferencia es el spread (diferencial compra-venta), que es significativamente menor al de los bancos.' },
                  { q: '¿Cuál es el monto mínimo y máximo?', a: (
                    <span>Mínimo S/ 100 o $30. No hay máximo fijo: para operaciones corporativas o montos grandes, contáctanos por <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">WhatsApp al 926 011 920</a> para condiciones preferenciales.</span>
                  )},
                  { q: '¿Qué documentos necesito para registrarme?', a: 'Solo tu DNI (CE para extranjeros, RUC para empresas), un correo y tu número de celular. La verificación de identidad se hace una única vez, antes de tu primera operación.' },
                  { q: '¿Puedo operar desde provincia?', a: 'Sí. QoriCash es 100% digital. Opera desde cualquier ciudad del Perú siempre que tengas acceso a la banca online de tu banco.' },
                ].map((item, i) => (
                  <div key={i} className={`bg-white rounded-2xl border overflow-hidden transition-all ${openFaq === i ? 'border-primary-200' : 'border-gray-100 hover:border-gray-200'}`}>
                    <button
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
                      <ChevronDown className={`flex-shrink-0 w-4 h-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-primary-500' : 'text-gray-300'}`} />
                    </button>
                    <div className={`faq-body ${openFaq === i ? 'open' : ''}`}>
                      <div>
                        <div className="px-6 pb-5">
                          <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────
            FOOTER
        ──────────────────────────────────────── */}
        <footer className="bg-gray-950 text-gray-400">
          {/* Compliance */}
          <div className="border-b border-white/5 py-4 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="border border-white/8 rounded-xl px-4 py-2 flex items-center gap-2.5">
                  <Shield className="w-3.5 h-3.5 text-primary-400" />
                  <div>
                    <p className="text-white font-bold text-[11px]">Empresa Registrada</p>
                    <p className="text-gray-500 text-[10px]">RUC 20615113698 · Lima, Perú</p>
                  </div>
                </div>
                <div className="border border-white/8 rounded-xl px-4 py-2 flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <p className="text-white font-bold text-[11px]">Regulada SBS</p>
                    <p className="text-gray-500 text-[10px]">Res. N° 00313-2026</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 text-[11px] text-gray-600">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Datos protegidos</span>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="w-full px-6 sm:px-8 lg:px-12 py-14">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
              <div>
                <Link href="/" className="flex items-center gap-2.5 mb-5 hover:opacity-80 transition-opacity w-fit">
                  <img src="/logo-principal.png" alt="QoriCash" className="h-9 w-auto" />
                  <span className="text-xl font-display font-bold text-white">QoriCash</span>
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Casa de cambio digital regulada por la SBS. Los mejores tipos de cambio del Perú, sin comisiones.
                </p>
              </div>
              {[
                {
                  title: 'Servicios',
                  links: [
                    { href: '/servicios#compra',       label: 'Compra de dólares' },
                    { href: '/servicios#venta',        label: 'Venta de dólares' },
                    { href: '/servicios#tipo-cambio',  label: 'Tipo de cambio' },
                  ]
                },
                {
                  title: 'Empresa',
                  links: [
                    { href: '/sobre-nosotros',          label: 'Sobre nosotros' },
                    { href: '/terminos-condiciones',    label: 'Términos y condiciones' },
                    { href: '/politica-privacidad',     label: 'Política de privacidad' },
                    { href: '/politica-cookies',        label: 'Política de cookies' },
                    { href: '/libro-reclamaciones',     label: 'Libro de reclamaciones' },
                  ]
                },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-white font-bold mb-4 text-[11px] uppercase tracking-[0.15em]">{col.title}</h4>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map((l) => (
                      <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <h4 className="text-white font-bold mb-4 text-[11px] uppercase tracking-[0.15em]">Contacto</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors flex items-center gap-2.5"><span className="w-4 h-4 text-primary-400 flex-shrink-0">@</span>info@qoricash.pe</a></li>
                  <li>
                    <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      926 011 920
                    </a>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors leading-relaxed text-xs">
                      Av. Brasil N° 2790, Int. 504<br />Lima – Pueblo Libre
                    </a>
                  </li>
                  <li className="text-xs text-gray-500 leading-relaxed">
                    Lun–Vie 9:00–18:00 &nbsp;·&nbsp; Sáb 9:00–13:00
                  </li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
              <p>© 2025 QoriCash. Todos los derechos reservados.</p>
              <div className="flex items-center gap-5">
                <Link href="/terminos-condiciones" className="hover:text-gray-400 transition-colors">Términos</Link>
                <Link href="/politica-privacidad" className="hover:text-gray-400 transition-colors">Privacidad</Link>
                <Link href="/libro-reclamaciones" className="hover:text-gray-400 transition-colors">Reclamaciones</Link>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
