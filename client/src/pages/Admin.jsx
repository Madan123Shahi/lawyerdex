import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import Spinner from "../components/Spinner.jsx";

function Row({ lawyer, status }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const decide = useMutation({
    mutationFn: (next) => api(`/admin/lawyers/${lawyer._id}/verification`, { method: "PATCH", body: { status: next, note } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-lawyers"] }),
  });
  return (
    <li className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{lawyer.name}</p>
          <p className="text-sm text-slate-600">{lawyer.city || "—"}, {lawyer.state || "—"} · Bar #{lawyer.barNumber || "not provided"}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{lawyer.headline}</p>
        </div>
        <div className="w-full space-y-2 sm:w-72">
          <input className="input" placeholder="Optional note to the lawyer" value={note} onChange={(e) => setNote(e.target.value)} aria-label={`Note for ${lawyer.name}`} />
          <div className="flex gap-2">
            {status !== "approved" && <button className="btn-primary flex-1" disabled={decide.isPending} onClick={() => decide.mutate("approved")}>Approve</button>}
            {status !== "rejected" && <button className="btn-outline flex-1" disabled={decide.isPending} onClick={() => decide.mutate("rejected")}>Reject</button>}
          </div>
          {decide.isError && <p className="field-error">{decide.error.message}</p>}
        </div>
      </div>
    </li>
  );
}

export default function Admin() {
  const [status, setStatus] = useState("pending");
  const { data, isLoading } = useQuery({ queryKey: ["admin-lawyers", status], queryFn: () => api(`/admin/lawyers?status=${status}`) });
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Lawyer verification</h1>
      <div role="tablist" className="mt-6 flex gap-2 border-b border-slate-200">
        {["pending", "approved", "rejected"].map((s) => (
          <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize ${status === s ? "border-navy-700 text-navy-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{s}</button>
        ))}
      </div>
      <div className="mt-8">
        {isLoading ? <Spinner /> : data.items.length === 0 ? <p className="card p-8 text-center text-slate-600">Nothing here.</p> : (
          <ul className="space-y-4">{data.items.map((l) => <Row key={l._id} lawyer={l} status={status} />)}</ul>
        )}
      </div>
    </div>
  );
}
