'use client';

import Link from 'next/link';
import { Cookie, CheckCircle, Settings, BarChart3, Shield, Info } from 'lucide-react';

export default function PoliticaCookies() {
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
            <Cookie className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900">
            Política de Cookies
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
                En <strong>QORICASH S.A.C.</strong> (en adelante, "QoriCash"), utilizamos cookies y tecnologías
                similares para mejorar tu experiencia en nuestra plataforma, garantizar la seguridad de tus
                operaciones y optimizar el funcionamiento de nuestros servicios.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Esta Política de Cookies te explica de manera clara y transparente qué son las cookies,
                cómo las utilizamos y cómo puedes gestionarlas.
              </p>
            </div>

            {/* Section 1: What are cookies */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    1. ¿Qué son las cookies?
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil)
                  cuando visitas un sitio web. Estos archivos permiten que el sitio web recuerde tus preferencias,
                  faciliten la navegación y mejoren tu experiencia de usuario.
                </p>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ejemplo práctico:</h3>
                  <p className="text-sm">
                    Cuando inicias sesión en QoriCash, una cookie guarda esa información para que no tengas que
                    volver a ingresar tus credenciales cada vez que cambias de página dentro de la plataforma.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Types of cookies */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    2. Tipos de cookies que utilizamos
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-6 text-gray-700">

                {/* Necessary cookies */}
                <div className="bg-white rounded-2xl p-6 border-2 border-primary-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">Cookies Necesarias (Esenciales)</h3>
                  </div>
                  <p className="mb-3">
                    Son <strong>imprescindibles</strong> para el correcto funcionamiento de la plataforma.
                    Sin ellas, no podrías realizar operaciones de cambio, iniciar sesión o navegar de forma segura.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Para qué se usan:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                      <li>Autenticación y gestión de sesiones</li>
                      <li>Seguridad y prevención de fraudes</li>
                      <li>Funcionalidad básica del sitio web</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Nota:</strong> Estas cookies no pueden ser desactivadas ya que son necesarias para que la plataforma funcione.
                  </p>
                </div>

                {/* Functional cookies */}
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Cookies Funcionales</h3>
                  </div>
                  <p className="mb-3">
                    Permiten personalizar tu experiencia recordando tus preferencias y configuraciones.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Para qué se usan:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                      <li>Recordar idioma preferido</li>
                      <li>Guardar preferencias de visualización</li>
                      <li>Mantener configuraciones personalizadas</li>
                    </ul>
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Cookies Analíticas</h3>
                  </div>
                  <p className="mb-3">
                    Nos ayudan a entender cómo los usuarios interactúan con nuestra plataforma para mejorarla continuamente.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-2">Para qué se usan:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                      <li>Medir el rendimiento del sitio web</li>
                      <li>Comprender patrones de navegación</li>
                      <li>Identificar áreas de mejora</li>
                      <li>Generar estadísticas de uso</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Nota:</strong> Los datos recopilados son anónimos y se utilizan únicamente con fines de mejora del servicio.
                  </p>
                </div>

              </div>
            </div>

            {/* Section 3: Cookie management */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    3. Gestión de cookies
                  </h2>
                </div>
              </div>
              <div className="ml-16 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Puedes configurar tu navegador para aceptar, rechazar o recibir notificaciones sobre el uso de cookies.
                </p>

                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Configuración por navegador:</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-2">Google Chrome</p>
                      <p className="text-sm">Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-2">Mozilla Firefox</p>
                      <p className="text-sm">Opciones → Privacidad y seguridad → Cookies y datos del sitio</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-2">Safari</p>
                      <p className="text-sm">Preferencias → Privacidad → Cookies y datos de sitios web</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="font-semibold text-gray-900 mb-2">Microsoft Edge</p>
                      <p className="text-sm">Configuración → Privacidad, búsqueda y servicios → Cookies y permisos del sitio</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-sm">
                    <strong>Importante:</strong> Ten en cuenta que si desactivas las cookies necesarias,
                    algunas funcionalidades de la plataforma podrían no estar disponibles o no funcionar correctamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Duration */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Duración de las cookies
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Utilizamos dos tipos de cookies según su duración:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Cookies de sesión</h3>
                    <p className="text-sm">
                      Son temporales y se eliminan automáticamente cuando cierras tu navegador.
                      Se utilizan para mantener tu sesión activa mientras navegas.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Cookies persistentes</h3>
                    <p className="text-sm">
                      Permanecen en tu dispositivo durante un período determinado (días, meses o años)
                      para recordar tus preferencias en futuras visitas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Third party */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Cookies de terceros
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  En ocasiones, utilizamos servicios de terceros que pueden instalar sus propias cookies para
                  proporcionarnos herramientas de análisis o funcionalidades adicionales. Estos terceros tienen
                  sus propias políticas de privacidad y uso de cookies.
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ejemplos de servicios de terceros:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                    <li>Google Analytics (análisis de tráfico web)</li>
                    <li>Servicios de mapas y geolocalización</li>
                    <li>Herramientas de atención al cliente</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Updates */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Actualización de esta política
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  QoriCash puede actualizar esta Política de Cookies periódicamente para reflejar cambios
                  en nuestras prácticas o requisitos legales. Te recomendamos revisar esta página regularmente
                  para estar informado sobre cómo utilizamos las cookies.
                </p>
              </div>
            </div>

            {/* Section 7: Contact */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. ¿Tienes dudas?
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  Si tienes preguntas sobre nuestra Política de Cookies o sobre cómo gestionamos tus datos,
                  puedes contactarnos en:
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="space-y-2 text-sm">
                    <li><strong>Correo electrónico:</strong> info@qoricash.pe</li>
                    <li><strong>Teléfono:</strong> 926 011 920</li>
                    <li><strong>Horario:</strong> Lunes a viernes: 9:00 a.m. – 6:00 p.m. | Sábados: 9:00 a.m. – 1:00 p.m.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Summary box */}
            <div className="bg-gradient-to-r from-secondary to-secondary-700 rounded-2xl p-8 text-white">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-3">Nuestro compromiso</h3>
                  <p className="text-gray-100 leading-relaxed">
                    En QoriCash utilizamos cookies de manera responsable y transparente, siempre respetando
                    tu privacidad y cumpliendo con la normativa vigente. Tu confianza es nuestra prioridad.
                  </p>
                </div>
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
