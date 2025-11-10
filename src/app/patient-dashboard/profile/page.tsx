"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    // If user is not logged in, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.warn("No user document found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[#4A7C59]">
        Loading profile...
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-3xl shadow-md">
      <h1 className="text-2xl font-bold text-[#4A7C59] mb-6">Profile</h1>

      {userData ? (
        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-semibold">Full Name:</span>{" "}
            {userData?.name || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            {userData?.email || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Birthdate:</span>{" "}
            {userData?.birthdate || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Gender:</span>{" "}
            {userData?.gender || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Contact Number:</span>{" "}
            {userData?.contactNumber || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Address:</span>{" "}
            {userData?.address || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Role:</span>{" "}
            {userData?.role || "N/A"}
          </div>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
}
