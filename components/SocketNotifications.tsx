'use client';

import { useState } from 'react';
import { useSocket } from '@/lib/hooks/useSocket';
import NotificationToast, { NotificationData } from './NotificationToast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

/**
 * Componente que maneja las notificaciones Socket.IO en tiempo real
 * - Escucha eventos del backend cuando Middle Office aprueba KYC
 * - Muestra notificaciones toast al usuario
 * - Actualiza el estado del usuario automáticamente
 */
export default function SocketNotifications() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const router = useRouter();
  const { setUser, user } = useAuthStore();

  // Conectar a Socket.IO y escuchar eventos
  useSocket({
    // Evento: Documentos aprobados (cuenta activada)
    onDocumentsApproved: (data) => {
      console.log('🎉 [Socket] Cuenta activada:', data);

      // Actualizar el status del usuario en el store
      if (user) {
        setUser({
          ...user,
          status: 'Activo', // Cambiar a activo
        });
      }

      // Mostrar notificación
      setNotification({
        title: data.title || '✅ Cuenta Activada',
        message: data.message || 'Tus documentos han sido aprobados. ¡Ya puedes realizar operaciones!',
        type: 'success',
        duration: 10000, // 10 segundos
      });

      // Opcional: Recargar la página para refrescar el estado
      setTimeout(() => {
        router.refresh();
      }, 1000);
    },

    // Evento: Operación expirada
    onOperationExpired: (data) => {
      console.log('⏱️ [Socket] Operación expirada:', data);

      setNotification({
        title: data.title || '⏱️ Operación Expirada',
        message: data.message || 'Tu operación ha expirado. Puedes crear una nueva.',
        type: 'warning',
        duration: 8000,
      });
    },

    // Evento: Operación actualizada
    onOperationUpdated: (data) => {
      console.log('🔄 [Socket] Operación actualizada:', data);

      // Opcional: Mostrar notificación si el estado cambió
      if (data.status === 'Completada') {
        setNotification({
          title: '✅ Operación Completada',
          message: `Tu operación ${data.operation_id} ha sido completada exitosamente.`,
          type: 'success',
          duration: 8000,
        });
      }
    },
  });

  return (
    <NotificationToast
      notification={notification}
      onClose={() => setNotification(null)}
    />
  );
}
