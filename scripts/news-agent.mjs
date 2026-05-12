import Parser from 'rss-parser';
import Anthropic from '@anthropic-ai/sdk';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SITE_URL    = (process.env.SITE_URL    || 'https://qoricash.pe').replace(/\/$/, '');
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const model        = 'claude-sonnet-4-6';
const MAX_PER_RUN  = 3;
const MIN_SCORE    = 6;
const FEATURED_SCORE = 8;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const parser  = new Parser({
  timeout: 12000,
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content',   'mediaContent'],
      ['enclosure',       'enclosure'],
    ],
  },
});

const RSS_FEEDS = [
  // ── Nacional — solo Gestión (fuente oficial QoriCash) ─────────────────────
  { url: 'https://gestion.pe/arcio/rss/',              source: 'Gestión', hint: 'Nacional'   },
  { url: 'https://gestion.pe/economia/arcio/rss/',     source: 'Gestión', hint: 'Economía'   },
  { url: 'https://gestion.pe/tecnologia/arcio/rss/',   source: 'Gestión', hint: 'Tecnología' },

  // ── Internacional ─────────────────────────────────────────────────────────
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml',            source: 'BBC',       hint: 'Internacional' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml',               source: 'BBC',       hint: 'Internacional' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',    source: 'NYT',       hint: 'Internacional' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', source: 'NYT',       hint: 'Economía'      },

  // ── Economía / Forex ──────────────────────────────────────────────────────
  { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com', hint: 'Economía' },
  { url: 'https://www.investing.com/rss/news_14.rss', source: 'Investing.com', hint: 'Economía' },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', source: 'Bloomberg',  hint: 'Economía' },

  // ── Tecnología ────────────────────────────────────────────────────────────
  { url: 'https://techcrunch.com/feed/',    source: 'TechCrunch', hint: 'Tecnología'   },
  { url: 'https://www.wired.com/feed/rss',  source: 'Wired',      hint: 'Tecnología'   },
];

// ── FETCH FEEDS ───────────────────────────────────────────────────────────────
async function fetchFeeds() {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return parsed.items.slice(0, 8).map(item => ({
          title:       (item.title || '').trim(),
          description: (item.contentSnippet || item.summary || '').replace(/<[^>]+>/g, '').slice(0, 400),
          link:        item.link || '',
          source:      feed.source,
          hint:        feed.hint,
          imagen:      item.enclosure?.url
                    || item.mediaThumbnail?.$?.url
                    || item.mediaContent?.$?.url
                    || '',
        }));
      } catch (e) {
        console.warn(`  ! Feed failed [${feed.source}]: ${e.message}`);
        return [];
      }
    })
  );

  return results
    .flatMap(r => r.status === 'fulfilled' ? r.value : [])
    .filter(a => a.title.length > 10 && a.description.length > 10);
}

// ── GET EXISTING TITLES (deduplication) ───────────────────────────────────────
async function getExistingTitles() {
  try {
    const res      = await fetch(`${SITE_URL}/api/noticias`);
    const noticias = await res.json();
    // Store first 60 chars lowercased for fuzzy dedup
    return new Set(noticias.map(n => n.titulo.toLowerCase().slice(0, 60)));
  } catch {
    return new Set();
  }
}

function isDuplicate(article, existingTitles) {
  const key = article.title.toLowerCase().slice(0, 60);
  // Also check if any existing title contains the first 40 chars of this one
  const prefix = article.title.toLowerCase().slice(0, 40);
  for (const t of existingTitles) {
    if (t.includes(prefix) || key.includes(t.slice(0, 40))) return true;
  }
  return false;
}

// ── SCORE ARTICLES (Claude batch) ─────────────────────────────────────────────
async function scoreArticles(articles) {
  const batch = articles.slice(0, 40);
  const list  = batch
    .map((a, i) => `[${i}] [${a.source}/${a.hint}]\nTítulo: ${a.title}\nResumen: ${a.description.slice(0, 200)}`)
    .join('\n\n');

  const msg = await client.messages.create({
    model,
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `Eres analista senior de QoriCash, casa de cambio peruana especializada en PEN/USD.
Evalúa estos artículos por su relevancia para los clientes que compran y venden dólares en Perú.

Responde SOLO con JSON válido, sin markdown ni backticks:
{"scores":[{"idx":0,"score":8,"categoria":"Internacional","publicar":true},...]}

Criterios de score (1-10):
- 9-10: Decisión Fed, crisis cambiaria, guerra, colapso financiero sistémico
- 7-8: Inflación/empleo EEUU, política monetaria global, conflicto internacional, crisis política Perú, BCRP
- 5-6: Commodities, empresas importantes, política económica regional
- 1-4: Farándula, deportes, noticias locales sin impacto macro → publicar:false

Categorías: "Nacional", "Internacional", "Economía", "Tecnología", "Misceláneos"
- Tecnología solo si tiene impacto económico real (ej: IA desplazando empleos, regulación crypto, etc.)
- Misceláneos: noticias relevantes que no encajan en otra categoría

Artículos a evaluar:
${list}`,
    }],
  });

  try {
    const text  = msg.content[0].text;
    const match = text.match(/\{[\s\S]*"scores"[\s\S]*\}/);
    if (!match) throw new Error('No JSON found');
    const { scores } = JSON.parse(match[0]);
    return scores
      .filter(s => s.publicar && s.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_PER_RUN)
      .map(s => ({ ...batch[s.idx], score: s.score, categoria: s.categoria }));
  } catch (e) {
    console.error('  ! Score parse error:', e.message);
    return [];
  }
}

// ── REWRITE ARTICLE (Claude) ──────────────────────────────────────────────────
async function rewriteArticle(article) {
  const withAnalisis = !['Tecnología', 'Misceláneos'].includes(article.categoria) || article.score >= 7;

  const msg = await client.messages.create({
    model,
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `Eres editor de QoriCash (casa de cambio peruana, qoricash.pe). Reescribe esta noticia en español para publicarla en el sitio. No copies textualmente: reescribe con tus propias palabras manteniendo los datos clave.

NOTICIA ORIGINAL:
Fuente: ${article.source}
Título: ${article.title}
Resumen: ${article.description}
Categoría asignada: ${article.categoria}
Score de impacto: ${article.score}/10

Responde SOLO con JSON válido (sin markdown, sin backticks, sin comentarios):
{
  "titulo": "Título atractivo en español, máx 110 caracteres",
  "descripcion": "Resumen de 1-2 oraciones para la tarjeta de noticia, máx 190 caracteres",
  "contenido": "Artículo en 3 párrafos bien desarrollados. Incluye contexto, datos y antecedentes relevantes. Usa \\n\\n entre párrafos.",
  "analisis": ${withAnalisis
    ? '"Análisis de 2-3 oraciones sobre el impacto directo en el tipo de cambio PEN/USD y qué debería considerar alguien que quiere cambiar dólares"'
    : '""'},
  "destacada": ${article.score >= FEATURED_SCORE}
}`,
    }],
  });

  const raw = msg.content[0].text.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(raw);
}

// ── MANAGE DESTACADAS ─────────────────────────────────────────────────────────
async function demoteOldestDestacada() {
  try {
    const res      = await fetch(`${SITE_URL}/api/noticias`);
    const noticias = await res.json();
    const featured = noticias
      .filter(n => n.destacada)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (featured.length >= 2) {
      const oldest = featured[0];
      await fetch(`${SITE_URL}/api/noticias/${oldest.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body:    JSON.stringify({ destacada: false }),
      });
      console.log(`  - Demoted: "${oldest.titulo.slice(0, 55)}"`);
    }
  } catch (e) {
    console.error('  ! demoteOldestDestacada error:', e.message);
  }
}

// ── PUBLISH ───────────────────────────────────────────────────────────────────
async function publishArticle(article, rewritten) {
  if (rewritten.destacada) await demoteOldestDestacada();

  const res = await fetch(`${SITE_URL}/api/noticias`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({
      titulo:     rewritten.titulo,
      descripcion: rewritten.descripcion,
      contenido:  rewritten.contenido,
      analisis:   rewritten.analisis || '',
      categoria:  article.categoria,
      fuente:     article.source,
      destacada:  rewritten.destacada,
      imagen:     article.imagen || '',
    }),
  });

  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const marker = rewritten.destacada ? '[FEATURED]' : '[OK]';
  console.log(`  ${marker} score:${article.score} [${article.categoria}] "${rewritten.titulo.slice(0, 65)}"`);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  console.log(`\n=== QoriCash News Agent — ${new Date().toISOString()} ===`);

  if (!ADMIN_SECRET || !process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: Missing ADMIN_SECRET or ANTHROPIC_API_KEY');
    process.exit(1);
  }

  // 1. Fetch all feeds
  console.log('\n[1/4] Fetching RSS feeds...');
  const all = await fetchFeeds();
  console.log(`      ${all.length} articles fetched from ${RSS_FEEDS.length} sources`);

  // 2. Deduplicate
  console.log('[2/4] Deduplicating...');
  const existing = await getExistingTitles();
  const fresh = all.filter(a => !isDuplicate(a, existing));
  console.log(`      ${fresh.length} new articles (${all.length - fresh.length} already published)`);

  if (fresh.length === 0) {
    console.log('\nNothing new. Done.\n');
    return;
  }

  // 3. Score with Claude
  console.log('[3/4] Scoring with Claude...');
  const top = await scoreArticles(fresh);
  console.log(`      ${top.length} selected (score >= ${MIN_SCORE})`);

  if (top.length === 0) {
    console.log('\nNo articles met the threshold. Done.\n');
    return;
  }

  // 4. Rewrite & publish
  console.log('[4/4] Rewriting and publishing...');
  for (const article of top) {
    try {
      const rewritten = await rewriteArticle(article);
      await publishArticle(article, rewritten);
    } catch (e) {
      console.error(`  ! Failed "${article.title.slice(0, 50)}": ${e.message}`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n=== Done in ${elapsed}s ===\n`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
