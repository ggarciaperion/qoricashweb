'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import {
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  Smartphone,
  Globe,
  Lock,
  Zap
} from 'lucide-react';

export default function Home() {
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');

  useEffect(() => {
    // TODO: Fetch real rates from API
    // fetchExchangeRates();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/logo-principal.png" alt="QoriCash" className="h-10 w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-primary-600 transition">Servicios</a>
              <a href="#como-funciona" className="text-gray-700 hover:text-primary-600 transition">Cómo Funciona</a>
              <a href="#nosotros" className="text-gray-700 hover:text-primary-600 transition">Nosotros</a>
              <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition shadow-md hover:shadow-lg"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                Cambia{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  dólares
                </span>{' '}
                al mejor precio
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Compra y vende dólares de forma segura, rápida y con los mejores tipos de cambio del mercado peruano.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center justify-center bg-primary text-secondary px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-600 transition shadow-lg hover:shadow-xl group"
                >
                  Empezar Ahora
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-50 transition"
                >
                  Ver cómo funciona
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-gray-600">Clientes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">$50M+</div>
                  <div className="text-sm text-gray-600">Cambiados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">4.9/5</div>
                  <div className="text-sm text-gray-600">Calificación</div>
                </div>
              </div>
            </div>

            {/* Exchange Rates Card with Calculator */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-gray-900">Tipo de cambio hoy en QoriCash</h3>
                <div className="flex items-center text-green-600 text-xs font-semibold">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-2"></div>
                  En vivo
                </div>
              </div>

              <Calculator
                initialRates={{
                  compra: parseFloat(buyRate),
                  venta: parseFloat(sellRate)
                }}
              />

              <Link
                href="/registro"
                className="w-full mt-4 bg-primary text-secondary py-3 rounded-xl font-bold hover:bg-primary-600 transition shadow-md flex items-center justify-center group text-sm"
              >
                Cambiar Ahora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition w-4 h-4" />
              </Link>

              <p className="text-xs text-center text-gray-500 mt-3">
                * Tipos de cambio actualizados en tiempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              ¿Por qué elegir QoriCash?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Te ofrecemos la mejor experiencia en cambio de divisas con seguridad garantizada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Seguro y Confiable',
                description: 'Plataforma certificada con los más altos estándares de seguridad',
                color: 'blue'
              },
              {
                icon: Zap,
                title: 'Transferencia Rápida',
                description: 'Recibe tu dinero en minutos, sin complicaciones',
                color: 'yellow'
              },
              {
                icon: TrendingUp,
                title: 'Mejor Tipo de Cambio',
                description: 'Tasas competitivas actualizadas en tiempo real',
                color: 'green'
              },
              {
                icon: Lock,
                title: '100% Protegido',
                description: 'Tus datos y transacciones completamente cifrados',
                color: 'purple'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition group"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Cambia en 3 simples pasos
            </h2>
            <p className="text-xl text-gray-600">
              Proceso rápido y sencillo para tu primera operación
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Regístrate',
                description: 'Crea tu cuenta en menos de 2 minutos con tu DNI y datos bancarios',
                icon: Users
              },
              {
                step: '02',
                title: 'Elige el monto',
                description: 'Selecciona cuánto quieres cambiar y verifica el tipo de cambio',
                icon: Globe
              },
              {
                step: '03',
                title: 'Recibe tu dinero',
                description: 'Transferencia inmediata a tu cuenta bancaria. ¡Listo!',
                icon: CheckCircle2
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                  <div className="text-6xl font-bold text-primary-100 mb-4">{step.step}</div>
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Comienza a cambiar hoy mismo
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de peruanos que confían en QoriCash para sus cambios de divisas
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center bg-primary text-secondary px-10 py-5 rounded-full text-lg font-bold hover:bg-primary-600 transition shadow-xl hover:shadow-2xl group"
          >
            Abrir mi cuenta gratis
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/logo-principal.png" alt="QoriCash" className="h-8 w-auto mb-4" />
              <p className="text-sm">
                Casa de cambio online líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Compra de dólares</a></li>
                <li><a href="#" className="hover:text-white transition">Venta de dólares</a></li>
                <li><a href="#" className="hover:text-white transition">Tipo de cambio</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition">Términos y condiciones</a></li>
                <li><a href="#" className="hover:text-white transition">Política de privacidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 contacto@qoricash.pe</li>
                <li>📱 +51 999 999 999</li>
                <li>📍 Lima, Perú</li>
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
