"use client";

import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>Notifications</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0" }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔔</div>
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n._id} onClick={() => !n.isRead && markAsRead(n._id)} style={{
              background: n.isRead ? "#fff" : "#f0fdf4",
              borderRadius: "12px",
              padding: "16px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: `1px solid ${n.isRead ? "#f3f4f6" : "#bbf7d0"}`,
              cursor: n.isRead ? "default" : "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}>
              <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.isRead ? "#d1d5db" : "#25d366", marginTop: "6px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>{n.subject}</span>
                    {n.isBroadcast && <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1d4ed8", padding: "1px 8px", borderRadius: "10px", fontWeight: 600 }}>Broadcast</span>}
                    {!n.isRead && <span style={{ fontSize: "11px", background: "#dcfce7", color: "#15803d", padding: "1px 8px", borderRadius: "10px", fontWeight: 600 }}>New</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{n.body}</p>
                  <div style={{ marginTop: "6px", fontSize: "12px", color: "#9ca3af" }}>
                    From {n.senderId?.name || "Admin"} · {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: "16px", padding: "2px 6px", borderRadius: "4px", flexShrink: 0 }}>✕</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
