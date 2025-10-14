/**
 * Поля формы создания сотрудника
 * Переиспользуемый компонент для создания нового сотрудника
 */

import { EmployeeRole, type EmployeeCreateFormData } from '../../../entities/employee';
import { Input } from '../../../shared/ui/Input';

interface EmployeeCreateFormFieldsProps {
  formData: EmployeeCreateFormData;
  onChange: (data: EmployeeCreateFormData) => void;
}

export const EmployeeCreateFormFields = ({ formData, onChange }: EmployeeCreateFormFieldsProps) => {
  return (
    <div className="employee-create-form-fields">
      <Input
        label="Account ID"
        type="text"
        inputMode="numeric"
        value={formData.account_id}
        onChange={(e) => onChange({ ...formData, account_id: e.target.value })}
        required
        placeholder="Введите account ID"
      />

      <Input
        label="Имя сотрудника"
        type="text"
        value={formData.name}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
        required
        placeholder="Введите имя"
      />

      <div className="input-wrapper">
        <label className="input-label">Роль</label>
        <select
          className="input"
          value={formData.role}
          onChange={(e) => onChange({ ...formData, role: e.target.value as EmployeeRole })}
        >
          <option value={EmployeeRole.EMPLOYEE}>Сотрудник</option>
          <option value={EmployeeRole.MODERATOR}>Модератор</option>
          <option value={EmployeeRole.ADMIN}>Администратор</option>
        </select>
      </div>
    </div>
  );
};
