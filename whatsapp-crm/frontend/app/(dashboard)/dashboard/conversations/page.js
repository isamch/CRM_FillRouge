"use client";

import { useState, useEffect, useRef } from "react";
import { useConversations } from "@/hooks/useConversations";

function Avatar({ name, size = 38 }) {
  const initials = name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#14B8A6"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "#6366F1";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "20", color, fontWeight: "700", fontSize: size * 0.35, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString();
}

export default function ConversationsPage() {
  const { conversations, messages, selectedChat, loading, selectChat, sendMessage, fetchConversations } = useConversations();
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = conversations.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 112px)", background: "#fff", borderRadius: "14px", border: "1px solid #E2E8F0", overflow: "hidden" }}>

      {/* Left — Conversation List */}
      <div style={{ width: "320px", flexShrink: 0, borderRight: "1px solid #F1F5F9", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>Conversations</span>
            <button onClick={fetchConversations} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px" }}>↻</button>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", background: "#F8FAFC", boxSizing: "border-box" }} />
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading.conversations ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", opacity: 0.3, marginBottom: "8px" }}>💬</div>
              <div style={{ fontSize: "13px", color: "#94A3B8" }}>
                {conversations.length === 0 ? "Connect WhatsApp to see conversations" : "No results"}
              </div>
            </div>
          ) : filtered.map((chat) => {
            const active = selectedChat?.id === chat.id;
            return (
              <div key={chat.id} onClick={() => selectChat(chat)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", background: active ? "#F0FDF4" : "transparent", borderLeft: `3px solid ${active ? "#25D366" : "transparent"}`, transition: "all 0.1s" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Avatar name={chat.name} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.name}</span>
                    <span style={{ fontSize: "11px", color: "#94A3B8", flexShrink: 0, marginLeft: "8px" }}>{formatDate(chat.lastMessageTime)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                    <span style={{ fontSize: "12px", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.lastMessage || "No messages"}</span>
                    {chat.unreadCount > 0 && (
                      <span style={{ background: "#25D366", color: "#fff", fontSize: "10px", fontWeight: "700", borderRadius: "20px", padding: "1px 6px", flexShrink: 0, marginLeft: "6px" }}>{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — Message Thread */}
      {!selectedChat ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", background: "#F8FAFC" }}>
          <div style={{ fontSize: "48px", opacity: 0.2 }}>💬</div>
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#94A3B8" }}>Select a conversation</div>
          <div style={{ fontSize: "13px", color: "#CBD5E1" }}>Choose from the list to start messaging</div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Chat Header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar name={selectedChat.name} size={38} />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>{selectedChat.name}</div>
              <div style={{ fontSize: "12px", color: "#94A3B8" }}>{selectedChat.isGroup ? "Group" : "Contact"}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "8px", background: "#F8FAFC" }}>
            {loading.messages ? (
              <div style={{ textAlign: "center", color: "#94A3B8", fontSize: "13px", marginTop: "40px" }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94A3B8", fontSize: "13px", marginTop: "40px" }}>No messages yet</div>
            ) : messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.fromMe ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "65%", padding: "8px 12px", borderRadius: msg.fromMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: msg.fromMe ? "#25D366" : "#fff",
                  color: msg.fromMe ? "#fff" : "#0F172A",
                  fontSize: "13px", lineHeight: 1.5,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <div>{msg.body}</div>
                  <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "4px", textAlign: "right" }}>{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "10px", alignItems: "center", background: "#fff" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..."
              style={{ flex: 1, padding: "10px 16px", borderRadius: "24px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", background: "#F8FAFC" }} />
            <button type="submit" disabled={!input.trim() || loading.sending} style={{
              width: "40px", height: "40px", borderRadius: "50%", border: "none",
              background: input.trim() ? "#25D366" : "#E2E8F0",
              color: input.trim() ? "#fff" : "#94A3B8",
              cursor: input.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0,
            }}>➤</button>
          </form>
        </div>
      )}
    </div>
  );
}
