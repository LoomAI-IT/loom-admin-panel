import {type AutopostingFormData} from '../../../entities/autoposting';
import {DebouncedInput, DebouncedTextarea, StringListField, ObjectListField} from '../../../shared/ui';
import '../../category-table/ui/CategoryFormFields.css';

interface AutopostingFormFieldsProps {
    formData: AutopostingFormData;
    onChange: (data: AutopostingFormData) => void;
}

export const AutopostingFormFields = ({formData, onChange}: AutopostingFormFieldsProps) => {
    const updateField = <K extends keyof AutopostingFormData>(field: K, value: AutopostingFormData[K]) => {
        onChange({...formData, [field]: value});
    };

    return (
        <div className="category-form-fields">
            {/* Настройки автопостинга */}
            <section className="form-section">
                <h3 className="form-section-title">Настройки автопостинга</h3>

                <DebouncedInput
                    label="Период в часах *"
                    type="text"
                    inputMode="numeric"
                    value={formData.period_in_hours}
                    onChange={(value) => updateField('period_in_hours', value)}
                    required
                    placeholder="24"
                    debounceDelay={300}
                />

                <DebouncedTextarea
                    label="Промпт фильтра *"
                    value={formData.filter_prompt}
                    onChange={(value) => updateField('filter_prompt', value)}
                    placeholder="Введите промпт для фильтрации контента"
                    required
                    debounceDelay={300}
                />

                <StringListField
                    label="Telegram каналы"
                    value={formData.tg_channels}
                    onChange={(value) => updateField('tg_channels', value)}
                    placeholder="@channel_name"
                    debounceDelay={300}
                />

                <div className="input-wrapper">
                    <label className="input-label">
                        <input
                            type="checkbox"
                            checked={formData.required_moderation}
                            onChange={(e) => updateField('required_moderation', e.target.checked)}
                            style={{marginRight: '8px'}}
                        />
                        Требуется модерация
                    </label>
                </div>

                <div className="input-wrapper">
                    <label className="input-label">
                        <input
                            type="checkbox"
                            checked={formData.need_image}
                            onChange={(e) => updateField('need_image', e.target.checked)}
                            style={{marginRight: '8px'}}
                        />
                        Требуется изображение
                    </label>
                </div>
            </section>

            {/* Основная информация */}
            <section className="form-section">
                <h3 className="form-section-title">Основная информация рубрики</h3>

                <DebouncedInput
                    label="Название рубрики *"
                    type="text"
                    value={formData.name}
                    onChange={(value) => updateField('name', value)}
                    required
                    placeholder="Введите название"
                    debounceDelay={300}
                />

                <DebouncedTextarea
                    label="Цель *"
                    value={formData.goal}
                    onChange={(value) => updateField('goal', value)}
                    placeholder="Введите цель рубрики"
                    required
                    debounceDelay={300}
                />

                <DebouncedTextarea
                    label="Промпт для стиля изображения *"
                    value={formData.prompt_for_image_style}
                    onChange={(value) => updateField('prompt_for_image_style', value)}
                    placeholder="Введите промпт для стиля изображения"
                    required
                    debounceDelay={300}
                />
            </section>

            {/* Структура контента */}
            <section className="form-section">
                <h3 className="form-section-title">Структура контента</h3>

                <StringListField
                    label="Структура скелет *"
                    value={formData.structure_skeleton}
                    onChange={(value) => updateField('structure_skeleton', value)}
                    placeholder="элемент структуры"
                    debounceDelay={300}
                />

                <div className="input-grid-2">
                    <DebouncedInput
                        label="Мин. уровень гибкости *"
                        type="text"
                        inputMode="numeric"
                        value={formData.structure_flex_level_min}
                        onChange={(value) => updateField('structure_flex_level_min', value)}
                        placeholder="0"
                        required
                        debounceDelay={300}
                    />
                    <DebouncedInput
                        label="Макс. уровень гибкости *"
                        type="text"
                        inputMode="numeric"
                        value={formData.structure_flex_level_max}
                        onChange={(value) => updateField('structure_flex_level_max', value)}
                        placeholder="100"
                        required
                        debounceDelay={300}
                    />
                </div>

                <DebouncedTextarea
                    label="Комментарий к уровню гибкости *"
                    value={formData.structure_flex_level_comment}
                    onChange={(value) => updateField('structure_flex_level_comment', value)}
                    placeholder="Комментарий"
                    required
                    debounceDelay={300}
                />
            </section>

            {/* Правила контента */}
            <section className="form-section">
                <h3 className="form-section-title">Правила контента</h3>

                <StringListField
                    label="Обязательные элементы *"
                    value={formData.must_have}
                    onChange={(value) => updateField('must_have', value)}
                    placeholder="обязательный элемент"
                    debounceDelay={300}
                />

                <StringListField
                    label="Запрещённые элементы *"
                    value={formData.must_avoid}
                    onChange={(value) => updateField('must_avoid', value)}
                    placeholder="запрещённый элемент"
                    debounceDelay={300}
                />
            </section>

            {/* Параметры текста */}
            <section className="form-section">
                <h3 className="form-section-title">Параметры текста</h3>

                <div className="input-grid-2">
                    <DebouncedInput
                        label="Мин. длина текста *"
                        type="text"
                        inputMode="numeric"
                        value={formData.len_min}
                        onChange={(value) => updateField('len_min', value)}
                        placeholder="0"
                        required
                        debounceDelay={300}
                    />
                    <DebouncedInput
                        label="Макс. длина текста *"
                        type="text"
                        inputMode="numeric"
                        value={formData.len_max}
                        onChange={(value) => updateField('len_max', value)}
                        placeholder="5000"
                        required
                        debounceDelay={300}
                    />
                </div>

                <div className="input-grid-2">
                    <DebouncedInput
                        label="Мин. количество хэштегов *"
                        type="text"
                        inputMode="numeric"
                        value={formData.n_hashtags_min}
                        onChange={(value) => updateField('n_hashtags_min', value)}
                        placeholder="0"
                        required
                        debounceDelay={300}
                    />
                    <DebouncedInput
                        label="Макс. количество хэштегов *"
                        type="text"
                        inputMode="numeric"
                        value={formData.n_hashtags_max}
                        onChange={(value) => updateField('n_hashtags_max', value)}
                        placeholder="10"
                        required
                        debounceDelay={300}
                    />
                </div>

                <DebouncedInput
                    label="Тип призыва к действию (CTA) *"
                    type="text"
                    value={formData.cta_type}
                    onChange={(value) => updateField('cta_type', value)}
                    placeholder="Например: подписка, покупка, лайк"
                    required
                    debounceDelay={300}
                />

                <DebouncedTextarea
                    label="Правила для соцсетей *"
                    value={formData.social_networks_rules}
                    onChange={(value) => updateField('social_networks_rules', value)}
                    placeholder="Правила публикации в соцсетях"
                    required
                    debounceDelay={300}
                />
            </section>

            {/* Стиль и тон */}
            <section className="form-section">
                <h3 className="form-section-title">Стиль и тон</h3>

                <StringListField
                    label="Тон общения *"
                    value={formData.tone_of_voice}
                    onChange={(value) => updateField('tone_of_voice', value)}
                    placeholder="тон общения"
                    debounceDelay={300}
                />

                <StringListField
                    label="Правила бренда *"
                    value={formData.brand_rules}
                    onChange={(value) => updateField('brand_rules', value)}
                    placeholder="правило бренда"
                    debounceDelay={300}
                />
            </section>

            {/* Примеры */}
            <section className="form-section">
                <h3 className="form-section-title">Хорошие примеры</h3>

                <ObjectListField
                    value={formData.good_samples}
                    onChange={(value) => updateField('good_samples', value)}
                    debounceDelay={300}
                />
            </section>

            {/* Дополнительная информация */}
            <section className="form-section">
                <h3 className="form-section-title">Дополнительная информация</h3>

                <StringListField
                    value={formData.additional_info}
                    onChange={(value) => updateField('additional_info', value)}
                    placeholder="информацию"
                    debounceDelay={300}
                />
            </section>
        </div>
    );
};
