"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="flex-1 p-8 bg-[#F3F6F4] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#4A7C59]">Dashboard</h2>
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white rounded-full shadow hover:bg-[#E8F0EC]">
            <Bell size={20} />
          </button>
          <img
            src="https://i.pinimg.com/736x/ee/2d/84/ee2d844e9ed7cce37b3a28f537c1dd4c.jpg"
            alt="Admin"
            className="w-10 h-10 rounded-full border border-[#4A7C59]"
          />
        </div>
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-8 shadow-lg flex justify-between items-center"
      >
        <div>
          <h3 className="text-2xl font-bold mb-2 text-[#4A7C59]">
            Hi, Admin!
          </h3>
          <p className="text-gray-600">
            What would you like to do today? You can manage appointments, check results,
            or send notifications.
          </p>
        </div>
        <img
          src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/man5-512.png"
          alt="Admin Illustration"
          className="w-40 h-40"
        />
      </motion.div>

      {/* Cards Section */}
      <div className="grid md:grid-cols-4 gap-6 mt-10">
        {[
          { label: "Pending Appointments", value: 8 },
          { label: "Total Patients", value: 120 },
          { label: "Lab Results Uploaded", value: 54 },
          { label: "Unread Notifications", value: 3 },
        ].map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl p-6 shadow-md text-center"
          >
            <p className="text-sm text-gray-500 mb-2">{card.label}</p>
            <h4 className="text-2xl font-bold text-[#4A7C59]">{card.value}</h4>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
