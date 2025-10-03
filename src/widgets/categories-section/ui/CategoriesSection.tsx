import { useState, useEffect } from 'react';
import { categoryApi, type Category, type CreateCategoryRequest } from '../../../entities/category';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { Input } from '../../../shared/ui/Input';
import { Textarea } from '../../../shared/ui/Textarea';
import { useModal } from '../../../shared/lib/hooks/useModal';
import './CategoriesSection.css';

interface CategoriesSectionProps {
  organizationId: number;
}

export const CategoriesSection = ({ organizationId }: CategoriesSectionProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const addModal = useModal();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Reload categories
      await loadCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      alert('Ошибка при создании рубрики');
    } finally {
      setSubmitting(false);
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
          <Button size="small" onClick={addModal.open}>Добавить рубрику</Button>
        </div>

        {categories.length === 0 ? (
          <div className="empty-state">Рубрики не найдены</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>Название</TableCell>
                <TableCell header>Цель</TableCell>
                <TableCell header>Дата создания</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.goal || 'Не указана'}</TableCell>
                  <TableCell>{new Date(category.created_at).toLocaleString('ru-RU')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить рубрику">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
          <Input
            label="Название рубрики *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Введите название"
          />

          <div className="input-wrapper">
            <label className="input-label">Цель</label>
            <textarea
              className="input"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Введите цель рубрики"
              rows={2}
            />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Промпт для стиля изображения</label>
            <textarea
              className="input"
              value={formData.prompt_for_image_style}
              onChange={(e) => setFormData({ ...formData, prompt_for_image_style: e.target.value })}
              placeholder="Введите промпт для стиля изображения"
              rows={2}
            />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Структура скелет</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.structure_skeleton.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.structure_skeleton];
                      newItems[idx] = e.target.value;
                      setFormData({ ...formData, structure_skeleton: newItems });
                    }}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        structure_skeleton: formData.structure_skeleton.filter((_, i) => i !== idx),
                      });
                    }}
                    style={{ fontSize: '24px', lineHeight: 1, padding: '4px 12px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, structure_skeleton: [...formData.structure_skeleton, ''] })}
              >
                + Добавить
              </Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Input
              label="Мин. уровень гибкости структуры"
              type="number"
              value={formData.structure_flex_level_min}
              onChange={(e) => setFormData({ ...formData, structure_flex_level_min: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Макс. уровень гибкости структуры"
              type="number"
              value={formData.structure_flex_level_max}
              onChange={(e) => setFormData({ ...formData, structure_flex_level_max: e.target.value })}
              placeholder="100"
            />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Комментарий к уровню гибкости</label>
            <textarea
              className="input"
              value={formData.structure_flex_level_comment}
              onChange={(e) => setFormData({ ...formData, structure_flex_level_comment: e.target.value })}
              placeholder="Комментарий"
              rows={2}
            />
          </div>

          <div className="input-wrapper">
            <label className="input-label">Обязательные элементы</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.must_have.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.must_have];
                      newItems[idx] = e.target.value;
                      setFormData({ ...formData, must_have: newItems });
                    }}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        must_have: formData.must_have.filter((_, i) => i !== idx),
                      });
                    }}
                    style={{ fontSize: '24px', lineHeight: 1, padding: '4px 12px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, must_have: [...formData.must_have, ''] })}
              >
                + Добавить
              </Button>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Запрещённые элементы</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.must_avoid.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.must_avoid];
                      newItems[idx] = e.target.value;
                      setFormData({ ...formData, must_avoid: newItems });
                    }}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        must_avoid: formData.must_avoid.filter((_, i) => i !== idx),
                      });
                    }}
                    style={{ fontSize: '24px', lineHeight: 1, padding: '4px 12px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, must_avoid: [...formData.must_avoid, ''] })}
              >
                + Добавить
              </Button>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Правила для соцсетей</label>
            <textarea
              className="input"
              value={formData.social_networks_rules}
              onChange={(e) => setFormData({ ...formData, social_networks_rules: e.target.value })}
              placeholder="Правила публикации в соцсетях"
              rows={2}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Input
              label="Мин. длина текста"
              type="number"
              value={formData.len_min}
              onChange={(e) => setFormData({ ...formData, len_min: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Макс. длина текста"
              type="number"
              value={formData.len_max}
              onChange={(e) => setFormData({ ...formData, len_max: e.target.value })}
              placeholder="5000"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Input
              label="Мин. количество хэштегов"
              type="number"
              value={formData.n_hashtags_min}
              onChange={(e) => setFormData({ ...formData, n_hashtags_min: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Макс. количество хэштегов"
              type="number"
              value={formData.n_hashtags_max}
              onChange={(e) => setFormData({ ...formData, n_hashtags_max: e.target.value })}
              placeholder="10"
            />
          </div>

          <Input
            label="Тип призыва к действию (CTA)"
            type="text"
            value={formData.cta_type}
            onChange={(e) => setFormData({ ...formData, cta_type: e.target.value })}
            placeholder="Например: подписка, покупка, лайк"
          />

          <div className="input-wrapper">
            <label className="input-label">Тон общения</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.tone_of_voice.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.tone_of_voice];
                      newItems[idx] = e.target.value;
                      setFormData({ ...formData, tone_of_voice: newItems });
                    }}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        tone_of_voice: formData.tone_of_voice.filter((_, i) => i !== idx),
                      });
                    }}
                    style={{ fontSize: '24px', lineHeight: 1, padding: '4px 12px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, tone_of_voice: [...formData.tone_of_voice, ''] })}
              >
                + Добавить
              </Button>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Правила бренда</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.brand_rules.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.brand_rules];
                      newItems[idx] = e.target.value;
                      setFormData({ ...formData, brand_rules: newItems });
                    }}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        brand_rules: formData.brand_rules.filter((_, i) => i !== idx),
                      });
                    }}
                    style={{ fontSize: '24px', lineHeight: 1, padding: '4px 12px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, brand_rules: [...formData.brand_rules, ''] })}
              >
                + Добавить
              </Button>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Хорошие примеры (Good Samples)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.good_samples.map((sample, sampleIdx) => (
                <div key={sampleIdx} style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '4px', position: 'relative' }}>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        good_samples: formData.good_samples.filter((_, i) => i !== sampleIdx),
                      });
                    }}
                    style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '20px', lineHeight: 1, padding: '2px 8px' }}
                  >
                    ×
                  </Button>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Пример {sampleIdx + 1}</div>
                  {Object.entries(sample).map(([key, value], fieldIdx) => (
                    <div key={fieldIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <Input
                        placeholder="Ключ"
                        value={key}
                        onChange={(e) => {
                          const newSamples = [...formData.good_samples];
                          const oldValue = newSamples[sampleIdx][key];
                          delete newSamples[sampleIdx][key];
                          newSamples[sampleIdx][e.target.value] = oldValue;
                          setFormData({ ...formData, good_samples: newSamples });
                        }}
                        style={{ flex: '0 0 150px' }}
                      />
                      <Textarea
                        placeholder="Значение"
                        value={typeof value === 'string' ? value : JSON.stringify(value)}
                        onChange={(e) => {
                          const newSamples = [...formData.good_samples];
                          newSamples[sampleIdx][key] = e.target.value;
                          setFormData({ ...formData, good_samples: newSamples });
                        }}
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => {
                          const newSamples = [...formData.good_samples];
                          delete newSamples[sampleIdx][key];
                          setFormData({ ...formData, good_samples: newSamples });
                        }}
                        style={{ fontSize: '20px', lineHeight: 1, padding: '4px 10px' }}
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
                      const newKey = `key_${Object.keys(newSamples[sampleIdx]).length}`;
                      newSamples[sampleIdx][newKey] = '';
                      setFormData({ ...formData, good_samples: newSamples });
                    }}
                  >
                    + Добавить поле
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, good_samples: [...formData.good_samples, {}] })}
              >
                + Добавить пример
              </Button>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Дополнительная информация</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formData.additional_info.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.additional_info];
                      newItems[idx] = e.target.value;
                      setFormData({ ...formData, additional_info: newItems });
                    }}
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        additional_info: formData.additional_info.filter((_, i) => i !== idx),
                      });
                    }}
                    style={{ fontSize: '24px', lineHeight: 1, padding: '4px 12px' }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="small"
                onClick={() => setFormData({ ...formData, additional_info: [...formData.additional_info, ''] })}
              >
                + Добавить
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px', position: 'sticky', bottom: 0, background: 'white', paddingTop: '8px' }}>
            <Button type="button" variant="secondary" onClick={addModal.close} disabled={submitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
