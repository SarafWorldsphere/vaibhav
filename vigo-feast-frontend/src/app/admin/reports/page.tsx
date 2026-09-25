"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import {
  getReportsSummary,
  type ReportsSummary,
} from "@/services/reportsService";

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const response = await getReportsSummary();
      setData(response);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <AdminLayout>
      <PageContainer>
        <div className="reports-page">
          <div className="reports-header">
            <div>
              <h1>Reports & Analytics</h1>
              <p>
                Monitor VIGO FEAST platform performance using live database
                data.
              </p>
            </div>

            <button
              type="button"
              className="reports-refresh"
              onClick={loadReports}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="reports-error">
              <strong>Unable to load reports</strong>
              <span>{error}</span>

              <button type="button" onClick={loadReports}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="reports-loading">
              <div className="reports-loader" />
              <h3>Loading reports...</h3>
              <p>Fetching live analytics from PostgreSQL.</p>
            </div>
          ) : data ? (
            <>
              {/* Overview */}
              <div className="reports-section-title">
                <h2>Order Overview</h2>
                <span>Current database totals</span>
              </div>

              <div className="reports-stats">
                <div className="reports-stat-card">
                  <span>Total Orders</span>
                  <strong>{data.overview.total_orders}</strong>
                  <small>All non-deleted orders</small>
                </div>

                <div className="reports-stat-card">
                  <span>Active Orders</span>
                  <strong>{data.overview.active_orders}</strong>
                  <small>Orders currently in progress</small>
                </div>

                <div className="reports-stat-card">
                  <span>Delivered</span>
                  <strong>{data.overview.delivered_orders}</strong>
                  <small>Successfully delivered</small>
                </div>

                <div className="reports-stat-card">
                  <span>Cancelled</span>
                  <strong>{data.overview.cancelled_orders}</strong>
                  <small>Cancelled orders</small>
                </div>
              </div>

              {/* Revenue */}
              <div className="reports-grid">
                <div className="reports-card">
                  <div className="reports-card-header">
                    <div>
                      <h2>Revenue</h2>
                      <p>Total value of non-cancelled orders</p>
                    </div>
                  </div>

                  <div className="reports-revenue">
                    {formatCurrency(data.overview.total_revenue)}
                  </div>

                  <div className="reports-average">
                    Average Order Value
                    <strong>
                      {formatCurrency(
                        data.overview.average_order_value
                      )}
                    </strong>
                  </div>
                </div>

                {/* Platform */}
                <div className="reports-card">
                  <div className="reports-card-header">
                    <div>
                      <h2>Platform Overview</h2>
                      <p>Current platform records</p>
                    </div>
                  </div>

                  <div className="reports-platform-list">
                    <div>
                      <span>Customers</span>
                      <strong>{data.platform.customers}</strong>
                    </div>

                    <div>
                      <span>Restaurants</span>
                      <strong>{data.platform.restaurants}</strong>
                    </div>

                    <div>
                      <span>Delivery Partners</span>
                      <strong>
                        {data.platform.delivery_partners}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="reports-card reports-status-card">
                <div className="reports-card-header">
                  <div>
                    <h2>Order Status Distribution</h2>
                    <p>
                      Orders grouped by their current status
                    </p>
                  </div>
                </div>

                {data.order_status.length === 0 ? (
                  <div className="reports-empty">
                    No order status data available.
                  </div>
                ) : (
                  <div className="reports-status-list">
                    {data.order_status.map((item) => (
                      <div
                        className="reports-status-row"
                        key={item.status}
                      >
                        <div className="reports-status-name">
                          <span className="reports-status-dot" />
                          <span>
                            {item.status.replaceAll("_", " ")}
                          </span>
                        </div>

                        <strong>{item.count}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </PageContainer>
    </AdminLayout>
  );
}