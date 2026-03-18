"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const COLORS = {
    success: { bg: "#dcfce7", border: "#86efac", color: "#15803d", icon: "✓" },
    error:   { bg: "#fee2e2", border: "#fca5a5", color: "#991b1b", icon: "✕" },
    info:    { bg: "#dbeafe", border: "#93c5fd", color: "#1d4ed8", icon: "ℹ" },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 9999 }}>
        {toasts.map((t) => {
          const c = COLORS[t.type] || COLORS.success;
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: "14px", fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: "260px", maxWidth: "380px", animation: "slideIn 0.2s ease" }}>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>{c.icon}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: c.color, fontSize: "16px", padding: 0, opacity: 0.6 }}>✕</button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
};
