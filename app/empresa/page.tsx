'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import AlertaTCModal from '@/components/AlertaTCModal';
import MarketSection from '@/components/MarketSection';
import {
  ArrowRight, Shield, Clock, CheckCircle2, Lock,
  LogOut, User as UserIcon, ChevronDown, Menu, X,
  HelpCircle, Banknote, Building2, Zap, BadgeCheck,
} from 'lucide-react';

export default function EmpresaPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRates, fetchRates, startRateSubscription } = useExchangeStore();

  // ── Ruta protegida: solo personas jurídicas (RUC) ────────────────────
  useEffect(() => {
    if (isAuthenticated && user && user.document_type !== 'RUC') {
      router.replace('/');
    }
  }, [isAuthenticated, user]);
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
  const [roiVolume, setRoiVolume] = useState(50000);
  const [topBarHidden, setTopBarHidden] = useState(false);
  const [mobilePhase, setMobilePhase] = useState<'film' | 'out' | 'content'>('film');
  const [cardVisible, setCardVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const banksCorpRef = useRef<HTMLDivElement>(null);
  const [fanIndex, setFanIndex] = useState(0);
  const fanPaused = useRef(false);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setTopBarHidden(y > 40);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const BANK_ACCOUNTS = {
    bcp:       { soles: '1937353150041',  dolares: '1917357790119'  },
    interbank: { soles: '200-3007757571', dolares: '200-3007757589' },
    banbif:    { soles: '007000845805',   dolares: '007000845813'   },
  } as const;

  // No auto-redirigir: usuarios autenticados pueden navegar a esta página desde el dashboard

  // Real-time exchange rates
  useEffect(() => {
    fetchRates();
    const unsub = startRateSubscription();
    return () => unsub();
  }, []);

  // Card images observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCardVisible(true); else setCardVisible(false); },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Banks corp observer
  useEffect(() => {
    const el = banksCorpRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('banks-section-visible');
        else el.classList.remove('banks-section-visible');
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fan carousel auto-rotation
  useEffect(() => {
    const t = setInterval(() => {
      if (!fanPaused.current) setFanIndex(i => (i + 1) % 11);
    }, 5500);
    return () => clearInterval(t);
  }, []);

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

  // Animación secuencial hero móvil: film → fade out → contenido
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) return;
    const t1 = setTimeout(() => setMobilePhase('out'), 2600);
    const t2 = setTimeout(() => setMobilePhase('content'), 3350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
        @keyframes film-scroll-up   { from{transform:translateY(0)} to{transform:translateY(-50%)} }
        @keyframes film-scroll-down { from{transform:translateY(-50%)} to{transform:translateY(0)} }
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
        @keyframes ec-content-in  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width:1023px) {
          .ec-mobile-film { display:flex !important; }
          .ec-content-reveal { opacity:0; animation:ec-content-in 0.9s cubic-bezier(0.22,1,0.36,1) 3.35s forwards; }
        }
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

      <main className="min-h-screen" style={{ background: '#0A0A0A' }}>

        {/* ================================================================
            TOP BAR — Personas · Negocios
        ================================================================ */}
        {/* Cinta full-width — solo visible para visitantes no autenticados */}
        {!isAuthenticated && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 36, background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 51, transform: topBarHidden ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
            <button onClick={() => router.push('/')} style={{ padding: '2px 12px', borderRadius: 999, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 12, cursor: 'pointer' }}>Personas</button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <button style={{ padding: '2px 12px', borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Negocios</button>
          </div>
        </div>
        )}

        {/* ================================================================
            NAVBAR — Floating card
        ================================================================ */}
        <header style={{ position: 'fixed', top: isAuthenticated ? 12 : (topBarHidden ? 12 : 44), left: '50%', transform: 'translateX(-50%)', width: 'min(680px, calc(100% - 24px))', zIndex: 50, transition: 'top 0.3s ease', borderRadius: 16, background: 'rgba(5,8,18,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <nav className="flex justify-between items-center px-5 sm:px-7" style={{ height: 52 }}>

            {/* Logo blanco */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/vg.png" alt="Qoricash" style={{ height: 28, width: 'auto', filter: 'invert(1)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>Negocios</span>
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
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: 'rgba(255,255,255,0.85)' }}
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
                  <Link href="/login?from=/empresa" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Iniciar Sesión
                  </Link>
                  <Link href="/crear-cuenta?tipo=empresa" className="text-sm font-bold px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all text-white" style={{ background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                    Regístrate
                  </Link>
                </>
              )}
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              {isAuthenticated && user && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: '#2563EB' }}>
                  {((user.razon_social || user.nombres) ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 transition-colors hover:opacity-80" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          className={`lg:hidden fixed right-3 z-[49] rounded-2xl overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ width: 220, top: 124, maxHeight: isMobileMenuOpen ? '70vh' : 0, transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease', background: 'rgba(13,20,38,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 48px rgba(0,0,0,0.5)' }}
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
        <section style={{ background: '#0A0A0A', position: 'relative', overflow: 'hidden', paddingTop: 80, minHeight: '100dvh' }}>

          {/* ── Film Strip Columns ── */}
          {(() => {
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'film-scroll-up 70s linear infinite' }}>
                      {[...col1, ...col1].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'film-scroll-down 55s linear infinite' }}>
                      {[...col2, ...col2].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, transparent, #0A0A0A)' }} />
                </div>
                {/* RIGHT — 2 columnas */}
                <div className="hidden lg:flex" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '26%', gap: 8, padding: '0 8px' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'film-scroll-down 62s linear infinite' }}>
                      {[...col3, ...col3].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'film-scroll-up 48s linear infinite' }}>
                      {[...col4, ...col4].map((src, i) => <img key={i} src={src} alt="" style={imgStyle} />)}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, transparent, #0A0A0A)' }} />
                </div>
                {/* Fade top + bottom */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0A0A0A 0%, transparent 18%, transparent 82%, #0A0A0A 100%)' }} />
              </div>
            );
          })()}

          {/* ── Film strip móvil full-screen — solo < lg ── */}
          <div
            className="ec-mobile-film"
            style={{
              display: 'none',
              position: 'absolute', inset: 0, zIndex: 10,
              gap: 6, padding: '0 6px',
              opacity: mobilePhase === 'film' ? 1 : 0,
              transition: mobilePhase === 'out' ? 'opacity 0.75s ease-out' : 'none',
              pointerEvents: 'none',
            }}
          >
            {[
              { imgs: ['/ty/Agro-exporter_viewing_transfer_n__2K_20260917133151.jpeg','/ty/Carpenter_looking_at_phone_2K_20260917133207.jpeg','/ty/Entrepreneur_holding_smartphone___2K_20260917133255.jpeg','/ty/Executive_looking_at_phone_2K_20260917133335.jpeg','/ty/Headphones_and_smartphone_on_sur__2K_20260917133312.jpeg','/ty/Man_smiling_at_smartphone_2K_20260917133338.jpeg','/ty/Watch_and_smartphone_on_wrist_2K_20260917133436.jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(3).jpeg','/ty/Woman_looking_at_smartphone_2K_20260917133425.jpeg'], anim: 'film-scroll-up 32s linear infinite' },
              { imgs: ['/ty/Architect_showing_transaction_on__2K_20260917133416.jpeg','/ty/Engineer_reviewing_machinery_quo__2K_20260917133211.jpeg','/ty/Entrepreneur_smiling_with_smartp__2K_20260917133422.jpeg','/ty/Farmer_looking_at_phone_notifica__2K_20260917133233.jpeg','/ty/Man_checking_phone_in_mountains_2K_20260917133345.jpeg','/ty/Miner_holding_phone_in_shop_2K_20260917133155.jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55.jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(4).jpeg'], anim: 'film-scroll-down 25s linear infinite' },
              { imgs: ['/ty/Baker_holding_smartphone_smiling_2K_20260917133344.jpeg','/ty/Engineer_reviewing_machinery_quo__2K_20260917133222.jpeg','/ty/Executive_holding_smartphone_in___2K_20260917133401.jpeg','/ty/Gas_station_owner_holding_smartp__2K_20260917133133.jpeg','/ty/Man_holding_smartphone_in_workshop_2K_20260917133349.jpeg','/ty/Professional_walking_holding_sma__2K_20260917133259.jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(1).jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(5).jpeg'], anim: 'film-scroll-down 28s linear infinite' },
              { imgs: ['/ty/CFO_smiling_at_smartphone_2K_20260917133426.jpeg','/ty/Engineer_using_smartphone_in_mine_2K_20260917133138.jpeg','/ty/Executive_looking_at_phone_2K_20260917133159.jpeg','/ty/Gas_station_owner_holding_smartp__2K_20260917133225.jpeg','/ty/Man_smiling_at_phone_in_2K_20260917133252.jpeg','/ty/Traveler_viewing_phone_near_SUV_2K_20260917133258.jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(2).jpeg','/ty/WhatsApp_Image_2026-09-14_at_19.10.55_(6).jpeg'], anim: 'film-scroll-up 22s linear infinite' },
            ].map((col, ci) => (
              <div key={ci} style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, animation: col.anim }}>
                  {[...col.imgs, ...col.imgs].map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', objectPosition: 'center top', borderRadius: 8, display: 'block', flexShrink: 0 }} />
                  ))}
                </div>
              </div>
            ))}
            {/* Fades */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, #0A0A0A, transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, #0A0A0A, transparent)', pointerEvents: 'none' }} />
          </div>

          <div className="ec-content-reveal relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col items-center text-center" style={{ paddingTop: 'clamp(70px, 9vw, 110px)', paddingBottom: 'clamp(60px, 8vw, 100px)', minHeight: '100dvh', justifyContent: 'center' }}>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-6" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 999, padding: '6px 16px' }}>
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inset-0 rounded-full opacity-75" style={{ background: '#60A5FA' }}/><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400"/></span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA' }}>Tipo de cambio corporativo en vivo</span>
                </div>

                <h1 className="font-display font-black leading-[1.0] mb-6 uppercase" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  En los negocios<br />cada centavo<br /><span style={{ color: '#2563EB' }}>cuenta.</span>
                </h1>

                <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Tu empresa merece el mejor tipo de cambio. En Qoricash te ayudamos a rentabilizar cada operación, sin comisiones y con atención dedicada.
                </p>

                <div className="flex items-center gap-4 justify-center mb-12 flex-wrap">
                  <button
                    onClick={() => router.push(isAuthenticated ? '/dashboard/empresa/nueva-operacion' : '/crear-cuenta?tipo=empresa')}
                    className="inline-flex items-center gap-2 font-bold text-sm text-white hover:-translate-y-0.5 transition-all"
                    style={{ background: '#2563EB', borderRadius: 999, padding: '14px 32px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 28px rgba(37,99,235,0.45)' }}
                  >
                    {isAuthenticated ? 'Nueva operación' : 'Empieza a cambiar ahora'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20tipo%20de%20cambio%20corporativo." target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-sm hover:-translate-y-0.5 transition-all"
                    style={{ borderRadius: 999, padding: '14px 32px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', background: 'rgba(255,255,255,0.04)' }}
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>


                <div className="w-full max-w-[420px]">
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
                  ) : null}
                </div>
          </div>
        </section>


        {/* ================================================================
            HEADLINE SECTION
        ================================================================ */}
        <section style={{ background: '#0A0A0A', paddingTop: 80, paddingBottom: 48, overflow: 'hidden' }}>
          <div className="ec-hl-row" style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <div className="ec-hl-txt" style={{ flex: 1, paddingLeft: 'max(24px, calc((100vw - 1100px) / 2))' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20 }}>Qoricash para empresas</p>
              <h2 style={{ color: '#ffffff', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, margin: 0, textTransform: 'uppercase' }}>
                Cada operación<br />
                de cambio es una<br />
                oportunidad de ganar más.
              </h2>
            </div>
            <div className="ec-hl-img" style={{ flexShrink: 0, width: '48%', position: 'relative' }}>
              <img src="/dddd.jpeg" alt="" style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: '20px 0 0 20px', display: 'block' }} />
              <img src="/dfg.png" alt="" style={{ position: 'absolute', top: -90, left: -40, width: 280, objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))' }} />
            </div>
          </div>
        </section>

        {/* ================================================================
            CTA CARD
        ================================================================ */}
        <style>{`
          .card-img {
            transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease, filter 0.3s ease, box-shadow 0.3s ease;
          }
          .card-img:hover {
            filter: drop-shadow(0 20px 48px rgba(37,99,235,0.45)) brightness(1.06) !important;
            z-index: 10;
          }
          .card-img-left  { opacity: 0; transform: translateY(-40px) translateX(-140px) scale(0.88); }
          .card-img-mid   { opacity: 0; transform: translateY(60px) scale(0.88); }
          .card-img-right { opacity: 0; transform: translateY(120px) translateX(140px) scale(0.88); }
          .card-img-left.visible  { opacity: 1; transform: translateY(-80px) translateX(-80px) scale(1); transition-delay: 0s; }
          .card-img-mid.visible   { opacity: 1; transform: translateY(0px) scale(1); transition-delay: 0.12s; }
          .card-img-right.visible { opacity: 1; transform: translateY(80px) translateX(80px) scale(1); transition-delay: 0.24s; }
          .card-img-left.visible:hover  { transform: translateY(-80px) translateX(-80px) scale(1.06) !important; }
          .card-img-mid.visible:hover   { transform: translateY(0px) scale(1.06) !important; }
          .card-img-right.visible:hover { transform: translateY(80px) translateX(80px) scale(1.06) !important; }

          /* ── RESPONSIVE ─────────────────────────────── */
          @media (max-width: 767px) {
            /* Headline */
            .ec-hl-row { flex-direction: column !important; gap: 0 !important; }
            .ec-hl-txt { padding-left: 24px !important; padding-right: 24px !important; padding-bottom: 40px !important; }
            .ec-hl-img { display: none !important; }
            /* CTA card images */
            .ec-card-row { flex-direction: column !important; align-items: center !important; gap: 16px !important; padding: 24px 16px !important; }
            .card-img { height: 220px !important; }
            .card-img-left  { transform: translateY(0) translateX(0) scale(0.88) !important; }
            .card-img-right { transform: translateY(0) translateX(0) scale(0.88) !important; }
            .card-img-left.visible  { transform: translateY(0) translateX(0) scale(1) !important; }
            .card-img-right.visible { transform: translateY(0) translateX(0) scale(1) !important; }
            .card-img-left.visible:hover  { transform: translateY(0) translateX(0) scale(1.04) !important; }
            .card-img-right.visible:hover { transform: translateY(0) translateX(0) scale(1.04) !important; }
            /* Banks section */
            .ec-banks-flex { flex-direction: column !important; }
            .ec-banks-left { flex: none !important; width: 100% !important; padding: 32px 24px 24px !important; }
            .ec-banks-right { display: none !important; }
            .ec-secondary-banks { display: none !important; }
            .ec-banks-mobile-img { display: flex !important; }
            /* Fan carousel */
            .ec-fan-arc { height: 200px !important; }
            .fan-img { width: 160px !important; height: 108px !important; margin-left: -80px !important; }
            .ec-fan-section { padding: 48px 20px 60px !important; }
            /* CTA final */
            .ec-cta-final { padding: 48px 20px 64px !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            /* Tablet */
            .ec-hl-row { gap: 24px !important; }
            .ec-banks-left { padding: 36px 32px !important; }
            .ec-card-row { gap: 12px !important; }
            .card-img { height: 380px !important; }
            .card-img-left.visible  { transform: translateY(-40px) translateX(-40px) scale(1) !important; }
            .card-img-right.visible { transform: translateY(40px) translateX(40px) scale(1) !important; }
            .fan-img { width: 220px !important; height: 145px !important; margin-left: -110px !important; }
            .ec-fan-arc { height: 270px !important; }
          }
        `}</style>
        <section style={{ background: '#0A0A0A', padding: '40px 20px' }}>
          <div ref={cardRef} style={{ maxWidth: 1100, margin: '0 auto', background: '#161616', borderRadius: 24, padding: '8px 48px', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}>
            <div className="ec-card-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <img src="/tyu/41.png" alt="" className={`card-img card-img-left${cardVisible ? ' visible' : ''}`} style={{ height: 500, width: 'auto', objectFit: 'contain' }} />
              <img src="/tyu/43.png" alt="" className={`card-img card-img-mid${cardVisible ? ' visible' : ''}`}  style={{ height: 580, width: 'auto', objectFit: 'contain' }} />
              <img src="/tyu/42.png" alt="" className={`card-img card-img-right${cardVisible ? ' visible' : ''}`} style={{ height: 500, width: 'auto', objectFit: 'contain' }} />
            </div>
          </div>
        </section>

        {/* ================================================================
            BANCOS CORPORATIVOS
        ================================================================ */}
        <section style={{ background: '#0A0A0A', padding: '0 20px 80px' }}>
          <div ref={banksCorpRef} style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(135deg, #0D1B3E 0%, #0F2150 50%, #0B1838 100%)', border: '1px solid rgba(37,99,235,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <div className="ec-banks-flex" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0 }}>

              {/* LEFT — Texto */}
              <div className="ec-banks-left" style={{ flex: '0 0 45%', padding: '52px 48px' }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20 }}>Liquidación corporativa</p>
                <h2 className="font-display font-black" style={{ color: '#ffffff', lineHeight: 1.05, marginBottom: 20 }}>
                  <span style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', display: 'block' }}>Su empresa recibe en</span>
                  <span style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', display: 'block', color: 'rgba(255,255,255,0.5)' }}>cualquier banco</span>
                  <span style={{ fontSize: 'clamp(3rem, 5.5vw, 4.8rem)', display: 'block', color: '#ffffff', lineHeight: 0.93 }}>del Perú</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, marginBottom: 24, maxWidth: 320 }}>
                  Transferimos directo a la cuenta designada por su empresa. Sin cuentas intermediarias, sin pasos adicionales. Liquidación en menos de 15 minutos en bancos principales.
                </p>

                {/* Bancos secundarios pills */}
                <div className="ec-secondary-banks" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {[
                    { logo: '/BBVA.png',            name: 'BBVA',      h: 28, cls: 'banks-rp1' },
                    { logo: '/Scotiabank.png',       name: 'Scotiabank',h: 40, cls: 'banks-rp2' },
                    { logo: '/Banco Pichincha.png',  name: 'Pichincha', h: 40, cls: 'banks-rp3' },
                    { logo: '/bancosantander.png',   name: 'Santander', h: 28, cls: 'banks-rp5' },
                  ].map(b => (
                    <div key={b.name} className={b.cls} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, padding: '5px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, border: '1px solid rgba(255,255,255,0.12)' }}>
                      <img src={b.logo} alt={b.name} style={{ height: b.h, maxWidth: 90, width: 'auto', objectFit: 'contain', filter: 'brightness(10)' }} />
                    </div>
                  ))}
                  <div className="banks-rp6" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, padding: '5px 14px', height: 34, display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>+ Otros bancos</span>
                  </div>
                </div>

                <p className="ec-secondary-banks" style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                  Operaciones con BBVA, Scotiabank, Pichincha, GNB, Santander y otros vía CCI interbancario. Acreditación: 20 min – 24 h según banco y horario. Válido para plazas Lima.
                </p>

                {/* Imagen + BCP/Interbank/BanBif — solo móvil */}
                <div className="ec-banks-mobile-img" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <img src="/kj.jpeg" alt="Qoricash bancos" style={{ width: '75%', maxWidth: 260, borderRadius: 14, display: 'block' }} />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                      { logo: '/BCP.png',       name: 'BCP',      h: 26 },
                      { logo: '/Interbank.png', name: 'Interbank', h: 36 },
                      { logo: '/BanBif.png',    name: 'BanBif',    h: 26 },
                    ].map(b => (
                      <div key={b.name} style={{ background: '#ffffff', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                        <img src={b.logo} alt={b.name} style={{ height: b.h, maxWidth: 80, width: 'auto', objectFit: 'contain' }} />
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, textAlign: 'center', marginTop: 4 }}>
                    Operaciones con BBVA, Scotiabank, Pichincha, GNB, Santander y otros vía CCI interbancario.
                  </p>
                </div>
              </div>

              {/* RIGHT — Imagen + pills bancos principales */}
              <div className="ec-banks-right" style={{ flex: 1, position: 'relative', alignSelf: 'stretch', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 52px 40px 20px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
                  <img src="/kj.jpeg" alt="Qoricash bancos" className="banks-img" style={{ width: '100%', height: 'auto', borderRadius: 18, display: 'block', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }} />
                  {/* Pills BCP, Interbank, BanBif */}
                  <div style={{ position: 'absolute', top: '15%', right: 0, transform: 'translateX(50%)', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10 }}>
                    {[
                      { logo: '/BCP.png',       name: 'BCP',      h: 36,  cls: 'banks-pr1' },
                      { logo: '/Interbank.png', name: 'Interbank', h: 52,  cls: 'banks-pr2' },
                      { logo: '/BanBif.png',    name: 'BanBif',    h: 36,  cls: 'banks-pr3' },
                    ].map(b => (
                      <div key={b.name} className={b.cls} style={{ background: '#ffffff', borderRadius: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.35)', minWidth: 76 }}>
                        <img src={b.logo} alt={b.name} style={{ height: b.h, maxWidth: 100, width: 'auto', objectFit: 'contain' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================================================================
            FAN CAROUSEL — RUBROS
        ================================================================ */}
        {(() => {
          const rubros = [
            {
              src: '/ggg/Semi-trucks_driving_on_highway_2K_20260918101156.jpeg',
              rubro: 'Transporte',
              desc: 'Las empresas de transporte necesitan tipos de cambio competitivos para mantener la rentabilidad en cada ruta internacional y cubrir costos operativos en dólares.',
            },
            {
              src: '/ggg/Crates_of_fruit_in_facility_2K_20260918101102.jpeg',
              rubro: 'Agroexportación',
              desc: 'Los agroexportadores peruanos facturan en dólares pero operan en soles. Cada centavo en el tipo de cambio se multiplica por toneladas de exportación.',
            },
            {
              src: '/ggg/Customs_office_overlooking_port_2K_20260918101117.jpeg',
              rubro: 'Agencias de Aduana',
              desc: 'Las agencias aduaneras gestionan pagos en múltiples monedas. Un tipo de cambio corporativo preferencial reduce el costo de cada operación de importación o exportación.',
            },
            {
              src: '/ggg/Travel_agency_storefront_in_city_2K_20260918101123.jpeg',
              rubro: 'Agencias de Viaje',
              desc: 'Los operadores turísticos manejan reservas en dólares y cobran en soles. El diferencial cambiario puede ser la diferencia entre ganar o perder en cada paquete vendido.',
            },
            {
              src: '/ggg/Hotel_lobby_with_fireplace_2K_20260918101110.jpeg',
              rubro: 'Hotelería',
              desc: 'Los hoteles reciben huéspedes internacionales y gestionan costos en dólares. Optimizar el tipo de cambio corporativo incrementa directamente el margen de cada operación.',
            },
            {
              src: '/ggg/Logistics_hub_and_shipping_conta…_2K_20260918101149.jpeg',
              rubro: 'Logística e Importación',
              desc: 'Las empresas de logística manejan grandes volúmenes en divisas. Con Qoricash acceden a un tipo de cambio que protege su margen en cada despacho y contrato.',
            },
            {
              src: '/ggg/Modern_medical_office_reception_…_2K_20260918101120.jpeg',
              rubro: 'Salud y Clínicas',
              desc: 'Clínicas y centros médicos importan equipos e insumos en dólares. Un tipo de cambio preferencial reduce el costo de cada importación y mejora la rentabilidad.',
            },
            {
              src: '/ggg/Fishing_boats_docked_at_pier_2K_20260918101059.jpeg',
              rubro: 'Sector Pesquero',
              desc: 'La industria pesquera exporta en dólares y opera en soles. Cada operación de cambio bien ejecutada suma directamente a la utilidad neta de la campaña.',
            },
            {
              src: '/ggg/Textile_workshop_with_fabrics_an…_2K_20260918101136.jpeg',
              rubro: 'Industria Textil',
              desc: 'Los talleres y exportadores textiles negocian en dólares con clientes internacionales. Un tipo de cambio corporativo competitivo es ventaja directa frente a la competencia.',
            },
            {
              src: '/ggg/Car_rental_agency_office_parked_2K_20260918101112.jpeg',
              rubro: 'Renta de Vehículos',
              desc: 'Las empresas de renta de autos gestionan flotas con costos en dólares. Acceder a tipos de cambio corporativos reduce el gasto financiero en cada renovación.',
            },
            {
              src: '/ggg/Modern_gas_station_in_city_2K_20260918101106.jpeg',
              rubro: 'Grifos y Combustibles',
              desc: 'El sector de combustibles opera con precios indexados al dólar. Un tipo de cambio preferencial se traduce en mayor margen en cada litro comercializado.',
            },
          ];
          const n = rubros.length;
          const ANGLE_STEP = 14; // degrees between each card
          const PIVOT_DIST = 1400; // px below card bottom — controls arc tightness
          const CARD_W = 300;
          const CARD_H = 200;
          return (
            <section style={{ background: '#0A0A0A', padding: '80px 24px 100px' }}>
              <style>{`
                @keyframes desc-fade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .fan-img {
                  transition: transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.65s ease, filter 0.3s ease;
                  cursor: pointer;
                  border-radius: 14px;
                  object-fit: cover;
                  display: block;
                  position: absolute;
                  width: ${CARD_W}px;
                  height: ${CARD_H}px;
                  left: 50%;
                  margin-left: -${CARD_W / 2}px;
                  bottom: 0;
                  transform-origin: 50% calc(100% + ${PIVOT_DIST}px);
                }
                .fan-img:hover { filter: brightness(1.12) drop-shadow(0 12px 32px rgba(37,99,235,0.5)); }
                @media (max-width: 767px) {
                  .fan-img { transform-origin: 50% calc(100% + 320px) !important; }
                }
              `}</style>

              {/* Header */}
              <div style={{ maxWidth: 1100, margin: '0 auto 48px', padding: '0 20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>Tu sector, nuestra solución</p>
                <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, margin: 0 }}>
                  Operamos con <span style={{ color: '#2563EB' }}>todos los rubros</span>
                </h2>
              </div>

              {/* Fan arc */}
              <div className="ec-fan-arc" style={{ position: 'relative', height: 340, maxWidth: 900, margin: '0 auto' }}>
                {rubros.map((item, i) => {
                  const offset = ((i - fanIndex) % n + n) % n;
                  const norm = offset > n / 2 ? offset - n : offset;
                  const absNorm = Math.abs(norm);
                  const angle = norm * ANGLE_STEP;
                  const opacity = absNorm === 0 ? 1 : absNorm === 1 ? 0.72 : absNorm === 2 ? 0.45 : absNorm === 3 ? 0.22 : 0;
                  const zIndex = 10 - absNorm;
                  if (absNorm > 4) return null;
                  return (
                    <img
                      key={i}
                      src={item.src}
                      alt={item.rubro}
                      className="fan-img"
                      onClick={() => { fanPaused.current = true; setFanIndex(i); setTimeout(() => { fanPaused.current = false; }, 6000); }}
                      style={{
                        transform: `rotate(${angle}deg)`,
                        opacity,
                        zIndex,
                        boxShadow: norm === 0 ? '0 20px 60px rgba(0,0,0,0.7)' : '0 6px 20px rgba(0,0,0,0.4)',
                        outline: norm === 0 ? '2px solid rgba(37,99,235,0.6)' : 'none',
                        pointerEvents: absNorm > 4 ? 'none' : 'auto',
                      }}
                    />
                  );
                })}
              </div>

              {/* Description */}
              <div style={{ maxWidth: 560, margin: '48px auto 0', textAlign: 'center' }} key={fanIndex}>
                <p style={{ color: '#2563EB', fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10, animation: 'desc-fade 0.4s ease both' }}>
                  {rubros[fanIndex].rubro}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7, margin: 0, animation: 'desc-fade 0.5s ease 0.05s both' }}>
                  {rubros[fanIndex].desc}
                </p>
              </div>

              {/* Arrows */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
                <button
                  onClick={() => { fanPaused.current = true; setFanIndex(i => (i - 1 + n) % n); setTimeout(() => { fanPaused.current = false; }, 6000); }}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button
                  onClick={() => { fanPaused.current = true; setFanIndex(i => (i + 1) % n); setTimeout(() => { fanPaused.current = false; }, 6000); }}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
                {rubros.map((_, i) => (
                  <button key={i} onClick={() => { fanPaused.current = true; setFanIndex(i); setTimeout(() => { fanPaused.current = false; }, 6000); }}
                    style={{ width: i === fanIndex ? 24 : 8, height: 8, borderRadius: 999, background: i === fanIndex ? '#2563EB' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
                ))}
              </div>
            </section>
          );
        })()}

        {/* ================================================================
            CTA FINAL
        ================================================================ */}
        <section className="ec-cta-final" style={{ background: '#0A0A0A', padding: '80px 24px 100px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 20px' }}>
              Su empresa merece el mejor<br />
              <span style={{ color: '#2563EB' }}>tipo de cambio del mercado.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: '0 auto 40px' }}>
              Sin importar el sector, el volumen o el banco de su empresa. Qoricash le da el tipo de cambio corporativo que la banca tradicional nunca le ofrecerá. Empiece hoy, sin costos de apertura.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push(isAuthenticated ? '/dashboard/empresa/nueva-operacion' : '/crear-cuenta?tipo=empresa')}
                className="inline-flex items-center gap-2 font-bold text-sm text-white hover:-translate-y-0.5 transition-all"
                style={{ background: '#2563EB', borderRadius: 999, padding: '16px 36px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 32px rgba(37,99,235,0.45)' }}
              >
                Cambiar ahora <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/51910624404?text=Hola%2C%20quiero%20cotizar%20tipo%20de%20cambio%20corporativo."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-sm hover:-translate-y-0.5 transition-all"
                style={{ borderRadius: 999, padding: '16px 36px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================
            FOOTER
        ================================================================ */}
        <footer style={{ color: 'rgba(255,255,255,0.3)', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-full px-6 sm:px-8 lg:px-10 py-5">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <img src="/vg.png" alt="Qoricash" className="h-6 w-auto" style={{ filter: 'invert(1)', opacity: 0.5 }} />
                </Link>
                <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
                <p>© 2025 Qoricash. Todos los derechos reservados.</p>
                <span style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
                <a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors">info@qoricash.pe</a>
                <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                <a href="tel:+51910624404" className="hover:text-white transition-colors">910 624 404</a>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/terminos-condiciones" className="hover:text-white transition-colors">Términos</Link>
                <Link href="/politica-privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                <Link href="/libro-reclamaciones" className="hover:text-white transition-colors">Reclamaciones</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
