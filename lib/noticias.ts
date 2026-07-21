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
const HOY = '2026-07-21T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'p001',
    titulo: 'Brent sube a US$ 88.56 mientras Irán declara colapso del cese al fuego con EE.UU. en el Estrecho de Ormuz',
    descripcion: 'El crudo Brent avanza hacia los US$ 90/barril este lunes tras declarar Irán el colapso efectivo del cese al fuego con EE.UU. durante el fin de semana. Cuatro embarcaciones fueron interceptadas en el Estrecho de Ormuz, reavivando el temor a una interrupción del 21% del petróleo mundial.',
    contenido: `El petróleo Brent cotiza en US$ 88.56 por barril este lunes 21 de julio, extendiendo las ganancias de la semana pasada ante la escalada geopolítica en el Golfo Pérsico. Irán declaró durante el fin de semana que el cese al fuego con Estados Unidos había colapsado efectivamente, e interceptó cuatro embarcaciones que transitaban el Estrecho de Ormuz, el principal cuello de botella del comercio mundial de petróleo por donde fluyen 21 millones de barriles diarios.

El WTI, de referencia para el mercado estadounidense, opera en US$ 82.43 con una leve corrección de 0.06% mientras los operadores recogen beneficios parciales, pero el Brent mantiene una prima geopolítica significativa ante el riesgo de interrupción sostenida del tráfico marítimo en el Golfo. Goldman Sachs reiteró su escenario de US$ 95–100/barril si la escalada persiste más de dos semanas.

Arabia Saudita convocó de urgencia a los miembros de la OPEP+ para evaluar si incrementar la producción con su capacidad ociosa de aproximadamente 2 millones de barriles diarios, buscando estabilizar el mercado. Sin embargo, varios miembros del cartel se mostraron reticentes a actuar sin certeza sobre la duración del conflicto. Los futuros de gas natural en EE.UU. también avanzan 1.8% en la jornada.

El mercado descuenta dos escenarios: en el primero (55% de probabilidad), el conflicto permanece contenido y el Brent opera entre US$ 85–92/barril en Q3. En el segundo (45%), una interrupción sostenida del Estrecho elevaría el crudo a US$ 100+ con impacto inflacionario global directo que complicaría la decisión del FOMC del 29 de julio.`,
    analisis: `Un Brent por encima de US$ 88 alimenta las presiones inflacionarias que mantienen al Fed en guardia, lo que fortalece el dólar globalmente y presiona a las monedas emergentes incluyendo el sol peruano. Para Perú, importador neto de combustibles refinados, el petróleo caro encarece la energía, el transporte y los insumos industriales, aunque el superávit minero actúa como amortiguador cambiario.

Si el Brent consolida por encima de US$ 90 esta semana antes del FOMC, el escenario de alza de tasas del Fed el 29 de julio ganarÃ­a fuerza y el PEN podría presionarse hacia S/ 3.43–3.45. Para quienes tienen gastos en dólares programados en agosto, considerar anticipar compras de divisas en el nivel actual de S/ 3.41 es una estrategia razonable.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p002',
    titulo: 'Sol peruano en S/ 3.41 al inicio de la semana más importante del año: FOMC del 29 de julio define tendencia cambiaria',
    descripcion: 'El tipo de cambio PEN/USD opera en S/ 3.41 este lunes 21 de julio en la apertura de la semana clave para los mercados. Con el FOMC reuniéndose el 28-29 de julio y una probabilidad del 19.4% de alza de tasas, el dólar mantiene su fortaleza con el DXY por encima de 104.5 puntos.',
    contenido: `El sol peruano inicia la semana en S/ 3.41 por dólar este lunes 21 de julio, con una leve depreciación de 0.6% frente al cierre de la semana anterior. La presión proviene del fortalecimiento global del dólar —el DXY opera por encima de 104.5 puntos— impulsado por la expectativa de que la Reserva Federal mantenga un tono hawkish en su reunión del 28-29 de julio. El Banco Central de Reserva del Perú (BCRP) monitorea la situación con sus reservas internacionales netas superiores a US$ 80,000 millones.

Los mercados de futuros asignan una probabilidad del 19.4% a un alza de tasas de 25 puntos básicos en la reunión del miércoles 29 de julio, según CME FedWatch, frente al 79.5% que descuenta que la tasa permanecerá en el rango 3.50%–3.75%. El discurso del presidente Warsh tras la reunión será el evento más relevante del mes para el tipo de cambio: si el tono es más hawkish de lo esperado, el dólar se fortalecería adicionalmente y el PEN podría presionarse a S/ 3.44–3.46.

Los fundamentos macroeconómicos peruanos siguen siendo sólidos: exportaciones récord de más de US$ 45,000 millones en los primeros cinco meses, inflación controlada en 2.5% anual y reservas internacionales holgadas. El BCRP mantiene su tasa de referencia en 4.25%, con un diferencial de 75 puntos básicos sobre el límite superior del Fed Funds, lo que hace al sol atractivo para flujos de carry trade.

El soporte técnico del PEN se ubica en S/ 3.39, con resistencia inmediata en S/ 3.43. El escenario base para la semana es que el tipo de cambio opere en el rango S/ 3.40–3.44 hasta la decisión del miércoles.`,
    analisis: `La semana del FOMC es históricamente la de mayor volatilidad cambiaria del mes. El sol peruano en S/ 3.41 refleja ya parte de la incertidumbre: los especuladores han tomado posiciones largas en dólares anticipando un discurso restrictivo de Warsh. Si el Fed sorprende con pausa y lenguaje moderado, el PEN podría apreciarse hacia S/ 3.38–3.39.

Para empresas y personas con necesidades de dólares en los próximos 10 días, comprar en tramos en el nivel actual de S/ 3.41 reduce el riesgo de un movimiento adverso post-FOMC. QoriCash ofrece el mejor tipo de cambio del mercado, sin comisiones y con acreditación inmediata.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/4960438/pexels-photo-4960438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p003',
    titulo: 'BCR proyecta exportaciones récord de US$ 118,171 millones para Perú en 2026 impulsadas por minería y agro',
    descripcion: 'El Banco Central de Reserva del Perú elevó su proyección de exportaciones totales para 2026 a US$ 118,171 millones, el máximo histórico del país. Las exportaciones tradicionales concentrarían US$ 93,606 millones, lideradas por cobre, oro y harina de pescado.',
    contenido: `El Banco Central de Reserva del Perú publicó su más reciente proyección de comercio exterior para 2026, estimando que las exportaciones totales alcanzarán US$ 118,171 millones al cierre del año, lo que representaría el récord absoluto de la historia exportadora peruana y un avance del 25% respecto al desempeño de 2025. Esta cifra supera ampliamente la proyección de US$ 107,000 millones que manejaba ADEX a mediados del primer semestre.

Las exportaciones tradicionales —minerales, petróleo, gas natural y harina de pescado— concentrarían US$ 93,606 millones, con la minería como principal motor. El cobre aportaría alrededor de US$ 50,000 millones gracias a la combinación de volúmenes récord y precios por encima de US$ 4.50/libra. El oro contribuiría con más de US$ 18,000 millones ante precios cercanos a US$ 4,000/oz.

Las exportaciones no tradicionales —agropecuarias, textiles, químicas— alcanzarían US$ 24,565 millones, con el agro como líder con frutas frescas como arándanos, uvas y paltas. Los mercados de destino se diversifican: EE.UU., China y la Unión Europea absorben el 70% del total, pero Asia Pacífico gana participación por el auge de la demanda de minerales críticos para la transición energética.

El BCRP también proyecta que las importaciones crecerán a US$ 58,000 millones en 2026, impulsadas por bienes de capital e insumos industriales, con un superávit comercial proyectado superior a US$ 60,000 millones —el más alto de la historia peruana.`,
    analisis: `Un superávit comercial de US$ 60,000 millones es un ancla extraordinaria para el sol peruano, generando una entrada sostenida de divisas que el BCRP puede administrar para mantener el tipo de cambio en rangos estables. Esta solidez del balance externo es el principal diferencial del PEN frente a otras monedas emergentes de la región.

Para empresas exportadoras, el contexto actual de precios altos y volúmenes récord es el mejor escenario operativo en la historia del Perú moderno. Gestionar eficientemente la conversión de dólares a soles —aprovechando tipos de cambio competitivos como los de QoriCash— puede maximizar los márgenes en un ciclo de bonanza que podría mantenerse hasta fin de año.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p004',
    titulo: 'Exportaciones mineras peruanas crecen 56.2% en el primer trimestre de 2026 y alcanzan US$ 21,649 millones',
    descripcion: 'El Ministerio de Energía y Minas confirma que las exportaciones mineras del Q1 2026 crecieron 56.2% interanual, concentrando el 75.4% del total exportado por Perú. El cobre y el oro lideran ante precios internacionales históricamente elevados.',
    contenido: `Las exportaciones mineras del Perú registraron un crecimiento del 56.2% en el primer trimestre de 2026, alcanzando US$ 21,649 millones según datos del Ministerio de Energía y Minas (Minem). Esta cifra representa el mejor Q1 minero de la historia peruana y posiciona al sector como el motor indiscutible del crecimiento económico nacional en 2026, concentrando el 75.4% del valor total de exportaciones peruanas en el período.

El cobre es el principal protagonista: los proyectos de Quellaveco (Anglo American), Las Bambas (MMG), Cerro Verde (Freeport-McMoRan) y Antamina operan a plena capacidad, beneficiados por precios por encima de US$ 4.50 por libra en la Bolsa de Metales de Londres. Perú reafirma su posición como segundo productor mundial de cobre con el 10.5% de la oferta global. El oro aportó US$ 6,200 millones al total minero del trimestre, con el precio cercano a US$ 4,000/oz.

El zinc, la plata y el molibdeno también contribuyen positivamente. Las exportaciones de zinc crecieron 38% interanual, las de plata 44% y las de molibdeno 62%, reflejando la amplitud del ciclo alcista de metales. El gobierno peruano proyecta que el PBI minero crecerá 8.5% en el año completo, siendo el sector de mayor aporte al crecimiento nacional.

El Minem destacó que la cartera de proyectos de construcción suma US$ 12,300 millones, con cuatro proyectos en etapa de construcción activa que aportarán producción adicional a partir de 2027: Corani (plata), Zafranal (cobre), San Gabriel (oro) y la ampliación de Toromocho.`,
    analisis: `El dinamismo minero es el factor estructural más potente de estabilización del sol peruano. Un ingreso de US$ 21,649 millones solo en Q1 genera presión apreciadora sobre el PEN que el BCRP absorbe acumulando reservas internacionales. Mientras los precios del cobre y el oro se mantengan en niveles históricamente altos, el tipo de cambio seguirá siendo uno de los más estables de la región.

Para empresas mineras y sus proveedores con ingresos en dólares, la conversión eficiente a soles para cubrir costos operativos locales es un tema de gestión financiera crítico. QoriCash ofrece tipos de cambio corporativos competitivos sin los spreads bancarios tradicionales, optimizando el retorno en soles de cada dólar exportado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p005',
    titulo: 'Perú amplía cartera minera a 67 proyectos por US$ 64,071 millones y se consolida como hub de minerales estratégicos',
    descripcion: 'El portafolio de inversiones mineras del Perú creció de US$ 54,500 millones en 2025 a US$ 64,071 millones en 2026, con 67 proyectos en distintas etapas. Litio, cobre y oro posicionan al país como destino prioritario en la carrera global por minerales críticos para la transición energética.',
    contenido: `El Ministerio de Energía y Minas publicó la actualización de la cartera de proyectos mineros para 2026, registrando 67 proyectos con una inversión estimada total de US$ 64,071 millones, frente a US$ 54,500 millones reportados en 2025. Este incremento del 17.6% en el valor del portafolio refleja tanto la incorporación de nuevos proyectos como la revalorización de los existentes ante precios de metales históricamente elevados.

Los proyectos están distribuidos en distintas etapas: 12 en construcción activa (US$ 12,300 millones), 31 en exploración avanzada o estudio de factibilidad (US$ 28,700 millones) y 24 en etapa inicial o conceptual (US$ 23,071 millones). Las regiones de Apurímac, Arequipa, Cajamarca y Áncash concentran la mayor parte de la inversión potencial.

El litio emerge como el nuevo protagonista de la cartera. Perú posee reservas identificadas de litio en la puna sur —especialmente en Puno y Moquegua— que atraen el interés de empresas coreanas, japonesas y estadounidenses ante la escasez global de este mineral crítico para baterías eléctricas. El gobierno proyecta que los primeros proyectos de litio entrarán en fase de explotación a partir de 2029.

Además, Perú consolida su perfil de hub regional para el procesamiento de minerales estratégicos. La inversión en fundiciones y refinerías de cobre suma US$ 3,200 millones adicionales, buscando agregar valor local al cobre en lugar de exportar solo concentrado.`,
    analisis: `Una cartera minera de US$ 64,071 millones proyecta un flujo de inversión extranjera directa sostenido por al menos 15 años, lo que constituye uno de los mejores soportes estructurales para el sol peruano a largo plazo. Más inversión minera significa más dólares ingresando a la economía peruana para financiar costos locales en soles.

Para el tipo de cambio en el corto plazo, este dato refuerza la narrativa de que el PEN tiene un piso sólido. Empresas que planifican expansiones en Perú en los próximos años pueden hacerlo con mayor certeza sobre la estabilidad cambiaria. QoriCash puede apoyar la gestión de sus conversiones de divisas en el contexto de proyectos de inversión de largo plazo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p006',
    titulo: 'BCRP: inversión privada en Perú proyectada en +12.5% para 2026 con cemento y bienes de capital como indicadores líderes',
    descripcion: 'El Banco Central de Reserva del Perú elevó su proyección de inversión privada para 2026 a +12.5%, desde +9.5% anterior. El consumo de cemento sube 11% y las importaciones de bienes de capital avanzan 25% en el año, confirmando la solidez del ciclo expansivo peruano.',
    contenido: `El Banco Central de Reserva del Perú revisó al alza su proyección de inversión privada para 2026 a +12.5% interanual, desde el +9.5% estimado en el Reporte de Inflación de mayo. La mejora refleja el dinamismo del sector construcción, la aceleración de proyectos mineros e industriales y la mayor confianza empresarial registrada en las encuestas del segundo trimestre.

Los indicadores líderes de inversión muestran un ciclo expansivo robusto: el consumo de cemento acumula un crecimiento del 11% en lo que va del año, las importaciones de bienes de capital —maquinaria, equipos y herramientas— avanzan 25% interanual, y los despachos de acero de construcción suben 18%. Estas cifras apuntan a que la expansión de capacidad productiva no se limita al sector minero, sino que abarca manufactura, agroindustria e infraestructura.

El sector construcción lidera el dinamismo con un crecimiento del 11.2% en el Q1 2026, impulsado por proyectos de infraestructura pública (carreteras, hospitales, saneamiento) y el auge inmobiliario en Lima y principales ciudades. El gobierno proyecta una inversión pública de S/ 42,000 millones en 2026, el nivel más alto en la historia del país.

La mayor inversión privada genera un círculo virtuoso: más construcción e industria implica más demanda de insumos importados en dólares, pero también más producción futura que generará divisas adicionales. El BCRP estima que por cada punto porcentual adicional de crecimiento del PBI, las exportaciones aumentan en aproximadamente US$ 1,200 millones al año.`,
    analisis: `La aceleración de la inversión privada al 12.5% es una señal poderosa de que el ciclo económico peruano no depende exclusivamente de los precios de materias primas. Una economía que diversifica su base productiva reduce la vulnerabilidad a choques externos como la volatilidad de commodities o el ciclo del Fed. Esto es positivo para la estabilidad del sol a mediano plazo.

Para empresas que importan bienes de capital en dólares, el contexto actual —tipo de cambio en S/ 3.41 y reservas del BCRP sólidas— ofrece visibilidad razonable para planificar sus compras de divisas. QoriCash puede estructurar conversiones programadas que optimicen el costo cambiario para importadores con necesidades recurrentes de dólares.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p007',
    titulo: 'FOMC se reúne el 28-29 de julio con 19.4% de probabilidad de alza: mercados en máxima alerta ante señales de Warsh',
    descripcion: 'La reunión del Comité de Mercado Abierto de la Fed esta semana mantiene en vilo a los mercados globales. Con una probabilidad del 19.4% de un alza de 25 pb según CME FedWatch y el tono hawkish de Warsh, el comunicado del miércoles 29 será el catalizador más relevante del mes para el tipo de cambio.',
    contenido: `La Reserva Federal de Estados Unidos inicia este martes 28 de julio su reunión de dos días del Comité de Mercado Abierto (FOMC), con la decisión de política monetaria y el comunicado del presidente Kevin Warsh programados para el miércoles 29 de julio a las 2:00 pm ET. Los mercados asignan una probabilidad del 79.5% a que la tasa permanezca sin cambios en el rango 3.50%–3.75%, pero el 19.4% implícito de un alza de 25 puntos básicos es el nivel más alto en meses y mantiene en guardia a los inversores.

La agenda del FOMC no incluye publicación de proyecciones económicas actualizadas (la próxima será en septiembre), lo que eleva la importancia del comunicado escrito y la conferencia de prensa de Warsh. En su última intervención, el presidente de la Fed advirtió que la combinación de energía cara por el conflicto con Irán, mercado laboral resiliente e inflación subyacente por encima del 2.5% podría justificar "una acción preventiva" antes de que los datos del Q3 confirmen o desmientan la tendencia.

El mercado de bonos descuenta que la tasa terminal en este ciclo será 4.00%–4.25%, con dos alzas adicionales posibles antes de fin de 2026. El rendimiento del T-Note a 2 años opera en 4.85%, el nivel más alto desde marzo, mientras el T-Note a 10 años cotiza en 4.62%. El spread entre ambos se estrecha, reduciendo la inversión de la curva que caracterizó a 2024–2025.

La lectura del PCE subyacente del 31 de julio —indicador favorito de la Fed— será la siguiente señal clave. Si confirma la desinflación del CPI de junio (+3.5% anual), el escenario de pausa en septiembre recuperará fuerza. Si sorprende al alza, el mercado actualizará sus expectativas hacia un ciclo de alzas más prolongado.`,
    analisis: `El FOMC del 29 de julio es el evento de mayor impacto potencial sobre el tipo de cambio PEN/USD en lo que resta del mes. Un alza de tasas sorpresiva fortalecería el dólar entre un 0.8%–1.2% en minutos, llevando el DXY por encima de 106 y presionando el sol hacia S/ 3.44–3.46. Una pausa con lenguaje moderado podría apreciar el PEN hacia S/ 3.38–3.39.

Para gestionar este riesgo, diversificar las compras de dólares a lo largo de la semana —en lugar de concentrarlas en un solo momento— es la estrategia más prudente. QoriCash está disponible para ejecutar conversiones en tiempo real, con los mejores precios del mercado cualquiera sea el resultado del FOMC.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p008',
    titulo: 'Oro spot en US$ 3,995/oz sostiene niveles históricos respaldado por tensiones en Irán y demanda de bancos centrales asiáticos',
    descripcion: 'El metal precioso mantiene su posición cerca del umbral psicológico de US$ 4,000/oz este lunes, con el conflicto iraní-estadounidense como principal soporte. Los bancos centrales de China, India y Turquía continúan acumulando reservas de oro para diversificar lejos del dólar.',
    contenido: `El oro al contado cotiza en US$ 3,995 por onza este lunes 21 de julio, manteniéndose en el umbral del nivel psicológico de US$ 4,000 que ha definido el mercado durante las últimas semanas. El metal acumula una ganancia del 28% en lo que va de 2026, sustentado en tres pilares: tensiones geopolíticas en Oriente Medio que elevan la demanda de activos refugio, inflación persistente que erosiona el valor real de las monedas fiduciarias, y la compra sistemática de bancos centrales asiáticos que buscan diversificar sus reservas fuera del dólar.

El Consejo Mundial del Oro reportó que los bancos centrales compraron 310 toneladas en el primer semestre de 2026, un aumento del 22% respecto al mismo período de 2025. China lidera con 85 toneladas adquiridas en el semestre, seguida de India (62 toneladas) y Turquía (38 toneladas). Esta demanda estructural actúa como piso para el precio del oro, limitando las correcciones en momentos de fortaleza del dólar.

El nivel de US$ 4,000 representa una resistencia psicológica clave: si el FOMC del 29 de julio sorprende con pausa y lenguaje moderado, el oro podría superar ese umbral y escalar hacia US$ 4,050–4,100/oz. Si Warsh adopta un tono hawkish o hay un alza de tasas, el metal podría ceder hacia US$ 3,900–3,950/oz ante el fortalecimiento del dólar.

Para Perú, como tercer productor mundial de oro, el precio en US$ 4,000 tiene implicaciones directas: cada dólar adicional por onza genera aproximadamente US$ 50 millones adicionales en exportaciones anuales, según estimaciones del Minem.`,
    analisis: `El oro en US$ 3,995 beneficia directamente a las cuentas externas peruanas y refuerza el superávit comercial que ancla al sol. Los ingresos adicionales por exportaciones de oro también fortalecen la base tributaria del Estado, mejorando el balance fiscal y reduciendo la necesidad de endeudamiento en dólares.

Para inversores o empresas con exposición a activos en dólares, el oro en niveles históricos es una señal de que la incertidumbre global es alta. Mantener una posición equilibrada entre activos en dólares y soles, usando tipos de cambio competitivos para las conversiones, es una estrategia de preservación de valor en este entorno.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p009',
    titulo: 'China: PMI manufactura 49.1 en zona de contracción por segundo mes y exportaciones crecen al ritmo más lento en cuatro meses',
    descripcion: 'La actividad manufacturera china cae por segundo mes consecutivo bajo el umbral de expansión con un PMI de 49.1. Las exportaciones crecen solo 6.8% interanual —su ritmo más lento en cuatro meses— mientras Beijing anuncia nuevos estímulos de US$ 50,000 millones en semiconductores e infraestructura.',
    contenido: `El PMI manufacturero oficial de China se ubicó en 49.1 puntos en junio de 2026, por debajo del umbral de expansión de 50 por segundo mes consecutivo, según los datos del Buró Nacional de Estadísticas. Los nuevos pedidos externos cayeron 2.3% ante la desaceleración de la demanda europea y el enfriamiento de las relaciones comerciales con Estados Unidos, mientras los precios de fábrica retrocedieron 0.8%, señal de presión deflacionaria en el sector industrial chino.

Las exportaciones chinas de bienes crecieron 6.8% interanual en junio —el ritmo más lento en cuatro meses—, con un superávit comercial de US$ 98,000 millones que, aunque abultado en términos absolutos, muestra una moderación frente al dinamismo de 2025. Los importadores estadounidenses han comenzado a diversificar proveedores hacia Vietnam, México e India ante las tensiones arancelarias, erosionando lentamente la cuota de mercado china.

Beijing respondió con el anuncio de un paquete de estímulos fiscales por US$ 50,000 millones enfocado en semiconductores, infraestructura de datos y vehículos eléctricos, buscando reactivar la demanda interna. El banco central chino (PBoC) también redujo el coeficiente de reservas bancarias en 25 puntos básicos para inyectar liquidez al sistema financiero. Los analistas estiman que estas medidas podrían elevar el PMI manufacturero hacia 50.5 en julio.

Para Perú, la demanda china de cobre sigue siendo estructuralmente elevada —China representa el 55% del consumo mundial de cobre refinado— por la construcción de infraestructura eléctrica, redes de transmisión y producción de vehículos eléctricos. Una contracción sostenida del PMI chino sería el principal riesgo descendente para los precios del cobre y el superávit comercial peruano.`,
    analisis: `Un PMI chino en 49.1 no es alarmante por sí mismo, pero dos meses consecutivos en zona de contracción merecen monitoreo. Si los estímulos de Beijing no logran reactivar la manufactura en julio, los precios del cobre podrían ceder 3-5% desde los niveles actuales, lo que presionaría levemente al alza el tipo de cambio PEN/USD hacia S/ 3.43–3.45.

El canal de impacto en el corto plazo para Perú es indirecto: el sol no se mueve instantáneamente por el PMI chino, pero sí lo hacen los precios del cobre en LME, que luego afectan las expectativas sobre los ingresos por exportaciones. Monitorear los datos del PMI de julio (que se publicarán el 1 de agosto) será clave para ajustar estrategias cambiarias.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5905736/pexels-photo-5905736.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p010',
    titulo: 'DXY supera 104.5 puntos en su cuarta semana consecutiva de avances mientras FOMC y Oriente Medio mantienen el dólar fuerte',
    descripcion: 'El índice del dólar (DXY) registra su cuarta semana consecutiva de ganancias, impulsado por el sesgo hawkish de la Fed y la escalada geopolítica en el Golfo. El sol peruano resiste en S/ 3.41 mientras el peso colombiano y el real brasileño acumulan mayores pérdidas.',
    contenido: `El índice del dólar (DXY) cotiza por encima de 104.5 puntos este lunes 21 de julio, su nivel más alto desde enero de 2026, encadenando cuatro semanas consecutivas de avances. El catalizador dual —posible alza de tasas del Fed el 29 de julio con 19.4% de probabilidad más la escalada geopolítica en el Estrecho de Ormuz— mantiene la demanda de activos denominados en dólares como refugio de valor en un entorno de elevada incertidumbre.

Las monedas emergentes acumulan presiones: el peso colombiano (COP) cedió 1.8% en la última semana, el real brasileño (BRL) retrocedió 1.4%, el peso mexicano (MXN) cayó 1.1% y el peso chileno (CLP) cedió 0.9%. El sol peruano (PEN) muestra la mayor resiliencia relativa de la región, con una depreciación de solo 0.6% en el mismo período gracias al superávit comercial minero que genera un flujo constante de dólares hacia la economía peruana.

Los flujos de capital desde mercados emergentes hacia activos en dólares se aceleran: los fondos de bonos emergentes registraron salidas netas de US$ 4,800 millones en la última semana, según datos de EPFR Global. Los fondos de acciones emergentes también vieron retiros de US$ 2,100 millones. Este contexto de aversión al riesgo favorece al dólar y presiona a todas las monedas emergentes.

El nivel técnico clave del DXY está en 105.5: si lo supera esta semana ante un FOMC hawkish, el movimiento alcista del dólar podría acelerarse hacia 107–108 en las semanas siguientes, lo que presionaría el PEN hacia S/ 3.44–3.47.`,
    analisis: `El fortalecimiento del DXY por encima de 104.5 es la presión externa más relevante sobre el tipo de cambio PEN/USD en el corto plazo. Históricamente, cada 1% de avance del DXY se traduce en una depreciación del PEN de 0.3%–0.5% en ausencia de intervención del BCRP. Con el FOMC esta semana, el riesgo es asimétrico al alza para el dólar.

Para planificar compras de divisas esta semana, los niveles de S/ 3.40–3.42 representan un punto de entrada razonable antes de la decisión del Fed. QoriCash permite ejecutar operaciones en minutos con el mejor tipo de cambio del mercado, sin tiempos de espera bancarios.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4960438/pexels-photo-4960438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p011',
    titulo: 'Bitcoin rebota a US$ 66,310 (+3.3% en 24h) impulsado por expectativas mayoritarias de pausa del Fed el 29 de julio',
    descripcion: 'El precio del Bitcoin sube US$ 2,111 en las últimas 24 horas, recuperando terreno ante la expectativa mayoritaria (79.5%) de que la Fed mantenga tasas sin cambios el 29 de julio. El alivio en el apetito de riesgo favorece activos especulativos tras semanas de presión.',
    contenido: `Bitcoin cotiza en US$ 66,310 este lunes 21 de julio, registrando una suba de US$ 2,111 (+3.3%) respecto al precio de ayer, en el mejor día para la criptomoneda en las últimas dos semanas. El rebote está impulsado por el posicionamiento de los mercados ante la alta probabilidad (79.5%) de que el FOMC del 29 de julio mantenga las tasas sin cambios, lo que reduce temporalmente la presión sobre el apetito de riesgo global y favorece activos especulativos.

Ethereum también avanza 2.8% hasta US$ 3,120, y el índice CoinMarketCap 100 —que agrupa las cien mayores criptomonedas— sube 2.4%. El volumen de operaciones en Bitcoin alcanzó US$ 28,000 millones en las últimas 24 horas, un 45% por encima del promedio de la semana pasada, señal de que la liquidez está regresando al mercado cripto.

Sin embargo, el contexto de mediano plazo sigue siendo desafiante para Bitcoin: acumula una caída de 34% desde sus máximos históricos de inicio de 2026 (cercanos a US$ 100,000), afectado por la rotación de capital hacia acciones de inteligencia artificial, el entorno de tasas altas que eleva el costo de oportunidad del holding en cripto, y la incertidumbre regulatoria en varios mercados. Los ETF de Bitcoin al contado en EE.UU. apenas revirtieron la tendencia de salidas netas esta semana.

El nivel técnico de resistencia más relevante para Bitcoin está en US$ 68,500 —la media móvil de 50 días—. Si lo supera con volumen sostenido después del FOMC, el siguiente objetivo sería US$ 72,000. Un discurso hawkish de Warsh el 29 de julio podría empujar el precio de vuelta hacia US$ 62,000–63,000.`,
    analisis: `El rebote de Bitcoin no tiene impacto directo sobre el tipo de cambio PEN/USD, pero sí es una señal del estado del apetito de riesgo global. Un Bitcoin recuperando terreno en un contexto de FOMC próximo sugiere que los mercados están apostando a la pausa, lo que es levemente positivo para las monedas emergentes incluyendo el sol.

Para quienes tienen activos en criptomonedas y necesitan convertirlos a soles peruanos, el nivel actual de Bitcoin en US$ 66,310 con PEN en S/ 3.41 define el valor en soles de cada BTC en aproximadamente S/ 226,117. El timing de conversión puede hacer diferencias significativas: planificar con anticipación y usar una casa de cambio eficiente como QoriCash maximiza el retorno final.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p012',
    titulo: 'WTI cede a US$ 82.43 (-0.06%) en toma de beneficios mientras Brent mantiene US$ 88.56 ante riesgo en Hormuz',
    descripcion: 'El crudo WTI retrocede levemente este lunes mientras los inversores toman ganancias tras la escalada del fin de semana en el Estrecho de Ormuz. El mercado opera con cautela: el Brent se mantiene en US$ 88.56 y el riesgo al alza persiste si el conflicto Irán-EE.UU. escala esta semana.',
    contenido: `El petróleo WTI cotiza en US$ 82.43 por barril este lunes 21 de julio, con una corrección de apenas 0.06% (US$ 0.05) en la jornada mientras los operadores recogen beneficios parciales tras las fuertes subidas de la semana pasada. El Brent nortemar mantiene su posición en US$ 88.56, con una prima de US$ 6.13 sobre el WTI que refleja la mayor exposición del crudo internacional a los riesgos de suministro del Golfo Pérsico.

El diferencial WTI-Brent en US$ 6.13 es el más amplio en dos años, señal de que el mercado internacional descuenta un riesgo de interrupción de suministro mucho mayor que el mercado doméstico estadounidense. Las reservas estratégicas de petróleo de EE.UU. (SPR) se encuentran al 62% de capacidad, lo que da al gobierno americano margen para liberar hasta 700 millones de barriles si la situación lo requiere.

La OPEP+ monitorea la situación en tiempo real. Arabia Saudita ha señalado que tiene capacidad ociosa de 2 millones de barriles diarios disponibles para activar en menos de 90 días si hay interrupciones significativas en el tráfico de Ormuz. Rusia, por su parte, ha expresado reluctancia a aumentar producción sin un acuerdo formal del cartel, generando tensión interna en la organización.

El mercado de opciones de petróleo muestra un sesgo marcadamente alcista: los contratos call (apuesta al alza) a US$ 100/barril para agosto tienen una prima del 22%, frente al 8% de hace tres semanas. Esto refleja que los inversores están pagando una prima significativa para cubrirse contra un escenario de petróleo en US$ 100.`,
    analisis: `La combinación de Brent en US$ 88.56 y WTI en US$ 82.43 con riesgo al alza crea un entorno inflacionario para la economía global que complica la labor de los bancos centrales. Para el BCRP, la energía cara eleva el componente importado de la inflación peruana, pero la solidez exportadora minera compensa con creces el mayor costo de importaciones de combustibles.

El impacto directo en el tipo de cambio PEN/USD es moderado en el corto plazo: el sol tiene suficientes defensas macroeconómicas para absorber el shock energético. Sin embargo, si el Brent supera US$ 95 de manera sostenida, el escenario de alza del Fed en septiembre se activaría, y eso sí tendría un impacto cambiario más visible.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p013',
    titulo: 'Argentina: dólar oficial sube a ARS 1,510 mientras BCRA extiende racha compradora a más de 130 jornadas consecutivas',
    descripcion: 'El tipo de cambio oficial argentino se ubica en ARS 1,510 para la venta este lunes, con el Banco Central extendiendo su racha compradora de divisas. La brecha con el dólar blue se mantiene comprimida por debajo del 3%, señal de la estabilidad cambiaria que consolida el modelo económico del gobierno de Milei.',
    contenido: `El tipo de cambio oficial del peso argentino opera en ARS 1,510 para la venta este lunes 21 de julio, mientras el Banco Central de la República Argentina (BCRA) extiende su racha compradora de divisas a más de 130 jornadas consecutivas con saldo positivo. El dólar blue cotiza en ARS 1,553, manteniendo la brecha cambiaria en niveles históricamente bajos del 2.8%, la menor en varios años y señal de la confianza que ha recuperado el mercado en la gestión del presidente Javier Milei.

Las reservas brutas del BCRA superan los US$ 43,500 millones, con una mejora de US$ 12,000 millones en lo que va del año gracias a las compras netas en el mercado cambiario y los desembolsos del FMI. Las reservas netas —descontados pasivos con organismos internacionales— también muestran una mejora sostenida, alejándose de los niveles negativos que caracterizaron el final del gobierno anterior.

Las perspectivas para el segundo semestre son moderadamente optimistas: los analistas del mercado proyectan que el dólar oficial cerrará 2026 en torno a ARS 1,620, lo que implica una inflación cambiaria del 7% en el segundo semestre —significativamente menor que los ritmos de devaluación de 2023-2024. La inflación mensual se ha desacelerado al 2.7% en junio, el nivel más bajo en cuatro años.

Sin embargo, el mercado monitorea los vencimientos de deuda de agosto —superiores a US$ 4,000 millones— como el próximo test de la solidez del programa económico. El acuerdo con el FMI provee el paraguas necesario para afrontar estos compromisos, pero la acumulación de reservas de los próximos meses será clave.`,
    analisis: `La estabilidad cambiaria argentina reduce el riesgo de contagio regional sobre otras monedas latinoamericanas, incluido el sol peruano. En el pasado, las crisis argentinas generaban episodios de volatilidad en los mercados de la región; la relativa calma actual es positiva para el ecosistema financiero latinoamericano en general.

Para empresas peruanas con operaciones comerciales o inversiones en Argentina, el contexto actual de brecha cambiaria baja y reservas en acumulación ofrece la mejor ventana de planificación financiera en años. La estabilidad del peso argentino facilita la gestión de pagos y cobros entre ambos países.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p014',
    titulo: 'Colombia: peso COP en COP 4,280 bajo presión dual del DXY fuerte y volatilidad del petróleo ante conflicto en Ormuz',
    descripcion: 'El peso colombiano opera en COP 4,280 por dólar este lunes, presionado por el doble impacto del fortalecimiento del DXY y la volatilidad del petróleo —principal exportación colombiana—. El Banco de la República evalúa si el ciclo hawkish del Fed exige una respuesta de política monetaria.',
    contenido: `El peso colombiano (COP) opera en torno a COP 4,280 por dólar este lunes 21 de julio, con una depreciación acumulada del 1.8% en la última semana. La presión cambiaria proviene de dos fuentes simultáneas: el fortalecimiento global del DXY que supera 104.5 puntos ante el FOMC del 29 de julio, y la volatilidad del petróleo Brent —el principal producto de exportación colombiano, que representa el 40% de sus divisas— generada por el colapso del cese al fuego iraní-estadounidense en el Estrecho de Ormuz.

La paradoja del momento para Colombia es que el petróleo caro (Brent en US$ 88.56) debería generar más ingresos de divisas y fortalecer el peso, pero el efecto DXY global —que empuja al alza al dólar frente a todos los emergentes— está dominando en el corto plazo. Los analistas esperan que una vez que el mercado procese el FOMC del 29 de julio, el COP pueda recuperar parte de lo perdido si la Fed adopta una pausa.

El Banco de la República de Colombia mantiene su tasa de interés de referencia en 6.75%, el nivel más alto en años, y monitorea si el endurecimiento monetario de la Fed requiere una respuesta de política local para defender el peso y contener la inflación importada. La inflación colombiana se ubica en 4.8% anual en junio, por encima del rango meta del 3%±1%, lo que limita el espacio para recortes de tasas.

Ecopetrol —la petrolera estatal colombiana— es el principal generador de divisas del país. Con el Brent en US$ 88.56, los ingresos de Ecopetrol en el segundo semestre serán significativos, lo que eventualmente presionará al alza la oferta de dólares en el mercado colombiano y podría apreciar el COP en agosto–septiembre.`,
    analisis: `La dinámica del COP tiene relevancia para empresas peruanas con operaciones comerciales en Colombia. Un peso colombiano débil encarece las importaciones desde Colombia para compradores peruanos y abarata las exportaciones peruanas hacia el mercado colombiano, afectando la competitividad de productos en ambas direcciones.

Para quienes gestionan flujos de pago entre Perú y Colombia en dólares o en monedas locales, el nivel actual de ambas divisas define las condiciones de las transacciones. QoriCash puede orientar sobre la mejor estrategia de conversión para operaciones entre ambos mercados.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'p015',
    titulo: 'Chile: cobre supera US$ 4.50/libra y exportaciones impulsan superávit comercial mientras el peso CLP cotiza en CLP 920',
    descripcion: 'Los precios del cobre en máximos históricos por encima de US$ 4.50/libra generan ingresos récord para Chile. El peso CLP se mantiene estable en CLP 920 por dólar y el Banco Central de Chile evalúa el impacto del ciclo hawkish de la Fed sobre los flujos de capitales.',
    contenido: `Chile opera este lunes con el precio del cobre cotizando por encima de US$ 4.50 por libra en la Bolsa de Metales de Londres (LME), beneficiado por la demanda de la transición energética global y las restricciones de oferta asociadas al conflicto en Oriente Medio que afecta el costo logístico. El metal rojo representa el 50% de las exportaciones chilenas y es el principal determinante del tipo de cambio del peso (CLP), que opera en torno a CLP 920 por dólar —relativamente estable frente a sus pares regionales.

Las exportaciones chilenas de cobre en el primer semestre de 2026 alcanzaron un récord de US$ 24,800 millones, lideradas por Codelco (38%), BHP Escondida (22%) y Los Pelambres de Antofagasta Minerals (12%). El superávit comercial de Chile acumula US$ 8,200 millones en el primer semestre, el nivel más alto desde 2022, generando un flujo constante de divisas que actúa como amortiguador ante la presión del DXY global.

El Banco Central de Chile mantiene su tasa de política monetaria en 5.50% y adoptó una postura de espera mientras evalúa el impacto del FOMC del 29 de julio. La inflación chilena se ubica en 3.8% anual en junio, dentro del rango meta del banco central de 3%±1%, lo que le da mayor flexibilidad de política que a sus pares colombiano o brasileño. El directorio del BCCh ha señalado que no anticipan cambios en la tasa hasta que haya mayor claridad sobre el ciclo del Fed.

El litio también contribuye al dinamismo exportador chileno: SQM y Albemarle operan sus plantas del Salar de Atacama a máxima capacidad, con el litio cotizando en torno a US$ 16,500/tonelada. Chile sigue siendo el principal productor mundial de litio con el 30% de la oferta global.`,
    analisis: `Chile y Perú son economías estructuralmente similares —ambas con exportaciones mineras como principal motor de divisas y bancos centrales con credibilidad institucional— por lo que sus tipos de cambio tienden a correlacionarse. Los precios altos del cobre benefician a ambos países y contribuyen a la estabilidad del CLP y el PEN frente al dólar en un contexto de DXY fuerte.

Para empresas con operaciones comerciales entre Chile y Perú, el contexto actual de ambas monedas relativamente estables facilita la planificación financiera. Los spreads de conversión son un costo que se puede optimizar: QoriCash ofrece condiciones competitivas para transacciones en ambas monedas, tanto para operaciones PEN/USD como para pagos en contextos de comercio binacional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
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
