"use client";

import { Phone, Mail } from "lucide-react";

interface ContactInfoPanelProps {
  activeContact: any;
}

export default function ContactInfoPanel({ activeContact }: ContactInfoPanelProps) {
  if (!activeContact) return null;

  return (
    <aside className="hidden lg:flex w-[300px] border-l border-green-100 bg-white/60 backdrop-blur-xl p-6 flex-col">
      <div className="text-center mb-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-tr from-green-300 to-teal-300 flex items-center justify-center text-2xl font-semibold text-green-800 shadow-md">
          {activeContact.name
            ? activeContact.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
            : "?"}
        </div>
        <h3 className="mt-3 font-bold text-gray-800">{activeContact.name}</h3>
        <p className="text-sm text-gray-500">Active Contact</p>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        {activeContact.phone && (
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-green-600" /> {activeContact.phone}
          </p>
        )}
        {activeContact.email && (
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-green-600" /> {activeContact.email}
          </p>
        )}
      </div>
    </aside>
  );
}
