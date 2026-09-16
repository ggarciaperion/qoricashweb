import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://app.qoricash.pe';
const TICKER_API_KEY = process.env.TICKER_API_KEY || '';

export const revalidate = 300; // 5 minutos

export async function GET() {
  try {
    const headers = { 'X-Ticker-Key': TICKER_API_KEY };

    const [tickerRes, newsRes] = await Promise.allSettled([
      fetch(`${BACKEND_URL}/mercado/api/ticker`, { headers, next: { revalidate: 300 } }),
      fetch(`${BACKEND_URL}/mercado/api/news-public`, { headers, next: { revalidate: 300 } }),
    ]);

    const ticker = tickerRes.status === 'fulfilled' && tickerRes.value.ok
      ? await tickerRes.value.json()
      : { success: false, items: [] };

    const news = newsRes.status === 'fulfilled' && newsRes.value.ok
      ? await newsRes.value.json()
      : { success: false, news: [] };

    return NextResponse.json(
      { success: true, items: ticker.items ?? [], macro: ticker.macro ?? [], news: news.news ?? [] },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
  } catch {
    return NextResponse.json({ success: false, items: [], macro: [], news: [] }, { status: 200 });
  }
}
