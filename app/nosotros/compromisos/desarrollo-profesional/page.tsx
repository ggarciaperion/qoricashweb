import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, BookOpen, TrendingUp, Users, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Desarrollo y Formación Profesional | Qoricash',
  description:
    'Conoce cómo Qoricash invierte en el crecimiento profesional de sus colaboradores mediante capacitación continua, planes de carrera y acceso a conocimiento especializado en fintech y mercados financieros.',
  openGraph: {
    title: 'Desarrollo y Formación Profesional | Qoricash',
    url: 'https://www.qoricash.pe/nosotros/compromisos/desarrollo-profesional',
  },
};

const ACCIONES_ACTUALES = [
  'Capacitaciones internas periódicas sobre mercados cambiarios, regulación financiera y tecnología.',
  'Acceso a plataformas de aprendizaje en línea para el desarrollo de habilidades digitales y financieras.',
  'Proceso de onboarding estructurado con mentoring por parte de colaboradores senior.',
  'Evaluaciones de desempeño semestrales con retroalimentación constructiva y plan de acción.',
  'Participación en webinars y eventos del sector fintech y financiero.',
  'Cultura de documentación interna y transferencia de conocimiento entre equipos.',
];

const ACCIONES_FUTURAS = [
  'Implementar planes de carrera formalizados para cada rol de la organización.',
  'Establecer un presupuesto anual por colaborador destinado exclusivamente a formación.',
  'Desarrollar un programa de certificaciones en áreas clave: cumplimiento normativo, riesgo y tecnología.',
  'Crear un programa de mentoría estructurado con objetivos medibles.',
  'Formalizar el programa de evaluación de desempeño con vinculación a compensaciones.',
];

const KPIS = [
  { label: 'Horas de capacitación por colaborador / año', meta: '≥ 20 horas' },
  { label: 'Tasa de participación en programas de formación', meta: '≥ 80%' },
  { label: 'Porcentaje de posiciones cubiertas internamente', meta: 'Seguimiento anual' },
  { label: 'Índice de satisfacción con el desarrollo profesional', meta: '≥ 7/10 en encuesta interna' },
  { label: 'Retención de talento (12 meses)', meta: 'Seguimiento semestral' },
];

const FAQ = [
  {
    q: '¿Qoricash ofrece oportunidades de crecimiento interno?',
    a: 'Sí. Priorizamos la promoción interna cuando existe el perfil adecuado. Nuestros procesos de evaluación permiten identificar talentos con potencial de crecimiento dentro de la organización.',
  },
  {
    q: '¿Qué tipo de capacitaciones están disponibles para los colaboradores?',
    a: 'Incluyen formación en mercados financieros y cambiarios, cumplimiento normativo SBS, herramientas tecnológicas, habilidades blandas y liderazgo. El formato varía entre sesiones internas, plataformas online y eventos del sector.',
  },
  {
    q: '¿Cómo se mide el desempeño en Qoricash?',
    a: 'Realizamos evaluaciones semestrales estructuradas con objetivos claros, retroalimentación bidireccional y un plan de desarrollo acordado entre el colaborador y su líder directo.',
  },
  {
    q: '¿Este compromiso aplica a todos los niveles de la organización?',
    a: 'Sí. Desde el primer día en la empresa, cada colaborador tiene acceso a recursos de formación y recibe acompañamiento para su desarrollo, independientemente de su nivel o área.',
  },
];

export default function DesarrolloProfesional() {
  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="Qoricash" style={{ height: 40 }} />
            <span className="font-bold text-lg" style={{ color: '#fff' }}>Qoricash</span>
          </Link>
          <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
        </div>
      </nav>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 24px' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap" style={{ fontSize: 11, color: '#64748B' }}>
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/nosotros/compromisos" className="hover:text-white transition-colors">Compromisos</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#8fb8cc' }}>Desarrollo y Formación Profesional</span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Desarrollo profesional en Qoricash"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.97) 0%, rgba(13,27,42,0.90) 100%)' }} />
        <div style={{ position: 'relative', padding: '60px 24px 52px' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ maxWidth: 660 }}>
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(74,104,132,0.15)', color: '#8fb8cc', border: '1px solid rgba(143,184,204,0.25)' }}>
                <Award size={12} /> Employer Branding
              </span>
              <h1 className="font-black mb-4" style={{ color: '#fff', fontSize: 38, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Desarrollo y Formación<br />
                <span style={{ color: '#8fb8cc' }}>Profesional</span>
              </h1>
              <p style={{ color: '#94A3B8', lineHeight: 1.8, maxWidth: 540, fontSize: 15 }}>
                En Qoricash entendemos que el crecimiento de la empresa es inseparable
                del crecimiento de cada persona que la integra. Invertimos en formación
                porque creemos que el conocimiento es el activo más valioso del sector financiero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Introducción ───────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-bold text-xl mb-4" style={{ color: '#0D1B2A' }}>Nuestra postura</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
              El sector fintech exige profesionales con conocimientos técnicos actualizados,
              capacidad de adaptación y comprensión profunda del entorno regulatorio. En Qoricash,
              reconocemos que esta demanda es una responsabilidad compartida entre la empresa
              y cada colaborador.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Nuestro compromiso con el desarrollo profesional no se limita a capacitaciones
              puntuales. Buscamos crear un entorno donde el aprendizaje sea continuo, donde
              los errores sean oportunidades de mejora y donde cada colaborador tenga claridad
              sobre su trayectoria dentro de la organización.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { icon: BookOpen, label: 'Aprendizaje continuo' },
              { icon: TrendingUp, label: 'Planes de carrera' },
              { icon: Users, label: 'Mentoría interna' },
              { icon: Award, label: 'Evaluación de desempeño' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(74,104,132,0.06)', border: '1px solid rgba(74,104,132,0.12)' }}>
                <Icon size={16} color="#4A6884" />
                <span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Objetivos ──────────────────────────────────────────── */}
      <section style={{ padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Objetivos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: '01', texto: 'Garantizar que cada colaborador cuente con las competencias necesarias para desempeñar su rol con excelencia y adaptarse a los cambios del sector.' },
              { num: '02', texto: 'Fomentar una cultura de aprendizaje continuo donde la formación sea percibida como un beneficio real y no como una obligación.' },
              { num: '03', texto: 'Desarrollar el liderazgo interno para cubrir posiciones de mayor responsabilidad con talento propio cuando sea posible.' },
              { num: '04', texto: 'Alinear el desarrollo individual con los objetivos estratégicos de la empresa, generando valor para ambas partes.' },
            ].map((o) => (
              <div key={o.num} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderLeft: '3px solid #4A6884' }}>
                <span className="text-xs font-black tracking-widest" style={{ color: '#4A6884' }}>{o.num}</span>
                <p className="text-sm leading-relaxed mt-2" style={{ color: '#475569' }}>{o.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Principios ─────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Principios que nos guían</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { titulo: 'Acceso equitativo', texto: 'Todo colaborador, independientemente de su área o nivel, tiene acceso a oportunidades de formación.' },
              { titulo: 'Relevancia práctica', texto: 'Priorizamos formación aplicable al trabajo real, con impacto directo en la calidad y eficiencia operativa.' },
              { titulo: 'Retroalimentación honesta', texto: 'Las evaluaciones de desempeño son conversaciones bidireccionales, constructivas y orientadas al futuro.' },
            ].map((p) => (
              <div key={p.titulo} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#0D1B2A' }}>{p.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Acciones actuales ──────────────────────────────────── */}
      <section style={{ padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones actuales</h2>
            <div className="flex flex-col gap-3">
              {ACCIONES_ACTUALES.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} color="#4A6884" className="mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones futuras</h2>
            <div className="flex flex-col gap-3">
              {ACCIONES_FUTURAS.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #4A6884', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A6884' }} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs ───────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-2" style={{ color: '#0D1B2A' }}>Indicadores de seguimiento</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Métricas que utilizamos para medir el avance de este compromiso.</p>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0D1B2A' }}>
                  <th className="text-left text-xs font-bold text-white px-4 py-3">Indicador (KPI)</th>
                  <th className="text-left text-xs font-bold text-white px-4 py-3">Referencia / Meta</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <td className="text-sm px-4 py-3" style={{ color: '#475569' }}>{k.label}</td>
                    <td className="text-sm font-semibold px-4 py-3" style={{ color: '#4A6884' }}>{k.meta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Preguntas frecuentes</h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#0D1B2A' }}>{f.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA y navegación ───────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1e3a50 100%)', padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-bold text-xl mb-2" style={{ color: '#fff' }}>Explora nuestros otros compromisos</h2>
            <p className="text-sm" style={{ color: '#94A3B8' }}>El desarrollo profesional es uno de los cinco pilares de nuestra agenda corporativa.</p>
          </div>
          <Link href="/nosotros/compromisos" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg shrink-0" style={{ background: '#4A6884', color: '#fff' }}>
            Ver todos los compromisos <ArrowRight size={15} />
          </Link>
        </div>
      </section>

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
