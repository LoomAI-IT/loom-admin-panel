/**
 * "@0=AD>@<5@K 4;O @01>BK A D>@<0<8 >@30=870F88
 * !;54C5B ?@8=F8?C DRY - 2A5 B@0=AD>@<0F88 2 >4=>< <5AB5
 */

import type {
    Organization,
    CostMultiplier,
    UpdateOrganizationRequest,
    UpdateCostMultiplierRequest,
} from '../model/types';

/**
 * "8? 40==KE D>@<K >@30=870F88
 * 1J548=O5B 40==K5 Organization + CostMultiplier
 */
export interface OrganizationFormData {
    // A=>2=K5 40==K5 >@30=870F88
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

    // Cost multipliers
    generate_text_cost_multiplier: number;
    generate_image_cost_multiplier: number;
    generate_vizard_video_cut_cost_multiplier: number;
    transcribe_audio_cost_multiplier: number;
}

/**
 * @5>1@07C5B Organization + CostMultiplier 2 D>@<C 4;O @540:B8@>20=8O
 */
export const organizationToForm = (
    organization: Organization,
    costMultiplier: CostMultiplier | null
): OrganizationFormData => ({
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
    generate_text_cost_multiplier: costMultiplier?.generate_text_cost_multiplier ?? 1,
    generate_image_cost_multiplier: costMultiplier?.generate_image_cost_multiplier ?? 1,
    generate_vizard_video_cut_cost_multiplier: costMultiplier?.generate_vizard_video_cut_cost_multiplier ?? 1,
    transcribe_audio_cost_multiplier: costMultiplier?.transcribe_audio_cost_multiplier ?? 1,
});

/**
 * @5>1@07C5B JSON 2 D>@<C (4;O 8<?>@B0)
 */
export const jsonToForm = (
    jsonData: any,
    currentCostMultiplier: CostMultiplier | null
): OrganizationFormData => ({
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
    generate_text_cost_multiplier: jsonData.generate_text_cost_multiplier ?? currentCostMultiplier?.generate_text_cost_multiplier ?? 1,
    generate_image_cost_multiplier: jsonData.generate_image_cost_multiplier ?? currentCostMultiplier?.generate_image_cost_multiplier ?? 1,
    generate_vizard_video_cut_cost_multiplier: jsonData.generate_vizard_video_cut_cost_multiplier ?? currentCostMultiplier?.generate_vizard_video_cut_cost_multiplier ?? 1,
    transcribe_audio_cost_multiplier: jsonData.transcribe_audio_cost_multiplier ?? currentCostMultiplier?.transcribe_audio_cost_multiplier ?? 1,
});

/**
 * #B8;8B0 4;O D8;LB@0F88 ?CABKE AB@>: 8 >1J5:B>2
 */
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
 * @5>1@07C5B D>@<C 2 UpdateOrganizationRequest
 */
export const formToUpdateOrganizationRequest = (
    data: OrganizationFormData,
    organizationId: number
): UpdateOrganizationRequest => ({
    organization_id: organizationId,
    name: data.name,
    video_cut_description_end_sample: data.video_cut_description_end_sample,
    publication_text_end_sample: data.publication_text_end_sample,
    tone_of_voice: filterNonEmpty(data.tone_of_voice),
    brand_rules: filterNonEmpty(data.brand_rules),
    compliance_rules: filterNonEmpty(data.compliance_rules),
    audience_insights: filterNonEmpty(data.audience_insights),
    additional_info: filterNonEmpty(data.additional_info),
    products: filterNonEmpty(data.products),
    locale: data.locale,
});

/**
 * @5>1@07C5B D>@<C 2 UpdateCostMultiplierRequest
 */
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

/**
 * 0;840F8O D>@<K >@30=870F88
 */
export const validateOrganizationForm = (data: OrganizationFormData): string | null => {
    if (!data.name.trim()) {
        return '0720=85 >@30=870F88 >1O70B5;L=> 4;O 70?>;=5=8O';
    }

    // 0;840F8O cost multipliers
    const multipliers = [
        {value: data.generate_text_cost_multiplier, name: 'Generate text cost multiplier'},
        {value: data.generate_image_cost_multiplier, name: 'Generate image cost multiplier'},
        {value: data.generate_vizard_video_cut_cost_multiplier, name: 'Generate vizard video cut cost multiplier'},
        {value: data.transcribe_audio_cost_multiplier, name: 'Transcribe audio cost multiplier'},
    ];

    for (const {value, name} of multipliers) {
        if (value < 0) {
            return `${name} =5 <>65B 1KBL >B@8F0B5;L=K<`;
        }
    }

    return null;
};
