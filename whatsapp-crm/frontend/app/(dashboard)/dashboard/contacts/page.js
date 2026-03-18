"use client";

import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "28px",
        width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "20px", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
  const initials = name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const colors = ["#6366F1","#8B5CF6","#EC4899","#F59E0B","#10B981","#3B82F6","#EF4444","#14B8A6"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "#6366F1";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "20", color, fontWeight: "700",
      fontSize: size * 0.35, display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "40px 20px" }}>
      <div style={{ fontSize: "36px", opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748B" }}>{title}</div>
      {subtitle && <div style={{ fontSize: "12px", color: "#94A3B8", textAlign: "center" }}>{subtitle}</div>}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: "12px", padding: "16px 20px",
      border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "14px",
    }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const {
    categories, lists, contacts,
    selectedCategory, selectedList,
    loading, pagination,
    selectCategory, selectList,
    createCategory, deleteCategory,
    createList, deleteList,
    createContact, deleteContact,
    fetchContacts,
  } = useContacts();

  const [modal, setModal] = useState(null); // "category" | "list" | "contact"
  const [form, setForm] = useState({});
  const [catSearch, setCatSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalContacts = lists.reduce((s, l) => s + (l.contactCount || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "category") await createCategory(form.name);
      if (modal === "list") await createList(form.name);
      if (modal === "contact") await createContact({ name: form.name, phone: form.phone, notes: form.notes });
      setModal(null);
      setForm({});
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCats = categories.filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>

      {/* ── Top Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <StatCard label="Categories" value={categories.length} icon="📁" color="#6366F1" />
        <StatCard label="Contact Lists" value={lists.length} icon="📋" color="#8B5CF6" />
        <StatCard label="Total Contacts" value={selectedList ? contacts.length : totalContacts} icon="👥" color="#25D366" />
      </div>

      {/* ── Main Panel ── */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "16px", flex: 1 }}>

        {/* ── Left: Categories Sidebar ── */}
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em" }}>Categories</span>
              <button onClick={() => { setModal("category"); setForm({}); }} style={{
                width: "26px", height: "26px", borderRadius: "6px", border: "none",
                background: "#F1F5F9", color: "#64748B", cursor: "pointer", fontSize: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
            </div>
            <input
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%", padding: "7px 10px", borderRadius: "8px",
                border: "1px solid #E2E8F0", fontSize: "12px", outline: "none",
                background: "#F8FAFC", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading.categories ? (
              <EmptyState icon="⏳" title="Loading..." />
            ) : filteredCats.length === 0 ? (
              <EmptyState icon="📁" title="No categories" subtitle="Create your first category" />
            ) : filteredCats.map((cat) => {
              const active = selectedCategory?._id === cat._id;
              return (
                <div key={cat._id} onClick={() => selectCategory(cat)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 16px", cursor: "pointer",
                  background: active ? "#F0FDF4" : "transparent",
                  borderLeft: `3px solid ${active ? "#25D366" : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: active ? "#25D366" : "#CBD5E1", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: active ? "#15803D" : "#334155", fontWeight: active ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat._id); }} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#CBD5E1", fontSize: "12px", padding: "2px 4px", borderRadius: "4px",
                    opacity: 0, transition: "opacity 0.15s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >✕</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Lists + Contacts ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Lists Row */}
          {!selectedCategory ? (
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "40px" }}>
              <EmptyState icon="👈" title="Select a category" subtitle="Choose a category from the left to view its lists" />
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>Lists</span>
                  <span style={{ marginLeft: "8px", fontSize: "12px", color: "#94A3B8" }}>in {selectedCategory.name}</span>
                </div>
                <button onClick={() => { setModal("list"); setForm({}); }} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "7px 14px", borderRadius: "8px", border: "none",
                  background: "#25D366", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}>+ New List</button>
              </div>

              {loading.lists ? (
                <EmptyState icon="⏳" title="Loading..." />
              ) : lists.length === 0 ? (
                <EmptyState icon="📋" title="No lists yet" subtitle="Create your first contact list" />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", padding: "16px" }}>
                  {lists.map((list) => {
                    const active = selectedList?._id === list._id;
                    return (
                      <div key={list._id} onClick={() => selectList(list)} style={{
                        padding: "16px", borderRadius: "10px", cursor: "pointer",
                        border: `2px solid ${active ? "#25D366" : "#E2E8F0"}`,
                        background: active ? "#F0FDF4" : "#FAFAFA",
                        transition: "all 0.15s", position: "relative",
                      }}>
                        <div style={{ fontSize: "22px", marginBottom: "8px" }}>📋</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A", marginBottom: "4px" }}>{list.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748B" }}>{list.contactCount} contacts</div>
                        <button onClick={(e) => { e.stopPropagation(); deleteList(list._id); }} style={{
                          position: "absolute", top: "8px", right: "8px",
                          background: "#FEE2E2", border: "none", borderRadius: "4px",
                          color: "#EF4444", fontSize: "11px", cursor: "pointer", padding: "2px 6px",
                          opacity: 0, transition: "opacity 0.15s",
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Contacts Table */}
          {selectedList && (
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", overflow: "hidden", flex: 1 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>Contacts</span>
                  <span style={{ marginLeft: "8px", fontSize: "12px", color: "#94A3B8" }}>in {selectedList.name}</span>
                </div>
                <button onClick={() => { setModal("contact"); setForm({}); }} style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "7px 14px", borderRadius: "8px", border: "none",
                  background: "#0F172A", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}>+ Add Contact</button>
              </div>

              {loading.contacts ? (
                <EmptyState icon="⏳" title="Loading..." />
              ) : contacts.length === 0 ? (
                <EmptyState icon="👥" title="No contacts yet" subtitle="Add your first contact to this list" />
              ) : (
                <>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC" }}>
                        {["Contact", "Phone", "Status", ""].map((h) => (
                          <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c, i) => (
                        <tr key={c._id} style={{ borderBottom: i < contacts.length - 1 ? "1px solid #F8FAFC" : "none" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#FAFAFA"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "12px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <Avatar name={c.name} size={34} />
                              <span style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A" }}>{c.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 20px" }}>
                            <span style={{ fontSize: "13px", color: "#64748B", fontFamily: "monospace" }}>{c.phone}</span>
                          </td>
                          <td style={{ padding: "12px 20px" }}>
                            <span style={{
                              fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px",
                              background: c.validationStatus === "valid" ? "#DCFCE7" : c.validationStatus === "invalid" ? "#FEE2E2" : "#F1F5F9",
                              color: c.validationStatus === "valid" ? "#16A34A" : c.validationStatus === "invalid" ? "#DC2626" : "#64748B",
                            }}>{c.validationStatus || "pending"}</span>
                          </td>
                          <td style={{ padding: "12px 20px", textAlign: "right" }}>
                            <button onClick={() => deleteContact(c._id)} style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: "#CBD5E1", fontSize: "14px", padding: "4px 8px", borderRadius: "6px",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#EF4444"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#CBD5E1"; }}
                            >✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {pagination.totalPages > 1 && (
                    <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => fetchContacts(selectedList._id, p)} style={{
                          width: "32px", height: "32px", borderRadius: "8px",
                          border: `1px solid ${pagination.page === p ? "#25D366" : "#E2E8F0"}`,
                          background: pagination.page === p ? "#25D366" : "#fff",
                          color: pagination.page === p ? "#fff" : "#64748B",
                          fontSize: "12px", cursor: "pointer", fontWeight: "600",
                        }}>{p}</button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === "category" && (
        <Modal title="New Category" onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input autoFocus value={form.name || ""} onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Category name" required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {submitting ? "Creating..." : "Create Category"}
            </button>
          </form>
        </Modal>
      )}

      {modal === "list" && (
        <Modal title={`New List in "${selectedCategory?.name}"`} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input autoFocus value={form.name || ""} onChange={(e) => setForm({ name: e.target.value })}
              placeholder="List name" required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {submitting ? "Creating..." : "Create List"}
            </button>
          </form>
        </Modal>
      )}

      {modal === "contact" && (
        <Modal title={`Add Contact to "${selectedList?.name}"`} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input autoFocus value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Full name" required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <input value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="212XXXXXXXXX" required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <input value={form.notes || ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Notes (optional)"
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#0F172A", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {submitting ? "Adding..." : "Add Contact"}
            </button>
          </form>
        </Modal>
      )}

    </div>
  );
}
