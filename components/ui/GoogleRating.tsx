'use client';

import React, { useEffect, useState } from 'react';
import RatingStars from './RatingStars';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
  profile_photo_url?: string;
}

interface GoogleReviewData {
  rating: number;
  user_ratings_total: number;
  reviews: Review[];
  source?: string;
}

const FALLBACK_RATING = 4.9;
const FALLBACK_COUNT = 142;

export default function GoogleRating() {
  const [data, setData] = useState<GoogleReviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/google-reviews')
      .then((res) => res.json())
      .then((resData: GoogleReviewData) => {
        if (isMounted) {
          setData(resData);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const rating = data?.rating ?? FALLBACK_RATING;
  const reviewCount = data?.user_ratings_total ?? FALLBACK_COUNT;
  const reviews: Review[] = data?.reviews || [];

  return (
    <div className="w-full space-y-8">
      {/* Rating Summary Header */}
      <div className="lx-liquid-glass rounded-2xl p-6 sm:p-8 border border-border-subtle/60 bg-surface-deep/60 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Google 'G' Logo Badge */}
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-2 shadow-lg backdrop-blur-md">
            <svg viewBox="0 0 24 24" className="w-7 h-7" aria-label="Google logo">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-3xl sm:text-4xl text-on-surface tracking-tight">
                {isLoading ? '4.9' : rating.toFixed(1)}
              </span>
              <RatingStars rating={rating} />
            </div>
            <p className="text-small text-on-surface-2 font-medium">
              Based on{' '}
              <span className="text-on-surface font-semibold">
                {reviewCount}+ authentic client reviews
              </span>{' '}
              on Google
            </p>
          </div>
        </div>

        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-full border border-accent/40 bg-accent/10 text-on-surface hover:bg-accent/20 transition-all duration-300 shadow-sm"
        >
          <span>Verify on Google</span>
          <svg
            className="w-3.5 h-3.5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* Real Reviews Cards Grid */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev: Review, idx: number) => (
            <div
              key={idx}
              className="lx-liquid-glass rounded-xl p-6 border border-border-subtle/40 bg-surface-deep/40 backdrop-blur-md flex flex-col justify-between hover:border-accent/30 transition-all duration-300 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RatingStars rating={rev.rating} />
                  {rev.relative_time_description && (
                    <span className="text-[11px] text-on-surface-muted">
                      {rev.relative_time_description}
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-2 leading-relaxed italic line-clamp-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle/30 pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold text-xs flex items-center justify-center">
                    {rev.author_name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-on-surface">
                    {rev.author_name}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
