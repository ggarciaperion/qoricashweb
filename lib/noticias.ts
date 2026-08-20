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
const HOY = '2026-08-20T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
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
    fecha: '${HOY_NEW}',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },,
  {
    id: 'h001',
    titulo: 'IPP de julio en EE.UU. no muestra variación mensual: doble señal desinflacionaria consolida pausa de la Fed en septiembre',
    descripcion: 'El Índice de Precios al Producción de julio resultó en 0% mensual (bajo expectativas de +0.2%) y 4.7% anual. Tras el IPC alineado del martes, el mercado eleva la probabilidad de pausa de la Fed al 80% para septiembre.',
    contenido: `El Índice de Precios al Productor (IPP) de Estados Unidos correspondiente a julio de 2026 fue publicado este miércoles 13 de agosto y sorprendió gratamente al mercado: la variación mensual fue de 0.0%, muy por debajo del consenso de analistas que esperaba un incremento de 0.2%. En términos anuales, el IPP creció 4.7%, también inferior a las proyecciones de 4.9%. El dato de inflación de productores llegó un día después de que el IPC de julio resultara alineado en 3.4% anual, completando una semana de datos que confirma la tendencia desinflacionaria en EE.UU.

El desglose por componentes refuerza la señal positiva: los precios de los bienes al productor cayeron 0.7% mensual —el mayor descenso desde noviembre de 2025—, mientras que los servicios subieron apenas 0.2%. El IPP núcleo (excluye alimentos y energía) creció 0.2% mensual, también por debajo de lo esperado. Estas señales sugieren que las presiones inflacionarias en la cadena de suministro siguen moderándose, lo que es un adelanto de que la inflación al consumidor (IPC) continuará descendiendo en los próximos meses. El dólar extendió su caída: el DXY opera en 99.63, mínimo desde febrero de 2026.

Con el IPC del martes y el IPP del miércoles ya publicados, los operadores de futuros del Fed Funds Rate ajustaron sus probabilidades el jueves y viernes: la pausa de septiembre sube al 80%, desde el 74% tras el IPC. El mercado reduce aún más las apuestas por una subida de tasas —que cae virtualmente a cero— y empieza a descontar con mayor fuerza el primer recorte en noviembre o diciembre de 2026. Los bonos del Tesoro se fortalecieron, los rendimientos cayeron y el S&P 500 alcanzó nuevos máximos históricos en la sesión del viernes 14 de agosto.`,
    analisis: `Un IPP en 0% mensual es la mejor señal posible para los mercados: indica que las empresas no están trasladando costos más altos a sus precios de venta, lo que reduce la probabilidad de que el IPC repunte en los próximos meses. Para la Fed, este dato cierra prácticamente el debate de septiembre: la pausa está asegurada.

Para el sol peruano, un dólar global más débil (DXY bajo 100) es directamente favorable. Cada punto de caída del DXY históricamente correlaciona con una apreciación de S/ 0.02–0.03 en el PEN. El USD/PEN en S/ 3.37 podría continuar apreciándose hacia S/ 3.33–3.35 si el DXY confirma la ruptura bajista de los niveles actuales. Para importadores, el rango S/ 3.36–3.37 del día es una ventana históricamente favorable para cubrir necesidades de corto plazo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/6534073/pexels-photo-6534073.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'BCRP confirmó tasa en 4.25% y el sol cierra la semana en S/ 3.37: el banco central cierra la puerta a recortes hasta noviembre',
    descripcion: 'El directorio del BCRP mantuvo ayer la tasa de referencia en 4.25% y señaló que el riesgo inflacionario de Ormuz justifica prudencia. Hoy viernes 14 de agosto el USD/PEN opera en S/ 3.37 con dólar global en mínimos desde febrero.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) decidió el jueves 13 de agosto mantener su tasa de referencia en 4.25%, en línea con el consenso del mercado. El comunicado posterior a la reunión señaló que la inflación local se mantiene dentro del rango meta (2.4% anual en julio), pero que el alza del petróleo Brent —impulsada por la crisis del Estrecho de Ormuz— representa un riesgo inflacionario de segunda ronda que justifica la prudencia monetaria actual. El BCRP descartó implícitamente un recorte antes de que el panorama energético global se estabilice, lo que desplaza las expectativas de la primera baja hacia noviembre o diciembre de 2026.

El tipo de cambio USD/PEN reaccionó con orden a la decisión: el sol opera este viernes 14 de agosto en S/ 3.37 en el mercado interbancario de Lima (compra S/ 3.355, venta S/ 3.370 en el mercado paralelo), prácticamente sin movimiento frente al nivel previo a la reunión del BCRP. El DXY continúa en 99.63 puntos, su nivel más bajo desde febrero de 2026, lo que le da al sol un soporte externo considerable. El BCRP no ha intervenido en el mercado cambiario durante la semana, señal de que el movimiento del PEN es ordenado y respaldado por flujos reales de la economía exportadora.

El cobre se mantiene en US$ 4.72/libra, sosteniendo las liquidaciones programadas de las empresas mineras que cubren planillas y compromisos en soles. Este flujo estructural de venta de dólares por parte de los exportadores actúa como ancla natural del tipo de cambio, impidiendo que el billete verde recupere terreno incluso en un contexto de mayor incertidumbre geopolítica. El mercado espera que el sol consolide dentro del rango S/ 3.35–3.40 durante el tercer trimestre, salvo una escalada severa en el conflicto iraní.`,
    analisis: `Una pausa del BCRP con comunicado prudente respecto al petróleo confirma que el banco central no tiene prisa por recortar tasas. El diferencial de tasas Perú (4.25%) vs. Fed (5.25–5.50%) se mantiene, reduciendo el riesgo de salida de capitales y brindando soporte al sol. El PEN es una de las monedas emergentes con mejor desempeño en lo que va de agosto, apreciándose 0.6% frente al dólar en la semana.

Para importadores, el rango S/ 3.36–3.37 de este viernes es históricamente competitivo. Para exportadores, vender dólares en el nivel actual es razonable: el sol difícilmente se apreciará mucho más si el BCRP mantiene su sesgo prudente y el petróleo permanece elevado.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/16640810/pexels-photo-16640810.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'S&P 500 toca nuevo máximo histórico y cierra su tercera semana consecutiva de ganancias: Reddit entra al índice el lunes',
    descripcion: 'El S&P 500 subió 0.08% el viernes 14 de agosto y marcó un récord histórico de cierre, acumulando su tercer semana ganadora consecutiva —la racha más larga desde mayo. Reddit subirá al S&P 500 el próximo lunes 18 de agosto.',
    contenido: `El S&P 500 registró este viernes 14 de agosto su tercer máximo histórico de cierre en lo que va de agosto, con un avance de 0.08% en la jornada. El Nasdaq Composite subió 0.17% y el Russell 2000 avanzó 0.24%, aunque el Dow Jones retrocedió levemente (-0.13%). Los tres grandes índices de Wall Street completan así su tercera semana consecutiva de ganancias, la racha positiva más prolongada desde mayo de 2026. El catalizador del rally semanal fue doble: los datos de inflación (IPC el martes, IPP el miércoles) confirmaron la tendencia desinflacionaria en EE.UU. y reforzaron el consenso de que la Fed pausará en septiembre.

La noticia corporativa del día fue el anuncio de que Reddit (RDDT) ingresará al índice S&P 500 antes de la apertura del lunes 18 de agosto. Las acciones de la plataforma de discusión en línea se dispararon 10.4% en la jornada, su mayor avance desde su IPO. La inclusión en el S&P 500 obliga a los fondos indexados a comprar acciones de Reddit, generando una demanda técnica que habitualmente produce alzas adicionales en los días previos y posteriores al ingreso efectivo. El anuncio también indica que la empresa ha cumplido los requisitos de capitalización y rentabilidad que exige el índice, una señal de madurez corporativa.

En el resto del mercado, el VIX —índice de volatilidad del S&P 500— opera en 15.1 puntos, el nivel más bajo en cuatro semanas, reflejo de que los inversores redujeron la compra de coberturas ante el escenario macro más ordenado. El oro avanzó 0.3% hasta US$ 4,349/oz, apoyado por el dólar débil. Los bonos del Tesoro a 10 años rinden 4.12%, por debajo del 4.25% de hace dos semanas, señal de que el mercado descuenta un entorno de tasas más bajas en el horizonte de 12 meses.`,
    analisis: `Un S&P 500 en máximos históricos con baja volatilidad y dólar debilitándose es el entorno más propicio para que los flujos de capital se dirijan hacia mercados emergentes, incluyendo Perú. La Bolsa de Valores de Lima (BVL), impulsada por el sector minero, podría recibir flujos adicionales de inversores internacionales que buscan retornos superiores en economías con buenos fundamentales.

Para el tipo de cambio, el escenario risk-on global —apetito por activos de mayor rendimiento— es favorable al sol. Las monedas de mercados emergentes con fundamentales sólidos como Perú tienden a apreciarse cuando el S&P 500 está en máximos y el VIX es bajo. El S/ 3.37 actual tiene sesgo a la baja si este entorno benigno se mantiene durante el resto de agosto.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831251/pexels-photo-5831251.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'Perú y México reanudan relaciones diplomáticas: canciller anuncia designación de embajadores y proceso gradual de visas',
    descripcion: 'El gobierno de la presidenta Fujimori formalizó el restablecimiento de vínculos con México tras tres años de distanciamiento. El canciller descartó una apertura inmediata de visas y anticipó negociaciones en los próximos 60 días.',
    contenido: `Perú y México anunciaron el restablecimiento oficial de sus relaciones diplomáticas este martes, poniendo fin a un período de distanciamiento que se había extendido por más de tres años. El canciller peruano precisó que el proceso de normalización comenzará con la designación de nuevos embajadores en los próximos 30 días, seguida de la reapertura de las embajadas en Lima y Ciudad de México, que permanecían cerradas desde 2023. El anuncio fue recibido positivamente por el sector empresarial de ambos países, que había señalado repetidamente las consecuencias negativas del distanciamiento sobre el comercio bilateral, especialmente en los sectores agroindustrial y turístico.

El Gobierno de la presidenta Keiko Fujimori tomó la decisión en el contexto de un reordenamiento de la política exterior peruana, que en los últimos meses también ha buscado ampliar los vínculos con otros países de América Latina y el Caribe. La normalización con México fue considerada políticamente posible luego del cambio de administración en el país azteca, que facilitó un diálogo sin las tensiones ideológicas de los últimos años. México expresó su disposición a retomar la relación bilateral "desde una nueva base de respeto mutuo y no intervención en asuntos internos".

El punto más sensible sigue siendo el régimen de visas. El Perú impuso la visa a ciudadanos mexicanos en 2023 como parte de la ruptura diplomática. El canciller aclaró que su eliminación "no es automática" y requiere de un proceso técnico-legal de al menos 60 a 90 días. Entretanto, se estudiarán mecanismos de facilitación migratoria para hombres de negocios y turistas de alto valor, que han sido los más afectados por la restricción. El comercio bilateral entre ambos países cayó un 18% durante el período de ruptura y se espera que se recupere gradualmente con la normalización.`,
    analisis: `La normalización diplomática con México no tiene un impacto directo e inmediato en el tipo de cambio PEN/USD, pero contribuye a mejorar el clima general de negocios e inversión en el Perú. Un entorno de política exterior más estable y predecible tiende a ser percibido positivamente por los mercados internacionales, lo que a mediano plazo puede reforzar la estabilidad del sol.

Para empresas peruanas con operaciones o proveedores en México, la normalización abre la puerta a retomar acuerdos comerciales pausados y simplificar trámites consulares y de certificación de documentos. Es una señal positiva para el largo plazo que no impacta el tipo de cambio del día a día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32163606/pexels-photo-32163606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'Kia proyecta superar 24,000 unidades vendidas en Perú en 2026 y apunta al 10% del mercado automotor con SUVs híbridos',
    descripcion: 'La automotriz coreana busca crecer un 42–45% en el mercado peruano apoyada en nuevos lanzamientos y en el impulso de la electromovilidad. El Sportage Hybrid lidera con más de 4,200 unidades vendidas en el primer semestre.',
    contenido: `Kia Perú anunció que proyecta cerrar 2026 con más de 24,000 unidades vendidas, lo que representaría un crecimiento del 42–45% frente a los 16,900 vehículos comercializados en 2025. De alcanzarse el objetivo, la marca coreana pasaría a capturar el 10% del mercado automotor peruano, desde el 7.8% actual, consolidándose como la cuarta marca más vendida del país. La estrategia combina cuatro nuevos lanzamientos durante el año, una ampliación de la red de concesionarios hacia regiones del interior, y un fuerte impulso a los modelos híbridos, que ya representan el 28% de las ventas de la marca.

El Sportage Hybrid se ha convertido en el modelo estrella de Kia en Perú, con más de 4,200 unidades vendidas en el primer semestre de 2026, el mejor resultado de su historia en el país. El modelo combina motor de gasolina con sistema híbrido de 48V, ofreciendo un consumo de 17.5 km/litro en ciclo mixto, muy superior al promedio de los SUVs convencionales en el segmento (12.3 km/litro). El precio de venta parte desde S/ 109,900 en su versión de entrada, competitivo frente a sus rivales japoneses en el mismo segmento de mercado.

La apuesta por los híbridos responde a un cambio en las preferencias del consumidor peruano: la encuesta de intención de compra de la Asociación Automotriz del Perú (AAP) de julio muestra que el 41% de los compradores potenciales de vehículos nuevos priorizaría un modelo híbrido o eléctrico si el precio fuera comparable al de los convencionales. La ampliación de la red de concesionarios hacia Arequipa, Trujillo, Piura y Cusco también forma parte del plan: las ciudades fuera de Lima ya representan el 38% de las ventas de Kia y la empresa espera llevarlas al 45% para 2027.`,
    analisis: `El crecimiento del mercado automotor peruano —impulsado por el financiamiento en soles y el acceso a crédito vehicular— es un indicador positivo del dinamismo del consumo interno. Un sector automotor activo implica importaciones de vehículos en dólares, lo que genera una demanda estructural de divisas; no obstante, el volumen involucrado no es suficientemente grande como para mover el tipo de cambio de manera significativa por sí solo.

Para los clientes de QoriCash que trabajan en la cadena de valor automotriz —importadores de repuestos, concesionarios que pagan a proveedores en el exterior—, el tipo de cambio actual de S/ 3.3650 representa una oportunidad para presupuestar pagos en dólares a un costo relativamente bajo en los últimos meses.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/9300916/pexels-photo-9300916.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'Las utilidades 2026 activan el consumo interno: ventas de autos, vivienda y electrodomésticos se aceleran en el tercer trimestre',
    descripcion: 'El pago de utilidades en minería, finanzas y manufactura ha liberado liquidez extraordinaria que los trabajadores peruanos canalizan principalmente a compra de vehículos, inmuebles y electrónica de alto valor.',
    contenido: `El pago de utilidades a los trabajadores de las empresas más rentables del Perú —principalmente del sector minero, financiero, telecomunicaciones y manufactura— está dinamizando el consumo del tercer trimestre de forma visible. Las concesionarias de automóviles reportan que julio y agosto son los meses de mayor demanda del año, impulsados por esta liquidez extraordinaria que los trabajadores reciben entre junio y agosto como distribución de las utilidades del ejercicio 2025.

El sector inmobiliario también siente el impacto: las ventas de departamentos en Lima Metropolitana crecieron 18% en julio respecto al mismo mes del año anterior, según cifras de la Cámara Peruana de la Construcción (CAPECO). Las zonas de mayor dinamismo son Los Olivos, San Juan de Lurigancho, Chorrillos y el cono sur, donde el precio promedio por metro cuadrado oscila entre S/ 4,200 y S/ 5,800. Los bancos reportan un incremento del 22% en la aprobación de créditos hipotecarios durante el trimestre, con plazos más largos y tasas que reflejan la estabilidad macroeconómica actual.

Los grandes retailers también muestran ventas extraordinarias: Saga Falabella, Ripley y Oechsle reportan que sus ventas de televisores, laptops, smartphones y electrodomésticos de línea blanca crecieron entre 25% y 35% en julio frente al mismo mes de 2025. El ticket promedio de compra con tarjeta de crédito bancaria creció 12% en términos reales en julio, el mayor crecimiento mensual desde 2023. El sector retail estima que el pico de ventas impulsado por utilidades durará hasta mediados de septiembre.`,
    analisis: `El dinamismo del consumo interno refuerza las perspectivas de crecimiento del PBI peruano para 2026, que el BCRP proyecta en 3.4%. Un consumo privado activo es señal de que los salarios reales están creciendo y de que la confianza del consumidor se mantiene elevada, lo que a su vez atrae más inversión privada en retail, inmobiliario y servicios.

Para el tipo de cambio, el mayor consumo de bienes importados —autos, electrodomésticos, tecnología— genera una demanda de dólares que modera la apreciación del sol. Sin embargo, dado el sólido nivel de reservas del BCRP y los flujos exportadores, el impacto es manejable y el PEN debería mantenerse dentro del rango S/ 3.35–3.40 durante el tercer trimestre.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/9800030/pexels-photo-9800030.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Trump confirma que cambió de avión en la cumbre de la OTAN por una amenaza de seguridad vinculada a Irán',
    descripcion: 'El presidente de EE.UU. realizó un traslado encubierto a otra aeronave durante la cumbre sin que los medios ni el personal de la Casa Blanca lo supieran. El incidente eleva la tensión del conflicto iraní a un nuevo nivel.',
    contenido: `El presidente de Estados Unidos, Donald Trump, confirmó el martes que cambió de avión durante su participación en la cumbre de la OTAN por una amenaza de seguridad que las autoridades vincularon a Irán. La maniobra, descrita por fuentes de la Casa Blanca como un protocolo de precaución, se realizó de forma encubierta: los periodistas y el personal que viajaban en el Air Force One oficial no sabían que Trump ya no estaba a bordo hasta después de que aterrizó en otro aeródromo. El incidente fue calificado por analistas de inteligencia como el episodio de seguridad más inusual de la presidencia Trump desde el inicio del conflicto con Irán.

El contexto del incidente es la escalada de tensiones en el Estrecho de Ormuz, que se ha intensificado durante los últimos dos meses. Las fuerzas iraníes han interrumpido parcialmente el tráfico de buques petroleros en la zona, generando una prima de riesgo que ha elevado el precio del crudo Brent a US$ 89/barril, un incremento del 6% en las últimas dos semanas. La amenaza directa sobre la aeronave presidencial representa un salto cualitativo en la confrontación, que hasta ahora se había limitado al ámbito naval y de las exportaciones de petróleo.

Los mercados reaccionaron con cautela al conocerse los detalles del incidente. El oro —activo refugio en escenarios de geopolítica extrema— cotiza en US$ 4,349/oz, con un avance de 0.3% en la jornada del viernes 14 de agosto. El índice de volatilidad implícita del petróleo WTI subió 8 puntos, reflejando la preocupación de los operadores sobre la posibilidad de una escalada militar que corte el suministro del Golfo Pérsico. El dólar, por su parte, mostró presiones mixtas: la debilidad por los datos de inflación compensó parcialmente el alza por la demanda de refugio.`,
    analisis: `Una escalada militar entre EE.UU. e Irán sería el escenario de mayor impacto para el mercado cambiario peruano. El canal de transmisión sería dual: primero, el alza del petróleo que encarece los combustibles y presiona la inflación local; segundo, una fuga hacia activos refugio que apreciaría el dólar frente al sol. En un escenario de conflicto abierto, el tipo de cambio podría escalar desde los S/ 3.37 actuales hasta S/ 3.50–3.55 rápidamente.

Para empresas con exposición a dólares en el corto plazo, la prudencia aconseja no depender de que el sol siga apreciándose indefinidamente. La prima de riesgo geopolítica justifica mantener parte de la cobertura de importaciones con compras anticipadas de dólares dentro del rango actual.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29253512/pexels-photo-29253512.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'El conflicto con Irán podría frenar el crecimiento del Reino Unido en 2027, advierte el gobierno de Burnham',
    descripcion: 'El primer ministro británico, en funciones desde hace tres semanas, reconoció que las medidas de apoyo al costo de vida actuales son insuficientes y anticipó nuevas ayudas ante el alza del petróleo por la crisis de Ormuz.',
    contenido: `El primer ministro del Reino Unido, Andy Burnham, advirtió este martes que el conflicto entre Estados Unidos e Irán en el Estrecho de Ormuz representa el principal riesgo externo para el crecimiento económico británico en 2027. En declaraciones ante el Parlamento, Burnham señaló que "la interrupción de los flujos de petróleo del Golfo ya está generando presiones en los precios de la energía que llegarán a los hogares británicos en los próximos meses", y anticipó que el gobierno evalúa nuevas medidas de apoyo al costo de vida más allá de las ya anunciadas la semana pasada.

El Reino Unido importa el 30% de su petróleo del Golfo Pérsico y mantiene importantes vínculos comerciales con países de Oriente Medio. La escalada del Brent a US$ 89/barril —un 6% más que hace dos semanas— ya se está trasladando a los precios del combustible en las estaciones de servicio británicas, que registraron un incremento promedio de 4.8 peniques por litro en las últimas dos semanas. El Banco de Inglaterra había reducido su tasa de referencia en junio anticipando una desaceleración de la inflación, decisión que ahora podría ser revisada si el shock energético resulta persistente más allá del verano europeo.

El gobierno de Burnham lleva apenas tres semanas en el cargo tras ganar las elecciones de julio, y ya enfrenta un entorno económico más complicado de lo esperado. Además del riesgo iraní, el Reino Unido lidia con cadenas de suministro interrumpidas que están generando escasez en algunos productos agrícolas y encareciendo los vegetales provenientes de zonas afectadas por olas de calor. El Banco de Inglaterra celebrará su próxima reunión de política monetaria el 4 de septiembre, donde deberá equilibrar el riesgo inflacionario del petróleo contra la necesidad de sostener el crecimiento.`,
    analisis: `La situación económica del Reino Unido tiene implicaciones indirectas para Perú a través de dos canales: el precio del petróleo (que afecta la inflación local y el costo de los combustibles importados) y los flujos de inversión extranjera de portafolio. Una economía británica más débil tiende a reducir los flujos de inversión hacia mercados emergentes, lo que puede generar mayor demanda de dólares y presionar el tipo de cambio al alza.

Para el mercado peruano, el principal riesgo a monitorear es el precio del Brent: si la crisis de Ormuz lleva el crudo por encima de US$ 95–100/barril de forma sostenida, la inflación importada podría complicar la estrategia del BCRP y retrasar los recortes de tasa esperados para el cuarto trimestre de 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/635611/pexels-photo-635611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'Muere Zhu Rongji, el reformador chino que llevó a su país a la OMC y transformó el comercio global, a los 97 años',
    descripcion: 'El exprimer ministro de China —que gobernó entre 1998 y 2003— dejó un legado de reformas que convirtieron al gigante asiático en la segunda economía del mundo y en el principal destino de las exportaciones peruanas de cobre.',
    contenido: `Zhu Rongji, el exprimer ministro de China considerado el arquitecto de la transformación económica del gigante asiático, falleció este martes a los 97 años según informó el Gobierno de Beijing. Su muerte marcó el fin de una era: Zhu fue el funcionario que negoció el ingreso de China a la Organización Mundial del Comercio (OMC) en 2001, abrió el país a la inversión extranjera directa a gran escala, y ejecutó la privatización y reestructuración de las empresas estatales que habían acumulado décadas de ineficiencia bajo el modelo soviético. Durante su mandato, la economía china creció a una tasa anual promedio del 8.6% y las exportaciones del país se multiplicaron por cuatro.

La política de apertura de Zhu transformó las cadenas de valor globales: China se convirtió en la "fábrica del mundo", importando masivamente materias primas de países como Perú —cobre, oro, zinc, harina de pescado— y exportando manufacturas a precios que desafiaban a la industria local de cualquier nación. Esta transformación estuvo en el origen del superciclo de materias primas de los años 2000-2011, que benefició enormemente a la economía peruana: las exportaciones mineras peruanas se multiplicaron por diez en ese período y las reservas internacionales pasaron de US$ 8,000 millones a más de US$ 60,000 millones.

El legado de Zhu es ambivalente: sus reformas sacaron a cientos de millones de chinos de la pobreza y generaron el mayor proceso de urbanización e industrialización de la historia, pero también provocaron disrupciones en industrias manufactureras de países desarrollados y en desarrollo. Para el Perú, China es hoy el principal destino de sus exportaciones, concentrando el 35% del total, principalmente cobre, hierro y zinc. La dependencia de China como motor de la demanda de materias primas peruanas es, en buena medida, el legado directo de las decisiones que Zhu tomó hace 25 años.`,
    analisis: `La muerte de Zhu Rongji no tiene impacto inmediato en los mercados, pero es un momento para reflexionar sobre la dependencia estructural de la economía peruana respecto de China. Hoy, el 35% de las exportaciones peruanas tienen a China como destino. Una eventual desaceleración china —por factores políticos o económicos internos— tendría consecuencias directas sobre los precios del cobre y los ingresos de divisas del Perú.

Para el tipo de cambio, una China fuerte y en expansión es el entorno más favorable para el PEN, porque sostiene los precios del cobre y genera la oferta de dólares exportadora que ancla el sol. Monitorear los datos de producción industrial y PMI chinos es tan importante para el tipo de cambio peruano como los anuncios de la Fed.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17582329/pexels-photo-17582329.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'El Índice del Dólar forma bandera bajista por debajo de 100 puntos y pone a prueba el soporte en 99.63',
    descripcion: 'El DXY extiende su corrección tras el IPC de julio y consolida una figura técnica bajista que, de confirmarse, proyecta una caída hacia 97–98 puntos, lo que presionaría al sol hacia S/ 3.33–3.35.',
    contenido: `El Índice del Dólar (DXY), que mide la fortaleza del billete verde frente a una canasta de seis divisas principales —euro, yen, libra esterlina, dólar canadiense, corona sueca y franco suizo—, opera en torno a los 99.63 puntos en la sesión del viernes 14 de agosto (-0.22% en el día), su nivel más bajo desde febrero de 2026. El análisis técnico identifica una formación de bandera bajista clásica: el DXY hizo un techo en 103.4 puntos el 28 de julio, luego de lo cual viene consolidando en un canal de leve corrección alcista que en el análisis chartista es considerado una pausa antes de continuar la tendencia bajista de fondo.

La confirmación de la figura técnica bajista ocurriría si el DXY rompe el soporte inmediato en 99.50–99.63 con volumen. De producirse esa ruptura, el objetivo proyectado de la bandera bajista apunta hacia la zona de 97–98 puntos, nivel que no se ha visto desde principios de 2025. El catalizador para ese movimiento podría ser una señal explícita de la Fed de que el ciclo de subidas de tasas ha terminado definitivamente, o datos económicos de EE.UU. que muestren un enfriamiento más pronunciado de lo esperado.

Los fundamentales respaldan la tendencia: la inflación en EE.UU. sigue moderándose, el mercado laboral muestra señales de enfriamiento gradual, y los mercados de otras regiones —especialmente la eurozona y Asia emergente— están generando retornos más atractivos en términos ajustados por riesgo, lo que reduce el diferencial de flujos que había sostenido al dólar en niveles elevados durante 2024–2025. El euro/dólar opera en 1.1015, el nivel más alto del año, lo que evidencia la rotación de flujos fuera del billete verde.`,
    analisis: `Un DXY hacia los 97–98 puntos sería altamente favorable para el sol peruano. La correlación histórica entre el DXY y el PEN/USD indica que cada caída de 1 punto en el DXY tiende a correlacionar con una apreciación del sol de aproximadamente S/ 0.02–0.03. Si el DXY cae 2 puntos desde los niveles actuales (99.63), el sol podría fortalecerse hacia S/ 3.32–3.34.

Para importadores, este escenario sugiere aprovechar el rango actual (S/ 3.365) para satisfacer necesidades de corto plazo, sin asumir que el dólar estará mucho más barato en semanas. Para exportadores, la tendencia bajista del DXY es una buena señal estructural: vender dólares en el mediano plazo podría hacerse en condiciones cada vez más favorables al sol.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'EE.UU. registra un déficit fiscal de US$ 432,000 millones en julio: el mayor en la historia para ese mes y el doble del año pasado',
    descripcion: 'El Tesoro de EE.UU. reportó un déficit récord de US$ 432,300 millones en julio de 2026, impulsado por gastos de US$ 766,000 millones y aranceles negativos de -US$ 8,550 millones tras las devoluciones por fallo de la Corte Suprema.',
    contenido: `El Tesoro de Estados Unidos publicó el miércoles los datos fiscales de julio de 2026, revelando un déficit mensual de US$ 432,300 millones, el mayor registrado para cualquier julio en la historia de la nación. El dato representa un incremento del 48% frente al déficit de julio de 2025 (US$ 291,000 millones) y amplió el déficit acumulado del año fiscal 2026 (octubre 2025 – septiembre 2026) a US$ 1.799 billones, superando ya el déficit anual total del año fiscal 2025 (US$ 1.775 billones) con dos meses aún por cierre.

El principal motor del déficit fue el gasto: los desembolsos del gobierno en julio alcanzaron US$ 766,000 millones, un 22% más que en julio de 2025, estableciendo un nuevo récord mensual. Entre los mayores gastos figuran los intereses de la deuda federal (que superan los US$ 1 billón anualizados), los programas de seguridad social y Medicare, y los pagos de defensa asociados a las operaciones militares en el Estrecho de Ormuz. Del lado de los ingresos, los aranceles aduaneros generaron una entrada negativa de -US$ 8,550 millones en el mes: el gobierno pagó US$ 33,380 millones en devoluciones de aranceles como resultado del fallo de la Corte Suprema que invalidó los aranceles de emergencia que el presidente Trump había impuesto bajo la Ley de Poderes Económicos de Emergencia Internacional (IEEPA).

El déficit acumulado de US$ 1.799 billones en los primeros 10 meses del año fiscal coloca al gobierno federal en camino de superar los US$ 2 billones en el año fiscal completo, lo que sería un nuevo récord histórico en términos nominales. Los mercados de bonos recibieron la noticia con moderación: los rendimientos del Tesoro a 10 años subieron apenas 3 puntos básicos, señal de que los inversores ya tienen descontados los altos niveles de emisión de deuda.`,
    analisis: `Un déficit fiscal récord en EE.UU. tiene implicancias de largo plazo para el dólar: más deuda significa más emisión de bonos del Tesoro, lo que presiona los rendimientos al alza y puede generar tensiones en el sistema financiero global. Sin embargo, a corto plazo el mercado está absorbiendo esta información sin pánico, dado que el dólar ya opera en mínimos multianuales por razones monetarias (expectativa de pausa de la Fed).

Para el sol peruano, la debilidad estructural del dólar por motivos fiscales es una tendencia favorable en el mediano plazo. Un dólar más débil globalmente significa que el PEN necesita menos presión compradora para mantenerse apreciado. El riesgo es que una eventual crisis de confianza en los bonos del Tesoro genere el efecto contrario: una fuga hacia el dólar como activo refugio extremo, lo que apreciaría al billete verde y presionaría al sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'Futuros de tasas elevan al 80% la pausa de la Fed en septiembre tras la semana de doble desinflación: IPC + IPP',
    descripcion: 'Con el IPC y el IPP de julio ya publicados —ambos debajo o en línea con expectativas—, el mercado cierra la semana con 80% de probabilidad de pausa de la Fed en septiembre y solo 20% apostando por un recorte anticipado.',
    contenido: `Los contratos de futuros del Fed Funds Rate cotizados en el CME Group cerraron la semana del 11–15 de agosto con un panorama de septiembre prácticamente sellado: la probabilidad implícita de una pausa de la Fed en su reunión del 17 de septiembre se ubica en 80%, su nivel más alto del año. El movimiento acumuló dos días de ajuste: el martes tras el IPC de julio (3.4% anual, en línea con el consenso), y el miércoles tras el IPP de julio (0.0% mensual, por debajo de las expectativas de +0.2%). La combinación de ambos datos completó la imagen de una economía en proceso ordenado de desinflación, sin presiones que justifiquen más subidas de tasas.

El 20% restante del mercado apuesta por un recorte de 25 puntos básicos directamente en septiembre, apostando a que la Fed podría anticiparse al ciclo de relajación monetaria ante el enfriamiento acelerado de los precios al productor. La probabilidad de una subida cayó virtualmente a cero. Para el cierre del año, los futuros descuentan la tasa de los fondos federales en el rango de 4.75–5.00%, lo que implica uno o dos recortes de 25 puntos básicos desde el nivel actual de 5.25–5.50%. Los rendimientos de los bonos del Tesoro a 2 años cayeron a 4.31% (desde 4.48% el lunes), mientras que el bono a 10 años rinde 4.12%.

Los miembros del FOMC entran el lunes 18 de agosto en el período de "blackout" previo a la reunión del 17 de septiembre, por lo que no habrá nuevas declaraciones oficiales hasta después de la decisión. El próximo dato relevante será el reporte de empleo de agosto (nóminas no agrícolas), a publicarse el viernes 5 de septiembre. Un mercado laboral que siga enfriándose gradualmente reforzaría la narrativa de pausa; una sorpresa negativa (pérdida de empleos) podría inclinar la balanza hacia un recorte anticipado.`,
    analisis: `Una probabilidad de pausa del 80% significa que el debate sobre septiembre está prácticamente cerrado. Lo que el mercado empieza a descubrir es cuándo y cuántos recortes habrá en 2026–2027. Cada nuevo dato de inflación o empleo que resulte moderado añade puntos base de reducción de rendimientos, lo que debilita el dólar y refuerza a las monedas emergentes.

Para el sol peruano, la tendencia de tasas más bajas en EE.UU. es estructuralmente positiva. El diferencial BCRP (4.25%) vs. Fed (5.25%) ya se percibe convergente; cuando la Fed recorte en noviembre o diciembre, ese diferencial se reducirá, pero los fundamentales del Perú (cobre, estabilidad macroeconómica) deberían sostener al sol dentro del rango S/ 3.33–3.38 para el cuarto trimestre.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6534073/pexels-photo-6534073.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina mantiene el tipo de cambio oficial estable en agosto, pero la inflación mensual del 3.8% mantiene alerta al mercado',
    descripcion: 'La economía argentina muestra señales mixtas: el dólar oficial se estabilizó gracias al acuerdo con el FMI, pero la inflación de julio (3.8%) supera la meta mensual del gobierno y el peso blue mantiene una brecha del 12%.',
    contenido: `La economía argentina atraviesa un período de estabilización con fragilidades latentes en agosto de 2026. El tipo de cambio oficial se mantiene en 1,120 pesos por dólar, dentro del esquema de crawling peg (devaluación gradual) acordado con el Fondo Monetario Internacional como condición del último programa de asistencia financiera. La brecha con el dólar blue —que cotiza en torno a los 1,250 pesos— se ha comprimido hasta el 12%, el nivel más bajo desde 2023 y una señal concreta de que la convergencia cambiaria que busca el gobierno está avanzando, aunque más lentamente de lo proyectado.

La inflación mensual de julio fue del 3.8%, por encima de la meta mensual del gobierno de 3.0%, aunque muy inferior al 25% mensual que se registraba a principios de 2024. La economía acumula doce meses consecutivos de desinflación, un logro que el mercado reconoce pero que aún no se traduce en una recuperación plena del poder adquisitivo: los sueldos reales siguen por debajo de los niveles de 2022 en términos ajustados por inflación. El consumo interno permanece deprimido, con el sector industrial operando al 68% de su capacidad instalada.

El Fondo Monetario Internacional revisó el programa argentino en julio y aprobó el desembolso del siguiente tramo por US$ 4,200 millones, condicionado al cumplimiento de las metas fiscales. El superávit primario acumulado en los primeros siete meses del año es de 0.8% del PBI, en línea con los compromisos asumidos. Las reservas internacionales brutas del Banco Central argentino se ubican en US$ 43,000 millones, suficientes para cubrir tres meses de importaciones, el umbral mínimo considerado prudente por los organismos internacionales.`,
    analisis: `La estabilización argentina tiene implicancias para el Perú principalmente por el canal de competencia comercial: una Argentina con tipo de cambio controlado puede hacer sus exportaciones más competitivas en terceros mercados donde compite con productos peruanos (agroindustria, turismo receptivo). Sin embargo, la fragilidad estructural argentina sigue siendo un riesgo regional que puede generar episodios de volatilidad con contagio a otros mercados emergentes.

Para el tipo de cambio PEN/USD, el canal de contagio más relevante sería una crisis argentina que generara percepción negativa sobre la región en su conjunto. En ese escenario, los inversores internacionales podrían reducir exposición a activos latinoamericanos, generando salida de capitales de Perú y presión alcista sobre el dólar frente al sol. Por ahora el riesgo es bajo y manejable.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/22690865/pexels-photo-22690865.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Colombia registra inflación de 5.8% en julio y el Banco de la República analiza un nuevo recorte de tasas en septiembre',
    descripcion: 'La inflación colombiana sigue descendiendo hacia su meta del 3%, abriendo espacio para el octavo recorte consecutivo del Banco de la República. La tasa de referencia está actualmente en 9.25% tras siete bajas consecutivas desde 2025.',
    contenido: `Colombia publicó este miércoles su dato de inflación de julio de 2026: el Índice de Precios al Consumidor registró una variación anual del 5.8%, por debajo del 6.3% de junio y en camino hacia el rango meta del Banco de la República (entre 2% y 4% para fin de 2026). El dato es mejor que el consenso de los analistas, que esperaba un 6.0%, y confirma que el proceso de desinflación colombiano sigue su curso pese al contexto global complicado por la crisis de Ormuz y su impacto en los precios de los combustibles locales.

El Banco de la República de Colombia ha realizado siete recortes de tasas consecutivos desde junio de 2025, llevando la tasa de intervención desde el 13.25% hasta el nivel actual de 9.25%. La institución había señalado en su última comunicación que continuaría el ciclo de recortes siempre que la inflación siguiera descendiendo hacia la meta. Con el dato de julio por debajo de lo esperado, el mercado ahora asigna una probabilidad del 68% a un recorte adicional de 25 puntos básicos en la reunión del Banco de la República del 22 de septiembre. De materializarse, sería el octavo recorte consecutivo.

El contexto macroeconómico colombiano es positivo: el PBI creció 4.1% en el primer semestre de 2026, impulsado por la construcción, los servicios financieros y las exportaciones de petróleo y café. El peso colombiano se ha fortalecido frente al dólar en lo que va de agosto, operando en torno a los 3,890 pesos por dólar, aprovechando la debilidad global del billete verde y los buenos datos económicos del país. La confianza del consumidor colombiano alcanzó su nivel más alto desde 2022 en julio, lo que augura un tercer trimestre dinámico en consumo.`,
    analisis: `El ciclo de recortes de tasas en Colombia es relevante para el entorno financiero regional. Un Banco de la República que baja tasas de forma ordenada es una señal positiva de que la inflación en América Latina se está normalizando. Este contexto reduce el riesgo regional percibido por los inversores internacionales y favorece la apreciación de las monedas latinoamericanas, incluyendo el sol peruano.

Para los clientes de QoriCash con operaciones en Colombia, el peso colombiano en proceso de apreciación y el entorno de tasas en descenso sugieren mayor estabilidad cambiaria en el país vecino. Esto facilita la planificación financiera de las operaciones bilaterales y reduce la necesidad de coberturas cambiarias de corto plazo para pagos en pesos colombianos.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19675608/pexels-photo-19675608.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Chile y la Unión Europea completan la actualización de su acuerdo comercial: nuevos capítulos de economía digital e inversión en litio',
    descripcion: 'Los 27 países de la UE y Chile cerraron la modernización del TLC vigente desde 2003, añadiendo marcos para comercio electrónico, flujos de datos y sostenibilidad. El acuerdo puede dinamizar significativamente las exportaciones de litio chileno.',
    contenido: `Chile y la Unión Europea completaron este mes el proceso de ratificación y entrada en vigor de la versión modernizada del Acuerdo de Asociación que tienen vigente desde 2003. La actualización, negociada durante más de seis años, agrega tres nuevos capítulos de gran relevancia para el comercio bilateral del siglo XXI: economía digital y comercio electrónico, flujos transfronterizos de datos, y sostenibilidad ambiental como condición para el acceso preferencial en determinados sectores productivos. El acuerdo modernizado fue rubricado por los 27 jefes de Estado de la UE y el presidente chileno en una ceremonia realizada en Bruselas.

El capítulo de economía digital facilita el comercio de servicios digitales entre empresas chilenas y europeas, eliminando barreras para pagos en línea, contratos electrónicos y certificación de productos digitales. El capítulo de sostenibilidad exige que los exportadores chilenos de cobre, litio y otros minerales certifiquen que su producción cumple con estándares ambientales mínimos equivalentes a los europeos —una condición que puede ser desafiante para algunos productores medianos, pero que protege el acceso preferencial de los grandes exportadores ya certificados y con programas de ESG robustos.

Para Chile, el mayor potencial del acuerdo está en la exportación de litio: la UE está acelerando su transición energética y necesita garantizar suministro seguro del metal para las baterías de vehículos eléctricos. Chile tiene las mayores reservas de litio del mundo y el nuevo capítulo de inversiones facilita que empresas europeas inviertan directamente en proyectos de extracción y procesamiento en el país. Las exportaciones chilenas de litio hacia Europa crecieron un 38% en el primer semestre de 2026, tendencia que se espera que se acelere con el nuevo marco jurídico.`,
    analisis: `El fortalecimiento comercial entre Chile y la UE es relevante para el Perú como contexto competitivo regional. Chile compite con Perú en exportación de cobre, y un acceso preferencial europeo aún más robusto podría desviar algunos proyectos de inversión minera desde Perú hacia Chile si las condiciones regulatorias y ambientales se perciben como más favorables en el país del sur.

Para el tipo de cambio peruano, el impacto indirecto más importante es el precio del cobre: una mayor demanda europea de cobre y litio certificados sosteniblemente podría presionar los precios al alza, beneficiando tanto a Chile como a Perú. Precios del cobre más altos implican más dólares ingresando a la economía peruana y un sol potencialmente más fuerte en el mediano plazo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
