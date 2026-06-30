import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://app.qoricash.pe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/web/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();

      if (text === 'Not Found') {
        return NextResponse.json(
          { success: false, message: 'El servidor está temporalmente inactivo. Por favor, intenta nuevamente en unos minutos.' },
          { status: 503 }
        );
      }

      try {
        const errorData = JSON.parse(text);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { success: false, message: `Error del servidor: ${response.statusText}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error al conectar con el servidor. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
