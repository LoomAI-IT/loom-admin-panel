import { useState, useEffect } from 'react';
import { employeeApi, type Employee } from '../../../entities/employee';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import './EmployeesSection.css';

interface EmployeesSectionProps {
  organizationId: number;
}

export const EmployeesSection = ({ organizationId }: EmployeesSectionProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="employees-section loading">Загрузка сотрудников...</div>;
  }

  return (
    <div className="employees-section">
      <div className="section-header">
        <h2>Сотрудники</h2>
        <Button size="small">Добавить сотрудника</Button>
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
  );
};
