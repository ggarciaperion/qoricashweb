import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qoricash-trading-v2.onrender.com';

export async function GET(request: NextRequest) {
  const numero = request.nextUrl.searchParams.get('numero') || '';

  try {
    const response = await fetch(`${BACKEND_URL}/api/web/ruc-lookup?numero=${encodeURIComponent(numero)}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'No se pudo conectar con el servicio de consulta' },
      { status: 503 }
    );
  }
}
