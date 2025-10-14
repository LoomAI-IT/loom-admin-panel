// Рубрика для автопостинга
export interface AutopostingCategory {
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

export interface CreateAutopostingCategoryRequest {
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
}

export interface UpdateAutopostingCategoryRequest {
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

export interface AutopostingCategoryResponse {
    message: string;
    autoposting_category_id?: number;
}

// Автопостинг
export interface Autoposting {
    id: number;
    organization_id: number;
    autoposting_category_id: number;
    period_in_hours: number;
    filter_prompt: string;
    tg_channels: string[] | null;
    enabled: boolean;
    required_moderation: boolean;
    need_image: boolean;
    created_at: string;
}

export interface CreateAutopostingRequest {
    organization_id: number;
    autoposting_category_id: number;
    period_in_hours: number;
    filter_prompt: string;
    tg_channels?: string[] | null;
    required_moderation?: boolean;
    need_image?: boolean;
}

export interface UpdateAutopostingRequest {
    autoposting_category_id?: number;
    period_in_hours?: number;
    filter_prompt?: string;
    enabled?: boolean;
    tg_channels?: string[] | null;
    required_moderation?: boolean;
    need_image?: boolean;
}

export interface AutopostingResponse {
    message: string;
    autoposting_id?: number;
}
