import {useState} from 'react';
import {Button, DebouncedTextarea, Modal} from '../../../shared/ui';
import './JsonImportModal.css';

interface JsonImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any) => void;
    zIndex?: number;
}

export const JsonImportModal = ({isOpen, onClose, onImport, zIndex}: JsonImportModalProps) => {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');

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
                <DebouncedTextarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder="Вставьте JSON данные..."
                    rows={15}
                    error={error}
                />
                <div className="modal-actions">
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
