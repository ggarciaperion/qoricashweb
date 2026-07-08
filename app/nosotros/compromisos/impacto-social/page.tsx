import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, CheckCircle, ChevronRight, ArrowRight, Shield, Landmark, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impacto Social | Qoricash — Inclusión financiera en el Perú',
  description:
    'Qoricash contribuye a la inclusión financiera del Perú facilitando acceso a servicios de cambio de divisas seguros, transparentes y competitivos para empresas y personas.',
  openGraph: {
    title: 'Impacto Social | Qoricash',
    url: 'https://www.qoricash.pe/nosotros/compromisos/impacto-social',
  },
};

const ACCIONES_ACTUALES = [
  'Plataforma 100% digital accesible desde cualquier dispositivo, eliminando barreras geográficas de acceso al servicio.',
  'Transparencia total en el tipo de cambio: sin comisiones ocultas ni costos adicionales no informados al cliente.',
  'Registro y regulación por la SBS, que garantiza al usuario que opera con una entidad supervisada y formal.',
  'Atención al cliente disponible por múltiples canales digitales (WhatsApp, email, plataforma web).',
  'Publicación del tipo de cambio en tiempo real en el sitio web, accesible para cualquier persona.',
  'Libro de reclamaciones digital disponible para todos los usuarios de la plataforma.',
];

const ACCIONES_FUTURAS = [
  'Desarrollar contenido educativo sobre mercados cambiarios y gestión del riesgo de tipo de cambio para empresas y personas.',
  'Explorar alianzas con gremios empresariales y cámaras de comercio para ampliar el acceso de pequeñas empresas exportadoras e importadoras.',
  'Implementar un programa de atención preferencial para MYPES con necesidades de cambio de divisas recurrentes.',
  'Desarrollar materiales de educación financiera en formatos accesibles (guías, videos cortos, infografías).',
  'Medir el impacto social del servicio a través de encuestas de satisfacción y análisis de perfil de usuarios atendidos.',
];

const KPIS = [
  { label: 'Número de clientes activos (personas naturales y jurídicas)', meta: 'Seguimiento trimestral' },
  { label: 'Porcentaje de clientes MYPE sobre el total', meta: 'Seguimiento semestral' },
  { label: 'Índice de satisfacción del cliente (NPS)', meta: '≥ 7/10' },
  { label: 'Tiempo promedio de resolución de reclamaciones', meta: '≤ 15 días hábiles' },
  { label: 'Ahorro estimado generado al cliente vs. tipo de cambio bancario', meta: 'Publicación semestral' },
];

const FAQ = [
  {
    q: '¿Cómo contribuye Qoricash a la inclusión financiera?',
    a: 'Al operar de forma 100% digital con registro SBS, Qoricash lleva el servicio de cambio de divisas a personas y empresas que antes debían acudir a bancos o casas de cambio físicas, con mayor costo y menor accesibilidad.',
  },
  {
    q: '¿Qoricash atiende a pequeñas empresas?',
    a: 'Sí. Contamos con una modalidad empresarial diseñada para MYPES y medianas empresas que requieren cambio de divisas de forma regular. Nuestras tasas corporativas son competitivas y nuestro proceso es 100% digital.',
  },
  {
    q: '¿Cuál es el beneficio económico real para el usuario?',
    a: 'Al ofrecer tipos de cambio más competitivos que la banca tradicional, nuestros clientes acceden a un mayor poder adquisitivo en cada transacción. Para empresas con operaciones frecuentes en divisas, el ahorro acumulado puede ser significativo.',
  },
  {
    q: '¿Cómo protege Qoricash a sus usuarios?',
    a: 'Operamos bajo supervisión de la SBS, contamos con sistemas de seguridad de datos, cumplimos con la Ley de Protección de Datos Personales (Ley 29733) y ponemos a disposición un libro de reclamaciones digital para cualquier usuario.',
  },
];

export default function ImpactoSocial() {
  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="Qoricash" style={{ height: 40 }} /><span className="font-bold text-lg" style={{ color: '#fff' }}>Qoricash</span>
          </Link>
          <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
        </div>
      </nav>
      <div style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 24px' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap" style={{ fontSize: 11, color: '#64748B' }}>
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link><ChevronRight size={12} />
          <Link href="/nosotros/compromisos" className="hover:text-white transition-colors">Compromisos</Link><ChevronRight size={12} />
          <span style={{ color: '#8fb8cc' }}>Impacto Social</span>
        </div>
      </div>
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Impacto social Qoricash" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(30,5,5,0.97) 0%, rgba(42,8,8,0.90) 100%)' }} />
        <div style={{ position: 'relative', padding: '60px 24px 52px' }}>
          <div className="max-w-5xl mx-auto" style={{ maxWidth: 660 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(220,38,38,0.15)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.3)' }}>
              <Heart size={12} /> RSE — Impacto Social
            </span>
            <h1 className="font-black mb-4" style={{ color: '#fff', fontSize: 38, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Impacto social<br /><span style={{ color: '#FCA5A5' }}>e inclusión financiera</span>
            </h1>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, maxWidth: 540, fontSize: 15 }}>
              Qoricash nació para democratizar el acceso al mejor tipo de cambio en el Perú.
              Cada transacción que procesamos de forma segura, transparente y competitiva
              es una contribución concreta a la inclusión financiera del país.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-bold text-xl mb-4" style={{ color: '#0D1B2A' }}>Nuestra postura</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
              El mercado cambiario peruano históricamente ha estado dominado por la banca
              tradicional y casas de cambio físicas, con spreads elevados y acceso limitado
              para pequeñas empresas y personas con operaciones en divisas. Qoricash existe
              para cambiar eso.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Nuestro impacto social más directo es operativo: cada cliente que realiza
              un cambio de divisas con nosotros accede a tasas más competitivas, un proceso
              más rápido y la seguridad de operar con una entidad regulada por la SBS.
              Para las MYPES exportadoras e importadoras, este diferencial tiene un impacto
              real y medible en su competitividad.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[{ icon: Shield, label: 'Regulado por la SBS' }, { icon: Landmark, label: 'Transparencia total de tasas' }, { icon: TrendingUp, label: 'Acceso para MYPES' }, { icon: Heart, label: 'Inclusión financiera digital' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                <Icon size={16} color="#dc2626" /><span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>{label}</span>
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
              { num: '01', texto: 'Facilitar el acceso al mercado cambiario formal a empresas y personas que antes dependían de canales informales o de mayor costo.' },
              { num: '02', texto: 'Generar un ahorro real y medible para nuestros clientes respecto al tipo de cambio bancario tradicional.' },
              { num: '03', texto: 'Contribuir a la educación financiera de nuestros usuarios sobre mercados cambiarios y gestión del riesgo de tipo de cambio.' },
              { num: '04', texto: 'Operar siempre dentro del marco regulatorio de la SBS, garantizando la protección de los usuarios y la integridad del sistema financiero.' },
            ].map((o) => (
              <div key={o.num} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderLeft: '3px solid #dc2626' }}>
                <span className="text-xs font-black tracking-widest" style={{ color: '#dc2626' }}>{o.num}</span>
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
              { titulo: 'Transparencia radical', texto: 'El tipo de cambio que mostramos es el tipo de cambio que aplica. Sin costos ocultos, sin sorpresas al momento del cierre.' },
              { titulo: 'Formalidad como protección', texto: 'Operar bajo supervisión SBS no es un trámite: es la garantía que protege al cliente de fraudes, errores y abusos.' },
              { titulo: 'Impacto medible', texto: 'Queremos cuantificar el ahorro que generamos para nuestros clientes y publicarlo como evidencia de nuestro impacto real.' },
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
          <div><h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones actuales</h2><div className="flex flex-col gap-3">{ACCIONES_ACTUALES.map((a, i) => (<div key={i} className="flex items-start gap-3"><CheckCircle size={16} color="#dc2626" className="mt-0.5 shrink-0" /><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div></div>
          <div><h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones futuras</h2><div className="flex flex-col gap-3">{ACCIONES_FUTURAS.map((a, i) => (<div key={i} className="flex items-start gap-3"><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} /></div><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div></div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Indicadores de seguimiento</h2>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#0D1B2A' }}><th className="text-left text-xs font-bold text-white px-4 py-3">Indicador (KPI)</th><th className="text-left text-xs font-bold text-white px-4 py-3">Referencia / Meta</th></tr></thead>
              <tbody>{KPIS.map((k, i) => (<tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><td className="text-sm px-4 py-3" style={{ color: '#475569' }}>{k.label}</td><td className="text-sm font-semibold px-4 py-3" style={{ color: '#dc2626' }}>{k.meta}</td></tr>))}</tbody>
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
          <div><h2 className="font-bold text-xl mb-2" style={{ color: '#fff' }}>Explora nuestros otros compromisos</h2><p className="text-sm" style={{ color: '#94A3B8' }}>El impacto social es uno de los cinco pilares de nuestra agenda corporativa.</p></div>
          <Link href="/nosotros/compromisos" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg shrink-0" style={{ background: '#dc2626', color: '#fff' }}>Ver todos los compromisos <ArrowRight size={15} /></Link>
        </div>
      </section>
      <footer style={{ background: '#0D1B2A', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#475569' }}>© 2026 Qoricash S.A.C. | RUC 20615113698 | Regulado por la SBS | <Link href="/terminos-condiciones" style={{ color: '#64748B' }}>Términos</Link> · <Link href="/politica-privacidad" style={{ color: '#64748B' }}>Privacidad</Link></p>
      </footer>
    </main>
  );
}
