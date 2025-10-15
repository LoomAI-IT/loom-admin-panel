import {Button, Modal} from '../../../shared/ui';
import './JsonViewModal.css';

interface JsonViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    organizationId?: number;
    zIndex?: number;
}

const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
};

export const JsonViewModal = ({isOpen, onClose, data, organizationId, zIndex}: JsonViewModalProps) => {
    const jsonString = JSON.stringify(data, null, 2);
    const highlightedJson = syntaxHighlight(jsonString);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        alert('JSON скопирован в буфер обмена');
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
                <pre className="json-viewer" dangerouslySetInnerHTML={{__html: highlightedJson}} />
                <div className="json-view-actions">
                    <Button variant="secondary" onClick={handleCopy}>
                        Копировать
                    </Button>
                    <Button variant="secondary" onClick={handleExport}>
                        Экспорт в JSON
                    </Button>
                    <Button variant="primary" onClick={onClose}>
                        Закрыть
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
