const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const FRANCHISEE_ID =
  process.env.NEXT_PUBLIC_FRANCHISEE_ID || "";

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  franchiseeId: FRANCHISEE_ID,
} as const;
