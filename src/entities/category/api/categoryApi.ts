import { contentClient } from '../../../shared/api/contentClient';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from '../model/types';

export const categoryApi = {
  create: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await contentClient.post<CategoryResponse>('/publication/category', data);
    return response.data;
  },

  getById: async (categoryId: number): Promise<Category> => {
    const response = await contentClient.get<Category>(`/publication/category/${categoryId}`);
    return response.data;
  },

  getByOrganization: async (organizationId: number): Promise<Category[]> => {
    const response = await contentClient.get<Category[]>(`/publication/organization/${organizationId}/categories`);
    return response.data;
  },

  update: async (categoryId: number, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await contentClient.put<CategoryResponse>(`/publication/category/${categoryId}`, data);
    return response.data;
  },

  delete: async (categoryId: number): Promise<CategoryResponse> => {
    const response = await contentClient.delete<CategoryResponse>(`/publication/category/${categoryId}`);
    return response.data;
  },
};
