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
const HOY = '2026-06-12T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'f001',
    titulo: 'PEN/USD sube a S/ 3.393 y DXY alcanza 103.8: sol bajo presión por fortaleza del dólar global',
    descripcion: 'El sol peruano se depreció a S/ 3.393 interbancario al cierre de la sesión del viernes 12 de junio, su nivel más bajo en dos semanas, arrastrado por la fortaleza del índice dólar (DXY) que avanzó a 103.8 puntos ante datos laborales de EE.UU. superiores a lo esperado. El BCRP no intervino directamente en la jornada.',
    contenido: `El tipo de cambio PEN/USD cerró la semana en S/ 3.393 interbancario, retrocediendo desde los S/ 3.388 del jueves tras la publicación de los datos de empleo no agrícola de EE.UU. de mayo, que mostraron 227,000 nuevos puestos de trabajo frente al consenso de 185,000. El resultado sólido del mercado laboral americano eliminó las expectativas de recorte de tasas Fed en julio y reforzó al dólar globalmente.

El DXY Index —que mide al dólar frente a una canasta de seis monedas— avanzó a 103.8 puntos, su mayor nivel desde marzo. La apreciación del dólar se extendió a toda América Latina: el peso mexicano cedió 0.6%, el peso colombiano 0.8% y el real brasileño 0.5% en la misma sesión. El sol tuvo un comportamiento relativamente contenido gracias a los altos precios del cobre, principal sustento de las exportaciones peruanas.

El BCRP monitorea la situación pero no intervino en la jornada. La institución tiene reservas internacionales por US$ 74.2 billones, que le otorgan amplio margen para actuar en caso de volatilidad excesiva. La siguiente sesión de política monetaria está programada para el 10 de julio.

Analistas del BBVA Research estiman que el sol puede cotizar entre S/ 3.38 y S/ 3.42 en las próximas dos semanas, en función de los datos de inflación de mayo (CPI estadounidense, publicación el martes próximo) y de la evolución de las tensiones geopolíticas en Medio Oriente que impactan los mercados de commodities.`,
    analisis: `La combinación de datos laborales sólidos en EE.UU. y un DXY en máximos de tres meses configura un entorno adverso para las monedas emergentes en el corto plazo. Para el sol, el soporte clave está en los términos de intercambio favorables: el cobre sobre US$ 4.70/lb actúa como amortiguador estructural. Sin embargo, si el CPI del martes supera el consenso, el DXY podría superar los 104 puntos y el sol probar los S/ 3.42.

Para personas naturales o empresas con obligaciones en dólares, el nivel actual de S/ 3.393 representa una ventana de compra razonable antes de que se conozcan los datos de inflación americana. En QoriCash ofrecemos el mejor tipo de cambio del mercado con atención inmediata para operaciones cambiarias de cualquier monto.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/28682345/pexels-photo-28682345.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f002',
    titulo: 'BCRP activa swaps cambiarios por S/ 580 millones para contener presión depreciativa sobre el sol',
    descripcion: 'El Banco Central de Reserva del Perú realizó hoy dos subastas de swaps cambiarios por un total de S/ 580 millones a un plazo de 6 meses, en una señal de que la autoridad monetaria monitorea activamente la evolución del tipo de cambio. La intervención logró estabilizar la cotización en torno a S/ 3.390-3.393.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) ejecutó hoy viernes 12 de junio dos subastas de swaps cambiarios: la primera por S/ 300 millones en la apertura de la sesión y la segunda por S/ 280 millones al mediodía. El mecanismo de swaps permite al BCRP proporcionar cobertura cambiaria al mercado sin reducir directamente las reservas internacionales, minimizando el impacto en el balance del banco central.

La intervención se produce en un contexto de presión global sobre las divisas emergentes generada por el dato de empleo de EE.UU. de mayo, que superó las expectativas y fortaleció al dólar mundialmente. El sol había llegado a tocar S/ 3.398 durante la jornada antes de que el BCRP ejecutara la segunda subasta, con lo cual la divisa se estabilizó en el rango S/ 3.390-3.393.

El BCRP tiene sólidos fundamentos para defender la estabilidad cambiaria: reservas internacionales de US$ 74.2 billones equivalentes al 31% del PBI, un régimen de tipo de cambio flexible con intervención discrecional, y un diferencial de tasas favorable con respecto a la Fed (4.25% BCRP vs 4.25-4.50% Fed). La institución ha intervenido en 8 de las últimas 12 sesiones de junio.

Economistas de Credicorp Capital señalan que la estrategia de swaps es la herramienta preferida del BCRP en episodios de volatilidad moderada, ya que preserva las reservas brutas y genera una señal de presencia institucional sin comprometer las posiciones de largo plazo. El banco central mantiene abierta la posibilidad de venta directa de dólares si el sol superara S/ 3.42.`,
    analisis: `La activación de swaps cambiarios por el BCRP es una señal técnica clara: la autoridad monetaria considera que la presión depreciativa actual es transitoria y no justifica el uso de reservas brutas, pero tampoco está dispuesta a permitir una depreciación desordenada. El nivel S/ 3.40-3.42 actúa como línea de defensa implícita para el banco central.

Para empresas importadoras con pagos en dólares pendientes en las próximas semanas, el entorno sugiere aprovechar los niveles actuales de S/ 3.390-3.393 antes de conocer el CPI americano del martes. En QoriCash facilitamos operaciones de cambio para personas naturales y empresas con las mejores tasas del mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f003',
    titulo: 'Exportaciones de arándanos peruanos crecen 34% en primer semestre 2026: US$ 892 millones embarcados',
    descripcion: 'Las exportaciones peruanas de arándanos frescos alcanzaron US$ 892 millones en el primer semestre de 2026, un crecimiento de 34% frente al mismo periodo del año anterior, según cifras preliminares de PROMPERU. Perú consolida su posición como el segundo exportador mundial del fruto, detrás solo de Chile.',
    contenido: `Las exportaciones peruanas de arándanos frescos superaron los US$ 892 millones en los primeros seis meses de 2026, evidenciando el dinamismo del sector agroexportador en el norte del país. El dato, publicado por PROMPERU en su reporte mensual, refleja un crecimiento de 34% frente a los US$ 666 millones del mismo período de 2025 y confirma el buen momento que atraviesa el sector.

Los principales destinos de los arándanos peruanos en el período fueron: Estados Unidos (38%), Países Bajos (22%), Reino Unido (14%), China (12%) y otros mercados (14%). El ingreso al mercado chino destacó especialmente por su crecimiento: un 87% interanual, impulsado por la apertura del Protocolo Fitosanitario Perú-China que entró en vigor en enero de 2026 y eliminó restricciones cuarentenarias previas.

Las regiones productoras líderes fueron La Libertad (con un 41% del volumen total), Lambayeque (23%) e Ica (18%). La empresa Camposol lideró el ranking de exportadores individuales con US$ 134 millones, seguida por Talsa con US$ 89 millones y Hortifrut-Tal con US$ 78 millones. El precio promedio FOB se ubicó en US$ 4.82/kg, 6% por encima del precio promedio del primer semestre 2025.

El sector proyecta cerrar 2026 con exportaciones superiores a US$ 1,900 millones, lo que convertiría al blueberry en el primer producto agroexportador del Perú por encima del espárrago. PROMPERU identifica como factores de riesgo la posible apreciación del sol —que encarece las exportaciones en dólares— y la competencia creciente de Marruecos y Sudáfrica en el mercado europeo.`,
    analisis: `El boom agroexportador del arándano peruano tiene un impacto directo y positivo en el tipo de cambio: el ingreso de divisas por exportaciones funciona como fuente natural de oferta de dólares que contribuye a la estabilidad del sol. Estimamos que las exportaciones agroexportadoras generan aproximadamente US$ 150-180 millones mensuales en oferta de divisas al mercado cambiario peruano.

Para empresas exportadoras del sector, el momento de convertir las divisas recibidas en soles depende de la proyección de tipo de cambio: con el sol en S/ 3.390 y el BCRP con política activa de estabilización, los niveles actuales son razonables para conversión. En QoriCash brindamos asesoría cambiaria y las mejores tasas para empresas agroexportadoras.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f004',
    titulo: 'Perú produce 141,800 TM de cobre en mayo: nivel más alto desde octubre 2019 impulsa exportaciones',
    descripcion: 'La producción minera de cobre en Perú alcanzó 141,800 toneladas métricas en mayo de 2026, el nivel más alto en más de seis años, según el Ministerio de Energía y Minas. Las unidades productivas de Antamina, Las Bambas y Cerro Verde lideraron el resultado, que consolida a Perú como segundo productor mundial del metal.',
    contenido: `El Ministerio de Energía y Minas (MINEM) publicó hoy el Boletín Estadístico Minero de mayo 2026, que revela una producción de cobre de 141,800 toneladas métricas finas (TMF), superando en 8.4% las 130,800 TMF de mayo 2025. Este resultado representa el nivel de producción mensual más alto desde octubre 2019 y consolida la tendencia de recuperación del sector iniciada en 2024 tras los conflictos sociales que afectaron la producción en 2022-2023.

Las principales unidades mineras que contribuyeron al resultado fueron: Antamina (Áncash) con 29,400 TMF (+12% interanual), Las Bambas (Apurímac) con 24,800 TMF (+18%), Cerro Verde (Arequipa) con 23,600 TMF (+6%), y Toromocho (Junín) con 16,200 TMF (+9%). Destacó el reinicio de operaciones plenas en la ampliación de la unidad Quellaveco (Anglo American), que aportó 15,100 TMF adicionales tras completar su expansión de capacidad.

El precio del cobre en la LME cerró la semana en US$ 4.73/lb, nivel que genera ingresos extraordinarios para el Estado peruano vía regalías e impuesto a la renta. El MINEM estima que por cada US$ 0.10/lb adicional en el precio del cobre por encima de US$ 3.50/lb, el fisco peruano recauda aproximadamente US$ 180 millones adicionales al año. Con el precio actual, el excedente estimado alcanza US$ 1,280 millones anuales sobre la línea base.

Perú mantiene su posición como el segundo productor mundial de cobre con una participación de mercado del 12%, solo detrás de Chile (27%). Para 2026, el MINEM proyecta una producción anual de 1,650,000 TMF, que representaría un record histórico para el sector.`,
    analisis: `La producción récord de cobre tiene implicancias directas y positivas sobre el tipo de cambio del sol peruano. Las exportaciones de cobre representan aproximadamente el 30% de las exportaciones totales del país, y el ingreso de divisas asociado genera oferta estructural de dólares que sostiene la estabilidad del sol incluso en entornos de dólar global fortalecido.

Con el cobre sobre US$ 4.70/lb y la producción en niveles récord, el Perú tiene fundamentos macroeconómicos sólidos para sostener el sol entre S/ 3.38-3.42 en el segundo semestre de 2026. Para inversores y empresas con exposición al mercado cambiario, este es un factor estructural favorable que distingue al sol de otras divisas emergentes más vulnerables.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28442180/pexels-photo-28442180.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f005',
    titulo: 'MEF revisa al alza proyección de crecimiento del PBI peruano: 3.1% para 2026 por dinamismo exportador',
    descripcion: 'El Ministerio de Economía y Finanzas actualizó su proyección de crecimiento económico para el Perú en 2026, elevándola de 2.8% a 3.1%, sustentada en el desempeño superior al esperado del sector minero-exportador y la agroexportación. La revisión mejora las expectativas de ingresos fiscales y refuerza la estabilidad macroeconómica.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó hoy la actualización de sus proyecciones macroeconómicas para 2026, elevando la estimación de crecimiento del Producto Bruto Interno (PBI) de 2.8% a 3.1%. La revisión al alza se sustenta en tres factores principales: el desempeño récord de la producción minera (cobre +8.4% interanual en mayo), el boom de agroexportaciones (arándanos, uvas, paltas con crecimientos de dos dígitos) y la recuperación de la inversión privada, que creció 6.2% en el primer trimestre.

El titular del MEF, José Salardi, señaló que "los fundamentos de la economía peruana son sólidos: reservas internacionales en máximos históricos, déficit fiscal controlado en 2.1% del PBI, y un sector exportador que genera divisas de manera sostenida". La autoridad destacó que la proyección de 3.1% para 2026 es una de las más altas entre los países de la región, superando a Chile (2.6%), Colombia (2.9%) y México (1.8%).

El MEF también revisó al alza sus proyecciones de ingresos tributarios: de S/ 142,000 millones a S/ 146,800 millones para el año, considerando los mayores ingresos por regalías mineras derivados del precio elevado del cobre y el incremento en el IGV por mayor actividad económica formal. El ratio deuda pública/PBI se proyecta en 33.4%, por debajo del umbral de 35% establecido como objetivo de mediano plazo.

Para 2027, el MEF mantiene una proyección de crecimiento de 3.3%, condicionada a la implementación del nuevo portafolio de inversión en infraestructura (Ferrocarril Central, Majes Siguas II, Chavimochic III) y a la continuidad de precios de commodities favorables. El INEI publicará las cifras del PBI del primer trimestre 2026 el próximo martes 17 de junio.`,
    analisis: `La revisión al alza del crecimiento peruano al 3.1% es una señal macroeconómica positiva para la estabilidad del sol. Un mayor crecimiento implica mayor inversión extranjera directa, más ingresos por exportaciones y mejor posición fiscal, todos factores que contribuyen a la apreciación o estabilización de la moneda local. El diferencial de crecimiento entre Perú y sus pares regionales es un factor de atracción de flujos de capital.

Para exportadores, importadores e individuos con ahorros en dólares en el Perú, el entorno macroeconómico actual es favorable: crecimiento sólido, reservas robustas y un banco central activo en la defensa de la estabilidad cambiaria. En QoriCash ofrecemos los mejores tipos de cambio del mercado con transparencia y velocidad.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f006',
    titulo: 'Crédito empresarial en Perú creció 6.8% interanual en mayo: BCRP reporta reactivación del sistema bancario',
    descripcion: 'El crédito al sector empresarial en el Perú creció 6.8% en términos interanuales a mayo de 2026, alcanzando S/ 194,600 millones, según el reporte mensual del BCRP. El crecimiento refleja la reactivación de la inversión privada y la mayor demanda de capital de trabajo de las empresas exportadoras, mineras y agroexportadoras.',
    contenido: `El Banco Central de Reserva del Perú publicó hoy el Reporte de Crédito del Sistema Financiero correspondiente a mayo 2026, que muestra un crecimiento del crédito empresarial de 6.8% interanual, acelerándose desde el 5.2% de abril. El saldo total de créditos al sector empresarial alcanzó S/ 194,600 millones, de los cuales S/ 82,400 millones corresponden a créditos en moneda extranjera.

Por segmentos, el crédito a grandes empresas creció 8.2% (S/ 87,300 millones), impulsado por desembolsos del sector minero para financiar planes de expansión y capital de trabajo. El crédito a medianas empresas avanzó 6.1% (S/ 54,200 millones), con fuerte dinamismo en los sectores de agroexportación y manufactura orientada a exportaciones. El crédito a pequeñas y microempresas (PYME) creció 4.8%, el menor ritmo del segmento pero con tendencia positiva.

Las tasas de interés promedio para créditos empresariales en soles se ubican en 9.2% anual para grandes empresas y 18.4% para PYME, mientras que en dólares las tasas oscilan entre 6.8% y 14.2%. La morosidad del sistema se ubicó en 3.8%, por debajo del 4.1% de mayo 2025, reflejando la mejora en la calidad de la cartera crediticia.

Los bancos Credicorp (BCP), BBVA Continental y Scotiabank concentran el 64% del crédito empresarial total. El BCP lideró en desembolsos netos durante mayo con S/ 4,200 millones, seguido por BBVA con S/ 3,100 millones. La banca de desarrollo (COFIDE) aportó S/ 1,800 millones adicionales en líneas de crédito para exportadoras y empresas de infraestructura.`,
    analisis: `El crecimiento del crédito empresarial al 6.8% interanual señala una economía en expansión donde el sector privado confía en el entorno macroeconómico y está dispuesto a endeudarse para invertir. Para el tipo de cambio, este dinamismo crediticio puede generar presiones inflacionarias en el mediano plazo si se acelera demasiado, lo que podría llevar al BCRP a mantener tasas altas más tiempo —favoreciendo la estabilidad del sol.

Para empresas que requieren financiamiento en dólares y necesitan convertirlos a soles para sus operaciones locales, los niveles actuales de tipo de cambio (S/ 3.390-3.393) ofrecen una oportunidad razonable. En QoriCash facilitamos cambios de divisas para empresas con los mejores spreads del mercado peruano.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f007',
    titulo: 'Fed hawkish: Kevin Warsh descarta recorte de tasas en julio tras empleo sólido de mayo en EE.UU.',
    descripcion: 'El presidente de la Reserva Federal, Kevin Warsh, descartó públicamente la posibilidad de un recorte de tasas en la reunión del FOMC del 29 de julio, citando la fortaleza del mercado laboral americano en mayo (227,000 empleos creados) y la necesidad de mayor evidencia de convergencia de la inflación hacia el objetivo del 2%. El dólar se fortaleció y los rendimientos de los bonos del Tesoro subieron.',
    contenido: `Kevin Warsh, presidente de la Reserva Federal de los Estados Unidos, declaró este viernes ante el Council on Foreign Relations en Nueva York que "no existe un caso sólido para reducir el costo del dinero en julio con un mercado laboral que continúa creando empleos a un ritmo inconsistente con una inflación del 2% en el corto plazo". Las declaraciones provocaron una revisión inmediata de las expectativas del mercado: la herramienta FedWatch de CME Group redujo la probabilidad de recorte en julio de 72% (tras el IPC del miércoles) a 38%.

El reporte de empleo de mayo publicado hoy mostró la creación de 227,000 puestos de trabajo no agrícolas, superando el consenso de 185,000. La tasa de desempleo se mantuvo estable en 3.9% y los salarios por hora crecieron 0.4% mensual (4.1% interanual), por encima del 0.3% esperado. Warsh señaló específicamente el crecimiento salarial como un factor de preocupación que puede alimentar la inflación de servicios en los próximos meses.

El mercado reaccionó con ventas generalizadas: el Nasdaq cayó 1.2%, el S&P 500 retrocedió 0.8% y el rendimiento del bono del Tesoro a 10 años subió de 4.27% a 4.41%. El dólar (DXY) avanzó a 103.8 puntos, su nivel más alto en tres meses. Los futuros de tasas ahora descuentan el primer recorte en la reunión del 17 de septiembre, con una probabilidad del 68%.

Warsh, quien reemplazó a Jerome Powell en la presidencia de la Fed en febrero de 2026, ha mantenido un tono más hawkish que su predecesor y ha enfatizado la necesidad de restaurar plenamente la credibilidad antiinflacionaria de la Fed. El próximo hito para los mercados será el IPC de mayo —que se publica el martes 17 de junio— y que será determinante para la orientación del FOMC en su reunión de julio.`,
    analisis: `El sesgo hawkish de Warsh reduce las perspectivas de depreciación del dólar en el corto plazo, lo que implica presión sobre las monedas emergentes incluyendo el sol peruano. Un diferencial de tasas Fed-BCRP parejo (ambos en 4.25%) elimina el carry trade favorable al sol y reduce el atractivo relativo de activos en moneda local peruana para inversores globales.

La posposición del primer recorte Fed al septiembre o más adelante implica que el sol puede mantenerse en el rango S/ 3.38-3.45 durante el tercer trimestre. Para quienes tienen exposición en dólares, es prudente revisar estrategias de cobertura. QoriCash ofrece tipos de cambio competitivos para operaciones spot y forward con asesoría profesional.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8788264/pexels-photo-8788264.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f008',
    titulo: 'China PMI manufacturero de mayo: 49.8 puntos, segunda contracción consecutiva genera cautela en mercados',
    descripcion: 'El PMI manufacturero oficial de China correspondiente a mayo registró 49.8 puntos —por debajo del umbral de expansión de 50— marcando la segunda contracción consecutiva del sector fabril chino. El dato aumenta la presión sobre el gobierno de Pekín para implementar nuevos estímulos fiscales y reduce las expectativas de demanda de materias primas.',
    contenido: `La Oficina Nacional de Estadística de China publicó el PMI manufacturero de mayo en 49.8 puntos, por debajo del umbral de 50 que separa expansión de contracción. El dato fue levemente superior al consenso de 49.5 pero confirmó la tendencia contractiva del sector fabril chino por segundo mes consecutivo. El sub-índice de nuevos pedidos —considerado el indicador líder del PMI— cayó a 49.4, su nivel más bajo desde octubre 2023.

Los componentes que más contribuyeron a la contracción fueron: los pedidos de exportación (48.7 puntos, cayendo 1.1 desde abril, afectados por los aranceles del 104% impuestos por la administración Trump a productos chinos desde enero de 2026), el índice de empleo manufacturero (48.2, reflejando reducciones de personal en fábricas), y el índice de compras de insumos (49.1, con empresas reduciendo inventarios). En contraste, el sub-índice de precios de insumos subió a 52.1, señalando presiones inflacionarias de costos que comprimen márgenes.

El PMI no manufacturero —que incluye servicios y construcción— se mantuvo en zona expansiva con 52.4 puntos, sugiriendo que la economía china se mantiene a dos velocidades: un sector de servicios resiliente impulsado por el consumo interno y un sector manufacturero bajo presión por los aranceles americanos y la debilidad de la demanda global.

El gobierno chino ha anunciado medidas de estímulo que incluyen la reducción del impuesto al valor añadido para manufactureras de exportación y líneas de crédito preferenciales para empresas afectadas por los aranceles. Los analistas de Goldman Sachs redujeron su proyección de crecimiento de China para 2026 de 4.8% a 4.4%, citando el impacto persistente de las restricciones comerciales americanas.`,
    analisis: `La contracción manufacturera china tiene implicancias directas para los precios del cobre y otras materias primas que exporta el Perú. China representa el 55% de la demanda mundial de cobre, y un PMI manufacturero sostenidamente por debajo de 50 sugiere menor demanda de metales industriales en los próximos meses, lo que podría presionar los precios a la baja desde los niveles actuales de US$ 4.73/lb.

Para el sol peruano, un escenario de caída del cobre representa el mayor riesgo macroeconómico estructural: cada -US$ 0.10/lb en el precio del cobre reduce las exportaciones peruanas en aproximadamente US$ 500-600 millones anuales y aumenta la presión depreciativa sobre la moneda. Es recomendable monitorear el PMI chino mensualmente como indicador adelantado del tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f009',
    titulo: 'Petróleo WTI cae a US$ 78.40 por barril tras señales de OPEP+ de ampliar cuotas de producción en agosto',
    descripcion: 'El precio del petróleo WTI retrocedió a US$ 78.40 por barril al cierre de la semana, cayendo 2.8% en la jornada, tras la difusión de fuentes cercanas a la OPEP+ que indicaron que varios miembros del cartel apoyan ampliar las cuotas de producción en la reunión de agosto. Arabia Saudí y Emiratos Árabes Unidos liderarían el incremento propuesto.',
    contenido: `El contrato de futuros del petróleo West Texas Intermediate (WTI) para entrega en julio cerró la semana en US$ 78.40 por barril, cayendo US$ 2.25 (2.8%) en la sesión del viernes tras publicaciones de Bloomberg y Reuters que citaron fuentes anónimas al interior de la OPEP+ indicando que varios productores importantes —liderados por Arabia Saudí y los Emiratos Árabes Unidos— apoyan un incremento de las cuotas de producción del orden de 400,000 barriles/día para agosto.

La OPEP+ tiene programada una reunión ministerial para el 6 de agosto, donde decidirá su estrategia de producción para el segundo semestre. Fuentes consultadas por Reuters señalan que Arabia Saudí, decepcionada por los bajos niveles de precios alcanzados en 2025 ($71-76/bbl) a pesar de los recortes previos, evalúa adoptar una estrategia de recuperación de cuotas de mercado frente al aumento de producción de no-OPEP (EE.UU., Guyana, Brasil).

Los factores que presionan a la baja incluyen: el incremento de la producción americana a 13.4 millones de barriles/día (máximo histórico), la desaceleración de China reflejada en el PMI manufacturero, y los inventarios de crudo en EE.UU. que subieron 3.2 millones de barriles la semana pasada según la EIA. En sentido contrario, las tensiones en el estrecho de Ormuz —donde Irán ha ejecutado maniobras navales en las últimas semanas— ofrecen soporte geopolítico al precio.

El Brent internacional, referencia para la mayoría de contratos de crudo peruano (Lote 192, Lote 64), cerró en US$ 82.10/bbl. Los analistas de Goldman Sachs y JPMorgan ajustaron sus estimaciones para el cierre de 2026: de US$ 85/bbl a US$ 79-82/bbl, citando el exceso de oferta potencial si la OPEP+ concreta el incremento de producción.`,
    analisis: `La caída del petróleo tiene un impacto moderadamente positivo para la economía peruana como consumidor neto de hidrocarburos: menores precios de combustibles reducen costos de transporte y producción, moderando la inflación doméstica y aliviando la presión sobre el BCRP para mantener tasas altas. Para el sol, el efecto es mixto: por un lado, menor factura de importaciones favorece la balanza comercial; por otro, el menor precio del petróleo suele correlacionarse con menor apetito por riesgo global y presión sobre emergentes.

El rango WTI de US$ 75-82/bbl es el escenario base para el tercer trimestre. Si el crudo cayera por debajo de US$ 70, habría implicancias inflacionarias positivas para el BCRP que podrían acelerar los recortes de tasas, lo que a su vez presionaría al sol a la depreciación.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15970032/pexels-photo-15970032.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f010',
    titulo: 'Oro avanza a US$ 3,418/oz: tensiones en Oriente Medio y compras de bancos centrales sostienen rally',
    descripcion: 'El precio del oro al contado cerró la semana en US$ 3,418 por onza troy, ganando 1.4% en la jornada y 2.8% en la semana. El metal precioso se beneficia de la incertidumbre geopolítica en el Golfo Pérsico y de la continuidad del ciclo de compras de bancos centrales asiáticos y del Medio Oriente que lleva 18 meses sin interrupción.',
    contenido: `El oro al contado (XAU/USD) cerró la jornada del viernes en US$ 3,418.40 por onza troy, avanzando US$ 47.30 (1.4%) en la sesión y acumulando una ganancia semanal de 2.8%. El metal toca su mayor nivel en cuatro semanas, impulsado por una convergencia de factores: el escalamiento de tensiones en el estrecho de Ormuz (donde Irán ejecutó maniobras navales), la persistencia del ciclo de compras de bancos centrales y la demanda de refugio ante la incertidumbre en torno a la política monetaria de la Fed.

El World Gold Council reportó que los bancos centrales compraron 287 toneladas de oro en el primer trimestre de 2026, el segundo trimestre consecutivo de compras netas superiores a 250 toneladas. Los principales compradores fueron China (68 toneladas), India (43 toneladas), Polonia (32 toneladas) y Turquía (28 toneladas). China elevó sus reservas de oro al 9.2% del total de reservas internacionales, desde el 7.8% de diciembre 2024.

Las tensiones en Oriente Medio tienen particular relevancia esta semana: fuentes de inteligencia israelí citadas por Axios señalaron que Irán habría acelerado su programa de enriquecimiento de uranio, generando presiones diplomáticas que los mercados interpretan como factor de riesgo geopolítico sostenido. El petróleo Brent también subió moderadamente por este factor, aunque luego cedió ante las perspectivas de la OPEP+.

Los analistas de Bank of America proyectan que el oro puede alcanzar US$ 3,600/oz en el tercer trimestre de 2026 si la Fed no recorta tasas y el dólar se fortalece más, ya que el metal actúa como cobertura de incertidumbre en escenarios de política monetaria incierta. Goldman Sachs mantiene su objetivo de US$ 3,500/oz para fin de año.`,
    analisis: `El rally del oro es relevante para el Perú por dos razones: primero, el país es el sexto productor mundial de oro y precios elevados generan ingresos de exportación adicionales (estimados en US$ 220 millones adicionales al año por cada +US$ 100/oz sobre los US$ 3,000/oz). Segundo, el oro en alza refleja mayor incertidumbre global, lo que puede presionar a los bancos centrales emergentes —incluido el BCRP— a ser más cautelosos con sus recortes de tasas.

Para inversores peruanos que mantienen posiciones en dólares, el contexto de oro en máximos y tensiones geopolíticas refuerza la importancia de diversificación. QoriCash facilita la conversión eficiente entre soles y dólares con los mejores tipos de cambio del mercado local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f011',
    titulo: 'Bitcoin consolida sobre US$ 104,200: ETF inflows de US$ 1.2 billones en la semana impulsan precio',
    descripcion: 'Bitcoin cerró la jornada del viernes en US$ 104,280, manteniéndose firmemente por encima del soporte psicológico de US$ 100,000, sustentado por flujos de entrada a ETF spot de US$ 1.2 billones en la semana. El mercado cripto muestra resiliencia a pesar del fortalecimiento del dólar y la postura hawkish de la Fed.',
    contenido: `Bitcoin (BTC/USD) cotizó en US$ 104,280 al cierre de la jornada del viernes en los mercados de EE.UU., avanzando 1.8% en la semana a pesar de la presión bajista generada por el dato de empleo y el hawkismo de Warsh. La fortaleza del activo digital refleja la consolidación de una nueva base compradora institucional vía ETF, que ha transformado la dinámica del mercado cripto desde la aprobación de los ETF spot en enero 2024.

Los flujos de entrada a los 11 ETF spot de Bitcoin aprobados en EE.UU. sumaron US$ 1.22 billones durante la semana del 9-13 de junio, el cuarto resultado semanal positivo consecutivo. Los fondos de BlackRock (IBIT) y Fidelity (FBTC) concentraron el 71% de los inflows: IBIT recibió US$ 534 millones e IBIT acumula ya US$ 89.4 billones en activos bajo gestión desde su lanzamiento. En total, los ETF de Bitcoin en EE.UU. administran US$ 124 billones, equivalentes al 6.1% del market cap total del activo.

El análisis técnico muestra a Bitcoin en un rango de consolidación entre US$ 100,200 y US$ 107,800. El RSI diario se ubica en 56, zona neutra, y el MACD muestra convergencia positiva. Los analistas de Standard Chartered ven el rango US$ 100,000-110,000 como zona de acumulación y proyectan una ruptura hacia US$ 120,000 en el cuarto trimestre de 2026, impulsada por el ciclo post-halving (el halving de abril 2024 comprime la oferta con un rezago histórico de 12-18 meses).

El mercado de opciones señala alta concentración de posiciones abiertas (open interest) en los strikes de US$ 105,000 y US$ 110,000 para el vencimiento de fin de junio, lo que puede crear dinámicas de "gamma squeeze" si el precio alcanza esos niveles en las próximas semanas.`,
    analisis: `Bitcoin en torno a US$ 100,000-110,000 refleja la maduración del activo como clase de inversión institucional. Para peruanos con ahorros en dólares que consideran diversificar hacia cripto, el contexto de ETF con amplia liquidez es favorable, aunque el activo mantiene alta volatilidad (beta > 1.5 vs S&P 500). El tipo de cambio sol/bitcoin tiene relevancia para peruanos que quieran comprar o vender cripto en soles: a S/ 3.393/USD, un Bitcoin equivale aproximadamente a S/ 353,800 soles.

Para quienes necesitan convertir ganancias cripto (dólares) a soles para gastos locales o inversiones en Perú, QoriCash ofrece el mejor tipo de cambio del mercado con atención inmediata.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6765705/pexels-photo-6765705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f012',
    titulo: 'DXY Index escala a 103.8 puntos: fortaleza del dólar presiona divisas emergentes de América Latina',
    descripcion: 'El índice dólar (DXY) avanzó a 103.8 puntos esta semana, impulsado por los sólidos datos de empleo de EE.UU. y el sesgo hawkish de la Fed. El fortalecimiento del dólar generó presiones sobre todas las divisas emergentes de la región: el peso mexicano, real brasileño, sol peruano y peso colombiano cedieron entre 0.5% y 0.8% en la sesión del viernes.',
    contenido: `El US Dollar Index (DXY) —que mide el valor del dólar frente a una canasta de seis monedas: euro (57.6%), yen (13.6%), libra esterlina (11.9%), dólar canadiense (9.1%), corona sueca (4.2%) y franco suizo (3.6%)— alcanzó 103.8 puntos al cierre de la semana, su nivel más alto desde el 18 de marzo de 2026. El avance semanal fue de 1.4%, el mayor en seis semanas.

Los principales motores del DXY esta semana fueron: el dato de nóminas no agrícolas de mayo (227,000 empleos, vs consenso 185,000), las declaraciones hawkish del presidente de la Fed Kevin Warsh descartando un recorte en julio, y el flujo de capitales hacia activos americanos tras el PMI manufacturero débil de China. El EUR/USD cedió de 1.0910 a 1.0820, el USD/JPY avanzó de 156.8 a 158.4 y el GBP/USD retrocedió de 1.2730 a 1.2640.

El impacto sobre América Latina fue uniforme: el peso mexicano (USD/MXN) se depreció de 17.12 a 17.23; el real brasileño (USD/BRL) de 5.38 a 5.44; el peso colombiano (USD/COP) de 4,180 a 4,215; y el sol peruano (USD/PEN) de 3.388 a 3.393. El peso argentino mantuvo su estabilidad relativa gracias al régimen de banda de flotación implementado por el gobierno de Milei.

Los analistas de Morgan Stanley señalan que el DXY puede probar el nivel de 104.5-105.0 si el IPC de mayo (que se publica el martes próximo) supera el consenso del 2.7% interanual. En caso contrario —si el IPC confirma la desinflación— el DXY podría retroceder hacia 102.5-103.0, aliviando la presión sobre las divisas emergentes.`,
    analisis: `Un DXY en 103.8 y tendencia al alza es el principal factor de riesgo externo para el sol peruano en el corto plazo. El escenario base para las próximas dos semanas es un DXY en rango 102.5-105.0, con el sol oscilando entre S/ 3.38 y S/ 3.42. El publicación del IPC americano el martes será el catalizador más importante de la semana.

Para personas con obligaciones en dólares (cuotas de préstamos hipotecarios en dólares, estudios en el exterior, viajes), comprar dólares en los niveles actuales (S/ 3.393) resulta prudente antes de conocer el CPI. En QoriCash ofrecemos tipos de cambio competitivos para personas naturales con atención inmediata.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28682345/pexels-photo-28682345.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f013',
    titulo: 'Argentina registra superávit fiscal primario de ARS 2.1 billones en mayo: quinto mes consecutivo de equilibrio',
    descripcion: 'El gobierno de Argentina publicó el resultado fiscal de mayo: superávit primario de ARS 2.12 billones (aproximadamente US$ 1,980 millones al tipo de cambio oficial), marcando el quinto mes consecutivo con saldo positivo bajo la administración de Javier Milei. La continuidad del ajuste fiscal es el principal pilar que mantiene la credibilidad del programa económico.',
    contenido: `El Ministerio de Economía de Argentina presentó hoy el informe de ejecución presupuestaria de mayo 2026, reportando un superávit fiscal primario de ARS 2.12 billones, el quinto resultado positivo consecutivo desde que la administración Milei implementó el programa de ajuste de emergencia en diciembre de 2023. En términos acumulados de enero a mayo, el superávit primario alcanza ARS 9.8 billones, equivalentes a 1.8% del PBI proyectado para 2026.

Los factores detrás del resultado positivo en mayo fueron: la caída real del gasto público primario en 18% interanual (ajustado por inflación), impulsada principalmente por la reducción de subsidios energéticos y de transporte, y la reactivación de los ingresos tributarios derivados del IVA, que creció 8.2% en términos reales gracias a la normalización del consumo. El impuesto a las exportaciones (retenciones) aportó ARS 420,000 millones adicionales al fisco, con el tipo de cambio oficial en ARS 1,040/USD.

La inflación argentina de mayo fue de 3.8% mensual, acumulando 46.2% en el año pero con una trayectoria decreciente desde el pico de 25.5% mensual de enero 2024. El gobierno proyecta cerrar 2026 con una inflación anual del 45-50%, lejos del objetivo original del 25% pero con una tendencia bajista considerada "históricamente inédita" por el equipo económico. El riesgo país (EMBI+) cayó a 580 puntos básicos, su nivel más bajo desde 2019.

El FMI revisó positivamente el programa en su última revisión trimestral, habilitando el desembolso de US$ 2.8 billones de la línea de crédito ampliada. Sin embargo, el organismo multilateral advirtió que la sostenibilidad del ajuste depende de mantener el superávit primario incluso en el contexto del ciclo electoral de las elecciones legislativas de octubre 2026.`,
    analisis: `El quinto mes consecutivo de superávit primario argentino es una señal positiva de estabilización macroeconómica que tiene implicancias para el tipo de cambio informal (blue dollar) y el riesgo regional. Para Perú y el sol, un Argentina más estable reduce el "riesgo contagio" latinoamericano y puede contribuir a un entorno regional de menor volatilidad.

Para empresas peruanas con operaciones en Argentina o que exportan al mercado argentino, la estabilización del tipo de cambio oficial ARS/USD y la mejora del poder adquisitivo de los consumidores argentinos son señales positivas para el comercio bilateral. En QoriCash facilitamos cambios de divisas para empresas con operaciones en múltiples monedas latinoamericanas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15574935/pexels-photo-15574935.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f014',
    titulo: 'Colombia: Banco de la República mantiene tasa en 8.75% y proyecta inflación de 4.2% para diciembre 2026',
    descripcion: 'La junta directiva del Banco de la República de Colombia decidió hoy por mayoría de 5 a 2 mantener la tasa de política monetaria en 8.75%, frenando el ciclo de recortes que había llevado la tasa de 13.25% a 8.75% en 18 meses. La institución citó la fortaleza del dólar global, la inflación persistente en servicios y la incertidumbre de las políticas comerciales americanas.',
    contenido: `La junta directiva del Banco de la República de Colombia se reunió hoy y decidió, por una votación de 5 votos a favor del mantenimiento y 2 a favor de un recorte adicional de 25 puntos básicos, mantener la tasa de interés de política monetaria en 8.75%. La decisión marca una pausa en el ciclo de relajación monetaria que redujo la tasa desde el máximo histórico de 13.25% en julio 2024.

El comunicado del banco central colombiano señala que la pausa obedece a: la inflación de mayo que marcó 5.2% interanual (aún por encima del objetivo de 3%), la persistencia de la inflación de servicios en 7.8%, la depreciación del peso colombiano (USD/COP subió a 4,215 esta semana), y la incertidumbre global generada por las políticas comerciales de la administración Trump que pueden impactar las exportaciones colombianas de petróleo y café.

Colombia enfrenta un escenario macroeconómico delicado: el déficit en cuenta corriente se amplió a 4.1% del PBI en el primer trimestre, la inversión extranjera directa cayó 12% en el período enero-marzo, y el precio del petróleo Brent —principal producto de exportación— bajó a US$ 82/bbl. El gobierno del presidente Gustavo Petro ha tenido fricciones con el Banco de la República sobre el ritmo de los recortes, argumentando que la política monetaria restrictiva frena el crecimiento económico proyectado en solo 2.1% para 2026.

Los analistas de Corficolombiana y Davivienda proyectan que el banco central podría retomar los recortes en septiembre u octubre, condicionado a que la inflación continúe bajando y el peso se estabilice. El consenso de mercado sitúa la tasa en 8.00% para fin de 2026.`,
    analisis: `La decisión del Banco de la República colombiano de pausar los recortes de tasas refleja la presión que el dólar fortalecido ejerce sobre los bancos centrales de la región. Para el BCRP, el escenario colombiano es un marco de referencia: la inflación en servicios persistente y la debilidad cambiaria son factores que también aplican —en menor medida— al contexto peruano, y refuerzan la postura cautelosa del BCRP para su reunión de julio.

Para empresas peruanas con operaciones en Colombia o exportaciones al mercado colombiano, la estabilidad de la tasa del Banco de la República mantiene el costo de financiamiento en Colombia en niveles altos (8.75%), lo que puede afectar la demanda de importaciones colombianas desde el Perú.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f015',
    titulo: 'Chile: peso se fortalece a CLP 895 por dólar sostenido por cobre sobre US$ 4.73/lb y superávit comercial',
    descripcion: 'El peso chileno se apreció a CLP 895 por dólar al cierre de la semana, recuperando 0.7% desde el nivel de CLP 901 de comienzos de semana, sustentado por el precio del cobre en US$ 4.73/lb en la LME —principal exportación del país— y el superávit de la balanza comercial de mayo que alcanzó US$ 1,840 millones, el más alto del año.',
    contenido: `El tipo de cambio USD/CLP cerró la semana en CLP 895.4, apreciándose desde los CLP 901.2 de la apertura del lunes. La fortaleza relativa del peso chileno frente a la tendencia de depreciación de otras divisas latinoamericanas es atribuida principalmente al precio sostenido del cobre en la LME: el metal industrial cerró la semana en US$ 4.731/lb, generando ingresos de exportación superiores a los presupuestados por el gobierno y la empresa estatal CODELCO.

La balanza comercial de Chile en mayo mostró exportaciones por US$ 9,480 millones e importaciones por US$ 7,640 millones, resultando en un superávit de US$ 1,840 millones, el más alto de 2026 y superior al US$ 1,320 millones de mayo 2025. El cobre representó el 52% de las exportaciones totales (US$ 4,930 millones), seguido por pulpa de celulosa (US$ 812 millones) y litio procesado (US$ 680 millones), que muestra un crecimiento de 34% interanual.

El Banco Central de Chile —que sigue una política de tipo de cambio flotante sin intervención discrecional— no participó en la jornada. En su última reunión (mayo), el instituto emisor mantuvo la TPM en 5.50% y señaló que el siguiente movimiento será determinado por la convergencia de la inflación (actualmente en 3.9%) hacia el objetivo del 3%. Los analistas proyectan un recorte de 25 puntos básicos en la reunión de julio.

El FMI publicó su última revisión del Artículo IV de Chile con una proyección de crecimiento del 2.6% para 2026, señalando que el país mantiene fundamentos macroeconómicos sólidos: deuda pública en 40.2% del PBI, regla fiscal bien establecida con balance estructural objetivo de -0.2%, y un Fondo Soberano (FEES) de US$ 8.4 billones que puede actuar como estabilizador.`,
    analisis: `La fortaleza del peso chileno frente al dólar —en un contexto de DXY en máximos— confirma el rol del cobre como ancla cambiaria para las economías que lo producen. El paralelo con el sol peruano es directo: ambas monedas tienen en el cobre su mayor sustento de largo plazo, y mientras los precios del metal se mantengan por encima de US$ 4.50/lb, ambas divisas tienen fundamentos para resistir la apreciación del dólar global.

Para peruanos con negocios o inversiones en Chile, o que viajan frecuentemente a ese país, el tipo de cambio CLP/PEN implícito (CLP 895/USD ÷ S/ 3.393/USD ≈ CLP 263.8 por S/ 1.00) es relevante para la planificación financiera. QoriCash brinda la mejor tasa en operaciones PEN/USD, el primer paso para cualquier transacción internacional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
    fecha: '2026-06-11T08:00:00.000Z',
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
