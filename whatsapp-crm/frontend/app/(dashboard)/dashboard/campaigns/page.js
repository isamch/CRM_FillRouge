"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useTemplates } from "@/hooks/useTemplates";
import { useContacts } from "@/hooks/useContacts";
import { useRouter } from "next/navigation";

const STATUS_TABS = ["", "draft", "running", "paused", "scheduled", "completed", "stopped"];
const STATUS_LABEL = { "": "All", draft: "Draft", running: "Running", paused: "Paused", scheduled: "Scheduled", completed: "Completed", stopped: "Stopped" };
const STATUS_COLOR = {
  draft: "#6b7280", running: "#10b981", paused: "#f59e0b",
  scheduled: "#3b82f6", completed: "#8b5cf6", stopped: "#ef4444",
};

const STEPS = ["Template", "Contact List", "Schedule"];

export default function CampaignsPage() {
  const router = useRouter();
  const { campaigns, loading, statusFilter, filterByStatus, createCampaign, deleteCampaign, runCampaign } = useCampaigns();
  const { templates } = useTemplates();
  const { lists } = useContacts();

  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", templateId: "", listId: "", scheduledAt: "", ratePerMinute: 10 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openWizard = () => { setForm({ name: "", templateId: "", listId: "", scheduledAt: "", ratePerMinute: 10 }); setStep(0); setError(""); setShowWizard(true); };

  const nextStep = () => {
    if (step === 0 && (!form.name.trim() || !form.templateId)) return setError("Name and template are required");
    if (step === 1 && !form.listId) return setError("Please select a contact list");
    setError("");
    setStep((s) => s + 1);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const body = { name: form.name, templateId: form.templateId, listId: form.listId, ratePerMinute: +form.ratePerMinute };
      const campaign = await createCampaign(body);
      if (form.scheduledAt) {
        await import("@/lib/api").then(({ default: api }) => api.post(`/campaigns/${campaign._id}/schedule`, { scheduledAt: form.scheduledAt }));
      }
      setShowWizard(false);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteCampaign(confirmDelete);
    setConfirmDelete(null);
  };

  const selectedTemplate = templates.find((t) => t._id === form.templateId);

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>Campaigns</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Manage and send bulk WhatsApp campaigns</p>
        </div>
        <button onClick={openWizard} style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
          + New Campaign
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => filterByStatus(s)} style={{
            padding: "6px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            background: statusFilter === s ? "#111827" : "#fff",
            color: statusFilter === s ? "#fff" : "#6b7280",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>
        ) : campaigns.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>No campaigns found</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Name", "Template", "List", "Status", "Progress", "Rate", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const pct = c.total > 0 ? Math.round(((c.sent + c.failed) / c.total) * 100) : 0;
                return (
                  <tr key={c._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>{c.name}</td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>{c.templateId?.name || "—"}</td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>{c.listId?.name || "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: STATUS_COLOR[c.status] + "20", color: STATUS_COLOR[c.status], padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", minWidth: "120px" }}>
                      {c.total > 0 ? (
                        <div>
                          <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "#10b981", transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: "11px", color: "#6b7280" }}>{c.sent}/{c.total} ({pct}%)</span>
                        </div>
                      ) : <span style={{ color: "#d1d5db", fontSize: "13px" }}>—</span>}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "13px" }}>{c.ratePerMinute}/min</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => router.push(`/dashboard/campaigns/${c._id}`)} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: "12px", color: "#374151" }}>View</button>
                        {c.status === "draft" && (
                          <button onClick={() => runCampaign(c._id)} style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>Run</button>
                        )}
                        {["draft", "completed", "stopped"].includes(c.status) && (
                          <button onClick={() => setConfirmDelete(c._id)} style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: "16px", width: "560px", maxHeight: "90vh", overflow: "auto", padding: "32px" }}>
            {/* Steps indicator */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, background: i <= step ? "#25d366" : "#e5e7eb", color: i <= step ? "#fff" : "#9ca3af" }}>{i + 1}</div>
                  <span style={{ marginLeft: "6px", fontSize: "13px", fontWeight: i === step ? 700 : 400, color: i === step ? "#111827" : "#9ca3af" }}>{s}</span>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: i < step ? "#25d366" : "#e5e7eb", margin: "0 10px" }} />}
                </div>
              ))}
            </div>

            {/* Step 0 — Template */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Campaign Details</h2>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Campaign Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Summer Promo" style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }} />
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Select Template</label>
                <div style={{ display: "grid", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
                  {templates.map((t) => (
                    <div key={t._id} onClick={() => setForm({ ...form, templateId: t._id })} style={{ padding: "12px", border: `2px solid ${form.templateId === t._id ? "#25d366" : "#e5e7eb"}`, borderRadius: "8px", cursor: "pointer", background: form.templateId === t._id ? "#f0fdf4" : "#fff" }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>{t.name}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.body}</div>
                    </div>
                  ))}
                </div>
                {selectedTemplate && (
                  <div style={{ marginTop: "12px", padding: "12px", background: "#f0fdf4", borderRadius: "8px", fontSize: "13px", color: "#374151" }}>
                    <strong>Preview:</strong> {selectedTemplate.body.replace(/\{\{(\w+)\}\}/g, (_, k) => `[${k}]`)}
                  </div>
                )}
              </div>
            )}

            {/* Step 1 — Contact List */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Select Contact List</h2>
                <div style={{ display: "grid", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                  {lists.map((l) => (
                    <div key={l._id} onClick={() => setForm({ ...form, listId: l._id })} style={{ padding: "14px", border: `2px solid ${form.listId === l._id ? "#25d366" : "#e5e7eb"}`, borderRadius: "8px", cursor: "pointer", background: form.listId === l._id ? "#f0fdf4" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: "#111827" }}>{l.name}</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>{l.contactCount || 0} contacts</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Rate per minute</label>
                  <input type="number" min={1} max={60} value={form.ratePerMinute} onChange={(e) => setForm({ ...form, ratePerMinute: e.target.value })} style={{ width: "100px", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px" }} />
                </div>
              </div>
            )}

            {/* Step 2 — Schedule */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Schedule (Optional)</h2>
                <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "20px" }}>Leave empty to save as draft and run manually.</p>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Schedule Date & Time</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                <div style={{ marginTop: "20px", padding: "16px", background: "#f9fafb", borderRadius: "8px", fontSize: "13px", color: "#374151" }}>
                  <div style={{ marginBottom: "6px" }}><strong>Name:</strong> {form.name}</div>
                  <div style={{ marginBottom: "6px" }}><strong>Template:</strong> {selectedTemplate?.name}</div>
                  <div style={{ marginBottom: "6px" }}><strong>List:</strong> {lists.find((l) => l._id === form.listId)?.name}</div>
                  <div><strong>Rate:</strong> {form.ratePerMinute} msg/min</div>
                </div>
              </div>
            )}

            {error && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "12px" }}>{error}</p>}

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
              <button onClick={() => step === 0 ? setShowWizard(false) : setStep((s) => s - 1)} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 600 }}>
                {step === 0 ? "Cancel" : "Back"}
              </button>
              {step < 2 ? (
                <button onClick={nextStep} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Next</button>
              ) : (
                <button onClick={handleCreate} disabled={saving} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Creating..." : "Create Campaign"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "360px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700 }}>Delete Campaign?</h3>
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
