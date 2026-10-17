import { Star } from "lucide-react";

export default function Stars({ value = 0, count, size = "h-4 w-4" }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <Star className={`${size} fill-gold-500 text-gold-500`} aria-hidden />
      <span className="text-sm font-semibold text-slate-800">{value ? value.toFixed(1) : "New"}</span>
      {count > 0 && <span className="text-sm text-slate-500">({count})</span>}
    </span>
  );
}
