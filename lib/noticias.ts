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
const HOY = '2026-07-31T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
