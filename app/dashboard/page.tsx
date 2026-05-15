'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useOperationEventStore } from '@/lib/store/operationEventStore';
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

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt$ = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' });
const fmtTime = (s: string) =>
  new Date(s).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

/* ─── status config ───────────────────────────────────────────── */
const STATUS: Record<string, { label: string; dot: string; pill: string }> = {
  pendiente:  { label: 'Pendiente',  dot: 'bg-amber-400 animate-pulse', pill: 'bg-amber-50 text-amber-700 border-amber-200'    },
  en_proceso: { label: 'En proceso', dot: 'bg-blue-400 animate-pulse',  pill: 'bg-blue-50 text-blue-700 border-blue-200'       },
  completado: { label: 'Completado', dot: 'bg-emerald-500',             pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelado:  { label: 'Cancelado',  dot: 'bg-gray-400',               pill: 'bg-gray-100 text-gray-600 border-gray-200'       },
  rechazado:  { label: 'Rechazado',  dot: 'bg-rose-500',               pill: 'bg-rose-50 text-rose-700 border-rose-200'        },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRates, fetchRates, isConnected } = useExchangeStore();
  const { lastEvent } = useOperationEventStore();

  const [operations, setOperations]               = useState<Operation[]>([]);
  const [stats, setStats]                         = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading]                 = useState(true);
  const [activeTab, setActiveTab]                 = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [copiedCode, setCopiedCode]               = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen]       = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [currentPage, setCurrentPage]             = useState(1);
  const operationsPerPage = 10;

  /* tick flash on rate change */
  const [rateTick, setRateTick] = useState<'up' | 'down' | null>(null);
  const prevRates = useRef(currentRates);
  useEffect(() => {
    if (!currentRates || !prevRates.current) { prevRates.current = currentRates; return; }
    setRateTick(currentRates.tipo_venta > prevRates.current.tipo_venta ? 'up' : 'down');
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

  // Refrescar lista cuando llega un evento realtime de operación
  useEffect(() => {
    if (!lastEvent || !isAuthenticated) return;
    loadData();
  }, [lastEvent]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleLogout = async () => { await logout(); router.push('/'); };

  const copyReferralCode = () => {
    if (!user?.referral_code) return;
    navigator.clipboard.writeText(user.referral_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
      if (op.origen && op.origen !== 'web') { router.push(`/dashboard/operaciones/${op.id}`); return; }
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
      : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres;

  /* ── Loading ─────────────────────────────────────────────────── */
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-2 border-t-primary-500 animate-spin" />
        </div>
        <p className="text-gray-400 text-sm font-medium">Cargando...</p>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F4F6FA]">

      {/* ── TOPBAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main nav row */}
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-75 transition">
              <img src="/logo-principal.png" alt="QoriCash" className="h-8 w-auto" />
              <span className="font-bold text-gray-900 text-base hidden sm:block">QoriCash</span>
            </Link>

            {/* Live rates — desktop pill */}
            {currentRates && (
              <div className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                <div className="flex items-center gap-4 divide-x divide-gray-200">
                  <div className="flex items-center gap-2 pr-4">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide">Compra</span>
                    <span className={`text-sm font-bold font-mono transition-colors duration-300 ${rateTick === 'up' ? 'text-emerald-500' : 'text-gray-900'}`}>
                      {currentRates.tipo_compra.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide">Venta</span>
                    <span className={`text-sm font-bold font-mono transition-colors duration-300 ${rateTick === 'down' ? 'text-rose-500' : 'text-gray-900'}`}>
                      {currentRates.tipo_venta.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* User menu */}
            <div className="relative">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition group">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">{displayName}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile live rates strip */}
          {currentRates && (
            <div className="md:hidden flex items-center justify-center gap-5 pb-2 text-sm">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-gray-500 text-xs">Compra</span>
                <span className="font-bold font-mono text-gray-900">{currentRates.tipo_compra.toFixed(4)}</span>
              </span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-gray-500 text-xs">Venta</span>
                <span className="font-bold font-mono text-gray-900">{currentRates.tipo_venta.toFixed(4)}</span>
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            </div>
          )}
        </div>
      </header>

      {/* ── User dropdown portal ──────────────────────────────────── */}
      {isUserMenuOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setIsUserMenuOpen(false)} />
          <div className="fixed right-4 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 overflow-hidden" style={{ zIndex: 99999, top: '64px' }}>
            {[
              { icon: User,      label: 'Mi perfil',      action: () => router.push('/perfil') },
              { icon: BarChart2, label: 'Mi Dashboard',   action: () => router.push('/dashboard') },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={() => { setIsUserMenuOpen(false); action(); }}
                className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition text-sm gap-3">
                <Icon className="w-4 h-4 text-gray-400" />{label}
              </button>
            ))}
            {(['Master', 'Operador'] as const).includes(user?.role as any) && (
              <button onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard/posicion'); }}
                className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition text-sm gap-3">
                <BarChart2 className="w-4 h-4 text-gray-400" />Posición del Día
              </button>
            )}
            <a href="https://wa.me/51926011920?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
              target="_blank" rel="noopener noreferrer" onClick={() => setIsUserMenuOpen(false)}
              className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition text-sm gap-3">
              <HelpCircle className="w-4 h-4 text-gray-400" />Ayuda
            </a>
            <div className="border-t border-gray-100 my-1" />
            <button onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
              className="flex items-center w-full px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition text-sm gap-3">
              <LogOut className="w-4 h-4" />Cerrar sesión
            </button>
          </div>
        </>,
        document.body
      )}

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── WELCOME ROW ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-0.5">Panel de operaciones</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Hola, <span className="text-primary-600">{user?.nombres?.split(' ')[0]}</span>
            </h1>
          </div>
          <button
            onClick={() => router.push('/dashboard/nueva-operacion')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all shadow-md shadow-primary-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />Nueva Operación
          </button>
        </div>

        {/* ── METRICS ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Operaciones',  value: stats.total_operations.toString(), icon: Layers,     accent: 'text-primary-600',  bg: 'bg-primary-50',  border: 'border-primary-100' },
              { label: 'Vol. Dólares', value: `$ ${fmt$(stats.total_dolares)}`,  icon: DollarSign, accent: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'Vol. Soles',   value: `S/ ${fmtS(stats.total_soles)}`,   icon: Activity,   accent: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100'    },
              { label: 'Activas',      value: stats.pending_operations.toString(), icon: Zap,       accent: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
            ].map(({ label, value, icon: Icon, accent, bg, border }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 px-4 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${accent}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wide">{label}</p>
                  <p className={`text-lg font-bold font-mono ${accent} truncate leading-tight`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RATES + REFERRAL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Rates */}
          {currentRates && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Tipo de Cambio</p>
                  <p className="text-gray-900 font-bold text-sm">USD / PEN</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${isConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  {isConnected ? 'En vivo' : 'Sin conexión'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Compra */}
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">QoriCash Compra</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-emerald-700 leading-none">
                    {currentRates.tipo_compra.toFixed(3)}
                  </p>
                  <p className="text-emerald-400 text-[10px] mt-2 font-medium">S/ por cada USD que usted entrega</p>
                </div>
                {/* Venta */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">QoriCash Vende</span>
                  </div>
                  <p className="text-3xl font-bold font-mono text-blue-700 leading-none">
                    {currentRates.tipo_venta.toFixed(3)}
                  </p>
                  <p className="text-blue-400 text-[10px] mt-2 font-medium">S/ por cada USD que usted recibe</p>
                </div>
              </div>
            </div>
          )}

          {/* Referral */}
          {user?.referral_code && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-amber-500" />
                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Programa Referidos</p>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Invita a tus amigos. Ambos obtienen un mejor tipo de cambio en su próxima operación.
              </p>
              <div className="mt-auto">
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 px-4 py-3.5 mb-3">
                  <p className="text-amber-600 text-[10px] font-semibold uppercase tracking-widest mb-1">Tu código exclusivo</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-black font-mono tracking-widest text-amber-700">{user.referral_code}</span>
                    <div className="flex gap-2">
                      <button onClick={copyReferralCode}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${copiedCode ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'}`}>
                        {copiedCode ? <><CheckCircle2 className="w-3.5 h-3.5" />Copiado</> : <><Copy className="w-3.5 h-3.5" />Copiar</>}
                      </button>
                      <button onClick={() => {
                        const text = `¡Hola! Te invito a cambiar dólares con QoriCash. Usa mi código ${user.referral_code} y ambos tendremos un mejor tipo de cambio.`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600 transition">
                        <Share2 className="w-3.5 h-3.5" />Compartir
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => router.push('/dashboard/promociones/codigo-referido')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-200 text-xs font-semibold transition">
                  Ver mis beneficios <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── OPERATIONS TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-gray-900 text-sm font-bold">Historial de Operaciones</p>
                <p className="text-gray-400 text-xs">{operations.length} operaciones en total</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1 gap-0.5">
              {([
                { key: 'todas',       label: 'Todas' },
                { key: 'pendientes',  label: 'Activas' },
                { key: 'completadas', label: 'Completadas' },
              ] as const).map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === tab.key
                      ? 'bg-white text-primary-600 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers — desktop */}
          <div className="hidden sm:grid grid-cols-[1.2fr_110px_110px_70px_110px_90px_36px] px-5 py-2.5 bg-gray-50 border-b border-gray-100">
            {['Operación', 'Usted paga', 'Usted recibe', 'T.C.', 'Estado', 'Fecha', ''].map((h) => (
              <span key={h} className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm font-medium">Sin operaciones</p>
                <p className="text-gray-400 text-xs mt-1">Crea tu primera operación para comenzar</p>
              </div>
            ) : paginated.map((op) => {
              const sc = STATUS[op.estado] ?? STATUS.pendiente;
              const isCompra = op.tipo === 'compra';
              const paga   = isCompra ? `$ ${fmt$(op.monto_dolares ?? 0)}` : `S/ ${fmtS(op.monto_soles ?? 0)}`;
              const recibe = isCompra ? `S/ ${fmtS(op.monto_soles ?? 0)}` : `$ ${fmt$(op.monto_dolares ?? 0)}`;

              return (
                <div key={op.id}
                  className="px-5 py-3.5 hover:bg-gray-50/80 cursor-pointer transition group"
                  onClick={() => handleOpClick(op)}
                >
                  {/* Mobile */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isCompra ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {isCompra ? 'QC COMPRA' : 'QC VENDE'}
                        </span>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${sc.pill}`}>
                          <span className={`w-1 h-1 rounded-full ${sc.dot}`} />{sc.label}
                        </div>
                      </div>
                      <span className="text-gray-400 text-[10px]">{fmtDate(op.fecha_creacion)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Paga</p>
                        <p className="text-sm font-bold font-mono text-rose-600">{paga}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Recibe</p>
                        <p className="text-sm font-bold font-mono text-emerald-600">{recibe}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">T.C.</p>
                        <p className="text-xs font-mono text-gray-600">{(op.tipo_cambio ?? 0).toFixed(3)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-[1.2fr_110px_110px_70px_110px_90px_36px] items-center">
                    {/* Operación */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCompra ? 'bg-emerald-50 border border-emerald-100' : 'bg-blue-50 border border-blue-100'}`}>
                        {isCompra
                          ? <TrendingDown className="w-4 h-4 text-emerald-500" />
                          : <TrendingUp className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${isCompra ? 'text-emerald-600' : 'text-blue-600'}`}>
                          {isCompra ? 'QoriCash Compra' : 'QoriCash Vende'}
                        </p>
                        <p className="text-gray-400 text-[10px] font-mono truncate">{op.codigo_operacion ?? `#${op.id}`}</p>
                      </div>
                    </div>
                    {/* Paga */}
                    <p className="text-sm font-bold font-mono text-rose-600">{paga}</p>
                    {/* Recibe */}
                    <p className="text-sm font-bold font-mono text-emerald-600">{recibe}</p>
                    {/* TC */}
                    <p className="text-xs font-mono text-gray-500">{(op.tipo_cambio ?? 0).toFixed(3)}</p>
                    {/* Estado */}
                    <div>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${sc.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </div>
                    </div>
                    {/* Fecha */}
                    <div>
                      <p className="text-xs text-gray-600 font-medium">{fmtDate(op.fecha_creacion)}</p>
                      <p className="text-[10px] text-gray-400">{fmtTime(op.fecha_creacion)}</p>
                    </div>
                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-gray-400 text-xs">
                Mostrando {(currentPage - 1) * operationsPerPage + 1}–{Math.min(currentPage * operationsPerPage, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  ← Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${currentPage === p ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* ── OPERATION DETAIL MODAL ────────────────────────────────── */}
      {isOperationModalOpen && selectedOperation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setIsOperationModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOperation.tipo === 'compra' ? 'bg-emerald-50 border border-emerald-100' : 'bg-blue-50 border border-blue-100'}`}>
                  {selectedOperation.tipo === 'compra'
                    ? <TrendingDown className="w-5 h-5 text-emerald-500" />
                    : <TrendingUp className="w-5 h-5 text-blue-500" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${selectedOperation.tipo === 'compra' ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {selectedOperation.tipo === 'compra' ? 'QoriCash Compra' : 'QoriCash Vende'}
                  </p>
                  <p className="text-gray-400 text-[10px] font-mono">
                    {selectedOperation.codigo_operacion || selectedOperation.operation_id || `#${selectedOperation.id}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOperationModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">

              {/* Estado + fecha */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Estado</p>
                  {(() => {
                    const sc = STATUS[selectedOperation.estado] ?? STATUS.pendiente;
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${sc.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                      </div>
                    );
                  })()}
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5 font-semibold">Fecha</p>
                  <p className="text-gray-900 text-sm font-bold">
                    {new Date(selectedOperation.fecha_creacion).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Montos */}
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-2 font-semibold">Usted paga</p>
                    <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                      <p className="text-base font-bold font-mono text-rose-600 leading-tight">
                        {selectedOperation.tipo === 'compra'
                          ? `$ ${fmt$(selectedOperation.monto_dolares ?? 0)}`
                          : `S/ ${fmtS(selectedOperation.monto_soles ?? 0)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-2 font-semibold">T.C.</p>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <p className="text-base font-bold font-mono text-amber-600 leading-tight">
                        {(selectedOperation.tipo_cambio ?? 0).toFixed(3)}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-2 font-semibold">Usted recibe</p>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                      <p className="text-base font-bold font-mono text-emerald-600 leading-tight">
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
                <div className="rounded-xl border border-gray-200 p-4 space-y-2">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />Cuentas bancarias
                  </p>
                  {selectedOperation.source_account && (
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5">
                      <p className="text-gray-400 text-[10px] mb-0.5">Cuenta origen</p>
                      <p className="text-gray-900 text-sm font-semibold">{selectedOperation.source_account}</p>
                      {selectedOperation.source_bank && <p className="text-gray-500 text-xs">{selectedOperation.source_bank}</p>}
                    </div>
                  )}
                  {selectedOperation.destination_account && (
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5">
                      <p className="text-gray-400 text-[10px] mb-0.5">Cuenta destino</p>
                      <p className="text-gray-900 text-sm font-semibold">{selectedOperation.destination_account}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Documentos — solo en completado */}
              {selectedOperation.estado?.toLowerCase() === 'completado' && (
                <div className="rounded-xl border border-gray-200 p-4 space-y-2">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />Documentos
                  </p>
                  {selectedOperation.payment_proof_url && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-gray-400 text-[10px] mb-2">Comprobante cliente</p>
                      <div className="flex items-center gap-3">
                        <img src={selectedOperation.payment_proof_url} alt="Comprobante"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                          onClick={() => window.open(selectedOperation.payment_proof_url, '_blank')} />
                        <a href={selectedOperation.payment_proof_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />Ver completo
                        </a>
                      </div>
                    </div>
                  )}
                  {Array.isArray(selectedOperation.operator_proofs) && selectedOperation.operator_proofs.map((proof: any, idx: number) =>
                    proof.comprobante_url ? (
                      <div key={idx} className="rounded-lg bg-gray-50 p-3">
                        <p className="text-gray-400 text-[10px] mb-2">Comprobante operador</p>
                        <div className="flex items-center gap-3">
                          <img src={proof.comprobante_url} alt="Comprobante operador"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.open(proof.comprobante_url, '_blank')} />
                          <a href={proof.comprobante_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />Ver completo
                          </a>
                        </div>
                      </div>
                    ) : null
                  )}
                  {Array.isArray(selectedOperation.invoices) && selectedOperation.invoices.map((inv: any, idx: number) =>
                    inv.nubefact_enlace_pdf ? (
                      <div key={idx} className="rounded-lg bg-gray-50 px-3 py-2.5 flex items-center justify-between">
                        <p className="text-gray-500 text-xs font-medium">{inv.invoice_type === '01' ? 'Factura' : 'Boleta'}{inv.invoice_number ? ` ${inv.invoice_number}` : ''}</p>
                        <a href={inv.nubefact_enlace_pdf} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                          <FileText className="w-3 h-3" />Ver PDF
                        </a>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {/* Ver detalles */}
              <button onClick={() => { setIsOperationModalOpen(false); router.push(`/dashboard/operaciones/${selectedOperation.id}`); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 hover:border-primary-200 text-gray-500 hover:text-primary-600 text-sm font-semibold transition">
                Ver detalles completos <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
