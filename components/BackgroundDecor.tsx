'use client';

/**
 * Componente de Decoración de Fondo
 * Elementos visuales profesionales y claramente visibles
 */

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

      {/* ── AURORA MESH ENHANCED ── */}

      {/* Dot grid sutil como textura base */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="aurora-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(13,27,42,0.055)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aurora-dots)" />
      </svg>

      {/* Blob 1 — Verde grande, top-right (principal) */}
      <div style={{
        position: 'absolute',
        top: '-180px', right: '-120px',
        width: '750px', height: '680px',
        borderRadius: '43% 57% 62% 38% / 48% 52% 48% 52%',
        background: 'radial-gradient(circle at 40% 40%, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.08) 45%, transparent 70%)',
        filter: 'blur(72px)',
      }} />

      {/* Blob 2 — Navy profundo, bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: '-160px', left: '-120px',
        width: '680px', height: '620px',
        borderRadius: '55% 45% 40% 60% / 45% 55% 45% 55%',
        background: 'radial-gradient(circle at 55% 55%, rgba(13,27,42,0.15) 0%, rgba(13,27,42,0.05) 50%, transparent 72%)',
        filter: 'blur(80px)',
      }} />

      {/* Blob 3 — Cyan accent, top-left */}
      <div style={{
        position: 'absolute',
        top: '0px', left: '-60px',
        width: '480px', height: '420px',
        borderRadius: '62% 38% 55% 45% / 40% 60% 40% 60%',
        background: 'radial-gradient(circle at 45% 50%, rgba(6,182,212,0.11) 0%, transparent 65%)',
        filter: 'blur(65px)',
      }} />

      {/* Blob 4 — Verde medio, center-right */}
      <div style={{
        position: 'absolute',
        top: '38%', right: '-60px',
        width: '420px', height: '480px',
        borderRadius: '48% 52% 38% 62% / 58% 42% 58% 42%',
        background: 'radial-gradient(circle at 50% 45%, rgba(34,197,94,0.12) 0%, transparent 68%)',
        filter: 'blur(68px)',
      }} />

      {/* Blob 5 — Navy accent, bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '8%', right: '8%',
        width: '360px', height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(13,27,42,0.09) 0%, transparent 70%)',
        filter: 'blur(55px)',
      }} />

      {/* Blob 6 — Verde pálido, center-left — da continuidad */}
      <div style={{
        position: 'absolute',
        top: '55%', left: '-40px',
        width: '340px', height: '400px',
        borderRadius: '38% 62% 55% 45% / 52% 48% 52% 48%',
        background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 65%)',
        filter: 'blur(60px)',
      }} />

      {/* Blob 7 — Teal center, da el "mesh" en el medio */}
      <div style={{
        position: 'absolute',
        top: '25%', left: '30%',
        width: '500px', height: '400px',
        borderRadius: '50% 50% 60% 40% / 45% 55% 45% 55%',
        background: 'radial-gradient(circle at center, rgba(16,185,129,0.06) 0%, transparent 65%)',
        filter: 'blur(90px)',
      }} />

      {/* Noise grain — da profundidad fotográfica tipo Stripe */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ mixBlendMode: 'overlay', opacity: 0.6 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.035" />
      </svg>

    </div>
  );
}
