'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, AlertCircle, X } from 'lucide-react';

/* ── Validation schemas (same rules as crear-cuenta) ─────────── */
const pwdRules = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[a-zA-Z]/, 'Debe contener al menos 1 letra')
  .regex(/[0-9]/, 'Debe contener al menos 1 número')
  .regex(/[!@#$%^&*()\,\.?":;<>\-_\/+=]/, 'Debe contener al menos 1 carácter especial');

const mandatorySchema = z.object({
  new_password:     pwdRules,
  confirm_password: z.string().min(1, 'Confirma tu contraseña'),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'Las contraseñas no coinciden', path: ['confirm_password'],
});

const voluntarySchema = z.object({
  current_password: z.string().min(1, 'Ingresa tu contraseña actual'),
  new_password:     pwdRules,
  confirm_password: z.string().min(1, 'Confirma tu contraseña'),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'Las contraseñas no coinciden', path: ['confirm_password'],
});

type MandatoryData = z.infer<typeof mandatorySchema>;
type VoluntaryData  = z.infer<typeof voluntarySchema>;

interface Props {
  isOpen: boolean;
  onSubmit: (data: { currentPassword?: string; newPassword: string }) => Promise<{ success: boolean; message: string }>;
  onClose?: () => void;
  requireCurrentPassword?: boolean;
  canClose?: boolean;
}

export default function ChangePasswordModal({
  isOpen, onSubmit, onClose,
  requireCurrentPassword = false,
  canClose = false,
}: Props) {
  const [isSubmitting, setIsSubmitting]           = useState(false);
  const [success, setSuccess]                     = useState(false);
  const [error, setError]                         = useState<string | null>(null);
  const [showCurrent, setShowCurrent]             = useState(false);
  const [showNew, setShowNew]                     = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } =
    useForm<MandatoryData | VoluntaryData>({
      resolver: zodResolver(requireCurrentPassword ? voluntarySchema : mandatorySchema),
    });

  const pwd = watch('new_password') || '';

  useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
      setSuccess(false);
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [isOpen]);
  const strength = [
    { ok: pwd.length >= 8,                          label: '8+ caracteres' },
    { ok: /[a-zA-Z]/.test(pwd),                     label: 'Al menos 1 letra' },
    { ok: /[0-9]/.test(pwd),                        label: 'Al menos 1 número' },
    { ok: /[!@#$%^&*()\,\.?":;<>\-_\/+=]/.test(pwd), label: '1 carácter especial' },
  ];

  const handleFormSubmit = async (data: MandatoryData | VoluntaryData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({
        newPassword: data.new_password,
        ...(requireCurrentPassword && 'current_password' in data
          ? { currentPassword: data.current_password } : {}),
      });
      if (result.success) {
        setSuccess(true);
        if (requireCurrentPassword && onClose) {
          setTimeout(() => { onClose(); setSuccess(false); }, 2400);
        }
      } else {
        setError(result.message || 'Error al cambiar contraseña');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al cambiar contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(13,27,42,0.72)', backdropFilter: 'blur(3px)' }}
    >
      {/* keyframes */}
      <style>{`
        @keyframes cpScaleIn {
          0%   { transform: scale(0); opacity: 0; }
          65%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cpCheck {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes cpFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cpRingIn {
          from { stroke-dashoffset: 327; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <div
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.28)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── SUCCESS OVERLAY ──────────────────────────────── */}
        {success ? (
          <div className="flex flex-col items-center justify-center gap-6 py-10 px-6">
            {/* Ring + check */}
            <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="7" />
                <circle cx="64" cy="64" r="52" fill="none" stroke="#22C55E" strokeWidth="7"
                  strokeLinecap="round" strokeDasharray="327" strokeDashoffset="327"
                  style={{ animation: 'cpRingIn 0.6s cubic-bezier(0.4,0,0.2,1) forwards' }} />
              </svg>
              <div style={{ animation: 'cpScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.45s both' }}>
                <svg width="48" height="48" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="22" fill="#22C55E" />
                  <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="60" strokeDashoffset="60"
                    style={{ animation: 'cpCheck 0.45s ease-out 0.75s forwards' }} />
                </svg>
              </div>
            </div>
            {/* Text */}
            <div style={{ textAlign: 'center', animation: 'cpFadeUp 0.4s ease-out 0.5s both' }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>¡Contraseña cambiada!</p>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Tu contraseña fue actualizada con éxito</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── HEADER ──────────────────────────────────── */}
            <div
              className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}
            >
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
                style={{ background: 'rgba(34,197,94,0.10)', filter: 'blur(20px)' }} />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <Lock className="w-4 h-4 text-white/80" />
                </div>
                <div>
                  <p className="text-sm font-black text-white leading-tight">
                    {requireCurrentPassword ? 'Cambiar Contraseña' : 'Cambio Obligatorio'}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {requireCurrentPassword
                      ? 'Actualiza tu contraseña de forma segura'
                      : 'Debes establecer una nueva contraseña para continuar'}
                  </p>
                </div>
              </div>
              {canClose && onClose && (
                <button type="button" onClick={onClose}
                  className="relative p-1.5 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── BODY ─────────────────────────────────────── */}
            <div className="p-5 space-y-3">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
                  {error}
                </div>
              )}

              {!requireCurrentPassword && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium"
                  style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.22)', color: '#92400e' }}>
                  <Lock className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                  Estás usando una contraseña temporal. Debes cambiarla para continuar.
                </div>
              )}

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">

                {/* Contraseña actual */}
                {requireCurrentPassword && (
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: 'rgba(30,41,59,0.4)' }}>Contraseña actual</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        {...register('current_password' as any)}
                        placeholder="Tu contraseña actual"
                        className="w-full pr-9 pl-3 py-2 rounded-lg text-xs font-semibold outline-none transition"
                        style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.10)', color: '#1E293B' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#22C55E')}
                        onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(13,27,42,0.10)')}
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
                        style={{ color: 'rgba(30,41,59,0.35)' }}>
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.current_password && (
                      <p className="text-[10px] text-red-600 mt-1">{(errors as any).current_password.message}</p>
                    )}
                  </div>
                )}

                {/* Nueva contraseña */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'rgba(30,41,59,0.4)' }}>Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      {...register('new_password')}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pr-9 pl-3 py-2 rounded-lg text-xs font-semibold outline-none transition"
                      style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.10)', color: '#1E293B' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#22C55E')}
                      onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(13,27,42,0.10)')}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-100"
                      style={{ color: 'rgba(30,41,59,0.6)' }}>
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-[10px] text-red-600 mt-1">{errors.new_password.message}</p>
                  )}
                  {/* Strength indicators */}
                  {pwd && (
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
                      {strength.map(({ ok, label }) => (
                        <div key={label} className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ok ? 'bg-primary-500' : 'bg-gray-300'}`} />
                          <span className="text-[9px] font-semibold"
                            style={{ color: ok ? '#16a34a' : 'rgba(30,41,59,0.4)' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'rgba(30,41,59,0.4)' }}>Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      {...register('confirm_password')}
                      placeholder="Repite tu contraseña"
                      className="w-full pr-9 pl-3 py-2 rounded-lg text-xs font-semibold outline-none transition"
                      style={{ background: '#F8FAFC', border: '1px solid rgba(13,27,42,0.10)', color: '#1E293B' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#22C55E')}
                      onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(13,27,42,0.10)')}
                      onPaste={e => e.preventDefault()}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-100"
                      style={{ color: 'rgba(30,41,59,0.6)' }}>
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-[10px] text-red-600 mt-1">{errors.confirm_password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl text-xs font-black text-white transition disabled:opacity-50 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 4px 14px rgba(34,197,94,0.25)' }}
                >
                  {isSubmitting ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>

                {!canClose && (
                  <p className="text-[10px] text-center" style={{ color: 'rgba(30,41,59,0.35)' }}>
                    No podrás continuar sin cambiar tu contraseña
                  </p>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
