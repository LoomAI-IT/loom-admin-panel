import {useState, useMemo} from 'react';
import {Button, DebouncedTextarea, Modal} from '../../../shared/ui';
import './JsonImportModal.css';

interface JsonImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any) => void;
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

export const JsonImportModal = ({isOpen, onClose, onImport, zIndex}: JsonImportModalProps) => {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');

    const highlightedJson = useMemo(() => {
        if (!jsonText.trim()) return '';
        try {
            const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
            return syntaxHighlight(formatted);
        } catch {
            return '';
        }
    }, [jsonText]);

    const handleSubmit = () => {
        try {
            const data = JSON.parse(jsonText);
            onImport(data);
            setJsonText('');
            setError('');
            onClose();
        } catch (err) {
            setError('Некорректный JSON формат');
        }
    };

    const handleClose = () => {
        setJsonText('');
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Вставить JSON" zIndex={zIndex}>
            <div className="json-import-modal">
                <div className="json-import-content">
                    <div className="json-import-input">
                        <DebouncedTextarea
                            value={jsonText}
                            onChange={setJsonText}
                            placeholder="Вставьте JSON данные..."
                            rows={15}
                            error={error}
                            autoResize={false}
                        />
                    </div>
                    {highlightedJson && (
                        <div className="json-import-preview">
                            <div className="json-import-preview-label">Превью:</div>
                            <pre className="json-viewer" dangerouslySetInnerHTML={{__html: highlightedJson}} />
                        </div>
                    )}
                </div>
                <div className="json-import-modal-actions">
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={!jsonText.trim()}>
                        Применить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
