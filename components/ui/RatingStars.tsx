import React from 'react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

export default function RatingStars({ rating, maxStars = 5, className = '' }: RatingStarsProps) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const fillPercent = Math.max(0, Math.min(1, rating - (i - 1))) * 100;

    stars.push(
      <div key={i} className="relative inline-block w-5 h-5 text-amber-400">
        {/* Background empty star */}
        <svg
          className="w-5 h-5 text-surface-subtle fill-current opacity-30"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        {/* Filled star foreground with clip width */}
        {fillPercent > 0 && (
          <div
            className="absolute top-0 left-0 overflow-hidden h-full"
            style={{ width: `${fillPercent}%` }}
          >
            <svg
              className="w-5 h-5 text-amber-400 fill-current drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating: ${rating} out of ${maxStars} stars`}>
      {stars}
    </div>
  );
}
