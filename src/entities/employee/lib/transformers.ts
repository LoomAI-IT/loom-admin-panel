/**
 * Трансформеры для работы с сотрудниками
 * Преобразование между API моделью и формой
 */

import type {
    Employee,
    CreateEmployeeRequest,
    UpdateEmployeePermissionsRequest,
    UpdateEmployeeRoleRequest,
    EmployeeRole,
} from '../model/types';

/**
 * Форма для создания сотрудника
 */
export interface EmployeeCreateFormData {
    account_id: string;
    name: string;
    role: EmployeeRole;
}

/**
 * Форма для редактирования сотрудника (включает permissions)
 */
export interface EmployeeEditFormData {
    name: string;
    role: EmployeeRole;
    required_moderation: boolean;
    autoposting_permission: boolean;
    add_employee_permission: boolean;
    edit_employee_perm_permission: boolean;
    top_up_balance_permission: boolean;
    sign_up_social_net_permission: boolean;
    setting_category_permission: boolean;
    setting_organization_permission: boolean;
}

/**
 * Создает пустую форму создания сотрудника
 */
export const createEmptyEmployeeForm = (): EmployeeCreateFormData => ({
    account_id: '',
    name: '',
    role: 'employee',
});

/**
 * Преобразует Employee в форму для редактирования
 */
export const employeeToEditForm = (employee: Employee): EmployeeEditFormData => ({
    name: employee.name,
    role: employee.role as EmployeeRole,
    required_moderation: employee.required_moderation,
    autoposting_permission: employee.autoposting_permission,
    add_employee_permission: employee.add_employee_permission,
    edit_employee_perm_permission: employee.edit_employee_perm_permission,
    top_up_balance_permission: employee.top_up_balance_permission,
    sign_up_social_net_permission: employee.sign_up_social_net_permission,
    setting_category_permission: employee.setting_category_permission,
    setting_organization_permission: employee.setting_organization_permission,
});

/**
 * Преобразует форму создания в CreateEmployeeRequest
 */
export const formToCreateRequest = (
    formData: EmployeeCreateFormData,
    organizationId: number,
    currentAccountId: number
): CreateEmployeeRequest => ({
    account_id: parseInt(formData.account_id),
    organization_id: organizationId,
    invited_from_account_id: currentAccountId,
    name: formData.name,
    role: formData.role,
});

/**
 * Преобразует форму редактирования в UpdateEmployeeRoleRequest
 */
export const formToUpdateRoleRequest = (
    formData: EmployeeEditFormData,
    accountId: number
): UpdateEmployeeRoleRequest => ({
    account_id: accountId,
    role: formData.role,
});

/**
 * Преобразует форму редактирования в UpdateEmployeePermissionsRequest
 */
export const formToUpdatePermissionsRequest = (
    formData: EmployeeEditFormData,
    accountId: number
): UpdateEmployeePermissionsRequest => ({
    account_id: accountId,
    required_moderation: formData.required_moderation,
    autoposting_permission: formData.autoposting_permission,
    add_employee_permission: formData.add_employee_permission,
    edit_employee_perm_permission: formData.edit_employee_perm_permission,
    top_up_balance_permission: formData.top_up_balance_permission,
    sign_up_social_net_permission: formData.sign_up_social_net_permission,
    setting_category_permission: formData.setting_category_permission,
    setting_organization_permission: formData.setting_organization_permission,
});

/**
 * Валидация формы создания сотрудника
 */
export const validateEmployeeCreateForm = (formData: EmployeeCreateFormData): string | null => {
    if (!formData.account_id.trim()) {
        return 'Account ID обязателен для заполнения';
    }

    const accountId = parseInt(formData.account_id);
    if (isNaN(accountId) || accountId <= 0) {
        return 'Account ID должен быть положительным числом';
    }

    if (!formData.name.trim()) {
        return 'Имя сотрудника обязательно для заполнения';
    }

    return null;
};

/**
 * Валидация формы редактирования сотрудника
 */
export const validateEmployeeEditForm = (formData: EmployeeEditFormData): string | null => {
    if (!formData.name.trim()) {
        return 'Имя сотрудника обязательно для заполнения';
    }

    return null;
};

/**
 * Проверяет, изменились ли permissions
 */
export const hasPermissionsChanged = (
    formData: EmployeeEditFormData,
    employee: Employee
): boolean => {
    return (
        formData.required_moderation !== employee.required_moderation ||
        formData.autoposting_permission !== employee.autoposting_permission ||
        formData.add_employee_permission !== employee.add_employee_permission ||
        formData.edit_employee_perm_permission !== employee.edit_employee_perm_permission ||
        formData.top_up_balance_permission !== employee.top_up_balance_permission ||
        formData.sign_up_social_net_permission !== employee.sign_up_social_net_permission ||
        formData.setting_category_permission !== employee.setting_category_permission ||
        formData.setting_organization_permission !== employee.setting_organization_permission
    );
};

/**
 * Проверяет, изменилась ли роль
 */
export const hasRoleChanged = (formData: EmployeeEditFormData, employee: Employee): boolean => {
    return formData.role !== employee.role;
};

/**
 * Преобразует JSON в форму создания сотрудника (для импорта)
 */
export const jsonToEmployeeCreateForm = (jsonData: any): EmployeeCreateFormData => ({
    account_id: jsonData.account_id?.toString() || '',
    name: jsonData.name || '',
    role: jsonData.role || 'employee',
});

/**
 * Преобразует JSON в форму редактирования сотрудника (для импорта)
 */
export const jsonToEmployeeEditForm = (jsonData: any): EmployeeEditFormData => ({
    name: jsonData.name || '',
    role: jsonData.role || 'employee',
    required_moderation: jsonData.required_moderation ?? false,
    autoposting_permission: jsonData.autoposting_permission ?? false,
    add_employee_permission: jsonData.add_employee_permission ?? false,
    edit_employee_perm_permission: jsonData.edit_employee_perm_permission ?? false,
    top_up_balance_permission: jsonData.top_up_balance_permission ?? false,
    sign_up_social_net_permission: jsonData.sign_up_social_net_permission ?? false,
    setting_category_permission: jsonData.setting_category_permission ?? false,
    setting_organization_permission: jsonData.setting_organization_permission ?? false,
});
