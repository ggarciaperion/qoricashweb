'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { banksApi } from '@/lib/api/banks';
import Image from 'next/image';
import {
  X,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  Building2,
} from 'lucide-react';

const BANK_LOGOS: Record<string, string> = {
  BCP: '/BCP.png',
  INTERBANK: '/Interbank.png',
  PICHINCHA: '/Banco Pichincha.png',
  BANBIF: '/BanBif.png',
  BBVA: '/BBVA.png',
  SCOTIABANK: '/Scotiabank.png',
};

const bankAccountSchema = z.object({
  bank_name: z.string().min(1, 'Selecciona un banco'),
  account_number: z.string().min(13, 'El número de cuenta debe tener al menos 13 dígitos').max(20, 'El número de cuenta debe tener máximo 20 dígitos'),
  account_type: z.enum(['Ahorro', 'Corriente'], { errorMap: () => ({ message: 'Selecciona un tipo de cuenta' }) }),
  currency: z.enum(['S/', '$'], { errorMap: () => ({ message: 'Selecciona una moneda' }) }),
  origen: z.enum(['Lima', 'Provincia'], { errorMap: () => ({ message: 'Selecciona el origen de la cuenta' }) }),
  ownership_confirmed: z.boolean().refine(val => val === true, {
    message: 'Debes confirmar que la cuenta es de tu titularidad'
  }),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dni: string;
  operationType?: 'Compra' | 'Venta';
  accountContext?: 'cargo' | 'destino';
}

export default function AddBankAccountModal({ isOpen, onClose, onSuccess, dni, operationType, accountContext }: AddBankAccountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // 'idle' | 'saving' | 'done' | 'limit'
  const [overlayPhase, setOverlayPhase] = useState<'idle' | 'saving' | 'done' | 'limit'>('idle');
  const apiDoneRef  = useRef(false);   // API call finished
  const animDoneRef = useRef(false);   // progress arc animation finished
  const isLimitRef  = useRef(false);   // limit error detected

  // Determinar la moneda predeterminada según el tipo de operación y contexto
  const getDefaultCurrency = (): 'S/' | '$' | '' => {
    if (!operationType || !accountContext) return '';

    if (operationType === 'Compra') {
      return accountContext === 'cargo' ? '$' : 'S/';
    } else {
      return accountContext === 'cargo' ? 'S/' : '$';
    }
  };

  const defaultCurrency = getDefaultCurrency();
  const isCurrencyReadOnly = !!operationType && !!accountContext;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      ownership_confirmed: false,
      currency: defaultCurrency,
    },
  });

  // Actualizar el valor de currency cuando cambian los props O cuando se abre el modal
  useEffect(() => {
    if (isOpen && operationType && accountContext) {
      let currency: 'S/' | '$' = 'S/';

      if (operationType === 'Compra') {
        currency = accountContext === 'cargo' ? '$' : 'S/';
      } else {
        currency = accountContext === 'cargo' ? 'S/' : '$';
      }

      setValue('currency', currency);
    }
  }, [isOpen, operationType, accountContext, setValue]);

  const selectedBank = watch('bank_name');
  const selectedCurrency = watch('currency');
  const accountNumber = watch('account_number');
  const selectedOrigen = watch('origen');

  const allBanksList = banksApi.getBanksList();

  // Filtrar bancos según origen seleccionado
  const banksList = selectedOrigen === 'Provincia'
    ? allBanksList.filter(bank => ['BCP', 'INTERBANK'].includes(bank.value))
    : allBanksList;

  const requiresCCI = selectedBank && ['BBVA', 'SCOTIABANK', 'OTROS'].includes(selectedBank);

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError(null);
      setSuccess(false);
      setOverlayPhase('idle');
      apiDoneRef.current  = false;
      animDoneRef.current = false;
      isLimitRef.current  = false;
      onClose();
    }
  };

  // Cierre forzado — no verifica isSubmitting (para auto-close del overlay)
  const _forceClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
    setOverlayPhase('idle');
    apiDoneRef.current  = false;
    animDoneRef.current = false;
    isLimitRef.current  = false;
    onClose();
  };

  // Transitions to the final phase once BOTH arc animation AND API are done
  const _transitionFinal = () => {
    if (isLimitRef.current) {
      setOverlayPhase('limit');
      setTimeout(_forceClose, 1500);
    } else {
      setOverlayPhase('done');
      setTimeout(() => { onSuccess(); _forceClose(); }, 2200);
    }
  };

  // Called when the SVG progress arc finishes its CSS animation
  const handleProgressAnimEnd = () => {
    animDoneRef.current = true;
    if (apiDoneRef.current) _transitionFinal();
  };

  // Called when API responds (success OR limit error)
  const handleApiDone = () => {
    apiDoneRef.current = true;
    if (animDoneRef.current) _transitionFinal();
  };

  const onSubmit = async (data: BankAccountFormData) => {
    setIsSubmitting(true);
    setError(null);
    apiDoneRef.current = false;
    animDoneRef.current = false;
    setOverlayPhase('saving');

    try {
      const response = await banksApi.addAccount({
        dni: dni,
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_type: data.account_type,
        currency: data.currency,
        origen: data.origen,
      });

      if (response.success) {
        setSuccess(true);
        handleApiDone();
      } else {
        const msg = response.message || '';
        const isLimit = /máximo|6 cuenta|límite|limite/i.test(msg);
        if (isLimit) {
          isLimitRef.current = true;
          handleApiDone();   // let arc finish, then show limit overlay
        } else {
          setError(msg || 'Error al agregar cuenta bancaria');
          setOverlayPhase('idle');
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || '';
      const isLimit = /máximo|6 cuenta|límite|limite/i.test(errMsg);
      if (isLimit) {
        isLimitRef.current = true;
        handleApiDone();   // let arc finish, then show limit overlay
      } else {
        setError(errMsg || 'Error al agregar cuenta bancaria');
        setOverlayPhase('idle');
      }
    } finally {
      // No resetear isSubmitting si estamos en fase limit/done — el overlay controla el cierre
      if (!isLimitRef.current) setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <style>{`
        @keyframes qcProgress {
          from { stroke-dashoffset: 327; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes qcFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qcScaleIn {
          0%   { transform: scale(0); opacity: 0; }
          65%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes qcCheck {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes qcShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes qcPulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(0.94); opacity: 0.8; }
        }
      `}</style>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[92vh] overflow-y-auto"
          style={overlayPhase !== 'idle' ? { height: 300, overflow: 'hidden' } : {}}
        >

          {/* Saving / Done overlay — r=52, circumference=2π×52≈327 */}
          {overlayPhase !== 'idle' && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, background: '#ffffff', borderRadius: 12 }}>

              {/* Ring + center */}
              <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  {/* Track */}
                  <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="7" />
                  {/* Green arc — animates on 'saving', fires onAnimationEnd */}
                  {overlayPhase === 'saving' && (
                    <circle
                      cx="64" cy="64" r="52"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray="327"
                      strokeDashoffset="327"
                      style={{ animation: 'qcProgress 2.8s cubic-bezier(0.4,0,0.6,1) forwards' }}
                      onAnimationEnd={handleProgressAnimEnd}
                    />
                  )}
                  {/* Full green ring on done */}
                  {overlayPhase === 'done' && (
                    <circle
                      cx="64" cy="64" r="52"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray="327"
                      strokeDashoffset="0"
                      style={{ transition: 'stroke 0.3s ease' }}
                    />
                  )}
                  {/* Full red ring on limit */}
                  {overlayPhase === 'limit' && (
                    <circle
                      cx="64" cy="64" r="52"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray="327"
                      strokeDashoffset="0"
                      style={{ transition: 'stroke 0.3s ease' }}
                    />
                  )}
                </svg>

                {/* Center circle */}
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
                  {overlayPhase === 'saving' ? (
                    <Image
                      src="/logo-principal.png"
                      alt="QoriCash"
                      width={64}
                      height={64}
                      style={{ objectFit: 'contain', animation: 'qcPulse 1.8s ease-in-out infinite' }}
                    />
                  ) : overlayPhase === 'limit' ? (
                    <div style={{ animation: 'qcScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <circle cx="22" cy="22" r="22" fill="#ef4444" />
                        <line x1="14" y1="14" x2="30" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="30" y1="14" x2="14" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  ) : (
                    <div style={{ animation: 'qcScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <circle cx="22" cy="22" r="22" fill="#16a34a" />
                        <polyline
                          points="11,23 18,30 33,14"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="60"
                          strokeDashoffset="60"
                          style={{ animation: 'qcCheck 0.5s ease-out 0.15s forwards' }}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Text */}
              {overlayPhase === 'saving' ? (
                <div style={{ textAlign: 'center', animation: 'qcFadeUp 0.35s ease-out both' }}>
                  <p style={{
                    fontSize: 14, fontWeight: 700, margin: 0,
                    background: 'linear-gradient(90deg,#16A34A 0%,#22C55E 45%,#16A34A 90%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'qcShimmer 1.8s linear infinite',
                  }}>
                    Guardando cuenta...
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Por favor espera</p>
                </div>
              ) : overlayPhase === 'limit' ? (
                <div style={{ textAlign: 'center', animation: 'qcFadeUp 0.4s ease-out both', padding: '0 16px' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Límite alcanzado</p>
                  <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontWeight: 600 }}>
                    Has alcanzado el máximo de 6 cuentas bancarias permitidas
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', animation: 'qcFadeUp 0.4s ease-out both' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>¡Cuenta guardada!</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Cerrando automáticamente...</p>
                </div>
              )}

            </div>
          )}

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-xl">
            <h2 className="text-base font-bold text-gray-900">Agregar Cuenta Bancaria</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {/* Success / error inline messages removed — handled by overlays */}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Origen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Origen <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer gap-1.5">
                    <input
                      {...register('origen')}
                      type="radio"
                      value="Lima"
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">Lima</span>
                  </label>
                  <label className="flex items-center cursor-pointer gap-1.5">
                    <input
                      {...register('origen')}
                      type="radio"
                      value="Provincia"
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">Provincia</span>
                  </label>
                </div>
                {errors.origen && (
                  <p className="mt-1 text-xs text-red-600">{errors.origen.message}</p>
                )}
                {selectedOrigen === 'Provincia' && (
                  <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>Solo disponible entre <strong>BCP</strong> e <strong>Interbank</strong>.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Banco
                </label>
                {!selectedOrigen ? (
                  <p className="text-xs text-gray-400 italic py-1">Primero selecciona el origen</p>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      {banksList.slice(0, 4).map((bank) => {
                        const logo = BANK_LOGOS[bank.value];
                        const isSelected = selectedBank === bank.value;
                        return (
                          <button
                            key={bank.value}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setValue('bank_name', bank.value, { shouldValidate: true })}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all"
                            style={isSelected
                              ? { borderColor: '#0369A1', background: 'rgba(3,105,161,0.06)' }
                              : { borderColor: '#e5e7eb', background: '#fff' }
                            }
                          >
                            {logo ? (
                              <Image src={logo} alt={bank.label} width={40} height={32} className="object-contain" style={{ maxHeight: '32px', width: 'auto' }} />
                            ) : (
                              <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                            <span className="text-[9px] font-semibold text-gray-600 leading-tight text-center">{bank.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-center gap-2">
                      {banksList.slice(4).map((bank) => {
                        const logo = BANK_LOGOS[bank.value];
                        const isSelected = selectedBank === bank.value;
                        return (
                          <button
                            key={bank.value}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setValue('bank_name', bank.value, { shouldValidate: true })}
                            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all"
                            style={{ width: 'calc(25% - 4px)', ...(isSelected
                              ? { borderColor: '#0369A1', background: 'rgba(3,105,161,0.06)' }
                              : { borderColor: '#e5e7eb', background: '#fff' })
                            }}
                          >
                            {logo ? (
                              <Image src={logo} alt={bank.label} width={40} height={32} className="object-contain" style={{ maxHeight: '32px', width: 'auto' }} />
                            ) : (
                              <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                            <span className="text-[9px] font-semibold text-gray-600 leading-tight text-center">{bank.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {errors.bank_name && (
                  <p className="mt-1 text-xs text-red-600">{errors.bank_name.message}</p>
                )}
              </div>

              {/* Account Type and Currency */}
              <div className="grid grid-cols-2 gap-3">
                {/* Account Type */}
                <div>
                  <label htmlFor="account_type" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tipo
                  </label>
                  <div className="relative">
                    <select
                      {...register('account_type')}
                      id="account_type"
                      className={`w-full appearance-none px-2.5 pr-7 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                        errors.account_type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">Selecciona</option>
                      <option value="Ahorro">Ahorro</option>
                      <option value="Corriente">Corriente</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.account_type && (
                    <p className="mt-1 text-xs text-red-600">{errors.account_type.message}</p>
                  )}
                </div>

                {/* Currency */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Moneda
                  </label>
                  {isCurrencyReadOnly ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      <span className="text-sm font-bold text-gray-700">{selectedCurrency}</span>
                      <span className="text-xs text-gray-500">{selectedCurrency === 'S/' ? 'Soles' : 'Dólares'}</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        {...register('currency')}
                        id="currency"
                        className={`w-full appearance-none px-2.5 pr-7 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                          errors.currency ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Selecciona</option>
                        <option value="S/">Soles (S/)</option>
                        <option value="$">Dólares ($)</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                  {errors.currency && (
                    <p className="mt-1 text-xs text-red-600">{errors.currency.message}</p>
                  )}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="account_number" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {requiresCCI ? 'CCI (Código Interbancario)' : 'Número de Cuenta'}
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    {...register('account_number')}
                    type="text"
                    id="account_number"
                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                      errors.account_number ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={requiresCCI ? '20 dígitos' : '13-20 dígitos'}
                    maxLength={20}
                    disabled={isSubmitting}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData('text');
                      if (!/^\d+$/.test(pastedText)) e.preventDefault();
                    }}
                  />
                </div>
                {requiresCCI && (
                  <p className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    {selectedBank} requiere CCI de 20 dígitos
                  </p>
                )}
                {errors.account_number && (
                  <p className="mt-1 text-xs text-red-600">{errors.account_number.message}</p>
                )}
                {accountNumber && accountNumber.length > 0 && (
                  <p className="mt-1 text-xs text-gray-400">{accountNumber.length} / 20</p>
                )}
              </div>

              {/* Ownership Confirmation */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <label className="flex items-start cursor-pointer gap-2.5">
                  <input
                    {...register('ownership_confirmed')}
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5 flex-shrink-0"
                    disabled={isSubmitting}
                  />
                  <span className="text-xs font-semibold text-gray-900">
                    Confirmo que esta cuenta es de mi titularidad
                  </span>
                </label>
                {errors.ownership_confirmed && (
                  <p className="mt-1 text-xs text-red-600 ml-6">{errors.ownership_confirmed.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm font-bold hover:bg-primary-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </div>
                  ) : success ? 'Guardado' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
