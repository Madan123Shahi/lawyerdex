import { useNavigate } from 'react-router-dom';
import { Section } from '../common';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Accidents & Injuries',
    desc: 'Car accidents, workplace injuries, medical malpractice, slip and falls, and wrongful death cases.',
    emoji: '⚖️',
    subcategories: ['Car Accident', 'Brain Injury', 'Birth Injury', 'Construction Accident'],
    slug: 'accidents-injuries',
  },
  {
    name: 'Bankruptcy & Debt',
    desc: 'Chapter 7, Chapter 11, and Chapter 13 bankruptcy filings for individuals and businesses.',
    emoji: '💼',
    subcategories: ['Bankruptcy', 'Collections', 'Credit Repair', 'Creditor Debtor Rights'],
    slug: 'bankruptcy-debt',
  },
  {
    name: 'Business Law',
    desc: 'Formation, contracts, compliance, mergers, acquisitions, and dispute resolution.',
    emoji: '🏢',
    subcategories: ['Business & Corporate', 'Business Litigation', 'Banking', 'Antitrust'],
    slug: 'business',
  },
  {
    name: 'Criminal Defense',
    desc: 'Defense for DUI, drug offenses, theft, assault, and federal crimes.',
    emoji: '🛡️',
    subcategories: ['Criminal Defense', 'DUI/DWI', 'Drug Violations', 'Traffic Violations'],
    slug: 'criminal-defense',
  },
  {
    name: 'Divorce & Family',
    desc: 'Divorce, child custody, child support, alimony, and adoption cases.',
    emoji: '👨‍👩‍👧',
    subcategories: ['Divorce', 'Child Support', 'Custody & Visitation', 'Family Law'],
    slug: 'divorce-family',
  },
  {
    name: 'Employment',
    desc: 'Wrongful termination, discrimination, harassment, and wage violations.',
    emoji: '👔',
    subcategories: ['Employment Law', 'Workers Compensation', 'Sexual Harassment', 'Whistleblower'],
    slug: 'employment',
  },
  {
    name: 'Estate Planning',
    desc: 'Wills, trusts, powers of attorney, and probate guidance.',
    emoji: '📜',
    subcategories: ['Estate Planning', 'Trusts', 'Wills', 'Probate'],
    slug: 'estate-planning',
  },
  {
    name: 'Immigration',
    desc: 'Visas, green cards, citizenship, asylum, and deportation defense.',
    emoji: '🌍',
    subcategories: ['Immigration', 'Asylum', 'Green Card', 'Citizenship'],
    slug: 'immigration',
  },
  {
    name: 'Intellectual Property',
    desc: 'Patents, trademarks, copyrights, and trade secrets protection.',
    emoji: '💡',
    subcategories: ['Patents', 'Trademarks', 'IP Litigation', 'Copyright'],
    slug: 'intellectual-property',
  },
  {
    name: 'Real Estate',
    desc: 'Property transactions, leasing, zoning, land use, and real estate disputes.',
    emoji: '🏠',
    subcategories: ['Real Estate', 'Foreclosure', 'Landlord & Tenant', 'Zoning'],
    slug: 'real-estate',
  },
  {
    name: 'Civil Rights',
    desc: 'Protection against discrimination, police misconduct, and constitutional violations.',
    emoji: '✊',
    subcategories: ['Civil Rights', 'Constitutional Law', 'Discrimination'],
    slug: 'civil-rights',
  },
  {
    name: 'Health Law',
    desc: 'Healthcare compliance, medical licensing, patient rights, and HIPAA regulations.',
    emoji: '🏥',
    subcategories: ['Health Care', 'Elder Law', 'Nursing Home', 'HIPAA'],
    slug: 'health',
  },
];

export default function PracticeCategories() {
  const navigate = useNavigate();

  return (
    <Section>
      <div className="text-center mb-14">
        <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Practice Areas</p>
        <h2 className="section-title">What is your legal issue?</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Browse by practice area to find the right legal expert for your specific situation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(({ name, desc, emoji, subcategories, slug }) => (
          <div
            key={slug}
            className="card border border-gray-100 p-6 cursor-pointer group hover:border-primary-300 transition-all duration-300"
            onClick={() => navigate(`/lawyer-search?category=${encodeURIComponent(name)}`)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-3xl w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors flex-shrink-0">
                {emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-primary-700 text-lg group-hover:text-primary-600 transition-colors">
                  {name}
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {subcategories.map((sub) => (
                <span key={sub} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {sub}
                </span>
              ))}
            </div>
            <div className="flex items-center text-primary-600 text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
              View Lawyers <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
