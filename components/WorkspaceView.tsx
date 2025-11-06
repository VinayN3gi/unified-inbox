"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar"
import ContactInfoPanel from "@/components/ContactInfoPanel";

export default function WorkspaceView() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const res = await fetch("/api/contacts");
        const data = await res.json();
        setContacts(data);
        if (data.length > 0) setActiveContact(data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages for active contact
  useEffect(() => {
    if (!activeContact) return;
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await fetch(`/api/messages?contactId=${activeContact}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeContact]);

  // Send message
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
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: newMessage, incoming: false },
        ]);
        setNewMessage("");
      }
    } catch (e) {
      console.error(e);
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

      {/* Layout */}
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
