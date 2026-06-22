'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/Calculator';
import AnimatedStat from '@/components/AnimatedStat';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import {
  ArrowRight, Shield, Clock, TrendingUp, TrendingDown, Minus,
  Users, CheckCircle2, Lock, UserPlus, Banknote,
  LogOut, User as UserIcon, ChevronDown, Menu, X,
  HelpCircle, Gift, Calculator as CalculatorIcon,
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
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const BANK_ACCOUNTS = {
    bcp:       { soles: '1937353150041',   dolares: '1917357790119'   },
    interbank: { soles: '200-3007757571',  dolares: '200-3007757589'  },
    banbif:    { soles: '007000845805',    dolares: '007000845813'    },
  } as const;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, ''));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };
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
      : currentRates.tipo_venta < BCRP_REF - 0.005 ? 'down' : 'stable'
    : null;

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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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

    <main className="min-h-screen">
      {/* ══ NAVBAR ══ */}
      <header className={`fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 transition-all duration-300 ${navScrolled ? 'nav-scrolled' : ''}`}>
        <nav className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity">
              <img src="/logo-principal.png" alt="QoriCash" className="h-10 sm:h-14 md:h-16 w-auto" />
              <span className="text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight" style={{ color: '#0D1B2A' }}>Qoricash</span>
            </Link>
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { href: '/sobre-nosotros', label: 'Nosotros', isLink: true },
                { href: '#como-funciona',  label: 'Cómo Funciona', isLink: false },
                { href: '/noticias',       label: 'Noticias', isLink: true },
                { href: '/dashboard/promociones', label: 'Promociones', isLink: true },
              ].map(({ href, label, isLink }) => {
                const cls = 'relative text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 group py-1';
                const inner = (
                  <>
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                  </>
                );
                return isLink
                  ? <Link key={href} href={href} className={cls}>{inner}</Link>
                  : <a key={href} href={href} className={cls}>{inner}</a>;
              })}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {user && (
                    <AlertaTCModal
                      user={user}
                      currentCompra={currentRates?.tipo_compra}
                      currentVenta={currentRates?.tipo_venta}
                    />
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="relative flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 group py-1"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>
                        {user?.document_type === 'RUC'
                          ? user?.razon_social || user?.nombres
                          : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login" className="relative text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200 group py-1">
                    Iniciar Sesión
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-500 rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                  <Link href="/crear-cuenta" className="text-sm font-bold bg-primary-600 text-white px-5 py-2 rounded-full hover:bg-primary-700 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary-200">
                    Regístrate
                  </Link>
                </>
              )}
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition" aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[45] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(15,23,42,0.5)' }}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed left-0 right-0 z-[49] bg-white shadow-2xl rounded-b-3xl overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ top: '80px', maxHeight: isMobileMenuOpen ? '82vh' : '0px', transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease-out' }}
      >
        <div className="px-4 pt-5 pb-7 overflow-y-auto" style={{ maxHeight: '82vh' }}>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-2 mb-2">Menú</p>
          <div className="space-y-1 mb-4">
            {[
              { href: '/sobre-nosotros',        label: 'Nosotros',      Icon: Users,        iconCls: 'text-blue-600',   bgCls: 'bg-blue-50'    },
              { href: '#como-funciona',         label: 'Cómo Funciona', Icon: CheckCircle2, iconCls: 'text-primary-600', bgCls: 'bg-primary-50', isAnchor: true },
              { href: '/noticias',              label: 'Noticias',      Icon: TrendingUp,   iconCls: 'text-amber-600',  bgCls: 'bg-amber-50'   },
              { href: '/dashboard/promociones', label: 'Promociones',   Icon: Gift,         iconCls: 'text-violet-600', bgCls: 'bg-violet-50'  },
            ].map(({ href, label, Icon, iconCls, bgCls, isAnchor }) => {
              const cls = 'flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl group transition-colors';
              const inner = (
                <>
                  <div className={`w-9 h-9 rounded-xl ${bgCls} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${iconCls}`} />
                  </div>
                  <span className="font-medium flex-1">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </>
              );
              return isAnchor
                ? <a key={href} href={href} className={cls} onClick={() => setIsMobileMenuOpen(false)}>{inner}</a>
                : <Link key={href} href={href} className={cls} onClick={() => setIsMobileMenuOpen(false)}>{inner}</Link>;
            })}
          </div>
          <div className="border-t border-gray-100 pt-4">
            {isAuthenticated ? (
              <>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-2 mb-2">Mi Cuenta</p>
                <div className="space-y-1">
                  <Link href="/perfil" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl group transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><UserIcon className="w-4 h-4 text-gray-600" /></div>
                    <span className="font-medium flex-1">Mi perfil</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl group transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Banknote className="w-4 h-4 text-gray-600" /></div>
                    <span className="font-medium flex-1">Mi Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <a href="https://wa.me/51926011920?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl group transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0"><HelpCircle className="w-4 h-4 text-primary-600" /></div>
                    <span className="font-medium flex-1">Ayuda</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                  </a>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0"><LogOut className="w-4 h-4 text-red-500" /></div>
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/login" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-xl group transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Lock className="w-4 h-4 text-gray-600" /></div>
                  <span className="font-medium flex-1">Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link href="/crear-cuenta" className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:from-primary-700 hover:to-primary-800 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                  <UserPlus className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">Regístrate gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User dropdown portal */}
      {isUserMenuOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsUserMenuOpen(false)} />
          <div className="fixed right-8 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2" style={{ zIndex: 99999, top: '80px' }}>
            <button onClick={() => { setIsUserMenuOpen(false); router.push('/perfil'); }} className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition text-left">
              <UserIcon className="w-5 h-5 mr-3" />Mi perfil
            </button>
            <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }} className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition text-left">
              <TrendingUp className="w-5 h-5 mr-3" />Mi Dashboard
            </button>
            <a href="https://wa.me/51926011920?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash." target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition" onClick={() => setIsUserMenuOpen(false)}>
              <HelpCircle className="w-5 h-5 mr-3" />Ayuda
            </a>
            <div className="border-t border-gray-200 my-1" />
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition text-left">
              <LogOut className="w-5 h-5 mr-3" />Cerrar Sesión
            </button>
          </div>
        </>,
        document.body
      )}

      {/* ══════════════════════════════════════
          HERO — Geométrico minimalista
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden pt-20">

        <div className="flex-1 flex items-center w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center w-full">

            {/* LEFT — Texto */}
            <div className="order-2 lg:order-1">
              {/* Pill label */}
              <span className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border text-[11px] font-bold tracking-[0.18em] uppercase" style={{ borderColor: 'rgba(13,27,42,0.12)', color: 'rgba(13,27,42,0.5)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                Casa de Cambio Digital · Perú
              </span>

              <h1 className="font-display font-black leading-[1.05] mb-6" style={{ color: '#0D1B2A' }}>
                <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>El cambio de dólares</span>
                <span className="block text-primary" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>que siempre</span>
                <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>quisiste tener</span>
              </h1>

              <p className="text-base sm:text-lg max-w-[440px] mb-9 leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>
                Personas y empresas cambian millones de soles con QoriCash.
                Rápido, seguro y sin comisiones ocultas.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/operaciones/nueva"
                  className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full transition-all text-sm text-white hover:-translate-y-0.5"
                  style={{ background: '#0D1B2A', boxShadow: '0 8px 24px rgba(13,27,42,0.25)' }}
                >
                  Cotizar ahora
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/51926011920"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full transition-all text-sm hover:border-opacity-50"
                  style={{ border: '2px solid rgba(13,27,42,0.15)', color: 'rgba(13,27,42,0.65)' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="#22C55E" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-medium" style={{ color: 'rgba(13,27,42,0.4)' }}>
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" />Regulada SBS</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />En 15 minutos</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" />0 comisiones</span>
              </div>
            </div>

            {/* RIGHT — Calculadora */}
            <div className="order-1 lg:order-2 relative flex items-center justify-center" style={{ minHeight: '500px' }}>

              {/* Calculator */}
              <div className="relative z-10 w-full max-w-[400px]">
                <Calculator
                  initialRates={{ compra: parseFloat(buyRate), venta: parseFloat(sellRate) }}
                  showContinueButton={true}
                  onOperationReady={() => {
                    router.push(isAuthenticated ? '/dashboard' : '/crear-cuenta');
                  }}
                />

                {/* Mercado en Vivo button — oculto temporalmente */}
                {/* <Link
                  href="/mercado-en-vivo"
                  className="mt-3 flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(34,197,94,0.08)',
                    border: '1.5px solid rgba(34,197,94,0.3)',
                    color: '#16a34a',
                  }}
                >
                  <span className="relative flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary-500 inline-block"></span>
                    <span className="absolute w-2 h-2 rounded-full bg-primary-500 animate-ping inline-block"></span>
                  </span>
                  Mercado en Vivo
                  <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)' }}>
                    BETA
                  </span>
                </Link> */}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════
          TRUST STRIP — Bancos + SBS mejorado
      ══════════════════════════════════════ */}
      <section ref={banksSectionRef} className="py-0" style={{ borderBottom: '1px solid rgba(13,27,42,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">

          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-7">
            <div className="flex items-center gap-3">
              <span className="w-5 h-px bg-primary inline-block" />
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: 'rgba(13,27,42,0.4)' }}>
                Trabajamos con los principales bancos del Perú
              </p>
            </div>
            {/* Badge SBS */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl" style={{
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.12)' }}>
                <Shield className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5 text-primary">Empresa regulada</div>
                <div className="text-xs font-black leading-none" style={{ color: '#0D1B2A' }}>SBS Perú · Res. N° 00313-2026</div>
              </div>
            </div>
          </div>

          {/* Logos bancos — 4 cards con stagger reveal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* BCP */}
            {(() => {
              const hovered = hoveredBank === 'bcp';
              const acc = BANK_ACCOUNTS.bcp;
              return (
                <div
                  className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(34,197,94,0.35)' : 'rgba(13,27,42,0.08)'}`,
                    minHeight: '110px',
                    transitionDelay: isBanksSectionVisible ? '0ms' : '0ms',
                    transform: hovered ? 'translateY(-6px) scale(1.04)' : 'translateY(0px) scale(1)',
                    boxShadow: hovered ? '0 16px 40px rgba(34,197,94,0.18), 0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                    background: hovered ? 'rgba(34,197,94,0.04)' : 'transparent',
                    zIndex: hovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredBank('bcp')}
                  onMouseLeave={() => setHoveredBank(null)}
                >
                  {/* Logo — se encoge al hover */}
                  <div className={`flex items-center justify-center transition-all duration-350 ${hovered ? 'scale-[0.68] -translate-y-3' : 'scale-100 translate-y-0'}`}>
                    <img src="/BCP.png" alt="BCP" className="h-16 sm:h-20 w-auto object-contain" />
                  </div>
                  {/* Cuentas — sube desde abajo */}
                  <div className={`absolute bottom-0 left-0 right-0 px-3 pb-2 transition-all duration-350 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {[{ label: 'S/', value: acc.soles, key: 'bcp-s' }, { label: '$', value: acc.dolares, key: 'bcp-d' }].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                          <span className="text-[9px] font-bold tabular-nums truncate" style={{ color: '#0D1B2A' }}>{value}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(value, key)}
                          className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all"
                          style={{ background: copiedKey === key ? 'rgba(34,197,94,0.15)' : 'rgba(13,27,42,0.06)', color: copiedKey === key ? '#16a34a' : '#0D1B2A' }}
                        >
                          {copiedKey === key ? '✓' : 'Copiar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Interbank */}
            {(() => {
              const hovered = hoveredBank === 'interbank';
              const acc = BANK_ACCOUNTS.interbank;
              return (
                <div
                  className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(34,197,94,0.35)' : 'rgba(13,27,42,0.08)'}`,
                    minHeight: '110px',
                    transitionDelay: isBanksSectionVisible ? '0ms' : '120ms',
                    transform: hovered ? 'translateY(-6px) scale(1.04)' : 'translateY(0px) scale(1)',
                    boxShadow: hovered ? '0 16px 40px rgba(34,197,94,0.18), 0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                    background: hovered ? 'rgba(34,197,94,0.04)' : 'transparent',
                    zIndex: hovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredBank('interbank')}
                  onMouseLeave={() => setHoveredBank(null)}
                >
                  <div className={`flex items-center justify-center transition-all duration-350 ${hovered ? 'scale-[0.68] -translate-y-3' : 'scale-100 translate-y-0'}`}>
                    <img src="/Interbank.png" alt="Interbank" className="h-24 sm:h-28 w-auto object-contain" />
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 px-3 pb-2 transition-all duration-350 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {[{ label: 'S/', value: acc.soles, key: 'itb-s' }, { label: '$', value: acc.dolares, key: 'itb-d' }].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                          <span className="text-[9px] font-bold tabular-nums truncate" style={{ color: '#0D1B2A' }}>{value}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(value, key)}
                          className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all"
                          style={{ background: copiedKey === key ? 'rgba(34,197,94,0.15)' : 'rgba(13,27,42,0.06)', color: copiedKey === key ? '#16a34a' : '#0D1B2A' }}
                        >
                          {copiedKey === key ? '✓' : 'Copiar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* BanBif */}
            {(() => {
              const hovered = hoveredBank === 'banbif';
              const acc = BANK_ACCOUNTS.banbif;
              return (
                <div
                  className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(34,197,94,0.35)' : 'rgba(13,27,42,0.08)'}`,
                    minHeight: '110px',
                    transitionDelay: isBanksSectionVisible ? '0ms' : '240ms',
                    transform: hovered ? 'translateY(-6px) scale(1.04)' : 'translateY(0px) scale(1)',
                    boxShadow: hovered ? '0 16px 40px rgba(34,197,94,0.18), 0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                    background: hovered ? 'rgba(34,197,94,0.04)' : 'transparent',
                    zIndex: hovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredBank('banbif')}
                  onMouseLeave={() => setHoveredBank(null)}
                >
                  <div className={`flex items-center justify-center transition-all duration-350 ${hovered ? 'scale-[0.68] -translate-y-3' : 'scale-100 translate-y-0'}`}>
                    <img src="/BanBif.png" alt="BanBif" className="h-16 sm:h-20 w-auto object-contain" />
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 px-3 pb-2 transition-all duration-350 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    {[{ label: 'S/', value: acc.soles, key: 'bbf-s' }, { label: '$', value: acc.dolares, key: 'bbf-d' }].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                          <span className="text-[9px] font-bold tabular-nums truncate" style={{ color: '#0D1B2A' }}>{value}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(value, key)}
                          className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all"
                          style={{ background: copiedKey === key ? 'rgba(34,197,94,0.15)' : 'rgba(13,27,42,0.06)', color: copiedKey === key ? '#16a34a' : '#0D1B2A' }}
                        >
                          {copiedKey === key ? '✓' : 'Copiar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Card agrupada: BBVA + Scotiabank + Pichincha — CCI Interbank */}
            {(() => {
              const hovered = hoveredBank === 'cci';
              const CCI = { soles: '003-200-003007757571-37', dolares: '003-200-003007757589-39' };
              return (
                <div
                  className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.2)'}`,
                    background: hovered ? 'rgba(34,197,94,0.07)' : 'rgba(34,197,94,0.03)',
                    minHeight: '110px',
                    transitionDelay: isBanksSectionVisible ? '0ms' : '360ms',
                    transform: hovered ? 'translateY(-6px) scale(1.04)' : 'translateY(0px) scale(1)',
                    boxShadow: hovered ? '0 16px 40px rgba(34,197,94,0.22), 0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(34,197,94,0.06)',
                    zIndex: hovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredBank('cci')}
                  onMouseLeave={() => setHoveredBank(null)}
                >
                  {/* Logos + badge Solo Lima */}
                  <div className={`flex flex-col items-center gap-2 transition-all duration-350 ${hovered ? 'scale-[0.72] -translate-y-3' : 'scale-100 translate-y-0'}`}>
                    <div className="flex items-center gap-3">
                      <img src="/BBVA.png" alt="BBVA" className="h-10 sm:h-11 w-auto object-contain" />
                      <img src="/Scotiabank.png" alt="Scotiabank" className="h-10 sm:h-11 w-auto object-contain" />
                      <img src="/Banco Pichincha.png" alt="Pichincha" className="h-10 sm:h-11 w-auto object-contain" />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full transition-all duration-200 ${hovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
                      style={{ color: '#22C55E', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      Solo Lima
                    </span>
                  </div>
                  {/* CCI Interbank */}
                  <div className={`absolute bottom-0 left-0 right-0 px-2 pb-2 transition-all duration-350 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <p className="text-[8px] font-black uppercase tracking-wider mb-1" style={{ color: 'rgba(13,27,42,0.4)' }}>Cuenta Interbancaria Interbank</p>
                    {[{ label: 'S/', value: CCI.soles, key: 'cci-s' }, { label: '$', value: CCI.dolares, key: 'cci-d' }].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                          <span className="text-[8px] font-bold tabular-nums truncate" style={{ color: '#0D1B2A' }}>{value}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(value, key)}
                          className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all"
                          style={{ background: copiedKey === key ? 'rgba(34,197,94,0.15)' : 'rgba(13,27,42,0.06)', color: copiedKey === key ? '#16a34a' : '#0D1B2A' }}
                        >
                          {copiedKey === key ? '✓' : 'Copiar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Footer strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-5" style={{ borderTop: '1px solid rgba(13,27,42,0.06)' }}>
            {[
              { icon: CheckCircle2, label: 'Sin comisiones ocultas' },
              { icon: Clock,        label: 'En menos de 15 minutos' },
              { icon: Lock,         label: 'SSL cifrado' },
              { icon: Shield,       label: 'Datos protegidos por ley' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'rgba(13,27,42,0.45)' }}>
                <Icon className="w-3.5 h-3.5 text-primary" />{label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          AHORRO EN NÚMEROS
      ══════════════════════════════════════ */}
      <section className="py-10 reveal">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

            {/* LEFT — headline + 3 stats inline */}
            <div className="reveal-left flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase mb-5 text-primary">
                  <span className="w-3 h-px bg-primary inline-block" />Lo que ganas
                </span>
                <h2 className="font-display font-black text-3xl md:text-4xl leading-[1.1] mb-0" style={{ color: '#0D1B2A' }}>
                  Cada sol importa.<br />
                  <span className="text-primary">No lo pierdas</span> en el banco.
                </h2>
              </div>

              {/* 3 stats compactos */}
              <div className="grid grid-cols-3 gap-0" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }}>
                {[
                  { value: 80, prefix: 'S/', suffix: '',    label: 'más por cada $1,000', sub: 'vs banco', speedClock: false },
                  { value: 10, prefix: '',   suffix: 'min', label: 'tiempo aprox.',        sub: 'por operación', speedClock: true },
                  { value: 0,  prefix: 'S/', suffix: '',    label: 'comisiones',           sub: 'siempre', speedClock: false },
                ].map(({ value, prefix, suffix, label, sub, speedClock }, i) => (
                  <div key={label} className="pt-5 pb-2" style={{ paddingLeft: i > 0 ? '20px' : '0', borderLeft: i > 0 ? '1px solid rgba(13,27,42,0.08)' : 'none' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {speedClock && (
                        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: '22px', height: '22px' }}>
                          {/* Ghost trail sutil */}
                          <Clock className="absolute w-4 h-4 text-primary" style={{ animation: 'clockOrganic 1.4s cubic-bezier(0.4,0,0.6,1) infinite', opacity: 0.12, filter: 'blur(1.5px)', animationDelay: '-0.3s' }} />
                          {/* Icono principal */}
                          <Clock className="relative w-4 h-4 text-primary" style={{ animation: 'clockOrganic 1.4s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                        </div>
                      )}
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-bold text-primary">{prefix}</span>
                        <span className="text-3xl font-black text-primary tabular-nums leading-none"><AnimatedStat value={value} label="" /></span>
                        <span className="text-sm font-bold text-primary ml-0.5">{suffix}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold leading-tight" style={{ color: '#0D1B2A' }}>{label}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(13,27,42,0.35)' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* end reveal-left */}

            {/* RIGHT — tabla compacta */}
            <div className="reveal-right">

              {/* Tabla */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(13,27,42,0.09)' }}>

                {/* Encabezado único — fondo oscuro, todo en una fila */}
                <div className="flex items-center px-4 py-3" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-tight">Tipo de cambio hoy</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold" style={{ color: '#4ade80' }}>
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: '#4ade80', opacity: 0.6 }} />
                        <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: '#4ade80' }} />
                      </span>
                      En vivo
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-14 text-right text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Compra</span>
                    <span className="w-14 text-right text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Venta</span>
                  </div>
                </div>

                {/* QoriCash */}
                {(() => {
                  const qc_compra = currentRates?.tipo_compra?.toFixed(3) || buyRate;
                  const qc_venta  = currentRates?.tipo_venta?.toFixed(3)  || sellRate;
                  return (
                    <div className="flex items-center px-4 py-3" style={{
                      background: 'rgba(34,197,94,0.05)',
                      borderBottom: '1px solid rgba(34,197,94,0.1)',
                      borderLeft: '2px solid #22C55E',
                    }}>
                      <div className="flex items-center gap-2.5 flex-1">
                        <img src="/logo-principal.png" alt="QoriCash" className="h-5 w-auto object-contain flex-shrink-0" />
                        <span className="text-sm font-black" style={{ color: '#0D1B2A' }}>QoriCash</span>
                        <span className="text-[8px] font-black uppercase tracking-wider bg-primary text-white px-1.5 py-0.5 rounded-full">Mejor</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-14 text-right text-sm font-black tabular-nums text-primary">{qc_compra}</span>
                        <span className="w-14 text-right text-sm font-black tabular-nums text-primary">{qc_venta}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Bancos */}
                {[
                  { name: 'BCP',        logo: '/bcp.png',        compra: '3.620', venta: '3.710' },
                  { name: 'Interbank',  logo: '/interbank.png',  compra: '3.625', venta: '3.715' },
                  { name: 'BBVA',       logo: '/bbva.png',       compra: '3.610', venta: '3.720' },
                  { name: 'Scotiabank', logo: '/scotiabank.png', compra: '3.615', venta: '3.712' },
                ].map(({ name, logo, compra, venta }, i, arr) => (
                  <div key={name} className="flex items-center px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(13,27,42,0.05)' : 'none' }}>
                    <div className="flex items-center gap-2.5 flex-1">
                      <img src={logo} alt={name} className="h-4 w-auto object-contain flex-shrink-0 opacity-70" />
                      <span className="text-sm font-medium" style={{ color: 'rgba(13,27,42,0.4)' }}>{name}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-14 text-right text-sm tabular-nums font-medium" style={{ color: 'rgba(13,27,42,0.35)' }}>{compra}</span>
                      <span className="w-14 text-right text-sm tabular-nums font-medium" style={{ color: 'rgba(13,27,42,0.35)' }}>{venta}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] mt-2 text-right" style={{ color: 'rgba(13,27,42,0.2)' }}>
                *Tasas bancarias referenciales. Actualizado en tiempo real.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CÓMO FUNCIONA — 3 pasos
      ══════════════════════════════════════ */}
      <section id="como-funciona" className="pt-8 pb-16 reveal">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4" style={{ border: '1px solid rgba(13,27,42,0.1)', color: 'rgba(13,27,42,0.4)' }}>
              Simple como siempre debió ser
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl" style={{ color: '#0D1B2A' }}>3 pasos. Menos de 15 minutos.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { num: '01', title: 'Cotiza en línea',         desc: 'Ingresa el monto. Ve tu tipo de cambio exacto al instante, sin sorpresas ni letras chicas.', icon: CalculatorIcon },
              { num: '02', title: 'Transfiere a QoriCash',   desc: 'Haz la transferencia desde cualquier banco: BCP, Interbank, BBVA, Scotiabank y más.',       icon: Banknote      },
              { num: '03', title: 'Recibe tu dinero',        desc: 'Te transferimos de vuelta en menos de 15 minutos. Sin comisiones, sin cargos ocultos.',        icon: CheckCircle2  },
            ].map(({ num, title, desc, icon: Icon }) => (
              <div
                key={num}
                className="rounded-2xl p-7 group transition-all duration-300 hover:shadow-sm"
                style={{ border: '1px solid rgba(13,27,42,0.08)' }}
              >
                <div className="flex items-start gap-3 mb-5">
                  <span className="font-display font-black text-5xl leading-none select-none group-hover:opacity-20 transition-opacity" style={{ color: 'rgba(13,27,42,0.07)' }}>{num}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#0D1B2A' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/operaciones/nueva"
              className="inline-flex items-center gap-2.5 text-white font-bold px-9 py-4 rounded-full transition-all text-sm hover:-translate-y-0.5"
              style={{ background: '#0D1B2A', boxShadow: '0 8px 24px rgba(13,27,42,0.2)' }}
            >
              Empezar ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AlertaTCBanner */}
      {!isAuthenticated && <AlertaTCBanner />}

      {/* ══════════════════════════════════════
          NOTICIAS — 2 artículos destacados
      ══════════════════════════════════════ */}
      {noticiasHome.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="block mb-1 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(13,27,42,0.3)' }}>Mercado</span>
                <h2 className="font-display font-black text-2xl md:text-3xl" style={{ color: '#0D1B2A' }}>Noticias del día</h2>
              </div>
              <Link href="/noticias" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {noticiasHome.map((n) => (
                <Link key={n.id} href={`/noticias/${n.id}`} className="group block">
                  <article className="rounded-2xl overflow-hidden h-full transition-all duration-300 hover:shadow-sm" style={{ border: '1px solid rgba(13,27,42,0.08)' }}>
                    {n.imagen && (
                      <div className="relative h-44 overflow-hidden">
                        <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,42,0.65), transparent)' }} />
                        <div className="absolute bottom-3 left-4 flex gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2.5 py-1 rounded-full">{n.categoria}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.2)' }}>{n.fuente}</span>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-display font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2" style={{ color: '#0D1B2A' }}>{n.titulo}</h3>
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(13,27,42,0.5)' }}>{n.descripcion}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="pt-4 pb-14">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-3xl md:text-4xl mb-2" style={{ color: '#0D1B2A' }}>Preguntas frecuentes</h2>
            <p className="text-sm" style={{ color: 'rgba(13,27,42,0.45)' }}>Resolvemos tus dudas antes de empezar</p>
          </div>
          <div className="space-y-2">
            {[
              { q: '¿Cuánto tiempo tarda mi operación?',     a: 'La mayoría de operaciones se completan en menos de 15 minutos. El tiempo depende de la confirmación de tu transferencia bancaria, que normalmente es inmediata entre los bancos principales del Perú.' },
              { q: '¿Es seguro cambiar dólares con QoriCash?', a: 'Sí. QoriCash opera con registro ante la SBS y cuenta con protocolos de verificación de identidad (KYC). Tus datos están protegidos y cada operación queda registrada con trazabilidad completa.' },
              { q: '¿Cuáles son las comisiones?',            a: 'Ninguna. QoriCash no cobra comisiones ocultas ni cargos adicionales. El tipo de cambio que ves es exactamente lo que recibes.' },
              { q: '¿Cuál es el monto mínimo para operar?',  a: <span>Puedes cambiar desde S/ 100 o $30 dólares. Para operaciones grandes contáctanos por <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">WhatsApp 926 011 920</a> para coordinar condiciones especiales.</span> },
              { q: '¿Con qué bancos trabajan?',              a: 'Operamos con los principales bancos del Perú: BCP, Interbank, BBVA, Scotiabank, BanBif y Pichincha. Puedes enviar y recibir desde cualquiera de ellos.' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{ border: openFaq === i ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(13,27,42,0.08)' }}
              >
                <button className="w-full flex items-center gap-4 px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-colors duration-300"
                    style={{
                      background: openFaq === i ? '#22C55E' : 'rgba(13,27,42,0.07)',
                      color: openFaq === i ? 'white' : 'rgba(13,27,42,0.35)',
                    }}
                  >{i + 1}</span>
                  <span className="flex-1 font-bold text-sm sm:text-base" style={{ color: '#0D1B2A' }}>{item.q}</span>
                  <ChevronDown className={`flex-shrink-0 w-4 h-4 text-primary transition-transform duration-300 ${openFaq === i ? 'rotate-180' : 'opacity-50'}`} />
                </button>
                <div className={`faq-body ${openFaq === i ? 'open' : ''}`}>
                  <div>
                    <div className="px-6 pb-5 pl-[60px]">
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.5)' }}>{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#080e1a] text-gray-400">
        <div className="border-b border-white/5 py-4 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-[11px] leading-tight">Empresa Registrada</div>
                  <div className="text-gray-500 text-[10px]">RUC: 20615113698 · Lima, Perú</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-[11px] leading-tight">Regulada SBS</div>
                  <div className="text-gray-500 text-[10px]">Res. N° 00313-2026</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[11px] text-gray-600">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL cifrado</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Datos protegidos por ley</span>
            </div>
          </div>
        </div>
        <div className="w-full px-6 sm:px-8 lg:px-12 py-14">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity w-fit">
                <img src="/logo-principal.png" alt="QoriCash" className="h-11 w-auto" />
                <span className="text-2xl font-display font-bold text-white">QoriCash</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">Casa de cambio online líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Servicios</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/servicios#compra" className="hover:text-white transition-colors">Compra de dólares</Link></li>
                <li><Link href="/servicios#venta" className="hover:text-white transition-colors">Venta de dólares</Link></li>
                <li><Link href="/servicios#tipo-cambio" className="hover:text-white transition-colors">Tipo de cambio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Empresa</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
                <li><Link href="/terminos-condiciones" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
                <li><Link href="/politica-privacidad" className="hover:text-white transition-colors">Política de privacidad</Link></li>
                <li><Link href="/politica-cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
                <li><Link href="/libro-reclamaciones" className="hover:text-white transition-colors">Libro de reclamaciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors">info@qoricash.pe</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">926 011 920</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors leading-relaxed">Av. Brasil N° 2790, Int. 504<br />Lima – Pueblo Libre</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="leading-relaxed">
                    <div>Lun – Vie: 9:00 a.m. – 6:00 p.m.</div>
                    <div>Sáb: 9:00 a.m. – 1:00 p.m.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2025 QoriCash. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
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
