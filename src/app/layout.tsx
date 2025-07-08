import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import TopNav from "~/components/TopNav";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Compat",
  description: "Make you music Compatible",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Providers>
          <TopNav />
          <div className="border-b border-[#312259]"></div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
