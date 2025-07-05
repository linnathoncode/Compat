import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import AuthButton from "~/components/AuthButton";

export const metadata: Metadata = {
  title: "Compat",
  description: "Make you music Compatible",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

function TopNav() {
  return (
    <nav className="flex h-10 w-full items-center justify-between bg-[#1e152c] p-8 text-5xl font-light text-white">
      <span className="leading-none">Compat</span>
      <AuthButton />
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TopNav />
        <div className="border-b border-[#312259]"></div>
        {children}
      </body>
    </html>
  );
}
