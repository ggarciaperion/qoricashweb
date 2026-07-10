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
const HOY = '2026-07-10T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'h001',
    titulo: 'PPI junio EE.UU. +0.1% — por debajo del consenso: corte Fed septiembre sube a 63% y DXY cede a 100.1',
    descripcion: 'El PPI de junio de EE.UU. registró +0.1% mensual y +2.5% anual este viernes 10 de julio, ambos por debajo del consenso (+0.2%/+2.7%). El mercado reaccionó: probabilidad de corte Fed en septiembre salta del 52% al 63% según CME FedWatch. DXY cede a 100.1 y los activos emergentes avanzan.',
    contenido: `El Buró de Estadísticas Laborales (BLS) publicó este viernes 10 de julio el índice de precios al productor (PPI) de junio de 2026: +0.1% mensual y +2.5% interanual, por debajo del consenso de Bloomberg (52 analistas) que esperaba +0.2% mensual y +2.7% interanual. El PPI subyacente excluyendo alimentos y energía registró +0.2% mensual y +2.9% interanual —también por debajo del consenso de +3.1%—. El dato confirma que la desinflación en la cadena de suministro sigue intacta.

La reacción de mercados fue inmediata y significativa: la herramienta CME FedWatch elevó la probabilidad implícita de un recorte de 25bps de la Fed en septiembre del 52% —donde cerró ayer tras las actas FOMC— al 63%, el nivel más alto desde el CPI favorable de mayo. El DXY retrocedió de 100.9 a 100.1, el Nasdaq avanza 0.9%, el S&P 500 sube 0.6% y el Dow gana 0.4%. Los Treasuries a 10 años ceden 6bps a 4.27%, consolidando la tendencia bajista de rendimientos.

El PPI de servicios —componente más relevante para la Fed dado su peso en el PCE— registró +0.1% mensual, la lectura más baja desde enero de 2025. Los servicios de transporte y almacenamiento contribuyeron al dato benigno con -0.3% mensual, reflejo de la normalización de la cadena logística global post-pandemia. El gobernador de la Fed, Christopher Waller, declaró horas después que el dato "es coherente con el progreso hacia el objetivo del 2%".

El próximo catalizador es el PCE (inflación preferida de la Fed) publicado el 31 de julio, días antes de la reunión del FOMC del 29-30 de julio. Si el PCE subyacente confirma la tendencia benigna del PPI y el CPI, el primer recorte de la Fed en cuatro años podría anunciarse en septiembre.`,
    analisis: `Un PPI de +0.1% mensual es la mejor noticia posible para los mercados en este momento: confirma que el proceso de desinflación no se ha detenido y que la Fed tiene margen para recortar tasas sin comprometer su credibilidad. Para el sol peruano, el DXY en 100.1 es el nivel más bajo en lo que va del año —condición directamente favorable para la estabilidad y apreciación del PEN. El escenario base para el Q3 mejora significativamente con este dato.

Para empresas con pagos en dólares planificados para agosto-septiembre, el contexto post-PPI refuerza la hipótesis de que el dólar seguirá debilitándose moderadamente. Para exportadores peruanos que reciben dólares, evaluar la cobertura de la exposición cambiaria ante el riesgo de apreciación adicional del sol. En QoriCash asesoramos a nuestros clientes para tomar las mejores decisiones según su perfil de exposición.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'Sol peruano aprecia a S/ 3.392 post-PPI — DXY en 100.1 y mejor cierre semanal del año: análisis para las próximas dos semanas',
    descripcion: 'El tipo de cambio PEN/USD cae a S/ 3.392 este viernes 10 de julio, reaccionando al PPI benigno de EE.UU. Es el nivel más bajo desde el 15 de enero de 2026. El BCRP intervino con compras de US$ 310M para suavizar la apreciación. Soporte técnico en S/ 3.38; próximo catalizador: PCE del 31 de julio.',
    contenido: `El tipo de cambio PEN/USD opera en S/ 3.392 este viernes 10 de julio —su nivel más bajo desde el 15 de enero de 2026—, apreciándose 0.4% desde el S/ 3.406 del cierre de ayer en reacción directa al PPI benigno de EE.UU. publicado esta mañana. El movimiento del sol es consistente con la dinámica de monedas emergentes: el BRL se aprecia 0.6% (5.03/USD), el CLP gana 0.7% (907/USD) y el COP avanza 0.5% (4,110/USD).

El BCRP intervino esta mañana comprando aproximadamente US$ 310M en el mercado spot para suavizar la velocidad de apreciación, en línea con su política de reducir la volatilidad cambiaria sin defender niveles específicos. Con esta compra, las reservas internacionales del BCRP alcanzan un nuevo récord histórico de US$ 74.4 billones, reforzando la capacidad de intervención del banco central ante episodios de volatilidad futura.

El análisis técnico del PEN/USD muestra una semana de apreciación del 0.4% (desde S/ 3.410 el lunes a S/ 3.392 hoy), la mejor semana del año para el sol. Los niveles técnicos clave: soporte inmediato en S/ 3.38 (MA50 diaria y mínimo de enero 2026), soporte relevante en S/ 3.32 (mínimo histórico 2026), resistencia en S/ 3.42 (MA20 diaria), resistencia secundaria en S/ 3.50 (máximo de mayo).

Para las próximas dos semanas, el escenario base (65% de probabilidad) prevé que el sol opere en el rango S/ 3.38-3.42 mientras el mercado digiere el PPI y aguarda el PCE del 31 de julio. Si el FOMC del 29-30 de julio señala inicio de ciclo bajista, el sol podría perforar S/ 3.38 y apuntar a S/ 3.32-3.35 en agosto.`,
    analisis: `La apreciación del sol a S/ 3.392 tiene fundamento tanto técnico como macroeconómico: el PPI benigno redujo la presión del DXY y el diferencial de tasas BCRP-Fed mantiene atractivo el carry en soles. Para empresas importadoras con pagos en dólares próximos, el nivel actual es históricamente favorable —cercano al soporte de S/ 3.38— para anticipar compras. Para exportadores que convertirán dólares, evaluar cobertura parcial dado que el sol podría apreciarse más si el PCE confirma la desinflación.

El riesgo principal al alza del dólar sería un dato de empleo de julio sorpresivamente fuerte (se publica el 7 de agosto) que cambiara el escenario de recorte. En ese escenario el sol retrocedería hacia S/ 3.44-3.46. En QoriCash ofrecemos el mejor tipo de cambio del mercado con liquidación en minutos.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'BCRP compra US$ 310M para moderar apreciación del sol — reservas alcanzan récord histórico de US$ 74.4B',
    descripcion: 'El Banco Central de Reserva del Perú intervino hoy comprando US$ 310M en el mercado cambiario spot para suavizar la apreciación del sol post-PPI de EE.UU. Las reservas internacionales netas alcanzan un nuevo máximo histórico de US$ 74.4 billones, el nivel más alto en la historia del BCRP.',
    contenido: `El BCRP realizó hoy su mayor intervención de compra de dólares del mes de julio, adquiriendo US$ 310M en el mercado interbancario entre las 9:30 y las 11:00 am (hora Lima) para suavizar la velocidad de apreciación del sol post-PPI de EE.UU. Con esta operación, las reservas internacionales netas del banco central ascienden a US$ 74.4 billones —un nuevo récord histórico y el nivel más alto entre los bancos centrales comparables de la región—.

La intervención fue preventiva y técnica: el BCRP no está defendiendo un nivel específico del tipo de cambio, sino moderando la volatilidad de un movimiento puntual de apreciación. Esta es la cuarta intervención de compra de dólares del mes de julio, con un total acumulado de US$ 1,180M —señal de que el banco central está administrando activamente la acumulación de reservas durante el periodo de mayor flujo agroexportador.

El directorio del BCRP mantiene la tasa de referencia en 4.50%, el mismo nivel de la Fed (4.25%-4.50%). El diferencial de tasas es actualmente de 0-25bps. Si la Fed recorta 25bps en septiembre sin movimiento del BCRP, el diferencial se elevaría a 25-50bps a favor del sol —factor apreciador estructural que el BCRP deberá gestionar en el H2 2026.

Con US$ 74.4B en reservas (31.6% del PBI), el Perú mantiene uno de los colchones de estabilidad más sólidos de América Latina, superando a Colombia (US$ 60B), Chile (US$ 42B) y México (US$ 213B en términos absolutos pero menor como % del PBI).`,
    analisis: `La intervención del BCRP por US$ 310M confirma que el banco central está activo en la gestión del tipo de cambio y que no permitirá apreciaciones bruscas que afecten la competitividad exportadora. Para empresas con necesidades de dólares, la señal es clara: el BCRP tiene capacidad ilimitada de intervención con US$ 74.4B en reservas y lo usará si fuera necesario. El TC seguirá en rango administrado. En QoriCash le ofrecemos la mejor tasa del mercado para sus operaciones cambiarias del día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'Arándanos: julio marca pico de temporada con US$ 285M exportados en la semana del 7 al 11 — récord histórico semanal',
    descripcion: 'La semana del 7 al 11 de julio de 2026 registra un flujo exportador de arándanos peruanos de US$ 285M, el mayor de la historia para una sola semana. La Libertad y Lambayeque concentran el 68% del volumen. El flujo genera presión apreciadora sobre el sol y sostiene el nivel de S/ 3.38-3.42.',
    contenido: `La semana del 7 al 11 de julio de 2026 se perfila como la de mayor exportación de arándanos en la historia del Perú: el flujo estimado de conversión de divisas del sector supera US$ 285M —el mayor semanal desde el inicio de registros sistemáticos del MINCETUR—. Las regiones de La Libertad (38%) y Lambayeque (30%) concentran el 68% del volumen, con las empresas Camposol, Hortifrut-Tal y Inka Fresh liderando los embarques.

Los destinos de la semana son EE.UU. (46% del valor FOB, principalmente Whole Foods, Costco y Walmart), Países Bajos como hub redistributor europeo (25%), y China vía vuelos charter a Shanghai y Guangzhou (17%). El precio promedio de exportación de la semana se ubica en US$ 3.95/kg —por encima del promedio de la temporada de US$ 3.80/kg— gracias a una calidad excepcional del fruto por las condiciones climáticas de La Libertad.

El flujo de conversión de dólares a soles de US$ 285M en una semana equivale a una oferta de divisas de aproximadamente US$ 57M diarios —nivel superior a la demanda habitual del sistema financiero para importaciones y pagos externos—. Este exceso de oferta de dólares es el principal factor que genera presión apreciadora sobre el sol en julio y agosto, y explica en parte por qué el BCRP interviene comprando dólares para evitar una apreciación excesiva.

Las proyecciones de ADEX indican que el pico exportador se extenderá hasta la tercera semana de agosto, con flujos semanales de US$ 240-290M hasta esa fecha. La temporada 2026 cerrará con exportaciones estimadas de US$ 2,300-2,500M —otro récord histórico anual—.`,
    analisis: `El pico agroexportador de arándanos es el ancla estacional más importante del sol entre julio y agosto: US$ 285M semanales de conversión de divisas generan una demanda estructural de soles que sostiene la moneda aun cuando el contexto externo es adverso. Para empresas del sector con costos en soles e ingresos en dólares, el TC actual de S/ 3.39-3.42 es el rango de operación de la temporada. En QoriCash ofrecemos las mejores condiciones para la conversión de divisas agroexportadoras con liquidación en el día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'Tía María: Southern Peru inicia movimiento de tierras en Arequipa — inversión de US$ 1,400M activa la región con 8,500 empleos',
    descripcion: 'Southern Peru Copper Corporation inició esta semana el movimiento de tierras de la primera etapa del proyecto cuprífero Tía María, en La Joya (Arequipa), luego de obtener la licencia de construcción en junio 2026. El proyecto demandará US$ 1,400M en inversión y generará 8,500 empleos directos en su fase de construcción.',
    contenido: `Southern Peru Copper Corporation (SPCC), subsidiaria de Grupo México, inició formalmente el movimiento de tierras de la primera etapa del proyecto minero Tía María en el distrito de La Joya, provincia de Islay, región Arequipa, según comunicó la empresa el miércoles 8 de julio. El inicio de obras llega tras 16 años de gestiones administrativas, estudios de impacto ambiental y diálogo comunitario que culminaron con la aprobación de la licencia de construcción por el MINEM en junio de 2026.

El proyecto contempla la explotación de mineral de cobre de tajo abierto en los yacimientos La Tapada y Tía María, con una capacidad de procesamiento de 120,000 toneladas métricas diarias. La producción anual estimada es de 120,000 TMF de cátodos de cobre de alta pureza. En su plena capacidad (2030), Tía María aportará aproximadamente el 7% de la producción nacional de cobre. El costo C1 estimado es de US$ 2.20/libra, uno de los más competitivos de Sudamérica.

La inversión total del proyecto es de US$ 1,400M, distribuidos en infraestructura minera (US$ 680M), planta de óxidos y SX-EW (US$ 420M) y obras de soporte ambiental incluyendo una planta desalinizadora en el litoral de Islay (US$ 300M). Durante la fase de construcción (2026-2029), el proyecto generará 8,500 empleos directos y 22,000 indirectos. SPCC estima un aporte fiscal de US$ 4,200M en royalties, impuesto a la renta y regalías mineras durante los primeros 15 años de operación.

La gestión social fue determinante para el inicio de obras: SPCC suscribió un convenio con las comunidades de Cocachacra y Punta de Bombón que incluye un fondo de desarrollo local de US$ 85M, capacitación técnica para 1,200 jóvenes de la región y prioridad de empleo local para el 35% de los puestos de trabajo operativos.`,
    analisis: `El inicio de Tía María es una señal de primer orden para el clima de inversión minera en Perú: si un proyecto con 16 años de historia conflictiva puede arrancar, el mensaje al mercado es que el país ha mejorado sustancialmente el entorno de licenciamiento social y ambiental. Esto puede atraer inversión adicional en otros proyectos del pipeline (Yanacocha Sulfuros, La Granja, Michiquillay). Para el tipo de cambio, US$ 1,400M en inversión durante 3-4 años equivalen a un ingreso adicional de divisas de ~US$ 350-400M anuales. En QoriCash asesoramos a proveedores del sector minero para optimizar sus conversiones PEN/USD.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'Refinería La Pampilla logra producción récord de 95,000 barriles diarios en H1 2026 tras modernización por US$ 340M',
    descripcion: 'La Refinería La Pampilla —operada por Repsol en Ventanilla, Lima— alcanzó un promedio histórico de 95,000 barriles por día (bpd) en el H1 2026, su récord productivo tras la modernización de US$ 340M concluida en diciembre 2025. La planta cubre el 42% de la demanda nacional de combustibles derivados del petróleo.',
    contenido: `La Refinería La Pampilla (Relapasa), operada por Repsol en Ventanilla (Callao), alcanzó un promedio de producción de 95,000 barriles por día (bpd) en el primer semestre de 2026, su máximo histórico desde el inicio de operaciones en 1967, según comunicó Repsol al MINEM el 7 de julio. El hito se logra tras concluir en diciembre 2025 la modernización de US$ 340M que actualizó las unidades de destilación atmosférica, hidrotratamiento de naftas y producción de diésel de ultra-bajo azufre (DUBA).

La planta procesa crudos ligeros y medianos provenientes de Ecuador (58%), Colombia (24%) y Perú (18%, Lote 192 y Lote X). En el H1 2026 produjo: diésel DUBA (48% del volumen), gasolinas de 84, 90 y 97 octanos (28%), GLP (12%), kerosene de aviación para el aeropuerto Jorge Chávez (8%) y asfaltos (4%). La cobertura de La Pampilla equivale al 42% de la demanda nacional de derivados del petróleo —el resto lo aporta Petroperú Talara (35%) y las importaciones directas (23%).

La modernización redujo significativamente el contenido de azufre en el diésel producido: de 50 partes por millón (ppm) a menos de 10 ppm, en cumplimiento del Decreto Supremo 010-2017 que entrará en plena vigencia en 2027. Esto mejora la calidad del aire en Lima y cumple con los estándares Euro 5. Las emisiones de CO2 de la planta cayeron 12% respecto a 2024.

El precio de procesamiento (cracking margin) promedio del H1 fue de US$ 8.2 por barril —nivel rentable a los precios actuales del WTI (US$ 73/barril) y con el tipo de cambio en S/ 3.40—. Repsol estima que La Pampilla generará US$ 180M en ingresos por licencias y ventas mayoristas en 2026.`,
    analisis: `Una refinería más eficiente y productiva en el Perú tiene impacto directo en la cadena de precios de combustibles al consumidor: mayor producción local reduce la dependencia de importaciones de derivados y modera la presión inflacionaria en combustibles. Para el tipo de cambio, menos importaciones de combustibles = menos demanda de dólares para pagos al exterior = factor marginalmente apreciador del sol. El contexto es positivo para la estabilidad de precios domésticos y para el costo de transporte que impacta en la logística nacional.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Oro avanza +1.2% a US$ 4,175 post-PPI benigno: DXY débil y expectativas dovish de la Fed impulsan el metal',
    descripcion: 'El oro al contado sube 1.2% a US$ 4,175 por onza este viernes 10 de julio, recuperando terreno tras el dato de PPI de EE.UU. por debajo del consenso. El DXY en 100.1 y la suba de probabilidad de corte de la Fed al 63% para septiembre son los catalizadores. Goldman Sachs mantiene objetivo de US$ 4,500/oz.',
    contenido: `El precio del oro al contado (XAU/USD) avanza 1.2% a US$ 4,175 por onza este viernes 10 de julio, recuperando terreno tras la corrección de US$ 4,130 a US$ 4,128 del jueves. El alza responde directamente al PPI de junio de EE.UU. publicado hoy —+0.1% mensual, por debajo del consenso de +0.2%—, que elevó la probabilidad de recorte de la Fed en septiembre del 52% al 63% y presionó el DXY a 100.1.

La mecánica es directa: DXY más débil → precio del oro más alto (correlación histórica de -0.72). Adicionalmente, la expectativa de tasas de interés reales más bajas en EE.UU. reduce el costo de oportunidad de mantener oro, que no genera rendimiento. El nivel de US$ 4,175 sitúa al metal a tan solo US$ 45 del récord histórico de US$ 4,220/oz marcado el 2 de junio de 2026.

Goldman Sachs reiteró hoy su precio objetivo de US$ 4,500/oz para diciembre de 2026, sustentado en tres pilares: (1) compras récord de bancos centrales emergentes —China, India, Polonia, Turquía sumaron 290 toneladas en Q2 2026—; (2) expectativa de inicio de ciclo bajista de la Fed; (3) flujos de ETFs de oro que acumulan US$ 14.2B en inflows en lo que va del año, incluyendo US$ 1.8B esta semana post-PPI.

Para el Perú, el oro en US$ 4,175 tiene implicación directa en los ingresos de exportación: el país produce aproximadamente 100 toneladas anuales de oro fino (Yanacocha, Lagunas Norte, Shahuindo, Buenaventura). A este precio, el valor de la producción anual supera US$ 13,400M —el mayor de la historia peruana en producción de oro—.`,
    analisis: `El avance del oro a US$ 4,175 confirma que la tendencia alcista de largo plazo está intacta y que el PPI benigno le da un nuevo impulso. Para el sol peruano, mayor precio del oro equivale a más ingresos de exportación y mayor oferta de dólares en el mercado cambiario —factor de soporte para la moneda. La perspectiva para H2 2026 es positiva: si la Fed recorta en septiembre, el DXY cedería adicionalmente y el oro podría acercarse a US$ 4,500. El momento para convertir dólares de exportación minera es favorecer el sol a los niveles actuales de S/ 3.39-3.42.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'WTI rebota +1.1% a US$ 73.50: PPI favorable mejora apetito de riesgo — OPEP+ mantiene disciplina de producción',
    descripcion: 'El petróleo WTI avanza 1.1% a US$ 73.50 por barril este viernes 10 de julio, revirtiendo parcialmente la caída de ayer (-1.09%). El rebote responde a la mejora del apetito de riesgo global post-PPI benigno. La OPEP+ reitera su compromiso de recortes y el Brent avanza a US$ 75.80.',
    contenido: `El petróleo West Texas Intermediate (WTI) cotiza a US$ 73.50 por barril este viernes 10 de julio, avanzando 1.1% desde el cierre de US$ 72.72 del jueves y revirtiendo parcialmente la corrección de ayer. El Brent también avanza 1.0% a US$ 75.80/barril, con el diferencial Brent-WTI estable en US$ 2.30.

El rebote responde principalmente a la mejora del apetito de riesgo global tras el PPI benigno de EE.UU.: cuando los mercados de acciones suben (S&P +0.6%, Nasdaq +0.9%) y el DXY cede, el petróleo suele acompañar el movimiento al alza por la combinación de menor costo de oportunidad del crudo y mayor demanda esperada ante menor riesgo de recesión.

El soporte fundamental proviene de la OPEP+: el secretario general Haitham Al-Ghais reiteró hoy que el cartel mantiene su compromiso de los recortes voluntarios de 2.2 mbpd hasta finales de 2026. Arabia Saudita mantiene sus recortes voluntarios adicionales de 1.0 mbpd. El precio de equilibrio fiscal de Arabia Saudita (breakeven) es de aproximadamente US$ 90/barril, por lo que el cartel tiene incentivos fuertes para defender los precios actuales.

El análisis técnico muestra que el WTI encontró soporte en US$ 72.50 (zona de demanda histórica) y la recuperación de US$ 73.50 lo devuelve al rango de consolidación de las últimas tres semanas (US$ 72.50-US$ 76.00). Si el WTI supera US$ 76, el siguiente objetivo sería US$ 78-80 (proyección para Q3 2026 de Goldman Sachs).`,
    analisis: `El WTI en US$ 73.50 sigue en un rango favorable para el Perú: por debajo de US$ 75-80/barril, los costos de importación de combustibles son manejables para la economía doméstica y la inflación permanece bajo control. Para el tipo de cambio, un WTI estable implica que la demanda de dólares para importaciones energéticas no aumenta —factor neutral a marginalmente positivo para el sol. Si el WTI rebota hacia US$ 80+, podría haber presión adicional de importaciones que demanden más dólares. En QoriCash monitoreamos el precio del crudo como variable complementaria al análisis del TC PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'Cobre LME +0.8% a US$ 4.68/libra: PPI benigno de EE.UU. y señales de estímulo del PBOC impulsan el metal rojo',
    descripcion: 'El cobre en el LME avanza 0.8% a US$ 4.68/libra (US$ 10,317/tonelada) este viernes 10 de julio. El impulso viene del PPI benigno de EE.UU. —que mejora las perspectivas de demanda global— y de señales del Banco Popular de China (PBOC) sobre posibles herramientas de liquidez adicionales en el Q3 2026.',
    contenido: `El cobre a tres meses en el London Metal Exchange (LME) avanza 0.8% a US$ 4.68/libra (US$ 10,317/tonelada) este viernes 10 de julio, cotizando en su nivel más alto en dos semanas. El metal rojo se beneficia de la confluencia de dos catalizadores: el PPI benigno de EE.UU. que mejora el apetito de riesgo global, y las señales del PBOC de posibles medidas de estímulo monetario para el Q3 2026 si el crecimiento muestra señales de desaceleración.

La demanda física de cobre sigue sólida: los stocks certificados en los almacenes del LME cayeron 28,500 toneladas en la semana al 9 de julio —su mayor reducción semanal desde febrero— señal de demanda activa de compradores industriales en Asia. Los inventarios del Shanghai Futures Exchange (SHFE) también retrocedieron 12,000 toneladas, confirmando que la demanda china, aunque moderada, sigue absorbiendo el metal disponible.

Para el Perú, el cobre en US$ 4.68/libra es muy relevante: el país exporta aproximadamente 2.8-3.0 millones de TMF anuales (25-26% de la producción mundial). A este precio, el valor de la exportación anual se aproxima a US$ 29,000-30,000M —el 48% del total de exportaciones peruanas y el mayor ingreso de divisas del país—. Antamina, Cerro Verde, Quellaveco y Las Bambas son los principales contribuyentes.

El nivel de US$ 4.68/libra está por encima del costo de producción C1 de todas las grandes operaciones peruanas (US$ 1.80-2.50/libra) garantizando márgenes operativos sólidos. Si el PBOC reduce el RRR en julio o agosto —como especula el mercado— el cobre podría avanzar hacia US$ 4.80-4.90/libra.`,
    analisis: `El cobre en US$ 4.68/libra representa un precio muy favorable para las finanzas públicas y la balanza de pagos del Perú. Para el sol peruano, mayor precio del cobre = más ingresos de exportación = más oferta de dólares en el mercado spot = soporte para el PEN. La correlación histórica entre el precio del cobre y la fortaleza del sol es positiva. El escenario de estímulos adicionales del PBOC en Q3 es el catalizador más importante a monitorear para el cobre en las próximas semanas. En QoriCash estamos al tanto de estos movimientos para ofrecerle siempre el mejor tipo de cambio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'Bitcoin +2.1% a US$ 64,200 post-PPI: apetito de riesgo mejora y ETFs acumulan US$ 420M en entradas netas en el día',
    descripcion: 'Bitcoin avanza 2.1% a US$ 64,200 este viernes 10 de julio, su mejor jornada en dos semanas. El catalizador es el PPI benigno de EE.UU. que mejoró el apetito de riesgo global. Los ETFs spot de Bitcoin en EE.UU. registraron entradas netas de US$ 420M solo hoy, el mayor flujo desde la semana del 30 de junio.',
    contenido: `Bitcoin (BTC) cotiza a US$ 64,200 este viernes 10 de julio, avanzando 2.1% desde el US$ 62,872 del cierre de ayer y marcando su mejor jornada en dos semanas. El movimiento sigue la mejora del apetito de riesgo global tras el PPI benigno de EE.UU.: el Nasdaq avanza 0.9% y los activos de riesgo en general reaccionan positivamente. La correlación BTC-Nasdaq de 30 días se mantiene en 0.71.

Los ETFs spot de Bitcoin en EE.UU. registraron entradas netas de US$ 420M solo en el día de hoy —el mayor flujo diario desde el 30 de junio—. El iShares Bitcoin Trust de BlackRock lideró con US$ 195M de inflows, seguido del Fidelity Wise Origin Fund (US$ 112M) y el Ark 21Shares Bitcoin ETF (US$ 87M). El total de activos bajo manejo (AUM) de los ETFs Bitcoin en EE.UU. supera ya US$ 116B.

El análisis técnico muestra que Bitcoin ha recuperado el soporte de US$ 63,500 (MA10 diaria) y apunta hacia la resistencia de US$ 65,500 (MA50 diaria). El RSI en 14 periodos subió de 48 a 54, saliendo de la zona neutral hacia territorio más constructivo. El siguiente nivel clave al alza es US$ 68,000 (máximo del 22 de junio) y la zona psicológica de US$ 70,000.

El factor macro dominante para el corto plazo sigue siendo el timing del primer recorte de la Fed: históricamente, en los 60 días siguientes al primer recorte de un ciclo, el BTC ha subido entre 25% y 45%. Si la probabilidad de corte en septiembre sigue subiendo (hoy en 63%), el mercado comenzará a "pricear" esa liquidez adicional en los activos de mayor riesgo, con el BTC como uno de los principales beneficiarios.`,
    analisis: `Bitcoin en US$ 64,200 está en zona de acumulación técnica: los grandes inversores institucionales (ETFs, fondos de pensiones) siguen aumentando exposición a pesar de la volatilidad de corto plazo. Para el mercado cambiario peruano, un rally de Bitcoin y activos cripto suele coincidir con mayor apetito de riesgo global, lo que presiona el DXY a la baja y favorece las monedas emergentes como el sol. Monitorear el nivel de US$ 65,500 como señal de continuación. Si lo supera con volumen, el BTC podría atacar los US$ 68,000-70,000 en julio. El entorno post-PPI es positivo para los activos de riesgo en general.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14902679/pexels-photo-14902679.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'DXY cierra la semana en 100.1 — análisis técnico: tres escenarios para el PEN/USD en las próximas dos semanas',
    descripcion: 'El índice del dólar DXY cierra la semana del 7 al 11 de julio en 100.1 puntos, su nivel más bajo desde enero 2026. El PPI benigno de hoy fue el catalizador definitivo. TradingView analiza los tres escenarios técnicos para el tipo de cambio PEN/USD hasta el FOMC del 29-30 de julio.',
    contenido: `El índice del dólar (DXY) cierra la semana del 7 al 11 de julio de 2026 en 100.1 puntos, retrocediendo 0.8% en la semana y marcando su nivel más bajo desde el 15 de enero de 2026. El catalizador definitivo de la sesión de hoy fue el PPI de junio (+0.1% mensual, por debajo del consenso), que elevó la probabilidad de recorte de la Fed en septiembre al 63%. El DXY ha perdido 1.8% en las últimas dos semanas, desde los 101.9 del cierre del 27 de junio.

El análisis técnico del DXY muestra tres escenarios para las próximas dos semanas (hasta el FOMC del 29-30 de julio):

**Escenario bajista para el dólar (35% de probabilidad):** DXY perfora el soporte de 99.5 (mínimo de enero 2026). Se activaría si las solicitudes de desempleo de la próxima semana superan 240,000 y/o el PCE del 31 de julio sale por debajo del 3.0% subyacente. El sol se apreciaría hacia S/ 3.35-3.38 y el BCRP compraría dólares activamente.

**Escenario base (55% de probabilidad):** DXY fluctúa entre 99.5 y 101.5 mientras el mercado espera el FOMC y el PCE del 31 de julio. El sol opera en el rango S/ 3.38-3.42. El BCRP mantiene intervenciones moderadas de compra de US$ 200-400M semanales.

**Escenario alcista para el dólar (10% de probabilidad):** DXY rebota hacia 102-103 si un dato de empleo o actividad sorprende fuertemente al alza. El sol retrocedería hacia S/ 3.44-3.46. Este escenario tiene baja probabilidad dado el contexto post-PPI.

El catalizador más importante de las próximas dos semanas es el PCE subyacente del 31 de julio (un día antes del FOMC). Si confirma la tendencia desinflacionaria del CPI (+2.9% a/a) y el PPI (+2.5% a/a), el primer recorte de la Fed en cuatro años quedaría casi asegurado para septiembre.`,
    analisis: `El DXY en 100.1 al cierre de la semana es la mejor señal técnica para el sol en lo que va de 2026: el dólar ha perdido el nivel psicológico y técnico de 101.0 y se acerca al soporte de largo plazo de 99.5. Para empresas con necesidades de comprar dólares en las próximas 2 semanas, el rango S/ 3.38-3.42 es históricamente favorable —cercano al soporte—. Para exportadores que venderán dólares, considerar que si el PCE del 31 confirma desinflación, el sol podría apreciarse adicionalmente hacia S/ 3.35-3.38 en agosto. En QoriCash le asesoramos para optimizar el timing de sus operaciones cambiarias.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31738798/pexels-photo-31738798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'S&P Merval +2.3% y bonos argentinos al alza: PPI benigno de EE.UU. impulsa activos emergentes de LATAM',
    descripcion: 'El índice bursátil S&P Merval de Buenos Aires avanza 2.3% este viernes 10 de julio, alcanzando un nuevo máximo histórico. Los bonos soberanos argentinos (GD30, GD35) suben hasta 1.8% en precio. El riesgo país (EMBI) de Argentina cae 45bps a 612bps. El PPI benigno de EE.UU. mejora el apetito por activos emergentes.',
    contenido: `El S&P Merval, índice de referencia de la Bolsa de Valores de Buenos Aires, avanza 2.3% este viernes 10 de julio y alcanza un nuevo máximo histórico en términos nominales en pesos. En términos de dólares (medido en CCL), el Merval sube 1.8%. Las acciones líderes: Banco Macro (+3.8%), YPF (+3.2%), Loma Negra (+2.9%) y Pampa Energía (+2.5%) lideran los avances en el sector financiero y energético.

Los bonos soberanos argentinos en dólares (hard currency) también suben: GD30 +1.4%, GD35 +1.8%, GD41 +1.2%. El riesgo país (EMBI Argentina) cae 45bps hasta 612bps —el nivel más bajo desde el inicio del programa de Milei en diciembre de 2023, aunque todavía muy por encima del grado de inversión—. El catalizador es el PPI benigno de EE.UU.: cuando la Fed se acerca a un ciclo de recortes, los activos de mayor riesgo (emergentes, deuda soberana EM) tienden a comprimir spreads.

El contexto macro de Argentina sigue siendo favorable en relación a los últimos años: superávit fiscal por octavo mes consecutivo en junio, inflación mensual en 3.1% (menor nivel en 36 meses), reservas del BCRA superando US$ 35B y tipo de cambio oficial en CTS 1,285/USD bajo el esquema de flotación con bandas. El FMI desembolsó su cuarto tramo por US$ 3.2B el 2 de julio tras la revisión trimestral que confirmó cumplimiento de metas.

Para inversores institucionales internacionales, Argentina ofrece un "carry" atractivo en dólares: los bonos GD30 y GD35 rinden entre 8.5% y 9.2% anual en dólares, frente a los Treasuries de EE.UU. a 10 años en 4.27%. El diferencial de 420-490bps compensa parcialmente el riesgo soberano. El próximo catalizador para los bonos argentinos es la reunión del FMI en septiembre, donde se revisará el programa.`,
    analisis: `La performance positiva del Merval y los bonos argentinos en la semana refleja que el mercado va reconociendo los avances del programa Milei, aunque con cautela. Para el contexto regional, una Argentina más estable reduce el "ruido" de riesgo en LATAM que podría afectar marginalmente la percepción de otras monedas de la región, incluido el sol. El efecto sobre el PEN/USD es indirecto: menor prima de riesgo regional → mayor demanda de activos emergentes → flujos hacia soles en el margen. Impacto positivo pero no determinante para el TC peruano.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15574935/pexels-photo-15574935.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina: reservas BCRA superan US$ 35B por primera vez desde 2019 — FMI desembolsa US$ 3.2B en revisión de julio',
    descripcion: 'El Banco Central de la República Argentina (BCRA) reportó reservas internacionales brutas de US$ 35.1B al 9 de julio, el nivel más alto desde octubre de 2019. El FMI completó su cuarta revisión del programa EFF y aprobó el desembolso de US$ 3.2B. El peso oficial cierra en 1,285 ARS/USD dentro de las bandas.',
    contenido: `El BCRA informó que las reservas internacionales brutas alcanzaron US$ 35.1B al cierre del 9 de julio de 2026, superando por primera vez desde octubre de 2019 el umbral de US$ 35B. El incremento de US$ 2.8B en el mes de julio responde al desembolso del FMI (US$ 3.2B) y a las compras netas del BCRA en el mercado de cambios ($680M desde el 1 de julio), parcialmente compensadas por pagos de deuda externa.

El Directorio del FMI completó el 2 de julio la cuarta revisión del Acuerdo de Facilidades Extendidas (EFF) suscrito con Argentina y aprobó el desembolso de US$ 3.2B —el cuarto tramo de los US$ 20B comprometidos en el acuerdo de diciembre de 2023—. La revisión confirmó que Argentina cumplió todas las metas cuantitativas del programa: superávit fiscal primario (US$ 6.8B acumulado en H1 2026), reducción del déficit cuasifiscal del BCRA, y reservas brutas por encima del umbral mínimo acordado.

El Directorio del FMI destacó "el notable ajuste fiscal logrado sin precedentes en la historia Argentina" y reconoció que "la inflación ha bajado significativamente aunque sigue siendo elevada". La próxima revisión es en octubre, donde se definirá si Argentina puede acceder a la siguiente cuota del programa. El mercado anticipa el acceso sin inconvenientes.

El tipo de cambio oficial cerró en 1,285 ARS/USD el 9 de julio, dentro del esquema de flotación administrada con bandas ($1,000-$1,400 actualizadas en junio). La brecha con el dólar blue (1,298 ARS/USD) se mantiene en el 1.0% histórico mínimo del gobierno actual, señal de que el mercado confía en la sostenibilidad del esquema cambiario.`,
    analisis: `Argentina con US$ 35.1B en reservas y el programa FMI en curso es una fotografía macroeconómica impensable hace solo 24 meses. Para el contexto regional, la mejora de percepción de Argentina reduce el "contagio de riesgo" que afecta a toda América Latina cuando hay episodios de inestabilidad en el país. Para el Perú, un entorno regional más estable facilita que el sol mantenga sus niveles actuales de S/ 3.39-3.42 sin presiones adicionales de aversión al riesgo LATAM. El impacto en PEN/USD es neutral-positivo en el margen.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Colombia: BanRep evalúa segundo recorte en agosto — COP se aprecia a 4,110/USD y economía creció 3.2% en Q1',
    descripcion: 'El Banco de la República de Colombia evalúa un segundo recorte de tasas de 25bps en agosto tras el primer movimiento del 4 de julio a 9.00%. El COP se apreció a 4,110/USD post-PPI de EE.UU. La economía colombiana creció 3.2% en el Q1 2026, por encima del consenso. Inflación junio en 4.0% anual.',
    contenido: `El Banco de la República de Colombia (BanRep) evalúa un segundo recorte de su tasa de referencia de 25bps en su reunión de agosto, luego del primer movimiento del ciclo actual el pasado 4 de julio —de 9.25% a 9.00%—. El gobernador Leonardo Villar declaró el miércoles 8 que "el proceso desinflacionario está consolidado y hay espacio para continuar normalizando la política monetaria", aunque condicionó el ritmo a los próximos datos de inflación.

El peso colombiano (COP) se apreció hoy a 4,110/USD —su nivel más bajo en cuatro meses— beneficiado por la mejora del apetito de riesgo post-PPI de EE.UU. y el rally de activos emergentes. La apreciación del COP desde los 4,420/USD de inicio del mes es del 7.0% en 10 días, uno de los movimientos más rápidos de monedas emergentes. El petróleo Brent en US$ 75.80/barril también provee soporte al COP dado que Colombia exporta aproximadamente 600,000 barriles diarios.

El DANE publicó hoy la segunda estimación del PIB del Q1 2026: crecimiento del 3.2% interanual, por encima del 3.1% de la primera estimación y del consenso (2.9%). Los sectores con mayor dinamismo: construcción (+8.4%), servicios financieros (+6.8%), minería (+5.2%) y agricultura (+4.9%). El consumo privado creció 2.8%, señal de que la reducción de tasas está empezando a impactar la actividad.

Para el H2 2026, el mercado proyecta que el BanRep recortará su tasa hasta 8.00%-8.25% (dos o tres recortes adicionales de 25bps). Con inflación en 4.2% a/a y tasa en 9.00%, la tasa real de Colombia es de aproximadamente 4.8%, la más alta de la región junto a Perú —significativamente restrictiva y con margen amplio de relajación sin comprometer el objetivo de inflación.`,
    analisis: `El ciclo de recortes del BanRep colombiano, junto al inicio anunciado del BCCh en Chile y la expectativa de recorte de la Fed en septiembre, perfilan un ciclo de relajación monetaria coordinado en las Américas para el H2 2026. Para el Perú y el sol, este contexto regional de tasas a la baja favorece los flujos hacia activos de mayor yield relativo, lo que incluye soles. El COP en 4,110/USD implica un tipo de cambio implícito PEN/COP de 1,209 pesos colombianos por sol —relevante para empresas con operaciones binacionales. Impacto en TC PEN/USD: neutral-positivo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Chile: inflación junio confirma 3.0% y BCCh recorta tasas 25bps en agosto — CLP se aprecia a 903/USD en jornada positiva',
    descripcion: 'El INE de Chile confirmó hoy que la inflación de junio 2026 fue del 3.0% interanual —dentro del punto central de la meta del BCCh— y por debajo del 3.2% de mayo. El dato valida el recorte de 25bps en agosto que el Banco Central señaló en sus actas del 3 de julio. El peso chileno (CLP) se aprecia a 903/USD post-PPI de EE.UU.',
    contenido: `El Instituto Nacional de Estadísticas (INE) de Chile confirmó este viernes 10 de julio que el IPC de junio de 2026 registró una variación anual de 3.0% —exactamente en el punto central de la meta del Banco Central de Chile (BCCh) de 2%-4%— y por debajo del 3.2% de mayo. La variación mensual fue de 0.2%, en línea con la estacionalidad histórica de junio. El dato es el nivel más bajo de inflación anual desde octubre de 2021.

El resultado confirma lo que las actas del BCCh del 3 de julio ya anticipaban: "cuatro de los cinco consejeros están inclinados hacia un inicio de la flexibilización monetaria" en la reunión de agosto. El mercado de derivados de tasa (OIS) asigna hoy una probabilidad del 92% a un recorte de 25bps en agosto, llevando la tasa desde 5.00% a 4.75%. El consenso de economistas (Bloomberg survey) proyecta que el BCCh recortará 75bps adicionales hasta finales de 2026, cerrando el año en 4.25%.

El peso chileno (CLP) se apreció hoy con fuerza: desde los 907/USD del cierre de ayer a 903/USD ahora, beneficiado por la confluencia del dato de inflación favorable, el PPI benigno de EE.UU. y el cobre en US$ 4.68/libra (+0.8%). El nivel de 903/USD es el más bajo desde el 10 de marzo de 2026. El tipo de cambio implícito PEN/CLP es de 265 pesos chilenos por sol (903 ÷ 3.40).

Los fundamentos de Chile siguen sólidos: producción de cobre en 5.7M de toneladas proyectadas para 2026, superávit fiscal del 0.4% del PBI en H1 2026 (MEF), y crecimiento del PIB del 2.8% en Q1 2026. El Ministerio de Hacienda de Chile proyecta 3.2% de crecimiento para el año completo, asumiendo inicio de recortes en agosto y cobre sobre US$ 4.50/libra.`,
    analisis: `Chile cumpliendo su meta de inflación del 3.0% y con el BCCh a punto de iniciar recortes es una señal positiva para toda la región: el país más técnico de América Latina está normalizando su política monetaria con éxito, lo que da "licencia" a otros bancos centrales como el BCRP para eventualmente hacer lo mismo. Para el tipo de cambio peruano, un Chile estable con CLP en apreciación reduce el riesgo regional y favorece la estabilidad del sol. El impacto en PEN/USD es neutral-positivo. En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD del mercado para cualquier operación con Chile o el resto de América Latina.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f001',
    titulo: 'Mercados mixtos este jueves post-actas FOMC: S&P +0.09%, Nasdaq +0.74%, Dow -0.92% — mercado dirige foco a jobless claims',
    descripcion: 'Los mercados de EE.UU. abren el jueves 9 de julio con resultado mixto tras la publicación de las actas del FOMC ayer. El S&P 500 avanza 0.09%, el Nasdaq sube 0.74% liderado por tecnología, y el Dow Jones cede 0.92%. El mercado desplaza la atención hacia las solicitudes de desempleo de hoy y el dato de PPI de mañana.',
    contenido: `Los principales índices de Wall Street operan de manera divergente este jueves 9 de julio, jornada que sigue a la publicación de las actas del FOMC de ayer miércoles 8. El S&P 500 avanza levemente a 7,510 puntos (+0.09%), el Nasdaq tecnológico sube 0.74% a 26,010 y el Dow Jones retrocede 0.92% a 52,439, arrastrado por valores industriales y financieros que reaccionan negativamente a las señales hawkish de las actas.

Las actas del FOMC revelaron ayer que la mayoría de miembros del comité considera la política monetaria actual como "suficientemente restrictiva" y ve los riesgos de inflación y empleo "en mejor equilibrio" que en trimestres anteriores, pero divididos sobre el timing exacto del primer recorte. La probabilidad de recorte en septiembre según CME FedWatch cayó de 58% a 52% tras la publicación.

El foco del día en EE.UU. son las solicitudes iniciales de desempleo semanales, publicadas hoy a las 8:30 am ET. Un dato por encima de 225,000 podría reactivar expectativas de recorte y apoyar al Nasdaq. Un dato bajo (por debajo de 210,000) reforzaría el tono hawkish de las actas y presionaría el DXY al alza.

Para el sol peruano, el contexto global de mercados mixtos mantiene el tipo de cambio en el rango S/ 3.40-3.41. El BCRP monitorea activamente con reservas de US$ 74.1B.`,
    analisis: `Los mercados mixtos de hoy reflejan el mensaje ambiguo de las actas FOMC: hawkish para los que esperaban más apertura al recorte, pero sin señal de endurecimiento adicional. Para el TC peruano, el DXY estable en 100.9 es positivo. Las jobless claims de hoy definirán la dirección del mercado en la tarde. En QoriCash atendemos al mejor tipo de cambio disponible.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f002',
    titulo: 'Oro rebota +1.47% a US$ 4,130/oz: actas FOMC no cambian perspectiva de recortes y demanda de cobertura regresa',
    descripcion: 'El precio del oro recupera terreno este jueves 9 de julio, avanzando 1.47% a US$ 4,130 por onza. El rebote se produce tras la corrección de ayer post-CPI y responde a una lectura del mercado que interpreta las actas FOMC como no más hawkish de lo esperado. Goldman Sachs reitera objetivo de US$ 4,500/oz para diciembre 2026.',
    contenido: `El oro (XAU/USD) cotiza a US$ 4,130 por onza este jueves 9 de julio, con un avance de 1.47% que revierte parcialmente la corrección de ayer (-1.53%). El rebote responde a dos factores: (1) las actas del FOMC publicadas ayer no mostraron un tono significativamente más hawkish que el esperado por el consenso; (2) la geopolítica global mantiene activa la demanda estructural de refugio en un contexto de tensiones en el Estrecho de Ormuz.

El movimiento de hoy es técnicamente relevante: el oro recupera el soporte de US$ 4,080 (MA20 diaria) y apunta hacia la resistencia de US$ 4,150 (MA10). El RSI diario regresa a zona neutral en 57, consistente con una tendencia alcista intacta.

Goldman Sachs reiteró su precio objetivo de US$ 4,500/oz para diciembre de 2026, justificado en: (1) compras récord de bancos centrales emergentes (290 toneladas netas en Q2 2026); (2) expectativa de recortes de la Fed en el segundo semestre; (3) dolarización geopolítica de carteras institucionales hacia activos reales.

Para el Perú, el alza del oro tiene implicación directa: las empresas mineras auríferas peruanas (Yanacocha, Lagunas Norte, Shahuindo) mejoran su generación de caja y el país incrementa su ingreso de divisas por exportaciones minerales.`,
    analisis: `El rebote del oro a US$ 4,130 confirma que la tendencia alcista de mediano plazo está intacta. Para el sol peruano, mayor precio del oro equivale a más dólares entrando por exportaciones mineras —soporte al sol. La perspectiva del metal para H2 2026 es positiva bajo el escenario de recortes de la Fed. El contexto favorece mantener o ampliar coberturas en dólares si tiene exposición cambiaria.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f003',
    titulo: 'BCRP: TC interbancario en S/ 3.406 este jueves — equilibrio cambiario persiste pese a volatilidad post-FOMC',
    descripcion: 'El mercado cambiario peruano mantiene el tipo de cambio interbancario en el rango S/ 3.40-3.41 este jueves 9 de julio. El BCRP reportó un TC de S/ 3.406 el martes 7, último dato publicado. La estabilidad se sostiene en flujos agroexportadores, superávit de balanza comercial y reservas en US$ 74.1B.',
    contenido: `El tipo de cambio interbancario en el mercado cambiario peruano opera en el rango S/ 3.40-3.41 este jueves 9 de julio, en línea con el cierre de S/ 3.406 registrado el martes 7 —último dato oficial del BCRP publicado. La estabilidad se extiende pese a la volatilidad global generada por las actas del FOMC de ayer.

Los tres pilares que anclan al sol en este nivel: (1) flujo agroexportador robusto en temporada alta de arándanos y espárragos, con conversión estimada de US$ 140-160 millones semanales; (2) balanza comercial del primer semestre en superávit de US$ 4.2B, con exportaciones mineras y agrícolas sosteniendo el ingreso de divisas; (3) posición de reservas del BCRP en US$ 74.1 billones —el nivel más alto de la historia del banco central peruano.

El BCRP tiene tasa de referencia en 4.50%, en el mismo rango que la Fed (4.25%-4.50%), lo que mantiene el carry trade en equilibrio. Si la Fed recorta 25bps en septiembre sin que el BCRP lo haga simultáneamente, el diferencial aumentaría a favor del sol —factor apreciador.

El TC SUNAT vigente para operaciones de comercio exterior es de S/ 3.411 (venta). En QoriCash ofrecemos tipos de cambio competitivos con atención especializada para empresas y personas naturales.`,
    analisis: `La estabilidad del TC en S/ 3.406 es el resultado de fundamentos macroeconómicos peruanos sólidos que absorben la volatilidad externa post-FOMC. Para empresas con pagos en dólares próximos, el rango actual de S/ 3.40-3.42 es históricamente favorable para comprar dólares. Para quienes reciben dólares, evaluar el impacto de las jobless claims de EE.UU. de hoy como potencial catalizador.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f004',
    titulo: 'Exportaciones de arándano peruano consolidan liderazgo mundial: US$ 1,100M acumulados en temporada 2026 — récord histórico en camino',
    descripcion: 'Las exportaciones peruanas de arándanos avanzan hacia un nuevo récord histórico en la temporada 2026, superando los US$ 1,100 millones acumulados al tercer trimestre. Perú mantiene su posición como primer exportador mundial del fruto, con destinos principales en EE.UU., Países Bajos y China.',
    contenido: `Las exportaciones peruanas de arándanos acumulan más de US$ 1,100 millones en lo que va de 2026, consolidando al Perú como el mayor exportador mundial del fruto por sexto año consecutivo, según datos de la Asociación de Exportadores (Adex). El crecimiento respecto al mismo periodo de 2025 es del 14.3%, impulsado por la expansión de superficie cultivada en La Libertad y mejoras en rendimiento por hectárea.

Los destinos principales son: EE.UU. (38% del valor FOB), Países Bajos como hub europeo (28%), China (21%) —que ha triplicado sus importaciones en dos años— y el Reino Unido (8%). El precio promedio FOB se ubica en US$ 3.80/kg, por encima del promedio histórico de US$ 3.50/kg, gracias a mayor participación de categorías premium.

Las principales empresas exportadoras son Camposol, Hortifrut-Tal, Inka Fresh y Grupo Rocío. La cadena de frío y la logística aeroportuaria de Lima han sido reforzadas para manejar el volumen récord, con inversiones de US$ 85M en infraestructura de almacenamiento frigorífico en los últimos 18 meses.

El sector agroexportador en su conjunto aporta US$ 9.2B en divisas anuales, el tercer mayor ingreso de divisas del país detrás de la minería y las remesas.`,
    analisis: `Las exportaciones récord de arándanos son un motor de entrada de dólares que apoya la estabilidad del sol peruano. Para empresas del sector con costos en soles e ingresos en dólares, el TC actual de S/ 3.406 representa un nivel razonable. La aceleración del flujo exportador en julio-agosto es un factor que presionará al sol a apreciarse. Contacte a QoriCash para gestionar sus conversiones de divisas agroexportadoras.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f005',
    titulo: 'MEF proyecta déficit fiscal de 2.1% del PBI en 2026 — el más bajo desde 2015, respaldado por ingresos mineros y austeridad',
    descripcion: 'El Ministerio de Economía y Finanzas actualizó sus proyecciones fiscales para 2026, estimando un déficit del 2.1% del PBI —la cifra más baja en once años. La mejora responde a mayores ingresos tributarios del sector minero y eficiencia en recaudación de la SUNAT. La deuda pública se estabiliza en 34% del PBI.',
    contenido: `El MEF proyecta un déficit fiscal del 2.1% del PBI para 2026, el nivel más bajo desde 2015 y por debajo del límite legal del 3.0% del PBI. La mejora de 0.9 puntos porcentuales respecto al 3.0% de 2025 responde a tres factores convergentes.

Primero, los ingresos tributarios del sector minero superaron las proyecciones: las empresas abonaron S/ 8.4B en impuesto a la renta en el primer semestre, beneficiadas por precios récord del oro (US$ 3,900-4,130/oz). Segundo, la SUNAT intensificó la fiscalización: la brecha de cumplimiento tributario se redujo del 38% al 33% del potencial recaudatorio. Tercero, el gobierno mantuvo austeridad en gasto corriente.

La deuda pública bruta se estabiliza en 34% del PBI, manteniendo el grado de inversión de Perú en S&P (BBB+), Moody's (Baa1) y Fitch (BBB+) —el nivel más alto de la región junto con Chile.

El MEF proyecta crecimiento del PBI del 3.2% para 2026, por encima del consenso de analistas privados (2.8%).`,
    analisis: `Un déficit fiscal del 2.1% del PBI es una señal de salud macroeconómica que refuerza la confianza de inversores extranjeros y reduce la prima de riesgo país. Para el sol, una mejor posición fiscal implica menor necesidad de financiamiento externo y mayor credibilidad del BCRP para manejar el TC. Contexto favorable para operaciones cambiarias en el rango actual.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f006',
    titulo: 'Sector construcción Perú crece 5.8% en mayo 2026: inversión privada en infraestructura y vivienda social impulsan el avance',
    descripcion: 'El sector construcción peruano registró un crecimiento del 5.8% anual en mayo 2026, el cuarto mes consecutivo de expansión, según el INEI. El avance es impulsado por obras privadas de infraestructura logística, proyectos del Fondo MiVivienda y expansión de centros de datos. El consumo de cemento subió 6.1%.',
    contenido: `El INEI reportó que el sector construcción creció 5.8% anual en mayo de 2026, superando las estimaciones del consenso (4.5%). Este es el cuarto mes consecutivo de expansión y el mayor ritmo de crecimiento desde enero 2024.

El dinamismo proviene de: (1) galpones logísticos y centros de distribución e-commerce (+12.3% a/a), impulsados por el nearshoring regional hacia Lima; (2) proyectos del Fondo MiVivienda, con 18,400 unidades en construcción activa; (3) infraestructura de telecomunicaciones y data centers para multinacionales.

El consumo interno de cemento creció 6.1%, con ventas de 1.18 millones de toneladas. Las líderes (Cementos Lima, Yura, UNACEM) reportaron márgenes estables pese al alza del costo energético.

El avance físico de obras públicas mejoró: el gobierno regional de Lima ejecutó el 42% de su presupuesto de inversión al mes de mayo, frente al 31% en el mismo mes de 2025.`,
    analisis: `Un sector construcción creciendo al 5.8% genera demanda activa de soles (para pagar planillas y materiales), lo que apoya la estabilidad del TC. Para empresas del sector con importaciones de acero o maquinaria, el TC actual de S/ 3.40-3.41 es favorable para cubrir las próximas compras de dólares.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f007',
    titulo: 'Actas FOMC: mayoría ve política "suficientemente restrictiva" pero divididos sobre septiembre — probabilidad de recorte cae a 52%',
    descripcion: 'Las actas del FOMC publicadas ayer miércoles 8 revelaron que la mayoría de miembros considera la política monetaria actual como "suficientemente restrictiva". El comité está dividido sobre si actuar en septiembre o esperar a noviembre. La probabilidad de recorte en septiembre según CME FedWatch cayó de 58% a 52%.',
    contenido: `Las actas de la reunión del FOMC del 17-18 de junio de 2026, publicadas ayer a las 2:00 pm ET, confirmaron el mensaje de cautela de la Fed: la "gran mayoría" de miembros considera que la política en el rango 4.25%-4.50% es "suficientemente restrictiva", pero hay "diferencias significativas" respecto al timing del primer recorte.

Puntos clave: (1) "varios miembros" señalaron que podrían apoyar una reducción de tasas si los próximos dos datos de empleo y un dato adicional de inflación confirman la tendencia; (2) "algunos miembros" prefieren esperar hasta noviembre; (3) ningún miembro menciona la posibilidad de subir tasas; (4) la Fed revisó al alza su estimación de crecimiento del PBI a 2.1% para 2026.

El DXY reaccionó subiendo de 100.7 a 101.0 tras la publicación, estabilizándose en 100.9 esta mañana. Los Treasuries a 10 años subieron 5bps a 4.33%.

El próximo catalizador para la Fed es el PPI (inflación al productor) de EE.UU. que se publica mañana viernes 10 de julio, seguido del FOMC del 29-30 de julio.`,
    analisis: `Las actas FOMC confirman el escenario base: no hay apuro para recortar pero tampoco riesgo de subas. Para el TC peruano, el DXY estable en 100.9 mantiene el sol en S/ 3.40-3.41. Si el PPI de mañana es benigno, la probabilidad de recorte en septiembre podría regresar a 55-58%, presionando el DXY a la baja y apoyando al sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f008',
    titulo: 'WTI cae -1.09% a US$ 72.72: inventarios EIA superan estimaciones y compensan tensiones geopolíticas en Ormuz',
    descripcion: 'El petróleo WTI retrocede 1.09% a US$ 72.72 por barril este jueves 9 de julio. Los inventarios semanales EIA mostraron un incremento de 3.2 millones de barriles —muy por encima del consenso de -0.8 millones— señal de demanda más débil de lo esperado. Las tensiones en el Estrecho de Ormuz se moderan.',
    contenido: `El WTI retrocede 1.09% a US$ 72.72 este jueves 9, revirtiendo parte del alza de ayer (+4.83%). La corrección se explica por el informe semanal de inventarios EIA, que mostró un incremento de 3.2 millones de barriles —muy por encima de la estimación de consenso de -0.8 millones— señal de que la demanda de combustibles en EE.UU. está por debajo de lo esperado.

El Brent cede en paralelo a US$ 74.80 (-1.1%). Los inventarios en Cushing, Oklahoma —hub de entrega física del WTI— subieron por segunda semana consecutiva.

Las tensiones en el Estrecho de Ormuz se moderan: el Pentágono confirmó que los incidentes del martes correspondían a "actividades de vigilancia de rutina" y no a interrupciones activas. Los mercados descuentan que el riesgo geopolítico de corto plazo es menor al inicialmente percibido.

La OPEP+ mantiene sus recortes voluntarios de 2.2 mbpd hasta finales de 2026, proveyendo un piso al precio. Goldman Sachs estima el WTI en US$ 75-80/barril para Q3 2026.`,
    analisis: `El WTI en US$ 72.72 es positivo para los costos de importación peruanos de combustibles. Para el sol peruano, un WTI más bajo implica menor demanda de dólares para importaciones energéticas —factor marginalmente apreciador. Sin embargo, el efecto sobre el TC es pequeño en el corto plazo dado el rezago de 2-3 semanas en el ajuste de precios domésticos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f009',
    titulo: 'China PMI manufactura junio en 49.8: segundo mes de contracción leve — débil demanda de exportación preocupa al mercado',
    descripcion: 'El PMI manufacturero oficial de China para junio de 2026 cerró en 49.8 puntos —por segundo mes consecutivo por debajo del umbral de 50. La debilidad se concentra en nuevos pedidos de exportación (47.2) e inventarios (45.1). El PMI de servicios se mantiene en expansión (52.4).',
    contenido: `El PMI manufacturero oficial de China para junio de 2026 se ubica en 49.8 puntos, por debajo del umbral de 50 por segundo mes consecutivo y en línea con el consenso (49.9). El dato confirma la fragilidad del sector manufacturero chino en un contexto de demanda externa moderada y aranceles de EE.UU.

El sub-índice más preocupante es el de nuevos pedidos de exportación: cayó a 47.2 —su nivel más bajo en seis meses— reflejando la reducción de órdenes de compradores en EE.UU. y Europa. Los inventarios de productos terminados también se contrajeron (45.1), lo que sugiere reducción de producción ante stock sin demanda.

El PMI de servicios se mantiene sólido en 52.4, impulsado por turismo doméstico, servicios financieros y tecnología de consumo. Esta dicotomía manufacturero-servicios es consistente con el proceso de rebalanceo de China hacia el consumo interno.

Para Perú, un PMI manufacturero chino débil tiene implicaciones para las exportaciones de materias primas: China es el principal comprador de cobre peruano (45% de las exportaciones) y de concentrados de zinc y plomo.`,
    analisis: `Un PMI manufacturero chino de 49.8 es un riesgo de cola para el cobre y, por extensión, para el sol peruano. Si China emite estímulos fiscales o monetarios —como se especula para el Q3— los precios del cobre podrían repuntar hacia US$ 4.80/lb, positivo para las exportaciones y el ingreso de divisas de Perú. Monitorear la política del Banco Popular de China en las próximas semanas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f010',
    titulo: 'DXY en 100.9 post-actas FOMC: tres escenarios para el tipo de cambio PEN/USD según evolución del dólar en Q3',
    descripcion: 'El índice del dólar (DXY) se estabiliza en 100.9 este jueves 9. Si el DXY supera 102, el sol podría presionarse hacia S/ 3.44-3.46; si cede a 99, el sol se apreciaría a S/ 3.38-3.40. TradingView analiza los tres escenarios para el Q3 2026 tras las actas FOMC y con el PPI de EE.UU. mañana.',
    contenido: `El DXY cotiza en 100.9 este jueves 9 de julio, con una leve caída de 0.15% que refleja la interpretación moderada del mercado de las actas FOMC de ayer. El nivel actual define tres escenarios técnicos para los próximos 30-45 días.

Escenario alcista para el dólar (DXY 102-104): Se activaría si el PPI de mañana sorprende al alza, si las jobless claims de hoy salen por debajo de 200,000, o si el FOMC del 29-30 de julio señala que no ve viabilidad de recorte en septiembre. El sol se presionaría hacia S/ 3.44-3.46 y el BCRP probablemente intervendría.

Escenario base (DXY 99-102): El más probable (60% de probabilidad). Datos de inflación y empleo gradualmente confirman desinflación. El sol se mantiene en S/ 3.39-3.43 durante el Q3.

Escenario bajista para el dólar (DXY 97-99): Se activaría si el PPI y el próximo CPI salen claramente por debajo del consenso, y/o si el FOMC confirma recorte en septiembre. El sol podría apreciarse a S/ 3.35-3.38.

La probabilidad de recorte de la Fed en septiembre cayó de 58% a 52% tras las actas de ayer. El PPI de mañana es el siguiente catalizador.`,
    analisis: `El DXY en 100.9 representa un punto de equilibrio post-actas. Para empresas que necesitan comprar dólares próximamente, el rango actual S/ 3.40-3.41 es favorable históricamente. Para exportadores que convertirán dólares, evaluar cobertura parcial ante el riesgo de apreciación. En QoriCash ofrecemos asesoría personalizada según su exposición cambiaria.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f011',
    titulo: 'Bitcoin +0.99% a US$ 62,872: recuperación leve post-actas FOMC — mercado cripto espera señales de liquidez de la Fed',
    descripcion: 'Bitcoin avanza 0.99% a US$ 62,872 este jueves 9 de julio, recuperando parte del terreno perdido esta semana. El movimiento sigue el apetito de riesgo global, que mejoró marginalmente tras la lectura del mercado de que las actas FOMC no son más hawkish de lo esperado. Soporte clave en US$ 60,000.',
    contenido: `Bitcoin cotiza a US$ 62,872 este jueves 9 de julio, con un alza de 0.99% que representa recuperación moderada luego de la caída de 1.57% del miércoles. El movimiento sigue la dinámica de activos de riesgo: el Nasdaq sube 0.74% y el BTC avanza en paralelo, confirmando la alta correlación de 0.72 con el índice tecnológico en el corto plazo.

El análisis técnico muestra soporte inmediato en US$ 60,000 (nivel psicológico + MA200 semanal) y resistencia en US$ 65,500 (MA50 diaria). El RSI en 48 indica neutralidad. Los volúmenes de negociación en spot son moderados, lo que sugiere que los participantes institucionales están en modo de espera.

El factor macro dominante para BTC en el corto plazo es la política monetaria de la Fed: históricamente, cada inicio de ciclo de recortes ha estado asociado con alzas de 20-40% de BTC en los 60 días siguientes. Si la probabilidad de recorte en septiembre regresa a 60%+, BTC podría intentar recuperar US$ 68,000-70,000.

Las reservas de BTC en exchanges centralizados continúan reduciéndose: -45,000 BTC en los últimos 30 días, señal de acumulación por parte de holders de largo plazo.`,
    analisis: `Bitcoin en US$ 62,872 está en zona de acumulación técnica. Para el mercado cambiario peruano, un rally cripto suele coincidir con mayor apetito de riesgo global, lo que presiona el DXY a la baja y apoya al sol. Monitorear el nivel de US$ 60,000 como soporte clave; si se rompe, señal de cautela adicional en activos de riesgo.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f012',
    titulo: 'Sol peruano: análisis técnico jueves 9 julio — S/ 3.406 con soporte en 3.39, resistencia en 3.44 y PPI de EE.UU. como catalizador mañana',
    descripcion: 'El tipo de cambio PEN/USD opera en S/ 3.406 este jueves, con soporte técnico en S/ 3.39 y resistencia en S/ 3.44. TradingView analiza los niveles clave: el diferencial de tasas BCRP-Fed, el flujo agroexportador y el comportamiento del DXY post-FOMC definen el rango de negociación del Q3.',
    contenido: `El tipo de cambio PEN/USD cotiza en S/ 3.406 este jueves 9 de julio, en el tercer día consecutivo dentro del rango S/ 3.40-3.41. El análisis técnico del par muestra: soporte inmediato en S/ 3.39 (mínimo del 3 de julio y MA20 diaria), resistencia en S/ 3.44 (máximo del 24 de junio), y rango de consolidación de mediano plazo entre S/ 3.38 y S/ 3.48.

Los catalizadores del día: (1) Jobless claims de EE.UU. a las 8:30 am ET —si sale por debajo de 210,000, presión alcista para el DXY; si sale por encima de 230,000, presión bajista. (2) Flujos de mercado cambiario peruano en el horario 9:00-11:00 am Lima.

El catalizador de mañana: PPI (inflación al productor) de EE.UU. a las 8:30 am ET. Consenso: +0.2% mensual. Un dato por encima reforzaría el tono hawkish de las actas FOMC y presionaría el sol hacia S/ 3.42-3.44. Un dato por debajo renovaría las expectativas de recorte de la Fed en septiembre.

El diferencial de tasa BCRP (4.50%) vs Fed (4.25%-4.50%) es 0-25bps. Si la Fed recorta en septiembre sin que el BCRP lo haga, el diferencial subiría —factor apreciador del sol.`,
    analisis: `El sol se mantiene en un rango técnico bien definido. Para compra de dólares (pagos de importación, remesas salientes), S/ 3.40-3.41 es históricamente favorable y cercano al soporte. Para ventas de dólares (exportadores), evaluar si aguardar una depreciación hacia S/ 3.44-3.46. El dato del PPI de mañana definirá la dirección de la próxima semana.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f013',
    titulo: 'Argentina: superávit fiscal por octavo mes consecutivo en junio e inflación de 3.1% mensual consolidan programa de Milei',
    descripcion: 'Argentina registró superávit fiscal primario por octavo mes consecutivo en junio 2026, mientras la inflación mensual descendió a 3.1% —la más baja desde 2021. El FMI aprobó el cuarto desembolso por US$ 3.2B. El peso argentino se estabiliza en el rango 1,100-1,120 ARS/USD bajo crawling peg.',
    contenido: `El gobierno de Javier Milei reportó que Argentina cerró junio de 2026 con un superávit fiscal primario de AR$ 680B —el octavo mes consecutivo en superávit desde el inicio del programa de ajuste. El resultado acumulado en el primer semestre es de AR$ 4.1 billones, el mejor desempeño fiscal argentino en más de 15 años.

La inflación mensual de junio descendió a 3.1%, la más baja desde septiembre de 2021 y por debajo de las estimaciones del mercado (3.4%). La inflación acumulada en el año se ubica en 42%, pero la tendencia mensual muestra desaceleración sostenida desde el pico de 25.5% mensual en enero de 2024.

El FMI aprobó el cuarto desembolso del programa EFF por US$ 3.2B, luego de la revisión trimestral que confirmó el cumplimiento de las metas fiscales, monetarias y de reservas. Las reservas del BCRA superaron los US$ 34B, el nivel más alto desde 2019.

El peso argentino opera en el rango 1,100-1,120 ARS/USD bajo el esquema de crawling peg, con el BCRA ajustando el tipo de cambio al 2.5% mensual (reducido desde el 6.5% de inicio del programa).`,
    analisis: `El ajuste fiscal de Argentina comienza a producir resultados macroeconómicos. Para el contexto regional, una Argentina más estable reduce el contagio de incertidumbre a otros mercados emergentes sudamericanos, incluido Perú. El menor riesgo regional puede contribuir marginalmente a una percepción más positiva del sol como activo emergente. Impacto en PEN: neutral-positivo en el margen.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f014',
    titulo: 'Colombia: IED cae 8.2% en el primer semestre — incertidumbre regulatoria y reforma pensional generan cautela inversora',
    descripcion: 'La inversión extranjera directa en Colombia cayó 8.2% en el primer semestre de 2026, según el Banco de la República. La caída se concentra en minería e hidrocarburos, afectados por la política energética del gobierno Petro. El peso colombiano cede a COP 4,420/USD.',
    contenido: `El Banco de la República de Colombia reportó que la IED cayó 8.2% anual en el primer semestre de 2026, totalizando US$ 6.1B frente a US$ 6.6B en el mismo periodo de 2025. La caída se concentra en minería convencional e hidrocarburos, afectados por las restricciones a nuevas licencias de exploración y el anuncio de no prorrogar contratos de fracking.

Los sectores con IED creciente: manufactura (+12%), servicios financieros (+8%) y energías renovables (+45%), este último impulsado por proyectos eólicos en La Guajira y solar en Atlántico. Sin embargo, el volumen de estos sectores no compensa la salida del petróleo.

El peso colombiano cede a COP 4,420 por dólar (+1.3% de depreciación en julio). El Banco de la República tiene su tasa en 9.25%, habiendo recortado 350bps desde el pico de 13.25% en 2023-2024. El mercado espera un recorte adicional de 25-50bps en agosto.

La reforma pensional del gobierno Petro, en debate en el Senado, genera incertidumbre adicional sobre los flujos de capitales al mercado de capitales colombiano.`,
    analisis: `La menor IED en Colombia contrasta favorablemente con la estabilidad del marco de inversiones peruano. Esto puede generar desvío marginal de flujos hacia activos peruanos —positivo para el sol en el margen. Sin embargo, el efecto directo en el TC PEN/USD es limitado y no cambia la dinámica del mercado cambiario peruano de forma significativa.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f015',
    titulo: 'Chile: inflación de junio en 3.8% anual dentro del rango meta — cobre en US$ 4.58/lb y peso chileno en CLP 920/USD',
    descripcion: 'Chile registró una inflación anual de 3.8% en junio 2026, dentro del rango meta del Banco Central (2%-4%), y por debajo del 4.1% de mayo. El precio del cobre se mantiene en US$ 4.58/lb. El peso chileno cotiza en CLP 920/USD y el BCCh tiene margen para continuar su ciclo de recortes.',
    contenido: `El INE de Chile reportó que el IPC de junio de 2026 registró una variación anual de 3.8%, dentro del rango meta del Banco Central de Chile de 2%-4% por tercer mes consecutivo. La desaceleración respecto al 4.1% de mayo permite al BCCh mantener o acelerar su ciclo de recortes.

La tasa de política monetaria del BCCh se ubica en 5.00%, luego de recortes acumulados de 225bps desde el pico de 11.25% de 2023. El mercado descuenta dos recortes adicionales de 25bps cada uno para el segundo semestre de 2026 —probablemente en agosto y octubre.

El precio del cobre, principal exportación chilena (52% de los ingresos de divisas), se mantiene estable en US$ 4.58/lb en el LME. El nivel actual está por encima del costo de producción de CODELCO (US$ 2.90/lb C1). Chile producirá 5.7 millones de toneladas de cobre en 2026.

El peso chileno cotiza en CLP 920/USD, recuperándose desde los CLP 960/USD de marzo 2026. La apreciación refleja el flujo de divisas por exportaciones de cobre y la menor incertidumbre fiscal.`,
    analisis: `Chile muestra fundamentos sólidos: inflación en meta, tasa de cobre rentable y política monetaria con margen de recortes. Para el Perú, un Chile estable reduce la presión sobre el riesgo emergente latinoamericano. El CLP estable en CLP 920/USD apoya la visión positiva del sol en el contexto regional. Impacto en TC PEN/USD: neutro-positivo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g001',
    titulo: 'Fed: NFP de junio en 182,000 y CPI martes 8 — mercados elevan probabilidad de recorte en septiembre al 58%',
    descripcion: 'El dato de empleo de junio (182,000 empleos, desempleo 4.0%) fue interpretado como "goldilocks" por los mercados: suficientemente moderado para mantener abierta la ventana de recorte en septiembre. El CPI del martes 8 y las actas del FOMC (miércoles 9) definirán si la probabilidad supera el 70%.',
    contenido: `La semana del 7 de julio arranca con la digestión del NFP de junio publicado el viernes 3: 182,000 empleos nuevos, tasa de desempleo en 4.0% y crecimiento de salarios de 0.3% mensual —todas las cifras dentro del rango del consenso—. El resultado fue interpretado como "goldilocks": suficientemente sólido para descartar recesión inminente pero suficientemente moderado para mantener la ventana de recorte de la Fed en septiembre.

La herramienta CME FedWatch refleja el ajuste de expectativas: la probabilidad implícita de un recorte de 25bps en septiembre pasó del 52% al 58% tras el NFP. Para la reunión de noviembre, la probabilidad acumulada de al menos un recorte en 2026 asciende ya al 79%. Goldman Sachs reafirmó su base de dos recortes (septiembre y diciembre), mientras que Citigroup elevó su recomendación en bonos del Tesoro a 10 años.

El dato crítico de esta semana es el CPI de junio de EE.UU. (martes 8 de julio). El consenso de Bloomberg (52 analistas) proyecta un CPI general de 2.9% y subyacente de 3.1% interanual. Un dato por debajo de 3.0% en el subyacente elevaría la probabilidad de recorte en septiembre por encima del 70% y presionaría al DXY hacia 99-100.

Las actas de la reunión del FOMC de junio (miércoles 9) darán señales sobre el debate interno de la Fed. Jerome Powell también comparece ante el Congreso (martes 8) y el Senado (jueves 10) esta semana, lo que lo convierte en la semana de mayor densidad de catalizadores para los mercados cambiarios en lo que va del Q3 2026.`,
    analisis: `El escenario de recorte en septiembre es el más favorable para el PEN/USD: históricamente cuando la Fed señala un giro dovish, el DXY cede entre 2% y 5% en el mes siguiente, implicando una apreciación del sol hacia S/ 3.30-3.35.

Para empresas con necesidades de compra de dólares en agosto o septiembre, el nivel actual de S/ 3.40 podría representar un punto cercano al techo si el CPI confirma la tendencia desinflacionaria. En QoriCash le ayudamos a ejecutar sus operaciones cambiarias al mejor tipo de cambio del mercado, en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/8788264/pexels-photo-8788264.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g002',
    titulo: 'DXY cae a 101.2 post-NFP: sol peruano abre semana en S/ 3.396 con soporte técnico en S/ 3.38',
    descripcion: 'El índice del dólar DXY retrocedió 0.6% el viernes 4, cerrando en 101.2 —mínimo desde enero 2026—. El sol peruano reaccionó apreciándose a S/ 3.396 interbancario, con soporte técnico en S/ 3.38 y resistencia en S/ 3.44. El CPI del martes 8 definirá la dirección de corto plazo.',
    contenido: `El índice del dólar DXY cerró la semana del 30 de junio al 4 de julio en 101.2 puntos, retrocediendo 0.6% el viernes tras el NFP dentro de expectativas y consolidando una caída semanal del 0.9%. El nivel es el más bajo desde el 15 de enero de 2026, cuando el DXY tocó un mínimo de 100.8. La ruptura del soporte de 101.5 —que había aguantado desde mediados de mayo— abre la puerta hacia 99-100 si el CPI confirma la desinflación.

Para el sol peruano, la debilidad del DXY se tradujo en una apreciación del 0.4% en la semana: el interbancario cerró el viernes 4 en S/ 3.396, desde los S/ 3.410 del cierre del 27 de junio. El BCRP realizó intervenciones de compra de dólares por aproximadamente US$ 380M durante la semana para suavizar la apreciación, en línea con su política de reducir la volatilidad sin defender niveles específicos.

El análisis técnico del PEN/USD muestra: soporte inmediato en S/ 3.38 (MA50 diaria), soporte secundario en S/ 3.32 (mínimo de enero 2026), resistencia en S/ 3.44 (zona de consolidación mayo-junio) y resistencia secundaria en S/ 3.50 (máximo de mayo). El RSI en 14 sesiones se ubica en 41, zona neutral-bajista para el dólar.

Las principales monedas emergentes también reaccionaron positivamente: el BRL se apreció 0.7% a 5.08/USD, el CLP ganó 1.1% a 912/USD, el COP se fortaleció 0.5% a 4,160/USD y el MXN avanzó 0.8% a 17.2/USD.`,
    analisis: `Un DXY en 101.2 y tendencia bajista es la condición externa más favorable para el sol en lo que va del año. Tres escenarios para esta semana: CPI en línea (2.9%/3.1%) → DXY 100-102, sol S/ 3.38-3.42; CPI bajo (< 2.8%) → DXY perfora 100, sol S/ 3.30-3.35; CPI alto (> 3.2% subyacente) → DXY rebota a 103, sol presionado hacia S/ 3.45-3.50.

La semana del 7 al 11 de julio es técnicamente una de las más importantes del año para los mercados cambiarios. En QoriCash monitoreamos el tipo de cambio en tiempo real para ofrecerle siempre la mejor tasa disponible.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g003',
    titulo: 'Sol peruano: análisis semanal 7-11 julio — soporte en S/ 3.38, resistencia en S/ 3.44, clave el CPI del martes',
    descripcion: 'El sol abre la semana en S/ 3.396 con el viento a favor de un DXY débil y las exportaciones agroestacionales. El rango técnico S/ 3.38-3.44 con sesgo de apreciación dependerá del CPI americano y las actas del FOMC.',
    contenido: `El tipo de cambio PEN/USD entra a la semana del 7 de julio en posición técnica favorable para el sol: el nivel de S/ 3.396 se ubica por debajo de la media móvil de 20 sesiones (S/ 3.408), señal de que la tendencia de corto plazo se ha inclinado hacia la apreciación.

Los factores locales favorables son: el pico de la temporada alta de agroexportaciones (blueberries de La Libertad y Lambayeque) que genera un flujo adicional estimado de US$ 80-120M semanales de conversión de divisas; las reservas del BCRP en US$ 73.8B, que brindan capacidad de intervención de primera línea; y la demanda de soles del sistema financiero para pagos de impuestos y planillas de la primera semana del mes.

El factor externo dominante es el CPI de EE.UU. del martes 8. El consenso proyecta 2.9% general y 3.1% subyacente interanual. Un dato en línea es neutral para el PEN. Un dato por debajo de 2.8% general sería el catalizador para que el sol perfore S/ 3.38 y apunte a S/ 3.32-3.35. Un dato por encima de 3.2% subyacente devolvería presión hacia S/ 3.44-3.48.

Niveles técnicos clave: soporte S/ 3.38 (MA50 diaria), soporte relevante S/ 3.32 (mínimo enero 2026), resistencia S/ 3.44 (consolidación de junio), resistencia secundaria S/ 3.50 (máximo de mayo). El BCRP compra si el sol se acerca a S/ 3.32, vende si supera S/ 3.50.`,
    analisis: `La semana del 7-11 julio tiene tres escenarios: CPI en línea → sol S/ 3.38-3.44 neutro; CPI bajo → sol S/ 3.30-3.38 apreciación; CPI alto → sol S/ 3.44-3.50 depreciación leve. El escenario base de Credicorp Capital y BBVA Research coincide en S/ 3.40 como punto de equilibrio para el Q3.

Para operaciones cambiarias planificadas esta semana, el nivel actual de S/ 3.396 es razonable para conversiones de soles a dólares con horizonte de 30 días. En QoriCash obtendrá el mejor tipo de cambio del mercado con acreditación en 10 minutos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g004',
    titulo: 'Agroexportaciones peruanas: récord histórico de US$ 4,820M en H1 2026, crecimiento del 14.3% impulsado por blueberries y mangos',
    descripcion: 'Las exportaciones agropecuarias de Perú alcanzaron US$ 4,820 millones en el H1 2026, un récord histórico con crecimiento del 14.3% interanual. Los blueberries (+32%), mangos (+18%) y paltas (+11%) lideraron la expansión, consolidando a Perú como el segundo exportador mundial de arándanos.',
    contenido: `Las exportaciones agropecuarias del Perú totalizaron US$ 4,820 millones en el primer semestre de 2026, según datos preliminares de ADEX y el MIDAGRI publicados el 3 de julio. El resultado representa un crecimiento del 14.3% respecto a los US$ 4,218M del H1 2025 y un nuevo récord histórico semestral.

Los arándanos lideraron con US$ 1,240M (+32% interanual), consolidando a Perú como el segundo exportador mundial, solo detrás de Chile. Los principales destinos son EE.UU. (48%), Países Bajos (24%) y China (14%). Las regiones La Libertad (35%) y Lambayeque (22%) concentran la mayor actividad. El mango generó US$ 380M (+18%), impulsado por la apertura del mercado japonés en diciembre de 2025.

Las paltas alcanzaron US$ 560M (+11%), con el mercado europeo absorbiendo el 61% del volumen. La uva de mesa aportó US$ 720M (+8%), con el pico estacional esperado en el Q4 2026. El tipo de cambio PEN/USD en S/ 3.40 ha favorecido la competitividad de los exportadores: ADEX estima que cada S/ 0.10 de depreciación del sol mejora el margen en aproximadamente 2.8%.

El flujo mensual de divisas del sector —US$ 800M promedio— actúa como ancla del sol peruano durante la temporada alta (julio-septiembre), limitando depreciaciones severas pese a los vientos externos adversos.`,
    analisis: `El boom agroexportador tiene efecto macroeconómico positivo sobre el PEN/USD: US$ 4,820M en el H1 genera una demanda estructural de soles en el mercado cambiario que ancla la moneda frente a presiones externas. Esto explica en parte por qué el sol ha sostenido S/ 3.40 pese a la fortaleza global del DXY en el Q1.

Para empresas peruanas proveedoras del sector (empaques, insumos, logística), la expansión representa una oportunidad y un flujo de caja en soles. En QoriCash le ayudamos a convertir sus dólares de exportación al mejor tipo de cambio del mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14170532/pexels-photo-14170532.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g005',
    titulo: 'Cobre Perú: producción acumula 1.54M TMF en H1 2026 — récord histórico impulsado por Antamina, Cerro Verde y Quellaveco',
    descripcion: 'La producción cuprìfera peruana alcanzó un récord histórico de 1.54 millones de toneladas métricas finas en el H1 2026, con crecimiento del 3.4% interanual. El precio del cobre promedió US$ 4.82/libra en LME, generando ingresos de exportación estimados en US$ 14,900M.',
    contenido: `La producción de cobre en Perú alcanzó un récord histórico de 1.54 millones de TMF en el H1 2026, superando el anterior máximo de 1.49M TMF del H1 2023, según datos preliminares del MINEM. El crecimiento interanual fue del 3.4% frente al H1 2025.

Las tres unidades que explican el récord: Antamina (Ancash) con 308,000 TMF (+5.2% interanual) por optimización del molino SAG; Cerro Verde (Arequipa, Freeport-McMoRan) con 131,000 TMF (+4.1%) por la ampliación de la concentradora Fase II; y Quellaveco (Moquegua, Anglo American) con 95,000 TMF (+8.7%) en su cuarto año completo de operaciones.

El precio promedio del cobre en LME en el H1 2026 fue de US$ 4.82/libra (US$ 10,627/tonelada), el más alto desde 2022. Combinando volumen y precio, los ingresos de exportación de cobre peruano se estiman en US$ 14,900M en el semestre —el 42% del total de exportaciones del país. China absorbió el 76% del volumen.

El principal riesgo para el H2 es la potencial desaceleración de la demanda china: el PMI manufactura de junio en 49.7 (contracción) genera incertidumbre. Sin embargo, los proyectos de energía renovable y vehículos eléctricos siguen siendo un soporte estructural de largo plazo para el metal.`,
    analisis: `Las exportaciones mineras representan el mayor flujo de dólares hacia Perú: US$ 14,900M en el H1 equivalen a US$ 2,483M mensuales solo de cobre, un ancla fundamental para la estabilidad del sol. Sin este flujo, el tipo de cambio estaría sustancialmente más presionado.

Para empresas mineras y sus proveedores con necesidades de conversión de dólares a soles (planillas, proveedores locales, impuestos), QoriCash ofrece el mejor tipo de cambio del mercado con acreditación en 10 minutos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28442180/pexels-photo-28442180.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g006',
    titulo: 'Oro supera US$ 3,450/oz: DXY débil y tensiones geopolíticas llevan al metal a máximos de 8 semanas',
    descripcion: 'El oro al contado cerró la semana en US$ 3,453/oz, ganando 2.1% impulsado por la confluencia de un DXY en 101.2, tensiones en Medio Oriente y compras récord de bancos centrales emergentes. Goldman Sachs reitera su objetivo de US$ 3,700/oz para fin de año.',
    contenido: `El precio del oro al contado cerró la semana del 30 de junio al 4 de julio en US$ 3,453/oz, avanzando 2.1% desde los US$ 3,382 del cierre anterior y marcando el nivel más alto desde el 14 de mayo de 2026. El oro en futuros de agosto en el COMEX cerró en US$ 3,461/oz.

Los cuatro factores que explican el repunte: (1) debilidad del DXY que cayó de 102.1 al inicio de la semana a 101.2 al cierre —históricamente el oro y el DXY tienen correlación de -0.72—; (2) renovadas tensiones geopolíticas en el Mar Rojo y el Golfo Pérsico; (3) el informe trimestral del Consejo Mundial del Oro mostró que los bancos centrales (China, India, Polonia) compraron 290 toneladas en el Q1 2026, tercer trimestre consecutivo de compras históricas; y (4) expectativa de recortes de la Fed que reduce el costo de oportunidad de mantener oro.

El nivel técnico clave es US$ 3,480/oz (máximo de mayo): si el oro lo supera con el impulso del CPI favorable esta semana, podría avanzar hacia el récord histórico de US$ 3,520/oz de abril 2026. Soporte inmediato en US$ 3,400/oz.

Goldman Sachs reiteró su precio objetivo de fin de año en US$ 3,700/oz, sustentado en compras de bancos centrales (+900 toneladas proyectadas para 2026) y flujos de ETFs que acumulan US$ 12.8B en inflows en el año.`,
    analisis: `El oro en US$ 3,453 es relevante para Perú: el país produce aproximadamente 100 toneladas anuales y empresas como Buenaventura, Yanacocha y Gold Fields Perú generan flujos adicionales de dólares que apoyan al sol. Precios del oro más altos = más ingresos de exportación = más soporte para el PEN.

Para inversionistas peruanos interesados en oro como cobertura cambiaria, QoriCash ofrece el mejor tipo de cambio PEN/USD como paso indispensable para cualquier operación en dólares.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29336321/pexels-photo-29336321.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g007',
    titulo: 'Bitcoin consolida en US$ 107,340: flujo neto ETFs +US$ 1.2B en la semana y guías regulatorias SEC impulsan el repunte',
    descripcion: 'Bitcoin cerró la semana en US$ 107,340 con un avance del 4.8% semanal. El iShares Bitcoin Trust de BlackRock registró entradas netas de US$ 740M. La SEC publicó las "Guías de Activos Digitales 2026", generando mayor certidumbre regulatoria para el sector.',
    contenido: `Bitcoin (BTC) cerró la semana del 30 de junio al 4 de julio en US$ 107,340, avanzando 4.8% desde los US$ 102,420 del viernes anterior y consolidándose sobre US$ 100,000 por cuarta semana consecutiva. La capitalización de mercado del Bitcoin superó US$ 2.12 billones, el 52.3% del total del mercado crypto.

El catalizador fue el flujo neto positivo de los ETFs spot de Bitcoin en EE.UU.: iShares Bitcoin Trust (BlackRock), Fidelity Wise Origin y Ark 21Shares sumaron entradas netas de US$ 1.24B en la semana —el mayor desde abril—. Solo el iShares de BlackRock registró US$ 740M. El total de AUM de los ETFs Bitcoin en EE.UU. supera ya los US$ 115B.

La SEC publicó el jueves 3 de julio las "Guías de Activos Digitales 2026", 180 páginas que clarifican el tratamiento regulatorio de tokens de utilidad, stablecoins y ETFs de criptomonedas. El mercado interpretó el documento como un paso hacia mayor certidumbre, eliminando la incertidumbre que pesaba desde los colapsos de 2022-2023. Coinbase (COIN) subió 8.4% en la semana.

Análisis técnico BTC/USD: soporte en US$ 103,000 (MA20 semanal), soporte relevante en US$ 96,000 (Fibonacci 38.2%), resistencia en US$ 112,000 (máximo del 22 de mayo). El RSI semanal en 62 sugiere espacio alcista sin señales de sobrecompra extrema.`,
    analisis: `La correlación entre Bitcoin y el apetito de riesgo global ha aumentado en 2026: cuando el DXY cae y los mercados de acciones suben, el BTC tiende a amplificar los movimientos al alza. Esto convierte al precio de Bitcoin en indicador indirecto del apetito de riesgo que también impacta en el sol peruano y los activos emergentes.

Para peruanos que operan con criptomonedas y necesitan convertir a dólares o soles, QoriCash ofrece el mejor tipo de cambio USD/PEN del mercado —el primer paso para cualquier conversión de cripto a moneda local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g008',
    titulo: 'PMI manufactura China junio: 49.7 — mejora respecto al 49.3 de mayo pero contracción por segundo mes; yuan y cobre reaccionan con cautela',
    descripcion: 'El PMI manufacturero oficial de China cerró junio en 49.7, mejor que el 49.3 de mayo y el consenso de 49.5, pero en zona de contracción por segundo mes consecutivo. El PMI Caixin (sector privado) subió a 50.5. El PBOC señaló posibles herramientas adicionales de liquidez en el Q3.',
    contenido: `El PMI manufacturero oficial de China (NBS) cerró junio de 2026 en 49.7 puntos, publicado el 30 de junio. El dato supera el 49.3 de mayo y el consenso de 49.5, pero se mantiene por debajo de 50 (contracción) por segundo mes consecutivo, tras cuatro meses de expansión entre febrero y mayo.

Los sub-índices revelan imagen matizada: producción subió a 50.8 desde 50.3 (expansión), pero nuevos pedidos cayeron a 49.2 desde 49.5 (contracción más pronunciada), reflejo del menor dinamismo de la demanda interna y externa. El sub-índice de pedidos de exportación se ubicó en 47.8, el más bajo en 8 meses, evidencia del impacto de aranceles adicionales de EE.UU. sobre bienes chinos.

El PMI Caixin (sector privado y medianas empresas, publicado el 1 de julio) fue de 50.5, en expansión y por encima del 50.2 de mayo. La divergencia entre el PMI oficial (grandes estatales) y el Caixin (medianas privadas) refleja la heterogeneidad de la recuperación económica china.

El PBOC anunció el 2 de julio que "continuará con la política monetaria acomodaticia" y evaluará "herramientas adicionales de liquidez" si el crecimiento muestra señales de desaceleración en el Q3. El mercado interpreta esto como antesala de un potencial recorte del coeficiente de encaje (RRR) en julio o agosto.`,
    analisis: `El PMI chino en 49.7 es relevante para Perú por la relación cobre-China: Perú exporta el 76% de su cobre al mercado chino, y cualquier señal de desaceleración industrial presiona a la baja el precio del metal (US$ 4.82/lb). Una caída a US$ 4.50/lb implicaría menores ingresos de exportación y presión sobre el sol.

Para empresas peruanas con exposición a materias primas o cadenas de suministro chinas, el PMI es un indicador adelantado clave. En QoriCash monitoreamos estos datos para anticipar el impacto cambiario.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32845692/pexels-photo-32845692.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g009',
    titulo: 'Petróleo WTI cierra semana en US$ 73.4: inventarios EE.UU. superan expectativas y OPEP+ mantiene producción elevada',
    descripcion: 'El WTI cerró la semana en US$ 73.4/barril con caída del 1.8% semanal. Los inventarios de crudo en EE.UU. subieron en 3.2M de barriles (vs. caída esperada de 1.5M) y la OPEP+ confirmó mantener niveles de producción elevados en agosto. El Brent cierra en US$ 76.2/barril.',
    contenido: `El petróleo West Texas Intermediate (WTI) cerró la semana del 30 de junio al 4 de julio en US$ 73.4/barril, retrocediendo 1.8% desde los US$ 74.75 del cierre anterior, en un contexto de sobreoferta relativa. El Brent cierra en US$ 76.2/barril, con diferencial Brent-WTI de US$ 2.8.

El factor bajista dominante fue el informe semanal de inventarios de la EIA (publicado el 2 de julio): los stocks de crudo aumentaron en 3.2M de barriles en la semana al 28 de junio, muy por encima del consenso que esperaba una caída de 1.5M. Las reservas de gasolina también subieron en 2.1M de barriles, señal de demanda del consumidor más débil de lo esperado para el verano americano.

La reunión ministerial de la OPEP+ del 30 de junio confirmó mantener la estrategia de producción elevada: a partir de agosto, la producción de los 8 países con recortes voluntarios seguirá incrementándose en 411,000 barriles diarios mensuales. Arabia Saudita moderó su postura de "guerra de precios" ante señales de cooperación de productores no-miembros.

El factor alcista que limitó la caída fue la tensión en el Estrecho de Ormuz: ejercicios no anunciados de la marina iraní generaron una prima de riesgo geopolítico. La volatilidad implícita en opciones de agosto permanece elevada.`,
    analisis: `El WTI en US$ 73.4 tiene implicaciones mixtas para Perú. Positivo: el petróleo barato reduce costos de importación de combustibles y alivia la presión inflacionaria local. Negativo: el precio bajo del crudo afecta a Colombia y Ecuador (exportadores), generando presión sobre sus monedas y afectando el contexto regional.

Un WTI sostenido por debajo de US$ 75 durante el Q3 sería favorable para la inflación peruana y reduciría la probabilidad de subidas de precios de combustibles al consumidor. En QoriCash seguimos los mercados de commodities para anticipar impactos en el tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29988955/pexels-photo-29988955.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g010',
    titulo: 'Exportaciones textiles peruanas crecen 22% en H1 2026: US$ 980M lideradas por alpaca y algodón Pima para mercados premium',
    descripcion: 'El sector textil-confecciones peruano exportó US$ 980M en el H1 2026, crecimiento del 22% interanual liderado por prendas de alpaca (+34%) y algodón Pima (+19%). EE.UU. (45%), Italia (12%) y Japón (9%) son los principales destinos de las exportaciones premium peruanas.',
    contenido: `Las exportaciones del sector textil-confecciones de Perú alcanzaron US$ 980M en el H1 2026, según datos de la Cámara de Comercio de Lima y PromPerú publicados el 3 de julio. El crecimiento del 22% interanual frente a los US$ 803M del H1 2025 convierte al textil en el tercer sector exportador no tradicional del país.

El segmento de mayor crecimiento es la fibra de alpaca: US$ 215M en el H1 (+34% interanual), con los mercados italiano, japonés y estadounidense como principales compradores de marcas peruanas de lujo. El grupo Michell y CIA, Inca Tops y Prosur reportaron márgenes operativos superiores al 28%, aprovechando el posicionamiento de la alpaca como fibra premium en el segmento "slow fashion" europeo y asiático.

El algodón Pima —variedad nativa de Piura— generó US$ 340M en exportaciones de confecciones (+19% interanual). Las confecciones tipo "athleisure" y ropa interior premium para Nordstrom, Marks & Spencer y Uniqlo representaron el 48% del volumen. El tipo de cambio PEN/USD en S/ 3.40 ha mejorado la competitividad frente a competidores de Bangladesh, Vietnam y Camboya.

El principal desafío del sector es la restricción de mano de obra especializada: el sector estima un déficit de 8,500 operarios calificados para el H2 2026, lo que podría limitar la capacidad de respuesta a pedidos de la temporada alta octubre-diciembre.`,
    analisis: `El crecimiento del 22% en exportaciones textiles tiene efecto cambiario directo: US$ 980M en el H1 equivalen a un flujo mensual de ~US$ 163M de conversión de divisas, aporte significativo al mercado spot de soles que refuerza el soporte del PEN en los niveles actuales.

Para empresas del sector textil con ingresos en dólares, la gestión del tipo de cambio es crítica para proteger márgenes: con costos en soles y ventas en dólares, una apreciación inesperada erosiona la rentabilidad. En QoriCash le ofrecemos el mejor tipo de cambio para sus conversiones, con liquidación en el día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31112215/pexels-photo-31112215.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g011',
    titulo: 'Argentina: inflación junio en 3.1% mensual — undécimo mes consecutivo de baja; peso cierra en 1,285 ARS/USD con brecha mínima del 0.8%',
    descripcion: 'El INDEC publicó la inflación de junio en 3.1% mensual, el menor registro en 36 meses y undécimo mes consecutivo de desaceleración. El BCRA mantiene la tasa en 40% anual. La brecha entre el dólar oficial (1,285 ARS) y el blue (1,295 ARS) cayó al 0.8%, mínimo del gobierno actual.',
    contenido: `El INDEC publicó el 3 de julio el dato de inflación de junio de 2026: 3.1% mensual, por debajo del 3.4% de mayo y del consenso de 3.3%. La inflación interanual acumula 52.8%, un número que sigue siendo alto en términos históricos pero que representa una caída drástica desde el 211% interanual de diciembre de 2023.

La desaceleración es el undécimo mes consecutivo de baja, consolidando la tendencia desinflacionaria del gobierno de Javier Milei. El rubro de mayor moderación fue alimentos y bebidas (2.8% vs. 3.9% en mayo), señal de que la corrección de precios regulados ya se ha absorbido. Los rubros con mayor presión al alza son indumentaria (5.1%) y educación (4.4%) —ambos estacionales del segundo semestre—.

El BCRA mantuvo la tasa de política monetaria en 40% anual en su reunión del 26 de junio, señalando que "la baja de la inflación está en camino pero el trabajo no está terminado". La tasa real efectiva mensual es de aproximadamente 0.2% (40%/12 = 3.3% vs. inflación 3.1%), la más elevada de Argentina desde 2018. El mercado descuenta el primer recorte de tasas en septiembre u octubre si la inflación mensual llega al rango 2.5%-2.8%.

El tipo de cambio oficial cerró junio en 1,285 ARS/USD bajo el esquema de flotación administrada con bandas ($1,000-$1,300). El dólar blue cerró en 1,295 ARS/USD, brecha de apenas 0.8% con el oficial —la menor desde el inicio del gobierno— señal de normalización del mercado informal de divisas.`,
    analisis: `La estabilización macroeconómica argentina es relevante para Perú como termómetro del apetito de riesgo latinoamericano: cuando Argentina muestra señales positivas, los inversores internacionales perciben a la región con menor riesgo, favoreciendo flujos de capital hacia mercados como el peruano.

Para peruanos con negocios o familia en Argentina, el tipo de cambio implícito ARS/PEN es de aproximadamente 378 pesos argentinos por sol (1,285 ÷ 3.40). Para optimizar conversiones PEN/USD previas a operaciones en Argentina, QoriCash ofrece el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29084309/pexels-photo-29084309.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g012',
    titulo: 'Chile: BCCh señala recorte de tasas para agosto; peso CLP se aprecia 1.1% en la semana y cierra en 912 CLP/USD',
    descripcion: 'Las actas del BCCh publicadas el 3 de julio mostraron que cuatro de cinco consejeros están inclinados hacia un recorte en agosto. El peso chileno cerró en 912 CLP/USD (+1.1% en la semana) impulsado por la señal dovish y el rally del cobre. La inflación de junio (8 de julio) definirá el calendario.',
    contenido: `El Banco Central de Chile (BCCh) publicó el 3 de julio las actas de su reunión del 19-20 de junio: cuatro de los cinco consejeros señalaron que "las condiciones para un inicio de la flexibilización monetaria se están alcanzando", mientras el quinto prefirió esperar "una lectura adicional de inflación". El mercado interpretó el mensaje como señal casi explícita de un recorte en agosto.

La tasa del BCCh está actualmente en 5.00% desde febrero de 2025. Con una inflación de mayo en 3.2% interanual, la tasa real ex-ante es de 1.8%, el nivel más restrictivo de la región junto a Perú. La inflación de junio se publica el 8 de julio y el consenso proyecta 3.0%-3.1% interanual; si confirma, el recorte de agosto quedaría prácticamente asegurado.

El peso chileno (CLP) se apreció 1.1% en la semana, cerrando en 912 CLP/USD el viernes 4, el nivel más bajo desde el 20 de marzo de 2026. Los factores impulsores: optimismo post-NFP sobre la Fed, rally del cobre (+0.4% en la semana) y la señal dovish del BCCh. El cobre tiene correlación histórica de 0.68 con el CLP.

La economía chilena creció 2.8% en el Q1 2026, ligeramente por debajo del consenso de 3.1%, con consumo privado aún contenido por las tasas elevadas. El Ministerio de Hacienda proyecta crecimiento del 3.2% para el año, asumiendo inicio de recortes en agosto y cobre sobre US$ 4.50/libra.`,
    analisis: `El potencial recorte del BCCh en agosto es relevante regionalmente: cuando el banco central chileno —uno de los más técnicos y creíbles de América Latina— inicia un ciclo de recortes, suele marcar un "permiso macroeconómico" para que otros bancos centrales de la región, incluido el BCRP, sigan el camino en septiembre u octubre.

Para peruanos con operaciones en Chile, el tipo de cambio implícito PEN/CLP mejoró esta semana a 268 pesos chilenos por sol (912/3.40). En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD como base para cualquier operación con el mercado chileno.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g013',
    titulo: 'Colombia: BanRep recorta tasas 25bps a 9.00% por unanimidad — inflación junio en 4.2%; COP se aprecia a 4,155/USD',
    descripcion: 'El Banco de la República de Colombia recortó su tasa de referencia en 25 puntos básicos a 9.00% el 4 de julio, primer movimiento del H2, luego de que la inflación de junio cayera a 4.2% interanual —por debajo del techo del 4% meta por primera vez desde octubre 2021. El COP se apreció 0.4% a 4,155/USD.',
    contenido: `El Banco de la República de Colombia (BanRep) anunció el viernes 4 de julio un recorte de 25 puntos básicos en su tasa de referencia, de 9.25% a 9.00%, primer movimiento desde enero de 2026 y séptimo del ciclo de flexibilización iniciado en diciembre de 2023. La decisión fue por unanimidad de los siete miembros del Comité de Política Monetaria.

El detonante fue la inflación de junio: 4.2% interanual, por debajo del techo del rango meta del 4% por primera vez desde octubre de 2021. El gobernador del BanRep, Leonardo Villar, declaró: "el proceso desinflacionario está consolidado y la política monetaria puede acompañar la recuperación de la actividad económica sin sacrificar la estabilidad de precios". El BanRep proyecta inflación del 3.5% para finales de 2026.

El COP reaccionó con apreciación del 0.4% al cierre del viernes, cerrando en 4,155/USD —el nivel más bajo desde el 18 de febrero de 2026—. La apreciación contrasta con lo habitual tras un recorte, pero el mercado interpretó la decisión como señal de solidez macroeconómica. El petróleo Brent en US$ 76.2/barril también provee soporte al COP.

La economía colombiana creció 3.1% en el Q1 2026, impulsada por construcción (+7.2%), servicios financieros (+6.4%) y agricultura (+5.2%). El déficit en cuenta corriente se redujo al 2.7% del PIB en el H1 —el más bajo desde 2019—, señal de que los fundamentos externos se han fortalecido.`,
    analisis: `El recorte del BanRep refuerza la narrativa de que América del Sur está iniciando un ciclo coordinado de flexibilización monetaria. Para el BCRP, el recorte colombiano añade presión para que Perú también reduzca su tasa en agosto o septiembre, lo que tendría un efecto ambivalente sobre el sol.

Para peruanos con operaciones en Colombia, el tipo de cambio implícito PEN/COP es de aproximadamente 1,222 pesos colombianos por sol (4,155/3.40). En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD como primer paso para transacciones con el mercado colombiano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676238/pexels-photo-19676238.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g014',
    titulo: 'Trump eleva aranceles tecnológicos a China al 45%: semiconductores y paneles solares desde el 15 de julio afectan US$ 120B en importaciones',
    descripcion: 'La administración Trump anunció el 2 de julio la elevación de aranceles a importaciones chinas de semiconductores, paneles solares y equipos de telecomunicaciones del 25% al 45%, efectiva el 15 de julio. El Nasdaq cayó 1.2% el miércoles, Apple perdió 2.8% y el índice de semiconductores retrocedió 3.1%.',
    contenido: `La administración del presidente Donald Trump anunció el miércoles 2 de julio la elevación de aranceles a importaciones chinas en tres categorías: semiconductores (25% → 45%), paneles solares y equipos de generación renovable (20% → 45%), y equipos de telecomunicaciones incluyendo antenas 5G y routers (25% → 45%). Las nuevas tarifas entran en vigor el 15 de julio y afectan aproximadamente US$ 120B en importaciones anuales, según la Oficina del Representante Comercial de EE.UU. (USTR).

La Casa Blanca justificó la medida como "necesaria para proteger la seguridad nacional y la competitividad tecnológica de EE.UU." bajo la Sección 301 de la Ley de Comercio. El secretario de Comercio Howard Lutnick señaló que "China no ha cumplido los compromisos de Phase 1". Pekín respondió amenazando con "medidas de represalia proporcionales" y el Ministerio de Comercio chino convocó al embajador americano.

El impacto en mercados fue inmediato: Nasdaq cayó 1.2% el miércoles, Apple (AAPL) perdió 2.8% ante el riesgo en la cadena de suministro del iPhone, y el Philadelphia Semiconductor (SOX) retrocedió 3.1%. Sin embargo, los mercados recuperaron parte de las pérdidas el jueves y viernes ante expectativa de continuación de negociaciones.

Las importaciones peruanas desde China totalizaron US$ 12,800M en el H1 2026. Los aranceles adicionales a la tecnología china no afectan directamente al Perú, pero podrían generar un encarecimiento de equipos tecnológicos si los fabricantes chinos trasladan el costo al precio de exportación hacia América Latina.`,
    analisis: `La escalada arancelaria EE.UU.-China introduce incertidumbre para el sol peruano en tres canales: (1) mayor volatilidad del yuan (CNY) que históricamente correlaciona con el DXY; (2) potencial presión bajista en el precio del cobre si la actividad industrial china se resiente; (3) menor apetito de riesgo global en emergentes.

El canal más directo es el cobre: si los aranceles generan contracción adicional del PMI chino, el cobre podría ceder a US$ 4.50/libra, reduciendo ingresos de exportación y presionando el sol hacia S/ 3.45-3.50. En QoriCash monitoreamos estos riesgos para ofrecerle siempre el mejor tipo de cambio disponible.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32177182/pexels-photo-32177182.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g015',
    titulo: 'LATAM semanal: sol +0.3%, CLP +1.1%, COP +0.5% — monedas de la región ganan terreno ante DXY débil y recortes regionales',
    descripcion: 'Las principales monedas latinoamericanas cerraron la semana del 30 de junio al 4 de julio con ganancias generalizadas: sol +0.3% (S/ 3.396), CLP +1.1% (912/USD), COP +0.5% (4,155/USD), BRL +0.7% (5.08/USD). El factor común fue el retroceso del DXY a 101.2 y el NFP dentro de expectativas.',
    contenido: `La semana del 30 de junio al 4 de julio marcó la mejor performance semanal de las monedas latinoamericanas en lo que va del Q3: todas las divisas de la región ganaron terreno frente al dólar, aprovechando el retroceso del DXY a 101.2 puntos tras el NFP de junio en 182,000 —compatible con un posible recorte de la Fed en septiembre—.

El sol peruano (PEN) apreció 0.3% cerrando en S/ 3.396, con la apreciación suavizada por intervenciones del BCRP (~US$ 380M en compras). El peso chileno (CLP) fue el mejor de la región con +1.1% (912/USD), impulsado por la señal dovish del BCCh y el rally del cobre. El peso colombiano (COP) ganó 0.5% (4,155/USD) tras el recorte sorpresa del BanRep de 25bps.

El real brasileño (BRL) avanzó 0.7% en la semana (5.08/USD), con el Banco Central do Brasil manteniendo la Selic en 10.50%. El peso mexicano (MXN) se apreció 0.8% (17.2/USD), impulsado por señales de flexibilidad de la Casa Blanca en el T-MEC para sectores no tecnológicos. El peso argentino oficial se mantuvo en 1,285/USD dentro de las bandas.

Para las perspectivas del Q3, el consenso de 15 bancos de inversión (Bloomberg LATAM Outlook julio 2026) proyecta: sol en S/ 3.35-3.45, CLP en 890-930, COP en 4,100-4,300, BRL en 4.9-5.2. El escenario de recorte de la Fed en septiembre mejoraría todos estos rangos hacia la apreciación.`,
    analisis: `El rally semanal de las monedas LATAM es señal de que la región mantiene fundamentos macroeconómicos relativamente sólidos: superávits de cuenta corriente (Chile, Perú), reservas internacionales en máximos (Perú: US$ 73.8B) y bancos centrales creíbles que han controlado la inflación mejor que el promedio emergente. El contexto es favorable para el sol en el H2 2026.

Para empresas con operaciones en múltiples países de la región, la gestión del riesgo cambiario multi-divisa es cada vez más relevante. QoriCash especializa en el mercado PEN/USD, ofreciendo el mejor tipo de cambio disponible en Lima con liquidación en el día.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29032777/pexels-photo-29032777.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
