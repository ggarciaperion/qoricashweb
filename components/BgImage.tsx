'use client';
import { useEffect, useState } from 'react';

interface Props {
  src: string;
  /** Color visible mientras carga la imagen */
  color?: string;
  /** true = position: fixed (para backgrounds de página completa) */
  fixed?: boolean;
  bgPosition?: string;
  /** z-index de las capas de fondo */
  zIndex?: number;
}

/**
 * Background con fade-in suave.
 * Muestra `color` instantáneamente y hace fade-in de la imagen cuando termina de cargar.
 * Elimina el flash blanco entre navegaciones.
 */
export default function BgImage({
  src,
  color = '#0A1628',
  fixed = false,
  bgPosition = 'center',
  zIndex = -1,
}: Props) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(0);
    const img = new window.Image();
    img.onload  = () => setOpacity(1);
    img.onerror = () => setOpacity(1);
    img.src = src;
  }, [src]);

  const pos = fixed ? ('fixed' as const) : ('absolute' as const);

  return (
    <>
      {/* Capa 1: color sólido — visible al instante, sin request de red */}
      <div
        aria-hidden
        style={{ position: pos, inset: 0, zIndex, backgroundColor: color, pointerEvents: 'none' }}
      />
      {/* Capa 2: imagen — hace fade-in cuando termina de cargar */}
      <div
        aria-hidden
        style={{
          position: pos,
          inset: 0,
          zIndex,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: bgPosition,
          backgroundRepeat: 'no-repeat',
          opacity,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
