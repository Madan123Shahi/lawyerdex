import { Shield, Star, Clock, Users } from 'lucide-react';
import { Section } from '../common';

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified Professionals',
    desc: 'Every lawyer on our platform is thoroughly vetted and verified to ensure you connect with legitimate legal professionals.',
  },
  {
    icon: Star,
    title: 'Top 5% of Attorneys',
    desc: 'Our patented selection process is peer-influenced and research-driven, selecting the top 5% of attorneys to the LawyerDex list each year.',
  },
  {
    icon: Clock,
    title: 'Fast Matching',
    desc: 'Find and connect with the right lawyer quickly. Most clients are matched with qualified attorneys within 24 hours.',
  },
  {
    icon: Users,
    title: 'Peer Recognized',
    desc: 'LawyerDex is a rating service of outstanding lawyers who have a high degree of peer recognition and professional achievement.',
  },
];

export default function WhyLawyerDex() {
  return (
    <Section>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Why Choose Us</p>
          <h2 className="section-title">Why Lawyer Dex</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Lawyer Dex is a rating service of outstanding lawyers who have a high degree of peer recognition and professional achievement.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our patented attorney selection process is peer-influenced and research-driven, selecting the top 5% of attorneys to the Lawyer Dex list each year. Our directory features detailed profiles of top attorneys across the United States in a wide variety of legal practice areas — valuable in your search for an experienced attorney.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-700 text-sm mb-1">{title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
              alt="Legal professionals"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating card */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-gold fill-gold" />
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-primary-700">4.9/5</div>
              <div className="text-gray-500 text-xs">Average Lawyer Rating</div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-gold rounded-2xl shadow-xl p-4 text-white">
            <div className="font-display font-bold text-2xl">50K+</div>
            <div className="text-xs opacity-90">Verified Lawyers</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
