/**
 * Socket.IO Service for Real-time Updates
 * Connects to backend Socket.IO server for live exchange rate updates
 */
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qoricash-trading-v2.onrender.com';

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
      console.log('Socket already connected or connecting');
      return;
    }

    this.isConnecting = true;

    try {
      console.log('🔌 Connecting to Socket.IO server:', API_BASE_URL);

      this.socket = io(API_BASE_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 10000,
        autoConnect: true,
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
      console.log('✅ Socket.IO connected');
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.emit('connection_status', { connected: false, error: 'Max reconnection attempts' });
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true, reconnected: true });
    });

    // Listen for exchange rate updates from backend
    this.socket.on('tipos_cambio_actualizados', (data: ExchangeRateUpdate) => {
      console.log('💱 Exchange rates updated:', data);
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
      console.log('🔌 Disconnecting from Socket.IO');
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
