import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

const ARTICLE_CONTENT = {
  'romeo-and-juliet-laws': {
    title: '"Romeo and Juliet" Laws: What They Are, How They Work, Controversies',
    category: 'Criminal Defense',
    readTime: 7,
    author: 'LawyerDex Team',
    date: 'May 11, 2025',
    image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1200&q=80',
    content: `
      <h2>What Are "Romeo and Juliet" Laws?</h2>
      <p>A "Romeo and Juliet" law (also called a close-in-age exemption or age-gap provision) is a legal provision in many jurisdictions designed to soften the criminal penalties for consensual romantic or sexual activity between two people who are close in age, particularly when one or both are minors.</p>
      <p>These laws exist because the criminal justice system recognizes that there is a significant difference between an adult predator targeting a child and two teenagers in a consensual relationship. Without such provisions, a 17-year-old could face serious criminal charges for a relationship with a 15-year-old peer.</p>
      <h2>How Do They Work?</h2>
      <p>Each state has its own version of these laws, with varying age gaps and conditions. Typically, a close-in-age exemption applies when the age difference between the two parties is within a specified range, commonly 2 to 5 years. The law may reduce a charge from a felony to a misdemeanor or eliminate criminal liability entirely.</p>
      <h2>Key Variations by State</h2>
      <p>States differ significantly in how they implement these protections. Some states require both parties to be within 3 years of age, others allow up to 5 years. Some states apply the exemption regardless of the ages involved, while others require the younger party to be above a certain age threshold.</p>
      <h2>Controversies</h2>
      <p>Despite their intent, these laws remain controversial. Critics argue they can sometimes protect genuinely exploitative behavior, particularly when older teens take advantage of younger ones. Supporters argue they prevent the over-criminalization of normal adolescent behavior and protect young people from lifetime registration as sex offenders for consensual relationships.</p>
      <h2>When to Consult an Attorney</h2>
      <p>If you or someone you know is facing charges related to a consensual relationship between minors or young adults, it is critical to consult with an experienced criminal defense attorney immediately. The application of these laws is complex and highly fact-specific.</p>
    `,
  },
};

const DEFAULT_CONTENT = {
  title: 'Legal Resource Article',
  category: 'General',
  readTime: 5,
  author: 'LawyerDex Team',
  date: 'January 2025',
  image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80',
  content: '<p>This is a detailed legal resource article. Content will be loaded from the database when the backend is connected.</p><p>Our team of legal experts creates comprehensive articles covering all major areas of law to help you understand your rights and options.</p>',
};

export default function ResourceDetailPage() {
  const { slug } = useParams();
  const article = ARTICLE_CONTENT[slug] || { ...DEFAULT_CONTENT, title: slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link to="/legal-resources" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </div>
      </div>

      {/* Hero image */}
      <div className="h-64 md:h-80 overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <span className="bg-primary-100 text-primary-700 font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> {article.category}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime} min read</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
              <span>{article.date}</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-800 mb-6 leading-tight">{article.title}</h1>

            {/* Article content */}
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary-700 [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-primary-600 [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* CTA */}
            <div className="mt-10 p-6 bg-primary-50 rounded-2xl border border-primary-100">
              <h3 className="font-display font-bold text-primary-700 text-lg mb-2">Need Legal Help?</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with a verified attorney who specializes in {article.category} today.</p>
              <Link to={`/lawyer-search?category=${encodeURIComponent(article.category)}`} className="btn-primary inline-block">
                Find a {article.category} Lawyer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
