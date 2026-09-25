import { API_CONFIG } from "@/config/api";

export interface ReportsSummary {
  overview: {
    total_orders: number;
    active_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    average_order_value: number;
  };

  platform: {
    customers: number;
    restaurants: number;
    delivery_partners: number;
  };

  order_status: Array<{
    status: string;
    count: number;
  }>;
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

export async function getReportsSummary(): Promise<ReportsSummary> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/reports/summary`
  );

  return handleResponse<ReportsSummary>(response);
}