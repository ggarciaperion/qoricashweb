'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import ReferralBenefits from '@/components/ReferralBenefits';
import { ArrowLeft, Users, Gift } from 'lucide-react';

export default function CodigoReferidoPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/promociones')}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver a Promociones</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Código de Referido</h1>
          </div>
          <p className="text-gray-600 ml-14">
            Comparte tu código y gana beneficios por cada operación completada
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cómo funciona?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">1.</span>
                  <span>Comparte tu código único con amigos y familiares</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">2.</span>
                  <span>Ellos usan tu código al crear su primera operación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">3.</span>
                  <span>Ganas <strong>15 pips</strong> por cada operación que completen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">4.</span>
                  <span>Acumula <strong>30 pips</strong> para generar un cupón de descuento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Referral Benefits Component */}
        {user?.dni && <ReferralBenefits clientDni={user.dni} />}
      </div>
    </DashboardLayout>
  );
}
