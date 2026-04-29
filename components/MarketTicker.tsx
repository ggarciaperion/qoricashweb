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
  if (item.key === 'usdpen' || item.key === 'tc_bcrp') return `${item.prefix} ${v.toFixed(4)}`;
  if (item.key === 'eurusd') return `${item.prefix} ${v.toFixed(4)}`;
  if (item.key === 'dxy') return v.toFixed(3);
  if (item.key === 'vix' || item.key === 'copper') return `${item.prefix}${v.toFixed(3)}`;
  if (v >= 1000) return `${item.prefix}${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `${item.prefix}${v.toFixed(2)}${item.suffix}`;
}

function TickerItem({ item }: { item: TickerItem }) {
  const chg = item.chg;
  const isUp = chg !== null && chg > 0;
  const isDown = chg !== null && chg < 0;

  return (
    <span className="inline-flex items-center gap-2 px-5 border-r border-white/10 whitespace-nowrap">
      <span className="text-white/50 text-[10px] uppercase tracking-widest font-medium">
        {item.label}
      </span>
      <span className="text-white text-[11px] font-semibold tabular-nums">
        {formatValue(item)}
      </span>
      {chg !== null && (
        <span
          className={`text-[10px] font-semibold tabular-nums ${
            isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-white/40'
          }`}
        >
          {isUp ? '▲' : isDown ? '▼' : ''}
          {Math.abs(chg).toFixed(2)}%
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
      // fallo silencioso — no rompe la página
    }
  };

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  // Duplicar items para loop continuo sin salto
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden bg-[#0a1628] border-b border-white/8"
      style={{ height: '30px' }}
      aria-hidden="true"
    >
      <div
        className="flex items-center h-full"
        style={{
          animation: `ticker-scroll ${items.length * 5}s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((item, i) => (
          <TickerItem key={`${item.key}-${i}`} item={item} />
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
