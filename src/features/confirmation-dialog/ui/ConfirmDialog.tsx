import {Button, Modal} from '../../../shared/ui';
import type {ConfirmDialogState} from '../../../shared/lib/hooks';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    dialog: ConfirmDialogState;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({dialog, isProcessing, onConfirm, onCancel}: ConfirmDialogProps) => {
    if (!dialog.isOpen) return null;

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

    if (!dialog.isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className={`confirm-dialog confirm-dialog--${dialog.type || 'info'}`} onClick={(e) => e.stopPropagation()}>
                <div className="confirm-dialog-content">
                    <div className="confirm-dialog-icon">
                        {getTypeIcon()}
                    </div>
                    <h3 className="confirm-dialog-title">{dialog.title}</h3>
                    <p className="confirm-dialog-message">{dialog.message}</p>
                    <div className="confirm-dialog-actions">
                        {dialog.cancelText && (
                            <Button
                                variant="secondary"
                                onClick={onCancel}
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
