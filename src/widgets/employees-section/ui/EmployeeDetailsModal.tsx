/**
 * Модальное окно деталей сотрудника
 * Отображает полную информацию о сотруднике и его правах
 */

import { type Employee } from '../../../entities/employee';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetailsModal = ({ isOpen, onClose, employee, onEdit }: EmployeeDetailsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Детали сотрудника">
      <div className="employee-details">
        <div className="employee-details-header">
          <div className="employee-details-name">{employee.name}</div>
          <div className="employee-details-role">{employee.role}</div>
        </div>

        <div className="employee-details-section">
          <h3 className="employee-details-section-title">Основная информация</h3>
          <div className="employee-details-grid">
            <div className="employee-details-item">
              <span className="employee-details-label">ID</span>
              <span className="employee-details-value">{employee.id}</span>
            </div>
            <div className="employee-details-item">
              <span className="employee-details-label">Account ID</span>
              <span className="employee-details-value">{employee.account_id}</span>
            </div>
            <div className="employee-details-item">
              <span className="employee-details-label">Приглашён от</span>
              <span className="employee-details-value">{employee.invited_from_account_id}</span>
            </div>
            <div className="employee-details-item">
              <span className="employee-details-label">Дата создания</span>
              <span className="employee-details-value">
                {new Date(employee.created_at).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        <div className="employee-details-section">
          <h3 className="employee-details-section-title">Права доступа</h3>
          <div className="employee-permissions">
            <div className={`permission-badge ${employee.required_moderation ? 'active' : 'inactive'}`}>
              <span className="permission-icon">{employee.required_moderation ? '✓' : '✕'}</span>
              Требуется модерация
            </div>
            <div className={`permission-badge ${employee.autoposting_permission ? 'active' : 'inactive'}`}>
              <span className="permission-icon">{employee.autoposting_permission ? '✓' : '✕'}</span>
              Автопостинг
            </div>
            <div className={`permission-badge ${employee.add_employee_permission ? 'active' : 'inactive'}`}>
              <span className="permission-icon">{employee.add_employee_permission ? '✓' : '✕'}</span>
              Добавление сотрудников
            </div>
            <div className={`permission-badge ${employee.edit_employee_perm_permission ? 'active' : 'inactive'}`}>
              <span className="permission-icon">{employee.edit_employee_perm_permission ? '✓' : '✕'}</span>
              Редактирование прав
            </div>
            <div className={`permission-badge ${employee.top_up_balance_permission ? 'active' : 'inactive'}`}>
              <span className="permission-icon">{employee.top_up_balance_permission ? '✓' : '✕'}</span>
              Пополнение баланса
            </div>
            <div className={`permission-badge ${employee.sign_up_social_net_permission ? 'active' : 'inactive'}`}>
              <span className="permission-icon">{employee.sign_up_social_net_permission ? '✓' : '✕'}</span>
              Подключение соцсетей
            </div>
          </div>
        </div>

        <div className="employee-details-footer">
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={() => {
            onClose();
            onEdit(employee);
          }}>
            Редактировать
          </Button>
        </div>
      </div>
    </Modal>
  );
};
