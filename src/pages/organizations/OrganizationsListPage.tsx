import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationApi } from '../../shared/api';
import type { Organization } from '../../shared/types';
import './OrganizationsListPage.css';

export const OrganizationsListPage = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [creating, setCreating] = useState(false);

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

  const handleOrganizationClick = (organizationId: number) => {
    navigate(`/organizations/${organizationId}`);
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      setCreating(true);
      await organizationApi.create({ name: newOrgName.trim() });
      setShowCreateModal(false);
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
        <button onClick={loadOrganizations}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="organizations-list-page">
      <div className="page-header">
        <h1>Организации</h1>
        <button className="create-button" onClick={() => setShowCreateModal(true)}>
          Создать организацию
        </button>
      </div>

      <div className="organizations-table-container">
        {organizations.length === 0 ? (
          <div className="empty-state">
            <p>Организации не найдены</p>
          </div>
        ) : (
          <table className="organizations-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Баланс (₽)</th>
                <th>Дата создания</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr
                  key={org.id}
                  onClick={() => handleOrganizationClick(org.id)}
                  className="clickable-row"
                >
                  <td>{org.id}</td>
                  <td>{org.name}</td>
                  <td>{parseFloat(org.rub_balance).toFixed(2)}</td>
                  <td>{new Date(org.created_at).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Создать организацию</h2>
            <form onSubmit={handleCreateOrganization}>
              <div className="form-group">
                <label htmlFor="org-name">Название организации</label>
                <input
                  id="org-name"
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Введите название"
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={creating || !newOrgName.trim()}
                >
                  {creating ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
