"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "~/context/AuthContext";
export default function HomePage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, status]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#000000f9] to-[#1e152c] pt-12 text-white">
      {/**TO:DO Landing Page */}
      Landing Page
    </main>
  );
}
