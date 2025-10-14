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

    return (
        <Modal
            isOpen={dialog.isOpen}
            onClose={onCancel}
            title={dialog.title}
        >
            <div>
                <div>{getTypeIcon()}</div>
                <div>{dialog.message}</div>
            </div>

            <div>
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
