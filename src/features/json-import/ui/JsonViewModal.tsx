import {Button, Modal} from '../../../shared/ui';
import {syntaxHighlight} from '../lib/syntaxHighlight';
import {useNotification} from '../../../shared/lib/hooks';
import {NotificationContainer} from '../../notification';
import './JsonViewModal.css';

interface JsonViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    organizationId?: number;
    zIndex?: number;
}


export const JsonViewModal = ({isOpen, onClose, data, organizationId, zIndex}: JsonViewModalProps) => {
    const jsonString = JSON.stringify(data, null, 2);
    const highlightedJson = syntaxHighlight(jsonString);
    const notification = useNotification();

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        notification.success('JSON скопирован в буфер обмена');
    };

    const handleExport = () => {
        const blob = new Blob([jsonString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const id = organizationId || data?.id || 'unknown';
        const date = new Date().toISOString().split('T')[0];
        a.download = `organization-${id}-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Просмотр JSON" zIndex={zIndex}>
            <div className="json-view-modal">
                <pre className="json-viewer" dangerouslySetInnerHTML={{__html: highlightedJson}}/>
                <div className="json-view-actions">
                    <Button variant="secondary" onClick={handleCopy}>
                        Копировать
                    </Button>
                    <Button variant="secondary" onClick={handleExport}>
                        Экспорт в JSON
                    </Button>
                </div>
            </div>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
            />
        </Modal>
    );
};
