import { getNoticias, CATEGORIAS, type Noticia } from '@/lib/noticias';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Calendar, BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Análisis de Mercado | QoriCash',
  description:
    'Noticias y análisis del mercado forex y economía peruana con impacto en el tipo de cambio.',
};

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

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', {
    timeZone: 'America/Lima',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function NoticiaCard({ noticia, featured = false }: { noticia: Noticia; featured?: boolean }) {
  const color = CATEGORIA_COLORS[noticia.categoria] ?? CATEGORIA_COLORS['Análisis'];

  if (featured) {
    return (
      <Link href={`/noticias/${noticia.id}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-primary-300 transition-all duration-300 flex">
        {noticia.imagen && (
          <div className="relative w-40 self-stretch flex-shrink-0 overflow-hidden">
            <Image
              src={noticia.imagen}
              alt={noticia.titulo}
              fill
              sizes="160px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${color.bg} ${color.text} ${color.border} flex-shrink-0`}>
              <span className="w-1 h-1 rounded-full bg-current" />
              {noticia.categoria}
            </span>
            <span className="text-[10px] text-gray-400 flex-shrink-0 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatFecha(noticia.fecha)}
            </span>
          </div>
          <h2 className="text-sm font-display font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {noticia.titulo}
          </h2>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">
            {noticia.descripcion}
          </p>
          <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-100">
            <span className="inline-flex items-center gap-1 text-[10px] text-primary-600 font-semibold">
              <BookOpen className="w-3 h-3" />
              Análisis QoriCash
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/noticias/${noticia.id}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-primary-300 transition-all duration-300 flex flex-col">
      {noticia.imagen && (
        <div className="relative h-32 overflow-hidden flex-shrink-0">
          <Image
            src={noticia.imagen}
            alt={noticia.titulo}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`inline-flex items-center text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${color.bg} ${color.text} ${color.border} flex-shrink-0`}>
            {noticia.categoria}
          </span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{formatFecha(noticia.fecha)}</span>
        </div>
        <h3 className="text-sm font-display font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-2">
          {noticia.titulo}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
          {noticia.descripcion}
        </p>
      </div>
    </Link>
  );
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const todasNoticias = await getNoticias();
  const { categoria } = await searchParams;
  const categoriaActiva = categoria ?? 'Todas';

  const noticias =
    categoriaActiva === 'Todas'
      ? todasNoticias
      : todasNoticias.filter((n) => n.categoria === categoriaActiva);

  const destacadas = todasNoticias.filter((n) => n.destacada).slice(0, 2);
  const resto = noticias.filter((n) => !n.destacada || categoriaActiva !== 'Todas');

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO oscuro — identidad QoriCash ── */}
      <section className="relative bg-secondary pt-16 pb-6 px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Inicio
              </Link>
              <span className="text-gray-700 text-xs">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary-400 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                Análisis de Mercado
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-gray-500 text-xs">
                {new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima', weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
              Noticias que{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-400 bg-clip-text text-transparent">
                mueven el dólar
              </span>
            </h1>
            <p className="mt-1 text-gray-400 text-sm">
              Análisis diario de eventos económicos y su impacto en el tipo de cambio PEN/USD.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">

        {/* Destacados */}
        {categoriaActiva === 'Todas' && destacadas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3">Destacados</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {destacadas.map((n) => (
                <NoticiaCard key={n.id} noticia={n} featured />
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {['Todas', ...CATEGORIAS].map((cat) => {
            const isActive = cat === categoriaActiva;
            return (
              <Link
                key={cat}
                href={cat === 'Todas' ? '/noticias' : `/noticias?categoria=${cat}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {noticias.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            No hay noticias en esta categoría aún.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {(categoriaActiva === 'Todas' ? resto : noticias).map((n) => (
              <NoticiaCard key={n.id} noticia={n} />
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-gray-200 px-6 sm:px-8 lg:px-12 py-14 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest font-semibold">
            Cambia en el momento exacto
          </p>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
            El mercado no espera.{' '}
            <span className="text-primary-600">Tú tampoco deberías.</span>
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Usa los mejores tipos de cambio del mercado peruano con QoriCash.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-primary-500/30 text-sm"
          >
            Cambiar dólares ahora
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
