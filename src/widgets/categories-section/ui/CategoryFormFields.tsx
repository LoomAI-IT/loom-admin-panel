import { useCallback, memo, useRef, useState, useEffect } from 'react';
import { Input } from '../../../shared/ui/Input';
import { Textarea } from '../../../shared/ui/Textarea';
import { Button } from '../../../shared/ui/Button';
import './CategoryFormFields.css';

// Оптимизированный Textarea с локальным состоянием
const OptimizedTextarea = memo(({
  value,
  onChange,
  ...props
}: React.ComponentProps<typeof Textarea>) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange?.(e);
  }, [onChange]);

  return <Textarea {...props} value={localValue} onChange={handleChange} />;
});

OptimizedTextarea.displayName = 'OptimizedTextarea';

// Мемоизированный компонент для элемента массива
const ArrayInputItem = memo(({
  value,
  index,
  onUpdate,
  onRemove,
  placeholder
}: {
  value: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(index, e.target.value);
  }, [index, onUpdate]);

  const handleClick = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="array-input-item">
      <OptimizedTextarea
        value={value}
        onChange={handleChange}
        placeholder={`${placeholder} ${index + 1}`}
      />
      <Button
        type="button"
        variant="danger"
        size="small"
        onClick={handleClick}
        className="remove-button"
      >
        ×
      </Button>
    </div>
  );
});

ArrayInputItem.displayName = 'ArrayInputItem';

// Мемоизированный компонент для секции с массивом
const ArrayInputSection = memo(({
  label,
  items,
  onUpdate,
  onRemove,
  onAdd,
  placeholder
}: {
  label: string;
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  placeholder: string;
}) => {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <div className="array-input-list">
        {items.map((item, idx) => (
          <ArrayInputItem
            key={idx}
            value={item}
            index={idx}
            onUpdate={onUpdate}
            onRemove={onRemove}
            placeholder={placeholder}
          />
        ))}
        <Button
          type="button"
          size="small"
          onClick={onAdd}
          className="add-button"
        >
          + Добавить {placeholder.toLowerCase()}
        </Button>
      </div>
    </div>
  );
});

ArrayInputSection.displayName = 'ArrayInputSection';

// Мемоизированный компонент для поля в good_sample
const GoodSampleField = memo(({
  sampleKey,
  value,
  sampleIdx,
  onKeyChange,
  onValueChange,
  onRemove
}: {
  sampleKey: string;
  value: any;
  sampleIdx: number;
  onKeyChange: (sampleIdx: number, oldKey: string, newKey: string) => void;
  onValueChange: (sampleIdx: number, key: string, value: string) => void;
  onRemove: (sampleIdx: number, key: string) => void;
}) => {
  const handleKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onKeyChange(sampleIdx, sampleKey, e.target.value);
  }, [sampleIdx, sampleKey, onKeyChange]);

  const handleValueChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(sampleIdx, sampleKey, e.target.value);
  }, [sampleIdx, sampleKey, onValueChange]);

  const handleRemove = useCallback(() => {
    onRemove(sampleIdx, sampleKey);
  }, [sampleIdx, sampleKey, onRemove]);

  return (
    <div className="good-sample-field-row">
      <input
        type="text"
        className="field-key-input"
        placeholder="Ключ"
        value={sampleKey}
        onChange={handleKeyChange}
      />
      <OptimizedTextarea
        placeholder="Значение"
        value={typeof value === 'string' ? value : JSON.stringify(value)}
        onChange={handleValueChange}
      />
      <Button
        type="button"
        variant="danger"
        size="small"
        onClick={handleRemove}
        className="remove-field-button"
      >
        ×
      </Button>
    </div>
  );
});

GoodSampleField.displayName = 'GoodSampleField';

// Мемоизированный компонент для одного good_sample
const GoodSampleCard = memo(({
  sample,
  sampleIdx,
  onKeyChange,
  onValueChange,
  onFieldRemove,
  onAddField,
  onRemoveSample
}: {
  sample: Record<string, any>;
  sampleIdx: number;
  onKeyChange: (sampleIdx: number, oldKey: string, newKey: string) => void;
  onValueChange: (sampleIdx: number, key: string, value: string) => void;
  onFieldRemove: (sampleIdx: number, key: string) => void;
  onAddField: (sampleIdx: number) => void;
  onRemoveSample: (sampleIdx: number) => void;
}) => {
  const handleAddField = useCallback(() => {
    onAddField(sampleIdx);
  }, [sampleIdx, onAddField]);

  const handleRemoveSample = useCallback(() => {
    onRemoveSample(sampleIdx);
  }, [sampleIdx, onRemoveSample]);

  return (
    <div className="good-sample-card">
      <div className="good-sample-header">
        <span className="good-sample-title">Пример {sampleIdx + 1}</span>
        <Button
          type="button"
          variant="danger"
          size="small"
          onClick={handleRemoveSample}
          className="remove-sample-button"
        >
          ×
        </Button>
      </div>

      <div className="good-sample-fields">
        {Object.entries(sample).map(([key, value]) => (
          <GoodSampleField
            key={key}
            sampleKey={key}
            value={value}
            sampleIdx={sampleIdx}
            onKeyChange={onKeyChange}
            onValueChange={onValueChange}
            onRemove={onFieldRemove}
          />
        ))}
        <Button
          type="button"
          size="small"
          onClick={handleAddField}
          className="add-field-button"
        >
          + Добавить поле
        </Button>
      </div>
    </div>
  );
});

GoodSampleCard.displayName = 'GoodSampleCard';

interface CategoryFormData {
  name: string;
  goal: string;
  prompt_for_image_style: string;
  structure_skeleton: string[];
  structure_flex_level_min: string;
  structure_flex_level_max: string;
  structure_flex_level_comment: string;
  must_have: string[];
  must_avoid: string[];
  social_networks_rules: string;
  len_min: string;
  len_max: string;
  n_hashtags_min: string;
  n_hashtags_max: string;
  cta_type: string;
  tone_of_voice: string[];
  brand_rules: string[];
  good_samples: Record<string, any>[];
  additional_info: string[];
}

interface CategoryFormFieldsProps {
  formData: CategoryFormData;
  onChange: (data: CategoryFormData) => void;
}

export const CategoryFormFields = ({ formData, onChange }: CategoryFormFieldsProps) => {
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const updateField = useCallback(<K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
    onChange({ ...formDataRef.current, [field]: value });
  }, [onChange]);

  const addArrayItem = useCallback((field: keyof CategoryFormData) => {
    const currentArray = formDataRef.current[field] as any[];
    onChange({ ...formDataRef.current, [field]: [...currentArray, ''] });
  }, [onChange]);

  const removeArrayItem = useCallback((field: keyof CategoryFormData, index: number) => {
    const currentArray = formDataRef.current[field] as any[];
    onChange({ ...formDataRef.current, [field]: currentArray.filter((_, i) => i !== index) });
  }, [onChange]);

  const updateArrayItem = useCallback((field: keyof CategoryFormData, index: number, value: any) => {
    const currentArray = formDataRef.current[field] as any[];
    const newArray = [...currentArray];
    newArray[index] = value;
    onChange({ ...formDataRef.current, [field]: newArray });
  }, [onChange]);

  // Обработчики для good_samples
  const handleSampleKeyChange = useCallback((sampleIdx: number, oldKey: string, newKey: string) => {
    const newSamples = [...formDataRef.current.good_samples];
    const oldValue = newSamples[sampleIdx][oldKey];
    delete newSamples[sampleIdx][oldKey];
    newSamples[sampleIdx][newKey] = oldValue;
    onChange({ ...formDataRef.current, good_samples: newSamples });
  }, [onChange]);

  const handleSampleValueChange = useCallback((sampleIdx: number, key: string, value: string) => {
    const newSamples = [...formDataRef.current.good_samples];
    newSamples[sampleIdx][key] = value;
    onChange({ ...formDataRef.current, good_samples: newSamples });
  }, [onChange]);

  const handleSampleFieldRemove = useCallback((sampleIdx: number, key: string) => {
    const newSamples = [...formDataRef.current.good_samples];
    delete newSamples[sampleIdx][key];
    onChange({ ...formDataRef.current, good_samples: newSamples });
  }, [onChange]);

  const handleSampleAddField = useCallback((sampleIdx: number) => {
    const newSamples = [...formDataRef.current.good_samples];
    newSamples[sampleIdx][''] = '';
    onChange({ ...formDataRef.current, good_samples: newSamples });
  }, [onChange]);

  const handleAddSample = useCallback(() => {
    onChange({ ...formDataRef.current, good_samples: [...formDataRef.current.good_samples, {}] });
  }, [onChange]);

  const handleRemoveSample = useCallback((sampleIdx: number) => {
    removeArrayItem('good_samples', sampleIdx);
  }, [removeArrayItem]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('name', e.target.value);
  }, [updateField]);

  const handleGoalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField('goal', e.target.value);
  }, [updateField]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField('prompt_for_image_style', e.target.value);
  }, [updateField]);

  // Обработчики для массивов
  const handleStructureSkeletonUpdate = useCallback((index: number, value: string) => {
    updateArrayItem('structure_skeleton', index, value);
  }, [updateArrayItem]);

  const handleStructureSkeletonRemove = useCallback((index: number) => {
    removeArrayItem('structure_skeleton', index);
  }, [removeArrayItem]);

  const handleStructureSkeletonAdd = useCallback(() => {
    addArrayItem('structure_skeleton');
  }, [addArrayItem]);

  const handleMustHaveUpdate = useCallback((index: number, value: string) => {
    updateArrayItem('must_have', index, value);
  }, [updateArrayItem]);

  const handleMustHaveRemove = useCallback((index: number) => {
    removeArrayItem('must_have', index);
  }, [removeArrayItem]);

  const handleMustHaveAdd = useCallback(() => {
    addArrayItem('must_have');
  }, [addArrayItem]);

  const handleMustAvoidUpdate = useCallback((index: number, value: string) => {
    updateArrayItem('must_avoid', index, value);
  }, [updateArrayItem]);

  const handleMustAvoidRemove = useCallback((index: number) => {
    removeArrayItem('must_avoid', index);
  }, [removeArrayItem]);

  const handleMustAvoidAdd = useCallback(() => {
    addArrayItem('must_avoid');
  }, [addArrayItem]);

  const handleToneOfVoiceUpdate = useCallback((index: number, value: string) => {
    updateArrayItem('tone_of_voice', index, value);
  }, [updateArrayItem]);

  const handleToneOfVoiceRemove = useCallback((index: number) => {
    removeArrayItem('tone_of_voice', index);
  }, [removeArrayItem]);

  const handleToneOfVoiceAdd = useCallback(() => {
    addArrayItem('tone_of_voice');
  }, [addArrayItem]);

  const handleBrandRulesUpdate = useCallback((index: number, value: string) => {
    updateArrayItem('brand_rules', index, value);
  }, [updateArrayItem]);

  const handleBrandRulesRemove = useCallback((index: number) => {
    removeArrayItem('brand_rules', index);
  }, [removeArrayItem]);

  const handleBrandRulesAdd = useCallback(() => {
    addArrayItem('brand_rules');
  }, [addArrayItem]);

  const handleAdditionalInfoUpdate = useCallback((index: number, value: string) => {
    updateArrayItem('additional_info', index, value);
  }, [updateArrayItem]);

  const handleAdditionalInfoRemove = useCallback((index: number) => {
    removeArrayItem('additional_info', index);
  }, [removeArrayItem]);

  const handleAdditionalInfoAdd = useCallback(() => {
    addArrayItem('additional_info');
  }, [addArrayItem]);

  return (
    <div className="category-form-fields">
      {/* Основная информация */}
      <section className="form-section">
        <h3 className="form-section-title">Основная информация</h3>

        <Input
          label="Название рубрики *"
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          required
          placeholder="Введите название"
        />

        <OptimizedTextarea
          label="Цель"
          value={formData.goal}
          onChange={handleGoalChange}
          placeholder="Введите цель рубрики"
        />

        <OptimizedTextarea
          label="Промпт для стиля изображения"
          value={formData.prompt_for_image_style}
          onChange={handlePromptChange}
          placeholder="Введите промпт для стиля изображения"
        />
      </section>

      {/* Структура контента */}
      <section className="form-section">
        <h3 className="form-section-title">Структура контента</h3>

        <ArrayInputSection
          label="Структура скелет"
          items={formData.structure_skeleton}
          onUpdate={handleStructureSkeletonUpdate}
          onRemove={handleStructureSkeletonRemove}
          onAdd={handleStructureSkeletonAdd}
          placeholder="Элемент структуры"
        />

        <div className="input-grid-2">
          <Input
            label="Мин. уровень гибкости"
            type="text"
            inputMode="numeric"
            value={formData.structure_flex_level_min}
            onChange={(e) => updateField('structure_flex_level_min', e.target.value)}
            placeholder="0"
          />
          <Input
            label="Макс. уровень гибкости"
            type="text"
            inputMode="numeric"
            value={formData.structure_flex_level_max}
            onChange={(e) => updateField('structure_flex_level_max', e.target.value)}
            placeholder="100"
          />
        </div>

        <OptimizedTextarea
          label="Комментарий к уровню гибкости"
          value={formData.structure_flex_level_comment}
          onChange={(e) => updateField('structure_flex_level_comment', e.target.value)}
          placeholder="Комментарий"
        />
      </section>

      {/* Правила контента */}
      <section className="form-section">
        <h3 className="form-section-title">Правила контента</h3>

        <ArrayInputSection
          label="Обязательные элементы"
          items={formData.must_have}
          onUpdate={handleMustHaveUpdate}
          onRemove={handleMustHaveRemove}
          onAdd={handleMustHaveAdd}
          placeholder="обязательный элемент"
        />

        <ArrayInputSection
          label="Запрещённые элементы"
          items={formData.must_avoid}
          onUpdate={handleMustAvoidUpdate}
          onRemove={handleMustAvoidRemove}
          onAdd={handleMustAvoidAdd}
          placeholder="запрещённый элемент"
        />
      </section>

      {/* Параметры текста */}
      <section className="form-section">
        <h3 className="form-section-title">Параметры текста</h3>

        <div className="input-grid-2">
          <Input
            label="Мин. длина текста"
            type="text"
            inputMode="numeric"
            value={formData.len_min}
            onChange={(e) => updateField('len_min', e.target.value)}
            placeholder="0"
          />
          <Input
            label="Макс. длина текста"
            type="text"
            inputMode="numeric"
            value={formData.len_max}
            onChange={(e) => updateField('len_max', e.target.value)}
            placeholder="5000"
          />
        </div>

        <div className="input-grid-2">
          <Input
            label="Мин. количество хэштегов"
            type="text"
            inputMode="numeric"
            value={formData.n_hashtags_min}
            onChange={(e) => updateField('n_hashtags_min', e.target.value)}
            placeholder="0"
          />
          <Input
            label="Макс. количество хэштегов"
            type="text"
            inputMode="numeric"
            value={formData.n_hashtags_max}
            onChange={(e) => updateField('n_hashtags_max', e.target.value)}
            placeholder="10"
          />
        </div>

        <Input
          label="Тип призыва к действию (CTA)"
          type="text"
          value={formData.cta_type}
          onChange={(e) => updateField('cta_type', e.target.value)}
          placeholder="Например: подписка, покупка, лайк"
        />

        <OptimizedTextarea
          label="Правила для соцсетей"
          value={formData.social_networks_rules}
          onChange={(e) => updateField('social_networks_rules', e.target.value)}
          placeholder="Правила публикации в соцсетях"
        />
      </section>

      {/* Стиль и тон */}
      <section className="form-section">
        <h3 className="form-section-title">Стиль и тон</h3>

        <ArrayInputSection
          label="Тон общения"
          items={formData.tone_of_voice}
          onUpdate={handleToneOfVoiceUpdate}
          onRemove={handleToneOfVoiceRemove}
          onAdd={handleToneOfVoiceAdd}
          placeholder="тон общения"
        />

        <ArrayInputSection
          label="Правила бренда"
          items={formData.brand_rules}
          onUpdate={handleBrandRulesUpdate}
          onRemove={handleBrandRulesRemove}
          onAdd={handleBrandRulesAdd}
          placeholder="правило бренда"
        />
      </section>

      {/* Примеры */}
      <section className="form-section">
        <h3 className="form-section-title">Хорошие примеры</h3>

        <div className="good-samples-list">
          {formData.good_samples.map((sample, sampleIdx) => (
            <GoodSampleCard
              key={sampleIdx}
              sample={sample}
              sampleIdx={sampleIdx}
              onKeyChange={handleSampleKeyChange}
              onValueChange={handleSampleValueChange}
              onFieldRemove={handleSampleFieldRemove}
              onAddField={handleSampleAddField}
              onRemoveSample={handleRemoveSample}
            />
          ))}
          <Button
            type="button"
            size="small"
            onClick={handleAddSample}
            className="add-button"
          >
            + Добавить пример
          </Button>
        </div>
      </section>

      {/* Дополнительная информация */}
      <section className="form-section">
        <h3 className="form-section-title">Дополнительная информация</h3>

        <ArrayInputSection
          label=""
          items={formData.additional_info}
          onUpdate={handleAdditionalInfoUpdate}
          onRemove={handleAdditionalInfoRemove}
          onAdd={handleAdditionalInfoAdd}
          placeholder="информацию"
        />
      </section>
    </div>
  );
};
