import type {DetailSection, FormSection} from "../../../shared/ui";

export interface Organization {
    id: number;
    name: string;
    description: string;
    rub_balance: string;
    tone_of_voice: string[];
    compliance_rules: Record<string, any>[];
    products: Record<string, any>[];
    locale: Record<string, any>;
    additional_info: Record<string, any>[];
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
    description?: string;
    tone_of_voice?: string[];
    compliance_rules?: Record<string, any>[];
    products?: Record<string, any>[];
    locale?: Record<string, any>;
    additional_info?: Record<string, any>[];
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

export const organizationFormSections: FormSection[] = [
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
                name: 'description',
                type: 'input',
                label: 'Описание организации',
                placeholder: 'Введите описание организации',
                required: true,
                inputType: 'textarea',
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
        ],
    },
    {
        title: 'Комплаенс',
        fields: [
            {
                name: 'compliance_rules',
                type: 'objectList',
                label: 'Правила комплаенса',
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
                type: 'objectList',
                label: 'Дополнительная информация',
            },
        ],
    },
];

export const organizationDetailsSections: DetailSection[] = [
    {
        title: 'Основная информация',
        fields: [
            {
                name: 'name',
                label: 'Название организации',
            },

            {
                name: 'description',
                label: 'Описание организации',
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
        ],
    },
    {
        title: 'Комплаенс',
        fields: [
            {
                name: 'compliance_rules',
                label: 'Правила комплаенса',
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
