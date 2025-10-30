import type {
    CostMultiplier,
    CreateOrganizationRequest,
    Organization,
    UpdateCostMultiplierRequest,
    UpdateOrganizationRequest,
} from '../model/types';

export interface OrganizationFormData {
    name: string;
    description: string;
    tone_of_voice: string[];
    compliance_rules: Record<string, any>[];
    products: Record<string, any>[];
    locale: Record<string, any>;
    additional_info: Record<string, any>[];

    // Cost multipliers
    generate_text_cost_multiplier: number;
    generate_image_cost_multiplier: number;
    generate_vizard_video_cut_cost_multiplier: number;
    transcribe_audio_cost_multiplier: number;
}

/**
 * Создает пустую форму организации
 */
export const createEmptyOrganizationForm = (): OrganizationFormData => ({
    name: '',
    description: '',
    tone_of_voice: [],
    compliance_rules: [],
    products: [],
    locale: {},
    additional_info: [],
    generate_text_cost_multiplier: 1,
    generate_image_cost_multiplier: 1,
    generate_vizard_video_cut_cost_multiplier: 1,
    transcribe_audio_cost_multiplier: 1,
});

export const organizationToForm = (
    organization: Organization,
    costMultiplier: CostMultiplier | null
): OrganizationFormData => ({
    name: organization.name,
    description: organization.description,
    tone_of_voice: organization.tone_of_voice || [],
    compliance_rules: organization.compliance_rules || [],
    products: organization.products || [],
    locale: organization.locale || {},
    additional_info: organization.additional_info || [],
    generate_text_cost_multiplier: costMultiplier?.generate_text_cost_multiplier ?? 1,
    generate_image_cost_multiplier: costMultiplier?.generate_image_cost_multiplier ?? 1,
    generate_vizard_video_cut_cost_multiplier: costMultiplier?.generate_vizard_video_cut_cost_multiplier ?? 1,
    transcribe_audio_cost_multiplier: costMultiplier?.transcribe_audio_cost_multiplier ?? 1,
});

/**
 * Преобразует JSON в форму (для импорта)
 */
export const jsonToOrganizationForm = (
    jsonData: any,
    currentCostMultiplier: CostMultiplier | null
): OrganizationFormData => ({
    name: jsonData.name || '',
    description: jsonData.description || '',
    tone_of_voice: jsonData.tone_of_voice || [],
    compliance_rules: jsonData.compliance_rules || [],
    products: jsonData.products || [],
    locale: jsonData.locale || {},
    additional_info: jsonData.additional_info || [],
    generate_text_cost_multiplier: jsonData.generate_text_cost_multiplier ?? currentCostMultiplier?.generate_text_cost_multiplier ?? 1,
    generate_image_cost_multiplier: jsonData.generate_image_cost_multiplier ?? currentCostMultiplier?.generate_image_cost_multiplier ?? 1,
    generate_vizard_video_cut_cost_multiplier: jsonData.generate_vizard_video_cut_cost_multiplier ?? currentCostMultiplier?.generate_vizard_video_cut_cost_multiplier ?? 1,
    transcribe_audio_cost_multiplier: jsonData.transcribe_audio_cost_multiplier ?? currentCostMultiplier?.transcribe_audio_cost_multiplier ?? 1,
});

const filterNonEmpty = <T>(items: T[]): T[] => {
    if (!items || items.length === 0) return [];

    if (typeof items[0] === 'string') {
        return items.filter(item => (item as string).trim() !== '');
    }
    if (typeof items[0] === 'object') {
        return items.filter(item => Object.keys(item as object).length > 0);
    }
    return items;
};

/**
 * Преобразует форму в CreateOrganizationRequest
 */
export const formToCreateOrganizationRequest = (
    formData: OrganizationFormData
): CreateOrganizationRequest => ({
    name: formData.name,
});

/**
 * Преобразует форму в UpdateOrganizationRequest
 */
export const formToUpdateOrganizationRequest = (
    data: OrganizationFormData,
    organizationId: number
): UpdateOrganizationRequest => ({
    organization_id: organizationId,
    name: data.name,
    description: data.description,
    tone_of_voice: filterNonEmpty(data.tone_of_voice),
    compliance_rules: filterNonEmpty(data.compliance_rules),
    additional_info: filterNonEmpty(data.additional_info),
    products: filterNonEmpty(data.products),
    locale: data.locale,
});

export const formToUpdateCostMultiplierRequest = (
    data: OrganizationFormData,
    organizationId: number
): UpdateCostMultiplierRequest => ({
    organization_id: organizationId,
    generate_text_cost_multiplier: data.generate_text_cost_multiplier,
    generate_image_cost_multiplier: data.generate_image_cost_multiplier,
    generate_vizard_video_cut_cost_multiplier: data.generate_vizard_video_cut_cost_multiplier,
    transcribe_audio_cost_multiplier: data.transcribe_audio_cost_multiplier,
});

export const validateOrganizationForm = (data: OrganizationFormData): string | null => {
    if (!data.name.trim()) {
        return 'Ошибка валидации';
    }

    const multipliers = [
        {value: data.generate_text_cost_multiplier, name: 'Generate text cost multiplier'},
        {value: data.generate_image_cost_multiplier, name: 'Generate image cost multiplier'},
        {value: data.generate_vizard_video_cut_cost_multiplier, name: 'Generate vizard video cut cost multiplier'},
        {value: data.transcribe_audio_cost_multiplier, name: 'Transcribe audio cost multiplier'},
    ];

    for (const {value, name} of multipliers) {
        if (value < 0) {
            return `${name} что-то там`;
        }
    }

    return null;
};
