'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/Calculator';
import AnimatedStat from '@/components/AnimatedStat';
import { useAuthStore } from '@/lib/store';
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
  Zap,
  UserPlus,
  Calculator as CalculatorIcon,
  Banknote,
  LogOut,
  User as UserIcon,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // TODO: Fetch real rates from API
    // fetchExchangeRates();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <nav className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <img src="/logo-principal.png" alt="QoriCash" className="h-16 w-auto" />
              <span className="text-3xl font-display font-bold text-gray-900">
                QoriCash
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/sobre-nosotros" className="text-gray-700 hover:text-primary-600 transition">
                Nosotros
              </Link>
              <a href="#como-funciona" className="text-gray-700 hover:text-primary-600 transition">
                Cómo Funciona
              </a>
              {isAuthenticated ? (
                <Link href="/dashboard/promociones" className="text-gray-700 hover:text-primary-600 transition">
                  Promociones
                </Link>
              ) : (
                <a href="#promociones" className="text-gray-700 hover:text-primary-600 transition">
                  Promociones
                </a>
              )}

              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition group"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">
                      {user?.document_type === 'RUC'
                        ? user?.razon_social || user?.nombres
                        : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        href="/perfil"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon className="w-5 h-5 mr-3" />
                        Mi perfil
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <TrendingUp className="w-5 h-5 mr-3" />
                        Mi Dashboard
                      </Link>
                      <a
                        href="https://wa.me/51906237356?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HelpCircle className="w-5 h-5 mr-3" />
                        Ayuda
                      </a>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/crear-cuenta"
                    className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition shadow-md hover:shadow-lg"
                  >
                    Regístrate
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-0 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full relative">
          <div className="grid lg:grid-cols-12 gap-3 items-center relative">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-4 space-y-4 relative z-10 lg:pr-4">
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                Cambia{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  dólares
                </span>{' '}
                al mejor precio
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Compra y vende dólares de forma segura, rápida y con los mejores tipos de cambio del mercado peruano.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/crear-cuenta')}
                  className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-full text-base font-bold hover:bg-primary-600 transition shadow-lg hover:shadow-xl group"
                >
                  Empezar Ahora
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition w-4 h-4" />
                </button>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3 rounded-full text-base font-semibold hover:bg-primary-50 transition"
                >
                  Ver cómo funciona
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <AnimatedStat
                  value={10}
                  suffix="k+"
                  label="Clientes"
                  duration={2500}
                />
                <AnimatedStat
                  value={50}
                  prefix="$"
                  suffix="M+"
                  label="Cambiados"
                  duration={2500}
                />
                <AnimatedStat
                  value={4.9}
                  suffix="/5"
                  label="Calificación"
                  decimals={1}
                  duration={2500}
                />
              </div>
            </div>

            {/* Center: Hero Image (Overlapping to the left) */}
            <div className="lg:col-span-4 flex items-center justify-center relative lg:-ml-20 z-20">
              <div className="relative" style={{ width: '700px', height: '750px' }}>
                <img
                  src="/hero-visual.png"
                  alt="QoriCash Exchange"
                  className="w-full h-full object-contain drop-shadow-2xl relative z-10 animate-float"
                  style={{ minWidth: '800px', minHeight: '750px' }}
                />
              </div>
            </div>

            {/* Right Column: Calculator (More Width) */}
            <div className="lg:col-span-4 relative z-30">
              <Calculator
                initialRates={{
                  compra: parseFloat(buyRate),
                  venta: parseFloat(sellRate)
                }}
              />

              <button
                onClick={() => router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/login')}
                className="w-full mt-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition shadow-md flex items-center justify-center group text-sm"
              >
                Cambiar Ahora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition w-4 h-4" />
              </button>

              {/* CTA Tasa Preferencial */}
              <a
                href="https://wa.me/51906237356?text=Hola%2C%20quiero%20mi%20tasa%20preferencial%20para%20una%20operaci%C3%B3n%20de%20cambio%20mayor%20a%20USD%203%2C000."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-3 group"
              >
                <div className="relative bg-gradient-to-r from-green-50 to-primary-50 border-2 border-primary-300 rounded-lg p-3 hover:shadow-lg hover:border-primary-500 transition-all duration-300 overflow-hidden">
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary animate-pulse" fill="currentColor" />
                      <span className="text-sm font-bold text-gray-800">
                        Tasa preferencial +$3,000
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-semibold text-xs">
                      <span>WhatsApp</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Banks Strip */}
      <section className="pt-8 pb-10 px-6 sm:px-8 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contenedor 1 - Transferencias inmediatas */}
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 py-5 px-6 hover:shadow-2xl transition-all">
              <div className="absolute -top-2.5 left-6 bg-gradient-to-r from-green-50 to-primary-50 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-green-200">
                <span className="text-xs font-bold text-green-700">✓ Transferencias Inmediatas</span>
              </div>

              <div className="flex flex-row flex-nowrap items-center gap-4 pt-2">
                <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-28 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <img src="/BCP.png" alt="BCP" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-green-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">Todo el Perú</div>
                </div>
                <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-28 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <img src="/Interbank.png" alt="Interbank" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-green-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">Todo el Perú</div>
                </div>
                <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-28 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <img src="/BanBif.png" alt="BanBif" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-yellow-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</div>
                </div>
                <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-32 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <img src="/Banco Pichincha.png" alt="Banco Pichincha" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-yellow-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</div>
                </div>
              </div>
            </div>

            {/* Contenedor 2 - Transferencias Interbancarias */}
            <div className="relative flex-shrink-0 w-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 py-5 px-6 hover:shadow-2xl transition-all">
              <div className="absolute -top-2.5 left-6 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-blue-200">
                <span className="text-xs font-bold text-blue-700">⏱ Interbancarias ≥ 2 horas</span>
              </div>

              <div className="flex flex-row flex-nowrap items-center gap-4 pt-2">
                <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-28 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <img src="/BBVA.png" alt="BBVA" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-yellow-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</div>
                </div>
                <div className="text-center flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-28 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                    <img src="/Scotiabank.png" alt="Scotiabank" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-xs font-semibold text-gray-700 bg-yellow-50/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</div>
                </div>
                <div className="text-center bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm flex flex-col items-center gap-1 flex-shrink-0 border border-white/60">
                  <div className="text-sm font-bold text-gray-800 whitespace-nowrap">Otros bancos</div>
                  <div className="text-xs font-semibold text-gray-700 bg-yellow-50/80 px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicios" className="py-12 bg-white/60 backdrop-blur-sm">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent mb-6"></div>

            <div className="inline-block relative pt-8">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-primary-500/20 to-primary-400/20 blur-3xl"></div>

              <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 relative">
                <span className="text-gray-900">¿Por qué elegir </span>
                <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary bg-clip-text text-transparent">
                  QoriCash
                </span>
                <span className="text-gray-900">?</span>
              </h2>
            </div>

            {/* Subtitle with icon */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-400"></div>
              <p className="text-xl text-gray-600 max-w-2xl">
                Te ofrecemos la mejor experiencia en cambio de divisas con seguridad garantizada
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-400"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                image: 'Seguro y Confiable.png',
                title: 'Seguro y Confiable',
                description: 'Plataforma certificada con los más altos estándares de seguridad',
                gradient: 'from-blue-500 to-blue-600',
                delay: '0s',
                size: { width: 128, height: 128, className: 'w-32 h-32' }
              },
              {
                image: 'Transferencia Rápida.png',
                title: 'Transferencia Rápida',
                description: 'Recibe tu dinero en minutos, sin complicaciones',
                gradient: 'from-primary-500 to-primary-600',
                delay: '0.1s',
                size: { width: 128, height: 128, className: 'w-32 h-32' }
              },
              {
                image: 'Mejor Tipo de Cambio.png',
                title: 'Mejor Tipo de Cambio',
                description: 'Tasas competitivas actualizadas en tiempo real',
                gradient: 'from-green-500 to-green-600',
                delay: '0.2s',
                size: { width: 128, height: 128, className: 'w-32 h-32' }
              },
              {
                image: 'Protegido.png',
                title: '100% Protegido',
                description: 'Tus datos y transacciones completamente cifrados',
                gradient: 'from-purple-500 to-purple-600',
                delay: '0.3s',
                size: { width: 128, height: 128, className: 'w-32 h-32' }
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-step-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>

                {/* Main card */}
                <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-2 border-gray-100 group-hover:border-primary-200 overflow-hidden h-full flex flex-col">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Illustration container */}
                  <div className="relative mb-6 flex items-center justify-center">
                    <div className={`relative ${feature.size.className} transform group-hover:scale-110 transition-all duration-500`}>
                      <Image
                        src={`/${feature.image}`}
                        alt={feature.title}
                        width={feature.size.width}
                        height={feature.size.height}
                        className="w-full h-full object-contain drop-shadow-lg"
                        priority={index < 2}
                      />
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-primary-600 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm text-center group-hover:text-gray-700 transition-colors duration-500">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-500 rounded-b-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-12 overflow-hidden">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 relative">
            {/* Decorative top line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>

            <div className="inline-block relative pt-8">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-primary-500/20 to-primary-400/20 blur-3xl"></div>

              <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 relative">
                <span className="text-gray-900">Cambia en </span>
                <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary bg-clip-text text-transparent">
                  3 simples pasos
                </span>
              </h2>
            </div>

            {/* Subtitle with decorative lines */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-400"></div>
              <p className="text-xl text-gray-600">
                Rápido, seguro y sin complicaciones
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-400"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-20 lg:gap-32 relative max-w-7xl mx-auto px-4">
            {[
              {
                step: '01',
                title: 'Regístrate',
                description: 'Regístrate en 2 minutos con tu DNI, CE o RUC',
                detailedDescription: 'Proceso rápido y 100% digital. Solo necesitas tu DNI y datos básicos.',
                image: '/registro.png',
                delay: '0s',
                gradient: 'from-primary-500 to-primary-600'
              },
              {
                step: '02',
                title: 'Cotiza',
                description: 'Ingresa el monto y confirma el tipo de cambio',
                detailedDescription: 'Tipo de cambio en tiempo real, sin sorpresas ni comisiones ocultas.',
                image: '/cotiza.png',
                delay: '0.2s',
                gradient: 'from-blue-500 to-primary-500'
              },
              {
                step: '03',
                title: 'Recibe',
                description: 'Tu dinero llega en 10 minutos a tu cuenta',
                detailedDescription: 'Transferencias inmediatas a todos los bancos principales del Perú.',
                image: '/transfiere.png',
                delay: '0.4s',
                gradient: 'from-primary-600 to-secondary'
              }
            ].map((step, index) => (
              <div key={index} className="relative animate-step-fade-in flex items-center justify-center" style={{ animationDelay: step.delay }}>
                <div className="group cursor-pointer relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500"></div>

                  {/* Main circle */}
                  <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-full aspect-square shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden flex flex-col items-center justify-center w-80 h-80 border-2 border-gray-100 group-hover:border-primary-300">
                    {/* Animated gradient border on hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 animate-pulse-slow" style={{ padding: '2px', zIndex: -1 }}>
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-50"></div>
                    </div>

                    {/* Floating particles decoration */}
                    <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                    <div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>

                    {/* Default state: Image and Title */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-500 group-hover:opacity-0 group-hover:scale-95">
                      {/* Image icon */}
                      <div className="mb-6 transform">
                        <div className={`${index === 2 ? 'w-56 h-56' : 'w-48 h-48'} flex items-center justify-center animate-icon-float`} style={{ animationDelay: step.delay }}>
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 text-center">
                        {step.title}
                      </h3>
                    </div>

                    {/* Hover state: Full description overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 bg-gradient-to-br from-white to-gray-50 rounded-full">
                      <div className="text-center space-y-2 max-w-[240px]">
                        {/* Icon on hover (smaller) */}
                        <div className="w-24 h-24 mx-auto mb-2 transform transition-transform duration-500">
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-md opacity-80" />
                        </div>

                        {/* Title on hover */}
                        <h3 className="text-lg font-bold text-primary-600 mb-1">
                          {step.title}
                        </h3>

                        {/* Divider */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-2"></div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 leading-snug px-2 font-medium">
                          {step.description}
                        </p>

                        {/* Detailed description */}
                        <p className="text-xs text-primary-600 leading-snug px-3 mt-1">
                          {step.detailedDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced animated connector between steps */}
                {index < 2 && (
                  <div className="hidden lg:block absolute left-full z-10 px-4" style={{ width: '100%', top: '50%' }}>
                    {/* Glow line */}
                    <div className="absolute inset-0 flex items-center px-4">
                      <div className="w-full h-1 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 opacity-30 blur-sm"></div>
                    </div>
                    {/* Dashed line */}
                    <div className="absolute inset-0 flex items-center px-4">
                      <div className="w-full border-t-2 border-dashed border-primary-400"></div>
                    </div>
                    {/* Moving dot with trail */}
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 animate-dot-travel" style={{ animationDelay: `${index * 0.5}s` }}>
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg"></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary-400 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-secondary to-secondary-700">
        <div className="w-full px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Comienza a cambiar hoy mismo
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de clientes que confían en QoriCash para sus cambios de divisas
          </p>
          <Link
            href={isAuthenticated ? "/dashboard/nueva-operacion" : "/crear-cuenta"}
            className="inline-flex items-center bg-primary text-secondary px-10 py-5 rounded-full text-lg font-bold hover:bg-primary-600 transition shadow-xl hover:shadow-2xl group"
          >
            {isAuthenticated ? "Iniciar operación" : "Abrir mi cuenta gratis"}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
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
