import * as React from 'react';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type Organization,
    type OrganizationFormData,
    organizationApi,
    organizationFormSections,
    organizationToForm,
    jsonToOrganizationForm,
    validateOrganizationForm,
    createEmptyOrganizationForm,
    formToCreateOrganizationRequest,
    formToUpdateCostMultiplierRequest,
    formToUpdateOrganizationRequest
} from '../../../entities/organization';

import {
    type DataTableAction,
    type DataTableColumn,
    DataTable,
    FormBuilder,
} from '../../../shared/ui';

import {
    useConfirmDialog,
    useEntityForm,
    useEntityList,
    useModal,
    useNotification
} from '../../../shared/lib/hooks';


export const OrganizationsTable = () => {
    const navigate = useNavigate();

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

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        transformEntityToForm: (org) => organizationToForm(org, null),
        validateFn: validateOrganizationForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                // Сначала создаем организацию с минимальными данными
                const createRequest = formToCreateOrganizationRequest(data);
                const createResponse = await organizationApi.create(createRequest);
                const orgId = createResponse.organization_id;

                // Затем сразу обновляем её с полными данными
                const updateRequest = formToUpdateOrganizationRequest(data, orgId);
                await organizationApi.update(updateRequest);

                // И обновляем cost multipliers
                const costRequest = formToUpdateCostMultiplierRequest(data, orgId);
                await organizationApi.updateCostMultiplier(costRequest);

                notification.success('Организация успешно создана');
                await organizationList.refresh();
                addModal.close();
            } else {
                // Режим редактирования пока не реализован
                notification.error('Редактирование пока не поддерживается');
            }
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();

    const handleOpenAddModal = () => {
        organizationForm.switchToCreate();
        addModal.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    const handleOpenDetails = (organization: Organization) => {
        navigate(`/organizations/${organization.id}`);
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
                onRowClick={handleOpenDetails}
            />

            <FormBuilder<OrganizationFormData>
                title="Добавить организацию"
                sections={organizationFormSections}
                values={organizationForm.formData}
                isSubmitting={organizationForm.isSubmitting}
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={handleSubmit}
                jsonToForm={(jsonData) => jsonToOrganizationForm(jsonData, null)}
                setFormData={organizationForm.setFormData}
            />
        </>
    );
};
