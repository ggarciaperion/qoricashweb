'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useReferralStore } from '@/lib/store/referralStore';
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
  Tag,
} from 'lucide-react';
import Image from 'next/image';

export default function NuevaOperacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, refreshUser } = useAuthStore();
  const { currentRates, fetchRates, isConnected, startRateSubscription } = useExchangeStore();
  const { clearReferral } = useReferralStore();

  // Form state
  const [tipo, setTipo] = useState<'Compra' | 'Venta'>('Compra');
  const [amountInput, setAmountInput] = useState('');
  const [amountOutput, setAmountOutput] = useState('');
  const [selectedOriginAccount, setSelectedOriginAccount] = useState<number | null>(null);
  const [selectedDestinationAccount, setSelectedDestinationAccount] = useState<number | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);

  // Referral/Coupon state - Always start empty
  const [showCouponField, setShowCouponField] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValidation, setCodeValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.003 when code is valid

  // UI state
  const [currentStep, setCurrentStep] = useState(1); // 1: Cotiza, 2: Transfiere, 3: Recibe
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [accountContext, setAccountContext] = useState<'cargo' | 'destino' | null>(null);

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
  const [voucherCode, setVoucherCode] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // KYC Document upload state
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [dniFront, setDnifront] = useState<File | null>(null);
  const [dniBack, setDniBack] = useState<File | null>(null);

  // Estado de verificación automática de cuenta activada
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showActivationToast, setShowActivationToast] = useState(false);
  const [rucFicha, setRucFicha] = useState<File | null>(null);
  const [isUploadingKYC, setIsUploadingKYC] = useState(false);

  // Formatted date for display - compute on client side only
  const [formattedDate, setFormattedDate] = useState<string>('');

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
  }, [amountInput, tipo, currentRates, appliedDiscount]);

  // Check if loading existing operation from dashboard
  useEffect(() => {
    const operationId = searchParams.get('operation_id');
    if (operationId && isAuthenticated && user) {
      loadExistingOperation(operationId);
    }
  }, [searchParams, isAuthenticated, user]);

  const loadExistingOperation = async (operationId: string) => {
    console.log('[Nueva Operación] Cargando operación existente:', operationId);
    try {
      // Fetch operation details from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/web/my-operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: user!.dni })
      });

      if (!response.ok) throw new Error('Failed to fetch operations');

      const data = await response.json();
      console.log('[Nueva Operación] Respuesta API:', data);

      // El backend devuelve data.data como un array directamente
      const operations = data.data || [];
      const operation = operations.find((op: any) => op.codigo_operacion === operationId || op.operation_id === operationId);

      if (!operation) {
        console.error('[Nueva Operación] Operación no encontrada:', operationId);
        console.error('[Nueva Operación] Operaciones disponibles:', operations);
        return;
      }

      // Only load if operation is "Pendiente"
      if (operation.estado.toLowerCase() !== 'pendiente') {
        console.log('[Nueva Operación] Operación no está pendiente, redirigiendo al dashboard');
        router.push('/dashboard');
        return;
      }

      console.log('[Nueva Operación] Operación cargada:', operation);

      // Calculate time remaining (15 minutes from creation)
      const createdAt = new Date(operation.fecha_creacion);
      const now = new Date();

      console.log('[Nueva Operación] Debug tiempos:', {
        fecha_creacion_raw: operation.fecha_creacion,
        createdAt_parsed: createdAt.toISOString(),
        now: now.toISOString(),
        createdAt_timestamp: createdAt.getTime(),
        now_timestamp: now.getTime(),
        difference_ms: now.getTime() - createdAt.getTime()
      });

      const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
      const remaining = Math.max(0, 900 - elapsedSeconds); // 900 seconds = 15 minutes

      console.log('[Nueva Operación] Cálculo tiempo:', {
        elapsedSeconds,
        remaining,
        remainingMinutes: Math.floor(remaining / 60)
      });

      // Set operation data and jump to step 2
      setCreatedOperation(operation);
      setTimeRemaining(remaining);
      setCurrentStep(2);
      setTipo(operation.tipo === 'compra' ? 'Compra' : 'Venta');
    } catch (error) {
      console.error('[Nueva Operación] Error cargando operación:', error);
      setError('Error al cargar la operación');
    }
  };

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

  // Verificar automáticamente el estado de la cuenta cuando tiene documentos pendientes
  useEffect(() => {
    // Solo ejecutar si el usuario tiene status Activo pero no tiene documentos completos
    // Esto significa que subió documentos y está esperando aprobación
    if (!user || user.status !== 'Activo' || user.has_complete_documents) {
      return;
    }

    console.log('🔄 Iniciando verificación automática de estado de cuenta...');

    const checkAccountStatus = async () => {
      if (isCheckingStatus) return; // Evitar múltiples llamadas simultáneas

      setIsCheckingStatus(true);
      try {
        console.log('📡 Verificando estado de cuenta...');
        const success = await refreshUser();

        if (success && useAuthStore.getState().user?.has_complete_documents) {
          console.log('✅ ¡Cuenta activada! Mostrando notificación...');
          setShowActivationToast(true);

          // Ocultar toast después de 10 segundos
          setTimeout(() => {
            setShowActivationToast(false);
          }, 10000);
        }
      } catch (error) {
        console.error('Error verificando estado:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    // Verificar inmediatamente
    checkAccountStatus();

    // Verificar cada 30 segundos
    const interval = setInterval(checkAccountStatus, 30000);

    return () => clearInterval(interval);
  }, [user?.status, user?.has_complete_documents, refreshUser, isCheckingStatus]);

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

  // Memoize canCreateOperation to automatically update when bankAccounts changes
  const canCreateOperation = useMemo(() => {
    const hasSoles = bankAccounts.some(acc => acc.moneda === 'S/');
    const hasDolares = bankAccounts.some(acc => acc.moneda === '$');
    console.log('[Nueva Operación] Verificando cuentas:', {
      totalCuentas: bankAccounts.length,
      hasSoles,
      hasDolares,
      canCreate: hasSoles && hasDolares
    });
    return hasSoles && hasDolares;
  }, [bankAccounts]);

  // Get adjusted exchange rate with referral discount applied
  const getAdjustedRate = () => {
    if (!currentRates) return 0;

    if (tipo === 'Compra') {
      // Compra: QoriCash compra dólares al cliente
      // Beneficio: suma 0.003 al tipo de cambio
      return appliedDiscount > 0
        ? currentRates.tipo_compra + appliedDiscount
        : currentRates.tipo_compra;
    } else {
      // Venta: QoriCash vende dólares al cliente
      // Beneficio: resta 0.003 al tipo de cambio
      return appliedDiscount > 0
        ? currentRates.tipo_venta - appliedDiscount
        : currentRates.tipo_venta;
    }
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

    // Apply referral discount if code is valid
    let adjustedRate = 0;
    if (tipo === 'Compra') {
      // Compra: QoriCash compra dólares al cliente
      // Beneficio: suma 0.003 al tipo de cambio
      adjustedRate = appliedDiscount > 0
        ? currentRates.tipo_compra + appliedDiscount
        : currentRates.tipo_compra;
      const pen = (amount * adjustedRate).toFixed(2);
      setAmountOutput(pen);
    } else {
      // Venta: QoriCash vende dólares al cliente
      // Beneficio: resta 0.003 al tipo de cambio
      adjustedRate = appliedDiscount > 0
        ? currentRates.tipo_venta - appliedDiscount
        : currentRates.tipo_venta;
      const usd = (amount / adjustedRate).toFixed(2);
      setAmountOutput(usd);
    }
  };

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code || code.length !== 6) {
      setCodeValidation({ isValid: false, message: 'Código inválido' });
      setAppliedDiscount(0);
      return;
    }

    setIsValidatingCode(true);
    try {
      // Llamada real a la API de validación
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/referrals/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          client_dni: user?.dni || ''
        })
      });

      const data = await response.json();

      if (data.success && data.is_valid) {
        // Código válido
        setCodeValidation({ isValid: true, message: '¡Código aplicado! Beneficio de 30 pips en el tipo de cambio' });
        setAppliedDiscount(0.003);
      } else {
        // Código inválido
        setCodeValidation({ isValid: false, message: data.message || 'Código de referido inválido' });
        setAppliedDiscount(0);
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setCodeValidation({ isValid: false, message: 'Error al validar código. Intenta nuevamente.' });
      setAppliedDiscount(0);
    } finally {
      setIsValidatingCode(false);
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
      // Determinar qué cuenta enviar: la cuenta donde el cliente RECIBIRÁ el pago
      // Para Compra: recibe soles (selectedDestinationAccount)
      // Para Venta: recibe dólares (selectedDestinationAccount)
      const accountIdToSend = selectedDestinationAccount!;

      // Convertir el ID de BD a índice del array bankAccounts
      const accountIndex = bankAccounts.findIndex(acc => acc.id === accountIdToSend);

      console.log('[Nueva Operación] Enviando operación:', {
        tipo,
        accountIdToSend,
        accountIndex,
        totalAccounts: bankAccounts.length,
        selectedAccount: bankAccounts[accountIndex]
      });

      if (accountIndex === -1) {
        setError('Cuenta bancaria no encontrada');
        setIsSubmitting(false);
        return;
      }

      const response = await operationsApi.createOperation({
        dni: user!.dni,
        tipo: tipo.toLowerCase() as 'compra' | 'venta',
        monto_soles: tipo === 'Compra' ? parseFloat(amountOutput) : parseFloat(amountInput),
        monto_dolares: tipo === 'Compra' ? parseFloat(amountInput) : parseFloat(amountOutput),
        banco_cuenta_id: accountIndex,  // Enviar índice del array, no el ID de BD
        // CRÍTICO: Enviar código de referido solo si fue validado exitosamente
        ...(codeValidation?.isValid && referralCode ? { referral_code: referralCode } : {})
      });

      console.log('[Nueva Operación] Respuesta del servidor:', response);

      if (response.success && response.data) {
        console.log('[Nueva Operación] Operación creada:', response.data.operation);

        // Format date on client side to avoid hydration mismatch
        const operation = response.data.operation;
        const formattedDateString = operation.created_at
          ? new Date(operation.created_at).toLocaleString('es-PE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Ahora';

        setFormattedDate(formattedDateString);
        setCreatedOperation(operation);
        setTimeRemaining(900); // Reset contador a 15 minutos
        setCurrentStep(2); // Avanzar inmediatamente al paso 2: Transfiere

        // Clear referral code after successful operation creation
        setReferralCode('');
        setCodeValidation(null);
        setAppliedDiscount(0);
        setShowCouponField(false);
        clearReferral(); // Clear from persistent storage
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

  // Upload KYC Documents
  const handleUploadKYCDocuments = async () => {
    if (!dniFront || !dniBack) {
      setError('Debes subir ambas fotos del DNI (anverso y reverso)');
      return;
    }

    // Validar Ficha RUC para RUC
    if (user?.document_type === 'RUC' && !rucFicha) {
      setError('Debes subir la Ficha RUC para persona jurídica');
      return;
    }

    if (!user?.dni) {
      setError('No se pudo obtener el DNI del usuario');
      return;
    }

    setIsUploadingKYC(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('dni', user.dni);
      formData.append('dni_front', dniFront);
      formData.append('dni_back', dniBack);

      if (user.document_type === 'RUC' && rucFicha) {
        formData.append('ruc_ficha', rucFicha);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/client/upload-dni`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar el estado del usuario desde el backend
        await refreshUser();

        setIsKYCModalOpen(false);
        setDnifront(null);
        setDniBack(null);
        setRucFicha(null);
        setIsUploadingKYC(false);

        // Mostrar mensaje de éxito
        alert('Documentos enviados exitosamente. Estamos validando tu información. Nuestro equipo revisará tus documentos y activará tu cuenta en un plazo aproximado de 10 minutos.');
      } else {
        setError(data.message || 'Error al subir documentos');
        setIsUploadingKYC(false);
      }
    } catch (err: any) {
      console.error('Error al subir documentos KYC:', err);
      setError('Error al subir documentos. Por favor intenta nuevamente.');
      setIsUploadingKYC(false);
    }
  };

  // Submit proof of payment
  const handleSubmitProof = async () => {
    if (!createdOperation) {
      setError('No hay operación creada');
      return;
    }

    setIsUploadingProof(true);
    setError(null);

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('operation_id', createdOperation.id.toString());

      // Agregar código de voucher si fue proporcionado
      if (voucherCode.trim()) {
        formData.append('voucher_code', voucherCode.trim());
      }

      // Agregar archivos
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Enviar al backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://qoricash-trading-v2.onrender.com'}/api/web/submit-proof`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Cerrar modal
        setIsUploadProofModalOpen(false);
        setUploadedFiles([]);
        setVoucherCode('');

        // Mantener currentStep en 2 por 2 segundos para mostrar la animación
        // de la línea 2→3 antes de avanzar al paso 3
        setTimeout(() => {
          setCurrentStep(3);
        }, 2000);
      } else {
        setError(data.message || 'Error al enviar comprobante');
        setIsUploadingProof(false);
      }
    } catch (err: any) {
      console.error('Error al enviar comprobante:', err);
      setError('Error al enviar comprobante. Por favor intenta nuevamente.');
      setIsUploadingProof(false);
    }
  };

  // Get QoriCash account based on client bank and operation type
  const getQoricashAccount = () => {
    if (!createdOperation) {
      console.log('[getQoricashAccount] No hay operación creada');
      return null;
    }

    // Obtener el banco de la cuenta de origen desde la operación creada
    const sourceAccountInfo = createdOperation.source_account_info || createdOperation.source_account;
    if (!sourceAccountInfo) {
      console.log('[getQoricashAccount] No se encontró información de cuenta de origen en la operación');
      return null;
    }

    // Extraer el banco de la info de la cuenta - manejar tanto objetos como strings
    let clientBank;
    if (typeof sourceAccountInfo === 'object') {
      // Si es objeto, intentar obtener banco desde banco_nombre o banco
      clientBank = sourceAccountInfo.banco_nombre || sourceAccountInfo.banco || sourceAccountInfo.bank_name;

      // Si banco es null, intentar obtenerlo desde las cuentas bancarias del usuario
      if (!clientBank && selectedOriginAccount) {
        const originAccount = bankAccounts.find(acc => acc.id === selectedOriginAccount);
        clientBank = originAccount?.bank_name;
      }
    } else if (typeof sourceAccountInfo === 'string') {
      clientBank = sourceAccountInfo.split(' - ')[0];
    }

    if (!clientBank) {
      console.log('[getQoricashAccount] No se pudo determinar el banco. sourceAccountInfo:', sourceAccountInfo);
      return null;
    }

    const currency = createdOperation.operation_type === 'Compra' ? '$' : 'S/';

    console.log('[getQoricashAccount] Banco cliente:', clientBank, 'Moneda:', currency);

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

          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
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
                          {formattedDate || 'Ahora'}
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
                                </strong>
                                {createdOperation.source_account_info && (
                                  <>
                                    {' '}desde tu cuenta{' '}
                                    <strong>
                                      {createdOperation.source_account_info.banco} {' '}
                                      {createdOperation.source_account}
                                    </strong>
                                  </>
                                )}
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
                      }}
                      disabled={timeRemaining === 0}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center"
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
                  {/* Validación de estado del cliente (KYC) */}
                  {user?.status === 'Inactivo' && !user?.has_complete_documents && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-900 mb-2">
                            Cuenta Inactiva - Validación Pendiente
                          </p>
                          <p className="text-sm text-red-800 mb-3">
                            Para iniciar operaciones necesitamos validar tu información. Por favor, adjunta tus documentos para activar tu cuenta.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsKYCModalOpen(true);
                              setError(null);
                            }}
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                          >
                            <Upload className="w-4 h-4" />
                            Subir Documentos
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Toast de cuenta activada */}
                  {showActivationToast && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
                      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
                        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm mb-1">¡Cuenta Activada!</p>
                          <p className="text-xs opacity-90">
                            Tu cuenta ha sido verificada y activada exitosamente. Ya puedes operar sin límites.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowActivationToast(false)}
                          className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {user?.status === 'Inactivo' && user?.has_complete_documents && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <Clock className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-2">
                            Documentos en Proceso de Validación
                          </p>
                          <p className="text-sm text-blue-800 mb-3">
                            Tus documentos están siendo revisados por nuestro equipo. Te notificaremos cuando tu cuenta sea activada. Generalmente este proceso toma menos de 10 minutos.
                          </p>
                          <button
                            onClick={async () => {
                              setIsCheckingStatus(true);
                              try {
                                await refreshUser();
                              } finally {
                                setIsCheckingStatus(false);
                              }
                            }}
                            disabled={isCheckingStatus}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition"
                          >
                            {isCheckingStatus ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Verificando...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4" />
                                Verificar Estado
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validación de cuentas */}
                  {!canCreateOperation && (
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

                    {/* Botones de Compra y Venta */}
                    <style jsx>{`
                      @keyframes pulse-green {
                        0%, 100% {
                          opacity: 1;
                          transform: scale(1);
                        }
                        50% {
                          opacity: 0.8;
                          transform: scale(1.05);
                        }
                      }

                      .live-rate {
                        animation: pulse-green 2s ease-in-out infinite;
                      }
                    `}</style>
                    <div className="grid grid-cols-2 gap-3 mb-3">
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
                          {appliedDiscount > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              <div className="text-xs opacity-60 line-through">
                                S/ {exchangeRates.compra.toFixed(4)}
                              </div>
                              <div className={`text-xs font-bold ${tipo === 'Compra' ? 'text-green-200' : 'text-green-600'} live-rate`}>
                                S/ {(exchangeRates.compra + appliedDiscount).toFixed(4)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs opacity-90">S/ {exchangeRates.compra.toFixed(4)}</div>
                          )}
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
                          {appliedDiscount > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              <div className="text-xs opacity-60 line-through">
                                S/ {exchangeRates.venta.toFixed(4)}
                              </div>
                              <div className={`text-xs font-bold ${tipo === 'Venta' ? 'text-green-200' : 'text-green-600'} live-rate`}>
                                S/ {(exchangeRates.venta - appliedDiscount).toFixed(4)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs opacity-90">S/ {exchangeRates.venta.toFixed(4)}</div>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Checkbox y Campo de Cupón (debajo de los botones) */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={showCouponField}
                          onChange={(e) => {
                            setShowCouponField(e.target.checked);
                            if (!e.target.checked) {
                              // Clear all coupon-related state
                              setReferralCode('');
                              setCodeValidation(null);
                              setAppliedDiscount(0);
                              clearReferral(); // Clear from persistent storage
                            }
                          }}
                          className="w-4 h-4 text-success border-gray-300 rounded focus:ring-success cursor-pointer accent-success"
                        />
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-success-600 transition">
                          <Tag className="w-4 h-4" />
                          <span>Tengo un cupón promocional</span>
                        </div>
                      </label>

                      {/* Campo de código (se muestra cuando checkbox está marcado) */}
                      {showCouponField && (
                        <div className="bg-success-50 border-2 border-success-200 rounded-lg p-4 space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Ingresa tu cupón aquí
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase();
                                  setReferralCode(value);
                                  setCodeValidation(null);
                                  setAppliedDiscount(0);
                                }}
                                onBlur={() => {
                                  if (referralCode && referralCode.length === 6) {
                                    validateReferralCode(referralCode);
                                  }
                                }}
                                placeholder="Ej: ABC123"
                                maxLength={6}
                                className="flex-1 px-4 py-2 text-sm font-mono font-bold uppercase border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-success focus:border-transparent bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => validateReferralCode(referralCode)}
                                disabled={isValidatingCode || !referralCode || referralCode.length !== 6}
                                className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success-600 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                              >
                                {isValidatingCode ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Validando...
                                  </>
                                ) : (
                                  'Validar'
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Mensaje de validación */}
                          {codeValidation && (
                            <div className={`p-3 rounded-lg border-2 ${
                              codeValidation.isValid
                                ? 'bg-white border-success-300'
                                : 'bg-red-50 border-red-300'
                            }`}>
                              <p className={`text-sm flex items-start font-medium ${
                                codeValidation.isValid ? 'text-success-800' : 'text-red-800'
                              }`}>
                                {codeValidation.isValid ? (
                                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                                )}
                                <span>{codeValidation.message}</span>
                              </p>
                            </div>
                          )}

                          {/* Información sobre el beneficio */}
                          {!codeValidation && (
                            <div className="flex items-start gap-2 text-xs text-success-800">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <p>
                                Al usar un código de promoción, obtendrás un mejor tipo de cambio.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
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
                        onClick={() => {
                          setAccountContext('cargo');
                          setIsAddAccountModalOpen(true);
                        }}
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
                          onClick={() => {
                            setAccountContext('cargo');
                            setIsAddAccountModalOpen(true);
                          }}
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
                        onClick={() => {
                          setAccountContext('destino');
                          setIsAddAccountModalOpen(true);
                        }}
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
                          onClick={() => {
                            setAccountContext('destino');
                            setIsAddAccountModalOpen(true);
                          }}
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
                      !canCreateOperation ||
                      user?.status === 'Inactivo'
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
                  <style jsx>{`
                    @keyframes pulse-ring {
                      0% {
                        transform: scale(0.95);
                        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                      }

                      50% {
                        transform: scale(1);
                        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
                      }

                      100% {
                        transform: scale(0.95);
                        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
                      }
                    }

                    .processing-icon {
                      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                  `}</style>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 processing-icon">
                    <RefreshCw className="w-10 h-10 text-green-600 animate-spin" style={{ animationDuration: '2s' }} />
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
                  <strong>S/ {getAdjustedRate()?.toFixed(3)}</strong>?
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
                      S/ {getAdjustedRate()?.toFixed(3)}
                    </span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-green-600">🎉 Descuento por referido:</span>
                      <span className="font-semibold text-green-600">
                        {appliedDiscount.toFixed(3)}
                      </span>
                    </div>
                  )}
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
                  setVoucherCode('');
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

              {/* Voucher Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Código / Número de operación
                </label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Ej: 123456789"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  disabled={isUploadingProof}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el número de operación o código de tu comprobante de transferencia
                </p>
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
                    setVoucherCode('');
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

      {/* KYC Document Upload Modal */}
      {isKYCModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Validación de Documentos</h3>
              <button
                onClick={() => {
                  setIsKYCModalOpen(false);
                  setDnifront(null);
                  setDniBack(null);
                  setRucFicha(null);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isUploadingKYC}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Info Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {user?.document_type === 'RUC'
                    ? 'Para activar tu cuenta, necesitamos que subas los documentos del representante legal y la Ficha RUC de tu empresa.'
                    : 'Para activar tu cuenta, necesitamos que subas ambas caras de tu documento de identidad.'}
                </p>
                <p className="text-sm text-blue-800 mt-2 font-semibold">
                  Nuestro equipo validará tus documentos en aproximadamente 10 minutos.
                </p>
              </div>

              {/* DNI Front Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {user?.document_type === 'RUC' ? 'DNI Representante Legal - Anverso *' : 'DNI/CE - Anverso *'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-secondary transition">
                  <input
                    type="file"
                    id="dni-front-upload"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDnifront(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    disabled={isUploadingKYC}
                  />
                  <label htmlFor="dni-front-upload" className="cursor-pointer flex flex-col items-center">
                    {dniFront ? (
                      <div className="flex items-center gap-2">
                        <FileImage className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{dniFront.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Haz clic para seleccionar imagen</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG (máx. 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* DNI Back Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {user?.document_type === 'RUC' ? 'DNI Representante Legal - Reverso *' : 'DNI/CE - Reverso *'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-secondary transition">
                  <input
                    type="file"
                    id="dni-back-upload"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDniBack(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    disabled={isUploadingKYC}
                  />
                  <label htmlFor="dni-back-upload" className="cursor-pointer flex flex-col items-center">
                    {dniBack ? (
                      <div className="flex items-center gap-2">
                        <FileImage className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{dniBack.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Haz clic para seleccionar imagen</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG (máx. 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* RUC Ficha Upload (only for RUC) */}
              {user?.document_type === 'RUC' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ficha RUC *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-secondary transition">
                    <input
                      type="file"
                      id="ruc-ficha-upload"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setRucFicha(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      disabled={isUploadingKYC}
                    />
                    <label htmlFor="ruc-ficha-upload" className="cursor-pointer flex flex-col items-center">
                      {rucFicha ? (
                        <div className="flex items-center gap-2">
                          <FileImage className="w-6 h-6 text-green-600" />
                          <span className="text-sm font-medium text-green-700">{rucFicha.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">Haz clic para seleccionar archivo</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (máx. 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

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
                    setIsKYCModalOpen(false);
                    setDnifront(null);
                    setDniBack(null);
                    setRucFicha(null);
                    setError(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
                  disabled={isUploadingKYC}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadKYCDocuments}
                  disabled={isUploadingKYC || !dniFront || !dniBack || (user?.document_type === 'RUC' && !rucFicha)}
                  className="flex-1 bg-gradient-to-r from-secondary to-secondary-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-secondary-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUploadingKYC ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Enviar Documentos
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
        operationType={tipo}
        accountContext={accountContext || undefined}
      />
    </div>
  );
}
