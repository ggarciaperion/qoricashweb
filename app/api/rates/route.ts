import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://app.qoricash.pe';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/platform/public/exchange-rates`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, message: 'Error al obtener tasas' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error de conexión con el servidor' }, { status: 503 });
  }
}
