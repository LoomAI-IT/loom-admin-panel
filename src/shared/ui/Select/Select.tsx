import './Select.css';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export const Select = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Выберите...',
    required = false,
    disabled = false,
}: SelectProps) => {
    return (
        <div className="select-field">
            {label && (
                <label className="select-label">
                    {label}
                    {required && <span className="select-required">*</span>}
                </label>
            )}
            <select
                className="select-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
