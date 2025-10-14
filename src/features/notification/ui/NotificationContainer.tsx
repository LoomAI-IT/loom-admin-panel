import type {Notification} from '../../../shared/lib/hooks';
import './NotificationContainer.css';

interface NotificationContainerProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

/**
 * Контейнер для отображения уведомлений
 * Заменяет alert() на полноценные UI уведомления
 */
export const NotificationContainer = ({notifications, onRemove}: NotificationContainerProps) => {
    if (notifications.length === 0) return null;

    const getTypeClassName = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'notification-success';
            case 'error':
                return 'notification-error';
            case 'warning':
                return 'notification-warning';
            default:
                return 'notification-info';
        }
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification ${getTypeClassName(notification.type)}`}
                >
                    <div className="notification-icon">
                        {getTypeIcon(notification.type)}
                    </div>
                    <div className="notification-message">{notification.message}</div>
                    <button
                        className="notification-close"
                        onClick={() => onRemove(notification.id)}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};
