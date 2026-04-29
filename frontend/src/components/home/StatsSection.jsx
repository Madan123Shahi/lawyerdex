import { useEffect, useRef, useState } from 'react';
import { Section } from '../common';

const STATS = [
  { value: 98, suffix: '%', label: 'Client Satisfaction Rate' },
  { value: 95, suffix: '%', label: 'Successful Case Resolution Support' },
  { value: 99, suffix: '%', label: 'Lawyer Verification & Screening Score' },
  { value: 85, suffix: '%', label: 'Clients Matched Within 24 Hours' },
];

const COUNTS = [
  { value: 50000, suffix: '+', label: 'Verified Lawyers' },
  { value: 300, suffix: '+', label: 'Practice Areas' },
  { value: 500, suffix: '+', label: 'Cities Covered' },
  { value: 10000, suffix: '+', label: 'Legal Resources' },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
}

function CountCard({ value, suffix, label, started }) {
  const count = useCountUp(value, 1800, started);
  return (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl font-bold text-primary-600 mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-600 font-medium text-sm">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section bg="gray">
      <div className="text-center mb-14">
        <p className="text-gold font-semibold uppercase tracking-wider text-sm mb-2">Our Impact</p>
        <h2 className="section-title">Bringing the best lawyers of different categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Lawyers on LawyerDex often practice across multiple legal areas. The percentages below reflect how many listed attorneys actively handle cases in each of the most in-demand practice categories.
        </p>
      </div>

      {/* Percentage stats */}
      <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {STATS.map(({ value, suffix, label }) => (
          <div key={label} className="card p-6 text-center border border-primary-100">
            <CountCard value={value} suffix={suffix} label={label} started={visible} />
          </div>
        ))}
      </div>

      {/* Count stats */}
      <div className="bg-primary-700 rounded-3xl p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {COUNTS.map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-gold mb-1">
                {visible ? value.toLocaleString() : '0'}{suffix}
              </div>
              <div className="text-blue-200 font-medium text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
