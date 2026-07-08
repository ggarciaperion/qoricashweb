import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Users, Leaf, Heart, Clock, Award, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compromisos Corporativos | Qoricash — Fintech regulada por la SBS',
  description:
    'Conoce los compromisos institucionales de Qoricash en desarrollo profesional, diversidad e inclusión, sostenibilidad, impacto social y conciliación laboral. Respaldados por nuestra regulación SBS.',
  openGraph: {
    title: 'Compromisos Corporativos | Qoricash',
    description: 'Una fintech regulada, responsable y comprometida con sus colaboradores, clientes y la sociedad peruana.',
    url: 'https://www.qoricash.pe/nosotros/compromisos',
  },
};

const COMPROMISOS = [
  {
    icon: Award,
    color: '#4A6884',
    bg: 'rgba(74,104,132,0.08)',
    border: 'rgba(74,104,132,0.2)',
    slug: 'desarrollo-profesional',
    titulo: 'Desarrollo y Formación Profesional',
    desc: 'Invertimos en el crecimiento de cada colaborador mediante planes de carrera, capacitación continua y acceso a conocimiento especializado en fintech y mercados financieros.',
    tag: 'Employer Branding',
  },
  {
    icon: Users,
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.08)',
    border: 'rgba(13,148,136,0.2)',
    slug: 'diversidad-inclusion',
    titulo: 'Diversidad, Igualdad e Inclusión',
    desc: 'Promovemos un entorno laboral donde cada persona tiene igualdad de oportunidades, independientemente de su género, origen, edad o condición. La diversidad es nuestra fortaleza.',
    tag: 'DEI',
  },
  {
    icon: Leaf,
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.2)',
    slug: 'sostenibilidad',
    titulo: 'Sostenibilidad',
    desc: 'Operamos con responsabilidad ambiental, minimizando nuestra huella ecológica como empresa digital y promoviendo prácticas sostenibles en nuestra cadena de valor.',
    tag: 'ESG',
  },
  {
    icon: Heart,
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.08)',
    border: 'rgba(220,38,38,0.2)',
    slug: 'impacto-social',
    titulo: 'Impacto Social',
    desc: 'Contribuimos a la inclusión financiera del Perú facilitando el acceso a servicios de cambio de divisas seguros, transparentes y al alcance de empresas y personas.',
    tag: 'RSE',
  },
  {
    icon: Clock,
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.2)',
    slug: 'conciliacion-laboral',
    titulo: 'Conciliación Laboral',
    desc: 'Fomentamos el equilibrio entre la vida personal y profesional de nuestros colaboradores mediante políticas de flexibilidad, trabajo híbrido y bienestar integral.',
    tag: 'Bienestar',
  },
];

const PILARES = [
  { num: '01', titulo: 'Regulación y Transparencia', texto: 'Operamos bajo supervisión directa de la SBS, cumpliendo con todas las obligaciones legales y reportando con transparencia.' },
  { num: '02', titulo: 'Personas en el Centro', texto: 'Nuestros colaboradores son el activo más importante. Su desarrollo es parte de nuestra estrategia de negocio.' },
  { num: '03', titulo: 'Impacto Medible', texto: 'Establecemos métricas claras para cada compromiso y reportamos avances periódicamente.' },
  { num: '04', titulo: 'Mejora Continua', texto: 'Revisamos y actualizamos nuestros compromisos anualmente para mantenerlos relevantes y ambiciosos.' },
];

export default function CompromisosPage() {
  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="Qoricash" style={{ height: 40 }} />
            <span className="font-bold text-lg" style={{ color: '#fff' }}>Qoricash</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sobre-nosotros" className="text-xs font-medium hidden md:block" style={{ color: '#94A3B8' }}>Sobre Nosotros</Link>
            <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 24px' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2" style={{ fontSize: 11, color: '#64748B' }}>
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/sobre-nosotros" className="hover:text-white transition-colors">Nosotros</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#8fb8cc' }}>Compromisos Corporativos</span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Equipo Qoricash — Compromisos Corporativos"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.97) 0%, rgba(13,27,42,0.92) 60%, rgba(13,27,42,0.85) 100%)' }} />
        <div style={{ position: 'relative', padding: '64px 24px 56px' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ maxWidth: 680 }}>
              <span
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(74,104,132,0.15)', color: '#8fb8cc', border: '1px solid rgba(143,184,204,0.25)' }}
              >
                <Shield size={12} /> Compromisos Corporativos
              </span>
              <h1
                className="font-black mb-4"
                style={{ color: '#fff', fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                El estándar que nos<br />
                <span style={{ color: '#8fb8cc' }}>define como empresa</span>
              </h1>
              <p style={{ color: '#94A3B8', lineHeight: 1.8, maxWidth: 560, fontSize: 15 }}>
                En Qoricash, ser una fintech regulada por la SBS no es solo un requisito legal:
                es el punto de partida de un compromiso más amplio con nuestros colaboradores,
                clientes y la sociedad peruana.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="#compromisos"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
                  style={{ background: '#4A6884', color: '#fff' }}
                >
                  Ver compromisos <ArrowRight size={15} />
                </a>
                <Link
                  href="/sobre-nosotros"
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Quiénes somos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Declaración institucional ───────────────────────────── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#0D1B2A', lineHeight: 1.7, fontStyle: 'italic' }}>
              &ldquo;Nuestros compromisos corporativos no son declaraciones de marketing. Son principios
              que guían nuestras decisiones de negocio, nuestra cultura organizacional y nuestra
              relación con cada persona que forma parte del ecosistema Qoricash.&rdquo;
            </p>
            <p className="text-sm mt-4" style={{ color: '#64748B' }}>Equipo de Dirección — Qoricash S.A.C.</p>
          </div>
        </div>
      </section>

      {/* ── Pilares ─────────────────────────────────────────────── */}
      <section style={{ padding: '48px 24px', background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl mb-2" style={{ color: '#0D1B2A' }}>
              Nuestros pilares institucionales
            </h2>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Los principios que sostienen cada uno de nuestros compromisos
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {PILARES.map((p) => (
              <div key={p.num} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderTop: '3px solid #4A6884' }}>
                <span className="text-xs font-black tracking-widest" style={{ color: '#4A6884' }}>{p.num}</span>
                <h3 className="font-bold text-sm mt-2 mb-2" style={{ color: '#0D1B2A' }}>{p.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compromisos cards ───────────────────────────────────── */}
      <section id="compromisos" style={{ padding: '56px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl mb-2" style={{ color: '#0D1B2A' }}>
              Áreas de compromiso
            </h2>
            <p className="text-sm" style={{ color: '#64748B', maxWidth: 520, margin: '0 auto' }}>
              Cinco dimensiones que articulan nuestra responsabilidad como empresa,
              empleador y actor del ecosistema financiero peruano.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPROMISOS.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.slug} href={`/nosotros/compromisos/${c.slug}`} className="group block">
                  <div
                    className="h-full transition-all duration-200 group-hover:-translate-y-1"
                    style={{
                      background: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: 16,
                      padding: '24px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: 11,
                          background: c.bg, border: `1px solid ${c.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} color={c.color} />
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                      >
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#0D1B2A', lineHeight: 1.4 }}>
                      {c.titulo}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: '#64748B' }}>
                      {c.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: c.color }}>
                      Ver compromiso <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
            {/* Card: Cumplimiento regulatorio */}
            <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1e3a50 100%)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(143,184,204,0.15)', border: '1px solid rgba(143,184,204,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Shield size={20} color="#8fb8cc" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(143,184,204,0.1)', color: '#8fb8cc', border: '1px solid rgba(143,184,204,0.2)' }}>Regulación</span>
                <h3 className="font-bold text-sm mt-3 mb-2" style={{ color: '#fff', lineHeight: 1.4 }}>
                  Supervisados por la SBS
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
                  Inscrita en el Registro de Casas de Cambio de la Superintendencia de Banca, Seguros y AFP del Perú.
                </p>
              </div>
              <div className="mt-4 text-xs font-semibold" style={{ color: '#8fb8cc' }}>
                Reg. SBS N.° CC-053
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Regulación y credenciales ───────────────────────────── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <span className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full" style={{ background: 'rgba(74,104,132,0.08)', color: '#4A6884' }}>
                Marco Institucional
              </span>
              <h2 className="font-bold text-xl mb-3" style={{ color: '#0D1B2A' }}>
                Compromisos respaldados por regulación y gobernanza
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                Qoricash opera bajo el marco regulatorio de la Superintendencia de Banca,
                Seguros y AFP (SBS) del Perú. Esta supervisión no solo garantiza la seguridad
                operativa de nuestra plataforma, sino que establece los estándares mínimos
                que superamos en nuestras prácticas corporativas, laborales y de gestión de riesgos.
              </p>
              <p className="text-sm leading-relaxed mt-3" style={{ color: '#64748B' }}>
                Nuestros compromisos corporativos se actualizan anualmente y son revisados
                por la dirección de la empresa, asegurando su alineación con la evolución
                del negocio y las mejores prácticas del sector financiero.
              </p>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#64748B' }}>Regulado por</p>
              <p className="font-black text-sm" style={{ color: '#0D1B2A' }}>Superintendencia de<br />Banca, Seguros y AFP</p>
              <p className="text-xs mt-2" style={{ color: '#4A6884' }}>RUC: 20615113698</p>
              <div style={{ margin: '16px 0', height: 1, background: '#E2E8F0' }} />
              <p className="text-xs" style={{ color: '#64748B' }}>Registro de Casas de Cambio</p>
              <p className="text-xs font-semibold mt-1" style={{ color: '#0D1B2A' }}>N.° CC-053</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1e3a50 100%)', padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-bold text-2xl mb-3" style={{ color: '#fff' }}>
            ¿Quieres formar parte del equipo?
          </h2>
          <p className="text-sm mb-6" style={{ color: '#94A3B8', maxWidth: 480, margin: '0 auto 24px' }}>
            En Qoricash construimos un equipo de profesionales comprometidos con
            transformar el mercado cambiario peruano. Si compartes nuestra visión,
            queremos conocerte.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://www.linkedin.com/company/qoricash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg"
              style={{ background: '#0077B5', color: '#fff' }}
            >
              Síguenos en LinkedIn
            </a>
            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Conocer más sobre Qoricash
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ background: '#0D1B2A', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#475569' }}>
          © 2026 Qoricash S.A.C. | RUC 20615113698 | Regulado por la SBS |{' '}
          <Link href="/terminos-condiciones" style={{ color: '#64748B' }}>Términos</Link> ·{' '}
          <Link href="/politica-privacidad" style={{ color: '#64748B' }}>Privacidad</Link>
        </p>
      </footer>
    </main>
  );
}
