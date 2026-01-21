'use client';

import { useState, useEffect } from 'react';
import { Gift, Users, TrendingUp, Clock, CheckCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface ReferralStats {
  referral_code: string;
  total_referred_clients: number;
  total_completed_operations: number;
  total_pips_earned: number;
  pips_available: number;
  completed_uses: number;
  referral_history: Array<{
    operation_id: string;
    client_name: string;
    client_dni: string;
    operation_date: string;
    status: string;
    pips_earned: number;
    operation_type: string;
    amount_usd: number;
    amount_pen: number;
  }>;
  referred_clients: Array<{
    name: string;
    dni: string;
    document_type: string;
    created_at: string;
    status: string;
  }>;
}

interface ReferralBenefitsProps {
  clientDni: string;
}

export default function ReferralBenefits({ clientDni }: ReferralBenefitsProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
          Comparte este código con tus amigos. Por cada operación completada, ganas 30 pips.
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
              <li>• Por cada operación <strong>completada</strong> de tus referidos, ganas 30 pips</li>
              <li>• Los pips se acumulan automáticamente cuando la operación se completa</li>
              <li>• Podrás usarlos para obtener mejores tipos de cambio en futuras operaciones</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Historial de operaciones */}
      {stats.referral_history && stats.referral_history.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition rounded-lg"
          >
            <span className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Historial de beneficios ({stats.referral_history.length})
            </span>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showHistory && (
            <div className="px-4 pb-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {stats.referral_history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {item.client_name}
                        </span>
                        <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs font-semibold rounded">
                          +{(item.pips_earned * 10000).toFixed(0)} pips
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.operation_type} • ${item.amount_usd.toFixed(2)} • {item.operation_id}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(item.operation_date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clientes referidos */}
      {stats.referred_clients && stats.referred_clients.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 mt-4 p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Tus Referidos ({stats.referred_clients.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stats.referred_clients.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
