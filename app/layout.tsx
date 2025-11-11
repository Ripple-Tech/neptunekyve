import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// UI and Auth
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Authjs/Nextjs Authentication Solution",
  description: "Authjs/Next.js-powered authentication solution",
};

// ✅ Only ONE default export
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="mx-auto max-w-6xl p-6">{children}</main>
          <Footer/>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}