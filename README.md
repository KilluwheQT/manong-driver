# Manong Driver

The official community website for the Manong Driver Roblox experience. Built with the Next.js App Router, JavaScript, Tailwind CSS, Firebase Authentication, Cloud Firestore, and Firebase Storage.

## Requirements

- Node.js 20.9 or later
- npm
- A Firebase project with Authentication, Firestore, and Storage enabled

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Firebase settings the public pages use clearly editable sample content. Form submissions and administrator changes require a configured Firebase project.

Copy `.env.local.example` to `.env.local` and add the web app settings from **Firebase Console → Project settings → Your apps**. The project already has a local `.env.local` based on the Firebase web configuration supplied for this project; do not commit it. The Firebase web API key identifies the browser application; it is not an Admin SDK credential. Firestore and Storage rules protect project data.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app configuration |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Email/password authentication |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore project |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Screenshot and image uploads |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app configuration |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app configuration |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional analytics identifier |
| `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY` | reCAPTCHA v3 site key for Firebase App Check |
| `NEXT_PUBLIC_SITE_URL` | Canonical website origin for metadata |
| `NEXT_PUBLIC_ROBLOX_URL` | Official Roblox game/community URL |
| `NEXT_PUBLIC_DISCORD_URL` | Official Discord invite |

Restart the development server after editing environment variables. The defaults are set to the official Manong Driver Roblox game and Discord invite; update them if those links change.

## Firebase setup

1. Register a **Web app** in your Firebase project and copy its config to `.env.local`.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Cloud Firestore** database and a **Storage** bucket in the project.
4. Install and sign in to the [Firebase CLI](https://firebase.google.com/docs/cli), select the project with `firebase use --add`, and deploy the rules:

   ```bash
   firebase deploy --only firestore:rules,storage
   ```

5. Add a reCAPTCHA v3 site to Firebase App Check, set `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`, restart the app, and verify valid app requests in the Firebase console. Then enforce App Check for **Cloud Firestore** and **Cloud Storage**. App Check enforcement is important for protecting the public report and screenshot-upload endpoints from automated abuse.
6. To seed editable example guides, announcements, FAQs, and categories, use a trusted environment with Firebase Application Default Credentials for the selected project:

   ```bash
   npm run seed
   ```

   The seed script creates missing example documents only; existing documents are left unchanged. Example copy deliberately avoids promising unconfirmed game features.

## Secure administrator setup

1. Create an administrator's user in **Firebase Console → Authentication → Users**. Use a strong password and a mailbox managed by the project team.
2. Create a service-account credential or use Google Application Default Credentials **only on a trusted local machine or CI runner**. Never place service-account JSON in this repository, `.env.local`, browser code, or a deploy artifact. Set `GOOGLE_APPLICATION_CREDENTIALS` to its protected file path, and select the correct Firebase project.
3. Copy the new user's Firebase Authentication UID from the console. From PowerShell, grant the trusted `admin: true` custom claim:

   ```powershell
   $env:FIREBASE_ADMIN_UID = "the-authentication-user-uid"
   npm run set-admin
   ```

   To grant a different claim later, use a trusted Admin SDK script; the included command preserves existing custom claims. Ask the administrator to sign in again after changing claims.
4. Open `/admin` and sign in. The dashboard rechecks the ID token's custom claim; Firestore and Storage security rules independently enforce the same claim on every protected operation. Client-side checks are not the security boundary.

Only the trusted `set-admin` script uses `firebase-admin`. Admin credentials and authentication tokens are never bundled into the application.

## Content and reports

- Public tutorials, updates, FAQs, and categories are read from Firestore and only published documents are visible. New or edited content is managed at `/admin`. When a public collection is empty, visitors see clearly labeled sample previews; administrators can import editable copies from the overview dashboard.
- The website settings panel controls the Roblox and Discord links shown in the navigation, footer, and home page, and can hide the seasonal Halloween banner after the event.
- Contact and bug-report form submissions are stored in `bugReports`; authorized administrators can review, update status, and delete entries. A screenshot is optional (JPG, PNG, or WebP, up to 5 MB).
- `firebase/firestore.rules` allows public creates only for bounded, validated report fields; reads and changes to reports require the administrator claim. `firebase/storage.rules` restricts uploads by path, MIME type, and size.
- Firestore rules are not a replacement for App Check: configure and enforce App Check before launching the public report/upload forms.
- `lib/seed-data.js` contains fallback copy for local previews and the seed utility. In the admin overview, **Refresh official starter content** updates only the official guide, FAQ, category, and sample announcement documents; custom documents are left intact. After Halloween, switch off its banner in site settings and unpublish the seasonal FAQ and announcement. Edit public content through Firestore in production.

## Scripts

```bash
npm run dev       # Local development
npm run lint      # ESLint
npm run seed      # Add missing sample content to Firestore
npm run set-admin # Grant the custom administrator claim to FIREBASE_ADMIN_UID
npm run build     # Production build
npm start         # Run the production server
```

## Routes

`/` · `/tutorials` · `/tutorials/[slug]` · `/updates` · `/updates/[slug]` · `/faq` · `/about` · `/contact` · `/admin`
