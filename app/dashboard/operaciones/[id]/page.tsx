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

/* ─── DEMO DATA (ambiente de prueba) ─────────────────────────────────── */
const DEMO_OPS: Record<number, Operation & { _demoInvoice?: DemoInvoice }> = {
  9001: { id:9001, codigo_operacion:'QC-20260626-001', cliente_id:1, tipo:'compra',  monto_dolares:1000,  monto_soles:3748,   tipo_cambio:3.748, banco_cliente:'BCP',       cuenta_cliente:'191-2345678-0-91', estado:'pendiente',  comprobante_url:'https://placehold.co/800x600/e2e8f0/64748b?text=Voucher+BCP',   notas:'Operación demo — en espera de comprobante de transferencia.', fecha_creacion:new Date(Date.now()-5*60*1000).toISOString(),        fecha_actualizacion:new Date().toISOString(), origen:'web', source_bank_name:'BCP' },
  9002: { id:9002, codigo_operacion:'QC-20260624-017', cliente_id:1, tipo:'venta',   monto_dolares:500,   monto_soles:1873.5, tipo_cambio:3.747, banco_cliente:'INTERBANK',  cuenta_cliente:'200-1234567-890',  estado:'completado', comprobante_url:'https://placehold.co/800x600/e2e8f0/64748b?text=Voucher+Interbank', notas:'Transferencia verificada y procesada. Soles acreditados en cuenta del cliente.', fecha_creacion:new Date(Date.now()-2*24*3600*1000).toISOString(),   fecha_actualizacion:new Date().toISOString(), origen:'web', source_bank_name:'INTERBANK', _demoInvoice:{ serie:'B001', numero:'00000217', tipo:'Boleta de Venta', fecha:'24/06/2026', cliente:'García Perión, Gianpierre', doc:'DNI 12345678', subtotal:1873.50, igv:0, total:1873.50, moneda:'PEN', url:'https://placehold.co/900x1200/ffffff/1e293b?text=BOLETA+B001-00000217' } },
  9003: { id:9003, codigo_operacion:'QC-20260622-008', cliente_id:1, tipo:'compra',  monto_dolares:2500,  monto_soles:9370,   tipo_cambio:3.748, banco_cliente:'BBVA',       cuenta_cliente:'001-1023456-7890', estado:'completado', comprobante_url:'https://placehold.co/800x600/e2e8f0/64748b?text=Voucher+BBVA',     notas:'Compra de USD completada. Dólares acreditados en cuenta BCP del cliente.', fecha_creacion:new Date(Date.now()-4*24*3600*1000).toISOString(),   fecha_actualizacion:new Date().toISOString(), origen:'web', source_bank_name:'BBVA',      _demoInvoice:{ serie:'F001', numero:'00000089', tipo:'Factura Electrónica', fecha:'22/06/2026', cliente:'Empresa Demo S.A.C.', doc:'RUC 20612345678', subtotal:7940.68, igv:1429.32, total:9370.00, moneda:'PEN', url:'https://placehold.co/900x1200/ffffff/1e293b?text=FACTURA+F001-00000089' } },
  9004: { id:9004, codigo_operacion:'QC-20260619-003', cliente_id:1, tipo:'venta',   monto_dolares:300,   monto_soles:1121.1, tipo_cambio:3.737, banco_cliente:'BCP',        cuenta_cliente:'191-2345678-0-91', estado:'completado', comprobante_url:'https://placehold.co/800x600/e2e8f0/64748b?text=Voucher+BCP',   notas:'Venta de USD procesada correctamente.', fecha_creacion:new Date(Date.now()-7*24*3600*1000).toISOString(),   fecha_actualizacion:new Date().toISOString(), origen:'web', source_bank_name:'BCP',       _demoInvoice:{ serie:'B001', numero:'00000198', tipo:'Boleta de Venta', fecha:'19/06/2026', cliente:'García Perión, Gianpierre', doc:'DNI 12345678', subtotal:1121.10, igv:0, total:1121.10, moneda:'PEN', url:'https://placehold.co/900x1200/ffffff/1e293b?text=BOLETA+B001-00000198' } },
  9005: { id:9005, codigo_operacion:'QC-20260615-011', cliente_id:1, tipo:'compra',  monto_dolares:750,   monto_soles:2808,   tipo_cambio:3.744, banco_cliente:'SCOTIABANK', cuenta_cliente:'030-1234567',      estado:'cancelado',  notas:'Operación cancelada por el cliente: no pudo completar la transferencia a tiempo.', fecha_creacion:new Date(Date.now()-11*24*3600*1000).toISOString(), fecha_actualizacion:new Date().toISOString(), origen:'web', source_bank_name:'SCOTIABANK' },
};

interface DemoInvoice {
  serie: string; numero: string; tipo: string; fecha: string;
  cliente: string; doc: string; subtotal: number; igv: number;
  total: number; moneda: string; url: string;
}

export default function OperacionDetallesPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { lastEvent } = useOperationEventStore();

  const [operation, setOperation] = useState<Operation | null>(null);
  const [demoInvoice, setDemoInvoice] = useState<DemoInvoice | null>(null);
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
        // Fallback a datos demo en ambiente de prueba
        const demo = DEMO_OPS[operationId];
        if (demo) {
          const { _demoInvoice, ...op } = demo;
          setOperation(op as Operation);
          if (_demoInvoice) setDemoInvoice(_demoInvoice);
        } else {
          setError(response.message || 'Operación no encontrada');
        }
      }
    } catch (error: any) {
      // Fallback a datos demo en ambiente de prueba
      const demo = operationId ? DEMO_OPS[operationId] : null;
      if (demo) {
        const { _demoInvoice, ...op } = demo;
        setOperation(op as Operation);
        if (_demoInvoice) setDemoInvoice(_demoInvoice);
      } else {
        console.error('Error loading operation:', error);
        setError(error.response?.data?.message || 'Error al cargar la operación');
      }
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

  const getDestinationAccount = () => {
    if (!operation) return null;
    const bankRaw = operation.source_bank_name || operation.banco_cliente || '';
    const clientBank = normalizeBankName(bankRaw);
    // compra = client sends USD to QoriCash; venta = client sends S/ to QoriCash
    const currency = operation.tipo === 'compra' ? '$' : 'S/';
    return getQoricashAccount(clientBank, currency);
  };

  const formatDate = (dateString: string | null | undefined) => {
    return formatSafeDate(dateString);
  };

  const estado = operation?.estado ?? 'pendiente';

  const STATUS_CFG: Record<string, { label: string; dot: string; text: string; border: string; bg: string }> = {
    pendiente:   { label: 'Esperando transferencia', dot: 'bg-amber-400 animate-pulse',  text: 'text-amber-400',  border: 'border-amber-500/30',  bg: 'bg-amber-500/10'  },
    en_proceso:  { label: 'En procesamiento',         dot: 'bg-blue-400 animate-pulse',   text: 'text-blue-400',   border: 'border-blue-500/30',   bg: 'bg-blue-500/10'   },
    completado:  { label: 'Completado',               dot: 'bg-primary-400',              text: 'text-primary-400',border: 'border-primary-500/30',bg: 'bg-primary-500/10'},
    cancelado:   { label: 'Cancelado',                dot: 'bg-slate-500',                text: 'text-slate-400',  border: 'border-slate-500/20',  bg: 'bg-slate-500/10'  },
    rechazado:   { label: 'Rechazado',                dot: 'bg-red-500',                  text: 'text-red-400',    border: 'border-red-500/30',    bg: 'bg-red-500/10'    },
  };
  const sc = STATUS_CFG[estado] ?? STATUS_CFG.pendiente;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-2 border-primary-500/20 border-t-primary-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Cargando operación...</p>
        </div>
      </div>
    );
  }

  if (error && !operation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-gray-900 font-semibold mb-1">Error</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button onClick={() => router.push('/dashboard')} className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition text-sm">
            Volver al Dashboard
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

  const timelineSteps = [
    { label: 'Operación creada',       sub: formatDate(operation.fecha_creacion),                              done: true,  active: false },
    { label: 'Comprobante recibido',   sub: operation.comprobante_url ? 'Archivo adjunto' : 'Pendiente',       done: !!operation.comprobante_url, active: !operation.comprobante_url && estado === 'pendiente' },
    { label: 'En procesamiento',       sub: estado === 'en_proceso' || estado === 'completado' ? 'En curso' : 'Pendiente', done: estado === 'en_proceso' || estado === 'completado', active: estado === 'en_proceso' },
    { label: 'Acreditado en tu cuenta',sub: estado === 'completado' ? formatDate(operation.fecha_actualizacion) : 'Pendiente', done: estado === 'completado', active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 h-13 flex items-center justify-between py-3">
          <button onClick={() => router.push('/dashboard/historial')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Mis operaciones
          </button>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${sc.bg} ${sc.border} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-5 space-y-3">

        {/* ── HERO CARD: Trade identity ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)' }}>

          {/* Accent bar top */}
          <div className="h-0.5 w-full" style={{ background: operation.tipo === 'compra' ? 'linear-gradient(90deg, #16A34A, #22C55E)' : 'linear-gradient(90deg, #1D4ED8, #3B82F6)' }} />

          {/* Card body */}
          <div className="px-4 py-3">

            {/* Fila 1: tipo + estado */}
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none" style={{ color: operation.tipo === 'compra' ? '#16A34A' : '#1D4ED8' }}>
                  {operation.tipo === 'compra' ? 'QoriCash Compra' : 'QoriCash Vende'}
                </p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: '#CBD5E1' }}>
                  {operation.codigo_operacion ?? `#${operation.id}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-semibold ${sc.bg} ${sc.border} ${sc.text}`}>
                  <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                  {sc.label}
                </div>
                <p className="text-[9px]" style={{ color: '#CBD5E1' }}>{formatDate(operation.fecha_creacion)}</p>
              </div>
            </div>

            {/* Fila 2: montos */}
            <div className="flex items-center" style={{ gap: 0 }}>
              {/* Entregas */}
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <p className="text-[9px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: '#94A3B8' }}>Entregas</p>
                <p className="text-lg font-bold tabular-nums leading-none" style={{ color: '#0F172A', letterSpacing: '-0.02em' }}>
                  {operation.tipo === 'compra'
                    ? `$${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : `S/${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                </p>
              </div>

              {/* TC centrado con márgenes fijos */}
              <div className="shrink-0 mx-3 rounded-md px-2.5 py-1 text-center" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>TC</p>
                <p className="text-xs font-bold tabular-nums" style={{ color: '#475569' }}>
                  {(operation.tipo_cambio ?? 0).toFixed(3)}
                </p>
              </div>

              {/* Recibes */}
              <div style={{ flex: '1 1 0', minWidth: 0, textAlign: 'right' }}>
                <p className="text-[9px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: '#94A3B8' }}>Recibes</p>
                <p className="text-lg font-bold tabular-nums leading-none" style={{ color: operation.tipo === 'compra' ? '#16A34A' : '#1D4ED8', letterSpacing: '-0.02em' }}>
                  {operation.tipo === 'compra'
                    ? `S/${(operation.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                    : `$${(operation.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── TRANSFER TO QORICASH ── */}
        {estado === 'pendiente' && qcAccount && (
          <div className="rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-700 text-[10px] font-bold uppercase tracking-widest">Acción requerida · Transfiere aquí</span>
            </div>
            <div className="bg-white divide-y divide-gray-100">
              {[
                { label: 'Banco',    value: qcAccount.banco,   mono: false },
                { label: 'Tipo',     value: qcAccount.tipo.replace('Cuenta Corriente ', 'Cta. Cte. '), mono: false },
                { label: 'Titular',  value: qcAccount.titular, mono: false },
                { label: 'RUC',      value: qcAccount.ruc,     mono: true  },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-gray-400 text-xs">{label}</span>
                  <span className={`text-gray-900 text-sm font-semibold ${mono ? 'font-mono' : ''}`}>{value}</span>
                </div>
              ))}
              {!qcAccount.useCCI && qcAccount.numero && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-gray-400 text-xs">N° Cuenta</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-sm font-mono">{qcAccount.numero}</span>
                    <button onClick={() => copyToClipboard(qcAccount.numero, 'numero')} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${copiedField === 'numero' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}>
                      {copiedField === 'numero' ? <><CheckCircle2 className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-gray-400 text-xs">CCI</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 text-sm font-mono">{qcAccount.cci}</span>
                  <button onClick={() => copyToClipboard(qcAccount.cci, 'cci')} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition ${copiedField === 'cci' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}>
                    {copiedField === 'cci' ? <><CheckCircle2 className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                  </button>
                </div>
              </div>
              {/* Exact amount — highlighted */}
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
                <span className="text-amber-700 text-xs font-bold uppercase tracking-wider">Monto exacto</span>
                <span className="text-amber-700 text-base font-bold font-mono">{transferAmount}</span>
              </div>
            </div>
          </div>
        )}



        {/* ── TIMELINE ── */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-4">Estado de la operación</p>
          <div className="space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                {/* Connector line */}
                {i < timelineSteps.length - 1 && (
                  <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${step.done ? 'bg-primary-300' : 'bg-gray-200'}`} style={{ height: '32px' }} />
                )}
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10 transition-all ${
                  step.done   ? 'bg-primary-500 shadow-md shadow-primary-200'
                  : step.active ? 'bg-blue-500 ring-2 ring-blue-200'
                  : 'bg-gray-100 border border-gray-200'
                }`}>
                  {step.done
                    ? <CheckCircle2 className="w-3 h-3 text-white" />
                    : step.active
                    ? <RefreshCw className="w-3 h-3 text-white animate-spin" />
                    : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                </div>
                <div className="pb-5 flex-1">
                  <p className={`text-sm font-semibold leading-tight ${step.done ? 'text-gray-900' : step.active ? 'text-blue-600' : 'text-gray-300'}`}>{step.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COMPROBANTE DE LA OPERACIÓN (sube el operador) ── */}
        {operation.comprobante_url && (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Comprobante de la operación</span>
              </div>
              <span className="text-[9px] text-gray-400">Emitido por QoriCash</span>
            </div>
            <div className="p-3 flex gap-3 items-start">
              {/* Miniatura */}
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img
                  src={operation.comprobante_url}
                  alt="Comprobante"
                  className="w-full h-full object-cover"
                  onError={e => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = 'none';
                    el.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>';
                  }}
                />
              </div>
              {/* Info + botón */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">Constancia de pago</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Transferencia realizada al cliente</p>
                </div>
                <a
                  href={operation.comprobante_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold transition self-start"
                >
                  <Download className="w-3 h-3" /> Ver / Descargar
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── BOLETA / FACTURA ELECTRÓNICA ── */}
        {demoInvoice && (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">{demoInvoice.tipo}</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-semibold text-primary-600">
                <BadgeCheck className="w-3 h-3" /> Emitida · Sunat
              </span>
            </div>
            <div className="p-3 flex gap-3 items-start">
              {/* Miniatura */}
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img
                  src={demoInvoice.url}
                  alt={demoInvoice.tipo}
                  className="w-full h-full object-cover"
                  onError={e => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = 'none';
                    el.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>';
                  }}
                />
              </div>
              {/* Info + botón */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{demoInvoice.serie}-{demoInvoice.numero}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{demoInvoice.fecha} · {demoInvoice.moneda === 'PEN' ? 'S/' : '$'} {demoInvoice.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[11px] text-gray-400">{demoInvoice.cliente}</p>
                </div>
                <a
                  href={demoInvoice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold transition self-start"
                >
                  <Download className="w-3 h-3" /> Ver / Descargar
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTES ── */}
        {operation.notas && (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Notas del operador</p>
            <p className="text-gray-700 text-sm leading-relaxed">{operation.notas}</p>
          </div>
        )}

        {/* ── CANCEL ACTION ── */}
        {estado === 'pendiente' && (
          <button onClick={() => setIsCancelModalOpen(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition text-sm font-semibold">
            <XCircle className="w-4 h-4" /> Cancelar operación
          </button>
        )}

        {/* Error inline */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

      </main>

      {/* ── Toast: Comprobante subido ── */}
      {uploadSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4" /> Comprobante subido exitosamente
        </div>
      )}

      {/* ── Modal: Cancelar ── */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-bold">Cancelar Operación</h3>
              <button onClick={() => { setIsCancelModalOpen(false); setCancelReason(''); }} className="text-gray-400 hover:text-gray-700 transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">Esta acción es irreversible. Describe el motivo para continuar.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Motivo de cancelación..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm resize-none focus:outline-none focus:border-red-400 placeholder-gray-300 mb-4"
              rows={3}
            />
            <div className="flex gap-3">
              <button onClick={() => { setIsCancelModalOpen(false); setCancelReason(''); }} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold transition">
                Volver
              </button>
              <button onClick={handleCancelOperation} disabled={!cancelReason.trim()} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Celebration: Operación Completada ── */}
      {showCompletedCelebration && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4"
             style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0.6) 100%)' }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-[scale-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Animated success ring */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-40" />
              <div className="relative w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-200">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Acreditado</p>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Listo!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-1">Tu operación fue completada exitosamente.</p>
            <p className="text-gray-400 text-xs mb-7">El dinero ya fue acreditado en tu cuenta.</p>
            <div className="bg-primary-50 rounded-2xl px-6 py-4 mb-6 border border-primary-100">
              <p className="text-primary-700 font-bold text-xl font-mono">
                {operation?.tipo === 'compra'
                  ? `S/ ${(operation?.monto_soles ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                  : `$ ${(operation?.monto_dolares ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </p>
              <p className="text-primary-500 text-xs mt-1">recibido</p>
            </div>
            <button
              onClick={() => setShowCompletedCelebration(false)}
              className="w-full py-3.5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition text-sm"
            >
              Ver detalle
            </button>
          </div>
        </div>
      )}

      {/* ── Overlay: Procesando cancelación ── */}
      {showCancelProcessing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="text-center px-6">
            {!showCancelSuccess ? (
              <>
                <div className="w-12 h-12 border-2 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-semibold">Cancelando operación...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-white font-bold text-lg mb-1">Operación cancelada</p>
                <p className="text-gray-300 text-sm">Redirigiendo...</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
