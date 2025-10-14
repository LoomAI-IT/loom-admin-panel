import {Input} from '../../../shared/ui/Input';
import {Textarea} from '../../../shared/ui/Textarea';
import type {Organization} from '../../../entities/organization';
import {CostMultiplierEditor} from './CostMultiplierEditor';

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
    generate_text_cost_multiplier: number;
    generate_image_cost_multiplier: number;
    generate_vizard_video_cut_cost_multiplier: number;
    transcribe_audio_cost_multiplier: number;
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
        <div className="basic-info-section">
            <h3 className="section-title">Основная информация</h3>

            <div className="basic-info-grid">
                <div className="info-field">
                    <label className="field-label">ID</label>
                    <div className="field-value">{organization.id}</div>
                </div>

                <div className="info-field">
                    <label className="field-label">Название *</label>
                    {isEditing ? (
                        <Input
                            value={formData.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder="Введите название организации"
                            required
                        />
                    ) : (
                        <div className="field-value">{organization.name}</div>
                    )}
                </div>

                <div className="info-field">
                    <label className="field-label">Баланс</label>
                    <div className="field-value balance">{parseFloat(organization.rub_balance).toFixed(2)} ₽</div>
                </div>

                <div className="info-field">
                    <label className="field-label">Дата создания</label>
                    <div className="field-value">{new Date(organization.created_at).toLocaleString('ru-RU')}</div>
                </div>
            </div>

            <CostMultiplierEditor
                isEditing={isEditing}
                formData={formData}
                onChange={onChange}
            />

            <div className="templates-section">
                <h4 className="subsection-title">Шаблоны</h4>

                <div className="template-field">
                    <label className="field-label">Окончание описания нарезки видео</label>
                    {isEditing ? (
                        <Textarea
                            value={formData.video_cut_description_end_sample}
                            onChange={(e) => onChange('video_cut_description_end_sample', e.target.value)}
                            rows={4}
                            placeholder="Введите текст шаблона..."
                        />
                    ) : (
                        <div className="field-value template-content">
                            {organization.video_cut_description_end_sample || 'Не задано'}
                        </div>
                    )}
                </div>

                <div className="template-field">
                    <label className="field-label">Окончание текста публикации</label>
                    {isEditing ? (
                        <Textarea
                            value={formData.publication_text_end_sample}
                            onChange={(e) => onChange('publication_text_end_sample', e.target.value)}
                            rows={4}
                            placeholder="Введите текст шаблона..."
                        />
                    ) : (
                        <div className="field-value template-content">
                            {organization.publication_text_end_sample || 'Не задано'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
