'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, CreditCard, CheckCircle, AlertCircle, Key } from 'lucide-react';

const forgotPasswordSchema = z.object({
  dni: z.string()
    .min(1, 'Ingresa tu número de documento')
    .regex(/^\d+$/, 'Solo números')
    .refine((val) => [8, 9, 11].includes(val.length), {
      message: 'Debe ser DNI (8), CE (9) o RUC (11) dígitos'
    }),
  email: z.string().email('Ingresa un correo electrónico válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ForgotPasswordFormData) => Promise<{ success: boolean; message: string; error_code?: string }>;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const dni = watch('dni');

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    setErrorCode(null);
    try {
      const result = await onSubmit(data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => { handleClose(); }, 3000);
      } else {
        setError(result.message || 'Error al recuperar contraseña');
        setErrorCode(result.error_code || null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al recuperar contraseña');
      setErrorCode(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setErrorCode(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="animate-modal-backdrop fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="animate-modal-enter rounded-2xl w-full max-w-md overflow-hidden"
        style={{
          background: '#ffffff',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ background: '#000000', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Key className="w-[18px] h-[18px]" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight tracking-tight">Recuperar Contraseña</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Recibirás una contraseña temporal en tu correo
              </p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isSubmitting}
            className="relative p-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6" style={{ background: '#F5F7FA' }}>
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <CheckCircle className="w-9 h-9 text-primary-400" />
              </div>
              <h4 className="text-lg font-extrabold text-white mb-2">¡Contraseña enviada!</h4>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Hemos enviado una contraseña temporal a tu correo electrónico.
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
            </div>
          ) : (
            <>
              {error && errorCode === 'dni_not_found' && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
                  style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FFEDD5' }}>
                    <AlertCircle className="w-4 h-4" style={{ color: '#EA580C' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: '#C2410C' }}>Número de documento no encontrado</p>
                    <p className="text-xs" style={{ color: '#9A3412' }}>{error}</p>
                  </div>
                </div>
              )}
              {error && errorCode === 'email_mismatch' && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FEE2E2' }}>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-600 mb-0.5">Correo no asociado</p>
                    <p className="text-xs text-red-500">{error}</p>
                  </div>
                </div>
              )}
              {error && !errorCode && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FEE2E2' }}>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-600 mb-0.5">Error</p>
                    <p className="text-xs text-red-500">{error}</p>
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B7280' }}>
                Ingresa tus datos para recibir una contraseña temporal en tu correo electrónico.
              </p>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* DNI */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: '#374151' }}>
                    Número de Documento
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94A3B8' }} />
                    <input
                      type="text"
                      inputMode="numeric"
                      {...register('dni')}
                      placeholder=""
                      maxLength={11}
                      onKeyDown={e => { if (!/[\d\b]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }}
                      className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-all placeholder:font-normal"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #E5E7EB',
                        color: '#0D1117',
                        boxShadow: 'none',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.border = '1px solid #0D1117';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.border = '1px solid #E5E7EB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {dni && (
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: '#9CA3AF' }}>
                      {dni.length} dígitos ingresados
                    </p>
                  )}
                  {errors.dni && (
                    <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.dni.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: '#374151' }}>
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#94A3B8' }} />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-all placeholder:font-normal"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #E5E7EB',
                        color: '#0D1117',
                        boxShadow: 'none',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.border = '1px solid #0D1117';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.border = '1px solid #E5E7EB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email.message}</p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>


        {/* Footer */}
        {!success && (
          <div className="flex gap-3 px-6 py-5" style={{ background: '#F5F7FA' }}>
            <button onClick={handleClose} disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
              style={{
                background: '#ffffff',
                border: '1px solid #E5E7EB',
                color: '#374151',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}>
              Cancelar
            </button>
            <button onClick={handleSubmit(handleFormSubmit)} disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 active:scale-[0.98]"
              style={{
                background: isSubmitting ? 'rgba(255,255,255,0.1)' : '#000000',
                boxShadow: 'none',
                border: 'none',
              }}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: 'white' }} />
                  Enviando...
                </span>
              ) : 'Recuperar Contraseña'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
