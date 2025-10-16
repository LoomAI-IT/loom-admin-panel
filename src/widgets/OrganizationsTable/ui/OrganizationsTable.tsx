import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Organization,
    type OrganizationFormData,
    organizationFormSections,
    jsonToOrganizationForm,
} from '../../../entities/organization';

import {
    type DataTableAction,
    type DataTableColumn,
    DataTable,
    FormBuilder,
} from '../../../shared/ui';

import {useOrganizationsController} from '../lib/useOrganizationsController';


export const OrganizationsTable = () => {
    const controller = useOrganizationsController();

    const columns: DataTableColumn<Organization>[] = [
        {
            header: 'ID',
            key: 'id',
        },
        {
            header: 'Название',
            render: (organization) => <span>{organization.name}</span>,
        },
        {
            header: 'Баланс (руб)',
            render: (organization) => <span>{organization.rub_balance}</span>,
        },
        {
            header: 'Дата создания',
            render: (organization) => (
                <span>{new Date(organization.created_at).toLocaleDateString('ru-RU')}</span>
            ),
        },
    ];

    const actions: DataTableAction<Organization>[] = [
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

            <DataTable<Organization>
                title="Организации"
                data={controller.organizations}
                columns={columns}
                actions={actions}
                loading={controller.loading}
                error={controller.error}
                emptyMessage="Организации не найдены"
                onAdd={controller.handleOpenAddModal}
                addButtonLabel="Добавить организацию"
                getRowKey={(organization) => organization.id}
                onRowClick={controller.handleOpenDetails}
            />

            <FormBuilder<OrganizationFormData>
                title="Добавить организацию"
                sections={organizationFormSections}
                values={controller.organizationForm.formData}
                isSubmitting={controller.organizationForm.isSubmitting}
                isOpen={controller.addModal.isOpen}
                onClose={controller.addModal.close}
                onSubmit={controller.handleSubmit}
                jsonToForm={(jsonData) => jsonToOrganizationForm(jsonData, null)}
                setFormData={controller.organizationForm.setFormData}
            />
        </>
    );
};
