import axios from 'axios';
import {setupAuthInterceptor} from './base';
import {authorizationClient} from './authorizationClient';

// Клиент для internal-dashboard API
export const internalDashboardClient = axios.create({
    baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/internal-dashboard',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Важно для работы с httpOnly cookies
});

setupAuthInterceptor(internalDashboardClient, authorizationClient);
