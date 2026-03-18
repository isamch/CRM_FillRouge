"use client";

import { usePathname } from "next/navigation";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/conversations": "Conversations",
  "/dashboard/contacts": "Contacts",
  "/dashboard/templates": "Templates",
  "/dashboard/campaigns": "Campaigns",
  "/dashboard/notifications": "Notifications",
  "/dashboard/settings": "Settings",
  "/dashboard/admin": "Admin Panel",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header style={{
      height: "64px", background: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px", flexShrink: 0,
    }}>
      <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button style={{
          background: "transparent", border: "none",
          cursor: "pointer", position: "relative", padding: "4px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
