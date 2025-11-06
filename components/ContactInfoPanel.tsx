"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, StickyNote, Loader2 } from "lucide-react";

interface ContactInfoPanelProps {
  activeContact: any;
}

export default function ContactInfoPanel({ activeContact }: ContactInfoPanelProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch notes when active contact changes
  useEffect(() => {
    if (!activeContact?.id) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notes/${activeContact.id}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error loading notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [activeContact?.id]);

  // Add a new note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/notes/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: activeContact.id,
          content: newNote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes((prev) => [data, ...prev]);
        setNewNote("");
      }
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="hidden lg:flex w-[300px] border-l border-green-100 bg-white/60 backdrop-blur-xl p-6 flex-col">
      {/* Contact Info */}
      <div className="text-center mb-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-tr from-green-300 to-teal-300 flex items-center justify-center text-2xl font-semibold text-green-800 shadow-md">
          {activeContact?.name
            ? activeContact.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
            : "?"}
        </div>
        <h3 className="mt-3 font-bold text-gray-800">{activeContact?.name}</h3>
        <p className="text-sm text-gray-500">Active Contact</p>
      </div>

      {/* Phone & Email */}
      <div className="space-y-3 text-sm text-gray-600 mb-4">
        {activeContact?.phone && (
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-green-600" /> {activeContact.phone}
          </p>
        )}
        {activeContact?.email && (
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-green-600" /> {activeContact.email}
          </p>
        )}
      </div>

      {/* Team Notes */}
      <div className="mt-4 border-t border-green-100 pt-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <StickyNote size={16} className="text-green-600" />
          <h4 className="font-semibold text-gray-800">Team Notes</h4>
        </div>

        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <Loader2 className="animate-spin text-green-600" size={20} />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No notes yet.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {notes.map((n) => (
              <div
                key={n.id}
                className="p-2 border border-green-100 rounded-lg bg-white shadow-sm"
              >
                <p className="text-sm text-gray-700 whitespace-pre-line">{n.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  — {n.user?.name || "Unknown"} ·{" "}
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add note */}
        <div className="mt-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note for your team..."
            className="w-full text-sm border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            rows={2}
          />
          <button
            onClick={handleAddNote}
            disabled={saving}
            className="mt-2 w-full py-2 bg-linear-to-tr from-green-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            {saving ? "Saving..." : "Add Note"}
          </button>
        </div>
      </div>
    </aside>
  );
}
