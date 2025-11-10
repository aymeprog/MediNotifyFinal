"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1️⃣ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Save additional info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "patient", // you can set "admin" manually in Firebase Console
        createdAt: new Date(),
      });

      alert("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F5F7F4]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#4A7C59] mb-6">Register</h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
          <button
            type="submit"
            className="w-full bg-[#4A7C59] text-white py-3 rounded-lg hover:bg-[#3B6346] transition"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
}
