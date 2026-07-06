import { NextResponse } from 'next/server';

// Series BCRP: PD04637PD = compra interbancaria, PD04638PD = venta interbancaria
const BCRP_URL = 'https://estadisticas.bcrp.gob.pe/estadisticas/full/api/PD04637PD-PD04638PD/diario/json/es';

function getDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 14); // 14 días para asegurar 7 hábiles
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-US', { month: 'short' })}-${String(d.getFullYear()).slice(-2)}`;
  return { fechaInicio: fmt(start), fechaFin: fmt(end) };
}

export async function GET() {
  try {
    const { fechaInicio, fechaFin } = getDateRange();
    const url = `${BCRP_URL}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`BCRP ${res.status}`);

    const data = await res.json();

    const periods: Array<{ fecha: string; compra: number; venta: number }> = [];
    for (const p of (data.periods || [])) {
      const compra = parseFloat(p.values?.[0]);
      const venta  = parseFloat(p.values?.[1]);
      if (!isNaN(compra) && !isNaN(venta)) {
        periods.push({ fecha: p.name, compra, venta });
      }
    }
    const last7 = periods.slice(-7);

    return NextResponse.json({ ok: true, data: last7 });
  } catch {
    return NextResponse.json({ ok: false, data: [] }, { status: 502 });
  }
}
