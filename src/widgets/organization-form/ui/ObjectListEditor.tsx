import { Textarea } from '../../../shared/ui/Textarea';
import { Button } from '../../../shared/ui/Button';
import './ObjectListEditor.css';

interface ObjectListEditorProps {
  title: string;
  items: Record<string, any>[];
  isEditing: boolean;
  onChange: (items: Record<string, any>[]) => void;
}

export const ObjectListEditor = ({ title, items, isEditing, onChange }: ObjectListEditorProps) => {
  const addItem = () => {
    onChange([...items, {}]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addFieldToItem = (itemIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex] = { ...newItems[itemIndex], '': '' };
    onChange(newItems);
  };

  const updateItemKey = (itemIndex: number, oldKey: string, newKey: string) => {
    const newItems = [...items];
    const item = { ...newItems[itemIndex] };
    const value = item[oldKey];
    delete item[oldKey];
    item[newKey] = value;
    newItems[itemIndex] = item;
    onChange(newItems);
  };

  const updateItemValue = (itemIndex: number, key: string, value: any) => {
    const newItems = [...items];
    newItems[itemIndex] = { ...newItems[itemIndex], [key]: value };
    onChange(newItems);
  };

  const removeFieldFromItem = (itemIndex: number, key: string) => {
    const newItems = [...items];
    const item = { ...newItems[itemIndex] };
    delete item[key];
    newItems[itemIndex] = item;
    onChange(newItems);
  };

  if (!isEditing && items.length === 0) {
    return null;
  }

  return (
    <div className="object-list-editor">
      <h3 className="editor-title">{title}</h3>

      {!isEditing ? (
        <div className="object-list-view">
          {items.map((item, itemIdx) => (
            <div key={itemIdx} className="object-item-card">
              <div className="object-item-header">
                <span className="object-item-title">Элемент {itemIdx + 1}</span>
              </div>
              <div className="object-item-fields">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="object-field-item">
                    <span className="field-key">{key}:</span>
                    <span className="field-value">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="object-list-edit">
          {items.map((item, itemIdx) => (
            <div key={itemIdx} className="object-item-edit-card">
              <div className="object-item-edit-header">
                <span className="object-item-title">Элемент {itemIdx + 1}</span>
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeItem(itemIdx)}
                  className="remove-item-button"
                >
                  ×
                </Button>
              </div>

              <div className="object-item-edit-fields">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="object-field-row">
                    <input
                      type="text"
                      className="field-key-input"
                      placeholder="Ключ"
                      value={key}
                      onChange={(e) => updateItemKey(itemIdx, key, e.target.value)}
                    />
                    <Textarea
                      placeholder="Значение"
                      value={typeof value === 'string' ? value : JSON.stringify(value)}
                      onChange={(e) => updateItemValue(itemIdx, key, e.target.value)}
                      className="field-value-input"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      onClick={() => removeFieldFromItem(itemIdx, key)}
                      className="remove-field-button"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="small"
                  onClick={() => addFieldToItem(itemIdx)}
                  className="add-field-button"
                >
                  + Добавить поле
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            size="small"
            onClick={addItem}
            className="add-item-button"
          >
            + Добавить элемент
          </Button>
        </div>
      )}
    </div>
  );
};
