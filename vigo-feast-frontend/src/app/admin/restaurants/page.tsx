"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import { getRestaurants } from "@/services/restaurantService";
import type { Restaurant } from "@/types/restaurant";

const statusOptions = ["ALL", "ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"];

function getStatusClass(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "restaurant-status restaurant-status-active";
    case "INACTIVE":
      return "restaurant-status restaurant-status-inactive";
    case "PENDING":
      return "restaurant-status restaurant-status-pending";
    case "SUSPENDED":
      return "restaurant-status restaurant-status-suspended";
    default:
      return "restaurant-status";
  }
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRestaurants() {
    try {
      setLoading(true);
      setError("");

      const response = await getRestaurants({
        search: search.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        page,
        pageSize: 10,
      });

      setRestaurants(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load restaurants."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        loadRestaurants();
      } else {
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <AdminLayout>
      <PageContainer>
        <div className="restaurants-page">
          {/* Header */}
          <div className="restaurants-header">
            <div>
              <h1>Restaurants</h1>
              <p>Manage registered restaurants and their status.</p>
            </div>

            <div className="restaurants-total">
              <span>Total Restaurants</span>
              <strong>{total}</strong>
            </div>
          </div>

          {/* Filters */}
          <div className="restaurants-toolbar">
            <div className="restaurant-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search restaurant, phone, email, city..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="restaurant-filter"
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
              className="restaurant-refresh"
              onClick={loadRestaurants}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="restaurant-error">
              <strong>Unable to load restaurants</strong>
              <span>{error}</span>

              <button type="button" onClick={loadRestaurants}>
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          <div className="restaurants-card">
            {loading ? (
              <div className="restaurant-state">
                <div className="restaurant-loader" />
                <h3>Loading restaurants...</h3>
                <p>Fetching the latest restaurant data.</p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="restaurant-state">
                <div className="restaurant-empty-icon">⌕</div>
                <h3>No restaurants found</h3>
                <p>
                  {search || status !== "ALL"
                    ? "Try changing your search or filter."
                    : "There are no restaurants available in the database."}
                </p>
              </div>
            ) : (
              <>
                <div className="restaurants-table-wrapper">
                  <table className="restaurants-table">
                    <thead>
                      <tr>
                        <th>Restaurant</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Active</th>
                        <th>Created</th>
                      </tr>
                    </thead>

                    <tbody>
                      {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                          <td>
                            <div className="restaurant-name-cell">
                              <div className="restaurant-avatar">
                                {restaurant.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>{restaurant.name}</strong>

                                <small>
                                  ID: {restaurant.id.slice(0, 8)}...
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="restaurant-contact">
                              <span>
                                {restaurant.phone || "No phone"}
                              </span>

                              <small>
                                {restaurant.email || "No email"}
                              </small>
                            </div>
                          </td>

                          <td>
                            <div className="restaurant-location">
                              <strong>
                                {restaurant.city}
                              </strong>

                              <span>
                                {restaurant.state}{" "}
                                {restaurant.postal_code}
                              </span>
                            </div>
                          </td>

                          <td>
                            <span
                              className={getStatusClass(
                                restaurant.status
                              )}
                            >
                              {restaurant.status}
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                restaurant.is_active
                                  ? "restaurant-active"
                                  : "restaurant-inactive"
                              }
                            >
                              <span className="restaurant-dot" />
                              {restaurant.is_active
                                ? "Yes"
                                : "No"}
                            </span>
                          </td>

                          <td>
                            <span className="restaurant-date">
                              {formatDate(
                                restaurant.created_at
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="restaurants-pagination">
                  <span>
                    Showing {restaurants.length} of {total} restaurants
                  </span>

                  <div className="restaurant-page-buttons">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => current - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {page} of {Math.max(totalPages, 1)}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((current) => current + 1)}
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