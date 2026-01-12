/**
 * Servicio de Autenticación para Clientes
 * Maneja login, logout, cambio de contraseña y recuperación
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LoginRequest {
  dni: string;
  password: string;
}

export interface ChangePasswordRequest {
  dni: string;
  current_password?: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  dni: string;
}

export interface Client {
  id: number;
  dni: string;
  document_type: string;
  full_name?: string;
  razon_social?: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  created_by: number;
  requires_password_change?: boolean;
  bank_accounts?: any[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  client?: Client;
  requires_password_change?: boolean;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Login de cliente con DNI y contraseña
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('🔐 [authService] Attempting login with:', { dni: credentials.dni });
      console.log('🔐 [authService] API URL:', `${API_BASE_URL}/api/client/login`);

      const response = await axios.post(
        `${API_BASE_URL}/api/client/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ [authService] Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [authService] Login error:', error);
      console.error('❌ [authService] Error response:', error.response?.data);

      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión',
      };
    }
  },

  /**
   * Cambiar contraseña del cliente
   */
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<GenericResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client/change-password`,
        data,
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
        message: error.message || 'Error al cambiar contraseña',
      };
    }
  },

  /**
   * Recuperar contraseña (envía email con contraseña temporal)
   */
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<GenericResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client/forgot-password`,
        data,
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
        message: error.message || 'Error al recuperar contraseña',
      };
    }
  },

  /**
   * Logout del cliente
   */
  logout: async (dni: string): Promise<GenericResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client/logout`,
        { dni },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      // El logout local siempre funciona aunque falle el servidor
      return {
        success: true,
        message: 'Sesión cerrada',
      };
    }
  },
};
