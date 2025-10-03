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
  const addModal = useModal();

  const [formData, setFormData] = useState({
    account_id: '',
    name: '',
    role: EmployeeRole.EMPLOYEE,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // TODO: Replace with actual current user account ID
      const currentAccountId = 1;

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.account_id}</TableCell>
                  <TableCell>{new Date(employee.created_at).toLocaleString('ru-RU')}</TableCell>
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
    </>
  );
};
