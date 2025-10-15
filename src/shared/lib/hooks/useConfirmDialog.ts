import {useState, useCallback} from 'react';

export type ConfirmDialogType = 'info' | 'warning' | 'danger' | 'success';

export interface ConfirmDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    type: ConfirmDialogType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

interface UseConfirmDialogReturn {
    // Состояние диалога
    dialog: ConfirmDialogState;
    isProcessing: boolean;

    // Методы управления
    confirm: (config: Omit<ConfirmDialogState, 'isOpen'>) => void;
    close: () => void;
    handleConfirm: () => Promise<void>;
    handleCancel: () => void;

    // Утилиты для быстрого создания диалогов
    confirmDelete: (entityName: string, onConfirm: () => void | Promise<void>) => void;
    confirmAction: (title: string, message: string, onConfirm: () => void | Promise<void>) => void;
}

const defaultState: ConfirmDialogState = {
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
};

export const useConfirmDialog = (): UseConfirmDialogReturn => {
    const [dialog, setDialog] = useState<ConfirmDialogState>(defaultState);
    const [isProcessing, setIsProcessing] = useState(false);

    // Открыть диалог с заданной конфигурацией
    const confirm = useCallback((config: Omit<ConfirmDialogState, 'isOpen'>) => {
        setDialog({
            isOpen: true,
            confirmText: 'Подтвердить',
            cancelText: 'Отмена',
            ...config,
        });
    }, []);

    // Закрыть диалог
    const close = useCallback(() => {
        setDialog(defaultState);
        setIsProcessing(false);
    }, []);

    // Обработать подтверждение
    const handleConfirm = useCallback(async () => {
        if (!dialog.onConfirm) {
            close();
            return;
        }

        try {
            setIsProcessing(true);
            await dialog.onConfirm();
            close();
        } catch (error) {
            console.error('Error during confirmation:', error);
            // Не закрываем диалог при ошибке, чтобы пользователь мог повторить
            setIsProcessing(false);
        }
    }, [dialog.onConfirm, close]);

    // Обработать отмену
    const handleCancel = useCallback(() => {
        if (dialog.onCancel) {
            dialog.onCancel();
        }
        close();
    }, [dialog.onCancel, close]);

    // Утилита для подтверждения удаления
    const confirmDelete = useCallback((entityName: string, onConfirm: () => void | Promise<void>) => {
        confirm({
            title: 'Удалить элемент',
            message: `Вы уверены, что хотите удалить "${entityName}"? Это действие нельзя отменить.`,
            type: 'danger',
            confirmText: 'Удалить',
            cancelText: 'Отмена',
            onConfirm,
        });
    }, [confirm]);

    // Утилита для подтверждения действия
    const confirmAction = useCallback(
        (title: string, message: string, onConfirm: () => void | Promise<void>) => {
            confirm({
                title,
                message,
                type: 'warning',
                confirmText: 'Подтвердить',
                cancelText: 'Отмена',
                onConfirm,
            });
        },
        [confirm]
    );
    
    return {
        dialog,
        isProcessing,

        confirm,
        close,
        handleConfirm,
        handleCancel,

        confirmDelete,
        confirmAction,
    };
};
