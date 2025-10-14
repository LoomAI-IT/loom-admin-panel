// Существующие хуки
export { useModal } from './useModal';
export { useLoadData } from './useLoadData';
export { useFormState } from './useFormState';

// Новые рефакторинговые хуки (простые и понятные)
export { useEntityList } from './useEntityList';
export { useEntityForm } from './useEntityForm';
export { useConfirmDialog } from './useConfirmDialog';
export type { ConfirmDialogType, ConfirmDialogState } from './useConfirmDialog';
export { useNotification, useGlobalNotification, NotificationContext } from './useNotification';
export type { NotificationType, Notification } from './useNotification';
