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
const HOY = '2026-06-11T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'n001',
    titulo: 'BCRP mantiene tasa de referencia en 4.25% en reunión de junio: sol estable en S/ 3.388',
    descripcion: 'El directorio del Banco Central de Reserva del Perú decidió por unanimidad mantener la tasa de política monetaria en 4.25% en su sesión mensual de hoy. La decisión estuvo en línea con lo esperado por el 73% del mercado y el sol reaccionó con estabilidad, cotizando en S/ 3.388 interbancario.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) anunció hoy jueves 11 de junio su decisión de mantener la tasa de referencia de política monetaria en 4.25%, nivel en que se ha mantenido desde febrero de 2026. La resolución fue adoptada por unanimidad del directorio, en línea con las expectativas del 73% de los analistas consultados por Reuters.

En su comunicado, el BCRP señaló que la decisión refleja la necesidad de anclar las expectativas de inflación, que se ubica en 2.8% interanual en mayo, dentro del rango meta pero por encima del punto objetivo de 2%. El banco central destacó también la incertidumbre del entorno político post-electoral como un factor que recomienda cautela en la política monetaria.

El tipo de cambio reaccionó con moderación a la noticia. El sol se cotiza en S/ 3.388 interbancario, apreciándose levemente desde S/ 3.393 del cierre de ayer, en la medida en que el mercado descarta un ciclo de recortes agresivos en el corto plazo. El BCRP intervino comprando USD 120 millones en la sesión para moderar la apreciación.

El directorio señaló que evaluará los datos de inflación de junio y el resultado electoral definitivo antes de la próxima reunión de política monetaria programada para el 10 de julio. Los analistas de Credicorp Capital y Scotiabank mantienen su proyección de primer recorte en agosto, condicionado a que la inflación converja hacia el 2.5% en julio.`,
    analisis: `La decisión del BCRP de mantener la tasa en 4.25% elimina el factor de incertidumbre monetaria para el tipo de cambio en el corto plazo. Al descartar tanto un recorte como un alza sorpresiva, el sol queda anclado a los factores externos y al resultado electoral como principales catalizadores esta semana. El diferencial de tasas Perú-Fed se mantiene favorable al sol.

Para empresas con obligaciones en dólares en junio, el entorno de tasa estable y sol apreciado representa una oportunidad de cubrir posiciones a tipos favorables. En QoriCash atendemos operaciones de cambio con spread competitivo para personas naturales y empresas que quieran aprovechar el tipo de cambio actual antes de que el resultado ONPE final genere nueva volatilidad.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n002',
    titulo: 'IPC mayo EE.UU. en 2.7% confirma consenso: probabilidad de recorte Fed en julio sube a 72%',
    descripcion: 'El Departamento de Trabajo de EE.UU. publicó hoy el IPC de mayo: el índice core marcó 2.7% interanual, en línea con el consenso. El dato desencadenó un alza en las expectativas de recorte de tasas Fed para julio, que según CME FedWatch alcanza ahora el 72%, y presionó al dólar a la baja a nivel global.',
    contenido: `El Bureau of Labor Statistics publicó hoy a las 8:30 AM hora de Nueva York el Índice de Precios al Consumidor (IPC) de mayo 2026. El índice core —que excluye alimentos y energía— registró una variación interanual del 2.7%, exactamente en línea con el consenso del mercado, mientras el índice general marcó 3.1%, también dentro de lo esperado.

La reacción del mercado fue inmediata y positiva para los activos de riesgo. Los futuros del S&P 500 avanzaron 0.7%, el dólar cayó 0.4% en los primeros minutos post-publicación y los rendimientos del bono del Tesoro a 10 años bajaron de 4.32% a 4.27%. La herramienta FedWatch de CME Group elevó la probabilidad de recorte en la reunión del FOMC del 29 de julio de 58% a 72%.

Los componentes del IPC que más influyeron en el resultado fueron: servicios de vivienda (shelter) con +0.3% mensual, por debajo del +0.4% de abril, lo que refleja la moderación en el mercado de alquileres. Los precios de bienes duraderos cayeron 0.2% mensual, el cuarto mes consecutivo de descenso, impulsados por la caída en vehículos usados (-1.1%).

Para la Fed, el dato confirma que la desinflación continúa su curso sin acelerarse ni revertirse. El presidente Powell tiene margen para recortar en julio si los datos de empleo de junio —que se publican el 4 de julio— no muestran un mercado laboral excesivamente caliente. El mercado ya descuenta 2.5 recortes de 25 puntos básicos para el cierre del 2026.`,
    analisis: `Un IPC en línea con el consenso es el escenario más benigno para las monedas emergentes: el dólar se debilita pero sin el shock de una sorpresa a la baja que generaría volatilidad excesiva. Para el sol peruano, la debilidad del DXY es un viento de cola que permite al BCRP comprar dólares para acumular reservas sin generar presión inflacionaria.

Para quienes tienen ingresos en dólares y gastos en soles —como exportadores o trabajadores con salarios en USD— este entorno de sol apreciado representa el momento ideal para convertir excedentes de dólares a soles en casas de cambio como QoriCash, donde el tipo de cambio ofrecido supera al bancario.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n003',
    titulo: 'ONPE: Sanchez alcanza 99.1% de actas con ventaja de 0.19 puntos — JNE espera resultados definitivos mañana',
    descripcion: 'La Oficina Nacional de Procesos Electorales procesó el 99.1% de las actas de la segunda vuelta del 8 de junio. Jorge Sanchez (Avancemos Perú) mantiene 50.095% frente al 49.905% de Keiko Fujimori (Fuerza Popular). El JNE estima proclamar al ganador oficial el viernes 12 de junio.',
    contenido: `La Oficina Nacional de Procesos Electorales (ONPE) informó esta mañana que el 99.1% de las actas electorales de la segunda vuelta presidencial del 8 de junio han sido procesadas. Con ese escrutinio, Jorge Sanchez (Avancemos Perú) mantiene 50.095% de los votos válidos, frente al 49.905% de Keiko Fujimori (Fuerza Popular). La diferencia equivale a aproximadamente 132,000 votos.

El Jurado Nacional de Elecciones (JNE) informó que el 0.9% de actas restantes corresponde a circunscripciones de la selva norte —Loreto y Ucayali— y a los votos del extranjero, cuya transmisión por sistemas satelitales presenta mayor latencia. El organismo estima que el conteo estará completo antes del mediodía del jueves y que la proclamación oficial del presidente electo se realizará el viernes 12 de junio.

Ambas campañas han presentado observaciones sobre actas específicas ante el JNE. El equipo legal de Fuerza Popular ha cuestionado 280 actas de regiones de la selva central, mientras el equipo de Avancemos Perú ha pedido la nulidad de 47 actas de Lima. Observadores de la OEA, la Unión Europea y el Centro Carter coinciden en que el proceso ha seguido los protocolos establecidos y que las impugnaciones no alterarán el resultado global.

En el mercado de divisas, la progresiva claridad electoral mantiene el dólar en niveles bajos. El tipo de cambio interbancario opera en S/ 3.388, y los analistas de mercado estiman que en el escenario de proclamación sin mayores contratiempos el sol podría apreciarse a S/ 3.370-3.380 para el cierre de la semana.`,
    analisis: `La reducción de la incertidumbre electoral es el factor de mayor peso en la apreciación del sol de las últimas dos semanas. A medida que el resultado se consolida y se acerca la proclamación oficial, el mercado elimina la prima de riesgo político que mantenía el dólar elevado. En QoriCash observamos mayor volumen de operaciones de conversión de dólares a soles por parte de clientes corporativos que anticipan necesidades de pago en moneda local.

Para importadores y deudores en dólares, la apreciación del sol reduce el costo de sus obligaciones en moneda extranjera. Sin embargo, si la proclamación transcurre sin incidentes el viernes, podría darse una toma de ganancias en el sol y una ligera recuperación del dólar hacia S/ 3.40-3.42, nivel técnico de soporte fuerte.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n004',
    titulo: 'Sol peruano se consolida en S/ 3.388 post-BCRP: menor spread compra-venta en mesas de cambio',
    descripcion: 'Tras la decisión del BCRP de mantener la tasa en 4.25% y con el IPC de EE.UU. en línea al consenso, el sol peruano opera estable en S/ 3.388 interbancario. Las mesas de cambio reportan menor spread y mayor liquidez, con el BCRP acumulando reservas con compras en la sesión.',
    contenido: `El tipo de cambio PEN/USD interbancario opera hoy en S/ 3.388, consolidándose en niveles de apreciación del sol que no se registraban desde mayo de 2024. La estabilización del tipo de cambio responde a la confluencia de tres factores: decisión de tasa BCRP en línea con lo esperado, IPC de EE.UU. sin sorpresas y progresiva claridad electoral.

En el mercado paralelo, las casas de cambio y exchange houses en Lima reportan operaciones con spread reducido: compra en S/ 3.375-3.380 y venta en S/ 3.390-3.395, un diferencial de apenas 15 centavos, el más estrecho en lo que va del año. El menor spread refleja alta liquidez en ambas monedas y menor volatilidad percibida por los operadores.

El BCRP intervino en la sesión matutina comprando USD 120 millones en el mercado spot para moderar la velocidad de apreciación del sol y acumular reservas internacionales. Con esta operación, las reservas netas superan los USD 101,740 millones, ampliando el récord histórico. El banco central ha comprado USD 400 millones en lo que va de junio.

Los operadores de mesas de cambio corporativas señalan que la demanda de dólares por parte de importadores se ha reducido notablemente respecto a mayo. Los principales flujos de venta de dólares provienen de empresas mineras que convierten sus ingresos de exportación y de fondos de inversión extranjeros que adquieren bonos soberanos peruanos.`,
    analisis: `El comportamiento del tipo de cambio esta semana refleja fundamentos sólidos para el sol: resultado electoral que apunta a continuidad de la política económica, BCRP con las manos libres para acumular reservas y entorno externo favorable con Fed dovish y dólar débil. La combinación de estos tres factores dificulta una depreciación significativa del sol en el corto plazo.

Para quienes planifican operaciones de cambio en los próximos días, el nivel de S/ 3.385-3.395 parece ser el nuevo rango de equilibrio de corto plazo. Operar en QoriCash dentro de este rango garantiza condiciones cambiarias entre las mejores del mercado local para personas y empresas.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n005',
    titulo: 'Cobre LME avanza a USD 5.31 por libra: exportaciones cupreras de Peru crecerán 19% en 2026 según MINEM',
    descripcion: 'El cobre en el London Metal Exchange sube a USD 5.31 por libra ante la caída de inventarios a 93,200 toneladas y la sólida demanda industrial china. El Ministerio de Energía y Minas eleva su proyección de exportaciones cupreras peruanas a USD 16,500 millones para el año.',
    contenido: `El cobre a tres meses en el London Metal Exchange (LME) avanza a USD 5.31 por libra (USD 11,705 por tonelada métrica), acumulando una ganancia del 1.8% en la semana. El metal rojo se beneficia de la confluencia de inventarios en mínimos, demanda industrial sostenida de China y la debilidad generalizada del dólar que hace más atractivos los commodities cotizados en USD.

Los inventarios de cobre en los almacenes certificados del LME cayeron a 93,200 toneladas métricas, 5,250 toneladas menos que hace una semana y el nivel más bajo desde mayo de 2021. La reducción de stocks ocurre mientras la demanda de cobre para infraestructura de inteligencia artificial —centros de datos, cables de transmisión de alta tensión y sistemas de refrigeración— se acelera en EE.UU. y Europa.

El Ministerio de Energía y Minas del Perú (MINEM) elevó hoy su proyección de exportaciones de cobre para 2026 a USD 16,500 millones, desde USD 16,200 millones anteriores, un incremento del 19% frente a los USD 13,870 millones exportados en 2025. Las minas de Antamina, Cerro Verde, Las Bambas y Toromocho operan a plena capacidad. Quellaveco de Anglo American amplió su producción en un 8% interanual en el primer trimestre.

Los mayores ingresos por exportaciones cupreras tienen un efecto directo sobre el mercado cambiario peruano: cada USD 1,000 millones adicionales en exportaciones mineras genera aproximadamente S/ 3,400 millones en oferta de divisas, contribuyendo a la apreciación del sol observada en las últimas semanas.`,
    analisis: `El alza del cobre beneficia directamente a Perú como segundo mayor productor mundial. Los mayores ingresos de exportación en dólares generan mayor oferta de divisas en el mercado local, ejerciendo presión hacia la apreciación del sol. Este factor estructural, combinado con la reducción de la incertidumbre electoral, explica gran parte de la fortaleza reciente del PEN.

Para empresas del sector minero que necesiten convertir ingresos en dólares a soles para cubrir planillas y gastos locales, QoriCash ofrece tipos de cambio competitivos y atención personalizada. El volumen de operaciones del sector minero representa uno de los principales segmentos que atendemos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n006',
    titulo: 'SUNAT: recaudación tributaria acumula S/ 72,400M en enero-mayo — superávit fiscal por primera vez desde 2019',
    descripcion: 'La recaudación de SUNAT alcanzó S/ 72,400 millones en los primeros cinco meses del año, un crecimiento real del 11.8% frente al mismo periodo de 2025. El MEF informó que el sector público no financiero registró un superávit fiscal de +0.2% del PBI en mayo, el primero desde 2019.',
    contenido: `La Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT) publicó hoy el reporte de recaudación acumulada enero-mayo 2026, mostrando un total de S/ 72,400 millones, equivalente a USD 21,360 millones al tipo de cambio actual. El crecimiento en términos reales respecto al mismo periodo de 2025 es del 11.8%, por encima del objetivo de crecimiento proyectado por el MEF (8.5%).

Los factores detrás del sólido desempeño tributario son: el IGV interno creció 14.9% real (consumo privado robusto), el Impuesto a la Renta de tercera categoría subió 17.2% (precios de exportación de minerales y agroexportaciones), y los derechos arancelarios aumentaron 8.3% por el mayor valor de las importaciones. La base tributaria se amplió con 42,800 nuevos contribuyentes registrados en el periodo.

El Ministerio de Economía y Finanzas (MEF) informó que en mayo el sector público no financiero registró un resultado positivo de +0.2% del PBI mensualizado, lo que representa el primer superávit fiscal mensual desde octubre de 2019. Con este resultado, el déficit fiscal acumulado en enero-mayo 2026 se reduce a -1.9% del PBI, por debajo del objetivo anual de -2.5%.

Los mejores fundamentos fiscales son valorados positivamente por los mercados de capitales. El riesgo país de Perú medido por el EMBI+ cayó a 112 puntos básicos hoy, el nivel más bajo desde noviembre de 2021, lo que abarata el financiamiento externo del Estado peruano.`,
    analisis: `La mejora fiscal tiene un impacto cambiario indirecto pero relevante: reduce la necesidad del Estado de emitir deuda en dólares y mejora la calificación crediticia soberana, lo que atrae inversión extranjera que demanda soles. Un Perú con fundamentos fiscales sólidos es un Perú con menor riesgo de depreciación cambiaria estructural.

Para el mediano plazo, el contexto de fundamentos peruanos sólidos —fiscal, monetario, de reservas y electoral— configura un entorno favorable para el sol. Las empresas con planificación de compras de dólares para el segundo semestre deben considerar que el tipo de cambio actual podría representar un piso de largo plazo si la tendencia fiscal continúa.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n007',
    titulo: 'Fed: probabilidad de recorte en julio sube a 72% tras IPC mayo — Powell habla el viernes en conferencia',
    descripcion: 'Tras el IPC de mayo en línea con el consenso, el mercado eleva la probabilidad de un recorte de 25 pb en la reunión del FOMC del 29 de julio al 72%. El presidente Powell participará en una conferencia del Banco de la Reserva Federal de San Francisco el viernes, donde se esperan señales sobre el timing del primer recorte.',
    contenido: `Los mercados financieros elevaron significativamente las apuestas por un primer recorte de tasas de la Reserva Federal tras la publicación del IPC de mayo. La herramienta FedWatch de CME Group muestra ahora una probabilidad del 72% de que el FOMC baje tasas en 25 puntos básicos en su reunión del 29 de julio, desde el 58% que registraba antes del dato de inflación.

Los rendimientos de los bonos del Tesoro de EE.UU. reaccionaron con caídas: el Treasury a 2 años bajó de 4.71% a 4.65%, mientras el a 10 años cayó de 4.32% a 4.27%. La curva de rendimientos se está inclinando levemente hacia una forma más "normal" (positiva), lo que el mercado interpreta como señal de que el ciclo de recortes se acerca.

El presidente de la Fed, Jerome Powell, tiene agendada para el viernes 13 de junio una participación en el Simposio Anual de la Reserva Federal de San Francisco. Los operadores analizarán con lupa cada palabra de su discurso en busca de pistas sobre si el dato de mayo fue suficiente para desbloquear el primer recorte. Las actas de la reunión del FOMC de mayo —que se publicarán el miércoles 18 de junio— también serán clave.

Para los mercados emergentes, el escenario de recorte Fed en julio sería muy positivo: capital global rotaría hacia activos de mayor rendimiento, beneficiando a bonos y monedas como el sol peruano, el real brasileño y el peso colombiano.`,
    analisis: `El giro dovish de la Fed es el catalizador externo más relevante para el sol peruano en las próximas semanas. Si Powell confirma el viernes que julio es una reunión "viva" para recortar, el DXY podría caer a 96-97 puntos y el sol apreciarse por debajo de S/ 3.37. En ese escenario, el BCRP intensificaría las compras de dólares para evitar una apreciación excesiva.

Para empresas con pasivos en dólares a largo plazo, el escenario de recorte Fed + sol apreciado representa el mejor momento del año para refinanciar deuda en USD o convertir reservas en dólares a soles en condiciones favorables.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n008',
    titulo: 'Oro sube a USD 3,742 por onza: bancos centrales compraron 485 toneladas en Q1 2026 según Consejo Mundial del Oro',
    descripcion: 'El metal precioso avanza a USD 3,742 por onza este jueves, nuevo máximo histórico, impulsado por datos que revelan que los bancos centrales globales compraron 485 toneladas de oro en el primer trimestre de 2026, el mayor volumen trimestral registrado. La debilidad del dólar amplifica el rally.',
    contenido: `El oro al contado alcanzó USD 3,742 por onza troy en las operaciones europeas de este jueves, superando el récord previo de USD 3,720 establecido el martes y acumulando una ganancia del 39.5% en lo que va del año 2026. El metal precioso consolida su posición como el activo de mejor desempeño global en el ejercicio.

El Consejo Mundial del Oro (World Gold Council) publicó hoy su informe de demanda del primer trimestre de 2026, revelando que los bancos centrales globales compraron un total de 485 toneladas de oro durante el período, el mayor volumen trimestral desde que existen registros fiables. China lideró las compras con 120 toneladas, seguida por India (85 toneladas), Polonia (62 toneladas) y Turquía (48 toneladas).

Los ETFs de oro también registraron entradas netas de USD 8,400 millones en el primer trimestre, revirtiéndose las salidas que predominaron durante 2024-2025. El iShares Gold Trust (IAU) y el SPDR Gold Shares (GLD) acumulan activos bajo gestión combinados de USD 142,000 millones, cifra récord.

La demanda de joyería global creció 7.3% interanual en el primer trimestre, liderada por China e India en el período previo a los festivales. El uso industrial del oro en electrónica y tecnología también aumentó 11%, reflejo de la expansión de la industria de semiconductores y dispositivos médicos de alta precisión.`,
    analisis: `El oro en máximos históricos tiene un efecto indirecto sobre el Perú como productor relevante del metal. Las empresas mineras auríferas registran un incremento sustancial en sus márgenes y flujos de caja, lo que se traduce en mayor oferta de dólares en el mercado local al convertir sus ingresos a soles.

Para inversores peruanos que buscan refugio en oro, el rally actual sugiere cautela ante la posibilidad de corrección técnica. Sin embargo, los fundamentos de largo plazo —demanda de bancos centrales, incertidumbre geopolítica y expectativas de recorte Fed— sostienen la tendencia alcista estructural del metal.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n009',
    titulo: 'Petróleo Brent en USD 96.50: Arabia Saudita extiende recorte voluntario hasta septiembre — OSINERGMIN monitorea impacto',
    descripcion: 'El crudo Brent sube a USD 96.50 por barril tras confirmarse que Arabia Saudita extenderá su recorte voluntario adicional de 500,000 barriles diarios hasta septiembre 2026, un mes más de lo esperado. El WTI cotiza en USD 93.90. OSINERGMIN Peru evalúa activar el Fondo de Estabilización de Precios.',
    contenido: `El petróleo Brent de referencia mundial cotiza en USD 96.50 por barril en el mercado ICE de Londres, alcanzando su nivel más alto desde febrero de 2026. El WTI estadounidense avanza a USD 93.90 en el NYMEX. El catalizador del alza fue el anuncio oficial de Arabia Saudita de que extenderá su recorte voluntario adicional de producción —500,000 barriles diarios sobre el compromiso base de la OPEP+— hasta el 30 de septiembre, un mes más de lo que el mercado anticipaba.

La extensión del recorte saudita se suma a la confirmación de Rusia de que también mantendrá sus 500,000 barriles diarios de recorte voluntario durante todo el tercer trimestre. En conjunto, OPEP+ mantiene fuera del mercado aproximadamente 3.6 millones de barriles diarios entre recortes base y voluntarios, lo que equivale al 3.6% de la demanda global.

Las reservas de petróleo de EE.UU. reportadas por la EIA esta semana mostraron una caída de 3.2 millones de barriles, mayor a la esperada (1.8 millones), señal de que la demanda industrial y de transporte se mantiene robusta. Analistas de Citigroup elevaron su precio objetivo para el Brent en el segundo semestre a USD 98-102.

En Perú, OSINERGMIN monitorea el nivel del Brent para determinar si corresponde activar el Fondo de Estabilización de Precios de los Combustibles (FEPC). Si el Brent se mantiene por encima de USD 95 durante dos semanas consecutivas, las gasolinas de 90, 95 y 97 octanos podrían registrar ajustes al alza en su precio al consumidor en la segunda quincena de junio.`,
    analisis: `El petróleo elevado tiene un efecto mixto para el Perú. Por el lado positivo, Perú es exportador neto de petróleo (principalmente del norte y la selva) y los mayores precios incrementan los ingresos por exportación. Por el lado negativo, el costo de los combustibles importados sube, generando presión inflacionaria que podría complicar la estrategia del BCRP de recortar tasas.

Para el tipo de cambio, el efecto es neutral en el corto plazo. Sin embargo, si el precio del petróleo escala hacia USD 100+, podría generarse un aumento de la inflación peruana que obligue al BCRP a ser más cauteloso con los recortes de tasas, lo cual sería marginalmente positivo para el sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n010',
    titulo: 'Análisis técnico PEN/USD: soporte clave en S/ 3.385 — ¿puede el sol llegar a S/ 3.35 si ONPE confirma ganador?',
    descripcion: 'Con el tipo de cambio consolidado en S/ 3.388 tras la decisión del BCRP y el IPC de EE.UU., el análisis técnico identifica un soporte fuerte en S/ 3.385 y resistencia en S/ 3.405. Una proclamación electoral limpia el viernes podría impulsar al sol hacia S/ 3.35-3.37 en el corto plazo.',
    contenido: `El tipo de cambio PEN/USD ha completado esta semana una figura técnica de rompimiento bajista (para el dólar) en el gráfico diario, quebrando la zona de S/ 3.41-3.43 que actuó como soporte durante abril y mayo. Esta ruptura confirma la tendencia de apreciación del sol que comenzó el 3 de junio con la primera vuelta electoral.

En el gráfico de cuatro horas, el indicador RSI opera en 38, en zona de sobreventa leve pero sin alcanzar los extremos que históricamente han marcado rebotes técnicos del dólar. El MACD muestra cruce bajista (para el dólar) confirmado desde el martes, con el histograma ampliándose en territorio negativo. Las bandas de Bollinger se estrechan, señal de que se aproxima un movimiento de mayor amplitud.

Los niveles técnicos clave para las próximas 48 horas son: soporte inmediato S/ 3.385 (mínimo de 20 meses, zona de alta liquidez), soporte fuerte S/ 3.370 (retroceso de Fibonacci del 61.8% del rally 2024-2025), y resistencia S/ 3.405 (media móvil de 20 días). Un cierre diario por debajo de S/ 3.385 abriría paso hacia S/ 3.360-3.370.

El escenario de catalizador positivo para el sol sería una proclamación electoral limpia el viernes más un discurso dovish de Powell. En ese caso, el objetivo técnico de mediano plazo es S/ 3.340-3.350, nivel de equilibrio pre-pandemia. El escenario adverso, de impugnación prolongada o dato de empleo fuerte en EE.UU. el 4 de julio, llevaría el dólar de vuelta a S/ 3.42-3.45.`,
    analisis: `El sesgo técnico del PEN/USD es claramente favorable al sol en el corto plazo. Los indicadores de tendencia, momentum y volatilidad apuntan a que la apreciación tiene espacio adicional si los catalizadores fundamentales acompañan. El nivel S/ 3.385 es el piso que el BCRP defiende activamente con compras de dólares.

Para empresas que necesitan dólares en los próximos 30 días, comprar en el rango S/ 3.385-3.400 parece razonable desde una perspectiva de gestión de riesgo cambiario. QoriCash ofrece cotizaciones en tiempo real y atención inmediata para operaciones desde USD 1,000 hasta USD 500,000.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4960438/pexels-photo-4960438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n011',
    titulo: 'DXY cae a 97.3: mínimo de 17 meses — euro en 1.1445 y yen en 140.8 por dólar tras IPC mayo',
    descripcion: 'El índice dólar (DXY) retrocede a 97.3 puntos tras el IPC de mayo en línea con el consenso, su nivel más bajo desde enero de 2025. El euro avanza a USD 1.1445 y el yen se aprecia a 140.8 por dólar. La debilidad del billete verde beneficia a las monedas emergentes latinoamericanas.',
    contenido: `El índice dólar estadounidense (DXY), que pondera el billete verde frente a seis divisas principales (euro, yen, libra, dólar canadiense, corona sueca y franco suizo), cayó a 97.3 puntos en las operaciones de este jueves, su nivel más bajo desde el 15 de enero de 2025. El DXY acumula una caída del 8.2% desde su pico de 106.1 alcanzado en octubre de 2025.

El euro lidera las ganancias entre las divisas del G10, avanzando a USD 1.1445, nivel no visto desde marzo de 2022. El catalizador es la combinación del IPC de EE.UU. en línea con el consenso y el mantenimiento de tasas del BCE en 3.40%. El diferencial de tasas BCE-Fed se reduce en las expectativas del mercado, lo que favorece al euro. El EUR/USD ha roto la resistencia de 1.1400 que había contenido el par desde abril.

El yen japonés se aprecia a 140.8 por dólar, acumulando un 4.3% de revalorización en la semana. El mercado especula cada vez más con que el Banco de Japón (BoJ) podría anunciar una subida adicional de 15 puntos básicos en su reunión de julio, lo que generaría un diferencial de tasas más favorable al yen.

En Latinoamérica, la debilidad del DXY es una bendición: el real brasileño cotiza en 4.88 por dólar (+0.6%), el peso colombiano en 4,198 (+0.8%), el peso chileno en 872 (+0.7%) y el sol peruano en S/ 3.388 (+0.1%, limitado por las compras del BCRP). Los diferenciales de tasas de interés de la región frente a EE.UU. se vuelven más atractivos en el escenario de recorte Fed.`,
    analisis: `Un DXY en 97.3 es territorio de debilidad crónica para el dólar. Desde una perspectiva histórica, niveles por debajo de 98 han coincidido con períodos de fortaleza sostenida para el sol peruano. El riesgo principal para esta tendencia es un dato de empleo sorpresivamente fuerte en EE.UU. el 4 de julio que reaplace al mercado sobre el timing del recorte Fed.

Para empresas y personas naturales con ahorros en dólares que planifican gastos en soles, el momento actual es favorable para cambiar dólares gradualmente, aprovechando el tipo de cambio competitivo que ofrece QoriCash frente a las tasas bancarias.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386469/pexels-photo-4386469.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n012',
    titulo: 'Bitcoin supera USD 108,500 y establece nuevo máximo histórico: ETFs suman USD 620M en dos días',
    descripcion: 'El bitcoin alcanza USD 108,500, nuevo máximo histórico, impulsado por entradas récord en ETFs de EE.UU. que suman USD 620 millones en las últimas 48 horas. La debilidad del dólar y las expectativas de recorte Fed impulsan el apetito por activos de riesgo a nivel global.',
    contenido: `El bitcoin (BTC) estableció un nuevo máximo histórico de USD 108,500 en las operaciones de este jueves en Asia, superando el récord previo de USD 108,135 del 18 de diciembre de 2025. La criptomoneda acumula una ganancia del 7.8% en los últimos tres días, catalizada por el IPC de mayo que confirmó las expectativas de recorte Fed y desencadenó un rally generalizado en activos de riesgo.

Los ETFs de bitcoin al contado que operan en EE.UU. registraron entradas netas combinadas de USD 620 millones en los últimos dos días de operaciones, el mayor flujo de dos días desde marzo. El iShares Bitcoin Trust (IBIT) de BlackRock concentró USD 342 millones, mientras el Fidelity Wise Origin Bitcoin Fund (FBTC) captó USD 185 millones. Los activos bajo gestión de todos los ETFs de bitcoin en EE.UU. alcanzan USD 112,000 millones, nuevo récord histórico.

El ethereum (ETH) acompaña el rally con una ganancia del 5.8%, cotizando en USD 4,050, acercándose a su máximo histórico de USD 4,878. Los ETFs de ethereum también muestran flujos positivos de USD 87 millones en el mismo período. Solana (SOL) avanza 9.2% a USD 186, beneficiándose de la mayor actividad en su blockchain.

Los analistas de Galaxy Digital señalan que el rally actual está siendo impulsado tanto por el entorno macro favorable —recorte Fed, dólar débil— como por factores propios del ecosistema cripto: el halving de abril 2026 sigue comprimiendo la oferta nueva de BTC, y la adopción institucional continúa acelerándose con nuevos mandatos de fondos soberanos en Asia.`,
    analisis: `El rally del bitcoin en paralelo con el oro y las monedas emergentes confirma el patrón de "risk-on" global. En este entorno, los inversores diversifican hacia activos alternativos buscando protección ante la depreciación del dólar. Para el tipo de cambio peruano, el efecto es positivo: mayor apetito por riesgo global = más flujos hacia emergentes = más oferta de dólares en Peru.

Los peruanos que operan con criptomonedas y realizan conversiones entre cripto y soles deben considerar que el tipo de cambio vigente en casas de cambio como QoriCash aplica también para operaciones donde se reciben dólares físicos producto de la liquidación de activos digitales.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14902702/pexels-photo-14902702.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n013',
    titulo: 'Argentina: BCRA sube tasa a 45% y peso cae a 1,295 por dólar — FMI envía misión técnica de urgencia',
    descripcion: 'Un día después de elevar la tasa de emergencia a 45%, el BCRA enfrenta presiones adicionales: el peso argentino cedió a 1,295 por dólar oficial y 1,335 en el mercado paralelo. El FMI enviará una misión técnica a Buenos Aires la próxima semana para evaluar el cumplimiento del programa de estabilización.',
    contenido: `El Banco Central de la República Argentina (BCRA) publicó hoy el comunicado de su reunión extraordinaria de ayer, confirmando que la decisión de elevar la tasa de referencia de 40% a 45% fue adoptada con el voto de seis directores a favor y dos en abstención. La suba, la mayor en un solo movimiento desde el programa de estabilización de diciembre 2023, busca anclar expectativas ante la aceleración inflacionaria de mayo.

El peso argentino, sin embargo, continuó depreciándose: el tipo de cambio oficial alcanzó 1,295 por dólar (frente a 1,285 de ayer), mientras el dólar MEP opera en 1,315 y el contado con liquidación en 1,328. La brecha cambiaria entre el oficial y el CCL se amplió al 2.5%, señal de que el mercado no confía en que la suba de tasas sola sea suficiente para estabilizar el peso.

El Fondo Monetario Internacional anunció que enviará una misión técnica a Buenos Aires la próxima semana para evaluar el cumplimiento del programa de ajuste acordado en enero de 2026. El acuerdo prevé una meta de inflación de 40% anual para el cierre de 2026, objetivo que se aleja con el dato de mayo (4.1% mensual que implica una tasa anualizada del 63%). El FMI podría condicionar el desembolso del próximo tramo de USD 2,300 millones a medidas adicionales de consolidación fiscal.

El ministro de Economía de Argentina, Luis Caputo, señaló en conferencia de prensa que el gobierno no contempla una devaluación del peso oficial y que las medidas de ajuste de tarifas que generaron el rebote inflacionario son "transitorias" y necesarias para eliminar los subsidios que distorsionaban la economía.`,
    analisis: `El deterioro macro argentino tiene impacto limitado sobre el Perú dado el bajo nivel de intercambio comercial bilateral y la solidez de los fundamentos peruanos. Sin embargo, en episodios de contagio regional, los inversores globales pueden reducir exposición a toda Latinoamérica, generando presión sobre el sol.

El diferencial de fundamentos entre Perú y Argentina es el mayor en décadas: inflación peruana 2.8% vs argentina 58.7%, reservas en máximos históricos vs Argentina con reservas netas negativas. Este diferencial fundamental limita el contagio y podría generar flujos de inversión hacia activos peruanos como refugio regional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n014',
    titulo: 'Colombia: inflación mayo en 4.6% abre puerta a recorte BanRep en agosto — peso colombiano a 4,198 por dólar',
    descripcion: 'El DANE confirmó que el IPC de mayo en Colombia desaceleró a 4.6% interanual, acercándose al techo del rango meta del Banco de la República. Con este dato, el mercado eleva al 68% la probabilidad de un recorte de 25 pb del BanRep en agosto desde el 9.75% actual. El peso colombiano se aprecia a 4,198.',
    contenido: `El Departamento Administrativo Nacional de Estadística (DANE) de Colombia confirmó hoy que el Índice de Precios al Consumidor de mayo de 2026 registró una variación interanual del 4.6%, por debajo del 5.1% de abril y del consenso del mercado (4.9%). Este es el nivel de inflación más bajo desde octubre de 2021 y marca el décimo mes consecutivo de descenso.

La desaceleración fue generalizada entre los principales componentes: alimentos bajaron de 3.5% a 2.8% interanual, servicios de 7.1% a 6.2%, y el índice sin alimentos ni regulados de 5.8% a 5.1%. Los únicos componentes con aceleración fueron los precios regulados —electricidad y gas— que reflejaron ajustes tarifarios de abril.

El Banco de la República (BanRep) mantiene su tasa de intervención en 9.75%, después de acumular 500 puntos básicos de recorte desde el pico de 13.25%. El dato de mayo abre la puerta a un recorte adicional en la reunión de agosto. Según una encuesta de Bloomberg, el 68% de los analistas espera una baja de 25 pb en agosto, mientras el 22% proyecta 50 pb.

El peso colombiano (COP) se aprecía a 4,198 por dólar en operaciones de este jueves, beneficiándose tanto del dato de inflación positivo como de la debilidad generalizada del DXY. La moneda colombiana acumula una revaluación del 5.3% frente al dólar en lo que va de junio, impulsada por los mismos factores que fortalecen al sol peruano.`,
    analisis: `La desinflación colombiana y la perspectiva de nuevos recortes BanRep configuran un entorno macro positivo para la región andina. La correlación entre el peso colombiano y el sol peruano es históricamente alta (0.78) por los fundamentos compartidos: commodities, política monetaria ortodoxa y apertura comercial similar.

Para empresas peruanas con operaciones en Colombia, el tipo de cambio COP/PEN en niveles favorables al sol peruano facilita las transacciones comerciales bilaterales. Las casas de cambio especializadas como QoriCash facilitan la operación en múltiples monedas con tasas competitivas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n015',
    titulo: 'Chile: S&P mantiene perspectiva positiva — BCCh estudia recorte en septiembre y peso chileno en 872 por dólar',
    descripcion: "Standard & Poor's ratificó la perspectiva positiva de Chile un día después de su anuncio inicial, descartando revisiones adversas. El Banco Central de Chile publicó las minutas de su última reunión, donde tres de cinco directores discutieron la posibilidad de un recorte de tasas en septiembre. El peso chileno se aprecia a 872 por dólar.",
    contenido: `Standard & Poor's ratificó hoy la perspectiva positiva de la calificación soberana de Chile (A-) en una nota complementaria, aclarando que no hay riesgos inmediatos que pudieran revertir la mejora anunciada ayer. La agencia destacó especialmente la reducción del déficit fiscal estructural a -1.8% del PBI y las reformas al mercado de capitales impulsadas por el gobierno de Gabriel Boric.

El Banco Central de Chile (BCCh) publicó las minutas de su reunión del 22 de mayo, revelando que tres de los cinco directores debatieron la posibilidad de un recorte de tasas de 25 puntos básicos en septiembre si la inflación continúa convergiendo hacia el 3%. Los otros dos directores prefieren esperar hasta el cuarto trimestre para tener mayor claridad sobre la evolución de los precios. La tasa se mantiene en 5.00%.

El peso chileno (CLP) opera en 872 por dólar, su nivel más bajo desde agosto de 2024, beneficiándose de tres factores simultáneos: mejora de perspectiva S&P, precio del cobre en máximos de 14 meses (Chile es el mayor productor mundial) y debilidad del DXY. Con el CLP en 872, las empresas chilenas que facturan en dólares experimentan un incremento en sus costos en pesos locales.

La bolsa de Santiago (IPSA) avanza 1.4% en la semana, con las mineras cupreras (Antofagasta, SQM) como principales ganadoras. La inversión extranjera directa en Chile aumentó un 18% interanual en el primer trimestre, confirmando el atractivo del país para el capital global en busca de estabilidad en la región.`,
    analisis: `La mejora de perspectiva crediticia de Chile es una señal positiva para toda la región andina. Los inversores extranjeros que miran Latinoamérica como bloque tienden a asignar flujos cuando uno de los países benchmark del bloque recibe una mejora de calificación. Perú se beneficia indirectamente de este efecto de "marea alta que levanta todos los botes".

Para peruanos que viajan o tienen gastos en Chile, el peso chileno en 872 por dólar —equivalente a aproximadamente S/ 0.00389 por peso chileno— supone condiciones favorables para cambiar soles a pesos en casas de cambio especializadas antes del viaje.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm001',
    titulo: 'Segunda vuelta Peru: Sanchez 50.075% vs Keiko 49.925% con 97% de actas procesadas — dolar cae a S/ 3.393',
    descripcion: 'Con el 97.3% de actas procesadas, Jorge Sanchez mantiene 50.075% frente al 49.925% de Keiko Fujimori. El ajustado resultado dispara la incertidumbre y el dolar retrocede a S/ 3.393 ante mayor liquidez en soles.',
    contenido: `La segunda vuelta presidencial peruana del 8 de junio mantiene en vilo al mercado cambiario. Con el 97.3% de actas procesadas este martes 10 de junio, Jorge Sanchez (Avancemos Peru) acumula 50.075% frente al 49.925% de Keiko Fujimori (Fuerza Popular), una diferencia de apenas 0.15 puntos porcentuales equivalente a poco mas de 100,000 votos.

La ONPE reporta que quedan por escrutar 2.7% de actas correspondientes principalmente a circunscripciones de la selva norte y el extranjero. Ambos candidatos han solicitado verificaciones en actas impugnadas, por lo que el resultado oficial podria demorarse 48 a 72 horas adicionales segun el JNE.

En el mercado cambiario, el dolar cede terreno ante el escenario de mayor claridad. El tipo de cambio interbancario opera en S/ 3.393, con el BCRP reportando compras de USD 280 millones para moderar la apreciacion del sol. Las reservas internacionales netas se mantienen en US$ 101,620 millones, nivel record.

Los operadores de mesa de cambio reportan spread compra-venta ajustado, con alta demanda de soles por parte de empresas que requieren cubrir obligaciones en moneda local ante la espera del resultado definitivo.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'ONPE / BCRP',
  },
  {
    id: 'm002',
    titulo: 'IPC mayo EE.UU. se publica hoy: consenso apunta a core CPI 2.7% — recorte Fed 17 junio en juego',
    descripcion: 'El mercado aguarda el dato de inflacion de mayo en EE.UU. a las 8:30 AM ET. Un resultado igual o inferior al consenso de 2.7% interanual en el indice core abriria la puerta a una baja de tasas en la reunion del FOMC del 17-18 de junio.',
    contenido: `El Departamento de Trabajo de EE.UU. publicara hoy a las 8:30 AM hora de Nueva York (10:30 AM Lima) el Indice de Precios al Consumidor (IPC) de mayo 2026. El consenso de mercado proyecta una variacion interanual del 2.7% para el indice core (excluye alimentos y energia), igual al dato de abril, y 3.1% para el indice general.

La publicacion tiene especial relevancia porque el Comite Federal de Mercado Abierto (FOMC) sesiona el 17 y 18 de junio. Segun la herramienta FedWatch de CME Group, los futuros de fondos federales asignan una probabilidad del 68% a un recorte de 25 puntos basicos si el IPC core viene en 2.7% o menor.

Un dato superior al consenso (2.8% o mas) reducira significativamente las expectativas de recorte inmediato y fortalecera al dolar. Un dato inferior impulsara activos de riesgo, debilitara el billete verde y beneficiara al sol peruano y otras monedas emergentes.

En Peru, el tipo de cambio opera con cautela en S/ 3.393 a la espera del dato. Fuentes de mesas de cambio en Lima esperan volatilidad de +/- 3 centimos en el tipo de cambio local segun el resultado del IPC.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BLS / CME FedWatch',
  },
  {
    id: 'm003',
    titulo: 'BCRP sesiona manana 11 junio: 73% del mercado espera tasa estable en 4.25% — sol en S/ 3.393 y reservas en maximo historico',
    descripcion: 'El directorio del Banco Central de Reserva del Peru se reunira manana jueves para decidir sobre la tasa de referencia. El 73% de analistas espera que se mantenga en 4.25% ante la incertidumbre politica post-electoral y la inflacion en 2.8% interanual en mayo.',
    contenido: `El directorio del Banco Central de Reserva del Peru (BCRP) celebrara manana jueves 11 de junio su reunion mensual de politica monetaria. La tasa de referencia actual es 4.25%, nivel donde se ha mantenido desde febrero de 2026.

Una encuesta de Reuters entre 18 analistas locales e internacionales revela que el 73% espera que el BCRP mantenga la tasa en 4.25%, mientras el 22% proyecta un recorte de 25 puntos basicos a 4.00%. El 5% restante anticipa un recorte mayor.

Los argumentos para mantener la tasa incluyen: inflacion de mayo en 2.8% interanual (por encima del rango meta 1-3% del objetivo puntual de 2%), la incertidumbre del resultado electoral y el tipo de cambio que, aunque apreciado, aun no consolida un nivel definitivo.

El sol peruano opera hoy en S/ 3.393 interbancario, su nivel mas bajo en 20 meses. Las reservas internacionales netas alcanzaron un record de US$ 101,620 millones, equivalente a 20.3 meses de importaciones. Este colchon le da al BCRP amplio margen de maniobra cambiaria independientemente de la decision de tasas.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BCRP / Reuters',
  },
  {
    id: 'm004',
    titulo: 'Sol peruano se aprecia a S/ 3.393 post-ONPE: BCRP compra USD 280M para moderar apreciacion',
    descripcion: 'El tipo de cambio PEN/USD cede a S/ 3.393 en operaciones interbancarias del martes, impulsado por la reduccion de incertidumbre electoral. El Banco Central intervino con compras de USD 280 millones para evitar una apreciacion excesiva del sol.',
    contenido: `El tipo de cambio interbancario PEN/USD opera este martes en S/ 3.393, acumulando una apreciacion de 1.8% en la semana ante la reduccion de incertidumbre electoral. El BCRP ha intervenido con compras de USD 280 millones en la sesion de hoy para moderar la velocidad de apreciacion del sol.

En el mercado paralelo (casas de cambio y exchange houses como QoriCash), el dolar cotiza entre S/ 3.385 y S/ 3.400 segun la modalidad de operacion. La demanda corporativa de dolares para cobertura ha disminuido notablemente respecto a la semana previa, cuando el tipo de cambio llego a tocar S/ 3.45.

Los flujos de inversion extranjera directa hacia Peru se han reactivado en las ultimas sesiones. Fuentes del sector financiero reportan consultas de fondos de inversion regionales interesados en bonos soberanos peruanos denominados en soles, lo que genera presion compradora sobre la moneda local.

Para el resto de la semana, el mercado estara atento al resultado final de la ONPE (esperado para el miercoles), la decision de tasas del BCRP (jueves) y el dato de IPC de EE.UU. que se publica hoy. Estos tres catalizadores podrian generar movimientos adicionales de +/- 5 centimos en el tipo de cambio.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BCRP / Bloomberg',
  },
  {
    id: 'm005',
    titulo: 'Dolar cae a minimo de 16 meses: DXY en 97.6 — euro en 1.1425 y yen en 141.2 por dolar',
    descripcion: 'El indice dolar (DXY) retrocede a 97.6, su nivel mas bajo desde febrero de 2025, presionado por expectativas de recorte Fed y datos mixtos de empleo. El euro avanza a USD 1.1425 y el yen se aprecia a 141.2 por dolar.',
    contenido: `El indice dolar estadounidense (DXY), que mide el valor del billete verde frente a una canasta de seis divisas principales, cayo a 97.6 puntos en las primeras operaciones del martes, su nivel mas bajo desde febrero de 2025. La debilidad del dolar responde a la confluencia de varios factores: las crecientes expectativas de recorte de tasas Fed para junio, el solido dato de PMI de servicios de la eurozona publicado ayer y la reduccion de flujos de refugio hacia el dolar.

El euro avanza a USD 1.1425, nivel no visto desde abril de 2022, apoyado en el diferencial de tasas que se reduce a medida que el mercado precio recortes Fed. El Banco Central Europeo mantiene su tasa en 3.40% y no senala prisa por nuevos recortes, lo que favorece al euro frente al dolar.

El yen japones se aprecia a 141.2 por dolar, beneficiandose de la debilidad generalizada del billete verde y de las expectativas de que el Banco de Japon pueda ajustar su politica en julio. La libra esterlina opera en USD 1.2850 y el franco suizo en 0.8920 por dolar.

Para las monedas latinoamericanas, la debilidad del DXY es una buena noticia. El real brasileno cotiza en 4.92 por dolar, el peso colombiano en 4,215 y el sol peruano en 3.393, todos en niveles de fortaleza frente al billete verde.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'Bloomberg / Reuters',
  },
  {
    id: 'm006',
    titulo: 'Oro alcanza record de USD 3,720 por onza: ETFs de oro suman USD 4,200M en 5 dias — Goldman eleva target a USD 4,000 para Q4',
    descripcion: 'El metal precioso toco un nuevo maximo historico de USD 3,720 por onza troy este martes, impulsado por la debilidad del dolar y el aumento de posiciones en ETFs. Goldman Sachs elevo su proyeccion a USD 4,000 para el cuarto trimestre de 2026.',
    contenido: `El oro al contado alcanzo un nuevo maximo historico de USD 3,720 por onza troy en las operaciones del martes en Londres, superando el record anterior de USD 3,695 establecido el viernes pasado. El metal precioso acumula una ganancia del 38% en lo que va del 2026, consolidandose como el activo de mejor desempeno del ano.

Los fondos cotizados en bolsa (ETFs) respaldados por oro han registrado entradas netas de USD 4,200 millones en los ultimos cinco dias de operaciones, segun datos de Bloomberg Intelligence. Los mayores flujos provienen de inversores institucionales en EE.UU. y Europa que buscan cobertura ante la incertidumbre sobre la politica monetaria de la Fed.

Goldman Sachs publico hoy una nota a clientes en la que eleva su proyeccion para el precio del oro al cierre del cuarto trimestre de 2026 a USD 4,000 por onza, desde USD 3,700 anteriormente. El banco de inversion cita como principales catalizadores la continua demanda de bancos centrales (China, India y Polonia lideran las compras), la debilidad estructural del dolar y los crecientes riesgos geopoliticos.

En Peru, el sector minero celebra los precios record. Las empresas productoras de oro como Newmont (Yanacocha) y Hochschild Mining reportan incrementos significativos en sus ingresos proyectados para el segundo semestre.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'Bloomberg / Goldman Sachs',
  },
  {
    id: 'm007',
    titulo: 'Petroleo Brent sube a USD 96 ante tension en Medio Oriente y recortes OPEP+: WTI en USD 93.55',
    descripcion: 'El crudo Brent avanza a USD 96 por barril, maximo de tres meses, impulsado por la escalada de tension en el estrecho de Ormuz y la confirmacion de recortes adicionales de produccion por parte de Arabia Saudi y Rusia desde julio.',
    contenido: `El petroleo Brent de referencia mundial avanza a USD 96.15 por barril en el mercado ICE de Londres, su nivel mas alto desde marzo de 2026, mientras el WTI estadounidense cotiza en USD 93.55 en el New York Mercantile Exchange. El diferencial Brent-WTI se amplifica a USD 2.60 por barril.

La tension en el estrecho de Ormuz, por donde transita el 20% del petroleo mundial, se ha intensificado tras el incidente del fin de semana con buques iranies. Aunque no se reportan danos a infraestructura critica, los operadores incorporan una prima de riesgo geopolitico adicional de USD 3 a USD 5 por barril.

Arabia Saudi y Rusia confirmaron el sabado que mantendran sus recortes voluntarios adicionales de produccion de 500,000 barriles diarios cada uno durante julio y agosto, contrariamente a lo que el mercado esperaba. Esta decision redujo las expectativas de mayor oferta en el segundo semestre y es el principal catalizador del alza de precios.

En Peru, la Gerencia de Regulacion de Tarifas del OSINERGMIN monitorea la situacion. Si el Brent se mantiene por encima de USD 95, podrian activarse los mecanismos del Fondo de Estabilizacion de Precios de los Combustibles para moderar el impacto en los precios al consumidor final.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'ICE / Bloomberg',
  },
  {
    id: 'm008',
    titulo: 'Cobre LME en USD 5.28 por libra: inventarios en minimo de 5 anos y exportaciones peruanas proyectadas en USD 16,200M en 2026',
    descripcion: 'El cobre en el London Metal Exchange avanza a USD 5.28 por libra ante la caida de inventarios a niveles no vistos desde 2021. Peru, segundo mayor productor mundial, proyecta exportaciones cupreras de USD 16,200 millones en 2026.',
    contenido: `El cobre a tres meses en el London Metal Exchange (LME) avanza a USD 5.28 por libra (USD 11,640 por tonelada metrica), su nivel mas alto en 14 meses, sustentado en la combinacion de inventarios minimos historicos y solida demanda industrial de China y Europa.

Los inventarios de cobre en los almacenes certificados del LME cayeron a 98,450 toneladas metricas, el nivel mas bajo desde junio de 2021. La reduccion de stocks refleja la alta demanda de la industria de vehiculos electricos, cables de transmision de energia y equipos de inteligencia artificial (los centros de datos requieren grandes cantidades de cobre para sus sistemas de refrigeracion y conectividad).

En Peru, el Ministerio de Energia y Minas proyecta que las exportaciones de cobre alcanzaran USD 16,200 millones en 2026, un incremento del 18% frente a los USD 13,700 millones de 2025. Las minas de Antamina, Cerro Verde, Las Bambas y Toromocho operan a plena capacidad, y el proyecto Quellaveco de Anglo American reporto un record de produccion trimestral en el primer trimestre.

Los mayores ingresos por exportaciones de cobre contribuyen positivamente a la balanza comercial peruana, generando mayor oferta de dolares en el mercado local y ejerciendo presion hacia la apreciacion del sol.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'LME / MINEM',
  },
  {
    id: 'm009',
    titulo: 'Bitcoin supera USD 107,200: ETF de bitcoin suma USD 380M en un dia — resistencia clave en USD 110,000',
    descripcion: 'El bitcoin rompe la resistencia de USD 105,000 y cotiza en USD 107,200, impulsado por entradas record en ETFs de EE.UU. Los analistas tecnicos senalan USD 110,000 como el proximo nivel de resistencia critico.',
    contenido: `El bitcoin (BTC) cotiza en USD 107,200 en los mercados de criptomonedas este martes, tras romper con fuerza la resistencia de USD 105,000 que habia contenido el precio durante las ultimas dos semanas. La criptomoneda acumula una ganancia del 7.3% en los ultimos cinco dias y del 185% en lo que va del 2026.

Los ETFs de bitcoin al contado que cotizan en EE.UU. registraron entradas netas combinadas de USD 380 millones el lunes, el mayor flujo diario en tres semanas. El iShares Bitcoin Trust (IBIT) de BlackRock concentro USD 215 millones de estas entradas, consolidando su posicion como el mayor ETF de criptoactivos del mundo con activos bajo gestion de USD 87,000 millones.

Desde el punto de vista tecnico, los analistas identifican la zona de USD 110,000 como la resistencia critica a superar para confirmar un nuevo ciclo alcista. Un cierre semanal por encima de ese nivel abriria el camino hacia los USD 120,000, segun los modelos de Fibonacci aplicados al ciclo actual.

El ethereum (ETH) acompana el alza con una ganancia del 5.1%, cotizando en USD 3,950. Los altcoins de mayor capitalizacion (BNB, Solana, XRP) tambien registran ganancias de entre 4% y 8% en las ultimas 24 horas.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'CoinGecko / Bloomberg',
  },
  {
    id: 'm010',
    titulo: 'Argentina: BCRA sube tasa de emergencia a 45% ante brote inflacionario — IPC mayo en 4.1% mensual',
    descripcion: 'El Banco Central de la Republica Argentina elevo su tasa de politica monetaria a 45% en una reunion extraordinaria convocada de urgencia, tras conocerse que el IPC de mayo subio 4.1% en el mes, muy por encima del 2.8% esperado.',
    contenido: `El Banco Central de la Republica Argentina (BCRA) convoco de urgencia una reunion extraordinaria de su directorio y acordo elevar la tasa de politica monetaria en 500 puntos basicos, desde el 40% hasta el 45% anual, en respuesta al dato de inflacion de mayo que mostro un preocupante rebote.

El INDEC informo que el Indice de Precios al Consumidor (IPC) de mayo 2026 registro una variacion mensual del 4.1%, muy por encima del consenso del mercado (2.8%) y del 2.4% registrado en abril. En terminos interanuales, la inflacion acumula 58.7%, alejandose del objetivo del gobierno de cerrar el 2026 por debajo del 40%.

El rebrote inflacionario se atribuye principalmente al ajuste de tarifas de servicios publicos implementado en mayo (electricidad +35%, gas +28%), al deslizamiento del tipo de cambio oficial y al aumento de precios en alimentos y bebidas. El gobierno de Javier Milei enfrenta su mayor desafio economico desde que inicio el programa de estabilizacion.

El peso argentino cerro en 1,285 por dolar en el mercado oficial y en 1,320 en el mercado paralelo (MEP). Los bonos soberanos argentinos en dolares (GD30, AL30) cedieron entre 1.5% y 2.8% ante el deterioro del escenario macro. Para Peru, el contagio es limitado dado el solido diferencial de fundamentals.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BCRA / INDEC',
  },
  {
    id: 'm011',
    titulo: 'Colombia: inflacion de mayo cae a 4.6% — minimo desde 2021 — BanRep evalua recorte en agosto; peso en 4,215',
    descripcion: 'El IPC de mayo en Colombia desacelero a 4.6% interanual, su nivel mas bajo desde octubre de 2021, acercandose al techo del rango meta del 3%. El Banco de la Republica evalua un recorte de tasas en su reunion de agosto desde el actual 9.75%.',
    contenido: `El DANE informo que la inflacion al consumidor en Colombia registro una variacion interanual del 4.6% en mayo de 2026, por debajo del 5.1% de abril y del consenso del mercado (4.9%). Este es el dato mas bajo desde octubre de 2021 y sena una desaceleracion continua que acerca al pais al techo del rango meta del Banco de la Republica (2%-4%).

La desaceleracion inflacionaria en Colombia es generalizada: la inflacion de alimentos bajo a 2.8% (desde 3.5% en abril), la inflacion de servicios a 6.2% (desde 7.1%) y la inflacion sin alimentos ni regulados a 5.1% (desde 5.8%). Solo los precios regulados (combustibles, utilities) permanecen elevados con un 8.3% interanual.

El Banco de la Republica mantiene su tasa de intervencion en 9.75%, pero el dato de mayo abre la puerta a un recorte en la reunion de agosto. Fuentes cercanas al banco central colombiano senalan que si la inflacion continua descendiendo y se acerca al 4.0% en junio, podria materializarse una baja de 25 puntos basicos.

El peso colombiano (COP) opera en 4,215 por dolar, apreciandose 0.4% en la sesion del martes ante el positivo dato de inflacion y la debilidad generalizada del dolar en los mercados internacionales.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19675635/pexels-photo-19675635.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'DANE / BanRep',
  },
  {
    id: 'm012',
    titulo: 'Chile: S&P eleva perspectiva soberana a positiva — BCCh mantiene 5.00% — peso chileno en 875 por dolar',
    descripcion: "Standard & Poor's mejoro la perspectiva de la calificacion soberana de Chile de estable a positiva, citando la solida posicion fiscal y las reformas estructurales. El Banco Central de Chile mantiene su tasa en 5.00% y el CLP cotiza en 875 por dolar.",
    contenido: `Standard & Poor's Global Ratings anuncio ayer la mejora de la perspectiva de la calificacion soberana de Chile de estable a positiva, manteniendo el rating en A-. La agencia cita como factores positivos la reduccion del deficit fiscal a -1.8% del PBI en 2025, el solido marco institucional y las reformas del mercado de capitales impulsadas por el gobierno del presidente Gabriel Boric.

S&P destaca que si Chile mantiene la trayectoria de consolidacion fiscal y el deficit se reduce por debajo del -1.5% del PBI en 2026, podria materializarse una mejora del rating a A en los proximos 12 a 24 meses. Esta perspectiva positiva genera mayor interes de inversores internacionales en bonos soberanos chilenos.

El Banco Central de Chile (BCCh) mantiene su tasa de politica monetaria en 5.00%, nivel donde la ha sostenido desde febrero. El comunicado de su ultima reunion sena que la tasa permanecera en este nivel durante el segundo trimestre, con posibilidad de un recorte adicional en el tercer trimestre si la inflacion continua convergiendo hacia el 3%.

El peso chileno (CLP) se aprecia a 875 por dolar, su nivel mas bajo desde agosto de 2024, beneficiandose tanto de la mejora de perspectiva crediticia como del avance del precio del cobre (del que Chile es el mayor productor mundial) y la debilidad generalizada del dolar en los mercados internacionales.`,
    fecha: HOY,
    categoria: 'Internacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: "S&P / BCCh",
  },
  {
    id: 'm013',
    titulo: 'Agroexportaciones peruanas suman USD 3,200M en enero-mayo: arandanos +34% y cafe +58% impulsan record semestral',
    descripcion: 'La Asociacion de Exportadores (ADEX) reporto que las exportaciones agroindustriales de Peru acumularon USD 3,200 millones entre enero y mayo de 2026, un avance de 17.4% frente al mismo periodo de 2025, lideradas por arandanos y cafe.',
    contenido: `La Asociacion de Exportadores (ADEX) difundio hoy su reporte mensual de comercio exterior agroindustrial, revelando que las exportaciones del sector sumaron USD 3,200 millones en el acumulado enero-mayo 2026, un incremento del 17.4% respecto a los USD 2,726 millones del mismo periodo de 2025.

Los productos estrella del periodo son los arandanos (USD 680 millones, +34.2%), el cafe (USD 420 millones, +57.9%), las uvas de mesa (USD 310 millones, +12.8%) y los paltos (USD 285 millones, +8.5%). El dinamismo del cafe responde al record de precios internacionales (el arabica cotiza en USD 3.85 por libra en Nueva York) y a la ampliacion de areas cultivadas en Cajamarca y San Martin.

ADEX proyecta que las agroexportaciones totales del 2026 podrian superar los USD 8,500 millones, lo que representaria un nuevo maximo historico. Los mercados de destino mas dinamicos son EE.UU. (34% del total), Union Europea (28%) y China (18%), donde la demanda de productos frescos premium peruanos continua en expansion.

El crecimiento de las agroexportaciones tiene un impacto positivo directo en el mercado cambiario, generando mayor oferta de dolares y contribuyendo a la fortaleza del sol. Segun el BCRP, el agro fue responsable del 12% de la oferta de dolares en el mercado formal durante mayo.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/849683/pexels-photo-849683.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'ADEX / BCRP',
  },
  {
    id: 'm014',
    titulo: 'MEF: ingresos tributarios crecen 12.4% en mayo — deficit fiscal se reduce a -2.1% del PBI',
    descripcion: 'El Ministerio de Economia y Finanzas reporto que la recaudacion tributaria de mayo aumento 12.4% en terminos reales respecto a mayo 2025, impulsada por el IGV e IR de tercera categoria. El deficit fiscal acumulado se comprime a -2.1% del PBI.',
    contenido: `El Ministerio de Economia y Finanzas (MEF) publico hoy el reporte de recaudacion tributaria de mayo 2026, mostrando un crecimiento real del 12.4% respecto a mayo 2025, sustancialmente por encima de lo esperado (8.5%). Los ingresos tributarios del mes sumaron S/ 14,850 millones (USD 4,375 millones al tipo de cambio actual).

Los principales motores del crecimiento son el Impuesto General a las Ventas (IGV) interno, que aumento 15.2% en terminos reales ante el solido desempeno del consumo privado, y el Impuesto a la Renta de tercera categoria (empresas), que subio 18.7% impulsado por los mayores precios de exportacion de minerales y agroexportaciones.

Con la solidez de la recaudacion de mayo, el deficit fiscal acumulado en los primeros cinco meses del 2026 se reduce a -2.1% del PBI, dentro del objetivo del gobierno de no superar el -2.5% para el ano. Esta mejora fiscal, en un contexto de transicion politica post-electoral, es positivamente valorada por los mercados financieros.

Los mejores fundamentos fiscales fortalecen la posicion del nuevo sol en los mercados internacionales y reducen la prima de riesgo pais. El EMBI+ Peru cayo a 115 puntos basicos, el nivel mas bajo desde enero de 2022, reflejando la confianza de los inversores en los solidos fundamentals de la economia peruana.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'MEF / SUNAT',
  },
  {
    id: 'm015',
    titulo: 'Analisis PEN/USD semana 10-13 junio: tres catalizadores en 48 horas definiran el tipo de cambio de la quincena',
    descripcion: 'IPC EE.UU. hoy, resultado ONPE manana y decision BCRP el jueves configuran la semana de mayor densidad de noticias para el sol en 2026. El rango tecnico operativo para la semana es S/ 3.37 — S/ 3.42.',
    contenido: `La semana del 10 al 13 de junio se perfila como la de mayor densidad informativa para el tipo de cambio PEN/USD en lo que va del 2026. Tres catalizadores de primer orden se concentran en 48 horas: el IPC de mayo en EE.UU. hoy martes, el resultado final de la ONPE manana miercoles y la decision de tasas del BCRP el jueves.

**Escenario base (probabilidad 55%): sol entre S/ 3.37 y S/ 3.40**
IPC EE.UU. en linea con el consenso (2.7% core), ONPE confirma victoria de Sanchez, BCRP mantiene 4.25%. En este escenario, el sol se aprecia moderadamente hacia S/ 3.38 y el BCRP interviene comprando dolares para evitar una caida mayor. Para las casas de cambio, el spread operativo se estrecha y los volumenes de transaccion aumentan.

**Escenario alcista para el dolar (probabilidad 25%): S/ 3.40 — S/ 3.45**
IPC EE.UU. sorprende al alza (2.9%+), resultado ONPE impugnado sin ganador claro y/o BCRP recorta tasas de sorpresa. El dolar recupera terreno y el sol cede. Operadores de cambio deben considerar este escenario para gestionar inventarios.

**Escenario bajista para el dolar (probabilidad 20%): S/ 3.34 — S/ 3.38**
IPC EE.UU. muy por debajo del consenso (2.5% o menos), victoria Sanchez confirmada rapido y expectativas de estabilidad politica, BCRP mantiene tasa. Apreciacion acelerada del sol que podria generar intervencion masiva del BCRP.

Para empresas con exposicion en dolares, la recomendacion es gestionar activamente las coberturas y aprovechar la volatilidad para optimizar los tipos de cambio de sus operaciones de cambio durante la semana.`,
    fecha: HOY,
    categoria: 'Nacional',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'Analisis QoriCash',
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
