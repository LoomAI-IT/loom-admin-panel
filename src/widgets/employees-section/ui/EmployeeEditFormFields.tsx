/**
 * Поля формы редактирования сотрудника
 * Переиспользуемый компонент для редактирования сотрудника и его прав
 */

import { EmployeeRole, type EmployeeEditFormData, type Employee } from '../../../entities/employee';

interface EmployeeEditFormFieldsProps {
  formData: EmployeeEditFormData;
  onChange: (data: EmployeeEditFormData) => void;
  employee: Employee;
}

export const EmployeeEditFormFields = ({ formData, onChange, employee }: EmployeeEditFormFieldsProps) => {
  return (
    <div className="employee-edit-content">
      <div className="employee-edit-header">
        <div className="employee-edit-name">{employee.name}</div>
        <div className="employee-edit-id">ID: {employee.account_id}</div>
      </div>

      <div className="employee-edit-section">
        <h3 className="employee-edit-section-title">Роль</h3>
        <div className="role-selector">
          <label className={`role-option ${formData.role === EmployeeRole.EMPLOYEE ? 'selected' : ''}`}>
            <input
              type="radio"
              name="role"
              value={EmployeeRole.EMPLOYEE}
              checked={formData.role === EmployeeRole.EMPLOYEE}
              onChange={(e) => onChange({ ...formData, role: e.target.value as EmployeeRole })}
            />
            <div className="role-option-content">
              <span className="role-option-title">Сотрудник</span>
              <span className="role-option-desc">Базовые права доступа</span>
            </div>
          </label>
          <label className={`role-option ${formData.role === EmployeeRole.MODERATOR ? 'selected' : ''}`}>
            <input
              type="radio"
              name="role"
              value={EmployeeRole.MODERATOR}
              checked={formData.role === EmployeeRole.MODERATOR}
              onChange={(e) => onChange({ ...formData, role: e.target.value as EmployeeRole })}
            />
            <div className="role-option-content">
              <span className="role-option-title">Модератор</span>
              <span className="role-option-desc">Расширенные права</span>
            </div>
          </label>
          <label className={`role-option ${formData.role === EmployeeRole.ADMIN ? 'selected' : ''}`}>
            <input
              type="radio"
              name="role"
              value={EmployeeRole.ADMIN}
              checked={formData.role === EmployeeRole.ADMIN}
              onChange={(e) => onChange({ ...formData, role: e.target.value as EmployeeRole })}
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
              checked={formData.required_moderation}
              onChange={(e) => onChange({ ...formData, required_moderation: e.target.checked })}
            />
            <div className="permission-checkbox-content">
              <span className="permission-checkbox-title">Требуется модерация</span>
              <span className="permission-checkbox-desc">Контент требует проверки</span>
            </div>
          </label>

          <label className="permission-checkbox">
            <input
              type="checkbox"
              checked={formData.autoposting_permission}
              onChange={(e) => onChange({ ...formData, autoposting_permission: e.target.checked })}
            />
            <div className="permission-checkbox-content">
              <span className="permission-checkbox-title">Автопостинг</span>
              <span className="permission-checkbox-desc">Автоматическая публикация</span>
            </div>
          </label>

          <label className="permission-checkbox">
            <input
              type="checkbox"
              checked={formData.add_employee_permission}
              onChange={(e) => onChange({ ...formData, add_employee_permission: e.target.checked })}
            />
            <div className="permission-checkbox-content">
              <span className="permission-checkbox-title">Добавление сотрудников</span>
              <span className="permission-checkbox-desc">Приглашать новых пользователей</span>
            </div>
          </label>

          <label className="permission-checkbox">
            <input
              type="checkbox"
              checked={formData.edit_employee_perm_permission}
              onChange={(e) => onChange({ ...formData, edit_employee_perm_permission: e.target.checked })}
            />
            <div className="permission-checkbox-content">
              <span className="permission-checkbox-title">Редактирование прав</span>
              <span className="permission-checkbox-desc">Изменять права сотрудников</span>
            </div>
          </label>

          <label className="permission-checkbox">
            <input
              type="checkbox"
              checked={formData.top_up_balance_permission}
              onChange={(e) => onChange({ ...formData, top_up_balance_permission: e.target.checked })}
            />
            <div className="permission-checkbox-content">
              <span className="permission-checkbox-title">Пополнение баланса</span>
              <span className="permission-checkbox-desc">Управление финансами</span>
            </div>
          </label>

          <label className="permission-checkbox">
            <input
              type="checkbox"
              checked={formData.sign_up_social_net_permission}
              onChange={(e) => onChange({ ...formData, sign_up_social_net_permission: e.target.checked })}
            />
            <div className="permission-checkbox-content">
              <span className="permission-checkbox-title">Подключение соцсетей</span>
              <span className="permission-checkbox-desc">Добавлять интеграции</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
