"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const auth = useAuth();

  const isActive = (path: string) => {
    return pathname === path ? "bg-gray-800" : "";
  };

  const handleLogout = async () => {
    if (auth) {
      await auth.logout();
    }
  };

  return (
    <div className="fixed left-0 h-full w-64 bg-gray-900 text-white p-4">
      <div className="flex flex-col space-y-2">
        <Link 
          href="/dashboard" 
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${isActive('/dashboard')}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/tables" 
          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${isActive('/tables')}`}
        >
          <Table size={20} />
          <span>Tables</span>
        </Link>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 