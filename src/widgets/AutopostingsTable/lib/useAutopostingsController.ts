import * as React from 'react';
import {useState} from 'react';
import {
    type Autoposting,
    type AutopostingFormData,
    autopostingToForm,
    createEmptyAutopostingForm,
    formToCreateAutopostingRequest,
    formToCreateCategoryRequest,
    formToUpdateAutopostingRequest,
    formToUpdateCategoryRequest,
    validateAutopostingForm,
} from '../../../entities/autoposting';
import {
    useConfirmDialog,
    useEntityForm,
    useModal,
    useNotification,
} from '../../../shared/lib/hooks';
import {
    type AutopostingWithCategory,
    useAutopostingsModel,
} from '../model/useAutopostingsModel';

interface UseAutopostingsControllerProps {
    organizationId: number;
}

export const useAutopostingsController = ({
    organizationId,
}: UseAutopostingsControllerProps) => {
    const model = useAutopostingsModel({organizationId});

    const autopostingForm = useEntityForm<
        AutopostingFormData,
        AutopostingWithCategory
    >({
        initialData: createEmptyAutopostingForm(),
        transformEntityToForm: (entity: AutopostingWithCategory) =>
            autopostingToForm(entity.autoposting, entity.category),
        validateFn: validateAutopostingForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                const categoryRequest = formToCreateCategoryRequest(
                    data,
                    organizationId
                );
                const autopostingRequest = formToCreateAutopostingRequest(
                    data,
                    organizationId,
                    0 // будет заменено в model
                );
                await model.createAutoposting(categoryRequest, autopostingRequest);
                notification.success('Автопостинг успешно создан');
            } else {
                if (!selectedAutoposting)
                    throw new Error('No autoposting selected');

                const categoryRequest = formToUpdateCategoryRequest(data);
                const autopostingRequest = formToUpdateAutopostingRequest(data);

                await model.updateAutoposting(
                    selectedAutoposting.autoposting.id,
                    selectedAutoposting.autoposting.autoposting_category_id,
                    categoryRequest,
                    autopostingRequest
                );
                notification.success('Автопостинг успешно обновлён');
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

    const [selectedAutoposting, setSelectedAutoposting] =
        useState<AutopostingWithCategory | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleOpenAddModal = () => {
        autopostingForm.switchToCreate();
        addModal.open();
    };

    const handleEdit = async (autoposting: Autoposting) => {
        setLoadingDetails(true);
        try {
            const data = await model.loadAutopostingWithCategory(autoposting);
            setSelectedAutoposting(data);
            autopostingForm.switchToEdit(data, (entity) =>
                autopostingToForm(entity.autoposting, entity.category)
            );
            editModal.open();
        } catch (err) {
            notification.error('Ошибка при загрузке данных автопостинга');
            console.error('Failed to load autoposting details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleOpenDetails = async (autoposting: Autoposting) => {
        setLoadingDetails(true);
        try {
            const data = await model.loadAutopostingWithCategory(autoposting);
            setSelectedAutoposting(data);
            autopostingForm.setFormData(
                autopostingToForm(data.autoposting, data.category)
            );
            detailsModal.open();
        } catch (err) {
            notification.error('Ошибка при загрузке данных автопостинга');
            console.error('Failed to load autoposting details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleToggleEnabled = async (autoposting: Autoposting) => {
        const newEnabledState = !autoposting.enabled;
        confirmDialog.confirm({
            title: newEnabledState ? 'Включить автопостинг' : 'Выключить автопостинг',
            message: `Вы уверены, что хотите ${
                newEnabledState ? 'включить' : 'выключить'
            } автопостинг?`,
            type: 'warning',
            confirmText: newEnabledState ? 'Включить' : 'Выключить',
            onConfirm: async () => {
                try {
                    await model.updateAutopostingStatus(
                        autoposting.id,
                        newEnabledState
                    );
                    notification.success(
                        `Автопостинг успешно ${
                            newEnabledState ? 'включён' : 'выключен'
                        }`
                    );
                    await model.refresh();
                } catch (err) {
                    notification.error('Ошибка при изменении статуса автопостинга');
                    console.error('Failed to toggle autoposting:', err);
                }
            },
        });
    };

    const handleDelete = (autoposting: Autoposting) => {
        confirmDialog.confirm({
            title: 'Удалить автопостинг',
            message: `Вы уверены, что хотите удалить автопостинг?`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await model.deleteAutoposting(autoposting.id);
                    notification.success('Автопостинг успешно удалён');
                    await model.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении автопостинга');
                    console.error('Failed to delete autoposting:', err);
                }
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await autopostingForm.submit();
        if (!success && autopostingForm.error) {
            notification.error(autopostingForm.error);
        }
    };

    return {
        // Data from model
        autopostings: model.autopostings,
        loading: model.loading || loadingDetails,
        error: model.error,

        // Form state
        autopostingForm,

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
        handleToggleEnabled,
        handleDelete,
        handleSubmit,

        // Organization ID (for passing to child components)
        organizationId,
    };
};
