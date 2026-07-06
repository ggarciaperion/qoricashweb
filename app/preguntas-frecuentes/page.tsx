'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowLeft } from 'lucide-react';

const faqs = [
  {
    q: '¿Cuánto tiempo tarda mi operación?',
    a: 'La mayoría de operaciones se completan en menos de 15 minutos. El tiempo depende de la confirmación de tu transferencia bancaria, que normalmente es inmediata entre los bancos principales del Perú.',
  },
  {
    q: '¿Es seguro cambiar dólares con QoriCash?',
    a: 'Sí. QoriCash opera con registro ante la SBS y cuenta con protocolos de verificación de identidad (KYC). Tus datos están protegidos y cada operación queda registrada con trazabilidad completa.',
  },
  {
    q: '¿Cuáles son las comisiones?',
    a: 'Ninguna. QoriCash no cobra comisiones ocultas ni cargos adicionales. El tipo de cambio que ves es exactamente lo que recibes.',
  },
  {
    q: '¿Cuál es el monto mínimo para operar?',
    a: null,
  },
  {
    q: '¿Con qué bancos trabajan?',
    a: 'Trabajamos directamente con BCP, Interbank y BanBif. Además, aceptamos operaciones interbancarias desde BBVA, Scotiabank, Pichincha o cualquier otro banco con plaza Lima; estas acreditaciones toman entre 2 a 24 horas según el horario de envío.',
  },
];

export default function PreguntasFrecuentesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display font-black text-3xl md:text-4xl mb-2" style={{ color: '#1E293B' }}>Preguntas frecuentes</h1>
          <p className="text-sm" style={{ color: 'rgba(13,27,42,0.45)' }}>Resolvemos tus dudas antes de empezar</p>
        </div>

        <div className="space-y-2">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{ border: openFaq === i ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(13,27,42,0.1)' }}
            >
              <button
                className="w-full flex items-center gap-4 px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-colors duration-300"
                  style={{
                    background: openFaq === i ? '#22C55E' : 'rgba(13,27,42,0.06)',
                    color: openFaq === i ? 'white' : 'rgba(13,27,42,0.35)',
                  }}
                >{i + 1}</span>
                <span className="flex-1 font-bold text-sm sm:text-base text-slate-800">{item.q}</span>
                <ChevronDown className={`flex-shrink-0 w-4 h-4 text-green-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : 'opacity-50'}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 pl-6 sm:pl-[60px]">
                  {item.a ? (
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>{item.a}</p>
                  ) : (
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.55)' }}>
                      Puedes cambiar desde S/ 100 o $30 dólares. Para operaciones grandes contáctanos por{' '}
                      <a href="https://wa.me/51926011920" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
                        WhatsApp 926 011 920
                      </a>{' '}
                      para coordinar condiciones especiales.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
