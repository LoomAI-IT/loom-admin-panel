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
                <th>Модерация автопостинга</th>
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
                  <td>
                    <span className={`status ${org.autoposting_moderation ? 'enabled' : 'disabled'}`}>
                      {org.autoposting_moderation ? 'Включена' : 'Выключена'}
                    </span>
                  </td>
                  <td>{new Date(org.created_at).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
