import { API_CONFIG } from "@/config/api";

import type {
  OrderListResponse,
} from "@/types/order";

interface GetOrdersParams {
  franchiseeId?: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = errorData.detail;
      }
    } catch {
      // Ignore invalid error response.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getOrders(
  params: GetOrdersParams = {}
): Promise<OrderListResponse> {
  const query = new URLSearchParams();

  if (params.franchiseeId) {
    query.set("franchisee_id", params.franchiseeId);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.pageSize) {
    query.set("page_size", String(params.pageSize));
  }

  const url =
    `${API_CONFIG.baseUrl}/api/admin/orders` +
    (query.toString() ? `?${query.toString()}` : "");

  const response = await fetch(url);

  return handleResponse<OrderListResponse>(response);
}
