/**
 * Универсальный компонент для работы с массивами строк в формах
 * Решает проблему дублирования ArrayInputSection в CategoryFormFields и AutopostingFormFields
 *
 * Принципы:
 * - Простота: без избыточной мемоизации
 * - DRY: один компонент для всех массивов
 * - KISS: минимум логики, максимум переиспользования
 */

import {Input} from '../Input';
import {Textarea} from '../Textarea';
import {Button} from '../Button';
import './ArrayField.css';

interface ArrayFieldProps {
    label?: string;
    value: string[];
    onChange: (newValue: string[]) => void;
    placeholder?: string;
    variant?: 'input' | 'textarea';
    addButtonText?: string;
}

export const ArrayField = ({
                               label,
                               value,
                               onChange,
                               placeholder = '',
                               variant = 'textarea',
                               addButtonText,
                           }: ArrayFieldProps) => {
    const handleAdd = () => {
        onChange([...value, '']);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleUpdate = (index: number, newValue: string) => {
        const updated = [...value];
        updated[index] = newValue;
        onChange(updated);
    };

    const defaultButtonText = addButtonText || `Добавить ${placeholder.toLowerCase() || 'элемент'}`;

    return (
        <div className="array-field">
            {label && <label className="array-field-label">{label}</label>}
            <div className="array-field-list">
                {value.map((item, index) => (
                    <div key={index} className="array-field-item">
                        {variant === 'textarea' ? (
                            <Textarea
                                value={item}
                                onChange={(e) => handleUpdate(index, e.target.value)}
                                placeholder={`${placeholder} ${index + 1}`}
                            />
                        ) : (
                            <Input
                                type="text"
                                value={item}
                                onChange={(e) => handleUpdate(index, e.target.value)}
                                placeholder={placeholder}
                            />
                        )}
                        <Button
                            type="button"
                            variant="danger"
                            size="small"
                            onClick={() => handleRemove(index)}
                            className="array-field-remove"
                        >
                            ×
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    size="small"
                    onClick={handleAdd}
                    className="array-field-add"
                >
                    + {defaultButtonText}
                </Button>
            </div>
        </div>
    );
};
