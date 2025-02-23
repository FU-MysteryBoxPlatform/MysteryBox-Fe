import { Toaster } from "@/components/ui/toaster";
import { GlobalProvider } from "@/provider/global-provider";
import QueryProvider from "@/provider/query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Box",
  description: "Collect, explore, and share your mysteries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <QueryProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Suspense>{children}</Suspense>
            <Toaster />
          </body>
        </QueryProvider>
      </GlobalProvider>
    </html>
  );
}
