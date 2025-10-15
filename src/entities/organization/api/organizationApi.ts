import {organizationClient} from '../../../shared/api';
import type {
    CostMultiplier,
    CreateOrganizationRequest,
    CreateOrganizationResponse,
    DeleteOrganizationResponse,
    GetAllOrganizationsResponse,
    Organization,
    UpdateCostMultiplierRequest,
    UpdateOrganizationRequest,
    UpdateOrganizationResponse,
} from '../model/types';

export const organizationApi = {
    create: async (data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> => {
        const response = await organizationClient.post<CreateOrganizationResponse>('/create', data);
        return response.data;
    },

    getById: async (organizationId: number): Promise<Organization> => {
        const response = await organizationClient.get<Organization>(`/${organizationId}`);
        return response.data;
    },

    getAll: async (): Promise<GetAllOrganizationsResponse> => {
        const response = await organizationClient.get<GetAllOrganizationsResponse>('/all');
        return response.data;
    },

    update: async (data: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> => {
        const response = await organizationClient.put<UpdateOrganizationResponse>('', data);
        return response.data;
    },

    delete: async (organizationId: number): Promise<DeleteOrganizationResponse> => {
        const response = await organizationClient.delete<DeleteOrganizationResponse>(`/${organizationId}`);
        return response.data;
    },

    getCostMultiplier: async (organizationId: number): Promise<CostMultiplier> => {
        const response = await organizationClient.get<CostMultiplier>(`/cost-multiplier/${organizationId}`);
        return response.data;
    },

    updateCostMultiplier: async (data: UpdateCostMultiplierRequest): Promise<void> => {
        await organizationClient.put('/cost-multiplier', data);
    },
};
