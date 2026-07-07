'use client';

import Link from 'next/link';
import { FileText, Scale, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';

const FOOTER_LINKS = {
  servicios: [['/servicios#compra','Compra de dólares'],['/servicios#venta','Venta de dólares'],['/servicios#tipo-cambio','Tipo de cambio']],
  empresa: [['/sobre-nosotros','Sobre nosotros'],['/terminos-condiciones','Términos y condiciones'],['/politica-privacidad','Política de privacidad'],['/politica-cookies','Política de cookies'],['/libro-reclamaciones','Libro de reclamaciones']],
};

function PageFooter() {
  return (
    <footer style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px 32px' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3 hover:opacity-80 transition-opacity w-fit">
              <img src="/logo-principal.png" alt="QoriCash" style={{ height: 36 }} />
              <span className="font-display font-bold text-base" style={{ color: '#fff' }}>QoriCash</span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>Casa de cambio online en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Servicios</p>
            <ul className="space-y-1.5 text-xs">
              {FOOTER_LINKS.servicios.map(([href, label]) => <li key={href}><Link href={href} className="transition-colors hover:text-white" style={{ color: '#475569' }}>{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Empresa</p>
            <ul className="space-y-1.5 text-xs">
              {FOOTER_LINKS.empresa.map(([href, label]) => <li key={href}><Link href={href} className="transition-colors hover:text-white" style={{ color: '#475569' }}>{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Contacto</p>
            <ul className="space-y-2.5 text-xs" style={{ color: '#475569' }}>
              <li><a href="mailto:info@qoricash.pe" className="hover:text-white transition-colors">info@qoricash.pe</a></li>
              <li><a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">910 624 404</a></li>
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
  );
}

export default function TerminosCondiciones() {
  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="QoriCash" style={{ height: 40 }} />
            <span className="font-display font-bold text-lg" style={{ color: '#fff' }}>QoriCash</span>
          </Link>
          <Link href="/" className="text-xs font-medium" style={{ color: '#64748B' }}>← Inicio</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.97) 0%, rgba(15,23,42,0.93) 100%)' }} />
        <div style={{ position: 'relative', padding: '44px 24px 36px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Scale style={{ width: 20, height: 20, color: '#22C55E' }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#22C55E' }}>Documentos legales</p>
                <h1 className="font-black text-2xl" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Términos y Condiciones</h1>
              </div>
            </div>
            <p className="text-xs mt-3 ml-14" style={{ color: '#475569' }}>Última actualización: Diciembre 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '32px 24px 48px' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px 36px' }}>

            {/* Intro */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
                Bienvenido a <strong style={{ color: '#0D1B2A' }}>QoriCash</strong>. Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma digital de casa de cambio operada por <strong style={{ color: '#0D1B2A' }}>QORICASH S.A.C.</strong> (RUC: 20615113698), con nombre comercial <strong style={{ color: '#0D1B2A' }}>QORICASH FX</strong>.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                Al acceder y utilizar nuestros servicios, usted acepta expresamente estos Términos. Si no está de acuerdo con alguna disposición, deberá abstenerse de utilizar la plataforma.
              </p>
            </div>

            {/* Sections */}
            {[
              {
                num: '01', Icon: FileText, title: 'Definiciones',
                content: (
                  <div className="space-y-2">
                    {[
                      ['Plataforma', 'Sitio web y aplicación móvil de QoriCash'],
                      ['Usuario', 'Persona natural o jurídica que se registra y utiliza los servicios'],
                      ['Operación', 'Transacción de compra o venta de divisas realizada a través de la plataforma'],
                      ['Tipo de Cambio', 'Valor de conversión entre monedas vigente al momento de la operación'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
                        <span className="font-bold text-xs flex-shrink-0" style={{ color: '#0D1B2A' }}>{k}:</span>
                        <span className="text-xs" style={{ color: '#475569' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                num: '02', Icon: CheckCircle, title: 'Servicios Ofrecidos',
                content: (
                  <div className="text-sm" style={{ color: '#475569' }}>
                    <p className="mb-3">QoriCash ofrece los siguientes servicios de casa de cambio digital:</p>
                    <ul className="space-y-1.5 ml-3">
                      {['Compra de dólares estadounidenses (USD)','Venta de dólares estadounidenses (USD)','Cotización en tiempo real del tipo de cambio','Transferencias bancarias en soles (PEN) y dólares (USD)','Consulta de historial de operaciones'].map(i => (
                        <li key={i} className="flex items-start gap-2"><span style={{ color: '#22C55E', flexShrink: 0 }}>·</span>{i}</li>
                      ))}
                    </ul>
                  </div>
                )
              },
              {
                num: '03', Icon: Shield, title: 'Registro y Cuenta de Usuario',
                content: (
                  <div className="space-y-4 text-sm" style={{ color: '#475569' }}>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>3.1 Requisitos de Registro</p>
                      <p className="mb-2">Para utilizar nuestros servicios, el usuario debe:</p>
                      <ul className="space-y-1 ml-3">
                        {['Ser mayor de 18 años','Proporcionar información veraz, completa y actualizada','Completar el proceso de verificación de identidad (KYC)','Aceptar estos Términos y la Política de Privacidad'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#22C55E' }}>·</span>{i}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>3.2 Seguridad de la Cuenta</p>
                      <p className="mb-2">El usuario es responsable de:</p>
                      <ul className="space-y-1 ml-3">
                        {['Mantener la confidencialidad de sus credenciales de acceso','Notificar inmediatamente cualquier uso no autorizado de su cuenta','Cerrar sesión al finalizar cada uso de la plataforma'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#22C55E' }}>·</span>{i}</li>)}
                      </ul>
                    </div>
                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderLeft: '3px solid #F59E0B', borderRadius: 8, padding: '12px 14px' }}>
                      <p className="text-xs" style={{ color: '#92400E' }}><strong>Importante:</strong> QoriCash no se hace responsable por el uso indebido de credenciales compartidas voluntariamente por el usuario.</p>
                    </div>
                  </div>
                )
              },
              {
                num: '04', Icon: Scale, title: 'Proceso de Operaciones',
                content: (
                  <div className="space-y-4 text-sm" style={{ color: '#475569' }}>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>4.1 Cotización</p>
                      <p>El tipo de cambio mostrado es referencial y puede variar según las condiciones del mercado. El tipo de cambio aplicable será el vigente al momento de confirmar la operación.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>4.2 Confirmación de Operación</p>
                      <p className="mb-2">Una vez confirmada una operación:</p>
                      <ul className="space-y-1 ml-3">
                        {['El tipo de cambio queda bloqueado por un tiempo determinado','El usuario debe realizar la transferencia bancaria según las instrucciones proporcionadas','La operación se completa al validar el depósito bancario'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#22C55E' }}>·</span>{i}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>4.3 Tiempos de Procesamiento</p>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px' }} className="space-y-2">
                        <p><strong style={{ color: '#0D1B2A' }}>Transferencias inmediatas:</strong> Menos de 10 minutos (BCP, Interbank)</p>
                        <p><strong style={{ color: '#0D1B2A' }}>Transferencias interbancarias:</strong> Hasta 2 horas hábiles (BBVA, Scotiabank y otros)</p>
                      </div>
                    </div>
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '3px solid #EF4444', borderRadius: 8, padding: '12px 14px' }}>
                      <p className="text-xs" style={{ color: '#991B1B' }}><strong>Nota:</strong> Los tiempos pueden variar según la disponibilidad de los sistemas bancarios y horarios de cada entidad financiera.</p>
                    </div>
                  </div>
                )
              },
              {
                num: '05', Icon: XCircle, title: 'Cancelaciones y Reembolsos',
                content: (
                  <div className="space-y-4 text-sm" style={{ color: '#475569' }}>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>5.1 Cancelación por el Usuario</p>
                      <p>El usuario puede cancelar una operación antes de realizar la transferencia bancaria. Una vez efectuada la transferencia, la operación no puede cancelarse.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>5.2 Rechazo de Operaciones</p>
                      <p className="mb-2">QoriCash se reserva el derecho de rechazar operaciones en los siguientes casos:</p>
                      <ul className="space-y-1 ml-3">
                        {['Información de usuario incompleta o no verificada','Sospecha de actividades fraudulentas o lavado de activos','Incumplimiento de requisitos normativos','Problemas técnicos en la plataforma o sistemas bancarios'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#EF4444' }}>·</span>{i}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>5.3 Reembolsos</p>
                      <p>En caso de cancelación o rechazo después de recibir la transferencia, el reembolso se realizará a la misma cuenta bancaria de origen dentro de las 24-48 horas hábiles.</p>
                    </div>
                  </div>
                )
              },
              {
                num: '06', Icon: AlertTriangle, title: 'Prohibiciones y Uso Indebido',
                content: (
                  <div className="space-y-3 text-sm" style={{ color: '#475569' }}>
                    <p>Está estrictamente prohibido:</p>
                    <div className="space-y-2">
                      {[
                        ['Lavado de activos', 'Utilizar la plataforma para operaciones relacionadas con actividades ilícitas'],
                        ['Fraude', 'Proporcionar información falsa o documentos adulterados'],
                        ['Múltiples cuentas', 'Crear más de una cuenta por usuario sin autorización'],
                        ['Manipulación', 'Intentar alterar el funcionamiento de la plataforma o explotar vulnerabilidades'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-start gap-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px' }}>
                          <XCircle style={{ width: 14, height: 14, color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
                          <p><strong style={{ color: '#991B1B' }}>{k}:</strong> {v}</p>
                        </div>
                      ))}
                    </div>
                    <p>El incumplimiento resultará en la suspensión inmediata de la cuenta y notificación a las autoridades competentes.</p>
                  </div>
                )
              },
            ].map(({ num, Icon, title, content }) => (
              <div key={num} style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace' }}>{num}</span>
                  <h2 className="font-black text-base" style={{ color: '#0D1B2A', letterSpacing: '-0.01em' }}>{title}</h2>
                </div>
                {content}
              </div>
            ))}

            {/* Remaining text sections */}
            {[
              { num: '07', title: 'Comisiones y Tarifas', body: 'QoriCash opera con total transparencia. El tipo de cambio mostrado ya incluye nuestro margen. No cobramos comisiones adicionales ocultas.', note: { type: 'green', text: 'Garantía de transparencia: El monto que ves en la cotización es exactamente lo que recibirás o pagarás, sin sorpresas.' } },
              { num: '08', title: 'Limitación de Responsabilidad', items: ['Demoras en transferencias bancarias causadas por terceros (bancos, sistemas de pago)','Pérdidas derivadas de decisiones de inversión basadas en tipos de cambio','Interrupciones del servicio por mantenimiento programado o casos de fuerza mayor','Errores del usuario al proporcionar datos de cuentas bancarias','Fluctuaciones normales del mercado cambiario'] },
              { num: '09', title: 'Cumplimiento Normativo', items: ['Ley N° 27693: Ley de Protección al Consumidor','Ley N° 29733: Ley de Protección de Datos Personales','Normativa SBS: Prevención de Lavado de Activos y Financiamiento del Terrorismo (LAFT)','Resoluciones SUNAT: Obligaciones tributarias aplicables'], extra: 'Nos reservamos el derecho de solicitar información adicional para dar cumplimiento a nuestras obligaciones de debida diligencia.' },
              { num: '10', title: 'Propiedad Intelectual', body: 'Todos los contenidos de la plataforma (logotipos, diseños, textos, código, bases de datos) son propiedad exclusiva de QORICASH S.A.C. o sus licenciantes. Queda prohibida su reproducción, distribución o uso sin autorización expresa.' },
              { num: '11', title: 'Modificaciones de los Términos', body: 'QoriCash se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios serán notificados a través de la plataforma y/o correo electrónico. El uso continuado de los servicios después de las modificaciones constituye aceptación de los nuevos términos.' },
              { num: '12', title: 'Resolución de Controversias', body: 'Cualquier controversia derivada de estos Términos se resolverá inicialmente mediante negociación directa. De no alcanzarse un acuerdo, las partes se someterán a la jurisdicción de los tribunales de Lima, Perú.' },
              { num: '13', title: 'Contacto y Atención al Cliente', items: ['Correo electrónico: info@qoricash.pe','Teléfono: 910 624 404','Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM'], extra: 'Nos comprometemos a responder todas las consultas dentro de las 24 horas hábiles.' },
            ].map(({ num, title, body, items, note, extra }: any) => (
              <div key={num} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace' }}>{num}</span>
                  <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>{title}</h2>
                </div>
                <div className="text-sm" style={{ color: '#475569' }}>
                  {body && <p className="leading-relaxed">{body}</p>}
                  {items && <ul className="space-y-1 mt-2 ml-3">{items.map((i: string) => <li key={i} className="flex gap-2"><span style={{ color: '#22C55E', flexShrink: 0 }}>·</span>{i}</li>)}</ul>}
                  {extra && <p className="mt-3 leading-relaxed">{extra}</p>}
                  {note && (
                    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderLeft: '3px solid #22C55E', borderRadius: 8, padding: '12px 14px', marginTop: 12 }}>
                      <p className="text-xs" style={{ color: '#166534' }}>{note.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Legal info box */}
            <div style={{ background: '#0D1B2A', borderRadius: 12, padding: '24px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#22C55E' }}>Información Legal</p>
              <div className="space-y-2 text-xs" style={{ color: '#94A3B8' }}>
                {[['Razón Social','QORICASH S.A.C.'],['RUC','20615113698'],['Nombre Comercial','QORICASH FX'],['Dirección','Av. Brasil N° 2790, Int. 504, Lima – Pueblo Libre'],['Correo Electrónico','info@qoricash.pe'],['Teléfono','910 624 404']].map(([k,v]) => (
                  <div key={k} className="flex gap-2"><span style={{ color: '#475569', flexShrink: 0 }}>{k}:</span><span style={{ color: '#CBD5E1' }}>{v}</span></div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 16, paddingTop: 14 }}>
                <p className="text-xs" style={{ color: '#475569' }}>Al utilizar los servicios de QoriCash, usted declara haber leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
