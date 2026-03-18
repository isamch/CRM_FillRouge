"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWhatsappStatus } from "@/hooks/useWhatsappStatus";
import QRDisplay from "@/components/QRDisplay";
import ConnectionStatus from "@/components/ConnectionStatus";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { useForm } from "@/lib/useForm";
import { rules } from "@/lib/rules";

const TABS = ["Account", "Connection"];

function FieldError({ error, touched }) {
  if (!error || !touched) return null;
  return <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0" }}>{error}</p>;
}

export default function SettingsPage() {
  const { user } = useAuthContext();
  const { status, qr, loading: waLoading, connect, disconnect } = useWhatsappStatus();
  const [tab, setTab] = useState(0);
  const toast = useToast();

  const profileForm = useForm(
    { name: user?.name || "" },
    { name: [rules.required("Name"), rules.min(2, "Name"), rules.max(50, "Name")] }
  );

  const passwordForm = useForm(
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    {
      currentPassword: [rules.required("Current password")],
      newPassword: [rules.required("New password"), rules.minLength(8)],
      confirmPassword: [rules.required("Confirm password")],
    }
  );

  const [saving, setSaving] = useState({ profile: false, password: false });

  const handleUpdateProfile = async () => {
    if (!profileForm.validate()) return;
    setSaving((p) => ({ ...p, profile: true }));
    try {
      await api.patch("/users/me", { name: profileForm.values.name });
      toast({ message: "Profile updated successfully" });
    } catch (e) {
      profileForm.setApiErrors(e);
      if (!Object.keys(profileForm.errors).length) toast({ message: e.response?.data?.message || "Failed to update", type: "error" });
    } finally {
      setSaving((p) => ({ ...p, profile: false }));
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.validate()) return;
    if (passwordForm.values.newPassword !== passwordForm.values.confirmPassword) {
      passwordForm.setApiErrors({ response: { data: { details: [{ field: "confirmPassword", message: "Passwords do not match" }] } } });
      return;
    }
    setSaving((p) => ({ ...p, password: true }));
    try {
      await api.patch("/users/me/password", { currentPassword: passwordForm.values.currentPassword, newPassword: passwordForm.values.newPassword });
      toast({ message: "Password changed successfully" });
      passwordForm.reset();
    } catch (e) {
      passwordForm.setApiErrors(e);
      if (!Object.keys(passwordForm.errors).length) toast({ message: e.response?.data?.message || "Failed to change password", type: "error" });
    } finally {
      setSaving((p) => ({ ...p, password: false }));
    }
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f9fafb" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>Settings</h1>
        <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Manage your account and WhatsApp connection</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#fff", padding: "4px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", width: "fit-content" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: "8px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, background: tab === i ? "#111827" : "transparent", color: tab === i ? "#fff" : "#6b7280", transition: "all 0.15s" }}>
            {t}
          </button>
        ))}
      </div>

      {/* TAB 0 — Account */}
      {tab === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "480px" }}>
          {/* Profile */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Profile</h3>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Full Name</label>
            <input {...profileForm.field("name")} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "14px", marginBottom: "4px", boxSizing: "border-box", ...profileForm.field("name").style }} />
            <FieldError error={profileForm.errors.name} touched={profileForm.touched.name} />
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email</label>
            <input value={user?.email || ""} disabled style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", background: "#f9fafb", color: "#9ca3af" }} />
            <button onClick={handleUpdateProfile} disabled={saving.profile} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#25d366", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13px", opacity: saving.profile ? 0.7 : 1 }}>
              {saving.profile ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Password */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Change Password</h3>
            {[
              { label: "Current Password", key: "currentPassword" },
              { label: "New Password", key: "newPassword" },
              { label: "Confirm New Password", key: "confirmPassword" },
            ].map(({ label, key }) => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{label}</label>
                <input type="password" {...passwordForm.field(key)} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", ...passwordForm.field(key).style }} />
                <FieldError error={passwordForm.errors[key]} touched={passwordForm.touched[key]} />
              </div>
            ))}
            <button onClick={handleChangePassword} disabled={saving.password} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#111827", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "13px", opacity: saving.password ? 0.7 : 1 }}>
              {saving.password ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 1 — Connection */}
      {tab === 1 && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>WhatsApp Connection</h3>
            {waLoading ? (
              <div style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>Loading...</div>
            ) : (
              <>
                <ConnectionStatus status={status} onDisconnect={disconnect} />
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                  {status === "disconnected" && (
                    <button onClick={connect} style={{ padding: "11px 32px", borderRadius: "8px", background: "#25d366", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                      Connect WhatsApp
                    </button>
                  )}
                  {status === "qr_pending" && (
                    <div style={{ marginTop: "8px" }}>
                      {qr ? <QRDisplay qr={qr} onRefresh={connect} /> : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "36px", height: "36px", border: "3px solid #e5e7eb", borderTop: "3px solid #25d366", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                          <p style={{ color: "#6b7280", fontSize: "13px" }}>Starting WhatsApp... this may take up to 30 seconds</p>
                          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                        </div>
                      )}
                    </div>
                  )}
                  {status === "connected" && (
                    <p style={{ color: "#10b981", fontSize: "14px", fontWeight: 600 }}>✅ Your WhatsApp is connected and ready.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
