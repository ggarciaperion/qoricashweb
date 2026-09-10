'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuth } from '@/lib/store/useAuth';
import { useInactivityTimeout } from '@/lib/hooks/useInactivityTimeout';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Si ya está hidratado sincrónicamente (común con localStorage), no bloqueamos el render
  const [isHydrated, setIsHydrated] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return useAuthStore.persist?.hasHydrated?.() ?? true;
    } catch {
      return true;
    }
  });
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Timeout de seguridad: máximo 300ms de espera, evita pantalla en blanco
    const timeout = setTimeout(() => setIsHydrated(true), 300);

    try {
      if (useAuthStore.persist?.hasHydrated?.()) {
        clearTimeout(timeout);
        setIsHydrated(true);
        return () => clearTimeout(timeout);
      }
      const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => {
        clearTimeout(timeout);
        setIsHydrated(true);
      });
      return () => {
        clearTimeout(timeout);
        unsubscribe?.();
      };
    } catch {
      clearTimeout(timeout);
      setIsHydrated(true);
    }
  }, []);

  // Timeout de inactividad de 15 minutos para usuarios autenticados
  useInactivityTimeout({
    timeout: 15 * 60 * 1000,
    onTimeout: logout,
    enabled: isAuthenticated,
  });

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
