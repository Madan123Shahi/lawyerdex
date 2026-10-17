import { useParams, useSearchParams, Link } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api, buildQuery } from "../lib/api.js";
import LawyerCard from "../components/LawyerCard.jsx";
import Spinner from "../components/Spinner.jsx";

export default function LawyerSearch() {
  const { area } = useParams();
  const [sp, setSp] = useSearchParams();
  const filters = {
    q: sp.get("q") ?? "",
    city: sp.get("city") ?? "",
    state: sp.get("state") ?? "",
    minRating: sp.get("minRating") ?? "",
    sort: sp.get("sort") ?? "rating",
    page: Number(sp.get("page") ?? 1),
  };

  const { data: cats } = useQuery({ queryKey: ["categories"], queryFn: () => api("/categories") });
  const areaName = cats?.categories.flatMap((c) => c.areas).find((a) => a.slug === area)?.name;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["lawyers", area, filters],
    queryFn: () => api(`/lawyers${buildQuery({ ...filters, practiceArea: area, page: filters.page })}`),
    placeholderData: keepPreviousData,
  });

  function update(key, value) {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    setSp(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{areaName ? `${areaName} lawyers` : "Find a lawyer"}</h1>
      {area && <p className="mt-1 text-sm text-slate-600"><Link to="/lawyer-search" className="text-navy-600 hover:underline">Clear practice area</Link></p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit space-y-4 p-5" aria-label="Filters">
          <div>
            <label className="label" htmlFor="q">Keyword</label>
            <input id="q" className="input" defaultValue={filters.q} onKeyDown={(e) => e.key === "Enter" && update("q", e.currentTarget.value.trim())} onBlur={(e) => e.currentTarget.value.trim() !== filters.q && update("q", e.currentTarget.value.trim())} placeholder="Name or topic" />
          </div>
          <div>
            <label className="label" htmlFor="city">City</label>
            <input id="city" className="input" defaultValue={filters.city} onBlur={(e) => e.currentTarget.value.trim() !== filters.city && update("city", e.currentTarget.value.trim())} />
          </div>
          <div>
            <label className="label" htmlFor="state">State (2 letters)</label>
            <input id="state" className="input uppercase" maxLength={2} defaultValue={filters.state} onBlur={(e) => e.currentTarget.value.trim() !== filters.state && update("state", e.currentTarget.value.trim())} />
          </div>
          <div>
            <label className="label" htmlFor="rating">Minimum rating</label>
            <select id="rating" className="input" value={filters.minRating} onChange={(e) => update("minRating", e.target.value)}>
              <option value="">Any</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="sort">Sort by</label>
            <select id="sort" className="input" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
              <option value="rating">Top rated</option>
              <option value="experience">Most experienced</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </aside>

        <section aria-live="polite" className={isFetching ? "opacity-70 transition" : "transition"}>
          {isLoading && <Spinner label="Searching…" />}
          {isError && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error.message}</p>}
          {data && (
            <>
              <p className="mb-4 text-sm text-slate-600">{data.total} {data.total === 1 ? "lawyer" : "lawyers"} found</p>
              <div className="space-y-4">{data.items.map((l) => <LawyerCard key={l._id} lawyer={l} />)}</div>
              {data.items.length === 0 && <p className="card p-8 text-center text-slate-600">No lawyers match these filters yet. Try broadening your search.</p>}
              {data.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button className="btn-outline" disabled={data.page <= 1} onClick={() => update("page", String(data.page - 1))}>Previous</button>
                  <span className="text-sm text-slate-600">Page {data.page} of {data.pages}</span>
                  <button className="btn-outline" disabled={data.page >= data.pages} onClick={() => update("page", String(data.page + 1))}>Next</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
