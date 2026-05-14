'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, TrendingUp, TrendingDown, ArrowRight, Mail } from 'lucide-react';

const EJEMPLOS = [
  { tipo: 'sobre', moneda: 'venta', valor: '3.420', label: 'Avísame cuando el dólar (venta) suba a S/ 3.420' },
  { tipo: 'bajo',  moneda: 'compra', valor: '3.390', label: 'Avísame cuando el dólar (compra) baje a S/ 3.390' },
  { tipo: 'sobre', moneda: 'venta', valor: '3.450', label: 'Avísame cuando el dólar (venta) supere S/ 3.450' },
  { tipo: 'bajo',  moneda: 'venta', valor: '3.400', label: 'Avísame cuando el dólar (venta) caiga a S/ 3.400' },
];

export default function AlertaTCBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % EJEMPLOS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const ej = EJEMPLOS[active];

  return (
    <section className="relative py-14 bg-gradient-to-br from-[#0D1B2A] via-[#0f2235] to-[#0D1B2A] overflow-hidden reveal">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-3 py-1 mb-5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">Nuevo · Alertas de TC</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4">
              El dólar cambia{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                a cada momento.
              </span>
              <br />
              Tú te enteras primero.
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Crea alertas personalizadas y recibe un <strong className="text-gray-300">correo instantáneo</strong> cuando
              el tipo de cambio llegue al nivel que tú eliges. Sin revisar apps, sin perderte el momento exacto.
            </p>

            <ul className="space-y-2.5 mb-8">
              {[
                'Alertas al alza y a la baja',
                'Notificación por email en segundos',
                'Configúralas en menos de 30 segundos',
                'Gratis para todos los clientes registrados',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <span className="w-4 h-4 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/crear-cuenta"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-primary-500/30 text-sm"
              >
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 border border-white/20 text-sm"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          {/* Right: animated demo card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">

              {/* Mock phone card */}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Alerta de TC</p>
                      <p className="text-gray-500 text-[10px]">QoriCash</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                {/* Animated example */}
                <div
                  key={active}
                  className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4 mb-4 transition-all duration-500"
                >
                  <div className="flex items-start gap-2.5">
                    {ej.tipo === 'sobre' ? (
                      <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-amber-200 text-xs leading-relaxed font-medium">{ej.label}</p>
                  </div>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {EJEMPLOS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === active ? 'w-4 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Mock email notification */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-[11px] font-semibold truncate">alertas@qoricash.pe</p>
                    <p className="text-gray-400 text-[10px] leading-relaxed mt-0.5">
                      ⚡ ¡Tu alerta se activó! TC Venta = S/ {ej.valor}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] text-gray-500">ahora</span>
                </div>
              </div>

              <p className="text-center text-gray-600 text-[11px] mt-3">
                Disponible para todos los clientes de QoriCash
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
