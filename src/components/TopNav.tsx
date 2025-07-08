"use client";

import AuthButton from "./AuthButton";

export default function TopNav() {
  return (
    <nav className="flex h-10 w-full items-center justify-between bg-[#1e152c] p-8 text-5xl font-light text-white">
      <span className="leading-none">Compat</span>
      <AuthButton />
    </nav>
  );
}
