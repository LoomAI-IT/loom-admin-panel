import {useEffect, type FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    type Organization,
    type OrganizationFormData,
    organizationToForm,
    createEmptyOrganizationForm,
    validateOrganizationForm,
    formToUpdateOrganizationRequest,
    formToUpdateCostMultiplierRequest,
} from '../../../entities/organization';
import {
    useEntityForm,
    useModal,
    useNotification,
    useConfirmDialog,
} from '../../../shared/lib/hooks';
import {useOrganizationModel} from '../model/useOrganizationModel';

interface UseOrganizationControllerProps {
    organizationId: number;
}

export const useOrganizationController = ({
    organizationId,
}: UseOrganizationControllerProps) => {
    const navigate = useNavigate();
    const model = useOrganizationModel({organizationId});

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        validateFn: validateOrganizationForm,
        transformEntityToForm: (org) => organizationToForm(org, model.costMultiplier),
        onSubmit: async (data) => {
            if (!model.organization) throw new Error('No organization');

            const updateRequest = formToUpdateOrganizationRequest(data, model.organization.id);
            await model.updateOrganization(updateRequest);

            const costRequest = formToUpdateCostMultiplierRequest(data, model.organization.id);
            await model.updateCostMultiplier(costRequest);

            notification.success('Организация успешно обновлена');
            await model.refresh();
            editModal.close();
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const detailsModal = useModal();
    const editModal = useModal();

    // Update form data when organization or costMultiplier changes
    useEffect(() => {
        if (model.organization && model.costMultiplier) {
            organizationForm.setFormData(organizationToForm(model.organization, model.costMultiplier));
        }
    }, [model.organization, model.costMultiplier]);

    const handleBackToOrganizations = () => {
        navigate('/organizations');
    };

    const handleShowDetails = () => {
        if (model.organization) {
            organizationForm.setFormData(organizationToForm(model.organization, model.costMultiplier));
            detailsModal.open();
        }
    };

    const handleEditOrganization = () => {
        if (model.organization) {
            organizationForm.switchToEdit(model.organization, (org) => organizationToForm(org, model.costMultiplier));
            editModal.open();
        }
    };

    const handleDeleteOrganization = () => {
        if (!model.organization) return;

        confirmDialog.confirm({
            title: 'Удалить организацию',
            message: `Вы уверены, что хотите удалить организацию "${model.organization.name}"? Это действие необратимо. Все данные организации будут удалены.`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    if (!model.organization) return;
                    await model.deleteOrganization(model.organization.id);
                    notification.success('Организация успешно удалена');
                    navigate('/organizations');
                } catch (err) {
                    notification.error('Ошибка при удалении организации');
                    console.error('Failed to delete organization:', err);
                }
            },
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    return {
        // Data from model
        organization: model.organization,
        costMultiplier: model.costMultiplier,
        loading: model.loading,
        error: model.error,

        // Form state
        organizationForm,

        // Modal state
        detailsModal,
        editModal,

        // Notification state
        notification,

        // Confirm dialog state
        confirmDialog,

        // Handlers
        handleBackToOrganizations,
        handleShowDetails,
        handleEditOrganization,
        handleDeleteOrganization,
        handleSubmit,
    };
};
