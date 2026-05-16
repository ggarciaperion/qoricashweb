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
const HOY = '2026-05-16T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
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
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
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
    destacada: true,
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
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
    imagen: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
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
