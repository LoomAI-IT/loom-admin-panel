import { useState, useEffect } from 'react';
import { categoryApi, type Category, type CreateCategoryRequest, type UpdateCategoryRequest } from '../../../entities/category';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { useModal } from '../../../shared/lib/hooks/useModal';
import { JsonImportModal, JsonViewModal, loadJsonFromFile } from '../../../features/json-import';
import { CategoryFormFields } from './CategoryFormFields';
import { CategoryDetailsModal } from './CategoryDetailsModal';
import './CategoriesSection.css';

interface CategoriesSectionProps {
  organizationId: number;
}

export const CategoriesSection = ({ organizationId }: CategoriesSectionProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const addModal = useModal();
  const editModal = useModal();
  const jsonImportModal = useModal();
  const editJsonImportModal = useModal();
  const detailsModal = useModal();

  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    prompt_for_image_style: '',
    structure_skeleton: [] as string[],
    structure_flex_level_min: '',
    structure_flex_level_max: '',
    structure_flex_level_comment: '',
    must_have: [] as string[],
    must_avoid: [] as string[],
    social_networks_rules: '',
    len_min: '',
    len_max: '',
    n_hashtags_min: '',
    n_hashtags_max: '',
    cta_type: '',
    tone_of_voice: [] as string[],
    brand_rules: [] as string[],
    good_samples: [] as Record<string, any>[],
    additional_info: [] as string[],
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    goal: '',
    prompt_for_image_style: '',
    structure_skeleton: [] as string[],
    structure_flex_level_min: '',
    structure_flex_level_max: '',
    structure_flex_level_comment: '',
    must_have: [] as string[],
    must_avoid: [] as string[],
    social_networks_rules: '',
    len_min: '',
    len_max: '',
    n_hashtags_min: '',
    n_hashtags_max: '',
    cta_type: '',
    tone_of_voice: [] as string[],
    brand_rules: [] as string[],
    good_samples: [] as Record<string, any>[],
    additional_info: [] as string[],
  });

  useEffect(() => {
    loadCategories();
  }, [organizationId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getByOrganization(organizationId);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setError(null);
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
    });
    editModal.open();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Название рубрики обязательно для заполнения');
      return;
    }

    try {
      setSubmitting(true);

      const request: CreateCategoryRequest = {
        organization_id: organizationId,
        name: formData.name,
        goal: formData.goal || undefined,
        prompt_for_image_style: formData.prompt_for_image_style || undefined,
        structure_skeleton: formData.structure_skeleton.length > 0 ? formData.structure_skeleton : undefined,
        structure_flex_level_min: formData.structure_flex_level_min ? parseInt(formData.structure_flex_level_min) : undefined,
        structure_flex_level_max: formData.structure_flex_level_max ? parseInt(formData.structure_flex_level_max) : undefined,
        structure_flex_level_comment: formData.structure_flex_level_comment || undefined,
        must_have: formData.must_have.length > 0 ? formData.must_have : undefined,
        must_avoid: formData.must_avoid.length > 0 ? formData.must_avoid : undefined,
        social_networks_rules: formData.social_networks_rules || undefined,
        len_min: formData.len_min ? parseInt(formData.len_min) : undefined,
        len_max: formData.len_max ? parseInt(formData.len_max) : undefined,
        n_hashtags_min: formData.n_hashtags_min ? parseInt(formData.n_hashtags_min) : undefined,
        n_hashtags_max: formData.n_hashtags_max ? parseInt(formData.n_hashtags_max) : undefined,
        cta_type: formData.cta_type || undefined,
        tone_of_voice: formData.tone_of_voice.length > 0 ? formData.tone_of_voice : undefined,
        brand_rules: formData.brand_rules.length > 0 ? formData.brand_rules : undefined,
        good_samples: formData.good_samples.length > 0 ? formData.good_samples : undefined,
        additional_info: formData.additional_info.length > 0 ? formData.additional_info : undefined,
      };

      await categoryApi.create(request);

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
      });
      addModal.close();
      setSuccess('Рубрика успешно создана');
      setTimeout(() => setSuccess(null), 3000);

      // Reload categories
      await loadCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('Ошибка при создании рубрики. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!editingCategory) return;

    if (!editFormData.name.trim()) {
      setError('Название рубрики обязательно для заполнения');
      return;
    }

    try {
      setSubmitting(true);

      const request: UpdateCategoryRequest = {
        name: editFormData.name,
        goal: editFormData.goal || undefined,
        prompt_for_image_style: editFormData.prompt_for_image_style || undefined,
        structure_skeleton: editFormData.structure_skeleton,
        structure_flex_level_min: editFormData.structure_flex_level_min ? parseInt(editFormData.structure_flex_level_min) : undefined,
        structure_flex_level_max: editFormData.structure_flex_level_max ? parseInt(editFormData.structure_flex_level_max) : undefined,
        structure_flex_level_comment: editFormData.structure_flex_level_comment || undefined,
        must_have: editFormData.must_have,
        must_avoid: editFormData.must_avoid,
        social_networks_rules: editFormData.social_networks_rules || undefined,
        len_min: editFormData.len_min ? parseInt(editFormData.len_min) : undefined,
        len_max: editFormData.len_max ? parseInt(editFormData.len_max) : undefined,
        n_hashtags_min: editFormData.n_hashtags_min ? parseInt(editFormData.n_hashtags_min) : undefined,
        n_hashtags_max: editFormData.n_hashtags_max ? parseInt(editFormData.n_hashtags_max) : undefined,
        cta_type: editFormData.cta_type || undefined,
        tone_of_voice: editFormData.tone_of_voice,
        brand_rules: editFormData.brand_rules,
        good_samples: editFormData.good_samples,
        additional_info: editFormData.additional_info,
      };

      await categoryApi.update(editingCategory.id, request);

      editModal.close();
      setEditingCategory(null);
      setSuccess('Рубрика успешно обновлена');
      setTimeout(() => setSuccess(null), 3000);

      // Reload categories
      await loadCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Ошибка при обновлении рубрики. Попробуйте ещё раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Вы уверены, что хотите удалить рубрику "${category.name}"?`)) {
      return;
    }

    try {
      await categoryApi.delete(category.id);
      await loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Ошибка при удалении рубрики');
    }
  };

  if (loading) {
    return <div className="categories-section loading">Загрузка рубрик...</div>;
  }

  return (
    <>
      <div className="categories-section">
        <div className="section-header">
          <h2>Рубрики</h2>
          <Button size="small" onClick={handleOpenAddModal}>Добавить рубрику</Button>
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

        {categories.length === 0 ? (
          <div className="empty-state">Рубрики не найдены</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>Название</TableCell>
                <TableCell header>Дата создания</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
                <TableCell header className="table-cell-action">{''}</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="table-cell-name">
                    <span className="category-name">{category.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="category-date">
                      {new Date(category.created_at).toLocaleString('ru-RU')}
                    </span>
                  </TableCell>
                  <TableCell className="table-cell-action">
                    <Button size="small" variant="secondary" onClick={() => {
                      setEditingCategory(category);
                      detailsModal.open();
                    }}>
                      Детали
                    </Button>
                  </TableCell>
                  <TableCell className="table-cell-action">
                    <Button size="small" onClick={() => handleEdit(category)}>
                      Редактировать
                    </Button>
                  </TableCell>
                  <TableCell className="table-cell-action">
                    <Button size="small" variant="danger" onClick={() => handleDelete(category)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить рубрику" className="category-modal">
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
            <CategoryFormFields formData={formData} onChange={setFormData} />
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

      {editingCategory && (
        <CategoryDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={detailsModal.close}
          category={editingCategory}
          organizationId={organizationId}
        />
      )}

      {editingCategory && (
        <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Редактировать рубрику" className="category-modal">
          <div className="modal-toolbar">
            <Button variant="secondary" onClick={() => {
              setEditingCategory(editingCategory);
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
              <CategoryFormFields formData={editFormData} onChange={setEditFormData} />
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
