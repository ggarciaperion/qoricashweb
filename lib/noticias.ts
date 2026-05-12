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

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: '1',
    titulo: 'Trump suspende el impuesto federal a la gasolina ante precios récord de US$ 4.52 por galón',
    descripcion:
      'Donald Trump anunció la suspensión temporal del impuesto federal al combustible (18.3 centavos por galón) tras el alza de más del 50% en el precio desde el inicio de la guerra en Irán. El conflicto cortó el paso por el estrecho de Ormuz, retirando 14 millones de barriles diarios del mercado global.',
    contenido: `El presidente Donald Trump anunció la suspensión temporal del impuesto federal al combustible (18.3 centavos por galón) como medida de alivio ante el alza de más del 50% en el precio de la gasolina desde el inicio de la guerra en Irán. El conflicto cortó el paso por el estrecho de Ormuz — vía estratégica del 20% del crudo mundial — retirando 14 millones de barriles diarios del mercado global. El precio promedio de la gasolina en EE.UU. alcanzó US$ 4.52 por galón, mientras que el impuesto federal es de 18.3 centavos para gasolina y 24.3 centavos para diésel.`,
    analisis: `Una mayor presión inflacionaria en EE.UU. por costos energéticos elevados complica la política de la Reserva Federal: si la inflación se mantiene alta, la Fed posterga recortes de tasas, lo que fortalece al dólar. Si la medida de Trump logra enfriar los precios, podría abrirse espacio para una baja de tasas que debilitaría al dólar frente al sol peruano. Para quienes operan en divisas, este es un escenario de alta volatilidad: el dólar puede reaccionar en cualquier dirección según evolucione el conflicto en Irán y la respuesta de los mercados energéticos.`,
    categoria: 'Internacional',
    fuente: 'Gestión',
    fecha: new Date().toISOString(),
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  },
  {
    id: '2',
    titulo: 'Petroperú recibe salvavidas de US$ 2,000 millones mediante fideicomiso con banca privada',
    descripcion:
      'El Gobierno peruano autorizó un financiamiento de hasta US$ 2,000 millones para Petroperú a través de un fideicomiso gestionado por ProInversión con banca privada internacional, sin afectar la deuda pública del país.',
    contenido: `El Gobierno peruano autorizó un financiamiento de hasta US$ 2,000 millones para Petroperú a través de un fideicomiso administrado por ProInversión con banca privada internacional. Los primeros US$ 500 millones estarán disponibles en las próximas dos semanas; el total se habilitará en 8 a 10 semanas. El plazo de devolución es de 7 años sin pagos en los primeros años. El mecanismo no constituye deuda pública ni afecta los límites de endeudamiento del país. Los recursos solo pueden destinarse a la compra de crudo y abastecimiento de combustibles.`,
    analisis: `El acceso a financiamiento externo de gran escala sin impacto en el Tesoro Público es una señal positiva para la estabilidad fiscal peruana. Menos presión sobre el gasto público contribuye a mantener la confianza de los mercados en el sol y contener presiones cambiarias en el corto plazo. Desde la perspectiva forex, una mayor estabilidad fiscal reduce la prima de riesgo país, lo que puede fortalecer al PEN frente al dólar. Sin embargo, el riesgo operativo de Petroperú sigue siendo un factor a monitorear: cualquier deterioro en su situación podría generar presión sobre el tipo de cambio.`,
    categoria: 'Economía Peruana',
    fuente: 'Gestión',
    fecha: new Date().toISOString(),
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
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
    const data = await redis.get<Noticia[]>(REDIS_KEY);
    if (!data || data.length === 0) return FALLBACK_NOTICIAS;
    return data.sort(
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
  const filtered = current.filter((n) => !FALLBACK_NOTICIAS.find((f) => f.id === n.id));
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
