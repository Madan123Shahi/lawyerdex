import { Link } from "react-router";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/legal-resources/${article.slug}`} className="card group flex h-full flex-col p-5 transition hover:shadow-md">
      <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">{article.category}</span>
      <h3 className="mt-2 text-lg font-semibold group-hover:text-navy-500">{article.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-600">{article.excerpt}</p>
      <span className="mt-4 text-sm font-medium text-navy-600">Read article →</span>
    </Link>
  );
}
