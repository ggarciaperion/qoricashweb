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
      <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-primary-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-primary-500/8 rounded-full blur-[100px] pointer-events-none" />


      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-5 sm:py-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>

        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* ── Texto ── */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
              </span>
              <span className="text-primary-400 text-xs font-bold tracking-[0.15em] uppercase">Alertas de Tipo de Cambio</span>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-[1.1] mb-2 sm:mb-3">
              Te avisamos cuando el <span className="text-primary-400">dólar llega a tu precio.</span>
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
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <Icon className="w-3.5 h-3.5 text-primary-400" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openModal}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full transition-all duration-200 text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: '0 4px 20px rgba(34,197,94,0.25)' }}
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

            <p className="hidden sm:flex mt-4 text-gray-600 text-xs items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
              Sin registro · Se configura en menos de 30 segundos
            </p>
          </div>

          {/* ── Demo card — solo visible en desktop ── */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-[320px]">
              <div className="absolute -inset-3 rounded-3xl blur-2xl" style={{ background: 'rgba(34,197,94,0.08)' }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>

                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(13,27,42,0.8)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                      <Bell className="w-4 h-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Alertas TC · QoriCash</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                        <span className="text-primary-400 text-[10px] font-semibold">Monitoreando en vivo</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary-400 px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>ACTIVA</span>
                </div>

                {/* TC actual */}
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Tipo de cambio actual</p>
                  <div className="flex items-end gap-6">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">Compra</p>
                      <p className="text-2xl font-black text-white">3.395</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-0.5">Venta</p>
                      <p className="text-2xl font-black text-white">3.415</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-primary-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-bold">+0.005</span>
                    </div>
                  </div>
                </div>

                {/* Alerta animada */}
                <div className="px-5 py-4">
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2.5">Tu alerta</p>
                  <div
                    className={`rounded-xl p-3.5 mb-3 transition-all duration-500 ${notifVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
                    style={{
                      background: ej.tipo === 'sobre' ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)',
                      border: ej.tipo === 'sobre' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(59,130,246,0.2)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {ej.tipo === 'sobre'
                        ? <TrendingUp className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                        : <TrendingDown className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${ej.tipo === 'sobre' ? 'text-primary-400' : 'text-blue-400'}`}>
                        {ej.tipo === 'sobre' ? 'Alerta al alza' : 'Alerta a la baja'}
                      </span>
                    </div>
                    <p className="text-white text-xs font-semibold">
                      Avísame cuando TC {ej.moneda} {ej.accion}{' '}
                      <span className={`font-black ${ej.tipo === 'sobre' ? 'text-primary-300' : 'text-blue-300'}`}>
                        S/ {ej.valor}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-1.5 mb-3">
                    {EJEMPLOS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`rounded-full transition-all duration-300 ${i === active ? 'w-5 h-1.5 bg-primary-400' : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/30'}`}
                      />
                    ))}
                  </div>

                  <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
                      <Mail className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-[11px] font-bold">info@qoricash.pe</p>
                      <p className="text-gray-400 text-[10px] truncate">
                        ⚡ TC {ej.moneda} llegó a S/ {ej.valor}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[9px] text-gray-600">ahora</span>
                      <span className="w-2 h-2 rounded-full bg-primary-400" />
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
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Header */}
          <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #112238 100%)' }}>
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-primary-500/15 border border-primary-500/25 flex items-center justify-center flex-shrink-0">
                <Bell className="w-[18px] h-[18px] text-primary-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-400">
                  <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-75" />
                </span>
              </div>
              <div>
                <p className="text-white font-extrabold text-sm leading-tight">Recibe el aviso sin registrarte</p>
                <p className="text-primary-400/70 text-[10px] font-medium mt-0.5">Sin contraseña · Solo tu email · 100% gratis</p>
              </div>
            </div>
            <button onClick={closeModal} className="relative text-gray-500 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6">
            {done ? (
              /* ── Éxito ── */
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-primary-500/15 border border-primary-500/40 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-400" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-black text-xl mb-1">¡Alerta activa!</p>
                  <p className="text-gray-400 text-sm">
                    Te escribiremos a <strong className="text-primary-400">{form.email}</strong> en el momento exacto.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                  <Link
                    href="/crear-cuenta"
                    className="group inline-flex items-center justify-center gap-2 bg-primary-500/15 hover:bg-primary-500/25 border border-primary-500/30 text-primary-300 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                  >
                    Gestionar todas mis alertas
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProspecto} className="space-y-4">

                {/* Configurador de alerta */}
                <div className="bg-white/[0.04] rounded-xl border border-white/8 px-4 py-5 space-y-4">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Configura tu alerta</p>

                  {/* ¿Compra o vende dólares? */}
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold mb-2">¿Qué operación realizas?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { val: 'venta',  label: 'Yo compro dólares',  sub: 'Te interesa el TC Venta',  icon: '💵' },
                        { val: 'compra', label: 'Yo vendo dólares',   sub: 'Te interesa el TC Compra', icon: '🏦' },
                      ] as const).map(({ val, label, sub, icon }) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, moneda: val }))}
                          className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 text-center ${
                            form.moneda === val
                              ? 'bg-primary-500/15 border-primary-500/60 text-white'
                              : 'bg-transparent border-white/8 text-gray-500 hover:border-white/20 hover:text-gray-300'
                          }`}
                        >
                          <span className="text-lg leading-none">{icon}</span>
                          <span className="text-xs font-bold leading-tight">{label}</span>
                          <span className={`text-[10px] font-medium ${form.moneda === val ? 'text-primary-400' : 'text-gray-600'}`}>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle condición */}
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { val: 'sobre', label: 'Por encima de', icon: TrendingUp,  activeClass: 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' },
                      { val: 'bajo',  label: 'Por debajo de', icon: TrendingDown, activeClass: 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' },
                    ] as const).map(({ val, label, icon: Icon, activeClass }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, tipo: val }))}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          form.tipo === val ? activeClass : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Input TC centrado y prominente */}
                  <div className="flex flex-col items-center gap-1.5">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Tipo de cambio</p>
                    <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 ${
                      form.tipo === 'sobre'
                        ? 'border-primary-500/40 focus-within:border-primary-500 bg-primary-500/5'
                        : 'border-red-500/40 focus-within:border-red-500 bg-red-500/5'
                    }`}>
                      <span className="pl-5 pr-1 text-gray-400 text-xl font-black pointer-events-none select-none">S/</span>
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
                        className="w-36 bg-transparent pr-5 py-3.5 text-3xl font-black text-white placeholder-gray-700 focus:outline-none text-center tracking-tight"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-gray-700">Máximo 4 decimales · ej: 3.4150</p>
                  </div>

                  {/* Preview dinámico */}
                  {form.valor && parseFloat(form.valor) > 0 && (
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      form.tipo === 'sobre' ? 'bg-primary-500/10 text-primary-300' : 'bg-red-500/10 text-red-300'
                    }`}>
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
                    className="w-full bg-white/5 border border-white/10 focus:border-primary-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all focus:bg-white/[0.07]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-all focus:bg-white/[0.07]"
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
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    boxShadow: submitting ? 'none' : '0 4px 24px rgba(34,197,94,0.35)',
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

                <p className="text-center text-[11px] text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-primary-500 hover:text-primary-400 transition-colors font-semibold" onClick={closeModal}>
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
