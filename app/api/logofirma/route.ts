import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Leer el archivo desde la carpeta public
    const filePath = path.join(process.cwd(), 'public', 'logofirma.png');
    const imageBuffer = fs.readFileSync(filePath);

    // Retornar la imagen con headers apropiados
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error al cargar logofirma.png:', error);
    return NextResponse.json(
      { error: 'Logo no encontrado' },
      { status: 404 }
    );
  }
}
