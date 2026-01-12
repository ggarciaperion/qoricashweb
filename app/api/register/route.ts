import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qoricash-trading-v2.onrender.com';

/**
 * Proxy API para registro de clientes
 *
 * Evita problemas de CORS redirigiendo la petición desde el servidor Next.js
 * al backend en Render
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener el body de la petición
    const body = await request.json();

    console.log('🔄 Proxy: Redirigiendo registro a backend...', {
      backend: BACKEND_URL,
      tipo_persona: body.tipo_persona,
      dni: body.dni
    });

    // Hacer la petición al backend
    const response = await fetch(`${BACKEND_URL}/api/client/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Obtener la respuesta
    const data = await response.json();

    console.log('✅ Proxy: Respuesta del backend:', {
      success: data.success,
      message: data.message
    });

    // Devolver la respuesta al frontend
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error('❌ Proxy: Error al conectar con backend:', error);

    return NextResponse.json(
      {
        success: false,
        message: `Error al conectar con el servidor: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
