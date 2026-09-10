'use client';

import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import { Cookie, CheckCircle, Settings, BarChart3, Shield, Info } from 'lucide-react';

export default function PoliticaCookies() {
  return (
    <main className="min-h-screen pt-[80px]" style={{ background: '#F8FAFC' }}>
      <SiteNav />
      {/* Hero */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '32px 24px 28px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Cookie style={{ width: 20, height: 20, color: '#2563EB' }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#2563EB' }}>Documentos legales</p>
              <h1 className="font-black text-2xl" style={{ color: '#0D1117', letterSpacing: '-0.02em' }}>Política de Cookies</h1>
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
                En <strong style={{ color: '#0D1B2A' }}>QORICASH S.A.C.</strong>, utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma, garantizar la seguridad de tus operaciones y optimizar el funcionamiento de nuestros servicios.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                Esta Política te explica de manera clara y transparente qué son las cookies, cómo las utilizamos y cómo puedes gestionarlas.
              </p>
            </div>

            {/* Section 1 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>01</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>¿Qué son las cookies?</h2>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias, faciliten la navegación y mejoren tu experiencia de usuario.
              </p>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: '3px solid #3B82F6', borderRadius: 8, padding: '14px 16px' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#0D1B2A' }}>Ejemplo práctico</p>
                <p className="text-xs" style={{ color: '#475569' }}>Cuando inicias sesión en Qoricash, una cookie guarda esa información para que no tengas que volver a ingresar tus credenciales cada vez que cambias de página.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>02</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Tipos de cookies que utilizamos</h2>
              </div>
              <div className="space-y-3">
                {[
                  { Icon: Shield,   accent: '#22C55E', title: 'Cookies Necesarias (Esenciales)', desc: 'Son imprescindibles para el correcto funcionamiento de la plataforma. Sin ellas, no podrías realizar operaciones, iniciar sesión o navegar de forma segura.', items: ['Autenticación y gestión de sesiones','Seguridad y prevención de fraudes','Funcionalidad básica del sitio web'], note: 'No pueden ser desactivadas ya que son necesarias para que la plataforma funcione.' },
                  { Icon: Settings, accent: '#3B82F6', title: 'Cookies Funcionales', desc: 'Permiten personalizar tu experiencia recordando tus preferencias y configuraciones.', items: ['Recordar idioma preferido','Guardar preferencias de visualización','Mantener configuraciones personalizadas'] },
                  { Icon: BarChart3, accent: '#A78BFA', title: 'Cookies Analíticas', desc: 'Nos ayudan a entender cómo los usuarios interactúan con nuestra plataforma para mejorarla continuamente.', items: ['Medir el rendimiento del sitio web','Comprender patrones de navegación','Identificar áreas de mejora','Generar estadísticas de uso'], note: 'Los datos recopilados son anónimos y se utilizan únicamente con fines de mejora del servicio.' },
                ].map(({ Icon, accent, title, desc, items, note }) => (
                  <div key={title} style={{ background: '#F8FAFC', border: `1px solid ${accent}22`, borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: '16px 18px' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon style={{ width: 14, height: 14, color: accent, flexShrink: 0 }} />
                      <p className="font-bold text-sm" style={{ color: '#0D1B2A' }}>{title}</p>
                    </div>
                    <p className="text-xs mb-2" style={{ color: '#475569' }}>{desc}</p>
                    <ul className="space-y-1 mb-2">
                      {items.map(i => <li key={i} className="flex gap-2 text-xs" style={{ color: '#64748B' }}><span style={{ color: accent }}>·</span>{i}</li>)}
                    </ul>
                    {note && <p className="text-xs" style={{ color: '#94A3B8' }}><strong>Nota:</strong> {note}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>03</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Gestión de cookies</h2>
              </div>
              <p className="text-sm mb-4" style={{ color: '#475569' }}>Puedes configurar tu navegador para aceptar, rechazar o recibir notificaciones sobre el uso de cookies.</p>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {[
                  ['Google Chrome', 'Configuración → Privacidad y seguridad → Cookies y otros datos de sitios'],
                  ['Mozilla Firefox', 'Opciones → Privacidad y seguridad → Cookies y datos del sitio'],
                  ['Safari', 'Preferencias → Privacidad → Cookies y datos de sitios web'],
                  ['Microsoft Edge', 'Configuración → Privacidad, búsqueda y servicios → Cookies y permisos'],
                ].map(([browser, path]) => (
                  <div key={browser} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
                    <p className="font-bold text-xs mb-1" style={{ color: '#0D1B2A' }}>{browser}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{path}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderLeft: '3px solid #F59E0B', borderRadius: 8, padding: '12px 14px' }}>
                <p className="text-xs" style={{ color: '#92400E' }}><strong>Importante:</strong> Si desactivas las cookies necesarias, algunas funcionalidades de la plataforma podrían no estar disponibles o no funcionar correctamente.</p>
              </div>
            </div>

            {/* Sections 4-7 */}
            {[
              {
                num: '04', title: 'Duración de las cookies',
                custom: (
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      ['Cookies de sesión', 'Son temporales y se eliminan automáticamente cuando cierras tu navegador. Se utilizan para mantener tu sesión activa mientras navegas.'],
                      ['Cookies persistentes', 'Permanecen en tu dispositivo durante un período determinado para recordar tus preferencias en futuras visitas.'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px' }}>
                        <p className="font-bold text-xs mb-1.5" style={{ color: '#0D1B2A' }}>{k}</p>
                        <p className="text-xs" style={{ color: '#475569' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                num: '05', title: 'Cookies de terceros',
                body: 'En ocasiones, utilizamos servicios de terceros que pueden instalar sus propias cookies para proporcionarnos herramientas de análisis o funcionalidades adicionales. Estos terceros tienen sus propias políticas de privacidad.',
                items: ['Google Analytics (análisis de tráfico web)','Servicios de mapas y geolocalización','Herramientas de atención al cliente'],
              },
              {
                num: '06', title: 'Actualización de esta política',
                body: 'Qoricash puede actualizar esta Política periódicamente para reflejar cambios en nuestras prácticas o requisitos legales. Te recomendamos revisar esta página regularmente para estar informado sobre cómo utilizamos las cookies.',
              },
              {
                num: '07', title: '¿Tienes dudas?',
                body: 'Si tienes preguntas sobre nuestra Política de Cookies o sobre cómo gestionamos tus datos, puedes contactarnos:',
                items: ['Correo electrónico: info@qoricash.pe','Teléfono: 910 624 404','Horario: Lun–Vie 9:00–18:00 | Sáb 9:00–13:00'],
              },
            ].map(({ num, title, body, items, custom }: any) => (
              <div key={num} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>{num}</span>
                  <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>{title}</h2>
                </div>
                {custom}
                {body && <p className="text-sm leading-relaxed mb-3" style={{ color: '#475569' }}>{body}</p>}
                {items && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px' }}>
                    <ul className="space-y-1.5">
                      {items.map((i: string) => <li key={i} className="flex gap-2 text-xs" style={{ color: '#475569' }}><span style={{ color: '#2563EB' }}>·</span>{i}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* Commitment box */}
            <div style={{ background: '#0D1B2A', borderRadius: 12, padding: '24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle style={{ width: 16, height: 16, color: '#2563EB' }} />
              </div>
              <div>
                <p className="font-black text-sm mb-2" style={{ color: '#fff' }}>Nuestro compromiso</p>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                  En Qoricash utilizamos cookies de manera responsable y transparente, siempre respetando tu privacidad y cumpliendo con la normativa vigente. Tu confianza es nuestra prioridad.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
