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
const HOY = '2026-06-10T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'm001',
    titulo: 'Segunda vuelta Peru: Sanchez 50.075% vs Keiko 49.925% con 97% de actas procesadas — dolar cae a S/ 3.393',
    descripcion: 'Con el 97.3% de actas procesadas, Jorge Sanchez mantiene 50.075% frente al 49.925% de Keiko Fujimori. El ajustado resultado dispara la incertidumbre y el dolar retrocede a S/ 3.393 ante mayor liquidez en soles.',
    contenido: `La segunda vuelta presidencial peruana del 8 de junio mantiene en vilo al mercado cambiario. Con el 97.3% de actas procesadas este martes 10 de junio, Jorge Sanchez (Avancemos Peru) acumula 50.075% frente al 49.925% de Keiko Fujimori (Fuerza Popular), una diferencia de apenas 0.15 puntos porcentuales equivalente a poco mas de 100,000 votos.

La ONPE reporta que quedan por escrutar 2.7% de actas correspondientes principalmente a circunscripciones de la selva norte y el extranjero. Ambos candidatos han solicitado verificaciones en actas impugnadas, por lo que el resultado oficial podria demorarse 48 a 72 horas adicionales segun el JNE.

En el mercado cambiario, el dolar cede terreno ante el escenario de mayor claridad. El tipo de cambio interbancario opera en S/ 3.393, con el BCRP reportando compras de USD 280 millones para moderar la apreciacion del sol. Las reservas internacionales netas se mantienen en US$ 101,620 millones, nivel record.

Los operadores de mesa de cambio reportan spread compra-venta ajustado, con alta demanda de soles por parte de empresas que requieren cubrir obligaciones en moneda local ante la espera del resultado definitivo.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'DESTACADA',
    imagen: 'https://images.pexels.com/photos/29027606/pexels-photo-29027606.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'ONPE / BCRP',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm002',
    titulo: 'IPC mayo EE.UU. se publica hoy: consenso apunta a core CPI 2.7% — recorte Fed 17 junio en juego',
    descripcion: 'El mercado aguarda el dato de inflacion de mayo en EE.UU. a las 8:30 AM ET. Un resultado igual o inferior al consenso de 2.7% interanual en el indice core abriria la puerta a una baja de tasas en la reunion del FOMC del 17-18 de junio.',
    contenido: `El Departamento de Trabajo de EE.UU. publicara hoy a las 8:30 AM hora de Nueva York (10:30 AM Lima) el Indice de Precios al Consumidor (IPC) de mayo 2026. El consenso de mercado proyecta una variacion interanual del 2.7% para el indice core (excluye alimentos y energia), igual al dato de abril, y 3.1% para el indice general.

La publicacion tiene especial relevancia porque el Comite Federal de Mercado Abierto (FOMC) sesiona el 17 y 18 de junio. Segun la herramienta FedWatch de CME Group, los futuros de fondos federales asignan una probabilidad del 68% a un recorte de 25 puntos basicos si el IPC core viene en 2.7% o menor.

Un dato superior al consenso (2.8% o mas) reducira significativamente las expectativas de recorte inmediato y fortalecera al dolar. Un dato inferior impulsara activos de riesgo, debilitara el billete verde y beneficiara al sol peruano y otras monedas emergentes.

En Peru, el tipo de cambio opera con cautela en S/ 3.393 a la espera del dato. Fuentes de mesas de cambio en Lima esperan volatilidad de +/- 3 centimos en el tipo de cambio local segun el resultado del IPC.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'DESTACADA',
    imagen: 'https://images.pexels.com/photos/12504957/pexels-photo-12504957.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BLS / CME FedWatch',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm003',
    titulo: 'BCRP sesiona manana 11 junio: 73% del mercado espera tasa estable en 4.25% — sol en S/ 3.393 y reservas en maximo historico',
    descripcion: 'El directorio del Banco Central de Reserva del Peru se reunira manana jueves para decidir sobre la tasa de referencia. El 73% de analistas espera que se mantenga en 4.25% ante la incertidumbre politica post-electoral y la inflacion en 2.8% interanual en mayo.',
    contenido: `El directorio del Banco Central de Reserva del Peru (BCRP) celebrara manana jueves 11 de junio su reunion mensual de politica monetaria. La tasa de referencia actual es 4.25%, nivel donde se ha mantenido desde febrero de 2026.

Una encuesta de Reuters entre 18 analistas locales e internacionales revela que el 73% espera que el BCRP mantenga la tasa en 4.25%, mientras el 22% proyecta un recorte de 25 puntos basicos a 4.00%. El 5% restante anticipa un recorte mayor.

Los argumentos para mantener la tasa incluyen: inflacion de mayo en 2.8% interanual (por encima del rango meta 1-3% del objetivo puntual de 2%), la incertidumbre del resultado electoral y el tipo de cambio que, aunque apreciado, aun no consolida un nivel definitivo.

El sol peruano opera hoy en S/ 3.393 interbancario, su nivel mas bajo en 20 meses. Las reservas internacionales netas alcanzaron un record de US$ 101,620 millones, equivalente a 20.3 meses de importaciones. Este colchon le da al BCRP amplio margen de maniobra cambiaria independientemente de la decision de tasas.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'DESTACADA',
    imagen: 'https://images.pexels.com/photos/19985009/pexels-photo-19985009.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BCRP / Reuters',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm004',
    titulo: 'Sol peruano se aprecia a S/ 3.393 post-ONPE: BCRP compra USD 280M para moderar apreciacion',
    descripcion: 'El tipo de cambio PEN/USD cede a S/ 3.393 en operaciones interbancarias del martes, impulsado por la reduccion de incertidumbre electoral. El Banco Central intervino con compras de USD 280 millones para evitar una apreciacion excesiva del sol.',
    contenido: `El tipo de cambio interbancario PEN/USD opera este martes en S/ 3.393, acumulando una apreciacion de 1.8% en la semana ante la reduccion de incertidumbre electoral. El BCRP ha intervenido con compras de USD 280 millones en la sesion de hoy para moderar la velocidad de apreciacion del sol.

En el mercado paralelo (casas de cambio y exchange houses como QoriCash), el dolar cotiza entre S/ 3.385 y S/ 3.400 segun la modalidad de operacion. La demanda corporativa de dolares para cobertura ha disminuido notablemente respecto a la semana previa, cuando el tipo de cambio llego a tocar S/ 3.45.

Los flujos de inversion extranjera directa hacia Peru se han reactivado en las ultimas sesiones. Fuentes del sector financiero reportan consultas de fondos de inversion regionales interesados en bonos soberanos peruanos denominados en soles, lo que genera presion compradora sobre la moneda local.

Para el resto de la semana, el mercado estara atento al resultado final de la ONPE (esperado para el miercoles), la decision de tasas del BCRP (jueves) y el dato de IPC de EE.UU. que se publica hoy. Estos tres catalizadores podrian generar movimientos adicionales de +/- 5 centimos en el tipo de cambio.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BCRP / Bloomberg',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm005',
    titulo: 'Dolar cae a minimo de 16 meses: DXY en 97.6 — euro en 1.1425 y yen en 141.2 por dolar',
    descripcion: 'El indice dolar (DXY) retrocede a 97.6, su nivel mas bajo desde febrero de 2025, presionado por expectativas de recorte Fed y datos mixtos de empleo. El euro avanza a USD 1.1425 y el yen se aprecia a 141.2 por dolar.',
    contenido: `El indice dolar estadounidense (DXY), que mide el valor del billete verde frente a una canasta de seis divisas principales, cayo a 97.6 puntos en las primeras operaciones del martes, su nivel mas bajo desde febrero de 2025. La debilidad del dolar responde a la confluencia de varios factores: las crecientes expectativas de recorte de tasas Fed para junio, el solido dato de PMI de servicios de la eurozona publicado ayer y la reduccion de flujos de refugio hacia el dolar.

El euro avanza a USD 1.1425, nivel no visto desde abril de 2022, apoyado en el diferencial de tasas que se reduce a medida que el mercado precio recortes Fed. El Banco Central Europeo mantiene su tasa en 3.40% y no senala prisa por nuevos recortes, lo que favorece al euro frente al dolar.

El yen japones se aprecia a 141.2 por dolar, beneficiandose de la debilidad generalizada del billete verde y de las expectativas de que el Banco de Japon pueda ajustar su politica en julio. La libra esterlina opera en USD 1.2850 y el franco suizo en 0.8920 por dolar.

Para las monedas latinoamericanas, la debilidad del DXY es una buena noticia. El real brasileno cotiza en 4.92 por dolar, el peso colombiano en 4,215 y el sol peruano en 3.393, todos en niveles de fortaleza frente al billete verde.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/29611783/pexels-photo-29611783.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'Bloomberg / Reuters',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm006',
    titulo: 'Oro alcanza record de USD 3,720 por onza: ETFs de oro suman USD 4,200M en 5 dias — Goldman eleva target a USD 4,000 para Q4',
    descripcion: 'El metal precioso toco un nuevo maximo historico de USD 3,720 por onza troy este martes, impulsado por la debilidad del dolar y el aumento de posiciones en ETFs. Goldman Sachs elevo su proyeccion a USD 4,000 para el cuarto trimestre de 2026.',
    contenido: `El oro al contado alcanzo un nuevo maximo historico de USD 3,720 por onza troy en las operaciones del martes en Londres, superando el record anterior de USD 3,695 establecido el viernes pasado. El metal precioso acumula una ganancia del 38% en lo que va del 2026, consolidandose como el activo de mejor desempeno del ano.

Los fondos cotizados en bolsa (ETFs) respaldados por oro han registrado entradas netas de USD 4,200 millones en los ultimos cinco dias de operaciones, segun datos de Bloomberg Intelligence. Los mayores flujos provienen de inversores institucionales en EE.UU. y Europa que buscan cobertura ante la incertidumbre sobre la politica monetaria de la Fed.

Goldman Sachs publico hoy una nota a clientes en la que eleva su proyeccion para el precio del oro al cierre del cuarto trimestre de 2026 a USD 4,000 por onza, desde USD 3,700 anteriormente. El banco de inversion cita como principales catalizadores la continua demanda de bancos centrales (China, India y Polonia lideran las compras), la debilidad estructural del dolar y los crecientes riesgos geopoliticos.

En Peru, el sector minero celebra los precios record. Las empresas productoras de oro como Newmont (Yanacocha) y Hochschild Mining reportan incrementos significativos en sus ingresos proyectados para el segundo semestre.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/8442325/pexels-photo-8442325.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'Bloomberg / Goldman Sachs',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm007',
    titulo: 'Petroleo Brent sube a USD 96 ante tension en Medio Oriente y recortes OPEP+: WTI en USD 93.55',
    descripcion: 'El crudo Brent avanza a USD 96 por barril, maximo de tres meses, impulsado por la escalada de tension en el estrecho de Ormuz y la confirmacion de recortes adicionales de produccion por parte de Arabia Saudi y Rusia desde julio.',
    contenido: `El petroleo Brent de referencia mundial avanza a USD 96.15 por barril en el mercado ICE de Londres, su nivel mas alto desde marzo de 2026, mientras el WTI estadounidense cotiza en USD 93.55 en el New York Mercantile Exchange. El diferencial Brent-WTI se amplifica a USD 2.60 por barril.

La tension en el estrecho de Ormuz, por donde transita el 20% del petroleo mundial, se ha intensificado tras el incidente del fin de semana con buques iranies. Aunque no se reportan danos a infraestructura critica, los operadores incorporan una prima de riesgo geopolitico adicional de USD 3 a USD 5 por barril.

Arabia Saudi y Rusia confirmaron el sabado que mantendran sus recortes voluntarios adicionales de produccion de 500,000 barriles diarios cada uno durante julio y agosto, contrariamente a lo que el mercado esperaba. Esta decision redujo las expectativas de mayor oferta en el segundo semestre y es el principal catalizador del alza de precios.

En Peru, la Gerencia de Regulacion de Tarifas del OSINERGMIN monitorea la situacion. Si el Brent se mantiene por encima de USD 95, podrian activarse los mecanismos del Fondo de Estabilizacion de Precios de los Combustibles para moderar el impacto en los precios al consumidor final.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/10407689/pexels-photo-10407689.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'ICE / Bloomberg',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm008',
    titulo: 'Cobre LME en USD 5.28 por libra: inventarios en minimo de 5 anos y exportaciones peruanas proyectadas en USD 16,200M en 2026',
    descripcion: 'El cobre en el London Metal Exchange avanza a USD 5.28 por libra ante la caida de inventarios a niveles no vistos desde 2021. Peru, segundo mayor productor mundial, proyecta exportaciones cupreras de USD 16,200 millones en 2026.',
    contenido: `El cobre a tres meses en el London Metal Exchange (LME) avanza a USD 5.28 por libra (USD 11,640 por tonelada metrica), su nivel mas alto en 14 meses, sustentado en la combinacion de inventarios minimos historicos y solida demanda industrial de China y Europa.

Los inventarios de cobre en los almacenes certificados del LME cayeron a 98,450 toneladas metricas, el nivel mas bajo desde junio de 2021. La reduccion de stocks refleja la alta demanda de la industria de vehiculos electricos, cables de transmision de energia y equipos de inteligencia artificial (los centros de datos requieren grandes cantidades de cobre para sus sistemas de refrigeracion y conectividad).

En Peru, el Ministerio de Energia y Minas proyecta que las exportaciones de cobre alcanzaran USD 16,200 millones en 2026, un incremento del 18% frente a los USD 13,700 millones de 2025. Las minas de Antamina, Cerro Verde, Las Bambas y Toromocho operan a plena capacidad, y el proyecto Quellaveco de Anglo American reporto un record de produccion trimestral en el primer trimestre.

Los mayores ingresos por exportaciones de cobre contribuyen positivamente a la balanza comercial peruana, generando mayor oferta de dolares en el mercado local y ejerciendo presion hacia la apreciacion del sol.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/5505961/pexels-photo-5505961.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'LME / MINEM',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm009',
    titulo: 'Bitcoin supera USD 107,200: ETF de bitcoin suma USD 380M en un dia — resistencia clave en USD 110,000',
    descripcion: 'El bitcoin rompe la resistencia de USD 105,000 y cotiza en USD 107,200, impulsado por entradas record en ETFs de EE.UU. Los analistas tecnicos senalan USD 110,000 como el proximo nivel de resistencia critico.',
    contenido: `El bitcoin (BTC) cotiza en USD 107,200 en los mercados de criptomonedas este martes, tras romper con fuerza la resistencia de USD 105,000 que habia contenido el precio durante las ultimas dos semanas. La criptomoneda acumula una ganancia del 7.3% en los ultimos cinco dias y del 185% en lo que va del 2026.

Los ETFs de bitcoin al contado que cotizan en EE.UU. registraron entradas netas combinadas de USD 380 millones el lunes, el mayor flujo diario en tres semanas. El iShares Bitcoin Trust (IBIT) de BlackRock concentro USD 215 millones de estas entradas, consolidando su posicion como el mayor ETF de criptoactivos del mundo con activos bajo gestion de USD 87,000 millones.

Desde el punto de vista tecnico, los analistas identifican la zona de USD 110,000 como la resistencia critica a superar para confirmar un nuevo ciclo alcista. Un cierre semanal por encima de ese nivel abriria el camino hacia los USD 120,000, segun los modelos de Fibonacci aplicados al ciclo actual.

El ethereum (ETH) acompana el alza con una ganancia del 5.1%, cotizando en USD 3,950. Los altcoins de mayor capitalizacion (BNB, Solana, XRP) tambien registran ganancias de entre 4% y 8% en las ultimas 24 horas.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/8919573/pexels-photo-8919573.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'CoinGecko / Bloomberg',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm010',
    titulo: 'Argentina: BCRA sube tasa de emergencia a 45% ante brote inflacionario — IPC mayo en 4.1% mensual',
    descripcion: 'El Banco Central de la Republica Argentina elevo su tasa de politica monetaria a 45% en una reunion extraordinaria convocada de urgencia, tras conocerse que el IPC de mayo subio 4.1% en el mes, muy por encima del 2.8% esperado.',
    contenido: `El Banco Central de la Republica Argentina (BCRA) convoco de urgencia una reunion extraordinaria de su directorio y acordo elevar la tasa de politica monetaria en 500 puntos basicos, desde el 40% hasta el 45% anual, en respuesta al dato de inflacion de mayo que mostro un preocupante rebote.

El INDEC informo que el Indice de Precios al Consumidor (IPC) de mayo 2026 registro una variacion mensual del 4.1%, muy por encima del consenso del mercado (2.8%) y del 2.4% registrado en abril. En terminos interanuales, la inflacion acumula 58.7%, alejandose del objetivo del gobierno de cerrar el 2026 por debajo del 40%.

El rebrote inflacionario se atribuye principalmente al ajuste de tarifas de servicios publicos implementado en mayo (electricidad +35%, gas +28%), al deslizamiento del tipo de cambio oficial y al aumento de precios en alimentos y bebidas. El gobierno de Javier Milei enfrenta su mayor desafio economico desde que inicio el programa de estabilizacion.

El peso argentino cerro en 1,285 por dolar en el mercado oficial y en 1,320 en el mercado paralelo (MEP). Los bonos soberanos argentinos en dolares (GD30, AL30) cedieron entre 1.5% y 2.8% ante el deterioro del escenario macro. Para Peru, el contagio es limitado dado el solido diferencial de fundamentals.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/16228260/pexels-photo-16228260.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'BCRA / INDEC',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm011',
    titulo: 'Colombia: inflacion de mayo cae a 4.6% — minimo desde 2021 — BanRep evalua recorte en agosto; peso en 4,215',
    descripcion: 'El IPC de mayo en Colombia desacelero a 4.6% interanual, su nivel mas bajo desde octubre de 2021, acercandose al techo del rango meta del 3%. El Banco de la Republica evalua un recorte de tasas en su reunion de agosto desde el actual 9.75%.',
    contenido: `El DANE informo que la inflacion al consumidor en Colombia registro una variacion interanual del 4.6% en mayo de 2026, por debajo del 5.1% de abril y del consenso del mercado (4.9%). Este es el dato mas bajo desde octubre de 2021 y sena una desaceleracion continua que acerca al pais al techo del rango meta del Banco de la Republica (2%-4%).

La desaceleracion inflacionaria en Colombia es generalizada: la inflacion de alimentos bajo a 2.8% (desde 3.5% en abril), la inflacion de servicios a 6.2% (desde 7.1%) y la inflacion sin alimentos ni regulados a 5.1% (desde 5.8%). Solo los precios regulados (combustibles, utilities) permanecen elevados con un 8.3% interanual.

El Banco de la Republica mantiene su tasa de intervencion en 9.75%, pero el dato de mayo abre la puerta a un recorte en la reunion de agosto. Fuentes cercanas al banco central colombiano senalan que si la inflacion continua descendiendo y se acerca al 4.0% en junio, podria materializarse una baja de 25 puntos basicos.

El peso colombiano (COP) opera en 4,215 por dolar, apreciandose 0.4% en la sesion del martes ante el positivo dato de inflacion y la debilidad generalizada del dolar en los mercados internacionales.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/19675635/pexels-photo-19675635.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'DANE / BanRep',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm012',
    titulo: 'Chile: S&P eleva perspectiva soberana a positiva — BCCh mantiene 5.00% — peso chileno en 875 por dolar',
    descripcion: "Standard & Poor's mejoro la perspectiva de la calificacion soberana de Chile de estable a positiva, citando la solida posicion fiscal y las reformas estructurales. El Banco Central de Chile mantiene su tasa en 5.00% y el CLP cotiza en 875 por dolar.",
    contenido: `Standard & Poor's Global Ratings anuncio ayer la mejora de la perspectiva de la calificacion soberana de Chile de estable a positiva, manteniendo el rating en A-. La agencia cita como factores positivos la reduccion del deficit fiscal a -1.8% del PBI en 2025, el solido marco institucional y las reformas del mercado de capitales impulsadas por el gobierno del presidente Gabriel Boric.

S&P destaca que si Chile mantiene la trayectoria de consolidacion fiscal y el deficit se reduce por debajo del -1.5% del PBI en 2026, podria materializarse una mejora del rating a A en los proximos 12 a 24 meses. Esta perspectiva positiva genera mayor interes de inversores internacionales en bonos soberanos chilenos.

El Banco Central de Chile (BCCh) mantiene su tasa de politica monetaria en 5.00%, nivel donde la ha sostenido desde febrero. El comunicado de su ultima reunion sena que la tasa permanecera en este nivel durante el segundo trimestre, con posibilidad de un recorte adicional en el tercer trimestre si la inflacion continua convergiendo hacia el 3%.

El peso chileno (CLP) se aprecia a 875 por dolar, su nivel mas bajo desde agosto de 2024, beneficiandose tanto de la mejora de perspectiva crediticia como del avance del precio del cobre (del que Chile es el mayor productor mundial) y la debilidad generalizada del dolar en los mercados internacionales.`,
    fecha: HOY,
    categoria: 'Internacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/17403824/pexels-photo-17403824.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: "S&P / BCCh",
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm013',
    titulo: 'Agroexportaciones peruanas suman USD 3,200M en enero-mayo: arandanos +34% y cafe +58% impulsan record semestral',
    descripcion: 'La Asociacion de Exportadores (ADEX) reporto que las exportaciones agroindustriales de Peru acumularon USD 3,200 millones entre enero y mayo de 2026, un avance de 17.4% frente al mismo periodo de 2025, lideradas por arandanos y cafe.',
    contenido: `La Asociacion de Exportadores (ADEX) difundio hoy su reporte mensual de comercio exterior agroindustrial, revelando que las exportaciones del sector sumaron USD 3,200 millones en el acumulado enero-mayo 2026, un incremento del 17.4% respecto a los USD 2,726 millones del mismo periodo de 2025.

Los productos estrella del periodo son los arandanos (USD 680 millones, +34.2%), el cafe (USD 420 millones, +57.9%), las uvas de mesa (USD 310 millones, +12.8%) y los paltos (USD 285 millones, +8.5%). El dinamismo del cafe responde al record de precios internacionales (el arabica cotiza en USD 3.85 por libra en Nueva York) y a la ampliacion de areas cultivadas en Cajamarca y San Martin.

ADEX proyecta que las agroexportaciones totales del 2026 podrian superar los USD 8,500 millones, lo que representaria un nuevo maximo historico. Los mercados de destino mas dinamicos son EE.UU. (34% del total), Union Europea (28%) y China (18%), donde la demanda de productos frescos premium peruanos continua en expansion.

El crecimiento de las agroexportaciones tiene un impacto positivo directo en el mercado cambiario, generando mayor oferta de dolares y contribuyendo a la fortaleza del sol. Segun el BCRP, el agro fue responsable del 12% de la oferta de dolares en el mercado formal durante mayo.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/849683/pexels-photo-849683.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'ADEX / BCRP',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm014',
    titulo: 'MEF: ingresos tributarios crecen 12.4% en mayo — deficit fiscal se reduce a -2.1% del PBI',
    descripcion: 'El Ministerio de Economia y Finanzas reporto que la recaudacion tributaria de mayo aumento 12.4% en terminos reales respecto a mayo 2025, impulsada por el IGV e IR de tercera categoria. El deficit fiscal acumulado se comprime a -2.1% del PBI.',
    contenido: `El Ministerio de Economia y Finanzas (MEF) publico hoy el reporte de recaudacion tributaria de mayo 2026, mostrando un crecimiento real del 12.4% respecto a mayo 2025, sustancialmente por encima de lo esperado (8.5%). Los ingresos tributarios del mes sumaron S/ 14,850 millones (USD 4,375 millones al tipo de cambio actual).

Los principales motores del crecimiento son el Impuesto General a las Ventas (IGV) interno, que aumento 15.2% en terminos reales ante el solido desempeno del consumo privado, y el Impuesto a la Renta de tercera categoria (empresas), que subio 18.7% impulsado por los mayores precios de exportacion de minerales y agroexportaciones.

Con la solidez de la recaudacion de mayo, el deficit fiscal acumulado en los primeros cinco meses del 2026 se reduce a -2.1% del PBI, dentro del objetivo del gobierno de no superar el -2.5% para el ano. Esta mejora fiscal, en un contexto de transicion politica post-electoral, es positivamente valorada por los mercados financieros.

Los mejores fundamentos fiscales fortalecen la posicion del nuevo sol en los mercados internacionales y reducen la prima de riesgo pais. El EMBI+ Peru cayo a 115 puntos basicos, el nivel mas bajo desde enero de 2022, reflejando la confianza de los inversores en los solidos fundamentals de la economia peruana.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/14020705/pexels-photo-14020705.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'MEF / SUNAT',
    autor: 'Redaccion QoriCash',
  },
  {
    id: 'm015',
    titulo: 'Analisis PEN/USD semana 10-13 junio: tres catalizadores en 48 horas definiran el tipo de cambio de la quincena',
    descripcion: 'IPC EE.UU. hoy, resultado ONPE manana y decision BCRP el jueves configuran la semana de mayor densidad de noticias para el sol en 2026. El rango tecnico operativo para la semana es S/ 3.37 — S/ 3.42.',
    contenido: `La semana del 10 al 13 de junio se perfila como la de mayor densidad informativa para el tipo de cambio PEN/USD en lo que va del 2026. Tres catalizadores de primer orden se concentran en 48 horas: el IPC de mayo en EE.UU. hoy martes, el resultado final de la ONPE manana miercoles y la decision de tasas del BCRP el jueves.

**Escenario base (probabilidad 55%): sol entre S/ 3.37 y S/ 3.40**
IPC EE.UU. en linea con el consenso (2.7% core), ONPE confirma victoria de Sanchez, BCRP mantiene 4.25%. En este escenario, el sol se aprecia moderadamente hacia S/ 3.38 y el BCRP interviene comprando dolares para evitar una caida mayor. Para las casas de cambio, el spread operativo se estrecha y los volumenes de transaccion aumentan.

**Escenario alcista para el dolar (probabilidad 25%): S/ 3.40 — S/ 3.45**
IPC EE.UU. sorprende al alza (2.9%+), resultado ONPE impugnado sin ganador claro y/o BCRP recorta tasas de sorpresa. El dolar recupera terreno y el sol cede. Operadores de cambio deben considerar este escenario para gestionar inventarios.

**Escenario bajista para el dolar (probabilidad 20%): S/ 3.34 — S/ 3.38**
IPC EE.UU. muy por debajo del consenso (2.5% o menos), victoria Sanchez confirmada rapido y expectativas de estabilidad politica, BCRP mantiene tasa. Apreciacion acelerada del sol que podria generar intervencion masiva del BCRP.

Para empresas con exposicion en dolares, la recomendacion es gestionar activamente las coberturas y aprovechar la volatilidad para optimizar los tipos de cambio de sus operaciones de cambio durante la semana.`,
    fecha: HOY,
    categoria: 'Nacional',
    tipo: 'NORMAL',
    imagen: 'https://images.pexels.com/photos/31650949/pexels-photo-31650949.jpeg?auto=compress&cs=tinysrgb&w=800',
    fuente: 'Analisis QoriCash',
    autor: 'Redaccion QoriCash',
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
