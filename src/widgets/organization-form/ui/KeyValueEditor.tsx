import { Textarea } from '../../../shared/ui/Textarea';
import { Button } from '../../../shared/ui/Button';
import './KeyValueEditor.css';

interface KeyValueEditorProps {
  title: string;
  data: Record<string, any>;
  isEditing: boolean;
  onChange: (data: Record<string, any>) => void;
}

export const KeyValueEditor = ({ title, data, isEditing, onChange }: KeyValueEditorProps) => {
  const addField = () => {
    onChange({ ...data, '': '' });
  };

  const updateKey = (oldKey: string, newKey: string) => {
    const newData = { ...data };
    const value = newData[oldKey];
    delete newData[oldKey];
    newData[newKey] = value;
    onChange(newData);
  };

  const updateValue = (key: string, value: any) => {
    onChange({ ...data, [key]: value });
  };

  const removeField = (key: string) => {
    const newData = { ...data };
    delete newData[key];
    onChange(newData);
  };

  if (!isEditing && Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div className="key-value-editor">
      <h3 className="editor-title">{title}</h3>

      {!isEditing ? (
        <div className="key-value-view">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="key-value-item">
              <span className="key-label">{key}:</span>
              <span className="value-content">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="key-value-edit">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="key-value-field-row">
              <input
                type="text"
                className="field-key-input"
                placeholder="Ключ"
                value={key}
                onChange={(e) => updateKey(key, e.target.value)}
              />
              <Textarea
                placeholder="Значение"
                value={typeof value === 'string' ? value : JSON.stringify(value)}
                onChange={(e) => updateValue(key, e.target.value)}
                className="field-value-input"
              />
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => removeField(key)}
                className="remove-field-button"
              >
                ×
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="small"
            onClick={addField}
            className="add-field-button"
          >
            + Добавить поле
          </Button>
        </div>
      )}
    </div>
  );
};
