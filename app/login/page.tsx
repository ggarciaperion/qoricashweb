'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api/auth';
import Image from 'next/image';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import type { ForgotPasswordRequest } from '@/lib/types';


const loginSchema = z.object({
  dni: z.string().min(8, 'Mínimo 8 dígitos').max(11, 'Máximo 11 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginPhase, setLoginPhase] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const failedAttemptsRef = useRef(0);

  const animDoneRef     = useRef(false);
  const apiDoneRef      = useRef(false);
  const isErrorRef      = useRef(false);
  const transitionedRef = useRef(false);

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [pendingLoginDni, setPendingLoginDni] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ── Animation sync ──
  const _transitionFinal = () => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;

    if (isErrorRef.current) {
      const newCount = failedAttemptsRef.current + 1;
      failedAttemptsRef.current = newCount;
      setFailedAttempts(newCount);
      setLoginPhase('error');
      setTimeout(() => {
        setLoginPhase('idle');
        setIsLoading(false);
        isErrorRef.current      = false;
        animDoneRef.current     = false;
        apiDoneRef.current      = false;
        transitionedRef.current = false;
        if (newCount >= 3) setIsBlocked(true);
      }, 1800);
    } else {
      setLoginPhase('success');
      setTimeout(() => router.push('/dashboard'), 1200);
    }
  };

  const handleAnimEnd = () => {
    animDoneRef.current = true;
    if (apiDoneRef.current) _transitionFinal();
  };

  const handleApiDone = () => {
    apiDoneRef.current = true;
    if (animDoneRef.current) {
      _transitionFinal();
    } else {
      // Fallback: si onAnimationEnd no dispara, forzamos la transición tras la duración del arco
      setTimeout(_transitionFinal, 2700);
    }
  };

  const _triggerError = (msg: string) => {
    isErrorRef.current = true;
    setLoginError(msg);
    handleApiDone();
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isBlocked) return;
    setIsLoading(true);
    clearError();
    animDoneRef.current     = false;
    apiDoneRef.current      = false;
    isErrorRef.current      = false;
    transitionedRef.current = false;
    setLoginPhase('loading');

    try {
      const response = await authApi.login({ dni: data.dni, password: data.password });

      if (response.success && response.client) {
        if (response.requires_password_change) {
          setLoginPhase('idle');
          setIsLoading(false);
          setPendingLoginDni(data.dni);
          setIsChangePasswordModalOpen(true);
          return;
        }
        const success = await login({ dni: data.dni, password: data.password });
        if (success) {
          handleApiDone();
        } else {
          _triggerError('Credenciales incorrectas.');
        }
      } else {
        _triggerError(response.message || 'Credenciales incorrectas.');
      }
    } catch {
      _triggerError('Credenciales incorrectas.');
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      return await authApi.forgotPassword(data);
    } catch (e: any) {
      return { success: false, message: e.response?.data?.message || e.message || 'Error al recuperar contraseña' };
    }
  };

  const handleChangePassword = async (data: { currentPassword?: string; newPassword: string }) => {
    try {
      const result = await authApi.changePasswordWeb({ dni: pendingLoginDni, new_password: data.newPassword });
      if (result.success) {
        setIsChangePasswordModalOpen(false);
        const ok = await login({ dni: pendingLoginDni, password: data.newPassword });
        if (ok) router.push('/dashboard');
      }
      return result;
    } catch (e: any) {
      return { success: false, message: e.response?.data?.message || e.message || 'Error al cambiar contraseña' };
    }
  };

  return (
    <>
      <style>{`
        @keyframes qcProgress {
          from { stroke-dashoffset: 327; }
          to   { stroke-dashoffset: 0;   }
        }
        @keyframes qcPulse {
          0%,100% { transform: scale(1);    opacity: 1;   }
          50%      { transform: scale(0.92); opacity: 0.75; }
        }
        @keyframes qcScaleIn {
          0%   { transform: scale(0);    opacity: 0; }
          65%  { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes qcCheck {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes qcShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes qcFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes qcCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

      `}</style>

      <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>

        {/* Background blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 340, height: 340, borderRadius: '50%', background: 'rgba(34,197,94,0.10)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(30,41,59,0.08)', filter: 'blur(60px)' }} />
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 420, animation: 'qcCardIn 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>

          {/* Back link */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12, fontWeight: 500, textDecoration: 'none', marginBottom: 8 }}>
            <ArrowLeft size={14} />
            Volver al inicio
          </Link>

          {/* Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 8px 40px rgba(30,41,59,0.10), 0 2px 8px rgba(30,41,59,0.06)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            position: 'relative',
          }}>

            {/* ── Animation overlay ── */}
            {loginPhase !== 'idle' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: '#fff', borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>

                {/* Ring */}
                <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                    <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="7" />
                    {loginPhase === 'loading' && (
                      <circle
                        cx="64" cy="64" r="52"
                        fill="none" stroke="#22C55E" strokeWidth="7" strokeLinecap="round"
                        strokeDasharray="327" strokeDashoffset="327"
                        style={{ animation: 'qcProgress 2.6s cubic-bezier(0.4,0,0.6,1) forwards' }}
                        onAnimationEnd={handleAnimEnd}
                      />
                    )}
                    {loginPhase === 'success' && (
                      <circle cx="64" cy="64" r="52" fill="none" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" />
                    )}
                    {loginPhase === 'error' && (
                      <circle cx="64" cy="64" r="52" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" style={{ transition: 'stroke 0.3s ease' }} />
                    )}
                  </svg>

                  {/* Center */}
                  <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    {loginPhase === 'loading' ? (
                      <Image src="/logo-principal.png" alt="QoriCash" width={58} height={58} style={{ objectFit: 'contain', animation: 'qcPulse 1.8s ease-in-out infinite' }} />
                    ) : loginPhase === 'error' ? (
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
                          <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" style={{ animation: 'qcCheck 0.5s ease-out 0.15s forwards' }} />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text */}
                <div style={{ textAlign: 'center', animation: 'qcFadeUp 0.35s ease-out both', padding: '0 16px' }}>
                  {loginPhase === 'loading' ? (
                    <>
                      <p style={{
                        fontSize: 14, fontWeight: 700, margin: 0,
                        background: 'linear-gradient(90deg,#16A34A 0%,#22C55E 45%,#16A34A 90%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        animation: 'qcShimmer 1.8s linear infinite',
                      }}>
                        Verificando credenciales...
                      </p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Por favor espera</p>
                    </>
                  ) : loginPhase === 'error' ? (
                    <>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Acceso denegado</p>
                      <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontWeight: 600 }}>{loginError}</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>¡Bienvenido!</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Redirigiendo al dashboard...</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── Header strip ── */}
            <div style={{ background: '#1E293B', padding: '16px 32px 14px', textAlign: 'center' }}>
              <Image src="/logo-principal.png" alt="QoriCash" width={40} height={40} style={{ objectFit: 'contain', margin: '0 auto 8px' }} />
              <h1 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', margin: 0 }}>Iniciar sesión</h1>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '3px 0 0' }}>Accede a tu cuenta QoriCash</p>
            </div>

            {/* ── Form body ── */}
            <div style={{ padding: '16px 24px 20px' }}>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* DNI */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                    Número de Documento
                  </label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      {...register('dni')}
                      type="text"
                      inputMode="numeric"
                      placeholder="12345678"
                      maxLength={11}
                      disabled={isLoading || isBlocked}
                      onKeyDown={e => { if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }}
                      onPaste={e => { const t = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,11); e.preventDefault(); document.execCommand('insertText', false, t); }}
                      style={{
                        width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                        border: errors.dni ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                        borderRadius: 10, fontSize: 14, color: '#1E293B', outline: 'none',
                        background: errors.dni ? '#fef2f2' : '#fff', boxSizing: 'border-box',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => { if (!errors.dni) e.currentTarget.style.borderColor = '#22C55E'; }}
                      onBlur={e => { if (!errors.dni) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                  {errors.dni && <p style={{ margin: '5px 0 0', fontSize: 11, color: '#dc2626' }}>{errors.dni.message}</p>}
                </div>

                {/* Password */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      disabled={isLoading || isBlocked}
                      style={{
                        width: '100%', paddingLeft: 36, paddingRight: 42, paddingTop: 9, paddingBottom: 9,
                        border: errors.password ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                        borderRadius: 10, fontSize: 14, color: '#1E293B', outline: 'none',
                        background: errors.password ? '#fef2f2' : '#fff', boxSizing: 'border-box',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => { if (!errors.password) e.currentTarget.style.borderColor = '#22C55E'; }}
                      onBlur={e => { if (!errors.password) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      {showPassword
                        ? <EyeOff size={16} color="#94a3b8" />
                        : <Eye size={16} color="#94a3b8" />
                      }
                    </button>
                  </div>
                  {errors.password && <p style={{ margin: '5px 0 0', fontSize: 11, color: '#dc2626' }}>{errors.password.message}</p>}
                </div>

                {/* Row: remember + forgot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#64748b' }}>
                    <input type="checkbox" style={{ width: 15, height: 15, accentColor: '#1E293B', cursor: 'pointer' }} />
                    Recuérdame
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordModalOpen(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#22C55E', fontWeight: 600, padding: 0 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || isBlocked}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 11, border: 'none',
                    background: isBlocked ? '#94a3b8' : '#1E293B', color: '#fff', fontSize: 14, fontWeight: 700,
                    cursor: (isLoading || isBlocked) ? 'not-allowed' : 'pointer', opacity: (isLoading || isBlocked) ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isLoading && !isBlocked) e.currentTarget.style.background = '#334155'; }}
                  onMouseLeave={e => { if (!isLoading && !isBlocked) e.currentTarget.style.background = '#1E293B'; }}
                >
                  Iniciar Sesión
                </button>

                {/* Intentos / Bloqueado */}
                {isBlocked ? (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Cuenta bloqueada</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>
                      Usa <span style={{ color: '#22C55E', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsForgotPasswordModalOpen(true)}>¿Olvidaste tu contraseña?</span> para recuperar el acceso
                    </p>
                  </div>
                ) : failedAttempts > 0 ? (
                  <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#ef4444' }}>
                    Te quedan {3 - failedAttempts} intento{3 - failedAttempts !== 1 ? 's' : ''} disponible{3 - failedAttempts !== 1 ? 's' : ''}
                  </p>
                ) : null}
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>¿No tienes cuenta?</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* Register */}
              <Link
                href="/crear-cuenta"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', padding: '10px', borderRadius: 11,
                  border: '1.5px solid #1E293B', background: '#fff',
                  color: '#1E293B', fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          {/* Security note */}
          <p style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
            Tus datos están protegidos con encriptación de nivel bancario
          </p>
        </div>
      </main>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSubmit={handleForgotPassword}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onSubmit={handleChangePassword}
        canClose={false}
      />
    </>
  );
}
