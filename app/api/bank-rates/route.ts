import { NextResponse } from 'next/server';

export const revalidate = 600; // 10 minutos — SBS actualiza tasas durante el día

// Mapeo de nombres de empresa SBS → nombre corto
const BANK_NAMES: Record<string, string> = {
  'BANCO DE CRÉDITO DEL PERÚ':          'BCP',
  'BANCO DE CREDITO DEL PERU':          'BCP',
  'B. DE CRÉDITO DEL PERÚ':             'BCP',
  'B. CRÉDITO DEL PERÚ':                'BCP',
  'BBVA PERÚ':                          'BBVA',
  'BBVA PERU':                          'BBVA',
  'BBVA':                               'BBVA',
  'BANCO CONTINENTAL':                  'BBVA',
  'BBVA CONTINENTAL':                   'BBVA',
  'INTERBANK':                          'Interbank',
  'BANCO INTERNACIONAL DEL PERÚ':       'Interbank',
  'BANCO INTERNACIONAL DEL PERU':       'Interbank',
  'B. INTERNACIONAL DEL PERÚ':          'Interbank',
  'SCOTIABANK PERÚ':                    'Scotiabank',
  'SCOTIABANK PERU':                    'Scotiabank',
  'SCOTIABANK':                         'Scotiabank',
};

const TARGET_BANKS = ['BCP', 'Interbank', 'BBVA', 'Scotiabank'];

type BankRate = { compra: string; venta: string };

function normalize(s: string) {
  return s
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function lookupBank(raw: string): string | null {
  const n = normalize(raw);
  for (const [key, val] of Object.entries(BANK_NAMES)) {
    if (n.includes(normalize(key)) || normalize(key).includes(n)) return val;
  }
  return null;
}

/** Parsea el HTML de la SBS y extrae tasas por banco */
function parseSBS(html: string): Record<string, BankRate> {
  const result: Record<string, BankRate> = {};

  // Busca filas de tabla que contengan nombre de entidad + dos números decimales
  // Patrón: <td>...nombre...</td>...<td>3.xxx</td>...<td>3.xxx</td>
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const numRe = /^\d+[.,]\d{3}$/;

  let rowMatch;
  while ((rowMatch = rowRe.exec(html)) !== null) {
    const row = rowMatch[1];
    const cells: string[] = [];
    let cellMatch;
    const re2 = new RegExp(cellRe.source, 'gi');
    while ((cellMatch = re2.exec(row)) !== null) {
      const text = cellMatch[1].replace(/<[^>]+>/g, '').trim();
      cells.push(text);
    }

    if (cells.length < 3) continue;

    // Encuentra la primera celda con texto (nombre del banco)
    const nameCell = cells.find(c => c.length > 3 && !/^\d/.test(c));
    if (!nameCell) continue;
    const bankName = lookupBank(nameCell);
    if (!bankName) continue;

    // Encuentra dos celdas numéricas (compra/venta)
    const nums = cells.filter(c => numRe.test(c.replace(',', '.')));
    if (nums.length < 2) continue;

    result[bankName] = {
      compra: parseFloat(nums[0].replace(',', '.')).toFixed(3),
      venta:  parseFloat(nums[1].replace(',', '.')).toFixed(3),
    };
  }

  return result;
}

export async function GET() {
  try {
    const res = await fetch(
      'https://www.sbs.gob.pe/app/pp/sistip_portal/paginas/publicacion/tipocambio/TipoCambioB.aspx',
      {
        next: { revalidate: 600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; QoriCashWeb/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'es-PE,es;q=0.9',
        },
      }
    );

    if (!res.ok) throw new Error(`SBS HTTP ${res.status}`);

    const html = await res.text();
    const parsed = parseSBS(html);

    // Construye la respuesta con solo los 4 bancos objetivo
    const banks: Record<string, BankRate | null> = {};
    for (const bank of TARGET_BANKS) {
      banks[bank] = parsed[bank] ?? null;
    }

    const found = TARGET_BANKS.filter(b => parsed[b]).length;

    return NextResponse.json(
      { banks, source: 'sbs', found },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' } }
    );
  } catch (err) {
    return NextResponse.json(
      { banks: null, source: 'error', error: err instanceof Error ? err.message : 'unknown' },
      { status: 200 } // 200 para que el cliente no rompa
    );
  }
}
