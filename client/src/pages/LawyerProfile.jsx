import { useState } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck, MapPin, Briefcase, Languages, DollarSign } from "lucide-react";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import Stars from "../components/Stars.jsx";
import Spinner from "../components/Spinner.jsx";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email"),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10, "Please describe your issue in a few words"),
});

function ContactForm({ slug }) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", phone: "", message: "" },
  });
  const m = useMutation({
    mutationFn: (values) => api("/consultations", { method: "POST", body: { ...values, phone: values.phone ?? "", lawyerSlug: slug } }),
    onSuccess: () => reset(),
  });

  if (m.isSuccess) return <p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">Thanks! Your request was sent. The lawyer will reply by email.</p>;

  return (
    <form onSubmit={handleSubmit((v) => m.mutate(v))} className="space-y-4" noValidate>
      <div><label className="label" htmlFor="c-name">Your name</label><input id="c-name" className="input" {...register("name")} />{errors.name && <p className="field-error">{errors.name.message}</p>}</div>
      <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" type="email" className="input" {...register("email")} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div>
      <div><label className="label" htmlFor="c-phone">Phone (optional)</label><input id="c-phone" className="input" {...register("phone")} /></div>
      <div><label className="label" htmlFor="c-msg">How can they help?</label><textarea id="c-msg" rows={4} className="input" {...register("message")} />{errors.message && <p className="field-error">{errors.message.message}</p>}</div>
      {m.isError && <p className="field-error">{m.error.message}</p>}
      <button className="btn-primary w-full" disabled={m.isPending}>{m.isPending ? "Sending…" : "Request consultation"}</button>
    </form>
  );
}

function ReviewForm({ slug }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const m = useMutation({
    mutationFn: () => api(`/lawyers/${slug}/reviews`, { method: "POST", body: { rating, comment } }),
    onSuccess: () => { setComment(""); qc.invalidateQueries({ queryKey: ["lawyer", slug] }); },
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4">
      <p className="text-sm font-semibold">Leave a review</p>
      <label className="label" htmlFor="rv-rating">Rating</label>
      <select id="rv-rating" className="input w-28" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
      </select>
      <textarea aria-label="Review comment" rows={3} className="input" placeholder="Share your experience" value={comment} onChange={(e) => setComment(e.target.value)} />
      {m.isError && <p className="field-error">{m.error.message}</p>}
      <button className="btn-primary" disabled={m.isPending}>Submit review</button>
    </form>
  );
}

export default function LawyerProfile() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["lawyer", slug], queryFn: () => api(`/lawyers/${slug}`) });
  const { data: cats } = useQuery({ queryKey: ["categories"], queryFn: () => api("/categories") });

  if (isLoading) return <Spinner />;
  if (isError) return <div className="mx-auto max-w-3xl px-4 py-20 text-center"><p className="text-slate-600">{error.message}</p><Link to="/lawyer-search" className="btn-primary mt-6">Back to search</Link></div>;

  const { lawyer, reviews } = data;
  const areaNames = Object.fromEntries((cats?.categories ?? []).flatMap((c) => c.areas).map((a) => [a.slug, a.name]));

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold">{lawyer.name}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><BadgeCheck className="h-4 w-4" aria-hidden />Verified</span>
        </div>
        <p className="mt-2 text-lg text-slate-600">{lawyer.headline}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <Stars value={lawyer.rating} count={lawyer.reviewCount} />
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden />{lawyer.city}, {lawyer.state}</span>
          <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" aria-hidden />{lawyer.experienceYears} years</span>
          <span className="inline-flex items-center gap-1"><Languages className="h-4 w-4" aria-hidden />{lawyer.languages.join(", ")}</span>
          {lawyer.hourlyRate != null && <span className="inline-flex items-center gap-1"><DollarSign className="h-4 w-4" aria-hidden />{lawyer.hourlyRate}/hr</span>}
        </div>

        <h2 className="mt-10 text-2xl font-bold">About</h2>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{lawyer.bio || "This lawyer has not added a biography yet."}</p>

        <h2 className="mt-10 text-2xl font-bold">Practice areas</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {lawyer.practiceAreas.map((s) => (
            <li key={s}><Link to={`/lawyer-search/${s}`} className="rounded-full border border-slate-200 px-3 py-1 text-sm hover:border-navy-500">{areaNames[s] ?? s}</Link></li>
          ))}
        </ul>

        <h2 className="mt-10 text-2xl font-bold">Reviews</h2>
        {reviews.length === 0 && <p className="mt-3 text-sm text-slate-600">No written reviews yet.</p>}
        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="card p-4">
              <div className="flex items-center justify-between"><span className="font-medium">{r.authorName}</span><Stars value={r.rating} /></div>
              {r.comment && <p className="mt-2 text-sm text-slate-700">{r.comment}</p>}
            </li>
          ))}
        </ul>
        {user?.role === "client" && <ReviewForm slug={slug} />}
      </div>

      <aside className="card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-bold">Contact {lawyer.name.split(" ")[0]}</h2>
        {lawyer.freeConsultation && <p className="mt-1 text-sm font-medium text-gold-600">Free initial consultation</p>}
        <div className="mt-4"><ContactForm slug={slug} /></div>
      </aside>
    </div>
  );
}
