import axios from 'axios';

// Клиент для микросервиса authorization
export const authorizationClient = axios.create({
  baseURL: import.meta.env.VITE_AUTHORIZATION_API_URL || 'http://localhost:8002/api/v1/authorization',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});
