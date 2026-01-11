import { apiClient, ApiResponse } from '../api';
import type { ExchangeRate } from '../types';

/**
 * Exchange Rates API Service
 */
export const exchangeApi = {
  /**
   * Get current exchange rates from backend (public endpoint, no auth required)
   */
  async getCurrentRates(): Promise<ApiResponse<ExchangeRate>> {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/platform/public/exchange-rates');

      if (response.data.success && response.data.data) {
        // Transform backend response to ExchangeRate format
        return {
          success: true,
          data: {
            id: 0,
            tipo_compra: response.data.data.tipo_compra,
            tipo_venta: response.data.data.tipo_venta,
            fecha_actualizacion: response.data.data.fecha_actualizacion || new Date().toISOString(),
            updated_by: 0,
          },
          message: 'Tipos de cambio obtenidos exitosamente',
        };
      }

      return {
        success: false,
        message: 'Error al obtener tipos de cambio',
      };
    } catch (error: any) {
      console.error('Error fetching exchange rates:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener tipos de cambio',
      };
    }
  },

  /**
   * Calculate exchange amount locally (no backend endpoint)
   */
  async calculateExchange(params: {
    tipo: 'compra' | 'venta';
    monto: number;
    moneda: 'soles' | 'dolares';
  }): Promise<ApiResponse<{ monto_calculado: number; tipo_cambio: number }>> {
    try {
      // Get current rates
      const ratesResponse = await exchangeApi.getCurrentRates();

      if (!ratesResponse.success || !ratesResponse.data) {
        return {
          success: false,
          message: 'No se pudieron obtener los tipos de cambio',
        };
      }

      const rates = ratesResponse.data;
      const tipo_cambio = params.tipo === 'compra' ? rates.tipo_compra : rates.tipo_venta;

      let monto_calculado: number;

      if (params.moneda === 'soles') {
        // Si ingresa soles, calcular dólares
        if (params.tipo === 'compra') {
          // Compra: cliente vende USD, recibe PEN
          // PEN = USD * tipo_cambio
          // USD = PEN / tipo_cambio
          monto_calculado = params.monto / tipo_cambio;
        } else {
          // Venta: cliente compra USD, paga PEN
          // PEN = USD * tipo_cambio
          // USD = PEN / tipo_cambio
          monto_calculado = params.monto / tipo_cambio;
        }
      } else {
        // Si ingresa dólares, calcular soles
        monto_calculado = params.monto * tipo_cambio;
      }

      return {
        success: true,
        data: {
          monto_calculado: parseFloat(monto_calculado.toFixed(2)),
          tipo_cambio: tipo_cambio,
        },
        message: 'Cálculo realizado exitosamente',
      };
    } catch (error: any) {
      console.error('Error calculating exchange:', error);
      return {
        success: false,
        message: 'Error al calcular el cambio',
      };
    }
  },

  /**
   * Subscribe to rate updates (legacy polling - replaced by Socket.IO)
   */
  subscribeToRates(callback: (rate: ExchangeRate) => void): () => void {
    // Polling every 30 seconds as fallback
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
