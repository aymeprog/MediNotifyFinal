"use client";

export default function PatientDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#4A7C59] mb-4">
        Welcome to MediNotify!
      </h1>
      <p className="text-gray-700 leading-relaxed">
        Manage your lab results, book appointments, and stay updated with notifications.
        Use the sidebar to navigate through your dashboard modules.
      </p>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-xl font-semibold text-[#4A7C59] mb-2">
          Quick Overview
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>📅 Book or view upcoming lab appointments.</li>
          <li>🧾 Access your laboratory test results.</li>
          <li>🔔 Get notified when new results are available.</li>
          <li>⚙️ Customize your preferences in Settings.</li>
        </ul>
      </div>
    </div>
  );
}
