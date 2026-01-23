'use client';

/**
 * Componente de Decoración de Fondo
 * Agrega elementos visuales sutiles y profesionales al fondo
 * sin competir con el contenido principal
 */

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Grid Pattern Sutil */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Dot Pattern Diagonal */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Diagonal Lines */}
      <div className="absolute inset-0 bg-diagonal-lines" />

      {/* Gradientes Radiales Estratégicos */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-radial-gradient-primary" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-radial-gradient-secondary" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-radial-gradient-primary opacity-50" />

      {/* Orbes Decorativos con Blur - Parte Superior */}
      <div
        className="decorative-orb decorative-orb-primary animate-float-slow"
        style={{
          top: '10%',
          right: '15%',
          width: '400px',
          height: '400px',
        }}
      />

      <div
        className="decorative-orb decorative-orb-success animate-float-slow"
        style={{
          top: '20%',
          left: '10%',
          width: '350px',
          height: '350px',
          animationDelay: '3s',
        }}
      />

      {/* Orbes Decorativos - Parte Media */}
      <div
        className="decorative-orb decorative-orb-secondary animate-float-slow"
        style={{
          top: '50%',
          right: '20%',
          width: '450px',
          height: '450px',
          animationDelay: '6s',
        }}
      />

      <div
        className="decorative-orb decorative-orb-primary animate-pulse-glow"
        style={{
          top: '45%',
          left: '5%',
          width: '300px',
          height: '300px',
        }}
      />

      {/* Orbes Decorativos - Parte Inferior */}
      <div
        className="decorative-orb decorative-orb-success animate-float-slow"
        style={{
          bottom: '15%',
          left: '25%',
          width: '400px',
          height: '400px',
          animationDelay: '9s',
        }}
      />

      <div
        className="decorative-orb decorative-orb-secondary animate-pulse-glow"
        style={{
          bottom: '20%',
          right: '10%',
          width: '350px',
          height: '350px',
          animationDelay: '4s',
        }}
      />

      {/* Símbolos de Moneda Sutiles */}
      <div className="currency-symbol" style={{ top: '15%', right: '25%', transform: 'rotate(-15deg)' }}>
        $
      </div>
      <div className="currency-symbol" style={{ top: '60%', left: '15%', transform: 'rotate(20deg)' }}>
        S/
      </div>
      <div className="currency-symbol" style={{ bottom: '25%', right: '30%', transform: 'rotate(-10deg)' }}>
        €
      </div>
      <div className="currency-symbol" style={{ top: '40%', right: '8%', fontSize: '100px', transform: 'rotate(15deg)' }}>
        ¥
      </div>
      <div className="currency-symbol" style={{ bottom: '35%', left: '8%', fontSize: '110px', transform: 'rotate(-20deg)' }}>
        £
      </div>

      {/* Líneas de Conexión Diagonales */}
      <div
        className="connection-line animate-pulse-glow"
        style={{
          top: '20%',
          left: '10%',
          width: '400px',
          transform: 'rotate(-30deg)',
          animationDelay: '1s',
        }}
      />
      <div
        className="connection-line animate-pulse-glow"
        style={{
          top: '50%',
          right: '5%',
          width: '500px',
          transform: 'rotate(45deg)',
          animationDelay: '3s',
        }}
      />
      <div
        className="connection-line animate-pulse-glow"
        style={{
          bottom: '30%',
          left: '20%',
          width: '350px',
          transform: 'rotate(-45deg)',
          animationDelay: '5s',
        }}
      />
      <div
        className="connection-line animate-pulse-glow"
        style={{
          top: '35%',
          left: '30%',
          width: '450px',
          transform: 'rotate(60deg)',
          animationDelay: '2s',
        }}
      />

      {/* Círculos decorativos pequeños */}
      <div
        className="absolute rounded-full border border-primary/5 animate-pulse-slow"
        style={{
          top: '25%',
          left: '40%',
          width: '120px',
          height: '120px',
        }}
      />
      <div
        className="absolute rounded-full border border-primary/5 animate-pulse-slow"
        style={{
          bottom: '35%',
          right: '35%',
          width: '90px',
          height: '90px',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute rounded-full border border-success/5 animate-pulse-slow"
        style={{
          top: '60%',
          right: '45%',
          width: '100px',
          height: '100px',
          animationDelay: '4s',
        }}
      />
    </div>
  );
}
