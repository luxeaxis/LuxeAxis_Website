'use client';

import {
  useState,
  useRef,
  type KeyboardEvent,
  type TouchEvent,
  type MouseEvent,
} from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

type BeforeAfterSliderProps = {
  beforeImage: { src: string; alt: string };
  afterImage: { src: string; alt: string };
  aspect?: string;
  className?: string;
};

/**
 * Before/After Image Comparison Slider (Build Backlog T-16, Spec §3.4).
 *
 * Fully keyboard-accessible (`ArrowLeft`/`ArrowRight`, `Home`/`End`),
 * touch-enabled, and respects `prefers-reduced-motion`.
 */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  aspect = '16/9',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  if (reducedMotion) {
    return (
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
        <div
          className="relative overflow-hidden rounded-lg border border-border-subtle"
          style={{ aspectRatio: aspect }}
        >
          <Image
            src={beforeImage.src}
            alt={beforeImage.alt}
            fill
            className="object-cover"
          />
          <span className="absolute top-3 left-3 rounded bg-surface-deep/90 px-3 py-1 font-ui text-small font-semibold text-on-surface">
            Before
          </span>
        </div>
        <div
          className="relative overflow-hidden rounded-lg border border-border-subtle"
          style={{ aspectRatio: aspect }}
        >
          <Image
            src={afterImage.src}
            alt={afterImage.alt}
            fill
            className="object-cover"
          />
          <span className="absolute top-3 left-3 rounded bg-accent px-3 py-1 font-ui text-small font-semibold text-accent-contrast">
            After
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label="Before and after renovation comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative isolate w-full select-none overflow-hidden rounded-lg border border-border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {/* After Image (Full Background) */}
      <Image
        src={afterImage.src}
        alt={afterImage.alt}
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover"
      />
      <span className="absolute top-4 right-4 z-10 rounded bg-accent/90 px-3 py-1 font-ui text-small font-semibold text-accent-contrast shadow-sm">
        After
      </span>

      {/* Before Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image
          src={beforeImage.src}
          alt={beforeImage.alt}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover max-w-none"
        />
        <span className="absolute top-4 left-4 z-10 rounded bg-surface-deep/90 px-3 py-1 font-ui text-small font-semibold text-on-surface shadow-sm">
          Before
        </span>
      </div>

      {/* Divider Bar & Drag Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-accent shadow-[0_0_8px_rgba(201,168,76,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-surface-deep shadow-lg">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
