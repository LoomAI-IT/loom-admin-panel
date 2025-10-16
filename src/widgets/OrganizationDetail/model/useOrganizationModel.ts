import {useCallback, useEffect, useState} from 'react';
import {type Organization, type CostMultiplier, organizationApi} from '../../../entities/organization';

interface UseOrganizationModelProps {
    organizationId: number;
}

export const useOrganizationModel = ({organizationId}: UseOrganizationModelProps) => {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrganization = useCallback(async () => {
        try {
            setLoading(true);
            const [org, cost] = await Promise.all([
                organizationApi.getById(organizationId),
                organizationApi.getCostMultiplier(organizationId),
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

    useEffect(() => {
        loadOrganization();
    }, [loadOrganization]);

    const updateOrganization = async (request: any) => {
        await organizationApi.update(request);
    };

    const updateCostMultiplier = async (request: any) => {
        await organizationApi.updateCostMultiplier(request);
    };

    const deleteOrganization = async (orgId: number) => {
        await organizationApi.delete(orgId);
    };

    return {
        // State
        organization,
        costMultiplier,
        loading,
        error,

        // Actions
        refresh: loadOrganization,
        updateOrganization,
        updateCostMultiplier,
        deleteOrganization,
    };
};
