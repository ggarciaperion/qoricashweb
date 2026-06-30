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
  const { user, refreshUser } = useAuthStore();

  // Conectar a Socket.IO y escuchar eventos
  useSocket({
    // Evento: Documentos aprobados (cuenta activada)
    onDocumentsApproved: async (data) => {
      await refreshUser();

      // Mostrar notificación
      setNotification({
        title: data.title || '✅ Cuenta Activada',
        message: data.message || 'Tus documentos han sido aprobados. ¡Ya puedes realizar operaciones!',
        type: 'success',
        duration: 10000, // 10 segundos
      });

      // Recargar la página para refrescar componentes
      setTimeout(() => {
        router.refresh();
        window.location.reload();
      }, 2000);
    },

    // Evento: Operación expirada
    onOperationExpired: (data) => {

      setNotification({
        title: data.title || '⏱️ Operación Expirada',
        message: data.message || 'Tu operación ha expirado. Puedes crear una nueva.',
        type: 'warning',
        duration: 8000,
      });
    },

    // Evento: Operación actualizada para el cliente web
    onOperationUpdated: (data) => {
      // Solo mostrar toast si viene del evento cliente (tiene status_key)
      if (!data.status_key) return;

      if (data.status === 'Completada') {
        setNotification({
          title: '✅ ¡Operación completada!',
          message: `Tu operación ${data.operation_id} ha sido acreditada exitosamente.`,
          type: 'success',
          duration: 10000,
        });
      } else if (data.status === 'En proceso') {
        setNotification({
          title: '⏳ Operación en proceso',
          message: `Tu operación ${data.operation_id} está siendo verificada.`,
          type: 'info',
          duration: 6000,
        });
      } else if (data.status === 'Cancelada') {
        setNotification({
          title: '❌ Operación cancelada',
          message: `Tu operación ${data.operation_id} fue cancelada.`,
          type: 'warning',
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
