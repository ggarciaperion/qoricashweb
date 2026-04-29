import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qoricash-trading-v2.onrender.com';
const TICKER_API_KEY = process.env.TICKER_API_KEY || '';

export const revalidate = 60; // cache 60 segundos — todos los visitantes comparten el mismo fetch

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/mercado/api/ticker`, {
      headers: { 'X-Ticker-Key': TICKER_API_KEY },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, items: [] }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch {
    // Si el backend no responde, devuelve vacío sin romper la página
    return NextResponse.json({ success: false, items: [] }, { status: 200 });
  }
}
