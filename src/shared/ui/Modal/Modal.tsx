import type {MouseEvent, ReactNode} from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    zIndex?: number;
}

export const Modal = ({isOpen, onClose, title, children, zIndex = 1000}: ModalProps) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div onClick={handleOverlayClick} style={{zIndex}}>
            <div onClick={(e) => e.stopPropagation()}>
                <div>
                    {title && <h2>{title}</h2>}
                    <button
                        onClick={onClose}
                        type="button"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};
