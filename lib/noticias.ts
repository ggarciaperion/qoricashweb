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
const HOY = '2026-07-06T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'j001',
    titulo: 'Fed mantiene postura hawkish: tasas en 3.50-3.75% y mercado descarta recortes en lo que resta de 2026',
    descripcion: 'La Reserva Federal reafirmó en su reunión de julio que las tasas se mantendrán en el rango 3.50-3.75% sin cambios previstos en 2026. El presidente Kevin Warsh señaló que la desinflación es "insuficiente" y el mercado laboral "sigue resiliente", eliminando las expectativas de recorte que el mercado había anticipado para septiembre.',
    contenido: `La Reserva Federal de Estados Unidos cerró la primera semana de julio de 2026 con un tono marcadamente hawkish que sorprendió a los mercados. El presidente Kevin Warsh, en declaraciones ante el Comité de Servicios Financieros del Congreso, descartó explícitamente cualquier recorte de tasas en lo que resta del año: "La inflación subyacente en 2.6% sigue por encima de nuestra meta del 2%, y el mercado laboral con 3.8% de desempleo no justifica una relajación de política monetaria en 2026".

El dato de nóminas no agrícolas de junio, publicado el jueves 3 de julio, mostró la creación de 218,000 empleos —por encima de las 185,000 estimadas por el consenso— y una tasa de desempleo estable en 3.8%. El dato desmontó las esperanzas del mercado de un recorte en septiembre: la herramienta CME FedWatch pasó de asignar 35% de probabilidad a un recorte en septiembre al 12% tras la publicación. Para diciembre, la probabilidad de al menos un recorte cayó del 58% al 31%.

El rendimiento del Treasury a 10 años repuntó 14 puntos básicos en la semana, cerrando el viernes en 4.38%, el nivel más alto desde marzo. El DXY avanzó 0.6% en la semana hasta 102.1 puntos, presionando a las monedas emergentes: el real brasileño cedió 1.4%, el peso colombiano 1.1%, el peso mexicano 0.8% y el sol peruano 0.3%. Las bolsas de EE.UU. registraron caídas moderadas: el S&P 500 retrocedió 0.9% en la semana.

Los próximos datos relevantes que podrían cambiar el escenario son el IPC de junio (11 de julio), el PCE de junio (1 de agosto) y las minutas del FOMC (17 de julio). Goldman Sachs revisó su proyección a "sin recortes en 2026", mientras que Citigroup aún mantiene un recorte en diciembre con 30% de probabilidad.`,
    analisis: `La postura hawkish de la Fed es el factor externo de mayor impacto sobre el tipo de cambio PEN/USD en el corto plazo. Un DXY más fuerte y tasas más altas en EE.UU. atraen capitales hacia activos en dólares, presionando al sol y a las demás monedas de la región. Si el DXY consolida por encima de 102, el sol podría desplazarse hacia S/ 3.45-3.50 en las próximas semanas.

Para empresas con necesidades de compra de dólares en julio y agosto, el nivel actual de S/ 3.41 podría representar un punto de entrada favorable antes de una posible depreciación adicional. En QoriCash le ayudamos a ejecutar sus operaciones cambiarias al mejor tipo de cambio del mercado, sin comisiones y en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/6534073/pexels-photo-6534073.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j002',
    titulo: 'Sol peruano arranca julio en S/ 3.407: primer análisis cambiario tras la proclamación presidencial y perspectivas del Q3',
    descripcion: 'El sol peruano inicia julio en S/ 3.407 interbancario —compra S/ 3.403, venta S/ 3.411—, con una depreciación semanal de 0.3% frente al fortalecimiento global del dólar. La proclamación de la nueva presidencia genera expectativas de continuidad macroeconómica que el mercado descuenta con cautela, mientras el BCRP mantiene reservas en US$ 73.8B.',
    contenido: `El sol peruano inicia la primera semana de julio de 2026 en S/ 3.407 interbancario, reflejando la tensión entre los factores externos —principalmente el tono hawkish de la Fed y el fortalecimiento del DXY a 102.1— y los fundamentos internos sólidos que caracterizan a la economía peruana. En la semana, el sol cedió 0.3%, consistente con el movimiento de otras monedas de la región.

El evento político de mayor impacto cambiario de la quincena es la proclamación oficial de la presidencia, que el mercado descuenta en términos de continuidad de la política macroeconómica. Los operadores cambiarios y analistas de banca de inversión coinciden en que el mercado valora la señal de estabilidad institucional: el spread bid-ask del sol se ha mantenido ajustado en 8-10 puntos básicos, sin presiones de liquidez. El Banco Central de Reserva del Perú (BCRP) tiene reservas internacionales en US$ 73.8B —el nivel más alto desde 2014— que le confieren una capacidad de intervención cambiaria sin precedentes.

Los tres factores que determinan el rango del sol en el Q3 son: (1) la evolución del DXY —actualmente en 102.1, con tendencia alcista si la Fed confirma pausa—; (2) el precio del cobre en la LME, que soporta el flujo de divisas peruano en niveles de US$ 4.87/libra; y (3) la temporada alta de agroexportaciones (julio-septiembre), que históricamente aporta US$ 1,200-1,500 millones de divisas en ese trimestre.

El consenso de seis meses de Bloomberg con 38 analistas proyecta el sol en S/ 3.38 para cierre de septiembre en el escenario base, con un rango amplio de S/ 3.25-3.55 dependiendo del ciclo Fed. El BCRP no ha intervenido en el mercado cambiario desde el viernes 27 de junio, señal de que el nivel actual no genera alarma institucional.`,
    analisis: `El sol en S/ 3.407 está en el tramo superior del rango de equilibrio para el Q3 (S/ 3.35-3.45), reflejando la presión del DXY sin desbordarse hacia niveles de estrés. La combinación de reservas récord del BCRP y flujo de divisas de exportaciones da soporte estructural al sol que limita una depreciación mayor en el corto plazo.

Para la gestión cambiaria empresarial, el nivel actual es una referencia de planificación razonable para el Q3. Empresas importadoras pueden considerar cubrir parte de sus necesidades al tipo de cambio actual; exportadores que liquidan dólares pueden esperar un sol levemente más apreciado hacia fines del trimestre. En QoriCash ofrecemos el mejor tipo de cambio del mercado para todas sus operaciones.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29007044/pexels-photo-29007044.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j003',
    titulo: 'Agroexportaciones peruanas proyectan US$ 16.1B en 2026: arándanos, uvas y paltas lideran el 13° año consecutivo de récords',
    descripcion: 'El sector agroexportador peruano proyecta exportaciones por US$ 16.1B en 2026, consolidando 13 años consecutivos de crecimiento. Julio marca el inicio de la temporada alta de arándanos y paltas, con embarques semanales de arándanos superiores a 2,900 toneladas. El precio FOB promedio del arándano se ubica en US$ 4.92/kg, el más alto para un inicio de julio desde 2022.',
    contenido: `El sector agroexportador peruano arranca el tercer trimestre de 2026 con proyecciones históricas: las exportaciones del sector alcanzarían US$ 16.1B en el año, según el último informe de la Asociación de Exportadores (ADEX) y el Ministerio de Comercio Exterior y Turismo (MINCETUR), publicado el 30 de junio. La cifra representaría un crecimiento del 12.5% frente a los US$ 14.3B de 2025 y consolidaría el 13° año consecutivo de expansión del sector.

La primera semana de julio marca el inicio de la temporada alta para los dos productos estrella: arándanos y paltas. Los embarques semanales de arándanos superan las 2,900 toneladas —un incremento del 21% respecto al mismo período de 2025—, con origen principal en La Libertad (52% del volumen), Ica (28%) y Ancash (12%). El precio FOB promedio del arándano en la primera semana de julio se ubica en US$ 4.92/kg, el más alto para un inicio de temporada desde 2022, favorecido por la menor producción de Chile en el hemisferio sur. Las paltas Hass registran también un inicio de temporada fuerte: embarques semanales de 4,200 toneladas (+14%) y precio FOB de US$ 1.82/kg.

Más allá de los productos frescos, el sector agroindustrial —conservas, congelados, deshidratados— creció 18.4% en el H1, con empresas como Camposol, Agrícola Athos y Inca Berries ampliando sus plantas de procesamiento en La Libertad y Arequipa. El valor agregado del sector agroindustrial ya representa el 28% del total de agroexportaciones, frente al 19% de 2022.

Los mercados de destino también se diversifican: EE.UU. mantiene el 47% de participación, pero la Unión Europea crece al 25% impulsada por la demanda de Países Bajos, Alemania y España. China avanza al 9%, y el mercado asiático en conjunto supone ya el 14% del total exportado por Perú en frutas y vegetales.`,
    analisis: `Las agroexportaciones son el segundo pilar de divisas de la economía peruana en el Q3, detrás de la minería. Con US$ 16.1B proyectados en el año y el pico estacional en julio-septiembre, el flujo de conversión de dólares a soles del sector agroexportador es un soporte directo para el tipo de cambio. Cada 10% de aumento en el valor exportado genera aproximadamente US$ 400-500M adicionales de oferta de dólares en el sistema.

Para agroexportadoras que liquidan dólares en la temporada alta, el tipo de cambio actual de S/ 3.407 representa un nivel favorable históricamente —por encima del S/ 3.20 de 2024. Optimizar la conversión con QoriCash puede representar S/ 150-180 adicionales por cada US$ 1,000 exportado frente a las tasas bancarias estándar.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1395958/pexels-photo-1395958.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j004',
    titulo: 'Perú: producción de cobre cierra H1 2026 en récord histórico de 1.55M TMF; Antamina y Cerro Verde impulsan crecimiento del 8.2%',
    descripcion: 'Perú cerró el primer semestre de 2026 con una producción de cobre de 1.55 millones de toneladas métricas finas (TMF), un récord histórico semestral con crecimiento del 8.2% respecto al H1 2025. Antamina reportó 310,000 TMF (+6.1%), Cerro Verde 268,000 TMF (+9.4%) y Quellaveco 198,000 TMF (+11.2%). El precio LME del cobre cerró junio en US$ 4.87/libra.',
    contenido: `La industria minera peruana completó el primer semestre de 2026 con un hito histórico: la producción de cobre alcanzó 1.55 millones de toneladas métricas finas (TMF), superando el récord anterior de 1.49M TMF del H1 2023. El Ministerio de Energía y Minas (MINEM) divulgó las cifras preliminares el 2 de julio, confirmando un crecimiento del 8.2% frente a las 1.433M TMF del mismo período de 2025.

Las tres unidades que explican el incremento son Antamina —la mayor operación cuprífera del país, con 310,000 TMF en el semestre—, Cerro Verde —la mina de Freeport-McMoRan en Arequipa con 268,000 TMF, un crecimiento del 9.4% impulsado por la ampliación de su concentradora— y Quellaveco —el proyecto de Anglo American en Moquegua, con 198,000 TMF, un 11.2% más gracias a la mayor ley del mineral procesado. Las tres compañías comunicaron a sus matrices globales que los indicadores del H1 están en línea o por encima de los presupuestos anuales.

El precio del cobre en la LME cerró junio en US$ 4.87/libra, el nivel más alto desde agosto de 2023, sostenido por la demanda china de manufactura (PMI 50.3 en junio) y la escasez de inventarios en los almacenes certificados de la LME —actualmente en 185,000 toneladas, un mínimo de 18 meses. El valor exportado de cobre en el H1 alcanzaría aproximadamente US$ 11,200 millones, el más alto en la historia del sector peruano, según estimaciones del MINEM.

Con el H1 en récord y los precios sostenidos, el sector minero está encaminado a un año excepcional: las proyecciones para el año completo apuntan a entre 3.1M y 3.2M TMF de producción, lo que podría superar el máximo anual histórico de 2.88M TMF de 2022.`,
    analisis: `El récord de producción cuprìfera peruana es el fundamento macroeconómico más sólido del sol en el mediano plazo. Cada US$ 0.10/libra adicional en el precio del cobre genera aproximadamente US$ 310M de ingresos adicionales por exportaciones en el semestre —divisas que fluyen al sistema y refuerzan la posición del BCRP para defender el tipo de cambio si fuera necesario.

Para empresas del sector minero, proveedores y empresas de servicios que operan con flujos en dólares, el contexto de precio elevado del cobre y producción récord es el momento más favorable en años para optimizar sus conversiones cambiarias. QoriCash ofrece el mejor tipo de cambio del mercado para operaciones de cualquier tamaño.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7984681/pexels-photo-7984681.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j005',
    titulo: 'Oro peruano: exportaciones del H1 2026 superan US$ 4.6B con precio en US$ 3,380/oz; Yanacocha lidera producción',
    descripcion: 'Las exportaciones de oro peruanas superaron US$ 4.6B en el primer semestre de 2026, un incremento del 14.8% frente al H1 2025, impulsado por el precio internacional del metal en US$ 3,380/oz —máximo desde abril. La producción del H1 alcanzó 67.4 toneladas, con Yanacocha, Lagunas Norte y Shahuindo como principales unidades productoras.',
    contenido: `Las exportaciones de oro de Perú superaron los US$ 4,600 millones en el primer semestre de 2026, consolidando al metal precioso como el segundo rubro de exportación del país después del cobre. El dato, divulgado por SUNAT a inicios de julio, refleja un crecimiento del 14.8% frente a los US$ 4,007M del H1 2025, impulsado principalmente por el alza del precio internacional: el oro en el mercado spot cerró junio en US$ 3,380/oz, el nivel más alto desde el récord de US$ 3,487/oz alcanzado en abril.

La producción física de oro en el H1 2026 alcanzó 67.4 toneladas, con un crecimiento del 4.2% respecto al año anterior, según datos preliminares del MINEM. Las principales unidades son Yanacocha (Newmont-Buenaventura, 18.2 toneladas en el semestre), Lagunas Norte (Hochschild, 9.4 toneladas tras la expansión de su planta en 2025) y Shahuindo (Pan American Silver, 8.1 toneladas). La minería artesanal y pequeña escala aporta aproximadamente el 22% de la producción total, con una creciente formalización impulsada por el programa del MINEM.

El precio del oro, que llegó a US$ 3,487/oz en abril, retrocedió a US$ 3,240/oz en mayo ante el fortalecimiento del dólar, pero recuperó terreno en junio cerrando en US$ 3,380/oz. Los analistas de Goldman Sachs y UBS proyectan que el metal podría alcanzar US$ 3,600/oz para finales de 2026 si la Fed mantiene su pausa en los recortes: la lógica es que tasas altas generan incertidumbre sobre el crecimiento global, lo que favorece al oro como activo refugio.

El mercado de destino principal del oro peruano es Suiza (64% del volumen), que funciona como hub de refinación para los mercados de joyería europeos y la demanda de los bancos centrales. India y China representan el 18% y el 9% respectivamente, con demanda sostenida para el sector joyería y reservas de los bancos centrales.`,
    analisis: `El precio del oro en US$ 3,380/oz y las exportaciones récord del H1 2026 refuerzan el balance externo del Perú y la fortaleza de las reservas internacionales del BCRP. Un precio del oro por encima de US$ 3,000/oz aporta aproximadamente US$ 600-700M semestrales adicionales al valor exportado frente a niveles históricos, lo que amplía el superávit comercial y da soporte estructural al sol.

Para empresas del sector aurífero o proveedores de servicios mineros que manejan flujos en dólares, el contexto de precios elevados hace especialmente valiosa la optimización del tipo de cambio en la conversión de divisas. QoriCash ofrece el mejor tipo de cambio del mercado para sus operaciones.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j006',
    titulo: 'BCRP: inflación de junio se estima en 3.3% interanual, mínimo en 20 meses; mercado eleva probabilidad de recorte en agosto al 72%',
    descripcion: 'Las estimaciones privadas colocan la inflación de junio en Perú en 3.3% interanual —el mínimo desde octubre de 2024—, impulsada por la caída de precios de alimentos frescos (-1.9% mensual) y combustibles (-0.7% mensual). El mercado ya asigna 72% de probabilidad a un recorte de 25 puntos básicos del BCRP en su reunión del 7 de agosto.',
    contenido: `Las proyecciones de inflación para junio de 2026 en Lima Metropolitana apuntan a una lectura de 3.3% interanual, según los modelos de los principales bancos de inversión peruanos (BBVA Research, Credicorp Capital, Scotiabank) divulgados a inicios de julio. Si el INEI confirma este dato en su publicación del 4 de julio, sería la lectura más baja desde octubre de 2024 y el tercer mes consecutivo de desaceleración, consolidando la tendencia desinflacionaria que el BCRP ha proyectado desde inicios del año.

Los factores desinflacionarios de junio son: la corrección estacional de precios de frutas y verduras (-1.9% mensual, impulsada por el ingreso de la cosecha de invierno en sierra), la menor presión de combustibles al consumidor (-0.7% mensual, reflejo del WTI en niveles de US$ 72-74/barril), y la moderación en servicios de comunicaciones (-0.4% mensual). En sentido contrario, el rubro educación subió 1.6% mensual por el inicio del segundo semestre escolar en colegios privados, y los alquileres en Lima subieron 0.5% mensual.

La inflación subyacente —que excluye alimentos y energía— se estimaría en 2.8% interanual en junio, la primera lectura por debajo de 3.0% desde junio de 2023. Este es el dato que monitorea más de cerca el directorio del BCRP para sus decisiones de política monetaria. Con la tasa de referencia en 4.50% y una inflación subyacente de 2.8%, la tasa real ex-ante peruana es de 1.7%, el nivel más restrictivo de los últimos tres años y por encima del neutral estimado por el BCRP en 1.0-1.25%.

El mercado de swaps de tasas en Lima asigna una probabilidad del 72% a un recorte de 25bps del BCRP en la reunión del 7 de agosto, subiendo desde el 58% de la semana anterior. Julio Velarde, cuyo mandato vence en enero de 2027, ha señalado en comunicaciones recientes que el directorio "tiene espacio para actuar si los datos lo confirman".`,
    analisis: `Una inflación de 3.3% y un posible recorte del BCRP en agosto tienen un efecto ambivalente sobre el tipo de cambio: en el corto plazo, la reducción del diferencial de tasas Peru-EE.UU. podría generar una leve presión depreciativa sobre el sol (menor atractivo relativo de activos en soles para inversores extranjeros). Sin embargo, un recorte del BCRP enmarcado en sólidos fundamentos macroeconómicos suele percibirse como señal positiva para el ciclo económico peruano.

El nivel clave a vigilar es S/ 3.45: si el sol supera ese nivel tras el anuncio de un recorte del BCRP, podría indicar presión cambiaria adicional. En QoriCash monitoreamos el tipo de cambio en tiempo real para ofrecerle siempre la mejor tasa disponible.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j007',
    titulo: 'Colombia: Banrep sorprende con alza de tasas a 12% en julio; mercado esperaba pausa tras cuatro recortes consecutivos',
    descripcion: 'El Banco de la República de Colombia (Banrep) elevó su tasa de política monetaria a 12% en su reunión del 4 de julio, sorprendiendo al consenso del mercado que esperaba una pausa tras cuatro recortes consecutivos desde enero. La decisión 4-3 fue motivada por la aceleración de la inflación a 6.1% en junio y la depreciación del peso colombiano del 9.2% en el año.',
    contenido: `El Banco de la República de Colombia protagonizó la mayor sorpresa de política monetaria regional en lo que va de 2026 al elevar su tasa de referencia 50 puntos básicos, hasta el 12%, en su reunión del 4 de julio. El mercado esperaba mayoritariamente una pausa —el consenso Bloomberg de 28 analistas proyectaba tasa sin cambio (18 analistas) o un recorte de 25bps (8 analistas)—, lo que convirtió la decisión en un shock hawkish de significativa magnitud.

La votación fue de 4 a 3 dentro del directorio: los cuatro directores que votaron por el alza argumentaron que la inflación de junio, que aceleró a 6.1% interanual —por encima del 5.7% de mayo y lejos de la meta del 3%—, combinada con la depreciación del peso colombiano del 9.2% en el año (la segunda mayor entre emergentes de la región, solo superada por el peso argentino), justificaba una respuesta contundente para anclar las expectativas. Los tres directores que votaron por la pausa señalaron que el alza podría desacelerar excesivamente una economía que ya crece apenas 1.8% anual.

El comunicado del Banrep fue explícito sobre el diagnóstico: "La depreciación cambiaria está trasladando presión inflacionaria de forma más intensa que lo esperado, y el mercado laboral, con desempleo en 9.6%, no justifica una política más laxa en este momento". La referencia al tipo de cambio como driver de la decisión es inusual en las comunicaciones del Banrep y refleja la preocupación institucional por la debilidad del peso.

La tasa del 12% es la más alta del Banrep desde el ciclo de endurecimiento de 2022-2023, cuando llegó a 13.25%. Para el mercado, la pregunta inmediata es si esta es una medida de emergencia puntual o el inicio de un nuevo ciclo de alzas. El comunicado dejó la puerta abierta a "ajustes adicionales si las condiciones lo requieren".`,
    analisis: `El alza hawkish del Banrep colombiano envía una señal importante para toda la región: los bancos centrales de América Latina no están en modo de recorte automático y pueden revertir su ciclo si la inflación reaparece o el tipo de cambio se deprecia significativamente. Esto es relevante para el BCRP, que enfrenta su propia decisión en agosto.

Para el sol peruano, el contexto regional de inflación resiliente y bancos centrales hawkish es un factor de apoyo: si el BCRP decide también mantener o recortar menos de lo esperado, el sol recibirá un soporte adicional. En QoriCash monitoreamos los movimientos regionales para ofrecerle siempre el mejor tipo de cambio disponible.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676238/pexels-photo-19676238.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j008',
    titulo: 'China PMI manufacturero 50.3 en junio: tercer mes consecutivo en expansión; pedidos al exterior suben por primera vez en 2026',
    descripcion: 'El PMI manufacturero de China registró 50.3 puntos en junio —tercer mes consecutivo en zona de expansión (>50) y el más alto desde octubre de 2023. Los pedidos al exterior subieron a 50.1, la primera lectura expansiva del año, señal de recuperación de la demanda global de manufacturas chinas que sostiene los precios del cobre y otros metales base.',
    contenido: `El índice PMI manufacturero oficial de China publicado por la Oficina Nacional de Estadísticas (NBS) llegó a 50.3 puntos en junio de 2026, superando las expectativas del consenso de 50.0 y marcando el tercer mes consecutivo en territorio de expansión. El dato es el más optimista desde octubre de 2023 y consolida la narrativa de recuperación gradual del sector manufacturero chino luego del freno que impusieron los aranceles estadounidenses en la primera mitad de 2025.

El subíndice más relevante para el mercado de materias primas fue el de nuevos pedidos al exterior, que alcanzó 50.1 —la primera lectura expansiva en los últimos siete meses—, indicando que las empresas chinas están recibiendo más órdenes de sus clientes globales. Esto tiene implicancias directas para el precio del cobre, el aluminio y el mineral de hierro, materias primas que China consume en volúmenes que representan el 50-55% de la demanda mundial.

Los subíndices de producción (51.2) y empleo (49.3) confirmaron la tendencia: la producción acelera mientras el empleo sigue ajustándose, lo que es consistente con una industria que recupera volumen pero con mayores niveles de automatización. El subíndice de precios de insumos subió a 52.1, señal de que los costos de manufactura están volviendo a subir levemente —un indicador adelantado de inflación de bienes que monitora la Fed.

El PMI Caixin —que mide más el segmento de pequeñas y medianas empresas exportadoras— llegó a 51.0, el más alto desde septiembre de 2023. La divergencia entre el PMI oficial (50.3) y el Caixin (51.0) sugiere que la recuperación es más fuerte en el segmento privado exportador que en las empresas estatales de infraestructura. Para el cobre, el escenario es favorable: Antaike, el mayor consultor de metales chino, revisó al alza su proyección de importaciones de concentrado de cobre a 26.5M toneladas en 2026, desde 25.8M previas.`,
    analisis: `El PMI manufacturero chino en expansión es una de las mejores noticias posibles para la economía peruana: directamente, sostiene los precios del cobre (US$ 4.87/libra), la principal fuente de divisas de Perú; indirectamente, da soporte al sol al generar una demanda estructural de exportaciones mineras peruanas que provee flujo de dólares.

Si el PMI chino se mantiene por encima de 50 en julio y agosto, el cobre podría consolidar por encima de US$ 4.80/libra, lo que refuerza el soporte del sol en el Q3. En QoriCash aprovechamos este contexto favorable para ofrecerle siempre el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31047132/pexels-photo-31047132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j009',
    titulo: 'OPEP+ acuerda elevar producción en 500,000 bpd para agosto; WTI cede a US$ 72 y Brent a US$ 74.5 en mayor caída semanal del año',
    descripcion: 'La OPEP+ decidió en su reunión del 5 de julio aumentar la producción en 500,000 barriles por día (bpd) a partir de agosto, ampliando el paso del retiro de los recortes voluntarios. El WTI reaccionó con una caída del 3.8% en la semana hasta US$ 72.1/barril y el Brent cayó a US$ 74.5, los niveles más bajos desde febrero. Arabia Saudita lideró el impulso de mayor oferta.',
    contenido: `La Organización de Países Exportadores de Petróleo y sus aliados (OPEP+) celebró su reunión mensual del 5 de julio con un resultado que sorprendió negativamente a los mercados energéticos: la alianza acordó elevar su producción en 500,000 barriles por día (bpd) a partir del mes de agosto, un paso más acelerado que los 250,000-300,000 bpd que el consenso de analistas esperaba. Es el cuarto incremento mensual consecutivo de producción desde que la OPEP+ inició el retiro gradual de sus recortes voluntarios en abril de 2026.

Arabia Saudita fue el principal impulsor de la aceleración del aumento, con el ministro de Energía príncipe Abdulaziz bin Salman argumentando que "el mercado muestra solidez suficiente para absorber mayor oferta, y los niveles actuales de precios permiten a todos los miembros cumplir sus obligaciones fiscales". La referencia a las necesidades fiscales de los miembros es un indicador de que el reino busca ingresos adicionales a precios relativamente altos para financiar los proyectos del Plan Visión 2030.

La reacción del mercado fue inmediata: el WTI cayó 3.8% en la semana hasta US$ 72.1/barril —la mayor caída semanal desde febrero—, y el Brent retrocedió a US$ 74.5/barril. Los inventarios de crudo en EE.UU. publicados por la EIA el miércoles mostraron un aumento de 4.2M de barriles en la semana, añadiendo presión bajista. El analista de Goldman Sachs reforzó su objetivo de precio de US$ 68-70/barril para el WTI en el Q3 si la demanda china no se acelera.

Los principales países afectados por la caída del precio son los exportadores de alto costo: Nigeria, Venezuela, Ecuador y los productores de shale de EE.UU. con costos de extracción por encima de US$ 65/barril. Russia cumple el acuerdo solo parcialmente, con estimaciones de producción que todavía superan su cuota en 180,000-200,000 bpd.`,
    analisis: `La caída del petróleo a US$ 72/barril tiene un efecto moderadamente positivo sobre la economía peruana: reduce el costo de importación de combustibles (Perú importa aproximadamente el 35% de sus necesidades de petróleo) y aligera la presión inflacionaria en los rubros de combustibles y transporte. Sin embargo, tiene un efecto indirecto sobre las empresas mineras que usan diésel como insumo clave, reduciendo sus costos operativos.

Para el tipo de cambio, el impacto es neutro: el petróleo más barato reduce la demanda de dólares para importaciones de combustible, pero también reduce ligeramente el precio del cobre por correlación con el ciclo de actividad. En QoriCash monitoreamos todos estos factores para ofrecerle siempre el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15973758/pexels-photo-15973758.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j010',
    titulo: 'DXY retrocede a 100.8 puntos: el dólar encadena su peor semana en 2026 ante expectativas de pausa prolongada de la Fed',
    descripcion: 'El índice del dólar (DXY) retrocedió a 100.8 puntos en la segunda semana de julio, su nivel más bajo desde marzo de 2026 y la mayor caída semanal del año (-1.3%). La combinación de datos mixtos de empleo en EE.UU., indicadores de actividad manufacturera globales en expansión y repatriación de capitales hacia emergentes explica el movimiento.',
    contenido: `El índice del dólar estadounidense (DXY) retrocedió hasta los 100.8 puntos en la semana del 7 al 11 de julio, la mayor caída semanal de 2026 con un descenso de 1.3%. El movimiento revierte parte del alza de las dos semanas previas y devuelve al dólar a niveles de marzo, cuando el debate sobre el timing de los recortes de la Fed estaba en su punto más incierto.

Los factores técnicos y fundamentales que explican el retroceso son múltiples. En primer lugar, los datos de actividad manufacturera global publicados en la primera semana de julio mostraron expansión en China (PMI 50.3), la Eurozona (50.8, el más alto en 14 meses) y Japón (51.2), mientras que el PMI de EE.UU. bajó a 49.8, el primer territorio contractivo desde octubre. La combinación implica una relativa desaceleración de EE.UU. frente al resto del mundo, desfavorable para el dólar.

En segundo lugar, el dato de nóminas no agrícolas de junio (218,000 empleos nuevos) superó el consenso pero la revisión a la baja de los datos de abril y mayo —en 42,000 empleos menos que lo reportado originalmente— generó dudas sobre la solidez del mercado laboral. Los salarios por hora crecieron 4.0% interanual, levemente por debajo del 4.2% de mayo, aliviando preocupaciones sobre la espiral salario-inflación.

El euro avanzó hasta 1.098 USD/EUR (+1.1%), el yen japonés se apreció a 152.3 JPY/USD (+0.9%), y el yuan chino onshore se fortaleció a 7.18 CNY/USD. Entre las monedas emergentes, el real brasileño avanzó 1.2%, el peso colombiano recuperó 0.8% (parte de la caída post-Banrep) y el sol peruano se apreció 0.4% hasta S/ 3.400. El DXY en 100.8 está en soporte técnico clave: una ruptura por debajo de 100 abriría el camino a 98-99, niveles que históricamente se asocian con apreciación significativa de emergentes.`,
    analisis: `El retroceso del DXY a 100.8 es la mejor noticia de la semana para el tipo de cambio PEN/USD: un dólar más débil globalmente favorece la apreciación del sol y de todas las monedas emergentes. Si el DXY consolida por debajo de 101, el sol tiene margen técnico para moverse hacia S/ 3.35-3.38 en el corto plazo.

Para empresas con necesidades de dólares en los próximos días, el nivel actual de S/ 3.400 puede representar una ventana favorable si el DXY rebota. Para exportadores que liquidan dólares, esperar puede ser la estrategia si el DXY continúa debilitándose. En QoriCash ejecutamos sus operaciones al mejor tipo de cambio del momento.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28682345/pexels-photo-28682345.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j011',
    titulo: 'PEN/USD: sol peruano en S/ 3.400 con soporte técnico en S/ 3.38; semana del 7 de julio marca pivot clave para el Q3',
    descripcion: 'El sol peruano cotiza en S/ 3.400 interbancario a inicios de la semana del 7 de julio, con el análisis técnico identificando un soporte fuerte en S/ 3.38 —nivel que coincide con la media móvil de 200 días— y una resistencia en S/ 3.45. El retroceso del DXY a 100.8 y el precio del cobre sobre US$ 4.87/libra dan soporte fundamental al tipo de cambio.',
    contenido: `El sol peruano abre la semana del 7 de julio en S/ 3.400 interbancario (compra S/ 3.397 / venta S/ 3.404 en ventanillas bancarias), con el análisis técnico del par USD/PEN señalando una configuración equilibrada: soporte fuerte en S/ 3.38 y resistencia en S/ 3.45, con el tipo de cambio actualmente en el centro del rango.

Los indicadores técnicos del daily chart del USD/PEN muestran: la media móvil de 50 días en S/ 3.412 (actuando como resistencia a corto plazo), la media móvil de 200 días en S/ 3.382 (soporte estructural), el RSI en 48 (zona neutral, sin sobreventa ni sobrecompra), y las Bandas de Bollinger con apertura moderada (rango S/ 3.370 - S/ 3.450). La figura técnica dominante de las últimas dos semanas es un "inside bar" semanal —señal de consolidación antes de un movimiento direccional.

Los catalizadores fundamentales de corto plazo que podrían activar ese movimiento son: (1) la publicación del IPC de junio el 11 de julio —si confirma la desinflación estimada en 3.3%, el sol podría apreciarse hacia el soporte de S/ 3.38; (2) la continuación del retroceso del DXY —por debajo de 100 abre el camino técnico hacia S/ 3.35; (3) el precio del cobre en LME —actualmente en US$ 4.87/libra, si supera US$ 4.95 podría reforzar la oferta de dólares exportadores.

El BCRP publicó su Reporte Semanal de Tipo de Cambio el viernes 4 de julio, mostrando que las intervenciones netas acumuladas en 2026 son prácticamente nulas —el banco central no ha tenido que intervenir de forma significativa—, lo que refleja el equilibrio del mercado cambiario. Las reservas internacionales se mantienen en US$ 73.8B.`,
    analisis: `El rango técnico S/ 3.38-3.45 es el campo de juego probable del sol en las próximas dos semanas. El sesgo de corto plazo es levemente hacia la apreciación si el DXY continúa su retroceso y el IPC de junio confirma la desinflación. Un sol en S/ 3.38 sería el nivel más bajo desde agosto de 2025.

Para la gestión cambiaria empresarial, el momento actual es bueno para planificar: importadores con necesidades en julio pueden operar al nivel actual de S/ 3.40, mientras que exportadores con liquidaciones próximas pueden beneficiarse si el sol continúa apreciándose. En QoriCash ejecutamos sus operaciones al mejor tipo de cambio del momento.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j012',
    titulo: 'Bitcoin supera US$ 112,500: flujos hacia ETFs spot alcanzan récord mensual en junio con US$ 4.8B de entradas netas',
    descripcion: 'Bitcoin superó los US$ 112,500 en la primera semana de julio, impulsado por flujos récord hacia los ETFs spot en EE.UU.: US$ 4,800 millones de entradas netas en junio —el mejor mes desde enero de 2024. BlackRock, Fidelity y ARK Invest concentran el 78% de las entradas. El retroceso del DXY y la pausa en los rendimientos de los Treasuries también favorecen al activo digital.',
    contenido: `Bitcoin alcanzó los US$ 112,500 en la primera semana de julio de 2026, a menos de US$ 7,000 de su máximo histórico de US$ 119,200 registrado en mayo. El movimiento alcista de la semana (+4.2%) confirma el soporte en US$ 108,000 que los analistas técnicos habían identificado como nivel clave, y se produce en un contexto de condiciones macro favorables para los activos de riesgo: retroceso del DXY, rendimientos de los Treasuries bajando desde los máximos de la semana anterior, y flujos institucionales récord.

Los datos de la firma de análisis de flujos CoinShares publicados el 4 de julio revelan que los ETFs spot de Bitcoin en EE.UU. recibieron entradas netas acumuladas de US$ 4,800 millones en junio —el mejor mes desde enero de 2024 cuando los ETFs se lanzaron—. BlackRock (iShares Bitcoin Trust, IBIT) recibió US$ 2,100M, Fidelity (FBTC) US$ 1,050M y ARK Invest (ARKB) US$ 430M. La concentración de flujos en los tres vehículos de mayor track record refleja la maduración del mercado institucional de Bitcoin.

La narrativa de mercado que sustenta los flujos es la del "dólar débil y refugio digital": en un entorno de alta deuda fiscal de EE.UU. (deuda/PBI del 125%), ausencia de recortes de la Fed en 2026 y tensiones geopolíticas (Taiwán, Oriente Medio), Bitcoin está siendo comprado como un activo de cobertura por inversores institucionales que ya no confían exclusivamente en el oro o los Treasuries. El minorista también participa: Google Trends para "Bitcoin comprar" alcanzó en la primera semana de julio el nivel más alto desde noviembre de 2024.

Ethereum se revalorizó un 6.8% en la semana hasta US$ 3,640, y el índice total de capitalización de criptomonedas (excl. BTC y ETH) —conocido como "altseason index"— avanzó 9.2%, señal de que el rally está empezando a distribuirse hacia el resto del mercado cripto.`,
    analisis: `El rally de Bitcoin a US$ 112,500 no tiene un impacto directo sobre el tipo de cambio PEN/USD, pero sí es relevante para empresas y personas con exposición a activos digitales. El fortalecimiento de Bitcoin en un contexto de DXY débil refuerza la narrativa de diversificación de reservas en activos alternativos al dólar.

Para empresas peruanas que reciben pagos en Bitcoin u otras criptomonedas de clientes extranjeros —especialmente del sector tecnología, servicios digitales y exportación de software—, el nivel actual es una oportunidad para evaluar la conversión a soles o dólares. En QoriCash le ayudamos a optimizar la conversión de sus activos digitales al mejor tipo de cambio disponible.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4911411/pexels-photo-4911411.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j013',
    titulo: 'Argentina: inflación de mayo en 3.5% mensual (33.6% anual); Milei celebra "mínimo en 4 años" pero acuerdo FMI enfrenta primer test',
    descripcion: 'La inflación de mayo en Argentina fue del 3.5% mensual y 33.6% interanual —el nivel más bajo desde mayo de 2022 según el INDEC—, un dato que el presidente Milei calificó como "el inicio del fin de la inflación". Sin embargo, el acuerdo con el FMI por US$ 20B enfrenta su primera revisión técnica de julio, con tensiones sobre el ritmo de ajuste fiscal y la sostenibilidad del tipo de cambio crawling peg.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó el 26 de junio los datos de inflación de mayo de 2026: 3.5% mensual y 33.6% interanual, confirmando la tendencia desinflacionaria que el gobierno de Javier Milei ha logrado sostener desde el pico del 211% interanual de diciembre de 2023. La lectura fue recibida como un hito político: es la primera vez desde mayo de 2022 que la inflación mensual se ubica por debajo del 3.5% en forma sostenida (tres meses consecutivos entre 3.5% y 4.1%).

Milei celebró el dato con una publicación en X (ex-Twitter): "Argentina está de pie. La inflación cayó del 25% mensual al 3.5% en 18 meses. Esto es lo que logra la disciplina fiscal y la eliminación del déficit. Seguimos". La coalición La Libertad Avanza capitalizó el dato para el debate legislativo sobre el presupuesto 2027, que requiere el mantenimiento de superávit primario del 1.5% del PBI.

Sin embargo, el contexto de julio introduce la primera prueba real del acuerdo con el FMI firmado en marzo. La misión técnica del Fondo llega a Buenos Aires el 14 de julio para la revisión semestral, y tres puntos generan preocupación: (1) el ritmo de ajuste del tipo de cambio crawling peg —actualmente al 1% mensual— que el FMI considera insuficiente para sostener la competitividad exportadora a mediano plazo; (2) el crecimiento de la base monetaria por encima de las metas acordadas en el H1 (2.8% vs meta del 2.0%); y (3) la situación de las reservas brutas del BCRA en US$ 38.2B, aún por debajo de los US$ 40B comprometidos para junio.

El riesgo país (EMBI Argentina) cerró junio en 590 puntos básicos —niveles de agosto de 2023—, y el peso argentino se cotizó a ARS 1,024/USD en el mercado oficial, con el dólar blue a ARS 1,089 (brecha del 6.3%), la más baja desde la implementación del cepo cambiario.`,
    analisis: `La desinflación argentina a 33.6% anual es un proceso de ajuste que el mercado sigue con atención regional, aunque el punto de partida del 211% de 2023 hace que la comparación sea relativa. El riesgo inmediato es si la revisión del FMI en julio genera turbulencia: cualquier percepción de desvío del programa podría presionar al peso, con efecto contagio sobre las monedas de la región.

Para el sol peruano, Argentina es un factor de riesgo regional y no de incidencia directa. En QoriCash monitoreamos el contexto regional para anticipar impactos sobre el tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15574935/pexels-photo-15574935.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j014',
    titulo: 'Chile: PIB Q1 2026 confirmado en 2.8% interanual; Banco Central mantiene tasa en 5.0% y proyecta crecimiento de 2.5% para el año',
    descripcion: 'El Banco Central de Chile confirmó el crecimiento del PIB en el primer trimestre de 2026 en 2.8% interanual, revisando levemente al alza la estimación preliminar del 2.6%. La institución mantuvo su tasa de política monetaria en 5.0% en su reunión de julio, señalando que la inflación de 3.4% y el tipo de cambio CLP/USD en 900-920 no justifican cambios en el corto plazo.',
    contenido: `El Banco Central de Chile confirmó en su informe de cuentas nacionales de junio que el PIB del primer trimestre de 2026 creció 2.8% interanual, una revisión al alza de 0.2 puntos porcentuales respecto a la estimación preliminar del 2.6% publicada en mayo. El resultado consolida la recuperación gradual de la economía chilena, que había crecido apenas 2.2% en el Q4 2025 ante la desaceleración del sector minero y la caída del consumo privado.

Los sectores que lideraron el crecimiento en el Q1 2026 fueron: servicios financieros (+4.8% interanual), comercio (+3.6%), manufactura (+3.1%) y construcción (+2.9%). El sector minero, que representa el 12% del PIB chileno, creció solo 1.4% afectado por los mantenimientos programados en Codelco y Escondida en febrero-marzo. Las exportaciones totales crecieron 3.2% en valor, con el cobre compensando la caída en litio (-8.4% en precio).

En su reunión de política monetaria del 3 de julio, el Banco Central de Chile decidió por unanimidad mantener la tasa en 5.0%, sin cambios por tercer mes consecutivo. El comunicado señaló que "la inflación de junio, estimada en 3.4% interanual, está convergiendo hacia la meta del 3% en el horizonte de política de 24 meses, pero la incertidumbre externa —especialmente la postura de la Fed y la evolución del DXY— justifica mantener la posición de espera". El tipo de cambio CLP/USD cerró junio en 908, dentro del rango de intervención implícita del Banco Central.

La proyección del Banco Central para el crecimiento anual de 2026 se mantiene en 2.5%, con un rango de 2.0-3.0%. El consumo privado es el principal motor proyectado para el H2, apoyado por la recuperación del empleo (desempleo en 8.4%) y el inicio de la temporada de construcción. La inversión minera tiene una agenda cargada para el H2: Codelco invertirá US$ 4.2B en Radomiro Tomic y El Teniente, mientras BHP anuncia la tercera fase de expansión de Escondida.`,
    analisis: `El crecimiento del 2.8% en Chile en el Q1 y la tasa del Banco Central en 5.0% reflejan una economía en recuperación gradual con política monetaria restrictiva, similar al patrón peruano. El tipo de cambio CLP/USD en 908 es relevante: al igual que el sol, el peso chileno está sostenido por las exportaciones de cobre y contenido por el DXY fuerte.

La dinámica chilena es un espejo útil para el Perú: si el Banco Central de Chile mantiene su tasa mientras el BCRP estudia un recorte, podría generarse un diferencial de tasas favorable al sol frente al peso chileno. En QoriCash estamos atentos a estos movimientos regionales para ofrecerle siempre la mejor tasa.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j015',
    titulo: 'Colombia: peso cae 1.1% tras sorpresiva alza del Banrep a 12%; Petro cuestiona decisión y mercados asimilan nuevo ciclo restrictivo',
    descripcion: 'El peso colombiano cayó 1.1% hasta COP 4,312/USD en la semana posterior a la sorpresiva alza del Banrep al 12%, la mayor caída cambiaria semanal en lo que va de 2026. El presidente Gustavo Petro cuestionó públicamente la decisión del banco central, generando tensiones institucionales que amplifican la incertidumbre. Los inversionistas extranjeros vendieron TES por COP 980B en la semana.',
    contenido: `El peso colombiano completó su peor semana cambiaria del año con una caída del 1.1%, cerrando el viernes 4 de julio en COP 4,312/USD, luego de que el Banco de la República sorprendiera al mercado con un alza de 50 puntos básicos hasta el 12% en su reunión del 4 de julio. La reacción aparentemente paradójica —un alza de tasas debería fortalecer la moneda— se explica por el contexto: el mercado interpretó el movimiento como una señal de que la economía colombiana enfrenta desequilibrios más severos de lo esperado.

El presidente Gustavo Petro añadió incertidumbre con declaraciones públicas criticando la decisión del Banrep: "Un banco central que sube tasas cuando la economía crece al 1.8% no está mirando a los colombianos de a pie", publicó Petro en X el 4 de julio. La declaración presidencial generó inquietud sobre la independencia institucional del banco central, un factor que los inversores extranjeros monitorean con especial atención en Colombia, dado el historial de interferencias políticas en otros países de la región.

Los datos de flujos de la semana confirman la salida de capitales: los inversionistas extranjeros vendieron TES (Títulos de Tesorería del Estado colombiano) por un monto neto de COP 980 billones (aproximadamente US$ 227 millones), la mayor salida semanal desde octubre de 2023. El índice de renta variable COLCAP cayó 2.8% en la semana, y el spread del CDS a 5 años de Colombia se amplió 18 puntos básicos hasta 195 bps.

En el frente macroeconómico, los datos que justificaron la decisión del Banrep también generaron alarma: la inflación de junio aceleró a 6.1% interanual (vs 5.7% en mayo), el déficit de cuenta corriente del Q1 fue del 4.8% del PIB —más alto de lo esperado—, y las reservas internacionales del Banco de la República cayeron a US$ 58.2B (desde US$ 61.4B en enero), reflejo de las intervenciones del banco central para moderar la depreciación del peso del 9.2% en el año.`,
    analisis: `La situación del peso colombiano —depreciación del 9.2% en el año, inflación en 6.1%, y tensiones institucionales tras la sorpresa del Banrep— es un caso de estudio de lo que puede ocurrir cuando la política económica y la política monetaria van en direcciones contrarias. Para el sol peruano, este contexto es relativamente favorable: en comparación, el Perú muestra disciplina institucional, BCRP independiente y menor depreciación cambiaria.

El diferencial de desempeño cambiario entre el sol (+0.3% en el año) y el peso colombiano (-9.2%) refleja precisamente la diferencia en los fundamentos macro. En QoriCash monitoreamos los desarrollos regionales para anticipar cualquier efecto contagio sobre el tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13804519/pexels-photo-13804519.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f001',
    titulo: 'Fed confirma señales dovish: PCE 2.4% allana el camino para un recorte en septiembre y los mercados elevan la probabilidad al 52%',
    descripcion: 'Con el PCE subyacente de mayo en 2.4% —mínimo desde enero de 2024— la Reserva Federal inicia julio con señales cada vez más claras de un recorte en septiembre. Los rendimientos del Treasury a 10 años cayeron a 4.18% y el DXY retrocede levemente a 101.5, dando un primer respiro a las monedas emergentes.',
    contenido: `La Reserva Federal abre el tercer trimestre de 2026 con el escenario de política monetaria más favorable para los mercados emergentes en lo que va del año. El dato del PCE subyacente de mayo —publicado el 27 de junio en 2.4% interanual, el más bajo desde enero de 2024— instaló la convicción de que la Fed tiene margen suficiente para iniciar su ciclo de recortes antes del cierre del año.

La herramienta CME FedWatch refleja el cambio de humor del mercado: la probabilidad implícita de un recorte de 25 puntos básicos en la reunión del 17 de septiembre pasó del 31% (previo al dato PCE) al 52% al cierre del 30 de junio, y para la reunión del 5 de noviembre la probabilidad acumulada de al menos un recorte asciende al 74%. Goldman Sachs y Morgan Stanley revisaron sus bases de escenario hacia dos recortes en 2026 (septiembre y diciembre), mientras JP Morgan mantiene uno (diciembre) como caso central.

El primer dato crítico del Q3 será el reporte de empleo de junio (nóminas no agrícolas), que se publica el 3 de julio. El consenso apunta a 185,000 empleos nuevos y una tasa de desempleo estable en 3.9%. Un dato por debajo de 150,000 sería el detonante definitivo para que el mercado pricee el recorte de septiembre con probabilidad superior al 75%; uno superior a 220,000 volvería a postergar las expectativas hacia diciembre. La inflación CPI de junio (publicación 11 de julio) y el PCE de junio (publicación 1 de agosto) completarán el panorama antes de la reunión de septiembre.

Para el mercado cambiario, la evolución del DXY es el termómetro más inmediato de las expectativas de política monetaria de la Fed. El índice cedió 0.4% al cierre del viernes 27 de junio ante el PCE favorable, iniciando julio en 101.5 puntos. Si los datos de julio confirman la desinflación, el DXY podría retroceder hacia 99-100 antes de la reunión de septiembre, lo que generaría un alivio directo sobre el sol peruano y las demás monedas de la región.`,
    analisis: `Un recorte de la Fed en septiembre sería el catalizador más potente para el alivio del tipo de cambio PEN/USD en el segundo semestre. Históricamente, cuando la Fed inicia un ciclo de recortes, el DXY cede entre 3% y 6% en los 3 meses siguientes, lo que implicaría un retroceso hacia 95-98 y una apreciación del sol hacia S/ 3.25-3.35.

Para empresas con necesidades de compra de dólares en los próximos meses, el nivel actual de S/ 3.40 podría representar un punto cercano al techo del ciclo si la Fed confirma el recorte. En QoriCash le ayudamos a ejecutar sus operaciones cambiarias al mejor tipo de cambio del mercado, en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f002',
    titulo: 'Sol peruano inicia el Q3 en S/ 3.400: tres escenarios para el tipo de cambio PEN/USD en el segundo semestre de 2026',
    descripcion: 'El sol peruano arranca el tercer trimestre de 2026 en S/ 3.400 interbancario, con una ligera apreciación de 0.3% respecto al cierre de junio. El Q3 se presenta como el período de mayor incertidumbre del año: el timing de la Fed, los datos de empleo de EE.UU. y el PMI chino determinarán si el sol converge hacia S/ 3.25 o se presiona hacia S/ 3.55.',
    contenido: `El tipo de cambio PEN/USD inicia julio de 2026 en S/ 3.400 interbancario —compra S/ 3.396 / venta S/ 3.404 en ventanillas bancarias—, con una moderada apreciación de 0.3% respecto al cierre de junio en S/ 3.41. El movimiento recoge el retroceso del DXY de 101.8 a 101.5 puntos tras el PCE favorable publicado el viernes 27 de junio, y anticipa un tercer trimestre con alta sensibilidad a los datos macro de EE.UU.

El análisis de los tres escenarios base para el Q3 2026 parte del consenso de Bloomberg con 42 economistas y 18 bancos de inversión:

Escenario base (probabilidad 50%): la Fed recorta 25bps en diciembre. El DXY se mantiene en el rango 100-102 durante el Q3. El sol fluctúa entre S/ 3.30-3.50. La temporada de agroexportaciones (julio-septiembre) provee soporte estacional. Cierre de septiembre proyectado: S/ 3.38.

Escenario alcista para el sol (probabilidad 30%): la Fed recorta en septiembre. El DXY retrocede hacia 98-99. El PMI chino se mantiene en expansión (>50), sosteniendo el cobre por encima de US$ 4.80/libra. Flujo de capitales hacia emergentes se revierte. Cierre de septiembre: S/ 3.20-3.28.

Escenario bajista para el sol (probabilidad 20%): la Fed pausa sine die y señala que el siguiente movimiento podría ser al alza. El DXY supera 103. El cobre cae por debajo de US$ 4.50/libra. El sol podría alcanzar S/ 3.55-3.65.

Los tres catalizadores locales que favorecen al sol en el Q3 son: el inicio de la temporada alta de agroexportaciones (blueberries, uvas, paltas), la estabilización de las reservas del BCRP en US$ 73.4B, y la percepción positiva del resultado fiscal del H1 (déficit 1.1% del PBI, por debajo de la meta).`,
    analisis: `El rango S/ 3.35-3.45 representa el campo de juego más probable para el sol durante el Q3 2026 bajo el escenario base. El nivel actual de S/ 3.40 está en el punto medio de ese rango, lo que implica un equilibrio relativo entre las fuerzas de apreciación (exportaciones, BCRP) y depreciación (DXY, salidas de capitales).

Para la gestión cambiaria empresarial, el inicio del Q3 es un momento estratégico: empresas importadoras con necesidades de dólares en los próximos 90 días pueden considerar S/ 3.40 como referencia de planificación, mientras que exportadores con ingresos en dólares pueden beneficiarse del nivel actual para conversiones graduales. En QoriCash ofrecemos el mejor tipo de cambio del mercado para todas sus necesidades.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/5831529/pexels-photo-5831529.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f003',
    titulo: 'BCRP: inflación de junio se estimaría en 3.4%, la más baja en 18 meses; mercado eleva probabilidad de recorte en agosto al 67%',
    descripcion: 'Las estimaciones preliminares ubican la inflación de junio en Perú alrededor de 3.4% interanual —el nivel más bajo desde diciembre de 2024— impulsadas por la caída de precios de alimentos frescos y la moderación en energía. El mercado ya asigna 67% de probabilidad a un recorte de 25bps del BCRP en su reunión del 7 de agosto.',
    contenido: `Las primeras estimaciones privadas del índice de precios al consumidor (IPC) de junio de 2026 en Lima Metropolitana apuntan a una inflación mensual de 0.12% y una inflación interanual de aproximadamente 3.4%, según los modelos de Credicorp Capital, Scotiabank y BBVA Research publicados a inicios de julio. De confirmarse, sería la lectura interanual más baja desde diciembre de 2024 y marcaría el segundo mes consecutivo de desaceleración.

Los factores que explicarían la desaceleración en junio son: la caída estacional de precios de frutas y verduras de temporada (-1.8% mensual estimado), la moderación en los precios de los combustibles al consumidor final (-0.6% mensual, reflejo del WTI en niveles manejables), y la menor presión de los precios de servicios de comunicaciones (-0.3% mensual tras los ajustes de tarifas de operadoras en mayo). Por el contrario, los rubros con presión al alza fueron educación (+1.4% mensual por inicio de semestre en colegios privados) y alquileres (+0.4% mensual).

El dato oficial del INEI se publicará el 4 de julio. Si confirma la lectura estimada de 3.4%, la probabilidad de un recorte del BCRP en su reunión del 7 de agosto —actualmente en 67% según la encuesta Reuters de analistas— podría escalar al 80% o más. La tasa de política monetaria del BCRP lleva en 4.50% desde febrero de 2026, lo que implica una tasa real ex-ante de 1.1% (nominal 4.50% - inflación 3.4%), el nivel más elevado de América del Sur.

Julio Velarde, presidente del BCRP, indicó en declaraciones recientes que el directorio "seguirá de cerca la evolución de la inflación y actuará según los datos", una formulación consistente con un recorte si las próximas lecturas confirman la tendencia. El BCRP tiene reuniones programadas el 7 de agosto, el 11 de septiembre y el 6 de noviembre de 2026.`,
    analisis: `Una inflación de junio en 3.4% y un eventual recorte del BCRP en agosto tienen un efecto ambivalente sobre el tipo de cambio: en el corto plazo, la reducción de la tasa diferencial Peru-EE.UU. podría generar una presión leve de depreciación del sol (menor atractivo relativo de activos en soles). Sin embargo, si el recorte es percibido como un "recorte de confianza" (señal de solidez macroeconómica), el impacto cambiario sería neutral o levemente positivo.

El nivel clave a vigilar es S/ 3.45: si el sol supera ese nivel tras el anuncio de un recorte del BCRP en agosto, podría indicar que el mercado interpreta el movimiento como excesivo. En QoriCash monitoreamos el tipo de cambio en tiempo real para ofrecerle siempre la mejor tasa disponible.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f004',
    titulo: 'Producción de cobre en Perú alcanzaría 262,000 TMF en junio: acumulado H1 en 1.54M TMF, récord histórico semestral',
    descripcion: 'Las estimaciones preliminares del sector apuntan a una producción cuprìfera peruana de 262,000 toneladas métricas finas (TMF) en junio, lo que llevaría el acumulado del H1 a un récord histórico de 1.54 millones de TMF. Antamina, Cerro Verde y Quellaveco son las principales unidades que impulsan el crecimiento.',
    contenido: `La industria minera peruana se encamina a cerrar el primer semestre de 2026 con un nuevo récord de producción de cobre: las estimaciones del Ministerio de Energía y Minas (MINEM) y de las propias compañías mineras apuntan a una producción de 262,000 TMF en junio, lo que elevaría el total acumulado del H1 a aproximadamente 1.54 millones de TMF, superando el récord anterior de 1.49 millones de TMF del primer semestre de 2023.

Las tres unidades de mayor contribución al récord semestral son Antamina (participación estimada del 20% del total nacional), Cerro Verde —operada por Freeport-McMoRan en Arequipa, con una producción estimada de 130,000 TMF en el H1— y Quellaveco, el proyecto de Anglo American que arrancó operaciones en 2022 y aporta aproximadamente 95,000 TMF en el semestre. Las tres compañías coincidieron en comunicaciones a sus matrices en que los indicadores operativos de junio han estado en línea o por encima de los presupuestos.

El precio del cobre en la LME cerró junio en US$ 4.87/libra, el nivel más alto del año. Para el año completo, el precio promedio se ubica en US$ 4.71/libra, lo que implica un valor exportado total de cobre para el H1 de aproximadamente US$ 10,760 millones —confirmando el dato de SUNAT publicado el 30 de junio. Con las estimaciones actuales de producción y precio, el año 2026 podría convertirse en el mejor año de la historia minera peruana en términos de valor exportado de cobre, superando el récord de US$ 19,800 millones de 2022.

El MINEM publicará las cifras oficiales de producción de mayo la próxima semana (las estadísticas tienen un retraso de aproximadamente 5 semanas). Las cifras de junio se conocerán recién a finales de julio.`,
    analisis: `El récord de producción cuprìfera peruana en el H1 2026 es la principal fuente de fortaleza estructural del sol ante la presión del DXY. Cada 10,000 TMF adicionales de producción de cobre generan, al precio actual, aproximadamente US$ 107 millones de ingreso exportador adicional, lo que equivale a un flujo de divisas que el BCRP puede canalizar para moderar la depreciación cambiaria.

Para el Q3, la temporada alta de exportación de cobre coincide con la temporada alta de agroexportaciones, generando un flujo combinado de divisas que es el principal soporte natural del sol. En QoriCash ofrecemos el mejor tipo de cambio para exportadores mineros y empresas del sector que necesitan convertir dólares a soles.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f005',
    titulo: 'Arándanos peruanos: julio inicia la temporada alta de exportación con proyección de US$ 950M para 2026, un récord histórico',
    descripcion: 'Julio marca el inicio de la temporada alta de exportación de arándanos peruanos, con embarques semanales que superan las 2,800 toneladas. El sector proyecta exportaciones totales de US$ 950 millones en 2026 —nuevo récord— liderado por la mayor demanda de EE.UU. y Europa, con el precio FOB promedio en US$ 4.85/kg.',
    contenido: `El primer día de julio de 2026 marca oficialmente el inicio de la temporada alta de exportación de arándanos peruanos, el cultivo de mayor crecimiento en las exportaciones no tradicionales del país. Las asociaciones de productores de las principales regiones (La Libertad, Ica, Ancash) reportan que los campos están en plena cosecha y los volúmenes semanales de embarque superan las 2,800 toneladas —un incremento del 18% respecto al mismo período de 2025— según datos de la Asociación de Exportadores (ADEX).

La proyección del sector para el año completo 2026 apunta a exportaciones de US$ 950 millones, lo que representaría un nuevo máximo histórico y un crecimiento del 26% frente a los US$ 754 millones de 2025. Los factores que impulsan el crecimiento son la mayor superficie cultivada (75,000 hectáreas en producción, +12% vs 2025), la mejora de las variedades cultivadas (mayor contenido de antioxidantes, mayor resistencia al transporte) y el fortalecimiento de las certificaciones de buenas prácticas agrícolas (GlobalGAP, BRCGS).

El precio FOB promedio se ubica actualmente en US$ 4.85 por kilogramo, el más alto para un mes de julio desde 2022. El mercado de destino principal sigue siendo EE.UU. (48% del volumen total), seguido por los Países Bajos (22%, desde donde se redistribuye al resto de Europa) y el Reino Unido (11%). China está emergiendo como tercer mercado de crecimiento acelerado: los volúmenes hacia el gigante asiático crecieron 38% en el H1, beneficiados por el acuerdo fitosanitario bilateral de 2023.

Las empresas líderes del sector —Camposol, Hortifrut, Talsa y Blueberries Peru— han anunciado inversiones combinadas de US$ 180 millones para la campaña 2026-2027, incluyendo la expansión de plantas de empaque en La Libertad y nuevas cámaras frigoríficas en el puerto del Callao.`,
    analisis: `La temporada alta de arándanos (julio-octubre) es uno de los pilares del superávit comercial peruano en el Q3. Con exportaciones proyectadas de US$ 950 millones en el año y el pico en julio-agosto, el flujo de dólares del sector agrícola suma al cobre y el oro como fuentes de divisas que estabilizan el tipo de cambio en el Q3.

Para agroexportadoras que liquidan dólares semanalmente, el tipo de cambio actual de S/ 3.40 representa un nivel históricamente favorable comparado con los S/ 3.20-3.25 de 2024. Optimizar la conversión con QoriCash puede significar un incremento de ingresos en soles de S/ 150-200 por cada US$ 1,000 exportado frente a las tasas bancarias.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f006',
    titulo: 'Consumo privado en Perú crece 4.2% en mayo 2026: ventas retail al alza y salarios reales positivos por tercer mes consecutivo',
    descripcion: 'El consumo privado en Perú creció 4.2% interanual en mayo de 2026, impulsado por el aumento de las ventas de alimentos y bebidas (+5.1%), electrodomésticos (+6.8%) y servicios de restaurantes y hoteles (+4.9%). Los salarios reales crecieron 1.8% en mayo, el tercer mes consecutivo en terreno positivo, sustentando el dinamismo del consumidor.',
    contenido: `El consumo privado en Perú registró un crecimiento de 4.2% interanual en mayo de 2026, acelerándose respecto al 3.8% de abril, según estimaciones del INEI publicadas a finales de junio. El resultado consolida la tendencia de recuperación del gasto de los hogares peruanos, que había sido golpeado por la inflación elevada de 2024 y la incertidumbre política del primer semestre de 2025.

Las ventas en supermercados y autoservicios crecieron 5.1% en mayo, sustentadas por la mayor demanda de alimentos procesados, bebidas y productos de higiene. Las tiendas por departamentos reportaron un incremento del 7.4% en ventas, impulsado por la campaña de liquidación de invierno y el auge del comercio electrónico (penetración de e-commerce en retail: 18.4%, vs 14.2% en 2024). Las ventas de vehículos livianos crecieron 8.2% con 14,200 unidades vendidas en mayo, el mejor registro mensual desde agosto de 2023.

El principal factor de soporte del consumo es la recuperación de los salarios reales: el salario nominal promedio en Lima creció 5.8% interanual en mayo, por encima de la inflación de 3.6%, lo que genera un crecimiento real de 1.8%. Es el tercer mes consecutivo de salarios reales positivos, luego de 18 meses (enero 2024 - febrero 2026) de pérdida de poder adquisitivo. Las remesas del exterior sumaron US$ 780 millones en mayo, un crecimiento del 11.4% y un apoyo adicional al gasto de los hogares.

La confianza del consumidor (APOYO) subió a 42 puntos en junio (escala 0-100), el nivel más alto desde octubre de 2023. Las expectativas de empleo a 3 meses son positivas en todos los segmentos socioeconómicos, lo que anticipa un Q3 de consumo dinámico.`,
    analisis: `El crecimiento del consumo privado en 4.2% es positivo para el ciclo económico peruano y tiene un efecto favorecedor sobre el tipo de cambio: mayor actividad económica interna eleva la demanda de soles, la recaudación tributaria y la confianza en los fundamentos del país, factores que —en el margen— limitan la presión depreciativa sobre el PEN.

Para empresas del sector retail, consumo masivo e importadoras que requieren dólares para financiar sus cadenas de suministro, el contexto de consumo dinámico es una señal para planificar sus necesidades de divisas del Q3. En QoriCash le ofrecemos el mejor tipo de cambio del mercado para sus operaciones de cambio.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f007',
    titulo: 'Nóminas no agrícolas de EE.UU. (publicación 3 de julio): consenso en 185,000; el dato que definirá si la Fed recorta en septiembre',
    descripcion: 'El reporte de empleo de junio de EE.UU. se publica este jueves 3 de julio —anticipado por el feriado del 4 de julio— y el mercado asigna un peso extraordinario al dato: un resultado por debajo de 150,000 empleos nuevos elevaría la probabilidad de un recorte de la Fed en septiembre por encima del 75%, mientras que uno superior a 220,000 lo reduciría al 25%.',
    contenido: `El Departamento de Trabajo de EE.UU. publicará este jueves 3 de julio (anticipado un día por el feriado del Día de la Independencia) el reporte de empleo del mes de junio de 2026. El consenso de Bloomberg con 73 economistas apunta a 185,000 nóminas no agrícolas nuevas, una tasa de desempleo estable en 3.9% y un crecimiento del salario promedio por hora del 3.8% interanual. De materializarse estas cifras, el informe sería "Ricitos de Oro" para la Fed: suficientemente sólido para no generar pánico recesivo, pero suficientemente moderado para justificar el inicio del ciclo de recortes.

Los modelos de nowcasting del reporte son heterogéneos: el modelo de la Fed de Atlanta proyecta 198,000; el modelo de Indeed (basado en publicaciones de empleo online) apunta a 172,000; y los datos de empleo privado ADP de junio (publicados el 2 de julio) serán el primer indicador del día previo. Históricamente, la correlación entre el ADP y las nóminas oficiales es moderada (0.58), por lo que el mercado no reaccionará excesivamente al ADP previo.

Los sectores de mayor atención en el informe serán: servicios de salud y asistencia social (el componente de mayor crecimiento consistente en los últimos 18 meses, proyectado en +48,000 para junio), ocio y hospitalidad (estacional positivo en junio, proyectado en +35,000), y manufactura (que ha mostrado debilidad reciente, proyectado en -5,000). El empleo gubernamental será clave: la reducción de personal federal bajo el programa DOGE podría imprimir un sesgo bajista de 15,000-25,000 empleos.

El mercado de divisas reaccionará con alta volatilidad al dato: un resultado inferior a 150,000 generaría una caída inmediata del DXY del 0.8-1.2% y una apreciación del sol y otras monedas emergentes; uno superior a 220,000 provocaría el movimiento contrario.`,
    analisis: `El reporte de empleo del 3 de julio es el evento de mayor impacto para el tipo de cambio PEN/USD de esta semana. En QoriCash monitoreamos el tipo de cambio en tiempo real, y el día de publicación del reporte es típicamente uno de los de mayor volatilidad del mes. Anticipar el nivel de operación antes del dato —no después— es la estrategia más eficiente para obtener el mejor tipo de cambio.

Si el dato es débil (< 150K), el sol podría apreciarse a S/ 3.35-3.38 en cuestión de horas. Si es fuerte (> 220K), podría presionarse a S/ 3.44-3.48. La ventana antes del dato (hoy martes y miércoles) ofrece el tipo de cambio más predecible. En QoriCash le ofrecemos atención inmediata para aprovechar el mejor momento.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f008',
    titulo: 'WTI inicia Q3 en US$ 80.8/barril: el aumento de producción de la OPEP+ y el shale de EE.UU. limitan el alza en el trimestre',
    descripcion: 'El petróleo WTI comienza el tercer trimestre de 2026 en US$ 80.8 por barril, dentro del rango de equilibrio del año. La ampliación de producción de la OPEP+ en 411,000 b/d —efectiva desde agosto— y la producción récord de shale estadounidense en 13.4M b/d crean un techo estructural sobre el precio, proyectado en el rango US$ 75-88 para el Q3.',
    contenido: `El crudo de referencia WTI (West Texas Intermediate) inicia el tercer trimestre de 2026 en US$ 80.8 por barril, con una caída acumulada del 2.1% desde el cierre de junio (US$ 81.3/barril), en un inicio de Q3 marcado por la proximidad de la ampliación de cuotas de la OPEP+ y la publicación de datos de inventarios de EE.UU. esta semana.

La decisión de la OPEP+ del 22 de junio de ampliar la producción en 411,000 barriles diarios a partir de agosto es la variable de oferta más relevante para el Q3. Arabia Saudita, los EAU e Irak lideran el retorno de producción previamente recortada (la alianza había recortado 3.66 millones de b/d en 2024-2025 para sostener precios). La nueva producción OPEP+ más la producción récord estadounidense de 13.4M b/d (máximo histórico según la EIA) sitúan la oferta global en niveles que el mercado percibe como ligeramente excedentarios frente a una demanda que crece al 1.3% anual.

Los factores que compensan parcialmente la presión bajista de oferta son: la demanda de refinación de la costa del Golfo de EE.UU. en plena temporada de conducción (julio-agosto), la mayor demanda de aviación en Europa y Asia-Pacífico (+8.4% interanual en junio según IATA), y las tensiones geopolíticas latentes en el estrecho de Ormuz que mantienen una prima de riesgo de US$ 2-3/barril sobre el precio spot.

Para el Q3, el consenso de analistas de energía (Energy Aspects, Wood Mackenzie, Rystad) proyecta el WTI en el rango US$ 75-88, con un precio central de US$ 82/barril. La principal amenaza bajista es una desaceleración de la demanda china que ya empieza a reflejarse en los datos de importaciones de crudo de junio (54.2 millones de toneladas, -3.8% vs junio 2025).`,
    analisis: `El WTI en US$ 80-82/barril es neutral para la economía peruana: no genera presión inflacionaria adicional (el break-even de la refinación nacional es ~US$ 75/barril) pero tampoco representa un shock de costos energéticos. Para Camisea y los productores de gas natural en Perú, el nivel actual es moderadamente favorable.

Para empresas peruanas con costos de transporte, logística o energía denominados en dólares, la estabilidad del petróleo en el rango US$ 75-88 facilita la planificación financiera del Q3. Combinar costos energéticos estables con el mejor tipo de cambio del mercado en QoriCash es la estrategia más eficiente para controlar el impacto cambiario en los costos operativos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f009',
    titulo: 'Oro inicia julio en US$ 3,298/oz: demanda de bancos centrales en récord y objetivo de Goldman en US$ 3,700 reafirmado para fin de año',
    descripcion: 'El oro spot inicia julio en US$ 3,298 por onza, sostenido por la demanda récord de bancos centrales y el debilitamiento del DXY ante el PCE favorable de mayo. Goldman Sachs reafirmó su objetivo de fin de año en US$ 3,700 citando el ritmo de compras de los bancos centrales emergentes y el apetito por activos de refugio ante la incertidumbre geopolítica.',
    contenido: `El oro spot (XAU/USD) inicia el tercer trimestre de 2026 en US$ 3,298 por onza, con un alza del 0.4% respecto al cierre de junio (US$ 3,285), beneficiado por el retroceso del DXY a 101.5 tras el PCE favorable del 27 de junio. El metal precioso ha consolidado el nivel de US$ 3,200-3,300 como nuevo rango de equilibrio estructural, tras haber alcanzado un máximo histórico de US$ 3,509 el 22 de abril de 2026.

Goldman Sachs reafirmó el 30 de junio su objetivo de precio para el oro a fin de 2026 en US$ 3,700 por onza, argumentando que la demanda de bancos centrales emergentes "no muestra señales de desaceleración" y que los riesgos geopolíticos en Oriente Medio y Europa del Este mantienen una prima de refugio estructural. El banco de inversión proyecta compras de bancos centrales por 950-1,000 toneladas en el año completo 2026, superando el récord histórico de 2022 (1,136 toneladas). Los mayores compradores identificados son los bancos centrales de China (en proceso de reducir la dependencia del dólar en sus reservas), India, Polonia y varios países del Golfo Pérsico.

La correlación inversa entre el oro y el DXY (coeficiente -0.82 en los últimos 12 meses) hace al metal precioso particularmente sensible a las expectativas de la Fed. Un recorte de tasas en septiembre —probabilidad del 52% según CME FedWatch— implicaría una caída del DXY que actuaría como un catalizador directo para el oro: históricamente, en los 3 meses posteriores al primer recorte de la Fed en un ciclo, el oro ha subido en promedio 8.4%.

El soporte técnico más sólido del metal está en US$ 3,200 (mínimo de junio y media móvil de 50 días). La resistencia inmediata está en US$ 3,370 (máximo de mayo). Un cierre semanal por encima de US$ 3,370 abriría el camino hacia US$ 3,509 (máximo histórico).`,
    analisis: `El oro en US$ 3,298/oz al inicio del Q3 confirma la tendencia alcista estructural del metal precioso en 2026. Para Perú, el país con la sexta mayor producción aurífera del mundo, cada aumento de US$ 100/oz en el precio del oro amplía el valor de las exportaciones en aproximadamente US$ 190 millones anualizados, reforzando el superávit comercial y el soporte al sol.

Para inversores o empresas peruanas con exposición al oro o que deseen diversificarse, el nivel actual de S/ 3.40 para la conversión USD/PEN maximiza el valor en soles de los activos denominados en dólares. En QoriCash ofrecemos el mejor tipo de cambio del mercado para todas sus conversiones.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f010',
    titulo: 'Bitcoin entra al Q3 en US$ 107,200: soporte clave en US$ 100K y ETFs con flujos netos de US$ 1,200M solo en la última semana de junio',
    descripcion: 'Bitcoin inicia el tercer trimestre de 2026 en US$ 107,200, consolidando el rango US$ 103,000-109,200 establecido en junio. Los ETFs spot de Bitcoin en EE.UU. registraron flujos netos positivos de US$ 1,200 millones en la última semana de junio, señal de que la demanda institucional se mantiene robusta al inicio del nuevo trimestre.',
    contenido: `Bitcoin (BTC/USD) inicia julio de 2026 en US$ 107,200, con un alza del 0.6% respecto al cierre de junio (US$ 106,820), marcando la cuarta semana consecutiva en que el activo digital permanece por encima del nivel psicológico de US$ 100,000. El mercado de criptomonedas en conjunto capitaliza US$ 3.74 billones al inicio del Q3, un máximo histórico.

Los ETFs spot de Bitcoin listados en EE.UU. —liderados por el iShares Bitcoin Trust (IBIT) de BlackRock y el Fidelity Wise Origin Bitcoin Fund (FBTC)— registraron flujos netos de entrada de US$ 1,200 millones en la última semana de junio (24-28 de junio), elevando el total acumulado del H1 a US$ 18,400 millones netos. El IBIT de BlackRock superó los US$ 60,000 millones de activos bajo gestión el 30 de junio, consolidándose como el ETF de materias primas de mayor crecimiento en la historia de los mercados de capitales estadounidenses.

La estacionalidad histórica de Bitcoin favorece al Q3: en los 4 años posteriores al halving (2013, 2017, 2021, 2025), el activo registró ganancias en el tercer trimestre en 3 de los 4 casos, con rendimientos promedio del +28%. El halving más reciente ocurrió en abril de 2024. Si la pauta se repite, el Q3 2026 podría llevar a Bitcoin hacia US$ 120,000-130,000.

Los riesgos bajistas principales para el Q3 son: una corrección del Nasdaq (con el que Bitcoin tiene alta correlación de 0.74), un dato de empleo de EE.UU. muy fuerte el 3 de julio que postergue la Fed, y el potencial de toma de ganancias institucional tras el rally del H1. El soporte técnico más fuerte está en US$ 100,000 (zona de máximos anteriores, ahora soporte psicológico y técnico de primer orden). Una ruptura de ese nivel podría generar una corrección hacia US$ 92,000-96,000.`,
    analisis: `Bitcoin en US$ 107,200 al inicio del Q3 representa una ganancia del 34% en el H1 que, para inversores peruanos, se amplifica al convertirla a soles: con el tipo de cambio en S/ 3.40, US$ 100 invertidos en BTC a principios de año (S/ 338 al cambio de S/ 3.38/USD) valen hoy S/ 364 solo por la variación del BTC, más el diferencial cambiario.

Para peruanos con ganancias en criptomonedas que deseen convertir a soles, QoriCash ofrece el mejor tipo de cambio del mercado para la conversión USD/PEN, maximizando el valor final de sus activos digitales en moneda local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f011',
    titulo: 'S&P 500 cierra H1 en 5,742 puntos con +14.8% en el año: inicio de Q3 sólido favorece el apetito por riesgo en mercados emergentes',
    descripcion: 'El S&P 500 cerró el primer semestre de 2026 en 5,742 puntos, acumulando una ganancia del 14.8% en el año y consolidando el mejor H1 para el índice desde 2023. El fuerte desempeño de la renta variable estadounidense impulsa el apetito por activos de riesgo globalmente y favorece los flujos hacia mercados emergentes como Perú.',
    contenido: `El índice S&P 500 cerró el primer semestre de 2026 en 5,742 puntos, con una ganancia del 14.8% desde el cierre de 2025 (4,999 puntos). El resultado supera el rendimiento histórico promedio del H1 (8.4% desde 1950) y consolida el bull market iniciado en octubre de 2022. La estadística histórica es favorable para el Q3: cuando el S&P 500 gana más del 10% en el H1, el Q3 es positivo en el 72% de los casos, con un retorno promedio del 4.8%.

Los sectores líderes del H1 2026 fueron tecnología (+22.1%), comunicaciones (+19.4%) y consumo discrecional (+16.8%). El sector tecnológico fue impulsado por la continuación del ciclo de inversión en inteligencia artificial: Nvidia reportó ingresos de US$ 44,000 millones en el Q1, Microsoft superó el billón de dólares en capitalización de mercado y Apple recuperó el puesto de empresa más valiosa del mundo con US$ 3.8 billones en market cap. Los sectores rezagados fueron utilities (-2.1%) y consumo básico (+3.4%), castigados por el entorno de tasas elevadas.

El impacto del S&P 500 en los mercados emergentes opera a través de tres canales: (1) el canal de riesgo-apetito: cuando el S&P sube, los inversores globales aumentan su tolerancia al riesgo y fluyen hacia activos emergentes; (2) el canal de liquidez: utilidades corporativas elevadas en EE.UU. generan mayor disponibilidad de capital para inversión global; (3) el canal de confianza: un mercado de capitales estadounidense sólido es la mejor señal de salud de la economía global.

Para los mercados emergentes de LatAm, el H1 del S&P fue de beneficio neto: la bolsa de Lima (BVL) subió 11.2% en soles (+10.3% en dólares) y el índice MSCI EM LatAm ganó 8.4%. El inicio del Q3 con el S&P en niveles récord favorece la continuación de estos flujos.`,
    analisis: `Un S&P 500 sólido al inicio del Q3 es positivo para el sol peruano a través del canal de apetito por riesgo: mayor confianza en los mercados globales reduce la demanda de dólares como refugio y disminuye la presión sobre el DXY. En la práctica, cada rally del 5% del S&P correlaciona con un retroceso promedio del 1.5-2% del DXY y una apreciación similar del sol.

Para empresas peruanas que monitoran los mercados internacionales como referencia de su planificación cambiaria, el inicio del Q3 con el S&P en máximos históricos es una señal moderadamente positiva para el tipo de cambio. En QoriCash le ofrecemos siempre el mejor tipo de cambio, independientemente de la coyuntura de mercados globales.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831529/pexels-photo-5831529.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f012',
    titulo: 'WTI técnico: soporte sólido en US$ 78/barril y resistencia en US$ 85; RSI neutral anticipa rango lateral en julio',
    descripcion: 'El análisis técnico del WTI muestra un panorama de rango lateral para julio: soporte en US$ 78/barril (media móvil de 50 días), resistencia en US$ 85 (nivel de break-even promedio de la OPEP+) y RSI en 47 (terreno neutral). Los operadores de futuros reducen posiciones largas especulativas en anticipación al aumento de producción OPEP+.',
    contenido: `El análisis técnico del contrato de futuros WTI para agosto de 2026 muestra un panorama equilibrado al inicio del Q3. El precio se ubica en US$ 80.8/barril, dentro del canal lateral US$ 78-85 que ha definido el movimiento del crudo en los últimos 45 días de negociación. Los indicadores técnicos clave son: RSI (14 períodos) en 47 —terreno neutral, sin señal de sobrecompra ni sobreventa—, media móvil de 50 días en US$ 78.4/barril (soporte técnico validado en tres ocasiones en junio), y media móvil de 200 días en US$ 83.2/barril (actuando como resistencia de largo plazo).

El posicionamiento especulativo en los mercados de futuros de Chicago (NYMEX) muestra que los grandes especuladores (managed money) redujeron sus posiciones largas netas en crudo un 14% durante la última semana de junio, según el reporte CFTC del 27 de junio. Esta reducción del apetito especulativo por el alza del crudo refleja la anticipación del aumento de producción OPEP+ en agosto y es consistente con un mercado que "compra el rumor y vende la noticia".

Los niveles técnicos a vigilar en julio son: al alza, US$ 83.5 (media móvil de 200 días; una ruptura confirmada abriría el camino a US$ 87-89, donde se concentra el interés abierto de opciones call de agosto); a la baja, US$ 78 (media móvil de 50 días; una ruptura aumentaría el riesgo de caída hacia US$ 74-75, zona de mínimos de 2026). El catalizador más probable para una ruptura en cualquier dirección sería el dato de inventarios de crudo de EE.UU. (publicado por la EIA cada miércoles).

El inventario de crudo de EE.UU. se ubica en 452 millones de barriles, 6.4% por debajo del promedio de los últimos 5 años. Una caída adicional de inventarios (por temporada de driving peak) podría ser el catalizador alcista del Q3; un aumento sorpresivo (por demanda débil) sería el detonante bajista.`,
    analisis: `El WTI en rango lateral US$ 78-85 es el escenario más neutro posible para la economía peruana: sin el shock de costos de un crudo a US$ 95+, pero sin el alivio inflacionario de uno a US$ 65-. Para la planificación empresarial del Q3, este entorno sugiere que los costos energéticos denominados en dólares serán predecibles.

El verdadero impacto del petróleo sobre el tipo de cambio peruano en este ciclo es indirecto: opera vía inflación global (mayor o menor presión sobre la Fed) y vía demanda china de commodities. En QoriCash le ofrecemos el mejor tipo de cambio para sus conversiones de divisas, independientemente del entorno de precios del petróleo.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f013',
    titulo: 'Argentina: junio termina con CPI estimado de 1.7%, el más bajo en 8 años; INDEC publica el 9 de julio y peso avanza a 1,297 ARS/USD',
    descripcion: 'Argentina cierra junio de 2026 con una inflación mensual estimada de 1.7%, la más baja desde marzo de 2018, según estimaciones privadas previas a la publicación oficial del INDEC el 9 de julio. El peso oficial avanza a 1,297 ARS/USD tras el crawl mensual del 1%, la brecha con el blue se comprime al 3.8% y las reservas brutas del BCRA llegan a US$ 38,700 millones.',
    contenido: `Argentina inicia julio de 2026 con las mejores perspectivas macroeconómicas de los últimos 8 años. Las consultoras privadas (Elypsis, Equilibra, FIEL) estiman que la inflación mensual de junio fue de aproximadamente 1.7%, por debajo del 2.1% de mayo y del 2.4% de abril, lo que confirmaría la continuidad de la desinflación más rápida de la historia reciente del país. El INDEC publicará el dato oficial el miércoles 9 de julio.

El programa de estabilización del presidente Javier Milei continúa mostrando resultados. El equilibrio fiscal primario se mantiene por undécimo mes consecutivo: el resultado de junio habría sido un superávit primario de aproximadamente 0.2% del PIB mensual, suficiente para financiar los pagos de deuda sin nueva emisión monetaria. La base monetaria se contrajo 1.4% real en junio, manteniendo la desinflación en curso.

El tipo de cambio oficial inició julio en 1,297 ARS/USD tras el crawl programado del 1% mensual desde los 1,285 del 1 de junio. La brecha cambiaria entre el tipo oficial y el dólar blue (1,347 ARS/USD) se comprimió al 3.8%, el nivel más bajo desde la implementación del cepo en 2019 y una señal de credibilidad del esquema cambiario de Milei. El dólar CCL (contado con liquidación) se ubica en 1,318 ARS/USD, generando una brecha del 1.6% con el oficial —prácticamente unificación de facto.

Las reservas brutas del BCRA superaron los US$ 38,700 millones al 1 de julio, su máximo desde septiembre de 2019. El FMI desembolsó el quinto tramo del programa Stand-By (US$ 800 millones) el 28 de junio tras la aprobación del quinto review. El próximo hito del programa es el sexto review, programado para septiembre.`,
    analisis: `La convergencia de indicadores positivos en Argentina —inflación descendente, reservas en máximos de 6 años, brecha cambiaria casi eliminada— es una señal de estabilización macroeconómica regional que reduce el riesgo de contagio sobre el sol peruano y otras monedas latinoamericanas.

Para empresas peruanas con exportaciones o inversiones en Argentina, el tipo de cambio implícito PEN/ARS es de aproximadamente 381 pesos argentinos por sol peruano (ARS 1,297 / USD ÷ S/ 3.40 / USD). En QoriCash optimizamos la conversión PEN/USD como primer paso de cualquier operación internacional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f014',
    titulo: 'Colombia: Banrep decide el 25 de julio con 72% de probabilidad de recorte a 9.00%; COP en 4,165 ante perspectivas dovish',
    descripcion: 'El Banco de la República de Colombia (Banrep) celebra su reunión de política monetaria el 25 de julio con el mercado asignando un 72% de probabilidad a un recorte de 25 puntos básicos hasta 9.00%. El peso colombiano se aprecia a 4,165 COP/USD ante las expectativas de flexibilización y el Brent estable en US$ 85/barril.',
    contenido: `El Banco de la República de Colombia (Banrep) tiene programada su reunión de política monetaria para el 25 de julio de 2026, y la expectativa del mercado es inequívoca: el 72% de los analistas encuestados por Reuters esperan un recorte de 25 puntos básicos que llevaría la tasa de política monetaria del 9.25% al 9.00%, según la encuesta publicada el 30 de junio. La probabilidad implícita en los contratos de IBR (Indicador Bancario de Referencia) es del 68%, en línea con el consenso de analistas.

Los argumentos a favor del recorte son sólidos: la inflación de mayo fue de 4.6% interanual, su menor nivel en 28 meses y acercándose al techo del rango meta del Banrep (4%). El Banrep proyecta que la inflación llegará al rango meta antes del cierre de 2026. La actividad económica creció 3.1% en el Q1, moderada pero no preocupante. Las expectativas de inflación a 12 meses (3.8% según la encuesta de mayo del Banrep) están bien ancladas dentro del rango meta de 2-4%.

El peso colombiano (COP) inicia julio en 4,165 por dólar, con una apreciación del 0.4% respecto al cierre de junio (4,180), en una dinámica de "vender dólares, comprar pesos" que refleja las expectativas de un Banrep más dovish. El precio del petróleo Brent en US$ 85/barril —referencia más relevante para Colombia que el WTI— también sostiene al COP: con 700,000 barriles de exportación diaria, cada dólar de alza en el Brent genera US$ 255 millones adicionales anualizados en ingresos de divisas para el país.

La economía colombiana muestra señales mixtas al inicio del Q3: el PMI manufacturero de junio bajó a 49.2 (contracción leve), el desempleo urbano se ubica en 9.8% (elevado frente al 7.4% de Perú) y la inversión extranjera directa creció 11.4% en el H1. El Plan Nacional de Desarrollo aprobado por el Congreso incluye inversiones en infraestructura vial por COP 45 billones para 2026-2030 que sostendrán el ciclo de crecimiento.`,
    analisis: `Un recorte del Banrep el 25 de julio es positivo para el peso colombiano en el mediano plazo —señal de confianza en la desinflación— aunque puede generar volatilidad de corto plazo el día del anuncio. Para el sol peruano, la convergencia de ciclos de recorte en LatAm (BCRP en agosto, Banrep en julio) reduce la presión de salida de capitales regional.

Para empresas peruanas con operaciones en Colombia, el tipo de cambio implícito PEN/COP es de aproximadamente 1,225 pesos colombianos por sol peruano. En QoriCash ofrecemos el mejor tipo de cambio PEN/USD para optimizar sus operaciones financieras internacionales.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'f015',
    titulo: 'Chile: BCCh da señal de recorte en agosto; CLP en 925/USD y exportaciones de cobre en US$ 5,200M consolidan el H1 más sólido en 4 años',
    descripcion: 'El Banco Central de Chile (BCCh) inició julio con una comunicación que el mercado interpretó como una señal clara de recorte en su reunión del 5 de agosto. El peso chileno se ubica en 925 CLP/USD, con depreciación del 4.3% en el H1 a pesar del sólido desempeño exportador cuprìfero (US$ 5,200M en H1). La tasa actual es 5.00% y el mercado proyecta 4.75% para fin de Q3.',
    contenido: `El Banco Central de Chile (BCCh) celebró el lunes 30 de junio la última reunión del semestre, manteniendo la tasa de política monetaria en 5.00%, pero el comunicado incluyó modificaciones importantes al lenguaje previo que el mercado interpretó como una señal inequívoca de recorte en la reunión del 5 de agosto. El BCCh señaló que "la actividad económica muestra señales de moderación consistentes con la convergencia de la inflación al 3% antes del cierre del año, lo que permitiría evaluar una mayor flexibilización de la política monetaria en el corto plazo".

La inflación en Chile fue de 3.9% interanual en mayo —por debajo del 4.2% de abril— y el BCCh proyecta que llegará al 3% antes del cierre de 2026. La tasa real ex-ante se ubica en 1.1% (5.00% - 3.9%), el nivel más restrictivo de la región andina. El recorte de 25 puntos básicos en agosto bajaría la tasa a 4.75%, con el mercado proyectando un objetivo de 4.25-4.50% para el cierre de 2026.

El peso chileno (CLP) inicia el Q3 en 925 por dólar, con una depreciación del 4.3% en el H1 pese al sólido desempeño exportador cuprìfero. Las exportaciones totales de Chile en el H1 sumaron US$ 46,800 millones (+11.2%), con el cobre aportando US$ 5,200 millones en la primera mitad del semestre. El BCCh estima que las exportaciones totales del año completo alcanzarán un récord de US$ 98,000 millones, impulsadas por el cobre en US$ 29,000 millones y el litio en US$ 8,400 millones.

La economía chilena creció 2.8% en el Q1 y la proyección del BCCh para el año completo es de 3.0-3.5%, un ciclo de expansión moderado pero sostenido. Los sectores minería (+14.2%), servicios financieros (+6.8%) y exportaciones de litio (+38.4%) son los principales motores del crecimiento.`,
    analisis: `El ciclo de recortes del BCCh —que podría sumar 75-100 puntos básicos antes de fin de 2026— es una señal de normalización monetaria regional que se suma a la del BCRP en Perú y el Banrep en Colombia. Para el sol peruano, este contexto regional favorece una menor presión de salida de capitales latinoamericanos y una mayor estabilidad cambiaria general.

Para empresas peruanas con operaciones o proveedores en Chile, el tipo de cambio implícito PEN/CLP es de aproximadamente 272 pesos chilenos por sol peruano (CLP 925 / USD ÷ S/ 3.40 / USD). En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD del mercado como paso inicial de cualquier operación en divisas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  {
    id: 'i001',
    titulo: 'Sol cierra el primer semestre en S/ 3.41: tipo de cambio estable en H1 2026 con reservas récord y superávit comercial de US$ 7,200M',
    descripcion: 'El sol peruano cierra junio 2026 en S/ 3.41 interbancario (compra S/ 3.407 / venta S/ 3.411 en banca), acumulando una depreciación de apenas 0.9% en el primer semestre. El soporte del DXY en 101.8 fue compensado por el robusto superávit comercial de US$ 7,200M y las reservas internacionales en US$ 75.8 billones. El BCRP mantuvo presencia precautoria con US$ 120 millones en repos durante el semestre.',
    contenido: `El tipo de cambio PEN/USD cierra el primer semestre de 2026 en S/ 3.41 interbancario —compra S/ 3.407 / venta S/ 3.411 en ventanillas bancarias—, marcando el nivel de cierre semestral más alto desde diciembre de 2023. La variación acumulada en el año es de apenas 0.9%, resultado de un entorno externo adverso que se intensificó en el segundo trimestre.

Los tres factores que explican la presión sobre el sol en el cierre de junio son: el avance del DXY Index a 101.8 puntos (su nivel más elevado en 14 meses), el giro hawkish del dotplot de la Fed del 17 de junio —que redujo las expectativas de recortes a uno para finales de 2026— y la salida generalizada de capitales de mercados emergentes, que en Perú sumó US$ 1,240 millones en fondos de bonos soberanos durante junio.

El Banco Central de Reserva del Perú intervino activamente en el mercado cambiario durante la segunda quincena de junio. El BCRP realizó subastas de repos de monedas por un total de US$ 340 millones entre el 16 y el 27 de junio, frenando parcialmente la velocidad de la depreciación. Las reservas internacionales netas cerraron junio en US$ 73.4 billones, aún en niveles que brindan amplia capacidad de intervención.

Para el tercer trimestre, el consenso de analistas proyecta al sol en el rango S/ 3.35-3.55, condicionado a la evolución del DXY y a los datos de inflación PCE de EE.UU. que determinan el timing del primer recorte de la Fed. La temporada alta de agroexportaciones (julio-septiembre) generará oferta estacional de dólares que debería amortiguar la presión depreciativa.`,
    analisis: `El cierre semestral del sol en S/ 3.41 representa el nivel más desafiante para importadores y deudores en dólares desde 2023. Sin embargo, el tipo de cambio se mantiene dentro del rango de fundamentos macroeconómicos peruanos: reservas robustas, disciplina fiscal y superávit comercial de cuenta corriente ajustado.

Para empresas con compromisos en dólares —importaciones, deuda, dividendos— el nivel actual de S/ 3.41 puede ser un punto de referencia para planificar coberturas naturales. En QoriCash ofrecemos el mejor tipo de cambio del mercado para sus operaciones de compra y venta de dólares, sin comisiones y con respuesta en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i002',
    titulo: 'DXY cierra H1 2026 en 101.8: el dólar acumula apreciación del 6.2% en el año ante Fed hawkish y sólidos datos laborales de EE.UU.',
    descripcion: 'El Índice del Dólar (DXY) cierra el primer semestre de 2026 en 101.8 puntos, acumulando una apreciación del 6.2% frente a la canasta de divisas principales. La Fed de Warsh ha señalado que solo un recorte de tasas es probable antes de fin de año, y los datos de empleo de mayo —con 218,000 nóminas no agrícolas y desempleo en 3.9%— reafirman la robustez de la economía estadounidense.',
    contenido: `El DXY Index —que mide la fortaleza del dólar frente a una canasta ponderada de seis divisas principales (EUR, JPY, GBP, CAD, SEK, CHF)— cerró el viernes 27 de junio en 101.8 puntos, consolidando una apreciación del 6.2% en el primer semestre de 2026. El nivel es el más elevado desde abril de 2025 y marca el mejor desempeño semestral del dólar desde el primer semestre de 2022.

Los dos pilares del fortalecimiento del dólar en el semestre son la política monetaria de la Reserva Federal y los datos macroeconómicos de EE.UU. En el frente monetario, la Fed de Kevin Warsh ha mantenido la tasa de fondos federales en 3.50%-3.75% y el dotplot de junio señala solo un recorte para el cuarto trimestre de 2026 —una postura significativamente más restrictiva que la que los mercados anticipaban a principios de año. En el frente real, la economía estadounidense creó 218,000 empleos no agrícolas en mayo, el desempleo se ubica en 3.9% y el PIB del primer trimestre fue revisado al alza a 2.4% anualizado.

El impacto del DXY en 101.8 sobre las divisas emergentes ha sido heterogéneo. Las monedas más afectadas en el semestre fueron el peso colombiano (-7.2%), el sol peruano (-0.9%) y el real brasileño (-5.1%), mientras que el peso mexicano resistió mejor (-3.8%) gracias a su correlación con la economía estadounidense. El yuan chino se depreció 2.4% frente al dólar, presionado adicionalmente por las tensiones comerciales bilaterales.

Para el segundo semestre, el consenso de mercado proyecta que el DXY podría retroceder hacia 98-100 si la Fed efectivamente recorta tasas en diciembre y la inflación PCE continúa desacelerándose. El primer dato clave será el PCE de mayo (publicación: 27 de junio) y la tasa de inflación de junio (publicación: 11 de julio).`,
    analisis: `El DXY en 101.8 es el factor externo dominante sobre el tipo de cambio PEN/USD. Históricamente, cuando el DXY supera 102, el sol tiende a ubicarse por encima de S/ 3.75. La pregunta clave para el segundo semestre es si la Fed iniciará su ciclo de recortes en septiembre o en diciembre: un primer recorte en septiembre generaría un retroceso del DXY hacia 98-99, lo que aliviaría la presión sobre el sol.

Para empresas con exposición cambiaria estructural —importadoras, endeudadas en dólares o con proveedores en divisas— este entorno recomienda evaluar coberturas naturales y optimizar los momentos de conversión. QoriCash ofrece el mejor tipo de cambio del mercado, con atención inmediata y sin comisiones ocultas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i003',
    titulo: 'BCRP interviene con US$ 340M en repos durante junio y mantiene tasa referencial en 4.50% en su reunión del 26 de junio',
    descripcion: 'El Banco Central de Reserva del Perú mantuvo la tasa de política monetaria en 4.50% en su reunión del 26 de junio y realizó subastas de repos de monedas por US$ 340 millones durante el mes para moderar la presión cambiaria. El directorio señaló que la inflación se ubica en 3.6% y convergirá al rango meta de 1-3% en el primer trimestre de 2027.',
    contenido: `El directorio del Banco Central de Reserva del Perú (BCRP) decidió por unanimidad el jueves 26 de junio mantener la tasa de interés de referencia en 4.50%, nivel en el que permanece desde la reunión de febrero de 2026. La decisión estuvo en línea con el consenso de mercado (87% de probabilidad según encuesta Reuters) y responde al balance entre una inflación que desacelera pero aún por encima del rango meta y una actividad económica que muestra dinamismo moderado.

La inflación acumulada en doce meses a mayo de 2026 se ubica en 3.6%, por encima del límite superior del rango meta (3%), principalmente por la presión de los precios de energía (+12.3% interanual) y alimentos procesados (+4.8%). El BCRP proyecta que la inflación retornará al rango meta en el primer trimestre de 2027. El presidente del BCRP, Julio Velarde, señaló en la conferencia de prensa que el Comité "permanece vigilante y actuará con oportunidad si las expectativas inflacionarias mostrasen signos de desanclaje".

En el frente cambiario, el BCRP intervino activamente durante junio mediante subastas de repos de monedas (swaps de dólares a cambio de soles). En total, el instituto emisor colocó US$ 340 millones en 8 subastas entre el 13 y el 27 de junio, moderando la velocidad de la depreciación del sol sin afectar el stock de reservas internacionales. Las reservas netas cerraron junio en US$ 73.4 billones (30.2% del PBI estimado), nivel que el BCRP considera adecuado para absorber shocks externos.

La próxima reunión de política monetaria del BCRP está programada para el 7 de agosto. El mercado asigna un 62% de probabilidad a una reducción de 25 puntos básicos en esa reunión si los datos de inflación de junio y julio confirman la tendencia decreciente.`,
    analisis: `La postura del BCRP en 4.50% es una de las tasas reales positivas más elevadas de América Latina (tasa nominal 4.50% - inflación 3.6% = tasa real 0.9%), lo que mantiene el atractivo de los activos en soles para inversores internacionales y limita la presión depreciativa estructural sobre el tipo de cambio.

La reducción esperada de tasas en agosto —si los datos lo permiten— podría generar un efecto moderado de debilitamiento del sol en el corto plazo. Para empresas con flujos recurrentes en dólares, el contexto actual sugiere que S/ 3.41 refleja un equilibrio saludable sustentado por fundamentos sólidos. En QoriCash ofrecemos atención personalizada para operaciones de cambio de mediana y gran escala.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i004',
    titulo: 'Exportaciones peruanas suman US$ 28.4 mil millones en H1 2026, nuevo récord semestral con crecimiento del 14.2%',
    descripcion: 'Las exportaciones totales del Perú alcanzaron US$ 28,400 millones en el primer semestre de 2026, un crecimiento del 14.2% frente a los US$ 24,870 millones del H1 2025, según SUNAT. El cobre concentra el 38% del total con US$ 10,760 millones, seguido por el oro (22%) y las agroexportaciones no tradicionales (18%).',
    contenido: `Las exportaciones totales peruanas registraron un nuevo récord semestral en el primer semestre de 2026 con US$ 28,400 millones, superando en 14.2% los US$ 24,870 millones del mismo período de 2025, según datos de SUNAT publicados hoy 30 de junio. El resultado convierte al primer semestre de 2026 en el mejor de la historia exportadora peruana, impulsado por la convergencia de precios favorables en metales, producción minera récord y expansión sostenida de las agroexportaciones.

El cobre fue el principal producto de exportación con US$ 10,760 millones (38% del total), beneficiado por la producción récord de 692,400 TMF acumulada en enero-mayo y precios promedio de US$ 4.82/libra en la LME. El oro aportó US$ 6,250 millones (22%), con producción estable y precios en torno a US$ 3,280/oz. Las agroexportaciones no tradicionales sumaron US$ 5,110 millones (18%), destacando paltas (US$ 860M), arándanos (US$ 380M) y uvas de mesa (US$ 640M).

Los mercados de destino más importantes en el H1 fueron: China (32% del total, US$ 9,090M), Estados Unidos (18%, US$ 5,110M), Unión Europea (14%, US$ 3,980M) y Corea del Sur (7%, US$ 1,990M). Las exportaciones a China crecieron 18.4% impulsadas por la mayor demanda de concentrado de cobre y el crecimiento de las exportaciones de arándanos y paltas bajo los protocolos fitosanitarios vigentes.

El superávit comercial acumulado en el H1 asciende a US$ 7,200 millones, el más alto desde el primer semestre de 2021. Este excedente de divisas ha sido el principal factor de estabilización del tipo de cambio ante la presión del DXY, evitando una depreciación más pronunciada del sol.`,
    analisis: `El récord exportador del H1 2026 es la mejor noticia estructural para el tipo de cambio: el superávit comercial de US$ 7,200 millones genera oferta orgánica de dólares que ancla el sol incluso en un entorno de DXY elevado. Sin este colchón exportador, el sol probablemente habría alcanzado niveles de S/ 3.55-3.65.

Para empresas agroexportadoras o proveedoras del sector minero que liquidan dólares en el mercado local, el contexto actual —tipo de cambio en S/ 3.41, nivel de equilibrio semestral— puede representar una oportunidad para optimizar la conversión. En QoriCash ofrecemos el mejor tipo de cambio del mercado con atención inmediata, especialmente para montos superiores a US$ 5,000.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i005',
    titulo: 'MEF: déficit fiscal del H1 2026 llega a 1.1% del PBI, por debajo de la meta de 1.4%; ingresos tributarios crecen 11.6%',
    descripcion: 'El Ministerio de Economía y Finanzas reportó hoy que el déficit fiscal acumulado en el primer semestre de 2026 fue de 1.1% del PBI, por debajo de la meta programada de 1.4%, gracias al crecimiento de los ingresos tributarios en 11.6% impulsado por el boom exportador y la mayor recaudación del Impuesto a la Renta.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó hoy los resultados fiscales del primer semestre de 2026, mostrando un desempeño mejor al programado: el déficit fiscal acumulado a junio fue de 1.1% del PBI, por debajo de la meta de 1.4% establecida en el Marco Macroeconómico Multianual. Este resultado sitúa a Perú en una posición fiscal sólida en la comparativa regional latinoamericana.

Los ingresos del gobierno central crecieron 11.6% en términos reales en el H1, alcanzando S/ 102,400 millones. El Impuesto a la Renta fue el principal motor con un crecimiento de 15.8%, impulsado por las mayores utilidades del sector minero (cobre y oro a precios récord) y el mejor desempeño de la manufactura no primaria. El IGV interno creció 9.4%, reflejo de la expansión del consumo privado. Las aduanas recaudaron S/ 14,200 millones, un incremento de 12.1% gracias al mayor valor de las importaciones.

El gasto público creció 6.8% en términos reales, acelerado por la mayor ejecución de inversión pública en infraestructura: los gobiernos regionales y municipales ejecutaron el 48.3% de su presupuesto de inversión a junio, el mejor resultado para ese indicador en los últimos cinco años. El gasto corriente creció a un ritmo más moderado del 5.1%.

El ministro de Economía destacó que el resultado fiscal del H1 permite proyectar un cierre de año por debajo del 2.0% del PBI —objetivo central del MMM— y refuerza la credibilidad fiscal del Perú ante las agencias calificadoras. La deuda pública se ubica en 33.8% del PBI, nivel manejable frente al promedio latinoamericano de 58.4%.`,
    analisis: `El déficit fiscal en 1.1% del PBI —mejor que la meta— es una señal de disciplina fiscal que fortalece la credibilidad macroeconómica del Perú y reduce el riesgo soberano. Para el tipo de cambio, esto implica menor presión de endeudamiento externo del Estado y mayor atractivo de los bonos soberanos en soles, factores que en el margen son positivos para el sol.

La solidez fiscal peruana es uno de los pocos anclajes que limitan la depreciación del sol en un contexto de DXY alto y salidas de capital de emergentes. Para empresas que operan en Perú con compromisos en dólares, este entorno macroeconómico favorable reduce el riesgo de una depreciación descontrolada. En QoriCash ofrecemos el mejor tipo de cambio para sus conversiones.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i006',
    titulo: 'Sector construcción peruano crece 6.8% en mayo 2026: despacho de cemento en máximos y obras de infraestructura aceleran',
    descripcion: 'El sector construcción en Perú registró un crecimiento de 6.8% interanual en mayo de 2026, según el INEI, sustentado en el avance de grandes proyectos de infraestructura vial, la expansión de la construcción privada en Lima y el dinamismo del programa Techo Propio. El despacho interno de cemento sumó 1.32 millones de toneladas, el mayor nivel desde agosto de 2023.',
    contenido: `El sector construcción peruano continuó su ciclo expansivo en mayo de 2026 con un crecimiento de 6.8% interanual, según datos del Instituto Nacional de Estadística e Informática (INEI). El resultado supera el 5.9% registrado en abril y consolida al sector como uno de los de mayor dinamismo en la economía peruana durante el primer semestre.

El despacho interno de cemento —el indicador de mayor correlación con la actividad constructora— sumó 1.32 millones de toneladas en mayo, el mayor registro mensual desde agosto de 2023, según la Asociación de Productores de Cemento (ASOCEM). Cemento Andino, Pacasmayo, Unacem y Yura reportan tasas de uso de capacidad instalada superiores al 85%, lo que anticipa potenciales expansiones de planta en el segundo semestre.

Los subsectores de mayor impulso en mayo fueron: obras viales (crecimiento estimado 14.2%), edificaciones residenciales fuera de Lima (+10.8%) y obras de saneamiento (+9.4%). En Lima Metropolitana, la construcción privada creció 5.6%, reflejo de la reactivación de proyectos inmobiliarios postergados durante 2024-2025. El programa Techo Propio otorgó 3,840 bonos en mayo (12.4% más que en mayo 2025), dinamizando la construcción en los segmentos de menores ingresos.

Los grandes proyectos de infraestructura que aceleraron en mayo incluyen el tramo 2 de la Línea 2 del Metro de Lima (avance físico 68%), el corredor vial longitudinal de la sierra sur (tramo Cusco-Puno) y las obras de ampliación del Puerto de Chancay Fase II. La inversión pública en infraestructura sumó S/ 8,400 millones en enero-mayo, un crecimiento del 16.3% en términos reales.`,
    analisis: `El crecimiento del sector construcción en 6.8% es positivo para el ciclo económico peruano y tiene un efecto indirecto favorable sobre el sol: mayor actividad económica interna genera mayor demanda de soles y reduce relativamente la presión sobre el dólar. Además, la expansión de la construcción atrae inversión extranjera directa que aporta oferta de divisas.

Para empresas constructoras que importan maquinaria o insumos en dólares (acero, equipos eléctricos, cobre), el contexto actual de sol en S/ 3.41 eleva el costo en soles de estos insumos. Optimizar el tipo de cambio de compra de dólares con QoriCash puede reducir significativamente ese impacto en los costos de proyecto.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i007',
    titulo: 'PCE de mayo en EE.UU. sorprende a la baja en 2.4%: mercados elevan probabilidad de recorte Fed en septiembre al 52%',
    descripcion: 'El índice de precios PCE subyacente de mayo, publicado el viernes 27 de junio, creció 2.4% interanual —por debajo del 2.6% esperado y del 2.7% de abril—, generando un rally en bonos del Tesoro y elevando la probabilidad implícita de un recorte de la Fed en septiembre al 52% según CME FedWatch.',
    contenido: `El Departamento de Comercio de EE.UU. publicó el viernes 27 de junio el índice de precios del gasto en consumo personal (PCE) subyacente de mayo de 2026, el indicador de inflación preferido por la Reserva Federal. El dato fue de 2.4% interanual, por debajo del consenso de Bloomberg (2.6%) y del 2.7% de abril, representando la lectura más baja desde enero de 2024 y acercándose al objetivo del 2% de la Fed.

La sorpresa bajista del PCE desencadenó un movimiento significativo en los mercados de renta fija: el rendimiento del Treasury a 10 años cayó 14 puntos básicos hasta 4.18% y el Treasury a 2 años —más sensible a las expectativas de política monetaria— cedió 18 puntos básicos hasta 4.42%. El DXY retrocedió 0.4% en la jornada del viernes aunque cerró el semestre con una ganancia neta de 6.2%, evidenciando que un solo dato no revierte una tendencia de seis meses.

La probabilidad implícita de un recorte de la Fed en su reunión del 17 de septiembre pasó del 31% (previo al dato) al 52% (posterior al dato), según la herramienta CME FedWatch. Para la reunión de noviembre, la probabilidad acumulada de al menos un recorte subió al 74%. Los estrategas de Goldman Sachs y JP Morgan revisaron sus perspectivas: GS ahora proyecta dos recortes en 2026 (septiembre y diciembre), mientras que JPM mantiene su escenario de un único recorte en diciembre.

La próxima lectura clave del PCE será el 29 de agosto (dato de julio). El mercado laboral del viernes 4 de julio (nóminas de junio) también será determinante: un crecimiento de nóminas inferior a 150,000 reforzaría el escenario de recorte en septiembre, mientras que un dato superior a 200,000 volvería a posponerlo.`,
    analisis: `Un recorte de la Fed en septiembre sería el catalizador más potente para el alivio del sol peruano en el segundo semestre: implicaría un retroceso del DXY hacia 98-99 y una reversión parcial de los flujos de capital desde emergentes. En ese escenario, el sol podría apreciarse hacia S/ 3.25-3.35 antes de fin de año.

Para empresas que necesitan comprar dólares en los próximos 2-3 meses, el dato del PCE sugiere que S/ 3.41 podría ser un nivel cercano al pico semestral si la Fed confirma señales más dovish. En QoriCash le ayudamos a ejecutar sus operaciones cambiarias en el momento más favorable.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i008',
    titulo: 'PMI manufacturero China sube a 50.4 en junio: primera expansión en tres meses y señal positiva para metales industriales',
    descripcion: 'El índice PMI manufacturero oficial de China subió a 50.4 en junio de 2026 (desde 49.7 en mayo), volviendo a territorio de expansión por primera vez en tres meses, según la Oficina Nacional de Estadísticas. El dato es positivo para el cobre y el hierro, dada la alta correlación entre la actividad manufacturera china y la demanda de metales industriales.',
    contenido: `El índice de gestores de compras (PMI) manufacturero oficial de China —publicado el lunes 30 de junio por la Oficina Nacional de Estadísticas (NBS)— subió a 50.4 en junio, superando el umbral de expansión (50) por primera vez desde marzo de 2026. El resultado fue mejor que el consenso de Bloomberg (50.1) y contrasta con los 49.7 de mayo y 49.5 de abril, que indicaban contracción.

Los subíndices más destacados del PMI de junio fueron: nuevos pedidos (51.2, el más alto desde octubre de 2025), producción (51.8) y empleo (48.6, aún en contracción pero con mejoría frente a 48.1 en mayo). El subíndice de exportaciones (49.2) permaneció en contracción, reflejando la persistente debilidad de la demanda externa, aunque mostró mejoría frente al 48.5 de mayo. El PMI Caixin —que mide las empresas privadas medianas— publicado paralelamente, subió a 51.1 desde 50.4, confirmando la mejoría generalizada.

El impacto más directo del PMI chino más fuerte es sobre los metales industriales. El cobre en la LME subió 1.8% el lunes hasta US$ 4.91/libra —su nivel más alto desde mayo—, el mineral de hierro en Singapur avanzó 2.1% y el aluminio ganó 1.4%. Para Perú —segundo productor mundial de cobre y líder en producción de zinc— un PMI chino por encima de 50 implica mayor demanda de concentrados y presión alcista sobre los precios, lo que amplifica el valor de las exportaciones mineras peruanas.

Los analistas atribuyen la recuperación del PMI a tres factores: el efecto rezagado de los estímulos fiscales aprobados por el gobierno chino en marzo (infraestructura por RMB 2.8 billones), la estabilización del mercado inmobiliario y la reactivación de la demanda interna de bienes duraderos tras el programa de subsidios al consumo lanzado en abril.`,
    analisis: `Un PMI manufacturero chino en expansión es directamente positivo para el tipo de cambio peruano: más producción en China implica mayor demanda de cobre y minerales peruanos, precios más altos y mayor flujo de dólares de exportación hacia el Perú. Históricamente, cada punto de subida del PMI chino por encima de 50 correlaciona con una apreciación del 0.3-0.5% del sol peruano en el mes siguiente.

Si el PMI chino se mantiene en expansión en julio-agosto, el flujo de dólares de las mineras peruanas podría proveer un soporte natural al sol y limitar la depreciación adicional. Para exportadores peruanos, este es un contexto favorable para anticipar conversiones de dólares a soles. En QoriCash ofrecemos la mejor tasa del mercado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i009',
    titulo: 'WTI cierra junio en US$ 81.3/barril: OPEP+ vota ampliar cuotas de producción en 411,000 b/d para agosto',
    descripcion: 'El petróleo WTI cierra el mes de junio en US$ 81.3 por barril, acumulando una caída de 3.8% en el mes tras la decisión de la OPEP+ de ampliar la producción en 411,000 barriles diarios a partir de agosto. El precio se mantiene en el rango medio del año y tiene implicaciones para la inflación global y las expectativas de política monetaria.',
    contenido: `El crudo de referencia WTI (West Texas Intermediate) cerró junio de 2026 en US$ 81.3 por barril, con una caída de 3.8% en el mes luego de que la OPEP+ —la alianza entre los países de la OPEP liderada por Arabia Saudita y Rusia— votara el 22 de junio ampliar su producción en 411,000 barriles diarios (b/d) a partir de agosto. La decisión fue la tercera ampliación de cuotas consecutiva desde abril y refleja el interés de los grandes productores por recuperar cuota de mercado frente a la producción récord de EE.UU.

La producción estadounidense de petróleo se ubica en 13.4 millones de b/d en junio, según la EIA, cerca del récord histórico de 13.6 millones de b/d alcanzado en noviembre de 2023. Los productores de shale en Texas y Dakota del Norte han mantenido su actividad pese a precios más bajos, beneficiados por la reducción de costos de extracción (break-even promedio de US$ 52/barril en el Permian Basin). El aumento de producción simultáneo de EE.UU. y OPEP+ genera presión bajista estructural sobre el mercado.

El impacto del WTI en US$ 81.3/barril sobre la inflación global es moderado: el nivel es suficientemente bajo para no generar presión inflacionaria adicional, pero suficientemente alto para que las compañías de energía mantengan sus programas de inversión. Para la Fed, un petróleo contenido en el rango US$ 75-85 es neutral para la trayectoria de inflación PCE, lo que no modifica el escenario base de un recorte de tasas a fin de 2026.

Para Perú, que importa cerca de 45,000 b/d de petróleo para satisfacer su déficit de refinación, el WTI en US$ 81.3 implica una factura de importación de combustibles de aproximadamente US$ 3,330 millones anualizados —similar al nivel de 2025— sin presión adicional significativa sobre las cuentas externas.`,
    analisis: `El WTI en US$ 81.3/barril es neutral-positivo para Perú: suficientemente bajo para no presionar la inflación interna ni la factura de importaciones energéticas, pero no tan bajo como para afectar los ingresos de los productores de gas natural peruano (Camisea). El rango de equilibrio para la economía peruana es US$ 70-90/barril.

Para importadores de combustibles o empresas con costos de energía en dólares, el nivel actual de WTI es manejable. Combinar la eficiencia en costos energéticos con un tipo de cambio optimizado es clave para la competitividad. En QoriCash le ofrecemos el mejor tipo de cambio del mercado para sus necesidades de conversión de divisas.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i010',
    titulo: 'DXY en 101.8: el índice del dólar presiona monedas emergentes de Latam; PEN, COP y BRL son las más afectadas del semestre',
    descripcion: 'El DXY Index cerró el primer semestre de 2026 en 101.8 puntos, generando depreciaciones significativas en las monedas de América Latina: el sol peruano cedió 0.9%, el peso colombiano 7.2%, el real brasileño 5.1% y el peso chileno 4.3%. Solo el peso mexicano resistió con una caída más moderada del 3.8%, apuntalado por su correlación con la economía de EE.UU.',
    contenido: `El cierre semestral del DXY Index en 101.8 puntos marca el fin de un primer semestre que resultó adverso para las divisas de América Latina. El análisis de desempeño por moneda revela dinámicas diferenciadas dentro de la región: las monedas de mayor sensibilidad a los flujos de capital global (PEN, COP, BRL) registraron las mayores depreciaciones, mientras que el MXN —beneficiado por su relación comercial con EE.UU.— mostró mayor resiliencia.

El sol peruano (PEN) mostró notable resiliencia frente al DXY elevado: solo cedió 0.9% en el semestre, llevando el tipo de cambio de S/ 3.38 al cierre de 2025 hasta S/ 3.41 al 30 de junio de 2026. Los factores que amortiguaron la presión del DXY incluyen el robusto superávit comercial (US$ 7,200M) y la intervención precautoria del BCRP (repos por US$ 120M). El peso colombiano cedió 7.2% ante la persistente incertidumbre fiscal y la caída de los precios del petróleo. El real brasileño se depreció 5.1% afectado por las tensiones fiscales del gobierno Lula y la postura hawkish del BCB.

En términos técnicos, el DXY en 101.8 enfrenta una resistencia importante en la zona 102-103 (máximos de 2025). Si el dato del PCE de mayo —publicado el viernes con un dato sorpresivamente bajo de 2.4%— marca el inicio de una tendencia desinflacionaria, el mercado podría revaluar las perspectivas de la Fed y enviar el DXY de vuelta hacia 99-100 en el tercer trimestre. El nivel de soporte clave está en 99.5 (media móvil de 200 días).

Para el segundo semestre de 2026, los analistas de mercado apuntan a tres escenarios: bajista para el DXY (Fed recorta en septiembre, DXY retrocede a 97-99), base (recorte en diciembre, DXY lateral en 100-102) y alcista (sin recortes en 2026, DXY avanza a 104-106). El escenario base sigue siendo el de mayor probabilidad (55%), con el bajista en 30% y el alcista en 15%.`,
    analisis: `El nivel del DXY es el factor externo más determinante para el tipo de cambio PEN/USD en el corto plazo. Un retroceso del DXY hacia 99 implicaría, ceteris paribus, una apreciación del sol hacia S/ 3.25-3.35. Inversamente, si el DXY supera 103, el sol podría alcanzar S/ 3.55-3.65.

Para la gestión cambiaria empresarial, el entorno de DXY elevado pero con potencial de corrección sugiere evaluar las necesidades de dólares de los próximos 60-90 días y ejecutar conversiones de forma gradual. En QoriCash asesoramos a empresas en la optimización de sus operaciones cambiarias con el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i011',
    titulo: 'Bitcoin cierra el primer semestre en US$ 107,500: segundo mejor H1 de la historia con ganancia del 34% desde enero',
    descripcion: 'Bitcoin terminó el primer semestre de 2026 en US$ 107,500, acumulando una ganancia del 34.4% desde el cierre de 2025 (US$ 79,980). El activo digital superó su máximo histórico de US$ 109,200 el 12 de junio y luego consolidó. Los ETFs spot de Bitcoin en EE.UU. registraron flujos netos positivos de US$ 18,400 millones en el H1.',
    contenido: `Bitcoin (BTC/USD) cierra el primer semestre de 2026 en US$ 107,500, registrando una ganancia semestral del 34.4% desde el cierre de 2025 (US$ 79,980). El desempeño convierte al primer semestre de 2026 en el segundo mejor H1 de la historia del activo digital, solo superado por el primer semestre de 2023 (+82%). El cierre semestral por encima de los US$ 100,000 es histórico: es la primera vez que Bitcoin termina un semestre por encima de ese nivel.

Los catalizadores del rally de Bitcoin en el H1 fueron múltiples: los ETFs spot de Bitcoin —lanzados en EE.UU. en enero de 2024— acumularon flujos netos de US$ 18,400 millones en el primer semestre de 2026, consolidando a los inversores institucionales como la principal base compradora. El halving de abril de 2024 (reducción de la recompensa de minería a 3.125 BTC por bloque) continúa generando presión de oferta reducida. Adicionalmente, el entorno de DXY elevado —paradójicamente— impulsó demanda de Bitcoin como reserva de valor alternativa en mercados emergentes con monedas depreciadas.

El pico semestral fue US$ 109,200 el 12 de junio, nivel que representó un nuevo máximo histórico. La corrección posterior del 1.6% hasta el cierre semestral de US$ 107,500 es técnicamente sana: el RSI bajó de sobrecompra (78) a niveles neutrales (58) sin romper soporte clave. Los niveles técnicos relevantes para el tercer trimestre son: soporte en US$ 98,000-100,000 (zona de máximos anteriores, ahora soporte) y resistencia en US$ 112,000-115,000.

El mercado crypto más amplio también mostró fortaleza: Ethereum ganó 28.4% en el H1, Solana avanzó 41.2% y el índice total de capitalización de mercado crypto subió de US$ 2.8 billones a US$ 3.7 billones. La correlación de Bitcoin con el Nasdaq se mantiene elevada (0.74), lo que sugiere que cualquier corrección en renta variable tecnológica podría arrastrar al activo digital.`,
    analisis: `Bitcoin en US$ 107,500 al cierre del H1 consolida el activo como un componente relevante de carteras diversificadas a nivel global. Para inversores en Perú que han mantenido exposición en BTC durante el semestre, la ganancia del 34.4% en dólares se amplifica al convertirla a soles: con el sol con variación de apenas 0.9% en el mismo período, la ganancia en soles peruanos supera el 35%.

Para quienes desean realizar ganancias en Bitcoin y convertir a soles o viceversa, QoriCash ofrece el mejor tipo de cambio del mercado para la conversión USD/PEN, maximizando el valor de sus activos digitales al convertirlos a moneda local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i012',
    titulo: 'Oro cierra junio en US$ 3,285/oz tras corrección semanal de 2.3%: el metal precioso acumula +18.4% en el H1 2026',
    descripcion: 'El oro spot cerró junio en US$ 3,285 por onza, registrando una corrección del 2.3% en la última semana del mes tras el repunte del DXY y la toma de ganancias institucional. Sin embargo, el metal acumula una ganancia del 18.4% en el primer semestre, impulsado por la demanda de bancos centrales y el apetito por activos de refugio.',
    contenido: `El oro spot (XAU/USD) cerró el viernes 27 de junio en US$ 3,285 por onza, con una corrección semanal del 2.3% desde el máximo intra-semana de US$ 3,363. La toma de ganancias fue desencadenada por el repunte del DXY tras los datos de nóminas no agrícolas de mayo (218,000 empleos, por encima de los 185,000 esperados), que redujo temporalmente las expectativas de recortes de la Fed. Con este cierre, el oro acumula una ganancia del 18.4% en el primer semestre de 2026 —desde US$ 2,774/oz al cierre de 2025— su mejor desempeño semestral desde el H1 de 2020.

Los fundamentos que sostienen el rally del oro en 2026 permanecen intactos. Los bancos centrales globales compraron un total neto de 482 toneladas de oro en el H1, según el Consejo Mundial del Oro (WGC), liderados por los bancos centrales de China (68 t), India (42 t), Polonia (38 t) y Turquía (31 t). Esta demanda institucional —que representa la mayor compra semestral de bancos centrales desde 2010— actúa como un piso estructural para los precios.

El soporte técnico más relevante para el oro está en la zona US$ 3,200-3,220 (media móvil de 50 días y nivel de Fibonacci del 38.2% desde el mínimo de marzo). Los analistas de Citigroup y UBS mantienen sus objetivos de precio para fin de 2026 en el rango US$ 3,400-3,600, mientras que Goldman Sachs revisó al alza hasta US$ 3,700 citando la demanda sostenida de bancos centrales y los riesgos geopolíticos en Oriente Medio.

Para Perú, el oro en US$ 3,285/oz tiene un impacto directo positivo: las exportaciones de oro sumaron US$ 6,250 millones en el H1 y cada aumento de US$ 100/oz en el precio amplía el valor exportado en aproximadamente US$ 190 millones anualizados (tomando la producción minera aurífera estimada de 1.9 millones de onzas para 2026).`,
    analisis: `La corrección del oro del 2.3% en la última semana de junio es técnicamente saludable en el contexto de una ganancia semestral del 18.4%. El nivel de US$ 3,285 sigue siendo elevado en perspectiva histórica y los fundamentos de demanda de bancos centrales justifican precios sostenidos por encima de US$ 3,000.

Para el tipo de cambio peruano, el oro en niveles elevados amplifica el valor exportado y refuerza la posición de cuenta corriente del país. Este flujo de divisas —junto con el cobre y las agroexportaciones— es parte del colchón estructural que evita depreciaciones más severas del sol. En QoriCash ofrecemos el mejor tipo de cambio para las conversiones de exportadores mineros y empresas relacionadas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i013',
    titulo: 'Argentina: inflación mensual de mayo baja a 2.1%, la más baja desde diciembre de 2017; peso acumula estabilidad en 1,285 ARS/USD',
    descripcion: 'La inflación mensual de Argentina cayó a 2.1% en mayo de 2026, la más baja desde diciembre de 2017, según el INDEC. El peso argentino se mantiene estable en 1,285 ARS/USD bajo el esquema de crawling peg del gobierno de Milei, y las reservas del BCRA superaron los US$ 38,000 millones por primera vez desde 2019.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó el viernes 27 de junio el índice de precios al consumidor (IPC) de mayo de 2026: la variación mensual fue de 2.1%, por debajo del 2.4% de abril y del 2.6% de marzo, marcando la menor inflación mensual desde diciembre de 2017. La inflación acumulada en los doce meses a mayo fue de 68.4%, una desaceleración notable frente al pico de 288% registrado en diciembre de 2023.

El programa de estabilización macroeconómica del presidente Javier Milei —que incluye el equilibrio fiscal primario sostenido por décimo mes consecutivo, el esquema de crawling peg del tipo de cambio oficial (devaluación mensual del 1%), y la reducción del gasto público en 28% real— continúa generando resultados en términos de desinflación. Los rubros con mayor desaceleración en mayo fueron: alimentos y bebidas (+1.6%), indumentaria (+1.9%) y servicios (+2.4%), compensados parcialmente por precios regulados con actualizaciones programadas (+3.2%).

El tipo de cambio oficial se ubica en 1,285 ARS/USD bajo el esquema de micro-devaluaciones del 1% mensual establecido desde febrero. La brecha con el dólar blue (1,340 ARS) se ha comprimido al 4.3%, el nivel más bajo desde la implementación del cepo cambiario en 2019, señal de que el mercado percibe sostenibilidad en el esquema. Las reservas brutas del Banco Central de la República Argentina (BCRA) superaron los US$ 38,000 millones a fin de junio —la mayor cifra desde julio de 2019— impulsadas por la liquidación de exportaciones del agro y el desembolso del FMI de US$ 2,500 millones en mayo.

El FMI aprobó el 20 de junio el quinto review del programa Stand-By con Argentina, reconociendo el cumplimiento de todos los criterios de desempeño cuantitativos. La economía argentina creció 5.4% interanual en el primer trimestre de 2026, recuperando el terreno perdido en 2024-2025.`,
    analisis: `El avance de la desinflación en Argentina es positivo para la credibilidad del programa Milei y para la estabilidad financiera regional. Para el sol peruano, una Argentina más estable reduce los riesgos de contagio financiero regional que históricamente han generado episodios de debilidad generalizada de monedas latinoamericanas.

Para peruanos con viajes o negocios en Argentina, el tipo de cambio implícito mejora: con el peso oficial en 1,285 ARS/USD y el sol en S/ 3.41/USD, el peso argentino equivale aproximadamente a S/ 0.00289 (o S/ 1 = 377 ARS). QoriCash le ofrece el mejor tipo de cambio para convertir soles a dólares como primer paso de cualquier operación financiera internacional.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i014',
    titulo: 'Colombia: peso COP se aprecia 1.4% en junio hasta 4,180 COP/USD ante perspectivas de recorte del Banrep en julio',
    descripcion: 'El peso colombiano cerró junio en 4,180 COP/USD, apreciándose 1.4% en el mes en un entorno de debilidad generalizada para las monedas emergentes. El Banco de la República de Colombia señaló que evaluará un recorte de tasas en su reunión del 25 de julio si la inflación de junio confirma la tendencia descendente. El petróleo Brent en US$ 85/barril también apoya al COP.',
    contenido: `El peso colombiano (COP) cerró junio de 2026 en 4,180 por dólar, apreciándose 1.4% en el mes frente al nivel de 4,240 de fin de mayo, en contratendencia con la mayoría de monedas emergentes que cedieron terreno ante el DXY en ascenso. La fortaleza relativa del COP responde a la combinación de señales más claras del Banco de la República (Banrep) sobre una posible reducción de tasas y el soporte del precio del petróleo Brent en torno a US$ 85/barril.

El Banco de la República mantuvo la tasa de política monetaria en 9.25% en su reunión del 20 de junio —octava reunión consecutiva sin cambios— pero el comunicado incluyó una frase nueva que el mercado interpretó como señal dovish: "el Comité evaluará la posibilidad de iniciar el ciclo de flexibilización monetaria en la reunión de julio si la evolución de la inflación así lo permite". La inflación de mayo fue de 4.6% interanual, la más baja en 28 meses y acercándose al techo del rango meta del Banrep (4%). Si la inflación de junio (publicación: 9 de julio) cae por debajo del 4.5%, el recorte en julio tendría alta probabilidad.

El petróleo Brent en US$ 85/barril —referencia más relevante para Colombia que el WTI— brinda un soporte directo a las cuentas externas colombianas: el país exporta cerca de 700,000 barriles diarios de crudo, generando ingresos anuales de aproximadamente US$ 21,700 millones con los precios actuales. Ecopetrol reportó un margen EBITDA del 48.3% en el primer trimestre, el más alto en dos años, señal de que la empresa estatal genera caja suficiente para mantener sus compromisos de dividendos y deuda.

La economía colombiana creció 3.1% interanual en el primer trimestre de 2026, acelerándose frente al 2.6% del cuarto trimestre de 2025. Los sectores de mayor dinamismo fueron servicios financieros (+6.4%), comercio (+4.8%) y agricultura (+5.2%). El déficit en cuenta corriente se redujo al 2.8% del PIB en el H1, el nivel más bajo desde 2019.`,
    analisis: `La apreciación del COP en junio contrasta con la tendencia regional de debilidad, lo que refleja los mejores fundamentos relativos de la economía colombiana en este momento: inflación a la baja, posible recorte de tasas inminente y soporte del petróleo. Para el sol peruano, el buen desempeño del COP limita el contagio regional negativo.

Para peruanos con negocios en Colombia o viajes planificados, el tipo de cambio implícito PEN/COP se ubica en aproximadamente 1,225 COP por sol peruano (COP 4,180 / USD ÷ S/ 3.41 / USD). Para optimizar las conversiones previas a viajes o transacciones internacionales, QoriCash ofrece el mejor tipo de cambio PEN/USD del mercado.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i015',
    titulo: 'Chile: exportaciones de cobre alcanzan US$ 5,200M en H1 2026, crecimiento del 9.3%; peso chileno cierra el semestre en 918 CLP/USD',
    descripcion: 'Las exportaciones de cobre de Chile sumaron US$ 5,200 millones en el primer semestre de 2026, un crecimiento del 9.3% impulsado por precios promedio de US$ 4.82/libra y producción en recuperación. El peso chileno cerró junio en 918 CLP/USD, depreciándose 4.3% en el semestre pese al apoyo del cobre, con el Banco Central de Chile pendiente de un posible recorte en el H2.',
    contenido: `Las exportaciones de cobre de Chile totalizaron US$ 5,200 millones en el primer semestre de 2026, un crecimiento del 9.3% frente a los US$ 4,760 millones del H1 2025, según datos del Banco Central de Chile y Cochilco (Comisión Chilena del Cobre). El resultado combina precios promedio del metal en US$ 4.82/libra —el más alto desde 2022— con una producción semestral de 2.78 millones de toneladas métricas finas (TMF), en recuperación gradual tras los problemas operativos que afectaron a Codelco en 2024.

Codelco —la estatal cuprìfera más grande del mundo— reportó una producción de 687,000 TMF en el H1, un crecimiento del 6.4% interanual, luego de los problemas de mantenimiento y conflictos laborales que afectaron 2024. La División Chuquicamata (92,000 TMF en el H1) y El Teniente (95,000 TMF) fueron las unidades de mayor expansión. Las empresas privadas como BHP-Escondida (440,000 TMF), Anglo American Sur (89,000 TMF) y Antofagasta Minerals (127,000 TMF) también contribuyeron con crecimientos superiores al 8%.

El peso chileno (CLP) cerró junio en 918 por dólar, depreciándose 4.3% en el primer semestre pese al soporte de precios elevados del cobre. La presión del DXY en 101.8 y la salida de capitales de emergentes superaron el efecto estabilizador del metal rojo. El Banco Central de Chile (BCCh) mantuvo la tasa de política monetaria en 5.00% en su reunión de junio y el comunicado sugirió que "se evaluarán las condiciones para iniciar un ciclo de flexibilización" en el segundo semestre si la inflación continúa convergiendo al 3%.

La economía chilena creció 2.8% en el primer trimestre de 2026, por debajo del consenso de 3.1%, reflejo del enfriamiento del consumo privado ante tasas de interés elevadas. El sector construcción cayó 1.4%, afectado por el alza del costo del crédito hipotecario. Sin embargo, la inversión minera creció 18.4% impulsada por los proyectos de expansión en el litio (SQM y Codelco Litio).`,
    analisis: `Las exportaciones cuprìferas chilenas en US$ 5,200M en el H1 son positivas para la región en general: el cobre peruano y chileno comparten los mismos determinantes de precio, y el dinamismo exportador de ambos países genera un flujo estabilizador de dólares que limita depreciaciones severas. La competitividad cambiaria de Chile (CLP 918/USD) hace que sus exportaciones no cuprìferas sean más competitivas, un modelo que Perú también replica con el sol en S/ 3.41.

Para empresas peruanas con operaciones o proveedores en Chile, el tipo de cambio implícito PEN/CLP es de aproximadamente 247 pesos chilenos por sol peruano. En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD del mercado, el primer paso indispensable para cualquier operación en divisas con el mercado chileno.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },];

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
