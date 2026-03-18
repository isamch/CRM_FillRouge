"use client";

import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "20px", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Avatar({ name, size = 32 }) {
  const initials = name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#14B8A6"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "#6366F1";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "20", color, fontWeight: "700", fontSize: size * 0.35, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "40px 20px" }}>
      <div style={{ fontSize: "36px", opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748B" }}>{title}</div>
      {subtitle && <div style={{ fontSize: "12px", color: "#94A3B8", textAlign: "center" }}>{subtitle}</div>}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "16px 20px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{label}</div>
      </div>
    </div>
  );
}

function ContactForm({ form, setForm, onSubmit, submitting, submitLabel, submitColor = "#0F172A" }) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input autoFocus value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        placeholder="Full name" required style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
      <input value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
        placeholder="212XXXXXXXXX" required style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
      <input value={form.notes || ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        placeholder="Notes (optional)" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
      <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: submitColor, color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default function ContactsPage() {
  const {
    categories, lists, contacts,
    selectedCategory, selectedList,
    loading, pagination,
    selectCategory, selectList,
    createCategory, deleteCategory,
    createList, deleteList,
    createContact, deleteContact, updateContact, importContacts, exportContacts, validateAllContacts, clearInvalidContacts,
    fetchContacts,
  } = useContacts();

  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({});
  const [catSearch, setCatSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [validateResult, setValidateResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const totalContacts = lists.reduce((s, l) => s + (l.contactCount || 0), 0);

  const closeModal = () => { setModal(null); setForm({}); setEditTarget(null); setImportFile(null); setImportResult(null); setValidateResult(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modal === "category") await createCategory(form.name);
      if (modal === "list") await createList(form.name);
      if (modal === "contact") await createContact({ name: form.name, phone: form.phone, notes: form.notes });
      if (modal === "edit") await updateContact(editTarget._id, { name: form.name, phone: form.phone, notes: form.notes });
      if (modal === "import") {
        const result = await importContacts(selectedList._id, importFile);
        setImportResult(result);
        setImportFile(null);
        return;
      }
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateAll = async () => {
    setValidating(true);
    try {
      const result = await validateAllContacts();
      setValidateResult(result);
      setModal("validateResult");
    } finally {
      setValidating(false);
    }
  };

  const handleClearInvalid = async () => {
    await clearInvalidContacts();
    setConfirmClear(false);
  };

  const openEdit = (c) => { setEditTarget(c); setForm({ name: c.name, phone: c.phone, notes: c.notes || "" }); setModal("edit"); };

  const filteredCats = categories.filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()));
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.phone.includes(contactSearch)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <StatCard label="Categories" value={categories.length} icon="📁" color="#6366F1" />
        <StatCard label="Contact Lists" value={lists.length} icon="📋" color="#8B5CF6" />
        <StatCard label="Total Contacts" value={selectedList ? contacts.length : totalContacts} icon="👥" color="#25D366" />
      </div>

      {/* Main */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "16px", flex: 1 }}>

        {/* Categories Sidebar */}
        <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em" }}>Categories</span>
              <button onClick={() => { setModal("category"); setForm({}); }} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "none", background: "#F1F5F9", color: "#64748B", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
            <input value={catSearch} onChange={(e) => setCatSearch(e.target.value)} placeholder="Search..."
              style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px", outline: "none", background: "#F8FAFC", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading.categories ? <EmptyState icon="⏳" title="Loading..." />
              : filteredCats.length === 0 ? <EmptyState icon="📁" title="No categories" subtitle="Create your first category" />
              : filteredCats.map((cat) => {
                const active = selectedCategory?._id === cat._id;
                return (
                  <div key={cat._id} onClick={() => selectCategory(cat)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "pointer", background: active ? "#F0FDF4" : "transparent", borderLeft: `3px solid ${active ? "#25D366" : "transparent"}`, transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: active ? "#25D366" : "#CBD5E1", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: active ? "#15803D" : "#334155", fontWeight: active ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat._id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: "12px", padding: "2px 4px", borderRadius: "4px", opacity: 0, transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >✕</button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Lists */}
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
                <button onClick={() => { setModal("list"); setForm({}); }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>+ New List</button>
              </div>
              {loading.lists ? <EmptyState icon="⏳" title="Loading..." />
                : lists.length === 0 ? <EmptyState icon="📋" title="No lists yet" subtitle="Create your first contact list" />
                : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", padding: "16px" }}>
                    {lists.map((list) => {
                      const active = selectedList?._id === list._id;
                      return (
                        <div key={list._id} onClick={() => selectList(list)} style={{ padding: "16px", borderRadius: "10px", cursor: "pointer", border: `2px solid ${active ? "#25D366" : "#E2E8F0"}`, background: active ? "#F0FDF4" : "#FAFAFA", transition: "all 0.15s", position: "relative" }}>
                          <div style={{ fontSize: "22px", marginBottom: "8px" }}>📋</div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A", marginBottom: "4px" }}>{list.name}</div>
                          <div style={{ fontSize: "12px", color: "#64748B" }}>{list.contactCount} contacts</div>
                          <button onClick={(e) => { e.stopPropagation(); deleteList(list._id); }} style={{ position: "absolute", top: "8px", right: "8px", background: "#FEE2E2", border: "none", borderRadius: "4px", color: "#EF4444", fontSize: "11px", cursor: "pointer", padding: "2px 6px", opacity: 0, transition: "opacity 0.15s" }}
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
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setModal("import"); setImportFile(null); setImportResult(null); }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>↑ Import</button>
                  <button onClick={exportContacts} disabled={!contacts.length} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#fff", color: contacts.length ? "#64748B" : "#CBD5E1", fontSize: "13px", fontWeight: "600", cursor: contacts.length ? "pointer" : "not-allowed" }}>↓ Export</button>
                  <button onClick={handleValidateAll} disabled={validating || !contacts.length} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "none", background: validating ? "#E2E8F0" : "#6366F1", color: validating ? "#94A3B8" : "#fff", fontSize: "13px", fontWeight: "600", cursor: validating || !contacts.length ? "not-allowed" : "pointer" }}>{validating ? "Validating..." : "✓ Validate All"}</button>
                  <button onClick={() => { setModal("contact"); setForm({}); }} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "none", background: "#0F172A", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>+ Add Contact</button>
                </div>
              </div>

              <div style={{ padding: "10px 20px", borderBottom: "1px solid #F1F5F9" }}>
                <input value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} placeholder="Search by name or phone..."
                  style={{ width: "100%", padding: "8px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", background: "#F8FAFC", boxSizing: "border-box" }} />
              </div>

              {loading.contacts ? <EmptyState icon="⏳" title="Loading..." />
                : contacts.length === 0 ? <EmptyState icon="👥" title="No contacts yet" subtitle="Add your first contact to this list" />
                : filteredContacts.length === 0 ? <EmptyState icon="🔍" title="No results" subtitle={`No contacts match "${contactSearch}"`} />
                : (
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
                        {filteredContacts.map((c, i) => (
                          <tr key={c._id} style={{ borderBottom: i < filteredContacts.length - 1 ? "1px solid #F8FAFC" : "none" }}
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
                              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: c.validationStatus === "valid" ? "#DCFCE7" : c.validationStatus === "invalid" ? "#FEE2E2" : "#F1F5F9", color: c.validationStatus === "valid" ? "#16A34A" : c.validationStatus === "invalid" ? "#DC2626" : "#64748B" }}>
                                {c.validationStatus || "pending"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 20px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                <button onClick={() => openEdit(c)} style={{ background: "none", border: "1px solid #E2E8F0", cursor: "pointer", color: "#64748B", fontSize: "12px", padding: "4px 10px", borderRadius: "6px" }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                                >Edit</button>
                                <button onClick={() => deleteContact(c._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: "14px", padding: "4px 8px", borderRadius: "6px" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#EF4444"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#CBD5E1"; }}
                                >✕</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {pagination.totalPages > 1 && (
                      <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                          <button key={p} onClick={() => fetchContacts(selectedList._id, p)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: `1px solid ${pagination.page === p ? "#25D366" : "#E2E8F0"}`, background: pagination.page === p ? "#25D366" : "#fff", color: pagination.page === p ? "#fff" : "#64748B", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>{p}</button>
                        ))}
                      </div>
                    )}
                    {contacts.some(c => c.validationStatus === 'invalid') && (
                      <div style={{ padding: "10px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => setConfirmClear(true)} style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: "#FEE2E2", color: "#DC2626", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>🗑 Clear Invalid ({contacts.filter(c => c.validationStatus === 'invalid').length})</button>
                      </div>
                    )}
                  </>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === "category" && (
        <Modal title="New Category" onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input autoFocus value={form.name || ""} onChange={(e) => setForm({ name: e.target.value })} placeholder="Category name" required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {submitting ? "Creating..." : "Create Category"}
            </button>
          </form>
        </Modal>
      )}

      {modal === "list" && (
        <Modal title={`New List in "${selectedCategory?.name}"`} onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input autoFocus value={form.name || ""} onChange={(e) => setForm({ name: e.target.value })} placeholder="List name" required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
            <button type="submit" disabled={submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              {submitting ? "Creating..." : "Create List"}
            </button>
          </form>
        </Modal>
      )}

      {modal === "contact" && (
        <Modal title={`Add Contact to "${selectedList?.name}"`} onClose={closeModal}>
          <ContactForm form={form} setForm={setForm} onSubmit={handleSubmit} submitting={submitting} submitLabel="Add Contact" submitColor="#0F172A" />
        </Modal>
      )}

      {modal === "edit" && (
        <Modal title={`Edit — ${editTarget?.name}`} onClose={closeModal}>
          <ContactForm form={form} setForm={setForm} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save Changes" submitColor="#6366F1" />
        </Modal>
      )}

      {modal === "import" && (
        <Modal title={`Import CSV to "${selectedList?.name}"`} onClose={closeModal}>
          {importResult ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "6px" }}>{importResult.imported} contacts imported</div>
              <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "20px" }}>{importResult.skipped} duplicates skipped</div>
              <button onClick={closeModal} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Done</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "12px 16px", fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>
                CSV format required:<br />
                <code style={{ color: "#0F172A" }}>name,phone</code><br />
                <code style={{ color: "#64748B" }}>John Doe,212600000000</code>
              </div>
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "24px", borderRadius: "10px", border: "2px dashed #E2E8F0", cursor: "pointer", background: importFile ? "#F0FDF4" : "#FAFAFA" }}>
                <span style={{ fontSize: "28px" }}>{importFile ? "📄" : "📂"}</span>
                <span style={{ fontSize: "13px", color: importFile ? "#15803D" : "#64748B", fontWeight: "500" }}>{importFile ? importFile.name : "Click to select CSV file"}</span>
                <input type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => setImportFile(e.target.files[0])} />
              </label>
              <button onClick={handleSubmit} disabled={!importFile || submitting} style={{ padding: "11px", borderRadius: "8px", border: "none", background: importFile ? "#0F172A" : "#E2E8F0", color: importFile ? "#fff" : "#94A3B8", fontWeight: "700", fontSize: "14px", cursor: importFile ? "pointer" : "not-allowed" }}>
                {submitting ? "Importing..." : "Import"}
              </button>
            </div>
          )}
        </Modal>
      )}

      {modal === "validateResult" && validateResult && (
        <Modal title="Validation Complete" onClose={closeModal}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>✅</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "14px" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A" }}>{validateResult.total}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>Total</div>
              </div>
              <div style={{ background: "#DCFCE7", borderRadius: "10px", padding: "14px" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#16A34A" }}>{validateResult.valid}</div>
                <div style={{ fontSize: "11px", color: "#16A34A", marginTop: "2px" }}>Valid</div>
              </div>
              <div style={{ background: "#FEE2E2", borderRadius: "10px", padding: "14px" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#DC2626" }}>{validateResult.invalid}</div>
                <div style={{ fontSize: "11px", color: "#DC2626", marginTop: "2px" }}>Invalid</div>
              </div>
            </div>
            <button onClick={closeModal} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#25D366", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Done</button>
          </div>
        </Modal>
      )}

      {confirmClear && (
        <Modal title="Clear Invalid Contacts" onClose={() => setConfirmClear(false)}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px" }}>This will permanently delete all <strong style={{ color: "#DC2626" }}>{contacts.filter(c => c.validationStatus === "invalid").length} invalid contacts</strong> from this list.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setConfirmClear(false)} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleClearInvalid} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#DC2626", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Delete Invalid</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
