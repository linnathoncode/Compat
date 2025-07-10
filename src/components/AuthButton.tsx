"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const disabled = loading || status === "loading";

  const baseButtonStyle =
    "rounded border-2 bg-white px-4 py-2 text-base font-medium text-[#1e152c] disabled:opacity-50 disabled:cursor-not-allowed";
  const hoverButtonStyle =
    "transition-colors hover:border-white hover:bg-[#1e152c] hover:text-white";

  const handleAuth = async (action: "signin" | "signout") => {
    setLoading(true);
    try {
      if (action === "signin") {
        await signIn("spotify");
      } else {
        await signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status === "loading" ? (
        <span className="animate-pulse text-sm text-gray-300">
          Checking session...
        </span>
      ) : session ? (
        <>
          <span className="text-sm text-white">
            Hi, {session.user?.name?.toUpperCase()}
          </span>
          <button
            className={
              baseButtonStyle + (!disabled ? " " + hoverButtonStyle : "")
            }
            onClick={() => handleAuth("signout")}
            disabled={disabled}
            aria-busy={loading}
            aria-label="Sign out"
          >
            {loading ? "Signing out..." : "Sign out"}
          </button>
        </>
      ) : (
        <button
          className={
            baseButtonStyle + (!disabled ? " " + hoverButtonStyle : "")
          }
          onClick={() => handleAuth("signin")}
          disabled={disabled}
          aria-busy={loading}
          aria-label="Sign in with Spotify"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      )}
    </div>
  );
}
