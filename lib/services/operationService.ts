/**
 * Servicio de Operaciones
 * Maneja creación, consulta y gestión de operaciones de cambio
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CreateOperationRequest {
  client_id: number;
  operation_type: 'Compra' | 'Venta';
  amount_usd: number;
  exchange_rate: number;
  source_account?: string;
  destination_account?: string;
  notes?: string;
  origen: 'web'; // Siempre 'web' para operaciones desde la página
}

export interface Operation {
  id: number;
  operation_id: string;
  client_id: number;
  user_id: number;
  operation_type: 'Compra' | 'Venta';
  origen: string;
  amount_usd: number;
  exchange_rate: number;
  amount_pen: number;
  source_account?: string;
  destination_account?: string;
  status: 'Pendiente' | 'En proceso' | 'Completada' | 'Cancelado' | 'Expirada';
  notes?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  client_name?: string;
  user_name?: string;
}

export interface CreateOperationResponse {
  success: boolean;
  message: string;
  operation?: Operation;
}

export interface GetOperationsResponse {
  success: boolean;
  operations?: Operation[];
  message?: string;
}

export const operationService = {
  /**
   * Crear una nueva operación
   * IMPORTANTE: Siempre usar origen: 'web'
   */
  createOperation: async (
    data: CreateOperationRequest
  ): Promise<CreateOperationResponse> => {
    try {
      // Asegurar que el origen siempre sea 'web'
      const payload = {
        ...data,
        origen: 'web' as const,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/operations`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || 'Error al crear operación',
      };
    }
  },

  /**
   * Obtener operaciones de un cliente
   */
  getClientOperations: async (
    clientId: number
  ): Promise<GetOperationsResponse> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/operations/client/${clientId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return {
        success: true,
        operations: response.data,
      };
    } catch (error: any) {
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Error al obtener operaciones',
        };
      }
      return {
        success: false,
        message: error.message || 'Error al obtener operaciones',
      };
    }
  },

  /**
   * Obtener detalle de una operación
   */
  getOperationById: async (operationId: number): Promise<Operation | null> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/operations/${operationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener operación:', error);
      return null;
    }
  },

  /**
   * Obtener estadísticas del cliente
   */
  getClientStats: async (clientId: number): Promise<any> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/clients/${clientId}/stats`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener estadísticas:', error);
      return null;
    }
  },
};
