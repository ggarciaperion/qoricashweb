'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface TickerItem {
  key: string;
  label: string;
  value: number | null;
  chg: number | null;
  prefix: string;
  suffix: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string | null;
  source: string | null;
  source_country: string | null;
  fetched_lima: string | null;
  published_lima: string | null;
  impact_level: 'high' | 'medium' | 'low';
  direction: 'bullish_usd' | 'bearish_usd' | 'neutral';
  sentiment: number;
  url: string | null;
}

// ── Indicadores a mostrar ──────────────────────────────────────────────────────
const INDICATORS_PERSONA = ['usdpen', 'gold', 'oil', 'sp500', 'vix', 'copper'];
const INDICATORS_EMPRESA = ['usdpen', 'gold', 'oil', 'sp500', 'nasdaq', 'dxy', 'vix', 'copper', 'treasury_10y', 'eurusd'];

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtValue(item: TickerItem): string {
  if (item.value === null) return '—';
  const v = item.value;
  const decimals = item.suffix === '%' || item.key === 'dxy' || item.key === 'vix' ? 2
    : item.key === 'usdpen' ? 4
    : item.key === 'sp500' || item.key === 'nasdaq' ? 0
    : 2;
  const num = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${item.prefix}${num}${item.suffix}`;
}

function fmtChg(chg: number | null): string {
  if (chg === null) return '';
  return `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`;
}

function dirColor(chg: number | null, isDark: boolean): string {
  if (chg === null) return isDark ? 'rgba(148,163,184,0.7)' : '#64748b';
  if (chg > 0) return '#22c55e';
  if (chg < 0) return '#ef4444';
  return isDark ? 'rgba(148,163,184,0.7)' : '#64748b';
}

function DirIcon({ chg, size = 14 }: { chg: number | null; size?: number }) {
  if (chg === null) return <Minus size={size} />;
  if (chg > 0) return <TrendingUp size={size} />;
  if (chg < 0) return <TrendingDown size={size} />;
  return <Minus size={size} />;
}

function impactBadge(level: string, variant: 'persona' | 'empresa') {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    high:   { bg: variant === 'empresa' ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.1)',  text: '#ef4444', label: 'Alto impacto' },
    medium: { bg: variant === 'empresa' ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.1)', text: '#f59e0b', label: 'Impacto medio' },
  };
  const c = colors[level] ?? colors.medium;
  return (
    <span style={{
      display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4,
      background: c.bg, color: c.text,
    }}>
      {c.label}
    </span>
  );
}

function directionLabel(dir: string) {
  if (dir === 'bullish_usd') return { label: '↑ USD', color: '#ef4444' };
  if (dir === 'bearish_usd') return { label: '↓ USD', color: '#22c55e' };
  return { label: 'Neutral', color: '#64748b' };
}

// ── Subcomponente: Tarjeta de indicador ────────────────────────────────────────
function IndicatorCard({ item, variant }: { item: TickerItem; variant: 'persona' | 'empresa' }) {
  const isDark = variant === 'empresa';
  const color = dirColor(item.chg, isDark);

  if (variant === 'empresa') {
    return (
      <div style={{
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(143,184,204,0.1)',
        borderRadius: 10, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 6,
        transition: 'border-color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(143,184,204,0.25)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(143,184,204,0.1)')}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.6)' }}>
          {item.label}
        </span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1 }}>
          {fmtValue(item)}
        </span>
        {item.chg !== null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color }}>
            <DirIcon chg={item.chg} size={11} />
            {fmtChg(item.chg)}
          </span>
        )}
      </div>
    );
  }

  // Persona: tarjeta blanca con sombra suave
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 14, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
        {item.label}
      </span>
      <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>
        {fmtValue(item)}
      </span>
      {item.chg !== null && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color }}>
          <DirIcon chg={item.chg} size={11} />
          {fmtChg(item.chg)}
        </span>
      )}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function MarketSection({ variant = 'persona' }: { variant?: 'persona' | 'empresa' }) {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsIdx, setNewsIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDark = variant === 'empresa';

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/market');
      const data = await res.json();
      if (data.items?.length) setItems(data.items);
      if (data.news?.length) setNews(data.news);
      setLastUpdate(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));
    } catch { /* silencioso */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Carrusel de noticias automático
  useEffect(() => {
    if (news.length < 2) return;
    timerRef.current = setInterval(() => setNewsIdx(i => (i + 1) % news.length), 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [news.length]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setNewsIdx(i => (i + 1) % news.length), 7000);
  };

  const prevNews = () => { setNewsIdx(i => (i - 1 + news.length) % news.length); resetTimer(); };
  const nextNews = () => { setNewsIdx(i => (i + 1) % news.length); resetTimer(); };

  const indicatorKeys = variant === 'empresa' ? INDICATORS_EMPRESA : INDICATORS_PERSONA;
  const visibleItems = items.filter(it => indicatorKeys.includes(it.key));
  const currentNews = news[newsIdx];

  // ── Estilos base según variante ─────────────────────────────────────────────
  const sectionBg = isDark
    ? 'rgba(2,8,23,0.0)'
    : '#F8FAFC';
  const borderTop = isDark
    ? '1px solid rgba(143,184,204,0.08)'
    : '1px solid rgba(0,0,0,0.06)';
  const titleColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtitleColor = isDark ? 'rgba(148,163,184,0.55)' : '#64748b';
  const cardBg = isDark ? 'rgba(143,184,204,0.04)' : 'rgba(0,0,0,0.02)';
  const cardBorder = isDark ? '1px solid rgba(143,184,204,0.1)' : '1px solid rgba(0,0,0,0.07)';

  return (
    <section style={{ background: sectionBg, borderTop, position: 'relative', overflow: 'hidden' }}>
      {/* Fondo punteado sutil */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(143,184,204,0.025)' : 'rgba(0,0,0,0.025)'} 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-12 sm:py-16" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-10">
          <div>
            <span style={{
              display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', marginBottom: 10, color: subtitleColor,
            }}>
              {variant === 'empresa' ? 'Análisis de mercado en tiempo real' : 'Mercado global · Actualizado cada 5 min'}
            </span>
            <h2 style={{
              margin: 0, fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05,
              fontSize: 'clamp(22px, 3vw, 36px)', color: titleColor,
            }}>
              {variant === 'empresa'
                ? <>Indicadores que mueven <span style={{ color: '#22c55e' }}>su operación</span></>
                : <>Mercados que mueven <span style={{ color: '#22c55e' }}>tu cambio</span></>}
            </h2>
          </div>
          {lastUpdate && (
            <span style={{ fontSize: 11, color: subtitleColor, flexShrink: 0, paddingBottom: 4 }}>
              ● Actualizado {lastUpdate}
            </span>
          )}
        </div>

        {/* ── Indicadores ── */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${variant === 'empresa' ? 5 : 3}, 1fr)`,
            gap: 10, marginBottom: 32,
          }} className="sm:grid">
            {Array.from({ length: variant === 'empresa' ? 10 : 6 }).map((_, i) => (
              <div key={i} style={{
                height: 80, borderRadius: 10,
                background: isDark ? 'rgba(143,184,204,0.04)' : 'rgba(0,0,0,0.04)',
                border: cardBorder,
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: variant === 'empresa'
              ? 'repeat(5, 1fr)'
              : 'repeat(3, 1fr)',
            gap: variant === 'empresa' ? 8 : 10,
            marginBottom: 32,
          }}
            className="market-grid"
          >
            {visibleItems.map(item => (
              <IndicatorCard key={item.key} item={item} variant={variant} />
            ))}
          </div>
        ) : null}

        {/* ── Noticias ── */}
        {news.length > 0 && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <span style={{
                fontSize: variant === 'empresa' ? 12 : 11, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: subtitleColor,
              }}>
                {variant === 'empresa' ? 'Noticias de alto impacto' : 'Noticias del día'}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={prevNews} style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: isDark ? 'rgba(143,184,204,0.08)' : 'rgba(0,0,0,0.05)',
                  border: cardBorder, color: isDark ? 'rgba(148,163,184,0.7)' : '#64748b',
                  transition: 'opacity 0.2s',
                }}>
                  <ChevronLeft size={15} />
                </button>
                <button onClick={nextNews} style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  background: isDark ? 'rgba(143,184,204,0.08)' : 'rgba(0,0,0,0.05)',
                  border: cardBorder, color: isDark ? 'rgba(148,163,184,0.7)' : '#64748b',
                  transition: 'opacity 0.2s',
                }}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Tarjeta principal de noticia */}
            {currentNews && (
              <div style={{
                background: cardBg, border: cardBorder,
                borderRadius: variant === 'empresa' ? 10 : 16,
                padding: variant === 'empresa' ? '20px 22px' : '20px 20px',
                marginBottom: 12,
                transition: 'opacity 0.3s',
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  {impactBadge(currentNews.impact_level, variant)}
                  {variant === 'empresa' && (() => {
                    const dl = directionLabel(currentNews.direction);
                    return (
                      <span style={{ fontSize: 10, fontWeight: 700, color: dl.color, letterSpacing: '0.05em' }}>
                        {dl.label}
                      </span>
                    );
                  })()}
                  {currentNews.source && (
                    <span style={{ fontSize: 10, color: subtitleColor, marginLeft: 'auto' }}>
                      {currentNews.source} · {currentNews.fetched_lima || currentNews.published_lima}
                    </span>
                  )}
                </div>

                <p style={{
                  margin: '0 0 8px', fontWeight: 700, lineHeight: 1.4,
                  fontSize: variant === 'empresa' ? 14 : 15,
                  color: titleColor,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                }}>
                  {currentNews.title}
                </p>

                {currentNews.summary && (
                  <p style={{
                    margin: '0 0 12px', fontSize: 12, lineHeight: 1.6,
                    color: isDark ? 'rgba(148,163,184,0.65)' : '#64748b',
                    display: '-webkit-box', WebkitLineClamp: variant === 'empresa' ? 2 : 3,
                    WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {currentNews.summary}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Dots */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    {news.map((_, i) => (
                      <button key={i} onClick={() => { setNewsIdx(i); resetTimer(); }} style={{
                        width: i === newsIdx ? 18 : 5, height: 5, borderRadius: 3,
                        background: i === newsIdx ? '#22c55e' : (isDark ? 'rgba(143,184,204,0.2)' : 'rgba(0,0,0,0.15)'),
                        border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s',
                      }} />
                    ))}
                  </div>
                  {currentNews.url && (
                    <a href={currentNews.url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 11, color: '#22c55e', fontWeight: 600, textDecoration: 'none',
                    }}>
                      Ver nota <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Mini cards — 3 noticias adicionales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
              className="news-mini-grid"
            >
              {news.filter((_, i) => i !== newsIdx).slice(0, 3).map(n => (
                <button key={n.id} onClick={() => { setNewsIdx(news.indexOf(n)); resetTimer(); }}
                  style={{
                    textAlign: 'left', background: cardBg, border: cardBorder,
                    borderRadius: variant === 'empresa' ? 8 : 12,
                    padding: '10px 12px', cursor: 'pointer',
                    transition: 'opacity 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {impactBadge(n.impact_level, variant)}
                  <p style={{
                    margin: '6px 0 0', fontSize: 11, fontWeight: 600,
                    color: titleColor, lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {n.title}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .market-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .news-mini-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
