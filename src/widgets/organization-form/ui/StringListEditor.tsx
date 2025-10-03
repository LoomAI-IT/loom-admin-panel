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

  if (!isEditing && items.length === 0) {
    return null;
  }

  return (
    <div className="string-list-editor">
      <h3 className="editor-title">{title}</h3>

      {!isEditing ? (
        <div className="string-list-view">
          {items.map((item, idx) => (
            <div key={idx} className="string-list-item">
              <span className="item-number">{idx + 1}.</span>
              <span className="item-content">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="string-list-edit">
          {items.map((item, idx) => (
            <div key={idx} className="string-item-row">
              <Textarea
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                placeholder={`Элемент ${idx + 1}`}
                rows={3}
              />
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => handleRemoveItem(idx)}
                className="remove-item-button"
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="small"
            onClick={handleAddItem}
            className="add-item-button"
          >
            + Добавить элемент
          </Button>
        </div>
      )}
    </div>
  );
};
