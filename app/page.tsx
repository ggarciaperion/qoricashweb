'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Calculator from '@/components/Calculator';
import AnimatedStat from '@/components/AnimatedStat';
import BgImage from '@/components/BgImage';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import {
  ArrowRight, Shield, Clock, TrendingUp, TrendingDown, Minus,
  Users, CheckCircle2, Lock, UserPlus, Banknote, DollarSign,
  LogOut, User as UserIcon, ChevronDown, Menu, X,
  HelpCircle, Gift, Calculator as CalculatorIcon,
  Building2, Zap, HandCoins,
} from 'lucide-react';
import AlertaTCModal from '@/components/AlertaTCModal';
import AlertaTCBanner from '@/components/AlertaTCBanner';
import MarketTicker from '@/components/MarketTicker';
import MarketSection from '@/components/MarketSection';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const isEmpresaPage = pathname === '/empresa';
  const { user, isAuthenticated, logout } = useAuthStore();
  const [topBarHidden, setTopBarHidden] = useState(false);
  const [headerBg, setHeaderBg] = useState(!isEmpresaPage ? '#1463FF' : '#ffffff');
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const wspMediaRef = useRef<HTMLDivElement>(null);
  const banksMediaRef = useRef<HTMLDivElement>(null);
  const [wspActiveStep, setWspActiveStep] = useState(0);
  const [wspResetting, setWspResetting] = useState(false);
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');

  const [profileMismatchModal, setProfileMismatchModal] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const userBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutPhase, setLogoutPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [isBanksSectionVisible, setIsBanksSectionVisible] = useState(false);
  const banksSectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeBankTab, setActiveBankTab] = useState<'bcp' | 'interbank' | 'banbif' | 'cci'>('bcp');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  // ── Ruta protegida ─────────────────────────────────────────────────────
  // Persona natural (DNI/CE) no puede navegar a /empresa → redirect a /
  // Persona jurídica (RUC)   no puede navegar a /       → redirect a /empresa
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (!isEmpresaPage && user.document_type === 'RUC') {
      router.replace('/empresa');
    } else if (isEmpresaPage && user.document_type !== 'RUC') {
      router.replace('/');
    }
  }, [isAuthenticated, user, isEmpresaPage]);

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

  const { currentRates, fetchRates, startRateSubscription } = useExchangeStore();

  // Cargar y suscribir tipos de cambio en tiempo real al montar la página
  useEffect(() => {
    fetchRates();
    const unsub = startRateSubscription();
    return () => unsub();
  }, []);

  useEffect(() => {
    const onScroll = () => setTopBarHidden(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animaciones de entrada del panel de media (foto + cards + pills)
  useEffect(() => {
    const el = heroMediaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('hero-media-visible');
        } else {
          el.classList.remove('hero-media-visible');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animaciones de entrada + secuencia de checks — sección WhatsApp
  useEffect(() => {
    const el = wspMediaRef.current;
    if (!el) return;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    const startCycle = () => {
      clearTimers();
      setWspResetting(false);
      setWspActiveStep(0);
      const t1 = setTimeout(() => setWspActiveStep(1), 1200);
      const t2 = setTimeout(() => setWspActiveStep(2), 2300);
      const t3 = setTimeout(() => setWspActiveStep(3), 3400);
      const tOut = setTimeout(() => setWspResetting(true), 4600);   // fade out badges
      const tReset = setTimeout(() => { setWspResetting(false); setWspActiveStep(0); }, 5200); // reset limpio
      const t4 = setTimeout(startCycle, 5600);                      // reinicia ciclo
      timers = [t1, t2, t3, tOut, tReset, t4];
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('wsp-media-visible');
          startCycle();
        } else {
          el.classList.remove('wsp-media-visible');
          clearTimers();
          setWspActiveStep(0);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimers(); };
  }, []);

  // Animaciones de entrada sección Bancos
  useEffect(() => {
    const el = banksMediaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('banks-section-visible');
        } else {
          el.classList.remove('banks-section-visible');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sincroniza el color del header con la sección que está detrás de él
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el) return;
    const heroColor = !isEmpresaPage ? '#1463FF' : '#ffffff';
    setHeaderBg(heroColor);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderBg(entry.isIntersecting ? heroColor : '#ffffff');
      },
      { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isEmpresaPage]);

  // Auto-redirigir solo si el usuario llega directamente (sin historial de navegación previo dentro del app)
  // No redirigir cuando viene desde el dashboard usando "Página de inicio"

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
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isEmpresaPage) return;
    fetch('/api/bcrp-tc').then(r => r.json()).then(res => {
      if (res.ok && Array.isArray(res.data) && res.data.length > 0) setBcrpData(res.data);
    }).catch(() => {});
  }, [isEmpresaPage]);

  const displayName = user?.document_type === 'RUC'
    ? (user?.razon_social || user?.nombres)
    : (user?.nombres?.trim().split(/\s+/)[0] ?? '');

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setLogoutPhase('loading');
    await new Promise(r => setTimeout(r, 2200));
    setLogoutPhase('done');
    await new Promise(r => setTimeout(r, 2000));
    await logout();
    window.location.href = '/';
  };

  return (
    <>
    {/* -- Modal conflicto de perfil -- */}
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
              style={{ background: '#0A0A0A' }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}

    {showLogoutModal && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
        onClick={() => setShowLogoutModal(false)}>
        <div className="w-full max-w-xs rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', animation: 'loFadeUp 0.22s ease-out both' }}
          onClick={e => e.stopPropagation()}>
          <style>{`@keyframes loFadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }`}</style>
          <div className="flex flex-col items-center px-6 pt-7 pb-5 text-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.07)' }}>
              <LogOut className="w-5 h-5" style={{ color: '#0D1117' }} />
            </div>
            <p className="text-base font-black text-gray-900 leading-tight">¿Cerrar sesión?</p>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Tu sesión se cerrará de forma segura.<br />Podrás volver a ingresar cuando quieras.
            </p>
          </div>
          <div className="flex gap-2.5 px-5 py-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{ background: '#f1f5f9', color: '#374151' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
            >
              Cancelar
            </button>
            <button
              onClick={() => { setShowLogoutModal(false); handleLogout(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center justify-center gap-1.5"
              style={{ background: '#0A0A0A' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1f1f1f')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0A')}
            >
              <LogOut className="w-3.5 h-3.5" /> Confirmar
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}

    {logoutPhase !== 'idle' && typeof document !== 'undefined' && createPortal(
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: '#F8FAFC',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes loRingDraw  { from { stroke-dashoffset: 415; } to { stroke-dashoffset: 0; } }
          @keyframes loPulse     { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(0.92); opacity:0.75; } }
          @keyframes loFadeUp2   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes loScaleIn   { 0% { transform:scale(0); opacity:0; } 65% { transform:scale(1.18); opacity:1; } 100% { transform:scale(1); opacity:1; } }
          @keyframes loCheckDraw { from { stroke-dashoffset:60; } to { stroke-dashoffset:0; } }
          @keyframes loDot       { 0%,80%,100% { transform:scale(0); opacity:0; } 40% { transform:scale(1); opacity:1; } }
          @keyframes loOrbit     { from { transform:rotate(0deg) translateX(66px); } to { transform:rotate(360deg) translateX(66px); } }
          @keyframes loBarFill   { from { width:0%; } to { width:100%; } }
          @keyframes loSlideIn   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        `}</style>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, animation: 'loSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both', position: 'relative' }}>

          {/* Ring + logo */}
          <div style={{ position: 'relative', width: 164, height: 164, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <svg width="164" height="164" viewBox="0 0 164 164" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx="82" cy="82" r="66" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5" />
              {logoutPhase === 'loading' && (
                <circle cx="82" cy="82" r="66" fill="none" stroke="#0A0A0A"
                  strokeWidth="5" strokeLinecap="round"
                  strokeDasharray="415" strokeDashoffset="415"
                  style={{ animation: 'loRingDraw 2.1s cubic-bezier(0.4,0,0.2,1) forwards' }} />
              )}
              {logoutPhase === 'done' && (
                <circle cx="82" cy="82" r="66" fill="none" stroke="#0A0A0A"
                  strokeWidth="5" strokeLinecap="round"
                  strokeDasharray="415" strokeDashoffset="0" />
              )}
            </svg>

            {logoutPhase === 'loading' && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#0A0A0A',
                  animation: 'loOrbit 2.1s linear infinite',
                }} />
              </div>
            )}

            <div style={{
              width: 108, height: 108, borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>
              {logoutPhase === 'loading' ? (
                <img src="/vg.png" alt="Qoricash" style={{ width: 58, height: 58, objectFit: 'contain', animation: 'loPulse 1.8s ease-in-out infinite' }} />
              ) : (
                <div style={{ animation: 'loScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                  <svg width="50" height="50" viewBox="0 0 44 44" fill="none">
                    <circle cx="22" cy="22" r="22" fill="#0A0A0A" />
                    <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="60" strokeDashoffset="60"
                      style={{ animation: 'loCheckDraw 0.5s ease-out 0.2s forwards' }} />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Text block */}
          <div style={{ textAlign: 'center' }}>
            {logoutPhase === 'loading' ? (
              <>
                <p style={{ fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#0D1117' }}>
                  Cerrando sesión...
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 12 }}>
                  {[0, 0.22, 0.44].map((delay, i) => (
                    <span key={i} style={{
                      display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#0A0A0A',
                      animation: `loDot 1.3s ease-in-out ${delay}s infinite`,
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12, fontWeight: 500 }}>
                  Guardando tu información de forma segura
                </p>
              </>
            ) : (
              <div style={{ animation: 'loFadeUp2 0.45s ease-out both' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', margin: '0 0 8px' }}>
                  Hasta pronto
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#0D1117', margin: 0, letterSpacing: '-0.025em' }}>
                  {displayName}
                </p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
                  Tu sesión fue cerrada con éxito
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.06)' }}>
          <div style={{
            height: '100%',
            background: '#0A0A0A',
            width: logoutPhase === 'done' ? '100%' : undefined,
            animation: logoutPhase === 'loading' ? 'loBarFill 2.1s cubic-bezier(0.4,0,0.6,1) forwards' : 'none',
            transition: logoutPhase === 'done' ? 'width 0.4s ease' : 'none',
          }} />
        </div>
      </div>,
      document.body
    )}

    <main className="min-h-screen">
      {/* == FONDO FIJO == */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: '#F8FAFC' }} />

      {/* == TOP BAR — solo visible para visitantes no autenticados == */}
      {!isAuthenticated && <div
        className="fixed left-0 right-0 w-full z-[51] transition-transform duration-300 ease-in-out"
        style={{
          top: 0,
          transform: topBarHidden ? 'translateY(-100%)' : 'translateY(0)',
          background: '#F3F4F6',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="flex items-center gap-1" style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.04em' }}>
          <button
            onClick={() => {
              if ('startViewTransition' in document) {
                (document as any).startViewTransition(() => router.push('/'));
              } else { router.push('/'); }
            }}
            className="px-3 py-0.5 rounded-full transition-all duration-200"
            style={{
              color: !isEmpresaPage ? '#111827' : '#9CA3AF',
              fontWeight: !isEmpresaPage ? 700 : 500,
              background: !isEmpresaPage ? 'rgba(0,0,0,0.07)' : 'transparent',
            }}
          >
            Personas
          </button>
          <span style={{ color: '#D1D5DB' }}>·</span>
          <button
            onClick={() => {
              if ('startViewTransition' in document) {
                (document as any).startViewTransition(() => router.push('/empresa'));
              } else { router.push('/empresa'); }
            }}
            className="px-3 py-0.5 rounded-full transition-all duration-200"
            style={{
              color: isEmpresaPage ? '#111827' : '#9CA3AF',
              fontWeight: isEmpresaPage ? 700 : 500,
              background: isEmpresaPage ? 'rgba(0,0,0,0.07)' : 'transparent',
            }}
          >
            Negocios
          </button>
        </div>
      </div>}

      {/* == NAVBAR == */}
      <header
        className="fixed left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out"
        style={{
          top: isAuthenticated ? 0 : (topBarHidden ? 0 : 36),
          background: headerBg,
          borderBottom: headerBg === '#ffffff' ? '1px solid rgba(0,0,0,0.06)' : 'none',
          boxShadow: headerBg === '#ffffff' ? '0 1px 8px rgba(0,0,0,0.04)' : 'none',
          transition: 'background 0.3s ease, top 0.3s ease',
        }}
      >
        <nav className="w-full">
          <div className={`relative flex justify-between items-center h-20 ${!isEmpresaPage ? 'px-6 sm:px-10 lg:px-16' : 'max-w-5xl mx-auto px-6 sm:px-8 lg:px-10'}`}>

            {/* TC rates — centro del header, visible solo al hacer scroll */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2"
              style={{ opacity: headerBg === '#ffffff' ? 1 : 0, transform: `translateX(-50%) translateY(${headerBg === '#ffffff' ? '0px' : '6px'})`, transition: 'opacity 0.35s ease, transform 0.35s ease', pointerEvents: headerBg === '#ffffff' ? 'auto' : 'none' }}>
              <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ background: '#F8FAFF', border: '1px solid #E0EAFF' }}>
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>Compramos</div>
                  <div className="font-black text-base leading-tight" style={{ color: '#0D1117' }}>S/ {(currentRates?.tipo_compra ?? parseFloat(buyRate)).toFixed(4)}</div>
                </div>
                <div style={{ width: 1, height: 32, background: '#E0EAFF' }} />
                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>Vendemos</div>
                  <div className="font-black text-base leading-tight" style={{ color: '#1463FF' }}>S/ {(currentRates?.tipo_venta ?? parseFloat(sellRate)).toFixed(4)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <img src="/rep.png" alt="Qoricash" style={{ height: 33, width: 'auto', objectFit: 'contain', filter: headerBg === '#ffffff' ? 'brightness(0)' : 'none', transition: 'filter 0.3s ease' }} />
                {isEmpresaPage && (
                  <span className="self-center text-[11px] font-bold uppercase" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.45em' }}>Corporate</span>
                )}
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
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
                      className="relative flex items-center gap-2 text-sm font-medium transition-all duration-200 group py-1 hover:opacity-80"
                      style={{ color: '#ffffff' }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                        style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.35)' }}>
                        {((user?.razon_social || user?.nombres) ?? '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate">
                        {user?.document_type === 'RUC'
                          ? user?.razon_social || user?.nombres
                          : user?.nombres?.trim().split(/\s+/)[0]}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href={`/login?from=${isEmpresaPage ? '/empresa' : '/'}`}
                    className="nav-login text-sm font-medium"
                    style={{ color: headerBg === '#ffffff' ? '#1463FF' : 'rgba(255,255,255,0.85)', transition: 'color 0.3s ease' }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href={isEmpresaPage ? '/crear-cuenta?tipo=empresa' : '/crear-cuenta'}
                    className="nav-register text-sm font-bold px-5 py-2 rounded-full"
                    style={{ background: '#ffffff', color: '#1247CC', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
                  >
                    Regístrate
                  </Link>
                </>
              )}
            </div>
            {/* Mobile - hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              {isAuthenticated && user && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.35)' }}>
                  {((user.razon_social || user.nombres) ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 transition hover:opacity-70" style={{ color: '#ffffff' }} aria-label="Toggle mobile menu">
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
          ...{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' },
          boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
        }}
      >
        <div className="px-4 pt-4 pb-5 overflow-y-auto" style={{ maxHeight: '70vh' }}>

          {/* Separador y acciones de cuenta */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            {isAuthenticated ? (
              <>
                <p className="text-[10px] font-bold tracking-widest uppercase px-2 mb-2 pt-3" style={{ color: '#9CA3AF' }}>Mi Cuenta</p>
                <div className="space-y-0.5">
                  <Link href="/dashboard?perfil=1" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-gray-50" style={{ color: '#374151' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.05)' }}><UserIcon className="w-4 h-4" style={{ color: '#6B7280' }} /></div>
                    <span className="font-medium flex-1 text-sm">Mi perfil</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-gray-50" style={{ color: '#374151' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.05)' }}><Banknote className="w-4 h-4" style={{ color: '#6B7280' }} /></div>
                    <span className="font-medium flex-1 text-sm">Mi Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <a href="https://wa.me/51910624404?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20Qoricash." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-gray-50" style={{ color: '#374151' }} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.08)' }}><HelpCircle className="w-4 h-4" style={{ color: '#2563EB' }} /></div>
                    <span className="font-medium flex-1 text-sm">Ayuda</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                  </a>
                  <button onClick={() => { setIsMobileMenuOpen(false); setShowLogoutModal(true); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-red-50" style={{ color: '#ef4444' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}><LogOut className="w-4 h-4 text-red-500" /></div>
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-4">
                <Link href={`/login?from=${isEmpresaPage ? '/empresa' : '/'}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors hover:bg-gray-50" style={{ color: '#374151' }} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.05)' }}><Lock className="w-4 h-4" style={{ color: '#6B7280' }} /></div>
                  <span className="font-medium flex-1 text-sm">Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link
                  href={isEmpresaPage ? '/crear-cuenta?tipo=empresa' : '/crear-cuenta'}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all"
                  style={{ background: '#0A0A0A', color: '#ffffff' }}
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
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            }}
          >
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?perfil=1'); }}
              className="flex items-center w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: '#374151' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6', e.currentTarget.style.color = '#0D1117')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#374151')}
            >
              <UserIcon className="w-4 h-4 mr-3 opacity-60" />Mi perfil
            </button>
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
              className="flex items-center w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: '#374151' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6', e.currentTarget.style.color = '#0D1117')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#374151')}
            >
              <TrendingUp className="w-4 h-4 mr-3 opacity-60" />Mi Dashboard
            </button>
            <a
              href="https://wa.me/51910624404?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20Qoricash."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-sm transition-colors"
              style={{ color: '#374151' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6', e.currentTarget.style.color = '#0D1117')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#374151')}
              onClick={() => setIsUserMenuOpen(false)}
            >
              <HelpCircle className="w-4 h-4 mr-3 opacity-60" />Ayuda
            </a>
            <div className="my-1 mx-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />
            <button
              onClick={() => { setIsUserMenuOpen(false); setShowLogoutModal(true); }}
              className="flex items-center w-full px-4 py-3 text-left text-sm transition-colors"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2', e.currentTarget.style.color = '#dc2626')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#ef4444')}
            >
              <LogOut className="w-4 h-4 mr-3 opacity-60" />Cerrar Sesión
            </button>
          </div>
        </>,
        document.body
      )}

      {/* ======================================
          HERO - Geométrico minimalista
      ====================================== */}
      <section
        ref={heroSectionRef}
        className="relative flex flex-col overflow-hidden"
        style={!isEmpresaPage ? { background: '#1463FF' } : { background: '#0A0A0A', minHeight: '100dvh' }}
      >

        {/* ── Decoraciones de fondo — solo página persona ── */}
        {!isEmpresaPage && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            {/* Grid de puntos blancos tenue */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }} />
            {/* Círculo blur top-right */}
            <div style={{
              position: 'absolute', top: '-120px', right: '-80px',
              width: 480, height: 480, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
            }} />
            {/* Círculo blur bottom-left */}
            <div style={{
              position: 'absolute', bottom: '-80px', left: '-60px',
              width: 320, height: 320, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            }} />
          </div>
        )}

        {/* ── Film Strip Columns — solo página empresa ── */}
        {isEmpresaPage && (() => {
          const col1 = [
            '/ty/Agro-exporter_viewing_transfer_n__2K_20260917133151.jpeg',
            '/ty/Carpenter_looking_at_phone_2K_20260917133207.jpeg',
            '/ty/Entrepreneur_holding_smartphone___2K_20260917133255.jpeg',
            '/ty/Executive_looking_at_phone_2K_20260917133335.jpeg',
            '/ty/Headphones_and_smartphone_on_sur__2K_20260917133312.jpeg',
            '/ty/Man_smiling_at_smartphone_2K_20260917133338.jpeg',
            '/ty/Watch_and_smartphone_on_wrist_2K_20260917133436.jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(3).jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(7).jpeg',
            '/ty/Woman_looking_at_smartphone_2K_20260917133425.jpeg',
          ];
          const col2 = [
            '/ty/Architect_showing_transaction_on__2K_20260917133416.jpeg',
            '/ty/Engineer_reviewing_machinery_quo__2K_20260917133211.jpeg',
            '/ty/Entrepreneur_smiling_with_smartp__2K_20260917133422.jpeg',
            '/ty/Farmer_looking_at_phone_notifica__2K_20260917133233.jpeg',
            '/ty/Man_checking_phone_in_mountains_2K_20260917133345.jpeg',
            '/ty/Miner_holding_phone_in_shop_2K_20260917133155.jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55.jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(4).jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(8).jpeg',
          ];
          const col3 = [
            '/ty/Baker_holding_smartphone_smiling_2K_20260917133344.jpeg',
            '/ty/Engineer_reviewing_machinery_quo__2K_20260917133222.jpeg',
            '/ty/Executive_holding_smartphone_in___2K_20260917133401.jpeg',
            '/ty/Gas_station_owner_holding_smartp__2K_20260917133133.jpeg',
            '/ty/Man_holding_smartphone_in_workshop_2K_20260917133349.jpeg',
            '/ty/Professional_walking_holding_sma__2K_20260917133259.jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(1).jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(5).jpeg',
            '/ty/Woman_holding_smartphone_with_ca__2K_20260917133255.jpeg',
          ];
          const col4 = [
            '/ty/CFO_smiling_at_smartphone_2K_20260917133426.jpeg',
            '/ty/Engineer_using_smartphone_in_mine_2K_20260917133138.jpeg',
            '/ty/Executive_looking_at_phone_2K_20260917133159.jpeg',
            '/ty/Gas_station_owner_holding_smartp__2K_20260917133225.jpeg',
            '/ty/Man_smiling_at_phone_in_2K_20260917133252.jpeg',
            '/ty/Traveler_viewing_phone_near_SUV_2K_20260917133258.jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(2).jpeg',
            '/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(6).jpeg',
            '/ty/Woman_holding_tablet_with_quote_2K_20260917133239.jpeg',
          ];
          const imgStyle: React.CSSProperties = { width: '100%', height: 220, objectFit: 'cover', objectPosition: 'center top', borderRadius: 10, display: 'block', flexShrink: 0 };
          return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

              {/* LEFT — 2 columnas */}
              <div className="hidden lg:flex" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '26%', gap: 8, padding: '0 8px' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="film-col-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...col1, ...col1].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="film-col-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...col2, ...col2].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                  </div>
                </div>
                {/* Fade interior → centro */}
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, transparent, #0A0A0A)' }} />
              </div>

              {/* RIGHT — 2 columnas */}
              <div className="hidden lg:flex" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '26%', gap: 8, padding: '0 8px' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="film-col-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...col3, ...col3].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="film-col-4" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...col4, ...col4].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                  </div>
                </div>
                {/* Fade interior → centro */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, transparent, #0A0A0A)' }} />
              </div>

              {/* Fade top + bottom sobre las columnas */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 20%, transparent 80%, #0A0A0A 100%)' }} />
            </div>
          );
        })()}

        <div
          className={`flex-1 flex flex-col w-full pb-4 sm:pb-8 relative z-10 ${!isEmpresaPage ? 'items-start px-6 sm:px-10 lg:px-16' : 'items-center justify-center px-4 text-center'}`}
          style={{ paddingTop: isAuthenticated ? 96 : (topBarHidden ? 96 : 132) }}
        >

          {/* H1 personas - entre encabezado y grid, solo móvil */}
          {!isEmpresaPage && (
            <h1 className="sm:hidden font-display font-black leading-[1.0] mb-4 text-center w-full hero-anim hero-delay-0 uppercase" style={{ color: '#ffffff', letterSpacing: '-0.01em' }}>
              <span className="block" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.6rem)' }}>El cambio de</span>
              <span className="block" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.6rem)' }}>dólares que</span>
              <span className="block" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.6rem)', color: 'rgba(255,255,255,0.75)' }}>siempre quisiste</span>
            </h1>
          )}

          {isEmpresaPage ? (
            /* ─── EMPRESA: Film strip hero centrado ─── */
            <div style={{ width: '100%', maxWidth: 520 }}>

              <p className="hero-anim hero-delay-0" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 24 }}>
                Qoricash · Corporativo
              </p>

              <h1 className="font-display font-black hero-anim hero-delay-1" style={{ color: '#ffffff', textTransform: 'uppercase', fontSize: 'clamp(2.6rem, 5.5vw, 5rem)', lineHeight: 1.0, marginBottom: 20, letterSpacing: '-0.01em' }}>
                En los negocios,<br />cada centavo<br /><span style={{ color: '#2563EB' }}>cuenta.</span>
              </h1>

              <p className="hero-anim hero-delay-2" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.65, marginBottom: 36 }}>
                TC preferencial, liquidación en 15 min y ejecutivo dedicado para operaciones corporativas.
              </p>

              <div className="hero-anim hero-delay-3" style={{ textAlign: 'left', marginBottom: 28 }}>
                {!isAuthenticated ? (
                  <div className="relative overflow-hidden rounded-2xl" style={{ background: '#111111', boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 32px 64px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#2563EB' }} />
                    <div className="px-8 py-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6" style={{ color: '#2563EB' }}>Corporativo</p>
                      <h3 className="font-black leading-[1.1] mb-3" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', color: '#ffffff' }}>
                        El tipo de cambio<br />que su empresa merece.
                      </h3>
                      <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        TC preferencial, liquidación en 15 min y ejecutivo dedicado para operaciones desde $5,000.
                      </p>
                      <div className="flex gap-6 mb-8">
                        {[{ value: "15'", label: 'Liquidación' }, { value: '0%', label: 'Comisiones' }, { value: '+TC', label: 'Preferencial' }].map(({ value, label }) => (
                          <div key={label} className="flex flex-col">
                            <span className="text-2xl font-black text-white leading-none">{value}</span>
                            <span className="text-[10px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => guardedAction(() => router.push('/login?from=/empresa'))}
                        className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 group"
                        style={{ background: '#2563EB', border: 'none', cursor: 'pointer' }}
                      >
                        <span>Cotiza en línea</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <Link href="/login?from=/empresa"
                        className="flex items-center justify-center w-full mt-3 py-2 text-xs font-medium transition-colors hover:opacity-80"
                        style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Ya tengo cuenta
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Calculator
                    initialRates={{ compra: parseFloat(buyRate), venta: parseFloat(sellRate) }}
                    showContinueButton={true}
                    dark={false}
                    onOperationReady={(operationType, amountUSD, exchangeRate) => guardedAction(() => {
                      const params = amountUSD && parseFloat(amountUSD) > 0
                        ? `?tipo=${operationType}&monto=${amountUSD}&tc=${exchangeRate}`
                        : '';
                      router.push(`/dashboard/empresa/nueva-operacion${params}`);
                    })}
                  />
                )}
              </div>

              <div className="flex items-center justify-center gap-6 text-xs font-medium hero-anim hero-delay-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span className="flex items-center gap-1.5"><HandCoins className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />Rentabilidad</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />Inmediato</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />Exclusivo</span>
              </div>
            </div>

          ) : (
            /* ─── PERSONA: Grid 2 columnas ─── */
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 items-center w-full">

              {/* LEFT - Texto */}
              <div className="order-2 sm:order-1">
                <h1 className="hidden sm:block font-display font-black leading-[1.0] mb-6 hero-anim hero-delay-1" style={{ color: '#ffffff', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  <span className="block" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>El cambio de</span>
                  <span className="block" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>dólares que</span>
                  <span className="block" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', color: 'rgba(255,255,255,0.7)' }}>siempre quisiste</span>
                </h1>
                <p className="text-base sm:text-lg max-w-[440px] mb-6 sm:mb-9 leading-relaxed text-justify sm:text-left hero-anim hero-delay-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  En cada una de tus metas, estamos contigo. Cambia tus dólares de forma rápida, segura y 100% digital, con las mejores tasas y sin costos ocultos.
                </p>
                <div className="flex flex-wrap gap-3 mb-6 sm:mb-10 hero-anim hero-delay-3">
                  <button
                    onClick={() => guardedAction(() => router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/login'))}
                    className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm w-full sm:w-auto btn-press active:scale-[0.97] transition-all duration-200"
                    style={{ background: '#ffffff', color: '#1247CC', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', border: 'none', cursor: 'pointer' }}
                  >
                    Cotizar ahora
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-medium hero-anim hero-delay-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.9)' }} />Registrados ante la SBS</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.9)' }} />En 15 minutos</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.9)' }} />0 comisiones</span>
                </div>
              </div>

              {/* RIGHT - Foto + cards flotantes */}
              <div className="order-1 sm:order-2 relative flex items-center justify-center hero-anim hero-delay-1">
                <div className="relative z-10 w-full max-w-[400px]">
                  <div ref={heroMediaRef} className="relative w-full">

                {/* Foto — ancho completo */}
                <div className="hero-photo-wrap" style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '3/4', maxHeight: 480, position: 'relative' }}>
                  <img
                    src="/pl.jpeg"
                    alt=""
                    className="hero-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                  {/* Overlay sutil */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.3) 100%)' }} />

                  {/* Dot vivo */}
                  <div className="hero-badge" style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.6)', borderRadius: 100, padding: '4px 10px' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inset-0 rounded-full opacity-75" style={{ background: '#22C55E' }} />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#22C55E' }} />
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>En vivo · USD / PEN</span>
                  </div>

                  {/* Mobile: barra TC prominente en la parte inferior de la foto */}
                  <div className="sm:hidden" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '14px 20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Compramos</div>
                      <div style={{ fontSize: 30, fontWeight: 900, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                        {(currentRates?.tipo_compra ?? parseFloat(buyRate)).toFixed(4)}
                      </div>
                    </div>
                    <div style={{ width: 1, height: 42, background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Vendemos</div>
                      <div style={{ fontSize: 30, fontWeight: 900, color: '#70b4ff', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                        {(currentRates?.tipo_venta ?? parseFloat(sellRate)).toFixed(4)}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ── Pills: borde izquierdo de la foto, mitad dentro mitad fuera ── */}
                <div className="hero-cta-pills" style={{
                  position: 'absolute',
                  top: '75%',
                  left: 0,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  zIndex: 10,
                }}>
                  <button
                    onClick={() => guardedAction(() => router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/login'))}
                    className="pill-iniciar hero-pill-1"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#42434b', borderRadius: 14, padding: '13px 20px', border: 'none', cursor: 'pointer' }}
                  >
                    <ArrowRight size={16} className="pill-icon" style={{ color: '#ffffff', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff' }}>Iniciar cambio</span>
                  </button>
                  <a
                    href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20el%20tipo%20de%20cambio."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-iniciar hero-pill-2"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#70b4ff', borderRadius: 14, padding: '13px 20px', textDecoration: 'none' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" className="pill-icon" style={{ flexShrink: 0 }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.486a.5.5 0 0 0 .609.61l5.7-1.493A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.034-1.388l-.36-.214-3.733.978.998-3.645-.235-.374A9.808 9.808 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff' }}>Cotiza en WhatsApp</span>
                  </a>
                </div>

                {/* ── Cards flotantes: borde derecho de la foto, mitad dentro mitad fuera ── */}
                <div className="hero-tc-cards" style={{
                  position: 'absolute',
                  top: '10%',
                  right: 0,
                  transform: 'translateX(50%)',
                  width: '42%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  zIndex: 10,
                }}>
                  {/* Card Compramos */}
                  <div className="hero-card-1" style={{ background: '#ffffff', borderRadius: 16, padding: '10px 14px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9CA3AF' }}>Compramos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>S/</span>
                      <span className="tc-rate-number" style={{ fontSize: 32, fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                        {(currentRates?.tipo_compra ?? parseFloat(buyRate)).toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Card Vendemos */}
                  <div className="hero-card-2" style={{ background: '#ffffff', borderRadius: 16, padding: '10px 14px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }} />
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9CA3AF' }}>Vendemos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>S/</span>
                      <span className="tc-rate-number" style={{ fontSize: 32, fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                        {(currentRates?.tipo_venta ?? parseFloat(sellRate)).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

                {/* Mercado en Vivo button - oculto temporalmente */}
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
          )}
        </div>

      </section>

      {/* ======================================
          WHATSAPP - Opera sin descargar nada
      ====================================== */}
      <section style={{ background: '#ffffff' }} className="wsp-section py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
          <div className="wsp-outer-flex flex flex-row items-start gap-3 sm:gap-12 lg:gap-20">

            {/* Imagen + pills flotantes */}
            <div ref={wspMediaRef} className="wsp-phone-col order-1 flex items-start justify-start" style={{ flexShrink: 0, width: '48%', maxWidth: 500 }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <img
                  src="/wsp.png"
                  alt="Opera por WhatsApp sin descargar ningún app"
                  className="wsp-img"
                  style={{ width: '100%', height: 'auto', display: 'block', border: 'none', outline: 'none', background: 'transparent' }}
                />
                {/* Pills flotantes sobre el borde derecho */}
                <div className="ps-wsp-wrap" style={{ position: 'absolute', top: '8%', right: 0, transform: 'translateX(50%)', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 10 }}>
                  {[
                    { n: 1, text: 'Escríbenos cuánto quieres cambiar', cls: 'wsp-pill-1' },
                    { n: 2, text: 'Te damos el tipo de cambio al instante', cls: 'wsp-pill-2' },
                    { n: 3, text: 'El dinero llega directo a tu cuenta', cls: 'wsp-pill-3' },
                  ].map((s) => {
                    const checked = wspActiveStep >= s.n;
                    return (
                      <div key={s.n} className={s.cls} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#ffffff', borderRadius: 999, padding: '9px 16px 9px 9px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', whiteSpace: 'nowrap' }}>
                        <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#1463FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 900, opacity: wspResetting ? 0 : 1, transition: 'opacity 0.45s ease' }}>
                          {checked ? (
                            <svg key={`check-${s.n}-${checked}`} className={wspActiveStep === s.n ? 'wsp-check-icon' : ''} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span>{s.n}</span>
                          )}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: checked ? '#1463FF' : '#0D1117', opacity: wspResetting ? 0 : 1, transition: 'color 0.3s ease, opacity 0.45s ease' }}>{s.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="wsp-text-col flex-1 min-w-0 order-2">
              <h2 className="reveal font-display font-black leading-[1.08] mb-6"
                style={{ color: '#0D1117', fontSize: 'clamp(1.9rem, 3.8vw, 3rem)' }}>
                Opera 100% desde<br />
                <span style={{ color: '#1463FF' }}>WhatsApp.</span><br />
                Sin descargar ningún app.
              </h2>

              <p className="reveal text-base sm:text-lg leading-relaxed mb-10"
                style={{ color: '#4B5563', maxWidth: 460 }}>
                Cotiza al instante y recibe tus soles o dólares directo en tu cuenta bancaria.
                De forma <strong style={{ color: '#0D1117' }}>inmediata</strong>, desde cualquier
                dispositivo, sin instalar ninguna aplicación.
              </p>

              <div className="reveal">
                <a href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20el%20tipo%20de%20cambio"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl px-6 py-3.5 font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-lg"
                  style={{ background: '#70b4ff', boxShadow: '0 8px 24px rgba(112,180,255,0.35)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Cotiza ahora
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================
          BANCOS - Card azul con órbita premium
      ====================================== */}
      <section ref={banksSectionRef} className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden reveal ps-banks-card" style={{ background: '#1463FF', padding: '44px 52px' }}>
          <div ref={banksMediaRef} className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">

            {/* LEFT — Texto */}
            <div className="min-w-0" style={{ flex: '0 0 40%', alignSelf: 'flex-start' }}>
              <h2 className="font-display font-black" style={{ color: '#ffffff', lineHeight: 1.05, marginBottom: 16 }}>
                <span style={{ fontSize: 'clamp(2rem, 2.9vw, 2.7rem)', display: 'block' }}>Recibe tu dinero en</span>
                <span style={{ fontSize: 'clamp(2rem, 2.9vw, 2.7rem)', display: 'block', color: 'rgba(255,255,255,0.65)' }}>cualquier banco</span>
                <span style={{ fontSize: 'clamp(3.9rem, 6.6vw, 6.2rem)', display: 'block', color: '#ffffff', lineHeight: 0.93 }}>del Perú</span>
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.65, marginBottom: 20, maxWidth: 300, textAlign: 'justify' }}>
                Transferimos directo a tu cuenta bancaria. Sin pasos extra, sin cuentas intermediarias. Tu dinero llega donde tú decides.
              </p>

              {/* Fila bancos secundarios — oculta en móvil */}
              <div className="hidden sm:flex ps-bank-pills" style={{ alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { logo: '/BBVA.png',           name: 'BBVA',      h: 28, cls: 'banks-rp1' },
                  { logo: '/Scotiabank.png',      name: 'Scotiabank',h: 42, cls: 'banks-rp2' },
                  { logo: '/Banco Pichincha.png', name: 'Pichincha', h: 42, cls: 'banks-rp3' },
                  { logo: '/bancosantander.png',  name: 'Santander', h: 28, cls: 'banks-rp5' },
                ].map((bank) => (
                  <div key={bank.name} className={bank.cls} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, border: '1px solid rgba(255,255,255,0.18)', flexShrink: 0 }}>
                    <img src={bank.logo} alt={bank.name} style={{ height: bank.h, maxWidth: 90, width: 'auto', objectFit: 'contain', filter: 'brightness(10)' }} />
                  </div>
                ))}
                <div className="banks-rp6" style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: '5px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, border: '1px solid rgba(255,255,255,0.18)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>+ Otros bancos</span>
                </div>
              </div>

              {/* Nota CCI — solo desktop */}
              <p className="hidden lg:block" style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, marginTop: 10, textAlign: 'justify' }}>
                Operaciones con BBVA, Scotiabank, Pichincha, GNB, Santander y otros se realizan vía CCI interbancario. Acreditación: 20 min – 24 h según banco y horario. Válido para plazas Lima.
              </p>

              {/* Mobile: imagen → logos BCP/Interbank/BanBif → nota CCI */}
              <div className="flex lg:hidden flex-col items-center mt-6 gap-3">
                <img src="/kj.jpeg" alt="Qoricash bancos" style={{ width: '75%', maxWidth: 260, borderRadius: 14, display: 'block' }} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { logo: '/BCP.png',      name: 'BCP',      h: 26 },
                    { logo: '/Interbank.png', name: 'Interbank', h: 36 },
                    { logo: '/BanBif.png',    name: 'BanBif',   h: 26 },
                  ].map((bank) => (
                    <div key={bank.name} style={{ background: '#ffffff', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.18)' }}>
                      <img src={bank.logo} alt={bank.name} style={{ height: bank.h, maxWidth: 80, width: 'auto', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, marginTop: 4, textAlign: 'left', width: '100%' }}>
                  Operaciones con BBVA, Scotiabank, Pichincha, GNB, Santander y otros se realizan vía CCI interbancario. Acreditación: 20 min – 24 h según banco y horario. Válido para plazas Lima.
                </p>
              </div>
            </div>

            {/* RIGHT — Imagen con pills (desktop only) */}
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-4">

              {/* Imagen + pills en borde derecho */}
              <div style={{ position: 'relative', width: '74%' }}>
                <img
                  src="/kj.jpeg"
                  alt="Qoricash"
                  className="banks-img"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}
                />

                {/* Pills BCP, Interbank, BanBif */}
                <div style={{ position: 'absolute', top: '18%', right: 0, transform: 'translateX(50%)', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10 }}>
                  {[
                    { logo: '/BCP.png',      name: 'BCP',      cls: 'banks-pr1', h: 36 },
                    { logo: '/Interbank.png', name: 'Interbank',cls: 'banks-pr2', h: 52 },
                    { logo: '/BanBif.png',    name: 'BanBif',   cls: 'banks-pr3', h: 36 },
                  ].map((bank) => (
                    <div key={bank.name} className={bank.cls} style={{ background: '#ffffff', borderRadius: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.2)', minWidth: 76 }}>
                      <img src={bank.logo} alt={bank.name} style={{ height: bank.h, maxWidth: 100, width: 'auto', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
        </div>

      </section>


      {!isEmpresaPage && (
      <section className="pt-8 sm:pt-12" style={{ position: 'relative', overflow: 'hidden', background: '#42434b', paddingBottom: 16 }}>
        {/* Fondo sutil */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="ps-cada-sol-outer" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 0 }}>
          {/* Contenedor izq+centro: padded */}
          <div className="ps-cada-sol-left" style={{ flex: '0 0 58%', paddingLeft: 24, paddingRight: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>

            {/* LEFT */}
            <div className="flex flex-col gap-6">

              {/* Eyebrow */}
              <div className="reveal-left flex items-center gap-2">
                <span style={{ width: 28, height: 2, background: '#70b4ff', borderRadius: 99, display: 'inline-block' }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#70b4ff' }}>Por qué Qoricash</span>
              </div>

              {/* Headline */}
              <div className="reveal-left reveal-delay-1">
                <h2 className="font-display font-black leading-[1.0]" style={{ fontSize: 'clamp(3.2rem, 6vw, 5.5rem)', color: '#ffffff' }}>
                  Cada sol<br />
                  <span style={{ color: '#70b4ff' }}>importa.</span>
                </h2>
                <p className="reveal-left reveal-delay-2" style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginTop: 18, maxWidth: 380 }}>
                  No sigas perdiendo con el app de tu banco.
                </p>
                <a
                  href="https://wa.me/51910624404?text=Hola%2C%20quiero%20hacer%20un%20cambio%20de%20d%C3%B3lares"
                  target="_blank" rel="noopener noreferrer"
                  className="reveal-left reveal-delay-3"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, background: '#1463FF', color: '#ffffff', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', letterSpacing: '-0.01em', boxShadow: '0 4px 20px rgba(20,99,255,0.4)', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Cambia y gana más hoy →
                </a>
              </div>

            </div>

            {/* CENTER — imagen + pills debajo */}
            <div className="hidden lg:flex flex-col items-center justify-start gap-4">
              <div className="reveal reveal-delay-2" style={{ background: '#F8FAFC', borderRadius: '24px 24px 0 0', padding: 16, paddingBottom: 320, marginBottom: -320, marginTop: 0, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
                <img
                  src="/mkl.jpeg"
                  alt="Qoricash"
                  style={{ width: '100%', maxWidth: 300, height: 'auto', borderRadius: 14, objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* 3 métricas como pills verticales */}
              <div className="reveal reveal-delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', maxWidth: 300, zIndex: 2, position: 'relative', marginTop: 16, }}>
                {[
                  { value: 80, prefix: '~S/', suffix: '',    label: 'más por $1,000', sub: 'vs banco',      bg: '#1463FF',  border: 'rgba(112,180,255,0.4)' },
                  { value: 10, prefix: '',   suffix: 'min', label: 'por operación',  sub: 'tiempo aprox.', bg: '#0D1117',  border: 'rgba(255,255,255,0.12)' },
                  { value: 0,  prefix: 'S/', suffix: '',    label: 'comisiones',     sub: 'siempre',        bg: '#4B5563',  border: 'rgba(255,255,255,0.15)' },
                ].map(({ value, prefix, suffix, label, sub, bg, border }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: bg, border: `1px solid ${border}`, borderRadius: 0, padding: '10px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#70b4ff' }}>{prefix}</span>
                      <span style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                        <AnimatedStat value={value} label="" />
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#70b4ff', marginLeft: 1 }}>{suffix}</span>
                    </div>
                    <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{label}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* fin contenedor izq+centro */}

          {/* RIGHT — cards comparativas, llega al borde derecho */}
          <div className="ps-cada-sol-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 20, padding: '32px 0 32px 20px', alignSelf: 'stretch', minWidth: 0 }}>

            {/* Card Qoricash — azul (arriba) */}
            {(() => {
              const qc_compra = currentRates?.tipo_compra?.toFixed(3) || buyRate;
              const qc_venta  = currentRates?.tipo_venta?.toFixed(3)  || sellRate;
              return (
                <div className="reveal-right reveal-delay-2" style={{ background: '#1463FF', borderRadius: 18, padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', width: 320, alignSelf: 'flex-start', marginLeft: 60 }}>
                  <div className="reveal reveal-delay-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src="/vg.png" alt="Qoricash" style={{ height: 20, width: 'auto', objectFit: 'contain', filter: 'brightness(10)' }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 700, color: '#4ade80' }}>
                      <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
                        <span className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', opacity: 0.7 }} />
                        <span style={{ position: 'relative', borderRadius: '50%', background: '#4ade80', width: 6, height: 6 }} />
                      </span>
                      En vivo
                    </span>
                  </div>
                  <div className="reveal reveal-delay-4" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Compramos</span>
                      <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>S/ {qc_compra}</span>
                    </div>
                    <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 14 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Vendemos</span>
                      <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>S/ {qc_venta}</span>
                    </div>
                  </div>
                  {/* Badge mitad dentro mitad fuera — borde derecho */}
                  <div className="reveal-right reveal-delay-5" style={{ position: 'absolute', right: 0, top: '38%', transform: 'translateX(65%) translateY(-50%)', zIndex: 10, display: 'flex', alignItems: 'center', gap: 5, background: '#ffffff', borderRadius: 99, padding: '6px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>
                    <CheckCircle2 style={{ width: 11, height: 11, color: '#1463FF' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1463FF' }}>Mejor precio del mercado</span>
                  </div>
                </div>
              );
            })()}

            {/* Imagen + card banco al lado */}
            <div style={{ marginTop: 30, display: 'flex', alignItems: 'flex-start', gap: 14, alignSelf: 'center' }}>

              {/* Imagen con card superpuesta */}
              <div className="reveal reveal-delay-3" style={{ position: 'relative', flexShrink: 0 }}>
                <img src="/ggg.jpeg" alt="" style={{ width: 260, height: 320, objectFit: 'cover', objectPosition: 'center', borderRadius: 14, display: 'block' }} />
                {/* Card cuadrada en el borde izquierdo, mitad dentro mitad fuera */}
                <div style={{ position: 'absolute', left: 0, top: '72%', transform: 'translateX(-50%) translateY(-50%)', zIndex: 10, background: '#ffffff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', width: 180, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { text: '¿Sigues cambiando con el banco?',         Icon: Building2,    delay: 'reveal-delay-4', attn: 'attention-shake' },
                    { text: 'Estás perdiendo sin darte cuenta',        Icon: TrendingDown,  delay: 'reveal-delay-5', attn: 'attention-shake-2' },
                    { text: 'Con Qoricash ahorras más por cada dólar', Icon: CheckCircle2,  delay: 'reveal-delay-6', attn: 'attention-glow' },
                  ].map(({ text, Icon, delay, attn }) => (
                    <div key={text} className={`reveal ${delay}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Icon style={{ width: 14, height: 14, color: '#1463FF', flexShrink: 0, marginTop: 1 }} />
                      <span className={attn} style={{ fontSize: 10, fontWeight: 700, color: '#0D1117', lineHeight: 1.4 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Tasa en bancos */}
              {(() => {
                const qc_compra = currentRates?.tipo_compra || parseFloat(buyRate);
                const qc_venta  = currentRates?.tipo_venta  || parseFloat(sellRate);
                const bk_compra = (qc_compra - 0.017).toFixed(3);
                const bk_venta  = (qc_venta  + 0.015).toFixed(3);
                return (
                  <div style={{ background: '#ffffff', borderRadius: 16, padding: '20px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', width: 180, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <span className="reveal reveal-delay-4" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280' }}>Tasa en bancos</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="reveal reveal-delay-5" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Compra</span>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0D1117', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>S/ {bk_compra}</span>
                      </div>
                      <div style={{ height: 1, background: '#E5E7EB' }} />
                      <div className="reveal reveal-delay-6" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Venta</span>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0D1117', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>S/ {bk_venta}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>


          </div>

        </div>{/* fin flex outer */}

      </section>
      )}

      {isEmpresaPage && isAuthenticated && (
      <section style={{ position: 'relative', overflow: 'hidden', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* LEFT - TC Live + Sparkline + Tabla */}
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: '#6B7280' }}>
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
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Compra BCR</div>
                      <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none" style={{ color: '#0D1117' }}>{bcrpCompra}</div>
                    </div>
                    <div className="self-stretch w-px mb-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Venta BCR</div>
                      <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none" style={{ color: '#2563EB' }}>{bcrpVenta}</div>
                    </div>
                    {lastBcrp && (
                      <div className="self-end pb-1">
                        <span className="text-[9px]" style={{ color: '#9CA3AF' }}>{lastBcrp.fecha}</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Sparkline */}
              <div className="rounded-xl overflow-hidden mb-4" style={{ background: '#F8FAFC', border: '1px solid #e5e7eb' }}>
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
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Tipo de Cambio Referencial BCR · {pts.length} días</span>
                        <span className="text-[10px] font-bold" style={{ color: pctColor }}>{pctStr}</span>
                      </div>
                      <div className="px-4 pb-3">
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 70, overflow: 'visible' }} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="corpSparkGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaD} fill="url(#corpSparkGrad)" />
                          <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(37,99,235,0.4))' }} />
                          <circle cx={cx(pts.length - 1)} cy={cy(pts[pts.length - 1])} r="3" fill="#2563EB" style={{ filter: 'drop-shadow(0 0 5px rgba(37,99,235,0.7))' }} />
                        </svg>
                        <div className="flex justify-between mt-1">
                          {labels.map((d, i) => (
                            <span key={i} className="text-[8px]" style={{ color: i === labels.length - 1 ? '#6B7280' : '#D1D5DB', fontWeight: i === labels.length - 1 ? 700 : 400 }}>{d}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Comparativa bancaria */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: '#F9FAFB', borderBottom: '1px solid #e5e7eb' }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>Comparativa bancaria</span>
                  <div className="flex gap-3 sm:gap-6">
                    <span className="w-10 sm:w-12 text-right text-[9px] font-bold uppercase" style={{ color: '#9CA3AF' }}>Compra</span>
                    <span className="w-10 sm:w-12 text-right text-[9px] font-bold uppercase" style={{ color: '#9CA3AF' }}>Venta</span>
                  </div>
                </div>
                {(() => {
                  const base_c = currentRates?.tipo_compra ?? 3.75;
                  const base_v = currentRates?.tipo_venta ?? 3.77;
                  return [
                    { name: 'Qoricash', c: base_c, v: base_v, highlight: true },
                    { name: 'BCP',       c: base_c - 0.065, v: base_v + 0.075, highlight: false },
                    { name: 'Interbank', c: base_c - 0.058, v: base_v + 0.068, highlight: false },
                    { name: 'BBVA',      c: base_c - 0.080, v: base_v + 0.090, highlight: false },
                  ].map(({ name, c, v, highlight }, i, arr) => (
                    <div key={name} className="flex items-center px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none', background: highlight ? 'rgba(37,99,235,0.04)' : 'transparent', borderLeft: highlight ? '2px solid #2563EB' : '2px solid transparent' }}>
                      <div className="flex-1 text-sm font-bold min-w-0 truncate" style={{ color: highlight ? '#2563EB' : '#6B7280' }}>{name}</div>
                      <div className="flex gap-3 sm:gap-6 flex-shrink-0">
                        <span className="text-sm tabular-nums font-medium w-10 sm:w-12 text-right" style={{ color: highlight ? '#2563EB' : '#374151' }}>{c.toFixed(3)}</span>
                        <span className="text-sm tabular-nums font-medium w-10 sm:w-12 text-right" style={{ color: highlight ? '#2563EB' : '#374151' }}>{v.toFixed(3)}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <p className="text-[9px] mt-2 text-right" style={{ color: '#D1D5DB' }}>*Tasas bancarias referenciales. No constituyen oferta formal.</p>
            </div>

            {/* RIGHT - Ventajas corporativas */}
            <div>
              <span className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: '#6B7280' }}>Por qué elegirnos</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-[1.15] mb-6 sm:mb-8" style={{ color: '#0D1117' }}>
                El tipo de cambio <br /><span style={{ color: '#2563EB' }}>que su empresa</span> merece.
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                {[
                  { icon: '⚡', title: 'Liquidación en menos de 15 min', sub: 'Confirmación en tiempo real' },
                  { icon: '🔒', title: 'Tipo de cambio pactado y garantizado', sub: 'El TC acordado no varía, independientemente del monto' },
                  { icon: '💼', title: 'Cotización personalizada para operaciones desde $5,000 a más', sub: 'Atención especializada para empresas de cualquier tamaño' },
                  { icon: '0%', title: 'Sin comisiones ni cargos ocultos', sub: 'Solo el tipo de cambio, nada más' },
                ].map(({ icon, title, sub }) => (
                  <div key={title} className="flex items-start gap-4 px-4 py-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #e5e7eb' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563EB' }}>{icon}</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl px-5 py-4 mb-6" style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#2563EB' }}>Ahorro estimado por $10,000</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black" style={{ color: '#2563EB' }}>S/ 800</span>
                  <span className="text-sm font-medium" style={{ color: '#6B7280' }}>vs banco tradicional</span>
                </div>
              </div>

              <Link
                href="/login"
                className="flex sm:inline-flex justify-center items-center gap-2.5 font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5"
                style={{ background: '#0A0A0A', color: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
              >
                Cotizar tipo de cambio corporativo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* ======================================
          CÓMO FUNCIONA - 3 pasos
      ====================================== */}
      <style>{`
        @keyframes sp-spin    { to { transform: rotate(360deg); } }
        @keyframes sp-spin-r  { to { transform: rotate(-360deg); } }
        @keyframes sp-float   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes sp-float-r { 0%,100%{transform:translateY(0);} 50%{transform:translateY(8px);} }
        @keyframes sp-float-s { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
        @keyframes sp-scan    { 0%,100%{transform:translateY(-44px);opacity:0;} 15%{opacity:0.6;} 85%{opacity:0.6;} to{transform:translateY(44px);opacity:0;} }
        @keyframes sp-blink   { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes sp-fadein  { from{opacity:0;transform:scale(0.85) translateY(10px);} to{opacity:1;transform:scale(1) translateY(0);} }
        @keyframes sp-dot     { 0%,100%{transform:scale(1);opacity:0.45;} 50%{transform:scale(2.2);opacity:1;} }
        @keyframes sp-shimmer { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
        @keyframes sp-badge   { from{opacity:0;transform:scale(0.7) translateY(8px);} to{opacity:1;transform:scale(1) translateY(0);} }
        @keyframes sp-cursor  { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes sp-flow    { 0%{left:0%;opacity:0;} 15%{opacity:1;} 85%{opacity:1;} 100%{left:calc(100% - 10px);opacity:0;} }
        @keyframes sp-ring-p  { 0%{stroke-dashoffset:377;opacity:1;} 65%{stroke-dashoffset:0;opacity:1;} 78%{stroke-dashoffset:0;opacity:0;} 100%{stroke-dashoffset:377;opacity:0;} }
        @keyframes sp-check   { 0%,62%{stroke-dashoffset:40;opacity:0;} 67%{opacity:1;} 90%{stroke-dashoffset:0;opacity:1;} 98%,100%{opacity:0;} }
        @keyframes sp-proc    { 0%,55%{opacity:1;} 65%,100%{opacity:0;} }
        @keyframes sp-done    { 0%,62%{opacity:0;} 72%,88%{opacity:1;} 96%,100%{opacity:0;} }
        @keyframes sp-arc     { 0%{stroke-dashoffset:500;} 100%{stroke-dashoffset:0;} }
      `}</style>

      {!isEmpresaPage && (
      <section className="pb-10 sm:pb-16 ps-hdtd-section" style={{ paddingTop: 200 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop layout */}
          <div className="rounded-2xl reveal ps-hdtd-banner hidden sm:block" style={{ background: '#1463FF', padding: '44px 52px', height: 460, overflow: 'visible', position: 'relative' }}>
            <div className="reveal-left reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 0, lineHeight: 1, zIndex: 2, position: 'absolute', left: 52, top: '50%', transform: 'translateY(-50%)' }}>
              {['haz que', 'tu dinero', 'trabaje', 'para ti'].map((line, i) => (
                <span key={line} className={`reveal-left reveal-delay-${i + 1}`} style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', fontWeight: 900, color: i === 3 ? 'rgba(255,255,255,0.4)' : '#ffffff', fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em' }}>
                  {line}
                </span>
              ))}
            </div>
            <div className="reveal-right reveal-delay-2" style={{ position: 'absolute', right: 52, top: '50%', transform: 'translateY(-50%)', maxWidth: 260, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                ¿Sigues cambiando con el app de tu banco? Tu banco no te ofrece el mejor precio, te ofrece el precio que más le conviene a él. Cada operación tiene un margen que sale silenciosamente de tu bolsillo, sin que lo notes.
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                Qoricash te da el <strong style={{ color: '#ffffff' }}>tipo de cambio real del mercado</strong>. Sin comisiones, sin letra chica. Tu dinero llega directo a tu cuenta en menos de 15 minutos desde cualquier banco del Perú.
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                La diferencia entre cambiar con tu banco y cambiar con Qoricash <strong style={{ color: '#4ade80' }}>se acumula con cada operación</strong>. Ese dinero puede quedarse contigo.
              </p>
              <a href="https://wa.me/51910624404?text=Hola%2C%20quiero%20hacer%20un%20cambio%20de%20d%C3%B3lares" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffffff', color: '#1463FF', fontWeight: 800, fontSize: 13, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', letterSpacing: '-0.01em', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'opacity 0.2s', alignSelf: 'flex-start' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Empieza a ganar más →</a>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
              <div className="reveal reveal-delay-2">
                <img src="/wwws.png" alt="" style={{ maxWidth: 360, width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>

          {/* Mobile layout — stacked, image anchored to bottom */}
          <div className="rounded-2xl sm:hidden" style={{ background: '#1463FF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Headline + body text + CTA */}
            <div style={{ padding: '36px 24px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Headline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, lineHeight: 1, marginBottom: 24 }}>
                {['haz que', 'tu dinero', 'trabaje', 'para ti'].map((line, i) => (
                  <span key={line} style={{ fontSize: 'clamp(2.6rem, 10vw, 3.6rem)', fontWeight: 900, color: i === 3 ? 'rgba(255,255,255,0.4)' : '#ffffff', fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em' }}>
                    {line}
                  </span>
                ))}
              </div>
              {/* Body text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                  ¿Sigues cambiando con el app de tu banco? Cada operación tiene un margen que sale de tu bolsillo sin que lo notes.
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                  Qoricash te da el <strong style={{ color: '#ffffff' }}>tipo de cambio real del mercado</strong>. Tu dinero llega en menos de 15 minutos desde cualquier banco del Perú.
                </p>
                <a href="https://wa.me/51910624404?text=Hola%2C%20quiero%20hacer%20un%20cambio%20de%20d%C3%B3lares" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffffff', color: '#1463FF', fontWeight: 800, fontSize: 13, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', alignSelf: 'flex-start' }}
                >Empieza a ganar más →</a>
              </div>
            </div>
            {/* Image — anchored to bottom of card, no bottom padding */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 16 }}>
              <img src="/wwws.png" alt="" style={{ maxWidth: '85%', width: '85%', height: 'auto', display: 'block', verticalAlign: 'bottom' }} />
            </div>
          </div>
        </div>
      </section>
      )}


      {isEmpresaPage && isAuthenticated && (
      <>
        <MarketSection variant="empresa" />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 pb-10 pt-2">
          <Link
            href="/login"
            className="flex sm:inline-flex justify-center items-center gap-2.5 font-bold px-9 py-4 rounded-full transition-all text-sm hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#ffffff', boxShadow: '0 8px 24px rgba(34,197,94,0.32)' }}
          >
            Cotizar tipo de cambio corporativo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </>
      )}



      {/* ======================================
          FOOTER
      ====================================== */}
      <footer style={{ color: '#6B7280' }}>
        <div className="py-3 px-4 sm:px-8 lg:px-10" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[10px] sm:text-[11px] leading-tight" style={{ color: '#0D1117' }}>Empresa Registrada</div>
                  <div className="text-[9px] sm:text-[10px]" style={{ color: '#6B7280' }}>RUC: 20615113698 · Lima, Perú</div>
                </div>
              </div>
              <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[10px] sm:text-[11px] leading-tight" style={{ color: '#0D1117' }}>Registrados ante la SBS</div>
                  <div className="text-[9px] sm:text-[10px]" style={{ color: '#6B7280' }}>Res. N° 00313-2026</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[11px]" style={{ color: '#374151' }}>
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL cifrado</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Datos protegidos por ley</span>
            </div>
          </div>
        </div>
        <div className="w-full px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto">

            {/* Fila 1 - Logo + descripción */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
                <img src="/rep.png" alt="Qoricash" className="h-8 w-auto" style={{ objectFit: 'contain' }} />
              </Link>
              <span className="hidden sm:block w-px h-6" style={{ background: 'rgba(0,0,0,0.1)' }} />
              <p className="hidden sm:block text-xs leading-relaxed" style={{ color: '#6B7280' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>
            </div>
            <p className="sm:hidden text-xs leading-relaxed mb-5" style={{ color: '#6B7280' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>

            {/* Fila 2 - Links en 3 columnas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8 mb-6">

              {/* Servicios */}
              <div>
                <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Servicios</h4>
                <ul className="space-y-2">
                  <li><Link href="/servicios#compra" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Compra USD</Link></li>
                  <li><Link href="/servicios#venta" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Venta USD</Link></li>
                  <li><Link href="/servicios#tipo-cambio" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Tipo de cambio</Link></li>
                  <li><Link href="/preguntas-frecuentes" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">FAQ</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/sobre-nosotros" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Nosotros</Link></li>
                  <li><Link href="/terminos-condiciones" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Términos</Link></li>
                  <li><Link href="/politica-privacidad" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Privacidad</Link></li>
                  <li><Link href="/politica-cookies" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Cookies</Link></li>
                  <li><Link href="/libro-reclamaciones" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Reclamaciones</Link></li>
                </ul>
              </div>

              {/* Contacto */}
              <div className="col-span-2 sm:col-span-1 md:col-span-2">
                <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Contacto</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href="mailto:info@qoricash.pe" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">info@qoricash.pe</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">910 624 404</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="transition-colors text-[11px] sm:text-xs leading-relaxed hover:text-gray-900">Av. Brasil N° 2790, Int. 504 · Pueblo Libre</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[11px] sm:text-xs">Lun–Vie 9–6 pm · Sáb 9–1 pm</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Copyright */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
              <p>© 2025 Qoricash. Todos los derechos reservados.</p>
              <div className="flex items-center gap-3">
                <Link href="/terminos-condiciones" className="transition-colors hover:text-gray-600">Términos</Link>
                <Link href="/politica-privacidad" className="transition-colors hover:text-gray-600">Privacidad</Link>
                <Link href="/libro-reclamaciones" className="transition-colors hover:text-gray-600">Reclamaciones</Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
