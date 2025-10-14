import type {ButtonHTMLAttributes, ReactNode} from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    children: ReactNode;
}

export const Button = (
    {
        variant = 'primary',
        size = 'medium',
        children,
        ...props
    }: ButtonProps) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size} `}
            {...props}
        >
            {children}
        </button>
    );
};
