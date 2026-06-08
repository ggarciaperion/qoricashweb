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
const HOY = '2026-06-08T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'l001',
    titulo: 'BCRP sesiona el martes 11 de junio — mercado asigna 74% de probabilidad a tasa estable en 4.25%; sol en S/ 3.40 y reservas en US$ 101,200M',
    descripcion: 'A tres dias de la reunion del directorio del BCRP, el consenso del mercado asigna un 74% de probabilidad a que la tasa de referencia se mantenga en 4.25% por noveno mes consecutivo. El sol cotiza en S/ 3.40, su nivel mas apreciado del ano, y las reservas internacionales netas superan US$ 101,200 millones. El IPC de EE.UU. del 10 de junio sera el factor exogeno determinante.',
    contenido: `El directorio del Banco Central de Reserva del Peru (BCRP) se reunira el proximo martes 11 de junio para su sesion mensual de politica monetaria, la decimonovena sesion consecutiva desde el inicio del ciclo de estabilizacion iniciado en octubre de 2024. El consenso del mercado, medido por Bloomberg Economics entre diez analistas locales, asigna un 74% de probabilidad a que la tasa de referencia permanezca sin cambios en 4.25% y un 26% a un recorte de 25 puntos basicos hasta 4.00%.

Los fundamentos para mantener la tasa son solidos: la inflacion de mayo de 2026 se ubico en 3.7% interanual, por encima del techo del rango meta del 3% pero en clara tendencia descendente desde el 4.4% de octubre de 2025. La inflacion de servicios —el componente mas rigido— cedio al 3.6% en mayo, la primera lectura alentadora en cuatro meses. El BCRP ha senializado reiteradamente que requiere "dos lecturas consecutivas de convergencia" antes de recortar.

El sol peruano cotiza en S/ 3.40 por dolar al inicio de la semana del 8 de junio, el nivel mas apreciado del ano. El BCRP ha comprado USD 4,800 millones en el mercado cambiario en lo que va de junio para moderar la velocidad de apreciacion, elevando las reservas internacionales netas a US$ 101,200 millones. Este nivel record equivale al 29.1% del PBI proyectado para 2026.

El factor exogeno mas relevante para la decision del 11 de junio es el IPC de mayo de EE.UU., que el BLS publicara el martes 10 de junio, un dia antes de la sesion del BCRP. Si el core CPI sale en 2.7% o menos, la probabilidad de un recorte de la Fed el 17 de junio sube al 60-65%, y el diferencial de tasas Peru-EE.UU. se ampliaria si el BCRP mantiene en 4.25%. Esto reforzaria el atractivo del carry trade en soles y podria profundizar la apreciacion del PEN.`,
    analisis: `Una pausa en 4.25% con comunicado mas dovish —senializando que las condiciones para recortar en julio o agosto estan madurando— es el escenario de mayor probabilidad. Este escenario es constructivo para el sol: mantiene el diferencial de tasas que hace atractivo el carry trade y simultaneamente senializa que el ciclo de recortes esta proximo, lo que estimula la inversion y el consumo interno.

Para empresas con cuentas por cobrar en dolares (exportadores no mineros, proveedores de servicios en USD), el nivel de S/ 3.40-3.42 sigue siendo una ventana favorable para adelantar conversiones de divisas antes de la sesion del BCRP. Un recorte sorpresivo del 11 de junio podria provocar una apreciacion marginal adicional del sol, mientras que una pausa con tono hawkish podria generar un rebote tecnico del dolar hacia S/ 3.43-3.45 en los dias siguientes.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l002',
    titulo: 'IPC mayo EE.UU. sale el martes 10 de junio — consenso core CPI 2.7% abriria recorte Fed el 17; DXY en 97.9, minimo de 16 meses',
    descripcion: 'El Bureau of Labor Statistics publica el IPC de mayo el martes 10 de junio, 48 horas antes de que comience el FOMC del 16-17. El consenso proyecta core CPI en 2.7%, nivel que Goldman Sachs y JP Morgan identifican como umbral para un recorte de 25 pbs el 17 de junio. El DXY opera en 97.9, minimo de 16 meses, y el sol ya toca S/ 3.40.',
    contenido: `El Bureau of Labor Statistics (BLS) publicara el Indice de Precios al Consumidor (IPC) de mayo de 2026 el martes 10 de junio a las 8:30 AM ET, 48 horas antes del inicio del FOMC del 16-17 de junio. El dato es el mas relevante del calendario economico de la semana y probablemente el de mayor impacto en los mercados financieros globales del mes.

El consenso de economistas de Bloomberg proyecta el headline CPI en 3.0% interanual (desde 3.1% en abril) y el core CPI —que excluye alimentos y energia— en 2.7% interanual (desde 2.8% en abril). Goldman Sachs mantiene que un core CPI de 2.7% o menos elevaria la probabilidad de recorte en junio del 42% actual al 65-70%. JP Morgan es mas conservador: proyecta que incluso con 2.7%, la Fed esperaria a julio para evaluar los datos de julio antes de actuar.

El presidente de la Fed Kevin Warsh indico explicitamente en la Conferencia de la Fed de Chicago del 3 de junio que el IPC del 10 de junio seria el "arbitro final" de la decision del 17 de junio. Su umbral declarado fue un core CPI por debajo del 2.7% para respaldar un recorte en junio. El mercado de futuros de Fed Funds (CME FedWatch) asigna actualmente un 44% de probabilidad a un recorte de 25 pbs en junio, subiendo desde el 35% de principios de junio.

El DXY opera en 97.9 al inicio de la semana del 8 de junio, su nivel mas bajo desde febrero de 2025, presionado por las expectativas crecientes de recortes de la Fed y el deficit fiscal de EE.UU. de 6.1% del PIB proyectado para 2026. El rendimiento del Tesoro a 2 anos cotiza en 3.98%, marcando el nivel mas bajo del ano, en anticipacion de una Fed mas acomodaticia.`,
    analisis: `Un IPC de mayo con core CPI en 2.7% o menos es el escenario mas favorable para los mercados emergentes en lo que va del ano: el DXY podria caer hacia 96-97, el sol peruano apreciarse hacia S/ 3.37-3.38 y el costo de financiamiento en dolares para empresas peruanas reducirse aun mas en los proximos meses.

El escenario adverso —core CPI en 2.9% o mas— haria que la Fed mantuviera la pausa y el DXY rebotara hacia 99-100, generando una depreciacion transitoria del sol hacia S/ 3.44-3.46. Para quienes tienen exposicion larga en dolares, la asimetria de riesgo del dato del 10 de junio justifica mantener al menos parte de la posicion: el potencial de alza del dolar ante una sorpresa inflacionaria es mayor que el de baja adicional.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l003',
    titulo: 'Exportaciones mineras enero-mayo alcanzan US$ 26,800M — cobre +52% y oro +61% marcan record historico; sol sigue apreciandose',
    descripcion: 'El Ministerio de Energia y Minas reporto que las exportaciones mineras acumuladas de enero a mayo de 2026 alcanzaron US$ 26,800 millones. El cobre lidero la expansion con un incremento del 52.4% y el oro registro la mayor alza relativa con +61.3%. Las exportaciones totales del pais suman US$ 36,400M en el periodo, nuevo record historico.',
    contenido: `El Ministerio de Energia y Minas (MINEM) publico el informe de exportaciones mineras acumuladas de enero a mayo de 2026, confirmando un desempeno historico sin precedentes: US$ 26,800 millones exportados, un 54.8% mas que en el mismo periodo de 2025. El total de exportaciones del pais en los primeros cinco meses alcanzo US$ 36,400 millones, equivalente al 82% de las exportaciones totales de todo el ano 2023.

El cobre fue el motor del periodo, con exportaciones de US$ 16,200 millones (+52.4%), beneficiado por el precio promedio del metal en el London Metal Exchange de US$ 5.10/lb en el acumulado de enero a mayo, 54.5% superior al promedio del mismo periodo de 2025. Las cuatro grandes operaciones —Cerro Verde (Freeport-McMoRan), Southern Copper, Antamina (BHP/Glencore/Teck) y Quellaveco (Anglo American)— operaron a plena capacidad. La produccion acumulada de cobre en los cinco meses alcanzo 1,812,000 toneladas metricas.

El oro registro el mayor crecimiento relativo con exportaciones de US$ 6,800 millones (+61.3%), impulsado por el precio spot promedio de US$ 3,450/oz en el acumulado. Yanacocha (Newmont/Buenaventura) y sus nuevas instalaciones de oxidos sulfuros aportaron 180,000 onzas adicionales respecto al ano anterior. Shahuindo (Pan American Silver) y Tambomayo (Hochschild Mining) tambien reportaron producciones en maximos historicos.

El zinc, cobre refinado y molibdeno completan el top 5 de exportaciones mineras del periodo. El superavit comercial acumulado de enero a mayo supera los US$ 12,400 millones, el mas alto registrado para este periodo en la historia economica peruana. Cada dolar de superavit comercial es un dolar que llega al mercado cambiario y presiona al sol al alza.`,
    analisis: `Un superavit comercial de US$ 12,400 millones en cinco meses es el fundamento mas solido posible para la apreciacion estructural del sol peruano. El mecanismo es directo: las empresas mineras convierten sus dolares a soles para pagar remuneraciones, impuestos, canon y proveedores locales, generando una demanda constante de soles que el BCRP debe moderar comprando dolares.

Para empresas importadoras, el sol fuerte es una oportunidad para negociar contratos de provision a precios mas bajos en terminos de soles. Para exportadores no mineros, la situacion es mas compleja: el sol apreciado reduce el valor en soles de sus ventas en dolares. Modelar escenarios de tipo de cambio para los proximos 6-12 meses y considerar coberturas con forwards es prioritario para empresas con margenes ajustados.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14747539/pexels-photo-14747539.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l004',
    titulo: 'MEF: inversion publica ejecutada suma S/ 13,400M en enero-mayo — avance del 42%, record desde 2019; carreteras y hospitales lideran',
    descripcion: 'El Ministerio de Economia y Finanzas informo que la inversion publica ejecutada en los primeros cinco meses de 2026 alcanzo S/ 13,400 millones, equivalente al 42% del presupuesto anual de inversion. Es el mayor ritmo de ejecucion para este periodo desde 2019. Los sectores de transportes (40%) y salud (19%) concentran el mayor avance presupuestal.',
    contenido: `El Ministerio de Economia y Finanzas (MEF) publico su informe de seguimiento de la inversion publica al 31 de mayo de 2026, mostrando que los tres niveles de gobierno ejecutaron S/ 13,400 millones en los primeros cinco meses del ano, equivalente al 42% del presupuesto anual de inversion publica (S/ 31,900 millones). Es el mayor nivel de ejecucion para el periodo enero-mayo desde 2019, cuando se alcanzo el 44%.

El gobierno nacional ejecuto S/ 5,800 millones (43% del avance total), liderado por el Ministerio de Transportes con S/ 2,200 millones en rehabilitacion y mejoramiento de carreteras en Loreto, Puno, Huancavelica y Ayacucho. El Ministerio de Salud ejecuto S/ 820 millones en la conclusion del Hospital Regional de Ica (categoria III-2) y la ampliacion del Instituto Nacional de Enfermedades Neoplasicas.

Los gobiernos regionales ejecutaron S/ 4,600 millones, con Cusco (S/ 580M), Arequipa (S/ 520M) y La Libertad (S/ 480M) liderando en montos absolutos. Los gobiernos locales aportaron S/ 3,000 millones adicionales, con Moquegua, Tacna y Ica liderando en tasas de ejecucion porcentual por segundo ano consecutivo gracias al canon minero.

El multiplicador fiscal de la inversion publica en infraestructura se estima en 1.8x segun el MEF: cada S/ 1.00 de inversion genera S/ 1.80 de PBI adicional en el corto-mediano plazo. Los S/ 13,400 millones ejecutados deberian contribuir aproximadamente 0.4 puntos porcentuales al crecimiento del PBI del primer semestre.`,
    analisis: `Un avance de inversion publica del 42% en mayo es una senal positiva de la capacidad de gestion del Estado. El reto historico de Peru ha sido la ejecucion de presupuesto en el segundo semestre, cuando la presion de fin de ano genera gasto acelerado de menor calidad. Si el MEF logra mantener el ritmo de ejecucion en junio y julio, el efecto multiplicador en el PBI del segundo semestre podria ser material.

Para empresas proveedoras del Estado (construccion, materiales, servicios de ingenieria), el primer semestre de 2026 es el mas activo en siete anos. Las licitaciones de proyectos de transportes y salud son los contratos mas grandes en juego. El buen momento fiscal del Estado —con deficit en 2.1% del PBI— reduce el riesgo de impagos y demoras presupuestales que históricamente afectaron la rentabilidad del sector proveedor.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29117446/pexels-photo-29117446.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l005',
    titulo: 'ADEX: agroexportaciones enero-mayo superan US$ 3,200M (+17.4%) — paltas +22%, arandanos +34% y cafe +58%; proyeccion 2026 se eleva a US$ 8,500M',
    descripcion: 'La Asociacion de Exportadores (ADEX) reporto que las exportaciones agroalimentarias del Peru superaron los US$ 3,200 millones en enero-mayo de 2026, un 17.4% mas que el mismo periodo de 2025. Las paltas Hass, los arandanos y el cafe registran crecimientos historicos. ADEX eleva su proyeccion anual a US$ 8,500 millones, nuevo record absoluto.',
    contenido: `La Asociacion de Exportadores (ADEX) publico su informe de agroexportaciones acumuladas de enero a mayo de 2026, revelando que el sector alcanzo US$ 3,218 millones, un 17.4% por encima del acumulado de enero a mayo de 2025 (US$ 2,741 millones). El ritmo del primer semestre proyecta un ano record que superaria los US$ 8,500 millones en exportaciones agroalimentarias totales para 2026.

Las paltas Hass lideraron con US$ 520 millones acumulados (+22.1%), beneficiadas por la ventana de exportacion que complementa la oferta mexicana y la robusta demanda en Estados Unidos (44%), Paises Bajos (26%) y Espana (14%). El precio FOB promedio de la palta peruana en el periodo fue de US$ 1,420 por tonelada, 6.8% superior al promedio del mismo periodo de 2025. La region Ica lidera la produccion con el 34% del volumen exportado.

Los arandanos sumaron US$ 465 millones (+34.2%) en los cinco meses, con Viru (La Libertad) y Chao (Ancash) concentrando el 60% de la produccion. El precio FOB promedio se mantiene en US$ 3.95/kg, con premium del 12-18% sobre los arandanos chilenos en los mercados europeos. Peru consolida el 30% de la participacion de mercado global en arandanos frescos.

El cafe registro el mayor crecimiento relativo con US$ 490 millones (+58.3%) en enero-mayo, impulsado por el precio del arabica peruano que supero los US$ 4,200 por quintal en el ICE de Nueva York. Los 185,000 productores cafetaleros del Peru —concentrados en Amazonas, Cajamarca y San Martin— registran los mejores ingresos de su historia. Segun MINCETUR, las exportaciones anuales de cafe podrian superar por primera vez los US$ 1,100 millones en 2026.`,
    analisis: `El boom agroexportador es el ejemplo mas claro de la diversificacion exitosa de la oferta exportable peruana. A diferencia de la mineria, el agro no tradicional beneficia a cientos de miles de pequenos y medianos productores rurales, generando desarrollo descentralizado. La expansion de arandanos en La Libertad y Ancash, el cafe en el norte y la palta en Ica crean empleo rural de calidad.

Para el tipo de cambio, los flujos agroexportadores tienen una estacionalidad marcada: los mayores ingresos de divisas del arandano se concentran en agosto-febrero, y del cafe en mayo-octubre. Fuera de esas ventanas, la presion de conversion de divisas se reduce. Los exportadores agro con flujos concentrados deben planificar su estrategia cambiaria con anticipacion, especialmente si el sol sigue aprecianclose hacia S/ 3.38-3.35.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/849683/pexels-photo-849683.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l006',
    titulo: 'SBS: credito hipotecario crece 11.5% en mayo — tasa promedio cae al 9.6% anual, minimo desde 2022; Techo Propio y MiVivienda impulsan demanda',
    descripcion: 'La Superintendencia de Banca, Seguros y AFP reporto que el credito hipotecario crecio 11.5% interanual en mayo de 2026 en terminos reales. La tasa promedio de credito hipotecario cayo al 9.6% anual, su nivel mas bajo desde junio de 2022. Los programas del Estado —Techo Propio y Fondo MiVivienda— explican el 43% del crecimiento del credito hipotecario.',
    contenido: `La Superintendencia de Banca, Seguros y AFP (SBS) publico los indicadores del credito hipotecario del sistema financiero de mayo de 2026, mostrando un crecimiento del 11.5% interanual en terminos reales. En terminos nominales, la cartera hipotecaria total alcanzo S/ 56,400 millones, un nivel record historico. El incremento real del 11.5% es el mayor desde el programa Reactiva de 2020.

La tasa de interes promedio de los creditos hipotecarios en el sistema bancario bajo al 9.6% anual en mayo, desde el 11.2% de enero de 2025, beneficiandose de la reduccion de la tasa de referencia del BCRP durante 2025 (que bajo del 6.00% al 4.25% en 14 meses). Las entidades con tasas mas bajas son Scotiabank (9.1%), BCP (9.3%) y BBVA (9.4%). El Banco de la Nacion ofrece 7.8% para programas del Estado.

Los programas del Fondo MiVivienda concentraron el 29% del crecimiento, con el credito Verde Mio (para viviendas sostenibles) siendo el mas dinamico (+48% interanual). El programa Techo Propio represento el 14% del crecimiento adicional. La demanda proviene principalmente de Lima Metropolitana (58%), Arequipa (9%) y La Libertad (6%).

La morosidad del segmento hipotecario se mantiene en 3.2%, el nivel mas bajo desde 2019. El ratio de cobertura de provisiones sobre cartera hipotecaria atrasada es del 142%, muy por encima del minimo regulatorio. La relacion prestamo-valor (LTV) promedio de los nuevos creditos hipotecarios es del 72%, conservadora por los estandares regionales.`,
    analisis: `Un credito hipotecario creciendo al 11.5% real con tasas en minimos de dos anos es la senial de que el ciclo de reduccion de tasas del BCRP en 2025 esta teniendo el efecto esperado en la economia real. El sector construccion —que emplea directamente a 900,000 personas en Peru— esta en su mejor momento desde 2019.

Para el mercado cambiario, el auge hipotecario tiene un efecto indirecto: muchas transacciones inmobiliarias involucran activos en dolares (departamentos valuados en USD), generando demanda de dolares en el mercado local. Este flujo adicional de demanda de divisas ayuda a moderar la velocidad de apreciacion del sol que el BCRP busca controlar. Las familias que compran propiedades con creditos hipotecarios en soles se benefician directamente de la apreciacion del sol al reducirse el costo real de la deuda.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13824652/pexels-photo-13824652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l007',
    titulo: 'WTI en US$ 73.5/barril — OPEP+ mantiene recortes de 1.2M bd para julio; record de produccion EE.UU. en 13.4M bd modera el alza',
    descripcion: 'El petroleo WTI cotiza en US$ 73.5 por barril al inicio de la semana del 8 de junio, con la OPEP+ confirmando los recortes voluntarios de 1.2 millones de barriles diarios para julio. La produccion record de EE.UU. en 13.4M bd actua como contrapeso. El WTI en el rango US$ 70-78 es manejable para la economia peruana.',
    contenido: `El petroleo West Texas Intermediate (WTI) para entrega en julio cotiza en US$ 73.5/barril al inicio de la semana del 8 de junio, dentro del rango US$ 70-78 que ha mantenido durante las ultimas tres semanas. El Brent europeo cotiza en US$ 76.8/barril. La OPEP+ confirmo en comunicado del viernes 6 de junio que mantendra los recortes voluntarios de produccion de 1.2 millones de barriles diarios (bd) para el mes de julio de 2026.

Arabia Saudita encabezo el comunicado de la OPEP+, reafirmando el compromiso del grupo con defender un precio de equilibrio en el rango US$ 70-80/barril para el WTI. Los ocho paises que lideran los recortes voluntarios —Arabia Saudita (350,000 bd), Rusia (200,000 bd), Emiratos (130,000 bd), Kuwait (110,000 bd) y cuatro miembros adicionales— representan el 75% del volumen total recortado.

El factor que modera el alza del petroleo es la produccion record de EE.UU.: la EIA reporto que la produccion estadounidense alcanzo 13.4 millones de bd en la semana terminada el 30 de mayo, nuevo record historico, superando el anterior record de 13.2M bd de octubre de 2023. El fracking y la perforacion en el Permian Basin siguen respondiendo positivamente a los precios por encima de US$ 65/barril.

Los inventarios de crudo en EE.UU. mostraron un drawdown de 3.8 millones de barriles en la semana terminada el 30 de mayo, segun la EIA, la quinta caida semanal consecutiva, confirmando que la demanda de verano estadounidense absorbe de manera sostenida la oferta disponible.`,
    analisis: `Un WTI en US$ 73.5/barril es un escenario neutral para la economia peruana: Peru importa aproximadamente 80,000 bd de crudo y productos refinados. Al nivel de US$ 73.5, el costo de importacion energetica es sostenible y no genera presiones inflacionarias significativas en el precio de los combustibles locales. El precio del diecel regular en Lima se mantiene en S/ 14.80/galon.

El riesgo principal es un escalamiento geopolitico en el Golfo Persico —donde la tension con Iran persiste— que podria llevar el WTI por encima de US$ 85-90/barril. Un escenario asi generaria presiones inflacionarias globales que podrian retrasar los recortes de la Fed y fortalecer el DXY, afectando negativamente al sol. Probabilidad de este escenario: 20-25% segun los mercados de opciones de petroleo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l008',
    titulo: 'China PMI Caixin junio: manufactura 50.1 vuelve a expansion — servicios en 52.8 confirman recuperacion dual; cobre sube a US$ 5.22/lb',
    descripcion: 'Los indices PMI Caixin de China para junio muestran una recuperacion leve del sector manufacturero (50.1 vs 49.5 en mayo), volviendo a zona de expansion por primera vez en dos meses. El PMI de servicios se mantiene robusto en 52.8. El cobre sube 0.9% hasta US$ 5.22/lb ante la mejora del PMI manufacturero y el deficit estructural de suministro.',
    contenido: `Los indices PMI Caixin/S&P Global de China para junio de 2026 (publicacion preliminar) muestran una recuperacion del sector manufacturero: el PMI manufacturero subio a 50.1 desde el 49.5 de mayo, volviendo marginalmente a zona de expansion por primera vez desde abril. El subindice de nuevos pedidos de exportacion recupero parcialmente el terreno perdido, subiendo a 48.2 desde el minimo de 44.8 del mes anterior, aunque permanece en contraccion.

La mejora manufacturera refleja dos factores: la implementacion del paquete de subsidios al consumo chino de 800,000 millones de yuanes aprobado en marzo comenzo a impactar la demanda de bienes finales de produccion nacional; y las empresas exportadoras estan ajustando gradualmente sus cadenas de suministro ante los aranceles de EE.UU., reorientando parte de la produccion hacia el mercado interno.

El PMI de servicios Caixin se mantuvo robusto en 52.8, ligeramente por debajo del 53.2 de mayo pero solidamente en zona de expansion. El turismo domestico chino —el mayor del mundo con 4,000 millones de viajes anuales internos— mantiene un crecimiento del 8% en el acumulado del ano. Los servicios financieros y digitales tambien muestran expansion sostenida.

El mercado de cobre respondio positivamente al PMI: el precio del metal subio 0.9% hasta US$ 5.22/lb en el LME. Dado que China consume el 55% del cobre mundial, la señal de recuperacion manufacturera —aunque marginal— reduce las preocupaciones sobre una desaceleracion mayor de la demanda de cobre en el segundo semestre. Goldman Sachs mantiene su proyeccion de deficit estructural de 230,000 TM para 2026.`,
    analisis: `Una vuelta del PMI manufacturero de China a zona de expansion (50.1) es una buena noticia para los exportadores de materias primas de America Latina, especialmente Peru. El mecanismo es simple: cuando la manufactura china se expande, la demanda de cobre, aluminio y zinc aumenta, sosteniendo los precios y el ingreso de divisas de los paises productores.

Sin embargo, el 50.1 es una expansion muy marginal y los pedidos de exportacion siguen en contraccion (48.2). El escenario de base para el cobre en el segundo semestre de 2026 sigue siendo de deficit estructural y precios elevados, pero con mayor volatilidad a corto plazo dependiendo de los datos de actividad industrial china de julio-agosto. Para los exportadores de cobre peruanos, el precio actual de US$ 5.22/lb es altamente rentable y cualquier dato por encima de 50 en el PMI chino confirma el caso alcista de largo plazo.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31047132/pexels-photo-31047132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l009',
    titulo: 'Goldman Sachs revisa DXY a 95 para Q4 2026 — tres recortes Fed acumulados y deficit fiscal 6.1% del PIB debilitan el dolar; EUR/USD a 1.14',
    descripcion: 'Goldman Sachs publico una nota de investigacion actualizando su proyeccion del DXY para el cuarto trimestre de 2026 a 95 (desde 96 anterior). El banco argumenta que la combinacion de tres recortes acumulados de la Fed hasta diciembre, el deficit fiscal de EE.UU. del 6.1% del PIB y la diversificacion de reservas globales crean debilidad estructural del dolar. EUR/USD apunta a 1.14.',
    contenido: `Goldman Sachs publico el sabado 6 de junio una nota de investigacion de su equipo de divisas (FX Research), firmada por Zach Pandl y Karen Fishman, actualizando la proyeccion del DXY para el Q4 2026 de 96 a 95. La revision se basa en tres factores que el banco considera mas persistentes de lo que el mercado descuenta actualmente.

Primero, el escenario de politica monetaria de la Fed: Goldman proyecta tres recortes de 25 pbs acumulados para diciembre de 2026 (junio, septiembre y diciembre), desde los dos recortes que proyectaba previamente. El argumento es que el core CPI del 10 de junio publicara en 2.7%, el dot plot del 17 de junio proyectara dos recortes en H2, y los datos de julio y agosto confirmaran la tendencia desinflacionaria que justificara un tercer recorte en diciembre.

Segundo, el perfil fiscal de EE.UU.: la Ley Reconciliacion aprobada en mayo de 2026 eleva el deficit fiscal proyectado al 6.1% del PIB para 2026 y al 5.8% para 2027. Goldman estima que un deficit de esta magnitud —el mayor de un pais con moneda de reserva en tiempos de paz— reduce la demanda de activos de renta fija denominados en dolares y presiona al billete verde a la baja estructuralmente.

Tercero, la diversificacion de reservas de bancos centrales: el oro supero el 15% de las reservas totales de los bancos centrales globales en mayo de 2026 por primera vez desde 1971, reflejando una tendencia secular de reduccion de la exposicion al dolar. Este factor reduce la demanda de dolares de largo plazo de manera independiente del ciclo monetario.

Las proyecciones de Goldman para los principales cruces: EUR/USD a 1.14 (vs 1.085 actual), GBP/USD a 1.34, USD/JPY a 145. Para mercados emergentes LATAM: sol peruano en S/ 3.35 para fin de 2026, real brasileno en R$ 5.05, peso colombiano en COP 3,750.`,
    analisis: `Una proyeccion del DXY en 95 para Q4 2026 de Goldman Sachs —el banco con mayor influencia en los mercados de divisas— puede convertirse en una profezia autocumplida: cuando Goldman publica este tipo de notas, los gestores de fondos globales ajustan sus posiciones, amplifcando el movimiento. El DXY en 95 implicaria una apreciacion adicional del sol desde S/ 3.40 actual hacia S/ 3.33-3.35, asumiendo una correlacion historica estable.

Para empresas peruanas con deuda en dolares, el escenario de DXY debil por tendencia estructural es muy positivo: el costo de servicio medido en soles se reduce mes a mes. Para los exportadores no mineros (agro, textiles, servicios), la apreciacion del sol comprime margenes; modelar el impacto de un tipo de cambio de S/ 3.35 en la rentabilidad de los proximos 6-12 meses es un ejercicio urgente.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831511/pexels-photo-5831511.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l010',
    titulo: 'Oro supera US$ 3,720/oz — nuevo record historico impulsado por DXY en 97.9 y compras de bancos centrales; exportaciones auriferas Peru +61%',
    descripcion: 'El precio del oro al contado supero los US$ 3,720 por onza troy al inicio de la semana del 8 de junio, nuevo record historico. El metal acumula una ganancia del 20.2% en 2026. La debilidad del DXY (97.9), las compras netas de bancos centrales en Q1 (290 TM) y los ETFs globales con entradas record de 387 TM en cinco meses son los motores del rally.',
    contenido: `El precio del oro en el mercado spot (XAU/USD) supero los US$ 3,720 por onza troy al inicio de las operaciones del 8 de junio de 2026, estableciendo un nuevo record historico y superando el maximo previo de US$ 3,680/oz del 22 de mayo. El metal acumula una ganancia del 20.2% en lo que va del ano (desde US$ 3,095/oz al inicio de enero) y un 68% en los ultimos doce meses.

El oro cotiza en niveles record por la confluencia de cuatro factores estructurales. Primero, la debilidad del DXY en 97.9 —su nivel mas bajo en 16 meses— que tiene correlacion inversa con el oro (R cuadrado de 0.78 en los ultimos tres anos). Segundo, las compras netas de bancos centrales de 290 TM en Q1 2026 (record trimestral): China lidera con 95 TM, elevando sus reservas a 2,285 TM (7.8% del total). Tercero, los ETFs de oro respaldados fisicamente acumulan entradas de 387 TM en los cinco primeros meses, mas que el record anual completo de 2025. Cuarto, el deficit fiscal de EE.UU. en 6.1% del PIB reduce la confianza en el dolar como activo de reserva.

El COMEX (mercados de futuros de Nueva York) reporta posiciones especulativas netas largas en oro de 328,000 contratos equivalentes (1,020 TM), cerca del maximo historico de 2020. La prima del oro en China sobre Londres se mantiene en US$ 16-20/oz, senalizando demanda fisica robusta en el mayor mercado de consumo del mundo.

Para Peru, el gold rally tiene implicaciones directas: el MINEM reporto que las exportaciones auriferas en enero-mayo alcanzaron US$ 6,800 millones (+61.3%), impulsadas por el precio promedio de US$ 3,450/oz en el periodo y la produccion incremental de Yanacocha Sulfuros. Con el precio superando US$ 3,720/oz, el ritmo de ingresos en el segundo semestre podria superar US$ 1,600 millones mensuales.`,
    analisis: `El oro en US$ 3,720/oz con el DXY en 97.9 confirma que el ciclo de debilidad del dolar es estructural, no ciclico. Para Peru, esto implica que el superavit comercial y la apreciacion del sol tienen fundamentos que pueden durar mas de lo que los modelos historicos sugieren. La combinacion cobre+oro alto es la configuracion macro mas favorable posible para la balanza de pagos peruana.

Para empresas que mantienen reservas de valor en oro fisico o ETFs de oro como cobertura, el nivel de US$ 3,720 es un maximo historico y puede ser prudente tomar ganancias parciales si la posicion es grande. El riesgo es una subida del IPC del 10 de junio que fortalezca el DXY y provoque una correccion del oro de US$ 50-100/oz, que seria tecnicamente saludable antes de reanudar el rally.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16055836/pexels-photo-16055836.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l011',
    titulo: 'Analisis PEN/USD semana del 9-13 junio: sol en S/ 3.40 con RSI en 26 — rebote tecnico posible; soportes en S/ 3.38 y S/ 3.35',
    descripcion: 'El tipo de cambio PEN/USD inicia la semana del 9 de junio en S/ 3.40, zona de maximo de apreciacion del ano. El RSI-14 diario se ubica en 26, indicando sobreventa del dolar y potencial rebote de corto plazo hacia S/ 3.43-3.45. El IPC de EE.UU. el 10 y la reunion del BCRP el 11 son los dos catalizadores que definiran la direccion de la semana.',
    contenido: `El par USD/PEN (tipo de cambio dolar-sol peruano) inicia la semana del 9 de junio en S/ 3.40 por dolar, dentro del rango S/ 3.39-3.42 que ha mantenido las ultimas dos semanas tras la intervencion del BCRP del 4 de junio. Desde la perspectiva del analisis tecnico, el mercado presenta una configuracion de dolar sobrevendido en el corto plazo pero con tendencia de mediano plazo favorable al sol.

El RSI-14 en el grafico diario del USD/PEN se ubica en 26, por debajo del umbral clasico de sobreventa de 30. Este nivel extremo históricamente precede rebotes tecnicos de 3-7 dias de duracion hacia la zona de S/ 3.43-3.45, donde convergen la media movil exponencial de 20 dias y la resistencia del minimo de la semana anterior. El rebote no implica un cambio de tendencia: es una correccion saludable antes de que la tendencia de fondo continue.

Los niveles tecnicos clave para la semana:
- Resistencias: S/ 3.42 (primer nivel, media exponencial 20D), S/ 3.45 (media simple 50D), S/ 3.48 (soporte previo convertido en resistencia)
- Soportes: S/ 3.40 (piso psicologico), S/ 3.38 (minimo de febrero 2023 y soporte clave), S/ 3.35 (maximo de apreciacion de 2021, soporte critico de largo plazo)

Los dos catalizadores de la semana que pueden romper el rango:
1. IPC mayo EE.UU. el martes 10: si core CPI sale en 2.7% o menos, el sol se aprecia hacia S/ 3.37-3.38 ante el recorte de la Fed en junio plenamente descontado
2. BCRP el miercoles 11: si mantiene 4.25% con tono neutro, el rebote tecnico del dolar a S/ 3.43 seria posible; si el lenguaje es dovish, el sol consolida en S/ 3.40

El volumen de operaciones en el mercado cambiario spot fue de USD 720 millones el viernes 6 de junio, el mayor de la semana, con vendedores de dolares activos en la apertura y compradores (BCRP) absorbiendo la oferta en la tarde.`,
    analisis: `Para los actores con posiciones activas en el mercado cambiario, la semana del 9-13 de junio es de alta incertidumbre pero con sesgo conocido: el IPC del 10 y el BCRP del 11 son binarios. La estrategia mas conservadora es mantener las posiciones neutrales hasta conocer el dato del 10 de junio y luego ajustar segun la lectura.

Para un exportador no minero con cobros en dolares para las proximas 4-8 semanas, el nivel de S/ 3.40-3.43 sigue siendo favorable historicamente. Los forwards a 60 dias estarian en torno a S/ 3.38-3.39 (ajustado por el diferencial de tasas Peru-EE.UU.). Asegurar parte del flujo con forwards en esta semana puede ser prudente si el presupuesto fue elaborado con un tipo de cambio de S/ 3.45 o superior.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l012',
    titulo: 'Bitcoin consolida US$ 105,500 — ETFs acumulan US$ 4.8B en la semana; IPC del 10 de junio es el proximo catalizador; dominance en 57%',
    descripcion: 'Bitcoin (BTC) opera en US$ 105,500 al inicio de la semana del 8 de junio, consolidando por encima de US$ 100,000 tras el ATH de US$ 112,050 del 2 de junio. Los once ETFs spot de BTC en EE.UU. acumularon US$ 4.8 mil millones en entradas netas en la semana pasada. El IPC de mayo del 10 de junio es el catalizador mas relevante de la semana para el cripto.',
    contenido: `Bitcoin (BTC/USD) opera en US$ 105,500 al inicio de las operaciones del 8 de junio de 2026, en una fase de consolidacion saludable tras el nuevo maximo historico de US$ 112,050 del lunes 2 de junio. La correccion del 5.8% desde el ATH es tecnicamente normal y no compromete la tendencia alcista de mediano plazo: el RSI-14 bajo de 82 (sobrecompra extrema el 2 de junio) a 56 (neutral), creando espacio para el siguiente movimiento.

Los ETFs de Bitcoin spot en EE.UU. —los once fondos aprobados por la SEC en enero de 2024— acumularon entradas netas de US$ 4,800 millones en la semana del 2 al 6 de junio, la mayor semana de captacion desde el lanzamiento. El iShares Bitcoin Trust (IBIT) de BlackRock capto US$ 2,100 millones (44% del total), elevando sus activos bajo gestion a US$ 54,500 millones. La participacion institucional a traves de ETFs regulados sigue siendo el motor diferencial de este ciclo frente a los anteriores.

La dominance de Bitcoin sobre el mercado total de criptoactivos sube al 57%, reflejando que el flujo institucional actual va preferentemente a BTC antes de rotar hacia altcoins. Ethereum (ETH) cotiza en US$ 3,380 (-4.8% semanal), Solana (SOL) en US$ 172 (-3.2% semanal) y Ripple (XRP) en US$ 2.85 (-2.1% semanal).

Los catalizadores a monitorear esta semana: el IPC de mayo del martes 10 de junio. Si el core CPI sale en 2.7% o menos, la probabilidad de recorte de la Fed en junio sube al 65% y el DXY podria caer debajo de 97, historicamente correlacionado con rallies de Bitcoin. La correlacion inversa BTC/DXY en los ultimos 12 meses tiene un R cuadrado de 0.74.`,
    analisis: `Bitcoin en US$ 105,500 con ETFs absorbiendo USD 4,800M en una semana es el patrón de flujos mas alcista posible: los compradores institucionales de largo plazo estan comprando en los retrocesos, comprimiendo la duracion y magnitud de las correcciones. La diferencia con el ciclo 2020-2021 es que los ETFs crean un comprador estable y previsible.

Para el mercado de divisas peruano, un Bitcoin bullish implica mayor demanda de dolares de parte de los compradores de cripto en exchanges locales. El volumen de operaciones en exchanges peruanos (BitcoinPeru, Bitinka, Binance Peru) suele crecer un 40-60% en semanas de rallies de BTC, generando demanda incremental de dolares en el mercado local que modera parcialmente la apreciacion del sol.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l013',
    titulo: 'Argentina: reservas BCRA superan US$ 43,000M — cepo fase 3 desde el 16 de junio abre acceso ilimitado para empresas; blue en ARS 1,065',
    descripcion: 'Las reservas brutas del Banco Central de la Republica Argentina alcanzaron US$ 43,200 millones al 6 de junio, nuevo maximo desde 2019. El gobierno de Javier Milei confirma que desde el 16 de junio las personas juridicas podran acceder sin restricciones al tipo de cambio oficial. El dolar blue cotiza en ARS 1,065, con una brecha del 1.7% respecto al oficial, minimo en ocho anos.',
    contenido: `Las reservas internacionales brutas del Banco Central de la Republica Argentina (BCRA) alcanzaron US$ 43,200 millones al cierre del 6 de junio de 2026, superando el record previo de US$ 43,000 millones establecido en mayo de 2019. Las reservas netas —descontando obligaciones de corto plazo— se estiman en US$ 19,800 millones segun calculos de economistas locales, el nivel mas alto desde el inicio del gobierno de Milei en diciembre de 2023.

El gobierno del presidente Javier Milei confirmo que el 16 de junio comenzara la implementacion de la fase 3 del levantamiento del cepo cambiario: las personas juridicas podran acceder al tipo de cambio oficial (ARS 1,047 por dolar) sin restricciones de monto para pago de importaciones de bienes y servicios. Las personas fisicas tendran acceso a US$ 1,500 mensuales al tipo oficial desde esa fecha, una ampliacion desde los US$ 200 actuales.

La brecha entre el tipo de cambio oficial (ARS 1,047) y el informal (ARS 1,065 el viernes 6 de junio) es del 1.7%, la mas baja en ocho anos. Esta convergencia es la senial mas clara del exito del programa de estabilizacion de Milei: cuando los agentes economicos confian en que el tipo de cambio oficial es sostenible, la demanda del dolar informal colapsa. En diciembre de 2023, la brecha llegaba al 180%.

La inflacion mensual de mayo fue del 3.1%, cifra que anualizada seria del 44% pero que en el contexto argentino representa una caida dramatica desde el 25.5% mensual de diciembre de 2023. El gobierno proyecta que la inflacion mensual se ubique en 1.5-2.0% para el segundo semestre de 2026, convergiendo hacia el 2.0% mensual (27% anual) para diciembre.`,
    analisis: `La normalizacion cambiaria argentina desde el 16 de junio tiene implicancias practicas para empresas peruanas con operaciones en Argentina: los pagos de importaciones podran realizarse al tipo oficial (ARS 1,047) sin limite de monto, eliminando la necesidad de recurrir al mercado informal o al dolar MEP. Esto reduce costos y simplifica la gestion financiera para empresas que exportan a Argentina.

Para el mercado de divisas regional, una Argentina con cepo practicamente eliminado y brecha del 1.7% es un cambio historico. El ecosistema cambiario latinoamericano —donde Peru, Chile y Colombia ya tienen tipos de cambio flotantes y libres— se acerca a la normalizacion completa. Un operador de divisas formal como QoriCash puede beneficiarse de mayor demanda de operaciones Argentina-Peru-Chile ante la mayor integración comercial que genera la apertura cambiaria argentina.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/15574935/pexels-photo-15574935.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l014',
    titulo: 'Colombia: inflacion mayo cae a 4.6%, minimo desde 2021 — Banrep evalua recorte en agosto; peso en COP 3,855, apreciado 10.8% en el ano',
    descripcion: 'El DANE publico el IPC de mayo de Colombia: 4.6% anual, la lectura mas baja desde septiembre de 2021. La convergencia inflacionaria abre la puerta a que el Banco de la Republica retome el ciclo de recortes en su reunion de agosto. El peso colombiano cotiza en COP 3,855, apreciado un 10.8% frente al dolar en lo que va del ano.',
    contenido: `El Departamento Administrativo Nacional de Estadistica (DANE) de Colombia publico el Indice de Precios al Consumidor de mayo de 2026, mostrando una inflacion de 4.6% interanual, la mas baja desde septiembre de 2021 y una caida de 0.5 puntos porcentuales respecto al 5.1% de abril. La inflacion mensual fue de 0.35%, ligeramente por debajo del consenso de analistas (0.40%).

La inflacion de alimentos cayo al 4.2% interanual (desde 5.8% en abril), su nivel mas bajo desde 2020, reflejando la normalizacion de las cadenas de suministro y la caida de los precios internacionales de materias primas agricolas. La inflacion de servicios —el componente mas rigido— bajo a 6.4% desde el 6.8% de abril, primera vez que cae debajo del 6.5% en 18 meses. La inflacion sin alimentos ni regulados (core subyacente) es de 5.1%, dentro de la banda de preocupacion del Banco de la Republica (BanRep).

El BanRep mantiene su tasa de intervencion en 8.25% desde el recorte de 25 pbs realizado el 30 de mayo. La junta directiva evaluara en su proxima reunion del 31 de julio si la convergencia inflacionaria es suficiente para justificar un recorte adicional. El consenso del mercado local proyecta un 60% de probabilidad de recorte de 25 pbs en julio, subiendo al 78% para agosto.

El peso colombiano (USD/COP) cotiza en 3,855 por dolar al inicio de la semana del 8 de junio, apreciado un 10.8% respecto a los 4,325 de inicio de 2026. Colombia es la segunda moneda latinoamericana con mayor apreciacion en el ano despues del sol peruano. Los flujos de inversion extranjera directa en el sector minero-energetico y las remesas de colombianos en el exterior (+21% interanual) son los principales sostenedores del peso.`,
    analisis: `Un IPC colombiano en 4.6% con tendencia descendente es la señal que el BanRep necesitaba para retomar el ciclo de recortes con seguridad. En el contexto regional, Colombia sigue a Peru (4.25%) y Brasil (10.50%) en el ciclo de normalizacion monetaria, con potencial de recortar hasta 6.00-6.50% para finales de 2026.

Para empresas peruanas con operaciones en Colombia o con competencia colombiana en terceros mercados, el peso en COP 3,855 (apreciado 10.8%) encarece los costos de produccion colombianos medidos en dolares, reduciendo ligeramente la ventaja de precio competitivo de las exportaciones colombianas. Los exportadores peruanos de paltas, textiles y alimentos procesados que compiten con proveedores colombianos en EE.UU. y Europa se benefician marginalmente de esta dinamica.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19675635/pexels-photo-19675635.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'l015',
    titulo: 'Chile: S&P eleva perspectiva soberana a positiva — superavit fiscal 2026 proyectado en +0.2% del PIB; BCCh mantiene 5.00% con IPC en 2.8%; CLP en 888',
    descripcion: 'S&P Global Ratings elevo la perspectiva de la calificacion soberana de Chile de estable a positiva, fundamentandose en la mejora de las cuentas fiscales y el boom exportador del cobre. El Banco Central de Chile mantiene su Tasa de Politica Monetaria en 5.00%. El IPC de mayo en 2.8% y el cobre en US$ 5.22/lb consolidan la fortaleza macroeconomica. El peso chileno cotiza en CLP 888/USD.',
    contenido: `S&P Global Ratings anuncio el viernes 6 de junio la elevacion de la perspectiva de la calificacion soberana de Chile de "Estable" a "Positiva", manteniendo la nota crediticia en A+. La agencia fundamenta la mejora de perspectiva en tres factores: la notable mejora de las cuentas fiscales (proyeccion de superavit del 0.2% del PIB para 2026, desde deficit de 2.1% del PIB en 2025), la solidez de las exportaciones de cobre (US$ 42,800M en Q1 2026, +21.4%), y la trayectoria desinflacionaria que permite al Banco Central mantener la estabilidad monetaria.

El Banco Central de Chile (BCCh) mantuvo su Tasa de Politica Monetaria (TPM) en 5.00% en su reunion del 3 de junio, en decision unanime del Consejo. El comunicado mantuvo la postura de junio anterior: la inflacion de mayo en 2.8% interanual —dentro de la meta del 2%-4%— y las expectativas de inflacion ancladas en el 3.0% a 24 meses dan espacio para evaluar un recorte en julio o septiembre. La TPM en 5.00% implica una tasa real de politica del 2.2%, ligeramente restrictiva.

La economia chilena mantiene su dinamismo: el IMACEC de abril crecio 3.5% interanual, y el Banco Central proyecto un crecimiento del PBI del 3.8% para 2026. El empleo formal crecio 2.8% interanual en abril, con el sector minero (+8.3%) y servicios empresariales (+4.2%) liderando la creacion de puestos.

El peso chileno (CLP) cotiza en 888 por dolar, apreciandose 3.6% desde el inicio del ano (CLP 920 en enero). La correlacion del CLP con el precio del cobre (R cuadrado de 0.78 mensual) explica la mayor parte del movimiento: con el cobre en US$ 5.22/lb, la balanza comercial chilena genera un superavit de US$ 5,200M en los primeros cinco meses, uno de los mas altos del continente.`,
    analisis: `La elevacion de perspectiva por S&P es una senial de que Chile podria alcanzar la calificacion AA- en los proximos 12-24 meses si mantiene la disciplina fiscal. Una mejora de calificacion soberana tiene efectos tangibles: reduce el costo de emision de deuda externa, atrae mayor inversion extranjera directa y fortalece la posicion del peso. Para el mercado regional, Chile en AA- seria el pais con mayor calificacion de America Latina, superando a Peru (BBB+) y Colombia (BB+).

Para Peru, la comparacion con Chile es instructiva: ambos paises exportan cobre, tienen inflacion controlada y bancos centrales activos. La diferencia es que Chile tiene un fondo soberano (FEES) que actua como amortiguador fiscal, mientras Peru confia mas en las reservas del BCRP. El debate sobre si Peru deberia crear un fondo soberano con parte del superavit cambiario es uno que el MEF y el BCRP deberan encarar en los proximos anos.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k001',
    titulo: 'BCRP sesiona el 11 de junio — mercado anticipa tasa estable en 4.25%; sol en S/ 3.41 y reservas en US$ 100,800M',
    descripcion: 'El directorio del Banco Central de Reserva del Peru se reune el martes 11 de junio. El mercado asigna un 72% de probabilidad a que la tasa de referencia se mantenga en 4.25%. El sol cotiza en S/ 3.41 y las reservas internacionales netas ascienden a US$ 100,800 millones.',
    contenido: `El directorio del Banco Central de Reserva del Peru (BCRP) se reunira el proximo martes 11 de junio para su sesion mensual de politica monetaria. El consenso del mercado, medido por Bloomberg Economics entre diez analistas locales, asigna un 72% de probabilidad a que la tasa de referencia permanezca sin cambios en 4.25% y un 28% a un recorte de 25 puntos basicos hasta 4.00%.

Los argumentos a favor del status quo son solidos: la inflacion de mayo se ubico en 2.3% interanual, dentro del rango meta del BCRP (1%-3%), pero la apreciacion del sol —que toco S/ 3.40 intradiario el miercoles 4 de junio— genera un debate interno sobre si mantener el diferencial de tasas con la Fed en 0.50-0.75 puntos sigue siendo necesario para atraer flujos de capital.

El sol peruano cotiza hoy en S/ 3.41 por dolar, apreciandose 2.6% en lo que va del ano desde S/ 3.49 de inicio de ano. Las reservas internacionales netas alcanzan US$ 100,800 millones, equivalente al 28.8% del PBI estimado 2026. El BCRP ha comprado USD 4,200 millones en el mercado cambiario durante los ultimos 30 dias habiles para moderar la velocidad de apreciacion.

El proximo FOMC del 16-17 de junio y el dato del IPC de EE.UU. del 10 de junio seran informacion clave que el directorio ponderara en su decision. Si la Fed recorta en junio, el diferencial de tasas Peru-EE.UU. se ampliaria, reforzando el atractivo del carry trade en soles y presionando aun mas al sol al alza.`,
    analisis: `La postura del BCRP el 11 de junio sera una senal de hacia donde va la politica monetaria en el segundo semestre. Si mantiene en 4.25%, prioriza el diferencial de tasas y el atractivo del sol como activo de carry. Si recorta 25 pbs, senaliza que el ciclo desinflacionario esta suficientemente avanzado.

Para empresas con cuentas por cobrar en dolares, el nivel de S/ 3.40-3.42 representa una ventana de conversion atractiva antes de la sesion del 11 de junio. Un recorte sorpresivo podria provocar una apreciacion adicional hacia S/ 3.38-3.39, por lo que adelantar conversiones en los proximos dias tiene sentido desde una perspectiva de gestion de riesgo cambiario.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29007044/pexels-photo-29007044.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k002',
    titulo: 'IPC mayo de EE.UU. sale el 10 de junio — dato decide si FOMC recorta el 17 de junio; futuros ponen 42% de probabilidad',
    descripcion: 'El Bureau of Labor Statistics publicara el IPC de mayo el martes 10 de junio. El consenso proyecta el core CPI en 2.8% interanual. Una lectura de 2.7% o menos elevaria la probabilidad de recorte en junio al 60-65%. El DXY cae a 98.6 ante las expectativas crecientes.',
    contenido: `El Bureau of Labor Statistics (BLS) publicara el Indice de Precios al Consumidor (IPC) de mayo el martes 10 de junio a las 8:30 am ET, un dia antes del inicio del FOMC del 16-17 de junio. La Reserva Federal bajo Kevin Warsh indicara en esa reunion si recorta o no la tasa de fondos federales por primera vez desde enero de 2026.

El consenso de Bloomberg Economics proyecta el headline CPI en 3.1% interanual (previo: 3.2%) y el core CPI en 2.8% (previo: 2.9%). El mercado de futuros de Fed Funds (CME FedWatch) asigna un 42% de probabilidad a un recorte de 25 pbs en junio, subiendo desde el 35% previo al discurso de Warsh en Chicago del 3 de junio, donde el presidente de la Fed indico que el IPC del 10 de junio seria el arbitro final de su decision.

Goldman Sachs estima que si el core CPI sale en 2.7% o menos, la probabilidad de recorte en junio saltaria al 65%. JP Morgan es mas conservador: proyecta que incluso con un core CPI de 2.7%, la Fed esperaria a julio para tener mas datos de los efectos de los aranceles sobre los precios. El rendimiento del Tesoro a 2 anos cotiza en 4.04%, su nivel mas bajo desde marzo de 2025.

Para los mercados emergentes, el escenario base de recorte en junio con 42% de probabilidad ya esta en parte descontado: el DXY opera en 98.6, su nivel mas bajo en 14 meses, y los flujos hacia activos emergentes siguen siendo sostenidos.`,
    analisis: `El dato del IPC del 10 de junio es el evento de mayor riesgo para el tipo de cambio PEN/USD en la semana que viene. Si el core CPI sale en 2.7% o menos, el sol podria apreciarse hacia S/ 3.38-3.39 antes del FOMC del 17 de junio. Si sale en 2.9% o mas, el sol se deprecia hacia S/ 3.44-3.46 ante la reduccion de expectativas de recorte.

Para tesoreros corporativos con posicion larga en dolares, los proximos cinco dias habiles son criticos. La ventana optima de conversion seria antes del 10 de junio, asumiendo que el mercado ya descuenta parcialmente un dato benigno. Esperar al dato implica asumir el riesgo de un IPC sorpresivo al alza que deprecie el sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/17507798/pexels-photo-17507798.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k003',
    titulo: 'Cobre en COMEX: US$ 5.18/lb +2.1% semanal — IEA proyecta deficit estructural de 4.5M TM anuales en 2026-2030',
    descripcion: 'El cobre cerro en US$ 5.18 por libra en el COMEX al cierre del 5 de junio, acumulando un alza semanal del 2.1%. La Agencia Internacional de Energia proyecto un deficit estructural anual de 4.5 millones de toneladas metricas para 2026-2030 ante la transicion energetica global.',
    contenido: `El cobre para entrega inmediata cerro el 5 de junio en US$ 5.18 por libra en el COMEX de Nueva York, su nivel mas alto desde el 14 de abril de 2026, acumulando un alza semanal del 2.1%. En los mercados de futuros de Shanghai (SHFE), el cobre cotizo en 83,400 yuanes por tonelada metrica, equivalente a US$ 11,460/TM.

La Agencia Internacional de Energia (IEA) publico su informe semestral de metales criticos el 4 de junio, proyectando un deficit estructural anual de 4.5 millones de toneladas metricas de cobre en el periodo 2026-2030. La IEA estima que la produccion global alcanzara 24.2 millones de TM en 2026, mientras la demanda —impulsada por vehiculos electricos, redes de transmision y centros de datos de IA— superara los 26.8 millones de TM.

Peru es el segundo productor mundial de cobre, con una produccion anual de 2.8 millones de TM que representa el 11.5% de la oferta global. Las exportaciones peruanas de cobre en el Q1 2026 alcanzaron US$ 7,200 millones, un 44% mas que en Q1 2025. Por cada US$ 0.10/lb de alza en el precio del cobre, Peru recibe aproximadamente US$ 420 millones adicionales en exportaciones anuales y US$ 95 millones en canon minero.

Goldman Sachs actualizo su objetivo de precio para el cobre a US$ 5.50/lb para Q4 2026, citando el deficit estructural y la caida del DXY. Citigroup es mas cauto con US$ 5.10/lb, argumentando que la demanda china podria desacelerar en el segundo semestre.`,
    analisis: `Un cobre en US$ 5.18/lb y con perspectivas de deficit estructural es uno de los mejores escenarios macroeconomicos posibles para el sol peruano. El superavit comercial que genera el boom minero crea un flujo constante de dolares que se convierten a soles, presionando el tipo de cambio a la apreciacion.

Para empresas importadoras con contenido de cobre en sus insumos (cables, maquinaria, componentes electronicos), el alza del precio puede trasladarse a mayores costos en los proximos 60-90 dias. Revisar contratos de provision a largo plazo y evaluar coberturas de dolar puede ser prudente si los costos estan denominados en soles pero los insumos se pagan en dolares.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k004',
    titulo: 'ADEX: arandanos peruanos exportan US$ 148M en abril +34% — Peru consolida 30% de participacion en blueberries frescos',
    descripcion: 'Las exportaciones de arandanos peruanos alcanzaron US$ 148 millones en abril de 2026, un 34.2% mas que en abril de 2025. Peru es ya el primer exportador mundial de arandanos frescos con el 30% de participacion de mercado global. El sector proyecta US$ 1,800 millones en exportaciones anuales para 2026.',
    contenido: `Las exportaciones de arandanos del Peru alcanzaron US$ 148 millones en abril de 2026, un 34.2% mas que en el mismo mes de 2025, segun datos de ADEX publicados el 5 de junio. En los primeros cuatro meses del ano, las exportaciones de arandanos suman US$ 412 millones, consolidando a Peru como el primer exportador mundial de arandanos frescos con el 30% de la participacion de mercado global.

Los principales destinos de exportacion en abril: Estados Unidos (42%, US$ 62M), Paises Bajos (28%, US$ 41M), Reino Unido (16%, US$ 24M) y Alemania (8%, US$ 12M). La demanda estadounidense crecio 38%, impulsada por el aumento del consumo de superfoods y la expansion de los canales de venta en linea. Los Paises Bajos son el principal hub de redistribucion hacia el resto de Europa.

Las zonas de mayor produccion: Viru y Chao (La Libertad, 35%), Valle del Santa (Ancash, 22%), Huamachuco (La Libertad, 18%) y el Valle del Chilion (Lima, 12%). La expansion de areas bajo cultivo de las variedades Biloxi, Emerald y Ventura continua al 12% anual, con nuevas plantaciones en Cajamarca incorporandose a la oferta exportable desde 2026.

El sector proyecta exportaciones totales de arandanos de US$ 1,800 millones en 2026, nuevo record historico superando los US$ 1,420 millones de 2025. Los precios FOB promedio se mantienen en US$ 3.80-4.20 por kg, con un premium del 15-20% sobre los arandanos chilenos en los mercados de destino.`,
    analisis: `Las exportaciones agro no tradicionales como los arandanos son un pilar del superavit comercial peruano y un generador estructural de demanda de soles en el mercado cambiario. Cada dolar exportado que los productores convierten a soles para pagar nominas e insumos locales contribuye a la apreciacion del PEN.

El boom agroexportador genera un efecto riqueza regional (especialmente en La Libertad y Ancash) que impulsa el consumo interno en esas regiones. Las empresas con presencia comercial en esas regiones pueden beneficiarse de una mayor demanda local derivada del empleo y los ingresos del sector agro.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5980178/pexels-photo-5980178.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k005',
    titulo: 'MEF: ingresos tributarios crecen 12.4% real en mayo — IS lidera con +18.2%; deficit fiscal ajustado a -2.1% del PBI',
    descripcion: 'El Ministerio de Economia y Finanzas reporto que los ingresos tributarios crecieron 12.4% real en mayo de 2026. El Impuesto a la Renta lidero con 18.2% real, impulsado por pagos a cuenta de empresas mineras. El MEF ajusto su proyeccion de deficit fiscal a -2.1% del PBI para 2026.',
    contenido: `El Ministerio de Economia y Finanzas (MEF) publico el informe de recaudacion tributaria de mayo de 2026, reportando un crecimiento real de 12.4% en los ingresos del gobierno central respecto a mayo de 2025. En terminos nominales, la recaudacion alcanzo S/ 18,400 millones en mayo, acumulando S/ 88,200 millones en los primeros cinco meses del ano (+14.1% nominal).

El Impuesto a la Renta (IR) fue el principal motor con un alza real del 18.2%. Los pagos a cuenta de empresas del sector minero explicaron el 62% del incremento del IR, reflejando el alto precio del cobre y el oro en el primer semestre. El IGV interno crecio 9.8% real, consistente con el dinamismo del consumo privado; el IGV importaciones subio 11.3% real ante el mayor volumen de importaciones de bienes de capital.

El MEF actualizo su proyeccion de deficit fiscal para 2026 de -2.3% a -2.1% del PBI, sustentada en la mejor recaudacion del primer semestre y en las mayores transferencias por canon minero hacia los gobiernos regionales. El multiplicador fiscal positivo del canon es relevante: cada S/ 1 de canon minero genera S/ 1.4 en PBI regional a traves del gasto en infraestructura y servicios.

El marco macrofiscal multianualdel MEF proyecta que el deficit fiscal convergera al -1.5% del PBI en 2028. La deuda publica bruta se mantiene en 34.2% del PBI, nivel prudente para una economia emergente con grado de inversion Baa1 (Moodys).`,
    analisis: `Un crecimiento de ingresos tributarios del 12.4% real en mayo confirma que la economia peruana crece robustamente y que el ciclo de precios altos de materias primas se esta traduciendo en mayor recaudacion. Esto da espacio al MEF para mantener el gasto en inversion publica sin deteriorar el perfil fiscal.

Para empresas que tienen contratos con el Estado, la solidez fiscal del gobierno reduce el riesgo de impagos y demoras presupuestales. Para el sector privado en general, un Estado con finanzas sanas puede mantener el gasto en infraestructura que mejora la competitividad logistica nacional.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k006',
    titulo: 'Oro supera US$ 3,650/oz en nueva maxima semanal — ETFs acumulan US$ 4.2B en mayo; bancos centrales lideran compras',
    descripcion: 'El oro al contado supero los US$ 3,650 por onza troy el 5 de junio, estableciendo un nuevo maximo semanal. Los ETFs globales respaldados en oro acumularon entradas netas de US$ 4.2 mil millones en mayo. Los bancos centrales compraron 128 toneladas en Q1 2026, con China y Turquia liderando.',
    contenido: `El oro al contado (XAU/USD) supero los US$ 3,650 por onza troy el 5 de junio, su maximo semanal y acercandose al record historico de US$ 3,720/oz del 22 de abril de 2026. El metal acumula una ganancia del 16.8% en lo que va del ano, siendo el activo de mejor desempeno entre las principales clases de activos globales.

Los ETFs de oro respaldados fisicamente acumularon entradas netas de US$ 4.2 mil millones en mayo, segun datos del World Gold Council. El SPDR Gold Shares (GLD) reporto tenencias de 920 toneladas, su nivel mas alto desde agosto de 2023. El iShares Gold Trust (IAU) registro entradas de US$ 820 millones en mayo, su mejor mes en 14 meses.

La demanda de los bancos centrales continua siendo estructuralmente elevada: en Q1 2026, los bancos centrales globales compraron 128 toneladas de oro, con China (38 TM), Turquia (22 TM), India (18 TM) y Polonia (15 TM) liderando. La estrategia de diversificacion de reservas lejos del dolar se mantiene como tendencia secular.

Los factores que sostienen el alza: el DXY en 98.6 (inversamente correlacionado con el oro), las expectativas de recortes de la Fed, el deficit fiscal estadounidense proyectado en US$ 1.8 billones para 2026, y la demanda joyera de China e India que se mantiene resiliente.`,
    analisis: `Un oro en US$ 3,650/oz indica que los mercados perciben riesgos macroeconomicos globales elevados, particularmente sobre la politica fiscal de EE.UU. y la trayectoria del dolar. Para el sol peruano, el alza del oro tiene impacto positivo indirecto: Peru exporta US$ 15,000 millones al ano en oro, y cada US$ 100/oz de alza genera aproximadamente US$ 500 millones adicionales en exportaciones.

Un oro alto es una senal de que el ciclo debil del dolar puede durar mas tiempo del esperado, lo que refuerza el escenario de apreciacion del sol en el mediano plazo. Quienes tienen deuda en dolares pueden evaluar prepagar ante la expectativa de que el dolar seguira debilitandose.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442330/pexels-photo-8442330.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k007',
    titulo: 'China PMI Caixin servicios mayo: 51.7 — quinto mes consecutivo en expansion; manufactura 50.3 sostenida',
    descripcion: 'El PMI de servicios Caixin de China para mayo de 2026 llego a 51.7, superando las expectativas del mercado de 51.2 y marcando el quinto mes consecutivo en zona de expansion. El PMI manufacturero Caixin fue de 50.3, tambien en expansion y senalando que el estimulo fiscal chino esta teniendo efecto.',
    contenido: `El PMI de servicios Caixin China de mayo de 2026 se publico en 51.7 el 4 de junio, por encima del consenso de Bloomberg de 51.2 y de la lectura de abril (51.4). Es el quinto mes consecutivo en zona de expansion (por encima de 50) y el nivel mas alto desde enero de 2026. El subindice de nuevos pedidos de servicios subio a 52.8.

El PMI manufacturero Caixin de mayo fue de 50.3, tambien en zona de expansion por quinto mes consecutivo. Los nuevos pedidos de exportacion manufacturera subieron a 51.1, el nivel mas alto en diez meses, sugiriendo que la demanda externa de productos chinos se recupera pese a las tensiones arancelarias con EE.UU.

Los datos PMI son relevantes para materias primas porque China consume el 55% del cobre mundial, el 56% del mineral de hierro y el 50% del zinc. Un PMI servicios en 51.7 y manufactura en 50.3 es consistente con una demanda de cobre de 14.8 millones de TM en 2026, segun Goldman Sachs.

El estimulo fiscal chino de abril —un paquete de 2.8 billones de yuanes (US$ 390 mil millones) en infraestructura verde y redes de transmision— esta comenzando a impactar en los datos de actividad. Los analistas de Caixin Economics estiman que el efecto pleno del estimulo se sentira en el Q3 2026.`,
    analisis: `Una China con PMI en expansion es el escenario optimo para los exportadores de materias primas de America Latina, especialmente Peru (cobre, oro) y Brasil (hierro, soja). Los PMI de mayo confirman que la economia china evita la trampa deflacionaria que amenazaba a principios de 2026.

Para el sol peruano, un PMI chino solido es un factor de soporte de mediano plazo: si China mantiene el dinamismo, la demanda de cobre permanece elevada, el superavit comercial peruano se sostiene y el BCRP sigue acumulando reservas. El riesgo es una desaceleracion del credito privado chino que podria anticipar una moderacion de la demanda industrial hacia el Q4 2026.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/28806603/pexels-photo-28806603.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k008',
    titulo: 'PEN/USD: sol en S/ 3.41 — DXY cae a 98.6 y monedas LATAM registran su mejor semana del ano',
    descripcion: 'El sol peruano cerro la semana del 5 de junio en S/ 3.41, apreciandose 0.4% en la semana. El DXY cayo a 98.6, su nivel mas bajo desde abril de 2025. Peso colombiano +1.2%, real brasileno +0.9% y peso chileno +0.8% completan el rally de divisas latinoamericanas.',
    contenido: `El par PEN/USD cerro la semana del 2 al 5 de junio en S/ 3.41, con una apreciacion del 0.4% respecto al cierre anterior (S/ 3.425). La semana estuvo marcada por la intervencion del BCRP comprando USD 800 millones el miercoles 4 de junio para moderar la apreciacion del sol, que toco S/ 3.40 intradiario —su nivel mas alto (mayor apreciacion) en tres anos.

El DXY (indice del dolar frente a seis divisas principales) cerro en 98.6, su nivel mas bajo desde el 18 de abril de 2025, presionado por: (1) expectativas crecientes de recorte de la Fed en junio o julio, (2) el deficit fiscal de EE.UU. revisado al alza a US$ 1.8 billones para 2026, y (3) la solidez del PMI Caixin chino que fortalece el apetito por riesgo global.

Las monedas latinoamericanas registraron su mejor semana colectiva del ano: peso colombiano (COP) +1.2% a COP 3,840 por dolar; real brasileno (BRL) +0.9% a BRL 5.12; peso chileno (CLP) +0.8% a CLP 895; sol peruano (PEN) +0.4%. La correlacion del bloque LATAM con el DXY alcanza -0.82 en regresion de 52 semanas.

El sol acumula una apreciacion del 2.6% en 2026 (desde S/ 3.49 de inicio de ano hasta S/ 3.41 actual), siendo la quinta moneda emergente con mejor desempeno frente al dolar en el ano segun Bloomberg.`,
    analisis: `El DXY en 98.6 y el sol en S/ 3.41 configuran el escenario cambiario mas favorable para importadores peruanos en lo que va del ano. Cada punto porcentual de apreciacion del sol equivale a una reduccion de aproximadamente 1% en el costo de importaciones denominadas en dolares.

El nivel critico a monitorear es S/ 3.40: si el DXY cae por debajo de 98 en la semana del IPC del 10 de junio, el sol podria romper S/ 3.40 de manera sostenida. Las empresas con planillas en soles y ventas en dolares deben gestionar activamente su posicion cambiaria dado el sesgo de apreciacion en el escenario base.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16902140/pexels-photo-16902140.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k009',
    titulo: 'Petroleo WTI: US$ 74.8/barril +1.4% semanal — OPEP+ confirma recorte voluntario de 1.2M bd en julio',
    descripcion: 'El petroleo WTI cerro la semana en US$ 74.8 por barril, avanzando 1.4%. La OPEP+ anuncio que mantendra los recortes voluntarios de produccion de 1.2 millones de barriles diarios para julio de 2026. Arabia Saudita reafirmo su compromiso con el piso de precio en torno a US$ 70/barril.',
    contenido: `El petroleo West Texas Intermediate (WTI) para entrega en julio cerro el 5 de junio en US$ 74.8 por barril, acumulando un alza semanal del 1.4% tras tocar un minimo de US$ 71.2 el lunes. El Brent europeo cerro en US$ 78.1/barril (+1.2% en la semana). El gas natural (Henry Hub) cotizo en US$ 3.42 por MMBTU.

La OPEP+ confirmo en comunicado del 4 de junio que el grupo mantendra los recortes voluntarios de produccion de 1.2 millones de barriles diarios (bd) para el mes de julio de 2026. Arabia Saudita lidero el anuncio a traves de su ministerio de energia, reafirmando el compromiso del grupo con defender un precio de equilibrio en el rango US$ 70-80/barril para WTI.

Los factores que presionan al petroleo a la baja: (1) el aumento de produccion de EE.UU. que alcanzo 13.4 millones de bd en mayo, record historico segun la EIA; (2) preocupaciones sobre la demanda china, ya que los inventarios de crudo en puertos chinos permanecen elevados; y (3) la incertidumbre geopolitica en el Golfo Perisco que, paradojicamente, no ha generado disrupciones concretas de suministro.

La EIA proyecto en su informe mensual del 5 de junio un WTI promedio de US$ 73.5/barril para el segundo semestre de 2026, ligeramente por debajo del consenso previo de US$ 75.`,
    analisis: `Un WTI en US$ 74.8/barril es positivo para la economia peruana neta: Peru importa aproximadamente 80,000 bd de crudo y productos refinados. Cada US$ 10/barril de caida en el WTI reduce la factura de importaciones energeticas en aproximadamente US$ 300 millones anuales, aliviando la balanza de pagos.

Para empresas con costos energeticos significativos (manufactura, agroindustria, transporte, mineria), el WTI en el rango US$ 70-80 es un escenario manejable. El riesgo principal es un escalamiento del conflicto en el Golfo Perisco que lleve el WTI por encima de US$ 90, lo que generaria presiones inflacionarias globales y podria retrasar los recortes de la Fed.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/1716008/pexels-photo-1716008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k010',
    titulo: 'Bitcoin supera US$ 107,000 — ETFs spot de EE.UU. acumulan US$ 3.2B en la mejor semana del ano; BlackRock lidera',
    descripcion: 'Bitcoin supero los US$ 107,000 el 5 de junio de 2026, impulsado por entradas masivas a los ETFs spot de EE.UU. Los once ETFs de bitcoin spot aprobados por la SEC acumularon US$ 3.2 mil millones en ingresos netos durante la semana, la mayor desde su lanzamiento. El iShares Bitcoin Trust de BlackRock concentro el 54% de las entradas.',
    contenido: `Bitcoin (BTC/USD) supero los US$ 107,000 durante las operaciones del 5 de junio de 2026, alcanzando un maximo intradiario de US$ 107,450, su nivel mas alto desde el 22 de enero de 2026. El activo acumula una ganancia del 38% en lo que va del ano (desde US$ 77,500 al inicio) y del 112% en los ultimos doce meses.

Los once ETFs de bitcoin spot aprobados por la SEC en enero de 2024 registraron entradas netas de US$ 3.2 mil millones durante la semana del 2 al 5 de junio, la mayor semana de captacion desde su lanzamiento. El iShares Bitcoin Trust (IBIT) de BlackRock lidero con US$ 1.73 mil millones (54% del total), elevando sus activos bajo gestion a US$ 52,400 millones.

Los catalizadores del rally: (1) la caida del DXY a 98.6, que historicamente correlaciona negativamente con bitcoin (R cuadrado = 0.71 en regresion de 3 anos); (2) las expectativas de recorte de la Fed en junio, que reducen el costo de oportunidad de mantener activos sin rendimiento; (3) el halving de abril de 2024 cuyo efecto de reduccion de oferta sigue operando; y (4) la adopcion institucional creciente.

La capitalizacion de mercado del bitcoin supero US$ 2.1 billones, representando el 56% de la capitalizacion total del mercado cripto. Ethereum (ETH) cotiza en US$ 3,420 (+4.2% semanal) y Solana (SOL) en US$ 178 (+6.1% semanal).`,
    analisis: `La correlacion negativa del bitcoin con el DXY (-0.71) implica que el escenario de dolar debil y recortes de Fed es estructuralmente positivo para BTC en los proximos 3-6 meses. Un DXY que cae del 98.6 actual hacia 96-95 podria catalizar al bitcoin hacia US$ 120,000-130,000 si el patron historico se repite.

Para el resto de empresas, la relevancia macro es indirecta: un bitcoin alto senaliza apetito por riesgo global, lo que normalmente correlaciona con flujos hacia emergentes y fortalecimiento de divisas como el sol peruano.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14902702/pexels-photo-14902702.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k011',
    titulo: 'Goldman revisa forecast DXY a 96 para fin de 2026 — deficit fiscal EE.UU. y recortes Fed crean debilidad estructural del dolar',
    descripcion: 'Goldman Sachs reviso su proyeccion del DXY para finales de 2026 de 100 a 96, argumentando que el deficit fiscal de EE.UU. de US$ 1.8 billones y los recortes de tasas de la Fed crean debilidad estructural del dolar. El banco espera 75 puntos basicos de recortes acumulados para fin de 2026.',
    contenido: `Goldman Sachs publico el 4 de junio una nota de investigacion firmada por su equipo de FX revisando su proyeccion del DXY para finales de 2026 de 100 a 96. El banco argumenta que la combinacion de: (1) deficit fiscal de EE.UU. de US$ 1.8 billones (6.1% del PIB), (2) recortes de Fed Funds de 75 pbs acumulados hasta diciembre 2026 (junio 25 pbs + septiembre 25 pbs + diciembre 25 pbs), y (3) reduccion del diferencial de tasas EE.UU.-zona euro crean un escenario de debilidad estructural del dolar.

El analisis de Goldman identifica tres factores estructurales: la Ley Reconciliacion aprobada en mayo de 2026 que aumenta el deficit federal en US$ 450 mil millones anuales, reduciendo el atractivo del Tesoro de EE.UU. como activo libre de riesgo; el BCE que mantiene tasas en 2.50% mientras la Fed recorta, reduciendo el diferencial EUR/USD; y la diversificacion de reservas de bancos centrales globales lejos del dolar.

La proyeccion de Goldman para los principales pares: EUR/USD a 1.12 (desde 1.09 actual), GBP/USD a 1.32 (desde 1.28), USD/JPY a 148 (desde 155 actual). Para las monedas emergentes, Goldman espera apreciaciones del 3-5% en el bloque LATAM, con el sol peruano proyectado en S/ 3.36-3.38 para fin de 2026.

JP Morgan es mas moderado con el DXY en 98 para fin de 2026, argumentando que la recesion en Alemania limitara el rally del EUR/USD. Barclays ubica el DXY en 97.`,
    analisis: `Un consenso de bancos de inversion que proyecta el DXY en 96-98 para fin de 2026 es altamente relevante para empresas peruanas con exposicion cambiaria. Si Goldman esta en lo correcto, el sol podria apreciarse hasta S/ 3.36-3.38 a diciembre, desde S/ 3.41 actual, una apreciacion adicional del 0.9-1.5%.

Las implicaciones practicas: importadores deberian evaluar acortar plazos de pago en dolares para beneficiarse de un tipo de cambio mas favorable; exportadores no mineros deberian revisar su estrategia de conversion de divisas y evaluar instrumentos de cobertura (forwards a 6-12 meses) para asegurar el tipo de cambio actual si los margenes son ajustados.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831529/pexels-photo-5831529.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k012',
    titulo: 'Argentina: reservas del BCRA superan US$ 42,000M — Milei avanza en eliminacion del cepo cambiario fase 3',
    descripcion: 'Las reservas brutas del BCRA superaron US$ 42,000 millones por primera vez desde 2019. El gobierno de Javier Milei anuncio el avance a la fase 3 del levantamiento del cepo cambiario, que permitira a personas juridicas acceder al tipo de cambio oficial sin restricciones desde el 16 de junio.',
    contenido: `Las reservas brutas del Banco Central de la Republica Argentina (BCRA) alcanzaron US$ 42,150 millones al 4 de junio de 2026, superando los US$ 42,000 millones por primera vez desde mayo de 2019. Las reservas netas se estiman en US$ 18,400 millones segun calculos de economistas locales.

El gobierno del presidente Javier Milei anuncio el 4 de junio el avance a la fase 3 del plan de levantamiento del cepo cambiario. A partir del 16 de junio, las personas juridicas podran acceder al tipo de cambio oficial (ARS 1,047 por dolar) sin restricciones de monto para el pago de importaciones de bienes y servicios. Las personas fisicas tendran acceso a US$ 1,500 mensuales al tipo oficial, ampliandose desde los US$ 200 actuales.

El tipo de cambio oficial se ha mantenido en un crawling peg del 1% mensual desde la unificacion cambiaria de agosto de 2025. El tipo de cambio paralelo (blue) cotiza en ARS 1,065, con una brecha del 1.7% respecto al oficial, la mas baja desde 2014. La inflacion de mayo bajo a 3.8% mensual (47% anualizado), siguiendo una tendencia de desaceleracion sostenida.

Las exportaciones argentinas acumulan US$ 31,400 millones en los primeros cinco meses de 2026, con el sector agro-ganadero (+18%) y energia (+34%) como motores. El FMI desembolso US$ 3,200 millones en mayo bajo el acuerdo de US$ 20,000 millones firmado en septiembre de 2025.`,
    analisis: `La normalizacion cambiaria argentina tiene implicaciones para Peru: las empresas peruanas que exportan a Argentina o tienen operaciones alli enfrentaran un tipo de cambio oficial mas accesible a partir del 16 de junio, facilitando el pago de importaciones. El riesgo es que el levantamiento del cepo genere una demanda reprimida de dolares que presione al alza el tipo de cambio oficial.

Para casas de cambio como QoriCash, la normalizacion argentina puede generar mayor demanda de operaciones cambiarias de empresas peruanas con contrapartes argentinas, historicamente impedidas por el control de cambios. La tendencia es hacia una mayor apertura cambiaria en el mediano plazo.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/34004034/pexels-photo-34004034.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k013',
    titulo: 'Colombia: Banco de la Republica recorta tasa a 8.25% en decision unanime — peso colombiano +0.8% y bolsa sube 1.4%',
    descripcion: 'El Banco de la Republica de Colombia recorto su tasa de intervencion de 8.50% a 8.25% en decision unanime del 30 de mayo. Es el noveno recorte consecutivo desde diciembre de 2024. El peso colombiano se aprecio 0.8% a COP 3,840 por dolar y la Bolsa de Valores de Colombia subio 1.4%.',
    contenido: `El Banco de la Republica de Colombia recorto su tasa de intervencion de 8.50% a 8.25% en su reunion del 30 de mayo, en una decision unanime de los siete miembros de la junta directiva, segun el acta publicada el 5 de junio. Es el noveno recorte consecutivo del banco central colombiano desde el inicio del ciclo de flexibilizacion en diciembre de 2024, cuando la tasa se ubicaba en 13.00%.

El gerente del Banco de la Republica, Leonardo Villar, declaro en la conferencia de prensa que la junta considera que la tasa de 8.25% sigue siendo restrictiva, con la inflacion de mayo proyectada en 4.8% interanual (meta: 2%-4% para finales de 2026). El siguiente recorte podria ser en agosto si la inflacion continua convergiendo al objetivo.

El mercado financiero colombiano respondio positivamente: el peso colombiano (USD/COP) se aprecio 0.8% de COP 3,870 a COP 3,840 por dolar. La Bolsa de Valores de Colombia (BVC) subio 1.4% liderada por Bancolombia (+2.1%), Ecopetrol (+1.8%) y Grupo Sura (+1.6%). Los TES (bonos del gobierno colombiano) a 10 anos redujeron su rendimiento de 10.2% a 9.75%.

La inflacion colombiana de abril fue de 5.1% interanual, con la inflacion de alimentos (6.8%) y los arriendos (7.2%) como los componentes mas persistentes. El equipo tecnico proyecta convergencia al 4.0% en diciembre de 2026.`,
    analisis: `Los recortes del Banco de la Republica de Colombia tienen relevancia para empresas peruanas con operaciones o clientes en Colombia: la reduccion del costo de capital estimula la inversion y el consumo colombianos, lo que puede aumentar la demanda de bienes y servicios peruanos exportados a ese mercado (textiles, agroindustria, servicios empresariales).

La apreciacion del peso colombiano (+0.8%) facilita las transacciones comerciales bilaterales: si el COP se aprecia frente al USD, los exportadores peruanos que facturan en dolares a contrapartes colombianas ven mejora en la competitividad relativa de sus productos frente a alternativas locales colombianas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29477129/pexels-photo-29477129.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k014',
    titulo: 'Chile: IPC mayo en 2.8% interanual — Banco Central mantiene tasa en 5.00% y descarta recortes antes del tercer trimestre',
    descripcion: 'El INE de Chile reporto que el IPC de mayo fue de 2.8% interanual, en linea con el consenso y dentro de la banda meta del Banco Central (2%-4%). El Banco Central de Chile mantiene su tasa en 5.00% y descarta recortes antes de julio-septiembre de 2026. El peso chileno se aprecia a CLP 895.',
    contenido: `El Instituto Nacional de Estadisticas de Chile (INE) publico el 5 de junio el IPC de mayo de 2026, que resulto en un alza de 0.3% mensual y 2.8% interanual, en linea con la proyeccion de consenso de Bloomberg. La inflacion subyacente fue de 3.1% interanual, moderandose desde el 3.4% de abril. La inflacion de servicios (4.2% a/a) sigue siendo el componente mas rigido.

El Consejo del Banco Central de Chile (BCCh) senalizo que la tasa de politica monetaria (TPM) se mantendra en 5.00% en las proximas reuniones, descartando recortes antes del tercer trimestre de 2026. La economia chilena —con un crecimiento del PIB proyectado en 2.8% para 2026— no requiere estimulo monetario adicional, y la inflacion subyacente aun no ha convergido suficientemente al objetivo del 3%.

El peso chileno (CLP) cotiza en CLP 895 por dolar, apreciandose 0.8% en la semana, su nivel mas fuerte desde el 12 de marzo de 2026. La apreciacion refleja la debilidad del DXY (98.6) y el alza del cobre (US$ 5.18/lb), el principal producto de exportacion chileno con el 55% de la participacion en exportaciones totales. Las exportaciones chilenas totales de enero a mayo alcanzaron US$ 42,800 millones (+19.2%).

La diferencia clave entre Chile y Peru en el ciclo monetario actual: el BCCh (en 5.00%) tiene menos espacio para recortar que el BCRP (en 4.25%), dado que Chile inicio su ciclo de recortes antes y desde un nivel mas alto (11.25% en agosto de 2023).`,
    analisis: `Chile y Peru comparten el mismo viento de cola (cobre alto, DXY debil) pero en diferentes etapas de sus ciclos monetarios. Para empresas con operaciones en ambos paises, la convergencia de las monedas al alza frente al dolar crea un escenario de menores costos de importacion en ambas economias.

El dato del IPC chileno de mayo (2.8% a/a) es benigno y confirma que la region andina esta en un ciclo desinflacionario avanzado. Esto refuerza el escenario de recortes del BCRP en el segundo semestre si la inflacion peruana sigue moderandose, lo que podria estimular el credito y la demanda interna en Peru durante el Q3-Q4 2026.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19821189/pexels-photo-19821189.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'k015',
    titulo: 'BCRP: credito al sector privado crece 7.8% interanual en mayo — hipotecario +11.2% y consumo +9.4% lideran',
    descripcion: 'El Banco Central de Reserva del Peru informo que el credito total al sector privado crecio 7.8% interanual en mayo de 2026 en terminos reales, acelerando desde el 7.2% de abril. El credito hipotecario lidera con +11.2%, seguido por consumo con +9.4% y credito corporativo con +6.1%.',
    contenido: `El Banco Central de Reserva del Peru (BCRP) publico los datos de credito del sistema financiero de mayo de 2026, reportando un crecimiento del credito total al sector privado de 7.8% interanual en terminos reales, acelerando desde el 7.2% de abril y el 6.5% de enero. En terminos nominales, el credito total sumas S/ 295,600 millones.

El credito hipotecario registro el mayor dinamismo con +11.2% interanual real, impulsado por los programas del Fondo MiVivienda (+14.3%) y el credito hipotecario convencional de la banca privada (+9.8%). La tasa hipotecaria promedio cayo a 9.8% anual en mayo (desde 11.2% de enero de 2025), beneficiandose de la reduccion de la tasa de referencia del BCRP durante 2025.

El credito de consumo subio 9.4% real, sostenido por el credito de nomina (convenios descuento por planilla, +15.2%), tarjetas de credito (+8.1%) y prestamos personales (+7.4%). La morosidad del segmento consumo se ubico en 3.8%, levemente por debajo del 3.9% de abril, indicando que el crecimiento no viene acompanado de deterioro material de calidad de cartera.

El credito a empresas grandes y corporaciones crecio 6.1% real, con los sectores minero (+12.3%), agroindustrial (+9.8%) y construccion (+8.4%) como los mas activos. El credito a MYPEs crecio 5.4% real, con los programas Reactiva heredados en proceso de reduccion paulatina.`,
    analisis: `Un credito al sector privado creciendo al 7.8% real es consistente con una economia expandiendose al 3.5-4.0% del PIB. Este dinamismo crediticio es una senal positiva de confianza empresarial y de los consumidores en la estabilidad macroeconomica peruana.

Para empresas financieras y fintech como QoriCash, el dinamismo del credito hipotecario y de consumo implica mayor flujo de transacciones en moneda extranjera relacionadas con compras de inmuebles, importaciones de bienes de consumo y pagos al exterior. Las empresas que operan con dolares podrian beneficiarse de un mayor volumen de operaciones de cambio en los proximos trimestres.`,
    categoria: 'Nacional',
    fuente: 'Gestion',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29483248/pexels-photo-29483248.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j001',
    titulo: 'BCRP compra USD 800M el 4 de junio — PEN toca S/ 3.40 intradiario; reservas internacionales ascienden a US$ 100,800M y el sol acumula apreciación de 2.6% en 2026',
    descripcion: 'El Banco Central de Reserva del Perú intervino comprando USD 800 millones en la apertura del 4 de junio para moderar la apreciación del sol, que tocó S/ 3.40 intradiario por primera vez desde febrero de 2023. Las reservas internacionales netas alcanzan US$ 100,800 millones. El sol acumula una apreciación del 2.6% en lo corrido del año.',
    contenido: `El Banco Central de Reserva del Perú (BCRP) ejecutó compras de USD 800 millones en el mercado cambiario durante la sesión del 4 de junio de 2026, en su intervención más voluminosa en un solo día desde enero de 2025. La acción del banco central busca moderar la velocidad de apreciación del sol peruano, que tocó S/ 3.40 por dólar en las operaciones de apertura, su nivel más bajo (mayor apreciación) desde el 14 de febrero de 2023.

El BCRP ha intervenido comprando USD 4,200 millones en los últimos 30 días hábiles, acumulando reservas que ahora suman US$ 100,800 millones. Este nivel equivale a 22 meses de importaciones y cubre ampliamente los criterios del FMI de adecuación de reservas (ARA metric). La intervención sistemática tiene un doble objetivo: evitar que una apreciación excesiva perjudique la competitividad de los exportadores no mineros y acumular reservas para futuras contingencias.

Los fundamentos que sostienen la apreciación del sol son estructurales: el superávit comercial de los primeros cinco meses de 2026 alcanza US$ 9,800 millones, el cobre cotiza a US$ 5.15/lb y el oro supera los US$ 3,600/oz. La debilidad del DXY —que cotiza por debajo de 99 ante las expectativas de recortes de la Fed— amplifica los flujos de capital hacia emergentes con fundamentos sólidos.

El sol acumula una apreciación del 2.6% en lo corrido de 2026 (desde S/ 3.49 de inicio de año hasta S/ 3.40 actual), siendo la quinta moneda emergente con mejor desempeño frente al dólar en el año según Bloomberg. El directorio del BCRP se reúne el próximo martes 11 de junio; el mercado mantiene un 68% de probabilidad de que la tasa de referencia se mantenga en 4.25%.`,
    analisis: `La intervención del BCRP en USD 800M en un solo día es una señal clara de que el banco central no está dispuesto a dejar que el sol se aprecie más allá de S/ 3.40 sin resistencia. Esto establece un piso técnico implícito: si el DXY no cae más, el sol tiene dificultades para romper S/ 3.40 de manera sostenida.

Para empresas con cuentas por cobrar en dólares (exportadores no mineros, prestadores de servicios en USD), el nivel de S/ 3.40-3.42 puede ser una ventana para adelantar conversiones de divisas antes de la reunión del BCRP del 11 de junio. Si el banco central sorprende con un recorte de 25 pbs, el diferencial de tasas se reduce y el sol podría apreciarse marginalmente más; si mantiene en 4.25%, el carry trade se preserva y la apreciación se frena.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j002',
    titulo: 'Warsh en Chicago Fed: "el IPC del 10 de junio decidirá si actuamos en junio o julio" — mercados elevan probabilidad de recorte al 42%',
    descripcion: 'El presidente de la Reserva Federal, Kevin Warsh, señaló en la Conferencia Anual de la Fed de Chicago que la lectura del IPC de mayo será el dato determinante para el FOMC del 16-17 de junio. Tras el discurso, los mercados de futuros elevaron la probabilidad de recorte de 35% a 42%.',
    contenido: `Kevin Warsh, presidente de la Reserva Federal desde febrero de 2026, ofreció el discurso más explícito hasta la fecha sobre las condiciones para un primer recorte de tasas en su intervención ante la Conferencia Anual de la Fed de Chicago el 3 de junio. Warsh afirmó que el dato del IPC de mayo, que publicará el BLS el 10 de junio, sería el árbitro final de la decisión para el FOMC del 16-17 de junio. El mercado de futuros de Fed Funds respondió: la probabilidad de un recorte de 25 pbs en junio subió de 35% a 42% en el CME FedWatch tool.

Warsh precisó que para respaldar un recorte en junio, la Fed necesitaría ver el core CPI por debajo del 2.7% interanual. El consenso del mercado ubica el core CPI de mayo en 2.8%. No necesitamos que la inflación esté en el objetivo para recalibrar; necesitamos evidencia convincente de que estamos en la trayectoria correcta, indicó Warsh.

El presidente también abordó el impacto de los aranceles, señalando que el PPI de abril mostró moderación inesperada, sugiriendo que las empresas absorben parte del costo a través de márgenes más bajos en lugar de trasladarlo al consumidor.

Goldman Sachs revisó su previsión tras el discurso: 45% de probabilidad de recorte en junio (previo: 30%) y 85% acumulado en julio. El rendimiento del Tesoro a 2 años cayó 6 pbs hasta 4.04%, y el DXY cedió 0.3% hasta 98.7.`,
    analisis: `Un Warsh explícitamente dependiente de datos con referencia directa al IPC del 10 de junio es el catalizador que el mercado necesitaba para re-pricear el riesgo de recorte en junio. El movimiento del DXY (-0.3%) y del Treasury 2Y (-6 pbs) son la traducción más directa para el sol peruano: cada punto básico de caída en el yield corto de EE.UU. hace al carry trade en soles más atractivo.

Si el IPC de mayo sale en 2.7% o menos, el escenario de recorte en junio se vuelve el dominante y el sol podría apreciarse hacia S/ 3.38-3.39 en los días previos al FOMC. Para quienes tienen exposición larga en USD, los próximos 7 días son críticos: el dato del 10 de junio es el evento de mayor riesgo cambiario del mes.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: true,
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j003',
    titulo: 'ADEX: exportaciones agro no tradicionales crecen 18% en abril a US$ 650M — arándanos +34%, paltas +22%, uvas +19%; proyección anual récord de US$ 8,200M para 2026',
    descripcion: 'La Asociación de Exportadores (ADEX) reportó que las exportaciones agro no tradicionales peruanas alcanzaron US$ 650 millones en abril de 2026, un 18% más que en abril de 2025. Los arándanos lideraron con +34%, seguidos por paltas (+22%) y uvas (+19%). El sector proyecta un año récord con US$ 8,200 millones en exportaciones agro no tradicionales.',
    contenido: `La Asociación de Exportadores (ADEX) publicó sus estadísticas de comercio exterior de abril de 2026, revelando que las exportaciones de productos agropecuarios no tradicionales alcanzaron US$ 650 millones, un 18.3% más que en el mismo mes de 2025. En los cuatro primeros meses del año, las exportaciones agro no tradicionales suman US$ 2,380 millones, un 16.1% por encima del acumulado de enero a abril de 2025.

Los arándanos continúan siendo el producto estrella: en abril se exportaron US$ 148 millones (+34.2%). La expansión de áreas de cultivo en Virú, Chao, Huamachuco y el Valle del Santa consolida a Perú como el primer exportador mundial de arándanos frescos, con el 30% de la participación de mercado global. Los principales destinos son EE.UU. (42%), Países Bajos (28%) y Reino Unido (16%).

Las paltas exportaron US$ 127 millones en abril (+22.1%), beneficiadas por la demanda sostenida en Europa y EE.UU. y la ventana estacional de Perú que complementa la oferta de México. Las uvas de mesa sumaron US$ 89 millones (+18.9%), con las variedades sin semilla Crimson Seedless y Sweet Globe ganando participación en mercados premium.

El presidente de ADEX señaló que de mantenerse el ritmo del primer cuatrimestre, el sector podría exportar US$ 8,200 millones en el año completo, superando el récord histórico de US$ 7,400 millones de 2025.`,
    analisis: `Las exportaciones agro no tradicionales son el mejor ejemplo de la diversificación exitosa de la oferta exportable peruana. A diferencia de la minería, el agro no tradicional genera valor a través de productividad, calidad y posicionamiento en mercados premium, haciéndolo más resiliente a shocks externos.

Para los exportadores agro, el tipo de cambio en S/ 3.40-3.42 reduce el margen en soles. Una empresa que vende a US$ 5.00/kg de arándanos recibe S/ 17.00-17.10 por kilo hoy versus S/ 17.45-17.50 hace tres meses. A escala de cientos de toneladas, este diferencial es material. La planificación de coberturas cambiarias para los envíos del segundo semestre es prioritaria.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13277183/pexels-photo-13277183.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j004',
    titulo: 'SBS: cartera de créditos del sistema financiero llega a S/ 380,000M en abril — crédito al consumo crece 12.1% y empresarial 7.4% interanual; morosidad cede a 4.1%',
    descripcion: 'La SBS informó que la cartera de créditos del sistema financiero peruano alcanzó S/ 380,000 millones en abril de 2026, creciendo 8.2% interanual. El crédito al consumo lidera con +12.1%, seguido por hipotecario (+9.3%) y empresarial (+7.4%). La morosidad cedió a 4.1%, mínimo desde agosto de 2025.',
    contenido: `La Superintendencia de Banca, Seguros y AFP (SBS) publicó las estadísticas del sistema financiero de abril de 2026, mostrando que la cartera de créditos total alcanzó S/ 380,000 millones, un 8.2% más que en abril de 2025. El crecimiento nominal supera en 4.5 puntos porcentuales la inflación del período, evidenciando una expansión real del crédito sostenida.

El crédito al consumo fue el segmento de mayor dinamismo, creciendo 12.1% interanual hasta S/ 72,400 millones. El impulso proviene del crédito vehicular (+18.3%), las tarjetas de crédito (+14.2%) y los préstamos personales (+9.8%), categorías que se benefician de la mejora en el empleo formal y el incremento de los salarios reales. Los cuatro grandes bancos privados (BCP, BBVA, Interbank, Scotiabank) concentran el 73.4% del crédito al consumo.

El crédito hipotecario creció 9.3% interanual hasta S/ 54,600 millones, impulsado por el programa Techo Propio y el Fondo MiVivienda. La perspectiva de recortes de tasas ha reactivado la demanda de vivienda, especialmente en el segmento de S/ 300,000 a S/ 600,000.

La ratio de morosidad del sistema cedió a 4.1% en abril desde el pico de 4.8% de agosto de 2025. El nivel de provisiones cubre el 147% de la cartera morosa y el ratio de capital global promedia 16.2%, holgadamente por encima del mínimo regulatorio del 10%.`,
    analisis: `Una cartera crediticia en S/ 380,000M creciendo al 8.2% real con morosidad cayendo a 4.1% y cobertura de provisiones del 147% es el cuadro de salud financiera más sólido que Perú ha mostrado desde 2019. Este ciclo virtuoso históricamente precede períodos de expansión sostenida del consumo privado y la inversión.

Para empresas que buscan financiamiento bancario, este entorno es favorable: los bancos tienen apetito de riesgo y las tasas activas han bajado marginalmente. Si el BCRP recorta en julio o agosto, las tasas de crédito empresarial podrían caer adicionalmente 50-75 pbs en los próximos 6 meses.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29302360/pexels-photo-29302360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j005',
    titulo: 'MEF aprueba S/ 3,200M en inversión pública regional para Q2 — 47 proyectos en 15 regiones priorizan carreteras, saneamiento y hospitales; desembolso antes del 30 de junio',
    descripcion: 'El Ministerio de Economía y Finanzas (MEF) aprobó la transferencia de S/ 3,200 millones a 15 regiones para 47 proyectos de inversión pública en el Q2 de 2026. Los proyectos priorizan carreteras (38%), saneamiento básico (26%) e infraestructura hospitalaria (18%). Los desembolsos deben ejecutarse antes del cierre del trimestre.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) publicó en el Diario El Peruano la resolución ministerial que autoriza la transferencia de S/ 3,200 millones a 15 gobiernos regionales para la ejecución de 47 proyectos de inversión pública en el segundo trimestre de 2026. La medida forma parte del Plan de Aceleración de la Inversión Pública 2026, que tiene como meta alcanzar una ejecución presupuestal del 78% al cierre del año (versus el 61% de 2025).

Por sectores, la mayor asignación corresponde a infraestructura vial con S/ 1,216 millones (38%), que financiará la rehabilitación de 847 kilómetros de carreteras en Loreto, Puno, Apurímac, Huancavelica y Ayacucho. El saneamiento básico recibe S/ 832 millones (26%) para sistemas de agua potable y alcantarillado en 124 centros poblados rurales.

La infraestructura de salud absorbe S/ 576 millones (18%) destinados al Hospital Regional de Ica (categoría III), la ampliación del Hospital Regional de Huánuco y 12 Centros de Salud Mental Comunitaria. La inversión en educación suma S/ 352 millones (11%) para 28 Colegios de Alto Rendimiento y 156 aulas en zonas de frontera.

El ministro de Economía subrayó que los S/ 3,200 millones representan el 0.3% del PBI con efecto multiplicador estimado en 1.8x. Las regiones con mayor asignación son Loreto (S/ 420M), Puno (S/ 380M) y La Libertad (S/ 290M).`,
    analisis: `La inversión pública actúa como estabilizador automático de la economía regional: S/ 3,200M en un trimestre equivalen a ~S/ 213M por semana, un flujo que activa cadenas de proveedores locales de materiales de construcción, servicios de ingeniería y mano de obra.

Para empresas con operaciones en las regiones beneficiadas, la llegada de estos fondos puede representar oportunidades de contratos de provisión. El punto crítico es la ejecución: históricamente, las transferencias de fin de trimestre tienen tasas de ejecución bajas (40-50%) por problemas de capacidad de gestión regional. Si el MEF cumple el monitoreo comprometido, el impacto en el PBI del Q2 podría ser de 0.2-0.3 puntos porcentuales adicionales.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985010/pexels-photo-19985010.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j006',
    titulo: 'Quellaveco establece récord: 305,000 TM de cobre en 12 meses a mayo — Anglo American eleva guía 2026 a 310,000-320,000 TM; proyecto supera expectativas post-ramp-up',
    descripcion: 'Quellaveco, la operación de Anglo American en Moquegua, produjo 305,000 TM de cobre fino en los últimos 12 meses, nuevo récord histórico. Anglo American eleva su guía de producción para 2026 a 310,000-320,000 TM, superando las 285,000 TM proyectadas originalmente al inicio de operaciones.',
    contenido: `Anglo American informó que su operación Quellaveco, en la región Moquegua a 4,500 m.s.n.m., produjo 305,000 toneladas métricas de cobre fino en los 12 meses comprendidos entre junio de 2025 y mayo de 2026, nuevo récord histórico para la mina desde su inicio de producción comercial en octubre de 2022. El dato supera en 7.0% la producción del período anterior (285,000 TM).

La mejora productiva responde a la optimización del proceso de flotación de cobre, que elevó la recuperación metalúrgica del 85.2% al 88.6%, y a la ampliación de la capacidad de molienda de 127,500 a 134,000 TM/día tras instalar un tercer molino de bolas en octubre de 2025. La ley del mineral se mantiene estable en 0.54%, por encima del plan de vida de la mina del 0.51%.

Anglo American eleva su guía de producción 2026 a 310,000-320,000 TM (previo: 290,000-300,000 TM). A US$ 5.15/lb, la producción de 315,000 TM generaría ingresos brutos de US$ 3,576 millones, con tributos estimados al Estado peruano de US$ 980 millones (regalías mineras + IEM + Impuesto a la Renta).

La operación ha cumplido todos los compromisos del Acuerdo Marco con las comunidades de Moquegua: US$ 380 millones en contratos locales, 4,200 trabajadores directos (68% de Moquegua) y un fondo de desarrollo regional de US$ 40 millones anuales.`,
    analisis: `Quellaveco produciendo 305,000 TM en 12 meses confirma que el proyecto de US$ 5,300 millones ha superado las expectativas de producción post-ramp-up. Con cobre a US$ 5.15/lb, la operación genera márgenes EBITDA superiores al 60%, haciendo de Quellaveco uno de los activos más rentables de la cartera global de Anglo American.

Para Perú, cada 10,000 TM adicionales de cobre equivalen a ~US$ 114 millones de ingresos de exportación anuales. La guía elevada a 310,000-320,000 TM implica US$ 285-400 millones más de divisas versus la guía original. Este flujo adicional es uno de los factores que sostiene la fortaleza del sol peruano.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j007',
    titulo: 'PMI Caixin China mayo: manufactura cae a 49.5 en zona de contracción por primera vez en 4 meses — servicios suben a 53.2; pedidos de exportación se desploman a 44.8',
    descripcion: 'El PMI Manufacturero Caixin de China cayó a 49.5 en mayo desde 50.4 en abril, entrando en zona de contracción por primera vez en cuatro meses. El PMI de Servicios subió a 53.2, máximo de 14 meses. Los nuevos pedidos de exportación se desplomaron a 44.8, el nivel más bajo en 18 meses, evidenciando el impacto de los aranceles de EE.UU.',
    contenido: `El PMI Manufacturero del índice Caixin/S&P Global de China registró 49.5 en mayo de 2026, cayendo por debajo del umbral de 50 por primera vez desde enero de 2026. El dato decepcionó frente al consenso de 50.1 y al 50.4 de abril. Los nuevos pedidos de exportación se desplomaron a 44.8, el nivel más bajo en 18 meses, evidenciando el impacto directo de los aranceles estadounidenses sobre la demanda externa de manufacturas chinas.

El componente de empleo manufacturero también cayó por debajo de 50 (48.9 vs 50.2 previo), indicando que las fábricas del sector exportador están comenzando a reducir plantillas o congelar contrataciones. Los precios de insumos subieron al ritmo más rápido en 7 meses (subíndice: 54.8), mientras los fabricantes acumulan materias primas ante potenciales alzas de precios por aranceles.

En contraste, el PMI de Servicios Caixin subió a 53.2 en mayo desde 52.5 en abril, máximo desde marzo de 2025. El sector servicios —turismo doméstico, entretenimiento digital y servicios financieros— se beneficia de los paquetes de estímulo al consumo interno anunciados en marzo.

El PMI Compuesto resultó en 50.8, el más bajo en 5 meses. Los analistas de Nomura y UBS mantienen su proyección de crecimiento del PIB chino para 2026 en 4.5%, pero señalan riesgo a la baja si los aranceles se amplían en el segundo semestre.`,
    analisis: `Un PMI manufacturero chino en contracción (49.5) con pedidos de exportación en 44.8 confirma que los aranceles de EE.UU. están impactando la actividad industrial china. Esto es relevante para el cobre: si la manufactura china se modera más de lo esperado, la demanda de cobre industrial puede caer, ejerciendo presión bajista sobre los precios.

Sin embargo, la demanda de cobre para infraestructura de energía verde (paneles solares, turbinas eólicas, cables de transmisión) sigue siendo el motor dominante en China y está en expansión a pesar de los aranceles. El balance neto para el precio del cobre sigue siendo ligeramente alcista estructuralmente, aunque con mayor volatilidad a corto plazo si el PMI manufacturero continúa en contracción en junio.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31091544/pexels-photo-31091544.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j008',
    titulo: 'OPEP+ acuerda aumentar producción en 400,000 bbl/día desde julio — WTI sube 1.8% a US$ 83/bbl; mercado interpreta el movimiento como señal de confianza en la demanda global',
    descripcion: 'La OPEP+ acordó en su reunión del 2 de junio aumentar la producción en 400,000 barriles por día a partir de julio de 2026, la tercera reducción consecutiva de los recortes voluntarios. El WTI subió 1.8% a US$ 83/bbl, interpretando el movimiento como señal de confianza del cártel en la demanda. Arabia Saudita lideró la negociación para mantener la cohesión del grupo.',
    contenido: `La OPEP+ acordó en su reunión ministerial del 2 de junio en Viena aumentar la producción en 400,000 barriles por día (bpd) a partir del 1 de julio de 2026, la tercera reducción consecutiva de los recortes voluntarios implementados desde octubre de 2023. La decisión fue adoptada por unanimidad, con Arabia Saudita liderando la negociación para mantener la cohesión del grupo.

El mercado reaccionó alcistamente: el WTI subió 1.8% hasta US$ 83.20 por barril y el Brent avanzó 1.6% hasta US$ 86.40/bbl. La reacción positiva refleja que el mercado interpreta la reducción de recortes como señal de que la OPEP+ confía en que la demanda global puede absorber el volumen adicional sin deprimir precios. Arabia Saudita necesita un precio del petróleo por encima de US$ 78/bbl para equilibrar su presupuesto fiscal.

Los 400,000 bpd adicionales se repartirán entre ocho países: Arabia Saudita (120,000 bpd), Rusia (80,000 bpd), Emiratos Árabes Unidos (50,000 bpd), Kuwait (40,000 bpd) y cuatro miembros adicionales. La producción total de la OPEP+ pasará de 33.8 a 34.2 millones bpd en julio.

Goldman Sachs y Citigroup revisaron sus proyecciones al alza: Goldman sitúa el WTI en US$ 85-90/bbl para el segundo semestre de 2026 si la demanda china de combustibles para transporte se recupera según lo previsto. El descuento del crudo peruano (Loreto y Talara) respecto al WTI se mantiene en US$ 4-5/bbl.`,
    analisis: `Para Perú, el impacto del petróleo más caro es bidireccional: por un lado, eleva el costo de los combustibles importados (Perú importa el 30% de su consumo de derivados) y añade presión inflacionaria; por el otro, beneficia las finanzas de Petroperú y las regalías de las operaciones en Loreto.

El efecto neto en el tipo de cambio es ambiguo: un WTI más alto eleva el déficit energético de la balanza de pagos, presionando al sol negativamente. Pero si el alza del petróleo viene de la mano de recuperación de demanda china, el cobre también sube, y el impacto positivo del cobre compensa el negativo del petróleo. El balance histórico en episodios de petróleo moderadamente alto (US$ 80-90/bbl) con cobre fuerte (>US$ 5/lb) es de apreciación neta del sol.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j009',
    titulo: 'Swap markets: Treasury 2Y cae 6 pbs a 4.04% y DXY cede a 98.7 tras discurso Warsh — probabilidad recorte Fed junio sube a 42%; sol peruano toca S/ 3.40 y real a BRL 5.62',
    descripcion: 'Los mercados de renta fija reaccionaron al discurso de Warsh en Chicago: el Treasury 2Y cayó 6 pbs hasta 4.04%, su nivel más bajo desde enero. El DXY retrocedió a 98.7. La probabilidad de recorte de la Fed en junio subió al 42%. El sol peruano tocó S/ 3.40 intradiario y el real brasileño se apreció a BRL 5.62.',
    contenido: `Los mercados de renta fija reaccionaron con claridad al discurso de Kevin Warsh en la Conferencia Anual de la Fed de Chicago del 3 de junio: el rendimiento del Tesoro de EE.UU. a 2 años cayó 6 puntos básicos hasta 4.04%, su nivel más bajo desde el 14 de enero de 2026, y el rendimiento a 10 años cedió 4 pbs hasta 4.24%, manteniendo la pendiente 2Y-10Y ligeramente positiva en +20 pbs.

En el mercado de swaps de tasas de interés (OIS), la probabilidad implícita de un recorte de 25 pbs en el FOMC del 16-17 de junio subió al 42%, desde el 35% previo al discurso. La probabilidad para julio se ubica en el 71%, y el mercado pricéa 1.8 recortes de 25 pbs acumulados para el cierre del año.

El DXY retrocedió 0.3% hasta 98.7, su nivel más bajo en dos semanas. La caída del DXY impulsó al alza los principales cruces emergentes: el real brasileño se apreció 0.4% hasta BRL 5.62, el sol peruano cotiza en S/ 3.40 tras tocar S/ 3.39 intradiario. El índice MSCI Emerging Markets subió 0.8%. El euro avanzó 0.3% hasta 1.085 EUR/USD y la libra esterlina subió a 1.272 GBP/USD.

Los spreads de crédito investment grade se comprimieron 3-5 pbs, reflejando el apetito renovado por activos de riesgo en un entorno de Fed más acomodaticia.`,
    analisis: `La caída del Treasury 2Y a 4.04% es la señal de renta fija más relevante del día para los mercados emergentes: cuando el yield corto de EE.UU. cae, el diferencial de tasas con economías de alta tasa real como Perú (4.25% BCRP vs 3.50%-3.75% Fed) se amplía, haciendo el carry trade en soles más atractivo para gestores de fondos globales.

El nivel crítico a monitorear es si el Treasury 2Y perfora el 4.00% (lo que requeriría un IPC de mayo en 2.7% o menos el 10 de junio). En ese caso, la probabilidad de recorte en junio supera el 60% y el DXY podría caer hacia 97.5-98, nivel que históricamente ha coincidido con el sol peruano en S/ 3.37-3.39.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831355/pexels-photo-5831355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j010',
    titulo: 'Análisis técnico PEN/USD 4 junio: sol perfora soporte S/ 3.42 con marubozu bajista para el dólar — próximo objetivo S/ 3.38; RSI en 28 señala dólar sobrevendido',
    descripcion: 'El tipo de cambio PEN/USD rompió el soporte de S/ 3.42 en la sesión del 4 de junio registrando un mínimo intradiario de S/ 3.40. El RSI-14 en 28 indica dólar sobrevendido en el corto plazo. El siguiente soporte técnico se ubica en S/ 3.38 (mínimo de febrero de 2023). El MACD muestra divergencia bajista para el dólar.',
    contenido: `El tipo de cambio PEN/USD rompió el soporte clave de S/ 3.42 en la sesión del 4 de junio de 2026, registrando un mínimo intradiario de S/ 3.40 antes de que la intervención del BCRP (compra de USD 800M) frenara la caída. El cierre provisional en S/ 3.415 confirma la ruptura del soporte que había actuado como piso las últimas tres semanas.

La vela del 4 de junio en el gráfico diario PEN/USD presenta un patrón de marubozu bajista para el dólar: apertura cerca del máximo del día, cierre cerca del mínimo. Este patrón en contexto de ruptura de soporte señala continuación de la tendencia apreciativa del sol. El volumen de la sesión fue el mayor en 11 días, confirmando la significancia del movimiento.

Los indicadores técnicos refuerzan el escenario apreciativo: el RSI-14 en el gráfico diario USD/PEN se sitúa en 28, por debajo del nivel de sobreventa de 30. Esto sugiere que un rebote técnico del dólar es posible en 1-3 días, pero la tendencia de fondo sigue siendo de fortalecimiento del sol.

El MACD (12-26-9) muestra divergencia bajista para el dólar: el precio hace mínimos más bajos (S/ 3.40 vs S/ 3.41 de tres semanas atrás) pero el histograma del MACD sube levemente, señalando agotamiento del impulso bajista del dólar a muy corto plazo. Niveles clave: Soporte inmediato S/ 3.40, soporte principal S/ 3.38, resistencia S/ 3.45, resistencia fuerte S/ 3.49 (MA50 días).`,
    analisis: `Para los actores cambiarios con exposiciones en dólares, la ruptura de S/ 3.42 es una señal técnica de alerta: el mercado busca el soporte de S/ 3.38, y si el IPC del 10 de junio sale bajo (≤2.7%), la probabilidad de alcanzar ese nivel antes del FOMC del 17 de junio es significativa.

La estrategia más conservadora para un exportador con cobros en USD pendientes es aprovechar los rebotes del dólar (hacia S/ 3.43-3.45) para cerrar posiciones. Los rebotes son probables dado el RSI sobrevendido, pero la tendencia de fondo es de apreciación del sol mientras el superávit comercial, el DXY débil y el cobre alto permanezcan intactos.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j011',
    titulo: 'Oro spot alcanza US$ 3,620/oz el 4 de junio — bancos centrales compraron 290 TM en Q1 2026; China lidera con 95 TM; ETFs globales acumulan entradas récord de 387 TM en 5 meses',
    descripcion: 'El precio del oro spot avanzó 0.7% hasta US$ 3,620/oz el 4 de junio, acercándose al máximo histórico de US$ 3,680 del 22 de mayo. El World Gold Council reporta 290 TM de compras de bancos centrales en Q1 2026, el mayor trimestre desde Q3 de 2022. China lidera con 95 TM. Los ETFs de oro acumulan 387 TM de entradas netas en 5 meses.',
    contenido: `El precio del oro en el mercado spot avanzó 0.7% hasta US$ 3,620 por onza troy en la sesión del 4 de junio de 2026, impulsado por la debilidad del DXY (98.7), la caída de rendimientos del Tesoro a 2 años (4.04%) y el discurso dovish de Warsh. El metal acumula una ganancia del 18.4% en lo que va del año 2026 y se sitúa a un 1.6% del máximo histórico de US$ 3,680 del 22 de mayo.

El World Gold Council publicó su reporte trimestral, revelando que los bancos centrales compraron en conjunto 290 TM en el Q1 2026, el mayor nivel trimestral desde el Q3 de 2022. El Banco Popular de China lideró con 95 TM, elevando sus reservas oficiales de oro a 2,285 TM (7.8% de sus reservas totales). Turquía adquirió 45 TM, Polonia 32 TM e India 28 TM.

La demanda de ETFs de oro registra niveles récord: los ETFs respaldados por oro físico acumulan entradas netas de 387 TM en los primeros cinco meses de 2026, más que las 295 TM de todo 2025. Los SPDR Gold Shares (GLD) administra activos por US$ 84,600 millones, máximo histórico.

En el COMEX, las posiciones especulativas netas largas en oro subieron a 312,000 contratos equivalentes (966 TM), cerca del máximo histórico. La prima del oro en China respecto a Londres se mantiene en US$ 15-18/oz, señalando demanda física sólida en el mayor mercado del mundo.`,
    analisis: `El oro a US$ 3,620/oz con bancos centrales comprando a ritmo récord es señal de la reasignación global de reservas desde dólares hacia activos reales. Esta tendencia estructural —impulsada por la reducción de la confianza en el dólar como reserva única tras las sanciones a Rusia en 2022 y la degradación de la deuda de EE.UU. por Moody's— tiene décadas de recorrido potencial.

Para Perú, el oro a US$ 3,600+/oz es un multiplicador de ingresos de exportación: cada 10 dólares de alza por onza genera ~US$ 24 millones anuales adicionales de exportaciones mineras (asumiendo producción de 3.4M oz/año). Con el oro en US$ 3,620 vs los US$ 2,050 de inicio de 2024, el impacto acumulado en los ingresos de exportación aurífera se mide en miles de millones de dólares anuales.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j012',
    titulo: 'Bitcoin consolida en US$ 108,000 tras ATH de US$ 112,000 del 2 de junio — ETFs spot acumulan USD 2,100M de entradas netas en la semana; dominance sube a 58% del mercado cripto',
    descripcion: 'Bitcoin (BTC) cotiza en US$ 108,000 el 4 de junio, consolidando ganancias tras el nuevo ATH de US$ 112,000 del lunes 2 de junio. Los ETFs de Bitcoin spot en EE.UU. acumularon USD 2,100 millones de entradas netas en la semana, el mayor flujo desde enero de 2024. La dominance de Bitcoin sobre el mercado cripto subió al 58%, máximo desde noviembre de 2024.',
    contenido: `Bitcoin (BTC) opera en US$ 108,000 en la sesión del 4 de junio de 2026, retrocediendo 3.6% desde el máximo histórico de US$ 112,050 registrado el lunes 2 de junio. El retroceso se encuadra en un patrón técnico saludable de consolidación: las correcciones del 3-5% después de nuevos ATH son habituales antes de que el precio busque niveles más altos. El volumen de Binance y Coinbase durante la consolidación fue el 40% menor que el del 2 de junio, señalando ausencia de presión vendedora significativa.

Los ETFs de Bitcoin spot en EE.UU. —encabezados por el iShares Bitcoin Trust (IBIT) de BlackRock— acumularon USD 2,100 millones de entradas netas en los últimos 5 días hábiles, el mayor flujo semanal desde el lanzamiento de los ETFs en enero de 2024. Solo el IBIT recibió USD 890 millones, elevando sus activos bajo gestión a US$ 52,400 millones. El Fidelity FBTC sumó USD 340 millones y el Ark 21Shares USD 210 millones.

La dominance de Bitcoin subió al 58%, máximo desde noviembre de 2024, reflejando que el flujo institucional actual se dirige preferentemente a Bitcoin frente a altcoins, patrón típico de la fase inicial de un ciclo alcista post-halving. El cuarto halving de Bitcoin se produjo en abril de 2024; históricamente, los ATH post-halving se producen entre 12 y 18 meses después.

MicroStrategy (rebrandeada como Strategy) anunció la compra de 3,200 BTC adicionales entre el 28 de mayo y el 3 de junio a un precio promedio de US$ 105,800, elevando sus holdings totales a 592,400 BTC (US$ 63,979 millones al precio actual).`,
    analisis: `Un Bitcoin en US$ 108,000 consolidando después de un ATH de US$ 112,000 con flujos de ETFs récord es el patrón técnico y de flujos más alcista posible. La participación institucional a través de ETFs regulados cambia la naturaleza del ciclo: las correcciones son más moderadas porque los compradores institucionales tienen horizontes de inversión más largos que los traders retail.

Para el mercado de divisas peruano, un Bitcoin bullish implica mayor demanda de dólares en el mercado local: el cliente que compra BTC en exchanges nacionales necesita USD previamente, generando flujo hacia operadores de cambio. Un ciclo alcista sostenido en cripto puede ser un catalizador indirecto de demanda de divisas en el mercado local.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j013',
    titulo: 'Milei anuncia Privatizaciones 2.0 en Argentina — YPF (25% flotante), Banco Nación y Aerolíneas en lista; FMI aprueba cuarta revisión y desembolsa USD 1,300M; riesgo país a 380 pbs',
    descripcion: 'El presidente Javier Milei presentó el plan Privatizaciones 2.0 ante el Congreso argentino: venta del 25% de YPF en bolsa, privatización total de Aerolíneas Argentinas y transformación del Banco Nación en entidad mixta. El FMI aprobó la cuarta revisión del programa Stand-By y desembolsó USD 1,300 millones. El riesgo país cayó a 380 pbs, mínimo desde 2018.',
    contenido: `El presidente de Argentina, Javier Milei, presentó ante el Congreso Nacional el plan denominado Privatizaciones 2.0, la segunda fase de las reformas estructurales de su gobierno. El plan contempla tres operaciones: la colocación en bolsa del 25% del capital de YPF S.A. (actualmente 100% estatal) mediante una OPI en la BCBA y simultáneamente en el NYSE; la privatización total de Aerolíneas Argentinas mediante licitación pública; y la transformación del Banco de la Nación Argentina en entidad de economía mixta con 49% de participación privada.

El anuncio coincidió con la aprobación por el FMI de la cuarta revisión del programa Stand-By de USD 20,000 millones firmado en enero de 2026 y el desembolso de USD 1,300 millones, el mayor giro del año. La directora gerente del FMI destacó los avances sobresalientes en disciplina fiscal, desinflación y normalización cambiaria de Argentina.

La inflación argentina cayó del 211% anual de diciembre de 2023 al 4.2% anual de abril de 2026 (medición mensual: 0.3%), el nivel más bajo en 17 años. La tasa de cambio oficial cotiza en ARS 1,020 por dólar, con el diferencial con el mercado informal reducido al 8%, el menor en seis años. Las reservas internacionales netas del BCRA suman USD 28,400 millones.

La reacción del mercado fue positiva: el índice Merval subió 4.8% y los bonos soberanos Bonar 2035 y 2038 ganaron 1.2 puntos porcentuales. El riesgo país cayó a 380 pbs, su nivel más bajo desde 2018.`,
    analisis: `Argentina bajo Milei protagoniza la transformación fiscal y macroeconómica más rápida de un país grande en América Latina en décadas. La caída de la inflación del 211% al 4.2% en 28 meses, la eliminación del déficit fiscal y la acumulación de reservas son logros objetivamente extraordinarios.

Para el mercado de divisas regional, una Argentina con diferencial blue del 8% reduce las distorsiones que históricamente generaban arbitraje cambiario entre los mercados de la región. Un ecosistema cambiario latinoamericano más ordenado beneficia a operadores formales de cambio que compiten con el mercado informal en calidad y velocidad de servicio.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j014',
    titulo: 'Banrep Colombia recorta tasa 25 pbs a 5.00% — primera rebaja tras pausa de 4 meses; inflación mayo cae a 4.6% y abre espacio; peso colombiano cede a COP 3,670 post-decisión',
    descripcion: 'El Banco de la República de Colombia (Banrep) recortó su tasa de intervención en 25 pbs hasta el 5.00% en su reunión del 4 de junio de 2026, retomando el ciclo de relajación monetaria tras una pausa de cuatro meses. La inflación de mayo cayó a 4.6% anual. El peso colombiano cede 0.4% a COP 3,670 post-decisión.',
    contenido: `El Banco de la República de Colombia (Banrep) sorprendió a los mercados al recortar su tasa de intervención de política monetaria en 25 pbs hasta el 5.00% en su reunión del 4 de junio de 2026, reanudando el ciclo de recortes que había iniciado en diciembre de 2024 y pausado en febrero de 2026. El consenso de analistas esperaba que Banrep mantuviera la tasa en 5.25% dado que la inflación todavía supera el techo de la banda meta del 2%-4%.

La decisión se fundamenta en el IPC de mayo de Colombia: la inflación cayó a 4.6% anual desde el 5.1% de abril, el menor nivel desde agosto de 2021. La inflación de servicios —el componente más persistente— retrocedió de 7.8% a 6.8%, una caída de 100 pbs en un solo mes que convenció a la mayoría de los miembros de la junta de que la convergencia está en curso.

La decisión fue adoptada por seis votos a favor y uno en contra (el disidente prefería esperar dos lecturas consecutivas por debajo del 5%). El comunicado señala que la política monetaria continuará siendo calibrada de manera gradual y dependiente de los datos.

El peso colombiano (COP) cedió 0.4% hasta COP 3,670 por dólar inmediatamente después de la decisión, reacción típica ante recortes de tasas. Los analistas de Davivienda y Bancolombia señalan que el movimiento es transitorio: los fundamentales de balanza de pagos deberían sostener al COP por debajo de COP 3,700 en el corto plazo.`,
    analisis: `El recorte del Banrep a 5.00% con inflación en 4.6% (sobre el techo del 4%) muestra que el banco central colombiano prioriza el estímulo al crecimiento sobre la cautela inflacionaria, un trade-off que históricamente genera volatilidad cambiaria. La diferencia con el BCRP peruano es instructiva: el BCRP mantiene en 4.25% con inflación en 3.7%, esperando dos lecturas convergentes antes de recortar.

Para los clientes de QoriCash con negocios en Colombia, el COP en COP 3,670 post-recorte es 0.8% más débil que los COP 3,642 de ayer. Si el Banrep recorta otros 25 pbs en los próximos dos meses (escenario con 55% de probabilidad de mercado), el COP podría ceder a COP 3,720-3,750, haciendo las importaciones desde Colombia más baratas en soles pero encareciendo los cobros en COP.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19676231/pexels-photo-19676231.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'j015',
    titulo: 'BCCh Chile mantiene tasa en 3.75% y señaliza recorte en julio — IPC mayo 3.2% confirma convergencia a la meta; peso chileno en CLP 882 impulsado por cobre a US$ 5.15/lb',
    descripcion: 'El Banco Central de Chile (BCCh) mantuvo su Tasa de Política Monetaria en 3.75% en la reunión del 3 de junio, en línea con expectativas. El comunicado señaliza un recorte de 25 pbs en julio como escenario base. El IPC de mayo en 3.2% confirma la convergencia a la meta del 3%. El peso chileno se aprecia a CLP 882 por dólar impulsado por el cobre en US$ 5.15/lb.',
    contenido: `El Banco Central de Chile (BCCh) decidió por unanimidad mantener la Tasa de Política Monetaria (TPM) en 3.75% en su reunión del 3 de junio de 2026, en línea con las expectativas del 94% de los economistas encuestados por Bloomberg. El comunicado post-reunión señaliza que de continuar la convergencia de la inflación según lo proyectado, un ajuste adicional de 25 pbs en la reunión de julio sería apropiado, lo que el mercado interpreta como un compromiso de recorte en julio con alta probabilidad.

El IPC de mayo de Chile, publicado el viernes 30 de mayo, registró 3.2% anual, el menor nivel desde diciembre de 2020 y prácticamente en el centro del rango meta del 2%-4%. La inflación de servicios cayó al 4.1% (desde 4.8% en abril) y la inflación subyacente se ubica en 3.0%, primera lectura en el blanco del objetivo desde 2021.

La economía chilena creció 3.8% anual en el Q1 2026, beneficiada por el cobre alto y la recuperación del consumo interno. El mercado laboral muestra resiliencia con desempleo del 8.4% (vs 9.1% de Q1 2025). El IMACEC de abril creció 3.5% anual, sosteniendo el momentum del Q1.

El peso chileno (CLP) se aprecia hasta CLP 882 por dólar durante la sesión del 4 de junio, impulsado por el cobre a US$ 5.15/lb y la debilidad del DXY. El CLP acumula una apreciación del 4.1% en el año (desde CLP 919 de inicio de enero), siendo junto al sol peruano y el real brasileño una de las tres divisas latinoamericanas con mejor desempeño en 2026. La correlación histórica del CLP con el precio del cobre (R² de 0.78 mensual) explica en gran medida este movimiento.`,
    analisis: `Un BCCh que señaliza explícitamente el recorte de julio con inflación en el blanco del 3% es el banco central latinoamericano más avanzado en el ciclo de normalización monetaria después de Brasil. La TPM en 3.75% con inflación en 3.2% implica una tasa real de política del 0.55%, nivel esencialmente neutral para Chile.

Para la paridad CLP/PEN, que el BCCh recorte en julio mientras el BCRP posiblemente también recorte implica que el diferencial de tasas entre los dos países se mantiene relativamente estable. El CLP y el PEN deberían continuar apreciándose en paralelo frente al dólar mientras el DXY se mantenga débil y el cobre supere US$ 5/lb. La paridad cruzada CLP/PEN permanecerá en el rango de 0.0041-0.0043 soles por peso chileno (CLP 1,000 ≈ S/ 4.20-4.30).`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-05T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29713911/pexels-photo-29713911.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i001',
    titulo: 'Sol peruano toca S/ 3.41 — mínimo del año impulsado por superávit comercial récord y reservas BCRP en US$ 100,000M mientras mercados globales debilitan el dólar',
    descripcion: 'El sol peruano cotiza en S/ 3.41 por dólar este 3 de junio, el nivel más apreciado del año 2026. La confluencia del superávit comercial de 5 meses acumulado en US$ 9,800 millones, las reservas internacionales en US$ 100,000 millones y la debilidad global del DXY explican la apreciación.',
    contenido: `El sol peruano operó en S/ 3.41 por dólar en la apertura del 3 de junio de 2026, consolidando su posición como una de las monedas emergentes con mejor desempeño en lo que va del año en América Latina. El tipo de cambio acumula una apreciación del 2.3% frente al dólar desde el inicio de 2026, cuando cotizaba en S/ 3.49.

Los fundamentos detrás del fortalecimiento son múltiples. El superávit comercial acumulado de enero a mayo alcanzó los US$ 9,800 millones, impulsado por las exportaciones mineras que crecieron 57.3% en el primer trimestre. El cobre a US$ 5.15/lb y el oro a US$ 3,391/oz generan un flujo constante de divisas que el BCRP debe absorber para evitar una apreciación excesiva. Las reservas internacionales netas superaron por primera vez los US$ 100,000 millones en mayo, el mayor nivel de la historia del país.

El contexto internacional también favorece al sol: el DXY cotiza por debajo de 99, presionado por las expectativas de recortes de la Fed y la revisión a la baja de Moody's a la deuda soberana de Estados Unidos. En este entorno, los flujos de capital hacia mercados emergentes con fundamentos sólidos se han acelerado. Perú, con su grado de inversión desde Moody's, S&P y Fitch, es uno de los destinos favoritos de los gestores de renta fija emergente.

El BCRP ha intervenido comprador en el mercado cambiario por US$ 1,200 millones en los últimos 20 días hábiles para evitar una apreciación disruptiva para los exportadores. El directorio del banco central se reúne el 11 de junio; el mercado estima 68% de probabilidad de mantenimiento de la tasa en 4.25%.`,
    analisis: `Un sol en S/ 3.41 es una buena noticia para los importadores y para la inflación importada, pero crea presión sobre los exportadores no mineros (textiles, agro) que tienen costos en soles pero ingresos en dólares. Las empresas con deuda en dólares también se benefician, pues el costo de servicio medido en soles se reduce.

Para quienes tienen exposición cambiaria activa —ya sea cuentas por cobrar en USD o por pagar en USD— el nivel de S/ 3.41 puede ser una ventana interesante para cerrar posiciones. El consenso de analistas ubica al sol entre S/ 3.38 y S/ 3.50 para los próximos 60 días, con sesgo apreciativo mientras el DXY se mantenga débil y el superávit comercial continúe.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13824652/pexels-photo-13824652.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i002',
    titulo: 'Cuenta regresiva al FOMC 16-17 junio — 65% de probabilidad de pausa con IPC mayo como árbitro; dot plot podría confirmar dos recortes en H2 2026',
    descripcion: 'La Reserva Federal se reúne en 13 días en lo que será el primer FOMC bajo la presidencia de Kevin Warsh. El mercado asigna 65% de probabilidad de mantener el rango 3.50%-3.75%. La publicación del IPC de mayo el 10 de junio será el factor determinante: una lectura por debajo de 2.9% abriría la puerta a un cambio en el dot plot.',
    contenido: `Con 13 días para la reunión del Comité Federal de Mercado Abierto (FOMC) del 16 y 17 de junio, los mercados operan en modo de espera. El CME FedWatch tool sitúa en 65% la probabilidad de que la tasa de fondos federales permanezca en el rango 3.50%-3.75% por cuarta reunión consecutiva. La probabilidad de un recorte de 25 puntos básicos en esta reunión es del 35%.

El dato más esperado antes del FOMC es el Índice de Precios al Consumidor (IPC) de mayo, que el Bureau of Labor Statistics publicará el martes 10 de junio. El consenso de economistas ubica la lectura en 2.9% interanual para el IPC general y 2.7% para el core (excluye alimentos y energía). Si el dato sorprende a la baja —por debajo de 2.7% en el core— la probabilidad de recorte en junio podría escalar hasta el 55-60%.

El FOMC del 17 de junio también publicará el Summary of Economic Projections (SEP), el llamado "dot plot" que muestra las proyecciones de tasa de cada miembro del Comité para los próximos años. Los analistas de Goldman Sachs y Morgan Stanley coinciden en que si el dot plot proyecta dos recortes de 25 pbs en el segundo semestre de 2026, el DXY podría caer a 96-97, impulsando una apreciación generalizada de las monedas emergentes.

Kevin Warsh, que asumió la presidencia de la Fed en febrero, ha mantenido un tono más cauto que Jerome Powell en sus comunicaciones públicas, subrayando la importancia de "asegurar que la última milla desinflacionaria esté consolidada antes de recortar". Sin embargo, con la inflación de servicios cediendo y el mercado laboral moderándose, el margen para una postura más acomodaticia está creciendo.`,
    analisis: `Un FOMC con pausa pero dot plot dovish —proyectando dos recortes en H2— es el escenario más constructivo para los mercados emergentes: el DXY se debilita estructuralmente, el carry trade hacia monedas de alta tasa real (como el sol peruano) se vuelve más atractivo y los flujos de capital hacia bonos emergentes se aceleran.

Para quienes tienen deuda o financiamiento en dólares, el momento de asegurar tasas puede ser ahora: una vez que la Fed comience a recortar, el costo de financiamiento en USD bajará, pero también lo hará el tipo de cambio si el sol se aprecia. El neto dependerá de la magnitud de cada movimiento; modelar escenarios de sensibilidad antes del 17 de junio es prudente.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/4705378/pexels-photo-4705378.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i003',
    titulo: 'Exportaciones mineras peruanas suman US$ 21,400M en Q1 — cobre +50.9% y oro +63% elevan la participación minera al 57.3% del total exportado',
    descripcion: 'Las exportaciones mineras de Perú alcanzaron US$ 21,400 millones en el primer trimestre de 2026, un 57.3% más que en Q1 2025. El cobre lideró con +50.9% impulsado por precios promedio 53.7% mayores. El sector minero representó el 57.3% de las exportaciones totales del país, que crecieron 37.8% hasta US$ 28,700 millones.',
    contenido: `El Ministerio de Energía y Minas (MINEM) publicó los datos de exportaciones mineras del primer trimestre de 2026, confirmando un desempeño histórico: US$ 21,400 millones exportados, un 57.3% más que en el mismo período de 2025. El total de exportaciones del país en Q1 llegó a US$ 28,700 millones (+37.8%), superando las exportaciones totales de cualquier trimestre en la historia peruana.

El cobre fue el motor del trimestre: las exportaciones crecieron 50.9% en valor, con el precio promedio del metal en el London Metal Exchange subiendo 53.7% en el período. Perú produce 2.77 millones de toneladas métricas de cobre fino al año y cuenta con 12% de las reservas mundiales. Las cuatro grandes operaciones —Cerro Verde (Freeport), Southern Copper, Antamina (BHP/Glencore) y Quellaveco (Anglo American)— operaron a plena capacidad durante el trimestre.

El oro también registró un trimestre extraordinario, con exportaciones creciendo 63% en valor, beneficiadas por el precio spot que superó los US$ 3,391/oz. Yanacocha (Newmont/Buenaventura) completó su expansión Sulfuros en diciembre y aportó 180,000 onzas adicionales en Q1. Junco (Gold Fields) y Shahuindo (Pan American Silver) también reportaron producciones en línea con guías anuales.

Southern Copper ejecuta el plan de expansión más ambicioso del sector: busca aumentar su producción de 987,000 toneladas (2019) a 1.81 millones de toneladas en 2026, una vez que el proyecto Michiquillay reciba la licencia de construcción esperada para el segundo semestre. Junto a los US$ 64,000 millones en cartera de proyectos mineros identificados por el MINEM, Perú consolida su posición de tercer productor mundial de cobre.`,
    analisis: `El superávit comercial que sostiene la fortaleza del sol peruano en S/ 3.41 tiene un nombre: minería. Cada US$ 1.00 adicional en el precio del cobre genera aproximadamente US$ 2,800 millones adicionales de exportaciones anuales para Perú. Con el cobre en US$ 5.15/lb y perspectivas de demanda impulsadas por la transición energética y la infraestructura de IA, los fundamentos de la balanza comercial son los más sólidos en décadas.

Para tesoreros y CFOs con flujos en dólares, el dinamismo exportador minero crea un mercado spot de divisas con amplia liquidez. La profundidad del mercado cambiario PEN/USD en Lima es mayor que en años anteriores, lo que facilita la cobertura de posiciones sin impacto significativo en el precio.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/14747539/pexels-photo-14747539.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i004',
    titulo: 'Agroexportaciones Q1 2026 superan US$ 3,067M — palta, uva y arándano crecen doble dígito mientras café supera US$ 498M en cinco meses',
    descripcion: 'Las exportaciones agroalimentarias del Perú cerraron el primer trimestre de 2026 en US$ 3,067 millones (+18.4%), con la palta Hass liderando con US$ 420M (+23%) y los arándanos en US$ 380M (+19%). El café acumula US$ 498M en enero-mayo (+57%), en camino de superar por primera vez la barrera de US$ 1,100M anuales.',
    contenido: `El MINCETUR y la Asociación de Exportadores (ADEX) confirmaron que las agroexportaciones del Perú alcanzaron US$ 3,067 millones en el primer trimestre de 2026, un crecimiento del 18.4% frente al Q1 2025. El sector agroexportador consolida su posición como el segundo mayor generador de divisas del país, solo detrás de la minería.

La palta Hass es el producto estrella del trimestre: US$ 420 millones exportados (+23%), con Estados Unidos (45%), Países Bajos (28%) y España (12%) como principales destinos. Las regiones de La Libertad e Ica lideraron el volumen exportado. El precio FOB promedio de la palta peruana en Q1 fue de US$ 1,380 por tonelada, un 8% superior al promedio de 2025, beneficiado por una menor oferta chilena.

Los arándanos generaron US$ 380 millones (+19%), con una ventana exportadora que ahora se extiende de agosto a febrero. La variedad Biloxi, adaptada al clima de La Libertad y Áncash, ha permitido extender la temporada y competir con Argentina y Marruecos en los mercados europeos. El consumo global de arándanos frescos crece al 7% anual, impulsado por su posicionamiento como superfruta en Europa y Asia.

El café merece mención especial: las exportaciones acumuladas de enero a mayo suman US$ 498 millones (+57%), con el arábica peruano cotizando en el ICE de Nueva York por encima de los US$ 4,200 por quintal. Los 185,000 productores cafetaleros del Perú —concentrados en Amazonas, Cajamarca y San Martín— registran los mejores ingresos de su historia. MINCETUR proyecta que las exportaciones anuales de café superarán por primera vez los US$ 1,100 millones en 2026.`,
    analisis: `El boom agroexportador tiene un efecto redistributivo positivo: a diferencia de la minería (concentrada en pocas empresas grandes), el café y los arándanos benefician a cientos de miles de pequeños productores rurales. El ingreso per cápita de los valles cafetaleros ha crecido 50-70% en 18 meses —un dato que no aparece en el PBI pero que transforma comunidades.

Para el tipo de cambio, los flujos agroexportadores tienen estacionalidad marcada: los mayores ingresos de divisas se concentran en los meses de cosecha (agosto-febrero para arándanos, mayo-octubre para café). Fuera de esas ventanas, la presión exportadora sobre el tipo de cambio se reduce, generando oportunidades de cobertura a mejores precios.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10112717/pexels-photo-10112717.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i005',
    titulo: 'MEF mantiene proyección de crecimiento 3.8% para 2026 — inversión pública ejecutada supera S/ 12,000M en cinco meses con avance del 38% vs 2025',
    descripcion: 'El Ministerio de Economía y Finanzas ratificó su proyección de crecimiento del PBI en 3.8% para 2026, apoyada en la aceleración de la inversión pública. Los gobiernos regionales y locales ejecutaron S/ 12,100 millones en los primeros cinco meses, un 38% más que en el mismo período de 2025. El sector construcción creció 9.4% en abril.',
    contenido: `El Ministerio de Economía y Finanzas (MEF) ratificó la proyección de crecimiento del PBI en 3.8% para 2026 en su informe mensual de seguimiento macroeconómico publicado este martes. El dato del primer trimestre —que el INEI publicará la próxima semana— se estima en 4.1% interanual, por encima de la proyección de consenso de 3.6%, impulsado por el boom exportador y la aceleración de la inversión pública.

La inversión pública ejecutada en enero-mayo sumó S/ 12,100 millones, un 38% más que en el mismo período de 2025. El MEF atribuye el avance a tres factores: la simplificación administrativa en los procesos de contratación del Estado (DL 1551 y DL 1563), el fortalecimiento de las oficinas de programación de inversiones de los gobiernos regionales y la priorización de 127 proyectos de impacto nacional en el presupuesto 2026.

Los sectores con mayor ejecución son transportes (carreteras S/ 3,200M), educación (S/ 2,100M) y saneamiento (S/ 1,800M). Los gobiernos regionales de Cusco, Arequipa y Loreto lideran en montos absolutos; Madre de Dios, Tacna y Moquegua lideran en tasa de avance porcentual. El avance en construcción se refleja en el PBI sectorial: el sector creció 9.4% interanual en abril, según el INEI.

El déficit fiscal acumulado a mayo está en 1.8% del PBI, en línea con la meta de 2.0% para el año. Las presiones por el gasto corriente —especialmente remuneraciones (+8.3% interanual) y pensiones (+6.1%)— son compensadas por el dinamismo de los ingresos tributarios, que crecieron 12.4% en enero-mayo gracias a la minería y el IGV de importaciones.`,
    analisis: `Un déficit fiscal controlado en 1.8% del PBI con crecimiento de 3.8% proyectado es la combinación ideal para mantener el grado de inversión y atraer capitales. Peru tiene una de las deudas públicas más bajas de América Latina (~33% del PBI), lo que le da espacio para acelerar inversión sin comprometer la estabilidad.

Para el sector privado, la aceleración de la inversión pública en infraestructura crea demanda en cascada: cementeras, ferreterías, transportistas, consultores y empresas de servicios de ingeniería. El crecimiento del 9.4% en construcción en abril ya captura parte de ese efecto multiplicador.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i006',
    titulo: 'SBS: crédito al sector privado crece 6.2% en mayo — banca múltiple reporta morosidad estable en 3.1% y ROE promedio del sistema en 18.4%',
    descripcion: 'La Superintendencia de Banca, Seguros y AFP (SBS) reportó que el crédito al sector privado creció 6.2% interanual en mayo de 2026, acelerándose desde el 5.8% de abril. La morosidad del sistema se mantiene estable en 3.1% y el ROE promedio del sistema bancario alcanza 18.4%, indicando solidez del sector financiero.',
    contenido: `La Superintendencia de Banca, Seguros y AFP (SBS) publicó los indicadores del sistema financiero para mayo de 2026, mostrando un panorama de aceleración crediticia con morosidad contenida. El crédito al sector privado creció 6.2% interanual, el mayor ritmo desde enero de 2025, impulsado por los créditos a empresas medianas (+8.4%) y los créditos hipotecarios (+7.1%).

El crédito corporativo —destinado a las grandes empresas— creció solo 3.8%, ya que muchas tienen acceso a financiamiento en mercados de capitales a tasas más competitivas. El crédito a microempresas (+5.2%) y pequeñas empresas (+6.8%) muestra la recuperación del tejido productivo, apoyada en los programas Reactiva y FAE-MYPE de repago. El crédito de consumo avanzó 7.3%, el mayor en 18 meses.

La morosidad del sistema se mantiene en 3.1%, prácticamente sin cambios desde los 3.0% de diciembre de 2025. La cobertura de provisiones sobre cartera atrasada se ubica en 149%, uno de los ratios más altos de la región. Los bancos BCP, BBVA Perú, Scotiabank e Interbank —que en conjunto representan el 83% del sistema— reportaron ratios de capital por encima del 15%, muy por encima del mínimo regulatorio de 10%.

El ROE (retorno sobre patrimonio) promedio del sistema bancario alcanza 18.4%, superior al 16.2% del mismo período de 2025. El margen neto de interés se beneficia de tasas activas en niveles elevados mientras el BCRP mantiene su tasa de referencia en 4.25%, lo que comprime el costo de fondeo de los bancos más eficientes.`,
    analisis: `Un sistema bancario con morosidad en 3.1% y ROE en 18.4% con crédito creciendo al 6.2% es sinónimo de transmisión monetaria funcionando: las empresas acceden a financiamiento y el consumo se sostiene. La aceleración crediticia es consistente con un PBI que crece alrededor de 4% en Q1 2026.

Para las empresas en expansión, este es un momento favorable para negociar líneas de crédito revolventes o financiamiento de capital de trabajo: la liquidez del sistema es alta y la competencia entre bancos por buenos créditos mantiene los spreads comprimidos. Quienes tengan proyectos de inversión en cartera deberían explorar el mercado ahora, antes de que un eventual recorte de la tasa de referencia reduzca el margen de los bancos y los vuelva más selectivos.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/29117446/pexels-photo-29117446.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i007',
    titulo: 'PMI manufactura China cae a 49.1 en mayo — sexto mes bajo 50 mientras servicios Caixin en 53.0 amplían la divergencia; impacto en commodities peruanos',
    descripcion: 'El PMI manufacturero oficial de China cayó a 49.1 en mayo, su menor lectura en ocho meses y el sexto mes consecutivo en zona de contracción. El PMI de servicios Caixin subió a 53.0, ampliando la brecha entre la manufactura exportadora y el consumo doméstico. La divergencia complica el análisis del impacto en los precios del cobre y el hierro.',
    contenido: `El PMI manufacturero oficial de China (NBS) registró 49.1 en mayo de 2026, por debajo de las expectativas del mercado (49.5) y el umbral de 50 que separa expansión de contracción por sexto mes consecutivo. Es la lectura más baja desde septiembre de 2025. El desglose muestra caídas en nuevos pedidos (-1.2 puntos), producción (-0.8) y empleo (-0.4), mientras los inventarios de productos terminados aumentaron por tercer mes.

La contracción manufacturera refleja el impacto de los aranceles estadounidenses —que en promedio alcanzan el 32% sobre productos chinos desde la escalada de marzo— sobre los exportadores. Las fábricas del delta del Yangtze (electrónicos, electrodomésticos) y Guangdong (textiles, plásticos) reportan caídas en pedidos del exterior de entre 15% y 25%.

En contraste, el PMI de servicios Caixin subió a 53.0 en mayo, el mayor desde marzo de 2025, reflejando la resiliencia del consumo doméstico. Los servicios de turismo interior, restauración y entretenimiento digital mantienen el dinamismo. El gobierno chino destinó 800,000 millones de yuanes en subsidios al consumo en el primer semestre, lo que sostiene la demanda interna.

El impacto sobre los commodities es mixto. El cobre, que depende más de la inversión en infraestructura (tendidos eléctricos, construcción) que de la manufactura exportadora, mantiene soporte en US$ 5.10-5.15/lb. El mineral de hierro, más ligado a la construcción residencial (en contracción desde 2024), cedió 2.3% hasta US$ 98/TM. Para el aluminio y el zinc, la debilidad manufacturera presiona los precios a la baja.`,
    analisis: `La divergencia entre la manufactura débil y los servicios fuertes en China es una señal de reequilibrio estructural: la economía china está moviéndose de la manufactura exportadora hacia el consumo doméstico. Para Perú, esto es positivo neto: la demanda de cobre —que va a infraestructura eléctrica y vehículos eléctricos, no a exportaciones de fábricas— se mantiene sólida, mientras el hierro (que Perú exporta en menor medida) enfrenta más presión.

Para importadores peruanos de insumos chinos (textiles, plásticos, maquinaria), la debilidad de la manufactura china puede traducirse en mejores precios de compra en los próximos dos a tres trimestres, ya que los fabricantes chinos compiten más agresivamente por pedidos externos.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/31047132/pexels-photo-31047132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i008',
    titulo: 'S&P 500 en zona de consolidación 5,680-5,720 pts — mercado espera IPC mayo el 10 de junio y dot plot del FOMC para definir dirección del segundo semestre',
    descripcion: 'El S&P 500 cerró el lunes en 5,694 puntos, dentro de un rango de consolidación de las últimas tres semanas. El Nasdaq 100 avanzó 0.4% apoyado en Nvidia y Microsoft. Los mercados operan con cautela mientras esperan el IPC de mayo (10 jun) y el dot plot de la Fed (17 jun) como catalizadores para definir la dirección del segundo semestre.',
    contenido: `El S&P 500 cerró la jornada del 2 de junio en 5,694 puntos, con un avance del 0.15%, dentro de un rango lateral de 5,650-5,730 que se ha mantenido por 15 jornadas consecutivas. La falta de dirección refleja el compás de espera del mercado ante dos datos macro de alta importancia en las próximas dos semanas: el IPC de mayo el 10 de junio y la decisión del FOMC con su dot plot el 17 de junio.

El sector tecnológico lideró las ganancias del día: Nvidia (+1.8%) superó expectativas de pedidos de chips H200 para centros de datos en Asia. Microsoft (+0.9%) anunció la integración de Copilot en toda su suite de productividad empresarial. Apple (-0.3%) cedió terreno ante preocupaciones sobre la penetración del iPhone en China. El Nasdaq 100 avanzó 0.4% hasta 19,842 puntos.

Los sectores defensivos operaron mixtos: utilities (-0.5%) y consumo básico (-0.3%) cedieron mientras los inversores rotaron hacia tecnología y financiero. El sector energético (+0.8%) se benefició de la subida del WTI a US$ 95/barril. El VIX (índice de volatilidad) cotizó en 15.4, por debajo de su promedio anual de 16.8, sugiriendo complacencia en el mercado.

Las señales de alerta están en el mercado de deuda: el spread del high yield (HY) estadounidense se amplió 18 puntos básicos hasta 380 pbs, el mayor nivel en seis semanas, reflejando preocupación por el impacto de los aranceles en las empresas pequeñas y medianas. Los bonos del Tesoro a 10 años cotizan en 4.24%, prácticamente sin movimiento frente al viernes.`,
    analisis: `Un S&P 500 lateral por tres semanas antes de dos catalizadores de primer orden (IPC mayo + dot plot Fed) es una situación técnica típica de acumulación antes de un movimiento. Si el IPC de mayo confirma la desinflación (core por debajo de 2.7%) y el dot plot proyecta dos recortes, el S&P tiene espacio para superar los 5,800 puntos antes de agosto.

El escenario negativo —IPC de mayo sorprendiendo al alza por encima del 3.0%— mantendría a la Fed en pausa indefinida y presionaría al S&P hacia el soporte de 5,500-5,550. La asimetría de riesgo-beneficio favorece al escenario base constructivo, pero el mercado está claramente esperando confirmación antes de romper la lateralidad.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/33539235/pexels-photo-33539235.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i009',
    titulo: 'WTI supera US$ 95/barril — tercer día consecutivo de ganancias por tensión EEUU-Irán y drawdown de inventarios de 6.8M barriles; OPEP+ se reúne el 7 de junio',
    descripcion: 'El WTI crude futures subió a US$ 95.4/barril el 3 de junio, acumulando tres jornadas consecutivas de avance. La escalada se explica por los ataques del Comando Central de EE.UU. en Qeshm Island (Irán), el drawdown de inventarios de 6.8 millones de barriles según datos de la API y la expectativa de que el OPEP+ mantenga recortes en la reunión del 7 de junio.',
    contenido: `El WTI crude oil futures para entrega en julio cotizó en US$ 95.4/barril durante la sesión del 3 de junio de 2026, el nivel más alto en cuatro semanas. La suba acumula 7.8% en tres jornadas, impulsada por la prima de riesgo geopolítico derivada de los ataques del Comando Central de EE.UU. en instalaciones en la Isla de Qeshm (Irán) y la respuesta iraní con misiles balísticos hacia bases de la coalición en Irak.

El estrecho de Ormuz —por donde transita el 21% del petróleo comercializado mundialmente— no ha reportado interrupciones en el tránsito de buques tanqueros, pero la prima de seguro de carga por el estrecho subió 0.65% del valor del cargamento, el doble del promedio de 2025. Lloyd's of London y los principales reaseguradores han elevado las tasas para tránsitos en el Golfo Pérsico.

El dato de inventarios del American Petroleum Institute (API) de la semana terminada el 30 de mayo mostró un drawdown de 6.8 millones de barriles, el mayor en 14 semanas y superior a las estimaciones de consenso (-3.2M). Si el dato oficial de la EIA —programado para las 10:30 AM ET del miércoles— confirma la cifra, sería el sexto drawdown semanal consecutivo, señalando que la demanda estadounidense de verano absorbe la oferta más rápido de lo esperado.

El OPEP+ se reúne el 7 de junio en sesión de seguimiento. Los miembros del grupo aprobaron en mayo un ajuste modesto de +188,000 barriles/día para junio. Fuentes diplomáticas indican que la reunión del 7 se centrará en verificar el cumplimiento de cuotas por parte de Irak, Kazajistán y Emiratos Árabes Unidos, que han producido por encima de sus niveles acordados.`,
    analisis: `El petróleo en US$ 95/barril tiene implicancias directas para el Perú: las importaciones de combustibles —principalmente diésel para la minería y GLP para cocina— se encarecen. Petroperú importa el 40% de su diésel del mercado spot; a US$ 95/bbl el costo de importación sube aproximadamente S/ 0.18/galón respecto al promedio de mayo.

Para empresas con flotas de vehículos o maquinaria pesada, el precio del diésel en Lima puede subir S/ 0.10-0.15/galón en las próximas 2-3 semanas si el WTI se mantiene en estas alturas. Asegurar stock de combustible o cerrar contratos de abastecimiento a precio fijo puede ser una estrategia eficiente en este entorno.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i010',
    titulo: 'PEN/USD: sol consolida en S/ 3.41 con soporte en 3.39 — volumen del mercado spot sube 18% y el BCRP compra US$ 82M para moderar la apreciación',
    descripcion: 'El par PEN/USD opera en S/ 3.41 en el mercado interbancario de Lima, con el tipo de cambio en tendencia bajista sostenida. El soporte técnico más cercano se ubica en S/ 3.39 (mínimo de octubre de 2024) y la resistencia en S/ 3.44. El BCRP intervino comprando US$ 82 millones para moderar la velocidad de apreciación.',
    contenido: `El tipo de cambio PEN/USD consolidó en S/ 3.41 al cierre del 2 de junio y abrió sin cambios el 3 de junio. Desde el punto de vista técnico, el precio opera por debajo de sus medias móviles de 50 días (S/ 3.47) y 200 días (S/ 3.52), confirmando una tendencia bajista de mediano plazo. El RSI de 14 períodos en el gráfico diario se ubica en 35, en zona de sobreventa pero sin señal de reversión clara.

El volumen de operaciones en el mercado cambiario spot de Lima subió 18% el lunes frente al promedio de mayo, alcanzando US$ 680 millones en el día, el mayor desde el 14 de mayo. El aumento de volumen en tendencia bajista es una señal técnica típica de continuación: indica que los vendedores de dólares (exportadores, remesas, inversores) están activos y abastecen el mercado con fluidez.

El BCRP intervino comprando US$ 82 millones el 2 de junio a través de swaps cambiarios, su herramienta preferida para evitar volatilidad sin impactar directamente el precio. En lo que va de junio (solo dos días hábiles), el banco central ha comprado US$ 164 millones. La postura del BCRP es de "suavizar la pendiente" pero no resistir la tendencia, lo que implica que el sol puede seguir apreciándose mientras los fundamentals lo soporten.

Los niveles técnicos clave: soporte inmediato en S/ 3.40 (psicológico), soporte fuerte en S/ 3.39 (mínimo de octubre 2024). Si el sol perfora S/ 3.39, el siguiente soporte relevante está en S/ 3.35 (máximo de apreciación de 2021). Por el lado de resistencias, S/ 3.44-3.45 es el primer freno al alza, coincidiendo con la media de 20 días.`,
    analisis: `Un sol en S/ 3.41 con el BCRP comprando divisas para moderar la apreciación es una combinación que puede mantenerse durante semanas: la tendencia estructural bajista del dólar global (DXY < 99) y el superávit comercial peruano generan presión apreciativa constante, mientras el banco central actúa como amortiguador.

Para quien tiene deuda en dólares o compromisos de pago en USD, cada centavo de apreciación del sol es una ganancia directa. Para exportadores no mineros con costos en soles, este entorno reduce la rentabilidad; evaluar el uso de forwards o opciones PEN/USD a 90-180 días puede proteger el margen operativo.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i011',
    titulo: 'Bitcoin cae a US$ 66,900 — baja 6.5% en 48 horas ante salidas de ETFs y tensión geopolítica; soporte técnico clave en US$ 65,000',
    descripcion: 'Bitcoin cotiza en US$ 66,900 el 3 de junio de 2026, con una caída del 6.5% en 48 horas. Los ETFs spot de Bitcoin en EE.UU. registraron US$ 420M en salidas netas en dos jornadas. El mercado cripto entra en modo defensivo por la escalada EEUU-Irán y la rotación hacia activos refugio tradicionales. El soporte técnico más relevante está en US$ 65,000.',
    contenido: `Bitcoin (BTC/USD) opera en US$ 66,900 durante la sesión del 3 de junio de 2026, con una pérdida acumulada del 6.5% frente al cierre del jueves 29 de mayo (US$ 71,589). La corrección comenzó el viernes con el NFP de mayo (152k empleos), que aunque positivo, disminuyó las expectativas de recorte inmediato de la Fed y redujo el apetito de riesgo de los inversores especulativos en cripto.

Los ETFs spot de Bitcoin listados en EE.UU. —el iShares Bitcoin Trust (IBIT) de BlackRock, el Fidelity Wise Origin Bitcoin Fund (FBTC) y el ARK 21Shares Bitcoin ETF (ARKB)— registraron salidas netas combinadas de US$ 420 millones en las dos últimas jornadas, el mayor flujo negativo de dos días desde la corrección de febrero. Los activos bajo gestión del universo de ETFs cripto en EE.UU. cayeron desde un récord de US$ 128,000 millones hasta US$ 122,500 millones.

La escalada geopolítica EEUU-Irán también presiona al cripto: en los eventos de riesgo geopolítico agudo, Bitcoin tiende a correlacionarse positivamente con el mercado de renta variable y negativamente con el oro (refugio tradicional). En las últimas 48 horas, el oro subió US$ 28/oz hasta US$ 3,391 mientras Bitcoin perdía 6.5%, confirmando la rotación hacia activos refugio convencionales.

Desde la perspectiva técnica, Bitcoin perdió el soporte de US$ 68,000 (media móvil de 50 días) y ahora prueba la zona de US$ 66,500-67,000. El siguiente soporte relevante está en US$ 65,000, que coincide con la zona de acumulación de mayo y la media de 100 días. El RSI en 4 horas se ubica en 34, sugiriendo sobreventa de corto plazo pero sin divergencia alcista confirmada.`,
    analisis: `Las correcciones del 6-8% en Bitcoin dentro de una tendencia alcista de mediano plazo son frecuentes y forman parte de la estructura normal del mercado cripto. El contexto de fondo —ETFs con US$ 120,000M+ en activos, dot plot Fed potencialmente dovish, demanda institucional creciente— no ha cambiado. Lo que cambia es el sentimiento de corto plazo.

Para quienes tienen exposición a Bitcoin como reserva de valor o diversificador, una corrección a US$ 65,000-66,000 es una zona de acumulación razonable con perspectiva de 60-90 días, especialmente si el dot plot del FOMC del 17 de junio señaliza dos recortes. El catalizador más positivo de corto plazo para el cripto sería un IPC de mayo por debajo de 2.7% el próximo martes 10.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/7267611/pexels-photo-7267611.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i012',
    titulo: 'DXY bajo 98.8 por tercer día consecutivo — mercados emergentes reciben flujos positivos; monedas de América Latina aprecian con sol peruano liderando',
    descripcion: 'El índice del dólar (DXY) cotiza en 98.76, manteniéndose por debajo de 99 por tercer día consecutivo. Las monedas emergentes se aprecian en bloque: sol peruano (S/ 3.41, -0.6%), peso colombiano (COP 3,590, -1.1%) y real brasileño (R$ 5.68, -0.9%) lideran la apreciación en la región. La postura dovish de la Fed y el déficit comercial de EE.UU. presionan al billete verde.',
    contenido: `El DXY (índice del dólar estadounidense frente a una cesta de seis monedas principales) cotiza en 98.76 al inicio de la sesión del 3 de junio, manteniéndose por debajo del nivel psicológico de 99 por tercer día consecutivo. El índice acumula una caída del 4.8% desde su máximo de 2026 (103.6, registrado en enero), con el deterioro acelerado desde la rebaja de la calificación crediticia de EE.UU. por Moody's en mayo.

Los factores estructurales que presionan al dólar son tres. Primero, las expectativas de que la Fed comience a recortar tasas en septiembre (81% de probabilidad según el CME) mientras el Banco de Japón sube las suyas y el BCE mantiene una postura neutral. Segundo, el déficit por cuenta corriente de EE.UU. que en Q1 2026 alcanzó US$ 248,000 millones, un récord histórico impulsado por el alza de importaciones aranceladas. Tercero, la diversificación de reservas de bancos centrales asiáticos y del Golfo hacia el euro, el yen y el oro.

En América Latina, el movimiento del DXY es amplificado por los fundamentos locales. El sol peruano (S/ 3.41) se beneficia del superávit comercial y las reservas históricas. El peso colombiano (COP 3,590) gana por el petróleo caro (WTI US$ 95) y los flujos de remesas. El real brasileño (R$ 5.68) mejora por el ajuste fiscal de Haddad. El peso mexicano (MXN 17.2) lidera las apreciaciones regionales en el año (+6.4% vs USD).

El nivel técnico más relevante para el DXY es 97.5-98.0: si el índice perfora ese soporte —coincidente con los mínimos de 2023 y 2021— se abriría el camino hacia 94-95, niveles que no se ven desde 2020. Ese escenario requeriría una combinación de dot plot muy dovish (tres recortes proyectados), IPC mayo < 2.5% y deterioro fiscal acelerado en EE.UU.`,
    analisis: `Un DXY en tendencia bajista es el viento de cola más poderoso para las monedas emergentes con fundamentos sólidos. Para el sol peruano, cada punto de caída del DXY se traduce históricamente en una apreciación de 0.3-0.5% frente al dólar. La correlación negativa DXY/PEN es estructural y no desaparece en horizontes de 30-90 días.

Para empresas peruanas con deuda en dólares emitida en mercados internacionales, el entorno es doblemente favorable: el costo medido en soles cae (apreciación del sol) y los spreads soberanos se comprimen (menor riesgo país). Si tienen ventanas de recompra o prepago, este entorno puede ser óptimo para reducir el endeudamiento en moneda extranjera.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831511/pexels-photo-5831511.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i013',
    titulo: 'Argentina: inflación mensual de junio estimada en 2.1% — la más baja en 36 meses; peso en ARS 1,437/USD y reservas del BCRA en recuperación',
    descripcion: 'Las proyecciones del Relevamiento de Expectativas de Mercado (REM) del BCRA ubican la inflación de junio en 2.1% mensual, la más baja desde julio de 2023. El peso cotiza en ARS 1,437 por dólar oficial y el BCRA acumula reservas netas positivas por segundo mes consecutivo. La desinflación gradual refuerza el programa del FMI.',
    contenido: `El Banco Central de la República Argentina (BCRA) publicó el Relevamiento de Expectativas de Mercado (REM) de mayo, que proyecta una inflación mensual de 2.1% para junio de 2026, la más baja desde julio de 2023. La inflación anual de Argentina se ubica en 32.4% en abril (desde 32.6% en marzo), en una trayectoria descendente sostenida desde el pico del 211% interanual de diciembre 2023. El gobierno de Milei celebra el dato como validación de su programa de ajuste fiscal y monetario.

El tipo de cambio oficial opera en ARS 1,437 por dólar, dentro del crawling peg del 1% mensual que el gobierno mantiene como ancla cambiaria. El dólar blue cotiza en ARS 1,510, una brecha del 5.1% —la más baja en cuatro años— reflejando la caída de la demanda de cobertura cambiaria ante la estabilización. El mercado de Lecaps (letras del Tesoro en pesos) ofrece tasas del 3.2% mensual, por encima de la inflación esperada, sosteniendo el carry trade en pesos.

Las reservas internacionales del BCRA muestran recuperación: los activos internacionales brutos alcanzan los US$ 38,400 millones, con las reservas netas en terreno positivo (US$ 2,800 millones) por segundo mes consecutivo. El superávit de la balanza comercial en mayo fue de US$ 1,200 millones, aportando divisas frescas. La liquidación de la cosecha gruesa (soja, maíz) se intensificará en junio y julio, aportando entre US$ 6,000 y US$ 7,000 millones adicionales.

El FMI aprobó en mayo la cuarta revisión del programa Extended Fund Facility (EFF) de US$ 57,000 millones, desembolsando US$ 3,200 millones. La misión del fondo destacó "el avance sostenido en la consolidación fiscal y la desinflación" pero advirtió sobre los riesgos electorales del segundo semestre (elecciones de medio término en octubre).`,
    analisis: `La convergencia de Argentina hacia inflación mensual de 2% es un hecho histórico y positivo para la estabilidad regional. Sin embargo, las elecciones de octubre introducen incertidumbre: si la coalición oficialista pierde la mayoría en el Congreso, el programa fiscal puede enfrentar resistencia. Los inversores en deuda argentina descuentan parcialmente ese riesgo con spreads de 900 pbs sobre Treasuries.

Para empresas peruanas con operaciones o proveedores en Argentina, el tipo de cambio en ARS 1,437 con crawling peg del 1% mensual es predecible en el corto plazo, lo que facilita la planificación de pagos. La baja de la inflación también reduce la indexación de contratos.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/13107068/pexels-photo-13107068.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i014',
    titulo: 'Colombia: TRM cae a COP 3,590/USD — 11.3% más fuerte que hace un año; Banrep en pausa con tasa en 9.25% mientras evalúa inflación de servicios',
    descripcion: 'La Tasa Representativa del Mercado (TRM) de Colombia opera en COP 3,590 por dólar, un 11.3% más apreciada que en junio de 2025 (COP 4,050). El Banco de la República mantiene su tasa de interés en 9.25% mientras la inflación anual cede a 4.8% en mayo. Los flujos de remesas (+18% interanual) y el petróleo caro (WTI US$ 95) sostienen la apreciación.',
    contenido: `La Tasa Representativa del Mercado (TRM) de Colombia cotizó en COP 3,590 por dólar al 3 de junio de 2026, con una apreciación del 11.3% frente al mismo período de 2025 cuando la TRM estaba en COP 4,050. Colombia es la segunda moneda de América Latina con mayor apreciación frente al dólar en el año (detrás del peso peruano), beneficiada por tres factores: el debilitamiento global del DXY, el petróleo Brent en US$ 98/barril (principal exportación del país) y el crecimiento de las remesas.

El Banco de la República de Colombia (Banrep) mantuvo su tasa de referencia en 9.25% en la reunión del 30 de mayo, en una decisión dividida (5 votos a favor de mantener, 2 por recortar 25 pbs). La junta directiva señaló que "la convergencia de la inflación de servicios —que persiste en 6.2%— hacia la meta del 3% es condición necesaria para reanudar el ciclo de recortes". La inflación general cedió a 4.8% en mayo (desde 5.4% en abril), acelerando la desinflación.

El FMI revisó al alza el crecimiento de Colombia para 2026 a 3.4% (desde 3.1%), destacando la resiliencia del consumo doméstico y la inversión privada en el sector minero-energético. Ecopetrol mantiene su plan de inversión de US$ 6,500 millones para 2026, un 12% más que en 2025, enfocado en perforación de yacimientos offshore en el Caribe y el desarrollo de la cuenca del Putumayo.

Las remesas —segunda mayor fuente de divisas del país después del petróleo— crecieron 18% interanual en Q1 2026, alcanzando US$ 2,800 millones trimestrales. La comunidad colombiana en EE.UU., España y Canadá aprovecha el dólar alto para enviar más dinero a sus familias, generando un flujo estable de divisas que apoya la apreciación del peso.`,
    analisis: `Un peso colombiano 11% más fuerte en un año con Banrep todavía con tasa en 9.25% crea una oportunidad de carry trade atractiva para inversores externos: tasas altas + moneda apreciada = retorno total positivo en dólares. Esto atrae flujos de portafolio que amplían la apreciación, creando un ciclo de retroalimentación positiva mientras los fundamentos aguanten.

Para empresas peruanas con operaciones en Colombia o que compiten con proveedores colombianos, la apreciación del peso encarece los costos de producción colombianos medidos en dólares, reduciendo ligeramente la ventaja competitiva de precio de las exportaciones colombianas.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/19675635/pexels-photo-19675635.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'i015',
    titulo: 'Chile: peso se aprecia a CLP 845/USD — cobre en US$ 5.15/lb y DXY débil consolidan la fortaleza; BCCh mantiene tasa en 3.75% con inflación en 2.6%',
    descripcion: 'El peso chileno cotiza en CLP 845 por dólar, dentro de la banda proyectada de 820-880 para 2026. La combinación de cobre a US$ 5.15/lb, DXY débil (98.76) e inflación controlada en 2.6% anual le da espacio al Banco Central de Chile para mantener la tasa en 3.75% por tercera reunión consecutiva. El PBI del Q1 2026 creció 3.8%.',
    contenido: `El peso chileno (CLP) cotizó en 845 pesos por dólar al 3 de junio de 2026, dentro del rango de 840-850 que ha mantenido durante la semana. La moneda acumula una apreciación del 6.2% frente al dólar en lo que va del año (desde CLP 900 a inicio de enero), apoyada por el cobre —principal exportación del país, que representa el 50% de los ingresos de divisas— que cotiza en US$ 5.15/lb en el LME.

El Banco Central de Chile (BCCh) mantuvo su tasa de política monetaria en 3.75% en la reunión del 27 de mayo, en línea con las expectativas del mercado. La inflación de mayo fue de 2.6% interanual, dentro del rango meta del 2-4% por quinto mes consecutivo. El BCCh señaló en su comunicado que "la convergencia de la inflación y la estabilidad de las expectativas permiten mantener la tasa actual por un período extendido", cerrando la puerta a nuevos recortes en el corto plazo (el ciclo de recortes bajó la tasa desde el 11.25% de 2023 hasta el 3.75% actual).

El desempeño económico del Q1 2026 fue sólido: el PBI creció 3.8% interanual, impulsado por la minería (+12.3%), los servicios empresariales (+5.4%) y el comercio (+4.8%). La construcción residencial sigue débil (-3.2%) por las elevadas tasas hipotecarias. CODELCO —la minera estatal— reportó producción de cobre de 372,000 toneladas en Q1, su mejor trimestre desde 2022, tras las inversiones en la División El Teniente.

Las exportaciones totales de Chile alcanzaron US$ 24,600 millones en Q1 2026 (+21.4%), con el cobre aportando US$ 11,200 millones. La balanza comercial acumuló un superávit de US$ 4,800 millones en los primeros cuatro meses, apoyando la fortaleza estructural del peso. Analistas de Scotiabank Chile y BCI proyectan que el CLP cerrará el año en 820-840.`,
    analisis: `Un peso chileno en CLP 845 con cobre en US$ 5.15/lb crea una situación de tipo de cambio real apreciado para las exportaciones no cobre (vino, fruta, salmón, software). Estos sectores están perdiendo competitividad de precio frente a competidores con monedas más débiles. El BCCh observa la situación pero no tiene mandato para intervenir cambiariamente; su herramienta es la tasa de política monetaria, que ya está en mínimos de ciclo.

Para Perú, Chile es el principal competidor en exportaciones de cobre, palta, uva y vino. La apreciación del peso chileno reduce la ventaja de precio de los exportadores chilenos en dólares, lo que puede abrir oportunidades para los exportadores peruanos en mercados como China, Europa y EE.UU.`,
    categoria: 'Internacional',
    fuente: 'Infobae',
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
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
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
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
    fecha: '2026-06-03T08:00:00.000Z',
    destacada: false,
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
    fecha: '2026-06-03T08:00:00.000Z',
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
