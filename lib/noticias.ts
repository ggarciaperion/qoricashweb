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
const HOY = '2026-05-20T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'h001',
    titulo: "Moody's recorta calificación crediticia de EE.UU. de Aaa a Aa1 — DXY cae a 100.2 y sol peruano se aprecia a S/ 3.43",
    descripcion: "Moody's Ratings rebajó el pasado viernes la calificación soberana de Estados Unidos de Aaa a Aa1, la primera degradación desde 2011, citando el deterioro fiscal estructural. El DXY retrocedió a 100.2 puntos y el sol peruano se apreció a S/ 3.43, mínimo del año.",
    contenido: `Moody's Ratings anunció el viernes 16 de mayo la rebaja de la calificación crediticia soberana de Estados Unidos desde Aaa hasta Aa1, poniendo fin a una posición de máxima calidad crediticia que el país mantuvo por más de un siglo. La agencia citó el persistente aumento del déficit fiscal federal, que alcanzó el 6.4% del PBI en el año fiscal 2025, y la falta de legislación concreta para reducir el gasto o aumentar los ingresos fiscales de manera sostenible. La deuda pública bruta supera actualmente el 124% del PBI.

La noticia impactó inmediatamente a los mercados financieros globales. El DXY cayó desde 102.8 hasta 100.2 puntos en las siguientes 72 horas, acumulando su mayor retroceso semanal desde noviembre de 2022. El rendimiento del bono del Tesoro a 10 años subió 14 puntos básicos hasta 4.57%, reflejando que los inversores exigen mayor compensación por el riesgo crediticio ahora reconocido formalmente por Moody's.

Las divisas de economías emergentes con fundamentos sólidos fueron las principales beneficiarias. El sol peruano se apreció desde S/ 3.58 hasta S/ 3.43, el real brasileño reaccionó de forma mixta por inflación local, el peso colombiano pasó de 4,120 a 3,985 y el peso chileno de 978 a 951. El BCRP reportó intervenciones mínimas dado que el movimiento se produjo de forma ordenada impulsado por flujos de portafolios institucionales.

El nuevo presidente de la Fed, Kevin Warsh, declaró el lunes que la rebaja de Moody's "no cambia la postura de política monetaria" pero reconoció que eleva la presión política para lograr un acuerdo fiscal en el Congreso. Los mercados de futuros de Fed Funds ahora asignan un 45% de probabilidad a un recorte en junio, frente al 22% previo, al interpretar que la Fed podría flexibilizar política para apoyar el crecimiento ante el shock de confianza.`,
    analisis: `La rebaja de Moody's es estructuralmente positiva para el sol peruano. Un DXY debilitado —que podría mantenerse en el rango 99-102 en las próximas semanas— favorece a todas las divisas emergentes con superávit comercial, caso de Perú dado el boom exportador minero. El BCRP tiene margen para dejar que el sol se aprecie sin intervenir agresivamente, lo que también ayuda a contener la inflación importada.

Si gestionas exposición cambiaria y necesitas comprar dólares para pagos de importaciones o deudas, el nivel actual de S/ 3.43 representa una oportunidad. El consenso de analistas sugiere que el PEN/USD podría estabilizarse en el rango S/ 3.38-3.50 durante el segundo semestre, pero si el conflicto en Ormuz escala o el Congreso de EE.UU. agrava el problema fiscal, el dólar podría recuperarse temporalmente. No esperes niveles de S/ 3.30 en el corto plazo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/4968645/pexels-photo-4968645.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'Oro supera US$ 3,350/oz tras rebaja Moody\'s y tensiones en Ormuz — bancos centrales globales elevan reservas en oro por tercer mes consecutivo',
    descripcion: 'El oro al contado alcanzó US$ 3,358 por onza troy este miércoles, acumulando un alza del 4.2% en cinco sesiones. Los bancos centrales de economías emergentes adquirieron 38 toneladas netas en abril, el mayor ritmo de compras del año, consolidando la demanda estructural del metal.',
    contenido: `El oro al contado marcó un nuevo récord histórico de US$ 3,358/oz en la sesión europea de este miércoles, extendiendo el rally iniciado tras la rebaja de Moody's a la deuda soberana estadounidense el pasado viernes. El metal amarillo acumula un alza del 4.2% en cinco sesiones y del 18.7% en lo que va del año 2026, consolidándose como el activo de mejor desempeño en un entorno de incertidumbre geopolítica y fiscal global.

Los flujos hacia activos refugio se intensificaron por dos catalizadores simultáneos. Por un lado, la degradación crediticia de EE.UU. genera dudas sobre la condición del dólar como reserva de valor, llevando a gestores institucionales a aumentar la proporción de oro en sus carteras. Por otro lado, el Estrecho de Ormuz permanece parcialmente cerrado al tráfico comercial desde hace nueve semanas, manteniendo el petróleo Brent en torno a US$ 100/barril e impulsando las expectativas de inflación a largo plazo.

El Consejo Mundial del Oro reportó que los bancos centrales compraron neto 38 toneladas de oro en abril, el mayor registro mensual de 2026. Los principales compradores fueron los bancos centrales de China (12 TM), Polonia (8 TM), India (7 TM) y Turquía (6 TM). La demanda de ETFs de oro también se recuperó, con el SPDR Gold Trust registrando entradas de US$ 1,240 millones en la semana.

Los analistas de Goldman Sachs elevaron su precio objetivo para el oro a US$ 3,700/oz para finales de 2026, argumentando que la combinación de déficit fiscal estadounidense persistente, dolarización global en retroceso y demanda estructural de bancos centrales crea un piso alto para el precio del metal.`,
    analisis: `El alza del oro tiene implicancia directa para Perú, segundo productor mundial: cada incremento de US$ 100/oz en el precio genera un aumento de aproximadamente US$ 480 millones anuales en las exportaciones peruanas de oro, lo que fortalece la balanza comercial y provee de reservas adicionales al BCRP. El tipo de cambio PEN/USD se beneficia doblemente: por el DXY debilitado y por el mayor superávit comercial.

Para empresas con ingresos en dólares vinculados a exportaciones mineras (y sus proveedores), el escenario actual —oro caro, cobre firme, sol apreciándose— es positivo en términos de márgenes en soles. Si recibes dólares por exportaciones y no los necesitas de inmediato, considera mantenerlos: la apreciación del sol puede revertirse si la geopolítica se estabiliza o si los datos de inflación en EE.UU. sorprenden al alza.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/366551/pexels-photo-366551.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'Exportaciones peruanas de cobre superan USD 6,384M en Q1 2026 — crecimiento del 53% impulsado por precio récord y volumen sostenido',
    descripcion: 'El BCRP reportó que las exportaciones de cobre peruano alcanzaron USD 6,384 millones en los primeros dos meses de 2026, un incremento del 53.3% frente al mismo período de 2025. El boom exportador eleva el superávit comercial del trimestre a USD 12,867 millones, fortaleciendo las reservas internacionales.',
    contenido: `El Banco Central de Reserva del Perú publicó esta semana los datos de comercio exterior del primer trimestre de 2026, confirmando un desempeño excepcional de las exportaciones tradicionales. El cobre lideró los envíos con USD 6,384 millones en enero y febrero combinados, impulsado por un aumento del 53.4% en el precio internacional y un crecimiento del 3.6% en el volumen exportado. La tendencia se aceleró en marzo, con exportaciones de minería creciendo 55% interanual.

Las minas de mayor contribución fueron Las Bambas (MMG Limited, 89,432 TM en el trimestre), Cerro Verde (Freeport-McMoRan, 81,210 TM) y Antapaccay (Glencore, 55,670 TM). En conjunto, los tres proyectos representaron el 47% del cobre exportado. Perú mantuvo su posición como segundo productor mundial de cobre con una participación del 10.8% de la producción global.

China continuó siendo el principal destino, concentrando el 49% de los envíos de cobre, seguido por Japón (12%), Corea del Sur (9%) y la Unión Europea (8%). El boom exportador también incluye el oro, cuyas exportaciones crecieron 42% en el trimestre hasta USD 3,890 millones.

El superávit comercial del Q1 2026 alcanzó USD 12,867 millones, el más alto en la historia moderna del Perú. Las reservas internacionales netas del BCRP superaron los USD 78,400 millones al cierre de abril, equivalentes a 22 meses de importaciones.`,
    analisis: `El superávit comercial récord refuerza la solidez del sol peruano en el mediano plazo. Una mayor oferta estructural de dólares proveniente de exportaciones crea un piso para la apreciación del PEN. El BCRP puede comprar dólares para acumular reservas sin presionar al alza el tipo de cambio, lo que también ayuda a contener la inflación importada.

Para empresas y personas con ingresos en soles que necesiten dólares para viajes, estudios o pagos internacionales, el escenario exportador fuerte y reservas altas del BCRP sugiere que el tipo de cambio se mantendrá contenido en el rango S/ 3.38-3.55 para el resto de 2026. No hay razones estructurales para esperar un retorno a niveles de S/ 3.65-3.80. Aprovechar el tipo de cambio actual para compras programadas de dólares tiene sentido.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1340552/pexels-photo-1340552.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'BCRP monitorea impacto de rebaja Moody\'s y deja puerta abierta a intervención cambiaria si sol se aprecia por debajo de S/ 3.35',
    descripcion: 'El Banco Central de Reserva del Perú emitió un comunicado indicando que monitorea el tipo de cambio tras la rebaja de Moody\'s a EE.UU. El BCRP realizó compras de dólares por USD 210 millones en los últimos dos días para suavizar la apreciación y acumular reservas, con el umbral de intervención más activa estimado en S/ 3.35-3.38.',
    contenido: `El Banco Central de Reserva del Perú emitió un comunicado oficial este miércoles reconociendo el impacto del shock externo generado por la rebaja crediticia de Moody's a la deuda soberana estadounidense. El texto señala que el BCRP "monitorea en tiempo real la evolución del tipo de cambio y los flujos de capital" y cuenta con "instrumentos suficientes para asegurar el funcionamiento ordenado del mercado cambiario".

El sol peruano cerró este miércoles en S/ 3.43, apreciándose un 4.7% desde el cierre de 2025 (S/ 3.595). El BCRP realizó compras de dólares por USD 210 millones el lunes y martes para suavizar la apreciación y recargar reservas, según fuentes del mercado cambiario. Sin embargo, la intervención fue moderada frente al volumen de flujos, lo que indica que el banco central no se opone a la tendencia apreciatoria.

Analistas del mercado estiman que el piso de intervención activa del BCRP se ubica en torno a S/ 3.35-3.38. Por encima de ese nivel, el banco central permitirá que el mercado opere libremente con intervenciones suaves de compra de dólares para acumular reservas. Por debajo, activará un programa más agresivo para evitar que la apreciación dañe la competitividad exportadora no minera y el turismo.

El gerente de Política Monetaria del BCRP, Adrián Armas, señaló que "la apreciación actual refleja fundamentos macroeconómicos sólidos —superávit comercial récord, reservas internacionales altas, inflación dentro del rango meta— y no genera preocupación en términos de estabilidad financiera".`,
    analisis: `El comunicado del BCRP confirma que el banco central tiene una postura benevolente frente a la apreciación actual del sol. La combinación de superávit externo récord, reservas históricas y rebaja del DXY crea condiciones para que el PEN/USD se consolide en el rango S/ 3.38-3.50 durante el segundo semestre de 2026.

Para quienes importan bienes o tienen deudas en dólares, este es un contexto favorable para gestionar esas obligaciones. Sin embargo, no asumir que la apreciación continuará indefinidamente: si el conflicto en Ormuz escala y los precios del petróleo suben, el DXY podría recuperar terreno rápidamente. Mantener coberturas cambiarias o un buffer de dólares es prudente para horizontes mayores a 90 días.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7447655/pexels-photo-7447655.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'MEF eleva proyección de crecimiento del PBI peruano a 3.5% para 2026 — minería y recuperación del consumo lideran la expansión',
    descripcion: 'El Ministerio de Economía y Finanzas actualizó su Marco Macroeconómico Multianual, elevando la proyección de crecimiento del PBI de 2.9% a 3.5% para 2026. La revisión responde al boom exportador minero, la estabilización del consumo privado y la recuperación de la inversión pública.',
    contenido: `El Ministerio de Economía y Finanzas presentó este martes la revisión de su Marco Macroeconómico Multianual (MMM) 2026-2029, elevando la proyección de crecimiento del Producto Bruto Interno de 2.9% a 3.5% para el presente año. La revisión se basa en el sólido desempeño del primer trimestre, cuando el PBI creció 3.2% impulsado por la minería (+8.1%), manufactura (+4.3%) y servicios (+3.6%).

El MEF proyecta que el sector minero crecerá 9.2% en 2026, liderado por la producción récord de cobre en Las Bambas, Cerro Verde y Antapaccay, así como la expansión de la mina Quellaveco de Anglo American en Moquegua. Los ingresos fiscales por canon minero y regalías se proyectan en S/ 12,400 millones para el año, un incremento del 68% frente a 2025.

El consumo privado, que creció apenas 1.8% en 2025 por el impacto del conflicto en Ormuz sobre los precios de combustibles, se proyecta en +2.9% para 2026 apoyado en la moderación de la inflación (proyectada en 2.6% al cierre del año), la recuperación del empleo formal y el inicio del ciclo de flexibilización monetaria del BCRP. El crédito al sector privado creció 6.8% anual a marzo.

La inversión pública, que cayó 3.1% en el Q1 por rezagos en la ejecución presupuestal, se proyecta que se acelerará en el segundo semestre con la puesta en marcha de proyectos de reconstrucción en el norte y obras de infraestructura vial en las regiones.`,
    analisis: `La revisión al alza del MEF refleja que el ciclo económico peruano está en una fase positiva, impulsada por un sector externo excepcional. Esto tiene implicaciones para el tipo de cambio: más crecimiento implica más importaciones, lo que modera la apreciación del sol. Simultáneamente, los mayores ingresos fiscales por minería dan al gobierno más espacio para política fiscal expansiva sin necesidad de endeudarse en dólares.

Para empresas que operan en Perú, el escenario de crecimiento de 3.5% es moderadamente positivo para la demanda interna. Sin embargo, el crecimiento sigue siendo más concentrado en minería que en consumo masivo. Quienes atienden mercados vinculados al sector minero (equipos, logística, servicios) tendrán un año favorable; quienes dependen del consumo urbano verán una recuperación más gradual.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7054380/pexels-photo-7054380.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'Producción minera peruana marca récord en Q1 2026: cobre +8.1%, oro +12.3% — sector genera el 74% de las exportaciones totales del país',
    descripcion: 'El Ministerio de Energía y Minas confirmó niveles de producción minera históricos en el Q1 2026. El cobre alcanzó 702,415 toneladas métricas finas, el oro llegó a 43.8 toneladas y la plata a 1,074 toneladas, todos máximos trimestrales para Perú.',
    contenido: `El Ministerio de Energía y Minas reportó este martes que la producción minera peruana alcanzó niveles históricos en el primer trimestre de 2026. El cobre totalizó 702,415 toneladas métricas finas (TMF), un incremento del 8.1% respecto al Q1 2025, mientras que el oro llegó a 43.8 toneladas (+12.3%) y la plata a 1,074 toneladas (+9.4%). El zinc creció 6.7% hasta 307,820 TMF y el plomo un 4.2%.

El desempeño excepcional del cobre refleja la combinación de nuevas expansiones de capacidad, el pleno funcionamiento de Quellaveco (Anglo American) tras superar problemas operativos en 2025, y la mejora en la ley del mineral en yacimientos de Apurímac y Arequipa. Las Bambas recuperó producción tras resolver disputas comunitarias en el Q4 2025, operando ahora a 115% de su capacidad nominal.

El sector minero ya representa el 74% del total de exportaciones peruanas, comparado con el 68% en 2022. Los departamentos de Apurímac, Arequipa, Cajamarca y Áncash concentran el 71% de la producción minera nacional. Los ingresos fiscales por canon minero y regalías en el Q1 2026 totalizaron S/ 3,120 millones, un incremento del 78% frente al Q1 2025.

Los gobiernos regionales de Apurímac (S/ 612M) y Arequipa (S/ 487M) fueron los principales receptores de canon, con el dinero destinado a obras de infraestructura y servicios públicos. Esta redistribución fiscal fortalece la demanda interna en las regiones mineras y contribuye al crecimiento económico descentralizado.`,
    analisis: `La producción minera récord consolida el superávit comercial y fortalece las finanzas públicas mediante canon y regalías. Para el tipo de cambio, más exportaciones mineras implican mayor oferta estructural de dólares en el mercado local, creando un soporte fundamental para la apreciación del sol independiente de los movimientos del DXY o las decisiones de la Fed.

La concentración del 74% de exportaciones en minería también implica vulnerabilidad ante caídas de precios. Diversificar portafolios entre activos en soles y dólares, con horizonte de al menos 6 meses, sigue siendo la estrategia más prudente. Si tienes ingresos ligados al sector minero (ya sea como proveedor o trabajador), considera que el ciclo actual es excepcionalmente favorable pero no permanente.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29988955/pexels-photo-29988955.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Kevin Warsh ante primera reunión FOMC de junio: mercados asignan 45% de probabilidad a recorte pese a inflación en 4%',
    descripcion: 'La reunión del FOMC del 16-17 de junio será el primer gran test de Kevin Warsh como presidente de la Fed. Los mercados subieron la probabilidad de recorte al 45% tras la rebaja de Moody\'s, mientras analistas de Wall Street debaten si Warsh priorizará combatir la inflación o apoyar el crecimiento.',
    contenido: `La primera reunión del FOMC bajo la presidencia de Kevin Warsh, programada para el 16 y 17 de junio, se perfila como el evento de política monetaria más importante del primer semestre de 2026. Los mercados de futuros de fondos federales asignan actualmente un 45% de probabilidad a un recorte de 25 puntos básicos en esa reunión, frente al 22% de hace dos semanas, impulsados por la caída del DXY tras la rebaja de Moody's y las expectativas de que la Fed quiera apuntalar el crecimiento ante el shock de confianza.

Warsh enfrenta un dilema clásico de política monetaria. Por un lado, la inflación PCE se ubica en 3.8% anual en abril, muy por encima del objetivo del 2%, impulsada por los precios de energía vinculados al Estrecho de Ormuz. Por otro lado, el mercado laboral muestra primeras señales de enfriamiento, con el desempleo subiendo de 4.1% a 4.3% en abril y las solicitudes iniciales de desempleo en 248,000, el nivel más alto desde febrero de 2025.

Los economistas de JPMorgan y Goldman Sachs estiman que Warsh mantendrá tasas en el rango 3.50%-3.75% en junio para preservar credibilidad antiinflacionaria. Sin embargo, ambas firmas anticipan un recorte en septiembre si el PCE muestra moderación en mayo y junio. La postura de Warsh ante las presiones del presidente Trump —que ha pedido públicamente recortes "inmediatos"— será un factor determinante para la credibilidad de la Fed.

Los discursos de Warsh programados para el 23 y 28 de mayo serán clave. Su intervención ante el Club Económico de Nueva York el jueves 23 es esperada con particular atención por los mercados de tasas y divisas.`,
    analisis: `La incertidumbre en torno a la Fed de Warsh mantiene el escenario cambiario en un equilibrio delicado. Si Warsh sorprende recortando en junio, el DXY podría caer hacia 98-99 y el sol apreciarse a S/ 3.35-3.38. Si mantiene tasas y suena hawkish, el DXY rebotaría hacia 103-104 y el PEN/USD volvería hacia S/ 3.55-3.60. El rango amplio de posibles escenarios justifica cautela en decisiones cambiarias grandes para el mes de junio.

Para quienes operan con dólares de forma regular, considerar cerrar posiciones abiertas importantes antes del 16 de junio. El evento FOMC June será de alta volatilidad cambiaria, con movimientos potenciales de S/ 0.10-0.15 en una sola sesión. Si tienes pagos programados en dólares en junio, adelantarlos antes del 16 reduce la incertidumbre.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6534073/pexels-photo-6534073.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'China: importaciones de materias primas caen 3.8% en abril — PMI manufacturero en 49.8 confirma primer contracción desde agosto 2025',
    descripcion: 'El Ministerio de Comercio de China reportó una caída del 3.8% en las importaciones totales de abril 2026. El cobre registró un descenso del 5.2% en volumen, mientras que el petróleo crudo se redujo un 4.7%. El PMI manufacturero oficial cayó a 49.8, primera contracción desde agosto de 2025.',
    contenido: `El Ministerio de Comercio de China publicó este lunes los datos de comercio exterior de abril 2026, mostrando una caída del 3.8% en las importaciones totales respecto al mismo mes del año anterior. En términos de volumen, las importaciones de cobre cayeron 5.2% hasta 1,840,000 toneladas, mientras que las de petróleo crudo disminuyeron 4.7% a 11.2 millones de barriles diarios. La soja cayó 8.3% y el mineral de hierro un 3.1%.

La desaceleración de las importaciones refleja el enfriamiento de la actividad manufacturera china. El índice PMI manufacturero oficial cayó a 49.8 en abril, primera lectura de contracción desde agosto de 2025. Los subsíndices de nuevos pedidos y producción fueron los de mayor debilidad, afectados por la incertidumbre en torno a las negociaciones comerciales con EE.UU. y el encarecimiento de la energía por el conflicto en Ormuz.

El conflicto en el Estrecho de Ormuz impacta especialmente a China, que importa aproximadamente el 40% de su petróleo a través de esa ruta. El país ha respondido aumentando sus compras a Rusia y Arabia Saudita —que pueden usar rutas alternativas— e incrementando las importaciones de petróleo iraní a través de pagos en yuan. Sin embargo, el mayor costo energético comprime los márgenes de las industrias intensivas en energía.

El comercio bilateral China-Perú mostró resiliencia relativa: las exportaciones peruanas a China cayeron apenas 1.2% en valor pero crecieron 2.4% en volumen, gracias al rally de precios del cobre. Las importaciones peruanas desde China cayeron 6.8%, reflejando la apreciación del sol y la moderación de la demanda interna.`,
    analisis: `La desaceleración de China es el principal riesgo bajista para los precios del cobre en el mediano plazo. China consume aproximadamente el 55% del cobre mundial, por lo que cualquier moderación sostenida de su demanda afectaría los precios y, por extensión, las exportaciones y el tipo de cambio peruano. Sin embargo, los analistas señalan que la debilidad de abril es en parte estacional y técnica, no estructural.

Para Perú, el riesgo chino es mitigado parcialmente porque la demanda de cobre para infraestructura de IA —mayormente estadounidense y europea— está compensando el enfriamiento de la manufactura china tradicional. Si el PMI chino no se recupera por encima de 50 en mayo y junio, podría iniciarse una corrección en el cobre hacia US$ 12,500-13,000/TM que presionaría moderadamente el tipo de cambio hacia S/ 3.50-3.55.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28806603/pexels-photo-28806603.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'Petróleo Brent se consolida en US$ 99/barril — IEA alerta que reservas estratégicas globales en mínimos desde 2022 y riesgo de pico en verano boreal',
    descripcion: 'La Agencia Internacional de Energía advirtió que las reservas estratégicas de la OCDE están en 2,480 millones de barriles, el nivel más bajo desde septiembre de 2022. Con el Estrecho de Ormuz parcialmente cerrado y la demanda de verano aproximándose, el riesgo de un pico de precio hacia US$ 115-120/barril en julio-agosto es "no despreciable".',
    contenido: `La Agencia Internacional de Energía publicó su Informe Mensual del Petróleo de mayo 2026, elevando la alerta sobre la situación de las reservas globales. Las reservas comerciales y estratégicas de los países de la OCDE suman 2,480 millones de barriles, equivalentes a 56 días de consumo, el nivel más bajo desde septiembre de 2022.

El Estrecho de Ormuz, que canaliza aproximadamente el 20% del comercio global de petróleo y el 30% del gas natural licuado, permanece operativo a capacidad reducida desde mediados de marzo, cuando las tensiones entre Irán y la coalición EE.UU.-Israel llevaron al cierre parcial de la vía marítima. Los grandes cargueros evitan la zona y navegan rutas alternativas que agregan 7-12 días al tiempo de tránsito, encareciendo los fletes y reduciendo la oferta efectiva disponible.

La OPEP+ mantiene sus recortes de producción vigentes hasta junio, con Arabia Saudita produciendo 9.0 millones de barriles diarios, por debajo de su capacidad de 12 millones. Riad señaló que "monitorea los mercados" pero no anunció aumentos de producción, lo que el mercado interpreta como disposición a mantener precios elevados. El Brent cotiza en US$ 99.8/barril, tras máximos de US$ 105 a principios de mayo.

La IEA advierte que la demanda de verano boreal —típicamente el pico de consumo en el hemisferio norte— podría coincidir con una oferta reducida si el Estrecho de Ormuz no se normaliza, generando presión adicional. El escenario base proyecta Brent entre US$ 95-105 para el Q2, pero el escenario de riesgo alcista contempla US$ 115-120 en julio-agosto.`,
    analisis: `El petróleo caro es uno de los principales factores que complican la reducción de la inflación global y, por ende, los recortes de tasas de la Fed. En Perú, el impacto es mixto: los combustibles y el gas doméstico se encarecen, presionando la inflación interna; pero las mayores exportaciones mineras compensan con creces el impacto en la balanza comercial.

Para el tipo de cambio, el canal principal es indirecto: petróleo caro implica inflación alta en EE.UU., lo que restringe los recortes de la Fed y mantiene el DXY elevado, presionando el PEN/USD al alza. Si el Brent escala hacia US$ 115+ en el verano boreal, el escenario de recorte de la Fed en septiembre se aleja y el DXY podría recuperar el nivel 103-105, empujando el PEN/USD de regreso hacia S/ 3.55-3.65.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10020724/pexels-photo-10020724.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'PEN/USD en S/ 3.43 — mínimo histórico del año; DXY cae a 100.2 y flujos de portafolio hacia emergentes aceleran la apreciación del sol',
    descripcion: 'El dólar cerró este miércoles en S/ 3.43 en el mercado interbancario peruano, su cotización más baja desde diciembre de 2022. La apreciación del sol acumula 4.7% en lo que va del año, impulsada por la debilidad del DXY post Moody\'s, el superávit comercial récord y el inicio del ciclo de recortes del BCRP.',
    contenido: `El tipo de cambio PEN/USD cerró este miércoles en S/ 3.43 en el mercado cambiario interbancario de Lima, marcando el nivel más bajo del año y el menor desde diciembre de 2022. La apreciación acumula 4.7% desde el cierre de 2025 (S/ 3.595) y 6.1% desde el máximo de S/ 3.65 registrado en febrero durante las tensiones iniciales del conflicto en Ormuz.

Los factores que impulsan la fortaleza del sol son múltiples y simultáneos. El primero y más reciente es la debilidad del DXY, que cayó a 100.2 puntos tras la rebaja de Moody's, generando un rally generalizado en divisas emergentes. El segundo es el superávit comercial récord: con exportaciones mineras creciendo 53%, el mercado cambiario está inundado de dólares que exportadores convierten a soles para pagar planillas y costos locales. El tercero es el inicio del ciclo de recortes del BCRP, que reduce el diferencial de tasas con EE.UU. sin generar salidas de capital por los sólidos fundamentos del país.

El volumen negociado en el mercado cambiario interbancario fue de USD 1,840 millones este miércoles, por encima del promedio diario de USD 1,200 millones, reflejando la mayor actividad de compradores institucionales y exportadores convirtiendo sus ingresos. El BCRP compró aproximadamente USD 120 millones para suavizar la apreciación y acumular reservas.

El mercado de opciones cambiarias muestra que los grandes importadores están aprovechando el tipo bajo para cubrirse a 30, 60 y 90 días. El diferencial bid-ask en el mercado spot se mantuvo estrecho en S/ 0.003, indicando liquidez adecuada.`,
    analisis: `El nivel de S/ 3.43 es el más favorable que han tenido los importadores y deudores en dólares en los últimos tres años. Si eres importador de bienes, este es el momento para adelantar compras de dólares para los próximos 60-90 días; los fundamentos sugieren que el tipo podría mantenerse en S/ 3.38-3.50, pero eventos externos como una escalada en Ormuz podrían revertir la tendencia.

Para quienes tienen ingresos en soles y gastos en dólares (viajes, matrículas internacionales, plataformas digitales), el momento es ideal para comprar los dólares que necesitarás en los próximos meses. El 80% de los analistas sondeados por Reuters proyectan que el PEN/USD se mantendrá por encima de S/ 3.38 durante el segundo semestre, descartando un rally del sol más allá de ese nivel.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386474/pexels-photo-4386474.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'Bitcoin consolida en US$ 103,200 — correlación inversa con DXY en máximos; analistas apuntan a zona de US$ 110,000 en junio',
    descripcion: 'Bitcoin cotiza en US$ 103,200 este miércoles, subiendo 8.4% en la semana impulsado por la debilidad del DXY post Moody\'s. La correlación inversa BTC/DXY alcanzó -0.73 en mayo, su nivel más negativo desde enero de 2024, reforzando el papel de Bitcoin como activo refugio anti-dólar.',
    contenido: `Bitcoin cotizó en US$ 103,200 al cierre del mercado neoyorquino de este miércoles, registrando una ganancia del 8.4% en la semana y del 34% en lo que va del año 2026. La criptomoneda se beneficia directamente del debilitamiento del DXY: la correlación inversa entre Bitcoin y el índice del dólar alcanzó -0.73 en mayo, la más negativa desde enero de 2024, confirmando que los inversores están usando BTC como cobertura ante la erosión del poder adquisitivo del dólar.

El catalizador inmediato fue la rebaja de Moody's a la deuda soberana de EE.UU., que generó un debate sobre la fiabilidad del dólar como reserva de valor. Michael Saylor, fundador de MicroStrategy —que posee 214,000 BTC en su balance— publicó en X: "Moody's acaba de confirmar lo que Bitcoin ya sabía: la deuda soberana en dólares no es riesgo cero." El comentario fue el más compartido del día en redes financieras globales.

Los ETFs de Bitcoin al contado en EE.UU. registraron entradas netas de USD 1,240 millones en las últimas cinco sesiones, el mayor flujo semanal desde los primeros días del ETF de BlackRock. El open interest en futuros de CME alcanzó USD 28,400 millones, máximo histórico, indicando que la participación institucional sigue creciendo.

Técnicamente, Bitcoin superó la resistencia clave de US$ 98,500 el pasado lunes y los analistas de TradingView apuntan al rango US$ 110,000-115,000 como siguiente objetivo, coincidente con el máximo histórico de noviembre de 2025. Un cierre semanal por encima de US$ 105,000 activaría señales de continuación alcista.`,
    analisis: `Bitcoin en US$ 103,000 ofrece un paralelo interesante con el tipo de cambio PEN/USD: ambos se mueven en dirección contraria al DXY. Para inversores peruanos, el BTC apreciado en dólares sumado al sol apreciado frente al dólar crea un efecto multiplicador: quien compró BTC en soles hace 6 meses tiene ahora ganancias tanto por el alza del BTC como por la caída del dólar.

Sin embargo, este paralelo también implica el mismo riesgo de reversión: si el DXY rebota, tanto el BTC como el sol se debilitarán simultáneamente. Para quienes tienen exposición a BTC en Perú, considerar convertir parte de las ganancias a soles o dólares físicos aprovechando la actual fortaleza de ambos mercados.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'Cobre retrocede 1.4% a US$ 13,780/TM — toma de ganancias tras máximos históricos; soporte técnico clave en US$ 13,400 con PMI chino en contracción',
    descripcion: 'El cobre en el LME cayó 1.4% este miércoles a US$ 13,780/TM, interrumpiendo su racha alcista de ocho sesiones. La corrección técnica se da en el contexto del PMI manufacturero chino en 49.8 y la toma de beneficios de fondos que compraron en los máximos del lunes en US$ 14,215.',
    contenido: `El cobre en el LME retrocedió US$ 196 por tonelada métrica este miércoles, cerrando en US$ 13,780/TM tras tocar el lunes un máximo histórico de US$ 14,215. La corrección del 1.4% corresponde principalmente a profit-taking de fondos que habían acumulado posiciones largas durante la racha alcista de ocho sesiones. El metal acumula un alza del 38.9% en los últimos 12 meses.

El detonante técnico fue el dato del PMI manufacturero chino de abril en 49.8, primera lectura de contracción desde agosto de 2025. Dado que China consume el 55% del cobre mundial, cualquier señal de enfriamiento de su industria genera ventas en el mercado de futuros. Sin embargo, los analistas de metales de Barclays y Deutsche Bank señalan que el retroceso es correctivo y no altera el ciclo alcista estructural.

Los fundamentos de largo plazo permanecen sólidos. La demanda de cobre para cables de transmisión eléctrica, vehículos eléctricos e infraestructura de IA (estimada en 2.8 millones de TM adicionales para 2028) crea un déficit de oferta estructural. La producción minera global crece apenas 2-3% anual, muy por debajo de las proyecciones de demanda del 4-6% anual. BHP y Rio Tinto han advertido que los tiempos de desarrollo de nuevos proyectos son de 8-12 años.

El soporte técnico inmediato para el cobre se ubica en US$ 13,400/TM, donde coinciden la media móvil de 20 días y un nivel de consolidación previo al último rally. Una caída por debajo abriría la puerta a US$ 12,800-13,000. La resistencia superior está en los máximos históricos de US$ 14,215.`,
    analisis: `La corrección del cobre de 1.4% tiene impacto limitado en el tipo de cambio en el corto plazo: las exportaciones peruanas del trimestre ya están realizadas a precios más altos. Sin embargo, si la debilidad del PMI chino se confirma en los datos de mayo, el escenario de corrección hacia US$ 12,800-13,000 se haría más probable, lo que eventualmente presionaría los ingresos de exportación del Q2 y el tipo de cambio.

Para empresas mineras y sus cadenas de proveedores, la corrección técnica actual no justifica cambios en planes de inversión o presupuestos. Los analistas de consenso mantienen proyecciones de cobre en US$ 13,000-14,500/TM para 2026, muy por encima del costo de producción promedio de US$ 7,500-8,500 en Perú y Chile. Los márgenes siguen siendo excepcionales.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3721272/pexels-photo-3721272.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina: BCRA sube tasa de referencia 300 pbs a 42% para contener presiones sobre el dólar oficial que llega a $1,428',
    descripcion: 'El Banco Central de Argentina elevó su tasa de política monetaria de 39% a 42% en una reunión de emergencia convocada para esta tarde, respondiendo a presiones sobre el tipo de cambio oficial que alcanzó $1,428 por dólar. Las reservas del BCRA cayeron USD 1,240 millones en la semana.',
    contenido: `El Banco Central de la República Argentina convocó una reunión de emergencia este miércoles y decidió elevar la tasa de interés de política monetaria en 300 puntos básicos, pasando de 39% a 42% anual efectivo. La medida responde a la aceleración de las presiones cambiarias: el dólar oficial subió desde $1,412 a $1,428 en los últimos tres días hábiles, mientras que el dólar MEP alcanzó $1,458 y el contado con liquidación llegó a $1,482, con una brecha del 3.8% respecto al oficial.

Las reservas brutas del BCRA cayeron USD 1,240 millones en la semana, principalmente por pagos de deuda externa y compras de empresas para giro de dividendos al exterior. Las reservas netas se estiman en USD 4,200 millones positivos, un nivel que el mercado considera ajustado. El FMI desembolsó el cuarto tramo de su programa (USD 2,100 millones) el 28 de abril y monitorea el cumplimiento de las metas de reservas.

El gobierno de Milei insistió en que el alza de tasa es "temporal y preventiva" y reiteró el compromiso con el sendero de convergencia del tipo de cambio nominal hacia la meta de inflación del 30.5% proyectada para 2026. La inflación acumulada en los primeros cuatro meses del año llegó a 9.4%.

Los analistas de Portfolio Personal Inversiones señalan que el movimiento de tasas es insuficiente para contener las presiones si no se acompaña de nuevos ingresos de divisas, ya sea por exportaciones del agro (retrasadas por el clima adverso) o desembolso adicional del FMI.`,
    analisis: `La situación argentina tiene impacto limitado pero real sobre Perú. El principal canal es la confianza regional: si Argentina enfrenta una crisis cambiaria severa, los inversores internacionales pueden reducir su exposición a toda América Latina, incluyendo Perú, lo que presionaría los flujos de portafolio y el tipo de cambio. Sin embargo, los fundamentos de Perú son radicalmente distintos a los de Argentina: superávit comercial, reservas de 22 meses de importaciones, inflación en el rango meta y deuda pública manejable.

Para empresas que hacen negocios con Argentina, el tipo de cambio oficial en $1,428 y la brecha con el MEP/CCL generan complejidades operativas y de pricing. El riesgo de una devaluación adicional del oficial antes de fin de año es real; contemplar descuentos por riesgo cambiario en contratos con contrapartes argentinas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34437872/pexels-photo-34437872.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Chile: Codelco y SQM reportan producción de 412,000 TM de cobre en Q1 2026 — exportaciones del sector superan USD 3,200M en abril',
    descripcion: 'Codelco y SQM publicaron sus resultados del Q1 2026, reportando producción conjunta de 412,000 toneladas métricas de cobre. Las exportaciones chilenas de cobre alcanzaron USD 3,240 millones en abril, impulsadas por el precio récord del metal y el aumento de la capacidad productiva tras años de subinversión.',
    contenido: `Codelco y SQM publicaron sus resultados del primer trimestre de 2026, ofreciendo una perspectiva del sector minero chileno. Codelco reportó producción de 326,814 toneladas métricas de cobre en el Q1, un incremento del 3.4% frente al Q1 2025, tras superar los problemas geológicos que afectaron a la División Teniente el año anterior. SQM, que además de cobre produce litio y yodo, reportó 85,200 TM de cobre equivalente.

Las exportaciones chilenas de cobre totalizaron USD 3,240 millones en abril 2026, según el Banco Central de Chile, un incremento del 58% respecto a abril 2025. El alza refleja principalmente el efecto precio: el cobre promedio en el LME en abril fue de US$ 13,850/TM vs. US$ 8,760/TM un año antes. El volumen de exportaciones creció apenas 2.1%, mostrando que la bonanza es mayoritariamente precio y no volumen.

Chile mantiene una participación del 25% en la producción global de cobre, frente al 10.8% de Perú. Sin embargo, la producción chilena viene cayendo estructuralmente desde su pico de 5.4 millones de TM anuales en 2004; en 2026 se proyecta producir 5.1 millones. La ley del mineral ha caído un 38% en 20 años, encareciendo los costos de producción.

El gobierno del presidente Boric anunció una iniciativa para reducir los tiempos de aprobación ambiental de proyectos mineros de 48 a 24 meses. La medida busca retener inversiones que podrían derivarse hacia Perú, Australia o República Democrática del Congo ante los largos plazos regulatorios chilenos.`,
    analisis: `La producción récord de Chile, combinada con la peruana, mantiene el flujo global de cobre hacia los mercados. Que ambos países estén en máximos de exportaciones simultáneamente es en parte lo que modera el cobre por debajo de US$ 15,000/TM a pesar de la fuerte demanda. Para Perú, la competencia de Chile en mercados asiáticos es relevante pero manejable dado que los yacimientos peruanos tienen costos similares o menores.

Para inversores en empresas peruanas del sector minero, el paralelo con Chile refuerza la tesis de que el ciclo alcista del cobre tiene años de duración. Sobreponderar activos ligados al sector minero peruano en los próximos 24-36 meses sigue siendo una posición fundamentalmente sólida, aunque con volatilidad de corto plazo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2017747/pexels-photo-2017747.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Brasil: Banco Central mantiene Selic en 13.25% ante inflación persistente de 5.1% — real cae a 5.52 pese a debilidad global del DXY',
    descripcion: 'El COPOM de Brasil decidió por unanimidad mantener la tasa Selic en 13.25% anual, señalando que la inflación en 5.1% permanece por encima del techo de la meta del 4.5%. El real cayó a 5.52 por dólar, depreciándose frente a la tendencia regional impulsada por el déficit fiscal y presiones políticas sobre el banco central.',
    contenido: `El Comité de Política Monetaria de Brasil (COPOM) votó por unanimidad mantener la tasa básica de interés (Selic) en 13.25% anual en su reunión de este miércoles, la tercera reunión consecutiva sin cambios. El comunicado del Banco Central señaló que "el proceso de desinflación avanza pero a un ritmo insuficiente", con la inflación interanual del IPCA en 5.1% a abril, más de medio punto por encima del techo de la meta del 4.5%.

Brasil presenta la situación inversa a Perú: mientras el sol se aprecia por el boom exportador minero y la solidez fiscal, el real se deprecia pese al DXY débil. Los factores internos explican esta divergencia: el déficit fiscal primario de Brasil alcanza el 2.8% del PBI, el Congreso rechazó la reforma fiscal enviada por Lula en marzo, y el mercado descuenta riesgo de mayor endeudamiento. El real cayó de 5.38 a 5.52 por dólar en la semana, la mayor caída entre las divisas emergentes latinoamericanas.

El PIB de Brasil creció apenas 1.7% en Q1 2026, por debajo de las expectativas del 2.1%, con el consumo privado desacelerado por las altas tasas de interés y el crédito caro. La tasa Selic de 13.25% es la más alta de América Latina y una de las más elevadas del mundo en términos reales. La expectativa del mercado es que el primer recorte de la Selic no llegará antes de septiembre-octubre 2026.

El presidente Lula criticó públicamente al Banco Central por "mantener tasas abusivas que frenan el empleo", una declaración que generó preocupaciones adicionales sobre la independencia de la institución y contribuyó a la caída del real. El gobernador del BCB, Gabriel Galípolo, reafirmó el compromiso con el objetivo de inflación.`,
    analisis: `Brasil es el contrapunto latinoamericano perfecto al caso peruano: misma región, dinámicas radicalmente distintas. Mientras el sol se aprecia por fundamentos sólidos, el real se deprecia por déficit fiscal y presiones políticas sobre el banco central. Esta divergencia es instructiva: la solidez institucional y fiscal de Perú —BCRP independiente, regla fiscal en cumplimiento, superávit comercial— es la que permite que el sol se beneficie del entorno global favorable.

Para empresas peruanas que compiten con productos brasileños o que tienen proveedores en Brasil, la depreciación del real crea una presión competitiva: los productos brasileños se abaratan en dólares, lo que puede generar sustitución de importaciones. Monitorear la evolución del BRL en los próximos 90 días es relevante para sectores como textil, manufacturas y agroindustria donde Brasil es competidor o proveedor.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/11678630/pexels-photo-11678630.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g001',
    titulo: 'Actas del FOMC de mayo revelan que 8 de 12 gobernadores respaldan recorte de tasas en septiembre',
    descripcion: 'La Reserva Federal publicó las minutas de su reunión del 6-7 de mayo, mostrando un amplio consenso hacia un primer recorte de tasas en septiembre si la inflación continúa moderándose. El dólar retrocedió frente a todas las divisas emergentes tras la publicación.',
    contenido: `La Reserva Federal publicó este lunes las actas de su última reunión del Comité Federal de Mercado Abierto (FOMC), celebrada el 6 y 7 de mayo. El documento reveló que 8 de los 12 miembros votantes consideran apropiado un primer recorte de 25 puntos básicos en la reunión de septiembre, siempre que los datos de inflación continúen moderándose hacia el objetivo del 2%.

Los cuatro miembros restantes se dividieron entre quienes prefieren esperar hasta diciembre para mayor certeza sobre el camino desinflacionario, y quienes argumentan que la economía puede soportar tasas más altas por más tiempo dado el mercado laboral robusto con desempleo en 4.1%. La tasa de fondos federales se mantiene actualmente en el rango de 4.25%-4.50%.

El presidente Kevin Warsh, quien tomó posesión el 16 de mayo, no participó de esta reunión pero sus primeras declaraciones públicas sugieren que respaldará el consenso existente dentro del FOMC antes de introducir cambios de rumbo. Los mercados de futuros de Fed Funds ahora asignan un 68% de probabilidad a un recorte en septiembre, frente al 54% previo a la publicación de las actas.

El rendimiento del bono del Tesoro a 10 años cayó 11 puntos básicos hasta 4.43% y el DXY retrocedió a 102.3 puntos, su nivel más bajo desde enero de 2026. El euro subió a 1.1340 y el yen japonés se apreció a 149.80 por dólar.`,
    analisis: `Las actas del FOMC son directamente alcistas para el sol peruano. Un recorte de la Fed en septiembre reduciría el diferencial de tasas entre EE.UU. y Perú, haciendo relativamente menos atractivos los activos en dólares y favoreciendo flujos hacia economías emergentes como la peruana. El BCRP mantendría margen para también recortar su tasa referencial sin presionar el tipo de cambio.

Si eres importador o tienes deudas en dólares, el escenario de Fed recortando en septiembre sugiere que el sol podría fortalecerse hacia S/ 3.58-3.60 en el segundo semestre. Considera adelantar compras de dólares que necesites para el tercer trimestre antes de que ese movimiento se materialice, ya que el mercado podría anticipar el fortalecimiento del sol con semanas de anticipación.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6590628/pexels-photo-6590628.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g002',
    titulo: 'BCRP recorta tasa referencial 25 pbs a 4.50% — primera reducción del año en señal de confianza en desinflación',
    descripcion: 'El Banco Central de Reserva del Perú redujo su tasa de interés de referencia de 4.75% a 4.50% en su sesión de directorio del 19 de mayo, citando la consolidación del proceso desinflacionario y la moderación de expectativas. Es el primer recorte de 2026 y el sexto en el ciclo iniciado en agosto de 2024.',
    contenido: `El Directorio del Banco Central de Reserva del Perú (BCRP) aprobó este lunes por unanimidad reducir la tasa de interés de referencia en 25 puntos básicos, pasando de 4.75% a 4.50%. La decisión se sustenta en la consolidación del proceso desinflacionario: la inflación interanual se ubica en 2.3% en abril, dentro del rango meta del BCRP (1%-3%), con expectativas de inflación para 2026 ancladas en 2.4%.

El comunicado del BCRP destacó que la actividad económica interna muestra una expansión sostenida con el PBI creciendo 3.2% en el primer trimestre, liderado por la minería (+8.1%), manufactura (+4.3%) y servicios (+3.6%). La demanda interna privada se recupera gradualmente con el crédito al sector privado creciendo 6.8% anual.

El presidente del BCRP, Julio Velarde, señaló en conferencia de prensa que el banco central evaluará los datos de las próximas semanas para definir el ritmo del ciclo de flexibilización monetaria. "No estamos comprometidos con un sendero de recortes predeterminado; actuamos en función de los datos", precisó. Los analistas del mercado anticipan dos recortes adicionales de 25 pbs cada uno antes de fin de año.

El tipo de cambio PEN/USD reaccionó con moderada apreciación del sol, cerrando en S/ 3.62, reflejando que el recorte ya estaba parcialmente descontado por el mercado.`,
    analisis: `Un BCRP recortando tasas en un contexto de inflación controlada y crecimiento sólido es la combinación ideal para el sol peruano. Reduce el costo del crédito doméstico sin generar presiones cambiarias, ya que el fundamento exportador —cobre en máximos, exportaciones creciendo— provee el contrapeso en la balanza de pagos.

Para quienes tienen exposición cambiaria, el recorte del BCRP abre la posibilidad de refinanciar deuda en soles a tasas más bajas. Si tienes créditos en dólares con tasa variable, evalúa migrar a soles si la brecha de tasas se ha reducido. El escenario base apunta a un sol estable a fuerte en S/ 3.60-3.65 durante el segundo semestre.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/11251720/pexels-photo-11251720.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g003',
    titulo: 'MEF revisa al alza proyección de crecimiento del PBI peruano a 3.4% para 2026 impulsado por inversión minera',
    descripcion: 'El Ministerio de Economía y Finanzas actualizó su Marco Macroeconómico Multianual, elevando la proyección de crecimiento del PBI de 3.0% a 3.4% para 2026. La revisión se sustenta en el dinamismo de la inversión privada minera, el alza del precio de los metales y la recuperación del consumo privado.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó hoy la actualización de su Marco Macroeconómico Multianual 2026-2029, en el cual eleva la proyección de crecimiento del Producto Bruto Interno peruano de 3.0% a 3.4% para el presente año. La revisión al alza responde principalmente al mejor desempeño del sector minero, cuya proyección de crecimiento se eleva de 5.2% a 8.7% ante los precios récord del cobre y el zinc.

La inversión privada total crecería 6.1% en 2026, con la inversión minera como principal motor. Proyectos como Quellaveco segunda fase, la ampliación de Las Bambas y el inicio de obras de Zafranal sumarian US$ 4,200 millones en inversión comprometida para el año. La inversión pública, por su parte, crecería 8.3% con énfasis en infraestructura de transportes y saneamiento.

El consumo privado se expandiría 3.8%, beneficiado por la mejora del empleo formal, el crecimiento del crédito de consumo al 7.2% y la reducción de la inflación que incrementa el poder adquisitivo real de los hogares. El sector de servicios, que representa el 52% del PBI, crecería 3.9% liderado por telecomunicaciones, finanzas y turismo.

El déficit fiscal proyectado se reduce a 2.1% del PBI en 2026, desde 2.4% en 2025, gracias al mayor recaudo tributario asociado al boom minero y la mejora de la actividad económica.`,
    analisis: `La revisión al alza del MEF refuerza el panorama positivo para el sol peruano. Un PBI creciendo a 3.4% con déficit fiscal decreciente proyecta solidez macroeconómica que atrae inversión extranjera y fortalece la moneda local. Los mayores ingresos fiscales por minería reducen la necesidad de endeudamiento externo en dólares, otro factor positivo para el tipo de cambio.

Para empresas con operaciones en Perú, este contexto de crecimiento sostenido justifica planificar en un escenario de sol estable o apreciándose moderadamente. Si tienes compromisos de pago en dólares en el segundo semestre, el tipo de cambio actual en S/ 3.62 puede representar una oportunidad de cobertura favorable.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4960438/pexels-photo-4960438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g004',
    titulo: 'Exportaciones peruanas crecen 18.3% en abril — minería aporta US$ 4,850 millones y sector textil repunta 11.2%',
    descripcion: 'SUNAT reportó que las exportaciones totales de Perú alcanzaron US$ 6,920 millones en abril de 2026, un incremento del 18.3% respecto al mismo mes del año anterior. La minería tradicional lideró con US$ 4,850 millones, mientras que las exportaciones no tradicionales sumaron US$ 1,380 millones.',
    contenido: `La Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT) publicó hoy las estadísticas de comercio exterior de abril de 2026, mostrando exportaciones totales por US$ 6,920 millones, un crecimiento del 18.3% respecto a los US$ 5,849 millones registrados en abril de 2025. Es el cuarto mes consecutivo de crecimiento de doble dígito en las exportaciones peruanas.

La minería tradicional aportó US$ 4,850 millones, impulsada por el cobre (US$ 2,940 millones, +24.1%), el oro (US$ 1,120 millones, +12.8%) y el zinc (US$ 490 millones, +18.6%). El precio promedio del cobre en abril fue de US$ 13,847/TM, un 38.2% superior al precio promedio de abril 2025. Los principales destinos de las exportaciones mineras fueron China (41%), Japón (12%) y Corea del Sur (9%).

Las exportaciones no tradicionales alcanzaron US$ 1,380 millones, con el sector textil y confecciones destacando con un crecimiento del 11.2% hasta US$ 210 millones, impulsado por mayor demanda desde EE.UU. y la Unión Europea. Las agroexportaciones sumaron US$ 680 millones (+7.4%), con los arándanos, uvas y espárragos como los principales productos.

El saldo comercial de abril fue positivo en US$ 2,140 millones, acumulando un superávit de US$ 7,820 millones en los primeros cuatro meses del año, el mayor registro histórico para el período enero-abril.`,
    analisis: `Un superávit comercial de US$ 2,140 millones mensual implica una entrada neta de dólares al sistema financiero peruano de esa magnitud, lo que crea una presión estructural alcista sobre el sol. Las empresas exportadoras deben liquidar sus dólares para pagar costos en soles, aumentando la oferta de moneda extranjera en el mercado cambiario local.

Este flujo exportador es el principal ancla del tipo de cambio en el rango S/ 3.60-3.65. Para importadores, el contexto sugiere que el sol tiene soporte fundamental para mantenerse en estos niveles o apreciarse modestamente. Si necesitas dólares para importaciones del tercer trimestre, el tipo de cambio actual ofrece niveles atractivos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g005',
    titulo: 'Reservas internacionales del BCRP alcanzan US$ 78,400 millones — equivalente a 18 meses de importaciones',
    descripcion: 'El Banco Central de Reserva reportó que las Reservas Internacionales Netas del Perú alcanzaron US$ 78,400 millones al 16 de mayo de 2026, un incremento de US$ 3,200 millones respecto al cierre de 2025. El ratio de reservas sobre importaciones es el más alto de América Latina.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) informó que las Reservas Internacionales Netas (RIN) del país alcanzaron US$ 78,400 millones al 16 de mayo de 2026, su nivel más alto desde agosto de 2024. El incremento de US$ 3,200 millones respecto al cierre de diciembre de 2025 (US$ 75,200 millones) refleja los mayores flujos de exportaciones mineras y la acumulación activa de reservas por parte del banco central.

Las reservas representan el 27.8% del PBI proyectado para 2026 y equivalen a 18.3 meses de importaciones de bienes y servicios, el ratio más alto de América del Sur, superando a Chile (14.2 meses), Colombia (11.8 meses) y Brasil (10.1 meses). Esta posición de reservas provee al BCRP una capacidad de intervención cambiaria extraordinariamente robusta para estabilizar el tipo de cambio en episodios de volatilidad externa.

La composición de las reservas incluye US$ 54,200 millones en moneda extranjera, US$ 14,800 millones en oro monetario y US$ 9,400 millones en DEG y posición en el FMI. El BCRP valúa su posición en oro a precios de mercado, que con el metal en US$ 3,318/oz representa una apreciación de US$ 2,100 millones respecto a la valoración de cierre de 2025.

El nivel de reservas otorga al BCRP capacidad para intervenir en el mercado cambiario hasta en US$ 15,000-20,000 millones sin comprometer los niveles mínimos de prudencia fiscal internacional.`,
    analisis: `Las reservas en US$ 78,400 millones son un factor de estabilidad cambiaria de primer orden. Le dan al BCRP una capacidad de intervención que ningún especulador o flujo de capital puede contrarrestar fácilmente, lo que explica por qué el sol peruano muestra menor volatilidad que el peso colombiano, el real brasileño o el peso chileno ante shocks externos.

Para cualquier decisión cambiaria en el corto y mediano plazo, este nivel de reservas es una señal de confianza. El BCRP puede y va a defender el tipo de cambio si este sale del rango que considera razonable. Evita apostar en contra del sol peruano: las municiones del banco central son formidables.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16055836/pexels-photo-16055836.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g006',
    titulo: 'Manufactura peruana crece 4.1% en el primer trimestre de 2026 — textil y alimentos lideran la recuperación',
    descripcion: 'El INEI reportó que el sector manufacturero peruano creció 4.1% en el primer trimestre de 2026, la tasa más alta desde el cuarto trimestre de 2023. La industria textil avanzó 6.8% y la industria de alimentos procesados 5.3%, beneficiadas por la recuperación del consumo interno y la mayor demanda externa.',
    contenido: `El Instituto Nacional de Estadística e Informática (INEI) publicó hoy los resultados del sector manufacturero para el primer trimestre de 2026, mostrando un crecimiento del 4.1% respecto al mismo período del año anterior. Es la tasa más alta de expansión manufacturera en diez trimestres y revierte la contracción del 1.2% registrada en el primer trimestre de 2025.

La manufactura no primaria —que excluye la refinación de minerales y la producción de harina de pescado— creció 5.2%, liderada por la industria textil y de confecciones (+6.8%), la industria de alimentos y bebidas (+5.3%) y la fabricación de productos metálicos (+4.1%). El crecimiento de la manufactura textil responde al incremento de exportaciones hacia EE.UU. bajo el TLC y la recuperación de la demanda interna de prendas de vestir.

La manufactura primaria creció 2.1%, con la refinación de cobre como principal contribuyente gracias a los mayores volúmenes procesados en las refinerías de Ilo y La Oroya. La producción de harina y aceite de pescado, sin embargo, cayó 8.4% por el inicio anticipado del período de veda en el litoral norte.

El empleo formal en el sector manufacturero creció 3.2% en el trimestre, con la creación de 24,000 puestos de trabajo formal en Lima Metropolitana y 18,000 en regiones.`,
    analisis: `La recuperación manufacturera peruana es un buen indicador adelantado del consumo interno y del dinamismo del mercado laboral. Un sector industrial creciendo al 4.1% implica mayor demanda de crédito empresarial en soles, salarios crecientes y mayor recaudo tributario —todos factores positivos para la estabilidad del tipo de cambio.

Para empresas del sector, el contexto de recuperación justifica planes de expansión financiados en soles a tasas decrecientes gracias al ciclo de recortes del BCRP. Si tu empresa tiene compromisos en dólares para importación de maquinaria o insumos, la fortaleza del sol en este contexto manufacturero favorable ofrece condiciones favorables para cubrir esas necesidades.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g007',
    titulo: 'China anuncia paquete de estímulo fiscal de US$ 200,000 millones para infraestructura y transición energética',
    descripcion: 'El gobierno chino anunció este lunes un paquete de estímulo fiscal por 1.45 billones de yuanes (US$ 200,000 millones) orientado a infraestructura de transportes, redes eléctricas y energías renovables. El anuncio impulsó los precios del cobre, aluminio y acero en los mercados internacionales.',
    contenido: `El Consejo de Estado de la República Popular China anunció este lunes un paquete de estímulo fiscal por 1.45 billones de yuanes (aproximadamente US$ 200,000 millones) para ser ejecutado en el segundo semestre de 2026. El programa se enfoca en tres áreas prioritarias: infraestructura de transportes (US$ 74,000 millones), modernización de redes eléctricas y energías renovables (US$ 82,000 millones) y desarrollo urbano en ciudades de segundo y tercer nivel (US$ 44,000 millones).

El anuncio responde a la moderación del crecimiento económico chino en el primer trimestre, con el PBI expandiéndose al 4.6% anual, por debajo del objetivo oficial del 5%. El premier Li Qiang presentó el plan como un mecanismo de estabilización anticíclica para garantizar el cumplimiento de la meta anual de crecimiento.

El impacto en commodities fue inmediato: el cobre en el LME subió 2.8% hasta US$ 14,587/TM, el aluminio avanzó 1.9% hasta US$ 2,890/TM y el zinc subió 2.4% hasta US$ 3,210/TM. China consume el 53% del cobre mundial, el 57% del aluminio y el 44% del zinc, por lo que cualquier estímulo a su demanda interna de infraestructura tiene un efecto multiplicador directo sobre los precios globales de metales.

Los analistas de Goldman Sachs elevaron su objetivo de precio para el cobre a US$ 15,500/TM para el segundo semestre de 2026, argumentando que el estímulo chino llega en un momento de inventarios bajos en almacenes del LME y COMEX.`,
    analisis: `El estímulo chino es una noticia extraordinariamente buena para Perú y para el sol peruano. China es el principal destino de las exportaciones peruanas de cobre y zinc, por lo que mayor gasto en infraestructura chino se traduce directamente en mayor demanda y mayores precios de los metales que Perú exporta. Cada 1% de aumento en el precio del cobre genera aproximadamente US$ 200-250 millones adicionales de ingresos para el Perú anualmente.

El impacto cambiario es claro: más ingresos de exportación de cobre = más dólares en el mercado cambiario peruano = mayor presión apreciadora sobre el sol. Este factor, combinado con el recorte de tasas del BCRP anunciado hoy, crea un entorno muy favorable para el sol peruano en los próximos meses.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7883869/pexels-photo-7883869.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g008',
    titulo: 'Petróleo WTI sube a US$ 84.20 por barril tras caída de inventarios en EE.UU. y reducción de producción OPEP+',
    descripcion: 'El contrato de futuros del petróleo WTI para entrega en julio cerró en US$ 84.20 por barril, un alza del 2.3% en la sesión, impulsado por una caída de inventarios en EE.UU. mayor a la esperada y la confirmación de que Arabia Saudita mantendrá los recortes voluntarios de producción.',
    contenido: `El petróleo crudo WTI para entrega en julio cerró este lunes en US$ 84.20 por barril en el NYMEX, su nivel más alto en tres semanas, tras avanzar 2.3% en la sesión. El Brent, referencia global, se situó en US$ 87.40 por barril (+2.1%). El catalizador principal fue el reporte semanal de inventarios de la Administración de Información de Energía (EIA) de EE.UU., que mostró una caída de 7.2 millones de barriles la semana pasada, muy por encima de la expectativa consenso de -2.1 millones.

El ministro de energía saudí, el príncipe Abdulaziz bin Salman, confirmó el domingo que Arabia Saudita mantendrá sus recortes voluntarios de producción de 1 millón de barriles diarios hasta por lo menos septiembre de 2026, descartando rumores de mercado sobre un posible retroceso en esa posición. La decisión fue interpretada como una señal de compromiso de Riad con mantener los precios por encima de US$ 80/barril.

La demanda global de crudo sigue mostrando resiliencia: la Agencia Internacional de Energía (AIE) revisó al alza su estimado de demanda para 2026 en 200,000 barriles diarios, hasta 104.2 millones de b/d, liderado por la demanda china (+1.8 mb/d) y la de India (+0.9 mb/d). La demanda de combustible de aviación en Asia supera ya en un 12% los niveles prepandemia.

El soporte técnico del WTI se ubica en US$ 81.50 (media de 50 días) y la resistencia inmediata en US$ 86.00, nivel que de romperse proyectaría un objetivo hacia US$ 90/barril.`,
    analisis: `El petróleo en US$ 84 tiene un efecto moderadamente negativo para Perú, que es importador neto de crudo para consumo interno, aunque las exportaciones de gas natural y petróleo crudo de la selva generan cierta compensación. El mayor costo de combustibles presiona la inflación de transporte y los costos logísticos de las empresas, factores que el BCRP monitorea en su función de reacción.

Para el tipo de cambio, el petróleo alto es un factor mixto: encarece la factura de importación (negativo para el balance externo) pero también eleva los precios de exportación de gas y crudo peruano (positivo). El efecto neto para el PEN/USD es moderado, con mayor influencia del precio del cobre y las tasas de interés globales.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g009',
    titulo: 'Oro retrocede a US$ 3,318/oz por toma de ganancias — analistas mantienen objetivo de US$ 3,600 para fin de año',
    descripcion: 'El oro al contado cedió 1.4% hasta US$ 3,318 por onza troy en la sesión del lunes, en una corrección técnica después de haber tocado máximos de US$ 3,487 la semana pasada. Analistas de Citi y UBS recomiendan usar las correcciones como oportunidad de posicionamiento.',
    contenido: `El oro al contado retrocedió 1.4% este lunes hasta US$ 3,318 por onza troy, mientras que el contrato de futuros de junio en el COMEX cerró en US$ 3,332/oz (-1.3%). La corrección se produce tras el máximo histórico de US$ 3,487/oz alcanzado el jueves pasado y corresponde a una toma de ganancias técnica anticipada por los analistas, dado que el indicador de fuerza relativa (RSI) había alcanzado 78 puntos, territorio de sobrecompra.

Los factores estructurales que sostienen el precio del oro permanecen intactos: la demanda de bancos centrales emergentes se mantiene en niveles récord con 480 toneladas compradas en el primer trimestre de 2026, liderada por China (140 TM), India (95 TM) y Turquía (62 TM). La incertidumbre geopolítica por el conflicto en Medio Oriente y las tensiones en el Mar del Sur de China también sustentan la demanda de activos refugio.

El soporte técnico inmediato del oro se ubica en US$ 3,280/oz (media de 20 días) y US$ 3,210/oz (media de 50 días). Analistas de Citi elevaron esta semana su objetivo de precio para fin de 2026 de US$ 3,400 a US$ 3,600/oz, argumentando que el ciclo de recortes de tasas globales incrementará el atractivo del metal al reducir el costo de oportunidad de tener oro. UBS mantiene una recomendación de "overweight" en oro dentro de carteras diversificadas.

Las reservas de oro del ETF SPDR Gold Trust (GLD) subieron 4.2 toneladas en la semana hasta 923 toneladas, señal de que los inversores institucionales siguen acumulando posiciones.`,
    analisis: `El oro en US$ 3,318/oz tras corrección no altera el impacto positivo estructural para las exportaciones auríferas peruanas. Perú es el sexto productor mundial de oro con exportaciones anuales de aproximadamente 115 toneladas. Con el precio actual, las exportaciones de oro generarían ingresos anuales de aproximadamente US$ 12,400 millones, un flujo sustancial de dólares para el mercado cambiario local.

Las correcciones del oro son oportunidades para exportadores peruanos de oro con necesidad de coberturas. Si el precio objetivo del metal es US$ 3,600 para diciembre, las posiciones largas en oro en este rango de US$ 3,300-3,350 ofrecen una relación riesgo-beneficio favorable para quienes necesiten planificar ingresos en dólares por exportaciones auríferas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g010',
    titulo: 'PEN/USD cierra en S/ 3.62 — sol gana 0.8% en la semana apoyado por recorte BCRP y superávit comercial',
    descripcion: 'El tipo de cambio PEN/USD cerró el lunes en S/ 3.62, acumulando una apreciación del 0.8% en la semana. El recorte de tasas del BCRP, el superávit comercial récord de abril y las actas dovish del FOMC convergieron para impulsar al sol peruano a su nivel más fuerte desde octubre de 2025.',
    contenido: `El tipo de cambio PEN/USD cerró este lunes en S/ 3.6210 en el mercado interbancario de Lima, con un mínimo intradiario de S/ 3.6150 y un máximo de S/ 3.6280. La apreciación semanal acumulada es del 0.8% frente al cierre del viernes previo en S/ 3.6490, y ubica al sol en su nivel más fuerte desde octubre de 2025.

Tres factores convergieron para fortalecer el sol esta semana: el recorte de 25 pbs en la tasa referencial del BCRP a 4.50%, que refuerza la confianza en la gestión macroeconómica peruana; el dato de exportaciones de abril con superávit comercial de US$ 2,140 millones, que garantiza abundante oferta de dólares; y las actas del FOMC que aumentan la probabilidad de un recorte de la Fed en septiembre, reduciendo el atractivo relativo del dólar.

El BCRP intervino moderadamente en el mercado cambiario comprando US$ 180 millones para moderar la apreciación del sol y evitar una fortaleza excesiva que perjudique la competitividad exportadora. Las mesas de cambio reportan flujo vendedor de dólares por parte de empresas exportadoras mineras que liquidan ingresos para pagar costos en soles.

Los niveles técnicos a monitorear: soporte en S/ 3.60 (zona psicológica) y resistencia en S/ 3.6650. El rango probable para la semana es S/ 3.60-3.66. El indicador de volatilidad implícita del PEN/USD a 1 mes cayó a 5.2%, su nivel más bajo del año.`,
    analisis: `El sol en S/ 3.62 con tendencia apreciadora refleja fundamentos sólidos: exportaciones creciendo, BCRP actuando con prudencia y Fed virando hacia recortes. El BCRP comprando dólares confirma que el banco central no quiere un sol demasiado fuerte que perjudique a los exportadores no tradicionales.

Para empresas con nómina o costos en soles y cuentas por cobrar en dólares, el momento es bueno para convertir dólares al tipo de cambio actual. Para importadores que necesitan dólares en los próximos 60-90 días, esperar a ver si el sol se aprecia a S/ 3.60 antes de comprar puede ser una estrategia razonable, aunque conlleva el riesgo de que un evento externo revierta la tendencia.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831529/pexels-photo-5831529.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g011',
    titulo: 'DXY cae a 102.3 — mayor caída semanal del dólar en 2026 ante expectativas de recorte de la Fed en septiembre',
    descripcion: 'El índice del dólar (DXY) retrocedió a 102.3 puntos, acumulando una caída semanal del 1.7%, su mayor corrección semanal desde diciembre de 2025. Las actas del FOMC que muestran consenso hacia un recorte en septiembre y los datos débiles de ventas minoristas de EE.UU. presionan al dólar.',
    contenido: `El índice del dólar estadounidense (DXY), que mide el valor del dólar frente a una canasta de seis divisas principales, cayó a 102.3 puntos este lunes, su nivel más bajo desde el 8 de enero de 2026. La caída semanal acumulada es del 1.7%, la mayor corrección del dólar en lo que va del año, superando el -1.4% registrado en la semana del 3 de febrero.

Los factores que presionan al dólar a la baja son múltiples: las actas del FOMC publicadas hoy elevan la probabilidad de recorte en septiembre al 68%; los datos de ventas minoristas de EE.UU. de abril mostraron un avance del 0.2%, por debajo del 0.6% esperado, señal de moderación del consumo; y el índice de actividad manufacturera ISM se mantuvo en zona de contracción (49.1) por cuarto mes consecutivo.

El euro avanzó a 1.1342 (+1.2% semanal), el yen japonés se apreció a 149.82 por dólar (+1.8%), la libra esterlina subió a 1.3480 (+0.9%) y el dólar australiano tocó 0.6580 (+1.6%). Las divisas emergentes de América Latina también se apreciaron: el real brasileño (5.06/USD), el peso chileno (892/USD) y el sol peruano (3.62/USD) anotaron ganancias semanales de entre 0.6% y 1.1%.

El nivel técnico de soporte del DXY se ubica en 101.5 puntos (mínimo de enero 2026) y la resistencia en 103.8 puntos. Una ruptura de 101.5 abriría la puerta hacia el área de 99-100 puntos, un escenario de dólar débil que generalmente coincide con apreciación de commodities y divisas emergentes.`,
    analisis: `Un DXY en 102.3 y cayendo es una de las mejores noticias posibles para el sol peruano y para los exportadores peruanos. Dólar débil = commodities más caros (los metales se cotizan en dólares, entonces cuando el dólar baja, el precio en dólares de los metales sube para compensar) = mayores ingresos de exportación para Perú = más oferta de dólares en el mercado cambiario local = sol más fuerte.

La convergencia de DXY débil + cobre en máximos + BCRP recortando es una triada históricamente muy favorable para el sol. Si gestionas exposición cambiaria, el sesgo de corto plazo favorece al sol. No es momento de acumular dólares especulativamente; sí es momento de cubrir necesidades reales de importación al tipo de cambio actual si tu negocio lo requiere.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831251/pexels-photo-5831251.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g012',
    titulo: 'Bitcoin consolida en US$ 103,800 — baja volatilidad implícita sugiere acumulación institucional antes del próximo movimiento',
    descripcion: 'Bitcoin cotiza en US$ 103,800 con una volatilidad implícita a 30 días del 38%, su nivel más bajo desde noviembre de 2024. Los analistas de on-chain identifican señales de acumulación por parte de ballenas con más de 1,000 BTC, mientras los ETFs de Bitcoin en EE.UU. suman su décima semana consecutiva de entradas netas.',
    contenido: `Bitcoin (BTC/USD) cotiza este lunes en US$ 103,800, dentro de un rango lateral de US$ 99,500-108,200 que mantiene desde hace tres semanas. La volatilidad implícita a 30 días cayó al 38%, su nivel más bajo desde noviembre de 2024, señal técnica que históricamente precede a movimientos de precio de alta magnitud —aunque la dirección puede ser en cualquier sentido.

Los datos de on-chain proporcionan señales constructivas. Las "ballenas" —direcciones con más de 1,000 BTC— acumularon netas 14,200 BTC en los últimos 14 días según datos de Glassnode, el mayor ritmo de acumulación desde enero de 2026. El Spent Output Profit Ratio (SOPR) se mantiene por encima de 1.0, indicando que las transacciones generales son rentables para los vendedores, lo que reduce la presión de venta por necesidad.

Los ETFs de Bitcoin al contado en EE.UU. acumularon US$ 2,840 millones en entradas netas en las últimas 10 semanas consecutivas de flujos positivos, liderados por el iShares Bitcoin Trust de BlackRock (US$ 1,240 millones) y el Fidelity Wise Origin Bitcoin Fund (US$ 890 millones). Los activos bajo gestión totales de los ETFs de BTC en EE.UU. ascienden a US$ 128,400 millones.

El próximo catalizador a monitorear es la expiración de opciones de Bitcoin el último viernes de mayo, con el precio de ejercicio de mayor interés abierto ("max pain") en US$ 100,000, lo que suele ejercer una atracción gravitacional sobre el precio en las semanas previas al vencimiento.`,
    analisis: `Bitcoin en US$ 103,800 con baja volatilidad y acumulación institucional es el patrón que precedió los grandes rallies de 2024 y 2025. Para el tipo de cambio PEN/USD, la correlación de Bitcoin con el apetito de riesgo global implica que si BTC sube significativamente, es probable que el dólar se debilite y el sol se aprecie moderadamente, ya que ambos movimientos reflejan mayor tolerancia al riesgo y salida de activos refugio como el dólar.

Para quienes tienen exposición a activos digitales en Perú, el contexto sugiere mantener posiciones. El soporte clave a monitorear es US$ 99,500; una ruptura de ese nivel invalidaría el escenario alcista de corto plazo. La resistencia inmediata es US$ 108,200; una ruptura proyectaría un objetivo hacia US$ 115,000-120,000.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g013',
    titulo: 'Argentina: inflación de abril cae a 3.1% mensual — el dato más bajo en cinco años aviva debate sobre tipo de cambio',
    descripcion: 'El INDEC reportó que la inflación mensual de Argentina en abril fue del 3.1%, la más baja desde marzo de 2021 y por debajo del 3.7% de marzo 2026. La acumulada en 12 meses se reduce a 68.4%. El gobierno de Milei celebra el dato pero economistas advierten que el atraso cambiario puede comprometer la competitividad exportadora.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó hoy los datos de inflación de abril de 2026, mostrando un alza mensual del 3.1%, por debajo del 3.7% registrado en marzo y del 3.9% de febrero. Es el menor registro mensual desde marzo de 2021, cuando la inflación mensual fue del 2.8%. La inflación interanual se reduce a 68.4% desde el 84.2% de diciembre de 2025.

La desaceleración inflacionaria es transversal a los rubros: alimentos y bebidas (+2.8%), indumentaria (+3.4%), vivienda y servicios (+2.6%) y educación (+3.1%). Los analistas atribuyen la moderación a la política de shock monetario del gobierno de Javier Milei, que mantiene el crecimiento de la base monetaria en el 0% mensual, y al esquema de "crawling peg" con devaluación mensual del peso del 1%, lo que ancla las expectativas de tipo de cambio.

Sin embargo, la apreciación real del peso argentino —el tipo de cambio oficial se ubica en ARS 1,180 por dólar mientras el tipo de cambio paralelo ("blue") cotiza en ARS 1,340— genera preocupaciones sobre competitividad. Las exportaciones no tradicionales argentinas cayeron 8.4% en el primer cuatrimestre, con el sector agropecuario reportando dificultades por los altos costos internos en dólares.

El Fondo Monetario Internacional elogió los avances en el programa de estabilización argentino en su última revisión, pero señaló que la sostenibilidad requiere avanzar hacia una mayor flexibilidad cambiaria en los próximos trimestres.`,
    analisis: `El dato de inflación argentino de 3.1% es un hito del programa de estabilización de Milei, con implicancias para toda la región. Una Argentina con menor inflación y mayor estabilidad macroeconómica reduce los riesgos de contagio financiero hacia otras economías sudamericanas, incluido Perú. En episodios pasados de crisis argentina, el sol peruano se depreció por efecto contagio de aversión al riesgo regional.

Para el tipo de cambio PEN/USD, la estabilización argentina es un factor de fondo positivo. Menos turbulencia regional = menor volatilidad cambiaria en todos los países de la región. El riesgo a monitorear es el atraso cambiario argentino: si el gobierno realiza una devaluación del peso más significativa para corregirlo, podría generar una ola de volatilidad regional que afecte temporalmente al sol peruano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g014',
    titulo: 'Colombia pausa ciclo de recortes: Banco de la República mantiene tasa en 5.25% por presiones inflacionarias en servicios',
    descripcion: 'La junta directiva del Banco de la República de Colombia decidió por mayoría de 5-2 mantener la tasa de intervención en 5.25% en su reunión de mayo, pausando el ciclo de recortes iniciado en diciembre de 2024. La inflación en servicios se mantiene en 7.8% anual, muy por encima de la meta del 3%.',
    contenido: `La junta directiva del Banco de la República de Colombia decidió en su reunión del 19 de mayo mantener la tasa de interés de intervención en 5.25%, en una votación de 5 miembros a favor de mantener frente a 2 que propusieron un recorte de 25 puntos básicos. La decisión sorprendió levemente al mercado, que asignaba un 65% de probabilidad a un recorte.

La decisión se sustenta en la persistencia de la inflación en el componente de servicios, que se mantiene en 7.8% anual a abril de 2026, muy por encima de la meta del 3% del banco central. Si bien la inflación total cayó a 4.9% anual —su nivel más bajo desde enero de 2024— la divergencia entre la inflación de bienes (1.8%) y servicios (7.8%) evidencia rigideces estructurales en el mercado laboral y de arriendos.

El gerente general del Banco de la República, Leonardo Villar, explicó que la junta evaluó los riesgos al alza para la inflación derivados del fenómeno El Niño tardío, que ha afectado la producción agropecuaria colombiana, y las presiones sobre los costos de transporte por el deterioro vial en algunas regiones del país tras las lluvias del primer trimestre.

El peso colombiano (COP) se depreció 0.8% frente al dólar hasta COP 4,245/USD tras el anuncio, reflejando la decepción del mercado ante la pausa. El diferencial de tasas Colombia-EE.UU. se mantiene en 75 puntos básicos.`,
    analisis: `La pausa del Banco de la República colombiano tiene implicancias moderadas para el sol peruano. Colombia y Perú compiten por flujos de inversión en renta fija regional: si Colombia detiene sus recortes mientras el BCRP los continúa, el diferencial de tasas a favor de Colombia podría atraer flujos de capital que de otro modo irían a Perú. Esto podría ejercer una presión bajista marginal sobre el sol, aunque el efecto es secundario frente a los fundamentos domésticos peruanos.

El dato relevante para Perú es que la inflación en servicios sigue siendo el rezago más persistente del ciclo inflacionario en economías de la región. El BCRP monitoreará la evolución de la inflación de servicios en Perú —actualmente en 3.4% anual— antes de profundizar su ciclo de recortes.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7613843/pexels-photo-7613843.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g015',
    titulo: 'Chile: cobre impulsa crecimiento económico a 3.8% anual en el primer trimestre de 2026 — el mejor dato en tres años',
    descripcion: 'El Banco Central de Chile informó que el PBI chileno creció 3.8% anual en el primer trimestre de 2026, superando las expectativas del mercado (3.1%) y marcando el mejor registro desde el tercer trimestre de 2023. La minería del cobre avanzó 9.4% y se convirtió en el principal motor del crecimiento.',
    contenido: `El Banco Central de Chile publicó hoy los datos del Producto Interno Bruto del primer trimestre de 2026, mostrando un crecimiento anual del 3.8%, por encima del consenso de mercado de 3.1% y del 2.6% registrado en el cuarto trimestre de 2025. Es el mejor registro trimestral para la economía chilena desde el tercer trimestre de 2023, cuando el PBI creció 4.1%.

El principal motor fue la minería del cobre (+9.4%), beneficiada por el rally de precios del metal en los mercados internacionales —el cobre promedio del primer trimestre fue US$ 12,847/TM, un 34% superior al mismo período de 2025— y por la recuperación de los volúmenes de producción en las minas de Codelco tras los problemas operacionales de 2025. La actividad manufacturera creció 4.1% y el sector servicios 3.5%.

El gasto de los hogares se expandió 3.2%, recuperándose de la debilidad del año pasado. El empleo formal creció 2.8% anual con la creación de 38,000 empleos en el trimestre, concentrados en minería, construcción y servicios empresariales. La inversión privada subió 5.6%, con la minería y el sector de energías renovables como principales destinos.

El Banco Central de Chile redujo su tasa de política monetaria en 25 pbs al 3.75% en su reunión de mayo, señalizando uno o dos recortes adicionales para el segundo semestre si la inflación continúa convergiendo hacia la meta del 3%.`,
    analisis: `El sólido crecimiento chileno impulsado por el cobre confirma que el rally del metal es un fenómeno con efectos macro reales en las economías productoras de la región, no solo un movimiento especulativo. Para Perú, el caso chileno es un espejo: mayor precio del cobre = mayor crecimiento, mayor inversión, mayor empleo, mayor recaudo fiscal y moneda más fuerte.

La diferencia es que Chile depende aún más del cobre que Perú (representa el 52% de sus exportaciones vs 38% para Perú), por lo que el impulso proporcionalmente es incluso mayor en Chile. Ambas economías se benefician del mismo viento de cola, lo que posiciona a los países mineros andinos como los de mejor desempeño macroeconómico en la región durante 2026.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15138925/pexels-photo-15138925.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f001',
    titulo: 'Kevin Warsh asume la presidencia de la Fed: mercados evalúan si el nuevo jefe bajará tasas pese a inflación en 4%',
    descripcion: 'El Senado confirmó el miércoles 13 a Kevin Warsh como nuevo presidente de la Reserva Federal por 54-45 votos, la votación más partidista de la historia. Warsh asume con la inflación en EE.UU. cercana al 4% impulsada por el cierre del estrecho de Ormuz y el conflicto en Medio Oriente. Su primera reunión del FOMC es el 16-17 de junio.',
    contenido: `Kevin Warsh juró el viernes como 17° presidente de la Reserva Federal de EE.UU., sucediendo a Jerome Powell cuyo mandato de ocho años concluyó el 15 de mayo. El Senado lo confirmó el miércoles por 54 votos a favor y 45 en contra, en la votación más polarizada de la historia para un nominado a presidir el banco central.

Warsh hereda una Fed con la tasa de fondos federales en el rango 3.50%-3.75% y la inflación interanual acelerándose hacia el 4%, impulsada por los precios de energía tras el cierre temporal del estrecho de Ormuz en abril. El mercado espera que el nuevo presidente se enfrente a un dilema inmediato: el presidente Trump presiona por recortes de tasas para estimular el crecimiento, mientras los datos inflacionarios apuntan en dirección contraria.

Analistas de Goldman Sachs y JPMorgan coinciden en que Warsh difícilmente podrá recortar tasas en junio sin arriesgar su credibilidad ante el mercado de bonos. La primera reunión del FOMC bajo su presidencia está programada para el 16 y 17 de junio. Los futuros de Fed Funds asignan apenas un 22% de probabilidad a un recorte en esa fecha y un 61% para septiembre.

El rendimiento del bono del Tesoro a 10 años subió 8 puntos básicos hasta 4.54% en la semana tras la confirmación, reflejando la incertidumbre sobre la dirección de la política monetaria. El DXY retrocedió levemente a 103.8 puntos ante dudas sobre si Warsh mantendrá la independencia del banco central frente a las presiones de la Casa Blanca.`,
    analisis: `La transición en la presidencia de la Fed es el factor de mayor incertidumbre para el dólar en el corto plazo. Un Warsh percibido como más dócil a Trump y propenso a recortes precipitados debilitaría el dólar, lo que beneficiaría al sol peruano. Por el contrario, si mantiene una postura ortodoxa y pospone recortes por la inflación, el DXY podría recuperar terreno y presionar al alza el PEN/USD.

Para quienes gestionan exposición cambiaria en los próximos 30-60 días, el período de incertidumbre Warsh-FOMC junio es un momento para evitar posiciones abiertas grandes. Si debes comprar dólares, el rango de S/ 3.64-3.66 actual es razonable frente al riesgo de que el DXY repunte si Warsh decepciona al mercado con un mensaje más hawkish de lo esperado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14820474/pexels-photo-14820474.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f002',
    titulo: 'Cobre en máximos históricos: LME registra US$ 14,196/TM impulsado por demanda de centros de datos IA y déficit de oferta',
    descripcion: 'El cobre en el London Metal Exchange alcanzó US$ 14,196 por tonelada métrica esta semana, extendiendo una racha alcista de ocho sesiones consecutivas. La demanda estructural de infraestructura para inteligencia artificial y los centros de datos impulsan las proyecciones de consumo.',
    contenido: `El cobre tocó US$ 14,196/TM en el LME el martes, su nivel más alto de la historia, en la octava sesión consecutiva de ganancias. El metal rojo acumula un alza del 7.61% en el último mes y del 40.33% respecto al mismo período del año anterior, cuando cotizaba en torno a US$ 10,116/TM.

El principal driver del rally es la demanda proyectada de cobre para infraestructura de inteligencia artificial: cada gran centro de datos requiere entre 1,500 y 4,000 toneladas de cobre para cableado, transformadores y sistemas de refrigeración. Microsoft, Google, Amazon y Meta han anunciado en conjunto inversiones de US$ 340,000 millones en centros de datos para 2026-2028, lo que implica una demanda incremental estimada de 2.8 millones de TM de cobre.

Por el lado de la oferta, las restricciones de exportación de China sobre el ácido sulfúrico —insumo clave para el proceso de lixiviación del cobre— y las interrupciones en producción de azufre en Medio Oriente aprietan el mercado. Las refinerías de Chile y Perú reportan dificultades para obtener ácido sulfúrico a precios competitivos, lo que presiona los costos de producción.

El contrato de futuros de cobre a tres meses en el LME cerró en US$ 14,087/TM el jueves, con el soporte técnico en US$ 13,650 (media de 20 días) y la resistencia siguiente proyectada en US$ 14,500. El volumen de operaciones fue el más alto del año, con 95,000 contratos transados en la jornada.`,
    analisis: `El cobre en US$ 14,196/TM es un hito histórico que tiene implicancias extraordinariamente positivas para el PEN/USD. Perú es el segundo productor mundial de cobre y sus exportaciones del metal representan el 38% del total exportado. Con este precio, los ingresos por exportaciones de cobre en 2026 podrían superar US$ 30,000 millones anuales, el mayor registro de la historia, generando un flujo masivo de dólares que fortalece estructuralmente al sol.

Para el mercado cambiario peruano, el cobre en máximos históricos es el mejor ancla posible. Más exportaciones de cobre = más dólares ingresando = mayor oferta en el mercado = menor presión sobre el tipo de cambio. Este fundamento explica por qué el sol peruano resiste mejor que sus pares regionales a pesar de la incertidumbre global por la transición en la Fed.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f003',
    titulo: 'Perú lidera crecimiento de exportaciones no tradicionales en Latinoamérica con avance promedio de 9.1% anual en cinco años',
    descripcion: 'El BCRP publicó esta semana un informe que posiciona al Perú como el país con mayor crecimiento de exportaciones no tradicionales en América Latina en los últimos cinco años, con una tasa promedio anual del 9.1%. Las agroexportaciones crecieron 6.7% en los primeros dos meses de 2026.',
    contenido: `El Banco Central de Reserva del Perú publicó su Nota Semanal Nº 18 de 2026 con un dato destacado: Perú lidera el crecimiento de exportaciones no tradicionales en América Latina con un promedio anual del 9.1% en los últimos cinco años, superando a Colombia (6.2%), Chile (5.8%), México (5.1%) y Brasil (4.7%).

Las exportaciones totales del Perú crecieron 38.2% en febrero de 2026 respecto al mismo mes del año anterior, impulsadas por los precios récord del cobre y el oro. Las agroexportaciones alcanzaron US$ 2,220 millones en los primeros dos meses del año (+6.7%), consolidando a Perú como uno de los principales exportadores mundiales de arándanos, uvas de mesa y espárragos.

El informe del BCRP destaca que la diversificación de mercados ha sido clave: la participación de Asia en las exportaciones peruanas subió del 38% al 44% en cinco años, con China como principal destino, seguido de EE.UU. (17%), Europa (15%) y el resto de América Latina (12%). Los acuerdos de libre comercio vigentes con 22 países facilitan el acceso preferencial para el 95% de las exportaciones peruanas.

El superávit comercial acumulado en los primeros cuatro meses de 2026 se estima en US$ 5,800 millones, el más alto para ese período en la historia del país. Este resultado refuerza las reservas internacionales del BCRP y provee soporte estructural robusto al sol peruano frente a la volatilidad del dólar global.`,
    analisis: `Liderar el crecimiento exportador no tradicional en América Latina posiciona al Perú en un círculo virtuoso: más exportaciones diversificadas reducen la dependencia del ciclo minero y generan empleo formal en sectores como agroindustria, textiles y manufactura ligera. Esto reduce la vulnerabilidad del PEN a las fluctuaciones de un solo commodity.

Para el mercado cambiario, la combinación de exportaciones récord y superávit comercial es el mejor seguro contra una depreciación pronunciada del sol. Incluso en un escenario de DXY fortalecido por la nueva Fed de Warsh, el flujo exportador peruano actúa como un amortiguador natural. La recomendación es no sobrestimar el riesgo cambiario en el corto plazo mientras estos fundamentos se mantengan.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2231744/pexels-photo-2231744.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f004',
    titulo: 'BCRP mantiene tasa de referencia en 4.75% en mayo: banco central monitorea impacto de transición en Fed sobre el PEN',
    descripcion: 'El Banco Central de Reserva del Perú mantuvo sin cambios su tasa de interés de referencia en 4.75% en la reunión de mayo. El directorio señaló que vigilará de cerca los efectos de la transición en la presidencia de la Fed y la evolución del DXY sobre el tipo de cambio.',
    contenido: `El directorio del BCRP decidió por unanimidad mantener la tasa de referencia en 4.75% en su reunión de mayo. La decisión estuvo alineada con las expectativas del mercado y se enmarca en la postura de "observar y esperar" que el banco central ha adoptado desde que inició su ciclo de recortes en el segundo semestre de 2025.

El comunicado del BCRP señaló que la inflación en Perú se mantiene dentro del rango meta de 1%-3%, con la inflación de abril ubicándose en 2.3% anual, un nivel consistente con el objetivo del banco central. La inflación subyacente (que excluye alimentos y energía) se situó en 2.1%, lo que da margen para continuar el ciclo de recortes en los próximos meses.

Sin embargo, el directorio identificó dos factores de riesgo que justifican la pausa: primero, la incertidumbre sobre la dirección de la política monetaria de la Fed bajo Kevin Warsh, cuya primera reunión es en junio; segundo, los precios del petróleo que permanecen por encima de US$ 95/barril ante las tensiones en el estrecho de Ormuz, lo que podría presionar la inflación de energía localmente.

El presidente del BCRP, Julio Velarde, indicó que las reservas internacionales de US$ 77,500 millones "proveen un escudo robusto ante escenarios de volatilidad externa" y que el banco tiene "plena capacidad para intervenir en el mercado cambiario si las condiciones lo requieren".`,
    analisis: `La pausa del BCRP en 4.75% es una decisión prudente dado el contexto de incertidumbre en la Fed. Mientras Warsh no defina claramente la dirección de la política monetaria estadounidense, el banco central peruano prefiere no adelantarse con más recortes que podrían comprimir el diferencial de tasas con EE.UU. y generar salidas de capital.

Para el PEN/USD, la tasa del BCRP en 4.75% vs. Fed en 3.50%-3.75% representa un diferencial positivo para el sol de 100-125 puntos básicos, lo que incentiva mantener activos en soles. Este carry trade implícito es un soporte adicional para el tipo de cambio. Si Warsh recorta tasas en junio, el diferencial se ampliaría aún más, favoreciendo al PEN.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14820474/pexels-photo-14820474.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f005',
    titulo: 'Minería peruana bate récord de producción de cobre en abril: 248,000 TM con Las Bambas y Quellaveco en plena capacidad',
    descripcion: 'El Ministerio de Energía y Minas reportó una producción de cobre de 248,000 toneladas métricas en abril de 2026, nuevo récord mensual. Las Bambas, Quellaveco y Antamina operan a máxima capacidad aprovechando los precios históricos del metal.',
    contenido: `La producción de cobre en Perú alcanzó 248,000 toneladas métricas en abril de 2026, nuevo récord mensual que supera el anterior máximo de 231,000 TM registrado en marzo. El dato confirma que el sector minero peruano opera a plena capacidad aprovechando el contexto de precios históricos en el LME, donde el cobre cotiza en torno a US$ 14,196/TM.

Las Bambas (MMG Limited) lideró la producción mensual con 58,500 TM, beneficiada por la expansión de la fase 3 del tajo y la estabilidad social en la zona de influencia tras la firma del nuevo acuerdo comunitario en febrero. Quellaveco (Anglo American) produjo 38,200 TM, récord de la operación, mientras Antamina (BHP-Glencore) aportó 72,400 TM impulsada por leyes de mineral excepcionalmente altas en el nivel actual de extracción.

El canon minero que recibirán las regiones productoras por la producción de abril se estima en S/ 2,800 millones, el más alto de la historia para un mes. Apurímac (Las Bambas), Moquegua (Quellaveco) y Áncash (Antamina) serán los principales beneficiarios, lo que impulsa la inversión pública regional en infraestructura y servicios.

A precios actuales (US$ 14,196/TM), la producción mensual de 248,000 TM genera ingresos por exportaciones de aproximadamente US$ 3,520 millones, equivalente a US$ 42,240 millones anualizados solo por cobre. Esto representa el 14% del PBI peruano generado por un solo commodity en un escenario de precios récord.`,
    analisis: `Una producción récord de cobre a precios récord es una combinación que el mercado cambiario peruano no había visto antes. El flujo mensual de dólares generado solo por las exportaciones de cobre (estimado en US$ 3,520 millones en abril) supera con creces cualquier episodio de salida de capitales que pueda presionar al sol. En este entorno, el BCRP necesita intervenir menos en el mercado cambiario, y el tipo de cambio tiende a estabilizarse o incluso apreciarse levemente.

Para empresas con obligaciones en soles (planillas, impuestos, proveedores locales) que reciben ingresos en dólares, el contexto es favorable para liquidar divisas gradualmente a los niveles actuales. No hay fundamentos para una depreciación significativa del sol mientras el cobre permanezca en máximos históricos y la producción peruana siga en niveles récord.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f006',
    titulo: 'Inflación en Perú se mantiene en 2.3% anual en abril: tercer mes consecutivo dentro del rango meta del BCRP',
    descripcion: 'El INEI reportó una inflación de 2.3% anual en abril de 2026, dentro del rango meta de 1%-3% del BCRP por tercer mes consecutivo. La inflación de alimentos desaceleró a 1.8% mientras los servicios mostraron el mayor avance con 3.1%.',
    contenido: `El Instituto Nacional de Estadística e Informática (INEI) publicó el índice de precios al consumidor de Lima Metropolitana de abril: variación mensual de 0.19% y anual de 2.3%, dentro del rango meta del BCRP (1%-3%) por tercer mes consecutivo. El resultado consolida la convergencia inflacionaria que el banco central logró en el segundo semestre de 2025.

Los alimentos y bebidas —que representan el 26% de la canasta básica— mostraron una variación mensual de 0.12% y anual de 1.8%, la más baja en 18 meses. La buena producción agrícola en la costa norte y la estabilidad del tipo de cambio moderaron los precios de alimentos importados. Los combustibles subieron 0.8% mensual ante los precios internacionales del petróleo, pero el subsidio de Fondo de Estabilización de Precios de Combustibles (FEPC) amortiguó el traslado al consumidor final.

Los servicios registraron la mayor presión con 3.1% anual (+0.31% mensual), impulsados por salud, educación y transporte. La inflación subyacente —que excluye alimentos y energía y es la medida preferida por el BCRP para la política monetaria— se ubicó en 2.1% anual, consistente con el objetivo del banco central.

El BCRP proyecta que la inflación cerrará 2026 en el rango de 2.0%-2.5%, asumiendo estabilidad cambiaria y precios del petróleo que no superen los US$ 105/barril en promedio anual. El proceso de desinflación desde el pico de 8.7% registrado en junio de 2023 hasta el 2.3% actual es uno de los logros más destacados de la política monetaria peruana reciente.`,
    analisis: `Una inflación en 2.3% anual dentro del rango meta es una señal de solidez macroeconómica que refuerza la confianza en el sol peruano. Baja inflación significa que el poder adquisitivo del sol se deteriora menos, lo que reduce la presión de los ahorristas por dolarizarse. Este comportamiento es favorable para la demanda de activos en moneda local y contribuye a la estabilidad del PEN/USD.

Para quienes gestionan tesorería en empresas, el entorno de inflación controlada facilita la planificación de costos en soles sin necesidad de sobreponerse con cobertura cambiaria. Si la inflación permanece en el rango meta, el BCRP podría continuar recortando tasas en la segunda mitad del año, lo que abarataría el crédito en soles y haría más atractivo financiarse localmente en lugar de en dólares.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f007',
    titulo: 'Warsh en la Fed: Wall Street recalibra expectativas — bonos del Tesoro suben y dólar busca dirección',
    descripcion: 'Los mercados financieros globales cerraron una semana de alta volatilidad tras la confirmación de Kevin Warsh como presidente de la Fed. El rendimiento del Tesoro a 10 años subió al 4.54% y el DXY fluctuó entre 103.5 y 104.2 ante la incertidumbre sobre la política monetaria futura.',
    contenido: `Los mercados de renta fija y divisas cerraron la semana con la incertidumbre Warsh como protagonista. El rendimiento del bono del Tesoro estadounidense a 10 años escaló hasta 4.54% el jueves (+12pb en la semana), su nivel más alto en cinco semanas, mientras el de 2 años subió a 4.68% (+8pb). La curva de rendimientos permanece levemente invertida (-14pb en el segmento 2-10 años).

El DXY fluctuó en un rango de 103.5-104.2 durante la semana, sin dirección clara. Por un lado, los inversores se preguntan si Warsh cederá a las presiones de Trump y recortará tasas pronto, lo que debilitaría el dólar. Por otro, la inflación en 4% y el conflicto en Medio Oriente limitan el espacio para la flexibilización, lo que sostiene al billete verde.

El S&P 500 terminó la semana con una caída marginal del 0.3%, mientras el Nasdaq subió 0.8% impulsado por resultados corporativos sólidos en tecnología. Los mercados emergentes tuvieron una semana mixta: el MSCI EM subió 0.4% pero con alta dispersión entre países. Las monedas de América Latina resistieron bien, con el sol peruano apreciándose 0.2% en la semana.

Los analistas de Morgan Stanley alertan que la primera reunión del FOMC de Warsh (16-17 de junio) será "el evento de mercado más importante del semestre". Si Warsh recorta tasas contra el consenso del mercado, el dólar podría caer 2-3% en días. Si las mantiene y adopta un tono hawkish, los bonos sufrirán otro round de ventas.`,
    analisis: `La incertidumbre sobre Warsh crea un entorno de "esperar para ver" en el dólar, que puede ser favorable para el sol en el margen. Un DXY sin dirección clara entre 103.5 y 104.2 reduce la presión depreciatoria sobre monedas emergentes como el PEN. Históricamente, los períodos de transición en la Fed generan volatilidad temporal seguida de normalización.

Para decisiones cambiarias en los próximos 30 días, considera distribuir operaciones en lugar de concentrarlas en un solo momento. Si debes comprar dólares para importaciones o deuda, escalonar la compra en la semana previa al FOMC de junio reduce el riesgo de quedar expuesto a un movimiento brusco post-reunión en cualquier dirección.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f008',
    titulo: 'Petróleo WTI se estabiliza en US$ 96.4/barril: mercado pondera reapertura parcial del estrecho de Ormuz frente a tensiones persistentes',
    descripcion: 'El crudo WTI cotiza en US$ 96.4/barril, cediendo desde los máximos de US$ 102 alcanzados en abril tras el cierre parcial del estrecho de Ormuz. Negociaciones diplomáticas con mediación de Omán abren posibilidad de normalización, pero la incertidumbre geopolítica mantiene una prima de riesgo de US$ 8-10.',
    contenido: `El petróleo WTI cotiza en US$ 96.4/barril este sábado, acumulando una caída del 5.5% desde el máximo de US$ 102 alcanzado a fines de abril, cuando el estrecho de Ormuz registró restricciones al tráfico marítimo tras las tensiones entre EE.UU. e Irán. La normalización parcial del tráfico en el estrecho —por donde transita el 21% del petróleo mundial— alivió parte de la prima de riesgo geopolítico.

Negociaciones diplomáticas con mediación del sultán de Omán reportan "avances significativos" en las últimas 72 horas. Fuentes citadas por Reuters indican que un acuerdo provisional sobre inspecciones de cargamentos podría anunciarse la próxima semana, lo que abriría el paso a una normalización gradual del tráfico en el estrecho. Los futuros de petróleo a 3 meses cotizan en US$ 94.1, por debajo del spot, sugiriendo que el mercado anticipa alivio.

Sin embargo, analistas de la Agencia Internacional de Energía (AIE) advierten que la prima de riesgo geopolítico difícilmente desaparecerá por completo mientras el conflicto de fondo no se resuelva. Estiman que el precio "fundamental" del WTI, sin prima geopolítica, se ubicaría en US$ 88-90 dado el equilibrio actual de oferta y demanda.

Los inventarios de crudo en EE.UU. aumentaron 1.2 millones de barriles en la última semana, según el reporte EIA, señal de que el suministro se está normalizando. Arabia Saudita confirmó que mantendrá su producción en 9.2 millones de barriles diarios durante junio, lo que provee un colchón de oferta ante cualquier nueva disrupción.`,
    analisis: `El petróleo cediendo desde US$ 102 a US$ 96 es una noticia modestamente positiva para el Perú, que importa una porción de sus combustibles. Precios de energía menores reducen la presión inflacionaria importada y alivian el balance de pagos en el segmento de combustibles. El BCRP mira de cerca este dato para calibrar si necesita ajustar su proyección de inflación 2026.

Para el tipo de cambio, un petróleo estabilizándose en US$ 95-97 es un escenario neutral. El riesgo de rebote a US$ 100+ sigue latente mientras las negociaciones de Ormuz no concluyan. Si el petróleo supera nuevamente US$ 100, la presión inflacionaria global se intensificaría y la Fed tendría aún menos espacio para recortar tasas, lo que fortalecería el dólar y presionaría al PEN al alza.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f009',
    titulo: 'Demanda de cobre de centros de datos IA supera proyecciones: Goldman estima 4.2 millones de TM adicionales para 2030',
    descripcion: 'Goldman Sachs revisó al alza sus proyecciones de demanda de cobre para infraestructura de inteligencia artificial hasta 4.2 millones de toneladas métricas adicionales para 2030, frente a las 2.8 millones estimadas previamente. El dato presiona el mercado ante una oferta que no podrá crecer al mismo ritmo.',
    contenido: `El equipo de commodities de Goldman Sachs publicó esta semana una nota revisando al alza sus proyecciones de demanda de cobre para centros de datos e infraestructura de IA. El banco estima ahora que el segmento tecnológico demandará 4.2 millones de toneladas métricas adicionales de cobre entre 2025 y 2030, frente a las 2.8 millones proyectadas en diciembre pasado. La revisión se basa en el anuncio de Microsoft de construir 50 nuevos centros de datos globales, la expansión acelerada de Google Cloud en Asia y los planes de Meta para su red de supercomputación.

Cada megawatio de capacidad de cómputo instalada en un centro de datos de última generación requiere entre 7 y 12 toneladas de cobre en transformadores, cableado de distribución, sistemas de refrigeración y bus bars. Los centros de datos para entrenamiento de modelos de IA de gran escala (GPU clusters) tienen densidades eléctricas 5-8 veces superiores a los servidores convencionales, multiplicando la demanda de cobre por MW.

Por el lado de la oferta, Goldman advierte que la capacidad de producción de cobre refinado solo puede crecer al 2-3% anual en el mejor de los escenarios, dado el tiempo de desarrollo de nuevas minas (8-15 años desde descubrimiento hasta producción). El déficit acumulado de cobre proyectado para 2025-2030 se estima en 9.8 millones de TM, sin precedentes en la historia del mercado del metal.

Perú y Chile son los únicos países con proyectos de cobre a escala suficiente para responder parcialmente a esta demanda: Los proyectos Michiquillay y Tía María en Perú podrían aportar 400,000 TM/año adicionales si se desarrollan, aunque la viabilidad social y ambiental sigue siendo el principal desafío.`,
    analisis: `La demanda estructural de cobre para IA es el viento de cola más potente que el Perú ha tenido en décadas para sus exportaciones. Si Goldman proyecta un déficit acumulado de 9.8 millones de TM y los precios ya están en US$ 14,196/TM, el escenario de precios altos sostenidos durante años es el escenario base, no el optimista.

Para el PEN/USD, esto implica que el soporte estructural del sol por vía de exportaciones de cobre podría mantenerse o intensificarse en los próximos 3-5 años. Las empresas con deuda en dólares o planificación financiera a largo plazo deberían incorporar este escenario en sus modelos: un sol estructuralmente bien soportado por el boom del cobre reduce la necesidad de cobertura cambiaria excesiva a mediano plazo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17489160/pexels-photo-17489160.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f010',
    titulo: 'PEN/USD: sol peruano se aprecia a S/ 3.645 impulsado por precios récord del cobre e incertidumbre sobre la Fed',
    descripcion: 'El tipo de cambio PEN/USD cierra la semana en S/ 3.645, apreciándose 0.3% respecto al cierre del viernes anterior (S/ 3.657). El cobre en máximos históricos y el DXY sin dirección clara generaron condiciones favorables para la moneda local.',
    contenido: `El sol peruano se apreció esta semana hasta S/ 3.645 por dólar, ganando 0.3% frente al cierre de la semana anterior en S/ 3.657. El movimiento se explica por dos factores convergentes: el cobre en máximos históricos (US$ 14,196/TM) que incrementa las expectativas de ingreso de divisas por exportaciones, y el DXY sin dirección clara (oscilando entre 103.5 y 104.2) ante la incertidumbre sobre la dirección de la política monetaria bajo Kevin Warsh.

Desde el punto de vista técnico, el PEN/USD muestra soporte sólido en S/ 3.635, nivel donde confluyen la media móvil de 50 días y la línea de tendencia alcista desde enero 2026. La resistencia inmediata se ubica en S/ 3.668 (promedio de la semana pasada) y la resistencia fuerte en S/ 3.700, nivel psicológico clave. El RSI (14) se ubica en 41, en territorio neutral con sesgo hacia sobreventa.

El BCRP no reportó intervenciones en el mercado spot durante la semana, señal de que el banco central considera que el movimiento del tipo de cambio es consistente con los fundamentos. El volumen promedio de operaciones fue de US$ 195 millones diarios, ligeramente por encima del promedio de las últimas cuatro semanas (US$ 182 millones).

Los operadores de mesa anticipan que el tipo de cambio mantendrá un rango estrecho de S/ 3.635-3.670 durante la semana del 18 de mayo, a la espera de datos de inflación de EE.UU. y de las primeras declaraciones públicas de Warsh como presidente de la Fed.`,
    analisis: `El sol en S/ 3.645 con soporte técnico en S/ 3.635 y sesgo moderadamente apreciativo dado el contexto de cobre en máximos es el mapa técnico de esta semana. El riesgo principal al alza del dólar sería una declaración hawkish sorpresa de Warsh o una escalada del conflicto en Ormuz que dispare el petróleo sobre US$ 105.

Para operaciones de la semana: quien necesite comprar dólares para pagos próximos encontrará niveles razonables en S/ 3.645-3.660. Quien necesite vender dólares (exportadores, receptores de remesas) puede esperar si el cobre mantiene su impulso alcista, ya que el flujo exportador seguirá proveyendo oferta de divisas en el mercado local.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f011',
    titulo: 'Oro supera US$ 3,850/oz por primera vez: bancos centrales acumulan 480 toneladas en 2026 y DXY sin ancla presiona el metal',
    descripcion: 'El oro al contado superó US$ 3,850 por onza troy esta semana por primera vez en la historia, impulsado por las compras de bancos centrales (480 TM en lo que va de 2026) y la incertidumbre sobre la independencia de la Fed bajo Warsh. El DXY sin dirección clara elimina el efecto de correlación negativa habitual.',
    contenido: `El oro spot alcanzó US$ 3,862/oz el jueves, superando por primera vez en la historia el nivel de US$ 3,850 y acumulando un avance del 12.3% en lo que va de mayo. El metal precioso opera en máximos históricos consecutivos desde la confirmación de Kevin Warsh como presidente de la Fed, ante el temor de que la independencia del banco central estadounidense pueda verse comprometida.

Las compras de bancos centrales son el driver estructural: en los primeros cuatro meses de 2026 acumulan 480 toneladas métricas netas, el segundo mayor ritmo de compras de la historia después de 2022. El Banco Popular de China (PBoC) lidera con 145 TM (+38% respecto a igual período de 2025), seguido del Banco de la India (RBI) con 87 TM y el Banco de Polonia con 42 TM. Los bancos centrales de Arabia Saudita, Turquía y Singapur también reportaron compras significativas.

La correlación inversa habitual entre oro y dólar se ha debilitado: el metal sube incluso cuando el DXY se estabiliza, lo que refleja que la demanda de oro como activo de reserva alternativo es un fenómeno estructural, no meramente especulativo. Los ETF de oro sumaron 185 TM de entradas en lo que va de mayo, el mes más activo desde agosto de 2020.

Goldman Sachs revisó al alza su objetivo de precio del oro para fin de 2026 desde US$ 3,800/oz hasta US$ 4,200/oz, argumentando que "el proceso de dedolarización de reservas de bancos centrales está en una etapa temprana y tiene décadas de recorrido". El soporte técnico se ubica en US$ 3,780 (máximo de la semana anterior) y la próxima resistencia en US$ 3,920.`,
    analisis: `El oro en máximos históricos sostenidos beneficia directamente al Perú, segundo productor mundial del metal. Con precios por encima de US$ 3,850/oz, los ingresos por exportaciones de oro peruano en 2026 podrían superar US$ 18,000 millones anuales, reforzando el superávit comercial y la oferta de dólares en el mercado local. Este flujo, combinado con el del cobre, hace del sol uno de los activos cambiarios mejor respaldados por fundamentales en América Latina.

Para quienes tienen exposición en activos vinculados al oro (acciones mineras, fondos de oro), el escenario de Goldman apuntando a US$ 4,200/oz para fin de año sugiere que el rally no ha terminado. A efectos del tipo de cambio, cada US$ 100 adicionales por onza de oro se traduce en aproximadamente US$ 500-600 millones más de exportaciones anuales peruanas, lo que equivale a una presión apreciativa de 0.5-1 céntimo sobre el sol.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f012',
    titulo: 'Bitcoin consolida US$ 108,500 tras corrección del 4%: mercado digiere confirmación de Warsh y espera datos macro de EE.UU.',
    descripcion: 'Bitcoin cotiza en US$ 108,500 luego de una corrección del 4% desde los US$ 113,200 de la semana pasada. La confirmación de Kevin Warsh como presidente de la Fed y la toma de ganancias institucional generaron una consolidación que los analistas leen como saludable dentro del ciclo alcista.',
    contenido: `Bitcoin opera este sábado en US$ 108,500, consolidando tras la corrección del 4% desde el máximo de US$ 113,200 alcanzado el lunes. El activo digital mantiene un avance del 32% en lo que va de 2026 y permanece en zona de máximos históricos, a US$ 15,700 por debajo del récord absoluto de US$ 124,200 registrado el 14 de marzo.

La corrección de la semana fue impulsada principalmente por la toma de ganancias institucional ante la incertidumbre de la transición en la Fed: los ETF spot de bitcoin en EE.UU. registraron salidas netas de US$ 380 millones el miércoles y jueves (vs. entradas de US$ 2,100 millones la semana anterior). El IBIT de BlackRock reportó salidas de US$ 145 millones, las mayores en seis semanas.

Desde el punto de vista técnico, el soporte clave del BTC se ubica en US$ 105,000 (media móvil de 50 días), nivel que no ha sido retestado en las últimas tres semanas. El RSI (14) bajó desde la zona de sobrecompra (74) hasta 58, aliviando la presión técnica y abriendo espacio para un nuevo intento alcista. La resistencia inmediata está en US$ 113,200 (máximo de la semana) y el objetivo de los alcistas sigue siendo el récord histórico de US$ 124,200.

El dominio de Bitcoin en el mercado cripto se mantuvo en 57.8%. Ethereum cotizó en US$ 3,340 (-3.2% en la semana), mientras Solana se aprecó 2.1% hasta US$ 202 ante el crecimiento de las aplicaciones DeFi en su ecosistema.`,
    analisis: `Bitcoin en US$ 108,500 tras una corrección del 4% es una señal técnica positiva: el activo absorbe la toma de ganancias sin perder los soportes clave, lo que sugiere que la tendencia alcista del ciclo sigue intacta. Para quienes tienen posiciones en cripto y necesitan convertir a soles, el tipo de cambio actual de S/ 3.645 es un nivel operativo razonable.

Si tienes ganancias en BTC y debes liquidar a soles para cubrir obligaciones en Perú (impuestos, planilla, inversiones), considera hacerlo en sesiones de buen volumen en el mercado cambiario local (lunes a miércoles) para obtener mejores spreads. La combinación BTC en máximos + sol bien soportado por el cobre crea una oportunidad para quienes gestionan flujos bi-moneda.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f013',
    titulo: 'Argentina acelera a 4.5% de crecimiento en Q1 2026: el mayor trimestre desde 2021 confirma la recuperación de Milei',
    descripcion: 'Argentina registró un crecimiento del PBI de 4.5% en el primer trimestre de 2026 respecto al mismo período del año anterior, el mayor en cinco años. La estabilidad cambiaria, la caída de la inflación a 2.7% mensual y la recuperación del consumo interno impulsan la expansión.',
    contenido: `El INDEC publicó esta semana el dato de PBI de Argentina para el Q1 2026: crecimiento del 4.5% anual, el mayor desde el Q1 2021 y muy por encima del consenso del mercado (3.2%). La recuperación es liderada por construcción (+12.3%), manufactura (+8.1%) y comercio (+7.4%), los tres sectores que más habían sufrido durante el ajuste de 2024.

El ministro de Economía, Luis Caputo, atribuyó el resultado a la "estabilización macroeconómica integral" alcanzada en 2025: tipo de cambio unificado y libre desde el levantamiento del cepo en Q1 2026, inflación mensual en 2.7% (mínimo de cinco años), superávit fiscal primario por 15 meses consecutivos y reservas del BCRA en positivo por primera vez desde 2019 (US$ 8,200 millones netos).

El riesgo país de Argentina se ubicó esta semana en 445 puntos básicos, frente a los 1,800pb de diciembre de 2023. Los bonos soberanos en dólares acumulan una apreciación del 38% en lo que va de 2026, con el Merval en dólares en 2,920 puntos (máximo histórico). La calificadora Moody's elevó el rating soberano de Argentina desde Caa3 hasta B2 en abril, el mayor salto de calificación de la historia del país.

El FMI revisó al alza su proyección de crecimiento para Argentina en 2026 desde 3.8% hasta 4.5%, lo que convertiría al país en la economía de mayor crecimiento de América Latina este año, superando por primera vez en dos décadas a Colombia, Chile y Perú en términos de variación del PBI.`,
    analisis: `La recuperación de Argentina es una buena noticia para el conjunto de América Latina, incluyendo Perú. Una Argentina con crecimiento del 4.5%, inflación convergiendo y riesgo país en mínimos desde 2017 reduce el riesgo de contagio financiero regional y mejora el apetito de los inversores internacionales por activos de la región.

Para el PEN/USD, esto se traduce marginalmente en mayores flujos de capital hacia activos latinoamericanos en general, lo que puede apreciar moderadamente al sol. Adicionalmente, las empresas peruanas con operaciones o clientes en Argentina encontrarán un entorno de mayor certeza cambiaria, ya que la brecha entre el dólar oficial y el paralelo ha desaparecido y el peso argentino opera en un régimen de flotación limpia.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f014',
    titulo: 'Colombia a una semana de las elecciones presidenciales: mercados en alerta por volatilidad del peso y escenarios poselectorales',
    descripcion: 'Colombia celebrará elecciones presidenciales el 25 de mayo, con tres candidatos estadísticamente empatados en las encuestas. El peso colombiano (COP) acumula una depreciación del 9.2% frente al dólar en 2026 ante la incertidumbre política, y la inflación se mantiene en 5.8% anual.',
    contenido: `Colombia se aproxima a las elecciones presidenciales del 25 de mayo con alta incertidumbre: los tres principales candidatos —el candidato de centro-derecha Óscar Iván Zuluaga Junior, la candidata de izquierda Francia Márquez y el independiente Alejandro Gaviria— se encuentran estadísticamente empatados en las encuestas, con diferencias dentro del margen de error (28%, 26% y 23% respectivamente).

El mercado financiero colombiano opera con prima de riesgo político: el COP ha perdido el 9.2% frente al dólar en lo que va de 2026, cerrando la semana en COP 4,580/USD. La Bolsa de Colombia (BVC) cayó 3.4% en la semana y los fondos de pensiones reportaron salidas de inversores extranjeros de US$ 420 millones en el mes. Los bonos TES (deuda soberana local) sufrieron ventas que elevaron el rendimiento a 10 años hasta 12.8%.

La incertidumbre gira en torno a la política económica poselectoral: los mercados temen que un gobierno de izquierda pueda reabrir la discusión sobre la reforma a la regla fiscal, revisar contratos de concesiones de infraestructura o modificar el régimen de inversión extranjera en el sector petrolero. Colombia exporta aproximadamente 800,000 barriles diarios de petróleo, cuarto productor de América Latina.

El Banco de la República de Colombia mantiene su tasa en 10.50% (subida sorpresiva de 25pb el mes pasado) para intentar frenar la depreciación del peso y las presiones inflacionarias importadas. La inflación de abril cerró en 5.8% anual, casi el doble del objetivo del 3%.`,
    analisis: `Las elecciones de Colombia son un factor de riesgo regional a seguir de cerca esta semana. Una victoria de la candidata de izquierda podría generar un episodio de "efecto contagio" en monedas emergentes latinoamericanas similar al observado en Chile en 2021 post-elecciones de Boric. Sin embargo, el contagio sobre el PEN debería ser limitado dado los sólidos fundamentos de Perú (reservas récord, superávit comercial, cobre en máximos).

Para el corto plazo, las elecciones colombianas del 25 de mayo son un evento de riesgo a tener en cuenta en cualquier posición cambiaria abierta durante esa semana. Si el resultado electoral favorece al candidato de izquierda, el COP podría caer 3-5% adicionales y generar volatilidad regional que, aunque transitoria, podría presionar momentáneamente al PEN. Considera cerrar posiciones abiertas antes del 25 de mayo o asegurarte de tener margen suficiente.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f015',
    titulo: 'Chile: Banco Central recorta tasa a 4.50% y proyecta crecimiento del 2.2% para 2026 con peso estable gracias al cobre',
    descripcion: 'El Banco Central de Chile recortó su tasa de referencia en 25pb hasta 4.50% en la reunión de mayo, décimo recorte consecutivo desde el pico de 11.25% de 2023. El peso chileno (CLP) se ha apreciado 3.1% frente al dólar en 2026 impulsado por el rally histórico del cobre.',
    contenido: `El Banco Central de Chile recortó su tasa de política monetaria en 25 puntos básicos hasta 4.50% en la reunión del 13 de mayo, décimo recorte consecutivo desde el máximo de 11.25% alcanzado en el ciclo de ajuste de 2022-2023. La decisión fue unánime y se enmarca en la convergencia de la inflación chilena al objetivo del 3%: el IPC de abril cerró en 3.2% anual, apenas 20pb por encima de la meta.

El peso chileno (CLP) se ha apreciado 3.1% frente al dólar en 2026, cerrando la semana en CLP 908/USD, impulsado por el rally del cobre: Chile es el primer productor mundial del metal y el precio récord de US$ 14,196/TM genera un flujo extraordinario de divisas que fortalece estructuralmente la moneda local.

El Banco Mundial revisó al alza su proyección de crecimiento de Chile para 2026 a 2.2%, consistente con la estimación del propio banco central. La economía chilena se beneficia de cuatro drivers simultáneos: precios del cobre en máximos, tasas bajando por décima vez, inflación convergiendo y consumo interno recuperándose. El desempleo bajó a 8.4% en el Q1 2026, el más bajo en cuatro años.

El IPoM (Informe de Política Monetaria) del Banco Central proyecta que la tasa llegará a 3.75%-4.00% a fines de 2026, lo que implicaría 2-3 recortes adicionales de 25pb en el año. La condición para ello es que la inflación siga convergiendo al 3% sin aceleración de los precios de servicios, que actualmente crecen al 4.1% anual.`,
    analisis: `La situación de Chile es un espejo positivo para el entendimiento del entorno cambiario en economías exportadoras de cobre: tasas bajando, inflación controlada, moneda apreciándose gracias al commodity. El Perú comparte este perfil exportador con ventajas adicionales (oro, agroexportaciones, reservas más altas).

La comparación Chile-Perú ilustra que ambas monedas tienen fundamentos sólidos en este entorno de cobre en máximos históricos. Para quienes operan con proveedores o clientes en Chile, el CLP apreciado en 3.1% en 2026 significa que los bienes y servicios chilenos son relativamente más caros en dólares que hace un año, lo que puede ser una oportunidad para proveedores peruanos en mercados donde compiten con productos chilenos.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e001',
    titulo: 'Fed descarta recortes de tasas antes de septiembre: Powell exige inflación en 2% para actuar',
    descripcion: 'Jerome Powell confirmó ante el Congreso que la Reserva Federal no reducirá tasas hasta ver evidencia sostenida de que la inflación converge al objetivo del 2%. Los mercados recalibran sus expectativas hacia un primer recorte no antes del Q3 2026.',
    contenido: `Jerome Powell compareció este jueves ante la Comisión de Servicios Financieros del Congreso con un mensaje inequívoco: la Fed no tiene prisa para bajar tasas. El presidente de la Reserva Federal señaló que el IPC subyacente de abril cerró en 3.1% anual, por encima del objetivo, y que el mercado laboral "sigue siendo notablemente resistente" con una tasa de desempleo del 3.9%.

Powell subrayó que los datos de inflación de los últimos tres meses muestran "progreso insuficiente" hacia el objetivo del 2%. El funcionario descartó explícitamente un recorte en junio y puso en duda el de julio, dejando abierta la posibilidad de actuar en septiembre si los datos acompañan.

Los futuros de Fed Funds ahora asignan una probabilidad del 68% a un primer recorte de 25pb en septiembre y solo un 22% en julio. La tasa actual se mantiene en el rango de 4.50%-4.75%, nivel que la Fed considera "suficientemente restrictivo" para continuar moderando la demanda.

El dólar reaccionó positivamente al discurso: el DXY subió 0.4% hasta 104.7 puntos, su nivel más alto en seis semanas. Los bonos del Tesoro a 2 años subieron al 4.82% mientras los de 10 años llegaron al 4.61%, comprimiendo el diferencial.`,
    analisis: `La postura hawkish de Powell fortalece el dólar en el corto plazo y presiona al alza el tipo de cambio en mercados emergentes, incluido el PEN/USD. Con el DXY en 104.7 y la Fed sin prisa para recortar, el dólar podría mantenerse firme durante las próximas semanas, empujando el PEN hacia el rango S/ 3.70-3.78.

Si tienes obligaciones en dólares próximas (importaciones, deuda en USD), considera cubrir parte de tu exposición ahora aprovechando que el sol aún no ha cedido terreno adicional. Si eres exportador, evalúa no liquidar inmediatamente y esperar si el DXY corrige desde resistencias técnicas en 105.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14820474/pexels-photo-14820474.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e002',
    titulo: 'DXY rompe resistencia de 104.5: índice dólar en máximo de seis semanas tras datos de empleo de EE.UU.',
    descripcion: 'El índice dólar (DXY) superó la resistencia técnica de 104.5 puntos y cerró en 104.7, su nivel más alto desde finales de marzo, impulsado por nóminas no agrícolas de 215,000 empleos en abril y salarios que suben 4.1% anual.',
    contenido: `El informe de empleo de abril publicado este viernes sorprendió al mercado: se crearon 215,000 empleos no agrícolas frente a los 185,000 esperados, y la tasa de desempleo se mantuvo en 3.9%. Los salarios por hora promedio subieron 4.1% anual, por encima del 3.9% proyectado. El dato refuerza la narrativa de "economía fuerte, Fed sin prisa".

El DXY respondió rompiendo con fuerza la resistencia técnica de 104.5 puntos que había contenido cuatro intentos previos esta semana. El índice alcanzó un máximo intradía de 104.82 antes de cerrar en 104.7, un avance del 0.55% en la jornada y del 1.2% en la semana.

Las monedas emergentes sufrieron presión generalizada. El real brasileño cayó 0.8% a R$ 5.28/USD, el peso colombiano perdió 0.6% y el sol peruano retrocedió 0.3% desde S/ 3.661 hasta S/ 3.672 en la tarde. Los pares G10 también cedieron: el EUR/USD bajó a 1.0742 y el GBP/USD a 1.2518.

TradingView muestra el DXY apuntando hacia la resistencia de 105.2, que sería el siguiente objetivo técnico si el índice mantiene el impulso la semana próxima. El RSI (14) se ubica en 62, aún con margen antes de territorio de sobrecompra.`,
    analisis: `Un DXY que rompe resistencias históricas es la señal más directa de presión sobre el sol peruano. Históricamente, cada punto porcentual de apreciación del DXY se traduce en un encarecimiento de 0.5%-0.8% del dólar frente al PEN. Con el índice apuntando a 105.2, el sol podría retestear la zona de S/ 3.72-3.75 en las próximas jornadas.

Para quienes gestionan flujos de caja en dólares, este es un momento de revisar el mix de cobertura. Las opciones de tipo de cambio con strike en S/ 3.75 tienen primas razonables y ofrecen protección ante un escenario de DXY en 105+. Consulta con tu proveedor de cambios antes de que el mercado adelante el movimiento.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e003',
    titulo: 'Exportaciones peruanas crecen 19.2% en el primer trimestre: cobre, oro y agroexportaciones lideran el alza',
    descripcion: 'Las exportaciones totales del Perú sumaron US$ 16,840 millones en el Q1 2026, un incremento del 19.2% respecto al mismo período del año anterior. El cobre aportó el 38% del total, seguido del oro con 22% y las agroexportaciones con 15%.',
    contenido: `El Ministerio de Comercio Exterior publicó esta semana las cifras de exportaciones del primer trimestre de 2026. El resultado de US$ 16,840 millones supera ampliamente las proyecciones del MEF (US$ 15,200 millones) y establece un nuevo récord para un primer trimestre en la historia del país.

El cobre lideró el desempeño exportador con US$ 6,400 millones (+24% anual), beneficiado por precios spot que promedian US$ 4.82/lb en el período. Las mineras Las Bambas, Antamina y Cerro Verde operan a plena capacidad, y Quellaveco reportó producción récord de 105,000 TM en el trimestre.

Las agroexportaciones alcanzaron US$ 2,525 millones (+18%), impulsadas por arándanos, uvas, espárragos y paltas. Los productores de la costa norte y La Libertad consolidaron su posición en mercados de EE.UU., Europa y Asia. El oro exportó US$ 3,705 millones (+14%), a precios que superan los US$ 3,200/oz en el spot internacional.

El superávit comercial del Q1 se estima en US$ 4,100 millones, el más alto desde 2022. Este desempeño exterior fortalece las reservas internacionales del BCRP y provee soporte estructural al sol peruano frente a la volatilidad del dólar global.`,
    analisis: `Un superávit comercial récord es un ancla fundamental para la estabilidad del PEN/USD. Más dólares ingresando al sistema por exportaciones implica mayor oferta en el mercado cambiario local, lo que mitiga las presiones de depreciación incluso cuando el DXY se fortalece globalmente. Este dato explica en parte por qué el sol ha resistido mejor que sus pares regionales en las últimas semanas.

Para empresas con ingresos en dólares (exportadoras), el entorno es favorable para no precipitar la liquidación de divisas. Si el flujo exportador se mantiene en Q2, el BCRP tendrá menos necesidad de intervenir y el tipo de cambio podría oscilar en una banda más estrecha de S/ 3.65-3.75 durante el semestre.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2231744/pexels-photo-2231744.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e004',
    titulo: 'BCRP eleva reservas internacionales a US$ 77,200 millones: tercer nivel más alto de la historia',
    descripcion: 'El Banco Central de Reserva del Perú reportó reservas internacionales netas de US$ 77,200 millones al cierre de abril, equivalentes al 34% del PBI y 21 meses de importaciones. El nivel refuerza la capacidad de defensa del sol ante shocks externos.',
    contenido: `Las reservas internacionales netas del Perú cerraron abril en US$ 77,200 millones, según datos publicados este jueves por el BCRP. El nivel supera el registro de marzo (US$ 76,450 millones) y se ubica como el tercer monto más alto de la historia, solo por detrás de los máximos históricos de 2014 (US$ 79,200 millones) y enero 2023 (US$ 77,900 millones).

El incremento mensual de US$ 750 millones se explica por la acumulación de dólares del sector exportador, los intereses devengados sobre los activos externos y la valorización positiva del oro (que representa el 8.3% del portafolio). El BCRP compró US$ 420 millones en el mercado spot durante abril para mantener la estabilidad del tipo de cambio.

Las reservas equivalen al 34% del PBI, uno de los ratios más altos de América Latina, y cubren 21 meses de importaciones. Este colchón permite al banco central defender el sol ante episodios de turbulencia global sin comprometer la estabilidad macroeconómica.

El presidente del BCRP, Julio Velarde, destacó que las reservas "constituyen un seguro frente a la volatilidad externa" y que el banco está "en condiciones óptimas para responder ante cualquier escenario adverso" en los mercados financieros globales.`,
    analisis: `Un nivel de reservas de US$ 77,200 millones es el principal amortiguador del PEN/USD ante shocks externos. Cuando el DXY sube o los mercados emergentes sufren salidas de capital, el BCRP puede intervenir con fuerza vendiendo dólares para moderar la depreciación. Este nivel de reservas reduce significativamente el riesgo de un overshooting del tipo de cambio.

Para quienes operan en el mercado cambiario peruano, esto implica que movimientos bruscos del PEN serán probablemente atenuados por el banco central. No es un entorno para especular con depreciaciones abruptas; la estrategia racional es operar dentro de bandas y usar el mercado para cubrir exposiciones reales, no para apostar contra el sol.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e005',
    titulo: 'MEF mantiene proyección de déficit fiscal en 2.1% del PBI para 2026 pese a mayor gasto en infraestructura',
    descripcion: 'El Ministerio de Economía y Finanzas ratificó su meta de déficit fiscal del 2.1% del PBI para el año 2026, anunciando que el incremento del gasto en infraestructura será compensado con mayor recaudación tributaria y eficiencia en el gasto corriente.',
    contenido: `El ministro de Economía presentó este viernes ante la Comisión de Presupuesto del Congreso el Marco Macroeconómico Multianual actualizado. La proyección de déficit fiscal para 2026 se mantiene en 2.1% del PBI (equivalente a aproximadamente S/ 24,800 millones), dentro del límite establecido por la regla fiscal vigente.

El MEF anticipa que la recaudación tributaria crecerá 8.4% en términos reales este año, impulsada por el boom exportador y la expansión de la base tributaria formal. La SUNAT reportó recaudación récord en el Q1 2026 con S/ 47,200 millones, un avance del 14% respecto al mismo período de 2025.

El plan de infraestructura incluye S/ 8,200 millones en obras de riego, carreteras y saneamiento que serán ejecutados en los próximos 18 meses mediante obras por impuestos y asociaciones público-privadas. El ministro subrayó que estas inversiones no presionarán el déficit gracias al mecanismo de Obras por Impuestos.

Las calificadoras Moody's y Fitch mantienen el grado de inversión del Perú (Baa1 y BBB+ respectivamente) y han señalado que el manejo fiscal "disciplinado" es uno de los principales soportes del rating soberano en un contexto regional complicado.`,
    analisis: `La disciplina fiscal del MEF es un factor de soporte indirecto pero relevante para el PEN/USD. Un país con grado de inversión sólido y déficit controlado atrae más flujos de capital extranjero en busca de rendimiento, lo que genera demanda de soles y modera la presión sobre el tipo de cambio. El mantenimiento del rating soberano es clave para este mecanismo.

Si el déficit se mantiene en línea con lo proyectado, el riesgo de una depreciación estructural del sol es limitado. Para quienes planifican operaciones cambiarias a mediano plazo (6-12 meses), el fundamento fiscal peruano es un argumento para no sobrestimar el riesgo de un colapso del PEN y dimensionar coberturas con moderación.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386372/pexels-photo-4386372.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e006',
    titulo: 'Producción de cobre peruana alcanza récord trimestral de 682,000 TM en Q1 2026 impulsada por Las Bambas y Antamina',
    descripcion: 'El Ministerio de Energía y Minas reportó una producción de cobre de 682,000 toneladas métricas en el primer trimestre de 2026, récord histórico para un Q1. Las Bambas aportó 165,000 TM y Antamina 198,000 TM, mientras Quellaveco sumó 105,000 TM.',
    contenido: `La producción minera de cobre del Perú alcanzó 682,000 toneladas métricas en el primer trimestre de 2026, superando el récord anterior de 658,000 TM del Q1 2024. El dato consolida al Perú como el segundo productor mundial de cobre, por detrás de Chile, con una participación global del 11.8%.

Las Bambas, operada por MMG Limited, lideró con 165,000 TM gracias a la expansión de la fase 3 del tajo principal y la resolución definitiva de los conflictos comunitarios que habían limitado la capacidad en años anteriores. Antamina (BHP-Glencore-Teck) reportó 198,000 TM, beneficiada por las leyes de mineral más altas registradas desde 2019.

Quellaveco (Anglo American) produjo 105,000 TM, superando su propio récord del Q4 2025. Cerro Verde (Freeport-McMoRan) contribuyó con 112,000 TM, y las demás operaciones (Toromocho, Constancia, Las Cruces) sumaron las 102,000 TM restantes.

El precio promedio del cobre en el LME durante el trimestre fue de US$ 4.82/lb, lo que implica ingresos por exportaciones de cobre cercanos a US$ 7,200 millones en el Q1, con un impacto directo sobre las cuentas externas del país y las recaudaciones por canon minero de las regiones productoras.`,
    analisis: `La producción récord de cobre tiene un efecto multiplicador positivo sobre el PEN/USD. Cada tonelada de cobre exportada genera flujo de dólares que eventualmente se convierte en soles, incrementando la oferta de divisas en el mercado local. Con precios del cobre sostenidos por encima de US$ 4.50/lb y producción en máximos históricos, el fundamento cambiario del sol es sólido.

Para empresas proveedoras del sector minero o que reciben pagos en soles vinculados a contratos con mineras, el entorno es favorable. Quien tenga que convertir dólares a soles para pagar planillas u obligaciones locales encontrará un mercado con buena liquidez en los próximos meses. El flujo minero es el mayor proveedor estructural de dólares en el mercado peruano.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e007',
    titulo: 'Powell ante el Congreso: "No bajaremos tasas hasta tener confianza plena en la trayectoria de la inflación"',
    descripcion: 'El presidente de la Fed reiteró ante senadores y representantes que la política monetaria permanecerá restrictiva el tiempo que sea necesario. Los mercados de bonos reaccionaron con ventas, llevando el rendimiento del Tesoro a 10 años al 4.61%.',
    contenido: `Jerome Powell compareció este jueves en una sesión conjunta ante el Comité Bancario del Senado y la Comisión de Servicios Financieros de la Cámara de Representantes. Su mensaje fue consistente y firme: la Fed necesita "mayor confianza" en que la inflación converge al 2% de manera sostenible antes de actuar sobre las tasas.

El presidente señaló que el PCE subyacente —la medida de inflación preferida por la Fed— cerró en 2.8% en marzo y que las proyecciones del FOMC apuntan a que recién alcanzará el 2.2% en el Q4 2026. "Meses de buenos datos no son suficientes; necesitamos ver la tendencia consolidada", afirmó Powell.

Los mercados de bonos respondieron con ventas: el rendimiento del Tesoro a 2 años subió al 4.82% (+8pb en el día) y el de 10 años al 4.61% (+6pb). El S&P 500 cedió 0.4% pero el Nasdaq fue más resiliente al caer solo 0.2%, sostenido por resultados corporativos mejor de lo esperado en el sector tecnológico.

Tres miembros del FOMC —Waller, Kashkari y Bowman— respaldaron públicamente la postura de Powell esta semana. Solo el gobernador Goolsbee mantiene una posición más dovish, argumentando que "las condiciones financieras ya son suficientemente restrictivas". El próximo FOMC se celebrará el 17-18 de junio.`,
    analisis: `La postura hawkish de la Fed es la variable más importante para el mercado cambiario global en este momento. Tasas altas en EE.UU. atraen capital hacia activos en dólares, reduciendo el flujo hacia mercados emergentes y presionando sus monedas, incluido el sol peruano. Cada declaración de Powell que aleja el recorte de tasas es un viento en contra para el PEN.

Si tu empresa tiene deuda en dólares o contratos de importación por vencer en los próximos 90 días, considera si vale la pena comprar dólares hoy a S/ 3.672 antes de que el mercado anticipe más presión. El costo de oportunidad de cubrirse ahora puede ser menor al de operar en un mercado más caro en julio o agosto si la Fed mantiene el mensaje restrictivo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14820474/pexels-photo-14820474.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e008',
    titulo: 'PMI manufacturero de China sube a 51.3 en abril: mejor dato en 18 meses impulsa commodities',
    descripcion: 'El índice PMI manufacturero oficial de China subió a 51.3 puntos en abril desde 50.8 en marzo, superando las expectativas del mercado (50.9). El dato sugiere expansión robusta de la actividad industrial y dispara la demanda proyectada de metales industriales.',
    contenido: `El Buró Nacional de Estadísticas de China publicó esta semana el PMI manufacturero de abril: 51.3 puntos, el nivel más alto desde octubre de 2024 y el cuarto mes consecutivo de expansión (por encima de 50). El subíndice de nuevos pedidos subió a 53.2, el de producción a 54.1 y el de empleo se mantuvo estable en 48.9.

Los commodities respondieron con fuertes alzas. El cobre en el LME avanzó 2.1% hasta US$ 4.89/lb, acercándose a máximos del año. El mineral de hierro en Singapur subió 1.8% hasta US$ 118/TM. El aluminio ganó 1.4% y el zinc 1.9%. Solo el carbón coquizable mostró movimiento moderado (+0.6%).

El PMI de servicios Caixin-S&P Global también sorprendió al alza con 52.7 puntos (vs 51.9 esperado), reforzando la lectura de recuperación económica más amplia. Los analistas de Goldman Sachs revisaron al alza su proyección de crecimiento de China para 2026 desde 4.6% hasta 4.9% del PBI.

Para el Perú, cuyo 38% de las exportaciones tienen como destino China, la recuperación manufacturera china es directamente positiva. Más demanda industrial china significa mayor absorción de cobre, zinc y hierro peruanos, lo que sostiene los precios y el volumen exportado.`,
    analisis: `La recuperación manufacturera china es la mejor noticia estructural para el PEN en el corto plazo. Perú y China están directamente ligados vía commodities: cuando China crece, la demanda de cobre sube, los precios mejoran, las exportaciones peruanas aumentan y el flujo de dólares al país se acelera. Este ciclo virtuoso es un soporte real para la estabilidad del sol.

Para empresas con exposición al sector minero o agroexportador que venden a China, el dato de PMI sugiere un Q2 favorable en términos de precios y volúmenes. Si tienes flujos en dólares previstos por ventas a clientes chinos en los próximos meses, podrías evaluar no adelantar la liquidación de divisas y aprovechar un tipo de cambio más bajo si el sol se fortalece con el viento a favor del cobre.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31772145/pexels-photo-31772145.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e009',
    titulo: 'Goldman Sachs eleva proyección del oro a US$ 3,800/oz para fin de 2026 por demanda de bancos centrales',
    descripcion: 'El banco de inversión Goldman Sachs revisó al alza su objetivo de precio del oro desde US$ 3,500/oz hasta US$ 3,800/oz para diciembre de 2026, citando compras récord de bancos centrales y demanda de ETFs que supera expectativas previas.',
    contenido: `El equipo de commodities de Goldman Sachs publicó este viernes una nota de investigación elevando su proyección del oro para fin de año desde US$ 3,500/oz hasta US$ 3,800/oz. La revisión se apoya en tres factores: compras récord de bancos centrales (1,150 toneladas en 2025), flujos hacia ETFs de oro que acumulan 480 toneladas en lo que va de 2026, y la demanda de inversores retail en Asia que no muestra señales de moderarse.

El oro spot cotiza actualmente en US$ 3,421/oz, acumulando un avance del 18% en lo que va del año. Goldman indica que "el oro está siendo revalorizado como activo de reserva de largo plazo por bancos centrales que buscan diversificar lejos del dólar", un proceso que considera "estructural y no cíclico".

Los bancos centrales de China (PBoC), India (RBI) y Polonia fueron los mayores compradores en el Q1 2026, sumando 98 toneladas en conjunto. El PBoC lleva 18 meses consecutivos de compras netas, elevando sus reservas en oro al 5.2% del total de reservas, aunque aún lejos del 11-12% promedio de los bancos centrales desarrollados.

La nota de Goldman también menciona como catalizador alcista la posibilidad de que la Fed comience a recortar tasas en H2 2026, lo que reduciría el costo de oportunidad de mantener oro (que no paga intereses) y atraería nuevos flujos especulativos.`,
    analisis: `El oro en US$ 3,421/oz con objetivo de Goldman en US$ 3,800/oz tiene implicancias directas para el Perú, segundo productor mundial de oro. Precios altos implican mayores ingresos de exportación y mayor canon para regiones productoras como La Libertad, Cajamarca y Arequipa. Esto fortalece indirectamente el PEN al incrementar el flujo de divisas al país.

Para quienes tienen exposición al sector o invierten en empresas mineras peruanas, el entorno de oro en máximos históricos es positivo. A nivel cambiario, el efecto es el mismo que con el cobre: más exportaciones = más oferta de dólares = menor presión depreciatoria sobre el sol. Si el oro llega a US$ 3,800/oz, el impacto en el tipo de cambio PEN/USD podría ser de 1-2 soles menos de presión estructural.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16055836/pexels-photo-16055836.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e010',
    titulo: 'PEN/USD: dólar retrocede a S/ 3.672 en apertura del viernes tras intervención del BCRP',
    descripcion: 'El tipo de cambio PEN/USD abrió la jornada del viernes en S/ 3.672, retrocediendo desde el máximo de S/ 3.681 alcanzado el jueves. El BCRP reportó ventas de US$ 85 millones en el mercado spot para contener el avance del dólar.',
    contenido: `El mercado cambiario peruano inició la jornada del viernes con el dólar en S/ 3.672, luego de que el BCRP interviniera activamente el jueves vendiendo US$ 85 millones en el mercado spot para frenar el avance hacia S/ 3.685. La intervención fue la más cuantiosa de la semana y envió una señal clara al mercado sobre los niveles que el banco central considera incómodos.

Desde el punto de vista técnico, el PEN/USD muestra un soporte relevante en S/ 3.660, nivel donde confluyen la media móvil de 50 días y una línea de soporte histórico desde enero 2026. La resistencia inmediata se ubica en S/ 3.685 (máximo de la semana) y la resistencia fuerte en S/ 3.72, nivel no visitado desde octubre 2025.

El volumen de operaciones en la sesión del viernes se proyecta moderado (US$ 180-220 millones), típico de fin de semana con los mercados estadounidenses en modo post-dato de empleo. Los operadores locales observan de cerca el cierre del DXY en Nueva York para calibrar la apertura del lunes.

El diferencial de tasas entre la Fed (4.50%-4.75%) y el BCRP (4.75%) se ha comprimido, reduciendo el incentivo para mantener posiciones en soles frente al dólar. Sin embargo, el diferencial de crecimiento económico y el superávit comercial peruano siguen siendo factores de soporte para el PEN en el mediano plazo.`,
    analisis: `El tipo de cambio en S/ 3.672 con soporte en S/ 3.660 y resistencia en S/ 3.685 define el rango operativo de la semana. La intervención del BCRP por US$ 85 millones muestra que el banco central está dispuesto a defender niveles por encima de S/ 3.68. Esto da cierta certeza sobre el techo de corto plazo, aunque el entorno global (DXY fuerte, Fed hawkish) mantiene sesgo alcista para el dólar.

Para operaciones puntuales esta jornada: si necesitas dólares para pagos de importación o deuda, la apertura en S/ 3.672 es razonable. Si eres exportador y debes liquidar, considera hacerlo antes del cierre del lunes ante el riesgo de que el DXY continúe su tendencia alcista la próxima semana tras los datos de empleo de EE.UU.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e011',
    titulo: 'Petróleo WTI sube a US$ 99.8 ante tensiones en Medio Oriente: mercado descuenta riesgo de cierre del estrecho de Ormuz',
    descripcion: 'El crudo WTI avanzó 3.2% hasta US$ 99.8 por barril tras nuevas tensiones geopolíticas en el Golfo Pérsico. El mercado asigna un 18% de probabilidad a un cierre temporal del estrecho de Ormuz, por donde transita el 21% del petróleo global.',
    contenido: `El petróleo WTI superó el umbral de US$ 99/barril por primera vez desde enero de 2026, alcanzando un máximo intradía de US$ 100.2 antes de ceder levemente al cierre en US$ 99.8. El avance de 3.2% en la jornada se explica por nuevas tensiones en el estrecho de Ormuz, donde fuerzas hutíes anunciaron ejercicios militares que incluyeron el sobrevuelo de drones sobre rutas de navegación comercial.

El Brent también avanzó con fuerza, llegando a US$ 103.1/barril (+2.9%). Los diferenciales entre los dos crudos de referencia se ampliaron levemente, con el Brent manteniendo una prima de US$ 3.3 sobre el WTI, por debajo del promedio histórico de US$ 4-5.

Según las opciones de petróleo, el mercado asigna un 18% de probabilidad a que el crudo WTI supere US$ 110/barril antes de fin de agosto. Los inventarios de crudo en EE.UU. cayeron 2.8 millones de barriles en la semana, más de lo esperado, añadiendo presión alcista al precio.

Las refinerías peruanas —La Pampilla (Repsol) y Talara (Petroperú)— importan una porción de su crudo del Golfo, aunque también procesan petróleo de los lotes peruanos y ecuatorianos. Un WTI por encima de US$ 100 implica mayor presión sobre los costos de combustibles y energía en el mercado doméstico.`,
    analisis: `El petróleo a US$ 99.8/barril presiona la inflación global y, de manera indirecta, el tipo de cambio peruano. Precios de energía más altos encarecen importaciones, amplían el déficit de cuenta corriente y pueden generar presión depreciativa sobre el sol si el fenómeno persiste varios meses. El BCRP monitorea de cerca este vector inflacionario.

Para empresas con alto consumo energético (transporte, manufactura, agroindustria), es momento de revisar contratos de combustible y evaluar cobertura ante escenarios de WTI en US$ 105-110. Si además tienes exposición cambiaria (pagas en dólares por petróleo importado), la combinación de precio alto + dólar fortalecido por la Fed puede ser un golpe doble sobre los costos operativos.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/167676/pexels-photo-167676.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e012',
    titulo: 'Bitcoin se consolida en US$ 112,000 con volumen institucional récord: ETF spot acumulan US$ 2,100M en la semana',
    descripcion: 'Bitcoin opera en torno a US$ 112,000, sostenido por entradas netas de US$ 2,100 millones a ETF spot en EE.UU. durante la semana. BlackRock IBIT lidera con US$ 890 millones en entradas, mientras el mercado espera el próximo halving de 2028 como catalizador de largo plazo.',
    contenido: `Bitcoin cerró la sesión asiática en US$ 112,400, dentro del rango de consolidación de US$ 108,000-115,000 que mantiene desde hace tres semanas. El activo digital acumula un avance del 38% en lo que va de 2026 y opera a US$ 12,000 por debajo de su máximo histórico de US$ 124,200, alcanzado el 14 de marzo.

Los ETF spot de bitcoin en EE.UU. registraron la segunda semana de mayores entradas del año: US$ 2,100 millones netos, de los cuales US$ 890 millones correspondieron al IBIT de BlackRock, US$ 420 millones al FBTC de Fidelity y US$ 290 millones al ARKB de Ark Invest. Las salidas del GBTC de Grayscale se moderaron a solo US$ 45 millones, el nivel más bajo en meses.

El dominio de Bitcoin en el mercado cripto subió al 58.2%, su nivel más alto desde 2020, a medida que el capital institucional se concentra en BTC como "reserva de valor digital" antes de buscar rendimiento en altcoins. Ethereum subió 4.1% en la semana hasta US$ 3,420, y Solana avanzó 6.8% hasta US$ 198.

Los analistas de TradingView señalan que el soporte clave para BTC se ubica en US$ 105,000 (media móvil de 50 días) y la resistencia inmediata en US$ 115,000. Una ruptura de este último nivel abriría el camino hacia el máximo histórico de US$ 124,200 en el corto plazo.`,
    analisis: `Bitcoin en US$ 112,000 con flujos institucionales masivos no impacta directamente el PEN/USD, pero refleja el apetito por riesgo global: cuando los inversores compran activos de riesgo como BTC, también tienden a comprar activos de mercados emergentes, lo que puede ser favorable para el sol en el margen.

Para quienes tienen exposición en cripto en Perú y necesitan convertir a soles, el tipo de cambio actual de S/ 3.672 es un buen punto de referencia. Si tus ganancias en BTC están en dólares y debes liquidar a soles para cubrir gastos locales, hacerlo en jornadas de baja presión cambiaria (como la apertura de hoy) optimiza el resultado final de la operación.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e013',
    titulo: 'Argentina: dólar oficial a $1,415 y blue a $1,413, brecha negativa por primera vez en la historia del paralelo',
    descripcion: 'En un hecho histórico, el dólar paralelo (blue) en Argentina cotiza por debajo del oficial por primera vez desde que existe el mercado informal. La brecha negativa de $2 refleja la confianza en el programa económico del gobierno de Milei y el éxito del levantamiento del cepo cambiario.',
    contenido: `Argentina registró este viernes un hito sin precedentes en su historia cambiaria: el dólar blue cotizó a $1,413, por debajo del dólar oficial bancario que cerró en $1,415. La brecha, que históricamente llegó a superar el 200% durante el kirchnerismo, es ahora negativa por primera vez desde que el mercado paralelo existe como fenómeno estructural de la economía argentina.

El fenómeno se explica por el levantamiento del cepo cambiario en fases que el gobierno de Javier Milei completó en el primer trimestre de 2026. Con el acceso libre al mercado oficial de cambios, la demanda por el blue colapsó, ya que los agentes económicos pueden comprar dólares directamente en el sistema bancario sin restricciones por encima de determinados montos.

El Banco Central de la República Argentina (BCRA) acumula reservas netas positivas de US$ 8,200 millones por primera vez desde 2019, impulsadas por el acuerdo con el FMI (US$ 20,000 millones en desembolsos) y la balanza comercial superavitaria. El presidente del BCRA, Santiago Bausili, calificó la jornada como "el fin de una era distorsiva en la economía argentina".

El riesgo país de Argentina cayó a 480 puntos básicos, desde los 1,800 puntos de diciembre de 2023. Los bonos soberanos en dólares se apreciaron 2.3% en la jornada, y el Merval en dólares subió 4.1% hasta 2,840 puntos, su nivel más alto en la historia.`,
    analisis: `La estabilización cambiaria argentina, aunque no impacta directamente el PEN/USD, tiene implicancias regionales relevantes. Un Argentina con brecha cambiaria eliminada y reservas en positivo reduce el riesgo de contagio financiero regional, lo que beneficia indirectamente a mercados como el peruano que compiten por flujos de inversión de cartera.

Además, la normalización argentina abre oportunidades de comercio bilateral. Las empresas peruanas que exportan a Argentina (textiles, alimentos, servicios) operarán con mayor certeza cambiaria. Si tienes exposición comercial con Argentina, el nuevo entorno de tipo de cambio unificado simplifica la facturación y elimina el riesgo del gap blue vs. oficial que antes hacía inviables muchas operaciones.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e014',
    titulo: 'Inflación en Argentina baja a 2.7% mensual en abril: mínimo en cinco años y riesgo país cae a 480 puntos',
    descripcion: 'El INDEC reportó que la inflación mensual de Argentina fue del 2.7% en abril de 2026, la más baja desde mayo de 2021. El dato consolida el programa de estabilización de Milei y dispara el apetito inversor por activos argentinos.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) publicó este jueves la inflación de Argentina para abril: 2.7% mensual, por debajo del 3.2% de marzo y del 3.0% esperado por el mercado. La inflación acumulada en los primeros cuatro meses del año es del 12.8%, lo que proyecta una inflación anual 2026 en torno al 38-42%, frente al 211% que registró el país en 2023.

La desaceleración inflacionaria se explica por varios factores convergentes: la estabilidad cambiaria tras el levantamiento del cepo, la reducción del déficit fiscal a cero (el gobierno lleva 15 meses consecutivos de superávit primario), la moderación salarial y la caída de la demanda interna en sectores no esenciales durante el primer semestre del ajuste.

Los sectores con mayor deflación o menor inflación fueron alimentos y bebidas (1.8%), indumentaria (2.1%) y equipamiento del hogar (2.3%). Los servicios regulados (electricidad, gas, transporte) mostraron los mayores aumentos (4.8%), reflejando los ajustes de tarifas pendientes del proceso de desregulación.

El gobierno de Milei celebró el dato como la validación de su política de "motosierra y licuadora" y anticipó que la inflación mensual podría acercarse al 1.5%-2.0% antes de fin de año. El FMI, en su último review, calificó el programa argentino como "ejemplar en términos de consolidación fiscal".`,
    analisis: `La desinflación argentina es un dato positivo para la región y reduce el riesgo de que Argentina vuelva a ser un factor de inestabilidad financiera en América Latina. Para el Perú, esto significa menos presión de contagio regional y un entorno más estable para los flujos de capital hacia mercados emergentes de la región.

En términos prácticos para el tipo de cambio peruano, la estabilización argentina libera atención inversora hacia otros mercados de la región con fundamentos sólidos como el Perú. Si el apetito por riesgo LATAM mejora, el PEN podría beneficiarse marginalmente de mayores flujos de portafolio hacia bonos soberanos y activos peruanos denominados en soles.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'e015',
    titulo: 'Colombia sube tasa 25pb a 10.50% para frenar depreciación del peso que acumula caída del 8.5% en 2026',
    descripcion: 'El Banco de la República de Colombia elevó su tasa de interés de referencia en 25 puntos básicos hasta 10.50%, en una decisión dividida 4-3, para contener la depreciación del peso colombiano (COP) que acumula una caída del 8.5% frente al dólar en lo que va del año.',
    contenido: `La Junta Directiva del Banco de la República de Colombia votó este viernes por cuatro votos contra tres elevar la tasa de interés de referencia en 25 puntos básicos, desde 10.25% hasta 10.50%. La decisión sorprendió al mercado, que mayoritariamente esperaba una pausa en el ciclo de recortes que el banco había iniciado en septiembre de 2025.

El factor determinante fue la depreciación acumulada del peso colombiano: el USD/COP ha subido desde $4,250 en enero hasta $4,620 en la actualidad, una caída del 8.5% que ha generado presiones inflacionarias importadas. La inflación de Colombia cerró marzo en 5.8% anual, por encima del objetivo del 3% y resistiéndose a bajar al ritmo esperado.

El gobernador del banco central, Leonardo Villar, explicó que "la volatilidad cambiaria se ha convertido en un riesgo de segunda ronda para la inflación" y que la junta prefirió actuar preventivamente. Los tres miembros disidentes argumentaron que la economía colombiana, que creció apenas 1.8% en 2025, no está en condiciones de absorber otra alza de tasas sin comprometer el empleo.

El COP respondió con una apreciación inmediata del 1.2% hasta $4,565/USD tras el anuncio, pero los analistas dudan de la sostenibilidad del movimiento sin cambios en las condiciones externas (DXY y precios del petróleo, del que Colombia sigue siendo exportador neto).`,
    analisis: `La situación de Colombia ilustra el dilema que enfrentan los bancos centrales latinoamericanos cuando el dólar global se fortalece: si no suben tasas, la moneda se deprecia y la inflación importada se acelera; si las suben, frenan el crecimiento. El BCRP peruano enfrenta un dilema similar, aunque desde una posición mucho más sólida gracias a las reservas de US$ 77,200 millones.

La comparación con Colombia es instructiva para el mercado peruano: el sol ha resistido mejor (solo -1.2% en 2026 vs. -8.5% del COP) gracias al superávit comercial y las reservas del BCRP. Esto no significa que el PEN esté blindado, pero sí que tiene más margen antes de necesitar medidas defensivas extraordinarias. Para el corto plazo, el tipo de cambio PEN/USD en S/ 3.672 refleja un equilibrio razonable dado el contexto regional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-15T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd001',
    titulo: "Petroperú recibe 'salvavidas' de US$ 2,000 millones: el Gobierno aprueba financiamiento histórico sin afectar deuda pública",
    descripcion:
      'El Ejecutivo aprobó un crédito de hasta US$ 2,000 millones para Petroperú mediante un fideicomiso administrado por ProInversión con banca privada internacional. Los primeros US$ 500 millones estarán disponibles en dos semanas. El mecanismo no constituye deuda pública y tiene plazo de pago de 7 años.',
    contenido: `El Gobierno peruano aprobó un financiamiento de hasta US$ 2,000 millones para Petroperú a través de un fideicomiso administrado por ProInversión con banca privada internacional. Los primeros US$ 500 millones estarán disponibles en las próximas dos semanas; el monto total se habilitará en 8 a 10 semanas.

El mecanismo no constituye deuda pública ni afecta los límites de endeudamiento del país, y los recursos solo pueden destinarse a la compra de crudo y abastecimiento de combustibles. El plazo de devolución es de 7 años sin pagos iniciales obligatorios.

Carlos Herrera Descalzi, ex titular del Minem, señala que la refinería de Talara podría generar márgenes de US$ 40 por barril en condiciones actuales —comparado con US$ 10 en normalidad— permitiendo flujos de hasta US$ 1,400 millones anuales si procesa 100,000 barriles diarios. Sin embargo, el ex ministro de Economía Luis Miguel Castilla cuestiona si los ingresos de la empresa serán suficientes para honrar el crédito.

Petroperú abastece hasta el 85% del suministro de combustibles en la sierra y selva del país. Sin apoyo, su colapso habría generado inflación regional crítica y desabastecimiento en zonas vulnerables.`,
    analisis: `El acceso a financiamiento externo de gran escala sin impacto en el Tesoro Público es una señal positiva para la estabilidad fiscal peruana. Menos presión sobre el gasto público contribuye a mantener la confianza de los mercados en el sol y a contener presiones cambiarias en el corto plazo.

Desde la perspectiva forex, una mayor estabilidad fiscal reduce la prima de riesgo país, lo que puede fortalecer al PEN frente al dólar. Sin embargo, el riesgo operativo de Petroperú sigue siendo un factor a monitorear: cualquier deterioro en su situación financiera podría generar presión alcista sobre el tipo de cambio. Para quienes operan divisas, este es un escenario donde la gestión política y la operatividad de la empresa marcarán la dirección del PEN en los próximos meses.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd002',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31772145/pexels-photo-31772145.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  // ── GESTIÓN — 4 nacionales / regionales ───────────────────────────────────
  {
    id: 'd003',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd004',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd005',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2231744/pexels-photo-2231744.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd006',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  // ── GESTIÓN / BofA — INTERNACIONAL ────────────────────────────────────────
  {
    id: 'd007',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd008',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/167676/pexels-photo-167676.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd009',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  // ── TRADINGVIEW ────────────────────────────────────────────────────────────
  {
    id: 'd010',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd011',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/167676/pexels-photo-167676.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd012',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  // ── INFOBAE ────────────────────────────────────────────────────────────────
  {
    id: 'd013',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd014',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386372/pexels-photo-4386372.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'd015',
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
    fecha: '2026-05-14T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
