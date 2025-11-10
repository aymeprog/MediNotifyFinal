"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Bell,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications from Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Choose icon and color based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "Appointment":
        return <Calendar className="text-blue-500" size={22} />;
      case "Cancellation":
        return <AlertTriangle className="text-red-500" size={22} />;
      case "Result":
        return <FileText className="text-green-500" size={22} />;
      case "System":
        return <Bell className="text-yellow-500" size={22} />;
      default:
        return <CheckCircle className="text-gray-400" size={22} />;
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#4A7C59]">
        🔔 Admin Notifications
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No notifications yet.
          </p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                notif.read ? "bg-gray-50" : "bg-[#E8F0EC]"
              }`}
              onClick={() => markAsRead(notif.id)}
            >
              <div>{getIcon(notif.type)}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notif.timestamp?.toDate()).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <span className="text-xs text-white bg-[#4A7C59] px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
