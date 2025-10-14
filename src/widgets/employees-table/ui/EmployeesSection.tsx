import {useState} from 'react';
import {
    createEmptyEmployeeForm,
    type Employee,
    employeeApi,
    type EmployeeCreateFormData,
    type EmployeeEditFormData,
    employeeToEditForm,
    formToCreateRequest,
    formToUpdatePermissionsRequest,
    formToUpdateRoleRequest,
    hasPermissionsChanged,
    hasRoleChanged,
    validateEmployeeCreateForm,
    validateEmployeeEditForm,
} from '../../../entities/employee';
import {Button, Modal, Table, TableBody, TableCell, TableHeader, TableRow} from '../../../shared/ui';
import {useConfirmDialog, useEntityForm, useEntityList, useModal, useNotification} from '../../../shared/lib/hooks';
import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';
import {EmployeeCreateFormFields} from './EmployeeCreateFormFields';
import {EmployeeEditFormFields} from './EmployeeEditFormFields';
import {EmployeeDetailsModal} from './EmployeeDetailsModal';
import './EmployeesTable.css';

interface EmployeesTableProps {
    organizationId: number;
}

export const EmployeesTable = ({organizationId}: EmployeesTableProps) => {
    // Управление списком сотрудников
    const employeeList = useEntityList<Employee>({
        loadFn: async () => {
            const response = await employeeApi.getByOrganization(organizationId);
            return response.employees;
        },
    });

    // Управление формой создания
    const createForm = useEntityForm<EmployeeCreateFormData>({
        initialData: createEmptyEmployeeForm(),
        validateFn: validateEmployeeCreateForm,
        onSubmit: async (data) => {
            // TODO: Replace with actual current user account ID
            const currentAccountId = 0;
            const request = formToCreateRequest(data, organizationId, currentAccountId);
            await employeeApi.create(request);
            notification.success('Сотрудник успешно создан');
            await employeeList.refresh();
            addModal.close();
        },
    });

    // Управление формой редактирования
    const editForm = useEntityForm<EmployeeEditFormData, Employee>({
        initialData: createEmptyEmployeeForm() as unknown as EmployeeEditFormData,
        transformEntityToForm: employeeToEditForm,
        validateFn: validateEmployeeEditForm,
        onSubmit: async (data) => {
            if (!selectedEmployee) throw new Error('No employee selected');

            // Обновляем роль если изменилась
            if (hasRoleChanged(data, selectedEmployee)) {
                await employeeApi.updateRole(formToUpdateRoleRequest(data, selectedEmployee.account_id));
            }

            // Обновляем права если изменились
            if (hasPermissionsChanged(data, selectedEmployee)) {
                await employeeApi.updatePermissions(
                    formToUpdatePermissionsRequest(data, selectedEmployee.account_id)
                );
            }

            notification.success('Сотрудник успешно обновлён');
            await employeeList.refresh();
            editModal.close();
        },
    });

    // Модальные окна
    const addModal = useModal();
    const editModal = useModal();
    const detailsModal = useModal();

    // Уведомления и диалоги
    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    // Текущий выбранный сотрудник
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // Открытие модального окна создания
    const handleOpenAddModal = () => {
        createForm.switchToCreate();
        addModal.open();
    };

    // Открытие модального окна редактирования
    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        editForm.switchToEdit(employee, employeeToEditForm);
        editModal.open();
    };

    // Открытие деталей
    const handleOpenDetails = (employee: Employee) => {
        setSelectedEmployee(employee);
        detailsModal.open();
    };

    // Удаление сотрудника
    const handleDelete = (employee: Employee) => {
        confirmDialog.confirm({
            title: 'Удалить сотрудника',
            message: `Вы уверены, что хотите удалить сотрудника "${employee.name}"?`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await employeeApi.delete(employee.account_id);
                    notification.success('Сотрудник успешно удалён');
                    await employeeList.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении сотрудника');
                    console.error('Failed to delete employee:', err);
                }
            },
        });
    };

    // Отправка формы создания
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createForm.submit();
        if (!success && createForm.error) {
            notification.error(createForm.error);
        }
    };

    // Отправка формы редактирования
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await editForm.submit();
        if (!success && editForm.error) {
            notification.error(editForm.error);
        }
    };

    if (employeeList.loading) {
        return <div className="employees-section loading">Загрузка сотрудников...</div>;
    }

    return (
        <>
            {/* Контейнер уведомлений */}
            <NotificationContainer notifications={notification.notifications} onRemove={notification.remove}/>

            {/* Диалог подтверждения */}
            <ConfirmDialog
                dialog={confirmDialog.dialog}
                isProcessing={confirmDialog.isProcessing}
                onConfirm={confirmDialog.handleConfirm}
                onCancel={confirmDialog.handleCancel}
            />

            <div className="employees-section">
                <div className="section-header">
                    <h2>Сотрудники</h2>
                    <Button size="small" onClick={handleOpenAddModal}>
                        Добавить сотрудника
                    </Button>
                </div>

                {employeeList.error && (
                    <div className="notification notification-error">
                        <span className="notification-icon">⚠</span>
                        {employeeList.error}
                    </div>
                )}

                {employeeList.entities.length === 0 ? (
                    <div className="empty-state">Сотрудники не найдены</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell header>ID</TableCell>
                                <TableCell header>Имя</TableCell>
                                <TableCell header>Роль</TableCell>
                                <TableCell header>Account ID</TableCell>
                                <TableCell header>Дата создания</TableCell>
                                <TableCell header className="table-cell-action">{''}</TableCell>
                                <TableCell header className="table-cell-action">{''}</TableCell>
                                <TableCell header className="table-cell-action">{''}</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employeeList.entities.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.id}</TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                    <TableCell>{employee.account_id}</TableCell>
                                    <TableCell>{new Date(employee.created_at).toLocaleDateString('ru-RU')}</TableCell>
                                    <TableCell className="table-cell-action">
                                        <Button size="small" variant="secondary"
                                                onClick={() => handleOpenDetails(employee)}>
                                            Детали
                                        </Button>
                                    </TableCell>
                                    <TableCell className="table-cell-action">
                                        <Button size="small" onClick={() => handleEdit(employee)}>
                                            Редактировать
                                        </Button>
                                    </TableCell>
                                    <TableCell className="table-cell-action">
                                        <Button size="small" variant="danger" onClick={() => handleDelete(employee)}>
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Модальное окно создания */}
            <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить сотрудника">
                <form onSubmit={handleCreateSubmit} className="employee-form">
                    <div className="form-content">
                        <EmployeeCreateFormFields formData={createForm.formData} onChange={createForm.setFormData}/>
                    </div>
                    <div className="form-actions">
                        <Button type="button" variant="secondary" onClick={addModal.close}
                                disabled={createForm.isSubmitting}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={createForm.isSubmitting}>
                            {createForm.isSubmitting ? 'Создание...' : 'Создать'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Модальное окно редактирования */}
            {selectedEmployee && (
                <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Редактировать сотрудника">
                    <form onSubmit={handleEditSubmit} className="employee-edit-form">
                        <EmployeeEditFormFields
                            formData={editForm.formData}
                            onChange={editForm.setFormData}
                            employee={selectedEmployee}
                        />
                        <div className="employee-edit-footer">
                            <Button type="button" variant="secondary" onClick={editModal.close}
                                    disabled={editForm.isSubmitting}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={editForm.isSubmitting}>
                                {editForm.isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Модальное окно деталей */}
            {selectedEmployee && (
                <EmployeeDetailsModal
                    isOpen={detailsModal.isOpen}
                    onClose={detailsModal.close}
                    employee={selectedEmployee}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};
