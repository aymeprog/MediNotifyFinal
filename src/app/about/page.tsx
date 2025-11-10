"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#E8F0EC] py-20 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-center gap-16">
      {/* 🧪 Left: Image */}
      <motion.img
        src="/about-lab.jpg" // place inside /public folder (e.g., public/about-lab.jpg)
        alt="Hospital Laboratory"
        className="w-full md:w-1/2 rounded-3xl shadow-2xl object-cover border border-[#C7D8CC]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* 🩺 Right: Content */}
      <motion.div
        className="w-full md:w-1/2 space-y-8 text-gray-700"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-800 leading-snug">
          About <span className="text-[#4A7C59]">MediNotify</span>
        </h1>

        <p className="text-lg leading-relaxed">
          <b>MediNotify</b> is a web-based <b>Laboratory Results and Patient Notification System</b> 
          created for the <b>Negros Oriental Provincial Hospital Laboratory</b>. It streamlines communication 
          by allowing patients to register, book appointments, view lab results, and receive 
          notifications in real time — all in one secure and accessible platform.
        </p>

        <p className="text-lg leading-relaxed">
          The system ensures efficient collaboration between <b>patients</b> and <b>laboratory staff</b>,
          enabling faster result uploads, accurate notifications, and organized appointment management 
          for a smoother healthcare experience.
        </p>

        {/* 💻 Tech Box */}
        <div className="bg-white/70 border border-[#A3B18A] rounded-3xl p-8 shadow-md backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-[#4A7C59] mb-3">
            Technologies Used
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><b>Frontend:</b> Next.js (TypeScript), Tailwind CSS</li>
            <li><b>Backend:</b> Firebase Authentication, Firestore, Cloud Storage</li>
            <li><b>Notifications:</b> Firebase Cloud Messaging</li>
            <li><b>Hosting:</b> Firebase Hosting</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
