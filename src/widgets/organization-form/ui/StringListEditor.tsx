import { Button } from '../../../shared/ui/Button';
import { Textarea } from '../../../shared/ui/Textarea';
import './StringListEditor.css';

interface StringListEditorProps {
  title: string;
  items: string[];
  isEditing: boolean;
  onChange: (items: string[]) => void;
}

export const StringListEditor = ({ title, items, isEditing, onChange }: StringListEditorProps) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    onChange([...items, '']);
  };

  return (
    <div className="info-section">
      <h2>{title}</h2>
      <div className="info-item full-width">
        {isEditing ? (
          <div className="list-editor">
            {items.map((item, idx) => (
              <div key={idx} className="list-item">
                <Textarea
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  rows={3}
                />
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleRemoveItem(idx)}
                  className="btn-remove"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button size="small" onClick={handleAddItem}>
              + Добавить
            </Button>
          </div>
        ) : (
          <div className="value">
            {items.length > 0 ? (
              <ul>
                {items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              'Не задано'
            )}
          </div>
        )}
      </div>
    </div>
  );
};
