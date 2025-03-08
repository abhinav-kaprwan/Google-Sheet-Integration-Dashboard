"use client";

import Sidebar from "@/components/Sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-4">
        {children}
      </main>
    </div>
  );
} 