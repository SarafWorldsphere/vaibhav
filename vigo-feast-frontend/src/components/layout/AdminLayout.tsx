"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="mobile-brand">
            <span>VIGO FEAST</span>
            <small>Admin</small>
          </div>
        </div>

        <Header />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}