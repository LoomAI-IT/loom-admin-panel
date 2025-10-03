import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import './JsonViewModal.css';

interface JsonViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const JsonViewModal = ({ isOpen, onClose, data }: JsonViewModalProps) => {
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    alert('JSON скопирован в буфер обмена');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Просмотр JSON">
      <div className="json-view-modal">
        <pre className="json-content">{jsonString}</pre>
        <div className="modal-actions">
          <Button variant="secondary" onClick={handleCopy}>
            Копировать
          </Button>
          <Button variant="primary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
};
