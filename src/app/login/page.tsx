"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("patient");
  const [isHydrated, setIsHydrated] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => setIsHydrated(true), []);
  if (!isHydrated) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        // ✅ Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let firestoreRole = role; // default from chosen button

        if (userDoc.exists()) {
          firestoreRole = userDoc.data().role || role;
        }

        setSuccess(true);
        setMessage("✅ Login successful!");

        // ✅ Store session and role locally
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", firestoreRole);
        localStorage.setItem("userEmail", form.email);

        // 🚀 Redirect based on role
        setTimeout(() => {
          if (firestoreRole === "admin") router.push("/admin-dashboard");
          else if (firestoreRole === "patient") router.push("/patient-dashboard");
          else router.push("/unauthorized");
        }, 1200);
      } else {
        // 📝 REGISTER
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        // Save user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: form.name,
          email: form.email,
          role,
          createdAt: new Date().toISOString(),
        });

        setMessage("🎉 Registration successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error(error);
      setMessage(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#E8F0EC] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8"
      >
        <h1 className="text-4xl font-bold text-center text-[#4A7C59] mb-8">
          {isLogin ? "Login to MediNotify" : "Create an Account"}
        </h1>

        {/* Role Selection Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setRole("patient")}
            className={`px-4 py-2 rounded-lg font-semibold border ${
              role === "patient"
                ? "bg-[#4A7C59] text-white border-[#4A7C59]"
                : "bg-transparent text-[#4A7C59] border-[#4A7C59]"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`px-4 py-2 rounded-lg font-semibold border ${
              role === "admin"
                ? "bg-[#4A7C59] text-white border-[#4A7C59]"
                : "bg-transparent text-[#4A7C59] border-[#4A7C59]"
            }`}
          >
            Admin
          </button>
        </div>

        {success ? (
          <p className="text-green-600 font-semibold text-center text-lg">
            ✅ Login successful!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#4A7C59]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#4A7C59]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#4A7C59]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A7C59] text-white font-semibold py-3 rounded-lg hover:bg-[#3B6347] transition-colors"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? `Login as ${role}`
                : `Register as ${role}`}
            </button>
          </form>
        )}

        {message && !success && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}

        {!success && (
          <p className="text-center text-gray-600 mt-6">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#4A7C59] font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        )}

        {!success && (
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-[#4A7C59] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
