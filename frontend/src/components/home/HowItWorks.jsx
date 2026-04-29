import { Search, UserCheck, MessageSquare, Briefcase } from 'lucide-react';
import { Section } from '../common';

const STEPS = [
  {
    icon: Search,
    title: 'Search by Legal Need',
    desc: 'Browse lawyers by practice area, location, or case type to find professionals who match your legal requirements.',
    step: '01',
  },
  {
    icon: UserCheck,
    title: 'Compare Verified Lawyers',
    desc: 'View lawyer profiles, experience, reviews, and ratings to confidently compare and shortlist the right attorney.',
    step: '02',
  },
  {
    icon: MessageSquare,
    title: 'Connect & Get Consultation',
    desc: 'Contact lawyers directly through LawyerDex to discuss your case and understand your legal options.',
    step: '03',
  },
  {
    icon: Briefcase,
    title: 'Hire with Confidence',
    desc: "Choose the lawyer that best fits your needs and move forward knowing you're working with a trusted professional.",
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <Section bg="gray">
      <div className="text-center mb-14">
        <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Simple Process</p>
        <h2 className="section-title">How LawyerDex Works</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Finding the right lawyer doesn't have to be complicated. LawyerDex simplifies the process so you can connect with trusted legal professionals in just a few steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map(({ icon: Icon, title, desc, step }, i) => (
          <div key={i} className="relative group">
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent z-0 -translate-y-1/2" />
            )}
            <div className="card p-6 relative z-10 hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-4 right-4 text-5xl font-display font-bold text-primary-50 select-none">
                {step}
              </div>
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold transition-colors duration-300">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-primary-700 text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
