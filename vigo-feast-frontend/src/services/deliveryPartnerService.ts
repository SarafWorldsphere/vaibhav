import { API_CONFIG } from "@/config/api";

import type {
  DeliveryPartner,
  DeliveryPartnerCreate,
  DeliveryPartnerDocument,
  DeliveryPartnerHistory,
  DeliveryPartnerListResponse,
  DeliveryPartnerStatusUpdate,
  DeliveryPartnerUpdate,
  DeliveryPartnerVerificationUpdate,
} from "@/types/deliveryPartner";


interface ListDeliveryPartnersParams {
  franchiseeId: string;
  search?: string;
  status?: string;
  verificationStatus?: string;
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
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}


export async function getDeliveryPartners(
  params: ListDeliveryPartnersParams
): Promise<DeliveryPartnerListResponse> {
  const query = new URLSearchParams();

  query.set("franchisee_id", params.franchiseeId);

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.verificationStatus) {
    query.set(
      "verification_status",
      params.verificationStatus
    );
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.pageSize) {
    query.set("page_size", String(params.pageSize));
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners?${query.toString()}`
  );

  return handleResponse<DeliveryPartnerListResponse>(response);
}


export async function getDeliveryPartner(
  franchiseeId: string,
  partnerId: number
): Promise<DeliveryPartner> {
  const query = new URLSearchParams({
    franchisee_id: franchiseeId,
  });

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners/${partnerId}?${query.toString()}`
  );

  return handleResponse<DeliveryPartner>(response);
}


export async function createDeliveryPartner(
  data: DeliveryPartnerCreate
): Promise<DeliveryPartner> {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<DeliveryPartner>(response);
}


export async function updateDeliveryPartner(
  franchiseeId: string,
  partnerId: number,
  data: DeliveryPartnerUpdate
): Promise<DeliveryPartner> {
  const query = new URLSearchParams({
    franchisee_id: franchiseeId,
  });

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners/${partnerId}?${query.toString()}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<DeliveryPartner>(response);
}


export async function updateDeliveryPartnerStatus(
  franchiseeId: string,
  partnerId: number,
  data: DeliveryPartnerStatusUpdate
): Promise<DeliveryPartner> {
  const query = new URLSearchParams({
    franchisee_id: franchiseeId,
  });

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners/${partnerId}/status?${query.toString()}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<DeliveryPartner>(response);
}


export async function updateDeliveryPartnerVerification(
  franchiseeId: string,
  partnerId: number,
  data: DeliveryPartnerVerificationUpdate
): Promise<DeliveryPartner> {
  const query = new URLSearchParams({
    franchisee_id: franchiseeId,
  });

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners/${partnerId}/verification?${query.toString()}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse<DeliveryPartner>(response);
}


export async function getDeliveryPartnerDocuments(
  franchiseeId: string,
  partnerId: number
): Promise<DeliveryPartnerDocument[]> {
  const query = new URLSearchParams({
    franchisee_id: franchiseeId,
  });

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners/${partnerId}/documents?${query.toString()}`
  );

  return handleResponse<DeliveryPartnerDocument[]>(response);
}


export async function getDeliveryPartnerHistory(
  franchiseeId: string,
  partnerId: number
): Promise<DeliveryPartnerHistory[]> {
  const query = new URLSearchParams({
    franchisee_id: franchiseeId,
  });

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/admin/delivery-partners/${partnerId}/history?${query.toString()}`
  );

  return handleResponse<DeliveryPartnerHistory[]>(response);
}