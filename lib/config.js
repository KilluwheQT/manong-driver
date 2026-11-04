const robloxUrl = process.env.NEXT_PUBLIC_ROBLOX_URL || "https://www.roblox.com/games/71870733837964/MANONG-DRIVER";
const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/mQVFwM7QEt";

export const gameLinks = {
  roblox: robloxUrl,
  discord: discordUrl,
  socials: [
    { label: "Roblox", href: robloxUrl },
    { label: "Discord", href: discordUrl },
  ],
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Updates", href: "/updates" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const categories = {
  tutorials: [
    "All",
    "Getting Started",
    "Driving Guide",
    "Ride-Hailing Guide",
    "Progression Guide",
    "Advanced Tips",
  ],
  updates: ["All", "Announcement", "Patch Notes", "Vehicles", "Events"],
  faqs: ["Getting Started", "Gameplay", "Scooters & needs", "Robux items", "Seasonal events", "Community"],
};
