import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';

const ARTICLES = [
  { title: '"Romeo and Juliet" Laws: What They Are, How They Work, Controversies', excerpt: 'A "Romeo and Juliet" law is a legal provision in many jurisdictions designed to soften the criminal penalties for consensual activity between minors close in age.', category: 'Criminal Defense', readTime: 7, slug: 'romeo-and-juliet-laws', image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=640&q=80' },
  { title: 'Drug Charge Defense Attorney: Why You Need One and How They Can Help', excerpt: 'Facing a drug charge is a serious matter. Convictions can lead to heavy fines, loss of employment opportunities, and even lengthy prison sentences.', category: 'Criminal Defense', readTime: 6, slug: 'drug-charge-defense-attorney', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&q=80' },
  { title: 'Compensation Claim for Car Accident Injuries', excerpt: 'Car accidents are one of the leading causes of injury worldwide, leaving victims to cope with physical pain, financial stress, and emotional trauma.', category: 'Accidents & Injuries', readTime: 8, slug: 'compensation-claim-car-accident', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&q=80' },
  { title: 'Legitimate Reasons You Can Sue Your Landlord', excerpt: 'Landlord-tenant relationships are not always smooth. As a tenant, you have strong legal rights and may have grounds to file suit against your landlord.', category: 'Real Estate', readTime: 6, slug: 'reasons-to-sue-landlord', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=640&q=80' },
  { title: 'Lawsuit Against a Company: A Complete Guide for Consumers and Employees', excerpt: 'Taking legal action against a company can seem intimidating, but sometimes it is the only way to protect your rights as a consumer or employee.', category: 'Business', readTime: 10, slug: 'lawsuit-against-company', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&q=80' },
  { title: 'Personal Injury Lawyer: Everything You Need to Know Before Hiring One', excerpt: 'Accidents can happen at any time. When injuries occur due to someone else\'s negligence, victims may be entitled to financial compensation.', category: 'Accidents & Injuries', readTime: 9, slug: 'personal-injury-lawyer-guide', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&q=80' },
  { title: 'Car Accident Lawyers Charge: What You Need to Know Before Hiring', excerpt: 'Many victims turn to car accident lawyers for help, but one of the most common questions is: how much will this cost me?', category: 'Accidents & Injuries', readTime: 7, slug: 'car-accident-lawyers-charge', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=640&q=80' },
  { title: 'Business Litigation Lawyer: A Complete Guide for Entrepreneurs and Companies', excerpt: 'Running a business comes with opportunities, but it also brings risks. Disputes over contracts can quickly escalate into costly lawsuits.', category: 'Business', readTime: 10, slug: 'business-litigation-lawyer-guide', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=640&q=80' },
  { title: 'Driving Barefoot: Is It Legal, Safe, or Risky?', excerpt: 'Many drivers wonder whether driving without shoes is against the law. The answer depends on which state you are in.', category: 'Traffic', readTime: 4, slug: 'driving-barefoot-legal', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80' },
  { title: 'Navigating the Complexities of Brain Injury Law', excerpt: 'A brain injury can have devastating and long-lasting consequences. The legal landscape surrounding these injuries is intricate and requires specialized expertise.', category: 'Accidents & Injuries', readTime: 8, slug: 'brain-injury-law', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=640&q=80' },
];

const CATEGORIES = ['All', 'Accidents & Injuries', 'Business', 'Criminal Defense', 'Real Estate', 'Traffic', 'Employment', 'Immigration'];

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ARTICLES.filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-primary-800 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Knowledge Hub</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Free Legal Resources</h1>
          <p className="text-blue-200 text-lg mb-8">Learn more about your issue by reading helpful articles on a variety of legal topics.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search legal articles..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 outline-none shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No articles found for your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(({ title, excerpt, category, readTime, slug, image }) => (
              <Link key={slug} to={`/legal-resources/${slug}`} className="card group block">
                <div className="h-48 overflow-hidden">
                  <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{readTime} min</span>
                  </div>
                  <h2 className="font-display font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
