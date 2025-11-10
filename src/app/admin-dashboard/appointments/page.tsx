"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Download, CalendarCheck, XCircle, Clock } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  testType: string;
  date: string;
  time: string;
  assignedDoctor: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch appointments from Firestore
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "appointments"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // 🔹 Approve / Reschedule / Cancel Handlers
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // 🔹 Report Generator (for future implementation)
  const handleGenerateReport = async () => {
    alert("📊 Report generation feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading appointments...
      </div>
    );
  }

  return (
    <section className="p-8 bg-[#F3F6F4] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#4A7C59]">
          Appointment Management
        </h1>
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 bg-[#4A7C59] text-white px-4 py-2 rounded-lg shadow hover:bg-[#3B6347] transition"
        >
          <Download size={18} />
          Generate Report
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto"
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#E8F0EC] text-[#4A7C59]">
              <th className="p-3 rounded-l-lg">Patient Name</th>
              <th className="p-3">Test Type</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Assigned Doctor / MedTech</th>
              <th className="p-3">Status</th>
              <th className="p-3 rounded-r-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="border-b hover:bg-[#F9FAF9] transition"
                >
                  <td className="p-3 font-medium">{appt.patientName}</td>
                  <td className="p-3">{appt.testType}</td>
                  <td className="p-3">
                    {appt.date} at {appt.time}
                  </td>
                  <td className="p-3">{appt.assignedDoctor}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appt.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleStatusChange(appt.id, "Approved")}
                      className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition"
                      title="Approve"
                    >
                      <CalendarCheck size={18} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(appt.id, "Rescheduled")}
                      className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition"
                      title="Reschedule"
                    >
                      <Clock size={18} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(appt.id, "Cancelled")}
                      className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
                      title="Cancel"
                    >
                      <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-8 italic"
                >
                  No appointment requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
