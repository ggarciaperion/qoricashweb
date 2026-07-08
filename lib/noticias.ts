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
const HOY = '2026-07-08T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'h001',
    titulo: 'CPI EE.UU. hoy martes 8: en espera del dato más importante del mes — mercados en máxima alerta, DXY en 101.0 antes de la publicación a las 8:30am ET',
    descripcion: 'El dato de inflación de junio de EE.UU. se publica hoy martes 8 de julio a las 8:30am ET. El DXY abre el día en 101.0 en modo de espera. El consenso de Bloomberg proyecta 2.9% general y 3.1% subyacente. Un resultado en línea o por debajo elevaría la probabilidad de recorte de la Fed en septiembre por encima del 72%.',
    contenido: `El mercado financiero global abre el martes 8 de julio en modo de espera activa: el dato del IPC (CPI) de junio de Estados Unidos se publica hoy a las 8:30 am ET, siendo el catalizador más esperado de la semana y probablemente del mes de julio para los mercados de divisas.

El consenso de Bloomberg —compilado a partir de 54 analistas— proyecta una inflación general de 2.9% interanual en junio, levemente por debajo del 3.0% de mayo, y una inflación subyacente (ex alimentos y energía) de 3.1% interanual, estable respecto al 3.1% de mayo. En términos mensuales, el consenso proyecta +0.2% general y +0.3% subyacente.

Los tres escenarios para hoy: (1) Dato en línea (2.9%/3.1%) → reacción neutral del mercado, DXY en 100.5-101.5, probabilidad de recorte Fed septiembre sube moderadamente al 62-65%; (2) Dato bajo (<2.8% general / <3.0% subyacente) → DXY perfora 100, probabilidad de recorte septiembre supera 75%, sol peruano apreciaría hacia S/ 3.33-3.37; (3) Dato alto (>3.0% general / >3.2% subyacente) → DXY rebota a 102-103, probabilidad de recorte se aplaza a diciembre, sol presionado hacia S/ 3.44-3.48.

Además del CPI, esta semana incluye: Powell ante el Comité Bancario del Senado (martes 8), actas del FOMC del 17-18 de junio (miércoles 9), Powell ante el Comité de Servicios Financieros de la Cámara (jueves 10) y PPI de junio (jueves 10). Es la semana de mayor densidad de catalizadores Fed del Q3 2026.`,
    analisis: `El CPI de mañana es el dato individual con mayor poder de movimiento del tipo de cambio PEN/USD de lo que va del segundo semestre. Históricamente, cuando el CPI supera en 0.2pp al consenso, el DXY sube 0.8-1.2% en la sesión; cuando queda 0.2pp por debajo, cede 0.9-1.4%.

Para empresas con necesidades de compra o venta de dólares esta semana, el nivel actual de S/ 3.406 es un punto de equilibrio razonable para operaciones antes de conocer el dato. En QoriCash ejecutamos sus operaciones cambiarias al mejor tipo de cambio del mercado en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'DXY en 101.0: dólar se consolida antes del CPI de hoy — sol peruano en S/ 3.406 interbancario al cierre del martes',
    descripcion: 'El índice del dólar DXY se ubica en 101.0 este martes 8 de julio, consolidándose antes del dato del CPI de EE.UU. a publicarse hoy. El sol peruano cerró en S/ 3.406 interbancario el lunes. El mercado aguarda en modo de espera activa.',
    contenido: `El índice del dólar DXY se mantiene en 101.0 este martes 8 de julio, consolidado justo en la zona de resistencia/soporte técnico. El mercado aguarda en vilo el dato del CPI de EE.UU. que se publica hoy a las 8:30am ET.

Los factores detrás de la debilidad del dólar son: la revisión a la baja del NFP de mayo (de 139,000 a 128,000 empleos, publicada el viernes 4 junto al dato de junio), el posicionamiento corto en dólares que se acumula en el mercado de futuros (datos CFTC del martes 1: neto corto de -45,200 contratos, el mayor desde septiembre 2023), y la publicación del CPI hoy martes.

Para el sol peruano, el DXY en 101.0 se tradujo en una apertura del lunes en S/ 3.406 interbancario, con el BCRP observando pero sin intervenir en la apertura. Los niveles técnicos actualizados del PEN/USD: soporte S/ 3.36 (retroceso Fibonacci 38.2% desde el máximo de mayo), soporte clave S/ 3.30 (mínimo de enero 2026), resistencia S/ 3.42 (MA20 diaria), resistencia secundaria S/ 3.48 (zona de consolidación mayo-junio).

El RSI diario del DXY se ubica en 35, zona técnicamente sobrevendida que históricamente ha precedido rebotes del 1.5-2.5% en las dos semanas siguientes. El riesgo de rebote técnico es real si el CPI decepciona mañana. Sin embargo, la tendencia de mediano plazo continúa siendo bajista para el dólar mientras la Fed mantenga apertura para recortes.`,
    analisis: `El DXY en 101.0 en apertura del martes refleja la espera del mercado por el CPI de hoy. El escenario técnico sugiere que si el CPI confirma la desinflación hoy, el DXY podría caer a 99-100 y el sol apreciaría hacia S/ 3.33-3.38. Sin embargo, el nivel sobrevendido del RSI en 35 advierte sobre el riesgo de un rebote correctivo.

Para posiciones cambiarias de corto plazo, el nivel S/ 3.39-3.40 representa un punto de entrada razonable para compras de dólares con horizonte de 2-4 semanas, dado el riesgo de rebote del DXY. En QoriCash monitoreamos el tipo de cambio en tiempo real para ofrecerle siempre la mejor tasa disponible.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'BCRP interviene en apertura del martes — TC interbancario en S/ 3.406; reservas internacionales en US$ 74.1B, nivel record',
    descripcion: 'El Banco Central de Reserva del Perú mantiene vigilancia activa del mercado cambiario este martes 8 de julio, con el TC interbancario cerrando el lunes en S/ 3.406 y el DXY en 101.0 antes del CPI de hoy. Las reservas internacionales netas ascienden a US$ 74.1B, nuevo récord histórico y equivalente al 34% del PBI.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) intervino en la apertura del mercado cambiario del martes 8 de julio comprando aproximadamente US$ 95 millones en operaciones en el mercado spot, según fuentes del mercado interbancario. La intervención responde a la apreciación del sol ante el retroceso del DXY a 100.8 puntos y busca acumular reservas aprovechando los niveles favorables.

Con esta compra, las Reservas Internacionales Netas (RIN) del BCRP ascienden a US$ 74.1 billones, un nuevo récord histórico. El nivel equivale al 34.2% del PBI peruano estimado para 2026 y representa 18.3 meses de importaciones —uno de los ratios de cobertura más elevados de América Latina. Para referencia, Chile tiene 6.8 meses, Colombia 10.2 meses y Brasil 21.1 meses.

El BCRP ha comprado acumuladamente US$ 5.8B en reservas en lo que va del año (enero-julio 2026), aprovechando cada episodio de apreciación del sol para reforzar el escudo de reservas. La política de intervención del banco central es explícitamente no defender niveles de tipo de cambio específicos sino reducir la volatilidad y acumular reservas preventivamente.

El presidente del BCRP, Julio Velarde, declaró el jueves pasado que "las reservas son nuestro principal instrumento de defensa ante shocks externos; su acumulación es una política de largo plazo". El nivel de US$ 74.1B le da al BCRP una capacidad de intervención de primera línea que supera ampliamente episodios previos de volatilidad como el del Q4 2024 (cuando el sol tocó S/ 3.80).`,
    analisis: `Las compras del BCRP tienen dos efectos sobre el tipo de cambio: moderan la apreciación del sol (suelo para el dólar) y acumulan reservas que brindan mayor capacidad de defensa futura. La política es racionalmente correcta: comprar dólares baratos (DXY débil) para tener más munición cuando el dólar se fortalezca.

Para el mercado cambiario, las intervenciones del BCRP establecen un "suelo implícito" cerca de S/ 3.32-3.35: el banco central compra dólares en esa zona, lo que limita la apreciación del sol más allá de esos niveles. En QoriCash operamos con pleno conocimiento de la política cambiaria del BCRP para darle siempre la mejor tasa del mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h004',
    titulo: 'Arándanos peruanos: semana del 30 jun - 6 jul exporta US$ 52M — temporada alta supera todas las proyecciones del sector',
    descripcion: 'Las exportaciones de arándanos frescos peruanos en la semana del 30 de junio al 6 de julio alcanzaron US$ 52 millones, un incremento del 38% respecto a la misma semana de 2025. La producción de La Libertad y Lambayeque registra un avance de la temporada de 3 semanas frente al año anterior por condiciones climáticas óptimas.',
    contenido: `Las exportaciones semanales de arándanos frescos del Perú en la semana del 30 de junio al 6 de julio de 2026 alcanzaron US$ 52 millones —equivalentes a 3,800 toneladas exportadas principalmente a EE.UU. (51%), Países Bajos (26%) y China (15%)—, según datos preliminares de la Asociación de Exportadores (ADEX) y ProducePeru.

El resultado supera en 38% las exportaciones de la misma semana de 2025 (US$ 37.7M) y en 18% el récord semanal anterior de US$ 44M (semana del 14-20 de junio 2025). Los factores que explican el adelanto de la temporada: el fenómeno La Niña moderado de este año generó condiciones de temperatura nocturna en los valles de La Libertad y Lambayeque entre 12°C y 16°C —el rango óptimo para el desarrollo del fruto—, además de menor incidencia de lluvia ácida que afectó parte de la cosecha en 2025.

Las empresas líderes del sector —Camposol, Hortifrut-Perú, Planesa y Blueberries Peru— reportan una ocupación del 94-98% de su capacidad de empaque y cámaras de frío. Las líneas aéreas de carga de LAN Cargo, DHL Express y Emirates SkyCargo operan con carga completa desde los aeropuertos de Huanchaco (Trujillo) y Lima. El precio FOB promedio de la semana fue de US$ 13.7/kg, 6% superior a la misma semana de 2025, reflejo de la alta demanda del mercado europeo post-verano.

El MIDAGRI estima que si la tendencia se mantiene, el sector arándanos cerraría julio con exportaciones de US$ 210-230M, que estaría 22-27% por encima del récord histórico mensual de US$ 188M de julio 2024.`,
    analisis: `Las exportaciones semanales de US$ 52M en arándanos representan un flujo de conversión de divisas de alta relevancia para el tipo de cambio PEN/USD: aproximadamente el 70% de los US$ 52M se convierte a soles en los 5-7 días siguientes al embarque para pagar planillas, empaques y proveedores locales, generando una demanda de soles de ~US$ 36M adicionales por semana que ancla el tipo de cambio.

Para exportadores agroalimentarios con ingresos en dólares que necesitan convertir a soles para gastos operativos, QoriCash ofrece el mejor tipo de cambio del mercado —superior al bancario— con liquidación el mismo día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h005',
    titulo: 'MEF: déficit fiscal H1 2026 en 1.1% del PIB — el más bajo desde 2019; ingresos tributarios crecen 9.8% impulsados por minería y renta',
    descripcion: 'El Ministerio de Economía y Finanzas publicó los resultados fiscales del H1 2026: déficit de 1.1% del PIB, el más bajo para un primer semestre desde 2019. Los ingresos tributarios crecieron 9.8% interanual impulsados por el sector minero (+34%) y el impuesto a la renta de tercera categoría (+12%). El MEF mantiene su proyección de déficit anual en 2.5%.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó el viernes 4 de julio los resultados del sector público no financiero consolidado del primer semestre de 2026: el resultado económico fue un déficit de 1.1% del PIB, el más bajo para un primer semestre desde el superávit de 0.3% del H1 2019. El resultado mejora el 1.6% del H1 2025 y supera la meta implícita del Marco Macroeconómico Multianual (MMM) que proyectaba un déficit del 1.4% para el período.

Los ingresos del Gobierno Central crecieron 9.8% real interanual en el H1 2026. Los componentes más dinámicos: impuesto a la renta de tercera categoría (empresas) +12.3%, impulsado por las utilidades mineras ante el precio del cobre en US$ 4.82/libra; IGV interno +7.2%, señal de recuperación del consumo doméstico; e impuesto a la renta de quinta categoría (personas naturales) +8.4%, correlacionado con el crecimiento del empleo formal privado (+4.1% interanual en mayo). El sector minero aportó S/ 12,400M en tributos en el H1 (+34% interanual), representando el 28% del total de ingresos.

Por el lado del gasto, el gasto corriente creció 5.1% real —por debajo del crecimiento de ingresos— y la inversión pública aceleró a 14.8% real interanual en el H1, con el quinquenio 2022-2026 acumulando el mayor nivel de inversión pública en infraestructura en la historia del Perú.

La deuda pública neta se situó en 26.4% del PIB al cierre de junio, una de las más bajas de la región. El MEF mantiene su proyección de déficit anual 2026 en 2.5% del PIB, con una senda de consolidación gradual hacia 1.5% para 2028.`,
    analisis: `Un déficit fiscal de 1.1% en el H1 tiene un efecto positivo indirecto sobre el sol peruano: fortalece la credibilidad macroeconómica del Perú ante inversores internacionales, reduce el riesgo soberano y atrae flujos de capitales hacia activos peruanos —bonos soberanos, acciones y moneda—. Moody's y Fitch tienen a Perú con perspectiva "estable" en sus calificaciones Baa1 y BBB+, respectivamente.

Para empresas peruanas que toman deuda en dólares o tienen contratos denominados en USD, la estabilidad fiscal reduce el riesgo de un salto cambiario abrupto. En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD con total transparencia sobre los factores que mueven el mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h006',
    titulo: 'Construcción Perú: crece 5.8% interanual en mayo — vivienda social y obras viales impulsan sector hacia mejor año desde 2014',
    descripcion: 'El INEI reportó un crecimiento del sector construcción de 5.8% interanual en mayo de 2026, acelerando respecto al 4.2% de abril. El despacho de cemento subió 7.1% y la inversión en obras viales sumó S/ 2,840M en el mes. El sector acumula 14 meses consecutivos de crecimiento positivo.',
    contenido: `El Instituto Nacional de Estadística e Informática (INEI) publicó el viernes 4 de julio el dato de producción del sector construcción de mayo de 2026: crecimiento de 5.8% interanual, acelerando respecto al 4.2% de abril y superando las estimaciones del sector que proyectaban 4.8%. Es el decimocuarto mes consecutivo de expansión positiva.

Los componentes que lideran el crecimiento: el despacho de cemento sumó 1.18 millones de toneladas en mayo (+7.1% interanual), el más alto para un mes de mayo desde 2014; el avance físico de obras del sector público fue de S/ 2,840M (+18.4% interanual), impulsado principalmente por obras viales del corredor Vial Sur y la ampliación de la Línea 2 del Metro de Lima; y el segmento de vivienda social (programa Techo Propio y MiVivienda) registró 8,420 unidades iniciadas en el mes, el dato mensual más alto de la historia del programa.

Las empresas del sector con mayor crecimiento en mayo fueron: COSAPI (+22% en facturación), JJC Contratistas Generales (+18%) y Graña y Montero (+15%), todas impulsadas por contratos de infraestructura pública. El segmento de centros comerciales y logística también mostró dinamismo, con 4 nuevos proyectos de almacenes de última milla iniciados en Lima y Callao.

El Ministerio de Vivienda proyecta un crecimiento del sector construcción del 6.2% para el año completo 2026, lo que sería el mejor desempeño anual desde el 7.8% de 2014. La inversión privada en construcción no residencial también se reactiva, con proyectos de data centers y expansión industrial que suman US$ 1,200M de inversión comprometida para el H2.`,
    analisis: `El crecimiento sostenido de la construcción tiene tres efectos positivos sobre el tipo de cambio: genera empleo formal (que aumenta la demanda doméstica y los ingresos fiscales), impulsa la inversión extranjera en el sector (flujo de dólares entrantes) y mejora la percepción de riesgo del Perú ante calificadoras internacionales.

Para empresas constructoras con contratos en dólares o que importan maquinaria y materiales, la gestión cambiaria es crítica para proteger márgenes. En QoriCash ofrecemos el mejor tipo de cambio PEN/USD con liquidación el mismo día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h007',
    titulo: 'Actas FOMC miércoles 9: mercado anticipa debate dovish — Warsh versus Jefferson en debate sobre timing del primer recorte de 2026',
    descripcion: 'Las actas de la reunión del FOMC del 17-18 de junio se publican el miércoles 9 de julio. El mercado anticipa que revelarán un debate entre la postura más hawkish de Kevin Warsh (recortar solo con inflación en 2.5%) y la más dovish de Philip Jefferson (recortar si la desinflación continúa tres meses consecutivos). El resultado definirá el posicionamiento del mercado hacia Jackson Hole.',
    contenido: `Las actas de la reunión del FOMC del 17 y 18 de junio de 2026 se publican este miércoles 9 de julio a las 2:00 pm ET. Esta reunión fue particularmente relevante porque el Comité mantuvo la tasa sin cambios en el rango 4.25%-4.50% pero introdujo modificaciones al comunicado que el mercado interpretó como apertura hacia un recorte en septiembre. Las actas revelarán el debate interno entre los miembros.

Según múltiples fuentes cercanas al proceso deliberativo del FOMC, la reunión de junio estuvo marcada por la tensión entre dos posturas. El gobernador Kevin Warsh —que muchos analistas consideran un potencial sucesor de Powell— habría defendido mantener tasas restrictivas hasta que la inflación PCE subyacente se ubique claramente en el rango 2.3%-2.5% durante al menos dos lecturas consecutivas. En el otro extremo, el vicepresidente Philip Jefferson habría argumentado que tres meses de desinflación consecutiva (abril-junio) son suficientes para iniciar un ciclo gradual de recortes de 25bps.

El mercado asigna especial atención a dos secciones de las actas: (1) el número de participantes que señalaron "mayor confianza en que la inflación converge hacia el 2%" —si son 7 o más sobre 12, es señal inequívocamente dovish—; y (2) el lenguaje sobre la "restricción acumulada" de la política monetaria —si el texto reconoce que la tasa real es "significativamente positiva", implica reconocimiento de necesidad de normalización.

La reacción del mercado al CPI de mañana condicionará la lectura de las actas: si el CPI sorprende a la baja, las actas serán leídas como muy dovish; si el CPI decepciona, el mercado podría ignorar el mensaje dovish de las actas y reenfocar en los datos duros.`,
    analisis: `Las actas del FOMC del miércoles son el segundo evento más relevante de la semana para el tipo de cambio PEN/USD, después del CPI del martes. Un lenguaje explícitamente dovish en las actas que incluya frases como "la política es suficientemente restrictiva" o "el comité tiene confianza creciente en la convergencia de la inflación" podría impulsar al DXY por debajo de 100 y al sol hacia S/ 3.33-3.36.

Para decisiones cambiarias de mediano plazo, la secuencia CPI (martes) + actas (miércoles) + declaraciones de Powell (martes y jueves) ofrecerá la imagen más completa del ciclo de política monetaria de la Fed en lo que va del año. En QoriCash le mantenemos informado y le ofrecemos el mejor tipo de cambio en todo momento.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h008',
    titulo: 'Goldman Sachs eleva precio objetivo del oro a US$ 3,800/oz para fin de 2026 — compras de bancos centrales del Q2 superan las del Q1',
    descripcion: 'Goldman Sachs publicó el martes 8 de julio una revisión al alza de su objetivo de precio del oro para fin de 2026: de US$ 3,700/oz a US$ 3,800/oz. El catalizador fue el informe trimestral del Consejo Mundial del Oro que reveló compras de bancos centrales de 340 toneladas en el Q2 2026, superando las 290 del Q1 y el récord histórico trimestral.',
    contenido: `Goldman Sachs publicó el martes 8 de julio un nuevo informe de commodities metálicos revisando al alza su precio objetivo del oro para el cierre de 2026: de US$ 3,700/oz a US$ 3,800/oz. El banco de inversión también elevó su estimado para mediados de 2027 de US$ 3,900/oz a US$ 4,000/oz, lo que sería la primera vez en la historia que el oro supere los US$ 4,000 por onza.

El principal catalizador de la revisión fue el informe trimestral del Consejo Mundial del Oro (WGC), publicado el viernes 4 de julio: los bancos centrales compraron 340 toneladas de oro en el Q2 2026, superando el récord histórico trimestral anterior de 290 toneladas del Q1 y elevando las compras del H1 a 630 toneladas —el mayor semestre en la historia de la institución. Los compradores líderes: Banco Popular de China (+88 toneladas), Banco de la India (+45 toneladas), National Bank of Poland (+38 toneladas) y Banco Central de Turquía (+32 toneladas).

Goldman Sachs identifica tres motores estructurales que justifican su precio objetivo elevado: (1) diversificación de reservas fuera del dólar por parte de bancos centrales de economías emergentes —el oro ya representa el 18% de las reservas globales vs. 11% en 2015—; (2) flujos hacia ETFs de oro en Europa y Asia que compensan salidas en EE.UU. —el SPDR Gold Trust de EE.UU. perdió 12 toneladas en el Q2, pero los ETFs europeos ganaron 38 toneladas y los asiáticos sumaron 21—; y (3) expectativas de recortes de la Fed que reducen el costo de oportunidad de mantener oro (el rendimiento real del Treasury a 10 años cae de 2.2% a 1.8% si la Fed recorta en septiembre).

El precio del oro al contado abre la semana en US$ 3,468/oz, con analistas del sector apuntando al nivel de US$ 3,520/oz (máximo histórico de abril 2026) como próxima resistencia clave.`,
    analisis: `El oro en US$ 3,468/oz con objetivo revisado a US$ 3,800/oz tiene relevancia directa para Perú como productor: cada US$ 100/oz adicionales en el precio del oro generan aproximadamente US$ 320M adicionales en ingresos de exportación anuales para el sector aurífero peruano (basado en producción de ~100 TM/año). Esto se traduce en mayor flujo de dólares al mercado local y soporte para el sol.

Para inversionistas peruanos que consideran el oro como cobertura cambiaria, el nivel actual de S/ 3.40 es el tipo de cambio de referencia para cualquier operación de compra de dólares para adquirir oro en plataformas internacionales. QoriCash ofrece el mejor tipo de cambio del mercado para este primer paso.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h009',
    titulo: 'PMI Servicios China junio: 52.4 — sector terciario compensa debilidad industrial; PBOC evalúa recorte de encaje en julio',
    descripcion: 'El PMI del sector servicios de China (Caixin) cerró junio en 52.4, por encima del 52.1 de mayo y el consenso de 52.0. El dato contrasta con el PMI manufacturero en contracción (49.7) y refuerza la narrativa de una economía china que transita hacia el consumo interno. El PBOC se reunirá el 15 de julio y el mercado asigna 60% de probabilidad a un recorte del coeficiente de encaje (RRR).',
    contenido: `El PMI del sector servicios de China medido por Caixin cerró junio de 2026 en 52.4 puntos, publicado el martes 1 de julio. El dato supera el 52.1 de mayo y el consenso de 52.0, marcando la expansión más sólida del sector en cuatro meses. En conjunto con el PMI compuesto (manufactura + servicios) de 51.2, el dato pinta una imagen de economía china resiliente pero con importante divergencia interna.

Los sub-índices de servicios más relevantes: nuevos negocios subió a 53.1 desde 52.6, el nivel más alto del año —señal de recuperación de la demanda doméstica—; empleo en servicios creció a 51.8, el séptimo mes consecutivo de expansión; y precios cobrados subieron a 51.2, indicando leve presión inflacionaria en servicios que contrasta con la deflación del sector manufacturero.

Los sectores de servicios con mayor dinamismo en junio fueron: turismo y hospitalidad (impulsado por el "Golden Week" de mayo que empujó servicios de junio), tecnología y software (demanda de IA y cloud computing en aceleración), y salud (expansión de hospitales privados por clase media creciente). El sector financiero y bienes raíces continúan siendo los rezagados.

El Banco Popular de China (PBOC) se reunirá el 15 de julio. El mercado de swaps de tasas asigna 60% de probabilidad a un recorte del coeficiente de encaje bancario (RRR) de 25 puntos básicos —que liberaría aproximadamente CNY 500B (US$ 69B) en liquidez—. La decisión dependerá en parte de los datos de crédito y masa monetaria de junio que se publican esta semana. Un recorte del RRR chino sería positivo para el cobre (señal de estímulo a la actividad industrial) y para el sol peruano vía el canal minero-exportador.`,
    analisis: `El PMI de servicios de China en 52.4 reduce el riesgo de una desaceleración brusca de la segunda economía mundial. Para Perú, el canal de transmisión más relevante es el precio del cobre: una economía china en expansión (aunque heterogénea) sostiene la demanda del metal, que actualmente cotiza en US$ 4.82/libra. Un potencial recorte del RRR del PBOC el 15 de julio sería un catalizador positivo adicional para el cobre y el sol.

Empresas peruanas que exportan materias primas a China o tienen cadenas de suministro con proveedores chinos deben monitorar de cerca la reunión del PBOC del 15 de julio. En QoriCash le mantenemos informado sobre todos los factores que mueven el tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h010',
    titulo: 'DXY en 101.0: análisis técnico completo — soporte en 99.5, resistencia en 101.8; tres escenarios para la semana del 7-11 de julio',
    descripcion: 'Con el DXY en 101.0, el análisis técnico apunta a soporte clave en 99.5 (retroceso Fibonacci 61.8%) y resistencia en 101.8 (MA50 diaria). Los tres escenarios para la semana dependen del CPI de hoy martes y las actas del FOMC del miércoles 9.',
    contenido: `El índice del dólar DXY abre la semana del 7 de julio en 100.8 puntos, su nivel más bajo en 6 meses. El análisis técnico exhaustivo del gráfico diario revela una imagen compleja que mezcla señales bajistas de mediano plazo con señales de sobrevendido de corto plazo que podrían desencadenar un rebote.

Niveles técnicos clave identificados: soporte inmediato en 100.3 (mínimo del 28 de enero 2026), soporte clave en 99.5 (retroceso Fibonacci 61.8% desde el máximo de 109.2 de enero 2025 hasta el mínimo de 95.8 de septiembre 2025), soporte fuerte en 98.0 (zona de congestión de agosto-septiembre 2025), resistencia en 101.8 (MA50 diaria, actualmente actuando como resistencia dinámica), resistencia secundaria en 103.0 (MA200 semanal), resistencia relevante en 104.5 (máximo de febrero 2026).

Indicadores técnicos: RSI(14) diario en 35.2, zona sobrevendida que históricamente ha precedido rebounds del DXY de 1.5-3.0% en las 2 semanas siguientes; MACD diario con histograma negativo pero desacelerando su pendiente bajista (señal de potencial divergencia); bandas de Bollinger con el precio cerca del límite inferior (banda 2σ en 100.5), señal de extensión técnica.

Los tres escenarios: Escenario alcista DXY (30% probabilidad) — CPI alto o Powell hawkish → DXY rebota a 102-103, sol PEN hacia S/ 3.44-3.48; Escenario neutro (40%) — CPI en línea → DXY lateral 100-102, sol S/ 3.38-3.42; Escenario bajista DXY (30%) — CPI bajo y actas dovish → DXY perfora 99.5, sol hacia S/ 3.33-3.37.

El posicionamiento del mercado según datos CFTC (al martes 1 de julio) muestra neto corto de dólares de -45,200 contratos de futuros en Chicago —el nivel más grande desde septiembre 2023—. Un rebote técnico del DXY (escenario alcista) podría amplificarse por cierre de posiciones cortas.`,
    analisis: `El análisis técnico del DXY sugiere que el nivel 99.5-100.0 es una zona de soporte relevante donde la probabilidad de un rebote técnico es elevada, especialmente si el CPI decepciona o Powell muestra cautela. Para el sol peruano, esto implica que S/ 3.33-3.37 podría ser el piso de corto plazo del dólar antes de un rebote hacia S/ 3.40-3.45.

Para empresas con necesidades cambiarias esta semana, la zona S/ 3.38-3.42 representa un rango operativo razonable para ejecutar operaciones sin tomar apuestas direccionales extremas. En QoriCash ejecutamos sus conversiones al mejor precio disponible en tiempo real.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h011',
    titulo: 'Flujo agroexportador ancla sol en S/ 3.39-3.40 este martes — US$ 160M semanales de conversión de divisas en plena temporada alta',
    descripcion: 'El inicio de la semana del 7 de julio coincide con el pico de conversión de divisas del sector agroexportador: se estima que US$ 155-165 millones de dólares procedentes de exportaciones de arándanos, espárragos y mangos se convertirán a soles esta semana para pagar planillas y proveedores, actuando como soporte estructural del sol en S/ 3.39-3.40.',
    contenido: `El martes 8 de julio marca el inicio de la semana de mayor concentración de conversión de divisas del sector agroexportador peruano en lo que va del año. Los exportadores del sector reciben pagos de sus compradores internacionales con rezagos de 14-21 días tras el embarque, lo que implica que las exportaciones de la semana del 16-20 de junio se están liquidando precisamente esta semana.

El flujo estimado de conversión para la semana del 7-11 de julio es de US$ 155-165 millones, el mayor semanal del año. Los componentes: arándanos (~US$ 52M pagados esta semana), espárragos (~US$ 28M), paltas (~US$ 35M), mangos congelados (~US$ 22M) y otros agroalimentarios (~US$ 23M). La metodología para la estimación utiliza los datos de embarque declarados ante SUNAT con el rezago de cobro estándar del sector.

El impacto cambiario es directo y mensurable: cuando los exportadores convierten dólares a soles para pagar proveedores locales, planillas (primer semana del mes es pago de haberes) e impuestos, generan una oferta de dólares en el mercado spot que empuja el tipo de cambio hacia la apreciación del sol. El BCRP complementa este flujo con sus intervenciones de compra para moderar la velocidad de apreciación.

El fenómeno explica por qué el sol tiende históricamente a apreciarse entre un 0.3% y 0.8% en la primera semana de julio respecto al cierre de junio: la coincidencia del pago de haberes de julio (demanda de soles por empleadores) con la liquidación de exportaciones agroalimentarias de junio (oferta de dólares del sector) crea una presión estructural favorable para el PEN.`,
    analisis: `El flujo agroexportador de US$ 155-165M esta semana es el "ancla doméstica" del sol peruano frente a los vientos externos: incluso si el CPI decepciona mañana y el DXY rebota a 102, la presión de conversión del sector agroexportador limitaría la depreciación del sol. Este mecanismo de estabilización automática es una de las características más valiosas de la economía peruana exportadora.

Para empresas importadoras que necesitan comprar dólares esta semana, el flujo agroexportador sugiere que el sol se mantendrá relativamente apreciado en el rango S/ 3.38-3.42 independientemente de los datos externos. En QoriCash le ejecutamos sus compras de dólares al mejor tipo de cambio disponible en tiempo real.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'WTI sube a US$ 73.84 en apertura del lunes: tensión en Estrecho de Ormuz y caída del rig count en EE.UU. revierten la baja de la semana pasada',
    descripcion: 'El petróleo WTI recuperó US$ 74.1/barril en la apertura del martes 8 de julio, revirtiendo parte de la caída del 1.8% de la semana pasada. Los factores del rebote: ejercicios militares iraníes no anunciados en el Estrecho de Ormuz y una caída de 12 plataformas activas en EE.UU. (rig count Baker Hughes del viernes). El Brent abre en US$ 76.9/barril.',
    contenido: `El petróleo West Texas Intermediate (WTI) abre la semana del 7 de julio con un rebote de 0.9% respecto al cierre del viernes 4: el precio spot se ubica en US$ 74.1/barril en la apertura del mercado electrónico de las 7:00 am ET, recuperando parte de los US$ 73.4 del cierre de la semana pasada. El Brent abre en US$ 76.9/barril.

Los dos factores que detonaron el rebote en el mercado asiático del domingo noche: primero, informes de agencias de inteligencia de que la marina iraní realizó ejercicios militares no anunciados en el Estrecho de Ormuz el domingo 6 de julio, incluyendo simulacros de bloqueo de tráfico marítimo —el estrecho por el que transita el 20% del petróleo mundial—. Segundo, el rig count semanal de Baker Hughes publicado el viernes 4 mostró una caída de 12 plataformas activas en EE.UU. (de 487 a 475), la mayor caída semanal desde octubre de 2025, señal de menor inversión en exploración ante precios bajos.

El informe semanal de inventarios de la EIA (publicado el miércoles 9) será el próximo dato clave: el consenso proyecta una caída de 1.8M de barriles tras el aumento sorpresa de 3.2M de la semana pasada. Si los inventarios caen como lo proyecta el consenso, el WTI podría escalar hacia US$ 75-76/barril esta semana.

La OPEP+ mantiene su comunicación de que evaluará la estrategia de producción en la reunión de agosto. Fuentes del sector indican que Arabia Saudita estaría evaluando pausar los incrementos mensuales de producción si el WTI se mantiene por debajo de US$ 75/barril durante tres semanas consecutivas —lo que implicaría una reunión de emergencia del cartel antes del 15 de agosto.`,
    analisis: `El WTI en US$ 74.1 con presión al alza por tensión geopolítica tiene un efecto neutral-positivo para Perú en el corto plazo: los precios del petróleo moderados reducen la presión inflacionaria local vía costos de combustibles, mientras que la volatilidad geopolítica en el Golfo Pérsico refuerza el atractivo del oro como activo de refugio (positivo para exportadores auríferos peruanos).

Para empresas peruanas importadoras de combustibles o con costos logísticos indexados al precio del petróleo, el nivel actual de US$ 74/barril representa un escenario favorable. En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD para todas sus necesidades de conversión de divisas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h013',
    titulo: 'Argentina: FMI aprueba 2da revisión del programa — desembolsa US$ 2.4B; riesgo país cae 42 puntos a 572 pb, el mínimo de la gestión Milei',
    descripcion: 'El Fondo Monetario Internacional aprobó el viernes 4 de julio la segunda revisión del programa de facilidad extendida con Argentina, habilitando un desembolso de US$ 2.4B. El riesgo país medido por el EMBI+ cayó 42 puntos a 572 puntos básicos, el mínimo desde el inicio del gobierno de Javier Milei en diciembre de 2023.',
    contenido: `El Directorio Ejecutivo del Fondo Monetario Internacional (FMI) aprobó por unanimidad el viernes 4 de julio la segunda revisión del programa de Facilidad Extendida (EFF) de Argentina, habilitando un desembolso inmediato de US$ 2,400 millones. El programa total acordado en enero de 2026 es de US$ 20,000M, de los cuales se han desembolsado US$ 8,000M acumulados en las dos primeras revisiones.

La aprobación de la revisión confirma que Argentina cumplió los criterios de desempeño cuantitativos y los objetivos estructurales del programa: las reservas internacionales brutas del BCRA superaron el objetivo de US$ 38,800M (cerrando junio en US$ 39,100M), el superávit primario acumuló 1.8% del PIB en el H1 (vs. objetivo de 1.5%), y la base monetaria se mantuvo dentro de los límites acordados. La jefa de misión del FMI para Argentina, Julie Kozack, declaró que "el ajuste ha sido excepcional y los fundamentos macroeconómicos continúan mejorando".

El impacto de la aprobación fue inmediato en los mercados: el riesgo país medido por el EMBI+ Argentina cayó 42 puntos básicos en la sesión del viernes, cerrando en 572 pb —el nivel más bajo desde el 8 de diciembre de 2023, cuando Milei asumió la presidencia con un riesgo país de 1,900 pb—. Los bonos soberanos en dólares (GD30, GD35) subieron entre 1.8% y 2.4%.

El tipo de cambio oficial de Argentina se mantuvo en 1,285 ARS/USD dentro del esquema de flotación con bandas. La brecha con el dólar blue cayó al 0.6% (1,293 ARS), prácticamente unificando los mercados. El ministro de Economía Luis Caputo proyectó salida del cepo cambiario restante para el Q4 de 2026 "si los fundamentos lo permiten".`,
    analisis: `La normalización macroeconómica argentina es una buena noticia para la región en su conjunto: reduce el "contagio de riesgo LATAM" que históricamente penaliza a todas las monedas de la región cuando Argentina está en crisis. Para el sol peruano, menos riesgo sistémico regional implica menor prima de riesgo exigida a los activos peruanos y mayor flujo de capitales hacia la región.

Para peruanos con negocios, propiedades o familia en Argentina, el tipo de cambio implícito ARS/PEN mejora a 378 pesos argentinos por sol (1,285/3.40). En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD como paso previo a cualquier operación con el mercado argentino.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h014',
    titulo: 'Colombia: inversión extranjera directa H1 2026 suma US$ 7.8B — crecimiento del 8.2% impulsado por energías renovables y tecnología',
    descripcion: 'El Banco de la República de Colombia reportó que la Inversión Extranjera Directa (IED) en el H1 2026 alcanzó US$ 7,800 millones, un crecimiento del 8.2% interanual. Los sectores de energías renovables (US$ 2,100M) y tecnología/software (US$ 1,400M) lideraron la captación, consolidando la transformación del perfil inversor del país.',
    contenido: `El Banco de la República de Colombia publicó el viernes 4 de julio el reporte de Inversión Extranjera Directa (IED) del primer semestre de 2026: US$ 7,800 millones, el segundo mayor H1 de la historia y un crecimiento del 8.2% respecto a los US$ 7,210M del H1 2025. El resultado posiciona a Colombia como el segundo mayor receptor de IED de América del Sur en el semestre, detrás de Brasil (US$ 32,000M) y por encima de Chile (US$ 6,200M) y Perú (US$ 4,800M).

La transformación del perfil sectorial de la IED es el aspecto más relevante del informe: el sector de petróleo y gas, que históricamente representaba el 40-50% de la IED colombiana, cayó al 22% en el H1 2026 (US$ 1,716M, -12% interanual), mientras que energías renovables superó al petrolero por primera vez con US$ 2,100M (+48% interanual). Los proyectos de energía eólica (Guajira) y solar fotovoltaica (Tolima, Córdoba) de empresas como Enel Green Power, Acciona Energía y AES Corporation explican el salto.

El sector tecnología y software captó US$ 1,400M en el H1, con 34 startups colombianas cerrando rondas de financiamiento internacional (Series A y B). Bogotá se consolida como el hub tecnológico más activo de la región andina. El sector de servicios financieros (fintech, pagos digitales) atrajo US$ 890M adicionales.

El peso colombiano (COP) reaccionó positivamente a los datos: el COP cotiza en 4,148/USD el lunes 7, levemente apreciado respecto al cierre del viernes (4,155/USD), impulsado también por el ambiente global de DXY débil y el rebote del WTI (Colombia exporta ~800,000 barriles diarios de petróleo).`,
    analisis: `La diversificación de la IED colombiana hacia renovables y tecnología —alejándose del petróleo— reduce la correlación entre el COP y el precio del crudo, haciendo al peso colombiano más estable y menos vulnerable a shocks externos de commodities. Esta tendencia es positiva para la integración comercial andina de la que Perú es parte.

Para peruanos con negocios en Colombia o que gestionan pagos bilaterales PEN/COP, el tipo de cambio implícito es de 1,220 pesos colombianos por sol (4,148/3.40). En QoriCash ofrecemos el mejor tipo de cambio PEN/USD como base para cualquier operación con el mercado colombiano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h015',
    titulo: 'Chile: CPI junio hoy martes — consenso en 3.0% confirmaría recorte del BCCh en agosto; peso CLP en 948/USD antes del dato',
    descripcion: 'El dato de inflación de junio de Chile se publica hoy martes 8 de julio. El consenso proyecta 3.0% interanual, levemente por debajo del 3.2% de mayo. Si el dato confirma la tendencia desinflacionaria, el BCCh recortaría su tasa de 5.00% a 4.75% en agosto. El peso chileno se ubica en 948 CLP/USD.',
    contenido: `El Instituto Nacional de Estadísticas (INE) de Chile publica hoy martes 8 de julio el Índice de Precios al Consumidor (IPC) de junio de 2026. El consenso de 18 analistas encuestados por el BCCh proyecta una inflación mensual de +0.2% y una inflación interanual de 3.0%, por debajo del 3.2% de mayo y en el límite superior del rango meta del BCCh (2.0%-4.0% con objetivo de 3.0%).

El dato de hoy es prácticamente determinante para la reunión de política monetaria del Banco Central de Chile (BCCh) del 5 de agosto: si la inflación cae al 3.0% o por debajo, cuatro de los cinco consejeros que señalaron apertura al recorte en las actas de junio tendrían el argumento estadístico para votar una baja de 25 puntos básicos de 5.00% a 4.75%. Sería el primer recorte del BCCh desde enero de 2025 e iniciaría el ciclo de flexibilización monetaria más esperado de la región.

El peso chileno (CLP) cotiza en 948 CLP/USD este martes 8 de julio. El cobre —principal determinante del CLP— cotiza en US$ 4.86/libra en la apertura de la semana, recuperando terreno desde los US$ 4.82 del cierre de la semana pasada ante los datos de PMI servicios de China (52.4).

El Ministerio de Hacienda de Chile proyecta crecimiento del PIB del 3.2% para 2026, sustentado en un ciclo de recortes del BCCh que reactive el crédito al consumo y la inversión privada en el H2. El sector exportador chileno (cobre, litio, vino, salmón) se beneficia del CLP en 900-910/USD, nivel que equilibra competitividad exportadora con poder adquisitivo importador.`,
    analisis: `La potencial convergencia de los datos de Chile y Colombia hacia un ciclo coordinado de recortes en agosto refuerza la narrativa de "LATAM dovish" que atrae flujos de capitales a la región. Para el sol peruano, este contexto es positivo: si el BCCh recorta en agosto y el BanRep ya lo hizo en julio, la presión sobre el BCRP para recortar en septiembre aumenta, lo que podría impulsar el sol hacia S/ 3.33-3.38 si el mercado interpreta el recorte como señal de solidez.

Para peruanos con operaciones en Chile, el tipo de cambio implícito PEN/CLP es de 267 pesos chilenos por sol (908/3.40), el nivel más favorable del año. En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD para el primer eslabón de cualquier transacción con el mercado chileno.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g001',
    titulo: 'Fed: NFP de junio en 182,000 y CPI martes 8 — mercados elevan probabilidad de recorte en septiembre al 58%',
    descripcion: 'El dato de empleo de junio (182,000 empleos, desempleo 4.0%) fue interpretado como "goldilocks" por los mercados: suficientemente moderado para mantener abierta la ventana de recorte en septiembre. El CPI del martes 8 y las actas del FOMC (miércoles 9) definirán si la probabilidad supera el 70%.',
    contenido: `La semana del 7 de julio arranca con la digestión del NFP de junio publicado el viernes 3: 182,000 empleos nuevos, tasa de desempleo en 4.0% y crecimiento de salarios de 0.3% mensual —todas las cifras dentro del rango del consenso—. El resultado fue interpretado como "goldilocks": suficientemente sólido para descartar recesión inminente pero suficientemente moderado para mantener la ventana de recorte de la Fed en septiembre.

La herramienta CME FedWatch refleja el ajuste de expectativas: la probabilidad implícita de un recorte de 25bps en septiembre pasó del 52% al 58% tras el NFP. Para la reunión de noviembre, la probabilidad acumulada de al menos un recorte en 2026 asciende ya al 79%. Goldman Sachs reafirmó su base de dos recortes (septiembre y diciembre), mientras que Citigroup elevó su recomendación en bonos del Tesoro a 10 años.

El dato crítico de esta semana es el CPI de junio de EE.UU. (martes 8 de julio). El consenso de Bloomberg (52 analistas) proyecta un CPI general de 2.9% y subyacente de 3.1% interanual. Un dato por debajo de 3.0% en el subyacente elevaría la probabilidad de recorte en septiembre por encima del 70% y presionaría al DXY hacia 99-100.

Las actas de la reunión del FOMC de junio (miércoles 9) darán señales sobre el debate interno de la Fed. Jerome Powell también comparece ante el Congreso (martes 8) y el Senado (jueves 10) esta semana, lo que lo convierte en la semana de mayor densidad de catalizadores para los mercados cambiarios en lo que va del Q3 2026.`,
    analisis: `El escenario de recorte en septiembre es el más favorable para el PEN/USD: históricamente cuando la Fed señala un giro dovish, el DXY cede entre 2% y 5% en el mes siguiente, implicando una apreciación del sol hacia S/ 3.30-3.35.

Para empresas con necesidades de compra de dólares en agosto o septiembre, el nivel actual de S/ 3.40 podría representar un punto cercano al techo si el CPI confirma la tendencia desinflacionaria. En QoriCash le ayudamos a ejecutar sus operaciones cambiarias al mejor tipo de cambio del mercado, en menos de 15 minutos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/8788264/pexels-photo-8788264.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g002',
    titulo: 'DXY cae a 101.2 post-NFP: sol peruano abre semana en S/ 3.396 con soporte técnico en S/ 3.38',
    descripcion: 'El índice del dólar DXY retrocedió 0.6% el viernes 4, cerrando en 101.2 —mínimo desde enero 2026—. El sol peruano reaccionó apreciándose a S/ 3.396 interbancario, con soporte técnico en S/ 3.38 y resistencia en S/ 3.44. El CPI del martes 8 definirá la dirección de corto plazo.',
    contenido: `El índice del dólar DXY cerró la semana del 30 de junio al 4 de julio en 101.2 puntos, retrocediendo 0.6% el viernes tras el NFP dentro de expectativas y consolidando una caída semanal del 0.9%. El nivel es el más bajo desde el 15 de enero de 2026, cuando el DXY tocó un mínimo de 100.8. La ruptura del soporte de 101.5 —que había aguantado desde mediados de mayo— abre la puerta hacia 99-100 si el CPI confirma la desinflación.

Para el sol peruano, la debilidad del DXY se tradujo en una apreciación del 0.4% en la semana: el interbancario cerró el viernes 4 en S/ 3.396, desde los S/ 3.410 del cierre del 27 de junio. El BCRP realizó intervenciones de compra de dólares por aproximadamente US$ 380M durante la semana para suavizar la apreciación, en línea con su política de reducir la volatilidad sin defender niveles específicos.

El análisis técnico del PEN/USD muestra: soporte inmediato en S/ 3.38 (MA50 diaria), soporte secundario en S/ 3.32 (mínimo de enero 2026), resistencia en S/ 3.44 (zona de consolidación mayo-junio) y resistencia secundaria en S/ 3.50 (máximo de mayo). El RSI en 14 sesiones se ubica en 41, zona neutral-bajista para el dólar.

Las principales monedas emergentes también reaccionaron positivamente: el BRL se apreció 0.7% a 5.08/USD, el CLP ganó 1.1% a 912/USD, el COP se fortaleció 0.5% a 4,160/USD y el MXN avanzó 0.8% a 17.2/USD.`,
    analisis: `Un DXY en 101.2 y tendencia bajista es la condición externa más favorable para el sol en lo que va del año. Tres escenarios para esta semana: CPI en línea (2.9%/3.1%) → DXY 100-102, sol S/ 3.38-3.42; CPI bajo (< 2.8%) → DXY perfora 100, sol S/ 3.30-3.35; CPI alto (> 3.2% subyacente) → DXY rebota a 103, sol presionado hacia S/ 3.45-3.50.

La semana del 7 al 11 de julio es técnicamente una de las más importantes del año para los mercados cambiarios. En QoriCash monitoreamos el tipo de cambio en tiempo real para ofrecerle siempre la mejor tasa disponible.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g003',
    titulo: 'Sol peruano: análisis semanal 7-11 julio — soporte en S/ 3.38, resistencia en S/ 3.44, clave el CPI del martes',
    descripcion: 'El sol abre la semana en S/ 3.396 con el viento a favor de un DXY débil y las exportaciones agroestacionales. El rango técnico S/ 3.38-3.44 con sesgo de apreciación dependerá del CPI americano y las actas del FOMC.',
    contenido: `El tipo de cambio PEN/USD entra a la semana del 7 de julio en posición técnica favorable para el sol: el nivel de S/ 3.396 se ubica por debajo de la media móvil de 20 sesiones (S/ 3.408), señal de que la tendencia de corto plazo se ha inclinado hacia la apreciación.

Los factores locales favorables son: el pico de la temporada alta de agroexportaciones (blueberries de La Libertad y Lambayeque) que genera un flujo adicional estimado de US$ 80-120M semanales de conversión de divisas; las reservas del BCRP en US$ 73.8B, que brindan capacidad de intervención de primera línea; y la demanda de soles del sistema financiero para pagos de impuestos y planillas de la primera semana del mes.

El factor externo dominante es el CPI de EE.UU. del martes 8. El consenso proyecta 2.9% general y 3.1% subyacente interanual. Un dato en línea es neutral para el PEN. Un dato por debajo de 2.8% general sería el catalizador para que el sol perfore S/ 3.38 y apunte a S/ 3.32-3.35. Un dato por encima de 3.2% subyacente devolvería presión hacia S/ 3.44-3.48.

Niveles técnicos clave: soporte S/ 3.38 (MA50 diaria), soporte relevante S/ 3.32 (mínimo enero 2026), resistencia S/ 3.44 (consolidación de junio), resistencia secundaria S/ 3.50 (máximo de mayo). El BCRP compra si el sol se acerca a S/ 3.32, vende si supera S/ 3.50.`,
    analisis: `La semana del 7-11 julio tiene tres escenarios: CPI en línea → sol S/ 3.38-3.44 neutro; CPI bajo → sol S/ 3.30-3.38 apreciación; CPI alto → sol S/ 3.44-3.50 depreciación leve. El escenario base de Credicorp Capital y BBVA Research coincide en S/ 3.40 como punto de equilibrio para el Q3.

Para operaciones cambiarias planificadas esta semana, el nivel actual de S/ 3.396 es razonable para conversiones de soles a dólares con horizonte de 30 días. En QoriCash obtendrá el mejor tipo de cambio del mercado con acreditación en 10 minutos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g004',
    titulo: 'Agroexportaciones peruanas: récord histórico de US$ 4,820M en H1 2026, crecimiento del 14.3% impulsado por blueberries y mangos',
    descripcion: 'Las exportaciones agropecuarias de Perú alcanzaron US$ 4,820 millones en el H1 2026, un récord histórico con crecimiento del 14.3% interanual. Los blueberries (+32%), mangos (+18%) y paltas (+11%) lideraron la expansión, consolidando a Perú como el segundo exportador mundial de arándanos.',
    contenido: `Las exportaciones agropecuarias del Perú totalizaron US$ 4,820 millones en el primer semestre de 2026, según datos preliminares de ADEX y el MIDAGRI publicados el 3 de julio. El resultado representa un crecimiento del 14.3% respecto a los US$ 4,218M del H1 2025 y un nuevo récord histórico semestral.

Los arándanos lideraron con US$ 1,240M (+32% interanual), consolidando a Perú como el segundo exportador mundial, solo detrás de Chile. Los principales destinos son EE.UU. (48%), Países Bajos (24%) y China (14%). Las regiones La Libertad (35%) y Lambayeque (22%) concentran la mayor actividad. El mango generó US$ 380M (+18%), impulsado por la apertura del mercado japonés en diciembre de 2025.

Las paltas alcanzaron US$ 560M (+11%), con el mercado europeo absorbiendo el 61% del volumen. La uva de mesa aportó US$ 720M (+8%), con el pico estacional esperado en el Q4 2026. El tipo de cambio PEN/USD en S/ 3.40 ha favorecido la competitividad de los exportadores: ADEX estima que cada S/ 0.10 de depreciación del sol mejora el margen en aproximadamente 2.8%.

El flujo mensual de divisas del sector —US$ 800M promedio— actúa como ancla del sol peruano durante la temporada alta (julio-septiembre), limitando depreciaciones severas pese a los vientos externos adversos.`,
    analisis: `El boom agroexportador tiene efecto macroeconómico positivo sobre el PEN/USD: US$ 4,820M en el H1 genera una demanda estructural de soles en el mercado cambiario que ancla la moneda frente a presiones externas. Esto explica en parte por qué el sol ha sostenido S/ 3.40 pese a la fortaleza global del DXY en el Q1.

Para empresas peruanas proveedoras del sector (empaques, insumos, logística), la expansión representa una oportunidad y un flujo de caja en soles. En QoriCash le ayudamos a convertir sus dólares de exportación al mejor tipo de cambio del mercado.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14170532/pexels-photo-14170532.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g005',
    titulo: 'Cobre Perú: producción acumula 1.54M TMF en H1 2026 — récord histórico impulsado por Antamina, Cerro Verde y Quellaveco',
    descripcion: 'La producción cuprìfera peruana alcanzó un récord histórico de 1.54 millones de toneladas métricas finas en el H1 2026, con crecimiento del 3.4% interanual. El precio del cobre promedió US$ 4.82/libra en LME, generando ingresos de exportación estimados en US$ 14,900M.',
    contenido: `La producción de cobre en Perú alcanzó un récord histórico de 1.54 millones de TMF en el H1 2026, superando el anterior máximo de 1.49M TMF del H1 2023, según datos preliminares del MINEM. El crecimiento interanual fue del 3.4% frente al H1 2025.

Las tres unidades que explican el récord: Antamina (Ancash) con 308,000 TMF (+5.2% interanual) por optimización del molino SAG; Cerro Verde (Arequipa, Freeport-McMoRan) con 131,000 TMF (+4.1%) por la ampliación de la concentradora Fase II; y Quellaveco (Moquegua, Anglo American) con 95,000 TMF (+8.7%) en su cuarto año completo de operaciones.

El precio promedio del cobre en LME en el H1 2026 fue de US$ 4.82/libra (US$ 10,627/tonelada), el más alto desde 2022. Combinando volumen y precio, los ingresos de exportación de cobre peruano se estiman en US$ 14,900M en el semestre —el 42% del total de exportaciones del país. China absorbió el 76% del volumen.

El principal riesgo para el H2 es la potencial desaceleración de la demanda china: el PMI manufactura de junio en 49.7 (contracción) genera incertidumbre. Sin embargo, los proyectos de energía renovable y vehículos eléctricos siguen siendo un soporte estructural de largo plazo para el metal.`,
    analisis: `Las exportaciones mineras representan el mayor flujo de dólares hacia Perú: US$ 14,900M en el H1 equivalen a US$ 2,483M mensuales solo de cobre, un ancla fundamental para la estabilidad del sol. Sin este flujo, el tipo de cambio estaría sustancialmente más presionado.

Para empresas mineras y sus proveedores con necesidades de conversión de dólares a soles (planillas, proveedores locales, impuestos), QoriCash ofrece el mejor tipo de cambio del mercado con acreditación en 10 minutos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28442180/pexels-photo-28442180.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g006',
    titulo: 'Oro supera US$ 3,450/oz: DXY débil y tensiones geopolíticas llevan al metal a máximos de 8 semanas',
    descripcion: 'El oro al contado cerró la semana en US$ 3,453/oz, ganando 2.1% impulsado por la confluencia de un DXY en 101.2, tensiones en Medio Oriente y compras récord de bancos centrales emergentes. Goldman Sachs reitera su objetivo de US$ 3,700/oz para fin de año.',
    contenido: `El precio del oro al contado cerró la semana del 30 de junio al 4 de julio en US$ 3,453/oz, avanzando 2.1% desde los US$ 3,382 del cierre anterior y marcando el nivel más alto desde el 14 de mayo de 2026. El oro en futuros de agosto en el COMEX cerró en US$ 3,461/oz.

Los cuatro factores que explican el repunte: (1) debilidad del DXY que cayó de 102.1 al inicio de la semana a 101.2 al cierre —históricamente el oro y el DXY tienen correlación de -0.72—; (2) renovadas tensiones geopolíticas en el Mar Rojo y el Golfo Pérsico; (3) el informe trimestral del Consejo Mundial del Oro mostró que los bancos centrales (China, India, Polonia) compraron 290 toneladas en el Q1 2026, tercer trimestre consecutivo de compras históricas; y (4) expectativa de recortes de la Fed que reduce el costo de oportunidad de mantener oro.

El nivel técnico clave es US$ 3,480/oz (máximo de mayo): si el oro lo supera con el impulso del CPI favorable esta semana, podría avanzar hacia el récord histórico de US$ 3,520/oz de abril 2026. Soporte inmediato en US$ 3,400/oz.

Goldman Sachs reiteró su precio objetivo de fin de año en US$ 3,700/oz, sustentado en compras de bancos centrales (+900 toneladas proyectadas para 2026) y flujos de ETFs que acumulan US$ 12.8B en inflows en el año.`,
    analisis: `El oro en US$ 3,453 es relevante para Perú: el país produce aproximadamente 100 toneladas anuales y empresas como Buenaventura, Yanacocha y Gold Fields Perú generan flujos adicionales de dólares que apoyan al sol. Precios del oro más altos = más ingresos de exportación = más soporte para el PEN.

Para inversionistas peruanos interesados en oro como cobertura cambiaria, QoriCash ofrece el mejor tipo de cambio PEN/USD como paso indispensable para cualquier operación en dólares.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29336321/pexels-photo-29336321.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g007',
    titulo: 'Bitcoin consolida en US$ 107,340: flujo neto ETFs +US$ 1.2B en la semana y guías regulatorias SEC impulsan el repunte',
    descripcion: 'Bitcoin cerró la semana en US$ 107,340 con un avance del 4.8% semanal. El iShares Bitcoin Trust de BlackRock registró entradas netas de US$ 740M. La SEC publicó las "Guías de Activos Digitales 2026", generando mayor certidumbre regulatoria para el sector.',
    contenido: `Bitcoin (BTC) cerró la semana del 30 de junio al 4 de julio en US$ 107,340, avanzando 4.8% desde los US$ 102,420 del viernes anterior y consolidándose sobre US$ 100,000 por cuarta semana consecutiva. La capitalización de mercado del Bitcoin superó US$ 2.12 billones, el 52.3% del total del mercado crypto.

El catalizador fue el flujo neto positivo de los ETFs spot de Bitcoin en EE.UU.: iShares Bitcoin Trust (BlackRock), Fidelity Wise Origin y Ark 21Shares sumaron entradas netas de US$ 1.24B en la semana —el mayor desde abril—. Solo el iShares de BlackRock registró US$ 740M. El total de AUM de los ETFs Bitcoin en EE.UU. supera ya los US$ 115B.

La SEC publicó el jueves 3 de julio las "Guías de Activos Digitales 2026", 180 páginas que clarifican el tratamiento regulatorio de tokens de utilidad, stablecoins y ETFs de criptomonedas. El mercado interpretó el documento como un paso hacia mayor certidumbre, eliminando la incertidumbre que pesaba desde los colapsos de 2022-2023. Coinbase (COIN) subió 8.4% en la semana.

Análisis técnico BTC/USD: soporte en US$ 103,000 (MA20 semanal), soporte relevante en US$ 96,000 (Fibonacci 38.2%), resistencia en US$ 112,000 (máximo del 22 de mayo). El RSI semanal en 62 sugiere espacio alcista sin señales de sobrecompra extrema.`,
    analisis: `La correlación entre Bitcoin y el apetito de riesgo global ha aumentado en 2026: cuando el DXY cae y los mercados de acciones suben, el BTC tiende a amplificar los movimientos al alza. Esto convierte al precio de Bitcoin en indicador indirecto del apetito de riesgo que también impacta en el sol peruano y los activos emergentes.

Para peruanos que operan con criptomonedas y necesitan convertir a dólares o soles, QoriCash ofrece el mejor tipo de cambio USD/PEN del mercado —el primer paso para cualquier conversión de cripto a moneda local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g008',
    titulo: 'PMI manufactura China junio: 49.7 — mejora respecto al 49.3 de mayo pero contracción por segundo mes; yuan y cobre reaccionan con cautela',
    descripcion: 'El PMI manufacturero oficial de China cerró junio en 49.7, mejor que el 49.3 de mayo y el consenso de 49.5, pero en zona de contracción por segundo mes consecutivo. El PMI Caixin (sector privado) subió a 50.5. El PBOC señaló posibles herramientas adicionales de liquidez en el Q3.',
    contenido: `El PMI manufacturero oficial de China (NBS) cerró junio de 2026 en 49.7 puntos, publicado el 30 de junio. El dato supera el 49.3 de mayo y el consenso de 49.5, pero se mantiene por debajo de 50 (contracción) por segundo mes consecutivo, tras cuatro meses de expansión entre febrero y mayo.

Los sub-índices revelan imagen matizada: producción subió a 50.8 desde 50.3 (expansión), pero nuevos pedidos cayeron a 49.2 desde 49.5 (contracción más pronunciada), reflejo del menor dinamismo de la demanda interna y externa. El sub-índice de pedidos de exportación se ubicó en 47.8, el más bajo en 8 meses, evidencia del impacto de aranceles adicionales de EE.UU. sobre bienes chinos.

El PMI Caixin (sector privado y medianas empresas, publicado el 1 de julio) fue de 50.5, en expansión y por encima del 50.2 de mayo. La divergencia entre el PMI oficial (grandes estatales) y el Caixin (medianas privadas) refleja la heterogeneidad de la recuperación económica china.

El PBOC anunció el 2 de julio que "continuará con la política monetaria acomodaticia" y evaluará "herramientas adicionales de liquidez" si el crecimiento muestra señales de desaceleración en el Q3. El mercado interpreta esto como antesala de un potencial recorte del coeficiente de encaje (RRR) en julio o agosto.`,
    analisis: `El PMI chino en 49.7 es relevante para Perú por la relación cobre-China: Perú exporta el 76% de su cobre al mercado chino, y cualquier señal de desaceleración industrial presiona a la baja el precio del metal (US$ 4.82/lb). Una caída a US$ 4.50/lb implicaría menores ingresos de exportación y presión sobre el sol.

Para empresas peruanas con exposición a materias primas o cadenas de suministro chinas, el PMI es un indicador adelantado clave. En QoriCash monitoreamos estos datos para anticipar el impacto cambiario.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32845692/pexels-photo-32845692.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g009',
    titulo: 'Petróleo WTI cierra semana en US$ 73.4: inventarios EE.UU. superan expectativas y OPEP+ mantiene producción elevada',
    descripcion: 'El WTI cerró la semana en US$ 73.4/barril con caída del 1.8% semanal. Los inventarios de crudo en EE.UU. subieron en 3.2M de barriles (vs. caída esperada de 1.5M) y la OPEP+ confirmó mantener niveles de producción elevados en agosto. El Brent cierra en US$ 76.2/barril.',
    contenido: `El petróleo West Texas Intermediate (WTI) cerró la semana del 30 de junio al 4 de julio en US$ 73.4/barril, retrocediendo 1.8% desde los US$ 74.75 del cierre anterior, en un contexto de sobreoferta relativa. El Brent cierra en US$ 76.2/barril, con diferencial Brent-WTI de US$ 2.8.

El factor bajista dominante fue el informe semanal de inventarios de la EIA (publicado el 2 de julio): los stocks de crudo aumentaron en 3.2M de barriles en la semana al 28 de junio, muy por encima del consenso que esperaba una caída de 1.5M. Las reservas de gasolina también subieron en 2.1M de barriles, señal de demanda del consumidor más débil de lo esperado para el verano americano.

La reunión ministerial de la OPEP+ del 30 de junio confirmó mantener la estrategia de producción elevada: a partir de agosto, la producción de los 8 países con recortes voluntarios seguirá incrementándose en 411,000 barriles diarios mensuales. Arabia Saudita moderó su postura de "guerra de precios" ante señales de cooperación de productores no-miembros.

El factor alcista que limitó la caída fue la tensión en el Estrecho de Ormuz: ejercicios no anunciados de la marina iraní generaron una prima de riesgo geopolítico. La volatilidad implícita en opciones de agosto permanece elevada.`,
    analisis: `El WTI en US$ 73.4 tiene implicaciones mixtas para Perú. Positivo: el petróleo barato reduce costos de importación de combustibles y alivia la presión inflacionaria local. Negativo: el precio bajo del crudo afecta a Colombia y Ecuador (exportadores), generando presión sobre sus monedas y afectando el contexto regional.

Un WTI sostenido por debajo de US$ 75 durante el Q3 sería favorable para la inflación peruana y reduciría la probabilidad de subidas de precios de combustibles al consumidor. En QoriCash seguimos los mercados de commodities para anticipar impactos en el tipo de cambio PEN/USD.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29988955/pexels-photo-29988955.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g010',
    titulo: 'Exportaciones textiles peruanas crecen 22% en H1 2026: US$ 980M lideradas por alpaca y algodón Pima para mercados premium',
    descripcion: 'El sector textil-confecciones peruano exportó US$ 980M en el H1 2026, crecimiento del 22% interanual liderado por prendas de alpaca (+34%) y algodón Pima (+19%). EE.UU. (45%), Italia (12%) y Japón (9%) son los principales destinos de las exportaciones premium peruanas.',
    contenido: `Las exportaciones del sector textil-confecciones de Perú alcanzaron US$ 980M en el H1 2026, según datos de la Cámara de Comercio de Lima y PromPerú publicados el 3 de julio. El crecimiento del 22% interanual frente a los US$ 803M del H1 2025 convierte al textil en el tercer sector exportador no tradicional del país.

El segmento de mayor crecimiento es la fibra de alpaca: US$ 215M en el H1 (+34% interanual), con los mercados italiano, japonés y estadounidense como principales compradores de marcas peruanas de lujo. El grupo Michell y CIA, Inca Tops y Prosur reportaron márgenes operativos superiores al 28%, aprovechando el posicionamiento de la alpaca como fibra premium en el segmento "slow fashion" europeo y asiático.

El algodón Pima —variedad nativa de Piura— generó US$ 340M en exportaciones de confecciones (+19% interanual). Las confecciones tipo "athleisure" y ropa interior premium para Nordstrom, Marks & Spencer y Uniqlo representaron el 48% del volumen. El tipo de cambio PEN/USD en S/ 3.40 ha mejorado la competitividad frente a competidores de Bangladesh, Vietnam y Camboya.

El principal desafío del sector es la restricción de mano de obra especializada: el sector estima un déficit de 8,500 operarios calificados para el H2 2026, lo que podría limitar la capacidad de respuesta a pedidos de la temporada alta octubre-diciembre.`,
    analisis: `El crecimiento del 22% en exportaciones textiles tiene efecto cambiario directo: US$ 980M en el H1 equivalen a un flujo mensual de ~US$ 163M de conversión de divisas, aporte significativo al mercado spot de soles que refuerza el soporte del PEN en los niveles actuales.

Para empresas del sector textil con ingresos en dólares, la gestión del tipo de cambio es crítica para proteger márgenes: con costos en soles y ventas en dólares, una apreciación inesperada erosiona la rentabilidad. En QoriCash le ofrecemos el mejor tipo de cambio para sus conversiones, con liquidación en el día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31112215/pexels-photo-31112215.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g011',
    titulo: 'Argentina: inflación junio en 3.1% mensual — undécimo mes consecutivo de baja; peso cierra en 1,285 ARS/USD con brecha mínima del 0.8%',
    descripcion: 'El INDEC publicó la inflación de junio en 3.1% mensual, el menor registro en 36 meses y undécimo mes consecutivo de desaceleración. El BCRA mantiene la tasa en 40% anual. La brecha entre el dólar oficial (1,285 ARS) y el blue (1,295 ARS) cayó al 0.8%, mínimo del gobierno actual.',
    contenido: `El INDEC publicó el 3 de julio el dato de inflación de junio de 2026: 3.1% mensual, por debajo del 3.4% de mayo y del consenso de 3.3%. La inflación interanual acumula 52.8%, un número que sigue siendo alto en términos históricos pero que representa una caída drástica desde el 211% interanual de diciembre de 2023.

La desaceleración es el undécimo mes consecutivo de baja, consolidando la tendencia desinflacionaria del gobierno de Javier Milei. El rubro de mayor moderación fue alimentos y bebidas (2.8% vs. 3.9% en mayo), señal de que la corrección de precios regulados ya se ha absorbido. Los rubros con mayor presión al alza son indumentaria (5.1%) y educación (4.4%) —ambos estacionales del segundo semestre—.

El BCRA mantuvo la tasa de política monetaria en 40% anual en su reunión del 26 de junio, señalando que "la baja de la inflación está en camino pero el trabajo no está terminado". La tasa real efectiva mensual es de aproximadamente 0.2% (40%/12 = 3.3% vs. inflación 3.1%), la más elevada de Argentina desde 2018. El mercado descuenta el primer recorte de tasas en septiembre u octubre si la inflación mensual llega al rango 2.5%-2.8%.

El tipo de cambio oficial cerró junio en 1,285 ARS/USD bajo el esquema de flotación administrada con bandas ($1,000-$1,300). El dólar blue cerró en 1,295 ARS/USD, brecha de apenas 0.8% con el oficial —la menor desde el inicio del gobierno— señal de normalización del mercado informal de divisas.`,
    analisis: `La estabilización macroeconómica argentina es relevante para Perú como termómetro del apetito de riesgo latinoamericano: cuando Argentina muestra señales positivas, los inversores internacionales perciben a la región con menor riesgo, favoreciendo flujos de capital hacia mercados como el peruano.

Para peruanos con negocios o familia en Argentina, el tipo de cambio implícito ARS/PEN es de aproximadamente 378 pesos argentinos por sol (1,285 ÷ 3.40). Para optimizar conversiones PEN/USD previas a operaciones en Argentina, QoriCash ofrece el mejor tipo de cambio del mercado.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29084309/pexels-photo-29084309.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g012',
    titulo: 'Chile: BCCh señala recorte de tasas para agosto; peso CLP se aprecia 1.1% en la semana y cierra en 912 CLP/USD',
    descripcion: 'Las actas del BCCh publicadas el 3 de julio mostraron que cuatro de cinco consejeros están inclinados hacia un recorte en agosto. El peso chileno cerró en 912 CLP/USD (+1.1% en la semana) impulsado por la señal dovish y el rally del cobre. La inflación de junio (8 de julio) definirá el calendario.',
    contenido: `El Banco Central de Chile (BCCh) publicó el 3 de julio las actas de su reunión del 19-20 de junio: cuatro de los cinco consejeros señalaron que "las condiciones para un inicio de la flexibilización monetaria se están alcanzando", mientras el quinto prefirió esperar "una lectura adicional de inflación". El mercado interpretó el mensaje como señal casi explícita de un recorte en agosto.

La tasa del BCCh está actualmente en 5.00% desde febrero de 2025. Con una inflación de mayo en 3.2% interanual, la tasa real ex-ante es de 1.8%, el nivel más restrictivo de la región junto a Perú. La inflación de junio se publica el 8 de julio y el consenso proyecta 3.0%-3.1% interanual; si confirma, el recorte de agosto quedaría prácticamente asegurado.

El peso chileno (CLP) se apreció 1.1% en la semana, cerrando en 912 CLP/USD el viernes 4, el nivel más bajo desde el 20 de marzo de 2026. Los factores impulsores: optimismo post-NFP sobre la Fed, rally del cobre (+0.4% en la semana) y la señal dovish del BCCh. El cobre tiene correlación histórica de 0.68 con el CLP.

La economía chilena creció 2.8% en el Q1 2026, ligeramente por debajo del consenso de 3.1%, con consumo privado aún contenido por las tasas elevadas. El Ministerio de Hacienda proyecta crecimiento del 3.2% para el año, asumiendo inicio de recortes en agosto y cobre sobre US$ 4.50/libra.`,
    analisis: `El potencial recorte del BCCh en agosto es relevante regionalmente: cuando el banco central chileno —uno de los más técnicos y creíbles de América Latina— inicia un ciclo de recortes, suele marcar un "permiso macroeconómico" para que otros bancos centrales de la región, incluido el BCRP, sigan el camino en septiembre u octubre.

Para peruanos con operaciones en Chile, el tipo de cambio implícito PEN/CLP mejoró esta semana a 268 pesos chilenos por sol (912/3.40). En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD como base para cualquier operación con el mercado chileno.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g013',
    titulo: 'Colombia: BanRep recorta tasas 25bps a 9.00% por unanimidad — inflación junio en 4.2%; COP se aprecia a 4,155/USD',
    descripcion: 'El Banco de la República de Colombia recortó su tasa de referencia en 25 puntos básicos a 9.00% el 4 de julio, primer movimiento del H2, luego de que la inflación de junio cayera a 4.2% interanual —por debajo del techo del 4% meta por primera vez desde octubre 2021. El COP se apreció 0.4% a 4,155/USD.',
    contenido: `El Banco de la República de Colombia (BanRep) anunció el viernes 4 de julio un recorte de 25 puntos básicos en su tasa de referencia, de 9.25% a 9.00%, primer movimiento desde enero de 2026 y séptimo del ciclo de flexibilización iniciado en diciembre de 2023. La decisión fue por unanimidad de los siete miembros del Comité de Política Monetaria.

El detonante fue la inflación de junio: 4.2% interanual, por debajo del techo del rango meta del 4% por primera vez desde octubre de 2021. El gobernador del BanRep, Leonardo Villar, declaró: "el proceso desinflacionario está consolidado y la política monetaria puede acompañar la recuperación de la actividad económica sin sacrificar la estabilidad de precios". El BanRep proyecta inflación del 3.5% para finales de 2026.

El COP reaccionó con apreciación del 0.4% al cierre del viernes, cerrando en 4,155/USD —el nivel más bajo desde el 18 de febrero de 2026—. La apreciación contrasta con lo habitual tras un recorte, pero el mercado interpretó la decisión como señal de solidez macroeconómica. El petróleo Brent en US$ 76.2/barril también provee soporte al COP.

La economía colombiana creció 3.1% en el Q1 2026, impulsada por construcción (+7.2%), servicios financieros (+6.4%) y agricultura (+5.2%). El déficit en cuenta corriente se redujo al 2.7% del PIB en el H1 —el más bajo desde 2019—, señal de que los fundamentos externos se han fortalecido.`,
    analisis: `El recorte del BanRep refuerza la narrativa de que América del Sur está iniciando un ciclo coordinado de flexibilización monetaria. Para el BCRP, el recorte colombiano añade presión para que Perú también reduzca su tasa en agosto o septiembre, lo que tendría un efecto ambivalente sobre el sol.

Para peruanos con operaciones en Colombia, el tipo de cambio implícito PEN/COP es de aproximadamente 1,222 pesos colombianos por sol (4,155/3.40). En QoriCash le ofrecemos el mejor tipo de cambio PEN/USD como primer paso para transacciones con el mercado colombiano.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676238/pexels-photo-19676238.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g014',
    titulo: 'Trump eleva aranceles tecnológicos a China al 45%: semiconductores y paneles solares desde el 15 de julio afectan US$ 120B en importaciones',
    descripcion: 'La administración Trump anunció el 2 de julio la elevación de aranceles a importaciones chinas de semiconductores, paneles solares y equipos de telecomunicaciones del 25% al 45%, efectiva el 15 de julio. El Nasdaq cayó 1.2% el miércoles, Apple perdió 2.8% y el índice de semiconductores retrocedió 3.1%.',
    contenido: `La administración del presidente Donald Trump anunció el miércoles 2 de julio la elevación de aranceles a importaciones chinas en tres categorías: semiconductores (25% → 45%), paneles solares y equipos de generación renovable (20% → 45%), y equipos de telecomunicaciones incluyendo antenas 5G y routers (25% → 45%). Las nuevas tarifas entran en vigor el 15 de julio y afectan aproximadamente US$ 120B en importaciones anuales, según la Oficina del Representante Comercial de EE.UU. (USTR).

La Casa Blanca justificó la medida como "necesaria para proteger la seguridad nacional y la competitividad tecnológica de EE.UU." bajo la Sección 301 de la Ley de Comercio. El secretario de Comercio Howard Lutnick señaló que "China no ha cumplido los compromisos de Phase 1". Pekín respondió amenazando con "medidas de represalia proporcionales" y el Ministerio de Comercio chino convocó al embajador americano.

El impacto en mercados fue inmediato: Nasdaq cayó 1.2% el miércoles, Apple (AAPL) perdió 2.8% ante el riesgo en la cadena de suministro del iPhone, y el Philadelphia Semiconductor (SOX) retrocedió 3.1%. Sin embargo, los mercados recuperaron parte de las pérdidas el jueves y viernes ante expectativa de continuación de negociaciones.

Las importaciones peruanas desde China totalizaron US$ 12,800M en el H1 2026. Los aranceles adicionales a la tecnología china no afectan directamente al Perú, pero podrían generar un encarecimiento de equipos tecnológicos si los fabricantes chinos trasladan el costo al precio de exportación hacia América Latina.`,
    analisis: `La escalada arancelaria EE.UU.-China introduce incertidumbre para el sol peruano en tres canales: (1) mayor volatilidad del yuan (CNY) que históricamente correlaciona con el DXY; (2) potencial presión bajista en el precio del cobre si la actividad industrial china se resiente; (3) menor apetito de riesgo global en emergentes.

El canal más directo es el cobre: si los aranceles generan contracción adicional del PMI chino, el cobre podría ceder a US$ 4.50/libra, reduciendo ingresos de exportación y presionando el sol hacia S/ 3.45-3.50. En QoriCash monitoreamos estos riesgos para ofrecerle siempre el mejor tipo de cambio disponible.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32177182/pexels-photo-32177182.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'g015',
    titulo: 'LATAM semanal: sol +0.3%, CLP +1.1%, COP +0.5% — monedas de la región ganan terreno ante DXY débil y recortes regionales',
    descripcion: 'Las principales monedas latinoamericanas cerraron la semana del 30 de junio al 4 de julio con ganancias generalizadas: sol +0.3% (S/ 3.396), CLP +1.1% (912/USD), COP +0.5% (4,155/USD), BRL +0.7% (5.08/USD). El factor común fue el retroceso del DXY a 101.2 y el NFP dentro de expectativas.',
    contenido: `La semana del 30 de junio al 4 de julio marcó la mejor performance semanal de las monedas latinoamericanas en lo que va del Q3: todas las divisas de la región ganaron terreno frente al dólar, aprovechando el retroceso del DXY a 101.2 puntos tras el NFP de junio en 182,000 —compatible con un posible recorte de la Fed en septiembre—.

El sol peruano (PEN) apreció 0.3% cerrando en S/ 3.396, con la apreciación suavizada por intervenciones del BCRP (~US$ 380M en compras). El peso chileno (CLP) fue el mejor de la región con +1.1% (912/USD), impulsado por la señal dovish del BCCh y el rally del cobre. El peso colombiano (COP) ganó 0.5% (4,155/USD) tras el recorte sorpresa del BanRep de 25bps.

El real brasileño (BRL) avanzó 0.7% en la semana (5.08/USD), con el Banco Central do Brasil manteniendo la Selic en 10.50%. El peso mexicano (MXN) se apreció 0.8% (17.2/USD), impulsado por señales de flexibilidad de la Casa Blanca en el T-MEC para sectores no tecnológicos. El peso argentino oficial se mantuvo en 1,285/USD dentro de las bandas.

Para las perspectivas del Q3, el consenso de 15 bancos de inversión (Bloomberg LATAM Outlook julio 2026) proyecta: sol en S/ 3.35-3.45, CLP en 890-930, COP en 4,100-4,300, BRL en 4.9-5.2. El escenario de recorte de la Fed en septiembre mejoraría todos estos rangos hacia la apreciación.`,
    analisis: `El rally semanal de las monedas LATAM es señal de que la región mantiene fundamentos macroeconómicos relativamente sólidos: superávits de cuenta corriente (Chile, Perú), reservas internacionales en máximos (Perú: US$ 73.8B) y bancos centrales creíbles que han controlado la inflación mejor que el promedio emergente. El contexto es favorable para el sol en el H2 2026.

Para empresas con operaciones en múltiples países de la región, la gestión del riesgo cambiario multi-divisa es cada vez más relevante. QoriCash especializa en el mercado PEN/USD, ofreciendo el mejor tipo de cambio disponible en Lima con liquidación en el día.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-07-06T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29032777/pexels-photo-29032777.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
    fecha: '2026-07-01T08:00:00.000Z',
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
