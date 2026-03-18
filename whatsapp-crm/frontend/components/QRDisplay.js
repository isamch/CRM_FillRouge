"use client";

import { useEffect, useState } from "react";

export default function QRDisplay({ qr, onRefresh }) {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qr]);

  return (
    <div style={{ textAlign: "center" }}>
      {qr ? (
        <>
          <img src={qr} alt="QR Code" style={{ width: "220px", height: "220px", borderRadius: "12px", border: "2px solid #E2E8F0" }} />
          <p style={{ color: "#64748B", fontSize: "13px", marginTop: "12px" }}>
            {countdown > 0 ? `Expires in ${countdown}s` : "QR expired"}
          </p>
          {countdown === 0 && (
            <button onClick={onRefresh} style={{
              marginTop: "8px", padding: "8px 20px", borderRadius: "8px",
              background: "#25D366", color: "#fff", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: "600",
            }}>
              Refresh QR
            </button>
          )}
        </>
      ) : (
        <div style={{ color: "#64748B", fontSize: "14px" }}>Loading QR code...</div>
      )}
    </div>
  );
}
