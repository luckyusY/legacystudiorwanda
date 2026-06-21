"use client";

import { useEffect, useState } from "react";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/admin/contacts").then((r) => r.json());
    setMessages(data.messages || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m._id !== id));
  }

  return (
    <div>
      <h1 className="font-serif text-3xl">Messages</h1>
      <p className="text-muted mt-2 text-sm">
        {messages.filter((m) => !m.read).length} unread of {messages.length}
      </p>

      {loading ? (
        <p className="text-muted mt-8">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-muted mt-8">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`card rounded-xl p-5 ${!m.read ? "border-gold/40" : ""}`}
              onClick={() => !m.read && toggleRead(m._id, true)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-gold inline-block" />}
                    <h3 className="font-serif text-lg">{m.name}</h3>
                  </div>
                  <p className="text-sm text-gold mt-0.5">{m.subject || "(no subject)"}</p>
                  <p className="text-xs text-muted mt-1">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <p className="text-sm text-foreground/85 mt-3 leading-relaxed whitespace-pre-wrap">
                {m.message}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border text-sm">
                <a href={`mailto:${m.email}`} className="text-gold hover:underline">
                  {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="text-foreground/70 hover:text-gold">
                    {m.phone}
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRead(m._id, !m.read);
                  }}
                  className="text-foreground/60 hover:text-gold ml-auto"
                >
                  Mark {m.read ? "unread" : "read"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(m._id);
                  }}
                  className="text-red-400/80 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
