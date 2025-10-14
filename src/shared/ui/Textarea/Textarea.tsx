import {type TextareaHTMLAttributes, useRef, useLayoutEffect, useCallback} from 'react';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    autoResize?: boolean;
}

export const Textarea = ({label, error, className = '', autoResize = true, onChange, ...props}: TextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea || !autoResize) return;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [autoResize]);

    useLayoutEffect(() => {
        adjustHeight();
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        adjustHeight();
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="textarea-wrapper">
            {label && <label className="textarea-label">{label}</label>}
            <textarea
                ref={textareaRef}
                className={`textarea ${error ? 'textarea-error' : ''} ${autoResize ? 'textarea-auto-resize' : ''} ${className}`}
                {...props}
                onChange={handleChange}
            />
            {error && <span className="textarea-error-message">{error}</span>}
        </div>
    );
};
