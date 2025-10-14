import axios from 'axios';
import {setupAuthInterceptor} from './base';
import {authorizationClient} from './authorizationClient';

// Клиент для микросервиса employee
export const employeeClient = axios.create({
    baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/employee',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Важно для работы с httpOnly cookies
});

setupAuthInterceptor(employeeClient, authorizationClient);
