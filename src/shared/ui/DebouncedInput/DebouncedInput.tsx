import * as React from 'react';
import {type InputHTMLAttributes, memo, useCallback, useEffect, useState} from 'react';

import {useDebouncedValue} from '../../lib/hooks';

import './DebouncedInput.css';

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string;
    value: string;
    onChange: (value: string) => void;
    debounceDelay: number;
}

export const DebouncedInput = memo((
    {
        label,
        error,
        value,
        onChange,
        debounceDelay = 300,
        ...props
    }: DebouncedInputProps
): React.JSX.Element => {
    // Внутренний state для быстрой отрисовки
    const [localValue, setLocalValue] = useState(value);

    // Debounced значение для propagation наверх
    const debouncedValue = useDebouncedValue(localValue, debounceDelay);

    // Синхронизация с внешним value при изменении извне
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Propagation debounced значения наверх
    useEffect(() => {
        if (debouncedValue !== value) {
            onChange(debouncedValue);
        }
    }, [debouncedValue, onChange, value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    }, []);

    return (
        <div>
            {label && <label>{label}</label>}
            <input
                value={localValue}
                onChange={handleChange}
                {...props}
            />
            {error && <span>{error}</span>}
        </div>
    );
});

DebouncedInput.displayName = 'DebouncedInput';
