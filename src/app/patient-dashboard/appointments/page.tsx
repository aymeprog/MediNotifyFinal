"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AppointmentPage() {
  const router = useRouter();

  // form state
  const [formData, setFormData] = useState({
    doctor: "",
    testType: "",
    date: "",
    time: "",
  });

  const [doctors, setDoctors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // fetch list of available doctors/technicians
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const list: string[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name) list.push(data.name);
        });
        setDoctors(list);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const user = auth.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        patientID: user.uid,
        doctor: formData.doctor,
        testType: formData.testType,
        date: formData.date,
        time: formData.time,
        status: "Pending",
        createdAt: Timestamp.now(),
      });

      setMessage("✅ Appointment request submitted successfully!");
      setFormData({ doctor: "", testType: "", date: "", time: "" });
    } catch (error) {
      console.error("Error adding appointment:", error);
      setMessage("❌ Failed to submit appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-md">
      <h1 className="text-2xl font-bold text-[#4A7C59] mb-6">
        Book Laboratory Appointment
      </h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-center ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        {/* Doctor Selection */}
        <div>
          <label className="block font-semibold mb-1">Doctor / Technician</label>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          >
            <option value="">Select doctor</option>
            {doctors.length > 0 ? (
              doctors.map((doc, i) => (
                <option key={i} value={doc}>
                  {doc}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        </div>

        {/* Test Type */}
        <div>
          <label className="block font-semibold mb-1">Test Type</label>
          <select
            name="testType"
            value={formData.testType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          >
            <option value="">Select a test</option>
            <option value="CBC">CBC (Complete Blood Count)</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Urinalysis">Urinalysis</option>
            <option value="Blood Chemistry">Blood Chemistry</option>
            <option value="CT Scan">CT Scan</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block font-semibold mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#4A7C59] text-white py-2 rounded-lg font-semibold hover:bg-[#3b654a] transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Appointment Request"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Your request will be reviewed and confirmed by the laboratory staff.
      </p>
    </div>
  );
}
