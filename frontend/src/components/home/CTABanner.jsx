import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-primary-800 py-20">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-700 rounded-full opacity-50" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/10 rounded-full" />
      <div className="absolute top-1/2 right-1/4 w-40 h-40 border border-gold/20 rounded-full -translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-4">Get Started Today</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Find the Right Lawyer{' '}
          <span className="text-gold">for Your Case</span>
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of clients who found trusted legal representation through LawyerDex. Start your search today — it's free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/lawyer-search" className="btn-gold flex items-center justify-center gap-2 text-base">
            Find a Lawyer Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/legal-resources" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-700 flex items-center justify-center gap-2 text-base">
            Read Legal Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
