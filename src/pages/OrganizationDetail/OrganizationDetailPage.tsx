import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {CategoriesTable} from '../../widgets/CategoriesTable';
import {
    type CostMultiplier,
    createEmptyOrganizationForm,
    formToUpdateCostMultiplierRequest,
    formToUpdateOrganizationRequest,
    jsonToOrganizationForm,
    type Organization,
    organizationApi,
    type OrganizationFormData,
    organizationToForm,
    validateOrganizationForm,
} from '../../entities/organization';
import {type DetailSection, DetailsViewer, FormBuilder, type FormSection,} from '../../shared/ui';
import {useEntityForm, useModal, useNotification} from '../../shared/lib/hooks';
import {NotificationContainer} from '../../features/notification';

export const OrganizationDetailPage = () => {
    const {organizationId} = useParams<{ organizationId: string }>();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [costMultiplier, setCostMultiplier] = useState<CostMultiplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const notification = useNotification();
    const detailsModal = useModal();
    const editModal = useModal();

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
        transformEntityToForm: (org) => organizationToForm(org, costMultiplier),
        validateFn: validateOrganizationForm,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    const organizationFormSections: FormSection<OrganizationFormData>[] = [
        {
            title: 'Основная информация',
            fields: [
                {
                    name: 'name',
                    type: 'input',
                    label: 'Название организации',
                    placeholder: 'Введите название организации',
                    required: true,
                    inputType: 'text',
                },
                {
                    name: 'video_cut_description_end_sample',
                    type: 'textarea',
                    label: 'Образец окончания описания видео-отрывка',
                    placeholder: 'Пример текста для окончания...',
                    debounceDelay: 500,
                },
                {
                    name: 'publication_text_end_sample',
                    type: 'textarea',
                    label: 'Образец окончания текста публикации',
                    placeholder: 'Пример текста для окончания публикации...',
                    debounceDelay: 500,
                },
            ],
        },
        {
            title: 'Брендинг и стиль',
            fields: [
                {
                    name: 'tone_of_voice',
                    type: 'stringList',
                    label: 'Тон голоса',
                    placeholder: 'тон/стиль',
                },
                {
                    name: 'brand_rules',
                    type: 'stringList',
                    label: 'Правила бренда',
                    placeholder: 'правило бренда',
                },
            ],
        },
        {
            title: 'Комплаенс и аудитория',
            fields: [
                {
                    name: 'compliance_rules',
                    type: 'stringList',
                    label: 'Правила комплаенса',
                    placeholder: 'правило комплаенса',
                },
                {
                    name: 'audience_insights',
                    type: 'stringList',
                    label: 'Инсайты об аудитории',
                    placeholder: 'инсайт',
                },
            ],
        },
        {
            title: 'Продукты и локализация',
            fields: [
                {
                    name: 'products',
                    type: 'objectList',
                    label: 'Продукты',
                },
                {
                    name: 'locale',
                    type: 'object',
                    label: 'Локализация',
                },
            ],
        },
        {
            title: 'Множители стоимости',
            fields: [
                {
                    name: 'generate_text_cost_multiplier',
                    type: 'input',
                    label: 'Множитель стоимости генерации текста',
                    placeholder: '1',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
                {
                    name: 'generate_image_cost_multiplier',
                    type: 'input',
                    label: 'Множитель стоимости генерации изображений',
                    placeholder: '1',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
                {
                    name: 'generate_vizard_video_cut_cost_multiplier',
                    type: 'input',
                    label: 'Множитель стоимости генерации видео-отрывков',
                    placeholder: '1',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
                {
                    name: 'transcribe_audio_cost_multiplier',
                    type: 'input',
                    label: 'Множитель стоимости транскрибации аудио',
                    placeholder: '1',
                    required: true,
                    inputType: 'number',
                    inputMode: 'numeric',
                },
            ],
        },
        {
            title: 'Дополнительно',
            fields: [
                {
                    name: 'additional_info',
                    type: 'stringList',
                    label: 'Дополнительная информация',
                    placeholder: 'дополнительный пункт',
                },
            ],
        },
    ];

    const organizationDetailsSections: DetailSection<OrganizationFormData>[] = [
        {
            title: 'Основная информация',
            fields: [
                {
                    name: 'name',
                    label: 'Название организации',
                },
                {
                    name: 'video_cut_description_end_sample',
                    label: 'Образец окончания описания видео-отрывка',
                },
                {
                    name: 'publication_text_end_sample',
                    label: 'Образец окончания текста публикации',
                },
            ],
        },
        {
            title: 'Брендинг и стиль',
            fields: [
                {
                    name: 'tone_of_voice',
                    label: 'Тон голоса',
                },
                {
                    name: 'brand_rules',
                    label: 'Правила бренда',
                },
            ],
        },
        {
            title: 'Комплаенс и аудитория',
            fields: [
                {
                    name: 'compliance_rules',
                    label: 'Правила комплаенса',
                },
                {
                    name: 'audience_insights',
                    label: 'Инсайты об аудитории',
                },
            ],
        },
        {
            title: 'Продукты и локализация',
            fields: [
                {
                    name: 'products',
                    label: 'Продукты',
                },
                {
                    name: 'locale',
                    label: 'Локализация',
                },
            ],
        },
        {
            title: 'Множители стоимости',
            fields: [
                {
                    name: 'generate_text_cost_multiplier',
                    label: 'Множитель стоимости генерации текста',
                },
                {
                    name: 'generate_image_cost_multiplier',
                    label: 'Множитель стоимости генерации изображений',
                },
                {
                    name: 'generate_vizard_video_cut_cost_multiplier',
                    label: 'Множитель стоимости генерации видео-отрывков',
                },
                {
                    name: 'transcribe_audio_cost_multiplier',
                    label: 'Множитель стоимости транскрибации аудио',
                },
            ],
        },
        {
            title: 'Дополнительно',
            fields: [
                {
                    name: 'additional_info',
                    label: 'Дополнительная информация',
                },
            ],
        },
    ];

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

            <div>
                <div>
                    <div>
                        <button onClick={handleShowDetails}>
                            Детали организации
                        </button>
                        <button onClick={handleEditOrganization}>
                            Редактировать организацию
                        </button>
                    </div>

                    <CategoriesTable organizationId={organization.id}/>
                </div>
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
        </>
    );
};
