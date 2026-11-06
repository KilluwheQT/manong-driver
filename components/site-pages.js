"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck,
  BookOpen, Building2, CarFront, CircleHelp, Compass, Gauge, Headphones,
  MapPin, Search, ShieldCheck, Sparkles, Star, Trophy, Wallet, Wrench,
} from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { categories, gameLinks } from "@/lib/config";
import { submitReport } from "@/lib/firestore";
import { uploadReportImage } from "@/lib/storage";
import { Pagination } from "@/components/pagination";

function PageIntro({ label, title, description }) {
  return <section className="page-heading container"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{description}</p></section>;
}

function Loading({ label = "Loading community content…" }) {
  return <div className="loading" role="status">{label}</div>;
}

function ContentSkeleton() {
  return <div className="card-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading content" aria-busy="true">
    {[0, 1, 2].map((item) => <div className="skeleton-card" key={item} aria-hidden="true"><div className="skeleton-block skeleton-cover" /><div className="skeleton-block skeleton-line short" /><div className="skeleton-block skeleton-line long" /><div className="skeleton-block skeleton-line" /></div>)}
  </div>;
}

function CollectionError({ message }) {
  if (!message) return null;
  return <div className="container"><div className="notice notice-error" role="alert">{message}</div></div>;
}

function matchesSearch(text, search) {
  const content = text.toLowerCase();
  return search.trim().toLowerCase().split(/\s+/).filter(Boolean).every((term) => content.includes(term));
}

function formatDate(value) {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function PostCard({ item, type, index = 0 }) {
  const href = `/${type}/${item.slug}`;
  const Icon = type === "tutorials" ? BookOpen : Sparkles;
  return (
    <motion.article className="content-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .32, delay: index * .045 }}>
      <div className={`content-cover alt-${index % 3}`} style={item.imageUrl ? { backgroundImage: `url("${item.imageUrl}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
        {!item.imageUrl && <Icon size={34} aria-hidden="true" />}
      </div>
      <div className="content-body">
        <div className="card-meta"><span className="card-tag">{item.isSample ? "Sample" : item.category || "Guide"}</span><span>{item.readTime ? `${item.readTime} min read` : item.isSample ? "Preview" : formatDate(item.date || item.createdAt) || "Community"}</span></div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <Link className="content-read" href={href}>Read more <ArrowRight size={14} /></Link>
      </div>
    </motion.article>
  );
}

function ControlsTable({ controls }) {
  if (!controls?.length) return null;
  return <div className="controls-table-wrap">
    <table className="controls-table">
      <caption>Driving controls</caption>
      <thead><tr><th scope="col">Action</th><th scope="col">PC</th><th scope="col">Mobile</th></tr></thead>
      <tbody>{controls.map((control) => <tr key={control.action}><th scope="row">{control.action}</th><td>{control.pc}</td><td>{control.mobile}</td></tr>)}</tbody>
    </table>
  </div>;
}

function FilteredGrid({ collection, type, filters, searchPlaceholder }) {
  const { items, loading, error } = useContent(collection);
  const { items: storedCategories } = useContent(collection === "tutorials" ? "tutorialCategories" : "faqCategories");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const categoryNames = storedCategories.length ? storedCategories.map((item) => item.name).filter(Boolean) : filters.slice(1);
  const availableFilters = [...new Set(categoryNames)];
  const shown = useMemo(() => items.filter((item) => {
    const categoryMatches = category === "All" || item.category === category;
    return categoryMatches && matchesSearch(`${item.title} ${item.summary} ${item.category}`, search);
  }), [items, category, search]);
  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = shown.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <>
      <CollectionError message={error} />
      <section className="page-content container">
        <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} aria-label={searchPlaceholder} /></label>
        <div className="filter-row" aria-label="Filter by category">{["All", ...availableFilters].map((item) => <button key={item} type="button" className={`filter-chip ${category === item ? "active" : ""}`} onClick={() => { setCategory(item); setPage(1); }} aria-pressed={category === item}>{item}</button>)}</div>
        {loading ? <ContentSkeleton /> : visible.length ? <div className="card-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{visible.map((item, index) => <PostCard key={item.id || item.slug} item={item} type={type} index={index} />)}</div> : <div className="empty-state">No results yet. Try another search or category.</div>}
        {!loading && <Pagination page={currentPage} total={shown.length} pageSize={pageSize} onPageChange={setPage} label={type} />}
      </section>
    </>
  );
}

export function HomePage() {
  const { items: updates, loading: updatesLoading, error: updatesError } = useContent("updates");
  const { items: settings } = useContent("websiteSettings");
  const links = settings[0] || {};
  const robloxUrl = links.robloxUrl || gameLinks.roblox;
  const discordUrl = links.discordUrl || gameLinks.discord;
  const features = [
    { icon: Building2, title: "Choose your ride-hailing life", text: "Start at City Hall, meet Ate Marites, and get assigned to Angkis, GrabengSakay, or SadRide." },
    { icon: Star, title: "Pick up. Drop off. Get rated.", text: "Accept customer bookings and earn fares, tips, and ratings for safe rides." },
    { icon: Gauge, title: "Look after your scooter", text: "Manage fuel and motor health, and keep hunger and thirst from running low." },
    { icon: Wrench, title: "Make the scooter your own", text: "Visit DAHON or GASA Motors to shop, then upgrade eligible scooters at the Talyer." },
    { icon: Trophy, title: "Keep an eye on your goals", text: "Complete daily quests, claim playtime rewards, and climb the global leaderboards." },
    { icon: ShieldCheck, title: "Ride in style, ride by the rules", text: "Collect cosmetic helmets and titles, enjoy seasonal events, and follow traffic rules." },
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-inner container">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <span className="eyebrow">Clock in at City Hall <span aria-hidden="true">✦</span> Ride for your assigned company</span>
            <h1>Pick Up.<br />Drop Off.<br /><span>Level Up.</span></h1>
            <p>{links.description || "Join Angkis, GrabengSakay, or SadRide, take your scooter across town, and pick up passengers for fares, tips, and ratings. Keep your ride fueled, look after yourself, and follow the rules of the road."}</p>
            <div className="hero-actions">
              <a className="button" href={robloxUrl} target="_blank" rel="noreferrer">Play on Roblox <ArrowUpRight size={16} /></a>
              <Link className="button button-secondary" href="/tutorials">Explore tutorials <ArrowDownRight size={16} /></Link>
            </div>
            <div className="hero-note"><BadgeCheck size={16} /> A community hub for new and returning drivers</div>
          </motion.div>
          <motion.div className="hero-scene" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .12 }}>
            <Image
              className="hero-art-image"
              src="/images/manong-driver-hero.jpg"
              alt="Manong Driver rider on a scooter in a busy city"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </section>
      <section className="section section-light">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">A city that feels like home</span><h2>Life on two wheels.</h2><p>Manong Driver is a Philippine-themed ride-hailing and scooter life sim. Start a job at City Hall, join your assigned company, and ride around town picking up customers for fares, tips, and ratings.</p></div>
          <div className="steps-grid">
            {[["01", "Clock in at City Hall", "Talk to Ate Marites and get randomly assigned to Angkis, GrabengSakay, or SadRide."], ["02", "Pick up your customer", "Switch ON DUTY in your phone’s Job app, accept a booking, and follow the yellow minimap route."], ["03", "Ride safe, earn more", "Drop off your customer and build your fares, tips, and ratings while caring for your scooter."]].map(([number, title, text]) => <article className="step-card" key={number}><span className="step-num">{number} / THE ROUTE</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">The driver&apos;s seat is yours</span><h2>Every trip has a story.</h2><p>From your first pickup to your favorite city corner, find your own rhythm on the road.</p></div>
          <div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={20} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>
      {links.seasonalChristmasEnabled !== false && <section className="seasonal-section">
        <div className="container seasonal-card christmas-card">
          <div><span className="eyebrow">Christmas event · Candy Canes 🍭</span><h2>Christmas in town.</h2><p>Visit Santa House, meet the Elf, and shop for the Santa Motorcycle for 🍭 1,500 Candy Canes. Ways to earn Candy Canes are coming soon; the Santa Sleigh will be available to players soon.</p><div className="seasonal-tags"><span>Santa House</span><span>Elf&apos;s Christmas Shop</span><span>Santa Motorcycle · 🍭 1,500</span><span>Santa Sleigh · Coming soon</span></div></div>
          <Link className="button button-secondary" href="/updates/christmas-update">Christmas update <ArrowRight size={15} /></Link>
        </div>
      </section>}
      <section className="updates-section">
        <div className="container">
          <div className="section-topline"><div><span className="eyebrow">Fresh from the city</span><h2>Latest updates</h2></div><Link className="text-link" href="/updates">All updates <ArrowRight size={15} /></Link></div>
          {updatesError && <div className="notice notice-error" role="alert">{updatesError}</div>}
          {updatesLoading ? <ContentSkeleton /> : updates.length ? <div className="card-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{updates.slice(0, 3).map((item, index) => <PostCard key={item.id || item.slug} item={item} type="updates" index={index} />)}</div> : !updatesError && <div className="empty-state">No announcements yet. Check back soon.</div>}
        </div>
      </section>
      <section className="section">
        <div className="container community-banner">
          <div><span className="eyebrow">The journey is better together</span><h2>See you out there, Manong.</h2><p>Join the community, send the team a note, or jump straight into the game. Your next trip is just around the corner.</p></div>
          <div className="community-actions"><a className="button" href={robloxUrl} target="_blank" rel="noreferrer">Find us on Roblox <ArrowUpRight size={15} /></a><a className="button button-secondary" href={discordUrl} target="_blank" rel="noreferrer">Join the community <ArrowUpRight size={15} /></a></div>
        </div>
      </section>
    </>
  );
}

export function TutorialsPage() {
  return <><PageIntro label="The driver's handbook" title="Learn the ropes." description="New to the driver's seat? Start with a guide, find your bearings, and explore at your own pace." /><FilteredGrid collection="tutorials" type="tutorials" filters={categories.tutorials} searchPlaceholder="Search the handbook…" /></>;
}

export function UpdatesPage() {
  return <><PageIntro label="From the road" title="News & updates." description="The latest announcements and community notes from Manong Driver." /><FilteredGrid collection="updates" type="updates" filters={categories.updates} searchPlaceholder="Search announcements…" /></>;
}

export function ArticlePage({ type, slug }) {
  const collection = type === "tutorials" ? "tutorials" : "updates";
  const { items, loading, error } = useContent(collection);
  const post = items.find((item) => item.slug === slug);
  if (loading) return <Loading />;
  if (error) return <CollectionError message={error} />;
  if (!post) return <section className="page-content container"><div className="empty-state">We couldn’t find this post. <Link className="text-link" href={`/${type}`}>Back to {type}</Link></div></section>;
  const index = items.indexOf(post);
  const before = items[index - 1];
  const after = items[index + 1];
  return (
    <article className="article container">
      <Link className="article-back" href={`/${type}`}><ArrowLeft size={15} /> All {type}</Link>
      <div className="article-hero" style={post.imageUrl ? { backgroundImage: `linear-gradient(0deg,rgba(17,26,22,.86),rgba(17,26,22,.05)),url("${post.imageUrl}")`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
        <div className="card-meta"><span className="card-tag">{post.isSample ? "Sample" : post.category}</span>{post.difficulty && <span className="card-tag">{post.difficulty}</span>}</div>
        <div className="card-meta" style={{ marginTop: 12 }}>
          {post.author && <span>{post.author}</span>}
          {post.readTime && <><span>·</span><span>{post.readTime} min read</span></>}
          {(formatDate(post.date || post.createdAt) || post.isSample) && <><span>·</span><span>{post.isSample ? "Preview" : formatDate(post.date || post.createdAt)}</span></>}
        </div>
      </div>
      <h1>{post.title}</h1><p className="article-lede">{post.summary}</p>
      <div className="article-body">{post.body || post.answer || "More information coming soon."}</div>
      <ControlsTable controls={post.controls} />
      <nav className="article-nav" aria-label="Related posts">
        {before ? <Link href={`/${type}/${before.slug}`}><small>← Previous</small>{before.title}</Link> : <span />}
        {after ? <Link href={`/${type}/${after.slug}`} style={{ textAlign: "right" }}><small>Next →</small>{after.title}</Link> : <span />}
      </nav>
    </article>
  );
}

export function FaqPage() {
  const { items, loading, error } = useContent("faqs");
  const { items: storedCategories } = useContent("faqCategories");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const faqCategoryNames = storedCategories.length ? storedCategories.map((item) => item.name).filter(Boolean) : categories.faqs;
  const faqCategories = [...new Set(faqCategoryNames)];
  const filtered = items.filter((faq) => {
    const matchesCategory = category === "All" || faq.category === category;
    return matchesCategory && matchesSearch(`${faq.question} ${faq.answer}`, search);
  });
  const groups = category === "All" && !search
    ? [...new Set([...categories.faqs, ...storedCategories.map((item) => item.name).filter(Boolean)])]
    : [...new Set(filtered.map((item) => item.category).filter(Boolean))];
  return (
    <>
      <PageIntro label="Quick answers" title="Good to know." description="A few handy answers for the road ahead. Still curious? Send us a note." />
      <section className="page-content container">
        <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a question…" aria-label="Search a question" /></label>
        <div className="filter-row">{["All", ...faqCategories].map((item) => <button key={item} className={`filter-chip ${category === item ? "active" : ""}`} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <CollectionError message={error} />
        {loading ? <Loading /> : <div className="faq-list">{groups.map((group) => {
          const questions = filtered.filter((faq) => faq.category === group);
          if (!questions.length) return null;
          return <section className="faq-group" key={group}><h2>{group}</h2>{questions.map((faq) => <details className="faq-item" key={faq.id}><summary>{faq.question}{faq.seasonal && <span className="seasonal-label">Seasonal</span>}<CircleHelp size={17} /></summary><p>{faq.answer}</p></details>)}</section>;
        })}{!filtered.length && <div className="empty-state">No questions match that search.</div>}</div>}
      </section>
    </>
  );
}

export function AboutPage() {
  const { items: settings } = useContent("websiteSettings");
  const gameUrl = settings[0]?.robloxUrl || gameLinks.roblox;
  const description = settings[0]?.description || "Manong Driver brings the familiar rhythms of Filipino transportation to a friendly Roblox driving adventure.";
  return (
    <>
      <PageIntro label="Our story" title="A little bit of home, wherever you roam." description={description} />
      <section className="page-content container">
        <div className="story-grid">
          <article className="story-card"><span className="feature-icon"><MapPin size={20} /></span><h2>Rooted in Filipino journeys</h2><p className="story-copy">The everyday ride is part of how a city comes together. Manong Driver celebrates that familiar feeling with a welcoming virtual city where players can pick up passengers and find their way around.</p></article>
          <article className="story-card"><span className="feature-icon"><Sparkles size={20} /></span><h2>Made for the community</h2><p className="story-copy">This community hub is here to make it easier to find beginner guides, read official news, and share feedback. We’ll keep the information here aligned with what’s actually available in the game.</p></article>
          <article className="story-card"><span className="feature-icon"><Compass size={20} /></span><h2>Our vision</h2><p className="story-copy">Create a welcoming driving adventure inspired by Filipino city life, where players can enjoy the journey, discover the city, and make every trip their own.</p></article>
          <article className="story-card"><span className="feature-icon"><CarFront size={20} /></span><h2>Development &amp; credits</h2><p className="story-copy">Manong Driver is a Roblox game brought to life by its development team and community. Thanks to the players who join the ride and help the experience grow.</p></article>
        </div>
        <div className="stats-grid"><div className="stat-card"><strong>Explore</strong><span>At your own pace</span></div><div className="stat-card"><strong>Connect</strong><span>With fellow drivers</span></div><div className="stat-card"><strong>Discover</strong><span>Every corner of the city</span></div></div>
        <div style={{ textAlign: "center", marginTop: 24 }}><a className="button" href={gameUrl} target="_blank" rel="noreferrer">Visit the Roblox experience <ArrowUpRight size={15} /></a></div>
      </section>
    </>
  );
}

export function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const category = String(data.get("category") || "");
    const subject = String(data.get("subject") || "").trim();
    const description = String(data.get("description") || "").trim();
    const screenshot = data.get("screenshot");
    if (name.length < 2 || subject.length < 4 || description.length < 15) {
      setResult({ type: "error", text: "Please add your name, a clear subject, and at least 15 characters of detail." });
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResult({ type: "error", text: "Please enter a valid email address or leave it blank." });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      let imageUrl = "";
      if (screenshot instanceof File && screenshot.size) imageUrl = await uploadReportImage(screenshot);
      await submitReport({ name, email, category, subject, description, screenshotUrl: imageUrl });
      form.reset();
      setResult({ type: "success", text: "Thanks for helping us make the ride better. Your message is on its way." });
    } catch (error) {
      setResult({ type: "error", text: error.message || "We couldn't send that just now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <PageIntro label="Let's talk" title="A note from the road." description="Found a bug, have an idea, or just want to say hi? We’d love to hear from you." />
      <section className="page-content container">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="contact-name">Name or Roblox username</label><input id="contact-name" name="name" autoComplete="nickname" maxLength={60} required /></div>
            <div className="form-field"><label htmlFor="contact-email">Email <span className="form-hint">(optional)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} /></div>
            <div className="form-field full"><label htmlFor="contact-category">What’s this about?</label><select id="contact-category" name="category" defaultValue="Bug report"><option>Bug report</option><option>Suggestion</option><option>Feedback</option><option>General inquiry</option></select></div>
            <div className="form-field full"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" maxLength={120} required /></div>
            <div className="form-field full"><label htmlFor="contact-description">Tell us a little more</label><textarea id="contact-description" name="description" maxLength={3000} minLength={15} required /><span className="form-hint">Please leave out passwords and private account information.</span></div>
            <div className="form-field full"><label htmlFor="contact-screenshot">Screenshot <span className="form-hint">(optional, JPG/PNG/WebP, up to 5 MB)</span></label><input id="contact-screenshot" name="screenshot" type="file" accept="image/jpeg,image/png,image/webp" /></div>
            <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this blank</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
          </div>
          {result && <div className={`notice notice-${result.type}`} role={result.type === "error" ? "alert" : "status"}>{result.text}</div>}
          <button className="button" style={{ marginTop: 20 }} type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send your message"} <ArrowRight size={15} /></button>
        </form>
      </section>
    </>
  );
}
