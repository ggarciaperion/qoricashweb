import { create } from 'zustand';

export interface OperationEvent {
  id: number;
  operation_id: string;
  status: string;      // Flask format: 'Pendiente', 'En proceso', 'Completada', 'Cancelada'
  status_key: string;  // Frontend format: 'pendiente', 'en_proceso', 'completado', 'cancelado'
  old_status: string | null;
  amount_usd: number;
  amount_pen: number;
  exchange_rate: number;
  updated_at: string | null;
  timestamp: number;
}

interface OperationEventState {
  lastEvent: OperationEvent | null;
  setLastEvent: (event: Omit<OperationEvent, 'timestamp'>) => void;
  clearEvent: () => void;
}

export const useOperationEventStore = create<OperationEventState>((set) => ({
  lastEvent: null,
  setLastEvent: (event) => set({ lastEvent: { ...event, timestamp: Date.now() } }),
  clearEvent: () => set({ lastEvent: null }),
}));
