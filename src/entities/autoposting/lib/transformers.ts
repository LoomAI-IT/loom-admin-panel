/**
 * Трансформеры для работы с автопостингом
 * Преобразование между API моделью и формой
 */

import type {
  Autoposting,
  AutopostingCategory,
  CreateAutopostingRequest,
  CreateAutopostingCategoryRequest,
  UpdateAutopostingRequest,
  UpdateAutopostingCategoryRequest,
} from '../model/types';

/**
 * Форма для создания/редактирования автопостинга
 * Объединяет поля AutopostingCategory и Autoposting
 */
export interface AutopostingFormData {
  // Поля категории
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
  // Поля автопостинга
  period_in_hours: string;
  filter_prompt: string;
  tg_channels: string[];
  required_moderation: boolean;
  need_image: boolean;
}

/**
 * Создает пустую форму автопостинга
 */
export const createEmptyAutopostingForm = (): AutopostingFormData => ({
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
  period_in_hours: '',
  filter_prompt: '',
  tg_channels: [],
  required_moderation: false,
  need_image: false,
});

/**
 * Преобразует AutopostingCategory и Autoposting в форму для редактирования
 */
export const autopostingToForm = (
  autoposting: Autoposting,
  category: AutopostingCategory
): AutopostingFormData => ({
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
  period_in_hours: autoposting.period_in_hours?.toString() || '',
  filter_prompt: autoposting.filter_prompt || '',
  tg_channels: autoposting.tg_channels || [],
  required_moderation: autoposting.required_moderation || false,
  need_image: autoposting.need_image || false,
});

/**
 * Преобразует JSON в форму (для импорта)
 */
export const jsonToForm = (jsonData: any): AutopostingFormData => ({
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
  period_in_hours: jsonData.period_in_hours?.toString() || '',
  filter_prompt: jsonData.filter_prompt || '',
  tg_channels: jsonData.tg_channels || [],
  required_moderation: jsonData.required_moderation || false,
  need_image: jsonData.need_image || false,
});

/**
 * Фильтрует массив строк от пустых значений
 */
const filterStrings = (items: string[]): string[] => {
  return items.filter(item => item.trim() !== '');
};

/**
 * Фильтрует массив объектов от пустых значений
 */
const filterObjects = (items: Record<string, any>[]): Record<string, any>[] => {
  return items.filter(item => Object.keys(item).length > 0);
};

/**
 * Преобразует форму в CreateAutopostingCategoryRequest
 */
export const formToCreateCategoryRequest = (
  formData: AutopostingFormData,
  organizationId: number
): CreateAutopostingCategoryRequest => ({
  organization_id: organizationId,
  name: formData.name,
  prompt_for_image_style: formData.prompt_for_image_style,
  goal: formData.goal,
  structure_skeleton: filterStrings(formData.structure_skeleton),
  structure_flex_level_min: parseInt(formData.structure_flex_level_min) || 0,
  structure_flex_level_max: parseInt(formData.structure_flex_level_max) || 0,
  structure_flex_level_comment: formData.structure_flex_level_comment,
  must_have: filterStrings(formData.must_have),
  must_avoid: filterStrings(formData.must_avoid),
  social_networks_rules: formData.social_networks_rules,
  len_min: parseInt(formData.len_min) || 0,
  len_max: parseInt(formData.len_max) || 0,
  n_hashtags_min: parseInt(formData.n_hashtags_min) || 0,
  n_hashtags_max: parseInt(formData.n_hashtags_max) || 0,
  cta_type: formData.cta_type,
  tone_of_voice: filterStrings(formData.tone_of_voice),
  brand_rules: filterStrings(formData.brand_rules),
  good_samples: filterObjects(formData.good_samples),
  additional_info: filterStrings(formData.additional_info),
});

/**
 * Преобразует форму в UpdateAutopostingCategoryRequest
 */
export const formToUpdateCategoryRequest = (
  formData: AutopostingFormData
): UpdateAutopostingCategoryRequest => ({
  name: formData.name,
  prompt_for_image_style: formData.prompt_for_image_style,
  goal: formData.goal,
  structure_skeleton: filterStrings(formData.structure_skeleton),
  structure_flex_level_min: parseInt(formData.structure_flex_level_min) || 0,
  structure_flex_level_max: parseInt(formData.structure_flex_level_max) || 0,
  structure_flex_level_comment: formData.structure_flex_level_comment,
  must_have: filterStrings(formData.must_have),
  must_avoid: filterStrings(formData.must_avoid),
  social_networks_rules: formData.social_networks_rules,
  len_min: parseInt(formData.len_min) || 0,
  len_max: parseInt(formData.len_max) || 0,
  n_hashtags_min: parseInt(formData.n_hashtags_min) || 0,
  n_hashtags_max: parseInt(formData.n_hashtags_max) || 0,
  cta_type: formData.cta_type,
  tone_of_voice: filterStrings(formData.tone_of_voice),
  brand_rules: filterStrings(formData.brand_rules),
  good_samples: filterObjects(formData.good_samples),
  additional_info: filterStrings(formData.additional_info),
});

/**
 * Преобразует форму в CreateAutopostingRequest
 */
export const formToCreateAutopostingRequest = (
  formData: AutopostingFormData,
  organizationId: number,
  categoryId: number
): CreateAutopostingRequest => {
  const filteredChannels = filterStrings(formData.tg_channels);
  return {
    organization_id: organizationId,
    autoposting_category_id: categoryId,
    period_in_hours: parseInt(formData.period_in_hours),
    filter_prompt: formData.filter_prompt,
    tg_channels: filteredChannels.length > 0 ? filteredChannels : null,
    required_moderation: formData.required_moderation,
    need_image: formData.need_image,
  };
};

/**
 * Преобразует форму в UpdateAutopostingRequest
 */
export const formToUpdateAutopostingRequest = (
  formData: AutopostingFormData
): UpdateAutopostingRequest => {
  const filteredChannels = filterStrings(formData.tg_channels);
  return {
    period_in_hours: parseInt(formData.period_in_hours),
    filter_prompt: formData.filter_prompt,
    tg_channels: filteredChannels.length > 0 ? filteredChannels : null,
    required_moderation: formData.required_moderation,
    need_image: formData.need_image,
  };
};

/**
 * Валидация формы автопостинга
 */
export const validateAutopostingForm = (formData: AutopostingFormData): string | null => {
  if (!formData.name.trim()) {
    return 'Название рубрики обязательно для заполнения';
  }
  if (!formData.period_in_hours || parseInt(formData.period_in_hours) < 1) {
    return 'Период в часах должен быть не менее 1';
  }
  if (!formData.filter_prompt.trim()) {
    return 'Промпт фильтра обязателен для заполнения';
  }
  return null;
};
