import { useState, useEffect } from 'react';
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
  // Локальное состояние для отображения (строки с 2 знаками после запятой)
  const [localValues, setLocalValues] = useState({
    generate_text_cost_multiplier: formData.generate_text_cost_multiplier.toFixed(2),
    generate_image_cost_multiplier: formData.generate_image_cost_multiplier.toFixed(2),
    generate_vizard_video_cut_cost_multiplier: formData.generate_vizard_video_cut_cost_multiplier.toFixed(2),
    transcribe_audio_cost_multiplier: formData.transcribe_audio_cost_multiplier.toFixed(2),
  });

  // Синхронизация с внешним состоянием
  useEffect(() => {
    setLocalValues({
      generate_text_cost_multiplier: formData.generate_text_cost_multiplier.toFixed(2),
      generate_image_cost_multiplier: formData.generate_image_cost_multiplier.toFixed(2),
      generate_vizard_video_cut_cost_multiplier: formData.generate_vizard_video_cut_cost_multiplier.toFixed(2),
      transcribe_audio_cost_multiplier: formData.transcribe_audio_cost_multiplier.toFixed(2),
    });
  }, [formData.generate_text_cost_multiplier, formData.generate_image_cost_multiplier, formData.generate_vizard_video_cut_cost_multiplier, formData.transcribe_audio_cost_multiplier]);

  const handleChange = (field: keyof FormData, value: string) => {
    // Обновляем локальное состояние для немедленного отображения
    setLocalValues({ ...localValues, [field]: value });

    // Разрешаем пустую строку - пользователь может захотеть стереть все
    if (value === '') {
      onChange(field, 0);
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(field, numValue);
    }
  };

  const handleBlur = (field: keyof FormData) => {
    const value = localValues[field];
    if (value === '') {
      // Если поле пустое, устанавливаем 0 и обновляем отображение
      onChange(field, 0);
      setLocalValues({ ...localValues, [field]: '0' });
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      // Округляем до 2 знаков после запятой
      const rounded = Math.round(numValue * 100) / 100;
      onChange(field, rounded);
      setLocalValues({ ...localValues, [field]: String(rounded) });
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
              type="text"
              inputMode="decimal"
              value={localValues.generate_text_cost_multiplier}
              onChange={(e) => handleChange('generate_text_cost_multiplier', e.target.value)}
              onBlur={() => handleBlur('generate_text_cost_multiplier')}
            />
          ) : (
            <div className="field-value">{formData.generate_text_cost_multiplier.toFixed(2)}</div>
          )}
        </div>

        <div className="multiplier-field">
          <label className="field-label">Генерация изображений</label>
          {isEditing ? (
            <Input
              type="text"
              inputMode="decimal"
              value={localValues.generate_image_cost_multiplier}
              onChange={(e) => handleChange('generate_image_cost_multiplier', e.target.value)}
              onBlur={() => handleBlur('generate_image_cost_multiplier')}
            />
          ) : (
            <div className="field-value">{formData.generate_image_cost_multiplier.toFixed(2)}</div>
          )}
        </div>

        <div className="multiplier-field">
          <label className="field-label">Генерация видео нарезок (Vizard)</label>
          {isEditing ? (
            <Input
              type="text"
              inputMode="decimal"
              value={localValues.generate_vizard_video_cut_cost_multiplier}
              onChange={(e) => handleChange('generate_vizard_video_cut_cost_multiplier', e.target.value)}
              onBlur={() => handleBlur('generate_vizard_video_cut_cost_multiplier')}
            />
          ) : (
            <div className="field-value">{formData.generate_vizard_video_cut_cost_multiplier.toFixed(2)}</div>
          )}
        </div>

        <div className="multiplier-field">
          <label className="field-label">Транскрибация аудио</label>
          {isEditing ? (
            <Input
              type="text"
              inputMode="decimal"
              value={localValues.transcribe_audio_cost_multiplier}
              onChange={(e) => handleChange('transcribe_audio_cost_multiplier', e.target.value)}
              onBlur={() => handleBlur('transcribe_audio_cost_multiplier')}
            />
          ) : (
            <div className="field-value">{formData.transcribe_audio_cost_multiplier.toFixed(2)}</div>
          )}
        </div>
      </div>
    </div>
  );
};
