"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-50">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-teal-400 rounded-full blur-[120px] opacity-50 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-green-500 rounded-full blur-[120px] opacity-50 animate-pulse delay-700" />
      </div>

      {/* Header */}
      <div className="absolute top-8 left-10 flex items-center gap-2">
        <div className="bg-linear-to-tr from-green-600 to-teal-500 p-2 rounded-lg">
          <Mail className="text-white" size={22} />
        </div>
        <span className="text-xl font-semibold text-gray-800">Unified Mail</span>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 flex flex-col gap-6 animate-fadeIn"
      >
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
          Welcome back
        </h1>
        <p className="text-gray-500 text-center mb-4">
          Sign in to manage your messages, connect, and collaborate efficiently.
        </p>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full border-b border-gray-300 focus:border-teal-600 bg-transparent outline-none py-3 text-gray-800"
            required
          />
          <label
            htmlFor="email"
            className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs"
          >
            Email address
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full border-b border-gray-300 focus:border-teal-600 bg-transparent outline-none py-3 text-gray-800 pr-10"
            required
          />
          <label
            htmlFor="password"
            className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-linear-to-r from-green-600 to-teal-600 hover:shadow-lg hover:shadow-teal-200"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {error && (
          <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
        )}

        <p className="text-sm mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-teal-600 hover:underline cursor-pointer font-medium"
          >
            Create one
          </span>
        </p>
      </form>
    </main>
  );
}
