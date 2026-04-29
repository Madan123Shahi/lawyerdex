import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import LawyerCard from '../components/lawyers/LawyerCard';
import { Spinner, EmptyState, Alert } from '../components/common';
import { lawyersAPI } from '../api/apiClient';

// Mock data for demo (used when backend is not connected)
const MOCK_LAWYERS = Array.from({ length: 12 }, (_, i) => ({
  _id: `lawyer-${i + 1}`,
  name: ['James Anderson', 'Sarah Mitchell', 'Robert Chen', 'Emily Rodriguez', 'Michael Thompson', 'Jennifer Lee', 'David Williams', 'Amanda Foster', 'Christopher Davis', 'Patricia Martinez', 'Kevin Johnson', 'Rachel Brown'][i],
  category: ['Criminal Defense', 'Divorce & Family', 'Business Law', 'Immigration', 'Personal Injury', 'Estate Planning', 'Employment', 'Real Estate', 'Bankruptcy', 'Intellectual Property', 'Civil Rights', 'Tax Law'][i],
  practiceAreas: [['DUI/DWI', 'Drug Offenses', 'Assault'], ['Divorce', 'Child Custody', 'Alimony'], ['Corporate Law', 'Contracts', 'M&A']][i % 3],
  location: { city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5], state: ['NY', 'CA', 'IL', 'TX', 'AZ'][i % 5] },
  rating: (3.5 + (i % 15) * 0.1).toFixed(1) * 1,
  reviewCount: 20 + i * 7,
  experience: 3 + i * 2,
  isVerified: i % 3 !== 2,
  consultationFee: [150, 200, 250, 300, 0][i % 5],
  avatar: '',
}));

const CATEGORIES = [
  'All Categories', 'Accidents & Injuries', 'Bankruptcy & Debt', 'Business', 'Civil Rights',
  'Consumer Rights', 'Criminal Defense', 'Disability', 'Divorce & Family', 'Employment',
  'Estate Planning', 'Health', 'Immigration', 'Intellectual Property', 'Real Estate',
];

export default function LawyerSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lawyers, setLawyers] = useState(MOCK_LAWYERS);
  const [total, setTotal] = useState(MOCK_LAWYERS.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchLawyers();
  }, [category, sortBy, page]);

  const fetchLawyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, sortBy, order: 'desc' };
      if (query) params.q = query;
      if (location) params.location = location;
      if (category && category !== 'All Categories') params.category = category;
      const res = await lawyersAPI.getAll(params);
      setLawyers(res.data.lawyers);
      setTotal(res.data.total);
    } catch (err) {
      // Fall back to mock data on error (for demo purposes)
      setLawyers(MOCK_LAWYERS);
      setTotal(MOCK_LAWYERS.length);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query) params.q = query;
    if (location) params.location = location;
    if (category && category !== 'All Categories') params.category = category;
    setSearchParams(params);
    setPage(1);
    fetchLawyers();
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-primary-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-white mb-6">Find a Lawyer</h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Legal issue or lawyer name..."
                className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
              />
              {query && <button type="button" onClick={() => setQuery('')}><X className="w-4 h-4 text-gray-400" /></button>}
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 md:w-48">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or state..."
                className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white rounded-xl px-4 py-3 text-sm text-gray-700 outline-none md:w-56 cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c} value={c === 'All Categories' ? '' : c}>{c}</option>)}
            </select>
            <button type="submit" className="btn-gold rounded-xl whitespace-nowrap">
              Search Lawyers
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-primary-700">{total.toLocaleString()}</span> lawyers found
            {category ? ` in "${category}"` : ''}
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none text-gray-700 bg-white"
            >
              <option value="rating">Top Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : lawyers.length === 0 ? (
          <EmptyState title="No lawyers found" description="Try adjusting your search criteria or browse all categories." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {lawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${p === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
