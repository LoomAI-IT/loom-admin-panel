import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationApi, type Organization, type CostMultiplier } from '../../entities/organization';
import { OrganizationForm } from '../../widgets/organization-form';
import { CategoriesSection } from '../../widgets/categories-section';
import { AutopostingSection } from '../../widgets/autoposting-section';
import { EmployeesSection } from '../../widgets/employees-section';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { useModal } from '../../shared/lib/hooks';
import './OrganizationDetailPage.css';

export const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const deleteModal = useModal();

  useEffect(() => {
    if (id) {
      loadOrganization(parseInt(id));
    }
  }, [id]);

  const loadOrganization = async (organizationId: number) => {
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
      setError('Ошибка загрузки организации');
      console.error('Failed to load organization:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!organization) return;

    try {
      setDeleting(true);
      await organizationApi.delete(organization.id);
      navigate('/organizations');
    } catch (err) {
      console.error('Failed to delete organization:', err);
      alert('Ошибка удаления организации');
      setDeleting(false);
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
        <Button variant="danger" onClick={deleteModal.open}>
          Удалить организацию
        </Button>
      </div>

      <div className="organization-content">
        <OrganizationForm
          organization={organization}
          costMultiplier={costMultiplier}
          onUpdate={() => loadOrganization(organization.id)}
        />

        <CategoriesSection organizationId={organization.id} />

        <AutopostingSection organizationId={organization.id} />

        <EmployeesSection organizationId={organization.id} />
      </div>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Удалить организацию">
        <div>
          <p>Вы уверены, что хотите удалить организацию <strong>{organization.name}</strong>?</p>
          <p>Это действие нельзя отменить.</p>
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={deleteModal.close}
              disabled={deleting}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteOrganization}
              disabled={deleting}
            >
              {deleting ? 'Удаление...' : 'Удалить'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
