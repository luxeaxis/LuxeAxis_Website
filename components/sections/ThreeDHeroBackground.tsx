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
    src: '/posters/residential-3d-design-hero.png',
    alt: 'V-Ray Ray-Traced 3D Living Room Interior Design Render in Chennai',
    label: 'Ray-Traced Villa Living 3D',
    animationClass: 'animate-ken-burns-zoom-in',
  },
  {
    src: '/posters/residential-3d-hero-slide-2.png',
    alt: '360 VR Master Bedroom Interior Architecture Visualisation',
    label: 'VR Master Suite Walkthrough',
    animationClass: 'animate-ken-burns-pan',
  },
  {
    src: '/posters/residential-3d-hero-slide-3.png',
    alt: 'Photorealistic Italian Marble & Lighting 3D Render',
    label: 'Turnkey Lighting & Material 3D',
    animationClass: 'animate-ken-burns-zoom-out',
  },
];

export function ThreeDHeroBackground({
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

      {/* Architectural Wireframe / Ray-Tracing Grid Overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 193, 7, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 193, 7, 0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
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
                aria-label={`View 3D render ${i + 1}`}
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
