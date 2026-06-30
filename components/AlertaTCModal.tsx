'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
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

      {/* Modal — via Portal para escapar del stacking context de la navbar */}
      {open && createPortal(
        <div className="animate-modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="animate-modal-enter w-full max-w-sm bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.18)' }}>
                  <Bell className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Alertas de Tipo de Cambio</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Aviso por email cuando el dólar se mueva</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">

              {/* TC actual */}
              {(currentCompra || currentVenta) && (
                <div className="grid grid-cols-2 gap-2">
                  <div className={`rounded-xl px-3 py-3 text-center border transition-all duration-300 ${flashCompra ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">QoriCash compra</p>
                    <p className={`text-xl font-black ${flashCompra ? 'text-green-700' : 'text-slate-800'}`}>
                      {currentCompra?.toFixed(3) ?? '—'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">soles por dólar</p>
                  </div>
                  <div className={`rounded-xl px-3 py-3 text-center border transition-all duration-300 ${flashVenta ? 'border-green-300 bg-green-50' : 'border-green-100 bg-green-50/60'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">QoriCash vende</p>
                    <p className={`text-xl font-black ${flashVenta ? 'text-green-700' : 'text-green-700'}`}>
                      {currentVenta?.toFixed(3) ?? '—'}
                    </p>
                    <p className="text-[10px] text-green-500 mt-0.5">soles por dólar</p>
                  </div>
                </div>
              )}

              {/* Confirmación creación */}
              {justCreated && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">¡Alerta creada!</p>
                    <p className="text-xs text-green-600">Te avisaremos por email en cuanto se active.</p>
                  </div>
                </div>
              )}

              {/* Formulario nueva alerta */}
              {!justCreated && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nueva alerta</p>

                  {/* Paso 1: TC tipo */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      ¿Para qué tipo de cambio?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['venta', 'compra'] as const).map((m) => (
                        <button key={m} type="button"
                          onClick={() => setForm((f) => ({ ...f, moneda: m }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                            form.moneda === m
                              ? 'bg-slate-800 text-white border-slate-800'
                              : 'bg-white text-gray-500 border-slate-200 hover:border-slate-300'
                          }`}>
                          {m === 'venta' ? '🔵 TC Venta' : '🟢 TC Compra'}
                          {m === 'venta' && currentVenta && (
                            <span className={`block text-[11px] font-black mt-0.5 ${form.moneda === m ? 'text-green-300' : 'text-green-600'}`}>
                              S/ {currentVenta.toFixed(3)}
                            </span>
                          )}
                          {m === 'compra' && currentCompra && (
                            <span className={`block text-[11px] font-black mt-0.5 ${form.moneda === m ? 'text-green-300' : 'text-slate-600'}`}>
                              S/ {currentCompra.toFixed(3)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 2: Condición */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      ¿Cuándo avisarte?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button"
                        onClick={() => setForm((f) => ({ ...f, tipo: 'sobre' }))}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-bold transition-all ${
                          form.tipo === 'sobre'
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-500 border-slate-200 hover:border-slate-300'
                        }`}>
                        <TrendingUp className="w-4 h-4" />
                        Sube de…
                      </button>
                      <button type="button"
                        onClick={() => setForm((f) => ({ ...f, tipo: 'bajo' }))}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-bold transition-all ${
                          form.tipo === 'bajo'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-500 border-slate-200 hover:border-slate-300'
                        }`}>
                        <TrendingDown className="w-4 h-4" />
                        Baja de…
                      </button>
                    </div>
                  </div>

                  {/* Paso 3: Valor */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      ¿A qué valor?
                      {tcRef && <span className="ml-1.5 text-green-600 font-bold">Actual: S/ {tcRef.toFixed(3)}</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">S/</span>
                      <input
                        type="number" step="0.001" min="1" max="10"
                        placeholder="3.750"
                        value={form.valor}
                        onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-green-400 focus:outline-none rounded-xl text-lg font-black text-gray-800 placeholder-gray-300 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {form.valor && parseFloat(form.valor) > 0 && (
                    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 ${
                      form.tipo === 'sobre' ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
                    }`}>
                      {form.tipo === 'sobre'
                        ? <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                        : <TrendingDown className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                      <p className={`text-xs leading-snug ${form.tipo === 'sobre' ? 'text-green-700' : 'text-orange-700'}`}>
                        Te avisamos cuando el <strong>TC {form.moneda === 'compra' ? 'Compra' : 'Venta'}</strong>{' '}
                        {form.tipo === 'sobre' ? 'suba de' : 'baje de'}{' '}
                        <strong>S/ {parseFloat(form.valor).toFixed(3)}</strong>
                      </p>
                    </div>
                  )}

                  {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #16A34A, #15803d)', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}>
                    <Plus className="w-4 h-4" />
                    {submitting ? 'Guardando...' : 'Crear alerta'}
                  </button>
                </form>
              )}

              {/* Lista de alertas activas */}
              {alertas.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tus alertas</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {activeCount} activa{activeCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {alertas.map((a) => (
                      <div key={a.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                          a.activa ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-50'
                        }`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            a.tipo === 'sobre' ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {a.tipo === 'sobre'
                              ? <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                              : <TrendingDown className="w-3.5 h-3.5 text-orange-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800">
                              TC {a.moneda === 'compra' ? 'Compra' : 'Venta'}{' '}
                              {a.tipo === 'sobre' ? 'sube de' : 'baja de'}{' '}
                              <span className={a.tipo === 'sobre' ? 'text-green-600' : 'text-orange-500'}>
                                S/ {a.valor.toFixed(3)}
                              </span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {a.activa ? '● Activa' : '✓ Disparada'} ·{' '}
                              {new Date(a.fecha).toLocaleDateString('es-PE', { timeZone: 'America/Lima', day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        {a.activa && (
                          <button onClick={() => handleDelete(a.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                            title="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && <p className="text-center text-xs text-gray-400 py-2">Cargando alertas...</p>}

              <p className="text-center text-[10px] text-gray-400">
                Aviso a <strong className="text-gray-500">{user.email}</strong>
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
