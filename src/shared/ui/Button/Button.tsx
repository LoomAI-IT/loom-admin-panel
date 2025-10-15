import type {ButtonHTMLAttributes, ReactNode} from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'xs' | 'small' | 'medium' | 'large';
    loading?: boolean;
    fullWidth?: boolean;
    iconOnly?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
}

export const Button = (
    {
        variant = 'primary',
        size = 'medium',
        loading = false,
        fullWidth = false,
        iconOnly = false,
        leftIcon,
        rightIcon,
        children,
        className = '',
        disabled,
        ...props
    }: ButtonProps) => {
    const classNames = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        loading && 'button--loading',
        fullWidth && 'button--full-width',
        iconOnly && 'button--icon-only',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            disabled={disabled || loading}
            {...props}
        >
            {leftIcon && <span className="button__icon">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="button__icon">{rightIcon}</span>}
        </button>
    );
};
