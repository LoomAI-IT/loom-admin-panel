import { useState } from 'react';
import { organizationApi, type Organization, type UpdateOrganizationRequest } from '../../../entities/organization';
import { Button } from '../../../shared/ui/Button';
import { useFormState } from '../../../shared/lib/hooks';
import { OrganizationBasicInfo } from './OrganizationBasicInfo';
import { StringListEditor } from './StringListEditor';
import { JsonImportModal, JsonViewModal, loadJsonFromFile } from '../../../features/json-import';
import { useModal } from '../../../shared/lib/hooks';
import './OrganizationForm.css';

interface OrganizationFormProps {
  organization: Organization;
  onUpdate: () => void;
}

export const OrganizationForm = ({ organization, onUpdate }: OrganizationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const jsonImportModal = useModal();
  const jsonViewModal = useModal();

  const { formData, updateField, reset } = useFormState({
    name: organization.name,
    video_cut_description_end_sample: organization.video_cut_description_end_sample || '',
    publication_text_end_sample: organization.publication_text_end_sample || '',
    tone_of_voice: organization.tone_of_voice || [],
    brand_rules: organization.brand_rules || [],
    compliance_rules: organization.compliance_rules || [],
    audience_insights: organization.audience_insights || [],
    products: organization.products || [],
    locale: organization.locale || {},
    additional_info: organization.additional_info || [],
  });

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    reset({
      name: organization.name,
      video_cut_description_end_sample: organization.video_cut_description_end_sample || '',
      publication_text_end_sample: organization.publication_text_end_sample || '',
      tone_of_voice: organization.tone_of_voice || [],
      brand_rules: organization.brand_rules || [],
      compliance_rules: organization.compliance_rules || [],
      audience_insights: organization.audience_insights || [],
      products: organization.products || [],
      locale: organization.locale || {},
      additional_info: organization.additional_info || [],
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updateData: UpdateOrganizationRequest = {
        organization_id: organization.id,
        ...formData,
      };
      await organizationApi.update(updateData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to update organization:', err);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsSaving(false);
    }
  };

  const handleJsonImport = (jsonData: any) => {
    reset({
      name: jsonData.name || '',
      video_cut_description_end_sample: jsonData.video_cut_description_end_sample || '',
      publication_text_end_sample: jsonData.publication_text_end_sample || '',
      tone_of_voice: jsonData.tone_of_voice || [],
      brand_rules: jsonData.brand_rules || [],
      compliance_rules: jsonData.compliance_rules || [],
      audience_insights: jsonData.audience_insights || [],
      products: jsonData.products || [],
      locale: jsonData.locale || {},
      additional_info: jsonData.additional_info || [],
    });
  };

  const handleLoadJsonFile = async () => {
    try {
      const jsonData = await loadJsonFromFile();
      handleJsonImport(jsonData);
      alert('Настройки успешно загружены из JSON');
    } catch (err) {
      alert('Ошибка при загрузке JSON файла');
    }
  };

  return (
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
            <Button variant="secondary" onClick={jsonImportModal.open} disabled={isSaving}>
              Вставить JSON
            </Button>
            <Button variant="secondary" onClick={handleLoadJsonFile} disabled={isSaving}>
              Загрузить JSON
            </Button>
            <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
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
  );
};
