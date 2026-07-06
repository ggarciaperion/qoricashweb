'use client';

import { useEffect, useState, useRef } from 'react';

function useCountUp(target: number, duration = 900, active = true) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!active) { setValue(target); return; }
    setValue(0);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(target * ease);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, active]);
  return value;
}
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { operationsApi } from '@/lib/api/operations';
import { parseSafeDate } from '@/lib/utils/date';
import type { Operation } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Building2,
  RefreshCw,
  Plus,
  ChevronDown,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────── */
const fmt$ = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtS = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s: string) =>
  (parseSafeDate(s) ?? new Date()).toLocaleDateString('es-PE', {
    timeZone: 'America/Lima', day: '2-digit', month: 'short', year: 'numeric',
  });
const fmtTime = (s: string) =>
  (parseSafeDate(s) ?? new Date()).toLocaleTimeString('es-PE', {
    timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit',
  });

/* ── status ──────────────────────────────────────────────────────── */
const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  pendiente:  { label: 'Pendiente',  bg: '#F59E0B', color: '#ffffff' },
  en_proceso: { label: 'En proceso', bg: '#3B82F6', color: '#ffffff' },
  completado: { label: 'Completado', bg: '#16A34A', color: '#ffffff' },
  cancelado:  { label: 'Cancelado',  bg: '#EF4444', color: '#ffffff' },
  rechazado:  { label: 'Rechazado',  bg: '#DC2626', color: '#ffffff' },
};

const BANK_REF = 3.700;


type Tab = 'todas' | 'activas' | 'completadas' | 'canceladas';
const PER_PAGE = 5;

export default function HistorialPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [ops, setOps]           = useState<Operation[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>('todas');
  const [page, setPage]         = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    (async () => {
      if (!user?.dni) return;
      setLoading(true);
      try {
        const r = await operationsApi.getMyOperations(user.dni);
        setOps(r.success && r.data ? r.data : []);
      } catch { setOps([]); }
      finally { setLoading(false); }
    })();
  }, [isAuthenticated]);

  useEffect(() => { setPage(1); setExpandedId(null); }, [tab]);

  const filtered = ops.filter(o => {
    if (tab === 'activas')     return o.estado === 'pendiente' || o.estado === 'en_proceso';
    if (tab === 'completadas') return o.estado === 'completado';
    if (tab === 'canceladas')  return o.estado === 'cancelado'  || o.estado === 'rechazado';
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ── stats ── */
  const completed    = ops.filter(o => o.estado === 'completado');
  const nActivas     = ops.filter(o => o.estado === 'pendiente' || o.estado === 'en_proceso').length;
  const volUSD       = completed.reduce((s, o) => s + (o.monto_dolares ?? 0), 0);
  const spreadProm   = completed.length
    ? completed.reduce((s, o) => s + ((o.tipo_cambio ?? 0) - BANK_REF), 0) / completed.length
    : 0;
  const rentabilidad = completed.reduce((s, o) =>
    s + ((o.tipo_cambio ?? 0) - BANK_REF) * (o.monto_dolares ?? 0), 0);

  const animVolUSD      = useCountUp(volUSD,       900, !loading);
  const animSpread      = useCountUp(spreadProm,    900, !loading);
  const animRent        = useCountUp(rentabilidad,  900, !loading);

  const TABS: { key: Tab; label: string; n: number }[] = [
    { key: 'todas',       label: 'Todas',       n: ops.length },
    { key: 'activas',     label: 'En curso',    n: nActivas },
    { key: 'completadas', label: 'Completadas', n: completed.length },
    { key: 'canceladas',  label: 'Canceladas',  n: ops.filter(o => o.estado === 'cancelado' || o.estado === 'rechazado').length },
  ];

  const handleRowClick = (op: Operation) => {
    if (op.estado === 'pendiente') {
      if (op.origen && op.origen !== 'web') { router.push(`/dashboard/operaciones/${op.id}`); return; }
      router.push(op.codigo_operacion
        ? `/dashboard/nueva-operacion?operation_id=${op.codigo_operacion}`
        : `/dashboard/operaciones/${op.id}`);
    } else {
      setExpandedId(prev => prev === op.id ? null : op.id);
    }
  };

  const isEmpresa = user?.document_type === 'RUC';

  const bgStyle = isEmpresa ? {
    backgroundImage: "url('/xc.webp')",
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
  } : {};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={isEmpresa ? bgStyle : { background: 'transparent' }}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#F1F5F9' }} />
        <div className="absolute inset-0 rounded-full border-2 border-t-primary-500 animate-spin" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-8 px-4" style={isEmpresa ? bgStyle : { background: 'transparent' }}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: isEmpresa ? '#ffffff' : '#0F172A' }}>
              Mis operaciones
            </h1>
            <p className="text-sm mt-0.5" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#94A3B8' }}>
              {ops.length} registro{ops.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          <button
            onClick={() => router.push(isEmpresa ? '/dashboard/empresa/nueva-operacion' : '/dashboard/nueva-operacion')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#22C55E', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#16A34A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#22C55E'; }}
          >
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Vol. cambiado */}
          <div
            className="rounded-2xl px-4 py-3.5 relative overflow-hidden"
            style={isEmpresa
              ? { background: 'linear-gradient(135deg, #4A6884 0%, #8fb8cc 100%)', boxShadow: '0 4px 20px rgba(74,104,132,0.35)' }
              : { background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid #1E293B' }}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.04)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Vol. cambiado
            </p>
            <p className="text-xl font-bold tabular-nums leading-tight text-white">
              $ {fmt$(animVolUSD)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>USD total</p>
          </div>

          {/* Spread */}
          <div
            className="rounded-2xl px-4 py-3.5 relative overflow-hidden"
            style={isEmpresa
              ? { background: 'linear-gradient(135deg, #4A6884 0%, #8fb8cc 100%)', boxShadow: '0 4px 20px rgba(74,104,132,0.35)' }
              : { background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', border: '1px solid #0E7490' }}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.07)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Spread
            </p>
            <p className="text-xl font-bold tabular-nums leading-tight text-white">
              +{animSpread.toFixed(3)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>S/$ vs banco</p>
          </div>

          {/* Rentabilidad acumulada */}
          <div
            className="rounded-2xl px-4 py-3.5 relative overflow-hidden"
            style={isEmpresa
              ? { background: 'linear-gradient(135deg, #4A6884 0%, #8fb8cc 100%)', boxShadow: '0 4px 20px rgba(74,104,132,0.35)' }
              : { background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)', border: '1px solid #15803D' }}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.07)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Rentabilidad acumulada
            </p>
            <p className="text-xl font-bold tabular-nums leading-tight text-white">
              S/ {fmtS(animRent)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>vs bancos</p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={isEmpresa
            ? { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(143,184,204,0.15)' }
            : { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition"
              style={tab === t.key
                ? isEmpresa
                  ? { background: 'rgba(74,104,132,0.35)', color: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }
                  : { background: 'rgba(255,255,255,0.3)', color: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                : { color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#94A3B8' }
              }
            >
              {t.label}
              {t.n > 0 && (
                <span
                  className="text-[9px] font-bold px-1.5 rounded-full tabular-nums"
                  style={tab === t.key
                    ? { background: '#F1F5F9', color: '#64748B' }
                    : { color: '#CBD5E1' }
                  }
                >
                  {t.n}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TABLE ── */}
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={isEmpresa
                ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(143,184,204,0.15)' }
                : { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <RefreshCw className="w-4 h-4" style={{ color: isEmpresa ? '#ffffff' : 'rgba(255,255,255,0.6)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: isEmpresa ? '#ffffff' : '#94A3B8' }}>Sin operaciones aquí</p>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={isEmpresa
              ? { border: '1px solid rgba(143,184,204,0.15)', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }
              : { border: '1px solid #E2E8F0' }}
          >

            {/* Table header */}
            <div
              className="grid items-center px-4 py-2.5"
              style={{
                gridTemplateColumns: '140px 1fr 1fr 80px 100px',
                background: isEmpresa ? 'rgba(13,27,42,0.5)' : 'rgba(255,255,255,0.12)',
                borderBottom: isEmpresa ? '1px solid rgba(143,184,204,0.12)' : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {['Tipo', 'Dólares', 'Soles', 'T.C.', 'Estado'].map(h => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#94A3B8' }}>
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            {rows.map((op, idx) => {
              const sc        = STATUS[op.estado] ?? STATUS.cancelado;
              const isCompra  = op.tipo === 'compra';
              const isOpen    = expandedId === op.id;
              const amtUSD    = op.monto_dolares ?? 0;
              const amtPEN    = op.monto_soles ?? 0;
              const ahorro    = ((op.tipo_cambio ?? 0) - BANK_REF) * amtUSD;
              const isClosed  = op.estado === 'cancelado' || op.estado === 'rechazado';

              return (
                <div
                  key={op.id}
                  style={{ borderBottom: idx < rows.length - 1 || isOpen ? `1px solid ${isEmpresa ? 'rgba(143,184,204,0.1)' : 'rgba(255,255,255,0.12)'}` : 'none' }}
                >
                  {/* Row */}
                  <div
                    className="grid items-center px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      gridTemplateColumns: '140px 1fr 1fr 80px 100px',
                      background: isEmpresa
                        ? (isOpen ? 'rgba(74,104,132,0.15)' : 'transparent')
                        : (isOpen ? 'rgba(255,255,255,0.1)' : 'transparent'),
                    }}
                    onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = isEmpresa ? 'rgba(74,104,132,0.1)' : 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    onClick={() => handleRowClick(op)}
                  >
                    {/* Col 1: tipo chip + fecha */}
                    <div className="flex flex-col gap-1">
                      <span
                        className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                        style={{
                          background: isCompra
                            ? 'linear-gradient(90deg, #0891B2, #0E7490)'
                            : 'linear-gradient(90deg, #22C55E, #16A34A)',
                        }}
                      >
                        {isCompra
                          ? <TrendingDown className="w-2.5 h-2.5" />
                          : <TrendingUp   className="w-2.5 h-2.5" />
                        }
                        {isCompra ? 'QoriCash Compra' : 'QoriCash Vende'}
                      </span>
                      <p className="text-[10px]" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#CBD5E1' }}>
                        {fmtDate(op.fecha_creacion)}
                      </p>
                    </div>

                    {/* Col 2: USD */}
                    <p className="text-sm font-semibold tabular-nums" style={{ color: isClosed ? (isEmpresa ? 'rgba(143,184,204,0.35)' : '#CBD5E1') : (isEmpresa ? '#ffffff' : '#0F172A') }}>
                      $ {fmt$(amtUSD)}
                    </p>

                    {/* Col 3: PEN */}
                    <p className="text-sm font-semibold tabular-nums"
                      style={{ color: isClosed ? (isEmpresa ? 'rgba(143,184,204,0.35)' : '#CBD5E1') : (isEmpresa ? '#8fb8cc' : (isCompra ? '#15803D' : '#1D4ED8')) }}>
                      S/ {fmtS(amtPEN)}
                    </p>

                    {/* Col 4: TC */}
                    <p className="text-sm tabular-nums" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#64748B' }}>
                      {(op.tipo_cambio ?? 0).toFixed(3)}
                    </p>

                    {/* Col 5: Estado + chevron */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                      <ChevronDown
                        className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                        style={{
                          color: '#CBD5E1',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Accordion detail */}
                  {isOpen && (
                    <div
                      className="px-4 pb-4 pt-2"
                      style={isEmpresa
                        ? { background: 'rgba(13,27,42,0.3)', borderTop: '1px solid rgba(143,184,204,0.1)' }
                        : { background: 'rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {/* Código */}
                        <div className="rounded-xl px-3 py-2.5"
                          style={isEmpresa
                            ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.12)' }
                            : { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                          <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#CBD5E1' }}>Código</p>
                          <p className="text-xs font-semibold mt-1" style={{ color: isEmpresa ? '#ffffff' : '#475569' }}>
                            {op.codigo_operacion ?? `#${op.id}`}
                          </p>
                        </div>

                        {/* Hora */}
                        <div className="rounded-xl px-3 py-2.5"
                          style={isEmpresa
                            ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.12)' }
                            : { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                          <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#CBD5E1' }}>Hora</p>
                          <p className="text-xs font-semibold mt-1" style={{ color: isEmpresa ? '#ffffff' : '#475569' }}>
                            {fmtTime(op.fecha_creacion)}
                          </p>
                        </div>

                        {/* Banco */}
                        {op.banco_cliente && (
                          <div className="rounded-xl px-3 py-2.5 flex items-center gap-2"
                            style={isEmpresa
                              ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.12)' }
                              : { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                            <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#CBD5E1' }} />
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#CBD5E1' }}>Banco</p>
                              <p className="text-xs font-semibold mt-0.5" style={{ color: isEmpresa ? '#ffffff' : '#475569' }}>{op.banco_cliente}</p>
                            </div>
                          </div>
                        )}

                        {/* Ahorro */}
                        {op.estado === 'completado' && (
                          <div className="rounded-xl px-3 py-2.5"
                            style={isEmpresa
                              ? { background: 'rgba(74,104,132,0.2)', border: '1px solid rgba(143,184,204,0.2)' }
                              : { background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#86EFAC' }}>Ahorraste</p>
                            <p className="text-xs font-bold tabular-nums mt-1" style={{ color: isEmpresa ? '#8fb8cc' : '#15803D' }}>
                              S/ {fmtS(ahorro)} vs banco
                            </p>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        onClick={e => { e.stopPropagation(); router.push(`/dashboard/operaciones/${op.id}`); }}
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#94A3B8' }}
                        onMouseEnter={e => { e.currentTarget.style.color = isEmpresa ? '#ffffff' : '#0F172A'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = isEmpresa ? 'rgba(143,184,204,0.6)' : '#94A3B8'; }}
                      >
                        Ver detalle completo <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px]" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#CBD5E1' }}>
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-25"
                style={isEmpresa
                  ? { border: '1px solid rgba(143,184,204,0.2)', color: 'rgba(143,184,204,0.6)', background: 'rgba(255,255,255,0.05)' }
                  : { border: '1px solid #E2E8F0', color: '#94A3B8' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L5 7l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#64748B' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-25"
                style={isEmpresa
                  ? { border: '1px solid rgba(143,184,204,0.2)', color: 'rgba(143,184,204,0.6)', background: 'rgba(255,255,255,0.05)' }
                  : { border: '1px solid #E2E8F0', color: '#94A3B8' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3L9 7l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
