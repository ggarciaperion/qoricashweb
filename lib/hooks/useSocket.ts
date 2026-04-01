/**
 * Hook para conexión Socket.IO en tiempo real
 * Escucha notificaciones del backend cuando Middle Office aprueba KYC
 */
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store';

interface SocketMessage {
  type: string;
  title: string;
  message: string;
  client_dni?: string;
  client_id?: number;
  client_name?: string;
}

interface UseSocketOptions {
  onDocumentsApproved?: (data: SocketMessage) => void;
  onOperationExpired?: (data: SocketMessage) => void;
  onOperationUpdated?: (data: any) => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    // Solo conectar si el usuario está autenticado
    if (!user?.dni) {
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe';

    console.log('🔌 [Socket.IO] Conectando al servidor:', SOCKET_URL);

    // Crear conexión Socket.IO
    const socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'], // polling primero para evitar fallos de upgrade WS en proxies
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      upgrade: true,
    });

    socketRef.current = socket;

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('✅ [Socket.IO] Conectado con ID:', socket.id);

      // Unirse al room específico del cliente (IGUAL QUE APP MÓVIL)
      socket.emit('join_client_room', { dni: user.dni });
      console.log(`📍 [Socket.IO] Evento 'join_client_room' emitido para DNI: ${user.dni}`);
    });

    // Confirmación de que el servidor nos unió al room
    socket.on('joined_room', (data) => {
      console.log('✅ [Socket.IO] Confirmación del servidor - Unido al room:', data);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [Socket.IO] Desconectado:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ [Socket.IO] Error de conexión:', error);
    });

    // Evento: Documentos aprobados (KYC)
    socket.on('documents_approved', (data: SocketMessage) => {
      console.log('✅ [Socket.IO] Documentos aprobados recibido:', data);
      if (options.onDocumentsApproved) {
        options.onDocumentsApproved(data);
      }
    });

    // Evento: Operación expirada
    socket.on('operation_expired', (data: SocketMessage) => {
      console.log('⏱️ [Socket.IO] Operación expirada recibido:', data);
      if (options.onOperationExpired) {
        options.onOperationExpired(data);
      }
    });

    // Evento: Operación actualizada
    socket.on('operacion_actualizada', (data: any) => {
      console.log('🔄 [Socket.IO] Operación actualizada recibido:', data);
      if (options.onOperationUpdated) {
        options.onOperationUpdated(data);
      }
    });

    // Cleanup al desmontar
    return () => {
      console.log('🔌 [Socket.IO] Desconectando...');
      socket.disconnect();
    };
  }, [user?.dni, options]);

  return socketRef.current;
};
