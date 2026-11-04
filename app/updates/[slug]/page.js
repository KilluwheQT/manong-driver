import { Suspense } from "react";
import { ArticlePage } from "@/components/site-pages";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} — Game Update` };
}

async function UpdateContent({ params }) {
  const { slug } = await params;
  return <ArticlePage type="updates" slug={slug} />;
}

export default function Page({ params }) {
  return <Suspense fallback={<div className="loading">Loading update…</div>}><UpdateContent params={params} /></Suspense>;
}
