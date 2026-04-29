import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Star, Briefcase, BadgeCheck, ArrowLeft, GraduationCap, Globe } from 'lucide-react';
import { PageLoader, Alert, Badge } from '../components/common';
import { lawyersAPI } from '../api/apiClient';

// Mock single lawyer for demo
const MOCK_LAWYER = {
  _id: 'lawyer-1',
  name: 'James Anderson',
  email: 'james.anderson@lawyerdex.com',
  phone: '+1 (555) 234-5678',
  avatar: '',
  bio: 'James Anderson is a seasoned criminal defense attorney with over 15 years of experience representing clients in federal and state courts. He has a proven track record of successfully defending clients against serious charges including DUI, drug offenses, assault, and white-collar crimes. James is known for his meticulous attention to detail, aggressive representation, and genuine care for his clients.',
  category: 'Criminal Defense',
  practiceAreas: ['DUI/DWI', 'Drug Offenses', 'Assault & Battery', 'White Collar Crimes', 'Federal Crimes', 'Traffic Violations'],
  location: { city: 'New York', state: 'NY', country: 'USA' },
  rating: 4.8,
  reviewCount: 127,
  experience: 15,
  isVerified: true,
  isFeatured: true,
  consultationFee: 250,
  languages: ['English', 'Spanish'],
  education: [
    { degree: 'Juris Doctor (J.D.)', institution: 'Harvard Law School', year: 2008 },
    { degree: 'B.A. Political Science', institution: 'Columbia University', year: 2005 },
  ],
  reviews: [
    { _id: 'r1', name: 'Michael T.', rating: 5, comment: 'James was incredibly professional and got my case dismissed. Highly recommend!', createdAt: '2024-01-15' },
    { _id: 'r2', name: 'Sarah L.', rating: 5, comment: 'Excellent attorney. He walked me through every step and kept me informed throughout the process.', createdAt: '2024-02-20' },
    { _id: 'r3', name: 'David K.', rating: 4, comment: 'Very knowledgeable and responsive. Got a great outcome for my DUI case.', createdAt: '2024-03-05' },
  ],
};

export default function LawyerDetailPage() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await lawyersAPI.getById(id);
        setLawyer(res.data.lawyer);
      } catch {
        setLawyer(MOCK_LAWYER); // fallback for demo
      } finally {
        setLoading(false);
      }
    };
    fetchLawyer();
  }, [id]);

  if (loading) return <div className="pt-16"><PageLoader /></div>;

  const l = lawyer;
  const avatarUrl = l.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=1a3c6e&color=fff&size=200`;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to="/lawyer-search" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Profile card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-br from-primary-700 to-primary-900 p-6 text-center">
                <div className="relative inline-block mb-3">
                  <img src={avatarUrl} alt={l.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 mx-auto" />
                  {l.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h1 className="font-display font-bold text-xl text-white">{l.name}</h1>
                <p className="text-blue-200 text-sm mt-1">{l.category}</p>
                {l.location?.city && (
                  <p className="text-blue-300 text-xs flex items-center justify-center gap-1 mt-2">
                    <MapPin className="w-3 h-3" /> {l.location.city}, {l.location.state}
                  </p>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(l.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{l.rating} ({l.reviewCount})</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="font-display font-bold text-xl text-primary-700">{l.experience}</div>
                    <div className="text-xs text-gray-500">Years Experience</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="font-display font-bold text-xl text-primary-700">{l.reviewCount}</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                </div>

                {/* Fee */}
                {l.consultationFee > 0 && (
                  <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="font-bold text-green-700">${l.consultationFee}/hr</span>
                  </div>
                )}

                {/* Contact */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      <Mail className="w-4 h-4 text-primary-400" /> {l.email}
                    </a>
                  )}
                  {l.phone && (
                    <a href={`tel:${l.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                      <Phone className="w-4 h-4 text-primary-400" /> {l.phone}
                    </a>
                  )}
                </div>

                <button className="btn-primary w-full text-center">Schedule Consultation</button>
              </div>
            </div>

            {/* Languages */}
            {l.languages?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-5">
                <h3 className="font-display font-semibold text-primary-700 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {l.languages.map((lang) => (
                    <Badge key={lang} color="blue">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="font-display font-bold text-primary-700 text-xl mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{l.bio}</p>
            </div>

            {/* Practice Areas */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="font-display font-bold text-primary-700 text-xl mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Practice Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {l.practiceAreas?.map((area) => (
                  <span key={area} className="bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            {l.education?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-display font-bold text-primary-700 text-xl mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Education
                </h2>
                <div className="space-y-4">
                  {l.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">{edu.degree}</p>
                        <p className="text-gray-500 text-sm">{edu.institution} · {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {l.reviews?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="font-display font-bold text-primary-700 text-xl mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Client Reviews
                </h2>
                <div className="space-y-5">
                  {l.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                            {review.name[0]}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{review.name}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      <p className="text-gray-400 text-xs mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
