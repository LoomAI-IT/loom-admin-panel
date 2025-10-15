import {createPortal} from 'react-dom';
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

    return createPortal(
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification notification--${notification.type}`}
                >
                    <div className="notification-icon">
                        {getTypeIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                        <div className="notification-message">{notification.message}</div>
                    </div>
                    <button
                        className="notification-close"
                        onClick={() => onRemove(notification.id)}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                    <div className="notification-progress" />
                </div>
            ))}
        </div>,
        document.body
    );
};
