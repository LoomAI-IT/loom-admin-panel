import axios from 'axios';

// Клиент для микросервиса organization
export const organizationClient = axios.create({
  baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/organization',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});
