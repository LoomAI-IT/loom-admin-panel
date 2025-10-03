import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationApi, categoryApi, employeeApi } from '../../shared/api';
import type { Organization, UpdateOrganizationRequest, Employee } from '../../shared/types';
import { EmployeeRole } from '../../shared/types';
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
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Состояние для сотрудников
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // Форма редактирования
  const [formData, setFormData] = useState({
    name: '',
    video_cut_description_end_sample: '',
    publication_text_end_sample: '',
    tone_of_voice: [] as string[],
    brand_rules: [] as string[],
    compliance_rules: [] as string[],
    audience_insights: [] as string[],
    products: [] as Record<string, any>[],
    locale: {} as Record<string, any>,
    additional_info: [] as string[],
  });

  useEffect(() => {
    if (id) {
      loadOrganization(parseInt(id));
      loadCategories(parseInt(id));
      loadEmployees(parseInt(id));
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
        video_cut_description_end_sample: response.video_cut_description_end_sample || '',
        publication_text_end_sample: response.publication_text_end_sample || '',
        tone_of_voice: response.tone_of_voice || [],
        brand_rules: response.brand_rules || [],
        compliance_rules: response.compliance_rules || [],
        audience_insights: response.audience_insights || [],
        products: response.products || [],
        locale: response.locale || {},
        additional_info: response.additional_info || [],
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
        video_cut_description_end_sample: organization.video_cut_description_end_sample || '',
        publication_text_end_sample: organization.publication_text_end_sample || '',
        tone_of_voice: organization.tone_of_voice || [],
        brand_rules: organization.brand_rules || [],
        compliance_rules: organization.compliance_rules || [],
        audience_insights: organization.audience_insights || [],
        products: organization.products || [],
        locale: organization.locale || {},
        additional_info: organization.additional_info || [],
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
        video_cut_description_end_sample: formData.video_cut_description_end_sample,
        publication_text_end_sample: formData.publication_text_end_sample,
        tone_of_voice: formData.tone_of_voice,
        brand_rules: formData.brand_rules,
        compliance_rules: formData.compliance_rules,
        audience_insights: formData.audience_insights,
        products: formData.products,
        locale: formData.locale,
        additional_info: formData.additional_info,
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

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
  };

  const loadEmployees = async (organizationId: number) => {
    try {
      setEmployeesLoading(true);
      const response = await employeeApi.getByOrganization(organizationId);
      setEmployees(response.employees);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleCloseEmployeeModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = () => {
    setShowAddEmployeeModal(true);
  };

  const handleCloseAddEmployeeModal = () => {
    setShowAddEmployeeModal(false);
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
          <h2>Tone of Voice</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="list-editor">
                {formData.tone_of_voice.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.tone_of_voice];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, tone_of_voice: newList });
                      }}
                      className="edit-textarea"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.tone_of_voice.filter((_, i) => i !== idx);
                        setFormData({ ...formData, tone_of_voice: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, tone_of_voice: [...formData.tone_of_voice, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {organization.tone_of_voice.length > 0 ? (
                  <ul>
                    {organization.tone_of_voice.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Правила бренда</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="list-editor">
                {formData.brand_rules.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.brand_rules];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, brand_rules: newList });
                      }}
                      className="edit-textarea"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.brand_rules.filter((_, i) => i !== idx);
                        setFormData({ ...formData, brand_rules: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, brand_rules: [...formData.brand_rules, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {organization.brand_rules.length > 0 ? (
                  <ul>
                    {organization.brand_rules.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Правила соответствия</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="list-editor">
                {formData.compliance_rules.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.compliance_rules];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, compliance_rules: newList });
                      }}
                      className="edit-textarea"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.compliance_rules.filter((_, i) => i !== idx);
                        setFormData({ ...formData, compliance_rules: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, compliance_rules: [...formData.compliance_rules, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {organization.compliance_rules.length > 0 ? (
                  <ul>
                    {organization.compliance_rules.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Информация об аудитории</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="list-editor">
                {formData.audience_insights.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.audience_insights];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, audience_insights: newList });
                      }}
                      className="edit-textarea"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.audience_insights.filter((_, i) => i !== idx);
                        setFormData({ ...formData, audience_insights: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, audience_insights: [...formData.audience_insights, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {organization.audience_insights.length > 0 ? (
                  <ul>
                    {organization.audience_insights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Продукты</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="dict-list-editor">
                {formData.products.map((product, productIdx) => (
                  <div key={productIdx} className="dict-item">
                    <div className="dict-item-header">
                      <h4>Продукт #{productIdx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newList = formData.products.filter((_, i) => i !== productIdx);
                          setFormData({ ...formData, products: newList });
                        }}
                        className="btn-remove"
                      >
                        ×
                      </button>
                    </div>
                    <div className="key-value-pairs">
                      {Object.entries(product).map(([key, value], pairIdx) => (
                        <div key={pairIdx} className="key-value-pair">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => {
                              const newProducts = [...formData.products];
                              const newProduct = { ...product };
                              delete newProduct[key];
                              newProduct[e.target.value] = value;
                              newProducts[productIdx] = newProduct;
                              setFormData({ ...formData, products: newProducts });
                            }}
                            placeholder="Ключ"
                            className="edit-input key-input"
                          />
                          <textarea
                            value={String(value)}
                            onChange={(e) => {
                              const newProducts = [...formData.products];
                              newProducts[productIdx] = { ...product, [key]: e.target.value };
                              setFormData({ ...formData, products: newProducts });
                            }}
                            placeholder="Значение"
                            className="edit-textarea value-textarea"
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newProducts = [...formData.products];
                              const newProduct = { ...product };
                              delete newProduct[key];
                              newProducts[productIdx] = newProduct;
                              setFormData({ ...formData, products: newProducts });
                            }}
                            className="btn-remove-small"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newProducts = [...formData.products];
                          newProducts[productIdx] = { ...product, '': '' };
                          setFormData({ ...formData, products: newProducts });
                        }}
                        className="btn-add-small"
                      >
                        + Добавить поле
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, products: [...formData.products, {}] });
                  }}
                  className="btn-add"
                >
                  + Добавить продукт
                </button>
              </div>
            ) : (
              <div className="value">
                {organization.products.length > 0 ? (
                  <div className="dict-list-display">
                    {organization.products.map((product, idx) => (
                      <div key={idx} className="dict-display-item">
                        <h4>Продукт #{idx + 1}</h4>
                        <div className="dict-display-content">
                          {Object.entries(product).map(([key, value]) => (
                            <div key={key} className="dict-display-pair">
                              <span className="dict-key">{key}:</span>
                              <span className="dict-value">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Локаль</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="dict-editor">
                <div className="key-value-pairs">
                  {Object.entries(formData.locale).map(([key, value], pairIdx) => (
                    <div key={pairIdx} className="key-value-pair">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newLocale = { ...formData.locale };
                          delete newLocale[key];
                          newLocale[e.target.value] = value;
                          setFormData({ ...formData, locale: newLocale });
                        }}
                        placeholder="Ключ"
                        className="edit-input key-input"
                      />
                      <textarea
                        value={String(value)}
                        onChange={(e) => {
                          const newLocale = { ...formData.locale, [key]: e.target.value };
                          setFormData({ ...formData, locale: newLocale });
                        }}
                        placeholder="Значение"
                        className="edit-textarea value-textarea"
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newLocale = { ...formData.locale };
                          delete newLocale[key];
                          setFormData({ ...formData, locale: newLocale });
                        }}
                        className="btn-remove-small"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, locale: { ...formData.locale, '': '' } });
                    }}
                    className="btn-add-small"
                  >
                    + Добавить поле
                  </button>
                </div>
              </div>
            ) : (
              <div className="value">
                {Object.keys(organization.locale).length > 0 ? (
                  <div className="dict-display-content">
                    {Object.entries(organization.locale).map(([key, value]) => (
                      <div key={key} className="dict-display-pair">
                        <span className="dict-key">{key}:</span>
                        <span className="dict-value">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Дополнительная информация</h2>
          <div className="info-item full-width">
            {isEditing ? (
              <div className="list-editor">
                {formData.additional_info.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.additional_info];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, additional_info: newList });
                      }}
                      className="edit-textarea"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.additional_info.filter((_, i) => i !== idx);
                        setFormData({ ...formData, additional_info: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, additional_info: [...formData.additional_info, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {organization.additional_info.length > 0 ? (
                  <ul>
                    {organization.additional_info.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="section-header">
            <h2>Рубрики</h2>
            <button onClick={handleAddCategory} className="btn-primary">
              Создать рубрику
            </button>
          </div>
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

        <div className="info-section">
          <div className="section-header">
            <h2>Сотрудники</h2>
            <button onClick={handleAddEmployee} className="btn-primary">
              Добавить сотрудника
            </button>
          </div>
          {employeesLoading ? (
            <div className="loading-text">Загрузка сотрудников...</div>
          ) : employees.length === 0 ? (
            <div className="empty-text">Сотрудников пока нет</div>
          ) : (
            <div className="employees-grid">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="employee-card"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className="employee-name">{employee.name}</div>
                  <div className="employee-role">{employee.role}</div>
                  <div className="employee-id">Account ID: {employee.account_id}</div>
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
          onDelete={() => {
            if (organization) {
              loadCategories(organization.id);
              handleCloseCategoryModal();
            }
          }}
        />
      )}

      {showEmployeeModal && selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={handleCloseEmployeeModal}
          onUpdate={() => {
            if (organization) {
              loadEmployees(organization.id);
            }
          }}
          onDelete={() => {
            if (organization) {
              loadEmployees(organization.id);
              handleCloseEmployeeModal();
            }
          }}
        />
      )}

      {showAddEmployeeModal && organization && (
        <AddEmployeeModal
          organizationId={organization.id}
          onClose={handleCloseAddEmployeeModal}
          onAdd={() => {
            if (organization) {
              loadEmployees(organization.id);
              handleCloseAddEmployeeModal();
            }
          }}
        />
      )}

      {showAddCategoryModal && organization && (
        <AddCategoryModal
          organizationId={organization.id}
          onClose={handleCloseAddCategoryModal}
          onAdd={() => {
            if (organization) {
              loadCategories(organization.id);
              handleCloseAddCategoryModal();
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
  onDelete: () => void;
}

const CategoryModal = ({ category, onClose, onUpdate, onDelete }: CategoryModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    prompt_for_image_style: category.prompt_for_image_style,
    goal: category.goal,
    structure_skeleton: category.structure_skeleton,
    structure_flex_level_min: category.structure_flex_level_min,
    structure_flex_level_max: category.structure_flex_level_max,
    structure_flex_level_comment: category.structure_flex_level_comment,
    must_have: category.must_have,
    must_avoid: category.must_avoid,
    social_networks_rules: category.social_networks_rules,
    len_min: category.len_min,
    len_max: category.len_max,
    n_hashtags_min: category.n_hashtags_min,
    n_hashtags_max: category.n_hashtags_max,
    cta_type: category.cta_type,
    tone_of_voice: category.tone_of_voice,
    brand_rules: category.brand_rules,
    good_samples: category.good_samples,
    additional_info: category.additional_info,
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

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить рубрику "${category.name}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await categoryApi.delete(category.id);
      onDelete();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Ошибка при удалении рубрики');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: category.name,
      prompt_for_image_style: category.prompt_for_image_style,
      goal: category.goal,
      structure_skeleton: category.structure_skeleton,
      structure_flex_level_min: category.structure_flex_level_min,
      structure_flex_level_max: category.structure_flex_level_max,
      structure_flex_level_comment: category.structure_flex_level_comment,
      must_have: category.must_have,
      must_avoid: category.must_avoid,
      social_networks_rules: category.social_networks_rules,
      len_min: category.len_min,
      len_max: category.len_max,
      n_hashtags_min: category.n_hashtags_min,
      n_hashtags_max: category.n_hashtags_max,
      cta_type: category.cta_type,
      tone_of_voice: category.tone_of_voice,
      brand_rules: category.brand_rules,
      good_samples: category.good_samples,
      additional_info: category.additional_info,
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
            <label>ID</label>
            <div className="value">{category.id}</div>
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
              <div className="value">{category.name}</div>
            )}
          </div>

          <div className="info-item">
            <label>Дата создания</label>
            <div className="value">{new Date(category.created_at).toLocaleString('ru-RU')}</div>
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
                rows={4}
                placeholder="Введите промпт для стиля изображения..."
              />
            ) : (
              <div className="value text-content">{category.prompt_for_image_style || 'Не задано'}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Цель рубрики</label>
            {isEditing ? (
              <textarea
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                className="edit-textarea"
                rows={4}
                placeholder="Введите цель рубрики..."
              />
            ) : (
              <div className="value text-content">{category.goal || 'Не задано'}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Структура контента (скелет)</label>
            {isEditing ? (
              <div className="list-editor">
                {formData.structure_skeleton.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.structure_skeleton];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, structure_skeleton: newList });
                      }}
                      className="edit-textarea"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.structure_skeleton.filter((_, i) => i !== idx);
                        setFormData({ ...formData, structure_skeleton: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, structure_skeleton: [...formData.structure_skeleton, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {category.structure_skeleton.length > 0 ? (
                  <ul>
                    {category.structure_skeleton.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>

          <div className="info-item">
            <label>Гибкость структуры (мин)</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.structure_flex_level_min}
                onChange={(e) =>
                  setFormData({ ...formData, structure_flex_level_min: parseInt(e.target.value) || 0 })
                }
                className="edit-input"
              />
            ) : (
              <div className="value">{category.structure_flex_level_min}</div>
            )}
          </div>

          <div className="info-item">
            <label>Гибкость структуры (макс)</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.structure_flex_level_max}
                onChange={(e) =>
                  setFormData({ ...formData, structure_flex_level_max: parseInt(e.target.value) || 0 })
                }
                className="edit-input"
              />
            ) : (
              <div className="value">{category.structure_flex_level_max}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Комментарий к гибкости структуры</label>
            {isEditing ? (
              <textarea
                value={formData.structure_flex_level_comment}
                onChange={(e) =>
                  setFormData({ ...formData, structure_flex_level_comment: e.target.value })
                }
                className="edit-textarea"
                rows={3}
                placeholder="Введите комментарий..."
              />
            ) : (
              <div className="value text-content">{category.structure_flex_level_comment || 'Не задано'}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Обязательные элементы (Must Have)</label>
            {isEditing ? (
              <div className="list-editor">
                {formData.must_have.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.must_have];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, must_have: newList });
                      }}
                      className="edit-textarea"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.must_have.filter((_, i) => i !== idx);
                        setFormData({ ...formData, must_have: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, must_have: [...formData.must_have, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {category.must_have.length > 0 ? (
                  <ul>
                    {category.must_have.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Запрещённые элементы (Must Avoid)</label>
            {isEditing ? (
              <div className="list-editor">
                {formData.must_avoid.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.must_avoid];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, must_avoid: newList });
                      }}
                      className="edit-textarea"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.must_avoid.filter((_, i) => i !== idx);
                        setFormData({ ...formData, must_avoid: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, must_avoid: [...formData.must_avoid, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {category.must_avoid.length > 0 ? (
                  <ul>
                    {category.must_avoid.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Правила для соцсетей</label>
            {isEditing ? (
              <textarea
                value={formData.social_networks_rules}
                onChange={(e) =>
                  setFormData({ ...formData, social_networks_rules: e.target.value })
                }
                className="edit-textarea"
                rows={4}
                placeholder="Введите правила для соцсетей..."
              />
            ) : (
              <div className="value text-content">{category.social_networks_rules || 'Не задано'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Минимальная длина текста</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.len_min}
                onChange={(e) =>
                  setFormData({ ...formData, len_min: parseInt(e.target.value) || 0 })
                }
                className="edit-input"
              />
            ) : (
              <div className="value">{category.len_min}</div>
            )}
          </div>

          <div className="info-item">
            <label>Максимальная длина текста</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.len_max}
                onChange={(e) =>
                  setFormData({ ...formData, len_max: parseInt(e.target.value) || 0 })
                }
                className="edit-input"
              />
            ) : (
              <div className="value">{category.len_max}</div>
            )}
          </div>

          <div className="info-item">
            <label>Мин. кол-во хештегов</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.n_hashtags_min}
                onChange={(e) =>
                  setFormData({ ...formData, n_hashtags_min: parseInt(e.target.value) || 0 })
                }
                className="edit-input"
              />
            ) : (
              <div className="value">{category.n_hashtags_min}</div>
            )}
          </div>

          <div className="info-item">
            <label>Макс. кол-во хештегов</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.n_hashtags_max}
                onChange={(e) =>
                  setFormData({ ...formData, n_hashtags_max: parseInt(e.target.value) || 0 })
                }
                className="edit-input"
              />
            ) : (
              <div className="value">{category.n_hashtags_max}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Тип призыва к действию (CTA)</label>
            {isEditing ? (
              <textarea
                value={formData.cta_type}
                onChange={(e) =>
                  setFormData({ ...formData, cta_type: e.target.value })
                }
                className="edit-textarea"
                rows={3}
                placeholder="Введите тип CTA..."
              />
            ) : (
              <div className="value text-content">{category.cta_type || 'Не задано'}</div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Tone of Voice</label>
            {isEditing ? (
              <div className="list-editor">
                {formData.tone_of_voice.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.tone_of_voice];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, tone_of_voice: newList });
                      }}
                      className="edit-textarea"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.tone_of_voice.filter((_, i) => i !== idx);
                        setFormData({ ...formData, tone_of_voice: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, tone_of_voice: [...formData.tone_of_voice, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {category.tone_of_voice.length > 0 ? (
                  <ul>
                    {category.tone_of_voice.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Правила бренда</label>
            {isEditing ? (
              <div className="list-editor">
                {formData.brand_rules.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.brand_rules];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, brand_rules: newList });
                      }}
                      className="edit-textarea"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.brand_rules.filter((_, i) => i !== idx);
                        setFormData({ ...formData, brand_rules: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, brand_rules: [...formData.brand_rules, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {category.brand_rules.length > 0 ? (
                  <ul>
                    {category.brand_rules.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Хорошие примеры</label>
            {isEditing ? (
              <div className="dict-list-editor">
                {formData.good_samples.map((sample, sampleIdx) => (
                  <div key={sampleIdx} className="dict-item">
                    <div className="dict-item-header">
                      <h4>Пример #{sampleIdx + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newList = formData.good_samples.filter((_, i) => i !== sampleIdx);
                          setFormData({ ...formData, good_samples: newList });
                        }}
                        className="btn-remove"
                      >
                        ×
                      </button>
                    </div>
                    <div className="key-value-pairs">
                      {Object.entries(sample).map(([key, value], pairIdx) => (
                        <div key={pairIdx} className="key-value-pair">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => {
                              const newSamples = [...formData.good_samples];
                              const newSample = { ...sample };
                              delete newSample[key];
                              newSample[e.target.value] = value;
                              newSamples[sampleIdx] = newSample;
                              setFormData({ ...formData, good_samples: newSamples });
                            }}
                            placeholder="Ключ"
                            className="edit-input key-input"
                          />
                          <textarea
                            value={String(value)}
                            onChange={(e) => {
                              const newSamples = [...formData.good_samples];
                              newSamples[sampleIdx] = { ...sample, [key]: e.target.value };
                              setFormData({ ...formData, good_samples: newSamples });
                            }}
                            placeholder="Значение"
                            className="edit-textarea value-textarea"
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSamples = [...formData.good_samples];
                              const newSample = { ...sample };
                              delete newSample[key];
                              newSamples[sampleIdx] = newSample;
                              setFormData({ ...formData, good_samples: newSamples });
                            }}
                            className="btn-remove-small"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newSamples = [...formData.good_samples];
                          newSamples[sampleIdx] = { ...sample, '': '' };
                          setFormData({ ...formData, good_samples: newSamples });
                        }}
                        className="btn-add-small"
                      >
                        + Добавить поле
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, good_samples: [...formData.good_samples, {}] });
                  }}
                  className="btn-add"
                >
                  + Добавить пример
                </button>
              </div>
            ) : (
              <div className="value">
                {category.good_samples.length > 0 ? (
                  <div className="dict-list-display">
                    {category.good_samples.map((sample, idx) => (
                      <div key={idx} className="dict-display-item">
                        <h4>Пример #{idx + 1}</h4>
                        <div className="dict-display-content">
                          {Object.entries(sample).map(([key, value]) => (
                            <div key={key} className="dict-display-pair">
                              <span className="dict-key">{key}:</span>
                              <span className="dict-value">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>

          <div className="info-item full-width">
            <label>Дополнительная информация</label>
            {isEditing ? (
              <div className="list-editor">
                {formData.additional_info.map((item, idx) => (
                  <div key={idx} className="list-item">
                    <textarea
                      value={item}
                      onChange={(e) => {
                        const newList = [...formData.additional_info];
                        newList[idx] = e.target.value;
                        setFormData({ ...formData, additional_info: newList });
                      }}
                      className="edit-textarea"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.additional_info.filter((_, i) => i !== idx);
                        setFormData({ ...formData, additional_info: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, additional_info: [...formData.additional_info, ''] });
                  }}
                  className="btn-add"
                >
                  + Добавить
                </button>
              </div>
            ) : (
              <div className="value">
                {category.additional_info.length > 0 ? (
                  <ul>
                    {category.additional_info.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  'Не задано'
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {!isEditing ? (
            <>
              <button onClick={handleDelete} className="btn-danger" disabled={isDeleting}>
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
              <div style={{ flex: 1 }} />
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

// Модальное окно для просмотра и редактирования сотрудника
interface EmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const EmployeeModal = ({ employee, onClose, onUpdate, onDelete }: EmployeeModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    role: employee.role,
    required_moderation: employee.required_moderation,
    autoposting_permission: employee.autoposting_permission,
    add_employee_permission: employee.add_employee_permission,
    edit_employee_perm_permission: employee.edit_employee_perm_permission,
    top_up_balance_permission: employee.top_up_balance_permission,
    sign_up_social_net_permission: employee.sign_up_social_net_permission,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Обновляем роль
      await employeeApi.updateRole({
        account_id: employee.account_id,
        role: formData.role,
      });

      // Обновляем права
      await employeeApi.updatePermissions({
        account_id: employee.account_id,
        required_moderation: formData.required_moderation,
        autoposting_permission: formData.autoposting_permission,
        add_employee_permission: formData.add_employee_permission,
        edit_employee_perm_permission: formData.edit_employee_perm_permission,
        top_up_balance_permission: formData.top_up_balance_permission,
        sign_up_social_net_permission: formData.sign_up_social_net_permission,
      });

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to update employee:', err);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить сотрудника ${employee.name}?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await employeeApi.delete(employee.account_id);
      onDelete();
    } catch (err) {
      console.error('Failed to delete employee:', err);
      alert('Ошибка при удалении сотрудника');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      role: employee.role,
      required_moderation: employee.required_moderation,
      autoposting_permission: employee.autoposting_permission,
      add_employee_permission: employee.add_employee_permission,
      edit_employee_perm_permission: employee.edit_employee_perm_permission,
      top_up_balance_permission: employee.top_up_balance_permission,
      sign_up_social_net_permission: employee.sign_up_social_net_permission,
    });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Сотрудник: {employee.name}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="info-item">
            <label>ID</label>
            <div className="value">{employee.id}</div>
          </div>

          <div className="info-item">
            <label>Account ID</label>
            <div className="value">{employee.account_id}</div>
          </div>

          <div className="info-item">
            <label>Имя</label>
            <div className="value">{employee.name}</div>
          </div>

          <div className="info-item">
            <label>Роль</label>
            {isEditing ? (
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="edit-input"
              >
                <option value={EmployeeRole.ADMIN}>Admin</option>
                <option value={EmployeeRole.MODERATOR}>Moderator</option>
                <option value={EmployeeRole.EMPLOYEE}>Employee</option>
              </select>
            ) : (
              <div className="value">{employee.role}</div>
            )}
          </div>

          <div className="info-item">
            <label>Приглашён от Account ID</label>
            <div className="value">{employee.invited_from_account_id}</div>
          </div>

          <div className="info-item full-width">
            <h3>Права доступа</h3>
          </div>

          <div className="info-item">
            <label>Требуется модерация</label>
            {isEditing ? (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.required_moderation}
                  onChange={(e) => setFormData({ ...formData, required_moderation: e.target.checked })}
                />
                <span className="slider"></span>
              </label>
            ) : (
              <div className="value">{employee.required_moderation ? 'Да' : 'Нет'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Автопостинг</label>
            {isEditing ? (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.autoposting_permission}
                  onChange={(e) => setFormData({ ...formData, autoposting_permission: e.target.checked })}
                />
                <span className="slider"></span>
              </label>
            ) : (
              <div className="value">{employee.autoposting_permission ? 'Да' : 'Нет'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Добавление сотрудников</label>
            {isEditing ? (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.add_employee_permission}
                  onChange={(e) => setFormData({ ...formData, add_employee_permission: e.target.checked })}
                />
                <span className="slider"></span>
              </label>
            ) : (
              <div className="value">{employee.add_employee_permission ? 'Да' : 'Нет'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Редактирование прав сотрудников</label>
            {isEditing ? (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.edit_employee_perm_permission}
                  onChange={(e) => setFormData({ ...formData, edit_employee_perm_permission: e.target.checked })}
                />
                <span className="slider"></span>
              </label>
            ) : (
              <div className="value">{employee.edit_employee_perm_permission ? 'Да' : 'Нет'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Пополнение баланса</label>
            {isEditing ? (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.top_up_balance_permission}
                  onChange={(e) => setFormData({ ...formData, top_up_balance_permission: e.target.checked })}
                />
                <span className="slider"></span>
              </label>
            ) : (
              <div className="value">{employee.top_up_balance_permission ? 'Да' : 'Нет'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Регистрация соц. сетей</label>
            {isEditing ? (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.sign_up_social_net_permission}
                  onChange={(e) => setFormData({ ...formData, sign_up_social_net_permission: e.target.checked })}
                />
                <span className="slider"></span>
              </label>
            ) : (
              <div className="value">{employee.sign_up_social_net_permission ? 'Да' : 'Нет'}</div>
            )}
          </div>

          <div className="info-item">
            <label>Дата создания</label>
            <div className="value">{new Date(employee.created_at).toLocaleString('ru-RU')}</div>
          </div>
        </div>

        <div className="modal-footer">
          {!isEditing ? (
            <>
              <button onClick={handleDelete} className="btn-danger" disabled={isDeleting}>
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
              <div style={{ flex: 1 }} />
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

// Модальное окно для добавления новой рубрики
interface AddCategoryModalProps {
  organizationId: number;
  onClose: () => void;
  onAdd: () => void;
}

const AddCategoryModal = ({ organizationId, onClose, onAdd }: AddCategoryModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    prompt_for_image_style: '',
    goal: '',
    structure_skeleton: [] as string[],
    structure_flex_level_min: 0,
    structure_flex_level_max: 0,
    structure_flex_level_comment: '',
    must_have: [] as string[],
    must_avoid: [] as string[],
    social_networks_rules: '',
    len_min: 0,
    len_max: 0,
    n_hashtags_min: 0,
    n_hashtags_max: 0,
    cta_type: '',
    tone_of_voice: [] as string[],
    brand_rules: [] as string[],
    good_samples: [] as Record<string, any>[],
    additional_info: [] as string[],
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Введите название рубрики');
      return;
    }

    try {
      setIsSaving(true);
      await categoryApi.create({
        organization_id: organizationId,
        name: formData.name.trim(),
        prompt_for_image_style: formData.prompt_for_image_style,
        goal: formData.goal,
        structure_skeleton: formData.structure_skeleton,
        structure_flex_level_min: formData.structure_flex_level_min,
        structure_flex_level_max: formData.structure_flex_level_max,
        structure_flex_level_comment: formData.structure_flex_level_comment,
        must_have: formData.must_have,
        must_avoid: formData.must_avoid,
        social_networks_rules: formData.social_networks_rules,
        len_min: formData.len_min,
        len_max: formData.len_max,
        n_hashtags_min: formData.n_hashtags_min,
        n_hashtags_max: formData.n_hashtags_max,
        cta_type: formData.cta_type,
        tone_of_voice: formData.tone_of_voice,
        brand_rules: formData.brand_rules,
        good_samples: formData.good_samples,
        additional_info: formData.additional_info,
      });
      onAdd();
    } catch (err) {
      console.error('Failed to create category:', err);
      alert('Ошибка при создании рубрики');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Создать рубрику</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="info-item">
            <label>Название *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="edit-input"
              placeholder="Введите название рубрики"
              autoFocus
            />
          </div>

          <div className="info-item full-width">
            <label>Промпт для стиля изображения</label>
            <textarea
              value={formData.prompt_for_image_style}
              onChange={(e) => setFormData({ ...formData, prompt_for_image_style: e.target.value })}
              className="edit-textarea"
              rows={4}
              placeholder="Введите промпт для стиля изображения..."
            />
          </div>

          <div className="info-item full-width">
            <label>Цель рубрики</label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="edit-textarea"
              rows={4}
              placeholder="Введите цель рубрики..."
            />
          </div>

          <div className="info-item full-width">
            <label>Структура контента (скелет)</label>
            <div className="list-editor">
              {formData.structure_skeleton.map((item, idx) => (
                <div key={idx} className="list-item">
                  <textarea
                    value={item}
                    onChange={(e) => {
                      const newList = [...formData.structure_skeleton];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, structure_skeleton: newList });
                    }}
                    className="edit-textarea"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newList = formData.structure_skeleton.filter((_, i) => i !== idx);
                      setFormData({ ...formData, structure_skeleton: newList });
                    }}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, structure_skeleton: [...formData.structure_skeleton, ''] });
                }}
                className="btn-add"
              >
                + Добавить
              </button>
            </div>
          </div>

          <div className="info-item">
            <label>Гибкость структуры (мин)</label>
            <input
              type="number"
              value={formData.structure_flex_level_min}
              onChange={(e) => setFormData({ ...formData, structure_flex_level_min: parseInt(e.target.value) || 0 })}
              className="edit-input"
            />
          </div>

          <div className="info-item">
            <label>Гибкость структуры (макс)</label>
            <input
              type="number"
              value={formData.structure_flex_level_max}
              onChange={(e) => setFormData({ ...formData, structure_flex_level_max: parseInt(e.target.value) || 0 })}
              className="edit-input"
            />
          </div>

          <div className="info-item full-width">
            <label>Комментарий к гибкости структуры</label>
            <textarea
              value={formData.structure_flex_level_comment}
              onChange={(e) => setFormData({ ...formData, structure_flex_level_comment: e.target.value })}
              className="edit-textarea"
              rows={3}
              placeholder="Введите комментарий..."
            />
          </div>

          <div className="info-item full-width">
            <label>Обязательные элементы (Must Have)</label>
            <div className="list-editor">
              {formData.must_have.map((item, idx) => (
                <div key={idx} className="list-item">
                  <textarea
                    value={item}
                    onChange={(e) => {
                      const newList = [...formData.must_have];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, must_have: newList });
                    }}
                    className="edit-textarea"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newList = formData.must_have.filter((_, i) => i !== idx);
                      setFormData({ ...formData, must_have: newList });
                    }}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, must_have: [...formData.must_have, ''] });
                }}
                className="btn-add"
              >
                + Добавить
              </button>
            </div>
          </div>

          <div className="info-item full-width">
            <label>Запрещённые элементы (Must Avoid)</label>
            <div className="list-editor">
              {formData.must_avoid.map((item, idx) => (
                <div key={idx} className="list-item">
                  <textarea
                    value={item}
                    onChange={(e) => {
                      const newList = [...formData.must_avoid];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, must_avoid: newList });
                    }}
                    className="edit-textarea"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newList = formData.must_avoid.filter((_, i) => i !== idx);
                      setFormData({ ...formData, must_avoid: newList });
                    }}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, must_avoid: [...formData.must_avoid, ''] });
                }}
                className="btn-add"
              >
                + Добавить
              </button>
            </div>
          </div>

          <div className="info-item full-width">
            <label>Правила для соцсетей</label>
            <textarea
              value={formData.social_networks_rules}
              onChange={(e) => setFormData({ ...formData, social_networks_rules: e.target.value })}
              className="edit-textarea"
              rows={4}
              placeholder="Введите правила для соцсетей..."
            />
          </div>

          <div className="info-item">
            <label>Минимальная длина текста</label>
            <input
              type="number"
              value={formData.len_min}
              onChange={(e) => setFormData({ ...formData, len_min: parseInt(e.target.value) || 0 })}
              className="edit-input"
            />
          </div>

          <div className="info-item">
            <label>Максимальная длина текста</label>
            <input
              type="number"
              value={formData.len_max}
              onChange={(e) => setFormData({ ...formData, len_max: parseInt(e.target.value) || 0 })}
              className="edit-input"
            />
          </div>

          <div className="info-item">
            <label>Мин. кол-во хештегов</label>
            <input
              type="number"
              value={formData.n_hashtags_min}
              onChange={(e) => setFormData({ ...formData, n_hashtags_min: parseInt(e.target.value) || 0 })}
              className="edit-input"
            />
          </div>

          <div className="info-item">
            <label>Макс. кол-во хештегов</label>
            <input
              type="number"
              value={formData.n_hashtags_max}
              onChange={(e) => setFormData({ ...formData, n_hashtags_max: parseInt(e.target.value) || 0 })}
              className="edit-input"
            />
          </div>

          <div className="info-item full-width">
            <label>Тип призыва к действию (CTA)</label>
            <textarea
              value={formData.cta_type}
              onChange={(e) => setFormData({ ...formData, cta_type: e.target.value })}
              className="edit-textarea"
              rows={3}
              placeholder="Введите тип CTA..."
            />
          </div>

          <div className="info-item full-width">
            <label>Tone of Voice</label>
            <div className="list-editor">
              {formData.tone_of_voice.map((item, idx) => (
                <div key={idx} className="list-item">
                  <textarea
                    value={item}
                    onChange={(e) => {
                      const newList = [...formData.tone_of_voice];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, tone_of_voice: newList });
                    }}
                    className="edit-textarea"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newList = formData.tone_of_voice.filter((_, i) => i !== idx);
                      setFormData({ ...formData, tone_of_voice: newList });
                    }}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, tone_of_voice: [...formData.tone_of_voice, ''] });
                }}
                className="btn-add"
              >
                + Добавить
              </button>
            </div>
          </div>

          <div className="info-item full-width">
            <label>Правила бренда</label>
            <div className="list-editor">
              {formData.brand_rules.map((item, idx) => (
                <div key={idx} className="list-item">
                  <textarea
                    value={item}
                    onChange={(e) => {
                      const newList = [...formData.brand_rules];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, brand_rules: newList });
                    }}
                    className="edit-textarea"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newList = formData.brand_rules.filter((_, i) => i !== idx);
                      setFormData({ ...formData, brand_rules: newList });
                    }}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, brand_rules: [...formData.brand_rules, ''] });
                }}
                className="btn-add"
              >
                + Добавить
              </button>
            </div>
          </div>

          <div className="info-item full-width">
            <label>Хорошие примеры</label>
            <div className="dict-list-editor">
              {formData.good_samples.map((sample, sampleIdx) => (
                <div key={sampleIdx} className="dict-item">
                  <div className="dict-item-header">
                    <h4>Пример #{sampleIdx + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newList = formData.good_samples.filter((_, i) => i !== sampleIdx);
                        setFormData({ ...formData, good_samples: newList });
                      }}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                  <div className="key-value-pairs">
                    {Object.entries(sample).map(([key, value], pairIdx) => (
                      <div key={pairIdx} className="key-value-pair">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => {
                            const newSamples = [...formData.good_samples];
                            const newSample = { ...sample };
                            delete newSample[key];
                            newSample[e.target.value] = value;
                            newSamples[sampleIdx] = newSample;
                            setFormData({ ...formData, good_samples: newSamples });
                          }}
                          placeholder="Ключ"
                          className="edit-input key-input"
                        />
                        <textarea
                          value={String(value)}
                          onChange={(e) => {
                            const newSamples = [...formData.good_samples];
                            newSamples[sampleIdx] = { ...sample, [key]: e.target.value };
                            setFormData({ ...formData, good_samples: newSamples });
                          }}
                          placeholder="Значение"
                          className="edit-textarea value-textarea"
                          rows={2}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSamples = [...formData.good_samples];
                            const newSample = { ...sample };
                            delete newSample[key];
                            newSamples[sampleIdx] = newSample;
                            setFormData({ ...formData, good_samples: newSamples });
                          }}
                          className="btn-remove-small"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newSamples = [...formData.good_samples];
                        newSamples[sampleIdx] = { ...sample, '': '' };
                        setFormData({ ...formData, good_samples: newSamples });
                      }}
                      className="btn-add-small"
                    >
                      + Добавить поле
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, good_samples: [...formData.good_samples, {}] });
                }}
                className="btn-add"
              >
                + Добавить пример
              </button>
            </div>
          </div>

          <div className="info-item full-width">
            <label>Дополнительная информация</label>
            <div className="list-editor">
              {formData.additional_info.map((item, idx) => (
                <div key={idx} className="list-item">
                  <textarea
                    value={item}
                    onChange={(e) => {
                      const newList = [...formData.additional_info];
                      newList[idx] = e.target.value;
                      setFormData({ ...formData, additional_info: newList });
                    }}
                    className="edit-textarea"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newList = formData.additional_info.filter((_, i) => i !== idx);
                      setFormData({ ...formData, additional_info: newList });
                    }}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, additional_info: [...formData.additional_info, ''] });
                }}
                className="btn-add"
              >
                + Добавить
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={isSaving}>
            Отмена
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={isSaving || !formData.name.trim()}>
            {isSaving ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Модальное окно для добавления нового сотрудника
interface AddEmployeeModalProps {
  organizationId: number;
  onClose: () => void;
  onAdd: () => void;
}

const AddEmployeeModal = ({ organizationId, onClose, onAdd }: AddEmployeeModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    account_id: '',
    name: '',
    role: EmployeeRole.EMPLOYEE as string,
  });

  const handleSave = async () => {
    if (!formData.account_id || !formData.name) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      setIsSaving(true);
      await employeeApi.create({
        account_id: parseInt(formData.account_id),
        organization_id: organizationId,
        invited_from_account_id: 0, // TODO: получать из текущего пользователя
        name: formData.name,
        role: formData.role,
      });
      onAdd();
    } catch (err) {
      console.error('Failed to create employee:', err);
      alert('Ошибка при создании сотрудника');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Добавить сотрудника</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="info-item">
            <label>Account ID *</label>
            <input
              type="number"
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="edit-input"
              placeholder="Введите account ID"
            />
          </div>

          <div className="info-item">
            <label>Имя *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="edit-input"
              placeholder="Введите имя"
            />
          </div>

          <div className="info-item">
            <label>Роль</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="edit-input"
            >
              <option value={EmployeeRole.ADMIN}>Admin</option>
              <option value={EmployeeRole.MODERATOR}>Moderator</option>
              <option value={EmployeeRole.EMPLOYEE}>Employee</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={isSaving}>
            Отмена
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );
};
