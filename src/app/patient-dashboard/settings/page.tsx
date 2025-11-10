"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const db = getFirestore();
  const router = useRouter();
  const user = auth.currentUser;

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailAlerts: true,
  });

  // Load user settings in real-time
  useEffect(() => {
    if (!user) return;

    const userSettingsRef = doc(db, "userSettings", user.uid);
    const unsubscribe = onSnapshot(userSettingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as typeof settings);
      }
    });

    return () => unsubscribe();
  }, [db, user]);

  // Toggle user preferences
  const handleToggle = async (key: keyof typeof settings) => {
    if (!user) return;
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });

    try {
      await setDoc(
        doc(db, "userSettings", user.uid),
        { [key]: newValue },
        { merge: true }
      );
      toast.success(`Updated ${key} setting`);
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update settings");
    }
  };

  // Handle logout securely
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      <p className="text-gray-600">
        Manage your preferences and security options below.
      </p>

      {/* User Preferences */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Enable Notifications</span>
          <Switch
            checked={settings.notifications}
            onCheckedChange={() => handleToggle("notifications")}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Dark Mode</span>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={() => handleToggle("darkMode")}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Email Alerts</span>
          <Switch
            checked={settings.emailAlerts}
            onCheckedChange={() => handleToggle("emailAlerts")}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 flex items-center gap-3">
        <Button
          onClick={() => toast.success("Settings saved successfully!")}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Save Changes
        </Button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
