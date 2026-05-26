'use client';

/**
 * BackgroundDecor — Premium Fintech Subtle Background
 * Minimalista, institucional, sin ruido visual.
 * Solo elementos que añaden profundidad sin competir con el contenido.
 */
export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Grid sutil — solo para dar textura de profundidad */}
      <div className="absolute inset-0 bg-grid-pattern" />

      {/* Gradiente radial superior derecha — warm glow institucional */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-radial-gradient-primary" />

      {/* Gradiente inferior izquierda — balanceo */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-radial-gradient-secondary" />

      {/* Orbe primario — suave, apenas perceptible */}
      <div
        className="decorative-orb decorative-orb-primary"
        style={{ top: '10%', right: '15%', width: '280px', height: '280px' }}
      />

      {/* Orbe secundario — balanceo visual izquierda */}
      <div
        className="decorative-orb decorative-orb-primary"
        style={{ bottom: '15%', left: '10%', width: '220px', height: '220px', animationDelay: '6s' }}
      />
    </div>
  );
}
