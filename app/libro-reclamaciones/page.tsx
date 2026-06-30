'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Camera, X, Clock, Mail } from 'lucide-react';

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
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', fontSize: 13,
  border: '1px solid #E2E8F0', borderRadius: 9,
  background: '#F8FAFC', color: '#0D1B2A',
  outline: 'none', transition: 'border-color 0.15s',
};

export default function LibroReclamaciones() {
  const [formData, setFormData] = useState({
    tipoDocumento: 'DNI', numeroDocumento: '', nombres: '', apellidos: '',
    razonSocial: '', personaContacto: '', email: '', telefono: '',
    direccion: '', tipoSolicitud: 'Reclamo', detalle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [evidenceImagePreview, setEvidenceImagePreview] = useState<string | null>(null);
  const [isUploadingImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Por favor selecciona un archivo de imagen válido'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('La imagen no debe superar los 5MB'); return; }
    setEvidenceImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setEvidenceImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => { setEvidenceImage(null); setEvidenceImagePreview(null); };

  const handleNewComplaint = () => {
    setShowConfirmation(false);
    setEvidenceImage(null);
    setEvidenceImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (evidenceImage) fd.append('evidenceImage', evidenceImage);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe';
      const res = await fetch(`${apiUrl}/api/web/complaints`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.success) {
        setShowConfirmation(true);
        setFormData({ tipoDocumento: 'DNI', numeroDocumento: '', nombres: '', apellidos: '', razonSocial: '', personaContacto: '', email: '', telefono: '', direccion: '', tipoSolicitud: 'Reclamo', detalle: '' });
        setEvidenceImage(null); setEvidenceImagePreview(null);
      } else {
        alert(`Error: ${result.message || 'No se pudo enviar el reclamo. Por favor intenta nuevamente.'}`);
      }
    } catch {
      alert('Error al enviar el reclamo. Por favor verifica tu conexión e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRUC = formData.tipoDocumento === 'RUC';

  return (
    <main className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo-principal.png" alt="QoriCash" style={{ height: 40 }} />
            <span className="font-display font-bold text-lg" style={{ color: '#fff' }}>QoriCash</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/sobre-nosotros" className="text-xs font-medium hover:text-white transition-colors" style={{ color: '#64748B' }}>Sobre nosotros</Link>
            <Link href="/servicios" className="text-xs font-medium hover:text-white transition-colors" style={{ color: '#64748B' }}>Servicios</Link>
            <Link href="/login" className="text-xs font-medium hover:text-white transition-colors" style={{ color: '#64748B' }}>Iniciar sesión</Link>
            <Link href="/crear-cuenta" className="text-xs font-bold" style={{ background: '#22C55E', color: '#fff', padding: '8px 18px', borderRadius: 8 }}>Crear cuenta</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/7413891/pexels-photo-7413891.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,18,35,0.97) 0%, rgba(15,23,42,0.93) 100%)' }} />
        <div style={{ position: 'relative', padding: '44px 24px 36px' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-3">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: 20, height: 20, color: '#22C55E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#22C55E' }}>Atención al cliente</p>
                <h1 className="font-black text-2xl" style={{ color: '#fff', letterSpacing: '-0.02em' }}>Libro de Reclamaciones</h1>
              </div>
            </div>
            <p className="text-xs ml-14" style={{ color: '#64748B', lineHeight: 1.6 }}>Tu opinión es importante para nosotros. Registra aquí tus reclamos o quejas y nos pondremos en contacto contigo a la brevedad.</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '32px 24px 48px' }}>
        <div className="max-w-5xl mx-auto">

          {showConfirmation ? (
            /* Success */
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '48px 36px', textAlign: 'center' }}>
              <div className="flex justify-center mb-5">
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: 24, height: 24, color: '#22C55E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="font-black text-xl mb-3" style={{ color: '#0D1B2A', letterSpacing: '-0.01em' }}>¡Reclamo enviado correctamente!</h2>
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '16px', marginBottom: 20, maxWidth: 460, margin: '0 auto 20px' }}>
                <p className="text-sm mb-1" style={{ color: '#0D1B2A' }}>Tu reclamo ha sido registrado exitosamente.</p>
                <p className="text-xs" style={{ color: '#475569' }}>Recibirás una respuesta en <strong>{formData.email}</strong> dentro de las próximas <strong>24-48 horas hábiles</strong>.</p>
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 16px', marginBottom: 24, maxWidth: 460, margin: '0 auto 24px', textAlign: 'left' }}>
                <p className="text-xs font-bold mb-2" style={{ color: '#0D1B2A' }}>¿Qué sigue?</p>
                {['Nuestro equipo revisará tu solicitud en el menor tiempo posible','Recibirás un email de confirmación con el número de tu reclamo','Te contactaremos para informarte sobre la resolución'].map(i => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <span className="text-xs" style={{ color: '#22C55E', flexShrink: 0 }}>✓</span>
                    <span className="text-xs" style={{ color: '#475569' }}>{i}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={handleNewComplaint} className="font-bold text-sm" style={{ background: '#22C55E', color: '#fff', padding: '10px 22px', borderRadius: 9, border: 'none', cursor: 'pointer' }}>
                  Ingresar nuevo reclamo
                </button>
                <Link href="/" className="font-semibold text-sm" style={{ background: '#F8FAFC', color: '#0D1B2A', padding: '10px 22px', borderRadius: 9, border: '1px solid #E2E8F0' }}>
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            /* Form */
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px 36px' }}>
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-black text-xs flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace', flexShrink: 0 }}>01</span>
                    <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Tipo de Documento</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Tipo de documento <span style={{ color: '#EF4444' }}>*</span></label>
                      <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} required style={{ ...inputStyle }}>
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné de Extranjería (CE)</option>
                        <option value="RUC">RUC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Número de documento <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleChange} required placeholder={`Ingresa tu ${formData.tipoDocumento}`} style={inputStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: '#F1F5F9' }} />

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-black text-xs flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace', flexShrink: 0 }}>02</span>
                    <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>{isRUC ? 'Datos de la Empresa' : 'Datos Personales'}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {isRUC ? (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Razón Social <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="text" name="razonSocial" value={formData.razonSocial} onChange={handleChange} required={isRUC} placeholder="Ingresa la razón social" style={inputStyle} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Persona de Contacto <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="text" name="personaContacto" value={formData.personaContacto} onChange={handleChange} required={isRUC} placeholder="Nombre de la persona de contacto" style={inputStyle} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Nombres <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required={!isRUC} placeholder="Ingresa tus nombres" style={inputStyle} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Apellidos <span style={{ color: '#EF4444' }}>*</span></label>
                          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required={!isRUC} placeholder="Ingresa tus apellidos" style={inputStyle} />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Correo Electrónico <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="ejemplo@correo.com" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Teléfono <span style={{ color: '#EF4444' }}>*</span></label>
                      <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="999 999 999" style={inputStyle} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>Dirección <span className="text-xs" style={{ color: '#94A3B8' }}>(Opcional)</span></label>
                      <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Ingresa tu dirección" style={inputStyle} />
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: '#F1F5F9' }} />

                {/* Step 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-black text-xs flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace', flexShrink: 0 }}>03</span>
                    <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Tipo de Solicitud</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: 'Reclamo', desc: 'Disconformidad relacionada con nuestros servicios' },
                      { value: 'Queja',   desc: 'Malestar o descontento respecto a la atención al público' },
                    ].map(({ value, desc }) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer transition-all"
                        style={{
                          padding: '14px 16px', borderRadius: 10,
                          border: `1px solid ${formData.tipoSolicitud === value ? '#0D1B2A' : '#E2E8F0'}`,
                          background: formData.tipoSolicitud === value ? '#F8FAFC' : '#fff',
                        }}
                      >
                        <input type="radio" name="tipoSolicitud" value={value} checked={formData.tipoSolicitud === value} onChange={handleChange} className="w-4 h-4" style={{ accentColor: '#0D1B2A' }} />
                        <div>
                          <span className="block font-bold text-xs" style={{ color: '#0D1B2A' }}>{value}</span>
                          <span className="block text-xs" style={{ color: '#94A3B8' }}>{desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: '#F1F5F9' }} />

                {/* Step 4 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-black text-xs flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace', flexShrink: 0 }}>04</span>
                    <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Detalle de tu {formData.tipoSolicitud}</h2>
                  </div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#475569' }}>
                    Describe tu {formData.tipoSolicitud.toLowerCase()} <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    name="detalle" value={formData.detalle} onChange={handleChange} required rows={5}
                    placeholder="Por favor, describe de manera clara y detallada tu reclamo o queja. Incluye fechas, números de operación y toda información relevante."
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                  <p className="mt-1.5 text-xs" style={{ color: '#94A3B8' }}>Mínimo 20 caracteres. Sé lo más específico posible.</p>
                </div>

                {/* Info box */}
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderLeft: '3px solid #22C55E', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10 }}>
                  <svg style={{ width: 14, height: 14, color: '#22C55E', flexShrink: 0, marginTop: 1 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs" style={{ color: '#166534' }}>
                    Al enviar este formulario, tu {formData.tipoSolicitud.toLowerCase()} será registrado en nuestro sistema y enviado a nuestro equipo. Te contactaremos dentro de las próximas 24-48 horas hábiles.
                  </p>
                </div>

                <div style={{ height: 1, background: '#F1F5F9' }} />

                {/* Step 5 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-black text-xs flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 7, background: '#0D1B2A', color: '#22C55E', fontFamily: 'monospace', flexShrink: 0 }}>05</span>
                    <h2 className="font-black text-base" style={{ color: '#0D1B2A' }}>Adjuntar Evidencia <span className="font-normal text-xs" style={{ color: '#94A3B8' }}>(Opcional)</span></h2>
                  </div>
                  <p className="text-xs mb-4" style={{ color: '#64748B' }}>Si tienes capturas de pantalla o fotografías que respalden tu reclamo, puedes adjuntarlas aquí. Formatos: JPG, PNG. Máximo 5MB.</p>

                  {!evidenceImagePreview ? (
                    <label className="block cursor-pointer">
                      <div
                        className="flex flex-col items-center justify-center gap-2 transition-all"
                        style={{ border: '2px dashed #E2E8F0', borderRadius: 12, padding: '32px', background: '#F8FAFC', textAlign: 'center' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#22C55E')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                      >
                        <Camera style={{ width: 28, height: 28, color: '#94A3B8' }} />
                        <p className="text-xs font-medium" style={{ color: '#475569' }}>Haz clic para seleccionar una imagen</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>o arrastra y suelta aquí</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                  ) : (
                    <div>
                      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '2px solid #22C55E' }}>
                        <img src={evidenceImagePreview} alt="Vista previa" style={{ width: '100%', height: 200, objectFit: 'contain', background: '#F8FAFC' }} />
                        <button type="button" onClick={handleRemoveImage} style={{ position: 'absolute', top: 8, right: 8, background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                      <p className="text-xs mt-2 text-center" style={{ color: '#22C55E' }}>✓ Imagen seleccionada correctamente</p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-center pt-2">
                  <button type="submit" disabled={isSubmitting || isUploadingImage} className="font-bold text-sm transition-all" style={{ background: '#22C55E', color: '#fff', padding: '12px 36px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 3px 12px rgba(34,197,94,0.3)', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting || isUploadingImage ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin" style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isUploadingImage ? 'Subiendo imagen...' : 'Enviando...'}
                      </span>
                    ) : 'Enviar reclamo'}
                  </button>
                </div>

                <p className="text-xs text-center" style={{ color: '#94A3B8' }}>
                  Al enviar aceptas que tus datos sean utilizados exclusivamente para gestionar tu {formData.tipoSolicitud.toLowerCase()} conforme a nuestra{' '}
                  <Link href="/politica-privacidad" className="hover:underline" style={{ color: '#22C55E' }}>Política de Privacidad</Link>.
                </p>
              </form>
            </div>
          )}

          {/* Info cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {[
              { Icon: Clock, label: 'Tiempo de Respuesta', desc: 'Nuestro equipo revisará tu solicitud y te responderá dentro de las próximas 24-48 horas hábiles.' },
              { Icon: Mail,  label: 'Contacto Directo',   desc: 'También puedes escribirnos directamente a info@qoricash.pe para cualquier consulta.' },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 14, height: 14, color: '#22C55E' }} />
                </div>
                <div>
                  <p className="font-bold text-xs mb-1" style={{ color: '#0D1B2A' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
