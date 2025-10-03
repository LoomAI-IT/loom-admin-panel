export interface Category {
  id: number;
  organization_id: number;
  name: string;
  prompt_for_image_style: string;

  goal: string;

  // Структура контента
  structure_skeleton: string[];
  structure_flex_level_min: number;
  structure_flex_level_max: number;
  structure_flex_level_comment: string;

  // Требования к контенту
  must_have: string[];
  must_avoid: string[];

  // Правила для соцсетей
  social_networks_rules: string;

  // Ограничения по длине
  len_min: number;
  len_max: number;

  // Ограничения по хештегам
  n_hashtags_min: number;
  n_hashtags_max: number;

  // Стиль и тон
  cta_type: string;
  tone_of_voice: string[];

  // Бренд и примеры
  brand_rules: string[];
  good_samples: Record<string, any>[];

  // Дополнительная информация
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
