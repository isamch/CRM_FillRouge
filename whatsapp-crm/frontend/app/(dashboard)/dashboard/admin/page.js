"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";

const TABS = ["Users", "Analytics", "Send Notification"];

export default function AdminPage() {
  const { users, stats, usersStats, loading, toggleStatus, deleteUser, createUser, sendNotification } = useAdmin();
  const [tab, setTab] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "" });
  const [notifForm, setNotifForm] = useState({ recipientId: "", subject: "", body: "" });
  const [notifSent, setNotifSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    await deleteUser(confirmDelete);
    setConfirmDelete(null);
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) return setError("All fields required");
    setSaving(true);
    try {
      await createUser(createForm);
      setShowCreateModal(false);
      setCreateForm({ name: "", email: "", password: "" });
      setError("");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleSendNotif = async () => {
    if (!notifForm.subject || !notifForm.body) return setError("Subject and body required");
    setSaving(true);
    try {
      await sendNotification({ ...notifForm, recipientId: notifForm.recipientId || undefined });
      setNotifSent(true);
      setNotifForm({ recipientId: "", subject: "", body: "" });
      setError("");
      setTimeout(() => setNotifSent(false), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>Admin Panel</h1>
        <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Manage users, view platform stats, send notifications</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "#fff", padding: "4px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", width: "fit-content" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => { setTab(i); setError(""); }} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, background: tab === i ? "#111827" : "transparent", color: tab === i ? "#fff" : "#6b7280", transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>

      {/* TAB 0 — Users */}
      {tab === 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <button onClick={() => { setShowCreateModal(true); setError(""); }} style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 18px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>+ New User</button>
          </div>
          <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            {loading.users ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    {["Name", "Email", "Role", "Status", "Messages", "Joined", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{u.name}</td>
                      <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>{u.email}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: u.roles?.includes("admin") ? "#fef3c7" : "#f3f4f6", color: u.roles?.includes("admin") ? "#92400e" : "#374151", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 600 }}>
                          {u.roles?.[0] || "user"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: u.isActive ? "#dcfce7" : "#fee2e2", color: u.isActive ? "#15803d" : "#991b1b", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 600 }}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>{u.messageCount || 0}</td>
                      <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: "12px" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => toggleStatus(u._id)} style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: u.isActive ? "#fef3c7" : "#dcfce7", color: u.isActive ? "#92400e" : "#15803d", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                            {u.isActive ? "Disable" : "Enable"}
                          </button>
                          <button onClick={() => setConfirmDelete(u._id)} style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 1 — Analytics */}
      {tab === 1 && (
        <div>
          {/* Platform Stats Cards */}
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total Users", value: stats.totalUsers, color: "#3b82f6" },
                { label: "Active Users", value: stats.activeUsers, color: "#10b981" },
                { label: "Total Campaigns", value: stats.totalCampaigns, color: "#8b5cf6" },
                { label: "Total Messages", value: stats.totalMessages, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Per-user stats table */}
          <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#111827" }}>Per-User Stats</h3>
            </div>
            {loading.stats ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["User", "Email", "Messages Sent", "Campaigns", "Status"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersStats.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827", fontSize: "13px" }}>{u.name}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: "13px" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px", color: "#374151", fontSize: "13px", fontWeight: 600 }}>{u.messageCount || 0}</td>
                      <td style={{ padding: "12px 16px", color: "#374151", fontSize: "13px", fontWeight: 600 }}>{u.campaignCount || 0}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: u.isActive ? "#dcfce7" : "#fee2e2", color: u.isActive ? "#15803d" : "#991b1b", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 600 }}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2 — Send Notification */}
      {tab === 2 && (
        <div style={{ maxWidth: "560px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700, color: "#111827" }}>Send Notification</h3>

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Recipient (leave empty for broadcast)</label>
            <select value={notifForm.recipientId} onChange={(e) => setNotifForm({ ...notifForm, recipientId: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", background: "#fff" }}>
              <option value="">📢 Broadcast to all users</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Subject</label>
            <input value={notifForm.subject} onChange={(e) => setNotifForm({ ...notifForm, subject: e.target.value })} placeholder="Notification subject" style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }} />

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Message</label>
            <textarea value={notifForm.body} onChange={(e) => setNotifForm({ ...notifForm, body: e.target.value })} placeholder="Write your message..." rows={4} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", resize: "vertical" }} />

            {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
            {notifSent && <p style={{ color: "#10b981", fontSize: "13px", marginBottom: "12px", fontWeight: 600 }}>✓ Notification sent successfully!</p>}

            <button onClick={handleSendNotif} disabled={saving} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "14px", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "420px" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}>Create New User</h3>
            {["name", "email", "password"].map((field) => (
              <div key={field} style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px", textTransform: "capitalize" }}>{field}</label>
                <input type={field === "password" ? "password" : "text"} value={createForm[field]} onChange={(e) => setCreateForm({ ...createForm, [field]: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            ))}
            {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button onClick={() => { setShowCreateModal(false); setError(""); }} style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "360px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700 }}>Delete User?</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
