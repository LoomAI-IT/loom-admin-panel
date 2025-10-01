// Базовые типы для всего приложения

export interface User {
  account_id: number;
  login: string;
  role: string;
  two_fa_status: boolean;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  account_id: number;
}

export interface AuthorizationResponse {
  access_token: string;
  refresh_token: string;
}

export interface CheckAuthResponse {
  account_id: number;
  two_fa_status: boolean;
  role: string;
  message: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export * from './organization';
