"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loading: authLoading, user } = useAuthContext();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/templates");
      setTemplates(data.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = async (body) => {
    await api.post("/templates", body);
    await fetchTemplates();
  };

  const updateTemplate = async (id, body) => {
    await api.patch(`/templates/${id}`, body);
    await fetchTemplates();
  };

  const deleteTemplate = async (id) => {
    await api.delete(`/templates/${id}`);
    await fetchTemplates();
  };

  const duplicateTemplate = async (template) => {
    await api.post("/templates", {
      name: `${template.name} (copy)`,
      body: template.body,
    });
    await fetchTemplates();
  };

  useEffect(() => {
    if (!authLoading && user) fetchTemplates();
  }, [authLoading, user, fetchTemplates]);

  return { templates, loading, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate };
}
