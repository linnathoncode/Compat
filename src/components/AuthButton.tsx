"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <span>Hi, {session.user?.name}</span>
        <button
          className="rounded border-2 bg-white px-4 py-2 text-base font-medium text-[#1e152c] transition-colors hover:border-white hover:bg-[#1e152c] hover:text-white"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </>
    );
  }

  return (
    <button
      className="rounded border-2 bg-white px-4 py-2 text-base font-medium text-[#1e152c] transition-colors hover:border-white hover:bg-[#1e152c] hover:text-white"
      onClick={() => signIn("spotify")}
    >
      Sign in
    </button>
  );
}
