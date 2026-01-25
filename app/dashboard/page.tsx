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
  ChevronDown,
  HelpCircle,
  X,
  FileText,
  Image as ImageIcon,
  Calendar,
  Building2,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition group"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    {user?.document_type === 'RUC'
                      ? user?.razon_social || user?.nombres
                      : user?.apellidos ? `${user?.nombres} ${user?.apellidos}` : user?.nombres}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/perfil"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Mi perfil
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <TrendingUp className="w-5 h-5 mr-3" />
                      Mi Dashboard
                    </Link>
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
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-primary-50/20 to-gold-50/20 rounded-full blur-3xl"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
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
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60 hover:shadow-2xl transition-all duration-300">
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
            <div className="bg-gradient-to-br from-gold-50/50 via-white/70 to-primary-50/50 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-md">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">¡Invita y Gana!</h3>
                </div>
                <p className="text-xs text-gray-700 mb-3">
                  Comparte tu código con amigos. Ambos recibirán un mejor tipo de cambio.
                </p>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gold-200/50 shadow-sm">
                    <p className="text-xs text-gray-600 mb-0.5">Tu código de referido</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-primary-600 to-gold-600 bg-clip-text text-transparent tracking-wider font-mono">{user.referral_code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyReferralCode}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
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
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
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
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Operaciones</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_operations}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total en Soles</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    S/ {stats.total_soles.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ArrowUpRight className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total en Dólares</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    $ {stats.total_dolares.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ArrowDownRight className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pendientes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending_operations}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operations section */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">Mis Operaciones</h3>
              <button
                onClick={() => router.push('/dashboard/nueva-operacion')}
                className="inline-flex items-center bg-gradient-to-r from-primary to-primary-600 text-secondary px-6 py-3 rounded-xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
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
              filteredOperations.map((operation) => {
                // Si la operación está pendiente, redirigir a nueva-operacion para continuar
                const handleOperationClick = () => {
                  if (operation.estado.toLowerCase() === 'pendiente') {
                    const opId = operation.codigo_operacion;
                    console.log('Redirigiendo a operación pendiente:', {
                      codigo_operacion: operation.codigo_operacion,
                      id: operation.id,
                      estado: operation.estado,
                      operation
                    });

                    if (!opId) {
                      console.error('Error: codigo_operacion no está disponible en la operación');
                      return;
                    }

                    router.push(`/dashboard/nueva-operacion?operation_id=${opId}`);
                  } else {
                    // Abrir modal con detalles completos de la operación
                    setSelectedOperation(operation);
                    setIsOperationModalOpen(true);
                  }
                };

                return (
                <div
                  key={operation.id}
                  className="p-6 hover:bg-white/50 transition-all duration-200 cursor-pointer border-b border-gray-100/50 last:border-0 group"
                  onClick={handleOperationClick}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                            operation.tipo === 'compra'
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                              : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                          }`}
                        >
                          {operation.tipo === 'compra' ? '↓ COMPRA' : '↑ VENTA'}
                        </span>
                        {getStatusBadge(operation.estado)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">Monto Soles</p>
                          <p className="text-xl font-bold text-gray-900">
                            S/ {(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">Monto Dólares</p>
                          <p className="text-xl font-bold text-gray-900">
                            $ {(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 font-medium">
                        TC: S/ {(operation.tipo_cambio ?? 0).toFixed(3)} • {new Date(operation.fecha_creacion).toLocaleDateString('es-PE')}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Operation Details Modal */}
      {isOperationModalOpen && selectedOperation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsOperationModalOpen(false)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-white/60 animate-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary/5 via-white/80 to-gold/5 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                  selectedOperation.tipo === 'compra' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                }`}>
                  {selectedOperation.tipo === 'compra' ? (
                    <ArrowDownRight className={`w-6 h-6 text-white`} />
                  ) : (
                    <ArrowUpRight className={`w-6 h-6 text-white`} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Detalles de Operación</h2>
                  <p className="text-sm text-gray-600 font-medium">
                    {selectedOperation.codigo_operacion || selectedOperation.operation_id || `#${selectedOperation.id}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOperationModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100/80 transition-all hover:scale-105"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Status Badge & Main Info - Single Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Status */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Estado</p>
                  <div className="scale-95 origin-left">
                    {getStatusBadge(selectedOperation.estado)}
                  </div>
                </div>

                {/* Tipo */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Tipo</p>
                  <p className="text-base font-bold text-gray-900 capitalize">
                    {selectedOperation.tipo}
                  </p>
                </div>

                {/* Fecha */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 col-span-2 border border-gray-200/50 shadow-sm">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Fecha de Creación</p>
                  <p className="text-base font-bold text-gray-900">
                    {new Date(selectedOperation.fecha_creacion).toLocaleString('es-PE', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              {/* Montos y TC */}
              <div className="grid grid-cols-3 gap-3">
                {/* Monto en Soles */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50 shadow-sm">
                  <p className="text-xs text-green-700 mb-1 font-semibold">Soles</p>
                  <p className="text-lg font-bold text-green-900">
                    S/ {(selectedOperation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Monto en Dólares */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50 shadow-sm">
                  <p className="text-xs text-blue-700 mb-1 font-semibold">Dólares</p>
                  <p className="text-lg font-bold text-blue-900">
                    $ {(selectedOperation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Tipo de Cambio */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50 shadow-sm">
                  <p className="text-xs text-purple-700 mb-1 font-semibold">T.C.</p>
                  <p className="text-lg font-bold text-purple-900">
                    S/ {(selectedOperation.tipo_cambio ?? 0).toFixed(3)}
                  </p>
                </div>
              </div>

              {/* Cuentas Bancarias */}
              {(selectedOperation.source_account || selectedOperation.destination_account) && (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
                  <p className="text-sm text-gray-700 mb-3 font-semibold">Cuentas Bancarias</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOperation.source_account && (
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200/50 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium mb-1">Origen</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOperation.source_account}</p>
                        {selectedOperation.source_bank && (
                          <p className="text-xs text-gray-600 mt-1">{selectedOperation.source_bank}</p>
                        )}
                      </div>
                    )}
                    {selectedOperation.destination_account && (
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200/50 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium mb-1">Destino</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOperation.destination_account}</p>
                        {selectedOperation.destination_bank && (
                          <p className="text-xs text-gray-600 mt-1">{selectedOperation.destination_bank}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documentos - Solo mostrar si la operación está completada */}
              {selectedOperation.estado?.toLowerCase() === 'completado' && (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
                <p className="text-sm text-gray-700 mb-3 font-semibold">Documentos</p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Comprobante del Cliente */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200/50 shadow-sm">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Comprobante Cliente</p>
                    {selectedOperation.comprobante_cliente ? (
                      <>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200/50 mb-2 shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={selectedOperation.comprobante_cliente}
                            alt="Comprobante Cliente"
                            className="w-full h-28 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => window.open(selectedOperation.comprobante_cliente, '_blank')}
                          />
                        </div>
                        <a
                          href={selectedOperation.comprobante_cliente}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium block text-center"
                        >
                          Ver imagen
                        </a>
                      </>
                    ) : (
                      <div className="bg-white rounded-lg border border-dashed border-gray-300 h-28 flex items-center justify-center">
                        <p className="text-xs text-gray-400">Sin documento</p>
                      </div>
                    )}
                  </div>

                  {/* Comprobante del Operador */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200/50 shadow-sm">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Comprobante Operador</p>
                    {selectedOperation.comprobante_operador ? (
                      <>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200/50 mb-2 shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={selectedOperation.comprobante_operador}
                            alt="Comprobante Operador"
                            className="w-full h-28 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => window.open(selectedOperation.comprobante_operador, '_blank')}
                          />
                        </div>
                        <a
                          href={selectedOperation.comprobante_operador}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium block text-center"
                        >
                          Ver imagen
                        </a>
                      </>
                    ) : (
                      <div className="bg-white rounded-lg border border-dashed border-gray-300 h-28 flex items-center justify-center">
                        <p className="text-xs text-gray-400">Sin documento</p>
                      </div>
                    )}
                  </div>

                  {/* Boleta/Factura */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200/50 shadow-sm">
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {user?.document_type === 'RUC' ? 'Factura' : 'Boleta'}
                    </p>
                    {selectedOperation.boleta_factura ? (
                      <>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200/50 mb-2 shadow-sm hover:shadow-md transition-shadow">
                          <img
                            src={selectedOperation.boleta_factura}
                            alt={user?.document_type === 'RUC' ? 'Factura' : 'Boleta'}
                            className="w-full h-28 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => window.open(selectedOperation.boleta_factura, '_blank')}
                          />
                        </div>
                        <a
                          href={selectedOperation.boleta_factura}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium block text-center"
                        >
                          Ver imagen
                        </a>
                      </>
                    ) : (
                      <div className="bg-white rounded-lg border border-dashed border-gray-300 h-28 flex items-center justify-center">
                        <p className="text-xs text-gray-400">Sin documento</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Notas adicionales - Ocultar mensajes del sistema */}
              {selectedOperation.notas && !selectedOperation.notas.startsWith('[SISTEMA]') && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-4 border border-yellow-200/50 shadow-sm">
                  <p className="text-sm text-yellow-700 mb-2 font-semibold">Notas</p>
                  <p className="text-sm text-yellow-900">{selectedOperation.notas}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
