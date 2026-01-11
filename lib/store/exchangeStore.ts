import { create } from 'zustand';
import { exchangeApi } from '../api';
import type { ExchangeRate } from '../types';
import { socketService, type ExchangeRateUpdate } from '../services/socketService';

interface ExchangeState {
  currentRates: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isConnected: boolean;
  connectionError: string | null;

  // Actions
  fetchRates: () => Promise<void>;
  calculateExchange: (params: {
    tipo: 'compra' | 'venta';
    monto: number;
    moneda: 'soles' | 'dolares';
  }) => Promise<{ monto_calculado: number; tipo_cambio: number } | null>;
  startRateSubscription: () => () => void;
  connectToSocket: () => void;
  disconnectFromSocket: () => void;
}

export const useExchangeStore = create<ExchangeState>((set, get) => ({
  currentRates: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  isConnected: false,
  connectionError: null,

  /**
   * Fetch current exchange rates
   */
  fetchRates: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await exchangeApi.getCurrentRates();

      if (response.success && response.data) {
        set({
          currentRates: response.data,
          isLoading: false,
          lastUpdated: new Date(),
          error: null,
        });
      } else {
        set({
          error: 'Error al obtener tipos de cambio',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al obtener tipos de cambio',
        isLoading: false,
      });
    }
  },

  /**
   * Calculate exchange amount
   */
  calculateExchange: async (params) => {
    try {
      const response = await exchangeApi.calculateExchange(params);

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Calculate exchange error:', error);
      return null;
    }
  },

  /**
   * Connect to Socket.IO for real-time updates
   */
  connectToSocket: () => {
    console.log('🔌 Connecting to Socket.IO for real-time exchange rates...');

    // Connect to Socket.IO server
    socketService.connect();

    // Subscribe to exchange rate updates
    const unsubscribeRates = socketService.onExchangeRatesUpdated((data: ExchangeRateUpdate) => {
      console.log('💱 Real-time exchange rate update received:', data);

      // Update store with new rates
      set({
        currentRates: {
          id: 0, // Not used for real-time updates
          tipo_compra: data.compra,
          tipo_venta: data.venta,
          fecha_actualizacion: data.updated_at,
          updated_by: 0, // Not used
        },
        lastUpdated: new Date(),
        error: null,
      });
    });

    // Subscribe to connection status
    const unsubscribeStatus = socketService.onConnectionStatus((status: any) => {
      console.log('🔌 Socket connection status:', status);

      set({
        isConnected: status.connected,
        connectionError: status.error || null,
      });
    });

    // Store unsubscribe functions for cleanup
    (get() as any)._socketUnsubscribers = [unsubscribeRates, unsubscribeStatus];
  },

  /**
   * Disconnect from Socket.IO
   */
  disconnectFromSocket: () => {
    console.log('🔌 Disconnecting from Socket.IO...');

    // Call unsubscribe functions if they exist
    const unsubscribers = (get() as any)._socketUnsubscribers;
    if (unsubscribers) {
      unsubscribers.forEach((unsub: Function) => unsub());
    }

    // Disconnect socket
    socketService.disconnect();

    set({
      isConnected: false,
      connectionError: null,
    });
  },

  /**
   * Subscribe to rate updates (legacy + real-time)
   */
  startRateSubscription: () => {
    // Initial fetch from API
    get().fetchRates();

    // Connect to Socket.IO for real-time updates
    get().connectToSocket();

    // Fallback polling (in case Socket.IO fails)
    const pollingInterval = setInterval(async () => {
      // Only poll if Socket.IO is not connected
      if (!get().isConnected) {
        console.log('📡 Polling for rates (Socket.IO not connected)');
        try {
          const response = await exchangeApi.getCurrentRates();
          if (response.success && response.data) {
            set({
              currentRates: response.data,
              lastUpdated: new Date(),
            });
          }
        } catch (error) {
          console.error('Error polling rates:', error);
        }
      }
    }, 30000); // Poll every 30 seconds as fallback

    // Return cleanup function
    return () => {
      clearInterval(pollingInterval);
      get().disconnectFromSocket();
    };
  },
}));
