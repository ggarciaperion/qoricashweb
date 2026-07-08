import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, CheckCircle, ChevronRight, ArrowRight, Scale, Globe, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Diversidad, Igualdad e Inclusión | Qoricash',
  description:
    'Qoricash promueve un entorno laboral inclusivo donde la diversidad de género, origen y perspectivas es una fortaleza organizacional. Conoce nuestros principios y acciones DEI.',
  openGraph: {
    title: 'Diversidad, Igualdad e Inclusión | Qoricash',
    url: 'https://www.qoricash.pe/nosotros/compromisos/diversidad-inclusion',
  },
};

const ACCIONES_ACTUALES = [
  'Procesos de selección basados en competencias y méritos, sin discriminación por género, edad, origen o condición.',
  'Política de igualdad salarial para roles equivalentes, independientemente del género del colaborador.',
  'Lenguaje inclusivo en comunicaciones internas y externas de la empresa.',
  'Entorno laboral libre de acoso y discriminación, con canal de reporte disponible para todos los colaboradores.',
  'Participación activa de personas de diferentes perfiles generacionales y profesionales en el equipo.',
];

const ACCIONES_FUTURAS = [
  'Formalizar una política escrita de Diversidad, Igualdad e Inclusión (DEI) disponible públicamente.',
  'Establecer métricas de diversidad de género en posiciones de liderazgo y seguimiento anual.',
  'Implementar procesos de selección con revisión ciega de candidaturas para minimizar sesgos inconscientes.',
  'Desarrollar un protocolo formal de prevención y atención del hostigamiento laboral.',
  'Incorporar criterios de inclusión en la selección de proveedores y aliados estratégicos.',
];

const KPIS = [
  { label: 'Ratio de paridad de género en el equipo total', meta: 'Seguimiento anual' },
  { label: 'Porcentaje de mujeres en posiciones de liderazgo', meta: 'Seguimiento anual' },
  { label: 'Diferencia salarial ajustada por género (rol equivalente)', meta: '0% brecha objetivo' },
  { label: 'Reportes de incidentes de discriminación o acoso', meta: 'Resolución < 15 días hábiles' },
  { label: 'Diversidad generacional en el equipo', meta: 'Seguimiento por tramos de edad' },
];

const FAQ = [
  {
    q: '¿Qoricash tiene una política formal de diversidad e inclusión?',
    a: 'Actualmente aplicamos principios de no discriminación en todos nuestros procesos. Estamos formalizando una política DEI escrita que estará disponible públicamente en 2026.',
  },
  {
    q: '¿Cómo garantiza Qoricash la igualdad de oportunidades en sus procesos de selección?',
    a: 'Nuestros procesos de selección están basados exclusivamente en competencias, experiencia relevante y potencial. Aplicamos criterios objetivos en cada etapa y buscamos activamente diversificar los canales de búsqueda de talento.',
  },
  {
    q: '¿Existe un canal para reportar situaciones de discriminación o acoso?',
    a: 'Sí. Cualquier colaborador puede reportar situaciones de este tipo a través del canal de comunicación interno con la dirección. Todos los reportes son tratados con confidencialidad y urgencia.',
  },
  {
    q: '¿Este compromiso incluye a proveedores y aliados externos?',
    a: 'Nuestro compromiso DEI se centra en nuestra operación interna. Como siguiente paso, incorporaremos criterios de inclusión en la evaluación de nuestros proveedores estratégicos.',
  },
];

export default function DiversidadInclusion() {
  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="Qoricash" style={{ height: 40 }} />
            <span className="font-bold text-lg" style={{ color: '#fff' }}>Qoricash</span>
          </Link>
          <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
        </div>
      </nav>
      <div style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 24px' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap" style={{ fontSize: 11, color: '#64748B' }}>
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight size={12} /><Link href="/nosotros/compromisos" className="hover:text-white transition-colors">Compromisos</Link>
          <ChevronRight size={12} /><span style={{ color: '#8fb8cc' }}>Diversidad, Igualdad e Inclusión</span>
        </div>
      </div>
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Diversidad en Qoricash" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.97) 0%, rgba(13,27,42,0.90) 100%)' }} />
        <div style={{ position: 'relative', padding: '60px 24px 52px' }}>
          <div className="max-w-5xl mx-auto" style={{ maxWidth: 660 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(13,148,136,0.15)', color: '#2DD4BF', border: '1px solid rgba(13,148,136,0.3)' }}>
              <Users size={12} /> DEI
            </span>
            <h1 className="font-black mb-4" style={{ color: '#fff', fontSize: 38, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Diversidad, Igualdad<br /><span style={{ color: '#2DD4BF' }}>e Inclusión</span>
            </h1>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, maxWidth: 540, fontSize: 15 }}>
              En Qoricash construimos un entorno donde cada persona es valorada por sus
              capacidades. La diversidad de perspectivas enriquece nuestras decisiones
              y fortalece nuestra cultura organizacional.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-bold text-xl mb-4" style={{ color: '#0D1B2A' }}>Nuestra postura</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
              La igualdad de oportunidades no es un objetivo aspiracional en Qoricash: es
              una práctica operativa que se refleja en cómo contratamos, promovemos,
              compensamos y nos relacionamos con cada miembro del equipo.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Reconocemos que la diversidad —de género, generacional, cultural y de
              trayectoria profesional— no solo es éticamente correcta, sino que genera
              equipos más creativos, resilientes y capaces de comprender a una base
              de clientes diversa.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[{ icon: Scale, label: 'Igualdad salarial' }, { icon: Globe, label: 'Inclusión cultural' }, { icon: Heart, label: 'Entorno libre de acoso' }, { icon: Users, label: 'Selección por méritos' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.15)' }}>
                <Icon size={16} color="#0D9488" />
                <span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Objetivos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: '01', texto: 'Garantizar procesos de selección, evaluación y promoción libres de sesgos discriminatorios.' },
              { num: '02', texto: 'Mantener igualdad salarial entre personas que desempeñan roles equivalentes, con independencia del género.' },
              { num: '03', texto: 'Construir un entorno laboral seguro, respetuoso y libre de cualquier forma de hostigamiento o discriminación.' },
              { num: '04', texto: 'Incrementar progresivamente la representación de mujeres en posiciones de liderazgo y toma de decisiones.' },
            ].map((o) => (
              <div key={o.num} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderLeft: '3px solid #0D9488' }}>
                <span className="text-xs font-black tracking-widest" style={{ color: '#0D9488' }}>{o.num}</span>
                <p className="text-sm leading-relaxed mt-2" style={{ color: '#475569' }}>{o.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Principios</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { titulo: 'No discriminación', texto: 'Ninguna decisión de empleo se basa en características no relacionadas con el desempeño del rol.' },
              { titulo: 'Equidad, no solo igualdad', texto: 'Reconocemos las diferencias de punto de partida y actuamos para nivelar el acceso a oportunidades.' },
              { titulo: 'Cultura psicológicamente segura', texto: 'Cada colaborador puede expresar ideas, señalar errores y reportar situaciones sin temor a represalias.' },
            ].map((p) => (
              <div key={p.titulo} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#0D1B2A' }}>{p.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones actuales</h2>
            <div className="flex flex-col gap-3">{ACCIONES_ACTUALES.map((a, i) => (<div key={i} className="flex items-start gap-3"><CheckCircle size={16} color="#0D9488" className="mt-0.5 shrink-0" /><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div>
          </div>
          <div>
            <h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones futuras</h2>
            <div className="flex flex-col gap-3">{ACCIONES_FUTURAS.map((a, i) => (<div key={i} className="flex items-start gap-3"><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0D9488' }} /></div><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div>
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Indicadores de seguimiento</h2>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#0D1B2A' }}><th className="text-left text-xs font-bold text-white px-4 py-3">Indicador (KPI)</th><th className="text-left text-xs font-bold text-white px-4 py-3">Referencia / Meta</th></tr></thead>
              <tbody>{KPIS.map((k, i) => (<tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><td className="text-sm px-4 py-3" style={{ color: '#475569' }}>{k.label}</td><td className="text-sm font-semibold px-4 py-3" style={{ color: '#0D9488' }}>{k.meta}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Preguntas frecuentes</h2>
          <div className="flex flex-col gap-4">{FAQ.map((f, i) => (<div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px' }}><h3 className="font-bold text-sm mb-2" style={{ color: '#0D1B2A' }}>{f.q}</h3><p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{f.a}</p></div>))}</div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1e3a50 100%)', padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div><h2 className="font-bold text-xl mb-2" style={{ color: '#fff' }}>Explora nuestros otros compromisos</h2><p className="text-sm" style={{ color: '#94A3B8' }}>La inclusión es uno de los cinco pilares de nuestra agenda corporativa.</p></div>
          <Link href="/nosotros/compromisos" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg shrink-0" style={{ background: '#0D9488', color: '#fff' }}>Ver todos los compromisos <ArrowRight size={15} /></Link>
        </div>
      </section>

      <footer style={{ background: '#0D1B2A', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#475569' }}>© 2026 Qoricash S.A.C. | RUC 20615113698 | Regulado por la SBS | <Link href="/terminos-condiciones" style={{ color: '#64748B' }}>Términos</Link> · <Link href="/politica-privacidad" style={{ color: '#64748B' }}>Privacidad</Link></p>
      </footer>
    </main>
  );
}
