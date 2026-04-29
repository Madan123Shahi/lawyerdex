import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Section } from '../common';

// Static articles matching the real site
const ARTICLES = [
  {
    title: '"Romeo and Juliet" Laws: What They Are, How They Work, Controversies',
    excerpt: 'A "Romeo and Juliet" law is a legal provision in many jurisdictions designed to soften the criminal penalties for consensual activity between minors close in age.',
    category: 'Criminal Defense',
    readTime: 7,
    slug: 'romeo-and-juliet-laws',
    image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=640&q=80',
  },
  {
    title: 'Drug Charge Defense Attorney: Why You Need One and How They Can Help',
    excerpt: 'Facing a drug charge is a serious matter. Convictions can lead to heavy fines, loss of employment opportunities, driver\'s license suspension, probation, or even lengthy prison sentences.',
    category: 'Criminal Defense',
    readTime: 6,
    slug: 'drug-charge-defense-attorney',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&q=80',
  },
  {
    title: 'Compensation Claim for Car Accident Injuries',
    excerpt: 'Car accidents are one of the leading causes of injury worldwide, leaving victims to cope with physical pain, financial stress, and emotional trauma.',
    category: 'Accidents & Injuries',
    readTime: 8,
    slug: 'compensation-claim-car-accident',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&q=80',
  },
  {
    title: 'Legitimate Reasons You Can Sue Your Landlord',
    excerpt: 'Landlord-tenant relationships aren\'t always smooth. As a tenant, you\'re not powerless — you have strong legal rights and may have grounds to file suit.',
    category: 'Real Estate',
    readTime: 6,
    slug: 'reasons-to-sue-landlord',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=640&q=80',
  },
  {
    title: 'Personal Injury Lawyer: Everything You Need to Know Before Hiring One',
    excerpt: 'Accidents can happen at any time. When injuries occur due to someone else\'s negligence, victims may be entitled to compensation.',
    category: 'Accidents & Injuries',
    readTime: 9,
    slug: 'personal-injury-lawyer-guide',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&q=80',
  },
  {
    title: 'Business Litigation Lawyer: A Complete Guide for Entrepreneurs',
    excerpt: 'Running a business comes with opportunities, but it also brings risks. Disputes over contracts, partnerships, and intellectual property can quickly escalate.',
    category: 'Business',
    readTime: 10,
    slug: 'business-litigation-lawyer-guide',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&q=80',
  },
];

export default function LegalArticles() {
  return (
    <Section bg="gray">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Knowledge Hub</p>
          <h2 className="section-title mb-2">Explore our legal article resources</h2>
          <p className="text-gray-600 max-w-xl">
            Learn more about your issue by reading helpful articles on a variety of legal topics.
          </p>
        </div>
        <Link to="/legal-resources" className="btn-secondary whitespace-nowrap self-start md:self-auto flex items-center gap-2">
          See All Articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map(({ title, excerpt, category, readTime, slug, image }) => (
          <Link key={slug} to={`/legal-resources/${slug}`} className="card group overflow-hidden block">
            <div className="h-48 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {readTime} min read
                </span>
              </div>
              <h3 className="font-display font-semibold text-gray-800 text-base mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
