import {useCallback} from 'react';
import {
    type Organization,
    type CreateOrganizationRequest,
    type UpdateOrganizationRequest,
    type UpdateCostMultiplierRequest,
    organizationApi,
} from '../../../entities/organization';
import {useEntityList} from '../../../shared/lib/hooks';

export const useOrganizationsModel = () => {
    const loadOrganizations = useCallback(async () => {
        const response = await organizationApi.getAll();
        return response.organizations;
    }, []);

    const organizationList = useEntityList<Organization>({
        loadFn: loadOrganizations,
    });

    const createOrganization = async (request: CreateOrganizationRequest) => {
        const createResponse = await organizationApi.create(request);
        return createResponse.organization_id;
    };

    const updateOrganization = async (request: UpdateOrganizationRequest) => {
        await organizationApi.update(request);
    };

    const updateCostMultiplier = async (request: UpdateCostMultiplierRequest) => {
        await organizationApi.updateCostMultiplier(request);
    };

    const deleteOrganization = async (organizationId: number) => {
        await organizationApi.delete(organizationId);
    };

    return {
        // State
        organizations: organizationList.entities,
        loading: organizationList.loading,
        error: organizationList.error,

        // Actions
        refresh: organizationList.refresh,
        createOrganization,
        updateOrganization,
        updateCostMultiplier,
        deleteOrganization,
    };
};
