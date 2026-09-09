'use client';

import { useEffect, useState, useRef } from 'react';
import { useOperationEventStore } from '@/lib/store/operationEventStore';

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

  const { lastEvent } = useOperationEventStore();
  const lastEventRef = useRef<typeof lastEvent>(null);

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

  // Actualización en tiempo real: cuando llega un evento de operación, actualizar el estado en la lista
  useEffect(() => {
    if (!lastEvent) return;
    if (lastEventRef.current?.timestamp === lastEvent.timestamp) return;
    lastEventRef.current = lastEvent;

    setOps(prev => prev.map(op => {
      const matchById   = op.id === lastEvent.id;
      const matchByCode = op.codigo_operacion === lastEvent.operation_id;
      if (!matchById && !matchByCode) return op;
      return { ...op, estado: lastEvent.status_key };
    }));
  }, [lastEvent]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const rentabilidad = Math.abs(completed.reduce((s, o) =>
    s + ((o.tipo_cambio ?? 0) - BANK_REF) * (o.monto_dolares ?? 0), 0));

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



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'transparent' }}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#F1F5F9' }} />
        <div className="absolute inset-0 rounded-full border-2 border-t-primary-500 animate-spin" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-4 sm:py-8 px-3 sm:px-4" style={{ background: 'transparent' }}>
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: '#0D1117' }}>
              Mis operaciones
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              {ops.length} registro{ops.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          <button
            onClick={() => router.push(isEmpresa ? '/dashboard/empresa/nueva-operacion' : '/dashboard/nueva-operacion')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#0A0A0A', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1f1f1f'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; }}
          >
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Vol. cambiado */}
          <div
            className="rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 relative overflow-hidden"
            style={{ background: '#0A0A0A', boxShadow: '0 4px 20px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.06)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Vol. cambiado
            </p>
            <p className="text-sm font-bold tabular-nums leading-tight text-white whitespace-nowrap">
              $ {fmt$(animVolUSD)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>USD total</p>
          </div>

          {/* Spread */}
          <div
            className="rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 relative overflow-hidden"
            style={{ background: '#0A0A0A', boxShadow: '0 4px 20px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.07)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Spread
            </p>
            <p className="text-sm font-bold tabular-nums leading-tight text-white whitespace-nowrap">
              +{animSpread.toFixed(3)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>S/$ vs banco</p>
          </div>

          {/* Rentabilidad acumulada */}
          <div
            className="rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 relative overflow-hidden"
            style={{ background: '#2563EB', boxShadow: '0 4px 20px rgba(37,99,235,0.35)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.07)' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Rentabilidad acumulada
            </p>
            <p className="text-sm font-bold tabular-nums leading-tight text-white whitespace-nowrap">
              S/ {fmtS(animRent)}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>vs bancos</p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: '#F1F5F9', border: '1px solid rgba(0,0,0,0.06)' }}
        >
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition"
              style={tab === t.key ? { background: '#ffffff', color: '#0D1117', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : { color: '#6B7280' }}
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
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <RefreshCw className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Sin operaciones aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
          <div
            className="historial-table-wrap min-w-[380px] rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >

            {/* Table header */}
            <div
              className="historial-grid grid items-center px-3 py-2.5"
              style={{
                gridTemplateColumns: '88px 1fr 1fr 44px 76px',
                background: '#F8FAFC',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {['Tipo', 'Dólares', 'Soles', 'T.C.', 'Estado'].map(h => (
                <p key={h} className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
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
                  style={{ borderBottom: idx < rows.length - 1 || isOpen ? `1px solid ${'rgba(0,0,0,0.06)'}` : 'none' }}
                >
                  {/* Row */}
                  <div
                    className="historial-grid grid items-center px-3 py-3 cursor-pointer transition-colors"
                    style={{
                      gridTemplateColumns: '88px 1fr 1fr 44px 76px',
                      background: isOpen ? 'rgba(0,0,0,0.03)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    onClick={() => handleRowClick(op)}
                  >
                    {/* Col 1: tipo chip + fecha */}
                    <div className="flex flex-col gap-1">
                      <span
                        className="inline-flex items-center self-start px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                        style={{ background: isCompra ? '#16A34A' : '#2563EB' }}
                      >
                        {isCompra ? 'Compra' : 'Venta'}
                      </span>
                      <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
                        {fmtDate(op.fecha_creacion)}
                      </p>
                    </div>

                    {/* Col 2: USD */}
                    <p className="text-xs font-semibold tabular-nums" style={{ color: isClosed ? ('rgba(0,0,0,0.25)') : ('#0D1117') }}>
                      $ {fmt$(amtUSD)}
                    </p>

                    {/* Col 3: PEN */}
                    <p className="text-xs font-semibold tabular-nums"
                      style={{ color: isClosed ? ('rgba(0,0,0,0.25)') : ('#374151') }}>
                      S/ {fmtS(amtPEN)}
                    </p>

                    {/* Col 4: TC */}
                    <p className="text-xs tabular-nums" style={{ color: '#6B7280' }}>
                      {(op.tipo_cambio ?? 0).toFixed(3)}
                    </p>

                    {/* Col 5: Estado + chevron */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}
                      >
                        {sc.label}
                      </span>
                      <ChevronDown
                        className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                        style={{
                          color: '#9CA3AF',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Accordion detail */}
                  {isOpen && (
                    <div
                      className="px-4 pb-4 pt-2"
                      style={{ background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
                        {/* Código */}
                        <div className="rounded-xl px-2 py-2 min-w-0"
                          style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Código</p>
                          <p className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#0D1117' }}>
                            {op.codigo_operacion ?? `#${op.id}`}
                          </p>
                        </div>

                        {/* Hora */}
                        <div className="rounded-xl px-2 py-2 min-w-0"
                          style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Hora</p>
                          <p className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#0D1117' }}>
                            {fmtTime(op.fecha_creacion)}
                          </p>
                        </div>

                        {/* Banco destino */}
                        <div className="rounded-xl px-2 py-2 min-w-0"
                          style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Banco</p>
                          <p className="text-[10px] font-semibold mt-0.5 truncate" style={{ color: '#0D1117' }}>
                            {op.destination_bank_name || op.banco_cliente || op.source_bank_name || '—'}
                          </p>
                        </div>

                        {/* Ahorro */}
                        <div className="rounded-xl px-2 py-2 min-w-0"
                          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                          <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(134,239,172,0.8)' }}>Ahorro</p>
                          <p className="text-[10px] font-bold tabular-nums mt-0.5 truncate" style={{ color: '#86EFAC' }}>
                            {op.estado === 'completado' ? `S/ ${fmtS(ahorro)}` : '—'}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={e => { e.stopPropagation(); router.push(`/dashboard/operaciones/${op.id}`); }}
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: '#6B7280' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#0D1117'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; }}
                      >
                        Ver detalle completo <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px]" style={{ color: '#6B7280' }}>
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-25"
                style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#374151', background: '#ffffff' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L5 7l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: '#374151' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-25"
                style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#374151', background: '#ffffff' }}
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
