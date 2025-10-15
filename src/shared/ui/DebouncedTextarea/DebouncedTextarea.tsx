import * as React from 'react';
import {memo, type TextareaHTMLAttributes, useCallback, useLayoutEffect, useRef} from 'react';

import './DebouncedTextarea.css';

interface DebouncedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    label?: string;
    error?: string;
    value: string;
    onChange: (value: string) => void;
    debounceDelay?: number;
    autoResize?: boolean;
}

export const DebouncedTextarea = memo((
    {
        label,
        error,
        value,
        onChange,
        debounceDelay = 300,
        autoResize = true,
        ...props
    }: DebouncedTextareaProps
): React.JSX.Element => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Функция для автоматического изменения высоты
    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea || !autoResize) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [autoResize]);

    // Подстройка высоты при изменении значения
    useLayoutEffect(() => {
        adjustHeight();
    });

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(e.target.value);
            adjustHeight();
        },
        [onChange, adjustHeight]
    );

    return (
        <div className="textarea-wrapper">
            <textarea
                ref={textareaRef}
                className={`textarea ${error ? 'textarea--error' : ''}`}
                value={value}
                onChange={handleChange}
                placeholder=" "
                {...props}
            />
            {label && <label className="textarea-label">{label}{props.required && <span className="text-danger">*</span>}</label>}
            {error && <span className="text-danger text-sm mt-2">{error}</span>}
        </div>
    );
});

DebouncedTextarea.displayName = 'DebouncedTextarea';
