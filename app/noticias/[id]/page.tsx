import { getNoticias, type Noticia } from '@/lib/noticias';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, ExternalLink, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const CATEGORIA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Economía Peruana': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Mercado Forex':    { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200'   },
  Internacional:      { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
  Análisis:           { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticias = await getNoticias();
  const noticia = noticias.find((n) => n.id === id);
  if (!noticia) return { title: 'Noticia | QoriCash' };
  return {
    title: `${noticia.titulo} | QoriCash`,
    description: noticia.descripcion,
  };
}

export default async function NoticiaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticias = await getNoticias();
  const noticia = noticias.find((n) => n.id === id);

  if (!noticia) notFound();

  const color = CATEGORIA_COLORS[noticia.categoria] ?? CATEGORIA_COLORS['Análisis'];
  const otras = noticias.filter((n) => n.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HEADER — solo navegación y meta ── */}
      <div className="bg-secondary px-6 sm:px-8 lg:px-12 pt-16 pb-5">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a noticias
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${color.bg} ${color.text} ${color.border}`}>
              {noticia.categoria}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(noticia.fecha).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-xs text-gray-600">· Fuente: <span className="font-medium text-gray-400">{noticia.fuente}</span></span>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8">

        {/* Titular fuera del header */}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 leading-snug mb-8">
          {noticia.titulo}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Artículo principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Imagen cuadrada dentro del artículo */}
            {noticia.imagen && (
              <div className="w-48 h-48 rounded-xl overflow-hidden shadow-md float-right ml-5 mb-3 flex-shrink-0">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Descripción destacada */}
            <div className="bg-white border-l-4 border-primary-400 rounded-r-xl px-5 py-4 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {noticia.descripcion}
              </p>
            </div>

            {/* Contenido */}
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">
                {noticia.contenido}
              </p>
            </div>

            {/* Análisis QoriCash */}
            {noticia.analisis && (
              <div className="bg-gradient-to-br from-primary-50 to-emerald-50 border border-primary-200 rounded-xl px-6 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-700 uppercase tracking-widest">Análisis QoriCash</p>
                    <p className="text-[10px] text-primary-500">Impacto en el mercado forex</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-7 whitespace-pre-line">
                  {noticia.analisis}
                </p>
                <div className="mt-4 pt-3 border-t border-primary-200 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[11px] text-primary-600 font-medium">Elaborado por el equipo de análisis QoriCash</span>
                </div>
              </div>
            )}
            <div className="clear-both" />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* CTA cambio */}
            <div className="bg-secondary rounded-xl p-5 text-center">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">¿Listo para operar?</p>
              <p className="text-white font-display font-bold text-base mb-1">
                El mercado no espera
              </p>
              <p className="text-gray-500 text-xs mb-4">Cambia dólares al mejor tipo de cambio del mercado</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-primary-500/25 w-full justify-center"
              >
                Cambiar ahora
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Otras noticias */}
            {otras.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Más análisis</h3>
                <div className="space-y-3">
                  {otras.map((n) => (
                    <Link
                      key={n.id}
                      href={`/noticias/${n.id}`}
                      className="flex gap-3 group"
                    >
                      {n.imagen && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                          {n.titulo}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

