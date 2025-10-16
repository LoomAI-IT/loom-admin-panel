import {useCallback} from 'react';
import {type Organization, organizationApi} from '../../../entities/organization';
import {useEntityList} from '../../../shared/lib/hooks';

export const useOrganizationsModel = () => {
    const loadOrganizations = useCallback(async () => {
        const response = await organizationApi.getAll();
        return response.organizations;
    }, []);

    const organizationList = useEntityList<Organization>({
        loadFn: loadOrganizations,
    });

    const createOrganization = async (createRequest: any) => {
        const createResponse = await organizationApi.create(createRequest);
        return createResponse.organization_id;
    };

    const updateOrganization = async (request: any) => {
        await organizationApi.update(request);
    };

    const updateCostMultiplier = async (request: any) => {
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
