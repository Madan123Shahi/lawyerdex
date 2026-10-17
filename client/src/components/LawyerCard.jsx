import { Link } from "react-router";
import { MapPin, BadgeCheck, Briefcase } from "lucide-react";
import Stars from "./Stars.jsx";

const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function LawyerCard({ lawyer }) {
  return (
    <article className="card flex flex-col gap-4 p-5 transition hover:shadow-md sm:flex-row">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-800 font-serif text-xl text-white" aria-hidden>
        {initials(lawyer.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">
            <Link to={`/lawyers/${lawyer.slug}`} className="hover:text-navy-500">{lawyer.name}</Link>
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">{lawyer.headline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600">
          <Stars value={lawyer.rating} count={lawyer.reviewCount} />
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden />{lawyer.city}, {lawyer.state}</span>
          <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" aria-hidden />{lawyer.experienceYears} yrs experience</span>
        </div>
      </div>
      <div className="flex items-center sm:flex-col sm:items-end sm:justify-between">
        {lawyer.freeConsultation && <span className="mr-3 text-xs font-medium text-gold-600 sm:mr-0">Free consultation</span>}
        <Link to={`/lawyers/${lawyer.slug}`} className="btn-primary">View profile</Link>
      </div>
    </article>
  );
}
