'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, Plus, Trash2, X, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
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
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>({ tipo: 'sobre', moneda: 'venta', valor: '' });

  const tcRef = form.moneda === 'compra' ? currentCompra : currentVenta;

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
      setSuccess('¡Alerta creada! Te avisaremos por email cuando se active.');
      setForm({ tipo: 'sobre', moneda: 'venta', valor: '' });
      await fetchAlertas();
      setTimeout(() => setSuccess(''), 4000);
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
        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
        title="Alertas de tipo de cambio"
      >
        <Bell className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Alertas TC</span>
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0D1B2A] to-[#1a2e45]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Alertas de Tipo de Cambio</p>
                  <p className="text-gray-400 text-[10px]">Te avisamos cuando el TC llegue a tu nivel</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* Current TC display */}
              {(currentCompra || currentVenta) && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Compra</p>
                    <p className="text-lg font-black text-gray-900">S/ {currentCompra?.toFixed(3) ?? '—'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Venta</p>
                    <p className="text-lg font-black text-gray-900">S/ {currentVenta?.toFixed(3) ?? '—'}</p>
                  </div>
                </div>
              )}

              {/* Create form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nueva alerta</p>

                <div className="grid grid-cols-2 gap-2">
                  {/* Tipo */}
                  <div className="relative">
                    <label className="block text-[10px] text-gray-400 font-semibold mb-1">Condición</label>
                    <div className="relative">
                      <select
                        value={form.tipo}
                        onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as 'sobre' | 'bajo' }))}
                        className="w-full appearance-none bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 pr-7 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="sobre">Por encima de</option>
                        <option value="bajo">Por debajo de</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Moneda */}
                  <div>
                    <label className="block text-[10px] text-gray-400 font-semibold mb-1">Tipo de TC</label>
                    <div className="relative">
                      <select
                        value={form.moneda}
                        onChange={(e) => setForm((f) => ({ ...f, moneda: e.target.value as 'compra' | 'venta' }))}
                        className="w-full appearance-none bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 pr-7 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="venta">TC Venta</option>
                        <option value="compra">TC Compra</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-[10px] text-gray-400 font-semibold mb-1">
                    Valor del TC
                    {tcRef && (
                      <span className="ml-2 text-primary-500 font-normal">TC actual: S/ {tcRef.toFixed(3)}</span>
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
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                {/* Preview */}
                {form.valor && parseFloat(form.valor) > 0 && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    {form.tipo === 'sobre' ? (
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    )}
                    <p className="text-xs text-amber-700">
                      Te avisaremos cuando el <strong>TC {form.moneda === 'compra' ? 'Compra' : 'Venta'}</strong>{' '}
                      esté <strong>{form.tipo === 'sobre' ? 'por encima de' : 'por debajo de'}</strong>{' '}
                      <strong>S/ {parseFloat(form.valor).toFixed(3)}</strong>
                    </p>
                  </div>
                )}

                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                {success && <p className="text-xs text-emerald-600 font-medium">{success}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Creando...' : 'Crear alerta'}
                </button>
              </form>

              {/* Active alerts list */}
              {alertas.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tus alertas</p>
                  <div className="space-y-2">
                    {alertas.map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm ${
                          a.activa
                            ? 'bg-white border-gray-200'
                            : 'bg-gray-50 border-gray-100 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {a.activa ? (
                            <Bell className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          ) : (
                            <BellOff className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              TC {a.moneda === 'compra' ? 'Compra' : 'Venta'}{' '}
                              {a.tipo === 'sobre' ? '>' : '<'}{' '}
                              S/ {a.valor.toFixed(3)}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {a.activa ? 'Activa' : 'Activada'} ·{' '}
                              {new Date(a.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        {a.activa && (
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
