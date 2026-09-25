"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import { getCustomers } from "@/services/customerService";
import type { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError(null);

        const response = await getCustomers({
          search: search.trim() || undefined,
          isActive:
            status === "active"
              ? true
              : status === "inactive"
                ? false
                : undefined,
          page: 1,
          pageSize: 20,
        });

        setCustomers(response.items);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load customers.";

        console.error("Customers API error:", err);
        setError(message);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [search, status]);

  return (
    <AdminLayout>
      <PageContainer>
        <div className="customers-page">
          <div className="page-header">
            <div>
              <h2 className="page-title">Customers</h2>
              <p className="page-subtitle">
                Manage VIGO FEAST customers
              </p>
            </div>

            <div className="page-header-actions">
              <div className="stat-card">
                <span className="stat-label">Total Customers</span>
                <strong className="stat-value">
                  {customers.length}
                </strong>
              </div>
            </div>
          </div>

          <div className="card customers-toolbar">
            <div className="customer-search">
              <label htmlFor="customer-search">Search</label>
              <input
                id="customer-search"
                type="text"
                placeholder="Search by name, mobile or email..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="customer-status-filter">
              <label htmlFor="customer-status">Status</label>
              <select
                id="customer-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="card customers-state">
              <div className="loading-spinner" />
              <p>Loading customers...</p>
            </div>
          )}

          {error && (
            <div className="card customers-state customers-error">
              <h3>Unable to load customers</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="card customers-table-card">
              <div className="table-header">
                <div>
                  <h3>Customer List</h3>
                  <p>
                    {customers.length} customer
                    {customers.length === 1 ? "" : "s"} found
                  </p>
                </div>
              </div>

              {customers.length === 0 ? (
                <div className="customers-state">
                  <h3>No customers found</h3>
                  <p>
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table customers-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Loyalty Points</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.customer_id}>
                          <td>
                            <span className="customer-id">
                              #{customer.customer_id}
                            </span>
                          </td>

                          <td>
                            <div className="customer-name-cell">
                              <div className="customer-avatar">
                                {customer.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>{customer.name}</strong>
                                <span>
                                  Customer ID:{" "}
                                  {customer.customer_id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            {customer.mobile || (
                              <span className="muted-text">
                                Not provided
                              </span>
                            )}
                          </td>

                          <td>
                            {customer.email || (
                              <span className="muted-text">
                                Not provided
                              </span>
                            )}
                          </td>

                          <td>
                            <span className="loyalty-points">
                              {customer.loyalty_points}
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                customer.is_active
                                  ? "badge badge-success"
                                  : "badge badge-error"
                              }
                            >
                              {customer.is_active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td>
                            {new Date(
                              customer.created_at
                            ).toLocaleDateString("en-IN")}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="table-action-button"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </AdminLayout>
  );
}
