# Project: Manong Driver — Official Roblox Game Website

Act as a senior full-stack developer, UI/UX designer, and software architect. Build a complete, modern, responsive Next.js web application for my Roblox game called **Manong Driver**.

## 1. About the Game

**Manong Driver** is a Roblox ride-hailing simulator inspired by real-world Filipino transportation and ride-hailing services.

Players experience life as drivers in a virtual Filipino city. They can accept passenger requests, pick up customers, drive them to their destinations, earn in-game money, and progress as professional drivers.

The website will serve as the game's official community and information hub. It should introduce new players to the game, provide tutorials, explain game mechanics, share updates, and provide useful information.

The overall branding should feel distinctly Filipino while maintaining a polished, modern gaming aesthetic.

## 2. Technology Stack (STRICT REQUIREMENTS)

Use the following technologies:

- **Framework:** Next.js (App Router)
- **Language:** JavaScript ONLY
- **Backend:** Firebase
- **Database:** Cloud Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage (if needed)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **UI:** Custom reusable React components

IMPORTANT:
- Do NOT use TypeScript.
- Do NOT create `.ts` or `.tsx` files.
- All source files must use `.js` or `.jsx`.
- Do NOT use TypeScript interfaces, types, or generics.
- Use JavaScript throughout the entire project.
- Use Firebase as the backend instead of creating an unnecessary Express backend.
- Use clean, reusable, maintainable components.
- Follow Next.js App Router conventions.

## 3. Design Direction

Create a premium gaming website with a modern, immersive interface.

Visual inspiration:
- Modern gaming community websites
- Roblox game landing pages
- Premium SaaS dashboards
- Modern transportation and ride-hailing applications

### Design system

- Primary colors: Dark navy, black, white, and vibrant yellow.
- Accent colors: Warm orange and subtle green.
- Background: Dark, sophisticated surfaces with occasional light sections.
- Typography: Modern, bold, highly readable.
- Rounded cards and buttons.
- Subtle shadows and glowing accents.
- Smooth page transitions and hover effects.
- Responsive layouts for desktop, tablets, and mobile.

Avoid:
- Generic templates.
- Excessive gradients.
- Overly complicated layouts.
- Unnecessary animations.
- Empty placeholder sections.

The website should look like a professionally designed gaming brand.

## 4. Website Pages and Features

### A. Home Page (/)

Create an impressive landing page featuring:

**Hero Section**
- Large Manong Driver branding.
- Catchy headline: "Your Ride. Your Hustle. Your City."
- Short description explaining the game.
- Play on Roblox button.
- Explore Tutorials button.
- Large game screenshot or promotional artwork.
- Animated background elements.

**Game Introduction**
- Explain what Manong Driver is.
- Highlight the ride-hailing simulator experience.
- Feature the Filipino-inspired setting.

**How It Works**
Show a simple three-step explanation:
1. Accept passenger requests.
2. Pick up your passengers.
3. Complete rides and earn rewards.

**Features Section**
Highlight:
- Realistic ride-hailing gameplay.
- Passenger pickup and drop-off.
- Earn in-game currency.
- Explore the city.
- Unlock and use vehicles.
- Progress as a professional driver.

**Latest Updates**
- Display the latest game announcements.
- Pull announcements dynamically from Firebase.
- Include update dates and categories.

**Community Section**
- Roblox community link.
- Discord server link.
- Social media links.

**Footer**
- Game logo.
- Navigation links.
- Social links.
- Copyright notice.

### B. Game Tutorial (/tutorials)

Create a complete tutorial center for beginners.

Include categories:

1. Getting Started
   - How to join the game.
   - Understanding the user interface.
   - Basic controls.
   - How to start driving.

2. Driving Guide
   - Vehicle controls.
   - Driving tips.
   - Navigation.
   - Parking and passenger pickup.

3. Ride-Hailing Guide
   - How to receive passenger requests.
   - How to accept a ride.
   - How to pick up passengers.
   - How to complete rides.
   - How to earn money.

4. Progression Guide
   - How to earn more money.
   - Vehicle progression.
   - Tips for new players.

5. Advanced Tips
   - Efficient driving strategies.
   - Maximizing earnings.
   - Avoiding common mistakes.

Features:
- Search tutorials.
- Filter by category.
- Tutorial cards with thumbnails.
- Reading time.
- Difficulty indicators.
- Individual tutorial pages using dynamic routes.
- Related tutorials.
- Previous and next tutorial navigation.

Tutorial content must be stored in Firestore so administrators can add, edit, and delete tutorials without modifying the source code.

### C. Individual Tutorial Page (/tutorials/[slug])

Each tutorial should have:
- Tutorial title.
- Cover image.
- Category.
- Difficulty level.
- Estimated reading time.
- Author.
- Publication date.
- Rich tutorial content.
- Screenshots and instructional images.
- Step-by-step instructions.
- Related tutorials.

Make the reading experience clean and comfortable.

### D. Game Updates (/updates)

Create a news and announcements section.

Features:
- Latest game updates.
- Patch notes.
- New vehicle announcements.
- New features.
- Bug fixes.
- Events.
- Update categories.
- Search and filtering.
- Individual update pages.

Store all update content in Firestore.

### E. Frequently Asked Questions (/faq)

Create an interactive FAQ page.

Example questions:
- What is Manong Driver?
- How do I start playing?
- How do I earn money?
- How do I accept passenger requests?
- How do I unlock vehicles?
- Is the game free?
- Where can I report bugs?
- How can I join the community?

Features:
- Expandable accordion questions.
- Search functionality.
- FAQ categories.
- Dynamic Firestore content.

### F. About Page (/about)

Include:
- The story behind Manong Driver.
- Game vision and mission.
- Game development information.
- Credits.
- Community information.
- Roblox game link.

### G. Contact / Bug Reports (/contact)

Allow players to submit:
- Bug reports.
- Suggestions.
- Feedback.
- General inquiries.

Use Firebase Firestore to save submissions.

Include:
- Name or Roblox username.
- Email (optional).
- Report category.
- Subject.
- Description.
- Optional screenshot attachment using Firebase Storage.
- Submission success and error states.

Add validation and spam protection.

## 5. Admin Dashboard (/admin)

Create a secure administrative dashboard.

Only authenticated administrators should have access.

Use Firebase Authentication and role-based authorization.

Dashboard sections:

**Overview**
- Total tutorials.
- Total updates.
- Total FAQs.
- Total bug reports.
- Recent submissions.

**Tutorial Management**
- Create tutorials.
- Edit tutorials.
- Delete tutorials.
- Upload tutorial thumbnails.
- Manage tutorial categories.
- Publish or save as draft.

**Update Management**
- Create announcements.
- Edit patch notes.
- Delete updates.
- Upload cover images.
- Set publication dates.
- Publish or unpublish posts.

**FAQ Management**
- Add questions.
- Edit answers.
- Delete FAQs.
- Organize categories.

**Bug Reports**
- View submitted reports.
- Change report status.
- Mark as resolved.
- Delete spam submissions.

**Admin Settings**
- Manage website information.
- Update social media links.
- Manage administrator access.

The dashboard should have a professional sidebar, responsive navigation, data tables, forms, confirmation dialogs, and loading states.

IMPORTANT SECURITY:
- Never rely on client-side admin checks alone.
- Implement Firebase Security Rules.
- Verify administrator roles using trusted server-side authentication or Firebase custom claims.
- Never expose Firebase Admin SDK credentials in client-side code.
- Protect all admin operations.

## 6. Firebase Backend Architecture

Set up Firebase properly.

Use:
- Firebase Authentication.
- Cloud Firestore.
- Firebase Storage.

Suggested Firestore collections:

- `users`
- `admins`
- `tutorials`
- `tutorialCategories`
- `updates`
- `faqs`
- `faqCategories`
- `bugReports`
- `websiteSettings`

Create reusable Firebase utilities:

- `lib/firebase.js`
- `lib/auth.js`
- `lib/firestore.js`
- `lib/storage.js`

Use environment variables for Firebase configuration.

Create a `.env.local.example` file.

Implement:
- Authentication state management.
- Firestore CRUD operations.
- Image uploads.
- Form validation.
- Error handling.
- Loading states.
- Secure authorization.
- Pagination where appropriate.

Provide Firestore Security Rules and Firebase Storage Security Rules.

Do not hardcode sensitive credentials.

## 7. User Experience

Make the application feel polished and complete.

Implement:
- Responsive navigation.
- Mobile hamburger menu.
- Active navigation indicators.
- Loading skeletons.
- Toast notifications.
- Empty states.
- Error states.
- Search functionality.
- Category filters.
- Smooth animations.
- Accessible forms.
- Custom 404 page.
- SEO metadata.
- Open Graph metadata.

Use reusable components throughout the application.

## 8. Suggested Project Structure

Use a clean Next.js App Router structure similar to:

```text
manong-driver-website/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   ├── about/
│   ├── tutorials/
│   │   ├── page.js
│   │   └── [slug]/
│   │       └── page.js
│   ├── updates/
│   ├── faq/
│   ├── contact/
│   └── admin/
├── components/
│   ├── layout/
│   ├── home/
│   ├── tutorials/
│   ├── updates/
│   ├── faq/
│   ├── admin/
│   └── ui/
├── lib/
│   ├── firebase.js
│   ├── auth.js
│   ├── firestore.js
│   └── storage.js
├── hooks/
├── public/
│   ├── images/
│   └── logo/
├── firebase/
│   ├── firestore.rules
│   └── storage.rules
├── .env.local.example
├── package.json
└── README.md
```

You may improve this structure if needed, but keep it organized and JavaScript-only.

## 9. Content and Branding

Use the name **Manong Driver** consistently.

The writing style should be:
- Friendly.
- Welcoming.
- Filipino-inspired.
- Easy for beginners to understand.
- Professional but not overly corporate.

Use natural Filipino transportation terminology where appropriate.

Do not invent specific game mechanics that have not been confirmed. Use clearly editable sample content where exact gameplay details are unknown.

Use placeholder Roblox and Discord URLs in a centralized configuration file so they can easily be replaced.

## 10. Development Requirements

I want an actual functioning application, not just a visual mockup.

You must:
- Generate the actual Next.js project files.
- Implement the pages and reusable components.
- Connect Firebase.
- Implement working CRUD functionality.
- Implement admin authentication.
- Implement responsive layouts.
- Include Firebase Security Rules.
- Include setup instructions.
- Include environment variable documentation.
- Ensure the app runs without TypeScript.
- Avoid unnecessary dependencies.

Do not leave important functionality as TODO comments.

If Firebase credentials are unavailable, build the integration completely and provide clear instructions for connecting the project to my Firebase project.

## 11. Final Deliverables

Provide:

1. Complete Next.js source code.
2. All required JavaScript and JSX files.
3. Firebase configuration.
4. Firestore Security Rules.
5. Firebase Storage Security Rules.
6. `.env.local.example`.
7. Admin setup instructions.
8. Installation instructions.
9. Development and production build instructions.
10. README.md.

## 12. Execution Instructions

Work in phases:

**Phase 1:** Set up the Next.js project and design system.

**Phase 2:** Build the public-facing website and all pages.

**Phase 3:** Integrate Firebase Authentication, Firestore, and Storage.

**Phase 4:** Build the admin dashboard and CRUD functionality.

**Phase 5:** Implement security rules, validation, and error handling.

**Phase 6:** Test responsiveness, navigation, authentication, and functionality.

**Phase 7:** Provide the final project structure and setup documentation.

Before finishing, check for:
- TypeScript files or dependencies.
- Broken imports.
- Missing components.
- Invalid routes.
- Firebase integration errors.
- Insecure admin access.
- Nonfunctional buttons and forms.
- Mobile responsiveness issues.

**FINAL INSTRUCTION:**

Build this as a production-quality official website for my Roblox game, Manong Driver. Prioritize excellent UI/UX, clean JavaScript code, Firebase integration, and a cohesive Filipino ride-hailing game identity.

Do not stop after creating the homepage. Complete the entire application. If the project is too large for one response, work incrementally and preserve the existing code and architecture between phases.