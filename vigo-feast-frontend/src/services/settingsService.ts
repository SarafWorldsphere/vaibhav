import { API_CONFIG } from "@/config/api";

export interface FranchiseeSetting {
  id: string;
  franchisee_name: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CommissionRuleSetting {
  rule_id: number;
  party_type: string;
  commission_type: string;
  commission_rate: number | null;
  effective_from: string | null;
  effective_to: string | null;
  status: string;
  franchisee_id: string | null;
  is_active: boolean | null;
}

export interface RoleSetting {
  role_id: number;
  role_name: string;
  franchisee_id: string | null;
  is_active: boolean | null;
}

export interface ReferenceStatusSetting {
  id: string;
  status_code: string;
  status_name: string;
  description: string | null;
  is_active: boolean;
}

export interface SettingsSummary {
  franchisees: FranchiseeSetting[];
  commission_rules: CommissionRuleSetting[];
  roles: RoleSetting[];
  reference_statuses: ReferenceStatusSetting[];
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

export async function getSettingsSummary(): Promise<SettingsSummary> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/settings/summary`
  );

  return handleResponse<SettingsSummary>(response);
}