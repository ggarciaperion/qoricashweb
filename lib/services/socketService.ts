/**
 * Socket.IO Service for Real-time Updates
 * Connects to backend Socket.IO server for live exchange rate updates
 */
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.qoricash.pe';

export interface ExchangeRateUpdate {
  compra: number;
  venta: number;
  updated_by: string;
  updated_at: string;
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  /**
   * Initialize Socket.IO connection
   */
  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = io(API_BASE_URL, {
        transports: ['polling', 'websocket'], // polling primero para evitar fallos de upgrade WS en proxies
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 10000,
        autoConnect: true,
        upgrade: true, // intentar upgrade a WS después de establecer polling
      });

      this.setupEventHandlers();
      this.isConnecting = false;
    } catch (error) {
      console.error('❌ Error connecting to Socket.IO:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (_error) => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connection_status', { connected: false, error: 'Max reconnection attempts' });
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      // reconnected
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true, reconnected: true });
    });

    // Listen for exchange rate updates from backend
    this.socket.on('tipos_cambio_actualizados', (data: ExchangeRateUpdate) => {
      this.emit('exchange_rates_updated', data);
    });
  }

  /**
   * Subscribe to exchange rate updates
   */
  onExchangeRatesUpdated(callback: (data: ExchangeRateUpdate) => void): () => void {
    return this.on('exchange_rates_updated', callback);
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionStatus(callback: (status: any) => void): () => void {
    return this.on('connection_status', callback);
  }

  /**
   * Generic event listener
   */
  private on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    };
  }

  /**
   * Emit event to local listeners
   */
  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.isConnecting = false;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    connecting: boolean;
    reconnectAttempts: number;
  } {
    return {
      connected: this.socket?.connected || false,
      connecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Export singleton instance
export const socketService = new SocketService();
