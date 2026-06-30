import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [sunatRes, sbsRes] = await Promise.allSettled([
      fetch('https://api.apis.net.pe/v2/sunat/tipo-cambio', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }),
      fetch('https://api.apis.net.pe/v2/sbs/tipo-cambio-usd', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }),
    ]);

    let sunat: any = null;
    let sbs: any = null;

    if (sunatRes.status === 'fulfilled' && sunatRes.value.ok) {
      sunat = await sunatRes.value.json();
    }
    if (sbsRes.status === 'fulfilled' && sbsRes.value.ok) {
      sbs = await sbsRes.value.json();
    }

    return NextResponse.json({ sunat, sbs });
  } catch {
    return NextResponse.json({ sunat: null, sbs: null });
  }
}
