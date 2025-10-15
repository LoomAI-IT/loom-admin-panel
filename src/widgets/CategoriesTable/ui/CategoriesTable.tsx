import * as React from 'react';
import {useCallback, useState} from 'react';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Category,
    type CategoryFormData,
    categoryApi,
    categoryDetailsSections,
    categoryFormSections,
    categoryToForm,
    createEmptyCategoryForm,
    formToCreateCategoryRequest,
    formToUpdateCategoryRequest,
    jsonToCategoryForm,
    validateCategoryForm
} from '../../../entities/category';

import {
    type DataTableAction,
    type DataTableColumn,
    DataTable,
    DetailsViewer,
    FormBuilder,
} from '../../../shared/ui';

import {
    useConfirmDialog,
    useEntityForm,
    useEntityList,
    useModal,
    useNotification
} from '../../../shared/lib/hooks';


interface CategoriesTableProps {
    organizationId: number;
}

export const CategoriesTable = (
    {
        organizationId
    }: CategoriesTableProps
) => {
    const loadCategories = useCallback(
        () => categoryApi.getByOrganization(organizationId),
        [organizationId]
    );

    const categoryList = useEntityList<Category>({
        loadFn: loadCategories,
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

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
        categoryForm.setFormData(categoryToForm(category));
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
            render: (category) => <span>{category.name}</span>,
        },
        {
            header: 'Дата создания',
            render: (category) => (
                <span>{new Date(category.created_at).toLocaleDateString('ru-RU')}</span>
            ),
        },
    ];

    const actions: DataTableAction<Category>[] = [
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
                onRowClick={handleOpenDetails}
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
