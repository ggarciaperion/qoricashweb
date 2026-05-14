import { NextRequest, NextResponse } from 'next/server';
import { getAlertasByUser, addAlerta } from '@/lib/alertas';

export async function GET(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get('userId'));
  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
  const alertas = await getAlertasByUser(userId);
  return NextResponse.json(alertas);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, nombre, tipo, valor, moneda } = body;

    if (!email || !nombre || !tipo || !valor || !moneda) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    if (!['sobre', 'bajo'].includes(tipo)) {
      return NextResponse.json({ error: 'tipo debe ser "sobre" o "bajo"' }, { status: 400 });
    }
    if (!['compra', 'venta'].includes(moneda)) {
      return NextResponse.json({ error: 'moneda debe ser "compra" o "venta"' }, { status: 400 });
    }

    const esProspecto = !userId;
    const alerta = await addAlerta({
      userId: userId ? Number(userId) : undefined,
      email,
      nombre,
      tipo,
      valor: Number(valor),
      moneda,
      esProspecto,
    });
    return NextResponse.json(alerta, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear alerta' }, { status: 500 });
  }
}
