import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationApi, type Organization } from '../../entities/organization';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../../shared/ui/Table';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { Input } from '../../shared/ui/Input';
import { useModal } from '../../shared/lib/hooks';
import './OrganizationsListPage.css';

export const OrganizationsListPage = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrgName, setNewOrgName] = useState('');
  const [creating, setCreating] = useState(false);

  const createModal = useModal();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationApi.getAll();
      setOrganizations(response.organizations);
    } catch (err) {
      setError('Ошибка загрузки организаций');
      console.error('Failed to load organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      setCreating(true);
      await organizationApi.create({ name: newOrgName.trim() });
      createModal.close();
      setNewOrgName('');
      await loadOrganizations();
    } catch (err) {
      console.error('Failed to create organization:', err);
      alert('Ошибка создания организации');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="organizations-list-page loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="organizations-list-page error">
        <p>{error}</p>
        <Button onClick={loadOrganizations}>Повторить</Button>
      </div>
    );
  }

  return (
    <div className="organizations-list-page">
      <div className="page-header">
        <h1>Организации</h1>
        <Button onClick={createModal.open}>Создать организацию</Button>
      </div>

      <div className="organizations-table-container">
        {organizations.length === 0 ? (
          <div className="empty-state">
            <p>Организации не найдены</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>Название</TableCell>
                <TableCell header>Баланс (₽)</TableCell>
                <TableCell header>Дата создания</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow
                  key={org.id}
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  <TableCell>{org.id}</TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{parseFloat(org.rub_balance).toFixed(2)}</TableCell>
                  <TableCell>{new Date(org.created_at).toLocaleString('ru-RU')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Создать организацию">
        <form onSubmit={handleCreateOrganization}>
          <Input
            label="Название организации"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Введите название"
            autoFocus
            required
          />
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={createModal.close}
              disabled={creating}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={creating || !newOrgName.trim()}>
              {creating ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
