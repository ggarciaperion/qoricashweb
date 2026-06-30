import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://app.qoricash.pe';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get('dni') || '';

  try {
    const response = await fetch(`${BACKEND_URL}/api/web/check-document?dni=${encodeURIComponent(dni)}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ exists: false });
  }
}
