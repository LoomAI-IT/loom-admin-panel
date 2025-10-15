import {useState, useRef, useEffect} from 'react';
import {ChevronDown} from 'lucide-react';
import './AnimatedSelect.css';

export interface SelectOption {
    value: string;
    label: string;
}

interface AnimatedSelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export const AnimatedSelect = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Выберите...',
    required = false,
    disabled = false,
}: AnimatedSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 150);
    };

    const handleToggle = () => {
        if (disabled) return;
        if (isOpen) {
            handleClose();
        } else {
            setIsOpen(true);
        }
    };

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        handleClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        } else if (e.key === 'Escape' && isOpen) {
            handleClose();
        }
    };

    return (
        <div className="animated-select-field">
            {label && (
                <label className="animated-select-label">
                    {label}
                    {required && <span className="animated-select-required">*</span>}
                </label>
            )}
            <div className="animated-select-wrapper">
                <button
                    ref={buttonRef}
                    type="button"
                    className={`animated-select-button ${isOpen ? 'animated-select-button--open' : ''} ${disabled ? 'animated-select-button--disabled' : ''}`}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className={selectedOption ? '' : 'animated-select-placeholder'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`animated-select-icon ${isOpen ? 'animated-select-icon--open' : ''}`}
                        size={20}
                    />
                </button>
                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className={`animated-select-dropdown ${isClosing ? 'animated-select-dropdown--closing' : ''}`}
                        role="listbox"
                    >
                        {options.map((option, index) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`animated-select-option ${option.value === value ? 'animated-select-option--selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                                role="option"
                                aria-selected={option.value === value}
                                style={{
                                    '--option-index': index
                                } as React.CSSProperties}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
