"use client";

const statusConfig = {
  connected: { color: "#16A34A", bg: "#F0FDF4", label: "Connected", dot: "#16A34A" },
  disconnected: { color: "#DC2626", bg: "#FEF2F2", label: "Disconnected", dot: "#DC2626" },
  qr_pending: { color: "#D97706", bg: "#FFFBEB", label: "Waiting for scan...", dot: "#D97706" },
};

export default function ConnectionStatus({ status, onDisconnect }) {
  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px", borderRadius: "12px",
      background: config.bg, border: `1px solid ${config.color}22`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "10px", height: "10px", borderRadius: "50%",
          background: config.dot,
          boxShadow: status === "connected" ? `0 0 6px ${config.dot}` : "none",
        }} />
        <span style={{ color: config.color, fontWeight: "600", fontSize: "14px" }}>
          {config.label}
        </span>
      </div>
      {status === "connected" && (
        <button onClick={onDisconnect} style={{
          padding: "6px 16px", borderRadius: "8px", fontSize: "13px",
          background: "transparent", border: "1px solid #DC2626",
          color: "#DC2626", cursor: "pointer", fontWeight: "500",
        }}>
          Disconnect
        </button>
      )}
    </div>
  );
}
