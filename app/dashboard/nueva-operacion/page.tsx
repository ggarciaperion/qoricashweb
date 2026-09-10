'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useExchangeStore } from '@/lib/store/exchangeStore';
import { useReferralStore } from '@/lib/store/referralStore';
import { operationsApi } from '@/lib/api/operations';
import { parseSafeDate } from '@/lib/utils/date';
import { banksApi } from '@/lib/api/banks';
import { getQoricashAccount } from '@/lib/config/qoricash-accounts';
import type { BankAccount } from '@/lib/types';
import AddBankAccountModal from '@/components/modals/AddBankAccountModal';
import OffHoursModal from '@/components/modals/OffHoursModal';
import Calculator from '@/components/Calculator';
import {
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  XCircle,
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
  Calculator as CalculatorIcon,
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

export function NuevaOperacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isAuthenticated, user, refreshUser } = useAuthStore();
  const isEmpresa = pathname.includes('/empresa') || user?.document_type === 'RUC';
  const isDemoMode = typeof window !== 'undefined' && process.env.NODE_ENV !== 'production' && (user?.dni === '99999901' || user?.dni === '20601234567');
  const { currentRates, fetchRates, isConnected, startRateSubscription } = useExchangeStore();
  const { clearReferral, hasCoupon: storeCoupon, referralCode: storeReferralCode } = useReferralStore();

  // Form state
  const [tipo, setTipo] = useState<'Compra' | 'Venta'>('Compra');
  const [amountInput, setAmountInput] = useState('');
  const [amountOutput, setAmountOutput] = useState('');
  const [selectedOriginAccount, setSelectedOriginAccount] = useState<number | null>(null);
  const [selectedDestinationAccount, setSelectedDestinationAccount] = useState<number | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);

  // Referral/Coupon state - Always start empty
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [showCouponField, setShowCouponField] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValidation, setCodeValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.003 when code is valid

  // UI state
  const [currentStep, setCurrentStep] = useState(1); // 1: Cotiza, 2: Selección cuentas, 3: Transfiere, 4: Adjunta y finaliza
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
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Processing overlays
  const [showCreatingOverlay, setShowCreatingOverlay] = useState(false);
  const [showCreatingSuccess, setShowCreatingSuccess] = useState(false);
  const createApiDoneRef = useRef(false);
  const createAnimDoneRef = useRef(false);
  const [showCancelOverlay, setShowCancelOverlay] = useState(false);
  const [showCancelOverlaySuccess, setShowCancelOverlaySuccess] = useState(false);
  const [showProofOverlay, setShowProofOverlay] = useState(false);
  const [showProofSuccess, setShowProofSuccess] = useState(false);
  const proofApiDoneRef = useRef(false);
  const proofAnimDoneRef = useRef(false);

  // Confirm operation state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmAnimating, setIsConfirmAnimating] = useState(false);

  // Upload proof state
  const [isUploadProofModalOpen, setIsUploadProofModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // KYC Document upload state
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [dniFront, setDnifront] = useState<File | null>(null);
  const [dniBack, setDniBack] = useState<File | null>(null);
  // Flag persistente: documentos enviados — sobrevive navegación via localStorage
  const [docsSubmittedThisSession, setDocsSubmittedThisSession] = useState(false);
  const setDocsPersisted = (val: boolean, uid?: number) => {
    const key = `kyc_pending_${uid ?? user?.id}`;
    if (val) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
    setDocsSubmittedThisSession(val);
  };

  // Estado de verificación automática de cuenta activada
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showActivationToast, setShowActivationToast] = useState(false);
  const [rucFicha, setRucFicha] = useState<File | null>(null);
  const [isUploadingKYC, setIsUploadingKYC] = useState(false);
  const [kycUploadDone, setKycUploadDone] = useState(false);
  const [showVerifyOverlay, setShowVerifyOverlay] = useState(false);
  const [verifyStillPending, setVerifyStillPending] = useState(false);
  const [showKycBlockedToast, setShowKycBlockedToast] = useState(false);
  const [cancelledNotification, setCancelledNotification] = useState<{
    code: string;
    notas?: string | null;
    tipo?: string;
  } | null>(null);
  const cancelNotifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Formatted date for display - compute on client side only
  const [formattedDate, setFormattedDate] = useState<string>('');

  // Estado para operación activa
  const [hasActiveOperation, setHasActiveOperation] = useState(false);
  const [activeOperationMessage, setActiveOperationMessage] = useState('');

  // Estado fuera de horario
  const [isOffHoursModalOpen, setIsOffHoursModalOpen] = useState(false);
  const [pendingSubmitEvent, setPendingSubmitEvent] = useState<React.FormEvent | null>(null);

  const isWithinBusinessHours = (): boolean => {
    const now = new Date();
    // Hora de Lima (UTC-5)
    const lima = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
    const day = lima.getDay(); // 0=Dom, 1=Lun, ..., 6=Sáb
    const hour = lima.getHours();
    const minute = lima.getMinutes();
    const time = hour * 60 + minute;

    if (day >= 1 && day <= 5) {
      // Lunes a Viernes: 9:00 - 18:00
      return time >= 9 * 60 && time < 18 * 60;
    }
    if (day === 6) {
      // Sábado: 9:00 - 13:00
      return time >= 9 * 60 && time < 13 * 60;
    }
    return false; // Domingo
  };

  const getNextBusinessDay = (): string => {
    const now = new Date();
    const lima = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
    const day = lima.getDay();

    let daysToAdd = 1;
    if (day === 5) daysToAdd = 1; // Viernes -> Sábado (trabajamos sábados)
    if (day === 6) daysToAdd = 2; // Sábado -> Lunes
    if (day === 0) daysToAdd = 1; // Domingo -> Lunes

    // Si es día hábil pero ya pasó el horario, el siguiente día hábil es mañana (o lunes si es viernes)
    if (day >= 1 && day <= 4) {
      daysToAdd = 1;
    }

    const next = new Date(lima);
    next.setDate(lima.getDate() + daysToAdd);

    return next.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'America/Lima',
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadInitialData();
    checkForActiveOperations();
  }, [isAuthenticated]);

  // Start WebSocket subscription for real-time rates
  useEffect(() => {
    const cleanup = startRateSubscription();
    return () => { cleanup(); };
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

  // Precargar monto y tipo desde calculadora del homepage
  useEffect(() => {
    const tipoParam = searchParams.get('tipo') as 'Compra' | 'Venta' | null;
    const montoParam = searchParams.get('monto');
    if (montoParam && parseFloat(montoParam) > 0) {
      if (tipoParam === 'Compra' || tipoParam === 'Venta') setTipo(tipoParam);
      setAmountInput(montoParam);
    }
  }, []);

  // Restore docsSubmittedThisSession from localStorage when user loads
  useEffect(() => {
    if (!user?.id) return;
    const key = `kyc_pending_${user.id}`;
    if (localStorage.getItem(key) === '1' && !user.has_complete_documents) {
      setDocsPersisted(true);
    }
  }, [user?.id]);

  // Clear persisted flag once KYC is approved
  useEffect(() => {
    if (user?.has_complete_documents && user?.id) {
      localStorage.removeItem(`kyc_pending_${user.id}`);
      setDocsSubmittedThisSession(false);
    }
  }, [user?.has_complete_documents, user?.id]);

  // Al montar: mostrar notificación de cancelación pendiente (guardada antes de navegación)
  useEffect(() => {
    const stored = sessionStorage.getItem('qc_op_cancelled_notif');
    if (stored) {
      try {
        setCancelledNotification(JSON.parse(stored));
        sessionStorage.removeItem('qc_op_cancelled_notif');
      } catch {}
    }
  }, []);

  // Polling cada 15 s en step 3 para detectar cancelación externa desde el sistema
  useEffect(() => {
    if (currentStep !== 3 || !createdOperation || !user?.dni || isDemoMode) return;

    const API = process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe';
    const targetId = createdOperation.id;
    const targetCode = createdOperation.codigo_operacion || createdOperation.operation_id;

    const poll = async () => {
      try {
        const res = await fetch(`${API}/api/web/my-operations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dni: user!.dni }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const ops: any[] = data.data || [];
        const op = ops.find((o) => o.id === targetId || o.codigo_operacion === targetCode || o.operation_id === targetCode);
        if (op && (op.estado === 'cancelado' || op.estado === 'expirado' || op.estado === 'rechazado')) {
          const notif = { code: targetCode, notas: op.notas || op.notes, tipo: op.estado };
          sessionStorage.setItem('qc_op_cancelled_notif', JSON.stringify(notif));
          setCancelledNotification(notif);
          setCreatedOperation(null);
          setHasActiveOperation(false);
          setCurrentStep(1);
        }
      } catch {}
    };

    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [currentStep, createdOperation, user?.dni]);

  // Auto-dismiss de notificación de cancelación tras 15 segundos
  useEffect(() => {
    if (!cancelledNotification) return;
    if (cancelNotifTimerRef.current) clearTimeout(cancelNotifTimerRef.current);
    cancelNotifTimerRef.current = setTimeout(() => {
      setCancelledNotification(null);
      sessionStorage.removeItem('qc_op_cancelled_notif');
    }, 15000);
    return () => { if (cancelNotifTimerRef.current) clearTimeout(cancelNotifTimerRef.current); };
  }, [cancelledNotification]);

  const loadExistingOperation = async (operationId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/web/my-operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: user!.dni })
      });

      if (!response.ok) throw new Error('Failed to fetch operations');

      const data = await response.json();

      // El backend devuelve data.data como un array directamente
      const operations = data.data || [];
      const operation = operations.find((op: any) => op.codigo_operacion === operationId || op.operation_id === operationId);

      if (!operation) return;

      // Only load if operation is "Pendiente"
      if (operation.estado.toLowerCase() !== 'pendiente') {
        router.push('/dashboard');
        return;
      }

      // Calculate time remaining (15 minutes from creation)
      // IMPORTANTE: El backend devuelve fechas en hora de Perú (UTC-5) sin timezone
      // NO añadir 'Z' para que se interprete como hora local
      let createdAt: Date;
      const dateString = operation.fecha_creacion || operation.created_at;

      if (!dateString) {
        createdAt = new Date();
      } else {
        // Parsear como hora local (Perú) sin añadir 'Z'
        // Si tiene 'Z', quitarla porque la fecha ya está en hora de Perú
        const cleanDateStr = dateString.endsWith('Z') ? dateString.slice(0, -1) : dateString;
        createdAt = new Date(cleanDateStr);
      }

      const now = new Date();
      const elapsedMs = now.getTime() - createdAt.getTime();
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const remaining = Math.max(0, 900 - elapsedSeconds); // 900 seconds = 15 minutes

      // Set operation data and jump to step 3 (Transfiere)
      setCreatedOperation(operation);
      setTimeRemaining(remaining);
      setCurrentStep(3);

      // Normalizar tipo de operación
      const operationType = (operation.tipo || operation.operation_type || '').toLowerCase();
      setTipo(operationType === 'compra' ? 'Compra' : 'Venta');
    } catch (error) {
      console.error('[Nueva Operación] Error cargando operación:', error);
      setError('Error al cargar la operación');
    }
  };

  const checkForActiveOperations = async () => {
    if (!user?.dni) return;

    // ── DEMO MODE ──────────────────────────────────────────────────────
    if (isDemoMode) { setHasActiveOperation(false); return; }
    // ──────────────────────────────────────────────────────────────────

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/web/my-operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: user.dni })
      });

      if (!response.ok) return;

      const data = await response.json();
      const operations = data.data || [];

      // Buscar operaciones en estado "Pendiente" o "En proceso"
      const activeOp = operations.find((op: any) =>
        op.estado === 'Pendiente' || op.estado === 'En proceso'
      );

      if (activeOp) {
        setHasActiveOperation(true);
        setActiveOperationMessage(
          `Tienes una operación en estado "${activeOp.estado}" (${activeOp.codigo_operacion || activeOp.operation_id}). Debes completarla o cancelarla antes de crear una nueva.`
        );
      } else {
        setHasActiveOperation(false);
        setActiveOperationMessage('');
      }
    } catch (error) {
      console.error('Error checking for active operations:', error);
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

    const checkAccountStatus = async () => {
      if (isCheckingStatus) return; // Evitar múltiples llamadas simultáneas

      setIsCheckingStatus(true);
      try {
        const success = await refreshUser();

        if (success && useAuthStore.getState().user?.has_complete_documents) {
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

    // ── DEMO MODE ──────────────────────────────────────────────────────
    if (isDemoMode) {
      setBankAccounts([
        { id: 0, bank_name: 'BCP', account_number: '191-12345678-0-01', account_type: 'Ahorros', currency: '$', moneda: '$', banco: 'BCP', numero_cuenta: '191-12345678-0-01', tipo_cuenta: 'Ahorros', is_primary: true, origen: 'DEMO' },
        { id: 1, bank_name: 'Interbank', account_number: '200-3001234567', account_type: 'Ahorros', currency: 'S/', moneda: 'S/', banco: 'Interbank', numero_cuenta: '200-3001234567', tipo_cuenta: 'Ahorros', is_primary: false, origen: 'DEMO' },
        { id: 2, bank_name: 'BBVA', account_number: '0011-0141-01-00123456', account_type: 'Corriente', currency: '$', moneda: '$', banco: 'BBVA', numero_cuenta: '0011-0141-01-00123456', tipo_cuenta: 'Corriente', is_primary: false, origen: 'DEMO' },
      ]);
      return;
    }
    // ──────────────────────────────────────────────────────────────────

    try {
      const accountsResponse = await banksApi.getMyAccounts(user.dni);

      if (accountsResponse.success && accountsResponse.data) {
        const transformedAccounts = accountsResponse.data.map((acc: any, index: number) => ({
          id: index,
          bank_name: acc.bank_name || acc.banco,
          account_number: acc.account_number || acc.numero_cuenta,
          account_type: acc.account_type || acc.tipo_cuenta,
          currency: acc.currency || acc.moneda,
          origen: acc.origen,
          is_primary: index === 0,
          // Legacy fields for backwards compatibility
          banco: acc.bank_name || acc.banco,
          numero_cuenta: acc.account_number || acc.numero_cuenta,
          tipo_cuenta: acc.account_type || acc.tipo_cuenta,
          moneda: acc.currency || acc.moneda,
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
    return hasSoles && hasDolares;
  }, [bankAccounts]);

  // ── KYC state helpers ─────────────────────────────────────────────────────
  // kycApproved: documentos completos y aprobados → puede operar libremente
  const kycApproved = !!(user?.has_complete_documents);
  // kycBlocked: cuenta bloqueada por alcanzar límite sin docs (backend: kyc_status='bloqueado')
  const kycBlocked = user?.kyc_status === 'bloqueado';
  // hasUploadedDocs: el backend ya tiene las URLs de los documentos (subidos pero aún no aprobados)
  const hasUploadedDocs = isEmpresa
    ? !!(user?.ficha_ruc_url)
    : !!(user?.dni_front_url && user?.dni_back_url);
  // kycPendingReview: docs subidos (via URL del backend, localStorage, o cuenta Inactiva con docs)
  const kycPendingReview = docsSubmittedThisSession || hasUploadedDocs ||
    (user?.status === 'Inactivo' && !!(user?.has_complete_documents));
  // kycNeedsDocs: sin docs subidos, sin haber enviado, sin estar bloqueado
  const kycNeedsDocs = !kycApproved && !kycBlocked && !kycPendingReview;
  // kycBlocksOperation: bloquea crear operación en web
  const kycBlocksOperation = !kycApproved && (kycBlocked || kycPendingReview || kycNeedsDocs);

  // Get adjusted exchange rate with referral discount applied
  const getAdjustedRate = () => {
    if (!currentRates) return 0;

    if (tipo === 'Compra') {
      // Compra: Qoricash compra dólares al cliente
      // Beneficio: suma 0.003 al tipo de cambio
      return appliedDiscount > 0
        ? currentRates.tipo_compra + appliedDiscount
        : currentRates.tipo_compra;
    } else {
      // Venta: Qoricash vende dólares al cliente
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
      // Compra: Qoricash compra dólares al cliente
      // Beneficio: suma 0.003 al tipo de cambio
      adjustedRate = appliedDiscount > 0
        ? currentRates.tipo_compra + appliedDiscount
        : currentRates.tipo_compra;
      const pen = (amount * adjustedRate).toFixed(2);
      setAmountOutput(pen);
    } else {
      // Venta: Qoricash vende dólares al cliente
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

    // Verificar si hay una operación activa antes de continuar
    if (hasActiveOperation) {
      setError(activeOperationMessage);
      return;
    }

    // Verificar horario de atención
    if (!isWithinBusinessHours()) {
      setPendingSubmitEvent(e);
      setIsOffHoursModalOpen(true);
      return;
    }

    await processSubmit();
  };

  const processSubmit = async () => {
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

    // Micro-animación antes de abrir modal
    setIsConfirmAnimating(true);
    setTimeout(() => {
      setIsConfirmAnimating(false);
      setIsConfirmModalOpen(true);
    }, 1800);
  };

  const handleCreateProgressEnd = () => {
    createAnimDoneRef.current = true;
    if (createApiDoneRef.current) {
      setShowCreatingSuccess(true);
      setTimeout(() => {
        setShowCreatingOverlay(false);
        setShowCreatingSuccess(false);
        setCurrentStep(3);
      }, 3500);
    }
  };

  const handleProofProgressEnd = () => {
    proofAnimDoneRef.current = true;
    if (proofApiDoneRef.current) {
      setShowProofSuccess(true);
      setTimeout(() => {
        setShowProofOverlay(false);
        setShowProofSuccess(false);
        setCurrentStep(4);
      }, 3000);
    }
  };

  const handleConfirmAndCreate = async () => {
    setError(null);
    setIsSubmitting(true);
    setIsConfirmModalOpen(false);
    setShowCreatingOverlay(true);
    setShowCreatingSuccess(false);
    createApiDoneRef.current = false;
    createAnimDoneRef.current = false;

    try {
      const destAccount = bankAccounts.find(a => a.id === selectedDestinationAccount);
      const originAccount = bankAccounts.find(a => a.id === selectedOriginAccount);

      // ── DEMO MODE ────────────────────────────────────────────────────
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1200));
        const demoOp = {
          id: 9999,
          codigo_operacion: 'DEMO-' + Math.floor(Math.random() * 90000 + 10000),
          tipo: tipo === 'Compra' ? 'compra' : 'venta',
          operation_type: tipo === 'Compra' ? 'compra' : 'venta',
          monto_dolares: tipo === 'Compra' ? parseFloat(amountInput) : parseFloat(amountOutput),
          monto_soles: tipo === 'Compra' ? parseFloat(amountOutput) : parseFloat(amountInput),
          amount_usd: tipo === 'Compra' ? parseFloat(amountInput) : parseFloat(amountOutput),
          amount_pen: tipo === 'Compra' ? parseFloat(amountOutput) : parseFloat(amountInput),
          tipo_cambio: getAdjustedRate(),
          exchange_rate: getAdjustedRate(),
          estado: 'Pendiente',
          status: 'Pendiente',
          source_bank_name: originAccount?.banco || originAccount?.bank_name || 'BCP',
          source_account: originAccount?.numero_cuenta || originAccount?.account_number || '191-12345678-0-01',
          destination_bank_name: destAccount?.banco || destAccount?.bank_name || 'Interbank',
          destination_account: destAccount?.numero_cuenta || destAccount?.account_number || '200-3001234567',
          qoricash_account: getQoricashAccount(tipo === 'Compra' ? '$' : 'S/', user?.origen || 'Lima'),
        };
        const now = new Date();
        setFormattedDate(now.toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
        setCreatedOperation(demoOp);
        setTimeRemaining(900);
        setHasActiveOperation(true);
        createApiDoneRef.current = true;
        if (createAnimDoneRef.current) {
          setShowCreatingSuccess(true);
          setTimeout(() => { setShowCreatingOverlay(false); setShowCreatingSuccess(false); setCurrentStep(3); }, 3500);
        }
        setIsSubmitting(false);
        return;
      }
      // ────────────────────────────────────────────────────────────────

      const response = await operationsApi.createOperation({
        dni: user!.dni,
        tipo: tipo === 'Compra' ? 'compra' : 'venta',
        monto_dolares: tipo === 'Compra' ? parseFloat(amountInput) : parseFloat(amountOutput),
        monto_soles: tipo === 'Compra' ? parseFloat(amountOutput) : parseFloat(amountInput),
        banco_cuenta_id: selectedDestinationAccount!,
        referral_code: codeValidation?.isValid ? referralCode.toUpperCase() : undefined,
      });

      if (!response.success || !response.data?.operation) {
        setShowCreatingOverlay(false);
        setError(response.message || 'Error al crear la operación');
        return;
      }

      const operation = response.data.operation;
      const now = new Date();
      const formattedDateString = now.toLocaleString('es-PE', {
        timeZone: 'America/Lima', day: '2-digit', month: '2-digit',
        year: 'numeric', hour: '2-digit', minute: '2-digit',
      });

      setFormattedDate(formattedDateString);
      setCreatedOperation({
        ...operation,
        source_bank_name: operation.source_bank_name || originAccount?.banco || originAccount?.bank_name || '',
        source_account: operation.source_account || originAccount?.numero_cuenta || originAccount?.account_number || '',
        destination_bank_name: destAccount?.banco || destAccount?.bank_name || '',
        destination_account: destAccount?.numero_cuenta || destAccount?.account_number || '',
        amount_usd: operation.monto_dolares,
        amount_pen: operation.monto_soles,
        exchange_rate: operation.tipo_cambio,
        operation_type: operation.tipo,
        status: operation.estado,
        qoricash_account: getQoricashAccount(tipo === 'Compra' ? '$' : 'S/', user?.origen || 'Lima'),
      });
      setTimeRemaining(900);
      setHasActiveOperation(true);
      setActiveOperationMessage(`Tienes una operación en estado "Pendiente" (${operation.codigo_operacion || operation.operation_id}). Debes completarla o cancelarla antes de crear una nueva.`);
      setReferralCode('');
      setCodeValidation(null);
      setAppliedDiscount(0);
      setShowCouponField(false);
      clearReferral();

      // Sincronizar con animación
      createApiDoneRef.current = true;
      if (createAnimDoneRef.current) {
        setShowCreatingSuccess(true);
        setTimeout(() => {
          setShowCreatingOverlay(false);
          setShowCreatingSuccess(false);
          setCurrentStep(3);
        }, 3500);
      }
    } catch (error: any) {
      setShowCreatingOverlay(false);
      setError(error.response?.data?.message || error.message || 'Error al crear la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBankLogo = (banco: string): string | null => {
    const name = banco.toLowerCase();
    if (name.includes('bcp') || name.includes('credito')) return '/BCP.png';
    if (name.includes('interbank')) return '/Interbank.png';
    if (name.includes('banbif')) return '/BanBif.png';
    if (name.includes('pichincha')) return '/Banco Pichincha.png';
    if (name.includes('bbva') || name.includes('continental')) return '/BBVA.png';
    if (name.includes('scotiabank')) return '/Scotiabank.png';
    if (name.includes('gnb')) return '/bancognb.jpg';
    if (name.includes('ripley')) return '/bancoripley.png';
    if (name.includes('santander')) return '/bancosantander.png';
    return null;
  };

  const getOriginAccounts = () => {
    const currency = tipo === 'Compra' ? '$' : 'S/';
    return bankAccounts.filter(acc => (acc.moneda || acc.currency) === currency);
  };

  const getDestinationAccounts = () => {
    const currency = tipo === 'Compra' ? 'S/' : '$';
    return bankAccounts.filter(acc => (acc.moneda || acc.currency) === currency);
  };

  // Timer countdown for Step 3
  useEffect(() => {
    if (currentStep === 3 && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Cancelar la operación automáticamente cuando el tiempo expira
            if (createdOperation) {
              handleCancelOperation('Tiempo expirado');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, createdOperation]);

  // Interceptar recarga/cierre cuando hay una operación en curso (Step 3)
  useEffect(() => {
    if (currentStep === 3 && createdOperation) {
      // Marcar operación en curso en sessionStorage para detectar recarga
      sessionStorage.setItem('qc_op_in_progress', String(createdOperation.id || '1'));

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      sessionStorage.removeItem('qc_op_in_progress');
    }
  }, [currentStep, createdOperation]);

  // Al montar: si la página fue recargada con una operación en curso, ir al dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingOp = sessionStorage.getItem('qc_op_in_progress');
      if (pendingOp) {
        sessionStorage.removeItem('qc_op_in_progress');
        router.replace('/dashboard');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const handleCancelOperation = async (reason?: string) => {
    const motivo = reason || cancelReason;

    if (!motivo.trim()) {
      setError('Por favor, indica el motivo de la cancelación');
      return;
    }

    if (!createdOperation?.id) {
      setError('No se encontró la operación para cancelar');
      return;
    }

    // Cerrar modal de confirmación y mostrar overlay de procesamiento
    setIsCancelModalOpen(false);
    setError(null);
    setShowCancelOverlay(true);
    setShowCancelOverlaySuccess(false);
    const startTime = Date.now();

    // ── DEMO MODE ──────────────────────────────────────────────────────
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 2000));
      setShowCancelOverlaySuccess(true);
      setTimeout(() => {
        setShowCancelOverlay(false);
        setShowCancelOverlaySuccess(false);
        setHasActiveOperation(false);
        setCreatedOperation(null);
        router.push(isEmpresa ? '/dashboard/empresa' : '/dashboard');
      }, 2500);
      return;
    }
    // ──────────────────────────────────────────────────────────────────

    try {
      const response = await operationsApi.cancelOperation(createdOperation.id, motivo);

      if (response.success) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2200 - elapsed);
        setTimeout(() => {
          setShowCancelOverlaySuccess(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 2500);
        }, remaining);
      } else {
        setShowCancelOverlay(false);
        setError(response.message || 'Error al cancelar la operación');
        setIsCancelModalOpen(true);
      }
    } catch (error: any) {
      console.error('[Cancel Operation] Error:', error);
      setShowCancelOverlay(false);
      setError(error.response?.data?.message || error.message || 'Error al cancelar la operación');
      setIsCancelModalOpen(true);
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
    if (user?.document_type === 'RUC') {
      if (!rucFicha) {
        setError('Debes subir la Ficha RUC de tu empresa');
        return;
      }
    } else {
      if (!dniFront || !dniBack) {
        setError('Debes subir ambas fotos del DNI (anverso y reverso)');
        return;
      }
    }

    if (!user?.dni) {
      setError('No se pudo obtener el DNI del usuario');
      return;
    }

    setIsUploadingKYC(true);
    setError(null);

    // Demo mode: simulate successful upload for demo user (dev only)
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 3000));
      setDocsPersisted(true);
      setIsUploadingKYC(false);
      setKycUploadDone(true);
      setTimeout(() => {
        setIsKYCModalOpen(false);
        setKycUploadDone(false);
        setDnifront(null);
        setDniBack(null);
        setRucFicha(null);
      }, 2800);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('dni', user.dni);

      if (user.document_type === 'RUC') {
        if (rucFicha) formData.append('ruc_ficha', rucFicha);
      } else {
        if (dniFront) formData.append('dni_front', dniFront);
        if (dniBack) formData.append('dni_back', dniBack);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/client/upload-dni`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setDocsPersisted(true);
        await refreshUser();
        setIsUploadingKYC(false);
        setKycUploadDone(true);
        setTimeout(() => {
          setIsKYCModalOpen(false);
          setKycUploadDone(false);
          setDnifront(null);
          setDniBack(null);
          setRucFicha(null);
        }, 2800);
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

    if (!voucherCode.trim()) {
      setError('Ingresa el número de operación de tu transferencia');
      return;
    }

    setIsUploadingProof(true);
    setError(null);

    // Cerrar modal y mostrar overlay animado
    setIsUploadProofModalOpen(false);
    setVoucherCode('');
    setShowProofOverlay(true);
    setShowProofSuccess(false);
    proofApiDoneRef.current = false;
    proofAnimDoneRef.current = false;

    // ── DEMO MODE ──────────────────────────────────────────────────────
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 800));
      proofApiDoneRef.current = true;
      if (proofAnimDoneRef.current) {
        setShowProofSuccess(true);
        setTimeout(() => { setShowProofOverlay(false); setShowProofSuccess(false); setCurrentStep(4); }, 3000);
      }
      setIsUploadingProof(false);
      return;
    }
    // ──────────────────────────────────────────────────────────────────

    try {
      const formData = new FormData();
      formData.append('operation_id', createdOperation.id.toString());
      formData.append('voucher_code', voucherCode.trim());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe'}/api/web/submit-proof`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        proofApiDoneRef.current = true;
        if (proofAnimDoneRef.current) {
          setShowProofSuccess(true);
          setTimeout(() => {
            setShowProofOverlay(false);
            setShowProofSuccess(false);
            setCurrentStep(4);
          }, 3000);
        }
      } else {
        setShowProofOverlay(false);
        setError(data.message || 'Error al enviar comprobante');
        setIsUploadProofModalOpen(true);
      }
    } catch (err: any) {
      console.error('Error al enviar comprobante:', err);
      setShowProofOverlay(false);
      setError('Error al enviar comprobante. Por favor intenta nuevamente.');
      setIsUploadProofModalOpen(true);
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Get Qoricash account based on client bank and operation type
  // Normalizar nombre de banco para matching
  const normalizeBankName = (bankName: string): string => {
    if (!bankName) return 'OTROS';
    const normalized = bankName.toUpperCase().trim();

    if (normalized.includes('BCP') || normalized.includes('CRÉDITO') || normalized.includes('CREDITO')) return 'BCP';
    if (normalized.includes('INTERBANK')) return 'INTERBANK';
    if (normalized.includes('PICHINCHA')) return 'PICHINCHA';
    if (normalized.includes('BANBIF') || normalized.includes('BAN BIF')) return 'BANBIF';
    if (normalized.includes('BBVA')) return 'BBVA';
    if (normalized.includes('SCOTIABANK')) return 'SCOTIABANK';

    return 'OTROS';
  };

  const resolveQoricashAccount = () => {
    if (!createdOperation) return null;

    const operationType = (createdOperation.operation_type || createdOperation.tipo || '').toLowerCase();
    // Moneda que el cliente envía: compra = $, venta = S/
    const currency = operationType === 'compra' ? '$' : 'S/';

    // 1. Fuente más directa: source_bank_name guardado en la operación
    let clientBankRaw: string = createdOperation.source_bank_name || '';

    // 2. Fallback: buscar la cuenta seleccionada en el estado local
    if (!clientBankRaw && selectedOriginAccount !== null) {
      const originAcc = bankAccounts.find(a => a.id === selectedOriginAccount);
      if (originAcc) {
        clientBankRaw = originAcc.banco || originAcc.bank_name || '';
      }
    }

    // 3. Fallback: primera cuenta del cliente con la moneda de origen
    if (!clientBankRaw) {
      const originAcc = bankAccounts.find(acc => (acc.moneda || acc.currency) === currency);
      if (originAcc) {
        clientBankRaw = originAcc.banco || originAcc.bank_name || '';
      }
    }

    if (!clientBankRaw) return null;

    const clientBank = normalizeBankName(clientBankRaw);
    return getQoricashAccount(clientBank, currency);
  };

  const exchangeRates = currentRates
    ? { compra: currentRates.tipo_compra, venta: currentRates.tipo_venta }
    : { compra: 3.750, venta: 3.770 };

  const inputCurrency = tipo === 'Compra' ? 'USD' : 'PEN';
  const outputCurrency = tipo === 'Compra' ? 'PEN' : 'USD';
  const currentRate = tipo === 'Compra' ? exchangeRates.compra : exchangeRates.venta;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={isEmpresa ? { backgroundColor: '#0A1628', backgroundImage: "url('/xc.webp')", backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'transparent' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen" style={isEmpresa ? { backgroundColor: '#0A1628', backgroundImage: "url('/xc.webp')", backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'transparent' }}>

      {/* Main Layout: Sidebar + Content */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-1 pb-4">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Contenido principal */}
          <div className="col-span-12">
            <div className="p-1">
              {/* Header */}
              <div className="mb-4 relative flex items-center justify-center">
                {/* Botón Volver — pasos 2 y 3 en ambos modos */}
                {(currentStep === 2 || currentStep === 3) && (
                  <button
                    onClick={() => {
                      if (currentStep === 2) setCurrentStep(1);
                      else if (isEmpresa) router.push('/dashboard/empresa');
                      else router.push('/dashboard');
                    }}
                    className="absolute left-0 inline-flex items-center transition text-sm"
                    style={{ color: isEmpresa ? '#ffffff' : '#6B7280' }}
                    onMouseEnter={e => (e.currentTarget.style.color = isEmpresa ? 'rgba(255,255,255,0.65)' : '#0D1117')}
                    onMouseLeave={e => (e.currentTarget.style.color = isEmpresa ? '#ffffff' : '#6B7280')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="font-medium">Volver</span>
                  </button>
                )}
                <div className="text-center">
                  <h1 className="text-xl font-bold mb-1" style={{ color: isEmpresa ? '#ffffff' : '#0D1117' }}>
                    {currentStep === 1 ? 'Nueva Operación' : currentStep === 2 ? 'Selección de cuentas' : currentStep === 3 ? 'Transfiere el dinero' : 'Operación en proceso'}
                  </h1>
                  <p className="text-xs" style={{ color: isEmpresa ? 'rgba(255,255,255,0.65)' : '#6B7280' }}>
                    {currentStep === 1
                      ? 'Cotiza tu tipo de cambio'
                      : currentStep === 2
                      ? 'Selecciona las cuentas para tu operación'
                      : currentStep === 3
                      ? 'Realiza la transferencia a la cuenta de Qoricash'
                      : 'Tu operación está siendo procesada'}
                  </p>
                </div>
              </div>

              {/* DEMO MODE banner */}
              {isDemoMode && (
                <div className="mb-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                    </span>
                    Modo Demo — sin conexión a producción
                  </span>
                </div>
              )}

              {/* Progress Stepper */}
              <div className="mb-5">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                  {[
                    { num: 1, icon: CalculatorIcon, label: 'Cotiza' },
                    { num: 2, icon: CreditCard, label: 'Cuentas Bancarias' },
                    { num: 3, icon: Send, label: 'Transfiere' },
                    { num: 4, icon: Upload, label: 'Finaliza' },
                  ].map(({ num, icon: Icon, label }, idx) => (
                    <div key={num} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                          currentStep > num
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200'
                            : currentStep === num
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200 step-circle-active'
                            : 'bg-gray-100 border-2 border-gray-200'
                        }`}>
                          {currentStep > num
                            ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                            : <Icon className={`w-3.5 h-3.5 ${currentStep >= num ? 'text-white' : 'text-gray-400'}`} />
                          }
                        </div>
                        <p className={`op-step-label text-[10px] font-semibold ${currentStep >= num ? 'text-blue-600' : 'text-gray-400'}`}>{label}</p>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-1.5 mx-1.5 mb-4 rounded-full transition-all duration-500 ${
                          currentStep > num ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3: Transfer Instructions */}
              {currentStep === 3 && createdOperation ? (
                <div className="flex justify-center mt-4">
                <div className="w-full max-w-[440px]">

                  {(() => {
                    const opType = (createdOperation.operation_type || createdOperation.tipo || '').toLowerCase();
                    const qoricashAccount = resolveQoricashAccount();
                    const usd = createdOperation.amount_usd ?? createdOperation.monto_dolares ?? 0;
                    const pen = createdOperation.amount_pen ?? createdOperation.monto_soles ?? 0;
                    const tc  = createdOperation.exchange_rate ?? createdOperation.tipo_cambio ?? 0;
                    const montoEnviar = opType === 'compra'
                      ? `$ ${parseFloat(usd).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                      : `S/ ${parseFloat(pen).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
                    const montoRecibir = opType === 'compra'
                      ? `S/ ${parseFloat(pen).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                      : `$ ${parseFloat(usd).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
                    const srcBank = createdOperation.source_bank_name || '';
                    const srcAcc  = createdOperation.source_account || '';
                    const dstBank = createdOperation.destination_bank_name || '';
                    const dstAcc  = createdOperation.destination_account || '';
                    const srcLogo = getBankLogo(srcBank);
                    const dstLogo = getBankLogo(dstBank);
                    const qcLogo  = qoricashAccount ? getBankLogo(qoricashAccount.banco) : null;
                    const accountNumber = qoricashAccount ? (qoricashAccount.useCCI ? qoricashAccount.cci : qoricashAccount.numero) : '';

                    return (
                      <div className="space-y-3">

                        {/* ── Card: ID operación + Temporizador ── */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A0A', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="relative flex h-2 w-2 flex-shrink-0">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${timeRemaining === 0 ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${timeRemaining === 0 ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                </span>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{timeRemaining === 0 ? 'Expirada' : 'En curso'}</p>
                              </div>
                              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Código de operación</p>
                              <p className="text-2xl font-black text-white tracking-wide leading-none">{createdOperation.codigo_operacion}</p>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 px-4 py-3 rounded-2xl flex-shrink-0" style={{ background: timeRemaining === 0 ? 'rgba(239,68,68,0.18)' : timeRemaining < 300 ? 'rgba(234,179,8,0.18)' : 'rgba(37,99,235,0.18)', border: `1px solid ${timeRemaining === 0 ? 'rgba(239,68,68,0.4)' : timeRemaining < 300 ? 'rgba(234,179,8,0.4)' : 'rgba(37,99,235,0.4)'}` }}>
                              <Timer className={`w-4 h-4 mb-1 ${timeRemaining === 0 ? 'text-red-400' : timeRemaining < 300 ? 'text-yellow-400 animate-pulse' : 'text-blue-400'}`} />
                              <p className={`text-xl font-black leading-none tabular-nums ${timeRemaining === 0 ? 'text-red-400' : timeRemaining < 300 ? 'text-yellow-300' : 'text-white'}`}>{formatTime(timeRemaining)}</p>
                              <p className="text-[9px] font-semibold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Tiempo</p>
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                          <div className="flex divide-x" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex-1 px-4 py-3 text-center">
                              <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Usted paga</p>
                              <p className="text-sm font-bold text-white">{montoEnviar}</p>
                            </div>
                            <div className="px-4 py-3 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                              <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>T.C.</p>
                              <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>{parseFloat(tc).toFixed(3)}</p>
                            </div>
                            <div className="flex-1 px-4 py-3 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                              <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Usted recibe</p>
                              <p className="text-sm font-bold" style={{ color: '#60a5fa' }}>{montoRecibir}</p>
                            </div>
                          </div>
                        </div>

                        {/* ── Alertas de tiempo ── */}
                        {timeRemaining < 300 && timeRemaining > 0 && (
                          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)' }}>
                            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <p className="text-xs text-yellow-700 font-semibold">Menos de 5 minutos restantes. Completa la transferencia pronto.</p>
                          </div>
                        )}
                        {timeRemaining === 0 && (
                          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-700 font-semibold">El tiempo ha expirado. Contacta a soporte para continuar.</p>
                          </div>
                        )}

                        {/* ── Cuenta Qoricash ── */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                          <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: '#0A0A0A' }}>
                            <img src="/vg.png" alt="Qoricash" className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.25)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.4)' }}>
                              Transfiere aquí
                            </span>
                          </div>
                          {qoricashAccount ? (
                            <div className="px-5 divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                              <div className="flex items-center justify-between py-3.5">
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Banco</span>
                                <div className="flex items-center gap-2">
                                  {qcLogo && <img src={qcLogo} alt={qoricashAccount.banco} className="h-7 w-auto object-contain" />}
                                  <span className="text-sm font-bold" style={{ color: '#0D1117' }}>{qoricashAccount.banco}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between py-3.5">
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Titular</span>
                                <span className="text-sm font-bold text-right max-w-[220px] leading-snug" style={{ color: '#0D1117' }}>{qoricashAccount.titular}</span>
                              </div>
                              <div className="flex items-center justify-between py-3.5">
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>RUC</span>
                                <span className="text-sm font-bold font-mono" style={{ color: '#0D1117' }}>{qoricashAccount.ruc}</span>
                              </div>
                              <div className="py-3.5">
                                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: '#9CA3AF' }}>{qoricashAccount.useCCI ? 'CCI' : 'N° de Cuenta'}</p>
                                <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)' }}>
                                  <span className="flex-1 text-base font-black tracking-wider select-all font-mono" style={{ color: '#0D1117' }}>{accountNumber}</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(accountNumber, 'account')}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white transition-all flex-shrink-0"
                                    style={{ background: copiedField === 'account' ? '#16a34a' : '#0A0A0A', boxShadow: copiedField === 'account' ? '0 2px 8px rgba(22,163,74,0.4)' : '0 2px 8px rgba(0,0,0,0.2)' }}
                                  >
                                    {copiedField === 'account'
                                      ? <><CheckCircle className="w-3.5 h-3.5" /> Copiado</>
                                      : <><Copy className="w-3.5 h-3.5" /> Copiar</>
                                    }
                                  </button>
                                </div>
                              </div>
                              <div className="py-3.5">
                                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)' }}>
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#2563EB' }}>Monto exacto a transferir</p>
                                    <p className="text-2xl font-black" style={{ color: '#1E40AF' }}>{montoEnviar}</p>
                                  </div>
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="px-5 py-6 text-center">
                              <p className="text-sm" style={{ color: '#6B7280' }}>No se pudo determinar la cuenta de destino. Contacta a soporte.</p>
                            </div>
                          )}
                        </div>

                        {/* ── Resumen del flujo ── */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2563EB' }}></div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Resumen de la operación</p>
                          </div>
                          <div className="p-4 flex items-stretch gap-2">
                            <div className="flex-1 min-w-0 rounded-xl px-3 py-3" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                              <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Transfieres desde</p>
                              <div className="flex items-center gap-2 mb-2">
                                {srcLogo
                                  ? <img src={srcLogo} alt={srcBank} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', padding: 3 }} />
                                  : <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}><Building2 size={15} color="#94a3b8" /></div>
                                }
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold leading-tight truncate" style={{ color: '#0D1117' }}>{srcBank || '—'}</p>
                                  <p className="text-[10px] font-mono truncate" style={{ color: '#9CA3AF' }}>{srcAcc || '—'}</p>
                                </div>
                              </div>
                              <p className="text-base font-extrabold" style={{ color: '#0D1117' }}>{montoEnviar}</p>
                            </div>
                            <div className="flex items-center justify-center flex-shrink-0">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
                                <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
                                  <path d="M1 5h12M8 1l5 4-5 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 rounded-xl px-3 py-3" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                              <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Recibirás en</p>
                              <div className="flex items-center gap-2 mb-2">
                                {dstLogo
                                  ? <img src={dstLogo} alt={dstBank} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', padding: 3 }} />
                                  : <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}><Building2 size={15} color="#94a3b8" /></div>
                                }
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold leading-tight truncate" style={{ color: '#0D1117' }}>{dstBank || '—'}</p>
                                  <p className="text-[10px] font-mono truncate" style={{ color: '#9CA3AF' }}>{dstAcc || '—'}</p>
                                </div>
                              </div>
                              <p className="text-base font-extrabold" style={{ color: '#2563EB' }}>{montoRecibir}</p>
                            </div>
                          </div>
                        </div>

                        {/* ── Pasos a seguir ── */}
                        <div className="rounded-2xl px-5 py-4" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Cómo completar tu operación</p>
                          <div className="space-y-2.5">
                            {[
                              { n: 1, text: 'Copia el número de cuenta de Qoricash.' },
                              { n: 2, text: 'Realiza la transferencia exacta desde tu banco.' },
                              { n: 3, text: 'Regresa aquí y toca "Ya transferí" para notificarnos.' },
                            ].map(({ n, text }) => (
                              <div key={n} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white mt-0.5" style={{ background: '#0A0A0A' }}>{n}</span>
                                <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{text}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ── CTA principal ── */}
                        <button
                          type="button"
                          onClick={() => setIsUploadProofModalOpen(true)}
                          disabled={timeRemaining === 0}
                          className="w-full py-4 rounded-2xl text-base font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2.5"
                          style={{ background: timeRemaining === 0 ? '#6B7280' : '#2563EB', boxShadow: timeRemaining === 0 ? 'none' : '0 6px 20px rgba(37,99,235,0.4)' }}
                        >
                          <CheckCircle className="w-5 h-5" />
                          Ya transferí
                        </button>

                        {/* ── Footer: cancelar + whatsapp ── */}
                        <div className="flex items-center justify-between px-1 pb-2">
                          <button
                            type="button"
                            onClick={() => { if (timeRemaining > 0) { setIsCancelModalOpen(true); setError(null); } }}
                            disabled={timeRemaining === 0}
                            className="text-xs font-semibold transition disabled:opacity-40"
                            style={{ color: '#6B7280' }}
                          >
                            Cancelar operación
                          </button>
                          <a
                            href="https://wa.me/51910624404?text=Hola,%20necesito%20ayuda%20con%20mi%20operación"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold transition"
                            style={{ color: '#16a34a' }}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Necesito ayuda
                          </a>
                        </div>

                      </div>
                    );
                  })()}

                </div>
                </div>
              ) : currentStep === 1 ? (
                /* STEP 1: Cotiza */
                <div className="space-y-4">
                  {/* Validación de estado del cliente (KYC) */}

                  {/* Toast de cuenta activada */}
                  {showActivationToast && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
                      <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
                        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
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

                  {/* Alerta de operación activa */}
                  {hasActiveOperation && (
                    <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-900 mb-2">
                            Operación en Progreso
                          </p>
                          <p className="text-sm text-red-800 mb-3">
                            {activeOperationMessage}
                          </p>
                          <button
                            onClick={() => router.push('/dashboard')}
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                          >
                            Ver mis operaciones
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {user?.status === 'Inactivo' && (user?.has_complete_documents || docsSubmittedThisSession) && (
                    <div className="flex justify-center">
                      <style>{`
                        @keyframes clockTick {
                          0%   { transform: rotate(0deg); }
                          8%   { transform: rotate(30deg); }
                          16%  { transform: rotate(60deg); }
                          25%  { transform: rotate(90deg); }
                          33%  { transform: rotate(120deg); }
                          41%  { transform: rotate(150deg); }
                          50%  { transform: rotate(180deg); }
                          58%  { transform: rotate(210deg); }
                          66%  { transform: rotate(240deg); }
                          75%  { transform: rotate(270deg); }
                          83%  { transform: rotate(300deg); }
                          91%  { transform: rotate(330deg); }
                          100% { transform: rotate(360deg); }
                        }
                        @keyframes clockSweep {
                          0%   { transform: rotate(-60deg); }
                          100% { transform: rotate(300deg); }
                        }
                        @keyframes scanLine {
                          0%   { transform: translateX(-100%); opacity: 0; }
                          10%  { opacity: 1; }
                          90%  { opacity: 1; }
                          100% { transform: translateX(200%); opacity: 0; }
                        }
                        @keyframes pulseOpacity {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.55; }
                        }
                      `}</style>
                      <div className="w-full max-w-[400px] rounded-2xl overflow-hidden" style={{ border: '1px solid #bfdbfe', boxShadow: '0 2px 12px rgba(59,130,246,0.08)' }}>
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#0D1B2A' }}>
                          {/* Animated clock icon */}
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(96,165,250,0.15)' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="6" stroke="#93c5fd" strokeWidth="1.2" />
                              {/* hour hand - slow tick */}
                              <line x1="7" y1="7" x2="7" y2="3.5" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"
                                style={{ transformOrigin: '7px 7px', animation: 'clockTick 6s steps(12) infinite' }} />
                              {/* minute hand - fast sweep */}
                              <line x1="7" y1="7" x2="7" y2="2.2" stroke="#60a5fa" strokeWidth="0.9" strokeLinecap="round"
                                style={{ transformOrigin: '7px 7px', animation: 'clockSweep 1.2s linear infinite' }} />
                              <circle cx="7" cy="7" r="0.8" fill="#93c5fd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold" style={{ color: '#93c5fd' }}>En revisión</p>
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Documentos recibidos · menos de 10 min</p>
                          </div>
                          {/* pulse dot */}
                          <div className="ml-auto flex-shrink-0 relative w-2.5 h-2.5">
                            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(96,165,250,0.5)' }} />
                            <span className="relative block w-2.5 h-2.5 rounded-full" style={{ background: '#60a5fa' }} />
                          </div>
                        </div>
                        {/* Body */}
                        <div className="relative px-4 py-3 flex items-center justify-between gap-3 overflow-hidden" style={{ background: '#eff6ff' }}>
                          {/* Scan shimmer line */}
                          <div className="absolute inset-0 pointer-events-none" style={{ animation: 'scanLine 2.4s ease-in-out infinite' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, width: '60px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.18), transparent)' }} />
                          </div>
                          <p className="text-xs text-blue-700 leading-relaxed relative">
                            Nuestro equipo está revisando tus documentos. Te avisaremos cuando tu cuenta esté activa.
                          </p>
                          <button
                            onClick={async () => {
                              setShowVerifyOverlay(true);
                              setVerifyStillPending(false);
                              try { await refreshUser(); } catch {}
                              // If still inactive after refresh, show pending state
                              setTimeout(() => {
                                setShowVerifyOverlay(false);
                                if (user?.status === 'Inactivo') setVerifyStillPending(true);
                              }, 2200);
                            }}
                            disabled={isCheckingStatus}
                            className="flex-shrink-0 flex items-center gap-1.5 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition disabled:opacity-50"
                            style={{ background: '#1d4ed8' }}
                          >
                            <RefreshCw className="w-3 h-3" />Verificar
                          </button>
                        </div>
                        {/* Still pending message */}
                        {verifyStillPending && (
                          <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: '#dbeafe', borderTop: '1px solid #bfdbfe' }}>
                            <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <p className="text-[10px] font-semibold text-blue-700">Documentos en verificación — en breve recibirás confirmación</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toast: KYC bloquea operación */}
                  {showKycBlockedToast && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center px-4"
                      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                      onClick={() => setShowKycBlockedToast(false)}
                    >
                      <div
                        className="w-full max-w-sm rounded-2xl overflow-hidden"
                        style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', animation: 'fadeInDown 0.25s ease' }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Header azul */}
                        <div className="flex items-center gap-3 px-5 py-4" style={{ background: '#2563EB' }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <AlertCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-sm font-black text-white leading-tight">
                            {kycBlocked ? 'Cuenta con restricción KYC' : docsSubmittedThisSession || (user?.status === 'Inactivo' && user?.has_complete_documents) ? 'Documentos en revisión' : 'Validación de identidad requerida'}
                          </p>
                          <button onClick={() => setShowKycBlockedToast(false)} className="ml-auto p-1 rounded-lg transition hover:bg-white/10">
                            <X className="w-4 h-4 text-white/70" />
                          </button>
                        </div>
                        {/* Body */}
                        <div className="px-5 py-5">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {kycBlocked
                              ? 'Has alcanzado el límite operativo sin documentación. Sube tus documentos para continuar.'
                              : docsSubmittedThisSession || (user?.status === 'Inactivo' && user?.has_complete_documents)
                                ? 'Tus documentos están siendo verificados. Podrás operar en cuanto sean aprobados.'
                                : 'Para operar en nuestra plataforma necesitas validar tu identidad primero.'}
                          </p>
                          <button
                            onClick={() => setShowKycBlockedToast(false)}
                            className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition"
                            style={{ background: '#2563EB' }}
                          >
                            Entendido
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Banner: docs enviados, status Activo (en revisión sin Inactivar cuenta) */}
                  {user?.status === 'Activo' && docsSubmittedThisSession && (
                    <div className="flex justify-center mb-2">
                      <div className="w-full max-w-[400px] rounded-2xl overflow-hidden" style={{ border: '1px solid #bfdbfe', boxShadow: '0 2px 12px rgba(59,130,246,0.08)' }}>
                        <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#1d4ed8' }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.2" />
                              <line x1="7" y1="7" x2="7" y2="3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"
                                style={{ transformOrigin: '7px 7px', animation: 'clockTick 6s steps(12) infinite' }} />
                              <line x1="7" y1="7" x2="7" y2="2.2" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" strokeLinecap="round"
                                style={{ transformOrigin: '7px 7px', animation: 'clockSweep 1.2s linear infinite' }} />
                              <circle cx="7" cy="7" r="0.8" fill="white" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Documentos recibidos · En revisión</p>
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>Validación aprox. 10 minutos en horario hábil</p>
                          </div>
                          <div className="ml-auto flex-shrink-0 relative w-2.5 h-2.5">
                            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(255,255,255,0.4)' }} />
                            <span className="relative block w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                        </div>
                        <div className="relative px-4 py-3 overflow-hidden" style={{ background: '#dcfce7' }}>
                          {/* Scan shimmer line */}
                          <div className="absolute inset-0 pointer-events-none" style={{ animation: 'scanLine 2.4s ease-in-out infinite' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, width: '60px', background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.18), transparent)' }} />
                          </div>
                          <p className="text-xs text-blue-800 leading-relaxed relative">
                            Hemos recibido tus documentos. Nuestro equipo los está validando. <b>Podrás operar en cuanto sean aprobados.</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Banner: KYC bloqueado (alcanzó límite sin docs) */}
                  {kycBlocked && (
                    <div className="flex justify-center mb-2">
                      <div className="w-full max-w-[400px] rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 2px 12px rgba(239,68,68,0.08)' }}>
                        <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#0f172a' }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}>
                            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-red-400">Cuenta con restricción KYC</p>
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Límite operativo sin documentación alcanzado</p>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ background: '#fef2f2' }}>
                          <p className="text-xs text-red-800 leading-relaxed flex-1">
                            Has alcanzado el límite de operaciones sin documentación completa. <b>Sube tus documentos</b> para continuar operando sin restricciones.
                          </p>
                          <button
                            onClick={() => { setIsKYCModalOpen(true); setError(null); }}
                            className="flex-shrink-0 flex items-center gap-1.5 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition"
                            style={{ background: '#dc2626' }}
                          >
                            Subir docs
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calculadora oficial */}
                  <div className="relative flex justify-center mt-12">
                  {kycNeedsDocs && !kycBlocked ? (
                    <div className="w-full max-w-[400px] mx-auto">
                      <div className="rounded-2xl overflow-hidden" style={isEmpresa ? {
                        background: 'rgba(255,255,255,0.10)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                      } : {
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                      }}>
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4" style={isEmpresa ? { background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.1)' } : { background: '#FFFBEB', borderBottom: '1px solid rgba(234,179,8,0.25)' }}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.18)', border: '1.5px solid rgba(251,191,36,0.4)' }}>
                            <AlertCircle className="w-5 h-5" style={{ color: '#fbbf24' }} />
                          </div>
                          <div>
                            <p className="text-sm font-black leading-tight" style={{ color: isEmpresa ? '#ffffff' : '#92400E' }}>Validación requerida para operar</p>
                            <p className="text-[11px] mt-0.5" style={{ color: isEmpresa ? 'rgba(255,255,255,0.5)' : '#78350F' }}>
                              Proceso único · aprox. 10 minutos
                            </p>
                          </div>
                        </div>
                        {/* Body */}
                        <div className="px-5 py-5">
                          <p className="text-xs leading-relaxed mb-5" style={{ color: isEmpresa ? 'rgba(255,255,255,0.7)' : '#374151' }}>
                            Para realizar operaciones en nuestra plataforma necesitas validar tu identidad.
                            Sube tu <b style={{ color: isEmpresa ? '#ffffff' : '#0D1117' }}>{isEmpresa ? 'Ficha RUC' : 'DNI (ambas caras)'}</b> y en menos de 10 minutos podrás operar.
                          </p>
                          {/* Pasos */}
                          <div className="space-y-2.5 mb-5">
                            {(isEmpresa
                              ? [{ icon: '📄', text: 'Ficha RUC de tu empresa' }]
                              : [{ icon: '🪪', text: 'Foto del DNI — parte delantera' }, { icon: '🪪', text: 'Foto del DNI — parte trasera' }]
                            ).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={isEmpresa ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' } : { background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <span className="text-base">{item.icon}</span>
                                <span className="text-xs font-medium" style={{ color: isEmpresa ? '#ffffff' : '#374151' }}>{item.text}</span>
                                <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isEmpresa ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
                                  <div className="w-2 h-2 rounded-full" style={{ background: isEmpresa ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => { setIsKYCModalOpen(true); setError(null); }}
                            className="w-full flex items-center justify-center gap-2 text-white text-sm font-black py-3 rounded-xl transition-all hover:brightness-110 active:scale-[0.98]"
                            style={{ background: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
                          >
                            <Upload className="w-4 h-4" />
                            Subir documentos ahora
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-hidden rounded-2xl w-full max-w-[400px]">
                      <Calculator
                        showContinueButton
                        compact
                        darkTheme={isEmpresa}
                        onOperationReady={(opType, amountRaw, rate) => {
                          if (hasActiveOperation || kycBlocksOperation) {
                            if (kycBlocksOperation) setShowKycBlockedToast(true);
                            return;
                          }
                          setTipo(opType);
                          setAmountInput(amountRaw);
                          setSelectedOriginAccount(null);
                          setSelectedDestinationAccount(null);
                          const computed = opType === 'Compra'
                            ? (parseFloat(amountRaw) * rate).toFixed(2)
                            : (parseFloat(amountRaw) / rate).toFixed(2);
                          setAmountOutput(computed);
                          setCurrentStep(2);
                        }}
                      />
                    </div>
                  )}
                  </div>
                </div>
              ) : currentStep === 2 ? (
                /* STEP 2: Selección de cuentas */
                <form onSubmit={handleSubmit} className="flex justify-center mt-6">
                <div className="w-full max-w-[400px] space-y-4">

                  {/* Resumen de cotización */}
                  {amountInput && amountOutput && (
                    <div>
                      {/* Label LIVE */}
                      <div className="flex items-center gap-1.5 mb-2 px-0.5">
                        <span className="relative flex items-center justify-center w-3 h-3">
                          <span className="absolute w-3 h-3 rounded-full animate-ping" style={{ background: 'rgba(37,99,235,0.4)' }} />
                          <span className="w-2 h-2 rounded-full" style={{ background: '#2563EB' }} />
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#2563EB' }}>Tu cotización</span>
                      </div>

                      {/* Card premium */}
                      <div className="rounded-2xl overflow-hidden" style={{
                        background: '#0A0A0A',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {/* Top strip: logo + operación */}
                        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center gap-2">
                            <img src="/vg.png" alt="Qoricash" className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.25)', color: '#93C5FD', border: '1px solid rgba(37,99,235,0.3)' }}>
                            {tipo === 'Compra' ? 'Compra USD' : 'Vende USD'}
                          </span>
                        </div>

                        {/* Data row */}
                        <div className="flex items-stretch divide-x" style={{ divideColor: 'rgba(255,255,255,0.06)' }}>
                          {/* Importe */}
                          <div className="flex-1 px-4 py-3.5 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Importe</p>
                            <p className="text-sm font-black text-white whitespace-nowrap">
                              {tipo === 'Compra' ? '$' : 'S/'}{' '}{parseFloat(amountInput).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          {/* TC */}
                          <div className="px-4 py-3.5 text-center flex-shrink-0" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>T.C.</p>
                            <p className="text-sm font-black" style={{ color: '#60A5FA' }}>{currentRate.toFixed(3)}</p>
                          </div>
                          {/* Contravalor */}
                          <div className="flex-1 px-4 py-3.5 text-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Contravalor</p>
                            <p className="text-sm font-black text-white whitespace-nowrap">
                              {tipo === 'Compra' ? 'S/' : '$'}{' '}{parseFloat(amountOutput).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validación de cuentas */}
                  {!canCreateOperation && (
                    <div
                      className="p-3 rounded-lg border"
                      style={isEmpresa ? {
                        background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)',
                        border: '1px solid rgba(143,184,204,0.2)',
                      } : {
                        background: '#fefce8',
                        border: '1px solid #fde68a',
                      }}
                    >
                      <p className="text-sm flex items-start" style={{ color: isEmpresa ? '#f87171' : '#92400e' }}>
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: isEmpresa ? '#f87171' : '#d97706' }} />
                        <span>Necesitas <strong>una cuenta en Soles</strong> y <strong>una cuenta en Dólares</strong> para crear operaciones.</span>
                      </p>
                    </div>
                  )}

                  {/* Cuenta de cargo */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold" style={{ color: isEmpresa ? '#ffffff' : '#0D1117' }}>
                        1. Su cuenta de origen
                        <span className="text-xs font-normal ml-2" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#6B7280' }}>
                          (desde donde usted paga)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountContext('cargo');
                          setIsAddAccountModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold transition px-2.5 py-1 rounded-lg"
                        style={isEmpresa
                          ? { color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.1)' }
                          : { color: '#ffffff', border: '1px solid rgba(37,99,235,0.4)', background: '#2563EB' }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Añadir
                      </button>
                    </div>
                    <div className="relative">
                      {/* Custom origin account dropdown */}
                      <button
                        type="button"
                        onClick={() => { setOriginDropdownOpen(o => !o); setDestDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors text-left"
                        style={isEmpresa
                          ? { minHeight: '46px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(143,184,204,0.22)' }
                          : { minHeight: '46px', background: '#ffffff', border: '1.5px solid #E5E7EB' }}
                      >
                        {selectedOriginAccount !== null ? (() => {
                          const acc = bankAccounts.find(a => a.id === selectedOriginAccount);
                          if (!acc) return <span className="text-gray-400">Selecciona una cuenta</span>;
                          const logo = getBankLogo(acc.banco || acc.bank_name || '');
                          const numero = acc.numero_cuenta || acc.account_number || '';
                          const moneda = acc.moneda || acc.currency || '';
                          return (
                            <>
                              {logo ? (
                                <img src={logo} alt={acc.banco || acc.bank_name} className="w-6 h-6 object-contain rounded flex-shrink-0" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="text-xs truncate flex-1 font-medium" style={{ color: isEmpresa ? '#ffffff' : '#0D1117' }}>{numero}</span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: isEmpresa ? 'rgba(255,255,255,0.15)' : 'rgba(30,41,59,0.07)', color: isEmpresa ? '#ffffff' : '#374151' }}>{moneda}</span>
                            </>
                          );
                        })() : (
                          <>
                            <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: isEmpresa ? 'rgba(143,184,204,0.4)' : '#9CA3AF' }} />
                            <span style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#9CA3AF' }} className="flex-1">Selecciona una cuenta</span>
                          </>
                        )}
                        <svg className="w-4 h-4 flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isEmpresa ? 'rgba(143,184,204,0.4)' : '#9CA3AF' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={originDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      </button>
                      {originDropdownOpen && (
                        <>
                        <div className="fixed inset-0 z-10" onClick={() => setOriginDropdownOpen(false)} />
                        <div className="absolute z-20 left-0 right-0 top-full mt-1 rounded-lg shadow-lg overflow-hidden" style={isEmpresa ? { background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(143,184,204,0.2)' } : { background: '#ffffff', border: '1px solid #E5E7EB', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                          {getOriginAccounts().length === 0 ? (
                            <div className="px-4 py-3 text-sm" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#9CA3AF' }}>No hay cuentas disponibles</div>
                          ) : getOriginAccounts().map((account) => {
                            const logo = getBankLogo(account.banco || account.bank_name || '');
                            const numero = account.numero_cuenta || account.account_number || '';
                            const moneda = account.moneda || account.currency || '';
                            const isSelected = selectedOriginAccount === account.id;
                            return (
                              <button
                                key={account.id}
                                type="button"
                                onClick={() => { setSelectedOriginAccount(account.id ?? null); setOriginDropdownOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-left"
                                style={isSelected
                                  ? { background: isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(37,99,235,0.07)' }
                                  : {}}
                                onMouseEnter={e => (e.currentTarget.style.background = isEmpresa ? 'rgba(143,184,204,0.08)' : '#F9FAFB')}
                                onMouseLeave={e => (e.currentTarget.style.background = isSelected ? (isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(37,99,235,0.07)') : 'transparent')}
                              >
                                {logo ? (
                                  <img src={logo} alt={account.banco || account.bank_name} className="w-6 h-6 object-contain rounded flex-shrink-0" />
                                ) : (
                                  <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: isEmpresa ? 'rgba(143,184,204,0.4)' : '#9CA3AF' }} />
                                )}
                                <span className="text-xs truncate flex-1 font-medium" style={{ color: isEmpresa ? '#ffffff' : '#374151' }}>{numero}</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(30,41,59,0.07)', color: isEmpresa ? '#8fb8cc' : 'rgba(30,41,59,0.6)' }}>{moneda}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: isEmpresa ? '#8fb8cc' : '#2563EB' }} />}
                              </button>
                            );
                          })}
                        </div>
                        </>
                      )}
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

                  {/* Cuenta de destino */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold" style={{ color: isEmpresa ? '#ffffff' : '#0D1117' }}>
                        2. Su cuenta de destino
                        <span className="text-xs font-normal ml-2" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#6B7280' }}>
                          (donde usted recibe)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountContext('destino');
                          setIsAddAccountModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold transition px-2.5 py-1 rounded-lg"
                        style={isEmpresa
                          ? { color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.1)' }
                          : { color: '#ffffff', border: '1px solid rgba(37,99,235,0.4)', background: '#2563EB' }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Añadir
                      </button>
                    </div>
                    <div className="relative">
                      {/* Custom destination account dropdown */}
                      <button
                        type="button"
                        onClick={() => { setDestDropdownOpen(o => !o); setOriginDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors text-left"
                        style={isEmpresa
                          ? { minHeight: '46px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(143,184,204,0.22)' }
                          : { minHeight: '46px', background: '#ffffff', border: '1.5px solid #E5E7EB' }}
                      >
                        {selectedDestinationAccount !== null ? (() => {
                          const acc = bankAccounts.find(a => a.id === selectedDestinationAccount);
                          if (!acc) return <span className="text-gray-400">Selecciona una cuenta</span>;
                          const logo = getBankLogo(acc.banco || acc.bank_name || '');
                          const numero = acc.numero_cuenta || acc.account_number || '';
                          const moneda = acc.moneda || acc.currency || '';
                          return (
                            <>
                              {logo ? (
                                <img src={logo} alt={acc.banco || acc.bank_name} className="w-6 h-6 object-contain rounded flex-shrink-0" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="text-xs truncate flex-1 font-medium" style={{ color: isEmpresa ? '#ffffff' : '#0D1117' }}>{numero}</span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: isEmpresa ? 'rgba(255,255,255,0.15)' : 'rgba(30,41,59,0.07)', color: isEmpresa ? '#ffffff' : '#374151' }}>{moneda}</span>
                            </>
                          );
                        })() : (
                          <>
                            <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: isEmpresa ? 'rgba(143,184,204,0.4)' : '#9CA3AF' }} />
                            <span style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#9CA3AF' }} className="flex-1">Selecciona una cuenta</span>
                          </>
                        )}
                        <svg className="w-4 h-4 flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isEmpresa ? 'rgba(143,184,204,0.4)' : '#9CA3AF' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={destDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      </button>
                      {destDropdownOpen && (
                        <>
                        <div className="fixed inset-0 z-10" onClick={() => setDestDropdownOpen(false)} />
                        <div className="absolute z-20 left-0 right-0 top-full mt-1 rounded-lg shadow-lg overflow-hidden" style={isEmpresa ? { background: 'rgba(13,27,42,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(143,184,204,0.2)' } : { background: '#ffffff', border: '1px solid #E5E7EB', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                          {getDestinationAccounts().length === 0 ? (
                            <div className="px-4 py-3 text-sm" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#9CA3AF' }}>No hay cuentas disponibles</div>
                          ) : getDestinationAccounts().map((account) => {
                            const logo = getBankLogo(account.banco || account.bank_name || '');
                            const numero = account.numero_cuenta || account.account_number || '';
                            const moneda = account.moneda || account.currency || '';
                            const isSelected = selectedDestinationAccount === account.id;
                            return (
                              <button
                                key={account.id}
                                type="button"
                                onClick={() => { setSelectedDestinationAccount(account.id ?? null); setDestDropdownOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-left"
                                style={isSelected ? { background: isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(37,99,235,0.07)' } : {}}
                                onMouseEnter={e => (e.currentTarget.style.background = isEmpresa ? 'rgba(143,184,204,0.08)' : '#F9FAFB')}
                                onMouseLeave={e => (e.currentTarget.style.background = isSelected ? (isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(37,99,235,0.07)') : 'transparent')}
                              >
                                {logo ? (
                                  <img src={logo} alt={account.banco || account.bank_name} className="w-6 h-6 object-contain rounded flex-shrink-0" />
                                ) : (
                                  <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: isEmpresa ? 'rgba(143,184,204,0.4)' : '#9CA3AF' }} />
                                )}
                                <span className="text-xs truncate flex-1 font-medium" style={{ color: isEmpresa ? '#ffffff' : '#374151' }}>{numero}</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(30,41,59,0.07)', color: isEmpresa ? '#8fb8cc' : 'rgba(30,41,59,0.6)' }}>{moneda}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: isEmpresa ? '#8fb8cc' : '#2563EB' }} />}
                              </button>
                            );
                          })}
                        </div>
                        </>
                      )}
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

                  {/* Confirmación de titularidad */}
                  <div>
                    <label className="flex items-center cursor-pointer rounded-lg p-3" style={isEmpresa ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.18)', backdropFilter: 'blur(8px)' } : { background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      <input
                        type="checkbox"
                        checked={ownershipConfirmed}
                        onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                        className="w-5 h-5 text-secondary focus:ring-secondary border-gray-300 rounded flex-shrink-0"
                      />
                      <span className="ml-3 text-sm font-semibold flex-1" style={{ color: isEmpresa ? '#ffffff' : '#111827' }}>
                        Soy titular de las cuentas bancarias
                      </span>
                      <div className="relative ml-2 flex-shrink-0 group">
                        <HelpCircle className="w-4 h-4 text-blue-400 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-2.5 rounded-lg text-xs text-gray-600 leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
                          style={{ background: '#1E293B', color: 'rgba(255,255,255,0.8)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                          Declaro que las cuentas bancarias registradas son de mi titularidad y que la información proporcionada es verídica.
                          <div className="absolute top-full right-3 w-2 h-2 rotate-45 -mt-1" style={{ background: '#1E293B' }} />
                        </div>
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
                      user?.status === 'Inactivo' ||
                      hasActiveOperation ||
                      isConfirmAnimating
                    }
                    className="w-full text-white py-4 rounded-lg font-bold text-base transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl group"
                    style={isEmpresa ? { background: 'linear-gradient(135deg, #4A6884 0%, #1a3353 100%)', boxShadow: '0 4px 16px rgba(74,104,132,0.35)' } : { background: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
                  >
                    {isSubmitting || isConfirmAnimating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        {isSubmitting ? 'Procesando...' : 'Verificando...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirmar Operación
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center mt-3" style={{ color: isEmpresa ? '#ffffff' : '#6B7280' }}>
                    Tu dinero será transferido en menos de 10 minutos
                  </p>
                </div>
                </form>
              ) : (
                /* STEP 4: Adjunta y finaliza */
                <div className="text-center py-12 pt-16 flex flex-col items-center justify-center">
                  <style jsx>{`
                    @keyframes pulse-ring {
                      0% {
                        transform: scale(0.95);
                        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
                      }

                      50% {
                        transform: scale(1);
                        box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
                      }

                      100% {
                        transform: scale(0.95);
                        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
                      }
                    }

                    .processing-icon {
                      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                  `}</style>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 processing-icon"
                    style={isEmpresa ? {
                      background: 'rgba(74,104,132,0.18)',
                      border: '1.5px solid rgba(143,184,204,0.25)',
                    } : { background: '#DBEAFE' }}
                  >
                    <RefreshCw
                      className="w-10 h-10 animate-spin"
                      style={{ animationDuration: '2s', color: isEmpresa ? '#8fb8cc' : '#2563EB' }}
                    />
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: '#0F172A' }}
                  >
                    Procesando tu operación
                  </h3>
                  <p
                    className="mb-6"
                    style={{ color: '#64748B' }}
                  >
                    Estamos verificando tu transferencia. Recibirás tu dinero pronto.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/historial')}
                    className="text-white py-3 px-8 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
                    style={isEmpresa
                      ? { background: 'linear-gradient(135deg, #4A6884 0%, #1a3353 100%)' }
                      : { background: '#2563EB' }
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Ver mi operación
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Operation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={isEmpresa
              ? { background: '#0D1B2A', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }
              : { background: '#ffffff', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>


            {/* Header */}
            <div style={{ padding: '20px 24px 0' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: isEmpresa ? 'rgba(143,184,204,0.55)' : '#94A3B8' }}>
                    Confirmación requerida
                  </p>
                  <h3 className="text-lg font-bold leading-tight" style={{ color: isEmpresa ? '#ffffff' : '#0F172A' }}>
                    Cancelar operación
                  </h3>
                </div>
                <button
                  onClick={() => { setIsCancelModalOpen(false); setCancelReason(''); setError(null); }}
                  disabled={isCancelling}
                  className="rounded-lg p-1.5 transition"
                  style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#94A3B8', background: isEmpresa ? 'rgba(255,255,255,0.04)' : '#F1F5F9' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, margin: '16px 0 0', background: isEmpresa ? 'rgba(143,184,204,0.08)' : '#F1F5F9' }} />

            {/* Body */}
            <div style={{ padding: '20px 24px 24px' }} className="space-y-4">

              {/* Operation pill */}
              {createdOperation && (
                <div className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={isEmpresa
                    ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(143,184,204,0.1)' }
                    : { background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#94A3B8' }}>
                      Operación
                    </p>
                    <p className="text-sm font-bold font-mono" style={{ color: isEmpresa ? '#ffffff' : '#0F172A' }}>
                      {createdOperation.codigo_operacion}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : '#94A3B8' }}>
                      Monto
                    </p>
                    <p className="text-sm font-semibold" style={{ color: isEmpresa ? 'rgba(255,255,255,0.8)' : '#374151' }}>
                      ${createdOperation.monto_dolares} · S/{createdOperation.monto_soles}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed" style={{ color: isEmpresa ? 'rgba(255,255,255,0.5)' : '#64748B' }}>
                Esta acción no se puede deshacer. Por favor indica el motivo antes de continuar.
              </p>

              {/* Reason textarea */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#64748B' }}>
                  Motivo *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ej: No puedo realizar la transferencia en este momento"
                  className="w-full px-3.5 py-2.5 rounded-xl resize-none outline-none text-sm transition"
                  style={isEmpresa
                    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.15)', color: '#ffffff' }
                    : { background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}
                  rows={3}
                  disabled={isCancelling}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl px-3.5 py-3"
                  style={isEmpresa
                    ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }
                    : { background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: isEmpresa ? '#FCA5A5' : '#DC2626' }} />
                  <p className="text-xs" style={{ color: isEmpresa ? '#FCA5A5' : '#991B1B' }}>{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => { setIsCancelModalOpen(false); setCancelReason(''); setError(null); }}
                  disabled={isCancelling}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                  style={isEmpresa
                    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.15)', color: 'rgba(255,255,255,0.7)' }
                    : { background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#374151' }}
                >
                  Volver
                </button>
                <button
                  onClick={() => handleCancelOperation()}
                  disabled={isCancelling || !cancelReason.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}
                >
                  {isCancelling
                    ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Cancelando...</>
                    : <>Confirmar cancelación</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm animation ripple */}
      {isConfirmAnimating && (
        <div className="fixed inset-0 z-[199] flex items-center justify-center pointer-events-none">
          <style>{`
            @keyframes confirmRipple1 {
              0%   { transform: scale(0);    opacity: 0.8; }
              70%  { transform: scale(1);    opacity: 0.25; }
              100% { transform: scale(1.12); opacity: 0; }
            }
            @keyframes confirmRipple2 {
              0%   { transform: scale(0);    opacity: 0.6; }
              70%  { transform: scale(1);    opacity: 0.15; }
              100% { transform: scale(1.12); opacity: 0; }
            }
            @keyframes confirmRipple3 {
              0%   { transform: scale(0);    opacity: 0.4; }
              70%  { transform: scale(1);    opacity: 0.1; }
              100% { transform: scale(1.12); opacity: 0; }
            }
            @keyframes confirmPulse {
              0%   { transform: scale(0.7);  opacity: 0; }
              20%  { transform: scale(1.08); opacity: 1; }
              35%  { transform: scale(0.96); opacity: 1; }
              50%  { transform: scale(1.02); opacity: 1; }
              65%  { transform: scale(0.98); opacity: 1; }
              80%  { transform: scale(1);    opacity: 1; }
              90%  { transform: scale(1);    opacity: 1; }
              100% { transform: scale(0.92); opacity: 0; }
            }
            @keyframes confirmFadeBg {
              0%   { opacity: 0; }
              15%  { opacity: 1; }
              85%  { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes confirmCheck {
              0%   { stroke-dashoffset: 30; opacity: 0; }
              40%  { stroke-dashoffset: 0;  opacity: 1; }
              85%  { stroke-dashoffset: 0;  opacity: 1; }
              100% { stroke-dashoffset: 0;  opacity: 0; }
            }
          `}</style>
          {/* Backdrop fade */}
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', animation: 'confirmFadeBg 1.8s ease forwards' }} />
          {/* Ripple rings */}
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1.5px solid rgba(37,99,235,0.4)', animation: 'confirmRipple1 1.4s cubic-bezier(0.22,0.68,0,1) 0.1s forwards' }} />
            <div style={{ position: 'absolute', width: '75%', height: '75%', borderRadius: '50%', border: '1.5px solid rgba(37,99,235,0.55)', animation: 'confirmRipple2 1.4s cubic-bezier(0.22,0.68,0,1) 0.22s forwards' }} />
            <div style={{ position: 'absolute', width: '52%', height: '52%', borderRadius: '50%', border: '1.5px solid rgba(37,99,235,0.7)', animation: 'confirmRipple3 1.4s cubic-bezier(0.22,0.68,0,1) 0.34s forwards' }} />
            {/* Center icon */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(37,99,235,0.7), 0 0 80px rgba(37,99,235,0.3)', animation: 'confirmPulse 1.8s cubic-bezier(0.34,1.2,0.64,1) forwards', position: 'relative', zIndex: 1 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" strokeDasharray="30" strokeDashoffset="30"
                  style={{ animation: 'confirmCheck 1.8s ease forwards' }} />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Operation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div className="rounded-2xl w-full animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: 380, background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', border: '1px solid rgba(0,0,0,0.07)' }}>

            {/* Close button flotante */}
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <div className="flex items-center gap-2">
                <p className="text-base font-black" style={{ color: '#0D1117' }}>Confirmar Operación</p>
              </div>
              <button
                onClick={() => { setIsConfirmModalOpen(false); setError(null); }}
                disabled={isSubmitting}
                className="w-7 h-7 rounded-full flex items-center justify-center transition hover:bg-gray-100 disabled:opacity-30"
                style={{ color: '#9CA3AF' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pb-5 space-y-4">

              {/* Summary card */}
              <div className="rounded-xl overflow-hidden" style={{ border: isEmpresa ? '1px solid rgba(143,184,204,0.2)' : '1px solid rgba(30,41,59,0.1)' }}>
                {/* Operation type banner */}
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: isEmpresa ? 'rgba(74,104,132,0.3)' : 'rgba(13,27,42,0.04)' }}>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : 'rgba(30,41,59,0.45)' }}>Operación</span>
                  <span className="text-sm font-bold" style={{ color: isEmpresa ? '#ffffff' : '#0D1B2A' }}>
                    {tipo === 'Compra' ? 'Qoricash Compra' : 'Qoricash Vende'}
                  </span>
                </div>

                {/* Amount rows */}
                <div className="divide-y" style={{ borderColor: isEmpresa ? 'rgba(143,184,204,0.12)' : 'rgba(30,41,59,0.07)' }}>
                  {/* Usted paga */}
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: isEmpresa ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                    <span className="text-xs font-medium" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#6b7280' }}>Usted paga</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{tipo === 'Compra' ? '🇺🇸' : '🇵🇪'}</span>
                      <span className="text-base font-bold" style={{ color: isEmpresa ? '#ffffff' : '#0D1B2A' }}>
                        {tipo === 'Compra'
                          ? `$ ${parseFloat(amountInput).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `S/ ${parseFloat(amountInput).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  </div>
                  {/* Usted recibe */}
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: isEmpresa ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.04)' }}>
                    <span className="text-xs font-medium" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#6b7280' }}>Usted recibe</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{tipo === 'Compra' ? '🇵🇪' : '🇺🇸'}</span>
                      <span className="text-base font-bold" style={{ color: '#2563EB' }}>
                        {tipo === 'Compra'
                          ? `S/ ${parseFloat(amountOutput).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `$ ${parseFloat(amountOutput).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  </div>
                  {/* TC */}
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: isEmpresa ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                    <span className="text-xs font-medium" style={{ color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#6b7280' }}>Tipo de cambio</span>
                    <span className="text-sm font-semibold" style={{ color: isEmpresa ? '#ffffff' : '#0D1B2A' }}>
                      S/ {getAdjustedRate()?.toFixed(3)}
                    </span>
                  </div>
                  {/* Descuento referido */}
                  {appliedDiscount > 0 && (
                    <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(37,99,235,0.04)' }}>
                      <span className="text-xs font-semibold" style={{ color: '#2563EB' }}>🎉 Descuento referido</span>
                      <span className="text-sm font-bold" style={{ color: '#2563EB' }}>{appliedDiscount.toFixed(3)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cuentas seleccionadas */}
              {(() => {
                const origin = bankAccounts.find(a => a.id === selectedOriginAccount);
                const dest   = bankAccounts.find(a => a.id === selectedDestinationAccount);
                if (!origin && !dest) return null;
                return (
                  <div className="rounded-xl p-3 space-y-2" style={isEmpresa ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(143,184,204,0.15)' } : { background: 'rgba(30,41,59,0.03)', border: '1px solid rgba(30,41,59,0.07)' }}>
                    {origin && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : 'rgba(30,41,59,0.4)' }}>Cuenta de cargo</span>
                        <div className="flex items-center gap-1.5">
                          {getBankLogo(origin.banco) && (
                            <img src={getBankLogo(origin.banco)!} alt={origin.banco} className="w-4 h-4 object-contain rounded" />
                          )}
                          <span className="text-xs font-medium" style={{ color: isEmpresa ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.6)' }}>{origin.numero_cuenta}</span>
                          <span className="text-[10px] px-1 py-0.5 rounded" style={isEmpresa ? { background: 'rgba(143,184,204,0.15)', color: 'rgba(143,184,204,0.7)' } : { background: 'rgba(30,41,59,0.07)', color: 'rgba(30,41,59,0.45)' }}>{origin.moneda}</span>
                        </div>
                      </div>
                    )}
                    {dest && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : 'rgba(30,41,59,0.4)' }}>Cuenta de destino</span>
                        <div className="flex items-center gap-1.5">
                          {getBankLogo(dest.banco) && (
                            <img src={getBankLogo(dest.banco)!} alt={dest.banco} className="w-4 h-4 object-contain rounded" />
                          )}
                          <span className="text-xs font-medium" style={{ color: isEmpresa ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.6)' }}>{dest.numero_cuenta}</span>
                          <span className="text-[10px] px-1 py-0.5 rounded" style={isEmpresa ? { background: 'rgba(143,184,204,0.15)', color: 'rgba(143,184,204,0.7)' } : { background: 'rgba(30,41,59,0.07)', color: 'rgba(30,41,59,0.45)' }}>{dest.moneda}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Disclaimer */}
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : 'rgba(30,41,59,0.4)' }}>
                  Al confirmar, aceptas las condiciones de la operación.
                </span>
                <div className="relative group flex-shrink-0">
                  <HelpCircle className="w-3.5 h-3.5 cursor-help" style={{ color: 'rgba(30,41,59,0.35)' }} />
                  <div className="absolute bottom-full mb-2 w-72 p-3 rounded-xl text-xs leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20"
                    style={{ background: '#1E293B', color: 'rgba(255,255,255,0.82)', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', left: '50%', transform: 'translateX(-50%)' }}>
                    <p className="font-semibold text-white mb-1.5">Condiciones de la operación</p>
                    <ul className="space-y-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <li>• El tipo de cambio es válido por 15 minutos desde la confirmación.</li>
                      <li>• Debes realizar la transferencia dentro del tiempo establecido.</li>
                      <li>• Qoricash procesará tu operación una vez verificado el pago.</li>
                      <li>• Si no se completa en 15 minutos, la operación será anulada automáticamente.</li>
                    </ul>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1" style={{ background: '#1E293B' }} />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm" style={isEmpresa
                  ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }
                  : { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsConfirmModalOpen(false); setError(null); }}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  style={isEmpresa
                    ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(143,184,204,0.2)', color: '#ffffff' }
                    : { background: 'rgba(30,41,59,0.06)', color: '#0D1B2A' }}
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndCreate}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
                  style={isEmpresa
                    ? { background: 'linear-gradient(135deg, #4A6884, #1a3353)', boxShadow: '0 4px 14px rgba(74,104,132,0.4)' }
                    : { background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
                >
                  {isSubmitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" />Procesando...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" />Confirmar</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Upload Proof Modal */}
      {isUploadProofModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: isEmpresa ? 'rgba(4,10,20,0.7)' : 'rgba(13,27,42,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <div className="rounded-2xl shadow-2xl w-full" style={{ maxWidth: 420, ...(isEmpresa
            ? { background: 'linear-gradient(135deg, rgba(13,27,42,0.6) 0%, rgba(26,51,83,0.55) 100%)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(143,184,204,0.22)', boxShadow: '0 32px 64px rgba(0,0,0,0.45)' }
            : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 32px 64px rgba(0,0,0,0.18)' }) }}>

            {/* Header institucional */}
            <div className="relative flex items-center justify-between px-5 py-4 rounded-t-2xl overflow-hidden"
              style={{ background: isEmpresa ? 'linear-gradient(160deg, #0D1B2A 0%, #1A3353 100%)' : 'linear-gradient(160deg, #1E3A8A 0%, #2563EB 100%)' }}>

              {/* Subtle grid overlay */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />

              {/* Texto */}
              <div className="flex items-center gap-2.5" style={{ zIndex: 1 }}>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.45)' }}>Paso final</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>·</span>
                <h3 className="text-sm font-black text-white" style={{ letterSpacing: '-0.01em' }}>Confirmar transferencia</h3>
              </div>

              {/* Close button */}
              <button
                onClick={() => { setIsUploadProofModalOpen(false); setUploadedFiles([]); setVoucherCode(''); setError(null); }}
                disabled={isUploadingProof}
                className="transition disabled:opacity-30 flex-shrink-0"
                style={{ color: 'rgba(255,255,255,0.35)', zIndex: 1 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">

              {/* Info strip */}
              <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl" style={isEmpresa
                ? { background: 'rgba(74,104,132,0.2)', border: '1px solid rgba(143,184,204,0.2)' }
                : { background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)' }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2563EB' }} />
                <p className="text-xs leading-relaxed" style={{ color: isEmpresa ? 'rgba(255,255,255,0.8)' : '#4b5563' }}>
                  Ingresa el número de operación que aparece en el comprobante de tu transferencia. Con eso podemos identificar tu pago al instante.
                </p>
              </div>

              {/* Número de operación — campo principal */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: isEmpresa ? 'rgba(143,184,204,0.8)' : 'rgba(30,41,59,0.5)' }}>
                  N° de operación de tu transferencia
                </label>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Ej: 00123456789"
                  disabled={isUploadingProof}
                  autoFocus
                  className="w-full px-4 py-3 text-sm font-semibold rounded-xl outline-none transition"
                  style={isEmpresa
                    ? { border: '1.5px solid rgba(143,184,204,0.25)', background: 'rgba(255,255,255,0.07)', color: '#ffffff', letterSpacing: '0.04em' }
                    : { border: '1.5px solid rgba(30,41,59,0.15)', background: 'rgba(30,41,59,0.02)', color: '#1E293B', letterSpacing: '0.04em' }}
                  onFocus={e => (e.currentTarget.style.borderColor = isEmpresa ? '#8fb8cc' : '#2563EB')}
                  onBlur={e => (e.currentTarget.style.borderColor = isEmpresa ? 'rgba(143,184,204,0.25)' : 'rgba(30,41,59,0.15)')}
                />
                <p className="text-[11px] mt-1.5" style={{ color: isEmpresa ? 'rgba(143,184,204,0.5)' : 'rgba(30,41,59,0.4)' }}>
                  Este número aparece en el voucher o constancia de tu banco tras realizar la transferencia.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs" style={isEmpresa
                  ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }
                  : { background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#b91c1c' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setIsUploadProofModalOpen(false); setVoucherCode(''); setError(null); }}
                  disabled={isUploadingProof}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition disabled:opacity-40"
                  style={isEmpresa
                    ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(143,184,204,0.2)', color: '#ffffff' }
                    : { background: 'rgba(30,41,59,0.06)', color: '#0D1B2A' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitProof}
                  disabled={isUploadingProof || !voucherCode.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
                  style={isEmpresa
                    ? { background: 'linear-gradient(135deg, #4A6884, #1a3353)', boxShadow: '0 4px 14px rgba(74,104,132,0.4)' }
                    : { background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
                >
                  {isUploadingProof ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> Confirmar transferencia</>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* KYC Document Upload Modal */}
      {isKYCModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ background: isEmpresa ? 'rgba(13,27,42,0.85)' : 'rgba(0,0,0,0.6)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={isEmpresa ? { background: 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(26,51,83,0.97) 100%)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(143,184,204,0.15)' } : { background: '#fff' }}>

            {/* ── LOADING / SUCCESS STATE ── */}
            {(isUploadingKYC || kycUploadDone) && (
              <div className="flex flex-col items-center justify-center gap-7" style={{ width: '100%', height: 300 }}>
                <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                    <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="7" />
                    {isUploadingKYC && (
                      <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="7"
                        strokeLinecap="round" strokeDasharray="327" strokeDashoffset="327"
                        style={{ animation: 'op-progress 5s cubic-bezier(0.4,0,0.6,1) forwards' }}
                      />
                    )}
                    {kycUploadDone && (
                      <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="7"
                        strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" />
                    )}
                  </svg>
                  <div style={{ width: 88, height: 88, borderRadius: '50%', background: isEmpresa ? 'rgba(13,27,42,0.8)' : '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: isEmpresa ? '1px solid rgba(143,184,204,0.2)' : '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    {isUploadingKYC ? (
                      <Image src="/logo-principal.png" alt="Qoricash" width={56} height={56}
                        style={{ objectFit: 'contain', animation: 'op-pulse-logo 1.8s ease-in-out infinite' }} />
                    ) : (
                      <div style={{ animation: 'op-scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                          <circle cx="22" cy="22" r="22" fill={isEmpresa ? '#4A6884' : '#0D1B2A'} />
                          <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5"
                            strokeLinecap="round" strokeLinejoin="round"
                            strokeDasharray="60" strokeDashoffset="60"
                            style={{ animation: 'op-check 0.5s ease-out 0.15s forwards' }} />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {isUploadingKYC ? (
                  <div style={{ textAlign: 'center', animation: 'op-fade-up 0.35s ease-out both' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: isEmpresa ? '#8fb8cc' : '#0D1117', margin: '0 0 8px' }}>
                      Enviando documentos
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                      {[0, 0.18, 0.36].map((delay, i) => (
                        <span key={i} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                          background: isEmpresa ? '#8fb8cc' : '#0D1B2A',
                          animation: `op-dot 1.2s ease-in-out ${delay}s infinite` }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>Por favor espera un momento</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', animation: 'op-fade-up 0.4s ease-out both' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: isEmpresa ? '#ffffff' : '#111827', margin: 0 }}>¡Documentos enviados!</p>
                    <p style={{ fontSize: 11, color: isEmpresa ? 'rgba(143,184,204,0.7)' : '#9ca3af', marginTop: 4 }}>Los revisaremos en aprox. 10 minutos</p>
                  </div>
                )}
              </div>
            )}

            {/* ── FORM STATE ── */}
            {!isUploadingKYC && !kycUploadDone && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ background: '#1d4ed8' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <FileImage className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">Validación de Documentos</h3>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Proceso único · aprox. 10 minutos</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsKYCModalOpen(false); setDnifront(null); setDniBack(null); setRucFicha(null); setError(null); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:bg-white/10"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-3">
                  {/* Info pill */}
                  <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5" style={isEmpresa
                    ? { background: 'rgba(74,104,132,0.2)', border: '1px solid rgba(143,184,204,0.2)' }
                    : { background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: isEmpresa ? '#8fb8cc' : '#0ea5e9' }}>
                      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3a.75.75 0 1 1 0 1.5A.75.75 0 0 1 8 4Zm-.25 3h.5a.75.75 0 0 1 0 1.5v2.25a.75.75 0 0 1-1.5 0V8.5A.75.75 0 0 1 7.75 7Z"/></svg>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: isEmpresa ? 'rgba(255,255,255,0.85)' : '#0c4a6e' }}>
                      {user?.document_type === 'RUC'
                        ? 'Adjunta la Ficha RUC de tu empresa para activar tu cuenta.'
                        : 'Adjunta ambas caras de tu DNI o CE para activar tu cuenta.'}
                    </p>
                  </div>

                  {/* DNI uploads */}
                  {user?.document_type !== 'RUC' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'dni-front-upload', label: 'Anverso', file: dniFront, setter: setDnifront },
                        { id: 'dni-back-upload',  label: 'Reverso',  file: dniBack,  setter: setDniBack  },
                      ].map(({ id, label, file, setter }) => (
                        <div key={id}>
                          <p className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">DNI · {label}</p>
                          <input type="file" id={id} accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setter(e.target.files[0]); }} className="hidden" disabled={isUploadingKYC} />
                          <label htmlFor={id} className="flex flex-col items-center justify-center gap-1.5 rounded-xl cursor-pointer transition-all py-4 px-2 text-center"
                            style={{ border: file ? '1.5px solid #2563EB' : '1.5px dashed #d1d5db', background: file ? '#EFF6FF' : '#fafafa' }}>
                            {file ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                                <span className="text-[10px] font-medium text-blue-700 truncate w-full text-center px-1">{file.name}</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-gray-300" />
                                <span className="text-[10px] text-gray-400">Toca para subir</span>
                              </>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RUC upload */}
                  {user?.document_type === 'RUC' && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Ficha RUC</p>
                      <input type="file" id="ruc-ficha-upload" accept="image/*,.pdf" onChange={(e) => { if (e.target.files?.[0]) setRucFicha(e.target.files[0]); }} className="hidden" disabled={isUploadingKYC} />
                      <label htmlFor="ruc-ficha-upload" className="flex items-center gap-3 rounded-xl cursor-pointer transition-all px-4 py-3"
                        style={{ border: rucFicha ? '1.5px solid #2563EB' : '1.5px dashed #d1d5db', background: rucFicha ? '#EFF6FF' : '#fafafa' }}>
                        {rucFicha ? <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" /> : <Upload className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                        <span className="text-xs text-gray-500 truncate">{rucFicha ? rucFicha.name : 'PNG, JPG o PDF (máx. 5MB)'}</span>
                      </label>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={isEmpresa
                      ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }
                      : { background: '#fef2f2', border: '1px solid #fecaca' }}>
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: isEmpresa ? '#fca5a5' : '#ef4444' }} />
                      <p className="text-xs" style={{ color: isEmpresa ? '#fca5a5' : '#b91c1c' }}>{error}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-2.5 px-5 pb-5">
                  <button
                    onClick={() => { setIsKYCModalOpen(false); setDnifront(null); setDniBack(null); setRucFicha(null); setError(null); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                    style={isEmpresa
                      ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(143,184,204,0.2)', color: '#ffffff' }
                      : { border: '1px solid #e5e7eb', color: '#4b5563' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUploadKYCDocuments}
                    disabled={user?.document_type === 'RUC' ? !rucFicha : (!dniFront || !dniBack)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={isEmpresa
                      ? { background: 'linear-gradient(135deg, #4A6884, #1a3353)', boxShadow: '0 4px 14px rgba(74,104,132,0.4)' }
                      : { background: '#0D1B2A' }}
                  >
                    <Upload className="w-4 h-4" />
                    Enviar Documentos
                  </button>
                </div>
              </>
            )}

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

      {/* Off Hours Modal */}
      <OffHoursModal
        isOpen={isOffHoursModalOpen}
        nextBusinessDay={getNextBusinessDay()}
        isEmpresa={isEmpresa}
        onConfirm={async () => {
          setIsOffHoursModalOpen(false);
          setPendingSubmitEvent(null);
          await processSubmit();
        }}
        onCancel={() => {
          setIsOffHoursModalOpen(false);
          setPendingSubmitEvent(null);
        }}
      />

      {/* ── Overlay: Creando operación ── */}
      {showCreatingOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4" style={{ background: 'rgba(13,27,42,0.72)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
          <div className="op-overlay-card rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-7" style={{ width: 280, height: 300, background: isEmpresa ? 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(26,51,83,0.97) 100%)' : '#ffffff', border: isEmpresa ? '1px solid rgba(143,184,204,0.15)' : '1px solid rgba(0,0,0,0.06)' }}>

            {/* Ring + center */}
            <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? 'rgba(143,184,204,0.15)' : 'rgba(13,27,42,0.08)'} strokeWidth="7" />
                {!showCreatingSuccess && (
                  <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="327" strokeDashoffset="327"
                    style={{ animation: 'op-progress 4.5s cubic-bezier(0.4,0,0.6,1) forwards' }}
                    onAnimationEnd={handleCreateProgressEnd}
                  />
                )}
                {showCreatingSuccess && (
                  <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" />
                )}
              </svg>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: isEmpresa ? 'rgba(255,255,255,0.07)' : '#fff', boxShadow: isEmpresa ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)', border: isEmpresa ? '1px solid rgba(143,184,204,0.2)' : '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                {!showCreatingSuccess ? (
                  <Image src="/logo-principal.png" alt="Qoricash" width={64} height={64}
                    style={{ objectFit: 'contain', animation: 'op-pulse-logo 1.8s ease-in-out infinite' }} />
                ) : (
                  <div style={{ animation: 'op-scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r="22" fill={isEmpresa ? '#4A6884' : '#0D1B2A'} />
                      <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="60" strokeDashoffset="60"
                        style={{ animation: 'op-check 0.5s ease-out 0.15s forwards' }} />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Text */}
            {!showCreatingSuccess ? (
              <div style={{ textAlign: 'center', animation: 'op-fade-up 0.35s ease-out both' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: isEmpresa ? '#8fb8cc' : '#0D1117', margin: '0 0 8px' }}>
                  Creando operación
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                  {[0, 0.18, 0.36].map((delay, i) => (
                    <span key={i} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: isEmpresa ? '#8fb8cc' : '#0D1117', animation: `op-dot 1.2s ease-in-out ${delay}s infinite` }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: isEmpresa ? 'rgba(143,184,204,0.55)' : '#9ca3af', marginTop: 8 }}>Por favor espera</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', animation: 'op-fade-up 0.4s ease-out both' }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: isEmpresa ? '#ffffff' : '#0D1117', margin: '0 0 4px' }}>¡Operación generada!</p>
                <p style={{ fontSize: 11, color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#9ca3af' }}>Preparando transferencia...</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Overlay: Verificando estado KYC ── */}
      {showVerifyOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4" style={{ background: 'rgba(13,27,42,0.7)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}>
          <div className="op-overlay-card rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-6" style={{ width: 260, height: 260, background: isEmpresa ? 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(26,51,83,0.97) 100%)' : '#ffffff', border: isEmpresa ? '1px solid rgba(143,184,204,0.15)' : undefined }}>
            <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="55" cy="55" r="46" fill="none" stroke={isEmpresa ? 'rgba(143,184,204,0.15)' : 'rgba(0,0,0,0.08)'} strokeWidth="6" />
                <circle cx="55" cy="55" r="46" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="6"
                  strokeLinecap="round" strokeDasharray="289" strokeDashoffset="289"
                  style={{ animation: 'op-progress-289 2s cubic-bezier(0.4,0,0.6,1) forwards' }} />
              </svg>
              <div style={{ width: 76, height: 76, borderRadius: '50%', background: isEmpresa ? 'rgba(255,255,255,0.07)' : '#fff', boxShadow: isEmpresa ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)', border: isEmpresa ? '1px solid rgba(143,184,204,0.2)' : '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <Image src="/logo-principal.png" alt="Qoricash" width={48} height={48}
                  style={{ objectFit: 'contain', animation: 'op-pulse-logo 1.2s ease-in-out infinite' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: isEmpresa ? '#8fb8cc' : '#0D1117', margin: 0 }}>Verificando estado...</p>
              <p style={{ fontSize: 11, color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#9ca3af', marginTop: 3 }}>Consultando tu cuenta</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Overlay: Procesando comprobante ── */}
      {showProofOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4" style={{ background: 'rgba(13,27,42,0.7)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}>
          <div className="op-overlay-card rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-7" style={{ width: 280, height: 300, background: isEmpresa ? 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(26,51,83,0.97) 100%)' : '#ffffff', border: isEmpresa ? '1px solid rgba(143,184,204,0.15)' : undefined }}>
            <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? 'rgba(143,184,204,0.15)' : 'rgba(0,0,0,0.08)'} strokeWidth="7" />
                {!showProofSuccess && (
                  <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="327" strokeDashoffset="327"
                    style={{ animation: 'op-progress 4.5s cubic-bezier(0.4,0,0.6,1) forwards' }}
                    onAnimationEnd={handleProofProgressEnd}
                  />
                )}
                {showProofSuccess && (
                  <circle cx="64" cy="64" r="52" fill="none" stroke={isEmpresa ? '#8fb8cc' : '#0D1B2A'} strokeWidth="7"
                    strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" />
                )}
              </svg>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: isEmpresa ? 'rgba(255,255,255,0.07)' : '#fff', boxShadow: isEmpresa ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)', border: isEmpresa ? '1px solid rgba(143,184,204,0.2)' : '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                {!showProofSuccess ? (
                  <Image src="/logo-principal.png" alt="Qoricash" width={64} height={64}
                    style={{ objectFit: 'contain', animation: 'op-pulse-logo 1.8s ease-in-out infinite' }} />
                ) : (
                  <div style={{ animation: 'op-scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r="22" fill={isEmpresa ? '#4A6884' : '#0D1B2A'} />
                      <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="60" strokeDashoffset="60"
                        style={{ animation: 'op-check 0.5s ease-out 0.15s forwards' }} />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            {!showProofSuccess ? (
              <div style={{ textAlign: 'center', animation: 'op-fade-up 0.35s ease-out both' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: isEmpresa ? '#8fb8cc' : '#0D1117', margin: '0 0 8px' }}>
                  Operación en proceso
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                  {[0, 0.18, 0.36].map((delay, i) => (
                    <span key={i} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                      background: isEmpresa ? '#8fb8cc' : '#0D1B2A',
                      animation: `op-dot 1.2s ease-in-out ${delay}s infinite` }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#9ca3af', marginTop: 8 }}>Registrando tu transferencia</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', animation: 'op-fade-up 0.4s ease-out both' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: isEmpresa ? '#ffffff' : '#111827', margin: 0 }}>¡Transferencia registrada!</p>
                <p style={{ fontSize: 11, color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#9ca3af', marginTop: 4 }}>Procesando tu operación...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Overlay: Cancelando operación ── */}
      {showCancelOverlay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4" style={{ WebkitBackdropFilter: 'blur(3px)', backdropFilter: 'blur(3px)' }}>
          <div className="op-overlay-card rounded-2xl shadow-2xl w-full max-w-xs p-8 text-center" style={{ background: isEmpresa ? 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(26,51,83,0.97) 100%)' : '#ffffff', border: isEmpresa ? '1px solid rgba(143,184,204,0.15)' : undefined }}>
            {!showCancelOverlaySuccess ? (
              <>
                <div className="w-16 h-16 rounded-full animate-spin mx-auto mb-5" style={{ border: isEmpresa ? '4px solid rgba(143,184,204,0.2)' : '4px solid #fee2e2', borderTopColor: '#ef4444' }} />
                <p className="text-lg font-bold mb-1" style={{ color: isEmpresa ? '#ffffff' : '#111827' }}>Procesando cancelación...</p>
                <p className="text-sm mt-1" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#6b7280' }}>Un momento, por favor</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: isEmpresa ? 'rgba(239,68,68,0.12)' : '#fee2e2' }}>
                  <XCircle className="w-9 h-9 text-red-500" />
                </div>
                <p className="text-lg font-bold mb-1" style={{ color: isEmpresa ? '#ffffff' : '#111827' }}>Operación cancelada</p>
                <p className="text-sm leading-relaxed" style={{ color: isEmpresa ? 'rgba(143,184,204,0.6)' : '#6b7280' }}>
                  Recuerda que cancelar operaciones de forma recurrente puede afectar tu historial.
                </p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function NuevaOperacionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div></div>}>
      <NuevaOperacionContent />
    </Suspense>
  );
}
