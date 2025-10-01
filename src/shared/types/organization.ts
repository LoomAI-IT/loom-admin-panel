export interface Organization {
  id: number;
  name: string;
  rub_balance: string;
  autoposting_moderation: boolean;
  video_cut_description_end_sample: string | null;
  publication_text_end_sample: string | null;
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
  autoposting_moderation?: boolean;
  video_cut_description_end_sample?: string;
  publication_text_end_sample?: string;
}

export interface UpdateOrganizationResponse {
  message: string;
}

export interface DeleteOrganizationResponse {
  message: string;
}
