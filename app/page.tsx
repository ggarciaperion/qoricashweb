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
  ArrowRight, ArrowLeft, Shield, Clock, TrendingUp, TrendingDown, Minus,
  Users, CheckCircle2, Lock, UserPlus, Banknote, DollarSign,
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
  const [logoutPhase, setLogoutPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [isBanksSectionVisible, setIsBanksSectionVisible] = useState(false);
  const banksSectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const { currentRates, fetchRates, startRateSubscription } = useExchangeStore();

  // Cargar y suscribir tipos de cambio en tiempo real al montar la página
  useEffect(() => {
    fetchRates();
    const unsub = startRateSubscription();
    return () => unsub();
  }, []);

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

    <main className="min-h-screen pt-[72px]">
      {/* == FONDO FIJO == */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: '#F8FAFC' }} />

      {/* == NAVBAR == */}
      <header className="fixed top-0 left-0 right-0 w-full z-50" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <nav className="w-full">
          <div className="max-w-5xl mx-auto flex justify-between items-center h-20 px-6 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <img src="/vg.png" alt="Qoricash" className="h-16 w-auto" />
                {isEmpresaPage && (
                  <span className="self-center text-[11px] font-bold uppercase" style={{ color: '#9CA3AF', letterSpacing: '0.45em' }}>Corporate</span>
                )}
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              {[
              ].map(({ href, label, isLink }) => {
                const cls = `relative text-sm font-medium transition-colors duration-200 group py-1 text-gray-600 hover:text-gray-900`;
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
                      className="relative flex items-center gap-2 text-sm font-medium transition-colors duration-200 group py-1 text-gray-700 hover:text-gray-900"
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shrink-0"
                        style={{ background: '#2563EB' }}>
                        {((user?.razon_social || user?.nombres) ?? '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate">
                        {user?.document_type === 'RUC'
                          ? user?.razon_social || user?.nombres
                          : user?.nombres?.trim().split(/\s+/)[0]}
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
                        className="relative text-sm font-medium transition-colors duration-200 group py-1 text-gray-600 hover:text-gray-900"
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
                      <span className="h-4 w-px" style={{ background: 'rgba(0,0,0,0.15)' }} aria-hidden="true" />
                    </>
                  )}
                  <Link href={`/login?from=${isEmpresaPage ? '/empresa' : '/'}`} className="relative text-sm font-medium transition-colors duration-200 group py-1 text-gray-600 hover:text-gray-900">
                    Iniciar Sesión
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-out group-hover:w-full" />
                  </Link>
                  <Link href={isEmpresaPage ? '/crear-cuenta?tipo=empresa' : '/crear-cuenta'} className="text-sm font-bold px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all duration-200 shadow-md" style={{ background: '#0A0A0A', color: '#ffffff' }}>
                    Regístrate
                  </Link>
                </>
              )}
            </div>
            {/* Mobile - Personas/Empresas + separador + hamburger */}
            <div className="lg:hidden flex items-center">
              {!isAuthenticated && (
                <>
                  <button
                    className="text-sm font-medium transition-colors px-2 text-gray-500 hover:text-gray-900"
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
                  <span className="h-4 w-px" style={{ background: 'rgba(0,0,0,0.15)' }} aria-hidden="true" />
                </>
              )}
              {isAuthenticated && user && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mr-0.5"
                  style={{ background: '#2563EB' }}>
                  {((user.razon_social || user.nombres) ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 transition text-gray-700 hover:text-gray-900" aria-label="Toggle mobile menu">
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
      <section className="relative flex flex-col overflow-hidden">

        {/* ── Decoraciones de fondo — solo página persona, solo desktop ── */}
        {!isEmpresaPage && (
          <div className="hero-bg-deco absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

            {/* Símbolo $ grande — esquina superior derecha */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-30px',
              fontSize: 340, fontWeight: 900, lineHeight: 1,
              color: 'rgba(37,99,235,0.035)',
              fontFamily: 'var(--font-poppins)',
              letterSpacing: '-0.05em',
              userSelect: 'none',
              animation: 'bgFloat1 9s ease-in-out infinite',
            }}>$</div>

            {/* Anillo orbital grande — centro-derecha */}
            <div style={{
              position: 'absolute', top: '50%', right: '8%',
              width: 320, height: 320,
              marginTop: -160,
              animation: 'bgOrbitCW 28s linear infinite',
            }}>
              <svg width="320" height="320" viewBox="0 0 320 320" fill="none" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="160" cy="160" r="155" stroke="rgba(37,99,235,0.06)" strokeWidth="1.5" strokeDasharray="8 10" />
              </svg>
              {/* Punto orbital */}
              <div style={{
                position: 'absolute', top: 5, left: '50%', marginLeft: -5,
                width: 10, height: 10, borderRadius: '50%',
                background: 'rgba(37,99,235,0.18)',
                boxShadow: '0 0 8px rgba(37,99,235,0.3)',
              }} />
            </div>

            {/* Anillo orbital pequeño — contrarotación */}
            <div style={{
              position: 'absolute', top: '55%', right: '12%',
              width: 180, height: 180,
              marginTop: -90,
              animation: 'bgOrbitCCW 18s linear infinite',
            }}>
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="90" cy="90" r="86" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="5 8" />
              </svg>
              <div style={{
                position: 'absolute', bottom: 4, left: '50%', marginLeft: -4,
                width: 8, height: 8, borderRadius: '50%',
                background: 'rgba(34,197,94,0.25)',
              }} />
            </div>

            {/* Gráfico de velas profesional — esquina inferior derecha */}
            <div style={{
              position: 'absolute', bottom: 20, right: '3%',
              animation: 'bgFloat3 9s ease-in-out infinite',
            }}>
              <svg width="280" height="160" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Gradiente área MA */}
                  <linearGradient id="hmaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.09" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                  {/* Fade lateral izquierdo */}
                  <linearGradient id="hfadeX" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="white" stopOpacity="0" />
                    <stop offset="28%"  stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                  </linearGradient>
                  <mask id="hfadeMask">
                    <rect width="260" height="150" fill="url(#hfadeX)" />
                  </mask>
                </defs>

                <g mask="url(#hfadeMask)">
                  {/* Grid horizontal */}
                  {[32, 64, 96, 128].map(y => (
                    <line key={y} x1="0" y1={y} x2="260" y2={y}
                      stroke="rgba(37,99,235,0.055)" strokeWidth="1" />
                  ))}

                  {/* Velas: [x, wickTop, open_y, close_y, wickBottom, bullish] */}
                  {([
                    [14,  140, 130, 120, 144, true ],
                    [40,  117, 122, 128, 131, false],
                    [66,  103, 130, 107, 135, true ],
                    [92,  97,  113, 102, 118, false],
                    [118, 79,  104, 83,  110, true ],
                    [144, 61,  86,  65,  92,  true ],
                    [170, 49,  68,  54,  74,  false],
                    [196, 35,  56,  39,  62,  true ],
                    [222, 18,  40,  22,  46,  true ], // última
                  ] as [number,number,number,number,number,boolean][]).map(([x, wt, oy, cy, wb, bull], i) => {
                    const bTop = Math.min(oy, cy);
                    const bH   = Math.max(Math.abs(oy - cy), 2);
                    const isLast = i === 8;
                    const bullStroke = 'rgba(34,197,94,0.5)';
                    const bearStroke = 'rgba(239,68,68,0.45)';
                    const bullFill   = 'rgba(34,197,94,0.16)';
                    const bearFill   = 'rgba(239,68,68,0.12)';
                    return (
                      <g key={x} style={isLast ? { animation: 'bgCandleBreath 2.2s ease-in-out infinite' } : undefined}>
                        {/* Mecha */}
                        <line x1={x+7} y1={wt} x2={x+7} y2={wb}
                          stroke={bull ? 'rgba(34,197,94,0.38)' : 'rgba(239,68,68,0.32)'}
                          strokeWidth="1.5" strokeLinecap="round" />
                        {/* Cuerpo */}
                        <rect x={x} y={bTop} width={14} height={bH}
                          rx="1.5"
                          fill={bull ? bullFill : bearFill}
                          stroke={bull ? bullStroke : bearStroke}
                          strokeWidth="1"
                          style={isLast ? { animation: 'bgCandleGlow 2.2s ease-in-out infinite' } : undefined}
                        />
                      </g>
                    );
                  })}

                  {/* Área bajo la MA */}
                  <path
                    d="M66,119 L92,113 L118,98 L144,84 L170,68 L196,53 L222,39 L222,150 L66,150 Z"
                    fill="url(#hmaGrad)"
                  />

                  {/* Línea MA — se dibuja al cargar */}
                  <polyline
                    points="66,119 92,113 118,98 144,84 170,68 196,53 222,39"
                    stroke="rgba(37,99,235,0.38)" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="220" strokeDashoffset="220"
                    style={{ animation: 'bgMADraw 1.8s cubic-bezier(0.4,0,0.2,1) 0.4s forwards' }}
                  />

                  {/* Línea de último precio — dashed */}
                  <line x1="10" y1="22" x2="232" y2="22"
                    stroke="rgba(34,197,94,0.28)" strokeWidth="1"
                    strokeDasharray="4 5" />

                  {/* Punto vivo: outer ping */}
                  <circle cx="236" cy="22" r="3.5"
                    fill="rgba(34,197,94,0.35)">
                    <animate attributeName="r" values="3.5;9;3.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Punto vivo: inner sólido */}
                  <circle cx="236" cy="22" r="3" fill="rgba(34,197,94,0.85)" />

                  {/* Label precio */}
                  <rect x="241" y="16" width="17" height="12" rx="3"
                    fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.3)" strokeWidth="0.8" />
                  <text x="249.5" y="25" textAnchor="middle"
                    fontSize="6.5" fontWeight="700" fill="rgba(34,197,94,0.75)"
                    fontFamily="monospace">↑</text>
                </g>
              </svg>
            </div>

            {/* Ícono de dólar flotante pequeño — izquierda media */}
            <div style={{
              position: 'absolute', top: '38%', left: '2%',
              animation: 'bgFloat2 11s ease-in-out infinite',
              opacity: 0.07,
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>

            {/* Pill tipo de cambio — decorativo, arriba izquierda */}
            <div style={{
              position: 'absolute', top: '12%', left: '3%',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 100,
              background: 'rgba(37,99,235,0.04)',
              border: '1px solid rgba(37,99,235,0.08)',
              animation: 'bgFloat3 13s ease-in-out infinite',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(34,197,94,0.4)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(37,99,235,0.3)', letterSpacing: '0.1em', fontFamily: 'var(--font-poppins)' }}>USD / PEN</span>
            </div>

            {/* Línea de tendencia — fondo inferior */}
            <svg
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '70%', opacity: 0.07 }}
              viewBox="0 0 700 80" preserveAspectRatio="none" fill="none"
            >
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
                  <stop offset="40%" stopColor="#2563EB" stopOpacity="1" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="1" />
                </linearGradient>
              </defs>
              <polyline
                points="0,70 80,60 160,55 200,45 280,50 350,30 420,35 500,20 580,25 640,10 700,15"
                stroke="url(#trendGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>

            {/* Puntos de cuadrícula tenue */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.05) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }} />
          </div>
        )}

        <div className="flex-1 flex flex-col items-start w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-6 sm:pt-10 pb-4 sm:pb-8 relative z-10">

          {/* H1 personas - entre encabezado y grid, solo móvil */}
          {!isEmpresaPage && (
            <h1 className="sm:hidden font-display font-black leading-[1.05] mb-4 text-center w-full hero-anim hero-delay-0" style={{ color: '#0D1117' }}>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>El cambio de dólares</span>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', color: '#2563EB' }}>que siempre</span>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>quisiste tener</span>
            </h1>
          )}

          {/* H1 empresa - encima del card Herramientas Corporativas, solo móvil */}
          {isEmpresaPage && (
            <h1 className="sm:hidden font-display font-black leading-[1.05] mb-4 text-center w-full" style={{ color: '#0D1117' }}>
              <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>En los negocios <span style={{ color: '#2563EB' }}>cada centavo</span> cuenta</span>
            </h1>
          )}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 items-center w-full">

            {/* LEFT - Texto */}
            <div className="order-2 sm:order-1">
              {/* Pill label */}
              <div className="flex justify-center sm:justify-start mb-4 sm:mb-7 hero-anim hero-delay-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold tracking-[0.18em] uppercase" style={{ borderColor: '#2563EB', color: '#2563EB', background: 'rgba(37,99,235,0.06)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                  Fintech de cambio de divisas · Perú
                </span>
              </div>

              <h1 className="hidden sm:block font-display font-black leading-[1.05] mb-6 hero-anim hero-delay-1" style={{ color: '#0D1117' }}>
                {isEmpresaPage ? (
                  <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>En los negocios <span style={{ color: '#2563EB' }}>cada centavo</span> cuenta</span>
                ) : (
                  <>
                    <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>El cambio de dólares</span>
                    <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', color: '#2563EB' }}>que siempre</span>
                    <span className="block" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}>quisiste tener</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg max-w-[440px] mb-6 sm:mb-9 leading-relaxed text-justify sm:text-left hero-anim hero-delay-2" style={{ color: '#6B7280' }}>
                {isEmpresaPage
                  ? 'Gestiona tus operaciones cambiarias con una plataforma segura, atención personalizada y tasas competitivas que generan un impacto real en la rentabilidad de tu empresa.'
                  : 'En cada una de tus metas, estamos contigo. Cambia tus dólares de forma rápida, segura y 100% digital, con las mejores tasas y sin costos ocultos.'}
              </p>

              <div className="flex flex-wrap gap-3 mb-6 sm:mb-10 hero-anim hero-delay-3">
                {isEmpresaPage ? (
                  isAuthenticated && (
                  <button
                    onClick={() => guardedAction(() => window.open('https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20tipo%20de%20cambio%20corporativo.', '_blank'))}
                    className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm text-white w-full sm:w-auto btn-press active:scale-[0.97]"
                    style={{ background: '#0A0A0A' }}
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
                    className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm text-white w-full sm:w-auto btn-press active:scale-[0.97]"
                    style={{ background: '#000000' }}
                  >
                    Cotizar ahora
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

<div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs font-medium hero-anim hero-delay-4" style={{ color: '#6B7280' }}>
                {isEmpresaPage ? (
                  <>
                    <span className="flex items-center gap-1.5"><HandCoins className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />Rentabilidad</span>
                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />Inmediato</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />Exclusivo</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" style={{ color: '#000000' }} />Registrados ante la SBS</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" style={{ color: '#000000' }} />En 15 minutos</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#000000' }} />0 comisiones</span>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT - Calculadora / FX Terminal */}
            <div className="order-1 sm:order-2 relative flex items-center justify-center hero-anim hero-delay-1">

              <div className="relative z-10 w-full max-w-[400px]">
              {isEmpresaPage && !isAuthenticated ? (
                <div className="relative overflow-hidden rounded-2xl"
                  style={{
                    background: '#0A0A0A',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 48px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>

                  {/* Blue accent top bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: '#2563EB' }} />

                  <div className="px-8 py-8">

                    {/* Eyebrow */}
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-6" style={{ color: '#2563EB' }}>
                      Corporativo
                    </p>

                    {/* Headline */}
                    <h3 className="font-black leading-[1.1] mb-3" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', color: '#ffffff' }}>
                      El tipo de cambio<br />que su empresa merece.
                    </h3>

                    <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      TC preferencial, liquidación en 15 min y ejecutivo dedicado para operaciones desde $5,000.
                    </p>

                    {/* Three pillars */}
                    <div className="flex gap-6 mb-8">
                      {[
                        { value: "15'", label: 'Liquidación' },
                        { value: '0%',   label: 'Comisiones' },
                        { value: '+TC',  label: 'Preferencial' },
                      ].map(({ value, label }, i) => (
                        <div key={label} className="flex flex-col">
                          <span className="text-2xl font-black text-white leading-none">{value}</span>
                          <span className="text-[10px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => guardedAction(() => {
                        router.push(isAuthenticated ? '/dashboard/empresa/nueva-operacion' : '/login?from=/empresa');
                      })}
                      className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 group"
                      style={{ background: '#2563EB', border: 'none', cursor: 'pointer' }}>
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
              ) : isEmpresaPage ? (
              <div>
              <Calculator
                initialRates={{ compra: parseFloat(buyRate), venta: parseFloat(sellRate) }}
                showContinueButton={true}
                dark={false}
                onOperationReady={(operationType, amountUSD, exchangeRate) => guardedAction(() => {
                  const params = amountUSD && parseFloat(amountUSD) > 0
                    ? `?tipo=${operationType}&monto=${amountUSD}&tc=${exchangeRate}`
                    : '';
                  router.push(isAuthenticated ? `/dashboard/empresa/nueva-operacion${params}` : '/login?from=/empresa');
                })}
              />
              </div>
              ) : (
              /* ── Persona: unified rate panel ── */
              <div className="flex flex-col gap-3 w-full">

                {/* Panel unificado */}
                <div style={{
                  background: 'linear-gradient(160deg, #070C18 0%, #0A1020 50%, #080E1A 100%)',
                  borderRadius: 22,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
                  animation: 'tcSlide 0.4s cubic-bezier(0.16,1,0.3,1) both',
                }}>

                  {/* Header */}
                  <div style={{ padding: '13px 20px 11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inset-0 rounded-full opacity-70" style={{ background: '#22C55E' }} />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#22C55E' }} />
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>En vivo</span>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>USD · PEN</span>
                  </div>

                  {/* Compramos */}
                  <div style={{ padding: '22px 22px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', flexShrink: 0, boxShadow: '0 0 5px rgba(74,222,128,0.7)', animation: 'tcGlowGreen 2.5s ease-in-out infinite' }} />
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4ADE80' }}>Compramos</span>
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginLeft: 11 }}>Tú vendes dólares</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.45)', paddingBottom: 5 }}>S/</span>
                        <span className="tc-rate-number" style={{ fontWeight: 900, color: '#ffffff' }}>
                          {(currentRates?.tipo_compra ?? parseFloat(buyRate)).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divisor */}
                  <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)', margin: '0 22px' }} />

                  {/* Vendemos */}
                  <div style={{ padding: '20px 22px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#60A5FA', display: 'inline-block', flexShrink: 0, boxShadow: '0 0 5px rgba(96,165,250,0.7)', animation: 'tcGlowBlue 2.5s ease-in-out 0.8s infinite' }} />
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA' }}>Vendemos</span>
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginLeft: 11 }}>Tú compras dólares</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.45)', paddingBottom: 5 }}>S/</span>
                        <span className="tc-rate-number" style={{ fontWeight: 900, color: '#ffffff' }}>
                          {(currentRates?.tipo_venta ?? parseFloat(sellRate)).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer dentro del panel */}
                  <div style={{ padding: '9px 22px 13px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Shield size={9} style={{ color: 'rgba(255,255,255,0.45)' }} />
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>Regulado SBS</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => guardedAction(() => {
                    router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/login');
                  })}
                  className="w-full font-bold text-sm text-white flex items-center justify-center gap-2.5 group active:scale-[0.98]"
                  style={{
                    padding: '15px 20px',
                    background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
                    borderRadius: 14,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    animation: 'tcSlide 0.55s cubic-bezier(0.16,1,0.3,1) both',
                  }}
                >
                  Iniciar operación
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                {!isAuthenticated && (
                  <Link href="/crear-cuenta"
                    className="text-center text-[11px] font-medium transition-opacity hover:opacity-70"
                    style={{ color: '#9CA3AF' }}>
                    Regístrate
                  </Link>
                )}
              </div>
              )}

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
        </div>

      </section>

      {/* ======================================
          TRUST STRIP - Bancos + SBS mejorado
      ====================================== */}
      <section ref={banksSectionRef} className="py-4 sm:py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8">

          {/* Encabezado */}
          <div className="mb-7 text-center reveal">
            <h2 className="font-display font-black leading-[1.05]" style={{ color: '#0D1117', fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)' }}>
              Operamos con los bancos <span style={{ color: '#2563EB' }}>principales del Peru</span>
            </h2>
          </div>

          {/* Logos bancos - 2 grupos con etiqueta */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">

          {/* Grupo 1 - Card unificada BCP + Interbank + BanBif */}
          <div className="flex-[3]">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: '#9CA3AF' }}>
              Transferencias inmediatas a todo el Perú
            </p>

            {/* Card unificada */}
            {(() => {
              const hovered = hoveredBank === 'group1';
              return (
                <div
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(37,99,235,0.45)' : 'rgba(0,0,0,0.08)'}`,
                    background: hovered ? 'rgba(37,99,235,0.04)' : '#ffffff',
                    boxShadow: hovered ? '0 16px 40px rgba(37,99,235,0.15), 0 4px 16px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
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

          {/* Grupo 2 - Interbancaria solo Lima */}
          <div className="flex-[1] flex flex-col">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: '#9CA3AF' }}>
              Interbancaria solo Lima
            </p>

            {/* Card agrupada: 6 bancos - CCI Interbank */}
            {(() => {
              const hovered = hoveredBank === 'cci';
              const CCI = { soles: '003-200-003007757571-37', dolares: '003-200-003007757589-39' };
              return (
                <div
                  className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 flex-1 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{
                    border: `1px solid ${hovered ? 'rgba(37,99,235,0.5)' : 'rgba(0,0,0,0.08)'}`,
                    background: hovered ? 'rgba(37,99,235,0.04)' : '#ffffff',
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
                  {/* Logos - 2 filas de 3, uniformes */}
                  <div className={`flex flex-col items-center px-2 transition-all duration-300 ${hovered ? 'scale-[0.6] -translate-y-8' : 'scale-100 translate-y-0'}`} style={{ gap: '2px' }}>
                    {/* Fila 1 */}
                    <div className="flex items-center justify-center gap-3 w-full">
                      {[{ src: '/BBVA.png', alt: 'BBVA' }, { src: '/Scotiabank.png', alt: 'Scotiabank' }, { src: '/Banco Pichincha.png', alt: 'Pichincha' }].map(({ src, alt }) => (
                        <div key={alt} className="flex items-center justify-center" style={{ width: '72px', height: '44px' }}>
                          <img src={src} alt={alt} style={{ maxWidth: '72px', maxHeight: '44px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>
                    {/* Fila 2 - GNB + Santander + card Otros Bancos */}
                    <div className="flex items-center justify-center gap-3 w-full">
                      {[{ src: '/bancognb.png', alt: 'GNB' }, { src: '/bancosantander.png', alt: 'Santander' }].map(({ src, alt }) => (
                        <div key={alt} className="flex items-center justify-center" style={{ width: alt === 'GNB' ? '90px' : '72px', height: alt === 'GNB' ? '56px' : '44px' }}>
                          <img src={src} alt={alt} style={{ maxWidth: alt === 'GNB' ? '90px' : '72px', maxHeight: alt === 'GNB' ? '56px' : '44px', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                        </div>
                      ))}
                      {/* Card Otros Bancos */}
                      <div className="flex flex-col items-center justify-center rounded-lg" style={{
                        width: '72px', height: '44px',
                        border: '1px solid rgba(37,99,235,0.35)',
                        background: 'rgba(37,99,235,0.07)',
                      }}>
                        <span className="text-[7px] font-black uppercase tracking-[0.12em] leading-tight text-center" style={{ color: '#2563EB' }}>Otros<br/>Bancos</span>
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
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-5 reveal">
            {[
              { icon: CheckCircle2, label: 'Sin comisiones ocultas' },
              { icon: Clock,        label: 'En menos de 15 minutos' },
              { icon: Lock,         label: 'SSL cifrado' },
              { icon: Shield,       label: 'Datos protegidos por ley' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#6B7280' }}>
                <Icon className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />{label}
              </span>
            ))}
          </div>
        </div>
      </section>


      {!isEmpresaPage && (
      <section className="py-10 sm:py-16" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">

            {/* LEFT - headline + 3 stats inline */}
            <div className="reveal-left flex flex-col justify-between">
              <div>
                <h2 className="font-display font-black text-3xl md:text-4xl leading-[1.1] mb-3" style={{ color: '#0D1117' }}>
                  Cada sol importa.<br />
                  <span style={{ color: '#2563EB' }}>No lo pierdas</span> en el banco.
                </h2>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: '#000000' }}>
                  <span className="w-3 h-px inline-block" style={{ background: '#000000' }} />Lo que ganas
                </span>
              </div>

              {/* 3 stats compactos */}
              <div className="grid grid-cols-3 gap-0" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }}>
                {[
                  { value: 80, prefix: '~S/', suffix: '',    label: 'más por cada $1,000', sub: 'vs banco (aprox.)', speedClock: false },
                  { value: 10, prefix: '',   suffix: 'min', label: 'tiempo aprox.',        sub: 'por operación', speedClock: true },
                  { value: 0,  prefix: 'S/', suffix: '',    label: 'comisiones',           sub: 'siempre', speedClock: false },
                ].map(({ value, prefix, suffix, label, sub, speedClock }, i) => (
                  <div key={label} className="pt-5 pb-2" style={{ paddingLeft: i > 0 ? '20px' : '0', borderLeft: i > 0 ? '1px solid rgba(13,27,42,0.08)' : 'none' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {speedClock && (
                        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: '22px', height: '22px' }}>
                          {/* Ghost trail sutil */}
                          <Clock className="absolute w-4 h-4" style={{ color: '#000000', animation: 'clockOrganic 1.4s cubic-bezier(0.4,0,0.6,1) infinite', opacity: 0.12, filter: 'blur(1.5px)', animationDelay: '-0.3s' }} />
                          {/* Icono principal */}
                          <Clock className="relative w-4 h-4" style={{ color: '#000000', animation: 'clockOrganic 1.4s cubic-bezier(0.4,0,0.6,1) infinite' }} />
                        </div>
                      )}
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs font-bold" style={{ color: '#000000' }}>{prefix}</span>
                        <span className="text-3xl font-black tabular-nums leading-none" style={{ color: '#000000' }}><AnimatedStat value={value} label="" /></span>
                        <span className="text-sm font-bold ml-0.5" style={{ color: '#000000' }}>{suffix}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold leading-tight" style={{ color: '#0D1117' }}>{label}</div>
                    <div className="text-[10px]" style={{ color: '#9CA3AF' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* end reveal-left */}

            {/* RIGHT - tabla compacta */}
            <div className="reveal-right flex flex-col h-full">

              {/* Tabla */}
              <div className="flex-1 flex flex-col rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

                {/* Encabezado único */}
                <div className="flex items-center px-4 py-3" style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs font-bold tracking-tight" style={{ color: '#0D1117' }}>Tipo de cambio hoy</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold" style={{ color: '#4ade80' }}>
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ background: '#4ade80', opacity: 0.6 }} />
                        <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: '#4ade80' }} />
                      </span>
                      En vivo
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-14 text-right text-[9px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Compra</span>
                    <span className="w-14 text-right text-[9px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Venta</span>
                  </div>
                </div>

                {/* Qoricash */}
                {(() => {
                  const qc_compra = currentRates?.tipo_compra?.toFixed(3) || buyRate;
                  const qc_venta  = currentRates?.tipo_venta?.toFixed(3)  || sellRate;
                  return (
                    <div className="flex items-center px-4 py-3" style={{
                      background: 'rgba(0,0,0,0.03)',
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      borderLeft: '2px solid #000000',
                    }}>
                      <div className="flex items-center gap-2.5 flex-1">
                        <img src="/vg.png" alt="Qoricash" className="h-8 w-auto object-contain flex-shrink-0" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-white px-1.5 py-0.5 rounded-full" style={{ background: '#2563EB' }}>Mejor</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-14 text-right text-sm font-black tabular-nums" style={{ color: '#0D1117' }}>{qc_compra}</span>
                        <span className="w-14 text-right text-sm font-black tabular-nums" style={{ color: '#0D1117' }}>{qc_venta}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Bancos - tasas calculadas en base al TC de Qoricash con spreads típicos de banca */}
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
                        <div key={name} className="flex flex-1 items-center px-4 py-2.5 transition-colors hover:bg-gray-50/80" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                          <div className="flex items-center gap-2.5 flex-1">
                            <img src={logo} alt={name} className="h-7 w-auto object-contain flex-shrink-0" />
                            <span className="text-sm font-medium" style={{ color: '#6B7280' }}>{name}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="w-14 text-right text-sm tabular-nums font-medium" style={{ color: '#374151' }}>{compra}</span>
                            <span className="w-14 text-right text-sm tabular-nums font-medium" style={{ color: '#374151' }}>{venta}</span>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  );
                })()}
              </div>

              <p className="text-[10px] mt-2 text-right" style={{ color: '#9CA3AF' }}>
                *Tasas bancarias referenciales.
              </p>
            </div>

          </div>
        </div>
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
      <section id="como-funciona" className="pt-8 sm:pt-12 pb-12 sm:pb-20" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-12 reveal">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-4" style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#6B7280' }}>
              Simple como siempre debió ser
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl" style={{ color: '#0D1117' }}>Opera en 3 simples pasos</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">

            {/* -- CARD 01 - Cotiza en línea -- */}
            <div className="group rounded-2xl overflow-hidden flex flex-col reveal reveal-delay-1" style={{ border: '1px solid rgba(13,27,42,0.07)', boxShadow: '0 2px 12px rgba(13,27,42,0.05)', transition: 'transform 0.35s cubic-bezier(0.22,0.68,0,1.1), box-shadow 0.35s ease, border-color 0.25s ease' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(13,27,42,0.12)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(37,99,235,0.18)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(13,27,42,0.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,42,0.07)'; }}>
              {/* Illustration zone */}
              <div style={{ position: 'relative', background: '#F8FAFC', height: 210, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Dot grid */}
                <svg width="100%" height="210" viewBox="0 0 320 210" fill="none" style={{ position: 'absolute', inset: 0 }}>
                  {Array.from({ length: 4 }, (_, r) => Array.from({ length: 7 }, (_, c) => (
                    <circle key={`s1-${r}-${c}`} cx={20 + c * 47} cy={22 + r * 56} r={1.2} fill="#CBD5E1" opacity={0.5} />
                  )))}
                  <g style={{ transformOrigin: '160px 105px', animation: 'sp-spin 30s linear infinite' }}>
                    <circle cx="160" cy="105" r="88" stroke="#E2E8F0" strokeWidth="1" fill="none" strokeDasharray="3 8" />
                    <circle cx="160" cy="17"  r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="248" cy="105" r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="160" cy="193" r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="72"  cy="105" r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                  </g>
                  <g style={{ transformOrigin: '160px 105px', animation: 'sp-spin-r 20s linear infinite', animationDelay: '-3s' }}>
                    <circle cx="160" cy="105" r="56" stroke="#F1F5F9" strokeWidth="1.5" fill="none" />
                    <circle cx="160" cy="49"  r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="216" cy="105" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="160" cy="161" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="104" cy="105" r="3.5" fill="#2563EB" opacity="0.2" />
                  </g>
                </svg>

                {/* Central card */}
                <div style={{
                  position: 'relative', zIndex: 2,
                  width: 154, height: 148,
                  background: '#fff', borderRadius: 22,
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 9, overflow: 'hidden', padding: '0 14px',
                  animation: 'sp-fadein 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both',
                }}>
                  {/* Scan line */}
                  <div style={{
                    position: 'absolute', left: 10, right: 10, height: 1.5,
                    background: 'linear-gradient(90deg, transparent, #2563EB88, #2563EB, #2563EB88, transparent)',
                    borderRadius: 2, animation: 'sp-scan 3s ease-in-out 1s infinite', zIndex: 4,
                  }} />
                  {/* ENVÍAS */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>ENVÍAS</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F8FAFC', borderRadius: 8, padding: '5px 8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#2563EB' }}>$</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0D1117' }}>1,000</span>
                      <span style={{ display: 'inline-block', width: 1.5, height: 12, background: '#0D1117', marginLeft: 1, animation: 'sp-cursor 1s ease-in-out infinite' }} />
                      <span style={{ marginLeft: 'auto', fontSize: 8.5, fontWeight: 700, color: '#94a3b8' }}>USD</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                  {/* RECIBES */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 7.5, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>RECIBES</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#EFF6FF', borderRadius: 8, padding: '5px 8px', border: '1px solid #BFDBFE' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#0D1117' }}>S/</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0D1117', animation: 'sp-shimmer 2.5s ease-in-out infinite' }}>3,760.00</span>
                      <span style={{ marginLeft: 'auto', fontSize: 8.5, fontWeight: 700, color: '#94a3b8' }}>PEN</span>
                    </div>
                  </div>
                </div>

                {/* Badge: TC */}
                <div style={{
                  position: 'absolute', top: '7%', right: '4%', zIndex: 5,
                  background: '#fff', borderRadius: 14, padding: '6px 11px',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.09)',
                  animation: 'sp-badge 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both, sp-float 4.5s ease-in-out 1.2s infinite',
                }}>
                  <div style={{ fontSize: 8, fontWeight: 600, color: '#94a3b8' }}>Tipo de Cambio</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0D1117' }}>3.760</div>
                </div>

                {/* Badge: Al instante */}
                <div style={{
                  position: 'absolute', bottom: '8%', left: '3%', zIndex: 5,
                  background: '#0D1117', borderRadius: 14, padding: '6px 10px',
                  boxShadow: '0 6px 18px rgba(13,17,23,0.22)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  animation: 'sp-badge 0.7s cubic-bezier(0.22,1,0.36,1) 0.8s both, sp-float-r 5s ease-in-out 1.5s infinite',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB', animation: 'sp-blink 1.5s ease-in-out infinite' }} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Al instante</span>
                </div>

                {/* Floating dots */}
                <div style={{ position: 'absolute', top: '15%', left: '10%', width: 6, height: 6, borderRadius: '50%', background: '#2563EB', animation: 'sp-dot 3.2s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: '72%', right: '11%', width: 4, height: 4, borderRadius: '50%', background: '#0D1117', animation: 'sp-dot 4s ease-in-out 0.7s infinite', opacity: 0.3 }} />
                <div style={{ position: 'absolute', top: '40%', left: '5%', width: 4, height: 4, borderRadius: '50%', background: '#2563EB', animation: 'sp-dot 5s ease-in-out 1.2s infinite', opacity: 0.4 }} />
              </div>

              {/* Text body */}
              <div id="step-text-1" className="step-text-body px-6 py-5 flex-1" style={{ background: '#ffffff' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(13,27,42,0.35)' }}>Paso 01</span>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Cotiza en línea</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>Ingresa el monto y ve tu tipo de cambio exacto al instante, sin sorpresas ni letras chicas.</p>
              </div>
            </div>

            {/* -- CARD 02 - Transfiere -- */}
            <div className="group rounded-2xl overflow-hidden flex flex-col reveal reveal-delay-2" style={{ border: '1px solid rgba(13,27,42,0.07)', boxShadow: '0 2px 12px rgba(13,27,42,0.05)', transition: 'transform 0.35s cubic-bezier(0.22,0.68,0,1.1), box-shadow 0.35s ease, border-color 0.25s ease' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(13,27,42,0.12)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(37,99,235,0.18)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(13,27,42,0.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,42,0.07)'; }}>
              <div style={{ position: 'relative', background: '#F8FAFC', height: 210, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Dot grid */}
                <svg width="100%" height="210" viewBox="0 0 320 210" fill="none" style={{ position: 'absolute', inset: 0 }}>
                  {Array.from({ length: 4 }, (_, r) => Array.from({ length: 7 }, (_, c) => (
                    <circle key={`s2-${r}-${c}`} cx={20 + c * 47} cy={22 + r * 56} r={1.2} fill="#CBD5E1" opacity={0.5} />
                  )))}
                  <g style={{ transformOrigin: '160px 105px', animation: 'sp-spin 35s linear infinite', animationDelay: '-6s' }}>
                    <circle cx="160" cy="105" r="88" stroke="#E2E8F0" strokeWidth="1" fill="none" strokeDasharray="3 8" />
                    <rect x="157" y="13" width="6" height="6" rx="1.5" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <rect x="245" y="102" width="6" height="6" rx="1.5" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <rect x="157" y="191" width="6" height="6" rx="1.5" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <rect x="69"  y="102" width="6" height="6" rx="1.5" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                  </g>
                  <g style={{ transformOrigin: '160px 105px', animation: 'sp-spin-r 22s linear infinite' }}>
                    <circle cx="160" cy="105" r="56" stroke="#F1F5F9" strokeWidth="1.5" fill="none" />
                    <circle cx="160" cy="49"  r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="216" cy="105" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="160" cy="161" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="104" cy="105" r="3.5" fill="#2563EB" opacity="0.2" />
                  </g>
                </svg>

                {/* Central card */}
                <div style={{
                  position: 'relative', zIndex: 2,
                  width: 178, height: 130,
                  background: '#fff', borderRadius: 22,
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, overflow: 'hidden', padding: '0 16px',
                  animation: 'sp-fadein 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both',
                }}>
                  {/* Scan line */}
                  <div style={{
                    position: 'absolute', left: 10, right: 10, height: 1.5,
                    background: 'linear-gradient(90deg, transparent, #2563EB88, #2563EB, #2563EB88, transparent)',
                    borderRadius: 2, animation: 'sp-scan 3.2s ease-in-out 1s infinite', zIndex: 4,
                  }} />
                  {/* Transfer row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center' }}>
                    {/* Bank icon */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                          <path d="M14 3L25 9.5H3L14 3Z" fill="#0D1117" opacity="0.08" stroke="#0D1117" strokeWidth="1.2" strokeLinejoin="round"/>
                          <rect x="3" y="9.5" width="22" height="2" fill="#0D1117" opacity="0.18"/>
                          <rect x="5"   y="11.5" width="2.5" height="9" rx="0.8" fill="#0D1117" opacity="0.22"/>
                          <rect x="9.5" y="11.5" width="2.5" height="9" rx="0.8" fill="#0D1117" opacity="0.22"/>
                          <rect x="14"  y="11.5" width="2.5" height="9" rx="0.8" fill="#0D1117" opacity="0.22"/>
                          <rect x="18.5" y="11.5" width="2.5" height="9" rx="0.8" fill="#0D1117" opacity="0.22"/>
                          <rect x="2" y="20.5" width="24" height="2" rx="0.8" fill="#0D1117" opacity="0.14"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: 7.5, fontWeight: 600, color: '#94a3b8' }}>Tu banco</span>
                    </div>
                    {/* Animated flow dots */}
                    <div style={{ flex: 1, position: 'relative', height: 14, overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #E2E8F0, #2563EB33, #E2E8F0)', marginTop: -0.5 }} />
                      {[0, 0.5, 1.0].map(d => (
                        <div key={d} style={{ position: 'absolute', top: '50%', marginTop: -5, width: 10, height: 10, animation: `sp-flow 1.5s ease-in-out ${d}s infinite` }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 5h8M6 2l3 3-3 3" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                    {/* Qoricash icon */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                          <circle cx="14" cy="14" r="10" stroke="#2563EB" strokeWidth="1.4" opacity="0.35"/>
                          <circle cx="14" cy="14" r="6.5" stroke="#2563EB" strokeWidth="1.1" opacity="0.2"/>
                          <circle cx="14" cy="13.5" r="4" stroke="#2563EB" strokeWidth="1.9" opacity="0.9"/>
                          <path d="M16.5 16.5l2.5 2.5" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" opacity="0.9"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: 7.5, fontWeight: 700, color: '#2563EB' }}>Qoricash</span>
                    </div>
                  </div>
                  {/* Bank chips */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['BCP', 'Interbank', 'BanBif'].map(b => (
                      <span key={b} style={{ fontSize: 7, fontWeight: 700, color: '#64748b', background: '#F1F5F9', borderRadius: 6, padding: '2px 5px', border: '1px solid #E2E8F0' }}>{b}</span>
                    ))}
                  </div>
                </div>

                {/* Badge: Encriptado */}
                <div style={{
                  position: 'absolute', top: '7%', right: '3%', zIndex: 5,
                  background: '#fff', borderRadius: 14, padding: '7px 10px',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.09)',
                  display: 'flex', alignItems: 'center', gap: 7,
                  animation: 'sp-badge 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both, sp-float 4.5s ease-in-out 1.2s infinite',
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0D1117', lineHeight: 1.2 }}>256-bit SSL</div>
                    <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>Encriptado</div>
                  </div>
                </div>

                {/* Badge: CCI */}
                <div style={{
                  position: 'absolute', bottom: '8%', left: '3%', zIndex: 5,
                  background: '#0D1117', borderRadius: 14, padding: '6px 10px',
                  boxShadow: '0 6px 18px rgba(13,17,23,0.22)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  animation: 'sp-badge 0.7s cubic-bezier(0.22,1,0.36,1) 0.8s both, sp-float-r 5s ease-in-out 1.5s infinite',
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>+ cualquier banco vía CCI</span>
                </div>

                {/* Floating dots */}
                <div style={{ position: 'absolute', top: '14%', left: '10%', width: 6, height: 6, borderRadius: '50%', background: '#2563EB', animation: 'sp-dot 3.2s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: '72%', right: '11%', width: 4, height: 4, borderRadius: '50%', background: '#0D1117', animation: 'sp-dot 4s ease-in-out 0.7s infinite', opacity: 0.3 }} />
                <div style={{ position: 'absolute', top: '40%', left: '5%', width: 4, height: 4, borderRadius: '50%', background: '#2563EB', animation: 'sp-dot 5s ease-in-out 1.2s infinite', opacity: 0.4 }} />
              </div>

              <div id="step-text-2" className="step-text-body px-6 py-5 flex-1" style={{ background: '#ffffff' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(13,27,42,0.35)' }}>Paso 02</span>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Transfiere a Qoricash</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>Transfiere directo desde BCP, Interbank o BanBif, o vía CCI desde BBVA, Scotiabank, Pichincha y cualquier otro banco del Perú.</p>
              </div>
            </div>

            {/* -- CARD 03 - Recibe tu dinero -- */}
            <div className="group rounded-2xl overflow-hidden flex flex-col reveal reveal-delay-3" style={{ border: '1px solid rgba(13,27,42,0.07)', boxShadow: '0 2px 12px rgba(13,27,42,0.05)', transition: 'transform 0.35s cubic-bezier(0.22,0.68,0,1.1), box-shadow 0.35s ease, border-color 0.25s ease' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(13,27,42,0.12)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(37,99,235,0.18)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(13,27,42,0.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,42,0.07)'; }}>
              <div style={{ position: 'relative', background: '#F8FAFC', height: 210, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Dot grid */}
                <svg width="100%" height="210" viewBox="0 0 320 210" fill="none" style={{ position: 'absolute', inset: 0 }}>
                  {Array.from({ length: 4 }, (_, r) => Array.from({ length: 7 }, (_, c) => (
                    <circle key={`s3-${r}-${c}`} cx={20 + c * 47} cy={22 + r * 56} r={1.2} fill="#CBD5E1" opacity={0.5} />
                  )))}
                  <g style={{ transformOrigin: '160px 105px', animation: 'sp-spin 28s linear infinite', animationDelay: '-10s' }}>
                    <circle cx="160" cy="105" r="88" stroke="#E2E8F0" strokeWidth="1" fill="none" strokeDasharray="3 8" />
                    <circle cx="160" cy="17"  r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="248" cy="105" r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="160" cy="193" r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                    <circle cx="72"  cy="105" r="4" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
                  </g>
                  <g style={{ transformOrigin: '160px 105px', animation: 'sp-spin-r 18s linear infinite', animationDelay: '-2s' }}>
                    <circle cx="160" cy="105" r="56" stroke="#F1F5F9" strokeWidth="1.5" fill="none" />
                    <circle cx="160" cy="49"  r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="216" cy="105" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="160" cy="161" r="3.5" fill="#2563EB" opacity="0.2" />
                    <circle cx="104" cy="105" r="3.5" fill="#2563EB" opacity="0.2" />
                  </g>
                </svg>

                {/* Central card */}
                <div style={{
                  position: 'relative', zIndex: 2,
                  width: 148, height: 148,
                  background: '#fff', borderRadius: 22,
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, overflow: 'hidden',
                  animation: 'sp-fadein 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both',
                }}>
                  {/* Progress ring */}
                  <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 72 72">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#F1F5F9" strokeWidth="3"/>
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#2563EB" strokeWidth="3"
                        strokeLinecap="round" strokeDasharray="188"
                        style={{ animation: 'sp-ring-p 4s ease-in-out infinite', filter: 'drop-shadow(0 0 4px rgba(37,99,235,0.35))' }}/>
                    </svg>
                    {/* Procesando text */}
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'sp-proc 4s ease-in-out infinite' }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8' }}>Procesando</span>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#0D1117', fontFamily: 'monospace', letterSpacing: 2 }}>···</span>
                    </div>
                    {/* Check done */}
                    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'sp-done 4s ease-in-out infinite', opacity: 0 }}>
                      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                        <circle cx="17" cy="17" r="15" fill="#EFF6FF"/>
                        <path d="M9 17l6 6 10-10" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                          strokeDasharray="40" style={{ animation: 'sp-check 4s ease-in-out infinite' }}/>
                      </svg>
                    </div>
                  </div>
                  {/* Amount */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#0D1117', animation: 'sp-shimmer 2.5s ease-in-out 0.5s infinite' }}>S/ 3,760.00</span>
                    <span style={{ fontSize: 8, fontWeight: 600, color: '#94a3b8' }}>en tu cuenta bancaria</span>
                  </div>
                </div>

                {/* Badge: < 15 min */}
                <div style={{
                  position: 'absolute', top: '7%', right: '3%', zIndex: 5,
                  background: '#fff', borderRadius: 14, padding: '7px 10px',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.09)',
                  display: 'flex', alignItems: 'center', gap: 7,
                  animation: 'sp-badge 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both, sp-float 4.5s ease-in-out 1.2s infinite',
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0D1117', lineHeight: 1.2 }}>&lt; 15 min</div>
                    <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>Tiempo promedio</div>
                  </div>
                </div>

                {/* Badge: Sin comisiones */}
                <div style={{
                  position: 'absolute', bottom: '8%', left: '3%', zIndex: 5,
                  background: '#0D1117', borderRadius: 14, padding: '6px 10px',
                  boxShadow: '0 6px 18px rgba(13,17,23,0.22)',
                  display: 'flex', alignItems: 'center', gap: 5,
                  animation: 'sp-badge 0.7s cubic-bezier(0.22,1,0.36,1) 0.8s both, sp-float-r 5s ease-in-out 1.5s infinite',
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Sin comisiones</span>
                </div>

                {/* Floating dots */}
                <div style={{ position: 'absolute', top: '14%', left: '10%', width: 6, height: 6, borderRadius: '50%', background: '#2563EB', animation: 'sp-dot 3.2s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: '72%', right: '11%', width: 4, height: 4, borderRadius: '50%', background: '#0D1117', animation: 'sp-dot 4s ease-in-out 0.7s infinite', opacity: 0.3 }} />
                <div style={{ position: 'absolute', top: '40%', left: '5%', width: 4, height: 4, borderRadius: '50%', background: '#2563EB', animation: 'sp-dot 5s ease-in-out 1.2s infinite', opacity: 0.4 }} />
              </div>

              <div id="step-text-3" className="step-text-body px-6 py-5 flex-1" style={{ background: '#ffffff' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(13,27,42,0.35)' }}>Paso 03</span>
                <h3 className="font-display font-bold text-lg mb-2 text-slate-800">Recibe tu dinero</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>Te transferimos el contravalor en menos de 15 minutos. Sin comisiones, sin cargos ocultos.</p>
              </div>
            </div>

          </div>

          <div className="text-center reveal">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-2.5 text-white font-bold px-9 py-4 rounded-full text-sm btn-press active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 8px 24px rgba(37,99,235,0.35)' }}
            >
              Empezar ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {isEmpresaPage && isAuthenticated && (
      <section style={{ position: 'relative', overflow: 'hidden', background: '#F8FAFC', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
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
              Cotizar tipo de cambio corporativo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* AlertaTCBanner - solo en página personas */}
      {!isAuthenticated && !isEmpresaPage && <AlertaTCBanner />}


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
                <img src="/vg.png" alt="Qoricash" className="h-8 w-auto" />
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
                  <li><Link href="/noticias" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900">Noticias</Link></li>
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
