// Spinner
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  );
}

// Star Rating
export function StarRating({ rating = 0, max = 5, size = 'sm' }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}>★</span>
      ))}
      <span className="ml-1 text-gray-500 text-xs">({rating.toFixed(1)})</span>
    </div>
  );
}

// Badge
export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-primary-100 text-primary-700',
    gold: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

// Alert
export function Alert({ type = 'error', message, errors = null }) {
  const styles = {
    error: 'bg-red-50 border-red-300 text-red-700',
    success: 'bg-green-50 border-green-300 text-green-700',
    info: 'bg-blue-50 border-blue-300 text-blue-700',
  };
  if (!message) return null;
  return (
    <div className={`border rounded-lg p-4 text-sm ${styles[type]}`}>
      <p className="font-medium">{message}</p>
      {errors && errors.length > 0 && (
        <ul className="mt-2 list-disc list-inside space-y-1">
          {errors.map((e, i) => (
            <li key={i}>{e.field ? `${e.field}: ${e.message}` : e.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Section wrapper
export function Section({ children, className = '', bg = 'white' }) {
  const bgs = { white: 'bg-white', gray: 'bg-gray-50', dark: 'bg-primary-900' };
  return (
    <section className={`py-16 md:py-24 ${bgs[bg]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// Page loader
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner size="lg" />
    </div>
  );
}

// Empty state
export function EmptyState({ title = 'No results found', description = 'Try adjusting your search.', icon = '🔍' }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
