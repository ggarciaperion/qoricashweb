import { create } from 'zustand';
import { exchangeApi } from '../api';
import type { ExchangeRate } from '../types';

interface ExchangeState {
  currentRates: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  fetchRates: () => Promise<void>;
  calculateExchange: (params: {
    tipo: 'compra' | 'venta';
    monto: number;
    moneda: 'soles' | 'dolares';
  }) => Promise<{ monto_calculado: number; tipo_cambio: number } | null>;
  startRateSubscription: () => () => void;
}

export const useExchangeStore = create<ExchangeState>((set, get) => ({
  currentRates: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

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
   * Subscribe to rate updates
   */
  startRateSubscription: () => {
    // Initial fetch
    get().fetchRates();

    // Subscribe to updates
    const unsubscribe = exchangeApi.subscribeToRates((rate) => {
      set({
        currentRates: rate,
        lastUpdated: new Date(),
      });
    });

    return unsubscribe;
  },
}));
