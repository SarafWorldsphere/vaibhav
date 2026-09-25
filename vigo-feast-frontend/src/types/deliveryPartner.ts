export interface DeliveryPartner {
  partner_id: number;
  franchisee_id: string;

  full_name: string;
  mobile_number: string;
  email: string | null;

  vehicle_type: string | null;
  vehicle_number: string | null;

  city: string | null;
  service_area: string | null;

  status: string | null;
  verification_status: string | null;

  created_by: string | null;
  created_at: string | null;

  updated_by: string | null;
  updated_at: string | null;
}

export interface DeliveryPartnerCreate {
  franchisee_id: string;

  full_name: string;
  mobile_number: string;
  email?: string | null;

  vehicle_type?: string | null;
  vehicle_number?: string | null;

  city?: string | null;
  service_area?: string | null;

  created_by?: string | null;
}

export interface DeliveryPartnerUpdate {
  full_name?: string;
  mobile_number?: string;
  email?: string | null;

  vehicle_type?: string | null;
  vehicle_number?: string | null;

  city?: string | null;
  service_area?: string | null;

  updated_by?: string | null;
}

export interface DeliveryPartnerStatusUpdate {
  status: string;
  reason?: string | null;
  changed_by?: string | null;
}

export interface DeliveryPartnerVerificationUpdate {
  verification_status: string;
  verified_by?: string | null;
}

export interface DeliveryPartnerDocument {
  document_id: number;
  franchisee_id: string | null;
  partner_id: number | null;

  document_type: string | null;
  document_number: string | null;
  file_url: string | null;

  verification_status: string | null;
  verified_by: string | null;
  verified_at: string | null;
}

export interface DeliveryPartnerHistory {
  log_id: number;
  franchisee_id: string | null;
  partner_id: number | null;

  old_status: string | null;
  new_status: string | null;
  reason: string | null;

  changed_by: string | null;
  changed_at: string | null;
}

export interface DeliveryPartnerListResponse {
  items: DeliveryPartner[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}