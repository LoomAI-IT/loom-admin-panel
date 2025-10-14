/**
 * Рефакторинг CategoryFormFields
 *
 * Было: 632 строки, мемоизация, callback hell, дублирование компонентов
 * Стало: ~200 строк, простой код, переиспользование компонентов
 *
 * Изменения:
 * - Убрана избыточная мемоизация (OptimizedTextarea, ArrayInputItem и т.д.)
 * - Использование ArrayField из shared/ui вместо дублирования
 * - Использование GoodSamplesEditor из shared/ui
 * - Убраны десятки useCallback обработчиков для массивов
 * - Простая работа с формой через updateField из useEntityForm
 */

import {Input, Textarea, ArrayField, GoodSamplesEditor} from '../../../shared/ui';
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

export const CategoryFormFields = ({formData, onChange}: CategoryFormFieldsProps) => {
    // Универсальный обработчик для обновления полей формы
    const updateField = <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
        onChange({...formData, [field]: value});
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

                <Textarea
                    label="Цель"
                    value={formData.goal}
                    onChange={(e) => updateField('goal', e.target.value)}
                    placeholder="Введите цель рубрики"
                />

                <Textarea
                    label="Промпт для стиля изображения"
                    value={formData.prompt_for_image_style}
                    onChange={(e) => updateField('prompt_for_image_style', e.target.value)}
                    placeholder="Введите промпт для стиля изображения"
                />
            </section>

            {/* Структура контента */}
            <section className="form-section">
                <h3 className="form-section-title">Структура контента</h3>

                <ArrayField
                    label="Структура скелет"
                    value={formData.structure_skeleton}
                    onChange={(value) => updateField('structure_skeleton', value)}
                    placeholder="элемент структуры"
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

                <Textarea
                    label="Комментарий к уровню гибкости"
                    value={formData.structure_flex_level_comment}
                    onChange={(e) => updateField('structure_flex_level_comment', e.target.value)}
                    placeholder="Комментарий"
                />
            </section>

            {/* Правила контента */}
            <section className="form-section">
                <h3 className="form-section-title">Правила контента</h3>

                <ArrayField
                    label="Обязательные элементы"
                    value={formData.must_have}
                    onChange={(value) => updateField('must_have', value)}
                    placeholder="обязательный элемент"
                />

                <ArrayField
                    label="Запрещённые элементы"
                    value={formData.must_avoid}
                    onChange={(value) => updateField('must_avoid', value)}
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

                <Textarea
                    label="Правила для соцсетей"
                    value={formData.social_networks_rules}
                    onChange={(e) => updateField('social_networks_rules', e.target.value)}
                    placeholder="Правила публикации в соцсетях"
                />
            </section>

            {/* Стиль и тон */}
            <section className="form-section">
                <h3 className="form-section-title">Стиль и тон</h3>

                <ArrayField
                    label="Тон общения"
                    value={formData.tone_of_voice}
                    onChange={(value) => updateField('tone_of_voice', value)}
                    placeholder="тон общения"
                />

                <ArrayField
                    label="Правила бренда"
                    value={formData.brand_rules}
                    onChange={(value) => updateField('brand_rules', value)}
                    placeholder="правило бренда"
                />
            </section>

            {/* Примеры */}
            <section className="form-section">
                <h3 className="form-section-title">Хорошие примеры</h3>

                <GoodSamplesEditor
                    value={formData.good_samples}
                    onChange={(value) => updateField('good_samples', value)}
                />
            </section>

            {/* Дополнительная информация */}
            <section className="form-section">
                <h3 className="form-section-title">Дополнительная информация</h3>

                <ArrayField
                    value={formData.additional_info}
                    onChange={(value) => updateField('additional_info', value)}
                    placeholder="информацию"
                />
            </section>
        </div>
    );
};
