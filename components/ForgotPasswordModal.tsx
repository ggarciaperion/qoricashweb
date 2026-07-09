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
  onSubmit: (data: ForgotPasswordFormData) => Promise<{ success: boolean; message: string }>;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const result = await onSubmit(data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => { handleClose(); }, 3000);
      } else {
        setError(result.message || 'Error al recuperar contraseña');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al recuperar contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="animate-modal-backdrop fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="animate-modal-enter rounded-2xl w-full max-w-md overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(13,27,42,0.96) 0%, rgba(10,22,36,0.98) 100%)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.06) inset',
        }}>

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(13,27,42,0.9) 0%, rgba(20,45,75,0.85) 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {/* glow orbs */}
          <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: 'rgba(34,197,94,0.12)', filter: 'blur(28px)' }} />
          <div className="absolute -bottom-8 right-8 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'rgba(34,197,94,0.07)', filter: 'blur(24px)' }} />

          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <Key className="w-[18px] h-[18px] text-primary-400" />
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
        <div className="px-6 py-6">
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
              {error && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.14)' }}>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-400 mb-0.5">Error</p>
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Ingresa tus datos para recibir una contraseña temporal en tu correo electrónico.
              </p>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* DNI */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Número de Documento
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="text"
                      {...register('dni')}
                      placeholder="DNI (8), CE (9) o RUC (11) dígitos"
                      maxLength={11}
                      className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-all placeholder:font-normal"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'white',
                        boxShadow: 'none',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.border = '1px solid rgba(34,197,94,0.55)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                    />
                  </div>
                  {dni && (
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.28)' }}>
                      {dni.length} dígitos ingresados
                    </p>
                  )}
                  {errors.dni && (
                    <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.dni.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-all placeholder:font-normal"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'white',
                        boxShadow: 'none',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.border = '1px solid rgba(34,197,94,0.55)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.email.message}</p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Divider */}
        {!success && (
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />
        )}

        {/* Footer */}
        {!success && (
          <div className="flex gap-3 px-6 py-5">
            <button onClick={handleClose} disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.65)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
              Cancelar
            </button>
            <button onClick={handleSubmit(handleFormSubmit)} disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 active:scale-[0.98]"
              style={{
                background: isSubmitting ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(34,197,94,0.3)',
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
