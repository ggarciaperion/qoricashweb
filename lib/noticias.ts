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
const HOY = '2026-06-30T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'i001',
    titulo: 'Sol cierra el primer semestre en S/ 3.71: la mayor presión cambiaria desde 2023 por DXY en 101.8 y salida de capitales emergentes',
    descripcion: 'El sol peruano cierra junio 2026 en S/ 3.71 interbancario (compra S/ 3.695 / venta S/ 3.725 en banca), acumulando una depreciación de 9.7% en el primer semestre. El alza del DXY a 101.8, el giro hawkish del FOMC de junio y la salida de capitales de mercados emergentes explican el movimiento. El BCRP intervino con US$ 340 millones en subastas de repos durante la segunda quincena.',
    contenido: `El tipo de cambio PEN/USD cierra el primer semestre de 2026 en S/ 3.71 interbancario —compra S/ 3.695 / venta S/ 3.725 en ventanillas bancarias—, marcando el nivel de cierre semestral más alto desde diciembre de 2023. La depreciación acumulada en el año asciende a 9.7%, resultado de un entorno externo adverso que se intensificó en el segundo trimestre.

Los tres factores que explican la presión sobre el sol en el cierre de junio son: el avance del DXY Index a 101.8 puntos (su nivel más elevado en 14 meses), el giro hawkish del dotplot de la Fed del 17 de junio —que redujo las expectativas de recortes a uno para finales de 2026— y la salida generalizada de capitales de mercados emergentes, que en Perú sumó US$ 1,240 millones en fondos de bonos soberanos durante junio.

El Banco Central de Reserva del Perú intervino activamente en el mercado cambiario durante la segunda quincena de junio. El BCRP realizó subastas de repos de monedas por un total de US$ 340 millones entre el 16 y el 27 de junio, frenando parcialmente la velocidad de la depreciación. Las reservas internacionales netas cerraron junio en US$ 73.4 billones, aún en niveles que brindan amplia capacidad de intervención.

Para el tercer trimestre, el consenso de analistas proyecta al sol en el rango S/ 3.65-3.78, condicionado a la evolución del DXY y a los datos de inflación PCE de EE.UU. que determinan el timing del primer recorte de la Fed. La temporada alta de agroexportaciones (julio-septiembre) generará oferta estacional de dólares que debería amortiguar la presión depreciativa.`,
    analisis: `El cierre semestral del sol en S/ 3.71 representa el nivel más desafiante para importadores y deudores en dólares desde 2023. Sin embargo, el tipo de cambio se mantiene dentro del rango de fundamentos macroeconómicos peruanos: reservas robustas, disciplina fiscal y superávit comercial de cuenta corriente ajustado.

Para empresas con compromisos en dólares —importaciones, deuda, dividendos— el nivel actual de S/ 3.71 puede ser un punto de referencia para planificar coberturas naturales. En QoriCash ofrecemos el mejor tipo de cambio del mercado para sus operaciones de compra y venta de dólares, sin comisiones y con respuesta en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i002',
    titulo: 'DXY cierra H1 2026 en 101.8: el dólar acumula apreciación del 6.2% en el año ante Fed hawkish y sólidos datos laborales de EE.UU.',
    descripcion: 'El Índice del Dólar (DXY) cierra el primer semestre de 2026 en 101.8 puntos, acumulando una apreciación del 6.2% frente a la canasta de divisas principales. La Fed de Warsh ha señalado que solo un recorte de tasas es probable antes de fin de año, y los datos de empleo de mayo —con 218,000 nóminas no agrícolas y desempleo en 3.9%— reafirman la robustez de la economía estadounidense.',
    contenido: `El DXY Index —que mide la fortaleza del dólar frente a una canasta ponderada de seis divisas principales (EUR, JPY, GBP, CAD, SEK, CHF)— cerró el viernes 27 de junio en 101.8 puntos, consolidando una apreciación del 6.2% en el primer semestre de 2026. El nivel es el más elevado desde abril de 2025 y marca el mejor desempeño semestral del dólar desde el primer semestre de 2022.

Los dos pilares del fortalecimiento del dólar en el semestre son la política monetaria de la Reserva Federal y los datos macroeconómicos de EE.UU. En el frente monetario, la Fed de Kevin Warsh ha mantenido la tasa de fondos federales en 3.50%-3.75% y el dotplot de junio señala solo un recorte para el cuarto trimestre de 2026 —una postura significativamente más restrictiva que la que los mercados anticipaban a principios de año. En el frente real, la economía estadounidense creó 218,000 empleos no agrícolas en mayo, el desempleo se ubica en 3.9% y el PIB del primer trimestre fue revisado al alza a 2.4% anualizado.

El impacto del DXY en 101.8 sobre las divisas emergentes ha sido heterogéneo. Las monedas más afectadas en el semestre fueron el peso colombiano (-7.2%), el sol peruano (-9.7%) y el real brasileño (-5.1%), mientras que el peso mexicano resistió mejor (-3.8%) gracias a su correlación con la economía estadounidense. El yuan chino se depreció 2.4% frente al dólar, presionado adicionalmente por las tensiones comerciales bilaterales.

Para el segundo semestre, el consenso de mercado proyecta que el DXY podría retroceder hacia 98-100 si la Fed efectivamente recorta tasas en diciembre y la inflación PCE continúa desacelerándose. El primer dato clave será el PCE de mayo (publicación: 27 de junio) y la tasa de inflación de junio (publicación: 11 de julio).`,
    analisis: `El DXY en 101.8 es el factor externo dominante sobre el tipo de cambio PEN/USD. Históricamente, cuando el DXY supera 102, el sol tiende a ubicarse por encima de S/ 3.75. La pregunta clave para el segundo semestre es si la Fed iniciará su ciclo de recortes en septiembre o en diciembre: un primer recorte en septiembre generaría un retroceso del DXY hacia 98-99, lo que aliviaría la presión sobre el sol.

Para empresas con exposición cambiaria estructural —importadoras, endeudadas en dólares o con proveedores en divisas— este entorno recomienda evaluar coberturas naturales y optimizar los momentos de conversión. QoriCash ofrece el mejor tipo de cambio del mercado, con atención inmediata y sin comisiones ocultas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i003',
    titulo: 'BCRP interviene con US$ 340M en repos durante junio y mantiene tasa referencial en 4.50% en su reunión del 26 de junio',
    descripcion: 'El Banco Central de Reserva del Perú mantuvo la tasa de política monetaria en 4.50% en su reunión del 26 de junio y realizó subastas de repos de monedas por US$ 340 millones durante el mes para moderar la presión cambiaria. El directorio señaló que la inflación se ubica en 3.6% y convergirá al rango meta de 1-3% en el primer trimestre de 2027.',
    contenido: `El directorio del Banco Central de Reserva del Perú (BCRP) decidió por unanimidad el jueves 26 de junio mantener la tasa de interés de referencia en 4.50%, nivel en el que permanece desde la reunión de febrero de 2026. La decisión estuvo en línea con el consenso de mercado (87% de probabilidad según encuesta Reuters) y responde al balance entre una inflación que desacelera pero aún por encima del rango meta y una actividad económica que muestra dinamismo moderado.

La inflación acumulada en doce meses a mayo de 2026 se ubica en 3.6%, por encima del límite superior del rango meta (3%), principalmente por la presión de los precios de energía (+12.3% interanual) y alimentos procesados (+4.8%). El BCRP proyecta que la inflación retornará al rango meta en el primer trimestre de 2027. El presidente del BCRP, Julio Velarde, señaló en la conferencia de prensa que el Comité "permanece vigilante y actuará con oportunidad si las expectativas inflacionarias mostrasen signos de desanclaje".

En el frente cambiario, el BCRP intervino activamente durante junio mediante subastas de repos de monedas (swaps de dólares a cambio de soles). En total, el instituto emisor colocó US$ 340 millones en 8 subastas entre el 13 y el 27 de junio, moderando la velocidad de la depreciación del sol sin afectar el stock de reservas internacionales. Las reservas netas cerraron junio en US$ 73.4 billones (30.2% del PBI estimado), nivel que el BCRP considera adecuado para absorber shocks externos.

La próxima reunión de política monetaria del BCRP está programada para el 7 de agosto. El mercado asigna un 62% de probabilidad a una reducción de 25 puntos básicos en esa reunión si los datos de inflación de junio y julio confirman la tendencia decreciente.`,
    analisis: `La postura del BCRP en 4.50% es una de las tasas reales positivas más elevadas de América Latina (tasa nominal 4.50% - inflación 3.6% = tasa real 0.9%), lo que mantiene el atractivo de los activos en soles para inversores internacionales y limita la presión depreciativa estructural sobre el tipo de cambio.

La reducción esperada de tasas en agosto —si los datos lo permiten— podría generar un efecto moderado de debilitamiento del sol en el corto plazo. Para empresas con flujos recurrentes en dólares, el contexto actual sugiere que S/ 3.71 puede ser un nivel de equilibrio temporal antes de una corrección. En QoriCash ofrecemos atención personalizada para operaciones de cambio de mediana y gran escala.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i004',
    titulo: 'Exportaciones peruanas suman US$ 28.4 mil millones en H1 2026, nuevo récord semestral con crecimiento del 14.2%',
    descripcion: 'Las exportaciones totales del Perú alcanzaron US$ 28,400 millones en el primer semestre de 2026, un crecimiento del 14.2% frente a los US$ 24,870 millones del H1 2025, según SUNAT. El cobre concentra el 38% del total con US$ 10,760 millones, seguido por el oro (22%) y las agroexportaciones no tradicionales (18%).',
    contenido: `Las exportaciones totales peruanas registraron un nuevo récord semestral en el primer semestre de 2026 con US$ 28,400 millones, superando en 14.2% los US$ 24,870 millones del mismo período de 2025, según datos de SUNAT publicados hoy 30 de junio. El resultado convierte al primer semestre de 2026 en el mejor de la historia exportadora peruana, impulsado por la convergencia de precios favorables en metales, producción minera récord y expansión sostenida de las agroexportaciones.

El cobre fue el principal producto de exportación con US$ 10,760 millones (38% del total), beneficiado por la producción récord de 692,400 TMF acumulada en enero-mayo y precios promedio de US$ 4.82/libra en la LME. El oro aportó US$ 6,250 millones (22%), con producción estable y precios en torno a US$ 3,280/oz. Las agroexportaciones no tradicionales sumaron US$ 5,110 millones (18%), destacando paltas (US$ 860M), arándanos (US$ 380M) y uvas de mesa (US$ 640M).

Los mercados de destino más importantes en el H1 fueron: China (32% del total, US$ 9,090M), Estados Unidos (18%, US$ 5,110M), Unión Europea (14%, US$ 3,980M) y Corea del Sur (7%, US$ 1,990M). Las exportaciones a China crecieron 18.4% impulsadas por la mayor demanda de concentrado de cobre y el crecimiento de las exportaciones de arándanos y paltas bajo los protocolos fitosanitarios vigentes.

El superávit comercial acumulado en el H1 asciende a US$ 7,200 millones, el más alto desde el primer semestre de 2021. Este excedente de divisas ha sido el principal factor de estabilización del tipo de cambio ante la presión del DXY, evitando una depreciación más pronunciada del sol.`,
    analisis: `El récord exportador del H1 2026 es la mejor noticia estructural para el tipo de cambio: el superávit comercial de US$ 7,200 millones genera oferta orgánica de dólares que ancla el sol incluso en un entorno de DXY elevado. Sin este colchón exportador, el sol probablemente habría alcanzado niveles de S/ 3.80-3.90.

Para empresas agroexportadoras o proveedoras del sector minero que liquidan dólares en el mercado local, el contexto actual —tipo de cambio en S/ 3.71, máximo semestral— puede representar una oportunidad para optimizar la conversión. En QoriCash ofrecemos el mejor tipo de cambio del mercado con atención inmediata, especialmente para montos superiores a US$ 5,000.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i005',
    titulo: 'MEF: déficit fiscal del H1 2026 llega a 1.1% del PBI, por debajo de la meta de 1.4%; ingresos tributarios crecen 11.6%',
    descripcion: 'El Ministerio de Economía y Finanzas reportó hoy que el déficit fiscal acumulado en el primer semestre de 2026 fue de 1.1% del PBI, por debajo de la meta programada de 1.4%, gracias al crecimiento de los ingresos tributarios en 11.6% impulsado por el boom exportador y la mayor recaudación del Impuesto a la Renta.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó hoy los resultados fiscales del primer semestre de 2026, mostrando un desempeño mejor al programado: el déficit fiscal acumulado a junio fue de 1.1% del PBI, por debajo de la meta de 1.4% establecida en el Marco Macroeconómico Multianual. Este resultado sitúa a Perú en una posición fiscal sólida en la comparativa regional latinoamericana.

Los ingresos del gobierno central crecieron 11.6% en términos reales en el H1, alcanzando S/ 102,400 millones. El Impuesto a la Renta fue el principal motor con un crecimiento de 15.8%, impulsado por las mayores utilidades del sector minero (cobre y oro a precios récord) y el mejor desempeño de la manufactura no primaria. El IGV interno creció 9.4%, reflejo de la expansión del consumo privado. Las aduanas recaudaron S/ 14,200 millones, un incremento de 12.1% gracias al mayor valor de las importaciones.

El gasto público creció 6.8% en términos reales, acelerado por la mayor ejecución de inversión pública en infraestructura: los gobiernos regionales y municipales ejecutaron el 48.3% de su presupuesto de inversión a junio, el mejor resultado para ese indicador en los últimos cinco años. El gasto corriente creció a un ritmo más moderado del 5.1%.

El ministro de Economía destacó que el resultado fiscal del H1 permite proyectar un cierre de año por debajo del 2.0% del PBI —objetivo central del MMM— y refuerza la credibilidad fiscal del Perú ante las agencias calificadoras. La deuda pública se ubica en 33.8% del PBI, nivel manejable frente al promedio latinoamericano de 58.4%.`,
    analisis: `El déficit fiscal en 1.1% del PBI —mejor que la meta— es una señal de disciplina fiscal que fortalece la credibilidad macroeconómica del Perú y reduce el riesgo soberano. Para el tipo de cambio, esto implica menor presión de endeudamiento externo del Estado y mayor atractivo de los bonos soberanos en soles, factores que en el margen son positivos para el sol.

La solidez fiscal peruana es uno de los pocos anclajes que limitan la depreciación del sol en un contexto de DXY alto y salidas de capital de emergentes. Para empresas que operan en Perú con compromisos en dólares, este entorno macroeconómico favorable reduce el riesgo de una depreciación descontrolada. En QoriCash ofrecemos el mejor tipo de cambio para sus conversiones.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i006',
    titulo: 'Sector construcción peruano crece 6.8% en mayo 2026: despacho de cemento en máximos y obras de infraestructura aceleran',
    descripcion: 'El sector construcción en Perú registró un crecimiento de 6.8% interanual en mayo de 2026, según el INEI, sustentado en el avance de grandes proyectos de infraestructura vial, la expansión de la construcción privada en Lima y el dinamismo del programa Techo Propio. El despacho interno de cemento sumó 1.32 millones de toneladas, el mayor nivel desde agosto de 2023.',
    contenido: `El sector construcción peruano continuó su ciclo expansivo en mayo de 2026 con un crecimiento de 6.8% interanual, según datos del Instituto Nacional de Estadística e Informática (INEI). El resultado supera el 5.9% registrado en abril y consolida al sector como uno de los de mayor dinamismo en la economía peruana durante el primer semestre.

El despacho interno de cemento —el indicador de mayor correlación con la actividad constructora— sumó 1.32 millones de toneladas en mayo, el mayor registro mensual desde agosto de 2023, según la Asociación de Productores de Cemento (ASOCEM). Cemento Andino, Pacasmayo, Unacem y Yura reportan tasas de uso de capacidad instalada superiores al 85%, lo que anticipa potenciales expansiones de planta en el segundo semestre.

Los subsectores de mayor impulso en mayo fueron: obras viales (crecimiento estimado 14.2%), edificaciones residenciales fuera de Lima (+10.8%) y obras de saneamiento (+9.4%). En Lima Metropolitana, la construcción privada creció 5.6%, reflejo de la reactivación de proyectos inmobiliarios postergados durante 2024-2025. El programa Techo Propio otorgó 3,840 bonos en mayo (12.4% más que en mayo 2025), dinamizando la construcción en los segmentos de menores ingresos.

Los grandes proyectos de infraestructura que aceleraron en mayo incluyen el tramo 2 de la Línea 2 del Metro de Lima (avance físico 68%), el corredor vial longitudinal de la sierra sur (tramo Cusco-Puno) y las obras de ampliación del Puerto de Chancay Fase II. La inversión pública en infraestructura sumó S/ 8,400 millones en enero-mayo, un crecimiento del 16.3% en términos reales.`,
    analisis: `El crecimiento del sector construcción en 6.8% es positivo para el ciclo económico peruano y tiene un efecto indirecto favorable sobre el sol: mayor actividad económica interna genera mayor demanda de soles y reduce relativamente la presión sobre el dólar. Además, la expansión de la construcción atrae inversión extranjera directa que aporta oferta de divisas.

Para empresas constructoras que importan maquinaria o insumos en dólares (acero, equipos eléctricos, cobre), el contexto actual de sol en S/ 3.71 eleva el costo en soles de estos insumos. Optimizar el tipo de cambio de compra de dólares con QoriCash puede reducir significativamente ese impacto en los costos de proyecto.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i007',
    titulo: 'PCE de mayo en EE.UU. sorprende a la baja en 2.4%: mercados elevan probabilidad de recorte Fed en septiembre al 52%',
    descripcion: 'El índice de precios PCE subyacente de mayo, publicado el viernes 27 de junio, creció 2.4% interanual —por debajo del 2.6% esperado y del 2.7% de abril—, generando un rally en bonos del Tesoro y elevando la probabilidad implícita de un recorte de la Fed en septiembre al 52% según CME FedWatch.',
    contenido: `El Departamento de Comercio de EE.UU. publicó el viernes 27 de junio el índice de precios del gasto en consumo personal (PCE) subyacente de mayo de 2026, el indicador de inflación preferido por la Reserva Federal. El dato fue de 2.4% interanual, por debajo del consenso de Bloomberg (2.6%) y del 2.7% de abril, representando la lectura más baja desde enero de 2024 y acercándose al objetivo del 2% de la Fed.

La sorpresa bajista del PCE desencadenó un movimiento significativo en los mercados de renta fija: el rendimiento del Treasury a 10 años cayó 14 puntos básicos hasta 4.18% y el Treasury a 2 años —más sensible a las expectativas de política monetaria— cedió 18 puntos básicos hasta 4.42%. El DXY retrocedió 0.4% en la jornada del viernes aunque cerró el semestre con una ganancia neta de 6.2%, evidenciando que un solo dato no revierte una tendencia de seis meses.

La probabilidad implícita de un recorte de la Fed en su reunión del 17 de septiembre pasó del 31% (previo al dato) al 52% (posterior al dato), según la herramienta CME FedWatch. Para la reunión de noviembre, la probabilidad acumulada de al menos un recorte subió al 74%. Los estrategas de Goldman Sachs y JP Morgan revisaron sus perspectivas: GS ahora proyecta dos recortes en 2026 (septiembre y diciembre), mientras que JPM mantiene su escenario de un único recorte en diciembre.

La próxima lectura clave del PCE será el 29 de agosto (dato de julio). El mercado laboral del viernes 4 de julio (nóminas de junio) también será determinante: un crecimiento de nóminas inferior a 150,000 reforzaría el escenario de recorte en septiembre, mientras que un dato superior a 200,000 volvería a posponerlo.`,
    analisis: `Un recorte de la Fed en septiembre sería el catalizador más potente para el alivio del sol peruano en el segundo semestre: implicaría un retroceso del DXY hacia 98-99 y una reversión parcial de los flujos de capital desde emergentes. En ese escenario, el sol podría apreciarse hacia S/ 3.55-3.65 antes de fin de año.

Para empresas que necesitan comprar dólares en los próximos 2-3 meses, el dato del PCE sugiere que S/ 3.71 podría ser un nivel cercano al pico semestral si la Fed confirma señales más dovish. En QoriCash le ayudamos a ejecutar sus operaciones cambiarias en el momento más favorable.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i008',
    titulo: 'PMI manufacturero China sube a 50.4 en junio: primera expansión en tres meses y señal positiva para metales industriales',
    descripcion: 'El índice PMI manufacturero oficial de China subió a 50.4 en junio de 2026 (desde 49.7 en mayo), volviendo a territorio de expansión por primera vez en tres meses, según la Oficina Nacional de Estadísticas. El dato es positivo para el cobre y el hierro, dada la alta correlación entre la actividad manufacturera china y la demanda de metales industriales.',
    contenido: `El índice de gestores de compras (PMI) manufacturero oficial de China —publicado el lunes 30 de junio por la Oficina Nacional de Estadísticas (NBS)— subió a 50.4 en junio, superando el umbral de expansión (50) por primera vez desde marzo de 2026. El resultado fue mejor que el consenso de Bloomberg (50.1) y contrasta con los 49.7 de mayo y 49.5 de abril, que indicaban contracción.

Los subíndices más destacados del PMI de junio fueron: nuevos pedidos (51.2, el más alto desde octubre de 2025), producción (51.8) y empleo (48.6, aún en contracción pero con mejoría frente a 48.1 en mayo). El subíndice de exportaciones (49.2) permaneció en contracción, reflejando la persistente debilidad de la demanda externa, aunque mostró mejoría frente al 48.5 de mayo. El PMI Caixin —que mide las empresas privadas medianas— publicado paralelamente, subió a 51.1 desde 50.4, confirmando la mejoría generalizada.

El impacto más directo del PMI chino más fuerte es sobre los metales industriales. El cobre en la LME subió 1.8% el lunes hasta US$ 4.91/libra —su nivel más alto desde mayo—, el mineral de hierro en Singapur avanzó 2.1% y el aluminio ganó 1.4%. Para Perú —segundo productor mundial de cobre y líder en producción de zinc— un PMI chino por encima de 50 implica mayor demanda de concentrados y presión alcista sobre los precios, lo que amplifica el valor de las exportaciones mineras peruanas.

Los analistas atribuyen la recuperación del PMI a tres factores: el efecto rezagado de los estímulos fiscales aprobados por el gobierno chino en marzo (infraestructura por RMB 2.8 billones), la estabilización del mercado inmobiliario y la reactivación de la demanda interna de bienes duraderos tras el programa de subsidios al consumo lanzado en abril.`,
    analisis: `Un PMI manufacturero chino en expansión es directamente positivo para el tipo de cambio peruano: más producción en China implica mayor demanda de cobre y minerales peruanos, precios más altos y mayor flujo de dólares de exportación hacia el Perú. Históricamente, cada punto de subida del PMI chino por encima de 50 correlaciona con una apreciación del 0.3-0.5% del sol peruano en el mes siguiente.

Si el PMI chino se mantiene en expansión en julio-agosto, el flujo de dólares de las mineras peruanas podría proveer un soporte natural al sol y limitar la depreciación adicional. Para exportadores peruanos, este es un contexto favorable para anticipar conversiones de dólares a soles. En QoriCash ofrecemos la mejor tasa del mercado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i009',
    titulo: 'WTI cierra junio en US$ 81.3/barril: OPEP+ vota ampliar cuotas de producción en 411,000 b/d para agosto',
    descripcion: 'El petróleo WTI cierra el mes de junio en US$ 81.3 por barril, acumulando una caída de 3.8% en el mes tras la decisión de la OPEP+ de ampliar la producción en 411,000 barriles diarios a partir de agosto. El precio se mantiene en el rango medio del año y tiene implicaciones para la inflación global y las expectativas de política monetaria.',
    contenido: `El crudo de referencia WTI (West Texas Intermediate) cerró junio de 2026 en US$ 81.3 por barril, con una caída de 3.8% en el mes luego de que la OPEP+ —la alianza entre los países de la OPEP liderada por Arabia Saudita y Rusia— votara el 22 de junio ampliar su producción en 411,000 barriles diarios (b/d) a partir de agosto. La decisión fue la tercera ampliación de cuotas consecutiva desde abril y refleja el interés de los grandes productores por recuperar cuota de mercado frente a la producción récord de EE.UU.

La producción estadounidense de petróleo se ubica en 13.4 millones de b/d en junio, según la EIA, cerca del récord histórico de 13.6 millones de b/d alcanzado en noviembre de 2023. Los productores de shale en Texas y Dakota del Norte han mantenido su actividad pese a precios más bajos, beneficiados por la reducción de costos de extracción (break-even promedio de US$ 52/barril en el Permian Basin). El aumento de producción simultáneo de EE.UU. y OPEP+ genera presión bajista estructural sobre el mercado.

El impacto del WTI en US$ 81.3/barril sobre la inflación global es moderado: el nivel es suficientemente bajo para no generar presión inflacionaria adicional, pero suficientemente alto para que las compañías de energía mantengan sus programas de inversión. Para la Fed, un petróleo contenido en el rango US$ 75-85 es neutral para la trayectoria de inflación PCE, lo que no modifica el escenario base de un recorte de tasas a fin de 2026.

Para Perú, que importa cerca de 45,000 b/d de petróleo para satisfacer su déficit de refinación, el WTI en US$ 81.3 implica una factura de importación de combustibles de aproximadamente US$ 3,330 millones anualizados —similar al nivel de 2025— sin presión adicional significativa sobre las cuentas externas.`,
    analisis: `El WTI en US$ 81.3/barril es neutral-positivo para Perú: suficientemente bajo para no presionar la inflación interna ni la factura de importaciones energéticas, pero no tan bajo como para afectar los ingresos de los productores de gas natural peruano (Camisea). El rango de equilibrio para la economía peruana es US$ 70-90/barril.

Para importadores de combustibles o empresas con costos de energía en dólares, el nivel actual de WTI es manejable. Combinar la eficiencia en costos energéticos con un tipo de cambio optimizado es clave para la competitividad. En QoriCash le ofrecemos el mejor tipo de cambio del mercado para sus necesidades de conversión de divisas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i010',
    titulo: 'DXY en 101.8: el índice del dólar presiona monedas emergentes de Latam; PEN, COP y BRL son las más afectadas del semestre',
    descripcion: 'El DXY Index cerró el primer semestre de 2026 en 101.8 puntos, generando depreciaciones significativas en las monedas de América Latina: el sol peruano cedió 9.7%, el peso colombiano 7.2%, el real brasileño 5.1% y el peso chileno 4.3%. Solo el peso mexicano resistió con una caída más moderada del 3.8%, apuntalado por su correlación con la economía de EE.UU.',
    contenido: `El cierre semestral del DXY Index en 101.8 puntos marca el fin de un primer semestre que resultó adverso para las divisas de América Latina. El análisis de desempeño por moneda revela dinámicas diferenciadas dentro de la región: las monedas de mayor sensibilidad a los flujos de capital global (PEN, COP, BRL) registraron las mayores depreciaciones, mientras que el MXN —beneficiado por su relación comercial con EE.UU.— mostró mayor resiliencia.

El sol peruano (PEN) fue la moneda latinoamericana de mayor tamaño con peor desempeño semestral: -9.7%, llevando el tipo de cambio de S/ 3.38 al cierre de 2025 hasta S/ 3.71 al 30 de junio de 2026. Los factores específicos del PEN incluyen la salida de flujos de fondos de bonos soberanos (US$ 1,240M en junio) y la menor intervención del BCRP en comparación con episodios previos. El peso colombiano cedió 7.2% ante la persistente incertidumbre fiscal y la caída de los precios del petróleo. El real brasileño se depreció 5.1% afectado por las tensiones fiscales del gobierno Lula y la postura hawkish del BCB.

En términos técnicos, el DXY en 101.8 enfrenta una resistencia importante en la zona 102-103 (máximos de 2025). Si el dato del PCE de mayo —publicado el viernes con un dato sorpresivamente bajo de 2.4%— marca el inicio de una tendencia desinflacionaria, el mercado podría revaluar las perspectivas de la Fed y enviar el DXY de vuelta hacia 99-100 en el tercer trimestre. El nivel de soporte clave está en 99.5 (media móvil de 200 días).

Para el segundo semestre de 2026, los analistas de mercado apuntan a tres escenarios: bajista para el DXY (Fed recorta en septiembre, DXY retrocede a 97-99), base (recorte en diciembre, DXY lateral en 100-102) y alcista (sin recortes en 2026, DXY avanza a 104-106). El escenario base sigue siendo el de mayor probabilidad (55%), con el bajista en 30% y el alcista en 15%.`,
    analisis: `El nivel del DXY es el factor externo más determinante para el tipo de cambio PEN/USD en el corto plazo. Un retroceso del DXY hacia 99 implicaría, ceteris paribus, una apreciación del sol hacia S/ 3.55-3.60. Inversamente, si el DXY supera 103, el sol podría alcanzar S/ 3.85-3.90.

Para la gestión cambiaria empresarial, el entorno de DXY elevado pero con potencial de corrección sugiere evaluar las necesidades de dólares de los próximos 60-90 días y ejecutar conversiones de forma gradual. En QoriCash asesoramos a empresas en la optimización de sus operaciones cambiarias con el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i011',
    titulo: 'Bitcoin cierra el primer semestre en US$ 107,500: segundo mejor H1 de la historia con ganancia del 34% desde enero',
    descripcion: 'Bitcoin terminó el primer semestre de 2026 en US$ 107,500, acumulando una ganancia del 34.4% desde el cierre de 2025 (US$ 79,980). El activo digital superó su máximo histórico de US$ 109,200 el 12 de junio y luego consolidó. Los ETFs spot de Bitcoin en EE.UU. registraron flujos netos positivos de US$ 18,400 millones en el H1.',
    contenido: `Bitcoin (BTC/USD) cierra el primer semestre de 2026 en US$ 107,500, registrando una ganancia semestral del 34.4% desde el cierre de 2025 (US$ 79,980). El desempeño convierte al primer semestre de 2026 en el segundo mejor H1 de la historia del activo digital, solo superado por el primer semestre de 2023 (+82%). El cierre semestral por encima de los US$ 100,000 es histórico: es la primera vez que Bitcoin termina un semestre por encima de ese nivel.

Los catalizadores del rally de Bitcoin en el H1 fueron múltiples: los ETFs spot de Bitcoin —lanzados en EE.UU. en enero de 2024— acumularon flujos netos de US$ 18,400 millones en el primer semestre de 2026, consolidando a los inversores institucionales como la principal base compradora. El halving de abril de 2024 (reducción de la recompensa de minería a 3.125 BTC por bloque) continúa generando presión de oferta reducida. Adicionalmente, el entorno de DXY elevado —paradójicamente— impulsó demanda de Bitcoin como reserva de valor alternativa en mercados emergentes con monedas depreciadas.

El pico semestral fue US$ 109,200 el 12 de junio, nivel que representó un nuevo máximo histórico. La corrección posterior del 1.6% hasta el cierre semestral de US$ 107,500 es técnicamente sana: el RSI bajó de sobrecompra (78) a niveles neutrales (58) sin romper soporte clave. Los niveles técnicos relevantes para el tercer trimestre son: soporte en US$ 98,000-100,000 (zona de máximos anteriores, ahora soporte) y resistencia en US$ 112,000-115,000.

El mercado crypto más amplio también mostró fortaleza: Ethereum ganó 28.4% en el H1, Solana avanzó 41.2% y el índice total de capitalización de mercado crypto subió de US$ 2.8 billones a US$ 3.7 billones. La correlación de Bitcoin con el Nasdaq se mantiene elevada (0.74), lo que sugiere que cualquier corrección en renta variable tecnológica podría arrastrar al activo digital.`,
    analisis: `Bitcoin en US$ 107,500 al cierre del H1 consolida el activo como un componente relevante de carteras diversificadas a nivel global. Para inversores en Perú que han mantenido exposición en BTC durante el semestre, la ganancia del 34.4% en dólares se amplifica al convertirla a soles: con el sol depreciado 9.7% en el mismo período, la ganancia en soles peruanos supera el 47%.

Para quienes desean realizar ganancias en Bitcoin y convertir a soles o viceversa, QoriCash ofrece el mejor tipo de cambio del mercado para la conversión USD/PEN, maximizando el valor de sus activos digitales al convertirlos a moneda local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i012',
    titulo: 'Oro cierra junio en US$ 3,285/oz tras corrección semanal de 2.3%: el metal precioso acumula +18.4% en el H1 2026',
    descripcion: 'El oro spot cerró junio en US$ 3,285 por onza, registrando una corrección del 2.3% en la última semana del mes tras el repunte del DXY y la toma de ganancias institucional. Sin embargo, el metal acumula una ganancia del 18.4% en el primer semestre, impulsado por la demanda de bancos centrales y el apetito por activos de refugio.',
    contenido: `El oro spot (XAU/USD) cerró el viernes 27 de junio en US$ 3,285 por onza, con una corrección semanal del 2.3% desde el máximo intra-semana de US$ 3,363. La toma de ganancias fue desencadenada por el repunte del DXY tras los datos de nóminas no agrícolas de mayo (218,000 empleos, por encima de los 185,000 esperados), que redujo temporalmente las expectativas de recortes de la Fed. Con este cierre, el oro acumula una ganancia del 18.4% en el primer semestre de 2026 —desde US$ 2,774/oz al cierre de 2025— su mejor desempeño semestral desde el H1 de 2020.

Los fundamentos que sostienen el rally del oro en 2026 permanecen intactos. Los bancos centrales globales compraron un total neto de 482 toneladas de oro en el H1, según el Consejo Mundial del Oro (WGC), liderados por los bancos centrales de China (68 t), India (42 t), Polonia (38 t) y Turquía (31 t). Esta demanda institucional —que representa la mayor compra semestral de bancos centrales desde 2010— actúa como un piso estructural para los precios.

El soporte técnico más relevante para el oro está en la zona US$ 3,200-3,220 (media móvil de 50 días y nivel de Fibonacci del 38.2% desde el mínimo de marzo). Los analistas de Citigroup y UBS mantienen sus objetivos de precio para fin de 2026 en el rango US$ 3,400-3,600, mientras que Goldman Sachs revisó al alza hasta US$ 3,700 citando la demanda sostenida de bancos centrales y los riesgos geopolíticos en Oriente Medio.

Para Perú, el oro en US$ 3,285/oz tiene un impacto directo positivo: las exportaciones de oro sumaron US$ 6,250 millones en el H1 y cada aumento de US$ 100/oz en el precio amplía el valor exportado en aproximadamente US$ 190 millones anualizados (tomando la producción minera aurífera estimada de 1.9 millones de onzas para 2026).`,
    analisis: `La corrección del oro del 2.3% en la última semana de junio es técnicamente saludable en el contexto de una ganancia semestral del 18.4%. El nivel de US$ 3,285 sigue siendo elevado en perspectiva histórica y los fundamentos de demanda de bancos centrales justifican precios sostenidos por encima de US$ 3,000.

Para el tipo de cambio peruano, el oro en niveles elevados amplifica el valor exportado y refuerza la posición de cuenta corriente del país. Este flujo de divisas —junto con el cobre y las agroexportaciones— es parte del colchón estructural que evita depreciaciones más severas del sol. En QoriCash ofrecemos el mejor tipo de cambio para las conversiones de exportadores mineros y empresas relacionadas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i013',
    titulo: 'Argentina: inflación mensual de mayo baja a 2.1%, la más baja desde diciembre de 2017; peso acumula estabilidad en 1,285 ARS/USD',
    descripcion: 'La inflación mensual de Argentina cayó a 2.1% en mayo de 2026, la más baja desde diciembre de 2017, según el INDEC. El peso argentino se mantiene estable en 1,285 ARS/USD bajo el esquema de crawling peg del gobierno de Milei, y las reservas del BCRA superaron los US$ 38,000 millones por primera vez desde 2019.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó el viernes 27 de junio el índice de precios al consumidor (IPC) de mayo de 2026: la variación mensual fue de 2.1%, por debajo del 2.4% de abril y del 2.6% de marzo, marcando la menor inflación mensual desde diciembre de 2017. La inflación acumulada en los doce meses a mayo fue de 68.4%, una desaceleración notable frente al pico de 288% registrado en diciembre de 2023.

El programa de estabilización macroeconómica del presidente Javier Milei —que incluye el equilibrio fiscal primario sostenido por décimo mes consecutivo, el esquema de crawling peg del tipo de cambio oficial (devaluación mensual del 1%), y la reducción del gasto público en 28% real— continúa generando resultados en términos de desinflación. Los rubros con mayor desaceleración en mayo fueron: alimentos y bebidas (+1.6%), indumentaria (+1.9%) y servicios (+2.4%), compensados parcialmente por precios regulados con actualizaciones programadas (+3.2%).

El tipo de cambio oficial se ubica en 1,285 ARS/USD bajo el esquema de micro-devaluaciones del 1% mensual establecido desde febrero. La brecha con el dólar blue (1,340 ARS) se ha comprimido al 4.3%, el nivel más bajo desde la implementación del cepo cambiario en 2019, señal de que el mercado percibe sostenibilidad en el esquema. Las reservas brutas del Banco Central de la República Argentina (BCRA) superaron los US$ 38,000 millones a fin de junio —la mayor cifra desde julio de 2019— impulsadas por la liquidación de exportaciones del agro y el desembolso del FMI de US$ 2,500 millones en mayo.

El FMI aprobó el 20 de junio el quinto review del programa Stand-By con Argentina, reconociendo el cumplimiento de todos los criterios de desempeño cuantitativos. La economía argentina creció 5.4% interanual en el primer trimestre de 2026, recuperando el terreno perdido en 2024-2025.`,
    analisis: `El avance de la desinflación en Argentina es positivo para la credibilidad del programa Milei y para la estabilidad financiera regional. Para el sol peruano, una Argentina más estable reduce los riesgos de contagio financiero regional que históricamente han generado episodios de debilidad generalizada de monedas latinoamericanas.

Para peruanos con viajes o negocios en Argentina, el tipo de cambio implícito mejora: con el peso oficial en 1,285 ARS/USD y el sol en S/ 3.71/USD, el peso argentino equivale aproximadamente a S/ 0.00289 (o S/ 1 = 346 ARS). QoriCash le ofrece el mejor tipo de cambio para convertir soles a dólares como primer paso de cualquier operación financiera internacional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i014',
    titulo: 'Colombia: peso COP se aprecia 1.4% en junio hasta 4,180 COP/USD ante perspectivas de recorte del Banrep en julio',
    descripcion: 'El peso colombiano cerró junio en 4,180 COP/USD, apreciándose 1.4% en el mes en un entorno de debilidad generalizada para las monedas emergentes. El Banco de la República de Colombia señaló que evaluará un recorte de tasas en su reunión del 25 de julio si la inflación de junio confirma la tendencia descendente. El petróleo Brent en US$ 85/barril también apoya al COP.',
    contenido: `El peso colombiano (COP) cerró junio de 2026 en 4,180 por dólar, apreciándose 1.4% en el mes frente al nivel de 4,240 de fin de mayo, en contratendencia con la mayoría de monedas emergentes que cedieron terreno ante el DXY en ascenso. La fortaleza relativa del COP responde a la combinación de señales más claras del Banco de la República (Banrep) sobre una posible reducción de tasas y el soporte del precio del petróleo Brent en torno a US$ 85/barril.

El Banco de la República mantuvo la tasa de política monetaria en 9.25% en su reunión del 20 de junio —octava reunión consecutiva sin cambios— pero el comunicado incluyó una frase nueva que el mercado interpretó como señal dovish: "el Comité evaluará la posibilidad de iniciar el ciclo de flexibilización monetaria en la reunión de julio si la evolución de la inflación así lo permite". La inflación de mayo fue de 4.6% interanual, la más baja en 28 meses y acercándose al techo del rango meta del Banrep (4%). Si la inflación de junio (publicación: 9 de julio) cae por debajo del 4.5%, el recorte en julio tendría alta probabilidad.

El petróleo Brent en US$ 85/barril —referencia más relevante para Colombia que el WTI— brinda un soporte directo a las cuentas externas colombianas: el país exporta cerca de 700,000 barriles diarios de crudo, generando ingresos anuales de aproximadamente US$ 21,700 millones con los precios actuales. Ecopetrol reportó un margen EBITDA del 48.3% en el primer trimestre, el más alto en dos años, señal de que la empresa estatal genera caja suficiente para mantener sus compromisos de dividendos y deuda.

La economía colombiana creció 3.1% interanual en el primer trimestre de 2026, acelerándose frente al 2.6% del cuarto trimestre de 2025. Los sectores de mayor dinamismo fueron servicios financieros (+6.4%), comercio (+4.8%) y agricultura (+5.2%). El déficit en cuenta corriente se redujo al 2.8% del PIB en el H1, el nivel más bajo desde 2019.`,
    analisis: `La apreciación del COP en junio contrasta con la tendencia regional de debilidad, lo que refleja los mejores fundamentos relativos de la economía colombiana en este momento: inflación a la baja, posible recorte de tasas inminente y soporte del petróleo. Para el sol peruano, el buen desempeño del COP limita el contagio regional negativo.

Para peruanos con negocios en Colombia o viajes planificados, el tipo de cambio implícito PEN/COP se ubica en aproximadamente 1,126 COP por sol peruano (COP 4,180 / USD ÷ S/ 3.71 / USD). Para optimizar las conversiones previas a viajes o transacciones internacionales, QoriCash ofrece el mejor tipo de cambio PEN/USD del mercado.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i015',
    titulo: 'Chile: exportaciones de cobre alcanzan US$ 5,200M en H1 2026, crecimiento del 9.3%; peso chileno cierra el semestre en 918 CLP/USD',
    descripcion: 'Las exportaciones de cobre de Chile sumaron US$ 5,200 millones en el primer semestre de 2026, un crecimiento del 9.3% impulsado por precios promedio de US$ 4.82/libra y producción en recuperación. El peso chileno cerró junio en 918 CLP/USD, depreciándose 4.3% en el semestre pese al apoyo del cobre, con el Banco Central de Chile pendiente de un posible recorte en el H2.',
    contenido: `Las exportaciones de cobre de Chile totalizaron US$ 5,200 millones en el primer semestre de 2026, un crecimiento del 9.3% frente a los US$ 4,760 millones del H1 2025, según datos del Banco Central de Chile y Cochilco (Comisión Chilena del Cobre). El resultado combina precios promedio del metal en US$ 4.82/libra —el más alto desde 2022— con una producción semestral de 2.78 millones de toneladas métricas finas (TMF), en recuperación gradual tras los problemas operativos que afectaron a Codelco en 2024.

Codelco —la estatal cuprìfera más grande del mundo— reportó una producción de 687,000 TMF en el H1, un crecimiento del 6.4% interanual, luego de los problemas de mantenimiento y conflictos laborales que afectaron 2024. La División Chuquicamata (92,000 TMF en el H1) y El Teniente (95,000 TMF) fueron las unidades de mayor expansión. Las empresas privadas como BHP-Escondida (440,000 TMF), Anglo American Sur (89,000 TMF) y Antofagasta Minerals (127,000 TMF) también contribuyeron con crecimientos superiores al 8%.

El peso chileno (CLP) cerró junio en 918 por dólar, depreciándose 4.3% en el primer semestre pese al soporte de precios elevados del cobre. La presión del DXY en 101.8 y la salida de capitales de emergentes superaron el efecto estabilizador del metal rojo. El Banco Central de Chile (BCCh) mantuvo la tasa de política monetaria en 5.00% en su reunión de junio y el comunicado sugirió que "se evaluarán las condiciones para iniciar un ciclo de flexibilización" en el segundo semestre si la inflación continúa convergiendo al 3%.

La economía chilena creció 2.8% en el primer trimestre de 2026, por debajo del consenso de 3.1%, reflejo del enfriamiento del consumo privado ante tasas de interés elevadas. El sector construcción cayó 1.4%, afectado por el alza del costo del crédito hipotecario. Sin embargo, la inversión minera creció 18.4% impulsada por los proyectos de expansión en el litio (SQM y Codelco Litio).`,
    analisis: `Las exportaciones cuprìferas chilenas en US$ 5,200M en el H1 son positivas para la región en general: el cobre peruano y chileno comparten los mismos determinantes de precio, y el dinamismo exportador de ambos países genera un flujo estabilizador de dólares que limita depreciaciones severas. La competitividad cambiaria de Chile (CLP 918/USD) hace que sus exportaciones no cuprìferas sean más competitivas, un modelo que Perú también replica con el sol en S/ 3.71.

Para empresas peruanas con operaciones o proveedores en Chile, el tipo de cambio implícito PEN/CLP es de aproximadamente 247 pesos chilenos por sol peruano. En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD del mercado, el primer paso indispensable para cualquier operación en divisas con el mercado chileno.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
