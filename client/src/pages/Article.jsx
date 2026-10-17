import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import Spinner from "../components/Spinner.jsx";

export default function Article() {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["article", slug], queryFn: () => api(`/articles/${slug}`) });
  if (isLoading) return <Spinner />;
  if (isError) return <p className="py-20 text-center text-slate-600">{error.message}</p>;
  const a = data.article;
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/legal-resources" className="text-sm text-navy-600 hover:underline">← All resources</Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-gold-600">{a.category}</p>
      <h1 className="mt-2 text-4xl font-bold">{a.title}</h1>
      <p className="mt-2 text-sm text-slate-500">{new Date(a.publishedAt).toLocaleDateString(undefined, { dateStyle: "long" })}</p>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-700">
        {a.content.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <p className="mt-10 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">This article is general information, not legal advice. Consult a licensed attorney about your situation.</p>
      <Link to="/lawyer-search" className="btn-primary mt-8">Find a lawyer</Link>
    </article>
  );
}
