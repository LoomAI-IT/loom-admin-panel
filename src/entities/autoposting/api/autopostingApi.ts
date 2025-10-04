import { contentClient } from '../../../shared/api/contentClient';
import type {
  Autoposting,
  CreateAutopostingRequest,
  UpdateAutopostingRequest,
  AutopostingResponse,
  AutopostingCategory,
  CreateAutopostingCategoryRequest,
  UpdateAutopostingCategoryRequest,
  AutopostingCategoryResponse,
} from '../model/types';

// API для рубрик автопостинга
export const autopostingCategoryApi = {
  create: async (data: CreateAutopostingCategoryRequest): Promise<AutopostingCategoryResponse> => {
    const response = await contentClient.post<AutopostingCategoryResponse>('/publication/autoposting-category', data);
    return response.data;
  },

  getById: async (autopostingCategoryId: number): Promise<AutopostingCategory> => {
    const response = await contentClient.get<AutopostingCategory>(`/publication/autoposting-category/${autopostingCategoryId}`);
    return response.data;
  },

  update: async (autopostingCategoryId: number, data: UpdateAutopostingCategoryRequest): Promise<AutopostingCategoryResponse> => {
    const response = await contentClient.put<AutopostingCategoryResponse>(`/publication/autoposting-category/${autopostingCategoryId}`, data);
    return response.data;
  },

  delete: async (autopostingCategoryId: number): Promise<AutopostingCategoryResponse> => {
    const response = await contentClient.delete<AutopostingCategoryResponse>(`/publication/autoposting-category/${autopostingCategoryId}`);
    return response.data;
  },
};

// API для автопостинга
export const autopostingApi = {
  create: async (data: CreateAutopostingRequest): Promise<AutopostingResponse> => {
    const response = await contentClient.post<AutopostingResponse>('/publication/autoposting', data);
    return response.data;
  },

  getByOrganization: async (organizationId: number): Promise<Autoposting[]> => {
    const response = await contentClient.get<{ autoposting: Autoposting[] }>(`/publication/organization/${organizationId}/autopostings`);
    return response.data.autopostings || [];
  },

  update: async (autopostingId: number, data: UpdateAutopostingRequest): Promise<AutopostingResponse> => {
    const response = await contentClient.put<AutopostingResponse>(`/publication/autoposting/${autopostingId}`, data);
    return response.data;
  },

  delete: async (autopostingId: number): Promise<AutopostingResponse> => {
    const response = await contentClient.delete<AutopostingResponse>(`/publication/autoposting/${autopostingId}`);
    return response.data;
  },
};
