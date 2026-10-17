import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import ArticleCard from "../components/ArticleCard.jsx";
import Spinner from "../components/Spinner.jsx";

export default function Resources() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["articles", page],
    queryFn: () => api(`/articles?page=${page}&limit=9`),
    placeholderData: keepPreviousData,
  });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Free legal resources</h1>
      <p className="mt-2 text-slate-600">Plain-language guides to common legal questions.</p>
      {isLoading ? <Spinner /> : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{data.items.map((a) => <ArticleCard key={a._id} article={a} />)}</div>
          {data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="text-sm text-slate-600">Page {data.page} of {data.pages}</span>
              <button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
