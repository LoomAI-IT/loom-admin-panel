import axios from 'axios';

// Клиент для микросервиса account
export const accountClient = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_API_URL || 'http://localhost:8001/api/v1/account',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});
