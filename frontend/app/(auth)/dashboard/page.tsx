"use client";

import { Suspense, useState } from "react";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}