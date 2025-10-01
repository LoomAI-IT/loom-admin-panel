import { useState, useEffect } from 'react';

interface AuthStore {
  isAuthenticated: boolean;
  accountId: string | null;
  checkAuth: () => boolean;
  login: (accountId: number) => void;
  logout: () => void;
}

// Простой state manager без внешних зависимостей
const AUTH_KEY = 'auth_account_id';

let listeners: Array<() => void> = [];

// Функция для проверки наличия токенов в куках
const hasAuthTokens = (): boolean => {
  const cookies = document.cookie.split(';');
  const hasAccessToken = cookies.some(cookie => cookie.trim().startsWith('access_token='));
  const hasRefreshToken = cookies.some(cookie => cookie.trim().startsWith('refresh_token='));
  return hasAccessToken || hasRefreshToken;
};

const authStore = {
  getState: (): { isAuthenticated: boolean; accountId: string | null } => {
    const accountId = localStorage.getItem(AUTH_KEY);
    const hasTokens = hasAuthTokens();

    // Пользователь аутентифицирован только если есть и accountId, и токены в куках
    const isAuthenticated = !!accountId && hasTokens;

    // Если нет токенов, но есть accountId - очищаем accountId
    if (!hasTokens && accountId) {
      localStorage.removeItem(AUTH_KEY);
      return {
        isAuthenticated: false,
        accountId: null,
      };
    }

    return {
      isAuthenticated,
      accountId: isAuthenticated ? accountId : null,
    };
  },

  login: (accountId: number) => {
    localStorage.setItem(AUTH_KEY, accountId.toString());
    listeners.forEach((listener) => listener());
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    listeners.forEach((listener) => listener());
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export const useAuthStore = (): AuthStore => {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    return authStore.subscribe(() => {
      setState(authStore.getState());
    });
  }, []);

  return {
    isAuthenticated: state.isAuthenticated,
    accountId: state.accountId,
    checkAuth: () => state.isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
  };
};
