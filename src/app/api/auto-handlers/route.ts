// src/app/api/auto-handlers/route.ts
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

/**
 * ✅ Automatically handles Firestore logic for MediNotify
 * - Adds new users to their correct role collection
 * - Creates default userSettings for patients
 * - Sends welcome notifications
 * - Sends patient notifications when results are uploaded
 */

// Called when a new user registers
export async function handleNewUser(user: {
  uid: string;
  email: string;
  displayName: string;
  role: string;
}) {
  const { uid, email, displayName, role } = user;

  // Determine target collection based on role
  let targetCollection = "users";
  if (role === "admin") targetCollection = "admins";
  else if (role === "medical_technologist") targetCollection = "medical_technologists";
  else if (role === "pathologist") targetCollection = "pathologists";

  // Create user record
  await setDoc(doc(db, targetCollection, uid), {
    uid,
    email,
    displayName,
    role,
    createdAt: serverTimestamp(),
  });

  // If the user is a patient, create settings + welcome message
  if (role === "patient") {
    await setDoc(doc(db, "userSettings", uid), {
      notifications: true,
      language: "en",
      theme: "light",
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
      userId: uid,
      title: "Welcome to MediNotify 🎉",
      message: "Your account has been successfully created!",
      status: "unread",
      type: "welcome",
      timestamp: serverTimestamp(),
    });
  }
}

// Called when a result is uploaded by admin or technologist
export async function handleNewResult(resultData: {
  patientId: string;
  testName: string;
  resultUrl: string;
  uploadedBy: string;
}) {
  const { patientId, testName } = resultData;

  // Store the result document
  await addDoc(collection(db, "results"), {
    ...resultData,
    createdAt: serverTimestamp(),
  });

  // Notify the patient
  await addDoc(collection(db, "notifications"), {
    userId: patientId,
    title: "🧪 New Lab Result Available",
    message: `${testName} result has been uploaded.`,
    status: "unread",
    type: "result",
    timestamp: serverTimestamp(),
  });
}
