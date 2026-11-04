"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gameLinks, navigation } from "@/lib/config";
import { useContent } from "@/hooks/use-content";

function NavigationMenu({ open, onNavigate }) {
  const pathname = usePathname();
  return (
    <nav className={`main-nav ${open ? "open" : ""}`} aria-label="Main navigation">
      {navigation.map((item) => (
        <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteShell({ children }) {
  const [open, setOpen] = useState(false);
  const { items: settings } = useContent("websiteSettings");
  const siteLinks = settings[0] || {};
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Manong Driver home" onClick={() => setOpen(false)}>
            <Image src="/images/manong-driver-wordmark.webp" alt={siteLinks.title || "Manong Driver"} width={800} height={412} priority />
          </Link>
          <Suspense fallback={<nav className={`main-nav ${open ? "open" : ""}`} aria-label="Main navigation">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>}>
            <NavigationMenu open={open} onNavigate={() => setOpen(false)} />
          </Suspense>
          <a className="header-play" href={siteLinks.robloxUrl || gameLinks.roblox} target="_blank" rel="noreferrer">
            Play on Roblox <ArrowUpRight size={15} />
          </a>
          <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <main className="page-main">{children}</main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Link className="brand" href="/">
                <Image src="/images/manong-driver-wordmark.webp" alt={siteLinks.title || "Manong Driver"} width={800} height={412} />
              </Link>
              <p className="footer-intro">{siteLinks.description || "Mabuhay! Your next city adventure starts behind the wheel."}</p>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
              {navigation.slice(1).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
              {[{ label: "Roblox", href: siteLinks.robloxUrl || gameLinks.roblox }, { label: "Discord", href: siteLinks.discordUrl || gameLinks.discord }].map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} <ArrowUpRight size={12} /></a>)}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© Manong Driver. Made for the journey.</span>
            <span>A community website for the Roblox experience.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
