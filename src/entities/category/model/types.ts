import type {DetailSection, FormSection} from "../../../shared/ui";

export interface Category {
    id: number;
    organization_id: number;
    name: string;
    prompt_for_image_style: string;
    goal: string;
    structure_skeleton: string[];
    structure_flex_level_min: number;
    structure_flex_level_max: number;
    structure_flex_level_comment: string;
    must_have: string[];
    must_avoid: string[];
    social_networks_rules: string;
    len_min: number;
    len_max: number;
    n_hashtags_min: number;
    n_hashtags_max: number;
    cta_type: string;
    tone_of_voice: string[];
    brand_rules: string[];
    good_samples: Record<string, any>[];
    additional_info: string[];
    created_at: string;
}

export interface CreateCategoryRequest {
    organization_id: number;
    name: string;
    prompt_for_image_style?: string;
    goal?: string;
    structure_skeleton?: string[];
    structure_flex_level_min?: number;
    structure_flex_level_max?: number;
    structure_flex_level_comment?: string;
    must_have?: string[];
    must_avoid?: string[];
    social_networks_rules?: string;
    len_min?: number;
    len_max?: number;
    n_hashtags_min?: number;
    n_hashtags_max?: number;
    cta_type?: string;
    tone_of_voice?: string[];
    brand_rules?: string[];
    good_samples?: Record<string, any>[];
    additional_info?: string[];
}

export interface UpdateCategoryRequest {
    name?: string;
    prompt_for_image_style?: string;
    goal?: string;
    structure_skeleton?: string[];
    structure_flex_level_min?: number;
    structure_flex_level_max?: number;
    structure_flex_level_comment?: string;
    must_have?: string[];
    must_avoid?: string[];
    social_networks_rules?: string;
    len_min?: number;
    len_max?: number;
    n_hashtags_min?: number;
    n_hashtags_max?: number;
    cta_type?: string;
    tone_of_voice?: string[];
    brand_rules?: string[];
    good_samples?: Record<string, any>[];
    additional_info?: string[];
}

export interface CategoryResponse {
    message: string;
    category_id?: number;
}

export const categoryFormSections: FormSection[] = [
    {
        title: 'Основная информация',
        fields: [
            {
                name: 'name',
                type: 'input',
                label: 'Название рубрики',
                placeholder: 'Введите название рубрики',
                required: true,
                inputType: 'text',
            },
            {
                name: 'prompt_for_image_style',
                type: 'textarea',
                label: 'Промпт для стиля изображения',
                placeholder: 'Описание стиля изображения...',
                required: true,
                debounceDelay: 500,
            },
            {
                name: 'goal',
                type: 'textarea',
                label: 'Цель рубрики',
                placeholder: 'Основная цель и назначение...',
                required: true,
                debounceDelay: 500,
            },
            {
                name: 'cta_type',
                type: 'input',
                label: 'Тип CTA',
                placeholder: 'Тип призыва к действию',
                required: true,
                inputType: 'text',
            },
        ],
    },
    {
        title: 'Структура контента',
        fields: [
            {
                name: 'structure_skeleton',
                type: 'stringList',
                label: 'Скелет структуры',
                placeholder: 'элемент структуры',
                required: true,
            },
            {
                name: 'structure_flex_level_min',
                type: 'input',
                label: 'Минимальный уровень гибкости структуры',
                placeholder: '0',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
                groupWith: ['structure_flex_level_max'],
            },
            {
                name: 'structure_flex_level_max',
                type: 'input',
                label: 'Максимальный уровень гибкости структуры',
                placeholder: '10',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
            },
            {
                name: 'structure_flex_level_comment',
                type: 'textarea',
                label: 'Комментарий к гибкости структуры',
                placeholder: 'Пояснения к уровням гибкости...',
                required: true,
                debounceDelay: 300,
            },
        ],
    },
    {
        title: 'Обязательные и запрещенные элементы',
        fields: [
            {
                name: 'must_have',
                type: 'stringList',
                label: 'Обязательные элементы',
                placeholder: 'обязательный элемент',
                required: true,
            },
            {
                name: 'must_avoid',
                type: 'stringList',
                label: 'Запрещенные элементы',
                placeholder: 'запрещенный элемент',
                required: true,
            },
        ],
    },
    {
        title: 'Ограничения длины и хэштегов',
        fields: [
            {
                name: 'len_min',
                type: 'input',
                label: 'Минимальная длина',
                placeholder: '0',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
                groupWith: ['len_max'],
            },
            {
                name: 'len_max',
                type: 'input',
                label: 'Максимальная длина',
                placeholder: '1000',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
            },
            {
                name: 'n_hashtags_min',
                type: 'input',
                label: 'Минимальное количество хэштегов',
                placeholder: '0',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
                groupWith: ['n_hashtags_max'],
            },
            {
                name: 'n_hashtags_max',
                type: 'input',
                label: 'Максимальное количество хэштегов',
                placeholder: '10',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
            },
        ],
    },
    {
        title: 'Социальные сети и брендинг',
        fields: [
            {
                name: 'social_networks_rules',
                type: 'textarea',
                label: 'Правила для социальных сетей',
                placeholder: 'Специфические правила для разных платформ...',
                required: true,
                debounceDelay: 500,
            },
            {
                name: 'tone_of_voice',
                type: 'stringList',
                label: 'Тон голоса',
                placeholder: 'тон/стиль',
                required: true,
            },
            {
                name: 'brand_rules',
                type: 'stringList',
                label: 'Правила бренда',
                placeholder: 'правило бренда',
                required: true,
            },
        ],
    },
    {
        title: 'Дополнительно',
        fields: [
            {
                name: 'good_samples',
                type: 'objectList',
                label: 'Примеры хорошего контента',
            },
            {
                name: 'additional_info',
                type: 'stringList',
                label: 'Дополнительная информация',
                placeholder: 'дополнительный пункт',
            },
        ],
    },
];

export const categoryDetailsSections: DetailSection[] = [
    {
        title: 'Основная информация',
        fields: [
            {
                name: 'name',
                label: 'Название рубрики',
            },
            {
                name: 'goal',
                label: 'Цель рубрики',
            },
            {
                name: 'cta_type',
                label: 'Тип CTA'
            },
            {
                name: 'prompt_for_image_style',
                label: 'Промпт для стиля изображения'
            },
        ]
    },
    {
        title: 'Структура контента',
        fields: [
            {
                name: 'structure_skeleton',
                label: 'Скелет структуры'
            },
            {
                name: 'structure_flex_level_min',
                label: 'Уровень гибкости',
                groupWith: ['structure_flex_level_max']
            },
            {
                name: 'structure_flex_level_max',
                label: 'Максимальный уровень'
            },
            {
                name: 'structure_flex_level_comment',
                label: 'Комментарий к гибкости'
            },
        ]
    },
    {
        title: 'Обязательные и запрещенные элементы',
        fields: [
            {
                name: 'must_have',
                label: 'Обязательные элементы'
            },
            {
                name: 'must_avoid',
                label: 'Запрещенные элементы'
            },
        ]
    },
    {
        title: 'Ограничения',
        fields: [
            {
                name: 'len_min',
                label: 'Длина текста',
                groupWith: ['len_max']
            },
            {
                name: 'len_max',
                label: 'Максимальная длина'
            },
            {
                name: 'n_hashtags_min',
                label: 'Хэштеги',
                groupWith: ['n_hashtags_max']
            },
            {
                name: 'n_hashtags_max',
                label: 'Максимальное количество'
            },
        ]
    },
    {
        title: 'Социальные сети и брендинг',
        fields: [
            {
                name: 'social_networks_rules',
                label: 'Правила для соцсетей'
            },
            {
                name: 'tone_of_voice',
                label: 'Тон голоса'
            }
            ,
            {
                name: 'brand_rules',
                label: 'Правила бренда'
            },
        ]
    },
    {
        title: 'Дополнительно',
        fields: [
            {
                name: 'good_samples',
                label: 'Примеры хорошего контента',
            },
            {
                name: 'additional_info',
                label: 'Дополнительная информация'
            },
        ]
    },
];
