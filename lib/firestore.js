"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
import { requireAdmin } from "@/lib/auth";
import { sampleContent, starterEntries } from "@/lib/seed-data";

const allowedCollections = new Set([
  "tutorials", "tutorialCategories", "updates", "faqs", "faqCategories",
  "bugReports", "websiteSettings",
]);

function assertCollection(name) {
  if (!allowedCollections.has(name)) throw new Error("Unknown content collection.");
}

function sortNewest(items) {
  const timestamp = (value) => {
    const result = typeof value?.toDate === "function"
      ? value.toDate().getTime()
      : new Date(value || 0).getTime();
    return Number.isFinite(result) ? result : 0;
  };
  return items.sort((a, b) =>
    timestamp(b.date || b.publishedAt || b.updatedAt || b.createdAt) -
    timestamp(a.date || a.publishedAt || a.updatedAt || a.createdAt));
}

export async function listContent(name, { admin = false } = {}) {
  assertCollection(name);
  if (!db || !firebaseConfigured) return (sampleContent[name] || []).map((item) => ({ ...item }));
  const reference = collection(db, name);
  const snapshot = await getDocs(
    !admin && name !== "websiteSettings"
      ? query(reference, where("published", "==", true))
      : reference,
  );
  const items = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  if (!items.length && !admin && name !== "websiteSettings" && sampleContent[name]?.length) {
    return sampleContent[name].map((item) => ({ ...item, id: item.slug || item.id, isSample: true }));
  }
  return sortNewest(admin || name === "websiteSettings" ? items : items.filter((item) => item.published === true));
}

export async function getBySlug(name, slug) {
  const items = await listContent(name);
  return items.find((item) => item.slug === slug) || null;
}

export async function saveContent(name, id, fields) {
  assertCollection(name);
  await requireAdmin();
  if (!db) throw new Error("Firebase is not configured.");
  if (name === "websiteSettings" && id) {
    const { id: ignored, ...values } = fields;
    await setDoc(doc(db, name, id), { ...values, updatedAt: serverTimestamp() }, { merge: true });
    return id;
  }
  if (id) {
    const { id: ignored, ...values } = fields;
    await updateDoc(doc(db, name, id), { ...values, updatedAt: serverTimestamp() });
    return id;
  }
  const reference = await addDoc(collection(db, name), {
    ...fields,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reference.id;
}

export async function removeContent(name, id) {
  assertCollection(name);
  await requireAdmin();
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, name, id));
}

export async function submitReport(report) {
  if (!db) throw new Error("The contact form is unavailable until Firebase is configured.");
  await addDoc(collection(db, "bugReports"), {
    ...report,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export async function refreshOfficialContent() {
  await requireAdmin();
  if (!db) throw new Error("Firebase is not configured.");
  const batch = writeBatch(db);
  for (const { collection: name, id, item } of starterEntries) {
    batch.set(
      doc(db, name, id),
      { ...item, published: true, updatedAt: serverTimestamp() },
      { merge: true },
    );
  }
  await batch.commit();
  return starterEntries.length;
}
