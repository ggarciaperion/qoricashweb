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
const HOY = '2026-05-28T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
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
    fecha: HOY,
    destacada: true,
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
    fecha: HOY,
    destacada: true,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
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
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29032777/pexels-photo-29032777.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm001',
    titulo: 'Fed mantiene tasas en 4.75% pero señala recorte en julio si el IPC de mayo confirma tendencia — DXY cae a 99.6',
    descripcion: 'La Reserva Federal de EE.UU. mantuvo su tasa de referencia en el rango 4.75%-5.00% en su reunión de mayo, pero el comunicado incorporó un nuevo párrafo que reconoce "progreso sustancial" en la desinflación. Los mercados de futuros elevan la probabilidad de un recorte en julio al 62%, mientras el índice DXY cede a 99.6, su nivel más bajo desde febrero de 2024.',
    contenido: `El Comité Federal de Mercado Abierto (FOMC) concluyó su reunión del 27-28 de mayo con un voto unánime para mantener la tasa de los fondos federales en el rango 4.75%-5.00%. Sin embargo, el tono del comunicado fue notablemente más dovish que el de reuniones anteriores: por primera vez desde enero de 2025, el texto reconoce que "los riesgos hacia la meta de empleo y la meta de inflación están equilibrados de forma más simétrica".

El presidente Jerome Powell confirmó en la conferencia de prensa que "no es necesario esperar a que la inflación llegue al 2% para comenzar a ajustar la política". Powell indicó que dos lecturas favorables del IPC consecutivas serían suficientes para que la Fed se sienta "cómoda" con una reducción de 25 puntos básicos en julio. El IPC de mayo se publica el 11 de junio y el de junio el 9 de julio, justo antes de la reunión del 29-30 de julio.

Los mercados de renta fija reaccionaron con fuerza. El rendimiento del bono del Tesoro a 10 años cayó 12 pb a 4.38%, mientras el DXY tocó 99.6, nivel que no veía desde febrero de 2024. Las divisas emergentes se fortalecieron: el sol peruano tocó brevemente S/ 3.63 antes de la intervención del BCRP, el real brasileño subió 0.8% y el peso colombiano ganó 0.6%.

Goldman Sachs, JPMorgan y Morgan Stanley actualizaron sus previsiones: los tres bancos ahora anticipan el primer recorte de la Fed en julio, seguido de otro en septiembre. Para fin de año proyectan la tasa en 4.25%-4.50%, lo que mantendría el diferencial con el dólar comprimido y sostendría el rally de divisas emergentes.`,
    analisis: `Un recorte de la Fed en julio reduciría el atractivo de los activos en dólares, lo que comprimiría el diferencial de tasas y empujaría el DXY por debajo de 99. Para el sol peruano esto implica un tipo de cambio en el rango S/ 3.60-3.65, favorable para importadores y deudores en dólares, pero desafiante para exportadores que cobran en moneda extranjera.

Si mantienes saldos en dólares para gastos en soles, este escenario favorece la conversión gradual antes de que el tipo de cambio retroceda más. Para empresas con ingresos en PEN y deuda en USD, el momento de reducir exposición cambiaria es ahora mientras el dólar está debilitado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm002',
    titulo: 'Inversión Extranjera Directa en Perú creció 11.3% en Q1 2026 — minería y energía atraen US$2,840 millones',
    descripcion: 'ProInversión reportó que la Inversión Extranjera Directa (IED) en Perú alcanzó US$2,840 millones en el primer trimestre de 2026, un crecimiento de 11.3% respecto al mismo período de 2025. El sector minero captó el 58% del total con US$1,647 millones, seguido por energía y telecomunicaciones. Lima concentró el 34% de la inversión en servicios y manufactura.',
    contenido: `ProInversión presentó el Informe de IED del Primer Trimestre 2026, que registra un total de US$2,840 millones en flujos de inversión extranjera directa, la cifra más alta para un primer trimestre en la historia del Perú. El resultado supera en US$289 millones el récord previo de Q1 2022 y consolida al país como el segundo destino más atractivo de la región para inversión minero-energética, detrás de Chile.

El sector minero lideró con US$1,647 millones, impulsado principalmente por las expansiones de Quellaveco (Anglo American, US$480M), Antapaccay (Glencore, US$320M) y los proyectos de cobre de la cartera de Southern Copper en Moquegua. El favorable ciclo de precios del cobre —con el metal cotizando por encima de US$4.80/lb durante la mayor parte del trimestre— fue el factor determinante para acelerar los desembolsos de capital.

El sector energético recibió US$562 millones, concentrados en energías renovables: cuatro parques solares fotovoltaicos en Arequipa e Ica y dos proyectos eólicos en Piura. Las telecomunicaciones captaron US$218 millones liderados por la expansión de fibra óptica de Claro y Entel en provincias.

Lima capturó US$965 millones en IED de servicios financieros, manufactura high-tech y centros de distribución logística. El jefe de ProInversión, Pablo de la Flor, destacó que "la estabilidad macroeconómica, el tipo de cambio competitivo y el acceso a mercados vía TLCs hacen del Perú una plataforma de inversión de clase mundial para la región".`,
    analisis: `Un flujo sostenido de IED tiene efectos directos sobre el tipo de cambio: cada dólar que ingresa como inversión debe convertirse a soles para pagar planillas, proveedores locales y costos operativos. A lo largo del año, US$11,000-12,000 millones de IED proyectados generan una demanda estructural de soles que mantiene apreciado el PEN frente al dólar.

Para empresas locales que compiten con inversores extranjeros, el entorno de mayor actividad económica eleva los costos laborales y de insumos en soles. Anticipar aumentos de costos en moneda local —y negociar contratos en PEN— es la estrategia correcta cuando la IED está en alza.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/37430652/pexels-photo-37430652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm003',
    titulo: 'BCRP: reservas internacionales netas llegan a US$74,830 millones — nivel récord que blindará el sol ante shocks externos',
    descripcion: 'El Banco Central de Reserva del Perú informó que las reservas internacionales netas alcanzaron US$74,830 millones al cierre de mayo de 2026, un incremento de US$1,740 millones respecto a diciembre de 2025. El nivel equivale al 29.8% del PBI y cubre 22.4 meses de importaciones, ratios entre los más altos de América Latina.',
    contenido: `El BCRP publicó el informe mensual de reservas internacionales correspondiente a mayo de 2026, mostrando un saldo de US$74,830 millones en reservas internacionales netas. El incremento de US$1,740 millones en los primeros cinco meses del año refleja principalmente las intervenciones del banco central comprando dólares en los momentos en que el sol se ha fortalecido por encima del nivel de confort de S/ 3.63.

La composición de las reservas muestra que el 73% está invertido en títulos soberanos de alta calidad (bonos del Tesoro de EE.UU. y Alemania principalmente), el 18% en depósitos en bancos centrales de primer orden y el 9% restante en oro monetario y DEG del FMI. El rendimiento promedio de la cartera fue de 4.2% anual en los últimos 12 meses, lo que generó ingresos de gestión de aproximadamente US$3,140 millones.

El gerente de Operaciones del BCRP, Carlos Casas, señaló que el nivel actual de reservas provee "una capacidad de intervención robusta frente a episodios de volatilidad cambiaria". En los últimos 12 meses el BCRP vendió US$2,890 millones en el mercado spot para contener la depreciación del sol durante la corrección de mercados emergentes de agosto-septiembre de 2025, y compró US$4,630 millones durante los períodos de apreciación.

Las reservas representan 5.6 veces la deuda externa de corto plazo del Perú, un ratio que las agencias de calificación crediticia consideran "muy confortable" y que contribuye al mantenimiento del grado de inversión del país en BBB con perspectiva estable por parte de S&P, Moody's y Fitch.`,
    analisis: `Las reservas internacionales elevadas son el principal escudo del sol peruano ante crisis externas. Con US$74,830 millones, el BCRP puede intervenir durante meses sostenidos sin agotar su capacidad de fuego, lo que reduce la volatilidad del tipo de cambio y ofrece predictibilidad a empresas que planifican flujos en dólares.

Para operaciones de cambio, las reservas abundantes significan que el BCRP intervendrá cuando el PEN se deprecie significativamente: la resistencia de S/ 3.75-3.80 está protegida por la capacidad de intervención. Si planeas comprar dólares, los episodios de tipo de cambio elevado tienden a ser cortos cuando las reservas son sólidas.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm004',
    titulo: 'Agroexportaciones de arándanos peruanos rompen récord en mayo: US$186 millones enviados a EE.UU. y Europa en 4 semanas',
    descripcion: 'El sector agroexportador peruano reportó el mejor mayo de su historia con US$186 millones en envíos de arándanos, un crecimiento de 22% respecto a mayo de 2025. EE.UU. concentró el 54% de los envíos, seguido por Países Bajos (18%) y Reino Unido (12%). La campaña de cosecha en La Libertad y Áncash superó las proyecciones en volumen y calidad.',
    contenido: `La Asociación de Exportadores (ADEX) y PROMPERÚ presentaron las cifras de agroexportaciones de mayo de 2026, que muestran un volumen de 24,600 toneladas de arándanos enviados por un valor FOB de US$186 millones. La cifra supera en 22% el récord previo de mayo de 2025 (US$152 millones) y consolida al Perú como el primer exportador mundial de arándanos frescos, con una participación del 38% del mercado global.

La campaña de cosecha 2026 en las principales zonas productoras —La Libertad (Virú), Áncash (Huaraz) y Lima (Cañete)— benefició de un verano con adecuada disponibilidad hídrica y temperaturas óptimas. Las variedades Biloxi y Ventura representaron el 71% del volumen exportado, con calibres grandes (jumbo y colossal) que obtuvieron premios de precio de US$0.35-0.50/kg sobre el precio de referencia.

Mercados clave: EE.UU. importó 13,300 toneladas por US$100M; Países Bajos redistribuyó a Europa 4,400 toneladas; Reino Unido importó 2,950 toneladas aprovechando el TLC vigente. China incrementó su participación al 8% del volumen total, reflejando el crecimiento de la clase media consumidora de superalimentos.

El impacto cambiario es significativo: los US$186 millones generados en divisas presionan la oferta de dólares en el mercado local, contribuyendo a la apreciación del sol. Empresas como Camposol, Hortifrut y Talsa concentraron el 58% de las exportaciones.`,
    analisis: `Las agroexportaciones récord aumentan la oferta de dólares en el mercado spot peruano: cuando los exportadores liquidan sus divisas para pagar costos en soles, venden dólares y compran PEN, apreciando el sol. Un mayo récord como este tiene efecto en el tipo de cambio de junio, cuando se liquidan los pagos.

Para empresas importadoras, los meses de fuerte liquidación de exportadores (mayo-junio, octubre-noviembre) son históricamente los períodos con el sol más fuerte. Aprovechar estos momentos para comprar dólares a precios más competitivos es una práctica de cobertura cambiaria efectiva.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm005',
    titulo: 'Balanza comercial de Perú registra superávit de US$1,240 millones en abril — el mayor en 18 meses',
    descripcion: 'El BCRP publicó la balanza comercial de abril de 2026, que muestra un superávit de US$1,240 millones, 67% superior al de abril de 2025. Las exportaciones crecieron 14.8% impulsadas por minería y agro, mientras las importaciones cayeron 3.2% ante la caída del precio del petróleo importado y la apreciación del sol que abarató bienes de capital.',
    contenido: `El Banco Central de Reserva publicó los datos de la balanza comercial de abril de 2026, que registran un superávit de US$1,240 millones, el mayor valor mensual desde octubre de 2024. El resultado acumulado enero-abril 2026 es de US$4,180 millones, 41% superior al mismo período del año anterior.

Las exportaciones totales de abril alcanzaron US$5,680 millones. Las exportaciones tradicionales (minería, petróleo, gas, pesca) crecieron 17.4% impulsadas por el cobre (US$1,840M, +21.3% por precio y volumen), el oro (US$980M, +18.7%) y la harina de pescado (US$180M, +34.2% por mejor temporada). Las exportaciones no tradicionales sumaron US$1,340M (+9.8%), lideradas por agro (arándanos, uvas, espárragos) y textiles.

Las importaciones sumaron US$4,440 millones. La reducción de 3.2% respecto a abril de 2025 se explica por tres factores: la caída del precio del petróleo crudo importado (15% menos en dólares), la sustitución de importaciones de maquinaria liviana por producción local, y la postergación de compras de bienes de capital de sectores que esperan condiciones crediticias más favorables en el segundo semestre.

El jefe de Estudios Económicos del BCRP, Adrián Armas, señaló que "la fortaleza de la balanza comercial reduce la necesidad de financiamiento externo y respalda la estabilidad del tipo de cambio en el mediano plazo".`,
    analisis: `Un superávit comercial creciente implica que Perú genera más dólares de los que necesita para sus importaciones, lo que crea un exceso de oferta de divisas que presiona el tipo de cambio hacia la apreciación. Esto es estructuralmente favorable para el sol en el mediano plazo.

Para quienes realizan importaciones frecuentes, el entorno de superávit y sol fuerte es favorable para comprar insumos y bienes de capital en el exterior. Sin embargo, el superávit puede reducirse rápidamente si el precio del cobre cae o si aumentan las importaciones de combustibles.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm006',
    titulo: 'Exportaciones mineras peruanas suman US$3,640 millones en abril — cobre y oro generan 78% de las divisas del sector',
    descripcion: 'El Ministerio de Energía y Minas reportó que las exportaciones mineras de abril de 2026 alcanzaron US$3,640 millones, un crecimiento de 19.4% respecto al mismo mes de 2025. El cobre aportó US$1,840 millones (50.5% del total) aprovechando precios de US$4.85/lb, mientras el oro contribuyó US$980 millones. Ambos metales se benefician del dólar débil y la demanda china en recuperación.',
    contenido: `El Ministerio de Energía y Minas (MINEM) publicó el reporte mensual de exportaciones mineras de abril de 2026, que totaliza US$3,640 millones. La cifra representa un crecimiento de 19.4% interanual y es el mejor resultado de abril en la historia del sector, superando el récord de US$3,050M de abril de 2022.

El cobre fue el metal protagonista con US$1,840 millones en exportaciones. El precio spot del cobre en el London Metal Exchange (LME) se mantuvo por encima de US$4.80/lb durante todo el mes, impulsado por la recuperación de la manufactura china (PMI manufactura en 50.8) y las perspectivas de demanda de cobre para infraestructura de energías renovables y vehículos eléctricos. Los principales productores —Quellaveco, Cuajone, Cerro Verde y Antamina— operaron a capacidad máxima.

El oro aportó US$980 millones con un precio promedio mensual de US$3,640/oz, 8.2% superior al de abril de 2025. La debilidad del dólar (DXY bajo 100) es el principal catalizador, ya que el oro cotiza en dólares y se vuelve más barato para compradores con otras divisas cuando el billete verde se deprecia.

La plata (US$180M), el zinc (US$290M) y el plomo (US$160M) completaron el cuadro. El MINEM proyecta que las exportaciones mineras del año 2026 podrían superar los US$38,000 millones si los precios del cobre se sostienen por encima de US$4.50/lb.`,
    analisis: `Las exportaciones mineras son la principal fuente de divisas del Perú: cada dólar exportado en cobre u oro que se liquida en soles refuerza el PEN. Un año récord de exportaciones mineras como el que se perfila para 2026 crea un piso estructural para el sol peruano.

Para empresas con pasivos en dólares, este entorno de sol fuerte y exportaciones altas es una ventana de oportunidad para reducir deuda en moneda extranjera. Las remesas de dividendos de las mineras al exterior también crean demanda de dólares, pero su efecto es menor y estacional (normalmente en el segundo semestre).`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm007',
    titulo: 'Petróleo WTI sube 2.1% a US$82.4/barril tras OPEP+ confirmar reducción adicional de 400,000 b/d en junio',
    descripcion: 'La Organización de Países Exportadores de Petróleo y sus aliados (OPEP+) acordó en videoconferencia extender los recortes voluntarios de producción durante junio de 2026, con una reducción adicional de 400,000 barriles por día. El WTI respondió subiendo 2.1% a US$82.4/barril y el Brent avanzó a US$85.8/barril, lo que podría elevar los costos de combustible para el Perú, que importa el 42% de sus derivados.',
    contenido: `La reunión virtual del Comité Ministerial Conjunto de Seguimiento (JMMC) de la OPEP+ concluyó con el anuncio de una reducción adicional voluntaria de producción de 400,000 barriles por día para junio de 2026. Los líderes del acuerdo, Arabia Saudita y Rusia, justificaron la medida alegando que los inventarios globales de crudo aún se encuentran por encima del promedio quinquenal y que la demanda global muestra señales de moderación.

Los precios respondieron de inmediato: el West Texas Intermediate (WTI) para entrega en julio subió US$1.70 a US$82.40/barril (+2.1%), mientras el Brent de referencia europea avanzó US$1.85 a US$85.80/barril. Los analistas de Goldman Sachs revisaron su previsión del WTI para Q3 a US$83-87/barril, frente a los US$78-82 anteriores.

El impacto para Perú es ambivalente. Por un lado, las empresas peruanas del sector petróleo y gas (Pluspetrol, PetroTal, BPZ Energy) y las refinadoras (Petroperú, Repsol) mejorarán sus márgenes con el crudo más caro. Por otro lado, Perú importó 42% de sus derivados de petróleo en 2025 y un barril más caro eleva la factura de importación de gasolina, diésel y GLP.

El impacto en el tipo de cambio es moderadamente negativo para el sol: mayores importaciones de combustibles aumentan la demanda de dólares. Sin embargo, si este aumento de precios es compensado por las exportaciones mineras (cuyo valor también tiende a subir con la demanda china que presiona el petróleo), el efecto neto es acotado.`,
    analisis: `Un WTI a US$82/barril impacta directamente los costos de transporte, manufactura y generación eléctrica en el Perú. Para empresas con alto consumo de combustibles (minería, pesca, transporte), es recomendable explorar coberturas de precios de combustible o evaluar el impacto en su estructura de costos para los próximos 3-6 meses.

En el frente cambiario, precios del petróleo altos presionan el dólar moderadamente al alza en el corto plazo por el efecto de mayores importaciones. Sin embargo, en un escenario donde el DXY ya está bajo 100, el efecto es contenido.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm008',
    titulo: 'Oro alcanza US$3,680/oz — dólar débil y compras de bancos centrales de Asia empujan el metal a nuevo máximo de 2026',
    descripcion: 'El oro al contado (XAU/USD) tocó US$3,680 por onza troy en la sesión asiática del miércoles, su nivel más alto en 2026 y a menos de US$120 de su máximo histórico. La debilidad del dólar —con el DXY en 99.6— y las compras récord de los bancos centrales de China, India y Polonia son los principales catalizadores, según el informe mensual del Consejo Mundial del Oro.',
    contenido: `El precio del oro al contado estableció un nuevo máximo anual de US$3,680/oz en la sesión del miércoles en los mercados asiáticos, impulsado por una combinación de factores técnicos y fundamentales que los analistas describen como "el alineamiento perfecto" para el metal precioso.

La debilidad del dólar es el factor más inmediato: con el DXY en 99.6, el oro —que cotiza en dólares— se vuelve más barato para compradores con euros, yenes y otras divisas, lo que estimula la demanda. Cada punto que cae el DXY históricamente agrega entre US$5 y US$8 al precio del oro.

El Consejo Mundial del Oro publicó su informe de compras de bancos centrales para el primer trimestre de 2026: el Banco Popular de China añadió 56 toneladas a sus reservas, el Banco de la Reserva de India compró 38 toneladas y el Banco Nacional de Polonia adquirió 22 toneladas. El total de compras de bancos centrales en Q1 2026 fue de 290 toneladas, el segundo trimestre más activo en la historia del seguimiento de datos.

El análisis técnico apunta a la zona US$3,700-3,720 como resistencia clave. Una ruptura confirmada abriría el camino hacia el máximo histórico de US$3,795/oz registrado en noviembre de 2025. Los futuros de oro del COMEX para agosto 2026 operan en US$3,695, con un open interest creciente que confirma el posicionamiento alcista.`,
    analisis: `El oro fuerte refleja un dólar débil, lo que es directamente favorable para el sol peruano: cuando el USD pierde terreno frente a todas las divisas, también pierde frente al PEN. Adicionalmente, las exportaciones de oro peruano valen más en dólares cuando el precio sube, generando más ingresos de divisas para el país.

Para inversores con exposición en dólares, el rally del oro es una señal de precaución sobre la fortaleza futura del billete verde. La correlación oro-debilidad del dólar sugiere que el DXY podría seguir cediendo en el corto plazo, lo que mantiene el sol apreciado.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm009',
    titulo: 'PMI manufacturero de China sube a 50.8 en mayo — mayor expansión en tres meses y señal positiva para commodities',
    descripcion: 'El índice de gerentes de compras (PMI) del sector manufacturero de China alcanzó 50.8 puntos en mayo de 2026, superando el nivel de equilibrio de 50 por tercer mes consecutivo y mejorando desde los 50.4 de abril. El dato es clave para Perú ya que China absorbe el 34% de las exportaciones peruanas de cobre y el 28% de las de zinc, siendo el principal mercado de destino de la minería nacional.',
    contenido: `La Oficina Nacional de Estadísticas de China (NBS) y el instituto privado Caixin publicaron sus índices PMI manufactureros de mayo 2026, con lecturas de 50.8 y 51.1 respectivamente, ambas en zona expansiva y mejorando respecto a abril. El dato de la NBS supera el consenso de analistas que esperaban 50.5, lo que generó una reacción positiva en los precios de los metales industriales.

Los subíndices del PMI chino muestran un panorama alentador para la demanda de materias primas. El subíndice de nuevos pedidos subió a 51.4 (vs 50.8 en abril), señalando que la acumulación de órdenes de fábrica está acelerando. El subíndice de producción avanzó a 52.1. El de empleo se mantuvo ligeramente contractivo en 49.8, sugiriendo que las empresas aún son cautelosas con las contrataciones.

Los metales industriales reaccionaron inmediatamente: el cobre LME subió 1.4% a US$4.87/lb, el zinc avanzó 2.1% y el aluminio ganó 1.8%. Los analistas del Bank of China señalan que los datos de mayo confirman que los estímulos fiscales del gobierno central chino —los 1.5 billones de yuan en bonos de infraestructura anunciados en marzo— están comenzando a materializarse en actividad manufacturera real.

La implicación para el Perú es directa: mayor actividad manufacturera en China eleva la demanda de cobre para cables eléctricos, electrodomésticos, vehículos eléctricos y construcción. Cada punto de mejora en el PMI chino históricamente correlaciona con un incremento de 0.8-1.2% en el precio del cobre en las semanas siguientes.`,
    analisis: `Un PMI chino en expansión es una de las mejores noticias posibles para la economía peruana y el tipo de cambio. Mayor demanda de cobre y zinc chinos implica mayores ingresos de exportación, más divisas liquidadas en el mercado local y presión apreciadora sobre el sol.

Para empresas peruanas proveedoras de la cadena minera (transportistas, contratistas, proveedores de insumos), el ciclo expansivo chino suele traducirse en aumento de demanda con 6-9 meses de rezago. El momento de preparar capacidad y costos es ahora.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28806603/pexels-photo-28806603.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm010',
    titulo: 'DXY rompe soporte clave de 100.0 — análisis técnico apunta a objetivo de 98.2 si el dato de empleo de junio decepciona',
    descripcion: 'El índice del dólar DXY cerró el martes en 99.6, rompiendo con decisión el nivel psicológico de 100.0 que había servido como soporte desde febrero. El análisis técnico identificó una formación de "doble techo" en 102.4 completada el pasado jueves y proyecta un objetivo bajista de 98.2 si el dato de nóminas no agrícolas (NFP) de junio resulta inferior a las 170,000 posiciones esperadas.',
    contenido: `El índice del dólar DXY —que mide la fortaleza del billete verde frente a una canasta de seis divisas principales (EUR, JPY, GBP, CAD, SEK, CHF)— cerró el martes 27 de mayo en 99.6, perforando el soporte de 100.0 que había resistido durante 14 semanas consecutivas. La ruptura se produjo en volumen elevado, lo que los analistas técnicos consideran una señal de validación.

El catalizador fundamental fue el comunicado dovish del FOMC publicado el lunes, que aumentó la probabilidad de un recorte en julio al 62%. Cuando los mercados anticipan tasas más bajas en EE.UU., los rendimientos de los bonos del Tesoro caen y el atractivo del dólar como activo de carry se reduce, presionando el DXY.

El análisis técnico en el gráfico diario muestra una formación de doble techo en 102.4 completada el 22 de mayo, con un patrón de precio que los analistas de Société Générale describen como "estructura bajista de manual". El objetivo bajista del patrón se calcula en 98.2, que coincide con la media móvil de 200 semanas y un nivel de soporte horizontal de 2023.

Los factores de riesgo para el escenario bajista del DXY son: un dato de nóminas no agrícolas de junio superior a 200,000 (descargaría las expectativas de recorte), un IPC de mayo que sorprenda al alza, o una escalada geopolítica que genere demanda de refugio hacia el dólar.`,
    analisis: `Un DXY cayendo hacia 98-99 es la variable más directamente ligada al tipo de cambio PEN/USD: históricamente, cada caída de 1% en el DXY se traduce en una apreciación de 0.5-0.8% del sol peruano. Un DXY en 98.2 sería consistente con un tipo de cambio en el rango S/ 3.58-3.62.

Para empresas que necesitan dólares en los próximos 30-60 días, el escenario técnico sugiere que el costo de comprar dólares podría ser más bajo en 2-3 semanas si el DXY continúa su tendencia. Evaluar cubrir necesidades cambiarias de corto plazo en este entorno es una decisión táctica relevante.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm011',
    titulo: 'PEN/USD: sol cierra en S/3.645 con mayor presión apreciadora en 8 semanas — BCRP compra US$140 millones',
    descripcion: 'El sol peruano cerró la sesión del martes en S/ 3.645 por dólar, con una apreciación de S/ 0.018 (0.49%) en el día. El BCRP intervino comprando US$140 millones en el mercado interbancario para evitar una apreciación más pronunciada, que hubiera llevado el tipo de cambio por debajo de S/ 3.63. El volumen de transacciones en el mercado spot superó los US$520 millones, el más alto en 8 semanas.',
    contenido: `El tipo de cambio interbancario PEN/USD cerró el martes 27 de mayo en S/ 3.645, con una apreciación de S/ 0.018 respecto al cierre previo de S/ 3.663. La presión apreciadora fue sostenida durante toda la sesión, con máximos intradiarios de S/ 3.638 en la apertura de la bolsa de Nueva York.

El BCRP intervino en dos momentos: a las 9:15 am (hora Lima) compró US$80 millones cuando el tipo de cambio rompió S/ 3.650, y a las 11:30 am compró US$60 millones adicionales cuando amenazó con perforar S/ 3.640. La intervención acumulada de US$140 millones fue la mayor en una sola sesión desde el 14 de febrero de 2026.

Los factores que explican la presión apreciadora del martes son: (1) la liquidación de exportadores de arándanos y uvas que venden dólares para pagar planillas de mayo; (2) el ingreso de inversión extranjera de portafolio en bonos soberanos peruanos aprovechando el diferencial de tasas con EE.UU.; (3) el efecto contagio de la debilidad generalizada del dólar (DXY en 99.6) sobre todas las divisas emergentes.

El análisis técnico del PEN/USD muestra un soporte en S/ 3.638 (mínimo de 14 de mayo) y S/ 3.620 (mínimo anual de enero). La resistencia se ubica en S/ 3.680-3.700. Los traders de FX de bancos locales señalan que la tendencia apreciadora del sol podría extenderse hasta S/ 3.62 si el BCRP no intensifica sus compras de dólares.`,
    analisis: `El sol en S/ 3.645 con tendencia apreciadora es un escenario favorable para importadores y deudores en dólares, pero desafiante para exportadores y quienes tienen ingresos en moneda extranjera. La intervención del BCRP indica que el banco central no permitirá una apreciación rápida más allá de S/ 3.63-3.65.

Si tienes necesidad de comprar dólares en los próximos días, el nivel actual de S/ 3.645 es atractivo en el contexto del año. Si en cambio tienes dólares que necesitas convertir a soles, el momento también es favorable ya que el sol está en su nivel más fuerte de los últimos dos meses.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/30381207/pexels-photo-30381207.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm012',
    titulo: 'Bitcoin consolida en US$97,500 tras rechazar US$101,000 — institucionales acumulan en zona de soporte',
    descripcion: 'Bitcoin (BTC) opera en US$97,500 luego de una semana volátil que incluyó un intento de ruptura por encima de US$101,000 rechazado con fuerza el pasado sábado. El análisis on-chain muestra que wallets de más de 1,000 BTC (ballenas institucionales) acumularon 18,400 BTC netos en los últimos 7 días, señal que los analistas interpretan como una base de soporte sólida.',
    contenido: `Bitcoin cotiza en US$97,500 en el miércoles asiático, consolidándose después de una semana de alta volatilidad. El intento de superar US$101,000 del pasado sábado fue rechazado en US$100,840 con un volumen de ventas de US$4,200 millones en los principales exchanges centralizados en las 4 horas posteriores al rechazo, lo que los analistas consideran "realizaciones de beneficios institucionales planificadas".

El análisis on-chain de Glassnode muestra que entre el 20 y el 27 de mayo, las wallets con más de 1,000 BTC acumularon un saldo neto de 18,400 BTC (equivalente a aproximadamente US$1,790 millones). Este comportamiento de "ballenas" comprando en los retrocesos es considerado una señal alcista de mediano plazo por analistas de CryptoQuant.

El mercado de opciones de Bitcoin en Deribit muestra un sesgo implícito (skew) neutral para el vencimiento de junio y ligeramente alcista para septiembre. Las opciones call de US$110,000 para diciembre 2026 acumulan un open interest de US$840 millones, indicando que los grandes inversores apuestan por nuevos máximos históricos antes de fin de año.

La correlación de Bitcoin con el DXY se ha vuelto más negativa en las últimas semanas: cuando el dólar cae, el BTC tiende a subir porque los inversores buscan alternativas al dinero fiduciario. Con el DXY en 99.6, el contexto macroeconómico es favorable para activos como Bitcoin y oro.`,
    analisis: `Bitcoin en US$97,500 con soporte institucional fuerte y correlación negativa con el DXY sugiere un escenario técnico constructivo. Sin embargo, la resistencia de US$101,000 deberá superarse en volumen para confirmar la tendencia alcista de largo plazo y abrir el camino hacia nuevos máximos.

Desde la perspectiva del tipo de cambio, la debilidad del dólar que impulsa el BTC también favorece al sol peruano. Inversores peruanos con exposición en BTC se benefician doblemente: el activo sube en dólares y el dólar está más barato en soles.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7621147/pexels-photo-7621147.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm013',
    titulo: 'Argentina: inflación de mayo cede a 3.1% mensual — el nivel más bajo en 4 años pero el peso sigue bajo presión',
    descripcion: 'El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó que la inflación de mayo de 2026 fue de 3.1% mensual, su nivel más bajo desde marzo de 2022. La inflación acumulada en los primeros cinco meses del año es de 22.4%, muy por debajo del 89.4% acumulado en el mismo período de 2025. Sin embargo, el peso argentino cayó 1.8% frente al dólar ante dudas sobre la sostenibilidad del programa fiscal del gobierno de Milei.',
    contenido: `El INDEC publicó el dato de inflación de mayo de 2026 para Argentina: 3.1% mensual, significativamente por debajo del 3.8% de abril y del 4.2% de marzo. La lectura es la más baja desde marzo de 2022 y consolida la tendencia de desinflación acelerada que comenzó con el programa de shock fiscal del gobierno del presidente Javier Milei en diciembre de 2023.

La desaceleración inflacionaria de mayo estuvo liderada por alimentos y bebidas (2.4%, el menor desde 2021), vivienda y servicios básicos (2.8%) y transporte (1.9%). El capítulo de indumentaria mostró deflación de -0.4% por segundo mes consecutivo, reflejo de la mayor competencia de importaciones y la caída del consumo privado.

Sin embargo, el mercado de divisas no celebró el dato positivo: el peso argentino cayó 1.8% en el mercado libre (blue), de $1,240 a $1,262 por dólar. Los inversores expresaron preocupación por el resurgimiento del déficit cuasi-fiscal del Banco Central —cuyo balance de pasivos remunerados alcanzó los US$18,000 millones— y por la demora en la aprobación legislativa del presupuesto 2027 que incluye los ajustes de gasto acordados con el FMI.

La inflación acumulada 2026 de 22.4% implica que, si la tendencia se mantiene, Argentina cerraría el año con una inflación de aproximadamente 55%-65%, desde el 211% de 2024, lo que representaría una mejora histórica aunque aún elevada por estándares regionales.`,
    analisis: `La desinflación argentina es relevante para el tipo de cambio regional: un peso más estable reduce el efecto de contagio de volatilidad cambiaria que suele afectar al sol peruano cuando el mercado "vende emergentes". Sin embargo, el riesgo de una desestabilización del esquema cambiario argentino persiste.

Para empresas peruanas con negocios o transacciones en Argentina, la volatilidad del peso y los controles cambiarios hacen recomendable operar en dólares o mantener posiciones en la moneda local por el menor tiempo posible.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm014',
    titulo: 'Banco de la República de Colombia baja su tasa de interés a 8.25% — el peso colombiano gana 1.1% frente al dólar',
    descripcion: 'La Junta Directiva del Banco de la República de Colombia aprobó un recorte de 25 puntos básicos en su tasa de política monetaria, llevándola de 8.50% a 8.25% en su reunión del 26 de mayo. La decisión fue apoyada por 5 de 7 miembros. El peso colombiano reaccionó paradójicamente con una apreciación de 1.1% ante la lectura de que las condiciones macroeconómicas justifican el estímulo sin presionar la inflación.',
    contenido: `La Junta Directiva del Banco de la República de Colombia votó 5-2 a favor de reducir la tasa de interés de referencia en 25 puntos básicos, de 8.50% a 8.25%, en su reunión ordinaria del 26 de mayo de 2026. La medida continúa el ciclo de relajación monetaria iniciado en diciembre de 2023, cuando la tasa alcanzó su pico de 13.25%.

El comunicado de la junta destacó que la inflación total de Colombia cayó a 4.8% interanual en abril, el nivel más bajo desde agosto de 2021 y dentro del rango meta de 3.0% ±1%. La inflación de alimentos, históricamente volátil en Colombia, cedió a 5.2%, mientras la inflación de servicios —más persistente— bajó a 6.4%.

La decisión tomó a algunos analistas por sorpresa: la mediana de las estimaciones de una encuesta de Reuters apuntaba a una pausa. El gobernador del banco central, Leonardo Villar, explicó en conferencia de prensa que "la convergencia de la inflación hacia la meta está bien encaminada y la actividad económica necesita un impulso adicional", con el PIB de Colombia creciendo solo 2.1% en Q1 2026, por debajo de su potencial estimado de 3.2%.

El peso colombiano (COP) cayó inicialmente 0.4% pero luego revirtió y cerró con una apreciación de 1.1%, cotizando en COP 4,018 por dólar. Los analistas explicaron la reacción positiva por el señal de confianza del banco central en la economía y por el contexto de dólar débil global (DXY en 99.6).`,
    analisis: `El recorte de tasas colombiano, en el contexto de un DXY débil, genera un efecto positivo sobre las divisas emergentes de la región, incluido el sol peruano. Cuando el contexto global favorece a las monedas emergentes, los bancos centrales de la región tienen mayor espacio para recortar tasas sin provocar devaluaciones.

Para el Perú, el ciclo colombiano es un indicador adelantado: si Colombia puede bajar a 8.25% con inflación bajo control, el BCRP (actualmente en 4.75%) también tiene argumentos para considerar recortes en el segundo semestre si la inflación se mantiene en su rango meta.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'm015',
    titulo: 'Chile: PIB creció 2.8% en Q1 2026 impulsado por minería del litio y cobre — peso chileno se aprecia a $896/USD',
    descripcion: 'El Banco Central de Chile reportó un crecimiento del PIB de 2.8% interanual en el primer trimestre de 2026, superando las expectativas del 2.3%. La minería fue el sector líder con un alza de 8.4%, impulsada por la producción récord de litio (crecimiento de 34%) en el Salar de Atacama y la expansión de Codelco en sus yacimientos del norte. El peso chileno se apreció a $896 por dólar, su nivel más fuerte en 11 meses.',
    contenido: `El Banco Central de Chile publicó las cuentas nacionales del primer trimestre de 2026, mostrando un crecimiento del Producto Interno Bruto de 2.8% interanual, su mejor resultado desde el Q3 de 2022 y por encima del consenso de analistas que proyectaba 2.3%. El crecimiento fue liderado por el sector minero (+8.4%), seguido por servicios financieros (+4.2%) y comercio (+3.1%).

La minería del litio fue la gran protagonista del trimestre. La producción de litio en el Salar de Atacama —operado por SQM y Albemarle— creció 34% interanual, beneficiada por la mayor demanda de baterías para vehículos eléctricos desde China, Europa y EE.UU. El precio del carbonato de litio grado batería, que llegó a colapsar a US$8,000/tonelada a mediados de 2025, se recuperó a US$16,400/tonelada en el primer trimestre de 2026, impulsando fuertemente los ingresos del sector.

Codelco, la mayor productora de cobre del mundo, reportó una producción de 380,000 toneladas en Q1, un incremento de 6.2% gracias a las mejoras operacionales en Chuquicamata y la plena operación del nuevo nivel de Teniente. El precio del cobre en US$4.85/lb fue un factor multiplicador de los ingresos.

El peso chileno (CLP) se apreció a $896/USD durante la sesión del martes, su nivel más fuerte desde junio de 2025. El ministro de Hacienda, Mario Marcel, señaló que el desempeño del Q1 "posiciona a Chile para cerrar 2026 con un crecimiento de 2.5-3.0%", por encima de las estimaciones de inicio de año.`,
    analisis: `El dinamismo chileno —impulsado por litio y cobre— refuerza el efecto positivo de los precios de los metales sobre el tipo de cambio regional. Lo que beneficia a Chile (cobre y litio caros) también beneficia a Perú (cobre y oro caros): ambas economías se fortalecen cuando los commodities que exportan suben de precio.

El peso chileno apreciándose a $896/USD es un indicador de confianza en las perspectivas de la región. Para inversores y empresas peruanas con exposición en Chile, el entorno cambiario actual es favorable para minimizar la exposición a la apreciación del peso chileno.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l001',
    titulo: 'Fed: Powell sugiere que un recorte en julio es posible si la inflación continúa cediendo — mercados ajustan probabilidades al 58%',
    descripcion: 'El presidente de la Reserva Federal, Jerome Powell, señaló en el foro del BCE en Sintra que un recorte de tasas en julio es un escenario plausible si los próximos dos informes de inflación confirman la tendencia descendente. Los futuros de Fed Funds reaccionaron subiendo la probabilidad de un recorte de 25 pb en julio del 44% al 58%, lo que presiona al dólar a la baja y beneficia al sol peruano.',
    contenido: `Jerome Powell intervino este martes en el Foro Anual del Banco Central Europeo (BCE) en Sintra, Portugal, en un panel con los presidentes del BCE, el Banco de Inglaterra y el Banco de Japón. Sus declaraciones, más conciliatorias de lo esperado, sacudieron los mercados de renta fija y divisas a nivel global.

Powell afirmó que "la desinflación en bienes y vivienda está progresando de manera más rápida que en 2025" y que la Fed "no necesita ver inflación en el objetivo del 2% para empezar a reducir las restricciones". Precisó que dos informes del IPC que muestren lecturas por debajo del 3% interanual serían suficientes para iniciar el ciclo de recortes.

Los futuros de Fed Funds del contrato de julio respondieron de inmediato: la probabilidad implícita de un recorte de 25 pb saltó del 44% al 58% en cuestión de minutos. El rendimiento del bono del Tesoro a 10 años cedió de 4.52% a 4.41%, su nivel más bajo desde marzo. El índice DXY cayó un 0.6% adicional a 99.8, tocando un nuevo mínimo de 14 meses.

La reacción fue especialmente pronunciada en divisas emergentes. El real brasileño, el peso colombiano y el sol peruano se apreciaron entre 0.4% y 0.9%. El PEN tocó brevemente S/ 3.63 antes de que el BCRP interviniera comprando dólares. Los analistas de Goldman Sachs revisaron su pronóstico de primer recorte Fed de septiembre a julio, condicionado a que el IPC de mayo y junio sean favorables.`,
    analisis: `Un recorte de la Fed en julio, si se materializa, reduciría el diferencial de tasas entre el dólar y las monedas emergentes, lo que presionaría el DXY por debajo de 99 y podría llevar el sol peruano hacia S/ 3.58-3.62. Para empresas peruanas con deuda en dólares, este escenario es favorable a corto plazo ya que sus pasivos se abaratarían en términos de soles.

Para quienes mantienen saldos en dólares, el escenario apunta a una ventana de conversión a soles antes de que el tipo de cambio baje más. Sin embargo, la incertidumbre es alta: si el IPC de mayo (publicado el 11 de junio) sorprende al alza, las probabilidades de recorte se evaporarán y el dólar podría rebotar rápidamente.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l002',
    titulo: 'Inversión privada en Perú creció 8.2% en Q1 2026 — minería y construcción lideran el repunte más fuerte desde 2022',
    descripcion: 'El MEF reportó que la inversión privada en Perú se expandió 8.2% en el primer trimestre de 2026, superando en más del doble la tasa proyectada de 3.5%. El sector minero concentró el 61% del incremento con US$ 3,240 millones en proyectos de expansión, mientras la construcción privada creció 11.4% impulsada por vivienda y oficinas corporativas en Lima.',
    contenido: `El Ministerio de Economía y Finanzas publicó el Informe de Seguimiento de la Inversión Privada del Q1 2026, revelando un crecimiento de 8.2% interanual, el más alto desde el tercer trimestre de 2022. La cifra supera ampliamente el 3.5% proyectado en el Marco Macroeconómico Multianual y posiciona al Perú como el país con mayor dinamismo inversor de América del Sur en el trimestre.

El sector minero fue el principal motor con US$ 3,240 millones en inversión, un crecimiento del 18.4%. Las ampliaciones de las minas Quellaveco (Anglo American), Toquepala (Southern Copper) y el proyecto Corani (Bear Creek Mining) concentraron la mayor parte del desembolso. El ciclo de alta rentabilidad del cobre, con precios sobre US$ 5/lb sostenidos durante más de 12 semanas, indujo a las grandes mineras a acelerar sus planes de capital.

La construcción privada creció 11.4%, impulsada por dos segmentos: vivienda social (programa Techo Propio II) con 28,400 nuevas unidades iniciadas en el trimestre, y oficinas corporativas en Lima con 62,000 m² de nuevos proyectos en San Isidro, Miraflores y La Molina. El sector retail y logístico aportó 45 proyectos de almacenes y centros de distribución en Lima, Arequipa y Trujillo.

El MEF destacó que la reducción del costo del crédito corporativo, después de dos recortes del BCRP en 2025, y la mayor certidumbre regulatoria en el sector minero fueron los factores institucionales que explican el repunte de la confianza empresarial medida por el IPE.`,
    analisis: `Un crecimiento de inversión privada de 8.2% en un trimestre tiene efectos expansivos sobre el tipo de cambio: más inversión implica mayor demanda interna, más empleo y más consumo, lo que presiona los precios al alza y justifica que el BCRP mantenga su tasa elevada. Esto tiende a fortalecer el sol frente al dólar en el mediano plazo.

Para empresas que planean proyectos de capital en los próximos 6-12 meses, el entorno actual de tasas moderadas en soles y tipo de cambio favorable es una ventana de oportunidad. Si la Fed recorta en julio y el DXY sigue cediendo, el crédito en dólares también se abaratará, ampliando aún más las opciones de financiamiento.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l003',
    titulo: 'BCRP mantiene tasa de referencia en 4.75% y reafirma postura de "esperar y ver" ante la incertidumbre global',
    descripcion: 'El directorio del Banco Central de Reserva del Perú decidió por unanimidad mantener la tasa de referencia en 4.75% anual en su reunión del 22 de mayo. El comunicado destacó que la inflación cerró abril en 2.3% anual, dentro del rango meta, pero que la volatilidad en mercados externos justifica cautela antes de considerar nuevos ajustes.',
    contenido: `El Directorio del BCRP se reunió el jueves 22 de mayo y decidió por votación unánime mantener la tasa de interés de referencia en 4.75% anual. Esta es la segunda reunión consecutiva sin cambios, después de dos recortes de 25 pb en septiembre y noviembre de 2025 que llevaron la tasa desde 5.25%.

El comunicado del banco central destacó cuatro elementos clave del entorno. Primero, la inflación interanual se ubicó en 2.3% en abril de 2026, su nivel más bajo desde agosto de 2021 y dentro del rango meta de 1%-3%. Segundo, las expectativas de inflación a 12 meses se mantienen ancladas en 2.5% según la encuesta de analistas. Tercero, la actividad económica muestra dinamismo con un PBI que creció 4.1% en el primer trimestre. Cuarto, persiste la incertidumbre global derivada de las negociaciones comerciales EE.UU.-China y la política monetaria de la Fed.

El presidente del BCRP, Julio Velarde, indicó en conferencia de prensa que "la postura actual de política monetaria es ligeramente restrictiva y es la apropiada para el momento". Señaló que el banco central "no siente urgencia" de continuar el ciclo de recortes, pero que "si los datos lo justifican, podría retomarse en la segunda mitad del año". La próxima reunión del directorio está programada para el 12 de junio.

En el mercado cambiario, la decisión fue recibida con neutralidad. El sol peruano se mantuvo en el rango S/ 3.65-3.66 durante la sesión del jueves, sin cambios significativos respecto al tipo de cambio previo a la reunión.`,
    analisis: `La pausa del BCRP es coherente con un entorno donde la inflación está bajo control pero los riesgos externos siguen activos. Una tasa de 4.75% mantiene al sol como una moneda que ofrece carry positivo frente al dólar, lo que atrae flujos de inversión extranjera y sostiene la demanda de soles en el mercado.

Para empresas que esperan refinanciar créditos en soles, la señal del BCRP sugiere que las tasas no bajarán materialmente en el corto plazo. Es prudente evaluar si tiene sentido fijar tasas ahora, antes de una eventual reducción futura, o esperar a que el ciclo de recortes se reanude en el segundo semestre.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l004',
    titulo: 'Agroexportaciones peruanas superan US$ 1,840 millones en Q1 2026 — arándanos y palta Hass lideran con cifras históricas',
    descripcion: 'Las exportaciones agroindustriales peruanas cerraron el primer trimestre con US$ 1,840 millones, un crecimiento del 22.4% interanual. Los arándanos frescos generaron US$ 312 millones, convirtiéndose en el segundo producto de agroexportación más rentable del país, mientras la palta Hass alcanzó US$ 487 millones en el período, su récord histórico.',
    contenido: `La Asociación de Exportadores (ADEX) publicó su reporte sectorial Q1 2026, revelando que las exportaciones agroindustriales peruanas alcanzaron US$ 1,840 millones, la cifra más alta para un primer trimestre en la historia del sector. El crecimiento de 22.4% interanual refleja la combinación de mayor volumen exportado, precios internacionales favorables y apertura de nuevos mercados.

La palta Hass lideró el ranking con US$ 487 millones, un crecimiento del 31.2%. Las exportaciones con destino a Europa (Países Bajos, España, Alemania) concentraron el 58% del volumen, mientras que el mercado asiático —especialmente Japón y China— representó el 22%, triplicando su participación frente a 2024. El incremento en volumen exportado fue de 28.4%, con la productividad por hectárea mejorando un 8.5% gracias a la adopción de tecnología de riego por goteo en La Libertad e Ica.

Los arándanos frescos se consolidaron como el segundo producto más importante con US$ 312 millones, creciendo 44.7%. La apertura del mercado chino para arándanos peruanos a raíz del protocolo fitosanitario firmado en enero de 2026 fue el factor determinante: China absorbió 18,400 toneladas en el trimestre, convirtiéndose en el segundo destino de exportación detrás de EE.UU.

El espárrago fresco aportó US$ 183 millones, con un crecimiento más moderado del 6.2%, afectado por la competencia de Perú con México en el mercado norteamericano. Los mangos y cítricos completaron el cuadro con US$ 174 millones y US$ 98 millones respectivamente.`,
    analisis: `El boom agroexportador es una fuente de divisas constante y creciente que actúa como soporte estructural del sol peruano. A diferencia de la minería, cuyo ingreso de divisas es más volátil y concentrado en pocos meses, las agroexportaciones generan flujo de dólares de manera más regular a lo largo del año, lo que da mayor estabilidad al tipo de cambio.

Para empresas del sector agroexportador, el tipo de cambio actual (S/ 3.65) representa un entorno de márgenes todavía saludables. Sin embargo, si el sol continúa apreciándose hacia S/ 3.55-3.60, los márgenes en soles se comprimirán. Considerar coberturas cambiarias forward para los embarques de Q2 y Q3 es una opción prudente en este contexto.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l005',
    titulo: 'MEF revisa al alza crecimiento PBI 2026 a 3.8% — construcción, minería y servicios superan proyecciones del Marco Multianual',
    descripcion: 'El Ministerio de Economía y Finanzas actualizó su proyección de crecimiento del PBI 2026 de 3.2% a 3.8%, impulsado por el desempeño superior al esperado de la inversión privada en Q1, el boom exportador y la recuperación del consumo privado. El ajuste posiciona a Perú como la economía de mayor crecimiento de América del Sur para el año.',
    contenido: `El Ministerio de Economía y Finanzas publicó la actualización del Marco Macroeconómico Multianual (MMM) 2026-2029, elevando la proyección de crecimiento del PBI para 2026 de 3.2% a 3.8%. La revisión refleja el desempeño del primer trimestre, que creció 4.1% interanual, y la persistencia de factores favorables para la actividad durante el resto del año.

El sector construcción está liderando el ajuste al alza, creciendo 9.1% en Q1 2026 gracias a la inversión privada en vivienda y oficinas, y al rebote del presupuesto de infraestructura pública después de las reformas de destrabe aprobadas en 2025. El MEF proyecta que la construcción crecerá 8.5% en todo el año, lo que aportaría casi 0.7 puntos porcentuales al crecimiento del PBI.

La minería metálica se proyecta con crecimiento del 7.2% para 2026, por encima del 4.8% del MMM anterior, gracias a los mayores precios del cobre y al ingreso de producción adicional de los proyectos de expansión. El sector servicios —incluyendo turismo, fintech y retail moderno— se proyecta con crecimiento del 4.5%, en línea con la recuperación del consumo privado.

El ministro de Economía, José Arista, destacó que "Perú mantiene los fundamentos macroeconómicos más sólidos de la región: inflación bajo control, superávit comercial récord, reservas internacionales en máximos históricos y déficit fiscal convergiendo". Señaló que el país está en condiciones de mantener la calificación crediticia soberana de BBB+ con perspectiva estable.`,
    analisis: `Un crecimiento de 3.8% del PBI en 2026, liderado por inversión y exportaciones, es un entorno de "soft landing" ideal para el tipo de cambio: la economía crece sin generar presiones inflacionarias desbordadas, lo que permite al BCRP mantener tasas moderadas. Esto favorece al sol pero sin generar los extremos de volatilidad que caracterizan los períodos de boom o recesión.

Para empresas peruanas, el entorno de crecimiento moderado pero sostenido es propicio para planificar expansiones y nuevas inversiones. El tipo de cambio estable en el rango S/ 3.60-3.70 es la base para elaborar presupuestos 2027 con menor incertidumbre cambiaria que en años anteriores.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l006',
    titulo: 'Producción de cobre en Perú alcanza 680,000 toneladas en Q1 2026 — Las Bambas y Cerro Verde baten récords de sus respectivas operaciones',
    descripcion: 'El Ministerio de Energía y Minas reportó que la producción nacional de cobre alcanzó 680,000 toneladas métricas en el primer trimestre de 2026, un crecimiento del 14.2% interanual. Las Bambas de MMG operó al 103% de su capacidad instalada, mientras Cerro Verde de Freeport-McMoRan registró su mayor producción trimestral desde su ampliación en 2016.',
    contenido: `El Ministerio de Energía y Minas (MINEM) publicó el Reporte Estadístico Minero del Q1 2026, mostrando que la producción de cobre totalizó 680,000 toneladas métricas (TM), equivalentes al 16% de la producción mundial del período y confirmando el segundo lugar de Perú como productor global, detrás de Chile.

Las Bambas, operada por MMG Limited (filial de China Minmetals), produjo 122,400 TM en el trimestre, operando al 103% de su capacidad de diseño gracias a mejoras en el proceso de flotación implementadas en 2025. El corredor minero Apurímac operó sin incidentes por noveno trimestre consecutivo, y la empresa registró cero días perdidos por conflictos sociales desde mayo de 2024.

Cerro Verde, operada por Freeport-McMoRan con participación de Buenaventura y SMM, alcanzó 111,200 TM, su mayor producción trimestral desde la ampliación completada en 2016. El incremento se explica por la mayor ley del mineral procesado y la optimización del calendario de voladuras. La empresa anticipó que el ritmo se mantendría en Q2.

Antamina (BHP/Glencore/Teck) y Toquepala (Southern Copper) completaron el liderazgo del sector con 94,800 TM y 82,300 TM respectivamente. El MINEM destacó que los precios promedio del cobre de US$ 5.15/lb en el trimestre, los más altos en 24 meses, generaron regalías e impuestos por US$ 1,240 millones para el Estado peruano, un récord histórico para un solo trimestre.`,
    analisis: `La producción récord de cobre tiene un efecto directo y positivo en el sol peruano: cada tonelada de cobre exportada implica que una empresa minera trae dólares al país para pagar sueldos, impuestos y proveedores locales en soles. Con 680,000 TM a US$ 5.15/lb, el ingreso de divisas del sector cobre en Q1 fue de aproximadamente US$ 7,700 millones, el factor más importante del superávit comercial récord.

Para empresas peruanas importadoras, la fortaleza del sol derivada del boom minero es una ventaja competitiva real que reduce el costo de insumos, maquinaria y deuda en dólares. Esta ventana puede durar mientras los precios del cobre se mantengan sobre US$ 4.50/lb, que es el nivel considerado "altamente rentable" por la industria.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l007',
    titulo: 'China: PMI manufacturero sube a 51.8 en mayo, primer mes sobre 51 en 18 meses — órdenes de exportación lideran la expansión',
    descripcion: 'El PMI manufacturero oficial de China subió a 51.8 en mayo de 2026 desde 50.4 en abril, su lectura más alta en 18 meses y la primera vez sobre 51 desde noviembre de 2024. El subíndice de nuevas órdenes de exportación alcanzó 53.2, impulsado por el boom de demanda de electrónica y vehículos eléctricos en mercados emergentes, lo que presionó al alza los precios de metales industriales.',
    contenido: `La Oficina Nacional de Estadísticas de China publicó el PMI manufacturero oficial de mayo de 2026 con una lectura de 51.8, superando las proyecciones del consenso de Bloomberg de 51.0 y marcando el mejor resultado mensual desde noviembre de 2024. Cualquier lectura sobre 50 indica expansión de la actividad; la de mayo confirma que la economía china está acelerando su ritmo de crecimiento industrial.

El subíndice más relevante para los mercados de materias primas fue el de nuevas órdenes de exportación, que subió a 53.2 desde 51.1 en abril. Este indicador captura la demanda global de productos chinos y es un proxy de la actividad industrial futura. Los sectores de electrónica de consumo, componentes de vehículos eléctricos y maquinaria de precisión registraron los mayores incrementos de pedidos desde el exterior.

El subíndice de empleo manufacturero subió de 49.2 a 50.6, cruzando el umbral de expansión por primera vez desde agosto de 2024, lo que sugiere que las empresas están contratando ante la mejora de la demanda. El subíndice de precios de materias primas pagadas subió de 51.3 a 54.8, reflejando mayor demanda de cobre, aluminio, níquel y mineral de hierro en las líneas de producción.

El Caixin PMI manufacturero, que mide principalmente empresas privadas y de exportación, también superó las expectativas: subió a 51.5 desde 50.8. Esta convergencia entre el PMI oficial y el Caixin indica que la recuperación es amplia, no concentrada en empresas estatales como ocurrió en otros episodios de estímulo.`,
    analisis: `Un PMI manufacturero chino de 51.8 es directamente alcista para el precio del cobre, cuya demanda proviene en un 54% de China. El movimiento del cobre de US$ 5.10 a US$ 5.22/lb en los últimos tres días está directamente relacionado con esta mejora del PMI y los datos de órdenes. Si la tendencia continúa en junio, el cobre podría testar US$ 5.40/lb.

Para Perú, cada centavo de dólar de aumento en el precio del cobre representa aproximadamente US$ 35 millones adicionales en ingresos de exportación anuales. Un cobre sostenido sobre US$ 5.20/lb durante el resto de 2026 podría añadir US$ 700-900 millones al superávit comercial peruano, lo que reforzaría la apreciación del sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l008',
    titulo: 'Actas de la Fed de mayo revelan que mayoría ve "sin urgencia" recortar tasas — pero minoría significativa abre puerta a julio',
    descripcion: 'Las actas de la reunión del FOMC del 6-7 de mayo, publicadas este miércoles, revelan que la mayoría de los miembros apoya mantener las tasas sin cambios "por el tiempo que sea necesario", pero una minoría "significativa" de cuatro participantes señaló que podrían apoyar un recorte en julio si la inflación continúa moderándose. El dólar cayó 0.4% tras la publicación.',
    contenido: `La Reserva Federal publicó las actas de la reunión del Comité Federal de Mercado Abierto (FOMC) del 6 y 7 de mayo de 2026, documentos que detallan el debate interno entre los 12 miembros votantes sobre la dirección de la política monetaria. El tono general confirma la postura de "esperar y ver" adoptada en el comunicado oficial, pero con matices importantes.

La mayoría de los miembros defendió la postura de mantener la tasa en el rango 4.75%-5.00% "por el tiempo que sea necesario" para asegurar el retorno de la inflación al objetivo del 2% de manera sostenida. Varios participantes expresaron "preocupación por actuar prematuramente" tras la experiencia de 2021-2022, cuando la Fed esperó demasiado para subir tasas y luego tuvo que hacerlo agresivamente.

Sin embargo, las actas revelan que cuatro miembros —referidos en el documento como "varios participantes"— señalaron que "si los datos de inflación de mayo y junio confirman la tendencia descendente, estarían en condiciones de apoyar una reducción del rango objetivo en julio". Este es el primer registro escrito de apertura explícita a un recorte en julio dentro del FOMC, más allá de las declaraciones públicas individuales.

El debate también incluyó discusión sobre el mercado laboral, donde los miembros reconocieron que "la moderación salarial observada en los últimos tres meses es consistente con el objetivo de inflación", y sobre el mercado de crédito, donde se destacó que "las condiciones financieras se han relajado más de lo previsto" a pesar de que las tasas de corto plazo no han bajado.`,
    analisis: `Las actas confirman una Fed dividida, pero con el centro de gravedad moviéndose hacia un recorte en julio o septiembre. Para el mercado cambiario, la señal más importante es que el "piso" de las tasas podría estar cerca, lo que limita el potencial de apreciación del dólar y favorece a monedas emergentes como el sol peruano.

La estrategia práctica para empresas peruanas: si tienen deuda en dólares a tasa variable, el entorno apunta a que el costo de esa deuda podría bajar en los próximos 2-4 meses. Si planean emitir deuda, una ventana de refinanciamiento favorable podría abrirse en Q3 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l009',
    titulo: 'Cobre toca US$ 5.22/lb en el LME — PMI chino y huelgas en Chile catalizan rally del metal hasta máximo de 26 meses',
    descripcion: 'El cobre para entrega en tres meses en el London Metal Exchange alcanzó US$ 5.22/lb, su precio más alto en 26 meses, impulsado por la mejora del PMI manufacturero chino a 51.8 y las amenazas de huelga en las minas Escondida y Collahuasi en Chile. El movimiento añade US$ 2,100 millones anuales estimados a los ingresos de exportación del Perú.',
    contenido: `El cobre cotizó a US$ 5.22/lb en el London Metal Exchange (LME) este martes, su nivel más alto desde marzo de 2024. El rally del 4.8% acumulado en las últimas cinco sesiones responde a la confluencia de tres catalizadores simultáneos que los analistas de Citigroup calificaron como "la trifecta alcista del cobre".

El primero es la mejora del PMI manufacturero chino a 51.8, que señala mayor demanda industrial de cobre para cables eléctricos, motores, electrodomésticos y vehículos eléctricos. BHP Billiton estimó que la demanda china de cobre en 2026 crecerá un 6.8%, el mayor ritmo desde 2019.

El segundo catalizador es la amenaza de huelga en Escondida (BHP, 5.6% de la producción mundial de cobre) y Collahuasi (Anglo American/Glencore, 3.2%), donde los sindicatos rechazan la oferta salarial presentada por las mineras. Los trabajadores rechazaron el ofrecimiento inicial y el proceso de mediación obligatoria comenzó el 23 de mayo. Si no hay acuerdo en 5 días hábiles, la huelga legal podría iniciarse el 30 de mayo.

El tercer factor es la caída del DXY a 99.8, que automáticamente encarece las materias primas cotizadas en dólares para compradores con otras monedas, estimulando la demanda. Los inventarios de cobre en el LME cayeron a 47,200 TM, el nivel más bajo desde agosto de 2023, lo que amplifica la sensibilidad del precio a cualquier interrupción de oferta.`,
    analisis: `El cobre a US$ 5.22/lb tiene un efecto multiplicador en los ingresos de exportación de Perú. Cada US$ 0.10/lb de aumento en el precio del cobre equivale a aproximadamente US$ 350 millones anuales adicionales en divisas. Desde el cierre del año pasado a US$ 4.75/lb hasta el nivel actual de US$ 5.22/lb, el incremento es de US$ 0.47/lb, lo que implica US$ 1,645 millones más en ingresos anualizados.

Para los actores del mercado cambiario local, este entorno de cobre elevado es el factor más sólido que sostiene la apreciación del sol. Mientras el cobre se mantenga sobre US$ 5/lb, el BCRP tendrá que seguir interviniendo comprando dólares para evitar que el tipo de cambio caiga por debajo de S/ 3.60.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l010',
    titulo: 'DXY cae a 99.8 — mínimo de 14 meses tras dato débil de vivienda en EE.UU. y señales dovish de Powell en Sintra',
    descripcion: 'El índice dólar DXY cayó a 99.8, su nivel más bajo desde marzo de 2025, tras la publicación de ventas de casas nuevas en EE.UU. que cayeron 8.3% en abril, peor que el -3.2% esperado. Las declaraciones de Powell en el foro del BCE en Sintra amplificaron el movimiento, consolidando la visión de que el ciclo de recortes de la Fed comenzará antes de fin de año.',
    contenido: `El índice del dólar frente a una canasta de seis divisas principales (DXY) cayó a 99.8 en la sesión del martes, perforando el soporte técnico de 100.0 que analistas técnicos tenían como nivel clave. El movimiento extiende la corrección del dólar que empezó el 5 de mayo desde el nivel de 103.4, acumulando una caída del 3.5% en 21 días hábiles.

El catalizador inmediato fue el dato de ventas de casas nuevas de EE.UU. de abril, publicado a las 10:00 EST: cayeron 8.3% mensual frente al -3.2% esperado por el consenso de Bloomberg. Las ventas de 521,000 unidades anualizadas son el nivel más bajo desde noviembre de 2022 y reflejan el impacto de las hipotecas a 30 años que siguen al 7.1%. El dato debilitó las expectativas de crecimiento económico en EE.UU. y reforzó los argumentos para un recorte de tasas anticipado.

Las declaraciones de Powell en Sintra (Portugal) amplificaron el movimiento: su apertura explícita a un recorte en julio si los datos de inflación de mayo y junio son favorables desplomó los rendimientos de bonos del Tesoro americano de 2 años en 11 pb, de 4.82% a 4.71%, el mayor movimiento intradía en tres meses.

Técnicamente, el DXY perforó el soporte del canal descendente que venía desde enero y el RSI de 14 días cayó a 38, en zona de "no sobrevendido" pero con momentum bajista claro. El siguiente soporte relevante está en 99.0, y luego en 97.8, niveles del segundo semestre de 2023.`,
    analisis: `El DXY en 99.8 implica que el dólar ha cedido terreno frente a casi todas las monedas del mundo, y el sol peruano no es la excepción. La apreciación del sol no es un fenómeno aislado peruano; es parte de una tendencia global de debilitamiento del dólar que responde a las expectativas de política monetaria de la Fed.

Para quienes tienen ahorros en dólares, este es un momento de reflexión: un DXY que continúa cayendo hacia 97-98 implicaría un sol en el rango S/ 3.55-3.60, lo que significaría menos soles por cada dólar mantenido. Para importadores peruanos, el dólar más barato es la mejor noticia posible para reducir costos de importación de insumos y maquinaria.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l011',
    titulo: 'Bitcoin consolida sobre US$ 108,000 — interés abierto en futuros CME alcanza récord de US$ 34,200 millones',
    descripcion: 'Bitcoin (BTC) cotiza en US$ 108,400 en la sesión del martes, manteniendo la consolidación por encima de los US$ 105,000 por undécima sesión consecutiva. El interés abierto en futuros de Bitcoin en el Chicago Mercantile Exchange alcanzó US$ 34,200 millones, un nuevo récord histórico que señala que instituciones financieras están aumentando su exposición al activo.',
    contenido: `Bitcoin (BTC/USD) cotizó a US$ 108,400 en los principales exchanges durante la sesión del martes 26 de mayo, consolidando la zona de US$ 105,000-US$ 112,000 en la que ha operado durante las últimas once sesiones. La ausencia de volatilidad extrema —el rango diario promedio de las últimas dos semanas fue de solo 2.1%— contrasta con los patrones históricos del activo y sugiere maduración del mercado.

El dato más relevante de la semana provino del Chicago Mercantile Exchange (CME), donde el interés abierto en futuros de Bitcoin alcanzó US$ 34,200 millones, superando el récord anterior de US$ 32,800 millones de marzo de 2024 que coincidió con el primer ETF de Bitcoin al contado. El interés abierto mide el valor total de los contratos de futuros vigentes y es un indicador de la participación institucional, ya que el CME es la plataforma regulada preferida por fondos de pensiones, hedge funds y bancos de inversión.

BlackRock, el gestor de activos más grande del mundo, reportó que su ETF de Bitcoin spot (IBIT) acumuló US$ 42,800 millones en activos bajo gestión, con flujos netos positivos en 31 de las últimas 35 semanas. Fidelity y Invesco reportaron flujos similares en sus productos. Esta demanda institucional sostenida absorbe la oferta de los mineros (aproximadamente 450 BTC/día desde el halving de abril 2024) y crea un desequilibrio estructural favorable al precio.

El análisis técnico muestra que Bitcoin mantiene un patrón de consolidación en cuña ascendente. La resistencia clave está en US$ 112,500; una ruptura con volumen superior al promedio podría propulsar el precio hacia US$ 120,000-US$ 125,000.`,
    analisis: `Bitcoin sobre US$ 108,000 con interés abierto récord en el CME es una señal de que la demanda institucional está absorbiendo la oferta de manera eficiente. A diferencia de los rallies de 2021, que fueron impulsados por retail y stablecoins, el ciclo actual tiene como motor a fondos institucionales con horizontes de inversión de 3-5 años.

Para quienes tienen exposición a Bitcoin como reserva de valor frente al dólar débil, el entorno actual es constructivo. Sin embargo, el riesgo de correlación con renta variable es real: si los datos de inflación de EE.UU. sorprenden al alza y el DXY rebota, Bitcoin históricamente cede entre 8% y 15% en las semanas siguientes. Mantener posiciones con stops bien definidos es la práctica recomendada.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l012',
    titulo: 'PEN/USD: sol peruano opera en S/ 3.63-3.68 — confluencia técnica y compras del BCRP crean piso sólido en S/ 3.63',
    descripcion: 'El tipo de cambio PEN/USD se mantiene dentro del rango S/ 3.63-3.68 por decimocuarta sesión consecutiva, el período de menor volatilidad cambiaria en cuatro años. El análisis técnico muestra una zona de soporte múltiple en S/ 3.63, reforzada por las intervenciones diarias del BCRP que promedian US$ 180 millones en compras de dólares durante las últimas dos semanas.',
    contenido: `El par PEN/USD cotiza en S/ 3.65 en la sesión del martes 26 de mayo, manteniendo la estabilidad que ha caracterizado al mercado cambiario peruano en las últimas tres semanas. El rango S/ 3.63-3.68 en el que ha operado durante 14 sesiones consecutivas es el período de baja volatilidad más extenso desde el primer trimestre de 2022, cuando el sol también operaba en una franja estrecha antes de la volatilidad post-electoral.

El análisis técnico del par muestra una confluencia de soportes en S/ 3.63 que explica por qué el sol no ha podido apreciarse más a pesar del viento de cola fundamental. En ese nivel convergen: (1) la media móvil de 200 días, (2) el 61.8% de retroceso de Fibonacci del movimiento desde S/ 3.50 hasta S/ 3.86 de 2024, y (3) el nivel donde el BCRP ha intervenido consistentemente comprando dólares en las últimas cuatro semanas.

El BCRP ha comprado un promedio de US$ 180 millones diarios de los últimos 10 días hábiles, totalizando aproximadamente US$ 1,800 millones en el período. Estas compras sirven para dos propósitos: evitar que la apreciación del sol dañe la competitividad de exportadores no mineros y acumular reservas internacionales, que ahora superan los US$ 78,900 millones.

La volatilidad implícita del PEN/USD a 1 mes, medida por las opciones sobre el tipo de cambio, cayó a 5.2%, su nivel más bajo del año. Este dato indica que el mercado no espera movimientos abruptos en el corto plazo, lo que facilita la planificación financiera de empresas que operan en ambas monedas.`,
    analisis: `El rango S/ 3.63-3.68 con soporte técnico y BCRP como comprador sistemático es el escenario de menor incertidumbre cambiaria en años para el mercado peruano. La baja volatilidad implícita (5.2%) señala que las coberturas cambiarias están baratas en términos históricos, lo que es una oportunidad para empresas que quieran asegurar un tipo de cambio por los próximos 3-6 meses sin pagar una prima excesiva.

Para traders e inversores, el rango estrecho sugiere que cualquier ruptura del piso en S/ 3.63 o del techo en S/ 3.68 podría ser técnicamente significativa. Una ruptura a la baja (sol más fuerte) podría llevar al par hacia S/ 3.55-3.58; una ruptura al alza (sol más débil) hacia S/ 3.72-3.75, dependiendo del catalizador que la genere.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l013',
    titulo: 'Argentina: reservas del BCRA alcanzan US$ 38,700 millones — cumplimiento de metas FMI y superávit fiscal consolidan el modelo Milei',
    descripcion: 'El Banco Central de la República Argentina (BCRA) reportó reservas internacionales de US$ 38,700 millones al 23 de mayo, la cifra más alta desde agosto de 2019. El superávit fiscal primario acumulado de 1.2% del PBI en los primeros cuatro meses de 2026 y la calificación crediticia mejorada a B+ por S&P consolidan la credibilidad del programa económico del presidente Javier Milei.',
    contenido: `El Banco Central de la República Argentina publicó su reporte semanal de reservas internacionales, mostrando un saldo de US$ 38,700 millones al cierre del viernes 23 de mayo. Este nivel supera en US$ 12,300 millones el saldo de diciembre de 2025 e implica que Argentina está acumulando divisas a un ritmo de aproximadamente US$ 1,200 millones mensuales, el mejor desempeño desde 2019.

La acumulación de reservas responde a tres factores combinados. Primero, el superávit de cuenta corriente generado por las exportaciones del complejo agroexportador (soja, maíz, girasol), que en los primeros cuatro meses superó los US$ 8,900 millones ante los altos precios de los granos. Segundo, el ingreso de capitales atraídos por el blanqueo de capitales de 2025 y los primeros bonos verdes emitidos por el gobierno a tasas de 7.8% anual. Tercero, el financiamiento neto del FMI de US$ 4,300 millones correspondiente al cuarto desembolso del programa de 24 meses.

Standard & Poor's mejoró la calificación crediticia soberana de Argentina de B a B+ con perspectiva estable el 20 de mayo, citando "la mejora significativa en las cuentas fiscales y externas y la reducción de la inflación". La inflación mensual cayó a 1.9% en abril, equivalente a un 25% anualizado, frente al 211% registrado en 2023. El peso argentino cerró la semana en 1,042 por dólar bajo el esquema de banda cambiaria.

El ministro de Economía, Luis Caputo, destacó el "superávit fiscal primario de 1.2% del PBI en cuatro meses", señalando que es "el mejor resultado fiscal en dos décadas y la evidencia más contundente del cambio estructural en el Estado argentino".`,
    analisis: `La consolidación fiscal y la acumulación de reservas en Argentina son señales positivas para la estabilidad regional, pero su impacto directo en el tipo de cambio peruano es limitado. La estabilización argentina reduce el "riesgo contagio" para monedas de la región y permite que inversores internacionales vean a Latinoamérica con menos desconfianza sistémica.

Para empresas peruanas con operaciones o proveedores en Argentina, la estabilidad del peso en la banda cambiaria reduce la incertidumbre de los contratos. Sin embargo, con una inflación del 25% anual todavía elevada, la competitividad de los productos argentinos sigue siendo superior para exportaciones regionales, lo que beneficia relativamente a las empresas que compiten contra productos argentinos.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l014',
    titulo: 'Colombia: Banrep reduce tasa de interés a 9.50% — inflación cae a 5.8% anual y el banco central acelera el ciclo de recortes',
    descripcion: 'El Banco de la República de Colombia (Banrep) redujo su tasa de interés de política monetaria de 9.75% a 9.50% en su reunión del 23 de mayo, en línea con las expectativas del mercado. La decisión fue por 4 votos a favor y 3 en contra, y el comunicado señaló que la inflación de abril (5.8% anual) abre espacio para continuar moderando la postura restrictiva.',
    contenido: `La junta directiva del Banco de la República de Colombia aprobó un recorte de 25 puntos básicos en la tasa de interés de política monetaria, llevándola de 9.75% a 9.50% en su reunión del viernes 23 de mayo. Esta es la séptima reducción consecutiva desde el máximo de 13.25% alcanzado en octubre de 2023, acumulando una reducción total de 375 pb en el ciclo.

La votación fue dividida: cuatro miembros de la junta votaron a favor del recorte de 25 pb, mientras tres preferían mantener la tasa sin cambios citando la inflación todavía por encima del rango meta. El acta de la reunión reveló que los disidentes expresaron preocupación por "la depreciación reciente del peso" y la "incertidumbre sobre el comportamiento de los precios regulados".

La inflación de Colombia cerró abril en 5.8% anual, cayendo desde el 6.3% de marzo y marcando el nivel más bajo desde septiembre de 2022. Sin embargo, sigue siendo superior al rango meta del Banrep de 2%-4%, lo que explica la cautela de la minoría. La inflación de alimentos cayó a 3.9%, mientras la inflación de servicios sigue elevada en 7.4% anual.

El peso colombiano (COP) reaccionó con una leve depreciación al recorte, cotizando en COP 4,280 por dólar al cierre de la sesión del viernes, frente a COP 4,250 el jueves. El mercado de bonos TES colombianos se fortaleció, con los títulos a 10 años cayendo de 11.8% a 11.55% de rendimiento tras el comunicado, reflejando que los inversores anticipan más recortes en el segundo semestre.`,
    analisis: `El ciclo de recortes del Banrep colombiano tiene una relación indirecta pero relevante con el tipo de cambio peruano. A medida que Colombia recorta tasas, el diferencial de tasas entre el peso colombiano y el sol peruano se amplía, haciendo al PEN relativamente más atractivo para inversores que buscan carry en la región. Esto puede atraer flujos adicionales al sol en el margen.

Para empresas peruanas que comercian con Colombia, la leve depreciación del peso colombiano encarece las exportaciones peruanas hacia ese mercado y abarata las importaciones colombianas. El tipo de cambio PEN/COP es un indicador a monitorear para empresas con exposición bilateral.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l015',
    titulo: 'Chile: peso se fortalece a CLP 870/USD impulsado por cobre a US$ 5.22/lb — BCCh interviene vendiendo dólares para frenar apreciación',
    descripcion: 'El peso chileno se apreció a CLP 870 por dólar, su nivel más fuerte en 22 meses, beneficiado directamente por el precio del cobre en US$ 5.22/lb en el LME. El Banco Central de Chile (BCCh) intervino vendiendo US$ 320 millones en la sesión del martes para moderar la velocidad de apreciación y evitar daños a la competitividad de exportadores no cobre.',
    contenido: `El peso chileno (CLP) cotizó a CLP 870 por dólar en la sesión del martes 26 de mayo, su nivel más apreciado desde julio de 2024 y un movimiento de 6.2% desde el máximo reciente de CLP 927 registrado a principios de mayo. La apreciación refleja directamente el rally del cobre, del que Chile es el mayor productor mundial con el 27% de la oferta global.

La mecánica de transmisión es directa: cuando el precio del cobre sube, las exportaciones chilenas generan más dólares, las empresas mineras deben convertir parte de sus ingresos a pesos para pagar costos locales, y el mayor flujo de divisas entrantes aprecia el peso chileno. Con el cobre en US$ 5.22/lb —su nivel más alto en 26 meses— el efecto apreciador es especialmente potente.

El Banco Central de Chile intervino en el mercado cambiario vendiendo US$ 320 millones en la sesión del martes, la mayor intervención diaria desde el programa de estabilización de 2022. El BCCh aclaró que la intervención busca "moderar la volatilidad del tipo de cambio" y no establecer un nivel objetivo. En un comunicado publicado a las 14:30 hora local, el banco señaló que el tipo de cambio "refleja fundamentos macroeconómicos, pero que la velocidad del movimiento puede generar distorsiones en sectores distintos a la minería".

Los exportadores de salmón, vino, uvas de mesa y maquinaria usada expresaron preocupación: con el peso en CLP 870, sus márgenes en pesos se comprimen significativamente respecto a los presupuestos elaborados a CLP 920-940 a principios de año.`,
    analisis: `El caso chileno es un espejo del peruano: ambos países son grandes exportadores de cobre y ambos ven sus monedas apreciarse cuando el metal sube. La diferencia es que Chile tiene mayor concentración en cobre (27% de sus exportaciones) versus Perú (47%), por lo que el efecto es aún más pronunciado en el CLP.

Para el mercado peruano, la apreciación del CLP es una señal de validación: si el peso chileno sube por el cobre, la apreciación del sol peruano tiene la misma lógica fundamental. Esto da mayor convicción a quienes anticipan que el PEN podría alcanzar S/ 3.60 o menos en los próximos meses si el cobre se mantiene sobre US$ 5/lb.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },

  {
    id: 'k001',
    titulo: 'Acuerdo verbal Iran-EE.UU. hunde el WTI a US$ 79 — solape geopolítico presiona el dólar y apuntala el sol peruano',
    descripcion: 'El precio del petróleo WTI cayó 5.4% hasta US$ 79/barril tras el anuncio de un marco verbal de paz entre Iran y EE.UU. mediado por Omán. El DXY retrocedió a 100.2 y el sol peruano se fortaleció a S/ 3.65, mientras los mercados de energía recalibran el riesgo de oferta en el Golfo Pérsico.',
    contenido: `El domingo 25 de mayo, el presidente Donald Trump anunció en redes sociales que Iran y EE.UU. habían alcanzado un "principio de acuerdo de paz" mediado por el Sultanato de Omán. Si bien los detalles del tratado no han sido confirmados oficialmente por Teherán, el impacto en los mercados de materias primas fue inmediato y contundente: el crudo WTI abrió la sesión del lunes en fuerte baja, cayendo desde US$ 83.5 hasta US$ 79.0, su nivel más bajo en seis semanas.

El impacto se explica por varios mecanismos. Primero, un eventual levantamiento de sanciones a Iran liberaría un estimado de 1.2-1.5 millones de barriles diarios de crudo iraní al mercado global, que actualmente opera con capacidad ociosa represada. Segundo, la reducción del riesgo de cierre del Estrecho de Ormuz — por donde transita el 21% del comercio mundial de petróleo — elimina una prima geopolítica que los futuros habían incorporado desde enero.

El Banco de la Reserva Federal respondió con cautela. El presidente Kevin Warsh declaró que "una caída sostenida en el petróleo alivia las presiones inflacionarias", pero advirtió que el acuerdo debe formalizarse para cambiar el escenario base de la política monetaria. Los futuros de Fed Funds incorporaron un 52% de probabilidad de recorte en septiembre.

Para los mercados cambiarios, el impacto más notable fue la debilidad del DXY, que cayó a 100.2. El dólar tiende a debilitarse cuando bajan los precios del petróleo porque se reduce la demanda de dólares para transacciones energéticas denominadas en esa moneda. El sol peruano se apreció hasta S/ 3.65, su nivel más fuerte en seis semanas.`,
    analisis: `La caída del WTI a US$ 79 y el DXY a 100.2 son favorables para el sol peruano por dos vías: menor costo de importaciones de combustible para Perú y mayor debilidad del dólar global. Si el acuerdo Iran-EE.UU. se formaliza, el WTI podría caer hasta US$ 72-75, lo que consolidaría una apreciación del sol hacia S/ 3.60-3.62.

Para empresas importadoras de energía o derivados del petróleo, este es un momento para evaluar coberturas al tipo de cambio actual antes de que el mercado procese completamente las implicaciones del acuerdo. Para exportadores, el sol más fuerte reduce sus ingresos en soles, lo que hace relevante revisar contratos forward en la próxima semana.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/15970032/pexels-photo-15970032.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k002',
    titulo: 'Exportaciones peruanas crecen 37.8% en Q1 2026 y generan superávit comercial de US$ 12,867 millones — cifra récord histórico',
    descripcion: 'Las exportaciones totales del Perú alcanzaron US$ 21,340 millones en el primer trimestre de 2026, un crecimiento de 37.8% frente al Q1 2025, según datos del MINCETUR. El superávit comercial de US$ 12,867 millones es el mayor registrado en la historia del país y refuerza la posición del sol peruano como una de las monedas más sólidas de la región.',
    contenido: `El Ministerio de Comercio Exterior y Turismo (MINCETUR) publicó el reporte completo de comercio exterior del primer trimestre de 2026, revelando que las exportaciones totales alcanzaron US$ 21,340 millones, un crecimiento histórico de 37.8% interanual. El resultado supera en 12 puntos porcentuales las proyecciones iniciales del MEF y consolida a Perú como el exportador con mayor dinamismo de América del Sur en el período.

Las exportaciones tradicionales sumaron US$ 17,980 millones, con el sector minero-metálico como principal motor. El cobre generó ingresos de US$ 9,240 millones gracias a precios promedio de US$ 5.15/lb en el trimestre, el más alto sostenido de los últimos dos años. El oro aportó US$ 4,650 millones con precios promedio de US$ 3,290/oz. Las exportaciones de plata, zinc y plomo completaron el cuadro con US$ 2,180 millones adicionales.

Las exportaciones no tradicionales alcanzaron US$ 3,360 millones, con el sector agroexportador liderando con US$ 1,840 millones. La uva de mesa, la palta Hass y el espárrago fresco registraron records históricos individuales. El sector pesquero no tradicional aportó US$ 640 millones, mientras que textiles y confecciones alcanzaron US$ 480 millones gracias a la reducción arancelaria del TLC con EE.UU.

El superávit de balanza comercial de US$ 12,867 millones en el trimestre es el mayor de la historia peruana, duplicando el récord anterior. Este volumen de divisas que ingresa al país sostiene las reservas internacionales del BCRP en US$ 78,900 millones y es el fundamento estructural más sólido para la apreciación del sol peruano frente al dólar.`,
    analisis: `Un superávit comercial de US$ 12,867 millones en un solo trimestre implica que Perú está generando casi US$ 143 millones diarios de divisas netas que eventualmente se convierten a soles para pagar trabajadores, impuestos y proveedores locales. Esta es la razón estructural por la que el sol se aprecia y por la que el BCRP tiene que intervenir comprando dólares para evitar una apreciación excesiva.

Para importadores, el entorno de sol fuerte que se prevé durante al menos el segundo trimestre representa una ventana para abaratar costos de importación. Para exportadores no mineros, es el momento de revisar sus coberturas cambiarias y proteger márgenes en soles ante una posible apreciación adicional hacia S/ 3.55-3.60.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k003',
    titulo: 'BCRP: sol peruano se aprecia a S/ 3.65 en la apertura del lunes — banco central interviene con compras de dólares para suavizar movimiento',
    descripcion: 'El sol peruano abrió la sesión del lunes apreciándose a S/ 3.65, impulsado por la debilidad global del dólar tras el anuncio del acuerdo Iran-EE.UU. El BCRP intervino en el mercado cambiario comprando US$ 240 millones para evitar una volatilidad excesiva, manteniendo la tasa de referencia en 4.75% anual.',
    contenido: `El sol peruano (PEN) abrió la sesión del lunes 25 de mayo en S/ 3.65 por dólar, apreciándose 0.8% frente al cierre del viernes de S/ 3.68. La fortaleza de la moneda peruana responde directamente a la debilidad del índice DXY, que retrocedió a 100.2 tras el anuncio del acuerdo verbal Iran-EE.UU., y al sostenido ingreso de divisas por el boom exportador del sector minero.

El Banco Central de Reserva del Perú (BCRP) intervino en el mercado cambiario durante la mañana del lunes, comprando US$ 240 millones para suavizar la velocidad de apreciación. Esta operación, conocida como intervención esterilizada, tiene como objetivo evitar que movimientos bruscos del tipo de cambio afecten la competitividad de exportadores no tradicionales y la planificación financiera de empresas con deuda en soles pero ingresos en dólares.

El gerente de Operaciones Monetarias del BCRP, Jorge Estrella, señaló que "la tendencia apreciadora del sol refleja los sólidos fundamentos macroeconómicos del Perú", pero aclaró que el banco central "monitorea con atención la velocidad del movimiento". La tasa de referencia se mantiene en 4.75% anual, sin señales de cambio en la próxima reunión del directorio del 12 de junio.

Las reservas internacionales del BCRP alcanzaron US$ 78,900 millones tras la compra del lunes, manteniendo a Perú con el ratio reservas/PBI más alto de la región después de Bolivia. Este colchón protege al país ante eventuales reversiones de flujos de capital.`,
    analisis: `El nivel de S/ 3.65 es el punto de equilibrio actual entre los fundamentos (superávit comercial, solidez fiscal) y las intervenciones del BCRP. A medida que el acuerdo Iran-EE.UU. se consolide y el WTI siga cayendo, el sol podría apreciarse hasta S/ 3.58-3.62 en las próximas dos a tres semanas.

Para personas y empresas que necesitan dólares en el corto plazo (viajes, importaciones, deuda en USD), el nivel actual de S/ 3.65 es más conveniente que el de tres meses atrás cuando el dólar superaba S/ 3.80. Sin embargo, la intervención del BCRP pone un freno implícito que hace poco probable que el sol se aprecie más allá de S/ 3.55 en el corto plazo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/20934324/pexels-photo-20934324.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k004',
    titulo: 'MEF eleva proyección de crecimiento al 3.8% para 2026 — inversión minera y boom exportador como motores del ajuste al alza',
    descripcion: 'El Ministerio de Economía y Finanzas revisó al alza su estimado de crecimiento del PBI para 2026 desde 3.4% hasta 3.8%, sustentado en el dinamismo exportador del primer trimestre y el aumento de la inversión privada minera. Es la tercera revisión al alza consecutiva del año.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó el lunes la tercera actualización del Marco Macroeconómico Multianual 2026-2028, elevando la proyección de crecimiento del PBI para 2026 desde 3.4% hasta 3.8%. El ajuste responde al excepcional desempeño del primer trimestre, que registró un crecimiento de 4.2%, por encima del 3.8% estimado en la revisión de marzo.

El ministro de Economía, José Arista, explicó que los tres motores del crecimiento revisado son: el boom exportador minero-metálico con un superávit de US$ 12,867 millones en el Q1 2026, el incremento de la inversión privada en proyectos de gran minería que alcanzó US$ 2,890 millones en el trimestre, y la recuperación del consumo privado doméstico que creció 3.7% en el período enero-marzo. El ministro destacó que este desempeño coloca al Perú como el segundo país de mayor crecimiento en América del Sur después de Guyana.

La proyección de inflación para 2026 se redujo ligeramente desde 2.3% hasta 2.1%, beneficiada por la caída del precio del petróleo. El MEF mantiene su estimado de déficit fiscal en 2.7% del PBI, por debajo del 2.8% previo, gracias al incremento de la recaudación del Impuesto a la Renta minero y la reducción del pago de subsidios energéticos ante los menores precios del petróleo.

La deuda pública se estabiliza en 32.8% del PBI, confirmando a Perú como uno de los dos países de la región con deuda soberana por debajo del 35% del PBI. Moody's confirmó la semana pasada la perspectiva "estable" del rating Baa1 del país, contrastando con las rebajas sufridas por México y Colombia en el período.`,
    analisis: `Un crecimiento proyectado de 3.8% con baja deuda, superávit comercial y perspectiva estable de Moody's convierte al sol peruano en uno de los activos de moneda emergente más atractivos de la región. La combinación de fundamentos sólidos y tasas de interés positivas en términos reales explica el interés de inversores institucionales por activos denominados en PEN.

En términos prácticos, este contexto macroeconómico sólido reduce la probabilidad de una depreciación brusca del sol ante shocks externos moderados. Para planificadores financieros y empresas con flujos en múltiples monedas, mantener una exposición al sol calculada es razonable en el horizonte del segundo semestre de 2026.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k005',
    titulo: 'Cobre cierra en US$ 5.18/lb y oro en US$ 3,340/oz en la semana — ingresos mineros peruanos acumulan US$ 13,890 millones en 2026',
    descripcion: 'El cobre cotizó en US$ 5.18/lb al cierre del viernes en la LME, acumulando una ganancia del 4.2% en mayo. El oro cerró en US$ 3,340/oz, retrocediendo levemente tras el anuncio del acuerdo verbal Iran-EE.UU. Los ingresos de divisas por exportaciones mineras peruanas ya acumulan US$ 13,890 millones en los primeros cuatro meses de 2026.',
    contenido: `El cobre en la London Metal Exchange (LME) cerró la semana en US$ 5.18/lb, su tercer cierre consecutivo por encima de US$ 5.00/lb. La solidez del precio responde a cuatro factores convergentes: la mejora del PMI manufacturero de China a 51.8 en mayo, la reducción de inventarios en los almacenes del LME que cayeron a 112,400 toneladas métricas (mínimo de tres años), la demanda acelerada para infraestructura de energías renovables en Europa y Asia, y la debilidad general del DXY que abarata las materias primas denominadas en dólares para compradores internacionales.

El oro cerró en US$ 3,340/oz, retrocediendo 2.1% desde el máximo intradía del viernes de US$ 3,411/oz. La corrección fue directamente atribuible al anuncio del acuerdo verbal Iran-EE.UU., que redujo el componente de refugio seguro que el metal precioso había incorporado desde las tensiones en el Estrecho de Ormuz en marzo. Sin embargo, el oro mantiene un avance del 8.4% en lo que va del año, sostenido por la debilidad estructural del DXY y las compras de bancos centrales asiáticos que acumulan 380 toneladas en el año.

Para Perú, el impacto de estos precios es directo y masivo. El cobre a US$ 5.18/lb genera US$ 330 millones adicionales por trimestre frente a una cotización base de US$ 4.00/lb en los supuestos del presupuesto nacional. Las empresas mineras reportan que cada dólar de alza en el precio del cobre equivale a US$ 1,800 millones adicionales en ingresos anuales para el país, distribuidos entre impuestos, regalías y reinversión.

Southern Copper, Antamina, Cerro Verde y Hudbay son los principales beneficiarios directos. El Ministerio de Energía y Minas estima que la recaudación del canon minero del presente año superará los S/ 12,000 millones, beneficiando directamente a los gobiernos regionales de Arequipa, Áncash, Tacna y Moquegua.`,
    analisis: `La combinación de cobre sobre US$ 5.00/lb y oro en US$ 3,340/oz representa el escenario de ingresos más favorable para el Perú en la última década. Cada semana que se sostienen estos precios equivale a US$ 250-300 millones adicionales en divisas que entran al país y se convierten parcialmente a soles, presionando al alza la moneda nacional.

Para el tipo de cambio PEN/USD, el contexto de precios metálicos altos es el principal ancla de la apreciación del sol. Mientras el cobre se mantenga por encima de US$ 4.80/lb, la probabilidad de que el sol supere S/ 3.85 de manera sostenida es baja. El riesgo principal es una corrección brusca en los precios metálicos por desaceleración de la demanda china, lo que justifica que exportadores no mineros mantengan coberturas cambiarias parciales.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29336321/pexels-photo-29336321.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k006',
    titulo: 'Sector agroexportador peruano suma US$ 2,180 millones en enero-mayo 2026 — palta Hass supera a Chile por primera vez como líder exportador a China',
    descripcion: 'El sector agroexportador del Perú acumuló US$ 2,180 millones en los primeros cinco meses de 2026, un crecimiento de 11.2% interanual según la Asociación de Exportadores (ADEX). La palta Hass peruana superó en volumen a Chile como principal proveedor del mercado chino por primera vez, consolidando una diversificación geográfica histórica.',
    contenido: `La Asociación de Exportadores (ADEX) presentó el lunes el balance acumulado de exportaciones agroalimentarias de enero a mayo de 2026, que alcanzaron US$ 2,180 millones, superando en US$ 218 millones el registro del mismo período de 2025. El crecimiento de 11.2% interanual consolida al sector agrícola como la segunda fuente de divisas no tradicionales del Perú, después del sector textil-confecciones.

El hito más destacado del período fue que la palta Hass peruana superó a Chile como principal exportador al mercado chino por primera vez en la historia. Perú exportó 48,200 toneladas métricas de palta Hass a China entre enero y mayo, contra las 41,500 toneladas de Chile en el mismo período. El avance se explica por la mayor productividad de los valles de La Libertad (Virú, Chao) y el acuerdo de acceso fitosanitario negociado con China en 2024 que amplió las regiones de origen autorizadas.

La uva de mesa lidera en valor con US$ 490 millones acumulados, beneficiada por campañas favorables en Ica y la ventana comercial extendida hacia Europa que generó precios de exportación 8% más altos que el año anterior. El espárrago fresco y conservado sumó US$ 320 millones, con España, EE.UU. y Países Bajos como principales compradores. Los arándanos peruanos alcanzaron US$ 280 millones, con Corea del Sur surgiendo como un nuevo mercado clave.

Los mercados de destino mostraron una diversificación positiva: EE.UU. (23%), China (19%), España (17%), Países Bajos (13%) y Corea del Sur (7%). Esta distribución reduce la dependencia de un solo mercado y fortalece la resiliencia del sector ante shocks geopolíticos.`,
    analisis: `El avance del sector agroexportador a US$ 2,180 millones en cinco meses, con la palta peruana liderando en China, demuestra que Perú está logrando diversificar su oferta exportadora más allá de los metales. Esta diversificación es importante para la estabilidad del sol a largo plazo: mientras la minería domina los flujos de divisas, el agro actúa como un amortiguador en períodos de corrección de precios metálicos.

Para el tipo de cambio, el impacto directo del boom agroexportador es un flujo adicional de US$ 400-500 millones anuales de divisas que se convierte a soles, contribuyendo modestamente pero de manera sostenida a la apreciación. Las empresas agroindustriales con ingresos en dólares y costos en soles se benefician del sol fuerte en términos de márgenes operativos al financiar sus operaciones locales.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k007',
    titulo: 'Fed mantiene tasa en 4.25%-4.50% — caída del petróleo por acuerdo Iran alivia presión inflacionaria y aumenta probabilidad de recorte en septiembre',
    descripcion: 'El presidente de la Reserva Federal, Kevin Warsh, declaró que la caída del WTI a US$ 79 "es un factor deflacionario bienvenido" que reduce el riesgo de segunda ronda inflacionaria. Los futuros de Fed Funds incorporaron un 52% de probabilidad de recorte en septiembre, desde el 38% del viernes.',
    contenido: `El presidente de la Reserva Federal, Kevin Warsh, quien asumió el cargo el 15 de mayo tras el retiro de Jerome Powell, realizó sus primeras declaraciones sobre política monetaria de alto impacto al reaccionar al anuncio del acuerdo verbal Iran-EE.UU. En una entrevista en Bloomberg Television, Warsh señaló que "una caída sostenida de US$ 5-8 por barril en el WTI equivale a una reducción de 0.3-0.5 puntos porcentuales en la inflación CPI de los próximos seis meses", calificándolo de "factor deflacionario bienvenido".

La tasa de los fondos federales se mantiene en el rango de 4.25%-4.50%, sin cambios desde la última reunión del FOMC del 6 de mayo. Sin embargo, el mercado de futuros reaccionó rápidamente al acuerdo Iran-EE.UU.: los contratos CME Fed Funds incorporaron un 52% de probabilidad de recorte de 25pb en la reunión del 16 de septiembre, frente al 38% del viernes y el 23% de hace dos semanas.

Warsh subrayó que la Fed "no opera sobre noticias de última hora sino sobre datos verificados" y que el FOMC necesitará confirmar que el acuerdo Iran-EE.UU. se materializa en precios de combustible domésticos antes de ajustar su proyección de inflación. El PCE core de abril, publicado la semana pasada, mostró una lectura de 2.6%, aún por encima del objetivo del 2% pero con tendencia descendente.

El rendimiento del bono del Tesoro a 10 años cayó 8 puntos básicos hasta 4.28% en la apertura del lunes, su nivel más bajo en cinco semanas. Este movimiento refleja que los mercados de renta fija están incorporando un escenario de recortes más temprano que lo previsto por el dot plot de marzo.`,
    analisis: `La reacción de los bonos del Tesoro americano es una señal importante para los mercados emergentes: cuando los yields caen, los flujos de capital tienden a moverse desde activos de refugio hacia emergentes en busca de mayor rendimiento, lo que favorece divisas como el sol peruano. Si los yields siguen cayendo hacia 4.10-4.20%, el diferencial de tasas con el BCRP (4.75%) se amplía y el carry trade favorece al PEN.

Para Perú, un recorte de la Fed en septiembre, si se materializa, abre espacio para que el BCRP también recorte en el Q4 2026 sin comprometer el diferencial de tasas. El escenario de recortes sincronizados es benigno para la economía peruana: reduce el costo del crédito en dólares para empresas con deuda externa y no genera presión sobre el tipo de cambio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/534229/pexels-photo-534229.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k008',
    titulo: 'PMI manufactura China sube a 51.8 en mayo — demanda de cobre para energías renovables impulsa importaciones al máximo de tres años',
    descripcion: 'El índice PMI manufacturero de China subió a 51.8 en mayo desde 50.4 en abril, el nivel más alto desde enero de 2024. Las importaciones de cobre chinas alcanzaron 580,000 toneladas métricas en el mes, el mayor volumen en tres años, impulsadas por la aceleración del programa de energías renovables del plan quinquenal 2026-2030.',
    contenido: `La Oficina Nacional de Estadísticas de China publicó el PMI manufacturero de mayo, que subió a 51.8 desde 50.4 en abril, superando ampliamente la estimación del consenso de Bloomberg de 50.9. El índice se mantiene por encima del umbral de expansión (50) por cuarto mes consecutivo y alcanza su nivel más alto desde enero de 2024, señalando que la manufactura china recuperó el impulso tras el enfriamiento del primer trimestre.

El subíndice de nuevos pedidos fue el de mayor avance, subiendo a 53.4, indicando que la demanda interna y los pedidos de exportación se aceleraron simultáneamente. El subíndice de empleo subió a 50.1, cruzando el umbral de expansión por primera vez en ocho meses, señalando que las fábricas están comenzando a contratar nuevamente.

El impacto en los mercados de materias primas fue inmediato. Las importaciones de cobre de China en mayo alcanzaron 580,000 toneladas métricas, el mayor volumen mensual en tres años. El aumento responde principalmente a la aceleración del programa de energías renovables del 15.° Plan Quinquenal (2026-2030): China planea instalar 450 gigavatios de energía solar y 200 gigavatios de energía eólica en el período, lo que requiere cobre para cables, transformadores y estaciones de carga eléctrica.

Goldman Sachs elevó su proyección del precio del cobre para el tercer trimestre de 2026 desde US$ 5.00/lb hasta US$ 5.40/lb, citando la demanda china como principal catalizador. Citibank y JPMorgan Chase coincidieron en proyecciones similares, aunque con mayor cautela sobre los riesgos de sobreoferta proveniente de nuevos proyectos en Chile y la República Democrática del Congo.`,
    analisis: `Un PMI manufacturero chino en 51.8 con importaciones de cobre en máximos de tres años es la mejor noticia posible para Perú, que es el segundo productor mundial de cobre. Cada incremento de 0.1 en el PMI chino se correlaciona históricamente con un alza de US$ 0.04-0.06/lb en el precio del metal, lo que implica ingresos adicionales para el fisco peruano.

Si la demanda china de cobre se mantiene en los niveles de mayo, el precio del metal podría mantenerse por encima de US$ 5.00/lb durante todo el segundo semestre de 2026, sosteniendo el superávit comercial peruano y el sol fuerte. El principal riesgo es un enfriamiento del crédito inmobiliario chino, que históricamente ha generado correcciones abruptas en el cobre, pero por ahora el ciclo manufactura-renovables es el driver dominante.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k009',
    titulo: 'Oro retrocede a US$ 3,340/oz tras acuerdo Iran-EE.UU. — bancos centrales asiáticos mantienen compras; analistas ven soporte en US$ 3,280',
    descripcion: 'El precio del oro cayó 2.1% hasta US$ 3,340/oz al cierre del viernes tras el anuncio del acuerdo verbal Iran-EE.UU. que redujo la prima de riesgo geopolítico. Sin embargo, los bancos centrales de China, India y Turquía mantienen sus programas de compras, lo que establece un soporte técnico en torno a US$ 3,280/oz según los analistas de Goldman Sachs.',
    contenido: `El precio del oro en el mercado spot cerró el viernes en US$ 3,340 por onza, retrocediendo 2.1% desde el máximo intradía de US$ 3,411/oz registrado en la mañana. La corrección se produjo en las últimas dos horas de la sesión neoyorquina, tras las declaraciones del enviado especial de EE.UU. a Omán confirmando que "existe un marco básico de entendimiento" con Irán.

La caída del oro por el acuerdo geopolítico es técnicamente esperada: el metal amarillo había incorporado una prima de riesgo estimada en US$ 80-120/oz desde las tensiones en el Estrecho de Ormuz de marzo. La normalización del riesgo geopolítico tiende a aliviar esa prima, aunque raramente la elimina por completo dado que los factores de largo plazo (debilidad del dólar, compras de bancos centrales, demanda de cobertura anti-inflación) permanecen intactos.

Los bancos centrales asiáticos son el factor de soporte más robusto para el oro en 2026. China reportó compras de 28 toneladas métricas en abril, India de 19 toneladas y Turquía de 14 toneladas. El total acumulado de compras de bancos centrales en el año alcanza 380 toneladas, en camino a superar el récord histórico de 1,082 toneladas de 2022. Esta demanda estructural actúa como un comprador de último recurso que absorbe las correcciones.

Goldman Sachs estableció en su nota del lunes un soporte técnico en US$ 3,280/oz y mantuvo su objetivo de precio para fin de año en US$ 3,600/oz, argumentando que "el acuerdo Iran-EE.UU. resuelve un factor temporal pero no cambia el régimen de fondo: dólar débil, déficit fiscal global elevado y diversificación de reservas alejándose del USD".`,
    analisis: `La corrección del oro a US$ 3,340/oz no altera el escenario positivo para Perú a mediano plazo. Las exportaciones de oro peruanas son más sensibles al precio promedio mensual que a los movimientos diarios, y el promedio de mayo (alrededor de US$ 3,360-3,380/oz) sigue siendo excepcionalmente alto desde una perspectiva histórica.

El nivel de soporte en US$ 3,280/oz identificado por Goldman Sachs es relevante para que el sector minero peruano calibre sus ingresos del Q2 2026. Si el oro se mantiene por encima de US$ 3,200/oz hasta junio, los ingresos del sector minero superarán las proyecciones del MEF para el semestre, lo que podría derivar en una nueva revisión al alza del crecimiento del PBI.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k010',
    titulo: 'PEN/USD análisis técnico: sol perfora soporte S/ 3.65 — RSI en 38 señala continuación de apreciación hacia S/ 3.58 en el corto plazo',
    descripcion: 'El cruce PEN/USD perforó el soporte técnico de S/ 3.65 en la apertura del lunes, con el RSI semanal en 38 indicando que la moneda peruana no está en zona de sobrecompra. Los analistas de TradingView identifican soporte siguiente en S/ 3.58 y resistencia en S/ 3.72, con sesgo bajista para el dólar en el par.',
    contenido: `El cruce PEN/USD cotiza en S/ 3.6490 en la apertura del lunes 25 de mayo, perforando por primera vez en seis semanas el nivel de soporte de S/ 3.65 que había actuado como piso del rango de cotización desde mediados de abril. El movimiento se produjo en la apertura de la sesión, coincidiendo con la debilidad generalizada del dólar (DXY a 100.2) por el impacto del acuerdo verbal Iran-EE.UU.

Desde el punto de vista del análisis técnico, el rompimiento de S/ 3.65 es significativo porque implica que el par PEN/USD ha salido del rango lateral de S/ 3.65-3.75 que mantuvo durante seis semanas. El siguiente soporte relevante se ubica en S/ 3.58, correspondiente al mínimo del 14 de febrero de 2026. Por debajo de ese nivel, el siguiente piso relevante está en S/ 3.52 (mínimo de octubre de 2024).

Los indicadores momentum confirman la tendencia apreciadora del sol: el RSI semanal se ubica en 38, lejos de la zona de sobrecompra (por debajo de 30, que indicaría que el sol está sobrecomprado frente al dólar), lo que sugiere que hay recorrido técnico adicional. El MACD diario acaba de producir un cruce bajista (para el dólar), lo que los analistas interpretan como confirmación del nuevo tramo de apreciación.

Las bandas de Bollinger semanales muestran un estrechamiento consistente con un movimiento direccional inminente. El volumen de transacciones en el mercado cambiario peruano fue de US$ 1,240 millones en la sesión del viernes, el más alto en tres semanas, lo que da validez técnica a la perforación del soporte.`,
    analisis: `Desde una perspectiva de análisis técnico, el rompimiento de S/ 3.65 con volumen elevado y RSI no-sobrecomprado sugiere que el sol tiene espacio para apreciarse hacia S/ 3.58-3.60 en las próximas dos semanas, siempre que el DXY se mantenga por debajo de 101.5 y el acuerdo Iran-EE.UU. no se deshaga.

Para operadores de tipo de cambio y tesoreros corporativos, este es un momento de tomar decisiones: quienes necesitan dólares en los próximos 30 días podrían beneficiarse comprando ahora si creen que la apreciación continuará; quienes tienen dólares para vender podrían esperar a que el rebote técnico los lleve nuevamente a S/ 3.68-3.72. El nivel de S/ 3.58 es el próximo hito a monitorear.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31738798/pexels-photo-31738798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k011',
    titulo: 'WTI a US$ 79/barril: acuerdo Iran-EE.UU. produce mayor caída semanal del crudo desde noviembre 2023 — Brent en US$ 82.5',
    descripcion: 'El crudo WTI cayó a US$ 79 por barril en la apertura del lunes, su nivel más bajo desde el 14 de abril. La caída de 5.4% en la sesión es la mayor desde noviembre de 2023 para un día individual. El Brent europeo retrocedió a US$ 82.5, mientras los futuros de gasolina RBOB cayeron 4.8% en el NYMEX.',
    contenido: `El crudo WTI (West Texas Intermediate) para entrega en julio abrió el lunes en US$ 79.00 por barril en el NYMEX, cayendo US$ 4.50 (-5.4%) desde el cierre del viernes de US$ 83.50. Es la mayor caída en un solo día para el WTI desde el 13 de noviembre de 2023, cuando Arabia Saudita anunció una prórroga de los recortes de producción de la OPEP+ que había sorprendido al mercado en dirección contraria.

El detonante es el anuncio del acuerdo verbal Iran-EE.UU.: los mercados de crudo descuentan que un eventual levantamiento de sanciones permitiría a Iran incrementar su producción desde los actuales 3.2 millones de barriles diarios hasta los 4.0-4.5 mb/d que el país puede alcanzar en 12-18 meses con inversión en infraestructura. Esto agregaría entre 0.8 y 1.3 mb/d al mercado, un volumen significativo para un mercado que actualmente opera con un déficit estimado de apenas 0.4 mb/d.

Arabia Saudita y los Emiratos Árabes respondieron con declaraciones de cautela: el ministro de Energía saudí, Príncipe Abdulaziz bin Salman, declaró que "la OPEP+ evaluará cualquier cambio en la oferta iraní antes de ajustar su propia producción", señalando que el cartel podría compensar el aumento iraní con una reducción voluntaria de sus miembros del Golfo para defender un precio mínimo de US$ 75/barril.

El Brent europeo cayó a US$ 82.5 y los futuros de gasolina RBOB descendieron 4.8%, lo que impactará positivamente en los precios de combustibles domésticos en EE.UU. en las próximas dos semanas. La Administración de Información Energética de EE.UU. (EIA) estimó que si el WTI se mantiene en US$ 78-82, el precio promedio de la gasolina al consumidor podría bajar US$ 0.12-0.18 por galón.`,
    analisis: `La caída del WTI a US$ 79 tiene un impacto inmediato y positivo para Perú como importador neto de combustibles refinados. El país importa aproximadamente 150,000 barriles diarios de derivados del petróleo para cubrir la demanda interna. Cada US$ 5 de caída en el WTI equivale a un ahorro estimado de US$ 270 millones anuales en la factura de importaciones.

Este ahorro en importaciones reduce el déficit de cuenta corriente del país y contribuye marginalmente a la apreciación del sol al disminuir la demanda de dólares para pagar combustibles. Además, la caída del petróleo reduce las presiones inflacionarias de transporte y energía, dando más espacio al BCRP para mantener o incluso reducir tasas. Para el tipo de cambio, el escenario de petróleo bajo es neto positivo para el PEN.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k012',
    titulo: 'Bitcoin sube a US$ 94,500 — tercer día consecutivo al alza desde soporte US$ 89,000 en medio del rally de activos de riesgo por acuerdo Iran',
    descripcion: 'Bitcoin alcanzó US$ 94,500 en la apertura del lunes, su nivel más alto desde el 5 de mayo, completando un tercer día consecutivo de alzas desde el soporte de US$ 89,000. El rally está correlacionado con el appetite por activos de riesgo globales impulsado por el acuerdo verbal Iran-EE.UU. y la caída del DXY a 100.2.',
    contenido: `Bitcoin (BTC/USD) cotiza en US$ 94,500 en la apertura del lunes 25 de mayo, avanzando 3.2% en 24 horas y completando un tercer día consecutivo de ganancias desde el soporte técnico de US$ 89,000 que había contenido la corrección iniciada el 18 de mayo. El movimiento se produce en el marco de un rally generalizado de activos de riesgo impulsado por el acuerdo verbal Iran-EE.UU. y la subsiguiente caída del DXY.

La correlación entre Bitcoin y el DXY se ha fortalecido en 2026: cuando el dólar se debilita, Bitcoin tiende a subir porque se abarata para compradores fuera de EE.UU. y porque la caída del dólar generalmente coincide con un aumento del apetito por activos especulativos de mayor riesgo. Con el DXY en 100.2, el par BTC/USD tiene un viento favorable técnico adicional.

Desde el punto de vista de los flujos, los ETFs de Bitcoin al contado en EE.UU. registraron entradas netas de US$ 480 millones en los tres primeros días de la semana pasada, revirtiendo los flujos negativos de la semana anterior. BlackRock iShares Bitcoin Trust (IBIT) lideró con US$ 210 millones de entradas, seguido de Fidelity Wise Origin Bitcoin Fund con US$ 140 millones. Esta demanda institucional provee el respaldo comprador que distingue este ciclo del rally de 2021.

El próximo nivel de resistencia técnica para BTC es US$ 96,800 (máximo del 5 de mayo) y luego el máximo histórico de US$ 109,000 alcanzado en enero de 2025. Los analistas de TradingView identifican el rango US$ 92,000-95,000 como zona de consolidación antes del siguiente impulso.`,
    analisis: `El rally de Bitcoin a US$ 94,500 coincide con el acuerdo Iran-EE.UU. porque ambos son manifestaciones del mismo fenómeno: reducción de riesgo sistémico y debilidad del dólar. Cuando el dólar cae, el Bitcoin —denominado en USD— tiende a subir en términos de poder adquisitivo global. Este patrón de correlación inversa con el DXY se ha consolidado en 2025-2026.

Para inversores peruanos con exposición a criptomonedas, la doble apreciación (BTC sube en USD y el sol se aprecia) amplifica los retornos en soles cuando Bitcoin sube. Sin embargo, la volatilidad del activo es sustancialmente mayor que la del tipo de cambio PEN/USD, por lo que la gestión de riesgo en cripto requiere horizontes de inversión más largos y posiciones dimensionadas cuidadosamente respecto al capital total.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7655117/pexels-photo-7655117.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k013',
    titulo: 'Argentina: inflación de mayo cae a 3.2% mensual — el nivel más bajo desde agosto de 2021 en el primer verano sin crisis del gobierno Milei',
    descripcion: 'El INDEC reportó una inflación mensual de 3.2% en mayo, el dato más bajo en casi cinco años y una confirmación de que el programa de ajuste fiscal de Javier Milei está logrando controlar los precios. El peso argentino cotiza en ARS 1,085/USD en el mercado oficial, con brecha cambiaria reducida al 7.8%.',
    contenido: `El Instituto Nacional de Estadística y Censos (INDEC) de Argentina publicó el lunes la variación del Índice de Precios al Consumidor (IPC) de mayo de 2026, que registró un incremento mensual de 3.2%. Es el nivel más bajo desde agosto de 2021, antes del ciclo inflacionario que llevó a la Argentina a una hiperinflación mensual del 25.5% en diciembre de 2023. La cifra consolida la desinflación más rápida documentada en América del Sur desde el Plan Cavallo de 1991.

El ministro de Economía de Argentina, Luis Caputo, calificó el dato de "hito histórico en el programa de estabilización" y señaló que la inflación anualizada cayó desde el 211% de diciembre de 2023 hasta el 58.4% actual, con perspectiva de cerrar 2026 en torno al 40%. La reducción del déficit fiscal primario a cero —alcanzada por primera vez desde 2008— es identificada como el factor estructural más relevante de la desinflación.

El peso argentino cotiza en ARS 1,085 por dólar en el mercado oficial del Banco Central de la República Argentina (BCRA), con la brecha cambiaria respecto al mercado informal reducida al 7.8%. Esta compresión de la brecha es considerada por los analistas del FMI como el indicador más confiable de la normalización del mercado cambiario. El país está cumpliendo las metas cuantitativas del acuerdo de US$ 44,000 millones con el FMI firmado en enero de 2026.

Sin embargo, los economistas independientes advierten que una inflación mensual del 3.2% equivale a una tasa anualizada del 46%, aún muy por encima de los promedios latinoamericanos. La transmisión de la desinflación a los salarios reales sigue siendo incompleta: los salarios en términos reales acumulan una caída del 22% desde el inicio del gobierno Milei en diciembre de 2023, generando tensión social que se reflejará en las elecciones legislativas de octubre.`,
    analisis: `La desinflación argentina es un hito positivo para la estabilidad del Mercosur y el apetito por activos latinoamericanos en general. Cuando Argentina logra estabilidad macroeconómica, reduce el contagio negativo que históricamente ha generado en los mercados de la región, incluyendo presión sobre el sol peruano en momentos de pánico regional.

Para el tipo de cambio peruano, el contexto de Argentina estabilizada es marginalmente positivo porque reduce el "riesgo región" percibido por inversores globales que asignan capital a América del Sur como bloque. En términos prácticos, la mejora argentina debería contribuir a mantener el diferencial de tasas entre bonos peruanos y americanos en niveles atractivos para el carry trade a favor del sol.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15574935/pexels-photo-15574935.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k014',
    titulo: 'Colombia a seis días de las elecciones presidenciales — peso COP en COP 3,780/USD ante incertidumbre política; candidatos disputan segunda vuelta',
    descripcion: 'A seis días de las elecciones presidenciales del 31 de mayo, el peso colombiano cotiza en COP 3,780 por dólar, con una volatilidad elevada por la incertidumbre política. Los candidatos Gustavo Bolívar y Federico Gutiérrez se disputarán la segunda vuelta, con las encuestas mostrando una diferencia menor al 3% según el promedio de Datexco y Invamer.',
    contenido: `Colombia se prepara para las elecciones presidenciales del domingo 31 de mayo con el mercado cambiario en estado de alerta: el peso colombiano (COP) cotiza en COP 3,780 por dólar, apreciándose levemente desde el máximo reciente de COP 3,850 registrado el 19 de mayo cuando las encuestas mostraron un repunte del candidato de izquierda. La diferencia entre los candidatos finalistas es tan estrecha que el mercado continúa incorporando una prima de incertidumbre política.

Los dos candidatos que disputarán la segunda vuelta son Gustavo Bolívar, del movimiento Colombia Humana (sucesor político de Gustavo Petro), y Federico Gutiérrez, exalcalde de Medellín y candidato de la coalición centro-derechista Gran Alianza Colombia. El promedio de encuestas de Datexco e Invamer muestra a Gutiérrez con 48.2% y a Bolívar con 45.8%, dentro del margen de error estadístico del ±3%.

El mercado financiero colombiano tiene preferencia declarada por Gutiérrez, cuyo programa económico plantea continuidad con la política de apertura al sector energético (petróleo y gas) y negociaciones con el FMI para refinanciar el crédito de reserva de US$ 9,800 millones. En contraste, el programa de Bolívar propone acelerar la "transición ecológica" que implicaría restricciones a nuevas licencias de exploración petrolera, lo que podría reducir los ingresos fiscales en un 15-20% en un escenario de implementación plena.

El banco central de Colombia (Banrep) convocó una reunión de emergencia el viernes para evaluar el uso de sus reservas de intervención cambiaria (US$ 59,000 millones) ante posibles flujos de salida de capital los días posteriores a la elección. El gerente Leonardo Villar declaró que "la institución tiene suficiente capacidad de intervención para preservar la estabilidad del mercado cambiario independientemente del resultado electoral".`,
    analisis: `La incertidumbre electoral colombiana tiene un impacto moderado pero real en los mercados emergentes de la región. Un triunfo de Bolívar podría generar un sell-off del COP de 3-5% en las primeras 48 horas post-elección, lo que a su vez podría generar presión regional sobre otras divisas latinoamericanas, incluyendo el sol peruano, aunque de manera atenuada dado que los fundamentos peruanos son distintos a los colombianos.

Para el tipo de cambio PEN/USD, la recomendación es monitorear los resultados electorales del 31 de mayo como un factor de riesgo regional de corto plazo. En caso de triunfo del candidato percibido como pro-mercado (Gutiérrez), el alivio en los activos latinoamericanos podría sumarse a la tendencia apreciadora del sol. En caso contrario, podría generar una reversión técnica puntual hacia S/ 3.70-3.72 antes de que el mercado vuelva a los fundamentales peruanos.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k015',
    titulo: 'Chile: peso alcanza CLP 895 por dólar — el nivel más fuerte desde febrero de 2023 impulsado por cobre en US$ 5.18 y debilidad global del USD',
    descripcion: 'El peso chileno se apreció a CLP 895 por dólar, su nivel más fuerte desde febrero de 2023, sincronizando con el sol peruano en un rally de divisas latinoamericanas asociadas a metales. El cobre en US$ 5.18/lb y el DXY en 100.2 son los dos catalizadores simultáneos del movimiento. El IPSA sube 1.8% en la semana.',
    contenido: `El peso chileno (CLP) se apreció hasta CLP 895 por dólar en la apertura del lunes, su nivel más fuerte desde el 17 de febrero de 2023. El movimiento de 1.6% en la sesión sincroniza con la apreciación del sol peruano a S/ 3.65 y el real brasileño a BRL 5.28, configurando un rally coordinado de divisas latinoamericanas exportadoras de materias primas en respuesta a la doble debilidad del DXY y la fortaleza del cobre.

Chile, como mayor productor mundial de cobre con el 27% de la oferta global, tiene la correlación más directa de cualquier moneda latinoamericana con el precio del metal. El modelo econométrico del Banco Central de Chile estima que por cada US$ 0.10/lb de incremento en el precio del cobre, el tipo de cambio USD/CLP se aprecia en promedio CLP 8-12. Con el cobre en US$ 5.18/lb (US$ 0.18 por encima del nivel de US$ 5.00 de hace dos semanas), el modelo predice una apreciación de CLP 14-22, lo que es consistente con el movimiento observado.

El Banco Central de Chile (BCCh) mantuvo su Tasa de Política Monetaria (TPM) en 5.00% en la última reunión. El gobernador, Rosanna Costa, señaló que "la fortaleza del tipo de cambio es un factor que modera la inflación importada, pero el consejo también atiende los efectos sobre la competitividad de los exportadores no cobre". La inflación chilena se redujo a 3.4% anual en abril, dentro del rango meta del banco central de 2%-4%.

El IPSA (Índice de Precio Selectivo de Acciones de la Bolsa de Santiago) subió 1.8% en la semana, liderado por las acciones de Codelco (el mayor productor de cobre del mundo, estatal) y Antofagasta PLC. La capitalización de mercado de las empresas mineras del IPSA subió US$ 4,200 millones en la semana, reflejando directamente el alza del cobre.`,
    analisis: `La apreciación simultánea del peso chileno a CLP 895 y del sol peruano a S/ 3.65 por el mismo catalizador (cobre alto + DXY débil) confirma que los fundamentos regionales son el driver dominante de las divisas andinas en este momento. Esta sincronía es positiva porque significa que el sol no está solo apreciándose por factores idiosincráticos peruanos, sino por un fenómeno más amplio que da mayor estabilidad al movimiento.

Para empresas peruanas con operaciones en Chile (o viceversa), el cruce CLP/PEN ha permanecido relativamente estable porque ambas monedas se mueven en paralelo frente al dólar. Lo relevante es el escenario de base: mientras el cobre se mantenga por encima de US$ 4.80/lb, tanto el sol como el peso chileno tienen viento de cola estructural frente al dólar estadounidense.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-25T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j001',
    titulo: "Plan fiscal de EE.UU. enfrenta resistencia en el Senado — DXY cae a 100.5 y mercados emergentes rally",
    descripcion: "El paquete fiscal de US$ 1.6 billones propuesto por el Senado encontró obstáculos entre senadores republicanos moderados que exigen recortes adicionales al gasto. El DXY retrocedió a 100.5 y las divisas emergentes se fortalecieron en bloque, con el sol peruano apreciándose a S/ 3.45.",
    contenido: `El paquete de ajuste fiscal que el Comité de Presupuesto del Senado de EE.UU. presentó el martes como respuesta a la rebaja de Moody's enfrentó su primera prueba política este viernes, cuando un grupo de seis senadores republicanos moderados rechazó los términos actuales del proyecto y exigió recortes adicionales al gasto discrecional. La sesión de votación, prevista para el jueves, fue postergada hasta la semana del 25 de mayo.

La incertidumbre generada por el impasse legislativo debilitó al dólar: el DXY cedió a 100.5 puntos, su nivel más bajo desde enero de 2026, y extendió el retroceso de 2.3% acumulado en la semana. El euro subió a 1.1380 por dólar, el yen japonés se apreció a 148.90 y la libra esterlina alcanzó 1.3420.

Los mercados emergentes se beneficiaron del clima de debilidad del dólar. El real brasileño avanzó 1.1% a 5.04 por dólar, el peso mexicano se fortaleció a 18.20 y el sol peruano cotizó en S/ 3.45, su nivel más bajo en tres meses. Los índices de renta variable emergentes subieron entre 0.8% y 1.4%. Los futuros del S&P 500 operaron con cautela, -0.3%, reflejando la preocupación fiscal.

El presidente de la Fed, Kevin Warsh, evitó comentar sobre el impasse del Congreso, pero en declaraciones publicadas por Bloomberg reiteró que la Fed tiene las herramientas necesarias para mantener la estabilidad si la confianza fiscal se deteriora, lo que algunos analistas interpretaron como un aval implícito a una postura acomodaticia.`,
    analisis: `La caída del DXY a 100.5 es estructuralmente positiva para el sol peruano. Un dólar más débil reduce la presión sobre los importadores y mejora la competitividad relativa de las empresas con costos en soles y facturación en dólares. El PEN/USD en S/ 3.45 representa el nivel de apreciación más pronunciado del año.

Para quienes gestionan exposición cambiaria: si tienes pagos en dólares programados para las próximas semanas, considera ejecutarlos ahora. La postergación del plan fiscal puede mantener el DXY en el rango 99-101.5 durante la semana del 25 de mayo, lo que podría llevar al sol a acercarse a S/ 3.40. Si el Senado aprueba el paquete, el rebote del dólar podría llevar el tipo de cambio de vuelta a S/ 3.50-3.55 rápidamente.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images\.pexels\.com/photos/12504957/pexels\-photo\-12504957\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j002',
    titulo: "Sol peruano toca S/ 3.45 — BCRP interviene con compras de US$ 120M para frenar apreciacion excesiva",
    descripcion: "El sol peruano alcanzó S/ 3.45 en la sesión intradía del viernes, máximo de tres meses, ante el debilitamiento global del dólar y el superávit comercial record del Perú. El BCRP intervino comprando US$ 120 millones para suavizar la volatilidad, sin resistir la tendencia apreciadora.",
    contenido: `El sol peruano cerró la semana cotizando en S/ 3.45 por dólar, acumulando una apreciación del 1.7% en cinco sesiones y alcanzando su nivel más bajo frente al dólar en tres meses. La fortaleza del PEN responde a una combinación de factores: el debilitamiento del DXY a 100.5, el superávit comercial récord de US$ 2,180 millones en abril, y la percepción de que los fundamentos macroeconómicos del Perú son sólidos frente a la incertidumbre fiscal de EE.UU.

El Banco Central de Reserva del Perú intervino en el mercado cambiario comprando US$ 120 millones entre el jueves y el viernes, buscando reducir la volatilidad intradiaria sin resistir la tendencia de apreciación. La intervención fue menor respecto a la semana anterior (US$ 180 millones) y refuerza la señal de que el BCRP no se opone al fortalecimiento gradual del sol si responde a fundamentos.

Los flujos de remesas también apoyaron al sol: el BCRP reportó que las remesas del exterior alcanzaron US$ 1,240 millones en el primer trimestre de 2026, un incremento del 8.3% respecto al mismo período del año anterior. Esta entrada orgánica de dólares que se convierte a soles alimenta la demanda de PEN en el mercado de cambios.

La mesa de cambios del sistema bancario reportó que la brecha compra-venta del dólar se redujo a S/ 0.03, reflejando mayor liquidez en el mercado. El volumen transado en la sesión del viernes superó los US$ 650 millones, por encima del promedio diario de US$ 480 millones de la semana.`,
    analisis: `Un sol en S/ 3.45 con intervención limitada del BCRP es una señal positiva: el banco central valida que el nivel actual responde a fundamentos, no a especulación. Para empresas con ingresos en dólares (exportadores, mineras, agroexportadoras), este nivel reduce el valor en soles de sus ventas, lo que puede afectar márgenes si los costos están en soles.

Para importadores y deudores en dólares, S/ 3.45 es una oportunidad para adelantar compras de divisas. El consenso del mercado sugiere que el sol podría estabilizarse en el rango S/ 3.42-3.52 en las próximas dos semanas, con el punto de equilibrio alrededor de S/ 3.48 si el Senado de EE.UU. avanza en su plan fiscal. Aconsejamos establecer órdenes de compra de dólares por encima de S/ 3.50 para aprovechar cualquier rebote del dólar.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images\.pexels\.com/photos/29027606/pexels\-photo\-29027606\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j003',
    titulo: "Inversion minera en Peru alcanza US$ 2,400M en enero-abril — Quellaveco Fase 2 y San Gabriel lideran el gasto de capital",
    descripcion: "El Ministerio de Energía y Minas reportó que la inversión del sector minero alcanzó US$ 2,400 millones en los primeros cuatro meses de 2026, un crecimiento del 18.5% interanual. Los proyectos Quellaveco Fase 2, San Gabriel y Toromocho Ampliación lideran el gasto de capital del sector.",
    contenido: `El Ministerio de Energía y Minas (MEM) publicó el informe mensual de inversión minera, revelando que el sector acumuló US$ 2,400 millones en compromisos de capital ejecutados entre enero y abril de 2026. El dato representa un crecimiento del 18.5% respecto al mismo período de 2025 y marca el cuarto año consecutivo de expansión de la inversión minera en el Perú.

Quellaveco Fase 2, operado por Anglo American, aportó US$ 620 millones en gasto de capital en el período, principalmente en expansión de la planta concentradora y ampliación del tajo norte. Se estima que la fase 2 elevará la producción de cobre de Quellaveco desde las actuales 310,000 toneladas anuales hasta 390,000 toneladas al año en 2028. El proyecto San Gabriel de Buenaventura invirtió US$ 340 millones, avanzando al 78% de la construcción de su planta de procesamiento de plata y oro en Moquegua.

Toromocho Ampliación, de Chinalco, ejecutó US$ 280 millones en el período, con obras de ampliación de la relavera y mejora del circuito de flotación. La ampliación busca incrementar la capacidad de procesamiento de 117,000 a 145,000 toneladas de cobre al año. Otros proyectos como Inmaculada de Hochschild y Corani de Bear Creek aportaron US$ 160 millones adicionales.

El MEM destacó que el pipeline de inversión minera para el resto de 2026 asciende a US$ 4,200 millones, incluyendo las primeras obras de acceso para el megaproyecto Tía María en Arequipa, que ingresará a su fase de construcción formal tras obtener la licencia social a fines de 2025.`,
    analisis: `La expansión de la inversión minera tiene un impacto directo y positivo sobre el sol peruano. Cada dólar invertido por una minera en el Perú se convierte en soles para pagar proveedores locales, planillas, impuestos y servicios. Un flujo de US$ 2,400 millones en cuatro meses implica una demanda orgánica sostenida de soles en el mercado cambiario, que actúa como soporte estructural para la apreciación del PEN.

Para el sector financiero y empresarial, el pipeline de US$ 4,200 millones para el segundo semestre es una señal de que la presión apreciadora del sol podría intensificarse. Si Tía María avanza sin contratiempos, el efecto multiplicador en la región sur del Perú generará demanda adicional de soles que el mercado aún no ha descontado completamente.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/5505961/pexels\-photo\-5505961\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j004',
    titulo: "Agroexportaciones peruanas superan US$ 2,100M en enero-abril — arandanos y paltas consolidan liderazgo en mercados europeos",
    descripcion: "Las exportaciones agrícolas no tradicionales del Perú alcanzaron US$ 2,100 millones entre enero y abril de 2026, un crecimiento del 14.8% interanual. Los arándanos lideraron con US$ 680 millones, seguidos de las paltas con US$ 520 millones. La Unión Europea y el Reino Unido son los principales destinos.",
    contenido: `La Asociación de Exportadores (ADEX) presentó el informe trimestral de agroexportaciones, confirmando que el sector alcanzó US$ 2,100 millones en los primeros cuatro meses del año, consolidando al Perú como el segundo exportador mundial de arándanos frescos y el primer proveedor de paltas para la Unión Europea.

Los arándanos frescos generaron US$ 680 millones en el período, con una campaña exportadora que adelantó sus picos por la demanda anticipada de supermercados europeos. Los principales destinos fueron los Países Bajos (US$ 220 millones), el Reino Unido (US$ 180 millones) y España (US$ 95 millones). Los precios promedio FOB se ubicaron en US$ 3.80/kg, 12% por encima del año anterior.

Las paltas Hass aportaron US$ 520 millones, con envíos creciendo 22% respecto a 2025. La demanda europea de paltas peruanas beneficia de la reducción de la oferta mexicana, afectada por lluvias en Michoacán durante el primer trimestre. El espárrago, con US$ 280 millones, y los arándanos procesados IQF, con US$ 195 millones, completaron los principales rubros.

El presidente de ADEX, Julio Pérez-Alva, señaló que el TLC Perú-UE y los sistemas de certificación GlobalGAP han sido determinantes para el acceso preferencial a mercados premium europeos, donde los productos peruanos compiten con márgenes superiores al promedio regional.`,
    analisis: `Las agroexportaciones son el segundo motor de ingreso de divisas del Perú, después de la minería. Un crecimiento del 14.8% en el valor exportado implica US$ 273 millones adicionales en ingresos de dólares para el país en comparación con el año anterior. Estos dólares, al convertirse a soles para pagar costos locales, refuerzan la tendencia de apreciación del PEN.

Para empresas agroexportadoras que facturan en dólares y tienen costos en soles, el nivel de S/ 3.45 recorta sus márgenes en términos de moneda local. Evaluar coberturas de tipo de cambio para las próximas campañas de exportación, especialmente la de paltas julio-septiembre, es recomendable si la tendencia apreciadora del sol continúa.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/13277183/pexels\-photo\-13277183\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j005',
    titulo: "MEF presenta nuevo marco de APPs: S/ 3,800M en infraestructura de transporte a licitarse en el tercer trimestre de 2026",
    descripcion: "El Ministerio de Economía y Finanzas lanzó el Programa de Asociaciones Público-Privadas para el segundo semestre, con S/ 3,800 millones en proyectos de carreteras, ferrovías y puertos a adjudicarse entre julio y setiembre. El programa busca acelerar el cierre de brechas en infraestructura para sostener el crecimiento del PBI.",
    contenido: `El Ministerio de Economía y Finanzas (MEF), a través de ProInversión, presentó el Portafolio de Proyectos APP 2026-II, que incluye 14 proyectos de infraestructura por un valor total de S/ 3,800 millones en compromisos de inversión privada. El portafolio será licitado en tres convocatorias entre julio y setiembre de 2026, con adjudicaciones previstas para antes del cierre del año.

Los proyectos de mayor envergadura incluyen la Autopista Eje Vial Norte Lima-Huacho-Barranca, con una inversión de S/ 980 millones y una concesión de 30 años; la modernización del Puerto General San Martín en Pisco (S/ 640 millones), que ampliará la capacidad de carga de minerales y agroexportaciones; y el corredor ferroviario Cusco-Puno (S/ 520 millones), que busca aliviar la congestión de transporte de carga hacia el puerto de Ilo.

El ministro de Economía, José Arista, destacó que el nuevo marco APP elimina la exigencia de garantías soberanas en proyectos donde el flujo de ingresos por peajes o tarifas es suficiente para cubrir el servicio de deuda, facilitando la participación de fondos de infraestructura internacionales. Fondos de pensiones del Canadá (CPPIB) y Australia (AustralianSuper) ya han manifestado interés en la convocatoria.

La agencia clasificadora Fitch destacó que el programa de APPs es consistente con la consolidación fiscal proyectada en el Marco Macroeconómico Multianual, ya que los compromisos de inversión son privados y no generan deuda pública directa.`,
    analisis: `El programa APP por S/ 3,800 millones tendrá un efecto moderado pero positivo sobre el sol peruano a mediano plazo. La adjudicación de estos contratos traerá flujos de capital extranjero para financiar las inversiones, lo que supone entrada de dólares que se convertirán a soles. Adicionalmente, la mejor infraestructura reduce costos logísticos para exportadores, mejorando la competitividad y el valor de las exportaciones.

Para el sector financiero peruano, los proyectos de infraestructura generan oportunidades de financiamiento en soles a largo plazo, lo que profundiza el mercado de capitales local y reduce la dependencia del financiamiento externo en dólares.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j006',
    titulo: "Empleo formal en Lima sube 4.1% interanual en abril — credito de consumo bancario crece 8.2% en el primer trimestre",
    descripcion: "El INEI reportó que el empleo formal en Lima Metropolitana creció 4.1% interanual en abril de 2026, con 4.96 millones de trabajadores en planilla. Paralelamente, la SBS informó que el crédito de consumo del sistema bancario creció 8.2% en el primer trimestre, señal de recuperación del gasto de los hogares.",
    contenido: `El Instituto Nacional de Estadística e Informática (INEI) publicó el Informe Técnico de Empleo en Lima Metropolitana de abril de 2026, registrando 4.96 millones de trabajadores con empleo formal en planilla, un crecimiento del 4.1% frente al mismo mes de 2025. El dato es consistente con el ciclo de expansión económica que el MEF atribuye a la mayor inversión minera y el dinamismo exportador.

Por sectores, el comercio lideró el crecimiento con +6.3%, impulsado por la apertura de nuevos centros comerciales en provincias. Los servicios financieros avanzaron 5.8%, reflejando la expansión del crédito de banca digital. La manufactura subió 3.9%, con la industria textil recuperando pedidos de EE.UU. tras el ajuste del TLC. El sector construcción, directamente ligado al programa de APPs, creció 4.7%.

La Superintendencia de Banca y Seguros (SBS) reportó que el crédito de consumo del sistema bancario totalizó S/ 112,800 millones al cierre del primer trimestre, un crecimiento del 8.2% interanual, el mayor ritmo en dos años. El crédito de tarjeta de crédito creció 7.1% y los préstamos personales 9.4%. La morosidad del crédito de consumo se ubica en 3.8%, dentro del rango histórico normal.

El índice de confianza del consumidor elaborado por IPSOS Perú subió a 58 puntos en mayo, el nivel más alto desde 2023, reflejando la mejora en las expectativas de empleo y la estabilidad del tipo de cambio.`,
    analisis: `El crecimiento del empleo formal y el crédito de consumo son indicadores adelantados de mayor actividad económica interna, lo que refuerza la perspectiva positiva para el PBI del Perú en 2026. Un mayor consumo interno reduce la dependencia del ciclo exportador y diversifica los motores del crecimiento, haciendo al sol peruano menos vulnerable a caídas en los precios de los commodities.

Para el mercado cambiario, el aumento del crédito de consumo en soles es un factor neutral. Sin embargo, si parte del crédito se destina a la compra de bienes importados, generará demanda de dólares que actuará como un freno natural a la apreciación del sol. Este mecanismo de equilibrio automático es saludable para la estabilidad del tipo de cambio.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/29302360/pexels\-photo\-29302360\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j007',
    titulo: "Secretario del Tesoro de EE.UU. presiona al Senado con plan fiscal revisado de US$ 1.6T — mercados de deuda responden positivamente",
    descripcion: "El secretario del Tesoro de EE.UU., Scott Bessent, presentó una versión revisada del plan fiscal de US$ 1.6 billones ante el Comité de Presupuesto del Senado. Los mercados de deuda respondieron con una caída de 6 puntos básicos en el Treasury a 10 años, hasta 4.43%, señal de cautela optimista.",
    contenido: `El secretario del Tesoro de EE.UU., Scott Bessent, convocó a una reunión de emergencia con el Comité de Presupuesto del Senado para presentar una versión revisada del plan fiscal que reduce el monto original de US$ 1.8 billones a US$ 1.6 billones, incorporando recortes adicionales al gasto en programas sociales y subsidios energéticos que habían sido rechazados por los senadores moderados.

El plan revisado incluye recortes de US$ 950,000 millones en diez años en gasto discrecional no-defensa, nuevas fuentes de ingresos por US$ 420,000 millones vía eliminación de deducciones fiscales corporativas de baja eficiencia, y una revisión del gasto en el programa Medicare por US$ 230,000 millones. Bessent señaló que el acuerdo es negociable en los márgenes pero insistió en que debe aprobarse antes del 31 de mayo para evitar que las agencias de rating evalúen nuevas rebajas.

Los mercados de deuda respondieron con alivio moderado: el rendimiento del Treasury a 10 años cayó 6 puntos básicos hasta 4.43%, y el Treasury a 2 años retrocedió a 4.15%. Los credit default swaps de la deuda soberana de EE.UU. a 5 años también cedieron desde 62 hasta 57 puntos básicos, reflejando una reducción del riesgo percibido.

El S&P 500 cerró con una ganancia del 0.4% al conocerse la noticia, mientras que los futuros del Nasdaq-100 avanzaron 0.6%. Los gestores de bonos estimaron en 72% la probabilidad de que el Senado apruebe alguna versión del plan antes del 31 de mayo.`,
    analisis: `Un acuerdo fiscal en el Senado de EE.UU. antes del 31 de mayo es el escenario más favorable para la estabilidad global de los mercados. Si se concreta, el DXY podría rebotar desde 100.5 hacia el rango 102-104, lo que presionaría al sol peruano hacia S/ 3.50-3.55 en los días siguientes al acuerdo. Este escenario no debe interpretarse como negativo para Perú: un dólar más estable reduce la incertidumbre para la planificación empresarial.

Si el plan fracasa nuevamente, el DXY podría caer por debajo de 100 y el sol apreciarse más allá de S/ 3.42. Para quienes programan compras de dólares, los próximos días representan una ventana de decisión: actuar antes del voto en el Senado o esperar el resultado. Dada la incertidumbre, una estrategia de cobertura parcial puede ser prudente.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/17507798/pexels\-photo\-17507798\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j008',
    titulo: "PMI manufacturero de China sube a 51.2 en mayo — demanda de cobre para vehiculos electricos y redes electricas impulsa LME a US$ 4.90/lb",
    descripcion: "El índice PMI manufacturero de China subió a 51.2 en mayo, superando la estimación de 50.8 del consenso. El subsector de equipos eléctricos y vehículos eléctricos lideró la expansión, con implicaciones directas para la demanda de cobre. El LME Copper cotiza en US$ 4.90/lb.",
    contenido: `La Oficina Nacional de Estadísticas de China publicó el dato del PMI manufacturero de mayo, que se situó en 51.2 puntos, el nivel más alto en cuatro meses y por encima de los 50.8 que anticipaba el consenso de analistas. El resultado confirma que la actividad industrial china se expande de forma sostenida, liderada por el subsector de equipos eléctricos, vehículos eléctricos y maquinaria industrial.

El subíndice de nuevas órdenes de exportación subió a 52.1, el más alto desde junio de 2024, señalando que la demanda externa de manufacturas chinas sigue firme a pesar de las tensiones arancelarias con EE.UU. El subíndice de empleo manufacturero se ubicó en 49.8, aún en territorio contractivo pero mejorando desde el 48.9 de abril, lo que sugiere que el sector laboral industrial está tocando fondo.

Para los metales industriales, el dato es especialmente relevante: el cobre es insumo clave en la fabricación de cables para redes eléctricas, motores de vehículos eléctricos y equipos de energía renovable. China representa el 54% de la demanda global de cobre refinado. El LME Copper respondió con un alza del 0.8% hasta US$ 4.90/lb, acercándose al máximo histórico de US$ 4.95/lb registrado la semana pasada.

Los inventarios de cobre en almacenes del LME continúan en niveles bajos, 142,000 toneladas frente al promedio de 200,000 del año anterior, lo que amplifica el efecto de cualquier incremento de demanda sobre el precio spot.`,
    analisis: `Un PMI chino en 51.2 es una excelente noticia para Perú, que destina el 32% de sus exportaciones de cobre al mercado chino. Cada punto de expansión del PMI manufacturero chino por encima de 50 se traduce en mayor demanda de concentrados de cobre peruanos, lo que refuerza los ingresos de divisas y el superávit comercial del Perú.

Si el LME Copper supera los US$ 4.95/lb y consolida un nuevo récord, el BCRP enfrentará mayor presión apreciadora sobre el sol. Para las empresas mineras de cobre listadas en bolsa, el dato chino es una señal positiva para los resultados del segundo trimestre de 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/31091544/pexels\-photo\-31091544\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j009',
    titulo: "Brent retrocede a US$ 95/bbl por señales de negociacion Iran-EE.UU. — prima de riesgo del Estrecho de Ormuz se reduce parcialmente",
    descripcion: "El petróleo Brent cayó a US$ 95 por barril tras informes de contactos diplomáticos entre EE.UU. e Irán en Omán. La reducción del riesgo geopolítico en el Estrecho de Ormuz alivió la prima sobre el precio del crudo, con implicaciones positivas para la inflación importada en Perú.",
    contenido: `El petróleo Brent retrocedió a US$ 95.20 por barril en la sesión europea del viernes, una caída del 2.1% frente al cierre del jueves, luego de que Reuters informara que representantes de EE.UU. e Irán sostuvieron reuniones de back-channel en Muscat, Omán, explorando una reducción de tensiones en el Estrecho de Ormuz. El WTI cedió simpatéticamente a US$ 92.80/bbl.

La noticia supone un cambio relevante en el panorama geopolítico del Golfo Pérsico. Desde inicios de mayo, la amenaza iraní de bloquear el Estrecho de Ormuz había generado una prima de riesgo estimada en US$ 6-8 por barril sobre los precios del crudo. Una eventual distensión eliminaría parcial o totalmente ese diferencial.

El Ministerio de Relaciones Exteriores iraní no confirmó ni desmintió los contactos diplomáticos. Los analistas de Goldman Sachs estiman que si las negociaciones prosperan, el Brent podría retroceder a US$ 88-90/bbl en las próximas semanas.

El retroceso del crudo redujo las presiones inflacionarias globales: el índice de fletes marítimos BALTIC cayó 3.4%, y el precio del gasóleo en los mercados europeos bajó a US$ 1,050 por tonelada métrica desde US$ 1,090.`,
    analisis: `Una caída del petróleo Brent a US$ 95, y potencialmente a US$ 88-90 si el diálogo iraní-estadounidense avanza, es una noticia positiva para el Perú en varios frentes. Primero, reduce el costo de la factura de importación de combustibles, que tiene un peso relevante en la balanza de pagos. Segundo, aliviaría las presiones sobre los precios domésticos de combustibles y fletes, contribuyendo a mantener la inflación en el rango meta del BCRP.

Para el tipo de cambio, un petróleo más barato reduce la demanda de dólares para importaciones energéticas, lo que es marginalmente positivo para el sol peruano. Además, precios de energía menores dan al BCRP más espacio para recortar tasas sin presionar al sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/3207536/pexels\-photo\-3207536\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j010',
    titulo: "DXY en 100.5: soporte tecnico en 99.8 y resistencia en 102.0 — analisis para la semana del 25 de mayo",
    descripcion: "El índice del dólar DXY cotiza en 100.5, buscando soporte en el nivel técnico de 99.8. Los analistas identifican que una ruptura por debajo de 100 abriría un movimiento hacia 98.5, mientras que la recuperación a 102 requeriría noticias positivas del plan fiscal del Congreso de EE.UU.",
    contenido: `El DXY (U.S. Dollar Index) cotiza en 100.5 al cierre de la sesión del viernes, completando su tercera semana consecutiva de pérdidas frente a una cesta de divisas desarrolladas. Desde los máximos post-Moody's de 102.8 del lunes 19 de mayo, el índice acumula una caída del 2.2%, que se convierte en una pérdida del 8.1% en lo que va del año 2026.

El análisis técnico semanal identifica el nivel de 99.8 como el soporte clave más próximo: corresponde a la media móvil de 200 semanas y al mínimo de enero de 2024. Una ruptura sostenida por debajo de 100 activaría objetivos técnicos en 98.5 primero y 97.0 en segunda instancia, en función del gap que dejó el repunte del DXY post-elecciones de 2024.

Los indicadores de momento son negativos para el dólar: el RSI semanal se ubica en 38, zona de debilidad sostenida sin estar técnicamente sobrevendido. El MACD semanal muestra divergencia bajista desde los máximos de noviembre de 2025. Las medias móviles de 50 y 200 días continúan configuradas en death cross desde abril de 2026.

Para que el DXY recupere terreno de manera técnicamente significativa, necesitaría cerrar por encima de 102.0, que representa la resistencia de la ex-media móvil de 50 días. Este escenario requeriría un catalizador fundamental claro, como la aprobación del plan fiscal por el Senado o datos de inflación PCE del viernes más altos de lo esperado.`,
    analisis: `El análisis técnico del DXY confirma el sesgo fundamental: el dólar está débil y las divisas emergentes como el sol peruano se benefician de ese entorno. Para el PEN/USD, la caída técnica del DXY a 99.8 o 98.5, si se materializa, implicaría una apreciación adicional del sol hacia S/ 3.40-3.42, niveles no vistos desde 2023.

Para gestores de FX en empresas peruanas: el análisis técnico sugiere que el próximo soporte del dólar frente al sol es alrededor de S/ 3.40. Si el dólar cae a ese nivel, podría ser un punto de acumulación atractivo para comprar dólares a precio bajo y cubrirse frente a un eventual rebote. Monitorear el cierre de la sesión del viernes 30 de mayo como indicador clave.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/29611783/pexels\-photo\-29611783\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j011',
    titulo: "Oro consolida en US$ 3,295/oz — RSI semanal en sobrecompra y soporte en US$ 3,250; proximo catalizador: PCE del viernes",
    descripcion: "El oro al contado cotiza en US$ 3,295/oz tras la corrección desde el máximo histórico de US$ 3,358 del miércoles. El RSI semanal se acerca a zona de sobrecompra en 71. El dato de inflación PCE de EE.UU. del viernes 30 de mayo será el catalizador que defina la próxima dirección.",
    contenido: `El oro al contado retrocedió a US$ 3,295/oz en la sesión del viernes, completando una corrección del 1.9% desde el récord histórico de US$ 3,358 alcanzado el miércoles. La toma de ganancias respondió a la moderación del sentimiento de aversión al riesgo tras los reportes de contactos diplomáticos entre EE.UU. e Irán.

El análisis técnico muestra que el RSI semanal del oro se sitúa en 71, ingresando formalmente en la zona de sobrecompra. Históricamente, niveles de RSI por encima de 70 en el gráfico semanal del oro han precedido correcciones de entre 4% y 8% antes de reanudar la tendencia alcista de largo plazo. El soporte inmediato se ubica en US$ 3,250 y el soporte primario en US$ 3,180.

El volumen de contratos de futuros de oro en el COMEX sigue elevado, con open interest en 680,000 contratos, lo que indica que las posiciones especulativas netas largas están en máximos de 18 meses según el informe COT de la semana. Este exceso de posicionamiento largo es un factor técnico de riesgo que puede amplificar cualquier corrección si se produce un catalizador bajista.

El dato de PCE de EE.UU., previsto para el viernes 30 de mayo, es el siguiente catalizador clave. Un PCE por encima del 2.6% interanual podría reducir las expectativas de recorte de la Fed y generar presión vendedora sobre el oro. Un PCE por debajo del 2.4% sería alcista para el metal.`,
    analisis: `El oro en US$ 3,295 con RSI en sobrecompra semanal sugiere cautela en el corto plazo para nuevas posiciones largas. Una corrección técnica al rango US$ 3,250-3,180 no cambiaría la tendencia alcista de largo plazo, pero sí ofrecería mejores puntos de entrada para quienes buscan exposición al metal como cobertura.

Para Perú, el precio del oro a estos niveles sigue siendo muy favorable para las exportaciones auríferas. Mineras como Buenaventura, Poderosa y Hochschild se benefician de márgenes históricos con el oro por encima de US$ 3,000/oz. Una corrección técnica de 5%-8% no afectaría significativamente la rentabilidad de las mineras de oro peruanas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/8442325/pexels\-photo\-8442325\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j012',
    titulo: "Bitcoin en US$ 108,200 — correlacion inversa con DXY se intensifica; volumen retail en America Latina sube 19% interanual",
    descripcion: "Bitcoin cotiza en US$ 108,200, con una correlación inversa con el DXY que se intensifica en la semana. El volumen de transacciones en plataformas de América Latina creció 19% interanual en mayo, con Brasil, Argentina y Colombia liderando la adopción de criptoactivos como cobertura ante la debilidad del dólar.",
    contenido: `Bitcoin cotizó en US$ 108,200 al cierre asiático del viernes, acumulando un alza del 3.1% en la semana y del 42% en lo que va del año 2026. La criptomoneda lidera el rally de activos de riesgo denominados en dólares, beneficiada por la narrativa de activo de cobertura que se fortalece en períodos de debilidad del DXY.

La correlación inversa entre Bitcoin y el DXY alcanzó -0.74 en el período de 30 días, uno de los niveles más altos de los últimos dos años. Los analistas de CoinMetrics señalan que el patrón refleja que los inversores institucionales utilizan BTC como cobertura táctica contra la depreciación del dólar, de manera similar al oro. Los ETF de Bitcoin en EE.UU. registraron entradas netas de US$ 1,240 millones en la semana, el mayor flujo semanal desde febrero.

En América Latina, Chainalysis reportó que el volumen on-chain de transacciones de criptoactivos creció 19% interanual en mayo de 2026, impulsado por usuarios retail en Argentina, Brasil y Colombia. Perú registró un crecimiento del 14% en el volumen de transacciones en plataformas de exchange locales.

El soporte técnico de BTC en US$ 104,000 se mantiene sólido. La resistencia a superar es US$ 112,000, máximo histórico de enero de 2026. Los analistas de TradingView apuntan a US$ 118,000-120,000 como objetivo de largo plazo si el DXY cierra la semana por debajo de 100.`,
    analisis: `Bitcoin en US$ 108,200 con fuerte demanda latinoamericana es una señal de mayor sofisticación financiera en la región. El crecimiento del 14% en el volumen de transacciones crypto en Perú refleja la búsqueda de alternativas de inversión por parte de ahorristas peruanos.

Para el mercado cambiario local, la demanda de Bitcoin implica compras de dólares, lo que actúa como un factor de demanda marginal de divisas en el mercado local. Este efecto es pequeño pero va en la dirección de amortiguar la apreciación del sol. Desde QoriCash, recordamos que las operaciones de cambio de soles a dólares para cualquier propósito deben realizarse en casas de cambio autorizadas y con tasas competitivas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/8919573/pexels\-photo\-8919573\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j013',
    titulo: "Argentina: inflacion de mayo cae a 1.8% mensual — record historico de desinflacion bajo el programa Milei; peso toca 1,250 por dolar",
    descripcion: "El INDEC de Argentina reportó que la inflación de mayo cayó a 1.8% mensual, el nivel más bajo desde agosto de 2020. El programa de ajuste fiscal del gobierno de Milei consolida la desinflación. El peso argentino se apreció a 1,250 por dólar en el mercado oficial tras el dato positivo.",
    contenido: `El Instituto Nacional de Estadística y Censos de Argentina publicó los datos de inflación de mayo de 2026, que se situaron en 1.8% mensual, por debajo del 2.1% de abril y del 2.4% de marzo. El dato es el más bajo desde agosto de 2020 y confirma que el programa de estabilización del presidente Javier Milei está logrando sus objetivos desinflacionarios con mayor velocidad de la esperada.

La inflación interanual cayó a 38.2%, desde el 210% de diciembre de 2023. El efecto base favorable continúa contribuyendo a la reducción del dato interanual, pero la inflación subyacente mensual de 2.1% también muestra convergencia hacia niveles normales. Los rubros con mayor inflación en mayo fueron servicios públicos (+4.2% por ajustes de tarifas) y salud (+3.1%). Alimentos y bebidas avanzaron solo 1.2%.

El peso argentino cotizó en 1,250 por dólar en el mercado oficial tras el dato, acumulando una apreciación del 3.2% en el mes. La brecha con el dólar blue se redujo a 7%, el nivel más bajo desde la unificación cambiaria de diciembre de 2023. El ministro de Economía, Luis Caputo, anunció que en junio se eliminarán los últimos controles de capitales residuales.

Fitch Ratings señaló que el dato de mayo es consistente con su visión de que Argentina logrará una inflación de un dígito mensual sostenida en el segundo semestre de 2026, lo que podría justificar una mejora adicional del rating soberano.`,
    analisis: `La desinflación argentina tiene implicaciones regionales relevantes. Históricamente, los períodos de alta inflación en Argentina incrementan la precaución de inversores y ahorristas en países vecinos, incluyendo Perú, generando mayor demanda de dólares como cobertura. Una Argentina con inflación del 1.8% mensual reduce ese efecto de contagio psicológico.

Para el tipo de cambio peruano, una Argentina más estable es una noticia marginalmente positiva: reduce la incertidumbre regional y puede mejorar el apetito de inversores internacionales por activos latinoamericanos en general, incluyendo los peruanos. A mediano plazo, una Argentina reintegrada a los mercados de deuda sería positiva para los flujos de capital hacia la región.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/34004034/pexels\-photo\-34004034\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j014',
    titulo: "Colombia: Banco de la Republica recorta tasa 25 pbs a 9.75% — peso colombiano se fortalece a 4,090 por dolar",
    descripcion: "El Banco de la República de Colombia redujo su tasa de interés de política monetaria en 25 puntos básicos, llevándola a 9.75%. Es el undécimo recorte consecutivo del ciclo iniciado en diciembre de 2023. El COP/USD se fortaleció a 4,090, acercándose a su mejor nivel en dos meses.",
    contenido: `La Junta Directiva del Banco de la República de Colombia votó por cuarta vez consecutiva a favor de un recorte de 25 puntos básicos en su tasa de intervención, llevándola desde el 10.00% al 9.75%. Es el undécimo recorte del ciclo de flexibilización iniciado en diciembre de 2023, cuando la tasa se ubicaba en el máximo histórico del 13.25%.

El comunicado del banco central colombiano destacó que la inflación interanual cerró abril en 5.3%, significativamente por debajo del pico del 13.1% de marzo de 2023, y que las expectativas inflacionarias a 12 meses se ubican en 4.2%, convergiendo hacia la meta de largo plazo del 3%. El banco señaló que el proceso desinflacionario está bien encaminado y que las condiciones financieras permiten continuar con la normalización gradual de la política monetaria.

El COP/USD respondió con un alza del 1.2% hasta 4,090 por dólar, su nivel más fuerte en dos meses. La apreciación del peso colombiano no responde a la baja de tasas per se, sino al contexto general de debilidad del DXY a 100.5 y a la percepción de que el ciclo de recortes colombiano está controlado y compatible con la estabilidad cambiaria.

El petróleo Brent, del que Colombia es exportador, cotiza en US$ 95/bbl, aportando ingresos de divisas que también soportan al peso. El sector cafetero colombiano reportó exportaciones por US$ 420 millones en abril, 9% por encima del año anterior.`,
    analisis: `El recorte del Banco de la República a 9.75% reduce el diferencial de tasas entre Colombia y Perú, donde el BCRP mantiene su tasa en 4.75%. Si Colombia sigue recortando y el BCRP se mantiene, podría generarse una recomposición de flujos de carry trade desde COP hacia PEN, lo que sería positivo para el sol peruano.

Para Perú, el ciclo de flexibilización colombiano es un referente de que la región avanza hacia tasas más bajas. Si el BCRP inicia su propio ciclo de recortes en julio, el sol podría mostrar volatilidad temporal, pero los fundamentos del superávit comercial y la inversión minera sugieren que cualquier debilidad del PEN sería transitoria.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/19676231/pexels\-photo\-19676231\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'j015',
    titulo: "Chile: peso toca 925 por dolar impulsado por rally del cobre — Banco Central mantiene tasa y advierte sobre riesgos de apreciacion excesiva",
    descripcion: "El peso chileno se apreció a 925 por dólar, su mejor nivel en tres semanas, correlacionado con el alza del cobre al LME a US$ 4.90/lb. El Banco Central de Chile mantuvo su tasa de política monetaria en 5.00% y señaló que vigilará los efectos del tipo de cambio sobre la inflación importada.",
    contenido: `El peso chileno se apreció a 925 por dólar en la sesión del viernes, su nivel más fuerte en tres semanas y un avance del 2.8% en el mes. La apreciación del CLP está fuertemente correlacionada con el rally del cobre en el LME, que cotiza en US$ 4.90/lb ante los datos positivos del PMI chino y la debilidad global del DXY.

Chile es el mayor productor mundial de cobre, con una participación del 27% en la oferta global. Cada dólar de alza en el precio del cobre genera aproximadamente US$ 600 millones adicionales en ingresos anuales de exportaciones para Chile, lo que se traduce en mayor oferta de dólares en el mercado local y apreciación del peso.

El Banco Central de Chile mantuvo la Tasa de Política Monetaria en 5.00%, en línea con las expectativas del mercado. El comunicado advirtió que el dinamismo del tipo de cambio, si persiste, podría moderar las presiones inflacionarias pero también generar riesgos para la competitividad del sector exportador no minero. La TPM acumula una reducción de 600 puntos básicos desde el pico del 11.25% de agosto de 2023.

El IPSA (índice de la Bolsa de Santiago) subió 1.4% en la semana, liderado por las mineras de cobre. El cobre chileno representa el 52% de los ingresos fiscales del sector exportador.`,
    analisis: `La apreciación del peso chileno a 925 por dólar es un espejo de lo que ocurre con el sol peruano a S/ 3.45: ambas divisas se aprecian por la misma causa estructural, la debilidad del DXY y los altos precios de los metales. Cuando los fundamentos son regionales y no solo locales, la apreciación tiende a ser más sostenida.

Para Perú, la sincronía con Chile refuerza la visión de que el sol seguirá apreciado mientras el cobre se mantenga por encima de US$ 4.50/lb y el DXY no recupere el nivel de 103-105. Para empresas con exposición a ambas monedas, el análisis comparativo sugiere que en este entorno es preferible mantener activos en moneda local y cubrir pasivos en dólares.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-24T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images\.pexels\.com/photos/29713911/pexels\-photo\-29713911\.jpeg\?auto=compress\&cs=tinysrgb\&w=1200',
  },
  {
    id: 'i001',
    titulo: "Congreso de EE.UU. debate plan fiscal de emergencia tras rebaja Moody's — DXY recupera 101.5 y mercados globales estabilizan",
    descripcion: "El Congreso estadounidense abrió una sesión de emergencia para debatir un paquete de ajuste fiscal por US$ 1.8 billones, respondiendo a la presión generada por la rebaja de Moody's. El DXY recuperó el nivel de 101.5 puntos y los mercados de renta variable cerraron mixtos en Asia y Europa.",
    contenido: `El Congreso de Estados Unidos se reunió en sesión de emergencia el miércoles para debatir un paquete de consolidación fiscal que incluye recortes al gasto discrecional por US$ 900,000 millones y nuevas fuentes de ingresos por US$ 900,000 millones adicionales en diez años. La propuesta fue impulsada por el Comité de Presupuesto del Senado como respuesta directa a la rebaja de Moody's del viernes 16 de mayo, que colocó la deuda soberana de EE.UU. en Aa1, la primera degradación desde 2011.

La noticia generó un alivio inmediato en los mercados de deuda. El rendimiento del bono del Tesoro a 10 años cayó 8 puntos básicos hasta 4.49%, retrocediendo desde el pico de 4.57% alcanzado en la sesión del lunes. El DXY recuperó el nivel psicológico de 101.5 puntos tras haber caído hasta 100.2 en los días previos, a medida que los inversores redujeron posiciones cortas en dólares ante la señal política de corrección fiscal.

Los mercados de renta variable cerraron mixtos. El Nikkei 225 subió 1.2%, el Hang Seng avanzó 0.8% impulsado por tecnológicas chinas, y el DAX europeo ganó 0.4%. El S&P 500 operó con cautela, avanzando apenas 0.1% al cierre, ya que los inversores aguardan la votación definitiva del plan fiscal, prevista para la última semana de mayo.

El presidente de la Fed, Kevin Warsh, elogió "la seriedad del Congreso para abordar el desequilibrio fiscal" pero reiteró que la política monetaria "permanece dependiente de los datos". Los futuros de Fed Funds redujeron la probabilidad de un recorte en junio desde 45% hasta 38%, reflejando que el ajuste fiscal podría ralentizar la caída de inflación al reducir el estímulo fiscal.`,
    analisis: `La recuperación del DXY a 101.5 reduce parcialmente el impulso apreciatorio del sol peruano. Si el plan fiscal se aprueba con suficiente soporte bipartidario, el dólar podría consolidarse en el rango 101-103, lo que llevaría al PEN/USD de regreso hacia S/ 3.50-3.55 en las próximas dos semanas. Este escenario es importante para quienes programan flujos de caja en dólares.

Si en cambio el plan fracasa o se aprueba con recortes insuficientes, el DXY podría retomar la caída hacia 99-100 y el sol tendría espacio para apreciarse nuevamente hacia S/ 3.40. La clave esta semana es el resultado de la votación en el Senado. Para empresas con exposición importadora, este momento de incertidumbre puede ser una oportunidad para cubrir parcialmente su posición en dólares antes de que el panorama se aclare.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/5831529/pexels-photo-5831529.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i002',
    titulo: 'BCRP mantiene tasa referencial en 4.75% por tercer mes consecutivo — sol se estabiliza en S/ 3.47 tras semana de alta volatilidad',
    descripcion: 'El Banco Central de Reserva del Perú mantuvo su tasa de interés de referencia en 4.75% en la reunión del directorio del 21 de mayo, citando expectativas de inflación bien ancladas y un entorno externo volátil que requiere cautela. El sol peruano cotiza en S/ 3.47, recuperándose desde el mínimo de S/ 3.43 del lunes.',
    contenido: `El Directorio del Banco Central de Reserva del Perú (BCRP) decidió por unanimidad mantener la tasa de interés de referencia en 4.75% anual en su reunión del 21 de mayo de 2026. Es la tercera reunión consecutiva sin cambio de tasa, consolidando una postura de espera cautelosa ante la evolución de la inflación doméstica y el entorno macroeconómico global marcado por la volatilidad post-rebaja Moody's.

El presidente del BCRP, Julio Velarde, señaló que la inflación de abril cerró en 2.1%, dentro del rango meta de 1%-3%, y que las expectativas inflacionarias a 12 meses permanecen bien ancladas en 2.3%. Sin embargo, advirtió que el alza del precio del petróleo Brent — que sigue en torno a US$ 97-100 por barril por las tensiones en el Estrecho de Ormuz — representa un riesgo latente para los precios de combustibles y tarifas de transporte en los próximos meses.

El sol peruano cotiza actualmente en S/ 3.47, recuperándose desde el mínimo del año de S/ 3.43 alcanzado el lunes tras la apreciación generada por la caída del DXY a 100.2. El BCRP intervino de forma limitada con compras de dólares por un monto estimado de US$ 180 millones entre el lunes y el martes para suavizar la volatilidad excesiva, sin resistir la tendencia de apreciación estructural impulsada por los fundamentos externos.

La tasa de referencia al 4.75% mantiene un diferencial positivo de 25 puntos básicos frente a la tasa de Fed Funds (4.50%), lo que contribuye a sostener la demanda de activos en soles. Los analistas del mercado estiman que el BCRP podría iniciar un ciclo de recortes en el tercer trimestre si la Fed reduce tasas en julio y la inflación local se mantiene por debajo del 2.5%.`,
    analisis: `La decisión del BCRP de mantener tasas en 4.75% es una señal de estabilidad que apoya al sol peruano. El diferencial de tasas con EE.UU. de 25 pbs favorece los flujos de carry trade hacia soles, lo que crea un piso natural para el PEN frente al dólar. En términos prácticos, esta postura reduce la probabilidad de una depreciación brusca del sol en el corto plazo.

Para empresas peruanas con deuda en dólares o importaciones programadas, el nivel actual de S/ 3.47 representa un punto de equilibrio razonable. Si el BCRP recorta en julio junto con la Fed, el diferencial de tasas se mantiene estable y el PEN/USD podría seguir en el rango S/ 3.40-3.55 durante el segundo semestre. Recomendamos mantener coberturas cambiarias si el horizonte de la deuda supera los seis meses.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/6590628/pexels-photo-6590628.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i003',
    titulo: 'Exportaciones peruanas crecen 12.3% en abril y alcanzan US$ 5,840 millones — cobre y oro representan el 68% del total',
    descripcion: 'El MINCETUR reportó que las exportaciones totales del Perú alcanzaron US$ 5,840 millones en abril de 2026, un crecimiento del 12.3% frente al mismo mes de 2025. Las exportaciones mineras lideraron con US$ 3,970 millones, impulsadas por cobre a US$ 4.85/lb y oro en máximos históricos.',
    contenido: `El Ministerio de Comercio Exterior y Turismo (MINCETUR) publicó las estadísticas definitivas de exportaciones de abril de 2026, que alcanzaron US$ 5,840 millones, un crecimiento del 12.3% interanual. Es el cuarto mes consecutivo de expansión de dos dígitos, consolidando al Perú como uno de los exportadores emergentes de mayor dinamismo en América del Sur.

Las exportaciones tradicionales totalizaron US$ 4,380 millones, con el sector minero-metálico liderando con US$ 3,970 millones. El cobre representó US$ 2,410 millones, favorecido por un precio promedio de US$ 4.85 por libra en el mes, el segundo más alto de la historia. Las exportaciones de oro sumaron US$ 980 millones ante precios que promediaron US$ 3,280/oz, mientras que zinc, plata y plomo contribuyeron con US$ 580 millones adicionales.

Las exportaciones no tradicionales mostraron también un comportamiento robusto, alcanzando US$ 1,460 millones. El sector agroexportador aportó US$ 680 millones, con la uva de mesa peruana consolidando su posición en mercados europeos y asiáticos. Los productos pesqueros no tradicionales sumaron US$ 240 millones, mientras que los textiles y confecciones alcanzaron US$ 185 millones, con el algodón pima recuperando pedidos desde EEUU tras la reducción arancelaria acordada en el marco del TLC.

El MEF destacó que el superávit de balanza comercial de abril alcanzó US$ 2,180 millones, el mayor de los últimos cinco años, y que el acumulado enero-abril totaliza US$ 7,940 millones, generando reservas que contribuyen a la solidez macroeconómica del país.`,
    analisis: `Un superávit comercial de US$ 2,180 millones en un solo mes es un fundamento estructuralmente positivo para el sol peruano. El flujo de exportaciones en dólares que se convierte a soles para pagar planillas, impuestos y proveedores locales genera una demanda orgánica de PEN que presiona hacia la apreciación del tipo de cambio.

En el corto plazo, si el cobre se mantiene por encima de US$ 4.70/lb y el oro supera US$ 3,200/oz, los ingresos de divisas seguirán siendo altos y el sol podría fortalecer su tendencia apreciadora. Para importadores, este entorno de sol fuerte puede ser conveniente para adelantar pagos en dólares antes de que factores estacionales o geopolíticos reviertan la tendencia.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4960438/pexels-photo-4960438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i004',
    titulo: 'MEF eleva proyección de crecimiento del PBI peruano a 3.4% para 2026 — inversión privada y minería como motores principales',
    descripcion: 'El Ministerio de Economía y Finanzas revisó al alza su estimado de crecimiento del PBI para 2026, de 3.1% a 3.4%, basándose en el dinamismo exportador, la inversión privada en minería y la recuperación del consumo interno. Es la segunda revisión al alza del año.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó el miércoles la actualización del Marco Macroeconómico Multianual, elevando la proyección de crecimiento del PBI para 2026 desde 3.1% hasta 3.4%. Es la segunda revisión al alza del año, respaldada por un primer trimestre que cerró con un crecimiento de 3.8%, por encima del 3.3% estimado originalmente.

El ministro de Economía, José Arista, explicó que los motores del crecimiento revisado son tres. El primero es el boom exportador minero-metálico, que genera ingresos de divisas récord y activa la cadena de proveedores locales. El segundo es la aceleración de la inversión privada en minería, que alcanzó US$ 2,100 millones en el primer trimestre, con proyectos como Quellaveco Fase 2, Toromocho Ampliación y San Gabriel en plena ejecución. El tercero es la recuperación del consumo privado, que creció 3.2% interanual en el primer trimestre tras el ajuste inflacionario de 2024.

Sin embargo, el MEF mantiene una nota de cautela respecto a riesgos externos: la volatilidad fiscal en EE.UU. post-Moody's, la evolución del precio del petróleo y posibles disrupciones en rutas comerciales internacionales. La inflación proyectada para el cierre de 2026 se mantiene en 2.3%, dentro del rango meta del BCRP.

El déficit fiscal se proyecta en 2.8% del PBI para 2026, por debajo del 3.0% del año anterior, gracias al incremento de ingresos tributarios por el sector minero y a la contención del gasto corriente. La deuda pública se estabiliza en 33.2% del PBI, una de las más bajas de la región.`,
    analisis: `Un crecimiento proyectado de 3.4% para Perú contrasta positivamente con el estancamiento de economías como Argentina, México y Chile. Esta solidez macroeconómica es uno de los factores que diferencia al sol peruano en el contexto latinoamericano y reduce su vulnerabilidad ante shocks externos.

Para operadores de cambio y empresas con necesidades de moneda extranjera, un Perú que crece más de lo esperado con superávit comercial y baja deuda es un escenario que favorece un PEN fuerte de manera sostenida. La recomendación es no anticipar una depreciación del sol basándose solo en la volatilidad global — los fundamentos domésticos peruanos son sólidos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386372/pexels-photo-4386372.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i005',
    titulo: 'Sector agroexportador peruano bate récord con US$ 1,840 millones en enero-abril 2026 — uva, espárrago y palta lideran',
    descripcion: 'El sector agroexportador del Perú acumuló US$ 1,840 millones en los primeros cuatro meses de 2026, un crecimiento del 9.8% frente al mismo período de 2025. La uva de mesa, el espárrago fresco y la palta Hass lideraron los envíos, con España, EE.UU. y China como principales destinos.',
    contenido: `La Asociación de Exportadores (ADEX) informó que el sector agroexportador del Perú alcanzó un récord histórico de US$ 1,840 millones en el período enero-abril de 2026, superando en US$ 164 millones el registro del mismo período de 2025. El crecimiento de 9.8% interanual consolida al agro peruano como el segundo exportador más dinámico del país, después del sector minero.

La uva de mesa peruana encabezó los envíos con US$ 420 millones, beneficiándose de la ventana comercial con Europa que se extendió hasta mediados de abril gracias a condiciones climáticas favorables en los valles de Ica y La Libertad. Los despachos de espárrago fresco y congelado sumaron US$ 310 millones, consolidando a Perú como primer exportador mundial del producto. La palta Hass registró US$ 280 millones, impulsada por la creciente demanda de China, que en 2026 superó a EE.UU. como principal comprador de palta peruana.

Los mercados de destino muestran una diversificación creciente. España recibió el 18% del total agroexportado, EE.UU. el 22%, China el 16% y Países Bajos el 12%. El resto se distribuyó entre Corea del Sur, Japón, Emiratos Árabes y Reino Unido.

El presidente de ADEX, Mario Ochoa, destacó que la infraestructura de almacenamiento en frío invertida en los últimos tres años y los beneficios del TLC con China permiten mantener la competitividad a pesar de la presión cambiaria por el fortalecimiento del sol.`,
    analisis: `El auge agroexportador es una fuente adicional de divisas que complementa los ingresos mineros y refuerza el superávit comercial peruano. Para el mercado cambiario, cada dólar de exportación que se convierte a soles en el sistema financiero local es presión apreciadora sobre el PEN.

Si el sol se mantiene en el rango S/ 3.43-3.50, los exportadores agroindustriales verán comprimidos sus márgenes en soles. Esto puede llevar a que algunos exportadores retengan divisas temporalmente si esperan una corrección al alza del tipo de cambio, lo que puede moderar la apreciación del sol en el corto plazo.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15138925/pexels-photo-15138925.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i006',
    titulo: 'Reservas internacionales del Perú alcanzan US$ 76,800 millones — equivalen a 20 meses de importaciones y 4.2 veces la deuda externa de corto plazo',
    descripcion: 'El BCRP reportó que las reservas internacionales netas alcanzaron US$ 76,800 millones al 19 de mayo de 2026, el nivel más alto desde noviembre de 2024. El fortalecimiento obedece a las intervenciones de compra de dólares del BCRP y al aumento del precio del oro en las reservas.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) informó que las reservas internacionales netas alcanzaron US$ 76,800 millones al cierre del 19 de mayo de 2026, el nivel más elevado desde noviembre de 2024. El incremento respecto al cierre de abril (US$ 75,100 millones) refleja dos factores principales: las intervenciones de compra de dólares realizadas por el BCRP durante la semana del 12 al 16 de mayo para moderar la apreciación del sol, y la revaluación de las tenencias de oro ante el alza del precio del metal a US$ 3,320/oz.

El nivel de US$ 76,800 millones equivale a 20.3 meses de importaciones de bienes y servicios, 4.2 veces la deuda externa de corto plazo y el 30.2% del PBI proyectado para 2026. Estas métricas ubican a Perú entre los países emergentes con mayor colchón de reservas en el mundo, por detrás de China, India y Brasil en términos absolutos, pero por encima en términos de cobertura de importaciones.

La composición de las reservas incluye US$ 52,100 millones en depósitos en el exterior y valores de alta liquidez, US$ 18,400 millones en oro físico, y US$ 6,300 millones en DEG (Derechos Especiales de Giro) del FMI. El oro ha ganado terreno en la composición total, pasando del 21% al 24% de las reservas en el último año, como estrategia de diversificación frente a la debilidad del dólar.

El BCRP destacó que las reservas proporcionan un "blindaje macroeconómico robusto" ante el escenario de incertidumbre global, permitiendo al banco central intervenir en el mercado cambiario durante episodios de volatilidad sin comprometer la estabilidad financiera.`,
    analisis: `Las reservas de US$ 76,800 millones son un ancla fundamental para la estabilidad del sol peruano. A diferencia de países como Argentina o Turquía, el Perú tiene la capacidad de defender el tipo de cambio durante períodos prolongados de presión sin agotar sus recursos. Esto reduce significativamente el riesgo de una devaluación brusca del PEN.

Para empresas y personas naturales con exposición en dólares, este blindaje significa que los movimientos del sol tenderán a ser graduales y dentro de rangos manejables, no abruptos. El riesgo cambiario en Perú es bajo en términos comparativos regionales. Eso no elimina la volatilidad, pero sí limita los escenarios extremos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/167676/pexels-photo-167676.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i007',
    titulo: 'Fed mantiene tasa en 4.50% y descarta recorte en junio — Warsh exige datos adicionales de inflación antes de primer ajuste',
    descripcion: 'Las minutas del Comité de Mercado Abierto (FOMC) publicadas el martes confirman que la Fed no moverá tasas en junio. Kevin Warsh, presidente de la Fed, señaló que se necesitan "al menos dos meses adicionales de datos favorables de inflación" antes de considerar el primer recorte del ciclo.',
    contenido: `Las minutas de la reunión del Comité Federal de Mercado Abierto (FOMC) del 6 y 7 de mayo, publicadas el martes por la Reserva Federal, confirmaron que la mayoría de miembros considera "prematuro" un recorte de tasas en junio. El comunicado señaló que la inflación PCE subyacente de marzo cerró en 2.6% anual, todavía por encima del objetivo del 2%, y que el mercado laboral "permanece resiliente" con una tasa de desempleo del 4.1%.

Kevin Warsh, nombrado presidente de la Fed en enero de 2026, declaró en una conferencia en Washington que el comité necesita "al menos dos ciclos adicionales de datos de inflación que confirmen la convergencia al 2%" antes de iniciar recortes. Warsh, conocido por su postura más hawkish que su predecesor Jerome Powell, no descartó un ajuste en julio si el IPC de mayo y junio muestran una desaceleración sostenida.

Los mercados de futuros de Fed Funds ajustaron sus expectativas. La probabilidad de un recorte en junio bajó al 12%, mientras que la de julio subió al 52%. Para finales de 2026, el mercado descuenta un total de 75 puntos básicos de recortes, frente a los 100 pbs estimados hace tres semanas. La curva de rendimientos del Tesoro se inclinó levemente, con el diferencial 2-10 años ampliándose de -8 pbs a +4 pbs.

El contexto macroeconómico complica la decisión de la Fed. La rebaja de Moody's añade presión política para recortar tasas y abaratar el costo de la deuda federal, pero la Fed debe mantener su independencia y priorizar el mandato de estabilidad de precios.`,
    analisis: `Una Fed hawkish que retrasa recortes mantiene el dólar relativamente firme a nivel global. Para el sol peruano, esto significa que el diferencial de tasas entre el BCRP (4.75%) y la Fed (4.50%) se comprime si la Fed recorta antes que el BCRP, lo cual podría reducir el atractivo del carry trade en soles.

Si la Fed no recorta hasta julio y el BCRP lo hace en agosto, el diferencial se invierte y el sol pierde un factor de soporte. Este es el escenario de riesgo para quienes planifican flujos de largo plazo. Recomendamos monitorear el IPC de mayo de EE.UU. (publicación en junio) como el indicador clave que determinará el timing del primer recorte de la Fed.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14820474/pexels-photo-14820474.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i008',
    titulo: 'PMI manufacturero de China sube a 51.2 en mayo — demanda de cobre y mineral de hierro se activa antes de temporada de construcción',
    descripcion: 'El índice PMI manufacturero de China avanzó a 51.2 en mayo desde 50.4 en abril, el nivel más alto desde agosto de 2025. La expansión del sector fabril activa la demanda de materias primas industriales, impulsando el cobre a US$ 4.87/lb y el mineral de hierro a US$ 118/tonelada.',
    contenido: `El Banco Nacional de Estadísticas de China publicó el miércoles que el Índice de Gestores de Compras (PMI) del sector manufacturero avanzó a 51.2 en mayo, por encima del 50.4 registrado en abril y del consenso de analistas que esperaba 50.8. Es el nivel más alto desde agosto de 2025 y la segunda lectura consecutiva por encima del umbral de expansión de 50 puntos.

El subíndice de nuevos pedidos subió a 52.8, el más elevado en diez meses, impulsado por la recuperación de exportaciones de electrónica y maquinaria hacia Europa y el Sudeste Asiático. El subíndice de producción avanzó a 53.1, reflejando la reactivación de capacidad industrial en las provincias de Guangdong, Zhejiang y Jiangsu. El subíndice de empleo subió marginalmente a 49.6, todavía en zona de contracción, indicando que las empresas son cautelosas con la contratación a pesar del repunte de actividad.

El impacto en los mercados de materias primas fue inmediato. El cobre en la Bolsa de Metales de Londres (LME) subió 1.8% hasta US$ 4.87/lb, el precio más alto desde el 13 de mayo. El mineral de hierro en Dalian Commodity Exchange avanzó 2.3% hasta US$ 118/tonelada. El aluminio ganó 1.2% y el zinc subió 0.9%, completando una sesión positiva para todos los metales base.

Goldman Sachs elevó su proyección de consumo de cobre de China para 2026 en 2.4%, argumentando que la combinación de construcción de infraestructura eléctrica para IA, redes de transmisión y vehículos eléctricos genera una demanda "estructuralmente superior" a la histórica para los metales de electrificación.`,
    analisis: `Un PMI chino en 51.2 es directamente positivo para la economía peruana. Con China como destino del 40% de las exportaciones mineras del Perú, cada punto de expansión manufacturera china se traduce en mayor demanda de cobre, zinc y plata peruana. Si el PMI se mantiene por encima de 51 en junio, el cobre podría probar los US$ 5.00/lb, lo que empujaría las exportaciones peruanas de mayo hacia US$ 6,000 millones.

Para el tipo de cambio, un súper ciclo de demanda de metales base empuja al sol a apreciarse estructuralmente. Si planificas importaciones de maquinaria o materias primas en los próximos meses, el entorno de sol fuerte favorecido por el boom minero puede ser conveniente para adelantar compras de dólares a los niveles actuales.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2231744/pexels-photo-2231744.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i009',
    titulo: 'Petróleo Brent retrocede a US$ 97 por barril ante indicios de avance en negociaciones para reapertura del Estrecho de Ormuz',
    descripcion: 'El precio del Brent cayó 3.2% hasta US$ 97.40 por barril tras reportes de que delegaciones de Irán y los países del Golfo Pérsico mantuvieron una reunión reservada en Suiza, mediada por Qatar, para explorar condiciones de reapertura gradual del Estrecho de Ormuz al tráfico comercial.',
    contenido: `El precio del petróleo Brent cayó 3.2% este miércoles hasta US$ 97.40 por barril, el nivel más bajo en tres semanas, tras la publicación de reportes de la agencia Reuters que indican que delegaciones iraníes y representantes de los Emiratos Árabes Unidos y Arabia Saudita se reunieron el fin de semana en Ginebra, bajo mediación de Qatar, para explorar condiciones de reapertura del Estrecho de Ormuz al tráfico comercial.

Según las fuentes citadas por Reuters, las conversaciones se centran en un esquema de "corredor seguro" que permitiría el paso de buques tanqueros civiles con escolta naval, a cambio de compromisos de no escalada militar en las aguas territoriales iranís. La reunión fue confirmada de forma indirecta por el Ministerio de Exteriores de Qatar, que habló de "contactos diplomáticos en curso para reducir tensiones en la zona".

El Brent había alcanzado un pico de US$ 103.80 por barril el 14 de mayo, impulsado por la incertidumbre tras la detención de tres buques tanqueros por guardacostas iraníes. El retroceso de hoy de US$ 6.40 por barril representa la mayor caída diaria desde febrero. El WTI acompañó la baja con una caída del 3.0% hasta US$ 93.10/barril.

Si el corredor seguro se materializa, los analistas de energía de Wood Mackenzie estiman que el precio del Brent podría retroceder hacia US$ 88-92 en el plazo de dos a cuatro semanas, lo que reduciría la presión inflacionaria en economías importadoras de petróleo como Perú, India y Turquía.`,
    analisis: `Un retroceso del Brent hacia US$ 90-95 tendría impacto positivo sobre la inflación peruana. El BCRP ha señalado que el riesgo del alza del petróleo es el principal factor externo que podría retrasar el ciclo de recortes. Si el crudo se estabiliza, la Fed y el BCRP tendrían más espacio para reducir tasas, lo que debilitaría el dólar y continuaría favoreciendo al sol peruano.

Para empresas con costos de transporte o energía ligados al petróleo (distribuidoras, mineras, pesqueras), un Brent en US$ 97 y cayendo es una buena noticia operativa. Monitorear el avance de las negociaciones en Ormuz esta semana es clave: si se anuncia un acuerdo formal, el Brent podría caer otros US$ 5-8 adicionales.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i010',
    titulo: 'DXY rebota a 101.5 y PEN/USD retrocede levemente a S/ 3.47 — resistencia técnica en S/ 3.44 sostiene al dólar en el corto plazo',
    descripcion: 'El índice del dólar DXY recuperó el nivel de 101.5 puntos apoyado en las minutas hawkish de la Fed y el plan fiscal de emergencia del Congreso de EE.UU. El sol peruano retrocedió desde S/ 3.43 hasta S/ 3.47, encontrando una zona de soporte-resistencia técnica clave.',
    contenido: `El índice del dólar DXY cotiza en 101.5 puntos al cierre de la sesión europea, recuperándose desde el mínimo semanal de 100.2 alcanzado el lunes. El rebote fue impulsado por dos catalizadores. Primero, las minutas del FOMC publicadas el martes confirmaron que la Fed no recortará en junio, reduciendo las apuestas a tasas más bajas en el corto plazo. Segundo, la presentación del plan fiscal de emergencia en el Congreso de EE.UU. generó alivio sobre la trayectoria del déficit federal, reduciendo la prima de riesgo que presionaba al dólar a la baja.

El par PEN/USD retrocedió desde el mínimo del año de S/ 3.43 hasta S/ 3.47 en la sesión del miércoles. Desde el análisis técnico, S/ 3.44 representa una zona de soporte-resistencia relevante: es el nivel donde el sol estuvo brevemente en julio de 2024 antes de depreciar de regreso a S/ 3.65. Una ruptura y cierre semanal por debajo de S/ 3.44 abriría el camino hacia S/ 3.35, mientras que un rebote sostenido del DXY hacia 103 podría llevar al PEN/USD nuevamente a S/ 3.55-3.60.

El volumen de operaciones en el mercado cambiario peruano fue elevado este miércoles, con US$ 740 millones transados en el mercado spot según datos del BCRP, por encima del promedio diario de US$ 520 millones de las últimas cuatro semanas. El incremento refleja posiciones de cobertura por parte de empresas importadoras que aprovechan el sol fuerte para adelantar pagos.

Los analistas de Scotiabank Perú estiman que el PEN/USD cerrará mayo en un rango de S/ 3.44-3.52, dependiendo del resultado de la votación fiscal en el Congreso de EE.UU. prevista para los próximos días.`,
    analisis: `El nivel S/ 3.44-3.47 es una zona de decisión clave para el tipo de cambio. Si el plan fiscal de EE.UU. se aprueba, el DXY recupera terreno y el sol retrocede hacia S/ 3.50-3.55 — escenario favorable para exportadores peruanos que necesitan más soles por sus dólares. Si el plan fracasa o se diluye, el DXY retoma la caída y el sol puede probar S/ 3.40 o menos.

Para operaciones cambiarias en los próximos días, la volatilidad estará elevada. Si necesitas vender dólares, el nivel actual de S/ 3.47 es mejor que el mínimo reciente de S/ 3.43. Si necesitas comprar dólares, esperar a los resultados del Congreso de EE.UU. esta semana puede darte la oportunidad de comprar más cerca de S/ 3.43-3.44 si el plan fiscal decepciona.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6770609/pexels-photo-6770609.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i011',
    titulo: 'Oro consolida en US$ 3,320/oz tras toma de ganancias — soporte técnico en US$ 3,280 sostiene la tendencia alcista de largo plazo',
    descripcion: 'El oro al contado retrocedió desde el récord de US$ 3,358/oz hasta US$ 3,320 por toma de ganancias institucional. Los analistas identifican el nivel US$ 3,280 como soporte clave y proyectan que el metal puede retomar el alza si el plan fiscal de EE.UU. decepciona al mercado.',
    contenido: `El oro al contado cotiza en US$ 3,320 por onza troy al cierre europeo, retrocediendo 1.1% desde el récord histórico de US$ 3,358 alcanzado el martes. La corrección obedece a una toma de ganancias institucional de corto plazo, particularmente de fondos hedge que habían acumulado posiciones largas en la semana de la rebaja de Moody's. El metal sigue acumulando un alza del 18.7% en el año 2026.

Desde el análisis técnico, el nivel de US$ 3,280 por onza representa el soporte inmediato más relevante: es la media móvil de 20 días y coincide con el máximo histórico previo del 28 de abril. Una ruptura por debajo de ese nivel con cierre diario abriría el camino hacia US$ 3,220, donde confluyen la media móvil de 50 días y el retroceso Fibonacci del 38.2% de la última pierna alcista. Los analistas de Commerzbank y BNP Paribas consideran ese nivel como una oportunidad de compra en el contexto del ciclo alcista de largo plazo.

La demanda física de oro también se mantiene robusta. Las importaciones de oro de India en abril alcanzaron 62 toneladas, un 34% más que en abril de 2025, impulsadas por la temporada de bodas y la demanda de joyería de lujo. China importó 28 toneladas netas, principalmente para reforzar reservas del banco central.

Las tenencias del ETF SPDR Gold Trust cayeron 0.4 toneladas el martes, la primera reducción en 12 sesiones, confirmando la toma de ganancias. Sin embargo, los flujos de las últimas cuatro semanas son positivos netos por US$ 3,800 millones, indicando que el dinero institucional sigue buscando refugio en el metal.`,
    analisis: `Una corrección del oro desde US$ 3,358 hasta US$ 3,320 es normal dentro de una tendencia alcista saludable. El soporte en US$ 3,280 es relevante para quienes tienen activos denominados en oro o monedas ligadas a él. Para el tipo de cambio peruano, el oro alto sigue siendo positivo porque sostiene los ingresos de exportación en dólares y el superávit comercial que aprecia el sol.

Si posees dólares y quieres protegerte contra la depreciación del billete verde a largo plazo, el oro en retrocesos hacia US$ 3,280-3,300 es históricamente atractivo en el ciclo actual. La tendencia estructural alcista — sostenida por compras de bancos centrales, deuda fiscal de EE.UU. y demanda de electrificación — no ha cambiado.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7613843/pexels-photo-7613843.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i012',
    titulo: 'Bitcoin supera US$ 107,000 por primera vez en tres semanas — ETFs de BTC acumulan US$ 2,100 millones en entradas netas en cinco días',
    descripcion: 'Bitcoin avanzó 4.8% hasta US$ 107,200 impulsado por entradas masivas a los ETFs spot de BTC en EE.UU. y por la narrativa de refugio ante la debilidad fiscal estadounidense. Ethereum subió 3.2% hasta US$ 2,890 y el mercado cripto total superó los US$ 3.4 billones de capitalización.',
    contenido: `Bitcoin superó el nivel de US$ 107,000 el miércoles por primera vez desde el 29 de abril, avanzando 4.8% en el día hasta US$ 107,200. La ruptura del nivel de resistencia de US$ 105,000 fue acompañada de un volumen de spot en exchanges centralizados de US$ 38,000 millones en 24 horas, el mayor desde el 15 de enero.

Los ETFs spot de Bitcoin en Estados Unidos registraron entradas netas de US$ 2,100 millones en los últimos cinco días de cotización, según datos de Bloomberg Intelligence. El iShares Bitcoin Trust (IBIT) de BlackRock lideró con entradas de US$ 890 millones, seguido por el Fidelity Wise Origin Bitcoin Fund (FBTC) con US$ 620 millones y el ARK 21Shares Bitcoin ETF (ARKB) con US$ 310 millones. El total de activos bajo gestión de ETFs de BTC en EE.UU. supera ahora los US$ 112,000 millones.

El contexto macroeconómico de debilidad fiscal estadounidense está relanzando la narrativa de Bitcoin como "oro digital" y cobertura contra la depreciación del dólar. Michael Saylor, presidente ejecutivo de MicroStrategy, que acumula 214,000 BTC en el balance de la empresa, declaró que la rebaja de Moody's "valida el argumento" para que corporaciones e instituciones trasladen reservas de efectivo en dólares hacia Bitcoin.

Ethereum también avanzó 3.2% hasta US$ 2,890, beneficiado por el fuerte volumen en DeFi y el incremento de la demanda de staking. El índice de dominancia de Bitcoin subió a 61.4%, el nivel más alto en cuatro meses.`,
    analisis: `Bitcoin en US$ 107,000 no tiene impacto directo en el tipo de cambio PEN/USD, pero refleja un entorno de desconfianza hacia los activos denominados en dólares. Si la narrativa de "dólar débil / activos alternativos fuertes" se consolida, beneficia estructuralmente al sol peruano y a los commodities que exporta Perú (oro, cobre).

Para quienes operan en el mercado de cambios peruano, Bitcoin puede ser un termómetro del apetito de riesgo global. Un BTC cayendo bruscamente señala risk-off y puede llevar temporalmente a un dólar más fuerte y un sol más débil. Un BTC alcista, como el actual, suele coincidir con flujos hacia activos emergentes y commodities — contexto favorable para el PEN.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i013',
    titulo: 'Argentina registra superávit fiscal primario de AR$ 890,000 millones en abril — el mayor desde 2008 y tercer mes consecutivo de equilibrio',
    descripcion: 'El Ministerio de Economía de Argentina informó que el sector público nacional alcanzó un superávit fiscal primario de AR$ 890,000 millones en abril de 2026, el mayor resultado positivo mensual desde 2008. El peso argentino cotiza en 1,050 por dólar en el mercado oficial, sin variación en cuatro semanas.',
    contenido: `El Ministerio de Economía de Argentina comunicó el resultado fiscal de abril de 2026 con un superávit primario de AR$ 890,000 millones, equivalentes a aproximadamente US$ 848 millones al tipo de cambio oficial de 1,050 pesos. Es el tercer mes consecutivo de superávit fiscal primario bajo la gestión del gobierno de Javier Milei, y el mayor resultado mensual desde mayo de 2008 cuando el gobierno Kirchner aún contaba con los excedentes del boom soyero.

El superávit obedece a una combinación de factores. Los ingresos fiscales crecieron 148% en términos nominales interanuales, impulsados por la mayor recaudación de Ganancias (por la eliminación de las exenciones en 2025) y por los derechos de exportación del agro en un contexto de precios de soja estables. El gasto primario creció 112% nominal, por debajo de la inflación acumulada del 140%, lo que representa un ajuste real del gasto de aproximadamente 28%.

El ministro de Economía, Luis Caputo, proyectó que el superávit primario del año completo alcanzará el 1.7% del PBI, lo que le permitirá a Argentina avanzar en la renegociación con el FMI y cumplir con los vencimientos de deuda soberana del segundo semestre sin necesidad de refinanciamiento externo de emergencia.

El dólar blue en Argentina cotiza en 1,380 pesos, con una brecha cambiaria del 31% respecto al dólar oficial. La brecha se redujo desde el pico de 180% de 2023, pero permanece elevada y es un factor de riesgo para la sostenibilidad del ancla cambiaria.`,
    analisis: `Un superávit fiscal de Argentina es una noticia regionalmente positiva porque reduce la probabilidad de una nueva crisis cambiaria argentina que genere contagio hacia economías vecinas. Cuando Argentina entra en crisis cambiaria, el dólar se fortalece en toda la región y el sol peruano tiende a debilitarse por efecto de portafolio.

Sin embargo, la brecha cambiaria del 31% sigue siendo un riesgo latente. Si Argentina no consolida el ajuste o el FMI endurece condiciones, puede haber una corrección que impacte temporalmente la percepción de riesgo emergente. Para el mercado peruano, el escenario base es de estabilidad regional, pero conviene monitorear.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i014',
    titulo: 'Banco de la República de Colombia recorta tasa a 8.50% — peso colombiano se aprecia a 3,960 por dólar ante expectativa de más recortes',
    descripcion: 'La Junta Directiva del Banco de la República de Colombia redujo su tasa de interés de política monetaria en 50 puntos básicos hasta 8.50%, el nivel más bajo desde agosto de 2023. El peso colombiano se apreció 1.8% hasta 3,960 por dólar, anticipando que el ciclo de recortes continuará en julio.',
    contenido: `La Junta Directiva del Banco de la República de Colombia decidió por seis votos contra uno reducir la tasa de intervención en 50 puntos básicos hasta 8.50% anual, en su reunión del 21 de mayo de 2026. Es el noveno recorte consecutivo desde que inició el ciclo de relajamiento monetario en diciembre de 2023, cuando la tasa alcanzó el pico de 13.25%. Acumulado el ciclo, la tasa se ha reducido 475 puntos básicos.

El gerente del Banco de la República, Leonardo Villar, justificó la decisión en que la inflación de abril cerró en 5.1% anual, continuando la tendencia de desaceleración desde el pico de 13.3% de 2023, aunque todavía por encima del rango meta de 2%-4%. Las proyecciones del banco central sitúan la inflación en 3.8% para el cierre de 2026, dentro del rango meta por primera vez desde 2021.

El peso colombiano reaccionó con una apreciación del 1.8% hasta 3,960 pesos por dólar, el nivel más alto desde enero. El mercado interpreta que el ciclo de recortes continuará, con el banco central proyectando la tasa terminal del ciclo entre 7.00% y 7.50% para finales de 2026. Los flujos de portafolios hacia títulos de deuda pública colombiana (TES) también aumentaron, atraídos por el diferencial de tasas reales positivo.

La economía colombiana creció 2.8% en el primer trimestre, ligeramente por debajo del 3.1% proyectado, debido a la debilidad del consumo privado. El banco central espera que los recortes de tasas estimulen el crédito de consumo y aceleren el crecimiento hacia 3.2% en el segundo semestre.`,
    analisis: `Los recortes de tasa en Colombia son positivos para el peso colombiano en la medida en que reflejan normalización macroeconómica, pero reducen el diferencial de tasas con EE.UU. Si la Fed recorta en julio como proyecta el mercado, el diferencial Colombia-Fed se mantendría en 400 pbs, todavía atractivo para carry traders.

Para el mercado peruano, una Colombia estabilizada con menor inflación y crecimiento positivo es una referencia regional favorable. Si los mercados interpretan que el ciclo de recortes en Latinoamérica es ordenado (Colombia, Chile, Perú a continuación), el riesgo emergente latinoamericano baja y eso beneficia a todas las divisas de la región, incluido el sol.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i015',
    titulo: 'Chile reporta inflación del 3.8% en abril — dentro del rango meta del Banco Central y favorece continuación del ciclo de recortes',
    descripcion: 'El Instituto Nacional de Estadísticas de Chile publicó que el IPC de abril cerró en 3.8% anual, dentro del rango meta de 3% ± 1 punto. El dato abre espacio para que el Banco Central de Chile recorte su tasa de política monetaria de 5.00% a 4.75% en la reunión de junio.',
    contenido: `El Instituto Nacional de Estadísticas (INE) de Chile informó que el Índice de Precios al Consumidor (IPC) de abril de 2026 registró una variación anual de 3.8%, dentro del rango meta del Banco Central de Chile de 3% ± 1 punto porcentual y por debajo del 4.1% registrado en marzo. La inflación mensual fue de 0.3%, también menor al 0.5% de marzo y al 0.4% del consenso de mercado.

El presidente del Banco Central de Chile, Rosanna Costa, señaló en una declaración pública que el dato "es consistente con la senda de convergencia proyectada" y que la junta evaluará en su próxima reunión del 17 de junio si las condiciones justifican un recorte adicional. Los analistas del mercado local asignan un 78% de probabilidad a un recorte de 25 puntos básicos en junio, lo que llevaría la tasa de política a 4.75%.

El peso chileno reaccionó positivamente, apreciándose 0.9% hasta 951 pesos por dólar, el nivel más fuerte desde febrero. La apreciación del peso chileno se suma a la tendencia regional de fortalecimiento de monedas latinoamericanas ante la debilidad del DXY post-rebaja Moody's.

La economía chilena creció 2.6% en el primer trimestre, impulsada por la exportación de cobre y litio. El precio del litio, que tocó mínimos históricos en 2024, se recuperó a US$ 14,200 por tonelada en el spot market, beneficiado por la creciente demanda de baterías para vehículos eléctricos. Los ingresos fiscales de CODELCO también mejoraron por el cobre alto.`,
    analisis: `Una inflación chilena convergiendo al rango meta y un peso apreciándose son señales de estabilidad macroeconómica en la segunda economía del Pacífico sudamericano. El ciclo de recortes de Chile, que inició antes que Perú y Colombia, sirve de referencia para lo que puede esperarse en la región.

Para el sol peruano, el contexto regional de monedas fuertes (CLP apreciándose, COP recuperándose, PEN en mínimos del año) es positivo porque refleja fundamentos sólidos en el Pacífico latinoamericano que atraen flujos de portafolio institucional. Este contexto reduce la presión de salida de capitales de la región y apoya a todas las monedas locales.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-05-23T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14751274/pexels-photo-14751274.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-22T08:00:00.000Z',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29007044/pexels-photo-29007044.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/22484275/pexels-photo-22484275.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/32048366/pexels-photo-32048366.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407691/pexels-photo-10407691.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831706/pexels-photo-5831706.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/6771008/pexels-photo-6771008.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/22690629/pexels-photo-22690629.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28682356/pexels-photo-28682356.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    fecha: '2026-05-21T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14747539/pexels-photo-14747539.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
