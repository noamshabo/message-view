import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import NavigationBar from "@/components/NavigationBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conversations Viewer",
  description: "View and manage conversations from NocoDB",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider session={session}>
          <div className="flex flex-col h-screen overflow-hidden">
            <NavigationBar />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

