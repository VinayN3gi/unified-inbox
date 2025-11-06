"use client";

import { Mail, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  contacts: any[];
  activeContact: string | null;
  setActiveContact: (id: string) => void;
  loadingContacts: boolean;
}

export default function Sidebar({
  contacts,
  activeContact,
  setActiveContact,
  loadingContacts,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ Update contact name in DB
  const handleSaveName = async (id: string) => {
    if (!editedName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/contacts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editedName }),
      });
      if (res.ok) {
        // Reflect update instantly
        const index = contacts.findIndex((c) => c.id === id);
        if (index >= 0) contacts[index].name = editedName;
        setEditingId(null);
      }
    } catch (err) {
      console.error("Error updating name:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="w-[300px] border-r border-green-100 bg-white/60 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-green-100 flex items-center gap-3">
        <div className="bg-linear-to-tr from-green-600 to-teal-500 p-2 rounded-xl shadow-md">
          <Mail className="text-white" size={22} />
        </div>
        <span className="text-xl font-semibold tracking-tight text-gray-800">
          Unified Mail
        </span>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {loadingContacts ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 animate-pulse bg-gray-100/70 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : contacts.length === 0 ? (
          <p className="text-sm text-gray-500 p-3 text-center">
            No contacts found.
          </p>
        ) : (
          contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveContact(c.id)}
              className={`group flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                activeContact === c.id
                  ? "bg-linear-to-tr from-green-100 to-teal-50 shadow-inner border border-green-200"
                  : "hover:bg-gray-100"
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 shrink-0 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                {c.name
                  ? c.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : "?"}
              </div>

              {/* Name and Message */}
              <div className="flex-1 min-w-0">
                {editingId === c.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName(c.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="w-full px-2 py-1 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveName(c.id)}
                      disabled={saving}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 leading-tight truncate">
                      {c.name || "Unnamed Contact"}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(c.id);
                        setEditedName(c.name || "");
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-green-600"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-600 truncate max-w-[180px]">
                  {c.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
