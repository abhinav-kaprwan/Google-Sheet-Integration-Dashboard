"use client";

import { Suspense} from "react";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {

  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}