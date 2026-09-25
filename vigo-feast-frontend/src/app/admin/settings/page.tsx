"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageContainer from "@/components/layout/PageContainer";
import {
  getSettingsSummary,
  type SettingsSummary,
} from "@/services/settingsService";

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function activeLabel(active: boolean | null) {
  return active ? "Active" : "Inactive";
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await getSettingsSummary();
      setData(response);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <AdminLayout>
      <PageContainer>
        <div className="settings-page">
          <div className="settings-header">
            <div>
              <h1>Settings</h1>
              <p>
                Manage VIGO FEAST platform configuration and reference data.
              </p>
            </div>

            <button
              type="button"
              className="settings-refresh"
              onClick={loadSettings}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="settings-error">
              <strong>Unable to load settings</strong>
              <span>{error}</span>

              <button type="button" onClick={loadSettings}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="settings-loading">
              <div className="settings-loader" />
              <h3>Loading settings...</h3>
              <p>Fetching configuration from PostgreSQL.</p>
            </div>
          ) : data ? (
            <>
              {/* Franchisees */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Franchisees</h2>
                    <p>
                      Registered VIGO FEAST franchise/service providers.
                    </p>
                  </div>

                  <span className="settings-count">
                    {data.franchisees.length}
                  </span>
                </div>

                {data.franchisees.length === 0 ? (
                  <div className="settings-empty">
                    No franchisees found.
                  </div>
                ) : (
                  <div className="settings-table-wrapper">
                    <table className="settings-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Franchisee ID</th>
                          <th>Status</th>
                          <th>Created</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.franchisees.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>{item.franchisee_name}</strong>
                            </td>

                            <td>
                              <span className="settings-id">
                                {item.id}
                              </span>
                            </td>

                            <td>
                              <span
                                className={
                                  item.is_active
                                    ? "settings-status settings-status-active"
                                    : "settings-status settings-status-inactive"
                                }
                              >
                                {activeLabel(item.is_active)}
                              </span>
                            </td>

                            <td>{formatDate(item.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Commission Rules */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <div>
                    <h2>Commission Rules</h2>
                    <p>
                      Current commission configuration stored in the database.
                    </p>
                  </div>

                  <span className="settings-count">
                    {data.commission_rules.length}
                  </span>
                </div>

                {data.commission_rules.length === 0 ? (
                  <div className="settings-empty">
                    No commission rules found.
                  </div>
                ) : (
                  <div className="settings-table-wrapper">
                    <table className="settings-table">
                      <thead>
                        <tr>
                          <th>Party</th>
                          <th>Type</th>
                          <th>Rate</th>
                          <th>Effective From</th>
                          <th>Effective To</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.commission_rules.map((item) => (
                          <tr key={item.rule_id}>
                            <td>
                              <strong>{item.party_type}</strong>
                            </td>

                            <td>{item.commission_type}</td>

                            <td>
                              {item.commission_rate !== null
                                ? `${item.commission_rate}%`
                                : "-"}
                            </td>

                            <td>
                              {formatDate(item.effective_from)}
                            </td>

                            <td>
                              {formatDate(item.effective_to)}
                            </td>

                            <td>
                              <span
                                className={
                                  item.is_active
                                    ? "settings-status settings-status-active"
                                    : "settings-status settings-status-inactive"
                                }
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Roles and Statuses */}
              <div className="settings-two-column">
                <div className="settings-card">
                  <div className="settings-card-header">
                    <div>
                      <h2>Roles</h2>
                      <p>Configured platform roles.</p>
                    </div>

                    <span className="settings-count">
                      {data.roles.length}
                    </span>
                  </div>

                  {data.roles.length === 0 ? (
                    <div className="settings-empty">
                      No roles found.
                    </div>
                  ) : (
                    <div className="settings-list">
                      {data.roles.map((role) => (
                        <div
                          className="settings-list-row"
                          key={role.role_id}
                        >
                          <div>
                            <strong>{role.role_name}</strong>
                            <small>
                              Role ID: {role.role_id}
                            </small>
                          </div>

                          <span
                            className={
                              role.is_active
                                ? "settings-status settings-status-active"
                                : "settings-status settings-status-inactive"
                            }
                          >
                            {activeLabel(role.is_active)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="settings-card">
                  <div className="settings-card-header">
                    <div>
                      <h2>Reference Statuses</h2>
                      <p>Available system status references.</p>
                    </div>

                    <span className="settings-count">
                      {data.reference_statuses.length}
                    </span>
                  </div>

                  {data.reference_statuses.length === 0 ? (
                    <div className="settings-empty">
                      No reference statuses found.
                    </div>
                  ) : (
                    <div className="settings-list">
                      {data.reference_statuses.map((item) => (
                        <div
                          className="settings-list-row"
                          key={item.id}
                        >
                          <div>
                            <strong>{item.status_name}</strong>
                            <small>
                              {item.status_code}
                              {item.description
                                ? ` — ${item.description}`
                                : ""}
                            </small>
                          </div>

                          <span
                            className={
                              item.is_active
                                ? "settings-status settings-status-active"
                                : "settings-status settings-status-inactive"
                            }
                          >
                            {activeLabel(item.is_active)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </PageContainer>
    </AdminLayout>
  );
}