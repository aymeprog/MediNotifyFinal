"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Upload } from "lucide-react";

export default function AdminProfilePage() {
  const [adminData, setAdminData] = useState({
    fullName: "",
    role: "",
    email: "",
    contact: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const adminId = "admin001"; // 🔹 Replace with Firebase Auth UID dynamically later

  // 🔹 Fetch Admin Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "admins", adminId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAdminData(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Handle Input Change
  const handleChange = (e: any) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Profile Photo Upload
  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `admin-profiles/${adminId}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "admins", adminId), { photoURL: url });
      setAdminData((prev) => ({ ...prev, photoURL: url }));
      setMessage("✅ Profile photo updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      setMessage("❌ Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Save Profile Updates
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "admins", adminId), adminData);
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-[#F3F6F4] min-h-screen"
    >
      <h1 className="text-3xl font-bold text-[#4A7C59] mb-6">👤 Admin Profile</h1>

      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Photo */}
          <div className="text-center">
            <img
              src={
                adminData.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-[#4A7C59]"
            />
            <div className="mt-4">
              <label className="cursor-pointer bg-[#4A7C59] text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center hover:bg-[#3B6347]">
                <Upload size={18} />
                {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-3 bg-[#F3F6F4] rounded-lg px-4 py-3">
              <User className="text-[#4A7C59]" />
              <input
                type="text"
                name="fullName"
                value={adminData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="bg-transparent w-full outline-none"
              />
            </div>

            <div className="flex items-center gap-3 bg-[#F3F6F4] rounded-lg px-4 py-3">
              <Briefcase className="text-[#4A7C59]" />
              <input
                type="text"
                name="role"
                value={adminData.role}
                onChange={handleChange}
                placeholder="Role / Position"
                className="bg-transparent w-full outline-none"
              />
            </div>

            <div className="flex items-center gap-3 bg-[#F3F6F4] rounded-lg px-4 py-3">
              <Mail className="text-[#4A7C59]" />
              <input
                type="email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="bg-transparent w-full outline-none"
              />
            </div>

            <div className="flex items-center gap-3 bg-[#F3F6F4] rounded-lg px-4 py-3">
              <Phone className="text-[#4A7C59]" />
              <input
                type="text"
                name="contact"
                value={adminData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="bg-transparent w-full outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-4 w-full bg-[#4A7C59] text-white py-3 rounded-xl hover:bg-[#3B6347] transition"
            >
              Save Changes
            </button>

            {message && (
              <p className="text-center text-sm mt-3 text-gray-600">{message}</p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
