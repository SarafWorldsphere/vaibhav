"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Restaurants", href: "/admin/restaurants" },
  { label: "Delivery Partners", href: "/admin/delivery-partners" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Reports & Analytics", href: "/admin/reports" },
  { label: "Settings", href: "/admin/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">VIGO FEAST</div>
          <div className="sidebar-logo-subtitle">Admin Panel</div>

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-close-button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`sidebar-link ${
                  isActive ? "sidebar-link-active" : ""
                }`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}