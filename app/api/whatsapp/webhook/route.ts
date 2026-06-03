import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const VERIFY_TOKEN   = process.env.WA_VERIFY_TOKEN   ?? 'qoricash_wa_verify_2026'
const SPREADSHEET_ID = process.env.WA_SHEETS_ID       ?? '1JERPeGFzZPkgB9of22gFGf6_ckJjAOnnR0bxDA55c-A'
const SHEET_NAME     = 'WA_Respuestas'

function getSheets() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return google.sheets({ version: 'v4', auth })
}

async function appendRow(row: string[]) {
  const sheets = getSheets()
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:F`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
}

// ── GET — verificación del webhook ────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WA Webhook] Verificación OK')
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// ── POST — mensajes entrantes ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    // Solo procesar mensajes (no estados de entrega)
    const messages = value?.messages
    if (!messages?.length) {
      return NextResponse.json({ status: 'ok' })
    }

    const contacts = value?.contacts ?? []

    for (const msg of messages) {
      const numero  = msg.from ?? ''
      const wa_id   = msg.id   ?? ''
      const tipo    = msg.type ?? ''

      let texto = ''
      if (tipo === 'text')     texto = msg.text?.body ?? ''
      else if (tipo === 'image')  texto = '[Imagen]'
      else if (tipo === 'audio')  texto = '[Audio]'
      else if (tipo === 'video')  texto = '[Video]'
      else if (tipo === 'document') texto = '[Documento]'
      else texto = `[${tipo}]`

      // Buscar nombre en contacts
      const contacto = contacts.find((c: { wa_id: string }) => c.wa_id === numero)
      const nombre   = contacto?.profile?.name ?? ''

      const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })

      console.log(`[WA Webhook] Mensaje de +${numero} (${nombre}): ${texto}`)

      await appendRow([fecha, `+${numero}`, nombre, '', texto, wa_id])
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[WA Webhook] Error:', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
