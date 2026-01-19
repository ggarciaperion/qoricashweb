'use client';

import Link from 'next/link';
import { FileText, Scale, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function TerminosCondiciones() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header/Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <img src="/logo-principal.png" alt="QoriCash" className="h-16 w-auto" />
              <span className="text-3xl font-display font-bold text-gray-900">
                QoriCash
              </span>
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-6">
            <Scale className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-600">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-4">
                Bienvenido a <strong>QoriCash</strong>. Los presentes Términos y Condiciones (en adelante, "Términos")
                regulan el acceso y uso de la plataforma digital de casa de cambio operada por{' '}
                <strong>QORICASH S.A.C.</strong> (RUC: 20615113698), con nombre comercial{' '}
                <strong>QORICASH FX</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Al acceder y utilizar nuestros servicios, usted acepta expresamente estos Términos.
                Si no está de acuerdo con alguna disposición, deberá abstenerse de utilizar la plataforma.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    1. Definiciones
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-3 text-gray-700">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p><strong>Plataforma:</strong> Sitio web y aplicación móvil de QoriCash</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p><strong>Usuario:</strong> Persona natural o jurídica que se registra y utiliza los servicios</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p><strong>Operación:</strong> Transacción de compra o venta de divisas realizada a través de la plataforma</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p><strong>Tipo de Cambio:</strong> Valor de conversión entre monedas vigente al momento de la operación</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    2. Servicios Ofrecidos
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  QoriCash ofrece los siguientes servicios de casa de cambio digital:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Compra de dólares estadounidenses (USD)</li>
                  <li>Venta de dólares estadounidenses (USD)</li>
                  <li>Cotización en tiempo real del tipo de cambio</li>
                  <li>Transferencias bancarias en soles (PEN) y dólares (USD)</li>
                  <li>Consulta de historial de operaciones</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    3. Registro y Cuenta de Usuario
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <h3 className="font-semibold text-gray-900">3.1 Requisitos de Registro</h3>
                <p className="leading-relaxed">
                  Para utilizar nuestros servicios, el usuario debe:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ser mayor de 18 años</li>
                  <li>Proporcionar información veraz, completa y actualizada</li>
                  <li>Completar el proceso de verificación de identidad (KYC)</li>
                  <li>Aceptar estos Términos y la Política de Privacidad</li>
                </ul>

                <h3 className="font-semibold text-gray-900 mt-6">3.2 Seguridad de la Cuenta</h3>
                <p className="leading-relaxed">
                  El usuario es responsable de:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                  <li>Cerrar sesión al finalizar cada uso de la plataforma</li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-sm">
                    <strong>Importante:</strong> QoriCash no se hace responsable por el uso indebido
                    de credenciales compartidas voluntariamente por el usuario.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    4. Proceso de Operaciones
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <h3 className="font-semibold text-gray-900">4.1 Cotización</h3>
                <p className="leading-relaxed">
                  El tipo de cambio mostrado en la plataforma es referencial y puede variar según las
                  condiciones del mercado. El tipo de cambio aplicable será el vigente al momento de
                  confirmar la operación.
                </p>

                <h3 className="font-semibold text-gray-900 mt-6">4.2 Confirmación de Operación</h3>
                <p className="leading-relaxed">
                  Una vez confirmada una operación:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>El tipo de cambio queda bloqueado por un tiempo determinado</li>
                  <li>El usuario debe realizar la transferencia bancaria según las instrucciones proporcionadas</li>
                  <li>La operación se completa al validar el depósito bancario</li>
                </ul>

                <h3 className="font-semibold text-gray-900 mt-6">4.3 Tiempos de Procesamiento</h3>
                <div className="bg-primary-50 rounded-xl p-6 space-y-2">
                  <p><strong>Transferencias inmediatas:</strong> Menos de 10 minutos (BCP, Interbank, BanBif, Banco Pichincha)</p>
                  <p><strong>Transferencias interbancarias:</strong> Hasta 2 horas hábiles (BBVA, Scotiabank)</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                  <p className="text-sm">
                    <strong>Nota:</strong> Los tiempos pueden variar según la disponibilidad de los sistemas
                    bancarios y están sujetos a horarios de atención de cada entidad financiera.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    5. Cancelaciones y Reembolsos
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <h3 className="font-semibold text-gray-900">5.1 Cancelación por el Usuario</h3>
                <p className="leading-relaxed">
                  El usuario puede cancelar una operación antes de realizar la transferencia bancaria.
                  Una vez efectuada la transferencia, la operación no puede cancelarse.
                </p>

                <h3 className="font-semibold text-gray-900 mt-6">5.2 Rechazo de Operaciones</h3>
                <p className="leading-relaxed">
                  QoriCash se reserva el derecho de rechazar operaciones en los siguientes casos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Información de usuario incompleta o no verificada</li>
                  <li>Sospecha de actividades fraudulentas o lavado de activos</li>
                  <li>Incumplimiento de requisitos normativos</li>
                  <li>Problemas técnicos en la plataforma o sistemas bancarios</li>
                </ul>

                <h3 className="font-semibold text-gray-900 mt-6">5.3 Reembolsos</h3>
                <p className="leading-relaxed">
                  En caso de cancelación o rechazo de una operación después de recibir la transferencia,
                  el reembolso se realizará a la misma cuenta bancaria de origen dentro de las 24-48 horas hábiles.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    6. Prohibiciones y Uso Indebido
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Está estrictamente prohibido:
                </p>
                <div className="space-y-3">
                  <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p><strong>Lavado de activos:</strong> Utilizar la plataforma para operaciones relacionadas con actividades ilícitas</p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p><strong>Fraude:</strong> Proporcionar información falsa o documentos adulterados</p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p><strong>Múltiples cuentas:</strong> Crear más de una cuenta por usuario sin autorización</p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p><strong>Manipulación:</strong> Intentar alterar el funcionamiento de la plataforma o explotar vulnerabilidades</p>
                    </div>
                  </div>
                </div>
                <p className="leading-relaxed mt-4">
                  El incumplimiento de estas prohibiciones resultará en la suspensión inmediata de la cuenta
                  y la notificación a las autoridades competentes.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Comisiones y Tarifas
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  QoriCash opera con total transparencia. El tipo de cambio mostrado ya incluye nuestro margen.
                  <strong> No cobramos comisiones adicionales ocultas.</strong>
                </p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <p className="text-sm">
                    <strong>Garantía de transparencia:</strong> El monto que ves en la cotización es exactamente
                    lo que recibirás o pagarás, sin sorpresas.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Limitación de Responsabilidad
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  QoriCash no será responsable por:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Demoras en transferencias bancarias causadas por terceros (bancos, sistemas de pago)</li>
                  <li>Pérdidas derivadas de decisiones de inversión basadas en tipos de cambio</li>
                  <li>Interrupciones del servicio por mantenimiento programado o casos de fuerza mayor</li>
                  <li>Errores del usuario al proporcionar datos de cuentas bancarias</li>
                  <li>Fluctuaciones normales del mercado cambiario</li>
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Cumplimiento Normativo
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  QoriCash opera en cumplimiento con la normativa peruana vigente:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Ley N° 27693:</strong> Ley de Protección al Consumidor</li>
                  <li><strong>Ley N° 29733:</strong> Ley de Protección de Datos Personales</li>
                  <li><strong>Normativa SBS:</strong> Prevención de Lavado de Activos y Financiamiento del Terrorismo (LAFT)</li>
                  <li><strong>Resoluciones SUNAT:</strong> Obligaciones tributarias aplicables</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Nos reservamos el derecho de solicitar información adicional y documentación complementaria
                  para dar cumplimiento a nuestras obligaciones de debida diligencia.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Propiedad Intelectual
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Todos los contenidos de la plataforma (logotipos, diseños, textos, código, bases de datos)
                  son propiedad exclusiva de QORICASH S.A.C. o sus licenciantes. Queda prohibida su
                  reproducción, distribución o uso sin autorización expresa.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Modificaciones de los Términos
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  QoriCash se reserva el derecho de modificar estos Términos en cualquier momento.
                  Los cambios serán notificados a través de la plataforma y/o correo electrónico.
                  El uso continuado de los servicios después de las modificaciones constituye aceptación
                  de los nuevos términos.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Resolución de Controversias
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Cualquier controversia derivada de estos Términos se resolverá inicialmente mediante
                  negociación directa. De no alcanzarse un acuerdo, las partes se someterán a la jurisdicción
                  de los tribunales de Lima, Perú, renunciando a cualquier otro fuero que pudiera corresponderles.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Contacto y Atención al Cliente
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Para consultas, reclamos o soporte técnico, puede contactarnos a través de:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Correo electrónico:</strong> info@qoricash.pe</li>
                  <li><strong>Teléfono:</strong> 926 011 920</li>
                  <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Nos comprometemos a responder todas las consultas dentro de las 24 horas hábiles.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Legal</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Razón Social:</strong> QORICASH S.A.C.</p>
                <p><strong>RUC:</strong> 20615113698</p>
                <p><strong>Nombre Comercial:</strong> QORICASH FX</p>
                <p><strong>Dirección:</strong> Av. Brasil N° 2790, Int. 504, Lima – Lima – Pueblo Libre</p>
                <p><strong>Correo Electrónico:</strong> info@qoricash.pe</p>
                <p><strong>Teléfono:</strong> 926 011 920</p>
              </div>
              <div className="mt-6 pt-6 border-t border-primary-200">
                <p className="text-sm text-gray-600">
                  Al utilizar los servicios de QoriCash, usted declara haber leído, comprendido y aceptado
                  en su totalidad los presentes Términos y Condiciones.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity w-fit">
                <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto" />
                <span className="text-2xl font-display font-bold text-white">
                  QoriCash
                </span>
              </Link>
              <p className="text-sm">
                Casa de cambio online líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/servicios#compra" className="hover:text-white transition">Compra de dólares</Link></li>
                <li><Link href="/servicios#venta" className="hover:text-white transition">Venta de dólares</Link></li>
                <li><Link href="/servicios#tipo-cambio" className="hover:text-white transition">Tipo de cambio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre-nosotros" className="hover:text-white transition">Sobre nosotros</Link></li>
                <li><Link href="/terminos-condiciones" className="hover:text-white transition">Términos y condiciones</Link></li>
                <li><Link href="/politica-privacidad" className="hover:text-white transition">Política de privacidad</Link></li>
                <li><Link href="/politica-cookies" className="hover:text-white transition">Política de cookies</Link></li>
                <li><Link href="/libro-reclamaciones" className="hover:text-white transition">Libro de reclamaciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@qoricash.pe" className="hover:text-white transition">
                    info@qoricash.pe
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    926 011 920
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-white transition leading-relaxed">
                    Av. Brasil N° 2790, Int. 504<br />
                    Lima – Lima – Pueblo Libre
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="leading-relaxed">
                    <div>Lunes a viernes: 9:00 a.m. – 6:00 p.m.</div>
                    <div>Sábados: 9:00 a.m. – 1:00 p.m.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 QoriCash. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
