import { apiClient } from '../../../shared/api';
import type { LoginCredentials, LoginResponse } from '../../../shared/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  refreshToken: async (): Promise<void> => {
    await apiClient.post('/refresh-token');
  },
};
