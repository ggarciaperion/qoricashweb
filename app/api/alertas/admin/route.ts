import { NextRequest, NextResponse } from 'next/server';
import { getAlertas, getLastCheck } from '@/lib/alertas';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const [alertas, lastCheck] = await Promise.all([getAlertas(), getLastCheck()]);
  return NextResponse.json({ alertas, lastCheck });
}
