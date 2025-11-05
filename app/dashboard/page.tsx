"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-800 px-10 py-20">
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-bold">📨 Unified Mail Dashboard</h1>
        <button
          onClick={() => router.push("/api/auth/logout")}
          className="text-red-600 hover:underline text-sm"
        >
          Logout
        </button>
      </header>

      <section>
        <p className="text-lg text-gray-600">
          Welcome back 👋 — your unified inbox is coming soon.
        </p>
      </section>
    </main>
  );
}
