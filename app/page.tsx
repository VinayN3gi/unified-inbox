"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });

        if (res.ok) {
          const data = await res.json();
          if (data?.authenticated) {
            router.replace("/dashboard");
          } else {
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-green-600 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-15%] w-[280px] h-[280px] bg-green-100 rounded-full blur-[100px] opacity-70 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[280px] h-[280px] bg-teal-100 rounded-full blur-[100px] opacity-70 animate-pulse delay-500" />
      <div className="flex flex-col items-center justify-center text-center space-y-5 z-10">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        <p className="text-lg font-medium text-green-700 animate-pulse">
          {loading ? "Checking your session..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
