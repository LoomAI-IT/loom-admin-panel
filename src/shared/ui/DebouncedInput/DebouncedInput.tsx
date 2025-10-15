import * as React from 'react';
import {type InputHTMLAttributes, memo, useCallback} from 'react';

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
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <div className="input-wrapper">
            <input
                className={`input ${error ? 'input--error' : ''}`}
                value={value}
                onChange={handleChange}
                placeholder=" "
                {...props}
            />
            {label && <label className="input-label">{label}{props.required && <span className="text-danger">*</span>}</label>}
            {error && <span className="text-danger text-sm mt-2">{error}</span>}
        </div>
    );
});

DebouncedInput.displayName = 'DebouncedInput';
