import { Input } from '../../../shared/ui/Input';
import { Textarea } from '../../../shared/ui/Textarea';
import type { Organization } from '../../../entities/organization';

interface FormData {
  name: string;
  video_cut_description_end_sample: string;
  publication_text_end_sample: string;
  tone_of_voice: string[];
  brand_rules: string[];
  compliance_rules: string[];
  audience_insights: string[];
  products: Record<string, any>[];
  locale: Record<string, any>;
  additional_info: string[];
}

interface OrganizationBasicInfoProps {
  organization: Organization;
  isEditing: boolean;
  formData: FormData;
  onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export const OrganizationBasicInfo = ({
  organization,
  isEditing,
  formData,
  onChange,
}: OrganizationBasicInfoProps) => {
  return (
    <div className="info-section">
      <h2>Основная информация</h2>
      <div className="info-grid">
        <div className="info-item">
          <label>ID</label>
          <div className="value">{organization.id}</div>
        </div>

        <div className="info-item">
          <label>Название</label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          ) : (
            <div className="value">{organization.name}</div>
          )}
        </div>

        <div className="info-item">
          <label>Баланс</label>
          <div className="value balance">{parseFloat(organization.rub_balance).toFixed(2)} ₽</div>
        </div>

        <div className="info-item">
          <label>Дата создания</label>
          <div className="value">{new Date(organization.created_at).toLocaleString('ru-RU')}</div>
        </div>
      </div>

      <h3>Шаблоны</h3>
      <div className="info-item full-width">
        <label>Окончание описания нарезки видео</label>
        {isEditing ? (
          <Textarea
            value={formData.video_cut_description_end_sample}
            onChange={(e) => onChange('video_cut_description_end_sample', e.target.value)}
            rows={4}
            placeholder="Введите текст шаблона..."
          />
        ) : (
          <div className="value text-content">
            {organization.video_cut_description_end_sample || 'Не задано'}
          </div>
        )}
      </div>

      <div className="info-item full-width">
        <label>Окончание текста публикации</label>
        {isEditing ? (
          <Textarea
            value={formData.publication_text_end_sample}
            onChange={(e) => onChange('publication_text_end_sample', e.target.value)}
            rows={4}
            placeholder="Введите текст шаблона..."
          />
        ) : (
          <div className="value text-content">
            {organization.publication_text_end_sample || 'Не задано'}
          </div>
        )}
      </div>
    </div>
  );
};
