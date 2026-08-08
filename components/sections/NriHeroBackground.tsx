'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface HeroSlide {
  src: string;
  alt: string;
  label: string;
  animationClass: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: '/posters/nri-hub-hero.png',
    alt: 'Turnkey Luxury Villa Interior Architecture in Chennai',
    label: 'Adyar Luxury Villa Fit-Out',
    animationClass: 'animate-ken-burns-zoom-in',
  },
  {
    src: '/posters/nri-hero-slide-2.png',
    alt: 'Bespoke Modern Living Room & Joinery Design',
    label: 'Boat Club Road Penthouse',
    animationClass: 'animate-ken-burns-pan',
  },
  {
    src: '/posters/nri-hero-slide-3.png',
    alt: 'Italian Marble & Custom Lighting Turnkey Fit-Out',
    label: 'ECR Beachfront Villa',
    animationClass: 'animate-ken-burns-zoom-out',
  },
];

export function NriHeroBackground({
  slides = DEFAULT_SLIDES,
}: {
  slides?: HeroSlide[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden isolate">
      {/* Slides with Ken Burns transition */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-40 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ${slide.animationClass}`}
            />
          </div>
        );
      })}

      {/* Architectural Spatial Grid Overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 193, 7, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Vignette & Multi-stop Contrast Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-surface-deep via-surface-deep/90 to-surface-deep/60 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-surface-deep via-surface-deep/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-surface-deep/80 to-transparent pointer-events-none" />

      {/* Slide Switcher Control Badge */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-30 hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-surface-raised/80 border border-accent/30 backdrop-blur-md shadow-xl">
          <span className="text-overline uppercase tracking-widest text-accent font-bold text-[10px]">
            {slides[currentIndex]?.label ?? ''}
          </span>
          <div className="flex items-center gap-1.5 ml-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`View background ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-5 bg-accent'
                    : 'w-1.5 bg-on-surface-muted/40 hover:bg-on-surface-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
