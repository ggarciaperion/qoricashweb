'use client';

import { useEffect, useState } from 'react';

interface TickerItem {
  key: string;
  label: string;
  value: number | null;
  chg: number | null;
  prefix: string;
  suffix: string;
}

function formatValue(item: TickerItem): string {
  if (item.value === null || item.value === undefined) return '—';
  const v = item.value;
  if (item.suffix === '%') return `${v.toFixed(2)}%`;
  if (item.key === 'usdpen' || item.key === 'tc_bcrp') return `${item.prefix}${v.toFixed(4)}`;
  if (item.key === 'eurusd') return `${item.prefix}${v.toFixed(4)}`;
  if (item.key === 'dxy') return v.toFixed(3);
  if (item.key === 'vix' || item.key === 'copper') return `${item.prefix}${v.toFixed(3)}`;
  if (v >= 1000) return `${item.prefix}${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `${item.prefix}${v.toFixed(2)}${item.suffix}`;
}

function TickerCell({ item }: { item: TickerItem }) {
  const chg = item.chg;
  const isUp   = chg !== null && chg > 0;
  const isDown = chg !== null && chg < 0;

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap" style={{ padding: '0 20px', borderRight: '1px solid rgba(13,27,42,0.08)' }}>
      {/* Label */}
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(13,27,42,0.35)' }}>
        {item.label}
      </span>

      {/* Arrow */}
      {isUp   && <span style={{ fontSize: 8, color: '#16a34a', lineHeight: 1 }}>▲</span>}
      {isDown && <span style={{ fontSize: 8, color: '#dc2626', lineHeight: 1 }}>▼</span>}
      {!isUp && !isDown && <span style={{ fontSize: 8, color: 'rgba(13,27,42,0.18)', lineHeight: 1 }}>●</span>}

      {/* Value */}
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color: isUp ? '#16a34a' : isDown ? '#dc2626' : '#0D1B2A',
        letterSpacing: '0.01em',
      }}>
        {formatValue(item)}
      </span>

      {/* Change % */}
      {chg !== null && (
        <span style={{
          fontSize: 10,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          color: isUp ? 'rgba(22,163,74,0.70)' : isDown ? 'rgba(220,38,38,0.70)' : 'rgba(13,27,42,0.30)',
        }}>
          {isUp ? '+' : ''}{chg.toFixed(2)}%
        </span>
      )}
    </span>
  );
}

export default function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  const fetchTicker = async () => {
    try {
      const res = await fetch('/api/ticker', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items.filter((i: TickerItem) => i.value !== null));
      }
    } catch {
      // fallo silencioso
    }
  };

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];
  const duration = `${Math.max(items.length * 4, 30)}s`;

  return (
    <div
      className="overflow-hidden"
      style={{
        position: 'fixed',
        top: 80,
        left: 0,
        right: 0,
        height: 36,
        zIndex: 49,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(13,27,42,0.08)',
      }}
      aria-hidden="true"
    >
      {/* Fade izquierda */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{ width: 64, background: 'linear-gradient(to right, white 30%, transparent)', zIndex: 2 }}
      />

      {/* Contenido scrolling */}
      <div
        className="flex items-center h-full"
        style={{ animation: `ticker-scroll ${duration} linear infinite`, width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <TickerCell key={`${item.key}-${i}`} item={item} />
        ))}
      </div>

      {/* Fade derecha */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{ width: 64, background: 'linear-gradient(to left, white 30%, transparent)', zIndex: 2 }}
      />
    </div>
  );
}
