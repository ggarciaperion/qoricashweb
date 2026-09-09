'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, ArrowLeft, User, Building2, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api/auth';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import type { ForgotPasswordRequest } from '@/lib/types';

type ClientType = 'natural' | 'empresa';

const loginSchema = z.object({
  dni: z.string().min(1, 'Ingresa tu número de documento').max(11, 'Máximo 11 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from') || '/';
  const login = useAuthStore((s) => s.login);
  const clearError = useAuthStore((s) => s.clearError);

  const getInitialType = (): ClientType | null => {
    const tipo = searchParams.get('tipo');
    if (tipo === 'empresa') return 'empresa';
    if (tipo === 'natural') return 'natural';
    if (fromPage.startsWith('/empresa')) return 'empresa';
    return null;
  };

  const [clientType, setClientType] = useState<ClientType | null>(getInitialType);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginPhase, setLoginPhase] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const failedAttemptsRef = useRef(0);
  const animDoneRef = useRef(false);
  const apiDoneRef = useRef(false);
  const isErrorRef = useRef(false);
  const transitionedRef = useRef(false);
  const documentTypeRef = useRef<string>('DNI');
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [pendingLoginDni, setPendingLoginDni] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Al montar: carga el documento guardado si existe
  useEffect(() => {
    const saved = localStorage.getItem('qori_remember_doc');
    if (saved) {
      setRememberMe(true);
      reset({ dni: saved });
    }
  }, []);

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
        isErrorRef.current = false;
        animDoneRef.current = false;
        apiDoneRef.current = false;
        transitionedRef.current = false;
        if (newCount >= 3) setIsBlocked(true);
      }, 1800);
    } else {
      setLoginPhase('success');
      const isRuc = documentTypeRef.current === 'RUC';
      const destination = isRuc ? '/empresa' : (fromPage?.startsWith('/empresa') ? '/' : (fromPage || '/'));
      setTimeout(() => router.push(destination), 1200);
    }
  };

  const handleAnimEnd = () => {
    animDoneRef.current = true;
    if (apiDoneRef.current) _transitionFinal();
  };

  const handleApiDone = () => {
    apiDoneRef.current = true;
    if (animDoneRef.current) _transitionFinal();
    else setTimeout(_transitionFinal, 2700);
  };

  const _triggerError = (msg: string) => {
    isErrorRef.current = true;
    setLoginError(msg);
    handleApiDone();
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isBlocked) return;
    // Validación de longitud según tipo de cliente
    if (isEmpresa) {
      if (data.dni.length !== 11) {
        setError('dni', { message: 'El RUC debe tener exactamente 11 dígitos' });
        return;
      }
    } else {
      if (data.dni.length < 8 || data.dni.length > 9) {
        setError('dni', { message: 'DNI: 8 dígitos · CE: hasta 9 dígitos' });
        return;
      }
    }
    // Guardar o limpiar documento según "Recuérdame"
    if (rememberMe) {
      localStorage.setItem('qori_remember_doc', data.dni);
    } else {
      localStorage.removeItem('qori_remember_doc');
    }
    setIsLoading(true);
    clearError();
    animDoneRef.current = false;
    apiDoneRef.current = false;
    isErrorRef.current = false;
    transitionedRef.current = false;
    setLoginPhase('loading');
    try {
      const response = await authApi.login({ dni: data.dni, password: data.password });
      if (response.success && response.client) {
        documentTypeRef.current = response.client.document_type || 'DNI';
        if (response.requires_password_change) {
          setLoginPhase('idle');
          setIsLoading(false);
          setPendingLoginDni(data.dni);
          setIsChangePasswordModalOpen(true);
          return;
        }
        const success = await login({ dni: data.dni, password: data.password });
        if (success) handleApiDone();
        else _triggerError('Credenciales incorrectas.');
      } else {
        _triggerError(response.message || 'Credenciales incorrectas.');
      }
    } catch {
      _triggerError('Credenciales incorrectas.');
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try { return await authApi.forgotPassword(data); }
    catch (e: any) { return { success: false, message: e.response?.data?.message || e.message || 'Error' }; }
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
    } catch (e: any) { return { success: false, message: e.response?.data?.message || e.message || 'Error' }; }
  };

  const handleBackToSelector = () => {
    setClientType(null);
    reset();
    setLoginPhase('idle');
    setIsLoading(false);
    setLoginError('');
    setFailedAttempts(0);
    setIsBlocked(false);
    failedAttemptsRef.current = 0;
  };

  const SHARED_STYLES = `
    @keyframes ln-card-in  { from{opacity:0;transform:translateY(22px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes ln-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes ln-orbit     { to{transform:rotate(360deg)} }
    @keyframes ln-orbit-r   { to{transform:rotate(-360deg)} }
    @keyframes ln-pulse     { 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.07)} }
    @keyframes ln-ping      { 0%{transform:scale(1);opacity:0.45} 100%{transform:scale(2.4);opacity:0} }
    @keyframes ln-line      { 0%,100%{opacity:0.12} 50%{opacity:0.5} }
    @keyframes ln-node      { 0%,100%{opacity:0.65} 50%{opacity:1} }
    @keyframes ln-scan      { 0%{opacity:0;transform:translateY(0px)} 8%{opacity:0.35} 92%{opacity:0.35} 100%{opacity:0;transform:translateY(320px)} }
    @keyframes ln-shimmer   { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
    @keyframes ln-dot       { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
    @keyframes qcProgress   { from{stroke-dashoffset:327} to{stroke-dashoffset:0} }
    @keyframes qcPulse      { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(0.92);opacity:0.75} }
    @keyframes qcScaleIn    { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.18);opacity:1} 100%{transform:scale(1);opacity:1} }
    @keyframes qcCheck      { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
    @keyframes qcShimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes qcFadeUp     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

    .ln-two-col { display: grid; grid-template-columns: 1fr 1fr; }
    .ln-left-panel { display: flex; }
    @media (max-width: 680px) {
      .ln-two-col { grid-template-columns: 1fr !important; }
      .ln-left-panel { display: none !important; }
    }
    .ln-type-card {
      background: #ffffff;
      border: 1.5px solid rgba(0,0,0,0.08);
      border-radius: 20px;
      padding: 32px 20px;
      cursor: pointer;
      text-align: center;
      display: flex; flex-direction: column; align-items: center; gap: 14px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
      width: 100%;
    }
    .ln-type-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 36px rgba(0,0,0,0.1);
    }
    .ln-type-card.natural:hover { border-color: #2563EB; }
    .ln-type-card.empresa:hover { border-color: #0B1426; }
    .ln-submit-btn { transition: filter 0.15s, transform 0.1s; }
    .ln-submit-btn:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
    .ln-submit-btn:active:not(:disabled) { transform: translateY(0); }
  `;

  const BG = 'linear-gradient(160deg, #EFF6FF 0%, #ffffff 55%, #F8FAFC 100%)';

  /* ══════════════════════════════════════════════════
     STEP 1 — Selector de tipo
  ══════════════════════════════════════════════════ */
  if (clientType === null) {
    return (
      <>
        <style>{SHARED_STYLES}</style>
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: BG, position: 'relative', overflow: 'hidden' }}>

          {/* Dot grid — decorativo, solo desktop */}
          <div className="ln-bg-deco" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(37,99,235,0.055) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          {/* Glow — decorativo, solo desktop */}
          <div className="ln-bg-deco" style={{ position: 'absolute', top: -200, right: -150, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div className="ln-bg-deco" style={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Link href={fromPage} style={{ position: 'absolute', top: 24, left: 24, display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            Volver al inicio
          </Link>

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 540, animation: 'ln-card-in 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>

            <img src="/vg.png" alt="QoriCash" style={{ height: 44, width: 'auto', marginBottom: 32 }} />
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Iniciar sesión</h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 36px' }}>¿Cómo quieres acceder a tu cuenta?</p>

            <div className="ln-type-grid" style={{ display: 'grid' }}>

              {/* Persona Natural */}
              <button className="ln-type-card natural" onClick={() => setClientType('natural')}>
                <div style={{ width: 68, height: 68, borderRadius: 18, background: 'rgba(37,99,235,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', animation: 'ln-float 3.2s ease-in-out infinite' }}>
                  <User size={30} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 5 }}>Persona Natural</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>DNI · Carnet de Extranjería</div>
                </div>
                <div style={{ width: 28, height: 2, borderRadius: 2, background: '#2563EB', opacity: 0.4 }} />
              </button>

              {/* Empresa */}
              <button className="ln-type-card empresa" onClick={() => setClientType('empresa')}>
                <div style={{ width: 68, height: 68, borderRadius: 18, background: 'rgba(11,20,38,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B1426', animation: 'ln-float 3.2s ease-in-out 0.8s infinite' }}>
                  <Building2 size={30} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 5 }}>Empresa</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>Ficha RUC</div>
                </div>
                <div style={{ width: 28, height: 2, borderRadius: 2, background: '#0B1426', opacity: 0.3 }} />
              </button>
            </div>

            <p style={{ marginTop: 32, fontSize: 13, color: '#9CA3AF' }}>
              ¿No tienes cuenta?{' '}
              <Link href="/crear-cuenta" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Crear cuenta gratis</Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ══════════════════════════════════════════════════
     STEP 2 — Formulario dos columnas
  ══════════════════════════════════════════════════ */
  const isEmpresa = clientType === 'empresa';
  const docLabel = isEmpresa ? 'Número de RUC' : 'DNI / Carnet de Extranjería';
  const docMaxLength = isEmpresa ? 11 : 9;

  return (
    <>
      <style>{SHARED_STYLES}</style>

      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: BG, position: 'relative', overflow: 'hidden' }}>

        {/* Bg decorations */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(37,99,235,0.055) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -200, right: -150, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Back */}
        <button onClick={handleBackToSelector} style={{ position: 'absolute', top: 24, left: 24, display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={14} />
          Cambiar tipo
        </button>

        <div className="ln-two-col" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 860, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', animation: 'ln-card-in 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>

          {/* ── PANEL IZQUIERDO — Animación ── */}
          <div className="ln-left-panel" style={{ padding: '44px 36px', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', minHeight: 540 }}>

            {/* Glow top-right */}
            <div style={{ position: 'absolute', top: -100, right: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '2px', background: 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.3) 50%, transparent 100%)', animation: 'ln-scan 5s ease-in-out infinite', pointerEvents: 'none' }} />

            {/* Top: logo + badge */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
              <img src="/vg.png" alt="QoriCash" style={{ height: 32, width: 'auto', marginBottom: 14 }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 20, background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', display: 'inline-block', animation: 'ln-dot 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2563EB' }}>Acceso Seguro</span>
              </div>
            </div>

            {/* Centro: SVG animado */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <svg width="230" height="230" viewBox="0 0 230 230" fill="none">

                {/* Orbit exterior — gira */}
                <circle cx="115" cy="115" r="90" stroke="rgba(37,99,235,0.12)" strokeWidth="1" fill="none" strokeDasharray="5 7"
                  style={{ transformOrigin: '115px 115px', animation: 'ln-orbit 35s linear infinite' }} />

                {/* Anillo medio */}
                <circle cx="115" cy="115" r="68" stroke="rgba(37,99,235,0.08)" strokeWidth="0.8" fill="none" />

                {/* Líneas conectoras (centro → nodos) */}
                {/* Nodo 1 arriba: (115, 25) */}
                <line x1="115" y1="80" x2="115" y2="39" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" strokeDasharray="3 4"
                  style={{ animation: 'ln-line 2.8s ease-in-out infinite' }} />
                {/* Nodo 2 abajo-derecha: (193, 160) */}
                <line x1="174" y1="141" x2="187" y2="155" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" strokeDasharray="3 4"
                  style={{ animation: 'ln-line 2.8s ease-in-out 0.9s infinite' }} />
                {/* Nodo 3 abajo-izquierda: (37, 160) */}
                <line x1="56" y1="141" x2="43" y2="155" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" strokeDasharray="3 4"
                  style={{ animation: 'ln-line 2.8s ease-in-out 1.8s infinite' }} />

                {/* ── Centro: candado ── */}
                {/* Ping exterior */}
                <circle cx="115" cy="115" r="40" fill="none" stroke="rgba(37,99,235,0.18)" strokeWidth="1"
                  style={{ transformOrigin: '115px 115px', animation: 'ln-ping 2.8s ease-out infinite' }} />
                {/* Anillo exterior del candado */}
                <circle cx="115" cy="115" r="40" fill="rgba(37,99,235,0.1)" stroke="rgba(37,99,235,0.3)" strokeWidth="1" />
                {/* Anillo interior girando (dashed) */}
                <circle cx="115" cy="115" r="40" fill="none" stroke="rgba(37,99,235,0.1)" strokeWidth="1" strokeDasharray="3 5"
                  style={{ transformOrigin: '115px 115px', animation: 'ln-orbit-r 22s linear infinite' }} />
                {/* Círculo interior */}
                <circle cx="115" cy="115" r="26" fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.35)" strokeWidth="1" />

                {/* Asa del candado */}
                <path d="M106 111 L106 104 Q106 96 115 96 Q124 96 124 104 L124 111"
                  stroke="#2563EB" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* Cuerpo del candado */}
                <rect x="104" y="110" width="22" height="16" rx="3.5" fill="#1D4ED8" />
                {/* Ojo de la cerradura */}
                <circle cx="115" cy="117" r="3.2" fill="rgba(255,255,255,0.85)" />
                <rect x="113.7" y="118.5" width="2.6" height="4.5" rx="1" fill="rgba(255,255,255,0.85)" />

                {/* ── NODO 1 — Arriba: llave ── */}
                <circle cx="115" cy="25" r="14" fill="rgba(37,99,235,0.14)" stroke="rgba(37,99,235,0.38)" strokeWidth="1"
                  style={{ animation: 'ln-node 2.2s ease-in-out infinite' }} />
                {/* Llave */}
                <circle cx="111" cy="24" r="4.5" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                <line x1="115" y1="24" x2="124" y2="24" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="122" y1="24" x2="122" y2="27" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="119" y1="24" x2="119" y2="26.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />

                {/* ── NODO 2 — Abajo-derecha: check verificado ── */}
                <circle cx="193" cy="160" r="13" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.38)" strokeWidth="1"
                  style={{ animation: 'ln-node 2.2s ease-in-out 0.7s infinite' }} />
                {/* Check */}
                <polyline points="186,160 190,164 200,154" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                {/* ── NODO 3 — Abajo-izquierda: usuario ── */}
                <circle cx="37" cy="160" r="13" fill="rgba(37,99,235,0.12)" stroke="rgba(37,99,235,0.32)" strokeWidth="1"
                  style={{ animation: 'ln-node 2.2s ease-in-out 1.4s infinite' }} />
                {/* Icono persona */}
                <circle cx="37" cy="156" r="4" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                <path d="M29 170 Q29 163 37 163 Q45 163 45 170" stroke="#2563EB" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              </svg>
            </div>

            {/* Bottom: trust indicators */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { dot: '#2563EB', text: 'Encriptación de nivel bancario' },
                { dot: '#16A34A', text: 'Registrado y supervisado por SBS' },
                { dot: '#2563EB', text: 'Sesión protegida con timeout automático' },
              ].map(({ dot, text }, i) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, animation: `ln-shimmer ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PANEL DERECHO — Formulario ── */}
          <div style={{ background: '#ffffff', padding: '40px 36px', display: 'flex', flexDirection: 'column', position: 'relative' }}>

            {/* Overlay de animación de login */}
            {loginPhase !== 'idle' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
                <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                    <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="7" />
                    {loginPhase === 'loading' && (
                      <circle cx="64" cy="64" r="52" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round"
                        strokeDasharray="327" strokeDashoffset="327"
                        style={{ animation: 'qcProgress 2.6s cubic-bezier(0.4,0,0.6,1) forwards' }}
                        onAnimationEnd={handleAnimEnd} />
                    )}
                    {loginPhase === 'success' && <circle cx="64" cy="64" r="52" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" />}
                    {loginPhase === 'error'   && <circle cx="64" cy="64" r="52" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeDasharray="327" strokeDashoffset="0" style={{ transition: 'stroke 0.3s' }} />}
                  </svg>
                  <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#f9fafb', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    {loginPhase === 'loading' ? (
                      <img src="/vg.png" alt="Qoricash" style={{ width: 52, height: 52, objectFit: 'contain', animation: 'qcPulse 1.8s ease-in-out infinite' }} />
                    ) : loginPhase === 'error' ? (
                      <div style={{ animation: 'qcScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                          <circle cx="22" cy="22" r="22" fill="rgba(239,68,68,0.9)" />
                          <line x1="14" y1="14" x2="30" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                          <line x1="30" y1="14" x2="14" y2="30" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    ) : (
                      <div style={{ animation: 'qcScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                          <circle cx="22" cy="22" r="22" fill="#000" />
                          <polyline points="11,23 18,30 33,14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" style={{ animation: 'qcCheck 0.5s ease-out 0.15s forwards' }} />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'center', animation: 'qcFadeUp 0.35s ease-out both', padding: '0 16px' }}>
                  {loginPhase === 'loading' ? (
                    <>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: 0, background: 'linear-gradient(90deg, #9ca3af 0%, #000 45%, #9ca3af 90%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'qcShimmer 1.8s linear infinite' }}>
                        Verificando credenciales...
                      </p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Por favor espera</p>
                    </>
                  ) : loginPhase === 'error' ? (
                    <>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#0D1117', margin: 0 }}>Acceso denegado</p>
                      <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontWeight: 600 }}>{loginError}</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#0D1117', margin: 0 }}>¡Bienvenido!</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Redirigiendo al dashboard...</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Header del formulario */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, marginBottom: 16, background: isEmpresa ? 'rgba(11,20,38,0.06)' : 'rgba(37,99,235,0.07)', border: `1px solid ${isEmpresa ? 'rgba(11,20,38,0.12)' : 'rgba(37,99,235,0.15)'}` }}>
                {isEmpresa
                  ? <Building2 size={13} color="#0B1426" />
                  : <User size={13} color="#2563EB" />
                }
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: isEmpresa ? '#0B1426' : '#2563EB' }}>
                  {isEmpresa ? 'Empresa' : 'Persona Natural'}
                </span>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Iniciar sesión</h1>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Accede a tu cuenta Qoricash</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

              {/* Campo documento */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {docLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    {...register('dni')}
                    type="text"
                    inputMode="numeric"
                    maxLength={docMaxLength}
                    autoComplete="off"
                    disabled={isLoading || isBlocked}
                    onKeyDown={e => { if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }}
                    onPaste={e => { const t = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,11); e.preventDefault(); document.execCommand('insertText', false, t); }}
                    style={{ width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: errors.dni ? '1px solid #fca5a5' : '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, color: '#1E293B', outline: 'none', background: errors.dni ? '#fef2f2' : '#ffffff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => { if (!errors.dni) e.currentTarget.style.borderColor = '#0D1117'; }}
                    onBlur={e => { if (!errors.dni) e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  />
                </div>
                {errors.dni && <p style={{ margin: '5px 0 0', fontSize: 11, color: '#dc2626' }}>{errors.dni.message}</p>}
              </div>

              {/* Contraseña */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    disabled={isLoading || isBlocked}
                    style={{ width: '100%', paddingLeft: 36, paddingRight: 42, paddingTop: 10, paddingBottom: 10, border: errors.password ? '1px solid #fca5a5' : '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, color: '#1E293B', outline: 'none', background: errors.password ? '#fef2f2' : '#ffffff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => { if (!errors.password) e.currentTarget.style.borderColor = '#0D1117'; }}
                    onBlur={e => { if (!errors.password) e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                  </button>
                </div>
                {errors.password && <p style={{ margin: '5px 0 0', fontSize: 11, color: '#dc2626' }}>{errors.password.message}</p>}
              </div>

              {/* Recuérdame + olvidé contraseña */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#1E293B', cursor: 'pointer' }} />
                  Recuérdame
                </label>
                <button type="button" onClick={() => setIsForgotPasswordModalOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#6B7280', fontWeight: 600, padding: 0 }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={isLoading || isBlocked}
                className="ln-submit-btn"
                style={{ width: '100%', padding: '12px', borderRadius: 11, border: 'none', background: isBlocked ? '#94a3b8' : (isEmpresa ? '#0B1426' : '#000000'), color: '#fff', fontSize: 14, fontWeight: 700, cursor: (isLoading || isBlocked) ? 'not-allowed' : 'pointer', opacity: (isLoading || isBlocked) ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                Iniciar Sesión
              </button>

              {/* Intentos / bloqueado */}
              {isBlocked ? (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Cuenta bloqueada</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>
                    Usa <span style={{ color: '#0D1117', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsForgotPasswordModalOpen(true)}>¿Olvidaste tu contraseña?</span> para recuperar el acceso
                  </p>
                </div>
              ) : failedAttempts > 0 ? (
                <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#ef4444' }}>
                  Te quedan {3 - failedAttempts} intento{3 - failedAttempts !== 1 ? 's' : ''} disponible{3 - failedAttempts !== 1 ? 's' : ''}
                </p>
              ) : null}

              <div style={{ flex: 1 }} />
            </form>

            {/* Footer */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>¿No tienes cuenta?</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>
              <Link href="/crear-cuenta"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '10px', borderRadius: 11, border: '1.5px solid #1E293B', background: '#fff', color: '#1E293B', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                Crear cuenta gratis
              </Link>
              <p style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#9CA3AF' }}>
                Tus datos están protegidos con encriptación de nivel bancario
              </p>
            </div>
          </div>

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
