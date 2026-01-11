/**
 * Servicio de Tipos de Cambio
 * Obtiene los tipos de cambio actuales para compra y venta
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ExchangeRates {
  compra: number;
  venta: number;
  fecha?: string;
  hora?: string;
}

export interface ExchangeRateResponse {
  success: boolean;
  data?: ExchangeRates;
  message?: string;
}

export const exchangeRateService = {
  /**
   * Obtener tipos de cambio actuales
   */
  getCurrentRates: async (): Promise<ExchangeRateResponse> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/exchange-rates/current`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Asumiendo que la API retorna { buy_rate, sell_rate }
      // Mapear a { compra, venta }
      const data = response.data;

      return {
        success: true,
        data: {
          compra: data.buy_rate || data.compra || 3.750,
          venta: data.sell_rate || data.venta || 3.770,
          fecha: data.date || data.fecha,
          hora: data.time || data.hora,
        },
      };
    } catch (error: any) {
      console.error('Error al obtener tipos de cambio:', error);

      // Retornar tipos de cambio por defecto en caso de error
      return {
        success: false,
        data: {
          compra: 3.750,
          venta: 3.770,
        },
        message: error.message || 'Error al obtener tipos de cambio',
      };
    }
  },

  /**
   * Calcular el monto resultante de una operación
   */
  calculateAmount: (
    amount: number,
    exchangeRate: number,
    operationType: 'Compra' | 'Venta'
  ): number => {
    if (operationType === 'Compra') {
      // Compra: USD × tipo_compra = PEN
      return amount * exchangeRate;
    } else {
      // Venta: PEN ÷ tipo_venta = USD
      return amount / exchangeRate;
    }
  },
};
