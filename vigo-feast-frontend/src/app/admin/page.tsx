"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "@/services/dashboardService";

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboardSummary();
      setData(response);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <PageContainer>
        <div className="dashboard-page">
          <div className="dashboard-header">
            <div>
              <h1>Dashboard</h1>
              <p>VIGO FEAST Admin Management Overview</p>
            </div>

            <button
              type="button"
              className="dashboard-refresh"
              onClick={loadDashboard}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="dashboard-error">
              <strong>Unable to load dashboard</strong>
              <span>{error}</span>

              <button type="button" onClick={loadDashboard}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loading">
              <div className="dashboard-loader" />
              <h3>Loading dashboard...</h3>
              <p>Fetching live data from PostgreSQL.</p>
            </div>
          ) : data ? (
            <>
              <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon">C</div>
                  <div>
                    <span>Customers</span>
                    <strong>{data.customers.total}</strong>
                    <small>
                      {data.customers.active} active
                    </small>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon">R</div>
                  <div>
                    <span>Restaurants</span>
                    <strong>{data.restaurants.total}</strong>
                    <small>
                      {data.restaurants.active} active
                    </small>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon">D</div>
                  <div>
                    <span>Delivery Partners</span>
                    <strong>{data.delivery_partners.total}</strong>
                    <small>
                      {data.delivery_partners.active} active
                    </small>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon">O</div>
                  <div>
                    <span>Total Orders</span>
                    <strong>{data.orders.total}</strong>
                    <small>
                      {data.orders.active} active
                    </small>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <div>
                      <h2>Order Overview</h2>
                      <p>Current order status summary</p>
                    </div>
                  </div>

                  <div className="dashboard-order-list">
                    <div className="dashboard-order-row">
                      <span>
                        <i className="dashboard-status-dot dashboard-dot-active" />
                        Active Orders
                      </span>
                      <strong>{data.orders.active}</strong>
                    </div>

                    <div className="dashboard-order-row">
                      <span>
                        <i className="dashboard-status-dot dashboard-dot-delivered" />
                        Delivered
                      </span>
                      <strong>{data.orders.delivered}</strong>
                    </div>

                    <div className="dashboard-order-row">
                      <span>
                        <i className="dashboard-status-dot dashboard-dot-cancelled" />
                        Cancelled
                      </span>
                      <strong>{data.orders.cancelled}</strong>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card dashboard-revenue-card">
                  <div className="dashboard-card-header">
                    <div>
                      <h2>Order Revenue</h2>
                      <p>Total non-cancelled order value</p>
                    </div>
                  </div>

                  <div className="dashboard-revenue">
                    {formatCurrency(data.revenue)}
                  </div>

                  <div className="dashboard-revenue-label">
                    Based on available order records
                  </div>
                </div>
              </div>

              <div className="dashboard-card dashboard-summary-card">
                <div className="dashboard-card-header">
                  <div>
                    <h2>Platform Summary</h2>
                    <p>Live counts from the VIGO FEAST database</p>
                  </div>
                </div>

                <div className="dashboard-summary-grid">
                  <div>
                    <span>Customers</span>
                    <strong>{data.customers.total}</strong>
                  </div>

                  <div>
                    <span>Restaurants</span>
                    <strong>{data.restaurants.total}</strong>
                  </div>

                  <div>
                    <span>Delivery Partners</span>
                    <strong>{data.delivery_partners.total}</strong>
                  </div>

                  <div>
                    <span>Orders</span>
                    <strong>{data.orders.total}</strong>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </PageContainer>
    </AdminLayout>
  );
}