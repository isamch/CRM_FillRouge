"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAdmin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [usersStats, setUsersStats] = useState([]);
  const [loading, setLoading] = useState({ users: false, stats: false });
  const { loading: authLoading, user } = useAuthContext();

  const fetchUsers = useCallback(async () => {
    setLoading((p) => ({ ...p, users: true }));
    try {
      const { data } = await api.get("/users?limit=100");
      setUsers(data.data.users);
    } finally {
      setLoading((p) => ({ ...p, users: false }));
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading((p) => ({ ...p, stats: true }));
    try {
      const [statsRes, usersStatsRes] = await Promise.all([
        api.get("/users/admin/stats"),
        api.get("/users/admin/users-stats"),
      ]);
      setStats(statsRes.data.data);
      setUsersStats(usersStatsRes.data.data.users);
    } finally {
      setLoading((p) => ({ ...p, stats: false }));
    }
  }, []);

  const toggleStatus = async (id) => {
    await api.patch(`/users/${id}/toggle-status`);
    await fetchUsers();
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  };

  const createUser = async (body) => {
    await api.post("/users", body);
    await fetchUsers();
  };

  const sendNotification = async (body) => {
    await api.post("/notifications", body);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers();
      fetchStats();
    }
  }, [authLoading, user, fetchUsers, fetchStats]);

  return { users, stats, usersStats, loading, toggleStatus, deleteUser, createUser, sendNotification, fetchUsers };
}
