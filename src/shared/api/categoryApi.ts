import { contentClient } from './contentClient';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from '../types/category';

export const categoryApi = {
  // Создание рубрики
  create: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await contentClient.post<CategoryResponse>('/publication/category', data);
    return response.data;
  },

  // Получение рубрики по ID
  getById: async (categoryId: number): Promise<Category> => {
    const response = await contentClient.get<Category>(`/publication/category/${categoryId}`);
    return response.data;
  },

  // Получение рубрик по организации
  getByOrganization: async (organizationId: number): Promise<Category[]> => {
    const response = await contentClient.get<Category[]>(`/publication/organization/${organizationId}/categories`);
    return response.data;
  },

  // Обновление рубрики
  update: async (categoryId: number, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await contentClient.put<CategoryResponse>(`/publication/category/${categoryId}`, data);
    return response.data;
  },

  // Удаление рубрики
  delete: async (categoryId: number): Promise<CategoryResponse> => {
    const response = await contentClient.delete<CategoryResponse>(`/publication/category/${categoryId}`);
    return response.data;
  },
};
