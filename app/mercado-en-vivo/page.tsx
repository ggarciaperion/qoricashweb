'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Activity, Clock,
  ArrowLeft, ChevronUp, ChevronDown, Target,
  Zap, BarChart2, ArrowRight, Shield, RefreshCw,
  DollarSign, Users, Layers,
} from 'lucide-react';
import { useExchangeStore } from '@/lib/store/exchangeStore';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Candle {
  time: number; open: number; high: number; low: number; close: number; volume: number;
}
interface OrderRow {
  id: number; price: number; amount: number; total: number; pct: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Precio medio de referencia — velas y líneas se anclan aquí
const SIM_MID    = 3.3950;
const SIM_SPREAD = 0.0030;
const SIM_COMPRA = SIM_MID - SIM_SPREAD / 2;  // 3.3935
const SIM_VENTA  = SIM_MID + SIM_SPREAD / 2;  // 3.3965

// ── Helpers ───────────────────────────────────────────────────────────────────

const rnd = (min: number, max: number) => min + Math.random() * (max - min);
const fmt4 = (n: number) => (n ?? 0).toFixed(4);
const fmt2 = (n: number) => (n ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function buildCandles(count: number, base: number): Candle[] {
  const out: Candle[] = [];
  let price = base;
  const now = Math.floor(Date.now() / 1000);
  for (let i = count - 1; i >= 0; i--) {
    const open  = price;
    const chg   = (Math.random() - 0.50) * 0.0035;
    const close = parseFloat((open + chg).toFixed(4));
    const sp    = Math.random() * 0.001;
    const high  = parseFloat((Math.max(open, close) + sp * 0.7).toFixed(4));
    const low   = parseFloat((Math.min(open, close) - sp * 0.3).toFixed(4));
    out.push({ time: now - i * 60, open, high, low, close, volume: Math.floor(rnd(3000, 90000)) });
    price = close;
  }
  return out;
}

// ── Sistema de Regímenes ──────────────────────────────────────────────────────
// Cada línea alterna entre fases con probabilidades distintas para simular
// movimiento realista: tramos rectos, subidas, bajadas, movimientos fuertes.

const REGIMES = [
  { name: 'flat',        weight: 20, drift:  0,        noise: 0.0001, durMin: 8,  durMax: 18 },
  { name: 'up',          weight: 30, drift: +0.00035,  noise: 0.0003, durMin: 5,  durMax: 12 },
  { name: 'down',        weight: 30, drift: -0.00035,  noise: 0.0003, durMin: 5,  durMax: 12 },
  { name: 'up_strong',   weight: 10, drift: +0.00080,  noise: 0.0004, durMin: 3,  durMax: 7  },
  { name: 'down_strong', weight: 10, drift: -0.00080,  noise: 0.0004, durMin: 3,  durMax: 7  },
] as const;

type RegimeName = typeof REGIMES[number]['name'];
interface RegimeState { name: RegimeName; ticks: number; max: number; }

function pickRegime(): RegimeState {
  const total = REGIMES.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const reg of REGIMES) {
    roll -= reg.weight;
    if (roll <= 0) return { name: reg.name, ticks: 0, max: Math.floor(rnd(reg.durMin, reg.durMax)) };
  }
  return { name: 'flat', ticks: 0, max: 12 };
}

function applyRegime(state: RegimeState, price: number, anchor: number): [number, RegimeState] {
  const next = state.ticks >= state.max ? pickRegime() : { ...state, ticks: state.ticks + 1 };
  const reg  = REGIMES.find(r => r.name === next.name)!;
  const newP = parseFloat((price + reg.drift + (Math.random() - 0.5) * reg.noise + (anchor - price) * 0.02).toFixed(4));
  return [newP, next];
}

// Historial de inicio generado con el mismo sistema de regímenes
function buildRateWithRegimes(count: number, startPrice: number, anchor: number): number[] {
  const out: number[] = [];
  let p     = startPrice;
  let state = pickRegime();
  for (let i = 0; i < count; i++) {
    const [newP, newState] = applyRegime(state, p, anchor);
    p = newP; state = newState;
    out.push(p);
  }
  return out;
}

function buildOrders(mid: number, side: 'buy' | 'sell', levels = 12): OrderRow[] {
  const rows: OrderRow[] = [];
  let maxT = 0;
  for (let i = 0; i < levels; i++) {
    const offset = side === 'buy' ? -(i * 0.00025 + rnd(0, 0.00015)) : (i * 0.00025 + rnd(0, 0.00015));
    const price  = parseFloat((mid + offset).toFixed(4));
    const amount = parseFloat(rnd(800, 42000).toFixed(0));
    const total  = parseFloat((price * amount).toFixed(2));
    maxT = Math.max(maxT, total);
    rows.push({ id: i, price, amount, total, pct: 0 });
  }
  return rows.map(r => ({ ...r, pct: (r.total / maxT) * 100 }));
}

// ── SVG Candlestick Chart ─────────────────────────────────────────────────────

function CandlestickChart({
  candles, compra, venta, timeframe, compraHist, ventaHist,
}: {
  candles: Candle[]; compra: number; venta: number; timeframe: string;
  compraHist: number[]; ventaHist: number[];
}) {
  const W = 900; const H = 380;
  const P = { t: 20, r: 82, b: 36, l: 6 };
  const cW = W - P.l - P.r; const cH = H - P.t - P.b;
  const vis = candles.slice(-50); // menos velas → más anchas y visibles

  // Candles use raw data — compra/venta lines are the ones that animate smoothly
  const visSmooth = vis;

  // Rango Y fijo centrado en SIM_MID — evita el auto-escala que aplasta todo
  // Con ±0.012 los movimientos de velas y líneas llenan toda la altura del gráfico
  const HALF_RANGE = 0.012;
  const minP = SIM_MID - HALF_RANGE;
  const maxP = SIM_MID + HALF_RANGE;
  const range = maxP - minP || 0.001;
  const toY = (p: number) => P.t + ((maxP - p) / range) * cH;
  const bw  = (cW / vis.length) * 0.6;
  const toX = (i: number) => P.l + ((i + 0.5) / vis.length) * cW;

  const ySteps = 6;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => minP + (range * i) / ySteps);
  const xLabels = vis.map((c, i) => ({ i, t: c.time })).filter((_, i) => i % 14 === 0);
  const last = visSmooth[visSmooth.length - 1];
  const lastColor = last && last.close >= last.open ? '#22C55E' : '#ef4444';
  const lastX = toX(vis.length - 1);
  const lastY = last ? toY(last.close) : P.t;

  // Close price path for line overlay
  const linePts = visSmooth
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(2)},${toY(c.close).toFixed(2)}`)
    .join(' ');
  const areaPath = `${linePts} L${lastX.toFixed(2)},${(P.t + cH).toFixed(2)} L${toX(0).toFixed(2)},${(P.t + cH).toFixed(2)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cgBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1628" />
          <stop offset="100%" stopColor="#080c16" />
        </linearGradient>
        <clipPath id="cgClip">
          <rect x={P.l} y={P.t} width={cW} height={cH} />
        </clipPath>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lastColor} stopOpacity="0.14" />
          <stop offset="75%" stopColor={lastColor} stopOpacity="0.03" />
          <stop offset="100%" stopColor={lastColor} stopOpacity="0" />
        </linearGradient>
        {/* Glow filter for live candle */}
        <filter id="glowSoft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Strong glow for the dot */}
        <filter id="glowDot" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#cgBg)" />

      {/* Grid */}
      {yLabels.map((p, i) => (
        <line key={i} x1={P.l} y1={toY(p)} x2={P.l + cW} y2={toY(p)}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {xLabels.map(({ i }) => (
        <line key={i} x1={toX(i)} y1={P.t} x2={toX(i)} y2={P.t + cH}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      <g clipPath="url(#cgClip)">
        {/* Area fill under close line */}
        <path d={areaPath} fill="url(#areaGrad)" />


        {/* Historical candles (all except last) */}
        {visSmooth.slice(0, -1).map((c, i) => {
          const isUp = c.close >= c.open;
          const col  = isUp ? '#22C55E' : '#ef4444';
          const bTop = toY(Math.max(c.open, c.close));
          const bH   = Math.max(1.5, Math.abs(toY(c.open) - toY(c.close)));
          return (
            <g key={i}>
              <line x1={toX(i)} y1={toY(c.high)} x2={toX(i)} y2={toY(c.low)}
                stroke={col} strokeWidth="1" opacity="0.65" />
              <rect x={toX(i) - bw / 2} y={bTop} width={bw} height={bH}
                fill={col} fillOpacity={isUp ? 0.8 : 0.65} rx="1" />
            </g>
          );
        })}

        {/* Live candle — highlighted with glow */}
        {last && (() => {
          const i   = vis.length - 1;
          const isUp = last.close >= last.open;
          const col  = isUp ? '#22C55E' : '#ef4444';
          const bTop = toY(Math.max(last.open, last.close));
          const bH   = Math.max(2, Math.abs(toY(last.open) - toY(last.close)));
          return (
            <g filter="url(#glowSoft)">
              <line x1={lastX} y1={toY(last.high)} x2={lastX} y2={toY(last.low)}
                stroke={col} strokeWidth="1.5" opacity="1" />
              <rect x={lastX - bw / 2} y={bTop} width={bw} height={bH}
                fill={col} fillOpacity="1" rx="1.5" />
            </g>
          );
        })()}

        {/* Close price line overlay */}
        <path d={linePts} fill="none" stroke={lastColor} strokeWidth="0.9" opacity="0.35"
          strokeLinejoin="round" strokeLinecap="round" />

        {/* QoriCash Compra — wavy path */}
        {compraHist.length > 1 && (() => {
          const pts = compraHist.slice(-vis.length);
          const aligned = vis.map((_, i) => {
            const hi = Math.min(Math.round(i * pts.length / vis.length), pts.length - 1);
            return pts[hi] ?? compra;
          });
          aligned[aligned.length - 1] = compra;
          const d = aligned.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ');
          return <path d={d} fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.85" strokeLinejoin="round" />;
        })()}

        {/* QoriCash Venta — wavy path */}
        {ventaHist.length > 1 && (() => {
          const pts = ventaHist.slice(-vis.length);
          const aligned = vis.map((_, i) => {
            const hi = Math.min(Math.round(i * pts.length / vis.length), pts.length - 1);
            return pts[hi] ?? venta;
          });
          aligned[aligned.length - 1] = venta;
          const d = aligned.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ');
          return <path d={d} fill="none" stroke="#22C55E" strokeWidth="1.5" opacity="0.85" strokeLinejoin="round" />;
        })()}

        {/* Last price horizontal dashed guide */}
        <line x1={P.l} y1={lastY} x2={P.l + cW} y2={lastY}
          stroke={lastColor} strokeWidth="0.8" strokeDasharray="2,3" opacity="0.5" />

        {/* Pulsing ring at live price point */}
        <circle cx={lastX} cy={lastY} r="6" fill={lastColor} opacity="0">
          <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Outer ring */}
        <circle cx={lastX} cy={lastY} r="4.5" fill="none" stroke={lastColor} strokeWidth="1" opacity="0.5">
          <animate attributeName="r" values="4.5;8;4.5" dur="2s" repeatCount="indefinite" begin="0.3s" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" begin="0.3s" />
        </circle>
        {/* Core dot */}
        <circle cx={lastX} cy={lastY} r="3.5" fill={lastColor} filter="url(#glowDot)" />
        <circle cx={lastX} cy={lastY} r="1.8" fill="white" opacity="0.95" />
      </g>

      {/* Right axis — pills para compra, venta y last price */}
      {last && (() => {
        const axX    = P.l + cW + 2;
        const axW    = P.r - 4;
        const axMid  = P.l + cW + P.r / 2;
        const compraY = toY(compra);
        const ventaY  = toY(venta);
        return (
          <>
            {/* Compra pill */}
            <rect x={axX} y={compraY - 8} width={axW} height={16} fill="rgba(96,165,250,0.18)" rx="3" />
            <text x={axMid} y={compraY + 4} fill="#60A5FA" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              {fmt4(compra)}
            </text>
            {/* Venta pill */}
            <rect x={axX} y={ventaY - 8} width={axW} height={16} fill="rgba(34,197,94,0.18)" rx="3" />
            <text x={axMid} y={ventaY + 4} fill="#22C55E" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              {fmt4(venta)}
            </text>
            {/* Last price pill (solid) */}
            <rect x={axX} y={lastY - 9} width={axW} height={17} fill={lastColor} rx="3.5" />
            <text x={axMid} y={lastY + 4} fill="white" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              {fmt4(last.close)}
            </text>
          </>
        );
      })()}

      {/* Y axis labels */}
      {yLabels.map((p, i) => (
        <text key={i} x={P.l + cW + 4} y={toY(p) + 3}
          fill="rgba(255,255,255,0.25)" fontSize="8.5">
          {fmt4(p)}
        </text>
      ))}

      {/* X axis labels */}
      {xLabels.map(({ i, t }) => (
        <text key={i} x={toX(i)} y={H - 8}
          fill="rgba(255,255,255,0.22)" fontSize="8.5" textAnchor="middle">
          {new Date(t * 1000).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
        </text>
      ))}
    </svg>
  );
}

// ── Order Book ─────────────────────────────────────────────────────────────────

function OrderBook({ buys, sells }: { buys: OrderRow[]; sells: OrderRow[] }) {
  return (
    <div className="flex gap-3 h-full">
      {/* Compradores */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400">Compradores</span>
        </div>
        <div className="grid grid-cols-3 text-[9px] text-white/30 font-bold uppercase tracking-wider mb-2 px-1">
          <span>Precio</span><span className="text-center">Monto USD</span><span className="text-right">Total PEN</span>
        </div>
        <div className="space-y-0.5">
          {buys.map(row => (
            <div key={row.id} className="relative grid grid-cols-3 text-[11px] px-1 py-0.5 rounded overflow-hidden">
              <div className="absolute inset-y-0 right-0 bg-blue-500/10 rounded"
                style={{ width: `${row.pct}%` }} />
              <span className="relative font-bold text-blue-400 tabular-nums">{fmt4(row.price)}</span>
              <span className="relative text-center text-white/70 tabular-nums">{fmt2(row.amount)}</span>
              <span className="relative text-right text-white/50 tabular-nums">{fmt2(row.total)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-white/5 flex-shrink-0" />

      {/* Vendedores */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-primary-400" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-400">Vendedores</span>
        </div>
        <div className="grid grid-cols-3 text-[9px] text-white/30 font-bold uppercase tracking-wider mb-2 px-1">
          <span>Precio</span><span className="text-center">Monto USD</span><span className="text-right">Total PEN</span>
        </div>
        <div className="space-y-0.5">
          {sells.map(row => (
            <div key={row.id} className="relative grid grid-cols-3 text-[11px] px-1 py-0.5 rounded overflow-hidden">
              <div className="absolute inset-y-0 right-0 bg-primary-500/10 rounded"
                style={{ width: `${row.pct}%` }} />
              <span className="relative font-bold text-primary-400 tabular-nums">{fmt4(row.price)}</span>
              <span className="relative text-center text-white/70 tabular-nums">{fmt2(row.amount)}</span>
              <span className="relative text-right text-white/50 tabular-nums">{fmt2(row.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Improve Price Form ─────────────────────────────────────────────────────────

function ImprovePrice({ compra, venta }: { compra: number; venta: number }) {
  const [side, setSide] = useState<'compra' | 'venta'>('compra');
  const [amount, setAmount] = useState('');
  const [tc, setTc] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => setDone(false), 3500);
  };

  const refPrice = side === 'compra' ? compra : venta;
  const saving   = amount && tc
    ? Math.abs((parseFloat(tc) - refPrice) * parseFloat(amount)).toFixed(2)
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Target className="w-3.5 h-3.5 text-primary-400" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm leading-tight">Mejora tu cotización</h3>
          <p className="text-white/40 text-[10px]">Fase experimental</p>
        </div>
      </div>

      <p className="text-white/50 text-xs leading-relaxed mb-4">
        Indica el tipo de cambio que te gustaría obtener y participa en futuras versiones del Mercado en Vivo.
      </p>

      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}>
            <Zap className="w-6 h-6 text-primary-400" />
          </div>
          <p className="text-white font-bold">¡Interés registrado!</p>
          <p className="text-white/40 text-xs max-w-[180px]">
            Te notificaremos cuando el mercado alcance tu precio objetivo.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          {/* Side toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(['compra', 'venta'] as const).map(s => (
              <button key={s} type="button" onClick={() => setSide(s)}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  side === s
                    ? s === 'compra'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                    : 'text-white/40 hover:text-white/60'
                }`}>
                {s === 'compra' ? 'Quiero comprar USD' : 'Quiero vender USD'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1.5">
              Cantidad (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">$</span>
              <input
                type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="1,000" min="100" step="100"
                className="w-full pl-7 pr-3 py-2.5 text-sm font-bold text-white rounded-lg outline-none tabular-nums"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* TC deseado */}
          <div>
            <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block mb-1.5">
              TC deseado
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">S/</span>
              <input
                type="number" value={tc} onChange={e => setTc(e.target.value)}
                placeholder={fmt4(refPrice + 0.001)} step="0.0001" min="3" max="5"
                className="w-full pl-7 pr-3 py-2.5 text-sm font-bold text-white rounded-lg outline-none tabular-nums"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* Preview ahorro */}
          {saving && parseFloat(saving) > 0 && (
            <div className="rounded-lg px-3 py-2 text-xs"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <span className="text-white/50">Ahorro estimado: </span>
              <span className="text-primary-400 font-bold">S/ {saving}</span>
            </div>
          )}

          <button type="submit"
            disabled={!amount || !tc}
            className="mt-auto w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: amount && tc ? '0 4px 20px rgba(34,197,94,0.3)' : 'none',
            }}>
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Registrar Interés
            </span>
          </button>
        </form>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function MercadoEnVivo() {
  const { currentRates } = useExchangeStore();
  const [candles, setCandles]   = useState<Candle[]>([]);
  const [compra, setCompra]     = useState(SIM_COMPRA);
  const [venta, setVenta]       = useState(SIM_VENTA);
  const [prevC, setPrevC]       = useState(SIM_COMPRA);
  const [buys, setBuys]         = useState<OrderRow[]>([]);
  const [sells, setSells]       = useState<OrderRow[]>([]);
  const [timeframe, setTf]      = useState('1m');
  const [lastUpdate, setLast]   = useState('');
  const [tick, setTick]         = useState(0);
  const [trend, setTrend]       = useState<'up' | 'down' | 'neutral'>('neutral');
  const [variation, setVariation] = useState(0);
  const candleRef   = useRef<Candle[]>([]);
  const priceRef    = useRef({ compra: SIM_COMPRA, venta: SIM_VENTA });

  // History arrays for wavy compra/venta lines
  const [compraHist, setCompraHist] = useState<number[]>([]);
  const [ventaHist,  setVentaHist]  = useState<number[]>([]);
  const compraHistRef = useRef<number[]>([]);
  const ventaHistRef  = useRef<number[]>([]);
  const compraRegimeRef = useRef<RegimeState>({ name: 'flat', ticks: 0, max: 10 });
  const ventaRegimeRef  = useRef<RegimeState>({ name: 'flat', ticks: 0, max: 10 });

  // 60fps smooth interpolation for compra/venta reference lines
  const smoothRef   = useRef({ compra: SIM_COMPRA, venta: SIM_VENTA });
  const [smoothPrices, setSmoothPrices] = useState({ compra: SIM_COMPRA, venta: SIM_VENTA });
  const rafRef      = useRef<number>(0);

  // Init
  useEffect(() => {
    const initial = buildCandles(80, SIM_MID);
    candleRef.current = initial;
    setCandles(initial);

    // Anclar priceRef al último close de las velas
    const lastClose = initial[initial.length - 1]?.close ?? SIM_MID;
    const initCompra = parseFloat((lastClose - SIM_SPREAD / 2).toFixed(4));
    const initVenta  = parseFloat((lastClose + SIM_SPREAD / 2).toFixed(4));
    priceRef.current = { compra: initCompra, venta: initVenta };
    setCompra(initCompra);
    setVenta(initVenta);

    setBuys(buildOrders(initCompra, 'buy'));
    setSells(buildOrders(initVenta,  'sell'));
    setLast(new Date().toLocaleTimeString('es-PE'));

    // Historiales con regímenes — venta siempre > compra + spread mínimo
    compraRegimeRef.current = pickRegime();
    ventaRegimeRef.current  = pickRegime();
    const cHist = buildRateWithRegimes(80, initCompra, SIM_COMPRA);
    const vHist = buildRateWithRegimes(80, initVenta, SIM_VENTA)
      .map((v, i) => Math.max(v, (cHist[i] ?? initCompra) + 0.0015));
    compraHistRef.current = cHist;
    ventaHistRef.current  = vHist;
    setCompraHist([...cHist]);
    setVentaHist([...vHist]);

    const first = initial[0]?.close ?? SIM_MID;
    const last_  = lastClose;
    setVariation(parseFloat(((last_ - first) / first * 100).toFixed(4)));
    setTrend(last_ >= first ? 'up' : 'down');
  }, []);

  // Live tick — every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);

      // Update last candle (live tick)
      const list = candleRef.current;
      if (!list.length) return;
      const prev = list[list.length - 1];
      const chg  = (Math.random() - 0.50) * 0.0025;
      const newClose = parseFloat((prev.close + chg).toFixed(4));
      const updated: Candle = {
        ...prev,
        close: newClose,
        high: Math.max(prev.high, newClose),
        low:  Math.min(prev.low,  newClose),
      };

      // Every ~60s push new candle
      const now = Math.floor(Date.now() / 1000);
      let newList: Candle[];
      if (now - prev.time >= 60) {
        newList = [...list, {
          time: now, open: newClose, high: newClose, low: newClose, close: newClose,
          volume: Math.floor(rnd(3000, 90000)),
        }];
        if (newList.length > 100) newList = newList.slice(-100);
      } else {
        newList = [...list.slice(0, -1), updated];
      }

      candleRef.current = newList;
      setCandles([...newList]);

      // (compra/venta se actualizan en su propio tick independiente)

      // Trend
      const first = newList[0]?.close ?? SIM_COMPRA;
      const last_ = newList[newList.length - 1]?.close ?? SIM_COMPRA;
      const varPct = parseFloat(((last_ - first) / first * 100).toFixed(4));
      setVariation(varPct);
      setTrend(last_ >= first ? 'up' : 'down');
      setLast(new Date().toLocaleTimeString('es-PE'));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Tick Compra — 870ms — regímenes autónomos
  useEffect(() => {
    const interval = setInterval(() => {
      const { compra: pc } = priceRef.current;
      const [raw, nextState] = applyRegime(compraRegimeRef.current, pc, SIM_COMPRA);
      compraRegimeRef.current = nextState;
      const newCompra = parseFloat(Math.min(raw, priceRef.current.venta - 0.0015).toFixed(4));
      priceRef.current.compra = newCompra;
      setPrevC(pc);
      setCompra(newCompra);

      const prevCH  = compraHistRef.current;
      const lastCH  = prevCH[prevCH.length - 1] ?? newCompra;
      const lastVHv = ventaHistRef.current[ventaHistRef.current.length - 1] ?? (lastCH + 0.003);
      const [rawCH] = applyRegime(compraRegimeRef.current, lastCH, SIM_COMPRA);
      const newCH   = parseFloat(Math.min(rawCH, lastVHv - 0.0015).toFixed(4));
      const updCH   = [...prevCH.slice(-99), newCH];
      compraHistRef.current = updCH;
      setCompraHist([...updCH]);
    }, 870);
    return () => clearInterval(interval);
  }, []);

  // Tick Venta — 1050ms — regímenes autónomos (frecuencia diferente → asincrónicas)
  useEffect(() => {
    const interval = setInterval(() => {
      const { compra: pc, venta: pv } = priceRef.current;
      const [raw, nextState] = applyRegime(ventaRegimeRef.current, pv, SIM_VENTA);
      ventaRegimeRef.current = nextState;
      const newVenta = parseFloat(Math.max(pc + 0.0015, raw).toFixed(4));
      priceRef.current.venta = newVenta;
      setVenta(newVenta);

      const prevVH  = ventaHistRef.current;
      const lastVH  = prevVH[prevVH.length - 1] ?? newVenta;
      const lastCHv = compraHistRef.current[compraHistRef.current.length - 1] ?? (lastVH - 0.003);
      const [rawVH] = applyRegime(ventaRegimeRef.current, lastVH, SIM_VENTA);
      const newVH   = parseFloat(Math.max(rawVH, lastCHv + 0.0015).toFixed(4));
      const updVH   = [...prevVH.slice(-99), newVH];
      ventaHistRef.current = updVH;
      setVentaHist([...updVH]);
    }, 1050);
    return () => clearInterval(interval);
  }, []);

  // RAF 60fps — solo interpola las líneas de referencia Compra/Venta
  useEffect(() => {
    const loop = () => {
      const s = smoothRef.current;
      const { compra: tc, venta: tv } = priceRef.current;
      const a = 0.06;
      const lerp = (c: number, t: number) => c + (t - c) * a;
      smoothRef.current = {
        compra: lerp(s.compra, tc),
        venta:  lerp(s.venta,  tv),
      };
      setSmoothPrices({ ...smoothRef.current });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Order book update every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setBuys(prev => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * updated.length);
        const row = updated[idx];
        updated[idx] = { ...row, amount: parseFloat(rnd(800, 42000).toFixed(0)) };
        const maxT = Math.max(...updated.map(r => r.amount * r.price));
        return updated.map(r => ({ ...r, total: r.price * r.amount, pct: (r.amount * r.price / maxT) * 100 }));
      });
      setSells(prev => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * updated.length);
        const row = updated[idx];
        updated[idx] = { ...row, amount: parseFloat(rnd(800, 42000).toFixed(0)) };
        const maxT = Math.max(...updated.map(r => r.amount * r.price));
        return updated.map(r => ({ ...r, total: r.price * r.amount, pct: (r.amount * r.price / maxT) * 100 }));
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const spread  = parseFloat((venta - compra).toFixed(4));
  const isUp    = trend === 'up';
  const varAbs  = Math.abs(variation);
  const last24H = candles[0]?.close ?? compra;

  const stats = [
    { label: 'Mejor precio comprador', value: fmt4(compra), icon: ChevronUp, color: 'text-blue-400' },
    { label: 'Mejor precio vendedor',  value: fmt4(venta),  icon: ChevronDown, color: 'text-primary-400' },
    { label: 'Spread actual',          value: fmt4(spread), icon: Layers,   color: 'text-yellow-400' },
    { label: 'Variación del día',      value: `${isUp ? '+' : ''}${variation.toFixed(4)}%`, icon: isUp ? TrendingUp : TrendingDown, color: isUp ? 'text-primary-400' : 'text-red-400' },
    { label: 'Tendencia',              value: isUp ? 'Alcista ↑' : 'Bajista ↓', icon: Activity, color: isUp ? 'text-primary-400' : 'text-red-400' },
    { label: 'Última actualización',   value: lastUpdate,  icon: Clock,    color: 'text-white/50' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#080c16' }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b"
        style={{ background: 'rgba(7,16,31,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
            </div>
            <span className="text-white font-bold text-sm">Mercado en Vivo</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-yellow-400 border border-yellow-400/30"
              style={{ background: 'rgba(234,179,8,0.08)' }}>BETA</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs hidden sm:block">Solo datos simulados</span>
          <Link href="/crear-cuenta"
            className="text-xs font-bold px-4 py-2 rounded-lg text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)' }}>
            Crear cuenta
          </Link>
        </div>
      </nav>

      <div className="pt-14">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8"
          style={{ background: 'linear-gradient(180deg, #0e1628 0%, #080c16 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
            style={{ background: 'rgba(34,197,94,0.06)' }} />
          <div className="absolute top-0 right-1/3 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
            style={{ background: 'rgba(96,165,250,0.05)' }} />

          <div className="max-w-7xl mx-auto relative">
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-[10px] font-bold tracking-widest uppercase"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
                <BarChart2 className="w-3 h-3" /> Mercado en Vivo · QoriCash
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">
                Mercado en Vivo
              </h1>
              <p className="text-white/45 text-sm max-w-xl">
                Observa la evolución del tipo de cambio en tiempo real y obtén mejores oportunidades para comprar o vender dólares.
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Compra */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70 mb-1">Precio Compra</p>
                <p className="text-2xl font-black text-blue-300 tabular-nums">{fmt4(compra)}</p>
                <p className="text-[10px] text-blue-400/50 mt-0.5">QoriCash paga</p>
              </div>
              {/* Venta */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400/70 mb-1">Precio Venta</p>
                <p className="text-2xl font-black text-primary-300 tabular-nums">{fmt4(venta)}</p>
                <p className="text-[10px] text-primary-400/50 mt-0.5">QoriCash cobra</p>
              </div>
              {/* Spread */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Spread</p>
                <p className="text-2xl font-black text-yellow-300 tabular-nums">{fmt4(spread)}</p>
                <p className="text-[10px] text-white/30 mt-0.5">Diferencial</p>
              </div>
              {/* Variación */}
              <div className="rounded-xl p-4"
                style={{ background: isUp ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${isUp ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: isUp ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)' }}>Variación</p>
                <p className="text-2xl font-black tabular-nums" style={{ color: isUp ? '#4ade80' : '#f87171' }}>
                  {isUp ? '+' : ''}{variation.toFixed(4)}%
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {isUp ? <TrendingUp className="w-3 h-3 text-primary-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                  <p className="text-[10px]" style={{ color: isUp ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)' }}>
                    {isUp ? 'Alcista' : 'Bajista'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chart + Order Book ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

          {/* Chart card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(12,18,34,0.85)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
            {/* Chart toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-white font-bold text-sm">USD / PEN</span>
                  <span className="ml-2 text-white/30 text-[10px]">Precio medio (C+V)/2</span>
                </div>
                <div className="flex gap-1">
                  {['1m', '5m', '15m', '1h'].map(tf => (
                    <button key={tf} onClick={() => setTf(tf)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                        timeframe === tf
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'text-white/30 hover:text-white/60'
                      }`}>
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-4 h-0.5 bg-blue-400 inline-block rounded" style={{ borderTop: '1.5px dashed' }} />
                  QoriCash Compra
                </span>
                <span className="flex items-center gap-1.5 text-primary-400">
                  <span className="w-4 h-0.5 bg-primary-400 inline-block rounded" style={{ borderTop: '1.5px dashed' }} />
                  QoriCash Venta
                </span>
                <div className="flex items-center gap-1.5 text-white/30">
                  <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>{lastUpdate}</span>
                </div>
              </div>
            </div>

            {/* SVG chart */}
            <div className="w-full" style={{ height: '380px' }}>
              {candles.length > 0 && (
                <CandlestickChart
                  candles={candles}
                  compra={smoothPrices.compra}
                  venta={smoothPrices.venta}
                  timeframe={timeframe}
                  compraHist={compraHist}
                  ventaHist={ventaHist}
                />
              )}
            </div>
          </div>

          {/* Order Book + Form */}
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Order Book — 3 cols */}
            <div className="lg:col-span-3 rounded-2xl p-5"
              style={{ background: 'rgba(12,18,34,0.85)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-white/40" />
                  <h2 className="text-white font-bold text-sm">Libro de Mercado</h2>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  Actualizando en tiempo real
                </div>
              </div>

              {/* Spread central */}
              <div className="flex items-center justify-center gap-3 py-2 mb-3 rounded-lg text-xs"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-blue-400 font-bold tabular-nums">{fmt4(compra)}</span>
                <span className="text-white/20 font-bold">—</span>
                <span className="text-yellow-400/80 font-semibold text-[10px]">Spread {fmt4(spread)}</span>
                <span className="text-white/20 font-bold">—</span>
                <span className="text-primary-400 font-bold tabular-nums">{fmt4(venta)}</span>
              </div>

              <OrderBook buys={buys} sells={sells} />
            </div>

            {/* Improve price — 2 cols */}
            <div className="lg:col-span-2 rounded-2xl p-5"
              style={{ background: 'rgba(12,18,34,0.85)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', minHeight: '420px' }}>
              <ImprovePrice compra={compra} venta={venta} />
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: 'rgba(12,18,34,0.75)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <span className="text-[9px] text-white/30 uppercase tracking-wider font-bold leading-tight">{label}</span>
                </div>
                <p className={`text-sm font-black tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.12)' }}>
            <Shield className="w-4 h-4 text-yellow-400/60 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/30 leading-relaxed">
              <strong className="text-yellow-400/60">Funcionalidad experimental.</strong> Todos los datos mostrados son simulados y no representan precios reales del mercado.
              Esta vista está en desarrollo y no permite realizar operaciones. Para cambios reales,{' '}
              <Link href="/" className="text-primary-400/70 hover:text-primary-400 underline">usa la calculadora principal</Link>.
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(13,27,42,0.9) 0%, rgba(13,24,41,0.9) 100%)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-white font-black text-lg mb-1">¿Listo para operar con el mejor tipo de cambio?</p>
            <p className="text-white/40 text-sm mb-4">Usa la calculadora de QoriCash y realiza tu operación en minutos.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
                Cotizar ahora <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/crear-cuenta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white/70 border"
                style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                <Users className="w-4 h-4" /> Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
