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
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Имя сотрудника"
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
              placeholder="Введите имя"
              disabled
            />

            <div className="input-wrapper">
              <label className="input-label">Роль</label>
              <select
                className="input"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as EmployeeRole })}
              >
                <option value={EmployeeRole.EMPLOYEE}>Сотрудник</option>
                <option value={EmployeeRole.MODERATOR}>Модератор</option>
                <option value={EmployeeRole.ADMIN}>Администратор</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Права доступа</h3>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.required_moderation}
                  onChange={(e) => setEditFormData({ ...editFormData, required_moderation: e.target.checked })}
                />
                <span>Требуется модерация</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.autoposting_permission}
                  onChange={(e) => setEditFormData({ ...editFormData, autoposting_permission: e.target.checked })}
                />
                <span>Автопостинг</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.add_employee_permission}
                  onChange={(e) => setEditFormData({ ...editFormData, add_employee_permission: e.target.checked })}
                />
                <span>Добавление сотрудников</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.edit_employee_perm_permission}
                  onChange={(e) => setEditFormData({ ...editFormData, edit_employee_perm_permission: e.target.checked })}
                />
                <span>Редактирование прав сотрудников</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.top_up_balance_permission}
                  onChange={(e) => setEditFormData({ ...editFormData, top_up_balance_permission: e.target.checked })}
                />
                <span>Пополнение баланса</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editFormData.sign_up_social_net_permission}
                  onChange={(e) => setEditFormData({ ...editFormData, sign_up_social_net_permission: e.target.checked })}
                />
                <span>Подключение соцсетей</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button type="button" variant="secondary" onClick={editModal.close} disabled={submitting}>
                Отмена
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {selectedEmployee && (
        <Modal isOpen={detailsModal.isOpen} onClose={detailsModal.close} title={`Детали сотрудника: ${selectedEmployee.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <strong>ID:</strong> {selectedEmployee.id}
            </div>
            <div>
              <strong>Имя:</strong> {selectedEmployee.name}
            </div>
            <div>
              <strong>Роль:</strong> {selectedEmployee.role}
            </div>
            <div>
              <strong>Account ID:</strong> {selectedEmployee.account_id}
            </div>
            <div>
              <strong>Приглашён от:</strong> {selectedEmployee.invited_from_account_id}
            </div>
            <div>
              <strong>Требуется модерация:</strong> {selectedEmployee.required_moderation ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Автопостинг:</strong> {selectedEmployee.autoposting_permission ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Добавление сотрудников:</strong> {selectedEmployee.add_employee_permission ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Редактирование прав:</strong> {selectedEmployee.edit_employee_perm_permission ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Пополнение баланса:</strong> {selectedEmployee.top_up_balance_permission ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Подключение соцсетей:</strong> {selectedEmployee.sign_up_social_net_permission ? 'Да' : 'Нет'}
            </div>
            <div>
              <strong>Дата создания:</strong> {new Date(selectedEmployee.created_at).toLocaleString('ru-RU')}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button onClick={detailsModal.close}>
                Закрыть
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
