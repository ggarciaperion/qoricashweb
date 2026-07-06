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
        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 group"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
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

      {/* Modal */}
      {open && createPortal(
        <div className="animate-modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="animate-modal-enter w-full max-w-sm bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3353 100%)' }}>
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-green-400" />
                <p className="text-white font-semibold text-sm">Alertas de Tipo de Cambio</p>
              </div>
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4 max-h-[78vh] overflow-y-auto">

              {/* Confirmación */}
              {justCreated && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">¡Alerta creada!</p>
                    <p className="text-xs text-green-600">Te avisaremos por email cuando se active.</p>
                  </div>
                </div>
              )}

              {/* Formulario */}
              {!justCreated && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Quiero que me notifiquen cuando…
                  </p>

                  {/* Opción compra */}
                  <label className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    form.moneda === 'compra' && form.tipo === 'sobre'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input type="radio" name="condicion" className="accent-green-500 w-4 h-4 flex-shrink-0"
                      checked={form.moneda === 'compra' && form.tipo === 'sobre'}
                      onChange={() => setForm(f => ({ ...f, moneda: 'compra', tipo: 'sobre' }))} />
                    <span className="text-sm text-gray-700 flex-1">la <strong>compra</strong> esté por encima de</span>
                    <div className="relative w-24">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">S/</span>
                      <input
                        type="number" step="0.001" min="1" max="10"
                        placeholder="3.750"
                        value={form.moneda === 'compra' && form.tipo === 'sobre' ? form.valor : ''}
                        onClick={() => setForm(f => ({ ...f, moneda: 'compra', tipo: 'sobre' }))}
                        onChange={(e) => setForm(f => ({ ...f, moneda: 'compra', tipo: 'sobre', valor: e.target.value }))}
                        className="w-full pl-7 pr-2 py-2 bg-white border border-slate-200 focus:border-green-400 focus:outline-none rounded-lg text-sm font-bold text-gray-800 placeholder-gray-300"
                      />
                    </div>
                  </label>

                  {/* Opción venta */}
                  <label className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    form.moneda === 'venta' && form.tipo === 'bajo'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input type="radio" name="condicion" className="accent-orange-500 w-4 h-4 flex-shrink-0"
                      checked={form.moneda === 'venta' && form.tipo === 'bajo'}
                      onChange={() => setForm(f => ({ ...f, moneda: 'venta', tipo: 'bajo' }))} />
                    <span className="text-sm text-gray-700 flex-1">la <strong>venta</strong> esté por debajo de</span>
                    <div className="relative w-24">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">S/</span>
                      <input
                        type="number" step="0.001" min="1" max="10"
                        placeholder="3.750"
                        value={form.moneda === 'venta' && form.tipo === 'bajo' ? form.valor : ''}
                        onClick={() => setForm(f => ({ ...f, moneda: 'venta', tipo: 'bajo' }))}
                        onChange={(e) => setForm(f => ({ ...f, moneda: 'venta', tipo: 'bajo', valor: e.target.value }))}
                        className="w-full pl-7 pr-2 py-2 bg-white border border-slate-200 focus:border-orange-400 focus:outline-none rounded-lg text-sm font-bold text-gray-800 placeholder-gray-300"
                      />
                    </div>
                  </label>

                  {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                  <button type="submit" disabled={submitting}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #16A34A, #15803d)', boxShadow: '0 4px 12px rgba(22,163,74,0.25)' }}>
                    {submitting ? 'Guardando...' : 'Activar alerta'}
                  </button>
                </form>
              )}

              {/* Lista alertas */}
              {alertas.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alertas activas</p>
                  {alertas.map((a) => (
                    <div key={a.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
                      a.activa ? 'border-slate-200' : 'border-slate-100 opacity-40'
                    }`}>
                      <p className="text-xs text-gray-700">
                        {a.moneda === 'compra' ? 'Compra' : 'Venta'}{' '}
                        <span className={a.tipo === 'sobre' ? 'text-green-600 font-bold' : 'text-orange-500 font-bold'}>
                          {a.tipo === 'sobre' ? '↑ encima' : '↓ debajo'} de S/ {a.valor.toFixed(3)}
                        </span>
                      </p>
                      {a.activa && (
                        <button onClick={() => handleDelete(a.id)}
                          className="ml-3 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                          title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {loading && <p className="text-center text-xs text-gray-400">Cargando...</p>}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
