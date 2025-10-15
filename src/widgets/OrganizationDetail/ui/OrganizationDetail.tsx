import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Building2, Calendar, Wallet, TrendingUp, ArrowLeft, Trash2} from 'lucide-react';

import {NotificationContainer} from '../../../features/notification';

import {
    type Organization,
    type CostMultiplier,
    type OrganizationFormData,
    organizationApi,
    organizationFormSections,
    organizationDetailsSections,
    organizationToForm,
    jsonToOrganizationForm,
    validateOrganizationForm,
    createEmptyOrganizationForm,
    formToUpdateCostMultiplierRequest,
    formToUpdateOrganizationRequest
} from '../../../entities/organization';

import {
    DetailsViewer,
    FormBuilder,
    Modal,
} from '../../../shared/ui';

import {
    useEntityForm,
    useModal,
    useNotification
} from '../../../shared/lib/hooks';

import './OrganizationDetail.css';

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

const formatBalance = (balance: string): string => {
    const numBalance = parseFloat(balance);
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numBalance);
};

export const OrganizationDetail = () => {
    const {organizationId} = useParams<{ organizationId: string }>();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const notification = useNotification();
    const detailsModal = useModal();
    const editModal = useModal();
    const deleteModal = useModal();

    const handleBackToOrganizations = () => {
        navigate('/organizations');
    };

    const loadOrganization = useCallback(async () => {
        if (!organizationId) {
            setError('ID организации не указан');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const [org, cost] = await Promise.all([
                organizationApi.getById(Number(organizationId)),
                organizationApi.getCostMultiplier(Number(organizationId)),
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

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        validateFn: validateOrganizationForm,
        transformEntityToForm: (org) => organizationToForm(org, costMultiplier),
        onSubmit: async (data) => {
            if (!organization) throw new Error('No organization');

            const updateRequest = formToUpdateOrganizationRequest(data, organization.id);
            await organizationApi.update(updateRequest);

            const costRequest = formToUpdateCostMultiplierRequest(data, organization.id);
            await organizationApi.updateCostMultiplier(costRequest);

            notification.success('Организация успешно обновлена');
            await loadOrganization();
            editModal.close();
        },
    });

    useEffect(() => {
        loadOrganization();
    }, [loadOrganization]);

    useEffect(() => {
        if (organization && costMultiplier) {
            organizationForm.setFormData(organizationToForm(organization, costMultiplier));
        }
    }, [organization, costMultiplier]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    const handleShowDetails = () => {
        if (organization) {
            organizationForm.setFormData(organizationToForm(organization, costMultiplier));
            detailsModal.open();
        }
    };

    const handleEditOrganization = () => {
        if (organization) {
            organizationForm.switchToEdit(organization, (org) => organizationToForm(org, costMultiplier));
            editModal.open();
        }
    };

    const handleDeleteOrganization = () => {
        deleteModal.open();
    };

    const handleConfirmDelete = async () => {
        if (!organization) return;

        try {
            await organizationApi.delete(organization.id);
            notification.success('Организация успешно удалена');
            deleteModal.close();
            navigate('/organizations');
        } catch (err) {
            notification.error('Ошибка при удалении организации');
            console.error('Failed to delete organization:', err);
        }
    };

    if (loading) {
        return (
            <div>
                <div>
                    <div>Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div>
                <div>
                    <div>{error || 'Организация не найдена'}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
            />

            <div className="organization-summary-card">
                <button
                    className="btn btn-back"
                    onClick={handleBackToOrganizations}
                >
                    <ArrowLeft size={20} />
                    Назад к организациям
                </button>

                <div className="organization-summary-header">
                    <div className="organization-summary-title-section">
                        <div className="organization-summary-icon">
                            <Building2 size={32}/>
                        </div>
                        <div>
                            <h1 className="organization-summary-title">{organization.name}</h1>
                            <p className="organization-summary-subtitle">Информация об организации</p>
                        </div>
                    </div>
                    <div className="organization-summary-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={handleShowDetails}
                        >
                            Детали
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleEditOrganization}
                        >
                            Редактировать
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleDeleteOrganization}
                        >
                            <Trash2 size={16} />
                            Удалить
                        </button>
                    </div>
                </div>

                <div className="organization-summary-stats">
                    <div className="summary-stat-item">
                        <div className="summary-stat-icon summary-stat-icon--success">
                            <Wallet size={20}/>
                        </div>
                        <div className="summary-stat-content">
                            <div className="summary-stat-label">Баланс</div>
                            <div className="summary-stat-value">{formatBalance(organization.rub_balance)} ₽</div>
                        </div>
                    </div>
                    <div className="summary-stat-item">
                        <div className="summary-stat-icon summary-stat-icon--primary">
                            <Calendar size={20}/>
                        </div>
                        <div className="summary-stat-content">
                            <div className="summary-stat-label">Дата регистрации</div>
                            <div className="summary-stat-value">{formatDate(organization.created_at)}</div>
                        </div>
                    </div>
                </div>

                {costMultiplier && (
                    <div className="organization-summary-section">
                        <h3 className="organization-summary-section-title">Множители стоимости</h3>
                        <div className="organization-summary-stats">
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Генерация текста</div>
                                    <div className="summary-stat-value">×{costMultiplier.generate_text_cost_multiplier}</div>
                                </div>
                            </div>
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Генерация изображений</div>
                                    <div className="summary-stat-value">×{costMultiplier.generate_image_cost_multiplier}</div>
                                </div>
                            </div>
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Генерация видео</div>
                                    <div className="summary-stat-value">×{costMultiplier.generate_vizard_video_cut_cost_multiplier}</div>
                                </div>
                            </div>
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Транскрибация аудио</div>
                                    <div className="summary-stat-value">×{costMultiplier.transcribe_audio_cost_multiplier}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DetailsViewer<OrganizationFormData>
                title="Просмотр организации"
                organizationId={organization.id}
                sections={organizationDetailsSections}
                values={organizationForm.formData}
                isOpen={detailsModal.isOpen}
                onClose={detailsModal.close}
            />

            <FormBuilder<OrganizationFormData>
                title="Редактирование организации"
                sections={organizationFormSections}
                values={organizationForm.formData}
                isSubmitting={organizationForm.isSubmitting}
                isOpen={editModal.isOpen}
                onClose={editModal.close}
                onSubmit={handleSubmit}
                jsonToForm={(jsonData) => jsonToOrganizationForm(jsonData, costMultiplier)}
                setFormData={organizationForm.setFormData}
            />

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.close}
                title="Подтверждение удаления"
                size="small"
            >
                <div className="delete-confirmation">
                    <p className="delete-confirmation-text">
                        Вы уверены, что хотите удалить организацию <strong>{organization.name}</strong>?
                    </p>
                    <p className="delete-confirmation-warning">
                        Это действие необратимо. Все данные организации будут удалены.
                    </p>
                    <div className="delete-confirmation-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={deleteModal.close}
                        >
                            Отмена
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleConfirmDelete}
                        >
                            <Trash2 size={16} />
                            Удалить
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
