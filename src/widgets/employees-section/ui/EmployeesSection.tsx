import { useState, useEffect } from 'react';
import { employeeApi, type Employee, EmployeeRole, type CreateEmployeeRequest } from '../../../entities/employee';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { Input } from '../../../shared/ui/Input';
import { useModal } from '../../../shared/lib/hooks/useModal';
import './EmployeesSection.css';

interface EmployeesSectionProps {
  organizationId: number;
}

export const EmployeesSection = ({ organizationId }: EmployeesSectionProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const addModal = useModal();
  const detailsModal = useModal();
  const editModal = useModal();

  const [formData, setFormData] = useState<{
    account_id: string;
    name: string;
    role: EmployeeRole;
  }>({
    account_id: '',
    name: '',
    role: EmployeeRole.EMPLOYEE,
  });

  const [editFormData, setEditFormData] = useState<{
    name: string;
    role: EmployeeRole;
    required_moderation: boolean;
    autoposting_permission: boolean;
    add_employee_permission: boolean;
    edit_employee_perm_permission: boolean;
    top_up_balance_permission: boolean;
    sign_up_social_net_permission: boolean;
  }>({
    name: '',
    role: EmployeeRole.EMPLOYEE,
    required_moderation: false,
    autoposting_permission: false,
    add_employee_permission: false,
    edit_employee_perm_permission: false,
    top_up_balance_permission: false,
    sign_up_social_net_permission: false,
  });

  useEffect(() => {
    loadEmployees();
  }, [organizationId]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getByOrganization(organizationId);
      setEmployees(response.employees);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      name: employee.name,
      role: employee.role as EmployeeRole,
      required_moderation: employee.required_moderation,
      autoposting_permission: employee.autoposting_permission,
      add_employee_permission: employee.add_employee_permission,
      edit_employee_perm_permission: employee.edit_employee_perm_permission,
      top_up_balance_permission: employee.top_up_balance_permission,
      sign_up_social_net_permission: employee.sign_up_social_net_permission,
    });
    editModal.open();
  };

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Вы уверены, что хотите удалить сотрудника "${employee.name}"?`)) {
      return;
    }

    try {
      await employeeApi.delete(employee.account_id);
      await loadEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
      alert('Ошибка при удалении сотрудника');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // TODO: Replace with actual current user account ID
      const currentAccountId = 0;

      const request: CreateEmployeeRequest = {
        account_id: parseInt(formData.account_id),
        organization_id: organizationId,
        invited_from_account_id: currentAccountId,
        name: formData.name,
        role: formData.role,
      };

      await employeeApi.create(request);

      // Reset form and close modal
      setFormData({
        account_id: '',
        name: '',
        role: EmployeeRole.EMPLOYEE,
      });
      addModal.close();

      // Reload employees
      await loadEmployees();
    } catch (err) {
      console.error('Failed to create employee:', err);
      alert('Ошибка при создании сотрудника');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmployee) return;

    try {
      setSubmitting(true);

      // Update role if changed
      if (editFormData.role !== editingEmployee.role) {
        await employeeApi.updateRole({
          account_id: editingEmployee.account_id,
          role: editFormData.role,
        });
      }

      // Update permissions if any changed
      const permissionsChanged =
        editFormData.required_moderation !== editingEmployee.required_moderation ||
        editFormData.autoposting_permission !== editingEmployee.autoposting_permission ||
        editFormData.add_employee_permission !== editingEmployee.add_employee_permission ||
        editFormData.edit_employee_perm_permission !== editingEmployee.edit_employee_perm_permission ||
        editFormData.top_up_balance_permission !== editingEmployee.top_up_balance_permission ||
        editFormData.sign_up_social_net_permission !== editingEmployee.sign_up_social_net_permission;

      if (permissionsChanged) {
        await employeeApi.updatePermissions({
          account_id: editingEmployee.account_id,
          required_moderation: editFormData.required_moderation,
          autoposting_permission: editFormData.autoposting_permission,
          add_employee_permission: editFormData.add_employee_permission,
          edit_employee_perm_permission: editFormData.edit_employee_perm_permission,
          top_up_balance_permission: editFormData.top_up_balance_permission,
          sign_up_social_net_permission: editFormData.sign_up_social_net_permission,
        });
      }

      editModal.close();
      setEditingEmployee(null);

      // Reload employees
      await loadEmployees();
    } catch (err) {
      console.error('Failed to update employee:', err);
      alert('Ошибка при обновлении сотрудника');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="employees-section loading">Загрузка сотрудников...</div>;
  }

  return (
    <>
      <div className="employees-section">
        <div className="section-header">
          <h2>Сотрудники</h2>
          <Button size="small" onClick={addModal.open}>Добавить сотрудника</Button>
        </div>

        {employees.length === 0 ? (
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
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.account_id}</TableCell>
                  <TableCell>{new Date(employee.created_at).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell className="table-cell-action">
                    <Button size="small" variant="secondary" onClick={() => {
                      setSelectedEmployee(employee);
                      detailsModal.open();
                    }}>
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

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить сотрудника">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Account ID"
            type="number"
            value={formData.account_id}
            onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
            required
            placeholder="Введите account ID"
          />

          <Input
            label="Имя сотрудника"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Введите имя"
          />

          <div className="input-wrapper">
            <label className="input-label">Роль</label>
            <select
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as EmployeeRole })}
            >
              <option value={EmployeeRole.EMPLOYEE}>Сотрудник</option>
              <option value={EmployeeRole.MODERATOR}>Модератор</option>
              <option value={EmployeeRole.ADMIN}>Администратор</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button type="button" variant="secondary" onClick={addModal.close} disabled={submitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>

      {editingEmployee && (
        <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Редактировать сотрудника">
          <form onSubmit={handleEditSubmit} className="employee-edit-form">
            <div className="employee-edit-content">
              <div className="employee-edit-header">
                <div className="employee-edit-name">{editingEmployee.name}</div>
                <div className="employee-edit-id">ID: {editingEmployee.account_id}</div>
              </div>

              <div className="employee-edit-section">
                <h3 className="employee-edit-section-title">Роль</h3>
                <div className="role-selector">
                  <label className={`role-option ${editFormData.role === EmployeeRole.EMPLOYEE ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={EmployeeRole.EMPLOYEE}
                      checked={editFormData.role === EmployeeRole.EMPLOYEE}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as EmployeeRole })}
                    />
                    <div className="role-option-content">
                      <span className="role-option-title">Сотрудник</span>
                      <span className="role-option-desc">Базовые права доступа</span>
                    </div>
                  </label>
                  <label className={`role-option ${editFormData.role === EmployeeRole.MODERATOR ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={EmployeeRole.MODERATOR}
                      checked={editFormData.role === EmployeeRole.MODERATOR}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as EmployeeRole })}
                    />
                    <div className="role-option-content">
                      <span className="role-option-title">Модератор</span>
                      <span className="role-option-desc">Расширенные права</span>
                    </div>
                  </label>
                  <label className={`role-option ${editFormData.role === EmployeeRole.ADMIN ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={EmployeeRole.ADMIN}
                      checked={editFormData.role === EmployeeRole.ADMIN}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as EmployeeRole })}
                    />
                    <div className="role-option-content">
                      <span className="role-option-title">Администратор</span>
                      <span className="role-option-desc">Полный доступ</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="employee-edit-section">
                <h3 className="employee-edit-section-title">Права доступа</h3>
                <div className="permissions-grid">
                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={editFormData.required_moderation}
                      onChange={(e) => setEditFormData({ ...editFormData, required_moderation: e.target.checked })}
                    />
                    <div className="permission-checkbox-content">
                      <span className="permission-checkbox-title">Требуется модерация</span>
                      <span className="permission-checkbox-desc">Контент требует проверки</span>
                    </div>
                  </label>

                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={editFormData.autoposting_permission}
                      onChange={(e) => setEditFormData({ ...editFormData, autoposting_permission: e.target.checked })}
                    />
                    <div className="permission-checkbox-content">
                      <span className="permission-checkbox-title">Автопостинг</span>
                      <span className="permission-checkbox-desc">Автоматическая публикация</span>
                    </div>
                  </label>

                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={editFormData.add_employee_permission}
                      onChange={(e) => setEditFormData({ ...editFormData, add_employee_permission: e.target.checked })}
                    />
                    <div className="permission-checkbox-content">
                      <span className="permission-checkbox-title">Добавление сотрудников</span>
                      <span className="permission-checkbox-desc">Приглашать новых пользователей</span>
                    </div>
                  </label>

                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={editFormData.edit_employee_perm_permission}
                      onChange={(e) => setEditFormData({ ...editFormData, edit_employee_perm_permission: e.target.checked })}
                    />
                    <div className="permission-checkbox-content">
                      <span className="permission-checkbox-title">Редактирование прав</span>
                      <span className="permission-checkbox-desc">Изменять права сотрудников</span>
                    </div>
                  </label>

                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={editFormData.top_up_balance_permission}
                      onChange={(e) => setEditFormData({ ...editFormData, top_up_balance_permission: e.target.checked })}
                    />
                    <div className="permission-checkbox-content">
                      <span className="permission-checkbox-title">Пополнение баланса</span>
                      <span className="permission-checkbox-desc">Управление финансами</span>
                    </div>
                  </label>

                  <label className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={editFormData.sign_up_social_net_permission}
                      onChange={(e) => setEditFormData({ ...editFormData, sign_up_social_net_permission: e.target.checked })}
                    />
                    <div className="permission-checkbox-content">
                      <span className="permission-checkbox-title">Подключение соцсетей</span>
                      <span className="permission-checkbox-desc">Добавлять интеграции</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="employee-edit-footer">
              <Button type="button" variant="secondary" onClick={editModal.close} disabled={submitting}>
                Отмена
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {selectedEmployee && (
        <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.close} title="Детали сотрудника">
          <div className="employee-details">
            <div className="employee-details-header">
              <div className="employee-details-name">{selectedEmployee.name}</div>
              <div className="employee-details-role">{selectedEmployee.role}</div>
            </div>

            <div className="employee-details-section">
              <h3 className="employee-details-section-title">Основная информация</h3>
              <div className="employee-details-grid">
                <div className="employee-details-item">
                  <span className="employee-details-label">ID</span>
                  <span className="employee-details-value">{selectedEmployee.id}</span>
                </div>
                <div className="employee-details-item">
                  <span className="employee-details-label">Account ID</span>
                  <span className="employee-details-value">{selectedEmployee.account_id}</span>
                </div>
                <div className="employee-details-item">
                  <span className="employee-details-label">Приглашён от</span>
                  <span className="employee-details-value">{selectedEmployee.invited_from_account_id}</span>
                </div>
                <div className="employee-details-item">
                  <span className="employee-details-label">Дата создания</span>
                  <span className="employee-details-value">{new Date(selectedEmployee.created_at).toLocaleString('ru-RU')}</span>
                </div>
              </div>
            </div>

            <div className="employee-details-section">
              <h3 className="employee-details-section-title">Права доступа</h3>
              <div className="employee-permissions">
                <div className={`permission-badge ${selectedEmployee.required_moderation ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{selectedEmployee.required_moderation ? '✓' : '✕'}</span>
                  Требуется модерация
                </div>
                <div className={`permission-badge ${selectedEmployee.autoposting_permission ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{selectedEmployee.autoposting_permission ? '✓' : '✕'}</span>
                  Автопостинг
                </div>
                <div className={`permission-badge ${selectedEmployee.add_employee_permission ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{selectedEmployee.add_employee_permission ? '✓' : '✕'}</span>
                  Добавление сотрудников
                </div>
                <div className={`permission-badge ${selectedEmployee.edit_employee_perm_permission ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{selectedEmployee.edit_employee_perm_permission ? '✓' : '✕'}</span>
                  Редактирование прав
                </div>
                <div className={`permission-badge ${selectedEmployee.top_up_balance_permission ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{selectedEmployee.top_up_balance_permission ? '✓' : '✕'}</span>
                  Пополнение баланса
                </div>
                <div className={`permission-badge ${selectedEmployee.sign_up_social_net_permission ? 'active' : 'inactive'}`}>
                  <span className="permission-icon">{selectedEmployee.sign_up_social_net_permission ? '✓' : '✕'}</span>
                  Подключение соцсетей
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="secondary" onClick={detailsModal.close}>
                Закрыть
              </Button>
              <Button onClick={() => {
                detailsModal.close();
                handleEdit(selectedEmployee);
              }}>
                Редактировать
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
