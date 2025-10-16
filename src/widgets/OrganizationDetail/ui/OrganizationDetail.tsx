import {useParams} from 'react-router-dom';
import {Building2, Calendar, Wallet, TrendingUp, ArrowLeft} from 'lucide-react';

import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

import {
    type OrganizationFormData,
    organizationFormSections,
    organizationDetailsSections,
    jsonToOrganizationForm,
} from '../../../entities/organization';

import {
    DetailsViewer,
    FormBuilder,
} from '../../../shared/ui';

import {useOrganizationController} from '../lib/useOrganizationController';

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

    if (!organizationId) {
        return (
            <div>
                <div>
                    <div>ID организации не указан</div>
                </div>
            </div>
        );
    }

    const controller = useOrganizationController({organizationId: Number(organizationId)});

    if (controller.loading) {
        return (
            <div>
                <div>
                    <div>Загрузка...</div>
                </div>
            </div>
        );
    }

    if (controller.error || !controller.organization) {
        return (
            <div>
                <div>
                    <div>{controller.error || 'Организация не найдена'}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <NotificationContainer
                notifications={controller.notification.notifications}
                onRemove={controller.notification.remove}
            />

            <ConfirmDialog
                dialog={controller.confirmDialog.dialog}
                isProcessing={controller.confirmDialog.isProcessing}
                onConfirm={controller.confirmDialog.handleConfirm}
                onCancel={controller.confirmDialog.handleCancel}
            />

            <div className="organization-summary-card">
                <button
                    className="btn btn-back"
                    onClick={controller.handleBackToOrganizations}
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
                            <h1 className="organization-summary-title">{controller.organization.name}</h1>
                            <p className="organization-summary-subtitle">Информация об организации</p>
                        </div>
                    </div>
                    <div className="organization-summary-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={controller.handleShowDetails}
                        >
                            Детали
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={controller.handleEditOrganization}
                        >
                            Редактировать
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={controller.handleDeleteOrganization}
                        >
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
                            <div className="summary-stat-value">{formatBalance(controller.organization.rub_balance)} ₽</div>
                        </div>
                    </div>
                    <div className="summary-stat-item">
                        <div className="summary-stat-icon summary-stat-icon--primary">
                            <Calendar size={20}/>
                        </div>
                        <div className="summary-stat-content">
                            <div className="summary-stat-label">Дата регистрации</div>
                            <div className="summary-stat-value">{formatDate(controller.organization.created_at)}</div>
                        </div>
                    </div>
                </div>

                {controller.costMultiplier && (
                    <div className="organization-summary-section">
                        <h3 className="organization-summary-section-title">Множители стоимости</h3>
                        <div className="organization-summary-stats">
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Генерация текста</div>
                                    <div className="summary-stat-value">×{controller.costMultiplier.generate_text_cost_multiplier}</div>
                                </div>
                            </div>
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Генерация изображений</div>
                                    <div className="summary-stat-value">×{controller.costMultiplier.generate_image_cost_multiplier}</div>
                                </div>
                            </div>
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Генерация видео</div>
                                    <div className="summary-stat-value">×{controller.costMultiplier.generate_vizard_video_cut_cost_multiplier}</div>
                                </div>
                            </div>
                            <div className="summary-stat-item">
                                <div className="summary-stat-icon summary-stat-icon--info">
                                    <TrendingUp size={20}/>
                                </div>
                                <div className="summary-stat-content">
                                    <div className="summary-stat-label">Транскрибация аудио</div>
                                    <div className="summary-stat-value">×{controller.costMultiplier.transcribe_audio_cost_multiplier}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DetailsViewer<OrganizationFormData>
                title="Просмотр организации"
                organizationId={controller.organization.id}
                sections={organizationDetailsSections}
                values={controller.organizationForm.formData}
                isOpen={controller.detailsModal.isOpen}
                onClose={controller.detailsModal.close}
            />

            <FormBuilder<OrganizationFormData>
                title="Редактирование организации"
                sections={organizationFormSections}
                values={controller.organizationForm.formData}
                isSubmitting={controller.organizationForm.isSubmitting}
                isOpen={controller.editModal.isOpen}
                onClose={controller.editModal.close}
                onSubmit={controller.handleSubmit}
                jsonToForm={(jsonData) => jsonToOrganizationForm(jsonData, controller.costMultiplier)}
                setFormData={controller.organizationForm.setFormData}
            />
        </>
    );
};
