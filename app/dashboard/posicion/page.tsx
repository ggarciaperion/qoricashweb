'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { positionApi } from '@/lib/api/position';
import type { PositionData, BankRow, OperationRow } from '@/lib/api/position';
import {
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  DollarSign,
  CheckCircle2,
  Clock,
  Building2,
  ChevronLeft,
  Lock,
  Unlock,
  BarChart2,
  Activity,
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  List,
  Download,
  Copy,
  Check,
  Scale,
  ArrowRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_ROLES = ['Master', 'Operador'];

interface AperturaState {
  confirmed: boolean;
  operatorName: string;
  operatorId: number;
  timestamp: string;
  date: string;
}

function getTodayPeru(): string {
  return new Date()
    .toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

function getAperturaKey(date: string) {
  return `qoricash-apertura-${date}`;
}

function loadApertura(date: string): AperturaState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getAperturaKey(date));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveApertura(state: AperturaState) {
  localStorage.setItem(getAperturaKey(state.date), JSON.stringify(state));
}

function getSemaforo(diferencia_usd: number) {
  const abs = Math.abs(diferencia_usd);
  if (abs <= 1000) {
    return {
      color: 'green' as const,
      label: 'Posición equilibrada',
      action: 'Continuar operaciones normalmente',
      bg: 'bg-green-50',
      border: 'border-green-300',
      ring: 'ring-green-200',
      text: 'text-green-800',
      subtext: 'text-green-600',
      dot: 'bg-green-500',
      dotPing: 'bg-green-500',
      bar: 'bg-green-500',
    };
  }
  if (abs <= 3000) {
    return {
      color: 'yellow' as const,
      label: diferencia_usd > 0 ? 'Tendencia vendedora — monitorear' : 'Tendencia compradora — monitorear',
      action: diferencia_usd > 0 ? 'Buscar operaciones de compra' : 'Buscar operaciones de venta',
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      ring: 'ring-yellow-200',
      text: 'text-yellow-800',
      subtext: 'text-yellow-600',
      dot: 'bg-yellow-500',
      dotPing: 'bg-yellow-400',
      bar: 'bg-yellow-500',
    };
  }
  return {
    color: 'red' as const,
    label: diferencia_usd > 0 ? 'Crítico — exceso de ventas USD' : 'Crítico — exceso de compras USD',
    action: diferencia_usd > 0 ? 'Urgente: activar operaciones de compra' : 'Urgente: activar operaciones de venta',
    bg: 'bg-red-50',
    border: 'border-red-300',
    ring: 'ring-red-200',
    text: 'text-red-800',
    subtext: 'text-red-600',
    dot: 'bg-red-500',
    dotPing: 'bg-red-400',
    bar: 'bg-red-500',
  };
}

function formatUSD(n: number) {
  return `$${Math.abs(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPEN(n: number) {
  return `S/ ${Math.abs(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-PE', {
    timeZone: 'America/Lima',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface MovementsSummary {
  usd: { inflows: number; outflows: number; net: number };
  pen: { inflows: number; outflows: number; net: number };
  completed_operations: number;
}

interface TotalDifferences {
  usd: number;
  pen: number;
}

type TabOps = 'todas' | 'compras' | 'ventas';
type StatusFilter = 'all' | 'Pendiente' | 'En proceso' | 'Completada';

function getStatusBadge(status: string) {
  switch (status) {
    case 'Pendiente':
      return { cls: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' };
    case 'En proceso':
      return { cls: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' };
    case 'Completada':
      return { cls: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
    default:
      return { cls: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PosicionPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [fecha, setFecha] = useState(getTodayPeru());
  const [posicion, setPosicion] = useState<PositionData | null>(null);
  const [compras, setCompras] = useState<OperationRow[]>([]);
  const [ventas, setVentas] = useState<OperationRow[]>([]);
  const [banks, setBanks] = useState<BankRow[]>([]);
  const [movementsSummary, setMovementsSummary] = useState<MovementsSummary | null>(null);
  const [totalDifferences, setTotalDifferences] = useState<TotalDifferences | null>(null);
  const [hasCriticalDiscrepancy, setHasCriticalDiscrepancy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sprint 3: export / copy state
  const [copied, setCopied] = useState(false);

  // Operations table filters
  const [tabOps, setTabOps] = useState<TabOps>('todas');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Apertura state
  const [apertura, setApertura] = useState<AperturaState | null>(null);
  const [isConfirmingApertura, setIsConfirmingApertura] = useState(false);

  // Bank balance editing
  const [editingBalance, setEditingBalance] = useState<{
    bankId: number;
    bankName: string;
    currency: 'USD' | 'PEN';
    type: 'initial' | 'current';
    currentValue: number;
  } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSavingBalance, setIsSavingBalance] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && !ALLOWED_ROLES.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user]);

  // Load apertura state
  useEffect(() => {
    const state = loadApertura(fecha);
    setApertura(state);
  }, [fecha]);

  // Load data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [posRes, reconRes] = await Promise.all([
        positionApi.getPosition(fecha),
        positionApi.getReconciliation(fecha),
      ]);
      if (posRes.success) {
        setPosicion(posRes.posicion);
        setCompras(posRes.compras);
        setVentas(posRes.ventas);
      }
      if (reconRes.success) {
        setBanks(reconRes.banks);
        setMovementsSummary(reconRes.movements_summary);
        setTotalDifferences(reconRes.total_differences);
        setHasCriticalDiscrepancy(reconRes.has_critical_discrepancy);
      }
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cargar datos de posición');
    } finally {
      setIsLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    if (isAuthenticated && user && ALLOWED_ROLES.includes(user.role)) {
      loadData();
    }
  }, [fecha, isAuthenticated, user]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editingBalance) loadData();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData, editingBalance]);

  // Confirm apertura
  const handleConfirmApertura = () => {
    if (!user) return;
    setIsConfirmingApertura(true);
    setTimeout(() => {
      const state: AperturaState = {
        confirmed: true,
        operatorName: user.full_name || `${user.nombres} ${user.apellidos}`,
        operatorId: user.id,
        timestamp: new Date().toISOString(),
        date: fecha,
      };
      saveApertura(state);
      setApertura(state);
      setIsConfirmingApertura(false);
    }, 600);
  };

  // Save balance edit
  const handleSaveBalance = async () => {
    if (!editingBalance) return;
    const amount = parseFloat(editValue);
    if (isNaN(amount) || amount < 0) return;

    setIsSavingBalance(true);
    try {
      if (editingBalance.type === 'initial') {
        await positionApi.updateInitialBalance(editingBalance.bankName, editingBalance.currency, amount);
      } else {
        await positionApi.updateBalance(editingBalance.bankName, editingBalance.currency, amount);
      }
      setEditingBalance(null);
      setEditValue('');
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error al actualizar saldo');
    } finally {
      setIsSavingBalance(false);
    }
  };

  // ── Sprint 3: Export CSV ──
  const handleExportCSV = () => {
    if (!posicion) return;
    const rows: string[][] = [];
    const fmt = (n: number) => n.toFixed(2);

    rows.push([`POSICIÓN QORICASH — ${fecha}`, '', '', '', '', '', '']);
    rows.push([`Generado: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}`, '', '', '', '', '', '']);
    rows.push([]);

    rows.push(['RESUMEN DE POSICIÓN']);
    rows.push(['Utilidad bruta (PEN)', `S/ ${fmt(posicion.utilidad_pen)}`]);
    rows.push(['Total compras USD', `$ ${fmt(posicion.total_compras_usd)}`, 'TC prom', posicion.tc_promedio_compras.toFixed(4)]);
    rows.push(['Total ventas USD', `$ ${fmt(posicion.total_ventas_usd)}`, 'TC prom', posicion.tc_promedio_ventas.toFixed(4)]);
    rows.push(['Diferencia neta USD', `$ ${fmt(posicion.diferencia_usd)}`, posicion.etiqueta_diferencia]);
    rows.push(['Total operaciones', String(posicion.total_operaciones), `${posicion.cantidad_compras} compras / ${posicion.cantidad_ventas} ventas`]);
    rows.push([]);

    rows.push(['OPERACIONES DEL DÍA']);
    rows.push(['Código', 'Cliente', 'Tipo', 'USD', 'TC', 'PEN', 'Estado', 'Hora', 'Crítica', 'Razón crítica']);
    const allOpsExport = [
      ...compras.map((o) => ({ ...o, opType: 'Compra' })),
      ...ventas.map((o) => ({ ...o, opType: 'Venta' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    allOpsExport.forEach((op) => {
      rows.push([
        op.operation_id,
        op.client_name,
        op.opType,
        fmt(op.amount_usd),
        op.exchange_rate.toFixed(4),
        fmt(op.amount_pen),
        op.status,
        formatTime(op.created_at),
        op.es_critica ? 'SÍ' : 'No',
        op.razon_critica || '',
      ]);
    });
    rows.push([]);

    rows.push(['SALDOS BANCARIOS']);
    rows.push(['Banco', 'USD Inicial', 'USD Actual', 'Δ USD', 'PEN Inicial', 'PEN Actual', 'Δ PEN', 'Actualizado por', 'Fecha']);
    banks.forEach((b) => {
      rows.push([
        b.bank_name,
        fmt(b.usd.initial), fmt(b.usd.actual), fmt(b.usd.difference),
        fmt(b.pen.initial), fmt(b.pen.actual), fmt(b.pen.difference),
        b.updated_by || '',
        b.updated_at ? formatDateTime(b.updated_at) : '',
      ]);
    });

    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `posicion-qoricash-${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Sprint 3: Copy summary to clipboard ──
  const handleCopyResumen = async () => {
    if (!posicion) return;
    const fechaFmt = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const lines = [
      `📊 *Posición QoriCash — ${fechaFmt}*`,
      ``,
      `💰 Utilidad bruta: S/ ${posicion.utilidad_pen.toFixed(2)}`,
      `📈 Compras USD: $${posicion.total_compras_usd.toFixed(2)} (TC prom: ${posicion.tc_promedio_compras.toFixed(4)})`,
      `📉 Ventas USD: $${posicion.total_ventas_usd.toFixed(2)} (TC prom: ${posicion.tc_promedio_ventas.toFixed(4)})`,
      `↕️ Posición neta: $${Math.abs(posicion.diferencia_usd).toFixed(2)} ${posicion.etiqueta_diferencia}`,
      `🔄 Operaciones: ${posicion.total_operaciones} (${posicion.cantidad_compras} compras · ${posicion.cantidad_ventas} ventas)`,
    ];
    if (movementsSummary) {
      lines.push(`✅ Completadas: ${movementsSummary.completed_operations} ops`);
    }
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── Render helpers ──

  if (!isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

  // Filtered operations
  const allOps = [
    ...compras.map((o) => ({ ...o, opType: 'Compra' as const })),
    ...ventas.map((o) => ({ ...o, opType: 'Venta' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredOps = allOps
    .filter((o) => tabOps === 'todas' || (tabOps === 'compras' ? o.opType === 'Compra' : o.opType === 'Venta'))
    .filter((o) => statusFilter === 'all' || o.status === statusFilter);

  const criticalCount = allOps.filter((o) => o.es_critica).length;

  const semaforo = posicion ? getSemaforo(posicion.diferencia_usd) : null;
  const spread =
    posicion && posicion.tc_promedio_ventas > 0 && posicion.tc_promedio_compras > 0
      ? (posicion.tc_promedio_ventas - posicion.tc_promedio_compras).toFixed(4)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary-600" />
                <h1 className="text-base font-bold text-gray-900">Posición del Día</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 text-gray-700"
              />
              <button
                onClick={handleCopyResumen}
                disabled={!posicion}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                title="Copiar resumen al portapapeles"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button
                onClick={handleExportCSV}
                disabled={!posicion}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                title="Exportar a CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* ── Critical discrepancy alert ── */}
        {hasCriticalDiscrepancy && (
          <div className="bg-red-600 text-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-sm">ALERTA DE DESCUADRE CRÍTICO</span>
              <span className="text-red-100 text-sm ml-2">
                La diferencia entre saldos esperados y actuales supera el umbral. Verificar inmediatamente.
              </span>
            </div>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && !posicion && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {posicion && semaforo && (
          <>
            {/* ── Top row: Semáforo + KPIs ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Semáforo */}
              <div
                className={`lg:col-span-1 ${semaforo.bg} ${semaforo.border} border-2 rounded-2xl p-5 ring-4 ${semaforo.ring} shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex items-center">
                    <div className={`w-3 h-3 rounded-full ${semaforo.dot}`} />
                    <div className={`absolute w-3 h-3 rounded-full ${semaforo.dotPing} animate-ping`} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${semaforo.subtext}`}>
                    Semáforo de Posición
                  </span>
                </div>

                <div className={`text-lg font-extrabold ${semaforo.text} mb-1`}>
                  {semaforo.label}
                </div>
                <div className={`text-sm font-semibold ${semaforo.subtext} mb-4`}>
                  → {semaforo.action}
                </div>

                {/* Barra visual */}
                <div className="bg-white/60 rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className={`h-full ${semaforo.bar} rounded-full transition-all duration-700`}
                    style={{
                      width: `${Math.min(100, (Math.abs(posicion.diferencia_usd) / 5000) * 100)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${semaforo.subtext}`}>
                    {posicion.etiqueta_diferencia}
                  </span>
                  <span className={`text-base font-extrabold ${semaforo.text}`}>
                    {formatUSD(posicion.diferencia_usd)}
                  </span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                {/* Utilidad */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Utilidad bruta</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className={`text-2xl font-extrabold ${posicion.utilidad_pen >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {posicion.utilidad_pen >= 0 ? '' : '-'}{formatPEN(posicion.utilidad_pen)}
                  </div>
                  {spread && (
                    <div className="text-xs text-gray-400 mt-1 font-medium">
                      Spread prom: {spread}
                    </div>
                  )}
                </div>

                {/* Total Operaciones */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Operaciones</span>
                    <Activity className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-gray-800">
                    {posicion.total_operaciones}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">
                    {posicion.cantidad_compras} compras · {posicion.cantidad_ventas} ventas
                  </div>
                </div>

                {/* Compras USD */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Compras USD</span>
                    <TrendingDown className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="text-xl font-extrabold text-gray-800">
                    {formatUSD(posicion.total_compras_usd)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">
                    TC prom: {posicion.tc_promedio_compras.toFixed(4)}
                  </div>
                </div>

                {/* Ventas USD */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ventas USD</span>
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-xl font-extrabold text-gray-800">
                    {formatUSD(posicion.total_ventas_usd)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">
                    TC prom: {posicion.tc_promedio_ventas.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Apertura del Día ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {apertura?.confirmed ? (
                    <Lock className="w-4 h-4 text-green-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                  <h2 className="text-sm font-bold text-gray-800">Apertura del Día</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{fecha}</span>
                </div>
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    Actualizado a las {formatTime(lastUpdated.toISOString())}
                  </span>
                )}
              </div>

              {apertura?.confirmed ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-green-800">Apertura confirmada</span>
                    <span className="text-sm text-green-700 ml-2">
                      por <strong>{apertura.operatorName}</strong> a las{' '}
                      <strong>{formatTime(apertura.timestamp)}</strong>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">
                        Apertura pendiente de confirmación para {fecha}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmApertura}
                    disabled={isConfirmingApertura}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition shadow-sm disabled:opacity-60"
                  >
                    {isConfirmingApertura ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Confirmar Apertura
                  </button>
                </div>
              )}
            </div>
            {/* ── Subtotales por estado ── */}
            {posicion && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Compras completadas</div>
                  <div className="text-base font-extrabold text-green-600">{formatUSD(posicion.compras_completadas_usd)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Compras pendientes</div>
                  <div className="text-base font-extrabold text-yellow-600">{formatUSD(posicion.compras_pendientes_usd)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Ventas completadas</div>
                  <div className="text-base font-extrabold text-green-600">{formatUSD(posicion.ventas_completadas_usd)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Ventas pendientes</div>
                  <div className="text-base font-extrabold text-yellow-600">{formatUSD(posicion.ventas_pendientes_usd)}</div>
                </div>
              </div>
            )}

            {/* ── Tabla de operaciones ── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Header + Filtros */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <List className="w-4 h-4 text-gray-500" />
                    <h2 className="text-sm font-bold text-gray-800">Operaciones del Día</h2>
                    {criticalCount > 0 && (
                      <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        {criticalCount} crítica{criticalCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Type tabs */}
                    <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs font-semibold">
                      {(['todas', 'compras', 'ventas'] as TabOps[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTabOps(t)}
                          className={`px-3 py-1.5 rounded-md capitalize transition ${
                            tabOps === t ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {t === 'todas' && <List className="w-3 h-3 inline mr-1" />}
                          {t === 'compras' && <ArrowDownCircle className="w-3 h-3 inline mr-1 text-primary-500" />}
                          {t === 'ventas' && <ArrowUpCircle className="w-3 h-3 inline mr-1 text-orange-500" />}
                          {t}
                        </button>
                      ))}
                    </div>
                    {/* Status filter */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Filter className="w-3.5 h-3.5" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        <option value="all">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Completada">Completada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              {filteredOps.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No hay operaciones para los filtros seleccionados
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Código</th>
                        <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Cliente</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Tipo</th>
                        <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">USD</th>
                        <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">TC</th>
                        <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">PEN</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOps.map((op) => {
                        const badge = getStatusBadge(op.status);
                        return (
                          <tr
                            key={`${op.opType}-${op.id}`}
                            className={`transition ${
                              op.es_critica
                                ? 'bg-red-50/60 hover:bg-red-50'
                                : 'hover:bg-gray-50/60'
                            }`}
                          >
                            {/* Código */}
                            <td className="px-5 py-3 font-mono text-xs text-gray-500">
                              <div className="flex items-center gap-1.5">
                                {op.es_critica && (
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" aria-label={op.razon_critica || 'Crítica'} />
                                )}
                                {op.operation_id}
                              </div>
                              {op.es_critica && op.razon_critica && (
                                <div className="text-red-500 text-[10px] mt-0.5">{op.razon_critica}</div>
                              )}
                            </td>

                            {/* Cliente */}
                            <td className="px-3 py-3 text-gray-800 font-medium max-w-[140px] truncate">
                              {op.client_name}
                            </td>

                            {/* Tipo */}
                            <td className="px-3 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                op.opType === 'Compra'
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'bg-orange-50 text-orange-700'
                              }`}>
                                {op.opType === 'Compra'
                                  ? <ArrowDownCircle className="w-3 h-3" />
                                  : <ArrowUpCircle className="w-3 h-3" />
                                }
                                {op.opType}
                              </span>
                            </td>

                            {/* USD */}
                            <td className="px-3 py-3 text-right font-mono font-semibold text-gray-800">
                              ${op.amount_usd.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>

                            {/* TC */}
                            <td className="px-3 py-3 text-right font-mono text-gray-500 text-xs">
                              {op.exchange_rate.toFixed(4)}
                            </td>

                            {/* PEN */}
                            <td className="px-3 py-3 text-right font-mono font-semibold text-gray-700">
                              S/{op.amount_pen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>

                            {/* Estado */}
                            <td className="px-3 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {op.status}
                              </span>
                            </td>

                            {/* Hora */}
                            <td className="px-3 py-3 text-center text-xs text-gray-500 whitespace-nowrap">
                              <div>{formatTime(op.created_at)}</div>
                              {op.horas_transcurridas > 1 && (
                                <div className={`text-[10px] font-medium ${op.horas_transcurridas > 24 ? 'text-red-500' : 'text-gray-400'}`}>
                                  {op.horas_transcurridas.toFixed(0)}h
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Footer: totals */}
                    <tfoot>
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td colSpan={3} className="px-5 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                          Total ({filteredOps.length} operaciones)
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-extrabold text-gray-800 text-sm">
                          ${filteredOps.reduce((s, o) => s + o.amount_usd, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td />
                        <td className="px-3 py-2.5 text-right font-mono font-extrabold text-gray-700 text-sm">
                          S/{filteredOps.reduce((s, o) => s + o.amount_pen, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Conciliación ── */}
        {movementsSummary && totalDifferences && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Resumen de movimientos */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-800">Movimientos del Día</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                  {movementsSummary.completed_operations} ops completadas
                </span>
              </div>
              <div className="p-5 space-y-4">
                {/* USD */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">USD</span>
                    <span className={`text-sm font-extrabold font-mono ${movementsSummary.usd.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {movementsSummary.usd.net >= 0 ? '+' : ''}${movementsSummary.usd.net.toFixed(2)} neto
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-50 rounded-lg px-3 py-2">
                      <div className="text-green-600 font-semibold mb-0.5">Entradas (Compras)</div>
                      <div className="font-extrabold text-green-700 font-mono">${movementsSummary.usd.inflows.toFixed(2)}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg px-3 py-2">
                      <div className="text-red-600 font-semibold mb-0.5">Salidas (Ventas)</div>
                      <div className="font-extrabold text-red-600 font-mono">${movementsSummary.usd.outflows.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                {/* PEN */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">PEN</span>
                    <span className={`text-sm font-extrabold font-mono ${movementsSummary.pen.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {movementsSummary.pen.net >= 0 ? '+' : ''}S/{movementsSummary.pen.net.toFixed(2)} neto
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-50 rounded-lg px-3 py-2">
                      <div className="text-green-600 font-semibold mb-0.5">Entradas (Ventas)</div>
                      <div className="font-extrabold text-green-700 font-mono">S/{movementsSummary.pen.inflows.toFixed(2)}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg px-3 py-2">
                      <div className="text-red-600 font-semibold mb-0.5">Salidas (Compras)</div>
                      <div className="font-extrabold text-red-600 font-mono">S/{movementsSummary.pen.outflows.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diferencias totales */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-800">Conciliación Global</h2>
                {hasCriticalDiscrepancy ? (
                  <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Descuadre crítico
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Cuadrado
                  </span>
                )}
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-gray-500">
                  Diferencia entre saldo actual y saldo esperado (inicial + movimientos completados)
                </p>
                {/* USD diff */}
                <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  Math.abs(totalDifferences.usd) > 100 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Diferencia USD</div>
                    <div className="text-xs text-gray-500">Actual vs Esperado</div>
                  </div>
                  <div className={`text-xl font-extrabold font-mono ${
                    Math.abs(totalDifferences.usd) > 100 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {totalDifferences.usd >= 0 ? '+' : ''}${totalDifferences.usd.toFixed(2)}
                  </div>
                </div>
                {/* PEN diff */}
                <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  Math.abs(totalDifferences.pen) > 300 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Diferencia PEN</div>
                    <div className="text-xs text-gray-500">Actual vs Esperado</div>
                  </div>
                  <div className={`text-xl font-extrabold font-mono ${
                    Math.abs(totalDifferences.pen) > 300 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {totalDifferences.pen >= 0 ? '+' : ''}S/{totalDifferences.pen.toFixed(2)}
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Umbral crítico: USD &gt; $100 · PEN &gt; S/300
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Saldos Bancarios con Audit Trail ── */}
        {banks.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <h2 className="text-sm font-bold text-gray-800">Saldos Bancarios</h2>
                </div>
                <span className="text-xs text-gray-400">
                  Click en un saldo para editar
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Banco</th>
                    <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">USD Inicial</th>
                    <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">USD Actual</th>
                    <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Δ USD</th>
                    <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">PEN Inicial</th>
                    <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">PEN Actual</th>
                    <th className="text-right px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Δ PEN</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {banks.map((bank) => (
                    <tr key={bank.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-5 py-3.5 font-semibold text-gray-800">{bank.bank_name}</td>

                      {/* USD Inicial */}
                      <td className="px-3 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingBalance({
                              bankId: bank.id,
                              bankName: bank.bank_name,
                              currency: 'USD',
                              type: 'initial',
                              currentValue: bank.usd.initial,
                            });
                            setEditValue(bank.usd.initial.toString());
                          }}
                          className="text-gray-600 hover:text-primary-600 hover:underline font-mono transition"
                          title="Editar saldo inicial USD"
                        >
                          ${bank.usd.initial.toFixed(2)}
                        </button>
                      </td>

                      {/* USD Actual */}
                      <td className="px-3 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingBalance({
                              bankId: bank.id,
                              bankName: bank.bank_name,
                              currency: 'USD',
                              type: 'current',
                              currentValue: bank.usd.actual,
                            });
                            setEditValue(bank.usd.actual.toString());
                          }}
                          className="text-gray-600 hover:text-primary-600 hover:underline font-mono transition"
                          title="Editar saldo actual USD"
                        >
                          ${bank.usd.actual.toFixed(2)}
                        </button>
                      </td>

                      {/* Δ USD */}
                      <td className={`px-3 py-3.5 text-right font-semibold font-mono ${
                        bank.usd.difference > 0 ? 'text-green-600' : bank.usd.difference < 0 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {bank.usd.difference > 0 ? '+' : ''}{bank.usd.difference.toFixed(2)}
                      </td>

                      {/* PEN Inicial */}
                      <td className="px-3 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingBalance({
                              bankId: bank.id,
                              bankName: bank.bank_name,
                              currency: 'PEN',
                              type: 'initial',
                              currentValue: bank.pen.initial,
                            });
                            setEditValue(bank.pen.initial.toString());
                          }}
                          className="text-gray-600 hover:text-primary-600 hover:underline font-mono transition"
                          title="Editar saldo inicial PEN"
                        >
                          S/{bank.pen.initial.toFixed(2)}
                        </button>
                      </td>

                      {/* PEN Actual */}
                      <td className="px-3 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingBalance({
                              bankId: bank.id,
                              bankName: bank.bank_name,
                              currency: 'PEN',
                              type: 'current',
                              currentValue: bank.pen.actual,
                            });
                            setEditValue(bank.pen.actual.toString());
                          }}
                          className="text-gray-600 hover:text-primary-600 hover:underline font-mono transition"
                          title="Editar saldo actual PEN"
                        >
                          S/{bank.pen.actual.toFixed(2)}
                        </button>
                      </td>

                      {/* Δ PEN */}
                      <td className={`px-3 py-3.5 text-right font-semibold font-mono ${
                        bank.pen.difference > 0 ? 'text-green-600' : bank.pen.difference < 0 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {bank.pen.difference > 0 ? '+' : ''}{bank.pen.difference.toFixed(2)}
                      </td>

                      {/* Audit */}
                      <td className="px-3 py-3.5">
                        {bank.updated_by ? (
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">{bank.updated_by}</span>
                            {bank.updated_at && (
                              <div className="text-gray-400">{formatDateTime(bank.updated_at)}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-4" />
      </main>

      {/* ── Edit Balance Modal ── */}
      {editingBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Editar saldo {editingBalance.type === 'initial' ? 'inicial' : 'actual'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {editingBalance.bankName} — {editingBalance.currency}
            </p>

            <div className="mb-5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 block">
                Nuevo saldo ({editingBalance.currency})
              </label>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                step="0.01"
                min="0"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBalance();
                  if (e.key === 'Escape') setEditingBalance(null);
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-lg font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Valor anterior: {editingBalance.currency === 'USD' ? '$' : 'S/'}{editingBalance.currentValue.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setEditingBalance(null); setEditValue(''); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBalance}
                disabled={isSavingBalance}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSavingBalance ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
