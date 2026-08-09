'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '../Icon';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export interface HeroBackgroundSlide {
  src: string;
  alt: string;
  /** Short description of the design shown, surfaced in the switcher badge. */
  label: string;
}

const SLIDE_DURATION_MS = 7500;

/**
 * Ken Burns move per slide, by position.
 *
 * These deliberately live here rather than beside the slide data in
 * `lib/content/heroSlides.ts`. The classes are declared in globals.css under
 * `@layer utilities`, which puts them inside Tailwind's purge, and
 * `tailwind.config.ts` scans only `app/`, `components/` and `features/` — a
 * class named from `lib/` is stripped from the stylesheet with no error
 * anywhere, leaving the markup correct and the hero motionless. Varying the
 * move was always positional anyway, so nothing is lost by deriving it from
 * the index.
 */
const KEN_BURNS_CYCLE = [
  'animate-ken-burns-zoom-in',
  'animate-ken-burns-pan',
  'animate-ken-burns-zoom-out',
] as const;

/**
 * The texture laid over the photography. This is the only thing that visually
 * distinguished the two page-specific background components this replaced, so
 * it is the only thing that stayed a variant: `dots` reads as a surveyor's
 * spatial grid, `grid` as a CAD wireframe.
 */
const OVERLAYS = {
  dots: {
    opacity: 'opacity-20',
    backgroundImage:
      'radial-gradient(circle at 1px 1px, rgba(255, 193, 7, 0.15) 1px, transparent 0)',
    backgroundSize: '40px 40px',
  },
  grid: {
    opacity: 'opacity-25',
    backgroundImage:
      'linear-gradient(to right, rgba(255, 193, 7, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 193, 7, 0.08) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },
} as const;

/**
 * Full-bleed Ken Burns background for a page hero, optionally cycling through
 * several images.
 *
 * ## Why auto-advance is a conditional, not a given
 *
 * WCAG 2.2.2 asks for pause/stop/hide on anything that moves on a timer for
 * more than five seconds, and these slides move every 7.5. Two things satisfy
 * it here: an explicit pause control that is reachable at every breakpoint
 * (the earlier version hid its controls below `sm`, which left the visitors
 * least able to absorb motion with no way to stop it), and `useReducedMotion`,
 * because the CSS safety net in globals.css can flatten the Ken Burns
 * transform but has no say over a `setInterval`.
 *
 * Only the active slide carries an animation class. `will-change: transform`
 * on an infinite animation promotes a full-bleed layer for the compositor's
 * lifetime, and there is no reason to pay that three times over for two images
 * sitting at `opacity: 0`.
 */
export function HeroBackground({
  slides,
  overlay = 'dots',
  controlsPosition = 'top-right',
}: {
  slides: readonly HeroBackgroundSlide[];
  overlay?: keyof typeof OVERLAYS;
  controlsPosition?: 'top-right' | 'bottom-right';
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const hasMultiple = slides.length > 1;
  const autoAdvance = hasMultiple && !paused && !reducedMotion;

  // `currentIndex` is a dependency so that choosing a slide by hand restarts
  // the clock — otherwise a visitor's pick could be overwritten a moment later
  // by a timer that was already most of the way through its interval.
  useEffect(() => {
    if (!autoAdvance) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [autoAdvance, currentIndex, slides.length]);

  const texture = OVERLAYS[overlay];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden isolate">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.src}
            aria-hidden={!isActive}
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
              className={`object-cover ${
                isActive ? KEN_BURNS_CYCLE[index % KEN_BURNS_CYCLE.length] : ''
              }`}
            />
          </div>
        );
      })}

      {/* Architectural texture over the photography */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none ${texture.opacity}`}
        style={{
          backgroundImage: texture.backgroundImage,
          backgroundSize: texture.backgroundSize,
        }}
      />

      {/* Ambient vignette & multi-stop contrast gradients for text legibility */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-surface-deep via-surface-deep/90 to-surface-deep/60 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-surface-deep via-surface-deep/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-surface-deep/80 to-transparent pointer-events-none" />

      {hasMultiple && (
        <div
          role="group"
          aria-label="Background image controls"
          className={`absolute z-30 flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full bg-surface-raised/90 border border-accent/40 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
            controlsPosition === 'top-right'
              ? 'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
          }`}
        >
          <span className="hidden sm:inline text-overline uppercase tracking-widest text-accent font-bold text-[10px]">
            {slides[currentIndex]?.label ?? ''}
          </span>

          {/* The dot is 6px of paint, but the button around it is 24px tall
              and never narrower than 24px — WCAG 2.5.8's target minimum
              measures the control, not the ink inside it. */}
          <div className="flex items-center">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={slide.label}
                aria-current={i === currentIndex ? 'true' : undefined}
                className="group/dot flex h-6 min-w-6 items-center justify-center px-1 focus-visible:outline-none"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-accent group-focus-visible/dot:ring-offset-2 group-focus-visible/dot:ring-offset-surface-raised ${
                    i === currentIndex
                      ? 'w-5 bg-accent'
                      : 'w-1.5 bg-on-surface-muted/40 group-hover/dot:bg-on-surface-muted'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Hidden under reduced motion: nothing is advancing, so a pause
              control would promise a stop that has already happened. */}
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              aria-pressed={paused}
              aria-label={
                paused
                  ? 'Resume background slideshow'
                  : 'Pause background slideshow'
              }
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-accent transition-colors hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon name={paused ? 'play' : 'pause'} size="sm" decorative />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
