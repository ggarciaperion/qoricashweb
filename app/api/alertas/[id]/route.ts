import { NextRequest, NextResponse } from 'next/server';
import { deleteAlerta } from '@/lib/alertas';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const userId = Number(body.userId);
  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
  const deleted = await deleteAlerta(id, userId);
  if (!deleted) return NextResponse.json({ error: 'Alerta no encontrada' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
