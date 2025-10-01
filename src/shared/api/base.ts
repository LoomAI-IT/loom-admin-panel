import axios from 'axios';
import { authorizationClient } from './authorizationClient';

// Базовый клиент API с поддержкой cookies
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_LOOM_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});

// Интерцептор для обработки ошибок и автоматического refresh токена
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если получили 403 и это не повторный запрос
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен через authorization-сервис
        await authorizationClient.post('/refresh');

        // Повторяем оригинальный запрос
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Если refresh не удался, перенаправляем на логин
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
