import type {DetailSection, FormSection} from "../../../shared/ui";

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
    setting_category_permission: boolean;
    setting_organization_permission: boolean;
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
    setting_category_permission?: boolean;
    setting_organization_permission?: boolean;
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

export const employeeRoleOptions = [
    {value: EmployeeRole.ADMIN, label: 'Администратор'},
    {value: EmployeeRole.MODERATOR, label: 'Модератор'},
    {value: EmployeeRole.EMPLOYEE, label: 'Сотрудник'},
];

export const employeeCreateFormSections: FormSection[] = [
    {
        title: 'Основная информация',
        fields: [
            {
                name: 'account_id',
                type: 'input',
                label: 'Account ID',
                placeholder: 'Введите ID аккаунта',
                required: true,
                inputType: 'text',
            },
            {
                name: 'name',
                type: 'input',
                label: 'Имя сотрудника',
                placeholder: 'Введите имя сотрудника',
                required: true,
                inputType: 'text',
            },
            {
                name: 'role',
                type: 'select',
                label: 'Роль',
                placeholder: 'Выберите роль',
                required: true,
                options: employeeRoleOptions,
            },
        ],
    },
];

export const employeeEditFormSections: FormSection[] = [
    {
        title: 'Основная информация',
        fields: [
            {
                name: 'name',
                type: 'input',
                label: 'Имя сотрудника',
                placeholder: 'Введите имя сотрудника',
                required: true,
                inputType: 'text',
            },
            {
                name: 'role',
                type: 'select',
                label: 'Роль',
                placeholder: 'Выберите роль',
                required: true,
                options: employeeRoleOptions,
            },
        ],
    },
    {
        title: 'Права доступа',
        fields: [
            {
                name: 'required_moderation',
                type: 'checkbox',
                label: 'Требуется модерация',
            },
            {
                name: 'autoposting_permission',
                type: 'checkbox',
                label: 'Разрешение на автопостинг',
            },
            {
                name: 'add_employee_permission',
                type: 'checkbox',
                label: 'Разрешение на добавление сотрудников',
            },
            {
                name: 'edit_employee_perm_permission',
                type: 'checkbox',
                label: 'Разрешение на редактирование прав сотрудников',
            },
            {
                name: 'top_up_balance_permission',
                type: 'checkbox',
                label: 'Разрешение на пополнение баланса',
            },
            {
                name: 'sign_up_social_net_permission',
                type: 'checkbox',
                label: 'Разрешение на подключение соц. сетей',
            },
            {
                name: 'setting_category_permission',
                type: 'checkbox',
                label: 'Разрешение на настройку рубрик',
            },
            {
                name: 'setting_organization_permission',
                type: 'checkbox',
                label: 'Разрешение на настройку организации',
            },
        ],
    },
];

export const employeeDetailsSections: DetailSection[] = [
    {
        title: 'Основная информация',
        fields: [
            {
                name: 'name',
                label: 'Имя сотрудника',
            },
            {
                name: 'role',
                label: 'Роль',
            },
        ],
    },
    {
        title: 'Права доступа',
        fields: [
            {
                name: 'required_moderation',
                label: 'Требуется модерация',
            },
            {
                name: 'autoposting_permission',
                label: 'Разрешение на автопостинг',
            },
            {
                name: 'add_employee_permission',
                label: 'Разрешение на добавление сотрудников',
            },
            {
                name: 'edit_employee_perm_permission',
                label: 'Разрешение на редактирование прав сотрудников',
            },
            {
                name: 'top_up_balance_permission',
                label: 'Разрешение на пополнение баланса',
            },
            {
                name: 'sign_up_social_net_permission',
                label: 'Разрешение на подключение соц. сетей',
            },
            {
                name: 'setting_category_permission',
                label: 'Разрешение на настройку рубрик',
            },
            {
                name: 'setting_organization_permission',
                label: 'Разрешение на настройку организации',
            },
        ],
    },
];

// User Movement Map Types
export interface UserMovement {
    account_id: string;
    telegram_username: string;
    start_time: string;
    end_time: string;
    duration: string;
    service: string;
    method: string;
}

// API возвращает массив напрямую
export type UserMovementMapResponse = UserMovement[];
