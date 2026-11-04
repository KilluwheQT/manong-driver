import { Suspense } from "react";
import { ArticlePage } from "@/components/site-pages";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} — Driver Tutorial` };
}

async function TutorialContent({ params }) {
  const { slug } = await params;
  return <ArticlePage type="tutorials" slug={slug} />;
}

export default function Page({ params }) {
  return <Suspense fallback={<div className="loading">Loading tutorial…</div>}><TutorialContent params={params} /></Suspense>;
}
