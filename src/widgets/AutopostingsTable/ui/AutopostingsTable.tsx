import * as React from 'react';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Autoposting,
    type AutopostingFormData,
    autopostingDetailsSections,
    autopostingFormSections,
    jsonToForm,
} from '../../../entities/autoposting';

import {
    type DataTableAction,
    type DataTableColumn,
    Button,
    DataTable,
    DetailsViewer,
    FormBuilder,
} from '../../../shared/ui';

import {useAutopostingsController} from '../lib/useAutopostingsController';

interface AutopostingsTableProps {
    organizationId: number;
}

export const AutopostingsTable = ({
    organizationId,
}: AutopostingsTableProps) => {
    const controller = useAutopostingsController({organizationId});

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
                <span
                    style={{
                        color: autoposting.enabled ? '#22c55e' : '#ef4444',
                        fontWeight: 'bold',
                    }}
                >
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
                <span>
                    {new Date(autoposting.created_at).toLocaleDateString('ru-RU')}
                </span>
            ),
        },
    ];

    const actions: DataTableAction<Autoposting>[] = [
        {
            label: 'Редактировать',
            onClick: controller.handleEdit,
        },
        {
            label: '',
            onClick: controller.handleToggleEnabled,
            render: (autoposting) => (
                <Button
                    size="small"
                    variant={autoposting.enabled ? 'secondary' : 'primary'}
                    onClick={() => controller.handleToggleEnabled(autoposting)}
                >
                    {autoposting.enabled ? 'Выключить' : 'Включить'}
                </Button>
            ),
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

            <DataTable<Autoposting>
                title="Автопостинг"
                data={controller.autopostings}
                columns={columns}
                actions={actions}
                loading={controller.loading}
                error={controller.error}
                emptyMessage="Автопостинги не найдены"
                onAdd={controller.handleOpenAddModal}
                addButtonLabel="Добавить автопостинг"
                getRowKey={(autoposting) => autoposting.id}
                onRowClick={controller.handleOpenDetails}
            />

            <FormBuilder<AutopostingFormData>
                title="Добавить автопостинг"
                sections={autopostingFormSections}
                values={controller.autopostingForm.formData}
                isSubmitting={controller.autopostingForm.isSubmitting}
                isOpen={controller.addModal.isOpen}
                onClose={controller.addModal.close}
                onSubmit={controller.handleSubmit}
                jsonToForm={jsonToForm}
                setFormData={controller.autopostingForm.setFormData}
            />

            <FormBuilder<AutopostingFormData>
                title="Редактирование автопостинга"
                sections={autopostingFormSections}
                values={controller.autopostingForm.formData}
                isSubmitting={controller.autopostingForm.isSubmitting}
                isOpen={controller.editModal.isOpen}
                onClose={controller.editModal.close}
                onSubmit={controller.handleSubmit}
                jsonToForm={jsonToForm}
                setFormData={controller.autopostingForm.setFormData}
            />

            <DetailsViewer<AutopostingFormData>
                title="Просмотр автопостинга"
                organizationId={controller.organizationId}
                sections={autopostingDetailsSections}
                values={controller.autopostingForm.formData}
                isOpen={controller.detailsModal.isOpen}
                onClose={controller.detailsModal.close}
            />
        </>
    );
};
