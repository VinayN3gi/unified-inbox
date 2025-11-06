"use client";

import { Mail } from "lucide-react";

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
  return (
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
              <div className="w-10 h-10 shrink-0 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                {c.name
                  ? c.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 leading-tight">
                  {c.name || "Unnamed Contact"}
                </h4>
                <p className="text-sm text-gray-600 truncate max-w-[180px]">
                  {c.lastMessage || "No messages yet"}
                </p>
              </div>
              <span className="text-[11px] text-green-600 mt-1">
                {c.channel || "SMS"}
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
