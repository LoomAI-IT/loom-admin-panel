import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationApi, type Organization } from '../../entities/organization';
import { OrganizationForm } from '../../widgets/organization-form';
import { CategoriesSection } from '../../widgets/categories-section';
import { EmployeesSection } from '../../widgets/employees-section';
import { Button } from '../../shared/ui/Button';
import './OrganizationDetailPage.css';

export const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrganization(parseInt(id));
    }
  }, [id]);

  const loadOrganization = async (organizationId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationApi.getById(organizationId);
      setOrganization(response);
    } catch (err) {
      setError('Ошибка загрузки организации');
      console.error('Failed to load organization:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="organization-detail-page loading">Загрузка...</div>;
  }

  if (error || !organization) {
    return (
      <div className="organization-detail-page error">
        <p>{error || 'Организация не найдена'}</p>
        <Button onClick={() => navigate('/organizations')}>Вернуться к списку</Button>
      </div>
    );
  }

  return (
    <div className="organization-detail-page">
      <div className="page-header">
        <Button variant="secondary" onClick={() => navigate('/organizations')}>
          ← Назад к списку
        </Button>
        <h1>Организация #{organization.id} - {organization.name}</h1>
      </div>

      <div className="organization-content">
        <OrganizationForm
          organization={organization}
          onUpdate={() => loadOrganization(organization.id)}
        />

        <CategoriesSection organizationId={organization.id} />

        <EmployeesSection organizationId={organization.id} />
      </div>
    </div>
  );
};
