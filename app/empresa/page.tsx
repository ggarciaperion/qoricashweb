'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import AlertaTCModal from '@/components/AlertaTCModal';
import {
  ArrowRight, ArrowLeft, Shield, Clock, CheckCircle2, Lock,
  LogOut, User as UserIcon, ChevronDown, Menu, X,
  HelpCircle, Banknote,
} from 'lucide-react';

export default function EmpresaPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRates, fetchRates, startRateSubscription } = useExchangeStore();
  const [buyRate] = useState('3.750');
  const [sellRate] = useState('3.770');

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const userBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const [isBanksSectionVisible, setIsBanksSectionVisible] = useState(false);
  const banksSectionRef = useRef<HTMLDivElement>(null);
  const [noticiasCorp, setNoticiasCorp] = useState<Array<{ id: string; titulo: string; descripcion: string; categoria: string; imagen?: string; fecha: string }>>([]);
  const [newsCorpIdx, setNewsCorpIdx] = useState(0);
  const [roiVolume, setRoiVolume] = useState(50000);

  const BANK_ACCOUNTS = {
    bcp:       { soles: '1937353150041',  dolares: '1917357790119'  },
    interbank: { soles: '200-3007757571', dolares: '200-3007757589' },
    banbif:    { soles: '007000845805',   dolares: '007000845813'   },
  } as const;

  // No auto-redirigir: usuarios autenticados pueden navegar a esta página desde el dashboard

  // Load data
  useEffect(() => {
    fetch('/api/noticias').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setNoticiasCorp(data.slice(0, 6));
    }).catch(() => {});
  }, []);

  // Real-time exchange rates
  useEffect(() => {
    fetchRates();
    const unsub = startRateSubscription();
    return () => unsub();
  }, []);

  // News carousel
  useEffect(() => {
    if (noticiasCorp.length < 2) return;
    const t = setInterval(() => setNewsCorpIdx(i => (i + 1) % noticiasCorp.length), 6000);
    return () => clearInterval(t);
  }, [noticiasCorp.length]);

  // Banks observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setIsBanksSectionVisible(true); }); },
      { threshold: 0.2 }
    );
    if (banksSectionRef.current) observer.observe(banksSectionRef.current);
    return () => { if (banksSectionRef.current) observer.unobserve(banksSectionRef.current); };
  }, []);

  // Alert check
  const prevRatesRef = useRef<{ compra: number; venta: number } | null>(null);
  useEffect(() => {
    if (!currentRates) return;
    const { tipo_compra: compra, tipo_venta: venta } = currentRates;
    const prev = prevRatesRef.current;
    if (prev && prev.compra === compra && prev.venta === venta) return;
    prevRatesRef.current = { compra, venta };
    fetch('/api/alertas/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compra, venta }),
    }).catch(() => {});
  }, [currentRates]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, ''));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setLoggingOut(true);
    await new Promise(r => setTimeout(r, 1100));
    await logout();
    window.location.href = '/empresa';
  };

  return (
    <>
      {loggingOut && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <img src="/logo-principal.png" alt="Qoricash" className="h-16 w-auto mb-4" />
          <p className="font-bold text-sm text-gray-500">Cerrando sesión...</p>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes ec-shimmer   { 0%,100%{opacity:0.75} 50%{opacity:1} }
        @keyframes ec-glow-in   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ec-ping-slow { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2.4);opacity:0} }
        @keyframes ec-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes ec-scan      { 0%,100%{transform:translateX(-100%);opacity:0} 15%{opacity:0.4} 85%{opacity:0.4} 100%{transform:translateX(800px);opacity:0} }
        @keyframes ec-bar       { 0%,100%{transform:scaleY(0.25)} 50%{transform:scaleY(1)} }
        @keyframes ec-spin-slow { to{transform:rotate(360deg)} }
        @keyframes ec-spin-r    { to{transform:rotate(-360deg)} }
        @keyframes ec-flow-r    { 0%{left:0;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{left:calc(100% - 8px);opacity:0} }
        @keyframes ec-node-pulse{ 0%,100%{opacity:0.45} 50%{opacity:1} }
        @keyframes ec-win       { 0%,100%{opacity:0.25} 50%{opacity:0.85} }
        @keyframes ec-trend     { 0%{stroke-dashoffset:120} 55%{stroke-dashoffset:0} 85%{stroke-dashoffset:0} 100%{stroke-dashoffset:120} }
        @keyframes ec-beacon    { 0%,100%{r:2;opacity:0.9} 50%{r:3.5;opacity:0.5} }
        @keyframes ec-count-up  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ec-candle-up   { 0%,100%{transform:scaleY(0.3);opacity:0.18} 50%{transform:scaleY(1);opacity:0.32} }
        @keyframes ec-candle-dn   { 0%,100%{transform:scaleY(0.5);opacity:0.12} 50%{transform:scaleY(0.85);opacity:0.22} }
        @keyframes ec-ticker-drift{ 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ec-sym-float   { 0%,100%{transform:translateY(0) rotate(-4deg);opacity:0.04} 50%{transform:translateY(-12px) rotate(-4deg);opacity:0.07} }
        @keyframes ec-sym-float2  { 0%,100%{transform:translateY(0) rotate(6deg);opacity:0.03} 50%{transform:translateY(-9px) rotate(6deg);opacity:0.06} }
        @keyframes ec-line-draw   { 0%{stroke-dashoffset:600} 100%{stroke-dashoffset:0} }
        @keyframes ec-dot-blink   { 0%,100%{opacity:0.15} 50%{opacity:0.45} }
        .ec-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ec-card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(0,0,0,0.09), 0 6px 18px rgba(37,99,235,0.07); }
        .reveal-corp { opacity:0; transform:translateY(18px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal-corp.visible { opacity:1; transform:translateY(0); }
      `}</style>

      <main className="min-h-screen" style={{ background: '#F8FAFC' }}>

        {/* ================================================================
            NAVBAR
        ================================================================ */}
        <header className="fixed top-0 left-0 right-0 z-50" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <nav className="max-w-5xl mx-auto flex justify-between items-center h-20 px-6 sm:px-8 lg:px-10">

            {/* Logo + badge */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/vg.png" alt="Qoricash" className="h-16 w-auto" />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#9CA3AF' }}>Corporate</span>
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {user && (
                    <AlertaTCModal
                      user={user}
                      currentCompra={currentRates?.tipo_compra}
                      currentVenta={currentRates?.tipo_venta}
                    />
                  )}
                  <button
                    ref={userBtnRef}
                    onClick={() => {
                      if (!isUserMenuOpen && userBtnRef.current) {
                        const rect = userBtnRef.current.getBoundingClientRect();
                        setDropdownPos({ top: rect.bottom + 10, left: rect.left + rect.width / 2 });
                      }
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black" style={{ background: '#2563EB' }}>
                      {((user?.razon_social || user?.nombres) ?? '?').charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">
                      {user?.document_type === 'RUC' ? user?.razon_social || user?.nombres : user?.nombres?.trim().split(/\s+/)[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/')}
                    className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group py-1"
                  >
                    Personas
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gray-900 rounded-full transition-all duration-300 group-hover:w-full" />
                  </button>
                  <span className="h-4 w-px" style={{ background: 'rgba(0,0,0,0.15)' }} />
                  <Link href="/login?from=/empresa" className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group py-1">
                    Iniciar Sesión
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gray-900 rounded-full transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link href="/crear-cuenta?tipo=empresa" className="text-sm font-bold px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all shadow-md text-white" style={{ background: '#0A0A0A' }}>
                    Regístrate
                  </Link>
                </>
              )}
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-1">
              {!isAuthenticated && (
                <>
                  <button onClick={() => router.push('/')} className="text-sm font-medium text-gray-500 hover:text-gray-900 px-2 transition-colors">Personas</button>
                  <span className="h-4 w-px" style={{ background: 'rgba(0,0,0,0.15)' }} />
                </>
              )}
              {isAuthenticated && user && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black mr-1" style={{ background: '#2563EB' }}>
                  {((user.razon_social || user.nombres) ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </header>

        {/* Mobile menu backdrop */}
        <div
          className={`lg:hidden fixed inset-0 z-[45] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ background: 'rgba(15,23,42,0.5)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile menu panel */}
        <div
          className={`lg:hidden fixed right-3 z-[49] rounded-3xl overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ width: 220, top: 74, maxHeight: isMobileMenuOpen ? '70vh' : 0, transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 48px rgba(0,0,0,0.18)' }}
        >
          <div className="px-4 pt-4 pb-5">
            {isAuthenticated ? (
              <div className="space-y-0.5">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}><Banknote className="w-4 h-4 text-gray-500" /></div>
                  <span className="text-sm font-medium">Mi Dashboard</span>
                </Link>
                <a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.08)' }}><HelpCircle className="w-4 h-4 text-blue-600" /></div>
                  <span className="text-sm font-medium">Ayuda</span>
                </a>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors" style={{ color: '#ef4444' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)' }}><LogOut className="w-4 h-4" /></div>
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/login?from=/empresa" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}><Lock className="w-4 h-4 text-gray-500" /></div>
                  <span className="text-sm font-medium flex-1">Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                </Link>
                <Link href="/crear-cuenta?tipo=empresa" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-white text-sm" style={{ background: '#0A0A0A' }} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="flex-1">Regístrate</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User dropdown portal */}
        {isUserMenuOpen && createPortal(
          <>
            <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsUserMenuOpen(false)} />
            <div className="fixed w-56 rounded-2xl py-2 overflow-hidden" style={{ zIndex: 99999, top: dropdownPos.top, left: dropdownPos.left, transform: 'translateX(-50%)', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
              <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard?perfil=1'); }} className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <UserIcon className="w-4 h-4 mr-3 opacity-50" />Mi perfil
              </button>
              <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }} className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Banknote className="w-4 h-4 mr-3 opacity-50" />Mi Dashboard
              </button>
              <div className="my-1 mx-4" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }} />
              <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4 mr-3 opacity-60" />Cerrar Sesión
              </button>
            </div>
          </>,
          document.body
        )}

        {/* ================================================================
            HERO — LIGHT CORPORATE
        ================================================================ */}
        <section style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #ffffff 55%, #F8FAFC 100%)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
          {/* Dot grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(37,99,235,0.055) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          {/* Blue ambient glow — top right */}
          <div style={{ position: 'absolute', top: -180, right: -120, width: 650, height: 650, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Subtle glow — bottom left */}
          <div style={{ position: 'absolute', bottom: -100, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* ── MICRO ANIMACIONES FONDO ── */}

          {/* Símbolo $ flotante izquierda */}
          <div style={{ position: 'absolute', left: '6%', top: '18%', fontSize: 80, fontWeight: 900, color: '#2563EB', pointerEvents: 'none', userSelect: 'none', animation: 'ec-sym-float 7s ease-in-out infinite' }}>$</div>
          {/* Símbolo $ flotante derecha pequeño */}
          <div style={{ position: 'absolute', right: '8%', bottom: '22%', fontSize: 48, fontWeight: 900, color: '#2563EB', pointerEvents: 'none', userSelect: 'none', animation: 'ec-sym-float2 9s ease-in-out 1.5s infinite' }}>$</div>

          {/* Velas japonesas — grupo decorativo bottom-left */}
          <div style={{ position: 'absolute', bottom: 32, left: '12%', display: 'flex', alignItems: 'flex-end', gap: 5, pointerEvents: 'none' }}>
            {[
              { h: 48, color: '#2563EB', delay: '0s',    anim: 'ec-candle-up' },
              { h: 32, color: '#94A3B8', delay: '0.4s',  anim: 'ec-candle-dn' },
              { h: 60, color: '#2563EB', delay: '0.8s',  anim: 'ec-candle-up' },
              { h: 24, color: '#94A3B8', delay: '0.2s',  anim: 'ec-candle-dn' },
              { h: 52, color: '#2563EB', delay: '1.1s',  anim: 'ec-candle-up' },
              { h: 38, color: '#2563EB', delay: '0.6s',  anim: 'ec-candle-up' },
              { h: 20, color: '#94A3B8', delay: '1.3s',  anim: 'ec-candle-dn' },
            ].map(({ h, color, delay, anim }, i) => (
              <div key={i} style={{ width: 7, height: h, background: color, borderRadius: 2, opacity: 0.18, transformOrigin: 'bottom', animation: `${anim} ${4 + i * 0.4}s ease-in-out ${delay} infinite` }} />
            ))}
          </div>

          {/* Línea de precio animada — SVG top-right */}
          <svg width="280" height="70" viewBox="0 0 280 70" fill="none" style={{ position: 'absolute', top: 60, right: '4%', opacity: 0.09, pointerEvents: 'none' }}>
            <polyline
              points="0,55 35,45 70,50 105,30 140,35 175,15 210,20 245,8 280,12"
              stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              fill="none"
              strokeDasharray="600"
              style={{ animation: 'ec-line-draw 4s ease-out forwards, ec-line-draw 8s ease-in-out 4s infinite alternate' }}
            />
            <circle cx="280" cy="12" r="3.5" fill="#2563EB" style={{ animation: 'ec-dot-blink 2s ease-in-out infinite' }} />
          </svg>

          {/* Ticker horizontal sutil — fila de texto cotizaciones */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', height: 24, pointerEvents: 'none', borderTop: '1px solid rgba(37,99,235,0.06)' }}>
            <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ec-ticker-drift 28s linear infinite', opacity: 0.18 }}>
              {['USD/PEN 3.358 ▲', 'EUR/USD 1.0842 ▲', 'GBP/USD 1.2631 ▼', 'USD/JPY 147.82 ▲', 'USD/CLP 945.30 ▼', 'USD/COP 4,132 ▲', 'USD/MXN 17.24 ▼',
                'USD/PEN 3.358 ▲', 'EUR/USD 1.0842 ▲', 'GBP/USD 1.2631 ▼', 'USD/JPY 147.82 ▲', 'USD/CLP 945.30 ▼', 'USD/COP 4,132 ▲', 'USD/MXN 17.24 ▼'].map((t, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#2563EB', padding: '0 28px', fontFamily: 'monospace' }}>{t}</span>
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-14 sm:pb-20">

            {/* Mobile H1 */}
            <h1 className="sm:hidden font-display font-black leading-[1.04] mb-6 text-center" style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', color: '#0F172A' }}>
              El tipo de cambio<br />que su empresa<br /><span style={{ color: '#2563EB' }}>merece.</span>
            </h1>

            <div className="grid sm:grid-cols-2 gap-8 lg:gap-14 items-center">

              {/* ── LEFT ── */}
              <div className="order-2 sm:order-1">

                {/* Corporate label */}
                <p className="hidden sm:block text-[11px] font-bold uppercase mb-8" style={{ color: '#9CA3AF', letterSpacing: '0.45em' }}>Qoricash Corporate · Fintech</p>

                <h1 className="hidden sm:block font-display font-black leading-[1.04] mb-5" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', color: '#0F172A' }}>
                  El tipo de cambio<br />que su empresa<br /><span style={{ color: '#2563EB' }}>merece.</span>
                </h1>

                <p className="text-sm sm:text-base leading-relaxed mb-9 max-w-md text-justify sm:text-left" style={{ color: '#64748B' }}>
                  Plataforma especializada en cambio de divisas para empresas. TC preferencial garantizado, liquidación en menos de 15 minutos y ejecutivo dedicado para operaciones desde $5,000.
                </p>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-[11px] font-medium" style={{ color: '#64748B' }}>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} />
                    Registrado SBS
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} />
                    Liquidación 15 min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} />
                    0 comisiones
                  </span>
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div className="order-1 sm:order-2 flex items-center justify-center">
                <div className="w-full max-w-[400px]">
                  {isAuthenticated ? (
                    /* ── Authenticated: live exchange rate card ── */
                    <div className="flex flex-col gap-3 w-full">
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

                        {/* Footer */}
                        <div style={{ padding: '9px 22px 13px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Shield size={9} style={{ color: 'rgba(255,255,255,0.45)' }} />
                            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>Regulado SBS</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => router.push('/dashboard/empresa/nueva-operacion')}
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
                        Nueva operación corporativa
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </button>
                    </div>
                  ) : (
                    /* Corporate card */
                    <div className="relative overflow-hidden rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', animation: 'ec-glow-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
                      {/* Accent bar */}
                      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #1E40AF, #2563EB 50%, #3B82F6)' }} />

                      <div className="empresa-hero-card-body">

                        {/* Header row */}
                        <div className="flex items-center justify-between mb-6">
                          <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: '#2563EB' }}>Corporativo</p>
                          <span className="flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', color: '#1D4ED8' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                            Exclusivo
                          </span>
                        </div>

                        {/* Corporate FX visual */}
                        <div className="mb-6 rounded-xl" style={{ background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.1)', overflow: 'hidden' }}>
                          <div style={{ padding: '18px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <svg width="210" height="96" viewBox="0 0 210 96" fill="none" xmlns="http://www.w3.org/2000/svg">

                              {/* ─ Ground line ─ */}
                              <line x1="18" y1="88" x2="192" y2="88" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8"/>

                              {/* ─ Left building wing ─ */}
                              <rect x="40" y="46" width="24" height="42" fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.25)" strokeWidth="0.8" rx="0.5"/>
                              {[48,56,64,72,80].map((y,ri) => [43,51].map((x,ci) => (
                                <rect key={`lw-${ri}-${ci}`} x={x} y={y} width="5" height="4" rx="0.4" fill="#2563EB"
                                  style={{ animation: `ec-win ${2.2 + ri * 0.4 + ci * 0.3}s ease-in-out ${ri * 0.2 + ci * 0.15}s infinite`,
                                    opacity: [[0.7,0.25],[0.25,0.65],[0.6,0.2],[0.2,0.7],[0.5,0.3]][ri][ci] }} />
                              )))}

                              {/* ─ Main tower ─ */}
                              <rect x="68" y="18" width="36" height="70" fill="rgba(37,99,235,0.1)" stroke="rgba(37,99,235,0.35)" strokeWidth="1" rx="0.5"/>
                              {/* Antenna */}
                              <line x1="86" y1="18" x2="86" y2="10" stroke="rgba(37,99,235,0.4)" strokeWidth="0.9"/>
                              {/* Beacon */}
                              <circle cx="86" cy="9" r="2.2" fill="#2563EB"
                                style={{ animation: 'ec-beacon 1.6s ease-in-out infinite', transformOrigin: '86px 9px' }}/>
                              <circle cx="86" cy="9" r="5" fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="0.7"
                                style={{ animation: 'ec-ping-slow 1.6s ease-out infinite', transformOrigin: '86px 9px' }}/>
                              {/* Tower windows 4×5 */}
                              {[20,29,38,47,56,65].map((y,ri) => [71,79,87,95].map((x,ci) => (
                                <rect key={`tw-${ri}-${ci}`} x={x} y={y} width="4.5" height="5" rx="0.4" fill="#3B82F6"
                                  style={{ animation: `ec-win ${2 + ri * 0.35 + ci * 0.25}s ease-in-out ${ri * 0.18 + ci * 0.12}s infinite`,
                                    opacity: [[0.75,0.3,0.8,0.4],[0.3,0.75,0.2,0.7],[0.8,0.2,0.6,0.3],[0.4,0.78,0.7,0.25],[0.65,0.35,0.3,0.75],[0.3,0.6,0.75,0.4]][ri][ci] }} />
                              )))}
                              {/* Lobby */}
                              <rect x="78" y="78" width="16" height="10" rx="0.5" fill="rgba(37,99,235,0.15)" stroke="rgba(37,99,235,0.3)" strokeWidth="0.6"/>

                              {/* ─ Right building wing ─ */}
                              <rect x="108" y="38" width="24" height="50" fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.25)" strokeWidth="0.8" rx="0.5"/>
                              {[41,49,57,65,73,81].map((y,ri) => [111,119].map((x,ci) => (
                                <rect key={`rw-${ri}-${ci}`} x={x} y={y} width="5" height="4" rx="0.4" fill="#2563EB"
                                  style={{ animation: `ec-win ${2.3 + ri * 0.3 + ci * 0.2}s ease-in-out ${ri * 0.22 + ci * 0.1}s infinite`,
                                    opacity: [[0.55,0.25],[0.68,0.4],[0.2,0.65],[0.55,0.2],[0.3,0.6],[0.5,0.3]][ri][ci] }} />
                              )))}

                              {/* ─ Trend line (rising, right side) ─ */}
                              <polyline points="140,80 150,62 159,68 168,46 178,28"
                                stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                strokeDasharray="120"
                                style={{ animation: 'ec-trend 3.5s ease-in-out infinite', strokeDashoffset: 120 }}/>
                              {/* Trend dots */}
                              {[[140,80,0.5],[150,62,0.65],[159,68,0.55],[168,46,0.8]].map(([x,y,o]) => (
                                <circle key={`${x}`} cx={x} cy={y} r="2.2" fill="#16A34A" opacity={o as number}/>
                              ))}
                              <circle cx="178" cy="28" r="3" fill="#16A34A" style={{ animation: 'ec-node-pulse 1.8s ease-in-out infinite' }}/>
                              {/* Up-arrow head */}
                              <path d="M174 28 L178 22 L182 28" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

                              {/* ─ $ node (left) ─ */}
                              <circle cx="22" cy="60" r="16" fill="rgba(37,99,235,0.07)" stroke="rgba(37,99,235,0.35)" strokeWidth="1"/>
                              <circle cx="22" cy="60" r="16" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="0.9" strokeDasharray="3 4.5"
                                style={{ transformOrigin: '22px 60px', animation: 'ec-spin-slow 22s linear infinite' }}/>
                              <text x="22" y="65" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1D4ED8" fontFamily="system-ui, sans-serif">$</text>

                              {/* Connector $ → building */}
                              <line x1="38" y1="62" x2="44" y2="65" stroke="rgba(37,99,235,0.2)" strokeWidth="0.8" strokeDasharray="2.5 3"/>

                              {/* ─ S/ node (bottom right) ─ */}
                              <circle cx="196" cy="74" r="13" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.9"/>
                              <circle cx="196" cy="74" r="13" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.9" strokeDasharray="3 4.5"
                                style={{ transformOrigin: '196px 74px', animation: 'ec-spin-r 18s linear infinite' }}/>
                              <text x="196" y="78" textAnchor="middle" fontSize="11" fontWeight="900" fill="#374151" fontFamily="system-ui, sans-serif">S/</text>

                              {/* Connector building → S/ */}
                              <line x1="136" y1="72" x2="183" y2="74" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" strokeDasharray="2.5 3"/>

                            </svg>

                            {/* Caption */}
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8' }}>
                                Solución corporativa de divisas
                              </div>
                              <div style={{ fontSize: 9, color: '#CBD5E1', marginTop: 3, letterSpacing: '0.05em' }}>
                                TC preferencial exclusivo · Acceso para clientes registrados
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pillars */}
                        <div className="flex gap-6 mb-7">
                          {[
                            { value: "15'", label: 'Liquidación' },
                            { value: '0%',   label: 'Comisiones' },
                            { value: '+TC',  label: 'Preferencial' },
                          ].map(({ value, label }) => (
                            <div key={label}>
                              <div className="text-xl font-black leading-none mb-1" style={{ color: '#0F172A' }}>{value}</div>
                              <div className="text-[9px] font-medium" style={{ color: '#94A3B8' }}>{label}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-5" style={{ height: 1, background: 'rgba(0,0,0,0.07)' }} />

                        {/* CTAs */}
                        <button onClick={() => router.push(isAuthenticated ? '/dashboard/empresa/nueva-operacion' : '/login?from=/empresa')} className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 group mb-2.5" style={{ background: '#2563EB' }}>
                          <span>Cotizar tipo de cambio corporativo</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <Link href="/crear-cuenta?tipo=empresa" className="flex items-center justify-center w-full py-2 text-xs font-medium transition-colors hover:opacity-70" style={{ color: '#94A3B8' }}>
                          Registrarme como empresa
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            STATS STRIP
        ================================================================ */}
        <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.055)' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {[
                { value: '+3,000',  label: 'empresas confían en nosotros', sub: 'y siguen operando' },
                { value: '< 15',    label: 'minutos de liquidación', sub: 'tiempo promedio garantizado' },
                { value: '0%',      label: 'comisiones ni cargos ocultos', sub: 'siempre, sin excepción' },
                { value: '+TC',     label: 'preferencial corporativo', sub: 'exclusivo para clientes registrados' },
              ].map(({ value, label, sub }, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-black mb-1" style={{ color: '#2563EB' }}>{value}</div>
                  <div className="text-[11px] sm:text-xs font-semibold leading-snug" style={{ color: '#0D1117' }}>{label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            BANKS
        ================================================================ */}
        <section ref={banksSectionRef} style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.055)' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12">

            <div className="mb-7 text-center">
              <h2 className="font-display font-black" style={{ color: '#0D1117', fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}>
                Operamos con los principales <span style={{ color: '#2563EB' }}>bancos del Perú</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              {/* Group 1 — BCP + Interbank + BanBif */}
              <div className="flex-[3]">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: '#9CA3AF' }}>Transferencias inmediatas</p>
                {(() => {
                  const hovered = hoveredBank === 'group1';
                  return (
                    <div
                      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                      style={{ border: `1px solid ${hovered ? 'rgba(37,99,235,0.4)' : 'rgba(0,0,0,0.07)'}`, background: hovered ? 'rgba(37,99,235,0.025)' : '#ffffff', boxShadow: hovered ? '0 16px 40px rgba(37,99,235,0.12)' : '0 2px 8px rgba(0,0,0,0.03)', minHeight: 110, transform: hovered ? 'translateY(-3px)' : 'none' }}
                      onMouseEnter={() => setHoveredBank('group1')}
                      onMouseLeave={() => setHoveredBank(null)}
                      onClick={() => setHoveredBank(hoveredBank === 'group1' ? null : 'group1')}
                    >
                      <div className="grid grid-cols-3 h-full">
                        {[
                          { id: 'bcp',       img: '/BCP.png',      alt: 'BCP',      imgClass: 'h-16 sm:h-20', acc: BANK_ACCOUNTS.bcp,      keys: { s: 'bcp-s', d: 'bcp-d' } },
                          { id: 'interbank', img: '/Interbank.png', alt: 'Interbank',imgClass: 'h-24 sm:h-28', acc: BANK_ACCOUNTS.interbank, keys: { s: 'itb-s', d: 'itb-d' } },
                          { id: 'banbif',    img: '/BanBif.png',    alt: 'BanBif',   imgClass: 'h-16 sm:h-20', acc: BANK_ACCOUNTS.banbif,   keys: { s: 'bbf-s', d: 'bbf-d' } },
                        ].map(({ id, img, alt, imgClass, acc, keys }) => (
                          <div key={id} className="relative overflow-hidden flex flex-col items-center justify-center px-3 cursor-default" style={{ minHeight: 110 }}>
                            <div className={`flex items-center justify-center transition-all duration-300 ${hovered ? 'scale-[0.68] -translate-y-3' : 'scale-100'}`}>
                              <img src={img} alt={alt} className={`${imgClass} w-auto object-contain`} />
                            </div>
                            <div className={`absolute bottom-0 left-0 right-0 px-3 pb-2 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                              {[{ label: 'S/', value: acc.soles, key: keys.s }, { label: '$', value: acc.dolares, key: keys.d }].map(({ label, value, key }) => (
                                <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                                    <span className="text-[9px] font-bold tabular-nums truncate" style={{ color: '#1E293B' }}>{value}</span>
                                  </div>
                                  <button onClick={() => handleCopy(value, key)} className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all" style={{ background: copiedKey === key ? 'rgba(34,197,94,0.2)' : 'rgba(13,27,42,0.07)', color: copiedKey === key ? '#16a34a' : 'rgba(13,27,42,0.5)' }}>
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
              </div>

              {/* Group 2 — CCI */}
              <div className="flex-[1] flex flex-col">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: '#9CA3AF' }}>Interbancaria solo Lima</p>
                {(() => {
                  const hovered = hoveredBank === 'cci';
                  const CCI = { soles: '003-200-003007757571-37', dolares: '003-200-003007757589-39' };
                  return (
                    <div
                      className={`relative overflow-hidden flex flex-col items-center justify-center px-3 rounded-2xl cursor-default transition-all duration-300 flex-1 ${isBanksSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                      style={{ border: `1px solid ${hovered ? 'rgba(37,99,235,0.4)' : 'rgba(0,0,0,0.07)'}`, background: hovered ? 'rgba(37,99,235,0.025)' : '#ffffff', minHeight: 110, transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? '0 16px 40px rgba(37,99,235,0.1)' : '0 1px 6px rgba(0,0,0,0.03)' }}
                      onMouseEnter={() => setHoveredBank('cci')}
                      onMouseLeave={() => setHoveredBank(null)}
                      onClick={() => setHoveredBank(hoveredBank === 'cci' ? null : 'cci')}
                    >
                      <div className={`flex flex-col items-center px-2 transition-all duration-300 ${hovered ? 'scale-[0.6] -translate-y-8' : 'scale-100'}`} style={{ gap: 2 }}>
                        <div className="flex items-center justify-center gap-3 w-full">
                          {[{ src: '/BBVA.png', alt: 'BBVA' }, { src: '/Scotiabank.png', alt: 'Scotiabank' }, { src: '/Banco Pichincha.png', alt: 'Pichincha' }].map(({ src, alt }) => (
                            <div key={alt} className="flex items-center justify-center" style={{ width: 72, height: 44 }}>
                              <img src={src} alt={alt} style={{ maxWidth: 72, maxHeight: 44, width: 'auto', height: 'auto', objectFit: 'contain' }} />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-3 w-full">
                          {[{ src: '/bancognb.png', alt: 'GNB' }, { src: '/bancosantander.png', alt: 'Santander' }].map(({ src, alt }) => (
                            <div key={alt} className="flex items-center justify-center" style={{ width: alt === 'GNB' ? 90 : 72, height: alt === 'GNB' ? 56 : 44 }}>
                              <img src={src} alt={alt} style={{ maxWidth: alt === 'GNB' ? 90 : 72, maxHeight: alt === 'GNB' ? 56 : 44, width: 'auto', height: 'auto', objectFit: 'contain' }} />
                            </div>
                          ))}
                          <div className="flex flex-col items-center justify-center rounded-lg" style={{ width: 72, height: 44, border: '1px solid rgba(37,99,235,0.28)', background: 'rgba(37,99,235,0.06)' }}>
                            <span className="text-[7px] font-black uppercase tracking-[0.12em] leading-tight text-center" style={{ color: '#2563EB' }}>Otros<br />Bancos</span>
                          </div>
                        </div>
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 px-2 pb-2 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        <p className="text-[8px] font-black uppercase tracking-wider mb-1" style={{ color: 'rgba(13,27,42,0.38)' }}>Cuenta Interbancaria Interbank</p>
                        {[{ label: 'S/', value: CCI.soles, key: 'cci-s' }, { label: '$', value: CCI.dolares, key: 'cci-d' }].map(({ label, value, key }) => (
                          <div key={key} className="flex items-center justify-between gap-1 py-0.5">
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="text-[9px] font-black w-3 flex-shrink-0" style={{ color: '#22C55E' }}>{label}</span>
                              <span className="text-[8px] font-bold tabular-nums truncate" style={{ color: '#1E293B' }}>{value}</span>
                            </div>
                            <button onClick={() => handleCopy(value, key)} className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[8px] font-bold transition-all" style={{ background: copiedKey === key ? 'rgba(34,197,94,0.2)' : 'rgba(13,27,42,0.07)', color: copiedKey === key ? '#16a34a' : 'rgba(13,27,42,0.5)' }}>
                              {copiedKey === key ? '✓' : 'Copiar'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              {[
                { icon: CheckCircle2, label: 'Sin comisiones ocultas' },
                { icon: Clock,        label: 'Liquidación en 15 min' },
                { icon: Lock,         label: 'SSL cifrado' },
                { icon: Shield,       label: 'Datos protegidos' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#6B7280' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: '#2563EB' }} />{label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            HOW IT WORKS — CORPORATE PROCESS
        ================================================================ */}
        <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.055)' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-20">

            <div className="text-center mb-12 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ border: '1px solid rgba(0,0,0,0.08)', color: '#6B7280' }}>Proceso corporativo</span>
              <h2 className="font-display font-black" style={{ color: '#0D1117', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                Eficiencia desde la<br /><span style={{ color: '#2563EB' }}>primera operación.</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 mb-12">
              {[
                {
                  step: '01',
                  title: 'Cotice su operación',
                  desc: 'Ingrese el monto en dólares y obtenga su tipo de cambio corporativo exacto, garantizado y sin variaciones.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                      <rect x="2.5" y="4" width="23" height="20" rx="2.5" stroke="#2563EB" strokeWidth="1.7"/>
                      <path d="M7 10h14M7 14.5h10M7 19h7" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  step: '02',
                  title: 'Transfiera a Qoricash',
                  desc: 'Realice la transferencia desde BCP, Interbank, BanBif o vía CCI desde cualquier banco del Perú.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                      <path d="M4 14h20M16 7l8 7-8 7" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
                {
                  step: '03',
                  title: 'Reciba en su cuenta',
                  desc: 'Liquidamos en menos de 15 minutos a la cuenta bancaria que designe. Sin comisiones, sin cargos ocultos.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                      <path d="M14 4v20M6 16l8 8 8-8" stroke="#2563EB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                },
              ].map(({ step, title, desc, icon }) => (
                <div key={step} className="ec-card rounded-2xl p-6" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.065)' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.12)' }}>
                      {icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: 'rgba(0,0,0,0.22)' }}>Paso {step}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#0D1117' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => router.push(isAuthenticated ? '/dashboard/empresa/nueva-operacion' : '/login?from=/empresa')} className="inline-flex items-center gap-2.5 font-bold px-8 py-3.5 rounded-full text-sm text-white transition-all hover:-translate-y-0.5" style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.28)' }}>
                Cotizar tipo de cambio corporativo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================
            BENEFITS — 2 COLS
        ================================================================ */}
        <section style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.055)' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Left */}
              <div>
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase block mb-4" style={{ color: '#6B7280' }}>Por qué elegirnos</span>
                <h2 className="font-display font-black leading-[1.08] mb-5" style={{ color: '#0D1117', fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)' }}>
                  Diseñado para<br />empresas que<br /><span style={{ color: '#2563EB' }}>exigen más.</span>
                </h2>
                <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                  Más de 3,000 empresas ya optimizan sus operaciones de cambio de divisas con Qoricash, generando un ahorro real y medible en cada transacción.
                </p>
                {/* Exclusive access block */}
                <div className="rounded-2xl p-5" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.12)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#2563EB' }}>TC Preferencial Corporativo</div>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#374151' }}>
                    Nuestros clientes corporativos acceden a tipos de cambio significativamente superiores a los del mercado bancario tradicional.
                  </p>
                  <Link href="/crear-cuenta?tipo=empresa" className="inline-flex items-center gap-1.5 text-[11px] font-bold transition-colors hover:opacity-80" style={{ color: '#2563EB' }}>
                    Registrarse para ver su TC <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Right — benefit cards */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    ),
                    title: 'TC Preferencial Garantizado',
                    sub: 'El tipo de cambio acordado es inalterable, independientemente del monto o fluctuación de mercado.',
                  },
                  {
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                    ),
                    title: 'Liquidación en menos de 15 min',
                    sub: 'Confirmación y transferencia en tiempo real. Sin esperas ni demoras innecesarias.',
                  },
                  {
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                    ),
                    title: 'Ejecutivo Corporativo Dedicado',
                    sub: 'Atención personalizada para operaciones desde $5,000. Un ejecutivo asignado a su empresa.',
                  },
                  {
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                      </svg>
                    ),
                    title: 'Sin comisiones ni cargos ocultos',
                    sub: 'Solo el tipo de cambio, nada más. Transparencia total en cada operación.',
                  },
                ].map(({ icon, title, sub }) => (
                  <div key={title} className="ec-card flex items-start gap-4 px-5 py-4 rounded-xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.1)' }}>
                      {icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold mb-1" style={{ color: '#0D1117' }}>{title}</div>
                      <div className="text-[11px] leading-relaxed" style={{ color: '#6B7280' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ================================================================
            NEWS — authenticated only
        ================================================================ */}
        {isAuthenticated && noticiasCorp.length > 0 && (
          <section style={{ background: '#0B1426', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-20">
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: 'rgba(96,165,250,0.5)' }}>Mercados globales</span>
                    <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}>
                      Noticias que mueven <span style={{ color: '#22c55e' }}>el TC</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 sm:mt-8">
                    <button onClick={() => setNewsCorpIdx(i => (i - 1 + noticiasCorp.length) % noticiasCorp.length)} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setNewsCorpIdx(i => (i + 1) % noticiasCorp.length)} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="grid sm:grid-cols-5">
                    {noticiasCorp[newsCorpIdx]?.imagen && (
                      <div className="sm:col-span-2 relative overflow-hidden" style={{ minHeight: 180 }}>
                        <Image src={noticiasCorp[newsCorpIdx].imagen!} alt={noticiasCorp[newsCorpIdx].titulo} fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,14,26,0.3), transparent)' }} />
                      </div>
                    )}
                    <div className={`p-5 sm:p-6 flex flex-col justify-between ${noticiasCorp[newsCorpIdx]?.imagen ? 'sm:col-span-3' : 'sm:col-span-5'}`}>
                      <div>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.18)' }}>
                          {noticiasCorp[newsCorpIdx]?.categoria}
                        </span>
                        <h3 className="font-display font-bold text-lg leading-snug mb-3 text-white" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                          {noticiasCorp[newsCorpIdx]?.titulo}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                          {noticiasCorp[newsCorpIdx]?.descripcion}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                          {noticiasCorp[newsCorpIdx]?.fecha ? new Date(noticiasCorp[newsCorpIdx].fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {noticiasCorp.map((_, i) => (
                            <button key={i} onClick={() => setNewsCorpIdx(i)} style={{ width: i === newsCorpIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === newsCorpIdx ? '#22c55e' : 'rgba(255,255,255,0.18)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {noticiasCorp.filter((_, i) => i !== newsCorpIdx).slice(0, 3).map(n => (
                    <button key={n.id} onClick={() => setNewsCorpIdx(noticiasCorp.indexOf(n))} className="text-left rounded-xl p-3 transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2" style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.14)' }}>{n.categoria}</span>
                      <p className="text-[11px] font-semibold text-white leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{n.titulo}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            TRUST STRIP
        ================================================================ */}
        <section style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.055)' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-xl px-4 py-2.5 flex items-center gap-2.5" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
                <div>
                  <div className="font-bold text-[11px] leading-tight" style={{ color: '#0D1117' }}>Empresa Registrada</div>
                  <div className="text-[10px]" style={{ color: '#6B7280' }}>RUC: 20615113698 · Lima, Perú</div>
                </div>
              </div>
              <div className="rounded-xl px-4 py-2.5 flex items-center gap-2.5" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
                <div>
                  <div className="font-bold text-[11px] leading-tight" style={{ color: '#0D1117' }}>Registrados ante la SBS</div>
                  <div className="text-[10px]" style={{ color: '#6B7280' }}>Res. N° 00313-2026</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            ROI CALCULATOR
        ================================================================ */}
        <section style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.055)' }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-20">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#2563EB' }}>Calculadora de ahorro</span>
              <h2 className="font-display font-black mb-3" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#0D1117' }}>
                ¿Cuánto ahorra su empresa al mes?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto" style={{ color: '#6B7280' }}>
                Ingrese el volumen mensual que opera en dólares y vea el ahorro real versus el banco.
              </p>
            </div>

            {/* Card */}
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              {/* Slider area */}
              <div className="px-7 sm:px-10 pt-8 pb-6">
                <div className="flex items-end justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Volumen mensual en USD</span>
                  <span className="text-2xl font-black" style={{ color: '#0D1117' }}>
                    ${roiVolume.toLocaleString('en-US')}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={200000}
                  step={5000}
                  value={roiVolume}
                  onChange={e => setRoiVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#2563EB', background: `linear-gradient(to right, #2563EB ${((roiVolume - 5000) / 195000) * 100}%, #E5E7EB ${((roiVolume - 5000) / 195000) * 100}%)` }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px]" style={{ color: '#D1D5DB' }}>$5,000</span>
                  <span className="text-[10px]" style={{ color: '#D1D5DB' }}>$200,000</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(0,0,0,0.055)' }} />

              {/* Results */}
              <div className="px-7 sm:px-10 py-7">
                {/* Comparison bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold" style={{ color: '#6B7280' }}>Banco tradicional</span>
                    <span className="text-sm font-bold" style={{ color: '#EF4444' }}>
                      S/ {(roiVolume * 3.72).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="h-3 rounded-full w-full" style={{ background: '#FEE2E2' }}>
                    <div className="h-3 rounded-full" style={{ width: '100%', background: 'linear-gradient(to right, #EF4444, #FCA5A5)' }} />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold" style={{ color: '#2563EB' }}>Qoricash Corporate</span>
                    <span className="text-sm font-bold" style={{ color: '#2563EB' }}>
                      S/ {(roiVolume * 3.785).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="h-3 rounded-full w-full" style={{ background: '#DBEAFE' }}>
                    <div className="h-3 rounded-full" style={{ width: `${(3.785 / 3.72) * 100}%`, background: 'linear-gradient(to right, #2563EB, #60A5FA)' }} />
                  </div>
                </div>

                {/* Savings highlight */}
                <div className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)', border: '1px solid rgba(37,99,235,0.12)' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#2563EB' }}>Ahorro mensual estimado</p>
                    <p className="text-3xl font-black" style={{ color: '#0D1117' }}>
                      S/ {(roiVolume * 0.065).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>≈ S/ {(roiVolume * 0.065 * 12).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} al año</p>
                  </div>
                  <Link
                    href="/crear-cuenta?tipo=empresa"
                    className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-full text-sm text-white flex-shrink-0 transition-all hover:-translate-y-0.5"
                    style={{ background: '#2563EB', boxShadow: '0 6px 20px rgba(37,99,235,0.32)' }}
                  >
                    Empezar a ahorrar <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-[10px] text-center mt-4" style={{ color: '#D1D5DB' }}>
                  * Estimación basada en spread promedio vs banca. Tipo de cambio referencial. Los resultados reales pueden variar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            CTA — DARK NAVY
        ================================================================ */}
        <section style={{ background: '#0B1426', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: '#60A5FA' }}>Cuenta Corporativa</span>
            </span>
            <h2 className="font-display font-black text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}>
              ¿Listo para optimizar sus<br /><span style={{ color: '#60A5FA' }}>operaciones de cambio?</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Abra su cuenta corporativa hoy y empiece a ahorrar en cada operación de cambio de divisas. Sin cargos de apertura.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => router.push(isAuthenticated ? '/dashboard/empresa/nueva-operacion' : '/login?from=/empresa')} className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm text-white transition-all hover:-translate-y-0.5" style={{ background: '#2563EB', boxShadow: '0 8px 28px rgba(37,99,235,0.38)' }}>
                Cotizar tipo de cambio corporativo <ArrowRight className="w-4 h-4" />
              </button>
              <a href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20tipo%20de%20cambio%20corporativo." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>
                Cotizar por WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================
            FOOTER
        ================================================================ */}
        <footer style={{ color: '#6B7280', background: '#ffffff' }}>
          <div className="w-full px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
            <div className="max-w-5xl mx-auto">

              {/* Logo + desc */}
              <div className="flex items-center gap-3 mb-6">
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
                  <img src="/vg.png" alt="Qoricash" className="h-8 w-auto" />
                </Link>
                <span className="hidden sm:block w-px h-6" style={{ background: 'rgba(0,0,0,0.1)' }} />
                <p className="hidden sm:block text-xs leading-relaxed" style={{ color: '#6B7280' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>
              </div>
              <p className="sm:hidden text-xs leading-relaxed mb-6" style={{ color: '#6B7280' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>

              {/* Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-6">
                <div>
                  <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Servicios</h4>
                  <ul className="space-y-2 text-[11px] sm:text-xs">
                    <li><Link href="/servicios#compra" className="hover:text-gray-900 transition-colors">Compra USD</Link></li>
                    <li><Link href="/servicios#venta" className="hover:text-gray-900 transition-colors">Venta USD</Link></li>
                    <li><Link href="/servicios#tipo-cambio" className="hover:text-gray-900 transition-colors">Tipo de cambio</Link></li>
                    <li><Link href="/noticias" className="hover:text-gray-900 transition-colors">Noticias</Link></li>
                    <li><Link href="/preguntas-frecuentes" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Legal</h4>
                  <ul className="space-y-2 text-[11px] sm:text-xs">
                    <li><Link href="/sobre-nosotros" className="hover:text-gray-900 transition-colors">Nosotros</Link></li>
                    <li><Link href="/terminos-condiciones" className="hover:text-gray-900 transition-colors">Términos</Link></li>
                    <li><Link href="/politica-privacidad" className="hover:text-gray-900 transition-colors">Privacidad</Link></li>
                    <li><Link href="/politica-cookies" className="hover:text-gray-900 transition-colors">Cookies</Link></li>
                    <li><Link href="/libro-reclamaciones" className="hover:text-gray-900 transition-colors">Reclamaciones</Link></li>
                  </ul>
                </div>
                <div className="col-span-2 md:col-span-2">
                  <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Contacto</h4>
                  <ul className="space-y-2.5 text-[11px] sm:text-xs">
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <a href="mailto:info@qoricash.pe" className="hover:text-gray-900 transition-colors">info@qoricash.pe</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#25D366' }} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">910 624 404</a>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors leading-relaxed">Av. Brasil N° 2790, Int. 504 · Pueblo Libre</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Lun–Vie 9–6 pm · Sáb 9–1 pm</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
                <p>© 2025 Qoricash. Todos los derechos reservados.</p>
                <div className="flex items-center gap-3">
                  <Link href="/terminos-condiciones" className="hover:text-gray-600 transition-colors">Términos</Link>
                  <Link href="/politica-privacidad" className="hover:text-gray-600 transition-colors">Privacidad</Link>
                  <Link href="/libro-reclamaciones" className="hover:text-gray-600 transition-colors">Reclamaciones</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
