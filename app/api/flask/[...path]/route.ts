import { NextRequest, NextResponse } from 'next/server';

const FLASK_BASE = 'https://app.qoricash.pe';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const flaskPath = '/' + path.join('/');
    const search = req.nextUrl.search || '';
    const url = `${FLASK_BASE}${flaskPath}${search}`;

    const bodyText = req.method !== 'GET' && req.method !== 'HEAD'
      ? await req.text()
      : undefined;

    const headers: Record<string, string> = {
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;

    const flaskRes = await fetch(url, {
      method: req.method,
      headers,
      body: bodyText,
    });

    const responseText = await flaskRes.text();

    return new NextResponse(responseText, {
      status: flaskRes.status,
      headers: {
        'Content-Type': flaskRes.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err: any) {
    console.error('[flask-proxy] error:', err?.message, err?.cause);
    return NextResponse.json({ success: false, message: err?.message || 'Proxy error' }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
