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
