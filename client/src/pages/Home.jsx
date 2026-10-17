import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ShieldCheck, GitCompare, MessageSquare, Handshake, MapPin } from "lucide-react";
import { api } from "../lib/api.js";
import { iconFor } from "../lib/icons.js";
import ArticleCard from "../components/ArticleCard.jsx";

const steps = [
  { icon: Search, title: "Search by legal need", text: "Browse by practice area, city or keyword to find attorneys who match your situation." },
  { icon: GitCompare, title: "Compare profiles", text: "Review experience, ratings and fees side by side and shortlist the best fit." },
  { icon: MessageSquare, title: "Request a consultation", text: "Send a message directly to a lawyer to talk through your options." },
  { icon: Handshake, title: "Hire with confidence", text: "Choose the attorney you trust and move forward knowing every listing is reviewed." },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const { data: cats } = useQuery({ queryKey: ["categories"], queryFn: () => api("/categories") });
  const { data: arts } = useQuery({ queryKey: ["articles", "home"], queryFn: () => api("/articles?limit=3") });

  function onSubmit(e) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (city.trim()) sp.set("city", city.trim());
    navigate(`/lawyer-search?${sp}`);
  }

  return (
    <>
      <section className="bg-gradient-to-b from-navy-900 to-navy-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <h1 className="font-serif text-4xl font-bold text-white! sm:text-6xl">Find the right lawyer, <span className="text-gold-400">near you</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-100">Search verified attorneys by practice area and location, compare their profiles and get in touch in minutes.</p>
          <form onSubmit={onSubmit} role="search" className="mx-auto mt-10 grid max-w-3xl gap-3 rounded-2xl bg-white p-3 shadow-xl sm:grid-cols-[1fr_1fr_auto]">
            <label className="relative">
              <span className="sr-only">Practice area or keyword</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input className="input !pl-9" placeholder="Practice area or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <label className="relative">
              <span className="sr-only">City</span>
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input className="input !pl-9" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <button className="btn-gold">Search</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-600"><Icon className="h-5 w-5" aria-hidden /></div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-600">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-3xl font-bold">What is your legal issue?</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cats?.categories.map((c) => {
            const Icon = iconFor(c.icon);
            return (
              <div key={c._id} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400/20 text-gold-600"><Icon className="h-5 w-5" aria-hidden /></span>
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{c.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.areas.slice(0, 5).map((a) => (
                    <li key={a.slug}>
                      <Link to={`/lawyer-search/${a.slug}`} className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:border-navy-500 hover:text-navy-600">{a.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="card flex flex-col items-start gap-4 bg-navy-50 p-8 sm:flex-row sm:items-center">
          <ShieldCheck className="h-12 w-12 shrink-0 text-navy-600" aria-hidden />
          <div>
            <h2 className="text-2xl font-bold">Every lawyer is reviewed before going live</h2>
            <p className="mt-1 text-slate-600">New profiles stay hidden until an administrator confirms their bar details, and any change to credentials triggers a fresh review.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Legal resources</h2>
          <Link to="/legal-resources" className="text-sm font-medium text-navy-600 hover:underline">See all</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {arts?.items.map((a) => <ArticleCard key={a._id} article={a} />)}
        </div>
      </section>
    </>
  );
}
