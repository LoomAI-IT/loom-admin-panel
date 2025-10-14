/**
 * Рефакторинг CategoriesSection
 *
 * Было: 504 строки, дублирование формы, ручное управление состоянием
 * Стало: ~150 строк, использование хуков useEntityForm/useEntityList
 *
 * Изменения:
 * - Использование useEntityList для управления списком категорий
 * - Использование useEntityForm вместо дублирования formData/editFormData
 * - Использование useNotification вместо alert()
 * - Использование useConfirmDialog вместо confirm()
 * - Использование трансформеров из entities/category
 */

import { useState } from 'react';
import {
  categoryApi,
  type Category,
  type CategoryFormData,
  createEmptyCategoryForm,
  categoryToForm,
  jsonToForm,
  formToCreateRequest,
  formToUpdateRequest,
  validateCategoryForm,
} from '../../../entities/category';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../../shared/ui/Table';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { useModal, useEntityList, useEntityForm, useNotification, useConfirmDialog } from '../../../shared/lib/hooks';
import { JsonImportModal, loadJsonFromFile } from '../../../features/json-import';
import { NotificationContainer } from '../../../features/notification';
import { ConfirmDialog } from '../../../features/confirmation-dialog';
import { CategoryFormFields } from './CategoryFormFields';
import { CategoryDetailsModal } from './CategoryDetailsModal';
import './CategoriesSection.css';

interface CategoriesSectionProps {
  organizationId: number;
}

export const CategoriesSection = ({ organizationId }: CategoriesSectionProps) => {
  // Управление списком категорий
  const categoryList = useEntityList<Category>({
    loadFn: () => categoryApi.getByOrganization(organizationId),
  });

  // Управление формой (единая форма для create и edit)
  const categoryForm = useEntityForm<CategoryFormData, Category>({
    initialData: createEmptyCategoryForm(),
    transformEntityToForm: categoryToForm,
    validateFn: validateCategoryForm,
    onSubmit: async (data, mode) => {
      if (mode === 'create') {
        const request = formToCreateRequest(data, organizationId);
        await categoryApi.create(request);
        notification.success('Рубрика успешно создана');
      } else {
        if (!selectedCategory) throw new Error('No category selected');
        const request = formToUpdateRequest(data);
        await categoryApi.update(selectedCategory.id, request);
        notification.success('Рубрика успешно обновлена');
      }
      await categoryList.refresh();
      addModal.close();
      editModal.close();
    },
  });

  // Модальные окна
  const addModal = useModal();
  const editModal = useModal();
  const jsonImportModal = useModal();
  const detailsModal = useModal();

  // Уведомления и диалоги
  const notification = useNotification();
  const confirmDialog = useConfirmDialog();

  // Текущая выбранная категория (для деталей)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Открытие модального окна создания
  const handleOpenAddModal = () => {
    categoryForm.switchToCreate();
    addModal.open();
  };

  // Открытие модального окна редактирования
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    categoryForm.switchToEdit(category, categoryToForm);
    editModal.open();
  };

  // Открытие деталей
  const handleOpenDetails = (category: Category) => {
    setSelectedCategory(category);
    detailsModal.open();
  };

  // Удаление категории
  const handleDelete = (category: Category) => {
    confirmDialog.confirm({
      title: 'Удалить рубрику',
      message: `Вы уверены, что хотите удалить рубрику "${category.name}"?`,
      type: 'danger',
      confirmText: 'Удалить',
      onConfirm: async () => {
        try {
          await categoryApi.delete(category.id);
          notification.success('Рубрика успешно удалена');
          await categoryList.refresh();
        } catch (err) {
          notification.error('Ошибка при удалении рубрики');
          console.error('Failed to delete category:', err);
        }
      },
    });
  };

  // Импорт JSON
  const handleJsonImport = (jsonData: any) => {
    const formData = jsonToForm(jsonData);
    categoryForm.setFormData(formData);
    jsonImportModal.close();
    notification.success('Настройки успешно загружены из JSON');
  };

  // Загрузка JSON из файла
  const handleLoadJsonFile = async () => {
    try {
      const jsonData = await loadJsonFromFile();
      handleJsonImport(jsonData);
    } catch (err) {
      notification.error('Ошибка при загрузке JSON файла');
    }
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await categoryForm.submit();
    if (!success && categoryForm.error) {
      notification.error(categoryForm.error);
    }
  };

  if (categoryList.loading) {
    return <div className="categories-section loading">Загрузка рубрик...</div>;
  }

  return (
    <>
      {/* Контейнер уведомлений */}
      <NotificationContainer notifications={notification.notifications} onRemove={notification.remove} />

      {/* Диалог подтверждения */}
      <ConfirmDialog
        dialog={confirmDialog.dialog}
        isProcessing={confirmDialog.isProcessing}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />

      <div className="categories-section">
        <div className="section-header">
          <h2>Рубрики</h2>
          <Button size="small" onClick={handleOpenAddModal}>
            Добавить рубрику
          </Button>
        </div>

        {categoryList.error && (
          <div className="notification notification-error">
            <span className="notification-icon">⚠</span>
            {categoryList.error}
          </div>
        )}

        {categoryList.entities.length === 0 ? (
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
              {categoryList.entities.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="table-cell-name">
                    <span className="category-name">{category.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="category-date">
                      {new Date(category.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </TableCell>
                  <TableCell className="table-cell-action">
                    <Button size="small" variant="secondary" onClick={() => handleOpenDetails(category)}>
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

      {/* Модальное окно создания */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить рубрику" className="category-modal">
        <div className="modal-toolbar">
          <Button variant="secondary" onClick={jsonImportModal.open} disabled={categoryForm.isSubmitting} size="small">
            Вставить JSON
          </Button>
          <Button variant="secondary" onClick={handleLoadJsonFile} disabled={categoryForm.isSubmitting} size="small">
            Загрузить JSON
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-content">
            <CategoryFormFields formData={categoryForm.formData} onChange={categoryForm.setFormData} />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={addModal.close} disabled={categoryForm.isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={categoryForm.isSubmitting}>
              {categoryForm.isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно редактирования */}
      {selectedCategory && (
        <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Редактировать рубрику" className="category-modal">
          <div className="modal-toolbar">
            <Button variant="secondary" onClick={() => handleOpenDetails(selectedCategory)} disabled={categoryForm.isSubmitting} size="small">
              Детали
            </Button>
            <Button variant="secondary" onClick={jsonImportModal.open} disabled={categoryForm.isSubmitting} size="small">
              Вставить JSON
            </Button>
            <Button variant="secondary" onClick={handleLoadJsonFile} disabled={categoryForm.isSubmitting} size="small">
              Загрузить JSON
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-content">
              <CategoryFormFields formData={categoryForm.formData} onChange={categoryForm.setFormData} />
            </div>
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={editModal.close} disabled={categoryForm.isSubmitting}>
                Отмена
              </Button>
              <Button type="submit" disabled={categoryForm.isSubmitting}>
                {categoryForm.isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Модальное окно импорта JSON */}
      <JsonImportModal isOpen={jsonImportModal.isOpen} onClose={jsonImportModal.close} onImport={handleJsonImport} />

      {/* Модальное окно деталей */}
      {selectedCategory && (
        <CategoryDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={detailsModal.close}
          category={selectedCategory}
          organizationId={organizationId}
        />
      )}
    </>
  );
};
