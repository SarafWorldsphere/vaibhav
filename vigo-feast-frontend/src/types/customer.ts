export interface Customer {
  customer_id: number;
  user_id: number | null;
  name: string;
  mobile: string | null;
  email: string | null;
  default_address_id: number | null;
  loyalty_points: number;
  franchisee_id: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean | null;
  is_deleted: boolean | null;
}

export interface CustomerListResponse {
  items: Customer[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
