import Link from 'next/link';
import { Shield, Zap, Users, Award, CheckCircle, MapPin, Building2, Phone, Mail, ArrowRight } from 'lucide-react';

export default function SobreNosotros() {
  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="QoriCash" style={{ height: 40 }} />
            <span className="font-display font-bold text-lg" style={{ color: '#fff' }}>QoriCash</span>
          </Link>
          <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.96) 0%, rgba(15,23,42,0.88) 60%, rgba(15,23,42,0.80) 100%)' }} />
        <div style={{ position: 'relative', padding: '56px 24px 48px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="reveal animate-fade-up" style={{ maxWidth: 640 }}>
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                Sobre Nosotros
              </span>
              <h1
                className="font-display font-black mb-3"
                style={{ color: '#fff', fontSize: 36, letterSpacing: '-0.025em', lineHeight: 1.15 }}
              >
                Tu casa de cambio digital<br />
                <span style={{ color: '#22C55E' }}>de confianza</span>
              </h1>
              <p className="text-sm" style={{ color: '#94A3B8', lineHeight: 1.75, maxWidth: 500 }}>
                En QoriCash transformamos la manera de cambiar divisas en el Perú,
                ofreciendo una experiencia 100% digital, segura y al mejor tipo de cambio del mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Misión & Visión ────────────────────────────────────── */}
      <section style={{ padding: '48px 24px', background: '#fff' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5 reveal animate-fade-up">

            {/* Misión */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px', borderLeft: '3px solid #22C55E' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award style={{ width: 16, height: 16, color: '#22C55E' }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#22C55E' }}>Nuestra</p>
                  <p className="font-black text-base" style={{ color: '#0D1B2A', letterSpacing: '-0.01em' }}>Misión</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                Democratizar el acceso a tipos de cambio justos y competitivos, eliminando las barreras
                tradicionales mediante una plataforma digital segura, rápida y transparente. Atendemos
                a cualquier persona identificada con DNI o Carnet de Extranjería, desde cualquier parte
                del mundo, siempre que cuente con una cuenta bancaria en el Perú.
              </p>
            </div>

            {/* Visión */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px', borderLeft: '3px solid #3B82F6' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap style={{ width: 16, height: 16, color: '#3B82F6' }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#3B82F6' }}>Nuestra</p>
                  <p className="font-black text-base" style={{ color: '#0D1B2A', letterSpacing: '-0.01em' }}>Visión</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                Ser la casa de cambio digital líder en el Perú, reconocida por nuestra innovación
                tecnológica, excelencia en el servicio y compromiso inquebrantable con la seguridad
                y satisfacción de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Image banner — equipo / confianza ──────────────────── */}
      <div style={{ padding: '0 24px' }}>
        <div className="max-w-5xl mx-auto reveal animate-fade-up">
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 130 }}>
            <img
              src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Equipo QoriCash"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,27,42,0.94) 0%, rgba(13,27,42,0.65) 55%, rgba(13,27,42,0.1) 100%)' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: '0 28px' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#22C55E' }}>Nuestro equipo</p>
                <p className="font-black text-lg" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Personas reales, servicio de excelencia</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Especialistas en mercado cambiario a tu disposición</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Valores ────────────────────────────────────────────── */}
      <section style={{ padding: '48px 24px', background: '#fff' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 reveal animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>Lo que nos define</p>
            <h2 className="font-black text-2xl" style={{ color: '#0D1B2A', letterSpacing: '-0.02em' }}>Nuestros Valores</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 reveal animate-fade-up stagger-1">
            {[
              { Icon: Shield,      accent: '#22C55E', label: 'Seguridad',     desc: 'Protegemos cada transacción con tecnología de vanguardia y los más altos estándares de seguridad digital.' },
              { Icon: Zap,         accent: '#F59E0B', label: 'Rapidez',       desc: 'Transferencias en menos de 10 minutos. Tu tiempo es valioso y lo respetamos.' },
              { Icon: CheckCircle, accent: '#3B82F6', label: 'Transparencia', desc: 'Sin comisiones ocultas. El tipo de cambio que ves es el tipo de cambio que obtienes.' },
              { Icon: Users,       accent: '#A78BFA', label: 'Confianza',     desc: 'Miles de clientes satisfechos respaldan nuestro compromiso con la excelencia.' },
            ].map(({ Icon, accent, label, desc }) => (
              <div
                key={label}
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '20px', borderTop: `3px solid ${accent}` }}
              >
                <div className="mb-3" style={{ width: 34, height: 34, borderRadius: 8, background: `${accent}14`, border: `1px solid ${accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 15, height: 15, color: accent }} />
                </div>
                <div className="font-black text-sm mb-2" style={{ color: '#0D1B2A' }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#E2E8F0', maxWidth: 900, margin: '0 auto' }} />

      {/* ── Por qué QoriCash ───────────────────────────────────── */}
      <section style={{ padding: '48px 24px', background: '#F8FAFC' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 reveal animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>Nuestras ventajas</p>
            <h2 className="font-black text-2xl" style={{ color: '#0D1B2A', letterSpacing: '-0.02em' }}>¿Por qué elegir QoriCash?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 reveal animate-fade-up stagger-1">
            {[
              { stat: 'Tipo preferencial', label: 'Mejor tipo de cambio',   desc: 'Tasas competitivas y transparentes, más rentables que casas de cambio tradicionales y bancos.' },
              { stat: 'Lunes a Sábado',    label: '100% digital',           desc: 'Opera desde cualquier lugar, sin desplazarte ni hacer colas.' },
              { stat: '< 10 minutos',      label: 'Transferencias rápidas', desc: 'Recibe tu dinero en tu cuenta bancaria en minutos.' },
              { stat: '100% seguro',       label: 'Seguridad garantizada',  desc: 'Encriptación de última generación y cumplimiento de normativas financieras.' },
              { stat: 'S/ 0 ocultos',      label: 'Sin comisiones',         desc: 'Total transparencia. Lo que ves en la cotización es lo que pagas.' },
              { stat: 'Soporte real',      label: 'Atención especializada', desc: 'Equipo disponible para ayudarte cuando lo necesites.' },
            ].map(({ stat, label, desc }) => (
              <div
                key={label}
                style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px' }}
              >
                <div className="font-black text-sm tabular-nums mb-1" style={{ color: '#22C55E', letterSpacing: '-0.01em' }}>{stat}</div>
                <div className="font-bold text-xs mb-2" style={{ color: '#0D1B2A' }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image banner — digital / fintech ───────────────────── */}
      <div style={{ padding: '0 24px' }}>
        <div className="max-w-5xl mx-auto reveal animate-fade-up">
          <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 120 }}>
            <img
              src="https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Persona operando desde laptop"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,27,42,0.93) 0%, rgba(13,27,42,0.6) 60%, rgba(13,27,42,0.05) 100%)' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%', padding: '0 28px' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#3B82F6' }}>100% digital</p>
                <p className="font-black text-lg" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Opera desde donde estés, sin colas</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Plataforma disponible las 24 horas del día</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Información Corporativa ────────────────────────────── */}
      <section style={{ padding: '48px 24px', background: '#fff' }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 reveal animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>Datos legales</p>
            <h2 className="font-black text-2xl" style={{ color: '#0D1B2A', letterSpacing: '-0.02em' }}>Información Corporativa</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 reveal animate-fade-up stagger-1">
            {/* Data fields */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
              {[
                { Icon: Building2, label: 'Razón Social',     value: 'QORICASH S.A.C.' },
                { Icon: Award,     label: 'Nombre Comercial', value: 'QORICASH FX'     },
                { Icon: CheckCircle, label: 'RUC',            value: '20615113698'      },
              ].map(({ Icon, label, value }, i, arr) => (
                <div
                  key={label}
                  className="flex items-center gap-3"
                  style={{ padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #E2E8F0' : 'none' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 14, height: 14, color: '#22C55E' }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>{label}</div>
                    <div className="font-bold text-sm" style={{ color: '#0D1B2A' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
              {[
                { Icon: MapPin,  label: 'Dirección',   value: 'Av. Brasil N° 2790, Int. 504\nLima – Pueblo Libre' },
                { Icon: Phone,   label: 'Teléfono',    value: '926 011 920'      },
                { Icon: Mail,    label: 'Correo',      value: 'info@qoricash.pe' },
              ].map(({ Icon, label, value }, i, arr) => (
                <div
                  key={label}
                  className="flex items-start gap-3"
                  style={{ padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #E2E8F0' : 'none' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Icon style={{ width: 14, height: 14, color: '#22C55E' }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>{label}</div>
                    <div className="font-bold text-sm" style={{ color: '#0D1B2A', whiteSpace: 'pre-line' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 48px' }}>
        <div className="max-w-5xl mx-auto reveal animate-fade-up">
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <img
              src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,18,35,0.97) 0%, rgba(15,23,42,0.92) 100%)' }} />
            <div style={{ position: 'relative', padding: '48px 40px', textAlign: 'center' }}>
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                ¿Listo para comenzar?
              </span>
              <h2
                className="font-black mb-3"
                style={{ color: '#fff', fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1.2 }}
              >
                Únete a quienes ya confían en QoriCash
              </h2>
              <p className="text-sm mb-8 mx-auto" style={{ color: '#94A3B8', maxWidth: 420, lineHeight: 1.7 }}>
                Miles de clientes cambian sus divisas con nosotros cada día. Seguro, rápido y sin sorpresas.
              </p>
              <Link
                href="/crear-cuenta"
                className="inline-flex items-center gap-2 font-bold text-sm"
                style={{ background: '#22C55E', color: '#fff', padding: '13px 28px', borderRadius: 10, boxShadow: '0 4px 16px rgba(34,197,94,0.35)' }}
              >
                Crear cuenta gratis
                <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px 32px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-3 hover:opacity-80 transition-opacity w-fit">
                <img src="/logo-principal.png" alt="QoriCash" style={{ height: 36 }} />
                <span className="font-display font-bold text-base" style={{ color: '#fff' }}>QoriCash</span>
              </Link>
              <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
                Casa de cambio online en Perú. Seguridad, rapidez y los mejores tipos de cambio.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Servicios</p>
              <ul className="space-y-1.5 text-xs">
                {[
                  ['/servicios#compra',      'Compra de dólares'],
                  ['/servicios#venta',       'Venta de dólares' ],
                  ['/servicios#tipo-cambio', 'Tipo de cambio'   ],
                ].map(([href, label]) => (
                  <li key={href}><Link href={href} className="transition-colors hover:text-white" style={{ color: '#475569' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Empresa</p>
              <ul className="space-y-1.5 text-xs">
                {[
                  ['/sobre-nosotros',       'Sobre nosotros'         ],
                  ['/terminos-condiciones', 'Términos y condiciones' ],
                  ['/politica-privacidad',  'Política de privacidad' ],
                  ['/politica-cookies',     'Política de cookies'    ],
                  ['/libro-reclamaciones',  'Libro de reclamaciones' ],
                ].map(([href, label]) => (
                  <li key={href}><Link href={href} className="transition-colors hover:text-white" style={{ color: '#475569' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Contacto</p>
              <ul className="space-y-2.5 text-xs" style={{ color: '#475569' }}>
                <li><a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors">info@qoricash.pe</a></li>
                <li><a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">926 011 920</a></li>
                <li style={{ lineHeight: 1.6 }}>Av. Brasil N° 2790, Int. 504<br />Lima – Pueblo Libre</li>
                <li style={{ lineHeight: 1.6 }}>Lun–Vie 9:00–18:00<br />Sáb 9:00–13:00</li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }} className="text-center">
            <p className="text-xs" style={{ color: '#334155' }}>© 2025 QoriCash. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
