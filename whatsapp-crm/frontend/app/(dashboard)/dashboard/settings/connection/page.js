"use client";

import { useWhatsappStatus } from "@/hooks/useWhatsappStatus";
import QRDisplay from "@/components/QRDisplay";
import ConnectionStatus from "@/components/ConnectionStatus";

export default function ConnectionPage() {
  const { status, qr, loading, connect, disconnect } = useWhatsappStatus();

  if (loading) return <div style={{ color: "#64748B", padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "480px" }}>
      <h2 style={{ color: "#1E293B", fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>
        WhatsApp Connection
      </h2>

      <ConnectionStatus status={status} onDisconnect={disconnect} />

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        {status === "disconnected" && (
          <button onClick={connect} style={{
            padding: "12px 32px", borderRadius: "10px",
            background: "#25D366", color: "#fff", border: "none",
            cursor: "pointer", fontSize: "14px", fontWeight: "600",
          }}>
            Connect WhatsApp
          </button>
        )}

        {status === "qr_pending" && (
          <QRDisplay qr={qr} onRefresh={connect} />
        )}

        {status === "connected" && (
          <p style={{ color: "#16A34A", fontSize: "14px", marginTop: "16px" }}>
            ✅ Your WhatsApp is connected and ready.
          </p>
        )}
      </div>
    </div>
  );
}
