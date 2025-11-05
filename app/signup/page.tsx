"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupUser } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signupUser(email, password, name);
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Left side - Hero */}
      <div className="flex-1 bg-linear-to-br from-teal-500 to-green-600 text-white flex flex-col justify-center p-12">
        <h1 className="text-4xl font-bold mb-4">Join Unified Mail</h1>
        <p className="text-lg opacity-90 leading-relaxed">
          One inbox for all your communication channels. Collaborate and reply
          faster with your entire team.
        </p>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-20 bg-gray-50">
        <form onSubmit={handleSignup} className="w-full max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Create Account
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full name"
              className="border-b border-gray-300 focus:border-green-600 outline-none py-3 bg-transparent text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              className="border-b border-gray-300 focus:border-green-600 outline-none py-3 bg-transparent text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border-b border-gray-300 focus:border-green-600 outline-none py-3 bg-transparent text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 py-3 rounded text-white font-medium transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

            <p className="text-sm mt-4 text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-green-600 hover:underline cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
