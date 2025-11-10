"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // for clicking
import { Dialog } from "@headlessui/react";

type Appointment = {
  id: string;
  doctor: string;
  testType: string;
  status: string;
  date: string;
  time: string;
};

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [open, setOpen] = useState(false);

  // fetch appointments from Firestore
  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "appointments"),
          where("patientID", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const list: Appointment[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Appointment),
          id: doc.id,
        }));
        setAppointments(list);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // map statuses to colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Pending":
        return "gold";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  // create events for calendar
  const events = appointments.map((appt) => ({
    id: appt.id,
    title: `${appt.testType} (${appt.status})`,
    start: appt.date,
    backgroundColor: getStatusColor(appt.status),
    borderColor: getStatusColor(appt.status),
    extendedProps: appt,
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <h1 className="text-2xl font-bold text-[#4A7C59] mb-6">
        My Appointment Calendar
      </h1>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span> Completed
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> Pending
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span> Cancelled
        </div>
      </div>

      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="80vh"
        events={events}
        eventClick={(info) => {
          const data = info.event.extendedProps as Appointment;
          setSelectedEvent(data);
          setOpen(true);
        }}
      />

      {/* Appointment Details Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      >
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
          {selectedEvent && (
            <>
              <Dialog.Title className="text-xl font-bold text-[#4A7C59] mb-4">
                Appointment Details
              </Dialog.Title>

              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Doctor:</span>{" "}
                  {selectedEvent.doctor}
                </p>
                <p>
                  <span className="font-semibold">Test Type:</span>{" "}
                  {selectedEvent.testType}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`${
                      selectedEvent.status === "Completed"
                        ? "text-green-600"
                        : selectedEvent.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    } font-semibold`}
                  >
                    {selectedEvent.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {selectedEvent.date}
                </p>
                <p>
                  <span className="font-semibold">Time:</span>{" "}
                  {selectedEvent.time}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-[#4A7C59] text-white px-4 py-2 rounded-lg hover:bg-[#3b654a] transition-all"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
