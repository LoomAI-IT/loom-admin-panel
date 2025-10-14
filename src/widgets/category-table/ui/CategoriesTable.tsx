import * as React from 'react';
import {useState} from 'react';
import {
    type Category,
    categoryApi,
    type CategoryFormData,
    categoryToForm,
    createEmptyCategoryForm,
    formToCreateCategoryRequest,
    formToUpdateCategoryRequest,
    jsonToCategoryForm,
    validateCategoryForm,
} from '../../../entities/category';
import {
    DataTable,
    type DataTableAction,
    type DataTableColumn,
    type DetailSection,
    DetailsViewer,
    FormBuilder,
    type FormSection,
} from '../../../shared/ui';
import {useConfirmDialog, useEntityForm, useEntityList, useModal, useNotification} from '../../../shared/lib/hooks';
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
    const categoryList = useEntityList<Category>({
        loadFn: () => categoryApi.getByOrganization(organizationId),
    });

    const categoryForm = useEntityForm<CategoryFormData, Category>({
        initialData: createEmptyCategoryForm(),
        transformEntityToForm: categoryToForm,
        validateFn: validateCategoryForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                const request = formToCreateCategoryRequest(data, organizationId);
                await categoryApi.create(request);
                notification.success('Рубрика успешно создана');
            } else {
                if (!selectedCategory) throw new Error('No category selected');
                const request = formToUpdateCategoryRequest(data);
                await categoryApi.update(selectedCategory.id, request);
                notification.success('Рубрика успешно обновлена');
            }
            await categoryList.refresh();
            addModal.close();
            editModal.close();
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();
    const editModal = useModal();
    const detailsModal = useModal();

    const [selectedCategory, setSelectedCategory] = useState<Category>(null);

    const handleOpenAddModal = () => {
        categoryForm.switchToCreate();
        addModal.open();
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        categoryForm.switchToEdit(category, categoryToForm);
        editModal.open();
    };

    const handleOpenDetails = (category: Category) => {
        setSelectedCategory(category);
        detailsModal.open();
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await categoryForm.submit();
        if (!success && categoryForm.error) {
            notification.error(categoryForm.error);
        }
    };

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
    ];

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
                    groupWith: ['structure_flex_level_max'],
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
                },
                {
                    name: 'goal',
                    label: 'Цель рубрики',
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
                {
                    name: 'structure_skeleton',
                    label: 'Скелет структуры'
                },
                {
                    name: 'structure_flex_level_min',
                    label: 'Уровень гибкости',
                    groupWith: ['structure_flex_level_max']
                },
                {
                    name: 'structure_flex_level_max',
                    label: 'Максимальный уровень'
                },
                {
                    name: 'structure_flex_level_comment',
                    label: 'Комментарий к гибкости'
                },
            ]
        },
        {
            title: 'Обязательные и запрещенные элементы',
            fields: [
                {
                    name: 'must_have',
                    label: 'Обязательные элементы'
                },
                {
                    name: 'must_avoid',
                    label: 'Запрещенные элементы'
                },
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
                {
                    name: 'social_networks_rules', label: 'Правила для соцсетей'
                },
                {
                    name: 'tone_of_voice',
                    label: 'Тон голоса'
                }
                ,
                {
                    name: 'brand_rules',
                    label: 'Правила бренда'
                },
            ]
        },
        {
            title: 'Дополнительно',
            fields: [
                {
                    name: 'good_samples',
                    label: 'Примеры хорошего контента',
                },
                {
                    name: 'additional_info',
                    label: 'Дополнительная информация'
                },
            ]
        },
    ];

    return (
        <>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
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

            <FormBuilder<CategoryFormData>
                title="Добавить рубрику"
                sections={categoryFormSections}
                values={categoryForm.formData}
                isSubmitting={categoryForm.isSubmitting}
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={handleSubmit}
                jsonToForm={jsonToCategoryForm}
                setFormData={categoryForm.setFormData}
            />

            <FormBuilder<CategoryFormData>
                title="Редактирование рубрики"
                sections={categoryFormSections}
                values={categoryForm.formData}
                isSubmitting={categoryForm.isSubmitting}
                isOpen={editModal.isOpen}
                onClose={editModal.close}
                onSubmit={handleSubmit}
                jsonToForm={jsonToCategoryForm}
                setFormData={categoryForm.setFormData}
            />

            <DetailsViewer<CategoryFormData>
                title="Просмотр рубрики"
                organizationId={organizationId}
                sections={categoryDetailsSections}
                values={categoryForm.formData}
                isOpen={detailsModal.isOpen}
                onClose={detailsModal.close}
            />
        </>
    );
};
