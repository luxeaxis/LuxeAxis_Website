import React from 'react';

export interface PartnerLogoProps {
  className?: string;
}

export function HafeleLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 200 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Häfele logo"
    >
      <text
        x="0"
        y="34"
        fill="#E11D48"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="2"
      >
        HÄFELE
      </text>
      <rect x="0" y="42" width="168" height="4" fill="#E11D48" rx="1" />
    </svg>
  );
}

export function HettichLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 190 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hettich logo"
    >
      <text
        x="0"
        y="35"
        fill="#3B82F6"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="36"
        letterSpacing="-0.5"
      >
        Hettich
      </text>
      <rect x="156" y="10" width="16" height="16" fill="#E11D48" rx="2" />
    </svg>
  );
}

export function BlumLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Blum logo"
    >
      <rect x="0" y="6" width="36" height="36" fill="#EA580C" rx="4" />
      <text
        x="46"
        y="36"
        fill="currentColor"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="40"
        letterSpacing="-1"
      >
        blum
      </text>
    </svg>
  );
}

export function CenturyPlyLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 240 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CenturyPly logo"
    >
      <path
        d="M16 24L32 6L48 24L32 42Z"
        fill="#10B981"
      />
      <text
        x="58"
        y="26"
        fill="currentColor"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="22"
        letterSpacing="1"
      >
        CENTURY
      </text>
      <text
        x="58"
        y="44"
        fill="#3B82F6"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="3"
      >
        PLY
      </text>
    </svg>
  );
}

export function GreenplyLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 210 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Greenply logo"
    >
      <circle cx="20" cy="24" r="18" fill="#22C55E" />
      <path
        d="M20 12C20 12 28 18 28 26C28 30.4 24.4 34 20 34C15.6 34 12 30.4 12 26C12 18 20 12 20 12Z"
        fill="#059669"
      />
      <text
        x="48"
        y="35"
        fill="#22C55E"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="34"
        letterSpacing="-0.5"
      >
        Greenply
      </text>
    </svg>
  );
}

export function AsianPaintsLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 250 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Asian Paints logo"
    >
      <circle cx="16" cy="18" r="12" fill="#EF4444" opacity="0.9" />
      <circle cx="34" cy="18" r="12" fill="#EAB308" opacity="0.9" />
      <circle cx="25" cy="32" r="12" fill="#3B82F6" opacity="0.9" />
      <text
        x="56"
        y="34"
        fill="currentColor"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="-0.5"
      >
        asianpaints
      </text>
    </svg>
  );
}

export function BergerPaintsLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 210 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Berger Paints logo"
    >
      <path
        d="M10 36L18 12L28 26L38 12L46 36Z"
        fill="#F59E0B"
      />
      <text
        x="54"
        y="36"
        fill="#E11D48"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="36"
        letterSpacing="-0.5"
      >
        Berger
      </text>
    </svg>
  );
}

export function SaintGobainLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 260 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Saint-Gobain logo"
    >
      <path
        d="M8 38C8 20 22 6 40 6C58 6 72 20 72 38"
        stroke="#3B82F6"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M18 38C18 26 28 16 40 16C52 16 62 26 62 38"
        stroke="#EF4444"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text
        x="80"
        y="34"
        fill="currentColor"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="24"
        letterSpacing="1"
      >
        SAINT-GOBAIN
      </text>
    </svg>
  );
}

export function DupontCorianLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 240 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DuPont Corian logo"
    >
      <ellipse
        cx="40"
        cy="24"
        rx="36"
        ry="20"
        stroke="#E11D48"
        strokeWidth="3.5"
        fill="none"
      />
      <text
        x="13"
        y="30"
        fill="#E11D48"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="15"
        letterSpacing="1"
      >
        DUPONT
      </text>
      <text
        x="84"
        y="35"
        fill="currentColor"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="1"
      >
        CORIAN®
      </text>
    </svg>
  );
}

export function FevicolLogo({ className = 'h-7 w-auto' }: PartnerLogoProps) {
  return (
    <svg
      viewBox="0 0 210 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Fevicol logo"
    >
      <text
        x="0"
        y="35"
        fill="#1D4ED8"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="36"
        letterSpacing="0.5"
      >
        FEVICOL
      </text>
      <circle cx="185" cy="24" r="14" fill="#EA580C" />
    </svg>
  );
}
