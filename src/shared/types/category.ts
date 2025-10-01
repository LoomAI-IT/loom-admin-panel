export interface Category {
  id: number;
  organization_id: number;
  name: string;
  prompt_for_image_style: string;
  prompt_for_text_style: string;
  created_at: string;
}

export interface CreateCategoryRequest {
  organization_id: number;
  name: string;
  prompt_for_image_style: string;
  prompt_for_text_style: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  prompt_for_image_style?: string;
  prompt_for_text_style?: string;
}

export interface CategoryResponse {
  message: string;
  category_id?: number;
}
