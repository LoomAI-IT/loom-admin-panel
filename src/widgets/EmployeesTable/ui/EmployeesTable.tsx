import * as React from 'react';
import {useCallback, useState} from 'react';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Employee,
    type EmployeeCreateFormData,
    type EmployeeEditFormData,
    employeeApi,
    employeeCreateFormSections,
    employeeEditFormSections,
    employeeDetailsSections,
    employeeToEditForm,
    createEmptyEmployeeForm,
    formToCreateRequest,
    formToUpdateRoleRequest,
    formToUpdatePermissionsRequest,
    validateEmployeeCreateForm,
    validateEmployeeEditForm,
    jsonToEmployeeCreateForm,
    jsonToEmployeeEditForm,
    hasPermissionsChanged,
    hasRoleChanged,
} from '../../../entities/employee';

import {
    type DataTableAction,
    type DataTableColumn,
    DataTable,
    DetailsViewer,
    FormBuilder,
} from '../../../shared/ui';

import {
    useConfirmDialog,
    useModal,
    useNotification
} from '../../../shared/lib/hooks';

interface EmployeesTableProps {
    organizationId: number;
}

export const EmployeesTable = ({organizationId}: EmployeesTableProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const [createFormData, setCreateFormData] = useState<EmployeeCreateFormData>(createEmptyEmployeeForm());
    const [editFormData, setEditFormData] = useState<EmployeeEditFormData>({
        name: '',
        role: 'employee',
        required_moderation: false,
        autoposting_permission: false,
        add_employee_permission: false,
        edit_employee_perm_permission: false,
        top_up_balance_permission: false,
        sign_up_social_net_permission: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();
    const editModal = useModal();
    const detailsModal = useModal();

    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeApi.getByOrganization(organizationId);
            setEmployees(response.employees);
        } catch (err) {
            setError('Ошибка при загрузке сотрудников');
            console.error('Failed to load employees:', err);
        } finally {
            setLoading(false);
        }
    }, [organizationId]);

    React.useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const handleOpenAddModal = () => {
        setCreateFormData(createEmptyEmployeeForm());
        addModal.open();
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditFormData(employeeToEditForm(employee));
        editModal.open();
    };

    const handleOpenDetails = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditFormData(employeeToEditForm(employee));
        detailsModal.open();
    };

    const handleDelete = (employee: Employee) => {
        confirmDialog.confirm({
            title: 'Удалить сотрудника',
            message: `Вы уверены, что хотите удалить сотрудника "${employee.name}"?`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await employeeApi.delete(employee.account_id);
                    notification.success('Сотрудник успешно удален');
                    await loadEmployees();
                } catch (err) {
                    notification.error('Ошибка при удалении сотрудника');
                    console.error('Failed to delete employee:', err);
                }
            },
        });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateEmployeeCreateForm(createFormData);
        if (validationError) {
            notification.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            // TODO: Replace with actual current account ID from auth context
            const currentAccountId = 1;
            const request = formToCreateRequest(createFormData, organizationId, currentAccountId);
            await employeeApi.create(request);
            notification.success('Сотрудник успешно создан');
            await loadEmployees();
            addModal.close();
        } catch (err) {
            notification.error('Ошибка при создании сотрудника');
            console.error('Failed to create employee:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEmployee) {
            notification.error('Сотрудник не выбран');
            return;
        }

        const validationError = validateEmployeeEditForm(editFormData);
        if (validationError) {
            notification.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);

            const roleChanged = hasRoleChanged(editFormData, selectedEmployee);
            const permissionsChanged = hasPermissionsChanged(editFormData, selectedEmployee);

            if (roleChanged) {
                const roleRequest = formToUpdateRoleRequest(editFormData, selectedEmployee.account_id);
                await employeeApi.updateRole(roleRequest);
            }

            if (permissionsChanged) {
                const permissionsRequest = formToUpdatePermissionsRequest(editFormData, selectedEmployee.account_id);
                await employeeApi.updatePermissions(permissionsRequest);
            }

            notification.success('Сотрудник успешно обновлен');
            await loadEmployees();
            editModal.close();
        } catch (err) {
            notification.error('Ошибка при обновлении сотрудника');
            console.error('Failed to update employee:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: DataTableColumn<Employee>[] = [
        {
            header: 'ID',
            key: 'id',
        },
        {
            header: 'Имя',
            render: (employee) => <span>{employee.name}</span>,
        },
        {
            header: 'Роль',
            render: (employee) => <span>{employee.role}</span>,
        },
        {
            header: 'Дата создания',
            render: (employee) => (
                <span>{new Date(employee.created_at).toLocaleDateString('ru-RU')}</span>
            ),
        },
    ];

    const actions: DataTableAction<Employee>[] = [
        {
            label: 'Детали',
            onClick: handleOpenDetails,
            variant: 'secondary',
        },
        {
            label: 'Редактировать',
            onClick: handleEdit,
        },
        {
            label: 'Удалить',
            onClick: handleDelete,
            variant: 'danger',
        },
    ];

    return (
        <>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
            />

            <ConfirmDialog
                dialog={confirmDialog.dialog}
                isProcessing={confirmDialog.isProcessing}
                onConfirm={confirmDialog.handleConfirm}
                onCancel={confirmDialog.handleCancel}
            />

            <DataTable<Employee>
                title="Сотрудники"
                data={employees}
                columns={columns}
                actions={actions}
                loading={loading}
                error={error}
                emptyMessage="Сотрудники не найдены"
                onAdd={handleOpenAddModal}
                addButtonLabel="Добавить сотрудника"
                getRowKey={(employee) => employee.id}
            />

            <FormBuilder<EmployeeCreateFormData>
                title="Добавить сотрудника"
                sections={employeeCreateFormSections}
                values={createFormData}
                isSubmitting={isSubmitting}
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={handleCreateSubmit}
                jsonToForm={jsonToEmployeeCreateForm}
                setFormData={setCreateFormData}
            />

            <FormBuilder<EmployeeEditFormData>
                title="Редактирование сотрудника"
                sections={employeeEditFormSections}
                values={editFormData}
                isSubmitting={isSubmitting}
                isOpen={editModal.isOpen}
                onClose={editModal.close}
                onSubmit={handleEditSubmit}
                jsonToForm={jsonToEmployeeEditForm}
                setFormData={setEditFormData}
            />

            <DetailsViewer<EmployeeEditFormData>
                title="Просмотр сотрудника"
                organizationId={organizationId}
                sections={employeeDetailsSections}
                values={editFormData}
                isOpen={detailsModal.isOpen}
                onClose={detailsModal.close}
            />
        </>
    );
};
