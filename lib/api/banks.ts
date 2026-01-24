import { apiClient, ApiResponse } from '../api';
import type { BankAccount } from '../types';

/**
 * Bank Accounts API Service
 */
export const banksApi = {
  /**
   * Get all bank accounts for current user
   */
  async getMyAccounts(dni: string): Promise<ApiResponse<BankAccount[]>> {
    const response = await apiClient.post<ApiResponse<BankAccount[]>>('/api/web/my-accounts', { dni });
    return response.data;
  },

  /**
   * Get bank account by ID
   */
  async getAccount(id: number): Promise<ApiResponse<BankAccount>> {
    const response = await apiClient.get<ApiResponse<BankAccount>>(`/api/banks/${id}`);
    return response.data;
  },

  /**
   * Add new bank account
   */
  async addAccount(data: {
    dni: string;
    bank_name: string;
    account_number: string;
    account_type: 'Ahorro' | 'Corriente';
    currency: 'S/' | '$';
    origen: 'Lima' | 'Provincia';
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/api/web/add-bank-account', data);
    return response.data;
  },

  /**
   * Remove bank account by index
   */
  async removeAccount(dni: string, accountIndex: number): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/api/web/remove-bank-account', {
      dni,
      account_index: accountIndex
    });
    return response.data;
  },

  /**
   * Update bank account
   */
  async updateAccount(
    id: number,
    data: Partial<BankAccount>
  ): Promise<ApiResponse<BankAccount>> {
    const response = await apiClient.put<ApiResponse<BankAccount>>(`/api/banks/${id}`, data);
    return response.data;
  },

  /**
   * Delete bank account
   */
  async deleteAccount(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/api/banks/${id}`);
    return response.data;
  },

  /**
   * Set account as primary
   */
  async setPrimaryAccount(id: number): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>(`/api/banks/${id}/set-primary`);
    return response.data;
  },

  /**
   * Get available banks list
   */
  getBanksList(): Array<{ value: string; label: string; requiresCCI?: boolean }> {
    return [
      { value: 'BCP', label: 'BCP', requiresCCI: false },
      { value: 'INTERBANK', label: 'INTERBANK', requiresCCI: false },
      { value: 'PICHINCHA', label: 'PICHINCHA', requiresCCI: false },
      { value: 'BANBIF', label: 'BANBIF', requiresCCI: false },
      { value: 'BBVA', label: 'BBVA', requiresCCI: true },
      { value: 'SCOTIABANK', label: 'SCOTIABANK', requiresCCI: true },
      { value: 'OTROS', label: 'OTROS', requiresCCI: true },
    ];
  },

  /**
   * Validate account number based on bank
   */
  validateAccountNumber(banco: string, numeroCuenta: string): {
    isValid: boolean;
    error?: string;
  } {
    const banksRequiringCCI = ['BBVA', 'SCOTIABANK', 'OTROS'];

    if (banksRequiringCCI.includes(banco)) {
      // CCI must be exactly 20 digits
      if (!/^\d{20}$/.test(numeroCuenta)) {
        return {
          isValid: false,
          error: `Para ${banco} debes ingresar un CCI de exactamente 20 dígitos`,
        };
      }
    } else {
      // Regular account number (13-20 digits)
      if (!/^\d{13,20}$/.test(numeroCuenta)) {
        return {
          isValid: false,
          error: 'El número de cuenta debe tener entre 13 y 20 dígitos',
        };
      }
    }

    return { isValid: true };
  },
};
