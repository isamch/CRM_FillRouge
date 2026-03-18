"use client";

import { useState } from "react";
import { useTemplates } from "@/hooks/useTemplates";

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "640px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "20px", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TemplateEditorModal({ template, onClose, onSave, submitting }) {
  const [form, setForm] = useState({ name: template?.name || "", body: template?.body || "" });

  const variables = [...new Set((form.body.match(/\{\{(\w+)\}\}/g) || []).map(m => m.replace(/\{\{|\}\}/g, "")))];

  const preview = form.body.replace(/\{\{(\w+)\}\}/g, (_, v) => `<mark style="background:#FEF9C3;padding:1px 4px;border-radius:4px">${v}</mark>`);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        placeholder="Template name" required autoFocus
        style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748B", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Message Body</div>
          <textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            placeholder={"Hello {{name}},\n\nYour order {{orderId}} is ready!"}
            required rows={8}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", resize: "vertical", fontFamily: "monospace", boxSizing: "border-box" }} />
        </div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748B", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Preview</div>
          <div style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px", minHeight: "160px", background: "#F8FAFC", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            dangerouslySetInnerHTML={{ __html: preview || "<span style='color:#94A3B8'>Preview will appear here...</span>" }} />
        </div>
      </div>

      {variables.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748B" }}>Variables:</span>
          {variables.map((v) => (
            <span key={v} style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: "#FEF9C3", color: "#92400E" }}>{`{{${v}}}`}</span>
          ))}
        </div>
      )}

      <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#0F172A", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
        {submitting ? "Saving..." : template ? "Save Changes" : "Create Template"}
      </button>
    </form>
  );
}

export default function TemplatesPage() {
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate } = useTemplates();

  const [modal, setModal] = useState(null); // "create" | "edit" | "delete"
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.body?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (form) => {
    setSubmitting(true);
    try {
      if (modal === "create") await createTemplate(form);
      if (modal === "edit") await updateTemplate(selected._id, form);
      setModal(null);
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteTemplate(selected._id);
      setModal(null);
      setSelected(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>Templates</div>
          <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "2px" }}>{templates.length} templates</div>
        </div>
        <button onClick={() => { setModal("create"); setSelected(null); }} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>+ New Template</button>
      </div>

      {/* Search */}
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..."
        style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", background: "#fff", width: "320px", boxSizing: "border-box" }} />

      {/* Grid */}
      {loading ? (
        <div style={{ color: "#94A3B8", fontSize: "14px" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "60px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", opacity: 0.3, marginBottom: "12px" }}>📄</div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748B" }}>{search ? "No templates match your search" : "No templates yet"}</div>
          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>Create your first message template</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {filtered.map((t) => (
            <div key={t._id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", transition: "box-shadow 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>{t.name}</div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => duplicateTemplate(t)} title="Duplicate" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "14px", padding: "4px 6px", borderRadius: "6px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#64748B"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94A3B8"; }}
                  >⧉</button>
                  <button onClick={() => { setSelected(t); setModal("edit"); }} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "14px", padding: "4px 6px", borderRadius: "6px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#6366F1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94A3B8"; }}
                  >✎</button>
                  <button onClick={() => { setSelected(t); setModal("delete"); }} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "14px", padding: "4px 6px", borderRadius: "6px" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94A3B8"; }}
                  >✕</button>
                </div>
              </div>

              <div style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                {t.body}
              </div>

              {t.variables?.length > 0 && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {t.variables.map((v) => (
                    <span key={v} style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "20px", background: "#FEF9C3", color: "#92400E" }}>{`{{${v}}}`}</span>
                  ))}
                </div>
              )}

              <div style={{ fontSize: "11px", color: "#CBD5E1", marginTop: "auto" }}>
                {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <Modal title={modal === "create" ? "New Template" : `Edit — ${selected?.name}`} onClose={() => { setModal(null); setSelected(null); }}>
          <TemplateEditorModal template={selected} onClose={() => setModal(null)} onSave={handleSave} submitting={submitting} />
        </Modal>
      )}

      {/* Delete Confirm */}
      {modal === "delete" && (
        <Modal title="Delete Template" onClose={() => { setModal(null); setSelected(null); }}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px" }}>
              Delete <strong style={{ color: "#0F172A" }}>{selected?.name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => { setModal(null); setSelected(null); }} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} disabled={submitting} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#DC2626", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
