import type {DetailSection, FormSection} from "../../../shared/ui";
import type {OrganizationFormData} from "../lib/transformers.ts";

export interface Organization {
    id: number;
    name: string;
    rub_balance: string;
    video_cut_description_end_sample: string;
    publication_text_end_sample: string;
    tone_of_voice: string[];
    brand_rules: string[];
    compliance_rules: string[];
    audience_insights: string[];
    products: Record<string, any>[];
    locale: Record<string, any>;
    additional_info: string[];
    created_at: string;
}

export interface CreateOrganizationRequest {
    name: string;
}

export interface CreateOrganizationResponse {
    message: string;
    organization_id: number;
}

export interface GetAllOrganizationsResponse {
    message: string;
    organizations: Organization[];
}

export interface UpdateOrganizationRequest {
    organization_id: number;
    name?: string;
    video_cut_description_end_sample?: string;
    publication_text_end_sample?: string;
    tone_of_voice?: string[];
    brand_rules?: string[];
    compliance_rules?: string[];
    audience_insights?: string[];
    products?: Record<string, any>[];
    locale?: Record<string, any>;
    additional_info?: string[];
}

export interface UpdateOrganizationResponse {
    message: string;
}

export interface DeleteOrganizationResponse {
    message: string;
}

export interface CostMultiplier {
    id: number;
    organization_id: number;
    generate_text_cost_multiplier: number;
    generate_image_cost_multiplier: number;
    generate_vizard_video_cut_cost_multiplier: number;
    transcribe_audio_cost_multiplier: number;
}

export interface UpdateCostMultiplierRequest {
    organization_id: number;
    generate_text_cost_multiplier?: number;
    generate_image_cost_multiplier?: number;
    generate_vizard_video_cut_cost_multiplier?: number;
    transcribe_audio_cost_multiplier?: number;
}

export const organizationFormSections: FormSection<OrganizationFormData>[] = [
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

export const organizationDetailsSections: DetailSection<OrganizationFormData>[] = [
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
