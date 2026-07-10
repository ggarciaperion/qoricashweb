'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Calculator from '@/components/Calculator';
import AnimatedStat from '@/components/AnimatedStat';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import {
  ArrowRight, ArrowLeft, Shield, Clock, TrendingUp, TrendingDown, Minus,
  Users, CheckCircle2, Lock, UserPlus, Banknote,
  LogOut, User as UserIcon, ChevronDown, Menu, X,
  HelpCircle, Gift, Calculator as CalculatorIcon,
  Building2, Zap, HandCoins,
} from 'lucide-react';
import AlertaTCModal from '@/components/AlertaTCModal';
import AlertaTCBanner from '@/components/AlertaTCBanner';
import MarketTicker from '@/components/MarketTicker';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const isEmpresaPage = pathname === '/empresa';
  const { user, isAuthenticated, logout } = useAuthStore();
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');

  const [profileMismatchModal, setProfileMismatchModal] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const userBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isBanksSectionVisible, setIsBanksSectionVisible] = useState(false);
  const banksSectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [noticiasCorp, setNoticiasCorp] = useState<Array<{id:string;titulo:string;descripcion:string;categoria:string;imagen?:string;fecha:string}>>([]);
  const [newsCorpIdx, setNewsCorpIdx] = useState(0);
  const [bcrpData, setBcrpData] = useState<Array<{fecha:string;compra:number;venta:number}>>([]);

  const BANK_ACCOUNTS = {
    bcp:       { soles: '1937353150041',   dolares: '1917357790119'   },
    interbank: { soles: '200-3007757571',  dolares: '200-3007757589'  },
    banbif:    { soles: '007000845805',    dolares: '007000845813'    },
  } as const;

  // Detecta conflicto de perfil: empresa logueada en página personas o viceversa
  const isEmpresaUser = isAuthenticated && user?.document_type === 'RUC';
  const hasProfileMismatch = isAuthenticated && (
    (isEmpresaPage && !isEmpresaUser) ||   // persona en página empresa
    (!isEmpresaPage && isEmpresaUser)      // empresa en página personas
  );

  // Wrapper para acciones protegidas: bloquea si hay conflicto de perfil
  const guardedAction = (action: () => void) => {
    if (hasProfileMismatch) { setProfileMismatchModal(true); return; }
    action();
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, ''));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const { currentRates } = useExchangeStore();

  // Auto-redirigir según perfil de usuario autenticado
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const isRUC = user.document_type === 'RUC';
    if (isRUC && !isEmpresaPage) {
      router.replace('/empresa');
    } else if (!isRUC && isEmpresaPage) {
      router.replace('/');
    }
  }, [isAuthenticated, user, isEmpresaPage]);

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

  useEffect(() => {
    if (!isEmpresaPage) return;
    fetch('/api/noticias').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setNoticiasCorp(data.slice(0, 6));
    }).catch(() => {});
    fetch('/api/bcrp-tc').then(r => r.json()).then(res => {
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) setBcrpData(res.data);
    }).catch(() => {});
  }, [isEmpresaPage]);

  useEffect(() => {
    if (!isEmpresaPage || noticiasCorp.length < 2) return;
    const t = setInterval(() => setNewsCorpIdx(i => (i + 1) % noticiasCorp.length), 6000);
    return () => clearInterval(t);
  }, [isEmpresaPage, noticiasCorp.length]);

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
    {/* ── Modal conflicto de perfil ── */}
    {profileMismatchModal && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
        <div className="w-full max-w-sm rounded-2xl p-7 flex flex-col gap-5" style={{ background: '#0D1B2A', border: '1px solid rgba(143,184,204,0.2)' }}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(143,184,204,0.12)', border: '1px solid rgba(143,184,204,0.25)' }}>
              <Shield className="w-5 h-5" style={{ color: '#8fb8cc' }} />
            </div>
            <div>
              <p className="font-black text-white text-base mb-1">Perfil incorrecto</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {isEmpresaPage
                  ? 'Esta sección es exclusiva para cuentas empresariales. Cierra sesión e ingresa con tu cuenta empresa.'
                  : 'Esta sección es exclusiva para personas naturales. Cierra sesión e ingresa con tu cuenta personal.'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setProfileMismatchModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                setProfileMismatchModal(false);
                await logout();
                router.push(isEmpresaPage ? '/login?from=/empresa' : '/login?from=/');
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)' }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}

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
      {/* ══ FONDO FIJO — personas page (mismo patrón que video empresa) ══ */}
      {!isEmpresaPage && (
        <div aria-hidden style={{
          position: 'fixed', inset: 0, zIndex: -1,
          backgroundImage: "url('/ty.webp')",
          backgroundSize: 'cover',
          backgroundPosition: '25% center',
          backgroundRepeat: 'no-repeat',
        }} />
      )}

      {/* ══ NAVBAR ══ */}
      <header className="relative w-full z-50" style={{ background: 'transparent', borderBottom: 'none' }}>
        <nav className="w-full">
          <div className="max-w-5xl mx-auto flex justify-between items-center h-20 px-6 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
                {isEmpresaPage ? (
                  <div className="relative inline-flex flex-shrink-0">
                    <img src="/logo-principal.png" alt="QoriCash" aria-hidden className="h-8 sm:h-11 md:h-12 w-auto invisible" />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)',
                      WebkitMaskImage: "url('/logo-principal.png')",
                      maskImage: "url('/logo-principal.png')",
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                    }} />
                  </div>
                ) : (
                  <img src="/logo-principal.png" alt="QoriCash" className="h-8 sm:h-11 md:h-12 w-auto" />
                )}
                <div className="flex flex-col items-start">
                  <span className="text-xl sm:text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight" style={isEmpresaPage ? { background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}>Qoricash</span>
                  {isEmpresaPage && (
                    <span className="text-[8px] font-semibold tracking-[0.28em] uppercase" style={{ color: 'rgba(143,184,204,0.65)', letterSpacing: '0.28em' }}>Corporate</span>
                  )}
                </div>
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {[
              ].map(({ href, label, isLink }) => {
                const cls = 'relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group py-1';
                const inner = (
                  <>
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-out group-hover:w-full" />
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
                      ref={userBtnRef}
                      onClick={() => {
                        if (!isUserMenuOpen && userBtnRef.current) {
                          const rect = userBtnRef.current.getBoundingClientRect();
                          setDropdownPos({ top: rect.bottom + 10, left: rect.left + rect.width / 2 });
                        }
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      className="relative flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group py-1"
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                        style={{ background: isEmpresaPage ? 'linear-gradient(135deg, #4A6884, #8fb8cc)' : '#22C55E' }}>
                        {((user?.razon_social || user?.nombres) ?? '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate">
                        {user?.document_type === 'RUC'
                          ? user?.razon_social || user?.nombres
                          : user?.nombres}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {!isAuthenticated && (
                    <>
                      <button
                        className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group py-1"
                        onClick={() => {
                          const href = isEmpresaPage ? '/' : '/empresa';
                          if ('startViewTransition' in document) {
                            (document as any).startViewTransition(() => router.push(href));
                          } else {
                            router.push(href);
                          }
                        }}
                      >
                        {isEmpresaPage ? 'Personas' : 'Empresas'}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                      </button>
                      <span className="h-4 w-px bg-white/30" aria-hidden="true" />
                    </>
                  )}
                  <Link href={`/login?from=${isEmpresaPage ? '/empresa' : '/'}`} className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group py-1">
                    Iniciar Sesión
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                  <Link href={isEmpresaPage ? '/crear-cuenta?tipo=empresa' : '/crear-cuenta'} className="text-sm font-bold px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all duration-200 shadow-md" style={isEmpresaPage ? { background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', color: '#ffffff' } : { background: '#ffffff', color: 'var(--color-primary-600)' }}>
                    Regístrate
                  </Link>
                </>
              )}
            </div>
            {/* Mobile — Personas/Empresas + separador + hamburger */}
            <div className="lg:hidden flex items-center">
              {!isAuthenticated && (
                <>
                  <button
                    className="text-sm font-medium text-white/70 hover:text-white transition-colors px-2"
                    onClick={() => {
                      const href = isEmpresaPage ? '/' : '/empresa';
                      if ('startViewTransition' in document) {
                        (document as any).startViewTransition(() => router.push(href));
                      } else {
                        router.push(href);
                      }
                    }}
                  >
                    {isEmpresaPage ? 'Personas' : 'Empresas'}
                  </button>
                  <span className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />
                </>
              )}
              {isAuthenticated && user && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mr-0.5"
                  style={{ background: isEmpresaPage ? 'linear-gradient(135deg, #4A6884, #8fb8cc)' : '#22C55E' }}>
                  {((user.razon_social || user.nombres) ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:text-white/70 transition" aria-label="Toggle mobile menu">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
        className={`lg:hidden fixed right-3 z-[49] rounded-3xl overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{
          width: '220px',
          top: '74px',
          maxHeight: isMobileMenuOpen ? '70vh' : '0px',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease-out',
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
        }}
      >
        <div className="px-4 pt-4 pb-5 overflow-y-auto" style={{ maxHeight: '70vh' }}>

          {/* Separador y acciones de cuenta */}
          <div style={{ borderTop: isEmpresaPage ? '1px solid rgba(143,184,204,0.12)' : '1px solid rgba(255,255,255,0.1)' }}>
            {isAuthenticated ? (
              <>
                <p className="text-[10px] font-bold tracking-widest uppercase px-2 mb-2 pt-3" style={{ color: isEmpresaPage ? 'rgba(143,184,204,0.5)' : 'rgba(255,255,255,0.4)' }}>Mi Cuenta</p>
                <div className="space-y-0.5">
                  <Link href="/dashboard?perfil=1" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-white/8" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isEmpresaPage ? 'rgba(143,184,204,0.1)' : 'rgba(255,255,255,0.1)' }}><UserIcon className="w-4 h-4" style={{ color: isEmpresaPage ? '#8fb8cc' : 'rgba(255,255,255,0.7)' }} /></div>
                    <span className="font-medium flex-1 text-sm">Mi perfil</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-white/8" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isEmpresaPage ? 'rgba(143,184,204,0.1)' : 'rgba(255,255,255,0.1)' }}><Banknote className="w-4 h-4" style={{ color: isEmpresaPage ? '#8fb8cc' : 'rgba(255,255,255,0.7)' }} /></div>
                    <span className="font-medium flex-1 text-sm">Mi Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <a href="https://wa.me/51910624404?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-white/8" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isEmpresaPage ? 'rgba(143,184,204,0.1)' : 'rgba(34,197,94,0.12)' }}><HelpCircle className="w-4 h-4" style={{ color: isEmpresaPage ? '#8fb8cc' : '#22c55e' }} /></div>
                    <span className="font-medium flex-1 text-sm">Ayuda</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                  </a>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/8" style={{ color: '#ef4444' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}><LogOut className="w-4 h-4 text-red-500" /></div>
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-4">
                <Link href={`/login?from=${isEmpresaPage ? '/empresa' : '/'}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-white/8" style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isEmpresaPage ? 'rgba(143,184,204,0.1)' : 'rgba(255,255,255,0.1)' }}><Lock className="w-4 h-4" style={{ color: isEmpresaPage ? '#8fb8cc' : 'rgba(255,255,255,0.7)' }} /></div>
                  <span className="font-medium flex-1 text-sm">Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link
                  href={isEmpresaPage ? '/crear-cuenta?tipo=empresa' : '/crear-cuenta'}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all"
                  style={isEmpresaPage
                    ? { background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', color: '#ffffff' }
                    : { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#ffffff' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-sm">Regístrate</span>
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
          <div
            className="fixed w-56 rounded-2xl py-2 overflow-hidden"
            style={{
              zIndex: 99999,
              top: dropdownPos.top,
              left: dropdownPos.left,
              transform: 'translateX(-50%)',
              background: 'rgba(10,20,34,0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(143,184,204,0.18)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
            }}
          >
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?perfil=1'); }}
              className="flex items-center w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(143,184,204,0.08)', e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              <UserIcon className="w-4 h-4 mr-3 opacity-60" />Mi perfil
            </button>
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
              className="flex items-center w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(143,184,204,0.08)', e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              <TrendingUp className="w-4 h-4 mr-3 opacity-60" />Mi Dashboard
            </button>
            <a
              href="https://wa.me/51910624404?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(143,184,204,0.08)', e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
              onClick={() => setIsUserMenuOpen(false)}
            >
              <HelpCircle className="w-4 h-4 mr-3 opacity-60" />Ayuda
            </a>
            <div className="my-1 mx-4" style={{ borderTop: '1px solid rgba(143,184,204,0.12)' }} />
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: 'rgba(239,68,68,0.75)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)', e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(239,68,68,0.75)')}
            >
              <LogOut className="w-4 h-4 mr-3 opacity-60" />Cerrar Sesión
            </button>
          </div>
        </>,
        document.body
      )}

      {/* ══════════════════════════════════════
          HERO — Geométrico minimalista
      ══════════════════════════════════════ */}
      <section className={`relative min-h-screen flex flex-col overflow-hidden ${isEmpresaPage ? 'corp-transparent' : ''}`}>

        <div className="flex-1 flex flex-col items-start w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-6 sm:pt-16 pb-6 sm:pb-12 relative z-10">

          {/* H1 personas — entre encabezado y grid, solo móvil */}
          {!isEmpresaPage && (
            <h1 className="sm:hidden font-display font-black leading-[1.05] mb-4 text-center w-full" style={{ color: '#FFFFFF' }}>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>El cambio de dólares</span>
              <span className="block text-primary" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>que siempre</span>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>quisiste tener</span>
            </h1>
          )}

          {/* H1 empresa — encima del card Herramientas Corporativas, solo móvil */}
          {isEmpresaPage && (
            <h1 className="sm:hidden font-display font-black leading-[1.05] mb-4 text-center w-full" style={{ color: '#FFFFFF' }}>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>En los negocios <span style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>cada centavo</span> cuenta</span>
            </h1>
          )}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 items-center w-full">

            {/* LEFT — Texto */}
            <div className="order-2 sm:order-1">
              {/* Pill label */}
              <div className="flex justify-center sm:justify-start mb-4 sm:mb-7">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold tracking-[0.18em] uppercase" style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.75)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                  Fintech de cambio de divisas · Perú
                </span>
              </div>

              <h1 className="hidden sm:block font-display font-black leading-[1.05] mb-6" style={{ color: '#FFFFFF' }}>
                {isEmpresaPage ? (
                  <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>En los negocios <span style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>cada centavo</span> cuenta</span>
                ) : (
                  <>
                    <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>El cambio de dólares</span>
                    <span className="block text-primary" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>que siempre</span>
                    <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>quisiste tener</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg max-w-[440px] mb-6 sm:mb-9 leading-relaxed text-justify sm:text-left" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {isEmpresaPage
                  ? 'Gestiona tus operaciones cambiarias con una plataforma segura, atención personalizada y tasas competitivas que generan un impacto real en la rentabilidad de tu empresa.'
                  : 'En cada una de tus metas, estamos contigo. Cambia tus dólares de forma rápida, segura y 100% digital, con las mejores tasas y sin costos ocultos.'}
              </p>

              <div className="flex flex-wrap gap-3 mb-6 sm:mb-10">
                {isEmpresaPage ? (
                  isAuthenticated && (
                  <button
                    onClick={() => guardedAction(() => window.open('https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20tipo%20de%20cambio%20corporativo.', '_blank'))}
                    className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full transition-all text-sm text-white hover:-translate-y-0.5 w-full sm:w-auto"
                    style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)' }}
                  >
                    Cotizar ahora
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  )
                ) : (
                  <a
                    href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20el%20tipo%20de%20cambio."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full transition-all text-sm text-white hover:-translate-y-0.5 w-full sm:w-auto"
                    style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
                  >
                    Cotizar ahora
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

<div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {isEmpresaPage ? (
                  <>
                    <span className="flex items-center gap-1.5"><HandCoins className="w-3.5 h-3.5" style={{ color: '#8fb8cc' }} />Rentabilidad</span>
                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" style={{ color: '#8fb8cc' }} />Inmediato</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" style={{ color: '#8fb8cc' }} />Exclusivo</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" />Registrados ante la SBS</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" />En 15 minutos</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" />0 comisiones</span>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT — Calculadora / FX Terminal */}
            <div className="order-1 sm:order-2 relative flex items-center justify-center">

              <div className="relative z-10 w-full max-w-[400px]">
              {isEmpresaPage && !isAuthenticated ? (
                /* ── Glass CTA — acceso herramientas corporativas ── */
                <div className="relative overflow-hidden rounded-2xl p-5 sm:p-7 flex flex-col gap-4 sm:gap-5"
                  style={{
                    background: 'rgba(143,184,204,0.1)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '1px solid rgba(143,184,204,0.25)',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(143,184,204,0.15)',
                  }}>

                  {/* Reflejo superior espejo */}
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(143,184,204,0.5), transparent)' }} />
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(143,184,204,0.12) 0%, transparent 70%)' }} />

                  {/* Icono */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(143,184,204,0.2) 0%, rgba(30,58,80,0.4) 100%)', border: '1px solid rgba(143,184,204,0.25)' }}>
                      <Building2 className="w-5 h-5" style={{ color: '#8fb8cc' }} />
                    </div>
                    <div>
                      <p className="text-white font-extrabold text-sm leading-tight">Herramientas Corporativas</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: 'rgba(143,184,204,0.6)' }}>Acceso exclusivo para empresas</p>
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(143,184,204,0.2), transparent)' }} />

                  {/* Features */}
                  <div className="flex flex-col gap-2.5">
                    {[
                      { icon: TrendingUp,  text: 'TC preferencial para volúmenes corporativos' },
                      { icon: Zap,         text: 'Cotización en tiempo real con ejecutivo dedicado' },
                      { icon: HandCoins,   text: 'Maximiza el rendimiento de cada operación cambiaria' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(143,184,204,0.1)', border: '1px solid rgba(143,184,204,0.18)' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: '#8fb8cc' }} />
                        </div>
                        <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.65)' }}>{text}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    <Link href="/crear-cuenta?tipo=empresa"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', boxShadow: '0 6px 20px rgba(8,18,30,0.4)' }}>
                      <UserPlus className="w-4 h-4" />
                      Crear cuenta empresarial
                    </Link>
                    <Link href="/login?from=/empresa"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{ background: 'rgba(143,184,204,0.08)', border: '1px solid rgba(143,184,204,0.22)', color: 'rgba(143,184,204,0.9)' }}>
                      <Lock className="w-4 h-4" />
                      Iniciar sesión
                    </Link>
                  </div>

                  {/* Footer note */}
                  <p className="text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Registro gratuito · Sin permanencia · Atención personalizada
                  </p>
                </div>
              ) : (
              <Calculator
                initialRates={{ compra: parseFloat(buyRate), venta: parseFloat(sellRate) }}
                showContinueButton={true}
                dark={isEmpresaPage}
                onOperationReady={() => guardedAction(() => {
                  if (isEmpresaPage) {
                    router.push(isAuthenticated ? '/dashboard/empresa' : '/login?from=/empresa');
                  } else {
                    router.push(isAuthenticated ? '/dashboard' : '/crear-cuenta');
                  }
                })}
              />
              )}

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
      <section ref={banksSectionRef} className={`py-4 sm:py-6 ${isEmpresaPage ? 'corp-transparent' : ''}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8">

          {/* Encabezado */}
          <div className="mb-7 text-center">
            <h2 className="font-display font-black leading-[1.05]" style={{ color: '#ffffff', fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)' }}>
              Operamos con los bancos <span className={isEmpresaPage ? '' : 'text-primary'} style={isEmpresaPage ? { background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}>principales del Peru</span>
            </h2>
          </div>

          {/* Logos bancos — 2 grupos con etiqueta */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">

          {/* Grupo 1 — Card unificada BCP + Interbank + BanBif */}
          <div className="flex-[3]">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Transferencias inmediatas a todo el Perú
            </p>

            {/* Card unificada */}
            {(() => {
              const hovered = hoveredBank === 'group1';
              return (
                <div
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.18)'}`,
                    background: hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    boxShadow: hovered ? '0 16px 40px rgba(34,197,94,0.15), 0 4px 16px rgba(0,0,0,0.12)' : 'none',
                    minHeight: '110px',
                    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                  onMouseEnter={() => setHoveredBank('group1' as any)}
                  onMouseLeave={() => setHoveredBank(null)}
                  onClick={() => setHoveredBank(hoveredBank === 'group1' ? null : 'group1' as any)}
                >
                  <div className="grid grid-cols-3 h-full">
                    {[
                      { id: 'bcp',       img: '/BCP.png',      alt: 'BCP',      imgClass: 'h-16 sm:h-20', acc: BANK_ACCOUNTS.bcp,      keys: { s: 'bcp-s', d: 'bcp-d' } },
                      { id: 'interbank', img: '/Interbank.png', alt: 'Interbank',imgClass: 'h-24 sm:h-28', acc: BANK_ACCOUNTS.interbank, keys: { s: 'itb-s', d: 'itb-d' } },
                      { id: 'banbif',    img: '/BanBif.png',    alt: 'BanBif',   imgClass: 'h-16 sm:h-20', acc: BANK_ACCOUNTS.banbif,   keys: { s: 'bbf-s', d: 'bbf-d' } },
                    ].map(({ id, img, alt, imgClass, acc, keys }) => (
                      <div key={id} className="relative overflow-hidden flex flex-col items-center justify-center px-3 cursor-default" style={{ minHeight: '110px' }}>
                        <div className={`flex items-center justify-center transition-all duration-300 ${hovered ? 'scale-[0.68] -translate-y-3' : 'scale-100 translate-y-0'}`}>
                          <img src={img} alt={alt} className={`${imgClass} w-auto object-contain`} />
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 px-3 pb-2 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                          {[{ label: 'S/', value: acc.soles, key: keys.s }, { label: '$', value: acc.dolares, key: keys.d }].map(({ label, value, key }) => (
                            <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                                <span className="text-[9px] font-bold tabular-nums truncate" style={{ color: '#1E293B' }}>{value}</span>
                              </div>
                              <button
                                onClick={() => handleCopy(value, key)}
                                className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all"
                                style={{ background: copiedKey === key ? 'rgba(34,197,94,0.2)' : 'rgba(13,27,42,0.07)', color: copiedKey === key ? '#16a34a' : 'rgba(13,27,42,0.5)' }}
                              >
                                {copiedKey === key ? '✓' : 'Copiar'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>{/* fin grupo 1 */}

          {/* Grupo 2 — Interbancaria solo Lima */}
          <div className="flex-[1] flex flex-col">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Interbancaria solo Lima
            </p>

            {/* Card agrupada: 6 bancos — CCI Interbank */}
            {(() => {
              const hovered = hoveredBank === 'cci';
              const CCI = { soles: '003-200-003007757571-37', dolares: '003-200-003007757589-39' };
              return (
                <div
                  className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 flex-1 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.18)'}`,
                    background: hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    minHeight: '110px',
                    transitionDelay: isBanksSectionVisible ? '0ms' : '360ms',
                    transform: hovered ? 'translateY(-4px)' : 'translateY(0px)',
                    boxShadow: hovered ? '0 16px 40px rgba(34,197,94,0.15), 0 4px 16px rgba(0,0,0,0.08)' : '0 1px 6px rgba(0,0,0,0.06)',
                    zIndex: hovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredBank('cci')}
                  onMouseLeave={() => setHoveredBank(null)}
                  onClick={() => setHoveredBank(hoveredBank === 'cci' ? null : 'cci')}
                >
                  {/* Logos — 2 filas de 3, uniformes */}
                  <div className={`flex flex-col items-center px-2 transition-all duration-300 ${hovered ? 'scale-[0.6] -translate-y-8' : 'scale-100 translate-y-0'}`} style={{ gap: '2px' }}>
                    {/* Fila 1 */}
                    <div className="flex items-center justify-center gap-3 w-full">
                      {[{ src: '/BBVA.png', alt: 'BBVA' }, { src: '/Scotiabank.png', alt: 'Scotiabank' }, { src: '/Banco Pichincha.png', alt: 'Pichincha' }].map(({ src, alt }) => (
                        <div key={alt} className="flex items-center justify-center" style={{ width: '72px', height: '44px' }}>
                          <img src={src} alt={alt} style={{ maxWidth: '72px', maxHeight: '44px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>
                    {/* Fila 2 — GNB + Santander + card Otros Bancos */}
                    <div className="flex items-center justify-center gap-3 w-full">
                      {[{ src: '/bancognb.png', alt: 'GNB' }, { src: '/bancosantander.png', alt: 'Santander' }].map(({ src, alt }) => (
                        <div key={alt} className="flex items-center justify-center" style={{ width: alt === 'GNB' ? '90px' : '72px', height: alt === 'GNB' ? '56px' : '44px' }}>
                          <img src={src} alt={alt} style={{ maxWidth: alt === 'GNB' ? '90px' : '72px', maxHeight: alt === 'GNB' ? '56px' : '44px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                        </div>
                      ))}
                      {/* Card Otros Bancos */}
                      <div className="flex flex-col items-center justify-center rounded-lg" style={{
                        width: '72px', height: '44px',
                        border: isEmpresaPage ? '1px solid rgba(143,184,204,0.35)' : '1px solid rgba(34,197,94,0.35)',
                        background: isEmpresaPage ? 'rgba(143,184,204,0.07)' : 'rgba(34,197,94,0.07)',
                      }}>
                        <span className="text-[7px] font-black uppercase tracking-[0.12em] leading-tight text-center" style={{ color: isEmpresaPage ? '#8fb8cc' : '#22C55E' }}>Otros<br/>Bancos</span>
                      </div>
                    </div>
                  </div>
                  {/* CCI Interbank */}
                  <div className={`absolute bottom-0 left-0 right-0 px-2 pb-2 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <p className="text-[8px] font-black uppercase tracking-wider mb-1" style={{ color: 'rgba(13,27,42,0.45)' }}>Cuenta Interbancaria Interbank</p>
                    {[{ label: 'S/', value: CCI.soles, key: 'cci-s' }, { label: '$', value: CCI.dolares, key: 'cci-d' }].map(({ label, value, key }) => (
                      <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                          <span className="text-[8px] font-bold tabular-nums truncate" style={{ color: '#1E293B' }}>{value}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(value, key)}
                          className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all"
                          style={{ background: copiedKey === key ? 'rgba(34,197,94,0.2)' : 'rgba(13,27,42,0.07)', color: copiedKey === key ? '#16a34a' : 'rgba(13,27,42,0.5)' }}
                        >
                          {copiedKey === key ? '✓' : 'Copiar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>{/* fin grupo 2 */}
          </div>{/* fin flex container */}

          {/* Footer strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-5">
            {[
              { icon: CheckCircle2, label: 'Sin comisiones ocultas' },
              { icon: Clock,        label: 'En menos de 15 minutos' },
              { icon: Lock,         label: 'SSL cifrado' },
              { icon: Shield,       label: 'Datos protegidos por ley' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Icon className="w-3.5 h-3.5 text-primary" />{label}
              </span>
            ))}
          </div>
        </div>
      </section>


      {!isEmpresaPage && (
      <section className="py-10 sm:py-16" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">

            {/* LEFT — headline + 3 stats inline */}
            <div className="reveal-left flex flex-col justify-between">
              <div>
                <h2 className="font-display font-black text-3xl md:text-4xl leading-[1.1] mb-3" style={{ color: '#ffffff' }}>
                  Cada sol importa.<br />
                  <span className="text-primary">No lo pierdas</span> en el banco.
                </h2>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
                  <span className="w-3 h-px bg-primary inline-block" />Lo que ganas
                </span>
              </div>

              {/* 3 stats compactos */}
              <div className="grid grid-cols-3 gap-0" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
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
                    <div className="text-[11px] font-semibold leading-tight text-white">{label}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* end reveal-left */}

            {/* RIGHT — tabla compacta */}
            <div className="reveal-right flex flex-col h-full">

              {/* Tabla */}
              <div className="flex-1 flex flex-col rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}>

                {/* Encabezado único */}
                <div className="flex items-center px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
                        <span className="text-sm font-black" style={{ color: '#ffffff' }}>QoriCash</span>
                        <span className="text-[8px] font-black uppercase tracking-wider bg-primary text-white px-1.5 py-0.5 rounded-full">Mejor</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-14 text-right text-sm font-black tabular-nums text-primary">{qc_compra}</span>
                        <span className="w-14 text-right text-sm font-black tabular-nums text-primary">{qc_venta}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Bancos — tasas calculadas en base al TC de QoriCash con spreads típicos de banca */}
                {(() => {
                  const base_c = currentRates?.tipo_compra ?? parseFloat(buyRate);
                  const base_v = currentRates?.tipo_venta  ?? parseFloat(sellRate);
                  const banks = [
                    { name: 'BCP',        logo: '/BCP.png',        dc: -0.065, dv: +0.075 },
                    { name: 'Interbank',  logo: '/Interbank.png',  dc: -0.058, dv: +0.068 },
                    { name: 'BBVA',       logo: '/BBVA.png',       dc: -0.080, dv: +0.090 },
                    { name: 'Scotiabank', logo: '/Scotiabank.png', dc: -0.072, dv: +0.082 },
                  ];
                  return (
                    <div className="flex flex-col flex-1">
                    {banks.map(({ name, logo, dc, dv }, i, arr) => {
                      const compra = (base_c + dc).toFixed(3);
                      const venta  = (base_v + dv).toFixed(3);
                      return (
                        <div key={name} className="flex flex-1 items-center px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                          <div className="flex items-center gap-2.5 flex-1">
                            <img src={logo} alt={name} className="h-7 w-auto object-contain flex-shrink-0 opacity-70" />
                            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{name}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="w-14 text-right text-sm tabular-nums font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{compra}</span>
                            <span className="w-14 text-right text-sm tabular-nums font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{venta}</span>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  );
                })()}
              </div>

              <p className="text-[10px] mt-2 text-right" style={{ color: 'rgba(255,255,255,0.35)' }}>
                *Tasas bancarias referenciales.
              </p>
            </div>

          </div>
        </div>
      </section>
      )}

      {isEmpresaPage && isAuthenticated && (
      <section className="corp-dark py-6 sm:py-14 md:py-20" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #060E1A 0%, #0A1828 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(143,184,204,0.04) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* LEFT — TC Live + Sparkline + Tabla */}
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: 'rgba(143,184,204,0.6)' }}>
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: '#4ade80', opacity: 0.6 }} />
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: '#4ade80' }} />
                </span>
                Tipo de cambio referencial BCR
              </span>

              {(() => {
                const lastBcrp = bcrpData.length > 0 ? bcrpData[bcrpData.length - 1] : null;
                const bcrpCompra = lastBcrp?.compra?.toFixed(3) ?? '···';
                const bcrpVenta  = lastBcrp?.venta?.toFixed(3)  ?? '···';
                return (
                  <div className="flex flex-wrap items-end gap-4 sm:gap-8 mb-6 sm:mb-8">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(143,184,204,0.4)' }}>Compra BCR</div>
                      <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none" style={{ color: '#ffffff' }}>{bcrpCompra}</div>
                    </div>
                    <div className="self-stretch w-px mb-1" style={{ background: 'rgba(143,184,204,0.1)' }} />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(143,184,204,0.4)' }}>Venta BCR</div>
                      <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none" style={{ color: '#22c55e' }}>{bcrpVenta}</div>
                    </div>
                    {lastBcrp && (
                      <div className="self-end pb-1">
                        <span className="text-[9px]" style={{ color: 'rgba(143,184,204,0.3)' }}>{lastBcrp.fecha}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Sparkline */}
              <div className="rounded-xl overflow-hidden mb-4" style={{ background: 'rgba(143,184,204,0.04)', border: '1px solid rgba(143,184,204,0.1)' }}>
                {(() => {
                  const pts = bcrpData.length >= 2
                    ? bcrpData.map(d => d.venta)
                    : [3.412, 3.408, 3.405, 3.401, 3.399, 3.397, currentRates?.tipo_venta || 3.395];
                  const labels = bcrpData.length >= 2
                    ? bcrpData.map(d => d.fecha)
                    : ['Lun','Mar','Mié','Jue','Vie','Sáb','Hoy'];
                  const first = pts[0]; const last = pts[pts.length - 1];
                  const pct = first > 0 ? ((last - first) / first * 100) : 0;
                  const pctStr = `${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(2)}%`;
                  const pctColor = pct >= 0 ? '#4ade80' : '#f87171';
                  const min = Math.min(...pts) - 0.002;
                  const max = Math.max(...pts) + 0.002;
                  const W = 300; const H = 70;
                  const cx = (i: number) => (i / (pts.length - 1)) * W;
                  const cy = (v: number) => H - ((v - min) / (max - min)) * H;
                  const pathD = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${cx(i).toFixed(1)},${cy(v).toFixed(1)}`).join(' ');
                  const areaD = `${pathD} L${W},${H} L0,${H} Z`;
                  return (
                    <>
                      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(143,184,204,0.45)' }}>Tipo de Cambio Referencial BCR · {pts.length} días</span>
                        <span className="text-[10px] font-bold" style={{ color: pctColor }}>{pctStr}</span>
                      </div>
                      <div className="px-4 pb-3">
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 70, overflow: 'visible' }} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="corpSparkGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaD} fill="url(#corpSparkGrad)" />
                          <path d={pathD} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(34,197,94,0.4))' }} />
                          <circle cx={cx(pts.length - 1)} cy={cy(pts[pts.length - 1])} r="3" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.7))' }} />
                        </svg>
                        <div className="flex justify-between mt-1">
                          {labels.map((d, i) => (
                            <span key={i} className="text-[8px]" style={{ color: i === labels.length - 1 ? 'rgba(143,184,204,0.7)' : 'rgba(143,184,204,0.25)', fontWeight: i === labels.length - 1 ? 700 : 400 }}>{d}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Comparativa bancaria */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(143,184,204,0.1)' }}>
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'rgba(143,184,204,0.06)', borderBottom: '1px solid rgba(143,184,204,0.08)' }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(143,184,204,0.5)' }}>Comparativa bancaria</span>
                  <div className="flex gap-3 sm:gap-6">
                    <span className="w-10 sm:w-12 text-right text-[9px] font-bold uppercase" style={{ color: 'rgba(143,184,204,0.35)' }}>Compra</span>
                    <span className="w-10 sm:w-12 text-right text-[9px] font-bold uppercase" style={{ color: 'rgba(143,184,204,0.35)' }}>Venta</span>
                  </div>
                </div>
                {(() => {
                  const base_c = currentRates?.tipo_compra ?? 3.75;
                  const base_v = currentRates?.tipo_venta ?? 3.77;
                  return [
                    { name: 'QoriCash', c: base_c, v: base_v, highlight: true },
                    { name: 'BCP',       c: base_c - 0.065, v: base_v + 0.075, highlight: false },
                    { name: 'Interbank', c: base_c - 0.058, v: base_v + 0.068, highlight: false },
                    { name: 'BBVA',      c: base_c - 0.080, v: base_v + 0.090, highlight: false },
                  ].map(({ name, c, v, highlight }, i, arr) => (
                    <div key={name} className="flex items-center px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(143,184,204,0.06)' : 'none', background: highlight ? 'rgba(34,197,94,0.05)' : 'transparent', borderLeft: highlight ? '2px solid rgba(34,197,94,0.5)' : '2px solid transparent' }}>
                      <div className="flex-1 text-sm font-bold min-w-0 truncate" style={{ color: highlight ? '#22c55e' : 'rgba(255,255,255,0.5)' }}>{name}</div>
                      <div className="flex gap-3 sm:gap-6 flex-shrink-0">
                        <span className="text-sm tabular-nums font-medium w-10 sm:w-12 text-right" style={{ color: highlight ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>{c.toFixed(3)}</span>
                        <span className="text-sm tabular-nums font-medium w-10 sm:w-12 text-right" style={{ color: highlight ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>{v.toFixed(3)}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <p className="text-[9px] mt-2 text-right" style={{ color: 'rgba(143,184,204,0.25)' }}>*Tasas bancarias referenciales. No constituyen oferta formal.</p>
            </div>

            {/* RIGHT — Ventajas corporativas */}
            <div>
              <span className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: 'rgba(143,184,204,0.6)' }}>Por qué elegirnos</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-[1.15] mb-6 sm:mb-8" style={{ color: '#ffffff' }}>
                El tipo de cambio <br /><span style={{ color: '#22c55e' }}>que su empresa</span> merece.
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                {[
                  { icon: '⚡', title: 'Liquidación en menos de 15 min', sub: 'Confirmación en tiempo real' },
                  { icon: '🔒', title: 'Tipo de cambio pactado y garantizado', sub: 'El TC acordado no varía, independientemente del monto' },
                  { icon: '💼', title: 'Cotización personalizada para operaciones desde $5,000 a más', sub: 'Atención especializada para empresas de cualquier tamaño' },
                  { icon: '0%', title: 'Sin comisiones ni cargos ocultos', sub: 'Solo el tipo de cambio, nada más' },
                ].map(({ icon, title, sub }) => (
                  <div key={title} className="flex items-start gap-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(143,184,204,0.04)', border: '1px solid rgba(143,184,204,0.1)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.18)', color: '#22c55e' }}>{icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'rgba(143,184,204,0.5)' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl px-5 py-4 mb-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 100%)', border: '1px solid rgba(34,197,94,0.18)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(34,197,94,0.65)' }}>Ahorro estimado por $10,000</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black" style={{ color: '#22c55e' }}>S/ 800</span>
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>vs banco tradicional</span>
                </div>
              </div>

              <Link
                href="/login"
                className="flex sm:inline-flex justify-center items-center gap-2.5 font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#ffffff', boxShadow: '0 6px 20px rgba(34,197,94,0.3)' }}
              >
                Abrir cuenta corporativa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ══════════════════════════════════════
          CÓMO FUNCIONA — 3 pasos
      ══════════════════════════════════════ */}
      <style>{`
        @keyframes floatUp    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-7px)} }
        @keyframes slideArrow     { 0%{transform:translateX(-10px);opacity:0} 50%{opacity:1} 100%{transform:translateX(10px);opacity:0} }
        @keyframes slideArrowLeft { 0%{transform:translateX(10px);opacity:0}  50%{opacity:1} 100%{transform:translateX(-10px);opacity:0} }
        @keyframes dimPulse   { 0%,100%{opacity:.45} 50%{opacity:1} }
        @keyframes sparkle    { 0%,100%{transform:scale(0) rotate(0deg);opacity:0} 50%{transform:scale(1) rotate(180deg);opacity:1} }
        @keyframes flowDot    { 0%{left:0%;opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{left:100%;opacity:0} }
        @keyframes cardGlow   { 0%,100%{box-shadow:0 2px 12px rgba(13,27,42,.06)} 50%{box-shadow:0 8px 32px rgba(34,197,94,.12)} }
        @keyframes calcA   { 0%,28%{opacity:1} 34%,100%{opacity:0} }
        @keyframes calcB   { 0%,30%{opacity:0} 36%,62%{opacity:1} 68%,100%{opacity:0} }
        @keyframes calcC   { 0%,64%{opacity:0} 70%,94%{opacity:1} 100%{opacity:0} }
        @keyframes btnTap  { 0%,100%{background:rgba(255,255,255,0.07)} 50%{background:rgba(34,197,94,0.25)} }
        @keyframes moneyFly     { 0%{transform:translateX(-28px);opacity:0} 18%{opacity:1;transform:translateX(0)} 82%{opacity:1;transform:translateX(0)} 100%{transform:translateX(28px);opacity:0} }
        @keyframes moneyFlyLeft { 0%{transform:translateX(55px);opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateX(-55px);opacity:0} }
        @keyframes timerA  { 0%,22%{opacity:1} 28%,100%{opacity:0} }
        @keyframes timerB  { 0%,24%{opacity:0} 30%,55%{opacity:1} 61%,100%{opacity:0} }
        @keyframes timerC  { 0%,57%{opacity:0} 63%,88%{opacity:1} 94%,100%{opacity:0} }
        @keyframes timerD  { 0%,90%{opacity:0} 96%,100%{opacity:1} }
        @keyframes speedLine    { 0%{transform:scaleX(0) translateX(-50%);opacity:0} 50%{transform:scaleX(1) translateX(0);opacity:1} 100%{transform:scaleX(0) translateX(50%);opacity:0} }
        @keyframes checkRing    { 0%{stroke-dashoffset:113;opacity:1} 55%{stroke-dashoffset:0;opacity:1} 65%{stroke-dashoffset:0;opacity:0} 100%{stroke-dashoffset:113;opacity:0} }
        @keyframes checkDone    { 0%,58%{opacity:0;transform:scale(0.6)} 68%,88%{opacity:1;transform:scale(1)} 96%,100%{opacity:0;transform:scale(0.6)} }
        @keyframes procText     { 0%,52%{opacity:1} 62%,100%{opacity:0} }
        @keyframes doneText     { 0%,60%{opacity:0} 70%,86%{opacity:1} 94%,100%{opacity:0} }
        @keyframes blobMorph1 { 0%,100%{border-radius:60% 40% 55% 45%/50% 60% 40% 50%;transform:translate(0,0) scale(1)} 33%{border-radius:40% 60% 45% 55%/60% 40% 60% 40%;transform:translate(18px,-12px) scale(1.06)} 66%{border-radius:55% 45% 60% 40%/45% 55% 45% 55%;transform:translate(-10px,16px) scale(0.96)} }
        @keyframes blobMorph2 { 0%,100%{border-radius:45% 55% 40% 60%/60% 45% 55% 40%;transform:translate(0,0) scale(1)} 40%{border-radius:60% 40% 55% 45%/40% 60% 40% 60%;transform:translate(-20px,10px) scale(1.08)} 75%{border-radius:35% 65% 50% 50%/55% 45% 60% 40%;transform:translate(12px,-18px) scale(0.94)} }
        @keyframes blobMorph3 { 0%,100%{border-radius:50% 50% 45% 55%/55% 45% 55% 45%;transform:translate(0,0) scale(1)} 50%{border-radius:65% 35% 55% 45%/40% 65% 35% 60%;transform:translate(15px,20px) scale(1.05)} }
      `}</style>

      {!isEmpresaPage && (
      <section id="como-funciona" className="pt-8 sm:pt-12 pb-12 sm:pb-20" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4" style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.65)' }}>
              Simple como siempre debió ser
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl" style={{ color: '#ffffff' }}>3 pasos. Menos de 15 minutos.</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">

            {/* ── CARD 01 — Cotiza en línea ── */}
            <div className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col" style={{ border: '1px solid rgba(13,27,42,0.1)', animation: 'cardGlow 4s ease-in-out infinite' }}>
              {/* Illustration zone */}
              <div className="relative overflow-hidden px-7 pt-7 pb-5" style={{ background: '#1E293B', height: '210px' }}>
                {/* Ghost number */}
                <span className="absolute -right-3 -bottom-4 font-black select-none leading-none pointer-events-none" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.04)' }}>01</span>
                {/* Top-right glow */}
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%)', transform: 'translate(30%, -30%)' }} />

                {/* Dos opciones: Web o Asesor */}
                <div className="relative z-10 flex flex-col gap-3 justify-center h-full" style={{ animation: 'floatUp 4s ease-in-out infinite' }}>

                  {/* Opción 1 — Web */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="14" rx="2" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5"/>
                        <path d="M8 18l1.5 2h5L16 18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 9h6M9 12h4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
                        <circle cx="6.5" cy="7.5" r="1" fill="rgba(255,255,255,0.3)"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">Cotiza en la web</div>
                      <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Ingresa tu monto al instante</div>
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>o</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  </div>

                  {/* Opción 2 — Asesor WhatsApp */}
                  <a
                    href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20mi%20tipo%20de%20cambio%20con%20un%20asesor."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#25D366' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.849L.073 23.36a.75.75 0 0 0 .92.92l5.521-1.453A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.735 9.735 0 0 1-5.031-1.401l-.36-.214-3.733.983.997-3.634-.235-.374A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold" style={{ color: '#25D366' }}>Contacta con un Trader</div>
                      <div className="text-[9px]" style={{ color: 'rgba(37,211,102,0.6)' }}>Respuesta inmediata por WhatsApp</div>
                    </div>
                  </a>

                </div>
              </div>

              {/* Text body */}
              <div id="step-text-1" className="step-text-body px-6 py-5 flex-1" style={{ background: 'rgba(255,255,255,0.75)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(13,27,42,0.35)' }}>Paso 01</span>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Cotiza en línea</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>Ingresa el monto y ve tu tipo de cambio exacto al instante, sin sorpresas ni letras chicas.</p>
              </div>
            </div>

            {/* ── CARD 02 — Transfiere ── */}
            <div className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col" style={{ border: '1px solid rgba(13,27,42,0.1)', boxShadow: '0 2px 12px rgba(13,27,42,0.06)', animationDelay: '0.4s' }}>
              <div className="relative overflow-hidden px-7 py-5 flex flex-col justify-center" style={{ background: '#1E293B', height: '210px' }}>
                <span className="absolute -right-3 -bottom-4 font-black select-none leading-none pointer-events-none" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.04)' }}>02</span>
                <div className="absolute top-0 left-0 w-28 h-28 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%)', transform: 'translate(-30%, -30%)' }} />

                {/* Transfer flow — BIDIRECCIONAL */}
                <div className="relative z-10 flex items-center gap-3">

                  {/* Left: Tu banco */}
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                        {/* Frontón / triángulo techo */}
                        <path d="M14 3L26 10H2L14 3Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinejoin="round"/>
                        {/* Fachada */}
                        <rect x="2" y="10" width="24" height="2" fill="rgba(255,255,255,0.25)"/>
                        {/* Columnas */}
                        <rect x="4"  y="12" width="2.5" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
                        <rect x="9"  y="12" width="2.5" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
                        <rect x="14" y="12" width="2.5" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
                        <rect x="19" y="12" width="2.5" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
                        {/* Base */}
                        <rect x="1" y="22" width="26" height="2.5" rx="1" fill="rgba(255,255,255,0.2)"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Tu banco</span>
                  </div>

                  {/* Middle: dos carriles de flechas + moneda central */}
                  <div className="flex-1 flex flex-col gap-2.5 relative">

                    {/* Moneda $ moviéndose der → izq (QoriCash → Tu banco) */}
                    <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ animation: 'moneyFlyLeft 2s ease-in-out infinite', left: '50%', marginLeft: '-12px' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 10px rgba(34,197,94,0.5)', border: '1px solid rgba(34,197,94,0.6)' }}>$</div>
                    </div>

                    {/* Carril →  (tu banco envía a QoriCash) */}
                    <div className="flex flex-col gap-0.5">
                      <div className="relative w-full h-4 overflow-hidden">
                        <div className="absolute top-1/2 -translate-y-px h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05))' }} />
                        {[0, 0.55, 1.1].map((d) => (
                          <div key={d} className="absolute top-1/2 -translate-y-1/2 left-0" style={{ animation: `slideArrow 1.6s ease-in-out ${d}s infinite` }}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M1 5.5h9M6.5 2.5l3 3-3 3" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>USD / S/</span>
                        <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.15)' }}>envías</span>
                      </div>
                    </div>

                    {/* Carril ← (QoriCash devuelve a tu banco) */}
                    <div className="flex flex-col gap-0.5">
                      <div className="relative w-full h-4 overflow-hidden">
                        <div className="absolute top-1/2 -translate-y-px h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.1), rgba(34,197,94,0.45), rgba(34,197,94,0.1))' }} />
                        {[0, 0.55, 1.1].map((d) => (
                          <div key={d} className="absolute top-1/2 -translate-y-1/2 right-0" style={{ animation: `slideArrowLeft 1.6s ease-in-out ${d}s infinite` }}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M10 5.5H1M4.5 2.5l-3 3 3 3" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[7px]" style={{ color: 'rgba(34,197,94,0.4)' }}>recibes</span>
                        <span className="text-[8px] font-bold" style={{ color: 'rgba(34,197,94,0.55)' }}>S/ / USD</span>
                      </div>
                    </div>

                  </div>

                  {/* Right: QoriCash */}
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)' }}>
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                        {/* Moneda exterior */}
                        <circle cx="14" cy="14" r="11" stroke="#22c55e" strokeWidth="1.3" opacity="0.4"/>
                        <circle cx="14" cy="14" r="8.5" stroke="#22c55e" strokeWidth="1" opacity="0.25"/>
                        {/* Letra Q estilizada */}
                        <circle cx="14" cy="13.5" r="5" stroke="#22c55e" strokeWidth="1.8" opacity="0.85"/>
                        <path d="M17 17l3 3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                        {/* Brillo */}
                        <path d="M10 11.5 Q11.5 9.5 14 9.5" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold" style={{ color: '#22c55e' }}>QoriCash</span>
                  </div>

                </div>

                {/* Badge de bancos + confirmación */}
                <div className="relative z-10 mt-3 flex items-center justify-center gap-2 flex-wrap">
                  {['BCP','Interbank','BanBif','CCI+'].map((b) => (
                    <span key={b} className="rounded-md px-2 py-0.5 text-[8px] font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}>{b}</span>
                  ))}
                </div>
              </div>

              <div id="step-text-2" className="step-text-body px-6 py-5 flex-1" style={{ background: 'rgba(255,255,255,0.75)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(13,27,42,0.35)' }}>Paso 02</span>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Transfiere a QoriCash</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>Transfiere directo desde BCP, Interbank o BanBif, o vía CCI desde BBVA, Scotiabank, Pichincha y cualquier otro banco del Perú.</p>
              </div>
            </div>

            {/* ── CARD 03 — Recibe tu dinero ── */}
            <div className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col" style={{ border: '1px solid rgba(13,27,42,0.1)', boxShadow: '0 2px 12px rgba(13,27,42,0.06)', animationDelay: '0.8s' }}>
              <div className="relative overflow-hidden px-7 pt-7 pb-5 flex flex-col items-center justify-center" style={{ background: '#1E293B', height: '210px' }}>
                <span className="absolute -right-3 -bottom-4 font-black select-none leading-none pointer-events-none" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.04)' }}>03</span>
                {/* Central green glow */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(34,197,94,0.12), transparent 65%)' }} />

                {/* Check cargando → check completo */}
                <div className="relative z-10 flex flex-col items-center gap-4">

                  {/* Círculo de progreso SVG */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 52 52">
                      {/* Track gris */}
                      <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5"/>
                      {/* Progreso verde */}
                      <circle cx="26" cy="26" r="22" fill="none" stroke="#22c55e" strokeWidth="2.5"
                        strokeLinecap="round" strokeDasharray="138"
                        style={{ animation: 'checkRing 3.5s ease-in-out infinite', filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }}/>
                    </svg>

                    {/* Porcentaje mientras carga */}
                    <div className="absolute flex flex-col items-center" style={{ animation: 'procText 3.5s ease-in-out infinite' }}>
                      <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>Procesando</span>
                      <span className="text-lg font-black font-mono text-white">···</span>
                    </div>

                    {/* Check cuando completa */}
                    <div className="absolute flex flex-col items-center" style={{ animation: 'checkDone 3.5s ease-in-out infinite', opacity: 0 }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="16" fill="rgba(34,197,94,0.15)"/>
                        <path d="M10 18l6 6 10-10" stroke="#22c55e" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Texto estado */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-5">
                      <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)', animation: 'procText 3.5s ease-in-out infinite' }}>Verificando transferencia...</span>
                      <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold" style={{ color: '#22c55e', animation: 'doneText 3.5s ease-in-out infinite', opacity: 0 }}>¡Transferencia enviada!</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <Clock className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] font-bold text-green-400">menos de 15 min</span>
                    </div>
                  </div>

                </div>
              </div>

              <div id="step-text-3" className="step-text-body px-6 py-5 flex-1" style={{ background: 'rgba(255,255,255,0.75)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(13,27,42,0.35)' }}>Paso 03</span>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Recibe tu dinero</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>Te transferimos el contravalor en menos de 15 minutos. Sin comisiones, sin cargos ocultos.</p>
              </div>
            </div>

          </div>

          <div className="text-center">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-2.5 text-white font-bold px-9 py-4 rounded-full transition-all text-sm hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}
            >
              Empezar ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {isEmpresaPage && isAuthenticated && (
      <section className="corp-dark pt-6 pb-12 sm:pt-8 sm:pb-20" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #0A1828 0%, #060E1A 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(143,184,204,0.03) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <span className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(143,184,204,0.55)' }}>Mercados globales</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl" style={{ color: '#ffffff' }}>
                Noticias que mueven <span style={{ color: '#22c55e' }}>el tipo de cambio</span>
              </h2>
            </div>
            {noticiasCorp.length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0 sm:mt-8">
                <button onClick={() => setNewsCorpIdx(i => (i - 1 + noticiasCorp.length) % noticiasCorp.length)} className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95" style={{ background: 'rgba(143,184,204,0.1)', border: '1px solid rgba(143,184,204,0.2)', color: 'rgba(143,184,204,0.7)', cursor: 'pointer' }}>
                  <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
                <button onClick={() => setNewsCorpIdx(i => (i + 1) % noticiasCorp.length)} className="w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95" style={{ background: 'rgba(143,184,204,0.1)', border: '1px solid rgba(143,184,204,0.2)', color: 'rgba(143,184,204,0.7)', cursor: 'pointer' }}>
                  <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>

          {noticiasCorp.length > 0 ? (
            <>
              {/* Main carousel card */}
              <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'rgba(143,184,204,0.05)', border: '1px solid rgba(143,184,204,0.12)' }}>
                <div className="grid sm:grid-cols-5">
                  {noticiasCorp[newsCorpIdx]?.imagen && (
                    <div className="sm:col-span-2 relative overflow-hidden" style={{ minHeight: 180 }}>
                      <Image
                        src={noticiasCorp[newsCorpIdx].imagen!}
                        alt={noticiasCorp[newsCorpIdx].titulo}
                        fill
                        sizes="(max-width: 640px) 100vw, 40vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,14,26,0.3), transparent)' }} />
                    </div>
                  )}
                  <div className={`p-5 sm:p-6 flex flex-col justify-between ${noticiasCorp[newsCorpIdx]?.imagen ? 'sm:col-span-3' : 'sm:col-span-5'}`}>
                    <div>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                        {noticiasCorp[newsCorpIdx]?.categoria}
                      </span>
                      <h3 className="font-display font-bold text-lg leading-snug mb-3 text-white" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {noticiasCorp[newsCorpIdx]?.titulo}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(143,184,204,0.6)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {noticiasCorp[newsCorpIdx]?.descripcion}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(143,184,204,0.1)' }}>
                      <span className="text-[11px]" style={{ color: 'rgba(143,184,204,0.4)' }}>
                        {noticiasCorp[newsCorpIdx]?.fecha
                          ? new Date(noticiasCorp[newsCorpIdx].fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {noticiasCorp.map((_, i) => (
                          <button key={i} onClick={() => setNewsCorpIdx(i)} style={{ width: i === newsCorpIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === newsCorpIdx ? '#22c55e' : 'rgba(143,184,204,0.25)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {noticiasCorp.filter((_, i) => i !== newsCorpIdx).slice(0, 3).map((n) => (
                  <button key={n.id} onClick={() => setNewsCorpIdx(noticiasCorp.indexOf(n))} className="text-left rounded-xl p-3 transition-all hover:scale-[1.02]" style={{ background: 'rgba(143,184,204,0.04)', border: '1px solid rgba(143,184,204,0.09)', cursor: 'pointer' }}>
                    <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)' }}>{n.categoria}</span>
                    <p className="text-[11px] font-semibold text-white leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{n.titulo}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl flex items-center justify-center" style={{ background: 'rgba(143,184,204,0.04)', border: '1px solid rgba(143,184,204,0.1)', height: 280 }}>
              <div className="flex gap-1.5">
                {[0, 0.15, 0.3].map(d => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'rgba(143,184,204,0.3)', animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-10">
            <Link
              href="/login"
              className="flex sm:inline-flex justify-center items-center gap-2.5 font-bold px-9 py-4 rounded-full transition-all text-sm hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#ffffff', boxShadow: '0 8px 24px rgba(34,197,94,0.32)' }}
            >
              Abrir cuenta corporativa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* AlertaTCBanner — solo en página personas */}
      {!isAuthenticated && !isEmpresaPage && <AlertaTCBanner />}


      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="text-gray-400">
        <div className="border-b border-white/5 py-3 px-4 sm:px-8 lg:px-10">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3" style={{ background: 'transparent', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[10px] sm:text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>Empresa Registrada</div>
                  <div className="text-[9px] sm:text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>RUC: 20615113698 · Lima, Perú</div>
                </div>
              </div>
              <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3" style={{ background: 'transparent', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[10px] sm:text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>Registrados ante la SBS</div>
                  <div className="text-[9px] sm:text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Res. N° 00313-2026</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[11px] text-white">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-white" /> SSL cifrado</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-white" /> Datos protegidos por ley</span>
            </div>
          </div>
        </div>
        <div className="w-full px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto">

            {/* Fila 1 — Logo + descripción */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                {isEmpresaPage ? (
                  <div className="relative inline-flex flex-shrink-0">
                    <img src="/logo-principal.png" alt="QoriCash" aria-hidden className="h-9 w-auto invisible" />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)',
                      WebkitMaskImage: "url('/logo-principal.png')",
                      maskImage: "url('/logo-principal.png')",
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                    }} />
                  </div>
                ) : (
                  <img src="/logo-principal.png" alt="QoriCash" className="h-9 w-auto" />
                )}
                <span className="text-xl font-display font-bold" style={isEmpresaPage ? { background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 55%, #1e3a50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : { color: '#ffffff' }}>QoriCash</span>
              </Link>
              <span className="hidden sm:block w-px h-6 bg-white/10" />
              <p className="hidden sm:block text-xs leading-relaxed" style={{ color: isEmpresaPage ? '#6b7280' : '#ffffff' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>
            </div>
            <p className="sm:hidden text-xs leading-relaxed mb-5" style={{ color: isEmpresaPage ? '#6b7280' : '#ffffff' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>

            {/* Fila 2 — Links en 3 columnas */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8 mb-6">

              {/* Servicios */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest">Servicios</h4>
                <ul className="space-y-2">
                  <li><Link href="/servicios#compra" className="hover:text-white transition-colors text-[11px] sm:text-xs">Compra USD</Link></li>
                  <li><Link href="/servicios#venta" className="hover:text-white transition-colors text-[11px] sm:text-xs">Venta USD</Link></li>
                  <li><Link href="/servicios#tipo-cambio" className="hover:text-white transition-colors text-[11px] sm:text-xs">Tipo de cambio</Link></li>
                  <li><Link href="/noticias" className="hover:text-white transition-colors text-[11px] sm:text-xs">Noticias</Link></li>
                  <li><Link href="/preguntas-frecuentes" className="hover:text-white transition-colors text-[11px] sm:text-xs">FAQ</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors text-[11px] sm:text-xs">Nosotros</Link></li>
                  <li><Link href="/terminos-condiciones" className="hover:text-white transition-colors text-[11px] sm:text-xs">Términos</Link></li>
                  <li><Link href="/politica-privacidad" className="hover:text-white transition-colors text-[11px] sm:text-xs">Privacidad</Link></li>
                  <li><Link href="/politica-cookies" className="hover:text-white transition-colors text-[11px] sm:text-xs">Cookies</Link></li>
                  <li><Link href="/libro-reclamaciones" className="hover:text-white transition-colors text-[11px] sm:text-xs">Reclamaciones</Link></li>
                </ul>
              </div>

              {/* Contacto */}
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-white font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest">Contacto</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors text-[11px] sm:text-xs">info@qoricash.pe</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-[11px] sm:text-xs">910 624 404</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-[11px] sm:text-xs leading-relaxed">Av. Brasil N° 2790, Int. 504 · Pueblo Libre</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[11px] sm:text-xs">Lun–Vie 9–6 pm · Sáb 9–1 pm</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Copyright */}
            <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-600">
              <p>© 2025 QoriCash. Todos los derechos reservados.</p>
              <div className="flex items-center gap-3">
                <Link href="/terminos-condiciones" className="hover:text-gray-400 transition-colors">Términos</Link>
                <Link href="/politica-privacidad" className="hover:text-gray-400 transition-colors">Privacidad</Link>
                <Link href="/libro-reclamaciones" className="hover:text-gray-400 transition-colors">Reclamaciones</Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
