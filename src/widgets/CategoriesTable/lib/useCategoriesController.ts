import * as React from 'react';
import {useState} from 'react';
import {
    type Category,
    type CategoryFormData,
    categoryToForm,
    createEmptyCategoryForm,
    formToCreateCategoryRequest,
    formToUpdateCategoryRequest,
    validateCategoryForm,
} from '../../../entities/category';
import {
    useConfirmDialog,
    useEntityForm,
    useModal,
    useNotification,
} from '../../../shared/lib/hooks';
import {useCategoriesModel} from '../model/useCategoriesModel';

interface UseCategoriesControllerProps {
    organizationId: number;
}

export const useCategoriesController = ({
    organizationId,
}: UseCategoriesControllerProps) => {
    const model = useCategoriesModel({organizationId});

    const categoryForm = useEntityForm<CategoryFormData, Category>({
        initialData: createEmptyCategoryForm(),
        transformEntityToForm: categoryToForm,
        validateFn: validateCategoryForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                const request = formToCreateCategoryRequest(data, organizationId);
                await model.createCategory(request);
                notification.success('Рубрика успешно создана');
            } else {
                if (!selectedCategory) throw new Error('No category selected');
                const request = formToUpdateCategoryRequest(data);
                await model.updateCategory(selectedCategory.id, request);
                notification.success('Рубрика успешно обновлена');
            }
            await model.refresh();
            addModal.close();
            editModal.close();
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();
    const editModal = useModal();
    const detailsModal = useModal();

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );

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
                    await model.deleteCategory(category.id);
                    notification.success('Рубрика успешно удалена');
                    await model.refresh();
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

    return {
        // Data from model
        categories: model.categories,
        loading: model.loading,
        error: model.error,

        // Form state
        categoryForm,

        // Modal state
        addModal,
        editModal,
        detailsModal,

        // Notification state
        notification,

        // Confirm dialog state
        confirmDialog,

        // Handlers
        handleOpenAddModal,
        handleEdit,
        handleOpenDetails,
        handleDelete,
        handleSubmit,

        // Organization ID (for passing to child components)
        organizationId,
    };
};
