'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Calculator from '@/components/Calculator';
import AnimatedStat from '@/components/AnimatedStat';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import TradingViewWidget from '@/components/TradingViewWidget';
import {
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  CheckCircle2,
  Smartphone,
  Globe,
  Lock,
  UserPlus,
  Calculator as CalculatorIcon,
  Banknote,
  LogOut,
  User as UserIcon,
  ChevronDown,
  HelpCircle,
  Menu,
  X,
  Gift,
  Share2,
  Coins
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [buyRate, setBuyRate] = useState('3.750');
  const [sellRate, setSellRate] = useState('3.770');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBanksSectionVisible, setIsBanksSectionVisible] = useState(false);
  const banksSectionRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { currentRates } = useExchangeStore();

  // Punto de referencia BCRP interdiario (actualizar cuando el mercado cambie significativamente)
  const BCRP_REF = 3.39;
  const rateDirection: 'up' | 'down' | 'stable' | null = currentRates
    ? currentRates.tipo_venta > BCRP_REF + 0.005
      ? 'up'
      : currentRates.tipo_venta < BCRP_REF - 0.005
      ? 'down'
      : 'stable'
    : null;

  useEffect(() => {
    // TODO: Fetch real rates from API
    // fetchExchangeRates();
  }, []);

  // El cierre del menú al hacer clic fuera se maneja con un backdrop fixed (ver JSX)

  // Intersection Observer for banks section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsBanksSectionVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (banksSectionRef.current) {
      observer.observe(banksSectionRef.current);
    }

    return () => {
      if (banksSectionRef.current) {
        observer.unobserve(banksSectionRef.current);
      }
    };
  }, []);

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
            <Link href="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity">
              <img src="/logo-principal.png" alt="QoriCash" className="h-10 sm:h-14 md:h-16 w-auto" />
              <span className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900">
                QoriCash
              </span>
            </Link>
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/sobre-nosotros" className="text-gray-700 hover:text-primary-600 transition">
                Nosotros
              </Link>
              <a href="#como-funciona" className="text-gray-700 hover:text-primary-600 transition">
                Cómo Funciona
              </a>
              <Link href="/dashboard/promociones" className="text-gray-700 hover:text-primary-600 transition">
                Promociones
              </Link>

              {isAuthenticated ? (
                <div className="relative">
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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-3">
              <Link
                href="/sobre-nosotros"
                className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              <a
                href="#como-funciona"
                className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <Link
                href="/dashboard/promociones"
                className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Promociones
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mi perfil
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mi Dashboard
                  </Link>
                  <a
                    href="https://wa.me/51906237356?text=Hola%2C%20necesito%20ayuda%20con%20mi%20cuenta%20de%20QoriCash."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Ayuda
                  </a>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition rounded-lg"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/crear-cuenta"
                    className="block mx-4 bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition shadow-md hover:shadow-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Regístrate
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Dropdown via portal — renderiza en document.body para escapar cualquier stacking context */}
      {isUserMenuOpen && createPortal(
        <>
          <div
            className="fixed inset-0"
            style={{ zIndex: 99998 }}
            onClick={() => setIsUserMenuOpen(false)}
          />
          <div
            className="fixed right-8 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
            style={{ zIndex: 99999, top: '80px' }}
          >
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/perfil'); }}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition text-left"
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Mi perfil
            </button>
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition text-left"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Mi Dashboard
            </button>
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
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition text-left"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </>,
        document.body
      )}

      {/* Hero Section */}
      {/* Market Alert Banner */}
      {rateDirection && (
        <div className={`w-full py-2 px-4 text-center text-sm font-semibold flex items-center justify-center gap-2 ${
          rateDirection === 'up'
            ? 'bg-amber-50 text-amber-800 border-b border-amber-200'
            : rateDirection === 'down'
            ? 'bg-blue-50 text-blue-800 border-b border-blue-200'
            : 'bg-green-50 text-green-800 border-b border-green-200'
        }`}>
          {rateDirection === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              <span>El dólar está en alza hoy — Buen momento para vender tus dólares</span>
            </>
          )}
          {rateDirection === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 flex-shrink-0" />
              <span>El dólar está a la baja hoy — Buen momento para comprar dólares</span>
            </>
          )}
          {rateDirection === 'stable' && (
            <>
              <Minus className="w-4 h-4 flex-shrink-0" />
              <span>Tipo de cambio estable hoy — Tasas actualizadas en tiempo real</span>
            </>
          )}
          {currentRates && (
            <span className="ml-2 bg-white/70 px-2 py-0.5 rounded-full text-xs font-bold">
              Compra S/ {currentRates.tipo_compra.toFixed(3)} · Venta S/ {currentRates.tipo_venta.toFixed(3)}
            </span>
          )}
        </div>
      )}
      <section className="pt-20 md:pt-16 pb-0 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full relative">
          <div className="grid lg:grid-cols-12 gap-3 md:gap-6 items-center relative">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4 relative z-10 lg:pr-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                El cambio de{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  dólares
                </span>{' '}
                que siempre quisiste tener
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Personas y empresas cambian millones de soles con QoriCash. Rápido, seguro y sin sorpresas.
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
                  value={15}
                  prefix="< "
                  suffix=" min"
                  label="Tiempo de operación"
                  duration={2000}
                />
                <div>
                  <div className="text-2xl font-bold text-primary">S/ 0</div>
                  <div className="text-xs text-gray-600">Comisiones ocultas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">L–V 9–6</div>
                  <div className="text-xs text-gray-600">Sáb 9–1pm · Atención real</div>
                </div>
              </div>
            </div>

            {/* Center: Hero Image */}
            <div className="lg:col-span-4 flex items-center justify-center relative lg:-ml-20 z-20 hidden md:flex">
              <div className="relative w-full max-w-[380px] h-auto">
                <Image
                  src="/hero-visual.png"
                  alt="QoriCash Exchange"
                  width={1080}
                  height={1350}
                  className="w-full h-auto object-contain drop-shadow-2xl relative z-10 animate-float"
                  priority
                  sizes="(max-width: 1024px) 300px, 500px"
                />
              </div>
            </div>

            {/* Right Column: Calculator */}
            <div className="lg:col-span-4 relative z-30">
              <div className="w-full bg-transparent p-6 pt-4">
                <Calculator
                  initialRates={{
                    compra: parseFloat(buyRate),
                    venta: parseFloat(sellRate)
                  }}
                />
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push(isAuthenticated ? '/dashboard/nueva-operacion' : '/login')}
                    className="-mt-2 bg-primary text-white py-2 px-8 rounded-xl font-bold hover:bg-primary-600 transition shadow-md inline-flex items-center justify-center group text-sm"
                  >
                    Cambiar Ahora
                    <ArrowRight className="ml-1.5 group-hover:translate-x-1 transition w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banks Strip */}
      <section className="pt-8 pb-10 px-6 sm:px-8 lg:px-12 relative">
        <div ref={banksSectionRef} className={`max-w-5xl mx-auto ${isBanksSectionVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
          <div className="grid md:grid-cols-2 gap-5 items-stretch">

            {/* Contenedor 1 - Transferencias Inmediatas */}
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 px-6 pt-10 pb-6 hover:shadow-2xl transition-all flex flex-col">
              <div className="absolute -top-3 left-5 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md border border-green-200">
                <span className="text-xs font-bold text-green-700">✓ Transferencias Inmediatas</span>
              </div>
              <div className="flex flex-row items-center justify-center gap-6 flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full h-20 flex items-center justify-center">
                    <img src="/BCP.png" alt="BCP" className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-0.5 rounded-full">Todo el Perú</span>
                </div>
                <div className="w-px h-14 bg-gray-200 self-center shrink-0" />
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full h-20 flex items-center justify-center">
                    <img src="/Interbank.png" alt="Interbank" className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-0.5 rounded-full">Todo el Perú</span>
                </div>
              </div>
            </div>

            {/* Contenedor 2 - Interbancarias */}
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 px-6 pt-10 pb-6 hover:shadow-2xl transition-all flex flex-col">
              <div className="absolute -top-3 left-5 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md border border-blue-200">
                <span className="text-xs font-bold text-blue-700">⏱ Interbancarias ≥ 2 horas</span>
              </div>
              <div className="grid grid-cols-5 gap-3 flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-center justify-center">
                    <img src="/BBVA.png" alt="BBVA" className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-center justify-center">
                    <img src="/Scotiabank.png" alt="Scotiabank" className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-center justify-center">
                    <img src="/BanBif.png" alt="BanBif" className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-center justify-center">
                    <img src="/Banco Pichincha.png" alt="Banco Pichincha" className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-center justify-center">
                    <div className="text-xs font-bold text-gray-600 text-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 leading-snug">Otros<br/>bancos</div>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">Solo Lima</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section — Social Proof */}
      <section className="py-10 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl md:text-4xl font-display font-bold">
                <AnimatedStat value={8500} suffix="+" label="" duration={2200} />
              </div>
              <div className="text-primary-200 text-sm font-medium">Usuarios registrados</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl md:text-4xl font-display font-bold">
                <AnimatedStat value={18} prefix="S/ " suffix="M+" label="" duration={2000} />
              </div>
              <div className="text-primary-200 text-sm font-medium">Soles cambiados</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl md:text-4xl font-display font-bold">
                <AnimatedStat value={4200} suffix="+" label="" duration={2400} />
              </div>
              <div className="text-primary-200 text-sm font-medium">Operaciones completadas</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl md:text-4xl font-display font-bold">
                <AnimatedStat value={4.8} decimals={1} suffix="★" label="" duration={1500} />
              </div>
              <div className="text-primary-200 text-sm font-medium">Satisfacción de clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          COMPARISON — ¿Cuánto ahorras con QoriCash?
      ══════════════════════════════════════════════ */}
      <section className="relative py-20 bg-gray-950 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-500/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary-400 uppercase bg-primary-400/10 border border-primary-400/20 px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              Transparencia total
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              ¿Cuánto ahorras con{' '}
              <span className="bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent">QoriCash</span>?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Comparamos en tiempo real. Decide con información real, no estimaciones.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Left — savings card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-green-500/15 to-primary-500/10 border border-green-500/25 rounded-2xl p-8">
                <p className="text-green-400 text-sm font-semibold mb-3">Al vender $1,000 dólares</p>
                <div className="text-6xl md:text-7xl font-display font-bold text-white mb-1">
                  {currentRates ? `S/ ${((currentRates.tipo_compra - 3.330) * 1000).toFixed(0)}` : '—'}
                </div>
                <p className="text-gray-400 text-sm mb-8">más de lo que recibirías en un banco</p>
                <div className="space-y-3 border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Con QoriCash recibes</span>
                    {currentRates ? <span className="font-bold text-green-400 text-lg">S/ {(currentRates.tipo_compra * 1000).toFixed(2)}</span> : <div className="h-5 w-24 bg-green-900 animate-pulse rounded" />}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Banco promedio</span>
                    <span className="font-semibold text-gray-500">S/ {(3.330 * 1000).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-[11px] text-gray-500 leading-relaxed">
                * Tasas bancarias son referenciales. Las de QoriCash se actualizan en tiempo real durante el horario de atención.
              </div>
            </div>

            {/* Right — comparison rows */}
            <div className="lg:col-span-3 space-y-2.5">
              {/* Header */}
              <div className="grid grid-cols-3 px-5 pb-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div>Entidad</div>
                <div className="text-center">Compra</div>
                <div className="text-center">Venta</div>
              </div>

              {/* QoriCash */}
              <div className="relative bg-gradient-to-r from-primary-500/20 to-green-500/10 border-2 border-primary-500/40 rounded-2xl px-5 py-4 overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-bl-xl tracking-wide">MEJOR TASA ⭐</div>
                <div className="grid grid-cols-3 items-center">
                  <div className="flex items-center gap-2.5">
                    <img src="/logo-principal.png" alt="QoriCash" className="h-7 w-auto" />
                    <span className="font-bold text-white text-sm">QoriCash</span>
                  </div>
                  <div className="text-center">
                    {currentRates ? <div className="text-xl font-bold text-green-400">S/ {currentRates.tipo_compra.toFixed(3)}</div> : <div className="h-7 w-20 bg-primary-900 animate-pulse rounded mx-auto" />}
                  </div>
                  <div className="text-center">
                    {currentRates ? <div className="text-xl font-bold text-green-400">S/ {currentRates.tipo_venta.toFixed(3)}</div> : <div className="h-7 w-20 bg-primary-900 animate-pulse rounded mx-auto" />}
                  </div>
                </div>
              </div>

              {/* Banks */}
              {[
                { name: 'BCP', logo: '/BCP.png', compra: 3.340, venta: 3.440 },
                { name: 'Interbank', logo: '/Interbank.png', compra: 3.345, venta: 3.435 },
                { name: 'BBVA', logo: '/BBVA.png', compra: 3.330, venta: 3.450 },
                { name: 'Scotiabank', logo: '/Scotiabank.png', compra: 3.325, venta: 3.455 },
              ].map((bank, i) => (
                <div key={i} className="grid grid-cols-3 bg-gray-900 border border-gray-800 rounded-xl px-5 py-3.5 items-center hover:border-gray-700 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-7 flex items-center">
                      <img src={bank.logo} alt={bank.name} className="max-w-full max-h-full object-contain opacity-50 grayscale group-hover:opacity-70 transition-opacity" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">{bank.name}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-400">S/ {bank.compra.toFixed(3)}</div>
                    {currentRates && <div className="text-[10px] text-red-400 font-medium">-{((currentRates.tipo_compra - bank.compra) * 1000).toFixed(0)} por $1k</div>}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-400">S/ {bank.venta.toFixed(3)}</div>
                    {currentRates && <div className="text-[10px] text-red-400 font-medium">+{((bank.venta - currentRates.tipo_venta) * 1000).toFixed(0)} por $1k</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRADINGVIEW — Historial tipo de cambio
      ══════════════════════════════════════════ */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            {/* Left info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Mercado en vivo
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-4">
                  El dólar,<br />
                  <span className="bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">al instante</span>
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Sigue la evolución del dólar frente al sol peruano y decide el mejor momento para cambiar.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '📈', label: 'Datos en tiempo real', desc: 'Mercado Forex · USD/PEN' },
                  { icon: '🕐', label: 'Múltiples rangos', desc: '1 día · 1 mes · 1 año · Todo' },
                  { icon: '🔒', label: 'Fuente verificada', desc: 'TradingView · OANDA · FX_IDC' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-white text-sm font-semibold">{item.label}</div>
                      <div className="text-gray-500 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right chart */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-5 py-3 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-sm font-bold">USD / PEN</span>
                    {currentRates && <span className="text-gray-400 text-xs ml-1">S/ {currentRates.tipo_venta.toFixed(3)}</span>}
                  </div>
                  <span className="text-gray-500 text-xs">TradingView</span>
                </div>
                <div className="p-2">
                  <TradingViewWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — ¿Por qué elegir QoriCash?
      ══════════════════════════════════════ */}
      <section id="servicios" className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-50 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="relative w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-6">
              Nuestras ventajas
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              ¿Por qué elegir{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">QoriCash</span>?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              La plataforma de cambio de divisas más confiable del Perú
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { image: 'Seguro y Confiable.png', title: 'Seguro y Confiable', description: 'Registro SBS Res. N° 00313-2026. Verificación KYC y cifrado de extremo a extremo.', accent: 'blue', delay: '0s' },
              { image: 'Transferencia-Rapida.png', title: 'En menos de 15 min', description: 'Operaciones completadas en menos de 15 minutos. Inmediato a BCP e Interbank.', accent: 'primary', delay: '0.1s' },
              { image: 'Mejor Tipo de Cambio.png', title: 'Mejor Tipo de Cambio', description: 'Tasas actualizadas en tiempo real. Siempre por encima de los bancos.', accent: 'green', delay: '0.2s' },
              { image: 'Protegido.png', title: '100% Digital', description: 'Sin papeleos, sin colas. Opera desde tu celular o computadora en todo Perú.', accent: 'purple', delay: '0.3s' },
            ].map((feature, index) => {
              const accents: Record<string, { ring: string; bg: string; text: string; bar: string }> = {
                blue: { ring: 'hover:ring-blue-200', bg: 'bg-blue-50', text: 'text-blue-600', bar: 'from-blue-400 to-blue-600' },
                primary: { ring: 'hover:ring-primary-200', bg: 'bg-primary-50', text: 'text-primary-600', bar: 'from-primary-400 to-primary-600' },
                green: { ring: 'hover:ring-green-200', bg: 'bg-green-50', text: 'text-green-600', bar: 'from-green-400 to-green-600' },
                purple: { ring: 'hover:ring-purple-200', bg: 'bg-purple-50', text: 'text-purple-600', bar: 'from-purple-400 to-purple-600' },
              };
              const a = accents[feature.accent];
              return (
                <div key={index} className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-transparent ring-2 ring-transparent ${a.ring} transition-all duration-500 overflow-hidden flex flex-col animate-step-fade-in`} style={{ animationDelay: feature.delay }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${a.bg} to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 ${a.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <Image src={`/${feature.image}`} alt={feature.title} width={40} height={40} className="w-10 h-10 object-contain drop-shadow" priority={index < 2} />
                    </div>
                    <h3 className={`text-lg font-bold text-gray-900 mb-3 group-hover:${a.text} transition-colors duration-300`}>{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                  <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${a.bar} transition-all duration-500`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — Cambia en 3 simples pasos
      ══════════════════════════════════════ */}
      <section id="como-funciona" className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute -top-40 left-1/3 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="relative w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-6">
              Simple y rápido
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Cambia en{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                3 simples pasos
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Rápido, seguro y sin complicaciones
            </p>
          </div>

          {/* Mobile: grid de cards */}
          <div className="grid sm:grid-cols-2 gap-8 md:hidden max-w-2xl mx-auto px-4">
            {[
              { step: '01', title: 'Regístrate', description: 'Regístrate en 2 minutos con tu DNI, CE o RUC', detailedDescription: 'Proceso rápido y 100% digital. Solo necesitas tu DNI y datos básicos.', image: '/registro.png', delay: '0s' },
              { step: '02', title: 'Cotiza', description: 'Ingresa el monto y confirma el tipo de cambio', detailedDescription: 'Tipo de cambio en tiempo real, sin sorpresas ni comisiones ocultas.', image: '/cotiza.png', delay: '0.2s' },
              { step: '03', title: 'Recibe', description: 'Tu dinero llega en 10 minutos a tu cuenta', detailedDescription: 'Transferencias inmediatas a todos los bancos principales del Perú.', image: '/transfiere.png', delay: '0.4s' },
            ].map((step, index) => (
              <div key={index} className="animate-step-fade-in" style={{ animationDelay: step.delay }}>
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-white/60 p-6 h-full">
                  <div className="inline-block mb-3">
                    <span className="text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full">Paso {step.step}</span>
                  </div>
                  <div className="w-20 h-20 mx-auto mb-4">
                    <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-center bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent mb-3">{step.title}</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-3"></div>
                  <p className="text-sm text-gray-700 leading-snug text-center font-medium mb-2">{step.description}</p>
                  <p className="text-xs text-primary-600 leading-snug text-center">{step.detailedDescription}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: flex con conectores inline — los bordes del conector tocan exactamente los bordes de los círculos */}
          <div className="hidden md:flex items-center justify-center max-w-6xl mx-auto px-4">
            {[
              { step: '01', title: 'Regístrate', description: 'Regístrate en 2 minutos con tu DNI, CE o RUC', detailedDescription: 'Proceso rápido y 100% digital. Solo necesitas tu DNI y datos básicos.', image: '/registro.png', delay: '0s' },
              { step: '02', title: 'Cotiza', description: 'Ingresa el monto y confirma el tipo de cambio', detailedDescription: 'Tipo de cambio en tiempo real, sin sorpresas ni comisiones ocultas.', image: '/cotiza.png', delay: '0.2s' },
              { step: '03', title: 'Recibe', description: 'Tu dinero llega en 10 minutos a tu cuenta', detailedDescription: 'Transferencias inmediatas a todos los bancos principales del Perú.', image: '/transfiere.png', delay: '0.4s' },
            ].map((step, index) => (
              <div key={index} className={`flex items-center ${index < 2 ? 'flex-1' : 'shrink-0'}`}>

                {/* Círculo */}
                <div className="group cursor-pointer relative shrink-0 animate-step-fade-in" style={{ animationDelay: step.delay }}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/60 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden flex flex-col items-center justify-center w-56 h-56 lg:w-64 lg:h-64 border-2 border-white/60 group-hover:border-primary-300/60">
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 animate-pulse-slow" style={{ padding: '2px', zIndex: -1 }}>
                      <div className="w-full h-full rounded-full bg-white/60 backdrop-blur-md"></div>
                    </div>
                    <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-primary-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
                    <div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                    {/* Estado normal */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 group-hover:opacity-0 group-hover:scale-95">
                      <div className="mb-2">
                        <div className={`${index === 2 ? 'w-40 h-40' : 'w-36 h-36'} flex items-center justify-center animate-icon-float`} style={{ animationDelay: step.delay }}>
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-center bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent">{step.title}</h3>
                    </div>
                    {/* Estado hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 bg-white/70 backdrop-blur-md rounded-full">
                      <div className="text-center space-y-2 max-w-[200px]">
                        <div className="w-16 h-16 mx-auto mb-1">
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain drop-shadow-md opacity-80" />
                        </div>
                        <h3 className="text-base font-bold text-primary-600 mb-1">{step.title}</h3>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-2"></div>
                        <p className="text-sm text-gray-700 leading-snug px-2 font-medium">{step.description}</p>
                        <p className="text-xs text-primary-600 leading-snug px-3 mt-1">{step.detailedDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conector: flex-1 → ocupa exactamente el espacio entre bordes de círculos */}
                {index < 2 && (
                  <div className="relative flex-1 self-center" style={{ height: '2px' }}>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 opacity-40 blur-sm" />
                    {/* Línea punteada */}
                    <div className="absolute inset-0 border-t-2 border-dashed border-primary-400" />
                    {/* Punto animado — left:0% = borde izquierdo del conector = borde del círculo izquierdo */}
                    <div className={`absolute top-0 -translate-y-1/2 -translate-x-1/2 ${index === 0 ? 'animate-dot-seq-1' : 'animate-dot-seq-2'}`}>
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg" />
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary-400 animate-ping" />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REFERIDOS — Comparte y gana
      ══════════════════════════════════════ */}
      <section id="referidos" className="relative py-24 overflow-hidden bg-[#080e1a]">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px] opacity-10" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[120px] opacity-10" />
          <div className="absolute inset-0 bg-[url('/grid-white.svg')] opacity-[0.03]" />
        </div>

        <div className="relative w-full px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary-400 uppercase bg-primary-400/10 border border-primary-400/20 px-4 py-2 rounded-full mb-6">
              Programa de referidos
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Comparte y gana con{' '}
              <span className="bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
                cada amigo
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Invita a tus amigos a QoriCash. Por cada operación que completen, acumulas <strong className="text-primary-300">pips</strong> que puedes canjear por descuentos reales en tus cambios.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Share2,
                  step: '01',
                  title: 'Comparte tu código',
                  desc: 'Después de registrarte recibes tu código único. Compártelo con amigos, familia o clientes.',
                  color: 'from-primary-500 to-primary-600',
                  glow: 'shadow-primary-500/20',
                },
                {
                  icon: UserPlus,
                  step: '02',
                  title: 'Tu amigo se registra',
                  desc: 'Ingresa tu código al crear su cuenta. Sin costo, sin condiciones ocultas.',
                  color: 'from-emerald-500 to-emerald-600',
                  glow: 'shadow-emerald-500/20',
                },
                {
                  icon: Coins,
                  step: '03',
                  title: 'Ganas pips',
                  desc: 'Cada vez que tu referido complete una operación, acumulas 15 pips automáticamente.',
                  color: 'from-amber-500 to-amber-600',
                  glow: 'shadow-amber-500/20',
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  {/* Connector arrow (desktop) */}
                  {i < 2 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center group-hover:bg-white/8 group-hover:border-white/20 transition-all duration-300 shadow-xl ${item.glow}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 tracking-widest mb-2 uppercase">Paso {item.step}</span>
                    <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reward card + CTA */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Pip reward card */}
              <div className="relative bg-gradient-to-br from-primary-600 to-emerald-600 rounded-2xl p-px shadow-2xl shadow-primary-500/20">
                <div className="bg-gradient-to-br from-[#0d1b2a] to-[#0a1520] rounded-2xl p-8 text-center min-w-[260px]">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-5xl font-display font-bold bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent mb-1">30 pips</div>
                  <div className="text-sm text-gray-300 mb-4">= cupón de descuento en tu próxima operación</div>
                  <div className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    15 pips por operación · Sin límite de referidos
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-lg font-medium mb-2">¿Listo para empezar?</p>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Regístrate gratis y obtén tu código de referido en menos de 2 minutos.
                </p>
                <Link
                  href={isAuthenticated ? "/dashboard/promociones" : "/crear-cuenta"}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-bold text-sm hover:from-primary-400 hover:to-primary-500 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 group"
                >
                  {isAuthenticated ? 'Ver mi código de referido' : 'Crear cuenta y empezar a ganar'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — Comienza hoy mismo
      ══════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden bg-white">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-emerald-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-100 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative w-full px-6 sm:px-8 lg:px-12 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-8">
            Sin comisiones · Sin colas · 100% digital
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
            Comienza a cambiar{' '}
            <span className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Únete a miles de clientes que confían en QoriCash para sus cambios de divisas. Apertura gratuita, sin requisitos mínimos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isAuthenticated ? "/dashboard/nueva-operacion" : "/crear-cuenta"}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:from-primary-400 hover:to-primary-500 transition-all shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 group"
            >
              {isAuthenticated ? "Iniciar operación" : "Abrir mi cuenta gratis"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="https://wa.me/51926011920?text=Hola%2C%20quiero%20iniciar%20una%20operaci%C3%B3n%20de%20cambio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-10 py-5 rounded-full text-lg font-bold hover:border-primary-300 hover:text-primary-700 transition-all shadow-md hover:shadow-lg group"
            >
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hablar por WhatsApp
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
            {[
              { icon: Shield, label: 'Regulado SBS' },
              { icon: Lock, label: 'SSL cifrado' },
              { icon: CheckCircle2, label: 'Sin comisiones' },
              { icon: Clock, label: 'En 15 minutos' },
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <t.icon className="w-4 h-4 text-primary-400" />
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ — Todo lo que necesitas saber
      ══════════════════════════════════════ */}
      <section id="faq" className="relative py-24 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="relative w-full px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-6">
              Preguntas frecuentes
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Todo lo que necesitas saber
            </h2>
            <p className="text-gray-500 text-lg">Resolvemos tus dudas antes de empezar</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: '¿Cuánto tiempo tarda mi operación?',
                a: 'La mayoría de operaciones se completan en menos de 15 minutos. El tiempo depende de la confirmación de tu transferencia bancaria, que normalmente es inmediata entre los bancos principales del Perú.'
              },
              {
                q: '¿Es seguro cambiar dólares con QoriCash?',
                a: 'Sí. QoriCash opera con registro ante la SBS y cuenta con protocolos de verificación de identidad (KYC). Tus datos están protegidos y cada operación queda registrada con trazabilidad completa.'
              },
              {
                q: '¿Cuáles son las comisiones?',
                a: 'Ninguna. QoriCash no cobra comisiones ocultas ni cargos adicionales.'
              },
              {
                q: '¿Cuál es el monto mínimo para operar?',
                a: <span>Puedes cambiar desde S/ 100 o $30 dólares. No hay un monto máximo fijo; para operaciones grandes contáctanos por <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold underline underline-offset-2 hover:text-green-700">WhatsApp 926 011 920</a> para coordinar condiciones especiales.</span>
              },
              {
                q: '¿Con qué bancos trabajan?',
                a: 'Operamos con los principales bancos del Perú: BCP, Interbank, BBVA, Scotiabank, BanBif y Pichincha. Puedes enviar y recibir desde cualquiera de ellos.'
              },
              {
                q: '¿Cómo se determina el tipo de cambio?',
                a: 'Nuestros traders actualizan las tasas en tiempo real durante el horario de atención, siguiendo el mercado interbancario peruano. Siempre verás el tipo de cambio exacto antes de confirmar.'
              },
              {
                q: '¿Qué documentos necesito para registrarme?',
                a: 'Solo tu DNI (o CE para extranjeros, RUC para empresas), un correo electrónico y tu número de celular. La verificación de identidad se hace una sola vez antes de tu primera operación.'
              },
              {
                q: '¿Puedo operar si estoy en provincia?',
                a: 'Sí. QoriCash es 100% digital, por lo que puedes operar desde cualquier lugar del Perú siempre que tengas acceso a la banca online de tu banco para realizar la transferencia.'
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${openFaq === i ? 'border-primary-200' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <button
                  className="w-full flex items-center gap-5 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${openFaq === i ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-semibold text-gray-900 text-sm sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-primary-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pl-[72px]">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#080e1a] text-gray-400">
        {/* Top compliance bar */}
        <div className="border-b border-white/5 py-4 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-[11px] leading-tight">Empresa Registrada</div>
                  <div className="text-gray-500 text-[10px]">RUC: 20615113698 · Lima, Perú</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-[11px] leading-tight">Regulada SBS</div>
                  <div className="text-gray-500 text-[10px]">Res. N° 00313-2026</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[11px] text-gray-600">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL cifrado</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Datos protegidos por ley</span>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="w-full px-6 sm:px-8 lg:px-12 py-14">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity w-fit">
                <img src="/logo-principal.png" alt="QoriCash" className="h-11 w-auto" />
                <span className="text-2xl font-display font-bold text-white">QoriCash</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                Casa de cambio online líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.
              </p>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Servicios</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/servicios#compra" className="hover:text-white transition-colors">Compra de dólares</Link></li>
                <li><Link href="/servicios#venta" className="hover:text-white transition-colors">Venta de dólares</Link></li>
                <li><Link href="/servicios#tipo-cambio" className="hover:text-white transition-colors">Tipo de cambio</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Empresa</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
                <li><Link href="/terminos-condiciones" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
                <li><Link href="/politica-privacidad" className="hover:text-white transition-colors">Política de privacidad</Link></li>
                <li><Link href="/politica-cookies" className="hover:text-white transition-colors">Política de cookies</Link></li>
                <li><Link href="/libro-reclamaciones" className="hover:text-white transition-colors">Libro de reclamaciones</Link></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors">info@qoricash.pe</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">926 011 920</a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors leading-relaxed">
                    Av. Brasil N° 2790, Int. 504<br />Lima – Pueblo Libre
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="leading-relaxed">
                    <div>Lun – Vie: 9:00 a.m. – 6:00 p.m.</div>
                    <div>Sáb: 9:00 a.m. – 1:00 p.m.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>© 2025 QoriCash. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/terminos-condiciones" className="hover:text-gray-400 transition-colors">Términos</Link>
              <Link href="/politica-privacidad" className="hover:text-gray-400 transition-colors">Privacidad</Link>
              <Link href="/libro-reclamaciones" className="hover:text-gray-400 transition-colors">Reclamaciones</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
