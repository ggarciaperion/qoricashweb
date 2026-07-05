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
    <div className="animate-modal-backdrop fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="animate-modal-enter rounded-2xl w-full max-w-md overflow-hidden"
        style={{ background: 'transparent', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>

        {/* Header — dark gradient */}
        <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'rgba(34,197,94,0.10)', filter: 'blur(24px)' }} />
          <div className="absolute -bottom-6 right-10 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: 'rgba(34,197,94,0.06)', filter: 'blur(20px)' }} />

          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.18)' }}>
              <Key className="w-[18px] h-[18px] text-primary-400" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Recuperar Contraseña</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Recibirás una contraseña temporal en tu correo
              </p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isSubmitting}
            className="relative p-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-9 h-9 text-primary-600" />
              </div>
              <h4 className="text-lg font-extrabold text-white mb-2">¡Contraseña enviada!</h4>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Hemos enviado una contraseña temporal a tu correo electrónico.
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-700 mb-0.5">Error</p>
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Ingresa tus datos para recibir una contraseña temporal en tu correo electrónico.
              </p>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Numero de documento
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="text"
                      {...register('dni')}
                      placeholder="DNI (8), CE (9) o RUC (11) dígitos"
                      maxLength={11}
                      className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', boxShadow: 'none' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(34,197,94,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {dni && (
                    <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{dni.length} dígitos ingresados</p>
                  )}
                  {errors.dni && (
                    <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.dni.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-10 pr-4 py-3 text-sm font-semibold rounded-xl focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', boxShadow: 'none' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(34,197,94,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
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

        {/* Footer */}
        {!success && (
          <div className="flex gap-3 px-6 pb-6">
            <button onClick={handleClose} disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
              Cancelar
            </button>
            <button onClick={handleSubmit(handleFormSubmit)} disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 active:scale-[0.98]"
              style={{
                background: isSubmitting ? '#d1d5db' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(34,197,94,0.35)',
              }}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
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
