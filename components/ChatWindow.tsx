"use client";

import { Send } from "lucide-react";

interface ChatWindowProps {
  messages: any[];
  activeContact: any;
  newMessage: string;
  setNewMessage: (v: string) => void;
  handleSendMessage: () => void;
  loading: boolean;
  loadingMessages: boolean;
}

export default function ChatWindow({
  messages,
  activeContact,
  newMessage,
  setNewMessage,
  handleSendMessage,
  loading,
  loadingMessages,
}: ChatWindowProps) {
  return (
    <main className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl border-x border-green-100">
      <div className="p-4 border-b border-green-100 flex justify-between items-center bg-linear-to-r from-green-50 to-teal-50">
        <h3 className="text-lg font-semibold text-green-700">
          {activeContact?.name || "No Contact Selected"}
        </h3>
        <span className="text-sm text-gray-500">{activeContact?.channel || ""}</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {loadingMessages ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div className="h-6 w-[60%] bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          ))
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-10">
            No messages yet. Start the conversation below.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.direction === "INBOUND" || m.incoming
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-300 ${
                  m.direction === "INBOUND" || m.incoming
                    ? "bg-linear-to-tr from-green-100 to-teal-100 text-gray-800"
                    : "bg-linear-to-tr from-green-600 to-teal-600 text-white"
                }`}
              >
                {m.body || m.text}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="text-center text-sm text-gray-400 italic mt-2">
            Sending message...
          </div>
        )}
      </div>

      {activeContact && (
        <div className="border-t border-green-100 p-4 flex items-center gap-3 bg-white/80 backdrop-blur-md">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className={`p-2.5 rounded-xl shadow-md transition-all ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-linear-to-tr from-green-600 to-teal-600 hover:opacity-90 text-white"
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-1" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      )}
    </main>
  );
}
