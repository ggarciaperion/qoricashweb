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

function Arrow({ isUp, isDown }: { isUp: boolean; isDown: boolean }) {
  if (isUp)   return <span style={{ fontSize: 9, lineHeight: 1 }} className="text-emerald-400 font-bold">▲</span>;
  if (isDown) return <span style={{ fontSize: 9, lineHeight: 1 }} className="text-red-400 font-bold">▼</span>;
  return       <span style={{ fontSize: 9, lineHeight: 1 }} className="text-white/30">▬</span>;
}

function TickerItem({ item }: { item: TickerItem }) {
  const chg = item.chg;
  const isUp   = chg !== null ? chg > 0  : false;
  const isDown = chg !== null ? chg < 0  : false;
  const hasChg = chg !== null;

  const valueColor = isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-white';

  return (
    <span className="inline-flex items-center gap-1.5 px-4 border-r border-white/10 whitespace-nowrap">
      <Arrow isUp={isUp} isDown={isDown} />
      <span className="text-white/45 text-[10px] uppercase tracking-widest font-medium">
        {item.label}
      </span>
      <span className={`${valueColor} text-[11px] font-bold tabular-nums`}>
        {formatValue(item)}
      </span>
      {hasChg && (
        <span className={`text-[10px] font-medium tabular-nums ${isUp ? 'text-emerald-400/80' : isDown ? 'text-red-400/80' : 'text-white/30'}`}>
          {isUp ? '+' : ''}{chg!.toFixed(2)}%
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
      className="w-full overflow-hidden bg-[#0a1628] border-b border-white/10"
      style={{ position: 'fixed', top: '80px', left: 0, right: 0, height: '30px', zIndex: 40 }}
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
    </div>
  );
}
