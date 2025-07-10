"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

type AuthContextType = {
  session: ReturnType<typeof useSession>["data"];
  status: "loading" | "authenticated" | "unauthenticated";
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be within AuthProvider");
  }
  return context;
};
