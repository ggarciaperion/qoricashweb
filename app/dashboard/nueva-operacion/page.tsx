'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { operationsApi } from '@/lib/api/operations';
import { banksApi } from '@/lib/api/banks';
import type { BankAccount } from '@/lib/types';
import AddBankAccountModal from '@/components/modals/AddBankAccountModal';
import {
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Plus,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  HelpCircle,
  HeadphonesIcon,
  TrendingUp,
  TrendingDown,
  Building2,
  Calculator,
  Send,
  Wallet,
  Copy,
  Timer,
  X,
  Upload,
  FileImage,
} from 'lucide-react';
import Image from 'next/image';

export default function NuevaOperacionPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { currentRates, fetchRates, isConnected, startRateSubscription } = useExchangeStore();

  // Form state
  const [tipo, setTipo] = useState<'Compra' | 'Venta'>('Compra');
  const [amountInput, setAmountInput] = useState('');
  const [amountOutput, setAmountOutput] = useState('');
  const [selectedOriginAccount, setSelectedOriginAccount] = useState<number | null>(null);
  const [selectedDestinationAccount, setSelectedDestinationAccount] = useState<number | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);

  // UI state
  const [currentStep, setCurrentStep] = useState(1); // 1: Cotiza, 2: Transfiere, 3: Recibe
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Step 2 state
  const [createdOperation, setCreatedOperation] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutos = 900 segundos
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Cancel operation state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Confirm operation state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Upload proof state
  const [isUploadProofModalOpen, setIsUploadProofModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [operationCode, setOperationCode] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadInitialData();
  }, [isAuthenticated]);

  // Start WebSocket subscription for real-time rates
  useEffect(() => {
    console.log('🔌 Starting real-time rate subscription...');
    const cleanup = startRateSubscription();

    return () => {
      console.log('🔌 Cleaning up real-time rate subscription...');
      cleanup();
    };
  }, []);

  // Recalculate when input or operation type changes
  useEffect(() => {
    calculateAmount();
  }, [amountInput, tipo, currentRates]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      if (!user?.dni) {
        setError('No se pudo obtener la información del usuario');
        setIsLoading(false);
        return;
      }

      // Note: fetchRates is called by startRateSubscription in useEffect
      await loadBankAccounts();
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Error al cargar los datos iniciales');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBankAccounts = async () => {
    if (!user?.dni) return;

    try {
      const accountsResponse = await banksApi.getMyAccounts(user.dni);

      if (accountsResponse.success && accountsResponse.data) {
        const transformedAccounts = accountsResponse.data.map((acc: any, index: number) => ({
          id: index,
          banco: acc.bank_name || acc.banco,
          numero_cuenta: acc.account_number || acc.numero_cuenta,
          tipo_cuenta: acc.account_type || acc.tipo_cuenta,
          moneda: acc.currency || acc.moneda,
          origen: acc.origen,
          is_primary: index === 0,
        }));

        setBankAccounts(transformedAccounts);
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const canCreateOperation = () => {
    const hasSoles = bankAccounts.some(acc => acc.moneda === 'S/');
    const hasDolares = bankAccounts.some(acc => acc.moneda === '$');
    return hasSoles && hasDolares;
  };

  const calculateAmount = () => {
    if (!amountInput || !currentRates) {
      setAmountOutput('');
      return;
    }

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setAmountOutput('');
      return;
    }

    if (tipo === 'Compra') {
      const pen = (amount * currentRates.tipo_compra).toFixed(2);
      setAmountOutput(pen);
    } else {
      const usd = (amount / currentRates.tipo_venta).toFixed(2);
      setAmountOutput(usd);
    }
  };

  const handleSwapCurrency = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setTipo(tipo === 'Compra' ? 'Venta' : 'Compra');
    setSelectedOriginAccount(null);
    setSelectedDestinationAccount(null);
  };

  const handleAddAccountSuccess = async () => {
    await loadBankAccounts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amountInput || parseFloat(amountInput) <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    if (!amountOutput || parseFloat(amountOutput) <= 0) {
      setError('Error en el cálculo del monto');
      return;
    }

    if (selectedOriginAccount === null) {
      setError('Selecciona una cuenta de cargo');
      return;
    }

    if (selectedDestinationAccount === null) {
      setError('Selecciona una cuenta de destino');
      return;
    }

    if (!ownershipConfirmed) {
      setError('Debes confirmar que eres titular de las cuentas');
      return;
    }

    if (!user?.dni) {
      setError('No se pudo obtener el DNI del usuario');
      return;
    }

    // Abrir modal de confirmación
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAndCreate = async () => {
    setError(null);
    setIsSubmitting(true);
    setIsConfirmModalOpen(false);

    try {
      const response = await operationsApi.createOperation({
        dni: user!.dni,
        tipo: tipo.toLowerCase() as 'compra' | 'venta',
        monto_soles: tipo === 'Compra' ? parseFloat(amountOutput) : parseFloat(amountInput),
        monto_dolares: tipo === 'Compra' ? parseFloat(amountInput) : parseFloat(amountOutput),
        banco_cuenta_id: tipo === 'Compra' ? selectedDestinationAccount! : selectedOriginAccount!,
      });

      if (response.success && response.data) {
        setCreatedOperation(response.data.operation);
        setTimeRemaining(900); // Reset contador a 15 minutos
        setCurrentStep(2); // Avanzar inmediatamente al paso 2: Transfiere
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

  const getOriginAccounts = () => {
    const currency = tipo === 'Compra' ? '$' : 'S/';
    return bankAccounts.filter(acc => acc.moneda === currency);
  };

  const getDestinationAccounts = () => {
    const currency = tipo === 'Compra' ? 'S/' : '$';
    return bankAccounts.filter(acc => acc.moneda === currency);
  };

  // Timer countdown for Step 2
  useEffect(() => {
    if (currentStep === 2 && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, timeRemaining]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle operation cancellation
  const handleCancelOperation = async () => {
    if (!cancelReason.trim()) {
      setError('Por favor, indica el motivo de la cancelación');
      return;
    }

    if (!createdOperation?.id) {
      setError('No se encontró la operación para cancelar');
      return;
    }

    setIsCancelling(true);
    setError(null);

    try {
      const response = await operationsApi.cancelOperation(createdOperation.id, cancelReason);

      if (response.success) {
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        setError(response.message || 'Error al cancelar la operación');
        setIsCancelling(false);
      }
    } catch (error: any) {
      console.error('Error cancelling operation:', error);
      setError(error.response?.data?.message || 'Error al cancelar la operación');
      setIsCancelling(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = uploadedFiles.length + newFiles.length;

      if (totalFiles > 4) {
        setError('Máximo 4 archivos permitidos');
        return;
      }

      setUploadedFiles([...uploadedFiles, ...newFiles]);
      setError(null);
    }
  };

  // Remove file from list
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Submit proof of payment
  const handleSubmitProof = async () => {
    // Por ahora solo avanzamos al paso 3
    // La funcionalidad de subir archivos se implementará cuando esté el endpoint
    setIsUploadProofModalOpen(false);
    setCurrentStep(3);
  };

  // Get QoriCash account based on client bank and operation type
  const getQoricashAccount = () => {
    if (!createdOperation || !selectedOriginAccount) return null;

    const clientAccount = bankAccounts.find(acc => acc.id === selectedOriginAccount);
    if (!clientAccount) return null;

    const clientBank = clientAccount.banco;
    const currency = tipo === 'Compra' ? '$' : 'S/';

    // Cuentas QoriCash simuladas para pruebas
    const qoricashAccounts: any = {
      'BCP': {
        '$': { banco: 'BCP', tipo: 'Corriente', numero: '19412345678901', titular: 'QoriCash SAC' },
        'S/': { banco: 'BCP', tipo: 'Corriente', numero: '19498765432101', titular: 'QoriCash SAC' },
      },
      'INTERBANK': {
        '$': { banco: 'INTERBANK', tipo: 'Corriente', numero: '20012345678901', cci: '00320012345678901234', titular: 'QoriCash SAC' },
        'S/': { banco: 'INTERBANK', tipo: 'Corriente', numero: '20098765432101', cci: '00320098765432101234', titular: 'QoriCash SAC' },
      },
      'PICHINCHA': {
        '$': { banco: 'PICHINCHA', tipo: 'Corriente', numero: '30112345678901', titular: 'QoriCash SAC' },
        'S/': { banco: 'PICHINCHA', tipo: 'Corriente', numero: '30198765432101', titular: 'QoriCash SAC' },
      },
      'BANBIF': {
        '$': { banco: 'BANBIF', tipo: 'Corriente', numero: '40212345678901', titular: 'QoriCash SAC' },
        'S/': { banco: 'BANBIF', tipo: 'Corriente', numero: '40298765432101', titular: 'QoriCash SAC' },
      },
    };

    // BBVA, Scotiabank, Otros → Solo CCI de Interbank
    if (['BBVA', 'SCOTIABANK', 'OTROS'].includes(clientBank)) {
      return {
        banco: 'INTERBANK (CCI)',
        tipo: 'Corriente',
        cci: currency === '$' ? '00320012345678901234' : '00320098765432101234',
        titular: 'QoriCash SAC',
        useCCI: true,
      };
    }

    return qoricashAccounts[clientBank]?.[currency] || null;
  };

  const exchangeRates = currentRates
    ? { compra: currentRates.tipo_compra, venta: currentRates.tipo_venta }
    : { compra: 3.750, venta: 3.770 };

  const inputCurrency = tipo === 'Compra' ? 'USD' : 'PEN';
  const outputCurrency = tipo === 'Compra' ? 'PEN' : 'USD';
  const currentRate = tipo === 'Compra' ? exchangeRates.compra : exchangeRates.venta;

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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header compacto */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">Volver</span>
          </button>

          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-full border border-green-200">
            <div className="relative flex items-center">
              <div className={`w-2 h-2 rounded-full ${currentRates ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {currentRates && (
                <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
              )}
            </div>
            <span className={`text-xs font-semibold ${currentRates ? 'text-green-700' : 'text-gray-600'}`}>
              {currentRates ? 'Tipos de cambio en vivo' : 'Cargando tipos de cambio...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar izquierdo - Información de QoriCash */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-3 relative">
                  <Image
                    src="/logo-principal.png"
                    alt="QoriCash Logo"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-900">QoriCash</h3>
                <p className="text-xs text-gray-600">Casa de cambio online</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">Teléfono</p>
                    <p className="text-xs text-gray-600">926 011 920</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">info@qoricash.pe</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">Horario</p>
                    <p className="text-xs text-gray-600">Lun - Vie: 9am - 6pm</p>
                    <p className="text-xs text-gray-600">Sáb: 9am - 1pm</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <a
                  href="https://wa.me/51926011920?text=Hola,%20necesito%20ayuda%20con%20mi%20operación%20de%20cambio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                  <HelpCircle className="w-4 h-4" />
                  Ayuda
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                  <HeadphonesIcon className="w-4 h-4" />
                  Soporte
                </button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              {/* Header */}
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {currentStep === 1 ? 'Nueva Operación' : currentStep === 2 ? 'Transfiere el dinero' : 'Recibe tu dinero'}
                </h1>
                <p className="text-xs text-gray-600">
                  {currentStep === 1
                    ? 'Completa los datos para realizar tu cambio'
                    : currentStep === 2
                    ? 'Realiza la transferencia a la cuenta de QoriCash'
                    : 'Tu operación está siendo procesada'}
                </p>
              </div>

              {/* Progress Stepper - Compact */}
              <div className="mb-6">
                <style jsx>{`
                  @keyframes fillProgress {
                    0% {
                      width: 0%;
                    }
                    100% {
                      width: 100%;
                    }
                  }

                  .animated-line {
                    position: relative;
                    background: #e5e7eb; /* Gray base */
                    overflow: hidden;
                  }

                  .animated-line::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(
                      90deg,
                      #16a34a 0%,
                      #22c55e 50%,
                      #4ade80 100%
                    );
                    animation: fillProgress 3s ease-in-out infinite;
                    border-radius: inherit;
                    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
                  }
                `}</style>
                <div className="flex items-center justify-between max-w-xl mx-auto">
                  {/* Step 1: Cotiza */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      currentStep >= 1
                        ? 'bg-gradient-to-br from-secondary to-secondary-700 shadow-md'
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <Calculator className={`w-5 h-5 ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-xs font-bold ${currentStep >= 1 ? 'text-secondary' : 'text-gray-400'}`}>01</p>
                    <p className={`text-xs font-semibold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Cotiza</p>
                  </div>

                  {/* Line 1→2 - Línea más gruesa y visible */}
                  <div className={`flex-1 h-2 mx-3 rounded-full transition-all ${
                    currentStep > 1
                      ? 'bg-green-500 shadow-sm'
                      : currentStep === 1
                      ? 'animated-line'
                      : 'bg-gray-200'
                  }`}></div>

                  {/* Step 2: Transfiere */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      currentStep >= 2
                        ? 'bg-gradient-to-br from-secondary to-secondary-700 shadow-md'
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <Send className={`w-5 h-5 ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-xs font-bold ${currentStep >= 2 ? 'text-secondary' : 'text-gray-400'}`}>02</p>
                    <p className={`text-xs font-semibold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Transfiere</p>
                  </div>

                  {/* Line 2→3 - Línea más gruesa y visible */}
                  <div className={`flex-1 h-2 mx-3 rounded-full transition-all ${
                    currentStep > 2
                      ? 'bg-green-500 shadow-sm'
                      : currentStep === 2
                      ? 'animated-line'
                      : 'bg-gray-200'
                  }`}></div>

                  {/* Step 3: Recibe */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      currentStep >= 3
                        ? 'bg-gradient-to-br from-secondary to-secondary-700 shadow-md'
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <Wallet className={`w-5 h-5 ${currentStep >= 3 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-xs font-bold ${currentStep >= 3 ? 'text-secondary' : 'text-gray-400'}`}>03</p>
                    <p className={`text-xs font-semibold ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Recibe</p>
                  </div>
                </div>
              </div>

              {/* STEP 2: Transfer Instructions */}
              {currentStep === 2 && createdOperation ? (
                <div className="space-y-4">
                  {/* Operation ID and Timer */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary to-secondary-700 rounded-xl text-white">
                    <div>
                      <p className="text-xs opacity-90 mb-1">ID de Operación</p>
                      <p className="text-2xl font-bold">{createdOperation.codigo_operacion}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                      <Timer className={`w-6 h-6 ${timeRemaining < 300 ? 'animate-pulse' : ''}`} />
                      <div className="text-right">
                        <p className="text-xs opacity-90">Tiempo restante</p>
                        <p className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-yellow-300' : ''}`}>
                          {formatTime(timeRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timer Warning */}
                  {timeRemaining < 300 && timeRemaining > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Quedan menos de 5 minutos. Completa la transferencia pronto.</span>
                      </p>
                    </div>
                  )}

                  {/* Time Expired */}
                  {timeRemaining === 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 flex items-start">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold">El tiempo ha expirado. Por favor, contacta a soporte para continuar con tu operación.</span>
                      </p>
                    </div>
                  )}

                  {/* Operation Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Resumen de la Operación</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-semibold text-gray-900">{createdOperation.tipo}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monto en Soles:</span>
                        <span className="font-semibold text-gray-900">S/ {parseFloat(createdOperation.monto_soles).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monto en Dólares:</span>
                        <span className="font-semibold text-gray-900">$ {parseFloat(createdOperation.monto_dolares).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tipo de Cambio:</span>
                        <span className="font-semibold text-gray-900">S/ {parseFloat(createdOperation.tipo_cambio).toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fecha y Hora:</span>
                        <span className="font-semibold text-gray-900">
                          {createdOperation.created_at ? new Date(createdOperation.created_at).toLocaleString('es-PE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'Ahora'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-300">
                        <span className="text-gray-600">Estado:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          {createdOperation.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Instructions */}
                  {(() => {
                    const qoricashAccount = getQoricashAccount();
                    if (!qoricashAccount) {
                      return (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">No se pudo determinar la cuenta de destino. Contacta a soporte.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                          <Building2 className="w-5 h-5 mr-2 text-secondary" />
                          Transfiere a esta cuenta de QoriCash
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-xs text-gray-600">Banco</p>
                                <p className="text-sm font-bold text-gray-900">{qoricashAccount.banco}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-600">Tipo</p>
                                <p className="text-sm font-semibold text-gray-900">{qoricashAccount.tipo}</p>
                              </div>
                            </div>
                            <div className="mb-2">
                              <p className="text-xs text-gray-600">Titular</p>
                              <p className="text-sm font-semibold text-gray-900">{qoricashAccount.titular}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                {qoricashAccount.useCCI ? 'Código Interbancario (CCI)' : 'Número de Cuenta'}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-secondary flex-1">
                                  {qoricashAccount.useCCI ? qoricashAccount.cci : qoricashAccount.numero}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(
                                    qoricashAccount.useCCI ? qoricashAccount.cci : qoricashAccount.numero,
                                    'account'
                                  )}
                                  className="p-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 transition"
                                >
                                  {copiedField === 'account' ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <Copy className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                              {copiedField === 'account' && (
                                <p className="text-xs text-green-600 mt-1">Copiado al portapapeles</p>
                              )}
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-800 flex items-start">
                              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                              <span>
                                <strong>Importante:</strong> Transfiere exactamente{' '}
                                <strong>
                                  {tipo === 'Compra'
                                    ? `$ ${parseFloat(createdOperation.monto_dolares).toFixed(2)}`
                                    : `S/ ${parseFloat(createdOperation.monto_soles).toFixed(2)}`
                                  }
                                </strong>{' '}
                                desde tu cuenta{' '}
                                <strong>
                                  {bankAccounts.find(acc => acc.id === selectedOriginAccount)?.banco} {' '}
                                  {bankAccounts.find(acc => acc.id === selectedOriginAccount)?.numero_cuenta}
                                </strong>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCancelModalOpen(true);
                        setError(null);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      Cancelar operación
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUploadProofModalOpen(true);
                        setOperationCode(createdOperation.codigo_operacion);
                      }}
                      disabled={timeRemaining === 0}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Ya transferí
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-500">
                    Una vez que hayas realizado la transferencia, haz clic en "Ya transferí" para continuar
                  </p>
                </div>
              ) : currentStep === 1 ? (
                /* STEP 1: Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Validación de cuentas */}
                  {!canCreateOperation() && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Necesitas <strong>una cuenta en Soles</strong> y <strong>una cuenta en Dólares</strong> para crear operaciones.</span>
                      </p>
                    </div>
                  )}

                  {/* Paso 1: Tipo de operación */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      1. Tipo de operación
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setTipo('Compra');
                          setSelectedOriginAccount(null);
                          setSelectedDestinationAccount(null);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          tipo === 'Compra'
                            ? 'border-secondary bg-secondary text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <TrendingDown className="w-4 h-4" />
                        <div className="text-left">
                          <div className="text-sm font-bold">Compra</div>
                          <div className="text-xs opacity-90">S/ {exchangeRates.compra.toFixed(3)}</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTipo('Venta');
                          setSelectedOriginAccount(null);
                          setSelectedDestinationAccount(null);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                          tipo === 'Venta'
                            ? 'border-secondary bg-secondary text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        <div className="text-left">
                          <div className="text-sm font-bold">Venta</div>
                          <div className="text-xs opacity-90">S/ {exchangeRates.venta.toFixed(3)}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Paso 2: Calculadora compacta */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      2. Ingresa el monto
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            {tipo === 'Compra' ? 'Entregas' : 'Pagas'}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                              {inputCurrency === 'USD' ? '$' : 'S/'}
                            </span>
                            <input
                              type="number"
                              value={amountInput}
                              onChange={(e) => setAmountInput(e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-8 pr-3 py-2 text-lg font-bold text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Recibes</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                              {outputCurrency === 'USD' ? '$' : 'S/'}
                            </span>
                            <div className="w-full pl-8 pr-3 py-2 text-lg font-bold text-gray-900 bg-white border-2 border-gray-300 rounded-lg">
                              {amountOutput || '0.00'}
                            </div>
                          </div>
                        </div>
                      </div>
                      {amountOutput && (
                        <div className="flex justify-between text-xs text-gray-600 px-1">
                          <span>TC: {currentRate.toFixed(3)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Paso 3: Cuenta de cargo */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        3. Cuenta de cargo
                        <span className="text-xs font-normal text-gray-600 ml-2">
                          ({tipo === 'Compra' ? 'Cuenta en dólares' : 'Cuenta en soles'})
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddAccountModalOpen(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary-700 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedOriginAccount ?? ''}
                        onChange={(e) => setSelectedOriginAccount(e.target.value ? Number(e.target.value) : null)}
                        className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">Selecciona una cuenta</option>
                        {getOriginAccounts().map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.banco} - {account.numero_cuenta} ({account.moneda} - {account.tipo_cuenta})
                          </option>
                        ))}
                      </select>
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {getOriginAccounts().length === 0 && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        No tienes cuentas en {tipo === 'Compra' ? 'dólares' : 'soles'}.{' '}
                        <button
                          type="button"
                          onClick={() => setIsAddAccountModalOpen(true)}
                          className="underline ml-1 hover:text-amber-700"
                        >
                          Agregar cuenta
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Paso 4: Cuenta de destino */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        4. Cuenta de destino
                        <span className="text-xs font-normal text-gray-600 ml-2">
                          ({tipo === 'Compra' ? 'Cuenta en soles' : 'Cuenta en dólares'})
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddAccountModalOpen(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary-700 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedDestinationAccount ?? ''}
                        onChange={(e) => setSelectedDestinationAccount(e.target.value ? Number(e.target.value) : null)}
                        className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">Selecciona una cuenta</option>
                        {getDestinationAccounts().map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.banco} - {account.numero_cuenta} ({account.moneda} - {account.tipo_cuenta})
                          </option>
                        ))}
                      </select>
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {getDestinationAccounts().length === 0 && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        No tienes cuentas en {tipo === 'Compra' ? 'soles' : 'dólares'}.{' '}
                        <button
                          type="button"
                          onClick={() => setIsAddAccountModalOpen(true)}
                          className="underline ml-1 hover:text-amber-700"
                        >
                          Agregar cuenta
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Paso 5: Confirmación de titularidad */}
                  <div>
                    <label className="flex items-start cursor-pointer bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <input
                        type="checkbox"
                        checked={ownershipConfirmed}
                        onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                        className="w-5 h-5 text-secondary focus:ring-secondary border-gray-300 rounded mt-0.5 flex-shrink-0"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-semibold text-gray-900 block">
                          Confirmo que soy titular de las cuentas bancarias
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          Declaro que las cuentas bancarias registradas son de mi titularidad y que la información proporcionada es verídica.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !amountInput ||
                      !amountOutput ||
                      selectedOriginAccount === null ||
                      selectedDestinationAccount === null ||
                      !ownershipConfirmed ||
                      !canCreateOperation()
                    }
                    className="w-full bg-gradient-to-r from-secondary to-secondary-700 text-white py-4 rounded-lg font-bold text-base hover:from-secondary-600 hover:to-secondary-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl group"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirmar Operación
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Tu dinero será transferido en menos de 10 minutos
                  </p>
                </form>
              ) : (
                /* STEP 3: Receive (placeholder) */
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Procesando tu operación</h3>
                  <p className="text-gray-600 mb-6">Estamos verificando tu transferencia. Recibirás tu dinero pronto.</p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-700 transition"
                  >
                    Volver al Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Operation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancelar Operación</h3>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancelReason('');
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isCancelling}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro que deseas cancelar esta operación? Esta acción no se puede deshacer.
              </p>

              {createdOperation && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Operación a cancelar</p>
                  <p className="font-semibold text-gray-900">{createdOperation.codigo_operacion}</p>
                  <p className="text-sm text-gray-600">
                    {createdOperation.tipo} - ${createdOperation.monto_dolares} / S/ {createdOperation.monto_soles}
                  </p>
                </div>
              )}

              {/* Motivo de cancelación */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Motivo de cancelación *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ej: No puedo realizar la transferencia en este momento"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isCancelling}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setCancelReason('');
                    setError(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
                  disabled={isCancelling}
                >
                  Volver
                </button>
                <button
                  onClick={handleCancelOperation}
                  disabled={isCancelling || !cancelReason.trim()}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCancelling ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Operación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Operation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirmar Operación</h3>
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 text-center mb-4">
                  ¿Está seguro que desea crear la operación <strong>{tipo}</strong> por{' '}
                  <strong>
                    {tipo === 'Compra'
                      ? `${parseFloat(amountInput).toFixed(2)} USD`
                      : `${parseFloat(amountOutput).toFixed(2)} USD`}
                  </strong>{' '}
                  al tipo de cambio{' '}
                  <strong>S/ {(tipo === 'Compra' ? currentRates?.tipo_compra : currentRates?.tipo_venta)?.toFixed(3)}</strong>?
                </p>

                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-semibold text-gray-900">{tipo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monto en dólares:</span>
                    <span className="font-semibold text-gray-900">
                      $ {tipo === 'Compra' ? parseFloat(amountInput).toFixed(2) : parseFloat(amountOutput).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monto en soles:</span>
                    <span className="font-semibold text-gray-900">
                      S/ {tipo === 'Compra' ? parseFloat(amountOutput).toFixed(2) : parseFloat(amountInput).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo de cambio:</span>
                    <span className="font-semibold text-gray-900">
                      S/ {(tipo === 'Compra' ? currentRates?.tipo_compra : currentRates?.tipo_venta)?.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setError(null);
                }}
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmAndCreate}
                disabled={isSubmitting}
                className="flex-1 bg-secondary text-white py-3 px-4 rounded-lg font-semibold hover:bg-secondary-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Operación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Proof Modal */}
      {isUploadProofModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Agregar Comprobante</h3>
              <button
                onClick={() => {
                  setIsUploadProofModalOpen(false);
                  setUploadedFiles([]);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isUploadingProof}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Info Text */}
              <p className="text-sm text-gray-600">
                Sube tu comprobante de transferencia para que podamos procesar tu operación.
              </p>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Comprobante de pago (máximo 4 archivos)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploadingProof || uploadedFiles.length >= 4}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {uploadedFiles.length >= 4
                        ? 'Máximo de archivos alcanzado'
                        : 'Haz clic para seleccionar archivos'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF ({uploadedFiles.length}/4 archivos)
                    </p>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <FileImage className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700 transition"
                          disabled={isUploadingProof}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Operation Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Código de operación
                </label>
                <input
                  type="text"
                  value={operationCode}
                  readOnly
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono"
                />
              </div>

              {/* Alternative Channels */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>También puedes enviar tu comprobante a:</strong>
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:info@qoricash.pe"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    <Mail className="w-4 h-4" />
                    info@qoricash.pe
                  </a>
                  <a
                    href="https://wa.me/51940825008"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsUploadProofModalOpen(false);
                    setUploadedFiles([]);
                    setError(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
                  disabled={isUploadingProof}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitProof}
                  disabled={isUploadingProof}
                  className="flex-1 bg-gradient-to-r from-secondary to-secondary-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-secondary-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUploadingProof ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      <AddBankAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSuccess={handleAddAccountSuccess}
        dni={user?.dni || ''}
      />
    </div>
  );
}
