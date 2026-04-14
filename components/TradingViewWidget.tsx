'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window { TradingView: any; }
}

const CONTAINER_ID = 'tv_usdpen_chart';

export default function TradingViewWidget() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Contenedor interno para el widget
    wrapperRef.current.innerHTML = `<div id="${CONTAINER_ID}" style="height:400px;width:100%;"></div>`;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (!window.TradingView) return;
      new window.TradingView.widget({
        container_id: CONTAINER_ID,
        autosize: true,
        symbol: 'FX_IDC:USDPEN',
        interval: 'D',
        timezone: 'America/Lima',
        theme: 'light',
        style: '3',        // area chart
        locale: 'es',
        toolbar_bg: '#f8fafc',
        enable_publishing: false,
        allow_symbol_change: false,
        save_image: false,
        hide_volume: true,
        withdateranges: true,
      });
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ minHeight: 400 }}
    />
  );
}
