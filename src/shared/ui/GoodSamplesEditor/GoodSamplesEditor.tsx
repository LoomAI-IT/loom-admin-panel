/**
 * Универсальный компонент для работы с good_samples (массив объектов key-value)
 * Решает проблему дублирования GoodSampleField и GoodSampleCard
 *
 * Принципы:
 * - Простота: без избыточной мемоизации
 * - DRY: один компонент для всех good_samples
 * - KISS: простая логика без сложных оптимизаций
 */

import { Textarea } from '../Textarea';
import { Button } from '../Button';
import './GoodSamplesEditor.css';

interface GoodSamplesEditorProps {
  label?: string;
  value: Record<string, any>[];
  onChange: (newValue: Record<string, any>[]) => void;
}

export const GoodSamplesEditor = ({ label, value, onChange }: GoodSamplesEditorProps) => {
  const handleAddSample = () => {
    onChange([...value, {}]);
  };

  const handleRemoveSample = (sampleIndex: number) => {
    onChange(value.filter((_, i) => i !== sampleIndex));
  };

  const handleAddField = (sampleIndex: number) => {
    const updated = [...value];
    updated[sampleIndex] = { ...updated[sampleIndex], '': '' };
    onChange(updated);
  };

  const handleRemoveField = (sampleIndex: number, fieldKey: string) => {
    const updated = [...value];
    const newSample = { ...updated[sampleIndex] };
    delete newSample[fieldKey];
    updated[sampleIndex] = newSample;
    onChange(updated);
  };

  const handleKeyChange = (sampleIndex: number, oldKey: string, newKey: string) => {
    const updated = [...value];
    const sample = updated[sampleIndex];
    const oldValue = sample[oldKey];
    delete sample[oldKey];
    sample[newKey] = oldValue;
    onChange(updated);
  };

  const handleValueChange = (sampleIndex: number, key: string, newValue: string) => {
    const updated = [...value];
    updated[sampleIndex] = { ...updated[sampleIndex], [key]: newValue };
    onChange(updated);
  };

  return (
    <div className="good-samples-editor">
      {label && <label className="good-samples-label">{label}</label>}

      <div className="good-samples-list">
        {value.map((sample, sampleIdx) => (
          <div key={sampleIdx} className="good-sample-card">
            <div className="good-sample-header">
              <span className="good-sample-title">Пример {sampleIdx + 1}</span>
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => handleRemoveSample(sampleIdx)}
              >
                ×
              </Button>
            </div>

            <div className="good-sample-fields">
              {Object.entries(sample).map(([key, val]) => (
                <div key={key} className="good-sample-field">
                  <input
                    type="text"
                    className="field-key-input"
                    placeholder="Ключ"
                    value={key}
                    onChange={(e) => handleKeyChange(sampleIdx, key, e.target.value)}
                  />
                  <Textarea
                    placeholder="Значение"
                    value={typeof val === 'string' ? val : JSON.stringify(val)}
                    onChange={(e) => handleValueChange(sampleIdx, key, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => handleRemoveField(sampleIdx, key)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => handleAddField(sampleIdx)}
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
          onClick={handleAddSample}
          className="add-sample-button"
        >
          + Добавить пример
        </Button>
      </div>
    </div>
  );
};
