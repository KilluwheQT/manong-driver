import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const siteUrl = (() => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
})();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Manong Driver — Your Ride. Your Hustle. Your City.",
    template: "%s | Manong Driver",
  },
  description:
    "Hit the road in a Filipino-inspired Roblox ride-hailing adventure. Learn the ropes, explore the city, and join the Manong Driver community.",
  openGraph: {
    title: "Manong Driver",
    description:
      "Your ride. Your hustle. Your city. Start your Filipino-inspired driving adventure.",
    siteName: "Manong Driver",
    type: "website",
    images: ["/images/manong-driver-wordmark.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manong Driver",
    description: "Your ride. Your hustle. Your city.",
    images: ["/images/manong-driver-wordmark.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
