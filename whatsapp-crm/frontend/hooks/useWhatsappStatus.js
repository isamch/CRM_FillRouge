"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useWhatsappStatus() {
  const [status, setStatus] = useState("disconnected");
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const { data } = await api.get("/whatsapp/status");
      setStatus(data.data.status);
    } catch {
      setStatus("disconnected");
    } finally {
      setLoading(false);
    }
  };

  const fetchQR = async () => {
    try {
      const { data } = await api.get("/whatsapp/qr");
      setQr(data.data.qr);
    } catch {
      setQr(null);
    }
  };

  const connect = async () => {
    await api.post("/whatsapp/connect");
    setStatus("qr_pending");
    await fetchQR();
  };

  const disconnect = async () => {
    await api.post("/whatsapp/disconnect");
    setStatus("disconnected");
    setQr(null);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
      if (status === "qr_pending") fetchQR();
    }, 3000);
    return () => clearInterval(interval);
  }, [status]);

  return { status, qr, loading, connect, disconnect };
}
