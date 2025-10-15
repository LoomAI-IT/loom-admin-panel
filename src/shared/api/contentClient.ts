import axios from 'axios';
import {setupAuthInterceptor} from './base';
import {authorizationClient} from './authorizationClient';

// Клиент для микросервиса content
export const contentClient = axios.create({
    baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/content',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

setupAuthInterceptor(contentClient, authorizationClient);
