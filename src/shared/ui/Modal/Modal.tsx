import type {MouseEvent, ReactNode} from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
    zIndex?: number;
}

export const Modal = ({isOpen, onClose, title, children, className = '', zIndex = 1000}: ModalProps) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick} style={{zIndex}}>
            <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    <button
                        className="modal-close-button"
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
