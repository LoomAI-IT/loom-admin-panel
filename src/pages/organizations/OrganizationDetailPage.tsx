import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationApi, categoryApi } from '../../shared/api';
import type { Organization, UpdateOrganizationRequest } from '../../shared/types';
import type { Category } from '../../shared/types/category';
import './OrganizationDetailPage.css';

export const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Состояние для рубрик
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Форма редактирования
  const [formData, setFormData] = useState({
    name: '',
    autoposting_moderation: false,
    video_cut_description_end_sample: '',
    publication_text_end_sample: '',
  });

  useEffect(() => {
    if (id) {
      loadOrganization(parseInt(id));
      loadCategories(parseInt(id));
    }
  }, [id]);

  const loadOrganization = async (organizationId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationApi.getById(organizationId);
      setOrganization(response);
      setFormData({
        name: response.name,
        autoposting_moderation: response.autoposting_moderation,
        video_cut_description_end_sample: response.video_cut_description_end_sample || '',
        publication_text_end_sample: response.publication_text_end_sample || '',
      });
    } catch (err) {
      setError('Ошибка загрузки организации');
      console.error('Failed to load organization:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (organization) {
      setFormData({
        name: organization.name,
        autoposting_moderation: organization.autoposting_moderation,
        video_cut_description_end_sample: organization.video_cut_description_end_sample || '',
        publication_text_end_sample: organization.publication_text_end_sample || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!organization) return;

    try {
      setIsSaving(true);
      const updateData: UpdateOrganizationRequest = {
        organization_id: organization.id,
        name: formData.name,
        autoposting_moderation: formData.autoposting_moderation,
        video_cut_description_end_sample: formData.video_cut_description_end_sample,
        publication_text_end_sample: formData.publication_text_end_sample,
      };

      await organizationApi.update(updateData);
      await loadOrganization(organization.id);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update organization:', err);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsSaving(false);
    }
  };

  const loadCategories = async (organizationId: number) => {
    try {
      setCategoriesLoading(true);
      const data = await categoryApi.getByOrganization(organizationId);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
  };

  if (loading) {
    return <div className="organization-detail-page loading">Загрузка...</div>;
  }

  if (error || !organization) {
    return (
      <div className="organization-detail-page error">
        <p>{error || 'Организация не найдена'}</p>
        <button onClick={() => navigate('/organizations')}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="organization-detail-page">
      <div className="page-header">
        <button onClick={() => navigate('/organizations')} className="back-button">
          ← Назад к списку
        </button>
        <h1>Организация #{organization.id}</h1>
        <div className="actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="btn-primary">
              Редактировать
            </button>
          ) : (
            <>
              <button onClick={handleCancel} className="btn-secondary" disabled={isSaving}>
                Отмена
              </button>
              <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="organization-content">
        <div className="info-section">
          <h2>Основная информация</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ID</label>
              <div className="value">{organization.id}</div>
            </div>

            <div className="info-item">
              <label>Название</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="edit-input"
                />
              ) : (
                <div className="value">{organization.name}</div>
              )}
            </div>

            <div className="info-item">
              <label>Баланс</label>
              <div className="value balance">{parseFloat(organization.rub_balance).toFixed(2)} ₽</div>
            </div>

            <div className="info-item">
              <label>Модерация автопостинга</label>
              {isEditing ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={formData.autoposting_moderation}
                    onChange={(e) =>
                      setFormData({ ...formData, autoposting_moderation: e.target.checked })
                    }
                  />
                  <span className="slider"></span>
                </label>
              ) : (
                <div className={`value status ${organization.autoposting_moderation ? 'enabled' : 'disabled'}`}>
                  {organization.autoposting_moderation ? 'Включена' : 'Выключена'}
                </div>
              )}
            </div>

            <div className="info-item">
              <label>Дата создания</label>
              <div className="value">{new Date(organization.created_at).toLocaleString('ru-RU')}</div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Шаблоны</h2>

          <div className="info-item full-width">
            <label>Окончание описания нарезки видео</label>
            {isEditing ? (
              <textarea
                value={formData.video_cut_description_end_sample}
                onChange={(e) =>
                  setFormData({ ...formData, video_cut_description_end_sample: e.target.value })
                }
                className="edit-textarea"
                rows={4}
                placeholder="Введите текст шаблона..."
              />
            ) : (
              <div className="value text-content">
                {organization.video_cut_description_end_sample || 'Не задано'}
              </div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Окончание текста публикации</label>
            {isEditing ? (
              <textarea
                value={formData.publication_text_end_sample}
                onChange={(e) =>
                  setFormData({ ...formData, publication_text_end_sample: e.target.value })
                }
                className="edit-textarea"
                rows={4}
                placeholder="Введите текст шаблона..."
              />
            ) : (
              <div className="value text-content">
                {organization.publication_text_end_sample || 'Не задано'}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Рубрики</h2>
          {categoriesLoading ? (
            <div className="loading-text">Загрузка рубрик...</div>
          ) : categories.length === 0 ? (
            <div className="empty-text">Рубрик пока нет</div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="category-name">{category.name}</div>
                  <div className="category-id">ID: {category.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCategoryModal && selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          onClose={handleCloseCategoryModal}
          onUpdate={() => {
            if (organization) {
              loadCategories(organization.id);
            }
          }}
        />
      )}
    </div>
  );
};

// Модальное окно для просмотра и редактирования рубрики
interface CategoryModalProps {
  category: Category;
  onClose: () => void;
  onUpdate: () => void;
}

const CategoryModal = ({ category, onClose, onUpdate }: CategoryModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    prompt_for_image_style: category.prompt_for_image_style,
    prompt_for_text_style: category.prompt_for_text_style,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await categoryApi.update(category.id, formData);
      setIsEditing(false);
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: category.name,
      prompt_for_image_style: category.prompt_for_image_style,
      prompt_for_text_style: category.prompt_for_text_style,
    });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Рубрика #{category.id}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="info-item">
            <label>Название</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="edit-input"
              />
            ) : (
              <div className="value">{category.name}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Промпт для стиля изображения</label>
            {isEditing ? (
              <textarea
                value={formData.prompt_for_image_style}
                onChange={(e) =>
                  setFormData({ ...formData, prompt_for_image_style: e.target.value })
                }
                className="edit-textarea"
                rows={6}
              />
            ) : (
              <div className="value text-content">{category.prompt_for_image_style}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Промпт для стиля текста</label>
            {isEditing ? (
              <textarea
                value={formData.prompt_for_text_style}
                onChange={(e) =>
                  setFormData({ ...formData, prompt_for_text_style: e.target.value })
                }
                className="edit-textarea"
                rows={6}
              />
            ) : (
              <div className="value text-content">{category.prompt_for_text_style}</div>
            )}
          </div>

          <div className="info-item">
            <label>Дата создания</label>
            <div className="value">{new Date(category.created_at).toLocaleString('ru-RU')}</div>
          </div>
        </div>

        <div className="modal-footer">
          {!isEditing ? (
            <>
              <button onClick={onClose} className="btn-secondary">
                Закрыть
              </button>
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Редактировать
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCancel} className="btn-secondary" disabled={isSaving}>
                Отмена
              </button>
              <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
