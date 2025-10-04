import { useState, useEffect } from 'react';
import {
  autopostingApi,
  autopostingCategoryApi,
  type Autoposting,
  type AutopostingCategory,
  type CreateAutopostingCategoryRequest,
  type CreateAutopostingRequest,
  type UpdateAutopostingCategoryRequest,
  type UpdateAutopostingRequest,
} from '../../../entities/autoposting';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { useModal } from '../../../shared/lib/hooks/useModal';
import { JsonImportModal, loadJsonFromFile } from '../../../features/json-import';
import { AutopostingFormFields, type AutopostingFormData } from './AutopostingFormFields';
import { AutopostingDetailsModal } from './AutopostingDetailsModal';
import '../../../widgets/categories-section/ui/CategoriesSection.css';

interface AutopostingSectionProps {
  organizationId: number;
}

export const AutopostingSection = ({ organizationId }: AutopostingSectionProps) => {
  const [autopostings, setAutopostings] = useState<Autoposting[]>([]);
  const [autopostingCategories, setAutopostingCategories] = useState<Map<number, AutopostingCategory>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingAutoposting, setEditingAutoposting] = useState<Autoposting | null>(null);
  const [editingCategory, setEditingCategory] = useState<AutopostingCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const addModal = useModal();
  const editModal = useModal();
  const jsonImportModal = useModal();
  const editJsonImportModal = useModal();
  const detailsModal = useModal();

  const [formData, setFormData] = useState<AutopostingFormData>({
    name: '',
    goal: '',
    prompt_for_image_style: '',
    structure_skeleton: [],
    structure_flex_level_min: '',
    structure_flex_level_max: '',
    structure_flex_level_comment: '',
    must_have: [],
    must_avoid: [],
    social_networks_rules: '',
    len_min: '',
    len_max: '',
    n_hashtags_min: '',
    n_hashtags_max: '',
    cta_type: '',
    tone_of_voice: [],
    brand_rules: [],
    good_samples: [],
    additional_info: [],
    period_in_hours: '',
    filter_prompt: '',
    tg_channels: [],
    required_moderation: false,
  });

  const [editFormData, setEditFormData] = useState<AutopostingFormData>({
    name: '',
    goal: '',
    prompt_for_image_style: '',
    structure_skeleton: [],
    structure_flex_level_min: '',
    structure_flex_level_max: '',
    structure_flex_level_comment: '',
    must_have: [],
    must_avoid: [],
    social_networks_rules: '',
    len_min: '',
    len_max: '',
    n_hashtags_min: '',
    n_hashtags_max: '',
    cta_type: '',
    tone_of_voice: [],
    brand_rules: [],
    good_samples: [],
    additional_info: [],
    period_in_hours: '',
    filter_prompt: '',
    tg_channels: [],
    required_moderation: false,
  });

  useEffect(() => {
    loadAutopostings();
  }, [organizationId]);

  const loadAutopostings = async () => {
    try {
      setLoading(true);
      const data = await autopostingApi.getByOrganization(organizationId);
      setAutopostings(data);

      // Загружаем категории для каждого автопостинга
      const categoryMap = new Map<number, AutopostingCategory>();
      for (const autoposting of data) {
        try {
          const category = await autopostingCategoryApi.getById(autoposting.autoposting_category_id);
          categoryMap.set(autoposting.autoposting_category_id, category);
        } catch (err) {
          console.error(`Failed to load category ${autoposting.autoposting_category_id}:`, err);
        }
      }
      setAutopostingCategories(categoryMap);
    } catch (err) {
      console.error('Failed to load autopostings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (autoposting: Autoposting) => {
    setError(null);
    setEditingAutoposting(autoposting);

    // Загружаем категорию
    try {
      const category = await autopostingCategoryApi.getById(autoposting.autoposting_category_id);
      setEditingCategory(category);

      setEditFormData({
        name: category.name,
        goal: category.goal || '',
        prompt_for_image_style: category.prompt_for_image_style || '',
        structure_skeleton: category.structure_skeleton || [],
        structure_flex_level_min: category.structure_flex_level_min?.toString() || '',
        structure_flex_level_max: category.structure_flex_level_max?.toString() || '',
        structure_flex_level_comment: category.structure_flex_level_comment || '',
        must_have: category.must_have || [],
        must_avoid: category.must_avoid || [],
        social_networks_rules: category.social_networks_rules || '',
        len_min: category.len_min?.toString() || '',
        len_max: category.len_max?.toString() || '',
        n_hashtags_min: category.n_hashtags_min?.toString() || '',
        n_hashtags_max: category.n_hashtags_max?.toString() || '',
        cta_type: category.cta_type || '',
        tone_of_voice: category.tone_of_voice || [],
        brand_rules: category.brand_rules || [],
        good_samples: category.good_samples || [],
        additional_info: category.additional_info || [],
        period_in_hours: autoposting.period_in_hours?.toString() || '',
        filter_prompt: autoposting.filter_prompt || '',
        tg_channels: autoposting.tg_channels || [],
        required_moderation: autoposting.required_moderation || false,
      });
      editModal.open();
    } catch (err) {
      console.error('Failed to load category for editing:', err);
      setError('Ошибка при загрузке данных категории');
    }
  };

  const handleOpenAddModal = () => {
    setError(null);
    addModal.open();
  };

  const handleJsonImport = (jsonData: any) => {
    setFormData({
      name: jsonData.name || '',
      goal: jsonData.goal || '',
      prompt_for_image_style: jsonData.prompt_for_image_style || '',
      structure_skeleton: jsonData.structure_skeleton || [],
      structure_flex_level_min: jsonData.structure_flex_level_min?.toString() || '',
      structure_flex_level_max: jsonData.structure_flex_level_max?.toString() || '',
      structure_flex_level_comment: jsonData.structure_flex_level_comment || '',
      must_have: jsonData.must_have || [],
      must_avoid: jsonData.must_avoid || [],
      social_networks_rules: jsonData.social_networks_rules || '',
      len_min: jsonData.len_min?.toString() || '',
      len_max: jsonData.len_max?.toString() || '',
      n_hashtags_min: jsonData.n_hashtags_min?.toString() || '',
      n_hashtags_max: jsonData.n_hashtags_max?.toString() || '',
      cta_type: jsonData.cta_type || '',
      tone_of_voice: jsonData.tone_of_voice || [],
      brand_rules: jsonData.brand_rules || [],
      good_samples: jsonData.good_samples || [],
      additional_info: jsonData.additional_info || [],
      period_in_hours: jsonData.period_in_hours?.toString() || '',
      filter_prompt: jsonData.filter_prompt || '',
      tg_channels: jsonData.tg_channels || [],
      required_moderation: jsonData.required_moderation || false,
    });
  };

  const handleEditJsonImport = (jsonData: any) => {
    setEditFormData({
      name: jsonData.name || '',
      goal: jsonData.goal || '',
      prompt_for_image_style: jsonData.prompt_for_image_style || '',
      structure_skeleton: jsonData.structure_skeleton || [],
      structure_flex_level_min: jsonData.structure_flex_level_min?.toString() || '',
      structure_flex_level_max: jsonData.structure_flex_level_max?.toString() || '',
      structure_flex_level_comment: jsonData.structure_flex_level_comment || '',
      must_have: jsonData.must_have || [],
      must_avoid: jsonData.must_avoid || [],
      social_networks_rules: jsonData.social_networks_rules || '',
      len_min: jsonData.len_min?.toString() || '',
      len_max: jsonData.len_max?.toString() || '',
      n_hashtags_min: jsonData.n_hashtags_min?.toString() || '',
      n_hashtags_max: jsonData.n_hashtags_max?.toString() || '',
      cta_type: jsonData.cta_type || '',
      tone_of_voice: jsonData.tone_of_voice || [],
      brand_rules: jsonData.brand_rules || [],
      good_samples: jsonData.good_samples || [],
      additional_info: jsonData.additional_info || [],
      period_in_hours: jsonData.period_in_hours?.toString() || '',
      filter_prompt: jsonData.filter_prompt || '',
      tg_channels: jsonData.tg_channels || [],
      required_moderation: jsonData.required_moderation || false,
    });
  };

  const handleLoadJsonFile = async () => {
    try {
      const jsonData = await loadJsonFromFile();
      handleJsonImport(jsonData);
      alert('Настройки успешно загружены из JSON');
    } catch (err) {
      alert('Ошибка при загрузке JSON файла');
    }
  };

  const handleLoadEditJsonFile = async () => {
    try {
      const jsonData = await loadJsonFromFile();
      handleEditJsonImport(jsonData);
      alert('Настройки успешно загружены из JSON');
    } catch (err) {
      alert('Ошибка при загрузке JSON файла');
    }
  };

  const validateForm = (data: AutopostingFormData): boolean => {
    if (!data.name.trim()) {
      setError('Название рубрики обязательно для заполнения');
      return false;
    }
    if (!data.period_in_hours || parseInt(data.period_in_hours) < 1) {
      setError('Период в часах должен быть не менее 1');
      return false;
    }
    if (!data.filter_prompt.trim()) {
      setError('Промпт фильтра обязателен для заполнения');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm(formData)) {
      return;
    }

    try {
      setSubmitting(true);

      // Создаём категорию автопостинга
      const categoryRequest: CreateAutopostingCategoryRequest = {
        organization_id: organizationId,
        name: formData.name,
        prompt_for_image_style: formData.prompt_for_image_style,
        goal: formData.goal,
        structure_skeleton: formData.structure_skeleton.filter(item => item.trim() !== ''),
        structure_flex_level_min: parseInt(formData.structure_flex_level_min),
        structure_flex_level_max: parseInt(formData.structure_flex_level_max),
        structure_flex_level_comment: formData.structure_flex_level_comment,
        must_have: formData.must_have.filter(item => item.trim() !== ''),
        must_avoid: formData.must_avoid.filter(item => item.trim() !== ''),
        social_networks_rules: formData.social_networks_rules,
        len_min: parseInt(formData.len_min),
        len_max: parseInt(formData.len_max),
        n_hashtags_min: parseInt(formData.n_hashtags_min),
        n_hashtags_max: parseInt(formData.n_hashtags_max),
        cta_type: formData.cta_type,
        tone_of_voice: formData.tone_of_voice.filter(item => item.trim() !== ''),
        brand_rules: formData.brand_rules.filter(item => item.trim() !== ''),
        good_samples: formData.good_samples.filter(item => Object.keys(item).length > 0),
        additional_info: formData.additional_info.filter(item => item.trim() !== ''),
      };

      const categoryResponse = await autopostingCategoryApi.create(categoryRequest);

      if (!categoryResponse.autoposting_category_id) {
        throw new Error('Failed to create autoposting category');
      }

      // Создаём автопостинг
      const autopostingRequest: CreateAutopostingRequest = {
        organization_id: organizationId,
        autoposting_category_id: categoryResponse.autoposting_category_id,
        period_in_hours: parseInt(formData.period_in_hours),
        filter_prompt: formData.filter_prompt,
        tg_channels: formData.tg_channels.filter(item => item.trim() !== '').length > 0
          ? formData.tg_channels.filter(item => item.trim() !== '')
          : null,
        required_moderation: formData.required_moderation,
      };

      await autopostingApi.create(autopostingRequest);

      // Reset form and close modal
      setFormData({
        name: '',
        goal: '',
        prompt_for_image_style: '',
        structure_skeleton: [],
        structure_flex_level_min: '',
        structure_flex_level_max: '',
        structure_flex_level_comment: '',
        must_have: [],
        must_avoid: [],
        social_networks_rules: '',
        len_min: '',
        len_max: '',
        n_hashtags_min: '',
        n_hashtags_max: '',
        cta_type: '',
        tone_of_voice: [],
        brand_rules: [],
        good_samples: [],
        additional_info: [],
        period_in_hours: '',
        filter_prompt: '',
        tg_channels: [],
        required_moderation: false,
      });
      addModal.close();
      setSuccess('Автопостинг успешно создан');
      setTimeout(() => setSuccess(null), 3000);

      // Reload autopostings
      await loadAutopostings();
    } catch (err) {
      console.error('Failed to create autoposting:', err);
      setError('Ошибка при создании автопостинга. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!editingAutoposting || !editingCategory) return;

    if (!validateForm(editFormData)) {
      return;
    }

    try {
      setSubmitting(true);

      // Обновляем категорию
      const categoryRequest: UpdateAutopostingCategoryRequest = {
        name: editFormData.name,
        prompt_for_image_style: editFormData.prompt_for_image_style,
        goal: editFormData.goal,
        structure_skeleton: editFormData.structure_skeleton.filter(item => item.trim() !== ''),
        structure_flex_level_min: parseInt(editFormData.structure_flex_level_min),
        structure_flex_level_max: parseInt(editFormData.structure_flex_level_max),
        structure_flex_level_comment: editFormData.structure_flex_level_comment,
        must_have: editFormData.must_have.filter(item => item.trim() !== ''),
        must_avoid: editFormData.must_avoid.filter(item => item.trim() !== ''),
        social_networks_rules: editFormData.social_networks_rules,
        len_min: parseInt(editFormData.len_min),
        len_max: parseInt(editFormData.len_max),
        n_hashtags_min: parseInt(editFormData.n_hashtags_min),
        n_hashtags_max: parseInt(editFormData.n_hashtags_max),
        cta_type: editFormData.cta_type,
        tone_of_voice: editFormData.tone_of_voice.filter(item => item.trim() !== ''),
        brand_rules: editFormData.brand_rules.filter(item => item.trim() !== ''),
        good_samples: editFormData.good_samples.filter(item => Object.keys(item).length > 0),
        additional_info: editFormData.additional_info.filter(item => item.trim() !== ''),
      };

      await autopostingCategoryApi.update(editingCategory.id, categoryRequest);

      // Обновляем автопостинг
      const autopostingRequest: UpdateAutopostingRequest = {
        period_in_hours: parseInt(editFormData.period_in_hours),
        filter_prompt: editFormData.filter_prompt,
        tg_channels: editFormData.tg_channels.filter(item => item.trim() !== '').length > 0
          ? editFormData.tg_channels.filter(item => item.trim() !== '')
          : null,
        required_moderation: editFormData.required_moderation,
      };

      await autopostingApi.update(editingAutoposting.id, autopostingRequest);

      editModal.close();
      setEditingAutoposting(null);
      setEditingCategory(null);
      setSuccess('Автопостинг успешно обновлён');
      setTimeout(() => setSuccess(null), 3000);

      // Reload autopostings
      await loadAutopostings();
    } catch (err) {
      console.error('Failed to update autoposting:', err);
      setError('Ошибка при обновлении автопостинга. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (autoposting: Autoposting) => {
    const category = autopostingCategories.get(autoposting.autoposting_category_id);
    const categoryName = category?.name || 'Unknown';

    if (!confirm(`Вы уверены, что хотите удалить автопостинг "${categoryName}"?`)) {
      return;
    }

    try {
      await autopostingApi.delete(autoposting.id);
      // Удаляем также категорию
      await autopostingCategoryApi.delete(autoposting.autoposting_category_id);
      await loadAutopostings();
    } catch (err) {
      console.error('Failed to delete autoposting:', err);
      alert('Ошибка при удалении автопостинга');
    }
  };

  const handleToggleEnabled = async (autoposting: Autoposting) => {
    setTogglingId(autoposting.id);
    try {
      await autopostingApi.update(autoposting.id, {
        enabled: !autoposting.enabled,
      });

      // Обновляем локальное состояние без перезагрузки
      setAutopostings(prevAutopostings =>
        prevAutopostings.map(ap =>
          ap.id === autoposting.id
            ? { ...ap, enabled: !ap.enabled }
            : ap
        )
      );
    } catch (err) {
      console.error('Failed to toggle autoposting:', err);
      alert('Ошибка при изменении статуса автопостинга');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return <div className="categories-section loading">Загрузка автопостингов...</div>;
  }

  return (
    <>
      <div className="categories-section">
        <div className="section-header">
          <h2>Автопостинг</h2>
          <Button size="small" onClick={handleOpenAddModal}>Добавить автопостинг</Button>
        </div>

        {success && (
          <div className="notification notification-success">
            <span className="notification-icon">✓</span>
            {success}
          </div>
        )}

        {error && (
          <div className="notification notification-error">
            <span className="notification-icon">⚠</span>
            {error}
          </div>
        )}

        {autopostings.length === 0 ? (
          <div className="empty-state">Автопостинги не найдены</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>Название</TableCell>
                <TableCell header>Период (ч)</TableCell>
                <TableCell header>Статус</TableCell>
                <TableCell header>Дата создания</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autopostings.map((autoposting) => {
                const category = autopostingCategories.get(autoposting.autoposting_category_id);
                return (
                  <TableRow key={autoposting.id}>
                    <TableCell>{autoposting.id}</TableCell>
                    <TableCell className="table-cell-name">
                      <span className="category-name">{category?.name || 'Загрузка...'}</span>
                    </TableCell>
                    <TableCell>{autoposting.period_in_hours}</TableCell>
                    <TableCell>
                      <span style={{ color: autoposting.enabled ? 'green' : 'red' }}>
                        {autoposting.enabled ? 'Включён' : 'Выключен'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="category-date">
                        {new Date(autoposting.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </TableCell>
                    <TableCell className="table-cell-action">
                      <Button size="small" variant="secondary" onClick={() => {
                        setEditingAutoposting(autoposting);
                        setEditingCategory(category || null);
                        detailsModal.open();
                      }}>
                        Детали
                      </Button>
                    </TableCell>
                    <TableCell className="table-cell-action">
                      <Button size="small" onClick={() => handleEdit(autoposting)}>
                        Редактировать
                      </Button>
                    </TableCell>
                    <TableCell className="table-cell-action">
                      <Button
                        size="small"
                        variant={autoposting.enabled ? 'danger' : 'secondary'}
                        onClick={() => handleToggleEnabled(autoposting)}
                        disabled={togglingId === autoposting.id}
                      >
                        {togglingId === autoposting.id
                          ? '...'
                          : autoposting.enabled ? 'Отключить' : 'Включить'}
                      </Button>
                    </TableCell>
                    <TableCell className="table-cell-action">
                      <Button size="small" variant="danger" onClick={() => handleDelete(autoposting)}>
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить автопостинг" className="category-modal">
        <div className="modal-toolbar">
          <Button variant="secondary" onClick={jsonImportModal.open} disabled={submitting} size="small">
            Вставить JSON
          </Button>
          <Button variant="secondary" onClick={handleLoadJsonFile} disabled={submitting} size="small">
            Загрузить JSON
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-content">
            <AutopostingFormFields formData={formData} onChange={setFormData} />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={addModal.close} disabled={submitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>

      <JsonImportModal
        isOpen={jsonImportModal.isOpen}
        onClose={jsonImportModal.close}
        onImport={handleJsonImport}
      />

      <JsonImportModal
        isOpen={editJsonImportModal.isOpen}
        onClose={editJsonImportModal.close}
        onImport={handleEditJsonImport}
        zIndex={1100}
      />

      {editingAutoposting && editingCategory && (
        <AutopostingDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={detailsModal.close}
          autoposting={editingAutoposting}
          autopostingCategory={editingCategory}
          organizationId={organizationId}
        />
      )}

      {editingAutoposting && editingCategory && (
        <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Редактировать автопостинг" className="category-modal">
          <div className="modal-toolbar">
            <Button variant="secondary" onClick={() => {
              detailsModal.open();
            }} disabled={submitting} size="small">
              Детали
            </Button>
            <Button variant="secondary" onClick={editJsonImportModal.open} disabled={submitting} size="small">
              Вставить JSON
            </Button>
            <Button variant="secondary" onClick={handleLoadEditJsonFile} disabled={submitting} size="small">
              Загрузить JSON
            </Button>
          </div>
          <form onSubmit={handleEditSubmit} className="category-form">
            <div className="form-content">
              <AutopostingFormFields formData={editFormData} onChange={setEditFormData} />
            </div>

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={editModal.close} disabled={submitting}>
                Отмена
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
