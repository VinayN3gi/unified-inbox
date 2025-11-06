"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, StickyNote, Loader2 } from "lucide-react";
import socket from "@/lib/socket";

interface ContactInfoPanelProps {
  activeContact: any;
}

export default function ContactInfoPanel({ activeContact }: ContactInfoPanelProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch notes safely
  useEffect(() => {
    if (!activeContact?.id) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notes/${activeContact.id}`, { cache: "no-store" });
        const data = await res.json();

        // ✅ ensure we always have an array
        if (Array.isArray(data)) {
          setNotes(data);
        } else if (data && typeof data === "object" && "notes" in data && Array.isArray(data.notes)) {
          setNotes(data.notes);
        } else {
          console.warn("⚠️ Unexpected notes response:", data);
          setNotes([]);
        }
      } catch (err) {
        console.error("Error loading notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // ✅ Join contact room for real-time updates
    socket.emit("joinRoom", activeContact.id);
    console.log(`📥 Joined room for contact: ${activeContact.id}`);

    const handleNewNote = (note: any) => {
      console.log("📝 Received new note via socket:", note);
      
      // Only add if it's for the current active contact
      if (note.contactId === activeContact.id) {
        setNotes((prev) => {
          if (!Array.isArray(prev)) return [note];
          
          // Prevent duplicates by checking note ID
          if (prev.some((n) => n.id === note.id)) {
            console.log("⚠️ Duplicate note detected, skipping:", note.id);
            return prev;
          }
          
          return [note, ...prev];
        });
      }
    };

    socket.on("newNote", handleNewNote);

    return () => {
      socket.off("newNote", handleNewNote);
      // Optional: leave room when switching contacts
      // socket.emit("leaveRoom", activeContact.id);
    };
  }, [activeContact?.id]);

  // ✅ Add note with proper socket broadcast
  const handleAddNote = async () => {
    if (!newNote.trim() || !activeContact?.id) return;
    
    setSaving(true);
    const noteContent = newNote.trim();
    
    try {
      const res = await fetch("/api/notes/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: activeContact.id,
          content: noteContent,
        }),
      });
      
      const data = await res.json();

      if (res.ok && data) {
        console.log("✅ Note saved to database:", data);
        
        // Clear input immediately
        setNewNote("");
        
        // Broadcast to all clients in the room (including this one)
        socket.emit("addNote", data);
        console.log("📤 Broadcasted note to room:", activeContact.id);
      } else {
        console.error("Failed to save note:", data);
      }
    } catch (err) {
      console.error("❌ Error adding note:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="flex w-[300px] border-l border-green-100 bg-white/60 backdrop-blur-xl p-6 flex-col">
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

      <div className="mt-4 border-t border-green-100 pt-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <StickyNote size={16} className="text-green-600" />
          <h4 className="font-semibold text-gray-800">Team Notes</h4>
        </div>

        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <Loader2 className="animate-spin text-green-600" size={20} />
          </div>
        ) : Array.isArray(notes) && notes.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No notes yet.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {Array.isArray(notes) &&
              notes.map((n) => (
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

        <div className="mt-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddNote();
              }
            }}
            placeholder="Add a note for your team..."
            className="w-full text-sm border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            rows={2}
            disabled={saving}
          />
          <button
            onClick={handleAddNote}
            disabled={saving || !newNote.trim()}
            className="mt-2 w-full py-2 bg-linear-to-tr from-green-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Add Note"}
          </button>
        </div>
      </div>
    </aside>
  );
}