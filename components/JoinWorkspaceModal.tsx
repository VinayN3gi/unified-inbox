"use client";

import { useState } from "react";

export default function JoinWorkspaceModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (workspaceId: string) => void;
}) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join workspace");

      document.cookie = `workspace_id=${data.team.id}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; SameSite=Lax`;
      localStorage.setItem("workspace_id", data.team.id);

      onSuccess(data.team.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to join workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-[2px] bg-white/40"
        onClick={onClose}
      ></div>

      <div className="relative w-[380px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 animate-fadeInUp">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Join Workspace
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          <div className="relative">
            <input
              type="text"
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="peer w-full border-b border-gray-300 focus:border-teal-600 bg-transparent outline-none py-3 text-gray-800"
              required
            />
            <label
              htmlFor="workspaceName"
              className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs"
            >
              Workspace Name
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="workspacePassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full border-b border-gray-300 focus:border-teal-600 bg-transparent outline-none py-3 text-gray-800"
              required
            />
            <label
              htmlFor="workspacePassword"
              className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs"
            >
              Workspace Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-linear-to-r from-green-600 to-teal-600 hover:shadow-lg hover:shadow-teal-200"
            }`}
          >
            {loading ? "Joining..." : "Join Workspace"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm text-center mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
