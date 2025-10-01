import { accountClient, authorizationClient } from '../../../shared/api';
import type { LoginCredentials, LoginResponse, AuthorizationResponse } from '../../../shared/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Шаг 1: Логин через account-сервис
    const loginResponse = await accountClient.post<LoginResponse>('/login', credentials);

    // Шаг 2: Получение токенов через authorization-сервис
    await authorizationClient.post<AuthorizationResponse>('/', {
      account_id: loginResponse.data.account_id,
      two_fa_status: false, // TODO: поддержка 2FA
      role: 'user', // TODO: получить роль из профиля
    });

    return loginResponse.data;
  },

  refreshToken: async (): Promise<void> => {
    await authorizationClient.post('/refresh');
  },
};
