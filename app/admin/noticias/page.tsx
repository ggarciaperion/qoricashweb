'use client';

import { useState, useEffect } from 'react';
import { CATEGORIAS, type Noticia } from '@/lib/noticias';
import { Plus, Trash2, Lock, TrendingUp, CheckCircle2, AlertCircle, Star, StarOff } from 'lucide-react';

const CATEGORIA_OPTIONS = ['Economía Peruana', 'Mercado Forex', 'Internacional', 'Análisis'];

export default function AdminNoticiasPage() {
  const [secret, setSecret] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [error, setError] = useState('');
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tipo: 'ok' | 'error' } | null>(null);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    analisis: '',
    categoria: 'Economía Peruana',
    fuente: 'Gestión',
    destacada: true,
    imagen: '',
  });

  function showToast(msg: string, tipo: 'ok' | 'error') {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  }

  async function cargarNoticias() {
    const res = await fetch('/api/noticias');
    const data = await res.json();
    setNoticias(data);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/noticias', {
      headers: { 'x-admin-secret': secret },
      method: 'POST',
      body: JSON.stringify({
        titulo: '__test__',
        descripcion: '__test__',
        contenido: '__test__',
        categoria: 'Análisis',
        fuente: 'Test',
        destacada: false,
      }),
    });

    if (res.status === 401) {
      setError('Contraseña incorrecta');
    } else {
      // Si paso la auth, eliminar el test que creamos
      const created = await res.json();
      if (created.id) {
        await fetch(`/api/noticias/${created.id}`, {
          method: 'DELETE',
          headers: { 'x-admin-secret': secret },
        });
      }
      setAutenticado(true);
      setError('');
      cargarNoticias();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo || !form.descripcion || !form.contenido) {
      showToast('Completa todos los campos', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      showToast('Noticia publicada correctamente', 'ok');
      setForm({
        titulo: '',
        descripcion: '',
        contenido: '',
        analisis: '',
        categoria: 'Economía Peruana',
        fuente: 'Gestión',
        destacada: true,
        imagen: '',
      });
      cargarNoticias();
    } catch {
      showToast('Error al publicar la noticia', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta noticia?')) return;
    const res = await fetch(`/api/noticias/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': secret },
    });
    if (res.ok) {
      showToast('Noticia eliminada', 'ok');
      cargarNoticias();
    } else {
      showToast('Error al eliminar', 'error');
    }
  }

  async function toggleDestacada(n: Noticia) {
    await fetch(`/api/noticias/${n.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify({ destacada: !n.destacada }),
    });
    cargarNoticias();
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-4">
              <Lock className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-xl font-display font-bold text-white">Panel de Noticias</h1>
            <p className="text-gray-500 text-sm mt-1">Acceso restringido · QoriCash Admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña de administrador"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition text-sm"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition text-sm"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080e1a] px-6 sm:px-8 lg:px-12 py-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold transition-all ${
            toast.tipo === 'ok'
              ? 'bg-primary-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toast.tipo === 'ok' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">Panel de Noticias</h1>
            <p className="text-gray-500 text-xs">QoriCash · Análisis de Mercado</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ── FORM ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-6 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-400" />
              Nueva noticia
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  URL de imagen
                </label>
                <input
                  value={form.imagen}
                  onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  placeholder="https://... (pega la URL de la imagen de la noticia)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 transition"
                />
                {form.imagen && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32 bg-gray-800 border border-gray-700">
                    <img src={form.imagen} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Titular
                </label>
                <input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Trump suspende impuesto a la gasolina..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Descripción breve (para tarjetas)
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  placeholder="Resumen corto visible en las cards..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Contenido de la noticia
                </label>
                <textarea
                  value={form.contenido}
                  onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                  rows={5}
                  placeholder="Resumen reescrito de la noticia..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  <span className="text-primary-400">Análisis QoriCash</span> — impacto forex
                </label>
                <textarea
                  value={form.analisis}
                  onChange={(e) => setForm({ ...form, analisis: e.target.value })}
                  rows={4}
                  placeholder="Breve análisis del impacto en el tipo de cambio PEN/USD o mercado forex..."
                  className="w-full bg-gray-800 border border-primary-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                    Categoría
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition"
                  >
                    {CATEGORIA_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 block">
                    Fuente
                  </label>
                  <input
                    value={form.fuente}
                    onChange={(e) => setForm({ ...form, fuente: e.target.value })}
                    placeholder="Gestión, El Comercio..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 transition"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm({ ...form, destacada: !form.destacada })}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-1 ${
                    form.destacada ? 'bg-primary-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                      form.destacada ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-400">
                  Mostrar en homepage como noticia destacada
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {loading ? 'Publicando...' : 'Publicar noticia'}
              </button>
            </form>
          </div>

          {/* ── LISTA ── */}
          <div>
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Noticias publicadas ({noticias.length})
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {noticias.length === 0 ? (
                <p className="text-gray-600 text-sm py-8 text-center">
                  No hay noticias publicadas aún.
                </p>
              ) : (
                noticias.map((n) => (
                  <div
                    key={n.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2 mb-1">
                        {n.titulo}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                          {n.categoria}
                        </span>
                        <span className="text-gray-800">·</span>
                        <span className="text-[10px] text-gray-600">
                          {new Date(n.fecha).toLocaleDateString('es-PE')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleDestacada(n)}
                        title={n.destacada ? 'Quitar de destacados' : 'Marcar como destacada'}
                        className={`p-1.5 rounded-lg transition ${
                          n.destacada
                            ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                            : 'text-gray-700 hover:text-amber-400 hover:bg-amber-400/10'
                        }`}
                      >
                        {n.destacada ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
