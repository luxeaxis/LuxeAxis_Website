'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '../Button';
import { Container } from '../layout';
import { SceneSlot } from '../SceneSlot';
import { Icon } from '../Icon';
import { BOOK_AUDIT } from '@/lib/nav';

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
    href: '/portfolio/poes-garden-villa',
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
 * Gensler Flagship Hero Video Slider (Landing Blueprint §1, §3.1)
 * Features full-bleed architectural video background, auto-advancing slide timer,
 * slide progress indicators, play/pause controls, and poster image fallbacks.
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeSlide = HERO_SLIDES[currentSlideIndex]!;

  // Auto-slide timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, []);

  // Reset video error state whenever active slide changes
  useEffect(() => {
    setVideoError(false);
  }, [currentSlideIndex]);

  return (
    <SceneSlot id="hero" layout="content">
      <section aria-label="Gensler Architectural Hero Showcase" className="relative w-full overflow-hidden isolate min-h-[85vh] flex flex-col justify-between">
        
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
          {!videoError && (
            <video
              ref={videoRef}
              key={activeSlide.videoUrl}
              autoPlay
              muted
              loop
              playsInline
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
                <span className="truncate">Architecture, Interiors & Vastu-Tech</span>
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
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Button as="a" href={BOOK_AUDIT.href} size="lg" className="w-full xs:w-auto text-center justify-center shadow-2xl font-bold">
                  {BOOK_AUDIT.label}
                </Button>
                <Button
                  as="a"
                  href="/pricing"
                  variant="secondary"
                  size="lg"
                  iconTrailing="arrow-right"
                  className="w-full xs:w-auto text-center justify-center bg-surface-raised/90 hover:bg-surface-raised text-on-surface border border-accent/30 shadow-2xl backdrop-blur-sm font-semibold"
                >
                  See your price
                </Button>
              </div>

              {/* Trust Points List */}
              <ul className="m-0 p-0 list-none flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-2 sm:gap-y-2.5 text-overline sm:text-small text-on-surface pt-2 sm:pt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2 font-bold">
                    <Icon name="check" size="sm" className="text-accent shrink-0" decorative />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Gensler Video Showcase Spotlight Card */}
            <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-5 w-full">
              
              {/* Gensler Active Slide Spotlight Card */}
              <div className="relative isolate overflow-hidden rounded-xl bg-surface-deep/95 border border-accent/20 p-4 shadow-2xl backdrop-blur-md group">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface-raised">
                  <Image
                    src={activeSlide.posterUrl}
                    alt={activeSlide.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/90 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-overline font-bold text-accent-contrast uppercase tracking-wider shadow-md">
                      Featured Showcase {activeSlide.number}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 font-display text-small font-bold text-on-surface truncate">
                      {activeSlide.title}
                    </h3>
                    <p className="m-0 font-ui text-overline text-on-surface-2 truncate">
                      {activeSlide.category} • {activeSlide.location}
                    </p>
                  </div>
                  
                  <a
                    href={activeSlide.href}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent transition-all hover:bg-accent hover:text-accent-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
