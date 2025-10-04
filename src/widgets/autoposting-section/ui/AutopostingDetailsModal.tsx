import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { type Autoposting, type AutopostingCategory } from '../../../entities/autoposting';
import { JsonViewModal } from '../../../features/json-import';
import { useModal } from '../../../shared/lib/hooks/useModal';
import '../../../widgets/categories-section/ui/CategoryDetailsModal.css';

interface AutopostingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoposting: Autoposting;
  autopostingCategory: AutopostingCategory | null;
  organizationId: number;
}

export const AutopostingDetailsModal = ({
  isOpen,
  onClose,
  autoposting,
  autopostingCategory,
  organizationId
}: AutopostingDetailsModalProps) => {
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
                        <span className="good-sample-value">{typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}</span>
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

    if (typeof value === 'boolean') {
      return (
        <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
          <div className="detail-label">{label}</div>
          <div className="detail-value">{value ? 'Да' : 'Нет'}</div>
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

  const combinedData = {
    autoposting,
    category: autopostingCategory,
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Детали автопостинга: ${autopostingCategory?.name || 'Загрузка...'}`}
        className="category-details-modal"
      >
        <div className="category-details-wrapper">
          <div className="category-details">
            {renderSection('Настройки автопостинга', [
              renderField('ID автопостинга', autoposting.id),
              renderField('Период в часах', autoposting.period_in_hours, true),
              renderField('Промпт фильтра', autoposting.filter_prompt, true),
              renderField('Telegram каналы', autoposting.tg_channels),
              renderField('Включён', autoposting.enabled, true),
              renderField('Требуется модерация', autoposting.required_moderation),
              renderField('Требуется изображение', autoposting.need_image),
              renderField('Дата создания', new Date(autoposting.created_at).toLocaleString('ru-RU')),
            ])}

            {autopostingCategory && (
              <>
                {renderSection('Основная информация рубрики', [
                  renderField('ID рубрики', autopostingCategory.id),
                  renderField('Название', autopostingCategory.name, true),
                  renderField('Цель', autopostingCategory.goal, true),
                  renderField('Дата создания рубрики', new Date(autopostingCategory.created_at).toLocaleString('ru-RU')),
                ])}

                {renderSection('Структура контента', [
                  renderField('Скелет структуры', autopostingCategory.structure_skeleton),
                  renderField('Минимальный уровень гибкости', autopostingCategory.structure_flex_level_min),
                  renderField('Максимальный уровень гибкости', autopostingCategory.structure_flex_level_max),
                  renderField('Комментарий к гибкости', autopostingCategory.structure_flex_level_comment),
                ])}

                {renderSection('Правила контента', [
                  renderField('Обязательные элементы', autopostingCategory.must_have),
                  renderField('Запрещенные элементы', autopostingCategory.must_avoid),
                  renderField('Правила соцсетей', autopostingCategory.social_networks_rules),
                ])}

                {renderSection('Параметры текста', [
                  renderField('Минимальная длина', autopostingCategory.len_min),
                  renderField('Максимальная длина', autopostingCategory.len_max),
                  renderField('Мин. количество хештегов', autopostingCategory.n_hashtags_min),
                  renderField('Макс. количество хештегов', autopostingCategory.n_hashtags_max),
                  renderField('Тип призыва к действию', autopostingCategory.cta_type),
                ])}

                {renderSection('Стиль и тон', [
                  renderField('Тон голоса', autopostingCategory.tone_of_voice),
                  renderField('Правила бренда', autopostingCategory.brand_rules),
                  renderField('Промпт для стиля изображения', autopostingCategory.prompt_for_image_style),
                ])}

                {renderSection('Примеры и дополнения', [
                  renderField('Хорошие примеры', autopostingCategory.good_samples, true),
                  renderField('Дополнительная информация', autopostingCategory.additional_info),
                ])}
              </>
            )}
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
        data={combinedData}
        organizationId={organizationId}
        zIndex={1100}
      />
    </>
  );
};
