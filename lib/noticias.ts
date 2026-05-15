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
const HOY = '2026-05-15T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  // ── DESTACADAS (portada + página de noticias) ──────────────────────────────
  {
    id: 'f001',
    titulo: 'BCRP mantiene tasa de referencia en 4.75% en mayo y refuerza vigilancia ante inflación importada',
    descripcion:
      'El Banco Central de Reserva del Perú decidió por unanimidad mantener la tasa de interés de referencia en 4.75% durante su reunión de mayo. La entidad advirtió sobre los riesgos inflacionarios provenientes del alza energética global y la fortaleza del dólar, aunque ratificó el ancla inflacionaria del sol.',
    contenido: `El Directorio del Banco Central de Reserva del Perú (BCRP) acordó por unanimidad mantener la tasa de interés de referencia en 4.75% anual en su sesión de mayo de 2026. La decisión estuvo en línea con las expectativas del mercado, que no anticipaba cambios en la política monetaria dado el contexto de presiones inflacionarias moderadas y crecimiento económico estable.

El BCRP destacó en su comunicado que la inflación interanual se ubica en 2.4%, dentro del rango meta de 1% a 3%, pero advirtió que los riesgos al alza persisten debido al encarecimiento de combustibles derivado de tensiones en el Estrecho de Ormuz y la fortaleza sostenida del dólar a nivel global.

El presidente del BCRP, Julio Velarde, señaló que "el sol peruano ha mostrado resiliencia frente a la volatilidad externa gracias a los fundamentos sólidos de la economía peruana", respaldados por el boom exportador de cobre y el dinamismo de las agroexportaciones. Las reservas internacionales netas se mantienen en US$ 76,400 millones, equivalentes a 18 meses de importaciones.

El mercado proyecta que el BCRP podría iniciar un ciclo gradual de recortes de tasas en el tercer trimestre de 2026 si la inflación converge hacia el 2% y la Reserva Federal da señales más claras de flexibilización monetaria.`,
    analisis: `La decisión del BCRP de mantener tasas en 4.75% envía una señal de prudencia y anclaje. Para el tipo de cambio PEN/USD, tasas de interés estables en Perú con un diferencial positivo frente a economías vecinas sostienen la demanda de soles como activo de inversión.

El diferencial de tasas Perú-EE.UU. es de apenas 25-50 puntos básicos, lo que limita el margen para grandes flujos especulativos hacia el sol. Sin embargo, la solidez de las reservas internacionales y la disciplina fiscal del MEF generan confianza en el PEN. Para empresas con exposición cambiaria, este contexto sugiere un tipo de cambio relativamente estable en el rango de S/ 3.65 – 3.75 por dólar en el corto plazo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  },
  {
    id: 'f002',
    titulo: 'Reserva Federal mantiene tasas sin cambios y descarta recortes en junio: el dólar reacciona con alza moderada',
    descripcion:
      'La Fed dejó los tipos entre 5.25% y 5.50% en su reunión de mayo, citando la persistencia inflacionaria y un mercado laboral aún robusto. Jerome Powell señaló que el banco central necesita "mayor confianza" en la convergencia de la inflación al 2% antes de iniciar recortes. El DXY subió a 99.20.',
    contenido: `La Reserva Federal de los Estados Unidos mantuvo sin cambios su tasa de fondos federales en el rango de 5.25%-5.50% durante su reunión del 14 y 15 de mayo de 2026. La decisión fue unánime entre los miembros del Comité Federal de Mercado Abierto (FOMC), disipando las esperanzas de quienes apostaban por un recorte preventivo.

El presidente Jerome Powell señaló en conferencia de prensa que "no hemos visto el progreso necesario en la inflación para tener confianza en que sea apropiado reducir las tasas." El índice de precios al consumidor de abril, publicado la semana pasada en 3.8% interanual, fue citado como evidencia de que la desinflación ha perdido impulso.

El mercado de futuros ahora descuenta la primera reducción de tasas para septiembre de 2026, con solo dos recortes de 25 puntos básicos para todo el año. El Índice Dólar (DXY) subió 0.3% hasta 99.20, tocando su nivel más alto en tres semanas.

Los mercados de renta variable reaccionaron con volatilidad moderada: el S&P 500 cedió 0.4% mientras el oro subió 0.8% hasta US$ 3,245/oz, beneficiándose de su condición de activo refugio ante la incertidumbre monetaria.`,
    analisis: `Una Fed que pospone recortes de tasas es sinónimo de dólar fuerte por más tiempo. Para el tipo de cambio PEN/USD, esto se traduce en presión depreciadora moderada sobre el sol en el corto plazo. Con el DXY en 99.20, el dólar cotiza con fortaleza global que arrastra a todas las divisas emergentes.

Para las empresas peruanas, el contexto de tasas altas en EE.UU. encarece el financiamiento en dólares y mantiene el costo de cobertura cambiaria elevado. Sin embargo, el BCRP tiene herramientas para intervenir si el tipo de cambio supera niveles de S/ 3.80. Este es un buen momento para que quienes necesiten dólares en los próximos meses evalúen compras escalonadas antes de que la presión aumente.`,
    categoria: 'Internacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  },

  // ── GESTIÓN — 4 nacionales ─────────────────────────────────────────────────
  {
    id: 'f003',
    titulo: 'Exportaciones peruanas crecen 19.2% en los primeros cuatro meses de 2026 impulsadas por cobre y agroexportaciones',
    descripcion:
      'El valor de las exportaciones peruanas acumuló US$ 22,400 millones entre enero y abril de 2026, un 19.2% más que el mismo período de 2025. El cobre representó el 38% del total, mientras que las agroexportaciones crecieron 24% impulsadas por arándanos, uvas y espárragos.',
    contenido: `Las exportaciones peruanas totalizaron US$ 22,400 millones en el período enero-abril de 2026, registrando un crecimiento de 19.2% respecto al mismo lapso de 2025, según cifras preliminares del Ministerio de Comercio Exterior y Turismo (Mincetur). El dinamismo fue liderado por las exportaciones tradicionales, especialmente el cobre, cuyo precio en la Bolsa de Metales de Londres supera los US$ 14,000 por tonelada.

El cobre concentró US$ 8,500 millones en envíos (38% del total), seguido por el oro con US$ 4,200 millones y el zinc con US$ 1,800 millones. Las exportaciones no tradicionales alcanzaron US$ 5,100 millones, con las agroexportaciones liderando con un alza del 24%: arándanos sumaron US$ 980 millones, uvas US$ 720 millones y espárragos US$ 410 millones.

El ministro de Comercio Exterior, Luis Helguero, destacó que "Perú se encamina a un año récord en exportaciones, con proyecciones que superan los US$ 72,000 millones para 2026." El BCRP estima que la oferta de dólares por exportaciones será la más alta de la historia, lo que constituye un amortiguador natural frente a la volatilidad global.

Los principales destinos de exportación continúan siendo China (32%), Estados Unidos (15%), Unión Europea (12%) e India (8%), consolidando la diversificación de mercados iniciada en 2022.`,
    analisis: `Un superávit exportador de esta magnitud es el mejor antídoto para la depreciación del sol. Mayor oferta de dólares en el mercado cambiario —producto de las liquidaciones de exportadores— genera presión apreciadora natural sobre el PEN. Este es el principal factor que explica la estabilidad del tipo de cambio pese al entorno de dólar global fuerte.

Para las empresas importadoras, este contexto es favorable: el tipo de cambio no debería dispararse mientras los precios del cobre se mantengan en estos niveles. Para los exportadores, sin embargo, un sol más fuerte reduce sus márgenes en moneda local. La clave para los próximos meses será la evolución del precio del cobre: si cae por debajo de US$ 12,000/ton, la presión sobre el PEN aumentará significativamente.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    id: 'f004',
    titulo: 'Proinversión adjudica megaproyecto portuario en el Callao por US$ 1,200 millones al consorcio DP World-Cosco',
    descripcion:
      'El consorcio integrado por DP World (Emiratos) y Cosco Shipping (China) se adjudicó la concesión del Terminal Norte Multipropósito del Callao por 30 años. La inversión comprometida de US$ 1,200 millones posicionará al Callao como el principal hub logístico de la costa del Pacífico sudamericano.',
    contenido: `Proinversión anunció la adjudicación de la concesión del Terminal Norte Multipropósito del Puerto del Callao al consorcio conformado por DP World (Emiratos Árabes Unidos) y Cosco Shipping (China), tras un proceso competitivo que contó con la participación de cinco consorcios internacionales. La concesión tiene un plazo de 30 años y una inversión comprometida de US$ 1,200 millones en los primeros cinco años.

El proyecto contempla la construcción de dos nuevos muelles con capacidad para recibir los mayores buques portacontenedores del mundo (clase 24,000 TEU), ampliación de patios de almacenamiento y modernización de equipos de manipulación de carga. Se proyecta que el Callao triplique su capacidad de movimiento de contenedores, pasando de 3.5 millones a 10.5 millones de TEU anuales para 2035.

El ministro de Transportes, Carlos Mora, señaló que "esta adjudicación convierte al Callao en el primer puerto transoceánico de Sudamérica, capaz de competir con los grandes hubs de Panamá y Balboa." Se estima que el proyecto generará 8,500 empleos directos durante la fase de construcción y 3,200 permanentes en operación.

La inversión extranjera directa (IED) vinculada al proyecto ingresará en tramos: US$ 340 millones en 2026-2027 para obras civiles preliminares.`,
    analisis: `Una inversión extranjera directa de US$ 1,200 millones en infraestructura portuaria tiene un impacto positivo directo sobre el mercado cambiario peruano: los dólares ingresarán al país en tramos durante los próximos años, incrementando la oferta de divisas y generando presión apreciadora sobre el sol.

Adicionalmente, un Callao modernizado reducirá los costos logísticos de exportación e importación, mejorando la competitividad de la economía peruana en su conjunto. Para las empresas que operan con volúmenes de comercio exterior, este proyecto representa una reducción futura en tiempos y costos de transporte. El anuncio también fortalece la narrativa de Perú como destino de inversión, lo que puede atraer flujos adicionales de capital extranjero.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80',
  },
  {
    id: 'f005',
    titulo: 'MEF proyecta déficit fiscal de 2.1% del PBI en 2026, por debajo de la meta de 2.5%, gracias al boom minero',
    descripcion:
      'El Ministerio de Economía y Finanzas revisó a la baja su proyección de déficit fiscal para 2026, impulsado por la mayor recaudación tributaria proveniente de canon minero y regalías. El mejor resultado fiscal reduce la necesidad de endeudamiento externo y fortalece la posición del sol.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) presentó la actualización del Marco Macroeconómico Multianual 2026-2029, en la que revisa a la baja la proyección de déficit fiscal de 2026, de 2.5% a 2.1% del Producto Bruto Interno (PBI). La mejora obedece principalmente al impacto de los precios récord del cobre y el oro en la recaudación tributaria por canon minero, regalías e impuesto a la renta de tercera categoría del sector extractivo.

La recaudación total del período enero-abril de 2026 acumuló S/ 48,200 millones, un 14.8% más que el mismo período de 2025. El canon minero distribuido a las regiones productoras alcanzó un récord histórico de S/ 8,400 millones, con Arequipa, Cajamarca y Áncash como principales beneficiarias.

El ministro de Economía, Gustavo Adrianzén, señaló que "la fortaleza de las cuentas fiscales nos da espacio para mantener el gasto en infraestructura sin comprometer la estabilidad macroeconómica." La calificadora Moody's revisó en abril la perspectiva de Perú de Estable a Positiva, anticipando una posible mejora en la calificación soberana.

El MEF proyecta un crecimiento del PBI de 3.2% para 2026, impulsado por la inversión privada (minería y construcción) y el consumo privado.`,
    analisis: `Un déficit fiscal menor al proyectado es una señal de solidez macroeconómica que fortalece la confianza de los inversores en el sol peruano. Menor necesidad de endeudamiento externo significa menos emisión de bonos soberanos en dólares, lo que reduce la presión vendedora de PEN para comprar USD.

La perspectiva Positiva de Moody's anticipa una posible mejora crediticia soberana que atraería flujos de inversión de fondos indexados a riesgo grado de inversión, generando demanda adicional de soles. Para el tipo de cambio, este es un entorno de fundamentos sólidos que actúa como contrapeso a las presiones externas del dólar global fuerte.`,
    categoria: 'Economía',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80',
  },
  {
    id: 'f006',
    titulo: 'Cobre supera US$ 14,200 por tonelada en nuevo máximo histórico y consolida ingresos mineros récord para Perú',
    descripcion:
      'El cobre alcanzó US$ 14,218 por tonelada en la LME este viernes, extendiendo su rally tras los datos de demanda industrial china de abril. Perú, segundo productor mundial, proyecta ingresos por exportaciones de cobre superiores a US$ 32,000 millones en 2026.',
    contenido: `El cobre volvió a establecer un nuevo récord histórico este viernes al alcanzar US$ 14,218 por tonelada en la Bolsa de Metales de Londres (LME), equivalente a US$ 6.44 por libra. El metal suma una ganancia acumulada del 38% en lo que va del año, impulsado por la demanda industrial de China —que creció 11% interanual en abril— y la escasez estructural de nuevos proyectos mineros globales.

Los datos de producción industrial china de abril mostraron un incremento del 6.8% interanual, el mayor desde 2023, alimentado por el boom de infraestructura eléctrica para energías renovables y la expansión de la industria de vehículos eléctricos. China consume el 55% del cobre mundial.

Para Perú, el segundo productor mundial con 2.8 millones de toneladas anuales, los precios en estos niveles se traducen en ingresos por exportaciones de cobre superiores a US$ 32,000 millones en 2026, superando el récord previo de US$ 27,500 millones registrado en 2022. Las principales operaciones beneficiadas son Las Bambas, Cerro Verde, Antamina y Cuajone.`,
    analisis: `Cobre en US$ 14,200/ton es la mejor noticia posible para el sol peruano. Con exportaciones de cobre que podrían superar US$ 32,000 millones en 2026, la oferta de dólares en el mercado cambiario peruano alcanzará niveles históricos. Esto genera una presión apreciadora estructural sobre el PEN que compensa en gran medida la fortaleza global del dólar.

Para quienes compran dólares regularmente, el tipo de cambio actual es relativamente favorable gracias a este contexto exportador. La amenaza principal es una desaceleración brusca de la economía china: si el PMI manufacturero de China cae por debajo de 50, el cobre podría corregir 15-20% en semanas, lo que cambiaría radicalmente el panorama cambiario peruano.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  },

  // ── GESTIÓN / Bloomberg — INTERNACIONAL ───────────────────────────────────
  {
    id: 'f007',
    titulo: 'Acuerdo Trump-Xi produce primer resultado: aranceles sobre tecnología bajan al 15% y bolsas asiáticas suben 2.8%',
    descripcion:
      'El primer resultado concreto de la visita de Trump a Pekín es la reducción arancelaria sobre semiconductores y equipos de telecomunicaciones de 145% a 15%. Los mercados bursátiles de Asia reaccionaron con alzas de hasta 2.8% y el dólar cedió frente a divisas emergentes.',
    contenido: `La visita de Estado del presidente Donald Trump a China produjo su primer resultado tangible: ambas potencias anunciaron una reducción arancelaria mutua sobre tecnología y bienes industriales. EE.UU. reducirá los aranceles sobre semiconductores, equipos de telecomunicaciones y componentes electrónicos de 145% a 15%, mientras China eliminará las restricciones sobre exportaciones de tierras raras hacia empresas estadounidenses.

Los mercados bursátiles asiáticos reaccionaron con alzas generalizadas: el Hang Seng de Hong Kong subió 2.8%, el Shanghai Composite ganó 2.1% y el Nikkei 225 de Tokio avanzó 1.9%. El índice dólar (DXY) cedió 0.4% hasta 98.80, reflejando el menor apetito por activos refugio ante la reducción de tensiones geopolíticas.

El acuerdo contempla además el establecimiento de una comisión bilateral de comercio que se reunirá trimestralmente, la creación de un mecanismo de resolución de disputas acelerado y la apertura de seis nuevos sectores del mercado chino a empresas estadounidenses, incluyendo servicios financieros y computación en la nube.`,
    analisis: `Una distensión comercial EE.UU.-China es positiva para las divisas emergentes, incluyendo el sol peruano. Menor incertidumbre geopolítica reduce la demanda de dólares como activo refugio, lo que debilita al DXY y favorece a las monedas de economías exportadoras de commodities como Perú.

Adicionalmente, si China crece más rápido gracias a un mejor acceso a tecnología estadounidense, la demanda de cobre, zinc y otros metales que Perú exporta se acelerará, generando más dólares para el mercado cambiario. Este acuerdo comercial podría ser el catalizador para que el sol peruano se aprecie hacia S/ 3.60 por dólar en el segundo semestre de 2026.`,
    categoria: 'Internacional',
    fuente: 'Gestión / Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
  },
  {
    id: 'f008',
    titulo: 'Goldman Sachs eleva meta del oro a US$ 3,800/oz para fin de 2026 por demanda récord de bancos centrales',
    descripcion:
      'El banco de inversión revisó al alza su proyección del precio del oro, citando compras récord de bancos centrales emergentes y la fragmentación del sistema monetario global. China, India y Turquía lideran las adquisiciones. Goldman advierte que el oro podría superar US$ 4,000 si la Fed recorta tasas antes de septiembre.',
    contenido: `Goldman Sachs elevó su proyección del precio del oro para finales de 2026 de US$ 3,500 a US$ 3,800 por onza troy, citando tres factores principales: la aceleración de las compras de oro por bancos centrales de mercados emergentes, la creciente desconfianza en el dólar como reserva de valor única y la demanda de inversores institucionales como cobertura ante la inflación.

Los bancos centrales de China, India, Turquía, Polonia y Arabia Saudita compraron un total de 1,136 toneladas de oro en el primer trimestre de 2026, el mayor registro trimestral de la historia. China aumentó sus reservas en 54 toneladas solo en abril, elevando el total a 2,890 toneladas.

El estratega de commodities de Goldman, Mikhail Sprogis, señaló que "estamos ante un cambio estructural en la composición de las reservas internacionales globales." Si la Fed inicia recortes antes de septiembre, el banco proyecta que el oro podría superar los US$ 4,000/oz. El oro cotiza actualmente a US$ 3,248/oz, acumulando una ganancia del 28% en lo que va de 2026.`,
    analisis: `El rally del oro tiene una relación indirecta pero relevante con el tipo de cambio peruano. Perú es el sexto productor mundial de oro: a precios de US$ 3,248/oz, las exportaciones auríferas generarán más de US$ 18,000 millones en 2026, aportando una oferta significativa de dólares al mercado cambiario.

La tendencia de bancos centrales a reducir exposición al dólar es un viento en contra estructural para el DXY en el largo plazo, lo que favorece a divisas emergentes sólidas como el sol peruano. Para quienes tienen activos en dólares, el contexto actual sugiere mantener una posición diversificada.`,
    categoria: 'Internacional',
    fuente: 'Gestión / Bloomberg Intelligence',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80',
  },
  {
    id: 'f009',
    titulo: 'FMI eleva proyección de crecimiento de Perú a 3.4% para 2026, la más alta de Sudamérica',
    descripcion:
      'El Fondo Monetario Internacional revisó al alza su estimación de crecimiento para Perú en su actualización del World Economic Outlook de mayo. La mejora obedece al impacto del boom minero, la recuperación del consumo privado y la solidez fiscal. Chile (2.8%) y Colombia (2.6%) completan el podio regional.',
    contenido: `El Fondo Monetario Internacional (FMI) actualizó sus proyecciones de crecimiento económico para América Latina en su informe de mayo de 2026, destacando a Perú como la economía de mayor dinamismo en Sudamérica con una tasa de crecimiento revisada al alza de 2.9% a 3.4% para el año en curso.

La mejora en la proyección peruana obedece a cuatro factores: el impacto positivo de los precios récord del cobre y el oro en los ingresos de exportación, la recuperación del consumo privado sustentada en la mejora del empleo formal, la ejecución de grandes proyectos de infraestructura y la solidez del sistema financiero.

El informe destaca que "Perú presenta uno de los marcos macroeconómicos más sólidos de la región, con inflación dentro del rango meta, reservas internacionales robustas y una deuda pública sostenible." Chile fue proyectado con un crecimiento de 2.8%, Colombia 2.6% y Brasil 2.3%.`,
    analisis: `La validación del FMI del crecimiento peruano es un activo de reputación que atrae flujos de inversión extranjera directa y de cartera. Los fondos de inversión que utilizan las proyecciones del FMI como referencia tenderán a incrementar su exposición a activos peruanos, lo que genera demanda de soles.

La combinación de crecimiento sólido + inflación controlada + solidez fiscal es el escenario ideal para la apreciación estructural del sol. El riesgo político interno —especialmente la inestabilidad del Ejecutivo— sigue siendo el principal factor de descuento que limita una apreciación más pronunciada.`,
    categoria: 'Internacional',
    fuente: 'Gestión / FMI',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  },

  // ── TRADINGVIEW ────────────────────────────────────────────────────────────
  {
    id: 'f010',
    titulo: 'Dólar Index retrocede a 98.80 tras datos mixtos de empleo en EE.UU.; sol peruano se aprecia a S/ 3.672',
    descripcion:
      'Las solicitudes de desempleo en EE.UU. subieron más de lo esperado, sembrando dudas sobre la solidez del mercado laboral. El DXY cedió 0.4%, el euro subió a 1.0940 y el sol peruano se apreció hasta S/ 3.672 por dólar, su nivel más fuerte en dos semanas.',
    contenido: `El índice dólar (DXY) retrocedió 0.4% hasta 98.80 este viernes tras la publicación de datos de solicitudes de desempleo en EE.UU. que superaron las expectativas. Las peticiones semanales de subsidio por desempleo alcanzaron 245,000, por encima de las 228,000 proyectadas por el consenso de analistas.

El dato abre la posibilidad de que la Reserva Federal cuente con mayor margen para iniciar recortes de tasas antes de lo previsto. Los operadores de futuros sobre fondos federales aumentaron la probabilidad de un primer recorte en la reunión de septiembre del 38% al 52%.

El euro se apreció a 1.0940 dólares, el yen japonés avanzó a 151.20 por dólar y el sol peruano se fortaleció hasta S/ 3.672, su nivel más alto desde el 1 de mayo. El BCRP no intervino en el mercado cambiario durante la jornada.

El oro subió 0.8% hasta US$ 3,248/oz y el S&P 500 avanzó 0.6%, con el sector tecnológico liderando las ganancias ante las expectativas de recortes de tasas más tempranos.`,
    analisis: `Un mercado laboral estadounidense que se enfría es una señal positiva para el sol peruano: menos empleo en EE.UU. = mayor probabilidad de recortes de la Fed = dólar más débil. El movimiento del tipo de cambio hacia S/ 3.672 refleja exactamente este mecanismo de transmisión.

Para las empresas peruanas con necesidades de compra de dólares en el corto plazo, las jornadas de apreciación del sol como la de hoy representan oportunidades para adquirir divisas a tipos favorables. En QoriCash monitoreamos en tiempo real estas ventanas y podemos ejecutar sus operaciones al tipo de cambio más conveniente del mercado.`,
    categoria: 'Internacional',
    fuente: 'TradingView / Reuters',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=80',
  },
  {
    id: 'f011',
    titulo: 'Petróleo WTI consolida sobre US$ 100 con reapertura gradual del Estrecho de Ormuz; Brent en US$ 104.80',
    descripcion:
      'Los precios del crudo se estabilizan en la zona de US$ 100-105 mientras los reportes de tráfico marítimo confirman el paso regular de buques tanqueros por el Estrecho de Ormuz. Analistas de JP Morgan advierten que una normalización completa podría llevar el WTI hacia US$ 85-90 en el tercer trimestre.',
    contenido: `Los precios del petróleo crudo mostraron estabilidad en la sesión del viernes, con el WTI norteamericano cotizando a US$ 100.30 por barril y el Brent europeo en US$ 104.80, ambos con variaciones mínimas respecto al cierre anterior. Los mercados digieren la reapertura gradual del Estrecho de Ormuz, con reportes que confirman el tránsito regular de buques tanqueros desde hace 48 horas.

La Agencia Internacional de Energía (AIE) actualizó su balance de oferta y demanda: con el Estrecho operativo al 75% de su capacidad normal, el déficit global de crudo se redujo de 1.8 millones a 0.9 millones de barriles por día. Arabia Saudita ya anunció que incrementará su producción en 500,000 barriles diarios adicionales en junio.

Analistas de JP Morgan señalan que "una normalización completa del tráfico por Ormuz llevaría al WTI hacia US$ 85-90 en el tercer trimestre, eliminando la prima de riesgo geopolítico."`,
    analisis: `Un petróleo bajando hacia US$ 85-90 en el tercer trimestre tendría efectos positivos para Perú: menor inflación importada, reducción del costo de combustibles para el transporte y la industria, menor presión sobre el BCRP para subir tasas.

Para el tipo de cambio, petróleo más barato en el mundo reduce la inflación global, lo que acerca los recortes de tasas de la Fed y potencialmente debilita al dólar, favoreciendo al sol peruano en el segundo semestre. Sin embargo, la volatilidad es alta: cualquier nuevo incidente en Oriente Medio puede revertir esta tendencia en horas.`,
    categoria: 'Internacional',
    fuente: 'TradingView / Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  },
  {
    id: 'f012',
    titulo: 'Bitcoin supera US$ 112,000 y arrastra al mercado cripto: inversores institucionales diversifican ante inflación',
    descripcion:
      'Bitcoin alcanzó un nuevo máximo histórico de US$ 112,400 impulsado por flujos récord hacia los ETF spot de BTC en EE.UU. Ethereum superó los US$ 4,800 y el mercado cripto total supera los US$ 4.2 billones de capitalización.',
    contenido: `Bitcoin estableció un nuevo máximo histórico al alcanzar US$ 112,400 durante la sesión asiática del viernes, superando el récord previo de US$ 109,200 registrado en enero de 2026. El impulso provino de flujos netos positivos de US$ 2,100 millones hacia los ETF spot de Bitcoin en EE.UU. durante la semana.

Los ETF de Bitcoin de BlackRock (IBIT), Fidelity (FBTC) y ARK/21Shares acumulan activos bajo gestión superiores a US$ 85,000 millones combinados. Más de 1,200 fondos de pensiones y family offices globales tienen ahora exposición a Bitcoin a través de estos vehículos.

Ethereum también superó los US$ 4,800 por primera vez desde 2021. La capitalización total del mercado cripto alcanzó US$ 4.2 billones. Analistas de Standard Chartered mantienen su proyección de Bitcoin en US$ 150,000 para finales de 2026.`,
    analisis: `El rally cripto tiene una relación con el tipo de cambio peruano principalmente a través del apetito por riesgo global. Cuando Bitcoin sube agresivamente, los inversores muestran mayor disposición a asumir riesgos, lo que se traduce en flujos hacia mercados emergentes y divisas como el sol peruano.

El mensaje implícito es relevante: la inflación persistente global está llevando a los inversores a buscar alternativas al dólar como reserva de valor, lo que en el mediano plazo puede debilitar estructuralmente al DXY y favorecer al sol.`,
    categoria: 'Economía',
    fuente: 'TradingView / CoinDesk',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80',
  },

  // ── INFOBAE ────────────────────────────────────────────────────────────────
  {
    id: 'f013',
    titulo: 'Dólar en Argentina: oficial a $1,413 y blue a $1,415; brecha mínima histórica del 0.14% consolida estabilidad cambiaria',
    descripcion:
      'El mercado cambiario argentino abre este 15 de mayo con calma total. La brecha entre el dólar oficial y el paralelo llegó al mínimo histórico de apenas 0.14%, reflejando la consolidación del programa económico de Milei y la confianza creciente en el peso argentino.',
    contenido: `El dólar oficial en Argentina abre este viernes 15 de mayo a $1,413 para la venta en el Banco Nación, mientras el dólar blue (paralelo) se negocia a $1,415, registrando una brecha mínima histórica de apenas 0.14%. Hace un año, la misma brecha superaba el 50%.

El dólar MEP cotiza a $1,411, ligeramente por debajo del oficial. El dólar CCL (contado con liquidación) se ubica en $1,416, prácticamente igualado con el blue. La unificación de facto de los tipos de cambio es considerada por los analistas como el mayor logro cambiario del programa Milei.

El banco central argentino acumuló reservas por US$ 7,400 millones en lo que va del año, impulsado por el ingreso estacional de divisas de la cosecha gruesa de soja y maíz. Los datos de inflación de abril confirmaron una desaceleración al 2.7% mensual, reduciendo la inflación interanual al 68%.`,
    analisis: `La estabilización cambiaria argentina es positiva para el ecosistema financiero regional. Una brecha cambiaria del 0.14% en Argentina señala que los agentes económicos ya no perciben al peso como una moneda en crisis permanente, lo que reduce el efecto contagio sobre otras divisas latinoamericanas, incluyendo el sol peruano.

Históricamente, los períodos de crisis cambiaria argentina generaban mayor demanda de dólares en Perú como cobertura regional. Con Argentina estabilizada, ese factor de demanda especulativa de USD en el mercado peruano se atenúa, contribuyendo a la estabilidad del tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&q=80',
  },
  {
    id: 'f014',
    titulo: 'Inflación en Argentina cerró en 2.7% mensual en abril, la más baja desde septiembre de 2021',
    descripcion:
      'El INDEC publicó los datos de inflación de abril que confirmaron una desaceleración al 2.7% mensual, la más baja en casi cinco años. La inflación interanual se redujo al 68%, desde el pico del 289% de diciembre de 2023. El riesgo país argentino cayó 45 puntos básicos hasta 480 puntos.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó ayer los datos de inflación de abril de 2026, confirmando la desaceleración al 2.7% mensual, el nivel más bajo desde septiembre de 2021. La inflación interanual se ubica ahora en 68%, una reducción dramática desde el pico del 289% registrado en diciembre de 2023.

Los rubros con mayor incidencia en el alza de precios de abril fueron alimentos y bebidas (+3.1%), educación (+3.8%) y equipamiento del hogar (+2.9%). En sentido contrario, indumentaria cayó 0.8%.

El presidente Milei celebró el dato: "La inflación más baja en cinco años es el resultado de la única política que funciona: no gastar lo que no tenemos." El ministro Caputo señaló que el objetivo es llevar la inflación mensual al 1% para fin de año. El riesgo país argentino cayó 45 puntos básicos hasta 480 puntos básicos tras la publicación del dato, su nivel más bajo desde 2019.`,
    analisis: `Una inflación argentina convergiendo al 1% mensual elimina uno de los principales factores de inestabilidad regional de los últimos años. Para Perú, el impacto más relevante es la normalización de los flujos financieros en Latinoamérica.

En términos de tipo de cambio, la estabilización argentina reduce la "prima de riesgo regional" que afecta al PEN. Esto no implica una apreciación automática del sol, pero sí una reducción de la presión vendedora especulativa sobre divisas latinoamericanas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  },
  {
    id: 'f015',
    titulo: 'Colombia sube tasa de interés 25 puntos básicos a 10.50% para frenar depreciación del peso y volatilidad cambiaria',
    descripcion:
      'El Banco de la República de Colombia sorprendió al mercado con un alza de tasas de 25pb, la primera desde 2023, para contener la depreciación del peso colombiano que acumula una caída del 8.5% frente al dólar en lo que va del año.',
    contenido: `El Banco de la República de Colombia aumentó su tasa de interés de referencia en 25 puntos básicos, de 10.25% a 10.50%, en una decisión que sorprendió al mercado. La junta directiva citó la depreciación del peso colombiano —que acumula una caída del 8.5% frente al dólar en lo que va de 2026— y las presiones inflacionarias derivadas del encarecimiento de las importaciones.

El peso colombiano se ha visto afectado por la reducción de la producción petrolera de Ecopetrol, la incertidumbre política vinculada a las reformas del gobierno Petro y el fortalecimiento global del dólar. La divisa colombiana cotiza a 4,380 pesos por dólar, comparado con 4,040 a inicio de año.

El alza de tasas en Colombia es la primera del ciclo desde agosto de 2023. El presidente del Banco de la República, Leonardo Villar, señaló que "la decisión es preventiva y busca anclar las expectativas de inflación ante la depreciación cambiaria." El peso colombiano ganó 0.6% tras el anuncio.`,
    analisis: `La decisión de Colombia de subir tasas para defender su moneda es un recordatorio de que las divisas de economías exportadoras de petróleo son más vulnerables que el sol peruano al ciclo del commodity. Perú, con una canasta exportadora diversificada, tiene mayor resiliencia cambiaria.

Por ahora, con reservas internacionales sólidas y un superávit exportador robusto, el BCRP tiene amplio margen para manejar la volatilidad sin necesidad de subir tasas. Monitorear el diferencial de tasas entre Perú y Colombia es un indicador relevante de flujos de capital regional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
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
