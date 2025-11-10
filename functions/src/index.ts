import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * 🧠 MediNotify Cloud Functions (TypeScript)
 * ------------------------------------------
 * Handles:
 *  - New user creation by role
 *  - Auto-create settings + welcome notification for patients
 *  - Auto notification when results are added
 */

/**
 * Trigger when a new user is created in Firebase Auth
 */
export const handleNewUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  // Default role
  let role = "patient";

  try {
    const userRecord = await admin.auth().getUser(uid);
    role = (userRecord.customClaims?.role as string) || "patient";
  } catch (err) {
    console.error("Error fetching user role:", err);
  }

  // Determine target collection
  let targetCollection = "users";
  if (role === "admin") targetCollection = "admins";
  else if (role === "medical_technologist") targetCollection = "medical_technologists";
  else if (role === "pathologist") targetCollection = "pathologists";

  // Store basic user info
  await db.collection(targetCollection).doc(uid).set({
    uid,
    email,
    displayName: displayName || "",
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Additional setup for patients
  if (role === "patient") {
    // Default settings
    await db.collection("userSettings").doc(uid).set({
      notifications: true,
      language: "en",
      theme: "light",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Welcome notification
    await db.collection("notifications").add({
      userId: uid,
      title: "🎉 Welcome to MediNotify!",
      message: "Your account has been created successfully.",
      status: "unread",
      type: "welcome",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log(`✅ User created and stored under ${targetCollection}`);
});

/**
 * Trigger when a result document is added
 * Automatically notify the corresponding patient
 */
export const handleNewResult = functions.firestore
  .document("results/{resultId}")
  .onCreate(async (snapshot, context) => {
    const resultData = snapshot.data() as {
      patientId?: string;
      testName?: string;
    };

    if (!resultData?.patientId || !resultData?.testName) {
      console.warn("⚠️ Missing data in result:", resultData);
      return;
    }

    await db.collection("notifications").add({
      userId: resultData.patientId,
      title: "🧪 New Lab Result Available",
      message: `${resultData.testName} result has been uploaded.`,
      status: "unread",
      type: "result",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`📢 Notification sent to patient ${resultData.patientId} for ${resultData.testName}`);
  });
