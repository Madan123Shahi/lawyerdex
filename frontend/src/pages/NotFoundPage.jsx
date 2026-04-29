import { Link } from 'react-router-dom';
import { Scale, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scale className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="font-display text-8xl font-bold text-primary-700 mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/lawyer-search" className="btn-secondary flex items-center justify-center gap-2">
            Find a Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}
