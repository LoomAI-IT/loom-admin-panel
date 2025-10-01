import axios from 'axios';

// Клиент для микросервиса content
export const contentClient = axios.create({
  baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/content',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
