import { create } from 'zustand';
import { exchangeApi } from '../api/exchange';
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
   * Fetch current exchange rates from canonical source (/api/rates → PostgreSQL).
   *
   * Race-condition guard: if a Socket.IO event arrived while this fetch was in flight
   * and set a *newer* TC (higher fecha_actualizacion), we keep the Socket.IO value and
   * do not overwrite it with a potentially older REST response.
   */
  fetchRates: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await exchangeApi.getCurrentRates();

      if (response.success && response.data) {
        const incoming = response.data;
        const current  = get().currentRates;

        // Only apply if the REST response is at least as recent as the current TC.
        // Timestamps come from exchange_rates.updated_at (same canonical source for
        // both REST and Socket.IO paths), so the comparison is always apples-to-apples.
        const incomingTs = Date.parse(incoming.fecha_actualizacion || '') || 0;
        const currentTs  = Date.parse(current?.fecha_actualizacion  || '') || 0;

        if (incomingTs >= currentTs) {
          set({
            currentRates: incoming,
            lastUpdated: new Date(),
            error: null,
          });
        }
        // Always clear loading, even if the timestamp guard skipped the update.
        set({ isLoading: false });
      } else {
        set({
          error: 'Error al obtener tipos de cambio',
          isLoading: false,
        });
      }
    } catch (error: any) {
      // Fetch error: clear loading but preserve the last valid TC in currentRates.
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
    // Connect to Socket.IO server
    socketService.connect();

    // Subscribe to exchange rate updates
    const unsubscribeRates = socketService.onExchangeRatesUpdated((data: ExchangeRateUpdate) => {
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
      set({
        isConnected: status.connected,
        connectionError: status.error || null,
      });
      // Re-sync with canonical DB source immediately after reconnect.
      // While the socket was down the client may have missed one or more
      // tipos_cambio_actualizados events; fetchRates() recovers the latest TC.
      // fetchRates() is race-condition-safe: it will not overwrite a newer
      // Socket.IO update that arrived before the REST response completes.
      if (status.connected && status.reconnected) {
        get().fetchRates();
      }
    });

    // Store unsubscribe functions for cleanup
    (get() as any)._socketUnsubscribers = [unsubscribeRates, unsubscribeStatus];
  },

  /**
   * Disconnect from Socket.IO
   */
  disconnectFromSocket: () => {

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
