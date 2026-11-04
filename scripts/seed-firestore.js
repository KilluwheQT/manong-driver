import { applicationDefault, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { starterEntries } from "../lib/seed-data.js";

try {
  initializeApp({ credential: applicationDefault() });
  const db = getFirestore();
  let batch = db.batch();
  let writes = 0;
  let added = 0;
  let skipped = 0;
  for (const { collection, id, item } of starterEntries) {
    const reference = db.collection(collection).doc(id);
    const snapshot = await reference.get();
    if (snapshot.exists) {
      skipped += 1;
      continue;
    }
    batch.set(reference, { ...item, published: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    writes += 1;
    added += 1;
    if (writes === 450) {
      await batch.commit();
      batch = db.batch();
      writes = 0;
    }
  }
  if (writes) await batch.commit();
  console.log(`Seed complete: ${added} added, ${skipped} existing entries preserved.`);
} catch (error) {
  console.error("Could not seed Firestore:", error.message);
  process.exitCode = 1;
}
