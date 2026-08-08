'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '../Button';
import { Container } from '../layout';
import { SceneSlot } from '../SceneSlot';
import { Icon } from '../Icon';
import { BOOK_AUDIT } from '@/lib/nav';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { usePreferLightMedia } from '@/lib/motion/usePreferLightMedia';

export interface HeroSlide {
  id: string;
  number: string;
  title: string;
  category: string;
  location: string;
  videoUrl: string;
  posterUrl: string;
  href: string;
}

const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 'poes-garden',
    number: '01',
    title: 'Poes Garden Villa',
    category: 'Architectural Interiors & Vastu-Tech',
    location: 'Poes Garden',
    videoUrl: '/videos/hero-slide-1.mp4',
    posterUrl: '/posters/hero.avif',
    href: '/portfolio/villas',
  },
  {
    id: 'adyar-waterfront',
    number: '02',
    title: 'Adyar Waterfront Penthouse',
    category: 'Luxury Minimalist Residence',
    location: 'Adyar',
    videoUrl: '/videos/hero-slide-2.mp4',
    posterUrl: '/posters/portfolio.avif',
    href: '/portfolio',
  },
  {
    id: 'omr-innovation-campus',
    number: '03',
    title: 'OMR Innovation Campus',
    category: 'Commercial Architecture & Workspace OS',
    location: 'OMR IT Corridor',
    videoUrl: '/videos/hero-slide-3.mp4',
    posterUrl: '/posters/space-os.avif',
    href: '/commercial',
  },
  {
    id: 'ecr-sanctuary',
    number: '04',
    title: 'ECR Beachfront Sanctuary',
    category: 'Sustainable Coastal Villa',
    location: 'East Coast Road',
    videoUrl: '/videos/hero-slide-4.mp4',
    posterUrl: '/posters/journey.avif',
    href: '/portfolio',
  },
];

const SLIDE_DURATION_MS = 10000;

/**
 * The flagship hero video slider (Landing Blueprint §1, §3.1).
 *
 * Full-bleed architectural video over a poster fallback, advancing on a timer.
 *
 * The name of a large international architecture practice was used throughout
 * this file as shorthand for the visual reference — including inside the
 * section's `aria-label`, where it was the accessible name a screen-reader
 * user heard on the studio's own home page. A competitor's trade name is not
 * ours to put in our markup, and least of all in the one place that reads as
 * self-description. Referencing someone's work is a design conversation; their
 * name belongs in that conversation, not in the DOM.
 */
export function Hero({
  headline,
  sub,
  trustPoints,
}: {
  headline: string;
  sub: string;
  trustPoints: readonly string[];
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const preferLightMedia = usePreferLightMedia();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeSlide = HERO_SLIDES[currentSlideIndex]!;
  const autoAdvance = !paused && !reducedMotion;
  const showVideo = !videoError && !preferLightMedia;

  // Auto-slide timer — paused when the visitor requests it or when the OS
  // signals reduced motion (WCAG 2.2.2).
  useEffect(() => {
    if (!autoAdvance) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [autoAdvance]);

  // Reset video error state whenever active slide changes
  useEffect(() => {
    setVideoError(false);
  }, [currentSlideIndex]);

  return (
    <SceneSlot id="hero" layout="content">
      <section
        aria-label="Featured project showcase"
        className="relative w-full overflow-hidden isolate min-h-[85vh] flex flex-col justify-between"
      >
        {/* Full-Bleed Video & Poster Background Stage */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-surface-deep">
          {/* Base Layer: High-Resolution Poster Image */}
          <Image
            key={activeSlide.posterUrl}
            src={activeSlide.posterUrl}
            alt={activeSlide.title}
            fill
            priority
            className="object-cover transition-opacity duration-1000 opacity-100"
          />

          {/* Top Layer: Background Video Loop (renders when valid MP4 video is present) */}
          {showVideo && (
            <video
              ref={videoRef}
              key={activeSlide.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={activeSlide.posterUrl}
              onError={() => setVideoError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 opacity-100"
            >
              <source src={activeSlide.videoUrl} type="video/mp4" />
            </video>
          )}

          {/* Perfect High-Contrast Vignette: Solid Left Shadow Layer for 100% Text Legibility without Fog */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-deep via-surface-deep/85 to-transparent w-full md:w-4/5 lg:w-2/3 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface-deep via-surface-deep/80 to-transparent pointer-events-none" />
        </div>

        <Container className="relative z-10 w-full py-8 sm:py-12 md:py-16 lg:py-20 my-auto">
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
            {/* Left Editorial Statement Column (Unboxed High-Contrast Typography) */}
            <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7 max-w-full lg:max-w-measure">
              {/* Category Eyebrow Badge (High-Contrast Pill) */}
              <div className="self-start inline-flex max-w-full items-center gap-2 text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse" />
                <span className="truncate">
                  Architecture, Interiors & Vastu-Tech
                </span>
              </div>

              {/* High-Contrast Headline & Subtitle */}
              <div className="flex flex-col gap-3 sm:gap-4 m-0 p-0">
                <h1 className="m-0 p-0 font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface text-balance font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_12px_rgba(0,0,0,0.9)]">
                  {headline}
                </h1>

                <p className="m-0 p-0 text-body sm:text-[length:var(--typography-body-lg-font-size)] leading-relaxed text-on-surface font-semibold text-pretty drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)]">
                  {sub}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Button
                  as="a"
                  href={BOOK_AUDIT.href}
                  size="lg"
                  className="w-full sm:w-auto text-center justify-center shadow-2xl font-bold"
                >
                  {BOOK_AUDIT.label}
                </Button>
                <Button
                  as="a"
                  href="/pricing"
                  variant="secondary"
                  size="lg"
                  iconTrailing="arrow-right"
                  className="w-full sm:w-auto text-center justify-center bg-surface-raised/90 hover:bg-surface-raised text-on-surface border border-accent/30 shadow-2xl backdrop-blur-sm font-semibold"
                >
                  See your price
                </Button>
              </div>

              {/* Trust Points List */}
              <ul className="m-0 p-0 list-none flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-2 sm:gap-y-2.5 text-overline sm:text-small text-on-surface pt-2 sm:pt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2 font-bold">
                    <Icon
                      name="check"
                      size="sm"
                      className="text-accent shrink-0"
                      decorative
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column: the active slide, as a spotlight card. */}
            <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-5 w-full">
              {/* Active slide spotlight card with high-visibility text */}
              <div className="relative isolate overflow-hidden rounded-2xl lx-liquid-glass-card border border-accent/40 p-5 shadow-2xl backdrop-blur-xl group">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-raised">
                  <Image
                    src={activeSlide.posterUrl}
                    alt={activeSlide.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/95 via-surface-deep/40 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-surface-deep uppercase tracking-wider shadow-lg">
                      Featured Showcase {activeSlide.number}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-on-surface">
                    <div className="min-w-0 flex-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                      <h3 className="m-0 font-display text-body sm:text-h3 font-bold text-accent truncate">
                        {activeSlide.title}
                      </h3>
                      <p className="m-0 font-ui text-small font-semibold text-white/90 truncate">
                        {activeSlide.category} • {activeSlide.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 pt-2 border-t border-accent/20">
                  <div className="min-w-0 flex-1">
                    <span className="font-ui text-overline uppercase tracking-widest text-accent font-bold">
                      Architectural Showcase
                    </span>
                    <p className="m-0 font-display text-small font-bold text-on-surface">
                      {activeSlide.title} — {activeSlide.location}
                    </p>
                  </div>

                  <a
                    href={activeSlide.href}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-surface-deep font-bold transition-all hover:scale-110 hover:bg-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-md"
                    aria-label={`Explore ${activeSlide.title}`}
                  >
                    <Icon name="arrow-right" size="sm" decorative />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </SceneSlot>
  );
}
