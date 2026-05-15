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
const HOY = '2026-05-15T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'f001',
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
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  },
  {
    id: 'f002',
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
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  },
  {
    id: 'f003',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
  },
  {
    id: 'f004',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  },
  {
    id: 'f005',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  },
  {
    id: 'f006',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
  },
  {
    id: 'f007',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=80',
  },
  {
    id: 'f008',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=80',
  },
  {
    id: 'f009',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=1200&q=80',
  },
  {
    id: 'f010',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80',
  },
  {
    id: 'f011',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80',
  },
  {
    id: 'f012',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80',
  },
  {
    id: 'f013',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&q=80',
  },
  {
    id: 'f014',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1621981386829-9b458080ee07?w=1200&q=80',
  },
  {
    id: 'f015',
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
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
