import Link from 'next/link';
import { Shield, CheckCircle2, Lock } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer style={{ color: '#6B7280', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      {/* Trust bar */}
      <div className="py-3 px-4 sm:px-8 lg:px-10" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
              <div>
                <div className="font-bold text-[10px] sm:text-[11px] leading-tight" style={{ color: '#0D1117' }}>Empresa Registrada</div>
                <div className="text-[9px] sm:text-[10px]" style={{ color: '#6B7280' }}>RUC: 20615113698 · Lima, Perú</div>
              </div>
            </div>
            <div className="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
              <div>
                <div className="font-bold text-[10px] sm:text-[11px] leading-tight" style={{ color: '#0D1117' }}>Registrados ante la SBS</div>
                <div className="text-[9px] sm:text-[10px]" style={{ color: '#6B7280' }}>Res. N° 00313-2026</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[11px]" style={{ color: '#374151' }}>
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL cifrado</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Datos protegidos por ley</span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="w-full px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">

          {/* Row 1 — Logo + description */}
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
              <img src="/vg.png" alt="Qoricash" className="h-8 w-auto" />
            </Link>
            <span className="hidden sm:block w-px h-6" style={{ background: 'rgba(0,0,0,0.1)' }} />
            <p className="hidden sm:block text-xs leading-relaxed" style={{ color: '#6B7280' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>
          </div>
          <p className="sm:hidden text-xs leading-relaxed mb-5" style={{ color: '#6B7280' }}>Fintech de cambio de divisas líder en Perú. Seguridad, rapidez y los mejores tipos de cambio.</p>

          {/* Row 2 — Links */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8 mb-6">
            <div>
              <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Servicios</h4>
              <ul className="space-y-2">
                {[
                  ['/servicios#compra', 'Compra USD'],
                  ['/servicios#venta', 'Venta USD'],
                  ['/servicios#tipo-cambio', 'Tipo de cambio'],
                  ['/noticias', 'Noticias'],
                  ['/preguntas-frecuentes', 'FAQ'],
                ].map(([href, label]) => (
                  <li key={href}><Link href={href} className="transition-colors text-[11px] sm:text-xs hover:text-gray-900" style={{ color: '#6B7280' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Legal</h4>
              <ul className="space-y-2">
                {[
                  ['/sobre-nosotros', 'Nosotros'],
                  ['/terminos-condiciones', 'Términos'],
                  ['/politica-privacidad', 'Privacidad'],
                  ['/politica-cookies', 'Cookies'],
                  ['/libro-reclamaciones', 'Reclamaciones'],
                ].map(([href, label]) => (
                  <li key={href}><Link href={href} className="transition-colors text-[11px] sm:text-xs hover:text-gray-900" style={{ color: '#6B7280' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-semibold mb-3 text-[10px] sm:text-xs uppercase tracking-widest" style={{ color: '#0D1117' }}>Contacto</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href="mailto:info@qoricash.pe" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900" style={{ color: '#6B7280' }}>info@qoricash.pe</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <a href="https://wa.me/51910624404" target="_blank" rel="noopener noreferrer" className="transition-colors text-[11px] sm:text-xs hover:text-gray-900" style={{ color: '#6B7280' }}>910 624 404</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <a href="https://maps.google.com/?q=Av.+Brasil+2790+Int.+504+Pueblo+Libre+Lima" target="_blank" rel="noopener noreferrer" className="transition-colors text-[11px] sm:text-xs leading-relaxed hover:text-gray-900" style={{ color: '#6B7280' }}>Av. Brasil N° 2790, Int. 504 · Pueblo Libre</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-[11px] sm:text-xs" style={{ color: '#6B7280' }}>Lun–Vie 9–6 pm · Sáb 9–1 pm</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
            <p>© 2025 Qoricash. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3">
              <Link href="/terminos-condiciones" className="transition-colors hover:text-gray-600">Términos</Link>
              <Link href="/politica-privacidad" className="transition-colors hover:text-gray-600">Privacidad</Link>
              <Link href="/libro-reclamaciones" className="transition-colors hover:text-gray-600">Reclamaciones</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
