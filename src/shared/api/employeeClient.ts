import axios from 'axios';

// Клиент для микросервиса employee
export const employeeClient = axios.create({
  baseURL: import.meta.env.VITE_LOOM_DOMAIN + '/api/employee',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с httpOnly cookies
});
