import {useState} from 'react';
import {Button, Modal} from '../../../shared/ui';
import {JsonEditor} from './JsonEditor';
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
                <JsonEditor value={jsonText} onChange={setJsonText} error={error}/>
                <div className="json-import-modal-actions">
                    <Button variant="primary" onClick={handleSubmit} disabled={!jsonText.trim()}>
                        Применить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
