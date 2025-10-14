export const EmployeeRole = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    EMPLOYEE: 'employee',
} as const;

export type EmployeeRole = typeof EmployeeRole[keyof typeof EmployeeRole];

export interface Employee {
    id: number;
    organization_id: number;
    account_id: number;
    invited_from_account_id: number;
    required_moderation: boolean;
    autoposting_permission: boolean;
    add_employee_permission: boolean;
    edit_employee_perm_permission: boolean;
    top_up_balance_permission: boolean;
    sign_up_social_net_permission: boolean;
    name: string;
    role: string;
    created_at: string;
}

export interface CreateEmployeeRequest {
    account_id: number;
    organization_id: number;
    invited_from_account_id: number;
    name: string;
    role: string;
}

export interface UpdateEmployeePermissionsRequest {
    account_id: number;
    required_moderation?: boolean;
    autoposting_permission?: boolean;
    add_employee_permission?: boolean;
    edit_employee_perm_permission?: boolean;
    top_up_balance_permission?: boolean;
    sign_up_social_net_permission?: boolean;
}

export interface UpdateEmployeeRoleRequest {
    account_id: number;
    role: string;
}

export interface CreateEmployeeResponse {
    message: string;
    employee_id: number;
}

export interface GetEmployeesByOrganizationResponse {
    message: string;
    employees: Employee[];
}

export interface UpdateEmployeePermissionsResponse {
    message: string;
}

export interface UpdateEmployeeRoleResponse {
    message: string;
}

export interface DeleteEmployeeResponse {
    message: string;
}
