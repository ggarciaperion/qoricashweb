'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { operationsApi } from '@/lib/api/operations';
import type { Operation, ClientStats } from '@/lib/types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  LogOut,
  User,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Copy,
  Share2,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentRates, fetchRates, isConnected } = useExchangeStore();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Fetch exchange rates
    fetchRates();

    // Start rate subscription
    const unsubscribe = useExchangeStore.getState().startRateSubscription();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    if (!user?.dni) {
      console.error('No user DNI available');
      return;
    }

    setIsLoading(true);
    try {
      // Load operations and stats with user DNI
      const [opsResponse, statsResponse] = await Promise.all([
        operationsApi.getMyOperations(user.dni),
        operationsApi.getStats(user.dni),
      ]);

      if (opsResponse.success && opsResponse.data) {
        setOperations(opsResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const filteredOperations = operations.filter((op) => {
    if (activeTab === 'pendientes') return op.estado === 'pendiente' || op.estado === 'en_proceso';
    if (activeTab === 'completadas') return op.estado === 'completado';
    return true;
  });

  const getStatusBadge = (estado: string) => {
    const badges = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' },
      en_proceso: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, label: 'En Proceso' },
      completado: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Completado' },
      cancelado: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Cancelado' },
      rechazado: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rechazado' },
    };

    const badge = badges[estado as keyof typeof badges] || badges.pendiente;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
                <img src="/logo-principal.png" alt="QoriCash" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-900">QoriCash</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center text-gray-700 hover:text-primary-600 transition font-medium"
              >
                Inicio
              </Link>
              <div className="hidden sm:flex items-center text-sm text-gray-700">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                <span className="font-medium">
                  {user?.document_type === 'RUC'
                    ? user?.razon_social || user?.nombres
                    : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center text-gray-700 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2 hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-900">
            Bienvenido, {user?.document_type === 'RUC'
              ? user?.razon_social || user?.nombres
              : user?.nombres}!
          </h2>
          <p className="text-gray-600 mt-1">Gestiona tus operaciones de cambio de divisas</p>
        </div>

        {/* Layout horizontal: Tipo de Cambio y Referidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {/* Exchange rates card */}
          {currentRates && (
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-gray-900">Tipo de Cambio Actual</h3>
                <div className={`flex items-center text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
                  {isConnected ? 'En vivo' : 'Actualizando...'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-800">Compra</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    S/ {currentRates.tipo_compra.toFixed(3)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-800">Venta</span>
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    S/ {currentRates.tipo_venta.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referral Code Card */}
          {user?.referral_code && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl shadow-md p-4 border border-amber-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-gray-900">¡Invita y Gana!</h3>
                </div>
                <p className="text-xs text-gray-700 mb-3">
                  Comparte tu código con amigos. Ambos recibirán un mejor tipo de cambio.
                </p>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="bg-white rounded-lg px-3 py-2 border border-amber-300">
                    <p className="text-xs text-gray-600 mb-0.5">Tu código de referido</p>
                    <p className="text-xl font-bold text-amber-600 tracking-wider font-mono">{user.referral_code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyReferralCode}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-semibold shadow-sm hover:shadow-md"
                    >
                      {copiedCode ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const text = `¡Hola! Te invito a cambiar dólares con QoriCash. Usa mi código ${user.referral_code} y ambos tendremos un mejor tipo de cambio. 🎁`;
                        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold shadow-sm hover:shadow-md"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Compartir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Operaciones</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_operations}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total en Soles</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    S/ {stats.total_soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total en Dólares</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    $ {stats.total_dolares.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending_operations}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operations section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">Mis Operaciones</h3>
              <button
                onClick={() => router.push('/dashboard/nueva-operacion')}
                className="inline-flex items-center bg-primary text-secondary px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition shadow-md hover:shadow-lg group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition" />
                Nueva Operación
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mt-6 border-b border-gray-200">
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'pendientes', label: 'Pendientes' },
                { key: 'completadas', label: 'Completadas' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`pb-3 px-2 font-medium text-sm transition ${
                    activeTab === tab.key
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operations list */}
          <div className="divide-y divide-gray-200">
            {filteredOperations.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tienes operaciones aún</p>
                <p className="text-gray-400 text-sm mt-2">
                  Crea tu primera operación para comenzar
                </p>
              </div>
            ) : (
              filteredOperations.map((operation) => (
                <div
                  key={operation.id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/dashboard/operaciones/${operation.id}`)}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            operation.tipo === 'compra'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {operation.tipo === 'compra' ? '↓ COMPRA' : '↑ VENTA'}
                        </span>
                        {getStatusBadge(operation.estado)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-500">Monto Soles</p>
                          <p className="text-lg font-bold text-gray-900">
                            S/ {(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Monto Dólares</p>
                          <p className="text-lg font-bold text-gray-900">
                            $ {(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        TC: S/ {(operation.tipo_cambio ?? 0).toFixed(3)} • {new Date(operation.fecha_creacion).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
