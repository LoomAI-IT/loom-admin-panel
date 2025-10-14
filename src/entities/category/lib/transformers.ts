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
    goal: string;
    prompt_for_image_style: string;
    structure_skeleton: string[];
    structure_flex_level_min: string;
    structure_flex_level_max: string;
    structure_flex_level_comment: string;
    must_have: string[];
    must_avoid: string[];
    social_networks_rules: string;
    len_min: string;
    len_max: string;
    n_hashtags_min: string;
    n_hashtags_max: string;
    cta_type: string;
    tone_of_voice: string[];
    brand_rules: string[];
    good_samples: Record<string, any>[];
    additional_info: string[];
}

/**
 * Создает пустую форму категории
 */
export const createEmptyCategoryForm = (): CategoryFormData => ({
    name: '',
    goal: '',
    prompt_for_image_style: '',
    structure_skeleton: [],
    structure_flex_level_min: '',
    structure_flex_level_max: '',
    structure_flex_level_comment: '',
    must_have: [],
    must_avoid: [],
    social_networks_rules: '',
    len_min: '',
    len_max: '',
    n_hashtags_min: '',
    n_hashtags_max: '',
    cta_type: '',
    tone_of_voice: [],
    brand_rules: [],
    good_samples: [],
    additional_info: [],
});

/**
 * Преобразует Category в форму для редактирования
 */
export const categoryToForm = (category: Category): CategoryFormData => ({
    name: category.name,
    goal: category.goal || '',
    prompt_for_image_style: category.prompt_for_image_style || '',
    structure_skeleton: category.structure_skeleton || [],
    structure_flex_level_min: category.structure_flex_level_min?.toString() || '',
    structure_flex_level_max: category.structure_flex_level_max?.toString() || '',
    structure_flex_level_comment: category.structure_flex_level_comment || '',
    must_have: category.must_have || [],
    must_avoid: category.must_avoid || [],
    social_networks_rules: category.social_networks_rules || '',
    len_min: category.len_min?.toString() || '',
    len_max: category.len_max?.toString() || '',
    n_hashtags_min: category.n_hashtags_min?.toString() || '',
    n_hashtags_max: category.n_hashtags_max?.toString() || '',
    cta_type: category.cta_type || '',
    tone_of_voice: category.tone_of_voice || [],
    brand_rules: category.brand_rules || [],
    good_samples: category.good_samples || [],
    additional_info: category.additional_info || [],
});

/**
 * Преобразует JSON в форму (для импорта)
 */
export const jsonToCategoryForm = (jsonData: any): CategoryFormData => ({
    name: jsonData.name || '',
    goal: jsonData.goal || '',
    prompt_for_image_style: jsonData.prompt_for_image_style || '',
    structure_skeleton: jsonData.structure_skeleton || [],
    structure_flex_level_min: jsonData.structure_flex_level_min?.toString() || '',
    structure_flex_level_max: jsonData.structure_flex_level_max?.toString() || '',
    structure_flex_level_comment: jsonData.structure_flex_level_comment || '',
    must_have: jsonData.must_have || [],
    must_avoid: jsonData.must_avoid || [],
    social_networks_rules: jsonData.social_networks_rules || '',
    len_min: jsonData.len_min?.toString() || '',
    len_max: jsonData.len_max?.toString() || '',
    n_hashtags_min: jsonData.n_hashtags_min?.toString() || '',
    n_hashtags_max: jsonData.n_hashtags_max?.toString() || '',
    cta_type: jsonData.cta_type || '',
    tone_of_voice: jsonData.tone_of_voice || [],
    brand_rules: jsonData.brand_rules || [],
    good_samples: jsonData.good_samples || [],
    additional_info: jsonData.additional_info || [],
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
 * Преобразует форму в CreateCategoryRequest
 */
export const formToCreateCategoryRequest = (
    formData: CategoryFormData,
    organizationId: number
): CreateCategoryRequest => ({
    organization_id: organizationId,
    name: formData.name,
    goal: stringOrUndefined(formData.goal),
    prompt_for_image_style: stringOrUndefined(formData.prompt_for_image_style),
    structure_skeleton: filterStrings(formData.structure_skeleton),
    structure_flex_level_min: parseNumberOrUndefined(formData.structure_flex_level_min),
    structure_flex_level_max: parseNumberOrUndefined(formData.structure_flex_level_max),
    structure_flex_level_comment: stringOrUndefined(formData.structure_flex_level_comment),
    must_have: filterStrings(formData.must_have),
    must_avoid: filterStrings(formData.must_avoid),
    social_networks_rules: stringOrUndefined(formData.social_networks_rules),
    len_min: parseNumberOrUndefined(formData.len_min),
    len_max: parseNumberOrUndefined(formData.len_max),
    n_hashtags_min: parseNumberOrUndefined(formData.n_hashtags_min),
    n_hashtags_max: parseNumberOrUndefined(formData.n_hashtags_max),
    cta_type: stringOrUndefined(formData.cta_type),
    tone_of_voice: filterStrings(formData.tone_of_voice),
    brand_rules: filterStrings(formData.brand_rules),
    good_samples: filterObjects(formData.good_samples),
    additional_info: filterStrings(formData.additional_info),
});

/**
 * Преобразует форму в UpdateCategoryRequest
 */
export const formToUpdateCategoryRequest = (formData: CategoryFormData): UpdateCategoryRequest => ({
    name: formData.name,
    goal: stringOrUndefined(formData.goal),
    prompt_for_image_style: stringOrUndefined(formData.prompt_for_image_style),
    structure_skeleton: filterStrings(formData.structure_skeleton) || [],
    structure_flex_level_min: parseNumberOrUndefined(formData.structure_flex_level_min),
    structure_flex_level_max: parseNumberOrUndefined(formData.structure_flex_level_max),
    structure_flex_level_comment: stringOrUndefined(formData.structure_flex_level_comment),
    must_have: filterStrings(formData.must_have) || [],
    must_avoid: filterStrings(formData.must_avoid) || [],
    social_networks_rules: stringOrUndefined(formData.social_networks_rules),
    len_min: parseNumberOrUndefined(formData.len_min),
    len_max: parseNumberOrUndefined(formData.len_max),
    n_hashtags_min: parseNumberOrUndefined(formData.n_hashtags_min),
    n_hashtags_max: parseNumberOrUndefined(formData.n_hashtags_max),
    cta_type: stringOrUndefined(formData.cta_type),
    tone_of_voice: filterStrings(formData.tone_of_voice) || [],
    brand_rules: filterStrings(formData.brand_rules) || [],
    good_samples: filterObjects(formData.good_samples) || [],
    additional_info: filterStrings(formData.additional_info) || [],
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
