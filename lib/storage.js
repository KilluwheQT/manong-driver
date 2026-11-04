"use client";

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { requireAdmin } from "@/lib/auth";

export async function uploadAdminImage(file, folder) {
  await requireAdmin();
  if (!storage) throw new Error("Firebase Storage is not configured.");
  validateImage(file);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const reference = ref(storage, `media/${folder}/${Date.now()}-${safeName}`);
  const result = await uploadBytes(reference, file, { contentType: file.type });
  return getDownloadURL(result.ref);
}

export async function uploadReportImage(file) {
  if (!storage) throw new Error("Firebase Storage is not configured.");
  validateImage(file);
  const reference = ref(storage, `reports/public/${crypto.randomUUID()}`);
  const result = await uploadBytes(reference, file, { contentType: file.type });
  return getDownloadURL(result.ref);
}

export async function removeReportImage(downloadUrl) {
  if (!downloadUrl) return;
  await requireAdmin();
  if (!storage) throw new Error("Firebase Storage is not configured.");
  const url = new URL(downloadUrl);
  const objectName = url.pathname.split("/o/")[1];
  if (url.hostname !== "firebasestorage.googleapis.com" || !objectName) {
    throw new Error("The report image URL is invalid.");
  }
  const path = decodeURIComponent(objectName);
  if (!path.startsWith("reports/public/")) throw new Error("The report image is outside the reports folder.");
  try {
    await deleteObject(ref(storage, path));
  } catch (error) {
    if (error.code !== "storage/object-not-found") throw error;
  }
}

function validateImage(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");
}
