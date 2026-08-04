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
const HOY = '2026-08-04T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'f001',
    titulo: 'ISM Manufacturero de EE.UU. sube a 49.8 en julio y supera expectativas; Warsh reitera que el recorte del Fed en septiembre depende de las nóminas del viernes 7',
    descripcion: 'El índice ISM Manufacturero de julio registró 49.8 puntos, por encima del 49.2 proyectado por el consenso y la lectura más alta en seis meses, aunque se mantiene en zona de contracción por decimocuarto mes consecutivo. El presidente del Fed Kevin Warsh reiteró este lunes que el recorte de tasas en septiembre sigue siendo el escenario base, condicionado a que las nóminas no agrícolas del viernes 7 de agosto y el CPI del 14 de agosto confirmen la trayectoria desinflacionaria.',
    contenido: `El Instituto para la Gestión del Suministro (ISM) publicó este lunes 4 de agosto el dato del índice de gerentes de compras del sector manufacturero de EE.UU. para julio: 49.8 puntos, por encima del 49.2 esperado por el consenso y el nivel más alto desde enero de 2026, aunque aún por debajo de los 50 puntos que separan la expansión de la contracción. El sector lleva 14 meses en zona contractiva, el período más prolongado desde la crisis financiera de 2008–2009, reflejando el efecto rezagado de las tasas altas sobre la inversión y el gasto en capital.

Los subcomponentes muestran un cuadro mixto con señales esperanzadoras: los nuevos pedidos subieron a 50.4 —zona de expansión por primera vez en cinco meses— sugiriendo que la demanda empieza a reactivarse en respuesta a la caída de tasas de interés en los mercados de bonos. El subíndice de producción avanzó a 50.1 y el de empleo mejoró a 48.5, aún contractivo pero en recuperación. El subíndice de precios pagados subió a 54.2, señal de que los costos de insumos todavía presionan márgenes, aunque a un ritmo mucho menor que en 2022–2023.

El presidente de la Reserva Federal, Kevin Warsh, en declaraciones a los medios en la mañana de este lunes antes del inicio de las operaciones de mercado en Nueva York, reiteró que "el recorte de septiembre está sobre la mesa y es el escenario central del FOMC, pero requiere que los datos de las próximas dos semanas sean coherentes con la moderación sostenida de la inflación". El foco de los mercados se concentra ahora en dos eventos: las nóminas no agrícolas del viernes 7 de agosto —el consenso proyecta 145,000 nuevos empleos y una tasa de desempleo estable en 4.1%— y el IPC de julio que se publicará el 14 de agosto.

Los futuros de fondos federales asignan una probabilidad del 68% al recorte de 25 puntos básicos en la reunión del FOMC del 17 de septiembre, prácticamente sin cambios respecto al cierre del viernes. El rendimiento del Tesoro a 2 años opera en 4.31%, y el bono a 10 años en 4.50%. El DXY se estabiliza en 103.4 puntos, ligeramente por encima del cierre del jueves (103.1), en una jornada de consolidación previa al dato clave del viernes.`,
    analisis: `El ISM Manufacturero en 49.8 —mejor de lo esperado pero aún contractivo— mantiene vivo el escenario del recorte de septiembre del Fed sin acelerarlo. Para el mercado cambiario peruano, esto implica un DXY que permanece contenido en el rango 103–104 durante la semana, lo que limita la presión depreciadora sobre el sol y permite que el tipo de cambio se mantenga próximo a S/ 3.38–3.385.

El dato crítico será el viernes con las nóminas. Si el empleo sorprende al alza (>180,000 nuevos puestos) o la tasa de desempleo baja, el mercado podría revertir las expectativas de recorte en septiembre, generando un repunte del DXY y presión alcista sobre el tipo de cambio PEN/USD hacia S/ 3.40–3.42. Si el empleo es débil o en línea con las expectativas, el recorte de septiembre se consolida y el sol puede apreciarse aún más. Es una semana de alta incertidumbre: prudente no concentrar todas las operaciones de divisas en un solo momento.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f002',
    titulo: 'Sol peruano abre la semana en S/ 3.382, nivel más apreciado en siete semanas, sostenido por DXY en 103.4 y cobre firme en US$ 4.88/libra',
    descripcion: 'El tipo de cambio PEN/USD inicia la semana del 4 de agosto cotizando en S/ 3.382 por dólar, su mejor nivel desde el 16 de junio, en una jornada de apertura marcada por la consolidación del DXY en 103.4 puntos y el precio del cobre en US$ 4.88/libra en el LME. Los exportadores mineros y agropecuarios aprovechan el nivel para liquidar posiciones en dólares, reforzando la oferta de divisas en el mercado interbancario de Lima.',
    contenido: `El tipo de cambio PEN/USD abre la semana del 4 de agosto cotizando en S/ 3.382 por dólar en el mercado interbancario de Lima, extendiendo la apreciación del sol que comenzó el martes pasado con la publicación del PCE subyacente de junio en 2.6% y la pausa dovish del FOMC del 28-29 de julio. El nivel de S/ 3.382 es el más apreciado del sol desde el 16 de junio —antes del episodio de volatilidad de finales de junio que llevó al tipo de cambio brevemente a S/ 3.42— y refleja la combinación de dólar global débil y sólidos fundamentales exportadores peruanos.

El Banco Central de Reserva del Perú (BCRP) no ha intervenido en el mercado de divisas desde el martes 29 de julio. La institución ha permitido que el mercado encuentre su equilibrio natural dado el contexto de abundante oferta de dólares proveniente de exportadores mineros y agropecuarios que aprovechan el nivel para vender. El volumen de operaciones de contado en Lima supera los US$ 280 millones en las primeras dos horas de negociación de esta mañana, por encima del promedio de US$ 210 millones de las últimas cuatro semanas.

El cobre en el LME consolida en US$ 4.88 por libra, apenas 0.4% por debajo del cierre del jueves pasado (US$ 4.90), sostenido por los stocks del LME en mínimos de dos años (75,400 toneladas) y la perspectiva de mayor demanda eléctrica en China durante el tercer trimestre. El oro cotiza en US$ 3,372/oz y el DXY se ubica en 103.4, con una ligera corrección técnica desde el mínimo del jueves (103.1) en un movimiento que los analistas describen como "consolidación natural antes del dato de nóminas del viernes".

Las reservas internacionales netas del BCRP se mantienen en US$ 80,400 millones, equivalentes a más de 18 meses de importaciones, lo que otorga a la institución una capacidad de intervención prácticamente ilimitada en el mercado de divisas si las condiciones lo requirieran. El diferencial de tasas BCRP (4.25%) vs. Fed (3.50%-3.75%) sigue siendo favorable al sol peruano, atrayendo carry trade que refuerza estructuralmente la posición del PEN.`,
    analisis: `El sol en S/ 3.382 al inicio de semana es una señal positiva que refleja tanto la solidez de los fundamentales exportadores peruanos como la debilidad global del dólar. Para importadores y empresas con obligaciones en dólares, el nivel actual representa una ventana de compra relativamente atractiva comparada con los S/ 3.41–3.42 de principios de semana pasada.

El riesgo principal de esta semana es el dato de nóminas no agrícolas del viernes 7 de agosto. Si el empleo sorprende al alza, el mercado podría revertir las expectativas de recorte del Fed en septiembre, empujando el dólar de vuelta hacia S/ 3.39–3.42. Estrategia prudente: cubrir las necesidades de dólares del próximo mes en la ventana de esta semana antes del jueves, y no esperar a que el sol se aprecie aún más si hay exposición cambiaria pendiente.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f003',
    titulo: 'BCRP coloca bonos soberanos a 10 años al 5.78% en subasta con demanda tres veces mayor a la oferta: el menor costo de financiamiento en dos años',
    descripcion: 'El Banco Central de Reserva del Perú realizó este lunes su subasta semanal de bonos soberanos en soles, colocando S/ 600 millones a un plazo de 10 años a una tasa del 5.78% anual —la más baja desde agosto de 2024. La demanda alcanzó S/ 1,840 millones, tres veces la oferta disponible, reflejando el apetito de inversionistas institucionales por activos en soles ante las perspectivas de recortes del BCRP en el cuarto trimestre.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) llevó a cabo este lunes 4 de agosto su subasta semanal de bonos del Tesoro en soles, colocando S/ 600 millones en el bono soberano con vencimiento en 2036 (plazo de 10 años) a una tasa de rendimiento del 5.78% anual. El resultado es significativo por dos razones: es la tasa más baja alcanzada en una subasta de bonos a 10 años desde agosto de 2024, y la relación demanda/oferta de 3.07x —S/ 1,840 millones de demanda frente a S/ 600 millones de oferta— es la más alta en 18 meses, señal de que el mercado está posicionándose para el inicio del ciclo de recortes del BCRP.

Los principales demandantes en la subasta fueron los fondos de pensiones privados (AFP), que aportaron el 52% de las órdenes de compra, seguidos por las aseguradoras (28%) y los fondos mutuos (12%). La presencia de inversionistas extranjeros fue modesta en esta subasta (8% del total), aunque los analistas del mercado de bonos locales esperan que aumente en las próximas semanas a medida que el carry trade hacia soles se vuelva más atractivo si el Fed recorta tasas en septiembre.

La tasa del 5.78% para el bono a 10 años implica un spread de 128 puntos básicos sobre el Tesoro de EE.UU. a 10 años (4.50%), un nivel que los analistas de renta fija consideran adecuado para el riesgo crediticio del Perú dado su rating de Baa1/BBB+ de Moody's y S&P respectivamente. El diferencial estuvo en 180 puntos básicos hace 12 meses, por lo que su compresión refleja la mejora de la percepción de riesgo país del Perú en el contexto de solidez fiscal (superávit primario semestral) y reservas en máximos históricos.

El MEF también colocó S/ 400 millones adicionales en bonos a 5 años (vencimiento 2031) a una tasa del 5.12%, completando un monto total de S/ 1,000 millones en la jornada. El Ministerio de Economía planifica emitir entre S/ 18,000 y S/ 22,000 millones en bonos soberanos durante 2026, de los cuales ya ha colocado el 62% al cierre de julio, según datos de la Dirección General de Endeudamiento.`,
    analisis: `La colocación de bonos soberanos al 5.78% a 10 años con demanda tres veces mayor a la oferta es una señal clara de que el mercado espera recortes del BCRP en el mediano plazo. Cuando la demanda supera ampliamente la oferta en subastas de bonos, los precios de los bonos en el mercado secundario tienden a subir (y las tasas a caer), lo que genera ganancias de capital para quienes ya tenían posiciones en bonos soberanos peruanos.

Para empresas con excedentes de tesorería en soles, el nivel del 5.78% a 10 años es atractivo en términos históricos pero puede comprimirse aún más si el BCRP inicia recortes en el cuarto trimestre. Quien quiera capturar la tasa actual antes de que caiga puede participar en el mercado secundario de bonos soberanos a través de bancos o SABs locales. La curva de rendimientos en soles está en proceso de aplanamiento, favoreciendo el tramo largo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f004',
    titulo: 'Arándanos peruanos superan US$ 180 millones en exportaciones de julio con precio récord de US$ 8.20 por kilo en mercados europeos',
    descripcion: 'Las exportaciones peruanas de arándanos alcanzaron US$ 182 millones en julio de 2026, un crecimiento del 17.4% frente al mismo mes del año anterior, según datos preliminares de la Asociación de Exportadores (ADEX). El precio promedio de US$ 8.20 por kilogramo es el más alto registrado para la temporada de invierno australiano, impulsado por la menor oferta de Chile y la fuerte demanda de Alemania, Países Bajos y Reino Unido.',
    contenido: `Las exportaciones peruanas de arándanos registraron US$ 182 millones en julio de 2026, el mejor mes de julio en la historia del sector, con un crecimiento del 17.4% frente a los US$ 155 millones de julio de 2025, según cifras preliminares de la Asociación de Exportadores (ADEX) publicadas este lunes. El precio promedio FOB de US$ 8.20 por kilogramo es el máximo histórico para la temporada de invierno del hemisferio norte —que coincide con el peak de producción peruana entre julio y octubre— y supera en 12% al precio de julio del año anterior (US$ 7.32/kg).

Las regiones productoras lideres son La Libertad (38% del volumen), Ancash (22%) e Ica (18%), con una producción total estimada en 22,200 toneladas métricas durante el mes. La calidad del producto peruano ha sido evaluada como "premium" por los principales importadores europeos: las tasas de rechazo en aduanas de la Unión Europea se mantienen por debajo del 0.3%, el nivel más bajo en cinco años, gracias a las mejoras en frío de cadena y empaque implementadas por las empresas exportadoras peruanas líderes (Camposol, Sociedad Agrícola Virú, Hass Perú).

El mercado europeo absorbe el 68% de las exportaciones de arándanos peruanos de julio: Países Bajos (24%), Reino Unido (22%) y Alemania (14%) son los principales destinos. EE.UU. concentra el 22% y Asia (principalmente Hong Kong y Singapur) el 10% restante. La menor oferta de Chile —cuya temporada de arándanos se ha retrasado por temperaturas inusualmente bajas en la región de Biobío— genera un vacío que el Perú está llenando con ventaja competitiva. La temporada chilena arrancará con fuerza recién en octubre, cuando la peruana empiece a declinar.

Camposol, la mayor empresa exportadora de arándanos del país, reportó esta mañana que sus ingresos de arándanos del mes de julio superaron los US$ 42 millones, un 19% por encima del mismo mes del año anterior, con márgenes EBITDA de la división de arándanos en el 24% —el mejor resultado en tres temporadas.`,
    analisis: `Las exportaciones de arándanos en US$ 182 millones en julio son un componente importante de la oferta de divisas que sostiene la apreciación del sol. Las empresas agroexportadoras liquidan los dólares de sus ventas en el mercado local para pagar sueldos, insumos y servicios en soles, generando una presión vendedora de dólares que actúa como soporte estructural para el PEN durante los meses de agosto a octubre.

Para proveedores del sector agroindustrial, el dinamismo del arándano peruano es una oportunidad: la demanda de cartón para empaque, servicios de frío de cadena, servicios logísticos portuarios y mano de obra temporal en el norte del país permanecerá elevada durante toda la temporada. Las empresas de servicio con exposición al sector agro no tradicional tienen un trimestre favorable por delante.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f005',
    titulo: 'MEF desembolsa S/ 4,200 millones en proyectos de infraestructura vial y energética para el tercer trimestre de 2026',
    descripcion: 'El Ministerio de Economía y Finanzas formalizó este lunes el desembolso de S/ 4,200 millones para proyectos de infraestructura del tercer trimestre, correspondientes a tramos de la Longitudinal de la Sierra, la ampliación de redes eléctricas en regiones mineras y el programa de agua y saneamiento rural. La inversión pública acumula un avance del 51.3% del presupuesto anual al cierre de julio, el mejor ritmo de ejecución en cinco años.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) anunció este lunes 4 de agosto el desembolso de S/ 4,200 millones en proyectos de infraestructura para el tercer trimestre de 2026, provenientes del Fondo de Inversión en Infraestructura y de la ejecución ordinaria del presupuesto de capital. Los proyectos beneficiados incluyen los tramos 3 y 4 de la carretera Longitudinal de la Sierra (Cajamarca–Huancayo), la expansión de redes de transmisión eléctrica en las regiones de Apurímac y Puno vinculadas a los proyectos mineros de Coroccohuayco y Los Chancas, y el Programa Nacional de Saneamiento Rural que atiende a 1.2 millones de personas en comunidades sin acceso a agua potable.

La inversión pública acumula un avance del 51.3% del presupuesto de capital anual al cierre de julio de 2026, equivalente a S/ 22,400 millones ejecutados de un total programado de S/ 43,700 millones. Este ritmo supera en 2.8 puntos porcentuales al avance del mismo período del año anterior (48.5%) y es el mejor desempeño de ejecución presupuestal de inversión pública en los últimos cinco años. El Ministerio proyecta cerrar el año con una ejecución superior al 88% del presupuesto de capital, que equivaldría al mayor monto de inversión pública en términos reales de la historia del país.

El viceministro de Hacienda destacó que los recursos provienen principalmente del canon minero y las regalías transferidas a los gobiernos regionales y locales, que en el primer semestre sumaron S/ 9,800 millones —un 18% por encima del mismo período del año anterior—, gracias al auge del precio del cobre y el oro. Las regiones de Arequipa (S/ 1,840 millones de canon recibido en el semestre) y Apurímac (S/ 1,320 millones) encabezan las transferencias y son las que mayor aceleración de inversión muestran.

La carretera Longitudinal de la Sierra, una vez completada en 2028, conectará doce regiones andinas con una vía pavimentada de 4,200 kilómetros que actualmente está en el 62% de avance. Esta obra reducirá los costos logísticos del transporte de productos agropecuarios desde las zonas altoandinas en un estimado del 35%, mejorando la competitividad de las exportaciones de papa, quinua y derivados lácteos.`,
    analisis: `La aceleración de la inversión pública en infraestructura tiene un efecto multiplicador positivo en la economía real peruana: cada sol invertido en obra pública genera entre S/ 1.40 y S/ 1.80 de PBI adicional, según estimaciones del BCRP. En el contexto actual, con el sector privado aún en modo de espera ante la incertidumbre geopolítica global, la inversión pública actúa como motor de crecimiento.

Para el tipo de cambio, la mayor inversión pública implica mayor demanda de bienes de capital importados (maquinaria, equipos), lo que incrementa la demanda de dólares en el mercado local. Sin embargo, el superávit primario del primer semestre (0.4% del PBI) y las reservas del BCRP en US$ 80,400 millones dan amplio margen para absorber esta demanda adicional sin presionar el tipo de cambio hacia niveles de S/ 3.40 o superiores.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/434659/pexels-photo-434659.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f006',
    titulo: 'Warsh (Fed) el 4 de agosto: "El recorte de septiembre está sobre la mesa pero no está garantizado; las nóminas del viernes son el test definitivo"',
    descripcion: 'El presidente de la Reserva Federal, Kevin Warsh, declaró este lunes que el recorte de tasas en la reunión del FOMC del 17 de septiembre "es posible y está en discusión activa" pero depende de que los datos de nóminas no agrícolas del viernes 7 de agosto y el IPC de julio del 14 de agosto sean consistentes con el objetivo de desinflación. Los mercados descuentan una probabilidad del 68% para el recorte.',
    contenido: `El presidente de la Reserva Federal de Estados Unidos, Kevin Warsh, hizo declaraciones a los medios este lunes 4 de agosto en el marco de un evento del Peterson Institute for International Economics en Washington, reiterando la postura del FOMC respecto a la política monetaria para el resto del año. Warsh señaló que "el recorte de tasas en septiembre está sobre la mesa y es objeto de discusión activa entre los miembros del comité", añadiendo que "las condiciones macroeconómicas se están acercando a las que consideramos necesarias para iniciar la normalización de la política monetaria".

Sin embargo, Warsh fue enfático en subrayar la condicionalidad del primer recorte: "Necesitamos dos semanas de buenas noticias. Las nóminas del viernes 7 y el CPI del 14 de agosto son los datos más importantes que analizaremos antes de la reunión de septiembre. Si cualquiera de los dos sorprende significativamente al alza, el comité puede optar por mantener la tasa sin cambios por una reunión adicional". El mercado interpreta estas palabras como una confirmación de que el recorte de septiembre está vivo, pero que aún hay riesgo de que se postergue a noviembre.

Los futuros del Fed Funds Rate descuentan una probabilidad del 68% para un recorte de 25 puntos básicos en septiembre, dejando la tasa en 3.25%-3.50%, sin cambios significativos respecto al nivel del viernes. El mercado de swaps descuenta 2.4 recortes de 25 puntos básicos para el cierre de 2026, lo que llevaría la tasa de fondos federales a 2.75%-3.00% para diciembre. Este escenario es el más expansivo desde los primeros meses post-pandemia.

Los rendimientos de los Tesoros reaccionaron con moderación a las declaraciones de Warsh: el bono a 2 años opera en 4.31% y el bono a 10 años en 4.50%, ambos sin cambios significativos respecto al cierre del viernes. El DXY se estabiliza en 103.4, ligeramente por encima del 103.1 del jueves, en lo que los analistas describen como "consolidación antes del catalizador del viernes".`,
    analisis: `Las palabras de Warsh confirman que el ciclo de recortes del Fed comenzará en septiembre con alta probabilidad, siempre que el empleo no sorprenda al alza. Para el PEN/USD, este escenario es fundamentalmente positivo: un Fed que baja tasas implica un dólar más débil en el mediano plazo, lo que favorece al sol peruano. La pregunta no es si el Fed recortará, sino cuándo y a qué ritmo.

Para empresas peruanas con deuda en dólares que vence o se refinancia en 2026–2027, el inicio del ciclo de recortes del Fed implica que los costos de financiamiento en dólares caerán gradualmente. Si pueden esperar, refinanciar en el segundo semestre será más barato que en el primero. El plazo ideal para renegociar deudas en USD es el cuarto trimestre de 2026, cuando la tasa del Fed podría estar ya en 3.00%-3.25%.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f007',
    titulo: 'Cobre consolida en US$ 4.88/libra al inicio de semana; stocks en LME en mínimo de dos años y demanda china de transmisión eléctrica impulsan el precio',
    descripcion: 'El cobre en la Bolsa de Metales de Londres abre la semana del 4 de agosto en US$ 4.88 por libra, apenas 0.4% por debajo del cierre del jueves, sostenido por inventarios del LME que se ubican en mínimos de dos años (75,400 toneladas) y la creciente demanda china de cable de cobre para redes de transmisión eléctrica ligada a energías renovables. Las exportaciones peruanas del metal acumulan US$ 11,200 millones en el primer semestre.',
    contenido: `El precio del cobre en la Bolsa de Metales de Londres (LME) abre la semana del 4 de agosto en US$ 4.88 por libra (US$ 10,760 por tonelada métrica), ligeramente por debajo del cierre del jueves pasado (US$ 4.90/libra) pero consolidando por encima del nivel clave de US$ 4.85 que muchos analistas identifican como el soporte técnico de mediano plazo. La estabilización del precio refleja el equilibrio entre la toma de ganancias de corto plazo y los fundamentos estructuralmente sólidos de la demanda global.

El factor técnico más relevante del mercado de cobre en la apertura de semana es el nivel de inventarios en los almacenes certificados del LME: 75,400 toneladas métricas, el mínimo en dos años. Esta cifra equivale a apenas 1.2 días de consumo global, el nivel de cobertura más bajo desde mediados de 2024. Cuando los inventarios del LME están tan ajustados, cualquier aceleración de la demanda o interrupción de la oferta puede generar movimientos bruscos al alza del precio. Los fondos de commodities están posicionados netos largos en cobre con una intensidad que no se veía desde enero de 2025.

La demanda estructural del cobre sigue siendo el principal motor de precios a mediano plazo: según datos de la International Copper Study Group (ICSG), la demanda global de cobre para transmisión eléctrica —que incluye cables para paneles solares, turbinas eólicas y redes de distribución— creció el 14% en el primer semestre de 2026. China, que lidera la instalación de capacidad renovable mundial, requirió 940,000 toneladas métricas adicionales de cobre en el semestre solo para sus redes eléctricas. Esta tendencia no tiene precedentes históricos y está redefiniendo los modelos de demanda de largo plazo del metal.

Para Perú, el nivel de US$ 4.88/libra se traduce en ingresos de exportación superiores a US$ 1,850 millones mensuales por cobre, lo que mantiene el superávit comercial en niveles record y provee una base sólida de divisas para el mercado interbancario de Lima.`,
    analisis: `El cobre en US$ 4.88/libra con inventarios del LME en mínimos históricos es el escenario más favorable posible para el sol peruano: implica exportaciones mineras récord, ingreso masivo de dólares al sistema financiero local y un BCRP que apenas necesita intervenir en el mercado de divisas. El PEN se beneficia estructuralmente de este contexto.

Para empresas del sector minero y sus cadenas de proveedores, el precio alto del cobre refuerza la continuidad de los planes de inversión de las grandes mineras en Perú. Anglo American (Quellaveco), MMG (Las Bambas) y Freeport-McMoRan (Cerro Verde) tienen aprobados proyectos de expansión que requieren proveedores locales de explosivos, servicios de mantenimiento e ingeniería. El dinamismo del cobre es una señal de contrato para los próximos 18–24 meses en el ecosistema de servicios mineros peruano.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f008',
    titulo: 'Oro abre la semana en US$ 3,372/oz sostenido por compras de bancos centrales de China e India que limitan las correcciones técnicas',
    descripcion: 'El precio del oro al contado inicia la semana del 4 de agosto en US$ 3,372 por onza troy, con una variación de apenas -0.3% respecto al cierre del jueves, en una apertura de semana sin catalizadores directos pero con el soporte estructural de los bancos centrales compradores. El Consejo Mundial del Oro reporta que China e India acumularon 68 toneladas netas en julio, el mayor volumen mensual en tres años.',
    contenido: `El oro al contado abre la semana del 4 de agosto en US$ 3,372 por onza troy, con una corrección técnica leve de apenas -0.3% (US$ 10/oz) respecto al cierre del jueves 31 de julio (US$ 3,382/oz). La jornada del lunes es típicamente de bajo volumen para el metal precioso, con los mercados asiáticos liderando las transacciones antes de que abran Londres y Nueva York. La consolidación en el rango US$ 3,360–3,380 es consistente con una estructura técnica de pausa alcista antes del próximo catalizador, que será el dato de nóminas del viernes.

El factor más relevante del mercado de oro en la apertura de semana es la confirmación de compras masivas por parte de los bancos centrales de China e India en julio. El Consejo Mundial del Oro (World Gold Council) reportó hoy que el Banco Popular de China adquirió 42 toneladas netas de oro en julio —el mayor volumen mensual desde octubre de 2023— elevando sus reservas a 2,388 toneladas (4.8% del total de reservas). El banco central de India compró 26 toneladas adicionales, llevando sus reservas a 858 toneladas, el máximo histórico.

Estas compras institucionales masivas son el "piso" que impide correcciones técnicas profundas en el oro: cada vez que el precio cede hacia US$ 3,340–3,350, los bancos centrales asiáticos regresan como compradores agresivos, absorbiendo la oferta del mercado de futuros y limitando el potencial bajista. Esta dinámica es estructuralmente diferente a las correcciones del oro en 2022 y 2023, cuando los bancos centrales eran compradores marginales y el mercado estaba dominado por los fondos de hedge funds.

El contexto macro de fondo también sigue siendo favorable: la perspectiva de recortes del Fed en septiembre implica un dólar más débil en el mediano plazo, lo que típicamente refuerza el precio del oro denominado en USD. El ratio gold/S&P 500 —que mide cuántas acciones del índice americano se pueden comprar con una onza de oro— opera en 1.40, el nivel más alto desde 2012, señalando que el oro está en tendencia secular de revalorización relativa.`,
    analisis: `El oro en US$ 3,372/oz con compras de bancos centrales como soporte estructural tiene una doble implicación para Perú: primero, genera ingresos de exportación elevados (el oro es el segundo producto de exportación peruano con ~US$ 1,500 millones mensuales al precio actual); segundo, el nivel alto del oro refuerza la percepción de riesgo global, lo que normalmente favorece a activos de países con fundamentos sólidos como Perú.

Para inversores peruanos que consideran oro como cobertura de portafolio, US$ 3,372 está cerca de máximos históricos y la rentabilidad del 30% en lo que va del año es difícil de mantener al mismo ritmo. La exposición al oro tiene sentido como cobertura ante incertidumbre geopolítica, pero concentrar más del 10-15% del portafolio en un activo que no genera rendimiento corriente tiene un costo de oportunidad significativo frente a bonos soberanos peruanos al 5.78% o depósitos a plazo al 7%+.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f009',
    titulo: 'DXY consolida en 103.4 en apertura del lunes en corrección técnica post-FOMC; mercado en modo "wait and see" antes de nóminas del viernes 7',
    descripcion: 'El índice del dólar (DXY) abre la semana del 4 de agosto en 103.4 puntos, recuperando levemente desde el mínimo de 103.1 del jueves pasado en una corrección técnica que los analistas describen como "consolidación normal antes del catalizador del viernes". El mercado de divisas está en modo de baja volatilidad a la espera de las nóminas no agrícolas de EE.UU. del 7 de agosto.',
    contenido: `El índice del dólar estadounidense (DXY) abre la semana del 4 de agosto en 103.4 puntos, un rebote técnico de 0.3 puntos desde el mínimo de seis semanas de 103.1 registrado el jueves 31 de julio. El movimiento es definido por los analistas de divisas como una "corrección técnica de corto plazo" tras el impulso bajista generado por el PCE subyacente de junio en 2.6% y la pausa dovish del FOMC. No hay catalizadores fundamentales nuevos este lunes que justifiquen un movimiento direccional sostenido del dólar.

La volatilidad implícita del DXY a 1 semana —medida a través del mercado de opciones de divisas— ha subido a 6.4 desde el 4.8 del miércoles previo al FOMC, señal de que el mercado está comprando protección ante el dato de nóminas del viernes. Esta dispersión de expectativas es coherente con una semana que puede ser decisiva para la tendencia del dólar en agosto: si el empleo sorprende al alza, el DXY podría recuperar el nivel de 104–105; si el dato confirma el enfriamiento del mercado laboral, el DXY podría romper a la baja hacia 102–102.5.

El euro cotiza en 1.0940 frente al dólar, ligeramente por debajo del 1.0960 del jueves, en una apertura de semana de bajo volumen con los mercados europeos en modo de espera. El yen japonés opera en 149.8 por dólar, con la perspectiva de que el Banco de Japón evalúe un alza de tasas en octubre siguiendo el ejemplo del Fed si este recorta en septiembre —lo que ampliaría el diferencial de política monetaria entre Japón y EE.UU. en sentido contrario, favoreciendo la apreciación del yen.

Las posiciones especulativas netas en el DXY (medidas por el reporte COT de la CFTC, publicado el viernes pasado con datos al martes 29 de julio) muestran que los fondos no comerciales tienen posiciones cortas netas en el dólar de US$ 4,800 millones, el nivel más bearish desde octubre de 2023. Esto significa que el mercado ya está posicionado para la debilidad del dólar, lo que limita el potencial alcista adicional pero también implica que cualquier sorpresa positiva (empleo fuerte) puede generar un squeeze de posiciones cortas y un movimiento brusco al alza del DXY.`,
    analisis: `El DXY en 103.4 —rebotando levemente desde 103.1— no cambia la tendencia de fondo de dólar débil que favorece al sol peruano. La consolidación de esta semana es el preludio a un movimiento más decisivo el viernes con las nóminas. Para gestores de riesgo cambiario en empresas peruanas, esta semana de baja volatilidad del DXY es una oportunidad para cubrir posiciones a tipos de cambio favorables sin la prisa que genera la alta volatilidad.

El escenario técnico del DXY sugiere que el rango de la semana estará entre 103.0 y 104.2, con la dirección definitiva determinada por el dato del viernes. Un DXY que cierre la semana por encima de 104 sería una señal bajista para el sol peruano; por debajo de 103, sería alcista para el PEN. El nivel actual de S/ 3.382 es un buen punto de referencia para dimensionar el riesgo cambiario de la semana.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f010',
    titulo: 'PEN/USD técnico semana del 4 al 8 de agosto: soporte clave en S/ 3.380, resistencia en S/ 3.395; nóminas del viernes definen la ruptura',
    descripcion: 'El análisis técnico del tipo de cambio PEN/USD para la semana del 4 al 8 de agosto muestra al sol peruano consolidando en S/ 3.382 con soporte inmediato en S/ 3.380 y resistencia en S/ 3.395–3.400. El dato de nóminas no agrícolas del viernes 7 será el catalizador que defina si el PEN quiebra a la baja hacia S/ 3.368–3.375 o recupera hacia S/ 3.40–3.42.',
    contenido: `El tipo de cambio PEN/USD inicia la semana del 4 de agosto en S/ 3.382, operando dentro del canal de tendencia apreciadora del sol que se definió el martes 29 de julio con la publicación del PCE subyacente de junio en 2.6% y el tono dovish del FOMC. El análisis técnico del par USD/PEN muestra una estructura de tendencia bajista (dólar débil) con los siguientes niveles clave para la semana:

**Soportes del dólar (pisos para el USD/PEN, que equivalen a máximos de apreciación del sol):**
- S/ 3.380: primer soporte — mínimo intradía del jueves 31 de julio. Si se perfora, el siguiente nivel es S/ 3.368 (mínimo del 16 de junio).
- S/ 3.368: segundo soporte clave — mínimo de junio. Zona de acumulación técnica importante.
- S/ 3.350: soporte fuerte — zona de máximos de marzo convertida en soporte. Una ruptura a la baja de este nivel requeriría un DXY por debajo de 102.

**Resistencias del dólar (techos para el USD/PEN):**
- S/ 3.395–3.400: primera resistencia — zona de media móvil de 20 días y canal lateral previo. Recuperación moderada si las nóminas del viernes sorprenden al alza.
- S/ 3.412: resistencia fuerte — máximo de la semana pasada (lunes 28). Ruptura de este nivel implicaría reversión total del movimiento dovish.

Los indicadores técnicos en el gráfico diario USD/PEN muestran: RSI de 14 días en 38 (zona de dólar sobrevendido relativo al sol, consistente con momentum apreciador del PEN); MACD cruzado a la baja (señal vendedora de dólar); Bandas de Bollinger expandiéndose hacia abajo, confirmando el momentum. Las medias móviles de 50 y 200 días del USD/PEN apuntan hacia abajo, reforzando la tendencia de largo plazo favorable al sol.

El volumen de operaciones de divisas en Lima la semana pasada fue un 35% superior al promedio de las cuatro semanas anteriores, con el flujo dominado por ventas de dólares de exportadores (compra de soles). Este patrón de volumen alto en apreciación del sol es técnicamente positivo: las tendencias respaldadas por volumen son más sostenibles que las que ocurren con volumen bajo.`,
    analisis: `Los niveles técnicos para esta semana son claros: el sol peruano mantiene una tendencia apreciadora con soporte en S/ 3.380 y el catalizador del viernes (nóminas) determinará si hay una extensión hacia S/ 3.368–3.375 o un rebote hacia S/ 3.40–3.42. Para una empresa que necesita comprar dólares en los próximos 15 días, el rango S/ 3.382–3.392 (esta semana, antes del dato del viernes) representa una ventana de compra atractiva en términos históricos.

La gestión táctica de riesgo cambiario para esta semana sugiere: comprar entre el 50% y el 70% de las necesidades de dólares en los días lunes-jueves (antes del dato del viernes), y reservar el 30%-50% para el post-datos según cómo reaccione el mercado. Esta estrategia de compras escalonadas reduce el riesgo de timing y asegura un costo promedio razonable independientemente de la sorpresa del viernes.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f011',
    titulo: 'Bitcoin corrige a US$ 105,800 en apertura del lunes tras acercarse al máximo histórico; ETFs spot en EE.UU. siguen con entradas netas de US$ 180 millones',
    descripcion: 'Bitcoin abre la semana del 4 de agosto en US$ 105,800, retrocediendo 2.5% desde el máximo intradía de US$ 108,500 registrado el jueves pasado, en una corrección técnica esperada tras el RSI de 71 (zona de sobrecompra). Los ETFs de Bitcoin spot en EE.UU. registran entradas netas acumuladas de US$ 180 millones en la jornada del viernes, señal de que la demanda institucional sigue siendo sólida en las correcciones.',
    contenido: `Bitcoin abre la semana del 4 de agosto cotizando en US$ 105,800 por unidad en los principales exchanges regulados, retrocediendo 2.5% desde el pico intradía de US$ 108,500 registrado el jueves 31 de julio durante el rally post-FOMC. La corrección era técnicamente esperada: el RSI de 14 días había alcanzado 71 el jueves —zona de sobrecompra moderada— y el mercado necesitaba consolidar las ganancias antes de intentar el máximo histórico de US$ 109,800 de enero de 2025.

Los ETFs de Bitcoin spot en EE.UU. continuaron registrando entradas netas positivas incluso durante la jornada del viernes 1 de agosto: US$ 180 millones netos, liderados por iShares Bitcoin Trust de BlackRock (US$ 82 millones), Fidelity Wise Origin Fund (US$ 45 millones) y ARK 21Shares Bitcoin ETF (US$ 28 millones). El hecho de que los ETFs sigan captando capital durante la corrección técnica es una señal positiva de que la demanda institucional de largo plazo permanece intacta y que los inversores usan las caídas como oportunidades de compra.

El análisis técnico de Bitcoin en la apertura de semana muestra: soporte inmediato en US$ 104,000–105,000 (máximos de junio convertidos en soporte); soporte más fuerte en US$ 101,200–102,000 (media móvil de 50 días); resistencia inmediata en US$ 107,500; y máximo histórico a defender/superar en US$ 109,800. El volumen de operaciones del fin de semana fue relativamente bajo (patrón normal en cripto los sábados y domingos), lo que limita la información sobre la dirección de corto plazo.

Ethereum retrocede a US$ 3,520 (-1.8%) y Solana a US$ 184 (-2.2%), ambos en línea con la corrección de Bitcoin. La capitalización total del mercado cripto se sitúa en US$ 3.88 billones, desde los US$ 3.95 billones del jueves, en una corrección del 1.8% que los analistas catalogan como "completamente normal y saludable en el contexto del rally previo".`,
    analisis: `La corrección de Bitcoin a US$ 105,800 tras el RSI de sobrecompra del jueves es técnicamente sana: limpia el exceso especulativo de corto plazo sin comprometer la tendencia alcista de mediano plazo. Para el mercado cambiario peruano, el impacto es marginal: la correlación entre Bitcoin y el DXY existe pero es secundaria frente a los fundamentos macro (Fed, PCE, nóminas).

Para peruanos con tenencias de Bitcoin u otras criptos denominadas en dólares que planean convertir a soles, el nivel actual (US$ 105,800 con PEN/USD en S/ 3.382) implica que cada BTC vale S/ 357,814. Si la intención es cubrir gastos en soles en el corto plazo, el contexto de sol apreciado + Bitcoin corrigiendo ligeramente hace razonable ejecutar la conversión en tramos esta semana, usando QoriCash para maximizar el tipo de cambio en la última etapa de cripto→USD→soles.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f012',
    titulo: 'Argentina: reservas brutas del BCRA superan US$ 44,500 millones y brecha cambiaria permanece en mínimo histórico del 2.8% en el inicio de agosto',
    descripcion: 'El Banco Central de la República Argentina reportó este lunes que las reservas internacionales brutas alcanzaron US$ 44,520 millones, el nivel más alto desde 2019. La brecha cambiaria entre el dólar oficial (ARS 1,512) y el blue (ARS 1,554) permanece en el 2.8%, el mínimo histórico, consolidando el proceso de unificación cambiaria del programa económico del presidente Milei.',
    contenido: `El Banco Central de la República Argentina (BCRA) publicó este lunes su informe semanal de reservas internacionales: las reservas brutas alcanzaron US$ 44,520 millones al cierre del viernes 1 de agosto, el nivel más alto desde noviembre de 2019, con un incremento de US$ 320 millones respecto a la semana anterior. El resultado consolida la trayectoria de acumulación de reservas que el programa económico del presidente Javier Milei ha logrado sostener de manera consistente desde el segundo trimestre de 2024.

La brecha cambiaria entre el dólar oficial (ARS 1,512) y el dólar blue —que opera en el mercado paralelo no oficial en ARS 1,554— permanece en el 2.8%, el nivel más bajo en toda la historia moderna de Argentina. Esta convergencia entre el tipo de cambio oficial y el paralelo es el indicador más claro de la confianza que el mercado deposita en el programa de estabilización macroeconómica: cuando la brecha es baja, los agentes económicos no perciben urgencia de saltar al mercado informal para cubrirse, señal de que el ancla cambiaria es creíble.

El programa económico argentino acumula 20 meses de superávit fiscal primario —una racha sin precedentes en la historia reciente del país. El resultado primario del primer semestre de 2026 alcanzó 1.4% del PBI, por encima de la meta acordada con el FMI de 1.0%. La desinflación continúa: la inflación mensual de julio fue del 2.9% según datos del INDEC, acumulando 24.1% en el primer semestre frente al 112.4% del mismo período de 2023. La inflación anualizada implícita de julio (2.9% mensual = ~41% anualizado) sigue siendo alta en términos absolutos, pero la tendencia de desinflación es inequívoca.

El FMI completó el 15 de julio el quinto desembolso de su programa Extended Fund Facility por US$ 2,100 millones, elevando el total recibido a US$ 19,300 millones. El directorio del organismo elogió los "notables avances en la consolidación fiscal y la acumulación de reservas" en el comunicado que acompañó el desembolso.`,
    analisis: `La fortaleza macroeconómica de Argentina —reservas en US$ 44,520 millones y brecha del 2.8%— tiene implicaciones positivas para la región: un vecino estable reduce el riesgo de contagio de crisis sobre otras economías latinoamericanas, incluido el Perú. En el pasado, los episodios de crisis argentina generaban salidas de capitales de toda la región, incluyendo ventas de bonos soberanos peruanos y presión sobre el sol.

Para empresas peruanas con negocios en Argentina, la estabilidad cambiaria actual es la mejor ventana para estructurar contratos de mediano plazo con pagos en dólares al tipo oficial del BCRA. Con la brecha en 2.8%, prácticamente no hay riesgo de un salto discreto del tipo de cambio oficial en el corto plazo. Sin embargo, con una inflación todavía en 2.9% mensual, cualquier contrato a más de 6 meses en pesos argentinos debe incluir cláusulas de ajuste o denominarse en dólares.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f013',
    titulo: 'Colombia: exportaciones no petroleras crecen 8.4% en el primer semestre de 2026; café, flores y manufactura encabezan la diversificación',
    descripcion: 'El DANE reportó que las exportaciones no petroleras de Colombia alcanzaron US$ 12,800 millones en el primer semestre de 2026, creciendo 8.4% frente al mismo período de 2025. El café premium creció 22%, las flores frescas 11% y la manufactura liviana 7.8%. La diversificación exportadora reduce la dependencia del petróleo, que representa ahora solo el 44% del total de exportaciones.',
    contenido: `El Departamento Administrativo Nacional de Estadística (DANE) de Colombia publicó este lunes el informe de comercio exterior del primer semestre de 2026: las exportaciones no petroleras alcanzaron US$ 12,800 millones entre enero y junio, creciendo 8.4% frente al mismo período de 2025 y representando el 56% del total de exportaciones colombianas por primera vez en décadas. La diversificación exportadora —que ha sido el objetivo estratégico del "Colombia Potencia Mundial" del gobierno Petro— está dando resultados medibles en términos de balanza comercial.

El café continúa siendo el gran protagonista de las exportaciones no petroleras: las ventas externas de café premium de origen único (especialidad) crecieron 22% en el semestre, alcanzando US$ 2,840 millones. El precio del café arábica colombiano en los mercados internacionales se mantiene en niveles históricamente elevados —US$ 2.85 por libra en el CSCE— gracias a la menor producción de Brasil por el fenómeno La Niña. La Federación Nacional de Cafeteros reporta que el 34% de las exportaciones ya son de cafés de especialidad con sobreprecio, frente al 22% de 2024.

Las flores frescas —segundo rubro de exportación no petrolera tras el café— crecieron 11% en el semestre a US$ 1,680 millones, beneficiadas por la fuerte demanda estacional del mercado estadounidense (San Valentín + Día de las Madres en mayo) y la expansión a mercados asiáticos. Colombia consolida su posición como segundo exportador mundial de flores frescas detrás de los Países Bajos. La manufactura liviana (textiles, confecciones, calzado) creció 7.8%, impulsada por los TLCs vigentes con EE.UU. y la Unión Europea.

El petróleo, en tanto, representó el 44% de las exportaciones totales en el semestre (US$ 10,200 millones), cayendo desde el 50% del primer semestre de 2025, lo que indica que la diversificación es real y no solo un efecto del precio del crudo. Con el Brent en US$ 84.5, los ingresos petroleros siguen siendo importantes, pero la dependencia estructural del oro negro se está reduciendo gradualmente.`,
    analisis: `La diversificación exportadora colombiana es una buena práctica que Perú también está siguiendo en el sector agroindustrial: tanto Colombia con café y flores como Perú con arándanos y palta están construyendo fuentes de divisas que no dependen exclusivamente de los commodities mineros o energéticos. Esta resiliencia exportadora es positiva para la estabilidad de ambas monedas regionales.

Para empresas peruanas que exportan a Colombia, el crecimiento del 2.6% del PBI en Q2 de Colombia implica mayor demanda de importaciones y mayor poder de compra doméstico. Los exportadores peruanos de alimentos procesados, prendas de vestir y maquinaria liviana hacia Colombia tienen un contexto favorable. El tipo de cambio PEN/COP implícito (S/ 3.382 / COP 4,178 = COP 1.23 por sol) sigue siendo competitivo para las exportaciones peruanas al mercado colombiano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f014',
    titulo: 'Chile: mercado descuenta 78% de probabilidad de recorte del BCCh el 26 de agosto; peso chileno se aprecia a CLP 928 por dólar en apertura de semana',
    descripcion: 'El mercado de futuros de Santiago descuenta este lunes una probabilidad del 78% de que el Banco Central de Chile recorte su Tasa de Política Monetaria en 25 puntos básicos en la reunión del 26 de agosto, de 5.0% a 4.75%. El peso chileno se aprecia a CLP 928 por dólar en la apertura del lunes, su mejor nivel del año, impulsado por la debilidad del DXY y el cobre firme en US$ 4.88/libra.',
    contenido: `El mercado de futuros de la Tasa de Política Monetaria en Santiago descuenta este lunes una probabilidad del 78% de que el Banco Central de Chile (BCCh) recorte la TPM en 25 puntos básicos en su reunión del 26 de agosto, de 5.0% a 4.75%, subiendo desde el 75% del viernes. El aumento de la probabilidad implícita responde a la publicación el viernes del dato de inflación de julio en Chile: 3.5% anual, por debajo del 3.6% esperado y continuando la moderación desde el 3.9% de mayo. Con la inflación dentro del rango meta del BCCh (3%±1%) y acercándose al punto central, el directorio tiene espacio para iniciar la normalización monetaria.

El peso chileno (CLP) abre la semana en CLP 928 por dólar, su mejor nivel del año, apreciándose 0.4% respecto al cierre del viernes gracias a la combinación del DXY débil (103.4) y el cobre firme en US$ 4.88/libra. Para Chile, como mayor productor mundial de cobre per cápita, el precio del metal tiene un impacto directo sobre los ingresos de Codelco —la empresa pública más importante del país— y sobre las exportaciones que proveen la oferta de divisas al mercado local. El nivel de CLP 928 es inédito desde agosto de 2024.

La presidenta del BCCh, Rossana Costa, realizará esta tarde una presentación ante la Comisión de Hacienda del Senado donde se espera que entregue señales más precisas sobre el timing del recorte. Las minutas de la reunión de julio del BCCh, publicadas el viernes pasado, revelaron que "tres de los cinco miembros del directorio consideran que las condiciones para el inicio de la normalización monetaria podrían estar dadas antes de la reunión de septiembre", lo que refuerza las expectativas de agosto.

El contexto regional también favorece el recorte chileno: si el BCCh recorta en agosto y el Fed lo hace en septiembre, Chile y EE.UU. estarían sincronizando sus ciclos de relajación monetaria. El diferencial de tasas Chile-Fed (5.0% vs. 3.50%-3.75%) se mantendría favorable al peso chileno incluso con un recorte de 25 puntos básicos. El mercado de swaps descuenta que la TPM termine 2026 en 4.0%-4.25%, con tres o cuatro recortes adicionales de 25 puntos básicos entre septiembre y diciembre.`,
    analisis: `Un recorte del BCCh en agosto sería la primera normalización monetaria en la región por parte de un banco central grande en 2026, y tendría efecto señal para el BCRP y BanRep: si Chile —con inflación similar a Perú— puede recortar, la presión sobre los demás bancos centrales de la región para seguir el ejemplo se intensifica. Para el BCRP, esto refuerza el escenario de un primer recorte en octubre o noviembre.

Para el mercado cambiario peruano, la apreciación del peso chileno a CLP 928 es una referencia positiva: ambas monedas comparten la fortaleza del cobre como fundamento, y el hecho de que el CLP se aprecie refuerza la narrativa de monedas emergentes productoras de cobre como ganadoras del escenario de dólar débil + demanda china en recuperación. El PEN en S/ 3.382 y el CLP en 928 son dos caras de la misma moneda.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f015',
    titulo: 'Perú bate récord histórico de turismo receptivo: 2.85 millones de visitantes extranjeros en el primer semestre de 2026, el mejor resultado en la historia del país',
    descripcion: 'El Ministerio de Comercio Exterior y Turismo (Mincetur) reportó que el Perú recibió 2.85 millones de visitantes extranjeros en el primer semestre de 2026, un 12.8% más que en el mismo período de 2025 y el mejor resultado histórico. El turismo generó divisas por US$ 3,200 millones en el semestre, equivalentes al 12.2% del total de exportaciones, consolidando al sector como el tercer generador de divisas del país.',
    contenido: `El Ministerio de Comercio Exterior y Turismo (Mincetur) publicó este lunes el informe de turismo del primer semestre de 2026: el Perú recibió 2.85 millones de visitantes extranjeros entre enero y junio —el mejor resultado en la historia de las estadísticas de turismo peruanas, superando el récord previo de 2.72 millones del primer semestre de 2019 (antes de la pandemia). El crecimiento del 12.8% frente al mismo período de 2025 se explica por la combinación de la recuperación del turismo internacional global, la mejora de la conectividad aérea hacia Lima y Cusco, y el impacto de las campañas "Perú Land of the Incas" en mercados de EE.UU., Europa y Asia.

Los principales mercados emisores de turistas hacia Perú en el semestre fueron EE.UU. (480,000 visitantes, +18%), Chile (420,000, +9%), Colombia (280,000, +15%), Argentina (220,000, +22%) y España (180,000, +14%). La novedad del semestre es el fuerte crecimiento del turismo asiático: China aportó 95,000 visitantes (+68% frente al primer semestre de 2025), y Japón 42,000 (+31%), en ambos casos impulsados por el interés en el turismo arqueológico y de naturaleza que ofrece el Perú. Las rutas directas Lima-Beijing y Lima-Tokio (via codeshare LATAM-Air China y LATAM-JAL) han sido decisivas para este crecimiento.

El turismo generó ingresos de divisas por US$ 3,200 millones en el semestre, un 15.4% por encima del mismo período de 2025, convirtiéndose en el tercer generador de divisas del país tras el cobre y el oro. El gasto promedio por visitante fue de US$ 1,123 —17% por encima del promedio de 2025—, reflejando la mayor participación del turismo de lujo y experiencial, con visitantes que combinan Machu Picchu con el Amazonas, el Lago Titicaca y la gastronomía limeña.

Machu Picchu recibió 672,000 visitas en el semestre, el 94% de la capacidad máxima permitida diaria, lo que confirma que el sistema de cupos y reservas previas implementado en 2024 está funcionando para distribuir el flujo de turistas sin llegar a la saturación. Cusco como ciudad recibió 1.1 millones de visitantes extranjeros, mientras Lima consolidó su posición como hub gastronómico regional con 1.8 millones de llegadas internacionales.`,
    analisis: `El turismo como tercer generador de divisas del Perú —con US$ 3,200 millones en el semestre— es una fuente de ingresos en moneda extranjera que complementa estructuralmente a la minería y la agroexportación. A diferencia de los commodities, el turismo genera empleo directo en zonas de alta pobreza (Cusco, Puno, Amazonas) y tiene un impacto distributivo más amplio sobre la economía local.

Para el tipo de cambio PEN/USD, el turismo elevado implica mayor ingreso de dólares de los turistas que cambian su moneda extranjera a soles para sus gastos locales. Este flujo es constante y predecible, lo que refuerza la oferta de divisas en el mercado interbancario. El segundo semestre —que incluye las temporadas alta de julio-agosto y las fiestas patrias— promete superar el primer semestre, lo que podría llevar el total anual de turismo a 6 millones de visitantes, el mejor de la historia del país.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1570610/pexels-photo-1570610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r001',
    titulo: 'Fed pausa en 3.50%–3.75% y PCE subyacente cae a 2.6%: Warsh abre la puerta a recorte en septiembre',
    descripcion: 'La Reserva Federal mantuvo sin cambios su tasa en el rango 3.50%–3.75% en la reunión del 28-29 de julio, tal como descontaba el 88% del mercado. El dato del PCE subyacente de junio, publicado hoy, cayó a 2.6% anual —la lectura más baja desde 2021— reforzando las expectativas de un recorte en septiembre.',
    contenido: `La Reserva Federal de Estados Unidos concluyó su reunión del FOMC del 28-29 de julio manteniendo la tasa de fondos federales sin cambios en el rango 3.50%–3.75%, en línea con las expectativas del 88% de los operadores que el CME FedWatch Tool reflejaba al inicio de la semana. El comunicado adoptó un tono más equilibrado que en reuniones anteriores: eliminó la referencia a "mantener la postura restrictiva el tiempo necesario" y la reemplazó por "evaluar los datos entrantes antes de ajustar la política", señal que los mercados interpretan como apertura a un recorte en septiembre.

El presidente Kevin Warsh, en su conferencia de prensa del miércoles 29, señaló que "las condiciones están madurando para una normalización gradual de la política monetaria" si los datos de los próximos 45 días confirman la tendencia desinflacionaria. Esta frase es la más dovish que ha pronunciado desde que asumió la presidencia de la Fed, y disparó un rally en todos los activos de riesgo.

El dato que refuerza el viraje del Fed llegó hoy, 31 de julio: el índice de precios del gasto en consumo personal (PCE) subyacente de junio registró una variación anual del 2.6%, por debajo del 2.8% de mayo y de las expectativas del consenso de 2.7%. Es la lectura más baja desde diciembre de 2021 y el tercer mes consecutivo de moderación. El PCE mensual fue de apenas 0.1%, lo que en términos anualizados equivale a un ritmo de inflación del 1.2%, muy por debajo del objetivo del 2%.

Los mercados de futuros ahora asignan una probabilidad del 72% a un recorte de 25 puntos básicos en la reunión del FOMC del 17 de septiembre, frente al 54% de antes del FOMC. El rendimiento del Tesoro a 2 años cede 14 puntos básicos a 4.28% y el bono a 10 años opera en 4.48%, el nivel más bajo desde enero. El DXY retrocede a 103.1 puntos.`,
    analisis: `Una Fed que abre la puerta al primer recorte en septiembre combinada con un PCE subyacente en 2.6% es el escenario que los mercados emergentes han estado esperando. La debilidad del dólar —DXY en 103.1— reduce la presión sobre el sol peruano y favorece un tipo de cambio más bajo. El PEN se ha apreciado desde los S/ 3.41 de principios de semana hacia S/ 3.389 en la jornada de hoy.

Para empresas peruanas con deuda en dólares o importadores, este escenario es positivo en el corto plazo: el dólar más débil reduce el costo en soles de sus obligaciones. Sin embargo, si el primer recorte de la Fed se materializa en septiembre, podría haber volatilidad en los días previos y posteriores. Planificar las conversiones de divisas antes de esa reunión, con tipos competitivos como los de QoriCash, es la estrategia más prudente.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r002',
    titulo: 'Sol peruano se aprecia a S/ 3.389 post-FOMC: el mejor nivel en seis semanas con DXY en 103.1',
    descripcion: 'El tipo de cambio PEN/USD opera en S/ 3.389 este jueves 31 de julio, apreciándose 0.6% en la jornada tras la pausa del Fed con tono dovish y el dato del PCE subyacente en 2.6%. El DXY en mínimos de seis semanas libera presión sobre el sol, que registra su mejor nivel desde mediados de junio.',
    contenido: `El sol peruano opera en S/ 3.389 por dólar en la sesión de este jueves 31 de julio, apreciándose 0.6% frente al cierre del martes (S/ 3.412) y alcanzando su mejor nivel desde el 16 de junio. La apreciación responde directamente a la pausa del Fed con tono dovish confirmada el miércoles 29 de julio y al dato del PCE subyacente de junio —2.6% anual, publicado esta mañana— que refuerza el escenario de recorte en septiembre. El índice DXY retrocede a 103.1 puntos, su nivel más bajo en seis semanas, aliviando la presión estructural sobre todas las monedas emergentes.

El volumen negociado en el mercado interbancario de Lima alcanzó US$ 320 millones en la sesión de hoy, por encima del promedio de US$ 240 millones de las últimas dos semanas, lo que refleja que los exportadores están aprovechando la coyuntura para vender dólares a tipos de cambio más bajos. El Banco Central de Reserva del Perú (BCRP) no intervino en la sesión matutina, permitiendo al mercado encontrar su equilibrio natural dado el contexto de abundante oferta de divisas.

El sol peruano muestra el mejor desempeño en la región esta semana: se aprecia 0.6% frente al dólar, mientras el peso colombiano gana 0.4%, el peso chileno 0.5% y el real brasileño 0.7%. El mayor diferencial de tasas entre el BCRP (4.25%) y el Fed (3.50%–3.75%), combinado con el superávit comercial récord y las reservas internacionales por encima de US$ 80,000 millones, continúan siendo los pilares de la fortaleza relativa del PEN frente a sus pares regionales.

Técnicamente, el PEN/USD consolida por debajo de la media móvil de 20 días en S/ 3.398, con soporte inmediato en S/ 3.380 (mínimo de junio) y resistencia en S/ 3.395–3.400. Si el DXY continúa cediendo hacia 102–103 en las próximas semanas ante las expectativas de recorte del Fed en septiembre, el PEN podría apreciarse hasta S/ 3.37–3.38.`,
    analisis: `El sol en S/ 3.389 es buena noticia para importadores y quienes tienen deuda en dólares, pero implica que los exportadores reciben menos soles por cada dólar vendido. El equilibrio del mercado cambiario sigue siendo favorable para el PEN gracias al superávit de exportaciones mineras y agropecuarias que provee una oferta constante de divisas.

Para quienes necesitan comprar dólares en las próximas semanas, el nivel actual de S/ 3.389 es relativamente atractivo comparado con los S/ 3.41–3.42 de principios de semana. Aprovechar esta ventana antes de que eventuales factores externos reviertan parte de la apreciación del sol es una estrategia razonable.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r003',
    titulo: 'BCRP mantiene tasa en 4.25% y evalúa primer recorte en Q4 si la desinflación del Fed se consolida',
    descripcion: 'El Banco Central de Reserva del Perú mantuvo su tasa de política monetaria en 4.25% en su reunión de julio. Con el PCE subyacente de EE.UU. en 2.6% y el Fed abriendo la puerta a un recorte en septiembre, el directorio peruano analiza si iniciar su propio ciclo de recortes en el cuarto trimestre de 2026.',
    contenido: `El Directorio del Banco Central de Reserva del Perú (BCRP) decidió por unanimidad mantener la tasa de interés de referencia en 4.25% anual en su reunión mensual de julio, cumpliendo con las expectativas del mercado. El comunicado destacó que la inflación anual de junio se ubica en 2.3% —por debajo del punto central del rango meta del 3%— y que las expectativas de inflación a 12 meses continúan bien ancladas en 2.6%, lo que otorga al directorio un margen de maniobra que no tenía hace un año.

La atención del mercado se centra en cuándo el BCRP podría iniciar su propio ciclo de recortes. El directorio señaló en su comunicado que "el contexto externo ha mejorado de manera significativa tras la reunión del FOMC del 28-29 de julio" y que se evaluarán las condiciones macroeconómicas en las próximas reuniones de agosto y septiembre. Los analistas de renta fija local asignan ahora una probabilidad del 35% a un recorte de 25 puntos básicos del BCRP en octubre, frente al 20% previo al FOMC.

El diferencial de tasas entre el BCRP (4.25%) y el límite superior del Fed Funds (3.75%) es actualmente de 50 puntos básicos, el mínimo en tres años. Si el Fed recorta en septiembre hasta 3.25%–3.50%, el diferencial a favor del sol peruano se ampliaría nuevamente, lo que podría atraer flujos de carry trade hacia activos en soles y favorecer la apreciación del PEN. Esto paradójicamente le daría al BCRP más espacio para recortar tasas sin generar depreciación del sol.

Las reservas internacionales netas del BCRP se mantienen en US$ 80,400 millones, equivalentes a más de 18 meses de importaciones. La institución también revisó al alza su proyección de crecimiento del PBI para 2026 a 3.3%, desde el 3.1% estimado en mayo, impulsada por el dinamismo minero y agropecuario del primer semestre.`,
    analisis: `La pausa del BCRP en 4.25% combinada con una inflación en 2.3% implica que la tasa real de política monetaria en Perú es de casi 2%, el nivel más alto desde 2008. Esto es restrictivo en relación al ciclo económico actual, lo que sugiere que los recortes son una cuestión de cuándo, no de si. El escenario más probable es un recorte de 25 puntos básicos en octubre o noviembre, condicionado a que el Fed recorte en septiembre y la inflación local se mantenga bajo control.

Para el mercado de deuda en soles, la perspectiva de recortes del BCRP en el corto plazo es positiva: los precios de los bonos soberanos en soles subirán a medida que las tasas caigan. Las empresas con planes de emitir deuda en soles deberían evaluar si esperar al ciclo de recortes o actuar ahora antes de que la demanda por esos instrumentos se intensifique.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r004',
    titulo: 'Cobre supera US$ 4.90/libra en LME tras PMI chino y pausa dovish del Fed: exportaciones peruanas en máximos',
    descripcion: 'El precio del cobre en la Bolsa de Metales de Londres avanzó a US$ 4.90 por libra este jueves, impulsado por el PMI manufacturero chino de julio que regresó a zona de expansión y la debilidad del dólar post-FOMC. Las exportaciones peruanas de cobre acumulan US$ 11,200 millones en el primer semestre, un récord histórico.',
    contenido: `El cobre en la Bolsa de Metales de Londres (LME) avanzó a US$ 4.90 por libra este jueves 31 de julio, una ganancia del 1.8% en la jornada, impulsado por la conjunción de tres factores positivos: la pausa dovish del Fed que debilita el dólar y encarece los commodities denominados en USD, el PMI manufacturero de China de julio que regresó a 50.1 —zona de expansión— y los datos de exportaciones peruanas del semestre que confirman volúmenes récord. El precio acumula un alza del 22% en lo que va del año y se acerca a sus máximos históricos de US$ 5.10 de 2024.

Las exportaciones peruanas de cobre del primer semestre de 2026 alcanzaron US$ 11,200 millones, un nuevo récord que supera en 14.6% al mismo período del año anterior. Los proyectos de Quellaveco (Anglo American), Las Bambas (MMG), Cerro Verde (Freeport-McMoRan) y Antamina aportaron volúmenes combinados de 1.45 millones de toneladas métricas finas (TMF) en el semestre, un 6.2% más que en el primer semestre de 2025. El Ministerio de Energía y Minas proyecta una producción anual de 3.0 millones de TMF para 2026, lo que sería el máximo histórico del Perú.

El contexto de demanda de cobre sigue siendo estructuralmente sólido: la construcción de redes eléctricas para energías renovables, la producción de vehículos eléctricos y el desarrollo de centros de datos para inteligencia artificial generan una demanda creciente que los analistas de Goldman Sachs y BHP estiman en 3.5 millones de toneladas adicionales para 2030. Este "superciclo de cobre verde" es el principal motor de precios a mediano plazo.

El impacto fiscal del cobre alto es directo: las regalías mineras y el canon transferido a las regiones productoras (Arequipa, Moquegua, Apurímac, Tacna) acumulan S/ 9,800 millones en el primer semestre, 18% por encima del mismo período de 2025, financiando obras de infraestructura y servicios públicos.`,
    analisis: `El cobre en US$ 4.90/libra con exportaciones en récord es el mejor escenario posible para la estabilidad del sol peruano. Cada dólar que suben las exportaciones mineras refuerza la oferta de divisas en el mercado local, actuando como amortiguador natural contra las presiones depreciatorias externas. Este es el principal diferencial de Perú frente a otras economías emergentes sin esta fortaleza exportadora.

Para empresas proveedoras del sector minero con ingresos en soles y gastos en dólares (maquinaria, insumos importados), el contexto de sol apreciado post-FOMC reduce temporalmente el costo en soles de sus importaciones. Aprovechar este nivel para cubrir necesidades de dólares de los próximos 30–60 días es una decisión racionalmente prudente.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r005',
    titulo: 'Agroexportaciones peruanas superan US$ 5,200 millones en el primer semestre con arándanos como producto estrella',
    descripcion: 'Las exportaciones agropecuarias no tradicionales del Perú alcanzaron US$ 5,200 millones entre enero y junio de 2026, un crecimiento del 9.2% interanual. Los arándanos frescos con US$ 510 millones y la palta Hass con US$ 1,340 millones lideran el dinamismo exportador hacia EE.UU. y Europa.',
    contenido: `Las exportaciones agropecuarias no tradicionales del Perú superaron los US$ 5,200 millones en el primer semestre de 2026, con un crecimiento del 9.2% respecto al mismo período de 2025, según datos del Ministerio de Comercio Exterior y Turismo (Mincetur). El resultado consolida al Perú como el segundo exportador agrícola de América Latina detrás de Brasil, y el primero en términos de valor por hectárea cosechada. La campaña de invierno australiano —la más importante para las exportaciones hacia el hemisferio norte— se desarrolla en condiciones climáticas favorables en La Libertad, Ica y Piura.

La palta Hass lidera las exportaciones agropecuarias con US$ 1,340 millones en el semestre (+21% interanual), consolidando al Perú como el mayor exportador mundial del fruto por segundo año consecutivo. Le sigue los arándanos con US$ 510 millones (+14%), las uvas de mesa con US$ 420 millones (+8%), y los espárragos con US$ 340 millones (+4%). El precio promedio de la palta peruana en los mercados europeos alcanzó US$ 1.94 por kilogramo, el nivel más alto en cuatro años, gracias a la mayor demanda y a la reducción de la oferta competidora de México.

Las empresas exportadoras líderes —Camposol, Sociedad Agrícola Virú, HassAvocado Board y Avocado Packing Company— reportaron una temporada con tasas de rechazo en aduanas europeas por debajo del 0.5%, señal de la alta calidad del producto peruano. Las certificaciones GlobalG.A.P., Rainforest Alliance y la nueva norma de deforestación europea (EUDR) han sido adoptadas por el 78% de los exportadores peruanos, lo que facilita el acceso a los mercados premium de Alemania, Países Bajos y Reino Unido.

El sector agro no tradicional genera empleo directo para más de 420,000 trabajadores y empleo indirecto para otros 800,000 en zonas costeras. El Ministerio de Agricultura proyecta que las exportaciones agropecuarias totales superarán US$ 12,500 millones al cierre de 2026, un nuevo récord histórico.`,
    analisis: `El boom agroexportador actúa como un segundo motor de divisas para Perú, complementando a la minería y reduciendo la dependencia de un solo sector. Cuando los precios del cobre son altos Y las agro exportaciones crecen simultáneamente —como ocurre ahora—, la oferta de dólares en el mercado local es tan abundante que el BCRP casi no necesita intervenir para sostener al sol.

Para los meses de agosto y septiembre, que coinciden con el peak de ventas de arándanos y uvas de mesa, la oferta de dólares de exportadores agrícolas será especialmente elevada, lo que tenderá a mantener el tipo de cambio en la parte baja del rango de S/ 3.37–3.40. Este contexto favorece a importadores y a quienes tienen gastos en dólares programados para el tercer trimestre.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r006',
    titulo: 'MEF: resultado fiscal primario acumula superávit de 0.4% del PBI en primer semestre, el mejor en cuatro años',
    descripcion: 'El Ministerio de Economía y Finanzas reportó que el resultado primario del sector público no financiero acumuló un superávit de 0.4% del PBI en el primer semestre de 2026, impulsado por la recaudación récord vinculada al auge minero. El déficit fiscal anual se proyecta en 2.1% del PBI, por debajo del techo legal del 3%.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó hoy el cierre fiscal del primer semestre de 2026, reportando un resultado primario positivo del sector público no financiero equivalente al 0.4% del Producto Bruto Interno. Es el primer superávit primario semestral desde el primer semestre de 2022 y el mejor resultado en cuatro años, impulsado por la recaudación tributaria récord vinculada al boom minero y las exportaciones agropecuarias.

Los ingresos tributarios del primer semestre crecieron 11.8% en términos reales frente al mismo período de 2025, alcanzando S/ 102,400 millones. El Impuesto a la Renta de tercera categoría —que grava las utilidades de empresas— avanzó 28.4% real gracias a los mayores beneficios del sector minero en un contexto de precios de metales históricamente elevados. El IGV interno creció 6.2% real, reflejo de la recuperación del consumo privado y la inversión en construcción.

El gasto público se ejecutó al 48.3% del presupuesto anual al cierre de junio, ligeramente por encima del 46.8% del mismo período de 2025, con la inversión pública creciendo 8.4% real. El MEF destacó que el gasto en infraestructura alcanzó S/ 14,800 millones en el semestre, el más alto de la historia, financiado principalmente con recursos del canon y las regalías mineras.

La deuda pública bruta se sitúa en el 33.8% del PBI, uno de los niveles más bajos de la región, lo que otorga al gobierno espacio fiscal para responder ante eventuales choques externos. El MEF proyecta que el déficit fiscal anual cerrará en 2.1% del PBI, por debajo del techo legal del 3%, lo que refuerza la credibilidad fiscal del Perú frente a los mercados internacionales de capitales.`,
    analisis: `Un resultado primario positivo en el primer semestre es una señal de solidez fiscal que los mercados de bonos soberanos valoran positivamente. Cuando el gobierno no necesita endeudarse para financiar sus gastos corrientes, la presión sobre el tipo de cambio desde el canal fiscal es prácticamente nula. Esto refuerza la posición del sol peruano frente a otras monedas emergentes con posiciones fiscales más débiles.

Para el segundo semestre, el MEF planifica acelerar la inversión pública en infraestructura, lo que generará mayor demanda de bienes de capital importados en dólares. Sin embargo, el superávit primario del primer semestre y las reservas del BCRP en US$ 80,400 millones dan amplio colchón para absorber esta mayor demanda de divisas sin presionar el tipo de cambio.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r007',
    titulo: 'PMI manufacturero de China sube a 50.1 en julio y regresa a zona de expansión tras dos meses en contracción',
    descripcion: 'El índice PMI manufacturero oficial de China para julio se ubicó en 50.1 puntos, superando el umbral de expansión por primera vez en tres meses y por encima de las expectativas del mercado de 49.6. Los estímulos fiscales de Beijing y la aceleración del gasto en infraestructura impulsan la recuperación.',
    contenido: `El índice de gerentes de compras (PMI) del sector manufacturero de China para julio se ubicó en 50.1 puntos según los datos del Buró Nacional de Estadísticas (NBS), publicados esta mañana, superando el umbral de expansión de 50 por primera vez desde abril y revirtiendo la tendencia contractiva de mayo (49.5) y junio (49.3). El dato superó las expectativas del consenso de analistas que proyectaban 49.6, y generó un rally en los activos vinculados a China y en los precios de los commodities industriales.

El regreso a la expansión manufacturera responde al efecto de los estímulos fiscales anunciados por Beijing a mediados de julio: 800,000 millones de yuanes (aproximadamente US$ 110,000 millones) en gasto de infraestructura acelerado para el segundo semestre, focalizados en ferrocarriles de alta velocidad, redes eléctricas renovables y expansión de puertos. El subíndice de nuevos pedidos internos subió a 51.2, el más alto desde enero, señal de que la demanda doméstica está respondiendo a los estímulos. Los nuevos pedidos de exportación, sin embargo, permanecen en zona de contracción en 48.9, reflejando la debilidad de la demanda global.

El componente de empleo subió marginalmente a 49.4, aún en zona de contracción pero mejorando desde el 48.9 de junio. Los precios de los insumos se moderaron, con el subíndice de precios pagados en 50.8, lo que sugiere que las presiones inflacionarias en el sector manufacturero chino continúan cediendo. El PMI no manufacturero, en tanto, avanzó a 52.3, impulsado por el sector de servicios y la construcción.

El Banco Popular de China (PBoC) respondió con un mensaje de cautela optimista: señaló que "la recuperación del sector manufacturero sigue siendo frágil y dependiente del apoyo fiscal" y que mantendrá una política monetaria "moderadamente expansiva" para el resto del año.`,
    analisis: `El retorno del PMI chino a zona de expansión es una noticia directamente positiva para el cobre peruano y, por ende, para el sol. China consume el 55% del cobre mundial, y un sector manufacturero en crecimiento implica mayor demanda de este metal para cableado eléctrico, construcción y equipamiento industrial. El precio del cobre ya reaccionó subiendo a US$ 4.90/libra en LME hoy.

Para el tipo de cambio PEN/USD, el PMI chino positivo refuerza el escenario de sol fuerte: más demanda china de cobre = más exportaciones peruanas = más dólares en el sistema financiero peruano = menor presión sobre el tipo de cambio. El dato de agosto del PMI (que se publicará el 1 de septiembre) será clave para confirmar si la recuperación es sostenida.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r008',
    titulo: 'Brent cede a US$ 84.5 en jornada de risk-on post-FOMC mientras OPEP+ señala revisión de cuotas en agosto',
    descripcion: 'El petróleo Brent retrocede 1.6% a US$ 84.5 por barril este jueves en una sesión dominada por el apetito de riesgo post-FOMC. La posible apertura del Estrecho de Ormuz y las señales de la OPEP+ sobre un ajuste de cuotas en agosto reducen la prima geopolítica acumulada en las últimas semanas.',
    contenido: `El petróleo Brent cotiza en US$ 84.5 por barril en la sesión de este jueves 31 de julio, retrocediendo 1.6% (US$ 1.38) respecto al cierre del miércoles, en una jornada marcada por el apetito generalizado de riesgo tras la pausa dovish del Fed. El WTI también cede, operando en US$ 79.8 (-1.4%), con el diferencial Brent-WTI estabilizándose en US$ 4.7, señal de que la prima geopolítica del crudo internacional está reduciéndose.

El principal catalizador bajista para el petróleo es la combinación de tres factores: el dólar más débil post-FOMC (DXY en 103.1) que inicialmente presiona al alza a los commodities pero luego es dominado por la toma de ganancias; las señales de Qatar de que las negociaciones diplomáticas entre EE.UU. e Irán están progresando, lo que podría derivar en la reapertura del Estrecho de Ormuz en las próximas semanas; y las declaraciones de Arabia Saudita ante la OPEP+ indicando que el cartel revisará sus cuotas de producción en la reunión de agosto, con la posibilidad de una liberación adicional de 400,000 barriles diarios.

La Agencia Internacional de Energía (AIE) publicó hoy su reporte mensual de mercado petrolero, revisando al alza su proyección de demanda global para el tercer trimestre a 103.6 millones de barriles diarios, gracias al PMI chino mejor de lo esperado y la recuperación del transporte aéreo en Asia. Sin embargo, también revisó al alza su estimación de oferta no-OPEP (EE.UU., Canadá, Brasil, Guyana) en 400,000 barriles diarios, lo que compensa parcialmente cualquier reducción de exportaciones iraníes.

Los inventarios comerciales de crudo en EE.UU. reportados hoy por la EIA muestran una reducción de 3.4 millones de barriles la semana pasada, por encima de las expectativas de -1.8 millones, lo que actúa como soporte para el precio y limita el alcance de la corrección bajista.`,
    analisis: `Un Brent en US$ 84.5 es positivo para la inflación global: reduce las presiones en costos de transporte, energía y producción industrial, lo que da más margen a los bancos centrales para iniciar o continuar ciclos de recorte de tasas. Para el Perú, importador neto de combustibles refinados, la corrección del petróleo alivia la presión sobre los precios domésticos de gasolina y diésel.

Para el tipo de cambio, un petróleo más bajo reduce marginalmente la urgencia de la Fed para mantener tasas altas, lo que contribuye a la debilidad del dólar y favorece al sol peruano. El nivel de US$ 84–87 para el Brent es el rango más cómodo para los bancos centrales emergentes: ni tan bajo que genere recesión en los países productores, ni tan alto que reacelere la inflación global.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r009',
    titulo: 'Oro avanza a US$ 3,368/oz con el dólar en mínimos de seis semanas: el metal reactiva su correlación inversa con el DXY',
    descripcion: 'El precio del oro al contado sube 0.9% a US$ 3,368 por onza este jueves, beneficiado por la debilidad del dólar post-FOMC con el DXY en 103.1. La pausa dovish del Fed y el PCE subyacente en 2.6% refuerzan el atractivo del oro como cobertura ante la eventual depreciación del dólar.',
    contenido: `El oro al contado (spot) avanza a US$ 3,368 por onza troy en la sesión de este jueves 31 de julio, con una ganancia del 0.9% (US$ 30/oz) en la jornada, beneficiado por la debilidad generalizada del dólar tras la pausa dovish del FOMC y el dato del PCE subyacente en 2.6% —el más bajo desde 2021— publicado esta mañana. El metal precioso reactiva su correlación inversa con el DXY: cuando el índice del dólar cae (hoy en 103.1, mínimo de seis semanas), el oro denominado en dólares se encarece para compradores no estadounidenses, estimulando la demanda.

El rally del oro en lo que va del año alcanza el 30.2% (desde US$ 2,587/oz a inicio de 2026), superando al S&P 500 (+14.8%) y convirtiéndose en el activo de mejor desempeño del año entre las clases de activos tradicionales. Los bancos centrales siguen siendo compradores netos: el Consejo Mundial del Oro reportó adquisiciones netas de 315 toneladas en el primer semestre de 2026, 8% por encima del mismo período de 2025. China, India y Turquía lideran las compras.

El análisis técnico muestra que el oro consolida por encima de la resistencia clave de US$ 3,350 —ahora convertida en soporte— con el próximo objetivo en US$ 3,400 y luego en el máximo histórico de US$ 3,430 de mayo. El RSI de 14 días se ubica en 63, con margen para más alzas antes de entrar en zona de sobrecompra. Las posiciones largas netas en futuros de oro en COMEX aumentaron 12% en la última semana, señal de acumulación institucional.

Para Perú, como tercer productor mundial de oro, el precio en US$ 3,368 genera ingresos adicionales significativos: en los últimos 12 meses, el oro representó el 16% de las exportaciones totales peruanas (aproximadamente US$ 18,500 millones). Cada US$ 100 de alza en el precio por onza equivale a aproximadamente US$ 80 millones adicionales en ingresos de exportación mensuales.`,
    analisis: `El oro en US$ 3,368 beneficia directamente las cuentas externas peruanas y refuerza el superávit comercial que ancla al sol. Adicionalmente, la correlación inversa del oro con el dólar —ambos moviéndose en direcciones opuestas hoy— crea un mecanismo de doble apoyo para el PEN: dólar débil + oro caro = más divisas por exportaciones de oro + menos presión depreciadora del DXY.

Para inversores peruanos que buscan diversificar su portafolio, el oro en niveles históricos es señal de incertidumbre macroeconómica global persistente. La exposición al oro puede realizarse a través de fondos como GLD o IAU, o directamente vía contratos de futuros. Sin embargo, el oro no genera rendimiento corriente, por lo que su peso en un portafolio debe equilibrarse con activos generadores de flujo como bonos soberanos peruanos o depósitos a plazo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r010',
    titulo: 'DXY cae a 103.1 puntos tras PCE en 2.6%: el dólar registra su mayor corrección semanal en cuatro meses',
    descripcion: 'El índice del dólar (DXY) retrocede a 103.1 puntos este jueves, su nivel más bajo desde el 12 de junio, acumulando una pérdida del 1.4% en la semana. El PCE subyacente en 2.6% y la pausa dovish del Fed han desencadenado una corrección técnica del dólar que beneficia a todas las monedas emergentes.',
    contenido: `El índice del dólar estadounidense (DXY) retrocede a 103.1 puntos en la sesión de este jueves 31 de julio, su nivel más bajo desde el 12 de junio, acumulando una pérdida del 1.4% en la semana —la mayor corrección semanal del billete verde en cuatro meses. El catalizador fue la combinación del comunicado dovish del FOMC del miércoles 29 y el dato del PCE subyacente de junio en 2.6% publicado esta mañana, que en conjunto refuerzan el escenario de recorte del Fed en septiembre y reducen el diferencial de tasas a favor del dólar.

El euro recupera terreno frente al dólar, cotizando en 1.0960 (+0.9% en la semana), su nivel más alto en dos meses. El Banco Central Europeo mantiene su tasa en 2.75% y los mercados descuentan que el próximo movimiento del BCE será de pausa hasta que la inflación de la eurozona converja al 2%. La perspectiva de que el diferencial de tasas Fed-BCE se reduzca en septiembre si el Fed recorta es el principal motor de la apreciación del euro.

El yen japonés se aprecia a 149.2 por dólar, recuperando algo del terreno perdido en el año. El Banco de Japón (BoJ) mantiene su tasa en 0.25% y cualquier señal de normalización monetaria nipona en los próximos meses ampliaría la apreciación del yen significativamente. El mercado de swaps ahora descuenta un alza de tasas del BoJ en octubre con una probabilidad del 38%, frente al 22% de antes del FOMC.

Las monedas emergentes reaccionan positivamente: el MSCI EM Currency Index avanza 0.8% en la semana, con el real brasileño (+1.2%), el peso colombiano (+0.9%) y el sol peruano (+0.6%) entre los mejores desempeños. Las entradas de capitales a fondos de bonos de mercados emergentes acumulan US$ 2,100 millones en la semana, revirtiendo semanas de salidas.`,
    analisis: `Un DXY en 103.1 es una clara señal de alivio para el tipo de cambio PEN/USD. Históricamente, cada 1% de caída del DXY produce una apreciación del PEN de entre 0.3% y 0.5%, dependiendo de la intensidad de la intervención del BCRP. La apreciación del sol a S/ 3.389 hoy es consistente con ese patrón.

El riesgo para los próximos 30–45 días es que el DXY rebote si los datos de empleo de julio (nóminas no agrícolas del 7 de agosto) o la inflación CPI de julio (14 de agosto) sorprenden al alza, revirtiendo las expectativas de recorte en septiembre. Esa posibilidad es el principal factor de incertidumbre cambiaria para agosto. Diversificar las compras de dólares en tramos y no concentrar todas las necesidades en un solo momento sigue siendo la estrategia más prudente.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r011',
    titulo: 'Bitcoin escala a US$ 108,500 post-FOMC y desafía máximos históricos en jornada de fuerte apetito de riesgo',
    descripcion: 'Bitcoin avanza 5.2% a US$ 108,500 este jueves, acercándose al máximo histórico de US$ 109,800 de enero de 2025, impulsado por el rally de activos de riesgo post-FOMC y el dato de PCE subyacente en 2.6%. Los ETFs de Bitcoin spot en EE.UU. registran entradas netas de US$ 680 millones en el día.',
    contenido: `Bitcoin cotiza en US$ 108,500 en la sesión de este jueves 31 de julio, con una ganancia del 5.2% (US$ 5,370) en las últimas 24 horas, acercándose al máximo histórico de US$ 109,800 registrado el 20 de enero de 2025. El rally es parte del movimiento amplio de activos de riesgo desencadenado por la pausa dovish del Fed y el dato de PCE subyacente en 2.6%: en entornos de tasas a la baja y dólar débil, Bitcoin históricamente exhibe correlación positiva con el apetito de riesgo global.

Los ETFs de Bitcoin spot en EE.UU. registran entradas netas de US$ 680 millones en la jornada de hoy, el mejor día desde el 22 de enero. BlackRock (iShares Bitcoin Trust) concentra el 45% de las entradas con US$ 306 millones, seguido de Fidelity (US$ 148 millones) y ARK/21Shares (US$ 89 millones). El total de activos bajo gestión de todos los ETFs de Bitcoin spot en EE.UU. supera los US$ 68,000 millones, consolidando al instrumento como la segunda categoría de ETF de mayor captación del año tras los ETFs de acciones tecnológicas.

El análisis técnico es alcista: Bitcoin ha superado la resistencia crítica de US$ 105,000 —zona de máximos de junio— con un volumen de trading en exchanges regulados que cuadruplica el promedio de la última semana. El RSI de 14 días alcanza 71, en zona de sobrecompra, lo que podría generar una corrección de corto plazo hacia US$ 104,000–106,000 antes de intentar el máximo histórico. El patrón de ondas de Elliott sugiere que el impulso alcista podría extenderse hacia US$ 115,000–120,000 si se supera el máximo de US$ 109,800 con volumen sostenido.

Ethereum avanza 4.8% a US$ 3,580 y Solana sube 6.1% a US$ 188. La capitalización total del mercado cripto alcanza los US$ 3.95 billones, el nivel más alto desde enero de 2025.`,
    analisis: `El rally de Bitcoin a US$ 108,500 tiene un impacto indirecto sobre el PEN: en el corto plazo, el apetito de riesgo que impulsa al Bitcoin también favorece a las monedas emergentes de fundamentos sólidos como el sol peruano. La correlación entre el DXY (débil) y Bitcoin (fuerte) que se observa hoy es el patrón "risk-on" clásico que históricamente beneficia al PEN.

Para quienes tienen tenencias de Bitcoin u otras criptos denominadas en dólares y planean convertirlas a soles para cubrir gastos locales, el nivel actual —US$ 108,500 con tipo de cambio en S/ 3.389— implica que cada BTC equivale a aproximadamente S/ 367,710. El timing de la conversión (primero de cripto a dólares, luego de dólares a soles) puede hacer diferencias importantes: usar una casa de cambio como QoriCash para la última conversión maximiza el retorno en soles.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r012',
    titulo: 'PEN/USD técnico post-FOMC: sol consolida en S/ 3.389 con soporte en 3.380 y objetivo de 3.370 si el DXY cede a 102',
    descripcion: 'El análisis técnico del tipo de cambio PEN/USD muestra al sol peruano consolidando en S/ 3.389 tras la ruptura del soporte de S/ 3.395–3.400. Los indicadores técnicos apuntan a una extensión de la apreciación hacia S/ 3.375–3.380 si el DXY confirma su corrección por debajo de 103 en las próximas sesiones.',
    contenido: `El tipo de cambio PEN/USD opera en S/ 3.389 este jueves 31 de julio, rompiendo de manera técnica el soporte del canal lateral S/ 3.388–3.405 que había contenido al par durante las últimas tres semanas. La ruptura a la baja del canal —que desde la perspectiva del PEN representa una apreciación del sol— ocurre con volumen significativamente por encima del promedio, lo que valida el movimiento y reduce la probabilidad de una recuperación inmediata del dólar hacia los niveles previos.

Los indicadores técnicos confirman el sesgo apreciador del sol: el RSI de 14 días se ubica en 38 (donde un RSI bajo implica que el dólar está sobrevendido relativo al sol, indicando apreciación del PEN), el MACD cruza a la baja la línea de señal en el gráfico del USD/PEN —señal vendedora de dólar— y las Bandas de Bollinger se han abierto a la baja, lo que indica momentum. La media móvil de 20 días del PEN/USD (S/ 3.398) actúa ahora como resistencia.

Los niveles clave a monitorear son: soporte inmediato del dólar en S/ 3.380 (mínimo del 16 de junio y 61.8% de Fibonacci del rally de junio–julio), soporte secundario en S/ 3.368 (mínimo de marzo), resistencia inmediata en S/ 3.395–3.400 (zona del canal roto) y resistencia fuerte en S/ 3.412 (máximo de esta semana). El escenario base para agosto contempla un rango de S/ 3.375–3.395 si el DXY consolida entre 102 y 104.

El posicionamiento especulativo muestra una reversión notable: según datos del mercado de derivados de Lima, los operadores que tenían posiciones largas en dólares (apostando a alza del dólar) han comenzado a cerrar posiciones, lo que añade presión vendedora adicional sobre el billete verde en el mercado local. El volumen de operaciones de contado en Lima es un 35% más alto que el promedio de la última semana.`,
    analisis: `La ruptura técnica del canal lateral a favor del sol peruano, con volumen y momentum confirmados, es una señal que los gestores de riesgo cambiario deben considerar. Para importadores o quienes tienen obligaciones en dólares en agosto, la ventana de S/ 3.385–3.395 representa un punto de entrada atractivo antes de que el tipo de cambio pueda apreciarse aún más si el DXY continúa cediendo.

El riesgo al alza para el dólar —que revertiría esta tendencia— está en los datos de empleo de julio (nóminas del 7 de agosto) y la inflación CPI de julio (14 de agosto). Si cualquiera de estos datos sorprende al alza, el mercado podría revertir las apuestas sobre el recorte del Fed en septiembre, empujando el dólar de vuelta hacia S/ 3.40–3.42. Una gestión prudente implica no esperar indefinidamente a que el sol continúe apreciándose, sino aprovechar el nivel actual para cubrir las necesidades de corto plazo.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r013',
    titulo: 'Argentina: inflación de junio en 2.9% mensual acumula 24.1% en el primer semestre y consolida desinflación',
    descripcion: 'El INDEC reportó que la inflación mensual de Argentina en junio fue del 2.9%, la más baja desde noviembre de 2021, acumulando 24.1% en el primer semestre de 2026. La brecha cambiaria entre el dólar oficial (ARS 1,510) y el blue (ARS 1,553) se mantiene en el mínimo histórico del 2.8%.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó hoy el dato de inflación de junio de 2026: el Índice de Precios al Consumidor (IPC) registró una variación mensual del 2.9%, la lectura más baja desde noviembre de 2021 y por debajo de las expectativas del mercado del 3.1%. La inflación acumulada del primer semestre de 2026 totaliza 24.1%, una desaceleración drástica frente al 112.4% del mismo período de 2023, reflejando el impacto del programa de estabilización macroeconómica del gobierno del presidente Javier Milei.

La inflación núcleo —que excluye alimentos y energía— bajó a 2.6% mensual, la lectura más baja en más de tres años. Los alimentos y bebidas no alcohólicas subieron 3.1%, moderándose desde el 3.8% de mayo gracias a la mejora de la cadena de suministros y la mayor competencia en la distribución minorista. Los servicios regulados fueron el componente más dinámico con un alza del 4.2% mensual, aún impulsado por los ajustes tarifarios de luz, gas y agua, pero a un ritmo significativamente más lento que en el primer trimestre.

El Banco Central de la República Argentina (BCRA) mantiene su tasa de referencia en 33% anual —en un proceso gradual de reducción desde el máximo histórico de 133% de 2023— y las reservas brutas superan los US$ 44,200 millones, el nivel más alto en siete años. El dólar oficial opera en ARS 1,510, con la brecha cambiaria frente al blue (ARS 1,553) en el mínimo histórico del 2.8%, señal del grado de unificación efectiva del mercado cambiario que ha logrado el equipo económico.

El FMI aprobó el 15 de julio el quinto desembolso del programa Extended Fund Facility por US$ 2,100 millones, condicionado al cumplimiento de las metas fiscales y de reservas. El resultado primario del primer semestre acumula un superávit de 1.4% del PBI, por encima de la meta acordada con el organismo multilateral.`,
    analisis: `La consolidación del proceso desinflacionario argentino tiene implicaciones positivas para la región: una Argentina más estable reduce el riesgo de contagio sobre otras monedas latinoamericanas, incluido el sol peruano. En el pasado, las crisis argentinas generaban episodios de volatilidad regional que presionaban al PEN incluso cuando los fundamentos peruanos eran sólidos.

Para empresas peruanas con relaciones comerciales en Argentina, el contexto actual es más favorable que en años recientes. La brecha cambiaria en 2.8% simplifica la gestión de pagos y cobros en pesos argentinos. Sin embargo, con una inflación aún en 2.9% mensual, es prudente establecer cláusulas de ajuste en contratos de mediano plazo o denominarlos en dólares con pagos al tipo de cambio oficial del BCRA.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r014',
    titulo: 'Colombia: PBI creció 2.6% en Q2 2026 y supera expectativas; BanRep evalúa tercer recorte consecutivo en agosto',
    descripcion: 'El DANE reportó que la economía colombiana creció 2.6% interanual en el segundo trimestre de 2026, superando el 2.3% esperado por el consenso. El dinamismo de los servicios y la construcción compensan la debilidad del sector petrolero. El Banco de la República evalúa un tercer recorte de tasas para su reunión de agosto.',
    contenido: `El Departamento Administrativo Nacional de Estadística (DANE) de Colombia publicó hoy el dato de crecimiento del Producto Interno Bruto del segundo trimestre de 2026: la economía colombiana se expandió 2.6% interanual entre abril y junio, superando el 2.3% proyectado por el consenso de analistas y acelerándose frente al 2.1% del primer trimestre. El resultado coloca a Colombia en trayectoria hacia un crecimiento anual cercano al 2.5%–2.8% para 2026, por encima de las proyecciones del Banco de la República de inicios de año.

El crecimiento estuvo liderado por el sector de servicios (+3.4%), que se beneficia de la recuperación del turismo y el consumo de hogares, y la construcción (+5.8%), que responde a proyectos de vivienda de interés social y obras de infraestructura del programa Colombia Potencia Mundial. El sector manufacturero creció 1.8%, beneficiado por la mayor demanda doméstica y la diversificación exportadora hacia mercados de Ecuador y Centroamérica. El sector petrolero, en cambio, se contrajo 1.2% debido a la madurez de los yacimientos y la menor inversión en exploración.

El dato de crecimiento refuerza la posición del Banco de la República (BanRep) para continuar con su ciclo de recortes de tasas: la próxima reunión del 30 de agosto analizará si proceder con un tercer recorte consecutivo de 25 puntos básicos, lo que llevaría la tasa de referencia de 9.50% a 9.25%. El mercado descuenta una probabilidad del 68% para ese recorte, condicionada a que la inflación de julio —que se publicará el 6 de agosto— continúe moderándose desde el 6.4% actual.

El peso colombiano (COP) opera en COP 4,178 por dólar, apreciándose 0.7% en la jornada gracias al dólar débil post-FOMC. Los flujos de remesas —que superaron los US$ 3,800 millones en el primer semestre— y los ingresos de Ecopetrol (con el Brent en US$ 84.5) generan una oferta de divisas que amortigua la presión del DXY sobre el peso colombiano.`,
    analisis: `Un crecimiento colombiano de 2.6% en Q2 por encima de las expectativas confirma que el ciclo de recortes del BanRep es compatible con una economía que se expande de manera sana. Para el contexto regional, Colombia en crecimiento con desinflación es una señal positiva: el capital financiero regional tiende a premiar a las economías que combinan estabilidad y crecimiento, lo que puede favorecer flujos hacia activos latinoamericanos en general.

Para empresas peruanas con negocios en Colombia, el crecimiento del 2.6% en Q2 implica mayor demanda doméstica colombiana, lo que abre oportunidades de exportación para productos peruanos. El tipo de cambio PEN/COP implícito (S/ 3.389 / COP 4,178 por USD) resulta en un ratio de aproximadamente COP 1.23 por sol, favorable para exportadores peruanos que venden en Colombia.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'r015',
    titulo: 'Chile: BCCh adelanta recorte de TPM a agosto ante menor inflación y señales dovish de la Fed',
    descripcion: 'El Banco Central de Chile sorprendió al mercado este jueves señalando que podría adelantar su primer recorte de la Tasa de Política Monetaria de septiembre a agosto, dado el dato de inflación de junio en 3.6% y la pausa dovish del Fed. El peso CLP se aprecia a CLP 932 por dólar.',
    contenido: `El Banco Central de Chile (BCCh) sorprendió hoy a los mercados cuando la presidenta Rossana Costa, en declaraciones a la prensa tras la publicación del dato del PCE de EE.UU., señaló que "el directorio está evaluando activamente si las condiciones justifican un adelanto de la normalización de la TPM a la reunión de agosto, en lugar de esperar a septiembre". Las palabras de Costa desencadenaron una apreciación del 0.5% del peso chileno, que opera en CLP 932 por dólar —el nivel más bajo en el año—, y un rally de los bonos soberanos en pesos con vencimiento en 2028 y 2030.

La inflación de Chile en junio fue del 3.6% anual —dentro del rango meta del BCCh de 3%±1%— y moderándose desde el 3.9% de mayo. La inflación subyacente se ubica en 3.2%, acercándose al punto central del rango objetivo. El componente de servicios, que había sido el más resistente, cedió a 4.2% (+0.3 puntos menos que en mayo) gracias a la moderación de los precios de arriendos y telecomunicaciones.

El mercado de futuros de la TPM en Santiago ahora descuenta una probabilidad del 75% de un recorte de 25 puntos básicos en la reunión del BCCh del 26 de agosto, lo que llevaría la tasa de 5.0% a 4.75%. Si se materializa, sería el inicio de un ciclo de normalización monetaria que el BCCh proyecta llevará la tasa hacia el nivel neutral de 3.5%–4.0% en el horizonte de 24 meses. Para fin de 2026, el mercado descuenta una TPM de 4.25%–4.50%.

El cobre, principal exportación chilena, cotiza en LME en US$ 4.90/libra —máximo del año— lo que generará ingresos récord para las empresas mineras chilenas y proveerá abundante oferta de dólares al mercado local, facilitando la tarea del BCCh de manejar la política monetaria sin presionar al peso. Codelco estima que sus ingresos del segundo semestre superarán los US$ 12,500 millones si el cobre se mantiene por encima de US$ 4.70/libra.`,
    analisis: `El posible adelanto del recorte del BCCh de septiembre a agosto es relevante para el contexto regional: Chile y Perú tienen economías estructuralmente similares (exportación de cobre como motor principal, bancos centrales con credibilidad institucional, inflación convergiendo al objetivo). Si el BCCh recorta primero, el BCRP podría seguirle en octubre o noviembre, lo que tendría implicaciones positivas para el mercado de bonos soberanos peruanos en soles.

Para empresas con operaciones entre Chile y Perú, la apreciación simultánea del CLP (COP 932/USD) y el PEN (S/ 3.389/USD) frente al dólar facilita la planificación financiera de las próximas semanas. Los contratos de mediano plazo pueden estructurarse con mayor visibilidad cambiaria que en la primera mitad del año.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-31T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
