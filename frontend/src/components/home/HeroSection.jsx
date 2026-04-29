import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  'Accidents & Injuries', 'Bankruptcy & Debt', 'Business', 'Civil Rights',
  'Criminal Defense', 'Divorce & Family', 'Employment', 'Estate Planning',
  'Immigration', 'Intellectual Property', 'Real Estate',
];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    navigate(`/lawyer-search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80')`,
        }}
      />
      <div className="hero-gradient absolute inset-0" />

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold opacity-60" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          Top-Rated Legal Professionals
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Lawyer{' '}
          <span className="text-gold relative">
            Dex
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
              <path d="M0 6 Q100 0 200 6" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-3 font-light">
          Search Top Lawyers &amp; Attorneys Near You
        </p>
        <p className="text-blue-200/80 mb-10 max-w-xl mx-auto">
          Connect with verified legal professionals across every practice area in the United States.
        </p>

        {/* Search box */}
        <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Legal issue, practice area, or lawyer name..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
            />
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 md:w-48">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
            />
          </div>
          <button type="submit" className="btn-gold whitespace-nowrap rounded-xl">
            Find a Lawyer
          </button>
        </form>

        {/* Quick category pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/lawyer-search?category=${encodeURIComponent(cat)}`)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 scroll-indicator">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
