'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Gift, TrendingUp, Sparkles, ArrowRight, Users } from 'lucide-react';

export default function PromocionesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated]);

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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary-700 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-secondary to-secondary-700 rounded-2xl shadow-lg">
                <Gift className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Promociones</h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                Descubre beneficios exclusivos diseñados para ti
              </p>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo) => {
            const IconComponent = promo.icon;
            return (
              <div
                key={promo.id}
                onClick={() => router.push(promo.link)}
                className="group relative cursor-pointer"
              >
                {/* Compact Card */}
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-transparent h-[200px]">
                  {/* Animated Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  </div>

                  {/* Content */}
                  <div className="relative p-5 h-full flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                      {/* Tag */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 group-hover:bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold mb-3 transition-all duration-300">
                        <TrendingUp className="w-3 h-3 text-primary-600 group-hover:text-white transition-colors duration-300" />
                        <span className="text-primary-600 group-hover:text-white transition-colors duration-300">{promo.tag}</span>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 bg-gradient-to-br ${promo.gradient} group-hover:bg-white/20 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg flex-shrink-0`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-base font-black text-gray-900 group-hover:text-white transition-colors duration-300 leading-tight">
                          {promo.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-600 group-hover:text-white/80 leading-snug transition-colors duration-300 line-clamp-2">
                        {promo.description}
                      </p>
                    </div>

                    {/* Bottom section - CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 group-hover:text-white font-bold text-xs transition-colors duration-300">Ver más</span>
                      <div className="w-7 h-7 bg-primary-500 group-hover:bg-white rounded-full flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-300 shadow-md">
                        <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-primary-600 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                    boxShadow: `0 0 40px rgba(34, 197, 94, 0.6)`
                  }}></div>
                </div>

                {/* Floating shadow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-all duration-300 -z-10 transform group-hover:scale-105`}></div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Section with modern style */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-600 rounded-full text-sm font-semibold shadow-sm">
            <Sparkles className="w-5 h-5 text-gray-400 animate-pulse" />
            <span>Más promociones próximamente</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
