"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  Bell,
  Calendar,
  FileText,
  Settings,
  User,
  PlusCircle,
  Search,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const sidebarItems = [
    { name: "Profile", icon: <User />, path: "/patient-dashboard/profile" },
    {
      name: "Book Appointment",
      icon: <PlusCircle />,
      path: "/patient-dashboard/appointments",
    },
    { name: "Calendar", icon: <Calendar />, path: "/patient-dashboard/calendar" },
    { name: "Results", icon: <FileText />, path: "/patient-dashboard/results" },
    {
      name: "Notifications",
      icon: <Bell />,
      path: "/patient-dashboard/notifications",
    },
    { name: "Settings", icon: <Settings />, path: "/patient-dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F3F6F4] text-gray-800">
      {/* ===== Sidebar ===== */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-20 lg:w-64 bg-white shadow-xl rounded-r-3xl p-5 flex flex-col justify-between"
      >
        <div>
          {/* Logo and title */}
          <div className="flex items-center gap-2 justify-center mb-10">
            <Image src="/logo.png" alt="MediNotify Logo" width={32} height={32} />
            <h1 className="hidden lg:block text-2xl font-bold text-[#4A7C59]">
              MediNotify
            </h1>
          </div>

          {/* Sidebar menu */}
          <nav className="space-y-3">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#4A7C59] text-white"
                      : "text-gray-600 hover:bg-[#E8F0EC]"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline text-sm font-medium">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="hidden lg:block text-red-500 font-semibold hover:text-red-700"
        >
          Logout
        </button>
      </motion.aside>

      {/* ===== Main Content Area ===== */}
      <main className="flex-1 flex flex-col">
        {/* ===== Navbar ===== */}
        <header className="bg-white shadow flex items-center justify-between p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A7C59] w-full"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Profile Image */}
            <div className="ml-4">
              <Image
                src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border border-[#4A7C59]"
              />
            </div>
          </div>
        </header>

        {/* ===== Page Content ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
