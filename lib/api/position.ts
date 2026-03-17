import { apiClient } from '../api';

export interface OperationRow {
  id: number;
  operation_id: string;
  client_name: string;
  amount_usd: number;
  exchange_rate: number;
  amount_pen: number;
  status: string;
  created_at: string;
  horas_transcurridas: number;
  es_critica: boolean;
  razon_critica: string | null;
}

export interface PositionData {
  total_compras_usd: number;
  contravalor_compras_pen: number;
  total_ventas_usd: number;
  contravalor_ventas_pen: number;
  diferencia_usd: number;
  etiqueta_diferencia: string;
  utilidad_pen: number;
  desbalance_critico: boolean;
  total_operaciones: number;
  cantidad_compras: number;
  cantidad_ventas: number;
  tc_promedio_compras: number;
  tc_promedio_ventas: number;
  compras_completadas_usd: number;
  compras_pendientes_usd: number;
  ventas_completadas_usd: number;
  ventas_pendientes_usd: number;
}

export interface PositionApiResponse {
  success: boolean;
  fecha: string;
  posicion: PositionData;
  compras: OperationRow[];
  ventas: OperationRow[];
}

export interface BankRow {
  id: number;
  bank_name: string;
  usd: {
    initial: number;
    movements: number;
    expected: number;
    actual: number;
    difference: number;
  };
  pen: {
    initial: number;
    movements: number;
    expected: number;
    actual: number;
    difference: number;
  };
  updated_at: string | null;
  updated_by: string | null;
}

export interface ReconciliationApiResponse {
  success: boolean;
  fecha: string;
  banks: BankRow[];
  movements_summary: {
    usd: { inflows: number; outflows: number; net: number };
    pen: { inflows: number; outflows: number; net: number };
    completed_operations: number;
  };
  total_differences: { usd: number; pen: number };
  has_critical_discrepancy: boolean;
}

export const positionApi = {
  async getPosition(fecha?: string): Promise<PositionApiResponse> {
    const params = fecha ? `?fecha=${fecha}` : '';
    const response = await apiClient.get<PositionApiResponse>(
      `/position/api/bank_balances${params}`
    );
    return response.data;
  },

  async getReconciliation(fecha?: string): Promise<ReconciliationApiResponse> {
    const params = fecha ? `?fecha=${fecha}` : '';
    const response = await apiClient.get<ReconciliationApiResponse>(
      `/position/api/bank_reconciliation${params}`
    );
    return response.data;
  },

  async updateBalance(bank_name: string, currency: 'USD' | 'PEN', amount: number) {
    const response = await apiClient.post('/position/api/update_balance', {
      bank_name,
      currency,
      amount,
    });
    return response.data;
  },

  async updateInitialBalance(bank_name: string, currency: 'USD' | 'PEN', amount: number) {
    const response = await apiClient.post('/position/api/update_initial_balance', {
      bank_name,
      currency,
      amount,
    });
    return response.data;
  },

  async updateOperationStatus(
    operationId: number,
    status: 'Pendiente' | 'En proceso' | 'Completada' | 'Cancelado',
    notes?: string
  ) {
    const response = await apiClient.patch(
      `/operations/api/update_status/${operationId}`,
      { status, ...(notes ? { notes } : {}) }
    );
    return response.data;
  },
};
