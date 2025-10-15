import * as React from 'react';
import {useCallback, useState} from 'react';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Autoposting,
    type AutopostingCategory,
    type AutopostingFormData,
    autopostingApi,
    autopostingCategoryApi,
    autopostingDetailsSections,
    autopostingFormSections,
    autopostingToForm,
    createEmptyAutopostingForm,
    formToCreateAutopostingRequest,
    formToCreateCategoryRequest,
    formToUpdateAutopostingRequest,
    formToUpdateCategoryRequest,
    jsonToForm,
    validateAutopostingForm
} from '../../../entities/autoposting';

import {
    type DataTableAction,
    type DataTableColumn,
    Button,
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


interface AutopostingsTableProps {
    organizationId: number;
}

// Комбинированный тип для работы с автопостингом и его категорией
interface AutopostingWithCategory {
    autoposting: Autoposting;
    category: AutopostingCategory;
}

export const AutopostingsTable = (
    {
        organizationId
    }: AutopostingsTableProps
) => {
    const loadAutopostings = useCallback(
        () => autopostingApi.getByOrganization(organizationId),
        [organizationId]
    );

    const autopostingList = useEntityList<Autoposting>({
        loadFn: loadAutopostings,
    });

    const autopostingForm = useEntityForm<AutopostingFormData, AutopostingWithCategory>({
        initialData: createEmptyAutopostingForm(),
        transformEntityToForm: (entity: AutopostingWithCategory) =>
            autopostingToForm(entity.autoposting, entity.category),
        validateFn: validateAutopostingForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                // Создаём сначала категорию, потом автопостинг
                const categoryRequest = formToCreateCategoryRequest(data, organizationId);
                const categoryResponse = await autopostingCategoryApi.create(categoryRequest);

                if (!categoryResponse.autoposting_category_id) {
                    throw new Error('Failed to create autoposting category');
                }

                const autopostingRequest = formToCreateAutopostingRequest(
                    data,
                    organizationId,
                    categoryResponse.autoposting_category_id
                );
                await autopostingApi.create(autopostingRequest);
                notification.success('Автопостинг успешно создан');
            } else {
                if (!selectedAutoposting) throw new Error('No autoposting selected');

                // Обновляем обе сущности
                const categoryRequest = formToUpdateCategoryRequest(data);
                await autopostingCategoryApi.update(
                    selectedAutoposting.autoposting.autoposting_category_id,
                    categoryRequest
                );

                const autopostingRequest = formToUpdateAutopostingRequest(data);
                await autopostingApi.update(selectedAutoposting.autoposting.id, autopostingRequest);
                notification.success('Автопостинг успешно обновлён');
            }
            await autopostingList.refresh();
            addModal.close();
            editModal.close();
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();
    const editModal = useModal();
    const detailsModal = useModal();

    const [selectedAutoposting, setSelectedAutoposting] = useState<AutopostingWithCategory | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleOpenAddModal = () => {
        autopostingForm.switchToCreate();
        addModal.open();
    };

    const loadAutopostingWithCategory = async (autoposting: Autoposting): Promise<AutopostingWithCategory> => {
        const category = await autopostingCategoryApi.getById(autoposting.autoposting_category_id);
        return {autoposting, category};
    };

    const handleEdit = async (autoposting: Autoposting) => {
        setLoadingDetails(true);
        try {
            const data = await loadAutopostingWithCategory(autoposting);
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
            const data = await loadAutopostingWithCategory(autoposting);
            setSelectedAutoposting(data);
            autopostingForm.setFormData(autopostingToForm(data.autoposting, data.category));
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
            message: `Вы уверены, что хотите ${newEnabledState ? 'включить' : 'выключить'} автопостинг?`,
            type: 'warning',
            confirmText: newEnabledState ? 'Включить' : 'Выключить',
            onConfirm: async () => {
                try {
                    await autopostingApi.update(autoposting.id, {enabled: newEnabledState});
                    notification.success(
                        `Автопостинг успешно ${newEnabledState ? 'включён' : 'выключен'}`
                    );
                    await autopostingList.refresh();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await autopostingForm.submit();
        if (!success && autopostingForm.error) {
            notification.error(autopostingForm.error);
        }
    };

    const columns: DataTableColumn<Autoposting>[] = [
        {
            header: 'ID',
            key: 'id',
        },
        {
            header: 'Период (часы)',
            render: (autoposting) => <span>{autoposting.period_in_hours}</span>,
        },
        {
            header: 'Статус',
            render: (autoposting) => (
                <span style={{
                    color: autoposting.enabled ? '#22c55e' : '#ef4444',
                    fontWeight: 'bold'
                }}>
                    {autoposting.enabled ? 'Включён' : 'Выключен'}
                </span>
            ),
        },
        {
            header: 'Модерация',
            render: (autoposting) => (
                <span>{autoposting.required_moderation ? 'Да' : 'Нет'}</span>
            ),
        },
        {
            header: 'Дата создания',
            render: (autoposting) => (
                <span>{new Date(autoposting.created_at).toLocaleDateString('ru-RU')}</span>
            ),
        },
    ];

    const actions: DataTableAction<Autoposting>[] = [
        {
            label: 'Редактировать',
            onClick: handleEdit,
        },
        {
            label: '',
            onClick: handleToggleEnabled,
            render: (autoposting) => (
                <Button
                    size="small"
                    variant={autoposting.enabled ? 'secondary' : 'primary'}
                    onClick={() => handleToggleEnabled(autoposting)}
                >
                    {autoposting.enabled ? 'Выключить' : 'Включить'}
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

            <DataTable<Autoposting>
                title="Автопостинг"
                data={autopostingList.entities}
                columns={columns}
                actions={actions}
                loading={autopostingList.loading || loadingDetails}
                error={autopostingList.error}
                emptyMessage="Автопостинги не найдены"
                onAdd={handleOpenAddModal}
                addButtonLabel="Добавить автопостинг"
                getRowKey={(autoposting) => autoposting.id}
                onRowClick={handleOpenDetails}
            />

            <FormBuilder<AutopostingFormData>
                title="Добавить автопостинг"
                sections={autopostingFormSections}
                values={autopostingForm.formData}
                isSubmitting={autopostingForm.isSubmitting}
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={handleSubmit}
                jsonToForm={jsonToForm}
                setFormData={autopostingForm.setFormData}
            />

            <FormBuilder<AutopostingFormData>
                title="Редактирование автопостинга"
                sections={autopostingFormSections}
                values={autopostingForm.formData}
                isSubmitting={autopostingForm.isSubmitting}
                isOpen={editModal.isOpen}
                onClose={editModal.close}
                onSubmit={handleSubmit}
                jsonToForm={jsonToForm}
                setFormData={autopostingForm.setFormData}
            />

            <DetailsViewer<AutopostingFormData>
                title="Просмотр автопостинга"
                organizationId={organizationId}
                sections={autopostingDetailsSections}
                values={autopostingForm.formData}
                isOpen={detailsModal.isOpen}
                onClose={detailsModal.close}
            />
        </>
    );
};
