'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { operationsApi } from '@/lib/api/operations';
import { banksApi } from '@/lib/api/banks';
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
  Info,
  Plus,
  Landmark,
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
      if (!user?.dni) {
        setError('No se pudo obtener la información del usuario');
        setIsLoading(false);
        return;
      }

      // Fetch rates and bank accounts in parallel
      await fetchRates();
      const accountsResponse = await banksApi.getMyAccounts(user.dni);

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
    const cleanValue = value.replace(/[^0-9.]/g, '');
    if ((cleanValue.match(/\./g) || []).length > 1) return;

    setMontoSoles(cleanValue);
    setActiveInput('soles');

    if (!cleanValue || parseFloat(cleanValue) <= 0) {
      setMontoDolares('');
      return;
    }

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
    const cleanValue = value.replace(/[^0-9.]/g, '');
    if ((cleanValue.match(/\./g) || []).length > 1) return;

    setMontoDolares(cleanValue);
    setActiveInput('dolares');

    if (!cleanValue || parseFloat(cleanValue) <= 0) {
      setMontoSoles('');
      return;
    }

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

    if (activeInput === 'soles' && montoSoles) {
      await handleMontoSolesChange(montoSoles);
    } else if (activeInput === 'dolares' && montoDolares) {
      await handleMontoDolaresChange(montoDolares);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

  // Get helper text based on operation type
  const getHelperText = () => {
    if (tipo === 'compra') {
      return {
        title: 'QoriCash compra tus dólares',
        description: 'Tú nos vendes dólares y recibes soles',
        solesLabel: 'Recibes en Soles',
        dolaresLabel: 'Entregas en Dólares',
      };
    } else {
      return {
        title: 'QoriCash te vende dólares',
        description: 'Tú compras dólares y pagas en soles',
        solesLabel: 'Pagas en Soles',
        dolaresLabel: 'Recibes en Dólares',
      };
    }
  };

  const helper = getHelperText();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Compact Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Nueva Operación</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* LEFT COLUMN - Calculator & Operation Type */}
          <div className="space-y-4">
            {/* Live Exchange Rates Card */}
            {currentRates && (
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-900">Tipo de Cambio en Tiempo Real</h3>
                  <div className={`flex items-center text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
                    {isConnected ? 'En vivo' : 'Actualizando...'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-green-800">Compra</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {currentRates.tipo_compra.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-800">Venta</span>
                      <TrendingDown className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {currentRates.tipo_venta.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Operation Type Selector */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                Tipo de Operación
                <div className="group relative ml-2">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    <strong>Compra:</strong> QoriCash compra tus dólares<br />
                    <strong>Venta:</strong> QoriCash te vende dólares
                  </div>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTipoChange('compra')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tipo === 'compra'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <TrendingDown className={`w-6 h-6 mb-2 ${tipo === 'compra' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${tipo === 'compra' ? 'text-green-900' : 'text-gray-700'}`}>
                      Compra
                    </span>
                    <span className="text-xs text-gray-600 mt-1 text-center">
                      QoriCash compra USD
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTipoChange('venta')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tipo === 'venta'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <TrendingUp className={`w-6 h-6 mb-2 ${tipo === 'venta' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${tipo === 'venta' ? 'text-blue-900' : 'text-gray-700'}`}>
                      Venta
                    </span>
                    <span className="text-xs text-gray-600 mt-1 text-center">
                      QoriCash vende USD
                    </span>
                  </div>
                </button>
              </div>

              {/* Helper text */}
              <div className={`mt-3 p-3 rounded-lg ${tipo === 'compra' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-xs font-semibold ${tipo === 'compra' ? 'text-green-900' : 'text-blue-900'}`}>
                  {helper.title}
                </p>
                <p className={`text-xs ${tipo === 'compra' ? 'text-green-700' : 'text-blue-700'} mt-1`}>
                  {helper.description}
                </p>
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 flex-1">
              <div className={`px-4 py-3 border-b border-gray-200 ${tipo === 'compra' ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <Calculator className={`w-4 h-4 mr-2 ${tipo === 'compra' ? 'text-green-600' : 'text-blue-600'}`} />
                  Calculadora de Cambio
                </h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Soles Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    {helper.solesLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xl font-bold">S/</span>
                    </div>
                    <input
                      type="text"
                      value={montoSoles}
                      onChange={(e) => handleMontoSolesChange(e.target.value)}
                      placeholder="0.00"
                      className="block w-full pl-12 pr-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Conversion Indicator */}
                <div className="flex items-center justify-center relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                  </div>
                  <div className="relative bg-white px-3">
                    <div className={`rounded-full p-2 shadow-md ${tipo === 'compra' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                      {isCalculating ? (
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-white transform rotate-90" />
                      )}
                    </div>
                    {currentRates && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${tipo === 'compra' ? 'text-green-700 bg-green-100' : 'text-blue-700 bg-blue-100'}`}>
                          TC: {getCurrentRate().toFixed(3)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dollars Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 mt-6">
                    {helper.dolaresLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xl font-bold">$</span>
                    </div>
                    <input
                      type="text"
                      value={montoDolares}
                      onChange={(e) => handleMontoDolaresChange(e.target.value)}
                      placeholder="0.00"
                      className="block w-full pl-12 pr-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Summary */}
                {montoSoles && montoDolares && (
                  <div className={`rounded-lg p-3 border ${tipo === 'compra' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} mt-4`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className={`text-xs font-semibold uppercase tracking-wide ${tipo === 'compra' ? 'text-green-700' : 'text-blue-700'}`}>
                          Resumen
                        </p>
                        <p className={`text-sm mt-1 ${tipo === 'compra' ? 'text-green-900' : 'text-blue-900'}`}>
                          {tipo === 'compra'
                            ? `Entregas $ ${parseFloat(montoDolares).toLocaleString('en-US', {minimumFractionDigits: 2})} y recibes S/ ${parseFloat(montoSoles).toLocaleString('es-PE', {minimumFractionDigits: 2})}`
                            : `Pagas S/ ${parseFloat(montoSoles).toLocaleString('es-PE', {minimumFractionDigits: 2})} y recibes $ ${parseFloat(montoDolares).toLocaleString('en-US', {minimumFractionDigits: 2})}`
                          }
                        </p>
                      </div>
                      <CheckCircle className={`w-6 h-6 flex-shrink-0 ml-2 ${tipo === 'compra' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Bank Account & Submit */}
          <div className="space-y-4 flex flex-col">
            {/* Bank Account Selection */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex-1">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Cuenta Bancaria
                </label>
                {bankAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/agregar-cuenta')}
                    className="text-xs text-primary hover:text-primary-600 font-semibold flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar
                  </button>
                )}
              </div>

              {bankAccounts.length === 0 ? (
                <div className="text-center py-12">
                  <Landmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">No tienes cuentas bancarias</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Agrega una cuenta para poder realizar operaciones
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/agregar-cuenta')}
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Cuenta Bancaria
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {bankAccounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setSelectedAccount(account.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAccount === account.id
                          ? 'border-primary bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedAccount === account.id ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            <CreditCard className={`w-5 h-5 ${
                              selectedAccount === account.id ? 'text-primary-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{account.banco}</p>
                            <p className="text-sm text-gray-600 truncate">{account.numero_cuenta}</p>
                            {account.is_primary && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedAccount === account.id && (
                          <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
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
          </div>
        </form>
      </main>
    </div>
  );
}
