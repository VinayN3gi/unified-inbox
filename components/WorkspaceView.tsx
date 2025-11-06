"use client";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar";
import ContactInfoPanel from "@/components/ContactInfoPanel";

export default function WorkspaceView() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // ✅ Initialize Socket.IO server on mount
  useEffect(() => {
    fetch("/api/socket")
      .then((res) => res.json())
      .then((data) => console.log("🔌 Socket server status:", data))
      .catch((err) => console.error("❌ Socket server init failed:", err));
  }, []);

  // ✅ Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const res = await fetch("/api/contacts");
        const data = await res.json();
        setContacts(data);
        if (data.length > 0) setActiveContact(data[0].id);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // ✅ Fetch messages + join socket room
  useEffect(() => {
    if (!activeContact) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await fetch(`/api/messages?contactId=${activeContact}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Join contact room
    socket.emit("joinRoom", activeContact);

    // ✅ Listen for new messages (with duplicate guard)
    const handleNewMessage = (msg: any) => {
      if (msg.contactId !== activeContact) return;
      setMessages((prev) => {
        // prevent duplicates
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeContact]);

  // ✅ Send message (no duplicate add)
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: activeContact, body: newMessage }),
      });

      const result = await res.json();

      if (result.success) {
        const msg = {
          id: result.message?.id ?? Date.now(), // use DB id if available
          contactId: activeContact,
          body: newMessage,
          direction: "OUTBOUND",
          incoming: false,
        };

        // 🚫 Don’t add locally — let socket handle it
        socket.emit("sendMessage", msg);
        setNewMessage("");
      }
    } catch (e) {
      console.error("Error sending message:", e);
    } finally {
      setLoading(false);
    }
  };

  const active = contacts.find((c) => c.id === activeContact);

  return (
    <div className="relative flex h-screen bg-linear-to-br from-green-50 via-white to-teal-50 text-gray-800 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-400 rounded-full blur-[160px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500 rounded-full blur-[160px] opacity-30" />
      </div>

      <Sidebar
        contacts={contacts}
        activeContact={activeContact}
        setActiveContact={setActiveContact}
        loadingContacts={loadingContacts}
      />
      <ChatWindow
        messages={messages}
        activeContact={active}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        loading={loading}
        loadingMessages={loadingMessages}
      />
      <ContactInfoPanel activeContact={active} />
    </div>
  );
}
