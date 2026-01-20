import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '../api/auth';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login(credentials);

      if (response.success && response.client) {
        const user = response.client;

        // Store in localStorage
        authApi.storeAuth(user);

        // Update state
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        set({
          error: response.message || 'Error al iniciar sesión',
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Error al iniciar sesión. Verifica tus credenciales.';

      set({
        error: errorMessage,
        isLoading: false,
      });

      return false;
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.register(data);

      if (response.success) {
        set({
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        set({
          error: response.message || 'Error al registrar usuario',
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Error al registrar. Intenta nuevamente.';

      set({
        error: errorMessage,
        isLoading: false,
      });

      return false;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    set({ isLoading: true });

    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Load user from localStorage on app start
   */
  loadUser: () => {
    const user = authApi.getStoredUser();
    const isAuthenticated = authApi.isAuthenticated();

    if (user && isAuthenticated) {
      set({
        user,
        isAuthenticated: true,
      });
    }
  },

  /**
   * Update user data
   */
  updateUser: (user: User) => {
    authApi.storeAuth(user);
    set({ user });
  },

  /**
   * Refresh user data from backend
   */
  refreshUser: async (): Promise<boolean> => {
    const currentUser = get().user;

    console.log('🔄 [AuthStore] refreshUser() iniciado');
    console.log('📋 [AuthStore] Usuario actual:', currentUser?.dni);

    if (!currentUser?.dni) {
      console.error('❌ [AuthStore] No hay DNI del usuario actual');
      return false;
    }

    try {
      console.log('📡 [AuthStore] Llamando a authApi.refreshUserData()...');
      const response = await authApi.refreshUserData(currentUser.dni);

      console.log('📦 [AuthStore] Respuesta del servidor:', {
        success: response.success,
        status: response.client?.status,
        has_complete_documents: response.client?.has_complete_documents
      });

      if (response.success && response.client) {
        const updatedUser = response.client;

        // Update localStorage and state
        console.log('💾 [AuthStore] Actualizando localStorage y state...');
        authApi.storeAuth(updatedUser);
        set({ user: updatedUser });

        console.log('✅ [AuthStore] Usuario actualizado exitosamente');
        return true;
      }

      console.warn('⚠️ [AuthStore] Respuesta inválida del servidor');
      return false;
    } catch (error) {
      console.error('❌ [AuthStore] Error refreshing user data:', error);
      return false;
    }
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}),
    {
      name: 'qoricash-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
