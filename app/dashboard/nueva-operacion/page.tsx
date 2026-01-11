'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { operationsApi, banksApi } from '@/lib/api';
import type { BankAccount } from '@/lib/types';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calculator,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function NuevaOperacionPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { currentRates, fetchRates, calculateExchange, isConnected } = useExchangeStore();

  // Form state
  const [tipo, setTipo] = useState<'compra' | 'venta'>('compra');
  const [montoSoles, setMontoSoles] = useState('');
  const [montoDolares, setMontoDolares] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeInput, setActiveInput] = useState<'soles' | 'dolares'>('soles');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadInitialData();
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch rates and bank accounts in parallel
      await fetchRates();
      const accountsResponse = await banksApi.getMyAccounts();

      if (accountsResponse.success && accountsResponse.data) {
        setBankAccounts(accountsResponse.data);

        // Auto-select primary account if exists
        const primaryAccount = accountsResponse.data.find(acc => acc.is_primary);
        if (primaryAccount) {
          setSelectedAccount(primaryAccount.id);
        } else if (accountsResponse.data.length > 0) {
          setSelectedAccount(accountsResponse.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Error al cargar los datos iniciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMontoSolesChange = async (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    if ((cleanValue.match(/\./g) || []).length > 1) return;

    setMontoSoles(cleanValue);
    setActiveInput('soles');

    if (!cleanValue || parseFloat(cleanValue) <= 0) {
      setMontoDolares('');
      return;
    }

    // Calculate dollars
    setIsCalculating(true);
    try {
      const result = await calculateExchange({
        tipo,
        monto: parseFloat(cleanValue),
        moneda: 'soles',
      });

      if (result) {
        setMontoDolares(result.monto_calculado.toFixed(2));
      }
    } catch (error) {
      console.error('Error calculating exchange:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleMontoDolaresChange = async (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    if ((cleanValue.match(/\./g) || []).length > 1) return;

    setMontoDolares(cleanValue);
    setActiveInput('dolares');

    if (!cleanValue || parseFloat(cleanValue) <= 0) {
      setMontoSoles('');
      return;
    }

    // Calculate soles
    setIsCalculating(true);
    try {
      const result = await calculateExchange({
        tipo,
        monto: parseFloat(cleanValue),
        moneda: 'dolares',
      });

      if (result) {
        setMontoSoles(result.monto_calculado.toFixed(2));
      }
    } catch (error) {
      console.error('Error calculating exchange:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleTipoChange = async (newTipo: 'compra' | 'venta') => {
    setTipo(newTipo);

    // Recalculate with new tipo if we have a value
    if (activeInput === 'soles' && montoSoles) {
      await handleMontoSolesChange(montoSoles);
    } else if (activeInput === 'dolares' && montoDolares) {
      await handleMontoDolaresChange(montoDolares);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!montoSoles || parseFloat(montoSoles) <= 0) {
      setError('Ingresa un monto válido en soles');
      return;
    }

    if (!montoDolares || parseFloat(montoDolares) <= 0) {
      setError('Ingresa un monto válido en dólares');
      return;
    }

    if (!selectedAccount) {
      setError('Selecciona una cuenta bancaria');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await operationsApi.createOperation({
        tipo,
        monto_soles: parseFloat(montoSoles),
        monto_dolares: parseFloat(montoDolares),
        banco_cuenta_id: selectedAccount,
      });

      if (response.success && response.data) {
        setSuccess(true);

        // Redirect to operation details after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/operaciones/${response.data?.operation.id}`);
        }, 2000);
      } else {
        setError(response.message || 'Error al crear la operación');
      }
    } catch (error: any) {
      console.error('Error creating operation:', error);
      setError(error.response?.data?.message || 'Error al crear la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentRate = () => {
    if (!currentRates) return 0;
    return tipo === 'compra' ? currentRates.tipo_compra : currentRates.tipo_venta;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Operación Creada!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu operación ha sido creada exitosamente. Redirigiendo a los detalles...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver al Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center">
            <Calculator className="w-8 h-8 mr-3 text-primary" />
            Nueva Operación
          </h1>
          <p className="text-gray-600 mt-2">
            Completa los datos para crear tu operación de cambio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exchange rate indicator */}
          {currentRates && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Tipo de Cambio Actual</h3>
                <div className={`flex items-center text-sm font-semibold ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
                  {isConnected ? 'En vivo (Tiempo Real)' : 'Actualizando...'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Compra</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    S/ {currentRates.tipo_compra.toFixed(3)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Venta</span>
                    <TrendingDown className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    S/ {currentRates.tipo_venta.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operation type selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-4">
              Tipo de Operación
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTipoChange('compra')}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  tipo === 'compra'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {tipo === 'compra' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <TrendingDown className="w-8 h-8 text-green-600" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Compra</span>
                  <span className="text-sm text-gray-600 mt-1">Compras dólares</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTipoChange('venta')}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  tipo === 'venta'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {tipo === 'venta' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Venta</span>
                  <span className="text-sm text-gray-600 mt-1">Vendes dólares</span>
                </div>
              </button>
            </div>
          </div>

          {/* Amount calculator */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-4">
              Monto a Cambiar
            </label>

            <div className="space-y-4">
              {/* Soles input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soles (PEN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-bold">S/</span>
                  </div>
                  <input
                    type="text"
                    value={montoSoles}
                    onChange={(e) => handleMontoSolesChange(e.target.value)}
                    placeholder="0.00"
                    className="block w-full pl-12 pr-4 py-4 text-xl font-bold text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Conversion indicator */}
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-full p-3">
                  {isCalculating ? (
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Dollars input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dólares (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-bold">$</span>
                  </div>
                  <input
                    type="text"
                    value={montoDolares}
                    onChange={(e) => handleMontoDolaresChange(e.target.value)}
                    placeholder="0.00"
                    className="block w-full pl-12 pr-4 py-4 text-xl font-bold text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Rate display */}
              {montoSoles && montoDolares && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tipo de cambio aplicado:</span>
                    <span className="text-lg font-bold text-gray-900">
                      S/ {getCurrentRate().toFixed(3)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bank account selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-4">
              Cuenta Bancaria
            </label>

            {bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No tienes cuentas bancarias registradas</p>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/cuentas/nueva')}
                  className="text-primary hover:text-primary-600 font-semibold"
                >
                  Agregar cuenta bancaria
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedAccount(account.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAccount === account.id
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{account.banco}</p>
                          <p className="text-sm text-gray-600">{account.numero_cuenta}</p>
                        </div>
                      </div>
                      {selectedAccount === account.id && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    {account.is_primary && (
                      <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                        Principal
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || !montoSoles || !montoDolares || !selectedAccount}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Creando Operación...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5 mr-2" />
                Crear Operación
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
