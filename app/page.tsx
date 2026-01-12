'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/Calculator';
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
  User as UserIcon
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');

  useEffect(() => {
    // TODO: Fetch real rates from API
    // fetchExchangeRates();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
              <a href="#servicios" className="text-gray-700 hover:text-primary-600 transition">Servicios</a>
              <a href="#como-funciona" className="text-gray-700 hover:text-primary-600 transition">Cómo Funciona</a>
              <a href="#nosotros" className="text-gray-700 hover:text-primary-600 transition">Nosotros</a>

              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition font-medium">
                    Mi Dashboard
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">{user?.nombres || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-gray-700 hover:text-red-600 transition"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/crear-cuenta"
                    className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition shadow-md hover:shadow-lg"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full relative">
          <div className="grid lg:grid-cols-12 gap-4 items-center relative">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-5 space-y-8 relative z-10 lg:pr-8">
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
                  href="/crear-cuenta"
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

            {/* Center: Hero Image (Overlapping to the left) */}
            <div className="lg:col-span-3 flex items-center justify-center relative lg:-ml-24 z-20">
              <div className="relative">
                <img
                  src="/hero-visual.png"
                  alt="QoriCash Exchange"
                  className="w-full h-auto max-w-lg drop-shadow-2xl relative z-10 animate-float"
                />
              </div>
            </div>

            {/* Right Column: Calculator (More Width) */}
            <div className="lg:col-span-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative z-10 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center justify-end">
                  <div className="flex items-center text-green-600 text-sm font-semibold">
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse mr-2"></div>
                    En vivo
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 text-center">
                  Tipo de cambio hoy en QoriCash
                </h3>
              </div>

              <Calculator
                initialRates={{
                  compra: parseFloat(buyRate),
                  venta: parseFloat(sellRate)
                }}
              />

              <button
                onClick={() => router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/login')}
                className="w-full mt-4 bg-primary text-secondary py-4 rounded-xl font-bold hover:bg-primary-600 transition shadow-md flex items-center justify-center group text-base"
              >
                Cambiar Ahora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition w-5 h-5" />
              </button>

              <p className="text-sm text-center text-gray-500 mt-3">
                Tipos de cambio en tiempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banks Strip */}
      <section className="pb-16 px-6 sm:px-8 lg:px-12">
        <div className="w-full mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg border border-gray-200 py-10 px-12">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
              {/* Left: 15 min icon */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-[5px] border-gray-800 flex items-center justify-center animate-pulse-border">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">10</div>
                      <div className="text-sm font-semibold text-gray-600">MIN.</div>
                    </div>
                  </div>
                  {/* Dots around circle */}
                  <div className="absolute -top-1 left-1/2 w-2.5 h-2.5 bg-gray-800 rounded-full animate-dot-1"></div>
                  <div className="absolute top-4 -right-1 w-2.5 h-2.5 bg-gray-800 rounded-full animate-dot-2"></div>
                  <div className="absolute bottom-4 -right-1 w-2.5 h-2.5 bg-gray-800 rounded-full animate-dot-3"></div>
                  <div className="absolute -bottom-1 left-1/2 w-2.5 h-2.5 bg-gray-800 rounded-full animate-dot-4"></div>
                  <div className="absolute bottom-4 -left-1 w-2.5 h-2.5 bg-gray-800 rounded-full animate-dot-5"></div>
                  <div className="absolute top-4 -left-1 w-2.5 h-2.5 bg-gray-800 rounded-full animate-dot-6"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  Transferencias<br/>Inmediatas
                </h3>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-20 bg-gray-300"></div>

              {/* Banks logos */}
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">BCP</div>
                  <div className="text-sm text-gray-600">Todo el Perú</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">Interbank</div>
                  <div className="text-sm text-gray-600">Todo el Perú</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">BanBif</div>
                  <div className="text-sm text-gray-600">Solo Lima</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-500 flex items-center gap-1">
                    <span className="text-3xl">▐</span>
                    <div>
                      <div className="text-xs leading-none">BANCO</div>
                      <div className="text-base font-bold leading-tight">PICHINCHA</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Solo Lima</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">BBVA</div>
                  <div className="text-sm text-gray-600">Solo Lima</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">Scotiabank</div>
                  <div className="text-sm text-gray-600">Solo Lima</div>
                </div>
                <div className="text-center bg-gray-100 px-5 py-3 rounded-lg">
                  <div className="text-base font-semibold text-gray-700">otros bancos</div>
                  <div className="text-sm text-gray-600">Solo Lima</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicios" className="py-20 bg-white">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Seguro y Confiable',
                description: 'Plataforma certificada con los más altos estándares de seguridad',
                gradient: 'from-blue-500 to-blue-600',
                delay: '0s'
              },
              {
                icon: Zap,
                title: 'Transferencia Rápida',
                description: 'Recibe tu dinero en minutos, sin complicaciones',
                gradient: 'from-primary-500 to-primary-600',
                delay: '0.1s'
              },
              {
                icon: TrendingUp,
                title: 'Mejor Tipo de Cambio',
                description: 'Tasas competitivas actualizadas en tiempo real',
                gradient: 'from-green-500 to-green-600',
                delay: '0.2s'
              },
              {
                icon: Lock,
                title: '100% Protegido',
                description: 'Tus datos y transacciones completamente cifrados',
                gradient: 'from-purple-500 to-purple-600',
                delay: '0.3s'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-step-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>

                {/* Main card */}
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-2 border-gray-100 group-hover:border-primary-200 overflow-hidden h-full">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Icon container with gradient background */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-gray-700 group-hover:text-primary-600 transition-colors duration-500" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-500">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-primary-50 to-blue-50 overflow-hidden">
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

                  {/* Step number above circle */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center relative">
                      {/* Circular background with gradient border */}
                      <div className="relative">
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

                        {/* Main circle with gradient border */}
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-1 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                          {/* Inner white circle */}
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                              {step.step}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                        <div className={`${index === 2 ? 'w-48 h-48' : 'w-40 h-40'} flex items-center justify-center animate-icon-float`} style={{ animationDelay: step.delay }}>
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 text-center">
                        {step.title}
                      </h3>
                    </div>

                    {/* Hover state: Full description overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 bg-gradient-to-br from-white to-gray-50 rounded-full">
                      <div className="text-center space-y-4">
                        {/* Icon on hover (smaller) */}
                        <div className="w-24 h-24 mx-auto mb-4 transform transition-transform duration-500">
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-md opacity-80" />
                        </div>

                        {/* Title on hover */}
                        <h3 className="text-xl font-bold text-primary-600 mb-3">
                          {step.title}
                        </h3>

                        {/* Divider */}
                        <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 leading-relaxed px-4 font-medium">
                          {step.description}
                        </p>

                        {/* Detailed description */}
                        <p className="text-xs text-primary-600 leading-relaxed px-6 mt-3">
                          {step.detailedDescription}
                        </p>
                      </div>
                    </div>

                    {/* Step badge with gradient */}
                    <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 z-20`}>
                      <span className="text-white font-bold text-xl">{step.step}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced animated connector between steps */}
                {index < 2 && (
                  <div className="hidden lg:block absolute left-full z-10 px-4" style={{ width: '100%', top: 'calc(50% + 3rem)' }}>
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
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-700">
        <div className="w-full px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Comienza a cambiar hoy mismo
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de peruanos que confían en QoriCash para sus cambios de divisas
          </p>
          <Link
            href="/crear-cuenta"
            className="inline-flex items-center bg-primary text-secondary px-10 py-5 rounded-full text-lg font-bold hover:bg-primary-600 transition shadow-xl hover:shadow-2xl group"
          >
            Abrir mi cuenta gratis
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
