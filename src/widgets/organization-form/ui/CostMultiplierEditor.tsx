import { Input } from '../../../shared/ui/Input';

interface FormData {
  generate_text_cost_multiplier: number;
  generate_image_cost_multiplier: number;
  generate_vizard_video_cut_cost_multiplier: number;
  transcribe_audio_cost_multiplier: number;
}

interface CostMultiplierEditorProps {
  isEditing: boolean;
  formData: FormData;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export const CostMultiplierEditor = ({ isEditing, formData, onChange }: CostMultiplierEditorProps) => {
  const handleChange = (field: keyof FormData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(field, numValue);
    }
  };

  return (
    <div className="cost-multiplier-section">
      <h4 className="subsection-title">Множители стоимости</h4>

      <div className="multiplier-grid">
        <div className="multiplier-field">
          <label className="field-label">Генерация текста</label>
          {isEditing ? (
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.generate_text_cost_multiplier}
              onChange={(e) => handleChange('generate_text_cost_multiplier', e.target.value)}
            />
          ) : (
            <div className="field-value">{formData.generate_text_cost_multiplier}</div>
          )}
        </div>

        <div className="multiplier-field">
          <label className="field-label">Генерация изображений</label>
          {isEditing ? (
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.generate_image_cost_multiplier}
              onChange={(e) => handleChange('generate_image_cost_multiplier', e.target.value)}
            />
          ) : (
            <div className="field-value">{formData.generate_image_cost_multiplier}</div>
          )}
        </div>

        <div className="multiplier-field">
          <label className="field-label">Генерация видео нарезок (Vizard)</label>
          {isEditing ? (
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.generate_vizard_video_cut_cost_multiplier}
              onChange={(e) => handleChange('generate_vizard_video_cut_cost_multiplier', e.target.value)}
            />
          ) : (
            <div className="field-value">{formData.generate_vizard_video_cut_cost_multiplier}</div>
          )}
        </div>

        <div className="multiplier-field">
          <label className="field-label">Транскрибация аудио</label>
          {isEditing ? (
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.transcribe_audio_cost_multiplier}
              onChange={(e) => handleChange('transcribe_audio_cost_multiplier', e.target.value)}
            />
          ) : (
            <div className="field-value">{formData.transcribe_audio_cost_multiplier}</div>
          )}
        </div>
      </div>
    </div>
  );
};
