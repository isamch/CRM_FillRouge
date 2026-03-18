"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState({ conversations: false, messages: false, sending: false });
  const { loading: authLoading, user } = useAuthContext();

  const fetchConversations = useCallback(async () => {
    setLoading((p) => ({ ...p, conversations: true }));
    try {
      const { data } = await api.get("/whatsapp/conversations");
      setConversations(data.data.conversations);
    } catch {
      setConversations([]);
    } finally {
      setLoading((p) => ({ ...p, conversations: false }));
    }
  }, []);

  const fetchMessages = useCallback(async (chatId) => {
    setLoading((p) => ({ ...p, messages: true }));
    try {
      const { data } = await api.get(`/whatsapp/conversations/${chatId}/messages`);
      setMessages(data.data.data);
    } catch {
      setMessages([]);
    } finally {
      setLoading((p) => ({ ...p, messages: false }));
    }
  }, []);

  const selectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    fetchMessages(chat.id);
  };

  const sendMessage = async (body) => {
    if (!selectedChat) return;
    setLoading((p) => ({ ...p, sending: true }));
    try {
      const { data } = await api.post(`/whatsapp/conversations/${selectedChat.id}/messages`, { body });
      setMessages((p) => [...p, data.data.message]);
    } finally {
      setLoading((p) => ({ ...p, sending: false }));
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchConversations();
  }, [authLoading, user, fetchConversations]);

  return { conversations, messages, selectedChat, loading, selectChat, sendMessage, fetchConversations };
}
