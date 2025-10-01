import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationApi } from '../../shared/api';
import type { Organization, UpdateOrganizationRequest } from '../../shared/types';
import './OrganizationDetailPage.css';

export const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    }
  }, [id]);

  const loadOrganization = async (organizationId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationApi.getById(organizationId);
      setOrganization(response.organization);
      setFormData({
        name: response.organization.name,
        autoposting_moderation: response.organization.autoposting_moderation,
        video_cut_description_end_sample: response.organization.video_cut_description_end_sample || '',
        publication_text_end_sample: response.organization.publication_text_end_sample || '',
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
        organization_id: organization.organization_id,
        name: formData.name,
        autoposting_moderation: formData.autoposting_moderation,
        video_cut_description_end_sample: formData.video_cut_description_end_sample,
        publication_text_end_sample: formData.publication_text_end_sample,
      };

      await organizationApi.update(updateData);
      await loadOrganization(organization.organization_id);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update organization:', err);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsSaving(false);
    }
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
        <h1>Организация #{organization.organization_id}</h1>
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
              <div className="value">{organization.organization_id}</div>
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
              <div className="value balance">{parseFloat(organization.balance_rub).toFixed(2)} ₽</div>
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
      </div>
    </div>
  );
};
