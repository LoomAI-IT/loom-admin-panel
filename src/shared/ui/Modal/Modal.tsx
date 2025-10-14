import type {MouseEvent, ReactNode} from 'react';
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
    if (!isOpen) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizeClass = `modal-content--${size}`;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick} style={{zIndex}}>
            <div className={`modal-content ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-content">
                        {title && <h2 className="modal-title">{title}</h2>}
                        {headerActions && <div className="modal-header-actions">{headerActions}</div>}
                    </div>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};
