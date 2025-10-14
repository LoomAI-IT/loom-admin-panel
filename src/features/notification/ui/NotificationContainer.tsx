import type {Notification} from '../../../shared/lib/hooks';
import './NotificationContainer.css';

interface NotificationContainerProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

export const NotificationContainer = ({notifications, onRemove}: NotificationContainerProps) => {
    if (notifications.length === 0) return null;
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
        <div>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                >
                    <div>
                        {getTypeIcon(notification.type)}
                    </div>
                    <div>{notification.message}</div>
                    <button
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
