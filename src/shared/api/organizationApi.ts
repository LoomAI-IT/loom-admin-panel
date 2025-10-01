import { organizationClient } from './organizationClient';
import type {
    CreateOrganizationRequest,
    CreateOrganizationResponse,
    GetAllOrganizationsResponse,
    UpdateOrganizationRequest,
    UpdateOrganizationResponse,
    DeleteOrganizationResponse,
    Organization,
} from '../types';

export const organizationApi = {
  // Создание организации
  create: async (data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> => {
    const response = await organizationClient.post<CreateOrganizationResponse>('/create', data);
    return response.data;
  },

  // Получение организации по ID
  getById: async (organizationId: number): Promise<Organization> => {
    const response = await organizationClient.get<Organization>(`/${organizationId}`);
    return response.data;
  },

  // Получение всех организаций
  getAll: async (): Promise<GetAllOrganizationsResponse> => {
    const response = await organizationClient.get<GetAllOrganizationsResponse>('/all');
    return response.data;
  },

  // Обновление организации
  update: async (data: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> => {
    const response = await organizationClient.put<UpdateOrganizationResponse>('', data);
    return response.data;
  },

  // Удаление организации
  delete: async (organizationId: number): Promise<DeleteOrganizationResponse> => {
    const response = await organizationClient.delete<DeleteOrganizationResponse>(`/${organizationId}`);
    return response.data;
  },
};
