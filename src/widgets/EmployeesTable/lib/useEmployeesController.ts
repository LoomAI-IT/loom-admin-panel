import {useState, type FormEvent} from 'react';
import {
    type Employee,
    type EmployeeCreateFormData,
    type EmployeeEditFormData,
    employeeToEditForm,
    createEmptyEmployeeForm,
    formToCreateRequest,
    formToUpdateRoleRequest,
    formToUpdatePermissionsRequest,
    validateEmployeeCreateForm,
    validateEmployeeEditForm,
    hasPermissionsChanged,
    hasRoleChanged,
} from '../../../entities/employee';
import {
    useConfirmDialog,
    useModal,
    useNotification,
} from '../../../shared/lib/hooks';
import {useEmployeesModel} from '../model/useEmployeesModel';

interface UseEmployeesControllerProps {
    organizationId: number;
}

export const useEmployeesController = ({
    organizationId,
}: UseEmployeesControllerProps) => {
    const model = useEmployeesModel({organizationId});

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );

    const [createFormData, setCreateFormData] =
        useState<EmployeeCreateFormData>(createEmptyEmployeeForm());
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
                    await model.deleteEmployee(employee.account_id);
                    notification.success('Сотрудник успешно удален');
                    await model.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении сотрудника');
                    console.error('Failed to delete employee:', err);
                }
            },
        });
    };

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validationError = validateEmployeeCreateForm(createFormData);
        if (validationError) {
            notification.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            // TODO: Replace with actual current account ID from auth context
            const currentAccountId = 0;
            const request = formToCreateRequest(
                createFormData,
                organizationId,
                currentAccountId
            );
            await model.createEmployee(request);
            notification.success('Сотрудник успешно создан');
            await model.refresh();
            addModal.close();
        } catch (err) {
            notification.error('Ошибка при создании сотрудника');
            console.error('Failed to create employee:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e: FormEvent) => {
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
            const permissionsChanged = hasPermissionsChanged(
                editFormData,
                selectedEmployee
            );

            if (roleChanged) {
                const roleRequest = formToUpdateRoleRequest(
                    editFormData,
                    selectedEmployee.account_id
                );
                await model.updateEmployeeRole(roleRequest);
            }

            if (permissionsChanged) {
                const permissionsRequest = formToUpdatePermissionsRequest(
                    editFormData,
                    selectedEmployee.account_id
                );
                await model.updateEmployeePermissions(permissionsRequest);
            }

            notification.success('Сотрудник успешно обновлен');
            await model.refresh();
            editModal.close();
        } catch (err) {
            notification.error('Ошибка при обновлении сотрудника');
            console.error('Failed to update employee:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Data from model
        employees: model.employees,
        loading: model.loading,
        error: model.error,

        // Form state
        createFormData,
        setCreateFormData,
        editFormData,
        setEditFormData,
        isSubmitting,

        // Modal state
        addModal,
        editModal,
        detailsModal,

        // Notification state
        notification,

        // Confirm dialog state
        confirmDialog,

        // Handlers
        handleOpenAddModal,
        handleEdit,
        handleOpenDetails,
        handleDelete,
        handleCreateSubmit,
        handleEditSubmit,

        // Organization ID (for passing to child components)
        organizationId,
    };
};
