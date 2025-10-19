/**
 * Трансформеры для работы с категориями
 * Преобразование между API моделью и формой
 */

import {parseNumberOrUndefined, stringOrUndefined} from '../../../shared/lib/utils';
import type {Category, CreateCategoryRequest, UpdateCategoryRequest} from '../model/types';

/**
 * Форма для создания/редактирования категории
 */
export interface CategoryFormData {
    name: string;
    hint: string;
    goal: string;
    tone_of_voice: string[];
    brand_rules: string[];
    creativity_level: string;
    audience_segments: string;
    len_min: string;
    len_max: string;
    n_hashtags_min: string;
    n_hashtags_max: string;
    cta_type: string;
    cta_strategy: Record<string, any>;
    good_samples: Record<string, any>[];
    bad_samples: Record<string, any>[];
    additional_info: Record<string, any>[];
    prompt_for_image_style: string;
}

/**
 * Создает пустую форму категории
 */
export const createEmptyCategoryForm = (): CategoryFormData => ({
    name: '',
    hint: '',
    goal: '',
    tone_of_voice: [],
    brand_rules: [],
    creativity_level: '',
    audience_segments: '',
    len_min: '',
    len_max: '',
    n_hashtags_min: '',
    n_hashtags_max: '',
    cta_type: '',
    cta_strategy: {},
    good_samples: [],
    bad_samples: [],
    additional_info: [],
    prompt_for_image_style: '',
});

/**
 * Преобразует Category в форму для редактирования
 */
export const categoryToForm = (category: Category): CategoryFormData => ({
    name: category.name,
    hint: category.hint || '',
    goal: category.goal || '',
    tone_of_voice: category.tone_of_voice || [],
    brand_rules: category.brand_rules || [],
    creativity_level: category.creativity_level?.toString() || '',
    audience_segments: category.audience_segments || '',
    len_min: category.len_min?.toString() || '',
    len_max: category.len_max?.toString() || '',
    n_hashtags_min: category.n_hashtags_min?.toString() || '',
    n_hashtags_max: category.n_hashtags_max?.toString() || '',
    cta_type: category.cta_type || '',
    cta_strategy: category.cta_strategy || {},
    good_samples: category.good_samples || [],
    bad_samples: category.bad_samples || [],
    additional_info: category.additional_info || [],
    prompt_for_image_style: category.prompt_for_image_style || '',
});

/**
 * Преобразует JSON в форму (для импорта)
 */
export const jsonToCategoryForm = (jsonData: any): CategoryFormData => ({
    name: jsonData.name || '',
    hint: jsonData.hint || '',
    goal: jsonData.goal || '',
    tone_of_voice: jsonData.tone_of_voice || [],
    brand_rules: jsonData.brand_rules || [],
    creativity_level: jsonData.creativity_level?.toString() || '',
    audience_segments: jsonData.audience_segments || '',
    len_min: jsonData.len_min?.toString() || '',
    len_max: jsonData.len_max?.toString() || '',
    n_hashtags_min: jsonData.n_hashtags_min?.toString() || '',
    n_hashtags_max: jsonData.n_hashtags_max?.toString() || '',
    cta_type: jsonData.cta_type || '',
    cta_strategy: jsonData.cta_strategy || {},
    good_samples: jsonData.good_samples || [],
    bad_samples: jsonData.bad_samples || [],
    additional_info: jsonData.additional_info || [],
    prompt_for_image_style: jsonData.prompt_for_image_style || '',
});

/**
 * Фильтрует массив строк от пустых значений
 */
const filterStrings = (items: string[]): string[] | undefined => {
    const filtered = items.filter(item => item.trim() !== '');
    return filtered.length > 0 ? filtered : undefined;
};

/**
 * Фильтрует массив объектов от пустых значений
 */
const filterObjects = (items: Record<string, any>[]): Record<string, any>[] | undefined => {
    const filtered = items.filter(item => Object.keys(item).length > 0);
    return filtered.length > 0 ? filtered : undefined;
};

/**
 * Фильтрует одиночный объект (возвращает undefined если пустой)
 */
const filterObject = (obj: Record<string, any>): Record<string, any> | undefined => {
    return Object.keys(obj).length > 0 ? obj : undefined;
};

/**
 * Преобразует форму в CreateCategoryRequest
 */
export const formToCreateCategoryRequest = (
    formData: CategoryFormData,
    organizationId: number
): CreateCategoryRequest => ({
    organization_id: organizationId,
    name: formData.name,
    hint: stringOrUndefined(formData.hint),
    goal: stringOrUndefined(formData.goal),
    tone_of_voice: filterStrings(formData.tone_of_voice),
    brand_rules: filterStrings(formData.brand_rules),
    creativity_level: parseNumberOrUndefined(formData.creativity_level),
    audience_segments: stringOrUndefined(formData.audience_segments),
    len_min: parseNumberOrUndefined(formData.len_min),
    len_max: parseNumberOrUndefined(formData.len_max),
    n_hashtags_min: parseNumberOrUndefined(formData.n_hashtags_min),
    n_hashtags_max: parseNumberOrUndefined(formData.n_hashtags_max),
    cta_type: stringOrUndefined(formData.cta_type),
    cta_strategy: filterObject(formData.cta_strategy),
    good_samples: filterObjects(formData.good_samples),
    bad_samples: filterObjects(formData.bad_samples),
    additional_info: filterObjects(formData.additional_info),
    prompt_for_image_style: stringOrUndefined(formData.prompt_for_image_style),
});

/**
 * Преобразует форму в UpdateCategoryRequest
 */
export const formToUpdateCategoryRequest = (formData: CategoryFormData): UpdateCategoryRequest => ({
    name: formData.name,
    hint: stringOrUndefined(formData.hint),
    goal: stringOrUndefined(formData.goal),
    tone_of_voice: filterStrings(formData.tone_of_voice) || [],
    brand_rules: filterStrings(formData.brand_rules) || [],
    creativity_level: parseNumberOrUndefined(formData.creativity_level),
    audience_segments: stringOrUndefined(formData.audience_segments),
    len_min: parseNumberOrUndefined(formData.len_min),
    len_max: parseNumberOrUndefined(formData.len_max),
    n_hashtags_min: parseNumberOrUndefined(formData.n_hashtags_min),
    n_hashtags_max: parseNumberOrUndefined(formData.n_hashtags_max),
    cta_type: stringOrUndefined(formData.cta_type),
    cta_strategy: filterObject(formData.cta_strategy),
    good_samples: filterObjects(formData.good_samples) || [],
    bad_samples: filterObjects(formData.bad_samples) || [],
    additional_info: filterObjects(formData.additional_info) || [],
    prompt_for_image_style: stringOrUndefined(formData.prompt_for_image_style),
});

/**
 * Валидация формы категории
 */
export const validateCategoryForm = (formData: CategoryFormData): string | null => {
    if (!formData.name.trim()) {
        return 'Название рубрики обязательно для заполнения';
    }
    return null;
};
