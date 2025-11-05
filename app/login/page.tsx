"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Hero */}
      <div className="flex-1 bg-linear-to-br from-indigo-500 to-blue-600 text-white flex flex-col justify-center p-12">
        <h1 className="text-4xl font-bold mb-4">Unified Mail Dashboard</h1>
        <p className="text-lg opacity-90 leading-relaxed">
          Manage all your messages — email, WhatsApp, and SMS — from one clean
          interface. Stay organized and never miss a message again.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-20 bg-gray-50">
        <form onSubmit={handleLogin} className="w-full max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">Login</h2>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              className="border-b border-gray-300 focus:border-blue-600 outline-none py-3 bg-transparent text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border-b border-gray-300 focus:border-blue-600 outline-none py-3 bg-transparent text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 py-3 rounded text-white font-medium transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            <p className="text-sm mt-4 text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Create one
              </span>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
