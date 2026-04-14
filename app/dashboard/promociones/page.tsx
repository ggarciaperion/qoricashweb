'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { Gift, TrendingUp, Sparkles, ArrowRight, Users, Plus, User, ChevronDown, LogOut, HelpCircle } from 'lucide-react';

export default function PromocionesPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { currentRates } = useExchangeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // Permitir acceso sin autenticación
    setIsLoading(false);
  }, []);

  // El cierre del menú al hacer clic fuera se maneja con un backdrop fixed (ver JSX)

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const promotions = [
    {
      id: 'referral-program',
      icon: Users,
      tag: 'Promoción',
      title: 'Código de referido',
      description: 'Comparte tu código y gana beneficios por cada operación completada',
      gradient: 'from-primary-500 to-primary-600',
      link: '/dashboard/promociones/codigo-referido',
      benefits: ['15 pips por operación', 'Cupones de descuento', 'Sin límite de referidos']
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
                <img src="/logo-principal.png" alt="QoriCash" className="h-12 w-auto" />
                <span className="text-xl font-bold text-gray-900 group-hover:text-secondary transition">
                  QoriCash
                </span>
              </Link>
            </div>

            {/* Exchange Rates */}
            {currentRates && isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">En vivo</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg">
                    <span className="text-gray-600">Compra:</span>
                    <span className="font-bold text-green-600">S/ {currentRates.tipo_compra?.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">Venta:</span>
                    <span className="font-bold text-blue-600">S/ {currentRates.tipo_venta?.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* User Menu o Login Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-secondary transition group"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline-block text-sm font-medium">
                      {user?.razon_social
                        ? user?.razon_social
                        : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/crear-cuenta"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown outside header to escape backdrop-blur-md stacking context */}
      {isUserMenuOpen && (
        <>
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={() => setIsUserMenuOpen(false)}
          />
          <div
            className="fixed right-4 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
            style={{ zIndex: 9999, top: '64px' }}
          >
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/perfil'); }}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition text-left"
            >
              <User className="w-5 h-5 mr-3" />
              Mi Perfil
            </button>
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard'); }}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition text-left"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => { setIsUserMenuOpen(false); router.push('/dashboard/promociones'); }}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition text-left"
            >
              <Gift className="w-5 h-5 mr-3" />
              Promociones
            </button>
            <a
              href="https://wa.me/51960826862"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-secondary/5 hover:text-secondary transition"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Soporte
            </a>
            <div className="border-t border-gray-200 my-2" />
            <button
              onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition text-left"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-md">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Promociones
              </h1>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              Descubre beneficios exclusivos diseñados para ti
            </p>
          </div>

          {/* Botón Nueva Operación - A la derecha del título */}
          {isAuthenticated && (
            <button
              onClick={() => router.push('/dashboard/nueva-operacion')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva operación</span>
            </button>
          )}
        </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => {
              const IconComponent = promo.icon;
              return (
                <div
                  key={promo.id}
                  onClick={() => router.push(promo.link)}
                  className="group relative cursor-pointer"
                >
                  {/* Compact Card con fondo semi-transparente */}
                  <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-primary-400">
                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>

                    {/* Content */}
                    <div className="relative p-5">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${promo.gradient} group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md flex-shrink-0`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-white transition-colors duration-300 leading-tight">
                            {promo.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-300 mb-4">
                        {promo.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-primary-600 group-hover:text-white font-semibold text-sm transition-colors duration-300">
                        <span>Ver detalles</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Section with modern style */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-gray-200 text-gray-600 rounded-full text-sm font-medium shadow-md">
            <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
            <span>Más promociones próximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
