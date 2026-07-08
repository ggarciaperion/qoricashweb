import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CheckCircle, ChevronRight, ArrowRight, Home, Smile, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conciliación Laboral y Bienestar | Qoricash',
  description:
    'Qoricash promueve el equilibrio entre la vida personal y profesional de sus colaboradores mediante políticas de flexibilidad, trabajo híbrido y bienestar integral.',
  openGraph: {
    title: 'Conciliación Laboral | Qoricash',
    url: 'https://www.qoricash.pe/nosotros/compromisos/conciliacion-laboral',
  },
};

const ACCIONES_ACTUALES = [
  'Modalidad de trabajo híbrida que permite a los colaboradores gestionar parte de sus tareas de forma remota.',
  'Horarios con cierto grado de flexibilidad para facilitar la gestión de compromisos personales y familiares.',
  'Cultura organizacional que no normaliza las horas extras sistemáticas como estándar de desempeño.',
  'Respeto efectivo de los períodos de vacaciones y descanso establecidos por ley.',
  'Comunicación interna que distingue entre lo urgente y lo importante, evitando la sobre-demanda fuera del horario laboral.',
];

const ACCIONES_FUTURAS = [
  'Formalizar una política de trabajo híbrido y remoto con lineamientos claros para todos los roles de la organización.',
  'Implementar encuestas periódicas de bienestar laboral para identificar áreas de mejora.',
  'Desarrollar un protocolo de desconexión digital que limite las comunicaciones laborales fuera del horario establecido.',
  'Explorar beneficios de bienestar como acceso a plataformas de salud mental, actividad física o apoyo emocional.',
  'Establecer lineamientos de licencias adicionales para situaciones de cuidado familiar.',
];

const KPIS = [
  { label: 'Porcentaje de colaboradores con acceso a modalidad híbrida', meta: 'Seguimiento semestral' },
  { label: 'Índice de satisfacción con el equilibrio vida-trabajo', meta: '≥ 7/10 en encuesta interna' },
  { label: 'Tasa de uso efectivo de vacaciones', meta: '100% de días asignados utilizados' },
  { label: 'Reportes de violación del protocolo de desconexión', meta: 'Seguimiento semestral' },
  { label: 'Rotación asociada a motivos de bienestar o carga laboral', meta: 'Seguimiento anual' },
];

const FAQ = [
  {
    q: '¿Qoricash ofrece trabajo remoto o híbrido?',
    a: 'Sí. Contamos con una modalidad de trabajo híbrida para la mayoría de los roles de la organización. La proporción de días remotos varía según el área y las necesidades operativas.',
  },
  {
    q: '¿Cómo gestiona Qoricash la carga de trabajo para evitar el burnout?',
    a: 'Fomentamos una cultura donde el volumen de trabajo es proporcional a los recursos disponibles. No normalizamos las horas extras como señal de compromiso, y promovemos la comunicación abierta sobre la carga de trabajo entre colaboradores y sus líderes.',
  },
  {
    q: '¿Existe una política formal de desconexión digital?',
    a: 'Actualmente manejamos este principio como parte de nuestra cultura. En los próximos meses formalizaremos una política de desconexión digital con lineamientos claros sobre comunicaciones fuera de horario.',
  },
  {
    q: '¿Qoricash ofrece beneficios de salud o bienestar?',
    a: 'Cumplimos con todas las obligaciones legales en materia de seguridad social. Adicionalmente, estamos explorando beneficios complementarios de bienestar para implementar en el corto plazo.',
  },
];

export default function ConciliacionLaboral() {
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
          <span style={{ color: '#8fb8cc' }}>Conciliación Laboral</span>
        </div>
      </div>
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Bienestar laboral Qoricash" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(15,5,30,0.97) 0%, rgba(25,10,42,0.90) 100%)' }} />
        <div style={{ position: 'relative', padding: '60px 24px 52px' }}>
          <div className="max-w-5xl mx-auto" style={{ maxWidth: 660 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(124,58,237,0.15)', color: '#C4B5FD', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Clock size={12} /> Bienestar Laboral
            </span>
            <h1 className="font-black mb-4" style={{ color: '#fff', fontSize: 38, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Conciliación laboral<br /><span style={{ color: '#C4B5FD' }}>y bienestar</span>
            </h1>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, maxWidth: 540, fontSize: 15 }}>
              Un equipo comprometido con su trabajo es, ante todo, un equipo que tiene
              espacio para su vida personal. En Qoricash creemos que el bienestar de
              las personas es una condición necesaria para la sostenibilidad del negocio.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-bold text-xl mb-4" style={{ color: '#0D1B2A' }}>Nuestra postura</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
              El sector fintech suele asociarse con dinámicas de alta presión, disponibilidad
              permanente y cultura del "siempre conectado". En Qoricash cuestionamos esa
              narrativa. Creemos que los mejores resultados se construyen desde el bienestar,
              no desde el agotamiento.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Nuestro tamaño como empresa nos permite construir una cultura laboral con
              intención. No somos una corporación con procesos rígidos: somos un equipo
              donde las conversaciones sobre carga de trabajo, flexibilidad y bienestar
              son bienvenidas y atendidas con seriedad.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[{ icon: Home, label: 'Trabajo híbrido' }, { icon: Calendar, label: 'Vacaciones respetadas' }, { icon: Smile, label: 'Cultura sin burnout' }, { icon: Clock, label: 'Desconexión digital' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <Icon size={16} color="#7C3AED" /><span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>{label}</span>
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
              { num: '01', texto: 'Garantizar que cada colaborador tenga tiempo y espacio real para su vida personal, familiar y de descanso.' },
              { num: '02', texto: 'Eliminar la cultura de horas extras sistemáticas como indicador de desempeño o compromiso.' },
              { num: '03', texto: 'Formalizar políticas de flexibilidad y trabajo híbrido que den previsibilidad a los colaboradores sobre su forma de trabajar.' },
              { num: '04', texto: 'Medir el bienestar laboral como un indicador de gestión, con la misma seriedad que los indicadores operativos.' },
            ].map((o) => (
              <div key={o.num} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderLeft: '3px solid #7C3AED' }}>
                <span className="text-xs font-black tracking-widest" style={{ color: '#7C3AED' }}>{o.num}</span>
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
              { titulo: 'El descanso es productivo', texto: 'Un colaborador descansado toma mejores decisiones, comete menos errores y permanece más tiempo en la organización.' },
              { titulo: 'Flexibilidad con responsabilidad', texto: 'La flexibilidad no es ausencia de estructura: es confiar en que cada persona cumple sus compromisos con autonomía.' },
              { titulo: 'Liderazgo con el ejemplo', texto: 'Los líderes de Qoricash modelan el equilibrio que esperamos de todo el equipo. No pedimos lo que no practicamos.' },
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
          <div><h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones actuales</h2><div className="flex flex-col gap-3">{ACCIONES_ACTUALES.map((a, i) => (<div key={i} className="flex items-start gap-3"><CheckCircle size={16} color="#7C3AED" className="mt-0.5 shrink-0" /><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div></div>
          <div><h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones futuras</h2><div className="flex flex-col gap-3">{ACCIONES_FUTURAS.map((a, i) => (<div key={i} className="flex items-start gap-3"><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} /></div><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div></div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Indicadores de seguimiento</h2>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#0D1B2A' }}><th className="text-left text-xs font-bold text-white px-4 py-3">Indicador (KPI)</th><th className="text-left text-xs font-bold text-white px-4 py-3">Referencia / Meta</th></tr></thead>
              <tbody>{KPIS.map((k, i) => (<tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><td className="text-sm px-4 py-3" style={{ color: '#475569' }}>{k.label}</td><td className="text-sm font-semibold px-4 py-3" style={{ color: '#7C3AED' }}>{k.meta}</td></tr>))}</tbody>
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
          <div><h2 className="font-bold text-xl mb-2" style={{ color: '#fff' }}>Explora nuestros otros compromisos</h2><p className="text-sm" style={{ color: '#94A3B8' }}>La conciliación laboral es uno de los cinco pilares de nuestra agenda corporativa.</p></div>
          <Link href="/nosotros/compromisos" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg shrink-0" style={{ background: '#7C3AED', color: '#fff' }}>Ver todos los compromisos <ArrowRight size={15} /></Link>
        </div>
      </section>
      <footer style={{ background: '#0D1B2A', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#475569' }}>© 2026 Qoricash S.A.C. | RUC 20615113698 | Regulado por la SBS | <Link href="/terminos-condiciones" style={{ color: '#64748B' }}>Términos</Link> · <Link href="/politica-privacidad" style={{ color: '#64748B' }}>Privacidad</Link></p>
      </footer>
    </main>
  );
}
