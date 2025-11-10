"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Users,
  Database,
  Moon,
  Lock,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  // 🔹 Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage("✅ Successfully logged out!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Error signing out:", error);
      setMessage("❌ Failed to log out.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-[#F3F6F4] min-h-screen"
    >
      <h1 className="text-3xl font-bold text-[#4A7C59] mb-6">⚙️ Admin Settings</h1>

      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "notifications", icon: <Bell size={18} />, label: "Notification Settings" },
            { id: "users", icon: <Users size={18} />, label: "User Management Access" },
            { id: "backup", icon: <Database size={18} />, label: "System Backup" },
            { id: "display", icon: <Moon size={18} />, label: "Display Settings" },
            { id: "password", icon: <Lock size={18} />, label: "Change Password" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#4A7C59] text-white"
                  : "bg-[#F3F6F4] text-gray-700 hover:bg-[#E8F0EC]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4A7C59] mb-3">🔔 Notification Settings</h2>
              <p className="text-gray-600 mb-4">
                Manage how system notifications are sent to patients and staff.
              </p>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  Automatic appointment reminders
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  Notify patients when results are uploaded
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  Enable admin alert sounds
                </label>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4A7C59] mb-3">👥 User Management Access</h2>
              <p className="text-gray-600 mb-4">
                Only System Admins can modify staff access levels and permissions.
              </p>
              <button className="bg-[#4A7C59] text-white px-4 py-2 rounded-lg hover:bg-[#3B6347] transition">
                View Staff Accounts
              </button>
            </div>
          )}

          {activeTab === "backup" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4A7C59] mb-3">💾 System Backup Settings</h2>
              <p className="text-gray-600 mb-4">
                Configure automatic Firestore or storage backups (System Admin only).
              </p>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  Enable weekly data backups
                </label>
                <button className="bg-[#4A7C59] text-white px-4 py-2 rounded-lg hover:bg-[#3B6347] transition">
                  Backup Now
                </button>
              </div>
            </div>
          )}

          {activeTab === "display" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4A7C59] mb-3">🌙 Display Settings</h2>
              <p className="text-gray-600 mb-4">Customize your dashboard appearance.</p>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="system">System Default</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Current theme: <span className="font-medium">{theme}</span>
              </p>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4A7C59] mb-3">🔒 Change Password</h2>
              <p className="text-gray-600 mb-4">
                Securely update your admin password.
              </p>
              <div className="space-y-3 max-w-sm">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="border px-4 py-2 w-full rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="border px-4 py-2 w-full rounded-lg"
                />
                <button className="bg-[#4A7C59] text-white px-4 py-2 rounded-lg hover:bg-[#3B6347] transition w-full">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-10 pt-5 border-t border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-[#4A7C59]">Logout</h3>
            <p className="text-gray-600 text-sm">
              Sign out securely from your admin account.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {message && (
          <p className="text-center text-gray-600 text-sm mt-4">{message}</p>
        )}
      </div>
    </motion.section>
  );
}
