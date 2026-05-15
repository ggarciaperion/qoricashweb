'use client';
/**
 * Hook para conexión Socket.IO en tiempo real.
 * Maneja KYC, expiración y actualizaciones de operaciones para el cliente web.
 */
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/store';
import { useOperationEventStore } from '@/lib/store/operationEventStore';

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
  const { setLastEvent } = useOperationEventStore();

  useEffect(() => {
    if (!user?.dni) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe';

    const socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      upgrade: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_client_room', { dni: user.dni });
    });

    socket.on('joined_room', (data) => {
      console.log('[Socket] Room unido:', data.room);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Desconectado:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Error de conexión:', error.message);
    });

    // KYC aprobado
    socket.on('documents_approved', (data: SocketMessage) => {
      options.onDocumentsApproved?.(data);
    });

    // Operación expirada
    socket.on('operation_expired', (data: SocketMessage) => {
      options.onOperationExpired?.(data);
    });

    // Actualización de operación para staff (compatibilidad)
    socket.on('operacion_actualizada', (data: any) => {
      options.onOperationUpdated?.(data);
    });

    // Actualización de operación para el CLIENTE WEB (nuevo evento)
    socket.on('operacion_cliente_actualizada', (data: any) => {
      // Actualizar store global — cualquier componente puede reaccionar
      setLastEvent({
        id:           data.id,
        operation_id: data.operation_id,
        status:       data.status,
        status_key:   data.status_key,
        old_status:   data.old_status ?? null,
        amount_usd:   data.amount_usd ?? 0,
        amount_pen:   data.amount_pen ?? 0,
        exchange_rate: data.exchange_rate ?? 0,
        updated_at:   data.updated_at ?? null,
      });
      options.onOperationUpdated?.(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.dni]); // eslint-disable-line react-hooks/exhaustive-deps

  return socketRef.current;
};
