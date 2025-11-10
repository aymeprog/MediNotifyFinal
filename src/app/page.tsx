"use client";

import { motion } from "framer-motion";
import { CalendarDays, Bell, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#E8F1EB] text-gray-800 font-sans">
      {/* 🌿 Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#4A7C59] leading-tight mb-6">
            Simplify Your Lab Experience with{" "}
            <span className="text-[#82A98C]">MediNotify</span>
          </h1>

          <p className="text-lg mb-8 text-gray-600">
            Access your lab results, book appointments, and receive real-time
            updates — all in one secure online platform.
          </p>

          <div className="flex gap-4">
            <a
              href="/login"
              className="bg-[#4A7C59] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#3B6648] transition"
            >
              Login
            </a>
            <a
              href="#about"
              className="border border-[#4A7C59] text-[#4A7C59] px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#E1EEE6] transition"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        <motion.img
          src="/lab-illustration.jpg" // replace with your image name in /public
          alt="Patient viewing lab results"
          className="w-full md:w-1/2 mt-10 md:mt-0 rounded-3xl shadow-lg"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* 🧪 Features Section */}
      <section
        id="features"
        className="bg-white py-20 px-8 md:px-16 text-center shadow-inner"
      >
        <h2 className="text-4xl font-bold text-[#4A7C59] mb-12">
          What You Can Do
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<CalendarDays className="w-12 h-12 text-[#4A7C59]" />}
            title="Book Appointments"
            description="Schedule your lab tests online and view your upcoming appointments anytime."
          />
          <FeatureCard
            icon={<FileText className="w-12 h-12 text-[#4A7C59]" />}
            title="View Results"
            description="Instantly access and download your lab results securely from your dashboard."
          />
          <FeatureCard
            icon={<Bell className="w-12 h-12 text-[#4A7C59]" />}
            title="Receive Notifications"
            description="Get real-time updates and alerts when your lab results are available."
          />
        </div>
      </section>

      {/* ℹ️ About Section */}
      <section
        id="about"
        className="py-20 bg-[#F4F8F5] px-10 text-center border-t border-[#CFE2D2]"
      >
        <h2 className="text-4xl font-bold text-[#4A7C59] mb-6">
          About MediNotify
        </h2>
        <p className="max-w-2xl mx-auto text-gray-700 text-lg leading-relaxed">
          MediNotify is designed for the Negros Oriental Provincial Hospital
          Laboratory to improve communication, reduce waiting times, and keep
          patients informed. It provides a seamless experience through secure,
          real-time updates powered by Firebase and Next.js.
        </p>
      </section>

      {/* 🌱 Footer */}
      <footer className="bg-[#4A7C59] text-white py-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} MediNotify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#E8F1EB] rounded-2xl shadow-md p-8 flex flex-col items-center transition-transform"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#4A7C59]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
