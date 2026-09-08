'use client';

import { useEffect, useState, useCallback } from 'react';
import KycModal from '@/components/KycModal';

import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useSocket } from '@/lib/hooks/useSocket';
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  User,
  RefreshCw,
  Gift,
  HelpCircle,
  Building2,
  BarChart2,
  Home,
  Bell,
  Menu,
  Star,
  ChevronDown,
  X,
  Clock,
  Mail,
  MessageCircle,
  Shield,
} from 'lucide-react';

const NAV_ITEMS_PERSONA = [
  { icon: Home,      label: 'Inicio',            href: '/dashboard',                   exact: true  },
  { icon: RefreshCw, label: 'Nueva Operación',   href: '/dashboard/nueva-operacion',   exact: false },
  { icon: Clock,     label: 'Historial',         href: '/dashboard/historial',         exact: false },
  { icon: Building2, label: 'Cuentas Bancarias', href: '/dashboard/cuentas-bancarias', exact: false },
  { icon: Gift,      label: 'Promociones',       href: '/dashboard/promociones',       exact: false },
];

const NAV_ITEMS_EMPRESA = [
  { icon: Home,      label: 'Inicio',            href: '/dashboard/empresa',                    exact: true  },
  { icon: RefreshCw, label: 'Nueva Operación',   href: '/dashboard/empresa/nueva-operacion',    exact: false },
  { icon: Clock,     label: 'Historial',         href: '/dashboard/historial',                  exact: false },
  { icon: Building2, label: 'Cuentas Bancarias', href: '/dashboard/cuentas-bancarias',          exact: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAccountDeleted, forceLogoutDeleted, refreshUser } = useAuthStore();
  const { currentRates, isConnected, fetchRates } = useExchangeStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [deletedCountdown, setDeletedCountdown] = useState(8);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycApprovedModal, setKycApprovedModal] = useState(false);
  const [logoutPhase, setLogoutPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleAccountDeleted = useCallback(() => {
    forceLogoutDeleted();
  }, [forceLogoutDeleted]);

  useSocket({
    onClientDeleted: handleAccountDeleted,
    onDocumentsApproved: () => {
      refreshUser();
      setKycApprovedModal(true);
    },
  });

  useEffect(() => {
    fetchRates();
    const unsub = useExchangeStore.getState().startRateSubscription();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isAccountDeleted) router.push('/login');
  }, [isAuthenticated, isAccountDeleted]);

  // Polling: verifica cada 60s que la cuenta aún existe en el backend
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => { refreshUser(); }, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Countdown cuando la cuenta fue eliminada → redirige a /crear-cuenta
  useEffect(() => {
    if (!isAccountDeleted) return;
    setDeletedCountdown(8);
    const tick = setInterval(() => {
      setDeletedCountdown(prev => {
        if (prev <= 1) {
          clearInterval(tick);
          router.push('/crear-cuenta');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [isAccountDeleted]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLogoutPhase('loading');
    await new Promise(r => setTimeout(r, 2200));
    setLogoutPhase('done');
    await new Promise(r => setTimeout(r, 2000));
    await logout();
    router.push('/');
  };

  // Solo primer nombre para persona natural (máximo una palabra)
  const displayName = user?.document_type === 'RUC'
    ? (user?.razon_social || user?.nombres)
    : (user?.nombres?.trim().split(/\s+/)[0] ?? '');

  const isEmpresaUser = user?.document_type === 'RUC';
  const NAV_ITEMS = isEmpresaUser ? NAV_ITEMS_EMPRESA : NAV_ITEMS_PERSONA;

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen flex" style={{ position: 'relative' }}>
      {/* Background fijo que cubre toda la pantalla incluyendo safe areas del móvil */}
      {isEmpresaUser ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: '#0D1B2A' }} />
      ) : (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: '#F5F7FA' }} />
      )}

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(30,41,59,0.55)' }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
          w-60 flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={isEmpresaUser
          ? { background: 'linear-gradient(180deg, #0D1B2A 0%, #1a3353 100%)', borderRight: '1px solid rgba(143,184,204,0.12)' }
          : { background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.08)', boxShadow: '2px 0 12px rgba(0,0,0,0.04)' }}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
            <img src="/vg.png" alt="QoriCash" className="h-10 w-auto" />
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg transition"
            style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(0,0,0,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.color = isEmpresaUser ? '#ffffff' : '#0D1117')}
            onMouseLeave={e => (e.currentTarget.style.color = isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(0,0,0,0.35)')}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          <p
            className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.4)' : 'rgba(0,0,0,0.35)' }}
          >
            Menú principal
          </p>

          {NAV_ITEMS.map(({ icon: Icon, label, href, exact }) => {
            const active = isActive(href, exact);
            const activeStyle = isEmpresaUser
              ? { background: 'rgba(143,184,204,0.12)', borderLeft: '3px solid #8fb8cc', color: '#8fb8cc' }
              : { background: 'rgba(13,17,23,0.06)', borderLeft: '3px solid #0D1117', color: '#0D1117' };
            const inactiveColor = isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#6B7280';
            const hoverColor   = isEmpresaUser ? '#ffffff' : '#0D1117';
            const hoverBg      = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(0,0,0,0.04)';
            const iconColor    = active
              ? (isEmpresaUser ? '#8fb8cc' : '#0D1117')
              : (isEmpresaUser ? 'rgba(255,255,255,0.35)' : '#9CA3AF');
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-[15px] font-medium transition-all ${active ? 'pl-[9px]' : ''}`}
                style={active ? activeStyle : { color: inactiveColor }}
                onMouseEnter={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.color = hoverColor; (e.currentTarget as HTMLElement).style.background = hoverBg; }
                }}
                onMouseLeave={e => {
                  if (!active) { (e.currentTarget as HTMLElement).style.color = inactiveColor; (e.currentTarget as HTMLElement).style.background = 'transparent'; }
                }}
              >
                <Icon className="w-[17px] h-[17px] shrink-0" style={{ color: iconColor }} />
                {label}
              </Link>
            );
          })}

          {(['Master', 'Operador'] as const).includes(user?.role as any) && (
            <>
              <p
                className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.4)' : 'rgba(0,0,0,0.35)' }}
              >
                Administración
              </p>
              <Link
                href="/dashboard/posicion"
                className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-[15px] font-medium transition-all"
                style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#6B7280' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? '#ffffff' : '#0D1117';
                  (e.currentTarget as HTMLElement).style.background = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(0,0,0,0.04)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#6B7280';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <BarChart2 className="w-[17px] h-[17px] shrink-0" style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }} />
                Posición del Día
              </Link>
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4" style={{ borderTop: isEmpresaUser ? '1px solid rgba(143,184,204,0.12)' : '1px solid rgba(0,0,0,0.06)' }}>
          {/* Contacto rápido */}
          <div className="mb-2 space-y-1">
            <a href="mailto:info@qoricash.pe"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition"
              style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? '#ffffff' : '#0D1117'; (e.currentTarget as HTMLElement).style.background = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.4)' : '#9CA3AF'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">info@qoricash.pe</span>
            </a>
            <a href="https://wa.me/51910624404?text=Hola,%20necesito%20ayuda" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition"
              style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#16a34a'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.4)' : '#9CA3AF'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
          </div>

          {/* Logout */}
          <button
            onClick={() => setLogoutConfirm(true)}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition"
            style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.35)' : '#9CA3AF', borderTop: isEmpresaUser ? '1px solid rgba(143,184,204,0.12)' : '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', marginTop: '4px' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#ef4444';
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.35)' : '#9CA3AF';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <LogOut className="w-4 h-4" />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30" style={isEmpresaUser ? { background: 'rgba(10,20,36,0.97)' } : { background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center px-5 h-[64px] gap-4">

            {/* Left: hamburger + horario */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition"
                style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#6B7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = isEmpresaUser ? '#ffffff' : '#0D1117')}
                onMouseLeave={e => (e.currentTarget.style.color = isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#6B7280')}
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wide">Menú</span>
              </button>
              <div className="hidden md:flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.5)' : '#9CA3AF' }} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none mb-0.5" style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.85)' : '#9CA3AF' }}>Horario de atención</p>
                  <p className="text-[11px] font-medium leading-none" style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.85)' : '#374151' }}>Lun–Vie 9–6 pm · Sáb 9–2 pm</p>
                </div>
              </div>
            </div>

            {/* Center spacer */}
            <div className="flex-1" />

            {/* Right: inicio + bell + user */}
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={isEmpresaUser ? '/empresa' : '/'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.7)' : '#6B7280' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? '#ffffff' : '#0D1117'; (e.currentTarget as HTMLElement).style.background = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(143,184,204,0.7)' : '#6B7280'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Home className="w-3.5 h-3.5" />
                Página de inicio
              </Link>
              <div className="block w-px h-5 mx-1" style={{ background: isEmpresaUser ? 'rgba(143,184,204,0.2)' : 'rgba(0,0,0,0.1)' }} />
              <button
                className="p-2 rounded-xl transition"
                style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}
                onMouseEnter={e => (e.currentTarget.style.color = isEmpresaUser ? '#ffffff' : '#0D1117')}
                onMouseLeave={e => (e.currentTarget.style.color = isEmpresaUser ? 'rgba(255,255,255,0.5)' : '#9CA3AF')}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition ml-1"
                style={{ background: isUserMenuOpen ? (isEmpresaUser ? 'rgba(143,184,204,0.1)' : 'rgba(0,0,0,0.04)') : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = isEmpresaUser ? 'rgba(143,184,204,0.1)' : 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => { if (!isUserMenuOpen) (e.currentTarget.style.background = 'transparent'); }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                  style={{ background: isEmpresaUser ? 'linear-gradient(135deg, #4A6884, #8fb8cc)' : '#0D1117' }}>
                  {displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm font-semibold hidden sm:block max-w-[110px] truncate" style={{ color: isEmpresaUser ? '#ffffff' : '#0D1117' }}>
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(0,0,0,0.35)' }}
                />
              </button>
            </div>
          </div>
        </header>

        {/* User dropdown portal */}
        {isUserMenuOpen && typeof document !== 'undefined' && createPortal(
          <>
            <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsUserMenuOpen(false)} />
            <div
              className="fixed right-4 w-52 rounded-xl overflow-hidden py-1.5"
              style={{
                zIndex: 99999,
                top: '68px',
                background: '#ffffff',
                boxShadow: '0 8px 32px rgba(30,41,59,0.12), 0 2px 8px rgba(30,41,59,0.06)',
                border: '1px solid rgba(30,41,59,0.08)',
              }}
            >
              {[
                { icon: User,      label: 'Mi perfil',    action: () => router.push('/dashboard?perfil=1') },
                { icon: BarChart2, label: 'Mi Dashboard', action: () => router.push('/dashboard?home=1') },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={() => { setIsUserMenuOpen(false); action(); }}
                  className="flex items-center w-full px-4 py-2.5 text-sm gap-3 transition"
                  style={{ color: 'rgba(30,41,59,0.65)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2563EB'; (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(30,41,59,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon className="w-4 h-4 opacity-60" />{label}
                </button>
              ))}
              {(['Master', 'Operador'] as const).includes(user?.role as any) && (
                <button
                  onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard/posicion'); }}
                  className="flex items-center w-full px-4 py-2.5 text-sm gap-3 transition"
                  style={{ color: 'rgba(30,41,59,0.65)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2563EB'; (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(30,41,59,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <BarChart2 className="w-4 h-4 opacity-60" />Posición del Día
                </button>
              )}
              <a
                href="https://wa.me/51910624404?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
                target="_blank" rel="noopener noreferrer"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm gap-3 transition"
                style={{ color: 'rgba(30,41,59,0.65)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2563EB'; (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(30,41,59,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <HelpCircle className="w-4 h-4 opacity-60" />Ayuda
              </a>
              <div style={{ borderTop: '1px solid rgba(30,41,59,0.07)', margin: '4px 0' }} />
              <button
                onClick={() => { setIsUserMenuOpen(false); setLogoutConfirm(true); }}
                className="flex items-center w-full px-4 py-2.5 text-sm gap-3 transition"
                style={{ color: '#ef4444' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <LogOut className="w-4 h-4" />Cerrar sesión
              </button>
            </div>
          </>,
          document.body
        )}

        {/* KYC banner */}
        {(() => {
          const kycApproved = !!(user?.has_complete_documents);
          const kycBlocked  = user?.kyc_status === 'bloqueado';
          const hasUploadedDocs = isEmpresaUser
            ? !!(user as any)?.ficha_ruc_url
            : !!((user as any)?.dni_front_url && (user as any)?.dni_back_url);
          const kycNeedsDocs    = !kycApproved && !kycBlocked && !hasUploadedDocs;
          const kycPendingReview = !kycApproved && !kycBlocked && hasUploadedDocs;

          if (kycPendingReview) return (
            <div
              className="flex items-center gap-3 px-5 py-3 shrink-0 sticky z-20"
              style={{ background: '#2563EB', borderBottom: '1px solid rgba(255,255,255,0.12)', top: '64px' }}
            >
              <style>{`@keyframes kycSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Clock className="w-4 h-4 text-white" style={{ animation: 'kycSpin 3s linear infinite' }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white leading-tight">Documentos en revisión</p>
                <p className="text-[11px] text-white/70">Te confirmaremos en un máximo de 10 minutos</p>
              </div>
              <div className="ml-auto shrink-0 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          );

          if (kycNeedsDocs) return (
            <button
              onClick={() => setKycModalOpen(true)}
              className="flex items-center gap-3 px-5 py-3 shrink-0 w-full text-left transition-opacity hover:opacity-90 sticky z-20"
              style={{ background: '#2563EB', borderBottom: '1px solid rgba(255,255,255,0.12)', top: '64px' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white leading-tight">Validación requerida para operar</p>
                <p className="text-[11px] text-white/70">Necesitamos verificar tu identidad para activar tu cuenta</p>
              </div>
              <div className="ml-auto shrink-0">
                <span className="text-xs font-bold text-white/80">Completar →</span>
              </div>
            </button>
          );

          return null;
        })()}

        {/* Page content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: 'transparent' }}
        >
          {children}
        </div>
      </div>
      {/* Logout confirm modal */}
      {logoutConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99998] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={() => setLogoutConfirm(false)}>
          <div
            className="w-full max-w-xs rounded-2xl overflow-hidden"
            style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', animation: 'loFadeUp 0.22s ease-out both' }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`@keyframes loFadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }`}</style>
            {/* Header */}
            <div className="flex flex-col items-center px-6 pt-7 pb-5 text-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.07)' }}>
                <LogOut className="w-5 h-5" style={{ color: '#0D1117' }} />
              </div>
              <p className="text-base font-black text-gray-900 leading-tight">¿Cerrar sesión?</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Tu sesión se cerrará de forma segura.<br />Podrás volver a ingresar cuando quieras.
              </p>
            </div>
            {/* Buttons */}
            <div className="flex gap-2.5 px-5 py-4">
              <button
                onClick={() => setLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ background: '#f1f5f9', color: '#374151' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
              >
                Cancelar
              </button>
              <button
                onClick={() => { setLogoutConfirm(false); handleLogout(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center justify-center gap-1.5"
                style={{ background: '#0A0A0A' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1f1f1f')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0A')}
              >
                <LogOut className="w-3.5 h-3.5" /> Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Logout animation overlay */}
      {logoutPhase !== 'idle' && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          background: '#ffffff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
        }}>
          <style>{`
            @keyframes loRingDraw  { from { stroke-dashoffset: 352; } to { stroke-dashoffset: 0; } }
            @keyframes loRingTrail { 0%,100% { stroke-dashoffset:352; } 50% { stroke-dashoffset:88; } }
            @keyframes loPulse     { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(0.91); opacity:0.7; } }
            @keyframes loFadeUp2   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
            @keyframes loShimmer   { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
            @keyframes loScaleIn   { 0% { transform:scale(0); opacity:0; } 65% { transform:scale(1.12); opacity:1; } 100% { transform:scale(1); opacity:1; } }
            @keyframes loCheckDraw { from { stroke-dashoffset:60; } to { stroke-dashoffset:0; } }
            @keyframes loDot       { 0%,80%,100% { transform:scale(0); opacity:0; } 40% { transform:scale(1); opacity:1; } }
            @keyframes loOrbit     { from { transform:rotate(0deg) translateX(68px); } to { transform:rotate(360deg) translateX(68px); } }
            @keyframes loBarFill   { from { width:0%; } to { width:100%; } }
            @keyframes loSlideIn   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          `}</style>

          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#f1f5f9' }}>
            <div style={{
              height: '100%', background: 'linear-gradient(90deg, #000, #555)',
              animation: 'loBarFill 1.8s cubic-bezier(0.4,0,0.6,1) forwards',
            }} />
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, animation: 'loSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>

            {/* Ring + logo */}
            <div style={{ position: 'relative', width: 148, height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* Orbiting dot */}
              {logoutPhase === 'loading' && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 8, height: 8, borderRadius: '50%', background: '#000', marginTop: -4, marginLeft: -4,
                  animation: 'loOrbit 1.4s linear infinite',
                }} />
              )}

              <svg width="148" height="148" viewBox="0 0 148 148" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                {/* Track */}
                <circle cx="74" cy="74" r="60" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                {/* Dashed ghost ring */}
                <circle cx="74" cy="74" r="60" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" strokeDasharray="8 8" />
                {/* Progress ring */}
                {logoutPhase === 'loading' && (
                  <circle cx="74" cy="74" r="60" fill="none" stroke="#000000" strokeWidth="5"
                    strokeLinecap="round" strokeDasharray="377" strokeDashoffset="377"
                    style={{ animation: 'loRingDraw 1.8s cubic-bezier(0.4,0,0.2,1) forwards' }} />
                )}
                {logoutPhase === 'done' && (
                  <circle cx="74" cy="74" r="60" fill="none" stroke="#000000" strokeWidth="5"
                    strokeLinecap="round" strokeDasharray="377" strokeDashoffset="0" />
                )}
              </svg>

              {/* Center */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
                boxShadow: '0 0 0 6px #f8fafc, 0 8px 32px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
                transition: 'box-shadow 0.4s ease',
              }}>
                {logoutPhase === 'loading' ? (
                  <img src="/vg.png" alt="QoriCash" style={{ width: 58, height: 58, objectFit: 'contain', animation: 'loPulse 1.6s ease-in-out infinite' }} />
                ) : (
                  <div style={{ animation: 'loScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                    <svg width="46" height="46" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r="22" fill="#0A0A0A" />
                      <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="60" strokeDashoffset="60"
                        style={{ animation: 'loCheckDraw 0.45s ease-out 0.15s forwards' }} />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Text block */}
            <div style={{ textAlign: 'center' }}>
              {logoutPhase === 'loading' ? (
                <>
                  <p style={{
                    fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: '-0.01em',
                    background: 'linear-gradient(90deg, #d1d5db 0%, #111827 40%, #d1d5db 80%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    animation: 'loShimmer 1.8s linear infinite',
                  }}>
                    Cerrando sesión...
                  </p>
                  {/* Dot loader */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span key={i} style={{
                        display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#9ca3af',
                        animation: `loDot 1.2s ease-in-out ${delay}s infinite`,
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10, fontWeight: 500 }}>
                    Guardando tu información de forma segura
                  </p>
                </>
              ) : (
                <div style={{ animation: 'loFadeUp2 0.4s ease-out both' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 6px' }}>
                    Hasta pronto
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#0A0A0A', margin: 0, letterSpacing: '-0.02em' }}>
                    {displayName}
                  </p>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>Tu sesión fue cerrada con éxito</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#f1f5f9' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #000, #555)',
              width: logoutPhase === 'done' ? '100%' : undefined,
              animation: logoutPhase === 'loading' ? 'loBarFill 1.8s cubic-bezier(0.4,0,0.6,1) forwards' : 'none',
              transition: logoutPhase === 'done' ? 'width 0.3s ease' : 'none',
            }} />
          </div>
        </div>,
        document.body
      )}

      {/* KYC modal — subir documentos */}
      <KycModal isOpen={kycModalOpen} onClose={() => setKycModalOpen(false)} />

      {/* KYC aprobado — modal de felicitación */}
      {kycApprovedModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <style>{`
            @keyframes kycBounceIn { 0% { transform: scale(0.7); opacity: 0; } 65% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
            @keyframes kycCheckDraw { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }
            @keyframes kycRingDraw { from { stroke-dashoffset: 327; } to { stroke-dashoffset: 0; } }
            @keyframes kycFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ background: '#ffffff', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
            {/* Header azul */}
            <div className="px-6 pt-7 pb-5 flex flex-col items-center text-center" style={{ background: '#2563EB' }}>
              {/* Anillo + check animado */}
              <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'kycBounceIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <svg width="100" height="100" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
                  <circle cx="64" cy="64" r="52" fill="none" stroke="#ffffff" strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="327" strokeDashoffset="327"
                    style={{ animation: 'kycRingDraw 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s forwards' }} />
                </svg>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
                    <polyline points="9,23 18,32 35,13" stroke="white" strokeWidth="4"
                      strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="60" strokeDashoffset="60"
                      style={{ animation: 'kycCheckDraw 0.4s ease-out 0.6s forwards' }} />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-black text-white mt-4 leading-tight" style={{ animation: 'kycFadeUp 0.4s ease-out 0.5s both' }}>
                ¡Cuenta validada!
              </h3>
              <p className="text-sm text-white/75 mt-1" style={{ animation: 'kycFadeUp 0.4s ease-out 0.65s both' }}>
                Tu identidad fue verificada exitosamente
              </p>
            </div>
            {/* Body */}
            <div className="px-6 py-5 text-center" style={{ animation: 'kycFadeUp 0.4s ease-out 0.7s both' }}>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ya puedes realizar operaciones de cambio de divisas en Qoricash. ¡Bienvenido!
              </p>
              <button
                onClick={() => setKycApprovedModal(false)}
                className="mt-5 w-full py-3 rounded-xl text-sm font-black text-white transition active:scale-[0.98]"
                style={{ background: '#2563EB' }}
              >
                Empezar a operar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: cuenta eliminada por admin */}
      {isAccountDeleted && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center z-[99999] px-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(13,27,42,0.97) 0%, rgba(10,22,36,0.99) 100%)',
              border: '1px solid rgba(239,68,68,0.2)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(239,68,68,0.06) inset',
            }}
          >
            {/* Header */}
            <div className="px-6 pt-8 pb-6 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="text-white font-extrabold text-lg mb-2">Cuenta no disponible</h3>
              <p className="text-sm leading-relaxed mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Tu cuenta ha sido eliminada del sistema. La sesión ha sido cerrada.
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Si crees que es un error, contáctanos por WhatsApp.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />

            {/* Footer */}
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span>Redirigiendo en</span>
                <span
                  className="font-black text-sm tabular-nums"
                  style={{ color: '#ef4444' }}
                >
                  {deletedCountdown}s
                </span>
              </div>
              <button
                onClick={() => router.push('/crear-cuenta')}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 4px 16px rgba(34,197,94,0.25)' }}
              >
                Registrarse nuevamente
              </button>
              <a
                href="https://wa.me/51910624404?text=Hola%2C%20mi%20cuenta%20fue%20eliminada%20y%20necesito%20ayuda."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}
              >
                Contactar soporte
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
