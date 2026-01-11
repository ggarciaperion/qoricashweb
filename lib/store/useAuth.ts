/**
 * Hook de Autenticación usando Zustand
 * Maneja el estado global de autenticación del cliente
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, Client } from '../services/authService';

interface AuthState {
  client: Client | null;
  isAuthenticated: boolean;
  requiresPasswordChange: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (dni: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (dni: string) => Promise<boolean>;
  clearError: () => void;
  setClient: (client: Client | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      client: null,
      isAuthenticated: false,
      requiresPasswordChange: false,
      isLoading: false,
      error: null,

      login: async (dni: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login({ dni, password });

          if (response.success && response.client) {
            set({
              client: response.client,
              isAuthenticated: true,
              requiresPasswordChange: response.requires_password_change || false,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Error al iniciar sesión',
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Error inesperado al iniciar sesión',
          });
          return false;
        }
      },

      logout: async () => {
        const { client } = get();

        if (client) {
          await authService.logout(client.dni);
        }

        set({
          client: null,
          isAuthenticated: false,
          requiresPasswordChange: false,
          error: null,
        });
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { client } = get();

        if (!client) {
          set({ error: 'No hay cliente autenticado' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authService.changePassword({
            dni: client.dni,
            current_password: currentPassword,
            new_password: newPassword,
          });

          if (response.success) {
            set({
              requiresPasswordChange: false,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Error al cambiar contraseña',
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Error inesperado al cambiar contraseña',
          });
          return false;
        }
      },

      forgotPassword: async (dni: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.forgotPassword({ dni });

          if (response.success) {
            set({
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || 'Error al recuperar contraseña',
            });
            return false;
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Error inesperado al recuperar contraseña',
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setClient: (client: Client | null) => {
        set({ client });
      },
    }),
    {
      name: 'qoricash-auth-storage',
      partialize: (state) => ({
        client: state.client,
        isAuthenticated: state.isAuthenticated,
        requiresPasswordChange: state.requiresPasswordChange,
      }),
    }
  )
);
