import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Базовый клиент API с поддержкой cookies
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_LOOM_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});

// Интерцептор для обработки ошибок и автоматического refresh токена
export const setupAuthInterceptor = (client: AxiosInstance, authClient: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Если получили 401 или 403 и это не повторный запрос
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Пытаемся обновить токен через authorization-сервис
          await authClient.post('/refresh');

          // Повторяем оригинальный запрос
          return client(originalRequest);
        } catch (refreshError) {
          // Если refresh не удался, очищаем localStorage и перенаправляем на логин
          localStorage.removeItem('auth_account_id');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
