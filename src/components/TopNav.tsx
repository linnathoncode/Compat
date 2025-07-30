"use client";

import { useSession } from "next-auth/react";
import AuthButton from "./AuthButton";

export default function TopNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav className="flex h-10 w-full items-center justify-between bg-[#1e152c] p-8 text-5xl font-light text-white">
        <button
          className="cursor-pointer border-none bg-transparent text-5xl leading-none font-light text-white"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Compat
        </button>
        <span className="animate-pulse text-sm text-gray-300">Loading...</span>
      </nav>
    );
  }

  return (
    <nav className="flex h-10 w-full items-center justify-between bg-[#1e152c] p-8 text-5xl font-light text-white">
      <button
        className="cursor-pointer border-none bg-transparent text-5xl leading-none font-light text-white"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Compat
      </button>
      <AuthButton />
    </nav>
  );
}
