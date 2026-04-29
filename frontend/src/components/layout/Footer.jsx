import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Lawyer<span className="text-gold">Dex</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              We are dedicated to providing the best service to our customers. Connecting you with top-rated legal professionals across the United States.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/lawyer-search', label: 'Find a Lawyer' },
                { to: '/legal-resources', label: 'Legal Resources' },
                { to: '/contact-us', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-white text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-of-use', label: 'Terms of Use' },
                { to: '/refund-and-cancellation', label: 'Cancellations & Refunds' },
                { to: '/plans', label: 'Plans & Pricing' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white text-lg mb-4">Need Help?</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:contact@lawyerdex.com" className="hover:text-gold transition-colors">
                  contact@lawyerdex.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+18143008055" className="hover:text-gold transition-colors">
                  +1 (814) 300-8055
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>United States</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Lawyer Dex. All rights reserved.</p>
          <p>Powered by LawyerDex Team</p>
        </div>
      </div>
    </footer>
  );
}
