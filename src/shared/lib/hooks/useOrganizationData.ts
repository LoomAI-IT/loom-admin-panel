import {useEffect, useState} from 'react';
import {type CostMultiplier, type Organization, organizationApi} from '../../../entities/organization';

interface UseOrganizationDataReturn {
    organization: Organization | null;
    costMultiplier: CostMultiplier | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
}


export const useOrganizationData = (organizationId: number | undefined): UseOrganizationDataReturn => {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    useEffect(() => {
        if (!organizationId) {
            setLoading(false);
            setError('Ошибка');
            return;
        }

        const loadOrganization = async () => {
            try {
                setLoading(true);
                setError(null);
                const [orgData, costMultiplierData] = await Promise.all([
                    organizationApi.getById(organizationId),
                    organizationApi.getCostMultiplier(organizationId),
                ]);
                setOrganization(orgData);
                setCostMultiplier(costMultiplierData);
            } catch (err) {
                setError('Ошибка');
                console.error('Failed to load organization:', err);
            } finally {
                setLoading(false);
            }
        };

        loadOrganization();
    }, [organizationId, reloadTrigger]);

    const reload = () => {
        setReloadTrigger(prev => prev + 1);
    };

    return {
        organization,
        costMultiplier,
        loading,
        error,
        reload,
    };
};
