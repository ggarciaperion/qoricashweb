import { apiClient, ApiResponse } from '../api';
import type {
  Operation,
  CreateOperationRequest,
  CreateOperationResponse,
  ClientStats,
} from '../types';

/**
 * Operations API Service
 */
export const operationsApi = {
  /**
   * Get all operations for current client
   */
  async getMyOperations(dni: string): Promise<ApiResponse<Operation[]>> {
    const response = await apiClient.post<ApiResponse<Operation[]>>('/api/web/my-operations', { dni });
    return response.data;
  },

  /**
   * Get operation by ID
   */
  async getOperation(id: number): Promise<ApiResponse<Operation>> {
    const response = await apiClient.get<ApiResponse<Operation>>(`/api/operations/${id}`);
    return response.data;
  },

  /**
   * Create new operation
   */
  async createOperation(data: CreateOperationRequest): Promise<CreateOperationResponse> {
    const response = await apiClient.post<CreateOperationResponse>('/api/operations/create', data);
    return response.data;
  },

  /**
   * Upload proof of payment (comprobante)
   */
  async uploadProof(operationId: number, file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('comprobante', file);

    const response = await apiClient.post<ApiResponse>(
      `/api/operations/${operationId}/upload-proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Cancel an operation
   */
  async cancelOperation(operationId: number, reason?: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(
      `/api/operations/${operationId}/cancel`,
      { reason }
    );
    return response.data;
  },

  /**
   * Get client statistics
   */
  async getStats(dni: string): Promise<ApiResponse<ClientStats>> {
    const response = await apiClient.post<ApiResponse<ClientStats>>('/api/web/stats', { dni });
    return response.data;
  },

  /**
   * Get operation history with filters
   */
  async getHistory(params?: {
    tipo?: 'compra' | 'venta';
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{ operations: Operation[]; total: number; pages: number }>> {
    const response = await apiClient.get<
      ApiResponse<{ operations: Operation[]; total: number; pages: number }>
    >('/api/operations/history', { params });
    return response.data;
  },

  /**
   * Request operation details (for tracking)
   */
  async getOperationDetails(operationId: number): Promise<ApiResponse> {
    const response = await apiClient.get<ApiResponse>(
      `/api/operations/${operationId}/details`
    );
    return response.data;
  },
};
