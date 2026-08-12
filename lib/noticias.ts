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
const HOY = '2026-08-12T08:00:00.000Z';

const FALLBACK_NOTICIAS: Noticia[] = [
  {
    id: 'h001',
    titulo: 'IPC de julio en EE.UU. resulta alineado: el dólar retrocede y los mercados apuestan a pausa de la Fed en septiembre',
    descripcion: 'La inflación anual de EE.UU. bajó a 3.4% en julio, en línea con el consenso. El dólar cedió y los operadores elevan al 74% la probabilidad de una pausa de la Fed en septiembre.',
    contenido: `El Índice de Precios al Consumidor (IPC) de Estados Unidos de julio de 2026 fue publicado este miércoles 12 de agosto y mostró una inflación anual de 3.4%, exactamente en línea con el consenso de analistas. Los componentes de alimentos y combustibles mostraron una desaceleración significativa, lo que evitó cualquier sorpresa al alza. La vivienda continuó siendo el componente más resistente, aunque también mostró señales de moderación gradual. El IPC mensual creció apenas 0.2%, dentro de lo proyectado.

La reacción del mercado fue inmediata y ordenada. El Índice del Dólar (DXY) cayó por debajo del soporte de 100 puntos, extendiendo la tendencia bajista que viene desarrollando desde junio. Los futuros del bono del Tesoro a 2 años subieron —reduciendo su rendimiento—, interpretados como señal de que el mercado reduce su expectativa de nuevas subidas de tasas. Las acciones globales ampliaron ganancias y el S&P 500 superó los 7,750 puntos durante la jornada. El oro avanzó 0.2%, respaldado por el dólar más débil, aunque la ausencia de grandes sorpresas limitó el alza del activo refugio.

Para la Reserva Federal (Fed), un dato de inflación alineado con las expectativas es la noticia ideal en este momento: confirma que la política monetaria restrictiva está funcionando sin provocar una desaceleración brusca. Los operadores de futuros del Fed Funds Rate ahora asignan una probabilidad del 74% a que la Fed mantenga las tasas en la reunión del 17 de septiembre, el nivel más alto de certeza sobre una pausa que se ha visto en los últimos tres meses. El 26% restante apuesta por un recorte de 25 puntos básicos; la probabilidad de subida cayó virtualmente a cero.`,
    analisis: `Un dato de CPI que reduce las expectativas de subida de tasas en EE.UU. es directamente favorable para el sol peruano. Cuando la Fed modera su postura, el dólar pierde fuerza global y reduce la presión sobre las monedas emergentes. El DXY por debajo de 100 puede traducirse en un USD/PEN más cerca de S/ 3.33–3.35 en los próximos días si la tendencia se confirma.

Para importadores que necesiten dólares en el corto plazo, el rango actual S/ 3.36–3.37 es históricamente favorable. Para exportadores que venden dólares, la tendencia bajista del billete verde sugiere que esperar podría traer tipos de cambio aún más bajos. La reunión del BCRP mañana será el próximo catalizador local para el PEN.`,
    categoria: 'Internacional',
    fuente: 'Bloomberg',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/6534073/pexels-photo-6534073.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h002',
    titulo: 'Sol peruano se consolida en S/ 3.3650 mientras el dólar global cede terreno: BCRP decide mañana sobre la tasa de referencia',
    descripcion: 'El USD/PEN cotiza en S/ 3.3650 este miércoles, acumulando una apreciación del 0.59% en la semana. El dólar global cede ante el IPC de julio y el mercado espera la decisión del BCRP el jueves 13 de agosto.',
    contenido: `El tipo de cambio PEN/USD opera en S/ 3.3650 durante la sesión del miércoles 12 de agosto en el mercado interbancario de Lima, registrando una apreciación del 0.59% frente al cierre de la semana pasada (S/ 3.3850). El movimiento refleja en gran medida la debilidad global del dólar tras la publicación del IPC de julio en Estados Unidos, que resultó en línea con las expectativas y redujo las apuestas sobre nuevas subidas de tasas de la Fed. El DXY opera en torno a los 99.63 puntos, su nivel más bajo desde febrero de 2026.

La fortaleza del sol también tiene sustento en los fundamentales locales: el cobre se mantiene en US$ 4.72/libra, generando un flujo predecible de dólares hacia el mercado local. Las empresas mineras mantienen liquidaciones programadas de divisas para cubrir planillas y compromisos en soles, lo que actúa como ancla natural del tipo de cambio. El Banco Central de Reserva del Perú (BCRP) no ha intervenido en el mercado cambiario durante la semana, señal de que el movimiento del sol es ordenado y está respaldado por flujos reales de la economía.

El mercado cambiario local está en modo de espera ante la reunión del BCRP de mañana, jueves 13 de agosto. La decisión sobre la tasa de referencia —actualmente en 4.25%— será el catalizador más importante para el PEN en el corto plazo. Si el BCRP sorprende con un tono hawkish (señalando que no recortará pronto), el sol podría fortalecerse hacia S/ 3.35. Si abre la puerta a un recorte antes de fin de año, el dólar podría recuperar algo de terreno hacia S/ 3.38.`,
    analisis: `El sol en S/ 3.3650 es el nivel más favorable de las últimas semanas para importadores que necesitan dólares. La combinación de dólar global débil (DXY bajo 100) más sólida oferta exportadora más BCRP sin intervenir configura el entorno más propicio para el PEN en lo que va de 2026.

Para empresas que compran dólares de forma regular, el rango actual S/ 3.360–3.370 representa una ventana de compra eficiente. Para exportadores, la decisión del BCRP mañana es el evento a monitorear antes de liquidar divisas: un sesgo hawkish del banco central podría apreciar aún más el sol y ofrecer mejores tasas de venta de dólares.`,
    categoria: 'Nacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: true,
    imagen: 'https://images.pexels.com/photos/16640810/pexels-photo-16640810.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h003',
    titulo: 'Reunión del BCRP mañana, 13 de agosto: el mercado espera tasa sin cambios en 4.25% ante el riesgo inflacionario de Ormuz',
    descripcion: 'El directorio del BCRP sesionará este jueves con el reto de equilibrar una inflación local bajo control contra el riesgo de alza en combustibles por la crisis del Estrecho de Ormuz. El 87% de los analistas proyecta una pausa.',
    contenido: `El directorio del Banco Central de Reserva del Perú (BCRP) se reunirá este jueves 13 de agosto para decidir si mantiene, sube o baja la tasa de referencia actual de 4.25%. La reunión llega en un momento delicado: la inflación local se encuentra dentro del rango meta (2.4% anual en julio), lo que en condiciones normales abriría la puerta a un recorte. Sin embargo, la escalada de tensiones en el Estrecho de Ormuz ha empujado el precio del petróleo Brent por encima de US$ 89/barril, lo que representa un riesgo inflacionario de segunda ronda para los meses de agosto y septiembre.

El consenso de los analistas del sistema financiero peruano apunta firmemente a que el directorio decidirá mantener la tasa sin cambios. En la encuesta semanal del BCRP a instituciones financieras, publicada el lunes, el 87% de los participantes proyectó una pausa en agosto, con solo un 13% esperando un recorte de 25 puntos básicos. Ningún participante anticipó una subida. El argumento central para mantener: la crisis de Ormuz introduce una incertidumbre inflacionaria que el BCRP prefiere esperar a ver resuelta antes de relajar la política monetaria.

El comunicado posterior a la reunión —que se espera entre las 6:00 y 7:00 pm hora de Lima— será monitoreado de cerca, especialmente en lo que respecta al tono sobre el momento del primer recorte. Los mercados esperan que la primera baja ocurra en la reunión de noviembre o diciembre de 2026, siempre que la inflación de agosto y septiembre confirme la senda descendente. Si el BCRP hace referencia explícita a la crisis de Ormuz como factor de riesgo persistente, el mercado podría retrasar sus expectativas de recorte hacia el primer trimestre de 2027.`,
    analisis: `Una pausa del BCRP es el escenario base y no debería generar volatilidad en el tipo de cambio. El diferencial de tasas Perú (4.25%) vs. Fed (5.25–5.50%) se mantiene en niveles que hacen al sol relativamente atractivo frente al dólar en términos de carry trade. Lo que sí movería el PEN es el tono del comunicado: un BCRP explícitamente preocupado por la inflación importada del petróleo daría soporte al sol.

Para tomadores de decisiones empresariales con exposición cambiaria, la recomendación es esperar el comunicado del jueves antes de realizar operaciones de gran tamaño en dólares. La volatilidad intradía tras el anuncio puede ser una ventana de oportunidad para comprar o vender divisas en condiciones más favorables que el promedio del día.`,
    categoria: 'Nacional',
    fuente: 'Gestión',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/22484275/pexels-photo-22484275.jpeg?auto=compress&cs=tinysrgb&w=1200',
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

Los mercados reaccionaron con cautela al conocerse los detalles del incidente. El oro —activo refugio en escenarios de geopolítica extrema— subió 0.4% hasta US$ 4,395/oz. El índice de volatilidad implícita del petróleo WTI subió 8 puntos, reflejando la preocupación de los operadores sobre la posibilidad de una escalada militar que corte el suministro del Golfo Pérsico. El dólar, por su parte, mostró presiones mixtas: la debilidad por el IPC compensó parcialmente el alza por la demanda de refugio.`,
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
    contenido: `El Índice del Dólar (DXY), que mide la fortaleza del billete verde frente a una canasta de seis divisas principales —euro, yen, libra esterlina, dólar canadiense, corona sueca y franco suizo—, opera en torno a los 99.63 puntos en la sesión del miércoles 12 de agosto, su nivel más bajo desde febrero de 2026. El análisis técnico identifica una formación de bandera bajista clásica: el DXY hizo un techo en 103.4 puntos el 28 de julio, luego de lo cual viene consolidando en un canal de leve corrección alcista que en el análisis chartista es considerado una pausa antes de continuar la tendencia bajista de fondo.

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
    titulo: 'Bolsas globales consolidan ganancias tras el IPC de julio: el S&P 500 supera los 7,750 puntos y el Nasdaq avanza 0.8%',
    descripcion: 'Las principales bolsas de EE.UU. y Europa ampliaron sus ganancias el miércoles luego de que el dato de inflación de julio resultara alineado con expectativas, consolidando el escenario de pausa de la Fed en septiembre.',
    contenido: `Las principales bolsas del mundo cerraron en positivo el miércoles 12 de agosto, extendiendo las ganancias iniciadas en la sesión del martes. El S&P 500 superó los 7,753 puntos, su nivel más alto en cuatro semanas, mientras que el Nasdaq Composite avanzó un 0.8% y el Dow Jones subió 0.4%. La reacción positiva de los mercados respondió al dato del IPC de julio en EE.UU., que fue exactamente igual al consenso y eliminó el escenario adverso de una inflación que obligara a la Fed a subir tasas de nuevo. Las acciones de los sectores tecnológico, consumo discrecional e inmobiliario lideraron las alzas dentro del S&P 500.

En Europa, el Euro Stoxx 50 subió 0.7% y el FTSE 100 avanzó 0.5%, mientras que en Asia los mercados habían cerrado mixtos antes de conocerse el dato de inflación. El VIX —índice de volatilidad implícita del S&P 500, conocido como el "índice del miedo"— cayó a 15.3 puntos desde los 17.2 de la sesión anterior, señal de que los inversores redujeron la compra de coberturas ante el menor riesgo de un shock de tasas. El oro avanzó 0.2%, respaldado por el dólar más débil, aunque la ausencia de grandes sorpresas limitó el alza del metal precioso.

La temporada de resultados corporativos en EE.UU. del segundo trimestre de 2026 llega a su fase final con un balance positivo: el 78% de las empresas del S&P 500 que ya reportaron superaron las estimaciones de ganancias por acción, con un crecimiento promedio del 9.2% anual. Los sectores tecnológico y financiero lideraron los resultados. Este contexto de ganancias corporativas sólidas más inflación bajo control es el entorno óptimo para los mercados de renta variable, lo que explica la resistencia del S&P 500 cerca de sus máximos históricos.`,
    analisis: `Un mercado de acciones en máximos con baja volatilidad y dólar debilitándose es el entorno más propicio para que los flujos de capital se dirijan hacia mercados emergentes, incluyendo Perú. La Bolsa de Valores de Lima (BVL), que acumula ganancias de doble dígito en 2026 impulsada por el sector minero, podría recibir flujos adicionales de inversores internacionales que buscan retornos superiores a los del S&P 500.

Para el tipo de cambio, este escenario de apetito de riesgo global (risk-on) es favorable al sol: cuando los inversores internacionales buscan activos de mayor retorno, las monedas de países con buenos fundamentales como el Perú tienden a apreciarse. El S/ 3.365 actual podría verse reforzado si este entorno se mantiene durante las próximas semanas.`,
    categoria: 'Internacional',
    fuente: 'TradingView',
    fecha: HOY,
    destacada: false,
    imagen: 'https://images.pexels.com/photos/5831251/pexels-photo-5831251.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'h012',
    titulo: 'Futuros de tasas asignan 74% de probabilidad a pausa de la Fed en septiembre: operadores reducen apuestas agresivas tras el IPC',
    descripcion: 'Los contratos CME sobre el Fed Funds Rate reajustaron probabilidades al alza luego del IPC alineado. El mercado da por descontada la pausa de septiembre y espera el primer recorte en noviembre o diciembre de 2026.',
    contenido: `Los contratos de futuros del Fed Funds Rate cotizados en el CME Group actualizaron sus probabilidades el miércoles 12 de agosto, luego de la publicación del IPC de julio: la probabilidad implícita de una pausa de la Fed en su reunión del 17 de septiembre subió al 74%, desde el 62% registrado el martes. El 26% restante apuesta por un recorte de 25 puntos básicos en septiembre, mientras que la probabilidad de una subida cayó virtualmente a cero (0.3%). El mercado está ajustando su narrativa desde la pregunta "¿cuándo subirá la Fed?" hacia "¿cuándo comenzará a bajar?".

La reunión de septiembre se perfila como una pausa confirmada, y los futuros apuntan a que el primer recorte ocurrirá en noviembre (45% de probabilidad) o diciembre (35% de probabilidad) de 2026. Para el cierre del año, el mercado descuenta una tasa de los fondos federales en el rango de 4.75–5.00%, lo que implica solo uno o dos recortes de 25 puntos básicos desde el nivel actual de 5.25–5.50%. Los rendimientos de los bonos del Tesoro a 2 y 10 años cayeron durante la jornada, reflejando la reducción de las expectativas de política monetaria restrictiva.

El presidente de la Fed, Kevin Warsh, había declarado el martes que el comité no actuaría entre reuniones y que el dato de nóminas de la semana pasada fue el último insumo relevante antes de septiembre. Con el IPC ahora conocido y en línea, el panorama para septiembre está prácticamente cerrado. Los miembros del FOMC entran en el período de "blackout" de comunicaciones la próxima semana, por lo que no habrá más declaraciones oficiales antes de la decisión del 17 de septiembre.`,
    analisis: `Una Fed que pausa en septiembre y solo contempla 1–2 recortes para fin de año es un escenario moderadamente favorable para el sol: el diferencial de tasas entre el BCRP (4.25%) y la Fed (5.25%) se mantiene, aunque se percibe convergente. Esto reduce el atractivo del carry trade en soles, pero no genera presiones de salida de capitales significativas.

El impacto directo en el PEN/USD es limitado mientras la pausa sea el escenario base (ya está descontado). Lo que podría mover el tipo de cambio sería cualquier señal que cambie dramáticamente estas probabilidades: un dato de empleo negativo sorpresa o una escalada en la crisis de Ormuz que lleve a anticipar un recorte de emergencia de la Fed podrían apreciar significativamente el sol en el corto plazo.`,
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
