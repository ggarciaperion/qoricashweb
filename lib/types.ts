// User types
export interface User {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  role: 'Cliente' | 'Trader' | 'Middle Office' | 'Master' | 'Plataforma';
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
  origen?: 'Lima' | 'Provincia';
  fecha_registro: string;

  // Document type
  document_type?: 'DNI' | 'CE' | 'RUC';

  // Persona Jurídica fields
  razon_social?: string;
  persona_contacto?: string;

  // Referral system
  referral_code?: string;
  used_referral_code?: string | null;
  referred_by?: number | null;

  // KYC Documents
  dni_front_url?: string | null;
  dni_back_url?: string | null;
  dni_representante_front_url?: string | null;
  dni_representante_back_url?: string | null;
  ficha_ruc_url?: string | null;
  validation_oc_url?: string | null;

  // Validation status
  status?: 'Activo' | 'Inactivo';
  has_complete_documents?: boolean;
}

// Bank account types
export interface BankAccount {
  id: number;
  user_id: number;
  banco: string;
  numero_cuenta: string;
  is_primary: boolean;
}

// Operation types
export type OperationType = 'compra' | 'venta';
export type OperationStatus =
  | 'pendiente'
  | 'en_proceso'
  | 'completado'
  | 'cancelado'
  | 'rechazado';

export interface Operation {
  id: number;
  cliente_id: number;
  cliente_nombre?: string;
  tipo: OperationType;
  monto_soles: number;
  monto_dolares: number;
  tipo_cambio: number;
  banco_cliente: string;
  cuenta_cliente: string;
  estado: OperationStatus;
  comprobante_url?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  created_by?: number;
  assigned_to?: number;
  notas?: string;
}

// Exchange rate types
export interface ExchangeRate {
  id: number;
  tipo_compra: number;
  tipo_venta: number;
  fecha_actualizacion: string;
  updated_by?: number;
}

// Authentication types
export interface LoginRequest {
  dni: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  client?: User;
  message?: string;
  requires_password_change?: boolean;
}

export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  password: string;
  banco: string;
  numero_cuenta: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    user: User;
  };
  message?: string;
}

// Operation creation types
export interface CreateOperationRequest {
  dni: string;
  tipo: OperationType;
  monto_soles: number;
  monto_dolares: number;
  banco_cuenta_id: number;
}

export interface CreateOperationResponse {
  success: boolean;
  data?: {
    operation: Operation;
  };
  message?: string;
}

// Stats types
export interface ClientStats {
  total_operations: number;
  total_soles: number;
  total_dolares: number;
  pending_operations: number;
  completed_operations: number;
}
