"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const { loading: authLoading, user } = useAuthContext();

  const fetchInbox = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/notifications/inbox?page=${page}&limit=20`);
      setNotifications(data.data.data);
      setMeta(data.data.meta);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    await api.patch("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = async (id) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  useEffect(() => {
    if (!authLoading && user) fetchInbox();
  }, [authLoading, user, fetchInbox]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, meta, loading, unreadCount, fetchInbox, markAsRead, markAllAsRead, deleteNotification };
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const { loading: authLoading, user } = useAuthContext();

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications/unread-count");
      setCount(data.data.count);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetch();
      const interval = setInterval(fetch, 30000);
      return () => clearInterval(interval);
    }
  }, [authLoading, user, fetch]);

  return { count, refresh: fetch };
}
