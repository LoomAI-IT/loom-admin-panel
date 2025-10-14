import * as React from 'react';
import {useCallback} from 'react';
import {
    type Organization,
    organizationApi,
    type OrganizationFormData,
    organizationToForm,
    validateOrganizationForm,
} from '../../../entities/organization';
import {DataTable, type DataTableAction, type DataTableColumn,} from '../../../shared/ui';
import {useConfirmDialog, useEntityForm, useEntityList, useModal, useNotification} from '../../../shared/lib/hooks';
import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

export const OrganizationsTable = () => {
    const loadOrganizations = useCallback(
        async () => {
            const response = await organizationApi.getAll();
            return response.organizations;
        },
        []
    );

    const organizationList = useEntityList<Organization>({
        loadFn: loadOrganizations,
    });

    const createEmptyOrganizationForm = (): OrganizationFormData => ({
        name: '',
        video_cut_description_end_sample: '',
        publication_text_end_sample: '',
        tone_of_voice: [],
        brand_rules: [],
        compliance_rules: [],
        audience_insights: [],
        products: [],
        locale: {},
        additional_info: [],
        generate_text_cost_multiplier: 1,
        generate_image_cost_multiplier: 1,
        generate_vizard_video_cut_cost_multiplier: 1,
        transcribe_audio_cost_multiplier: 1,
    });

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        transformEntityToForm: (org) => organizationToForm(org, null),
        validateFn: validateOrganizationForm,
        onSubmit: async (data, _) => {
            await organizationApi.create({name: data.name});
            notification.success('Организация успешно создана');
            await organizationList.refresh();
            addModal.close();
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();

    const handleOpenAddModal = () => {
        organizationForm.switchToCreate();
        addModal.open();
    };

    const handleDelete = (organization: Organization) => {
        confirmDialog.confirm({
            title: 'Удалить организацию',
            message: `Вы уверены, что хотите удалить организацию "${organization.name}"?`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await organizationApi.delete(organization.id);
                    notification.success('Организация успешно удалена');
                    await organizationList.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении организации');
                    console.error('Failed to delete organization:', err);
                }
            },
        });
    };

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

            <DataTable<Organization>
                title="Организации"
                data={organizationList.entities}
                columns={columns}
                actions={actions}
                loading={organizationList.loading}
                error={organizationList.error}
                emptyMessage="Организации не найдены"
                onAdd={handleOpenAddModal}
                addButtonLabel="Добавить организацию"
                getRowKey={(organization) => organization.id}
            />
        </>
    );
};
