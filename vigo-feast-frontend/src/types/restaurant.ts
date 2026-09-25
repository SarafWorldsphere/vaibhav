export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  status: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
}

export interface RestaurantListResponse {
  items: Restaurant[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}