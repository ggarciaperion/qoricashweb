'use client';

import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';

export default function PoliticaPrivacidad() {
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
            <Shield className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">
            Política de Privacidad
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
                En <strong>QORICASH S.A.C.</strong> (en adelante, "QoriCash", "nosotros" o "la empresa"),
                con RUC 20615113698 y nombre comercial <strong>QORICASH FX</strong>, nos comprometemos a
                proteger la privacidad y seguridad de los datos personales de nuestros usuarios y clientes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos
                su información personal cuando utiliza nuestros servicios de casa de cambio digital.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    1. Información que Recopilamos
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Para brindarle nuestros servicios de manera segura y conforme a la normativa vigente,
                  recopilamos la siguiente información:
                </p>

                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900">1.1 Datos de Identificación Personal</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nombre completo</li>
                    <li>Documento de identidad (DNI, CE, Pasaporte)</li>
                    <li>RUC (para personas jurídicas)</li>
                    <li>Fecha de nacimiento</li>
                    <li>Nacionalidad</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900">1.2 Datos de Contacto</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Dirección de correo electrónico</li>
                    <li>Número de teléfono móvil</li>
                    <li>Dirección física</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900">1.3 Datos Financieros</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Información de cuentas bancarias (número de cuenta, banco, titular)</li>
                    <li>Historial de transacciones realizadas en nuestra plataforma</li>
                    <li>Información sobre el origen y destino de fondos</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                  <h3 className="font-semibold text-gray-900">1.4 Datos Técnicos</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Dirección IP</li>
                    <li>Tipo de dispositivo y navegador</li>
                    <li>Datos de geolocalización</li>
                    <li>Información de cookies y tecnologías similares</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    2. Uso de la Información
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Utilizamos su información personal para los siguientes propósitos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Prestación de servicios:</strong> Procesar sus operaciones de cambio de divisas</li>
                  <li><strong>Verificación de identidad:</strong> Cumplir con requisitos legales y prevenir fraudes</li>
                  <li><strong>Comunicaciones:</strong> Enviar notificaciones sobre sus transacciones y actualizaciones del servicio</li>
                  <li><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma para optimizar la experiencia del usuario</li>
                  <li><strong>Cumplimiento normativo:</strong> Reportes a autoridades competentes según lo requiera la ley</li>
                  <li><strong>Prevención de lavado de activos:</strong> Monitoreo de transacciones conforme a normativas LAFT</li>
                  <li><strong>Atención al cliente:</strong> Responder consultas y resolver incidencias</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    3. Protección de Datos
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger
                  su información personal:
                </p>
                <div className="bg-primary-50 rounded-xl p-6 space-y-3">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encriptación SSL/TLS para todas las comunicaciones</li>
                    <li>Almacenamiento seguro en servidores con acceso restringido</li>
                    <li>Autenticación de dos factores (2FA)</li>
                    <li>Monitoreo continuo de actividades sospechosas</li>
                    <li>Auditorías de seguridad periódicas</li>
                    <li>Capacitación constante de nuestro personal en protección de datos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    4. Compartir Información con Terceros
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  No vendemos, alquilamos ni compartimos su información personal con terceros para
                  fines comerciales. Podemos compartir sus datos únicamente en los siguientes casos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Entidades financieras:</strong> Bancos necesarios para procesar sus transacciones</li>
                  <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma (hosting, servicios de verificación de identidad)</li>
                  <li><strong>Autoridades regulatorias:</strong> Cuando sea requerido por ley (SBS, SUNAT, UIF-Perú)</li>
                  <li><strong>Orden judicial:</strong> En cumplimiento de mandatos judiciales o procesos legales</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-sm">
                    <strong>Nota:</strong> Todos los terceros con los que compartimos información están
                    obligados contractualmente a mantener la confidencialidad y seguridad de sus datos.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    5. Sus Derechos (Ley N° 29733 - Ley de Protección de Datos Personales)
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  De acuerdo con la legislación peruana, usted tiene los siguientes derechos:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">✓ Acceso</h4>
                    <p className="text-sm">Conocer qué datos personales tenemos sobre usted</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">✓ Rectificación</h4>
                    <p className="text-sm">Solicitar la corrección de datos inexactos o incompletos</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">✓ Cancelación</h4>
                    <p className="text-sm">Solicitar la eliminación de sus datos</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">✓ Oposición</h4>
                    <p className="text-sm">Oponerse al tratamiento de sus datos personales</p>
                  </div>
                </div>
                <p className="leading-relaxed mt-4">
                  Para ejercer estos derechos, puede contactarnos en:{' '}
                  <strong>info@qoricash.pe</strong> o llamarnos al <strong>926 011 920</strong>.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    6. Retención de Datos
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Conservamos su información personal durante el tiempo necesario para cumplir con los
                  propósitos descritos en esta política y las obligaciones legales aplicables:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Datos de transacciones: Mínimo 5 años (normativa LAFT)</li>
                  <li>Datos de identificación: Durante la relación comercial y hasta 10 años después</li>
                  <li>Datos tributarios: Según lo establecido por SUNAT</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Cookies y Tecnologías Similares
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma,
                  analizar el tráfico y personalizar el contenido. Puede configurar su navegador para rechazar
                  cookies, aunque esto puede afectar algunas funcionalidades del servicio.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Cambios a esta Política
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente.
                  Le notificaremos sobre cambios significativos mediante correo electrónico o un aviso
                  destacado en nuestra plataforma. La fecha de la última actualización se indica al
                  inicio de este documento.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Razón Social:</strong> QORICASH S.A.C.</p>
                <p><strong>RUC:</strong> 20615113698</p>
                <p><strong>Nombre Comercial:</strong> QORICASH FX</p>
                <p><strong>Dirección:</strong> Av. Brasil N° 2790, Int. 504, Lima – Lima – Pueblo Libre</p>
                <p><strong>Correo Electrónico:</strong> info@qoricash.pe</p>
                <p><strong>Teléfono:</strong> 926 011 920</p>
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
