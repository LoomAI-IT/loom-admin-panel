import * as React from 'react';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Category,
    type CategoryFormData,
    categoryDetailsSections,
    categoryFormSections,
    jsonToCategoryForm,
} from '../../../entities/category';

import {
    type DataTableAction,
    type DataTableColumn,
    DataTable,
    DetailsViewer,
    FormBuilder,
} from '../../../shared/ui';

import {useCategoriesController} from '../lib/useCategoriesController';

interface CategoriesTableProps {
    organizationId: number;
}

export const CategoriesTable = ({
    organizationId,
}: CategoriesTableProps) => {
    const controller = useCategoriesController({organizationId});

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
                <span>
                    {new Date(category.created_at).toLocaleDateString('ru-RU')}
                </span>
            ),
        },
    ];

    const actions: DataTableAction<Category>[] = [
        {
            label: 'Редактировать',
            onClick: controller.handleEdit,
        },
        {
            label: 'Удалить',
            onClick: controller.handleDelete,
            variant: 'danger',
        },
    ];

    return (
        <>
            <NotificationContainer
                notifications={controller.notification.notifications}
                onRemove={controller.notification.remove}
            />

            <ConfirmDialog
                dialog={controller.confirmDialog.dialog}
                isProcessing={controller.confirmDialog.isProcessing}
                onConfirm={controller.confirmDialog.handleConfirm}
                onCancel={controller.confirmDialog.handleCancel}
            />

            <DataTable<Category>
                title="Рубрики"
                data={controller.categories}
                columns={columns}
                actions={actions}
                loading={controller.loading}
                error={controller.error}
                emptyMessage="Рубрики не найдены"
                onAdd={controller.handleOpenAddModal}
                addButtonLabel="Добавить рубрику"
                getRowKey={(category) => category.id}
                onRowClick={controller.handleOpenDetails}
            />

            <FormBuilder<CategoryFormData>
                title="Добавить рубрику"
                sections={categoryFormSections}
                values={controller.categoryForm.formData}
                isSubmitting={controller.categoryForm.isSubmitting}
                isOpen={controller.addModal.isOpen}
                onClose={controller.addModal.close}
                onSubmit={controller.handleSubmit}
                jsonToForm={jsonToCategoryForm}
                setFormData={controller.categoryForm.setFormData}
            />

            <FormBuilder<CategoryFormData>
                title="Редактирование рубрики"
                sections={categoryFormSections}
                values={controller.categoryForm.formData}
                isSubmitting={controller.categoryForm.isSubmitting}
                isOpen={controller.editModal.isOpen}
                onClose={controller.editModal.close}
                onSubmit={controller.handleSubmit}
                jsonToForm={jsonToCategoryForm}
                setFormData={controller.categoryForm.setFormData}
            />

            <DetailsViewer<CategoryFormData>
                title="Просмотр рубрики"
                organizationId={controller.organizationId}
                sections={categoryDetailsSections}
                values={controller.categoryForm.formData}
                isOpen={controller.detailsModal.isOpen}
                onClose={controller.detailsModal.close}
            />
        </>
    );
};
