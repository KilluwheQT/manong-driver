import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  return <section className="container" style={{ minHeight: "55vh", display: "grid", placeContent: "center", textAlign: "center" }}>
    <MapPin size={35} style={{ margin: "0 auto", color: "var(--green)" }} />
    <span className="eyebrow" style={{ marginTop: 16 }}>Wrong turn?</span>
    <h1 style={{ fontSize: 46, letterSpacing: "-.06em", margin: "12px 0" }}>This road ends here.</h1>
    <p style={{ color: "var(--muted)", fontSize: 14 }}>We couldn’t find the page you were looking for.</p>
    <Link href="/" className="text-link" style={{ justifyContent: "center", marginTop: 15 }}><ArrowLeft size={14} /> Back to the city</Link>
  </section>;
}
