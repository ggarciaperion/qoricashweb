import { getNoticias, type Noticia } from '@/lib/noticias';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, TrendingUp, ExternalLink, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const revalidate = 60;

const CATEGORIA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Nacional:       { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200' },
  Internacional:  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
  Economía:       { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
  Tecnología:     { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200'  },
  Misceláneos:    { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200'   },
  // legacy fallbacks
  'Economía Peruana': { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200' },
  'Mercado Forex':    { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
  Análisis:           { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticias = await getNoticias();
  const noticia = noticias.find((n) => n.id === id);
  if (!noticia) return { title: 'Noticia | Qoricash' };
  return {
    title: `${noticia.titulo} | Qoricash`,
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
    <main className="min-h-screen bg-slate-50 pt-[80px]">
      <SiteNav />

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-8 lg:px-12 py-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/noticias" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a noticias
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${color.bg} ${color.text} ${color.border}`}>
              {noticia.categoria}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(noticia.fecha).toLocaleDateString('es-PE', { timeZone: 'America/Lima', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-xs text-gray-600">· Fuente: <span className="font-medium text-gray-400">{noticia.fuente}</span></span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Article */}
          <article className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug mb-4">
              {noticia.titulo}
            </h1>

            {noticia.imagen && (
              <div className="relative w-full rounded-2xl overflow-hidden mb-6" style={{ paddingBottom: '52%' }}>
                <Image
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-slate max-w-none">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-4">
                {noticia.descripcion}
              </p>
              {noticia.contenido && (
                <div className="text-sm sm:text-base leading-relaxed text-gray-600 space-y-4 mt-6"
                  dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                />
              )}
            </div>

            {/* Tag: cómo impacta en tu cambio */}
            <div className="mt-8 p-4 rounded-xl flex items-start gap-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#2563EB' }} />
              <div>
                <p className="text-xs font-bold text-blue-700 mb-0.5">¿Cómo afecta esto al tipo de cambio?</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Las condiciones del mercado cambian constantemente. Usa nuestra calculadora para obtener el tipo de cambio actualizado antes de realizar tu operación.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">

            {/* CTA */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Cambia hoy
              </p>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                Obtén el mejor tipo de cambio del mercado, 100% digital y en menos de 15 minutos.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:brightness-110 shadow-md w-full justify-center"
                style={{ background: '#2563EB' }}
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
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={n.imagen} alt={n.titulo} fill sizes="56px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {n.titulo}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.fecha).toLocaleDateString('es-PE', { timeZone: 'America/Lima', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
