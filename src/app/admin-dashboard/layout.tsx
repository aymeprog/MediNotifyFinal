"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  User,
} from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState("Dashboard");

  const menu = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <ClipboardList size={20} /> },
    { name: "Appointments", path: "/admin-dashboard/appointments", icon: <Calendar size={20} /> },
    { name: "Results", path: "/admin-dashboard/results", icon: <FileText size={20} /> },
    { name: "Notifications", path: "/admin-dashboard/notifications", icon: <Bell size={20} /> },
    { name: "Profile", path: "/admin-dashboard/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/admin-dashboard/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F6F4] text-gray-800">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white rounded-r-3xl shadow-xl p-5 flex flex-col justify-between transition-all">
        <div>
          <h1 className="hidden lg:block text-2xl font-bold text-[#4A7C59] mb-10 text-center">
            MediNotify
          </h1>
          <nav className="space-y-3">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setActive(item.name)}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all ${
                  active === item.name
                    ? "bg-[#4A7C59] text-white"
                    : "text-gray-600 hover:bg-[#E8F0EC]"
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline text-sm font-medium">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-center text-xs text-gray-400 mt-10 hidden lg:block">
          © 2025 MediNotify
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
