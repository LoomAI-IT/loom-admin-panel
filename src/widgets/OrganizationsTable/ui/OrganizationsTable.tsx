import * as React from 'react';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    type Organization,
    organizationApi,
    type OrganizationFormData,
    organizationToForm,
    createEmptyOrganizationForm,
    formToCreateOrganizationRequest,
    formToUpdateOrganizationRequest,
    formToUpdateCostMultiplierRequest,
    jsonToOrganizationForm,
    validateOrganizationForm,
} from '../../../entities/organization';
import {
    DataTable,
    type DataTableAction,
    type DataTableColumn,
    FormBuilder,
    type FormSection,
} from '../../../shared/ui';
import {useConfirmDialog, useEntityForm, useEntityList, useModal, useNotification} from '../../../shared/lib/hooks';
import {NotificationContainer} from '../../../features/notification';
import {ConfirmDialog} from '../../../features/confirmation-dialog';

export const OrganizationsTable = () => {
    const navigate = useNavigate();

    const loadOrganizations = useCallback(
        async () => {
            const response = await organizationApi.getAll();
            return response.organizations;
        },
        []
    );

    const organizationList = useEntityList<Organization>({
        loadFn: loadOrganizations,
    });

    const organizationForm = useEntityForm<OrganizationFormData, Organization>({
        initialData: createEmptyOrganizationForm(),
        transformEntityToForm: (org) => organizationToForm(org, null),
        validateFn: validateOrganizationForm,
        onSubmit: async (data, mode) => {
            if (mode === 'create') {
                // Сначала создаем организацию с минимальными данными
                const createRequest = formToCreateOrganizationRequest(data);
                const createResponse = await organizationApi.create(createRequest);
                const orgId = createResponse.organization_id;

                // Затем сразу обновляем её с полными данными
                const updateRequest = formToUpdateOrganizationRequest(data, orgId);
                await organizationApi.update(updateRequest);

                // И обновляем cost multipliers
                const costRequest = formToUpdateCostMultiplierRequest(data, orgId);
                await organizationApi.updateCostMultiplier(costRequest);

                notification.success('Организация успешно создана');
                await organizationList.refresh();
                addModal.close();
            } else {
                // Режим редактирования пока не реализован
                notification.error('Редактирование пока не поддерживается');
            }
        },
    });

    const notification = useNotification();
    const confirmDialog = useConfirmDialog();

    const addModal = useModal();

    const handleOpenAddModal = () => {
        organizationForm.switchToCreate();
        addModal.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    const handleOpenDetails = (organization: Organization) => {
        navigate(`/organizations/${organization.id}`);
    };

    const handleDelete = (organization: Organization) => {
        confirmDialog.confirm({
            title: 'Удалить организацию',
            message: `Вы уверены, что хотите удалить организацию "${organization.name}"?`,
            type: 'danger',
            confirmText: 'Удалить',
            onConfirm: async () => {
                try {
                    await organizationApi.delete(organization.id);
                    notification.success('Организация успешно удалена');
                    await organizationList.refresh();
                } catch (err) {
                    notification.error('Ошибка при удалении организации');
                    console.error('Failed to delete organization:', err);
                }
            },
        });
    };

    const columns: DataTableColumn<Organization>[] = [
        {
            header: 'ID',
            key: 'id',
        },
        {
            header: 'Название',
            render: (organization) => <span>{organization.name}</span>,
        },
        {
            header: 'Баланс (руб)',
            render: (organization) => <span>{organization.rub_balance}</span>,
        },
        {
            header: 'Дата создания',
            render: (organization) => (
                <span>{new Date(organization.created_at).toLocaleDateString('ru-RU')}</span>
            ),
        },
    ];

    const actions: DataTableAction<Organization>[] = [
        {
            label: 'Детали',
            onClick: handleOpenDetails,
            variant: 'secondary',
        },
        {
            label: 'Удалить',
            onClick: handleDelete,
            variant: 'danger',
        },
    ];

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

    return (
        <>
            <NotificationContainer
                notifications={notification.notifications}
                onRemove={notification.remove}
            />

            <ConfirmDialog
                dialog={confirmDialog.dialog}
                isProcessing={confirmDialog.isProcessing}
                onConfirm={confirmDialog.handleConfirm}
                onCancel={confirmDialog.handleCancel}
            />

            <DataTable<Organization>
                title="Организации"
                data={organizationList.entities}
                columns={columns}
                actions={actions}
                loading={organizationList.loading}
                error={organizationList.error}
                emptyMessage="Организации не найдены"
                onAdd={handleOpenAddModal}
                addButtonLabel="Добавить организацию"
                getRowKey={(organization) => organization.id}
            />

            <FormBuilder<OrganizationFormData>
                title="Добавить организацию"
                sections={organizationFormSections}
                values={organizationForm.formData}
                isSubmitting={organizationForm.isSubmitting}
                isOpen={addModal.isOpen}
                onClose={addModal.close}
                onSubmit={handleSubmit}
                jsonToForm={(jsonData) => jsonToOrganizationForm(jsonData, null)}
                setFormData={organizationForm.setFormData}
            />
        </>
    );
};
