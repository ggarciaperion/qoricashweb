'use client';

import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';

export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen pt-[80px]" style={{ background: '#F8FAFC' }}>
      <SiteNav />
      {/* Hero */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '32px 24px 28px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield style={{ width: 20, height: 20, color: '#2563EB' }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#2563EB' }}>Documentos legales</p>
              <h1 className="font-black text-2xl" style={{ color: '#0D1117', letterSpacing: '-0.02em' }}>Política de Privacidad</h1>
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
                En <strong style={{ color: '#0D1B2A' }}>QORICASH S.A.C.</strong> (RUC 20615113698), con nombre comercial <strong style={{ color: '#0D1B2A' }}>QORICASH FX</strong>, nos comprometemos a proteger la privacidad y seguridad de los datos personales de nuestros usuarios y clientes.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                Esta Política describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestros servicios de casa de cambio digital.
              </p>
            </div>

            {/* Section 1 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>01</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Información que Recopilamos</h2>
              </div>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Para brindarle nuestros servicios de manera segura, recopilamos la siguiente información:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: '1.1 Identificación Personal', items: ['Nombre completo','Documento de identidad (DNI, CE, Pasaporte)','RUC (para personas jurídicas)','Fecha de nacimiento','Nacionalidad'] },
                  { title: '1.2 Datos de Contacto', items: ['Dirección de correo electrónico','Número de teléfono móvil','Dirección física'] },
                  { title: '1.3 Datos Financieros', items: ['Información de cuentas bancarias','Historial de transacciones','Información sobre origen y destino de fondos'] },
                  { title: '1.4 Datos Técnicos', items: ['Dirección IP','Tipo de dispositivo y navegador','Datos de geolocalización','Información de cookies'] },
                ].map(({ title, items }) => (
                  <div key={title} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px' }}>
                    <p className="font-bold text-xs mb-2" style={{ color: '#0D1B2A' }}>{title}</p>
                    <ul className="space-y-1">
                      {items.map(i => <li key={i} className="flex gap-2 text-xs" style={{ color: '#475569' }}><span style={{ color: '#2563EB', flexShrink: 0 }}>·</span>{i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>02</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Uso de la Información</h2>
              </div>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Utilizamos su información personal para los siguientes propósitos:</p>
              <ul className="space-y-2">
                {[
                  ['Prestación de servicios', 'Procesar sus operaciones de cambio de divisas'],
                  ['Verificación de identidad', 'Cumplir con requisitos legales y prevenir fraudes'],
                  ['Comunicaciones', 'Enviar notificaciones sobre sus transacciones y actualizaciones'],
                  ['Mejora del servicio', 'Analizar el uso de la plataforma para optimizar la experiencia'],
                  ['Cumplimiento normativo', 'Reportes a autoridades competentes según lo requiera la ley'],
                  ['Prevención LAFT', 'Monitoreo de transacciones conforme a normativas de lavado de activos'],
                  ['Atención al cliente', 'Responder consultas y resolver incidencias'],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-2 text-sm" style={{ color: '#475569' }}>
                    <span style={{ color: '#2563EB', flexShrink: 0 }}>·</span>
                    <span><strong style={{ color: '#0D1B2A' }}>{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>03</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Protección de Datos</h2>
              </div>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Implementamos medidas de seguridad técnicas, administrativas y físicas:</p>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px' }}>
                <ul className="space-y-2">
                  {['Encriptación SSL/TLS para todas las comunicaciones','Almacenamiento seguro en servidores con acceso restringido','Autenticación de dos factores (2FA)','Monitoreo continuo de actividades sospechosas','Auditorías de seguridad periódicas','Capacitación constante del personal en protección de datos'].map(i => (
                    <li key={i} className="flex gap-2 text-xs" style={{ color: '#475569' }}><span style={{ color: '#2563EB', flexShrink: 0 }}>·</span>{i}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>04</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Compartir Información con Terceros</h2>
              </div>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>No vendemos, alquilamos ni compartimos su información personal con terceros para fines comerciales. Podemos compartir sus datos únicamente en los siguientes casos:</p>
              <ul className="space-y-2 mb-3">
                {[
                  ['Entidades financieras', 'Bancos necesarios para procesar sus transacciones'],
                  ['Proveedores de servicios', 'Empresas que nos ayudan a operar la plataforma'],
                  ['Autoridades regulatorias', 'Cuando sea requerido por ley (SBS, SUNAT, UIF-Perú)'],
                  ['Orden judicial', 'En cumplimiento de mandatos judiciales o procesos legales'],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-2 text-sm" style={{ color: '#475569' }}>
                    <span style={{ color: '#2563EB', flexShrink: 0 }}>·</span>
                    <span><strong style={{ color: '#0D1B2A' }}>{k}:</strong> {v}</span>
                  </li>
                ))}
              </ul>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderLeft: '3px solid #F59E0B', borderRadius: 8, padding: '12px 14px' }}>
                <p className="text-xs" style={{ color: '#92400E' }}><strong>Nota:</strong> Todos los terceros están obligados contractualmente a mantener la confidencialidad y seguridad de sus datos.</p>
              </div>
            </div>

            {/* Section 5 */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>05</span>
                <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Sus Derechos — Ley N° 29733</h2>
              </div>
              <p className="text-sm mb-4" style={{ color: '#475569' }}>De acuerdo con la legislación peruana, usted tiene los siguientes derechos:</p>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {[
                  ['Acceso', 'Conocer qué datos personales tenemos sobre usted'],
                  ['Rectificación', 'Solicitar la corrección de datos inexactos o incompletos'],
                  ['Cancelación', 'Solicitar la eliminación de sus datos'],
                  ['Oposición', 'Oponerse al tratamiento de sus datos personales'],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 14px' }}>
                    <p className="font-bold text-xs mb-1" style={{ color: '#0D1B2A' }}>✓ {k}</p>
                    <p className="text-xs" style={{ color: '#475569' }}>{v}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: '#475569' }}>Para ejercer estos derechos, contáctenos en: <strong style={{ color: '#0D1B2A' }}>info@qoricash.pe</strong> o al <strong style={{ color: '#0D1B2A' }}>910 624 404</strong>.</p>
            </div>

            {/* Sections 6-8 */}
            {[
              { num: '06', title: 'Retención de Datos', items: ['Datos de transacciones: Mínimo 5 años (normativa LAFT)','Datos de identificación: Durante la relación comercial y hasta 10 años después','Datos tributarios: Según lo establecido por SUNAT'] },
              { num: '07', title: 'Cookies y Tecnologías Similares', body: 'Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el tráfico y personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del servicio.' },
              { num: '08', title: 'Cambios a esta Política', body: 'Nos reservamos el derecho de actualizar esta Política periódicamente. Le notificaremos sobre cambios significativos mediante correo electrónico o un aviso destacado en nuestra plataforma.' },
            ].map(({ num, title, body, items }: any) => (
              <div key={num} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-black text-xs flex-shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#2563EB', color: '#ffffff', fontFamily: 'monospace' }}>{num}</span>
                  <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>{title}</h2>
                </div>
                <div className="text-sm" style={{ color: '#475569' }}>
                  {body && <p className="leading-relaxed">{body}</p>}
                  {items && <ul className="space-y-1 ml-3 mt-2">{items.map((i: string) => <li key={i} className="flex gap-2"><span style={{ color: '#2563EB' }}>·</span>{i}</li>)}</ul>}
                </div>
              </div>
            ))}

            {/* Legal box */}
            <div style={{ background: '#0D1B2A', borderRadius: 12, padding: '24px' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#2563EB' }}>Información de Contacto</p>
              <div className="space-y-2 text-xs" style={{ color: '#94A3B8' }}>
                {[['Razón Social','QORICASH S.A.C.'],['RUC','20615113698'],['Nombre Comercial','QORICASH FX'],['Dirección','Av. Brasil N° 2790, Int. 504, Lima – Pueblo Libre'],['Correo Electrónico','info@qoricash.pe'],['Teléfono','910 624 404']].map(([k,v]) => (
                  <div key={k} className="flex gap-2"><span style={{ color: '#475569', flexShrink: 0 }}>{k}:</span><span style={{ color: '#CBD5E1' }}>{v}</span></div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
