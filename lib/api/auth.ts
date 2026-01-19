import { apiClient, ApiResponse } from '../api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types';

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Login user (cliente web)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/client/login', credentials);
    return response.data;
  },

  /**
   * Register new client
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', {
      ...data,
      role: 'Cliente', // Default role for web registrations
    });
    return response.data;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/logout');

    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }

    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Verify email with activation token
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Refresh current user data from backend
   */
  async refreshUserData(dni: string): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>('/api/client/me', { dni });
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Store user data and token
   */
  storeAuth(user: User, token?: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('authToken', token);
    }
  },
};
