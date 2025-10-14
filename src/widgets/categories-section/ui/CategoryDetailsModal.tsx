import {Modal} from '../../../shared/ui/Modal';
import {Button} from '../../../shared/ui/Button';
import {type Category} from '../../../entities/category';
import {JsonViewModal} from '../../../features/json-import';
import {useModal} from '../../../shared/lib/hooks/useModal';
import './CategoryDetailsModal.css';

interface CategoryDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category;
    organizationId: number;
}

export const CategoryDetailsModal = ({isOpen, onClose, category, organizationId}: CategoryDetailsModalProps) => {
    const jsonViewModal = useModal();

    const renderField = (label: string, value: any, isImportant = false) => {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return null;

            // Специальная обработка для good_samples
            if (typeof value[0] === 'object' && value[0] !== null) {
                return (
                    <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                        <div className="detail-label">{label}</div>
                        <div className="good-samples-container">
                            {value.map((sample, index) => (
                                <div key={index} className="good-sample-card">
                                    <div className="good-sample-header">Пример {index + 1}</div>
                                    <div className="good-sample-content">
                                        {Object.entries(sample).map(([key, val]) => (
                                            <div key={key} className="good-sample-field">
                                                <span className="good-sample-key">{key}:</span>
                                                <span
                                                    className="good-sample-value">{typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            return (
                <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                    <div className="detail-label">{label}</div>
                    <div className="detail-value">
                        <ul className="array-list">
                            {value.map((item, index) => (
                                <li key={index} className="array-item">
                                    {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                <div className="detail-label">{label}</div>
                <div className="detail-value">{value}</div>
            </div>
        );
    };

    const renderSection = (title: string, fields: React.ReactNode[]) => {
        const validFields = fields.filter(field => field !== null);
        if (validFields.length === 0) return null;

        return (
            <div className="detail-section">
                <h3 className="section-title">{title}</h3>
                <div className="section-content">
                    {validFields}
                </div>
            </div>
        );
    };


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Детали рубрики: ${category.name}`}
                   className="category-details-modal">
                <div className="category-details-wrapper">
                    <div className="category-details">
                        {renderSection('Основная информация', [
                            renderField('ID', category.id),
                            renderField('Название', category.name, true),
                            renderField('Цель', category.goal, true),
                            renderField('Дата создания', new Date(category.created_at).toLocaleString('ru-RU')),
                        ])}

                        {renderSection('Структура контента', [
                            renderField('Скелет структуры', category.structure_skeleton),
                            renderField('Минимальный уровень гибкости', category.structure_flex_level_min),
                            renderField('Максимальный уровень гибкости', category.structure_flex_level_max),
                            renderField('Комментарий к гибкости', category.structure_flex_level_comment),
                        ])}

                        {renderSection('Правила контента', [
                            renderField('Обязательные элементы', category.must_have),
                            renderField('Запрещенные элементы', category.must_avoid),
                            renderField('Правила соцсетей', category.social_networks_rules),
                        ])}

                        {renderSection('Параметры текста', [
                            renderField('Минимальная длина', category.len_min),
                            renderField('Максимальная длина', category.len_max),
                            renderField('Мин. количество хештегов', category.n_hashtags_min),
                            renderField('Макс. количество хештегов', category.n_hashtags_max),
                            renderField('Тип призыва к действию', category.cta_type),
                        ])}

                        {renderSection('Стиль и тон', [
                            renderField('Тон голоса', category.tone_of_voice),
                            renderField('Правила бренда', category.brand_rules),
                            renderField('Промпт для стиля изображения', category.prompt_for_image_style),
                        ])}

                        {renderSection('Примеры и дополнения', [
                            renderField('Хорошие примеры', category.good_samples, true),
                            renderField('Дополнительная информация', category.additional_info),
                        ])}
                    </div>

                    <div className="details-actions">
                        <Button variant="secondary" onClick={jsonViewModal.open}>
                            Просмотр JSON
                        </Button>
                        <Button onClick={onClose}>
                            Закрыть
                        </Button>
                    </div>
                </div>
            </Modal>

            <JsonViewModal
                isOpen={jsonViewModal.isOpen}
                onClose={jsonViewModal.close}
                data={category}
                organizationId={organizationId}
                zIndex={1100}
            />
        </>
    );
};
