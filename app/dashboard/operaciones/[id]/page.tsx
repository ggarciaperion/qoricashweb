'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useOperationEventStore } from '@/lib/store/operationEventStore';
import { operationsApi } from '@/lib/api/operations';
import { formatSafeDate } from '@/lib/utils/date';
import type { Operation } from '@/lib/types';
import { getQoricashAccount } from '@/lib/config/qoricash-accounts';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  AlertCircle,
  RefreshCw,
  Copy,
  Sparkles,
  FileText,
  Receipt,
  BadgeCheck,
} from 'lucide-react';



export default function OperacionDetallesPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { lastEvent } = useOperationEventStore();

  const [operation, setOperation] = useState<Operation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelProcessing, setShowCancelProcessing] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showCompletedCelebration, setShowCompletedCelebration] = useState(false);
  const lastEventRef = useRef<typeof lastEvent>(null);

  const isEmpresa = user?.document_type === 'RUC';
  const operationId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (operationId) loadOperation();
  }, [isAuthenticated, operationId]);

  // Reaccionar a eventos realtime de la operación actual
  useEffect(() => {
    if (!lastEvent || !operation) return;
    // Evitar reprocesar el mismo evento
    if (lastEventRef.current?.timestamp === lastEvent.timestamp) return;
    lastEventRef.current = lastEvent;

    // Solo reaccionar si el evento es de esta operación
    const matchById = lastEvent.id === operation.id;
    const matchByCode = lastEvent.operation_id === operation.codigo_operacion;
    if (!matchById && !matchByCode) return;

    // Recargar la operación desde el backend
    loadOperation();

    // Mostrar celebración si se completó
    if (lastEvent.status === 'Completada') {
      setShowCompletedCelebration(true);
    }
  }, [lastEvent]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOperation = async () => {
    if (!operationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await operationsApi.getOperation(operationId, user?.dni || '');

      if (response.success && response.data) {
        setOperation(response.data);
      } else {
        setError(response.message || 'Operación no encontrada');
      }
    } catch (error: any) {
      console.error('Error loading operation:', error);
      setError(error.response?.data?.message || 'Error al cargar la operación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !operationId) return;

    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede superar los 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos JPG, PNG o PDF');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await operationsApi.uploadProof(operationId, file, voucherCode.trim());

      if (response.success) {
        setUploadSuccess(true);
        setVoucherCode('');
        await loadOperation();
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setError(response.message || 'Error al subir el comprobante');
      }
    } catch (error: any) {
      console.error('Error uploading proof:', error);
      setError(error.response?.data?.message || 'Error al subir el comprobante');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelOperation = async () => {
    if (!operationId || !cancelReason.trim()) return;

    setIsCancelModalOpen(false);
    setShowCancelProcessing(true);
    setShowCancelSuccess(false);
    const startTime = Date.now();

    try {
      const response = await operationsApi.cancelOperation(operationId, cancelReason);

      if (response.success) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2200 - elapsed);
        setTimeout(() => {
          setShowCancelSuccess(true);
          setTimeout(() => {
            router.push('/dashboard');
          }, 2500);
        }, remaining);
      } else {
        setShowCancelProcessing(false);
        setError(response.message || 'Error al cancelar la operación');
      }
    } catch (error: any) {
      console.error('Error canceling operation:', error);
      setShowCancelProcessing(false);
      setError(error.response?.data?.message || 'Error al cancelar la operación');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const normalizeBankName = (bankName: string): string => {
    if (!bankName) return 'OTROS';
    const n = bankName.toUpperCase().trim();
    if (n.includes('BCP') || n.includes('CRÉDITO') || n.includes('CREDITO')) return 'BCP';
    if (n.includes('INTERBANK')) return 'INTERBANK';
    if (n.includes('PICHINCHA')) return 'PICHINCHA';
    if (n.includes('BANBIF') || n.includes('BAN BIF')) return 'BANBIF';
    if (n.includes('BBVA')) return 'BBVA';
    if (n.includes('SCOTIABANK')) return 'SCOTIABANK';
    return 'OTROS';
  };

  const getBankLogo = (banco: string): string | null => {
    const name = (banco || '').toLowerCase();
    if (name.includes('bcp') || name.includes('credito')) return '/BCP.png';
    if (name.includes('interbank')) return '/Interbank.png';
    if (name.includes('banbif')) return '/BanBif.png';
    if (name.includes('pichincha')) return '/Banco Pichincha.png';
    if (name.includes('bbva') || name.includes('continental')) return '/BBVA.png';
    if (name.includes('scotiabank')) return '/Scotiabank.png';
    return null;
  };

  const getDestinationAccount = () => {
    if (!operation) return null;
    const bankRaw = operation.source_bank_name || operation.banco_cliente || '';
    const clientBank = normalizeBankName(bankRaw);
    // compra = client sends USD to Qoricash; venta = client sends S/ to Qoricash
    const currency = operation.tipo === 'compra' ? '$' : 'S/';
    return getQoricashAccount(clientBank, currency);
  };

  const formatDate = (dateString: string | null | undefined) => {
    return formatSafeDate(dateString);
  };

  const estado = operation?.estado ?? 'pendiente';

  /* ── status config ── */
  const STATUS_CFG: Record<string, { label: string; dotColor: string; badgeBg: string; badgeColor: string; badgeBorder: string; pulsing: boolean }> = {
    pendiente:  { label: 'Esperando transferencia', dotColor: '#F59E0B', badgeBg: 'rgba(245,158,11,0.12)',  badgeColor: '#F59E0B', badgeBorder: 'rgba(245,158,11,0.35)', pulsing: true  },
    en_proceso: { label: 'En proceso',               dotColor: '#3B82F6', badgeBg: 'rgba(37,99,235,0.12)',   badgeColor: '#60a5fa', badgeBorder: 'rgba(37,99,235,0.35)',  pulsing: true  },
    completado: { label: 'Completado',               dotColor: '#22C55E', badgeBg: 'rgba(22,163,74,0.12)',   badgeColor: '#4ade80', badgeBorder: 'rgba(22,163,74,0.35)',  pulsing: false },
    cancelado:  { label: 'Cancelado',                dotColor: '#6B7280', badgeBg: 'rgba(107,114,128,0.12)', badgeColor: '#9CA3AF', badgeBorder: 'rgba(107,114,128,0.3)', pulsing: false },
    rechazado:  { label: 'Rechazado',                dotColor: '#EF4444', badgeBg: 'rgba(239,68,68,0.12)',   badgeColor: '#f87171', badgeBorder: 'rgba(239,68,68,0.35)',  pulsing: false },
  };
  const sc = STATUS_CFG[estado] ?? STATUS_CFG.pendiente;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-t-blue-600 animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#2563EB' }} />
          <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Cargando operación...</p>
        </div>
      </div>
    );
  }

  if (error && !operation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8FAFC' }}>
        <div className="rounded-2xl p-8 max-w-sm w-full text-center" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="font-bold mb-1" style={{ color: '#0D1117' }}>No encontrado</p>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>{error}</p>
          <button onClick={() => router.push('/dashboard/historial')} className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ background: '#0A0A0A' }}>
            Volver al historial
          </button>
        </div>
      </div>
    );
  }

  if (!operation) return null;

  const qcAccount = getDestinationAccount();
  const transferAmount = operation.tipo === 'compra'
    ? `$ ${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : `S/ ${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

  const isCancelled = estado === 'cancelado' || estado === 'rechazado';
  const timelineSteps = isCancelled ? [
    { label: 'Operación creada',    sub: formatDate(operation.fecha_creacion),                     done: true,  active: false, cancelled: false },
    { label: estado === 'rechazado' ? 'Rechazada por Qoricash' : 'Operación cancelada', sub: formatDate(operation.fecha_actualizacion) || 'Anulado', done: false, active: false, cancelled: true  },
  ] : [
    { label: 'Operación creada',        sub: formatDate(operation.fecha_creacion),                                                                                                 done: true,                                                                  active: false,                                  cancelled: false },
    { label: 'Comprobante recibido',    sub: (!!operation.comprobante_url || estado === 'en_proceso' || estado === 'completado') ? 'Verificado' : 'Pendiente de envío',            done: !!operation.comprobante_url || estado === 'en_proceso' || estado === 'completado', active: !operation.comprobante_url && estado === 'pendiente', cancelled: false },
    { label: 'En proceso',              sub: estado === 'en_proceso' || estado === 'completado' ? 'Procesando transferencia' : 'Pendiente',                                        done: estado === 'en_proceso' || estado === 'completado',                     active: estado === 'en_proceso',                cancelled: false },
    { label: 'Acreditado en tu cuenta', sub: estado === 'completado' ? formatDate(operation.fecha_actualizacion) : 'Pendiente',                                                    done: estado === 'completado',                                               active: false,                                  cancelled: false },
  ];

  const proofDocs = [
    ...(operation.comprobante_url ? [{ url: operation.comprobante_url, label: 'Comprobante de la operación', sub: 'Verificado por Qoricash' }] : []),
    ...(Array.isArray(operation.operator_proofs) ? operation.operator_proofs.filter(p => p.comprobante_url).map(p => ({ url: p.comprobante_url!, label: 'Comprobante de acreditación', sub: 'Qoricash transfirió a tu cuenta' })) : []),
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-20" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/dashboard/historial')}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: '#6B7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0D1117')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
          >
            <ArrowLeft className="w-4 h-4" />
            Mis operaciones
          </button>

          {/* Status badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
            style={{ background: sc.badgeBg, color: sc.badgeColor, border: `1px solid ${sc.badgeBorder}` }}>
            <span className={`relative flex h-1.5 w-1.5 flex-shrink-0`}>
              {sc.pulsing && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: sc.dotColor }} />}
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: sc.dotColor }} />
            </span>
            {sc.label}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-3 pb-10">

        {/* ── HERO: Operación ID + Montos ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A0A', boxShadow: '0 8px 32px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Top info row */}
          <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                  style={{ background: operation.tipo === 'compra' ? 'rgba(34,197,94,0.2)' : 'rgba(37,99,235,0.2)', color: operation.tipo === 'compra' ? '#4ade80' : '#60a5fa', border: `1px solid ${operation.tipo === 'compra' ? 'rgba(34,197,94,0.3)' : 'rgba(37,99,235,0.3)'}` }}>
                  {operation.tipo === 'compra' ? 'Compra USD' : 'Venta USD'}
                </span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Código de operación</p>
              <p className="text-2xl font-black text-white tracking-wide leading-none">{operation.codigo_operacion ?? `#${operation.id}`}</p>
              <p className="text-[10px] mt-1.5 font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{formatDate(operation.fecha_creacion)}</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Amounts strip */}
          <div className="flex divide-x" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex-1 px-5 py-4">
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                {operation.tipo === 'compra' ? 'Tú pagas' : 'Tú entregas'}
              </p>
              <p className="text-xl font-black text-white tabular-nums">
                {operation.tipo === 'compra'
                  ? `$ ${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : `S/ ${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="px-4 py-4 flex flex-col items-center justify-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>T.C.</p>
              <p className="text-sm font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.65)' }}>{(operation.tipo_cambio ?? 0).toFixed(3)}</p>
            </div>
            <div className="flex-1 px-5 py-4 text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Tú recibes</p>
              <p className="text-xl font-black tabular-nums" style={{ color: '#60a5fa' }}>
                {operation.tipo === 'compra'
                  ? `S/ ${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                  : `$ ${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </p>
            </div>
          </div>

          {/* Bottom accent */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563EB, #60a5fa, #2563EB)' }} />
        </div>

        {/* ── TIMELINE ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <style>{`
            @keyframes tlPing   { 0% { transform: scale(1);   opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
            @keyframes tlSpin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes tlPulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
          `}</style>
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2563EB' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Estado de la operación</p>
          </div>
          <div className="px-5 py-5 space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                {/* Connector line */}
                {i < timelineSteps.length - 1 && (
                  <div className="absolute left-[13px] top-7 w-0.5" style={{ height: '32px', background: step.done ? '#2563EB' : 'rgba(0,0,0,0.08)' }} />
                )}
                {/* Dot */}
                <div className="flex-shrink-0 mt-0.5 z-10" style={{ position: 'relative', width: 28, height: 28 }}>
                  {/* Ping ring — solo en paso activo */}
                  {step.active && (
                    <>
                      <span style={{
                        position: 'absolute', inset: -4, borderRadius: '50%',
                        background: 'rgba(59,130,246,0.25)',
                        animation: 'tlPing 1.5s cubic-bezier(0,0,0.2,1) infinite',
                      }} />
                      <span style={{
                        position: 'absolute', inset: -2, borderRadius: '50%',
                        background: 'rgba(59,130,246,0.15)',
                        animation: 'tlPing 1.5s cubic-bezier(0,0,0.2,1) 0.4s infinite',
                      }} />
                    </>
                  )}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={
                      step.cancelled ? { background: '#EF4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' }
                      : step.done    ? { background: '#2563EB', boxShadow: '0 0 0 3px rgba(37,99,235,0.12)' }
                      : step.active  ? { background: '#3B82F6', boxShadow: '0 0 0 4px rgba(59,130,246,0.2)', animation: 'tlPulse 2s ease-in-out infinite' }
                      : { background: '#F1F5F9', border: '1.5px solid #E5E7EB' }
                    }>
                    {step.cancelled
                      ? <XCircle className="w-3.5 h-3.5 text-white" />
                      : step.done
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      : step.active
                      ? <RefreshCw className="w-3.5 h-3.5 text-white" style={{ animation: 'tlSpin 1.4s linear infinite' }} />
                      : <div className="w-2 h-2 rounded-full" style={{ background: '#CBD5E1' }} />}
                  </div>
                </div>
                {/* Text */}
                <div className="pb-6 flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight"
                    style={{ color: step.cancelled ? '#EF4444' : step.active ? '#2563EB' : step.done ? '#0D1117' : '#C4C9D4' }}>
                    {step.label}
                  </p>
                  <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#9CA3AF' }}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CUENTA QORICASH (solo pendiente) ── */}
        {estado === 'pendiente' && qcAccount && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>

            {/* Header dark */}
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: '#0A0A0A' }}>
              <img src="/vg.png" alt="Qoricash" className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FBBF24' }}>Transfiere aquí</span>
              </div>
            </div>

            {/* Data rows */}
            <div className="px-5 divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              {[
                { label: 'Banco',   value: qcAccount.banco,   copy: null },
                { label: 'Titular', value: qcAccount.titular, copy: null },
                { label: 'RUC',     value: qcAccount.ruc,     copy: 'ruc' },
              ].map(({ label, value, copy }) => (
                <div key={label} className="flex items-center justify-between py-3.5">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono" style={{ color: '#0D1117' }}>{value}</span>
                    {copy && (
                      <button onClick={() => copyToClipboard(value, copy)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-white transition"
                        style={{ background: copiedField === copy ? '#16a34a' : '#0A0A0A' }}>
                        {copiedField === copy ? <><CheckCircle2 className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* N° Cuenta */}
              {!qcAccount.useCCI && qcAccount.numero && (
                <div className="py-3.5">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: '#9CA3AF' }}>N° de Cuenta</p>
                  <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <span className="flex-1 text-base font-black tracking-wider select-all font-mono" style={{ color: '#0D1117' }}>{qcAccount.numero}</span>
                    <button onClick={() => copyToClipboard(qcAccount.numero, 'numero')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white transition flex-shrink-0"
                      style={{ background: copiedField === 'numero' ? '#16a34a' : '#0A0A0A', boxShadow: copiedField === 'numero' ? '0 2px 8px rgba(22,163,74,0.4)' : '0 2px 8px rgba(0,0,0,0.2)' }}>
                      {copiedField === 'numero' ? <><CheckCircle2 className="w-3.5 h-3.5" />Copiado</> : <><Copy className="w-3.5 h-3.5" />Copiar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* CCI */}
              <div className="py-3.5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: '#9CA3AF' }}>CCI</p>
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <span className="flex-1 text-base font-black tracking-wider select-all font-mono" style={{ color: '#0D1117' }}>{qcAccount.cci}</span>
                  <button onClick={() => copyToClipboard(qcAccount.cci, 'cci')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white transition flex-shrink-0"
                    style={{ background: copiedField === 'cci' ? '#16a34a' : '#0A0A0A', boxShadow: copiedField === 'cci' ? '0 2px 8px rgba(22,163,74,0.4)' : '0 2px 8px rgba(0,0,0,0.2)' }}>
                    {copiedField === 'cci' ? <><CheckCircle2 className="w-3.5 h-3.5" />Copiado</> : <><Copy className="w-3.5 h-3.5" />Copiar</>}
                  </button>
                </div>
              </div>

              {/* Monto exacto */}
              <div className="py-3.5">
                <div className="flex items-center justify-between px-4 py-3.5 rounded-xl" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#2563EB' }}>Monto exacto a transferir</p>
                    <p className="text-2xl font-black" style={{ color: '#1E40AF' }}>{transferAmount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PASOS A SEGUIR (solo pendiente) ── */}
        {estado === 'pendiente' && !operation.comprobante_url && (
          <div className="rounded-2xl px-5 py-4" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Cómo completar tu operación</p>
            <div className="space-y-2.5">
              {[
                { n: 1, text: 'Copia el número de cuenta de Qoricash.' },
                { n: 2, text: 'Realiza la transferencia exacta desde tu banco.' },
                { n: 3, text: 'Adjunta tu comprobante abajo para notificarnos.' },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white mt-0.5" style={{ background: '#0A0A0A' }}>{n}</span>
                  <p className="text-xs leading-relaxed" style={{ color: '#4B5563' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESUMEN CUENTAS (solo pendiente) ── */}
        {estado === 'pendiente' && (operation.source_bank_name || operation.banco_cliente || operation.destination_bank_name) && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#2563EB' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Resumen de la operación</p>
            </div>
            <div className="p-4 flex items-stretch gap-2">
              {/* Transfieres desde */}
              <div className="flex-1 min-w-0 rounded-xl px-3 py-3" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Transfieres desde</p>
                {(() => {
                  const srcBank = operation.source_bank_name || operation.banco_cliente || '';
                  const srcAcc  = operation.source_account || '';
                  const srcLogo = getBankLogo(srcBank);
                  const amtSrc  = operation.tipo === 'compra'
                    ? `$ ${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : `S/ ${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        {srcLogo
                          ? <img src={srcLogo} alt={srcBank} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', padding: 3 }} />
                          : <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}><TrendingUp size={14} color="#94a3b8" /></div>
                        }
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold leading-tight truncate" style={{ color: '#0D1117' }}>{srcBank || '—'}</p>
                          {srcAcc && <p className="text-[10px] font-mono truncate" style={{ color: '#9CA3AF' }}>{srcAcc}</p>}
                        </div>
                      </div>
                      <p className="text-sm font-extrabold" style={{ color: '#0D1117' }}>{amtSrc}</p>
                    </>
                  );
                })()}
              </div>
              {/* Arrow */}
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
                  <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l5 4-5 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {/* Recibirás en */}
              <div className="flex-1 min-w-0 rounded-xl px-3 py-3" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.07)' }}>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Recibirás en</p>
                {(() => {
                  const dstBank = operation.destination_bank_name || '';
                  const dstAcc  = operation.destination_account || '';
                  const dstLogo = getBankLogo(dstBank);
                  const amtDst  = operation.tipo === 'compra'
                    ? `S/ ${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                    : `$ ${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        {dstLogo
                          ? <img src={dstLogo} alt={dstBank} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)', padding: 3 }} />
                          : <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}><TrendingDown size={14} color="#94a3b8" /></div>
                        }
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold leading-tight truncate" style={{ color: '#0D1117' }}>{dstBank || '—'}</p>
                          {dstAcc && <p className="text-[10px] font-mono truncate" style={{ color: '#9CA3AF' }}>{dstAcc}</p>}
                        </div>
                      </div>
                      <p className="text-sm font-extrabold" style={{ color: '#2563EB' }}>{amtDst}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── SUBIR COMPROBANTE (solo pendiente, sin comprobante aún) ── */}
        {estado === 'pendiente' && !operation.comprobante_url && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Upload className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Adjuntar comprobante</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                Ya realizaste la transferencia? Adjunta tu comprobante y te notificaremos cuando se acredite.
              </p>
              {/* Voucher code input */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#9CA3AF' }}>N° de operación bancaria</p>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={e => setVoucherCode(e.target.value)}
                  placeholder="Ej: 123456789"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ background: '#F8FAFC', border: '1.5px solid rgba(0,0,0,0.1)', color: '#0D1117' }}
                />
              </div>
              {/* File upload */}
              <label className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-sm font-black text-white cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ background: '#2563EB', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }}>
                {isUploading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Subiendo...</>
                  : <><Upload className="w-4 h-4" /> Ya transferí — adjuntar comprobante</>
                }
                <input type="file" className="hidden" accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={handleFileUpload} disabled={isUploading} />
              </label>
              <p className="text-[10px] text-center" style={{ color: '#9CA3AF' }}>JPG, PNG o PDF · máx 5 MB</p>
            </div>
          </div>
        )}

        {/* ── DOCUMENTOS (comprobantes + factura) ── */}
        {proofDocs.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Receipt className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Documentos</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              {proofDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <img src={doc.url} alt="doc" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(doc.url, '_blank')}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight" style={{ color: '#0D1117' }}>{doc.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{doc.sub}</p>
                  </div>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                    style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.09)', color: '#374151' }}>
                    <Download className="w-3.5 h-3.5" />
                    Ver
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOLETAS / FACTURAS ── */}
        {Array.isArray(operation.invoices) && operation.invoices.filter(inv => inv.nubefact_enlace_pdf).length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Comprobante electrónico</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: '#16a34a' }}>
                <BadgeCheck className="w-3.5 h-3.5" /> SUNAT
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              {operation.invoices.filter(inv => inv.nubefact_enlace_pdf).map((inv, idx) => (
                <div key={idx} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <FileText className="w-5 h-5" style={{ color: '#C4C9D4' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: '#0D1117' }}>{inv.invoice_number || (inv.invoice_type === '01' ? 'Factura' : 'Boleta')}</p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{inv.invoice_type === '01' ? 'Factura electrónica' : 'Boleta electrónica'}</p>
                  </div>
                  <a href={inv.nubefact_enlace_pdf!} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                    style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.09)', color: '#374151' }}>
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NOTAS ── */}
        {operation.notas && (
          <div className="rounded-2xl px-5 py-4" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Notas del operador</p>
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{operation.notas}</p>
          </div>
        )}

        {/* ── ERROR inline ── */}
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ── CANCELAR (solo pendiente) ── */}
        {estado === 'pendiente' && (
          <button onClick={() => setIsCancelModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold transition-all"
            style={{ color: '#EF4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
          >
            <XCircle className="w-4 h-4" />
            Cancelar operación
          </button>
        )}

      </main>

      {/* ── Toast: subida exitosa ── */}
      {uploadSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-2xl" style={{ background: '#16a34a' }}>
          <CheckCircle2 className="w-4 h-4" /> Comprobante subido
        </div>
      )}

      {/* ── Modal: Cancelar ── */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <p className="text-base font-black" style={{ color: '#0D1117' }}>Cancelar operación</p>
              <button onClick={() => { setIsCancelModalOpen(false); setCancelReason(''); }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition"
                style={{ background: '#F1F5F9' }}>
                <XCircle className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
            </div>
            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6B7280' }}>Esta acción es irreversible. Indica el motivo para continuar.</p>
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Motivo de cancelación..."
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
                style={{ background: '#F8FAFC', border: '1.5px solid rgba(0,0,0,0.1)', color: '#0D1117' }}
              />
            </div>
            {/* Footer */}
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={() => { setIsCancelModalOpen(false); setCancelReason(''); }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition"
                style={{ background: '#F1F5F9', color: '#6B7280' }}>
                Volver
              </button>
              <button onClick={handleCancelOperation} disabled={!cancelReason.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-30 flex items-center justify-center gap-2"
                style={{ background: '#EF4444' }}>
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Celebration: Completada ── */}
      {showCompletedCelebration && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
          <div className="rounded-3xl w-full max-w-sm p-8 text-center" style={{ background: '#ffffff', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            {/* Ring */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: '#DBEAFE' }} />
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#2563EB', boxShadow: '0 0 40px rgba(37,99,235,0.5)' }}>
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#2563EB' }}>Acreditado</p>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#0D1117' }}>¡Listo!</h2>
            <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Tu operación fue completada exitosamente.</p>
            <p className="text-xs mb-6" style={{ color: '#9CA3AF' }}>El dinero ya fue acreditado en tu cuenta.</p>
            <div className="rounded-2xl px-6 py-4 mb-6" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
              <p className="text-2xl font-black font-mono" style={{ color: '#1E40AF' }}>
                {operation?.tipo === 'compra'
                  ? `S/ ${(operation?.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                  : `$ ${(operation?.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </p>
              <p className="text-xs mt-1" style={{ color: '#2563EB' }}>recibido en tu cuenta</p>
            </div>
            <button onClick={() => setShowCompletedCelebration(false)}
              className="w-full py-4 rounded-2xl text-white font-black text-sm transition-all"
              style={{ background: '#2563EB', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }}>
              Ver detalle
            </button>
          </div>
        </div>
      )}

      {/* ── Overlay: Procesando cancelación ── */}
      {showCancelProcessing && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="text-center px-6">
            {!showCancelSuccess ? (
              <>
                <div className="w-12 h-12 rounded-full border-2 border-t-red-500 animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(239,68,68,0.2)', borderTopColor: '#EF4444' }} />
                <p className="text-white font-semibold">Cancelando operación...</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <XCircle className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-white font-bold text-lg mb-1">Operación cancelada</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Redirigiendo...</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
