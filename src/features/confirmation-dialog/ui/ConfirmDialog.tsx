import {useState, useEffect} from 'react';
import {Button} from '../../../shared/ui';
import type {ConfirmDialogState} from '../../../shared/lib/hooks';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    dialog: ConfirmDialogState;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({dialog, isProcessing, onConfirm, onCancel}: ConfirmDialogProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(dialog.isOpen);

    useEffect(() => {
        if (dialog.isOpen) {
            setShouldRender(true);
            setIsClosing(false);
        }
    }, [dialog.isOpen]);

    const handleCancel = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
            onCancel();
        }, 200);
    };

    const getTypeIcon = () => {
        switch (dialog.type) {
            case 'danger':
                return '⚠';
            case 'warning':
                return '⚡';
            case 'success':
                return '✓';
            default:
                return 'ℹ';
        }
    };

    if (!shouldRender) return null;

    const closingClass = isClosing ? 'confirm-dialog--closing' : '';

    return (
        <div className={`confirm-dialog-overlay ${closingClass}`} onClick={handleCancel}>
            <div
                className={`confirm-dialog confirm-dialog--${dialog.type || 'info'} ${closingClass}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="confirm-dialog-content">
                    <div className="confirm-dialog-icon confirm-dialog-icon--animated">
                        {getTypeIcon()}
                    </div>
                    <h3 className="confirm-dialog-title confirm-dialog-title--animated">{dialog.title}</h3>
                    <p className="confirm-dialog-message confirm-dialog-message--animated">{dialog.message}</p>
                    <div className="confirm-dialog-actions confirm-dialog-actions--animated">
                        {dialog.cancelText && (
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={isProcessing}
                            >
                                {dialog.cancelText}
                            </Button>
                        )}
                        <Button
                            variant={dialog.type === 'danger' ? 'danger' : 'primary'}
                            onClick={onConfirm}
                            loading={isProcessing}
                        >
                            {dialog.confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
