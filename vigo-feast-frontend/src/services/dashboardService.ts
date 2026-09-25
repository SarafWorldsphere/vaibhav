import { API_CONFIG } from "@/config/api";

export interface DashboardSummary {
  customers: {
    total: number;
    active: number;
  };
  restaurants: {
    total: number;
    active: number;
  };
  delivery_partners: {
    total: number;
    active: number;
  };
  orders: {
    total: number;
    active: number;
    delivered: number;
    cancelled: number;
  };
  revenue: number;
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

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/dashboard/summary`
  );

  return handleResponse<DashboardSummary>(response);
}