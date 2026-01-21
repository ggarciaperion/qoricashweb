'use client';

import { useState, useEffect } from 'react';
import { Gift, Users, TrendingUp, Clock, CheckCircle, Copy, ChevronDown, ChevronUp, X, AlertCircle } from 'lucide-react';

interface ReferralStats {
  referral_code: string;
  total_referred_clients: number;
  total_completed_operations: number;
  total_pips_earned: number;
  pips_available: number;
  completed_uses: number;
  referred_clients: Array<{
    name: string;
    dni: string;
    document_type: string;
    created_at: string;
    status: string;
    operation_status: string;
    operation_date: string;
  }>;
}

interface ReferralBenefitsProps {
  clientDni: string;
}

export default function ReferralBenefits({ clientDni }: ReferralBenefitsProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const PIPS_REQUIRED = 30;

  useEffect(() => {
    loadReferralStats();
  }, [clientDni]);

  const loadReferralStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/referrals/stats/${clientDni}`
      );
      const data = await response.json();

      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyCouponCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const handleGenerateCoupon = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/referrals/generate-reward-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ client_dni: clientDni }),
        }
      );

      const data = await response.json();

      if (data.success && data.reward_code) {
        setGeneratedCode(data.reward_code.code);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        // Recargar estadísticas para actualizar pips disponibles
        loadReferralStats();
      } else {
        alert(data.message || 'Error al generar el cupón');
      }
    } catch (error) {
      console.error('Error generating coupon:', error);
      alert('Error al generar el cupón. Por favor intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-success-50 to-primary-50 rounded-xl shadow-md border-2 border-success-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-success-100 rounded-lg">
          <Gift className="w-6 h-6 text-success-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Programa de Referidos</h3>
          <p className="text-sm text-gray-600">Gana beneficios por cada amigo que refiere</p>
        </div>
      </div>

      {/* Código de referido */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-success-200">
        <label className="block text-xs font-semibold text-gray-600 mb-2">
          TU CÓDIGO DE REFERIDO
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 font-mono text-2xl font-bold text-success-600 tracking-wider border-2 border-dashed border-success-300">
            {stats.referral_code}
          </div>
          <button
            onClick={copyReferralCode}
            className="px-4 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition flex items-center gap-2 font-semibold shadow-md"
          >
            <Copy className="w-5 h-5" />
            {copiedCode ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Comparte este código con tus amigos. Por cada operación completada, ganas 15 pips.
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-semibold text-gray-600">REFERIDOS</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total_referred_clients}</div>
          <div className="text-xs text-gray-500 mt-1">Clientes totales</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-success-600" />
            <span className="text-xs font-semibold text-gray-600">OPERACIONES</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.completed_uses}</div>
          <div className="text-xs text-gray-500 mt-1">Completadas</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-xs font-semibold text-gray-600">GANADOS</span>
          </div>
          <div className="text-2xl font-bold text-success-600">
            {(stats.total_pips_earned * 10000).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Pips totales</div>
        </div>

        <div className="bg-success-100 rounded-lg p-4 border-2 border-success-300">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-success-600" />
            <span className="text-xs font-semibold text-success-700">DISPONIBLE</span>
          </div>
          <div className="text-2xl font-bold text-success-600">
            {(stats.pips_available * 10000).toFixed(0)}
          </div>
          <div className="text-xs text-success-600 mt-1 font-semibold">Pips para usar</div>

          {/* Botón para generar cupón */}
          {(stats.pips_available * 10000) >= PIPS_REQUIRED && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="mt-3 w-full px-3 py-2 bg-success-600 hover:bg-success-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-md"
            >
              <Gift className="w-4 h-4" />
              Generar cupón
            </button>
          )}
        </div>
      </div>

      {/* Beneficio explicado */}
      <div className="bg-success-100 rounded-lg p-4 mb-4 border border-success-300">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-success-200 rounded-lg">
            <TrendingUp className="w-5 h-5 text-success-700" />
          </div>
          <div>
            <h4 className="font-bold text-success-900 mb-1">¿Cómo funciona?</h4>
            <ul className="text-sm text-success-800 space-y-1">
              <li>• Por cada operación <strong>completada</strong> de tus referidos, ganas 15 pips</li>
              <li>• Los pips se acumulan automáticamente cuando la operación se completa</li>
              <li>• Acumula 30 pips para generar un cupón de descuento</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clientes referidos con paginación */}
      {stats.referred_clients && stats.referred_clients.length > 0 && (() => {
        const totalPages = Math.ceil(stats.referred_clients.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedClients = stats.referred_clients.slice(startIndex, endIndex);

        return (
          <div className="bg-white rounded-lg border border-gray-200 mt-4 p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tus Referidos ({stats.referred_clients.length})
            </h4>

            <div className="space-y-3">
              {paginatedClients.map((client, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500">
                        {client.document_type}: {client.dni}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        client.status === 'Activo'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 ${
                        client.operation_status === 'Completada'
                          ? 'text-success-600'
                          : client.operation_status === 'Cancelada'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`} />
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-semibold ${
                        client.operation_status === 'Completada'
                          ? 'text-success-600'
                          : client.operation_status === 'Cancelada'
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}>
                        {client.operation_status || 'Sin operación'}
                      </span>
                    </div>
                    {client.operation_date && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600">Usado:</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(client.operation_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition ${
                        currentPage === page
                          ? 'bg-success-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Estás seguro de generar este cupón?
                </h3>
                <p className="text-sm text-gray-600">
                  Al confirmar, se descontarán <strong>{PIPS_REQUIRED} pips</strong> de tu acumulado y se generará un código promocional único para usar en tu próxima operación.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pips actuales:</span>
                <span className="font-bold text-gray-900">{(stats!.pips_available * 10000).toFixed(0)} pips</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Después del canje:</span>
                <span className="font-bold text-success-600">{((stats!.pips_available * 10000) - PIPS_REQUIRED).toFixed(0)} pips</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                disabled={isGenerating}
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateCoupon}
                disabled={isGenerating}
                className="flex-1 px-4 py-2.5 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Código Generado */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-success-100 rounded-full">
                  <Gift className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    ¡Cupón generado exitosamente!
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Tu código promocional está listo para usar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-success-50 to-primary-50 border-2 border-success-300 rounded-xl p-4 mb-4">
              <label className="block text-xs font-semibold text-success-700 mb-2">
                TU CÓDIGO PROMOCIONAL
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white rounded-lg px-4 py-3 font-mono text-xl font-bold text-success-600 tracking-wider border-2 border-dashed border-success-400 text-center">
                  {generatedCode}
                </div>
                <button
                  onClick={copyCouponCode}
                  className="px-4 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition flex items-center gap-2 font-semibold shadow-md"
                >
                  <Copy className="w-5 h-5" />
                  {copiedCoupon ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Importante:</p>
                  <p>Guarda este código o escríbelo en un lugar seguro para usarlo en tu próxima operación. Este código es de un solo uso.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-2.5 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-lg transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
