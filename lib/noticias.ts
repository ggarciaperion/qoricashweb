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
const HOY = '2026-06-02T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'h001',
    titulo: 'BCRP reunión del 11 de junio — debate entre mantener 4.25% o primer recorte de 25 pbs, con inflación de servicios cediendo a 3.6% en mayo como señal clave',
    descripcion: 'El Banco Central de Reserva del Perú celebrará su reunión de política monetaria el martes 11 de junio, con el mercado dividido: 68% espera que mantenga la tasa en 4.25% dado que la inflación de abril (4.0%) supera el techo de la meta. La inflación de servicios cedió a 3.6% en mayo, la primera lectura alentadora en cuatro meses.',
    contenido: `El directorio del Banco Central de Reserva del Perú (BCRP) se reúne el martes 11 de junio en lo que es la sesión de política monetaria más anticipada del año. El mercado de futuros de tasas de soles asigna un 68% de probabilidad de que la tasa de referencia se mantenga en 4.25% por noveno mes consecutivo, y un 32% de probabilidad de un primer recorte de 25 puntos básicos hasta 4.00%.

El dato que más ha movido las expectativas en las últimas semanas es la inflación de servicios de mayo, que cedió a 3.6% desde el 4.4% de abril. Esta lectura —publicada el viernes 30 de mayo por el INEI— es la primera señal de que la presión inflacionaria subyacente está cediendo. La inflación general de mayo se ubica en 3.7% anual, por debajo del 4.0% de abril, aunque todavía por encima del techo del rango meta del 3%.

El presidente del BCRP, Julio Velarde, ha señalado en sus comunicaciones recientes que el banco central observará "al menos dos lecturas consecutivas de convergencia antes de iniciar el ciclo de recortes". Si la inflación de mayo (publicada antes de la reunión) confirma la tendencia bajista, el directorio tendrá los elementos para señalizar un primer recorte en julio o agosto, incluso si mantiene en 4.25% este mes.

Los analistas de Credicorp Capital, BBVA Research e Intercorp Capital Markets coinciden en que el escenario más probable es una pausa con comunicación más dovish: el BCRP mantiene la tasa pero endulza el lenguaje del comunicado señalando que "las condiciones para recortar están madurando". Esa señal podría generar una apreciación leve del sol peruano hacia S/ 3.58-3.60 en los días posteriores a la reunión.`,
    analisis: `Una pausa con lenguaje dovish es el mejor escenario para el sol peruano: estabilidad de la tasa real positiva (que sostiene el carry trade) con perspectiva de recortes que fortalece el ciclo de crédito. El sol tiene soporte estructural por el superávit comercial y las reservas récord, independientemente de la decisión del 11 de junio.

Para empresas con flujos en dólares, el tipo de cambio S/ 3.60-3.65 representa una ventana de equilibrio razonable. Si el BCRP sorprende con un recorte de 25 pbs, el sol puede retroceder transitoriamente hacia S/ 3.63-3.65 antes de recuperar terreno dado que los fundamentos subyacentes son sólidos. Mantener posiciones cambiarias sin grandes cambios hasta después del 11 de junio es la recomendación de los tesoreros de la banca local.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'NFP mayo EEUU en +152k modera expectativas — Fed countdown al FOMC 16-17 jun con 97% de pausa; desempleo en 4.3% y salarios +3.8% anual',
    descripcion: 'Las nóminas no agrícolas de mayo (NFP) registraron +152,000 empleos, por encima de las estimaciones de +130k pero con revisión de abril a +138k. La tasa de desempleo se mantiene en 4.3% y los salarios por hora suben 3.8% anual. El dato consolida la pausa de la Fed el 16-17 de junio (97% de probabilidad según CME FedWatch).',
    contenido: `El Departamento de Trabajo de EE.UU. publicó el informe de empleo de mayo, mostrando una creación de 152,000 empleos no agrícolas (NFP), por encima del consenso de analistas de +130,000 pero moderado frente a los promedios recientes. La tasa de desempleo se mantuvo estable en 4.3%. Los salarios por hora aumentaron 0.3% mensual (3.8% anual), una desaceleración respecto al 4.0% de abril que da algo de alivio al frente inflacionario.

La revisión a la baja del NFP de abril —de +177,000 a +138,000— es el dato más significativo del reporte en términos de tendencia: la creación de empleo se está enfriando de manera visible. El sector privado añadió 127,000 empleos según el reporte ADP (publicado el miércoles con +137,000), con servicios de salud (+62,000), hostelería (+24,000) y gobierno (+25,000) como principales contribuyentes. El sector manufacturero perdió 12,000 empleos por sexto mes consecutivo, confirmando el impacto de los aranceles.

El mercado de futuros de Fed Funds en el CME mantiene un 97% de probabilidad de pausa en el FOMC del 16-17 de junio, con la tasa de fondos federales en el rango 3.50%-3.75%. La probabilidad de un primer recorte de 25 pbs ha subido hasta el 62% para septiembre y el 81% para noviembre. El dot plot que publicará la Fed el 17 de junio será el foco de atención: si proyecta dos recortes en el segundo semestre, el DXY puede caer hacia 97-98.

El rendimiento del Tesoro a 10 años cedió 4 pbs hasta 4.24%, con el spread 2-10Y en -3 pbs (mínimamente invertido). El S&P 500 cerró con avance del 0.4%, mientras el Nasdaq subió 0.6% impulsado por el sector tecnológico que se beneficia de tasas más bajas en el horizonte.`,
    analisis: `Un NFP de +152k con revisión de abril a +138k es exactamente el tipo de dato que la Fed necesita para justificar el primer recorte en septiembre: el mercado laboral se modera sin colapsar, dando espacio para política monetaria más acomodaticia sin sacrificar el pleno empleo.

Para el sol peruano, el escenario de Fed dovish con dot plot proyectando dos recortes en el segundo semestre refuerza la debilidad estructural del DXY y el viento de cola para monedas emergentes con fundamentos sólidos. La correlación entre el DXY débil y la apreciación del sol es la más alta desde 2021.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'Cobre sube a US$ 5.15/lb en el LME — inventarios en mínimos de 3 años (138,500 TM) y PMI servicios China 53.0 reactivan la demanda; producción peruana mayo 370,000 TM',
    descripcion: 'El cobre avanzó 0.9% hasta US$ 5.15/lb en la London Metal Exchange al inicio de junio, impulsado por inventarios del LME en mínimos de 36 meses (138,500 TM) y el PMI de servicios de China en 53.0 (Caixin, máximo de 14 meses). La producción peruana de cobre en mayo fue de 370,000 toneladas métricas, segundo mayor mes de la historia.',
    contenido: `El cobre para entrega en tres meses en la London Metal Exchange (LME) abrió junio en US$ 5.15/lb (US$ 11,354/TM), avanzando 0.9% en la sesión. El catalizador fue la confluencia de dos factores: los inventarios de cobre en los almacenes certificados del LME cayeron a 138,500 toneladas, su nivel más bajo en 36 meses, señalando que la demanda está absorbiendo la oferta disponible más rápido de lo esperado. Simultáneamente, el PMI de servicios de China (Caixin) de mayo subió a 53.0, la mayor expansión del sector servicios en 14 meses.

Los inventarios bajos del LME tienen implicancias directas sobre el precio: cuando los stocks certificados caen por debajo de 150,000 toneladas, históricamente el mercado entra en backwardation (el precio spot supera al precio futuro), elevando la prima de costos por incumplimiento. Esta estructura de mercado es alcista para el precio spot y dificulta que los consumidores industriales aseguren abastecimiento sin pagar primas adicionales.

La producción peruana de cobre en mayo fue de 370,000 toneladas métricas de cobre fino, el segundo mayor mes de la historia después de los 374,200 TM de marzo. Las cuatro grandes operaciones —Cerro Verde (Freeport), Southern Copper, Antamina (BHP/Glencore/Teck) y Quellaveco (Anglo American)— reportaron producción en línea con sus guías anuales. El acumulado de los primeros cinco meses alcanza 1,812,000 TM, un 8.6% por encima de 2025.

El ICSG (International Copper Study Group) revisó su balance global para 2026 hacia un déficit de 230,000 TM (previo: superávit de 80,000 TM), principalmente por menor producción chilena (-4.2%) y mayor demanda de cable eléctrico para infraestructura de IA en EE.UU. y Europa.`,
    analisis: `Un déficit global de cobre de 230,000 TM en 2026 con inventarios del LME en mínimos de 3 años es la receta para precios sostenidos o en alza. El caso alcista para el cobre —transición energética, infraestructura de IA, electrificación— sigue intacto estructuralmente.

Para Perú, cada día que el cobre se mantiene por encima de US$ 5.00/lb genera exportaciones adicionales de ~US$ 60M respecto al año pasado. La acumulación de estos flujos a lo largo del año es la razón fundamental por la que el sol peruano tiene uno de los mejores fundamentos macro de los mercados emergentes.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'Café peruano proyecta año récord de US$ 1,120M — arábica en US$ 4,200/quintal impulsa ingresos en Amazonas y Cajamarca con crecimientos del 55%',
    descripcion: 'Las exportaciones de café peruano acumulan US$ 498M en los primeros cinco meses de 2026 (+57%), en camino de superar por primera vez la barrera de US$ 1,100M anuales. El precio del café arábica en el ICE supera los US$ 4,200 por quintal, máximo histórico. Los 185,000 productores cafetaleros registran ingresos 55-70% mayores que en 2024.',
    contenido: `Las exportaciones de café del Perú acumulan US$ 498 millones en enero-mayo de 2026, un crecimiento del 57% frente al mismo período de 2025, según datos de la Junta Nacional del Café (JNC) y MINCETUR. Con este ritmo, las exportaciones anuales superarán por primera vez los US$ 1,100 millones —el umbral que convertiría al café en el tercer producto del sector agroexportador peruano, superando al espárrago y acercándose al arándano.

El factor determinante es el precio: el café arábica (varietal de altura que representa el 95% de las exportaciones peruanas) cotiza en el Intercontinental Exchange (ICE) de Nueva York por encima de los US$ 4,200 por quintal (46 kg), el nivel más alto de su historia. Para comparación, el precio en enero 2025 era de US$ 2,400/quintal —un incremento del 75% en 17 meses. Esta bonanza de precios tiene impacto directo en los ingresos de los 185,000 productores cafetaleros del Perú.

Los valles de Amazonas (Rodríguez de Mendoza, Bagua Grande, La Peca), Cajamarca (Jaén, San Ignacio) y San Martín (Moyobamba, Lamas) son los epicentros del boom. Las cooperativas afiliadas a la JNC reportan precios de compra al productor en el rango de S/ 28-34 por kg de café pergamino seco, frente a S/ 16-18 en 2024. Los ingresos netos de los caficultores han crecido entre 50% y 70%.

La calidad del café peruano ha escalado en el mercado internacional de specialty coffee: 14 micro-lotes de productores peruanos recibieron puntuaciones SCA de 86-91 puntos en el Q1 2026, abriendo mercados de tostadores premium en Tokio, Estocolmo y San Francisco que pagan entre US$ 6,500-8,200 por quintal, el doble del precio de bolsa.`,
    analisis: `El boom del café peruano tiene un componente de precio (coyuntural) y uno de calidad (estructural). El precio en US$ 4,200/quintal es extraordinario pero potencialmente temporal si las condiciones climáticas en Brasil y Vietnam mejoran. Lo estructural es el posicionamiento en el segmento specialty, donde los precios no dependen del mercado de commodities sino del diferencial de calidad.

Para el tipo de cambio, el café añade ~US$ 1,100M anuales al flujo de divisas. No es tan grande como el cobre, pero es representativo de la diversificación exportadora que hace al sol más resiliente ante correcciones de cualquier commodity individual.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'BCRP compra 5 toneladas de oro en mayo y eleva reservas a 53 toneladas — Perú entre los top 10 acumuladores globales con reservas netas en US$ 85,200M',
    descripcion: 'El Banco Central de Reserva del Perú incrementó sus reservas de oro en 5 toneladas durante mayo, elevando el total a 53 toneladas (US$ 5,854M al precio de US$ 3,452/oz). Las reservas internacionales netas alcanzan US$ 85,200 millones. El BCRP figura entre los 10 bancos centrales con mayor acumulación de oro en lo que va del año.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) realizó compras de oro en el mercado internacional por 5 toneladas métricas durante mayo de 2026, elevando las reservas de oro del banco central a 53 toneladas (valuadas en US$ 5,854 millones al precio spot de US$ 3,452/oz). La transacción forma parte de la estrategia de diversificación de activos de reserva que el BCRP implementa desde 2021, período en el que las reservas de oro se han triplicado desde las 17 toneladas que tenía entonces.

Las reservas internacionales netas del BCRP alcanzan US$ 85,200 millones al inicio de junio, un incremento de US$ 1,711 millones frente a los US$ 83,489 millones del cierre de abril. El aumento refleja principalmente la acumulación de dólares por intervenciones en el mercado spot (el BCRP compró US$ 1,240M en mayo para moderar la apreciación del sol) y la valorización del stock de oro existente ante el alza del precio del metal.

El World Gold Council (WGC) sitúa al BCRP entre los 10 bancos centrales con mayor acumulación de oro en lo que va de 2026, con compras acumuladas de 17 toneladas en los cinco primeros meses del año. Los mayores acumuladores siguen siendo Polonia (43t), Turquía (38t) e India (28t), pero Perú ha aumentado su ritmo de compras por encima de economías de mayor tamaño como Tailandia o Arabia Saudita.

La estrategia de acumulación de oro del BCRP responde a la tendencia global de diversificación de reservas fuera del dólar. El presidente Velarde ha señalado que el objetivo es llevar el oro al 10% del total de reservas para 2028 (actualmente representa el 6.8%). A los precios actuales de US$ 3,452/oz, eso requeriría aproximadamente 84 toneladas adicionales de compras en los próximos 24 meses.`,
    analisis: `Las compras de oro del BCRP son una señal doble: el banco central diversifica activos fuera del dólar (confirmando la tendencia global) y señaliza confianza en que los precios del oro en el rango US$ 3,200-3,700 son sostenibles. Es gestión de activos a largo plazo, no especulación.

Para el sol peruano, las reservas de US$ 85,200M en oro y divisas son un escudo que prácticamente elimina el riesgo de una crisis cambiaria. Incluso ante un shock externo severo, el BCRP puede defender el sol con intervenciones sostenidas por meses sin agotar sus reservas.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'Puerto del Callao bate récord en mayo con 270,000 TEUs — APM Terminals anuncia ampliación a 2.1 millones de TEUs anuales ante boom exportador',
    descripcion: 'El Puerto del Callao procesó 270,000 TEUs en mayo de 2026, el mayor registro mensual de su historia, impulsado por el boom de agroexportaciones y minería. APM Terminals recibió aprobación del Gobierno peruano para ampliar el Terminal Norte Multipropósito de 1.6 a 2.1 millones de TEUs anuales con una inversión de US$ 380 millones.',
    contenido: `La Autoridad Portuaria Nacional (APN) reportó que el Puerto del Callao —el mayor puerto de la Costa del Pacífico Sur— procesó 270,000 TEUs (Twenty-foot Equivalent Units) en mayo de 2026, superando el récord previo de 261,800 TEUs de noviembre 2025. Las exportaciones FOB por el puerto principal crecieron 28.4% interanual en valor, con el cobre, los arándanos, las paltas y el café como los cuatro principales productos de salida.

APM Terminals, operador del Terminal Norte Multipropósito (TNMP) del Callao, anunció que el Gobierno del Perú aprobó la inversión adicional de US$ 380 millones para ampliar la capacidad del terminal de los actuales 1.6 millones de TEUs anuales a 2.1 millones de TEUs, con una grúa pórtico adicional y mayor profundidad de muelle (16 metros). Las obras se completarían en el Q3 2027 y permitirían recibir portacontenedores Ultra Large Container Vessel (ULCV) de 20,000+ TEUs.

El tiempo promedio de permanencia de la carga en el puerto cayó a 1.8 días en mayo, desde los 2.4 días de enero, gracias a la digitalización de los trámites aduaneros y la implementación del sistema Single Window que integra SUNAT, SENASA, Digesa y la APN en una sola plataforma digital. El costo logístico de exportación por tonelada para el sector agroexportador cayó 12% en términos reales en los últimos 12 meses.

El Puerto del Callao maneja el 80% del comercio exterior peruano en valor. La ampliación del TNMP elimina el principal cuello de botella que amenaza con limitar el crecimiento exportador en el período 2027-2030 si el boom de commodities agrícolas y mineros se mantiene al ritmo actual.`,
    analisis: `La ampliación del Puerto del Callao a 2.1 millones de TEUs es una inversión estructural que amplía la capacidad del Perú para procesar el boom exportador. Sin esta inversión, el crecimiento del volumen de exportaciones podría verse limitado físicamente por la capacidad portuaria hacia 2028.

Para el tipo de cambio, mayor capacidad de exportación equivale a mayor flujo potencial de divisas y soporte estructural del sol. La mejora de la competitividad logística del Callao también atrae inversión industrial para exportación, generando más empleo y más divisas en los próximos años.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Oro marca nuevo máximo histórico en US$ 3,452/oz — tensiones Irán-EE.UU., DXY en 98.5 y compras de bancos centrales impulsan el rally; Goldman sube target a US$ 3,800',
    descripcion: 'El oro spot alcanzó US$ 3,452 por onza troy al inicio de junio, estableciendo un nuevo máximo histórico y superando el pico previo de US$ 3,430 de mayo. Goldman Sachs revisó al alza su objetivo de precio para el Q4 2026 de US$ 3,700 a US$ 3,800/oz ante la aceleración de compras de bancos centrales que superaron las 1,000 toneladas anualizadas.',
    contenido: `El oro spot (XAU/USD) abrió junio marcando un nuevo máximo histórico de US$ 3,452 por onza troy, superando el pico previo de US$ 3,430 registrado durante la primera quincena de mayo. El metal precioso acumula una ganancia del 13.8% en lo que va del año, consolidándose como el activo de mejor desempeño de 2026 frente al S&P 500 (+8.1%) y los bonos del Tesoro a 10 años (-1.4% en precio).

Los tres motores del nuevo máximo son claros. Primero, las tensiones geopolíticas Irán-EE.UU. en el Golfo Pérsico se mantienen elevadas, con ejercicios navales iraníes a 40 km del Estrecho de Ormuz. Segundo, el DXY cede a 98.5, su nivel más bajo desde enero de 2022, aumentando el poder adquisitivo de compradores en otras divisas. Tercero, las compras de bancos centrales siguen en ritmo récord: el BCRP del Perú compró 5 toneladas en mayo (total 53 toneladas), el Banco Nacional de Polonia añadió 8 toneladas y el Banco Central de la India 6 toneladas.

Goldman Sachs revisó al alza su objetivo de precio del oro para el Q4 2026, de US$ 3,700 a US$ 3,800/oz, argumentando que la demanda de bancos centrales en 2026 está superando sus propias proyecciones (940 toneladas estimadas vs. más de 1,000 toneladas en el ritmo actual de compras). Bank of America mantiene su objetivo de US$ 3,600/oz y Citigroup subió el suyo de US$ 3,500 a US$ 3,650/oz para el mismo período.

La plata spot (XAG/USD) sube 1.1% hasta US$ 34.20/oz, con el ratio oro/plata cediendo a 100.9. Los analistas de Citigroup apuntan a US$ 38-40/oz para la plata en Q4 2026 si la demanda industrial de paneles solares se mantiene en niveles récord.`,
    analisis: `Oro en US$ 3,452 con Goldman apuntando a US$ 3,800 y consenso en US$ 3,720 es el escenario más alcista desde el inicio del rally en 2022. Los compradores estructurales (bancos centrales) tienen mandatos de largo plazo que no venden ante correcciones, creando un piso de demanda que reduce la probabilidad de caídas profundas.

Para Perú, el binomio cobre+oro en máximos simultáneos es el mejor escenario posible para la balanza de pagos. Ambos representan el 72% de las exportaciones minerales del país. Este es el viento de cola fundamental que mantiene al sol entre las monedas emergentes de mejor desempeño en 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'China PMI servicios Caixin sube a 53.0 en mayo — máximo de 14 meses y estímulo de CNY 3 billones en infraestructura alcanza 38% de ejecución en Shanghai',
    descripcion: 'El PMI de servicios de China (Caixin) subió a 53.0 en mayo desde 52.5 en abril, su nivel más alto en 14 meses. El estímulo de CNY 3 billones (US$ 415,000M) en bonos especiales de gobierno local alcanza 38% de ejecución. El PMI compuesto sube a 52.1, señalando expansión en la economía china en su conjunto.',
    contenido: `El PMI de servicios de China correspondiente a mayo, publicado por Caixin/S&P Global, subió a 53.0 desde los 52.5 de abril, alcanzando su nivel más alto en 14 meses —desde marzo de 2025— y consolidando la recuperación del sector terciario chino. El índice PMI compuesto (manufactura y servicios) subió a 52.1 desde 51.8 en abril, señalando expansión en la economía china en su conjunto, pese a la debilidad en el sector exportador manufacturero por aranceles.

Los subcomponentes más fuertes del PMI servicios fueron el turismo doméstico (56.8), los servicios de tecnología y software (55.2) y la educación y salud (54.1). El consumo de servicios en China se recupera a medida que el gobierno inyecta liquidez vía subsidios directos: el programa de "cupones de consumo" lanzado en mayo distribuyó CNY 180,000 millones a 280 millones de ciudadanos en 42 ciudades, con un multiplicador estimado de 2.3x en actividad económica.

El programa de emisión de bonos especiales de gobierno local por CNY 3 billones (US$ 415,000 millones) aprobado en la reunión del politburó de mayo registra una ejecución del 38% —CNY 1.14 billones— en los primeros 20 días de operación. Las inversiones se concentran en redes eléctricas de alta tensión (32%), sistemas de agua potable y saneamiento (24%), infraestructura digital 5G-6G (18%) y transporte urbano (26%). Esta inversión masiva genera demanda de cobre, aluminio, acero y tierras raras en el horizonte de 6-18 meses.

El índice compuesto de actividad económica de Shanghai creció 4.8% interanual en mayo, la mayor expansión mensual desde el levantamiento de los confinamientos en Q4 2022. El puerto de Shanghai procesó 5.2 millones de TEUs en el mes, con los contenedores de materias primas importadas subiendo 11.2%, reflejando el aumento de la demanda industrial para los proyectos de infraestructura.`,
    analisis: `El PMI servicios chino en 53.0 con consumo interno recuperando es la señal que el mercado necesitaba para confirmar que la economía china puede crecer cerca del 4.5% en 2026, incluso si el sector exportador manufacturero enfrenta vientos en contra. Una China que crece vía consumo doméstico e infraestructura es directamente positiva para la demanda de commodities en el segundo semestre.

Para Perú, el escenario de China con inversión masiva en infraestructura eléctrica es el mejor fundamento de largo plazo para el cobre. Si el ICSG tiene razón en su proyección de déficit de 230,000 TM de cobre en 2026, el precio puede mantenerse por encima de US$ 5.00/lb durante la mayor parte del año, sosteniendo el superávit comercial peruano.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31772145/pexels-photo-31772145.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'WTI sube a US$ 90.2/barril al inicio de junio — OPEP+ sin reunión hasta septiembre y ejercicios navales de Irán mantienen prima geopolítica de US$ 8/barril',
    descripcion: 'El crudo West Texas Intermediate (WTI) abre junio en US$ 90.2 por barril (+0.3%). La OPEP+ no celebrará reunión extraordinaria antes del 5 de septiembre. Los ejercicios navales de Irán a 40 km del Estrecho de Ormuz mantienen una prima de riesgo geopolítico de US$ 8/barril. El Brent cierra en US$ 94.1. El MEF Peru estima impacto inflacionario manejable.',
    contenido: `El crudo West Texas Intermediate (WTI) para entrega en julio abre la primera jornada de junio en US$ 90.2 por barril, con un avance del 0.3% frente al cierre del viernes. El Brent del Mar del Norte se sitúa en US$ 94.1/barril (+0.4%). El inicio de junio con precios por encima del umbral de US$ 90 para el WTI refleja la persistencia de los dos factores que dominaron mayo: la disciplina de la OPEP+ en los recortes de producción y la prima de riesgo geopolítico por las tensiones en el Golfo Pérsico.

La Secretaría General de la OPEP confirmó el domingo que no habrá reunión ministerial extraordinaria antes de la cita del 5 de septiembre, descartando cualquier ajuste anticipado de la política de producción. Los 13 miembros de la OPEP y sus 10 socios del acuerdo OPEP+ mantienen los recortes voluntarios de 2.2 millones de barriles diarios (liderados por Arabia Saudita, Rusia y Emiratos Árabes Unidos). El secretario general Haitham Al Ghais declaró que "la alianza monitorea el mercado, pero la situación actual no requiere ajustes prematuros".

Los ejercicios navales de Irán en el Estrecho de Ormuz —iniciados el 28 de mayo— continúan con participación de fragatas, submarinos convencionales y lanchas rápidas de la Guardia Revolucionaria. Los seguros marítimos para tránsito por el Estrecho subieron un 40% en mayo, con primas de US$ 2.8-3.2 millones por viaje para supertanqueros VLCC. La prima de riesgo geopolítico implícita en el WTI se estima en US$ 8/barril sobre el precio de equilibrio fundamental de US$ 82/barril.

Para la economía peruana, el MEF estima que el escenario actual —WTI sostenido entre US$ 88-93 durante el Q3— añadiría 0.3-0.4 puntos porcentuales a la inflación general peruana, un impacto manejable que el BCRP puede absorber sin modificar el sesgo de su política monetaria.`,
    analisis: `El WTI en US$ 90 con OPEP+ restrictiva y prima geopolítica de US$ 8 es el equilibrio tenso que ha caracterizado al mercado petrolero en 2026. Este nivel es suficientemente alto para presionar la inflación importada en Perú, pero lejos del umbral de US$ 100-110 que generaría un shock global.

Para empresas peruanas con costos de combustibles significativos (transporte, minería, agroindustria), el nivel actual justifica mantener coberturas activas para el Q3 2026. El mayor riesgo es una escalada militar en el Golfo que envíe el WTI a US$ 110-120, escenario que no está en el caso base pero sí en el mapa de riesgos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'PEN/USD consolida en S/ 3.60-3.63 — volumen cae a US$ 980M (mínimo de 6 semanas) y posicionamiento neutral antes del BCRP del 11 jun define el próximo movimiento',
    descripcion: 'El tipo de cambio PEN/USD consolida en el rango S/ 3.60-3.63 con el soporte técnico clave en S/ 3.59 (SMA 50 días). El volumen diario cayó a US$ 980M, mínimo en seis semanas. Las posiciones especulativas netas a favor del sol son moderadas (US$ 390M). El catalizador directivo: BCRP el 11 de junio y FOMC el 16-17 de junio.',
    contenido: `El cruce PEN/USD consolida al inicio de la semana del 2 de junio en el rango S/ 3.60-3.63 por dólar, en movimiento de consolidación técnica típico de los días previos a una decisión de política monetaria. El volumen de transacciones en el mercado cambiario interbancario peruano cayó a US$ 980 millones el lunes, el registro diario más bajo en seis semanas, confirmando que los grandes participantes prefieren permanecer al margen hasta conocer la decisión del BCRP el martes 11 de junio.

El análisis técnico muestra un cuadro consistente con la espera del catalizador. El RSI diario en 46 se ubica en zona neutral con ligero sesgo bajista. El MACD está cruzando hacia abajo desde la línea de señal, aunque el histograma es mínimo —señal de cross débil que no indica reversión de tendencia sino consolidación lateral. La Banda de Bollinger está en su estrechamiento más pronunciado desde enero, lo que técnicamente precede a un movimiento amplio en cualquier dirección.

Los niveles técnicos más relevantes para la semana: soporte S/ 3.59 (mínimo del 28 de mayo y SMA de 50 días), soporte secundario S/ 3.55 (mínimo de febrero), soporte mayor S/ 3.48 (mínimo anual). Resistencias: S/ 3.64 (media de Bollinger superior), S/ 3.68 (máximo de mayo medio), S/ 3.72 (zona de distribución de mayo inicial). El punto de decisión técnica es S/ 3.59: si pierde ese nivel, el sol puede apreciarse hacia S/ 3.55; si supera S/ 3.64, el dólar puede avanzar hacia S/ 3.68-3.70.

Las posiciones especulativas netas a favor del sol en el mercado de futuros son US$ 390 millones, nivel moderado-bajo que indica que no hay un carry trade excesivo que genere riesgo de unwinding. El BCRP intervino el lunes con una compra esterilizada de US$ 90 millones para acumular reservas y moderar levemente la apreciación.`,
    analisis: `La consolidación actual del PEN/USD es técnicamente correcta: el mercado acumula energía antes de los catalizadores de junio (BCRP el 11, Fed el 16-17). Los inversores institucionales no necesitan tomar posiciones grandes cuando los catalizadores son inminentes.

La dirección post-BCRP dependerá del tono del comunicado. Un BCRP que señalice claramente que el primer recorte es inminente puede llevar el sol a S/ 3.56-3.59. Un BCRP cauteloso por la inflación puede mantener el rango S/ 3.60-3.65. En ambos casos, el fundamento de largo plazo (superávit comercial, reservas récord, cobre alto) favorece al sol.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'DXY cede a 98.5 — EUR/USD toca 1.1430 (máximo desde mayo 2021) y posición corta neta en dólares alcanza US$ 26,400M, récord desde septiembre 2021',
    descripcion: 'El índice del dólar DXY abre junio en 98.5, extendiendo la caída de mayo (-5.1%). El EUR/USD alcanzó 1.1430, máximo desde mayo de 2021. La posición neta corta en dólares en el CME suma US$ 26,400 millones, el mayor nivel desde septiembre de 2021. El USD/JPY cede a 143.8 con rumores de ajuste adicional del BOJ.',
    contenido: `El Índice del Dólar DXY cotiza en 98.5 al inicio de junio, acumulando un descenso adicional del 0.3% desde el cierre del viernes y extendiendo la tendencia bajista de mayo que llevó al índice a perder un 5.1%. La estructura técnica sigue siendo bajista: el DXY está por debajo de sus medias móviles de 50, 100 y 200 días (que se ubican en 100.8, 102.4 y 103.1 respectivamente), con las tres medias en alineación bajista.

El EUR/USD rompió al alza alcanzando 1.1430, máximo desde el 24 de mayo de 2021, favorecido por el diferencial de política monetaria que ya no favorece al dólar (Fed en pausa con perspectiva de recortes vs. BCE que mantiene tasa en 2.75% sin señales de recortes adicionales a corto plazo). El GBP/USD avanzó a 1.2980 (máximo de 8 semanas), el USD/JPY cedió a 143.8 (el yen recupera terreno ante rumores de que el Banco de Japón analiza otro ajuste de su política de control de curva de rendimientos), y el USD/CHF cayó a 0.8790.

El dato más significativo es el posicionamiento en el mercado de futuros de divisas del CME: la posición neta corta en dólares (long en otras divisas frente al USD) alcanza US$ 26,400 millones, el mayor nivel desde septiembre de 2021. Este posicionamiento especulativo confirma el consenso bajista sobre el dólar, pero también crea el principal riesgo técnico: si un dato de inflación americano sorprende al alza antes del FOMC, el cierre masivo de posiciones cortas puede provocar un rebote del DXY del 2-3% en horas.

Los modelos de valoración de divisas de JPMorgan y Goldman Sachs sitúan el valor razonable del DXY en 96-98, lo que implica que el índice está cerca de su valor fundamental. El camino de menor resistencia sigue siendo bajista mientras la Fed mantenga el sesgo dovish y los bancos centrales continúen diversificando reservas fuera del dólar.`,
    analisis: `El DXY en 98.5 con EUR/USD en 1.1430 y posicionamiento bajista en máximos de 5 años es un entorno estructuralmente favorable para monedas con fundamentos sólidos como el sol peruano. El riesgo clave es el dato de inflación americano de mayo que se publica antes del FOMC del 16-17 de junio: una sorpresa alcista puede generar un rebote del DXY de 1.5-2.5%.

Para empresas peruanas, el DXY en 98-100 corresponde históricamente con PEN/USD en el rango S/ 3.55-3.65. Si el DXY cae hacia 96-97 en el segundo semestre (como proyectan Goldman y JPMorgan), el sol puede apreciarse hacia S/ 3.45-3.55. El rebound post-FOMC, si ocurre, sería la oportunidad para comprar dólares a precio razonable.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31738798/pexels-photo-31738798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'Bitcoin supera el máximo histórico y toca US$ 110,200 — primer ATH desde enero con volumen de US$ 54,000M en 24h y ETFs reciben US$ 890M en un solo día',
    descripcion: 'Bitcoin (BTC/USD) superó el lunes su máximo histórico previo de US$ 109,800 (enero 2026) y tocó US$ 110,200, estableciendo un nuevo all-time high. El volumen en exchanges spot alcanzó US$ 54,000M en 24 horas (+35% sobre el promedio). Los ETFs de Bitcoin en EE.UU. recibieron US$ 890M en un solo día, el mayor flujo diario desde febrero.',
    contenido: `Bitcoin (BTC/USD) superó el lunes su máximo histórico previo de US$ 109,800 —registrado el 20 de enero de 2026— y alcanzó US$ 110,200 en la sesión asiática, estableciendo un nuevo all-time high (ATH). El movimiento se produjo con un volumen de transacciones en exchanges spot de US$ 54,000 millones en las últimas 24 horas, un incremento del 35% frente al promedio de la semana pasada, confirmando que la ruptura del ATH está respaldada por flujos genuinos y no por liquidaciones de posiciones cortas.

El catalizador fue una combinación de factores: el NFP de mayo mostró moderación del mercado laboral americano (compatible con recortes de la Fed en septiembre), el DXY cedió a 98.5 (dólar débil impulsa activos alternativos), y MicroStrategy/Strategy anunció la adquisición de 1,800 BTC adicionales por US$ 198M, elevando su holding a 593,800 BTC valuados en US$ 65,400 millones.

Los ETFs de Bitcoin en EE.UU. recibieron US$ 890 millones en flujos netos el lunes, el mayor flujo diario desde el 14 de febrero. El iShares Bitcoin Trust de BlackRock (IBIT) capturó US$ 412M, el Fidelity Wise Origin Bitcoin Fund (FBTC) US$ 198M y el ARK 21Shares Bitcoin ETF (ARKB) US$ 88M. Los activos totales bajo gestión de los ETFs de Bitcoin superan los US$ 133,000 millones, un nuevo récord histórico.

El mercado de opciones señala optimismo moderado: las opciones call en US$ 115,000 y US$ 120,000 para julio concentran el mayor open interest desde enero. El ratio put/call cae a 0.48, señal alcista. La volatilidad implícita a 30 días subió de 42% a 48%, compatible con un rally sostenido sin señales de euforia extrema. Ethereum sube 2.8% hasta US$ 4,380 y Solana gana 1.4% hasta US$ 202.`,
    analisis: `Bitcoin en US$ 110,200 con nuevo ATH y volumen institucional respaldado es el inicio del leg alcista que el mercado cripto esperaba desde enero. La diferencia con el ATH de enero es que ahora hay más infraestructura institucional (US$ 133,000M en ETFs) que actúa como comprador estructural en las caídas.

El impacto macro del Bitcoin en el tipo de cambio peruano es indirecto pero real: un BTC que rompe ATH señaliza que los inversores globales buscan alternativas al dólar como reserva de valor —mismo mensaje del oro en máximos, mismo mensaje del EUR/USD en máximos de 5 años. Todo converge: DXY débil implica sol más fuerte.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14354113/pexels-photo-14354113.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina: inflación mayo 1.8% marca mínimo desde 2021 — BCRA reduce tasa de emergencia de 45% a 38% y brecha cambiaria cae al 2.9% con ARS 1,430',
    descripcion: 'El INDEC publicó la inflación de mayo de Argentina en 1.8% mensual, la más baja desde diciembre de 2021. El Banco Central de Argentina redujo la tasa de política de emergencia del 45% al 38%, señalando confianza en la convergencia. La brecha entre el tipo de cambio oficial (ARS 1,430) y el MEP cayó al 2.9%, mínimo desde noviembre de 2023.',
    contenido: `El Instituto Nacional de Estadísticas y Censos (INDEC) de Argentina publicó el índice de precios al consumidor de mayo con un resultado de 1.8% mensual, la inflación más baja desde diciembre de 2021. La caída desde el 2.1% de abril confirma la tendencia de desinflación del programa económico de Milei y se produce antes de lo previsto por el consenso de analistas, que esperaba entre 2.0% y 2.3%. La inflación interanual cayó a 58.6% desde el 61.4% de abril.

El Banco Central de la República Argentina (BCRA) reaccionó rápidamente: en una decisión anunciada el lunes, el directorio aprobó la reducción de la tasa de política monetaria de emergencia del 45% al 38% anual. La tasa había sido elevada de 35% a 45% el 28 de mayo para contener la presión sobre el dólar blue que había superado ARS 1,720. Con la inflación confirmando la desinflación, el BCRA normaliza la tasa hacia su sendero de largo plazo en el rango 28-32%.

El tipo de cambio oficial del peso argentino se mantiene en ARS 1,430 por dólar, con el esquema de crawling peg de devaluación mensual del 1% vigente. La brecha con el tipo de cambio MEP cayó al 2.9%, el nivel más bajo desde noviembre de 2023, señal de que la confianza en el esquema cambiario es la más alta del gobierno de Milei. El dólar blue cede a ARS 1,472, dentro del rango de tolerancia del programa.

El FMI elogió el dato de inflación en un comunicado, señalando que "Argentina está en la senda correcta para alcanzar la meta de inflación del 1.0%-1.5% mensual para el Q4 2026". El siguiente desembolso del programa de facilidades extendidas, de US$ 4,200 millones, está condicionado a la revisión del 20 de junio que evaluará el cumplimiento de las metas fiscales y monetarias.`,
    analisis: `Una inflación mensual del 1.8% en Argentina hace 18 meses era impensable —el gobierno heredó una inflación mensual del 25.5% en diciembre de 2023. La velocidad de la desinflación ha sido extraordinaria y refleja el ancla fiscal (superávit primario del 1.2% del PBI), la moderación salarial y el ancla cambiaria del crawling peg.

Para empresas peruanas con operaciones en Argentina, la estabilización en ARS 1,430 con brecha al 2.9% y tendencia bajista de inflación ofrece más certeza para planificar operaciones que en cualquier momento de los últimos tres años. El riesgo sigue siendo la sostenibilidad política del ajuste: cualquier retroceso en el programa generaría volatilidad cambiaria rápida.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Colombia: TRM cede a COP 3,610/USD con peso apreciándose 6.1% en mayo-junio — Banrep analiza recorte el 20 junio con inflación de servicios en 7.2%',
    descripcion: 'La TRM de Colombia cayó a COP 3,610 por dólar al inicio de junio, continuando la apreciación del peso impulsada por WTI en US$ 90 y DXY en 98.5. El Banco de la República analiza si retomar el ciclo de recortes en su reunión del 20 de junio. La inflación de servicios cedió a 7.2%, umbral clave para la decisión. El mercado asigna 54% de probabilidad al recorte.',
    contenido: `La Tasa Representativa del Mercado (TRM) de Colombia abrió la semana en COP 3,610 por dólar americano, su nivel más bajo desde el 8 de enero de 2026, extendiendo la apreciación del peso colombiano que acumula 6.1% de ganancia frente al dólar en mayo-junio. Los tres motores son el WTI en US$ 90/barril (Colombia exporta ~730,000 barriles/día de crudo), el DXY en 98.5 (dólar estructuralmente débil) y los flujos de portafolio hacia mercados emergentes latinoamericanos.

El Banco de la República de Colombia (Banrep) celebrará su próxima reunión de política monetaria el viernes 20 de junio. El debate interno gira en torno a si retomar el ciclo de recortes que fue pausado en la reunión de abril, cuando el directorio decidió mantener la tasa de intervención en 9.25% ante la persistencia de la inflación de servicios. Desde entonces, el componente de servicios cedió de 7.8% a 7.2% —mejora modesta pero en la dirección correcta.

El dato de inflación de mayo (publicado el jueves 5 de junio) será determinante para la decisión: si la inflación de servicios cae por debajo de 7.0%, el directorio del Banrep tendrá los argumentos para un recorte de 25 pbs hasta 9.00%. Si se mantiene en 7.2% o sube, la probabilidad de pausa vuelve a ser dominante. El mercado de futuros de TES asigna actualmente un 54% de probabilidad al recorte de junio.

La economía colombiana muestra recuperación moderada: el PIB creció 2.9% en Q1 2026, con el consumo privado (+3.4%) y la formación bruta de capital fijo (+4.1%) liderando. Sin embargo, el sector minero-energético enfrenta presiones: la producción de petróleo cayó 4.2% interanual en Q1 ante restricciones de exploración. Ecopetrol reportó una reducción del 8.4% en su utilidad neta del trimestre.`,
    analisis: `Un TRM en COP 3,610 con posible recorte del Banrep el 20 de junio crea un escenario de apreciación adicional del peso colombiano a corto plazo. Si el Banrep recorta y el WTI mantiene US$ 87+, el TRM puede probar la zona COP 3,500-3,550 en el Q3.

Para empresas peruanas con operaciones en Colombia, la apreciación del COP es positiva para el costo real de las importaciones desde Colombia. Es una ventana para fijar precios en contratos de servicios denominados en pesos a tipos favorables antes de que el ciclo de apreciación eventualmente se revierta.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Chile: BCCh se reúne mañana 12-13 jun con 72% de probabilidad de recorte a 3.50% — CLP 920/USD y cobre en US$ 5.15/lb como anclas cambiarias para la decisión',
    descripcion: 'El Banco Central de Chile celebra mañana y el viernes su reunión de política monetaria con el mercado asignando un 72% de probabilidad a un recorte de 25 pbs que llevaría la TPM de 3.75% a 3.50%. El peso chileno cotiza en CLP 920/USD. Si el BCCh recorta, sería el sexto recorte del ciclo y completaría 775 pbs de relajamiento desde el máximo de 11.25%.',
    contenido: `El Banco Central de Chile (BCCh) celebrará su reunión de política monetaria los días 12 y 13 de junio con el mercado asignando un 72% de probabilidad a un recorte de 25 puntos básicos de la Tasa de Política Monetaria (TPM), desde el nivel actual del 3.75% hasta 3.50%. Solo un 28% del mercado espera una pausa. La decisión se anunciará el viernes 13 de junio por la tarde.

El fundamento para el recorte es sólido. La inflación chilena de mayo fue del 3.2% anual, el nivel más bajo desde enero de 2021 y claramente dentro del rango meta del BCCh de 2%-4%. La inflación subyacente (sin alimentos ni energía) bajó a 3.0%, el nivel más bajo en cinco años. El crecimiento del PIB en Q1 fue del 3.8%, con impulso del consumo privado (+3.2%) y la inversión (+4.1%), sin señales de sobrecalentamiento. Los cinco miembros del Consejo tienen amplio margen para recortar sin sacrificar el ancla inflacionaria.

El peso chileno (CLP) cotiza en CLP 920 por dólar, el nivel más fuerte desde diciembre de 2022, favorecido por el cobre en US$ 5.15/lb. Chile es el mayor productor de cobre del mundo (27% de la oferta global) y el precio actual genera un superávit comercial récord que actúa como soporte estructural del CLP. La Bolsa de Santiago (IPSA) avanza 0.8% en la jornada, liderada por SQM (+2.1%, por el litio en US$ 13,100/TM) y Antofagasta Minerals (+1.4%).

Si el BCCh recorta a 3.50%, será el sexto recorte del ciclo que comenzó en julio de 2023 desde el máximo de 11.25%. El BCCh habrá completado 775 pbs de recortes en 36 meses, uno de los ciclos de relajamiento monetario más amplios en la historia de Chile. Los analistas estiman que la tasa neutral está en torno al 3.25%-3.50%, lo que implica que el ciclo de recortes podría estar llegando a su fin.`,
    analisis: `Un BCCh que recorta a 3.50% confirma que la economía chilena ha completado la desinflación y puede crecer con tasas reales más bajas. Para el CLP, el recorte tiene un efecto bajista directo (diferencial de tasas más estrecho frente al dólar) que puede llevar el tipo de cambio de CLP 920 hacia CLP 930-940 en las sesiones siguientes al anuncio.

La analogía para el sol peruano es directa: cuando el BCRP recorte (julio-agosto es el escenario más probable), la reacción inicial del PEN será de moderada depreciación transitoria (S/ 3.63-3.65), seguida de recuperación a medida que el mercado confirma que el ciclo de crédito más activo genera más crecimiento. La experiencia chilena de los últimos 36 meses es el mejor roadmap para interpretar cómo reaccionará el sol ante el primer recorte del BCRP.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  {
    id: 'g001',
    titulo: 'Sol peruano en S/ 3.40 con inflación en 4.0% sobre la meta — BCRP mantiene tasa en 4.25% por octavo mes y reunión del 11 de junio en foco con reservas en US$ 83,489M',
    descripcion: 'El sol peruano cotiza en S/ 3.40 por dólar al inicio de junio, apreciado por el superávit comercial minero y el DXY débil. El BCRP mantiene su tasa de referencia en 4.25% por octavo mes consecutivo en un contexto en que la inflación anual de abril (4.0%) supera el rango meta del 1%-3%. La próxima reunión de política monetaria es el 11 de junio.',
    contenido: `El sol peruano (PEN) cotiza en S/ 3.40 por dólar al inicio de junio, dentro del rango de la última semana de mayo que fluctuó entre S/ 3.3979 y S/ 3.4231. El tipo de cambio acumula una caída interanual de 6.1% frente al dólar —lo que significa que el sol se ha apreciado ese porcentaje en doce meses— impulsado por el superávit comercial récord de las exportaciones mineras (cobre en US$ 5.10/lb, oro en US$ 3,421/oz) y el debilitamiento estructural del DXY, que cerró mayo en 98.8 tras perder 5.1% en el mes.

El Banco Central de Reserva del Perú (BCRP) mantiene su tasa de interés de referencia en 4.25% por octavo mes consecutivo. La decisión más reciente del 14 de mayo se adoptó en un contexto de presión inflacionaria: la inflación interanual subió de 3.8% en marzo a 4.0% en abril, superando el techo del rango meta del 1%-3%. La inflación subyacente (sin alimentos ni energía) aumentó de 3.7% a 4.4%, también fuera del rango. Los principales impulsores son los precios del transporte local y los combustibles, en línea con el alza del petróleo internacional.

Las reservas internacionales del BCRP cerraron abril en US$ 83,489 millones, consolidando uno de los niveles más altos de su historia. En un momento de abril se llegaron a superar los US$ 100,000 millones en términos brutos, hito histórico para el banco central peruano. La próxima sesión del Programa Monetario está programada para el 11 de junio. Con la inflación por encima del rango meta, el escenario más probable es que el directorio mantenga la tasa en 4.25%, a la espera de confirmar la convergencia inflacionaria antes de iniciar cualquier ciclo de recortes.

El BCRP indicó que buena parte del incremento de precios responde a factores de oferta considerados temporales —en particular el encarecimiento del petróleo internacional— y mantuvo sus proyecciones de que la inflación retornará al rango meta en el horizonte de doce meses. Sin embargo, la persistencia de la inflación subyacente en 4.4% añade incertidumbre sobre el timing de un primer recorte.`,
    analisis: `Con inflación en 4.0% sobre el techo de la meta y la inflación subyacente en 4.4%, el BCRP no tiene espacio para recortar tasas en junio sin arriesgar la credibilidad de su marco de inflación objetivo. El mercado deberá esperar varios meses de datos que confirmen la convergencia antes de que se materialice el primer recorte del ciclo.

Para empresas con operaciones en soles, el entorno de tasas estables en 4.25% significa que las tasas activas del sistema bancario se mantendrán en torno al 10-11% en el corto plazo. La clave a monitorear es si la inflación de mayo (aún no publicada) muestra descenso o sigue subiendo: ese dato, combinado con la evolución del petróleo, definirá el tono del BCRP en la reunión del 11 de junio.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g002',
    titulo: 'Fed descarta recorte en junio — FOMC del 16-17 de junio con 97% de probabilidad de pausa; CPI en 3.8%, NFP +115k y PCE core en 2.6%',
    descripcion: 'La Reserva Federal casi con certeza mantendrá sin cambios la tasa de fondos federales en el rango 3.50%-3.75% en la reunión del FOMC del 16-17 de junio, según los futuros de Fed Funds que asignan un 97% de probabilidad de pausa. El CPI de abril en 3.8%, la creación de empleo de mayo de +115k y el PCE core en 2.6% no justifican movimientos inminentes.',
    contenido: `El Comité Federal de Mercado Abierto (FOMC) celebrará su próxima reunión de política monetaria los días 16 y 17 de junio. El mercado de futuros de Fed Funds en el CME (FedWatch Tool) asigna un 97% de probabilidad de que la tasa de fondos federales se mantenga sin cambios en el rango actual de 3.50%-3.75%, con solo un 3% de probabilidad de recorte de 25 pbs. Es el consenso más unánime del año en torno a una pausa.

Los datos que justifican la pausa son sólidos: el Índice de Precios al Consumidor (CPI) de abril fue del 3.8% anual, significativamente por encima del objetivo del 2%. El PCE core —la medida de inflación preferida de la Fed— se ubica en 2.6%, todavía por encima del 2.3% que varios miembros del FOMC señalan como umbral para recortar. Las nóminas no agrícolas (NFP) de mayo mostraron una creación de +115,000 empleos, moderada pero suficiente para mantener el desempleo en 4.3%, sin señales de deterioro agudo del mercado laboral.

El presidente de la Fed, Kevin Warsh, quien asumió en mayo, ha reiterado en sus discursos públicos que "la paciencia es la virtud más importante en este ciclo". El dot plot publicado en marzo proyectaba dos recortes en 2026; el mercado ahora descuenta uno: en septiembre (58% de probabilidad) o en noviembre (74% acumulado para ese entonces). Un recorte en diciembre tendría prácticamente certeza (88%) si los datos de inflación continúan cediendo.

El DXY refleja esta expectativa de política monetaria estable en el corto plazo: el índice del dólar cotiza en 98.8, perdiendo 0.3% en la semana, con la tendencia estructural bajista intacta mientras la Fed mantiene el sesgo dovish para la segunda mitad del año. Los rendimientos del Tesoro a 10 años ceden a 4.28%, con la curva 2-10Y en -5 pbs (mínimamente invertida), señal de que el mercado anticipa normalización monetaria gradual.`,
    analisis: `La pausa de junio de la Fed es el escenario central, pero lo que realmente importa al mercado es cuándo y cuánto recortará en el segundo semestre. La ventana de septiembre-noviembre concentra el 74% de la probabilidad del primer recorte, lo que genera un entorno de dólar estructuralmente débil que favorece a monedas emergentes con fundamentos sólidos como el sol peruano.

Para empresas peruanas que operan con plazos de 3-6 meses, el contexto de Fed en pausa y DXY débil sugiere que el sol se mantendrá en el rango S/ 3.58-3.68 durante el trimestre. Este es el momento para evaluar coberturas cambiarias de largo plazo antes de que los recortes de la Fed materialicen y el DXY caiga hacia 96-97.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g003',
    titulo: 'Exportaciones de cobre peruano suman US$ 1,777M en mayo (+15.2%) — precio en US$ 5.10/lb sostiene ingresos récord y canon minero en máximos históricos',
    descripcion: 'Las exportaciones de cobre del Perú alcanzaron US$ 1,777 millones en mayo de 2026, un crecimiento del 15.2% interanual, según el reporte preliminar de MINEM. El precio promedio del cobre en mayo fue de US$ 5.10/lb en la London Metal Exchange. El canon minero acumulado distribuido a regiones en lo que va del año alcanza S/ 8,760 millones.',
    contenido: `El Ministerio de Energía y Minas (MINEM) publicó el reporte preliminar de exportaciones del sector minero correspondiente a mayo de 2026, con el cobre aportando US$ 1,777 millones, un crecimiento del 15.2% frente a los US$ 1,542 millones de mayo 2025. El resultado lleva el acumulado del año en exportaciones de cobre a US$ 13,017 millones en los cinco primeros meses, consolidando 2026 como el mejor año en la historia de la minería cuprífera peruana.

El precio promedio del cobre en mayo fue de US$ 5.10 por libra (US$ 11,244/TM) en la London Metal Exchange. Aunque cede levemente desde el pico de US$ 5.18/lb de la tercera semana de mayo, el nivel actual sigue siendo excepcionalmente elevado: el costo de producción cash cost promedio de las minas peruanas se sitúa en torno a US$ 1.85-2.10/lb, generando márgenes operativos del 145-175% sobre el costo. Esta rentabilidad excepcional impulsa el Impuesto a la Renta y las regalías mineras que fluyen al fisco.

Southern Copper (Toquepala, Cuajone y participación en Cerro Verde), Antamina (BHP/Glencore/Teck/Mitsubishi), Cerro Verde (Freeport-McMoRan) y Quellaveco (Anglo American) reportaron una producción conjunta de 367,800 toneladas métricas de cobre fino en mayo, un incremento del 8.4% frente al mismo mes de 2025. La ampliación de capacidad de Cerro Verde completada en Q4 2025 contribuyó con 18,200 TM adicionales de la comparativa histórica.

El canon minero acumulado distribuido a los gobiernos regionales y locales en los primeros cinco meses de 2026 asciende a S/ 8,760 millones, equivalente al 73% del total de S/ 12,000 millones proyectados para el año. Las regiones más beneficiadas son Arequipa (S/ 2,840M), Áncash (S/ 2,180M) y Moquegua (S/ 1,920M). Esta transferencia masiva de recursos está financiando obras de infraestructura vial, agua y saneamiento, y educación en las regiones mineras.`,
    analisis: `Exportaciones de cobre de US$ 1,777M en un solo mes representan un flujo de divisas que, convertido a soles al tipo de cambio actual, equivale a S/ 6,415M —prácticamente el presupuesto mensual de salud del Estado peruano. Estos flujos son el ancla más robusta de la estabilidad del sol peruano.

El precio del cobre en US$ 5.10/lb genera una prima extraordinaria sobre el costo de producción que se traduce en más impuestos, más regalías y más canon. Para el tipo de cambio, cada trimestre que el cobre se mantenga por encima de US$ 4.80/lb es otro trimestre en que el sol peruano tiene fundamentos estructurales para mantenerse apreciado frente al dólar.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g004',
    titulo: 'Agroexportaciones peruanas superan US$ 1,020M en mayo — café bate récord mensual con US$ 98M y palta registra envíos a China con crecimiento del 180%',
    descripcion: 'Las agroexportaciones del Perú alcanzaron US$ 1,020 millones en mayo de 2026, impulsadas por el café (US$ 98M, récord mensual), la palta Hass (US$ 189M, con envíos a China creciendo 180%) y los arándanos (US$ 142M). Es el segundo mejor mayo de la historia del sector, superando el promedio mensual de US$ 940M del Q1 2026.',
    contenido: `Las exportaciones agropecuarias del Perú superaron la barrera de los US$ 1,000 millones en un solo mes por segunda vez en la historia —la primera fue octubre 2025— al totalizar US$ 1,020 millones en mayo de 2026. El resultado refleja la combinación de precios altos de commodities agrícolas en los mercados internacionales, la expansión de la oferta peruana y la diversificación de mercados de destino.

El café peruano registró su récord mensual de exportaciones con US$ 98 millones, impulsado por los precios del café arábica que superan los US$ 4,200 por quintal en el ICE de Nueva York —más del doble de los US$ 2,000/quintal promedio de 2024—. Los productores de Amazonas, San Martín, Cajamarca y Junín están capturando precios nunca antes vistos, con las cooperativas cafetaleras logrando contratos directos con tostadores europeos de specialty coffee a US$ 6,800-7,200/quintal, tres veces el precio de referencia del comercio convencional.

La palta Hass aportó US$ 189 millones en mayo (+22.4%), con el incremento más notable en el mercado chino, donde los envíos crecieron 180% interanual hasta representar el 21% del total exportado. El precio FOB promedio de la palta peruana subió a US$ 3.35/kg, favorecido por la baja oferta de México (que enfrenta condiciones climáticas adversas) y la creciente demanda del mercado asiático por frutos con alto valor nutricional. Los valles de Ica, La Libertad y Piura concentran el 78% de la oferta exportable.

Los arándanos sumaron US$ 142 millones (+9.8%), con el Reino Unido, Países Bajos y EE.UU. como principales destinos. La temporada de exportación de arándanos se extendió este año gracias a nuevas variedades desarrolladas por el Instituto de Investigación Agroexportadora que amplían la ventana productiva de seis a ocho meses. El espárrago fresco y congelado contribuyó con US$ 82 millones, manteniendo a Perú como el mayor exportador global del producto por vigésimo año consecutivo.`,
    analisis: `Las agroexportaciones peruanas acumulan en los primeros cinco meses de 2026 un ritmo anualizado superior a US$ 12,000 millones, que superaría el récord histórico de US$ 9,800M de 2025. Esta expansión genera dos impactos relevantes para el mercado cambiario: mayor oferta de dólares que presiona el tipo de cambio a la baja y mayor diversificación del ingreso de divisas, que hace al sol menos dependiente del precio de un solo commodity.

El caso del café es especialmente relevante: si Perú mantiene el posicionamiento en specialty coffee, puede multiplicar el valor por kilogramo exportado hasta 5x en la siguiente década. Es el tipo de escalamiento en la cadena de valor que transforma una economía exportadora de materias primas en una exportadora de valor añadido.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g005',
    titulo: 'MEF distribuye S/ 8,760M de canon minero en cinco meses — regiones productoras invierten en infraestructura récord con Arequipa liderando con S/ 2,840M',
    descripcion: 'El Ministerio de Economía y Finanzas transfirió S/ 8,760 millones de canon y sobrecanon minero en enero-mayo de 2026, el 73% del total proyectado de S/ 12,000 millones para el año. Arequipa (S/ 2,840M), Áncash (S/ 2,180M) y Moquegua (S/ 1,920M) lideran las transferencias y ejecutan programas de inversión pública a ritmo récord.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) informó que las transferencias de canon minero, sobrecanon, regalías, derechos de vigencia y penalidades a gobiernos regionales y locales totalizaron S/ 8,760 millones en los primeros cinco meses de 2026, el mayor monto distribuido en ese período en la historia del Perú. El resultado equivale al 73% del total proyectado de S/ 12,000 millones para el año completo, por encima del ritmo de ejecución histórico del 68%.

Las regiones mineras principales lideran las transferencias: Arequipa recibió S/ 2,840 millones (principalmente por el complejo Cerro Verde de Freeport-McMoRan y Quellaveco de Anglo American), Áncash S/ 2,180 millones (principalmente por Antamina), Moquegua S/ 1,920 millones (Southern Copper) y Tacna S/ 1,450 millones. Los recursos están siendo ejecutados en proyectos de infraestructura a ritmo sin precedentes: hospitales regionales, carreteras, sistemas de agua potable y electrificación rural.

La tasa de ejecución presupuestal de las regiones mineras en enero-mayo es del 42%, por encima del promedio nacional del 31%. El mayor canon y la mayor capacidad institucional de los gobiernos regionales más grandes explican la diferencia. El MEF proyecta que si el precio del cobre se mantiene en el rango US$ 4.80-5.20/lb durante el Q2 y Q3 2026, el canon total del año podría superar los S/ 13,500 millones, un 12.5% por encima del presupuesto original.

El canon minero 2026 es también el mayor generador de empleo en obras públicas del interior del país. La Cámara Peruana de la Construcción (CAPECO) estima que los proyectos financiados con canon generarán 48,000 empleos directos en regiones mineras durante el segundo semestre, con un efecto multiplicador que alcanza los 120,000 empleos indirectos en las economías locales.`,
    analisis: `La distribución masiva de canon minero es el mecanismo por el cual el boom de precios de materias primas se traduce en bienestar regional. S/ 12,000 millones anuales es más que el presupuesto combinado de inversión pública de ocho regiones medianas del país, y todo financiado por los impuestos que pagan las empresas mineras sobre sus ganancias extraordinarias.

Para el análisis macroeconómico, el canon es también un estabilizador automático: cuando el cobre está alto (como ahora), el Estado distribuye más recursos a las regiones y genera más demanda doméstica. Este mecanismo hace la política fiscal peruana más contracíclica que la de la mayoría de los países de la región y fortalece la posición macro del sol.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g006',
    titulo: 'Sistema bancario peruano acelera: crédito crece 6.1% en mayo y ROE sube a 18.4% — morosidad baja a 3.1%, el nivel más bajo en dos años',
    descripcion: 'La Superintendencia de Banca, Seguros y AFP reportó que el crédito total al sector privado creció 6.1% interanual en mayo de 2026, acelerando desde el 5.8% de abril. La rentabilidad sobre el patrimonio (ROE) del sistema bancario subió a 18.4%, el nivel más alto desde 2019. La morosidad bajó a 3.1%, su nivel más bajo en 24 meses.',
    contenido: `La Superintendencia de Banca, Seguros y AFP (SBS) publicó las cifras preliminares del sistema financiero peruano correspondientes a mayo de 2026, mostrando una aceleración en todos los indicadores de actividad crediticia. El crédito total al sector privado alcanzó S/ 437,200 millones, con un crecimiento interanual del 6.1%, frente al 5.8% de abril. La tendencia confirma que el dinamismo crediticio está recuperando impulso de forma gradual y sostenida.

El segmento corporativo y grandes empresas lidera con +8.9% interanual, impulsado por las líneas de capital de trabajo del sector minero, el financiamiento de proyectos de infraestructura agroexportadora y los créditos sindicados para inversión en energía renovable. El crédito hipotecario creció 6.8%, favorecido por la caída de las tasas hipotecarias desde el pico del 10.8% de 2024 al 9.2% actual en soles. El segmento de consumo personal subió 5.4%.

La morosidad del sistema bajó a 3.1% en mayo, su nivel más bajo desde mayo de 2024, gracias a la mejora de la capacidad de pago de empresas e individuos y a la activa gestión de cartera de los bancos. La banca corporativa mantiene morosidad mínima del 0.3%, mientras el segmento de microempresa —el más alto del sistema— cedió a 5.8% desde 6.1% del mes anterior.

La rentabilidad sobre el patrimonio (ROE) del sistema bancario consolidado subió a 18.4% en mayo, el nivel más elevado desde el Q4 de 2019, sostenida por los márgenes de interés neto (NIM) en 5.2% y la reducción del costo de provisiones. Las cinco grandes entidades —BCP, BBVA, Scotiabank, Interbank y BanBif— reportan en conjunto una utilidad neta de S/ 4,120 millones en el acumulado enero-mayo, un incremento del 18.4% frente al mismo período de 2025.`,
    analisis: `Un sistema bancario con crédito acelerando (6.1%), morosidad bajando (3.1%) y ROE en máximos (18.4%) es la expresión financiera de una economía que está en expansión moderada y sostenible. No hay señales de sobrecalentamiento crediticio ni de deterioro de la calidad de activos. Es el escenario ideal para una política monetaria que comienza a normalizar las tasas hacia abajo.

Para empresas que buscan financiamiento, el entorno de tasas activas en 10.3% en soles y en descenso gradual es el mejor momento de los últimos tres años para planificar refinanciamientos o nuevas inversiones a largo plazo. Si el BCRP recorta en junio, las tasas activas pueden comenzar a ceder hacia 9.5-10% en el Q3 2026.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g007',
    titulo: 'China PMI manufacturero mejora a 50.0 en mayo (NBS) — Caixin sube a 51.8 y señal de estabilización reactiva demanda de commodities; cobre recupera US$ 5.10/lb',
    descripcion: 'El PMI manufacturero oficial de China (NBS) mejoró a 50.0 en mayo desde 49.5 en abril, regresando al umbral de expansión. El PMI Caixin subió a 51.8 desde 51.7, su nivel más alto desde agosto de 2024. La mejora reactiva la demanda de commodities industriales: el cobre subió 0.8% hasta US$ 5.10/lb en el LME y el aluminio ganó 1.2%.',
    contenido: `La Oficina Nacional de Estadísticas de China (NBS) publicó el PMI manufacturero de mayo en 50.0, mejorando desde 49.5 en abril y superando la expectativa del consenso de 49.8. El regreso al umbral de 50 —la línea divisoria entre expansión y contracción— es una señal positiva después de dos meses de lecturas por debajo de ese nivel. El PMI Caixin —que mide principalmente pequeñas y medianas empresas orientadas al mercado doméstico— subió a 51.8 desde 51.7 en abril, alcanzando su nivel más alto desde agosto de 2024.

La mejora del PMI oficial refleja principalmente la recuperación del sector manufacturero doméstico: el subíndice de producción subió a 51.4 desde 50.7, y los nuevos pedidos domésticos avanzaron a 51.9 desde 50.8, beneficiados por los subsidios al consumo de vehículos eléctricos, electrodomésticos y equipos de eficiencia energética que el gobierno extendió en mayo. El componente de nuevos pedidos de exportación se recuperó levemente a 47.8 desde 46.8, todavía en zona de contracción pero mostrando que el peor momento del impacto arancelario podría haber quedado atrás.

El politburó chino aprobó en su reunión de mayo la aceleración del programa de emisión de bonos especiales de gobierno local por CNY 3 billones (US$ 415,000 millones) destinados a infraestructura en redes eléctricas, sistemas de agua, residuos sólidos y transportes. Este estímulo se materializará principalmente en el Q3-Q4 2026 e implica una demanda adicional de cobre, aluminio, acero y otros metales básicos que beneficia directamente a los productores peruanos.

El mercado de metales reaccionó positivamente: el cobre en la LME subió 0.8% hasta US$ 5.10/lb, recuperándose desde el mínimo de US$ 5.02/lb del viernes. El aluminio ganó 1.2%, el zinc +0.9% y el níquel +1.8%. El índice de metales industriales Bloomberg subió 0.7% en la sesión, con las acciones de mineras peruanas en el S&P/BVL avanzando en promedio 1.4%.`,
    analisis: `Un PMI manufacturero chino de 50.0 no es expansión robusta, pero es el fin de la contracción —y eso es suficiente para estabilizar las expectativas del mercado de commodities. La clave ahora es si el PMI oficial puede sostenerse por encima de 50 durante los meses de junio, julio y agosto, mientras los estímulos de CNY 3 billones se materializan en órdenes concretas de metales.

Para Perú, cada punto de mejora en el PMI manufacturero chino se traduce en mayor demanda de cobre. Si China estabiliza en 50-51 el NBS PMI, el cobre puede mantenerse en el rango US$ 4.90-5.20/lb, que es el corredor que genera el mayor flujo de divisas y crecimiento económico que hemos visto en 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g008',
    titulo: 'Oro cierra mayo en US$ 3,421/oz — bancos centrales compraron 281 toneladas en Q1 2026 y Goldman Sachs mantiene target de US$ 3,700 para diciembre',
    descripcion: 'El oro spot cerró mayo en US$ 3,421 por onza troy, avanzando 2.8% en el mes y acumulando un 12.4% en lo que va del año. El World Gold Council reportó compras de bancos centrales de 281 toneladas en Q1 2026, el tercer trimestre consecutivo por encima de 250 toneladas. Goldman Sachs mantiene su objetivo en US$ 3,700/oz para diciembre.',
    contenido: `El oro spot (XAU/USD) cerró el mes de mayo en US$ 3,421 por onza troy, con una ganancia mensual del 2.8% que lleva el acumulado del año al 12.4%. El metal precioso se consolida como el activo de mejor desempeño de 2026 entre las principales clases de activos, superando al S&P 500 (+8.1%), al Bitcoin (+24% desde enero pero con alta volatilidad) y a los bonos del Tesoro de EE.UU. (-1.2% en precio por la caída de yields).

El World Gold Council (WGC) publicó su reporte de demanda del Q1 2026, confirmando que los bancos centrales compraron 281 toneladas de oro en el primer trimestre, el tercer trimestre consecutivo por encima del umbral de 250 toneladas. Los mayores compradores fueron el Banco Nacional de Polonia (43t), el Banco Central de Turquía (38t), el Banco de Reserva de India (28t) y el Banco Central de Kazajistán (18t). El BCRP del Perú compró 12 toneladas adicionales, elevando sus reservas de oro a 48 toneladas (6.3% de las reservas totales).

La demanda de ETFs de oro en EE.UU. y Europa sumó 140 toneladas en el trimestre, el mayor flujo desde Q1 2022. El SPDR Gold Shares (GLD), el mayor ETF de oro del mundo, reporta activos bajo gestión de US$ 86,400 millones, el nivel más alto de su historia. La demanda de joyería en India y China se recuperó 4.8% interanual, aunque sigue por debajo de los niveles pre-pandemia por el alto precio del metal.

Goldman Sachs, Bank of America y Citigroup mantienen sus objetivos de precio en US$ 3,700, US$ 3,600 y US$ 3,500/oz respectivamente para el cierre de 2026. El argumento central es consistente: los bancos centrales continuarán diversificando reservas fuera del dólar (proceso de décadas), la demanda física de Asia se mantendrá robusta y los ETFs continuarán captando capital institucional que no puede acceder directamente a lingotes.`,
    analisis: `El oro en US$ 3,421 con Goldman apuntando a US$ 3,700 refleja un rally con fundamentos estructurales más sólidos que en cualquier otro ciclo alcista previo: la demanda de bancos centrales es la mayor en 55 años y muestra aceleración, los ETFs están en máximos históricos y el ciclo de recortes de tasas en el horizonte reducirá el costo de oportunidad de mantener el metal.

Para el sol peruano, el oro en máximos es directamente positivo: es el segundo mayor rubro de exportación después del cobre, aportando alrededor de US$ 5,900M en Q1 2026. El binomio cobre+oro en máximos históricos es el mejor escenario posible para la moneda peruana.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g009',
    titulo: 'WTI sube a US$ 89.9/barril — OPEP+ mantiene recortes de 2.2M barriles/día hasta septiembre y prima geopolítica en el Golfo Pérsico se estima en US$ 8/barril',
    descripcion: 'El crudo West Texas Intermediate (WTI) cerró mayo en US$ 89.9 por barril (+2.78% en el mes), con la OPEP+ confirmando la extensión de los recortes de 2.2 millones de barriles diarios hasta septiembre. La prima de riesgo geopolítico por las tensiones Irán-EE.UU. en el Golfo Pérsico se estima en US$ 8/barril sobre el precio de equilibrio fundamental de US$ 82.',
    contenido: `El crudo West Texas Intermediate (WTI) para entrega en julio cerró el mes de mayo en US$ 89.9 por barril, avanzando 2.78% en el mes y consolidando la zona de US$ 88-92 como el nuevo rango de equilibrio del mercado. El Brent del Mar del Norte cerró en US$ 93.4/barril (+2.6% mensual). El mercado petrolero recibió dos catalizadores alcistas durante la semana: la confirmación de OPEP+ de mantener los recortes y la persistencia de las tensiones militares Irán-EE.UU. en el Golfo Pérsico.

La OPEP+ celebró su reunión ministerial virtual y confirmó por unanimidad la extensión de los recortes voluntarios de 2.2 millones de barriles diarios —liderados por Arabia Saudita (1.0 Mbpd), Rusia (0.5 Mbpd) y los Emiratos Árabes Unidos (0.3 Mbpd)— hasta la reunión del 5 de septiembre. El secretario general de la OPEP, Haitham Al Ghais, declaró que la alianza "mantiene plena disciplina de producción" y descartó aumentos anticipados de cuota mientras persista la incertidumbre sobre la demanda china.

El componente geopolítico suma US$ 8/barril sobre el precio de equilibrio de fundamentos de oferta y demanda (estimado por Goldman Sachs en US$ 82/barril). Las tensiones entre EE.UU. e Irán, que escalaron en mayo con los ataques del CENTCOM, se mantienen en nivel elevado sin resolución clara. El Estrecho de Ormuz —por donde transita el 21% del comercio mundial de petróleo— no ha sufrido perturbaciones físicas, pero el riesgo percibido de una escalada impulsa las primas de seguros marítimos y los precios de opciones sobre crudo.

Para Perú, el MEF estima que el WTI en US$ 90 añade aproximadamente 0.35 puntos porcentuales a la inflación anual vía combustibles. El escenario base de JP Morgan y Goldman Sachs proyecta el WTI en el rango US$ 85-95 para el Q3 2026, manejable para la economía peruana aunque añade un componente inflacionario que el BCRP debe monitorear.`,
    analisis: `El WTI en US$ 89.9 con OPEP+ en modo restrictivo y prima geopolítica de US$ 8 es el escenario más complejo para Perú: alto enough para presionar la inflación importada, pero todavía por debajo del umbral de US$ 100 que generaría un shock significativo. Este equilibrio tenso puede mantenerse mientras no haya un catalizador de escalada en el Golfo.

Para empresas peruanas con costos de combustibles relevantes (transporte, manufactura, agroindustria), el nivel actual de WTI justifica revisar las coberturas de precio de combustibles para el Q3 2026. Un contrato de futuros a US$ 90-92/barril para agosto-septiembre ofrece protección razonable frente al escenario de escalada geopolítica.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g010',
    titulo: 'Argentina: inflación de mayo cae a 2.1% — la más baja desde diciembre 2022 mientras el FMI celebra la convergencia y el peso oficial se estabiliza en ARS 1,430',
    descripcion: 'La inflación mensual de Argentina en mayo fue del 2.1% según el INDEC, la más baja en 41 meses, confirmando la tendencia de desinflación del programa de Milei. El Fondo Monetario Internacional elogió el avance en su revisión trimestral y reafirmó el desembolso del siguiente tramo de US$ 4,200 millones. El peso oficial se estabiliza en ARS 1,430/USD con brecha frente al MEP reducida al 3.2%.',
    contenido: `El Instituto Nacional de Estadísticas y Censos (INDEC) publicó el Índice de Precios al Consumidor (IPC) de mayo de Argentina, mostrando una inflación mensual del 2.1%, la más baja en 41 meses —desde diciembre de 2022, cuando registró 1.8% antes de la espiral que llevó la inflación mensual al 25.5% en diciembre 2023. La inflación interanual cayó a 61.4% desde el 68.4% de abril, continuando la tendencia de desinflación del programa de estabilización del gobierno de Javier Milei.

El Fondo Monetario Internacional celebró el avance en su Tercera Revisión del programa de facilidades extendidas con Argentina. El FMI aprobó el desembolso del siguiente tramo de US$ 4,200 millones, elevando el total desembolsado a US$ 24,800 millones de los US$ 44,000 millones del programa total. La directora gerente del FMI, Kristalina Georgieva, declaró que "Argentina ha superado las expectativas en reducción de la inflación y consolidación fiscal, con un superávit primario del 1.2% del PBI en los primeros cuatro meses del año".

El tipo de cambio oficial del peso argentino se estabiliza en ARS 1,430 por dólar, con el Banco Central manteniendo el esquema de "crawling peg" con una devaluación mensual del 1%. La brecha entre el tipo de cambio oficial y el tipo de cambio MEP (Mercado Electrónico de Pagos) se redujo al 3.2%, la más baja desde el 15 de diciembre de 2023. Las reservas brutas del Banco Central alcanzan US$ 39,200 millones, con las reservas netas en US$ 6,800 millones positivas.

La economía argentina mostró recuperación lenta: el PBI creció 1.4% en Q1 2026 liderado por el agro (+12.4%) y Vaca Muerta (+18.2%). Los depósitos bancarios en dólares subieron 8.4% en mayo, señal de mayor confianza de los argentinos en el sistema financiero.`,
    analisis: `Una inflación mensual del 2.1% en Argentina es un hito —impensable hace 18 meses— pero la trayectoria hacia la normalización está lejos de completarse. Inflación interanual del 61% sigue siendo excepcionalmente alta en contexto global, y el tipo de cambio real sigue apreciado, lo que puede complicar la competitividad del sector exportador no-agro.

Para empresas peruanas con operaciones o clientes en Argentina, la estabilización en ARS 1,430 con brecha al 3.2% ofrece más certeza para planificar precios que en cualquier momento de los últimos tres años. Sin embargo, la devaluación mensual del 1% del crawling peg implica una depreciación acumulada del 12.7% anual: los contratos de servicios denominados en pesos argentinos deben incorporar este ajuste para preservar márgenes.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g011',
    titulo: 'Colombia: TRM cede a COP 3,620/USD con petróleo en US$ 90 y DXY en 98.8 — Banrep analiza retomar ciclo de recortes con inflación de servicios cediendo a 7.2%',
    descripcion: 'La Tasa Representativa del Mercado (TRM) de Colombia cayó a COP 3,620 por dólar al cierre de mayo, apreciándose 5.3% desde el máximo de COP 3,825 de mediados del mes. El Banco de la República analizará en su reunión del 20 de junio si retomar el ciclo de recortes de tasas, con la inflación de servicios cediendo a 7.2% desde el 7.8% de abril.',
    contenido: `La Tasa Representativa del Mercado (TRM) de Colombia cerró mayo en COP 3,620 por dólar americano, su nivel más apreciado desde el 14 de enero de 2026. La apreciación del peso colombiano del 5.3% desde el máximo intramensual de COP 3,825 del 14 de mayo responde a la confluencia de tres factores: el petróleo WTI en US$ 89.9/barril (Colombia exporta ~730,000 barriles/día), el DXY débil en 98.8 y la mejora de los indicadores macroeconómicos que reduce la prima de riesgo del peso.

El Banco de la República (Banrep) celebrará su próxima reunión de política monetaria el 20 de junio. El debate interno girará en torno a si retomar el ciclo de recortes que fue pausado en la reunión de abril, cuando el directorio decidió mantener la tasa de intervención en 9.25%. La clave será el dato de inflación de servicios de mayo, que cedió a 7.2% desde 7.8% en abril: si continúa la tendencia, el directorio tiene espacio para un recorte de 25 pbs que llevaría la tasa a 9.00%.

La inflación general colombiana bajó a 4.8% anual en mayo desde 5.2% en abril. La inflación de alimentos se ubica en 2.4% anual, por debajo de la meta del 3%. La inflación en arriendo y servicios de educación —los componentes más rígidos— son el principal obstáculo para completar la desinflación.

La economía colombiana creció 2.9% en el Q1 2026 según el DANE. El consumo privado (+3.4%) y la formación bruta de capital fijo (+4.1%) lideraron. El sector de hidrocarburos enfrenta presiones por las restricciones de nuevas licencias de exploración del gobierno: la producción de petróleo cayó 4.2% interanual en Q1. Ecopetrol reportó una reducción del 8.4% en su utilidad neta del trimestre.`,
    analisis: `Un TRM en COP 3,620 con potencial de recorte del Banrep en junio crea un escenario de apreciación adicional del peso colombiano en el corto plazo. Si el Banrep recorta y el WTI se mantiene por encima de US$ 85, el TRM puede probar la zona de COP 3,500-3,550 en el Q3 2026.

Para empresas peruanas con exposición a Colombia, la apreciación del COP reduce el costo en dólares de los productos colombianos que importan. Es un contexto favorable para revisar los precios de contratos de importación con contrapartes colombianas, buscando fijar tipos de cambio favorables antes de que el peso colombiano eventualmente se deprecie en ciclos futuros.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g012',
    titulo: 'Chile: peso se aprecia a CLP 924/USD al cierre de mayo — BCCh anticipa recorte de 25 pbs en junio con IPC en 3.4% y cobre en US$ 5.10/lb como ancla cambiaria',
    descripcion: 'El peso chileno cerró mayo en CLP 924 por dólar, apreciándose 3.2% en el mes hasta su nivel más fuerte desde enero de 2023. El Banco Central de Chile anticipa un recorte de su Tasa de Política Monetaria de 25 puntos básicos en la reunión del 12-13 de junio, con el IPC en 3.4% dentro de la meta. El IPSA subió 4.1% en mayo impulsado por SQM y Antofagasta Minerals.',
    contenido: `El peso chileno (CLP) cerró el mes de mayo en CLP 924 por dólar americano, apreciándose 3.2% en el mes desde CLP 954 de cierre de abril. Es el nivel más fuerte del CLP desde la segunda semana de enero de 2023 y consolida uno de los mejores meses para la moneda chilena en los últimos tres años. El principal impulsor es el cobre en US$ 5.10/lb —de cuya producción Chile es el mayor exportador mundial con 27% de la oferta global— y el debilitamiento estructural del DXY hasta 98.8.

El Banco Central de Chile (BCCh) celebrará su reunión de política monetaria los días 12 y 13 de junio. El mercado asigna un 72% de probabilidad de un recorte de 25 puntos básicos que llevaría la Tasa de Política Monetaria (TPM) de 3.75% a 3.50%. El acta de la reunión de mayo reveló que cuatro de los cinco miembros del Consejo consideraron que las condiciones de inflación son consistentes con continuar el ciclo de recortes en junio, sujeto a que el IPC de mayo no muestre sorpresas al alza.

La inflación chilena se ubica en 3.4% anual a abril, en el centro del rango meta del BCCh de 2%-4%. La inflación subyacente (sin alimentos ni energía) bajó a 3.2%, el nivel más bajo desde febrero de 2021. El crecimiento del Q1 2026 fue del 3.8%, la manufactura doméstica sube +4.1% y el consumo privado +3.2%.

El índice IPSA de la Bolsa de Santiago cerró mayo con un avance del 4.1%, liderado por SQM (+6.8%, por el litio en US$ 12,800/TM), Antofagasta Minerals (+5.4%) y Banco de Chile (+3.2%). Los ADRs de empresas chilenas en Nueva York ganaron 4.8% en promedio en el mes, con Chile consolidándose como el mercado bursátil de mejor desempeño de América del Sur en lo que va del año (+18.2% el IPSA en dólares).`,
    analisis: `El CLP en CLP 924 y el BCCh en camino de recortar en junio es un escenario que combina dos fuerzas alcistas: un cobre que genera flujos de divisas récord y un banco central que relaja la política monetaria estimulando la demanda interna. Chile está en el mejor momento macroeconómico de la última década.

Si el BCRP del Perú recorta en junio como se anticipa, Perú comenzará a cerrar la brecha en el ciclo de recortes con Chile y el dinamismo crediticio puede acelerarse en el segundo semestre. La combinación de cobre alto y tasas bajando es el escenario ideal para las dos economías andinas más exportadoras de la región.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g013',
    titulo: 'PEN/USD consolida S/ 3.60-3.65 antes de eventos clave de junio — RSI en 48 y MACD neutro señalan lateralidad mientras mercado aguarda BCRP (11 jun) y Fed (16-17 jun)',
    descripcion: 'El cruce PEN/USD abre junio cotizando en torno a S/ 3.61 por dólar, en el centro del rango técnico S/ 3.60-3.65. El RSI diario se ubica en 48 en zona neutral, el MACD muestra histograma plano y el volumen diario cayó a US$ 1,080M —señales clásicas de consolidación antes de catalizadores. Los dos eventos directivos del mes: BCRP el 11 de junio y FOMC el 16-17 de junio.',
    contenido: `El tipo de cambio PEN/USD abre junio cotizando en S/ 3.61 por dólar, en una zona de consolidación técnica que se ha mantenido durante las últimas tres sesiones. El volumen diario de transacciones en el mercado cambiario interbancario peruano cayó a US$ 1,080 millones el viernes —el más bajo desde la última semana de abril— señalando que los grandes operadores han reducido posiciones mientras esperan los catalizadores directivos del mes.

El análisis técnico del par PEN/USD muestra un cuadro clásico de lateralidad: el RSI diario en 48 se ubica en zona neutral, equidistante de la sobrecompra (70) y la sobreventa (30). El MACD (12,26,9) presenta un histograma prácticamente plano, configurando una señal neutral que no anticipa ruptura en ninguna dirección. La Banda de Bollinger se estrecha en su mínimo del mes, señal técnica adicional de que una expansión de volatilidad está por venir —pero aún sin dirección definida.

Los niveles técnicos clave son: soporte inmediato S/ 3.59 (mínimo del 30 de mayo), soporte secundario S/ 3.55 (mínimo del 14 de febrero) y soporte mayor S/ 3.48 (mínimo anual de enero). Resistencias: S/ 3.64 (máximo intradía del miércoles), S/ 3.68 (resistencia de mayo medio) y S/ 3.72 (resistencia mayor de mayo inicial). Las posiciones especulativas netas a favor del sol en el mercado de futuros son de US$ 420 millones, nivel moderado que no genera riesgo de stop-loss masivos.

Los dos eventos que decidirán la dirección del PEN/USD en junio son: (1) la reunión del BCRP el 11 de junio —si recorta 25 pbs a 4.50%, la reacción inicial puede ser de leve debilidad del sol, pero la señal de confianza en la desinflación puede generar apreciación posterior; (2) el FOMC del 16-17 de junio —con 97% de pausa descontada, lo relevante será el dot plot actualizado con señales sobre el timing de recortes en el segundo semestre.`,
    analisis: `La lateralidad actual del PEN/USD es técnicamente sana: el mercado está procesando los datos macro recientes antes de posicionarse para los eventos de junio. Los inversores institucionales con mandatos de mediano plazo no necesitan entrar ahora si los catalizadores son inminentes.

Para empresas con necesidades cambiarias de corto plazo, el nivel S/ 3.61 es neutro. Un BCRP que recorta con datos de inflación favorables y una Fed que confirma el sesgo dovish para septiembre podrían llevar el sol hacia S/ 3.55-3.58 en julio. Planificar importaciones bajo ese escenario y cubrir riesgos de exportación al alza con opciones baratas (volatilidad implícita baja) es la estrategia defensiva más razonable.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g014',
    titulo: "DXY cae a 98.8 — cinco semanas de debilidad estructural post-Moody's y 58% de probabilidad de recorte Fed en septiembre mantienen presión bajista sobre el dólar",
    descripcion: "El índice del dólar DXY cerró mayo en 98.8, acumulando una pérdida del 5.1% en el mes y marcando su peor performance mensual desde octubre de 2022. La rebaja de Moody's a la deuda soberana de EE.UU. el 16 de mayo y la creciente certeza de que la Fed recortará tasas en septiembre (58% de probabilidad) son los dos pilares de la debilidad estructural del dólar.",
    contenido: `El Índice del Dólar DXY cerró el mes de mayo en 98.8, acumulando una pérdida del 5.1% que convierte a mayo en el peor mes para el dólar desde octubre de 2022. El índice ha caído desde el nivel de 104.1 del cierre de abril de forma consistente, sin un rebote sostenido por encima del nivel psicológico de 100. Cinco semanas de velas semanales bajistas confirman que la tendencia no es un accidente sino una revaluación estructural del dólar.

Los dos factores que explican la debilidad estructural del DXY son claros. Primero, la rebaja de Moody's a la deuda soberana de EE.UU. del 16 de mayo —de Aaa a Aa1— completó el ciclo de downgrades de las tres grandes agencias (S&P desde 2011, Fitch desde 2023, Moody's desde mayo 2026). Esto acelera la diversificación de reservas de bancos centrales fuera del dólar: el World Gold Council ya reportó 281 toneladas de compras en Q1. Segundo, el mercado de futuros asigna un 58% de probabilidad de un recorte de la Fed en septiembre, lo que reduce el diferencial de tasas americano frente a otras divisas.

El mapa de cruces principales confirma la narrativa: el EUR/USD sube a 1.1420 (máximo desde mayo de 2021), el USD/JPY cede a 144.2 (yen recupera fuerza), la GBP/USD avanza a 1.2960 y el USD/CHF baja a 0.8820. En América Latina, el real brasileño ganó 3.8% en el mes (R$ 5.52/USD), el sol peruano 2.2% (S/ 3.61/USD), el peso colombiano 5.3% (COP 3,620/USD) y el peso chileno 3.2% (CLP 924/USD).

El posicionamiento en el mercado de futuros de CME muestra una posición neta corta en dólares de US$ 24,800 millones, el nivel más alto desde septiembre de 2021. Este posicionamiento especulativo añade presión bajista adicional al DXY, aunque también crea el riesgo de un short squeeze si un dato de inflación sorprende al alza.`,
    analisis: `Un DXY en 98.8 con posicionamiento bajista récord y dos catalizadores estructurales (Moody's + ciclo recortes Fed) crea un entorno excepcionalmente favorable para las monedas emergentes con fundamentos sólidos. Pero el posicionamiento también crea el riesgo de un short squeeze: si un dato de inflación sorprende al alza y el mercado descarta los recortes de la Fed, el cierre de posiciones cortas puede generar un rebote del DXY del 2-3% en cuestión de días.

Para el sol peruano, el escenario base de DXY en 97-100 para el Q3 2026 es compatible con un tipo de cambio S/ 3.55-3.65. El riesgo al alza (DXY sobre 102) se materializaría si la Fed sorprende con hawkishness por un dato de inflación de julio muy alto. Ese es el riesgo a monitorear para el Q3.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g015',
    titulo: 'Bitcoin en US$ 109,200 roza máximo histórico — ETFs cripto superan US$ 130,000M en AUM y entradas semanales de US$ 2,800M confirman impulso institucional',
    descripcion: 'Bitcoin cotiza a US$ 109,200 en el último día de mayo, a apenas US$ 600 del máximo histórico de US$ 109,800 registrado en enero. Los ETFs de criptomonedas en EE.UU. superaron los US$ 130,000 millones en activos bajo gestión por primera vez. Los flujos semanales de US$ 2,800M son los mayores desde la aprobación del primer ETF de Bitcoin en enero 2024.',
    contenido: `Bitcoin (BTC/USD) cotiza a US$ 109,200 en las últimas horas de mayo, avanzando 0.7% en 24 horas y a solo US$ 600 del máximo histórico de US$ 109,800 registrado el 20 de enero de 2026. El par ha recuperado el 49% desde el mínimo de US$ 73,200 del 7 de mayo —cuando las tensiones Irán-EE.UU. generaron un pánico de venta masiva— en un rally de 23 días consecutivos de recuperación. El volumen de transacciones en exchanges spot superó los US$ 48,000 millones en las últimas 24 horas.

Los ETFs de criptomonedas en EE.UU. superaron los US$ 130,000 millones en activos bajo gestión por primera vez en la historia, impulsados principalmente por el iShares Bitcoin Trust de BlackRock (IBIT, US$ 58,400M), el Fidelity Wise Origin Bitcoin Fund (FBTC, US$ 22,800M) y el ARK 21Shares Bitcoin ETF (ARKB, US$ 9,200M). Los flujos netos de la semana del 26-30 de mayo sumaron US$ 2,800 millones, el mayor registro semanal desde la semana de enero 2024 cuando se aprobó el primer ETF de Bitcoin al contado en EE.UU.

Ethereum (ETH/USD) sube 2.4% hasta US$ 4,310, beneficiado por el upgrade técnico "Petra" completado en mayo que reduce el gas fee promedio en 18%. Solana (SOL/USD) avanza 1.8% hasta US$ 201, acercándose al nivel clave de US$ 210 que analistas señalan como resistencia previa al rally post-ETF de agosto. XRP sube 3.2% hasta US$ 3.18 tras ganar en segunda instancia el litigio contra la SEC.

Michael Saylor (Strategy/MicroStrategy) confirmó que la compañía no tiene planes de vender su holding de 592,000 BTC valuados en US$ 64,700 millones, equivalente al 2.8% del suministro total. BlackRock incluyó formalmente el IBIT en su propuesta de asignación estratégica de portafolio de hasta un 2% del total de activos.`,
    analisis: `Bitcoin a US$ 109,200 a punto de romper el máximo histórico no es solo un hito especulativo: es la señal de que la adopción institucional ha alcanzado el punto de no retorno. Cuando BlackRock recomienda hasta 2% de asignación a Bitcoin en portafolios estratégicos y los ETFs tienen US$ 130,000M en AUM, estamos ante una clase de activo que ya compite con el oro en los portafolios institucionales.

Para el contexto cambiario, el rally del Bitcoin confirma la narrativa macro central: los inversores globales buscan alternativas al dólar como reserva de valor. Un BTC que roza US$ 110,000 con volumen institucional elevado es consistente con un DXY que continúa debilitándose hacia 96-98 en el segundo semestre, lo que favorece al sol peruano.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-01T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f001',
    titulo: 'Sol peruano cotiza en S/ 3.42 — el más fuerte del año mientras reservas del BCRP superan los US$ 100,000 millones por primera vez en la historia',
    descripcion: 'El sol peruano cotiza en S/ 3.42 por dólar, su nivel más apreciado en lo que va del año, impulsado por el superávit comercial récord y el diferencial de tasas favorable. Las reservas internacionales netas del BCRP superaron los US$ 100,000 millones por primera vez en la historia del banco central peruano.',
    contenido: `El sol peruano cotiza en S/ 3.42 por dólar al cierre de esta semana, consolidando una apreciación que lo coloca en su nivel más fuerte del año. El Banco Central de Reserva del Perú (BCRP) reportó que las reservas internacionales netas cerraron abril en US$ 83,489 millones y en lo que va de mayo han seguido creciendo, habiendo superado el hito histórico de US$ 100,000 millones en abril —el primero en la historia del banco central peruano— equivalente al 29% del PBI.

El fortalecimiento del sol responde a la confluencia de tres factores fundamentales: el diferencial de tasas favorable (BCRP 4.75% vs Fed 3.50%-3.75%), el superávit de la balanza comercial sostenido por el boom de exportaciones mineras (+49% en Q1 2026), y las entradas de capital por inversión extranjera directa en el sector minero. Las exportaciones totales del Q1 2026 alcanzaron US$ 27,217 millones (+33.5%), generando un flujo constante de dólares que los exportadores convierten a soles para pagar costos locales.

El contexto global también favorece al sol: el DXY acumula una pérdida del 4.8% en mayo —el peor mes para el dólar desde noviembre de 2022— presionado por la rebaja de Moody's a la deuda soberana de EE.UU. de Aaa a Aa1 el 16 de mayo, y por la perspectiva de recortes de tasas de la Fed. Esta debilidad estructural del dólar beneficia a todas las monedas emergentes con fundamentos sólidos, y el sol peruano es uno de los mejor posicionados de la región.

Los analistas de Credicorp Capital y BBVA Research señalan que el rango S/ 3.38-3.50 es el corredor operativo más probable para el Q3 2026, con el sesgo hacia la apreciación mientras el BCRP continúe acumulando reservas y el déficit de cuenta corriente se mantenga contenido en torno al 1.2% del PBI proyectado para 2026.`,
    analisis: `Un sol en S/ 3.42 con reservas de US$ 100,000 millones es la expresión más clara de la solidez macroeconómica del Perú en su historia moderna. Las reservas equivalen al 29% del PBI y cubren con amplio margen cualquier shock externo de corto plazo.

Para empresas importadoras, el sol fuerte es una oportunidad para cubrir costos de insumos a tipos favorables. Para exportadores no mineros, es un llamado de atención sobre competitividad: con el sol tan apreciado, cada dólar que ingresa vale menos en soles. La clave para el segundo semestre será si el sol continúa apreciándose hacia S/ 3.30-3.35 o se estabiliza en el rango actual.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13824652/pexels-photo-13824652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f002',
    titulo: 'Actas del FOMC revelan debate interno — Warsh enfrenta divisiones en la Fed ante PCE core en 2.6% y probabilidad de recorte en septiembre del 52%',
    descripcion: 'Las actas de la reunión del FOMC del 6-7 de mayo mostraron un debate interno significativo: siete miembros abogaron por mantener tasas hasta que el PCE core caiga por debajo de 2.3%, mientras cuatro señalaron apertura a un recorte en junio si el mercado laboral se deteriora. El DXY cayó 0.2% hasta 99.1.',
    contenido: `Las actas de la reunión del Comité Federal de Mercado Abierto (FOMC) del 6-7 de mayo, publicadas el miércoles por la tarde, revelan un debate interno más profundo que lo sugerido por la declaración oficial post-reunión. El presidente Kevin Warsh, quien asumió en mayo, hereda un comité dividido: siete miembros insisten en mantener la tasa de fondos federales en el rango 3.50%-3.75% mientras el PCE core (2.6% en abril) no caiga hacia o por debajo de 2.3%. En el lado opuesto, cuatro miembros expresaron apertura a una reducción de 25 pbs en junio si los datos del mercado laboral de mayo muestran deterioro significativo.

El impacto de los aranceles en la cadena de suministro es el principal punto de incertidumbre señalado en las actas. Varios miembros citaron evidencia del Beige Book de mayo: fabricantes de California y Texas reportan aumentos de costos del 8-12% en insumos importados, con traslado parcial al consumidor en un 40-60% de los casos. El arancelismo complica la desinflación en el componente de bienes del PCE.

El mercado de futuros de Fed Funds asigna actualmente un 24% de probabilidad de recorte en junio, un 52% para septiembre, y un 74% de al menos un recorte antes de diciembre. La curva del Tesoro a 2-10 años se mantiene en -8 pbs (levemente invertida), señalando que el mercado sigue esperando recortes dentro del año.

El DXY cayó 0.2% hasta 99.1 en la sesión, acumulando una pérdida del 4.8% en mayo —el peor mes para el dólar desde noviembre de 2022—, presionado adicionalmente por la rebaja de Moody's a la deuda soberana de EE.UU. de Aaa a Aa1, anunciada el 16 de mayo.`,
    analisis: `El debate interno del FOMC reduce la visibilidad sobre la política monetaria americana para el segundo semestre. Una Fed dividida reacciona a datos en lugar de seguir un rumbo claro, generando mayor volatilidad en el DXY y en los activos emergentes.

Para el sol peruano, el escenario base —Fed mantiene o recorta una vez antes de fin de año— sigue siendo compatible con un dólar en S/ 3.60-3.70. El riesgo cola es una Fed que sorprende con subidas por inflación energética, lo que elevaría el DXY y presionaría el sol hacia S/ 3.75-3.85.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6451438/pexels-photo-6451438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f003',
    titulo: 'Chile: peso se aprecia a $930/USD con cobre en US$ 5.12/lb — Banco Central mantiene tasa en 3.75% y señala dos recortes adicionales antes de diciembre',
    descripcion: 'El peso chileno se apreció a $930 por dólar al cierre del jueves, su nivel más fuerte en tres semanas, impulsado por el cobre en US$ 5.12/lb y el superávit comercial de abril de US$ 3,420 millones, récord histórico para ese mes. El Banco Central de Chile señaló en actas la posibilidad de dos recortes de 25 pbs antes de diciembre.',
    contenido: `El peso chileno cerró la jornada del jueves 29 de mayo en $930 por dólar americano, apreciándose 0.8% desde los $937 del cierre del miércoles. Es el nivel más fuerte de la moneda chilena en tres semanas y consolida la tendencia apreciadora de mayo, durante el cual el peso ha ganado 1.4% frente al dólar. El principal catalizador fue el precio del cobre, que cerró en US$ 5.12/lb en el LME.

El Banco Central de Chile publicó el acta de su reunión de política monetaria del 14-15 de mayo, en la que mantuvo la Tasa de Política Monetaria (TPM) en 3.75%. El acta revela que el directorio discutió la opción de recortar 25 pbs en esa reunión, pero decidió esperar más datos de inflación de servicios —que se mantiene persistente en 4.1% anual— antes de continuar el ciclo de recortes. La próxima reunión del Consejo es el 12-13 de junio, con el mercado asignando un 60% de probabilidad de recorte de 25 pbs.

El superávit comercial de abril fue el fundamento detrás de la apreciación del peso. Las exportaciones de abril totalizaron US$ 9,840 millones (+38% anual), impulsadas por el cobre (US$ 5,210M), la celulosa (US$ 780M) y el litio (US$ 640M). Las importaciones totalizaron US$ 6,420 millones (+12% anual), generando un superávit de US$ 3,420 millones, el mayor en la historia de Chile para un mes de abril.

El IPSA (índice bursátil chileno) subió 0.9% en la sesión, liderado por SQM (+3.2%) y Antofagasta Minerals (+2.4%). Los ADRs de empresas chilenas en Nueva York cerraron con ganancias promedio de 1.6%.`,
    analisis: `Chile y Perú comparten el mismo viento de cola: cobre fuerte significa moneda fuerte y mayor espacio para que los bancos centrales relajen la política monetaria sin arriesgar la estabilidad cambiaria. La apreciación del peso chileno a $930 es una buena referencia para entender por qué el sol peruano también tiende a fortalecerse en este contexto.

La diferencia es que Chile tiene una exposición mayor al cobre (52% de exportaciones vs 38% Perú), por lo que el impulso proporcionalmente es incluso mayor en Chile. Ambas economías se benefician del mismo viento de cola que posiciona a los países mineros andinos como los de mejor desempeño macroeconómico en la región durante 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg Línea',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f004',
    titulo: 'Perú presenta cartera minera de US$ 63,000M en foro PDAC de Toronto — exportaciones mineras crecen 59% en lo que va de 2026',
    descripcion: 'El canciller del Perú presentó en el PDAC de Toronto la cartera de 65 proyectos mineros por US$ 63,000 millones, destacando la estrategia de minería sostenible como eje para atraer inversión responsable. Los fondos ESG europeos incrementaron en 40% su interés en Perú como destino de inversión tras la aprobación de la Ley de Minería Sostenible de 2025.',
    contenido: `El canciller del Perú participó esta semana en el Prospectors & Developers Association of Canada (PDAC) de Toronto, el principal foro de inversión minera del mundo, donde presentó la cartera de 65 proyectos mineros del país valorados en US$ 63,000 millones. La presentación destacó el potencial de Perú como proveedor de minerales críticos para la transición energética global: litio en Puno y Moquegua, cobre en Áncash y Apurímac, y tierras raras en Pasco.

La cartera incluye 12 proyectos en etapa de factibilidad con inversión total de US$ 18,400 millones, listos para decisión de inversión en los próximos 18-24 meses. Los proyectos más avanzados incluyen: Tía María (Southern Copper, US$ 1,400M), Michiquillay (Anglo American, US$ 2,800M), Quellaveco Expansión (Anglo American, US$ 1,900M) y Zafranal (AQM Copper-Teck Resources, US$ 1,200M).

El canciller subrayó que la Ley de Minería Sostenible aprobada en 2025 incorpora estándares ambientales y sociales alineados con los ODS de la ONU, y que el 30% de los ingresos por canon y regalías se destina a fondos locales de desarrollo. Esta narrativa de minería con licencia social ha mejorado la percepción de Perú entre los fondos ESG europeos, con un incremento del 40% en el número de inversionistas responsables que consideran a Perú como destino viable.

Las exportaciones mineras del Perú acumulan un crecimiento del 59% en los cuatro primeros meses de 2026, con US$ 13,800 millones en exportaciones solo de cobre y oro. El sector genera 215,000 empleos directos y más de 800,000 empleos indirectos, aportando el 11% del PBI y el 67% de las divisas exportadas.`,
    analisis: `Una cartera de US$ 63,000 millones en proyectos mineros es un flujo de inversión potencial equivalente al 24% del PBI peruano actual. Si aunque sea el 30% de esa cartera se materializa en los próximos cinco años, el impacto en el PBI, el empleo y la balanza de pagos sería transformador.

La narrativa de minería sostenible no es solo relaciones públicas: los fondos con mandato ESG representan más del 40% de los activos bajo gestión en Europa y EE.UU. Cada proyecto aprobado con estándares ESG atrae más capital del mismo tipo, creando un ciclo virtuoso que fortalece la posición del Perú como destino preferente de inversión minera responsable.`,
    categoria: 'Nacional',
    fuente: 'Infobae',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/33321432/pexels-photo-33321432.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f005',
    titulo: 'Argentina: BCRA sube tasa a 45% para contener presión del dólar blue — inflación mensual de mayo estimada en 3.8%, la más baja en 18 meses',
    descripcion: 'El Banco Central de la República Argentina elevó su tasa de política monetaria a 45% anual en decisión de emergencia para contener el dólar blue que tocó $1,720/USD. La inflación mensual de mayo se estima en 3.8%, la más baja desde noviembre de 2024, consolidando la tendencia de desinflación del programa de Milei.',
    contenido: `El Banco Central de la República Argentina (BCRA) elevó su tasa de política monetaria en 500 pbs hasta el 45% anual en una decisión de emergencia adoptada el miércoles, en respuesta a la presión que experimentó el dólar blue durante las últimas tres jornadas. El dólar informal cotizó a $1,720 en Buenos Aires —un 8.4% por encima del tipo de cambio oficial de $1,587— antes de ceder a $1,695 al cierre del jueves tras el anuncio.

El BCRA justificó la medida en la necesidad de preservar la estabilidad del proceso de desinflación y cerrar la brecha cambiaria dentro del sendero acordado con el FMI. El acuerdo de facilidades extendidas con el Fondo Monetario Internacional, aprobado en marzo, incluye una meta de brecha cambiaria máxima del 8% con el tipo de cambio oficial, que fue superada temporalmente durante la presión de esta semana.

La inflación mensual de mayo se estima en 3.8% según el INDEC, por debajo del 4.1% de abril y el 4.6% de marzo, consolidando la tendencia de desaceleración. Es la inflación mensual más baja desde noviembre de 2024. La inflación interanual acumulada al cierre de abril fue del 68.4%, significativamente menor al 211% de diciembre 2023. La inflación en alimentos y bebidas fue del 3.2% en mayo.

El ministro de Economía, Luis Caputo, declaró que la suba de tasas es temporal y de calibración fina, con el objetivo de llegar a diciembre de 2026 con una inflación mensual en el rango del 2.0%-2.5%. Las reservas brutas del BCRA totalizaron US$ 38,600 millones, con reservas netas positivas de US$ 6,200 millones por primera vez en más de tres años.`,
    analisis: `Argentina sigue siendo el caso de estabilización más complejo y frágil de la región. La convergencia desinflacionaria es real —de 211% anual a 68% en 18 meses es un logro significativo— pero la brecha cambiaria entre el oficial y el blue es el talón de Aquiles del esquema.

Para empresas peruanas con operaciones o clientes en Argentina, el riesgo cambiario sigue siendo elevado. El dólar blue a $1,720 implica una depreciación esperada del 8-12% anual si la convergencia hacia el tipo oficial no se completa. Recomendamos mantener exposición mínima en pesos argentinos y cobrar en dólares toda operación posible.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f006',
    titulo: 'Bitcoin supera US$ 108,400 — correlación con oro alcanza 0.78 y ETFs cripto en EE.UU. registran semana récord con US$ 3,200M en entradas',
    descripcion: 'Bitcoin alcanzó US$ 108,400 impulsado por los flujos de salida del dólar y la creciente adopción institucional. La correlación de 30 días entre BTC y el oro supera 0.78, el nivel más alto en 18 meses. Los ETFs de criptomonedas en EE.UU. registraron su semana de mayores entradas de la historia con US$ 3,200 millones en flujos netos.',
    contenido: `Bitcoin cotizó a US$ 108,400 al cierre del jueves 29 de mayo, con un avance del 2.1% en 24 horas y un 8.4% en la semana. La criptomoneda se acerca nuevamente a su máximo histórico de US$ 109,800 registrado en enero de 2026, en un contexto de debilitamiento estructural del DXY (que cede 0.2% a 99.1) y de escalada de la incertidumbre geopolítica.

La correlación de 30 días entre Bitcoin y el oro supera 0.78, el nivel más alto en 18 meses, señalando que los grandes inversores institucionales están tratando a ambos activos como cobertura frente a la devaluación del dólar y la inestabilidad geopolítica. BlackRock iShares Bitcoin Trust (IBIT) registró entradas netas de US$ 612 millones en la semana, el mayor flujo semanal desde febrero. Los ETFs de Bitcoin en EE.UU. acumulan US$ 118,400 millones en activos bajo gestión.

La semana del 26-30 de mayo se consolidó como la de mayores entradas en la historia de los ETFs cripto en EE.UU., con US$ 3,200 millones en flujos netos. Ethereum avanzó 3.8% hasta US$ 4,240. La SEC aprobó el primer ETF de Solana para cotizar en agosto, elevando Solana un 7.8% hasta US$ 198.40. Los activos totales bajo gestión de todos los ETFs cripto en EE.UU. superaron los US$ 128,000 millones, récord histórico.

Michael Saylor (MicroStrategy/Strategy) anunció la adquisición de 2,140 BTC adicionales por US$ 231 millones, elevando el holding de la compañía a 592,000 BTC. El rendimiento acumulado de la estrategia desde 2020 supera el 1,800%, frente al 280% del S&P 500 en el mismo período.`,
    analisis: `Bitcoin en US$ 108,400 con correlación alta con el oro y flujos institucionales récord confirma la tesis alcista de los bulls: adopción masiva institucional + cobertura macroeconómica + escasez algorítmica = nuevo paradigma de almacén de valor.

Desde la perspectiva de divisas, el rally del Bitcoin confirma la narrativa de la debilidad del dólar como divisa de reserva global. Si el DXY continúa cediendo hacia 95-97 en el segundo semestre, el Bitcoin y el oro tienen espacio para nuevos máximos. Para el sol peruano, un DXY débil es viento de cola adicional al superávit comercial y diferencial de tasas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f007',
    titulo: 'Agroexportaciones peruanas suman US$ 3,067M en Q1 2026 — uva, palta y arándanos lideran; café bate récord con +51% por precios del arábica',
    descripcion: 'Las exportaciones agropecuarias del Perú alcanzaron US$ 3,067 millones en el primer trimestre de 2026 (+7.2%). La uva de mesa (US$ 612M), la palta Hass (US$ 498M) y los arándanos (US$ 367M) fueron los tres principales productos. El café sumó US$ 280 millones con crecimiento del 51%, el mayor en 8 años.',
    contenido: `Las agroexportaciones peruanas cerraron el primer trimestre de 2026 con US$ 3,067 millones en valor FOB, un incremento del 7.2% frente al Q1 2025, según el reporte de MINCETUR. El sector mostró un avance equilibrado entre precios (+4.1%) y volúmenes (+3.0%).

La uva de mesa mantuvo su posición como el principal producto agro con US$ 612 millones (+3.8%), sostenida por la demanda de EE.UU. (36%), la UE (28%) y Asia (24%). La palta Hass sumó US$ 498 millones (+9.1%), con un salto notable en los envíos a China —que creció 156% hasta representar el 18% de las exportaciones de palta peruana. Los arándanos aportaron US$ 367 millones (+12.4%), con mayor demanda del mercado premium de Reino Unido y Países Bajos.

El café fue la sorpresa positiva del trimestre con US$ 280 millones y un crecimiento del 51%, el mayor en 8 años. Los precios del café arábica en el ICE superaron los US$ 4,180 por quintal (frente a US$ 2,400 en Q1 2025), beneficiando a los productores de Amazonas, San Martín, Cajamarca y Junín. Las cooperativas cafetaleras afiliadas a la Junta Nacional del Café reportaron ventas directas a tostadores europeos de specialty coffee por US$ 68 millones.

El espárrago sumó US$ 215 millones (+4.6%). Perú mantiene su posición como mayor exportador mundial del tubérculo fresco y congelado, con destinos en 32 países. China lideró los destinos generales con US$ 10,748 millones (+43%) para todo el sector exportador, seguido de EE.UU. con US$ 2,878 millones (+24.1%) e India con US$ 2,928 millones (+300%).`,
    analisis: `El sector agroexportador peruano es la diversificación natural del poder exportador del país: mientras la minería depende de los ciclos de precios de metales, el agro ofrece un flujo de divisas más estable y con mayor valor agregado por tonelada. La combinación de microclimas únicos en la costa peruana, agua del subsuelo y acceso a TLCs con EE.UU., UE, China y Asia-Pacífico es difícil de replicar en la región.

El crecimiento del café (+51%) merece atención especial. Si Perú logra posicionarse como origen de specialty coffee de la misma manera que Etiopía o Colombia, el valor por kilo exportado puede multiplicarse 3-5x en la próxima década.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10112717/pexels-photo-10112717.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f008',
    titulo: 'Colombia: TRM cede a $3,634/USD — Banrep mantiene tasa en 9.25% y proyecta dos recortes adicionales de 25 pbs antes de diciembre',
    descripcion: 'La TRM de Colombia cedió a $3,634 por dólar al cierre del jueves, su nivel más bajo en cuatro semanas, favorecida por el petróleo en US$ 82.4/barril. El Banco de la República mantiene su tasa en 9.25% tras recortes acumulados de 775 pbs desde el máximo de 13.25%, y señala dos reducciones adicionales en el segundo semestre.',
    contenido: `La Tasa Representativa del Mercado (TRM) de Colombia cerró el jueves 29 de mayo en $3,634 por dólar americano, apreciándose 1.2% desde el reciente máximo de $3,814 registrado el 19 de mayo. La apreciación del peso colombiano responde al alza del petróleo WTI hasta US$ 82.4/barril (Colombia exporta alrededor de 730,000 barriles/día), el rally de los metales base y la expectativa de recortes de tasas del Banco de la República.

El Banco de la República (Banrep) mantiene su tasa de intervención en 9.25% desde la reunión de abril, tras un ciclo de recortes acumulados de 775 pbs desde el máximo de 13.25% de diciembre de 2023. El sendero de recortes continúa, con dos reducciones adicionales de 25 pbs proyectadas para el tercer y cuarto trimestre de 2026, llevando la tasa a 8.75% al cierre del año.

La inflación anual de Colombia se ubica en 5.2% a abril, en descenso desde el pico de 13.3% de marzo 2023. La desinflación de servicios —que cayó de 7.8% a 6.1% en los últimos seis meses— es la clave para acelerar el ritmo de recortes. La inflación de alimentos (2.8% anual) ya está por debajo de la meta del 3%.

El déficit de cuenta corriente colombiano se redujo al 2.8% del PBI en Q1 2026 desde el 3.8% del Q1 2025, gracias al superávit comercial energético. Las exportaciones de petróleo, carbón y ferroníquel sumaron US$ 12,400 millones en el trimestre.`,
    analisis: `La TRM en $3,634 es un nivel de equilibrio razonable: el superávit energético cubre el déficit de cuenta corriente y el Banrep tiene espacio para recortar tasas gradualmente. No hay señales de un peso colombiano estructuralmente débil en el horizonte de 6-12 meses.

Para empresas peruanas con exposición a Colombia, el peso colombiano en el rango $3,600-$3,900 es el corredor operativo más probable para el segundo semestre. El riesgo clave es el petróleo: un WTI por debajo de US$ 70 presionaría el peso hacia $4,000-$4,200.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg Línea',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19675635/pexels-photo-19675635.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f009',
    titulo: 'Brasil: real se aprecia a R$ 5.68/USD tras paquete fiscal de Haddad — déficit primario proyectado se reduce del 1.3% al 0.9% del PBI',
    descripcion: 'El real brasileño se apreció a R$ 5.68 por dólar luego de que el gobierno de Lula anunció un paquete de ajuste fiscal de R$ 38,000 millones que reduce el déficit primario del 1.3% al 0.9% del PBI. El índice Bovespa subió 1.8% a 137,400 puntos y la tasa del DI a 10 años cayó 45 pbs hasta 12.80%.',
    contenido: `El real brasileño (BRL) se apreció el jueves 29 de mayo, cerrando en R$ 5.68 por dólar —su nivel más fuerte desde el 14 de abril— tras el anuncio del gobierno de un paquete de ajuste fiscal de R$ 38,000 millones ($6,700M USD). El paquete incluye R$ 18,200M en recortes de gasto corriente, R$ 12,400M en medidas de eficiencia tributaria y R$ 7,400M en reprogramación de inversiones públicas.

El ministro de Hacienda, Fernando Haddad, declaró que las medidas llevan el déficit primario del gobierno central del 1.3% proyectado al 0.9% del PBI para 2026, el nivel más bajo en cuatro años. El mercado de futuros de tasas reaccionó positivamente: el DI a 10 años cayó 45 pbs hasta 12.80%. El índice Bovespa subió 1.8% en la sesión, alcanzando 137,400 puntos.

El Banco Central do Brasil (BCB) mantiene la Selic en 13.75%, con el ciclo de recortes previsto para no antes del Q3 2026 si la inflación (IPCA en 5.8% anual a abril) no converge hacia el 4.5%. El superávit comercial del año acumula US$ 28,400 millones, liderado por exportaciones de commodities. El dólar en R$ 5.68 representa una apreciación del 5.2% del real frente al máximo de R$ 5.98 de enero.

Los ADRs de empresas brasileñas en Nueva York cerraron con ganancias promedio del 2.3%. Petrobras subió 3.1% ante el alza del WTI. Vale cedió 0.4% por el PMI manufacturero chino débil (49.5), aunque se recuperó desde los mínimos de la sesión.`,
    analisis: `El ajuste de Haddad era necesario para frenar el deterioro de la percepción del mercado sobre la sostenibilidad de la deuda pública brasileña (actualmente en 87% del PBI). Un real más fuerte y tasas de largo plazo más bajas en Brasil crean condiciones para que el capital institucional regrese a activos latinoamericanos.

El contexto regional de ajuste fiscal y desinflación en las principales economías es favorable para el flujo de capitales hacia Perú. Los bonos soberanos peruanos (BBB/Baa1) se benefician de la mejora de la percepción regional cuando el gigante brasileño estabiliza sus finanzas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31310369/pexels-photo-31310369.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f010',
    titulo: 'Oro sube a US$ 3,391/oz — bancos centrales compran 281 toneladas en Q1 2026 y Goldman mantiene target de US$ 3,700 para diciembre',
    descripcion: 'El oro spot alcanzó US$ 3,391 por onza troy, impulsado por las tensiones en el Golfo Pérsico y la debilidad del DXY. Los bancos centrales compraron 281 toneladas en Q1 2026 según el World Gold Council, con el BCRP del Perú entre los top 10 acumuladores. Goldman Sachs mantiene su objetivo en US$ 3,700 para diciembre.',
    contenido: `El oro spot (XAU/USD) subió 0.7% hasta US$ 3,391 por onza troy en la jornada del jueves, acercándose al máximo histórico de US$ 3,500 de abril. El impulso vino de la debilidad del DXY (que cede 0.2% hasta 99.1) y la demanda de refugio ante las tensiones Irán-EE.UU. en el Golfo Pérsico.

El World Gold Council (WGC) publicó su reporte trimestral de demanda, mostrando que los bancos centrales compraron 281 toneladas en el Q1 2026, el tercer trimestre consecutivo por encima de las 250 toneladas. Los principales compradores fueron el Banco Nacional de Polonia (43t), el Banco Central de Turquía (38t), el Banco de India (28t), el BCRP del Perú (12t) y el Banco Central de Kazajistán (18t). El Perú figura entre los top 10 acumuladores de oro en el mundo.

Goldman Sachs reitera su objetivo de US$ 3,700/oz para diciembre de 2026, fundamentado en: demanda de bancos centrales sostenida de 900-1,000 toneladas para el año, flujos de ETFs de oro de 450-500 toneladas, y joyería asiática en recuperación. El banco advierte que un cese al fuego en Oriente Medio podría provocar una corrección temporal a US$ 3,100-3,200 antes de reanudar el alza.

La plata spot (XAG/USD) subió 1.4% hasta US$ 33.80/oz, con el ratio oro/plata cediendo a 100.3. Los analistas de Citigroup apuntan a US$ 38-40/oz para la plata en Q4 2026 si la demanda industrial de paneles solares se mantiene en niveles récord.`,
    analisis: `Oro en US$ 3,391 con Goldman apuntando a US$ 3,700 refleja un consenso claro: el ciclo alcista tiene fundamento estructural en la demanda de bancos centrales que diversifican reservas fuera del dólar. Este es un proceso de décadas, no un movimiento especulativo.

Para el sol peruano, el rally del oro es directamente positivo: el metal es el segundo mayor rubro de exportación del Perú, con US$ 5,890M en el Q1 2026. Un precio sostenido en US$ 3,200-3,500 garantiza un superávit de divisas que mantiene al sol apreciado o estable durante el resto del año.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14902679/pexels-photo-14902679.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f011',
    titulo: 'WTI sube a US$ 82.4/barril — ejercicios navales de Irán a 40 km del Estrecho de Ormuz elevan la prima de riesgo geopolítico al mayor nivel en tres meses',
    descripcion: 'El crudo WTI subió 1.8% hasta US$ 82.4/barril luego de que Irán anunció ejercicios navales a 40 km del Estrecho de Ormuz en respuesta a los ataques aéreos de EE.UU. de la semana pasada. La volatilidad implícita del petróleo a 30 días subió de 28% a 36%, el mayor nivel en tres meses.',
    contenido: `El crudo West Texas Intermediate (WTI) cerró el jueves 29 de mayo en US$ 82.4 por barril, subiendo 1.8% en la jornada y alcanzando su nivel más alto desde el 14 de mayo. El Brent del Mar del Norte cerró en US$ 85.9/barril (+1.6%). El catalizador fue el anuncio de la Marina iraní sobre ejercicios navales a 40 kilómetros del Estrecho de Ormuz —por donde transita el 20% del comercio mundial de petróleo— en respuesta a los ataques aéreos del Comando Central de EE.UU. a instalaciones militares en el sur de Irán realizados la semana pasada.

El mercado de opciones sobre el petróleo refleja un incremento de la prima de riesgo geopolítico: la volatilidad implícita a 30 días subió de 28% a 36%, y las opciones call sobre WTI a US$ 100/barril para agosto cotizaron con una prima de US$ 2.40, el nivel más alto en tres meses. La prima de riesgo geopolítico implícita en el precio del petróleo se estima en US$ 6-8/barril respecto al precio de equilibrio fundamental de US$ 74-78/barril.

La OPEP+ mantiene su estrategia de producción actual, con las restricciones voluntarias de 2.2 millones de barriles diarios vigentes hasta septiembre. Arabia Saudita y Emiratos Árabes Unidos mostraron disposición a aumentar producción si el precio supera US$ 90/barril de forma sostenida, lo que limita el alza estructural. El recuento de plataformas activas (rigs) en EE.UU. cayó a 592 desde 624 en enero, señalando menor oferta futura.

Para Perú, el MEF estima que cada US$ 10/barril de aumento sostenido en el WTI añade 0.4 puntos porcentuales a la inflación peruana. Con el WTI en US$ 82.4, el impacto inflacionario es manejable, pero un escenario de bloqueo del Estrecho enviaría el crudo a US$ 120-130 con consecuencias significativas.`,
    analisis: `El petróleo en US$ 82.4 con prima geopolítica de US$ 6-8 y OPEP+ sin cambios es un escenario de equilibrio tenso: suficientemente alto para generar presiones inflacionarias en importadores netos como Perú, pero sin alcanzar los US$ 100 que generarían un shock global.

Para la política monetaria del BCRP, un WTI sostenido entre US$ 80-90 es manejable. El riesgo inflacionario real aparece con WTI por encima de US$ 100 de forma sostenida por más de 60 días, lo que hoy no está en el escenario base pero sí en el mapa de riesgos.`,
    categoria: 'Internacional',
    fuente: 'Reuters',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f012',
    titulo: 'China: PMI oficial cae a 49.5 en mayo mientras PMI Caixin sube a 51.7 — divergencia más amplia en tres años revela presión en exportadores',
    descripcion: 'El PMI manufacturero oficial de China (NBS) cayó a 49.5 en mayo, señalando contracción en el sector exportador por segundo mes consecutivo. El PMI Caixin —que mide empresas del mercado interno— subió a 51.7, la mayor divergencia en tres años. El cobre cayó 1.2% en el LME ante el dato oficial débil.',
    contenido: `La Oficina Nacional de Estadísticas de China (NBS) publicó el PMI manufacturero oficial de mayo en 49.5, cayendo desde 50.4 en abril, por debajo del nivel de 50 que separa expansión de contracción. Es el segundo mes consecutivo por debajo de 50 para el indicador oficial, que mide principalmente empresas grandes y exportadoras. El componente de nuevas órdenes de exportación cayó a 46.8, su nivel más bajo en ocho meses, reflejando el impacto de los aranceles del 10% universal de EE.UU. y las restricciones al acceso del mercado europeo para electrónica y baterías chinas.

En contraste, el PMI manufacturero de Caixin-S&P Global —que captura principalmente pequeñas y medianas empresas del mercado doméstico— subió a 51.7 desde 51.2 en abril, el nivel más alto desde agosto de 2024. Esta divergencia de 2.2 puntos entre el PMI oficial (49.5) y el de Caixin (51.7) es la más amplia en tres años.

El componente de empleo del PMI oficial cayó a 48.1, señalando destrucción neta de puestos de trabajo en el sector exportador, lo que aumenta la presión para acelerar los estímulos al consumo interno. El politburó revisará en junio las metas de crecimiento: el consenso de analistas apunta a que el PBI chino crecerá 4.3% en 2026, por debajo de la meta oficial del 5.0%.

Para los mercados de materias primas, el PMI oficial débil presionó al cobre (-1.2%) y al hierro (-2.1%) en la sesión. Sin embargo, el PMI de Caixin fuerte señala que el consumo interno de metales para construcción e infraestructura se mantiene sólido, limitando la caída.`,
    analisis: `La divergencia entre el PMI oficial (49.5) y el Caixin (51.7) es la clave para interpretar el impacto en los mercados de commodities. La manufactura exportadora china usa grandes volúmenes de cobre industrial y está bajo presión, lo que limita el alza del cobre en el corto plazo. Pero el mercado interno chino —que usa metales en construcción e infraestructura— se mantiene sólido, evitando una caída estructural.

El catalizador para el próximo leg up del cobre será cuando los estímulos fiscales de CNY 3 billones se materialicen en cables de alta tensión, estaciones de carga eléctrica y proyectos de agua. Ese momento, según la mayoría de analistas, llegará en el Q3-Q4 2026.`,
    categoria: 'Internacional',
    fuente: 'Reuters',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31047132/pexels-photo-31047132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f013',
    titulo: "DXY cae a 99.1 y mercados emergentes reciben US$ 18,200M en mayo — el mayor flujo mensual en 14 meses tras rebaja de Moody's a deuda de EE.UU.",
    descripcion: "El DXY acumula una pérdida del 4.8% en mayo, el peor mes para el dólar desde noviembre de 2022, presionado por la rebaja de Moody's a la deuda soberana de EE.UU. de Aaa a Aa1. Los mercados emergentes recibieron US$ 18,200M en entradas netas en el mes, con América Latina captando US$ 5,200M.",
    contenido: `El Índice del Dólar DXY cayó 0.2% hasta 99.1 al cierre del jueves, acumulando una pérdida mensual del 4.8% que convierte a mayo en el peor mes para el dólar desde noviembre de 2022. La presión viene de tres frentes: perspectiva de recortes de la Fed, preocupaciones sobre la sostenibilidad de la deuda de EE.UU. tras la rebaja de Moody's del 16 de mayo (de Aaa a Aa1), y la diversificación de reservas de bancos centrales fuera del dólar.

El Instituto de Finanzas Internacionales (IIF) reportó entradas netas de US$ 18,200 millones a mercados emergentes en mayo, el mayor flujo mensual desde marzo de 2025. La distribución fue: Asia emergente US$ 9,400M (52%), América Latina US$ 5,200M (29%) y EMEA US$ 3,600M (19%). Brasil (US$ 2,100M), México (US$ 1,640M) y Colombia (US$ 880M) lideraron en la región; analistas de Credicorp estiman que Perú recibió entre US$ 280M-350M en flujos de portafolio.

La rebaja de Moody's —por primera vez en la historia, las tres grandes agencias (S&P desde 2011, Fitch desde 2023, Moody's desde mayo 2026) tienen la deuda soberana de EE.UU. por debajo del máximo— aceleró la diversificación de reservas hacia Europa y economías emergentes selectas. Los inversores institucionales con mandatos Aaa han rebalanceado sus portafolios incrementando exposición a Alemania, Países Bajos y soberanos emergentes con fundamentos sólidos como Perú.

El EUR/USD alcanzó 1.1380 (máximo desde junio 2021), el yen se apreció a 146.2/USD, el peso mexicano subió 1.2% a $16.84/USD, el real brasileño ganó 0.9% a R$ 5.68/USD, y el sol peruano avanzó 0.3% hasta S/ 3.63/USD.`,
    analisis: `La rebaja de Moody's es un evento histórico: por primera vez, las tres grandes agencias califican la deuda de EE.UU. por debajo del máximo. No significa un colapso del dólar —sigue siendo la divisa de reserva con el 58% de las reservas globales— pero sí que la velocidad de diversificación fuera del dólar se acelerará.

Para activos latinoamericanos de alta calidad como los bonos soberanos peruanos (BBB/Baa1), este entorno de DXY débil y búsqueda de diversificación es extraordinariamente favorable. Los spreads de los bonos soberanos peruanos a 10 años cedieron 12 pbs en mayo, el mejor mes desde febrero de 2024.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831511/pexels-photo-5831511.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f014',
    titulo: 'SEC aprueba primer ETF de Solana para cotizar en agosto — activos de ETFs cripto en EE.UU. superan US$ 128,000M con entradas semanales récord',
    descripcion: 'La SEC de EE.UU. aprobó el primer ETF de Solana (SOL) para cotizar en agosto, elevando el precio de SOL un 7.8% hasta US$ 198.40. Los activos totales de ETFs cripto en EE.UU. superaron los US$ 128,000 millones por primera vez. Bitcoin cotiza a US$ 108,400, acercándose al récord histórico de US$ 109,800.',
    contenido: `La Comisión de Valores y Bolsa (SEC) de EE.UU. aprobó el jueves el primer ETF de Solana (SOL) del mercado americano, con inicio de cotización previsto para agosto. Los fondos de VanEck y 21Shares serán los primeros en comercializarse. El precio de Solana subió 7.8% hasta US$ 198.40 en las horas siguientes al anuncio, con analistas de Galaxy Research señalando que el ETF podría atraer entre US$ 4,000M-7,000M en activos bajo gestión en su primer año.

Los activos totales bajo gestión (AUM) de todos los ETFs de criptomonedas en EE.UU. superaron los US$ 128,000 millones al cierre del jueves, un récord histórico. El porcentaje del BTC circulante en ETFs supera ya el 5.8%. Bitcoin cotizó a US$ 108,400 (+2.1% en 24h), Ethereum avanzó 3.8% hasta US$ 4,240, y Solana lideró con el 7.8% de ganancias.

La semana del 26-30 de mayo se consolidó como la de mayores entradas de capital en la historia de los ETFs cripto en EE.UU., con US$ 3,200 millones en flujos netos. El iShares Bitcoin Trust de BlackRock (IBIT) lideró con US$ 612M. La aprobación del ETF de Solana marca el tercer activo cripto en acceder al vehículo ETF regulado en EE.UU. (tras Bitcoin en enero 2024 y Ethereum en junio 2024).

La agenda de regulación cripto de la administración Trump-Atkins en la SEC es favorable a la industria. El consenso de analistas indica que XRP, Avalanche y Chainlink podrían ser los próximos en recibir aprobación en 2026-2027. Ethereum (+3.8%) se benefició adicionalmente del upgrade técnico "Petra", que mejora la eficiencia del sistema de validadores.`,
    analisis: `La aprobación del ETF de Solana cierra el ciclo de adopción institucional de las principales blockchains de capa 1: Bitcoin (store of value), Ethereum (smart contracts y DeFi) y Solana (alta velocidad para transacciones masivas). Cada aprobación trae una nueva oleada de capital institucional que no podía acceder al activo directamente por restricciones regulatorias.

El impacto de largo plazo es la reducción de la volatilidad cripto: cuando el 20-30% del suministro está en manos de fondos con horizontes de 5-10 años, las caídas bruscas se suavizan. Este es el camino hacia la madurez del activo cripto, similar a lo que ocurrió con el oro entre 2004-2010 tras la creación de los primeros ETFs de oro.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4911411/pexels-photo-4911411.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f015',
    titulo: 'Perú se convierte en segundo mayor exportador de frutas y verduras de América del Sur — café bate récord con US$ 1,120M proyectados para 2026',
    descripcion: 'Según un reporte conjunto de la FAO y MINCETUR, Perú superó a Chile y es ahora el segundo mayor exportador de frutas y verduras de América del Sur (después de Brasil), con US$ 5,800M proyectados para 2026. El café peruano proyecta su primer año histórico por encima de US$ 1,120M impulsado por arábica en US$ 4,180/quintal.',
    contenido: `Un reporte conjunto de la FAO y el Ministerio de Comercio Exterior y Turismo del Perú reveló que el país superó a Chile y se posicionó como el segundo mayor exportador de frutas y verduras de América del Sur, con exportaciones proyectadas de US$ 5,800 millones para el año completo 2026. Solo Brasil (US$ 14,200M proyectados) supera al Perú en el ranking regional hortofrutícola.

El café peruano está en camino de su primer año histórico por encima de US$ 1,120 millones en exportaciones. Los precios récord del café arábica en el ICE —US$ 4,180 por quintal en la actualidad, frente a US$ 2,400 en enero 2025— son el principal motor. Perú exporta principalmente café arábica de altura de Amazonas, San Martín, Cajamarca y Junín. Las cooperativas asociadas a la Junta Nacional del Café agrupan a 85,000 productores cuyos ingresos se han multiplicado esta temporada.

La palta Hass peruana lidera globalmente en producción con la menor huella hídrica por kilogramo en los valles costeros de Ica, La Libertad y Lima. Las exportaciones de palta para 2026 se proyectan en US$ 1,980M, superando por primera vez los US$ 2,000M en el año completo. El precio de exportación alcanza US$ 3.20-3.40/kg FOB, un máximo histórico.

El arándano peruano es el caso de internacionalización más exitoso de la última década: de cero exportaciones en 2010 a ser el mayor exportador mundial en 2022, con 175,000 hectáreas cultivadas hoy. La asociación Proarándanos estima exportaciones de US$ 1,480M para 2026, con el 40% destinado a EE.UU., 30% a Europa y 20% a China y Asia-Pacífico.`,
    analisis: `La consolidación de Perú como segunda potencia agroexportadora de América del Sur es un cambio estructural sin precedentes en la historia económica del país. Hace 25 años, Perú no exportaba prácticamente frutas ni verduras frescas. Hoy compite con Chile —un país de tradición exportadora mucho más larga— en múltiples productos.

El impacto cambiario es directo: mayor generación de dólares del agro = mayor fortaleza estructural del sol. Pero el impacto más relevante a largo plazo es la diversificación de la base exportadora: cuando los metales corrijan en algún ciclo futuro, el agro actuará como amortiguador de las divisas y del crecimiento.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-29T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2280569/pexels-photo-2280569.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n001',
    titulo: 'Fed mantiene tasa en 3.50%-3.75% por tercera reunión consecutiva — DXY sube a 99.28 ante incertidumbre por ataques de EE.UU. en Irán',
    descripcion: 'La Reserva Federal mantuvo sin cambios la tasa de fondos federales en el rango 3.50%-3.75% en su tercera reunión consecutiva sin movimiento. El DXY recuperó posiciones hasta 99.28 mientras los mercados procesan los ataques aéreos del Comando Central de EE.UU. a instalaciones iraníes cerca del Estrecho de Ormuz, que elevan la incertidumbre geopolítica y complican la hoja de ruta de la Fed para el segundo semestre.',
    contenido: `El Comité Federal de Mercado Abierto (FOMC) bajo la presidencia de Kevin Warsh, quien asumió el 15 de mayo, decidió mantener la tasa de fondos federales en el rango 3.50%-3.75% por tercera reunión consecutiva. El comunicado post-reunión mantuvo el sesgo dovish de sus antecesores, señalando que "solo recortes adicionales están en la mesa" frente a los datos actuales, pero añadió una cláusula nueva sobre incertidumbre geopolítica que refleja el impacto del conflicto en Oriente Medio.

El president Warsh, en su conferencia de prensa, declaró que "la Fed no opera en el vacío geopolítico" y que el impacto de los recientes ataques aéreos del Comando Central de EE.UU. a instalaciones en el sur de Irán —cerca del Estrecho de Ormuz— genera presiones inflacionarias vía energía que deben evaluarse en el contexto de la trayectoria del PCE core, actualmente en 2.6% anual. La reunión del FOMC del 16-17 de junio es la próxima cita, con apenas un 22% de probabilidad de recorte según los futuros de Fed Funds.

El DXY subió 0.06% hasta 99.28 durante la sesión, sostenido por la demanda de refugio frente a la geopolítica, aunque la tendencia estructural sigue siendo de debilidad del dólar. Los rendimientos del Tesoro a 10 años ceden a 4.31%, con inversores que buscan activos de refugio ante el escenario de tensión en el Golfo Pérsico. El oro reaccionó al alza, tocando US$ 3,380/oz en la sesión.

Los mercados de futuros asignan un 61% de probabilidad de recorte en septiembre, condicionado a que el PCE core de mayo y junio confirme la desinflación. Goldman Sachs y Barclays mantienen su proyección de dos recortes en la segunda mitad del año, aunque advierten que una escalada del conflicto Irán-EE.UU. puede retrasar el primer recorte hasta diciembre si la inflación energética se dispara.`,
    analisis: `La confluencia de una Fed con sesgo dovish y una escalada geopolítica en el Golfo Pérsico crea un dilema para el dólar: por un lado, la perspectiva de recortes de tasas debilita estructuralmente el DXY; por otro, la demanda de refugio ante el conflicto lo sostiene en 99-100. El resultado neto es un DXY en rango lateral que no da señales claras para el tipo de cambio en el corto plazo.

Para el sol peruano, el escenario de Fed dovish con DXY en 99-101 mantiene el par PEN/USD en el rango S/ 3.62-3.68. La clave de las próximas semanas será la evolución del conflicto Irán-EE.UU.: si escala y el WTI supera US$ 100, el DXY subirá y el sol podría retroceder hacia S/ 3.72-3.75. Si se desescala, el DXY caerá y el sol se apreciará hacia S/ 3.58-3.62.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534229/pexels-photo-534229.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n002',
    titulo: 'BCRP mantiene tasa en 4.75% y reservas tocan US$ 74,900 millones — sol peruano se estabiliza en S/ 3.64 pese a volatilidad global',
    descripcion: 'El Banco Central de Reserva del Perú mantuvo su tasa de referencia en 4.75% anual en su reunión de directorio de mayo, en línea con el consenso de mercado. Las reservas internacionales netas alcanzaron US$ 74,900 millones, estableciendo un nuevo récord histórico. El sol cotiza en S/ 3.64 pese a la volatilidad global generada por las tensiones Irán-EE.UU.',
    contenido: `El directorio del Banco Central de Reserva del Perú (BCRP) decidió por unanimidad mantener la tasa de interés de referencia en 4.75% anual en su reunión ordinaria del 28 de mayo. La decisión era ampliamente anticipada por el mercado: 17 de los 19 analistas encuestados por Reuters pronosticaban la pausa. Las reservas internacionales netas cerraron el mes en US$ 74,900 millones, superando el récord previo de US$ 74,830 millones de la semana anterior.

El presidente del BCRP, Julio Velarde, señaló en la conferencia de prensa que el banco central mantiene "plena atención sobre las tensiones geopolíticas en el Golfo Pérsico", dado que Perú importa derivados del petróleo y un WTI sostenido por encima de US$ 95-100 podría reactivar presiones inflacionarias importadas. La inflación interanual se ubica actualmente en 2.3%, dentro del rango meta del 1%-3%, pero la proyección del mes de junio incorpora el riesgo energético.

El tipo de cambio del sol peruano se estabilizó en S/ 3.64 por dólar al cierre del miércoles, recuperándose del nivel de S/ 3.66 del martes por el efecto de una intervención esterilizada del BCRP de US$ 180 millones en el mercado spot. La autoridad monetaria continúa comprando dólares en los momentos de apreciación del sol para acumular reservas y vendiendo en los de depreciación excesiva para suavizar la volatilidad.

El diferencial de tasas entre el BCRP (4.75%) y la Fed (3.50%-3.75%) se amplió en los últimos seis meses, lo que sostiene el atractivo relativo de activos en soles para inversores internacionales que buscan carry. El saldo de bonos del Tesoro peruano en manos de no residentes aumentó US$ 840 millones en mayo, el mayor flujo mensual desde agosto de 2024.`,
    analisis: `El BCRP mantiene una posición de fortaleza inusual en el contexto latinoamericano: tasa real positiva, reservas récord y fundamentos fiscales sólidos. Esta combinación genera un atractivo estructural para el sol que actúa como amortiguador frente a shocks externos como la tensión Irán-EE.UU.

El nivel de S/ 3.64 representa un equilibrio razonable entre el impulso apreciador de los fundamentos (superávit comercial, IED, diferencial de tasas) y las presiones depreciatorias de la geopolítica (WTI alto, aversión al riesgo). Para empresas con flujos en dólares, el rango de operación S/ 3.60-3.70 en el horizonte del Q3 2026 parece el escenario central más probable.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/20934324/pexels-photo-20934324.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n003',
    titulo: 'Exportaciones peruanas crecen 33.5% en Q1 2026 y alcanzan US$ 27,217 millones — minería +49%, agroexportaciones +7.2%',
    descripcion: 'Las exportaciones totales del Perú sumaron US$ 27,217 millones en el primer trimestre de 2026, un crecimiento del 33.5% interanual, impulsadas por el boom del cobre y el oro. La minería metálica aportó US$ 19,897 millones (+49%), mientras el sector agroexportador alcanzó US$ 3,067 millones (+7.2%). China lideró los destinos con US$ 10,748 millones.',
    contenido: `El Ministerio de Comercio Exterior y Turismo (MINCETUR) presentó el reporte definitivo de exportaciones del primer trimestre de 2026, con cifras que consolidan a Perú como el mayor exportador en términos de crecimiento porcentual entre las economías medianas de América del Sur. Las exportaciones totales de US$ 27,217 millones representan un incremento de US$ 6,821 millones frente al Q1 2025, con el sector minero-metálico como motor indiscutido.

El cobre lideró con exportaciones de valor por US$ 11,240 millones en el trimestre, favorecido por un precio promedio de US$ 5.12/lb en el período. El oro aportó US$ 5,890 millones con cotizaciones promedio de US$ 3,320/oz. Plata, zinc y plomo sumaron US$ 2,767 millones adicionales, impulsados por la recuperación de la demanda de manufactura en Asia y Europa. El crecimiento de exportaciones mineras del 49% es el mayor registrado en un trimestre desde 2011.

El sector agroexportador alcanzó US$ 3,067 millones, con la uva de mesa (US$ 612M), la palta Hass (US$ 498M) y los arándanos (US$ 367M) como los tres principales productos en valor. El café sumó US$ 280 millones con un crecimiento del 51%, beneficiado por los precios récord del café robusta y arábica en los mercados internacionales. El espárrago fresco y congelado sumó US$ 215 millones, consolidando a Perú como el mayor proveedor global del tubérculo.

China mantuvo su posición como principal mercado con US$ 10,748 millones (+43%), seguido de EE.UU. con US$ 2,878 millones (+24.1%), India con US$ 2,928 millones (+300%) y la Unión Europea con US$ 2,238 millones (+9.8%). La irrupción de India como tercer destino —impulsada por importaciones de cobre para su programa de electrificación— es el cambio estructural más relevante del período.`,
    analisis: `Un crecimiento exportador del 33.5% con US$ 27,217 millones en un solo trimestre es el fundamento estructural más sólido que puede tener una moneda emergente. Cada dólar exportado que se convierte a soles presiona hacia la apreciación del PEN, y el volumen actual justifica por qué el BCRP está acumulando reservas activamente para moderar esa apreciación.

Para empresas importadoras, el contexto de superávit comercial crónico en 2026 significa que el tipo de cambio tiene un techo estructural más bajo que en años anteriores. Planificar importaciones bajo la hipótesis de un dólar en el rango S/ 3.55-3.70 para el segundo semestre es una postura razonable y conservadora.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/11820859/pexels-photo-11820859.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n004',
    titulo: 'MEF presenta Marco Macroeconómico Multianual 2027-2029 — proyecta crecimiento de 4.0% para 2027 con inversión pública de S/ 38,000 millones',
    descripcion: 'El Ministerio de Economía y Finanzas presentó el Marco Macroeconómico Multianual 2027-2029, proyectando un crecimiento del PBI de 4.0% para 2027 y 4.2% para 2028. La inversión pública ascendería a S/ 38,000 millones en 2027, el nivel más alto de la historia. El déficit fiscal meta se fija en 2.5% del PBI para 2027.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó el Marco Macroeconómico Multianual (MMM) 2027-2029, el documento de planificación fiscal y económica de mediano plazo que sienta las bases del proyecto de Ley de Presupuesto 2027. El documento proyecta un crecimiento del PBI del 4.0% para 2027 y 4.2% para 2028, apoyado en la continuidad del boom minero-exportador y el aumento de la inversión pública.

El ministro de Economía, José Arista, destacó que la inversión pública de S/ 38,000 millones proyectada para 2027 representa un incremento del 12.4% frente a los S/ 33,800 millones del presupuesto 2026. Los sectores con mayor asignación serían: transportes y comunicaciones (S/ 11,200M), educación (S/ 8,400M), agua y saneamiento (S/ 6,800M) y salud (S/ 5,600M). La inversión en infraestructura de conectividad para las regiones del interior es la prioridad política del gobierno.

El MMM fija el déficit fiscal meta en 2.5% del PBI para 2027, mejorando respecto al 2.7% proyectado para 2026 y al 2.9% ejecutado en 2025. La reducción del déficit se financiaría principalmente con el mayor ingreso tributario proveniente del sector minero, estimado en S/ 28,400 millones de Impuesto a la Renta para 2027 (frente a S/ 22,100M en 2026). La presión tributaria total se proyecta en 16.1% del PBI.

La deuda pública se estabilizaría en 32.5% del PBI hacia 2029, manteniéndose entre los niveles más bajos de la región y consistente con el grado de inversión de Perú en BBB/Baa1. El MEF descartó la necesidad de nuevas emisiones de bonos internacionales en 2026, dado el nivel de reservas del fisco y los ingresos extraordinarios del sector minero.`,
    analisis: `Un MMM con crecimiento proyectado de 4.0%-4.2% y déficit en convergencia descendente es exactamente el tipo de señal que las agencias de calificación crediticia y los inversores internacionales necesitan para mantener o mejorar el rating soberano del Perú. Un eventual upgrade de BBB a BBB+ por parte de Fitch —que ha mantenido perspectiva estable desde 2024— reduciría los costos de financiamiento del Estado y de las empresas peruanas con deuda externa.

En términos cambiarios, un Estado que consolida sus finanzas reduce la probabilidad de emisión monetaria para cubrir déficits y señaliza menor riesgo de inflación estructural. Esto fortalece la credibilidad del BCRP y del sol peruano como activo de calidad dentro de los mercados emergentes latinoamericanos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n005',
    titulo: 'Cobre cierra en US$ 5.12/lb en el LME — ingresos mineros peruanos superan US$ 19,897 millones en Q1 2026 con crecimiento del 49%',
    descripcion: 'El cobre cerró la sesión del miércoles en US$ 5.12/lb en la London Metal Exchange, cediendo levemente desde los US$ 5.18 del viernes. Los ingresos de exportación del sector minero-metálico del Perú alcanzaron US$ 19,897 millones en el Q1 2026, un crecimiento del 49% interanual. El canon minero proyectado para el año asciende a S/ 12,000 millones.',
    contenido: `El cobre finalizó la sesión del miércoles en US$ 5.12/lb (US$ 11,290/TM) en la London Metal Exchange, retrocediendo 1.2% desde los US$ 5.18/lb del cierre del viernes pasado. La corrección responde al dato del PMI manufacturero oficial chino de mayo en 49.5, que indica contracción por segundo mes consecutivo en la industria exportadora china, aunque el PMI de Caixin —que mide empresas más pequeñas y orientadas al mercado interno— subió a 51.7, mostrando la divergencia entre los dos segmentos de la manufactura china.

Los datos del Q1 2026 confirman un récord histórico para la minería peruana: US$ 19,897 millones en exportaciones metálicas, un 49% más que en Q1 2025. El cobre aportó US$ 11,240 millones, el oro US$ 5,890 millones y el resto de metales (plata, zinc, plomo, molibdeno) US$ 2,767 millones. El precio promedio del cobre en el trimestre fue de US$ 5.12/lb, mientras el oro promedió US$ 3,320/oz.

Southern Copper (Cuajone, Toquepala, Cerro Verde co-owner), Antamina, Cerro Verde (Freeport-McMoRan) y Hudbay Minerals en Cusco reportaron en conjunto una producción de 378,400 toneladas métricas de cobre en el trimestre, un record individual para las operaciones peruanas. La ampliación de Quellaveco (Anglo American, full capacity) contribuyó con 35,200 TM adicionales frente al mismo período de 2025.

El Ministerio de Energía y Minas estima que el canon minero distribuido a las regiones alcanzará S/ 12,000 millones en 2026, un incremento de 68% frente a los S/ 7,150 millones de 2025. Los mayores beneficiarios serán Arequipa (S/ 2,840M), Áncash (S/ 2,180M), Moquegua (S/ 1,920M) y Tacna (S/ 1,450M), con impactos significativos en sus presupuestos regionales de inversión.`,
    analisis: `El nivel del cobre en US$ 5.12/lb, pese a la corrección diaria, sigue siendo excepcionalmente alto desde una perspectiva histórica. Cada dólar de precio del cobre por encima del "break-even" presupuestario peruano (estimado en US$ 3.20/lb) genera retornos extraordinarios para el fisco vía Impuesto a la Renta y regalías. El margen actual de US$ 1.92/lb sobre el costo de producción promedio es el más amplio en más de una década.

Para el tipo de cambio PEN/USD, el precio del cobre es el indicador líder más confiable: mientras se mantenga por encima de US$ 4.80/lb, la presión estructural será hacia la apreciación del sol. El riesgo a monitorear es una corrección más profunda por datos chinos debilitados, que podría llevar el cobre a US$ 4.60-4.80 y presionar el tipo de cambio hacia S/ 3.72-3.78.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14747539/pexels-photo-14747539.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n006',
    titulo: 'Crédito al sector privado crece 5.8% interanual en abril — SBS reporta morosidad estable en 3.2% pese al alza de tasas activas',
    descripcion: 'La Superintendencia de Banca, Seguros y AFP reportó que el crédito total al sector privado creció 5.8% interanual en abril de 2026, alcanzando S/ 428,700 millones. La morosidad del sistema bancario se mantiene en 3.2%, dentro de rangos históricos normales. Las tasas activas promedio siguen en 10.5% anual en soles para créditos comerciales.',
    contenido: `La Superintendencia de Banca, Seguros y AFP (SBS) publicó el reporte mensual del sistema financiero correspondiente a abril de 2026, mostrando que el crédito total al sector privado alcanzó S/ 428,700 millones, con un crecimiento de 5.8% interanual. El resultado confirma una aceleración gradual del crédito desde el mínimo de 3.1% registrado en diciembre de 2025, señalando que la demanda interna está recuperando dinamismo.

El segmento de mayor crecimiento fue el crédito empresarial mediano y grande (+8.4%), impulsado principalmente por las líneas de capital de trabajo del sector minero, las inversiones en infraestructura agroexportadora y el financiamiento de importaciones de maquinaria. El crédito hipotecario creció 6.2%, beneficiado por las tasas en descenso desde el pico de 2024 y por la recuperación de la actividad inmobiliaria en Lima y principales ciudades del interior.

El crédito a microempresas muestra el menor crecimiento del período (+1.8%), reflejo de las mayores exigencias de garantías y la prudencia de las entidades financieras en un segmento con mayor riesgo. La morosidad sistémica se mantiene en 3.2%, con el segmento de microempresa en 6.1% (el más elevado) y la banca corporativa en 0.4% (el menor).

El Banco de Crédito del Perú, Scotiabank, BBVA, Interbank y BanBif reportan en conjunto una utilidad neta del Q1 2026 de S/ 3,840 millones, un incremento del 14.2% frente al Q1 2025. La rentabilidad sobre el patrimonio (ROE) promedio del sistema se ubica en 18.1%, uno de los niveles más altos entre los sistemas bancarios latinoamericanos. El ratio de capital Tier 1 promedio es 14.7%, muy por encima del mínimo regulatorio del 10%.`,
    analisis: `Un sistema bancario con crédito creciendo al 5.8%, morosidad bajo control y ROE de 18.1% es un indicador de que la economía peruana mantiene impulso en el lado doméstico, más allá del boom exportador. La expansión crediticia moderada —ni muy alta (riesgo de sobrecalentamiento) ni muy baja (señal de recesión)— es consistente con el escenario de "aterrizaje suave" que proyecta el BCRP.

Para empresas que buscan financiamiento, el entorno actual de tasas activas en 10.5% en soles es más accesible que los picos del 14-15% de 2023-2024, pero aún oneroso para proyectos con retornos modestos. El BCRP, si mantiene la tasa en 4.75% hasta fin de año, dará espacio gradual para que las tasas activas desciendan hacia el 9-9.5% en el primer semestre de 2027.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29117446/pexels-photo-29117446.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n007',
    titulo: 'PMI manufactura China: índice oficial cae a 49.5 en mayo por segundo mes en contracción — Caixin PMI sube a 51.7 mostrando divergencia',
    descripcion: 'El PMI manufacturero oficial de China bajó a 49.5 en mayo desde 50.1 en abril, su segundo mes consecutivo en zona de contracción. Sin embargo, el PMI Caixin —que mide empresas medianas y pequeñas— subió a 51.7 desde 51.4, evidenciando una divergencia entre el sector exportador (afectado por aranceles de EE.UU.) y el mercado interno.',
    contenido: `La Oficina Nacional de Estadísticas (NBS) de China publicó el PMI manufacturero de mayo, que cayó a 49.5 desde 50.1 en abril, marcando el segundo mes consecutivo de contracción (por debajo de 50). El resultado estuvo por debajo de las estimaciones del consenso de Bloomberg de 50.0 y señala que los obstáculos comerciales con EE.UU. siguen presionando al sector exportador chino a pesar de la tregua arancelaria parcial anunciada en mayo.

En contraste, el PMI Caixin —elaborado por la consultora financiera Caixin y orientado a empresas medianas y pequeñas más dependientes del mercado doméstico— subió a 51.7 desde 51.4, su cuarto mes consecutivo en expansión. Esta divergencia entre el PMI oficial (49.5) y el Caixin (51.7) refleja la brecha entre las grandes empresas estatales exportadoras, que sufren el impacto arancelario de EE.UU., y las empresas privadas orientadas al consumo interno, que se benefician de los estímulos fiscales del gobierno de Xi Jinping.

Los subíndices del PMI oficial muestran que los nuevos pedidos de exportación cayeron a 46.3, el nivel más bajo desde enero de 2020 (pandemia), lo que confirma que las restricciones comerciales con EE.UU. se están materializando en menores órdenes de compra. El subíndice de empleo cayó a 48.6, indicando despidos netos en el sector manufacturero exportador. Por el contrario, los nuevos pedidos domésticos subieron a 51.2 por los subsidios al consumo de vehículos eléctricos y electrodomésticos.

El impacto sobre las materias primas es directo: el cobre en la LME perdió 1.2% hasta US$ 5.12/lb tras el dato del PMI oficial, aunque el rebote del Caixin limitó la corrección. Los analistas de Barclays estiman que si el PMI oficial se mantiene por debajo de 50 por tres meses consecutivos, la demanda china de cobre podría reducirse en 80,000-120,000 toneladas métricas en el trimestre.`,
    analisis: `La divergencia entre el PMI oficial chino (49.5, contracción) y el Caixin (51.7, expansión) es el dato más importante de la semana para Perú: el riesgo para las exportaciones peruanas de cobre no proviene del mercado interno chino —que sigue creciendo— sino del sector exportador chino, que al ver reducidas sus propias exportaciones a EE.UU., puede reducir sus importaciones de insumos incluido el cobre.

El escenario de base sigue siendo positivo para el cobre, pero el PMI oficial crea un riesgo a la baja que se amplificaría si la tregua comercial EE.UU.-China se rompe o los aranceles se intensifican. Para el tipo de cambio PEN/USD, un PMI chino en zona de contracción por tres meses seguidos históricamente precede caídas del cobre de 8-12% y depreciaciones del sol de 3-5%, lo que llevaría el PEN/USD hacia S/ 3.75-3.82.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29988955/pexels-photo-29988955.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n008',
    titulo: 'WTI sube a US$ 94/barril tras ataques del Comando Central de EE.UU. a instalaciones iraníes cerca del Estrecho de Ormuz',
    descripcion: 'El crudo WTI recuperó el nivel de US$ 94 por barril tras los ataques aéreos del US Central Command a instalaciones militares iraníes en el sur de Irán, cerca del Estrecho de Ormuz. La escalada del conflicto Irán-EE.UU. revierte parcialmente los avances del acuerdo verbal de paz anunciado la semana pasada y reactiva el riesgo de cierre del principal paso marítimo de petróleo.',
    contenido: `El crudo West Texas Intermediate (WTI) para entrega en julio subió a US$ 94.30 por barril en el NYMEX, avanzando 2.5% en dos días desde los US$ 92 del lunes. El catalizador es la confirmación por parte del Comando Central de EE.UU. (CENTCOM) de que fuerzas militares estadounidenses lanzaron ataques aéreos precisos sobre instalaciones militares en el sur de Irán, cerca del Estrecho de Ormuz, en respuesta a actividades que Washington calificó como "preparativos para un ataque inminente contra instalaciones de socios regionales".

El Estrecho de Ormuz es el punto de tránsito de aproximadamente 21% del comercio mundial de petróleo y el 30% del gas natural licuado (GNL) global. Cualquier amenaza de cierre —incluso temporal— tiene el efecto de disparar la prima de riesgo geopolítico incorporada en el precio del crudo. La prima actual se estima en US$ 6-9/barril sobre el precio de equilibrio de fundamentos de oferta y demanda (estimado en US$ 85-87/barril).

La OPEP+ reaccionó con cautela: Arabia Saudita declaró que "monitoreará el desarrollo de los eventos antes de tomar cualquier decisión sobre producción". Los analistas de Goldman Sachs estiman que si el conflicto genera una interrupción del 20-30% del tráfico por el Estrecho durante dos semanas, el WTI podría subir a US$ 105-115. En el escenario de cierre total —considerado improbable pero no imposible— la referencia histórica es el pico de US$ 113 de enero de 2026.

El Brent europeo cotiza en US$ 97.40, con un diferencial de US$ 3.10 sobre el WTI explicado por los mayores costos de seguro y fletes para cargamentos del Medio Oriente con destino a Europa. Las compañías de seguros marítimas están elevando las primas para la zona del Golfo Pérsico a niveles no vistos desde 2020.`,
    analisis: `El WTI en US$ 94 tiene implicancias mixtas para Perú. Por el lado negativo, eleva los costos de importación de combustibles refinados (gasolina, diésel, GLP) que Perú importa en proporción significativa, presionando la inflación de transporte y energía doméstica. El BCRP estima que cada US$ 10 de alza en el WTI agrega entre 0.2% y 0.3% a la inflación anual importada.

Por el lado positivo, un WTI alto impulsa los ingresos fiscales de Petroperú y PetroTal (productores domésticos) y reduce la presión sobre el presupuesto de subsidios energéticos. Para el sol peruano, el efecto neto es levemente negativo: el WTI alto tiende a fortalecer el dólar globalmente (demanda para transacciones energéticas) y a generar aversión al riesgo en emergentes, lo que puede llevar el PEN/USD hacia S/ 3.68-3.72 en los próximos días.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n009',
    titulo: 'Mercados globales en modo defensivo — S&P 500 cede 0.8% y VIX sube a 18.4 mientras el oro recupera US$ 3,380/oz como activo refugio',
    descripcion: 'Los mercados de acciones globales adoptaron una postura defensiva ante la escalada Irán-EE.UU.: el S&P 500 perdió 0.8%, el Nasdaq 1.1% y el VIX subió a 18.4 puntos. El oro recuperó terreno hasta US$ 3,380/oz y los bonos del Tesoro de EE.UU. captaron flujos de refugio, con el yield a 10 años cayendo a 4.31%. Los mercados emergentes mostraron comportamiento heterogéneo.',
    contenido: `Los mercados financieros globales adoptaron una postura defensiva durante la sesión del miércoles, en respuesta a los ataques del CENTCOM a instalaciones iraníes. El índice S&P 500 cedió 0.8%, con las mayores caídas en sectores de consumo discrecional (-1.4%) y tecnología (-1.2%), mientras el sector energía avanzó 1.9% por el alza del WTI. El Nasdaq Composite bajó 1.1% y el Dow Jones perdió 0.5%. El índice de volatilidad VIX subió 2.4 puntos hasta 18.4, el nivel más alto desde el 9 de mayo.

El oro actúa como el activo refugio más demandado de la sesión: el precio spot recuperó US$ 3,380/oz desde los US$ 3,340 del martes, con un avance del 1.2%. Los fondos cotizados en bolsa (ETF) de oro en EE.UU. registraron entradas netas estimadas en US$ 320 millones en el día, el mayor flujo desde el 14 de abril. Los bancos centrales de los países del G20 continúan siendo compradores netos.

Los bonos del Tesoro estadounidense captaron flujos de refugio, con el rendimiento a 10 años cayendo 7 puntos básicos hasta 4.31%. Esta dinámica es favorable para los mercados emergentes en general, ya que un yield americano más bajo reduce el costo de oportunidad de mantener activos en monedas emergentes. Sin embargo, el apetito de riesgo reducido actúa en sentido contrario, resultando en flujos netos ambiguos para la región.

En América Latina, el S&P/BVL Peru General cayó 1.2%, con el sector minero como principal arrastrador (-1.8%) por el efecto combinado de la corrección del cobre y la aversión al riesgo. El IPSA de Chile cedió 0.9%, el IPC de México bajó 0.6% y el MERVAL de Argentina subió 0.4% por la baja correlación con los mercados externos. El BRL y el COP se depreciaron 0.5% y 0.3% respectivamente frente al dólar.`,
    analisis: `La postura defensiva de los mercados globales es un recordatorio de que el PEN/USD no opera en aislamiento: cuando los inversores globales reducen el apetito por activos de riesgo, los flujos de portafolio salientes de mercados emergentes pueden presionar incluso a monedas con fundamentos sólidos como el sol peruano.

El escenario de corto plazo para el PEN/USD depende crucialmente de si la escalada Irán-EE.UU. se profundiza o se estabiliza. En el escenario de estabilización, el sol puede retornar a S/ 3.62-3.64 en los próximos días al reanudarse el appetite de riesgo. En el escenario de escalada, la presión hacia S/ 3.70-3.75 es real, aunque las reservas del BCRP proveen una red de seguridad robusta.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/33539235/pexels-photo-33539235.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n010',
    titulo: 'PEN/USD: sol cotiza en S/ 3.64 en zona de soporte técnico — MACD diario neutro mientras el mercado espera resolución de tensión geopolítica',
    descripcion: 'El cruce PEN/USD cotiza en S/ 3.64 por dólar, operando en torno a su media móvil de 20 días. El RSI diario se ubica en 52 en zona neutral, el MACD muestra convergencia y el rango de soporte-resistencia relevante es S/ 3.60-S/ 3.72. Los analistas de TradingView señalan que el par aguarda un catalizador directivo ante la incertidumbre geopolítica del Golfo Pérsico.',
    contenido: `El tipo de cambio PEN/USD abre la jornada del 28 de mayo en S/ 3.64, posicionándose exactamente sobre la media móvil exponencial de 20 días (EMA20) que actúa como línea divisoria entre el momentum apreciador y depreciador de corto plazo. La sesión del martes cerró en S/ 3.645, con un rango intradía de apenas 0.5%, indicando que el mercado está en una pausa técnica mientras aguarda señales más claras sobre el conflicto Irán-EE.UU. y sus implicancias para el DXY.

Los indicadores técnicos presentan un panorama neutro: el RSI diario en 52 se encuentra lejos tanto de la zona de sobrecompra (por encima de 70) como de sobreventa (por debajo de 30), lo que no genera señales de reversión inminente en ninguna dirección. El MACD (12,26,9) muestra un histograma prácticamente plano, con la línea MACD apenas por debajo de la línea señal, configurando una divergencia neutral-bearish para el dólar que, de profundizarse, señalizaría apreciación adicional del sol.

Los niveles técnicos clave son: soporte inmediato en S/ 3.60 (mínimo reciente del 25 de mayo y soporte psicológico), soporte secundario en S/ 3.55 (mínimo del 14 de febrero de 2026) y soporte mayor en S/ 3.48 (mínimo anual). Por el lado de las resistencias: S/ 3.68 (máximo intradía del martes), S/ 3.72 (resistencia de consolidación de mediados de mayo) y S/ 3.78 (máximo de mayo previo al rally de paz Iran-EE.UU.).

El volumen promedio diario del mercado cambiario peruano en mayo es de US$ 1,180 millones, levemente por debajo del promedio de US$ 1,240 millones de abril. La reducción de volumen en zonas de equilibrio técnico es consistente con un mercado que espera: las posiciones especulativas netas a favor del sol se reducen y los operadores corporativos realizan transacciones mínimas necesarias para su operación ordinaria.`,
    analisis: `El rango S/ 3.60-3.72 es el campo de batalla técnico de las próximas semanas. Una ruptura por debajo de S/ 3.60 con volumen alto señalizaría una nueva fase de apreciación hacia S/ 3.55-3.58, consistente con un DXY debilitándose y la resolución pacífica de la tensión Irán-EE.UU. Una ruptura por encima de S/ 3.72 señalizaría una depreciación moderada del sol hacia S/ 3.78-3.82, consistente con una escalada del conflicto y un WTI superando US$ 100.

Para empresas con necesidad de comprar o vender dólares en los próximos 15-30 días, el nivel de S/ 3.64 es un punto técnico de equilibrio: ni barato ni caro desde una perspectiva de corto plazo. Las coberturas cambiarias tipo forward a 30 días en torno a S/ 3.66-3.68 ofrecen una protección razonable frente al escenario de escalada.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31738798/pexels-photo-31738798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n011',
    titulo: 'DXY sube a 99.28 pero mantiene sesgo bajista — inversores equilibran refugio por geopolítica contra expectativas de recorte de tasas de la Fed',
    descripcion: 'El índice DXY del dólar estadounidense cotiza en 99.28 (+0.06%), sostenido por la demanda de refugio ante los ataques de EE.UU. en Irán, pero sin lograr recuperar el nivel de 100 puntos que muchos analistas consideran la resistencia clave. El sesgo de política monetaria de la Fed sigue siendo dovish, lo que limita el potencial alcista del dólar en el mediano plazo.',
    contenido: `El índice del dólar DXY sube apenas 0.06% hasta 99.28 en la sesión del miércoles, en un movimiento que refleja la tensión entre dos fuerzas opuestas: la demanda de activos de refugio generada por los ataques del Comando Central de EE.UU. a instalaciones iraníes (que impulsa al dólar al alza), y las expectativas de recortes de tasas de la Fed en el horizonte del Q3-Q4 2026 (que lo presionan a la baja).

El nivel de 100 puntos en el DXY se ha consolidado como una resistencia psicológica y técnica relevante. En los últimos 30 días, el índice ha intentado cinco veces cruzar ese umbral de manera sostenida y ha fracasado cada vez. Los analistas técnicos de TradingView identifican 100.2 como la resistencia clave: una ruptura con cierre semanal por encima indicaría un cambio de tendencia hacia la fortaleza dólar, mientras que mantenerse por debajo sostendría el sesgo débil dólar establecido desde el máximo de enero de 2025 en DXY 111.2.

Los componentes del DXY muestran que el euro (EUR/USD) cotiza en 1.1012, con el BCE señalizando cautela adicional ante la debilidad de la manufactura alemana. El yen japonés (USD/JPY) opera en 155.8 con el Banco de Japón en modo de espera. La libra (GBP/USD) sube a 1.2842 favorecida por mejores datos del mercado laboral británico. El franco suizo (USD/CHF) baja a 0.8901 con flujos de refugio hacia el CHF.

Los datos del mercado de futuros de CME muestran una posición neta corta en dólares (apuesta por debilidad del USD) de US$ 18,700 millones, el nivel más elevado desde octubre de 2023. Esta posición especulativa estructural sugiere que el mercado sigue apostando por un dólar más débil en el mediano plazo, y cada rebote del DXY hacia 99-100 es utilizado como oportunidad para vender dólares.`,
    analisis: `El DXY en 99.28 con soporte de refugio pero limitado por la perspectiva dovish de la Fed es el escenario más complejo para operar el PEN/USD: el rango lateral S/ 3.62-3.68 puede mantenerse semanas sin un catalizador direccional claro. Este tipo de mercado lateral es costoso para quienes intentan especular con el tipo de cambio, pero manejable para empresas que solo necesitan cubrir sus necesidades operativas.

Para Perú, un DXY en 99-101 es un entorno relativamente favorable: no genera presión depreciadora aguda sobre el sol ni genera distorsiones importantes en los costos de importación. El escenario adverso sería un DXY por encima de 103-105 (fortaleza marcada del dólar), que históricamente coincide con fuertes depreciaciones del sol hacia S/ 3.85-4.00.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n012',
    titulo: 'Bitcoin cae a US$ 72,979 — ataques de EE.UU. en Irán deterioran sentimiento de riesgo y extienden corrección desde máximos de US$ 82,000',
    descripcion: 'Bitcoin (BTC/USD) retrocedió a US$ 72,979 en las primeras horas del 28 de mayo, su nivel más bajo en tres semanas, al extender la corrección iniciada desde el máximo reciente de US$ 82,000. Los ataques aéreos del Comando Central de EE.UU. a instalaciones iraníes cerca del Estrecho de Ormuz catalizaron el deterioro del sentimiento de riesgo, impactando especialmente a los activos digitales.',
    contenido: `Bitcoin (BTC/USD) cotiza en US$ 72,979 en las operaciones de la mañana del miércoles, cayendo 3.56% en 24 horas y acumulando una corrección del 11% desde el máximo reciente de US$ 82,200 alcanzado el 15 de mayo. Es el nivel más bajo desde el 7 de mayo, cuando el activo rebotó desde US$ 70,800. El mercado de criptomonedas en general sigue la misma tendencia: Ethereum cae 4.1% a US$ 3,410, Solana pierde 5.2% y el índice total de capitalización de mercado cripto baja 3.8%.

Los ataques del CENTCOM a instalaciones iraníes son el catalizador del último tramo de caída. El Bitcoin mantiene en 2025-2026 una correlación inversa con el sentimiento de riesgo en escenarios geopolíticos de alta incertidumbre: a diferencia de crisis inflacionarias (donde BTC sube como cobertura), en crisis de seguridad global los inversores desinvierten en activos especulativos de alto riesgo —incluyendo cripto— y buscan activos de refugio tradicionales como el oro, los bonos del Tesoro y el franco suizo.

Los ETFs de Bitcoin al contado en EE.UU. registraron salidas netas de US$ 215 millones el martes, el cuarto día consecutivo de flujos negativos. BlackRock iShares Bitcoin Trust (IBIT) reportó salidas netas de US$ 88 millones, la mayor desde el 2 de mayo. La posición total gestionada por todos los ETFs de BTC al contado cayó a US$ 78,400 millones desde el pico de US$ 89,200 millones del 15 de mayo.

Los indicadores técnicos muestran señales de alerta: el RSI diario cayó a 34, acercándose a la zona de sobreventa (por debajo de 30). El nivel de soporte técnico más crítico se ubica en US$ 70,000-71,000 (mínimo de mayo y nivel psicológico redondo). Una ruptura a la baja abriría el camino hacia US$ 64,000-66,000 (soporte del rango de consolidación de enero-febrero 2026). La resistencia inmediata se ubica en US$ 75,000.`,
    analisis: `La caída de Bitcoin a US$ 72,979 tiene un vínculo indirecto con el PEN/USD: cuando el mercado cripto se contrae fuertemente, refleja un contexto de mayor aversión al riesgo global que típicamente también presiona a las divisas emergentes, incluyendo el sol peruano. La correlación no es directa, pero ambos activos se mueven en el mismo ecosistema de apetito de riesgo.

Para inversores peruanos con exposición a Bitcoin, el RSI cerca de la zona de sobreventa (34) y el soporte US$ 70,000-71,000 como nivel clave son los datos técnicos más relevantes. Una ruptura del soporte US$ 70,000 podría generar un pánico adicional que llevaría el BTC hacia US$ 64,000. Si se sostiene y el RSI entra en zona de sobreventa, históricamente han sido buenos momentos de entrada para horizontes de 3-6 meses.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14354113/pexels-photo-14354113.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n013',
    titulo: 'FMI proyecta inflación de un dígito en Argentina recién en 2028 — acumulado 2026 en 9.4% con dólar oficial en ARS 1,430',
    descripcion: 'El Fondo Monetario Internacional actualizó sus proyecciones para Argentina, estimando que la inflación anual descenderá a un dígito recién en 2028, con 7.5% proyectado para ese año. La inflación acumulada en 2026 alcanza el 9.4% en los primeros cuatro meses y se proyecta que cerrará el año en torno al 30.5%. El dólar oficial cotiza en ARS 1,430 con brecha respecto al MEP reducida al 3.8%.',
    contenido: `El Fondo Monetario Internacional publicó su última revisión del Article IV para Argentina, actualizando las proyecciones macroeconómicas del país en el contexto del programa de estabilización del gobierno de Javier Milei. El FMI estima que la inflación anual argentina descenderá progresivamente desde el 2,369% de 2023 hasta el 30.5% proyectado para cierre de 2026, con un horizonte de inflación de un dígito recién para 2028 (7.5%). El organismo reconoce los avances del programa pero señala que el proceso de desinflación "requiere perseverancia y tiempo".

La inflación acumulada en 2026 alcanza el 9.4% en los primeros cuatro meses (enero-abril), con el mes de mayo proyectado en 2.1% según las estimaciones de las consultoras económicas privadas que participan en el Relevamiento de Expectativas de Mercado del BCRA. Esta senda es más favorable que la proyectada originalmente, lo que ha llevado al FMI a revisar levemente a la baja su estimado de inflación anual 2026 desde el 35% publicado en enero hasta el 30.5% actual.

El tipo de cambio oficial cotiza en ARS 1,430 por dólar, con el BCRA manteniendo el esquema de "crawling peg" con una devaluación mensual del 1%, que a 12 meses implica una depreciación nominal del 12.7%. La brecha entre el tipo de cambio oficial y el tipo de cambio MEP (Mercado Electrónico de Pagos) se ha comprimido hasta el 3.8%, el nivel más bajo desde diciembre de 2023, señal de que la normalizacion del mercado cambiario avanza.

La economía argentina mostró debilidad en el Q1 2026, prácticamente estancada (+0.2% trimestral), con la manufactura, la construcción y el comercio minorista afectados por las altas tasas de interés reales. Sin embargo, el agro registró un crecimiento de 12.4% y la producción de Vaca Muerta (shale oil y gas) creció 18%, ambos sectores beneficiados por precios altos y la inversión de YPF y socios internacionales.`,
    analisis: `La estabilización argentina es un proceso real pero lento, con costos sociales significativos. Para Perú, el principal canal de impacto es el "sentimiento regional": una Argentina en proceso de normalización reduce el riesgo de pánico regional que históricamente ha afectado al sol peruano en momentos de crisis porteña.

El proyectado descenso de la inflación argentina hacia un dígito en 2028 —si se cumple— representará el menor riesgo de contagio regional desde 2010. Para empresas peruanas con clientes o proveedores en Argentina, el tipo de cambio oficial de ARS 1,430 y la brecha mínima del 3.8% ofrecen hoy más predictibilidad que en los últimos tres años, aunque la devaluación mensual del 1% debe incorporarse en los precios de contratos de mediano plazo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15574935/pexels-photo-15574935.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n014',
    titulo: 'Colombia: peso se fortalece a COP 3,642 por dólar ante debilidad global del USD — Banrep mantiene tasa en 5.25% con inflación en servicios en 7.8%',
    descripcion: 'El peso colombiano cotiza en COP 3,642 por dólar, apreciándose frente al mínimo reciente de COP 3,780 de mediados de mayo. El Banco de la República mantiene su tasa de intervención en 5.25%, pausando el ciclo de recortes iniciado en 2024. La inflación general cayó a 4.9% anual pero la inflación en servicios se mantiene en 7.8%, dificultando la decisión de recortar.',
    contenido: `El peso colombiano (COP) cotiza en COP 3,642 por dólar al cierre del martes 27 de mayo, apreciándose 3.7% desde el nivel reciente de COP 3,780 del 19 de mayo. El fortalecimiento del COP responde principalmente a la debilidad global del dólar (DXY en 99.28) y al aumento de los flujos de cartera hacia mercados emergentes latinoamericanos favorecidos por el diferencial de tasas con EE.UU. El Banco de Colombia se ha consolidado como una de las instituciones con mayor diferencial de tasas nominales (5.25%) frente a la Fed (3.50%-3.75%) en la región.

El Banco de la República (Banrep) decidió en su última reunión mantener la tasa de intervención en 5.25%, pausando el ciclo de recortes que había iniciado en diciembre de 2024 (cuando la tasa era del 9.25%). La decisión refleja la persistencia de la inflación en servicios: mientras la inflación de bienes cayó a 1.8% anual gracias al fortalecimiento del peso y la caída de los precios de importación, la inflación de servicios se mantiene en 7.8%, tres veces por encima de la meta del 3%, impulsada por arriendos, educación y servicios de salud.

La economía colombiana proyecta un crecimiento del 2.8% para 2026, apoyada en la recuperación del consumo privado y la inversión privada, aunque el sector de hidrocarburos —pilar histórico de los ingresos fiscales— enfrenta un horizonte incierto por el plan de transición energética del gobierno de Gustavo Petro, que restringe nuevas licencias de exploración. Las exportaciones de petróleo y gas representan el 47% de los ingresos de divisas del país.

El peso colombiano acumula una apreciación del 5.2% frente al dólar en lo corrido del año (desde COP 3,845 de inicio de enero hasta COP 3,642 actual), siendo la séptima divisa emergente con mejor desempeño en el mundo en 2026, según el ranking de Bloomberg. Sin embargo, la incertidumbre política del segundo semestre y las presiones sobre Ecopetrol (cuya producción cayó 4.2% en Q1) añaden riesgos a la fortaleza del COP.`,
    analisis: `El peso colombiano en COP 3,642 y el sol peruano en S/ 3.64 tienen en común que ambos se benefician de la debilidad global del DXY, pero sus fundamentos domésticos divergen: Perú tiene superávit comercial y BCRP independiente; Colombia tiene déficit fiscal amplio y presiones políticas sobre el Banrep. Esta divergencia explica por qué el sol ha tenido una trayectoria de apreciación más sostenida que el COP en los últimos doce meses.

Para importadores peruanos que compran a proveedores colombianos o para empresas con operaciones binacionales, la paridad COP/PEN es relevante: un COP más fuerte encarece los productos colombianos en soles. Monitorear si el Banrep retoma los recortes de tasa (lo que debilitaría el COP) o los pausa indefinidamente (lo que sostendría la fortaleza del COP) es clave para planificar las importaciones del Q3 2026.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-28T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13795638/pexels-photo-13795638.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'n015',
    titulo: 'Chile: PIB del Q1 2026 crece 3.8% — cobre en US$ 5.12/lb y DXY débil aprecian el peso a CLP 895; BCCh recorta tasa a 3.75%',
    descripcion: 'El Banco Central de Chile informó que el PIB creció 3.8% anual en el Q1 2026, el mejor registro en tres años, impulsado por la minería del cobre (+9.4%). El peso chileno se aprecia a CLP 895 por dólar, su nivel más fuerte desde febrero de 2023. El BCCh redujo su Tasa de Política Monetaria en 25 pb hasta 3.75% en su reunión de mayo, señalando un recorte más en el segundo semestre.',
    contenido: `El Banco Central de Chile (BCCh) publicó los datos definitivos del Producto Interno Bruto del primer trimestre de 2026, mostrando un crecimiento anual del 3.8%, por encima de la estimación flash del 3.7% y del consenso de analistas de 3.1%. Es el mejor registro trimestral para la economía chilena desde el Q3 2023, consolidando la recuperación iniciada en el segundo semestre de 2025 tras dos años de bajo dinamismo.

La minería del cobre fue el principal motor con un crecimiento del 9.4%, beneficiada por la recuperación de los volúmenes de producción de Codelco tras los problemas geológicos de la División Teniente en 2025, y por el precio del cobre en máximos históricos de US$ 5.18/lb que registró la semana pasada (hoy cede levemente a US$ 5.12/lb). Los servicios empresariales crecieron 4.7%, la manufactura 4.1% y la construcción 3.8%. El consumo privado se expandió 3.2%, favorecido por el mercado laboral que creó 38,000 empleos formales en el trimestre.

El BCCh decidió reducir su Tasa de Política Monetaria (TPM) en 25 puntos básicos hasta 3.75% en su reunión de mayo, el cuarto recorte del ciclo iniciado en febrero de 2025. La decisión fue tomada por unanimidad, con el comunicado señalando que "la inflación convergió al rango meta del 2%-4%", con el IPC de abril en 3.4% anual. El BCCh señalizó uno o dos recortes adicionales para el segundo semestre, lo que llevaría la TPM a 3.25%-3.50% hacia fin de año.

El peso chileno (CLP) se aprecia a CLP 895 por dólar, su nivel más fuerte desde el 17 de febrero de 2023. El movimiento de 1.8% en la semana sincroniza con la apreciación del sol peruano, del real brasileño y del peso colombiano, configurando un rally de divisas latinoamericanas ante el DXY débil y el cobre alto. La correlación histórica del CLP con el precio del cobre continúa siendo la más alta de cualquier divisa global con una materia prima (R² de 0.78 en regresión mensual).`,
    analisis: `Chile y Perú se benefician del mismo viento de cola estructural (cobre alto + DXY débil) y exhiben patrones de apreciación cambiaria similares. La diferencia es que Chile tiene además el beneficio de un ciclo de recortes de tasas más avanzado (BCCh en 3.75% vs BCRP en 4.75%), lo que estimula más el crédito doméstico y el consumo. Este mayor estímulo monetario puede acelerar el crecimiento chileno en el segundo semestre pero también generar más presiones inflacionarias de demanda.

Para empresas que operan en ambos países o que compiten con productos chilenos, la paridad CLP/PEN es relevante: hoy ambas monedas están apreciadas frente al dólar pero el CLP ha tenido movimientos más volátiles. La planificación de precios para contratos que cruzan la frontera chileno-peruana debe incorporar rangos de volatilidad del 5-8% en el cruce para el Q3 2026.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-28T08:00:00.000Z',
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
