import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const uid = process.env.FIREBASE_ADMIN_UID;
if (!uid) {
  console.error("Set FIREBASE_ADMIN_UID to the target user's Firebase Authentication UID.");
  process.exitCode = 1;
} else {
  try {
    initializeApp({ credential: applicationDefault() });
    const user = await getAuth().getUser(uid);
    await getAuth().setCustomUserClaims(uid, { ...user.customClaims, admin: true });
    console.log(`Administrator access granted to ${user.email || uid}. The user must sign in again to refresh their token.`);
  } catch (error) {
    console.error("Could not grant administrator access:", error.message);
    process.exitCode = 1;
  }
}
