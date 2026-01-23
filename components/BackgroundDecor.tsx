'use client';

/**
 * Componente de Decoración de Fondo
 * Elementos visuales profesionales y claramente visibles
 */

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Grid Pattern VISIBLE */}
      <div className="absolute inset-0 bg-grid-pattern" />

      {/* Dot Pattern Diagonal VISIBLE */}
      <div className="absolute inset-0 bg-dot-pattern" />

      {/* Diagonal Lines VISIBLE */}
      <div className="absolute inset-0 bg-diagonal-lines" />

      {/* Gradientes Radiales Estratégicos MÁS VISIBLES */}
      <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-radial-gradient-primary" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-radial-gradient-secondary" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-radial-gradient-primary opacity-70" />

      {/* Orbes Decorativos GRANDES Y VISIBLES - Superior */}
      <div
        className="decorative-orb decorative-orb-primary animate-float-slow"
        style={{
          top: '8%',
          right: '12%',
          width: '500px',
          height: '500px',
        }}
      />

      <div
        className="decorative-orb decorative-orb-success animate-float-slow"
        style={{
          top: '15%',
          left: '8%',
          width: '450px',
          height: '450px',
          animationDelay: '4s',
        }}
      />

      {/* Orbes Decorativos - Medio */}
      <div
        className="decorative-orb decorative-orb-secondary animate-float-slow"
        style={{
          top: '45%',
          right: '18%',
          width: '550px',
          height: '550px',
          animationDelay: '8s',
        }}
      />

      <div
        className="decorative-orb decorative-orb-primary animate-pulse-glow"
        style={{
          top: '40%',
          left: '3%',
          width: '400px',
          height: '400px',
        }}
      />

      {/* Orbes Decorativos - Inferior */}
      <div
        className="decorative-orb decorative-orb-success animate-float-slow"
        style={{
          bottom: '10%',
          left: '22%',
          width: '500px',
          height: '500px',
          animationDelay: '12s',
        }}
      />

      <div
        className="decorative-orb decorative-orb-secondary animate-pulse-glow"
        style={{
          bottom: '15%',
          right: '8%',
          width: '450px',
          height: '450px',
          animationDelay: '6s',
        }}
      />

      {/* Símbolos de Moneda VISIBLES */}
      <div className="currency-symbol" style={{ top: '12%', right: '22%', transform: 'rotate(-12deg)' }}>
        $
      </div>
      <div className="currency-symbol" style={{ top: '55%', left: '12%', transform: 'rotate(18deg)', fontSize: '140px' }}>
        S/
      </div>
      <div className="currency-symbol" style={{ bottom: '22%', right: '28%', transform: 'rotate(-8deg)', fontSize: '130px' }}>
        €
      </div>
      <div className="currency-symbol" style={{ top: '35%', right: '5%', fontSize: '120px', transform: 'rotate(12deg)' }}>
        ¥
      </div>
      <div className="currency-symbol" style={{ bottom: '32%', left: '5%', fontSize: '135px', transform: 'rotate(-18deg)' }}>
        £
      </div>

      {/* Líneas de Conexión Diagonales VISIBLES */}
      <div
        className="connection-line animate-pulse-glow"
        style={{
          top: '18%',
          left: '8%',
          width: '450px',
          transform: 'rotate(-25deg)',
          animationDelay: '1s',
        }}
      />
      <div
        className="connection-line animate-pulse-glow"
        style={{
          top: '48%',
          right: '3%',
          width: '550px',
          transform: 'rotate(40deg)',
          animationDelay: '3s',
        }}
      />
      <div
        className="connection-line animate-pulse-glow"
        style={{
          bottom: '25%',
          left: '18%',
          width: '400px',
          transform: 'rotate(-40deg)',
          animationDelay: '5s',
        }}
      />
      <div
        className="connection-line animate-pulse-glow"
        style={{
          top: '32%',
          left: '28%',
          width: '500px',
          transform: 'rotate(55deg)',
          animationDelay: '2s',
        }}
      />

      {/* Círculos decorativos MÁS VISIBLES */}
      <div
        className="absolute rounded-full border-2 border-primary/20 animate-pulse-slow"
        style={{
          top: '22%',
          left: '38%',
          width: '150px',
          height: '150px',
        }}
      />
      <div
        className="absolute rounded-full border-2 border-primary/20 animate-pulse-slow"
        style={{
          bottom: '32%',
          right: '32%',
          width: '120px',
          height: '120px',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute rounded-full border-2 border-success/20 animate-pulse-slow"
        style={{
          top: '58%',
          right: '42%',
          width: '130px',
          height: '130px',
          animationDelay: '4s',
        }}
      />
    </div>
  );
}
