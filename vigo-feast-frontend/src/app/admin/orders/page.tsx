"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";

const statusOptions = [
  "ALL",
  "ORDERED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "order-status order-status-delivered";

    case "CANCELLED":
      return "order-status order-status-cancelled";

    case "READY_FOR_PICKUP":
      return "order-status order-status-ready";

    case "OUT_FOR_DELIVERY":
      return "order-status order-status-delivery";

    case "PREPARING":
      return "order-status order-status-preparing";

    case "CONFIRMED":
      return "order-status order-status-confirmed";

    default:
      return "order-status order-status-default";
  }
}

function formatAmount(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders({
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        page,
        pageSize: 10,
      });

      setOrders(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadOrders();
      } else {
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <AdminLayout>
      <PageContainer>
        <div className="orders-page">
          {/* Header */}
          <div className="orders-header">
            <div>
              <h1>Orders</h1>
              <p>
                Monitor and manage customer orders and delivery status.
              </p>
            </div>

            <div className="orders-total">
              <span>Total Orders</span>
              <strong>{total}</strong>
            </div>
          </div>

          {/* Filters */}
          <div className="orders-toolbar">
            <div className="order-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search order ID or customer ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="order-filter"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "All Statuses" : option}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="order-refresh"
              onClick={loadOrders}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="order-error">
              <strong>Unable to load orders</strong>
              <span>{error}</span>

              <button type="button" onClick={loadOrders}>
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          <div className="orders-card">
            {loading ? (
              <div className="order-state">
                <div className="order-loader" />
                <h3>Loading orders...</h3>
                <p>Fetching the latest order data.</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="order-state">
                <div className="order-empty-icon">⌕</div>
                <h3>No orders found</h3>
                <p>
                  {search || status !== "ALL"
                    ? "Try changing your search or filter."
                    : "There are no orders available in the database."}
                </p>
              </div>
            ) : (
              <>
                <div className="orders-table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Restaurant</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Rider</th>
                        <th>Created</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.order_id}>
                          <td>
                            <div className="order-id-cell">
                              <div className="order-avatar">
                                #
                              </div>

                              <div>
                                <strong>
                                  #{order.order_id}
                                </strong>

                                <small>
                                  Order ID
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="order-customer">
                              <strong>
                                Customer #{order.customer_id}
                              </strong>

                              <small>
                                Customer ID
                              </small>
                            </div>
                          </td>

                          <td>
                            <div className="order-restaurant">
                              <strong>
                                {order.restaurant_id
                                  ? `Restaurant ${order.restaurant_id.slice(
                                      0,
                                      8
                                    )}...`
                                  : "Not assigned"}
                              </strong>

                              <small>
                                Restaurant ID
                              </small>
                            </div>
                          </td>

                          <td>
                            <span
                              className={getStatusClass(
                                order.order_status
                              )}
                            >
                              {order.order_status.replaceAll(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                          <td>
                            <strong className="order-amount">
                              {formatAmount(order.total_amount)}
                            </strong>

                            <small className="order-subtotal">
                              Subtotal{" "}
                              {formatAmount(order.subtotal)}
                            </small>
                          </td>

                          <td>
                            {order.rider_id ? (
                              <span className="order-rider">
                                Rider #{order.rider_id}
                              </span>
                            ) : (
                              <span className="order-no-rider">
                                Not assigned
                              </span>
                            )}
                          </td>

                          <td>
                            <span className="order-date">
                              {formatDate(order.created_at)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="orders-pagination">
                  <span>
                    Showing {orders.length} of {total} orders
                  </span>

                  <div className="order-page-buttons">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() =>
                        setPage((current) => current - 1)
                      }
                    >
                      Previous
                    </button>

                    <span>
                      Page {page} of {Math.max(totalPages, 1)}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((current) => current + 1)
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </AdminLayout>
  );
}