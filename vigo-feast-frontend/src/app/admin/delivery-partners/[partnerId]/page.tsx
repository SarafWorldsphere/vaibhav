"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type { DeliveryPartner } from "@/types/deliveryPartner";
import { getDeliveryPartner } from "@/services/deliveryPartnerService";

export default function DeliveryPartnerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const partnerId = Number(params.partnerId);

  const [partner, setPartner] =
    useState<DeliveryPartner | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const franchiseeId =
    process.env.NEXT_PUBLIC_FRANCHISEE_ID ?? "";

  useEffect(() => {
    if (!franchiseeId || !partnerId) {
      setLoading(false);
      return;
    }

    async function loadPartner() {
      try {
        setLoading(true);
        setError(null);

        const response = await getDeliveryPartner(
          franchiseeId,
          partnerId
        );

        setPartner(response);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load delivery partner.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadPartner();
  }, [franchiseeId, partnerId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              Loading delivery partner...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/delivery-partners")
            }
            className="mb-6 text-sm font-medium text-gray-700 hover:underline"
          >
            ← Back to Delivery Partners
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!partner) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/delivery-partners")
            }
            className="mb-6 text-sm font-medium text-gray-700 hover:underline"
          >
            ← Back to Delivery Partners
          </button>

          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Delivery partner not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                router.push("/admin/delivery-partners")
              }
              className="mb-3 text-sm font-medium text-gray-600 hover:underline"
            >
              ← Back to Delivery Partners
            </button>

            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Delivery Partner Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Partner ID: {partner.partner_id}
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Edit
          </button>
        </div>

        {/* Basic Information */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Full Name
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.full_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Mobile Number
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.mobile_number}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Email
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Vehicle Type
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.vehicle_type || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Vehicle Number
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.vehicle_number || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                City
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.city || "—"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Service Area
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.service_area || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Status & Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </p>

              <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                {partner.status || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Verification
              </p>

              <p className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                {partner.verification_status || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Record Information */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Record Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Created By
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.created_by || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.created_at || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Updated By
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.updated_by || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Updated At
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {partner.updated_at || "—"}
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}