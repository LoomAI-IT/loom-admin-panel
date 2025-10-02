import axios from 'axios';
import { setupAuthInterceptor } from './base';
import { authorizationClient } from './authorizationClient';

// Клиент для микросервиса account
export const accountClient = axios.create({
  baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/account',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});

setupAuthInterceptor(accountClient, authorizationClient);
