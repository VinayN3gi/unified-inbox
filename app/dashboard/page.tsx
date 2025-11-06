"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const match = document.cookie.match(/workspace_id=([^;]+)/);
    if (match) setWorkspace(match[1]);
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workspace/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join workspace");
      setWorkspace(data.team.id);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (!workspace) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-teal-400 rounded-full blur-[120px] opacity-50 animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-green-500 rounded-full blur-[120px] opacity-50 animate-pulse delay-700" />
        </div>

        
        <div className="absolute top-8 left-10 flex items-center gap-2">
          <div className="bg-linear-to-tr from-green-600 to-teal-500 p-2 rounded-lg">
            <Mail className="text-white" size={22} />
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Unified Mail
          </span>
        </div>

        
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            No Workspace Connected
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            To start using Unified Mail, please join your team’s workspace.
            Connect below to continue.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-linear-to-r from-green-600 to-teal-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-teal-200 transition-all duration-300"
          >
            Join Workspace
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 backdrop-blur-xs bg-white/30"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative w-[380px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fadeInUp">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Join Workspace
              </h2>

              {error && (
                <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
              )}

              <form onSubmit={handleJoin} className="flex flex-col gap-6">
                {/* Workspace Name */}
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
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm text-center mt-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-teal-400 rounded-full blur-[120px] opacity-50 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-green-500 rounded-full blur-[120px] opacity-50 animate-pulse delay-700" />
      </div>

      
      <div className="absolute top-8 left-10 flex items-center gap-2">
        <div className="bg-linear-to-tr from-green-600 to-teal-500 p-2 rounded-lg">
          <Mail className="text-white" size={22} />
        </div>
        <span className="text-xl font-semibold text-gray-800">
          Unified Mail
        </span>
      </div>

     
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 border border-gray-100 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Unified Mail 
        </h1>
        <p className="text-gray-600 text-lg">
          Your workspace is connected. Start collaborating and managing
          conversations across all your channels in one place.
        </p>
      </div>
    </main>
  );
}
