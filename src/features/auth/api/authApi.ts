import { accountClient, authorizationClient } from '../../../shared/api';
import type { LoginCredentials, LoginResponse } from '../model/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const loginResponse = await accountClient.post<LoginResponse>('/login', credentials);
    return loginResponse.data;
  },

  refreshToken: async (): Promise<void> => {
    await authorizationClient.post('/refresh');
  },
};
