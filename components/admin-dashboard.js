"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight, BookOpen, Check, ClipboardList, FileText,
  HelpCircle, LayoutDashboard, LogOut, Plus, Settings, Trash2, Upload,
} from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { logOut, signInAdmin, watchAuth } from "@/lib/auth";
import { removeContent, refreshOfficialContent, saveContent } from "@/lib/firestore";
import { removeReportImage, uploadAdminImage } from "@/lib/storage";
import { Pagination } from "@/components/pagination";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tutorials", label: "Tutorials", icon: BookOpen },
  { id: "updates", label: "Updates", icon: FileText },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "tutorialCategories", label: "Tutorial categories", icon: ClipboardList },
  { id: "faqCategories", label: "FAQ categories", icon: ClipboardList },
  { id: "bugReports", label: "Bug reports", icon: ClipboardList },
  { id: "websiteSettings", label: "Site settings", icon: Settings },
];

const schemas = {
  tutorials: [
    ["title", "Title"], ["slug", "URL slug"], ["category", "Category"],
    ["difficulty", "Difficulty"], ["readTime", "Reading time (minutes)", "number"],
    ["date", "Publication date", "date"],
    ["author", "Author"], ["summary", "Short summary", "textarea"],
    ["body", "Tutorial content", "textarea"], ["controls", "Driving controls (JSON array)", "textarea"], ["imageUrl", "Cover image URL"],
    ["published", "Published", "checkbox"],
  ],
  updates: [
    ["title", "Title"], ["slug", "URL slug"], ["category", "Category"],
    ["date", "Publication date", "date"], ["summary", "Short summary", "textarea"],
    ["body", "Update content", "textarea"], ["imageUrl", "Cover image URL"],
    ["published", "Published", "checkbox"],
  ],
  faqs: [
    ["question", "Question"], ["category", "Category"], ["answer", "Answer", "textarea"],
    ["published", "Published", "checkbox"],
  ],
  tutorialCategories: [["name", "Category name"], ["slug", "URL slug"], ["published", "Published", "checkbox"]],
  faqCategories: [["name", "Category name"], ["slug", "URL slug"], ["published", "Published", "checkbox"]],
  websiteSettings: [
    ["title", "Website name"], ["description", "Short description", "textarea"],
    ["robloxUrl", "Roblox game URL"], ["discordUrl", "Discord invite URL"],
    ["seasonalChristmasEnabled", "Show Christmas event banner", "checkbox"],
  ],
};

function LoginPanel({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try { await signInAdmin(email, password); onSignedIn(); }
    catch (reason) { setError(reason.message || "Unable to sign in."); }
    finally { setBusy(false); }
  }
  return <section className="container" style={{ padding: "60px 0 90px" }}>
    <div className="page-heading" style={{ padding: "15px 0 20px" }}><span className="eyebrow">Team access</span><h1>Welcome back.</h1><p>Sign in with an administrator account to manage the community site.</p></div>
    <form className="auth-card admin-form" onSubmit={submit}>
      <label>Email address<input className="admin-input" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input className="admin-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      <button className="button" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in to dashboard"} <ArrowUpRight size={15} /></button>
      <p className="form-hint">Admin permissions are verified using Firebase custom claims.</p>
    </form>
  </section>;
}

function Field({ definition, value, onChange, onFile, uploading }) {
  const [name, label, type] = definition;
  if (type === "checkbox") return <label className="admin-check"><input name={name} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(name, event.target.checked)} /> {label}</label>;
  if (name === "imageUrl") return <label>{label}<input className="admin-input" name={name} type="url" value={value || ""} onChange={(event) => onChange(name, event.target.value)} placeholder="https://…" /><span className="form-hint">Or upload an image (JPG, PNG, WebP; up to 5 MB).</span><input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={uploading} /></label>;
  const Input = type === "textarea" ? "textarea" : "input";
  return <label>{label}<Input className="admin-input" name={name} type={type || "text"} value={value ?? ""} onChange={(event) => onChange(name, type === "number" ? event.target.value : event.target.value)} required /></label>;
}

function Editor({ section, initial, onSave, onCancel }) {
  const schema = schemas[section] || [];
  const [values, setValues] = useState(() => initial
    ? {
      ...initial,
      seasonalChristmasEnabled: initial.seasonalChristmasEnabled ?? true,
      controls: initial.controls ? JSON.stringify(initial.controls, null, 2) : "",
    }
    : { published: true, seasonalChristmasEnabled: true });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  function change(name, value) { setValues((current) => ({ ...current, [name]: value })); }
  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try { change("imageUrl", await uploadAdminImage(file, section)); }
    catch (reason) { setError(reason.message || "Image upload failed."); }
    finally { setUploading(false); }
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const normalized = { ...values };
    if (normalized.readTime !== undefined) normalized.readTime = Number(normalized.readTime);
    if (section !== "websiteSettings") normalized.published = Boolean(normalized.published);
    if (section === "websiteSettings" && !initial?.id) normalized.published = true;
    try {
      if (section === "tutorials") {
        normalized.controls = normalized.controls
          ? JSON.parse(normalized.controls)
          : [];
        if (!Array.isArray(normalized.controls) || normalized.controls.some((control) =>
          typeof control.action !== "string" ||
          typeof control.pc !== "string" ||
          typeof control.mobile !== "string")) {
          throw new Error("Controls must be a JSON array with action, pc, and mobile text for each row.");
        }
      }
      await onSave(normalized);
    }
    catch (reason) { setError(reason.message || "Unable to save these changes."); }
    finally { setBusy(false); }
  }
  return <form className="admin-form" onSubmit={submit}>
    {schema.map((field) => <Field key={field[0]} definition={field} value={values[field[0]]} onChange={change} onFile={handleFile} uploading={uploading} />)}
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
      <button className="button" type="submit" disabled={busy || uploading}>{busy ? "Saving…" : uploading ? "Uploading…" : "Save changes"} <Check size={15} /></button>
      <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

function Overview() {
  const tutorials = useContent("tutorials", { admin: true });
  const updates = useContent("updates", { admin: true });
  const faqs = useContent("faqs", { admin: true });
  const reports = useContent("bugReports", { admin: true });
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState(null);
  async function seed() {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const count = await refreshOfficialContent();
      setSeedMessage({ type: "success", text: `${count} official starter entries refreshed. Custom content was left unchanged.` });
      await Promise.all(groups.map(([, group]) => group.refresh()));
    } catch (reason) {
      setSeedMessage({ type: "error", text: reason.message || "Unable to load starter content." });
    } finally {
      setSeeding(false);
    }
  }
  const groups = [
    ["Tutorials", tutorials], ["Updates", updates], ["FAQs", faqs], ["Bug reports", reports],
  ];
  return <>
    <div className="stats-grid grid grid-cols-2 gap-3 md:grid-cols-4" style={{ maxWidth: "none", margin: "0 0 24px" }}>{groups.map(([label, group]) => <div className="stat-card" key={label}><strong>{group.loading ? "—" : group.items.length}</strong><span>{label}</span></div>)}</div>
    {groups.filter(([, group]) => group.error).map(([label, group]) => <div className="notice notice-error" role="alert" key={label}>{label}: {group.error}</div>)}
    {seedMessage && <div className={`notice notice-${seedMessage.type}`} role={seedMessage.type === "error" ? "alert" : "status"}>{seedMessage.text}</div>}
    <button className="button button-secondary" type="button" onClick={() => {
      if (window.confirm("Refresh the official starter guides, FAQs, and sample announcements? This updates those starter entries only. Your custom content is left unchanged.")) seed();
    }} disabled={seeding}>{seeding ? "Refreshing…" : "Refresh official starter content"}</button>
    <h2 style={{ fontSize: 17 }}>Recent reports</h2>
    <ReportTable reports={reports} compact />
  </>;
}

function ReportTable({ reports, compact = false }) {
  const [page, setPage] = useState(1);
  if (reports.loading) return <div className="loading">Loading submissions…</div>;
  if (reports.error) return <div className="notice notice-error" role="alert">{reports.error}</div>;
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(reports.items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = compact ? reports.items.slice(0, 5) : reports.items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  if (!rows.length) return <div className="empty-state">No reports have been submitted yet.</div>;
  return <><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Subject</th><th>From</th><th>Category</th><th>Status</th>{!compact && <th>Actions</th>}</tr></thead><tbody>
    {rows.map((report) => <tr key={report.id}><td>{report.subject}{report.screenshotUrl && <a className="text-link" style={{ display: "block", marginTop: 6 }} href={report.screenshotUrl} target="_blank" rel="noreferrer">View image <ArrowUpRight size={11} /></a>}</td><td>{report.name}<br /><span className="form-hint">{report.email}</span></td><td>{report.category}</td><td>{report.status || "new"}</td>{!compact && <td><select className="admin-input" value={report.status || "new"} onChange={(event) => reports.onStatus(report, event.target.value)}><option value="new">New</option><option value="in-progress">In progress</option><option value="resolved">Resolved</option><option value="spam">Spam</option></select><button type="button" onClick={() => reports.onDelete(report)}><Trash2 size={13} /> Delete</button></td>}</tr>)}
  </tbody></table></div>{!compact && <Pagination page={currentPage} total={reports.items.length} pageSize={pageSize} onPageChange={setPage} label="bug reports" />}</>;
}

function DashboardWorkspace({ section }) {
  const collection = section === "overview" ? "bugReports" : section;
  const { items, loading, error, refresh } = useContent(collection, { admin: true });
  const [editor, setEditor] = useState(null);
  const [message, setMessage] = useState(null);
  const [page, setPage] = useState(1);
  const title = sections.find((item) => item.id === section)?.label || "Dashboard";
  async function save(values) {
    const id = editor?.id || (section === "websiteSettings" ? "general" : null);
    await saveContent(collection, id, values);
    setEditor(null);
    setMessage({ type: "success", text: "Changes saved." });
    await refresh();
  }
  async function remove(item) {
    if (!window.confirm(`Delete “${item.title || item.question || item.name || item.subject || "this item"}”? This cannot be undone.`)) return;
    try {
      if (collection === "bugReports") await removeReportImage(item.screenshotUrl);
      await removeContent(collection, item.id);
      setMessage({ type: "success", text: "Item deleted." });
      await refresh();
    }
    catch (reason) { setMessage({ type: "error", text: reason.message || "Unable to delete this item." }); }
  }
  async function changeStatus(report, status) {
    try { await saveContent("bugReports", report.id, { status }); setMessage({ type: "success", text: "Report status updated." }); await refresh(); }
    catch (reason) { setMessage({ type: "error", text: reason.message || "Unable to update this report." }); }
  }
  const fields = schemas[section] || [];
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  if (section === "overview") return <Overview />;
  if (section === "bugReports") return <>{message && <div className={`notice notice-${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.text}</div>}<ReportTable reports={{ loading, error, items, onStatus: changeStatus, onDelete: remove }} /></>;
  const labelOf = (item) => item.title || item.question || item.name || item.key || item.subject || item.id;
  if (editor) return <Editor section={section} initial={editor} onSave={save} onCancel={() => setEditor(null)} />;
  return <>
    {message && <div className={`notice notice-${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.text}</div>}
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    {loading ? <div className="loading">Loading {title.toLowerCase()}…</div> : items.length ? <><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleItems.map((item) => <tr key={item.id}><td>{labelOf(item)}</td><td>{item.category || "—"}</td><td>{item.published === false ? "Draft" : section === "websiteSettings" ? "Active" : "Published"}</td><td><button type="button" onClick={() => setEditor(item)}>Edit</button>{section !== "websiteSettings" && <button type="button" onClick={() => remove(item)}><Trash2 size={13} /> Delete</button>}</td></tr>)}</tbody></table></div><Pagination page={currentPage} total={items.length} pageSize={pageSize} onPageChange={setPage} label={title.toLowerCase()} /></> : <div className="empty-state">No {title.toLowerCase()} yet. Add the first one when you’re ready.</div>}
    {section === "websiteSettings" && !items.length && <button className="button" style={{ marginTop: 19 }} onClick={() => setEditor({ published: true })}><Plus size={15} /> Set up website settings</button>}
    {section !== "websiteSettings" && <button className="button" style={{ marginTop: 19 }} onClick={() => setEditor({ published: true })}><Plus size={15} /> New {section.includes("Categories") ? "category" : section === "faqs" ? "FAQ" : section === "tutorials" ? "tutorial" : section === "updates" ? "update" : "item"}</button>}
    {!fields.length && <span className="form-hint">No editable fields are configured for this section.</span>}
  </>;
}

export function AdminDashboard() {
  const [mode, setMode] = useState("checking");
  const [section, setSection] = useState("overview");
  const [authError, setAuthError] = useState("");
  useEffect(() => watchAuth(async (user) => {
    if (!user) { setMode("signed-out"); return; }
    try {
      const token = await user.getIdTokenResult(true);
      if (token.claims.admin === true) { setAuthError(""); setMode("admin"); }
      else { await logOut(); setMode("signed-out"); setAuthError("This account does not have administrator access."); }
    } catch (reason) { setMode("signed-out"); setAuthError(reason.message || "Could not verify administrator access."); }
  }), []);
  const activeSection = sections.find((item) => item.id === section) || sections[0];
  if (mode === "checking") return <div className="loading" role="status">Verifying administrator access…</div>;
  if (mode === "signed-out") return <div>{authError && <div className="container"><div className="notice notice-error" role="alert">{authError}</div></div>}<LoginPanel onSignedIn={() => setMode("admin")} /></div>;
  return <div className="admin-shell">
    <aside className="admin-sidebar"><span className="eyebrow">Manong Driver</span><div className="admin-nav">{sections.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={section === id ? "active" : ""} onClick={() => setSection(id)}><Icon size={16} />{label}</button>)}</div><button className="admin-nav" style={{ marginTop: 20, display: "flex", flexDirection: "row" }} onClick={() => logOut()}><LogOut size={15} />Sign out</button></aside>
    <section className="admin-main">
      <div className="admin-mobile"><select className="admin-input" aria-label="Dashboard section" value={section} onChange={(event) => setSection(event.target.value)}>{sections.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
      <div className="admin-title"><div><span className="eyebrow">Community dashboard</span><h1>{activeSection.label}</h1></div><button className="button button-secondary" type="button" onClick={() => logOut()}><LogOut size={14} /> Sign out</button></div>
      <DashboardWorkspace key={section} section={section} />
    </section>
  </div>;
}
