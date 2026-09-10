'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, TrendingUp, TrendingDown, ArrowRight, Zap, CheckCircle, Mail, Smartphone, X } from 'lucide-react';

const EJEMPLOS = [
  { tipo: 'sobre', valor: '3.420', moneda: 'Venta', emoji: '📈', accion: 'subir a' },
  { tipo: 'bajo',  valor: '3.390', moneda: 'Compra', emoji: '📉', accion: 'bajar a' },
  { tipo: 'sobre', valor: '3.450', moneda: 'Venta', emoji: '🚀', accion: 'superar' },
  { tipo: 'bajo',  valor: '3.400', moneda: 'Venta', emoji: '⚡', accion: 'caer a' },
];

type ProspectoForm = { nombre: string; email: string; tipo: 'sobre' | 'bajo'; moneda: 'compra' | 'venta'; valor: string };

export default function AlertaTCBanner() {
  const [active, setActive] = useState(0);
  const [notifVisible, setNotifVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<ProspectoForm>({ nombre: '', email: '', tipo: 'sobre', moneda: 'venta', valor: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      setNotifVisible(false);
      setTimeout(() => {
        setActive((i) => (i + 1) % EJEMPLOS.length);
        setNotifVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  function openModal() {
    setForm({ nombre: '', email: '', tipo: 'sobre', moneda: 'venta', valor: '' });
    setDone(false);
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleProspecto(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(form.valor);
    if (!form.nombre.trim() || !form.email.trim()) { setFormError('Completa tu nombre y email.'); return; }
    if (!form.email.includes('@')) { setFormError('Ingresa un email válido.'); return; }
    if (!val || val < 1 || val > 10) { setFormError('Ingresa un TC válido (ej: 3.410).'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch('/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre.trim(), email: form.email.trim(), tipo: form.tipo, moneda: form.moneda, valor: val }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setFormError('Error al crear la alerta. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  const ej = EJEMPLOS[active];

  return (
    <>
    <section className="relative overflow-hidden">

      {/* Glow sutil institucional */}
      <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[100px] pointer-events-none" />


      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-5 sm:py-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>

        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* ── Texto ── */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3" style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-white text-xs font-bold tracking-[0.15em] uppercase">Alertas de Tipo de Cambio</span>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-[1.1] mb-2 sm:mb-3">
              <span style={{ color: '#000000' }}>Te avisamos cuando el</span> <span style={{ color: '#2563EB' }}>dólar llega a tu precio.</span>
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-md">
              Configura un TC objetivo y recibe un email al instante. Sin aplicaciones, sin costo.
            </p>

            {/* Beneficios */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-5">
              {[
                { icon: Zap,         text: 'Aviso en segundos' },
                { icon: Bell,        text: 'Al alza y a la baja' },
                { icon: CheckCircle, text: '100% gratis' },
                { icon: Smartphone,  text: 'Solo necesitas tu email' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-900 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openModal}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all duration-200 text-sm text-white"
                style={{ background: '#000000', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                <Bell className="w-4 h-4" />
                Activar alerta gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Ya tengo cuenta
              </Link>
            </div>

            <p className="hidden sm:flex mt-4 text-xs items-center gap-1.5" style={{ color: '#000000' }}>
              <CheckCircle className="w-3.5 h-3.5" style={{ color: '#000000' }} />
              Sin registro · Se configura en menos de 30 segundos
            </p>
          </div>

          {/* ── Demo card — solo visible en desktop ── */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-[320px]">
              <style>{`
                @keyframes al-pulse-ring { 0%{transform:scale(1);opacity:0.7;} 100%{transform:scale(2.8);opacity:0;} }
                @keyframes al-pulse-dot  { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
                @keyframes al-shimmer    { 0%,100%{opacity:0.7;} 50%{opacity:1;} }
                @keyframes al-glow-badge { 0%,100%{box-shadow:0 0 0 rgba(37,99,235,0);} 50%{box-shadow:0 0 14px rgba(37,99,235,0.22);} }
                @keyframes al-bar        { 0%,100%{transform:scaleY(0.3);} 50%{transform:scaleY(1);} }
                @keyframes al-scan-bar   { 0%{transform:translateX(-100%);opacity:0;} 12%{opacity:0.45;} 88%{opacity:0.45;} 100%{transform:translateX(16rem);opacity:0;} }
                @keyframes al-float      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-3px);} }
                @keyframes al-notif-in   { from{opacity:0;transform:translateY(5px);} to{opacity:1;transform:translateY(0);} }
                @keyframes al-card-glow  { 0%,100%{box-shadow:0 24px 60px rgba(0,0,0,0.1),0 4px 16px rgba(0,0,0,0.05);} 50%{box-shadow:0 28px 70px rgba(37,99,235,0.1),0 4px 16px rgba(0,0,0,0.06);} }
              `}</style>

              <div className="relative rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(13,17,23,0.09)', animation: 'al-card-glow 5s ease-in-out infinite' }}>

                {/* ── Header ── */}
                <div style={{ background: '#0D1117', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Signal / waveform icon */}
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>Alertas TC · Qoricash</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                        <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
                          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2563EB', animation: 'al-pulse-ring 2s ease-out infinite' }} />
                          <div style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#2563EB', animation: 'al-pulse-dot 2s ease-in-out infinite' }} />
                        </div>
                        <span style={{ color: '#2563EB', fontSize: 10, fontWeight: 600 }}>Monitoreando en vivo</span>
                      </div>
                    </div>
                  </div>
                  {/* ACTIVA badge */}
                  <div style={{ background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(37,99,235,0.32)', borderRadius: 20, padding: '4px 10px', animation: 'al-glow-badge 3.5s ease-in-out infinite' }}>
                    <span style={{ color: '#2563EB', fontSize: 9, fontWeight: 800, letterSpacing: 0.6 }}>ACTIVA</span>
                  </div>
                </div>

                {/* ── TC actual ── */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', position: 'relative', overflow: 'hidden' }}>
                  {/* Scan bar */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, transparent, rgba(37,99,235,0.35), transparent)', borderRadius: 2, animation: 'al-scan-bar 4.5s ease-in-out 1s infinite' }} />

                  <p style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Tipo de cambio actual</p>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 0 }}>
                    {/* Compra */}
                    <div>
                      <p style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Compra</p>
                      <p style={{ fontSize: 27, fontWeight: 900, color: '#0D1117', lineHeight: 1, fontVariantNumeric: 'tabular-nums', animation: 'al-shimmer 3.5s ease-in-out infinite' }}>3.395</p>
                    </div>

                    {/* Mini bar chart */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 30, paddingBottom: 3 }}>
                      {[0.38, 0.62, 0.48, 0.85, 0.55, 1, 0.72].map((h, i) => (
                        <div key={i} style={{
                          width: 4, borderRadius: 2,
                          background: `rgba(37,99,235,${0.18 + h * 0.55})`,
                          height: `${Math.round(h * 100)}%`,
                          transformOrigin: 'bottom',
                          animation: `al-bar ${1.4 + i * 0.22}s ease-in-out ${i * 0.12}s infinite`,
                        }} />
                      ))}
                    </div>

                    {/* Venta */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 500, marginBottom: 2 }}>Venta</p>
                      <p style={{ fontSize: 27, fontWeight: 900, color: '#0D1117', lineHeight: 1, fontVariantNumeric: 'tabular-nums', animation: 'al-shimmer 3.5s ease-in-out 0.6s infinite' }}>3.415</p>
                    </div>
                  </div>

                  {/* Trend indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5, marginTop: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 7, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2563EB' }}>+0.005</span>
                  </div>
                </div>

                {/* ── Tu alerta ── */}
                <div style={{ padding: '14px 18px' }}>
                  <p style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Tu alerta</p>

                  {/* Animated alert card */}
                  <div
                    key={active}
                    style={{
                      borderRadius: 12, padding: '10px 12px', marginBottom: 10,
                      background: 'rgba(37,99,235,0.05)',
                      border: '1px solid rgba(37,99,235,0.16)',
                      opacity: notifVisible ? 1 : 0,
                      transform: notifVisible ? 'translateY(0)' : 'translateY(5px)',
                      transition: 'opacity 0.35s ease, transform 0.35s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {ej.tipo === 'sobre'
                          ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                          : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        }
                      </div>
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: '#2563EB', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                        {ej.tipo === 'sobre' ? 'Alerta al alza' : 'Alerta a la baja'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                      Avísame cuando TC {ej.moneda}{' '}
                      <span style={{ fontWeight: 900, color: '#2563EB' }}>{ej.accion} S/ {ej.valor}</span>
                    </p>
                  </div>

                  {/* Dots */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 10 }}>
                    {EJEMPLOS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        style={{
                          borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
                          width: i === active ? 18 : 5, height: 5,
                          background: i === active ? '#2563EB' : '#E2E8F0',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </div>

                  {/* Email notification row */}
                  <div style={{ borderRadius: 12, padding: '9px 12px', background: '#F8FAFC', border: '1px solid #E9EFF6', display: 'flex', alignItems: 'center', gap: 10, animation: 'al-float 4.5s ease-in-out infinite' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: '#0D1117', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#0D1117', marginBottom: 2 }}>info@qoricash.pe</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="#2563EB">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        <p style={{ fontSize: 9.5, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          TC {ej.moneda} llegó a S/ {ej.valor}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      <span style={{ fontSize: 9, color: '#94a3b8' }}>ahora</span>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB', animation: 'al-pulse-dot 1.8s ease-in-out infinite' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Separador inferior */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>

    {/* ── Modal prospecto ── */}
    {modalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(6,14,26,0.92)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(143,184,204,0.18)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(143,184,204,0.1)',
          }}
        >

          {/* Header */}
          <div
            className="relative flex items-center justify-between px-5 py-4 overflow-hidden"
            style={{ background: 'rgba(143,184,204,0.06)', borderBottom: '1px solid rgba(143,184,204,0.12)' }}
          >
            {/* Top highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(143,184,204,0.35), transparent)' }} />
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
            <div className="relative flex items-center gap-3">
              <div
                className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)' }}
              >
                <Bell className="w-[18px] h-[18px] text-blue-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500">
                  <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                </span>
              </div>
              <div>
                <p className="text-white font-extrabold text-sm leading-tight">Recibe el aviso sin registrarte</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(143,184,204,0.7)' }}>Sin contraseña · Solo tu email · 100% gratis</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="relative w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-6">
            {done ? (
              /* ── Éxito ── */
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)' }}>
                    <CheckCircle className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-black text-xl mb-1">¡Alerta activa!</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Te escribiremos a <strong className="text-blue-400">{form.email}</strong> en el momento exacto.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                  <Link
                    href="/crear-cuenta"
                    className="group inline-flex items-center justify-center gap-2 text-blue-300 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                    style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.28)' }}
                  >
                    Gestionar todas mis alertas
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProspecto} className="space-y-4">

                {/* Configurador de alerta */}
                <div className="rounded-xl px-4 py-5 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(143,184,204,0.12)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(143,184,204,0.55)' }}>Configura tu alerta</p>

                  {/* ¿Compra o vende dólares? */}
                  <div>
                    <p className="text-[10px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>¿Qué operación realizas?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { val: 'venta',  label: 'Yo compro dólares',  sub: 'TC Venta',  icon: '💵' },
                        { val: 'compra', label: 'Yo vendo dólares',   sub: 'TC Compra', icon: '🏦' },
                      ] as const).map(({ val, label, sub, icon }) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, moneda: val }))}
                          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 text-center"
                          style={form.moneda === val
                            ? { background: 'rgba(37,99,235,0.15)', border: '2px solid rgba(37,99,235,0.5)', color: '#ffffff' }
                            : { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(143,184,204,0.15)', color: 'rgba(255,255,255,0.45)' }
                          }
                        >
                          <span className="text-lg leading-none">{icon}</span>
                          <span className="text-xs font-bold leading-tight">{label}</span>
                          <span className="text-[10px] font-medium" style={{ color: form.moneda === val ? 'rgba(37,99,235,0.9)' : 'rgba(255,255,255,0.25)' }}>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle condición */}
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { val: 'sobre', label: 'Por encima de', icon: TrendingUp,  activeStyle: { background: 'rgba(37,99,235,0.2)', border: '1.5px solid rgba(37,99,235,0.6)', color: '#ffffff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' } },
                      { val: 'bajo',  label: 'Por debajo de', icon: TrendingDown, activeStyle: { background: 'rgba(239,68,68,0.2)', border: '1.5px solid rgba(239,68,68,0.6)', color: '#ffffff', boxShadow: '0 4px 12px rgba(239,68,68,0.2)' } },
                    ] as const).map(({ val, label, icon: Icon, activeStyle }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, tipo: val }))}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                        style={form.tipo === val
                          ? activeStyle
                          : { background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(143,184,204,0.15)', color: 'rgba(255,255,255,0.4)' }
                        }
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Input TC centrado y prominente */}
                  <div className="flex flex-col items-center gap-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(143,184,204,0.55)' }}>Tipo de cambio</p>
                    <div
                      className="relative flex items-center rounded-2xl transition-all duration-200"
                      style={form.tipo === 'sobre'
                        ? { border: '2px solid rgba(37,99,235,0.4)', background: 'rgba(37,99,235,0.06)' }
                        : { border: '2px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }
                      }
                    >
                      <span className="pl-5 pr-1 text-xl font-black pointer-events-none select-none" style={{ color: 'rgba(255,255,255,0.5)' }}>S/</span>
                      <input
                        type="number"
                        step="0.0001"
                        min="1"
                        max="10"
                        placeholder="3.4100"
                        value={form.valor}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parts = raw.split('.');
                          if (parts[1] && parts[1].length > 4) return;
                          setForm((f) => ({ ...f, valor: raw }));
                        }}
                        className="w-36 bg-transparent pr-5 py-3.5 text-3xl font-black text-white placeholder-white/20 focus:outline-none text-center tracking-tight"
                        required
                      />
                    </div>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Máximo 4 decimales · ej: 3.4150</p>
                  </div>

                  {/* Preview dinámico */}
                  {form.valor && parseFloat(form.valor) > 0 && (
                    <div
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                      style={form.tipo === 'sobre'
                        ? { background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: 'rgba(134,239,172,0.9)' }
                        : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(252,165,165,0.9)' }
                      }
                    >
                      {form.tipo === 'sobre'
                        ? <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                        : <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />}
                      <span>
                        Te avisamos cuando el TC {form.moneda === 'venta' ? 'Venta' : 'Compra'} esté{' '}
                        {form.tipo === 'sobre' ? 'por encima de' : 'por debajo de'}{' '}
                        <strong>S/ {parseFloat(form.valor).toFixed(4)}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Nombre + Email */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre o empresa"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(143,184,204,0.2)', color: '#ffffff' }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(37,99,235,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1px solid rgba(143,184,204,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(143,184,204,0.2)', color: '#ffffff' }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(37,99,235,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1px solid rgba(143,184,204,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    required
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {formError}
                  </p>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="relative w-full overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white transition-all duration-300 disabled:opacity-50 group"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    boxShadow: submitting ? 'none' : '0 4px 24px rgba(37,99,235,0.35)',
                  }}
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Activando alerta...
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Activar alerta gratis
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold" onClick={closeModal}>
                    Inicia sesión
                  </Link>
                  {' '}para gestionar todas tus alertas
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
