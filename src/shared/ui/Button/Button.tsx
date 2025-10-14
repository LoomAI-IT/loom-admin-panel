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
            {...props}
        >
            {children}
        </button>
    );
};
