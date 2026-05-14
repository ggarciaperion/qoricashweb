'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, BellOff, Plus, Trash2, X, TrendingUp, TrendingDown, Zap, CheckCircle2 } from 'lucide-react';
import type { AlertaTC } from '@/lib/alertas';
import type { User } from '@/lib/types';

interface Props {
  user: User;
  currentCompra?: number | null;
  currentVenta?: number | null;
}

type FormState = {
  tipo: 'sobre' | 'bajo';
  moneda: 'compra' | 'venta';
  valor: string;
};

export default function AlertaTCModal({ user, currentCompra, currentVenta }: Props) {
  const [open, setOpen] = useState(false);
  const [alertas, setAlertas] = useState<AlertaTC[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>({ tipo: 'sobre', moneda: 'venta', valor: '' });

  const tcRef = form.moneda === 'compra' ? currentCompra : currentVenta;

  // Flash animation when TC prices update
  const [flashCompra, setFlashCompra] = useState(false);
  const [flashVenta, setFlashVenta] = useState(false);
  const prevCompra = useRef(currentCompra);
  const prevVenta = useRef(currentVenta);

  useEffect(() => {
    if (prevCompra.current !== undefined && prevCompra.current !== null && prevCompra.current !== currentCompra) {
      setFlashCompra(true);
      setTimeout(() => setFlashCompra(false), 700);
    }
    prevCompra.current = currentCompra;
  }, [currentCompra]);

  useEffect(() => {
    if (prevVenta.current !== undefined && prevVenta.current !== null && prevVenta.current !== currentVenta) {
      setFlashVenta(true);
      setTimeout(() => setFlashVenta(false), 700);
    }
    prevVenta.current = currentVenta;
  }, [currentVenta]);

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/alertas?userId=${user.id}`);
      const data = await res.json();
      setAlertas(Array.isArray(data) ? data : []);
    } catch {
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (open) fetchAlertas();
  }, [open, fetchAlertas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(form.valor);
    if (!val || val < 1 || val > 10) {
      setError('Ingresa un valor válido (ej: 3.410)');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          nombre: user.full_name || user.nombres || 'Cliente',
          tipo: form.tipo,
          valor: val,
          moneda: form.moneda,
        }),
      });
      if (!res.ok) throw new Error();
      setJustCreated(true);
      setForm({ tipo: 'sobre', moneda: 'venta', valor: '' });
      await fetchAlertas();
      setTimeout(() => setJustCreated(false), 4000);
    } catch {
      setError('Error al crear la alerta. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/alertas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      setAlertas((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silent
    }
  }

  const activeCount = alertas.filter((a) => a.activa).length;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm hover:shadow-primary-500/40 hover:shadow-md transition-all duration-200 group"
        title="Alertas de tipo de cambio"
      >
        <Bell className="w-3.5 h-3.5 group-hover:animate-[wiggle_0.4s_ease-in-out]" />
        <span className="hidden sm:inline tracking-wide">Alertas TC</span>
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-primary-600 text-[9px] font-black flex items-center justify-center shadow ring-1 ring-primary-200">
            {activeCount}
          </span>
        )}
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-28 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
              {/* Ambient glow */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 right-12 w-20 h-20 rounded-full bg-primary-400/10 blur-2xl pointer-events-none" />

              <div className="relative flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                  <Bell className="w-[18px] h-[18px] text-primary-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-400 ring-1 ring-primary-900/40" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm leading-tight">Alertas de Tipo de Cambio</p>
                  <p className="text-primary-400/70 text-[10px] font-medium mt-0.5">Recibe el aviso exacto cuando el dólar se mueva</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="relative text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">

              {/* Current TC display */}
              {(currentCompra || currentVenta) && (
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`relative overflow-hidden rounded-xl px-3 py-3 text-center border transition-all duration-300 ${
                      flashCompra
                        ? 'bg-primary-50 border-primary-300 scale-[1.03] shadow-md shadow-primary-100'
                        : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200/80'
                    }`}
                  >
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">TC Compra</p>
                    <p
                      key={currentCompra}
                      className={`text-xl font-black tracking-tight ${
                        flashCompra ? 'text-primary-700 animate-flash-in' : 'text-slate-800'
                      }`}
                      style={{ display: 'inline-block' }}
                    >
                      S/ {currentCompra?.toFixed(3) ?? '—'}
                    </p>
                    {flashCompra && (
                      <span className="absolute top-1.5 right-2 text-[9px] font-black text-primary-500 animate-ping-once">LIVE</span>
                    )}
                  </div>
                  <div
                    className={`relative overflow-hidden rounded-xl px-3 py-3 text-center border transition-all duration-300 ${
                      flashVenta
                        ? 'bg-primary-100 border-primary-400 scale-[1.03] shadow-md shadow-primary-100'
                        : 'bg-gradient-to-br from-primary-50 to-primary-100/60 border-primary-200/60'
                    }`}
                  >
                    <p className="text-[9px] text-primary-600 font-bold uppercase tracking-widest mb-1">TC Venta</p>
                    <p
                      key={currentVenta}
                      className={`text-xl font-black tracking-tight ${
                        flashVenta ? 'text-primary-700 animate-flash-in' : 'text-primary-700'
                      }`}
                      style={{ display: 'inline-block' }}
                    >
                      S/ {currentVenta?.toFixed(3) ?? '—'}
                    </p>
                    {flashVenta && (
                      <span className="absolute top-1.5 right-2 text-[9px] font-black text-primary-500 animate-ping-once">LIVE</span>
                    )}
                  </div>
                </div>
              )}

              {/* Success state */}
              {justCreated && (
                <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-800">¡Alerta creada!</p>
                    <p className="text-xs text-primary-600">Te avisaremos por email cuando se active.</p>
                  </div>
                </div>
              )}

              {/* Create form */}
              {!justCreated && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-primary-500" />
                    <p className="text-xs font-extrabold text-gray-700 uppercase tracking-widest">Nueva alerta</p>
                  </div>

                  {/* Tipo — pill buttons */}
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Condición</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['sobre', 'bajo'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-150 ${
                            form.tipo === t
                              ? t === 'sobre'
                                ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-200'
                                : 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200'
                              : 'bg-slate-50 text-gray-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {t === 'sobre' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {t === 'sobre' ? 'Por encima de' : 'Por debajo de'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Moneda — pill buttons */}
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Tipo de TC</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['venta', 'compra'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, moneda: m }))}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-150 ${
                            form.moneda === m
                              ? 'bg-primary-500 text-white border-primary-500 shadow-sm shadow-primary-200'
                              : 'bg-slate-50 text-gray-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          TC {m === 'venta' ? 'Venta' : 'Compra'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Valor */}
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Valor del TC
                      {tcRef && (
                        <span className="ml-2 text-primary-500 font-semibold normal-case">
                          actual: S/ {tcRef.toFixed(3)}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="1"
                      max="10"
                      placeholder="Ej: 3.410"
                      value={form.valor}
                      onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-primary-400 rounded-xl px-4 py-3 text-base font-black text-gray-800 placeholder-gray-300 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Preview */}
                  {form.valor && parseFloat(form.valor) > 0 && (
                    <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 border ${
                      form.tipo === 'sobre'
                        ? 'bg-primary-50 border-primary-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      {form.tipo === 'sobre' ? (
                        <TrendingUp className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={`text-xs leading-relaxed ${form.tipo === 'sobre' ? 'text-primary-700' : 'text-red-600'}`}>
                        Te avisaremos cuando el <strong>TC {form.moneda === 'compra' ? 'Compra' : 'Venta'}</strong>{' '}
                        esté <strong>{form.tipo === 'sobre' ? 'por encima de' : 'por debajo de'}</strong>{' '}
                        <strong>S/ {parseFloat(form.valor).toFixed(3)}</strong>
                      </p>
                    </div>
                  )}

                  {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white tracking-wide transition-all duration-200 disabled:opacity-50"
                    style={{ background: submitting ? '#d1d5db' : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', boxShadow: submitting ? 'none' : '0 4px 14px rgba(34,197,94,0.35)' }}
                  >
                    <Plus className="w-4 h-4" />
                    {submitting ? 'Creando alerta...' : 'Crear alerta ahora'}
                  </button>
                </form>
              )}

              {/* Active alerts list */}
              {alertas.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-3.5 h-3.5 text-primary-500" />
                    <p className="text-xs font-extrabold text-gray-700 uppercase tracking-widest">Tus alertas</p>
                    <span className="ml-auto text-[10px] font-bold text-gray-400">{activeCount} activa{activeCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {alertas.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-all ${
                          a.activa
                            ? 'bg-white border-primary-100 shadow-sm'
                            : 'bg-slate-50 border-slate-100 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            a.activa ? 'bg-primary-50' : 'bg-slate-100'
                          }`}>
                            {a.activa ? (
                              <Bell className="w-3.5 h-3.5 text-primary-500" />
                            ) : (
                              <BellOff className="w-3.5 h-3.5 text-gray-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">
                              TC {a.moneda === 'compra' ? 'Compra' : 'Venta'}{' '}
                              <span className={a.tipo === 'sobre' ? 'text-primary-600' : 'text-red-500'}>
                                {a.tipo === 'sobre' ? '>' : '<'}
                              </span>{' '}
                              S/ {a.valor.toFixed(3)}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                              {a.activa ? 'Activa' : 'Disparada'} ·{' '}
                              {new Date(a.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        {a.activa && (
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 text-gray-200 hover:text-red-400 transition-colors flex-shrink-0"
                            title="Eliminar alerta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <p className="text-center text-xs text-gray-400 py-2">Cargando alertas...</p>
              )}

              {/* Bottom note */}
              <p className="text-center text-[10px] text-gray-400 pt-1">
                Las alertas llegan a <strong className="text-gray-500">{user.email}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
