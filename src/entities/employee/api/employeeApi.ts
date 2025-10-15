import {employeeClient} from '../../../shared/api';
import type {
    CreateEmployeeRequest,
    CreateEmployeeResponse,
    DeleteEmployeeResponse,
    Employee,
    GetEmployeesByOrganizationResponse,
    UpdateEmployeePermissionsRequest,
    UpdateEmployeePermissionsResponse,
    UpdateEmployeeRoleRequest,
    UpdateEmployeeRoleResponse,
} from '../model/types';

export const employeeApi = {
    create: async (data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> => {
        const response = await employeeClient.post<CreateEmployeeResponse>('/create', data);
        return response.data;
    },

    getByAccountId: async (accountId: number): Promise<Employee[]> => {
        const response = await employeeClient.get<Employee[]>(`/account/${accountId}`);
        return response.data;
    },

    getByOrganization: async (organizationId: number): Promise<GetEmployeesByOrganizationResponse> => {
        const response = await employeeClient.get<GetEmployeesByOrganizationResponse>(
            `/organization/${organizationId}/employees`
        );
        return response.data;
    },

    updatePermissions: async (
        data: UpdateEmployeePermissionsRequest
    ): Promise<UpdateEmployeePermissionsResponse> => {
        const response = await employeeClient.put<UpdateEmployeePermissionsResponse>('/permissions', data);
        return response.data;
    },

    updateRole: async (data: UpdateEmployeeRoleRequest): Promise<UpdateEmployeeRoleResponse> => {
        const response = await employeeClient.put<UpdateEmployeeRoleResponse>('/role', data);
        return response.data;
    },

    delete: async (accountId: number): Promise<DeleteEmployeeResponse> => {
        const response = await employeeClient.delete<DeleteEmployeeResponse>(`/${accountId}`);
        return response.data;
    },
};
