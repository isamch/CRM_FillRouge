"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loading: authLoading, user } = useAuthContext();
  const toast = useToast();

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
    toast({ message: "Template created" });
  };

  const updateTemplate = async (id, body) => {
    await api.patch(`/templates/${id}`, body);
    await fetchTemplates();
    toast({ message: "Template updated" });
  };

  const deleteTemplate = async (id) => {
    await api.delete(`/templates/${id}`);
    await fetchTemplates();
    toast({ message: "Template deleted", type: "info" });
  };

  const duplicateTemplate = async (template) => {
    await api.post("/templates", { name: `${template.name} (copy)`, body: template.body });
    await fetchTemplates();
    toast({ message: "Template duplicated" });
  };

  useEffect(() => {
    if (!authLoading && user) fetchTemplates();
  }, [authLoading, user, fetchTemplates]);

  return { templates, loading, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate };
}
