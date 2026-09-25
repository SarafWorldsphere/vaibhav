"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import { API_CONFIG } from "@/config/api";

import { getDeliveryPartners } from "@/services/deliveryPartnerService";

import type {
  DeliveryPartner,
  DeliveryPartnerListResponse,
} from "@/types/deliveryPartner";

export default function DeliveryPartnersPage() {
  const router = useRouter();

  const franchiseeId = API_CONFIG.franchiseeId;

  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function loadPartners() {
      if (!franchiseeId) {
        setError("Franchisee ID is not configured.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response: DeliveryPartnerListResponse =
          await getDeliveryPartners({
            franchiseeId,
            search: search.trim() || undefined,
            status: status || undefined,
            verificationStatus:
              verificationStatus || undefined,
            page,
            pageSize,
          });

        setPartners(response.items);
        setTotal(response.total);
        setTotalPages(response.total_pages);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load delivery partners.";

        console.error("Delivery Partners API error:", err);

        setError(message);
        setPartners([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }

    loadPartners();
  }, [
    franchiseeId,
    search,
    status,
    verificationStatus,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [search, status, verificationStatus]);

  const handleView = (partnerId: number) => {
    router.push(`/admin/delivery-partners/${partnerId}`);
  };

  const getStatusClass = (value: string | null) => {
    switch (value) {
      case "ACTIVE":
        return "badge-success";
      case "SUSPENDED":
        return "badge-error";
      case "PENDING":
        return "badge-warning";
      default:
        return "badge-secondary";
    }
  };

  const getVerificationClass = (value: string | null) => {
    switch (value) {
      case "VERIFIED":
        return "badge-success";
      case "REJECTED":
        return "badge-error";
      default:
        return "badge-warning";
    }
  };

  return (
    <AdminLayout>
      <PageContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)] sm:text-3xl">
              Delivery Partners
            </h1>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Manage delivery partners, verification and status.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
          >
            Add Delivery Partner
          </button>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="mb-1.5 block text-sm font-medium text-[var(--text)]"
              >
                Search
              </label>

              <input
                id="search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, mobile, email or vehicle..."
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium text-[var(--text)]"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="select"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="verification"
                className="mb-1.5 block text-sm font-medium text-[var(--text)]"
              >
                Verification
              </label>

              <select
                id="verification"
                value={verificationStatus}
                onChange={(event) => {
                  setVerificationStatus(event.target.value);
                  setPage(1);
                }}
                className="select"
              >
                <option value="">All Verification</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="card text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Loading delivery partners...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-[var(--error)]">
              {error}
            </p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && partners.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Showing{" "}
                <span className="font-semibold text-[var(--text)]">
                  {partners.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[var(--text)]">
                  {total}
                </span>{" "}
                delivery partners
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#fff7ed]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Partner
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Mobile
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Vehicle
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        City
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                        Verification
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border-light)]">
                    {partners.map((partner) => (
                      <tr
                        key={partner.partner_id}
                        className="transition hover:bg-[#fffdf8]"
                      >
                        <td className="px-5 py-4">
                          <div className="font-medium text-[var(--text)]">
                            {partner.full_name}
                          </div>

                          <div className="text-xs text-[var(--text-secondary)]">
                            ID: {partner.partner_id}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {partner.mobile_number}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {partner.vehicle_type || "—"}
                          {partner.vehicle_number && (
                            <div className="text-xs text-[var(--text-secondary)]">
                              {partner.vehicle_number}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {partner.city || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={getStatusClass(
                              partner.status
                            )}
                          >
                            {partner.status || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={getVerificationClass(
                              partner.verification_status
                            )}
                          >
                            {partner.verification_status || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleView(partner.partner_id)
                            }
                            className="font-medium text-[var(--secondary)] hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              {partners.map((partner) => (
                <div
                  key={partner.partner_id}
                  className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold">
                        {partner.full_name}
                      </h2>

                      <p className="text-xs text-[var(--text-secondary)]">
                        Partner ID: {partner.partner_id}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleView(partner.partner_id)
                      }
                      className="font-medium text-[var(--secondary)]"
                    >
                      View
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Mobile
                      </p>
                      <p>{partner.mobile_number}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        City
                      </p>
                      <p>{partner.city || "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Vehicle
                      </p>
                      <p>{partner.vehicle_type || "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Status
                      </p>
                      <span
                        className={getStatusClass(
                          partner.status
                        )}
                      >
                        {partner.status || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-[var(--text-secondary)]">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                  className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          franchiseeId &&
          partners.length === 0 && (
            <div className="card text-center">
              <h2 className="text-lg font-semibold">
                No delivery partners
              </h2>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                No delivery partners match the selected filters.
              </p>
            </div>
          )}
      </PageContainer>
    </AdminLayout>
  );
}