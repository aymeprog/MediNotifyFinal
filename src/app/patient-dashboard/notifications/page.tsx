"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  status: "read" | "unread";
  timestamp: string;
  type: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("patientID", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    // 🔄 Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(list);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const ref = doc(db, "notifications", id);
      await updateDoc(ref, { status: "read" });
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "result":
        return <CheckCircle className="text-green-600" />;
      case "appointment":
        return <Bell className="text-blue-600" />;
      case "reminder":
        return <Info className="text-yellow-600" />;
      case "system":
        return <AlertCircle className="text-red-600" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-md">
      <h1 className="text-2xl font-bold text-[#4A7C59] mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                notif.status === "unread"
                  ? "bg-[#E8F0EC] border-[#4A7C59]"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <h2
                  className={`font-semibold ${
                    notif.status === "unread" ? "text-[#4A7C59]" : "text-gray-700"
                  }`}
                >
                  {notif.title}
                </h2>
                <p className="text-gray-600">{notif.message}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDate(notif.timestamp)}
                </p>
              </div>

              {notif.status === "unread" && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-sm bg-[#4A7C59] text-white px-3 py-1 rounded-full hover:bg-[#3b654a] transition-all"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
