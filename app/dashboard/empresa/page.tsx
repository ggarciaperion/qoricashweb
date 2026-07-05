'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { operationsApi } from '@/lib/api/operations';
import { parseSafeDate } from '@/lib/utils/date';
import type { Operation } from '@/lib/types';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  Activity,
  ChevronRight,
  Zap,
  Phone,
  MessageCircle,
} from 'lucide-react';

const fmt$ = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (s: string) =>
  (parseSafeDate(s) ?? new Date()).toLocaleDateString('es-PE', {
    timeZone: 'America/Lima', day: '2-digit', month: 'short', year: '2-digit',
  });

const STATUS: Record<string, { label: string; dot: string; pill: string }> = {
  pendiente:  { label: 'Pendiente',  dot: 'bg-amber-400 animate-pulse', pill: 'bg-amber-50 text-amber-700 border border-amber-200' },
  en_proceso: { label: 'En proceso', dot: 'bg-blue-400 animate-pulse',  pill: 'bg-blue-50 text-blue-700 border border-blue-200'   },
  completado: { label: 'Completado', dot: 'bg-emerald-500',             pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  cancelado:  { label: 'Cancelado',  dot: 'bg-gray-400',               pill: 'bg-gray-100 text-gray-500 border border-gray-200'   },
  rechazado:  { label: 'Rechazado',  dot: 'bg-rose-500',               pill: 'bg-rose-50 text-rose-700 border border-rose-200'    },
};

export default function EmpresaDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { currentRates } = useExchangeStore();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [stats, setStats] = useState<{ total_ops: number; total_usd: number; total_pen: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.document_type !== 'RUC') { router.replace('/dashboard'); return; }
    loadData();
  }, [isAuthenticated, user?.document_type]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [ops, st] = await Promise.all([
        operationsApi.getAll(),
        operationsApi.getStats().catch(() => null),
      ]);
      setOperations(Array.isArray(ops) ? ops : []);
      setStats(st);
    } catch {
      setOperations([]);
    } finally {
      setIsLoading(false);
    }
  }

  const companyName = user?.razon_social || user?.nombres || 'Empresa';
  const initials = companyName.slice(0, 2).toUpperCase();
  const recentOps = operations.slice(0, 5);
  const pendingCount = operations.filter(o => o.status === 'pendiente' || o.status === 'en_proceso').length;

  const compra = currentRates?.tipo_compra ?? 0;
  const venta = currentRates?.tipo_venta ?? 0;

  return (
    <div className="min-h-full" style={{ backgroundImage: "url('/xc.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>

      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-6 py-4 md:px-10 md:py-5"
        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(143,184,204,0.1)' }}
      >

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 flex-1">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-black shrink-0"
              style={{ background: 'linear-gradient(135deg, #4A6884, #8fb8cc)', boxShadow: '0 4px 16px rgba(74,104,132,0.4)' }}
            >
              {initials}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] mb-1" style={{ color: 'rgba(143,184,204,0.7)' }}>
                Panel Corporativo
              </p>
              <h1 className="text-base md:text-lg font-black text-white leading-tight truncate max-w-xs md:max-w-sm">
                {companyName}
              </h1>
              {user?.dni && (
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>RUC {user.dni}</p>
              )}
            </div>
          </div>

          {/* TC en vivo */}
          <div
            className="flex flex-col gap-2 px-4 py-3 rounded-2xl shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(143,184,204,0.18)', backdropFilter: 'blur(12px)' }}
          >
            {/* En vivo badge */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4ade80' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#22c55e' }} />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#4ade80' }}>En vivo</span>
            </div>
            {/* Rates */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(143,184,204,0.6)' }}>Compramos</p>
                <p className="text-lg font-black text-white">S/ {compra.toFixed(3)}</p>
              </div>
              <div className="w-px h-10" style={{ background: 'rgba(143,184,204,0.2)' }} />
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(143,184,204,0.6)' }}>Vendemos</p>
                <p className="text-lg font-black" style={{ color: '#8fb8cc' }}>S/ {venta.toFixed(3)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8 space-y-6">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: RefreshCw,
              label: 'Operaciones',
              value: isLoading ? '—' : String(stats?.total_ops ?? operations.length),
              sub: 'total realizadas',
              color: '#4A6884',
              bg: 'rgba(74,104,132,0.08)',
            },
            {
              icon: DollarSign,
              label: 'USD Operados',
              value: isLoading ? '—' : `$ ${fmt$(stats?.total_usd ?? 0)}`,
              sub: 'acumulado',
              color: '#16a34a',
              bg: 'rgba(22,163,74,0.07)',
            },
            {
              icon: Activity,
              label: 'En Proceso',
              value: isLoading ? '—' : String(pendingCount),
              sub: 'operaciones activas',
              color: '#d97706',
              bg: 'rgba(217,119,6,0.07)',
            },
            {
              icon: CheckCircle,
              label: 'Completadas',
              value: isLoading ? '—' : String(operations.filter(o => o.status === 'completado').length),
              sub: 'operaciones',
              color: '#0ea5e9',
              bg: 'rgba(14,165,233,0.07)',
            },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="rounded-2xl p-4 md:p-5"
              style={{ background: 'linear-gradient(135deg, #4A6884 0%, #8fb8cc 100%)', boxShadow: '0 4px 20px rgba(74,104,132,0.35)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xl md:text-2xl font-black text-white">{value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS + RECENT OPS ── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Quick actions */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: 'rgba(30,41,59,0.4)' }}>Acciones rápidas</p>

            <Link
              href="/dashboard/empresa/nueva-operacion"
              className="flex items-center justify-between px-4 py-4 rounded-2xl transition-all group"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(143,184,204,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(143,184,204,0.12)' }}>
                  <RefreshCw className="w-4 h-4" style={{ color: '#8fb8cc' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Nueva Operación</p>
                  <p className="text-[11px]" style={{ color: 'rgba(143,184,204,0.6)' }}>Iniciar cambio de divisas</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(143,184,204,0.5)' }} />
            </Link>

            <Link
              href="/dashboard/historial"
              className="flex items-center justify-between px-4 py-4 rounded-2xl transition-all group"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(143,184,204,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(143,184,204,0.12)' }}>
                  <Clock className="w-4 h-4" style={{ color: '#8fb8cc' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Historial</p>
                  <p className="text-[11px]" style={{ color: 'rgba(143,184,204,0.6)' }}>Ver todas las operaciones</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(143,184,204,0.5)' }} />
            </Link>

            <Link
              href="/dashboard/cuentas-bancarias"
              className="flex items-center justify-between px-4 py-4 rounded-2xl transition-all group"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(143,184,204,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(143,184,204,0.12)' }}>
                  <Building2 className="w-4 h-4" style={{ color: '#8fb8cc' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Cuentas Bancarias</p>
                  <p className="text-[11px]" style={{ color: 'rgba(143,184,204,0.6)' }}>Gestionar cuentas empresa</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(143,184,204,0.5)' }} />
            </Link>

            {/* Contacto ejecutivo */}
            <div
              className="px-4 py-4 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)', border: '1px solid rgba(143,184,204,0.18)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5" style={{ color: '#8fb8cc' }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#8fb8cc' }}>Trader asignado</p>
              </div>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Importe mayor a $ 5mil?
              </p>
              <a
                href="https://wa.me/51926011920?text=Hola%2C%20soy%20cliente%20corporativo%20de%20QoriCash%20y%20necesito%20cotizar%20una%20operaci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                style={{ background: 'rgba(143,184,204,0.12)', color: '#8fb8cc', border: '1px solid rgba(143,184,204,0.2)' }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Cotizar por WhatsApp
              </a>
            </div>
          </div>

          {/* Recent operations */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest px-1" style={{ color: 'rgba(30,41,59,0.4)' }}>Operaciones recientes</p>
              <Link href="/dashboard/historial" className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: '#4A6884' }}>
                Ver todas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(143,184,204,0.1)' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(74,104,132,0.3)', borderTopColor: '#4A6884' }} />
                </div>
              ) : recentOps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(74,104,132,0.08)' }}>
                    <Activity className="w-5 h-5" style={{ color: '#4A6884' }} />
                  </div>
                  <p className="text-sm font-semibold mb-1 text-white">Sin operaciones aún</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Tu historial de operaciones aparecerá aquí</p>
                  <Link
                    href="/dashboard/empresa/nueva-operacion"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-80"
                    style={{ background: 'linear-gradient(135deg, #0D1B2A, #1a3353)' }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Iniciar operación
                  </Link>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(30,41,59,0.06)' }}>
                      {['Fecha', 'Tipo', 'Monto', 'Estado'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(30,41,59,0.35)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOps.map((op, i) => {
                      const st = STATUS[op.status] ?? STATUS.pendiente;
                      const isCompra = op.operation_type === 'compra';
                      return (
                        <tr
                          key={op.id}
                          style={{ borderBottom: i < recentOps.length - 1 ? '1px solid rgba(30,41,59,0.05)' : 'none' }}
                        >
                          <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(30,41,59,0.5)' }}>
                            {fmtDate(op.created_at)}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              {isCompra
                                ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                : <TrendingDown className="w-3.5 h-3.5 text-blue-500" />}
                              <span className="text-xs font-semibold capitalize" style={{ color: '#0D1B2A' }}>
                                {isCompra ? 'Compra' : 'Venta'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs font-bold" style={{ color: '#0D1B2A' }}>
                              $ {fmt$(op.amount_usd ?? 0)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
