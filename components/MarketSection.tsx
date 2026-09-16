'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface TickerItem {
  key: string;
  label: string;
  value: number | null;
  chg: number | null;
  prefix: string;
  suffix: string;
}

interface MacroItem {
  key: string;
  label: string;
  value: number | null;
  chg: number | null;
  prefix: string;
  suffix: string;
  period: string;
  source: string;
  notes: string;
  direction: 'up' | 'down' | 'flat';
}

interface NewsItem {
  id: number;
  title: string;
  summary: string | null;
  source: string | null;
  fetched_lima: string | null;
  published_lima: string | null;
  impact_level: 'high' | 'medium' | 'low';
  direction: 'bullish_usd' | 'bearish_usd' | 'neutral';
  url: string | null;
}

// ── Indicadores de mercado a mostrar ─────────────────────────────────────────
const MARKET_PERSONA  = ['usdpen', 'gold', 'oil', 'sp500', 'vix', 'copper'];
const MARKET_EMPRESA  = ['usdpen', 'gold', 'oil', 'sp500', 'nasdaq', 'dxy', 'vix', 'copper', 'treasury_10y', 'eurusd'];
const MACRO_ALL       = ['bcrp_rate', 'fed_rate', 'bcrp_tc_sell', 'us_cpi_yoy', 'us_unrate', 'us_nfp'];

const INSTRUMENT_META: Record<string, { icon: string }> = {
  usdpen:       { icon: '🏦' },
  gold:         { icon: '🥇' },
  oil:          { icon: '🛢️' },
  sp500:        { icon: '📈' },
  nasdaq:       { icon: '💻' },
  dxy:          { icon: '💵' },
  vix:          { icon: '⚡' },
  copper:       { icon: '🔶' },
  treasury_10y: { icon: '📊' },
  eurusd:       { icon: '🌐' },
  bcrp_rate:    { icon: '🏛️' },
  fed_rate:     { icon: '🇺🇸' },
  bcrp_tc_sell: { icon: '💱' },
  us_cpi_yoy:   { icon: '📉' },
  us_unrate:    { icon: '👷' },
  us_nfp:       { icon: '📋' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtValue(item: TickerItem | MacroItem): string {
  if (item.value === null) return '—';
  const v = item.value;
  const decimals =
    item.key === 'usdpen' || item.key === 'bcrp_tc_sell' || item.key === 'eurusd' ? 4
    : item.suffix === '%' || item.key === 'dxy' || item.key === 'vix' ? 2
    : item.key === 'sp500' || item.key === 'nasdaq' ? 0
    : item.key === 'us_nfp' ? 0
    : 2;
  const num = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${item.prefix}${num}${item.suffix}`;
}

function fmtChg(chg: number | null): string {
  if (chg === null) return '';
  return `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 2) return 'ahora';
    if (mins < 60) return `hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

function srcInitials(source: string | null): string {
  if (!source) return '?';
  const abbrs: Record<string, string> = {
    reuters: 'R', bloomberg: 'BB', 'financial times': 'FT',
    cnbc: 'CNBC', wsj: 'WSJ', marketwatch: 'MW', investing: 'IN',
    tradingeconomics: 'TE', 'el comercio': 'EC', gestión: 'GE',
  };
  const lower = source.toLowerCase();
  const key = Object.keys(abbrs).find(k => lower.includes(k));
  if (key) return abbrs[key];
  return source.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ── Thumbnail generado ────────────────────────────────────────────────────────
function NewsThumbnail({ news, compact = false }: { news: NewsItem; compact?: boolean }) {
  const impactColor = news.impact_level === 'high' ? '#ef4444' : '#f59e0b';
  const dirArrow    = news.direction === 'bullish_usd' ? '↑' : news.direction === 'bearish_usd' ? '↓' : '◆';
  const dirColor    = news.direction === 'bullish_usd' ? '#ef4444' : news.direction === 'bearish_usd' ? '#22c55e' : '#64748b';
  const src         = srcInitials(news.source);

  if (compact) {
    return (
      <div style={{
        flexShrink: 0, width: 52, height: 52, borderRadius: 8,
        background: 'linear-gradient(135deg, #0d1220 0%, #141b2d 100%)',
        border: `1px solid ${impactColor}25`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${impactColor}18 0%, transparent 65%)` }} />
        <span style={{ fontSize: 8, fontWeight: 800, color: 'rgba(226,232,240,0.7)', letterSpacing: '0.04em', position: 'relative', zIndex: 1 }}>{src}</span>
        <span style={{ fontSize: 14, lineHeight: 1, color: dirColor, fontWeight: 900, position: 'relative', zIndex: 1 }}>{dirArrow}</span>
        <div style={{ position: 'absolute', bottom: 3, right: 4, width: 4, height: 4, borderRadius: '50%', background: impactColor, boxShadow: `0 0 5px ${impactColor}` }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(150deg, #080f1e 0%, #0f1829 50%, #070e1b 100%)', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${impactColor}10 1px, transparent 1px), linear-gradient(90deg, ${impactColor}10 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${impactColor}20 0%, transparent 70%)` }} />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 160, gap: 10, padding: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px', fontSize: src.length > 2 ? 9 : 13, fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.06em' }}>{src}</div>
        <div style={{ fontSize: 38, lineHeight: 1, color: dirColor, fontWeight: 900, textShadow: `0 0 20px ${dirColor}60` }}>{dirArrow}</div>
        <div style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '3px 8px', borderRadius: 4, background: `${impactColor}18`, color: impactColor, border: `1px solid ${impactColor}30` }}>
          {news.impact_level === 'high' ? 'Alto impacto' : 'Impacto medio'}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: -10, right: -10, width: 40, height: 40, borderRadius: '50%', background: `${impactColor}25` }} />
    </div>
  );
}

// ── Card mercado — Empresa ────────────────────────────────────────────────────
function CardMarketEmpresa({ item }: { item: TickerItem }) {
  const isUp   = item.chg !== null && item.chg > 0;
  const isDown = item.chg !== null && item.chg < 0;
  const accent = isUp ? '#22c55e' : isDown ? '#ef4444' : 'rgba(100,116,139,0.3)';
  return (
    <div className="ind-card-emp" style={{ position: 'relative', overflow: 'hidden', background: 'rgba(8,14,28,0.85)', border: '1px solid rgba(148,163,184,0.07)', borderRadius: 8, padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, background: `radial-gradient(circle at 0% 0%, ${accent}12, transparent 70%)`, pointerEvents: 'none' }} />
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.65)', lineHeight: 1, position: 'relative', zIndex: 1 }}>{item.label}</span>
      <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px', lineHeight: 1, fontVariantNumeric: 'tabular-nums', position: 'relative', zIndex: 1 }}>{fmtValue(item)}</span>
      {item.chg !== null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: accent, position: 'relative', zIndex: 1 }}>
          {isUp ? '▲' : isDown ? '▼' : '—'} {fmtChg(item.chg)}
        </span>
      )}
    </div>
  );
}

// ── Card mercado — Persona ────────────────────────────────────────────────────
function CardMarketPersona({ item }: { item: TickerItem }) {
  const isUp   = item.chg !== null && item.chg > 0;
  const isDown = item.chg !== null && item.chg < 0;
  const chgColor = isUp ? '#15803d' : isDown ? '#dc2626' : '#64748b';
  const chgBg    = isUp ? '#dcfce7' : isDown ? '#fee2e2' : '#f1f5f9';
  const chgBorder = isUp ? '#bbf7d0' : isDown ? '#fecaca' : '#e2e8f0';
  const meta = INSTRUMENT_META[item.key];
  return (
    <div className="ind-card-per" style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.07)', borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>{item.label}</span>
        {meta && <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.icon}</span>}
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtValue(item)}</span>
      {item.chg !== null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 99, background: chgBg, color: chgColor, fontSize: 11, fontWeight: 700, width: 'fit-content', border: `1px solid ${chgBorder}` }}>
          {isUp ? '▲' : isDown ? '▼' : '—'} {fmtChg(item.chg)}
        </span>
      )}
    </div>
  );
}

// ── Card macro — Empresa (pill horizontal) ────────────────────────────────────
function CardMacroEmpresa({ item }: { item: MacroItem }) {
  const isUp   = item.direction === 'up';
  const isDown = item.direction === 'down';
  const accent = isUp ? '#22c55e' : isDown ? '#ef4444' : 'rgba(100,116,139,0.4)';
  const meta   = INSTRUMENT_META[item.key];
  return (
    <div style={{
      background: 'rgba(6,11,24,0.9)', border: '1px solid rgba(148,163,184,0.08)',
      borderLeft: `2px solid ${accent}`, borderRadius: 8,
      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {meta && <span style={{ fontSize: 16, flexShrink: 0 }}>{meta.icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.6)', marginBottom: 3 }}>
          {item.label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.2px' }}>
          {fmtValue(item)}
        </div>
        {item.period && (
          <div style={{ fontSize: 9, color: 'rgba(100,116,139,0.45)', marginTop: 2 }}>{item.period}</div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: accent }}>
          {isUp ? '▲' : isDown ? '▼' : '—'}
        </span>
        {item.chg !== null && (
          <div style={{ fontSize: 9, color: accent, marginTop: 1 }}>{fmtChg(item.chg)}</div>
        )}
      </div>
    </div>
  );
}

// ── Card macro — Persona ──────────────────────────────────────────────────────
function CardMacroPersona({ item }: { item: MacroItem }) {
  const isUp   = item.direction === 'up';
  const isDown = item.direction === 'down';
  const accent = isUp ? '#16a34a' : isDown ? '#dc2626' : '#64748b';
  const accentBg = isUp ? '#dcfce7' : isDown ? '#fee2e2' : '#f1f5f9';
  const meta   = INSTRUMENT_META[item.key];
  return (
    <div style={{
      background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 14, padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {meta && (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
          {meta.icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 3 }}>{item.label}</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{fmtValue(item)}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
        {item.period && <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{item.period}</div>}
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ cols, count, h, dark, radius = 8 }: { cols: number; count: number; h: number; dark: boolean; radius?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: dark ? 7 : 12 }} className="mk-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mk-skeleton" style={{ height: h, borderRadius: radius, background: dark ? 'rgba(148,163,184,0.04)' : 'rgba(0,0,0,0.04)', border: dark ? '1px solid rgba(148,163,184,0.06)' : '1px solid rgba(0,0,0,0.05)' }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function MarketSection({ variant = 'persona' }: { variant?: 'persona' | 'empresa' }) {
  const [items,  setItems]  = useState<TickerItem[]>([]);
  const [macro,  setMacro]  = useState<MacroItem[]>([]);
  const [news,   setNews]   = useState<NewsItem[]>([]);
  const [newsIdx, setNewsIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDark = variant === 'empresa';

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch('/api/market');
      const data = await res.json();
      if (data.items?.length)  setItems(data.items);
      if (data.macro?.length)  setMacro(data.macro);
      if (data.news?.length)   setNews(data.news);
      setLastUpdate(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));
    } catch { /* silencioso */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [fetchData]);

  useEffect(() => {
    if (news.length < 2) return;
    timerRef.current = setInterval(() => setNewsIdx(i => (i + 1) % news.length), 8000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [news.length]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setNewsIdx(i => (i + 1) % news.length), 8000);
  };
  const go = (dir: 1 | -1) => { setNewsIdx(i => (i + dir + news.length) % news.length); resetTimer(); };

  const marketKeys  = isDark ? MARKET_EMPRESA : MARKET_PERSONA;
  const visMarket   = items.filter(it => marketKeys.includes(it.key));
  const visMacro    = macro.filter(m => MACRO_ALL.includes(m.key));
  const current     = news[newsIdx];
  const miniNews    = news.filter((_, i) => i !== newsIdx).slice(0, 4);

  // ── EMPRESA ─────────────────────────────────────────────────────────────────
  if (isDark) {
    return (
      <section style={{ background: 'linear-gradient(180deg, #050c18 0%, #060d1b 100%)', borderTop: '1px solid rgba(143,184,204,0.08)', borderBottom: '1px solid rgba(143,184,204,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(143,184,204,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(143,184,204,0.018) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-14" style={{ position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
            <div>
              <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8, color: 'rgba(96,165,250,0.5)' }}>Mercados globales · tiempo real</span>
              <h2 style={{ margin: 0, fontSize: 'clamp(20px,2.8vw,30px)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                Indicadores que mueven <span style={{ color: '#22c55e' }}>su operación</span>
              </h2>
            </div>
            {lastUpdate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <div className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.6)', whiteSpace: 'nowrap' }}>{lastUpdate}</span>
              </div>
            )}
          </div>

          {/* Mercado — 5×2 grid */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.45)', marginBottom: 10 }}>Precios de mercado</span>
            {loading ? <Skeleton cols={5} count={10} h={80} dark /> : (
              <div className="mk-grid emp-grid" style={{ display: 'grid', gap: 7 }}>
                {visMarket.map(item => <CardMarketEmpresa key={item.key} item={item} />)}
              </div>
            )}
          </div>

          {/* Macro — 3×2 grid */}
          {(loading || visMacro.length > 0) && (
            <div style={{ marginTop: 16, marginBottom: 8 }}>
              <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.45)', marginBottom: 10 }}>Indicadores macro</span>
              {loading ? <Skeleton cols={3} count={6} h={68} dark /> : (
                <div className="mk-grid macro-emp-grid" style={{ display: 'grid', gap: 7 }}>
                  {visMacro.map(m => <CardMacroEmpresa key={m.key} item={m} />)}
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(143,184,204,0.12), transparent)', margin: '24px 0' }} />

          {/* Noticias */}
          {news.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.55)' }}>Noticias de alto impacto</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {news.map((_, i) => (
                    <button key={i} onClick={() => { setNewsIdx(i); resetTimer(); }} style={{ width: i === newsIdx ? 20 : 6, height: 5, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', background: i === newsIdx ? '#22c55e' : 'rgba(143,184,204,0.15)', transition: 'all 0.3s' }} />
                  ))}
                  <div style={{ width: 1, height: 14, background: 'rgba(143,184,204,0.15)', margin: '0 4px' }} />
                  <button onClick={() => go(-1)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(143,184,204,0.06)', border: '1px solid rgba(143,184,204,0.1)', color: 'rgba(148,163,184,0.6)' }}><ChevronLeft size={13} /></button>
                  <button onClick={() => go(1)}  style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(143,184,204,0.06)', border: '1px solid rgba(143,184,204,0.1)', color: 'rgba(148,163,184,0.6)' }}><ChevronRight size={13} /></button>
                </div>
              </div>

              {/* Featured */}
              {current && (
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', background: 'rgba(8,14,28,0.7)', border: '1px solid rgba(143,184,204,0.09)', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }} className="news-feat-emp">
                  <NewsThumbnail news={current} />
                  <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '3px 7px', borderRadius: 4, background: current.impact_level === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: current.impact_level === 'high' ? '#ef4444' : '#f59e0b', border: `1px solid ${current.impact_level === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                        {current.impact_level === 'high' ? 'Alto impacto' : 'Impacto medio'}
                      </span>
                      {current.direction !== 'neutral' && (
                        <span style={{ fontSize: 8, fontWeight: 700, color: current.direction === 'bullish_usd' ? '#ef4444' : '#22c55e' }}>
                          {current.direction === 'bullish_usd' ? '↑ USD sube' : '↓ USD baja'}
                        </span>
                      )}
                      <span style={{ fontSize: 9, color: 'rgba(100,116,139,0.5)', marginLeft: 'auto' }}>{current.source} · {timeAgo(current.fetched_lima || current.published_lima)}</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, lineHeight: 1.45, color: '#f1f5f9', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{current.title}</p>
                    {current.summary && (
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: 'rgba(148,163,184,0.6)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', flex: 1 }}>{current.summary}</p>
                    )}
                    {current.url && (
                      <a href={current.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: '#22c55e', textDecoration: 'none', width: 'fit-content' }}>
                        Ver nota completa <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Mini news */}
              {miniNews.length > 0 && (
                <div className="mk-grid news-mini-emp" style={{ display: 'grid', gap: 7 }}>
                  {miniNews.map(n => (
                    <button key={n.id} onClick={() => { setNewsIdx(news.indexOf(n)); resetTimer(); }}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', background: 'rgba(8,14,28,0.5)', border: '1px solid rgba(143,184,204,0.07)', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(143,184,204,0.18)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(143,184,204,0.07)')}
                    >
                      <NewsThumbnail news={n} compact />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: 'rgba(226,232,240,0.8)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{n.title}</p>
                        {n.summary && (
                          <p style={{ margin: 0, fontSize: 10, lineHeight: 1.5, color: 'rgba(148,163,184,0.45)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{n.summary}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <style>{`
          .emp-grid { grid-template-columns: repeat(5, 1fr); }
          .macro-emp-grid { grid-template-columns: repeat(3, 1fr); }
          .news-mini-emp { grid-template-columns: repeat(2, 1fr); }
          .ind-card-emp:hover { border-color: rgba(143,184,204,0.18) !important; background: rgba(10,18,36,0.95) !important; }
          .news-feat-emp:hover { border-color: rgba(143,184,204,0.2) !important; }
          .live-dot { animation: livePulse 2s ease-in-out infinite; }
          @keyframes livePulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 50%{opacity:0.8;box-shadow:0 0 0 5px rgba(34,197,94,0)} }
          @media (max-width: 700px) {
            .emp-grid { grid-template-columns: repeat(3, 1fr) !important; }
            .macro-emp-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .news-mini-emp { grid-template-columns: 1fr !important; }
            .news-feat-emp { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 701px) and (max-width: 900px) {
            .emp-grid { grid-template-columns: repeat(4, 1fr) !important; }
            .macro-emp-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
          .mk-skeleton { animation: mkskel 1.6s ease-in-out infinite; }
          @keyframes mkskel { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
      </section>
    );
  }

  // ── PERSONA ──────────────────────────────────────────────────────────────────
  return (
    <section style={{ background: '#F1F5F9', borderTop: '1px solid rgba(0,0,0,0.055)', borderBottom: '1px solid rgba(0,0,0,0.055)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-14" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
          <div>
            <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8, color: '#94a3b8' }}>Mercado global · actualizado cada 5 min</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(20px,2.8vw,30px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Mercados que mueven <span style={{ color: '#16a34a' }}>tu cambio</span>
            </h2>
          </div>
          {lastUpdate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <div className="live-dot-g" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>{lastUpdate}</span>
            </div>
          )}
        </div>

        {/* Mercado */}
        <div style={{ marginBottom: 10 }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Precios de mercado</span>
          {loading ? <Skeleton cols={3} count={6} h={100} dark={false} radius={18} /> : (
            <div className="mk-grid per-grid" style={{ display: 'grid', gap: 12 }}>
              {visMarket.map(item => <CardMarketPersona key={item.key} item={item} />)}
            </div>
          )}
        </div>

        {/* Macro */}
        {(loading || visMacro.length > 0) && (
          <div style={{ marginTop: 20 }}>
            <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>Indicadores macro</span>
            {loading ? <Skeleton cols={2} count={6} h={68} dark={false} radius={14} /> : (
              <div className="mk-grid macro-per-grid" style={{ display: 'grid', gap: 10 }}>
                {visMacro.map(m => <CardMacroPersona key={m.key} item={m} />)}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)', margin: '28px 0 24px' }} />

        {/* Noticias */}
        {news.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8' }}>Noticias del día</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {news.map((_, i) => (
                  <button key={i} onClick={() => { setNewsIdx(i); resetTimer(); }} style={{ width: i === newsIdx ? 20 : 6, height: 5, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', background: i === newsIdx ? '#22c55e' : 'rgba(0,0,0,0.15)', transition: 'all 0.3s' }} />
                ))}
                <div style={{ width: 1, height: 14, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
                <button onClick={() => go(-1)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#64748b' }}><ChevronLeft size={13} /></button>
                <button onClick={() => go(1)}  style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#64748b' }}><ChevronRight size={13} /></button>
              </div>
            </div>

            {/* Featured */}
            {current && (
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 18, overflow: 'hidden', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.06)' }} className="news-feat-per">
                <NewsThumbnail news={current} />
                <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 4, background: current.impact_level === 'high' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', color: current.impact_level === 'high' ? '#ef4444' : '#f59e0b', border: `1px solid ${current.impact_level === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}` }}>
                      {current.impact_level === 'high' ? '● Alto impacto' : '● Impacto medio'}
                    </span>
                    <span style={{ fontSize: 9, color: '#94a3b8', marginLeft: 'auto' }}>{current.source} · {timeAgo(current.fetched_lima || current.published_lima)}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, lineHeight: 1.45, color: '#0f172a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{current.title}</p>
                  {current.summary && (
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: '#64748b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', flex: 1 }}>{current.summary}</p>
                  )}
                  {current.url && (
                    <a href={current.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: '#16a34a', textDecoration: 'none', width: 'fit-content' }}>
                      Ver nota <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Mini news */}
            {miniNews.length > 0 && (
              <div className="mk-grid news-mini-per" style={{ display: 'grid', gap: 10 }}>
                {miniNews.map(n => (
                  <button key={n.id} onClick={() => { setNewsIdx(news.indexOf(n)); resetTimer(); }}
                    style={{ display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '10px 14px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <NewsThumbnail news={n} compact />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#0f172a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{n.title}</p>
                      {n.summary && (
                        <p style={{ margin: 0, fontSize: 10, lineHeight: 1.5, color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{n.summary}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .per-grid { grid-template-columns: repeat(3, 1fr); }
        .macro-per-grid { grid-template-columns: repeat(3, 1fr); }
        .news-mini-per { grid-template-columns: repeat(2, 1fr); }
        .ind-card-per:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.1), 0 10px 28px rgba(0,0,0,0.07) !important; transform: translateY(-2px) !important; }
        .news-feat-per:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09), 0 12px 36px rgba(0,0,0,0.08) !important; transform: translateY(-1px) !important; }
        .live-dot-g { animation: livePulse 2s ease-in-out infinite; }
        @keyframes livePulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 50%{opacity:0.8;box-shadow:0 0 0 5px rgba(34,197,94,0)} }
        @media (max-width: 600px) {
          .per-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .macro-per-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .news-mini-per { grid-template-columns: 1fr !important; }
          .news-feat-per { grid-template-columns: 1fr !important; }
        }
        .mk-skeleton { animation: mkskel 1.6s ease-in-out infinite; }
        @keyframes mkskel { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </section>
  );
}
