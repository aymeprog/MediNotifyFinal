// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBPZGGU95XK-WpDDRlMZlRt7C7DtMEo3ZE",
  authDomain: "medinotify-31695.firebaseapp.com",
  projectId: "medinotify-31695",
  storageBucket: "medinotify-31695.firebasestorage.app",
  messagingSenderId: "229900307137",
  appId: "1:229900307137:web:84cba35241963b372b2240",
  measurementId: "G-RB6Z0WXMMB",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Safe Analytics (only runs in browser)
let analytics: any;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

// ✅ Initialize Auth, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Persist login across sessions (important!)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export { app, analytics };
