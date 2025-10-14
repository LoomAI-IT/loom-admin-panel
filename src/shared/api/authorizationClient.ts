import axios from 'axios';

// Клиент для микросервиса authorization
export const authorizationClient = axios.create({
    baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/authorization',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Важно для работы с httpOnly cookies
});
