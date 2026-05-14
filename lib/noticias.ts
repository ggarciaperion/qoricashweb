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
const HOY = '2026-05-14T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  // ── DESTACADAS (portada + página de noticias) ──────────────────────────────
  {
    id: 'f001',
    titulo: 'Suiza apostará fuerte por el oro peruano: el acuerdo que se cerrará con el Minem este lunes',
    descripcion:
      'El próximo lunes se formalizará un memorando de entendimiento entre la Embajada Suiza y el Ministerio de Energía y Minas para promover la minería artesanal y de pequeña escala de oro. La Swiss Better Gold Association agrupa a 29 empresas suizas interesadas en adquirir más oro peruano con asistencia técnica y trazabilidad.',
    contenido: `El próximo lunes se formalizará un memorando de entendimiento entre la Embajada Suiza y el Ministerio de Energía y Minas (Minem) para desarrollar un Programa de Promoción de la Minería Artesanal y de Pequeña Escala (Mape) de oro, según adelantó Paul Garnier, embajador de Suiza en Perú.

El acuerdo contempla tres componentes: un fondo para soluciones innovadoras, diálogo político y gestión de conocimiento. La Swiss Better Gold Association agrupa a 29 empresas suizas interesadas en adquirir más oro peruano de la Mape con asistencia técnica garantizada.

El programa incluye un fondo concursable activo hasta 2028 con tres convocatorias, financiado por la Secretaría de Estado para Asuntos Económicos (SECO) de Suiza, requiriendo al menos 25% en aportes privados. Las importaciones suizas de oro peruano se han mantenido estables entre USD 2.4 y 2.5 millones anuales.

Garnier enfatiza que Suiza busca establecer "un mercado garantizado de más alto nivel" y planea colaborar con plantas de procesamiento de oro para asegurar calidad y trazabilidad. También adelantó negociaciones futuras sobre minerales críticos con gobiernos entrantes.`,
    analisis: `Suiza es el principal centro de refinación y comercialización de oro del mundo: procesa más del 70% del oro global. Un acuerdo formal con el Minem para adquirir oro peruano Mape abre un canal de exportación directo hacia el mercado premium europeo, lo que se traduce en mayor ingreso de divisas al país.

Para el mercado cambiario peruano, más exportaciones de oro significan mayor oferta de dólares, lo que genera presión apreciadora sobre el sol. En un contexto donde el cobre ya está en máximos históricos y el oro también cotiza en niveles elevados, Perú se posiciona como un destino minero de primer orden. Este acuerdo refuerza la narrativa de estabilidad y atractivo de inversión, factores que sostienen al PEN frente al dólar en el mediano plazo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://gestion.pe/resizer/v2/PBSVSHEX3JGIFBVQF4RJP76HGY.png?auth=351adca5a5a5b42c8d9280bc43b5783bbb6be0903453d6289cce4c5b221a6320&width=1200&height=675&quality=75&smart=true',
  },
  {
    id: 'f002',
    titulo: 'Trump viaja a Pekín y pide a Xi Jinping abrir China a las empresas estadounidenses',
    descripcion:
      'El presidente Donald Trump viajó a China acompañado de más de una docena de altos ejecutivos de Nvidia, Apple, Boeing, Meta y Tesla. Trump solicitó a Xi Jinping como su "primerísima prioridad" abrir el mercado chino a las empresas norteamericanas.',
    contenido: `El presidente Donald Trump emprendió un viaje de Estado de tres días a la República Popular China acompañado de más de una docena de altos ejecutivos, incluyendo a Jensen Huang (Nvidia), Tim Cook (Apple), Kelly Ortberg (Boeing), Dina Powell (Meta) y Elon Musk (Tesla).

Desde el Air Force One, Trump publicó en Truth Social: "Pediré al presidente Xi, un líder de distinción extraordinaria, abrir China para que esta gente brillante pueda obrar su magia." Calificó esta petición como su "primerísima prioridad" en las conversaciones bilaterales.

La visita se produce en un contexto de acuerdos parciales en torno al Estrecho de Ormuz: ambos líderes coincidieron en que la vía debe permanecer "abierta para el libre flujo de energía". Xi expresó interés en adquirir crudo estadounidense para reducir la dependencia de la ruta persa. China no ha importado petróleo de EE.UU. desde mayo de 2025, debido al arancel del 20% impuesto durante las tensiones comerciales.`,
    analisis: `Una mayor apertura comercial entre EE.UU. y China reduciría la incertidumbre geopolítica que ha mantenido elevada la demanda de activos refugio como el dólar. Si las negociaciones prosperan, el dólar podría debilitarse frente a divisas emergentes, incluyendo el sol peruano.

Para las empresas peruanas que importan insumos de China o exportan commodities a ambos mercados, una normalización del comercio bilateral es una señal positiva. El efecto directo en el tipo de cambio PEN/USD dependerá de la velocidad con que se concrete cualquier acuerdo y de cómo reaccione la Reserva Federal ante un escenario de menor tensión global.`,
    categoria: 'Internacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://gestion.pe/resizer/v2/LS3CRZMCLNE5JFJTP5NCKQTRWI.jpg?auth=ee880eece3c0e352f782fa318209a6b2281dacc804813a3299ef4159b36d6aec&width=1200&height=675&quality=75&smart=true',
  },

  // ── GESTIÓN — 4 nacionales / regionales ───────────────────────────────────
  {
    id: 'f003',
    titulo: 'Tarifas eléctricas registran en mayo su mayor alza del año: +2.68% para hogares y +2.99% para empresas',
    descripcion:
      'Osinergmin reporta el incremento más alto del 2026 en las tarifas del SEIN. Factores como la variación cambiaria, ajustes en costos de transmisión y el ingreso de nueva infraestructura explican el alza. Expertos advierten que la indexación al dólar mantiene el riesgo de escalada tarifaria.',
    contenido: `Las tarifas de electricidad en el Sistema Eléctrico Interconectado Nacional (SEIN) registran en mayo su mayor ajuste del año: un incremento de 2.68% para usuarios domiciliarios y de 2.99% para usuarios comerciales e industriales, según datos de Osinergmin.

El ajuste obedece a cuatro factores principales: aprobación de precios de generación por variación cambiaria, ajustes en costos de transmisión según indicadores como el IPM y precios de metales, ingreso de nueva infraestructura (ampliación de la subestación Trujillo Norte) y actualización de componentes de distribución. En sistemas aislados se registra una reducción de 5.57% para residenciales.

El acumulado del año en el SEIN: +1.07% residencial y +0.06% comercial-industrial. Expertos alertan que muchos costos del sector están indexados al dólar —transformadores, conductores de cobre, equipos— por lo que una mayor depreciación del tipo de cambio podría escalar las tarifas en el segundo semestre. Las tarifas peruanas ya se ubican 16 centavos de dólar por kWh por encima del promedio latinoamericano.`,
    analisis: `El alza tarifaria eléctrica golpea directamente la estructura de costos de empresas industriales y comerciales, reduciendo márgenes y competitividad exportadora. Para las empresas que operan en sectores como manufactura, agroindustria o minería, este incremento presiona sus costos operativos denominados en soles.

Desde la perspectiva cambiaria, la indexación al dólar de los costos energéticos crea un círculo de retroalimentación: una depreciación del sol eleva las tarifas, lo que a su vez presiona la inflación y puede justificar mayores tasas de interés por parte del BCRP, potencialmente apreciando el sol en el mediano plazo. Las empresas con pasivos en dólares deben considerar este escenario en su planeamiento financiero.`,
    categoria: 'Economía',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/3JTYUFLLSRHZFBPHG6IKKT5W6Q.jpg?auth=75026ab95360908abc8b254a45cdbdaa94be912717097174fd07d5e00d098875&width=1200&height=675&quality=75&smart=true',
  },
  {
    id: 'f004',
    titulo: 'La Granja, en Cajamarca, escala como el segundo mayor proyecto de cobre del mundo tras actualización de First Quantum',
    descripcion:
      'La minera canadiense First Quantum reportó 23 millones de toneladas de cobre fino en La Granja, posicionando al proyecto como el segundo greenfield de cobre más grande del planeta. La operación, en sociedad con Rio Tinto, proyecta minería a tajo abierto con procesamiento y transporte costero mediante tuberías.',
    contenido: `La empresa canadiense First Quantum Minerals presentó una actualización de recursos minerales para el proyecto La Granja, en Cajamarca, desarrollado junto a Rio Tinto (45% de participación). El reporte consolida al yacimiento como el segundo mayor proyecto greenfield de cobre sin desarrollar en el mundo.

Los recursos reportados alcanzan 4,831 millones de toneladas de recursos medidos e indicados con ley de 0.48% de cobre, equivalentes a 23 millones de toneladas de cobre fino, más 5,206 millones de toneladas de recursos inferidos con ley de 0.40%.

La actualización incorpora datos de exploración 2023-2025 con 45,998 metros de perforación diamantina adicionales. El proyecto contempla minería a tajo abierto en dos centros mineralizados (Paja Blanca y Mirador), procesamiento inicial cercano al tajo y transporte mediante tuberías a través de un túnel de 7 km hacia la zona costera, a unos 100 km de distancia, utilizando agua de mar desalinizada.

El CEO Tristan Pascall declaró que "La Granja se posiciona como el segundo mayor proyecto greenfield de cobre del mundo" con potencial para convertirse en una mina Tier 1 de múltiples generaciones.`,
    analisis: `Para Perú, la confirmación de La Granja como uno de los mayores yacimientos de cobre del planeta refuerza la relevancia del país como destino minero global. En un contexto de precios del cobre en máximos históricos, el interés inversor en el proyecto es elevado.

Las divisas asociadas a economías minero-exportadoras tienden a apreciarse cuando los precios de los metales suben. Si La Granja avanza hacia fases de construcción, los flujos de inversión extranjera directa aportarían dólares al mercado cambiario peruano, generando presión apreciadora sobre el sol. Sin embargo, el horizonte de desarrollo de proyectos de esta escala es de largo plazo (más de 5 años hasta producción), por lo que el impacto cambiario inmediato es moderado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/TQWECJXFI5EGJL24U4UDM3VFXQ.jpg?auth=e7059d57c24bbd1b69c36889b70ecb3b909366a951474281a0d3ffc491c7da5d&width=1200&height=675&quality=75&smart=true',
  },
  {
    id: 'f005',
    titulo: 'Palta hass: Perú, segundo exportador mundial, enfrenta riesgos climáticos entre mayo y julio según Senamhi',
    descripcion:
      'Con exportaciones de 723,000 toneladas métricas en 2025 y ventas superiores a US$ 1,000 millones, Perú consolida su posición global. Sin embargo, Senamhi advierte sobre El Niño moderado y condiciones cálidas que podrían afectar la floración y el calibre de los frutos en la costa norte y central.',
    contenido: `Perú mantiene su posición como segundo productor mundial de palta hass desde 2017, superado únicamente por México. En 2025 las exportaciones alcanzaron 723,000 toneladas métricas, un 38% más que en 2024, generando ventas superiores a US$ 1,000 millones. En el primer trimestre de 2026 los envíos sumaron 104,365 toneladas por US$ 237 millones, con un crecimiento de 27.8% en volumen.

Senamhi advierte que "existen condiciones de riesgo para los cultivos de palta en diversas zonas productoras entre mayo y julio próximos". En la costa norte, un El Niño moderado podría afectar el calibre de los frutos. Las condiciones cálidas impactarían la floración y aumentarían la incidencia de plagas en la costa central y sur.

El investigador Ulises Osorio señala que el incremento exportador obedece principalmente al aumento de la superficie cultivada (de 77,000 ha en 2024 a 84,000 en 2026), no a mejoras en rendimiento. ProHass proyecta un crecimiento más moderado del 6% para 2026, atribuyéndolo a "factores climáticos y al ciclo natural de alternancia de la palta".`,
    analisis: `Las exportaciones agroindustriales como la palta son una fuente relevante de divisas para Perú. Cualquier caída en los volúmenes de exportación por efectos climáticos reduciría el ingreso de dólares al mercado cambiario, generando presión depreciadora sobre el sol.

Para empresas que operan en sectores de exportación o que tienen ingresos en dólares vinculados a productos agro, este escenario climático es un riesgo a gestionar. Un retroceso en las exportaciones de palta podría coincidir con presiones cambiarias en el tercer trimestre de 2026, lo que hace relevante evaluar coberturas cambiarias para ese período.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/5NMZU3E5IJD5XLWRLPVSU4H3EM.jpg?auth=4fc4dd5f75b3d8c0949f4b16f3833df563cc31dfa91975e66a9d7ba95494a27e&width=1200&height=675&quality=75&smart=true',
  },
  {
    id: 'f006',
    titulo: 'Chile celebra el precio histórico del cobre: US$ 14,025 por tonelada en la LME, pero advierte riesgos en la oferta',
    descripcion:
      'El metal rojo alcanzó máximos en la Bolsa de Metales de Londres impulsado por la recuperación de la demanda china y restricciones en el suministro global. El ministro de Economía chileno destacó que por cada centavo de alza, Chile recibe entre US$ 30 y US$ 40 millones adicionales en impuestos.',
    contenido: `El cobre alcanzó máximos históricos al llegar a US$ 14,025 por tonelada en la Bolsa de Metales de Londres (LME), equivalente a US$ 6.29 por libra, su récord all-time. El incremento del 0.6% en la sesión refleja la recuperación de la demanda industrial china y restricciones en los suministros de azufre en Oriente Medio.

El ministro de Economía de Chile, Daniel Mas, celebró el hecho: "El precio histórico alcanzado por el cobre es una buena noticia para la economía chilena", estimulando nuevas inversiones mineras. Sin embargo, la Comisión Chilena del Cobre advierte que el precio refleja "una creciente preocupación por la capacidad de respuesta de la oferta mundial".

Chile registró en 2025 una caída en la producción del 1.65%, principalmente por interrupciones en la mina El Teniente. La producción chilena de 2025 fue inferior a las proyecciones. Por cada centavo de alza en el precio del cobre, Chile recibe entre US$ 30 y US$ 40 millones adicionales en recaudación fiscal.`,
    analisis: `El cobre en máximos históricos tiene impacto directo en Perú, segundo productor mundial del metal. Precios elevados se traducen en mayores ingresos por exportaciones mineras, lo que aumenta la oferta de dólares en el mercado cambiario y genera presión apreciadora sobre el sol peruano.

El contexto es favorable para el PEN en el corto plazo: alta demanda de cobre + Petroperú estabilizada + inversión minera en curso. El riesgo es que la incertidumbre en la oferta global pueda crear volatilidad en el precio, y que una eventual corrección del cobre por debajo de US$ 10,000/ton revierta estas presiones positivas sobre el sol. Recomendamos monitorear el comportamiento del índice de la LME como indicador adelantado del tipo de cambio peruano.`,
    categoria: 'Internacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/J3TOKDVQSZBPFHLCJ3FXU4UEIU.jpg?auth=244f5246390ab88cecc6f0bb20c84d4cc834e95d8e70ebd2aabd322303964989&width=1200&height=675&quality=75&smart=true',
  },

  // ── GESTIÓN / BofA — INTERNACIONAL ────────────────────────────────────────
  {
    id: 'f007',
    titulo: 'S&P 500 y oro apuntan a un cuarto año consecutivo de ganancias de dos dígitos, según Bank of America',
    descripcion:
      'El índice bursátil estadounidense proyecta una ganancia anualizada del 20% y el oro apunta a un alza del 30% en 2026, según Michael Hartnett de BofA. Un logro que solo se había observado durante la Segunda Guerra Mundial y la burbuja de 1995-1999.',
    contenido: `Los mercados estadounidenses y el oro se encaminan hacia un cuarto año consecutivo de ganancias de dos dígitos, según el estratega sénior de Bank of America, Michael Hartnett. El S&P 500 proyecta una ganancia anualizada del 20%, mientras que el oro apunta hacia un alza del 30% en el año.

Hartnett señala que "avances prolongados de esta magnitud solo se observaron durante la Segunda Guerra Mundial, el período de paz posterior y la burbuja de 1995-1999." Las ganancias han sido impulsadas principalmente por empresas de megacapitalización y tecnológicas, aunque otros sectores comienzan a mostrar fortaleza, incluyendo pequeña capitalización, mercados emergentes y materias primas.

El equipo de BofA proyecta que la economía estadounidense se expanda 5.5% en términos nominales este año, con crecimiento de ganancias corporativas del 20%. Las acciones de materiales, que representan apenas el 2% del S&P 500, podrían convertirse en "el nuevo protagonista alcista" por competencia geopolítica por recursos, aumento del gasto militar y expansión en inteligencia artificial.`,
    analisis: `Un mercado bursátil estadounidense en auge con el dólar como activo refugio mantiene la demanda de USD elevada globalmente. Para Perú, esto se traduce en un dólar fuerte que presiona al alza el tipo de cambio PEN/USD. La conjunción de S&P 500 alcista + inflación persistente en EE.UU. aleja la posibilidad de recortes de tasas por la Reserva Federal, lo que perpetúa la fortaleza del dólar.

El oro en máximos también es una señal de que los inversores globales buscan refugio ante incertidumbre geopolítica. Si este escenario continúa, las divisas emergentes como el sol peruano podrían experimentar presión depreciadora moderada. Para quienes tienen obligaciones en dólares, este es un contexto que refuerza la conveniencia de comprar USD cuando el tipo de cambio muestre correcciones a la baja.`,
    categoria: 'Internacional',
    fuente: 'Gestión / Bloomberg Intelligence',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/7WBHPKIRKZD5ZGAIH3NNIMXZFY.jpg?auth=61784d39808ce5106371dafc527b6725f7a9c7306ade9e50b7f73e750983573d&width=1200&height=675&quality=75&smart=true',
  },
  {
    id: 'f008',
    titulo: 'Emiratos Árabes Unidos abandona la OPEP y abre interrogantes sobre el control del mercado petrolero global',
    descripcion:
      'La inesperada salida de EAU de la OPEP, motivada por tensiones con Arabia Saudita y el bloqueo del Estrecho de Ormuz, debilita la capacidad del cartel de gestionar precios. Analistas advierten sobre el riesgo de guerras de cuotas y mayor volatilidad en el crudo al reanudarse los flujos petroleros.',
    contenido: `Los Emiratos Árabes Unidos anunciaron su retiro de la Organización de Países Exportadores de Petróleo (OPEP), organización de la que formaban parte desde hace seis décadas. La decisión, que tomó por sorpresa a sus socios, culmina tensiones prolongadas con Arabia Saudita, líder de facto del cartel.

La salida de EAU, el tercer mayor productor del grupo, reduce la capacidad de la OPEP de gestionar el precio del crudo mediante ajustes en la oferta. La producción emiratí enfrenta actualmente restricciones por el bloqueo del Estrecho de Ormuz, lo que hace la salida menos disruptiva en el corto plazo. Sin embargo, una vez que los flujos petroleros se reanuden, EAU podría elevar su producción libremente para ganar cuota de mercado.

El ministro de Energía emiratí, Suhail Al Mazrouei, atribuyó la salida al conflicto con Irán, señalando que el cierre del Estrecho forzó recortes en el 10% del suministro global. Analistas advierten sobre un posible efecto dominó dentro del cartel y el riesgo de que la capacidad de la OPEP de defender precios se erosione significativamente.`,
    analisis: `Una OPEP debilitada y con mayor producción fuera del cartel apunta hacia precios del petróleo más bajos en el mediano plazo. Para Perú, esto tiene efectos mixtos: menores costos de combustibles (positivo para la inflación y el poder adquisitivo) pero también menor atractivo para inversión en proyectos energéticos nacionales.

Para el tipo de cambio, un petróleo más barato en el mundo reduce la inflación global, lo que puede dar espacio a la Fed para recortar tasas antes de lo esperado, potencialmente debilitando al dólar. En el corto plazo, sin embargo, la incertidumbre genera volatilidad en los mercados de divisas. Quienes tengan necesidades de dólares en los próximos 30-60 días podrían aprovechar ventanas de tipo de cambio favorable antes de que el panorama energético se aclare.`,
    categoria: 'Internacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/5ZWFG6BEYRCBVN3CWH6F3YVBFM.jpg?auth=e26cfe286523b4d2a3ce4f40b95edef5f900ec00906d54ff89ffb58c6e3d1f0e&width=1200&height=675&quality=75&smart=true',
  },
  {
    id: 'f009',
    titulo: 'Fitch mejora la calificación de Argentina a B- y abre una ventana para que vuelva al mercado de bonos',
    descripcion:
      'La mejora crediticia de Fitch comprimió los spreads argentinos a mínimos desde febrero. Argentina enfrenta vencimientos de US$ 25,000 millones en 2027 y tiene una ventana estrecha para emitir deuda antes de que el calendario electoral cierre el acceso a los mercados en ese año.',
    contenido: `Fitch Ratings elevó la calificación crediticia de Argentina a B-, potencialmente permitiendo al país regresar a los mercados internacionales de bonos tras años de exclusión. La mejora comprimió los spreads de los bonos 2035 a aproximadamente 515 puntos básicos —el mínimo desde el 18 de febrero— con rendimientos acercándose al 9.5%.

El presidente Javier Milei tiene una ventana estrecha de emisión antes de que las incertidumbres electorales de 2027 dominen los mercados. "Se está abriendo una ventana, pero será estrecha", señaló Thierry Larose de Vontobel Asset Management. El ministro de Economía Luis Caputo enfatiza que si el acceso a financiamiento al 6% permite cancelar deuda al 9.5%, "es lo mejor para los argentinos."

Las exportaciones agrícolas estacionales, ingresos energéticos y demanda de deuda corporativa generan flujos sostenidos de dólares. El banco central argentino ha comprado más de US$ 7,000 millones este año. Argentina enfrenta pagos de aproximadamente US$ 25,000 millones en 2027, de los cuales US$ 15,000 millones corresponden a bonos en moneda extranjera.`,
    analisis: `La estabilización de Argentina —la segunda economía de Sudamérica— tiene impacto regional en el apetito inversor por mercados emergentes latinoamericanos. Cuando Argentina mejora su perfil crediticio, los inversores tienden a revisar positivamente también a Perú, Colombia y Chile, reduciendo primas de riesgo y generando flujos de capital hacia la región.

Para el tipo de cambio peruano, una Argentina más estable reduce el riesgo de contagio de una crisis cambiaria vecina. Sin embargo, si Argentina emite deuda agresivamente a tasas competitivas, podría competir con Perú por el capital disponible en mercados emergentes. Monitorear la evolución del riesgo soberano argentino es relevante como indicador adelantado del apetito regional por activos denominados en monedas locales.`,
    categoria: 'Internacional',
    fuente: 'Gestión / Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://gestion.pe/resizer/v2/PULKNPZBGZF7XMV4RR6PKCGRWI.jpg?auth=bb48a5398e670614350eed813858dd9d6e0290ec189f95374c44835f3a4c405c&width=1200&height=675&quality=75&smart=true',
  },

  // ── TRADINGVIEW ────────────────────────────────────────────────────────────
  {
    id: 'f010',
    titulo: 'Ventas minoristas de EE.UU. suben 0.5% en abril pese a presiones inflacionarias; dólar se fortalece',
    descripcion:
      'Las ventas minoristas en EE.UU. alcanzaron US$ 757,100 millones en abril, con un alza interanual del 4.9%. La inflación al productor escaló 6.0% interanual —máximo desde diciembre 2022— y la inflación al consumidor aceleró a 3.8% anual, frenando las expectativas de recorte de tasas de la Reserva Federal.',
    contenido: `Las ventas minoristas en los Estados Unidos subieron 0.5% mensual en abril hasta US$ 757,100 millones, en línea con las previsiones del mercado. En términos interanuales, las ventas crecieron 4.9%. El dato del mes anterior fue revisado al alza, a 1.6%.

El dólar se fortaleció tras el reporte, con el US Dollar Index subiendo 0.13% hasta 98.58. Sin embargo, los datos inflacionarios son el verdadero foco de atención: los precios al productor (PPI) se dispararon 1.4% mensual en abril —el mayor alza mensual desde marzo de 2022— y 6.0% interanual, el nivel más alto desde diciembre de 2022. La inflación al consumidor (CPI) aceleró a 3.8% anual, por encima del 3.7% esperado y del 3.3% de marzo, el mayor incremento desde mayo de 2023.

Los precios mensuales al consumidor subieron 0.6% en abril. Los aumentos en energía —impulsados por tensiones en Oriente Medio— contribuyeron al alza en gasolina, alimentos y bienes del hogar. Estos datos amplificaron la preocupación sobre si las perturbaciones en la oferta podrían pesar sobre la actividad económica.`,
    analisis: `Inflación persistente en EE.UU. = Reserva Federal postergando recortes de tasas = dólar fuerte. Esta cadena de causalidad es directamente relevante para el tipo de cambio PEN/USD. Con el CPI en 3.8% y el PPI en 6.0% interanual, el mercado descuenta ahora menos de un recorte de tasas de la Fed para todo 2026, lo que mantiene el dólar en niveles elevados.

Para las empresas peruanas con deuda en dólares o que importan en USD, este es un contexto de mayor costo financiero real. Para quienes exportan o reciben dólares, el tipo de cambio elevado mejora su margen en soles. La clave será el próximo dato de empleo en EE.UU.: si el mercado laboral se enfría, la Fed podría encontrar la ventana para recortar, debilitando al dólar.`,
    categoria: 'Internacional',
    fuente: 'TradingView / Invezz',
    fecha: HOY,
    destacada: false,
    imagen: 'https://s3.tradingview.com/news/image/invezz:f7038f41509cd-482035d9c379648198214ad6885064f4-resized.webp',
  },
  {
    id: 'f011',
    titulo: 'Petróleo cae tras reporte de decenas de buques cruzando el Estrecho de Ormuz; Trump y Xi acuerdan mantenerlo abierto',
    descripcion:
      'El Brent bajó 0.6% a US$ 105.03 y el WTI cayó 0.5% a US$ 100.50 después de que medios iraníes reportaran el paso de aproximadamente 30 buques por el Estrecho de Ormuz. La Casa Blanca confirmó que Trump y Xi acordaron que la vía marítima debe permanecer abierta para el libre flujo de energía.',
    contenido: `Los precios del petróleo retrocedieron el jueves luego de que medios estatales iraníes reportaran que aproximadamente 30 embarcaciones habían transitado el Estrecho de Ormuz recientemente. La agencia Fars, semi-oficial, citó fuentes que afirmaban que Irán había comenzado a permitir el paso a ciertos buques chinos.

El Brent cayó 60 centavos (0.6%) hasta US$ 105.03 por barril, mientras el WTI norteamericano retrocedió 52 centavos (0.5%) hasta US$ 100.50. La Casa Blanca confirmó que durante las conversaciones entre Trump y Xi Jinping en Pekín, ambos líderes acordaron que el Estrecho de Ormuz "debe permanecer abierto para el libre flujo de energía."

Xi expresó interés en adquirir crudo adicional de EE.UU. para reducir la dependencia de la ruta persa. Los descensos del día anterior habían reflejado preocupaciones de los inversores sobre posibles aumentos de tasas de la Fed impulsados por la inflación energética.`,
    analisis: `Una apertura progresiva del Estrecho de Ormuz alivia las presiones inflacionarias globales provenientes del lado energético. Si el precio del petróleo continúa descendiendo desde US$ 105, se reduce la presión sobre la inflación mundial, lo que abre espacio para que la Reserva Federal considere recortes de tasas antes de lo esperado.

Para el tipo de cambio peruano, un petróleo más barato significa: menor inflación importada, menor presión sobre las tarifas de transporte y energía, y eventualmente un dólar menos fuerte. Sin embargo, la situación es volátil: cualquier nuevo incidente en el Estrecho puede revertir estas ganancias en horas. Recomendamos mantener atención a los reportes diarios de navegación por el Golfo como indicador clave de la dirección del crudo.`,
    categoria: 'Internacional',
    fuente: 'TradingView / Reuters',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: 'f012',
    titulo: 'Zinc toca su máximo en casi cuatro años tras incendio en Cajamarquilla, Perú: +2.5% en la LME',
    descripcion:
      'Un incendio en la fundición Cajamarquilla de Nexa Resources en Perú —la mayor de Latinoamérica con 344,400 toneladas anuales de capacidad— disparó el precio del zinc a US$ 3,633.5 por tonelada, su nivel más alto desde agosto de 2022. El déficit global proyectado del metal asciende a 19,000 toneladas para el año.',
    contenido: `Los precios del zinc se dispararon hasta alcanzar su nivel más alto en casi cuatro años, impulsados por el incendio en la fundición Cajamarquilla de Nexa Resources en Perú. El contrato de referencia a tres meses en la Bolsa de Metales de Londres (LME) ganaba 2.5%, llegando a US$ 3,615 por tonelada con un pico de US$ 3,633.5 —el mayor desde agosto de 2022.

La fundición Cajamarquilla, la más grande de Latinoamérica con capacidad de 344,400 toneladas anuales, paralizó temporalmente sus operaciones como consecuencia del incidente. "Entre las explosiones en Kazzinc y el incendio en Cajamarquilla, cada vez es más evidente que el suministro de zinc no es tan abundante", señalaron analistas de Marex.

El Grupo Internacional de Estudio sobre Plomo y Zinc proyectaba un déficit de 19,000 toneladas para el año. Las existencias de zinc en la LME representan menos de tres días de consumo mundial, una señal de extrema escasez. El aluminio también subía 0.4% a US$ 3,665.5, cercano a máximos de cuatro años.`,
    analisis: `La pausa en la fundición Cajamarquilla tiene impacto directo en la economía peruana: menores exportaciones de zinc refinado reducen temporalmente los ingresos en divisas del país. Sin embargo, el alza de precios en la LME podría compensar parcialmente el menor volumen si la paralización es breve.

Para el tipo de cambio, las perturbaciones en la producción minera nacional tienen un impacto mixto: reducen la oferta de dólares proveniente de exportaciones (presión depreciadora sobre el sol) pero también pueden elevar las cotizaciones del metal (efecto compensador). El incidente en Cajamarquilla es un recordatorio de los riesgos operativos de la industria minera peruana y su importancia como generadora de divisas para el mercado cambiario.`,
    categoria: 'Economía',
    fuente: 'TradingView / Reuters',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },

  // ── INFOBAE ────────────────────────────────────────────────────────────────
  {
    id: 'f013',
    titulo: 'Dólar en Argentina en tiempo real: el oficial cotiza a $1,415 para la venta y el blue se mantiene en $1,420',
    descripcion:
      'El mercado cambiario argentino opera sin grandes variaciones este 14 de mayo. El dólar oficial se ubica en $1,415 en el Banco Nación y el dólar blue en $1,420, ambos sin cambios en las últimas 24 horas, en un contexto de relativa estabilidad bajo el programa económico de Milei.',
    contenido: `El dólar oficial en Argentina cotiza a $1,415 para la venta en el Banco Nación de Argentina, sin variaciones respecto a la jornada anterior. El dólar blue (paralelo) se mantiene en $1,420 para la venta, también estable. La brecha cambiaria entre ambos tipos se ubica en un mínimo histórico de apenas 0.35%.

La relativa estabilidad cambiaria es atribuida al programa económico del presidente Javier Milei, que ha logrado reducir la inflación mensual de manera consistente desde el pico del 25% en diciembre de 2023. El banco central argentino ha acumulado más de US$ 7,000 millones en reservas durante 2026, fortaleciendo la posición cambiaria.

El mercado aguarda con atención los datos de inflación de abril, que el gobierno anticipa mostrarán una baja significativa hacia la zona del 2% mensual.`,
    analisis: `La estabilización del tipo de cambio en Argentina es relevante para el mercado cambiario regional. Una brecha mínima entre el dólar oficial y el paralelo indica que el programa de ajuste fiscal y monetario de Milei está ganando credibilidad. Esto reduce el riesgo de contagio hacia otras divisas de la región, incluyendo el sol peruano.

Para los operadores de divisas en Perú, el mercado argentino es un termómetro del apetito inversor regional. Si Argentina logra mantener esta estabilidad, el capital que huía hacia dólares por desconfianza en la región podría redistribuirse parcialmente hacia activos en moneda local, favoreciendo al sol peruano en el mediano plazo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80',
  },
  {
    id: 'f014',
    titulo: 'Desaparecieron más de 13,000 empresas empleadoras en Argentina en el último año: las provincias más afectadas',
    descripcion:
      'El cierre de más de 13,000 empresas empleadoras en Argentina en 12 meses refleja el impacto del ajuste fiscal sobre la actividad económica. Provincias del interior fueron las más afectadas. El dato contrasta con la reducción de la inflación y la mejora del perfil crediticio soberano.',
    contenido: `Más de 13,000 empresas empleadoras cerraron en Argentina durante el último año, según datos del sistema de seguridad social. El fenómeno se distribuye de manera desigual a nivel territorial, con provincias del interior del país —especialmente las más dependientes del gasto público— registrando las mayores caídas.

El cierre masivo de empresas es la cara menos visible del ajuste económico del gobierno de Milei: la reducción del gasto público y la contracción del consumo interno han golpeado especialmente a las pequeñas y medianas empresas orientadas al mercado doméstico. Sin embargo, el sector exportador y la construcción muestran señales de recuperación.

Los datos de empleo formal se publicarán junto con los índices de inflación de abril, lo que dará una imagen más completa del estado del mercado laboral argentino.`,
    analisis: `La contracción del tejido empresarial argentino tiene implicancias para la demanda de importaciones de países vecinos, incluyendo Perú. Si la actividad económica en Argentina se mantiene deprimida, la demanda por bienes y servicios peruanos en ese mercado puede reducirse.

Desde la perspectiva cambiaria, una economía argentina débil en actividad pero con menor inflación presenta un escenario mixto para el peso argentino y sus pares regionales. Para Perú, lo más relevante es que la contracción argentina podría generar menores flujos de capitales hacia Latinoamérica como bloque, lo que presionaría a las divisas regionales a la baja respecto al dólar.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  },
  {
    id: 'f015',
    titulo: "Inflación de abril en Argentina: el gobierno anticipa una baja fuerte hacia el 2% mensual para consolidar la desaceleración",
    descripcion:
      'Se publicarán hoy los datos de inflación de abril en Argentina. El gobierno de Milei anticipa una reducción significativa que confirmaría la tendencia desinflacionaria iniciada en enero de 2024. Una inflación bajo control es condición clave para la sostenibilidad del programa económico y el regreso a los mercados de bonos.',
    contenido: `El gobierno argentino anticipa que la inflación de abril se ubicará por debajo del 3% mensual, posiblemente acercándose al 2%, lo que representaría un hito en el proceso de desaceleración iniciado tras el pico del 25% mensual de diciembre de 2023. Los datos serán publicados hoy por el INDEC (Instituto Nacional de Estadística y Censos).

El programa económico del presidente Javier Milei se sustenta sobre tres pilares: equilibrio fiscal primario, reducción del gasto público y control de la emisión monetaria. La desinflación consistente es el indicador más visible de su éxito, y también la condición que Fitch citó para la mejora crediticia a B-.

Sin embargo, la inflación acumulada desde diciembre de 2023 supera el 200%, lo que significa que el nivel de precios es sustancialmente más alto que hace un año, erosionando el poder adquisitivo real de los salarios argentinos.`,
    analisis: `Una inflación argentina en descenso acelerado es positiva para la estabilidad regional. Históricamente, los períodos de alta inflación en Argentina generan "dolarización por contagio" en economías vecinas: los agentes económicos de países como Perú aumentan su demanda de dólares como cobertura ante la incertidumbre regional.

Si Argentina consolida una inflación mensual del 2% o menos, ese efecto de contagio se atenúa, lo que puede contribuir a una menor demanda especulativa de dólares en el mercado peruano. En términos directos, una Argentina estabilizada es una buena noticia para el PEN y para quienes buscan predictibilidad en el tipo de cambio.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
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
