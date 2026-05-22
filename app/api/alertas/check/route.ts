import { NextRequest, NextResponse } from 'next/server';
import { getAlertas, markAlertasNotificadas, updateLastCheck, type AlertaTC } from '@/lib/alertas';

// ── TC fetcher ─────────────────────────────────────────────────────────────────
async function fetchTC(): Promise<{ compra: number; venta: number }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${apiUrl}/api/platform/public/exchange-rates`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`TC fetch failed: HTTP ${res.status}`);
  const data = await res.json();
  const compra = Number(data.data?.tipo_compra ?? data.tipo_compra);
  const venta  = Number(data.data?.tipo_venta  ?? data.tipo_venta);
  if (!compra || !venta) throw new Error('TC inválido recibido del backend');
  return { compra, venta };
}

// ── Email sender ──────────────────────────────────────────────────────────────
async function sendAlertEmail(alerta: AlertaTC, compra: number, venta: number): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // CRITICAL: throw so the caller knows the email was NOT sent
    throw new Error('RESEND_API_KEY no configurada — email no enviado');
  }

  const tcActual = alerta.moneda === 'compra' ? compra : venta;
  const label = alerta.moneda === 'compra' ? 'Compra' : 'Venta';
  const condicion = alerta.tipo === 'sobre' ? 'por encima de' : 'por debajo de';

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0D1B2A;padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;padding-right:10px;">
                        <img src="https://app.qoricash.pe/static/images/logo-email.png" height="42" alt="QoriCash" style="display:block;border:0;"/>
                      </td>
                      <td style="vertical-align:middle;">
                        <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:2px;text-transform:uppercase;">QORICASH</span>
                        <br/>
                        <span style="font-size:10px;color:#94a3b8;letter-spacing:0.5px;">Casa de Cambio Digital</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="background:#5CB85C;color:#ffffff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:20px;">&#9650; Alerta activada</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 24px;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Tu alerta de tipo de cambio</p>
            <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#0D1B2A;line-height:1.3;">
              ¡El dólar está ${condicion} S/ ${alerta.valor.toFixed(3)}!
            </h1>

            <!-- TC Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #bbf7d0;border-radius:10px;margin:0 0 24px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Tipo de cambio ${label} ahora</p>
                  <p style="margin:0;font-size:36px;font-weight:900;color:#15803d;letter-spacing:-1px;">S/ ${tcActual.toFixed(3)}</p>
                  <p style="margin:6px 0 0;font-size:12px;color:#4ade80;">
                    Tu alerta: <strong>${condicion} S/ ${alerta.valor.toFixed(3)}</strong>
                  </p>
                </td>
                <td align="right" style="padding:20px 24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;">
                        <span style="font-size:11px;color:#64748b;">Compra&nbsp;&nbsp;</span>
                        <strong style="font-size:13px;color:#1e293b;">S/ ${compra.toFixed(3)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;">
                        <span style="font-size:11px;color:#64748b;">Venta&nbsp;&nbsp;&nbsp;</span>
                        <strong style="font-size:13px;color:#1e293b;">S/ ${venta.toFixed(3)}</strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
              Hola <strong>${alerta.nombre}</strong>, la alerta que creaste en QoriCash acaba de activarse.
              Es un buen momento para revisar si quieres realizar un cambio de dólares.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#5CB85C;border-radius:8px;">
                  <a href="https://www.qoricash.pe" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">
                    Cambiar dólares ahora &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:16px 32px;">
            <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
              Esta alerta fue creada por ti en <strong>www.qoricash.pe</strong>.
              Si ya no deseas recibirlas, puedes administrarlas desde tu cuenta.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: 'QoriCash <info@qoricash.pe>',
    to: alerta.email,
    subject: `⚡ Alerta TC: el dólar (${label}) está ${condicion} S/ ${alerta.valor.toFixed(3)}`,
    html,
  });
}

// ── Core check logic (shared by GET cron + POST manual) ───────────────────────
async function runCheck(compra?: number, venta?: number): Promise<NextResponse> {
  try {
    if (!compra || !venta) {
      const tc = await fetchTC();
      compra = tc.compra;
      venta  = tc.venta;
    }

    const alertas = await getAlertas();
    const activas = alertas.filter((a) => a.activa && !a.notificada);

    const disparadas: AlertaTC[] = [];
    for (const alerta of activas) {
      const tcActual = alerta.moneda === 'compra' ? compra! : venta!;
      const cumplida =
        (alerta.tipo === 'sobre' && tcActual >= alerta.valor) ||
        (alerta.tipo === 'bajo'  && tcActual <= alerta.valor);
      if (cumplida) disparadas.push(alerta);
    }

    let sent = 0;
    let failed = 0;
    const sentIds: string[] = [];
    const notificada_at = new Date().toISOString();

    if (disparadas.length > 0) {
      const results = await Promise.allSettled(
        disparadas.map((a) => sendAlertEmail(a, compra!, venta!))
      );

      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          sentIds.push(disparadas[i].id);
          sent++;
        } else {
          failed++;
          console.error(`[alertas/check] Email FAILED for ${disparadas[i].email}:`, result.reason);
        }
      });

      // Only mark as notified the ones whose email was actually sent
      if (sentIds.length > 0) {
        await markAlertasNotificadas(sentIds, {
          notificada_at,
          tc_disparado: venta,  // store the TC at trigger time
        });
      }
    }

    const summary = {
      checked: activas.length,
      triggered: disparadas.length,
      sent,
      failed,
      compra,
      venta,
    };

    // Persist last check info
    await updateLastCheck({ ...summary, at: notificada_at }).catch(() => {});

    return NextResponse.json(summary);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error interno';
    console.error('[alertas/check]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ── GET handler — Vercel Cron calls this ──────────────────────────────────────
export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === 'true';
  const secret = req.nextUrl.searchParams.get('secret');
  const isAuthorized = isVercelCron || (secret && secret === process.env.CRON_SECRET);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  return runCheck();
}

// ── POST handler — manual trigger from Flask dashboard ────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const compra = body?.compra ? Number(body.compra) : undefined;
  const venta  = body?.venta  ? Number(body.venta)  : undefined;
  return runCheck(compra, venta);
}
