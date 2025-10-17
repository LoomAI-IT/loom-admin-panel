import type {DetailSection, FormSection} from "../../../shared/ui";

export interface Category {
    id: number;
    organization_id: number;
    name: string;
    goal: string;
    tone_of_voice: string[];
    brand_rules: string[];
    brand_vocabulary: Record<string, any>[];
    tone_variations: Record<string, any>[];
    structure_variations: Record<string, any>[];
    creativity_level: number;
    experimentation_zones: string[];
    surprise_factors: Record<string, any>[];
    humor_policy: Record<string, any>;
    audience_segments: Record<string, any>[];
    emotional_palette: Record<string, any>[];
    must_have: Record<string, any>[];
    must_avoid: Record<string, any>[];
    len_min: number;
    len_max: number;
    n_hashtags_min: number;
    n_hashtags_max: number;
    cta_type: string;
    cta_strategy: Record<string, any>;
    good_samples: Record<string, any>[];
    bad_samples: Record<string, any>[];
    additional_info: Record<string, any>[];
    prompt_for_image_style: string;
    created_at: string;
}

export interface CreateCategoryRequest {
    organization_id: number;
    name: string;
    goal?: string;
    tone_of_voice?: string[];
    brand_rules?: string[];
    brand_vocabulary?: Record<string, any>[];
    tone_variations?: Record<string, any>[];
    structure_variations?: Record<string, any>[];
    creativity_level?: number;
    experimentation_zones?: string[];
    surprise_factors?: Record<string, any>[];
    humor_policy?: Record<string, any>;
    audience_segments?: Record<string, any>[];
    emotional_palette?: Record<string, any>[];
    must_have?: Record<string, any>[];
    must_avoid?: Record<string, any>[];
    len_min?: number;
    len_max?: number;
    n_hashtags_min?: number;
    n_hashtags_max?: number;
    cta_type?: string;
    cta_strategy?: Record<string, any>;
    good_samples?: Record<string, any>[];
    bad_samples?: Record<string, any>[];
    additional_info?: Record<string, any>[];
    prompt_for_image_style?: string;
}

export interface UpdateCategoryRequest {
    name?: string;
    goal?: string;
    tone_of_voice?: string[];
    brand_rules?: string[];
    brand_vocabulary?: Record<string, any>[];
    tone_variations?: Record<string, any>[];
    structure_variations?: Record<string, any>[];
    creativity_level?: number;
    experimentation_zones?: string[];
    surprise_factors?: Record<string, any>[];
    humor_policy?: Record<string, any>;
    audience_segments?: Record<string, any>[];
    emotional_palette?: Record<string, any>[];
    must_have?: Record<string, any>[];
    must_avoid?: Record<string, any>[];
    len_min?: number;
    len_max?: number;
    n_hashtags_min?: number;
    n_hashtags_max?: number;
    cta_type?: string;
    cta_strategy?: Record<string, any>;
    good_samples?: Record<string, any>[];
    bad_samples?: Record<string, any>[];
    additional_info?: Record<string, any>[];
    prompt_for_image_style?: string;
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
                name: 'goal',
                type: 'textarea',
                label: 'Цель рубрики',
                placeholder: 'Основная цель и назначение...',
                required: true,
                debounceDelay: 500,
            },
            {
                name: 'prompt_for_image_style',
                type: 'textarea',
                label: 'Промпт для стиля изображения',
                placeholder: 'Описание стиля изображения...',
                required: true,
                debounceDelay: 500,
            },
        ],
    },
    {
        title: 'Тон и бренд',
        fields: [
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
            {
                name: 'brand_vocabulary',
                type: 'objectList',
                label: 'Словарь бренда',
            },
            {
                name: 'tone_variations',
                type: 'objectList',
                label: 'Вариации тона',
            },
        ],
    },
    {
        title: 'Структура и креативность',
        fields: [
            {
                name: 'structure_variations',
                type: 'objectList',
                label: 'Вариации структуры',
            },
            {
                name: 'creativity_level',
                type: 'input',
                label: 'Уровень креативности',
                placeholder: '0-10',
                required: true,
                inputType: 'number',
                inputMode: 'numeric',
            },
            {
                name: 'experimentation_zones',
                type: 'stringList',
                label: 'Зоны экспериментов',
                placeholder: 'зона эксперимента',
            },
            {
                name: 'surprise_factors',
                type: 'objectList',
                label: 'Факторы удивления',
            },
            {
                name: 'humor_policy',
                type: 'object',
                label: 'Политика юмора',
            },
        ],
    },
    {
        title: 'Аудитория и эмоции',
        fields: [
            {
                name: 'audience_segments',
                type: 'objectList',
                label: 'Сегменты аудитории',
            },
            {
                name: 'emotional_palette',
                type: 'objectList',
                label: 'Эмоциональная палитра',
            },
        ],
    },
    {
        title: 'Обязательные и запрещенные элементы',
        fields: [
            {
                name: 'must_have',
                type: 'objectList',
                label: 'Обязательные элементы',
            },
            {
                name: 'must_avoid',
                type: 'objectList',
                label: 'Запрещенные элементы',
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
        title: 'Призыв к действию',
        fields: [
            {
                name: 'cta_type',
                type: 'input',
                label: 'Тип CTA',
                placeholder: 'Тип призыва к действию',
                required: true,
                inputType: 'text',
            },
            {
                name: 'cta_strategy',
                type: 'object',
                label: 'Стратегия CTA',
            },
        ],
    },
    {
        title: 'Примеры и дополнительная информация',
        fields: [
            {
                name: 'good_samples',
                type: 'objectList',
                label: 'Примеры хорошего контента',
            },
            {
                name: 'bad_samples',
                type: 'objectList',
                label: 'Примеры плохого контента',
            },
            {
                name: 'additional_info',
                type: 'objectList',
                label: 'Дополнительная информация',
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
                name: 'prompt_for_image_style',
                label: 'Промпт для стиля изображения'
            },
        ]
    },
    {
        title: 'Тон и бренд',
        fields: [
            {
                name: 'tone_of_voice',
                label: 'Тон голоса'
            },
            {
                name: 'brand_rules',
                label: 'Правила бренда'
            },
            {
                name: 'brand_vocabulary',
                label: 'Словарь бренда'
            },
            {
                name: 'tone_variations',
                label: 'Вариации тона'
            },
        ]
    },
    {
        title: 'Структура и креативность',
        fields: [
            {
                name: 'structure_variations',
                label: 'Вариации структуры'
            },
            {
                name: 'creativity_level',
                label: 'Уровень креативности'
            },
            {
                name: 'experimentation_zones',
                label: 'Зоны экспериментов'
            },
            {
                name: 'surprise_factors',
                label: 'Факторы удивления'
            },
            {
                name: 'humor_policy',
                label: 'Политика юмора'
            },
        ]
    },
    {
        title: 'Аудитория и эмоции',
        fields: [
            {
                name: 'audience_segments',
                label: 'Сегменты аудитории'
            },
            {
                name: 'emotional_palette',
                label: 'Эмоциональная палитра'
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
        title: 'Призыв к действию',
        fields: [
            {
                name: 'cta_type',
                label: 'Тип CTA'
            },
            {
                name: 'cta_strategy',
                label: 'Стратегия CTA'
            },
        ]
    },
    {
        title: 'Примеры и дополнительная информация',
        fields: [
            {
                name: 'good_samples',
                label: 'Примеры хорошего контента',
            },
            {
                name: 'bad_samples',
                label: 'Примеры плохого контента',
            },
            {
                name: 'additional_info',
                label: 'Дополнительная информация'
            },
        ]
    },
];
