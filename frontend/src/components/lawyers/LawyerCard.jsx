import { Link } from 'react-router-dom';
import { MapPin, Star, Briefcase, BadgeCheck } from 'lucide-react';

export default function LawyerCard({ lawyer }) {
  const {
    _id, name, avatar, category, practiceAreas = [],
    location, rating, reviewCount, experience, isVerified, consultationFee,
  } = lawyer;

  return (
    <div className="card border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a3c6e&color=fff&size=80`}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <BadgeCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-primary-700 text-lg truncate">{name}</h3>
            <p className="text-primary-500 text-sm font-medium truncate">{category}</p>
            {location?.city && (
              <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {location.city}{location.state ? `, ${location.state}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
          ))}
          <span className="text-sm font-semibold text-gray-700 ml-1">{rating?.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {practiceAreas.slice(0, 3).map((area) => (
            <span key={area} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">
              {area}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            {experience} yrs experience
          </div>
          {consultationFee > 0 && (
            <span className="text-xs font-semibold text-green-600">
              ${consultationFee}/hr
            </span>
          )}
        </div>
      </div>
      <Link
        to={`/lawyers/${_id}`}
        className="block bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white text-center text-sm font-semibold py-3 transition-colors duration-200"
      >
        View Profile
      </Link>
    </div>
  );
}
