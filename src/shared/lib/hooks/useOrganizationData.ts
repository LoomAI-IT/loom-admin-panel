/**
 * %C: 4;O 703@C7:8 40==KE >@30=870F88
 * !;54C5B ?@8=F8?C Single Responsibility - 2K=5A5=0 ;>38:0 703@C7:8 87 :><?>=5=B0
 */

import { useState, useEffect } from 'react';
import { organizationApi, type Organization, type CostMultiplier } from '../../../entities/organization';

interface UseOrganizationDataReturn {
  organization: Organization | null;
  costMultiplier: CostMultiplier | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * 03@C605B 40==K5 >@30=870F88 8 5Q cost multiplier
 */
export const useOrganizationData = (organizationId: number | undefined): UseOrganizationDataReturn => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      setError('ID >@30=870F88 =5 C:070=');
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
        setError('H81:0 703@C7:8 >@30=870F88');
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
