import * as React from 'react';
import {useState} from 'react';
import {
    type Category,
    categoryApi,
    type CategoryFormData,
    categoryToForm,
    createEmptyCategoryForm,
    formToCreateRequest,
    formToUpdateRequest,
    jsonToForm,
    validateCategoryForm,
} from '../../../entities/category';
import {
    Button,
    DataTable,
    type DataTableAction,
    type DataTableColumn,
    DetailSection,
    DetailsViewer,
    FormBuilder,
    FormSection,
    Modal
} from '../../../shared/ui';
import {useConfirmDialog, useEntityForm, useEntityList, useModal, useNotification} from '../../../shared/lib/hooks';
import {JsonImportModal, loadJsonFromFile} from '../../../features/json-import';
import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';
import './CategoriesTable.css';

interface CategoriesTableProps {
    organizationId: number;
}

export const CategoriesTable = (
    {
        organizationId
    }: CategoriesTableProps
) => {
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
    const [selectedCategory, setSelectedCategory] = useState<Category>(null);

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

    // Конфигурация колонок для DataTable
    const columns: DataTableColumn<Category>[] = [
        {
            header: 'ID',
            key: 'id',
        },
        {
            header: 'Название',
            render: (category) => <span className="category-name">{category.name}</span>,
            className: 'table-cell-name',
        },
        {
            header: 'Дата создания',
            render: (category) => (
                <span className="category-date">
                    {new Date(category.created_at).toLocaleDateString('ru-RU')}
                </span>
            ),
        },
    ] as DataTableColumn<Category>[];

    // Конфигурация действий для DataTable
    const actions: DataTableAction<Category>[] = [
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
            label: 'Удалить',
            onClick: handleDelete,
            variant: 'danger',
        },
    ];

    const categoryFormSections: FormSection<CategoryFormData>[] = [
        {
            title: 'Основная информация',
            fields: [
                {
                    name: 'name',
                    type: 'input',
                    label: 'Название рубрики',
                    placeholder: 'Введите название рубрики',
                    required: true,
                    inputType: 'text',
                },
                {
                    name: 'prompt_for_image_style',
                    type: 'textarea',
                    label: 'Промпт для стиля изображения',
                    placeholder: 'Описание стиля изображения...',
                    required: true,
                    debounceDelay: 500,
                },
                {
                    name: 'goal',
                    type: 'textarea',
                    label: 'Цель рубрики',
                    placeholder: 'Основная цель и назначение...',
                    required: true,
                    debounceDelay: 500,
                },
                {
                    name: 'cta_type',
                    type: 'input',
                    label: 'Тип CTA',
                    placeholder: 'Тип призыва к действию',
                    required: true,
                    inputType: 'text',
                },
            ],
        },
        {
            title: 'Структура контента',
            fields: [
                {
                    name: 'structure_skeleton',
                    type: 'stringList',
                    label: 'Скелет структуры',
                    placeholder: 'элемент структуры',
                    required: true,
                },
                {
                    name: 'structure_flex_level_min',
                    type: 'input',
                    label: 'Минимальный уровень гибкости структуры',
                    placeholder: '0',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                    groupWith: ['structure_flex_level_max'], // Группируем с максимальным
                },
                {
                    name: 'structure_flex_level_max',
                    type: 'input',
                    label: 'Максимальный уровень гибкости структуры',
                    placeholder: '10',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
                {
                    name: 'structure_flex_level_comment',
                    type: 'textarea',
                    label: 'Комментарий к гибкости структуры',
                    placeholder: 'Пояснения к уровням гибкости...',
                    required: true,
                    debounceDelay: 300,
                },
            ],
        },
        {
            title: 'Обязательные и запрещенные элементы',
            fields: [
                {
                    name: 'must_have',
                    type: 'stringList',
                    label: 'Обязательные элементы',
                    placeholder: 'обязательный элемент',
                    required: true,
                },
                {
                    name: 'must_avoid',
                    type: 'stringList',
                    label: 'Запрещенные элементы',
                    placeholder: 'запрещенный элемент',
                    required: true,
                },
            ],
        },
        {
            title: 'Ограничения длины и хэштегов',
            fields: [
                {
                    name: 'len_min',
                    type: 'input',
                    label: 'Минимальная длина',
                    placeholder: '0',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                    groupWith: ['len_max'],
                },
                {
                    name: 'len_max',
                    type: 'input',
                    label: 'Максимальная длина',
                    placeholder: '1000',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
                {
                    name: 'n_hashtags_min',
                    type: 'input',
                    label: 'Минимальное количество хэштегов',
                    placeholder: '0',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                    groupWith: ['n_hashtags_max'],
                },
                {
                    name: 'n_hashtags_max',
                    type: 'input',
                    label: 'Максимальное количество хэштегов',
                    placeholder: '10',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
            ],
        },
        {
            title: 'Социальные сети и брендинг',
            fields: [
                {
                    name: 'social_networks_rules',
                    type: 'textarea',
                    label: 'Правила для социальных сетей',
                    placeholder: 'Специфические правила для разных платформ...',
                    required: true,
                    debounceDelay: 500,
                },
                {
                    name: 'tone_of_voice',
                    type: 'stringList',
                    label: 'Тон голоса',
                    placeholder: 'тон/стиль',
                    required: true,
                },
                {
                    name: 'brand_rules',
                    type: 'stringList',
                    label: 'Правила бренда',
                    placeholder: 'правило бренда',
                    required: true,
                },
            ],
        },
        {
            title: 'Дополнительно',
            fields: [
                {
                    name: 'good_samples',
                    type: 'objectList',
                    label: 'Примеры хорошего контента',
                },
                {
                    name: 'additional_info',
                    type: 'stringList',
                    label: 'Дополнительная информация',
                    placeholder: 'дополнительный пункт',
                },
            ],
        },
    ];

    const categoryDetailsSections: DetailSection<CategoryFormData>[] = [
        {
            title: 'Основная информация',
            fields: [
                {
                    name: 'name',
                    label: 'Название рубрики',
                    important: true
                },
                {
                    name: 'goal',
                    label: 'Цель рубрики',
                    important: true
                },
                {
                    name: 'cta_type',
                    label: 'Тип CTA'
                },
                {
                    name: 'prompt_for_image_style',
                    label: 'Промпт для стиля изображения'
                },
            ]
        },
        {
            title: 'Структура контента',
            fields: [
                {name: 'structure_skeleton', label: 'Скелет структуры'},
                {
                    name: 'structure_flex_level_min',
                    label: 'Уровень гибкости',
                    groupWith: ['structure_flex_level_max']
                },
                {
                    name: 'structure_flex_level_max',
                    label: 'Максимальный уровень'
                },
                {name: 'structure_flex_level_comment', label: 'Комментарий к гибкости'},
            ]
        },
        {
            title: 'Обязательные и запрещенные элементы',
            fields: [
                {name: 'must_have', label: 'Обязательные элементы'},
                {name: 'must_avoid', label: 'Запрещенные элементы'},
            ]
        },
        {
            title: 'Ограничения',
            fields: [
                {
                    name: 'len_min',
                    label: 'Длина текста',
                    groupWith: ['len_max']
                },
                {
                    name: 'len_max',
                    label: 'Максимальная длина'
                },
                {
                    name: 'n_hashtags_min',
                    label: 'Хэштеги',
                    groupWith: ['n_hashtags_max']
                },
                {
                    name: 'n_hashtags_max',
                    label: 'Максимальное количество'
                },
            ]
        },
        {
            title: 'Социальные сети и брендинг',
            fields: [
                {name: 'social_networks_rules', label: 'Правила для соцсетей'},
                {name: 'tone_of_voice', label: 'Тон голоса'},
                {name: 'brand_rules', label: 'Правила бренда'},
            ]
        },
        {
            title: 'Дополнительно',
            fields: [
                {name: 'good_samples', label: 'Примеры хорошего контента', important: true},
                {name: 'additional_info', label: 'Дополнительная информация'},
            ]
        },
    ];

    return (
        <>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
            />

            <JsonImportModal
                isOpen={jsonImportModal.isOpen}
                onClose={jsonImportModal.close}
                onImport={handleJsonImport}
            />

            <ConfirmDialog
                dialog={confirmDialog.dialog}
                isProcessing={confirmDialog.isProcessing}
                onConfirm={confirmDialog.handleConfirm}
                onCancel={confirmDialog.handleCancel}
            />

            <DataTable<Category>
                title="Рубрики"
                data={categoryList.entities}
                columns={columns}
                actions={actions}
                loading={categoryList.loading}
                error={categoryList.error}
                emptyMessage="Рубрики не найдены"
                onAdd={handleOpenAddModal}
                addButtonLabel="Добавить рубрику"
                getRowKey={(category) => category.id}
            />

            <Modal
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                title="Добавить рубрику"
                className="category-modal"
            >
                <div className="modal-toolbar">
                    <Button
                        variant="secondary"
                        onClick={jsonImportModal.open}
                        disabled={categoryForm.isSubmitting}
                        size="small"
                    >Вставить JSON</Button>
                    <Button
                        variant="secondary"
                        onClick={handleLoadJsonFile}
                        disabled={categoryForm.isSubmitting}
                        size="small"
                    >Загрузить JSON</Button>
                </div>
                <FormBuilder<CategoryFormData>
                    sections={categoryFormSections}
                    values={categoryForm.formData}
                    onChange={categoryForm.setFormData}
                    onSubmit={handleSubmit}
                    children={
                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addModal.close}
                                disabled={categoryForm.isSubmitting}
                            >Отмена</Button>
                            <Button
                                type="submit"
                                disabled={categoryForm.isSubmitting}
                            >{categoryForm.isSubmitting ? 'Создание...' : 'Создать'}</Button>
                        </div>
                    }
                />
            </Modal>

            {/* Модальное окно редактирования */}
            {selectedCategory && (
                <Modal
                    isOpen={editModal.isOpen}
                    onClose={editModal.close}
                    title="Редактировать рубрику"
                    className="category-modal"
                >
                    <div className="modal-toolbar">
                        <Button
                            variant="secondary"
                            onClick={jsonImportModal.open}
                            disabled={categoryForm.isSubmitting}
                            size="small"
                        >Вставить JSON</Button>
                        <Button
                            variant="secondary"
                            onClick={handleLoadJsonFile}
                            disabled={categoryForm.isSubmitting}
                            size="small"
                        >Загрузить JSON</Button>
                    </div>
                    <FormBuilder<CategoryFormData>
                        sections={categoryFormSections}
                        values={categoryForm.formData}
                        onChange={categoryForm.setFormData}
                        onSubmit={handleSubmit}
                        children={
                            <div className="form-actions">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={editModal.close}
                                    disabled={categoryForm.isSubmitting}
                                >Отмена</Button>
                                <Button
                                    type="submit"
                                    disabled={categoryForm.isSubmitting}
                                >{categoryForm.isSubmitting ? 'Сохранение...' : 'Сохранить'}</Button>
                            </div>
                        }
                    />
                </Modal>
            )}

            {/* Модальное окно деталей */}
            {selectedCategory && (
                <DetailsViewer/>
            )}
        </>
    );
};
