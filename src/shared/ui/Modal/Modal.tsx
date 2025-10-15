import {type MouseEvent, type ReactNode, useState, useEffect} from 'react';
import './Modal.css';

export type ModalSize = 'small' | 'medium' | 'large' | 'xl' | 'full';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    zIndex?: number;
    size?: ModalSize;
    headerActions?: ReactNode;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    zIndex = 1000,
    size = 'medium',
    headerActions
}: ModalProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
            onClose();
        }, 200); // Match animation duration
    };

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!shouldRender) return null;

    const sizeClass = `modal-content--${size}`;
    const closingClass = isClosing ? 'modal--closing' : '';

    return (
        <div
            className={`modal-overlay ${closingClass}`}
            onClick={handleOverlayClick}
            style={{zIndex}}
        >
            <div
                className={`modal-content ${sizeClass} ${closingClass}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header modal-header--animated">
                    <div className="modal-header-content">
                        {title && <h2 className="modal-title">{title}</h2>}
                        {headerActions && <div className="modal-header-actions">{headerActions}</div>}
                    </div>
                    <button
                        className="modal-close"
                        onClick={handleClose}
                        type="button"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body modal-body--animated">
                    {children}
                </div>
            </div>
        </div>
    );
};
