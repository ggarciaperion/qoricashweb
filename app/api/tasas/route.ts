import { NextResponse } from 'next/server';

async function fetchSunat() {
  const res = await fetch('https://www.sunat.gob.pe/a/txt/tipoCambio.txt', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const text = await res.text();
  // formato: DD/MM/YYYY|compra|venta|
  const parts = text.trim().split('|');
  if (parts.length < 3) return null;
  const compra = parseFloat(parts[1]);
  const venta  = parseFloat(parts[2]);
  if (isNaN(compra) || isNaN(venta)) return null;
  return { compra, venta, fecha: parts[0] };
}

async function fetchSbs() {
  // BCRP publica el TC Sistema bancario SBS (S/ por US$)
  // PD04639PD = Compra, PD04640PD = Venta
  const headers = { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json, text/html' };
  const [compraRes, ventaRes] = await Promise.all([
    fetch('https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD/json', {
      headers, next: { revalidate: 3600 },
    }),
    fetch('https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04640PD/json', {
      headers, next: { revalidate: 3600 },
    }),
  ]);
  if (!compraRes.ok || !ventaRes.ok) return null;

  const compraData = await compraRes.json();
  const ventaData  = await ventaRes.json();

  const getLastValid = (data: any): number | null => {
    const periods: Array<{ name: string; values: string[] }> = data.periods ?? [];
    for (let i = periods.length - 1; i >= 0; i--) {
      const v = parseFloat(periods[i].values[0]);
      if (!isNaN(v)) return v;
    }
    return null;
  };

  const compra = getLastValid(compraData);
  const venta  = getLastValid(ventaData);
  if (compra === null || venta === null) return null;
  return { compra, venta };
}

export async function GET() {
  try {
    const [sunat, sbs] = await Promise.allSettled([fetchSunat(), fetchSbs()]);

    return NextResponse.json({
      sunat: sunat.status === 'fulfilled' ? sunat.value : null,
      sbs:   sbs.status   === 'fulfilled' ? sbs.value   : null,
    });
  } catch {
    return NextResponse.json({ sunat: null, sbs: null });
  }
}
