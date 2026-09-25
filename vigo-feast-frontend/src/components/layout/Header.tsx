"use client";

export default function Header() {
  return (
    <header className="admin-header">
      <div>
        <h1 className="header-title">
          VIGO FEAST
        </h1>

        <p className="header-subtitle">
          Admin Management System
        </p>
      </div>

      <div className="header-user">
        <span className="header-user-name">
          Admin
        </span>
      </div>
    </header>
  );
}