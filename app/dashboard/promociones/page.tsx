'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Gift, Sparkles, ArrowRight, Users, Plus } from 'lucide-react';

export default function PromocionesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Permitir acceso sin autenticación
    setIsLoading(false);
  }, []);

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
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Header */}
        <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-md">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Promociones
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 ml-9 sm:ml-11">
              Descubre beneficios exclusivos diseñados para ti
            </p>
          </div>

          {/* Botón Nueva Operación */}
          {isAuthenticated && (
            <button
              onClick={() => router.push('/dashboard/nueva-operacion')}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
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
