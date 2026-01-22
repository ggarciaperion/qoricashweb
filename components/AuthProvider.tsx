'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuth } from '@/lib/store/useAuth';
import { useInactivityTimeout } from '@/lib/hooks/useInactivityTimeout';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Esperar a que Zustand hidrate el estado desde sessionStorage
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // Si ya está hidratado, setear inmediatamente
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  // Timeout de inactividad de 15 minutos para usuarios autenticados
  useInactivityTimeout({
    timeout: 15 * 60 * 1000, // 15 minutos en milisegundos
    onTimeout: logout,
    enabled: isAuthenticated,
  });

  if (!isHydrated) {
    return null; // No mostrar nada mientras hidrata
  }

  return <>{children}</>;
}
