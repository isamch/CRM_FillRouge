"use client";

import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";

const col = {
  background: "#FFFFFF",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  minHeight: "500px",
};

const colHeader = {
  padding: "16px 20px",
  borderBottom: "1px solid #E2E8F0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const colTitle = { fontSize: "14px", fontWeight: "700", color: "#1E293B" };

const itemRow = (active) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px",
  cursor: "pointer",
  background: active ? "#F0FDF4" : "transparent",
  borderLeft: active ? "3px solid #25D366" : "3px solid transparent",
  transition: "all 0.1s",
});

const badge = {
  fontSize: "11px",
  background: "#F1F5F9",
  color: "#64748B",
  borderRadius: "20px",
  padding: "2px 8px",
};

const deleteBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#CBD5E1",
  fontSize: "14px",
  padding: "2px 6px",
  borderRadius: "4px",
};

const addBtn = {
  background: "#25D366",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "4px 10px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const emptyState = (msg) => (
  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: "13px" }}>
    {msg}
  </div>
);

function AddForm({ placeholder, onAdd, loading }) {
  const [value, setValue] = useState("");
  const [extra, setExtra] = useState("");
  const isPhone = placeholder.includes("phone");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    await onAdd(isPhone ? { name: value, phone: extra } : value);
    setValue("");
    setExtra("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "12px 16px", borderTop: "1px solid #E2E8F0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isPhone ? "Name" : placeholder}
        style={{ flex: 1, minWidth: "80px", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none" }}
      />
      {isPhone && (
        <input
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="212XXXXXXXXX"
          style={{ flex: 1, minWidth: "100px", padding: "7px 10px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none" }}
        />
      )}
      <button type="submit" disabled={loading} style={addBtn}>+</button>
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
    createContact, deleteContact,
    fetchContacts,
  } = useContacts();

  return (
    <div>
      <h2 style={{ color: "#1E293B", fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>Contacts</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: "16px", alignItems: "start" }}>

        {/* Column 1 — Categories */}
        <div style={col}>
          <div style={colHeader}>
            <span style={colTitle}>Categories</span>
            <span style={{ ...badge }}>{categories.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading.categories
              ? emptyState("Loading...")
              : categories.length === 0
              ? emptyState("No categories yet")
              : categories.map((cat) => (
                  <div key={cat._id} style={itemRow(selectedCategory?._id === cat._id)} onClick={() => selectCategory(cat)}>
                    <span style={{ fontSize: "13px", color: "#1E293B" }}>📁 {cat.name}</span>
                    <button style={deleteBtn} onClick={(e) => { e.stopPropagation(); deleteCategory(cat._id); }}>✕</button>
                  </div>
                ))}
          </div>
          <AddForm placeholder="Category name" onAdd={createCategory} loading={loading.categories} />
        </div>

        {/* Column 2 — Contact Lists */}
        <div style={col}>
          <div style={colHeader}>
            <span style={colTitle}>
              {selectedCategory ? `Lists — ${selectedCategory.name}` : "Contact Lists"}
            </span>
            <span style={badge}>{lists.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {!selectedCategory
              ? emptyState("Select a category")
              : loading.lists
              ? emptyState("Loading...")
              : lists.length === 0
              ? emptyState("No lists yet")
              : lists.map((list) => (
                  <div key={list._id} style={itemRow(selectedList?._id === list._id)} onClick={() => selectList(list)}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#1E293B" }}>📋 {list.name}</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8" }}>{list.contactCount} contacts</div>
                    </div>
                    <button style={deleteBtn} onClick={(e) => { e.stopPropagation(); deleteList(list._id); }}>✕</button>
                  </div>
                ))}
          </div>
          {selectedCategory && (
            <AddForm placeholder="List name" onAdd={createList} loading={loading.lists} />
          )}
        </div>

        {/* Column 3 — Contacts */}
        <div style={col}>
          <div style={colHeader}>
            <span style={colTitle}>
              {selectedList ? `Contacts — ${selectedList.name}` : "Contacts"}
            </span>
            <span style={badge}>{contacts.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {!selectedList
              ? emptyState("Select a list")
              : loading.contacts
              ? emptyState("Loading...")
              : contacts.length === 0
              ? emptyState("No contacts yet")
              : contacts.map((c) => (
                  <div key={c._id} style={{ ...itemRow(false), cursor: "default" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#1E293B", fontWeight: "500" }}>👤 {c.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>{c.phone}</div>
                    </div>
                    <button style={deleteBtn} onClick={() => deleteContact(c._id)}>✕</button>
                  </div>
                ))}
          </div>

          {/* Pagination */}
          {selectedList && pagination.totalPages > 1 && (
            <div style={{ padding: "8px 16px", borderTop: "1px solid #E2E8F0", display: "flex", gap: "8px", justifyContent: "center" }}>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => fetchContacts(selectedList._id, p)} style={{
                  padding: "4px 10px", borderRadius: "6px", border: "1px solid #E2E8F0",
                  background: pagination.page === p ? "#25D366" : "#fff",
                  color: pagination.page === p ? "#fff" : "#64748B",
                  fontSize: "12px", cursor: "pointer",
                }}>{p}</button>
              ))}
            </div>
          )}

          {selectedList && (
            <AddForm placeholder="Name + phone" onAdd={createContact} loading={loading.contacts} />
          )}
        </div>

      </div>
    </div>
  );
}
