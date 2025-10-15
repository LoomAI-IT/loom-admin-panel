import {useState, useCallback} from 'react';

/**
 * Хук для управления уведомлениями (notifications/toasts)
 * Поддерживает различные типы уведомлений и автоматическое скрытие
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number; // в миллисекундах, 0 = не скрывать автоматически
}

interface UseNotificationReturn {
    // Список активных уведомлений
    notifications: Notification[];

    // Методы управления
    notify: (type: NotificationType, message: string, duration?: number) => string;
    remove: (id: string) => void;
    clear: () => void;

    // Утилиты для быстрого создания уведомлений
    success: (message: string, duration?: number) => string;
    error: (message: string, duration?: number) => string;
    warning: (message: string, duration?: number) => string;
    info: (message: string, duration?: number) => string;
}

const DEFAULT_DURATION = 3000; // 3 секунды

export const useNotification = (): UseNotificationReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Генерация уникального ID
    const generateId = useCallback(() => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Удаление уведомления
    const remove = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Очистка всех уведомлений
    const clear = useCallback(() => {
        setNotifications([]);
    }, []);

    // Добавление нового уведомления
    const notify = useCallback(
        (type: NotificationType, message: string, duration: number = DEFAULT_DURATION): string => {
            const id = generateId();

            const notification: Notification = {
                id,
                type,
                message,
                duration,
            };

            setNotifications(prev => [...prev, notification]);

            // Автоматическое удаление через заданное время
            if (duration > 0) {
                setTimeout(() => {
                    remove(id);
                }, duration);
            }

            return id;
        },
        [generateId, remove]
    );

    // Утилиты для создания уведомлений разных типов
    const success = useCallback(
        (message: string, duration?: number) => notify('success', message, duration),
        [notify]
    );

    const error = useCallback(
        (message: string, duration?: number) => notify('error', message, duration ?? 5000), // Ошибки показываем дольше
        [notify]
    );

    const warning = useCallback(
        (message: string, duration?: number) => notify('warning', message, duration),
        [notify]
    );

    const info = useCallback(
        (message: string, duration?: number) => notify('info', message, duration),
        [notify]
    );

    return {
        notifications,

        notify,
        remove,
        clear,

        success,
        error,
        warning,
        info,
    };
};

/**
 * Глобальный контекст для уведомлений (опционально)
 * Позволяет показывать уведомления из любого места приложения
 */
import {createContext, useContext} from 'react';

export const NotificationContext = createContext<UseNotificationReturn | null>(null);

export const useGlobalNotification = (): UseNotificationReturn => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useGlobalNotification must be used within NotificationProvider');
    }
    return context;
};
