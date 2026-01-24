// User types
export interface User {
  id: number;
  dni: string;

  // Campos de nombre (backend usa campos separados)
  nombres: string;
  apellidos: string; // Legacy, para compatibilidad
  apellido_paterno?: string;
  apellido_materno?: string;
  full_name?: string; // Nombre completo calculado por el backend

  email: string;

  // Campo de teléfono (backend usa "phone")
  telefono: string; // Legacy
  phone?: string; // Campo real del backend

  // Campos de dirección
  direccion: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  full_address?: string; // Dirección completa calculada por el backend

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

  // Bank accounts (múltiples cuentas)
  bank_accounts?: BankAccount[];

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
  id?: number;
  user_id?: number;
  origen?: string; // Lima | Provincia
  bank_name: string;
  account_type?: string; // Ahorro | Corriente
  currency?: string; // S/ | $
  account_number: string;
  is_primary?: boolean;
  // Legacy fields
  banco?: string;
  numero_cuenta?: string;
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
  operation_id?: string; // Código único de la operación (ej: "QC-20240115-001")
  codigo_operacion?: string; // Alias del campo operation_id para compatibilidad
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

// Forgot password types
export interface ForgotPasswordRequest {
  dni: string;  // Can be DNI (8), CE (9), or RUC (11) - backend validates length
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// Change password types
export interface ChangePasswordRequest {
  dni: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Operation creation types
export interface CreateOperationRequest {
  dni: string;
  tipo: OperationType;
  monto_soles: number;
  monto_dolares: number;
  banco_cuenta_id: number;
  referral_code?: string; // Código de referido (opcional)
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
