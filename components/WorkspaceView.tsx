"use client";

import { Mail, Send, Phone, User, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function WorkspaceView() {
  const [activeContact, setActiveContact] = useState(1);

  const contacts = [
    {
      id: 1,
      name: "Mary Kim",
      channel: "WhatsApp",
      last: "Can I get a discount for my next purchase?",
      initials: "MK",
    },
    {
      id: 2,
      name: "John Harrison",
      channel: "SMS",
      last: "Hi, I have a question regarding delivery timing please confirm.",
      initials: "JH",
    },
    {
      id: 3,
      name: "Melanie Greene",
      channel: "WhatsApp",
      last: "I can’t wait!! I’ll be there tomorrow morning with the documents.",
      initials: "MG",
    },
  ];

  const messages = [
    { id: 1, sender: "Mary Kim", text: "Can I get a discount for my next purchase?", incoming: true },
    { id: 2, sender: "You", text: "We’re so glad to hear! Come back again 🌿", incoming: false },
  ];

  return (
    <div className="relative flex h-screen bg-linear-to-br from-green-50 via-white to-teal-50 text-gray-800 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-400 rounded-full blur-[160px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500 rounded-full blur-[160px] opacity-30" />
      </div>

      {/* Sidebar */}
      <aside className="w-[300px] border-r border-green-100 bg-white/60 backdrop-blur-xl flex flex-col">
        <div className="p-5 border-b border-green-100 flex items-center gap-3">
          <div className="bg-linear-to-tr from-green-600 to-teal-500 p-2 rounded-xl shadow-md">
            <Mail className="text-white" size={22} />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-800">
            Unified Mail
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveContact(c.id)}
              className={`group flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                activeContact === c.id
                  ? "bg-linear-to-tr from-green-100 to-teal-50 shadow-inner border border-green-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 h-10 shrink-0 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 leading-tight">
                  {c.name}
                </h4>
                <p className="text-sm text-gray-600 truncate max-w-[180px]">
                  {c.last}
                </p>
              </div>
              <span className="text-[11px] text-green-600 mt-1">
                {c.channel}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Section */}
      <main className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl border-x border-green-100">
        <div className="p-4 border-b border-green-100 flex justify-between items-center bg-linear-to-r from-green-50 to-teal-50">
          <h3 className="text-lg font-semibold text-green-700">
            {contacts.find((c) => c.id === activeContact)?.name}
          </h3>
          <span className="text-sm text-gray-500">
            {contacts.find((c) => c.id === activeContact)?.channel}
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.incoming ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-300 ${
                  m.incoming
                    ? "bg-linear-to-tr from-green-100 to-teal-100 text-gray-800"
                    : "bg-linear-to-tr from-green-600 to-teal-600 text-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-green-100 p-4 flex items-center gap-3 bg-white/80 backdrop-blur-md">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400"
          />
          <button className="p-2.5 bg-linear-to-tr from-green-600 to-teal-600 hover:opacity-90 text-white rounded-xl shadow-md transition-all">
            <Send size={18} />
          </button>
        </div>
      </main>

      {/* Right Contact Info Panel */}
      <aside className="hidden lg:flex w-[300px] border-l border-green-100 bg-white/60 backdrop-blur-xl p-6 flex-col">
        <div className="text-center mb-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-tr from-green-300 to-teal-300 flex items-center justify-center text-2xl font-semibold text-green-800 shadow-md">
            {contacts.find((c) => c.id === activeContact)?.initials}
          </div>
          <h3 className="mt-3 font-bold text-gray-800">
            {contacts.find((c) => c.id === activeContact)?.name}
          </h3>
          <p className="text-sm text-gray-500">Regional Buyer</p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-green-600" /> +1 (888) 345-6789
          </p>
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-green-600" /> marykim@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <User size={16} className="text-green-600" /> Responsible: Ariel
          </p>
          <p className="flex items-center gap-2">
            <MessageSquare size={16} className="text-green-600" /> Sale: $1200
          </p>
        </div>

        <div className="mt-auto pt-6">
          <button className="w-full py-2 rounded-xl bg-linear-to-tr from-green-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-all shadow-md">
            View Conversation Log
          </button>
        </div>
      </aside>
    </div>
  );
}
