"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useContacts() {
  const [categories, setCategories] = useState([]);
  const [lists, setLists] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState({ categories: false, lists: false, contacts: false });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Categories
  const fetchCategories = useCallback(async () => {
    setLoading((p) => ({ ...p, categories: true }));
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data.categories);
    } finally {
      setLoading((p) => ({ ...p, categories: false }));
    }
  }, []);

  const createCategory = async (name) => {
    await api.post("/categories", { name });
    await fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    if (selectedCategory?._id === id) {
      setSelectedCategory(null);
      setLists([]);
      setContacts([]);
      setSelectedList(null);
    }
    await fetchCategories();
  };

  // Contact Lists
  const fetchLists = useCallback(async (categoryId) => {
    setLoading((p) => ({ ...p, lists: true }));
    try {
      const { data } = await api.get(`/contact-lists?categoryId=${categoryId}`);
      setLists(data.data.lists);
    } finally {
      setLoading((p) => ({ ...p, lists: false }));
    }
  }, []);

  const createList = async (name) => {
    await api.post("/contact-lists", { name, categoryId: selectedCategory._id });
    await fetchLists(selectedCategory._id);
  };

  const deleteList = async (id) => {
    await api.delete(`/contact-lists/${id}`);
    if (selectedList?._id === id) {
      setSelectedList(null);
      setContacts([]);
    }
    await fetchLists(selectedCategory._id);
  };

  // Contacts
  const fetchContacts = useCallback(async (listId, page = 1) => {
    setLoading((p) => ({ ...p, contacts: true }));
    try {
      const { data } = await api.get(`/contacts?listId=${listId}&page=${page}&limit=20`);
      setContacts(data.data.data);
      setPagination({ page: data.data.meta?.page || 1, totalPages: data.data.meta?.totalPages || 1 });
    } finally {
      setLoading((p) => ({ ...p, contacts: false }));
    }
  }, []);

  const createContact = async ({ name, phone, notes }) => {
    await api.post("/contacts", { name, phone, notes, listId: selectedList._id });
    await fetchContacts(selectedList._id, pagination.page);
  };

  const updateContact = async (id, body) => {
    await api.patch(`/contacts/${id}`, body);
    await fetchContacts(selectedList._id, pagination.page);
  };

  const deleteContact = async (id) => {
    await api.delete(`/contacts/${id}`);
    await fetchContacts(selectedList._id, pagination.page);
  };

  // Selection handlers
  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedList(null);
    setContacts([]);
    fetchLists(cat._id);
  };

  const selectList = (list) => {
    setSelectedList(list);
    fetchContacts(list._id, 1);
  };

  const { loading: authLoading, user } = useAuthContext();

  useEffect(() => {
    if (!authLoading && user) fetchCategories();
  }, [authLoading, user, fetchCategories]);

  return {
    categories, lists, contacts,
    selectedCategory, selectedList,
    loading, pagination,
    selectCategory, selectList,
    createCategory, deleteCategory,
    createList, deleteList,
    createContact, deleteContact, updateContact,
    fetchContacts,
  };
}
