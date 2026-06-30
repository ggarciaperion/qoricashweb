/**
 * Script de cron para verificar alertas de tipo de cambio.
 * Ejecutado por Render Cron Job cada 5 minutos.
 */

const APP_URL    = process.env.APP_URL    || 'https://www.qoricash.pe';
const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.error('[alertas-check] ERROR: CRON_SECRET no configurado');
  process.exit(1);
}

const url = `${APP_URL}/api/alertas/check?secret=${encodeURIComponent(CRON_SECRET)}`;

try {
  const res = await fetch(url);
  const data = await res.json();
  console.log(`[alertas-check] OK — checked:${data.checked} triggered:${data.triggered} sent:${data.sent}`);
  process.exit(0);
} catch (err) {
  console.error('[alertas-check] ERROR:', err.message);
  process.exit(1);
}
