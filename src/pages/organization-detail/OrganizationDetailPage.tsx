import {useNavigate, useParams} from 'react-router-dom';
import {organizationApi} from '../../entities/organization';
import {CategoriesTable} from '../../widgets/category-table';
import {Button} from '../../shared/ui';
import {useConfirmDialog, useNotification, useOrganizationData,} from '../../shared/lib/hooks';
import {NotificationContainer} from '../../features/notification';
import {ConfirmDialog} from '../../features/confirmation-dialog';
import './OrganizationDetailPage.css';

export const OrganizationDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    // Загрузка данных организации через хук
    const {organization, costMultiplier, loading, error, reload} = useOrganizationData(
        id ? parseInt(id) : undefined
    );

    // Удаление организации
    const handleDeleteOrganization = () => {
        if (!organization) return;

        confirmDialog.confirm({
            title: 'Удалить организацию',
            message: `Вы уверены, что хотите удалить организацию "${organization.name}"? Это действие нельзя отменить.`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await organizationApi.delete(organization.id);
                    notification.success('Организация успешно удалена');
                    navigate('/organizations');
                } catch (err) {
                    notification.error('Ошибка удаления организации');
                    console.error('Failed to delete organization:', err);
                }
            },
        });
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
        <>
            {/* Контейнер уведомлений */}
            <NotificationContainer notifications={notification.notifications} onRemove={notification.remove}/>

            {/* Диалог подтверждения */}
            <ConfirmDialog
                dialog={confirmDialog.dialog}
                isProcessing={confirmDialog.isProcessing}
                onConfirm={confirmDialog.handleConfirm}
                onCancel={confirmDialog.handleCancel}
            />

            <div className="organization-detail-page">
                <div className="page-header">
                    <Button variant="secondary" onClick={() => navigate('/organizations')}>
                        ← Назад к списку
                    </Button>
                    <h1>
                        Организация #{organization.id} - {organization.name}
                    </h1>
                    <Button variant="danger" onClick={handleDeleteOrganization}>
                        Удалить организацию
                    </Button>
                </div>

                <div className="organization-content">
                    {/*<OrganizationDetail organization={organization} costMultiplier={costMultiplier} onUpdate={reload}/>*/}

                    <CategoriesTable organizationId={organization.id}/>

                    {/*<AutopostingTable organizationId={organization.id}/>*/}

                    {/*<EmployeesTable organizationId={organization.id}/>*/}
                </div>
            </div>
        </>
    );
};
