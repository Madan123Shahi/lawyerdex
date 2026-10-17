import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../lib/api.js";
import Spinner from "../components/Spinner.jsx";

const schema = z.object({
  name: z.string().trim().min(2, "Required"),
  headline: z.string().trim().max(160),
  bio: z.string().trim().max(4000),
  practiceAreas: z.array(z.string()).max(12, "Choose up to 12 areas"),
  city: z.string().trim().max(80),
  state: z.string().trim().regex(/^([A-Za-z]{2})?$/, "Use a 2-letter code"),
  barNumber: z.string().trim().max(40),
  experienceYears: z.number().int().min(0).max(80),
  languagesText: z.string().max(200),
  hourlyRate: z.number().min(0).nullable(),
  freeConsultation: z.boolean(),
});

const statusUi = {
  pending: { icon: Clock, cls: "bg-amber-50 text-amber-800", text: "Your profile is awaiting admin review. It becomes public once approved." },
  approved: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-800", text: "Your profile is verified and visible in search." },
  rejected: { icon: XCircle, cls: "bg-red-50 text-red-800", text: "Your profile was not approved. Update your details and save to request a new review." },
};

function ProfileTab() {
  const qc = useQueryClient();
  const { data: p, isLoading } = useQuery({ queryKey: ["my-profile"], queryFn: async () => (await api("/lawyers/me/profile")).profile });
  const { data: cats } = useQuery({ queryKey: ["categories"], queryFn: () => api("/categories") });
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (p) reset({ ...p, languagesText: p.languages.join(", "), hourlyRate: p.hourlyRate ?? null });
  }, [p, reset]);

  const save = useMutation({
    mutationFn: ({ languagesText, ...v }) =>
      api("/lawyers/me/profile", {
        method: "PUT",
        body: { ...v, languages: languagesText.split(",").map((s) => s.trim()).filter(Boolean) },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  if (isLoading) return <Spinner />;
  const ui = statusUi[p.verificationStatus];
  const Icon = ui.icon;

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v))} className="space-y-6" noValidate>
      <div className={`flex items-start gap-3 rounded-xl p-4 text-sm ${ui.cls}`}>
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div><p>{ui.text}</p>{p.verificationNote && <p className="mt-1 font-medium">Note from admin: {p.verificationNote}</p>}</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Full name</label><input id="name" className="input" {...register("name")} />{errors.name && <p className="field-error">{errors.name.message}</p>}</div>
        <div><label className="label" htmlFor="headline">Headline</label><input id="headline" className="input" {...register("headline")} /></div>
        <div><label className="label" htmlFor="city">City</label><input id="city" className="input" {...register("city")} /></div>
        <div><label className="label" htmlFor="state">State (2 letters)</label><input id="state" maxLength={2} className="input uppercase" {...register("state")} />{errors.state && <p className="field-error">{errors.state.message}</p>}</div>
        <div><label className="label" htmlFor="bar">Bar number</label><input id="bar" className="input" {...register("barNumber")} /><p className="mt-1 text-xs text-slate-500">Changing bar number or state sends your profile back for review.</p></div>
        <div><label className="label" htmlFor="exp">Years of experience</label><input id="exp" type="number" min={0} className="input" {...register("experienceYears", { setValueAs: (v) => (v === "" ? 0 : Number(v)) })} /></div>
        <div><label className="label" htmlFor="rate">Hourly rate (USD)</label><input id="rate" type="number" min={0} className="input" {...register("hourlyRate", { setValueAs: (v) => (v === "" || v == null ? null : Number(v)) })} /></div>
        <div><label className="label" htmlFor="langs">Languages (comma separated)</label><input id="langs" className="input" {...register("languagesText")} /></div>
      </div>

      <div><label className="label" htmlFor="bio">Biography</label><textarea id="bio" rows={6} className="input" {...register("bio")} /></div>

      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("freeConsultation")} /> I offer a free initial consultation</label>

      <fieldset>
        <legend className="label">Practice areas</legend>
        {errors.practiceAreas && <p className="field-error">{errors.practiceAreas.message}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {cats?.categories.map((c) => (
            <div key={c._id}>
              <p className="text-sm font-semibold">{c.name}</p>
              <div className="mt-1 space-y-1">
                {c.areas.map((a) => (
                  <label key={a.slug} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" value={a.slug} {...register("practiceAreas")} /> {a.name}</label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {save.isError && <p role="alert" className="field-error">{save.error.message}</p>}
      {save.isSuccess && !isDirty && <p role="status" className="text-sm text-emerald-700">Profile saved.</p>}
      <button className="btn-primary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</button>
    </form>
  );
}

function InboxTab() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["inbox"], queryFn: () => api("/consultations/mine") });
  const setStatus = useMutation({
    mutationFn: ({ id, status }) => api(`/consultations/${id}/status`, { method: "PATCH", body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inbox"] }),
  });
  if (isLoading) return <Spinner />;
  if (!data.items.length) return <p className="card p-8 text-center text-slate-600">No consultation requests yet.</p>;
  return (
    <ul className="space-y-4">
      {data.items.map((c) => (
        <li key={c._id} className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">{c.name} <span className="font-normal text-slate-500">· {c.email}{c.phone && ` · ${c.phone}`}</span></p>
            <select aria-label={`Status for ${c.name}`} className="input !w-auto !py-1.5" value={c.status} onChange={(e) => setStatus.mutate({ id: c._id, status: e.target.value })}>
              <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
            </select>
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{c.message}</p>
          <p className="mt-2 text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("profile");
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Lawyer dashboard</h1>
      <div role="tablist" className="mt-6 flex gap-2 border-b border-slate-200">
        {[["profile", "Profile"], ["inbox", "Consultation requests"]].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${tab === id ? "border-navy-700 text-navy-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{label}</button>
        ))}
      </div>
      <div className="mt-8" role="tabpanel">{tab === "profile" ? <ProfileTab /> : <InboxTab />}</div>
    </div>
  );
}
