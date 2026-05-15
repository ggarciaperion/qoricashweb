'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { operationsApi } from '@/lib/api/operations';
import type { Operation, ClientStats } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  LogOut,
  User,
  RefreshCw,
  Gift,
  Copy,
  Share2,
  ChevronDown,
  HelpCircle,
  X,
  FileText,
  Image as ImageIcon,
  Building2,
  BarChart2,
  Activity,
  Zap,
  ArrowRight,
  DollarSign,
  Layers,
} from 'lucide-react';

/* ─── helpers ────────────────────────────────────────────────────── */
const fmt$ = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' });
const fmtTime = (s: string) =>
  new Date(s).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

/* ─── status config ──────────────────────────────────────────────── */
const STATUS: Record<string, { label: string; dot: string; pill: string }> = {
  pendiente:  { label: 'Pendiente',   dot: 'bg-amber-400 animate-pulse', pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  en_proceso: { label: 'En proceso',  dot: 'bg-blue-400 animate-pulse',  pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20'   },
  completado: { label: 'Completado',  dot: 'bg-emerald-400',             pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelado:  { label: 'Cancelado',   dot: 'bg-slate-500',               pill: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  rechazado:  { label: 'Rechazado',   dot: 'bg-rose-500',                pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20'   },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRates, fetchRates, isConnected } = useExchangeStore();

  const [operations, setOperations]         = useState<Operation[]>([]);
  const [stats, setStats]                   = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading]           = useState(true);
  const [activeTab, setActiveTab]           = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [copiedCode, setCopiedCode]         = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [currentPage, setCurrentPage]       = useState(1);
  const operationsPerPage = 10;

  /* tick animation for live rates */
  const [rateTick, setRateTick] = useState<'up' | 'down' | null>(null);
  const prevRates = useRef(currentRates);
  useEffect(() => {
    if (!currentRates || !prevRates.current) { prevRates.current = currentRates; return; }
    const dir = currentRates.tipo_venta > prevRates.current.tipo_venta ? 'up' : 'down';
    setRateTick(dir);
    const t = setTimeout(() => setRateTick(null), 800);
    prevRates.current = currentRates;
    return () => clearTimeout(t);
  }, [currentRates]);

  useEffect(() => {
    fetchRates();
    const unsub = useExchangeStore.getState().startRateSubscription();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    loadData();
  }, [isAuthenticated]);

  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  const loadData = async () => {
    if (!user?.dni) return;
    setIsLoading(true);
    try {
      const [opsRes, statsRes] = await Promise.all([
        operationsApi.getMyOperations(user.dni),
        operationsApi.getStats(user.dni),
      ]);
      if (opsRes.success && opsRes.data)     setOperations(opsRes.data);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); router.push('/'); };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const filtered = operations.filter((op) => {
    if (activeTab === 'pendientes')  return op.estado === 'pendiente' || op.estado === 'en_proceso';
    if (activeTab === 'completadas') return op.estado === 'completado';
    return true;
  });
  const totalPages = Math.ceil(filtered.length / operationsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * operationsPerPage, currentPage * operationsPerPage);

  const handleOpClick = (op: Operation) => {
    if (op.estado === 'pendiente') {
      if (op.origen && op.origen !== 'web') {
        router.push(`/dashboard/operaciones/${op.id}`);
        return;
      }
      if (!op.codigo_operacion) { router.push(`/dashboard/operaciones/${op.id}`); return; }
      router.push(`/dashboard/nueva-operacion?operation_id=${op.codigo_operacion}`);
    } else {
      setSelectedOperation(op);
      setIsOperationModalOpen(true);
    }
  };

  const displayName =
    user?.document_type === 'RUC'
      ? user?.razon_social || user?.nombres
      : user?.apellidos
        ? `${user?.nombres} ${user?.apellidos}`
        : user?.nombres;

  /* ── Loading ──────────────────────────────────────────────────── */
  if (isLoading) return (
    <div className="min-h-screen bg-[#070C14] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border border-t-amber-400 animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium tracking-wide">Conectando...</p>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#070C14] text-white">

      {/* ── TICKER STRIP ─────────────────────────────────────────── */}
      <div className="bg-[#0A1020] border-b border-white/5 py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {currentRates && (
              <>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">USD/PEN</span>
                  <span className={`text-[11px] font-mono font-bold transition-colors duration-300 ${rateTick === 'up' ? 'text-emerald-400' : rateTick === 'down' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {currentRates.tipo_venta.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                    <span className="text-slate-500 text-[10px]">COMPRA</span>
                    <span className="text-emerald-400 text-[11px] font-mono font-bold">{currentRates.tipo_compra.toFixed(4)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-blue-400" />
                    <span className="text-slate-500 text-[10px]">VENTA</span>
                    <span className="text-blue-400 text-[11px] font-mono font-bold">{currentRates.tipo_venta.toFixed(4)}</span>
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className={`text-[10px] font-medium ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isConnected ? 'EN VIVO' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#070C14]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
            <img src="/logo-principal.png" alt="QoriCash" className="h-7 w-auto" />
            <span className="text-white font-bold text-base tracking-tight hidden sm:block">QoriCash</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-sm font-medium max-w-[120px] truncate hidden sm:block">{displayName}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-500 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── User dropdown portal ──────────────────────────────────── */}
      {isUserMenuOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsUserMenuOpen(false)} />
          <div className="fixed right-4 w-52 bg-[#0D1525] border border-white/8 rounded-xl shadow-2xl shadow-black/50 py-1.5 overflow-hidden" style={{ zIndex: 99999, top: '100px' }}>
            {[
              { icon: User,     label: 'Mi perfil',         action: () => router.push('/perfil') },
              { icon: BarChart2, label: 'Mi Dashboard',     action: () => router.push('/dashboard') },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={() => { setIsUserMenuOpen(false); action(); }}
                className="flex items-center w-full px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition text-sm gap-3">
                <Icon className="w-4 h-4 text-slate-500" />{label}
              </button>
            ))}
            {(['Master', 'Operador'] as const).includes(user?.role as any) && (
              <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard/posicion'); }}
                className="flex items-center w-full px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition text-sm gap-3">
                <BarChart2 className="w-4 h-4 text-slate-500" />Posición del Día
              </button>
            )}
            <a href="https://wa.me/51926011920?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
              target="_blank" rel="noopener noreferrer" onClick={() => setIsUserMenuOpen(false)}
              className="flex items-center w-full px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition text-sm gap-3">
              <HelpCircle className="w-4 h-4 text-slate-500" />Ayuda
            </a>
            <div className="border-t border-white/5 my-1" />
            <button onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
              className="flex items-center w-full px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition text-sm gap-3">
              <LogOut className="w-4 h-4" />Cerrar sesión
            </button>
          </div>
        </>,
        document.body
      )}

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── WELCOME + STATS ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-0.5">Panel de operaciones</p>
            <h1 className="text-xl font-bold text-white">
              Hola, <span className="text-amber-400">{user?.nombres?.split(' ')[0]}</span>
            </h1>
          </div>
          <button
            onClick={() => router.push('/dashboard/nueva-operacion')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#070C14] font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nueva Operación
          </button>
        </div>

        {/* ── METRICS ROW ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: 'Operaciones',
                value: stats.total_operations.toString(),
                icon: Layers,
                color: 'text-amber-400',
                bg: 'bg-amber-500/8',
                border: 'border-amber-500/12',
              },
              {
                label: 'Vol. USD',
                value: `$ ${fmt$(stats.total_dolares)}`,
                icon: DollarSign,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/8',
                border: 'border-emerald-500/12',
              },
              {
                label: 'Vol. PEN',
                value: `S/ ${fmtS(stats.total_soles)}`,
                icon: Activity,
                color: 'text-blue-400',
                bg: 'bg-blue-500/8',
                border: 'border-blue-500/12',
              },
              {
                label: 'Activas',
                value: stats.pending_operations.toString(),
                icon: Zap,
                color: 'text-rose-400',
                bg: 'bg-rose-500/8',
                border: 'border-rose-500/12',
              },
            ].map(({ label, value, icon: Icon, color, bg, border }) => (
              <div key={label} className={`rounded-xl border ${border} ${bg} px-4 py-3.5 flex items-center gap-3`}>
                <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{label}</p>
                  <p className={`text-base font-bold font-mono ${color} truncate`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EXCHANGE RATE PANEL + REFERRAL (two-col) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

          {/* Rate card */}
          {currentRates && (
            <div className="rounded-xl border border-white/8 bg-[#0D1525] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Tipo de Cambio · USD/PEN</p>
                <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {isConnected ? 'EN VIVO' : 'Sin conexión'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-500/6 border border-emerald-500/12 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">QoriCash Compra</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-white">
                    {currentRates.tipo_compra.toFixed(4)}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">S/ por cada USD que entrega</p>
                </div>
                <div className="rounded-xl bg-blue-500/6 border border-blue-500/12 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">QoriCash Vende</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-white">
                    {currentRates.tipo_venta.toFixed(4)}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">S/ por cada USD que recibe</p>
                </div>
              </div>
            </div>
          )}

          {/* Referral card */}
          {user?.referral_code ? (
            <div className="rounded-xl border border-white/8 bg-[#0D1525] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-amber-400" />
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Programa de Referidos</p>
              </div>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                Comparte tu código y ambos obtendrán un mejor tipo de cambio en su próxima operación.
              </p>
              <div className="rounded-xl bg-white/3 border border-white/6 px-4 py-3 mb-3">
                <p className="text-slate-500 text-[10px] mb-1">Tu código exclusivo</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold font-mono tracking-widest text-amber-400">{user.referral_code}</span>
                  <div className="flex gap-2">
                    <button onClick={copyReferralCode}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${copiedCode ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/6 hover:bg-white/10 text-slate-300 border border-white/8'}`}>
                      {copiedCode ? <><CheckCircle2 className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                    </button>
                    <button onClick={() => {
                      const text = `¡Hola! Te invito a cambiar dólares con QoriCash. Usa mi código ${user.referral_code} y ambos tendremos un mejor tipo de cambio.`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/6 hover:bg-white/10 text-slate-300 border border-white/8 transition">
                      <Share2 className="w-3 h-3" />Compartir
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/promociones/codigo-referido')}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white border border-white/6 hover:border-white/12 transition">
                Ver beneficios <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* placeholder si no hay referral */
            <div className="rounded-xl border border-white/8 bg-[#0D1525] p-5 flex items-center justify-center">
              <p className="text-slate-600 text-sm">—</p>
            </div>
          )}
        </div>

        {/* ── OPERATIONS TABLE ── */}
        <div className="rounded-xl border border-white/8 bg-[#0D1525] overflow-hidden">

          {/* Table header */}
          <div className="px-5 py-3.5 border-b border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm font-bold">Historial de Operaciones</span>
              <span className="text-slate-500 text-xs font-mono">({operations.length})</span>
            </div>
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/4 rounded-lg p-0.5">
              {([
                { key: 'todas',      label: 'Todas' },
                { key: 'pendientes', label: 'Activas' },
                { key: 'completadas',label: 'Completadas' },
              ] as const).map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    activeTab === tab.key
                      ? 'bg-amber-500 text-[#070C14]'
                      : 'text-slate-400 hover:text-white'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers — desktop */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_120px_80px_120px_100px_90px] px-5 py-2 border-b border-white/4">
            {['Operación', 'Usted paga', 'Usted recibe', 'T.C.', 'Estado', 'Fecha', ''].map((h) => (
              <span key={h} className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/4">
            {paginated.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">Sin operaciones</p>
                <p className="text-slate-600 text-xs mt-1">Crea tu primera operación para comenzar</p>
              </div>
            ) : paginated.map((op) => {
              const sc  = STATUS[op.estado] ?? STATUS.pendiente;
              const isCompra = op.tipo === 'compra';
              const paga = isCompra
                ? `$ ${fmt$(op.monto_dolares ?? 0)}`
                : `S/ ${fmtS(op.monto_soles ?? 0)}`;
              const recibe = isCompra
                ? `S/ ${fmtS(op.monto_soles ?? 0)}`
                : `$ ${fmt$(op.monto_dolares ?? 0)}`;

              return (
                <div key={op.id}
                  className="px-5 py-3 hover:bg-white/3 cursor-pointer transition-all group"
                  onClick={() => handleOpClick(op)}
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isCompra ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {isCompra ? 'QC COMPRA' : 'QC VENDE'}
                        </span>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold ${sc.pill}`}>
                          <span className={`w-1 h-1 rounded-full ${sc.dot}`} />{sc.label}
                        </div>
                      </div>
                      <p className="text-slate-400 text-[10px] font-mono">{op.codigo_operacion ?? `#${op.id}`}</p>
                      <div className="flex gap-4 mt-1.5">
                        <div>
                          <p className="text-[9px] text-slate-600 uppercase tracking-widest">Paga</p>
                          <p className="text-sm font-bold font-mono text-rose-400">{paga}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-600 uppercase tracking-widest">Recibe</p>
                          <p className="text-sm font-bold font-mono text-emerald-400">{recibe}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-slate-500 text-[10px]">{fmtDate(op.fecha_creacion)}</p>
                      <p className="text-slate-600 text-[10px]">{fmtTime(op.fecha_creacion)}</p>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-[1fr_120px_120px_80px_120px_100px_90px] items-center">
                    {/* Operación */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCompra ? 'bg-emerald-500/10 border border-emerald-500/15' : 'bg-blue-500/10 border border-blue-500/15'}`}>
                        {isCompra
                          ? <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                          : <TrendingUp className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${isCompra ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {isCompra ? 'QoriCash Compra' : 'QoriCash Vende'}
                        </p>
                        <p className="text-slate-600 text-[10px] font-mono truncate">{op.codigo_operacion ?? `#${op.id}`}</p>
                      </div>
                    </div>
                    {/* Paga */}
                    <p className="text-sm font-bold font-mono text-rose-400">{paga}</p>
                    {/* Recibe */}
                    <p className="text-sm font-bold font-mono text-emerald-400">{recibe}</p>
                    {/* TC */}
                    <p className="text-xs font-mono text-slate-400">{(op.tipo_cambio ?? 0).toFixed(3)}</p>
                    {/* Estado */}
                    <div>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-semibold ${sc.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </div>
                    </div>
                    {/* Fecha */}
                    <div>
                      <p className="text-xs text-slate-400">{fmtDate(op.fecha_creacion)}</p>
                      <p className="text-[10px] text-slate-600">{fmtTime(op.fecha_creacion)}</p>
                    </div>
                    {/* Arrow */}
                    <div className="flex justify-end">
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-slate-500 text-xs">
                {(currentPage - 1) * operationsPerPage + 1}–{Math.min(currentPage * operationsPerPage, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-white/4 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition">
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${currentPage === p ? 'bg-amber-500 text-[#070C14]' : 'text-slate-400 hover:text-white hover:bg-white/6'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-white/4 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition">
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ── OPERATION DETAIL MODAL ─────────────────────────────────── */}
      {isOperationModalOpen && selectedOperation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setIsOperationModalOpen(false)}>
          <div className="bg-[#0D1525] border border-white/8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedOperation.tipo === 'compra' ? 'bg-emerald-500/12 border border-emerald-500/20' : 'bg-blue-500/12 border border-blue-500/20'}`}>
                  {selectedOperation.tipo === 'compra'
                    ? <TrendingDown className="w-4 h-4 text-emerald-400" />
                    : <TrendingUp className="w-4 h-4 text-blue-400" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${selectedOperation.tipo === 'compra' ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {selectedOperation.tipo === 'compra' ? 'QoriCash Compra' : 'QoriCash Vende'}
                  </p>
                  <p className="text-slate-500 text-[10px] font-mono">
                    {selectedOperation.codigo_operacion || selectedOperation.operation_id || `#${selectedOperation.id}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOperationModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/6 text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">

              {/* Estado + fecha */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/3 border border-white/6 p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1.5">Estado</p>
                  {(() => {
                    const sc = STATUS[selectedOperation.estado] ?? STATUS.pendiente;
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold ${sc.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </div>
                    );
                  })()}
                </div>
                <div className="rounded-xl bg-white/3 border border-white/6 p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1.5">Fecha</p>
                  <p className="text-white text-sm font-semibold">
                    {new Date(selectedOperation.fecha_creacion).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Montos */}
              <div className="rounded-xl bg-white/3 border border-white/6 p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-slate-500 text-[9px] uppercase tracking-widest mb-2">Usted paga</p>
                    <div className="rounded-lg bg-rose-500/8 border border-rose-500/12 p-2.5">
                      <p className="text-base font-bold font-mono text-rose-400">
                        {selectedOperation.tipo === 'compra'
                          ? `$ ${fmt$(selectedOperation.monto_dolares ?? 0)}`
                          : `S/ ${fmtS(selectedOperation.monto_soles ?? 0)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 text-[9px] uppercase tracking-widest mb-2">T.C.</p>
                    <div className="rounded-lg bg-amber-500/8 border border-amber-500/12 p-2.5">
                      <p className="text-base font-bold font-mono text-amber-400">
                        {(selectedOperation.tipo_cambio ?? 0).toFixed(3)}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 text-[9px] uppercase tracking-widest mb-2">Usted recibe</p>
                    <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/12 p-2.5">
                      <p className="text-base font-bold font-mono text-emerald-400">
                        {selectedOperation.tipo === 'compra'
                          ? `S/ ${fmtS(selectedOperation.monto_soles ?? 0)}`
                          : `$ ${fmt$(selectedOperation.monto_dolares ?? 0)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cuentas */}
              {(selectedOperation.source_account || selectedOperation.destination_account) && (
                <div className="rounded-xl bg-white/3 border border-white/6 p-4 space-y-2">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />Cuentas bancarias
                  </p>
                  {selectedOperation.source_account && (
                    <div className="rounded-lg bg-white/3 px-3 py-2">
                      <p className="text-slate-500 text-[10px] mb-0.5">Cuenta origen</p>
                      <p className="text-white text-sm font-semibold">{selectedOperation.source_account}</p>
                      {selectedOperation.source_bank && <p className="text-slate-400 text-xs">{selectedOperation.source_bank}</p>}
                    </div>
                  )}
                  {selectedOperation.destination_account && (
                    <div className="rounded-lg bg-white/3 px-3 py-2">
                      <p className="text-slate-500 text-[10px] mb-0.5">Cuenta destino</p>
                      <p className="text-white text-sm font-semibold">{selectedOperation.destination_account}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Documentos */}
              {selectedOperation.estado?.toLowerCase() === 'completado' && (
                <div className="rounded-xl bg-white/3 border border-white/6 p-4 space-y-2">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />Documentos
                  </p>
                  {selectedOperation.payment_proof_url && (
                    <div className="rounded-lg bg-white/3 p-3">
                      <p className="text-slate-500 text-[10px] mb-2">Comprobante cliente</p>
                      <div className="flex items-center gap-3">
                        <img src={selectedOperation.payment_proof_url} alt="Comprobante"
                          className="w-16 h-16 object-cover rounded-lg border border-white/8 cursor-pointer hover:opacity-80 transition"
                          onClick={() => window.open(selectedOperation.payment_proof_url, '_blank')} />
                        <a href={selectedOperation.payment_proof_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition">
                          <ImageIcon className="w-3 h-3" />Ver completo
                        </a>
                      </div>
                    </div>
                  )}
                  {Array.isArray(selectedOperation.operator_proofs) && selectedOperation.operator_proofs.map((proof: any, idx: number) =>
                    proof.comprobante_url ? (
                      <div key={idx} className="rounded-lg bg-white/3 p-3">
                        <p className="text-slate-500 text-[10px] mb-2">Comprobante operador{selectedOperation.operator_proofs.length > 1 ? ` ${idx + 1}` : ''}</p>
                        <div className="flex items-center gap-3">
                          <img src={proof.comprobante_url} alt="Comprobante operador"
                            className="w-16 h-16 object-cover rounded-lg border border-white/8 cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(proof.comprobante_url, '_blank')} />
                          <a href={proof.comprobante_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition">
                            <ImageIcon className="w-3 h-3" />Ver completo
                          </a>
                        </div>
                      </div>
                    ) : null
                  )}
                  {Array.isArray(selectedOperation.invoices) && selectedOperation.invoices.map((inv: any, idx: number) =>
                    inv.nubefact_enlace_pdf ? (
                      <div key={idx} className="rounded-lg bg-white/3 px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-slate-500 text-[10px]">{inv.invoice_type === '01' ? 'Factura' : 'Boleta'}{inv.invoice_number ? ` ${inv.invoice_number}` : ''}</p>
                        </div>
                        <a href={inv.nubefact_enlace_pdf} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                          <FileText className="w-3 h-3" />Ver PDF
                        </a>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {/* Ver detalles completos */}
              <button onClick={() => { setIsOperationModalOpen(false); router.push(`/dashboard/operaciones/${selectedOperation.id}`); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 hover:border-white/16 text-slate-400 hover:text-white text-sm font-semibold transition">
                Ver detalles completos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

