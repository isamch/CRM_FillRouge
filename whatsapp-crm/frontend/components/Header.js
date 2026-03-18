"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUnreadCount } from "@/hooks/useNotifications";
import api from "@/lib/api";

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
  const router = useRouter();
  const title = pageTitles[pathname] || "Dashboard";
  const { count, refresh } = useUnreadCount();
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const dropdownRef = useRef(null);

  const fetchRecent = async () => {
    try {
      const { data } = await api.get("/notifications/inbox?limit=5");
      setRecent(data.data.data);
    } catch { /* ignore */ }
  };

  const toggleDropdown = () => {
    if (!open) fetchRecent();
    setOpen((v) => !v);
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    refresh();
    setRecent((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header style={{ height: "64px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
      <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Bell */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button onClick={toggleDropdown} style={{ background: "transparent", border: "none", cursor: "pointer", position: "relative", padding: "4px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {count > 0 && (
              <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#ef4444", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div style={{ position: "absolute", right: 0, top: "36px", width: "340px", background: "#fff", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", zIndex: 100 }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>Notifications</span>
                <button onClick={() => { setOpen(false); router.push("/dashboard/notifications"); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#25d366", fontWeight: 600 }}>View all</button>
              </div>
              {recent.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>No notifications</div>
              ) : (
                recent.map((n) => (
                  <div key={n._id} onClick={() => markRead(n._id)} style={{ padding: "12px 16px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: n.isRead ? "#fff" : "#f0fdf4", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: n.isRead ? "#d1d5db" : "#25d366", marginTop: "5px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "13px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.subject}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.body}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "3px" }}>{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
