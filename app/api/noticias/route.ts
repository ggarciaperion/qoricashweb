import { NextRequest, NextResponse } from 'next/server';
import { getNoticias, addNoticia } from '@/lib/noticias';

export async function GET() {
  try {
    const noticias = await getNoticias();
    return NextResponse.json(noticias);
  } catch {
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { titulo, descripcion, contenido, analisis, categoria, fuente, destacada, imagen } = body;

    if (!titulo || !descripcion || !contenido || !categoria || !fuente) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const noticia = await addNoticia({
      titulo,
      descripcion,
      contenido,
      analisis: analisis || '',
      categoria,
      fuente,
      destacada: Boolean(destacada),
      imagen: imagen || undefined,
    });

    return NextResponse.json(noticia, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear noticia' }, { status: 500 });
  }
}
