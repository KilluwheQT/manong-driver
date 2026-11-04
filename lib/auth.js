"use client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function watchAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInAdmin(email, password) {
  if (!auth) throw new Error("Firebase is not configured. Add your Firebase settings to .env.local.");
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const token = await user.getIdTokenResult(true);
  if (token.claims.admin !== true) {
    await signOut(auth);
    throw new Error("This account does not have administrator access.");
  }
  return user;
}

export async function requireAdmin() {
  if (!auth?.currentUser) throw new Error("Sign in with an administrator account to continue.");
  const result = await auth.currentUser.getIdTokenResult(true);
  if (result.claims.admin !== true) throw new Error("Administrator access is required.");
}

export async function logOut() {
  if (auth) await signOut(auth);
}
