import {type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    type Organization,
    type OrganizationFormData,
    organizationToForm,
    createEmptyOrganizationForm,
    validateOrganizationForm,
    formToCreateOrganizationRequest,
    formToUpdateOrganizationRequest,
    formToUpdateCostMultiplierRequest,
} from '../../../entities/organization';
import {
    useConfirmDialog,
    useEntityForm,
    useModal,
    useNotification,
} from '../../../shared/lib/hooks';
import {useOrganizationsModel} from '../model/useOrganizationsModel';

export const useOrganizationsController = () => {
    const navigate = useNavigate();
    const model = useOrganizationsModel();

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        transformEntityToForm: (org) => organizationToForm(org, null),
        validateFn: validateOrganizationForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                // Сначала создаем организацию с минимальными данными
                const createRequest = formToCreateOrganizationRequest(data);
                const orgId = await model.createOrganization(createRequest);

                // Затем сразу обновляем её с полными данными
                const updateRequest = formToUpdateOrganizationRequest(data, orgId);
                await model.updateOrganization(updateRequest);

                // И обновляем cost multipliers
                const costRequest = formToUpdateCostMultiplierRequest(data, orgId);
                await model.updateCostMultiplier(costRequest);

                notification.success('Организация успешно создана');
                await model.refresh();
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

    const handleSubmit = async (e: FormEvent) => {
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
                    await model.deleteOrganization(organization.id);
                    notification.success('Организация успешно удалена');
                    await model.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении организации');
                    console.error('Failed to delete organization:', err);
                }
            },
        });
    };

    return {
        // Data from model
        organizations: model.organizations,
        loading: model.loading,
        error: model.error,

        // Form state
        organizationForm,

        // Modal state
        addModal,

        // Notification state
        notification,

        // Confirm dialog state
        confirmDialog,

        // Handlers
        handleOpenAddModal,
        handleSubmit,
        handleOpenDetails,
        handleDelete,
    };
};
