'use client';

import Link from 'next/link';
import { FileText, Scale, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';

export default function TerminosCondiciones() {
  return (
    <main className="min-h-screen pt-[80px]" style={{ background: '#F8FAFC' }}>

      <SiteNav />

      {/* Hero */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '32px 24px 28px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Scale style={{ width: 20, height: 20, color: '#2563EB' }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#2563EB' }}>Documentos legales</p>
              <h1 className="font-black text-2xl" style={{ color: '#0D1117', letterSpacing: '-0.02em' }}>Términos y Condiciones</h1>
            </div>
          </div>
          <p className="text-xs mt-3 ml-14" style={{ color: '#6B7280' }}>Última actualización: Diciembre 2025</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '32px 24px 48px' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px 36px' }}>

            {/* Intro */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
                Bienvenido a <strong style={{ color: '#0D1B2A' }}>Qoricash</strong>. Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma digital de casa de cambio operada por <strong style={{ color: '#0D1B2A' }}>QORICASH S.A.C.</strong> (RUC: 20615113698), con nombre comercial <strong style={{ color: '#0D1B2A' }}>QORICASH FX</strong>.
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
                      ['Plataforma', 'Sitio web y aplicación móvil de Qoricash'],
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
                    <p className="mb-3">Qoricash ofrece los siguientes servicios de casa de cambio digital:</p>
                    <ul className="space-y-1.5 ml-3">
                      {['Compra de dólares estadounidenses (USD)','Venta de dólares estadounidenses (USD)','Cotización en tiempo real del tipo de cambio','Transferencias bancarias en soles (PEN) y dólares (USD)','Consulta de historial de operaciones'].map(i => (
                        <li key={i} className="flex items-start gap-2"><span style={{ color: '#2563EB', flexShrink: 0 }}>·</span>{i}</li>
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
                        {['Ser mayor de 18 años','Proporcionar información veraz, completa y actualizada','Completar el proceso de verificación de identidad (KYC)','Aceptar estos Términos y la Política de Privacidad'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#2563EB' }}>·</span>{i}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: '#0D1B2A' }}>3.2 Seguridad de la Cuenta</p>
                      <p className="mb-2">El usuario es responsable de:</p>
                      <ul className="space-y-1 ml-3">
                        {['Mantener la confidencialidad de sus credenciales de acceso','Notificar inmediatamente cualquier uso no autorizado de su cuenta','Cerrar sesión al finalizar cada uso de la plataforma'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#2563EB' }}>·</span>{i}</li>)}
                      </ul>
                    </div>
                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderLeft: '3px solid #F59E0B', borderRadius: 8, padding: '12px 14px' }}>
                      <p className="text-xs" style={{ color: '#92400E' }}><strong>Importante:</strong> Qoricash no se hace responsable por el uso indebido de credenciales compartidas voluntariamente por el usuario.</p>
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
                        {['El tipo de cambio queda bloqueado por un tiempo determinado','El usuario debe realizar la transferencia bancaria según las instrucciones proporcionadas','La operación se completa al validar el depósito bancario'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#2563EB' }}>·</span>{i}</li>)}
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
                      <p className="mb-2">Qoricash se reserva el derecho de rechazar operaciones en los siguientes casos:</p>
                      <ul className="space-y-1 ml-3">
                        {['Información de usuario incompleta o no verificada','Sospecha de actividades fraudulentas o lavado de activos','Incumplimiento de requisitos normativos','Problemas técnicos en la plataforma o sistemas bancarios'].map(i => <li key={i} className="flex gap-2"><span style={{ color: '#DC2626' }}>·</span>{i}</li>)}
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
                          <XCircle style={{ width: 14, height: 14, color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
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
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>{num}</span>
                  <h2 className="font-black text-base" style={{ color: '#0D1B2A', letterSpacing: '-0.01em' }}>{title}</h2>
                </div>
                {content}
              </div>
            ))}

            {/* Remaining text sections */}
            {[
              { num: '07', title: 'Comisiones y Tarifas', body: 'Qoricash opera con total transparencia. El tipo de cambio mostrado ya incluye nuestro margen. No cobramos comisiones adicionales ocultas.', note: { type: 'green', text: 'Garantía de transparencia: El monto que ves en la cotización es exactamente lo que recibirás o pagarás, sin sorpresas.' } },
              { num: '08', title: 'Limitación de Responsabilidad', items: ['Demoras en transferencias bancarias causadas por terceros (bancos, sistemas de pago)','Pérdidas derivadas de decisiones de inversión basadas en tipos de cambio','Interrupciones del servicio por mantenimiento programado o casos de fuerza mayor','Errores del usuario al proporcionar datos de cuentas bancarias','Fluctuaciones normales del mercado cambiario'] },
              { num: '09', title: 'Cumplimiento Normativo', items: ['Ley N° 27693: Ley de Protección al Consumidor','Ley N° 29733: Ley de Protección de Datos Personales','Normativa SBS: Prevención de Lavado de Activos y Financiamiento del Terrorismo (LAFT)','Resoluciones SUNAT: Obligaciones tributarias aplicables'], extra: 'Nos reservamos el derecho de solicitar información adicional para dar cumplimiento a nuestras obligaciones de debida diligencia.' },
              { num: '10', title: 'Propiedad Intelectual', body: 'Todos los contenidos de la plataforma (logotipos, diseños, textos, código, bases de datos) son propiedad exclusiva de QORICASH S.A.C. o sus licenciantes. Queda prohibida su reproducción, distribución o uso sin autorización expresa.' },
              { num: '11', title: 'Modificaciones de los Términos', body: 'Qoricash se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios serán notificados a través de la plataforma y/o correo electrónico. El uso continuado de los servicios después de las modificaciones constituye aceptación de los nuevos términos.' },
              { num: '12', title: 'Resolución de Controversias', body: 'Cualquier controversia derivada de estos Términos se resolverá inicialmente mediante negociación directa. De no alcanzarse un acuerdo, las partes se someterán a la jurisdicción de los tribunales de Lima, Perú.' },
              { num: '13', title: 'Contacto y Atención al Cliente', items: ['Correo electrónico: info@qoricash.pe','Teléfono: 910 624 404','Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM'], extra: 'Nos comprometemos a responder todas las consultas dentro de las 24 horas hábiles.' },
            ].map(({ num, title, body, items, note, extra }: any) => (
              <div key={num} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>{num}</span>
                  <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>{title}</h2>
                </div>
                <div className="text-sm" style={{ color: '#475569' }}>
                  {body && <p className="leading-relaxed">{body}</p>}
                  {items && <ul className="space-y-1 mt-2 ml-3">{items.map((i: string) => <li key={i} className="flex gap-2"><span style={{ color: '#2563EB', flexShrink: 0 }}>·</span>{i}</li>)}</ul>}
                  {extra && <p className="mt-3 leading-relaxed">{extra}</p>}
                  {note && (
                    <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', borderLeft: '3px solid #2563EB', borderRadius: 8, padding: '12px 14px', marginTop: 12 }}>
                      <p className="text-xs" style={{ color: '#1e40af' }}>{note.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Legal info box */}
            <div style={{ background: '#0A0A0A', borderRadius: 12, padding: '24px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#2563EB' }}>Información Legal</p>
              <div className="space-y-2 text-xs" style={{ color: '#94A3B8' }}>
                {[['Razón Social','QORICASH S.A.C.'],['RUC','20615113698'],['Nombre Comercial','QORICASH FX'],['Dirección','Av. Brasil N° 2790, Int. 504, Lima – Pueblo Libre'],['Correo Electrónico','info@qoricash.pe'],['Teléfono','910 624 404']].map(([k,v]) => (
                  <div key={k} className="flex gap-2"><span style={{ color: '#475569', flexShrink: 0 }}>{k}:</span><span style={{ color: '#CBD5E1' }}>{v}</span></div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 16, paddingTop: 14 }}>
                <p className="text-xs" style={{ color: '#475569' }}>Al utilizar los servicios de Qoricash, usted declara haber leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
