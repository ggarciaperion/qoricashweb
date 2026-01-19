'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import {
  ArrowRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  CheckCircle,
  Clock,
  Globe,
  Calculator,
  ArrowLeftRight,
  Percent
} from 'lucide-react';

export default function Servicios() {
  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Handle scroll to section from hash
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    // Update active section on scroll
    const handleScroll = () => {
      const sections = ['compra', 'venta', 'tipo-cambio'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Quick Navigation */}
      <section className="pt-20 pb-12 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                Nuestros Servicios
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="text-gray-900">Cambio de divisas</span>
              <br />
              <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary bg-clip-text text-transparent">
                simple y seguro
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre cómo funciona cada uno de nuestros servicios y elige el que mejor se adapte a tus necesidades
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => scrollToSection('compra')}
              className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                activeSection === 'compra' ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Compra de dólares</h3>
              <p className="text-sm text-gray-600">Cambia tus dólares a soles</p>
            </button>

            <button
              onClick={() => scrollToSection('venta')}
              className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                activeSection === 'venta' ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Venta de dólares</h3>
              <p className="text-sm text-gray-600">Obtén dólares con tus soles</p>
            </button>

            <button
              onClick={() => scrollToSection('tipo-cambio')}
              className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                activeSection === 'tipo-cambio' ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-700 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tipo de cambio</h3>
              <p className="text-sm text-gray-600">Entiende cómo funciona</p>
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: Compra de Dólares */}
      <section id="compra" className="py-20 px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Compra de Dólares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QoriCash te compra tus dólares y te entrega soles al mejor tipo de cambio del mercado
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Cómo funciona?</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Tienes dólares</h4>
                      <p className="text-gray-600 text-sm">Cuentas con USD que quieres convertir a soles peruanos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">QoriCash te los compra</h4>
                      <p className="text-gray-600 text-sm">Te ofrecemos un tipo de cambio competitivo y transparente</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Recibes soles</h4>
                      <p className="text-gray-600 text-sm">Transferimos los soles a tu cuenta bancaria en menos de 10 minutos</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">Ejemplo práctico</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Tienes:</span>
                    <span className="text-2xl font-bold text-gray-900">$1,000 USD</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Tipo de cambio:</span>
                    <span className="text-xl font-bold text-green-600">S/ 3.750</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                    <span className="text-gray-700 font-medium">Recibes:</span>
                    <span className="text-2xl font-bold text-green-600">S/ 3,750</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Rapidez</h4>
              <p className="text-sm text-gray-600">Transferencia en menos de 10 minutos</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Mejor tasa</h4>
              <p className="text-sm text-gray-600">Tipo de cambio competitivo</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Seguridad</h4>
              <p className="text-sm text-gray-600">Operaciones protegidas</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Transparencia</h4>
              <p className="text-sm text-gray-600">Sin comisiones ocultas</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={isAuthenticated ? "/dashboard/nueva-operacion" : "/crear-cuenta"}
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {isAuthenticated ? "Iniciar operación" : "Abrir mi cuenta gratis"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Venta de Dólares */}
      <section id="venta" className="py-20 px-6 sm:px-8 lg:px-12 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
              <TrendingDown className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Venta de Dólares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QoriCash te vende dólares a cambio de tus soles de forma rápida y segura
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Cómo funciona?</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">Ejemplo práctico</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Tienes:</span>
                    <span className="text-2xl font-bold text-gray-900">S/ 3,770</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Tipo de cambio:</span>
                    <span className="text-xl font-bold text-blue-600">S/ 3.770</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <span className="text-gray-700 font-medium">Recibes:</span>
                    <span className="text-2xl font-bold text-blue-600">$1,000 USD</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Necesitas dólares</h4>
                      <p className="text-gray-600 text-sm">Para pagos, ahorros, viajes o negocios</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">QoriCash te los vende</h4>
                      <p className="text-gray-600 text-sm">Al mejor tipo de cambio, sin comisiones ocultas</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Recibes USD</h4>
                      <p className="text-gray-600 text-sm">Transferimos los dólares a tu cuenta en menos de 10 minutos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">¿Cuándo necesitas comprar dólares?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Viajes</h4>
                <p className="text-sm text-gray-600">Para tus vacaciones o viajes de negocio al extranjero</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Ahorros</h4>
                <p className="text-sm text-gray-600">Diversifica tus ahorros en moneda extranjera</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Pagos</h4>
                <p className="text-sm text-gray-600">Para realizar pagos internacionales o compras en línea</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Negocios</h4>
                <p className="text-sm text-gray-600">Para operaciones comerciales y proveedores internacionales</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Disponibilidad</h4>
              <p className="text-sm text-gray-600">Dólares disponibles cuando los necesites</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Proceso simple</h4>
              <p className="text-sm text-gray-600">100% digital, sin complicaciones</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Rápido</h4>
              <p className="text-sm text-gray-600">Transferencias en minutos</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={isAuthenticated ? "/dashboard/nueva-operacion" : "/crear-cuenta"}
              className="inline-flex items-center bg-blue-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-xl hover:shadow-2xl"
            >
              {isAuthenticated ? "Iniciar operación" : "Abrir mi cuenta gratis"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Tipo de Cambio */}
      <section id="tipo-cambio" className="py-20 px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-secondary/10 rounded-2xl mb-4">
              <Calculator className="w-12 h-12 text-secondary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tipo de Cambio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Entiende cómo funciona el tipo de cambio y por qué QoriCash te ofrece las mejores tasas
            </p>
          </div>

          {/* What is Exchange Rate */}
          <div className="bg-gradient-to-br from-secondary/5 to-primary-50 rounded-3xl p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Qué es el tipo de cambio?</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  El <strong>tipo de cambio</strong> es la tasa o precio al cual se convierte una moneda en otra.
                  Por ejemplo, cuántos soles peruanos (PEN) necesitas para obtener un dólar estadounidense (USD).
                </p>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 font-medium">1 USD =</span>
                    <span className="text-3xl font-bold text-secondary">S/ 3.750</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Esto significa que por cada dólar, recibes 3.750 soles
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="font-bold text-gray-900 mb-4 text-center">Factores que influyen</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Oferta y demanda del mercado</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Política económica del país</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Tasas de interés internacionales</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">Inflación y estabilidad económica</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Conceptos clave</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Spread */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Spread</h4>
                </div>
                <p className="text-gray-700 mb-6">
                  Es la <strong>diferencia entre el precio de compra y el precio de venta</strong> de una moneda
                  en el mercado cambiario. Esta diferencia existe en todas las operaciones de cambio de divisas.
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Ejemplo:</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tipo de Compra:</span>
                      <span className="font-bold text-green-600">S/ 3.750</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tipo de Venta:</span>
                      <span className="font-bold text-blue-600">S/ 3.770</span>
                    </div>
                    <div className="h-px bg-gray-300"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Spread:</span>
                      <span className="font-bold text-secondary">S/ 0.020</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    El spread varía según las condiciones del mercado y cada operador
                  </p>
                </div>
              </div>

              {/* Pips */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Percent className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Pips</h4>
                </div>
                <p className="text-gray-700 mb-6">
                  Son las <strong>variaciones más pequeñas en el tipo de cambio</strong>.
                  Generalmente representan el cuarto decimal en el precio de la moneda.
                </p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Ejemplo:</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tipo de cambio inicial:</span>
                      <span className="font-bold text-gray-900">S/ 3.7500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tipo de cambio nuevo:</span>
                      <span className="font-bold text-gray-900">S/ 3.7525</span>
                    </div>
                    <div className="h-px bg-gray-300"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Variación:</span>
                      <span className="font-bold text-green-600">+25 pips</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Cada pip = 0.0001 en el tipo de cambio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QoriCash Advantage */}
          <div className="bg-gradient-to-r from-secondary to-secondary-700 rounded-3xl p-8 md:p-12 mb-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Ventaja QoriCash</h3>
              <p className="text-xl text-gray-100">
                Tipos de cambio transparentes y competitivos
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2 text-center">Sin sorpresas</h4>
                <p className="text-sm text-gray-100 text-center">
                  El tipo de cambio que ves es el que obtienes, sin comisiones ocultas
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2 text-center">Tipos competitivos</h4>
                <p className="text-sm text-gray-100 text-center">
                  Tasas más favorables que casas de cambio tradicionales y bancos
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2 text-center">En tiempo real</h4>
                <p className="text-sm text-gray-100 text-center">
                  Cotizaciones actualizadas constantemente según el mercado
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={isAuthenticated ? "/dashboard/nueva-operacion" : "/crear-cuenta"}
              className="inline-flex items-center bg-secondary text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-secondary-700 transition shadow-xl hover:shadow-2xl"
            >
              {isAuthenticated ? "Iniciar operación" : "Abrir mi cuenta gratis"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
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
                <li><a href="/servicios#compra" className="hover:text-white transition">Compra de dólares</a></li>
                <li><a href="/servicios#venta" className="hover:text-white transition">Venta de dólares</a></li>
                <li><a href="/servicios#tipo-cambio" className="hover:text-white transition">Tipo de cambio</a></li>
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
