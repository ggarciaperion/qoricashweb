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
const HOY = '2026-08-21T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'j001',
    titulo: 'Oro alcanza máximos trimestrales tras promesa de recompra de bonos del Tesoro de EE.UU.',
    descripcion: 'El metal precioso repunta a máximos de tres meses impulsado por la intervención del Tesoro en el mercado de bonos, que avivó temores sobre la devaluación de la moneda estadounidense y el déficit fiscal. Inversores buscan refugio ante la debilidad del dólar.',
    contenido: `El oro alcanzó máximos trimestrales este jueves 21 de agosto, superando los US$ 2,820 por onza troy, impulsado por el anuncio del Tesoro de EE.UU. de un programa de recompra de bonos soberanos de largo plazo. La medida, destinada a estabilizar el mercado de renta fija tras semanas de alta volatilidad, fue interpretada por los mercados como señal de expansión del balance del gobierno federal, avivando los temores sobre la devaluación del dólar. El metal dorado, históricamente visto como refugio ante la inflación y el deterioro fiscal, respondió con una subida del 1.4% en la jornada, su mayor avance diario en seis semanas.

El contexto macroeconómico refuerza el apetito por oro: la deuda federal de EE.UU. superó los US$ 40 billones por primera vez en la historia, el Índice del Dólar (DXY) opera en mínimos de tres meses en 98.79, y los rendimientos de bonos a largo plazo cayeron parcialmente tras la intervención del Tesoro, reduciendo el costo de oportunidad de mantener oro. Los fondos cotizados en bolsa (ETF) vinculados al oro registraron entradas netas de US$ 1,200 millones solo esta semana, el mayor flujo semanal desde marzo de 2026.

Para el Perú, la suba del oro es una doble buena noticia: el país es el sexto productor mundial y primer productor de América Latina, con exportaciones de oro que representan aproximadamente el 20% de las exportaciones totales. Un precio del oro por encima de los US$ 2,800 genera mayores ingresos de divisas, fortalece la balanza comercial y contribuye a la solidez del sol peruano.`,
    analisis: `El alza del oro en máximos trimestrales, combinada con la debilidad del dólar (DXY en 98.79), crea un entorno favorable para el sol peruano. Cuando el dólar se debilita globalmente y el oro sube, las economías exportadoras de metales como Perú reciben un doble beneficio: más dólares por cada onza exportada y un tipo de cambio que tiende a apreciarse.

Si tienes dólares ahorrados y no los necesitas urgente, este contexto —dólar débil, sol en tendencia alcista— sugiere evaluar la conversión. Por el contrario, si planeas comprar dólares para viajes o importaciones, considera no esperar demasiado: los mínimos del DXY en 98.79 podrían generar un rebote técnico que eleve temporalmente el tipo de cambio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j002',
    titulo: 'Wall Street cierra semana en positivo: Nasdaq 100 rompe racha bajista y bonos se estabilizan',
    descripcion: 'Los mercados accionarios estadounidenses cierran la semana con alzas luego de cinco jornadas de caídas en el Nasdaq. La estabilización del mercado de bonos tras la intervención del Tesoro y la reducción de la aversión al riesgo impulsan el apetito por activos de mayor riesgo.',
    contenido: `Wall Street cierra la semana del 18-21 de agosto en terreno positivo, con el Nasdaq 100 rompiendo una racha bajista de cinco jornadas consecutivas. El índice tecnológico avanzó 1.8% en la sesión del jueves, impulsado por la recuperación de empresas de semiconductores, software empresarial y plataformas de inteligencia artificial. El S&P 500 sumó 1.2% y el Dow Jones Industrial Average avanzó 0.9%, consolidando una semana que comenzó con turbulencias por la volatilidad en el mercado de bonos soberanos.

El catalizador del rebote fue el anuncio del Tesoro de EE.UU. de un programa de recompra de bonos, que redujo los rendimientos del bono a 10 años en 8 puntos básicos y calló los temores más agudos de una disfunción en el mercado de renta fija. La estabilización de los bonos permitió que los inversores rotaran de vuelta hacia acciones de crecimiento, favoreciendo especialmente al sector tecnológico. Las criptomonedas también se beneficiaron del retorno del apetito por riesgo: Bitcoin avanzó 3.2% superando los US$ 98,000.

El mercado de opciones muestra una reducción en la compra de puts de protección, señal de que los inversores institucionales perciben que lo peor de la corrección ha pasado por ahora. Sin embargo, analistas advierten que los riesgos de fondo —deuda fiscal, incertidumbre comercial, elecciones en EE.UU.— no han desaparecido y podrían generar nuevos episodios de volatilidad en septiembre.`,
    analisis: `La recuperación de Wall Street y la estabilización de bonos es positiva para los mercados emergentes, incluido Perú. Cuando el apetito por riesgo regresa a mercados desarrollados, suele mejorar también el flujo hacia activos emergentes, lo que puede fortalecer el sol peruano. La Bolsa de Valores de Lima, que acumula 36% de ganancia en el año, podría ver un incremento adicional de interés inversor extranjero.

Para quienes tienen dólares e invierten en Perú, el contexto actual —con BVL en máximos y sol apreciándose— sugiere que el mercado local ofrece retornos atractivos en soles. Cambiar dólares a soles para invertir en activos peruanos puede ser una estrategia interesante si tu horizonte es de 6-12 meses.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j003',
    titulo: 'Dólar borra todas sus ganancias en 2026 frente al sol: USD/PEN cierra en S/ 3.355',
    descripcion: 'El dólar acumuló una caída de 0.27% en el año frente al sol peruano, cerrando el miércoles en S/ 3.355 según el BCRP. La fortaleza del sol refleja el buen desempeño de exportaciones mineras, estabilidad macroeconómica y debilidad global del dólar.',
    contenido: `El tipo de cambio USD/PEN cerró el miércoles 20 de agosto en S/ 3.355 según el tipo de cambio de referencia del Banco Central de Reserva del Perú (BCRP), consolidando una tendencia que ha borrado todas las ganancias del dólar frente al sol durante 2026. La apreciación acumulada del sol en el año es de aproximadamente 0.27%, un movimiento modesto pero significativo en el contexto de un dólar que se debilita a nivel global.

Los factores que respaldan al sol son múltiples: las reservas internacionales del BCRP superan los US$ 100,000 millones, las exportaciones de minerales —especialmente cobre y oro— mantienen altos ingresos de divisas, y la política monetaria del banco central está bien anclada con una tasa de referencia que equilibra control inflacionario y crecimiento económico. Adicionalmente, el debilitamiento global del dólar (DXY en mínimos de tres meses en 98.79) proporciona un viento de cola para el sol.

El mercado interbancario registró un volumen de operaciones de cambio ligeramente superior al promedio diario, con el precio spot oscilando entre S/ 3.348 y S/ 3.361 durante la jornada. Los bancos reportaron mayor demanda de soles por parte de empresas exportadoras que liquidan divisas, lo que presionó el tipo de cambio hacia la baja.`,
    analisis: `Con el sol en su mejor posición del año frente al dólar —borrando todas las ganancias de la divisa americana desde enero— quienes tienen dólares enfrentan una pregunta clave: ¿cambio ahora o espero? La tendencia actual favorece al sol, pero el rango S/ 3.348-3.361 muestra que hay resistencia a seguir bajando de ciertos niveles.

Si tienes dólares que no necesitas en el corto plazo y tu economía es en soles, cambiarlos ahora te permite capturar el sol en zona de fortaleza. Si eres importador o tienes compromisos en dólares, el tipo de cambio actual es relativamente favorable para comprar dólares con antelación antes de que la tendencia se revierta.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j004',
    titulo: 'Bolsa de Lima acumula 36% de ganancia en 2026: las oportunidades que quedan antes del cierre de año',
    descripcion: 'La Bolsa de Valores de Lima lidera ganancias en América Latina con un avance del 36% en lo que va del año, impulsada por la subida de metales preciosos e industriales. Analistas identifican sectores con potencial adicional antes de diciembre.',
    contenido: `La Bolsa de Valores de Lima (BVL) se consolida como una de las plazas bursátiles de mejor desempeño en América Latina en 2026, acumulando un avance superior al 36% en lo que va del año, medido por el Índice General de la BVL. La ganancia es impulsada principalmente por las acciones del sector minero —que representan más del 50% de la capitalización bursátil— beneficiadas por la suba del precio de metales como el cobre, oro, zinc y plata en los mercados internacionales.

Las empresas con mayor contribución al alza incluyen compañías de gran capitalización como Southern Copper, Buenaventura y Volcan, que han reportado resultados financieros sólidos en el primer semestre de 2026. Más allá del sector minero, el sector financiero también mostró dinamismo, con bancos peruanos registrando tasas de morosidad controladas y crecimiento en colocaciones de crédito de consumo e hipotecario.

Los analistas identifican sectores con potencial adicional: las acciones de empresas industriales y de consumo masivo se han rezagado respecto al mercado y podrían cerrar la brecha si el PBI peruano confirma una aceleración en el tercer trimestre. El sector energético también es visto como interesante dado que la masificación del gas natural —uno de los proyectos prioritarios del gobierno— podría impulsar la demanda y los márgenes de las empresas del sector.`,
    analisis: `La BVL con 36% de ganancia en 2026 es una señal de que la economía peruana y sus empresas están siendo valoradas positivamente por el mercado. Para quienes tienen ahorros en dólares, este contexto plantea una alternativa: convertirlos a soles e invertir en activos de la BVL podría generar retornos significativos.

Sin embargo, es importante recordar que las bolsas que suben mucho también corrigen. Con el mercado en zona de fuertes ganancias, los inversionistas más conservadores podrían preferir instrumentos de renta fija en soles —como fondos de depósitos o bonos soberanos peruanos— que ofrecen tasas atractivas sin la volatilidad de las acciones.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j005',
    titulo: 'Cobre roza récord histórico: prima por entrega inmediata señala escasez persistente de oferta',
    descripcion: 'Los futuros de cobre en la Bolsa de Metales de Londres operan cerca de máximos históricos, con la prima por entrega spot sobre los futuros a tres meses en niveles que reflejan escasez estructural. Perú, segundo productor mundial, se beneficia directamente del alza.',
    contenido: `El cobre se acerca a sus máximos históricos en la Bolsa de Metales de Londres (LME), donde el contrato spot supera los US$ 11,200 por tonelada métrica, a apenas 3% de los récords registrados en mayo de 2026. La señal más llamativa es la prima por entrega inmediata —conocida como "backwardation"— que los operadores especializados describen como señal inequívoca de escasez persistente de metal físico disponible para entrega. Esta configuración del mercado se da cuando la demanda inmediata supera la oferta disponible, presionando los precios al contado por encima de los contratos a futuro.

Los factores que mantienen la escasez son estructurales: la transición energética global demanda volúmenes crecientes de cobre para cables eléctricos, transformadores, vehículos eléctricos y turbinas eólicas, mientras que la oferta de nuevas minas se ve limitada por tiempos de desarrollo que van de 10 a 15 años. Los proyectos existentes en Perú, Chile y Congo tienen tasas de crecimiento de producción moderadas, insuficientes para satisfacer la demanda proyectada para 2030.

Perú, como segundo productor mundial de cobre con aproximadamente el 12% de la producción global, se encuentra en una posición privilegiada. Las grandes minas peruanas como Las Bambas, Cerro Verde, Antapaccay y Cuajone operan con márgenes operativos elevados a los precios actuales, lo que se traduce en mayores flujos de impuestos, regalías y canon minero para el Estado peruano y las regiones mineras.`,
    analisis: `El cobre en máximos implica más dólares ingresando a Perú: mayores exportaciones, más impuestos, más regalías. Este flujo de divisas fortalece al sol y puede presionar el tipo de cambio a la baja (menos soles por dólar). Para quienes manejan divisas regularmente, este contexto refuerza la tendencia de un sol firme en el corto plazo.

La escasez de cobre también es una señal de que la economía global sigue creciendo y demandando materias primas —un escenario positivo para economías exportadoras como Perú. Si tienes una perspectiva de largo plazo sobre el tipo de cambio, la fortaleza del sector minero peruano es un argumento sólido para que el sol mantenga su valor relativo frente al dólar en los próximos años.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j006',
    titulo: 'EE.UU. intensifica presión económica sobre Irán: impacto en petróleo y mercados emergentes',
    descripcion: 'El Secretario del Tesoro Scott Bessent anunció que EE.UU. escalará las sanciones económicas contra los socios comerciales de Irán. El petróleo acumula ganancia semanal mientras el mercado evalúa el impacto sobre la oferta global de crudo.',
    contenido: `El Secretario del Tesoro de EE.UU., Scott Bessent, anunció este jueves que Washington intensificará la campaña de presión económica contra Irán y sus socios comerciales, con nuevos detalles que se conocerán la próxima semana. La declaración —resumida en la frase "están con nosotros o contra nosotros"— es la más dura retórica económica de la administración Trump desde la reimposición de sanciones máximas a Irán en 2025. Los mercados interpretaron el anuncio como señal de una potencial reducción en las exportaciones de petróleo iraní, que en 2026 han alcanzado niveles récord a pesar de las sanciones previas gracias a compras de China y otros socios asiáticos.

El petróleo Brent respondió con un alza del 0.8% en la jornada, acumulando una ganancia semanal del 2.3%, impulsado por la expectativa de restricción de oferta iraní y los datos de inventarios de EE.UU. que mostraron una caída mayor a la esperada en las reservas de crudo comercial. Sin embargo, analistas advierten que el impacto real dependerá de si China y otros compradores de crudo iraní acatan las advertencias de Washington, algo que históricamente ha resultado parcial.

Para los mercados emergentes, la escalada de tensiones con Irán introduce un factor de riesgo geopolítico que podría generar volatilidad en los mercados de materias primas y divisas. Un petróleo más caro eleva los costos de importación para Perú —que es un importador neto de petróleo refinado— aunque el impacto es relativamente limitado dado el tamaño de la economía peruana y la disponibilidad de gas natural doméstico.`,
    analisis: `Un petróleo más caro tiene un efecto mixto para Perú: sube los costos de combustible importado (diesel, gasolina) pero también mejora los ingresos de Petroperú y aumenta el atractivo de la inversión en gas natural doméstico. Para el tipo de cambio, el impacto neto suele ser limitado porque Perú tiene una balanza comercial positiva que amortigua el efecto de costos energéticos más altos.

El riesgo geopolítico con Irán puede generar episodios de aversión al riesgo global que temporalmente fortalezcan el dólar y debiliten el sol. Sin embargo, mientras los fundamentos de la economía peruana se mantengan sólidos —reservas internacionales altas, exportaciones mineras fuertes, inflación controlada— cualquier debilidad del sol por factores externos debería ser transitoria.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/210990/pexels-photo-210990.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j007',
    titulo: 'Gas natural sube por ola de calor en Texas y pronósticos de demanda eléctrica récord',
    descripcion: 'Los futuros de gas natural en EE.UU. avanzan por encima del 2% ante pronósticos de temperaturas extremas en Texas y el sur del país que elevarán la demanda de energía termoeléctrica a niveles récord para el mes de agosto.',
    contenido: `Los futuros de gas natural Henry Hub en EE.UU. subieron más del 2% este jueves, impulsados por pronósticos meteorológicos que anticipan una ola de calor extrema en Texas, Louisiana y estados del sur durante la próxima semana. Los modelos climáticos proyectan temperaturas que podrían superar los 42°C en varias ciudades texanas, lo que elevaría la demanda de electricidad —generada en buena parte con gas natural— a niveles récord para esta época del año. La Administración de Información Energética de EE.UU. (EIA) reportó además una caída en los inventarios de gas natural de 36 mil millones de pies cúbicos durante la última semana, por encima de las expectativas de analistas que esperaban una reducción de 25 mil millones.

El mercado de gas natural ha sido uno de los más volátiles del año 2026. Tras un invierno particularmente frío en el norte de EE.UU. que drenó los inventarios, la prima estacional de verano se ha mantenido elevada por la demanda de los centros de datos de inteligencia artificial, que consumen cantidades masivas de energía eléctrica y gas para sus generadores de respaldo. La expansión de la infraestructura de exportación de GNL (gas natural licuado) también compite por el gas disponible doméstico.

Internacionalmente, los precios del GNL en Europa y Asia se han estabilizado tras los picos de 2025, pero siguen siendo elevados en perspectiva histórica. Para Perú, el gas natural de Camisea sigue siendo un factor de competitividad energética clave: los precios domésticos del gas son significativamente más bajos que los internacionales, lo que favorece a la industria manufacturera peruana.`,
    analisis: `El alza del gas natural en EE.UU. tiene impacto limitado directo sobre el tipo de cambio peruano, pero refuerza la narrativa de que la energía seguirá cara globalmente. Perú tiene la ventaja competitiva del gas de Camisea, que permite a las industrias locales operar con costos energéticos más bajos que sus competidores regionales.

Para los mercados de divisas, los altos precios de energía en EE.UU. pueden generar presión inflacionaria adicional, complicando la decisión de la Fed sobre tasas. Si la inflación en EE.UU. repunta por costos de energía, la Fed podría mantener tasas altas por más tiempo —lo que teóricamente fortalece el dólar— pero el mercado actualmente descuenta este escenario dado el contexto de debilidad fiscal.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534229/pexels-photo-534229.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j008',
    titulo: 'Lima supera 6 millones de empleos por primera vez: crecimiento de 22% desde la pandemia',
    descripcion: 'La capital peruana alcanzó casi 6 millones de puestos de trabajo en 2026, marcando la recuperación completa del empleo post-pandemia con un crecimiento del 22% desde 2019. El dato refleja la resiliencia del mercado laboral limeño, aunque con alertas sobre calidad y formalidad.',
    contenido: `Lima Metropolitana superó la barrera de los 6 millones de puestos de trabajo por primera vez en su historia, alcanzando 5,980,000 empleos en el segundo trimestre de 2026 según datos del Instituto Nacional de Estadística e Informática (INEI). El hito representa un crecimiento del 22% respecto a los niveles pre-pandemia de 2019 (cuando la capital tenía aproximadamente 4.9 millones de empleados) y marca la recuperación completa y superación del choque de empleo generado por el Covid-19.

La distribución sectorial del empleo muestra que el sector servicios —comercio, restaurantes, transporte, telecomunicaciones y servicios financieros— concentra la mayor parte del crecimiento, mientras que el sector manufacturero y construcción también muestran recuperación. El empleo en tecnología y servicios digitales creció con especial rapidez, reflejando la transformación de la economía limeña hacia sectores de mayor valor agregado.

Sin embargo, los analistas advierten que el crecimiento en número de empleos no es sinónimo de mejora en calidad: la tasa de informalidad laboral en Lima sigue siendo superior al 55%, y una porción significativa de los nuevos empleos corresponde a trabajo por cuenta propia o en la economía de plataformas (delivery, transporte, servicios on demand), que no siempre cuenta con beneficios sociales completos. El ingreso promedio laboral real creció apenas 1.8% interanual, por debajo de la inflación acumulada.`,
    analisis: `El crecimiento del empleo en Lima es una señal positiva para la economía peruana: más personas empleadas significa mayor consumo, más ahorro y más movimiento en el sistema financiero. Esto es positivo para la estabilidad del sol, pues una economía interna sólida reduce la dependencia de factores externos para sostener el crecimiento.

Para el tipo de cambio, un mercado laboral robusto tiende a mantener la inflación controlada (cuando la productividad crece junto con el empleo) y reduce la probabilidad de que el BCRP necesite bajar tasas agresivamente —lo que ayuda a sostener el atractivo del sol como moneda para mantener ahorros.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j009',
    titulo: 'Gobierno peruano autoriza 240 proyectos mineros en 2026 para relanzar la inversión privada',
    descripcion: 'El Ministerio de Energía y Minas se propone aprobar 240 proyectos de exploración y explotación minera este año, con énfasis en certeza jurídica y estándares ambientales. El plan busca posicionar a Perú como destino de inversión minera de primer orden en la región.',
    contenido: `El Ministerio de Energía y Minas del Perú anunció que su meta para 2026 es autorizar un total de 240 proyectos mineros entre exploración y explotación, el mayor volumen de autorizaciones en la última década. La iniciativa forma parte de la estrategia del gobierno para reactivar la inversión privada en el sector, que ha sido afectado en años recientes por conflictos socioambientales, incertidumbre regulatoria y demoras en los procesos de licenciamiento ambiental.

El plan incluye medidas para acelerar la certificación ambiental de proyectos: el Servicio Nacional de Certificación Ambiental para las Inversiones Sostenibles (SENACE) contará con más personal y recursos para reducir los plazos promedio de evaluación de estudios de impacto ambiental, que actualmente promedian 36 meses. El gobierno también anunció la creación de una ventanilla única para la tramitación de permisos mineros, que integrará a varios ministerios y reducirá duplicidades.

Sin embargo, expertos en conflictividad social advierten que el plan carece de medidas concretas para abordar la desconfianza de las comunidades campesinas e indígenas en zonas de influencia minera, así como para combatir la minería ilegal que compite con los proyectos formales. La experiencia pasada muestra que las autorizaciones administrativas son condición necesaria pero no suficiente para que los proyectos lleguen a producción efectiva.`,
    analisis: `240 proyectos mineros autorizados significan más inversión extranjera directa, más empleo formal y más divisas entrando a la economía peruana en los próximos años. Cada proyecto aprobado hoy es producción y exportación de minerales en 5-10 años, lo que fortalece la perspectiva de largo plazo del sol peruano.

En el corto plazo, el anuncio refuerza la señal de que el Perú mantiene su orientación pro-inversión, lo que puede atraer capital extranjero hacia la economía local —beneficiando tanto a la BVL como al tipo de cambio. Para quienes evalúan mantener ahorros en soles vs. dólares, la solidez del sector minero peruano es un argumento de mediano plazo a favor del sol.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2068975/pexels-photo-2068975.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j010',
    titulo: 'Bancos peruanos endurecen créditos ante riesgo de El Niño: qué significa para ahorristas e inversionistas',
    descripcion: 'Las instituciones financieras peruanas anticipan un endurecimiento de los estándares crediticios como medida preventiva ante el riesgo de daños por el Fenómeno El Niño. El ajuste podría beneficiar a los ahorristas mediante mejores tasas de depósito.',
    contenido: `Los principales bancos y financieras del Perú están adoptando criterios más estrictos para la evaluación de créditos en zonas de riesgo ante el Fenómeno El Niño 2026-2027, que los modelos climatológicos señalan con una probabilidad de moderada a fuerte. Según fuentes del sector financiero, las instituciones están reduciendo los límites de crédito para pequeñas empresas en regiones expuestas (Piura, Lambayeque, La Libertad, La Selva Central) y exigiendo mayores garantías en operaciones de comercio exterior vinculadas a agroexportaciones del norte del país.

El endurecimiento crediticio busca anticiparse a un posible incremento en la tasa de morosidad: la experiencia del El Niño de 1997-1998 mostró que los pequeños negocios en zonas inundables tardan entre 12 y 24 meses en recuperar su capacidad de pago tras un evento extraordinario. La Superintendencia de Banca, Seguros y AFP (SBS) también ha emitido circulares reforzando los requerimientos de provisiones para créditos en zonas de riesgo.

Para los ahorristas, el endurecimiento crediticio tiene un efecto paradójico positivo: cuando los bancos reducen su apetito por colocaciones riesgosas, suelen aumentar las tasas de depósito para mantener su base de fondeo estable. Esto puede traducirse en mejores condiciones para depósitos a plazo fijo en soles en los próximos meses.`,
    analisis: `El contexto de El Niño es un factor de incertidumbre para el sol peruano: si el evento es intenso, podría reducir la producción agrícola, elevar la inflación de alimentos y presionar al BCRP a ajustar su política monetaria. Sin embargo, el sector bancario peruano está bien capitalizado y la SBS tiene una supervisión activa, lo que reduce el riesgo de un impacto sistémico.

Para los ahorristas en soles, las mayores tasas de depósito que podrían resultar del endurecimiento crediticio son una oportunidad. Si tienes soles líquidos, consulta las tasas de depósitos a plazo en tu entidad financiera: podrían estar mejorando. Si cambias dólares a soles para ahorrar, considera los depósitos en soles como una opción de bajo riesgo con retorno atractivo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j011',
    titulo: 'Promesa de recompra de bonos del Tesoro presiona al dólar: analistas comparan con política del Banco de Japón',
    descripcion: 'La intervención del Tesoro de EE.UU. en el mercado de bonos genera comparaciones con las controvertidas políticas de control de curva de rendimiento del Banco de Japón, que resultaron en la debilidad prolongada del yen. El dólar cede terreno ante la perspectiva de expansión del balance federal.',
    contenido: `El anuncio del Tesoro de EE.UU. de un programa de recompra de bonos soberanos de largo plazo ha desatado un debate entre los estrategas de divisas globales: varios analistas de primera línea están trazando paralelos entre la política estadounidense y el controvertido programa de "Yield Curve Control" (YCC) del Banco de Japón, que durante años mantuvo artificialmente bajos los rendimientos del yen y resultó en la depreciación histórica de la moneda japonesa frente al dólar.

Geoffrey Yu, estratega senior de BNY, fue más allá y señaló que aunque las circunstancias son diferentes —el Tesoro no está fijando un techo para los rendimientos, sino recomprando bonos selectivamente— el efecto de mercado puede ser similar si la medida se percibe como monetización encubierta de deuda fiscal. "El mercado premia la disciplina fiscal. Cuando el gobierno más endeudado del mundo empieza a intervenir en su propio mercado de bonos, la pregunta obvia es quién comprará los bonos que el gobierno no puede vender", señaló Yu en una nota a clientes.

El dólar cayó 0.6% en la jornada ante estas expectativas, con el DXY tocando nuevos mínimos de tres meses en 98.65 durante la sesión antes de recuperarse parcialmente hasta 98.79. El euro avanzó a 1.142 frente al dólar, la libra esterlina se apreció a 1.339, y el yen japonés —en situación peculiar— se fortaleció a 142 por dólar dado que Japón está en proceso inverso: el Banco de Japón está normalizando su política y subiendo tasas.`,
    analisis: `Si el dólar entra en una fase de debilitamiento estructural similar a lo que ocurrió con el yen japonés, el impacto para los tenedores de dólares en Perú sería significativo: cada dólar compraría menos soles con el tiempo. Este es el escenario que justifica mantener una cartera equilibrada entre monedas.

Para quienes tienen ahorros mixtos (dólares y soles), el contexto actual sugiere no concentrar demasiado en dólares. La comparación con el yen es llamativa: el yen pasó de 115 a 160 por dólar entre 2022 y 2024 cuando Japón mantenía tasas ultra-bajas. Si EE.UU. sigue un camino de expansión fiscal sin control, el dólar podría seguir cediendo terreno a mediano plazo frente a monedas de economías con mejores fundamentos fiscales.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j012',
    titulo: 'Euro en perspectiva bajista: estratega de BNY anticipa debilitamiento adicional desde niveles actuales',
    descripcion: 'Geoffrey Yu de BNY Mellon proyecta una continuación de la tendencia bajista del euro frente al dólar, pese al buen desempeño reciente de las bolsas europeas. Las divergencias en política monetaria y la incertidumbre sobre el crecimiento de la eurozona pesan sobre la moneda única.',
    contenido: `Geoffrey Yu, estratega senior de divisas en BNY Mellon, emitió una nota a clientes este jueves en la que anticipa un debilitamiento adicional del euro frente al dólar desde los niveles actuales alrededor de EUR/USD 1.142. Según Yu, aunque el buen desempeño de las bolsas europeas —que han atraído flujos de capital internacional— da soporte temporal al euro, las divergencias estructurales entre la economía de la eurozona y la de EE.UU. pesan en contra de la moneda única en el mediano plazo.

Los argumentos de Yu para una visión bajista del euro incluyen: el diferencial de tasas de interés aún favorece al dólar a pesar del reciente debilitamiento del DXY; el crecimiento económico de la eurozona sigue siendo modesto (1.1% proyectado para 2026 vs. 2.3% en EE.UU.); la crisis energética europea, aunque mitigada respecto a 2022-2023, sigue generando costos superiores para la industria; y las tensiones políticas en Francia, Italia y Alemania añaden una prima de riesgo político a los activos europeos.

El estratega sí reconoce que los flujos de inversión desde EE.UU. hacia Europa —motivados por las valoraciones más baratas de las bolsas europeas— podrían dar soporte transitorio al euro. Pero en su escenario base, el par EUR/USD retrocede hacia 1.08-1.10 en un horizonte de seis meses.`,
    analisis: `Para el Perú, un euro más débil frente al dólar tiene un impacto indirecto: si el euro cae, el dólar se fortalece globalmente, lo que presiona el sol peruano. Sin embargo, el efecto se filtra de manera compleja: Perú exporta principalmente en dólares y la mayoría de sus reservas internacionales están denominadas en dólares, por lo que un euro más débil no afecta directamente la economía peruana de la misma manera que lo haría una caída del yuan o del real.

Para empresas peruanas que importan de Europa o que tienen socios comerciales en la eurozona, un euro más débil puede ser una oportunidad para renegociar contratos o comprar maquinaria y equipos europeos a precios más convenientes en soles o dólares.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3483098/pexels-photo-3483098.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j013',
    titulo: 'Reforma tributaria en Perú: gobierno evalúa simplificar 28 exoneraciones fiscales por S/ 13 mil millones',
    descripcion: 'El Premier Luis Galarreta anunció una revisión de las 28 exoneraciones tributarias vigentes, que en 2026 representan S/ 13 mil millones en gasto tributario. La mayor es la exoneración del IGV al agro (S/ 4,600 millones). El objetivo es ampliar la base tributaria sin subir tasas.',
    contenido: `El Presidente del Consejo de Ministros, Luis Galarreta, anunció que el gobierno revisará las 28 exoneraciones tributarias actualmente vigentes en el Perú, que en conjunto representan un gasto tributario de aproximadamente S/ 13,000 millones en 2026 —equivalente a cerca del 1.2% del PBI. La medida forma parte de una estrategia más amplia para mejorar la recaudación fiscal sin incrementar las tasas del Impuesto a la Renta ni el IGV, buscando en cambio ampliar la base tributaria y eliminar beneficios que han perdido su justificación económica.

La exoneración más grande es la del IGV aplicable al sector agropecuario, que representa S/ 4,600 millones anuales y es políticamente sensible por su impacto en los pequeños agricultores y agroexportadores. Le siguen las exoneraciones a la Amazonía, zonas francas y sectores específicos como el pesquero y el forestal. El gobierno planea realizar un análisis costo-beneficio de cada exoneración, evaluando su impacto real en el sector al que beneficia y su potencial de distorsión económica.

El Premier señaló que el Perú no puede crecer sosteniblemente si formalizar una empresa "la castiga": la reforma busca también simplificar los regímenes tributarios especiales (RUS, Régimen Especial, Régimen MYPE Tributario) para reducir las barreras a la formalización. Actualmente, la presión tributaria del Perú es de 16.4% del PBI, muy por debajo del promedio regional de 22% y del promedio OCDE de 34%.`,
    analisis: `Una reforma tributaria exitosa que amplíe la base sin subir tasas es positiva para el sol peruano: más recaudación significa menor déficit fiscal, menor necesidad de endeudamiento y mayor credibilidad macroeconómica. Los mercados de bonos soberanos peruanos y el tipo de cambio podrían beneficiarse si la reforma avanza con éxito en el Congreso.

El riesgo político es real: eliminar exoneraciones tiene perdedores concretos (agricultores, empresas de Amazonía, zonas francas) que pueden generar resistencia legislativa y social. El mercado monitoreará si el gobierno tiene la capacidad política para implementar la reforma, pues el fracaso podría generar dudas sobre la sostenibilidad fiscal peruana.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j014',
    titulo: 'Agroexportaciones: producción de uva sube en Arequipa mientras aguacate ajusta por El Niño en Olmos',
    descripcion: 'Pampa Baja, en Ica y Arequipa, reporta un aumento en la producción de uvas para exportación, aprovechando el buen clima en el sur del país. En contraste, los productores de aguacate de Olmos (Lambayeque) ajustan a la baja sus proyecciones por el impacto del calor extremo.',
    contenido: `El sector agroexportador peruano muestra un panorama diferenciado según las zonas geográficas y cultivos. En el sur del país, Pampa Baja —zona agrícola ubicada entre Ica y Arequipa— reporta un incremento en la producción de uvas de exportación para la temporada 2026-2027, beneficiada por condiciones climáticas favorables y mejoras en técnicas de irrigación y manejo agronómico. Los exportadores de la zona proyectan un crecimiento del 12% en volumen de uva exportada respecto a la temporada anterior, principalmente hacia mercados de EE.UU., Europa y China.

En contraste, el norte del país —y en particular las plantaciones de aguacate (palta) en Olmos, Lambayeque— reporta una revisión a la baja en las proyecciones de producción para la temporada 2026-2027. Las altas temperaturas asociadas al inicio del Fenómeno El Niño han generado estrés térmico en los árboles de aguacate durante la fase de cuajado del fruto, reduciendo el número de frutos viables por árbol. La Asociación de Exportadores (ADEX) estima que la producción de aguacate en Olmos podría caer entre 8% y 15% respecto al año anterior.

Las agroexportaciones peruanas en total acumulan un crecimiento del 7.3% en los primeros siete meses de 2026, impulsadas por uva, arándanos, espárragos y quinua. El aguacate —que fue el producto agroexportador de mayor crecimiento en los últimos cinco años— podría ver una contracción temporal que abre espacio para competidores como México y Chile en los mercados internacionales.`,
    analisis: `Las agroexportaciones son la segunda fuente de divisas para el Perú después de la minería, y su performance impacta directamente en el flujo de dólares hacia la economía. Una caída en el aguacate (palto) se compensa parcialmente con el alza en uvas y otros productos, manteniendo el flujo de divisas en niveles positivos.

Para el tipo de cambio, el impacto neto de los ajustes agroexportadores parece manejable en el corto plazo. Sin embargo, si El Niño se intensifica y afecta más cultivos, el menor ingreso de divisas agrícolas podría debilitar marginalmente el sol. Los exportadores afectados que necesiten soles ahora podrían beneficiarse de convertir sus dólares antes de que la tendencia del tipo de cambio cambie.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919799/pexels-photo-8919799.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j015',
    titulo: 'Semiconductores de memoria pierden momentum: el "smart money" rota desde IA hacia otros sectores',
    descripcion: 'Tras un fuerte primer semestre impulsado por la demanda de chips de memoria para inteligencia artificial, el sector enfrenta presión bajista. Los inversores institucionales registran salidas netas de acciones de fabricantes de DRAM y NAND flash, rotando hacia otros sectores tecnológicos.',
    contenido: `Las acciones de fabricantes de semiconductores de memoria —DRAM y NAND flash— enfrentan una pérdida de momentum en los mercados financieros, después de un primer semestre de 2026 excepcional que llevó a empresas como Micron, SK Hynix y Samsung a máximos de varios años. Los datos de flujos institucionales muestran salidas netas de las acciones del sector durante las últimas tres semanas, con el "smart money" —inversores de fondos de cobertura y carteras institucionales grandes— rotando hacia semiconductores de uso general, ciberseguridad e infraestructura en la nube.

El cambio de posicionamiento no refleja dudas sobre la demanda de largo plazo de chips para inteligencia artificial, sino una preocupación más táctica: los precios de la memoria DRAM y NAND han subido más del 80% desde el mínimo de 2023, y el consenso de analistas anticipa que el ciclo alcista podría moderarse en el segundo semestre a medida que los fabricantes expanden su capacidad de producción. La relación precio-ganancia del sector cotiza en múltiplos cercanos a los máximos históricos, dejando poco margen para nuevas sorpresas positivas.

JPMorgan revisó al alza su precio objetivo para Deere & Company —fabricante de maquinaria agrícola— lo que junto con los flujos salientes de semiconductores sugiere que el mercado está girando hacia sectores más defensivos o cíclicos con mejores perspectivas de producción a corto plazo. El sector tecnológico en su conjunto sigue siendo positivo, pero el liderazgo está cambiando dentro del mismo.`,
    analisis: `La rotación desde semiconductores de memoria hacia otros sectores es una señal de madurez del ciclo de IA en los mercados financieros. Para el Perú, este dato es relevante porque la infraestructura digital global —que requiere chips de memoria— es parte del ecosistema en el que operan las empresas de tecnología financiera como Qoricash.

Para el tipo de cambio peruano, la rotación sectorial en Wall Street tiene un impacto limitado directo, pero si genera una corrección más amplia en el mercado tecnológico, podría afectar la aversión al riesgo global y temporalmente fortalecer el dólar. En ese escenario, el sol podría ceder terreno transitoriamente, creando una ventana para quienes buscan comprar dólares a precios convenientes.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5207262/pexels-photo-5207262.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i001',
    titulo: 'Deuda nacional de EE.UU. supera los US$ 40 billones por primera vez en la historia',
    descripcion: 'El Tesoro estadounidense confirmó que la deuda pública cruzó el umbral de US$ 40 billones tras duplicarse en la última década. Los rendimientos de bonos a 30 años alcanzaron el nivel más alto en casi 20 años, presionando al dólar a mínimos de tres meses.',
    contenido: `La deuda nacional de Estados Unidos superó oficialmente los US$ 40 billones (trillones en notación anglosajona) esta semana, un hito histórico que llegó tras haberse duplicado en apenas diez años. El Tesoro confirmó la cifra en su reporte diario de saldo de deuda pública, encendiendo alarmas entre analistas de mercados y gestores de bonos soberanos. El dato coincide con un entorno de tasas elevadas: el rendimiento del bono del Tesoro a 30 años trepó al nivel más alto desde principios de la década de 2000, superando el 5.2% anual, lo que encarece el servicio de la deuda federal de forma significativa.

La acumulación de deuda refleja años de déficits fiscales estructurales amplificados por los paquetes de estímulo post-pandemia, la Ley de Reducción de la Inflación y los recientes compromisos de gasto en infraestructura y defensa. El Congreso debate actualmente la elevación del techo de deuda, mientras la administración Trump presiona por nuevas rebajas impositivas que los analistas advierten podrían sumar varios billones de dólares adicionales en los próximos diez años. El mercado de swaps de incumplimiento crediticio (CDS) sobre deuda soberana de EE.UU. a 5 años registra ligeros aumentos, aunque el consenso descarta un impago.

El impacto inmediato se siente en el mercado de divisas: el Índice del Dólar (DXY) cayó a mínimos de tres meses en 98.79, el nivel más bajo desde mayo de 2026, mientras los inversores rotan hacia activos refugio alternativos como el oro y el franco suizo. La presión sobre el dólar beneficia a monedas emergentes como el sol peruano, que encontró soporte en la sesión de hoy.`,
    analisis: `Para el mercado de divisas peruano, un dólar debilitado a nivel global es una señal positiva de corto plazo. El PEN/USD tiende a fortalecerse cuando el DXY cae, lo que significa que quienes tienen dólares y esperan convertirlos a soles obtendrán menos soles por cada dólar. Si tienes dólares que no necesitas de inmediato, este podría ser un buen momento para evaluar la conversión antes de que el sol se aprecie aún más.

Si por el contrario tienes obligaciones en dólares —pagos de importaciones, deuda externa o nómina en divisas— considera adelantar compras de dólares antes de que el tipo de cambio continúe bajando. La volatilidad en el mercado de bonos americano puede generar episodios de apreciación súbita del dólar también, por lo que diversificar el riesgo cambiario con coberturas escalonadas es la estrategia más prudente en este entorno.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i002',
    titulo: 'Dólar cae a mínimos de tres meses: DXY en 98.79 mientras el Tesoro interviene el mercado de bonos',
    descripcion: 'El Índice del Dólar opera en 98.79, nivel no visto desde mayo 2026, con indicadores de momentum en zona de sobreventa extrema. El Tesoro de EE.UU. anunció medidas para calmar la volatilidad en los bonos del gobierno, lo que redujo temporalmente la aversión al riesgo.',
    contenido: `El Índice del Dólar (DXY) opera este miércoles en 98.79, marcando mínimos de tres meses y extendiendo una racha bajista que acumula más del 3.5% de caída en agosto. El debilitamiento del dólar responde a una confluencia de factores: la publicación de datos de deuda federal que superaron los US$ 40 billones, las dudas sobre el apetito global por bonos del Tesoro americano y las señales de que la Reserva Federal no tiene prisa por subir tasas de forma agresiva. El indicador ADX del DXY supera los 50 puntos, señal técnica de tendencia bajista con momentum extremo.

El Tesoro de EE.UU. anunció medidas para estabilizar el mercado de bonos, incluyendo recompras selectivas de títulos de largo plazo y comunicación de que la oferta primaria de bonos se moderará en los próximos meses. La respuesta inicial de los mercados fue positiva: los rendimientos del bono a 10 años cedieron 8 puntos básicos en la jornada, reduciendo la presión vendedora sobre el dólar. Sin embargo, analistas advierten que la intervención es temporal y que el déficit fiscal estructural seguirá pesando sobre el dólar.

Para el par USD/PEN, el contexto es favorable para el sol: el dólar débil combinado con datos económicos peruanos sólidos —reservas internacionales por encima de US$ 100,000 millones, exportaciones mineras récord y BCRP con política monetaria anclada— crea un escenario donde el tipo de cambio podría seguir bajo presión bajista en el corto plazo.`,
    analisis: `El DXY en 98.79 con ADX superior a 50 indica que la tendencia bajista del dólar tiene momentum significativo. Para quienes operan el par USD/PEN, este entorno sugiere que el sol podría seguir apreciándose. Sin embargo, los niveles de soporte del DXY en torno a 97.50-98.00 son zonas donde podría rebotar, generando un movimiento temporal de fortaleza del dólar.

Si estás planificando una operación de cambio de dólares a soles para los próximos días, la tendencia actual juega a tu favor. Para importadores que necesitan dólares, la recomendación es no esperar demasiado: los mínimos de tres meses en el DXY suelen ser seguidos de rebotes técnicos que elevan el tipo de cambio temporalmente.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i003',
    titulo: 'Agro Fergi apunta a mercados asiáticos ante costos logísticos elevados en Medio Oriente',
    descripcion: 'La agroexportadora peruana diversifica su cartera de destinos hacia Asia por el encarecimiento del flete marítimo hacia el Medio Oriente, proyectando un crecimiento del 10% en ventas para el año.',
    contenido: `La empresa agroexportadora Agro Fergi anunció un giro estratégico en su política comercial: reducirá gradualmente su exposición al mercado de Medio Oriente y acelerará su penetración en mercados asiáticos como Japón, Corea del Sur, Singapur y China. El cambio responde al significativo encarecimiento de los fletes marítimos hacia el Golfo Pérsico, que escalaron más del 35% en lo que va del año como consecuencia del conflicto entre Israel e Irán y las disrupciones en el Mar Rojo que obligan a los buques a rodear el Cabo de Buena Esperanza.

La empresa proyecta que la diversificación hacia Asia permitirá no solo mantener sus márgenes exportadores —que se habían comprimido por los mayores costos logísticos— sino incrementar el volumen total de ventas en un 10% para el cierre de 2026. Agro Fergi exporta principalmente arándanos, espárragos y uva de mesa, productos con alta demanda en el mercado asiático premium donde el consumidor valora la calidad peruana y los atributos de sostenibilidad. La empresa ya cuenta con certificaciones GlobalGAP y Rainforest Alliance que facilitan el ingreso a cadenas de supermercados asiáticos de alta gama.

El sector agroexportador peruano en su conjunto está evaluando estrategias similares. Según el reporte del Ministerio de Comercio Exterior y Turismo (MINCETUR), las agroexportaciones peruanas crecieron 8.3% en el primer semestre de 2026, pero el incremento de fletes ha erosionado hasta 4 puntos porcentuales de los márgenes netos de los exportadores.`,
    analisis: `La estrategia de diversificación de Agro Fergi refleja una tendencia más amplia del agro peruano de reducir dependencia de rutas logísticas expuestas al conflicto en Medio Oriente. Para el tipo de cambio, el incremento de exportaciones genera mayor oferta de dólares en el mercado local, lo que tiende a fortalecer el sol peruano. Si las agroexportaciones crecen como proyecta la empresa, el PEN podría recibir un impulso adicional por la liquidación de divisas de los exportadores.

Para empresas importadoras o con obligaciones en dólares, este flujo exportador favorable para el sol es una oportunidad para adquirir divisas a tipos de cambio competitivos. El momento del año también juega un rol: agosto y setiembre son meses de fuerte liquidación de exportaciones del agro, lo que históricamente presiona el dólar a la baja en el mercado local.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i004',
    titulo: 'SBS y Gobierno alistan reprogramación crediticia sin penalidad para deudores afectados por El Niño',
    descripcion: 'La Superintendencia de Banca, Seguros y AFP coordina con el Ejecutivo un esquema de alivio para deudores cuya capacidad de pago fue golpeada por el fenómeno climático, sin que ello afecte su clasificación crediticia.',
    contenido: `La Superintendencia de Banca, Seguros y AFP (SBS) trabaja junto con el Ministerio de Economía y Finanzas (MEF) en un paquete de medidas de alivio crediticio para personas y empresas cuya situación financiera se vio deteriorada por los efectos del fenómeno El Niño. La propuesta contempla la reprogramación de deudas bancarias, créditos de consumo y préstamos a microempresas sin que los deudores sean castigados en su clasificación crediticia, evitando que pasen de "normal" a "con problemas potenciales" o categorías de mayor riesgo.

Según fuentes del sector, el esquema funcionaría de manera similar al aplicado durante la pandemia COVID-19 en 2020, cuando el Gobierno y la SBS habilitaron la reprogramación masiva de créditos. En esta oportunidad, el alcance estaría focalizado en las regiones más afectadas por lluvias e inundaciones: Piura, La Libertad, Lambayeque y zonas del norte del país. Se estima que más de 180,000 deudores podrían calificar para el beneficio, con un saldo crediticio total superior a S/ 4,500 millones.

Las entidades financieras han manifestado disposición a participar, aunque solicitan que la SBS establezca lineamientos claros sobre los plazos de gracia y los criterios de elegibilidad. El Congreso también evalúa una iniciativa legislativa complementaria que extendería los beneficios a deudores de cajas municipales y rurales, que concentran una mayor proporción de clientes en zonas vulnerables.`,
    analisis: `Las medidas de alivio crediticio tienen un efecto estabilizador sobre el sistema financiero peruano, reduciendo el riesgo de un incremento brusco en la morosidad bancaria que podría presionar la liquidez del sistema. Para el tipo de cambio, un sistema financiero estable refuerza la confianza en el sol y reduce la dolarización por precaución, lo que es positivo para el PEN a mediano plazo.

Para empresas con exposición cambiaria, el entorno de tasas locales estables —el BCRP mantiene su tasa referencial en 4.25%— facilita la planificación financiera. Si tienes créditos en entidades financieras afectados por El Niño, consulta directamente con tu banco o caja sobre las condiciones del esquema de reprogramación una vez que la SBS publique los lineamientos oficiales.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i005',
    titulo: 'Línea 2 del Metro de Lima impulsa alza del 6% en precios inmobiliarios en Bellavista, Callao',
    descripcion: 'El avance en la construcción de la Línea 2 del Metro de Lima genera revalorización de propiedades en la zona de influencia, con Bellavista registrando el mayor incremento entre los distritos beneficiados.',
    contenido: `El avance en la construcción de la Línea 2 del Metro de Lima está generando un efecto de revalorización inmobiliaria en los distritos que albergarán estaciones del sistema. Según un análisis del portal Adondevivir y consultoras especializadas, los precios de departamentos en Bellavista, en la Provincia Constitucional del Callao, acumulan un incremento del 6% en lo que va del año, el mayor registro entre las zonas de influencia directa del futuro tren subterráneo.

El fenómeno responde a la expectativa de que la conectividad que aportará el Metro reducirá significativamente los tiempos de desplazamiento desde distritos del Callao hacia el centro financiero de Lima, actualmente de 45 a 60 minutos en vehículo particular. Con la Línea 2 operativa, ese recorrido podría realizarse en menos de 20 minutos, elevando el atractivo residencial de zonas que hoy cotizan por debajo del promedio limeño. El valor promedio del metro cuadrado en Bellavista se ubica actualmente en US$ 1,480, frente a los US$ 2,100-2,500 del eje Miraflores-San Isidro.

Inversores inmobiliarios están aprovechando el diferencial de precio para adquirir unidades en zonas de influencia antes de que el Metro entre en operación. Promotoras como Besco, Viva GyM y Paz Centenario han lanzado proyectos residenciales a lo largo del corredor de la Línea 2 en los últimos 12 meses, absorbidos con tasas de venta por encima del promedio del mercado.`,
    analisis: `La revalorización inmobiliaria vinculada a infraestructura de transporte es un fenómeno bien documentado en ciudades como Bogotá, Ciudad de México y Santiago, donde el metro generó incrementos de entre 10% y 25% en propiedades dentro del radio de 500 metros de cada estación. Lima sigue ese patrón, aunque con mayor volatilidad por el retraso histórico en la ejecución de la obra.

Para quienes planifican operaciones de cambio de divisas vinculadas al sector inmobiliario —compradores o vendedores de propiedades denominadas en dólares— el contexto de sol fuerte y dólar debilitado globalmente puede ser favorable para quienes venden en dólares y necesitan soles para invertir localmente.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i006',
    titulo: 'Contraloría: Perú suma 2,262 obras paralizadas con S/ 27 mil millones pendientes de ejecutar',
    descripcion: 'El organismo fiscalizador reporta que a junio de 2026 el número de obras paralizadas aumentó respecto al año anterior, aunque la inversión total comprometida bajó a S/ 62 mil millones, con S/ 27 mil millones sin ejecutar por problemas de gestión.',
    contenido: `La Contraloría General de la República publicó su informe semestral sobre obras paralizadas en el Estado, revelando que al 30 de junio de 2026 existen 2,262 proyectos de infraestructura pública paralizados en todo el país, un incremento de 4.7% respecto a las 2,160 obras en esa condición en junio de 2025. El monto total de inversión comprometida en estos proyectos alcanza los S/ 62 mil millones, de los cuales S/ 27 mil millones permanecen sin ejecutar, recursos que el Estado tiene comprometidos pero que no generan retorno económico ni social.

Las principales causas de paralización identificadas por la Contraloría son: deficiencias en los expedientes técnicos (31% de los casos), problemas de financiamiento o presupuesto insuficiente (24%), conflictos sociales (18%), procesos arbitrales o judiciales pendientes (15%) y cambios de gestión que dieron lugar a revisiones contractuales (12%). Las regiones con mayor concentración de obras paralizadas son Puno, Loreto, Ucayali, Cusco y Áncash, que en conjunto acumulan el 38% del total nacional.

El Ministerio de Economía y Finanzas ha implementado el programa "Obras por Resultados" y la plataforma digital de seguimiento de proyectos para reducir el número de paralizaciones, pero los resultados aún son limitados. Organismos multilaterales como el BID y el Banco Mundial han señalado que la eficiencia en la ejecución de inversión pública es uno de los principales cuellos de botella para el crecimiento económico peruano.`,
    analisis: `La subejecución de inversión pública impacta directamente en el crecimiento del PBI peruano y, por extensión, en la fortaleza del sol. Cuando el Estado no ejecuta el gasto planificado, la demanda interna crece menos de lo proyectado, lo que puede generar presión deflacionaria y reducir el atractivo del sol para inversores extranjeros. El BCRP monitorea esta variable al calibrar la política monetaria.

Para empresas que operan en sectores vinculados a obra pública —materiales de construcción, equipos, servicios de ingeniería— el riesgo cambiario es elevado en este entorno: si los proyectos siguen paralizados, la demanda en dólares por maquinaria e insumos importados se reduce, lo que tiende a presionar el tipo de cambio a la baja.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i007',
    titulo: 'Fundador de Evergrande condenado a cadena perpetua por el colapso inmobiliario que sacudió China',
    descripcion: 'Hui Ka Yan, exdirector ejecutivo del gigante inmobiliario chino, fue sentenciado a prisión perpetua por fraude financiero, malversación y manipulación del mercado. El caso marca el cierre judicial del mayor derrumbe inmobiliario en la historia de China.',
    contenido: `Hui Ka Yan, fundador y exdirector ejecutivo de Evergrande Group, fue condenado a cadena perpetua por un tribunal de Shenzhen esta semana, en una sentencia que marca el capítulo final del colapso del gigante inmobiliario que en 2021 sacudió los mercados financieros globales. El fallo incluye cargos por fraude financiero sistémico, malversación de fondos de compradores de viviendas y manipulación deliberada del mercado de valores. El tribunal también ordenó la confiscación de todos sus activos personales, estimados en varios miles de millones de dólares.

Evergrande colapsó bajo el peso de más de US$ 300,000 millones en deuda, convirtiéndose en el mayor impago corporativo de la historia de China. El derrumbe afectó a millones de compradores de viviendas que habían pagado anticipos por apartamentos que nunca fueron terminados, a proveedores y contratistas que perdieron acreencias multimillonarias, y a inversores de bonos —incluyendo fondos internacionales— que sufrieron pérdidas significativas. La crisis se propagó al sector financiero chino y generó volatilidad en los mercados de renta fija emergente a nivel global.

La sentencia llega mientras el mercado inmobiliario chino continúa en proceso de saneamiento. El gobierno de Pekín implementó en 2024 y 2025 una serie de medidas de estímulo —reducción de tasas hipotecarias, flexibilización de restricciones a compras y fondos de estabilización para completar proyectos paralizados— pero la recuperación sigue siendo frágil y desigual entre ciudades.`,
    analisis: `El caso Evergrande y la sentencia a Hui Ka Yan tienen implicancias para los mercados emergentes, incluyendo Perú. Un sector inmobiliario chino aún débil implica menor demanda de materias primas como cobre, hierro y zinc, commodities clave para las exportaciones peruanas. Si China no logra estabilizar su mercado inmobiliario en el corto plazo, el precio del cobre —y por ende los ingresos de exportación peruanos— podría mantenerse bajo presión.

Para el tipo de cambio PEN/USD, una China débil es un factor negativo para el sol: menores ingresos por exportaciones reducen la oferta de dólares en el mercado local. Sin embargo, el impacto actual parece ya estar descontado por el mercado, y el sol ha demostrado resiliencia gracias a las sólidas reservas internacionales del BCRP.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i008',
    titulo: 'Tasas de bonos globales alcanzan máximos históricos por inflación, IA y precios del petróleo',
    descripcion: 'Los rendimientos de los bonos soberanos a largo plazo de EE.UU., Reino Unido, Alemania y Japón registraron máximos en décadas, impulsados por la combinación de inflación persistente relacionada con el conflicto en Medio Oriente y el gasto en infraestructura de inteligencia artificial.',
    contenido: `Los mercados de deuda soberana global atraviesan una tormenta perfecta: los rendimientos de los bonos gubernamentales a largo plazo de las cuatro principales economías desarrolladas alcanzaron máximos históricos o de varios años en la jornada de hoy. El bono del Tesoro de EE.UU. a 30 años superó el 5.2%; el Gilt británico a 30 años cruzó el 5.8%, impulsado por una inflación que repuntó al 2.9% anual; el Bund alemán a 10 años escaló al 3.1%; y el JGB japonés a 10 años —históricamente anclado cerca de cero— opera en 1.75%, nivel no visto desde 2008.

Tres factores se combinan para explicar la ola de ventas en bonos: primero, la inflación energética derivada del conflicto Irán-Israel, que eleva los precios del petróleo y gas y mantiene la inflación por encima de los objetivos de los bancos centrales; segundo, el boom de infraestructura de inteligencia artificial, que genera un ciclo de inversión masivo que compite con los bonos por capital institucional; y tercero, los déficits fiscales que obligan a los gobiernos a emitir cantidades crecientes de deuda en un momento en que la demanda de los bancos centrales —que compraban bonos durante el QE— ha desaparecido.

El fenómeno tiene consecuencias directas en los costos de endeudamiento corporativo y gubernamental a nivel global, incluyendo en economías emergentes como Perú, donde las tasas de referencia y los spreads soberanos se mueven en correlación con los bonos del Tesoro americano.`,
    analisis: `Un entorno de tasas de bonos globales en máximos históricos eleva el "costo de oportunidad" para invertir en economías emergentes: si los bonos del Tesoro americano rinden 5.2% en dólares con mínimo riesgo, los inversores exigen mayor retorno para asumir el riesgo peruano. Esto puede presionar al sol si los flujos de capital extranjero se reducen.

Sin embargo, Perú cuenta con fundamentos sólidos: grado de inversión, reservas récord de más de US$ 100,000 millones y un BCRP creíble. La recomendación para quienes tienen exposición cambiaria es monitorear de cerca los movimientos del bono a 10 años americano: si supera el 4.8%, suele generar episodios de apreciación del dólar frente a monedas emergentes.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i009',
    titulo: 'Trump endurece sanciones económicas contra Irán y países que comercien con Teherán',
    descripcion: 'Tras el vencimiento del cese al fuego de 60 días sin acuerdo diplomático, la administración Trump anunció nuevas rondas de sanciones contra Irán y amenazó con penalizar a terceros países que mantengan relaciones comerciales con Teherán.',
    contenido: `El presidente Donald Trump anunció este miércoles un paquete ampliado de sanciones económicas contra Irán, luego de que el cese al fuego de 60 días que había pactado con Teherán expire sin que las partes alcanzaran un acuerdo diplomático o militar definitivo. Las nuevas medidas incluyen sanciones secundarias —que penalizarían a empresas y países de terceros que comercien con Irán en sectores estratégicos como petróleo, gas y petroquímica— así como la extensión del bloqueo financiero al sistema bancario iraní y sus corresponsales internacionales.

La escalada tiene implicancias directas en el mercado energético: Irán produce aproximadamente 3.4 millones de barriles diarios de petróleo, y cualquier restricción adicional a sus exportaciones —que actualmente llegan principalmente a China— podría tensar la oferta global en un momento en que la OPEP+ ya mantiene recortes de producción. Los futuros del petróleo Brent subieron 2.1% en la jornada ante los anuncios, mientras el crudo WTI opera por encima de US$ 88 por barril.

El conflicto también genera disrupciones en el transporte marítimo por el Estrecho de Ormuz, por donde transita aproximadamente el 20% del comercio marítimo global de crudo. Compañías de seguros marítimos han elevado las primas de riesgo de guerra para buques que transitan por el Golfo Pérsico, encareciendo el flete para todos los usuarios de esas rutas.`,
    analisis: `Un petróleo más caro por las sanciones a Irán representa un riesgo inflacionario global que complica la tarea de los bancos centrales. Para Perú, que importa derivados de petróleo, el encarecimiento del crudo presiona la inflación local y puede generar presión para que el BCRP mantenga tasas elevadas por más tiempo, lo que tiende a fortalecer el sol al hacer más atractivos los activos en soles.

El encarecimiento de los fletes marítimos también afecta a los importadores peruanos: comprar en dólares será más costoso si los precios CIF de las importaciones suben. Si tienes pagos de importaciones próximos, considera adelantar las compras de dólares antes de que el tipo de cambio pueda ajustarse al alza por este factor.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i010',
    titulo: 'Nasdaq 100 rompe por debajo de la media móvil de 200 días — señal técnica bajista preocupa a traders',
    descripcion: 'El índice tecnológico americano perforó la media móvil de 200 jornadas y rompió dentro de la nube de Ichimoku, generando una señal técnica bajista de primera magnitud que podría anticipar una corrección más profunda.',
    contenido: `El Nasdaq 100 cerró por debajo de su media móvil de 200 días (MA200) en la sesión de hoy, un evento técnico que los analistas consideran de alta relevancia por ser el primer cruce bajista de ese indicador en más de ocho meses. El índice tecnológico también penetró la nube de Ichimoku —conocida como "kumo"— lo que según la metodología japonesa de análisis técnico confirma el inicio de una tendencia bajista de mayor duración. El volumen de la jornada fue superior al promedio de las últimas 30 sesiones, dotando al movimiento de mayor validez técnica.

Los catalizadores fundamentales detrás de la caída incluyen el alza de los rendimientos de bonos a 30 años —que elevan la tasa de descuento de los flujos futuros de las empresas tecnológicas, reduciendo sus valuaciones— y la rotación de portafolios institucionales desde acciones de growth hacia bonos soberanos de alto rendimiento. Además, varias empresas del índice con exposición a China reportaron revisiones a la baja en sus perspectivas de ventas ante la debilidad del consumo chino.

Técnicamente, el soporte clave se ubica en torno a los 18,200 puntos del Nasdaq 100. Una ruptura por debajo de ese nivel abriría el camino hacia los 17,500 puntos, una zona de consolidación importante de principios de año. Los indicadores de momentum —RSI en 38, MACD con cruce bajista— refuerzan el sesgo vendedor en el corto plazo.`,
    analisis: `Una corrección en el Nasdaq 100 tiene implicancias globales: cuando el índice tecnológico cae de forma significativa, suele haber fuga hacia activos de menor riesgo, incluyendo dólares. Este efecto de "risk-off" puede presionar al sol peruano a depreciarse temporalmente, ya que los inversores internacionales venden activos emergentes para refugiarse en dólares.

Monitorea los próximos dos o tres cierres del Nasdaq para evaluar si el rompimiento de la MA200 se confirma o es un movimiento falso. Si el índice recupera rápidamente el nivel de 200 días, el impacto sobre el sol será limitado. Si la corrección se profundiza, prepárate para ver el dólar fortaleciéndose frente al sol en el corto plazo.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i011',
    titulo: 'Fed: Mary Daly señala que el mercado de bonos actúa como señal de política monetaria',
    descripcion: 'La presidenta de la Fed de San Francisco indicó que los movimientos en los rendimientos de los bonos del Tesoro transmiten información relevante para la Reserva Federal al calibrar su política de tasas, en medio de las intervenciones del Tesoro para calmar la volatilidad.',
    contenido: `Mary Daly, presidenta de la Reserva Federal de San Francisco y miembro votante del FOMC en 2026, declaró en una entrevista con Bloomberg que los rendimientos de los bonos del Tesoro americano representan una señal de política valiosa para la Fed. Sus comentarios llegaron en un momento en que el Tesoro de EE.UU. interviene activamente en el mercado de bonos para contener la volatilidad, lo que algunos analistas interpretaban como una potencial interferencia en la transmisión de la política monetaria.

Daly enfatizó que la Fed permanece centrada en su doble mandato —estabilidad de precios y máximo empleo— y que las acciones del Tesoro no alteran ese marco. Sin embargo, reconoció que el alza de rendimientos de largo plazo genera un endurecimiento de las condiciones financieras equivalente a una o dos subidas de tasas adicionales, lo que reduce la necesidad de que la Fed actúe de forma más agresiva con su tasa de política. El mercado de swaps eleva al 82% la probabilidad de una pausa de la Fed en septiembre.

La declaración de Daly refuerza la tesis de que la Fed utilizará la señal del mercado de bonos como un "apretón financiero" adicional que complementa su política de tasas. Para los mercados emergentes, este enfoque es moderadamente positivo: implica que la Fed no subirá tasas más rápido de lo necesario, reduciendo el riesgo de fuga de capitales desde economías como la peruana.`,
    analisis: `Los comentarios de Daly refuerzan el escenario de pausa de la Fed en septiembre, lo que es favorable para el sol peruano. Cuando la Fed pausa o reduce tasas, la brecha de rendimiento entre activos en dólares y activos en soles se estrecha, reduciendo el incentivo de dolarización de portafolios. Esto tiende a presionar el tipo de cambio USD/PEN a la baja.

Para quienes tienen ahorros en dólares y evalúan convertirlos a soles, el contexto de Fed en pausa sumado al DXY en mínimos de tres meses configura un entorno favorable para hacer el cambio. Sin embargo, como siempre, diversificar entre ambas monedas es la estrategia más prudente ante la incertidumbre del contexto internacional.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i012',
    titulo: 'Trump subsidia proyectos mineros en EE.UU. con US$ 500 millones para reducir dependencia de China',
    descripcion: 'La administración Trump anunció un fondo de subsidios por US$ 500 millones para impulsar la minería doméstica de minerales críticos, en un esfuerzo por reducir la dependencia estadounidense de las cadenas de suministro chinas.',
    contenido: `La administración del presidente Donald Trump anunció la creación de un fondo de subsidios por US$ 500 millones destinado a financiar proyectos de extracción y procesamiento de minerales críticos en territorio estadounidense. La iniciativa forma parte de la estrategia de seguridad económica de Washington para reducir la dependencia de China en materias primas estratégicas como litio, cobalto, níquel, tierras raras y —en menor medida— cobre. El anuncio fue bien recibido por las bolsas de minerales industriales: el cobre en la Bolsa de Metales de Londres (LME) subió 1.4% en la jornada.

El fondo contempla subsidios directos, exenciones tributarias aceleradas y garantías de compra gubernamental para proyectos que cumplan criterios de "minerales domésticos o aliados", excluyendo insumos de China, Rusia y países considerados adversarios. Los estados con mayor potencial minero —Nevada, Arizona, Alaska y Montana— ya han manifestado su interés y presentarán proyectos en las próximas semanas. Se estima que la iniciativa podría desencadenar más de US$ 3,000 millones en inversión privada adicional gracias al efecto multiplicador de los subsidios públicos.

Para Perú, la medida tiene una lectura dual: por un lado, la competencia de proyectos americanos podría eventualmente reducir la dependencia global de la oferta peruana en algunos minerales; por otro lado, el mayor consumo industrial de minerales que genera la expansión minera en EE.UU. eleva la demanda global de commodities, lo que beneficia los precios y las exportaciones peruanas en el corto y mediano plazo.`,
    analisis: `El subsidio minero de Trump tiene un efecto positivo inmediato en el precio del cobre y otros metales industriales, lo que es directamente favorable para las exportaciones peruanas. Un cobre más caro genera mayores ingresos de divisas para el país y fortalece el sol. Si el precio del cobre se mantiene por encima de US$ 4.20 por libra, el BCRP tendrá mayor holgura para manejar la política cambiaria sin intervenciones significativas.

Para empresas que importan maquinaria y equipos de origen americano o que tienen proveedores en EE.UU., el encarecimiento de los proyectos mineros en ese país puede trasladarse a mayores precios de los servicios especializados. Considerar eso al planificar presupuestos en dólares para el segundo semestre.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i013',
    titulo: 'Argentina mantiene tipo de cambio oficial estable mientras Milei evalúa próximos pasos del plan económico',
    descripcion: 'El peso argentino permanece en el nivel oficial mientras el gobierno de Javier Milei analiza la siguiente fase del programa de estabilización económica, con el FMI monitoreando de cerca los indicadores fiscales y cambiarios.',
    contenido: `El gobierno del presidente Javier Milei mantiene el tipo de cambio oficial del peso argentino en un ritmo de devaluación controlada (crawling peg), luego de haber eliminado las restricciones cambiarias más severas del cepo a principios de año. El Banco Central de la República Argentina (BCRA) acumula reservas brutas por encima de US$ 38,000 millones —el nivel más alto en tres años— gracias al superávit comercial récord que generó el shock de ajuste fiscal implementado por Milei desde su llegada al poder en diciembre de 2023.

El FMI completó esta semana la cuarta revisión del programa de respaldo financiero con Argentina y emitió una evaluación positiva del cumplimiento de las metas fiscales y cambiarias. La economía argentina registró deflación mensual en junio y julio —fenómeno inédito desde la hiperinflación de 1991— aunque la inflación anual sigue en niveles elevados cercanos al 35%. El gobierno evalúa una eventual flotación más libre del peso para el cuarto trimestre, pero el timing dependerá de la acumulación de reservas y de la estabilidad del mercado paralelo.

En el frente social, el costo del ajuste genera presión: la pobreza supera el 40% de la población y el consumo interno se contrae. Las próximas elecciones legislativas de octubre medirán el capital político de La Libertad Avanza para continuar el programa de reformas estructurales.`,
    analisis: `La estabilidad cambiaria argentina tiene implicancias para el mercado peruano: Argentina y Perú compiten en algunos sectores exportadores (agro, textiles, pesquería) y la estabilización del peso puede mejorar la competitividad argentina en esos segmentos. Sin embargo, el impacto directo sobre el sol peruano es limitado dado que los flujos comerciales y financieros entre ambos países son relativamente pequeños.

El caso argentino es un referente de política económica para la región: si el plan Milei logra estabilizar definitivamente la inflación y el tipo de cambio, podría generar un efecto de confianza regional que beneficie a todas las monedas latinoamericanas frente al dólar, incluyendo el sol peruano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i014',
    titulo: 'Colombia: inflación cede pero se mantiene en 5.8% anual en agosto 2026',
    descripcion: 'El Departamento Administrativo Nacional de Estadística (DANE) publicó el dato de inflación de agosto, que muestra una moderación respecto a meses anteriores pero permanece por encima del rango meta del Banco de la República de Colombia.',
    contenido: `El Departamento Administrativo Nacional de Estadística (DANE) de Colombia publicó el índice de precios al consumidor correspondiente a agosto de 2026, registrando una inflación anual de 5.8%, por debajo del 6.2% de julio pero aún significativamente por encima del rango meta del Banco de la República de Colombia, que se ubica entre 2% y 4%. La inflación mensual fue de 0.3%, moderada respecto a los meses de verano del año anterior pero impulsada principalmente por los rubros de alimentos (0.7% mensual) y energía (0.5% mensual).

El Banco de la República inició en 2025 un ciclo de recortes de tasas desde el máximo histórico de 13.25% alcanzado en 2023, y la tasa de política se ubica actualmente en 8.50%. El gobernador del banco central, Leonardo Villar, señaló que el ritmo de los próximos recortes dependerá de la convergencia de la inflación hacia el rango meta, proceso que estiman completar hacia mediados de 2027. Los analistas esperan una reducción de 25 puntos básicos adicionales en la reunión de septiembre.

La economía colombiana crece a un ritmo del 2.8% anual, impulsada por el consumo interno y el sector servicios, aunque la inversión extranjera directa muestra señales de desaceleración ante la incertidumbre regulatoria y las políticas del gobierno de Gustavo Petro en sectores extractivos. El peso colombiano (COP) opera en torno a 4,150 por dólar, nivel que refleja la persistente inflación y las dudas sobre las reformas pendientes.`,
    analisis: `La inflación colombiana en 5.8% anual, aunque en moderación, implica que el Banco de la República seguirá siendo cauto en su ciclo de recortes. Esto mantiene las tasas de interés en Colombia en niveles atractivos para el carry trade, lo que puede generar flujos de capital hacia el peso colombiano y, por extensión, un efecto positivo moderado sobre otras monedas de la región como el sol peruano.

Para empresas peruanas con operaciones en Colombia o que importan bienes colombianos, la inflación elevada en ese país encarece los productos y servicios en pesos, pero el tipo de cambio COP/PEN relativamente estable modera ese efecto. Monitorear la reunión del Banco de la República en septiembre para ajustar estrategias de cobertura cambiaria bilateral.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i015',
    titulo: 'Chile completa acuerdo comercial modernizado con la Unión Europea — exportaciones de cobre favorecidas',
    descripcion: 'La actualización del Acuerdo de Asociación Chile-UE, que incluye nuevas disposiciones sobre minerales críticos, sustentabilidad y comercio digital, entra en su fase final de ratificación parlamentaria en ambas partes.',
    contenido: `Chile y la Unión Europea completaron la fase técnica de modernización de su Acuerdo de Asociación, que incluye por primera vez disposiciones específicas sobre minerales críticos —clave para la transición energética europea— así como nuevos capítulos sobre sostenibilidad, comercio digital y derechos laborales. El acuerdo actualizado reemplaza al original firmado en 2002 y debe ser ratificado por el Parlamento chileno y el Parlamento Europeo, proceso que los negociadores esperan completar antes de que finalice 2026.

El nuevo acuerdo tiene especial relevancia para las exportaciones de cobre chileno —el país produce aproximadamente el 27% del cobre mundial— al establecer un marco preferencial que facilita el acceso de minerales críticos procesados en Chile al mercado europeo. La UE busca garantizar cadenas de suministro diversificadas para el litio, cobre, níquel y cobalto que necesita para sus ambiciosos planes de electrificación y fabricación de baterías. A cambio, empresas europeas tendrán condiciones preferenciales para invertir en Chile en los sectores de energía renovable e infraestructura.

Para Perú, el acuerdo Chile-UE tiene una lectura de oportunidad: si Chile formaliza condiciones preferenciales para sus exportaciones de cobre a Europa, Perú podría verse motivado a acelerar la modernización de su propio Acuerdo de Asociación con la UE o a explorar nuevos esquemas de acceso preferencial para sus exportaciones de cobre, zinc y plata.`,
    analisis: `El acuerdo Chile-UE con capítulo de minerales críticos pone presión positiva sobre los precios del cobre a mediano plazo, ya que garantiza demanda europea sostenida para el metal. Como segundo productor mundial de cobre, Perú se beneficia indirectamente de esta tendencia: mayor demanda europea de minerales críticos eleva los precios y los ingresos de exportación peruanos, fortaleciendo el sol.

El acuerdo también es una señal de que la transición energética global generará demanda estructural creciente de cobre en los próximos años, lo que es un factor positivo de largo plazo para la economía peruana y la moneda nacional. Para quienes planifican operaciones de cambio a mediano plazo, el panorama del sol luce constructivo gracias a esta tendencia de demanda minera.`,
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
