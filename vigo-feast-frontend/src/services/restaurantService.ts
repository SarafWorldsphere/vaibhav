import { API_CONFIG } from "@/config/api";
import type { RestaurantListResponse } from "@/types/restaurant";

interface GetRestaurantsParams {
  search?: string;
  status?: string;
  isActive?: boolean;
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
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function getRestaurants(
  params: GetRestaurantsParams = {}
): Promise<RestaurantListResponse> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.isActive !== undefined) {
    query.set("is_active", String(params.isActive));
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.pageSize) {
    query.set("page_size", String(params.pageSize));
  }

  const url =
    `${API_CONFIG.baseUrl}/api/admin/restaurants` +
    (query.toString() ? `?${query.toString()}` : "");

  const response = await fetch(url);

  return handleResponse<RestaurantListResponse>(response);
}