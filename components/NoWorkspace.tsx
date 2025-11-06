"use client";

import { Mail } from "lucide-react";

export default function NoWorkspace({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="text-center px-6">
      {/* Background Header */}
      <div className="absolute top-8 left-10 flex items-center gap-2">
        <div className="bg-linear-to-tr from-green-600 to-teal-500 p-2 rounded-lg">
          <Mail className="text-white" size={22} />
        </div>
        <span className="text-xl font-semibold text-gray-800">Unified Mail</span>
      </div>

      {/* Message */}
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        No Workspace Connected
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        To start using Unified Mail, please join your team’s workspace.  
        Connect below to continue.
      </p>

      <button
        onClick={onJoin}
        className="px-8 py-3 bg-linear-to-r from-green-600 to-teal-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-teal-200 transition-all duration-300"
      >
        Join Workspace
      </button>
    </div>
  );
}
