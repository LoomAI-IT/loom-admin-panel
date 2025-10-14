import * as React from 'react';
import {memo, type TextareaHTMLAttributes, useCallback, useEffect, useLayoutEffect, useRef, useState,} from 'react';
import {useDebouncedValue} from '../../lib/hooks';
import './DebouncedTextarea.css';

interface DebouncedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label?: string;
    error?: string;
    value: string;
    onChange: (value: string) => void;
    debounceDelay?: number;
    autoResize?: boolean;
}

export const DebouncedTextarea = memo(({
                                           label,
                                           error,
                                           value,
                                           onChange,
                                           debounceDelay = 300,
                                           autoResize = true,
                                           className = '',
                                           ...props
                                       }: DebouncedTextareaProps): React.JSX.Element => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Внутренний state для быстрой отрисовки
    const [localValue, setLocalValue] = useState(value);

    // Debounced значение для propagation наверх
    const debouncedValue = useDebouncedValue(localValue, debounceDelay);

    // Функция для автоматического изменения высоты
    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea || !autoResize) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [autoResize]);

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

    // Подстройка высоты при изменении значения
    useLayoutEffect(() => {
        adjustHeight();
    });

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocalValue(e.target.value);
            adjustHeight();
        },
        [adjustHeight]
    );

    return (
        <div className="textarea-wrapper">
            {label && <label className="textarea-label">{label}</label>}
            <textarea
                ref={textareaRef}
                className={`textarea ${error ? 'textarea-error' : ''} ${
                    autoResize ? 'textarea-auto-resize' : ''
                } ${className}`}
                value={localValue}
                onChange={handleChange}
                {...props}
            />
            {error && <span className="textarea-error-message">{error}</span>}
        </div>
    ) as React["JSX.Element"];
});

DebouncedTextarea.displayName = 'DebouncedTextarea';
