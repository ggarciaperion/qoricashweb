'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
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
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRates, isConnected, fetchRates } = useExchangeStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    fetchRates();
    const unsub = useExchangeStore.getState().startRateSubscription();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => { await logout(); router.push('/'); };

  const displayName =
    user?.document_type === 'RUC'
      ? user?.razon_social || user?.nombres
      : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres;

  const isEmpresaUser = user?.document_type === 'RUC';
  const NAV_ITEMS = isEmpresaUser ? NAV_ITEMS_EMPRESA : NAV_ITEMS_PERSONA;

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen flex" style={isEmpresaUser
      ? { backgroundColor: '#0D1B2A' }
      : { backgroundImage: 'url(/dv.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }
    }>

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
          : { background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.25)' }}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center justify-between px-5">
          <Link href={isEmpresaUser ? '/dashboard/empresa' : '/'} className="flex items-center gap-2.5 hover:opacity-80 transition">
            {isEmpresaUser ? (
              <div className="relative inline-flex shrink-0">
                <img src="/logo-principal.png" aria-hidden className="h-14 w-auto invisible" />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(135deg, #4A6884 0%, #8fb8cc 100%)',
                  WebkitMaskImage: 'url(/logo-principal.png)',
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  maskImage: 'url(/logo-principal.png)',
                  maskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                }} />
              </div>
            ) : (
              <img src="/logo-principal.png" alt="QoriCash" className="h-14 w-auto" />
            )}
            <div className="flex flex-col items-center">
              <span
                className="text-2xl font-black tracking-tight leading-none"
                style={isEmpresaUser
                  ? { background: 'linear-gradient(135deg, #8fb8cc 0%, #4A6884 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
                  : { color: '#ffffff' }}
              >
                Qoricash
              </span>
              {isEmpresaUser && (
                <span
                  className="text-[9px] font-bold tracking-[0.22em] uppercase mt-0.5"
                  style={{ color: 'rgba(143,184,204,0.6)', letterSpacing: '0.22em' }}
                >
                  Corporate
                </span>
              )}
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg transition"
            style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(255,255,255,0.5)')}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          <p
            className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.4)' : 'rgba(255,255,255,0.5)' }}
          >
            Menú principal
          </p>

          {NAV_ITEMS.map(({ icon: Icon, label, href, exact }) => {
            const active = isActive(href, exact);
            const activeStyle = isEmpresaUser
              ? { background: 'rgba(143,184,204,0.12)', borderLeft: '3px solid #8fb8cc', color: '#8fb8cc' }
              : { background: 'rgba(255,255,255,0.18)', borderLeft: '3px solid #ffffff', color: '#ffffff' };
            const inactiveColor = isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.75)';
            const hoverColor   = '#ffffff';
            const hoverBg      = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(255,255,255,0.12)';
            const iconColor    = active
              ? (isEmpresaUser ? '#8fb8cc' : '#ffffff')
              : (isEmpresaUser ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.55)');
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
                style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.4)' : 'rgba(255,255,255,0.5)' }}
              >
                Administración
              </p>
              <Link
                href="/dashboard/posicion"
                className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-[15px] font-medium transition-all"
                style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.75)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  (e.currentTarget as HTMLElement).style.background = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.75)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <BarChart2 className="w-[17px] h-[17px] shrink-0" style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.55)' }} />
                Posición del Día
              </Link>
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4" style={{ borderTop: isEmpresaUser ? '1px solid rgba(143,184,204,0.12)' : '1px solid rgba(255,255,255,0.2)' }}>
          {/* Contacto rápido */}
          <div className="mb-2 space-y-1">
            <a href="mailto:info@qoricash.pe"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition"
              style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ffffff'; (e.currentTarget as HTMLElement).style.background = isEmpresaUser ? 'rgba(143,184,204,0.08)' : 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">info@qoricash.pe</span>
            </a>
            <a href="https://wa.me/51926011920?text=Hola,%20necesito%20ayuda" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition"
              style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#16a34a'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition"
            style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)', borderTop: isEmpresaUser ? '1px solid rgba(143,184,204,0.12)' : '1px solid rgba(255,255,255,0.2)', paddingTop: '10px', marginTop: '4px' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#ef4444';
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = isEmpresaUser ? 'rgba(255,255,255,0.35)' : 'rgba(30,41,59,0.45)';
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
        <header className="sticky top-0 z-30" style={isEmpresaUser ? { background: 'rgba(10,20,36,0.97)' } : { background: 'transparent' }}>
          <div className="flex items-center px-5 h-[64px] gap-4">

            {/* Left: hamburger + horario */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                className="lg:hidden p-2 rounded-xl transition"
                style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = isEmpresaUser ? '#ffffff' : '#1E293B')}
                onMouseLeave={e => (e.currentTarget.style.color = isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.4)')}
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(30,41,59,0.35)' }} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-none mb-0.5" style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.85)' : 'rgba(30,41,59,0.35)' }}>Horario de atención</p>
                  <p className="text-[11px] font-medium leading-none" style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.85)' : 'rgba(30,41,59,0.6)' }}>Lun–Vie 9–6 pm · Sáb 9–2 pm</p>
                </div>
              </div>
            </div>

            {/* Center spacer */}
            <div className="flex-1" />

            {/* Right: bell + user */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                className="p-2 rounded-xl transition"
                style={{ color: isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = isEmpresaUser ? '#ffffff' : '#1E293B')}
                onMouseLeave={e => (e.currentTarget.style.color = isEmpresaUser ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.4)')}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition ml-1"
                style={{ background: isUserMenuOpen ? (isEmpresaUser ? 'rgba(143,184,204,0.1)' : 'rgba(30,41,59,0.06)') : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = isEmpresaUser ? 'rgba(143,184,204,0.1)' : 'rgba(30,41,59,0.06)')}
                onMouseLeave={e => { if (!isUserMenuOpen) (e.currentTarget.style.background = 'transparent'); }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                  style={{ background: isEmpresaUser ? 'linear-gradient(135deg, #4A6884, #8fb8cc)' : '#22C55E' }}>
                  {displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm font-semibold hidden sm:block max-w-[110px] truncate" style={{ color: isEmpresaUser ? '#ffffff' : '#1E293B' }}>
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  style={{ color: isEmpresaUser ? 'rgba(143,184,204,0.5)' : 'rgba(30,41,59,0.35)' }}
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
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#16A34A'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.06)'; }}
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
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#16A34A'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(30,41,59,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <BarChart2 className="w-4 h-4 opacity-60" />Posición del Día
                </button>
              )}
              <a
                href="https://wa.me/51926011920?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
                target="_blank" rel="noopener noreferrer"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm gap-3 transition"
                style={{ color: 'rgba(30,41,59,0.65)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#16A34A'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(30,41,59,0.65)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <HelpCircle className="w-4 h-4 opacity-60" />Ayuda
              </a>
              <div style={{ borderTop: '1px solid rgba(30,41,59,0.07)', margin: '4px 0' }} />
              <button
                onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
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

        {/* Page content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: 'transparent' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
