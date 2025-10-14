import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {type Organization, organizationApi} from '../../entities/organization';
import {Button, DebouncedInput, Modal, Table, TableBody, TableCell, TableHeader, TableRow} from '../../shared/ui';
import {useModal} from '../../shared/lib/hooks';

import './OrganizationsListPage.css';

export const OrganizationsListPage = () => {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newOrgName, setNewOrgName] = useState('');
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    const createModal = useModal();
    const deleteModal = useModal();
    const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

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
            await organizationApi.create({name: newOrgName.trim()});
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

    const handleDeleteClick = (org: Organization, e: React.MouseEvent) => {
        e.stopPropagation();
        setOrgToDelete(org);
        deleteModal.open();
    };

    const handleDeleteOrganization = async () => {
        if (!orgToDelete) return;

        try {
            setDeleting(orgToDelete.id);
            await organizationApi.delete(orgToDelete.id);
            deleteModal.close();
            setOrgToDelete(null);
            await loadOrganizations();
        } catch (err) {
            console.error('Failed to delete organization:', err);
            alert('Ошибка удаления организации');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <Button onClick={loadOrganizations}>Повторить</Button>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>Организации</h1>
                <Button onClick={createModal.open}>Создать организацию</Button>
            </div>

            <div>
                {organizations.length === 0 ? (
                    <div>
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
                                <TableCell header>Действия</TableCell>
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
                                    <TableCell>
                                        <Button
                                            variant="danger"
                                            size="small"
                                            onClick={(e) => handleDeleteClick(org, e)}
                                            disabled={deleting === org.id}
                                        >
                                            {deleting === org.id ? 'Удаление...' : 'Удалить'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Создать организацию">
                <form onSubmit={handleCreateOrganization}>
                    <DebouncedInput
                        label="Название организации"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        placeholder="Введите название"
                        autoFocus
                        required
                        debounceDelay={300}
                    />
                    <div>
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

            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Удалить организацию">
                <div>
                    <p>Вы уверены, что хотите удалить организацию <strong>{orgToDelete?.name}</strong>?</p>
                    <p>Это действие нельзя отменить.</p>
                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={deleteModal.close}
                            disabled={deleting !== null}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteOrganization}
                            disabled={deleting !== null}
                        >
                            {deleting !== null ? 'Удаление...' : 'Удалить'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
