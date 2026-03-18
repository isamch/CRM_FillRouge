"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const { loading: authLoading, user } = useAuthContext();

  const fetchCampaigns = useCallback(async (status = "", page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (status) params.set("status", status);
      const { data } = await api.get(`/campaigns?${params}`);
      setCampaigns(data.data.data);
      setMeta(data.data.meta);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = async (body) => {
    const { data } = await api.post("/campaigns", body);
    await fetchCampaigns(statusFilter);
    return data.data;
  };

  const updateCampaign = async (id, body) => {
    await api.patch(`/campaigns/${id}`, body);
    await fetchCampaigns(statusFilter);
  };

  const deleteCampaign = async (id) => {
    await api.delete(`/campaigns/${id}`);
    await fetchCampaigns(statusFilter);
  };

  const runCampaign = async (id) => {
    await api.post(`/campaigns/${id}/run`);
    await fetchCampaigns(statusFilter);
  };

  const pauseCampaign = async (id) => {
    await api.post(`/campaigns/${id}/pause`);
    await fetchCampaigns(statusFilter);
  };

  const resumeCampaign = async (id) => {
    await api.post(`/campaigns/${id}/resume`);
    await fetchCampaigns(statusFilter);
  };

  const stopCampaign = async (id) => {
    await api.post(`/campaigns/${id}/stop`);
    await fetchCampaigns(statusFilter);
  };

  const scheduleCampaign = async (id, scheduledAt) => {
    await api.post(`/campaigns/${id}/schedule`, { scheduledAt });
    await fetchCampaigns(statusFilter);
  };

  const filterByStatus = (status) => {
    setStatusFilter(status);
    fetchCampaigns(status);
  };

  useEffect(() => {
    if (!authLoading && user) fetchCampaigns();
  }, [authLoading, user, fetchCampaigns]);

  return {
    campaigns, meta, loading, statusFilter,
    fetchCampaigns, filterByStatus,
    createCampaign, updateCampaign, deleteCampaign,
    runCampaign, pauseCampaign, resumeCampaign, stopCampaign, scheduleCampaign,
  };
}

export function useCampaignDetail(id) {
  const [campaign, setCampaign] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaign = useCallback(async () => {
    try {
      const { data } = await api.get(`/campaigns/${id}`);
      setCampaign(data.data);
    } catch { /* ignore */ }
  }, [id]);

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get(`/campaigns/${id}/logs?limit=50`);
      setLogs(data.data.data);
    } catch { /* ignore */ }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchCampaign(), fetchLogs()]).finally(() => setLoading(false));
  }, [fetchCampaign, fetchLogs, id]);

  // Polling for running/paused campaigns
  useEffect(() => {
    if (!campaign || !["running", "paused"].includes(campaign.status)) return;
    const interval = setInterval(() => fetchCampaign(), 3000);
    return () => clearInterval(interval);
  }, [campaign?.status, fetchCampaign]);

  return { campaign, logs, loading, fetchCampaign, fetchLogs };
}
