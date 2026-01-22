/**
 * Hook de Timeout por Inactividad
 * Detecta cuando el usuario está inactivo por un período determinado
 * y ejecuta una acción (como cerrar sesión)
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseInactivityTimeoutOptions {
  /**
   * Tiempo de inactividad en milisegundos antes de ejecutar el callback
   * @default 900000 (15 minutos)
   */
  timeout?: number;

  /**
   * Función que se ejecuta cuando se cumple el timeout
   */
  onTimeout: () => void;

  /**
   * Si está habilitado el timeout
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook que detecta inactividad del usuario y ejecuta un callback
 *
 * @example
 * ```tsx
 * const { logout } = useAuth();
 *
 * useInactivityTimeout({
 *   timeout: 900000, // 15 minutos
 *   onTimeout: logout,
 *   enabled: isAuthenticated
 * });
 * ```
 */
export function useInactivityTimeout({
  timeout = 900000, // 15 minutos por defecto
  onTimeout,
  enabled = true,
}: UseInactivityTimeoutOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Mantener la referencia actualizada del callback
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Función para resetear el timer
  const resetTimer = useCallback(() => {
    // Limpiar timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si está habilitado, crear nuevo timeout
    if (enabled) {
      timeoutRef.current = setTimeout(() => {
        console.log('⏰ [useInactivityTimeout] Timeout de inactividad alcanzado');
        onTimeoutRef.current();
      }, timeout);
    }
  }, [timeout, enabled]);

  useEffect(() => {
    if (!enabled) {
      // Si no está habilitado, limpiar cualquier timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Eventos que indican actividad del usuario
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Handler para resetear el timer en cualquier actividad
    const handleActivity = () => {
      resetTimer();
    };

    // Iniciar el timer
    resetTimer();

    // Agregar listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      // Remover listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, resetTimer]);

  return { resetTimer };
}
