import { Input } from '../../../shared/ui/Input';
import { Textarea } from '../../../shared/ui/Textarea';
import { Button } from '../../../shared/ui/Button';
import './CategoryFormFields.css';

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
  const updateField = <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
    onChange({ ...formData, [field]: value });
  };

  const addArrayItem = (field: keyof CategoryFormData) => {
    const currentArray = formData[field] as any[];
    updateField(field, [...currentArray, ''] as any);
  };

  const removeArrayItem = (field: keyof CategoryFormData, index: number) => {
    const currentArray = formData[field] as any[];
    updateField(field, currentArray.filter((_, i) => i !== index) as any);
  };

  const updateArrayItem = (field: keyof CategoryFormData, index: number, value: any) => {
    const currentArray = formData[field] as any[];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateField(field, newArray as any);
  };

  return (
    <div className="category-form-fields">
      {/* Основная информация */}
      <section className="form-section">
        <h3 className="form-section-title">Основная информация</h3>

        <Input
          label="Название рубрики *"
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
          placeholder="Введите название"
        />

        <div className="input-wrapper">
          <label className="input-label">Цель</label>
          <textarea
            className="input"
            value={formData.goal}
            onChange={(e) => updateField('goal', e.target.value)}
            placeholder="Введите цель рубрики"
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label">Промпт для стиля изображения</label>
          <textarea
            className="input"
            value={formData.prompt_for_image_style}
            onChange={(e) => updateField('prompt_for_image_style', e.target.value)}
            placeholder="Введите промпт для стиля изображения"
          />
        </div>
      </section>

      {/* Структура контента */}
      <section className="form-section">
        <h3 className="form-section-title">Структура контента</h3>

        <div className="input-wrapper">
          <label className="input-label">Структура скелет</label>
          <div className="array-input-list">
            {formData.structure_skeleton.map((item, idx) => (
              <div key={idx} className="array-input-item">
                <Textarea
                  value={item}
                  onChange={(e) => updateArrayItem('structure_skeleton', idx, e.target.value)}
                  placeholder={`Элемент структуры ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('structure_skeleton', idx)}
                  className="remove-button"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="small"
              onClick={() => addArrayItem('structure_skeleton')}
              className="add-button"
            >
              + Добавить элемент структуры
            </Button>
          </div>
        </div>

        <div className="input-grid-2">
          <Input
            label="Мин. уровень гибкости"
            type="number"
            value={formData.structure_flex_level_min}
            onChange={(e) => updateField('structure_flex_level_min', e.target.value)}
            placeholder="0"
            min="0"
            max="100"
          />
          <Input
            label="Макс. уровень гибкости"
            type="number"
            value={formData.structure_flex_level_max}
            onChange={(e) => updateField('structure_flex_level_max', e.target.value)}
            placeholder="100"
            min="0"
            max="100"
          />
        </div>

        <div className="input-wrapper">
          <label className="input-label">Комментарий к уровню гибкости</label>
          <textarea
            className="input"
            value={formData.structure_flex_level_comment}
            onChange={(e) => updateField('structure_flex_level_comment', e.target.value)}
            placeholder="Комментарий"
          />
        </div>
      </section>

      {/* Правила контента */}
      <section className="form-section">
        <h3 className="form-section-title">Правила контента</h3>

        <div className="input-wrapper">
          <label className="input-label">Обязательные элементы</label>
          <div className="array-input-list">
            {formData.must_have.map((item, idx) => (
              <div key={idx} className="array-input-item">
                <Textarea
                  value={item}
                  onChange={(e) => updateArrayItem('must_have', idx, e.target.value)}
                  placeholder={`Обязательный элемент ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('must_have', idx)}
                  className="remove-button"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="small"
              onClick={() => addArrayItem('must_have')}
              className="add-button"
            >
              + Добавить обязательный элемент
            </Button>
          </div>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Запрещённые элементы</label>
          <div className="array-input-list">
            {formData.must_avoid.map((item, idx) => (
              <div key={idx} className="array-input-item">
                <Textarea
                  value={item}
                  onChange={(e) => updateArrayItem('must_avoid', idx, e.target.value)}
                  placeholder={`Запрещённый элемент ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('must_avoid', idx)}
                  className="remove-button"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="small"
              onClick={() => addArrayItem('must_avoid')}
              className="add-button"
            >
              + Добавить запрещённый элемент
            </Button>
          </div>
        </div>
      </section>

      {/* Параметры текста */}
      <section className="form-section">
        <h3 className="form-section-title">Параметры текста</h3>

        <div className="input-grid-2">
          <Input
            label="Мин. длина текста"
            type="number"
            value={formData.len_min}
            onChange={(e) => updateField('len_min', e.target.value)}
            placeholder="0"
            min="0"
          />
          <Input
            label="Макс. длина текста"
            type="number"
            value={formData.len_max}
            onChange={(e) => updateField('len_max', e.target.value)}
            placeholder="5000"
            min="0"
          />
        </div>

        <div className="input-grid-2">
          <Input
            label="Мин. количество хэштегов"
            type="number"
            value={formData.n_hashtags_min}
            onChange={(e) => updateField('n_hashtags_min', e.target.value)}
            placeholder="0"
            min="0"
          />
          <Input
            label="Макс. количество хэштегов"
            type="number"
            value={formData.n_hashtags_max}
            onChange={(e) => updateField('n_hashtags_max', e.target.value)}
            placeholder="10"
            min="0"
          />
        </div>

        <Input
          label="Тип призыва к действию (CTA)"
          type="text"
          value={formData.cta_type}
          onChange={(e) => updateField('cta_type', e.target.value)}
          placeholder="Например: подписка, покупка, лайк"
        />

        <div className="input-wrapper">
          <label className="input-label">Правила для соцсетей</label>
          <textarea
            className="input"
            value={formData.social_networks_rules}
            onChange={(e) => updateField('social_networks_rules', e.target.value)}
            placeholder="Правила публикации в соцсетях"
          />
        </div>
      </section>

      {/* Стиль и тон */}
      <section className="form-section">
        <h3 className="form-section-title">Стиль и тон</h3>

        <div className="input-wrapper">
          <label className="input-label">Тон общения</label>
          <div className="array-input-list">
            {formData.tone_of_voice.map((item, idx) => (
              <div key={idx} className="array-input-item">
                <Textarea
                  value={item}
                  onChange={(e) => updateArrayItem('tone_of_voice', idx, e.target.value)}
                  placeholder={`Тон общения ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('tone_of_voice', idx)}
                  className="remove-button"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="small"
              onClick={() => addArrayItem('tone_of_voice')}
              className="add-button"
            >
              + Добавить тон общения
            </Button>
          </div>
        </div>

        <div className="input-wrapper">
          <label className="input-label">Правила бренда</label>
          <div className="array-input-list">
            {formData.brand_rules.map((item, idx) => (
              <div key={idx} className="array-input-item">
                <Textarea
                  value={item}
                  onChange={(e) => updateArrayItem('brand_rules', idx, e.target.value)}
                  placeholder={`Правило бренда ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('brand_rules', idx)}
                  className="remove-button"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="small"
              onClick={() => addArrayItem('brand_rules')}
              className="add-button"
            >
              + Добавить правило бренда
            </Button>
          </div>
        </div>
      </section>

      {/* Примеры */}
      <section className="form-section">
        <h3 className="form-section-title">Хорошие примеры</h3>

        <div className="good-samples-list">
          {formData.good_samples.map((sample, sampleIdx) => (
            <div key={sampleIdx} className="good-sample-card">
              <div className="good-sample-header">
                <span className="good-sample-title">Пример {sampleIdx + 1}</span>
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('good_samples', sampleIdx)}
                  className="remove-sample-button"
                >
                  ×
                </Button>
              </div>

              <div className="good-sample-fields">
                {Object.entries(sample).map(([key, value], fieldIdx) => (
                  <div key={fieldIdx} className="good-sample-field-row">
                    <input
                      type="text"
                      className="field-key-input"
                      placeholder="Ключ"
                      value={key}
                      onChange={(e) => {
                        const newSamples = [...formData.good_samples];
                        const oldValue = newSamples[sampleIdx][key];
                        delete newSamples[sampleIdx][key];
                        newSamples[sampleIdx][e.target.value] = oldValue;
                        updateField('good_samples', newSamples);
                      }}
                    />
                    <Textarea
                      placeholder="Значение"
                      value={typeof value === 'string' ? value : JSON.stringify(value)}
                      onChange={(e) => {
                        const newSamples = [...formData.good_samples];
                        newSamples[sampleIdx][key] = e.target.value;
                        updateField('good_samples', newSamples);
                      }}
                      className="field-value-textarea"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      onClick={() => {
                        const newSamples = [...formData.good_samples];
                        delete newSamples[sampleIdx][key];
                        updateField('good_samples', newSamples);
                      }}
                      className="remove-field-button"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="small"
                  onClick={() => {
                    const newSamples = [...formData.good_samples];
                    newSamples[sampleIdx][''] = '';
                    updateField('good_samples', newSamples);
                  }}
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
            onClick={() => updateField('good_samples', [...formData.good_samples, {}])}
            className="add-button"
          >
            + Добавить пример
          </Button>
        </div>
      </section>

      {/* Дополнительная информация */}
      <section className="form-section">
        <h3 className="form-section-title">Дополнительная информация</h3>

        <div className="input-wrapper">
          <div className="array-input-list">
            {formData.additional_info.map((item, idx) => (
              <div key={idx} className="array-input-item">
                <Textarea
                  value={item}
                  onChange={(e) => updateArrayItem('additional_info', idx, e.target.value)}
                  placeholder={`Доп. информация ${idx + 1}`}
                />
                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeArrayItem('additional_info', idx)}
                  className="remove-button"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="small"
              onClick={() => addArrayItem('additional_info')}
              className="add-button"
            >
              + Добавить информацию
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
