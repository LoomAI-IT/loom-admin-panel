import {useState} from 'react';
import {
    type CostMultiplier,
    formToUpdateCostMultiplierRequest,
    formToUpdateOrganizationRequest,
    jsonToForm,
    type Organization,
    organizationApi,
    type OrganizationFormData,
    organizationToForm,
    validateOrganizationForm,
} from '../../../entities/organization';
import {Button} from '../../../shared/ui';
import {useEntityForm, useModal, useNotification} from '../../../shared/lib/hooks';
import {OrganizationBasicInfo} from './OrganizationBasicInfo';
import {StringListEditor} from './StringListEditor';
import {KeyValueEditor} from './KeyValueEditor';
import {ObjectListEditor} from './ObjectListEditor';
import {JsonImportModal, JsonViewModal, loadJsonFromFile} from '../../../features/json-import';
import {NotificationContainer} from '../../../features/notification';
import './OrganizationForm.css';

interface OrganizationFormProps {
    organization: Organization;
    costMultiplier: CostMultiplier | null;
    onUpdate: () => void;
}

export const OrganizationForm = ({organization, costMultiplier, onUpdate}: OrganizationFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const jsonImportModal = useModal();
    const jsonViewModal = useModal();
    const notification = useNotification();

    // Управление формой с использованием useEntityForm
    const organizationForm = useEntityForm<OrganizationFormData>({
        initialData: organizationToForm(organization, costMultiplier),
        validateFn: validateOrganizationForm,
        onSubmit: async (data) => {
            // Обновляем организацию и cost multiplier параллельно
            await Promise.all([
                organizationApi.update(formToUpdateOrganizationRequest(data, organization.id)),
                organizationApi.updateCostMultiplier(formToUpdateCostMultiplierRequest(data, organization.id)),
            ]);

            notification.success('Изменения успешно сохранены');
            setIsEditing(false);
            onUpdate();
        },
    });

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        // Сбрасываем форму к исходным данным организации
        organizationForm.resetToEntity({organization, costMultiplier}, (data) =>
            organizationToForm(data.organization, data.costMultiplier)
        );
        setIsEditing(false);
    };

    const handleJsonImport = (jsonData: any) => {
        const formData = jsonToForm(jsonData, costMultiplier);
        organizationForm.setFormData(formData);
        jsonImportModal.close();
        notification.success('Настройки успешно загружены из JSON');
    };

    const handleLoadJsonFile = async () => {
        try {
            const jsonData = await loadJsonFromFile();
            handleJsonImport(jsonData);
        } catch (err) {
            notification.error('Ошибка при загрузке JSON файла');
        }
    };

    const handleSave = async () => {
        const success = await organizationForm.submit();
        if (!success && organizationForm.error) {
            notification.error(organizationForm.error);
        }
    };

    const {formData, updateField, isSubmitting} = organizationForm;

    return (
        <>
            {/* Контейнер уведомлений */}
            <NotificationContainer notifications={notification.notifications} onRemove={notification.remove}/>

            <div className="organization-form">
                <div className="form-actions">
                    {!isEditing ? (
                        <>
                            <Button variant="secondary" onClick={jsonViewModal.open}>
                                Просмотр JSON
                            </Button>
                            <Button onClick={handleEdit}>Редактировать</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={jsonImportModal.open} disabled={isSubmitting}>
                                Вставить JSON
                            </Button>
                            <Button variant="secondary" onClick={handleLoadJsonFile} disabled={isSubmitting}>
                                Загрузить JSON
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                                Отмена
                            </Button>
                            <Button onClick={handleSave} disabled={isSubmitting}>
                                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </>
                    )}
                </div>

                <OrganizationBasicInfo
                    organization={organization}
                    isEditing={isEditing}
                    formData={formData}
                    onChange={updateField}
                />

                <StringListEditor
                    title="Tone of Voice"
                    items={formData.tone_of_voice}
                    isEditing={isEditing}
                    onChange={(items) => updateField('tone_of_voice', items)}
                />

                <StringListEditor
                    title="Правила бренда"
                    items={formData.brand_rules}
                    isEditing={isEditing}
                    onChange={(items) => updateField('brand_rules', items)}
                />

                <StringListEditor
                    title="Правила соответствия"
                    items={formData.compliance_rules}
                    isEditing={isEditing}
                    onChange={(items) => updateField('compliance_rules', items)}
                />

                <StringListEditor
                    title="Информация об аудитории"
                    items={formData.audience_insights}
                    isEditing={isEditing}
                    onChange={(items) => updateField('audience_insights', items)}
                />

                <StringListEditor
                    title="Дополнительная информация"
                    items={formData.additional_info}
                    isEditing={isEditing}
                    onChange={(items) => updateField('additional_info', items)}
                />

                <KeyValueEditor
                    title="Локализация (Locale)"
                    data={formData.locale}
                    isEditing={isEditing}
                    onChange={(data) => updateField('locale', data)}
                />

                <ObjectListEditor
                    title="Продукты (Products)"
                    items={formData.products}
                    isEditing={isEditing}
                    onChange={(items) => updateField('products', items)}
                />

                <JsonImportModal
                    isOpen={jsonImportModal.isOpen}
                    onClose={jsonImportModal.close}
                    onImport={handleJsonImport}
                />

                <JsonViewModal
                    isOpen={jsonViewModal.isOpen}
                    onClose={jsonViewModal.close}
                    data={formData}
                    organizationId={organization.id}
                />
            </div>
        </>
    );
};
