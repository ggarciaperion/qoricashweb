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
const HOY = '2026-07-09T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
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
    id: 'h001',
    titulo: 'Mercados globales caen este miércoles: S&P 500 -0.76%, Nasdaq -1.11%, Dow -1.35% — digestión post-CPI y espera de actas FOMC hoy',
    descripcion: 'Los mercados de acciones de EE.UU. operan en rojo este miércoles 8 de julio, digiriendo el CPI de ayer y aguardando las actas del FOMC que se publican hoy. S&P 500 cede 0.76%, Nasdaq 1.11% y Dow Jones 1.35%. El oro retrocede 1.53% a US$ 4,082 y el WTI sube 4.83% a US$ 73.84.',
    contenido: `Los principales índices bursátiles de Wall Street operan con pérdidas este miércoles 8 de julio en una jornada marcada por la digestión del dato de inflación de EE.UU. publicado ayer martes 7 y la espera de las actas del FOMC a las 2:00 pm ET de hoy. El S&P 500 cede 0.76% a 7,480 puntos, el Nasdaq retrocede 1.11% a 25,832 y el Dow Jones pierde 1.35% a 52,337.

El movimiento de hoy responde a un patrón clásico de "sell the news": tras la incertidumbre de días anteriores sobre el CPI, los inversores recogen beneficios independientemente del resultado. El sector tecnológico lidera las caídas (Nasdaq -1.11%), mientras defensivos como utilities y consumo básico resisten mejor.

Las actas del FOMC de la reunión del 17-18 de junio se publican hoy a las 2:00 pm ET. El mercado buscará señales sobre el debate interno entre los funcionarios más hawkish (Waller, Bowman) y los más dovish (Jefferson, Cook) respecto al timing del primer recorte de 2026. El consenso CME FedWatch ubica la probabilidad de recorte en septiembre en 58%.

Para el sol peruano, el contexto de mercados globales en corrección modera la presión apreciadora. El TC interbancario cerró ayer martes 7 en S/ 3.406 y el BCRP mantiene vigilancia activa del mercado.`,
    analisis: `La corrección de hoy en Wall Street, combinada con la caída del oro (-1.53%) y el BTC (-1.57%), refleja un ajuste de posicionamiento post-CPI más que un cambio de tendencia. El sol peruano se beneficia de la estabilidad relativa del DXY en 101.0. En QoriCash atendemos sus operaciones cambiarias al mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'CPI EE.UU. junio publicado ayer martes 7: resultado y reacción del mercado cambiario — DXY se mantiene en 101.0 este miércoles',
    descripcion: 'El IPC de junio de EE.UU. se publicó ayer martes 7 de julio. El DXY se mantiene en 101.0 este miércoles 8 (-0.15%), reflejando un resultado que no alteró significativamente las expectativas de la Fed. El sol peruano mantiene el TC interbancario en torno a S/ 3.406.',
    contenido: `El dato del Índice de Precios al Consumidor (CPI) de junio de Estados Unidos, publicado ayer martes 7 de julio, no generó una dislocación significativa en el mercado de divisas: el DXY se mantiene en 101.0 este miércoles (-0.15%), señal de que el resultado estuvo cerca del consenso.

El mercado de futuros implica que la probabilidad de un recorte de 25bps de la Fed en septiembre se mantiene en el rango del 58-62%, sin un movimiento brusco en ninguna dirección. El mercado de bonos del Tesoro de EE.UU. muestra rendimientos del Treasury a 10 años estables en torno a 4.28%.

Para el sol peruano, la estabilidad del DXY post-CPI es positiva: el TC interbancario BCRP cerró en S/ 3.406 ayer y la apertura de hoy miércoles 8 transcurre sin presiones cambiarias significativas. El BCRP mantiene vigilancia del mercado con reservas internacionales en US$ 74.1B.

El próximo evento relevante para el TC hoy es la publicación de las actas del FOMC a las 2:00 pm ET (2:00 pm Lima). Un tono más hawkish de lo esperado podría presionar el DXY al alza y el sol hacia S/ 3.42-3.44.`,
    analisis: `La estabilidad del DXY en 101.0 post-CPI confirma el escenario base: dato en línea con el consenso, sin sorpresas que cambien el rumbo de la Fed. El sol peruano mantiene un rango favorable en S/ 3.40-3.41. Las actas FOMC de hoy son el siguiente catalizador. En QoriCash ejecutamos sus operaciones al mejor tipo de cambio disponible.`,
    categoria: 'Internacional',
    fuente: 'Reuters',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'WTI sube 4.83% a US$ 73.84: tensión en el Estrecho de Ormuz escala — impacto en costos de importación peruanos',
    descripcion: 'El petróleo WTI registra una de sus mayores subidas de la semana, avanzando 4.83% a US$ 73.84 por barril este miércoles 8 de julio. La escalada de tensiones en el Estrecho de Ormuz y reportes de reducción del rig count en EE.UU. impulsan el repunte. El alza del crudo presiona costos de importación y podría moderar la desinflación global.',
    contenido: `El precio del petróleo WTI sube 4.83% a US$ 73.84 por barril este miércoles 8 de julio, en el mayor repunte diario de las últimas tres semanas. Los dos factores detrás del movimiento son: (1) la escalada de tensiones en el Estrecho de Ormuz, por donde transita el 21% del petróleo global, con reportes de incidentes que ponen en riesgo el tránsito de buques tanqueros; y (2) la caída del rig count activo en EE.UU. publicada el viernes pasado, que anticipa menor producción doméstica en los próximos meses.

El Brent, referencia internacional, sube en paralelo a US$ 76.20 (+4.1%), mientras el NYMEX registra volúmenes por encima del promedio de 20 días, señal de posicionamiento especulativo de corto plazo.

Para Perú, el alza del WTI tiene implicaciones directas: (1) mayor costo de importación de combustibles vía Petroperú y distribuidores privados; (2) presión al alza en la inflación de transporte y alimentos procesados; (3) potencial reducción de la balanza comercial energética. Sin embargo, el efecto inflacionario pleno se sentiría recién en 2-3 semanas dado el rezago de ajuste de precios en grifos.

El BCRP observará el movimiento del WTI con atención, ya que un alza sostenida del crudo podría complicar la convergencia de la inflación peruana hacia el rango meta de 1%-3%.`,
    analisis: `Un WTI en US$ 73.84 (+4.83%) es un shock de oferta que no debería interpretarse como tendencial hasta que se resuelva la situación en Ormuz. Para empresas con costos energéticos o de transporte, el nivel actual es un punto de atención. Para el tipo de cambio, el efecto neto es moderadamente negativo para el sol (mayor demanda de dólares para importar combustibles).`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'Actas FOMC hoy miércoles 8 de julio: mercado anticipa debate entre hawkish y dovish sobre timing del primer recorte de 2026',
    descripcion: 'Las actas de la reunión del FOMC del 17-18 de junio se publican hoy miércoles 8 de julio a las 2:00 pm ET. El mercado busca señales sobre el debate interno de la Fed respecto al primer recorte. La probabilidad CME de recorte en septiembre está en 58% y podría moverse significativamente según el tono de las actas.',
    contenido: `La Reserva Federal publica hoy miércoles 8 de julio a las 2:00 pm ET (2:00 pm Lima) las actas de su reunión del FOMC del 17 y 18 de junio de 2026, donde mantuvo el rango objetivo de fondos federales en 4.25%-4.50% por unanimidad. Los mercados asignan la mayor importancia de la semana a este documento, después del CPI de ayer.

El debate interno que el mercado busca identificar: (1) ¿Cuántos miembros del FOMC consideran que la política actual es "suficientemente restrictiva" para bajar inflación sin desacelerar la economía? (2) ¿Existe consenso emergente sobre un recorte en septiembre o noviembre? (3) ¿Qué nivel de datos de inflación adicionales se requiere para dar el primer paso?

Los funcionarios más hawkish (Waller, Bowman, Barkin) han señalado que prefieren esperar más evidencia de desinflación antes de recortar. Los más dovish (Jefferson, Cook, Daly) han expresado mayor apertura al recorte si los datos continúan mejorando. Un tono hawkish en las actas elevaría el DXY y presionaría al sol hacia S/ 3.42-3.45.

La probabilidad de recorte en septiembre según CME FedWatch es actualmente del 58%, y el mercado espera al menos un recorte en 2026 con 79% de probabilidad.`,
    analisis: `Las actas FOMC son el evento del día para el mercado cambiario. Un tono hawkish (más miembros prefieren esperar) podría elevar el DXY de 101.0 a 102-103 y presionar el sol hacia S/ 3.42-3.45. Un tono dovish (debate sobre timing pero apertura al recorte) mantendría el DXY estable o lo llevaría a 100-100.5, beneficiando al sol.`,
    categoria: 'Internacional',
    fuente: 'Fed',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'Oro cae 1.53% a US$ 4,082/oz: corrección técnica post-CPI reduce el apetito por activos refugio',
    descripcion: 'El oro retrocede 1.53% a US$ 4,082 por onza este miércoles 8, en una corrección técnica posterior a la publicación del CPI de ayer. La caída se da en contexto de un DXY estable y tasas reales ligeramente al alza. Goldman Sachs mantiene su objetivo de US$ 4,500/oz para fin de 2026.',
    contenido: `El precio del oro (XAU/USD) retrocede 1.53% a US$ 4,082 por onza este miércoles 8 de julio, en una corrección técnica que sigue al dato del CPI de EE.UU. publicado ayer. La caída refleja una reducción del apetito por activos refugio tras la resolución de la incertidumbre inflacionaria de corto plazo.

El movimiento es consistente con el patrón histórico post-CPI: cuando el dato queda cerca del consenso (sin sorpresa significativa), el oro tiende a corregir entre 1% y 2% en las 24 horas siguientes, ya que se reduce la prima de incertidumbre. Las tasas reales implícitas (TIPS a 10 años) suben levemente a -0.18%, lo que reduce marginalmente el atractivo relativo del metal.

La perspectiva de mediano plazo permanece alcista: Goldman Sachs mantiene su precio objetivo de US$ 4,500/oz para diciembre de 2026, impulsado por compras continuas de bancos centrales de economías emergentes (China, India, Turquía, Polonia) y demanda de cobertura ante riesgos geopolíticos. El Q2 2026 registró compras netas de bancos centrales de 290 toneladas, récord trimestral.

Soporte técnico inmediato en US$ 4,020 (MA20 diaria) y resistencia en US$ 4,180 (máximo reciente).`,
    analisis: `La corrección del oro a US$ 4,082 es una oportunidad de análisis: si las actas FOMC de hoy tienen tono hawkish, el oro podría ceder más hacia US$ 3,980-4,020. Si el tono es neutro o dovish, el soporte en US$ 4,020 debería mantenerse. Para el sol peruano, la caída del oro reduce marginalmente el ingreso de divisas del sector minero.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'BCRP: mercado cambiario en equilibrio este miércoles — TC interbancario en torno a S/ 3.406 con reservas en US$ 74.1B',
    descripcion: 'El mercado cambiario peruano opera con estabilidad este miércoles 8 de julio. El TC interbancario se mantiene en el rango S/ 3.40-3.41, cerca del cierre de ayer martes 7 en S/ 3.406. El BCRP tiene margen de intervención con reservas en US$ 74.1B, equivalente al 34% del PBI.',
    contenido: `El mercado cambiario peruano abre el miércoles 8 de julio en condiciones de estabilidad relativa. El tipo de cambio interbancario se mueve en el rango S/ 3.40-3.41, sin grandes movimientos tras la publicación del CPI de EE.UU. ayer. El BCRP mantiene monitoreo activo del mercado, con capacidad de intervención respaldada por reservas de US$ 74.1 billones —el nivel más alto de la historia del banco central peruano.

Los factores que anclan al sol en el rango actual: (1) flujo agroexportador continuo (temporada alta de arándanos con US$ 160M semanales de conversión de divisas); (2) superávit fiscal del primer semestre (déficit de solo 1.1% del PBI, el más bajo desde 2019); (3) demanda estacional de soles por sector construcción (+5.8% a/a en mayo); (4) operaciones de repos del BCRP que drenan liquidez en dólares del sistema.

El evento de riesgo del día para el TC es la publicación de las actas del FOMC de EE.UU. a las 2:00 pm ET. Dependiendo del tono: un FOMC hawkish presionaría el DXY al alza y el TC hacia S/ 3.42-3.44; un FOMC dovish mantendría el rango S/ 3.39-3.41.

El TC SUNAT vigente (referencia para pagos de comercio exterior) es de S/ 3.411 venta.`,
    analisis: `El sol peruano llega al miércoles en posición técnicamente sólida: reservas record, superávit fiscal, flujo exportador activo. El riesgo del día es el FOMC de las 2pm ET. En QoriCash monitoreamos el TC en tiempo real y ejecutamos sus operaciones al mejor precio disponible.`,
    categoria: 'Nacional',
    fuente: 'BCRP',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Bitcoin cae 1.57% a US$ 62,304: corrección en activos de riesgo arrastrada por mercados de acciones',
    descripcion: 'Bitcoin retrocede 1.57% a US$ 62,304 este miércoles 8, siguiendo la corrección general de activos de riesgo. La criptomoneda opera por debajo de los US$ 63,000 por primera vez en la semana. Soporte técnico clave en US$ 60,000, zona de demanda institucional y umbral psicológico.',
    contenido: `Bitcoin (BTC) retrocede 1.57% a US$ 62,304 este miércoles 8 de julio, en línea con la corrección general de activos de riesgo. La criptomoneda opera en sincronía con las acciones de tecnología (Nasdaq -1.11%), reflejando un entorno de menor apetito por riesgo en la jornada.

El flujo neto de ETFs de Bitcoin en EE.UU. (BlackRock, Fidelity, Ark) muestra salidas moderadas de US$ 280M en las últimas 24 horas, tras semanas de entradas consistentes. Este dato sugiere que parte de la caída es impulsada por realizaciones de ganancias de inversores institucionales que aprovechan niveles altos.

Soporte técnico inmediato en US$ 61,000 (MA20 diaria) y soporte clave en US$ 60,000, zona que ha actuado como piso durante las últimas tres correcciones del activo. Una ruptura por debajo de US$ 60,000 abriría la puerta a US$ 56,000-57,000.

El halving de abril 2024 continúa siendo el catalizador de largo plazo: históricamente, los 12-18 meses post-halving registran el mayor retorno de BTC. El ciclo actual va por el mes 14 del post-halving.`,
    analisis: `La caída de BTC a US$ 62,304 es consistente con la corrección de activos de riesgo de hoy. No hay catalizadores negativos específicos de la industria cripto. El soporte en US$ 60,000 es el nivel crítico a monitorear. Para el tipo de cambio PEN/USD, la correlación con BTC es baja, por lo que el movimiento no tiene impacto directo.`,
    categoria: 'Internacional',
    fuente: 'CoinGecko',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'DXY en 101.0: el dólar se estabiliza post-CPI — tres escenarios para el TC PEN/USD según resultado de actas FOMC hoy',
    descripcion: 'El índice del dólar DXY se mantiene en 101.0 (-0.15%) este miércoles 8, estabilizado tras el dato del CPI de ayer. El mercado ahora focaliza su atención en las actas del FOMC que se publican hoy a las 2pm ET. Tres escenarios según el tono de las actas: hawkish (DXY a 102), neutro (DXY 100-101), dovish (DXY a 99-100).',
    contenido: `El índice del dólar DXY cotiza en 101.0 este miércoles 8 de julio, con una variación de -0.15% respecto al cierre anterior, en una jornada de consolidación post-CPI. La estabilidad del dólar refleja que el dato de ayer no generó una dislocación significativa en las expectativas de política monetaria de la Fed.

El mercado de futuros de divisas muestra posicionamiento mixto: los especuladores mantienen una posición neta corta en dólares de -38,200 contratos según el último reporte CFTC (martes 1 de julio), el mayor posicionamiento bajista desde agosto 2023. Sin embargo, la posición está modera desde el máximo de -45,200 de dos semanas atrás.

Los tres escenarios para el DXY según el resultado de las actas FOMC de hoy (2:00 pm ET):

(1) Actas hawkish (debate extenso sobre riesgos de recorte prematuro, pocas señales de corte en septiembre): DXY sube a 101.8-102.5, sol presionado hacia S/ 3.42-3.45.

(2) Actas neutras (debate equilibrado, sin señales claras de timing): DXY se mantiene en 100.5-101.5, sol estable en S/ 3.40-3.42.

(3) Actas dovish (mayoría señala apertura al recorte en septiembre si los datos continúan): DXY cae a 99.5-100.5, sol aprecia hacia S/ 3.37-3.40.

El consenso del mercado apunta al escenario (2) neutro con 55% de probabilidad.`,
    analisis: `El DXY en 101.0 ofrece visibilidad razonable para operaciones cambiarias hoy. Antes de las 2:00 pm ET, el TC se mantendrá estable. Después de las actas, puede haber volatilidad de 20-40 puntos en el TC PEN/USD dependiendo del tono. En QoriCash ejecutamos sus operaciones en tiempo real con las mejores tasas del mercado.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'Arándanos peruanos: exportación acumula US$ 52M en semana del 30 jun-6 jul — temporada alta supera proyecciones del sector',
    descripcion: 'Las exportaciones de arándanos peruanos en la semana del 30 de junio al 6 de julio alcanzaron US$ 52 millones, un récord histórico para esa semana del año y 34% superior al mismo período de 2025. El flujo de divisas por agroexportaciones ancla el tipo de cambio y genera una oferta estructural de US$ 160M semanales en el mercado cambiario.',
    contenido: `Las exportaciones de arándanos peruanos en la semana del 30 de junio al 6 de julio de 2026 alcanzaron US$ 52 millones, un récord histórico para ese período del año según datos de la Asociación de Exportadores (ADEX) y Sierra Exportadora. El resultado supera en 34% el valor registrado en la misma semana de 2025 (US$ 38.8M) y confirma que la temporada de exportación 2026 supera todas las proyecciones iniciales del sector.

Los principales mercados de destino de la semana fueron: EE.UU. (46%), Países Bajos/Europa (25%), Reino Unido (14%) y China (11%, con crecimiento de 42% interanual). El precio FOB promedio se ubica en US$ 4.85/kg, el más alto para esta semana desde 2022.

Los departamentos con mayor volumen exportado: La Libertad (38%), Ica (22%), Áncash (18%) y Lima (12%). Las empresas líderes del sector —Camposol, Danper, Blueberries Perú y Grupo Gloria Agro— reportan ocupación de capacidad de frío y logística del 92-95%.

Impacto macroeconómico: el flujo semanal de US$ 160M de conversión de divisas por el sector agroexportador representa uno de los anclas estructurales del tipo de cambio PEN/USD. Este flujo, combinado con las compras del BCRP, explica la apreciación moderada del sol en el rango S/ 3.39-3.42.`,
    analisis: `El boom de arándanos peruanos es un factor positivo para el sol en el mediano plazo. Cada semana de alta exportación agro inyecta US$ 140-160M de oferta de dólares al mercado cambiario, actuando como un moderador natural de la depreciación del sol. Este factor es favorable para importadores que compran dólares en el mercado local.`,
    categoria: 'Nacional',
    fuente: 'ADEX',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/892808/pexels-photo-892808.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'MEF: déficit fiscal H1 2026 en 1.1% del PIB — el más bajo desde 2019; ingresos tributarios crecen 9.8% impulsados por minería',
    descripcion: 'El Ministerio de Economía y Finanzas informó que el déficit fiscal del primer semestre de 2026 se ubicó en 1.1% del PIB, el nivel más bajo desde el primer semestre de 2019. Los ingresos tributarios crecieron 9.8% interanual, impulsados por el Impuesto a la Renta de tercera categoría (minería y banca) y el IGV de actividades comerciales.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó los resultados fiscales del primer semestre de 2026: el déficit fiscal acumulado enero-junio se ubicó en 1.1% del PIB, equivalente a S/ 6,800 millones, la cifra más baja para un primer semestre desde 2019 (cuando fue 1.0%). El resultado supera las proyecciones del Marco Macroeconómico Multianual (MMM), que preveía un déficit de 1.4% del PIB para el H1.

Los ingresos del Gobierno General crecieron 9.8% en términos reales interanuales, impulsados por: (1) Impuesto a la Renta de tercera categoría: +18.2% (minería con precios de cobre y oro elevados, sector bancario con márgenes altos); (2) IGV interno: +7.4% (consumo privado resiliente); (3) IGV importaciones: +6.1% (actividad de importación activa); (4) Impuesto Selectivo al Consumo: +4.8%.

Los gastos corrientes crecieron 5.2% real, por debajo del crecimiento de ingresos. La inversión pública avanzó 12.3% interanual, con el Gobierno Central ejecutando el 45% del presupuesto del año al cierre de junio.

El resultado fiscal fortalece la posición del Perú ante las calificadoras internacionales (Moody's Baa1 estable, S&P BBB+ estable, Fitch BBB+ estable) y da espacio fiscal para responder ante eventuales shocks.`,
    analisis: `Un déficit fiscal de 1.1% del PIB en el H1 es un resultado macroeconómico positivo para el Perú. Reduce el riesgo soberano y fortalece la credibilidad fiscal, lo que a mediano plazo apoya al sol. Es una señal de solidez fiscal que diferencia al Perú de vecinos regionales con mayores desequilibrios.`,
    categoria: 'Nacional',
    fuente: 'MEF',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'Construcción Perú: crece 5.8% interanual en mayo — vivienda social y obras viales impulsan sector hacia mejor año desde 2014',
    descripcion: 'El sector construcción peruano creció 5.8% interanual en mayo de 2026, según datos del INEI. El resultado acumula seis meses consecutivos de expansión. El despacho de cemento aumentó 6.2% y el consumo de barras de acero 7.8%. Las obras de vivienda social (Techo Propio, Fondo MiVivienda) y proyectos viales del MTC explican el 60% del crecimiento.',
    contenido: `El Instituto Nacional de Estadística e Informática (INEI) publicó el Índice de Producción del Sector Construcción correspondiente a mayo de 2026: crecimiento de 5.8% interanual, el sexto mes consecutivo de expansión del sector. El resultado supera el 5.2% registrado en abril y el promedio del H1 2026 de 4.9% interanual.

Los indicadores líderes del sector en mayo: despacho de cemento +6.2% (señal de obras en ejecución activa), consumo de barras de acero +7.8% (estructuras y cimentaciones), importación de maquinaria de construcción +11.4% (inversión de equipos). El empleo formal en construcción creció 8.3% interanual según el MTPE.

Los motores del crecimiento son: (1) Programas de vivienda social: Techo Propio y Fondo MiVivienda aceleran la colocación de bonos habitacionales; (2) Proyectos viales: la Carretera Central (tramo Huancayo-La Oroya), la Vía Expresa Sur y varios tramos de la Red Vial Nacional; (3) Megaproyectos mineros en construcción: Yanacocha Sulfuros y Corani inician fase de construcción intensiva; (4) Sector privado retail: expansión de centros comerciales en regiones.

Si el ritmo del H1 2026 se mantiene en el H2, el sector construction alcanzaría un crecimiento de 5.5-6.0% para el año completo, el mejor desempeño anual desde 2014 (6.2%).`,
    analisis: `Un sector construcción que crece al 5.8% interanual es un generador importante de demanda de soles (pago de salarios locales) y de importaciones (cemento, acero, maquinaria). El efecto neto sobre el tipo de cambio es levemente apreciador del sol, ya que la demanda doméstica de soles supera la demanda de dólares para importar.`,
    categoria: 'Nacional',
    fuente: 'INEI',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'Goldman Sachs mantiene objetivo de oro en US$ 4,500/oz para fin 2026 — corrección de hoy es "oportunidad táctica de entrada"',
    descripcion: 'A pesar de la caída de 1.53% del oro a US$ 4,082 hoy, Goldman Sachs reafirma su precio objetivo de US$ 4,500/oz para diciembre de 2026. El banco califica la corrección como una "oportunidad táctica de entrada" impulsada por compras de bancos centrales y demanda de cobertura ante riesgos geopolíticos.',
    contenido: `Goldman Sachs Commodities Research reafirmó hoy su precio objetivo para el oro de US$ 4,500/oz para fin de 2026, calificando la corrección de hoy (-1.53% a US$ 4,082) como una "oportunidad táctica de entrada" para inversores con horizonte de mediano plazo. El banco mantiene una posición overweight en metales preciosos dentro de su cartera de materias primas.

Los tres pilares de la tesis alcista de GS para el oro: (1) Compras de bancos centrales: el Q2 2026 registró compras netas de 290 toneladas, el nivel más alto por trimestre desde que el FMI lleva registro. China, India, Polonia y Turquía lideran las compras. (2) Riesgos geopolíticos: la situación en Medio Oriente (Estrecho de Ormuz) y las elecciones de EE.UU. en noviembre generan demanda de cobertura. (3) Perspectivas de recorte de la Fed: cada 25bps de recorte de la Fed reduce el costo de oportunidad de mantener oro (no genera yield).

El análisis técnico de GS ubica el soporte de largo plazo del oro en US$ 3,800 (equivalente al objetivo previo que ya fue superado) y proyecta que una ruptura de US$ 4,200 abriría el camino a US$ 4,500 en un período de 4-6 meses.

Para Perú, un oro sostenido en US$ 4,000+ es positivo para el sector minero-exportador y para los ingresos fiscales (regalías e Impuesto a la Renta minera).`,
    analisis: `La visión de GS en US$ 4,500 para el oro al cierre de 2026 es constructiva para la economía peruana. Cada US$ 100 de alza en el precio del oro incrementa los ingresos por exportaciones en aproximadamente US$ 450M anuales y los ingresos fiscales en US$ 90-120M. El sector minero representa el 60% de las exportaciones del Perú.`,
    categoria: 'Internacional',
    fuente: 'Goldman Sachs',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina: FMI aprueba 2da revisión del programa — desembolsa US$ 2.4B; riesgo país cae 42 puntos a 572 pb',
    descripcion: 'El Fondo Monetario Internacional aprobó la segunda revisión del programa de Argentina y desembolsará US$ 2.4 billones en los próximos días. El riesgo país argentino (EMBI) cae 42 puntos básicos a 572 pb, el mínimo de la gestión Milei. El peso ARS se mantiene en 1,045 por dólar bajo el esquema de crawling peg.',
    contenido: `El Directorio Ejecutivo del FMI aprobó la segunda revisión del Programa de Facilidades Extendidas (EFF) de Argentina, permitiendo el desembolso de US$ 2.4 billones en los próximos 5-7 días hábiles. La aprobación reconoce el avance del gobierno de Milei en la consolidación fiscal, la reducción de la inflación mensual (de 25% en diciembre 2023 a 3.1% en junio 2026) y la acumulación de reservas internacionales.

El riesgo país argentino (EMBI+ Argentina) cayó 42 puntos básicos a 572 pb, el nivel más bajo desde que asumió el presidente Milei en diciembre de 2023. El spread de 572 pb sigue siendo elevado en comparación con Brasil (219 pb), Colombia (178 pb) y Perú (95 pb), pero la tendencia de mejora es clara.

El peso argentino (ARS) se mantiene en 1,045 por dólar bajo el esquema de crawling peg vigente, que devalúa a un ritmo mensual del 1%. Las reservas del BCRA, incluyendo el swap con China, ascienden a US$ 33.4B.

El próximo hito del programa con el FMI es la tercera revisión, programada para octubre de 2026, que evaluará el cumplimiento de las metas fiscales del H1 y el avance en la estabilización macroeconómica.`,
    analisis: `La aprobación del FMI a Argentina es positiva para el sentimiento hacia la región LATAM, aunque el impacto directo sobre el sol peruano es limitado. Indirectamente, una Argentina más estable reduce la percepción de riesgo regional y puede atraer flujos de capital a mercados emergentes de América del Sur.`,
    categoria: 'Internacional',
    fuente: 'FMI',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Chile: CPI junio publicado ayer — reacción del peso CLP y expectativas de recorte BCCh en agosto; CLP en 948/USD',
    descripcion: 'El IPC de junio de Chile se publicó ayer martes 7 de julio. El peso chileno (CLP) cotiza en 948/USD este miércoles 8. El mercado evalúa las implicancias para la reunión del Banco Central de Chile del 5 de agosto, donde se espera un posible recorte de tasas si el dato confirma la desinflación.',
    contenido: `El dato del Índice de Precios al Consumidor (IPC) de junio de Chile se publicó ayer martes 7 de julio. El peso chileno (CLP) cotiza en 948/USD este miércoles 8 de julio, moviéndose en función de la interpretación del dato y del contexto global de DXY en 101.0.

El Banco Central de Chile (BCCh) tiene su próxima reunión de política monetaria el 5 de agosto. Los analistas del mercado chileno evalúan si el dato de IPC de junio da suficiente sustento para un recorte de 25 puntos básicos desde la tasa actual de 5.00% a 4.75%. Sería el primer recorte del BCCh desde enero de 2025.

El cobre, principal determinante estructural del CLP, cotiza en US$ 4.86/libra, sostenido por la mejora del PMI de servicios de China (52.4 en junio). Un cobre sostenido por encima de US$ 4.80 apoya estructuralmente al CLP y reduce la presión depreciadora.

Para Perú, el movimiento del CLP es referencial: ambas economías exportan cobre y sus monedas tienen alta correlación con el precio del metal. El sol peruano se mantiene más estable gracias a las compras del BCRP y el mayor flujo agroexportador diversificado.`,
    analisis: `El CLP en 948/USD y el sol en 3.406 muestran que ambas monedas sudamericanas se mantienen en rangos estables post-CPI de EE.UU. El factor diferencial del sol frente al CLP es la mayor diversificación exportadora del Perú (agro + minería + pesca) versus la dependencia chilena del cobre.`,
    categoria: 'Internacional',
    fuente: 'BCCh',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Colombia: inversión extranjera directa H1 2026 suma US$ 7.8B — COP en 4,152/USD; BanRep evalúa recorte adicional',
    descripcion: 'Colombia reportó US$ 7.8 billones de inversión extranjera directa en el primer semestre de 2026, un crecimiento del 8.2% interanual impulsado por energías renovables y tecnología. El peso colombiano (COP) cotiza en 4,152/USD. El BanRep tiene su próxima reunión en julio y el mercado anticipa un posible recorte adicional de 25bps desde el 9.00% actual.',
    contenido: `Colombia registró US$ 7.8 billones de inversión extranjera directa (IED) en el primer semestre de 2026, un crecimiento del 8.2% respecto al H1 2025 (US$ 7.2B), según datos del Banco de la República (BanRep) y el Ministerio de Comercio. Es el segundo mejor H1 de IED de la historia colombiana, solo superado por el H1 2012 (US$ 8.1B impulsado por petróleo).

Los sectores que lideraron la IED: energías renovables y transición energética (US$ 2.1B, 27% del total), manufactura y tecnología (US$ 1.8B, 23%), petróleo y gas (US$ 1.4B, 18%, en caída relativa) y agricultura y agroindustria (US$ 890M, 11%).

El peso colombiano (COP) cotiza en 4,152/USD este miércoles 8 de julio. La moneda colombiana se ha apreciado 5.8% frente al dólar en lo que va del año, beneficiada por la mejora de los términos de intercambio y la reducción del riesgo político tras la estabilización del gobierno Petro.

El BanRep tiene su próxima reunión de política monetaria el 25 de julio. Tras el recorte de 25bps del 30 de mayo (de 9.25% a 9.00%), el mercado asigna 68% de probabilidad a un nuevo recorte de 25bps en julio, que llevaría la tasa de referencia a 8.75%.`,
    analisis: `El buen desempeño de IED en Colombia (US$ 7.8B en H1) y la apreciación del COP son señales positivas para el sentimiento hacia el bloque Andino, que incluye a Perú. Un contexto de flujos de capital positivos hacia la región apoya indirectamente al sol peruano.`,
    categoria: 'Internacional',
    fuente: 'BanRep',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
