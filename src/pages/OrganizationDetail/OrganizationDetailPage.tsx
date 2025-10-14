import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {CategoriesTable} from '../../widgets/CategoriesTable';
import {
    type CostMultiplier,
    createEmptyOrganizationForm,
    formToUpdateCostMultiplierRequest,
    formToUpdateOrganizationRequest,
    jsonToOrganizationForm,
    type Organization,
    organizationApi,
    organizationDetailsSections,
    type OrganizationFormData,
    organizationFormSections,
    organizationToForm,
    validateOrganizationForm
} from '../../entities/organization';
import {DetailsViewer, FormBuilder,} from '../../shared/ui';
import {useEntityForm, useModal, useNotification} from '../../shared/lib/hooks';
import {NotificationContainer} from '../../features/notification';

export const OrganizationDetailPage = () => {
    const {organizationId} = useParams<{ organizationId: string }>();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const notification = useNotification();
    const detailsModal = useModal();
    const editModal = useModal();

    const loadOrganization = useCallback(async () => {
        if (!organizationId) {
            setError('ID организации не указан');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const [org, cost] = await Promise.all([
                organizationApi.getById(Number(organizationId)),
                organizationApi.getCostMultiplier(Number(organizationId)),
            ]);
            setOrganization(org);
            setCostMultiplier(cost);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке организации');
            console.error('Failed to load organization:', err);
        } finally {
            setLoading(false);
        }
    }, [organizationId]);

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        transformEntityToForm: (org) => organizationToForm(org, costMultiplier),
        validateFn: validateOrganizationForm,
        onSubmit: async (data) => {
            if (!organization) throw new Error('No organization');

            const updateRequest = formToUpdateOrganizationRequest(data, organization.id);
            await organizationApi.update(updateRequest);

            const costRequest = formToUpdateCostMultiplierRequest(data, organization.id);
            await organizationApi.updateCostMultiplier(costRequest);

            notification.success('Организация успешно обновлена');
            await loadOrganization();
            editModal.close();
        },
    });

    useEffect(() => {
        loadOrganization();
    }, [loadOrganization]);

    useEffect(() => {
        if (organization && costMultiplier) {
            organizationForm.setFormData(organizationToForm(organization, costMultiplier));
        }
    }, [organization, costMultiplier]);

    const handleShowDetails = () => {
        if (organization) {
            organizationForm.setFormData(organizationToForm(organization, costMultiplier));
            detailsModal.open();
        }
    };

    const handleEditOrganization = () => {
        if (organization) {
            organizationForm.switchToEdit(organization, (org) => organizationToForm(org, costMultiplier));
            editModal.open();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    if (loading) {
        return (
            <div>
                <div>
                    <div>Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div>
                <div>
                    <div>{error || 'Организация не найдена'}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
            />

            <div>
                <div>
                    <div>
                        <button onClick={handleShowDetails}>
                            Детали организации
                        </button>
                        <button onClick={handleEditOrganization}>
                            Редактировать организацию
                        </button>
                    </div>

                    <CategoriesTable organizationId={organization.id}/>
                </div>
            </div>

            <DetailsViewer<OrganizationFormData>
                title="Просмотр организации"
                organizationId={organization.id}
                sections={organizationDetailsSections}
                values={organizationForm.formData}
                isOpen={detailsModal.isOpen}
                onClose={detailsModal.close}
            />

            <FormBuilder<OrganizationFormData>
                title="Редактирование организации"
                sections={organizationFormSections}
                values={organizationForm.formData}
                isSubmitting={organizationForm.isSubmitting}
                isOpen={editModal.isOpen}
                onClose={editModal.close}
                onSubmit={handleSubmit}
                jsonToForm={(jsonData) => jsonToOrganizationForm(jsonData, costMultiplier)}
                setFormData={organizationForm.setFormData}
            />
        </>
    );
};
