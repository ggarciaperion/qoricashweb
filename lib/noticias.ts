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
const HOY = '2026-07-17T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'o001',
    titulo: 'Fed Warsh mantiene tasa en 3.50-3.75% y señala posible alza en octubre',
    descripcion: 'La Reserva Federal de EE.UU. mantuvo la tasa sin cambios bajo el liderazgo de Kevin Warsh, eliminó la guía futura y adoptó un tono marcadamente hawkish. Los mercados de futuros ya descuentan un alza para octubre.',
    contenido: `La Reserva Federal concluyó su reunión de junio manteniendo el rango objetivo de la tasa de fondos federales en 3.50%–3.75%, pero el comunicado eliminó toda referencia a recortes futuros y adoptó un lenguaje restrictivo que sorprendió a los mercados. Kevin Warsh, en su primer ciclo completo al frente del FOMC, consolidó una postura que prioriza el control inflacionario sobre el crecimiento.

Las proyecciones actualizadas del comité muestran que dos tercios de los miembros anticipan al menos un alza adicional antes de fin de año, con octubre como fecha más probable. La inflación subyacente se mantiene por encima del objetivo del 2%, impulsada en parte por los precios de energía relacionados con el conflicto en Oriente Medio.

La próxima reunión del FOMC se realizará el 28 y 29 de julio. Los mercados de futuros de tasas ya descuentan con probabilidad del 78% un alza de 25 puntos básicos en octubre, con posibilidad de una segunda en diciembre. El Informe de Política Monetaria enviado al Congreso el 10 de julio reiteró la disposición del Fed a actuar ante datos adversos de inflación.`,
    analisis: `El sesgo hawkish del Fed ejerce presión directa sobre el sol peruano y otras monedas emergentes. Un dólar más fuerte en el contexto global tiende a depreciar el PEN, encareciendo importaciones y elevando el costo de deuda en dólares para empresas peruanas. El BCRP deberá calibrar su propia política monetaria considerando este escenario.

Si tienes operaciones de cambio programadas, el entorno sugiere prudencia: el dólar podría seguir fortaleciéndose hacia la reunión del 29 de julio. Cambiar soles a dólares en tramos o aprovechar ventanas de tipo de cambio más favorable puede ser una estrategia razonable en las próximas semanas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o002',
    titulo: 'Sol peruano cierra en S/ 3.40 mientras exportaciones de Perú baten récord histórico',
    descripcion: 'El tipo de cambio PEN/USD se sitúa en S/ 3.40 al cierre de esta semana. En paralelo, las exportaciones peruanas acumulan US$ 45,128 millones entre enero y mayo, un avance del 37% interanual.',
    contenido: `El sol peruano cotiza a S/ 3.40 por dólar al término de la jornada del viernes 17 de julio, en un contexto de fortalecimiento global del billete verde impulsado por el tono hawkish de la Reserva Federal. El Banco Central de Reserva del Perú (BCRP) mantiene sus intervenciones para evitar volatilidad excesiva, apoyado en reservas internacionales netas superiores a US$ 80,000 millones.

El dato más destacado de la semana proviene del sector externo: las exportaciones peruanas crecieron 37% en el período enero–mayo de 2026, superando los US$ 45,128 millones. Esta cifra representa el primer semestre más alto de la historia exportadora del país, según Mincetur. Las proyecciones apuntan a superar US$ 107,000 millones al cierre del año.

El dinamismo exportador actúa como contrapeso al fortalecimiento del dólar, generando flujos de divisas que sostienen al sol. Los sectores minero (+53%) y agropecuario (+5.3%) lideran el crecimiento, con China como principal destino con US$ 17,390 millones (+44.3%).`,
    analisis: `El sol peruano se mueve en un rango contenido gracias al superávit de balanza comercial que generan las exportaciones récord. Sin embargo, el endurecimiento monetario del Fed presiona al alza al dólar globalmente, lo que podría llevar el PEN hacia S/ 3.42–3.45 si la postura hawkish se intensifica antes del 29 de julio.

Para quien necesita dólares en el corto plazo, el nivel actual de S/ 3.40 ofrece una oportunidad razonable antes de que el ciclo de alzas del Fed presione más la moneda. QoriCash opera con spreads competitivos en ambas direcciones.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o003',
    titulo: 'Exportaciones peruanas acumulan US$ 45,128 millones en récord histórico a mayo 2026',
    descripcion: 'El primer semestre exportador de Perú es el más alto de la historia con un crecimiento del 37% interanual. Minería, agro y pesca lideran el impulso, con China absorbiendo el 38.5% del total.',
    contenido: `Las exportaciones peruanas de bienes crecieron 37% en los primeros cinco meses de 2026, alcanzando US$ 45,128 millones con 25 meses consecutivos de crecimiento, según cifras del Ministerio de Comercio Exterior y Turismo. La proyección de ADEX para el año completo supera los US$ 107,000 millones, lo que representaría un nuevo récord histórico y un avance del 20% respecto a 2025.

El sector minero concentra el 72.4% del total exportado con US$ 33,393 millones (+53.1%), impulsado por mayores volúmenes y precios del cobre y el oro. Le siguen el sector agropecuario con US$ 4,732 millones (+5.3%), la pesca con US$ 2,114 millones (+4.1%) y el sector forestal con US$ 29 millones (+9.1%).

China es el principal destino con US$ 17,390 millones (+44.3%), seguida de EE.UU. con US$ 4,275 millones (+19.8%) y la Unión Europea con US$ 3,957 millones (+11.7%). La diversificación de mercados y la apertura comercial están detrás del boom exportador peruano.`,
    analisis: `El récord exportador genera un flujo sostenido de dólares hacia la economía peruana, lo que presiona a la baja al tipo de cambio PEN/USD y refuerza las reservas del BCRP. Esto es una señal positiva para la estabilidad del sol en el mediano plazo, incluso en un contexto de Fed hawkish.

Empresas exportadoras con ingresos en dólares y costos en soles se benefician directamente. Si tu empresa tiene flujos en ambas monedas, este es un buen momento para planificar la cobertura cambiaria aprovechando el tipo de cambio actual.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o004',
    titulo: 'Minería peruana crece 53% y representa el 72% de las exportaciones nacionales',
    descripcion: 'El sector minero exportó US$ 33,393 millones entre enero y mayo de 2026, impulsado por el cobre y el oro. Perú consolida su posición como segundo productor mundial de cobre.',
    contenido: `La minería peruana registra su expansión más vigorosa en la última década. Con US$ 33,393 millones exportados en el período enero–mayo de 2026, el sector avanzó 53.1% interanual y pasó a representar el 72.4% del total exportado nacional, frente al 64.9% que representaba en 2024.

El cobre lidera el dinamismo, beneficiado tanto por mayores volúmenes de producción como por precios internacionales elevados. El proyecto Quellaveco y las operaciones de Las Bambas y Cerro Verde operan a plena capacidad. El oro, por su parte, también contribuye significativamente dado su precio cercano a US$ 4,000/oz.

Perú reafirma su posición como segundo productor mundial de cobre y tercer productor de plata. El gobierno proyecta que el PBI minero crecerá 8.5% en 2026, siendo el sector de mayor aporte al crecimiento económico nacional este año.`,
    analisis: `El auge minero fortalece las cuentas externas del Perú y contribuye a la estabilidad del sol. Sin embargo, la alta concentración en minería (72% de exportaciones) representa un riesgo ante caídas de precios de metales o conflictos sociales. El PEN se beneficia mientras los precios del cobre y el oro permanezcan altos.

Para empresas vinculadas al sector minero con operaciones en dólares, el entorno actual de precios altos es favorable. Una estrategia de cambio de divisas escalonada puede optimizar el retorno en soles sin asumir riesgo cambiario innecesario.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o005',
    titulo: 'Agro peruano exportó US$ 4,732 millones en ene-may 2026 con arándanos y uvas a la cabeza',
    descripcion: 'El sector agropecuario no tradicional creció 5.3% interanual, consolidando a Perú como exportador agrícola de primer nivel. Arándanos, uvas y paltas lideran el dinamismo hacia EE.UU. y Europa.',
    contenido: `Las exportaciones agropecuarias peruanas alcanzaron US$ 4,732 millones entre enero y mayo de 2026, con un crecimiento del 5.3% respecto al mismo período de 2025. Los arándanos continúan siendo el producto estrella del agro no tradicional, seguidos por uvas de mesa, paltas y espárragos.

Los mercados de destino más dinámicos son Estados Unidos, la Unión Europea y China, que han incrementado su demanda de frutas y hortalizas peruanas gracias a los acuerdos de libre comercio vigentes. La ventaja competitiva del Perú radica en su capacidad de producir frutas en contraestación respecto al hemisferio norte.

El Ministerio de Agricultura proyecta que las agro exportaciones superarán los US$ 12,000 millones al cierre de 2026. Las regiones de La Libertad, Ica y Piura concentran la mayor producción de frutas para exportación.`,
    analisis: `El crecimiento agro exportador diversifica los ingresos de divisas del Perú, reduciendo la dependencia de los ciclos mineros. Esto contribuye a la estabilidad del sol peruano y genera empleo en regiones costeras con alta demanda de divisas para importación de insumos.

Empresas agro exportadoras reciben dólares del exterior que luego deben convertir a soles para pagar planillas y costos locales. Gestionar ese flujo cambiario con eficiencia —usando tipos de cambio competitivos— puede representar un ahorro significativo en márgenes ya ajustados.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o006',
    titulo: 'BCRP: economía peruana mantiene expansión con PBI proyectado en 3.4% para 2026',
    descripcion: 'El Banco Central de Reserva del Perú mantiene su tasa de referencia y prevé una expansión económica sólida para el año. Las reservas internacionales superan US$ 80,000 millones.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) mantiene su tasa de referencia en 4.25% y proyecta un crecimiento del PBI de 3.4% para 2026, sustentado en el dinamismo exportador, la inversión privada y el consumo interno. La entidad evalúa el comportamiento de la inflación —que se ubica en torno al 2.5% anual— para definir su próximo movimiento de política monetaria.

Las reservas internacionales netas superan los US$ 80,000 millones, equivalentes a más de 18 meses de importaciones, lo que otorga al BCRP un amplio margen de intervención en el mercado cambiario. El banco central ha demostrado capacidad para contener episodios de volatilidad del PEN sin comprometer sus reservas.

La economía peruana muestra resiliencia a pesar de la incertidumbre global. El sector construcción creció 11% en el primer trimestre, los despachos de cemento acumulan 11% de alza y la inversión en bienes de capital registra un avance del 25% interanual, señales de un ciclo expansivo robusto.`,
    analisis: `La solidez macroeconómica del Perú —reservas abundantes, PBI creciendo, inflación controlada— es el principal ancla del sol frente a presiones externas como el hawkishness del Fed. El BCRP tiene margen para defender el tipo de cambio en rangos razonables sin agotar sus recursos.

Para empresas y personas con obligaciones en dólares, el contexto macroeconómico peruano es favorable. El PEN se mantiene en un rango estable y el BCRP actúa como amortiguador. Es un buen momento para planificar operaciones de cambio a mediano plazo sin asumir riesgos especulativos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o007',
    titulo: 'Petróleo Brent supera US$ 84 mientras EE.UU. realiza quinto día de ataques en Irán',
    descripcion: 'El crudo Brent se mantiene por encima de los US$ 84/barril ante la escalada militar en Oriente Medio. EE.UU. exige a Irán reabrir el Estrecho de Ormuz, por donde transita el 21% del petróleo mundial.',
    contenido: `El petróleo Brent cotiza en US$ 84.20 por barril este viernes, sostenido por una escalada geopolítica sin precedentes recientes en el Golfo Pérsico. Estados Unidos completa su quinto día consecutivo de ataques contra infraestructura militar iraní, y el presidente Trump reiteró que las operaciones continuarán hasta que Irán suspenda los ataques contra embarcaciones comerciales y permita el libre tránsito por el Estrecho de Ormuz.

El Estrecho de Ormuz es el punto más crítico del comercio global de petróleo: por él transitan aproximadamente 21 millones de barriles diarios, equivalentes al 21% del consumo mundial. Cualquier interrupción sostenida podría disparar el Brent hacia los US$ 95–100/barril, según analistas de Goldman Sachs.

La OPEP+ monitorea la situación y evalúa si incrementar producción para compensar eventuales interrupciones iraníes. Arabia Saudita tiene capacidad ociosa de aproximadamente 2 millones de barriles diarios que podría activar en caso de necesidad.`,
    analisis: `Un petróleo más caro encarece el combustible y los fletes globales, alimentando presiones inflacionarias que complican la labor del Fed y de bancos centrales de mercados emergentes, incluido el BCRP. Para Perú, importador neto de petróleo refinado, un Brent por encima de US$ 85 presiona al alza el precio de la gasolina y el costo de producción industrial.

El alza del petróleo también fortalece indirectamente al dólar como activo refugio, lo que puede presionar levemente al sol. Si tienes gastos en combustible o logística dolarizados, considera anticipar compras de divisas en el nivel actual de S/ 3.40.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o008',
    titulo: 'Oro spot alcanza US$ 3,995/oz y apunta al umbral psicológico de los US$ 4,000',
    descripcion: 'El metal precioso sube 0.48% este viernes acercándose al nivel de US$ 4,000/oz. La combinación de tensiones geopolíticas, inflación persistente y posible alza del Fed mantiene la demanda de activos refugio.',
    contenido: `El oro al contado cotiza en US$ 3,995 por onza este viernes 17 de julio, con un avance del 0.48% en la jornada, acercándose al nivel psicológico clave de US$ 4,000/oz. El metal acumula una ganancia del 28% en lo que va de 2026, impulsado por una combinación de tensiones geopolíticas en Oriente Medio, inflación por encima del objetivo en las principales economías y demanda de bancos centrales asiáticos.

El banco ANZ señaló que la principal incógnita es si el Fed considerará el reciente aumento de los precios del petróleo como un choque temporal o como un factor de inflación persistente. En el primer caso, podría no subir tasas agresivamente; en el segundo, la eventual alza presionaría al oro a la baja desde los US$ 4,000.

China, India y Turquía mantienen su postura compradora de oro para diversificar reservas lejos del dólar. El Consejo Mundial del Oro reportó que los bancos centrales compraron 290 toneladas en el primer semestre de 2026, 18% más que en igual período de 2025.`,
    analisis: `El oro en US$ 4,000 refleja un ambiente de incertidumbre global elevada. Para Perú, como tercer productor mundial de oro, los precios altos incrementan el valor de las exportaciones y fortalecen indirectamente el sol. Sin embargo, la correlación no es inmediata en el tipo de cambio diario.

Si gestionas activos en dólares y buscas refugio ante la volatilidad, el entorno de oro elevado sugiere que el dólar podría mantenerse fuerte. Planificar con anticipación tus necesidades de conversión de moneda es la estrategia más prudente en este contexto.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o009',
    titulo: 'China: manufactura bajo presión y comercio exterior desacelera ante tensiones globales',
    descripcion: 'Los datos de comercio exterior chino de junio muestran señales mixtas. Las exportaciones crecen pero el PMI manufacturero se ubica en zona de contracción ante la demanda débil de Europa y las tensiones con EE.UU.',
    contenido: `El PMI manufacturero de China se situó en 49.1 puntos en junio de 2026, por debajo del umbral de expansión de 50 puntos por segundo mes consecutivo, señalando una contracción moderada de la actividad fabril. Los pedidos externos cayeron 2.3% ante la desaceleración de la demanda europea y el enfriamiento de las relaciones comerciales con Estados Unidos.

Las exportaciones chinas de bienes crecieron 6.8% interanual en junio, pero la tasa es la más baja en cuatro meses. El superávit comercial sigue siendo robusto en US$ 98,000 millones, lo que contribuye a mantener al yuan relativamente estable frente al dólar. Sin embargo, los estímulos fiscales anunciados por Beijing —con un foco en infraestructura y semiconductores— buscan reactivar la demanda interna.

El sector de chips y semiconductores es estratégico: China ha invertido más de US$ 50,000 millones en 2026 para reducir su dependencia de proveedores occidentales. Esta apuesta crea oportunidades para la demanda de materias primas como el cobre peruano.`,
    analisis: `Una China con crecimiento más moderado implica cierta presión sobre los precios de materias primas que Perú exporta, especialmente cobre. Sin embargo, la demanda china de cobre sigue siendo estructuralmente alta por la transición energética y la construcción de infraestructura. Una contracción severa de la economía china sería el mayor riesgo para los ingresos de exportación peruanos.

El canal de impacto en el tipo de cambio sería: menor demanda china → precios de cobre más bajos → menores ingresos por exportaciones → presión al alza en el PEN/USD. Por ahora ese escenario es de baja probabilidad, pero vale monitorear los próximos datos del PMI de julio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o010',
    titulo: 'DXY se fortalece ante reunión Fed del 29 de julio y presiona monedas emergentes',
    descripcion: 'El índice del dólar (DXY) avanza impulsado por expectativas de alza de tasas del Fed en octubre. El sol peruano, el real brasileño y el peso colombiano acumulan depreciación en la semana.',
    contenido: `El índice del dólar (DXY) registra su tercera semana consecutiva de avances, cotizando por encima de 104.5 puntos, su nivel más alto desde febrero de 2026. El catalizador principal es el tono hawkish de la Reserva Federal que, bajo Kevin Warsh, eliminó la guía futura de recortes de tasas y mantiene abierta la puerta a un alza en octubre.

Las monedas de mercados emergentes acumulan presión: el peso colombiano COP cedió 1.2% en la semana, el real brasileño BRL retrocedió 0.8%, y el peso mexicano MXN cayó 0.9%. El sol peruano (PEN) muestra mayor resiliencia relativa gracias al superávit comercial minero, cerrando la semana en S/ 3.40, apenas 0.3% por encima del cierre de la semana anterior.

Los flujos de capital de mercados emergentes hacia activos en dólares se aceleran ante el diferencial de tasas creciente. Los fondos de bonos emergentes registraron salidas netas de US$ 3,200 millones en la semana, según datos de EPFR Global.`,
    analisis: `El fortalecimiento del DXY es la principal presión externa sobre el sol peruano en el corto plazo. Sin embargo, los fundamentos macroeconómicos del Perú —reservas sólidas, exportaciones récord, inflación controlada— actúan como amortiguadores que limitan la depreciación del PEN frente a sus pares regionales.

Para transacciones de cambio en las próximas semanas, el nivel de S/ 3.40 puede ser una referencia atractiva si el dólar continúa fortaleciéndose hacia la reunión del 29 de julio. Diversificar el momento de compra de dólares en tramos puede reducir el riesgo de timing.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o011',
    titulo: 'Bitcoin cae a US$ 63,833 (-1.41%) mientras el capital rota hacia acciones de inteligencia artificial',
    descripcion: 'El precio del Bitcoin retrocede ante una rotación de capital hacia acciones vinculadas a la IA. Micron Technology acumula +290% en 2026 mientras Bitcoin cede más del 30% desde sus máximos.',
    contenido: `Bitcoin cotiza en US$ 63,833 este viernes 17 de julio, con una caída del 1.41% en el día, consolidando un retroceso acumulado superior al 30% desde sus máximos históricos de principios de 2026. Los analistas apuntan a una rotación de capital desde activos cripto hacia acciones de empresas vinculadas a la inteligencia artificial como el principal factor explicativo.

Micron Technology acumula una ganancia del 290% en lo que va de 2026, mientras Nvidia, AMD y Broadcom también registran rendimientos superiores al 100%. Este dinamismo de las acciones de IA está captando flujos que anteriormente se destinaban a Bitcoin y Ethereum. La narrativa de "Bitcoin como reserva de valor" pierde terreno frente a la narrativa de "IA como motor del crecimiento".

El volumen de operaciones en Bitcoin ha caído 22% respecto a su promedio mensual de los últimos seis meses, señal de menor interés especulativo. Los ETF de Bitcoin al contado en EE.UU. registraron salidas netas por tercer semana consecutiva.`,
    analisis: `La caída de Bitcoin no tiene un impacto directo sobre el tipo de cambio PEN/USD, pero sí sobre el apetito de riesgo global. Un Bitcoin débil en un contexto de fuga hacia calidad puede reforzar el dólar como activo refugio, ejerciendo presión adicional sobre monedas emergentes como el sol.

Para quienes tienen exposición a criptomonedas y necesitan convertirlas a soles, el momento actual —con Bitcoin en US$ 63,833 y PEN en S/ 3.40— define el retorno final en moneda local. Planificar bien el timing de conversión puede marcar diferencias significativas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o012',
    titulo: 'S&P 500 cierra la semana en negativo (-0.51%) arrastrado por tensiones en Oriente Medio',
    descripcion: 'Wall Street registra su segunda semana consecutiva de caídas. Las tensiones en el Estrecho de Ormuz y los temores inflacionarios por el petróleo pesan sobre las acciones tecnológicas y los chips.',
    contenido: `El S&P 500 cerró la jornada del viernes con una caída del 0.51%, acumulando una pérdida semanal del 1.8%, su segunda semana negativa consecutiva. El Dow Jones y el Nasdaq también registraron pérdidas en la semana, con el índice tecnológico especialmente castigado por la presión sobre los fabricantes de chips ante las tensiones en Oriente Medio.

La preocupación central es que un petróleo elevado por encima de US$ 84/barril reavive la inflación, lo que daría argumentos al Fed de Kevin Warsh para subir tasas en octubre. Un entorno de tasas altas por más tiempo presiona las valoraciones de empresas de crecimiento, especialmente en tecnología y semiconductores.

Las acciones de Nvidia cayeron 3.2% en la semana, las de TSMC retrocedieron 2.8% y las de ASML cedieron 4.1%. En contraste, el sector energético avanzó 2.3% beneficiado por el alza del crudo. El VIX —índice de volatilidad— repuntó hasta 18.5 puntos, su nivel más alto en dos meses.`,
    analisis: `La debilidad de Wall Street no impacta directamente al tipo de cambio PEN/USD, pero una mayor aversión al riesgo global puede fortalecer el dólar como activo refugio, presionando levemente al sol. Históricamente, períodos de estrés en mercados de acciones de EE.UU. coinciden con apreciación del dólar frente a emergentes.

Para empresas peruanas con inversiones en mercados de capitales internacionales, el contexto actual aconseja revisar la exposición cambiaria. Convertir ganancias en dólares a soles aprovechando el tipo actual puede ser una decisión prudente antes de mayor volatilidad.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o013',
    titulo: 'Argentina: BCRA compra US$ 230M en un día y acumula 128 jornadas como comprador neto',
    descripcion: 'El Banco Central argentino hilvanó 128 días consecutivos con saldo comprador, adquiriendo más de US$ 1,000 millones en la semana. El dólar oficial se ubica en ARS 1,495 para la venta.',
    contenido: `El Banco Central de la República Argentina (BCRA) mantiene su racha compradora de divisas con 128 jornadas consecutivas de saldo positivo en el mercado cambiario, adquiriendo US$ 230 millones solo en la jornada del jueves y superando US$ 1,000 millones en la semana completa. Este desempeño refleja el éxito del esquema cambiario implementado por el gobierno de Javier Milei.

El dólar oficial cierra el viernes en ARS 1,495 para la venta, mientras el dólar blue cotiza a ARS 1,525. La brecha cambiaria se ha comprimido a mínimos históricos del entorno del 2%, señal de mayor confianza en el peso argentino y en la política de equilibrio fiscal del gobierno. El dólar CCL se ubica en ARS 1,567.

Las reservas brutas del BCRA superan los US$ 42,000 millones, mientras las reservas netas —descontados los pasivos con el FMI y otros compromisos— registran una mejora sostenida. El acuerdo con el FMI y la reducción del déficit fiscal primario a cero son los pilares de la estabilidad cambiaria argentina actual.`,
    analisis: `La estabilidad cambiaria argentina reduce la presión sobre el tipo de cambio en la región, ya que en el pasado las crisis argentinas generaban contagio sobre otras monedas latinoamericanas incluyendo el sol peruano. Un BCRA comprador neto y una brecha cambiaria baja son señales positivas para el ecosistema financiero regional.

Para empresas con operaciones en Argentina y Perú, el contexto actual permite planificar flujos cambiarios con mayor predictibilidad en ambos lados. QoriCash puede asesorarte sobre la mejor estrategia de conversión considerando los diferenciales actuales.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o014',
    titulo: 'Colombia: peso COP bajo presión semanal ante alza del dólar y volatilidad del petróleo',
    descripcion: 'El peso colombiano cedió 1.2% en la semana frente al dólar, afectado por el fortalecimiento del DXY y la incertidumbre sobre los precios del petróleo. El Banco de la República evalúa su postura ante el ciclo hawkish del Fed.',
    contenido: `El peso colombiano (COP) cerró la semana en torno a COP 4,280 por dólar, acumulando una depreciación del 1.2% en los últimos cinco días. La presión proviene principalmente del fortalecimiento global del dólar ante la postura hawkish de la Reserva Federal, y de la volatilidad en los precios del petróleo —principal producto de exportación colombiano— generada por las tensiones en el Estrecho de Ormuz.

Colombia, como exportador neto de petróleo, se beneficia en términos de ingresos cuando el Brent sube, pero el efecto sobre el tipo de cambio es ambiguo: el mayor ingreso de divisas por petróleo compite con la presión del DXY fuerte. En el corto plazo, la depreciación del COP refleja que los mercados están priorizando el riesgo de tasas altas en EE.UU.

El Banco de la República de Colombia mantiene su tasa de interés en 6.75% y monitorea si el ciclo de alzas del Fed requiere una respuesta de política monetaria local para defender el peso y contener la inflación importada.`,
    analisis: `La dinámica del COP tiene relevancia para empresas peruanas y colombianas con operaciones comerciales entre ambos países. Una depreciación del COP encarece los bienes colombianos en soles para importadores peruanos y abarata las exportaciones peruanas hacia Colombia.

Para quienes gestionan pagos en COP o USD desde Perú hacia Colombia, el nivel actual del peso colombiano puede representar una oportunidad. Consultar con QoriCash sobre la mejor estrategia de conversión puede optimizar el costo de las transacciones.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'o015',
    titulo: 'Chile: exportaciones de cobre impulsan superávit comercial y estabilizan el peso chileno',
    descripcion: 'El precio del cobre en niveles altos favorece las cuentas externas chilenas. El peso CLP se mantiene en torno a CLP 920 por dólar, con el Banco Central evaluando el impacto del ciclo hawkish del Fed.',
    contenido: `Chile cierra la semana con un panorama favorable para sus cuentas externas gracias a los precios del cobre, que se mantienen por encima de US$ 4.50 por libra en la Bolsa de Metales de Londres. El metal rojo representa el 50% de las exportaciones chilenas y es el principal determinante del tipo de cambio del peso (CLP), que cotiza en torno a CLP 920 por dólar.

Las exportaciones chilenas crecieron 18% en el primer semestre de 2026, impulsadas por cobre, litio y frutas. La empresa estatal Codelco opera sus principales yacimientos —Chuquicamata, El Teniente y Escondida (en joint venture con BHP)— a plena capacidad, aprovechando los precios altos. Chile se consolida como el principal productor mundial de cobre con el 28% de la oferta global.

El Banco Central de Chile mantiene su tasa de política monetaria en 5.50%, adoptando una postura de espera mientras evalúa el impacto del Fed hawkish sobre los flujos de capitales hacia mercados emergentes. La inflación chilena se sitúa en 3.8% anual, dentro del rango meta del banco central.`,
    analisis: `Chile y Perú son economías con perfiles exportadores similares —cobre y minerales— por lo que sus dinámicas cambiarias tienden a correlacionarse. Los precios altos del cobre benefician a ambos países y contribuyen a la estabilidad del CLP y el PEN frente al dólar.

Para empresas con operaciones comerciales entre Chile y Perú, el contexto actual de ambas monedas relativamente estables facilita la planificación financiera. QoriCash puede orientarte sobre las mejores condiciones para conversiones PEN/CLP o USD en ambas direcciones.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },,
  {
    id: 'n001',
    titulo: 'CPI junio EE.UU. +3.5% anual — inflación modera pero Fed podría subir tasas el 29 de julio: probabilidad sube a 46.5%',
    descripcion: 'El IPC de junio de EE.UU. bajó 0.4% mensual y subió 3.5% anual, mejor que el consenso de 3.8%. El core CPI se mantuvo sin cambios en el mes (+2.6% anual). A pesar del dato favorable, el gobernador Waller advirtió que la Fed podría subir tasas si la inflación no cede. Reunión FOMC: 29 de julio.',
    contenido: `El Buró de Estadísticas Laborales publicó hoy el IPC de junio de 2026: -0.4% mensual y +3.5% interanual, ambas lecturas por debajo del consenso de Bloomberg (3.8% anual). El CPI subyacente —excluyendo alimentos y energía— se mantuvo sin variación mensual (0.0%) y subió 2.6% anual, desde el 2.9% de mayo. Es la desinflación más rápida en lo que va del año.

Sin embargo, la respuesta del mercado es ambigua: el S&P 500 cae 0.3% y el Nasdaq pierde más del 1%, mientras que el gobernador de la Fed Christopher Waller señaló que el FOMC "tendrá que considerar un endurecimiento de la política monetaria" si la inflación subyacente continúa mostrando presiones generalizadas. La probabilidad implícita de un alza de tasas en la reunión del 29 de julio subió al 46.5% según CME FedWatch —desde menos del 20% hace una semana—, en aparente contradicción con el dato benigno.

La paradoja se explica por el contexto de Oriente Medio: la escalada del conflicto entre EE.UU. e Irán presiona el petróleo al alza (+0.8% el Brent a US$ 84.95), lo que siembra dudas sobre si la inflación energética podría revertir los avances recientes. El mercado descuenta que la Fed preferiría "un alza preventiva" antes que ver un rebrote inflacionario en Q3.

La próxima señal clave será el PCE subyacente del 31 de julio —indicador favorito de la Fed—. Si confirma la desinflación, el escenario de pausa el 29 de julio recupera fuerza.`,
    analisis: `Un CPI de +3.5% anual es bienvenido, pero la Fed tiene un problema de credibilidad: si pausa mientras el petróleo sube y los mercados laborales siguen sólidos, arriesga que la inflación repunte en Q3. La postura hawkish de Waller refleja esa preocupación. Para el sol peruano, un dólar más fuerte (ante expectativas de alza Fed) presiona el TC hacia S/ 3.41-3.44. En QoriCash monitoreamos el FOMC del 29 de julio como el evento más importante del mes para el tipo de cambio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n002',
    titulo: 'Sol peruano opera en S/ 3.39 — BCRP mantuvo tasa en 4.25% en julio y proyecta PBI de 3.4% para 2026',
    descripcion: 'El tipo de cambio PEN/USD opera en S/ 3.39 este miércoles 16 de julio, estable pese a la tensión en Oriente Medio. El BCRP mantuvo su tasa de referencia en 4.25% en la reunión de julio. El banco central proyecta crecimiento del PBI peruano de 3.4% para 2026 e inversión privada de +12.5%.',
    contenido: `El tipo de cambio PEN/USD opera en S/ 3.39 este miércoles 16 de julio de 2026, prácticamente sin cambios respecto al cierre del martes. El sol muestra una notable estabilidad en la sesión pese al contexto externo adverso: escalada del conflicto en Oriente Medio, petróleo subiendo y expectativas de alza de la Fed en julio. La estabilidad refleja la solidez de los fundamentos macroeconómicos peruanos.

El BCRP mantuvo la tasa de interés de referencia en 4.25% en su reunión del Programa Monetario de julio, en línea con las expectativas del mercado. El directorio señaló que la inflación peruana continúa moderándose —0.23% mensual en junio, la más baja del año— y que el entorno externo, aunque más incierto, no justifica un cambio de postura por el momento. La tasa de 4.25% sitúa al BCRP 75bps por encima del límite superior del rango Fed Funds (3.50%), un diferencial atractivo para el carry en soles.

En cuanto a las perspectivas macroeconómicas, el BCRP elevó su proyección de crecimiento del PBI 2026 a 3.4% (desde 3.2% anterior), impulsado por la aceleración de la inversión privada (+12.5% proyectado, frente al +9.5% anterior). El consumo de cemento crece más del 11% y las importaciones de bienes de capital suben cerca del 25%, señales concretas de dinamismo en la inversión.

El soporte técnico del sol en S/ 3.38 se mantiene intacto. La resistencia inmediata está en S/ 3.42. El escenario base para las próximas dos semanas prevé que el PEN opere en el rango S/ 3.38-3.43, con el FOMC del 29 de julio como principal catalizador de volatilidad.`,
    analisis: `El sol en S/ 3.39 con el BCRP manteniendo el diferencial de tasas y el PBI creciendo 3.4% es un cuadro macroeconómico sólido. La inversión privada acelerando al 12.5% implica más demanda de insumos importados (dólares) pero también más producción futura que generará divisas. El punto de equilibrio del TC sigue siendo S/ 3.38-3.42. Para empresas con operaciones en dólares, el nivel actual es históricamente competitivo. En QoriCash le ofrecemos el mejor tipo de cambio del mercado, por encima del precio bancario.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n003',
    titulo: 'Brent US$ 84.95: EE.UU. ataca Irán y el petróleo sube — riesgo de rebrote inflacionario complica a la Fed',
    descripcion: 'El Brent retrocede 0.28% a US$ 84.95 por barril este 16 de julio mientras los operadores recogen beneficios tras los ataques estadounidenses en Irán. El crudo mantiene niveles altos por la escalada en Oriente Medio, lo que genera temores de que el rebrote energético dificulte el camino desinflacionario de la Fed.',
    contenido: `El petróleo Brent cotiza a US$ 84.95 por barril este miércoles 16 de julio, retrocediendo 0.28% (US$ 0.24) desde el cierre anterior mientras los operadores recogen ganancias tras la escalada de los últimos días. El WTI opera en US$ 82.50, también con ligera corrección. A pesar de la toma de beneficios de hoy, el crudo mantiene niveles significativamente elevados por la intensificación del conflicto en Oriente Medio, incluyendo nuevos ataques estadounidenses en instalaciones iraníes que han tensado las rutas de suministro del Golfo Pérsico.

El mercado evalúa dos escenarios: en el primero (60% de probabilidad), el conflicto se mantiene contenido y el Brent opera entre US$ 82-88/barril en Q3. En el segundo (40%), una escalada que involucre el Estrecho de Ormuz —por donde transita el 21% del petróleo mundial— podría disparar el Brent a US$ 100+ y reactivar la inflación energética globalmente.

Para la Fed, el petróleo en US$ 84-85 es un problema: aunque el CPI de junio fue benigno (-0.4% mensual), una energía cara en julio-agosto podría revertir ese avance. El gobernador Waller lo señaló explícitamente hoy al advertir que un "repunte de precios del petróleo" podría obligar a un alza de tasas el 29 de julio. Los futuros del gas natural también avanzan 1.2% en EE.UU.

Para el Perú, el Brent en US$ 84-85 encarece las importaciones de combustibles (Petroperú importa crudos y derivados) y puede generar presión inflacionaria en transporte y logística. El MINEM estima que cada US$ 10/barril de aumento en el Brent incrementa la factura energética del país en aproximadamente US$ 800M anuales.`,
    analisis: `El Brent en US$ 84.95 es el mayor riesgo macro del momento: si supera US$ 90, el escenario de recorte Fed se pospone indefinidamente y el dólar se fortalece globalmente. Para el sol peruano, un petróleo caro implica mayor demanda de dólares para importaciones energéticas y presión alcista sobre el TC. El nivel de S/ 3.42-3.45 sería el rango de ajuste en ese escenario. Monitoreamos el Estrecho de Ormuz y las declaraciones de la Fed como variables críticas. En QoriCash actualizamos nuestra visión del TC en tiempo real.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n004',
    titulo: 'Oro cae 0.6% a US$ 4,034 — conflicto Oriente Medio y hawkishness Fed generan presión vendedora',
    descripcion: 'El oro al contado retrocede 0.6% a US$ 4,034 por onza este 16 de julio. La caída es paradójica: pese a la escalada en Oriente Medio (factor alcista), los temores de que la Fed suba tasas el 29 de julio pesan más sobre el metal. Los futuros agosto ceden a US$ 4,039.',
    contenido: `El oro al contado (XAU/USD) retrocede 0.6% a US$ 4,034.42 por onza este miércoles 16 de julio de 2026, alejándose del máximo reciente de US$ 4,175 marcado la semana pasada. Los futuros con entrega en agosto pierden 0.3% a US$ 4,039.90. La caída es aparentemente paradójica: el conflicto en Oriente Medio —habitualmente un catalizador alcista para el oro por su papel de activo refugio— coexiste con una presión vendedora que domina la sesión.

La explicación está en el mercado de tasas: los temores de que la Fed suba tasas el 29 de julio (probabilidad 46.5%) están pesando más sobre el oro que la prima de riesgo geopolítico. La mecánica es directa: expectativa de tasas más altas → rendimientos de los Treasuries al alza (el bono a 10 años sube 8bps a 4.45%) → mayor costo de oportunidad de mantener oro (que no genera rendimiento) → presión vendedora en el metal.

El nivel de US$ 4,034 sitúa al oro en zona de soporte técnico clave: la MA20 diaria está en US$ 4,020 y la MA50 diaria en US$ 3,990. Si el metal pierde US$ 4,000, el siguiente soporte relevante es US$ 3,950-3,960 (mínimo de junio). Por el contrario, si la reunión del FOMC del 29 de julio no resulta en alza de tasas, el oro podría recuperar rápidamente US$ 4,100-4,150.

Goldman Sachs mantiene su precio objetivo de US$ 4,500/oz para diciembre de 2026, argumentando que las compras de bancos centrales emergentes (China, India, Polonia, Turquía) siguen siendo el soporte estructural más importante y no responden a los movimientos de corto plazo de la Fed.`,
    analisis: `El retroceso del oro a US$ 4,034 es una corrección técnica dentro de una tendencia alcista de largo plazo. Para el Perú, el precio sigue siendo muy favorable para los ingresos de exportación minera: a US$ 4,034/oz, la producción anual de ~100 toneladas equivale a US$ 12,970M en exportaciones. El impacto en el sol es neutral en el corto plazo: la corrección del oro reduce marginalmente la oferta de dólares futura, pero el nivel sigue siendo históricamente alto. La clave es el FOMC del 29 de julio: si no sube tasas, el oro volverá a US$ 4,100+.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n005',
    titulo: 'Inversión privada Perú crecerá 12.5% en 2026 — BCRP sube proyección: cemento +11%, bienes de capital +25%',
    descripcion: 'El BCRP revisó al alza su proyección de inversión privada para 2026 de 9.5% a 12.5%, la más alta en cinco años. El consumo interno de cemento crece más del 11% y las importaciones de bienes de capital suben cerca del 25%. La inversión minera aporta 11% y la no minera 16.7%. El PBI 2026 se proyecta en 3.4%.',
    contenido: `El Banco Central de Reserva del Perú revisó significativamente al alza su proyección de inversión privada para 2026, elevándola de 9.5% a 12.5% en su Programa Monetario de julio. Es el mayor crecimiento proyectado para la inversión privada desde 2021 y refleja una aceleración generalizada de la actividad económica que va más allá del sector minero.

Los indicadores adelantados confirman el dinamismo: el consumo interno de cemento —proxy de la construcción— crece más del 11% en términos acumulados a junio 2026. Las importaciones de bienes de capital, que incluyen maquinaria y equipos para industria y minería, registran incrementos cercanos al 25% en valor FOB, señal de que las empresas están expandiendo capacidad productiva con horizonte 2027-2028.

Por sectores, la inversión minera lidera con +11% (Quellaveco en plena capacidad, Tía María en inicio de construcción, expansión de Cerro Verde). La inversión no minera crece 16.7%, impulsada por proyectos de infraestructura vial (Autopista del Sol, Vía Expresa Línea 2), centros comerciales en regiones y expansión de cadenas de retail y logística. El sector manufactura también muestra señales de recuperación de la inversión en planta.

El PBI 2026 se proyecta en 3.4%, por encima del 3.2% estimado anteriormente. El BCRP destaca que la demanda interna está siendo el principal motor del crecimiento, a diferencia de años anteriores donde las exportaciones mineras llevaban el liderazgo. La inflación de junio (0.23% mensual) permite al BCRP mantener la tasa en 4.25% sin presiones adicionales.`,
    analisis: `Una inversión privada creciendo al 12.5% es una señal poderosa de confianza empresarial en el Perú: las empresas están comprometiendo capital a mediano plazo, lo que implica expectativas de estabilidad macroeconómica y política. Para el tipo de cambio, más inversión significa más demanda de bienes de capital importados (dólares) en el corto plazo, pero también más producción y exportaciones en el mediano plazo. El efecto neto es neutral-ligeramente positivo para el sol. En QoriCash acompañamos a las empresas en sus necesidades de cambio de divisas para operaciones de inversión y comercio exterior.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n006',
    titulo: 'S&P 500 cae 0.3% a 7,561 y Nasdaq pierde 1% — semiconductores presionados por dudas sobre gasto en IA',
    descripcion: 'Wall Street cierra con pérdidas este 16 de julio: S&P 500 en 7,561 (-0.3%), Nasdaq 100 -1% y Dow plano. El sector de semiconductores lidera las caídas ante el escepticismo sobre si los hyperscalers de IA reducirán su inversión en infraestructura. TSM reportó resultados sólidos pero no logró sostener el optimismo inicial.',
    contenido: `Wall Street cierra con pérdidas moderadas este miércoles 16 de julio de 2026: el S&P 500 cede 0.3% a 7,561 puntos, el Nasdaq 100 pierde más del 1% y el Dow Jones queda prácticamente plano. La jornada estuvo marcada por la presión en el sector de semiconductores y chips, que lideró las caídas a pesar de que Taiwan Semiconductor Manufacturing (TSM) reportó resultados del Q2 2026 por encima de las expectativas.

La paradoja TSM resume el dilema del mercado: la compañía reportó ventas de US$ 28.9B en Q2 (+38% interanual) y guio el Q3 hacia US$ 30-31B, superando el consenso. Sin embargo, las acciones cayeron porque los inversores cuestionan si el boom del gasto en infraestructura de inteligencia artificial —que ha sido el principal motor del crecimiento de TSM— es sostenible. Los rumores de que Microsoft, Google y Amazon podrían moderar sus planes de capex en centros de datos para 2027 generaron ventas técnicas en todo el sector.

Los mayores perdedores del día: Nvidia (-2.8%), AMD (-3.1%), Intel (-1.9%), ASML (-2.4%) y Broadcom (-2.2%). En contraste, los sectores defensivos avanzaron: salud (+1.2% liderado por UnitedHealth +8.74%), consumo básico (+0.8%, Coca-Cola +2.17%) y utilities (+0.6%). La rotación hacia sectores defensivos sugiere que los inversores anticipan mayor volatilidad ante el FOMC del 29 de julio.

El VIX —índice de volatilidad implícita del S&P 500— subió de 14.2 a 15.8, aún en zona de calma pero con señales de alerta. El mercado de opciones descuenta un movimiento del S&P 500 de ±1.5% el día del FOMC del 29 de julio.`,
    analisis: `La caída del Nasdaq liderada por semiconductores es una señal de maduración del ciclo de IA: los mercados ya no recompensan el crecimiento a cualquier precio y empiezan a exigir visibilidad sobre la rentabilidad del gasto en infraestructura. Para el sol peruano, un Nasdaq débil suele coincidir con menor apetito de riesgo global y potencial fortalecimiento del dólar —factor de presión al alza sobre el TC. El FOMC del 29 de julio será el evento determinante: si sube tasas, el dólar se fortalecería y el sol podría ceder hacia S/ 3.42-3.45. En QoriCash monitoreamos Wall Street como indicador adelantado del apetito de riesgo global.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14902679/pexels-photo-14902679.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
