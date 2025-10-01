import { employeeClient } from './employeeClient';
import type {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
  GetEmployeesByOrganizationResponse,
  UpdateEmployeePermissionsRequest,
  UpdateEmployeePermissionsResponse,
  UpdateEmployeeRoleRequest,
  UpdateEmployeeRoleResponse,
  DeleteEmployeeResponse,
  Employee,
} from '../types';

export const employeeApi = {
  // Создание сотрудника
  create: async (data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> => {
    const response = await employeeClient.post<CreateEmployeeResponse>('/create', data);
    return response.data;
  },

  // Получение сотрудника по account_id
  getByAccountId: async (accountId: number): Promise<Employee[]> => {
    const response = await employeeClient.get<Employee[]>(`/account/${accountId}`);
    return response.data;
  },

  // Получение всех сотрудников организации
  getByOrganization: async (organizationId: number): Promise<GetEmployeesByOrganizationResponse> => {
    const response = await employeeClient.get<GetEmployeesByOrganizationResponse>(
      `/organization/${organizationId}/employees`
    );
    return response.data;
  },

  // Обновление прав сотрудника
  updatePermissions: async (
    data: UpdateEmployeePermissionsRequest
  ): Promise<UpdateEmployeePermissionsResponse> => {
    const response = await employeeClient.put<UpdateEmployeePermissionsResponse>('/permissions', data);
    return response.data;
  },

  // Обновление роли сотрудника
  updateRole: async (data: UpdateEmployeeRoleRequest): Promise<UpdateEmployeeRoleResponse> => {
    const response = await employeeClient.put<UpdateEmployeeRoleResponse>('/role', data);
    return response.data;
  },

  // Удаление сотрудника
  delete: async (accountId: number): Promise<DeleteEmployeeResponse> => {
    const response = await employeeClient.delete<DeleteEmployeeResponse>(`/${accountId}`);
    return response.data;
  },
};
