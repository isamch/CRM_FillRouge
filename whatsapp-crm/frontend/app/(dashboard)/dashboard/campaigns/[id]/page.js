"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCampaignDetail } from "@/hooks/useCampaigns";
import api from "@/lib/api";

const STATUS_COLOR = {
  draft: "#6b7280", running: "#10b981", paused: "#f59e0b",
  scheduled: "#3b82f6", completed: "#8b5cf6", stopped: "#ef4444",
};

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { campaign, logs, loading, fetchCampaign, fetchLogs } = useCampaignDetail(id);
  const [confirm, setConfirm] = useState(null); // { action, label }
  const [acting, setActing] = useState(false);

  const doAction = async (action) => {
    setActing(true);
    try {
      await api.post(`/campaigns/${id}/${action}`);
      await fetchCampaign();
      await fetchLogs();
    } catch (e) {
      alert(e.response?.data?.message || "Action failed");
    } finally {
      setActing(false);
      setConfirm(null);
    }
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>;
  if (!campaign) return <div style={{ padding: "60px", textAlign: "center", color: "#ef4444" }}>Campaign not found</div>;

  const pct = campaign.total > 0 ? Math.round(((campaign.sent + campaign.failed) / campaign.total) * 100) : 0;
  const isRunning = campaign.status === "running";
  const isPaused = campaign.status === "paused";

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Back */}
      <button onClick={() => router.push("/dashboard/campaigns")} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "14px", marginBottom: "16px", padding: 0 }}>
        ← Back to Campaigns
      </button>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>{campaign.name}</h1>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px", alignItems: "center" }}>
            <span style={{ background: STATUS_COLOR[campaign.status] + "20", color: STATUS_COLOR[campaign.status], padding: "4px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: 600 }}>
              {campaign.status}
            </span>
            <span style={{ color: "#9ca3af", fontSize: "13px" }}>{campaign.ratePerMinute} msg/min</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {campaign.status === "draft" && (
            <button onClick={() => setConfirm({ action: "run", label: "Run" })} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 600 }}>▶ Run</button>
          )}
          {isRunning && (
            <button onClick={() => setConfirm({ action: "pause", label: "Pause" })} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#f59e0b", color: "#fff", cursor: "pointer", fontWeight: 600 }}>⏸ Pause</button>
          )}
          {isPaused && (
            <button onClick={() => setConfirm({ action: "resume", label: "Resume" })} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontWeight: 600 }}>▶ Resume</button>
          )}
          {(isRunning || isPaused) && (
            <button onClick={() => setConfirm({ action: "stop", label: "Stop" })} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}>⏹ Stop</button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total", value: campaign.total, color: "#3b82f6" },
          { label: "Sent", value: campaign.sent, color: "#10b981" },
          { label: "Failed", value: campaign.failed, color: "#ef4444" },
          { label: "Remaining", value: Math.max(0, campaign.total - campaign.sent - campaign.failed), color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>{label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {campaign.total > 0 && (
        <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>Progress</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{pct}%</span>
          </div>
          <div style={{ background: "#e5e7eb", borderRadius: "8px", height: "12px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #25d366, #10b981)", transition: "width 0.5s ease", borderRadius: "8px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12px", color: "#9ca3af" }}>
            <span>{campaign.sent} sent · {campaign.failed} failed</span>
            <span>{campaign.total - campaign.sent - campaign.failed} remaining</span>
          </div>
          {isRunning && <div style={{ marginTop: "8px", fontSize: "12px", color: "#10b981", fontWeight: 600 }}>● Live — updating every 3s</div>}
        </div>
      )}

      {/* Info */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
          <div><span style={{ color: "#6b7280" }}>Template: </span><strong>{campaign.templateId?.name || "—"}</strong></div>
          <div><span style={{ color: "#6b7280" }}>List: </span><strong>{campaign.listId?.name || "—"}</strong></div>
          <div><span style={{ color: "#6b7280" }}>Started: </span><strong>{campaign.startedAt ? new Date(campaign.startedAt).toLocaleString() : "—"}</strong></div>
          <div><span style={{ color: "#6b7280" }}>Completed: </span><strong>{campaign.completedAt ? new Date(campaign.completedAt).toLocaleString() : "—"}</strong></div>
          {campaign.scheduledAt && <div><span style={{ color: "#6b7280" }}>Scheduled: </span><strong>{new Date(campaign.scheduledAt).toLocaleString()}</strong></div>}
        </div>
      </div>

      {/* Logs */}
      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#111827" }}>Send Logs ({logs.length})</h3>
        </div>
        {logs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No logs yet</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Contact", "Phone", "Status", "Error", "Sent At"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#374151" }}>{log.contactId?.name || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6b7280" }}>{log.phone}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: log.status === "sent" ? "#d1fae5" : "#fee2e2", color: log.status === "sent" ? "#065f46" : "#991b1b", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 600 }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#ef4444" }}>{log.error || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#9ca3af" }}>{new Date(log.sentAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "360px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700 }}>{confirm.label} Campaign?</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>Are you sure you want to {confirm.label.toLowerCase()} this campaign?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setConfirm(null)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => doAction(confirm.action)} disabled={acting} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: confirm.action === "stop" ? "#ef4444" : "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600, opacity: acting ? 0.7 : 1 }}>
                {acting ? "..." : confirm.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
