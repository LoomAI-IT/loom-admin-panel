import type {InputHTMLAttributes} from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({label, error, className = '', ...props}: InputProps) => {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <input className={`input ${error ? 'input-error' : ''} ${className}`} {...props} />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};
