import {Button, Modal} from '../../../shared/ui';
import type {ConfirmDialogState} from '../../../shared/lib/hooks';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    dialog: ConfirmDialogState;
    isProcessing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Компонент диалога подтверждения
 * Заменяет стандартные alert() и confirm()
 */
export const ConfirmDialog = ({dialog, isProcessing, onConfirm, onCancel}: ConfirmDialogProps) => {
    if (!dialog.isOpen) return null;

    const getTypeClassName = () => {
        switch (dialog.type) {
            case 'danger':
                return 'confirm-dialog-danger';
            case 'warning':
                return 'confirm-dialog-warning';
            case 'success':
                return 'confirm-dialog-success';
            default:
                return 'confirm-dialog-info';
        }
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

    return (
        <Modal
            isOpen={dialog.isOpen}
            onClose={onCancel}
            title={dialog.title}
            className={`confirm-dialog ${getTypeClassName()}`}
        >
            <div className="confirm-dialog-content">
                <div className="confirm-dialog-icon">{getTypeIcon()}</div>
                <div className="confirm-dialog-message">{dialog.message}</div>
            </div>

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
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Обработка...' : dialog.confirmText}
                </Button>
            </div>
        </Modal>
    );
};
