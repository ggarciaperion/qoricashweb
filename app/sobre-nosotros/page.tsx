'use client';

import Link from 'next/link';
import { Shield, Zap, Users, Award, CheckCircle, MapPin, Building2, Phone, Mail } from 'lucide-react';

export default function SobreNosotros() {
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
      <section className="pt-20 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              Sobre Nosotros
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="text-gray-900">Tu casa de cambio digital</span>
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary bg-clip-text text-transparent">
              de confianza
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            En QoriCash transformamos la manera de cambiar divisas en el Perú,
            ofreciendo una experiencia 100% digital, segura y al mejor tipo de cambio del mercado.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 leading-relaxed">
              Democratizar el acceso a tipos de cambio justos y competitivos,
              eliminando las barreras tradicionales del cambio de divisas mediante una plataforma digital
              segura, rápida y transparente. Ofrecemos nuestros servicios a cualquier persona debidamente
              identificada con DNI o Carnet de Extranjería, desde cualquier parte del mundo,
              siempre que cuente con una cuenta bancaria en el Perú.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-700 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
            <p className="text-gray-700 leading-relaxed">
              Ser la casa de cambio digital líder en el Perú, reconocida por nuestra innovación tecnológica,
              excelencia en el servicio y compromiso inquebrantable con la seguridad y satisfacción de
              nuestros clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-600">
              Los pilares que guían cada decisión en QoriCash
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Seguridad',
                description: 'Protegemos cada transacción con tecnología de vanguardia y los más altos estándares de seguridad digital.'
              },
              {
                icon: Zap,
                title: 'Rapidez',
                description: 'Transferencias en menos de 10 minutos. Tu tiempo es valioso y lo respetamos.'
              },
              {
                icon: CheckCircle,
                title: 'Transparencia',
                description: 'Sin comisiones ocultas. El tipo de cambio que ves es el tipo de cambio que obtienes.'
              },
              {
                icon: Users,
                title: 'Confianza',
                description: 'Miles de clientes satisfechos respaldan nuestro compromiso con la excelencia.'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir QoriCash?
            </h2>
            <p className="text-xl text-gray-600">
              Ventajas que nos hacen diferentes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Mejor tipo de cambio',
                description: 'Tasas competitivas y transparentes, significativamente más rentables que las casas de cambio tradicionales y bancos.',
                stat: 'Tipo de cambio preferencial'
              },
              {
                title: '100% digital',
                description: 'Opera desde cualquier lugar, sin necesidad de desplazarte ni hacer colas. Atención de lunes a sábado.',
                stat: 'Lunes a Sábado'
              },
              {
                title: 'Transferencias rápidas',
                description: 'Recibe tu dinero en tu cuenta bancaria en menos de 10 minutos.',
                stat: '< 10 minutos'
              },
              {
                title: 'Seguridad garantizada',
                description: 'Encriptación de última generación y cumplimiento de normativas financieras.',
                stat: '100% seguro'
              },
              {
                title: 'Sin comisiones ocultas',
                description: 'Total transparencia. Lo que ves en la cotización es lo que pagas.',
                stat: 'S/ 0 ocultos'
              },
              {
                title: 'Soporte especializado',
                description: 'Equipo de atención al cliente disponible para ayudarte cuando lo necesites.',
                stat: 'Asistencia inmediata'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:border-primary-300 transition-colors">
                <div className="text-3xl font-bold text-primary-600 mb-3">{item.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-12 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-primary-100 rounded-2xl mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Información Corporativa
              </h2>
              <p className="text-gray-600">
                Conoce más sobre nuestra empresa
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Razón Social</h3>
                  <p className="text-gray-700">QORICASH S.A.C.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Nombre Comercial</h3>
                  <p className="text-gray-700">QORICASH FX</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">RUC</h3>
                  <p className="text-gray-700">20615113698</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                  <p className="text-gray-700">
                    Av. Brasil N° 2790, Int. 504<br />
                    Lima – Lima – Pueblo Libre
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                  <p className="text-gray-700">926 011 920</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Correo Electrónico</h3>
                  <p className="text-gray-700">info@qoricash.pe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-secondary to-secondary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Únete a miles de peruanos que ya confían en QoriCash para sus operaciones de cambio
          </p>
          <Link
            href="/crear-cuenta"
            className="inline-flex items-center bg-white text-secondary px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl"
          >
            Crear cuenta gratis
          </Link>
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
