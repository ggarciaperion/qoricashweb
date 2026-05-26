"""Envía un correo de prueba de alerta TC usando Gmail OAuth2."""
import base64, json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TOKEN      = '/Users/gianpierre/Desktop/Prospeccion/token.json'
SCOPES     = ['https://mail.google.com/']
TO         = 'ggarciaperion@gmail.com'
FROM       = 'ggarcia@qoricash.pe'

# Valores de prueba
compra     = 3.720
venta      = 3.750
tc_actual  = venta   # alerta de venta
valor      = 3.740
condicion  = 'por encima de'
label      = 'Venta'
nombre     = 'Gianpierre'

html = f"""
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
              &iexcl;El d&oacute;lar est&aacute; {condicion} S/ {valor:.3f}!
            </h1>

            <!-- TC Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #bbf7d0;border-radius:10px;margin:0 0 24px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">Tipo de cambio {label} ahora</p>
                  <p style="margin:0;font-size:36px;font-weight:900;color:#15803d;letter-spacing:-1px;">S/ {tc_actual:.3f}</p>
                  <p style="margin:6px 0 0;font-size:12px;color:#4ade80;">
                    Tu alerta: <strong>{condicion} S/ {valor:.3f}</strong>
                  </p>
                </td>
                <td align="right" style="padding:20px 24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;">
                        <span style="font-size:11px;color:#64748b;">Compra&nbsp;&nbsp;</span>
                        <strong style="font-size:13px;color:#1e293b;">S/ {compra:.3f}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;">
                        <span style="font-size:11px;color:#64748b;">Venta&nbsp;&nbsp;&nbsp;</span>
                        <strong style="font-size:13px;color:#1e293b;">S/ {venta:.3f}</strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
              Hola <strong>{nombre}</strong>, la alerta que creaste en QoriCash acaba de activarse.
              Es un buen momento para revisar si quieres realizar un cambio de d&oacute;lares.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#5CB85C;border-radius:8px;">
                  <a href="https://www.qoricash.pe" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">
                    Cambiar d&oacute;lares ahora &rarr;
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
</html>"""

creds = Credentials.from_authorized_user_file(TOKEN, SCOPES)
service = build('gmail', 'v1', credentials=creds)

msg = MIMEMultipart('alternative')
msg['Subject'] = f'⚡ Alerta TC: el dólar ({label}) está {condicion} S/ {valor:.3f}'
msg['From']    = FROM
msg['To']      = TO
msg.attach(MIMEText(html, 'html'))

raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
result = service.users().messages().send(userId='me', body={'raw': raw}).execute()
print(f'Enviado. Message ID: {result["id"]}')
