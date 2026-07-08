import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, CheckCircle, ChevronRight, ArrowRight, Zap, Globe, Recycle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sostenibilidad | Qoricash — Fintech comprometida con el medio ambiente',
  description:
    'Como fintech digital, Qoricash opera con una huella ambiental reducida y promueve prácticas sostenibles en su operación. Conoce nuestro compromiso ESG con el medio ambiente.',
  openGraph: {
    title: 'Sostenibilidad | Qoricash',
    url: 'https://www.qoricash.pe/nosotros/compromisos/sostenibilidad',
  },
};

const ACCIONES_ACTUALES = [
  'Operación 100% digital, eliminando el uso de papel en transacciones, contratos y comunicaciones con clientes.',
  'Infraestructura tecnológica basada en servicios cloud con proveedores certificados en eficiencia energética.',
  'Oficinas con prácticas básicas de gestión de residuos, ahorro energético y uso responsable de recursos.',
  'Uso de canales digitales como principal medio de comunicación interna y externa, reduciendo desplazamientos.',
  'Preferencia por proveedores de tecnología con políticas ambientales documentadas.',
];

const ACCIONES_FUTURAS = [
  'Medir y documentar la huella de carbono operativa anual de Qoricash como línea base.',
  'Establecer un plan de reducción de emisiones con metas específicas para el período 2026-2028.',
  'Implementar criterios ambientales formales en la evaluación y selección de proveedores.',
  'Desarrollar una política ambiental corporativa publicada en el sitio web.',
  'Explorar la compensación de emisiones residuales a través de programas de reforestación u otras iniciativas verificadas en el Perú.',
];

const KPIS = [
  { label: 'Porcentaje de operaciones sin uso de papel', meta: '100% (objetivo permanente)' },
  { label: 'Huella de carbono operativa anual (tCO₂e)', meta: 'Medición línea base 2026' },
  { label: 'Proveedores con política ambiental documentada', meta: 'Seguimiento anual' },
  { label: 'Consumo energético oficinas (kWh/año)', meta: 'Seguimiento y reducción progresiva' },
  { label: 'Residuos electrónicos gestionados correctamente', meta: '100% disposición adecuada' },
];

const FAQ = [
  {
    q: '¿Cómo contribuye Qoricash al medio ambiente siendo una empresa de servicios?',
    a: 'Al operar 100% de forma digital, eliminamos el papel en todas nuestras transacciones y comunicaciones. Nuestra infraestructura cloud reduce significativamente la huella de carbono frente a una operación física tradicional.',
  },
  {
    q: '¿Qoricash tiene certificaciones ambientales?',
    a: 'Actualmente no contamos con certificaciones ambientales formales. Nuestro primer paso es medir nuestra huella de carbono como base para establecer metas creíbles y verificables.',
  },
  {
    q: '¿Por qué es relevante la sostenibilidad para una fintech?',
    a: 'El sector financiero tiene un rol clave en la transición hacia una economía sostenible. Aunque nuestra huella directa es limitada, establecer prácticas responsables desde etapas tempranas permite escalar correctamente a medida que crecemos.',
  },
  {
    q: '¿Cómo puedo conocer el avance de los compromisos ambientales de Qoricash?',
    a: 'Publicaremos actualizaciones anuales de nuestros indicadores ambientales en esta sección del sitio web. La transparencia es un principio central de nuestra cultura corporativa.',
  },
];

export default function Sostenibilidad() {
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
          <span style={{ color: '#8fb8cc' }}>Sostenibilidad</span>
        </div>
      </div>
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Sostenibilidad Qoricash" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(5,30,15,0.97) 0%, rgba(10,30,20,0.90) 100%)' }} />
        <div style={{ position: 'relative', padding: '60px 24px 52px' }}>
          <div className="max-w-5xl mx-auto" style={{ maxWidth: 660 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(22,163,74,0.15)', color: '#4ADE80', border: '1px solid rgba(22,163,74,0.3)' }}>
              <Leaf size={12} /> ESG — Medio Ambiente
            </span>
            <h1 className="font-black mb-4" style={{ color: '#fff', fontSize: 38, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Sostenibilidad<br /><span style={{ color: '#4ADE80' }}>ambiental</span>
            </h1>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, maxWidth: 540, fontSize: 15 }}>
              Ser una empresa digital nos da una ventaja natural: una huella ambiental
              reducida. Nuestra responsabilidad es ampliar esa ventaja con prácticas
              deliberadas y metas medibles.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-bold text-xl mb-4" style={{ color: '#0D1B2A' }}>Nuestra postura</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
              Qoricash opera enteramente en el entorno digital. Esta condición nos permite
              ofrecer un servicio financiero con una huella ambiental significativamente
              menor que la de una institución financiera tradicional con sucursales físicas
              y operaciones en papel.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              Nuestro compromiso ambiental parte del reconocimiento honesto de dónde
              estamos: somos una empresa en crecimiento, con recursos limitados, que
              asume compromisos realistas y verificables. No hacemos promesas vacías,
              pero sí asumimos el reto de mejorar de forma continua y medible.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[{ icon: Zap, label: 'Operación 100% digital' }, { icon: Globe, label: 'Infraestructura cloud' }, { icon: Recycle, label: 'Sin papel en operaciones' }, { icon: Leaf, label: 'Huella reducida por diseño' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}>
                <Icon size={16} color="#16a34a" /><span className="text-sm font-medium" style={{ color: '#0D1B2A' }}>{label}</span>
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
              { num: '01', texto: 'Mantener el modelo de operación 100% digital como estándar permanente, eliminando el papel de todos los procesos.' },
              { num: '02', texto: 'Medir nuestra huella de carbono operativa anual para establecer una línea base y metas de reducción creíbles.' },
              { num: '03', texto: 'Incorporar criterios ambientales en la selección de proveedores tecnológicos y de servicios.' },
              { num: '04', texto: 'Desarrollar y publicar una política ambiental corporativa formal en el período 2026-2027.' },
            ].map((o) => (
              <div key={o.num} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderLeft: '3px solid #16a34a' }}>
                <span className="text-xs font-black tracking-widest" style={{ color: '#16a34a' }}>{o.num}</span>
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
              { titulo: 'Honestidad sobre el punto de partida', texto: 'Reconocemos que somos una empresa pequeña. Nuestros compromisos son proporcionales a nuestra escala y realistas en sus plazos.' },
              { titulo: 'Digital por defecto', texto: 'La digitalización no es solo una ventaja competitiva: es nuestra contribución más directa a la reducción de impacto ambiental.' },
              { titulo: 'Progreso verificable', texto: 'Cada compromiso ambiental debe poder medirse. Publicamos indicadores y no avanzamos afirmaciones que no podamos respaldar con datos.' },
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
          <div><h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones actuales</h2><div className="flex flex-col gap-3">{ACCIONES_ACTUALES.map((a, i) => (<div key={i} className="flex items-start gap-3"><CheckCircle size={16} color="#16a34a" className="mt-0.5 shrink-0" /><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div></div>
          <div><h2 className="font-bold text-xl mb-5" style={{ color: '#0D1B2A' }}>Acciones futuras</h2><div className="flex flex-col gap-3">{ACCIONES_FUTURAS.map((a, i) => (<div key={i} className="flex items-start gap-3"><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} /></div><p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{a}</p></div>))}</div></div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '48px 24px', borderTop: '1px solid #E2E8F0' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-xl mb-6" style={{ color: '#0D1B2A' }}>Indicadores de seguimiento</h2>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#0D1B2A' }}><th className="text-left text-xs font-bold text-white px-4 py-3">Indicador (KPI)</th><th className="text-left text-xs font-bold text-white px-4 py-3">Referencia / Meta</th></tr></thead>
              <tbody>{KPIS.map((k, i) => (<tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><td className="text-sm px-4 py-3" style={{ color: '#475569' }}>{k.label}</td><td className="text-sm font-semibold px-4 py-3" style={{ color: '#16a34a' }}>{k.meta}</td></tr>))}</tbody>
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

      <section style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', padding: '48px 24px' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div><h2 className="font-bold text-xl mb-2" style={{ color: '#fff' }}>Explora nuestros otros compromisos</h2><p className="text-sm" style={{ color: '#86EFAC' }}>La sostenibilidad es uno de los cinco pilares de nuestra agenda corporativa.</p></div>
          <Link href="/nosotros/compromisos" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg shrink-0" style={{ background: '#16a34a', color: '#fff' }}>Ver todos los compromisos <ArrowRight size={15} /></Link>
        </div>
      </section>

      <footer style={{ background: '#0D1B2A', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#475569' }}>© 2026 Qoricash S.A.C. | RUC 20615113698 | Regulado por la SBS | <Link href="/terminos-condiciones" style={{ color: '#64748B' }}>Términos</Link> · <Link href="/politica-privacidad" style={{ color: '#64748B' }}>Privacidad</Link></p>
      </footer>
    </main>
  );
}
