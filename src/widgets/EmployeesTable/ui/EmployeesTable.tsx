import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';
import {UserMovementMap} from '../../../features/user-movement-map';

import {
    type Employee,
    type EmployeeCreateFormData,
    type EmployeeEditFormData,
    employeeCreateFormSections,
    employeeEditFormSections,
    employeeDetailsSections,
    jsonToEmployeeCreateForm,
    jsonToEmployeeEditForm,
} from '../../../entities/employee';

import {
    type DataTableAction,
    type DataTableColumn,
    DataTable,
    DetailsViewer,
    FormBuilder,
    Button,
} from '../../../shared/ui';

import {useEmployeesController} from '../lib/useEmployeesController';

interface EmployeesTableProps {
    organizationId: number;
}

export const EmployeesTable = ({organizationId}: EmployeesTableProps) => {
    const controller = useEmployeesController({organizationId});

    const columns: DataTableColumn<Employee>[] = [
        {
            header: 'ID',
            key: 'account_id',
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
                <span>
                    {new Date(employee.created_at).toLocaleDateString('ru-RU')}
                </span>
            ),
        },
    ];

    const actions: DataTableAction<Employee>[] = [
        {
            label: 'Редактировать',
            onClick: controller.handleEdit,
        },
        {
            label: 'Удалить',
            onClick: controller.handleDelete,
            variant: 'danger',
        },
    ];

    return (
        <>
            <NotificationContainer
                notifications={controller.notification.notifications}
                onRemove={controller.notification.remove}
            />

            <ConfirmDialog
                dialog={controller.confirmDialog.dialog}
                isProcessing={controller.confirmDialog.isProcessing}
                onConfirm={controller.confirmDialog.handleConfirm}
                onCancel={controller.confirmDialog.handleCancel}
            />

            <DataTable<Employee>
                title="Сотрудники"
                data={controller.employees}
                columns={columns}
                actions={actions}
                loading={controller.loading}
                error={controller.error}
                emptyMessage="Сотрудники не найдены"
                onAdd={controller.handleOpenAddModal}
                addButtonLabel="Добавить сотрудника"
                getRowKey={(employee) => employee.id}
                onRowClick={controller.handleOpenDetails}
            />

            <FormBuilder<EmployeeCreateFormData>
                title="Добавить сотрудника"
                sections={employeeCreateFormSections}
                values={controller.createFormData}
                isSubmitting={controller.isSubmitting}
                isOpen={controller.addModal.isOpen}
                onClose={controller.addModal.close}
                onSubmit={controller.handleCreateSubmit}
                jsonToForm={jsonToEmployeeCreateForm}
                setFormData={controller.setCreateFormData}
            />

            <FormBuilder<EmployeeEditFormData>
                title="Редактирование сотрудника"
                sections={employeeEditFormSections}
                values={controller.editFormData}
                isSubmitting={controller.isSubmitting}
                isOpen={controller.editModal.isOpen}
                onClose={controller.editModal.close}
                onSubmit={controller.handleEditSubmit}
                jsonToForm={jsonToEmployeeEditForm}
                setFormData={controller.setEditFormData}
            />

            <DetailsViewer<EmployeeEditFormData>
                title="Просмотр сотрудника"
                organizationId={controller.organizationId}
                sections={employeeDetailsSections}
                values={controller.editFormData}
                isOpen={controller.detailsModal.isOpen}
                onClose={controller.detailsModal.close}
                footerActions={
                    <Button
                        variant="primary"
                        onClick={controller.movementMapModal.open}
                        size="small"
                    >
                        Карта перемещений
                    </Button>
                }
            />

            {controller.selectedEmployee && (
                <UserMovementMap
                    accountId={controller.selectedEmployee.account_id}
                    isOpen={controller.movementMapModal.isOpen}
                    onClose={controller.movementMapModal.close}
                />
            )}
        </>
    );
};
