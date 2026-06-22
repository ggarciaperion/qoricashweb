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
const HOY = '2026-06-22T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'h001',
    titulo: 'Sol retrocede a S/ 3.418 interbancario: DXY supera 103.5 tras dotplot hawkish de la Fed',
    descripcion: 'El sol peruano cotizó en S/ 3.418 interbancario el domingo 22 de junio, su nivel más débil en tres semanas, tras conocerse el dotplot de la Reserva Federal que proyecta un solo recorte de tasas para 2026. El DXY Index avanzó a 103.5 puntos cerrando la semana del 16-20 de junio con la mayor ganancia semanal del trimestre.',
    contenido: `El tipo de cambio PEN/USD inicia la semana del 22 de junio cotizando en S/ 3.418 interbancario, tras el cierre del viernes en S/ 3.416 — el nivel más alto desde el 30 de mayo. El movimiento refleja directamente la reacción del mercado al FOMC del miércoles 18: la Fed mantuvo la tasa de fondos federales en 4.25-4.50%, pero el dotplot actualizado redujo la proyección de recortes para 2026 de dos a uno, programado para diciembre.

El DXY Index cerró la semana del 16-20 de junio en 103.47 puntos, ganancia semanal de +1.6% — la mayor desde enero de 2026. El fortalecimiento del dólar se amplificó por la lectura del presidente Powell en la conferencia de prensa: señaló que el mercado laboral sigue "sorprendentemente resiliente" con desempleo en 4.0% y que el Comité necesita "más evidencia sostenida" de desinflación antes del primer recorte. Los forwards NDF sobre PEN a 30 días se movieron de S/ 3.405 a S/ 3.428.

El BCRP intervino el jueves y viernes con ventas de dólares por USD 420 millones para moderar la velocidad del ajuste. Las reservas internacionales bajaron a US$ 74.0 billones. Analistas de JPMorgan en Lima estiman que el sol se mantendrá en el rango S/ 3.40-3.45 durante las próximas dos semanas, con sesgo depreciatorio mientras el DXY no retroceda por debajo de 102.8.

La semana del 22 de junio no tiene eventos de primer orden en Estados Unidos. Los datos relevantes son: PMI manufacturero flash (lunes) y el índice de confianza del consumidor Conference Board (martes). En Perú, el BCRP publicará el martes el informe de operaciones cambiarias de la semana pasada.`,
    analisis: `El movimiento del sol a S/ 3.418 es directa consecuencia del dotplot hawkish de la Fed. Mientras el DXY permanezca por encima de 103, la presión sobre el sol continuará. El riesgo al alza para el tipo de cambio es que datos de empleo o inflación de EE.UU. en las próximas semanas refuercen la narrativa de "tasas altas por más tiempo".

Para importadores y empresas con deuda en dólares, el nivel actual representa un punto de entrada menos favorable que el S/ 3.394 de la semana pasada. Si tienes operaciones de cambio planificadas, considerar actuar antes de que el sol pruebe la resistencia de S/ 3.43. En QoriCash ofrecemos el mejor tipo de cambio del mercado, sin comisiones y con atención inmediata.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'BCRP vende USD 420M en dos días para estabilizar el sol tras el FOMC de la Fed',
    descripcion: 'El Banco Central de Reserva del Perú realizó intervenciones cambiarias por USD 420 millones el jueves 19 y viernes 20 de junio para moderar la depreciación del sol generada por el dotplot hawkish de la Reserva Federal. Las reservas internacionales bajaron a US$ 74.0 billones pero se mantienen en niveles históricamente altos.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) intervino activamente en el mercado cambiario el jueves 19 y viernes 20 de junio, vendiendo en total USD 420 millones a través de subastas de swap cambiario y ventas directas en el mercado spot. La intervención buscó moderar la velocidad de depreciación del sol, que pasó de S/ 3.394 el miércoles —previo al FOMC— a S/ 3.423 en el intraday del jueves antes del cierre en S/ 3.416.

Las ventas del BCRP se realizaron en tres tramos: USD 150M el jueves por la mañana, USD 130M el jueves por la tarde y USD 140M el viernes. El instituto emisor utilizó su modalidad de subasta de "repos de divisas" que le permite inyectar soles al sistema sin reducir permanentemente las reservas en el largo plazo. Las reservas internacionales netas bajaron a US$ 74.0 billones desde los US$ 74.4 de inicio de semana.

El presidente del BCRP, Julio Velarde, señaló en declaraciones a medios que la institución "no tiene un objetivo de tipo de cambio específico, sino que interviene para evitar volatilidad excesiva". Añadió que el nivel actual de reservas — equivalente al 30.6% del PBI estimado de 2026 — brinda amplio margen para continuar interviniendo si es necesario. La próxima reunión de política monetaria es el 10 de julio.

Economistas consultados por Gestión coinciden en que la intervención del BCRP fue efectiva para evitar un overshooting del tipo de cambio. Sin la acción del banco central, el sol podría haber llegado a S/ 3.43-3.45 en el intraday del jueves. El consenso de analistas para el tipo de cambio a fin de junio se ubica en S/ 3.41-3.42.`,
    analisis: `La intervención del BCRP por USD 420M en dos días confirma que el banco central mantiene un papel activo en suavizar la volatilidad cambiaria. Este comportamiento histórico del BCRP reduce el riesgo de movimientos bruscos del sol, pero no elimina la tendencia depreciativa mientras el DXY permanezca por encima de 103.

Para empresas con planificación cambiaria, la presencia activa del BCRP en el mercado implica que el sol difícilmente superará S/ 3.43-3.45 en el corto plazo sin una capitulación clara de la autoridad monetaria. En QoriCash facilitamos cambio de divisas para empresas e importadores con los mejores tipos de cambio y sin comisiones adicionales.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'Agroexportaciones peruanas suman US$ 3,820M en enero-mayo 2026, crecimiento del 22% impulsado por paltas y arándanos',
    descripcion: 'Las exportaciones agropecuarias no tradicionales del Perú alcanzaron US$ 3,820 millones en los primeros cinco meses de 2026, un crecimiento del 22% respecto al mismo período del año anterior, según cifras de SUNAT y PROMPERU. Paltas frescas y arándanos concentran el 58% del total y registran tasas de expansión de 28% y 34% respectivamente.',
    contenido: `Las agroexportaciones peruanas no tradicionales alcanzaron US$ 3,820 millones en el acumulado enero-mayo de 2026, consolidando al sector como el motor de divisas más dinámico de la economía peruana. El crecimiento del 22% frente a los US$ 3,131 millones del mismo período de 2025 refleja la convergencia de tres factores: la expansión de áreas cosechadas, la apertura de nuevos mercados y precios FOB favorables.

Los tres productos más exportados en el período fueron: paltas frescas (US$ 420M, +28%), arándanos frescos (US$ 185M, +34%) y uvas de mesa (US$ 312M, +15%). En conjunto, estos tres productos representan el 24% del total de las agroexportaciones de enero-mayo. Los principales mercados de destino fueron: Estados Unidos (28%), Países Bajos (22%), España (14%) y China (11%) — este último con un crecimiento del 45% tras la entrada en vigor de los protocolos fitosanitarios para arándanos y paltas peruanas en el mercado chino.

La región Ica lidera las exportaciones agroalimentarias con el 31% del total, seguida por La Libertad (24%) y Lambayeque (12%). Las empresas más activas en exportación durante el período fueron Camposol, Danper Trujillo, Sociedad Agrícola Virú y AgroVida — todas con crecimientos superiores al 18%. El precio promedio FOB de los productos frescos subió 9% en dólares, beneficiado por el tipo de cambio favorable y la mayor demanda europea.

PROMPERU proyecta que las agroexportaciones totales de 2026 superarán los US$ 8,500 millones, con paltas superando el umbral de US$ 1,000 millones anuales por primera vez en la historia. El sector enfrenta el reto de mantener la certificación fitosanitaria y diversificar mercados ante el riesgo de sobresaturación en Europa.`,
    analisis: `El sólido desempeño de las agroexportaciones peruanas es una fuente estructural de oferta de dólares en el mercado cambiario local, lo que contribuye a moderar la presión depreciativa del sol. En temporadas de cosecha alta (marzo-septiembre), los dólares de las agroexportadoras peruanas generan un efecto amortiguador natural sobre el tipo de cambio.

Para empresas agroexportadoras que liquidan dólares en el mercado local, QoriCash ofrece un tipo de cambio superior al bancario con atención inmediata y sin comisiones. Optimizar el tipo de cambio de liquidación puede mejorar significativamente el margen operativo en un sector de márgenes ajustados.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'MEF publica Marco Macroeconómico Multianual 2027-2029: PBI crecerá 3.5% en 2027 y superávit fiscal desde 2028',
    descripcion: 'El Ministerio de Economía y Finanzas presentó el Marco Macroeconómico Multianual 2027-2029, proyectando un crecimiento del PBI de 3.5% en 2027 y 3.8% en 2028. El documento estima que el déficit fiscal convergirá al equilibrio en 2028 gracias a la consolidación de la inversión minera y la regla fiscal aprobada en 2025.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó el viernes 20 de junio el Marco Macroeconómico Multianual (MMM) 2027-2029, el documento de planificación fiscal y macroeconómica más importante del gobierno para el mediano plazo. Las proyecciones centrales contemplan un crecimiento del PBI de 3.2% para 2026, 3.5% para 2027 y 3.8% para 2028, sustentado en la consolidación de la inversión minera, la expansión agroexportadora y la recuperación de la inversión privada.

El déficit fiscal proyectado para 2026 es de -2.0% del PBI, reduciendo progresivamente a -1.2% en 2027 y alcanzando el equilibrio (-0.1%) en 2028. El MEF señala que la convergencia fiscal se logrará sin nuevos impuestos, sino mediante la mejora de la eficiencia del gasto público, la mayor recaudación tributaria asociada al crecimiento económico y la reducción de exoneraciones. Los ingresos tributarios proyectados para 2026 son de 17.8% del PBI, el mayor nivel desde 2014.

El documento dedica un capítulo al sector externo y el tipo de cambio. Las proyecciones del MEF asumen un sol en el rango S/ 3.38-3.45 para el período 2026-2028, con una cuenta corriente deficitaria de -2.4% del PBI en 2026 que se moderará a -1.9% en 2028 conforme las exportaciones mineras maduren. Las reservas internacionales netas se mantendrán por encima de US$ 72 billones durante todo el período proyectado.

El viceministro de Hacienda destacó que el MMM refleja "la solidez macroeconómica del Perú" en un contexto externo complejo. La calificación crediticia del país — BBB+ por S&P y Baa1 por Moody's — se sustenta precisamente en la disciplina fiscal proyectada en el documento.`,
    analisis: `El MMM del MEF consolida el escenario macroeconómico base para el período 2026-2028: crecimiento moderado pero sostenido, disciplina fiscal progresiva y tipo de cambio estable en el rango S/ 3.38-3.45. Este marco reduce la incertidumbre para la planificación empresarial de mediano plazo y es positivo para la confianza de los inversores.

Para empresas con contratos multianual en dólares o decisiones de cobertura cambiaria de largo plazo, el rango del MEF proporciona una referencia oficial sobre la trayectoria esperada del tipo de cambio. En QoriCash facilitamos cambio de divisas para empresas con planificación de largo plazo, ofreciendo los mejores tipos de cambio del mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'Producción de cobre peruana alcanza 145,200 TMF en mayo 2026, nuevo récord mensual e histórico',
    descripcion: 'La producción de cobre en Perú alcanzó 145,200 toneladas métricas finas (TMF) en mayo de 2026, superando el récord anterior de 143,800 TMF de febrero de 2024, según datos del Ministerio de Energía y Minas. Antamina, Las Bambas y Cerro Verde lideraron el desempeño, consolidando a Perú como el segundo productor mundial de cobre.',
    contenido: `La producción de cobre peruana marcó un nuevo récord histórico en mayo de 2026 con 145,200 toneladas métricas finas (TMF), superando en 0.97% el anterior máximo de 143,800 TMF alcanzado en febrero de 2024. El acumulado enero-mayo 2026 suma 692,400 TMF, un crecimiento del 8.3% frente a los 639,200 TMF del mismo período de 2025, según el informe estadístico del Ministerio de Energía y Minas (MINEM).

Los tres yacimientos de mayor producción en mayo fueron: Antamina (28,400 TMF, +12% interanual), Las Bambas (21,800 TMF, +9%) y Cerro Verde (19,200 TMF, +6%). La unidad de Antamina se benefició de la puesta en marcha de la ampliación de su planta concentradora en marzo de 2026, que elevó su capacidad de procesamiento en un 15%. Las Bambas reportó la menor tasa de conflictividad social en cinco años, con cero días de paralización en mayo.

El precio promedio del cobre en mayo fue de US$ 4.82/libra en la Bolsa de Metales de Londres (LME), comparado con US$ 4.31/libra en mayo de 2025 — un incremento del 11.8% que magnifica el impacto positivo sobre las exportaciones peruanas. Las exportaciones de cobre en mayo se estiman en US$ 1,840 millones, el mayor registro mensual del año, generando un flujo significativo de divisas al mercado cambiario local.

Perú se consolidó como el segundo mayor productor mundial de cobre en 2026, con una participación del 11.2% de la producción global, solo detrás de Chile (27.4%). Las perspectivas para el segundo semestre son favorables: el inicio de producción en el proyecto Quellaveco II está programado para el cuarto trimestre, con una capacidad adicional de 12,000 TMF/mes.`,
    analisis: `La producción récord de cobre es directamente positiva para el sol: genera un flujo elevado de dólares de exportación que las mineras liquidan parcialmente en el mercado local para cubrir costos en soles. En meses de alta producción minera, la oferta de dólares ayuda a anclar el tipo de cambio.

Para empresas que hacen negocios con el sector minero o sus proveedores, el ciclo expansivo del cobre implica mayor actividad económica y flujo de divisas en las regiones mineras. En QoriCash atendemos a empresas proveedoras del sector minero con cambio de divisas a tasas preferenciales para montos mayores a US$ 3,000.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'Crédito en soles a mypes crece 8.2% en mayo: la tasa más alta en 4 años impulsada por garantías Reactiva Pro',
    descripcion: 'El crédito bancario en soles destinado a micro y pequeñas empresas (mypes) creció 8.2% interanual en mayo de 2026, la tasa más alta desde mayo de 2022, según cifras de la SBS. El programa de garantías Reactiva Pro 2026, lanzado en marzo por el MEF con S/ 8,000 millones en garantías, ha desbloqueado créditos nuevos por S/ 3,200 millones en los primeros tres meses.',
    contenido: `El crédito bancario en moneda nacional destinado a micro y pequeñas empresas (mypes) registró un crecimiento de 8.2% interanual en mayo de 2026, según el informe mensual de la Superintendencia de Banca, Seguros y AFP (SBS). El saldo total de créditos en soles al segmento mype se ubicó en S/ 68,400 millones, el mayor nivel histórico. El crecimiento de 8.2% contrasta con el 5.1% promedio del primer trimestre y refleja el efecto acumulado del programa Reactiva Pro.

El programa Reactiva Pro 2026, anunciado por el MEF en enero y lanzado en marzo, ofrece garantías del Estado para créditos nuevos a mypes de hasta S/ 500,000. Los bancos participantes pueden prestar con tasas de interés de 8%-12% anual en soles para empresas con historial crediticio limpio, significativamente por debajo de las tasas de mercado habituales de 18%-28%. Al 31 de mayo, se habían desembolsado S/ 3,200 millones en créditos nuevos bajo el programa, cubriendo a 48,400 empresas.

Los bancos con mayor participación en el desembolso de créditos Reactiva Pro fueron BCP (31%), Interbank (22%), BBVA (18%) y Scotiabank (14%). Las regiones con mayor crecimiento en el saldo de créditos mype fueron: Lima (7.8%), La Libertad (10.4%), Arequipa (9.1%) y Cusco (11.3%). El sector comercio concentra el 42% de los nuevos créditos, seguido por servicios (28%) y manufactura (18%).

La tasa de morosidad del segmento mype se ubicó en 6.4% en mayo, 0.3 puntos porcentuales por encima del mes anterior, reflejando el efecto de la incorporación de nuevos deudores. La SBS monitorea de cerca la evolución de la cartera Reactiva Pro; los primeros vencimientos importantes serán a partir de septiembre de 2026.`,
    analisis: `El dinamismo del crédito en soles a mypes es una señal positiva para la economía real, pero tiene un efecto indirecto sobre el tipo de cambio: mayor liquidez en soles puede reducir marginalmente la demanda de dólares en el mercado financiero. Sin embargo, el efecto es secundario frente a los determinantes externos como el DXY.

Para mypes que necesitan importar insumos o equipos en dólares, el contexto actual combina mayor acceso al crédito en soles (Reactiva Pro) con un dólar más caro (S/ 3.418). QoriCash ofrece el mejor tipo de cambio del mercado para que sus compras en dólares sean más eficientes.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Fed mantiene tasas en 4.25-4.50% y reduce proyección de recortes 2026 a solo uno, en diciembre',
    descripcion: 'La Reserva Federal de Estados Unidos mantuvo el miércoles 18 de junio la tasa de fondos federales en el rango 4.25-4.50% por tercera reunión consecutiva. El dotplot actualizado redujo de dos a uno el número de recortes proyectados para 2026, todos ellos desplazados al cuarto trimestre, decepcionando las expectativas del mercado que esperaba señales más dovish.',
    contenido: `El Comité Federal de Mercado Abierto (FOMC) de la Reserva Federal de Estados Unidos votó por unanimidad el miércoles 18 de junio mantener la tasa de fondos federales en el rango objetivo de 4.25%-4.50%, nivel que permanece sin cambios desde diciembre de 2025. La decisión estuvo en línea con el consenso de mercado (94% de probabilidad según CME FedWatch previo a la reunión), pero el dotplot y la conferencia de prensa entregaron una señal más restrictiva de la esperada.

El "dotplot" publicado junto con la decisión mostró que la mediana de proyecciones de los miembros del FOMC apunta a un solo recorte de 25 puntos básicos en 2026 — para el cuarto trimestre —, reduciendo las dos rebajas proyectadas en el dotplot de marzo. Para 2027, la mediana proyecta dos recortes adicionales. La tasa terminal de largo plazo se mantuvo en 3.0%, señal de que el Comité no anticipa regresar a los niveles de tasas ultra-bajas pre-pandemia.

El presidente Jerome Powell, en su conferencia de prensa, subrayó que la economía estadounidense "sigue mostrando fortaleza notable" con el mercado laboral en pleno empleo (desempleo 4.0%) y la inflación PCE subyacente aún en 2.7%, por encima del objetivo del 2%. Powell señaló que el Comité necesita ver "varios meses de datos de inflación convergiendo hacia el objetivo" antes de iniciar el ciclo de recortes. Rechazó explícitamente el concepto de un recorte "precautorio" en los próximos meses.

El mercado de futuros de los fondos federales ahora descuenta 82% de probabilidad de que el primer recorte ocurra en la reunión del 15-16 de diciembre de 2026 — desplazado desde septiembre según las probabilidades previas al FOMC.`,
    analisis: `La decisión hawkish de la Fed es el principal factor externo que presiona al sol y a la mayoría de monedas de mercados emergentes en este momento. Con tasas altas en EE.UU. proyectadas hasta diciembre de 2026, el dólar tiene incentivos para mantenerse fuerte frente al PEN y otras monedas de la región.

Para quienes tienen exposición cambiaria en dólares, el mensaje del FOMC sugiere que el entorno de dólar fuerte continuará al menos hasta el tercer trimestre de 2026. Evaluar cobertura cambiaria o adelantar compras de dólares es prudente en este contexto. En QoriCash ofrecemos el mejor tipo de cambio para operaciones de cobertura tanto para personas como para empresas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'Petróleo WTI cae a US$ 76.4/barril por inventarios semanales inesperadamente altos y menor demanda china',
    descripcion: 'El petróleo West Texas Intermediate (WTI) retrocedió a US$ 76.4 por barril el viernes 20 de junio, acumulando una caída semanal del 3.8%, tras el reporte de inventarios del EIA que mostró un aumento inesperado de 4.2 millones de barriles. La menor actividad manufacturera en China agrava las perspectivas de demanda para el tercer trimestre.',
    contenido: `El petróleo West Texas Intermediate (WTI) cerró el viernes 20 de junio en US$ 76.4 por barril, bajando US$ 3.0 en la semana (-3.8%), su mayor caída semanal desde marzo de 2026. El catalizador principal fue el informe semanal de inventarios de la Administración de Información Energética (EIA) publicado el miércoles, que registró un aumento de 4.2 millones de barriles — frente a la expectativa de mercado de una reducción de 1.8 millones —, señalando mayor oferta o menor absorción de la prevista.

El dato de inventarios se sumó a un contexto de demanda global menos sólida: el PMI manufacturero de China de mayo marcó 49.5 (contracción), y el informe mensual de la OPEP publicado el martes redujo en 180,000 b/d su estimación de crecimiento de la demanda global de petróleo para 2026, a un total de 1.2 millones de b/d. Los analistas de Goldman Sachs recortaron su precio objetivo para el WTI a fin de 2026 de US$ 88 a US$ 82/barril.

Arabia Saudita y Rusia, los dos mayores productores de la OPEP+, reafirmaron en una reunión bilateral el jueves su compromiso con los recortes de producción vigentes de 2.2 millones de b/d, lo que evitó una caída más pronunciada. El Brent, referencia internacional, cerró en US$ 79.8/barril (-3.4% semanal). El spread Brent-WTI se mantuvo en torno a US$ 3.4, en línea con el promedio del año.

Para Perú, la caída del petróleo tiene un efecto moderadamente positivo: reduce la presión sobre la balanza comercial por importación de derivados y puede aliviar la presión inflacionaria en combustibles. Sin embargo, el efecto directo sobre el tipo de cambio es menor, ya que el petróleo no es el principal determinante del PEN.`,
    analisis: `La caída del petróleo a US$ 76.4 tiene efecto mixto para el sol: es positiva para la balanza comercial peruana (reduce el costo de importación de derivados) pero es negativa para los precios de materias primas en general, incluyendo metales industriales. El saldo neto para el tipo de cambio es aproximadamente neutro.

Para empresas del sector transporte, logística o manufactura que consumen combustibles, el retroceso del petróleo puede traducirse en menores costos operativos en las próximas semanas. Si tienes operaciones con exposición al precio del petróleo o necesitas cambio de divisas para importaciones energéticas, en QoriCash te ofrecemos el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'Oro avanza a US$ 3,420/oz por demanda de cobertura ante dólar fuerte y tensiones geopolíticas en Medio Oriente',
    descripcion: 'El oro al contado subió a US$ 3,420 por onza troy el viernes 20 de junio, ganancia semanal del 1.8%, impulsado por la búsqueda de activos refugio ante un dólar más fuerte y nuevas tensiones geopolíticas en Medio Oriente. Los ETFs de oro registraron entradas de US$ 2,100 millones en la semana, la mayor cifra desde febrero de 2026.',
    contenido: `El precio del oro al contado cerró el viernes 20 de junio en US$ 3,420 por onza troy, acumulando una ganancia semanal del 1.8% (+US$ 61/oz) frente al cierre del viernes anterior de US$ 3,359. La divergencia respecto al dólar — que también subió con fuerza en la semana — refleja la naturaleza de refugio del metal amarillo en momentos de incertidumbre simultánea: un dólar fuerte generalmente presiona al oro a la baja, pero la demanda de cobertura puede ser más fuerte en momentos de estrés geopolítico.

Los flujos hacia fondos cotizados (ETFs) respaldados por oro sumaron US$ 2,100 millones en la semana del 16-20 de junio, según datos de Bloomberg Intelligence — la mayor entrada semanal desde el 3 de febrero de 2026. El SPDR Gold Shares (GLD), el mayor ETF de oro del mundo, aumentó sus tenencias en 18.4 toneladas, a un total de 892 toneladas. La demanda de opciones call sobre oro a 3 meses en el mercado OTC de Londres se incrementó 34%.

Los bancos centrales de economías emergentes — encabezados por China, India y Polonia — continúan siendo compradores estructurales de oro. En mayo, los bancos centrales globales sumaron 45 toneladas netas a sus reservas, según el World Gold Council, continuando la tendencia de "dedolarización" gradual de las reservas internacionales que se aceleró desde 2022.

El soporte técnico clave del oro se ubica en US$ 3,380/oz (media móvil de 20 días), y la resistencia inmediata en US$ 3,460/oz (máximo histórico del 21 de mayo). Una ruptura al alza de ese nivel abriría paso a un objetivo de US$ 3,520/oz según los análisis de Fibonacci.`,
    analisis: `El avance del oro a US$ 3,420 en un contexto de dólar fuerte es una señal inusual que refleja el nivel elevado de incertidumbre geopolítica y financiera. Para Perú, el precio alto del oro beneficia a la balanza comercial: en 2026 el país producirá aproximadamente 95 toneladas de oro, lo que a estos precios representa exportaciones de cerca de US$ 9,800 millones anuales.

Para personas con ahorros en soles que buscan diversificación, el oro en US$ 3,420 está cerca de máximos históricos: en QoriCash no comercializamos oro físico, pero sí facilitamos el cambio de soles a dólares al mejor tipo de cambio del mercado para quienes deseen posicionarse en activos en moneda dura.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'DXY rompe resistencia de 103.2 y alcanza 103.5: analistas apuntan a zona 104-105 si los datos de EE.UU. siguen fuertes',
    descripcion: 'El índice dólar (DXY) cerró la semana del 16-20 de junio en 103.47 puntos, superando la resistencia clave de 103.2 que había contenido el rally por tres semanas. Los analistas técnicos de Goldman Sachs y Morgan Stanley anticipan una extensión hacia la zona 104-105 si los datos de empleo y PMI de EE.UU. de la próxima semana confirman la fortaleza de la economía.',
    contenido: `El índice dólar DXY cerró el viernes 20 de junio en 103.47 puntos, su nivel más alto en 8 semanas, y por primera vez en ese período logró sostener el cierre por encima de la resistencia técnica de 103.2. La ruptura se produjo el jueves por la tarde, pocas horas después de que Jerome Powell confirmara en su conferencia de prensa que la Fed no contempla recortes antes del cuarto trimestre. El DXY ganó +1.64% en la semana, la mayor ganancia semanal desde la primera semana de febrero.

El análisis técnico del DXY muestra una estructura alcista de corto plazo tras la ruptura del nivel 103.2: el siguiente objetivo es la zona 104.0-104.5, donde confluyen la resistencia del máximo del 3 de abril (104.05) y la media móvil de 200 días (103.95). Una ruptura sostenida por encima de 104.5 abriría paso al nivel 105.5, que es la resistencia del máximo de octubre de 2025. El RSI semanal se ubica en 58, en zona de momentum positivo sin estar sobrecomprado.

Las divisas más afectadas por el fortalecimiento del DXY en la semana fueron: yen japonés (JPY: +1.8%), real brasileño (BRL: +1.2%), peso colombiano (COP: +1.4%) y sol peruano (PEN: +0.6%). El euro cayó a 1.072 frente al dólar. Las monedas de materias primas como el dólar australiano (AUD) y el dólar canadiense (CAD) resistieron mejor gracias al soporte de los precios de los metales.

Para la semana del 22 de junio, los datos clave a seguir son el PMI manufacturero flash S&P Global (lunes) y el índice de confianza del consumidor Conference Board (martes). Si ambos datos sorprenden al alza, el DXY podría probar la zona 104.0 antes del viernes.`,
    analisis: `La ruptura alcista del DXY por encima de 103.2 es la señal técnica más relevante para el tipo de cambio PEN en este momento. Si el DXY confirma la extensión hacia 104-105, el sol podría alcanzar S/ 3.43-3.46 en las próximas 2-3 semanas, presionando la intervención del BCRP. Seguir el DXY es más predictivo para el tipo de cambio que cualquier indicador local.

Para quienes planifican compras de dólares, el contexto técnico sugiere que el momento actual (S/ 3.418) puede ser mejor que esperar — si el DXY sigue subiendo, el sol continuará debilitándose. En QoriCash te ofrecemos el mejor tipo de cambio del mercado con atención inmediata para cerrar tu operación cuando lo decidas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'Bitcoin retrocede 4.2% a US$ 98,500 por liquidaciones en CME y fortaleza del dólar post-FOMC',
    descripcion: 'Bitcoin cerró la semana del 16-20 de junio en US$ 98,500, cayendo 4.2% desde los US$ 102,800 del cierre anterior, presionado por las liquidaciones masivas de contratos de futuros en el CME y el fortalecimiento del dólar tras el FOMC. El nivel de US$ 97,000 emerge como soporte crítico para evitar una corrección hacia US$ 92,000.',
    contenido: `Bitcoin (BTC/USD) cerró el viernes 20 de junio en US$ 98,500 en los principales exchanges globales, acumulando una pérdida semanal del 4.2% frente al cierre del viernes anterior de US$ 102,800. Es la primera vez en cinco semanas que BTC cierra por debajo de US$ 100,000, nivel psicológico clave que había actuado como soporte desde el 14 de mayo.

Las liquidaciones de contratos de futuros en el Chicago Mercantile Exchange (CME) fueron el catalizador técnico: el jueves, durante la conferencia de prensa de Powell, se liquidaron USD 1.24 billones en posiciones largas de BTC en el CME en menos de dos horas — el mayor evento de liquidación desde el 13 de marzo. Los datos de posicionamiento muestran que los fondos institucionales redujeron su exposición neta larga en BTC de 28,400 contratos a 19,800 contratos en la semana.

El fortalecimiento del DXY a 103.5 tras el FOMC es estructuralmente negativo para Bitcoin: históricamente, la correlación negativa BTC/DXY ha sido de -0.67 en períodos de 30 días desde 2022. Con el dólar más fuerte y las tasas de la Fed sin recortes a la vista hasta diciembre, el atractivo relativo de activos de riesgo como BTC se reduce frente a los rendimientos en efectivo (money market funds con yields del 4.3%).

El soporte técnico crítico se ubica en US$ 97,000 (media móvil de 50 días). Una pérdida de ese nivel activaría órdenes de stop-loss adicionales y podría llevar al precio hacia US$ 92,000-93,000 (retroceso del 38.2% de Fibonacci del rally desde US$ 72,000). La resistencia inmediata está en US$ 102,500-103,000.`,
    analisis: `La caída de Bitcoin a US$ 98,500 refleja el impacto del FOMC hawkish sobre los activos de riesgo: con tasas altas proyectadas hasta diciembre, la competencia del cash dólar al 4.3% desincentiva la tenencia de activos volátiles sin rendimiento como BTC. Sin embargo, el ciclo de halving de 2024 y la demanda institucional estructural limitan el potencial de caída.

Para peruanos con ahorros en Bitcoin que quieran aprovechar el actual nivel del sol para reconvertir, el momento de cambio de dólares a soles o viceversa puede ser relevante. En QoriCash ofrecemos el mejor tipo de cambio del mercado para tus operaciones de PEN/USD, sin importar en qué activos mantengas tu cartera.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'PEN/USD alcanza S/ 3.418, máximo de tres semanas: resistencia técnica en S/ 3.43 definirá el próximo movimiento',
    descripcion: 'El tipo de cambio interbancario PEN/USD tocó S/ 3.418 el viernes 20 de junio, su nivel más alto desde el 28 de mayo, impulsado por el dotplot hawkish de la Fed y el rally del DXY. El análisis técnico identifica la zona S/ 3.42-3.43 como resistencia clave y S/ 3.40 como soporte principal.',
    contenido: `El tipo de cambio interbancario PEN/USD cerró el viernes 20 de junio en S/ 3.418 por dólar, alcanzando su mayor nivel desde el 28 de mayo de 2026 (S/ 3.421). La semana acumuló una depreciación del sol de +0.7% (S/ 3.394 → S/ 3.418), el movimiento semanal más pronunciado desde la primera semana de abril. El volumen de operaciones en el mercado interbancario fue elevado: US$ 1,840 millones el jueves y US$ 1,620 millones el viernes, impulsados por la cobertura de posiciones post-FOMC.

El análisis técnico del par PEN/USD muestra las siguientes referencias: (1) Soporte principal: S/ 3.40, zona de compras previas del BCRP que ha funcionado como piso en tres ocasiones desde febrero. (2) Soporte secundario: S/ 3.41, media móvil exponencial de 10 días. (3) Resistencia inmediata: S/ 3.42-3.43, máximos de mayo 22-28 que generaron ventas de dólares por parte del BCRP. (4) Resistencia mayor: S/ 3.45-3.46, máximos del 14 de abril y techo del canal de largo plazo.

Las opciones sobre PEN/USD a 30 días muestran una risk reversal de +0.8% hacia calls de dólar (apuesta por depreciación del sol), la más elevada desde enero de 2026. Los fondos de pensiones (AFPs) redujeron su posición en dólares en S/ 280 millones durante la semana, aportando oferta de dólares y moderando el movimiento. Los bancos extranjeros mantienen posiciones largas netas en dólares de US$ 420 millones, cerca del máximo permitido por la regulación.

Para la semana del 22 de junio, el nivel de S/ 3.42-3.43 será el test clave: si el DXY supera 104 y el BCRP no interviene agresivamente, el sol podría probar ese nivel. Si el BCRP refuerza su presencia en el mercado, el tipo de cambio podría regresar a S/ 3.40-3.41.`,
    analisis: `El análisis técnico del PEN/USD sugiere que el sol enfrenta una zona de resistencia importante en S/ 3.42-3.43. Históricamente el BCRP ha intervenido con fuerza en esa zona, lo que limita el potencial de depreciación adicional en el corto plazo. Sin embargo, si el DXY supera 104 puntos, el costo de mantener esa resistencia para el BCRP se eleva significativamente.

Para quienes tienen operaciones de cambio pendientes, el rango S/ 3.40-3.43 es el escenario base para las próximas dos semanas. En QoriCash ofrecemos cotizaciones en tiempo real y el mejor tipo de cambio del mercado para que cierres tus operaciones con la máxima eficiencia.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina: reservas brutas caen a US$ 26,800M pero tipo de cambio oficial se mantiene estable en la banda cambiaria',
    descripcion: 'Las reservas internacionales brutas del Banco Central de Argentina cayeron a US$ 26,800 millones al 19 de junio, según datos oficiales, por pagos de deuda al FMI y menor acumulación de divisas del agro. Sin embargo, el tipo de cambio oficial se mantiene dentro de la banda de flotación de ARS 1,000-1,300 por dólar establecida en el acuerdo con el Fondo Monetario Internacional.',
    contenido: `Las reservas internacionales brutas del Banco Central de la República Argentina (BCRA) cayeron a US$ 26,800 millones al 19 de junio de 2026, reducción de US$ 1,240 millones respecto al cierre de mayo. La caída refleja tres factores: el pago de US$ 720 millones al FMI como parte del cronograma del acuerdo Stand-By, la menor liquidación de divisas del sector agropecuario — afectado por la sequía en el sur de Santa Fe — y compras de divisas del sector privado que aceleraron ante el contexto global de dólar fuerte.

A pesar de la caída de reservas, el tipo de cambio oficial cerró el viernes 20 de junio en ARS 1,092 por dólar, dentro de la banda de flotación ARS 1,000-1,300 acordada con el FMI en el programa de US$ 44,000 millones firmado en enero de 2026. El BCRA no intervino directamente en el mercado spot durante la semana, dejando que el tipo de cambio se ajuste dentro de la banda por la oferta y demanda de mercado.

El dólar blue (mercado informal) cotizó el viernes en ARS 1,145, representando una brecha del 4.9% con el tipo de cambio oficial — la más baja desde la implementación de la banda cambiaria. La convergencia de la brecha es una señal positiva que refleja mayor confianza en la estabilidad cambiaria; en enero de 2026, la brecha superaba el 35%. Los analistas del mercado de Buenos Aires estiman que la brecha se mantendrá por debajo del 10% mientras el programa con el FMI esté vigente.

El FMI realizará en julio su tercera revisión trimestral del programa argentino. Las metas de acumulación de reservas para el segundo trimestre contemplaban alcanzar los US$ 27,500 millones al 30 de junio; el nivel actual sugiere que Argentina podría no cumplir esa meta, lo que generaría discusiones con el Fondo sobre posibles waivers.`,
    analisis: `La situación de Argentina es relevante para el contexto regional: la caída de reservas y el posible incumplimiento de metas del FMI puede generar volatilidad en el peso argentino y, por contagio, presionar a otras monedas de la región incluido el sol. Sin embargo, la menor brecha cambiaria y la estabilidad dentro de la banda son señales de progreso en la estabilización macro.

Para empresas peruanas con operaciones comerciales con Argentina, el contexto de relativa estabilidad dentro de la banda cambiaria reduce el riesgo cambiario bilateral en el corto plazo. Para tus operaciones de cambio de PEN/USD con el mejor tipo de cambio del mercado, QoriCash está disponible con atención inmediata.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Colombia: Banco de la República recorta tasa en 25 pbs a 8.75% ante inflación en 5.8% y desaceleración económica',
    descripcion: 'El Banco de la República de Colombia recortó el viernes 20 de junio su tasa de política monetaria en 25 puntos básicos, llevándola de 9.00% a 8.75%, en respuesta a la desaceleración de la inflación a 5.8% y la moderación del crecimiento económico. Es el noveno recorte consecutivo desde el ciclo de relajación monetaria iniciado en diciembre de 2024.',
    contenido: `La Junta Directiva del Banco de la República de Colombia votó el viernes 20 de junio por 5 votos a favor y 2 en contra reducir la tasa de intervención en 25 puntos básicos, de 9.00% a 8.75%. La decisión, ampliamente anticipada por el mercado (82% de probabilidad según encuesta de Bloomberg), es el noveno recorte consecutivo desde que el banco central inició el ciclo de relajación en diciembre de 2024, acumulando una reducción total de 350 puntos básicos desde el máximo de 13.25%.

La inflación colombiana se ubicó en 5.8% interanual en mayo de 2026, continuando su tendencia descendente desde el máximo de 13.1% de marzo de 2023, pero aún por encima del rango meta del banco central de 2%-4%. El gerente del Banco de la República, Leonardo Villar, señaló en la conferencia de prensa que el Comité anticipa que la inflación convergirá al rango meta en el primer trimestre de 2027. Para el cierre de 2026, la proyección central es de 4.3%.

El crecimiento económico de Colombia en el primer trimestre de 2026 fue de 2.1% interanual (preliminar), por debajo del 2.8% del cuarto trimestre de 2025, afectado por la caída de la inversión privada y la desaceleración del consumo de hogares. La tasa de desempleo subió a 10.8% en abril desde el 10.1% del mismo mes de 2025. El banco central señala que la política monetaria "sigue siendo restrictiva" incluso a 8.75%, dado que la tasa neutral estimada es de 5.5%-6.0%.

El peso colombiano (COP) cerró la semana en COP 4,285 por dólar, depreciándose 1.4% en la semana — principalmente por la fortaleza global del dólar post-FOMC, no por el recorte local. Las reservas internacionales de Colombia se ubican en US$ 61,400 millones, nivel cómodo para enfrentar choques externos.`,
    analisis: `El ciclo de recortes del Banco de la República colombiano es relevante para el contexto regional: muestra que las economías latinoamericanas están más adelantadas en el ciclo de relajación monetaria que la Fed, lo que puede generar presiones sobre sus monedas. Para el sol peruano, el contexto colombiano no tiene impacto directo significativo.

Para empresas peruanas con comercio bilateral con Colombia, la depreciación del peso colombiano puede afectar la competitividad de las exportaciones peruanas al mercado colombiano. Para tus operaciones de cambio PEN/USD, QoriCash ofrece el mejor tipo de cambio del mercado peruano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Chile: Banco Central mantiene TPM en 4.50% y señala que la desinflación continúa pero el camino al 3% es gradual',
    descripcion: 'El Banco Central de Chile mantuvo el jueves 19 de junio la Tasa de Política Monetaria (TPM) en 4.50%, en línea con las expectativas del mercado. El comunicado señala que la inflación se ubica en 3.8% interanual — cerca del techo del rango meta — y que la convergencia al objetivo del 3% requerirá un proceso gradual durante 2026 y 2027.',
    contenido: `El Consejo del Banco Central de Chile votó por unanimidad el jueves 19 de junio mantener la Tasa de Política Monetaria (TPM) en 4.50%, nivel que permanece sin cambios desde la reunión de abril de 2026. La decisión estuvo en línea con el 91% de probabilidad que estimaba el mercado según la encuesta de traders de Bloomberg Chile. La TPM de 4.50% se ubica 100 puntos básicos por encima de la tasa neutral estimada por el banco central (3.50%).

La inflación en Chile se situó en 3.8% interanual en mayo de 2026, ligeramente por encima del techo del rango meta de 2%-4% del banco central. El IPC subyacente, que excluye precios volátiles de alimentos y energía, marcó 3.5%. El comunicado del Consejo señaló que "la convergencia de la inflación al objetivo del 3% requiere un proceso gradual" y que "el Consejo seguirá evaluando la evolución del escenario macroeconómico y sus riesgos".

El crecimiento económico chileno fue del 2.4% en el primer trimestre de 2026, impulsado por la construcción y la minería del cobre. El desempleo se ubica en 8.9%, estable respecto al trimestre anterior. El peso chileno (CLP) cerró el viernes en CLP 942 por dólar, depreciándose 1.8% en la semana por el fortalecimiento del DXY, aunque la solidez de los precios del cobre (US$ 4.82/lb) ofrece soporte.

Las perspectivas para el segundo semestre de 2026 contemplan dos recortes adicionales de 25 pbs cada uno, que llevarían la TPM a 4.00% a fines de año. El Banco Central publicará su próximo Informe de Política Monetaria (IPoM) el 3 de septiembre, con nuevas proyecciones de inflación y crecimiento.`,
    analisis: `El mantenimiento de la TPM chilena en 4.50% es una señal de prudencia ante una inflación aún por encima del objetivo. Para el contexto regional, Chile muestra una economía más estable que Argentina o Colombia, con fundamentos macroeconómicos sólidos sustentados en las exportaciones de cobre.

Para empresas peruanas con comercio bilateral con Chile — especialmente en el sector minero, agroindustrial y retail — la estabilidad del peso chileno en torno a CLP 942 ofrece un entorno de planificación más predecible que hace un año. Para tus operaciones de cambio PEN/USD en Perú, QoriCash te ofrece el mejor tipo de cambio del mercado con atención inmediata.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  {
    id: 'g001',
    titulo: 'Sol abre semana en S/ 3.394 con mirada al FOMC del 17-18 junio — DXY retrocede a 102.8',
    descripcion: 'El sol peruano inició la jornada del lunes 15 de junio en S/ 3.394 interbancario, sosteniendo el rango de las últimas dos semanas. El índice dólar (DXY) retrocede levemente a 102.8 puntos tras tomas de ganancia del viernes, mientras el mercado se posiciona para la decisión de la Reserva Federal del miércoles 18 de junio.',
    contenido: `El tipo de cambio PEN/USD inicia la semana del 15 al 20 de junio cotizando en S/ 3.394 interbancario a la apertura del lunes, sin cambios significativos respecto al cierre del viernes S/ 3.393. El DXY Index retrocede a 102.8 puntos —desde el máximo de 103.8 del viernes— en una corrección técnica típica de lunes post-dato, con operadores cerrando posiciones largas en dólares antes de la reunión del FOMC del martes y miércoles.

El catalizador central de la semana es la decisión de política monetaria de la Reserva Federal, que sesiona el martes 17 y miércoles 18 de junio. El consenso de mercado (89% según FedWatch de CME) espera que el FOMC mantenga la tasa de fondos federales en el rango 4.25-4.50% —el mismo que mantiene desde diciembre de 2025. La atención estará en el "dotplot" actualizado que publicará el Comité, el cual indicará cuántos recortes proyectan los miembros Fed para el resto del 2026 y el nivel de tasa terminal para 2027.

El BCRP no tiene reunión de política monetaria esta semana; su próxima sesión está programada para el 10 de julio. Las reservas internacionales se ubican en US$ 74.4 billones tras las compras de la semana pasada. Analistas de BBVA Research señalan que el rango S/ 3.38-3.42 se mantendrá como zona operativa hasta que el FOMC entregue señales claras sobre el timing del primer recorte de tasas.

Los flujos de inicio de semana muestran una ligera demanda de dólares por parte de importadores que cubren pagos de fin de mes, lo que modera la apreciación del sol. En el mercado paralelo, las casas de cambio reportan operaciones en S/ 3.385-3.398 con spread estrecho, reflejando la baja volatilidad esperada previo al FOMC.`,
    analisis: `El inicio de semana con el sol estable en S/ 3.394 y el DXY en corrección técnica configura un entorno de baja volatilidad ideal para planificar operaciones de cambio. El riesgo principal es el FOMC del miércoles: si el dotplot proyecta menos recortes de los esperados, el DXY podría rebotar hacia 104-105 y el sol retroceder a S/ 3.40-3.42.

Para empresas con pagos en dólares a fin de mes, el nivel actual de S/ 3.394 representa una ventana razonable de compra antes de conocer el FOMC. En QoriCash ofrecemos el mejor tipo de cambio del mercado con atención inmediata para operaciones de cualquier monto.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29117446/pexels-photo-29117446.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g002',
    titulo: 'BCRP publica Reporte de Inflación junio: eleva proyección de PBI a 3.2% y proyecta sol en rango S/ 3.38-3.42',
    descripcion: 'El Banco Central de Reserva del Perú publicó hoy su Reporte de Inflación de junio de 2026, elevando la proyección de crecimiento del PBI a 3.2% para el año y ratificando el tono cauteloso en política monetaria ante la inflación en 2.9%. El documento proyecta el sol en el rango S/ 3.38-3.42 durante el tercer trimestre.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) publicó esta mañana el Reporte de Inflación de junio de 2026, su informe trimestral de proyecciones macroeconómicas. El documento eleva la proyección de crecimiento del PBI para 2026 de 3.1% a 3.2%, sustentado en el desempeño superior al esperado del sector minero-exportador en mayo —producción de cobre récord en 141,800 TMF— y la solidez de las agroexportaciones, con arándanos y paltas registrando crecimientos de entre 28% y 34% interanual.

La inflación proyectada para el cierre de 2026 se mantiene en 2.7% interanual, dentro del rango meta 1%-3% del BCRP. El instituto emisor señala que la inflación de servicios —actualmente en 3.4%— continúa siendo monitoreada de cerca, ya que puede generar efectos de segunda ronda si la expectativa inflacionaria supera el punto objetivo de 2%. La próxima reunión de política monetaria está fijada para el 10 de julio.

El Reporte dedica un capítulo especial a los riesgos externos. Los principales identificados son: (1) una postura hawkish más prolongada de la Fed que fortalezca el dólar, (2) mayor desaceleración de China que presione los precios del cobre, y (3) tensiones geopolíticas en Medio Oriente que eleven los precios del petróleo. El BCRP estima que el tipo de cambio se mantendrá en el rango S/ 3.38-3.42 durante el tercer trimestre de 2026.

Las reservas internacionales netas se ubican en US$ 74.4 billones al 13 de junio, equivalentes al 30.8% del PBI estimado para 2026. El BCRP compró USD 680 millones en junio para moderar la apreciación del sol y acumular reservas. El balance de riesgos para el PBI es moderadamente al alza; para la inflación, neutro.`,
    analisis: `El Reporte de Inflación del BCRP consolida el escenario de baja volatilidad para el sol en el corto plazo: proyección de crecimiento sólido, inflación bajo control y tasas estables. Este escenario base reduce el riesgo de movimientos bruscos del tipo de cambio en el tercer trimestre, siempre que los factores externos (Fed, China, petróleo) no presenten sorpresas negativas significativas.

Para empresas con planificación cambiaria de mediano plazo, el rango S/ 3.38-3.42 señalado por el propio BCRP es la referencia más sólida disponible. En QoriCash facilitamos operaciones de cambio para personas y empresas con los mejores tipos de cambio y sin comisiones adicionales.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/22484275/pexels-photo-22484275.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g003',
    titulo: 'Palta peruana alcanza récord de exportación: US$ 420M en enero-mayo 2026, crecimiento del 28% interanual',
    descripcion: 'Las exportaciones peruanas de palta fresca alcanzaron US$ 420 millones en los primeros cinco meses de 2026, un crecimiento del 28% respecto al mismo período del año anterior, según PROMPERU. Perú consolida su posición como el segundo mayor exportador mundial de palta detrás de México, con presencia en más de 45 mercados.',
    contenido: `Las exportaciones peruanas de palta Hass alcanzaron US$ 420 millones en el acumulado enero-mayo de 2026, marcando un nuevo récord para el período. El crecimiento del 28% frente a los US$ 328 millones del mismo período de 2025 refleja la expansión de áreas cultivadas en Ica y La Libertad, la mejora de rendimientos agronómicos y el fortalecimiento de la demanda en los principales mercados de destino.

Los tres mercados más importantes en el período fueron: Países Bajos (US$ 142M, +24%), Estados Unidos (US$ 118M, +31%) y España (US$ 63M, +18%). La apertura acelerada del mercado japonés destaca especialmente: Japón importó US$ 28M en paltas peruanas en el período (+87%), impulsada por el creciente interés en dietas saludables que posicionan al aguacate como "superfood" en el mercado asiático, tras la vigencia del Protocolo Fitosanitario Perú-Japón desde marzo de 2026.

Las principales empresas exportadoras en el período fueron: Camposol (US$ 72M), Westfalia Fruit Perú (US$ 51M) y Avocado S.A.C. (US$ 34M). El precio promedio FOB se ubicó en US$ 1.46/kg, 11% por encima del precio del mismo período de 2025, reflejando la mayor demanda global y el efecto favorable del tipo de cambio. La región de Ica aportó el 38% del volumen total exportado, seguida por La Libertad (29%) y Lima (16%).

PROMPERU proyecta que las exportaciones totales de palta 2026 superen los US$ 1,050 millones, lo que representaría el primer año en que el cultivo supera el umbral de los mil millones de dólares. El sector enfrenta el desafío de la mayor competencia de Chile y Colombia, pero la ventana climática peruana (cosecha de marzo a septiembre) sigue siendo una ventaja competitiva estructural.`,
    analisis: `El dinamismo de las agroexportaciones de palta refuerza el fundamento de oferta de dólares en el mercado cambiario peruano. Cada US$ 100M adicionales en exportaciones genera aproximadamente S/ 340M en oferta de divisas que presiona hacia la apreciación del sol. El sector agro en su conjunto —paltas, arándanos, uvas, espárragos— representa una fuente estructural de divisas que sustenta la estabilidad del PEN.

Para empresas del sector agroexportador que reciben ingresos en dólares y tienen costos en soles, el tipo de cambio actual en S/ 3.394 es relevante para la planificación de coberturas cambiarias. En QoriCash brindamos la mejor tasa para la conversión de divisas a empresas exportadoras con atención personalizada.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3687927/pexels-photo-3687927.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g004',
    titulo: 'Antamina reporta producción récord de zinc en mayo: 48,400 TM y proyecta PBI minero +9% para 2026',
    descripcion: 'Antamina, la mayor mina polimetálica del Perú, publicó sus resultados de mayo con una producción de zinc de 48,400 toneladas métricas, su mayor nivel mensual en 8 años. El cobre de la unidad alcanzó 29,400 TMF. Las cifras consolidan la proyección de crecimiento del PBI minero en 9% para 2026, el mayor en una década.',
    contenido: `Antamina, la unidad polimetálica ubicada en Áncash operada conjuntamente por BHP, Glencore, Teck y Mitsubishi, publicó hoy sus resultados operativos de mayo de 2026. La producción de zinc alcanzó 48,400 toneladas métricas, el nivel más alto desde enero de 2018, con un crecimiento del 14.2% respecto a mayo 2025. La producción de cobre fue de 29,400 TMF (+12.3% interanual) y la de plata de 2.1 millones de onzas (+8.7%).

El resultado excepcional de Antamina en mayo responde a tres factores: el inicio de operaciones de la nueva planta de flotación que incrementa la capacidad de procesamiento en un 12%, las condiciones climáticas favorables que no generaron interrupciones operativas, y la mayor ley del mineral en los sectores explotados. La empresa reporta leyes de zinc de 1.34%, la más alta en 5 años, y de cobre de 0.92%, también por encima del promedio histórico.

El desempeño de Antamina se suma al ya registrado por Cerro Verde (+6% cobre), Las Bambas (+18% cobre) y Quellaveco (+8% cobre), configurando un mayo histórico para el sector minero peruano. El Ministerio de Energía y Minas (MINEM) proyecta un crecimiento del PBI minero del 9% para el conjunto del año 2026, frente al 5.8% de 2025, sustentado en la ampliación de capacidades instaladas y los mayores precios de los metales en los mercados internacionales.

Los precios del zinc en la LME cerraron la semana en US$ 1.42/lb (+3.2% mensual), mientras el cobre se mantiene en US$ 4.71/lb. Los analistas de Citigroup y Goldman Sachs proyectan que el zinc podría alcanzar US$ 1.55/lb en el cuarto trimestre de 2026 ante la reducción de inventarios certificados y la mayor demanda para la industria galvanizadora y de vehículos eléctricos.`,
    analisis: `Los sólidos resultados mineros de mayo refuerzan el escenario de fundamentos macroeconómicos positivos para el sol peruano. El sector minero genera entre el 55% y el 60% de las divisas de exportación del país, y cada mes de producción récord se traduce en mayor oferta de dólares en el mercado local. El precio del zinc sobre US$ 1.40/lb y el cobre sobre US$ 4.70/lb son combinaciones históricamente favorables para la balanza de pagos peruana.

Para inversores y empresas con exposición cambiaria, el dinamismo del sector minero es un indicador estructural positivo para el sol que reduce la probabilidad de una depreciación sostenida por encima de S/ 3.45 en los próximos seis meses. QoriCash ofrece las mejores condiciones para operaciones de cambio de empresas del sector minero.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7984681/pexels-photo-7984681.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g005',
    titulo: 'MEF lanza concurso para segunda fase del puerto de Chancay: inversión privada de US$ 1,200M',
    descripcion: 'El Ministerio de Economía y Finanzas convocó el proceso de selección para la segunda fase de expansión del Puerto de Chancay, que contempla una inversión privada de US$ 1,200 millones e incrementará la capacidad de 1.5 a 3.2 millones de TEU anuales. El hub logístico del Pacífico Sur consolida su posición estratégica a 18 meses de su apertura.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó hoy en El Peruano la convocatoria para la segunda fase de expansión del Terminal Portuario de Chancay, ubicado a 80 kilómetros al norte de Lima y operado por COSCO Shipping Ports Peru S.A. El proceso de selección para la concesión de la fase II requiere una inversión privada de US$ 1,200 millones y se enmarca en el plan de infraestructura portuaria del gobierno para 2026-2030.

La fase II del Puerto de Chancay contempla la construcción de cuatro muelles adicionales con profundidades de 16 a 18 metros, habilitando el atraco de buques Ultra Large Container Vessels (ULCV) con capacidad de hasta 20,000 TEU —los más grandes de la flota mundial. Con la expansión, la capacidad total pasará de 1.5 millones de TEU anuales (fase I, operativa desde noviembre 2024) a 3.2 millones de TEU, consolidando a Chancay como el mayor hub portuario del Pacífico Sur.

El director ejecutivo del MEF, José Tello, señaló que "Chancay está transformando la geografía logística de Sudamérica. Los operadores de carga de Ecuador, Colombia, Chile y Bolivia utilizan ya este puerto como punto de tránsito para exportaciones hacia Asia, generando una demanda sostenida que justifica la inversión de la fase II". La convocatoria establece seis meses para la presentación de propuestas técnicas y económicas.

El impacto económico del Puerto de Chancay en su fase I ya es visible: Ositran reporta que en los primeros cinco meses de 2026 transitaron 312,000 TEU por Chancay, generando ingresos para el Estado por canon portuario de S/ 180 millones. La fase II, en plena operación proyectada para 2029, aportaría S/ 480 millones anuales adicionales al fisco.`,
    analisis: `El avance de la infraestructura portuaria de Chancay tiene un impacto cambiario indirecto pero relevante: incrementa la competitividad exportadora del país, genera mayor atracción de inversión extranjera directa y aumenta el flujo de divisas a largo plazo. Un Perú con mayor infraestructura logística tiene mayor capacidad exportadora y, por ende, mayor soporte estructural para el sol.

Para empresas importadoras que utilizan Chancay como punto de entrada, la expansión portuaria reduce costos logísticos y tiempos de tránsito, mejorando la competitividad. En QoriCash facilitamos operaciones de cambio para el sector de comercio exterior con las mejores condiciones del mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16765239/pexels-photo-16765239.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g006',
    titulo: 'Depósitos bancarios en soles crecen 9.8% en mayo: dolarización cae a 33.8%, mínimo desde 2007',
    descripcion: 'Los depósitos del sistema bancario peruano en moneda nacional crecieron 9.8% interanual en mayo de 2026, alcanzando S/ 284,600 millones, según el BCRP. La dolarización de depósitos cayó al 33.8%, su nivel más bajo desde 2007, reflejando la creciente preferencia del sistema por ahorrar en soles ante la estabilidad cambiaria y tasas atractivas.',
    contenido: `Los depósitos bancarios en soles del sistema financiero peruano alcanzaron S/ 284,600 millones en mayo de 2026, registrando un crecimiento del 9.8% interanual. Este dinamismo refleja la preferencia de ahorristas y tesorerías corporativas por mantener posiciones en moneda local ante la estabilidad cambiaria y la brecha positiva entre las tasas de depósitos en soles (3.8%-6.2% anual a 90-360 días) frente a las equivalentes en dólares (2.4%-4.1%).

La tasa de dolarización de los depósitos continúa su tendencia descendente: cayó al 33.8% en mayo desde el 35.2% de un año antes, el nivel más bajo desde 2007. La reducción de la dolarización es un indicador de mayor confianza en el sol como moneda de reserva de valor, fenómeno que el BCRP ha fomentado con su política de estabilidad cambiaria y tasas de interés reales positivas (inflación 2.9% vs tasa BCRP 4.25%).

La rentabilidad del sistema bancario mejoró en el período: el ROE (Return on Equity) del sector se ubicó en 17.4% en el primer trimestre, frente al 14.8% del mismo período de 2025. La morosidad cayó al 3.7%, su nivel más bajo en cuatro años, mientras el ratio de capital promedio del sistema (Tier 1) se ubica en 15.8%, muy por encima del mínimo regulatorio del 10%. Los bancos BCP, Scotiabank y BBVA Continental reportaron resultados trimestrales por encima de las expectativas.

El crecimiento del crédito de consumo (11.2% interanual en mayo) evidencia la reactivación de los hogares peruanos, impulsada por la mejora del mercado laboral formal y la mayor confianza del consumidor derivada de la estabilidad política post-electoral.`,
    analisis: `La reducción de la dolarización de depósitos al 33.8% y el crecimiento del ahorro en soles son señales de confianza estructural en la moneda local que contribuyen a sostener al sol. Cuando los hogares eligen ahorrar en soles en lugar de dólares, generan demanda de moneda nacional que soporta el tipo de cambio desde el lado financiero. Este proceso es gradual pero consistente en los últimos años.

Para personas naturales con ahorros en dólares que evalúan diversificar hacia instrumentos en soles, las tasas de depósito en moneda local (hasta 6.2% anual a 12 meses en algunas entidades) son competitivas. La primera decisión es cambiar dólares a soles con la mejor tasa: en QoriCash garantizamos el mejor tipo de cambio del mercado local.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32163606/pexels-photo-32163606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g007',
    titulo: 'FOMC sesiona martes y miércoles: pausa esperada al 89% — dotplot y declaraciones Warsh son la clave',
    descripcion: 'El Comité Federal de Mercado Abierto inicia mañana su reunión de junio, con el 89% de probabilidad asignada a una pausa en las tasas según FedWatch de CME. El mercado concentra su atención en el dotplot actualizado y la conferencia de prensa del presidente Kevin Warsh, que definirá el timing del primer recorte del ciclo.',
    contenido: `El Comité Federal de Mercado Abierto (FOMC) de la Reserva Federal inicia mañana martes 17 de junio su reunión de dos días de política monetaria, que concluirá el miércoles 18 con el anuncio de tasas a las 2 PM hora de Nueva York (4 PM Lima). La herramienta FedWatch de CME Group asigna una probabilidad del 89% a que el FOMC mantenga la tasa de fondos federales en el rango 4.25-4.50%, nivel vigente desde diciembre de 2025.

La reunión de junio es de especial relevancia porque el FOMC publicará la actualización del "dotplot" —el diagrama de puntos que muestra las proyecciones de tasa de cada miembro— junto con las nuevas proyecciones macroeconómicas (Summary of Economic Projections). En marzo, el dotplot mostraba dos recortes proyectados para el conjunto del año 2026. Dado el empleo sólido de mayo (227,000 nóminas) y el IPC core en 2.7%, el mercado anticipa que el dotplot podría ajustarse a un solo recorte.

El presidente de la Fed, Kevin Warsh, dará una conferencia de prensa el miércoles a las 2:30 PM. Los operadores analizarán con lupa sus palabras en busca de señales sobre si el primer recorte está condicionado a datos adicionales o si hay preferencia por septiembre vs. diciembre. Una postura más hawkish de Warsh podría llevar el DXY de vuelta a 103.5-104 y presionar al sol a S/ 3.40-3.42.

Las actas del FOMC de mayo publicadas la semana pasada mostraron que varios miembros expresaron preocupación por la persistencia de la inflación de servicios. Este elemento, junto con el dato de empleo fuerte, sugiere que Warsh adoptará un tono cauteloso, sin comprometerse con una fecha concreta para el primer recorte.`,
    analisis: `El FOMC del miércoles es el evento de mayor impacto potencial para el tipo de cambio PEN/USD en las próximas dos semanas. El escenario base (pausa + tono cauteloso de Warsh) es neutral para el sol y mantiene el rango S/ 3.39-3.42. El riesgo al alza para el dólar: un dotplot con menos recortes + Warsh hawkish, que podría llevar el sol a S/ 3.43-3.45.

Para operadores de cambio, la recomendación es cerrar posiciones en dólares necesarias ANTES del anuncio del miércoles para evitar la volatilidad post-FOMC. En QoriCash atendemos operaciones en tiempo real con los mejores spreads del mercado local.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6534073/pexels-photo-6534073.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g008',
    titulo: 'China: producción industrial sube 5.8% en mayo pero manufacturas exportadoras siguen débiles por aranceles Trump',
    descripcion: 'La Oficina Nacional de Estadística de China publicó datos mixtos de mayo: la producción industrial creció 5.8% interanual, superando el consenso de 5.2%, pero el sector manufacturero orientado a exportaciones continúa bajo presión por los aranceles del 104% de la administración Trump. El resultado moderó el impacto sobre la demanda de cobre y materias primas peruanas.',
    contenido: `La Oficina Nacional de Estadística (NBS) de China publicó hoy el reporte de producción industrial de mayo 2026, mostrando un crecimiento del 5.8% interanual, por encima del consenso de 5.2% y del 5.4% de abril. El resultado es positivo para la demanda de materias primas, especialmente metales industriales, pero el desglose sectorial revela que el dinamismo proviene principalmente de energías renovables (paneles solares +14%, turbinas eólicas +22%) y fabricación de semiconductores (+18%), mientras la manufactura exportadora tradicional sigue bajo presión.

Los sub-sectores que más contribuyeron al crecimiento fueron: fabricación de equipos eléctricos (+11.4%), industria química (+7.2%) y metales no ferrosos (+6.8%). En contraste, los sectores de textiles (-2.1%), calzado (-3.8%) y electrónica de consumo (-1.4%) registraron contracciones, reflejando el impacto de los aranceles del 104% que la administración Trump aplicó a bienes chinos desde enero de 2026. Las exportaciones manufactureras chinas cayeron un 4.8% en el acumulado enero-mayo frente al mismo período de 2025.

Para el cobre, el dato de producción industrial es relevante: la demanda china de metales no ferrosos —principalmente cobre para cables eléctricos, motores y transformadores— creció 6.8% en mayo, lo que puede amortiguar el impacto negativo del PMI manufacturero por debajo de 50. Los analistas de Goldman Sachs y Citigroup mantienen su proyección de cobre en US$ 4.60-4.80/lb para el tercer trimestre, con sesgo al alza por la menor oferta minera global.

El gobierno chino anunció nuevas medidas de estímulo: reducciones del IVA para exportadoras afectadas por aranceles y ampliación de líneas de crédito preferenciales del Banco de Desarrollo de China. Los analistas de Morgan Stanley estiman que el estímulo podría añadir 0.3-0.5 puntos porcentuales al crecimiento chino en el segundo semestre de 2026.`,
    analisis: `Los datos mixtos de China generan un escenario moderado para el cobre y otras materias primas peruanas: el crecimiento de la producción industrial es positivo, pero la debilidad manufacturera orientada a exportaciones introduce cautela. Para el sol peruano, el escenario de cobre estable en US$ 4.70/lb es el que mejor sustenta la estabilidad cambiaria en el rango S/ 3.38-3.42.

El riesgo principal es una mayor desaceleración china en el tercer trimestre si los aranceles continúan erosionando la actividad exportadora. Un escenario de cobre por debajo de US$ 4.40/lb es el factor externo de mayor impacto para la estabilidad del sol en el mediano plazo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31047132/pexels-photo-31047132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g009',
    titulo: 'Petróleo WTI sube a US$ 80.2/barril: posible relajación de sanciones a Irán limita el rally de corto plazo',
    descripcion: 'El contrato de futuros del WTI avanza a US$ 80.2 por barril al inicio de la semana, sustentado por la continuidad de recortes OPEP+ y la reducción de inventarios en EE.UU. Sin embargo, reportes de negociaciones entre EE.UU. e Irán para aliviar sanciones petroleras introducen un factor bajista que acota las ganancias adicionales.',
    contenido: `El petróleo West Texas Intermediate (WTI) para entrega en julio cotiza en US$ 80.2 por barril al inicio de la semana, avanzando 2.3% respecto al cierre del viernes (US$ 78.4). El Brent de referencia internacional opera en US$ 83.8. La recuperación del precio responde a la confirmación de que los recortes voluntarios adicionales de Arabia Saudita (500,000 barriles/día) y Rusia (500,000 barriles/día) se extenderán al menos hasta agosto.

Sin embargo, el mercado introduce un factor bajista: reportes del Wall Street Journal y Reuters señalan que representantes del Departamento de Estado de EE.UU. se reunieron en Ginebra la semana pasada con delegados iraníes para explorar una reducción parcial de sanciones petroleras a cambio de compromisos en el programa nuclear. Si se concreta un acuerdo, Irán podría incrementar sus exportaciones en 600,000-800,000 barriles/día, compensando parcialmente los recortes de la OPEP+.

Los inventarios de crudo en EE.UU. reportados por la Energy Information Administration (EIA) mostraron la semana pasada una caída de 3.2 millones de barriles, superior a la esperada (1.8M bbl), señal de que la demanda interna de EE.UU. —que produce 13.4 millones de bbl/día, récord histórico— se mantiene sólida. La temporada de conducción de verano en el hemisferio norte (junio-agosto) genera demanda adicional de gasolina de 200,000-300,000 bbl/día.

En Perú, OSINERGMIN publicó hoy su balance: el precio del galón de gasolina de 90 octanos se redujo S/ 0.10 en algunas regiones gracias al Fondo de Estabilización de Precios de los Combustibles. Si el WTI se mantiene por encima de US$ 80, el FEPC podría reducir su subsidio implícito en la segunda quincena de junio.`,
    analisis: `El petróleo en torno a US$ 80/bbl representa un escenario neutral para la economía peruana: suficientemente alto para generar ingresos de exportación por los lotes petroleros del norte y la selva, pero sin generar presiones inflacionarias que obliguen al BCRP a endurecer su política monetaria. El rango US$ 75-85/bbl es el escenario más cómodo para la economía peruana.

El riesgo al alza (petróleo > US$ 90/bbl) generaría presiones inflacionarias que complicarían el ciclo de recorte de tasas del BCRP. Para empresas con alta exposición a costos de combustible, el contexto actual es una ventana para revisar estrategias de cobertura energética.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407691/pexels-photo-10407691.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g010',
    titulo: 'Oro en US$ 3,385/oz: demanda de bancos centrales asiáticos sostiene precio ante posible fortaleza del dólar post-FOMC',
    descripcion: 'El metal precioso cotiza en US$ 3,385 por onza troy al inicio de la semana, consolidando el rango US$ 3,350-3,420 de las últimas dos semanas. La demanda sostenida de bancos centrales de Asia y el Medio Oriente actúa como soporte ante el posible fortalecimiento del dólar que podría generar el FOMC del miércoles.',
    contenido: `El oro al contado (XAU/USD) cotiza en US$ 3,385 por onza troy en los mercados asiáticos del lunes, consolidando el rango de negociación de las últimas dos semanas (US$ 3,350-3,420). El metal precioso cede levemente respecto a los US$ 3,418 del cierre del viernes ante la leve apreciación del dólar al inicio de semana, pero mantiene su sesgo alcista estructural gracias a la demanda de bancos centrales asiáticos.

El Banco Popular de China publicó la semana pasada su reporte mensual de reservas, confirmando que el banco central incrementó sus tenencias de oro en 8.7 toneladas en mayo —el quinto mes consecutivo de compras netas. Las reservas de oro de China alcanzan ahora las 2,362 toneladas, equivalentes al 9.2% del total de reservas internacionales, en línea con el objetivo de largo plazo de diversificación desde activos en dólares. India también reportó compras de 6.3 toneladas en el período.

El factor de riesgo a corto plazo para el oro es el FOMC del miércoles. Históricamente, un dotplot más hawkish (menos recortes proyectados) fortalece el dólar y genera presión bajista sobre el oro, ya que ambos compiten como activos de reserva. Si el DXY regresa a niveles de 103.5-104, el oro podría retroceder a US$ 3,320-3,340 antes de encontrar soporte en la demanda física de bancos centrales.

Los analistas técnicos de TradingView señalan que el nivel de US$ 3,350 es el soporte clave del oro: por encima de ese nivel, el metal mantiene su tendencia alcista de largo plazo. El nivel de resistencia a corto plazo está en US$ 3,430 y la proyección de Goldman Sachs para el cierre del año se mantiene en US$ 3,500/oz.`,
    analisis: `El oro en US$ 3,380-3,420 tiene un efecto positivo para las finanzas públicas del Perú como sexto productor mundial del metal: cada US$ 100/oz adicionales sobre US$ 3,000/oz genera aproximadamente US$ 220 millones anuales en exportaciones adicionales. Este flujo de divisas contribuye a la oferta de dólares en el mercado local y actúa como soporte estructural para el sol.

Para inversores peruanos que tienen oro físico o participaciones en fondos auríferos denominados en dólares, el tipo de cambio actual en S/ 3.394 es relevante para evaluar el valor en soles de sus posiciones. QoriCash facilita la conversión de dólares provenientes de liquidación de inversiones con el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442322/pexels-photo-8442322.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g011',
    titulo: 'Bitcoin en US$ 103,400: consolidación pre-FOMC — traders aguardan dotplot Fed antes del próximo movimiento',
    descripcion: 'Bitcoin cotiza en US$ 103,400 al inicio de la semana, manteniéndose firmemente por encima del soporte psicológico de US$ 100,000. El mercado cripto muestra baja volatilidad previo al FOMC, con operadores aguardando el dotplot del miércoles para definir si el activo apunta a US$ 110,000 o consolida en el rango actual.',
    contenido: `Bitcoin (BTC/USD) inicia la semana del 15 de junio cotizando en US$ 103,400 en los principales exchanges globales, prácticamente sin cambios respecto al cierre del viernes (US$ 104,280). La volatilidad implícita del activo (medida por el índice DVOL de Deribit) cayó al 42% anualizado, el nivel más bajo en seis semanas, señal de que el mercado espera baja actividad antes del evento macro del miércoles.

Los ETF spot de bitcoin en EE.UU. registraron salidas netas moderadas de USD 180 millones el viernes —el primer día de outflows en dos semanas— que los analistas atribuyen a toma de ganancias táctica previo al FOMC. Sin embargo, el flujo semanal neto de los últimos siete días sigue siendo positivo en USD 1.04 billones, reforzando el sesgo alcista estructural del mercado institucional.

El análisis técnico muestra a Bitcoin en un triángulo de consolidación entre los US$ 100,200 (soporte) y US$ 107,800 (resistencia), formación que típicamente precede un movimiento de ruptura significativo. El RSI diario en 55 y el MACD con histograma positivo sugieren que el sesgo de la ruptura es al alza. Standard Chartered proyecta que un cierre semanal por encima de US$ 108,000 confirmaría el camino hacia US$ 120,000 en el cuarto trimestre.

El mercado de opciones muestra concentración de posiciones abiertas en los niveles de US$ 105,000 y US$ 110,000 para el vencimiento de fin de junio. Un FOMC dovish el miércoles (dotplot con 2 recortes en 2026) podría ser el catalizador que desbloquee la resistencia de US$ 107,800. Un FOMC hawkish podría llevar el activo de vuelta a los US$ 98,000-100,000.`,
    analisis: `La consolidación de Bitcoin en US$ 103,000 refleja la maduración del activo como clase de inversión que reacciona a los mismos catalizadores macroeconómicos que las monedas emergentes y el oro. Para el tipo de cambio PEN/USD, la correlación directa es limitada, pero el contexto de "risk-on" que suele acompañar a un bitcoin fuerte tiende a beneficiar también al sol y otras divisas emergentes.

Para peruanos con posiciones en cripto denominadas en dólares, el tipo de cambio PEN/USD en S/ 3.394 es el factor de conversión para calcular el valor en soles de sus holdings. QoriCash ofrece el mejor tipo de cambio para conversiones de dólares a soles con atención inmediata.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6771008/pexels-photo-6771008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g012',
    titulo: 'DXY retrocede a 102.8 pre-FOMC: mercado descuenta primer recorte Fed en septiembre — sol en S/ 3.394',
    descripcion: 'El índice dólar (DXY) cede a 102.8 puntos al inicio de la semana, retrocediendo desde los máximos de 103.8 del viernes. El mercado consolida la expectativa de que el primer recorte de la Fed llegará en septiembre, lo que configura un DXY moderadamente firme que mantiene al sol en el rango S/ 3.39-3.40 durante la jornada.',
    contenido: `El US Dollar Index (DXY) inicia la semana en 102.8 puntos, retrocediendo 1.0 punto desde el máximo de 103.8 alcanzado el viernes tras el dato de nóminas americanas. La corrección técnica obedece a la toma de posiciones antes del FOMC y al rebalanceo de portafolios institucionales que típicamente ocurre los lunes. El EUR/USD rebota levemente a 1.0855 desde el 1.0820 del cierre del viernes.

Las expectativas del mercado se han estabilizado en torno al escenario de primer recorte Fed en septiembre: FedWatch de CME Group asigna ahora una probabilidad del 62% al primer recorte en septiembre, versus un 12% para julio y un 26% para noviembre. Esta distribución refleja el equilibrio entre el empleo sólido que retrasa los recortes y la desinflación gradual del core CPI que mantiene la expectativa de normalización.

Para el sol peruano, el DXY en el rango 102-104 es compatible con una cotización PEN/USD estable en S/ 3.38-3.42. El diferencial de tasas Perú-EE.UU. (4.25% BCRP vs 4.25-4.50% Fed) es actualmente neutro, lo que significa que el sol no tiene el carry trade como soporte adicional. La estabilidad depende principalmente de los fundamentos reales: precios del cobre, flujos de exportación y reservas internacionales.

La semana ofrecerá además los datos de ventas minoristas de EE.UU. (martes) y las solicitudes de subsidio por desempleo (jueves), que junto con el FOMC del miércoles formarán el cuadro completo de la economía americana para justificar o descartar el recorte de septiembre.`,
    analisis: `Un DXY en 102.8 con sesgo neutro a ligeramente alcista (ante el FOMC hawkish esperado) es el entorno más probable para las próximas dos semanas. Para el sol, esto implica un rango S/ 3.39-3.42 como zona de operación central, con intervenciones del BCRP si el sol tiende a apreciarse hacia S/ 3.37 o a depreciarse hacia S/ 3.45.

Para operaciones de cambio de mediano plazo (pagos o cobros en dólares a 30-60 días), el rango actual es razonable para planificar coberturas. En QoriCash ofrecemos asesoría cambiaria y los mejores tipos de cambio spot para personas y empresas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831251/pexels-photo-5831251.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g013',
    titulo: 'Argentina celebra 6 meses de superávit fiscal: inflación de mayo cae a 3.6%, mínimo de 30 meses',
    descripcion: 'El gobierno argentino confirmó el sexto superávit primario consecutivo de mayo con ARS 2.3 billones, mientras el INDEC reportó que la inflación de mayo desaceleró a 3.6% mensual, su mínimo desde noviembre de 2023. Los bonos soberanos y el riesgo país reflejan optimismo renovado sobre la sostenibilidad del ajuste fiscal de Milei.',
    contenido: `El Ministerio de Economía de Argentina publicó hoy el resultado fiscal de mayo de 2026, confirmando un superávit primario de ARS 2.32 billones (aproximadamente US$ 2,230 millones al tipo de cambio oficial ARS 1,040/USD). El resultado marca el sexto mes consecutivo de equilibrio fiscal bajo la administración Milei, un record sin precedentes en la historia económica reciente del país.

El dato de inflación de mayo fue la otra gran noticia: el INDEC reportó una variación mensual del 3.6%, por debajo del 3.8% de abril y del consenso del 3.9%. En términos interanuales, la inflación alcanza 46.2%, pero la trayectoria mensual descendente consolida las expectativas del gobierno de cerrar el año con inflación mensual inferior al 2%. Los rubros con mayor moderación fueron alimentos y bebidas (2.8% mensual) e indumentaria (2.1%).

El riesgo país (EMBI+) de Argentina cayó 45 puntos básicos durante el fin de semana a 535 puntos básicos, reflejando la mejora de perspectivas macroeconómicas. Los bonos GD30 y AL30 subieron entre 1.8% y 2.4% en los mercados asiáticos del domingo, y el dólar MEP cayó de 1,320 a 1,308 pesos. El FMI aprobó la semana pasada el desembolso de US$ 2.8 billones del siguiente tramo del programa de estabilización.

El ministro de Economía Luis Caputo celebró los resultados señalando que "el ajuste fiscal es sostenible y compatible con una mejora gradual del bienestar". El gobierno enfrenta el desafío electoral del segundo semestre: las elecciones legislativas de octubre 2026 podrían tentar al gobierno a relajar el ajuste para ganar votos, escenario que el FMI observará con cautela.`,
    analisis: `La mejora macro de Argentina, aunque parcial, es una señal positiva para el contexto regional que beneficia indirectamente a Perú. Un Argentina más estable reduce el "riesgo contagio" latinoamericano en mercados globales, facilitando que los flujos de inversión lleguen también a economías sólidas de la región como el Perú. El diferencial de fundamentos entre ambas economías —inflación 2.9% vs 46.2%, reservas en máximos vs negativas— sigue siendo abismal, pero la dirección importa.

Para empresas peruanas con operaciones comerciales en Argentina, la estabilización del tipo de cambio oficial y la lenta recuperación del poder adquisitivo argentino son señales positivas para el comercio bilateral.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g014',
    titulo: 'Colombia: BanRep anticipa pausa en julio — peso colombiano volátil ante FOMC y caída del Brent a US$ 82',
    descripcion: 'Fuentes cercanas al Banco de la República anticipan que la junta directiva mantendrá la tasa en 8.75% en la reunión del 25 de julio, suspendiendo el ciclo de recortes. La decisión respondería a la debilidad del peso colombiano (USD/COP en 4,210) y la caída del Brent a US$ 83.8, que presionan la inflación importada y la cuenta corriente.',
    contenido: `Fuentes cercanas al Banco de la República de Colombia (BanRep) revelaron al diario Portafolio que la junta directiva está inclinada a mantener la tasa de intervención en 8.75% en su próxima reunión del 25 de julio, suspendiendo el ciclo de recortes que llevó la tasa de 13.25% (julio 2024) al nivel actual en 18 meses. La pausa respondería a la combinación de la depreciación del peso colombiano y el posible fortalecimiento del dólar que genere el FOMC de esta semana.

El peso colombiano (USD/COP) opera hoy en 4,210, depreciándose 0.8% respecto al cierre del viernes. La moneda colombiana enfrenta vientos en contra: el petróleo Brent (principal exportación del país) cayó de US$ 96 en mayo a US$ 83.8 actual, reduciendo los ingresos de divisas. El déficit en cuenta corriente de Colombia en el primer trimestre se amplió al 4.3% del PBI, lo que hace al país más vulnerable a salidas de capital en episodios de risk-off global.

La inflación de mayo en Colombia se ubicó en 4.6% interanual, dentro del rango meta del BanRep (2%-4%), pero los analistas señalan que la depreciación del peso puede generar inflación importada que retrase la convergencia al objetivo. Cada 1% de depreciación del COP genera aproximadamente 0.15-0.20 puntos porcentuales adicionales de inflación con un rezago de tres a seis meses. La posible postura hawkish del FOMC del miércoles podría generar una depreciación adicional del COP.

El gobierno del presidente Gustavo Petro ha mantenido fricciones con el BanRep sobre el ritmo de los recortes, argumentando que la política monetaria restrictiva frena el crecimiento económico proyectado en solo 2.1% para 2026. El consenso de mercado sitúa la tasa en 8.00% para fin de 2026 si el contexto externo mejora.`,
    analisis: `La pausa anticipada del BanRep colombiano refleja las tensiones que enfrenta la región ante el posible endurecimiento de la postura Fed y la volatilidad de los commodities. Para el BCRP, el caso colombiano es un marco de referencia: también evalúa cautela ante factores externos similares. Sin embargo, la posición relativa del sol es mucho más sólida: menor déficit externo, reservas más robustas y menor dependencia del petróleo.

Para empresas peruanas con operaciones en Colombia, la volatilidad del COP introduce incertidumbre en la planificación financiera. En QoriCash facilitamos cambios de divisas y asesoría para operaciones en múltiples monedas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676238/pexels-photo-19676238.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g015',
    titulo: 'Chile: BCCh señala condiciones para recorte en septiembre — CLP se fortalece a 888 por dólar impulsado por cobre',
    descripcion: 'Las minutas de la reunión de mayo del Banco Central de Chile publicadas hoy revelan que tres de los cinco directores apoyan un recorte de 25 puntos básicos en septiembre si la inflación converge al 3%. El peso chileno se apreció a 888 por dólar gracias al cobre en US$ 4.71/lb, recuperando terreno desde los 895 del viernes.',
    contenido: `El Banco Central de Chile (BCCh) publicó hoy las minutas de su reunión de mayo, que confirman un debate interno sobre el timing del próximo recorte de la Tasa de Política Monetaria (TPM), actualmente en 5.50%. Tres de los cinco directores expresaron que las condiciones para un recorte de 25 puntos básicos se cumplirían en la reunión de septiembre si la inflación continúa descendiendo hacia el objetivo del 3% (actualmente en 3.9%) y si el tipo de cambio no genera presiones inflacionarias adicionales.

Los otros dos directores del BCCh preferirían esperar más datos antes de comprometerse con septiembre, señalando la incertidumbre del FOMC de esta semana como argumento para la cautela. Si la Fed adopta un tono más hawkish de lo esperado y el dólar se fortalece globalmente, el CLP podría depreciarse y complicar la desinflación chilena, lo que justificaría posponer el recorte al cuarto trimestre de 2026.

El peso chileno (CLP) se aprecia hoy a 888 por dólar, recuperando terreno desde los 895 del cierre del viernes. El catalizador es el rebote del cobre a US$ 4.71/lb en los mercados asiáticos del lunes. Con el CLP en 888, las empresas chilenas que exportan en dólares ven sus ingresos equivalentes en pesos reducirse respecto a hace seis meses (CLP 980/USD en diciembre 2025), aunque los precios del metal compensan parte del impacto.

El FMI y la OCDE publicaron la semana pasada sus perspectivas de crecimiento para Chile: ambos organismos proyectan 2.6% para 2026, por debajo del 3.2% proyectado para el Perú. Chile mantiene ventajas estructurales: regulación financiera sólida, mercado de capitales profundo (fondos AFP con US$ 260 billones en activos) y deuda pública baja (40.2% del PBI). Estas características hacen del CLP una moneda resiliente en episodios de volatilidad global.`,
    analisis: `La fortaleza del CLP en 888 y la postura cautelosa pero abierta del BCCh reflejan un entorno macroeconómico chileno sólido que beneficia a toda la región. Para el sol peruano, la dinámica del cobre —el determinante común de ambas monedas— es el factor más relevante: mientras el metal industrial se mantenga sobre US$ 4.50/lb, tanto el CLP como el PEN tienen sustento estructural para resistir la apreciación del dólar global.

Para peruanos con viajes planificados a Chile o compromisos en pesos chilenos, el tipo de cambio implícito (CLP 888/USD ÷ S/ 3.394/USD ≈ CLP 261.6 por S/ 1.00) es relevante para la planificación. El cambio más eficiente inicia en QoriCash, que ofrece la mejor tasa PEN/USD del mercado.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29032777/pexels-photo-29032777.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },];

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
