"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const STATUS_COLOR = {
  draft: "#6b7280", running: "#10b981", paused: "#f59e0b",
  scheduled: "#3b82f6", completed: "#8b5cf6", stopped: "#ef4444",
};

const WA_STATUS = {
  connected:    { color: "#10b981", bg: "#dcfce7", label: "Connected" },
  qr_pending:   { color: "#f59e0b", bg: "#fef3c7", label: "Scan QR" },
  disconnected: { color: "#ef4444", bg: "#fee2e2", label: "Disconnected" },
};

export default function DashboardPage() {
  const { stats, loading } = useDashboard();
  const { user } = useAuthContext();
  const router = useRouter();

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>
  );

  const waStatus = WA_STATUS[stats?.whatsappStatus] || WA_STATUS.disconnected;

  const statCards = [
    { label: "Total Contacts", value: stats?.totalContacts ?? 0, icon: "👥", color: "#3b82f6", href: "/dashboard/contacts" },
    { label: "Contact Lists", value: stats?.totalLists ?? 0, icon: "📋", color: "#8b5cf6", href: "/dashboard/contacts" },
    { label: "Templates", value: stats?.totalTemplates ?? 0, icon: "📄", color: "#f59e0b", href: "/dashboard/templates" },
    { label: "Campaigns", value: stats?.totalCampaigns ?? 0, icon: "📢", color: "#10b981", href: "/dashboard/campaigns" },
    { label: "Messages Sent", value: stats?.messageCount ?? 0, icon: "💬", color: "#ec4899", href: "/dashboard/conversations" },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Welcome */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Here's what's happening with your account</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {statCards.map(({ label, value, icon, color, href }) => (
          <div key={label} onClick={() => router.push(href)} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", cursor: "pointer", transition: "box-shadow 0.15s", border: "1px solid #f3f4f6" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color, marginBottom: "4px" }}>{value}</div>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        {/* WhatsApp Status Card */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6", height: "fit-content" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>WhatsApp Status</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: "#111827" }}>WhatsApp</div>
              <span style={{ background: waStatus.bg, color: waStatus.color, padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: 600 }}>
                ● {waStatus.label}
              </span>
            </div>
          </div>
          {stats?.whatsappStatus !== "connected" && (
            <button onClick={() => router.push("/dashboard/settings/connection")} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
              Connect WhatsApp
            </button>
          )}
          {stats?.whatsappStatus === "connected" && (
            <button onClick={() => router.push("/dashboard/conversations")} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13px", color: "#374151" }}>
              Open Conversations
            </button>
          )}
        </div>

        {/* Recent Campaigns */}
        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#111827" }}>Recent Campaigns</h3>
            <button onClick={() => router.push("/dashboard/campaigns")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#25d366", fontWeight: 600 }}>View all →</button>
          </div>
          {!stats?.recentCampaigns?.length ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📢</div>
              No campaigns yet
              <div style={{ marginTop: "12px" }}>
                <button onClick={() => router.push("/dashboard/campaigns")} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>Create Campaign</button>
              </div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Name", "Template", "Status", "Progress"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentCampaigns.map((c) => {
                  const pct = c.total > 0 ? Math.round(((c.sent + c.failed) / c.total) * 100) : 0;
                  return (
                    <tr key={c._id} onClick={() => router.push(`/dashboard/campaigns/${c._id}`)} style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827", fontSize: "13px" }}>{c.name}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: "13px" }}>{c.templateId?.name || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: STATUS_COLOR[c.status] + "20", color: STATUS_COLOR[c.status], padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 600 }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", minWidth: "100px" }}>
                        {c.total > 0 ? (
                          <div>
                            <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: "#10b981" }} />
                            </div>
                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{pct}%</span>
                          </div>
                        ) : <span style={{ color: "#d1d5db", fontSize: "12px" }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
