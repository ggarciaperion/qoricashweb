import { apiClient, ApiResponse } from '../api';
import type { ExchangeRate } from '../types';

/**
 * Exchange Rates API Service
 */
export const exchangeApi = {
  /**
   * Get current exchange rates
   */
  async getCurrentRates(): Promise<ApiResponse<ExchangeRate>> {
    const response = await apiClient.get<ApiResponse<ExchangeRate>>('/exchange/current');
    return response.data;
  },

  /**
   * Calculate exchange amount
   */
  async calculateExchange(params: {
    tipo: 'compra' | 'venta';
    monto: number;
    moneda: 'soles' | 'dolares';
  }): Promise<ApiResponse<{ monto_calculado: number; tipo_cambio: number }>> {
    const response = await apiClient.post<
      ApiResponse<{ monto_calculado: number; tipo_cambio: number }>
    >('/exchange/calculate', params);
    return response.data;
  },

  /**
   * Get exchange rate history
   */
  async getRateHistory(params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    limit?: number;
  }): Promise<ApiResponse<ExchangeRate[]>> {
    const response = await apiClient.get<ApiResponse<ExchangeRate[]>>(
      '/exchange/history',
      { params }
    );
    return response.data;
  },

  /**
   * Subscribe to rate updates (for WebSocket/SSE)
   */
  subscribeToRates(callback: (rate: ExchangeRate) => void): () => void {
    // TODO: Implement WebSocket/SSE subscription
    // For now, use polling
    const interval = setInterval(async () => {
      try {
        const response = await exchangeApi.getCurrentRates();
        if (response.success && response.data) {
          callback(response.data);
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    }, 30000); // Poll every 30 seconds

    // Return unsubscribe function
    return () => clearInterval(interval);
  },
};
