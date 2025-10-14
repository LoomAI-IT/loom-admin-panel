import {useCallback, useState} from 'react';
import {
    type Autoposting,
    autopostingApi,
    type AutopostingCategory,
    autopostingCategoryApi,
    type AutopostingFormData,
    autopostingToForm,
    createEmptyAutopostingForm,
    formToCreateAutopostingRequest,
    formToCreateCategoryRequest,
    formToUpdateAutopostingRequest,
    formToUpdateCategoryRequest,
    jsonToForm,
    validateAutopostingForm,
} from '../../../entities/autoposting';
import {Button, Modal, DataTable, type DataTableColumn, type DataTableAction} from '../../../shared/ui';
import {useConfirmDialog, useEntityForm, useEntityList, useModal, useNotification,} from '../../../shared/lib/hooks';
import {JsonImportModal, loadJsonFromFile} from '../../../features/json-import';
import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';
import {AutopostingFormFields} from './AutopostingFormFields';
import {AutopostingDetailsModal} from './AutopostingDetailsModal';
import '../../category-table/ui/CategoriesTable.css';

interface AutopostingTableProps {
    organizationId: number;
}

export const AutopostingTable = ({organizationId}: AutopostingTableProps) => {
    // Управление списком автопостингов
    const autopostingList = useEntityList<Autoposting>({
        loadFn: () => autopostingApi.getByOrganization(organizationId),
    });

    // Кэш категорий для отображения
    const [categoryCache, setCategoryCache] = useState<Map<number, AutopostingCategory>>(new Map());

    // Загрузка категории для отображения в таблице
    const loadCategory = useCallback(async (categoryId: number) => {
        if (categoryCache.has(categoryId)) return categoryCache.get(categoryId)!;

        try {
            const category = await autopostingCategoryApi.getById(categoryId);
            setCategoryCache(prev => new Map(prev).set(categoryId, category));
            return category;
        } catch (err) {
            console.error('Failed to load category:', err);
            return null;
        }
    }, [categoryCache]);

    // Загружаем все категории для текущих автопостингов
    useState(() => {
        autopostingList.entities.forEach(autoposting => {
            loadCategory(autoposting.autoposting_category_id);
        });
    });

    // Управление формой (единая форма для create и edit)
    const autopostingForm = useEntityForm<AutopostingFormData>({
        initialData: createEmptyAutopostingForm(),
        validateFn: validateAutopostingForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                // Создаем категорию
                const categoryRequest = formToCreateCategoryRequest(data, organizationId);
                const categoryResponse = await autopostingCategoryApi.create(categoryRequest);

                if (!categoryResponse.autoposting_category_id) {
                    throw new Error('Failed to create autoposting category');
                }

                // Создаем автопостинг
                const autopostingRequest = formToCreateAutopostingRequest(
                    data,
                    organizationId,
                    categoryResponse.autoposting_category_id
                );
                await autopostingApi.create(autopostingRequest);
                notification.success('Автопостинг успешно создан');
            } else {
                // Редактирование
                if (!selectedAutoposting || !selectedCategory) {
                    throw new Error('No autoposting or category selected');
                }

                // Обновляем категорию
                const categoryRequest = formToUpdateCategoryRequest(data);
                await autopostingCategoryApi.update(selectedCategory.id, categoryRequest);

                // Обновляем автопостинг
                const autopostingRequest = formToUpdateAutopostingRequest(data);
                await autopostingApi.update(selectedAutoposting.id, autopostingRequest);
                notification.success('Автопостинг успешно обновлён');
            }

            // Обновляем список и закрываем модалки
            await autopostingList.refresh();
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

    // Текущий выбранный автопостинг и его категория
    const [selectedAutoposting, setSelectedAutoposting] = useState<Autoposting | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<AutopostingCategory | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    // Открытие модального окна создания
    const handleOpenAddModal = () => {
        autopostingForm.switchToCreate();
        addModal.open();
    };

    // Открытие модального окна редактирования
    const handleEdit = async (autoposting: Autoposting) => {
        try {
            const category = await autopostingCategoryApi.getById(autoposting.autoposting_category_id);
            setSelectedAutoposting(autoposting);
            setSelectedCategory(category);

            const formData = autopostingToForm(autoposting, category);
            autopostingForm.switchToEdit({autoposting, category}, () => formData);
            editModal.open();
        } catch (err) {
            notification.error('Ошибка при загрузке данных категории');
            console.error('Failed to load category for editing:', err);
        }
    };

    // Открытие деталей
    const handleOpenDetails = async (autoposting: Autoposting) => {
        try {
            const category = await autopostingCategoryApi.getById(autoposting.autoposting_category_id);
            setSelectedAutoposting(autoposting);
            setSelectedCategory(category);
            detailsModal.open();
        } catch (err) {
            notification.error('Ошибка при загрузке данных категории');
            console.error('Failed to load category:', err);
        }
    };

    // Удаление автопостинга
    const handleDelete = (autoposting: Autoposting) => {
        const category = categoryCache.get(autoposting.autoposting_category_id);
        const categoryName = category?.name || 'Unknown';

        confirmDialog.confirm({
            title: 'Удалить автопостинг',
            message: `Вы уверены, что хотите удалить автопостинг "${categoryName}"?`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await autopostingApi.delete(autoposting.id);
                    notification.success('Автопостинг успешно удалён');
                    await autopostingList.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении автопостинга');
                    console.error('Failed to delete autoposting:', err);
                }
            },
        });
    };

    // Переключение enabled/disabled
    const handleToggleEnabled = async (autoposting: Autoposting) => {
        setTogglingId(autoposting.id);
        try {
            await autopostingApi.update(autoposting.id, {
                enabled: !autoposting.enabled,
            });
            await autopostingList.refresh();
        } catch (err) {
            notification.error('Ошибка при изменении статуса автопостинга');
            console.error('Failed to toggle autoposting:', err);
        } finally {
            setTogglingId(null);
        }
    };

    // Импорт JSON
    const handleJsonImport = (jsonData: any) => {
        const formData = jsonToForm(jsonData);
        autopostingForm.setFormData(formData);
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
        const success = await autopostingForm.submit();
        if (!success && autopostingForm.error) {
            notification.error(autopostingForm.error);
        }
    };

    // Конфигурация колонок для DataTable
    const columns: DataTableColumn<Autoposting>[] = [
        {
            header: 'ID',
            key: 'id',
        },
        {
            header: 'Название',
            render: (autoposting) => {
                const category = categoryCache.get(autoposting.autoposting_category_id);
                if (!category) {
                    loadCategory(autoposting.autoposting_category_id);
                }
                return <span className="category-name">{category?.name || 'Загрузка...'}</span>;
            },
            className: 'table-cell-name',
        },
        {
            header: 'Период (ч)',
            key: 'period_in_hours',
        },
        {
            header: 'Статус',
            render: (autoposting) => (
                <span style={{color: autoposting.enabled ? 'green' : 'red'}}>
                    {autoposting.enabled ? 'Включён' : 'Выключен'}
                </span>
            ),
        },
        {
            header: 'Дата создания',
            render: (autoposting) => (
                <span className="category-date">
                    {new Date(autoposting.created_at).toLocaleDateString('ru-RU')}
                </span>
            ),
        },
    ];

    // Конфигурация действий для DataTable
    const actions: DataTableAction<Autoposting>[] = [
        {
            label: 'Детали',
            onClick: handleOpenDetails,
            variant: 'secondary',
        },
        {
            label: 'Редактировать',
            onClick: handleEdit,
        },
        {
            label: 'Включить/Отключить',
            onClick: () => {}, // пустой onClick, т.к. используем custom render
            render: (autoposting) => (
                <Button
                    size="small"
                    variant={autoposting.enabled ? 'danger' : 'secondary'}
                    onClick={() => handleToggleEnabled(autoposting)}
                    disabled={togglingId === autoposting.id}
                >
                    {togglingId === autoposting.id ? '...' : autoposting.enabled ? 'Отключить' : 'Включить'}
                </Button>
            ),
        },
        {
            label: 'Удалить',
            onClick: handleDelete,
            variant: 'danger',
        },
    ];

    return (
        <>
            {/* Контейнер уведомлений */}
            <NotificationContainer notifications={notification.notifications} onRemove={notification.remove}/>

            {/* Диалог подтверждения */}
            <ConfirmDialog
                dialog={confirmDialog.dialog}
                isProcessing={confirmDialog.isProcessing}
                onConfirm={confirmDialog.handleConfirm}
                onCancel={confirmDialog.handleCancel}
            />

            <DataTable
                title="Автопостинг"
                data={autopostingList.entities}
                columns={columns}
                actions={actions}
                loading={autopostingList.loading}
                error={autopostingList.error}
                emptyMessage="Автопостинги не найдены"
                onAdd={handleOpenAddModal}
                addButtonLabel="Добавить автопостинг"
                getRowKey={(autoposting) => autoposting.id}
            />

            {/* Модальное окно создания */}
            <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Добавить автопостинг"
                   className="category-modal">
                <div className="modal-toolbar">
                    <Button variant="secondary" onClick={jsonImportModal.open} disabled={autopostingForm.isSubmitting}
                            size="small">
                        Вставить JSON
                    </Button>
                    <Button variant="secondary" onClick={handleLoadJsonFile} disabled={autopostingForm.isSubmitting}
                            size="small">
                        Загрузить JSON
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="category-form">
                    <div className="form-content">
                        <AutopostingFormFields formData={autopostingForm.formData}
                                               onChange={autopostingForm.setFormData}/>
                    </div>
                    <div className="form-actions">
                        <Button type="button" variant="secondary" onClick={addModal.close}
                                disabled={autopostingForm.isSubmitting}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={autopostingForm.isSubmitting}>
                            {autopostingForm.isSubmitting ? 'Создание...' : 'Создать'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Модальное окно редактирования */}
            {selectedAutoposting && selectedCategory && (
                <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Редактировать автопостинг"
                       className="category-modal">
                    <div className="modal-toolbar">
                        <Button variant="secondary" onClick={() => handleOpenDetails(selectedAutoposting)}
                                disabled={autopostingForm.isSubmitting} size="small">
                            Детали
                        </Button>
                        <Button variant="secondary" onClick={jsonImportModal.open}
                                disabled={autopostingForm.isSubmitting} size="small">
                            Вставить JSON
                        </Button>
                        <Button variant="secondary" onClick={handleLoadJsonFile} disabled={autopostingForm.isSubmitting}
                                size="small">
                            Загрузить JSON
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="category-form">
                        <div className="form-content">
                            <AutopostingFormFields formData={autopostingForm.formData}
                                                   onChange={autopostingForm.setFormData}/>
                        </div>
                        <div className="form-actions">
                            <Button type="button" variant="secondary" onClick={editModal.close}
                                    disabled={autopostingForm.isSubmitting}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={autopostingForm.isSubmitting}>
                                {autopostingForm.isSubmitting ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Модальное окно импорта JSON */}
            <JsonImportModal isOpen={jsonImportModal.isOpen} onClose={jsonImportModal.close}
                             onImport={handleJsonImport}/>

            {/* Модальное окно деталей */}
            {selectedAutoposting && selectedCategory && (
                <AutopostingDetailsModal
                    isOpen={detailsModal.isOpen}
                    onClose={detailsModal.close}
                    autoposting={selectedAutoposting}
                    autopostingCategory={selectedCategory}
                    organizationId={organizationId}
                />
            )}
        </>
    );
};
