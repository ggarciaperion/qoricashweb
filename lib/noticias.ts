import { Redis } from '@upstash/redis';

export interface Noticia {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  analisis: string;
  categoria: string;
  fuente: string;
  fecha: string;
  destacada: boolean;
  imagen?: string;
}

export const CATEGORIAS = [
  'Nacional',
  'Internacional',
  'Economía',
  'Tecnología',
  'Misceláneos',
] as const;

const REDIS_KEY = 'qoricash:noticias';

// ── Fecha base de hoy para los fallbacks ─────────────────────────────────────
const HOY = '2026-07-16T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'n001',
    titulo: 'CPI junio EE.UU. +3.5% anual — inflación modera pero Fed podría subir tasas el 29 de julio: probabilidad sube a 46.5%',
    descripcion: 'El IPC de junio de EE.UU. bajó 0.4% mensual y subió 3.5% anual, mejor que el consenso de 3.8%. El core CPI se mantuvo sin cambios en el mes (+2.6% anual). A pesar del dato favorable, el gobernador Waller advirtió que la Fed podría subir tasas si la inflación no cede. Reunión FOMC: 29 de julio.',
    contenido: `El Buró de Estadísticas Laborales publicó hoy el IPC de junio de 2026: -0.4% mensual y +3.5% interanual, ambas lecturas por debajo del consenso de Bloomberg (3.8% anual). El CPI subyacente —excluyendo alimentos y energía— se mantuvo sin variación mensual (0.0%) y subió 2.6% anual, desde el 2.9% de mayo. Es la desinflación más rápida en lo que va del año.

Sin embargo, la respuesta del mercado es ambigua: el S&P 500 cae 0.3% y el Nasdaq pierde más del 1%, mientras que el gobernador de la Fed Christopher Waller señaló que el FOMC "tendrá que considerar un endurecimiento de la política monetaria" si la inflación subyacente continúa mostrando presiones generalizadas. La probabilidad implícita de un alza de tasas en la reunión del 29 de julio subió al 46.5% según CME FedWatch —desde menos del 20% hace una semana—, en aparente contradicción con el dato benigno.

La paradoja se explica por el contexto de Oriente Medio: la escalada del conflicto entre EE.UU. e Irán presiona el petróleo al alza (+0.8% el Brent a US$ 84.95), lo que siembra dudas sobre si la inflación energética podría revertir los avances recientes. El mercado descuenta que la Fed preferiría "un alza preventiva" antes que ver un rebrote inflacionario en Q3.

La próxima señal clave será el PCE subyacente del 31 de julio —indicador favorito de la Fed—. Si confirma la desinflación, el escenario de pausa el 29 de julio recupera fuerza.`,
    analisis: `Un CPI de +3.5% anual es bienvenido, pero la Fed tiene un problema de credibilidad: si pausa mientras el petróleo sube y los mercados laborales siguen sólidos, arriesga que la inflación repunte en Q3. La postura hawkish de Waller refleja esa preocupación. Para el sol peruano, un dólar más fuerte (ante expectativas de alza Fed) presiona el TC hacia S/ 3.41-3.44. En QoriCash monitoreamos el FOMC del 29 de julio como el evento más importante del mes para el tipo de cambio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n002',
    titulo: 'Sol peruano opera en S/ 3.39 — BCRP mantuvo tasa en 4.25% en julio y proyecta PBI de 3.4% para 2026',
    descripcion: 'El tipo de cambio PEN/USD opera en S/ 3.39 este miércoles 16 de julio, estable pese a la tensión en Oriente Medio. El BCRP mantuvo su tasa de referencia en 4.25% en la reunión de julio. El banco central proyecta crecimiento del PBI peruano de 3.4% para 2026 e inversión privada de +12.5%.',
    contenido: `El tipo de cambio PEN/USD opera en S/ 3.39 este miércoles 16 de julio de 2026, prácticamente sin cambios respecto al cierre del martes. El sol muestra una notable estabilidad en la sesión pese al contexto externo adverso: escalada del conflicto en Oriente Medio, petróleo subiendo y expectativas de alza de la Fed en julio. La estabilidad refleja la solidez de los fundamentos macroeconómicos peruanos.

El BCRP mantuvo la tasa de interés de referencia en 4.25% en su reunión del Programa Monetario de julio, en línea con las expectativas del mercado. El directorio señaló que la inflación peruana continúa moderándose —0.23% mensual en junio, la más baja del año— y que el entorno externo, aunque más incierto, no justifica un cambio de postura por el momento. La tasa de 4.25% sitúa al BCRP 75bps por encima del límite superior del rango Fed Funds (3.50%), un diferencial atractivo para el carry en soles.

En cuanto a las perspectivas macroeconómicas, el BCRP elevó su proyección de crecimiento del PBI 2026 a 3.4% (desde 3.2% anterior), impulsado por la aceleración de la inversión privada (+12.5% proyectado, frente al +9.5% anterior). El consumo de cemento crece más del 11% y las importaciones de bienes de capital suben cerca del 25%, señales concretas de dinamismo en la inversión.

El soporte técnico del sol en S/ 3.38 se mantiene intacto. La resistencia inmediata está en S/ 3.42. El escenario base para las próximas dos semanas prevé que el PEN opere en el rango S/ 3.38-3.43, con el FOMC del 29 de julio como principal catalizador de volatilidad.`,
    analisis: `El sol en S/ 3.39 con el BCRP manteniendo el diferencial de tasas y el PBI creciendo 3.4% es un cuadro macroeconómico sólido. La inversión privada acelerando al 12.5% implica más demanda de insumos importados (dólares) pero también más producción futura que generará divisas. El punto de equilibrio del TC sigue siendo S/ 3.38-3.42. Para empresas con operaciones en dólares, el nivel actual es históricamente competitivo. En QoriCash le ofrecemos el mejor tipo de cambio del mercado, por encima del precio bancario.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n003',
    titulo: 'Brent US$ 84.95: EE.UU. ataca Irán y el petróleo sube — riesgo de rebrote inflacionario complica a la Fed',
    descripcion: 'El Brent retrocede 0.28% a US$ 84.95 por barril este 16 de julio mientras los operadores recogen beneficios tras los ataques estadounidenses en Irán. El crudo mantiene niveles altos por la escalada en Oriente Medio, lo que genera temores de que el rebrote energético dificulte el camino desinflacionario de la Fed.',
    contenido: `El petróleo Brent cotiza a US$ 84.95 por barril este miércoles 16 de julio, retrocediendo 0.28% (US$ 0.24) desde el cierre anterior mientras los operadores recogen ganancias tras la escalada de los últimos días. El WTI opera en US$ 82.50, también con ligera corrección. A pesar de la toma de beneficios de hoy, el crudo mantiene niveles significativamente elevados por la intensificación del conflicto en Oriente Medio, incluyendo nuevos ataques estadounidenses en instalaciones iraníes que han tensado las rutas de suministro del Golfo Pérsico.

El mercado evalúa dos escenarios: en el primero (60% de probabilidad), el conflicto se mantiene contenido y el Brent opera entre US$ 82-88/barril en Q3. En el segundo (40%), una escalada que involucre el Estrecho de Ormuz —por donde transita el 21% del petróleo mundial— podría disparar el Brent a US$ 100+ y reactivar la inflación energética globalmente.

Para la Fed, el petróleo en US$ 84-85 es un problema: aunque el CPI de junio fue benigno (-0.4% mensual), una energía cara en julio-agosto podría revertir ese avance. El gobernador Waller lo señaló explícitamente hoy al advertir que un "repunte de precios del petróleo" podría obligar a un alza de tasas el 29 de julio. Los futuros del gas natural también avanzan 1.2% en EE.UU.

Para el Perú, el Brent en US$ 84-85 encarece las importaciones de combustibles (Petroperú importa crudos y derivados) y puede generar presión inflacionaria en transporte y logística. El MINEM estima que cada US$ 10/barril de aumento en el Brent incrementa la factura energética del país en aproximadamente US$ 800M anuales.`,
    analisis: `El Brent en US$ 84.95 es el mayor riesgo macro del momento: si supera US$ 90, el escenario de recorte Fed se pospone indefinidamente y el dólar se fortalece globalmente. Para el sol peruano, un petróleo caro implica mayor demanda de dólares para importaciones energéticas y presión alcista sobre el TC. El nivel de S/ 3.42-3.45 sería el rango de ajuste en ese escenario. Monitoreamos el Estrecho de Ormuz y las declaraciones de la Fed como variables críticas. En QoriCash actualizamos nuestra visión del TC en tiempo real.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n004',
    titulo: 'Oro cae 0.6% a US$ 4,034 — conflicto Oriente Medio y hawkishness Fed generan presión vendedora',
    descripcion: 'El oro al contado retrocede 0.6% a US$ 4,034 por onza este 16 de julio. La caída es paradójica: pese a la escalada en Oriente Medio (factor alcista), los temores de que la Fed suba tasas el 29 de julio pesan más sobre el metal. Los futuros agosto ceden a US$ 4,039.',
    contenido: `El oro al contado (XAU/USD) retrocede 0.6% a US$ 4,034.42 por onza este miércoles 16 de julio de 2026, alejándose del máximo reciente de US$ 4,175 marcado la semana pasada. Los futuros con entrega en agosto pierden 0.3% a US$ 4,039.90. La caída es aparentemente paradójica: el conflicto en Oriente Medio —habitualmente un catalizador alcista para el oro por su papel de activo refugio— coexiste con una presión vendedora que domina la sesión.

La explicación está en el mercado de tasas: los temores de que la Fed suba tasas el 29 de julio (probabilidad 46.5%) están pesando más sobre el oro que la prima de riesgo geopolítico. La mecánica es directa: expectativa de tasas más altas → rendimientos de los Treasuries al alza (el bono a 10 años sube 8bps a 4.45%) → mayor costo de oportunidad de mantener oro (que no genera rendimiento) → presión vendedora en el metal.

El nivel de US$ 4,034 sitúa al oro en zona de soporte técnico clave: la MA20 diaria está en US$ 4,020 y la MA50 diaria en US$ 3,990. Si el metal pierde US$ 4,000, el siguiente soporte relevante es US$ 3,950-3,960 (mínimo de junio). Por el contrario, si la reunión del FOMC del 29 de julio no resulta en alza de tasas, el oro podría recuperar rápidamente US$ 4,100-4,150.

Goldman Sachs mantiene su precio objetivo de US$ 4,500/oz para diciembre de 2026, argumentando que las compras de bancos centrales emergentes (China, India, Polonia, Turquía) siguen siendo el soporte estructural más importante y no responden a los movimientos de corto plazo de la Fed.`,
    analisis: `El retroceso del oro a US$ 4,034 es una corrección técnica dentro de una tendencia alcista de largo plazo. Para el Perú, el precio sigue siendo muy favorable para los ingresos de exportación minera: a US$ 4,034/oz, la producción anual de ~100 toneladas equivale a US$ 12,970M en exportaciones. El impacto en el sol es neutral en el corto plazo: la corrección del oro reduce marginalmente la oferta de dólares futura, pero el nivel sigue siendo históricamente alto. La clave es el FOMC del 29 de julio: si no sube tasas, el oro volverá a US$ 4,100+.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n005',
    titulo: 'Inversión privada Perú crecerá 12.5% en 2026 — BCRP sube proyección: cemento +11%, bienes de capital +25%',
    descripcion: 'El BCRP revisó al alza su proyección de inversión privada para 2026 de 9.5% a 12.5%, la más alta en cinco años. El consumo interno de cemento crece más del 11% y las importaciones de bienes de capital suben cerca del 25%. La inversión minera aporta 11% y la no minera 16.7%. El PBI 2026 se proyecta en 3.4%.',
    contenido: `El Banco Central de Reserva del Perú revisó significativamente al alza su proyección de inversión privada para 2026, elevándola de 9.5% a 12.5% en su Programa Monetario de julio. Es el mayor crecimiento proyectado para la inversión privada desde 2021 y refleja una aceleración generalizada de la actividad económica que va más allá del sector minero.

Los indicadores adelantados confirman el dinamismo: el consumo interno de cemento —proxy de la construcción— crece más del 11% en términos acumulados a junio 2026. Las importaciones de bienes de capital, que incluyen maquinaria y equipos para industria y minería, registran incrementos cercanos al 25% en valor FOB, señal de que las empresas están expandiendo capacidad productiva con horizonte 2027-2028.

Por sectores, la inversión minera lidera con +11% (Quellaveco en plena capacidad, Tía María en inicio de construcción, expansión de Cerro Verde). La inversión no minera crece 16.7%, impulsada por proyectos de infraestructura vial (Autopista del Sol, Vía Expresa Línea 2), centros comerciales en regiones y expansión de cadenas de retail y logística. El sector manufactura también muestra señales de recuperación de la inversión en planta.

El PBI 2026 se proyecta en 3.4%, por encima del 3.2% estimado anteriormente. El BCRP destaca que la demanda interna está siendo el principal motor del crecimiento, a diferencia de años anteriores donde las exportaciones mineras llevaban el liderazgo. La inflación de junio (0.23% mensual) permite al BCRP mantener la tasa en 4.25% sin presiones adicionales.`,
    analisis: `Una inversión privada creciendo al 12.5% es una señal poderosa de confianza empresarial en el Perú: las empresas están comprometiendo capital a mediano plazo, lo que implica expectativas de estabilidad macroeconómica y política. Para el tipo de cambio, más inversión significa más demanda de bienes de capital importados (dólares) en el corto plazo, pero también más producción y exportaciones en el mediano plazo. El efecto neto es neutral-ligeramente positivo para el sol. En QoriCash acompañamos a las empresas en sus necesidades de cambio de divisas para operaciones de inversión y comercio exterior.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n006',
    titulo: 'S&P 500 cae 0.3% a 7,561 y Nasdaq pierde 1% — semiconductores presionados por dudas sobre gasto en IA',
    descripcion: 'Wall Street cierra con pérdidas este 16 de julio: S&P 500 en 7,561 (-0.3%), Nasdaq 100 -1% y Dow plano. El sector de semiconductores lidera las caídas ante el escepticismo sobre si los hyperscalers de IA reducirán su inversión en infraestructura. TSM reportó resultados sólidos pero no logró sostener el optimismo inicial.',
    contenido: `Wall Street cierra con pérdidas moderadas este miércoles 16 de julio de 2026: el S&P 500 cede 0.3% a 7,561 puntos, el Nasdaq 100 pierde más del 1% y el Dow Jones queda prácticamente plano. La jornada estuvo marcada por la presión en el sector de semiconductores y chips, que lideró las caídas a pesar de que Taiwan Semiconductor Manufacturing (TSM) reportó resultados del Q2 2026 por encima de las expectativas.

La paradoja TSM resume el dilema del mercado: la compañía reportó ventas de US$ 28.9B en Q2 (+38% interanual) y guio el Q3 hacia US$ 30-31B, superando el consenso. Sin embargo, las acciones cayeron porque los inversores cuestionan si el boom del gasto en infraestructura de inteligencia artificial —que ha sido el principal motor del crecimiento de TSM— es sostenible. Los rumores de que Microsoft, Google y Amazon podrían moderar sus planes de capex en centros de datos para 2027 generaron ventas técnicas en todo el sector.

Los mayores perdedores del día: Nvidia (-2.8%), AMD (-3.1%), Intel (-1.9%), ASML (-2.4%) y Broadcom (-2.2%). En contraste, los sectores defensivos avanzaron: salud (+1.2% liderado por UnitedHealth +8.74%), consumo básico (+0.8%, Coca-Cola +2.17%) y utilities (+0.6%). La rotación hacia sectores defensivos sugiere que los inversores anticipan mayor volatilidad ante el FOMC del 29 de julio.

El VIX —índice de volatilidad implícita del S&P 500— subió de 14.2 a 15.8, aún en zona de calma pero con señales de alerta. El mercado de opciones descuenta un movimiento del S&P 500 de ±1.5% el día del FOMC del 29 de julio.`,
    analisis: `La caída del Nasdaq liderada por semiconductores es una señal de maduración del ciclo de IA: los mercados ya no recompensan el crecimiento a cualquier precio y empiezan a exigir visibilidad sobre la rentabilidad del gasto en infraestructura. Para el sol peruano, un Nasdaq débil suele coincidir con menor apetito de riesgo global y potencial fortalecimiento del dólar —factor de presión al alza sobre el TC. El FOMC del 29 de julio será el evento determinante: si sube tasas, el dólar se fortalecería y el sol podría ceder hacia S/ 3.42-3.45. En QoriCash monitoreamos Wall Street como indicador adelantado del apetito de riesgo global.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14902679/pexels-photo-14902679.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function getNoticias(): Promise<Noticia[]> {
  const redis = getRedis();
  if (!redis) return FALLBACK_NOTICIAS;

  try {
    const data = await redis.get<Noticia[]>(REDIS_KEY) ?? [];
    // Merge Redis (priority) + FALLBACK articles that are not already in Redis
    const redisIds = new Set(data.map((n) => n.id));
    const merged = [...data, ...FALLBACK_NOTICIAS.filter((n) => !redisIds.has(n.id))];
    if (merged.length === 0) return FALLBACK_NOTICIAS;
    return merged.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  } catch {
    return FALLBACK_NOTICIAS;
  }
}

export async function getNoticiasDestacadas(): Promise<Noticia[]> {
  const all = await getNoticias();
  return all.filter((n) => n.destacada).slice(0, 2);
}

export async function addNoticia(
  data: Omit<Noticia, 'id' | 'fecha'>
): Promise<Noticia> {
  const redis = getRedis();
  const noticia: Noticia = {
    ...data,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
  };

  if (!redis) return noticia;

  const current = await getNoticias();
  const fallbackIds = new Set(FALLBACK_NOTICIAS.map((f) => f.id));
  const filtered = current.filter((n) => !fallbackIds.has(n.id));
  await redis.set(REDIS_KEY, [noticia, ...filtered]);
  return noticia;
}

export async function deleteNoticia(id: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const current = await getNoticias();
  const updated = current.filter((n) => n.id !== id);
  await redis.set(REDIS_KEY, updated);
}

export async function updateNoticia(
  id: string,
  data: Partial<Omit<Noticia, 'id' | 'fecha'>>
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const current = await getNoticias();
  const updated = current.map((n) => (n.id === id ? { ...n, ...data } : n));
  await redis.set(REDIS_KEY, updated);
}
