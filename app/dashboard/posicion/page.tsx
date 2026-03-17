'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { positionApi } from '@/lib/api/position';
import type { PositionData, BankRow, PositionApiResponse, ReconciliationApiResponse } from '@/lib/api/position';
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

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PosicionPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [fecha, setFecha] = useState(getTodayPeru());
  const [posicion, setPosicion] = useState<PositionData | null>(null);
  const [banks, setBanks] = useState<BankRow[]>([]);
  const [hasCriticalDiscrepancy, setHasCriticalDiscrepancy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      if (posRes.success) setPosicion(posRes.posicion);
      if (reconRes.success) {
        setBanks(reconRes.banks);
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

  // ── Render helpers ──

  if (!isAuthenticated || !user || !ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

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
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 text-gray-700"
              />
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
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
          </>
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
