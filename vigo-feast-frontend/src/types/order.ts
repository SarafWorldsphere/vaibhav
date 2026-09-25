export interface Order {
  order_id: number;
  customer_id: number;
  rider_id: number | null;
  restaurant_id: string | null;
  order_status: string;
  subtotal: number;
  gst_amount: number;
  delivery_charge: number;
  discount_amount: number;
  total_amount: number;
  cancellation_status: string | null;
  delivery_eta: string | null;
  offer_id: number | null;
  franchisee_id: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean | null;
  is_deleted: boolean | null;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
